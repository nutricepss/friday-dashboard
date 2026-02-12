import sys
import os
sys.path.insert(0, 'scripts')

from hubfit_client import HubFitClient
import json

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2ODRhOWMyMzQ1ZjM3ZjVhOGUxNDU0YTgiLCJmdWxsTmFtZSI6IkhpbWFuc2h1IFNoYXJtYSIsInVzdGF0dXMiOiJub3JtYWwiLCJ3b3Jrc3BhY2VJZCI6IjY4NGE5YzIzNDVmMzdmNWE4ZTE0NTRhOCIsImlzc3VlZEF0IjoxNzcwNzA1OTQ4NDI5LCJpYXQiOjE3NzA3MDU5NDgsImV4cCI6MTgwMjI0MTk0OH0.bwZ0C4nwHIr4s7us3-JIsDnwHIldTqhOHj8noJ-sZZs"

print("Creating client...")
client = HubFitClient(TOKEN)

print("Fetching clients...")
clients = client.get_clients()
print(f"  → {len(clients)} clients found")

# Test first few clients
for i, c in enumerate(clients[:3]):
    cid = c.get("_id") or c.get("id") or c.get("clientId", "")
    name = c.get("name") or c.get("fullName", "Unknown")
    print(f"\n{i+1}. {name} (ID: {cid})")
    
    print("  Fetching training programs...")
    try:
        programs = client.get_training_programs(cid)
        print(f"    → {len(programs)} programs")
        if programs:
            print(f"    → First program: {json.dumps(programs[0], indent=2)[:300]}")
    except Exception as e:
        print(f"    → Error: {e}")
    
    print("  Fetching nutrition plans...")
    try:
        plans = client.get_nutrition_plan(cid)
        print(f"    → {len(plans)} plans")
        if plans:
            print(f"    → First plan: {json.dumps(plans[0], indent=2)[:300]}")
    except Exception as e:
        print(f"    → Error: {e}")