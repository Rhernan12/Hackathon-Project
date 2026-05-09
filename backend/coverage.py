ODB_FORMULARY = {
    "metformin": {"covered": True, "generic_cost": 12.00, "brand": "Glucophage"},
    "atorvastatin": {"covered": True, "generic_cost": 15.00, "brand": "Lipitor"},
    "lisinopril": {"covered": True, "generic_cost": 10.00, "brand": "Zestril"},
    "amlodipine": {"covered": True, "generic_cost": 11.00, "brand": "Norvasc"},
    "omeprazole": {"covered": True, "generic_cost": 14.00, "brand": "Losec"},
    "levothyroxine": {"covered": True, "generic_cost": 9.00, "brand": "Synthroid"},
    "ramipril": {"covered": True, "generic_cost": 13.00, "brand": "Altace"},
    "hydrochlorothiazide": {"covered": True, "generic_cost": 8.00, "brand": "Microzide"},
    "pantoprazole": {"covered": True, "generic_cost": 16.00, "brand": "Pantoloc"},
    "rosuvastatin": {"covered": True, "generic_cost": 18.00, "brand": "Crestor"},
}

PROVINCIAL_PROGRAMS = {
    "ontario": {
        "name": "Ontario Trillium Drug Program",
        "link": "https://www.ontario.ca/page/trillium-drug-program",
        "description": "Covers approved drugs for Ontario residents with high drug costs relative to income"
    },
    "quebec": {
        "name": "Quebec RAMQ",
        "link": "https://www.ramq.gouv.qc.ca/en/citizens/prescription-drug-insurance",
        "description": "Quebec's public prescription drug insurance plan"
    },
    "bc": {
        "name": "BC PharmaCare",
        "link": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents",
        "description": "BC's provincial prescription drug plan"
    },
    "alberta": {
        "name": "Alberta Blue Cross (Government)",
        "link": "https://www.alberta.ca/alberta-blue-cross.aspx",
        "description": "Alberta's government-sponsored drug benefit plan"
    }
}

def check_coverage(
    drug_name: str,
    brand_cost: float,
    insurance_pct: float,
    province: str
) -> dict:
    drug_key = drug_name.lower().split()[0]
    formulary = ODB_FORMULARY.get(drug_key, None)

    insurance_pays = round(brand_cost * (insurance_pct / 100), 2)
    out_of_pocket = round(brand_cost - insurance_pays, 2)

    generic_available = formulary is not None
    generic_cost = formulary["generic_cost"] if formulary else brand_cost
    generic_savings = round(out_of_pocket - generic_cost, 2) if generic_available else 0
    generic_savings = max(generic_savings, 0)

    provincial = PROVINCIAL_PROGRAMS.get(province.lower(), PROVINCIAL_PROGRAMS["ontario"])
    provincial_covered = generic_available

    total_savings = round(out_of_pocket - (generic_cost if generic_available else out_of_pocket), 2)
    total_savings = max(total_savings, 0)

    return {
        "brand_cost": brand_cost,
        "insurance_pays": insurance_pays,
        "out_of_pocket": out_of_pocket,
        "generic_available": generic_available,
        "generic_name": formulary["brand"] + " (generic)" if formulary else None,
        "generic_cost": generic_cost,
        "generic_savings": generic_savings,
        "provincial_program": provincial["name"],
        "provincial_link": provincial["link"],
        "provincial_covered": provincial_covered,
        "total_savings": total_savings,
        "verdict": f"You could save ${total_savings:.2f} by switching to the generic and applying for {provincial['name']}."
        if total_savings > 0 else "You are already getting the best available price."
    }