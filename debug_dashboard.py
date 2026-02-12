import sys
import os
sys.path.insert(0, 'scripts')

from hubfit_client import HubFitClient
from datetime import datetime, timezone, timedelta
import json

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

print("Creating client...")
client = HubFitClient(TOKEN)

print("Fetching clients...")
try:
    clients = client.get_clients()
    print(f"  → {len(clients)} clients found")
    print(f"  → First client: {json.dumps(clients[0] if clients else {}, indent=2)[:500]}")
except Exception as e:
    print(f"Error fetching clients: {e}")
    import traceback
    traceback.print_exc()

# Test one client
if clients:
    print("\nTesting one client...")
    c = clients[0]
    cid = c.get("_id") or c.get("id") or c.get("clientId", "")
    print(f"Client ID: {cid}")
    print(f"Client data: {json.dumps(c, indent=2)[:1000]}")