import json
import os

print("=== ASSEMBLING BCOM-ACCOUNTING DAYS 41-45 (BLOCK 9) INTO LONG LESSONS ===")

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
    41: {
        "goal": "Master Ind AS 103 Business Combinations: acquisition method, fair value purchase price allocation (PPA), intangible asset recognition, DTL on fair value step-ups, and proportionate vs full goodwill modeling.",
        "recap": "Across Block 8 (Days 36-40), we mastered share-based payments, deferred taxation, EPS, and provisions. Today in Day 41, we launch Block 9 by conquering M&A accounting and business combinations under Ind AS 103.",
        "summary": [
            "Deconstructed Ind AS 103 acquisition method and purchase consideration components (cash, equity, and earn-out liabilities).",
            "Executed fair value Purchase Price Allocation (PPA) recognizing tangible step-ups and unrecorded patents.",
            "Quantified Deferred Tax Liabilities (DTL) on asset step-ups at 25.168% under Section 115BAA.",
            "Calculated Non-Controlling Interest and Proportionate Goodwill on acquisition date.",
            "Engineered deterministic Python M&A engine confirming IND_AS_103_BUSINESS_COMBINATIONS_PASS."
        ],
        "projectStep": {
            "title": "Build Enterprise Ind AS 103 M&A Purchase Price Allocation Suite",
            "steps": [
                "Aggregate purchase consideration across cash, equity issuance, and contingent earn-out present value.",
                "Audit target net identifiable assets and apply fair value step-ups to PPE and identified patents.",
                "Recognize Deferred Tax Liability on taxable temporary differences at 25.168%.",
                "Derive net identifiable assets acquired and compute non-controlling interest and proportionate goodwill.",
                "Execute deterministic Python unit tests confirming IND_AS_103_BUSINESS_COMBINATIONS_PASS output."
            ]
        }
    },
    42: {
        "goal": "Master Ind AS 110 Consolidated Financial Statements: single control model, line-by-line consolidation, intra-group trading and financing eliminations, downstream unrealized inventory profit adjustments, and NCI profit attribution.",
        "recap": "In Day 41, we mastered Ind AS 103 business combinations and PPA. Today in Day 42, we execute parent-subsidiary operational group consolidation under Ind AS 110.",
        "summary": [
            "Applied the Ind AS 110 single control model across power, variable returns, and linkage criteria.",
            "Executed line-by-line balance sheet and P&L aggregation across parent and subsidiary accounts.",
            "Eliminated intra-group trading revenue, COGS, and intercompany debt financing flows.",
            "Stripped out downstream unrealized inventory profit with deferred tax adjustments under Ind AS 12.",
            "Attributed consolidated profit and comprehensive income between parent equity and non-controlling interest with IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS."
        ],
        "projectStep": {
            "title": "Construct Enterprise Ind AS 110 Group Consolidation Engine",
            "steps": [
                "Combine standalone financial statement line items across parent and controlling subsidiaries.",
                "Formulate journal entries eliminating intercompany turnover and cost of goods sold.",
                "Calculate unrealized intercompany inventory margin and eliminate downstream profit from parent earnings.",
                "Eliminate reciprocal intercompany financing balances and interest income/expense.",
                "Attribute consolidated net income between parent owners and non-controlling interest confirming IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS."
            ]
        }
    },
    43: {
        "goal": "Master Ind AS 111 Joint Arrangements & Ind AS 28 Investments in Associates: joint operations vs joint ventures, direct asset/expense recognition, Equity Method single-line accounting, and downstream unrealized profit elimination.",
        "recap": "In Day 42, we mastered Ind AS 110 subsidiary consolidation. Today in Day 43, we govern collaborative strategic partnerships under Ind AS 111 and Ind AS 28.",
        "summary": [
            "Distinguished Joint Operations from Joint Ventures based on contractual rights and obligations under Ind AS 111.",
            "Accounted for Joint Operations by directly recognizing contractual shares of assets, liabilities, and expenses.",
            "Deployed the Equity Method under Ind AS 28 for strategic associates exercising significant influence.",
            "Eliminated downstream unrealized transaction profit against equity method investment carrying values.",
            "Engineered deterministic Python partnership engine confirming IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS."
        ],
        "projectStep": {
            "title": "Implement Ind AS 111 & Ind AS 28 Strategic Partnership Suite",
            "steps": [
                "Evaluate partnership governance agreements to identify joint operations versus joint ventures.",
                "Incorporate direct shares of joint operation PPE, revenues, and operating expenses into group accounts.",
                "Apply the Equity Method to associates, incorporating post-acquisition net profits and OCI reserves.",
                "Eliminate unrealized profit from downstream equipment sales restricted to the group's equity stake.",
                "Execute deterministic Python unit tests confirming IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS output."
            ]
        }
    },
    44: {
        "goal": "Master Ind AS 112 Disclosure of Interests in Other Entities: significant judgments, material non-controlling interest disclosures, restricted cash covenants, associate reconciliations, and unconsolidated structured entity maximum loss exposure.",
        "recap": "In Day 43, we mastered Ind AS 111 and 28 joint arrangements and associates. Today in Day 44, we construct comprehensive statutory transparency disclosures under Ind AS 112.",
        "summary": [
            "Documented significant judgments and assumptions determining control, joint control, and significant influence.",
            "Structured mandatory financial disclosures for subsidiaries with material non-controlling interests.",
            "Disclosed cash restrictions and debt service reserve covenants ring-fencing subsidiary liquidity.",
            "Prepared detailed net asset and earnings reconciliations for material strategic associates.",
            "Quantified maximum exposure to loss in sponsored unconsolidated structured entities with IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS."
        ],
        "projectStep": {
            "title": "Build Ind AS 112 Statutory Footnote & Structured Entity Disclosure Suite",
            "steps": [
                "Compile summarized financial metrics for subsidiaries with material non-controlling interests.",
                "Quantify and disclose restricted liquidity and regulatory transfer impediments across group entities.",
                "Prepare tabular reconciliations between associate published net assets and group balance sheet carrying values.",
                "Audit unconsolidated structured entities to calculate maximum exposure to loss from debt and credit guarantees.",
                "Execute deterministic Python unit tests confirming IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS output."
            ]
        }
    },
    45: {
        "goal": "Execute the Milestone 9 Capstone: simultaneous multi-standard synthesis across Ind AS 103 Business Combinations, Ind AS 110 Group Consolidation, Ind AS 111/28 Partnerships, and Ind AS 112 Disclosures inside an enterprise CFO M&A reporting simulator.",
        "recap": "Across Block 9 (Days 41-44), we mastered Ind AS 103, Ind AS 110, Ind AS 111, Ind AS 28, and Ind AS 112. Today in Day 45, you assume the executive position of Group Chief Financial Officer and Chief Accounting Officer to orchestrate the complete corporate consolidation, M&A reporting close, and statutory sign-off.",
        "summary": [
            "Assumed the executive role of Group Chief Financial Officer orchestrating multi-entity reporting close.",
            "Executed Module 1: Ind AS 103 enterprise acquisition, fair value PPA, DTL on step-ups, and proportionate goodwill.",
            "Executed Module 2: Ind AS 110 group consolidation, revenue/COGS eliminations, downstream inventory profit stripping, and NCI profit attribution.",
            "Executed Module 3: Ind AS 111 direct joint operation recognition and Ind AS 28 equity method associate accounting.",
            "Executed Module 4: Ind AS 112 structured entity maximum loss exposure and restricted subsidiary cash disclosures.",
            "Synthesized four-standard reporting interactions and certified completion with GROUP_CONSOLIDATION_MA_SUITE_PASS."
        ],
        "projectStep": {
            "title": "Orchestrate Enterprise Group CFO Corporate Consolidation & M&A Master Suite",
            "steps": [
                "Deploy the unified Multi-National Enterprise Group Consolidation & M&A Suite software engine.",
                "Process target acquisition under Ind AS 103, computing net identifiable assets, NCI, and goodwill.",
                "Consolidate parent and subsidiary accounts under Ind AS 110, eliminating internal sales and downstream inventory profit.",
                "Account for joint operations and strategic associates under Ind AS 111 and 28 with unrealized profit adjustments.",
                "Formulate footnote disclosures for structured entities and restricted cash under Ind AS 112.",
                "Execute deterministic assertions and issue executive CFO certification with GROUP_CONSOLIDATION_MA_SUITE_PASS."
            ]
        }
    }
}

new_lessons = []
for day_num in range(41, 46):
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
        "minutes": 50 if day_num < 45 else 60,
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

print(f"Successfully assembled Days 41-45 into {source_file}!")
