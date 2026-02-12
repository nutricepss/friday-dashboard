import sys
sys.path.insert(0, 'scripts')
from hubfit_client import HubFitClient
import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2ODRhOWMyMzQ1ZjM3ZjVhOGUxNDU0YTgiLCJmdWxsTmFtZSI6IkhpbWFuc2h1IFNoYXJtYSIsInVzdGF0dXMiOiJub3JtYWwiLCJ3b3Jrc3BhY2VJZCI6IjY4NGE5YzIzNDVmMzdmNWE4ZTE0NTRhOCIsImlzc3VlZEF0IjoxNzcwNzA1OTQ4NDI5LCJpYXQiOjE3NzA3MDU5NDgsImV4cCI6MTgwMjI0MTk0OH0.bwZ0C4nwHIr4s7us3-JIsDnwHIldTqhOHj8noJ-sZZs'
client = HubFitClient(token)
print('Testing connection...')
try:
    r = client.session.get('https://app.hubfit.com/api/coach/clients', timeout=10)
    print(f'Status: {r.status_code}')
    print(f'Response: {r.text[:200]}')
except Exception as e:
    print(f'Error: {e}')