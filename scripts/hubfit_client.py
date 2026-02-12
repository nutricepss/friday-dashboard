"""HubFit API client module — reusable."""
import requests
import time
from typing import Optional, Dict, Any
from datetime import datetime

BASE_URL = "https://app.hubfit.com/api"
DEFAULT_HEADERS = {
    "x-app-version": "1.0.0",
    "x-client-platform": "web",
    "x-lib-version": "2.0.0",
}

class HubFitClient:
    def __init__(self, token: str):
        self.session = requests.Session()
        self.session.headers.update({**DEFAULT_HEADERS, "x-access-token": token})
        self.last_request_time = 0
        self.request_delay = 0.1  # 100ms between requests to avoid rate limiting

    def _rate_limit(self):
        """Simple rate limiting to avoid overwhelming the API."""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.request_delay:
            time.sleep(self.request_delay - elapsed)
        self.last_request_time = time.time()

    def _get(self, path: str, params: Optional[dict] = None, max_retries: int = 3) -> Dict[str, Any]:
        """Make GET request with retry logic and error handling."""
        self._rate_limit()
        
        for attempt in range(max_retries):
            try:
                r = self.session.get(f"{BASE_URL}{path}", params=params, timeout=30)
                r.raise_for_status()
                return r.json()
            except requests.exceptions.Timeout:
                if attempt == max_retries - 1:
                    raise Exception(f"Timeout after {max_retries} attempts for {path}")
                time.sleep(2 ** attempt)  # Exponential backoff
            except requests.exceptions.ConnectionError:
                if attempt == max_retries - 1:
                    raise Exception(f"Connection error after {max_retries} attempts for {path}")
                time.sleep(2 ** attempt)
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 401:
                    raise Exception("Authentication failed: Invalid or expired token")
                elif e.response.status_code == 429:
                    wait_time = 5 * (attempt + 1)
                    print(f"Rate limited, waiting {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                else:
                    raise Exception(f"HTTP error {e.response.status_code}: {e.response.text}")
            except Exception as e:
                if attempt == max_retries - 1:
                    raise Exception(f"Failed after {max_retries} attempts: {str(e)}")
                time.sleep(2 ** attempt)
        
        raise Exception(f"Unexpected error after {max_retries} attempts")

    def get_clients(self) -> list:
        """Fetch all clients with error handling."""
        try:
            data = self._get("/coach/clients")
            if isinstance(data, dict) and "clients" in data:
                return data["clients"]
            return data if isinstance(data, list) else []
        except Exception as e:
            print(f"Error fetching clients: {e}")
            return []

    def get_training_programs(self, client_id: str) -> list:
        """Fetch training programs for a client."""
        try:
            data = self._get("/training/programs/client", {"clientId": client_id})
            if isinstance(data, dict) and "programs" in data:
                return data["programs"]
            return data if isinstance(data, list) else []
        except Exception as e:
            print(f"Error fetching training programs for {client_id}: {e}")
            return []

    def get_nutrition_plan(self, client_id: str) -> list:
        """Fetch nutrition plan for a client."""
        try:
            data = self._get("/nutrition/plan", {"clientId": client_id})
            if isinstance(data, dict) and "mealPlans" in data:
                return data["mealPlans"]
            return data if isinstance(data, list) else []
        except Exception as e:
            print(f"Error fetching nutrition plan for {client_id}: {e}")
            return []
    
    def get_client_measurements(self, client_id: str) -> list:
        """Fetch client measurements if needed for future enhancements."""
        try:
            data = self._get(f"/client/measurements/{client_id}")
            return data if isinstance(data, list) else []
        except Exception:
            return []
