ODB_FORMULARY = {
    # Diabetes
    "metformin": {"covered": True, "generic_cost": 12.00, "brand": "Glucophage"},
    "insulin": {"covered": True, "generic_cost": 45.00, "brand": "Lantus"},
    "glipizide": {"covered": True, "generic_cost": 10.00, "brand": "Glucotrol"},
    
    # Cholesterol
    "atorvastatin": {"covered": True, "generic_cost": 15.00, "brand": "Lipitor"},
    "rosuvastatin": {"covered": True, "generic_cost": 18.00, "brand": "Crestor"},
    "simvastatin": {"covered": True, "generic_cost": 10.00, "brand": "Zocor"},

    # Blood pressure
    "lisinopril": {"covered": True, "generic_cost": 10.00, "brand": "Zestril"},
    "ramipril": {"covered": True, "generic_cost": 13.00, "brand": "Altace"},
    "amlodipine": {"covered": True, "generic_cost": 11.00, "brand": "Norvasc"},
    "hydrochlorothiazide": {"covered": True, "generic_cost": 8.00, "brand": "Microzide"},
    "bisoprolol": {"covered": True, "generic_cost": 12.00, "brand": "Monocor"},
    "perindopril": {"covered": True, "generic_cost": 14.00, "brand": "Coversyl"},

    # Stomach / acid
    "omeprazole": {"covered": True, "generic_cost": 14.00, "brand": "Losec"},
    "pantoprazole": {"covered": True, "generic_cost": 16.00, "brand": "Pantoloc"},
    "rabeprazole": {"covered": True, "generic_cost": 15.00, "brand": "Pariet"},

    # Thyroid
    "levothyroxine": {"covered": True, "generic_cost": 9.00, "brand": "Synthroid"},

    # Antibiotics
    "amoxicillin": {"covered": True, "generic_cost": 7.00, "brand": "Amoxil"},
    "azithromycin": {"covered": True, "generic_cost": 12.00, "brand": "Zithromax"},
    "ciprofloxacin": {"covered": True, "generic_cost": 14.00, "brand": "Cipro"},
    "doxycycline": {"covered": True, "generic_cost": 10.00, "brand": "Vibramycin"},

    # Respiratory
    "salbutamol": {"covered": True, "generic_cost": 8.00, "brand": "Ventolin"},
    "fluticasone": {"covered": True, "generic_cost": 25.00, "brand": "Flovent"},
    "montelukast": {"covered": True, "generic_cost": 15.00, "brand": "Singulair"},
    "tiotropium": {"covered": True, "generic_cost": 35.00, "brand": "Spiriva"},

    # Mental health
    "sertraline": {"covered": True, "generic_cost": 12.00, "brand": "Zoloft"},
    "escitalopram": {"covered": True, "generic_cost": 14.00, "brand": "Cipralex"},
    "fluoxetine": {"covered": True, "generic_cost": 10.00, "brand": "Prozac"},
    "quetiapine": {"covered": True, "generic_cost": 20.00, "brand": "Seroquel"},
    "venlafaxine": {"covered": True, "generic_cost": 16.00, "brand": "Effexor"},

    # Pain / inflammation
    "ibuprofen": {"covered": True, "generic_cost": 6.00, "brand": "Advil"},
    "naproxen": {"covered": True, "generic_cost": 8.00, "brand": "Naprosyn"},
    "celecoxib": {"covered": True, "generic_cost": 18.00, "brand": "Celebrex"},
    "gabapentin": {"covered": True, "generic_cost": 15.00, "brand": "Neurontin"},

    # Blood thinners
    "warfarin": {"covered": True, "generic_cost": 10.00, "brand": "Coumadin"},
    "apixaban": {"covered": False, "generic_cost": 85.00, "brand": "Eliquis"},
    "rivaroxaban": {"covered": False, "generic_cost": 90.00, "brand": "Xarelto"},

    # Vaccines / other — not typically covered by ODB
    "influenza": {"covered": False, "generic_cost": 12.99, "brand": "Fluviral"},
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
    },
    "other": {
        "name": "Ontario Trillium Drug Program",
        "link": "https://www.ontario.ca/page/trillium-drug-program",
        "description": "Check your provincial drug benefit program for coverage options"
    }
    
}

def get_drug_key(drug_name: str) -> str:
    name_lower = drug_name.lower()
    for key in ODB_FORMULARY:
        if key in name_lower:
            return key
    parts = name_lower.split()
    return parts[0] if parts else "unknown"

def check_coverage(
    drug_name: str,
    brand_cost: float,
    insurance_pct: float,
    province: str
) -> dict:
    drug_key = get_drug_key(drug_name) if drug_name and drug_name.strip() else "unknown"
    formulary = ODB_FORMULARY.get(drug_key, None)

    insurance_pays = round(brand_cost * (insurance_pct / 100), 2)
    out_of_pocket = round(brand_cost - insurance_pays, 2)

    generic_available = formulary is not None
    generic_cost = formulary["generic_cost"] if formulary else brand_cost
    
    # only recommend generic if it's actually cheaper
    generic_saves_money = generic_available and generic_cost < out_of_pocket
    generic_savings = round(out_of_pocket - generic_cost, 2) if generic_saves_money else 0
    total_savings = max(generic_savings, 0)

    provincial = PROVINCIAL_PROGRAMS.get(province.lower(), PROVINCIAL_PROGRAMS["other"])
    provincial_covered = generic_saves_money

    return {
        "brand_cost": brand_cost,
        "insurance_pays": insurance_pays,
        "out_of_pocket": out_of_pocket,
        "generic_available": generic_saves_money,
        "generic_name": formulary["brand"] + " (generic)" if generic_saves_money else None,
        "generic_cost": generic_cost if generic_saves_money else None,
        "generic_savings": generic_savings,
        "provincial_program": provincial["name"],
        "provincial_link": provincial["link"],
        "provincial_covered": provincial_covered,
        "total_savings": total_savings,
        "verdict": f"You could save ${total_savings:.2f} by switching to the generic and applying for {provincial['name']}."
        if total_savings > 0 else
        "No generic alternative found in the Ontario Drug Benefit formulary. You may still be eligible for provincial coverage — check with your pharmacist."
        if not generic_saves_money else
        "You are already getting the best available price."}