#!/usr/bin/env python3
"""Fast HubFit Client Status Check - No program/plan details."""
import sys
import os
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(__file__))
from hubfit_client import HubFitClient

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2ODRhOWMyMzQ1ZjM3ZjVhOGUxNDU0YTgiLCJmdWxsTmFtZSI6IkhpbWFuc2h1IFNoYXJtYSIsInVzdGF0dXMiOiJub3JtYWwiLCJ3b3Jrc3BhY2VJZCI6IjY4NGE5YzIzNDVmMzdmNWE4ZTE0NTRhOCIsImlzc3VlZEF0IjoxNzcwNzA1OTQ4NDI5LCJpYXQiOjE3NzA3MDU5NDgsImV4cCI6MTgwMjI0MTk0OH0.bwZ0C4nwHIr4s7us3-JIsDnwHIldTqhOHj8noJ-sZZs"
IST = timezone(timedelta(hours=5, minutes=30))
NOW = datetime.now(IST)

def parse_ts(val):
    """Parse timestamp to datetime."""
    if not val:
        return None
    if isinstance(val, (int, float)):
        if val > 1e12:  # ms
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

def categorize(last_checkin_days, archived, sub_days_left):
    if archived:
        return "💤 Archived"
    if sub_days_left is not None and 0 < sub_days_left <= 14:
        return "⏰ Expiring Soon"
    if last_checkin_days is None:
        return "🔴 Ghosting"
    if last_checkin_days <= 3:
        return "🟢 Active"
    if last_checkin_days <= 7:
        return "🟡 At Risk"
    return "🔴 Ghosting"

def main():
    print("🚀 Fast HubFit Status Check")
    print("=" * 40)
    
    client = HubFitClient(TOKEN)
    
    print("Fetching clients...")
    clients = client.get_clients()
    print(f"✓ {len(clients)} clients found")
    
    categories = {
        "🟢 Active": 0,
        "🟡 At Risk": 0,
        "🔴 Ghosting": 0,
        "⏰ Expiring Soon": 0,
        "💤 Archived": 0
    }
    
    ghosting_14plus = []
    
    print("\nAnalyzing...")
    for c in clients:
        name = c.get("fullName") or c.get("name") or c.get("email", "Unknown")
        archived = c.get("archived", False) or c.get("isArchived", False)
        last_checkin = parse_ts(c.get("lastCheckinTime") or c.get("lastCheckin"))
        last_active = parse_ts(c.get("lastActive") or c.get("lastActiveTime"))
        end = parse_ts(c.get("endDate"))
        
        # Use most recent activity
        latest = last_checkin or last_active
        days = days_since(latest)
        
        sub_left = (end - NOW).days if end and end > NOW else (0 if end else None)
        
        category = categorize(days, archived, sub_left)
        categories[category] += 1
        
        if category == "🔴 Ghosting" and days and days > 14:
            ghosting_14plus.append((name, days))
    
    print("\n📊 QUICK STATUS")
    print("=" * 40)
    total = sum(categories.values())
    for cat, count in categories.items():
        if count > 0:
            pct = (count / total) * 100
            print(f"{cat}: {count} ({pct:.1f}%)")
    
    print(f"\n📈 Total Clients: {total}")
    
    if ghosting_14plus:
        print(f"\n⚠️  URGENT: {len(ghosting_14plus)} clients ghosting >14 days")
        print("Top 5 by inactivity:")
        ghosting_14plus.sort(key=lambda x: x[1], reverse=True)
        for name, days in ghosting_14plus[:5]:
            print(f"  • {name}: {days} days")
    
    # Save to file - using /mnt/data handoff pattern
    output_path = f"/home/assistant4himanshu/.openclaw/workspace/mnt/data/reports/hubfit-quick-{NOW.strftime('%Y-%m-%d-%H%M')}.md"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w") as f:
        f.write(f"# HubFit Quick Status - {NOW.strftime('%d %b %Y, %H:%M')}\n\n")
        f.write("## Summary\n")
        f.write("| Status | Count | % |\n")
        f.write("|--------|-------|---|\n")
        for cat, count in categories.items():
            if count > 0:
                pct = (count / total) * 100
                f.write(f"| {cat} | {count} | {pct:.1f}% |\n")
        
        f.write(f"\n**Total Clients:** {total}\n")
        
        if ghosting_14plus:
            f.write(f"\n## ⚠️  Urgent Follow-up Needed\n")
            f.write(f"{len(ghosting_14plus)} clients ghosting >14 days:\n\n")
            f.write("| Client | Days Inactive |\n")
            f.write("|--------|--------------|\n")
            for name, days in sorted(ghosting_14plus, key=lambda x: x[1], reverse=True)[:10]:
                f.write(f"| {name} | {days} |\n")
    
    print(f"\n✅ Report saved to: {output_path}")
    return 0

if __name__ == "__main__":
    sys.exit(main())