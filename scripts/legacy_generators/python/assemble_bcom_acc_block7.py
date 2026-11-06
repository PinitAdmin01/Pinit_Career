import json
import os

print("=== ASSEMBLING BCOM-ACCOUNTING DAYS 31-35 (BLOCK 7) INTO LONG LESSONS ===")

source_file = "src/lib/data/bcomAccountingLongLessons.ts"
with open(source_file, "r", encoding="utf-8") as f:
    existing_ts = f.read()

# Verify existing array ending
pos = existing_ts.rfind("];")
if pos == -1:
    raise ValueError("Could not find array closing '];' in bcomAccountingLongLessons.ts")

base_ts = existing_ts[:pos].rstrip()
if base_ts.endswith(","):
    base_ts = base_ts[:-1].rstrip()

day_metadata = {
    31: {
        "goal": "Master the Ind AS 115 5-Step Revenue Model: performance obligations, relative Standalone Selling Price (SSP) allocation, variable consideration constraint, over-time vs point-in-time recognition, and contract liability accounting.",
        "recap": "In Month 1, we mastered foundational accrual bookkeeping, double-entry mechanics, Schedule III corporate balance sheets, and tax audit reporting. Today in Day 31, we launch Month 2: Advanced Corporate Reporting & Converged Accounting Standards with Ind AS 115.",
        "summary": [
            "Deconstructed the mandatory Ind AS 115 5-Step Revenue Recognition framework and legal enforceability criteria.",
            "Applied relative Standalone Selling Price (SSP) allocation across multi-element bundled software and hardware enterprise contracts.",
            "Enforced the variable consideration reversal constraint and evaluated commercial financing components.",
            "Differentiated point-in-time asset transfers from over-time performance obligation satisfaction schedules.",
            "Engineered deterministic Python revenue allocation engine verifying contract liabilities and balance sheet accruals."
        ],
        "projectStep": {
            "title": "Construct Enterprise Ind AS 115 Revenue Allocation & Contract Liability Engine",
            "steps": [
                "Establish contract performance obligations and identify distinct goods and service deliverables.",
                "Calculate relative standalone selling price percentages and allocate discounted enterprise consideration.",
                "Differentiate point-in-time hardware delivery from over-time cloud subscription amortization.",
                "Calculate Year 1 recognized earned revenue and record remaining deferred contract liability on the balance sheet.",
                "Execute deterministic Python unit tests confirming IND_AS_115_REVENUE_CONTRACT_PASS output."
            ]
        }
    },
    32: {
        "goal": "Master the Ind AS 116 single lessee accounting model: Right-of-Use (ROU) asset and lease liability capitalization at IBR, effective interest amortization, straight-line depreciation, and EBITDA reclassification.",
        "recap": "In Day 31, we mastered Ind AS 115 relative SSP revenue allocation. Today in Day 32, we bring off-balance-sheet operating leases onto the financial statements under Ind AS 116.",
        "summary": [
            "Mastered the single lessee accounting model under Ind AS 116 eliminating off-balance-sheet operating lease arbitrage.",
            "Capitalized lease liabilities using discounted present values at Incremental Borrowing Rates (IBR).",
            "Constructed initial Right-of-Use (ROU) assets including direct legal, brokerage, and site restoration expenditures.",
            "Analyzed the P&L front-loading effect: front-heavy interest expense combined with straight-line asset depreciation.",
            "Quantified EBITDA expansion and operating cash flow reclassification for corporate debt covenant defense."
        ],
        "projectStep": {
            "title": "Build Ind AS 116 Single Lessee Capitalization & Amortization Suite",
            "steps": [
                "Determine lease contract parameters: annual lease installments, non-cancellable lease term, and discount rate IBR.",
                "Compute the present value of future lease liabilities and capitalize initial direct costs into the ROU Asset.",
                "Formulate multi-year effective interest amortization schedules and straight-line depreciation tables.",
                "Quantify Year 1 total P&L expense charge, initial front-loading drag, and EBITDA expansion metrics.",
                "Execute deterministic Python unit tests confirming IND_AS_116_ROU_LEASE_LIABILITY_PASS output."
            ]
        }
    },
    33: {
        "goal": "Master Ind AS 113 Fair Value Measurement: exit price concepts, principal vs most advantageous market analysis, Highest and Best Use (HBU), Level 1-3 valuation hierarchy, and Level 3 DCF models with Credit Valuation Adjustments (CVA).",
        "recap": "In Day 32, we mastered Ind AS 116 lease liability amortization. Today in Day 33, we navigate fair value measurement and valuation governance under Ind AS 113.",
        "summary": [
            "Deconstructed the Ind AS 113 exit price definition, principal market identification, and transaction cost exclusions.",
            "Evaluated the Highest and Best Use (HBU) valuation principle for non-financial commercial assets.",
            "Navigated the three-level fair value hierarchy: Level 1 active quotes, Level 2 observable inputs, and Level 3 unobservable models.",
            "Constructed multi-period Level 3 Discounted Cash Flow (DCF) models integrating liquidity risk premiums.",
            "Incorporated counterparty Credit Valuation Adjustments (CVA) and Debit Valuation Adjustments (DVA) for non-performance risk."
        ],
        "projectStep": {
            "title": "Engineer Ind AS 113 Level 3 DCF & CVA Valuation Engine",
            "steps": [
                "Map asset classes to appropriate levels within the Ind AS 113 fair value hierarchy.",
                "Model projected unobservable cash flow streams across multi-year investment horizons.",
                "Discount cash flows using risk-adjusted discount rates reflecting market participant assumptions.",
                "Incorporate non-performance risk through quantitative Credit Valuation Adjustments (CVA).",
                "Execute deterministic Python unit tests confirming IND_AS_113_FAIR_VALUE_HIERARCHY_PASS output."
            ]
        }
    },
    34: {
        "goal": "Master Ind AS 109 Financial Instruments: Business Model and SPPI tests, Amortized Cost, FVTOCI, FVTPL, forward-looking Three-Stage Expected Credit Loss (ECL) modeling, and trade receivables provision matrices.",
        "recap": "In Day 33, we mastered Ind AS 113 Level 3 fair value DCF models. Today in Day 34, we master the forward-looking credit loss impairment framework under Ind AS 109.",
        "summary": [
            "Executed the dual Business Model test and Solely Payments of Principal and Interest (SPPI) test under Ind AS 109.",
            "Classified financial assets into Amortized Cost, Fair Value Through OCI (FVTOCI), and Fair Value Through P&L (FVTPL).",
            "Dismantled the forward-looking Three-Stage Expected Credit Loss (ECL) impairment model.",
            "Engineered credit migration surveillance identifying Significant Increase in Credit Risk (SICR) triggers.",
            "Designed simplified provision matrices for trade receivables incorporating forward-looking macroeconomic scalars."
        ],
        "projectStep": {
            "title": "Implement Ind AS 109 Forward-Looking ECL Credit Impairment Suite",
            "steps": [
                "Execute classification tests on corporate debt, equity holdings, and commercial credit assets.",
                "Evaluate credit surveillance metrics to detect Significant Increase in Credit Risk (SICR) migrations.",
                "Calculate Stage 2 lifetime expected credit losses utilizing the tripartite formula (EAD * PD * LGD).",
                "Establish trade receivables aging provision matrices with historical loss rates and forward-looking economic overlays.",
                "Execute deterministic Python unit tests confirming IND_AS_109_ECL_FINANCIAL_INSTRUMENTS_PASS output."
            ]
        }
    },
    35: {
        "goal": "Execute the Milestone 7 Grand Capstone: simultaneous multi-standard synthesis across Ind AS 115 Revenue, Ind AS 116 Leases, Ind AS 113 Fair Value, and Ind AS 109 Expected Credit Losses inside an enterprise controller reporting engine.",
        "recap": "Across Block 7 (Days 31-34), we mastered Ind AS 115, Ind AS 116, Ind AS 113, and Ind AS 109. Today in Day 35, you step into the executive role of Group Financial Controller to orchestrate the complete converged financial statements close.",
        "summary": [
            "Assumed the executive role of Group Financial Controller orchestrating converged Ind AS consolidated financial statements.",
            "Executed Module 1: Ind AS 115 relative Standalone Selling Price (SSP) allocation and contract liability scheduling.",
            "Executed Module 2: Ind AS 116 lease liability capitalization at IBR, ROU asset scheduling, and EBITDA normalization.",
            "Executed Module 3: Ind AS 113 Level 3 DCF valuation incorporating quantitative Credit Valuation Adjustments (CVA).",
            "Executed Module 4: Ind AS 109 Stage 2 SICR credit impairment evaluation and lifetime ECL provisioning.",
            "Synthesized multi-standard financial statement interactions and certified true and fair view with ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS."
        ],
        "projectStep": {
            "title": "Orchestrate Enterprise Financial Controller Converged Ind AS Master Suite",
            "steps": [
                "Deploy the unified Enterprise Financial Controller Suite software engine.",
                "Process multi-element commercial contracts under Ind AS 115 and reconcile Year 1 earned vs deferred revenue.",
                "Capitalize corporate lease facilities under Ind AS 116 and quantify interest, depreciation, and EBITDA expansion.",
                "Value unquoted strategic investments under Ind AS 113 Level 3 DCF with counterparty CVA adjustments.",
                "Quantify Stage 2 corporate loan impairment reserves under Ind AS 109 forward-looking ECL formulas.",
                "Execute deterministic assertions and issue executive controller certification with ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS."
            ]
        }
    }
}

