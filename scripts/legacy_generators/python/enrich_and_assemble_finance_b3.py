#!/usr/bin/env python3
"""
Enrichment and Assembly Script for Block 3 (Days 11 to 15)
Course: B.Com Business Finance & Investment Management (bcom-finance)
Milestone 3 Capstone: TASK-1434..1438
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
    11: {
        "goal": "Master secondary capital budgeting criteria and liquidity analytics: Simple Payback Period (SPB), Discounted Payback Period (DPB), Profitability Index (PI) benefit-cost efficiency ratios, and multi-project ranking under hard capital rationing.",
        "recap": "In Block 2, we mastered bond valuation, YTM solvers, duration immunization, and the gold standard NPV and IRR decision rules. Today in Day 11, we kick off Block 3: Cost of Capital & Capital Budgeting Architecture, exploring essential liquidity metrics—Simple and Discounted Payback Periods—and the Profitability Index (PI) for maximizing capital efficiency under budget constraints.",
        "summary": [
            "Calculated Simple Payback Period (SPB) using exact fractional recovery interpolation over cumulative nominal cash flows.",
            "Formulated Discounted Payback Period (DPB) by applying the time value of money, demonstrating that DPB > SPB due to compounding discount friction.",
            "Deconstructed the Profitability Index (PI = PV of Inflows / Initial Outlay), proving its alignment with NPV as an efficiency indicator.",
            "Executed multi-project capital rationing optimization by ranking proposals via PI and greedily packing the capital budget.",
            "Engineered an enterprise capital budgeting scorecard integrating SPB, DPB, PI, and NPV to drive multi-criteria CFO investment approvals."
        ],
        "projectStep": {
            "title": "Build Capital Budgeting Payback & Profitability Index (PI) Engine",
            "steps": [
                "Track cumulative nominal cash flows and compute fractional Simple Payback Periods.",
                "Discount project inflows at the hurdle rate and determine exact Discounted Payback horizons.",
                "Calculate the Profitability Index (PI) benefit-cost ratio across competing capital proposals.",
                "Rank independent investment proposals under hard capital rationing constraints to maximize portfolio NPV.",
                "Generate executive capital allocation recommendations reconciling liquidity benchmarks with enterprise wealth creation."
            ]
        }
    },
    12: {
        "goal": "Master debt financing cost analytics: Pre-tax and After-tax Cost of Debt (Kd), corporate interest tax shields, Modigliani-Miller tax shield capital value theorems, flotation cost amortization, and redeemable debt YTM approximation.",
        "recap": "In Day 11, we mastered Payback periods and Profitability Index ranking. Today in Day 12, we transition directly into the Cost of Capital, beginning with the Cost of Debt (Kd): calculating after-tax contractual borrowing rates, modeling interest tax shields, and pricing the net proceeds of debt issuances.",
        "summary": [
            "Derived the statutory After-Tax Cost of Debt equation: Kd_after = Kd_pre * (1 - Tax Rate), proving that debt is tax-advantaged.",
            "Quantified the annual Corporate Interest Tax Shield (Debt * Kd * T) and capitalized its present value into enterprise wealth.",
            "Integrated debt flotation costs and underwriting fees to compute effective net proceeds and adjusted borrowing yields.",
            "Applied the standard market approximation formula to price redeemable debt and estimate after-tax yield to maturity.",
            "Engineered a multi-tranche corporate debt valuation and weighted cost analyzer synthesizing bank loans, notes, and debentures."
        ],
        "projectStep": {
            "title": "Deploy Cost of Debt (Kd) & Corporate Tax Shield Valuation Suite",
            "steps": [
                "Compute pre-tax coupon yields and apply statutory marginal tax rates to derive after-tax debt costs.",
                "Model annual interest tax shields and evaluate Modigliani-Miller capitalized tax shield valuations.",
                "Amortize debt flotation fees across net proceeds to calculate effective true issuance borrowing costs.",
                "Estimate yield to maturity on redeemable debt instruments using closed-form approximation methods.",
                "Aggregate multi-tranche institutional debt portfolios into an enterprise blended after-tax debt hurdle rate."
            ]
        }
    },
    13: {
        "goal": "Master equity financing cost modeling: the Capital Asset Pricing Model (CAPM), Gordon Dividend Growth Model (DDM), dual-model triangulation, Cost of Preference Shares (Kp), and the economic opportunity cost of retained earnings.",
        "recap": "In Day 12, we mastered the cost of debt and the corporate interest tax shield. Today in Day 13, we tackle the Cost of Equity (Ke): deriving equity risk premiums via CAPM, valuing perpetuity dividends with the Gordon Dividend Growth Model, and analyzing preference shares and retained earnings.",
        "summary": [
            "Modeled the Cost of Equity (Ke) using the Capital Asset Pricing Model: Ke = Rf + Beta * (Rm - Rf), pricing systematic market risk.",
            "Derived intrinsic equity hurdle rates using the Gordon Dividend Growth Model: Ke = (D1 / P0) + g, modeling sustainable growth.",
            "Triangulated divergent CAPM and DDM valuations into a robust, blended consensus equity cost estimate.",
            "Calculated the Cost of Preference Shares (Kp = Dp / Net Proceeds), highlighting the absence of corporate interest tax shields.",
            "Demonstrated the opportunity cost equivalence of retained earnings (Kr = Ke) under frictionless zero-flotation assumptions."
        ],
        "projectStep": {
            "title": "Deploy Cost of Equity (Ke) & Capital Asset Pricing Valuation Suite",
            "steps": [
                "Ingest risk-free yields, equity market risk premiums, and company betas to compute CAPM required equity returns.",
                "Forecast next-period dividends and perpetual growth rates to calculate DDM intrinsic equity hurdle rates.",
                "Triangulate CAPM and DDM outputs to establish corporate consensus equity discount rates.",
                "Price perpetual preference share issues and determine net after-flotation preference capital costs.",
                "Assess retained earnings opportunity costs and construct enterprise equity capital schedules."
            ]
        }
    },
    14: {
        "goal": "Master the Weighted Average Cost of Capital (WACC): capital structure weight derivation (Market Value vs Book Value), blended hurdle rate optimization, divisional risk-adjusted hurdle rates (pure-play beta adjustments), and static trade-off capital structure design.",
        "recap": "In Day 13, we mastered the cost of equity and preference capital. Today in Day 14, we synthesize all capital components into the central benchmark of corporate finance: the Weighted Average Cost of Capital (WACC), mastering market value weighting, divisional hurdle adjustments, and capital structure trade-offs.",
        "summary": [
            "Synthesized debt, equity, and preference shares into the universal WACC formula: WACC = we*Ke + wd*Kd*(1-T) + wp*Kp.",
            "Proved the theoretical superiority of Market Value weights over historical Book Value weights for current opportunity cost evaluation.",
            "Engineered divisional risk-adjusted discount rates using pure-play unlevered and relevered Hamada beta adjustments.",
            "Modeled static trade-off capital structure theory, balancing interest tax shield benefits against financial distress costs.",
            "Constructed a corporate hurdle rate sensitivity matrix evaluating WACC responses across varying leverage and tax regimes."
        ],
        "projectStep": {
            "title": "Engineer Weighted Average Cost of Capital (WACC) & Hurdle Valuation Suite",
            "steps": [
                "Calculate total enterprise market values and compute proportional debt, equity, and preference capital weights.",
                "Synthesize individual capital costs into an enterprise blended Weighted Average Cost of Capital.",
                "Adjust divisional hurdle rates for varying project business risks using pure-play asset betas.",
                "Simulate capital structure shifts to identify the optimal debt-to-equity ratio minimizing corporate WACC.",
                "Generate executive hurdle rate dashboards to evaluate prospective mergers, acquisitions, and capital projects."
            ]
        }
    },
    15: {
        "goal": "Culminating 50-minute Milestone 3 Capstone: Integrated capital budgeting appraisal, WACC hurdle rate valuation engine, equipment replacement Equivalent Annual Cost (EAC), EBIT-EPS indifference point analysis, capital rationing allocation matrix, and CFO executive capital allocation certification.",
        "recap": "In Days 11 through 14, we mastered payback metrics, cost of debt, cost of equity, and the synthesized WACC hurdle rate. Today in Day 15, we reach the summit of Block 3: the ⭐ MILESTONE 3 CAPSTONE. You step into the role of Group Chief Financial Officer of Nexus Global Industries Corporation, executing an integrated capital budgeting and cost of capital valuation control tower synthesizing EAC replacement decisions, EBIT-EPS financing choice indifference points, and capital rationing optimization.",
        "summary": [
            "Deconstructed the complete corporate investment cycle: from component capital pricing and WACC derivation to project DCF appraisal.",
            "Resolved unequal-life capital replacement dilemmas using Equivalent Annual Cost (EAC) annuity factor modeling.",
            "Calculated the EBIT-EPS indifference point, identifying the exact operating profit threshold where equity and debt financing yield identical EPS.",
            "Optimized multi-million dollar capital expenditure portfolios under hard budget constraints using the Profitability Index heuristic.",
            "Delivered an institutional-grade CFO Capital Allocation Dashboard and conferred Milestone 3 Corporate Financial Engineering Certification."
        ],
        "projectStep": {
            "title": "Execute Milestone 3 Capstone: Integrated Capital Budgeting & WACC Hurdle Valuation Engine",
            "steps": [
                "Derive enterprise WACC hurdle rates integrating after-tax debt, preference shares, and CAPM-calculated equity costs.",
                "Appraise capital expenditure proposals across NPV, IRR, Profitability Index, and Discounted Payback benchmarks.",
                "Evaluate competing unequal-life equipment replacement proposals using Equivalent Annual Cost (EAC) analysis.",
                "Calculate the EBIT-EPS financing indifference point to determine optimal capital raising strategies.",
                "Allocate constrained capital budgets across competing enterprise divisions and issue CFO certification."
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
    d_dict["minutes"] = data.get("minutes", data.get("duration", 50 if day_num == 15 else 45))
    
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
    print("\n=== LOADING, ENRICHING & VALIDATING BLOCK 3 (Days 11-15: Milestone 3 Capstone) ===")
    days_data = []
    for d in range(11, 16):
        raw_data = load_day_data(d)
        enriched = enrich_day(raw_data)
        days_data.append(enriched)
        print(f"Loaded and enriched Day {d} data.")

    # Validation
    for d in days_data:
        day_num = d["day"]
        expected_minutes = 50 if day_num == 15 else 45
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
        
    # Check if Day 11 is already present - if so, strip from day 11 onward
    d11_marker = ",\n  {\n    coursePrefix: 'bcom-finance',\n    day: 11,"
    d11_marker_dq = ",\n  {\n    coursePrefix: \"bcom-finance\",\n    day: 11,"
    if d11_marker in ts_content:
        print("Day 11 already present in TS file (single quote), replacing from Day 11 onward...")
        ts_base = ts_content.split(d11_marker)[0]
    elif d11_marker_dq in ts_content:
        print("Day 11 already present in TS file (double quote), replacing from Day 11 onward...")
        ts_base = ts_content.split(d11_marker_dq)[0]
    else:
        # Strip trailing "];\n" or "];"
        ts_base = ts_content.rstrip()
        if ts_base.endswith("];"):
            ts_base = ts_base[:-2].rstrip()

    block3_ts = ",\n" + ",\n".join(format_ts_lesson(d) for d in days_data) + "\n];\n"
    new_ts_content = ts_base + block3_ts

    with open(ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
        
    print(f"Updated {ts_file} with Days 11-15 successfully!")
    print("=== BLOCK 3 ENRICHMENT, VISUALS & ASSEMBLY COMPLETE ===")
    print("🏆 MILESTONE 3 CAPSTONE: CAPITAL BUDGETING & WACC HURDLE ENGINE (DAYS 11-15) COMPLETE!")

if __name__ == "__main__":
    main()
