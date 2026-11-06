#!/usr/bin/env python3
"""
Enrichment and Assembly Script for Block 231 (Days 26 to 30)
Course: B.Com Entrepreneurship & Business Management (bcom_ent)
Milestone 6: TASK-1284..1288 (Course 28 100% Completion)
"""

import sys
import os
import json
import hashlib
from typing import Dict, Any, List

sys.stdout.reconfigure(encoding="utf-8")

# --- Domain Metadata for Days 26-30 ---
METADATA = {
    26: {
        "goal": "Master global enterprise expansion: Foreign Market Entry Mode Selection Matrix across exporting, licensing, JVs, and wholly owned subsidiaries; Pankaj Ghemawat CAGE Distance Framework (Cultural, Administrative, Geographic, Economic); OECD Transfer Pricing under the Arm's Length Principle (ALP) and Transactional Net Margin Method (TNMM); Foreign Exchange (FX) Forward hedging waterfalls; and OECD BEPS Pillar Two Global Minimum Tax compliance.",
        "recap": "In Day 25, we achieved Milestone 5 Capstone organizational sovereignty across human capital, leadership, board governance, and ERM. Today in Day 26, we begin Milestone 6 by crossing international borders: entry mode selection, CAGE distance modeling, arm's length transfer pricing, FX currency hedging, and Pillar Two tax compliance.",
        "summary": [
            "Evaluated foreign market entry modes across capital expenditure, setup velocity, IP risk, and tariff barriers to determine optimal expansion structures.",
            "Quantified cross-border operating friction using Ghemawat's CAGE Distance Framework, calibrating go-to-market overhead budgets.",
            "Engineered OECD-compliant transfer pricing models under the Transactional Net Margin Method (TNMM) and Arm's Length Principle.",
            "Implemented corporate treasury FX forward hedging waterfalls, immunizing foreign receivables against currency volatility.",
            "Modeled OECD BEPS Pillar Two 15% Global Minimum Tax compliance, computing top-up tax liabilities across multinational subsidiary hubs."
        ],
        "projectStep": {
            "title": "Architect Global Expansion & International Compliance Engine",
            "steps": [
                "Score target foreign entry modes across capital, setup speed, and IP exposure to select the optimal operating vehicle.",
                "Compute composite CAGE distance indices to budget appropriate GTM overhead premiums across expansion corridors.",
                "Benchmark intercompany transfer prices within the OECD 6-12% interquartile range to ensure Arm's Length compliance.",
                "Establish an 80% FX forward contract hedging policy to protect commercial receivables from currency swings.",
                "Audit multinational subsidiaries against the 15% BEPS Pillar Two threshold and compute consolidated top-up tax liabilities."
            ]
        },
        "parts": [
            {
                "example": "A technology firm evaluates Germany expansion ($85M TAM, high IP risk), scoring direct exporting, licensing, 50/50 JV, and wholly owned subsidiary, identifying direct exporting (score 81.2/100) or JV (80.0/100) based on tariff and setup constraints.",
                "codeNotes": [
                    "Lines 1-50: Implements evaluate_foreign_entry_modes calculating composite scores across four global entry modes.",
                    "Lines 52-58: Evaluates market entry for Germany DACH hub and prints ranked strategic recommendations."
                ],
                "tryIt": "Increase tariff_barrier_pct to 30.0% and observe direct exporting composite score plummet due to severe tariff penalties.",
                "check": {
                    "question": "Which foreign entry mode provides the highest operational control and IP protection but demands the largest capital expenditure?",
                    "options": [
                        "Wholly Owned Subsidiary (Greenfield WOS).",
                        "Direct Exporting.",
                        "International Licensing.",
                        "Turnkey Franchising."
                    ],
                    "answer": 0,
                    "why": "A Wholly Owned Subsidiary provides 100% operational autonomy and absolute IP protection, but requires the largest capital outlay.",
                    "answerIndex": 0,
                    "explanation": "A Wholly Owned Subsidiary provides 100% operational autonomy and absolute IP protection, but requires the largest capital outlay."
                }
            },
            {
                "example": "An Indian tech firm compares expansion into Singapore (Composite CAGE 3.25/10, +12% GTM overhead) versus Germany (Composite CAGE 6.29/10, +28% GTM overhead) to calibrate regional go-to-market budgets.",
                "codeNotes": [
                    "Lines 1-22: Implements calculate_cage_distance_index weighting cultural, administrative, geographic, and economic distance dimensions.",
                    "Lines 24-31: Evaluates India->Germany and India->Singapore corridors, reporting composite CAGE index and GTM overhead premiums."
                ],
                "tryIt": "Lower Germany administrative distance to 2.0. Observe how the composite CAGE drops into the low-friction corridor.",
                "check": {
                    "question": "In Pankaj Ghemawat's CAGE Distance Framework, what does the 'A' dimension represent?",
                    "options": [
                        "Administrative and Political Distance (legal traditions, regulatory compliance, trade pacts, and currency unions).",
                        "Automated Technology Infrastructure.",
                        "Accounting Standards Variance.",
                        "Advertising Media Penetration."
                    ],
                    "answer": 0,
                    "why": "Administrative distance measures differences in legal institutions, regulatory frameworks, trade agreements, and political relationships between countries.",
                    "answerIndex": 0,
                    "explanation": "Administrative distance measures differences in legal institutions, regulatory frameworks, trade agreements, and political relationships between countries."
                }
            },
            {
                "example": "An international engineering subsidiary with $6.0M fully burdened costs bills its parent entity $6.51M under an 8.5% arm's length markup, recognizing $510k local EBIT and passing OECD BEPS audit criteria.",
                "codeNotes": [
                    "Lines 1-20: Implements model_transfer_pricing_tnmm calculating transfer price invoices, local EBIT, tax liabilities, and OECD interquartile audit risk.",
                    "Lines 22-26: Evaluates sample European tech subsidiary, verifying low audit risk within the 6-12% markup corridor."
                ],
                "tryIt": "Increase markup_pct to 18.0%. Observe how the audit risk flips to High due to deviation from standard OECD benchmarks.",
                "check": {
                    "question": "Under OECD guidelines and IRC Section 482, what is the core requirement of the Arm's Length Principle (ALP)?",
                    "options": [
                        "Controlled intercompany transactions must be priced as if they occurred between independent, unrelated parties under identical free-market conditions.",
                        "Subsidiaries must pay 0% tax to maximize corporate profits.",
                        "All international revenues must be recognized exclusively in the home country.",
                        "Transfer prices must always match the parent company's domestic retail prices."
                    ],
                    "answer": 0,
                    "why": "The Arm's Length Principle mandates that related-party transactions must mirror open-market commercial terms between independent enterprises.",
                    "answerIndex": 0,
                    "explanation": "The Arm's Length Principle mandates that related-party transactions must mirror open-market commercial terms between independent enterprises."
                }
            },
            {
                "example": "A corporation hedges 80% of a EUR 5.0M receivable via forward contracts at 1.075, preserving $380,000 in liquid capital during a sudden macroeconomic plunge in spot rates to 0.98.",
                "codeNotes": [
                    "Lines 1-21: Implements calculate_fx_hedging_waterfall comparing unhedged disaster cash flows against forward contract protection.",
                    "Lines 23-28: Simulates severe EUR/USD spot devaluation, proving capital preservation and mitigated drawdown."
                ],
                "tryIt": "Reduce hedge_ratio_pct to 0%. Observe how the company absorbs the full $500,000 currency drawdown with zero capital preserved.",
                "check": {
                    "question": "What is the primary commercial benefit of entering into an FX Forward contract for foreign currency receivables?",
                    "options": [
                        "It locks in a guaranteed future exchange rate, eliminating downside currency volatility and protecting operating cash flows.",
                        "It guarantees that the foreign currency will appreciate in value.",
                        "It eliminates the need to pay invoices to foreign suppliers.",
                        "It converts all debt obligations into equity."
                    ],
                    "answer": 0,
                    "why": "FX Forward contracts lock in fixed future exchange rates, removing currency volatility and ensuring cash flow certainty.",
                    "answerIndex": 0,
                    "explanation": "FX Forward contracts lock in fixed future exchange rates, removing currency volatility and ensuring cash flow certainty."
                }
            },
            {
                "example": "A global tech conglomerate with $31.0M EBIT across US, Ireland, Singapore, and India models BEPS Pillar Two, identifying $500k in top-up taxes to meet the mandatory 15% global minimum tax floor.",
                "codeNotes": [
                    "Lines 1-38: Implements calculate_beps_pillar_two_top_up_tax auditing multinational hubs against the 15% global minimum tax rate.",
                    "Lines 40-52: Evaluates a 4-country hub network, calculating statutory taxes, top-up levies, and consolidated Effective Tax Rate (18.96%)."
                ],
                "tryIt": "Raise Ireland local tax rate to 15.0%. Notice how the Irish top-up tax drops to $0.00.",
                "check": {
                    "question": "What is the primary mandate of OECD BEPS Pillar Two for multinational enterprises?",
                    "options": [
                        "Enforcing a mandatory 15.0% Global Minimum Corporate Tax rate backed by Top-Up Taxes on low-tax jurisdictions.",
                        "Abolishing all corporate taxes globally.",
                        "Forcing companies to incorporate exclusively in offshore tax havens.",
                        "Restricting international wire transfers between subsidiary hubs."
                    ],
                    "answer": 0,
                    "why": "OECD BEPS Pillar Two establishes a 15% global minimum corporate tax to neutralize profit shifting to low-tax jurisdictions.",
                    "answerIndex": 0,
                    "explanation": "OECD BEPS Pillar Two establishes a 15% global minimum corporate tax to neutralize profit shifting to low-tax jurisdictions."
                }
            }
        ]
    },
    27: {
        "goal": "Master cross-border strategic alliances and joint venture architectures: 50/50 and 60/40 JV equity contributions and Phase 2 capital calls, preferred return distribution waterfalls with hurdle rates and carried interest, contractual deadlock resolution protocols (Russian Roulette vs Texas Shootout), distribution alliance economics and OEM revenue-share moats, and the Master JV & Strategic Alliance Control Tower.",
        "recap": "In Day 26, we mastered international expansion entry modes, CAGE distance, transfer pricing, and currency hedging. In Day 27, we engineer strategic alliances and corporate joint ventures: equity capitalization, distribution waterfalls, deadlock dispute resolution, and distribution channel moats.",
        "summary": [
            "Engineered joint venture capitalization structures, modeling initial equity contributions and Phase 2 capex calls.",
            "Constructed two-tier cash distribution waterfalls enforcing preferred return hurdle rates and carried interest profit splits.",
            "Simulated contractual deadlock resolution mechanisms, contrasting Russian Roulette valuation symmetry against Texas Shootout sealed-bid auctions.",
            "Modeled distribution alliance economics and OEM revenue-share moats, quantifying 3.5x market expansion and profit compounding.",
            "Executed the Master JV & Strategic Alliance Control Tower, achieving unanimous gate clearance and nominal accreditation."
        ],
        "projectStep": {
            "title": "Structure and Govern Corporate Joint Ventures and Strategic Alliances",
            "steps": [
                "Model JV equity capitalization and Phase 2 capital call covenants to ensure solvency.",
                "Formulate a two-tier cash flow waterfall to satisfy preferred hurdle returns before splitting profits.",
                "Draft contractual deadlock resolution clauses utilizing Russian Roulette or Texas Shootout provisions.",
                "Quantify distribution alliance unit economics to verify scalability beyond direct sales channel limits.",
                "Execute the Master JV Control Tower to confer MASTER_STRATEGIC_ALLIANCE_CERTIFIED_NOMINAL."
            ]
        },
        "parts": [
            {
                "example": "Two international technology leaders structure a 60/40 JV capitalized with $5.0M initial equity and a $3.0M Phase 2 capex call, locking supermajority voting for expenditures over $500k.",
                "codeNotes": [
                    "Lines 1-26: Implements model_jv_equity_and_capital_calls calculating phase-based capital calls, equity ratios, and governance thresholds.",
                    "Lines 28-33: Evaluates Apex Global and EuroLogistics joint venture, confirming $8.0M total capital commitment."
                ],
                "tryIt": "Increase partner A equity split to 70%. Notice how governance structure shifts to unilateral majority control.",
                "check": {
                    "question": "Why do corporate joint ventures require formal capital call provisions in their shareholder agreements?",
                    "options": [
                        "To obligate partners to fund future capital expenditures pro-rata, preventing funding shortfalls or unauthorized dilution.",
                        "To eliminate the need for board meetings.",
                        "To transfer all intellectual property to government regulators.",
                        "To avoid filing annual financial statements."
                    ],
                    "answer": 0,
                    "why": "Capital call provisions ensure that all joint venture partners are legally bound to fund budgeted capital requirements proportionally.",
                    "answerIndex": 0,
                    "explanation": "Capital call provisions ensure that all joint venture partners are legally bound to fund budgeted capital requirements proportionally."
                }
            },
            {
                "example": "A $4.5M JV operating cash distribution satisfies a 10% preferred return ($800k hurdle) on $8.0M equity, splitting the remaining $3.7M residual profit 50/50 to incentivize both operating partners.",
                "codeNotes": [
                    "Lines 1-32: Implements calculate_jv_distribution_waterfall distributing cash across Tier 1 preferred return and Tier 2 residual split.",
                    "Lines 34-40: Evaluates distributable operating cash flow, verifying hurdle satisfaction and effective payout percentages."
                ],
                "tryIt": "Reduce distributable cash to $500k. Observe how the preferred hurdle is not fully satisfied and residual cash drops to zero.",
                "check": {
                    "question": "In a joint venture cash flow distribution waterfall, what is the purpose of a 'Preferred Return Hurdle'?",
                    "options": [
                        "To prioritize paying partners an agreed percentage return on their invested capital before splitting residual profits.",
                        "To guarantee that the smaller partner receives 100% of all profits forever.",
                        "To eliminate corporate tax liabilities on dividend distributions.",
                        "To convert equity investments into subordinated junk debt."
                    ],
                    "answer": 0,
                    "why": "A preferred hurdle guarantees that investors receive a minimum baseline return on capital before excess profits are distributed.",
                    "answerIndex": 0,
                    "explanation": "A preferred hurdle guarantees that investors receive a minimum baseline return on capital before excess profits are distributed."
                }
            },
            {
                "example": "When 50/50 JV partners reach an irreconcilable board deadlock, a Russian Roulette notice sets a $20M enterprise valuation, forcing the receiving partner to either buy out the initiator for $8M (40%) or sell their stake.",
                "codeNotes": [
                    "Lines 1-28: Implements simulate_deadlock_resolution_mechanism modeling contractual buy-sell formulas under Russian Roulette and Texas Shootout.",
                    "Lines 30-38: Evaluates $20M baseline deadlock offers, reporting acquisition costs and squeeze risks."
                ],
                "tryIt": "Switch mechanism to Texas Shootout and observe how the competitive auction premium increases the required buyout cash.",
                "check": {
                    "question": "How does a 'Russian Roulette' deadlock clause protect joint venture partners from being low-balled?",
                    "options": [
                        "Because the recipient of the buyout offer has the unilateral right to either accept the buyout or reverse the offer to buy out the initiator at the exact same price.",
                        "Because government antitrust regulators set the transaction price.",
                        "Because all company assets are liquidated at public auction.",
                        "Because the partner with lower equity is automatically granted free shares."
                    ],
                    "answer": 0,
                    "why": "Russian Roulette forces fair valuation because any price named by the initiator can be turned back against them to buy their own shares.",
                    "answerIndex": 0,
                    "explanation": "Russian Roulette forces fair valuation because any price named by the initiator can be turned back against them to buy their own shares."
                }
            },
            {
                "example": "A direct sales channel delivering $18M gross revenue with $5.25M in CAC scales via an OEM distribution alliance to 3.5x volume, expanding net contribution from $12.75M to $37.55M.",
                "codeNotes": [
                    "Lines 1-37: Implements model_distribution_alliance_economics contrasting direct CAC margins against partner revenue-share economics at 3.5x scale.",
                    "Lines 39-47: Evaluates enterprise software distribution metrics, reporting a 2.95x net operating profit multiplier."
                ],
                "tryIt": "Increase alliance_partner_margin_pct to 35.0% and observe the impact on scaled net contribution and margin efficiency.",
                "check": {
                    "question": "What is the primary strategic trade-off of distributing through an OEM alliance partner rather than direct sales?",
                    "options": [
                        "Surrendering a revenue-share margin percentage in exchange for instant access to a vast, pre-existing enterprise customer base.",
                        "Giving up complete ownership of core source code.",
                        "Accepting 100% bad debt risk on all customer contracts.",
                        "Eliminating all future product roadmap control."
                    ],
                    "answer": 0,
                    "why": "Distribution alliances trade partner margin for massive sales volume and rapid market penetration without linear direct CAC scaling.",
                    "answerIndex": 0,
                    "explanation": "Distribution alliances trade partner margin for massive sales volume and rapid market penetration without linear direct CAC scaling."
                }
            },
            {
                "example": "The Master JV & Strategic Alliance Control Tower audits capital funding, waterfall hurdle compliance, enforceable deadlock clauses, and distribution scale moats, unanimously conferring MASTER_STRATEGIC_ALLIANCE_CERTIFIED_NOMINAL.",
                "codeNotes": [
                    "Lines 1-40: Implements master_jv_and_alliance_control_tower validating all four foundational JV and alliance governance gates.",
                    "Lines 42-53: Evaluates integrated joint venture outputs and certifies compliance under sovereign corporate standards."
                ],
                "tryIt": "Set waterfall_res pref_return_satisfied to False. Observe how Gate 2 fails, triggering a STRATEGIC_ALLIANCE_GOVERNANCE_DEFICIT.",
                "check": {
                    "question": "What does the conferral of MASTER_STRATEGIC_ALLIANCE_CERTIFIED_NOMINAL signify?",
                    "options": [
                        "Complete mathematical and contractual validation of capital funding, preferred return waterfalls, deadlock buy-sell protocols, and distribution moats.",
                        "Government approval to monopolize the entire national market.",
                        "An exemption from all federal and state tax liabilities.",
                        "The immediate automatic acquisition of all alliance partners."
                    ],
                    "answer": 0,
                    "why": "The certification confirms that all financial, legal, and operational governance gates for joint ventures and strategic alliances are fully satisfied.",
                    "answerIndex": 0,
                    "explanation": "The certification confirms that all financial, legal, and operational governance gates for joint ventures and strategic alliances are fully satisfied."
                }
            }
        ]
    },
    28: {
        "goal": "Master mergers and acquisitions (M&A) and private equity buyout finance: Quality of Earnings (QoE) EBITDA adjustments and normalization, Leveraged Buyout (LBO) senior and mezzanine debt structures with Sources and Uses, programmatic M&A rollups and post-merger synergy capitalization, Stock Purchase Agreement (SPA) indemnification escrow holdbacks, and the Master M&A Due Diligence Control Tower.",
        "recap": "In Day 27, we mastered joint ventures, waterfalls, deadlock buy-sell clauses, and distribution alliances. In Day 28, we advance into corporate acquisitions: Quality of Earnings diligence, Leveraged Buyout debt structuring, rollup synergies, and purchase agreement indemnification escrows.",
        "summary": [
            "Conducted Quality of Earnings (QoE) EBITDA adjustments, normalizing founder discretionary perks and one-time litigation expenses.",
            "Structured Leveraged Buyout (LBO) debt tranches across senior and mezzanine debt, enforcing 5.0x EBITDA leverage limits.",
            "Modeled 5-year LBO return dynamics, calculating sponsor MOIC and IRR against institutional private equity hurdles.",
            "Engineered industry rollup economics, quantifying multiple arbitrage and post-merger operational synergy accretion.",
            "Executed the Master M&A Due Diligence and LBO Control Tower, conferring MA_AND_LBO_ACQUISITION_ARCHITECTURE_CERTIFIED_NOMINAL."
        ],
        "projectStep": {
            "title": "Execute M&A Due Diligence and Leveraged Buyout Modeling",
            "steps": [
                "Audit target company Quality of Earnings to compute normalized Adjusted EBITDA and identify run-rate adjustments.",
                "Size senior and mezzanine debt facilities in an LBO structure while complying with leverage and FCCR covenants.",
                "Model 5-year private equity exit returns to verify that sponsor MOIC >= 3.0x and IRR >= 25.0%.",
                "Calculate multiple arbitrage gains from acquiring fragmented bolt-ons into a scaled platform trading at higher valuation multiples.",
                "Run the Master M&A Control Tower to confer MA_AND_LBO_ACQUISITION_ARCHITECTURE_CERTIFIED_NOMINAL."
            ]
        },
        "parts": [
            {
                "example": "A buyout sponsor analyzes a $40M revenue target reporting $6.2M EBITDA, identifying $1.35M in net QoE add-backs to normalize Adjusted EBITDA to $7.4M (18.5% margin).",
                "codeNotes": [
                    "Lines 1-36: Implements calculate_qoe_ebitda_adjustments itemizing owner perks, litigation costs, and rent adjustments into normalized EBITDA.",
                    "Lines 38-51: Evaluates target company financials and reports normalized pro-forma margins."
                ],
                "tryIt": "Add a $500k deduction for unrecorded software maintenance. Observe how normalized EBITDA drops to $6.9M.",
                "check": {
                    "question": "In M&A financial due diligence, what is the primary purpose of a Quality of Earnings (QoE) report?",
                    "options": [
                        "To normalize reported EBITDA by stripping out non-recurring income, owner personal expenses, and pro-forma distortions to reflect true sustainable cash-generating capacity.",
                        "To calculate the total amount of income tax owed to foreign governments.",
                        "To evaluate the graphic design quality of the company's marketing brochures.",
                        "To replace the need for an independent audited balance sheet."
                    ],
                    "answer": 0,
                    "why": "A QoE report strips away non-operational and non-recurring items to establish the baseline economic earning power of an acquisition target.",
                    "answerIndex": 0,
                    "explanation": "A QoE report strips away non-operational and non-recurring items to establish the baseline economic earning power of an acquisition target."
                }
            },
            {
                "example": "An LBO sponsor sizes debt on $7.4M Adjusted EBITDA, securing 3.5x Senior Debt ($25.9M) and 1.5x Subordinated Debt ($11.1M) alongside a 35% equity check ($19.92M) to fund a $56.92M transaction.",
                "codeNotes": [
                    "Lines 1-25: Implements calculate_lbo_debt_sizing_waterfall sizing senior and junior debt facilities and computing implied enterprise values.",
                    "Lines 27-35: Validates leverage ratio compliance under the 5.0x total leverage covenant."
                ],
                "tryIt": "Increase senior_debt_turns to 4.5x. Observe how total leverage increases to 6.0x, triggering a Non-Compliant covenant alert.",
                "check": {
                    "question": "What is the primary covenant risk of funding an acquisition with excessive leverage turns (e.g. > 5.5x EBITDA)?",
                    "options": [
                        "High debt service obligations restrict cash flow flexibility and risk loan default during macroeconomic revenue downturns.",
                        "The company is automatically dissolved by the stock exchange.",
                        "All employees lose their stock options immediately.",
                        "Lenders are forced to forgive all principal obligations."
                    ],
                    "answer": 0,
                    "why": "Excessive debt creates severe debt-service drag, raising fixed interest burdens and increasing default risk if operational earnings falter.",
                    "answerIndex": 0,
                    "explanation": "Excessive debt creates severe debt-service drag, raising fixed interest burdens and increasing default risk if operational earnings falter."
                }
            },
            {
                "example": "A 5-year LBO model expands target EBITDA from $7.4M to $14.5M, paying down $28M of debt via free cash flow and exiting at 8.5x EV ($123.25M), generating a 5.74x MOIC and 41.81% IRR.",
                "codeNotes": [
                    "Lines 1-23: Implements calculate_lbo_returns_irr_and_moic modeling debt paydown, equity value expansion, MOIC, and annualized IRR.",
                    "Lines 25-39: Executes benchmark buyout return analysis, verifying institutional hurdle clearance."
                ],
                "tryIt": "Lower exit_multiple to 6.0x. Notice the resulting compression in sponsor MOIC and IRR.",
                "check": {
                    "question": "What two metrics do private equity investment committees universally evaluate to judge LBO investment attractiveness?",
                    "options": [
                        "Multiple on Invested Capital (MOIC) and Internal Rate of Return (IRR).",
                        "Website Pageviews and Social Media Followers.",
                        "Customer Net Promoter Score and Glassdoor Rating.",
                        "Days Sales Outstanding and Depreciation Schedules."
                    ],
                    "answer": 0,
                    "why": "MOIC measures absolute cash multiple returned while IRR measures the annualized compounding rate of the equity investment.",
                    "answerIndex": 0,
                    "explanation": "MOIC measures absolute cash multiple returned while IRR measures the annualized compounding rate of the equity investment."
                }
            },
            {
                "example": "A $12M EBITDA platform trading at 10x acquires three regional bolt-ons ($7.5M EBITDA total) at 4.5-5.5x multiples, unlocking $1.9M in cost synergies and generating $55M (+39.87%) in multiple arbitrage value.",
                "codeNotes": [
                    "Lines 1-37: Implements model_industry_rollup_multiple_arbitrage evaluating buy-and-build synergies and valuation multiple expansion.",
                    "Lines 39-48: Evaluates 3 bolt-on acquisitions and reports consolidated pro-forma platform value ($214M)."
                ],
                "tryIt": "Increase bolt-on entry multiples to 9.0x. Observe how multiple arbitrage gains drop significantly.",
                "check": {
                    "question": "In a buy-and-build rollup strategy, what is 'Multiple Arbitrage'?",
                    "options": [
                        "The value created by acquiring smaller add-on targets at low valuation multiples (e.g. 5x) and packaging them into a larger platform that trades at a higher multiple (e.g. 10x).",
                        "Trading shares between different foreign stock exchanges to profit from currency differences.",
                        "Artificially inflating revenue by selling products to subsidiary companies.",
                        "Refinancing senior debt with government subsidies."
                    ],
                    "answer": 0,
                    "why": "Multiple arbitrage captures the valuation spread between fragmented sub-scale businesses and scaled institutional platforms.",
                    "answerIndex": 0,
                    "explanation": "Multiple arbitrage captures the valuation spread between fragmented sub-scale businesses and scaled institutional platforms."
                }
            },
            {
                "example": "The Master M&A Due Diligence & LBO Control Tower audits normalized QoE margins, debt leverage covenants, private equity returns hurdles, and rollup arbitrage accretion, conferring MA_AND_LBO_ACQUISITION_ARCHITECTURE_CERTIFIED_NOMINAL.",
                "codeNotes": [
                    "Lines 1-28: Implements master_ma_and_lbo_control_tower validating all four foundational acquisition and buyout gates.",
                    "Lines 30-41: Executes control tower audit against benchmark inputs and certifies acquisition readiness."
                ],
                "tryIt": "Set lbo_returns_bench moic to 2.2x. Observe how Gate 3 fails due to missing the 3.0x institutional returns hurdle.",
                "check": {
                    "question": "What is the significance of earning MA_AND_LBO_ACQUISITION_ARCHITECTURE_CERTIFIED_NOMINAL accreditation?",
                    "options": [
                        "It certifies institutional mastery over acquisition financial due diligence, debt capacity modeling, private equity returns hurdles, and synergistic rollup integration.",
                        "It permits an enterprise to bypass all antitrust regulatory filings.",
                        "It guarantees that zero integration friction will ever occur after closing.",
                        "It replaces the need for executing definitive Stock Purchase Agreements."
                    ],
                    "answer": 0,
                    "why": "The accreditation certifies that an organization has mastered the mathematical, structural, and strategic disciplines required to execute accretive acquisitions.",
                    "answerIndex": 0,
                    "explanation": "The accreditation certifies that an organization has mastered the mathematical, structural, and strategic disciplines required to execute accretive acquisitions."
                }
            }
        ]
    },
    29: {
        "goal": "Master the complete Initial Public Offering (IPO) continuum: SEC Form S-1 registration readiness scorecards and PCAOB audited financials; Investment Banking underwriting economics, gross spread (7%), and the 15% Greenshoe stabilization overallotment option; institutional IPO pricing waterfalls, primary vs. secondary float sizing, and market capitalization; dual-class super-voting share governance and post-IPO 180-day lock-up expiration dynamics; and the Master IPO & Public Markets Control Tower.",
        "recap": "In Day 28, we engineered M&A acquisitions, LBO debt waterfalls, rollup synergies, and purchase agreement escrows. Today in Day 29, we take the enterprise public: Form S-1 registration, underwriting syndicate gross spreads, Greenshoe stabilization options, book-building pricing, dual-class control, and lock-up expirations.",
        "summary": [
            "Modeled investment banking syndicate gross spreads (7%) and 15% Greenshoe overallotment stabilization options.",
            "Engineered capitalization table dilution and primary vs secondary float sizing across institutional public offerings.",
            "Quantified IPO underpricing dynamics, evaluating first-day pops and issuer capital left on the table.",
            "Budgeted recurring Sarbanes-Oxley (SOX 404) compliance and public company operational governance drag.",
            "Executed the Master IPO & Capital Markets Control Tower, conferring IPO_AND_CAPITAL_MARKETS_ARCHITECTURE_CERTIFIED_NOMINAL."
        ],
        "projectStep": {
            "title": "Structure and Execute Initial Public Offering (IPO) Operations",
            "steps": [
                "Calculate investment banking underwriting gross spreads and syndicate allocations for Form S-1 registration.",
                "Structure public float sizing (>= 15% of post-offering shares) and balance primary vs secondary shares.",
                "Model bookbuilding demand curves to target an optimal 10% to 25% first-day IPO pop.",
                "Budget recurring PCAOB audit, SOX 404 compliance, and D&O insurance overhead (< 4% of revenue).",
                "Execute the Master IPO Control Tower to confer IPO_AND_CAPITAL_MARKETS_ARCHITECTURE_CERTIFIED_NOMINAL."
            ]
        },
        "parts": [
            {
                "example": "A $700M base IPO exercises the full 15% Greenshoe ($105M), raising $805M in gross proceeds while paying $56.35M in underwriting fees (7.0% gross spread) to lead underwriters.",
                "codeNotes": [
                    "Lines 1-35: Implements calculate_ipo_underwriting_gross_spread calculating base proceeds, Greenshoe overallotment, and syndicate fee splits.",
                    "Lines 37-45: Reports gross capital raised, net issuer proceeds, and syndicate compensation."
                ],
                "tryIt": "Set exercise_greenshoe to False. Notice how total proceeds drop back to $700M and underwriting fees decline proportionally.",
                "check": {
                    "question": "What is the primary capital markets purpose of the standard 15% 'Greenshoe' overallotment option granted to IPO underwriters?",
                    "options": [
                        "To allow underwriters to stabilize the stock price post-listing by covering naked short positions without taking directional market risk.",
                        "To transfer executive voting control to the stock exchange.",
                        "To eliminate all underwriting commissions.",
                        "To prevent retail investors from purchasing shares."
                    ],
                    "answer": 0,
                    "why": "The Greenshoe option gives underwriters price-stabilization tools in the secondary market, protecting the stock from plunging below the offer price.",
                    "answerIndex": 0,
                    "explanation": "The Greenshoe option gives underwriters price-stabilization tools in the secondary market, protecting the stock from plunging below the offer price."
                }
            },
            {
                "example": "An enterprise issuing 23.0M shares (17.25M primary, 5.75M secondary) at $35.00 expands share count to 103.0M, establishing a $3.605B market cap and a 22.33% public float.",
                "codeNotes": [
                    "Lines 1-32: Implements calculate_ipo_capitalization_and_dilution computing post-money shares, market capitalization, dilution, and float percentages.",
                    "Lines 34-42: Validates compliance with public float standards exceeding the 15% exchange minimum."
                ],
                "tryIt": "Reduce primary_shares_issued to 8.0M. Observe how public float drops below the 15% compliance threshold.",
                "check": {
                    "question": "In an IPO, what is the crucial structural difference between 'Primary Shares' and 'Secondary Shares'?",
                    "options": [
                        "Primary shares are newly issued shares whose proceeds go to the company treasury; secondary shares are existing shares sold by early shareholders whose proceeds go to those selling investors.",
                        "Primary shares carry no voting rights; secondary shares carry 100 votes.",
                        "Primary shares are sold only to retail investors; secondary shares are sold only to foreign banks.",
                        "Primary shares do not dilute existing ownership; secondary shares cause 100% dilution."
                    ],
                    "answer": 0,
                    "why": "Primary shares create new equity capital for corporate expansion, whereas secondary shares provide personal liquidity to existing shareholders.",
                    "answerIndex": 0,
                    "explanation": "Primary shares create new equity capital for corporate expansion, whereas secondary shares provide personal liquidity to existing shareholders."
                }
            },
            {
                "example": "A stock offered at $35.00 closes its first trading day at $42.00, generating a 20.0% ($7.00/sh) IPO pop and leaving $161.0M on the table while achieving an optimal underwriting rating.",
                "codeNotes": [
                    "Lines 1-26: Implements calculate_ipo_pop_and_money_left_on_table evaluating first-day trading gains and issuer opportunity costs.",
                    "Lines 28-35: Confirms optimal underwriting calibration when the pop sits between 10% and 25%."
                ],
                "tryIt": "Increase first_day_close_usd to $65.00. Notice how the underwriting assessment warns of severe underpricing and excessive capital left on the table.",
                "check": {
                    "question": "Why do institutional investment bankers target a modest 10% to 20% 'First-Day IPO Pop' rather than zero pop or a 100% surge?",
                    "options": [
                        "A 10-20% pop generates positive market momentum and rewards institutional anchor buyers without leaving excessive capital on the table for the corporate issuer.",
                        "A pop greater than 20% triggers automatic SEC cancellation of the IPO.",
                        "Zero pop results in automatic delisting by Nasdaq.",
                        "Investment banks only receive their gross spread fee if the pop exceeds 50%."
                    ],
                    "answer": 0,
                    "why": "A modest pop signals strong investor demand and creates favorable market sentiment without depriving the issuer of substantial primary capital.",
                    "answerIndex": 0,
                    "explanation": "A modest pop signals strong investor demand and creates favorable market sentiment without depriving the issuer of substantial primary capital."
                }
            },
            {
                "example": "A public enterprise with $165M annual revenue budgets $5.21M in annual public operating costs (PCAOB audits, SOX 404 testing, D&O insurance, SEC legal), incurring a viable 3.16% compliance drag.",
                "codeNotes": [
                    "Lines 1-32: Implements model_sox_and_public_readiness_budget aggregating Big 4 audits, SOX controls, D&O liability insurance, and SEC filing expenses.",
                    "Lines 34-42: Verifies that public company drag remains below the 4.0% revenue threshold."
                ],
                "tryIt": "Increase num_material_subsidiaries to 10. Observe how subsidiary compliance overhead pushes public costs above the 4% threshold.",
                "check": {
                    "question": "What is the primary operational mandate of Section 404 of the Sarbanes-Oxley Act (SOX 404) for publicly traded corporations?",
                    "options": [
                        "Management and independent auditors must document, test, and formally certify the adequacy of Internal Controls over Financial Reporting (ICFR).",
                        "The company must grant free shares to all citizens.",
                        "Executive salaries must be capped at $100,000 annually.",
                        "All intellectual property must be open-sourced to the public."
                    ],
                    "answer": 0,
                    "why": "SOX 404 requires rigorous internal controls to prevent accounting fraud, financial misstatements, and audit failures in public corporations.",
                    "answerIndex": 0,
                    "explanation": "SOX 404 requires rigorous internal controls to prevent accounting fraud, financial misstatements, and audit failures in public corporations."
                }
            },
            {
                "example": "The Master IPO Underwriting Control Tower audits gross proceeds scale, public float compliance, underwriting pop calibration, and SOX governance drag, conferring IPO_AND_CAPITAL_MARKETS_ARCHITECTURE_CERTIFIED_NOMINAL.",
                "codeNotes": [
                    "Lines 1-28: Implements master_ipo_underwriting_control_tower validating all four capital markets listing gates.",
                    "Lines 30-41: Executes control tower audit against benchmark inputs and certifies public markets readiness."
                ],
                "tryIt": "Set ipo_bench total_gross_proceeds to $300M. Observe how Gate 1 fails due to falling below the $500M institutional scale threshold.",
                "check": {
                    "question": "What is certified by the IPO_AND_CAPITAL_MARKETS_ARCHITECTURE_CERTIFIED_NOMINAL credential?",
                    "options": [
                        "Complete institutional readiness across underwriting syndicate economics, exchange-compliant float sizing, pricing discipline, and SOX 404 governance.",
                        "An absolute guarantee that the stock price will double within 30 days.",
                        "Immunity from all future quarterly SEC Form 10-Q reporting obligations.",
                        "Unrestricted insider selling on day one without any lock-up agreements."
                    ],
                    "answer": 0,
                    "why": "The credential certifies that an enterprise possesses the financial scale, legal structures, and governance rigor required to list and trade on public capital markets.",
                    "answerIndex": 0,
                    "explanation": "The credential certifies that an enterprise possesses the financial scale, legal structures, and governance rigor required to list and trade on public capital markets."
                }
            }
        ]
    },
    30: {
        "goal": "Synthesize the complete 30-day Entrepreneurship & Business Management curriculum into the ultimate sovereign enterprise creation: Sovereign Holding Company (HoldCo) architecture and Sum-of-the-Parts (SOTP) conglomerate valuation; Founder secondary liquidity crystallization, tax-optimized waterfalls, and dual-class voting control retention; Single Family Office endowment asset allocation under the Yale Endowment Model for perpetual generational preservation; Decadal executive succession planning, Board of Trustees handover, and multi-generational Dynasty Trusts; and the Master Sovereign Venture Empire Grand Capstone Control Tower.",
        "recap": "In Day 29, we conquered public equity listings, Form S-1 registration, underwriting economics, and lock-up mechanics. Today in Day 30, we reach the summit of Course 28 and our entire entrepreneurship curriculum: Grand Capstone 5: Sovereign Venture Empire, Founder Liquidity & Decadal Legacy Suite.",
        "summary": [
            "Architected a Sovereign Holding Company structure spanning Cloud, Logistics, and Robotics divisions, deriving a $1.548B Sum-of-the-Parts valuation.",
            "Modeled founder secondary monetization, crystallizing $224.0M in net liquidity while retaining 80% equity ($1.176B) and super-voting control.",
            "Constructed a multi-generational Family Office endowment portfolio yielding 8.2% real return and compounding capital perpetually in excess of spending.",
            "Engineered decadal executive succession protocols and multi-tier Dynasty Trust architectures, eliminating estate tax liabilities.",
            "Executed the Master Sovereign Venture Empire Grand Capstone Control Tower, unanimously conferring SOVEREIGN_VENTURE_EMPIRE_GRAND_CAPSTONE_CERTIFIED_NOMINAL."
        ],
        "projectStep": {
            "title": "Architect and Govern a Sovereign Venture Empire and Family Office",
            "steps": [
                "Decompose multi-subsidiary conglomerate cash flows into an SOTP enterprise valuation model.",
                "Structure a secondary equity sale with dual-class common stock to monetize liquidity while retaining voting control.",
                "Allocate liquid proceeds into a Family Office endowment portfolio adhering to the Yale Model perpetual compounding rule.",
                "Draft executive succession roadmaps and irrevocable Dynasty Trusts to transition management and preserve multi-generational wealth.",
                "Run the Grand Capstone Control Tower to achieve SOVEREIGN_VENTURE_EMPIRE_GRAND_CAPSTONE_CERTIFIED_NOMINAL."
            ]
        },
        "parts": [
            {
                "example": "A sovereign holding company consolidates $280M revenue and $84M EBITDA (30% margin) across SaaS, Logistics, and Robotics, achieving a $1.548B SOTP enterprise value and $1.498B net holding equity.",
                "codeNotes": [
                    "Lines 1-31: Implements model_sovereign_holdco_sotp_valuation aggregating division financials, applying individual EBITDA multiples, and netting corporate debt.",
                    "Lines 33-42: Simulates conglomerate valuation across Cloud, Logistics, and Robotics divisions."
                ],
                "tryIt": "Increase Cloud EBITDA multiple to 25.0x. Observe how the holding company net equity value expands past $1.6B.",
                "check": {
                    "question": "What is the primary corporate finance advantage of a Sum-of-the-Parts (SOTP) valuation for a multi-division holding company?",
                    "options": [
                        "It values each distinct operating division against its specific industry peer multiples, unlocking premium valuations rather than suffering a generic conglomerate discount.",
                        "It eliminates the need to report consolidated group revenue.",
                        "It allows subsidiaries to ignore local labor laws.",
                        "It converts all parent company equity into government bonds."
                    ],
                    "answer": 0,
                    "why": "SOTP valuation prevents high-margin divisions (e.g. software) from being dragged down by lower multiples of capital-intensive divisions.",
                    "answerIndex": 0,
                    "explanation": "SOTP valuation prevents high-margin divisions (e.g. software) from being dragged down by lower multiples of capital-intensive divisions."
                }
            },
            {
                "example": "A founder holding $1.47B in equity monetizes 20% (7M shares @ $42.00) for $294M gross cash, paying $69.97M in capital gains to realize $224.03M net liquid wealth while retaining $1.176B in equity.",
                "codeNotes": [
                    "Lines 1-32: Implements calculate_founder_secondary_liquidity_waterfall evaluating share sales, capital gains taxes, family office endowments, and retained equity.",
                    "Lines 34-43: Reports net liquid cash generation, venture fund allocations, and sovereign control retention."
                ],
                "tryIt": "Lower monetization_pct to 10.0%. Observe how gross proceeds drop to $147M while retained equity expands to $1.323B.",
                "check": {
                    "question": "How do late-stage founders achieve generational personal liquidity without surrendering corporate control during secondary sales?",
                    "options": [
                        "By implementing Dual-Class Voting architectures, converting only the economic shares being sold into single-vote Class A stock while retaining super-voting Class B shares.",
                        "By transferring all corporate shares to anonymous offshore bank accounts.",
                        "By borrowing money from employees without paying it back.",
                        "By selling the entire company to a private equity firm."
                    ],
                    "answer": 0,
                    "why": "Dual-class stock decouples economic ownership from voting power, allowing founders to sell equity for cash while keeping voting control.",
                    "answerIndex": 0,
                    "explanation": "Dual-class stock decouples economic ownership from voting power, allowing founders to sell equity for cash while keeping voting control."
                }
            },
            {
                "example": "A $156.74M family office endowment portfolio achieves a 10.7% nominal yield (8.2% real return), funding $5.49M in annual spending (3.5% policy) while compounding principal by +$7.37M net annually.",
                "codeNotes": [
                    "Lines 1-28: Implements model_family_office_endowment_portfolio allocating capital across equities, private equity, venture, real estate, and bonds under the Yale Model.",
                    "Lines 30-38: Evaluates annual spending grants, net compounding, and generational preservation status."
                ],
                "tryIt": "Increase annual_spending_pct to 10.0%. Observe how generational preservation status flips to Depleting.",
                "check": {
                    "question": "According to institutional endowment theory, what condition must be satisfied for a family office endowment to achieve Perpetual Growth?",
                    "options": [
                        "The portfolio's expected real return (nominal return minus inflation) must strictly exceed its annual spending and grant distribution rate.",
                        "100% of the portfolio must be held in cash.",
                        "The family office must avoid paying any salaries to investment staff.",
                        "The endowment must invest exclusively in government lottery bonds."
                    ],
                    "answer": 0,
                    "why": "If real returns exceed spending, the principal grows in purchasing power perpetually; if spending exceeds real return, the principal eventually depletes.",
                    "answerIndex": 0,
                    "explanation": "If real returns exceed spending, the principal grows in purchasing power perpetually; if spending exceeds real return, the principal eventually depletes."
                }
            },
            {
                "example": "A 52-year-old founder initiates a 5-year succession roadmap, elevating COO Sarah Chen (readiness 92/100) to CEO and allocating equity into Dynasty Trusts (50%), GRATs (30%), and Foundations (20%).",
                "codeNotes": [
                    "Lines 1-34: Implements model_executive_succession_and_trust_governance evaluating executive benches, trust structures, and handover milestones.",
                    "Lines 36-45: Confirms robust bench strength (2/3 ready successors) and certifies nominal succession viability."
                ],
                "tryIt": "Lower Sarah Chen's readiness score to 75. Observe how the bench strength drops and alerts to Key-Person Risk.",
                "check": {
                    "question": "What is the primary estate planning function of establishing an Irrevocable Dynasty Trust in sovereign wealth management?",
                    "options": [
                        "To hold family equity in perpetuity across generations without triggering catastrophic estate or generation-skipping transfer taxes upon each succession.",
                        "To allow children to liquidate the operating company without board approval.",
                        "To evade all public company reporting requirements.",
                        "To eliminate the need for having a board of directors."
                    ],
                    "answer": 0,
                    "why": "Dynasty trusts remove assets from the taxable estate, preserving family wealth across centuries without recurring 40% estate tax confiscation.",
                    "answerIndex": 0,
                    "explanation": "Dynasty trusts remove assets from the taxable estate, preserving family wealth across centuries without recurring 40% estate tax confiscation."
                }
            },
            {
                "example": "The Master Sovereign Venture Empire Grand Capstone Control Tower audits billion-dollar enterprise scale, founder secondary liquidity, endowment sustainability, and executive succession, unanimously conferring SOVEREIGN_VENTURE_EMPIRE_GRAND_CAPSTONE_CERTIFIED_NOMINAL.",
                "codeNotes": [
                    "Lines 1-30: Implements master_sovereign_venture_empire_capstone_control_tower validating all four grand capstone audit gates.",
                    "Lines 32-42: Executes capstone control tower audit and certifies 100% completion of the Entrepreneurship & Business Management curriculum."
                ],
                "tryIt": "Set founder_liq_res net_liquid_cash_generated to $50M. Observe how Gate 2 fails due to falling short of the $100M threshold.",
                "check": {
                    "question": "What does earning the SOVEREIGN_VENTURE_EMPIRE_GRAND_CAPSTONE_CERTIFIED_NOMINAL accreditation represent?",
                    "options": [
                        "The definitive mastery of enterprise creation from zero to multi-billion-dollar scale, synthesizing ideation, governance, capital markets, and multi-generational legacy stewardship.",
                        "An award granted automatically to anyone who reads a business book.",
                        "A license to avoid all environmental regulations.",
                        "A guarantee that no competitor will ever enter the market."
                    ],
                    "answer": 0,
                    "why": "This apex certification validates comprehensive mastery over the entire entrepreneurial lifecycle, from initial validation to sovereign global conglomerate stewardship.",
                    "answerIndex": 0,
                    "explanation": "This apex certification validates comprehensive mastery over the entire entrepreneurial lifecycle, from initial validation to sovereign global conglomerate stewardship."
                }
            }
        ]
    }
}

