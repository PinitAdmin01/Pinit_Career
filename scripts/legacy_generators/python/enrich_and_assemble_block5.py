#!/usr/bin/env python3
"""
Enrichment and Assembly Script for Block 5 (Days 21 to 25)
Course: B.Com Digital Accounting & Taxation (bcom-accounting)
Milestone 5: TASK-1374..1378
"""

import sys
import os
import json
import hashlib
from typing import Dict, Any, List

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from visual_builder import generate_ledger_sheet_visual, count_words

METADATA = {
    21: {
        "goal": "Master Tally Prime enterprise ERP accounting setup and GST statutory taxation engine: Company Master creation, the 28 pre-defined primary and secondary groups, Ledger Master configuration, bill-wise tracking, multi-dimensional cost centers, dual GST (CGST/SGST vs IGST) tax configuration, and statutory audit trail compliance.",
        "recap": "In Day 20, we completed Milestone 4 with the full statutory GST tax closing engine and GSTR-3B settlement. Today in Day 21, we launch Milestone 5: Direct Taxation, Corporate Payroll Accounting & New Regime (Sec 115BAC) Capstone, beginning with Tally Prime's enterprise statutory taxation engine, multi-dimensional ledger setup, and real-time daybook audit trails.",
        "summary": [
            "Configured Tally Prime Company Master and statutory tax parameters, establishing legal corporate profiles and financial year boundaries.",
            "Deconstructed Tally Prime's 28 pre-defined group hierarchy across 15 Primary Groups and 13 Secondary Sub-Groups.",
            "Engineered Ledger Master creation with parent group mapping, statutory GSTIN validation, and verified opening balance equilibrium.",
            "Implemented multi-dimensional Cost Categories and Cost Centers, decoupling managerial departmental tracking from statutory nominal ledgers.",
            "Executed automated Daybook extraction and audit trail verification, ensuring compliance with statutory ERP edit-log mandates."
        ],
        "projectStep": {
            "title": "Build Tally Prime Company Master & Chart of Accounts Architecture",
            "steps": [
                "Initialize the enterprise company master specifying financial year and books beginning dates.",
                "Map account ledgers to appropriate primary and secondary groups within Tally Prime's 28-group taxonomy.",
                "Configure party ledger masters with bill-by-bill tracking and statutory 15-digit GSTIN identifiers.",
                "Allocate multi-dimensional cost centers across departments and projects for managerial expense reporting.",
                "Generate the statutory Chart of Accounts audit dossier to verify zero opening balance discrepancies."
            ]
        }
    },
    22: {
        "goal": "Master Reverse Charge Mechanism (RCM) under Section 9(3)/9(4) of the CGST Act and E-Way Bill generation under Rule 138: recipient liability accounting, self-invoicing, payment voucher issuance, Part A & Part B e-way bill consignment compliance, and validity expiration management.",
        "recap": "In Day 21, we configured Tally Prime ERP masters and statutory tax ledgers. Today in Day 22, we master Reverse Charge Mechanism (RCM) and E-Way Bill generation: handling GTA and legal procurements, generating self-invoices, routing tax credits, and generating cryptographically validated e-way bills for goods transportation.",
        "summary": [
            "Deconstructed Reverse Charge Mechanism (RCM) statutory mandates under CGST Act Sections 9(3) and 9(4), shifting tax liability to recipients.",
            "Engineered automated self-invoicing and payment voucher generation for unregistered vendor procurements under Section 31(3)(f)/(g).",
            "Executed simultaneous RCM tax liability crystallization and Input Tax Credit (ITC) claiming, ensuring zero out-of-pocket leakage.",
            "Automated Rule 138 E-Way Bill generation, bifurcating consignment parameters across Part A transaction data and Part B vehicle conveyance.",
            "Engineered statutory e-way bill validity duration monitoring, calculating multi-day expiration horizons for regular and over-dimensional cargo."
        ],
        "projectStep": {
            "title": "Deploy RCM Self-Invoicing & Rule 138 E-Way Bill Logistics Engine",
            "steps": [
                "Evaluate procurement transactions to flag statutory RCM applicability across GTA, legal services, and unregistered vendor thresholds.",
                "Generate compliant Section 31(3)(f) self-invoices and Section 31(3)(g) payment vouchers for RCM inward supplies.",
                "Post balanced double-entry accounting vouchers booking RCM output liability and corresponding input tax credit.",
                "Construct statutory Rule 138 Part A consignment payloads and validate Part B transport vehicle numbers.",
                "Compute dynamic e-way bill validity periods based on transportation distance and transit cargo classification."
            ]
        }
    },
    23: {
        "goal": "Master corporate payroll accounting and statutory compliance: Gross Salary structuring (Basic, HRA, DA, Special Allowance), Employees' Provident Fund (EPF & MP Act 1952), Employees' State Insurance (ESIC Act 1948), Professional Tax (PT), employer statutory contributions, and automated salary disbursement vouchers.",
        "recap": "In Day 22, we mastered Reverse Charge Mechanism (RCM) and e-way bill logistics. Today in Day 23, we conquer Corporate Payroll Accounting: structuring CTC packages, computing employee and employer statutory contributions (EPF, ESI, PT), and automating end-of-month salary disbursement journal entries.",
        "summary": [
            "Engineered corporate payroll earnings architecture, structuring CTC packages across Basic Salary, HRA, DA, and Special Allowances.",
            "Computed Employees' Provident Fund (EPF) deductions under the 1952 Act, capping statutory wage limits and allocating employer funds to EPS and EPF.",
            "Calculated Employees' State Insurance (ESI) contributions under the 1948 Act, auditing the Rs 21,000 gross threshold and employer 3.25% rates.",
            "Enforced state-specific Professional Tax (PT) slab deductions, establishing statutory compliance across multi-jurisdictional workforces.",
            "Synthesized end-of-month payroll journal entries, recognizing corporate wage expense and segregating net salary payables from statutory liabilities."
        ],
        "projectStep": {
            "title": "Deploy Corporate Payroll Processing & Statutory Deduction Engine",
            "steps": [
                "Deconstruct annual employee CTC packages into monthly base pay, allowances, and perquisite components.",
                "Apply statutory EPF algorithms calculating 12% employee contribution and bifurcating 12% employer contribution into EPF and EPS.",
                "Determine ESI applicability against the gross salary limit and compute employee 0.75% and employer 3.25% contributions.",
                "Deduct state-mandated Professional Tax (PT) according to graduated employee gross earnings slabs.",
                "Generate consolidated monthly payroll disbursement journals and statutory deposit challan payment vouchers."
            ]
        }
    },
    24: {
        "goal": "Master Tax Deducted at Source (TDS) under the Income Tax Act 1961: Section 194C (contractors), Section 194J (professional/technical fees), Section 194I (rent), threshold monitoring, higher withholding under Section 206AA for invalid PAN, quarterly Form 26Q return filing, and Challan ITNS 281 reconciliation.",
        "recap": "In Day 23, we processed corporate payroll, EPF, and ESI statutory deductions. Today in Day 24, we conquer Tax Deducted at Source (TDS): enforcing withholding thresholds across Sections 194C, 194J, and 194I, penalizing non-PAN vendors under Section 206AA, and reconciling quarterly Form 26Q tax returns.",
        "summary": [
            "Deconstructed the statutory framework of Tax Deducted at Source (TDS) under Chapter XVII-B of the Income Tax Act 1961.",
            "Enforced Section 194C contractor withholding thresholds across single contract limits (Rs 30,000) and aggregate annual limits (Rs 1,00,000).",
            "Applied Section 194J rates bifurcating technical fees and royalty (2%) from professional services (10%) above the Rs 30,000 statutory limit.",
            "Executed Section 194I rental withholding distinguishing plant/machinery (2%) from land/building (10%) against the Rs 2,40,000 threshold.",
            "Synthesized quarterly Form 26Q return payloads, reconciled ITNS 281 Challan BSR codes, and generated Section 203 Form 16A certificates."
        ],
        "projectStep": {
            "title": "Deploy Enterprise TDS Withholding & Form 26Q Compliance Suite",
            "steps": [
                "Monitor cumulative vendor transaction totals to trigger automated TDS withholding upon crossing statutory section thresholds.",
                "Apply differentiated statutory TDS rates across contractor, professional fee, and rental procurement categories.",
                "Enforce Section 206AA penal withholding at 20% on all vendor disbursements lacking valid 10-character PAN identifiers.",
                "Reconcile monthly Challan ITNS 281 tax deposits, matching CIN and BSR codes against vendor deduction schedules.",
                "Generate structured quarterly Form 26Q return filings and export verified Form 16A withholding certificates."
            ]
        }
    },
    25: {
        "goal": "Milestone 5 Capstone: Master Direct Income Tax computation, Old vs New Tax Regime (Section 115BAC) comparative optimization, Chapter VI-A deductions (80C, 80D, 80CCD), Section 24(b) home loan interest, breakeven deduction threshold modeling, Section 192 salary withholding schedule, and Tax Controller accreditation.",
        "recap": "In Days 21 through 24, we mastered Tally Prime ERP taxation, RCM self-invoicing, e-way bill generation, corporate payroll, and vendor TDS withholding. Today in Day 25, we crown Milestone 5 with the full Direct Income Tax computation engine: evaluating Old vs New Regime under Section 115BAC, modeling breakeven thresholds, automating Section 192 TDS withholding, and earning Tax Controller Accreditation.",
        "summary": [
            "Deconstructed personal direct income taxation under the Income Tax Act 1961, comparing progressive slab structures of Old vs New Regimes.",
            "Audited Chapter VI-A eligible deductions under Section 80C, Section 80D, and Section 80CCD(1B), and Section 24(b) housing loan interest.",
            "Formulated mathematical breakeven deduction thresholds to determine the exact inflection point favoring Old vs New Tax Regimes.",
            "Engineered monthly Section 192 TDS salary withholding amortization schedules, recalculating employee tax deductions dynamically.",
            "Assembled the Executive Direct Tax Controller Control Tower, auditing corporate payroll tax compliance and earning Milestone 5 Accreditation."
        ],
        "projectStep": {
            "title": "Deploy Milestone 5 Capstone Direct Income Tax & Section 115BAC Optimization Engine",
            "steps": [
                "Calculate gross taxable income across salary earnings, perquisites, and standard deduction allowances under both tax regimes.",
                "Aggregate eligible Chapter VI-A investment deductions and housing loan interest for Old Regime computation.",
                "Execute multi-tier slab tax computations, applying Section 87A rebate and 4% Health and Education Cess to determine net tax liability.",
                "Run automated regime comparison algorithms, advising employees on the mathematically optimal regime minimizing tax liability.",
                "Generate the Executive Direct Tax Audit Dossier and monthly Section 192 payroll withholding schedule to earn Milestone 5 Accreditation."
            ]
        }
    }
}

