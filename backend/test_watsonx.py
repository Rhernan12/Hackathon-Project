import os
from dotenv import load_dotenv
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference

load_dotenv()

credentials = Credentials(
    url="https://ca-tor.ml.cloud.ibm.com",
    api_key=os.getenv("WATSONX_API_KEY")
)

client = APIClient(credentials)

model = ModelInference(
    model_id="ibm/granite-13b-instruct-v2",
    credentials=credentials,
    project_id=os.getenv("WATSONX_PROJECT_ID")
)

response = model.generate_text(
    prompt="Extract medication names from this text: Metformin 500mg, qty 90, $94.00"
)
print(response)