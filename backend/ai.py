import os
import json
from groq import Groq
from coverage import check_coverage

def extract_json(text: str) -> dict:
    """Robustly extract JSON from LLM response"""
    # remove markdown code blocks
    clean = text.replace("```json", "").replace("```", "").strip()
    
    # find the first { and last } and extract just that
    start = clean.find("{")
    end = clean.rfind("}") + 1
    
    if start == -1 or end == 0:
        return {}
    
    json_str = clean[start:end]
    print("DEBUG JSON:", json_str)
    return json.loads(json_str)

client = Groq(api_key='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')

def analyze_receipt_only(ocr_text: str, province: str) -> dict:
    """Only receipt uploaded — find cheapest generic without knowing insurance"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
            "role": "user",
            "content": f"""Extract the SINGLE medication with highest patient cost from this pharmacy receipt.
The cost is in the 'Patient Paid' or 'Paid' column on the right side.
Return ONE JSON object only, no markdown, no explanation:

Receipt text: {ocr_text}

Return exactly this single JSON object:
{{
    "drug_name": "medication name and dosage",
    "brand_cost": 0.00,
    "insurance_pct": 0
}}

Rules:
- brand_cost = the dollar amount in the Patient Paid column for that drug
- Pick the drug with the HIGHEST patient paid amount
- If no cost found, use brand_cost=18.74
IMPORTANT: Return ONLY ONE JSON object."""
        }],
        temperature=0.1
    )

    text = response.choices[0].message.content
    drug_data = extract_json(text)

    if not drug_data.get("drug_name") or not drug_data["drug_name"].strip():
        drug_data["drug_name"] = "Unknown medication"
    if not drug_data.get("brand_cost"):
        drug_data["brand_cost"] = 94.00
    drug_data["insurance_pct"] = 0

    coverage = check_coverage(
        drug_name=drug_data["drug_name"],
        brand_cost=drug_data["brand_cost"],
        insurance_pct=0,
        province=province
    )

    coverage["mode"] = "receipt_only"
    coverage["message"] = "No insurance info provided — showing best generic price and provincial programs available to you."
    return {**drug_data, **coverage}

def analyze_booklet_only() -> dict:
    """Only booklet uploaded — prompt for receipt"""
    return {
        "mode": "booklet_only",
        "error": True,
        "message": "Benefit booklet received! Now upload your prescription receipt to see exactly how much you can save."
    }

def analyze_both(receipt_text: str, booklet_text: str, province: str) -> dict:
    """Both uploaded — this is the wow moment"""
    
    # Step 1 - parse booklet for coverage
    booklet_response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
        "role": "user",
        "content": f"""Extract insurance coverage details from this benefit booklet.
Return ONE JSON object only, no markdown, no explanation, no multiple objects:

Booklet: {booklet_text}

Return exactly this single JSON object:
{{
    "coverage_percentage": 70,
    "max_annual": 5000,
    "deductible": 200,
    "dental_covered": true,
    "vision_covered": true,
    "prescription_covered": true
}}

If values not found use these defaults exactly as shown.
IMPORTANT: Return ONLY ONE JSON object, not multiple."""
    }],
    temperature=0.1
)

    booklet_text_response = booklet_response.choices[0].message.content
    booklet_data = extract_json(booklet_text_response)

    if not booklet_data.get("coverage_percentage"):
        booklet_data["coverage_percentage"] = 70

    # Step 2 - parse receipt for drug
    receipt_response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
        "role": "user",
        "content": f"""Extract the SINGLE medication with highest patient cost from this pharmacy receipt.
The cost is in the 'Patient Paid' or 'Paid' column on the right side.
Return ONE JSON object only, no markdown, no explanation:

Receipt: {receipt_text}

Return exactly this single JSON object:
{{
    "drug_name": "medication name and dosage",
    "brand_cost": 0.00,
    "insurance_pct": 0
}}

Rules:
- brand_cost = the dollar amount in the Patient Paid column for that drug
- Pick the drug with the HIGHEST patient paid amount
- If no cost found, use brand_cost=18.74
IMPORTANT: Return ONLY ONE JSON object."""
    }],
    temperature=0.1
)

    receipt_text_response = receipt_response.choices[0].message.content
    drug_data = extract_json(receipt_text_response)

    if not drug_data.get("drug_name") or not drug_data["drug_name"].strip():
        drug_data["drug_name"] = "Unknown medication"
    if not drug_data.get("brand_cost"):
        drug_data["brand_cost"] = 94.00

    # Step 3 - run coverage engine with real insurance %
    coverage = check_coverage(
        drug_name=drug_data["drug_name"],
        brand_cost=drug_data["brand_cost"],
        insurance_pct=booklet_data["coverage_percentage"],
        province=province
    )

    coverage["mode"] = "full_analysis"
    coverage["booklet"] = booklet_data
    coverage["message"] = f"With your {booklet_data['coverage_percentage']}% insurance coverage and switching to the generic, you could save ${coverage['total_savings']:.2f}."
    
    return {**drug_data, **coverage}

# keep these for backward compatibility
def analyze_prescription(ocr_text: str, province: str) -> dict:
    return analyze_receipt_only(ocr_text, province)

def parse_booklet(ocr_text: str) -> dict:
    return {"raw_text": ocr_text, "mode": "booklet_only"}