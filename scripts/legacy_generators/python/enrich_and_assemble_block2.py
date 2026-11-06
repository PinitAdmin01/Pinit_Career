#!/usr/bin/env python3
"""
Enrichment and Assembly Script for Block 2 (Days 6 to 10)
Course: B.Com Digital Accounting & Taxation (bcom-accounting)
Milestone 2: TASK-1359..1363
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
    6: {
        "goal": "Master Special Purpose Cash Books and petty cash internal financial controls: Triple-Column Cash Book architecture (Cash, Bank, Discount), contra entry mechanics ('C' in folio), cash discounts vs trade discounts, bank overdraft daily interest compounding, cheque clearing lifecycle (bounced and stale cheques), and general ledger closing integration.",
        "recap": "In Day 5, we achieved Milestone 1 Capstone accreditation across multi-entity consolidation, indirect cash flows, tax provisions, and adjusted EBITDA. Today in Day 6, we begin Milestone 2 by mastering primary liquidity accounting: 3-column cash books, contra entries, imprest petty cash, overdraft interest, and cheque lifecycle controls.",
        "summary": [
            "Constructed a Triple-Column Cash Book managing Cash, Bank, and Discount columns with flawless dual-column postings and contra entry ('C') tracking.",
            "Implemented an Analytical Columnar Petty Cash Book under the Imprest System, maintaining constant float equilibrium through authorized voucher replenishment.",
            "Modeled Bank Overdraft facilities, tracking daily borrowing balances, penal interest surcharges, and current liability balance sheet presentation.",
            "Engineered Cheque Clearing Lifecycle controls, automating reversals for dishonoured customer cheques and liability write-backs for stale instruments.",
            "Integrated Cash Book closing summaries with the General Ledger, achieving double-entry arithmetic equilibrium across corporate control accounts."
        ],
        "projectStep": {
            "title": "Engineer Enterprise Cash Book & Petty Cash Imprest Control Suite",
            "steps": [
                "Process dual-column cash and bank transactions, enforcing self-balancing contra entry recordings with 'C' folios.",
                "Calculate analytical petty cash distributions and determine exact imprest reimbursement cheque requirements.",
                "Simulate daily bank overdraft balances and compute compound interest liabilities including limit breach penalties.",
                "Reconcile cheque registers against 90-day validity windows and execute customer re-debiting on bounced cheques.",
                "Post aggregated cash book balances to General Ledger control accounts and verify trial balance equilibrium."
            ]
        }
    },
    7: {
        "goal": "Master Subsidiary Day Books and sub-ledger reconciliation: Purchases Day Book (Inward Invoices) with net trade discount recording, Sales Day Book (Outward Invoices) with accounts receivable turnover, Returns Outward Book with Debit Notes, Returns Inward Book with Credit Notes, Bills Receivable and Payable Registers with contingent liability tracking, and General Ledger Control Account reconciliation.",
        "recap": "In Day 6, we mastered primary liquidity journals through 3-column cash books and imprest petty cash. Today in Day 7, we expand into high-volume credit trading operations: subsidiary purchases and sales registers, debit/credit return memos, negotiable bills of exchange, and self-balancing control account reconciliations.",
        "summary": [
            "Engineered Purchases Day Books capturing credit inventory procurement from inward invoices with net trade discount calculations.",
            "Constructed Sales Day Books tracking outward commercial billing, volume discounts, and customer accounts receivable expansion.",
            "Processed merchandise return lifecycles utilizing Debit Notes for Purchases Returns and Credit Notes for Sales Returns.",
            "Maintained Bills Receivable and Payable registers, quantifying off-balance-sheet contingent liabilities on discounted commercial bills.",
            "Executed automated reconciliation between General Ledger Control Accounts (Total Debtors/Creditors) and subsidiary ledgers, certifying zero variance."
        ],
        "projectStep": {
            "title": "Construct Subsidiary Day Books & Self-Balancing Control Tower",
            "steps": [
                "Parse inward supplier invoices, strip trade discounts, and aggregate net credit purchases into Purchases Day Book registers.",
                "Generate outward commercial sales bills, compute volume price deductions, and record turnover in Sales Day Books.",
                "Issue authorized Debit Notes for supplier returns and Credit Notes for customer allowances, updating sub-ledgers.",
                "Track bills of exchange portfolios, isolating discounted drafts as contingent liabilities in financial disclosures.",
                "Reconcile Total Debtors and Total Creditors GL Control Accounts against subsidiary schedules to verify zero variance."
            ]
        }
    },
    8: {
        "goal": "Master the Bank Reconciliation Statement (BRS) and continuous treasury reconciliation: mathematical divergence causes (timing vs transaction asymmetries), the mandatory Corrected (Adjusted) Cash Book protocol, bank overdraft polarity inversion logic, error classification (internal cash book clerical fixes vs commercial bank disputes), and continuous automated reconciliation pipelines.",
        "recap": "In Day 7, we engineered subsidiary day books and control account reconciliations for trade commerce. Today in Day 8, we bridge internal financial records with external banking clearing channels: constructing Bank Reconciliation Statements, adjusting the Cash Book prior to close, inverting overdraft signs, and resolving banking disputes.",
        "summary": [
            "Constructed Bank Reconciliation Statements reconciling Cash Book balances to Bank Statements across unpresented cheques, uncredited deposits, and direct wires.",
            "Executed the Corrected (Adjusted) Cash Book protocol, posting bank-originated transactions to General Ledger accounts before final BRS extraction.",
            "Navigated Bank Overdraft BRS inversion, applying debt-magnitude polarity logic to reconcile unfavorable credit balances.",
            "Classified reconciliation anomalies, separating internal clerical cash book rectifications from external commercial bank disputes.",
            "Deployed continuous automated reconciliation pipelines matching ERP feeds against bank webhooks via deterministic reference IDs."
        ],
        "projectStep": {
            "title": "Architect Bank Reconciliation Engine & Continuous Treasury Pipeline",
            "steps": [
                "Extract unpresented cheques, uncredited deposits, and direct wire credits to compile baseline BRS schedules.",
                "Reopen Cash Book to record bank charges, interest credits, and standing orders, establishing the true Adjusted Cash Book balance.",
                "Apply inverted polarity rules to reconcile bank overdraft facilities and compute adjusted debt claims.",
                "Audit reconciliation variances, issuing internal journal rectifications for company errors and dispute memos for bank errors.",
                "Configure automated reference-based matching pipelines to stream real-time clearing telemetry into controller dashboards."
            ]
        }
    },
    9: {
        "goal": "Master Trial Balance compilation and error detection diagnostics: extraction of debit and credit closing balances across real, personal, and nominal accounts; proving double-entry arithmetic equilibrium; taxonomy of errors (disclosed vs undisclosed anomalies including errors of principle, omission, and compensating errors); modular forensic checksums (divisibility by 9 for transpositions/slides and divisibility by 2 for side inversions); and pre-closing statutory audit handoff protocols.",
        "recap": "In Day 8, we reconciled enterprise cash records with external banking clearing channels. Today in Day 9, we assemble the foundational checksum of double-entry bookkeeping: extracting the Trial Balance, verifying two-sided arithmetic equilibrium, dissecting hidden errors, and applying modular forensic diagnostics.",
        "summary": [
            "Extracted closing ledger balances across real, personal, and nominal accounts, verifying two-sided arithmetic equilibrium in the Trial Balance.",
            "Categorized accounting error taxonomy, differentiating one-sided errors disclosed by the Trial Balance from hidden two-sided anomalies.",
            "Applied modular arithmetic forensic checksums (divisibility by 9 and 2) to rapidly diagnose digit transpositions, slides, and side inversions.",
            "Evaluated Trial Balance compilation methodologies, contrasting the operational clarity of the Net Balances Method against Gross Totals.",
            "Compiled pre-closing diagnostic control towers and audit sign-off matrices, certifying audit readiness for statutory financial reporting."
        ],
        "projectStep": {
            "title": "Engineer Trial Balance Diagnostic Suite & Forensic Checksum Engine",
            "steps": [
                "Extract ledger balances across asset, liability, equity, revenue, and expense folios into a two-column Trial Balance schedule.",
                "Audit mathematical variances, proving two-sided arithmetic equilibrium to the exact cent.",
                "Diagnose error incidents, isolating disclosed imbalances from hidden errors of principle and complete omission.",
                "Run modular divisibility algorithms on trial balance variances to detect transposition and side-inversion clerical errors.",
                "Execute departmental internal control sign-offs across treasury, fixed assets, and revenues to package the statutory audit dossier."
            ]
        }
    },
    10: {
        "goal": "Milestone 2 Capstone: Master comprehensive Error Rectification, Suspense Account lifecycle, and internal financial controls: rectifications across three chronological stages (pre-trial balance direct corrections, post-trial balance suspense entries, post-final accounts prior-period restatements); opening, reversing, and zero-balance liquidation of the Suspense Account; two-sided error rectifications (principle and commission); retrospective restatements and deferred tax adjustments under IAS 8 and US GAAP ASC 250; and executive Financial Controller accreditation.",
        "recap": "In Days 6 through 9, we constructed special purpose cash books, subsidiary registers, bank reconciliations, and trial balance checksums. Today in Day 10, we crown Milestone 2 with the definitive science of Error Rectification: managing Suspense Accounts to zero balance, rectifying errors of principle, executing IAS 8 retrospective restatements, and achieving Financial Controller accreditation.",
        "summary": [
            "Executed error rectifications across three chronological stages: pre-trial balance direct corrections, post-TB suspense entries, and post-close prior period restatements.",
            "Managed the complete lifecycle of the Suspense Account from temporary opening balance through surgical rectifications to zero-balance ($0.00) liquidation.",
            "Rectified complex two-sided errors of principle and commission, restoring proper capital/revenue boundaries with zero suspense involvement.",
            "Modeled retrospective prior-period restatements and corporate tax adjustments under IAS 8 and US GAAP ASC 250, restating opening Retained Earnings.",
            "Compiled the Milestone 2 Capstone Financial Controller Accreditation Dossier, verifying 100% compliance across all internal control pillars."
        ],
        "projectStep": {
            "title": "Deploy Enterprise Error Rectification Suite & IAS 8 Restatement Engine",
            "steps": [
                "Classify error incidents by chronological discovery stage and formulate compliant stage-specific rectification protocols.",
                "Open, monitor, and surgically liquidate temporary Suspense Account balances to exact zero equilibrium ($0.00).",
                "Draft three-step journal entries to rectify errors of principle and commission without touching suspense ledgers.",
                "Calculate net-of-tax retrospective restatements to opening Retained Earnings for material prior-period errors under IAS 8 / ASC 250.",
                "Execute the Capstone Financial Controller control checklist and generate the certified statutory audit accreditation dossier."
            ]
        }
    }
}

def load_day_data(day_num: int) -> Dict[str, Any]:
    pad = str(day_num).zfill(2)
    path = os.path.join(os.path.dirname(__file__), f"bcom_acc_day{pad}_data.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

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
    print("\n=== LOADING, ENRICHING & VALIDATING BLOCK 2 (Days 6-10: Milestone 2) ===")
    days_data = []
    for d in range(6, 11):
        raw_data = load_day_data(d)
        enriched = enrich_day(raw_data)
        days_data.append(enriched)
        print(f"Loaded and enriched Day {d} data.")

    # Validation
    for d in days_data:
        day_num = d["day"]
        expected_minutes = 50 if day_num == 10 else 45
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
        
    # Check if Day 6 is already present - if so, strip from day 6 onward
    d6_marker = ",\n  {\n    coursePrefix: 'bcom-accounting',\n    day: 6,"
    if d6_marker in ts_content:
        idx_d6 = ts_content.find(d6_marker)
        ts_content = ts_content[:idx_d6] + "\n];\n"
        print("\nExisting Day 6 found. Stripped prior Day 6-10 blocks for clean re-assembly.")

    # Find closing '];'
    idx = ts_content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in bcomAccountingLongLessons.ts")
        
    formatted_lessons = []
    for d in days_data:
        formatted_lessons.append(format_ts_lesson(d))
        
    joined_new_lessons = ",\n" + ",\n".join(formatted_lessons) + "\n"
    updated_ts_content = ts_content[:idx] + joined_new_lessons + ts_content[idx:]
    
    with open(ts_file, "w", encoding="utf-8") as f:
        f.write(updated_ts_content)
    print(f"\nAppended Days 6-10 to {ts_file}")
        
    print("\n=== BLOCK 2 ASSEMBLY COMPLETED SUCCESSFULLY: DAYS 6-10 (MILESTONE 2 100% COMPLETE!) ===")

if __name__ == "__main__":
    main()
