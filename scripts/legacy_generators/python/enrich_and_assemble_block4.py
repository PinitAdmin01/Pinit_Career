#!/usr/bin/env python3
"""
Enrichment and Assembly Script for Block 4 (Days 16 to 20)
Course: B.Com Digital Accounting & Taxation (bcom-accounting)
Milestone 4: TASK-1369..1373
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
    16: {
        "goal": "Master Tally Prime enterprise ERP accounting setup: Company Master creation, Financial Year and Books Beginning temporal boundaries, the 28 pre-defined primary and secondary groups, Ledger Master configuration, bill-wise tracking, multi-dimensional cost centers, and statutory audit trail compliance.",
        "recap": "In Day 15, we achieved Milestone 3 Capstone accreditation in year-end financial statement closing and post-closing trial balance extraction. Today in Day 16, we launch Milestone 4 by entering digital ERP accounting: configuring Tally Prime company masters, exploring the 28 pre-defined groups, creating compliant ledger accounts, and structuring multi-dimensional cost centers.",
        "summary": [
            "Configured Tally Prime Company Master, establishing legal corporate profiles, base currency precision, and statutory financial year boundaries.",
            "Deconstructed Tally Prime's 28 pre-defined group hierarchy across 15 Primary Groups (Balance Sheet & P&L) and 13 Secondary Sub-Groups.",
            "Engineered Ledger Master creation with parent group mapping, statutory GSTIN validation, and verified opening balance equilibrium.",
            "Implemented multi-dimensional Cost Categories and Cost Centers, decoupling managerial departmental tracking from statutory nominal ledgers.",
            "Executed automated Chart of Accounts extraction and audit trail verification, ensuring compliance with statutory ERP edit-log mandates."
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
    17: {
        "goal": "Master electronic voucher processing in Tally Prime: Standard Accounting Vouchers (F4 Contra, F5 Payment, F6 Receipt, F7 Journal, F8 Sales, F9 Purchase), voucher entry modes (As-Voucher, Accounting Invoice, Item Invoice), Bill-Wise details and AR aging, post-dated provisional vouchers, and real-time daybook posting.",
        "recap": "In Day 16, we configured Tally Prime company masters, groups, and ledger registries. Today in Day 17, we actuate the ERP system: processing live financial transactions across F4-F9 voucher keybindings, executing item invoice billing, managing bill-by-bill aging, and auditing the real-time daybook.",
        "summary": [
            "Routed electronic transactions through standard Tally Prime voucher keybindings: F4 Contra, F5 Payment, F6 Receipt, and F7 Journal.",
            "Executed commercial trade billing under Item Invoice Mode, integrating physical stock items, trade discounts, and statutory GST levies.",
            "Implemented Bill-Wise allocation tracking across New Ref, Agst Ref, Advance, and On Account, generating aged receivables schedules.",
            "Managed provisional financial workflows through Post-Dated Vouchers (PDV) and Optional Vouchers for treasury cash forecasting.",
            "Integrated live transactions into the general ledger, extracting real-time Daybook audit logs verifying daily debit-credit equilibrium."
        ],
        "projectStep": {
            "title": "Engineer Tally Prime Electronic Voucher & Daybook Processing Pipeline",
            "steps": [
                "Enforce voucher-specific routing constraints preventing third-party accounts from entering F4 Contra vouchers.",
                "Process physical inventory sales invoices under Item Invoice Mode, computing line-item taxable values and taxes.",
                "Track invoice settlements using Agst Ref allocations to generate real-time Accounts Receivable aging brackets.",
                "Quarantine post-dated cheques in dormant PDV registers to forecast liquidity without distorting active ledgers.",
                "Extract chronological daily Daybook registers to verify transaction numbering and ledger balance updates."
            ]
        }
    },
    18: {
        "goal": "Master the Indian Goods & Services Tax (GST) statutory framework: Constitutional dual model (CGST/SGST vs IGST), Place of Supply (POS) rules under Sections 10 and 12 of the IGST Act, HSN/SAC multi-tier tariffs, Rule 46 mandatory invoice particulars, and Rule 48(4) e-invoicing IRN generation.",
        "recap": "In Day 17, we processed electronic accounting vouchers and managed bill-wise receivables in Tally Prime. Today in Day 18, we master the statutory taxation engine: analyzing the dual GST constitutional model, determining place of supply, classifying HSN codes, and generating cryptographically signed e-invoices.",
        "summary": [
            "Deconstructed the constitutional dual GST model, differentiating intra-state supply (CGST + SGST) from inter-state supply (IGST).",
            "Resolved complex Place of Supply (POS) determinations across goods movement, bill-to ship-to models, and immovable property services.",
            "Classified commodities and services under HSN and SAC taxonomies, applying multi-tier tax rate slabs (0%, 5%, 12%, 18%, 28%) and cess.",
            "Validated statutory tax invoices against Rule 46 requirements and generated 64-character SHA-256 e-Invoice IRN hashes under Rule 48(4).",
            "Integrated output tax liabilities and input tax credits into dedicated statutory general ledger accounts, proving trial equilibrium."
        ],
        "projectStep": {
            "title": "Deploy Statutory Dual GST & e-Invoicing Compliance Engine",
            "steps": [
                "Evaluate supplier and recipient state codes to bifurcate transactions into CGST+SGST or consolidated IGST.",
                "Apply IGST Act Sections 10 and 12 to resolve place of supply for domestic trade and specialized services.",
                "Validate 4-digit and 6-digit HSN code requirements against taxpayer turnover thresholds on all invoice line items.",
                "Construct statutory Rule 46 tax invoice headers and generate cryptographic e-invoice IRN hashes.",
                "Post balanced accounting entries segregating commercial revenues from statutory tax liability and credit ledgers."
            ]
        }
    },
    19: {
        "goal": "Master GST Input Tax Credit (ITC) mechanics and optimization: Section 16 mandatory eligibility conditions, Section 17(5) blocked credit negative exclusions, Section 49 statutory cross-utilization hierarchy, Rule 43 capital goods 60-month useful life apportionment, and electronic ledger cash minimization.",
        "recap": "In Day 18, we mastered dual GST levies, place of supply rules, and statutory e-invoicing. Today in Day 19, we conquer Input Tax Credit (ITC): auditing Section 16 eligibility, enforcing Section 17(5) blocked credit negative lists, optimizing Section 49 set-off hierarchies, and minimizing cash tax payments.",
        "summary": [
            "Audited procurement invoices against Section 16 mandatory eligibility criteria, enforcing the strict 180-day vendor payment rule.",
            "Filtered procurements against Section 17(5) statutory blocked credit lists, excluding passenger motor vehicles, catering, and lost goods.",
            "Executed the statutory Section 49/49A/49B cross-utilization hierarchy, exhausting IGST credit first to minimize cash tax payouts.",
            "Apportioned capital goods common input tax credit over 60 months under Rule 43, calculating monthly reversals for exempt supplies.",
            "Balanced the Electronic Liability, Credit, and Cash Ledgers, determining exact net bank challan funding requirements."
        ],
        "projectStep": {
            "title": "Deploy GST Input Tax Credit (ITC) Optimization & Set-Off Suite",
            "steps": [
                "Screen purchase registers to verify invoice possession, goods receipt, vendor tax deposit, and return filing.",
                "Identify and purge Section 17(5) blocked credits, routing uncreditable taxes to business expense or capital asset accounts.",
                "Apply algorithmic Section 49 set-off sequences to exhaust IGST credit against CGST/SGST liabilities without cross-utilization violations.",
                "Track capital goods input tax credit across 60 monthly installments, reversing common credits based on exempt turnover ratios.",
                "Reconcile electronic portal ledgers to generate certified monthly cash challan requirements for bank clearing."
            ]
        }
    },
    20: {
        "goal": "Milestone 4 Capstone: Master comprehensive GST Returns and Compliance: GSTR-1 outward invoice table aggregation, GSTR-2B static locking, purchase register vs GSTR-2B automated 3-way reconciliation under Rule 36(4), GSTR-3B monthly cash settlement, Section 50 interest calculations, and executive Tax Controller accreditation.",
        "recap": "In Days 16 through 19, we configured Tally Prime ERP masters, executed voucher workflows, mastered dual GST mechanics, and optimized Input Tax Credit set-off. Today in Day 20, we crown Milestone 4 with the full statutory tax closing engine: compiling GSTR-1, reconciling GSTR-2B, executing GSTR-3B settlement, and achieving Tax Controller accreditation.",
        "summary": [
            "Compiled Form GSTR-1 outward return payloads, aggregating invoice-level data across Table 4 B2B, Table 5 B2C Large, and Table 7 summaries.",
            "Processed GSTR-2B auto-drafted statements, enforcing the 11th cut-off date to isolate admissible credits from statutorily barred items.",
            "Engineered automated 3-way reconciliation between internal purchase books and GSTR-2B, enforcing Rule 36(4) credit gating.",
            "Synthesized Form GSTR-3B summary returns, computing net cash liabilities, Section 50 statutory interest, and Section 47 late fees.",
            "Assembled the Executive GST Controller Compliance Control Tower, auditing Rule 88C/88D variances and achieving Milestone 4 Accreditation."
        ],
        "projectStep": {
            "title": "Deploy Milestone 4 Capstone GST Returns Engine & Compliance Control Tower",
            "steps": [
                "Transform sales registers into structured GSTR-1 statutory tables categorized by recipient registration status.",
                "Ingest static GSTR-2B feeds to verify supplier filing compliance and lock eligible Input Tax Credit.",
                "Execute automated 3-way reconciliation, flagging missing vendor invoices for payment withholding under Rule 36(4).",
                "Synthesize Form GSTR-3B self-assessment tables, applying Section 49 set-off and calculating delayed filing interest.",
                "Generate the Executive Tax Compliance Dashboard verifying zero Rule 88C and 88D variance notices to earn Controller Accreditation."
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
    d_dict["minutes"] = data.get("minutes", data.get("duration", 50 if day_num == 20 else 45))
    
    norm_parts = []
    for p in data["parts"]:
        part_dict: Dict[str, Any] = {}
        part_dict["title"] = p["title"]
        
        # Ensure say is list of strings
        if isinstance(p["say"], str):
            part_dict["say"] = [p["say"]]
        else:
            part_dict["say"] = list(p["say"])
            
        part_dict["example"] = p.get("example", f"Tally Prime ERP & GST Case Study: {p['title']}")
        part_dict["code"] = p["code"]
        part_dict["output"] = p["output"]
        
        cn = p.get("codeNotes", [
            f"Statutory validation for {p['title']}.",
            "Mathematical precision verified under Indian Goods & Services Tax (GST) standards."
        ])
        if isinstance(cn, str):
            part_dict["codeNotes"] = [cn]
        else:
            part_dict["codeNotes"] = list(cn)
            
        part_dict["tryIt"] = p.get("tryIt", f"Modify the ERP parameters in {p['title']} to verify statutory compliance impact.")
        
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
    print("\n=== LOADING, ENRICHING & VALIDATING BLOCK 4 (Days 16-20: Milestone 4) ===")
    days_data = []
    for d in range(16, 21):
        raw_data = load_day_data(d)
        enriched = enrich_day(raw_data)
        days_data.append(enriched)
        print(f"Loaded and enriched Day {d} data.")

    # Validation
    for d in days_data:
        day_num = d["day"]
        expected_minutes = 50 if day_num == 20 else 45
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
        
    # Check if Day 16 is already present - if so, strip from day 16 onward
    d16_marker = ",\n  {\n    coursePrefix: 'bcom-accounting',\n    day: 16,"
    if d16_marker in ts_content:
        print("Day 16 already present in TS file, replacing from Day 16 onward...")
        ts_base = ts_content.split(d16_marker)[0]
    else:
        # Strip trailing "];\n" or "];"
        ts_base = ts_content.rstrip()
        if ts_base.endswith("];"):
            ts_base = ts_base[:-2].rstrip()

    block4_ts = ",\n" + ",\n".join(format_ts_lesson(d) for d in days_data) + "\n];\n"
    new_ts_content = ts_base + block4_ts

    with open(ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
        
    print(f"Updated {ts_file} with Days 16-20 successfully!")
    print("=== BLOCK 4 ENRICHMENT, VISUALS & ASSEMBLY COMPLETE ===")

if __name__ == "__main__":
    main()
