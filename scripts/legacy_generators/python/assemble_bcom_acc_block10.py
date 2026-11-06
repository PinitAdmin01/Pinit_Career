import json
import os

print("=== ASSEMBLING BCOM-ACCOUNTING DAYS 46-50 (BLOCK 10) INTO LONG LESSONS ===")

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
    46: {
        "goal": "Master Financial Statement Diagnostics & Advanced Ratio Analysis: liquidity architecture (Current, Quick, Cash, Defensive Interval), solvency gearing (Debt-to-Equity, Debt-to-Capital, ICR, DSCR with principal tax gross-up), and Cash Conversion Cycle optimization under MCA 2021 Schedule III and Section 43B(h).",
        "recap": "Across Block 9 (Days 41-45), we mastered corporate group consolidation, joint arrangements, and M&A reporting under Ind AS 103, 110, 111, 28, and 112. Today in Day 46, we launch Block 10 by mastering comprehensive financial statement diagnostics, solvency stress-testing, and working capital cycle velocity.",
        "summary": [
            "Analyzed short-term liquidity buffers: Current Ratio (2.0:1), Quick Ratio (1.18:1), and Cash Ratio (0.45:1).",
            "Calculated Defensive Interval Ratio (DIR) proving 98.9 days of operational burn coverage without new sales.",
            "Formulated solvency covenants: Debt-to-Equity (0.67:1), Interest Coverage (6.0x), and tax-adjusted DSCR (3.0x).",
            "Optimized the Cash Conversion Cycle (CCC = 79.1 days) across DIO (91.2d), DSO (48.7d), and DPO (60.8d).",
            "Engineered deterministic Python diagnostic engine confirming FINANCIAL_RATIO_DIAGNOSTICS_PASS."
        ],
        "projectStep": {
            "title": "Construct Enterprise Financial Statement Diagnostics Engine",
            "steps": [
                "Compute short-term liquidity buffers including Current, Quick, Cash, and Defensive Interval ratios.",
                "Calculate financial leverage and solvency ratios including Debt-to-Equity and Interest Coverage.",
                "Compute Debt Service Coverage Ratio applying corporate income tax gross-up to debt principal repayments.",
                "Audit working capital velocity by calculating DIO, DSO, DPO, and Cash Conversion Cycle.",
                "Execute deterministic Python unit tests confirming FINANCIAL_RATIO_DIAGNOSTICS_PASS output."
            ]
        }
    },
    47: {
        "goal": "Master DuPont Analysis & Return on Equity (ROE) Decomposition: traditional 3-Stage and extended 5-Stage models (Tax Burden, Interest Burden, Operating Margin, Asset Turnover, Leverage Multiplier), Return on Invested Capital (ROIC), and Stern Stewart Economic Value Added (EVA) under SEBI LODR Regulation 34.",
        "recap": "In Day 46, we mastered liquidity, solvency, and working capital diagnostics. Today in Day 47, we deconstruct corporate profitability and shareholder value creation using 5-stage DuPont decomposition and Economic Value Added.",
        "summary": [
            "Deconstructed Return on Equity (ROE) into the traditional 3-stage model (Net Profit Margin, Asset Turnover, Financial Leverage).",
            "Expanded DuPont analysis into the 5-stage extended model isolating Tax Burden (0.7483) and Interest Burden (0.8333).",
            "Quantified Operating Margin (20.0%) and Asset Turnover (0.9677), verifying that 24.94% ROE is driven by operational efficiency.",
            "Computed Net Operating Profit After Tax (NOPAT = $17.96M) and Return on Invested Capital (ROIC = 19.11%).",
            "Calculated Stern Stewart Economic Value Added (EVA = $7,149,680.00) confirming DUPONT_ROE_DECOMPOSITION_PASS."
        ],
        "projectStep": {
            "title": "Build Enterprise DuPont ROE Decomposition & EVA Valuation Suite",
            "steps": [
                "Implement 3-stage DuPont model decomposing ROE into margin, turnover, and leverage.",
                "Implement 5-stage extended DuPont model isolating tax burden and interest burden factors.",
                "Derive NOPAT and calculate Invested Capital from operating debt, equity, and excess cash.",
                "Compute ROIC and compare against WACC to determine economic return spread.",
                "Calculate Stern Stewart Economic Value Added confirming DUPONT_ROE_DECOMPOSITION_PASS."
            ]
        }
    },
    48: {
        "goal": "Master Operating & Financial Leverage Dynamics: Degree of Operating Leverage (DOL), Degree of Financial Leverage (DFL), Degree of Combined Leverage (DCL), EBIT-EPS Indifference Analysis, and Altman Z-Score Insolvency Prediction under the Insolvency and Bankruptcy Code (IBC 2016).",
        "recap": "In Day 47, we mastered DuPont decomposition and Economic Value Added. Today in Day 48, we evaluate structural business risk, capital structure optimization, and insolvency risk using combined leverage and the Altman Z-Score.",
        "summary": [
            "Quantified Degree of Operating Leverage (DOL = 1.60x) measuring operating profit elasticity relative to sales volume.",
            "Quantified Degree of Financial Leverage (DFL = 1.25x) measuring EPS sensitivity to operating income.",
            "Computed Degree of Combined Leverage (DCL = 2.00x) verifying balanced risk under the Law of Inverse Leverage.",
            "Calculated capital structure EBIT-EPS Indifference Point ($12,500,000.00) proving debt financing superiority.",
            "Evaluated bankruptcy risk via the 5-variable Altman Z-Score (Z = 3.92) confirming LEVERAGE_AND_DISTRESS_ANALYSIS_PASS."
        ],
        "projectStep": {
            "title": "Implement Enterprise Leverage Analysis & Altman Z-Score Suite",
            "steps": [
                "Calculate Degree of Operating Leverage from gross contribution and operating earnings.",
                "Calculate Degree of Financial Leverage from EBIT and pre-tax profit after interest expense.",
                "Compute Degree of Combined Leverage verifying total business risk equilibrium.",
                "Formulate EBIT-EPS indifference equations to optimize capital structure financing choices.",
                "Compute 5-variable Altman Z-Score confirming LEVERAGE_AND_DISTRESS_ANALYSIS_PASS."
            ]
        }
    },
    49: {
        "goal": "Master Quality of Earnings & Forensic Accounting Diagnostics: cash flow realism, Sloan Accrual Anomaly analysis, balance-sheet vs cash-flow accrual metrics, and the 8-variable Beneish M-Score manipulation detection model under CARO 2020 and Section 143(12).",
        "recap": "In Day 48, we mastered leverage dynamics and bankruptcy prediction. Today in Day 49, we transition to forensic accounting to audit earnings quality and detect financial statement manipulation using Sloan accruals and the Beneish M-Score.",
        "summary": [
            "Evaluated Cash Flow Realism (CFO / Net Income = 1.20x), confirming high cash realization of reported profits.",
            "Calculated Richard Sloan's Total Accruals (-$3,033,600.00) and Accrual Ratio (-2.59%), proving superior earnings persistence.",
            "Computed the 8 variables of the Beneish M-Score model: DSRI, GMI, AQI, SGI, DEPI, SGAI, LVGI, and TATA.",
            "Synthesized the Beneish M-Score (-2.09), confirming low probability of financial statement manipulation below the -1.78 threshold.",
            "Engineered deterministic Python forensic engine confirming EARNINGS_QUALITY_FORENSIC_PASS."
        ],
        "projectStep": {
            "title": "Build Enterprise Earnings Quality & Forensic Fraud Detection Suite",
            "steps": [
                "Compute Cash Flow Realism ratio comparing operating cash flows to accounting net income.",
                "Calculate Sloan Total Accruals and Accrual Ratio relative to average total assets.",
                "Compute the 8 Beneish manipulation indices including DSRI, GMI, AQI, and SGI.",
                "Synthesize the aggregate Beneish M-Score and classify manipulation risk against the -1.78 benchmark.",
                "Execute deterministic Python unit tests confirming EARNINGS_QUALITY_FORENSIC_PASS."
            ]
        }
    },
    50: {
        "goal": "Execute the Milestone 10 Capstone: simultaneous multi-domain synthesis across Financial Ratio Diagnostics, 5-Stage DuPont & EVA, Combined Leverage & Altman Z-Score, and Forensic Beneish M-Score inside an enterprise CFO Corporate Diagnostics Simulator.",
        "recap": "Across Block 10 (Days 46-49), we mastered ratio diagnostics, DuPont ROE decomposition, leverage dynamics, and forensic accounting. Today in Day 50, you assume the executive roles of Group CFO and Lead Forensic Auditor to orchestrate complete corporate diagnostics, board presentation, and statutory audit sign-off.",
        "summary": [
            "Assumed the dual executive mandate of Group Chief Financial Officer and Lead Forensic Audit Partner.",
            "Executed Module 1: balance sheet liquidity, tax-adjusted DSCR covenant (3.0x), and cash conversion cycle velocity (79.1d).",
            "Executed Module 2: 5-stage DuPont ROE decomposition (24.94%), ROIC (19.11%), and Stern Stewart EVA ($7,149,680.00).",
            "Executed Module 3: operating and financial leverage (DCL 2.0x), EBIT-EPS indifference ($12.5M), and Altman Z-Score (3.92 Safe Zone).",
            "Executed Module 4: Sloan accrual analysis (-2.59% Accrual Ratio) and 8-variable Beneish M-Score (-2.09 Low Risk).",
            "Synthesized all four diagnostic domains and certified completion with CORPORATE_FINANCIAL_DIAGNOSTICS_SUITE_PASS."
        ],
        "projectStep": {
            "title": "Orchestrate Enterprise Group CFO Corporate Financial Diagnostics & Forensic Audit Suite",
            "steps": [
                "Deploy the unified Corporate Financial Diagnostics & Forensic Audit Suite master engine.",
                "Execute liquidity and solvency stress-testing under Module 1, verifying bank covenants and working capital velocity.",
                "Deconstruct profitability under Module 2, computing 5-stage DuPont ROE, invested capital, ROIC, and economic profit (EVA).",
                "Quantify total business risk and insolvency immunity under Module 3 via combined leverage and the Altman Z-Score.",
                "Audit earnings quality and fraud risk under Module 4 via Sloan accruals and the 8-variable Beneish M-Score.",
                "Execute deterministic assertions and issue executive CFO certification with CORPORATE_FINANCIAL_DIAGNOSTICS_SUITE_PASS."
            ]
        }
    }
}

new_lessons = []
for day_num in range(46, 51):
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
        "minutes": 50 if day_num < 50 else 60,
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

print(f"Successfully assembled Days 46-50 into {source_file}!")
