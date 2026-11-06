import json
import os

print("=== ASSEMBLING BCOM-ACCOUNTING DAYS 51-55 (BLOCK 11) INTO LONG LESSONS ===")

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
    51: {
        "goal": "Master Ind AS 36 / IAS 36 Impairment of Assets: Cash-Generating Units (CGU), external/internal indicators, Recoverable Amount (higher of FVLCOD and VIU via 5-year DCF), two-tier waterfall loss allocation (goodwill elimination, pro-rata distribution to PPE/intangibles), and strict prohibition against goodwill reversal under Ind AS 36.124.",
        "recap": "Across Block 10 (Days 46-50), we mastered financial statement diagnostics, DuPont ROE decomposition, combined leverage dynamics, and forensic Beneish M-Score fraud detection. Today in Day 51, we launch Block 11 by conquering asset impairment testing, DCF Value in Use modeling, and goodwill write-downs under Ind AS 36.",
        "summary": [
            "Identified Ind AS 36 scope inclusions across PPE, intangibles, and CGUs, and mandatory annual testing for goodwill and indefinite-life intangibles.",
            "Modeled 5-year discounted cash flow Value in Use (VIU = $32,864,199.21) at 12.0% pre-tax WACC, establishing Recoverable Amount over FVLCOD ($31.0M).",
            "Calculated total CGU impairment loss of $11,135,800.79 against $44.0M initial balance sheet carrying values.",
            "Executed two-tier allocation waterfall: writing down goodwill 100% ($4.0M to $0.00) and allocating $7.136M pro-rata across machinery ($3.21M), software ($1.78M), and premises ($2.14M).",
            "Enforced prospective depreciation recalibration and the absolute statutory ban on goodwill reversals confirming IND_AS_36_ASSET_IMPAIRMENT_PASS."
        ],
        "projectStep": {
            "title": "Construct Enterprise Ind AS 36 Asset Impairment Suite",
            "steps": [
                "Audit Cash-Generating Unit (CGU) balance sheet carrying values across goodwill, PPE, and intangibles.",
                "Calculate Value in Use using multi-period discounted cash flow projections and pre-tax WACC discount rate.",
                "Determine Recoverable Amount as higher of Fair Value Less Costs of Disposal and Value in Use.",
                "Execute two-tier impairment loss allocation waterfall, writing down goodwill first and pro-rata across other assets.",
                "Execute deterministic Python unit tests confirming IND_AS_36_ASSET_IMPAIRMENT_PASS output."
            ]
        }
    },
    52: {
        "goal": "Master Ind AS 38 / IAS 38 Intangible Assets: identifiability criteria (separability vs contractual-legal rights), research phase expensing vs development phase capitalization under the six PIRATE criteria, prohibition of retroactive capitalization under Ind AS 38.71, finite vs indefinite useful life, and amortization mechanics.",
        "recap": "In Day 51, we mastered asset impairment testing under Ind AS 36. Today in Day 52, we govern the creation, capitalization, and amortization of intellectual property, software, and pharmaceutical R&D under Ind AS 38.",
        "summary": [
            "Deconstructed Ind AS 38 definition, identifiability criteria (separability or contractual-legal rights), and control prerequisites.",
            "Enforced mandatory expensing of $5,000,000.00 research costs and $2,500,000.00 pre-PIRATE development costs directly to P&L ($7.5M total).",
            "Capitalized $24,000,000.00 of qualifying post-PIRATE clinical development expenditures as Intangible Assets under Development.",
            "Computed 8-year straight-line patent amortization ($1,500,000.00 for 6 months), establishing closing patent carrying amount of $22,500,000.00.",
            "Accounted for $8,000,000.00 indefinite-life brand with zero amortization and mandatory annual impairment testing confirming IND_AS_38_INTANGIBLE_ASSETS_PASS."
        ],
        "projectStep": {
            "title": "Build Enterprise Ind AS 38 Intangibles R&D Capitalization & Amortization Suite",
            "steps": [
                "Track internal R&D project expenditures across discrete research and development phases.",
                "Expense all research and pre-PIRATE formulation costs to profit or loss, enforcing non-retroactivity.",
                "Capitalize qualifying development costs meeting all six PIRATE criteria into Intangibles under Development.",
                "Reclassify commercialized intangibles and compute systematic amortization over finite economic useful life.",
                "Execute deterministic Python unit tests confirming IND_AS_38_INTANGIBLE_ASSETS_PASS output."
            ]
        }
    },
    53: {
        "goal": "Master Ind AS 113 / IFRS 13 Fair Value Measurement: exit price paradigm, principal market primacy over most advantageous market, transport costs vs transaction costs, Highest and Best Use (HBU) for non-financial assets, the three valuation techniques (Market, Income, Cost), and the three-tier Fair Value Hierarchy (Levels 1, 2, and 3).",
        "recap": "In Day 52, we mastered intangible assets and R&D capitalization under Ind AS 38. Today in Day 53, we conquer the unified valuation framework of Ind AS 113 across financial and non-financial assets.",
        "summary": [
            "Applied the exit price definition and enforced principal market primacy over the most advantageous market.",
            "Valued non-financial real estate under Highest and Best Use ($19.5M net commercial redevelopment), uncovering an $11.0M HBU premium over existing warehouse use.",
            "Deployed the three universal valuation techniques: Market Approach (multiples/matrix pricing), Income Approach (DCF/options), and Cost Approach (depreciated replacement cost).",
            "Classified portfolio across Level 1 quoted equity ($4.50M / 8.65%), Level 2 matrix swaps ($12.85M / 24.69%), and Level 3 real estate/private equity ($34.70M / 66.67%).",
            "Constructed Level 3 DCF sensitivity disclosures and verified portfolio total ($52,050,000.00) confirming IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS."
        ],
        "projectStep": {
            "title": "Construct Enterprise Ind AS 113 Fair Value Valuation & Hierarchy Suite",
            "steps": [
                "Evaluate exit prices in principal markets for quoted financial instruments under Level 1.",
                "Apply matrix pricing using observable yield curves and credit default spreads under Level 2.",
                "Perform Highest and Best Use (HBU) valuation for real estate, accounting for redevelopment and demolition costs.",
                "Execute discounted cash flow valuation for Level 3 unobservable private equity with discount rate sensitivity matrices.",
                "Execute deterministic Python unit tests confirming IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS output."
            ]
        }
    },
    54: {
        "goal": "Master Ind AS 105 / IFRS 5 Non-Current Assets Held for Sale & Discontinued Operations: classification criteria (available for immediate sale and highly probable within 12 months), disposal group measurement at lower of carrying amount and FVLCTS, absolute cessation of depreciation under Ind AS 105.25, and single-line post-tax presentation on the face of P&L.",
        "recap": "In Day 53, we mastered fair value measurement under Ind AS 113. Today in Day 54, we govern corporate divestitures, disposal groups held for sale, and discontinued operations accounting under Ind AS 105.",
        "summary": [
            "Verified the two cumulative conditions for held-for-sale classification: available for immediate sale and highly probable within one year.",
            "Measured disposal group at lower of carrying amount ($32.0M net) and FVLCTS ($27.5M), recognizing a $4,500,000.00 write-down.",
            "Allocated write-down: eliminating $2,000,000.00 goodwill and allocating $2,500,000.00 pro-rata to plant ($1.25M), buildings ($892.86k), and patents ($357.14k).",
            "Enforced absolute cessation of depreciation from classification date, saving $1.2M in P&L charges.",
            "Synthesized division operating revenues ($18M), opex ($15M), write-down (-$4.5M), and 25.168% tax benefit ($377.52k) into a single-line post-tax loss of -$1,122,480.00 confirming IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS."
        ],
        "projectStep": {
            "title": "Implement Enterprise Ind AS 105 Disposal Group & Discontinued Operations Suite",
            "steps": [
                "Validate held-for-sale criteria including board commitment, active marketing, and 12-month completion expectation.",
                "Calculate Net Fair Value Less Costs to Sell (FVLCTS) and recognize measurement impairment loss.",
                "Allocate write-down to goodwill first and pro-rata across qualifying non-current assets.",
                "Halt depreciation immediately on all disposal group non-current assets.",
                "Formulate single-line post-tax presentation for discontinued operations on the face of P&L confirming IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS."
            ]
        }
    },
    55: {
        "goal": "Execute the Milestone 11 Capstone: simultaneous multi-standard synthesis across Ind AS 36 Asset Impairment, Ind AS 38 Intangibles R&D, Ind AS 113 Fair Value Hierarchy, and Ind AS 105 Disposal Groups inside an enterprise CFO Corporate Asset Valuation & Reporting Simulator.",
        "recap": "Across Block 11 (Days 51-54), we mastered asset impairments, R&D intangibles, multi-tier fair value measurement, and held-for-sale disposal groups. Today in Day 55, you assume the executive roles of Group CFO and Lead Valuation Partner to orchestrate complete corporate asset valuation, board presentation, and statutory audit sign-off.",
        "summary": [
            "Assumed the executive mandate of Group Chief Financial Officer and Lead Forensic Valuation Partner.",
            "Executed Module 1: Ind AS 36 Robotics CGU impairment ($44M carrying, VIU $32.86M at 12% WACC, $11.14M loss, $4M goodwill eliminated).",
            "Executed Module 2: Ind AS 38 Oncology R&D ($7.5M expensed, $24M capitalized, $1.5M amortization, $8M indefinite brand, $30.5M total intangibles).",
            "Executed Module 3: Ind AS 113 fair value portfolio ($52.05M total: Level 1 $4.5M, Level 2 $12.85M, Level 3 $34.7M including $19.5M HBU real estate).",
            "Executed Module 4: Ind AS 105 turbine disposal group ($32M carrying, FVLCTS $27.5M, $4.5M write-down, -$1.12M single-line discontinued P&L).",
            "Synthesized all four valuation domains and certified completion with CORPORATE_ASSET_VALUATION_IMPAIRMENT_SUITE_PASS."
        ],
        "projectStep": {
            "title": "Orchestrate Enterprise Group CFO Corporate Asset Valuation & Impairment Suite",
            "steps": [
                "Deploy the unified Corporate Asset Valuation, Impairment & Fair Value Suite software engine.",
                "Execute CGU impairment testing under Module 1, allocating write-downs across goodwill and non-current assets.",
                "Govern R&D capitalization and patent/brand amortization under Module 2, tracking finite and indefinite lives.",
                "Measure portfolio fair values across the three-tier hierarchy under Module 3 with HBU and DCF sensitivity analysis.",
                "Account for held-for-sale divestitures and single-line discontinued operations under Module 4.",
                "Execute deterministic assertions and issue executive CFO certification with CORPORATE_ASSET_VALUATION_IMPAIRMENT_SUITE_PASS."
            ]
        }
    }
}

new_lessons = []
for day_num in range(51, 56):
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
        "minutes": 50 if day_num < 55 else 60,
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

print(f"Successfully assembled Days 51-55 into {source_file}!")
