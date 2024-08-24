import requests

# Configuration
GITHUB_API_URL = "https://api.github.com"
REPO_OWNER = "langchain-ai"  # Replace with the repository owner's username
REPO_NAME = "langchain"  # Replace with the repository name

def get_commit_history(owner, repo):
    commits_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/commits"
    
    response = requests.get(commits_url)
    
    if response.status_code == 200:
        commits = response.json()
        for commit in commits:
            commit_message = commit['commit']['message']
            commit_url = commit['url']
            
            # Fetch detailed commit information including the diff
            commit_response = requests.get(commit_url)
            if commit_response.status_code == 200:
                commit_data = commit_response.json()
                files_changed = commit_data.get('files', [])
                
                print(f"Commit: {commit_message}")
                print("Files changed:")
                
                for file in files_changed:
                    filename = file['filename']
                    patch = file.get('patch', 'No changes detected (binary or large file)')
                    print(f"File: {filename}")
                    print(f"Patch:\n{patch}")
                    print("-" * 50)
            else:
                print(f"Failed to retrieve commit details: {commit_response.status_code} - {commit_response.text}")
            print("=" * 100)
    else:
        print(f"Failed to retrieve commits: {response.status_code} - {response.text}")

if __name__ == "__main__":
    get_commit_history(REPO_OWNER, REPO_NAME)
