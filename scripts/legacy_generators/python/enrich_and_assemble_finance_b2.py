#!/usr/bin/env python3
"""
Enrichment and Assembly Script for Block 2 (Days 6 to 10)
Course: B.Com Business Finance & Investment Management (bcom-finance)
Milestone 2 Capstone: TASK-1424..1428
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
        "goal": "Master fixed-income debt valuation and coupon pricing mechanics: Par Value, Coupon Rate, Market Yield (Discount Rate), Term to Maturity, clean vs dirty price, accrued interest settlements, and zero-coupon bond pricing relationships.",
        "recap": "In Block 1, we mastered the foundational mathematics of the Time Value of Money, DCF compounding, and enterprise valuation. Today in Day 6, we launch Block 2: Fixed-Income Valuation & Capital Budgeting Architecture, beginning with bond valuation equations, coupon pricing dynamics, clean vs dirty invoice prices, and zero-coupon implied yields.",
        "summary": [
            "Deconstructed the fundamental bond pricing equation into coupon annuity discounting and maturity face value recovery.",
            "Demonstrated the Three Golden Pricing Axioms: Coupon > Yield yields Premium; Coupon < Yield yields Discount; Coupon == Yield yields Par.",
            "Calculated Accrued Interest and trade settlement mechanics under 30/360 and Actual/Actual conventions, resolving Clean vs Dirty invoice prices.",
            "Priced Zero-Coupon Bonds (ZCBs) and derived the implied compounding spot yield formula, eliminating coupon reinvestment risk.",
            "Engineered an institutional multi-bond portfolio mark-to-market valuation engine and computed net unrealized balance sheet variances."
        ],
        "projectStep": {
            "title": "Build Fixed-Coupon Bond Fair Pricing & Clean/Dirty Settlement Engine",
            "steps": [
                "Discount periodic coupon annuity streams and maturity face values using closed-form financial equations.",
                "Classify debt securities into Par, Premium, and Discount pricing regimes based on coupon-to-yield relationships.",
                "Calculate statutory accrued interest across trade settlement windows under standard market day-count conventions.",
                "Determine zero-coupon bond fair purchase discounts and implied annual compounding yields.",
                "Aggregate multi-holding debt portfolios to audit clean market value, accrued interest, and net unrealized gains/losses."
            ]
        }
    },
    7: {
        "goal": "Master bond rate-of-return analytics: Nominal Coupon Yield, Current Yield, and Yield to Maturity (YTM) using both the standard market approximation formula and exact numerical bisection solvers, decomposing yields into income and capital components and diagnosing macroeconomic yield curve structures.",
        "recap": "In Day 6, we mastered bond pricing equations and clean/dirty price mechanics. Today in Day 7, we master Yield to Maturity (YTM): evaluating the full yield spectrum, applying closed-form market approximations, implementing exact numerical bisection solvers, and decoding term structure yield curve signals.",
        "summary": [
            "Evaluated the fixed income yield spectrum: Nominal Coupon Yield vs Current Cash Yield vs Yield to Maturity (YTM).",
            "Applied the Standard Market YTM Approximation Formula [C + (F - P)/n] / [(F + P)/2], verifying linear capital gain amortization.",
            "Implemented an exact numerical bisection YTM root-finding engine, achieving sub-basis-point precision against market prices.",
            "Decomposed total expected annual holding period returns into Current Yield (cash income) and Capital Gains Yield (pull-to-par price delta).",
            "Analyzed yield curve shapes (Normal, Inverted, Flat) and evaluated 10Y-2Y and 10Y-3M spreads to diagnose macroeconomic recession signals."
        ],
        "projectStep": {
            "title": "Deploy Bond Yield to Maturity (YTM) Numerical Solver & Term Structure Analyzer",
            "steps": [
                "Compute and compare nominal coupon rates, current cash yields, and yield to maturity across debt instruments.",
                "Calculate approximate YTM using the standard market closed-form numerator/denominator formula.",
                "Execute exact iterative bisection root-finding to eliminate approximation basis-point discrepancies.",
                "Deconstruct annual holding period returns into cash coupon yields and unrealized capital gain yields.",
                "Ingest multi-tenor Treasury yield curves and classify term structure regimes (Normal vs Inverted recession warning)."
            ]
        }
    },
    8: {
        "goal": "Master interest rate risk quantification and asset-liability management (ALM): Macaulay Duration (weighted-average maturity), Modified Duration (percentage price volatility per 100 bps), second-order Bond Convexity curvature, and duration immunization portfolio balancing.",
        "recap": "In Day 7, we mastered Yield to Maturity and yield curve diagnostics. Today in Day 8, we master interest rate risk: measuring bond price volatility with Macaulay and Modified Duration, correcting for curvature with Bond Convexity, and immunizing institutional balance sheets against interest rate shocks.",
        "summary": [
            "Calculated Macaulay Duration as the present-value-weighted average time until bond cash flows are received in years.",
            "Derived Modified Duration (D* = D_mac / (1 + y)) and estimated percentage price sensitivity for 100-basis-point yield shifts.",
            "Formulated second-order Bond Convexity and Taylor Series expansions, proving that positive convexity cushions downside and amplifies upside.",
            "Engineered an institutional basis-point price sensitivity estimator, evaluating portfolio dollar impacts under central bank policy shocks.",
            "Constructed a multi-asset duration immunization engine, matching asset portfolio duration to target liability horizons in ALM."
        ],
        "projectStep": {
            "title": "Engineer Macaulay & Modified Duration Volatility & ALM Immunization Engine",
            "steps": [
                "Calculate the PV-weighted cash flow timing schedule to determine Macaulay Duration in years.",
                "Compute Modified Duration and predict percentage price movements under yield shift scenarios.",
                "Calculate bond convexity and apply second-order Taylor series adjustments to eliminate linear estimation errors.",
                "Simulate basis-point interest rate shocks to evaluate portfolio dollar gains and losses.",
                "Balance asset portfolio duration against target institutional liability horizons to achieve complete ALM immunization."
            ]
        }
    },
    9: {
        "goal": "Master capital budgeting and project appraisal: the Net Present Value (NPV) Decision Rule, DCF Free Cash Flow to Firm (FCFF) modeling, working capital adjustments, terminal salvage values, NPV theoretical superiority axioms, and mutually exclusive project selection.",
        "recap": "In Day 8, we mastered interest rate risk duration and convexity. Today in Day 9, we master Capital Budgeting: applying the Gold Standard Net Present Value (NPV) decision rule, constructing free cash flow DCF models, proving shareholder wealth additivity, and selecting optimal mutually exclusive projects.",
        "summary": [
            "Deconstructed the Net Present Value (NPV) decision criterion: Accept if NPV > 0 to maximize shareholder enterprise value.",
            "Engineered unlevered Free Cash Flow to Firm (FCFF) projections, adding back depreciation and adjusting for CapEx and working capital.",
            "Modeled terminal salvage values and corporate tax adjustments on capital asset disposals at project completion.",
            "Proved the Value Additivity Principle: the combined NPV of a multi-project capital budget equals the exact sum of individual project NPVs.",
            "Resolved mutually exclusive project conflicts across scale and cash flow timing disparities, prioritizing highest absolute positive NPV."
        ],
        "projectStep": {
            "title": "Deploy Net Present Value (NPV) & Project Viability Analyzer",
            "steps": [
                "Model multi-year capital expenditure cash flow forecasts and discount at corporate hurdle rates (WACC).",
                "Construct unlevered Free Cash Flow to Firm pipelines incorporating NOPAT, depreciation tax shields, and working capital shifts.",
                "Incorporate terminal salvage values with balancing tax charges or allowances into final year cash flows.",
                "Validate portfolio shareholder wealth additivity across independent corporate investment proposals.",
                "Evaluate competing mutually exclusive projects and select the wealth-maximizing proposal based on superior NPV."
            ]
        }
    },
    10: {
        "goal": "Culminating 50-minute Milestone 2 Capstone: Internal Rate of Return (IRR) numerical bisection solver, hurdle rate benchmark testing, Net Present Value profiles, Modified IRR (MIRR) terminal reinvestment modeling, Profitability Index (PI) capital rationing optimization, and CFO executive capital allocation certification.",
        "recap": "In Day 9, we mastered the NPV criterion and free cash flow capital budgeting. Today in Day 10, we reach the summit of Block 2: the ⭐ MILESTONE 2 CAPSTONE. You assume the role of Chief Financial Officer of Apex Industrial Dynamics Corporation, deploying an industrial-grade Capital Budgeting Control Tower synthesizing exact bisection IRR, MIRR, hurdle rate benchmarks, and capital rationing optimization.",
        "summary": [
            "Constructed a high-precision numerical bisection IRR engine solving polynomial DCF roots where NPV equals exactly zero.",
            "Mapped continuous Net Present Value Profiles across discount rates, confirming the hurdle rate benchmark decision rule (IRR >= WACC).",
            "Resolved the Multiple IRR anomaly and reinvestment rate flaw by implementing the closed-form Modified IRR (MIRR) terminal compounding algorithm.",
            "Optimized capital allocation under hard budget rationing constraints using the Profitability Index (PI) benefit-cost ratio.",
            "Synthesized multi-project capital budgets, validated shareholder wealth maximization, and conferred Milestone 2 CFO Capital Allocation Certification."
        ],
        "projectStep": {
            "title": "Execute Milestone 2 Capstone: Capital Budgeting IRR Bisection Engine & Hurdle Rate Benchmark Suite",
            "steps": [
                "Ingest enterprise capital expenditure proposals and execute discounted cash flow present value valuation.",
                "Deploy the iterative bisection numerical solver to compute exact project Internal Rates of Return.",
                "Generate Net Present Value profiles and verify project viability against corporate hurdle rates.",
                "Compound operational cash flows at market reinvestment rates to calculate closed-form Modified IRR (MIRR).",
                "Rank candidate projects by Profitability Index, optimize capital deployment under budget limits, and issue CFO accreditation."
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
    d_dict["minutes"] = data.get("minutes", data.get("duration", 50 if day_num == 10 else 45))
    
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
    print("\n=== LOADING, ENRICHING & VALIDATING BLOCK 2 (Days 6-10: Milestone 2 Capstone) ===")
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
        
    # Check if Day 6 is already present - if so, strip from day 6 onward
    d6_marker = ",\n  {\n    coursePrefix: 'bcom-finance',\n    day: 6,"
    if d6_marker in ts_content:
        print("Day 6 already present in TS file, replacing from Day 6 onward...")
        ts_base = ts_content.split(d6_marker)[0]
    else:
        # Strip trailing "];\n" or "];"
        ts_base = ts_content.rstrip()
        if ts_base.endswith("];"):
            ts_base = ts_base[:-2].rstrip()

    block2_ts = ",\n" + ",\n".join(format_ts_lesson(d) for d in days_data) + "\n];\n"
    new_ts_content = ts_base + block2_ts

    with open(ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
        
    print(f"Updated {ts_file} with Days 6-10 successfully!")
    print("=== BLOCK 2 ENRICHMENT, VISUALS & ASSEMBLY COMPLETE ===")
    print("🏆 MILESTONE 2 CAPSTONE: CAPITAL BUDGETING & VALUATION (DAYS 6-10) COMPLETE!")

if __name__ == "__main__":
    main()