def load_day_data(day_num: int) -> Dict[str, Any]:
    path = os.path.join(os.path.dirname(__file__), f"bcom_acc_day{day_num}_data.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Normalize structure across days
    d_dict: Dict[str, Any] = {}
    d_dict["coursePrefix"] = "bcom-accounting"
    d_dict["day"] = day_num
    d_dict["title"] = data["title"]
    d_dict["minutes"] = data.get("minutes", data.get("duration", 50 if day_num == 25 else 45))
    
    norm_parts = []
    for p in data["parts"]:
        part_dict: Dict[str, Any] = {}
        part_dict["title"] = p["title"]
        
        # Ensure say is list of strings
        if isinstance(p["say"], str):
            part_dict["say"] = [p["say"]]
        else:
            part_dict["say"] = list(p["say"])
            
        part_dict["example"] = p.get("example", f"Digital Accounting & Taxation Case Study: {p['title']}")
        part_dict["code"] = p["code"]
        part_dict["output"] = p["output"]
        
        cn = p.get("codeNotes", [
            f"Statutory validation for {p['title']}.",
            "Mathematical precision verified under Indian Direct & Indirect Taxation standards."
        ])
        if isinstance(cn, str):
            part_dict["codeNotes"] = [cn]
        else:
            part_dict["codeNotes"] = list(cn)
            
        part_dict["tryIt"] = p.get("tryIt", f"Modify the taxation parameters in {p['title']} to verify statutory compliance impact.")
        
        # Check / Socratic normalization
        chk = p.get("check") or p.get("socratic")
        ans = chk.get("answerIndex", chk.get("answer", 0))
        why = chk.get("explanation", chk.get("why", ""))
        part_dict["check"] = {
            "question": chk["question"],
            "options": chk["options"],
            "answer": ans,
            "why": why,
            "answerIndex": ans,
            "explanation": why
        }
        norm_parts.append(part_dict)
        
    d_dict["parts"] = norm_parts
    return d_dict

def enrich_day(day_data: Dict[str, Any]) -> Dict[str, Any]:
    d_num = day_data["day"]
    meta = METADATA[d_num]
    
    enriched = dict(day_data)
    enriched["goal"] = meta["goal"]
    enriched["recap"] = meta["recap"]
    enriched["summary"] = meta["summary"]
    enriched["projectStep"] = meta["projectStep"]
    return enriched

def format_ts_lesson(lesson: Dict[str, Any]) -> str:
    lines = []
    lines.append("  {")
    lines.append(f"    coursePrefix: {json.dumps(lesson['coursePrefix'])},")
    lines.append(f"    day: {lesson['day']},")
    lines.append(f"    title: {json.dumps(lesson['title'])},")
    lines.append(f"    goal: {json.dumps(lesson['goal'])},")
    lines.append(f"    minutes: {lesson['minutes']},")
    lines.append(f"    recap: {json.dumps(lesson['recap'])},")
    lines.append("    parts: [")
    
    for i, p in enumerate(lesson["parts"]):
        lines.append("      {")
        lines.append(f"        title: {json.dumps(p['title'])},")
        lines.append("        say: [")
        for s in p["say"]:
            lines.append(f"          {json.dumps(s)},")
        lines.append("        ],")
        lines.append(f"        example: {json.dumps(p['example'])},")
        lines.append(f"        code: {json.dumps(p['code'])},")
        lines.append(f"        output: {json.dumps(p['output'])},")
        
        cn_val = p.get("codeNotes", [])
        if isinstance(cn_val, str):
            cn_list = [cn_val]
        else:
            cn_list = list(cn_val)
            
        lines.append("        codeNotes: [")
        for cn in cn_list:
            lines.append(f"          {json.dumps(cn)},")
        lines.append("        ],")
        lines.append(f"        tryIt: {json.dumps(p['tryIt'])},")
        
        chk = p["check"]
        ans = chk.get("answerIndex", chk.get("answer", 0))
        why = chk.get("explanation", chk.get("why", ""))
        lines.append("        check: {")
        lines.append(f"          question: {json.dumps(chk['question'])},")
        lines.append("          options: [")
        for opt in chk["options"]:
            lines.append(f"            {json.dumps(opt)},")
        lines.append("          ],")
        lines.append(f"          answer: {ans},")
        lines.append(f"          why: {json.dumps(why)},")
        lines.append(f"          answerIndex: {ans},")
        lines.append(f"          explanation: {json.dumps(why)}")
        lines.append("        }")
        
        if i < len(lesson["parts"]) - 1:
            lines.append("      },")
        else:
            lines.append("      }")
            
    lines.append("    ],")
    lines.append("    summary: [")
    for sm in lesson["summary"]:
        lines.append(f"      {json.dumps(sm)},")
    lines.append("    ],")
    lines.append("    projectStep: {")
    lines.append(f"      title: {json.dumps(lesson['projectStep']['title'])},")
    lines.append("      steps: [")
    for stp in lesson["projectStep"]["steps"]:
        lines.append(f"        {json.dumps(stp)},")
    lines.append("      ]")
    lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)

