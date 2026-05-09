import requests

API_KEY = "Caipnejk8nsvV6Rt4uUlXgllrDiw2U0aWI-8gJPQMpp7"

# Step 1 - get access token
token_response = requests.post(
    "https://iam.cloud.ibm.com/identity/token",
    data={
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": API_KEY
    },
    headers={"Content-Type": "application/x-www-form-urlencoded"}
)

token = token_response.json().get("access_token")
print("Token received:", token[:20], "...")

# Step 2 - call Granite
PROJECT_ID = "9c863c47-4e48-4b8b-a42d-46ce6669067e"

response = requests.post(
    "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29",
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    },
    json={
        "model_id": "ibm/granite-13b-instruct-v2",
        "input": "Extract medication names from: Metformin 500mg, qty 90, $94.00",
        "project_id": PROJECT_ID,
        "parameters": {"max_new_tokens": 100}
    }
)

print(response.json())