new_lessons = []
for day_num in range(31, 36):
    day_file = f"scripts/bcom_acc_day{day_num}.json"
    with open(day_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    meta = day_metadata[day_num]
    
    # Enrich parts with why, answerIndex, explanation
    enriched_parts = []
    for p in data["parts"]:
        ch = p["check"]
        check_obj = {
            "question": ch["question"],
            "options": ch["options"],
            "answer": 0,
            "answerIndex": 0,
            "why": ch.get("why") or ch.get("explanation", ""),
            "explanation": ch.get("explanation") or ch.get("why", "")
        }
        enriched_parts.append({
            "part": p["part"],
            "title": p["title"],
            "say": p["say"],
            "code": p["code"],
            "output": p["output"],
            "check": check_obj
        })
        
    lesson_obj = {
        "id": f"bcom_acc-day-{day_num}",
        "coursePrefix": "bcom-accounting",
        "course": "Corporate & Financial Accounting",
        "day": day_num,
        "title": data["title"],
        "goal": meta["goal"],
        "minutes": 50 if day_num < 35 else 60,
        "recap": meta["recap"],
        "parts": enriched_parts,
        "summary": meta["summary"],
        "projectStep": meta["projectStep"]
    }
    new_lessons.append(lesson_obj)

# Format as TypeScript code
formatted_lessons_json = json.dumps(new_lessons, indent=2)
# Strip outer brackets [ ]
inner_json = formatted_lessons_json.strip()
if inner_json.startswith("[") and inner_json.endswith("]"):
    inner_json = inner_json[1:-1].strip()

updated_ts = base_ts + ",\n  " + inner_json + "\n];\n"

with open(source_file, "w", encoding="utf-8") as f:
    f.write(updated_ts)

print(f"Successfully assembled Days 31-35 into {source_file}!")
