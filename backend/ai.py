import os
import json
from groq import Groq
from dotenv import load_dotenv
from coverage import check_coverage

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_prescription(ocr_text: str, province: str) -> dict:
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{
            "role": "user",
            "content": f"""Extract prescription details from this pharmacy receipt.
Return JSON only, no markdown, no explanation:

Receipt text: {ocr_text}

Return exactly this structure:
{{
    "drug_name": "name and dosage",
    "brand_cost": 0.00,
    "insurance_pct": 70
}}

If values not found use: brand_cost=94.00, insurance_pct=70"""
        }],
        temperature=0.1
    )

    text = response.choices[0].message.content
    clean = text.replace("```json", "").replace("```", "").strip()
    drug_data = json.loads(clean)

    coverage = check_coverage(
        drug_name=drug_data["drug_name"],
        brand_cost=drug_data["brand_cost"],
        insurance_pct=drug_data["insurance_pct"],
        province=province
    )

    return {**drug_data, **coverage}

def parse_booklet(ocr_text: str) -> dict:
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{
            "role": "user",
            "content": f"""Extract insurance coverage details from this benefit booklet.
Return JSON only, no markdown:

Booklet text: {ocr_text}

Return exactly:
{{
    "coverage_percentage": 70,
    "max_annual": 5000,
    "deductible": 200,
    "exclusions": ["cosmetic", "experimental"],
    "dental_covered": true,
    "vision_covered": true,
    "prescription_covered": true
}}"""
        }],
        temperature=0.1
    )

    text = response.choices[0].message.content
    clean = text.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)