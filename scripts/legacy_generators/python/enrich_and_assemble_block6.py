#!/usr/bin/env python3
"""
Enrichment and Assembly Script for Block 6 (Days 26 to 30)
Course: B.Com Digital Accounting & Taxation (bcom-accounting)
Milestone 6: TASK-1379..1383 (Course 22 100% Completion)
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
    26: {
        "goal": "Master Capital Gains Taxation and Corporate Income Tax under Section 115BAA: short-term vs long-term capital assets, Section 48 cost inflation indexation, Section 112/112A concessional rates, concessional corporate tax regime requirements, and book profit MAT parity under Section 115JB.",
        "recap": "In Day 25, we completed Milestone 5 with the Comprehensive Direct Tax & Corporate Payroll Accounting Capstone. Today in Day 26, we launch Milestone 6: Advanced Corporate Tax Audit, Financial Diagnostics & Grand Master Capstone Suite, beginning with capital gains computations, Section 48 indexation rules, and corporate tax structuring under Section 115BAA.",
        "summary": [
            "Deconstructed capital asset classification criteria under Section 2(14) across short-term and long-term holding periods.",
            "Engineered Section 48 full value consideration and indexed cost of acquisition algorithms using the Cost Inflation Index (CII).",
            "Applied concessional capital gains tax rates under Section 112 (20% with indexation) and Section 112A (10% over Rs. 1 Lakh for STT-paid equities).",
            "Calculated corporate income tax under the concessional Section 115BAA regime at the effective 25.168% rate.",
            "Reconciled Section 115JB Minimum Alternate Tax (MAT) book profit adjustments and permanent tax exemption status under Section 115BAA."
        ],
        "projectStep": {
            "title": "Build Corporate Capital Gains & Section 115BAA Tax Provision Engine",
            "steps": [
                "Classify commercial asset disposals across short-term and long-term horizons based on statutory holding thresholds.",
                "Apply Cost Inflation Index (CII) multipliers to adjust historical acquisition costs for inflation under Section 48.",
                "Compute net taxable capital gains applying Section 112 and Section 112A preferential tax rates.",
                "Calculate total corporate tax liability applying Section 115BAA base tax (22%), surcharge (10%), and cess (4%).",
                "Verify Section 115JB MAT non-applicability for Section 115BAA opting companies."
            ]
        }
    },
    27: {
        "goal": "Master corporate financial statement diagnostics: liquidity ratios (Current, Quick, Cash), solvency metrics (Debt-to-Equity, Interest Coverage, Debt Service), operating profitability (Gross, Operating, Net margins, ROCE, ROE), efficiency turnover cycles, and distress forecasting using the Altman Z-Score.",
        "recap": "In Day 26, we mastered corporate capital gains and Section 115BAA tax engineering. Today in Day 27, we master corporate financial statement analysis: computing liquidity, solvency, profitability, and activity turnover ratios, and predicting financial distress using Altman's Z-Score model.",
        "summary": [
            "Evaluated short-term liquidity and liquidity safety margins through Current Ratio, Quick Ratio, and Absolute Cash Ratio.",
            "Assessed long-term corporate solvency and debt covenants via Debt-to-Equity, Debt Ratio, and Interest Coverage Ratios.",
            "Calculated core operating profitability metrics across Gross Profit Margin, Operating Margin, Net Profit Margin, ROCE, and ROE.",
            "Deconstructed the working capital cash conversion cycle (CCC) across DIO, DSO, and DPO turnover metrics.",
            "Computed the Altman Z-Score distress prediction metric, diagnosing corporate bankruptcy risk zones with mathematical rigor."
        ],
        "projectStep": {
            "title": "Deploy Corporate Financial Ratio Health & Altman Z-Score Diagnostic Engine",
            "steps": [
                "Extract balance sheet and income statement items to compute liquidity and defensive quick ratios.",
                "Evaluate corporate debt servicing ability and interest coverage ratios against commercial banking covenants.",
                "Analyze gross, operating, and net profitability margins alongside capital efficiency metrics (ROCE and ROE).",
                "Measure working capital efficiency and inventory-to-cash conversion cycle durations in days.",
                "Calculate the composite Altman Z-Score and categorize enterprise solvency into Safe, Gray, or Distress zones."
            ]
        }
    },
    28: {
        "goal": "Master Cash Flow Statement engineering under Accounting Standard 3 (AS-3): indirect method operating cash reconciliation, capital expenditure investing cash flows, equity and debt financing cash flows, working capital shift adjustments, and direct tax cash settlement proof.",
        "recap": "In Day 27, we mastered financial ratio diagnostics and solvency modeling. Today in Day 28, we master cash flow engineering under AS-3: converting accrual accounting profit into pure operating cash flows, tracking capital asset investments, accounting for financing disbursements, and proving cash balance equilibrium.",
        "summary": [
            "Deconstructed Accounting Standard 3 (AS-3) cash flow architecture across operating, investing, and financing tripartite activities.",
            "Reconciled Net Profit Before Tax to operating cash flows via the Indirect Method, adjusting for non-cash depreciation and working capital shifts.",
            "Classified capital expenditures, plant additions, and long-term financial investments under Cash Flows from Investing Activities.",
            "Mapped equity share issuances, debenture redemptions, term loan repayments, and dividend outflows under Financing Activities.",
            "Synthesized multi-period cash reconciliation proving opening to closing cash and bank balance equilibrium."
        ],
        "projectStep": {
            "title": "Engineer AS-3 Indirect Cash Flow Statement Reconciliation Pipeline",
            "steps": [
                "Extract Profit Before Tax and add back non-cash depreciation and finance costs.",
                "Adjust for balance sheet working capital movements across inventories, trade receivables, and trade payables.",
                "Deduct corporate income taxes actually paid in cash to determine Net Cash Flow from Operating Activities.",
                "Aggregate fixed asset capital investments and investment sales to determine Net Cash Flow from Investing Activities.",
                "Account for debt repayments and equity financing to reconcile net change in cash against audited bank balances."
            ]
        }
    },
    29: {
        "goal": "Master cloud ERP integration architecture, AI-powered invoice optical character recognition (OCR) extraction pipelines, automated 3-way reconciliation matching algorithms, and forensic accounting fraud detection utilizing Benford's Law digit distribution analysis.",
        "recap": "In Day 28, we mastered AS-3 cash flow statement engineering. Today in Day 29, we explore modern corporate accounting technology: cloud ERP webhook ingestion, AI-driven OCR invoice extraction, automated 3-way matching algorithms, and forensic digital fraud detection using Benford's Law.",
        "summary": [
            "Architected decoupled cloud ERP ledger ingestion pipelines utilizing REST APIs, webhooks, and cryptographic hash audit trails.",
            "Constructed AI-powered invoice OCR extraction engines, evaluating confidence scores and statutory regex format constraints.",
            "Implemented an automated Three-Way Matching reconciliation algorithm, enforcing price tolerance and physical goods receipt parity.",
            "Deconstructed Benford's Law first-digit logarithmic probability distributions and Chi-Square goodness-of-fit testing for fraud detection.",
            "Engineered forensic red-flag anomaly diagnostic engines, identifying split purchases, duplicate payments, and audit log tampering."
        ],
        "projectStep": {
            "title": "Deploy Cloud ERP Ingestion, AI Invoicing OCR & Forensic Audit Engine",
            "steps": [
                "Build automated webhook listeners that validate JSON transaction payloads and post balanced double-entry vouchers.",
                "Parse simulated vendor invoice text using regex patterns and confidence scoring to extract GSTIN, date, and invoice values.",
                "Execute the 3-way matching algorithm comparing Purchase Orders, Goods Receipt Notes, and Vendor Invoices.",
                "Compute first-digit distribution frequencies and evaluate Chi-Square statistics against Benford's Law to detect fraud.",
                "Scan ledger logs for red-flag anomalies including smurfing split purchases, weekend postings, and audit trail gaps."
            ]
        }
    },
    30: {
        "goal": "Culminating 50-minute Grand Master Capstone: Complete corporate digital accounting, dual GST invoicing, TDS statutory compliance, Ind AS financial statements, AS-3 cash flows, Section 44AB tax audit reporting, and executive controller certification.",
        "recap": "In Day 29, we mastered cloud accounting, AI invoicing, and forensic fraud detection. Today in Day 30, we reach the ultimate summit: the FINAL GRAND MASTER CAPSTONE of Course 22. You assume the role of Chief Financial Controller of Nexus Industrial Dynamics Technologies Ltd, executing end-to-end digital accounting, statutory tax settlements, financial statement assembly, tax audit reporting under Form 3CA/3CD, and earning Master Controller Accreditation.",
        "summary": [
            "Initialized enterprise Schedule III Chart of Accounts and verified mathematical equilibrium of the opening trial balance.",
            "Executed commercial dual GST invoicing and applied Section 49 electronic credit ledger offset hierarchies.",
            "Processed corporate payroll statutory withholdings (PF, PT, TDS 192) and vendor TDS compliance under Sections 194C and 194J.",
            "Assembled annual Ind AS financial statements (P&L and Balance Sheet) and proved indirect cash flow parity under AS-3.",
            "Certified Section 44AB Form 3CD tax audit particulars and evaluated executive financial health ratios for Grand Master Controller Sign-off."
        ],
        "projectStep": {
            "title": "Execute Final Grand Master Capstone: Integrated Corporate Digital Accounting, GST & Tax Audit Suite",
            "steps": [
                "Establish multi-entity company masters and ingest the opening trial balance verifying zero suspense variance.",
                "Record intra-state and inter-state commercial sales invoices and optimize Section 49 electronic credit tax offsets.",
                "Process monthly employee payroll and vendor contractor/professional TDS deductions, generating Form ITNS-281.",
                "Prepare the audited Statement of Profit and Loss and Balance Sheet with zero discrepancy under Ind AS.",
                "Complete the statutory Form 3CD tax audit schedule, calculate executive solvency ratios, and issue Controller Accreditation."
            ]
        }
    }
}

def load_day_data(day_num: int) -> Dict[str, Any]:
    path = os.path.join(os.path.dirname(__file__), f"bcom_acc_day{day_num}_data.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    d_dict: Dict[str, Any] = {}
    d_dict["coursePrefix"] = "bcom-accounting"
    d_dict["day"] = day_num
    d_dict["title"] = data["title"]
    d_dict["minutes"] = data.get("minutes", data.get("duration", 50 if day_num == 30 else 45))
    
    norm_parts = []
    for p in data["parts"]:
        part_dict: Dict[str, Any] = {}
        part_dict["title"] = p["title"]
        
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
    print("\n=== LOADING, ENRICHING & VALIDATING BLOCK 6 (Days 26-30: Milestone 6) ===")
    days_data = []
    for d in range(26, 31):
        raw_data = load_day_data(d)
        enriched = enrich_day(raw_data)
        days_data.append(enriched)
        print(f"Loaded and enriched Day {d} data.")

    # Validation
    for d in days_data:
        day_num = d["day"]
        expected_minutes = 50 if day_num == 30 else 45
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
        
    # Check if Day 26 is already present - if so, strip from day 26 onward
    d26_marker = ",\n  {\n    coursePrefix: 'bcom-accounting',\n    day: 26,"
    if d26_marker in ts_content:
        print("Day 26 already present in TS file, replacing from Day 26 onward...")
        ts_base = ts_content.split(d26_marker)[0]
    else:
        # Strip trailing "];\n" or "];"
        ts_base = ts_content.rstrip()
        if ts_base.endswith("];"):
            ts_base = ts_base[:-2].rstrip()

    block6_ts = ",\n" + ",\n".join(format_ts_lesson(d) for d in days_data) + "\n];\n"
    new_ts_content = ts_base + block6_ts

    with open(ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
        
    print(f"Updated {ts_file} with Days 26-30 successfully!")
    print("=== BLOCK 6 ENRICHMENT, VISUALS & ASSEMBLY COMPLETE ===")
    print("🏆 COURSE 22: DIGITAL ACCOUNTING & TAXATION (30/30 DAYS) IS 100% COMPLETE!")

if __name__ == "__main__":
    main()
