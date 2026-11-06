#!/usr/bin/env python3
"""
Enrichment and Assembly Script for Block 4 (Days 16 to 20)
Course: B.Com Business Finance & Investment Management (bcom-finance)
Milestone 4: TASK-1444..1448
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
        "goal": "Master corporate leverage risk quantification: Degree of Operating Leverage (DOL = Contribution / EBIT), Degree of Financial Leverage (DFL = EBIT / EBT), Degree of Combined Leverage (DCL = DOL * DFL), and EBIT-EPS indifference point financing selection.",
        "recap": "In Block 3, we mastered capital budgeting payback metrics, cost of debt, cost of equity, and the universal WACC hurdle benchmark. Today in Day 16, we open Block 4: Capital Structure Theories & Working Capital Management, deconstructing operating risk (fixed production overhead) and financial risk (fixed contractual debt charges) through leverage elasticity modeling.",
        "summary": [
            "Quantified Operating Leverage (DOL = Contribution / EBIT), proving how fixed factory overhead magnifies sales volume volatility into EBIT swings.",
            "Formulated Financial Leverage (DFL = EBIT / [EBT - Dp/(1-T)]), evaluating fixed debt interest burdens and preference dividend gross-ups on EPS.",
            "Synthesized Combined Leverage (DCL = DOL * DFL = Contribution / EBT), demonstrating multiplicative total risk exposure.",
            "Calculated the EBIT-EPS Indifference Point, identifying the exact operating profit threshold where equity and debt financing yield identical EPS.",
            "Engineered a multi-division enterprise leverage risk governance dashboard, classifying subsidiaries into conservative vs aggressive debt tiers."
        ],
        "projectStep": {
            "title": "Build Degree of Operating, Financial & Combined Leverage Risk Engine",
            "steps": [
                "Compute unit contribution margins and measure operating profit sensitivity via Degree of Operating Leverage (DOL).",
                "Model debt interest service charges and calculate Earnings Per Share responsiveness via Degree of Financial Leverage (DFL).",
                "Multiply operating and financial leverage to derive Degree of Combined Leverage (DCL) total risk factors.",
                "Solve for the EBIT-EPS indifference point to evaluate proposed equity versus debt capital expansion plans.",
                "Generate executive leverage governance dashboards to enforce board-level debt risk boundaries."
            ]
        }
    },
    17: {
        "goal": "Master Cost-Volume-Profit (CVP) economics and operational break-even analysis: Profit-Volume (P/V) Ratio, Break-Even Point (BEP) in physical units and monetary value, Margin of Safety (MOS) buffer formulation, and multi-product composite break-even planning.",
        "recap": "In Day 16, we mastered leverage elasticity and the EBIT-EPS indifference point. Today in Day 17, we explore operational break-even economics: establishing unit contribution margins, finding exact zero-profit break-even sales thresholds, and measuring the margin of safety cushion protecting against demand shocks.",
        "summary": [
            "Deconstructed unit contribution margin and the Profit-Volume (P/V) ratio, evaluating how revenue expansion converts into operating profit.",
            "Formulated Break-Even Point in physical units (F / [P - V]) and in monetary sales value (F / P/V Ratio).",
            "Calculated Margin of Safety (MOS = Actual Sales - BEP), proving the duality theorem where Operating Profit = MOS * P/V Ratio.",
            "Modeled target profit sales planning, grossing up board post-tax net income targets by corporate tax rates.",
            "Engineered an enterprise multi-product composite CVP control tower, calculating sales-mix-weighted contribution margins."
        ],
        "projectStep": {
            "title": "Deploy Break-Even Point (BEP) & Margin of Safety (MOS) Analysis Suite",
            "steps": [
                "Calculate unit contribution margins and determine enterprise Profit-Volume (P/V) ratios.",
                "Compute break-even thresholds in physical units and monetary revenue across production facilities.",
                "Evaluate Margin of Safety operational cushions to assess enterprise resilience against demand downturns.",
                "Determine sales volumes required to deliver board-mandated pre-tax and post-tax target net profits.",
                "Aggregate multi-product sales mixes into a composite enterprise break-even control dashboard."
            ]
        }
    },
    18: {
        "goal": "Master short-term corporate liquidity and working capital management: Gross vs Net Working Capital, Cash Conversion Cycle (CCC = DIO + DSO - DPO), financing policies (Hedging, Conservative, Aggressive), quarterly cash budgeting, and trade credit optimization.",
        "recap": "In Day 17, we mastered break-even analysis and target profit planning. Today in Day 18, we tackle Working Capital Management: managing operating liquidity, accelerating cash velocity through the Cash Conversion Cycle, simulating monthly cash budgets, and evaluating credit policy terms.",
        "summary": [
            "Decomposed working capital into Gross Working Capital and Net Working Capital (Current Assets - Current Liabilities).",
            "Modeled the Cash Conversion Cycle (CCC = DIO + DSO - DPO), tracking cash locked across inventory, receivables, and payables.",
            "Evaluated the risk-return trade-offs of Hedging (Maturity Matching), Conservative, and Aggressive working capital financing policies.",
            "Constructed a multi-month rolling Cash Budget, forecasting receipts, payments, and automated short-term bank overdraft financing.",
            "Optimized corporate receivables credit policy, balancing incremental contribution against carrying costs and bad debt write-offs."
        ],
        "projectStep": {
            "title": "Engineer Working Capital Management & Quarterly Cash Budgeting Suite",
            "steps": [
                "Track inventory, receivables, and payables velocities to compute the enterprise Cash Conversion Cycle.",
                "Simulate alternative working capital financing policies to balance short-term interest costs against refinancing risk.",
                "Forecast monthly operating cash flows and model automatic bank overdraft financing in rolling cash budgets.",
                "Evaluate credit terms and cash discount economics (e.g., 2/10 Net 30) to optimize accounts receivable turnover.",
                "Deploy an executive treasury liquidity cockpit monitoring Current, Quick, and Cash ratios in real time."
            ]
        }
    },
    19: {
        "goal": "Master corporate capital structure theories: Traditional Net Income (NI) and Net Operating Income (NOI) approaches, Modigliani-Miller Proposition I & II (without taxes and with corporate taxes), homemade leverage arbitrage, and Static Trade-Off Theory balancing tax shields against financial distress costs.",
        "recap": "In Day 18, we mastered working capital liquidity and quarterly cash budgeting. Today in Day 19, we explore the theoretical foundations of capital structure: analyzing whether the debt-to-equity ratio impacts firm value, mastering Modigliani-Miller arbitrage proofs, and modeling the optimal leverage trade-off.",
        "summary": [
            "Compared the traditional Net Income (NI) approach (capital structure matters) against Net Operating Income (NOI) (capital structure is irrelevant).",
            "Demonstrated Modigliani-Miller Proposition I without taxes (VL = VU), proving how homemade leverage arbitrage enforces value neutrality.",
            "Formulated MM Proposition I with corporate taxes (VL = VU + Tc * D), proving that perpetual interest tax shields add enterprise value.",
            "Modeled the Static Trade-Off Theory, balancing interest tax shield benefits against expected direct and indirect bankruptcy distress costs.",
            "Identified the optimal capital structure where marginal tax shield benefits equal marginal expected distress costs, minimizing WACC."
        ],
        "projectStep": {
            "title": "Deploy Modigliani-Miller & Capital Structure Optimization Suite",
            "steps": [
                "Evaluate traditional Net Income and Net Operating Income assumptions across varying leverage levels.",
                "Simulate homemade leverage personal borrowing arbitrage to prove MM Proposition I value neutrality.",
                "Quantify the capitalized present value of corporate interest tax shields under MM Proposition I with taxes.",
                "Model financial distress default probability curves to identify bankruptcy risk thresholds.",
                "Determine the optimal corporate debt-to-equity ratio maximizing firm value and minimizing blended WACC."
            ]
        }
    },
    20: {
        "goal": "Master corporate dividend policy theories: Walter's Valuation Model (r vs Ke optimal payout rules), Gordon's Growth Model (Bird-in-the-Hand & retention growth g = b * r), Modigliani-Miller Dividend Irrelevance Theorem, share repurchases vs cash dividends, and Lintner dividend smoothing.",
        "recap": "In Day 19, we mastered capital structure theories and the MM theorems. Today in Day 20, we examine the third core corporate finance decision: Dividend Policy, evaluating whether returning cash to shareholders impacts common stock valuation, analyzing Walter and Gordon models, and exploring modern share repurchases.",
        "summary": [
            "Applied Walter's Dividend Model: Growth Firms (r > Ke) should retain 100% (0% payout); Declining Firms (r < Ke) should pay out 100%.",
            "Modeled Gordon's Dividend Growth Model (P0 = D1 / [Ke - g]), demonstrating retention growth dynamics (g = b * r) and the Bird-in-the-Hand effect.",
            "Proved the Modigliani-Miller Dividend Irrelevance Theorem, demonstrating that ex-dividend price drops offset cash payouts exactly.",
            "Analyzed Share Repurchases (Buybacks) versus Cash Dividends, confirming wealth equivalence and permanent EPS accretion.",
            "Synthesized John Lintner's dividend smoothing model, establishing balanced target payout recommendations for board governance."
        ],
        "projectStep": {
            "title": "Deploy Dividend Policy & Share Repurchase Valuation Suite",
            "steps": [
                "Classify enterprise investment regimes and apply Walter's model to determine optimal dividend payout ratios.",
                "Forecast dividend growth and model equity share valuations using Gordon's Dividend Growth formulation.",
                "Simulate ex-dividend share price mechanics to verify the Modigliani-Miller dividend irrelevance theorem.",
                "Compare cash dividend distributions against open-market share buybacks to evaluate investor wealth and EPS accretion.",
                "Deploy an executive corporate dividend policy cockpit integrating Lintner smoothing and board governance standards."
            ]
        }
    }
}

def load_day_data(day_num: int) -> Dict[str, Any]:
    path = os.path.join(os.path.dirname(__file__), f"bcom_fin_day{day_num}_data.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    d_dict: Dict[str, Any] = {}
    d_dict["coursePrefix"] = "bcom-finance"
    d_dict["day"] = day_num
    d_dict["title"] = data["title"]
    d_dict["minutes"] = data.get("minutes", data.get("duration", 45))
    
    norm_parts = []
    for p in data["parts"]:
        part_dict: Dict[str, Any] = {}
        part_dict["title"] = p["title"]
        
        if isinstance(p["say"], str):
            part_dict["say"] = [p["say"]]
        else:
            part_dict["say"] = list(p["say"])
            
        part_dict["example"] = p.get("example", f"Business Finance & Investment Valuation Case: {p['title']}")
        part_dict["code"] = p["code"]
        part_dict["output"] = p["output"]
        
        cn = p.get("codeNotes", [
            f"Mathematical precision verification for {p['title']}.",
            "Quantitative consistency verified under Corporate Financial Engineering and Valuation standards."
        ])
        if isinstance(cn, str):
            part_dict["codeNotes"] = [cn]
        else:
            part_dict["codeNotes"] = list(cn)
            
        part_dict["tryIt"] = p.get("tryIt", f"Modify the financial parameters in {p['title']} to observe the impact on valuation and decision rules.")
        
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
    print("\n=== LOADING, ENRICHING & VALIDATING BLOCK 4 (Days 16-20) ===")
    days_data = []
    for d in range(16, 21):
        raw_data = load_day_data(d)
        enriched = enrich_day(raw_data)
        days_data.append(enriched)
        print(f"Loaded and enriched Day {d} data.")

    # Validation
    for d in days_data:
        day_num = d["day"]
        expected_minutes = 45
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
    visuals_dir = os.path.join(repo_root, "src", "lib", "data", "lessonVisuals", "bcom-finance")
    os.makedirs(visuals_dir, exist_ok=True)
    
    for d in days_data:
        day_num = d["day"]
        pad = str(day_num).zfill(2)
        out_file = os.path.join(visuals_dir, f"day-{pad}.json")
        vis_dict = generate_ledger_sheet_visual("bcom-finance", day_num, d["parts"])
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(vis_dict, f, indent=2, ensure_ascii=False)
        print(f"Generated Visual JSON: {out_file} (Template: ledger-sheet, 5 entries)")

    # Append to TypeScript Long Lessons file
    ts_file = os.path.join(repo_root, "src", "lib", "data", "bcomFinanceLongLessons.ts")
    with open(ts_file, "r", encoding="utf-8") as f:
        ts_content = f.read()
        
    # Check if Day 16 is already present - if so, strip from day 16 onward
    d16_marker = ",\n  {\n    coursePrefix: 'bcom-finance',\n    day: 16,"
    d16_marker_dq = ",\n  {\n    coursePrefix: \"bcom-finance\",\n    day: 16,"
    if d16_marker in ts_content:
        print("Day 16 already present in TS file (single quote), replacing from Day 16 onward...")
        ts_base = ts_content.split(d16_marker)[0]
    elif d16_marker_dq in ts_content:
        print("Day 16 already present in TS file (double quote), replacing from Day 16 onward...")
        ts_base = ts_content.split(d16_marker_dq)[0]
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
    print("🏆 BLOCK 4: CAPITAL STRUCTURE & WORKING CAPITAL (DAYS 16-20) COMPLETE!")

if __name__ == "__main__":
    main()