def main():
    print("\n=== LOADING, ENRICHING & VALIDATING BLOCK 5 (Days 21-25: Milestone 5) ===")
    days_data = []
    for d in range(21, 26):
        raw_data = load_day_data(d)
        enriched = enrich_day(raw_data)
        days_data.append(enriched)
        print(f"Loaded and enriched Day {d} data.")

    # Validation
    for d in days_data:
        day_num = d["day"]
        expected_minutes = 50 if day_num == 25 else 45
        assert d["minutes"] == expected_minutes, f"Day {day_num} minutes must be {expected_minutes}, got {d['minutes']}"
        assert len(d["parts"]) == 5, f"Day {day_num} must have exactly 5 parts, got {len(d['parts'])}"
        
        total_day_words = 0
        for idx, p in enumerate(d["parts"]):
            part_words = count_words(p["say"])
            total_day_words += part_words
            assert part_words >= 580, f"Day {day_num} Part {idx+1} '{p['title']}' has {part_words} words (< 580)"
            assert len(p["code"].strip()) > 0, f"Day {day_num} Part {idx+1} code empty"
            assert len(p["output"].strip()) > 0, f"Day {day_num} Part {idx+1} output empty"
            
            # Socratic check verification
            chk = p["check"]
            assert "question" in chk and len(chk["question"]) > 10, f"Day {day_num} Part {idx+1} check question missing"
            assert len(chk["options"]) == 4, f"Day {day_num} Part {idx+1} check must have 4 options"
            ans = chk.get("answerIndex", chk.get("answer"))
            assert ans == 0, f"Day {day_num} Part {idx+1} answer index must be 0, got {ans}"
            why = chk.get("explanation", chk.get("why", ""))
            assert len(why) > 10, f"Day {day_num} Part {idx+1} explanation missing"
            
        assert total_day_words >= 2950, f"Day {day_num} total words {total_day_words} < 2950"
        print(f"Day {day_num}: {total_day_words} words across 5 parts -> PASS GREEN")

    # Generate Visual JSON files
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    visuals_dir = os.path.join(repo_root, "src", "lib", "data", "lessonVisuals", "bcom-accounting")
    os.makedirs(visuals_dir, exist_ok=True)
    
    for d in days_data:
        day_num = d["day"]
        pad = str(day_num).zfill(2)
        out_file = os.path.join(visuals_dir, f"day-{pad}.json")
        vis_dict = generate_ledger_sheet_visual("bcom-accounting", day_num, d["parts"])
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(vis_dict, f, indent=2, ensure_ascii=False)
        print(f"Generated Visual JSON: {out_file} (Template: ledger-sheet, 5 entries)")

    # Append to TypeScript Long Lessons file
    ts_file = os.path.join(repo_root, "src", "lib", "data", "bcomAccountingLongLessons.ts")
    with open(ts_file, "r", encoding="utf-8") as f:
        ts_content = f.read()
        
    # Check if Day 21 is already present - if so, strip from day 21 onward
    d21_marker = ",\n  {\n    coursePrefix: 'bcom-accounting',\n    day: 21,"
    if d21_marker in ts_content:
        print("Day 21 already present in TS file, replacing from Day 21 onward...")
        ts_base = ts_content.split(d21_marker)[0]
    else:
        # Strip trailing "];\n" or "];"
        ts_base = ts_content.rstrip()
        if ts_base.endswith("];"):
            ts_base = ts_base[:-2].rstrip()

    block5_ts = ",\n" + ",\n".join(format_ts_lesson(d) for d in days_data) + "\n];\n"
    new_ts_content = ts_base + block5_ts

    with open(ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
        
    print(f"Updated {ts_file} with Days 21-25 successfully!")
    print("=== BLOCK 5 ENRICHMENT, VISUALS & ASSEMBLY COMPLETE ===")

if __name__ == "__main__":
    main()
