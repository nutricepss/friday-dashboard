#!/usr/bin/env python3
"""HubFit Client Adherence Dashboard — generates markdown report."""
import argparse, json, sys, os
from datetime import datetime, timezone, timedelta
from pathlib import Path
import hashlib

sys.path.insert(0, os.path.dirname(__file__))
from hubfit_client import HubFitClient

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2ODRhOWMyMzQ1ZjM3ZjVhOGUxNDU0YTgiLCJmdWxsTmFtZSI6IkhpbWFuc2h1IFNoYXJtYSIsInVzdGF0dXMiOiJub3JtYWwiLCJ3b3Jrc3BhY2VJZCI6IjY4NGE5YzIzNDVmMzdmNWE4ZTE0NTRhOCIsImlzc3VlZEF0IjoxNzcwNzA1OTQ4NDI5LCJpYXQiOjE3NzA3MDU5NDgsImV4cCI6MTgwMjI0MTk0OH0.bwZ0C4nwHIr4s7us3-JIsDnwHIldTqhOHj8noJ-sZZs"
IST = timezone(timedelta(hours=5, minutes=30))
NOW = datetime.now(IST)

def parse_ts(val):
    """Parse various timestamp formats to datetime."""
    if not val:
        return None
    if isinstance(val, (int, float)):
        # ms epoch
        if val > 1e12:
            val = val / 1000
        return datetime.fromtimestamp(val, tz=timezone.utc).astimezone(IST)
    if isinstance(val, str):
        for fmt in ("%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d"):
            try:
                return datetime.strptime(val, fmt).replace(tzinfo=timezone.utc).astimezone(IST)
            except ValueError:
                continue
    return None

def days_since(dt):
    if not dt:
        return None
    return (NOW - dt).days

def categorize(client_row):
    if client_row["archived"]:
        return "💤 Archived"
    if client_row["sub_days_left"] is not None and 0 < client_row["sub_days_left"] <= 14:
        return "⏰ Expiring Soon"
    d = client_row["days_since_checkin"]
    if d is None:
        return "🔴 Ghosting"
    if d <= 3:
        return "🟢 Active"
    if d <= 7:
        return "🟡 At Risk"
    return "🔴 Ghosting"

def fmt_date(dt):
    return dt.strftime("%d %b %Y") if dt else "—"

def fmt_days(d):
    return str(d) if d is not None else "—"

def save_json_data(data_dir, rows, timestamp):
    """Save current run data as JSON for future comparison."""
    Path(data_dir).mkdir(parents=True, exist_ok=True)
    
    # Create a simplified version for comparison
    simplified = []
    for r in rows:
        simplified.append({
            "name": r["name"],
            "status": r["status"],
            "days_since_checkin": r["days_since_checkin"],
            "sub_days_left": r["sub_days_left"],
            "archived": r["archived"],
            "last_checkin": r["last_checkin"].isoformat() if r["last_checkin"] else None,
            "sub_end": r["sub_end"].isoformat() if r["sub_end"] else None
        })
    
    filename = f"hubfit_data_{timestamp.strftime('%Y%m%d_%H%M%S')}.json"
    filepath = Path(data_dir) / filename
    with open(filepath, 'w') as f:
        json.dump({
            "timestamp": timestamp.isoformat(),
            "data": simplified,
            "summary": {
                "total": len(rows),
                "active": sum(1 for r in rows if r["status"] == "🟢 Active"),
                "at_risk": sum(1 for r in rows if r["status"] == "🟡 At Risk"),
                "ghosting": sum(1 for r in rows if r["status"] == "🔴 Ghosting"),
                "expiring": sum(1 for r in rows if r["status"] == "⏰ Expiring Soon"),
                "archived": sum(1 for r in rows if r["archived"])
            }
        }, f, indent=2)
    
    # Also create a latest.json symlink/reference
    latest_path = Path(data_dir) / "latest.json"
    with open(latest_path, 'w') as f:
        json.dump({"current_file": filename}, f)
    
    return filepath

