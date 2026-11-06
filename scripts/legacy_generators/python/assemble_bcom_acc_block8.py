import json
import os

print("=== ASSEMBLING BCOM-ACCOUNTING DAYS 36-40 (BLOCK 8) INTO LONG LESSONS ===")

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
    36: {
        "goal": "Master Ind AS 102 Share-Based Payment: grant-date fair value measurement, Black-Scholes option pricing models, graded vesting attribution schedules (IG11), forfeiture rate adjustments, and cash-settled SAR liability accounting.",
        "recap": "Across Block 7 (Days 31-35), we mastered Ind AS 115, Ind AS 116, Ind AS 113, and Ind AS 109. Today in Day 36, we launch Block 8 by mastering executive equity compensation under Ind AS 102.",
        "summary": [
            "Deconstructed Ind AS 102 equity-settled share-based payment accounting and grant-date fair value freezing.",
            "Modeled 4-year graded vesting schedules under Implementation Guidance 11 preventing straight-line distortion.",
            "Engineered annual employee attrition and forfeiture rate revision true-ups via cumulative catch-up adjustments.",
            "Differentiated equity-settled option reserves from cash-settled Share Appreciation Rights (SAR) liabilities.",
            "Constructed deterministic Python option expense engine confirming IND_AS_102_SHARE_BASED_PAYMENTS_PASS."
        ],
        "projectStep": {
            "title": "Build Enterprise Ind AS 102 Share-Based Compensation Engine",
            "steps": [
                "Parameterize option grant terms: quantity, grant-date fair value, vesting horizon, and forfeiture estimates.",
                "Calculate effective option pool incorporating annual employee turnover attrition curves.",
                "Compute annual straight-line and graded vesting compensation expense allocations.",
                "Formulate dual-entry journal entries crediting Share-Based Payment Reserve in other equity.",
                "Execute deterministic Python unit tests confirming IND_AS_102_SHARE_BASED_PAYMENTS_PASS output."
            ]
        }
    },
    37: {
        "goal": "Master Ind AS 12 Income Taxes: Balance Sheet Liability Method, temporary difference categorization, Section 115BAA corporate tax rate (25.168%), Deferred Tax Asset (DTA) probability criteria, and balance sheet offsetting.",
        "recap": "In Day 36, we mastered Ind AS 102 share-based payment amortization. Today in Day 37, we conquer corporate income taxes and deferred taxation under Ind AS 12.",
        "summary": [
            "Applied the Balance Sheet Liability Method comparing Ind AS carrying amounts against statutory tax bases.",
            "Computed taxable temporary differences creating Deferred Tax Liabilities (DTL) and deductible differences creating Deferred Tax Assets (DTA).",
            "Integrated the enacted Section 115BAA effective corporate tax rate of 25.168% across all temporary differences.",
            "Evaluated the Ind AS 12 Paragraph 24 probability criterion for recognizing DTAs against future taxable profits.",
            "Engineered deterministic Python deferred tax engine confirming IND_AS_12_INCOME_TAXES_DTA_DTL_PASS."
        ],
        "projectStep": {
            "title": "Construct Enterprise Ind AS 12 Balance Sheet Deferred Tax Suite",
            "steps": [
                "Audit enterprise asset and liability portfolios to extract Ind AS carrying values and statutory tax bases.",
                "Quantify taxable temporary differences from accelerated depreciation and lease asset capitalization.",
                "Quantify deductible temporary differences from warranty provisions and lease liabilities.",
                "Compute gross DTL, gross DTA, and net balance sheet deferred tax presentation at 25.168%.",
                "Execute deterministic Python unit tests confirming IND_AS_12_INCOME_TAXES_DTA_DTL_PASS output."
            ]
        }
    },
    38: {
        "goal": "Master Ind AS 33 Earnings Per Share: WANOS calculation, preference dividend adjustments, Treasury Stock Method for options, If-Converted Method for convertible debt, and the Anti-Dilution Principle.",
        "recap": "In Day 37, we mastered Ind AS 12 balance sheet deferred taxation. Today in Day 38, we engineer capital market per-share performance metrics under Ind AS 33.",
        "summary": [
            "Engineered the time-weighted average number of ordinary shares (WANOS) reflecting mid-year equity issuances and buybacks.",
            "Dismantled Basic EPS computation adjusting numerator earnings for cumulative preference dividends.",
            "Applied the Treasury Stock Method to executive options to determine net incremental dilutive shares.",
            "Deployed the If-Converted Method for convertible debentures with after-tax interest savings add-backs.",
            "Enforced the Anti-Dilution Principle and verified capital metrics with IND_AS_33_EARNINGS_PER_SHARE_PASS."
        ],
        "projectStep": {
            "title": "Implement Ind AS 33 Basic & Diluted EPS Calculation Suite",
            "steps": [
                "Determine net profit attributable to ordinary equity holders and compute WANOS for Basic EPS.",
                "Model executive options using the Treasury Stock Method to derive incremental dilutive shares.",
                "Model convertible debt using the If-Converted Method with after-tax interest adjustment.",
                "Verify potential ordinary shares against the anti-dilution threshold to ensure diluted EPS <= basic EPS.",
                "Execute deterministic Python unit tests confirming IND_AS_33_EARNINGS_PER_SHARE_PASS output."
            ]
        }
    },
    39: {
        "goal": "Master Ind AS 37 Provisions, Contingent Liabilities & Contingent Assets: three-tier classification framework, present value discounting, discount unwinding (finance costs), and restructuring provision boundaries.",
        "recap": "In Day 38, we mastered Ind AS 33 diluted EPS engineering. Today in Day 39, we govern uncertain enterprise liabilities and decommissioning obligations under Ind AS 37.",
        "summary": [
            "Deconstructed the Ind AS 37 three-tier criteria distinguishing Provisions, Contingent Liabilities, and Contingent Assets.",
            "Capitalized multi-year decommissioning obligations into Property, Plant and Equipment at present value.",
            "Modeled annual discount unwinding recognized strictly as finance cost in Profit and Loss.",
            "Enforced strict regulatory boundaries on restructuring provisions excluding ongoing operating costs.",
            "Engineered deterministic Python provisions engine confirming IND_AS_37_PROVISIONS_CONTINGENCIES_PASS."
        ],
        "projectStep": {
            "title": "Build Ind AS 37 Decommissioning & Restructuring Valuation Suite",
            "steps": [
                "Establish existence of present legal or constructive obligations arising from past obligating events.",
                "Calculate present value of future decommissioning cash outflows using risk-adjusted discount rates.",
                "Generate multi-year amortization schedules tracking annual discount unwinding into finance costs.",
                "Audit proposed restructuring costs to include direct severance/lease exits and exclude employee retraining.",
                "Execute deterministic Python unit tests confirming IND_AS_37_PROVISIONS_CONTINGENCIES_PASS output."
            ]
        }
    },
    40: {
        "goal": "Execute the Milestone 8 Capstone: simultaneous multi-standard synthesis across Ind AS 102 Share-Based Payments, Ind AS 12 Deferred Taxes, Ind AS 33 Diluted EPS, and Ind AS 37 Provisions inside an enterprise CAO reporting suite.",
        "recap": "Across Block 8 (Days 36-39), we mastered Ind AS 102, Ind AS 12, Ind AS 33, and Ind AS 37. Today in Day 40, you step into the executive role of Chief Accounting Officer to orchestrate the complete corporate tax, equity, and capital structure reporting close.",
        "summary": [
            "Assumed the executive role of Chief Accounting Officer orchestrating corporate reporting close.",
            "Executed Module 1: Ind AS 102 executive option compensation pool amortization and forfeiture modeling.",
            "Executed Module 2: Ind AS 12 balance sheet deferred tax calculation across multi-asset portfolios at 25.168%.",
            "Executed Module 3: Ind AS 33 Treasury Stock Method and If-Converted Method diluted EPS modeling.",
            "Executed Module 4: Ind AS 37 decommissioning present value unwinding and restructuring reserve governance.",
            "Synthesized four-standard reporting interactions and certified completion with CORPORATE_TAX_EQUITY_CAPITAL_SUITE_PASS."
        ],
        "projectStep": {
            "title": "Orchestrate Enterprise Chief Accounting Officer Corporate Reporting Master Suite",
            "steps": [
                "Deploy the unified Corporate Tax, Equity & Capital Reporting Suite software engine.",
                "Process executive equity grants under Ind AS 102 and establish Year 1 compensation expense.",
                "Compute net balance sheet deferred tax liability under Ind AS 12 at the enacted 25.168% rate.",
                "Calculate Basic and Diluted EPS under Ind AS 33 incorporating treasury stock and convertible debt.",
                "Model decommissioning liability present value unwinding and restructuring provisions under Ind AS 37.",
                "Execute deterministic assertions and issue executive CAO certification with CORPORATE_TAX_EQUITY_CAPITAL_SUITE_PASS."
            ]
        }
    }
}

new_lessons = []
for day_num in range(36, 41):
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
        "minutes": 50 if day_num < 40 else 60,
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

print(f"Successfully assembled Days 36-40 into {source_file}!")
