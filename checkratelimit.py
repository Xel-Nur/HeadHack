import requests
from datetime import datetime
# Configuration
GITHUB_API_URL = "https://api.github.com/rate_limit"
ACCESS_TOKEN = None  # Replace with your GitHub personal access token if you have one

def check_rate_limit():
    headers = {}
    if ACCESS_TOKEN:
        headers = {"Authorization": f"token {ACCESS_TOKEN}"}
    
    response = requests.get(GITHUB_API_URL, headers=headers)
    
    if response.status_code == 200:
        rate_limit_data = response.json()
        core_limit = rate_limit_data['rate']['limit']
        core_remaining = rate_limit_data['rate']['remaining']
        reset_time = rate_limit_data['rate']['reset']

        print(f"Rate Limit: {core_limit}")
        print(f"Remaining Requests: {core_remaining}")
        print(f"Rate Limit Resets at: {datetime.fromtimestamp(reset_time)}")
    else:
        print(f"Failed to check rate limit: {response.status_code} - {response.text}")

if __name__ == "__main__":
    check_rate_limit()