def load_previous_data(data_dir):
    """Load the most recent previous run data."""
    latest_path = Path(data_dir) / "latest.json"
    if not latest_path.exists():
        return None
    
    try:
        with open(latest_path, 'r') as f:
            latest_info = json.load(f)
        prev_file = Path(data_dir) / latest_info.get("current_file", "")
        if not prev_file.exists():
            return None
        
        with open(prev_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load previous data: {e}")
        return None

def compare_with_previous(current_rows, previous_data):
    """Compare current data with previous run to identify changes."""
    if not previous_data:
        return {"new_ghosting": [], "re_engaged": [], "status_changes": []}
    
    # Create lookup dictionaries
    prev_by_name = {}
    for item in previous_data.get("data", []):
        prev_by_name[item["name"]] = item
    
    current_by_name = {r["name"]: r for r in current_rows}
    
    new_ghosting = []
    re_engaged = []
    status_changes = []
    
    for name, current in current_by_name.items():
        if name not in prev_by_name:
            continue  # New client, skip for trend analysis
        
        prev = prev_by_name[name]
        
        # Check for status changes
        if current["status"] != prev["status"]:
            status_changes.append({
                "name": name,
                "from": prev["status"],
                "to": current["status"]
            })
        
        # Check for new ghosting (was active/at_risk, now ghosting)
        was_active = prev["status"] in ["🟢 Active", "🟡 At Risk"]
        now_ghosting = current["status"] == "🔴 Ghosting"
        if was_active and now_ghosting:
            new_ghosting.append({
                "name": name,
                "days_since": current["days_since_checkin"]
            })
        
        # Check for re-engagement (was ghosting, now active/at_risk)
        was_ghosting = prev["status"] == "🔴 Ghosting"
        now_active = current["status"] in ["🟢 Active", "🟡 At Risk"]
        if was_ghosting and now_active:
            re_engaged.append({
                "name": name,
                "days_since": current["days_since_checkin"]
            })
    
    return {
        "new_ghosting": new_ghosting,
        "re_engaged": re_engaged,
        "status_changes": status_changes
    }

def get_high_priority_alerts(rows):
    """Identify high priority alerts based on thresholds."""
    alerts = []
    
    for r in rows:
        # Skip archived clients
        if r["archived"]:
            continue
        
        alert_types = []
        
        # Ghosting > 14 days
        if r["days_since_checkin"] is not None and r["days_since_checkin"] > 14:
            alert_types.append(("long_ghosting", r["days_since_checkin"]))
        
        # Subscription expiring < 7 days
        if r["sub_days_left"] is not None and 0 < r["sub_days_left"] < 7:
            alert_types.append(("expiring_soon", r["sub_days_left"]))
        
        # Create a combined alert if multiple types
        if alert_types:
            # Sort by severity: long_ghosting first, then expiring_soon
            alert_types.sort(key=lambda x: 0 if x[0] == "long_ghosting" else 1)
            
            # Use the most severe alert
            alert_type, value = alert_types[0]
            if alert_type == "long_ghosting":
                alerts.append({
                    "name": r["name"],
                    "type": alert_type,
                    "days": value,
                    "priority": "HIGH"
                })
            else:  # expiring_soon
                alerts.append({
                    "name": r["name"],
                    "type": alert_type,
                    "days_left": value,
                    "priority": "HIGH"
                })
    
    # Sort by priority/severity
    alerts.sort(key=lambda x: (
        0 if x["type"] == "long_ghosting" else 1,  # Long ghosting first
        -x.get("days", 0) if "days" in x else x.get("days_left", 0)  # More severe first
    ))
    
    return alerts

def main():
    parser = argparse.ArgumentParser(description="HubFit Adherence Dashboard")
    parser.add_argument("--output", "-o", help="Output markdown file path")
    parser.add_argument("--token", default=TOKEN, help="JWT token")
    parser.add_argument("--data-dir", default="workspace/data/hubfit", 
                       help="Directory to save JSON data (default: workspace/data/hubfit)")
    parser.add_argument("--history", action="store_true",
                       help="Enable trend tracking by comparing with previous run")
    args = parser.parse_args()

    client = HubFitClient(args.token)

    print("Fetching clients...")
    clients = client.get_clients()
    print(f"  → {len(clients)} clients found")

    rows = []
    for i, c in enumerate(clients):
        cid = c.get("_id") or c.get("id") or c.get("clientId", "")
        name = c.get("fullName") or c.get("name") or c.get("email", "Unknown")
        archived = c.get("archived", False) or c.get("isArchived", False)
        last_checkin = parse_ts(c.get("lastCheckinTime") or c.get("lastCheckin"))
        last_active = parse_ts(c.get("lastActive") or c.get("lastActiveTime"))
        start = parse_ts(c.get("startDate"))
        end = parse_ts(c.get("endDate"))
        sub_left = (end - NOW).days if end and end > NOW else (0 if end else None)

        # Fetch programs & plans
        programs = client.get_training_programs(cid) if cid else []
        plans = client.get_nutrition_plan(cid) if cid else []

        prog_names = []
        for p in programs[:3]:
            n = p.get("name") or p.get("programName") or p.get("title", "")
            if n:
                prog_names.append(n)
        plan_names = []
        for p in plans[:3]:
            n = p.get("name") or p.get("planName") or p.get("title", "")
            if n:
                plan_names.append(n)

        has_program = "✅" if programs else "❌"
        has_plan = "✅" if plans else "❌"
        plan_detail = f"W:{has_program} M:{has_plan}"

        row = {
            "name": name,
            "archived": archived,
            "last_checkin": last_checkin,
            "last_active": last_active,
            "days_since_checkin": days_since(last_checkin),
            "days_since_active": days_since(last_active),
            "sub_end": end,
            "sub_days_left": sub_left,
            "plan_detail": plan_detail,
            "prog_names": ", ".join(prog_names) if prog_names else "—",
            "plan_names": ", ".join(plan_names) if plan_names else "—",
        }
        row["status"] = categorize(row)
        rows.append(row)

        if (i + 1) % 10 == 0:
            print(f"  Processed {i+1}/{len(clients)}...")

    # Sort: most overdue first (None = infinity)
    rows.sort(key=lambda r: (0 if r["archived"] else 1, -(r["days_since_checkin"] if r["days_since_checkin"] is not None else 9999)))

    # Stats
    counts = {}
    for r in rows:
        s = r["status"]
        counts[s] = counts.get(s, 0) + 1

    active = counts.get("🟢 Active", 0)
    at_risk = counts.get("🟡 At Risk", 0)
    ghosting = counts.get("🔴 Ghosting", 0)
    expiring = counts.get("⏰ Expiring Soon", 0)
    archived = counts.get("💤 Archived", 0)

    # Data persistence
    data_dir = args.data_dir
    if not Path(data_dir).is_absolute():
        data_dir = str(Path(__file__).parent.parent / data_dir)
    
    saved_file = save_json_data(data_dir, rows, NOW)
    print(f"Data saved to: {saved_file}")
    
    # Trend tracking (if enabled)
    trend_info = None
    if args.history:
        previous_data = load_previous_data(data_dir)
        if previous_data:
            trend_info = compare_with_previous(rows, previous_data)
            print(f"Trend analysis: {len(trend_info['new_ghosting'])} new ghosting, "
                  f"{len(trend_info['re_engaged'])} re-engaged")
        else:
            print("No previous data found for trend analysis")
            trend_info = {"new_ghosting": [], "re_engaged": [], "status_changes": []}
    
    # High priority alerts
    alerts = get_high_priority_alerts(rows)
    
    # Build report
    date_str = NOW.strftime("%Y-%m-%d")
    lines = [
        f"# HubFit Client Adherence Dashboard",
        f"**Generated:** {NOW.strftime('%d %b %Y, %I:%M %p IST')}",
        "",
        "## Summary",
        f"| Metric | Count |",
        f"|--------|-------|",
        f"| 🟢 Active (≤3 days) | {active} |",
        f"| 🟡 At Risk (4-7 days) | {at_risk} |",
        f"| 🔴 Ghosting (>7 days) | {ghosting} |",
        f"| ⏰ Expiring Soon (<14d) | {expiring} |",
        f"| 💤 Archived | {archived} |",
        f"| **Total** | **{len(rows)}** |",
    ]
    
    # Add high priority alerts section
    if alerts:
        lines.extend([
            "",
            "## ⚠️ High Priority Alerts",
            "",
            "| Client | Issue | Days | Priority |",
            "|--------|-------|------|----------|",
        ])
        for alert in alerts:
            if alert["type"] == "long_ghosting":
                lines.append(f"| {alert['name']} | Ghosting >14 days | {alert['days']} days | {alert['priority']} |")
            else:  # expiring_soon
                lines.append(f"| {alert['name']} | Subscription expiring | {alert['days_left']} days left | {alert['priority']} |")
    
    # Add trend analysis section if enabled
    if args.history and trend_info:
        lines.extend([
            "",
            "## 📈 Trend Analysis",
        ])
        
        if trend_info["new_ghosting"]:
            lines.extend([
                "",
                "### 🔴 New Ghosting Clients",
                "",
                "| Client | Days Since Check-in |",
                "|--------|---------------------|",
            ])
            for item in trend_info["new_ghosting"]:
                lines.append(f"| {item['name']} | {item['days_since']} days |")
        
        if trend_info["re_engaged"]:
            lines.extend([
                "",
                "### 🟢 Re-engaged Clients",
                "",
                "| Client | Days Since Check-in |",
                "|--------|---------------------|",
            ])
            for item in trend_info["re_engaged"]:
                lines.append(f"| {item['name']} | {item['days_since']} days |")
        
        if trend_info["status_changes"]:
            lines.extend([
                "",
                "### 🔄 Status Changes",
                "",
                "| Client | From → To |",
                "|--------|-----------|",
            ])
            for item in trend_info["status_changes"]:
                lines.append(f"| {item['name']} | {item['from']} → {item['to']} |")
    
    lines.extend([
        "",
        "## Client Details",
        "",
        "| # | Name | Last Check-in | Last Active | Days Since | Status | Plans | Sub Ends |",
        "|---|------|--------------|-------------|------------|--------|-------|----------|",
    ])

    for i, r in enumerate(rows, 1):
        lines.append(
            f"| {i} | {r['name']} | {fmt_date(r['last_checkin'])} | {fmt_date(r['last_active'])} "
            f"| {fmt_days(r['days_since_checkin'])} | {r['status']} | {r['plan_detail']} | {fmt_date(r['sub_end'])} |"
        )

    lines += ["", "---", f"*Report generated by hubfit_dashboard.py*"]
    report = "\n".join(lines)

    # Output
    out_path = args.output or str(Path(__file__).parent.parent / "reports" / f"hubfit-adherence-{date_str}.md")
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(report)

    print(f"\n{'='*50}")
    print(f"HUBFIT ADHERENCE REPORT — {date_str}")
    print(f"{'='*50}")
    print(f"🟢 Active: {active}  🟡 At Risk: {at_risk}  🔴 Ghosting: {ghosting}")
    print(f"⏰ Expiring: {expiring}  💤 Archived: {archived}  Total: {len(rows)}")
    
    if alerts:
        print(f"\n⚠️  HIGH PRIORITY ALERTS ({len(alerts)}):")
        for alert in alerts[:5]:  # Show top 5
            if alert["type"] == "long_ghosting":
                print(f"  • {alert['name']}: Ghosting {alert['days']} days")
            else:
                print(f"  • {alert['name']}: Subscription expires in {alert['days_left']} days")
        if len(alerts) > 5:
            print(f"  ... and {len(alerts) - 5} more")
    
    if args.history and trend_info:
        print(f"\n📈 TREND ANALYSIS:")
        if trend_info["new_ghosting"]:
            print(f"  🔴 New ghosting: {len(trend_info['new_ghosting'])} clients")
        if trend_info["re_engaged"]:
            print(f"  🟢 Re-engaged: {len(trend_info['re_engaged'])} clients")
    
    print(f"\nReport saved: {out_path}")
    print(f"Data saved: {saved_file}")

    return 0

if __name__ == "__main__":
    sys.exit(main())