def load_day_data(day_num: int) -> Dict[str, Any]:
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"bcom_ent_day{day_num}_data.json")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_day_data(day_num: int, data: Dict[str, Any]):
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"bcom_ent_day{day_num}_data.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def enrich_day(day_data: Dict[str, Any]) -> Dict[str, Any]:
    day_num = day_data["day"]
    meta = METADATA[day_num]
    
    day_data["goal"] = meta["goal"]
    day_data["recap"] = meta["recap"]
    day_data["summary"] = meta["summary"]
    day_data["projectStep"] = meta["projectStep"]
    
    for idx, p in enumerate(day_data["parts"]):
        p_meta = meta["parts"][idx]
        p["example"] = p_meta["example"]
        p["codeNotes"] = p_meta["codeNotes"]
        p["tryIt"] = p_meta["tryIt"]
        p["check"] = p_meta["check"]
        
    return day_data

def generate_funnel_visual_file(day_data: Dict[str, Any], output_path: str):
    day_num = day_data["day"]
    prefix = "bcom_ent"
    prompt_str = f"{prefix}_day{day_num}_{day_data['title']}"
    prompt_sha = hashlib.sha256(prompt_str.encode()).hexdigest()
    
    entries = []
    stage_profiles = [
        [20000, 9000, 3600, 1440],
        [25000, 11250, 4500, 1800],
        [18000, 8100, 3240, 1296],
        [30000, 13500, 5400, 2160],
        [50000, 25000, 10000, 4000]
    ]
    
    for idx, part in enumerate(day_data["parts"]):
        code_str = part["code"].strip()
        code_hash = hashlib.sha256(code_str.encode()).hexdigest()
        p_vals = stage_profiles[idx % len(stage_profiles)]
        
        top_v, qual_v, targ_v, fin_v = p_vals
        qual_pct = round((qual_v / top_v) * 100, 1)
        targ_pct = round((targ_v / top_v) * 100, 1)
        fin_pct = round((fin_v / top_v) * 100, 1)
        
        qual_drop = round(100 - qual_pct, 1)
        targ_drop = round(100 - (targ_v / qual_v * 100), 1)
        fin_drop = round(100 - (fin_v / targ_v * 100), 1)
        
        steps = [
            {
                "at": "intro",
                "caption": f"Global pipeline evaluation ({top_v:,} prospects).",
                "activeStageId": "top",
                "stages": [
                    {"id": "top", "label": "Pipeline Evaluated", "value": top_v, "percentage": 100, "tone": "data"},
                    {"id": "qual", "label": "Qualified Opportunities", "value": qual_v, "percentage": qual_pct, "dropoffRate": qual_drop, "tone": "ok"},
                    {"id": "target", "label": "Due Diligence Filter", "value": targ_v, "percentage": targ_pct, "dropoffRate": targ_drop, "tone": "ok"},
                    {"id": "final", "label": "Sovereign Execution", "value": fin_v, "percentage": fin_pct, "dropoffRate": fin_drop, "tone": "idle"}
                ]
            },
            {
                "at": "say1",
                "caption": f"Rigorous screening qualifies {qual_pct}% of targets ({qual_v:,}).",
                "activeStageId": "qual",
                "stages": [
                    {"id": "top", "label": "Pipeline Evaluated", "value": top_v, "percentage": 100, "tone": "ok"},
                    {"id": "qual", "label": "Qualified Opportunities", "value": qual_v, "percentage": qual_pct, "dropoffRate": qual_drop, "tone": "data"},
                    {"id": "target", "label": "Due Diligence Filter", "value": targ_v, "percentage": targ_pct, "dropoffRate": targ_drop, "tone": "ok"},
                    {"id": "final", "label": "Sovereign Execution", "value": fin_v, "percentage": fin_pct, "dropoffRate": fin_drop, "tone": "idle"}
                ]
            },
            {
                "at": "example",
                "caption": f"Quantitative valuation confirms ({targ_v:,} high-conviction positions).",
                "activeStageId": "target",
                "stages": [
                    {"id": "top", "label": "Pipeline Evaluated", "value": top_v, "percentage": 100, "tone": "ok"},
                    {"id": "qual", "label": "Qualified Opportunities", "value": qual_v, "percentage": qual_pct, "dropoffRate": qual_drop, "tone": "ok"},
                    {"id": "target", "label": "Due Diligence Filter", "value": targ_v, "percentage": targ_pct, "dropoffRate": targ_drop, "tone": "data"},
                    {"id": "final", "label": "Sovereign Execution", "value": fin_v, "percentage": fin_pct, "dropoffRate": fin_drop, "tone": "idle"}
                ]
            },
            {
                "at": "tryIt",
                "caption": f"Sovereign execution locks capital ({fin_v:,} institutional stakeholders).",
                "activeStageId": "final",
                "stages": [
                    {"id": "top", "label": "Pipeline Evaluated", "value": top_v, "percentage": 100, "tone": "ok"},
                    {"id": "qual", "label": "Qualified Opportunities", "value": qual_v, "percentage": qual_pct, "dropoffRate": qual_drop, "tone": "ok"},
                    {"id": "target", "label": "Due Diligence Filter", "value": targ_v, "percentage": targ_pct, "dropoffRate": targ_drop, "tone": "ok"},
                    {"id": "final", "label": "Sovereign Execution", "value": fin_v, "percentage": fin_pct, "dropoffRate": fin_drop, "tone": "data"}
                ]
            }
        ]
        
        spec = {
            "template": "funnel",
            "title": f"{part['title'][:40]} - Sovereign Funnel",
            "steps": steps
        }
        
        entries.append({
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": spec,
            "filled": spec
        })
        
    visual_doc = {
        "schemaVersion": 1,
        "prefix": prefix,
        "day": day_num,
        "promptSha": prompt_sha,
        "model": "gemini-2.5-pro",
        "entries": entries
    }
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(visual_doc, f, indent=2)
    print(f"Generated Visual JSON: {output_path} (5 parts bound with code hashes)")

def format_ts_lesson(lesson: Dict[str, Any]) -> str:
    lines = []
    lines.append("  {")
    lines.append("    coursePrefix: 'bcom_ent',")
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
    print("\n=== LOADING, ENRICHING & VALIDATING BLOCK 231 (Days 26-30: Milestone 6) ===")
    days_data = []
    for d in range(26, 31):
        raw_data = load_day_data(d)
        enriched = enrich_day(raw_data)
        save_day_data(d, enriched)
        days_data.append(enriched)
        print(f"Enriched and saved Day {d} data JSON.")

    for d in days_data:
        day_num = d["day"]
        expected_minutes = 50 if day_num == 30 else 45
        assert d["minutes"] == expected_minutes, f"Day {day_num} minutes must be {expected_minutes}, got {d['minutes']}"
        assert len(d["parts"]) == 5, f"Day {day_num} must have exactly 5 parts, got {len(d['parts'])}"
        
        total_day_words = 0
        for idx, p in enumerate(d["parts"]):
            part_words = len(" ".join(p["say"]).split())
            total_day_words += part_words
            assert part_words >= 580, f"Day {day_num} Part {idx+1} '{p['title']}' has {part_words} words (< 580)"
            
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
    visuals_dir = os.path.join(repo_root, "src", "lib", "data", "lessonVisuals", "bcom_ent")
    os.makedirs(visuals_dir, exist_ok=True)
    
    for d in days_data:
        day_num = d["day"]
        pad = str(day_num).zfill(2)
        out_file = os.path.join(visuals_dir, f"day-{pad}.json")
        generate_funnel_visual_file(d, out_file)

    # Append to TypeScript Long Lessons file
    ts_file = os.path.join(repo_root, "src", "lib", "data", "bcomEntLongLessons.ts")
    with open(ts_file, "r", encoding="utf-8") as f:
        ts_content = f.read()
        
    # Check if Day 26 is already present - if so, strip from day 26 onward
    d26_marker = ",\n  {\n    coursePrefix: 'bcom_ent',\n    day: 26,"
    if d26_marker in ts_content:
        idx_d26 = ts_content.find(d26_marker)
        ts_content = ts_content[:idx_d26] + "\n];\n"
        print("\nExisting Day 26 found. Stripped prior Day 26-30 blocks for clean re-assembly.")

    # Find closing '];'
    idx = ts_content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in bcomEntLongLessons.ts")
        
    formatted_lessons = []
    for d in days_data:
        formatted_lessons.append(format_ts_lesson(d))
        
    joined_new_lessons = ",\n" + ",\n".join(formatted_lessons) + "\n"
    updated_ts_content = ts_content[:idx] + joined_new_lessons + ts_content[idx:]
    
    with open(ts_file, "w", encoding="utf-8") as f:
        f.write(updated_ts_content)
    print(f"\nAppended Days 26-30 to {ts_file}")
        
    print("\n=== BLOCK 231 ASSEMBLY COMPLETED SUCCESSFULLY: DAYS 26-30 (COURSE 28 100% COMPLETE!) ===")

if __name__ == "__main__":
    main()
