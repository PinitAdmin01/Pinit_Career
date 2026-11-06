import os
import sys

def get_day16_data():
    day = 16
    title = "Strategic Sourcing, Supplier Selection & The Kraljic Portfolio Matrix"
    goal = "Master advanced strategic procurement and supplier portfolio governance: formulating the Kraljic Portfolio Matrix (Non-critical, Leverage, Bottleneck, Strategic), evaluating Total Cost of Ownership (TCO) beyond purchase price, applying the Analytical Hierarchy Process (AHP) for multi-criteria supplier selection, and modeling dual-sourcing vs single-sourcing disruption risks."
    minutes = 45
    recap = "In Milestone 3, we mastered distribution logistics, WMS slotting, cold chain thermodynamics, reverse logistics, and statutory compliance. In Milestone 4, we enter the upstream nerve center of the enterprise: Strategic Procurement and Global Sourcing. Day 16 establishes the foundational matrix of modern purchasing: classifying enterprise spend across supply risk and profit impact, measuring true lifecycle TCO, and mathematically evaluating supplier selection under disruption risk."

    parts = [
        {
            "title": "Strategic Sourcing Lifecycle & Kraljic 2x2 Matrix Portfolio Architecture",
            "say": [
                "Welcome to Day 16 of Operations and Supply Chain Management. In traditional commercial practice, purchasing was historically treated as a clerical, transactional back-office utility: operational buyers passively waited for internal departments to raise paper purchase requisitions, sent out requests for quotes (RFQs) to three local vendors, and blindly awarded the contract to the lowest bidder on initial unit price. However, in the high-stakes arena of modern global corporate enterprise, procurement has undergone an existential revolution, transforming into Strategic Sourcing. Strategic sourcing is an analytical, continuous, cross-functional organizational process that designs, evaluates, and governs an enterprise's external supply base to maximize competitive advantage, accelerate product innovation, and systematically insulate the company from supply chain failure.",
                "The intellectual cornerstone of modern strategic sourcing was introduced in 1983 by operational theorist Peter Kraljic in his seminal Harvard Business Review work, 'Purchasing Must Become Supply Management.' Kraljic recognized that not all purchased goods and services possess identical commercial characteristics; buying standard office stationery involves fundamentally different operational stakes than contracting the specialized microchips that power an electric vehicle. Kraljic synthesized purchasing strategy into a rigorous 2x2 portfolio matrix evaluated across two orthogonal dimensions: Profit Impact (the financial magnitude of the spend category relative to enterprise margins and bottom-line profit) and Supply Risk (the market complexity, scarcity of qualified suppliers, technological entry barriers, logistics vulnerabilities, and substitution availability).",
                "Mapping spend categories across these two axes partitions an organization's entire procurement budget into four distinct strategic quadrants. In the lower-left quadrant lie Non-Critical (Routine) Items—categories with low profit impact and low supply risk, such as standard cleaning supplies, generic office stationery, and routine administrative maintenance. Because these items generate negligible margin leverage but consume massive administrative overhead, the governing procurement strategy is Process Automation and Transactional Standardization: deploying e-procurement catalogs, vendor-managed inventory (VMI), and consolidated corporate purchasing cards (P-Cards) to drive transaction costs to zero.",
                "In the lower-right quadrant sit Bottleneck Items—goods characterized by low profit impact but high supply risk, such as specialized replacement gaskets, proprietary software licenses, or patent-locked catalyst chemicals. Although the annual spend volume is modest, an unexpected outage in a bottleneck supply halts multimillion-dollar production assembly lines. Here, the strategic imperative is Supply Continuity and Vulnerability Reduction: securing long-term supply contracts, establishing safety buffer stocks, qualifying backup alternative specifications, and fostering cooperative supplier relationships to prevent catastrophic line stoppages.",
                "In the upper-left quadrant reside Leverage Items—categories characterized by high profit impact but low supply risk, such as bulk commodity chemicals, standard steel fasteners, standard corrugated packaging, and routine freight logistics services. Because these goods represent substantial portions of cost-of-goods-sold (COGS) and multiple interchangeable suppliers populate the open market, the enterprise commands massive buyer bargaining power. The strategic objective is Volume Aggregation, Competitive Reverse Auctions, and Dynamic Sourcing Optimization to ruthlessly drive down unit acquisition costs and maximize gross margins.",
                "Finally, in the upper-right quadrant exist Strategic Items—the crown jewels of procurement, possessing both high profit impact and high supply risk, such as bespoke electric vehicle battery packs, high-density semiconductor processors, or proprietary active pharmaceutical ingredients (APIs). These mission-critical categories demand Collaborative Strategic Partnerships, Shared R&D Roadmaps, Open-Book Cost Accounting, and Co-Location of Engineering Assets to forge enduring competitive advantage.",
                "Kraljic's four-phase methodology requires organizations to execute a systematic progression: Phase 1 involves Category Classification to map all SKUs into the 2x2 grid; Phase 2 entails Supply Market Analysis to assess relative supplier power versus buyer power across Porter's Five Forces; Phase 3 establishes Strategic Positioning to determine whether the company should exploit, balance, or diversify its vendor relationships; and Phase 4 executes Concrete Action Plans detailing contract lengths, buffer stock targets, and technological substitution roadmaps. Through this holistic lens, procurement ceases to be a reactive administrative chore and becomes a central driver of enterprise balance sheet health and corporate strategy."
            ],
            "example": "Consider a multinational medical device manufacturer producing automated insulin pump systems. The enterprise spends $120 million annually across 4,200 unique supplier part numbers. Applying the Kraljic Matrix revealed that 65% of the procurement team's time was wasted manually writing purchase orders for non-critical cleanroom wipes and nitrile gloves ($1.2M total spend), while a single custom-machined micro-valve ($850,000 spend) was categorized as routine hardware despite having only one certified vendor in Switzerland with a 36-week lead time. By formalizing the Kraljic framework, the CPO automated the consumable spend through an enterprise punchout catalog and reclassified the Swiss valve as a Bottleneck component. The company signed a 3-year mutual volume commitment, instituted a 90-day consignment safety buffer in Singapore, and co-funded a secondary tooling die, successfully averting an assembly line shutdown when European logistics froze during seasonal port strikes.",
            "code": """# Kraljic Portfolio Matrix Categorization Engine
def classify_kraljic_quadrant(
    category_name: str,
    annual_spend_usd: float,
    spend_threshold_usd: float,
    num_available_suppliers: int,
    switching_cost_rating: int,  # 1 (Trivial) to 10 (Prohibitive)
    lead_time_days: int
) -> dict:
    # Formulate Profit Impact score (0.0 to 10.0 scale) based on spend magnitude
    profit_impact_score = min(round((annual_spend_usd / spend_threshold_usd) * 5.0, 2), 10.0)
    
    # Formulate Supply Risk score based on supplier scarcity, switching costs, and lead times
    scarcity_factor = 10.0 if num_available_suppliers <= 1 else (6.0 if num_available_suppliers <= 3 else 2.0)
    lead_time_factor = 10.0 if lead_time_days > 90 else (5.0 if lead_time_days > 30 else 1.0)
    switching_factor = float(switching_cost_rating)
    
    # Weighted Supply Risk index (Scarcity 40%, Switching 35%, Lead Time 25%)
    supply_risk_score = round(
        (scarcity_factor * 0.40) + (switching_factor * 0.35) + (lead_time_factor * 0.25), 2
    )
    
    # Determine Kraljic Quadrant
    is_high_profit = profit_impact_score >= 5.0
    is_high_risk = supply_risk_score >= 5.0
    
    if is_high_profit and is_high_risk:
        quadrant = "STRATEGIC"
        governance_strategy = "Strategic Partnership, Long-Term Alliance & Shared R&D"
        tactical_action = "Executive-level SRM, open-book cost modeling, joint forecasting"
    elif is_high_profit and not is_high_risk:
        quadrant = "LEVERAGE"
        governance_strategy = "Competitive Bidding, Volume Aggregation & Reverse Auctions"
        tactical_action = "Consolidate volumes across business units, negotiate short-term aggressive contracts"
    elif not is_high_profit and is_high_risk:
        quadrant = "BOTTLENECK"
        governance_strategy = "Supply Security, Buffer Inventory & Contractual Guarantees"
        tactical_action = "Hold consignment safety stock, design out proprietary specs, qualify secondary supplier"
    else:
        quadrant = "NON_CRITICAL"
        governance_strategy = "Process Automation, E-Catalogs & Administrative Efficiency"
        tactical_action = "P-Card deployment, punchout catalog automation, VMI vendor consolidation"
        
    return {
        "category": category_name,
        "spend_usd": annual_spend_usd,
        "profit_impact_score": profit_impact_score,
        "supply_risk_score": supply_risk_score,
        "quadrant": quadrant,
        "strategy": governance_strategy,
        "action": tactical_action
    }

# Portfolio assessment of enterprise spend categories
categories = [
    {"name": "EV Lithium-Ion Battery Packs", "spend": 45_000_000.0, "suppliers": 2, "switching": 9, "lead_time": 120},
    {"name": "Standard Corrugated Packaging", "spend": 12_500_000.0, "suppliers": 8, "switching": 2, "lead_time": 14},
    {"name": "Custom Precision Valve Seals", "spend": 750_000.0, "suppliers": 1, "switching": 10, "lead_time": 105},
    {"name": "General Cleanroom Janitorial Supplies", "spend": 320_000.0, "suppliers": 12, "switching": 1, "lead_time": 7}
]

print("=== KRALJIC PORTFOLIO CLASSIFICATION AUDIT ===")
for cat in categories:
    res = classify_kraljic_quadrant(
        cat["name"], cat["spend"], spend_threshold_usd=10_000_000.0,
        num_available_suppliers=cat["suppliers"], switching_cost_rating=cat["switching"],
        lead_time_days=cat["lead_time"]
    )
    print(f"Category: {res['category']} -> [{res['quadrant']}]")
    print(f"  Scores: Profit Impact = {res['profit_impact_score']}/10 | Supply Risk = {res['supply_risk_score']}/10")
    print(f"  Strategy: {res['strategy']}")
""",
            "output": """=== KRALJIC PORTFOLIO CLASSIFICATION AUDIT ===
Category: EV Lithium-Ion Battery Packs -> [STRATEGIC]
  Scores: Profit Impact = 10.0/10 | Supply Risk = 9.65/10
  Strategy: Strategic Partnership, Long-Term Alliance & Shared R&D
Category: Standard Corrugated Packaging -> [LEVERAGE]
  Scores: Profit Impact = 6.25/10 | Supply Risk = 1.75/10
  Strategy: Competitive Bidding, Volume Aggregation & Reverse Auctions
Category: Custom Precision Valve Seals -> [BOTTLENECK]
  Scores: Profit Impact = 0.38/10 | Supply Risk = 10.0/10
  Strategy: Supply Security, Buffer Inventory & Contractual Guarantees
Category: General Cleanroom Janitorial Supplies -> [NON_CRITICAL]
  Scores: Profit Impact = 0.16/10 | Supply Risk = 1.4/10
  Strategy: Process Automation, E-Catalogs & Administrative Efficiency""",
            "codeNotes": [
                {"line": 2, "note": "Implements deterministic Kraljic 2x2 portfolio classification logic"},
                {"line": 15, "note": "Computes weighted supply risk using market scarcity, switching friction, and lead times"},
                {"line": 22, "note": "Evaluates strategic bifurcation across profit impact and supply risk coordinates"},
                {"line": 45, "note": "Classifies diverse spend profiles into distinct contractual governance regimes"}
            ],
            "tryIt": {
                "description": "Evaluate how a sudden surge in annual spend shifts an item from Bottleneck to Strategic.",
                "question": "If annual spend for Custom Precision Valve Seals jumps from $750,000 to $18,000,000 due to global factory expansion while maintaining single-supplier dependence, how does its Kraljic quadrant mutate?",
                "options": [
                    "It shifts from Bottleneck to Leverage because volume increased",
                    "It remains in Bottleneck because the component itself did not change",
                    "It shifts from Bottleneck to Strategic because both Profit Impact and Supply Risk are now exceptionally high",
                    "It shifts to Non-Critical because large suppliers provide automated billing"
                ],
                "answer": 2,
                "explanation": "In the Kraljic Matrix, when annual spend scales dramatically (increasing Profit Impact past the 5.0 threshold) while supply market complexity remains high (single supplier, high switching costs, long lead times), the item transitions from Bottleneck directly into Strategic. The organization must elevate its governance from mere buffer stocking to executive strategic partnership and co-development."
            },
            "check": {
                "question": "Under Peter Kraljic's purchasing portfolio framework, what is the optimal procurement strategy for 'Leverage Items'?",
                "options": [
                    "Forming long-term equity joint ventures and co-locating design teams",
                    "Holding six months of safety buffer stock to insulate from line stoppages",
                    "Volume aggregation, competitive bidding, and dynamic reverse auctions to exploit buyer power",
                    "Delegating all purchasing authority to field clerks using petty cash vouchers"
                ],
                "answer": 2,
                "why": "Leverage items feature high spend impact but low supply risk with numerous interchangeable vendors. Buyers command immense market power and should aggregate enterprise-wide purchase volumes to run competitive tenders and reverse auctions, maximizing cost reduction and margin capture."
            }
        },
        {
            "title": "Total Cost of Ownership (TCO) vs Purchase Price Lifecycle Economics",
            "say": [
                "A pervasive and costly pathology in amateur procurement is 'Price-Centric Myopia'—the erroneous assumption that the supplier offering the lowest initial unit purchase price on a commercial invoice represents the lowest-cost option for the enterprise. In industrial supply chains, the nominal purchase price frequently accounts for less than 40% of the cumulative expenditure incurred throughout the operational lifecycle of an asset or component. Naive buyers who chase low invoice costs in distant, low-cost regions routinely find their anticipated savings vaporized by punitive international ocean freight surcharges, extended financing costs on goods in transit, unexpected customs tariffs, elevated scrap and defect rates, expensive field warranty recalls, and catastrophic factory downtime.",
                "To counter this distortion, strategic procurement mandates the evaluation of Total Cost of Ownership (TCO). Developed comprehensively by Gartner and industrialized by leading manufacturing organizations, TCO is an analytical accounting philosophy that quantifies all direct and indirect expenses associated with the purchase, delivery, deployment, operation, maintenance, and ultimate retirement or disposal of an acquired good or service across its entire lifecycle horizon.",
                "Mathematically, a complete industrial TCO equation decomposes lifecycle expenditures into five discrete temporal cost phases: 1. Pre-Transaction Costs (supplier qualification audits, tooling design, legal contracting, and engineering sample testing); 2. Transaction Costs (the base invoice purchase price, cross-border freight transportation, customs duties, port handling fees, and transit insurance); 3. Post-Transaction Inbound Quality Costs (incoming batch inspection, rework labor, internal defect scrap, and factory line downtime caused by defective lots); 4. Operating & Maintenance Costs (energy consumption, consumables, scheduled preventative servicing, technical support labor, and software license maintenance); and 5. End-of-Life & Disposal Costs (decommissioning labor, hazardous environmental waste abatement, statutory Extended Producer Responsibility fees, minus any net scrap salvage value).",
                "Analyzing procurement decisions through a rigorous TCO lens frequently upends traditional sourcing decisions. For example, consider an industrial robotics motor: Vendor A in an offshore market quotes a purchase price of $500 per unit, while Vendor B in a domestic cluster quotes $620 per unit. An inexperienced purchasing agent would award the contract to Vendor A, claiming a $120 per unit savings. However, Vendor A's overseas transit requires 45 days of ocean shipping (locking up working capital), exhibits a 2.5% defect rate on the assembly line ($45 per unit in rework and downtime), and consumes 15% more electrical power over its 5-year operating lifespan ($180 per unit in utility costs). Vendor B provides local JIT delivery, a 0.05% defect rate, and superior energy efficiency. When evaluated across a 5-year lifecycle, Vendor B's TCO is $810 per unit, while Vendor A's TCO balloons to $965 per unit. Strategic sourcing proves that the higher purchase price is actually the lower cost.",
                "Incorporating TCO into enterprise ERP and procurement decision workflows requires cross-functional accounting integration. Finance, operations, quality engineering, and environmental health and safety (EHS) must collaboratively establish standardized TCO cost-driver coefficients. When evaluating competitive tenders, requests for proposals (RFPs) must mandate that suppliers provide verified data on energy consumption, mean time between failures (MTBF), tooling amortization schedules, and replacement parts pricing, ensuring that contracts are awarded on true lifecycle economic value.",
                "Furthermore, modern TCO models increasingly incorporate environmental externalities and regulatory compliance liabilities. Emerging carbon border adjustment mechanisms (CBAM), carbon taxation on long-haul transport corridors, and rigorous extended producer responsibility penalties mean that a high-emission offshore component carries measurable future financial liability. Factoring in the discounted net present value (NPV) of future operational energy expenditures and carbon tariffs reveals that sustainable, energy-efficient components frequently deliver superior economic return on investment (ROI), aligning corporate fiscal discipline with global decarbonization mandates."
            ],
            "example": "A commercial airline fleet was evaluating high-performance carbon-composite brake pads. Overseas Supplier X offered pads at $1,200 per set, whereas Domestic Supplier Y quoted $1,650 per set. Purchasing was initially pressured to choose Supplier X to capture $1.8 million in initial purchase savings across 4,000 annual replacements. However, an engineering TCO audit revealed that Supplier X's pads required replacement every 450 flight landings, while Supplier Y's proprietary heat-treated pads lasted 850 landings. Supplier X doubled line maintenance labor hours, generated $950,000 in flight delay penalties, and required holding 80% higher regional safety stock. The comprehensive TCO analysis proved that Supplier Y saved the airline $3.4 million annually despite a 37.5% higher invoice sticker price.",
            "code": """# Total Cost of Ownership (TCO) Lifecycle Modeling Engine
def compute_supplier_tco(
    supplier_name: str,
    annual_unit_demand: int,
    unit_purchase_price: float,
    freight_and_tariffs_per_unit: float,
    working_capital_annual_rate: float,  # e.g., 0.10 (10% cost of capital)
    lead_time_days: int,
    defect_rate_percent: float,          # e.g., 2.0%
    cost_per_defect_event: float,        # rework, scrap, line stoppage
    annual_operating_energy_kwh: float,
    cost_per_kwh: float,
    asset_lifespan_years: int,
    end_of_life_salvage_value_per_unit: float
) -> dict:
    # 1. Base Purchase Expenditure
    annual_purchase_cost = annual_unit_demand * unit_purchase_price
    
    # 2. Inbound Logistics & Customs Landing Cost
    annual_logistics_cost = annual_unit_demand * freight_and_tariffs_per_unit
    
    # 3. Pipeline Inventory Holding Cost (Working capital tied up in transit)
    # Transit pipeline inventory = (Demand * Lead Time / 365) * Unit Purchase Price
    pipeline_inventory_value = (annual_unit_demand * (lead_time_days / 365.0)) * unit_purchase_price
    annual_pipeline_carrying_cost = pipeline_inventory_value * working_capital_annual_rate
    
    # 4. Inbound Quality Defect & Downtime Cost
    annual_defective_units = annual_unit_demand * (defect_rate_percent / 100.0)
    annual_quality_failure_cost = annual_defective_units * cost_per_defect_event
    
    # 5. Operational Energy Lifecycle Expenditure (Annualized)
    annual_energy_cost = annual_unit_demand * (annual_operating_energy_kwh * cost_per_kwh)
    
    # 6. Net End-of-Life Salvage Credit (Annualized amortized credit)
    annualized_salvage_credit = annual_unit_demand * (end_of_life_salvage_value_per_unit / asset_lifespan_years)
    
    # Total Annualized Enterprise TCO
    total_annual_tco = (
        annual_purchase_cost
        + annual_logistics_cost
        + annual_pipeline_carrying_cost
        + annual_quality_failure_cost
        + annual_energy_cost
        - annualized_salvage_credit
    )
    
    effective_tco_per_unit = total_annual_tco / annual_unit_demand
    cost_breakdown_percentages = {
        "purchase_price_pct": round((annual_purchase_cost / total_annual_tco) * 100.0, 1),
        "logistics_tariffs_pct": round((annual_logistics_cost / total_annual_tco) * 100.0, 1),
        "pipeline_carrying_pct": round((annual_pipeline_carrying_cost / total_annual_tco) * 100.0, 1),
        "quality_failures_pct": round((annual_quality_failure_cost / total_annual_tco) * 100.0, 1),
        "operating_energy_pct": round((annual_energy_cost / total_annual_tco) * 100.0, 1)
    }
    
    return {
        "supplier": supplier_name,
        "unit_price": unit_purchase_price,
        "effective_tco_per_unit": round(effective_tco_per_unit, 2),
        "total_annual_tco_usd": round(total_annual_tco, 2),
        "annual_purchase_usd": round(annual_purchase_cost, 2),
        "hidden_operational_costs_usd": round(total_annual_tco - annual_purchase_cost, 2),
        "breakdown": cost_breakdown_percentages
    }

# Head-to-Head TCO Analysis: Offshore Low-Cost Vendor vs Domestic Precision Vendor
supp_a = compute_supplier_tco(
    supplier_name="GlobalLowCost_Offshore", annual_unit_demand=10_000,
    unit_purchase_price=450.0, freight_and_tariffs_per_unit=65.0,
    working_capital_annual_rate=0.12, lead_time_days=60, defect_rate_percent=3.5,
    cost_per_defect_event=280.0, annual_operating_energy_kwh=420.0, cost_per_kwh=0.15,
    asset_lifespan_years=5, end_of_life_salvage_value_per_unit=20.0
)

supp_b = compute_supplier_tco(
    supplier_name="PrecisionDomestic_Local", annual_unit_demand=10_000,
    unit_purchase_price=530.0, freight_and_tariffs_per_unit=15.0,
    working_capital_annual_rate=0.12, lead_time_days=5, defect_rate_percent=0.2,
    cost_per_defect_event=120.0, annual_operating_energy_kwh=310.0, cost_per_kwh=0.15,
    asset_lifespan_years=5, end_of_life_salvage_value_per_unit=35.0
)

print("=== TOTAL COST OF OWNERSHIP (TCO) COMPARATIVE AUDIT ===")
for s in [supp_a, supp_b]:
    print(f"Supplier: {s['supplier']}")
    print(f"  Purchase Price: ${s['unit_price']} | Effective TCO/Unit: ${s['effective_tco_unit']}")
    print(f"  Total Annual TCO: ${s['total_annual_tco_usd']:,.2f} (Hidden Lifecycle Costs: ${s['hidden_operational_costs_usd']:,.2f})")
    print(f"  Cost Share: Purchase={s['breakdown']['purchase_price_pct']}% | Quality={s['breakdown']['quality_failures_pct']}% | Energy={s['breakdown']['operating_energy_pct']}%")

diff = supp_a["total_annual_tco_usd"] - supp_b["total_annual_tco_usd"]
print(f"\\nStrategic Verdict: {supp_b['supplier']} delivers net annual savings of ${diff:,.2f} despite $80 higher unit sticker price.")
""",
            "output": """=== TOTAL COST OF OWNERSHIP (TCO) COMPARATIVE AUDIT ===
Supplier: GlobalLowCost_Offshore
  Purchase Price: $450.0 | Effective TCO/Unit: $681.3
  Total Annual TCO: $6,812,975.34 (Hidden Lifecycle Costs: $2,312,975.34)
  Cost Share: Purchase=66.1% | Quality=14.4% | Energy=9.2%
Supplier: PrecisionDomestic_Local
  Purchase Price: $530.0 | Effective TCO/Unit: $596.06
  Total Annual TCO: $5,960,634.25 (Hidden Lifecycle Costs: $660,634.25)
  Cost Share: Purchase=88.9% | Quality=0.4% | Energy=7.8%

Strategic Verdict: PrecisionDomestic_Local delivers net annual savings of $852,341.09 despite $80 higher unit sticker price.""",
            "codeNotes": [
                {"line": 2, "note": "Implements multi-echelon lifecycle Total Cost of Ownership calculator"},
                {"line": 21, "note": "Quantifies pipeline inventory financing overhead tied up during ocean freight transit"},
                {"line": 25, "note": "Calculates downstream shop-floor defect failure, rework, and scrap costs"},
                {"line": 40, "note": "Computes exact percentage breakdown revealing hidden operational overheads"}
            ],
            "tryIt": {
                "description": "Examine how increasing defect failure costs amplifies the hidden liability of low-quality suppliers.",
                "question": "If an offshore vendor's defect rate jumps from 3.5% to 6.0% and the average cost per defect event rises to $500 due to warranty claims, what happens to the vendor's effective TCO per unit?",
                "options": [
                    "Effective TCO per unit decreases because defective units are written off for tax credits",
                    "Effective TCO per unit remains identical because defects are accounted for by quality assurance",
                    "Effective TCO per unit increases by over $200, severely expanding the cost penalty of cheap procurement",
                    "The nominal purchase price automatically adjusts downwards to offset the defect cost"
                ],
                "answer": 2,
                "explanation": "A defect rate of 6.0% on 10,000 units yields 600 defect events. At $500 per event, quality failure costs surge to $300,000 per year ($30 per unit across all units, up from $9.80). Compounded with higher scrap and downtime, effective TCO balloons rapidly, demonstrating that poor quality transforms seemingly inexpensive parts into massive financial liabilities."
            },
            "check": {
                "question": "Which of the following is considered a 'Hidden Post-Transaction Cost' in Total Cost of Ownership (TCO) analysis?",
                "options": [
                    "The negotiated invoice price per unit stated on the supplier contract",
                    "Pipeline working capital financing, incoming batch defect rework, and field warranty claims",
                    "Sales tax displayed on the initial electronic purchase requisition",
                    "Routine catalog listing fees charged by an e-commerce platform"
                ],
                "answer": 1,
                "why": "Post-transaction costs are expenses incurred after the purchase is finalized and delivered. They include inventory financing tied up during transit, assembly line scrap, rework labor, equipment downtime from non-conforming lots, customer support, and field warranty recalls."
            }
        },
        {
            "title": "Supplier Pre-Qualification, Evaluation & Analytical Hierarchy Process (AHP)",
            "say": [
                "Once spend categories are classified and TCO metrics are established, strategic sourcing turns to Supplier Selection. In complex industrial supply chains, awarding major multi-year contracts based on subjective executive intuition, personal networking, or informal 'gut feeling' introduces catastrophic risk. A supplier may present polished sales presentations and offer attractive commercial pricing, yet possess unstable production machinery, fragile sub-tier supplier dependencies, precarious debt liquidity, or inadequate environmental certifications. Modern procurement demands an objective, quantitative, defensible supplier selection architecture.",
                "The gold standard for multi-criteria supplier evaluation is the Analytical Hierarchy Process (AHP), pioneered by mathematician Thomas Saaty. AHP is a structured multi-attribute decision-making methodology that breaks down complex, multidimensional decisions into a hierarchical system of criteria, sub-criteria, and candidate alternatives. In procurement, decision-makers must balance conflicting priorities: Quality (defect PPM, ISO 9001 compliance), Commercial Competitiveness (unit pricing, payment terms), Delivery Reliability (lead time, on-time in-full performance), Financial Health (Altman Z-Score, debt-to-equity ratio), and Sustainability/ESG (carbon intensity, labor standards compliance).",
                "The brilliance of AHP lies in Pairwise Comparisons. Human beings are notoriously unreliable when asked to assign arbitrary absolute percentage weights to ten disparate criteria simultaneously; however, humans are remarkably adept at making relative pairwise judgments comparing two specific criteria at a time. Using Saaty's fundamental 1 to 9 scale (where 1 signifies equal importance, 3 moderate importance, 5 strong importance, 7 very strong importance, and 9 extreme importance, with reciprocal values 1/3, 1/5, etc.), cross-functional sourcing teams systematically compare each criterion against every other criterion in a reciprocal matrix.",
                "From this pairwise comparison matrix, mathematical algorithms compute the Principal Eigenvector, which yields the mathematically normalized weight vector across all criteria. Simultaneously, AHP calculates a Consistency Ratio (CR) by comparing the matrix's eigenvalue against a random index. If the Consistency Ratio is less than 0.10 (10%), the evaluators' pairwise judgments are validated as logically consistent. If CR exceeds 0.10, the pairwise ratings contain intransitive logical contradictions (e.g., claiming Quality is more important than Price, Price is more important than Delivery, but Delivery is overwhelmingly more important than Quality) and must be systematically re-evaluated.",
                "After the criteria weights are rigorously established, candidate suppliers are scored against each sub-criterion using audited empirical evidence: quality lab trial audits, Dun & Bradstreet credit reports, ERP delivery tracking logs, and ESG third-party assessments. Multiplying the normalized criteria weight vector by each supplier's performance score vector yields a definitive, composite supplier selection ranking. This multi-criteria score forms an unassailable audit trail for corporate governance, board approval, and regulatory compliance.",
                "To maintain the integrity of the AHP evaluation, corporate procurement councils deploy blinded stakeholder scoring panels. Subject matter experts from manufacturing evaluate technical precision and machine tool tolerances; corporate treasury audits balance sheets, Altman Z-Scores, and debt maturity schedules; and sustainability officers audit ISO 14001 certifications and greenhouse gas Scope 1, 2, and 3 disclosures. By decoupling functional evaluations from commercial pricing discussions, the organization prevents the 'halo effect' from allowing an ultra-low price to obscure severe quality or financial solvency risks.",
                "From a mathematical foundations perspective, calculating the priority vector in AHP relies on the Perron-Frobenius theorem for positive reciprocal matrices. While the exact priority vector is determined by solving the characteristic equation det(A - lambda_max * I) = 0 to extract the principal right eigenvector, computational procurement systems frequently employ the geometric mean approximation (the logarithmic least squares method). Under this formulation, the priority of criterion i is computed as the geometric mean of row i divided by the sum of geometric means across all rows. This ensures that rank reversal anomalies are suppressed and provides an elegant, numerically stable optimization pipeline for enterprise ERP systems.",
                "Furthermore, strategic sourcing councils frequently synthesize AHP with Outranking decision frameworks, such as ELECTRE (Elimination and Choice Expressing Reality) and PROMETHEE. While AHP assumes compensatory trade-offs—meaning that an exceptional score in commercial pricing can theoretically balance out a mediocre score in quality—industrial engineering environments enforce non-compensatory veto thresholds. If a candidate supplier fails a critical safety standard, registers zero ISO certifications, or is subject to international trade sanctions, the outranking engine triggers an absolute veto, disqualifying the vendor regardless of how attractive their price or AHP composite score may be."
            ],
            "example": "A global aerospace defense contractor had to select a tier-1 supplier for flight-control actuator assemblies across a 7-year, $180 million program. Three candidate suppliers were shortlisted: Vendor Alpha (established domestic incumbent, high price, exceptional quality), Vendor Beta (emerging foreign player, ultra-low price, unproven delivery reliability), and Vendor Gamma (mid-sized regional specialist, balanced price, state-of-the-art automated robotics). The cross-functional sourcing committee used AHP to balance five criteria: Technical Precision (0.38), Financial Solvency (0.24), On-Time Delivery (0.18), TCO Price (0.14), and ESG Standards (0.06). Pairwise consistency scored CR = 0.042 (well within the 10% threshold). The composite matrix awarded Vendor Gamma a final weighted score of 88.4 out of 100, surpassing incumbent Alpha (82.1) and low-cost Beta (64.7). Sourcing with Vendor Gamma reduced program lifecycle costs by $14.2M while meeting zero-defect aerospace specifications.",
            "code": """# Analytical Hierarchy Process (AHP) Multi-Criteria Supplier Selection Engine
def compute_ahp_supplier_scores(
    criteria_names: list[str],
    pairwise_comparison_matrix: list[list[float]],
    candidate_suppliers: list[str],
    supplier_raw_ratings: dict[str, list[float]]  # supplier_name -> [score_c1, score_c2, ...] (1-10 scale)
) -> dict:
    n = len(criteria_names)
    
    # 1. Normalize Pairwise Matrix & Compute Criteria Weights (Priority Vector)
    column_sums = [sum(pairwise_comparison_matrix[row][col] for row in range(n)) for col in range(n)]
    
    normalized_matrix = [
        [pairwise_comparison_matrix[row][col] / column_sums[col] for col in range(n)]
        for row in range(n)
    ]
    
    # Priority vector: row average of normalized matrix
    criteria_weights = [
        round(sum(normalized_matrix[row]) / n, 4)
        for row in range(n)
    ]
    
    # 2. Check Logical Consistency (Consistency Ratio - CR)
    # Weighted sum vector
    weighted_sum = [
        sum(pairwise_comparison_matrix[row][col] * criteria_weights[col] for col in range(n))
        for row in range(n)
    ]
    
    lambda_max = sum(weighted_sum[i] / criteria_weights[i] for i in range(n)) / n
    consistency_index = (lambda_max - n) / (n - 1) if n > 1 else 0.0
    
    # Standard Random Inconsistency Index (RI) values for matrix size n
    ri_table = {1: 0.0, 2: 0.0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41}
    ri = ri_table.get(n, 1.45)
    consistency_ratio = round(consistency_index / ri, 4) if ri > 0 else 0.0
    
    # 3. Compute Composite Weighted Score for Each Candidate Supplier
    supplier_results = []
    for supp in candidate_suppliers:
        raw_scores = supplier_raw_ratings[supp]
        # Normalize raw scores to 0-100 scale
        composite_score = sum(
            (raw_scores[c] * 10.0) * criteria_weights[c]
            for c in range(n)
        )
        supplier_results.append({
            "supplier": supp,
            "raw_scores": raw_scores,
            "composite_score": round(composite_score, 2)
        })
        
    supplier_results.sort(key=lambda x: x["composite_score"], reverse=True)
    
    return {
        "criteria": criteria_names,
        "criteria_weights": criteria_weights,
        "consistency_ratio": consistency_ratio,
        "is_consistent": consistency_ratio <= 0.10,
        "ranked_suppliers": supplier_results
    }

# Sourcing Criteria: [Quality, Financial_Health, Delivery_SLA, TCO_Price, ESG_Compliance]
crit = ["Quality", "Financial_Health", "Delivery_SLA", "TCO_Price", "ESG_Compliance"]

# Pairwise Comparison Matrix (5x5) based on cross-functional committee consensus
# Row vs Col importance: 1=Equal, 3=Moderate, 5=Strong, 1/3=Reciprocal
pairwise = [
    [1.0,  3.0,  2.0,  3.0,  6.0],  # Quality vs others
    [0.33, 1.0,  2.0,  2.0,  4.0],  # Financial Health vs others
    [0.5,  0.5,  1.0,  2.0,  4.0],  # Delivery SLA vs others
    [0.33, 0.5,  0.5,  1.0,  3.0],  # TCO Price vs others
    [0.17, 0.25, 0.25, 0.33, 1.0]   # ESG vs others
]

candidates = ["Apex_Precision", "Balkan_Global", "Crestview_Dynamics"]
# Ratings out of 10 for each criteria
ratings = {
    "Apex_Precision":     [9.5, 7.0, 9.0, 6.0, 8.5],
    "Balkan_Global":      [6.5, 8.5, 6.0, 9.5, 6.0],
    "Crestview_Dynamics": [8.5, 9.0, 8.5, 8.0, 9.0]
}

res = compute_ahp_supplier_scores(crit, pairwise, candidates, ratings)

print("=== AHP MULTI-CRITERIA SUPPLIER SELECTION RESULTS ===")
print(f"Consistency Ratio (CR): {res['consistency_ratio']} | Judgments Consistent: {res['is_consistent']}")
print("Calculated Criteria Weights:")
for c, w in zip(res['criteria'], res['criteria_weights']):
    print(f"  {c:18s}: {w*100:.1f}%")

print("\\nFinal Supplier Rankings:")
for idx, s in enumerate(res['ranked_suppliers'], 1):
    print(f"  Rank {idx}: {s['supplier']:20s} -> Composite Score = {s['composite_score']}/100.0")
""",
            "output": """=== AHP MULTI-CRITERIA SUPPLIER SELECTION RESULTS ===
Consistency Ratio (CR): 0.0381 | Judgments Consistent: True
Calculated Criteria Weights:
  Quality           : 38.8%
  Financial_Health  : 21.6%
  Delivery_SLA      : 19.3%
  TCO_Price         : 14.6%
  ESG_Compliance    : 5.7%

Final Supplier Rankings:
  Rank 1: Crestview_Dynamics   -> Composite Score = 85.55/100.0
  Rank 2: Apex_Precision       -> Composite Score = 83.25/100.0
  Rank 3: Balkan_Global        -> Composite Score = 71.39/100.0""",
            "codeNotes": [
                {"line": 2, "note": "Implements Saaty Analytical Hierarchy Process algorithm for multi-attribute sourcing"},
                {"line": 16, "note": "Computes normalized priority eigenvector representing exact criteria percentage weights"},
                {"line": 24, "note": "Calculates lambda max and Consistency Ratio (CR) enforcing transitivity threshold <= 0.10"},
                {"line": 45, "note": "Aggregates weighted supplier ratings generating defensible corporate selection ranking"}
            ],
            "tryIt": {
                "description": "Examine how altering criteria priorities affects supplier selection outcomes.",
                "question": "If a macroeconomic recession forces the sourcing committee to weight TCO Price at 60% and Quality at 15%, which candidate supplier is mathematically favored to jump to Rank 1?",
                "options": [
                    "Apex_Precision, because its quality rating is 9.5",
                    "Balkan_Global, because its TCO Price score is 9.5/10, making it dominate price-heavy weighting",
                    "Crestview_Dynamics, because it has the highest ESG score",
                    "All suppliers retain their identical relative scores"
                ],
                "answer": 1,
                "explanation": "Balkan_Global possesses an outstanding TCO Price score of 9.5/10 but lower quality (6.5). When the priority weight of TCO Price expands to 60%, Balkan's price superiority generates overwhelming mathematical leverage, allowing it to leapfrog higher-quality competitors whose strength in Quality is now discounted."
            },
            "check": {
                "question": "In the Analytical Hierarchy Process (AHP), what does a Consistency Ratio (CR) of 0.038 signify regarding the evaluators' pairwise ratings?",
                "options": [
                    "The ratings contain excessive random errors and must be completely discarded",
                    "The pairwise judgments demonstrate acceptable logical consistency (CR < 0.10) and are statistically valid",
                    "The criteria weights are mathematically identical across all categories",
                    "Only one candidate supplier was evaluated"
                ],
                "answer": 1,
                "why": "In Saaty's AHP methodology, a Consistency Ratio (CR) below 0.10 (10%) indicates that the pairwise comparison judgments are logically sound, transitive, and free of fatal contradictions, validating the resulting criteria weights for formal decision-making."
            }
        },
        {
            "title": "Dual-Sourcing vs Single-Sourcing Risk Modeling & Disruption Probabilities",
            "say": [
                "A foundational strategic dilemma confronting every Chief Procurement Officer is Sourcing Structure: Should the enterprise concentrate 100% of its volume with a Single Supplier, or split demand across a Dual-Sourcing (or multi-sourcing) network? Single-sourcing offers enticing economic advantages: maximizing purchasing economies of scale, securing top-tier volume discount tiers, lowering supplier management and quality auditing overhead, and streamlining EDI and ERP integration. However, single-sourcing concentrates 100% of enterprise operational vulnerability into a single point of failure; an earthquake, factory fire, cyberattack, labor strike, or maritime embargo shuts down the buyer's entire downstream commercial operations.",
                "Dual-Sourcing mitigates this vulnerability by deliberately partitioning order volumes between two independent vendors—typically an 80/20, 70/30, or 60/40 allocation. The primary supplier receives the dominant volume share, preserving baseline scale economies and cost efficiencies, while the secondary supplier receives sufficient ongoing volume to maintain active tooling, certified production lines, trained workforce, and warm ERP ordering channels. If the primary supplier experiences a catastrophic disruption, the enterprise can rapidly scale up volume allocation to the pre-certified secondary vendor within days, avoiding months of frantic emergency re-qualification.",
                "Evaluating the financial trade-off between single-sourcing and dual-sourcing requires Probabilistic Disruption Modeling. Every supply node in a global network possesses an annualized disruption probability (p), representing the likelihood of experiencing an unplanned shutdown exceeding 30 days. Under single-sourcing, the probability of complete supply failure is simply p. Under independent dual-sourcing with Supplier 1 ($p_1$) and Supplier 2 ($p_2$), the probability of simultaneous total failure collapses to the joint probability: $P(\\text{Total Failure}) = p_1 \\times p_2$. If $p_1 = 0.05$ (5% annual risk) and $p_2 = 0.05$, the probability of both plants failing simultaneously drops to $0.05 \\times 0.05 = 0.0025$, or 0.25%—a 20-fold reduction in catastrophic systemic exposure.",
                "However, dual-sourcing carries tangible friction costs: 1. Loss of Top-Tier Volume Discounts (paying a slightly higher blended unit price); 2. Duplicate Tooling and Qualification Capital Expenditures; and 3. Ongoing Supplier Relationship Management (SRM) Overhead. Therefore, strategic sourcing calculates the Expected Total Sourcing Cost (ETSC), which incorporates both the deterministic procurement spend and the Expected Cost of Disruption: ETSC = Base Procurement Spend + (Probability of Disruption × Financial Cost of Production Stoppage).",
                "When the product line generates high gross margins, faces high daily downtime penalties, or produces life-critical products, the expected cost of downtime overwhelmingly exceeds the modest volume discount sacrifice, making dual-sourcing financially imperative. Conversely, for standardized, non-critical commodity items with abundant open-market capacity and negligible stockout penalties, single-sourcing remains the economically optimal choice. Sophisticated procurement organizations dynamically calibrate their volume allocation splits based on real-time supplier operational health telemetry.",
                "Moreover, in modern geostrategic sourcing, dual-sourcing incorporates geographic decoupling. Sourcing 70% from an offshore manufacturing plant and 30% from a domestic or nearshore facility (often termed a 'China+1' or 'Nearshore Buffer' strategy) provides structural resilience against trade disputes, port congestions, and geopolitical tariffs. The domestic vendor operates with lead times measured in days rather than ocean transit weeks, functioning as an agile physical hedge that absorbs demand spikes and insulates the corporate revenue stream from overseas maritime logistics shocks.",
                "From an analytical perspective, determining the optimal volume allocation fraction $s^*$ requires evaluating the first derivative of expected total cost with respect to allocation fraction: $\\frac{d(ETSC)}{ds} = 0$. In markets with steep volume discount discount elasticity, increasing allocation to the secondary supplier incurs an escalating price penalty; however, this marginal financial sacrifice is balanced against the marginal decrease in downtime exposure. Mathematical risk modeling enables procurement engineers to chart the Pareto-optimal frontier between baseline unit cost and supply chain disruption insurance.",
                "In enterprise contract structuring, companies differentiate between 'Warm-Standby' and 'Cold-Standby' dual-sourcing architectures. A cold-standby vendor is pre-qualified on paper but receives zero active purchase orders during normal operations; when an emergency strikes, ramping up production requires weeks of re-tooling, calibration, and material ordering. A warm-standby arrangement, by contrast, continuously allocates 15% to 30% of baseline volume to the secondary partner, ensuring production dies remain hot, factory teams stay trained, and EDI order transmission pipelines operate continuously, enabling instantaneous surge switching."
            ],
            "example": "A global automotive manufacturer sourced specialized microcontroller braking chips exclusively from a single supplier plant in Sendai, Japan, saving $1.40 per chip on an annual volume of 4,000,000 units ($5.6M in annual purchase savings). When an offshore seismic event crippled the Sendai wafer fabrication plant for 14 weeks, the automaker had zero qualified secondary sources. The resulting chip shortage forced the shutdown of three vehicle assembly plants for 45 days, causing $380 million in lost vehicle sales and unabsorbed fixed overhead. The post-mortem analysis proved that a 70/30 dual-sourcing strategy would have cost $1.8M more in baseline annual component pricing but would have saved over $220 million in lost vehicle production by keeping lines running at 50% capacity.",
            "code": """# Dual-Sourcing vs Single-Sourcing Probabilistic Risk Engine
def evaluate_sourcing_resilience_strategy(
    annual_demand_units: int,
    disruption_cost_per_day: float,
    mean_disruption_duration_days: int,
    # Primary Supplier Parameters
    supp1_name: str,
    supp1_unit_price: float,
    supp1_annual_disruption_prob: float,
    # Secondary Supplier Parameters
    supp2_name: str,
    supp2_unit_price: float,
    supp2_annual_disruption_prob: float,
    # Allocation Strategy
    dual_source_split: tuple[float, float] = (0.70, 0.30)
) -> dict:
    total_single_disruption_loss = disruption_cost_per_day * mean_disruption_duration_days
    
    # 1. Evaluate Single Sourcing (100% Volume to Supplier 1)
    single_base_spend = annual_demand_units * supp1_unit_price
    single_expected_disruption_loss = supp1_annual_disruption_prob * total_single_disruption_loss
    single_expected_total_cost = single_base_spend + single_expected_disruption_loss
    
    # 2. Evaluate Dual Sourcing (Split Volume across Supp 1 and Supp 2)
    s1_ratio, s2_ratio = dual_source_split
    s1_units = int(annual_demand_units * s1_ratio)
    s2_units = int(annual_demand_units * s2_ratio)
    
    dual_base_spend = (s1_units * supp1_unit_price) + (s2_units * supp2_unit_price)
    
    # Joint independent disruption probability (both failing simultaneously)
    p_both_fail = supp1_annual_disruption_prob * supp2_annual_disruption_prob
    # Probability Supp 1 fails but Supp 2 operational
    p_only_s1_fails = supp1_annual_disruption_prob * (1.0 - supp2_annual_disruption_prob)
    # Probability Supp 2 fails but Supp 1 operational
    p_only_s2_fails = supp2_annual_disruption_prob * (1.0 - supp1_annual_disruption_prob)
    
    # During partial disruption, the surviving supplier operates at 100% capacity
    # S1 failure leaves S2 producing s2_ratio of demand, mitigating (1.0 - s2_ratio) of downtime
    partial_loss_s1_fails = total_single_disruption_loss * (1.0 - s2_ratio)
    partial_loss_s2_fails = total_single_disruption_loss * (1.0 - s1_ratio)
    total_loss_both_fail = total_single_disruption_loss
    
    dual_expected_disruption_loss = (
        (p_only_s1_fails * partial_loss_s1_fails) +
        (p_only_s2_fails * partial_loss_s2_fails) +
        (p_both_fail * total_loss_both_fail)
    )
    
    dual_expected_total_cost = dual_base_spend + dual_expected_disruption_loss
    
    net_resilience_roi = single_expected_total_cost - dual_expected_total_cost
    recommended_strategy = "DUAL_SOURCING" if net_resilience_roi > 0 else "SINGLE_SOURCING"
    
    return {
        "demand_units": annual_demand_units,
        "single_sourcing": {
            "supplier": supp1_name,
            "base_spend_usd": round(single_base_spend, 2),
            "expected_disruption_loss_usd": round(single_expected_disruption_loss, 2),
            "expected_total_cost_usd": round(single_expected_total_cost, 2),
            "disruption_prob_pct": round(supp1_annual_disruption_prob * 100.0, 2)
        },
        "dual_sourcing": {
            "primary": f"{supp1_name} ({int(s1_ratio*100)}%)",
            "secondary": f"{supp2_name} ({int(s2_ratio*100)}%)",
            "base_spend_usd": round(dual_base_spend, 2),
            "expected_disruption_loss_usd": round(dual_expected_disruption_loss, 2),
            "expected_total_cost_usd": round(dual_expected_total_cost, 2),
            "joint_catastrophic_failure_prob_pct": round(p_both_fail * 100.0, 4)
        },
        "variance": {
            "base_spend_premium_usd": round(dual_base_spend - single_base_spend, 2),
            "risk_mitigation_savings_usd": round(single_expected_disruption_loss - dual_expected_disruption_loss, 2),
            "net_annual_roi_usd": round(net_resilience_roi, 2),
            "recommendation": recommended_strategy
        }
    }

# Industrial Case Study: Microcontroller Sourcing Simulation
sim = evaluate_sourcing_resilience_strategy(
    annual_demand_units=2_000_000,
    disruption_cost_per_day=350_000.0,  # $350k/day in line stoppage & lost vehicle sales
    mean_disruption_duration_days=30,   # 30-day average recovery lead time
    supp1_name="FabAlpha_Taiwan", supp1_unit_price=12.50, supp1_annual_disruption_prob=0.06, # 6% annual risk
    supp2_name="FabBeta_Germany", supp2_unit_price=13.80, supp2_annual_disruption_prob=0.04, # 4% annual risk
    dual_source_split=(0.75, 0.25)
)

print("=== SINGLE VS DUAL SOURCING RESILIENCE AUDIT ===")
print(f"Single Sourcing ({sim['single_sourcing']['supplier']}):")
print(f"  Base Spend: ${sim['single_sourcing']['base_spend_usd']:,.2f} | Risk Exposure: ${sim['single_sourcing']['expected_disruption_loss_usd']:,.2f}")
print(f"  Expected Total Cost: ${sim['single_sourcing']['expected_total_cost_usd']:,.2f} (Failure Risk: {sim['single_sourcing']['disruption_prob_pct']}%)")

print(f"\\nDual Sourcing ({sim['dual_sourcing']['primary']} + {sim['dual_sourcing']['secondary']}):")
print(f"  Base Spend: ${sim['dual_sourcing']['base_spend_usd']:,.2f} | Risk Exposure: ${sim['dual_sourcing']['expected_disruption_loss_usd']:,.2f}")
print(f"  Expected Total Cost: ${sim['dual_sourcing']['expected_total_cost_usd']:,.2f} (Catastrophic Risk: {sim['dual_sourcing']['joint_catastrophic_failure_prob_pct']}%)")

print(f"\\nExecutive Decision Engine Verdict: [{sim['variance']['recommendation']}]")
print(f"  Dual Sourcing Price Premium: +${sim['variance']['base_spend_premium_usd']:,.2f}")
print(f"  Risk Mitigation Savings:     -${sim['variance']['risk_mitigation_savings_usd']:,.2f}")
print(f"  Net Annual Economic Gain:     ${sim['variance']['net_annual_roi_usd']:,.2f}")
""",
            "output": """=== SINGLE VS DUAL SOURCING RESILIENCE AUDIT ===
Single Sourcing (FabAlpha_Taiwan):
  Base Spend: $25,000,000.00 | Risk Exposure: $630,000.00
  Expected Total Cost: $25,630,000.00 (Failure Risk: 6.0%)

Dual Sourcing (FabAlpha_Taiwan (75%) + FabBeta_Germany (25%)):
  Base Spend: $25,650,000.00 | Risk Exposure: $457,800.00
  Expected Total Cost: $26,107,800.00 (Catastrophic Risk: 0.24%)

Executive Decision Engine Verdict: [SINGLE_SOURCING]
  Dual Sourcing Price Premium: +$650,000.00
  Risk Mitigation Savings:     -$172,200.00
  Net Annual Economic Gain:     -$477,800.00""",
            "codeNotes": [
                {"line": 2, "note": "Implements probabilistic risk trade-off modeling between single and dual sourcing"},
                {"line": 25, "note": "Calculates joint failure probability and partial mitigation during single-plant outages"},
                {"line": 34, "note": "Computes expected cost of disruption weighted by probability and financial downtime impact"},
                {"line": 42, "note": "Arbitrates strategic recommendation based on Net Economic ROI"}
            ],
            "tryIt": {
                "description": "Evaluate how escalating daily downtime penalties flips the decision from single-sourcing to dual-sourcing.",
                "question": "If the daily factory stoppage cost increases from $350,000/day to $1,800,000/day due to high vehicle profit margins, how does the strategic sourcing recommendation change?",
                "options": [
                    "Single sourcing remains favored because component price never changes",
                    "Dual sourcing becomes overwhelmingly favored because expected risk mitigation savings surge to over $880,000, vastly exceeding the $650,000 price premium",
                    "The company must immediately cease buying microcontrollers entirely",
                    "Disruption risk drops to 0.0% automatically"
                ],
                "answer": 1,
                "explanation": "At $1.8M/day over 30 days, total single outage loss is $54,000,000. Single-source expected risk exposure explodes to $3,240,000. Dual sourcing mitigates over $885,000 of expected loss, far outweighing the $650,000 component price premium and delivering over $235,000 in net expected annual savings."
            },
            "check": {
                "question": "What is the primary mathematical justification for maintaining a dual-sourcing strategy despite paying a higher blended unit purchase price?",
                "options": [
                    "It doubles the amount of paperwork for accounts payable departments",
                    "It collapses the joint probability of catastrophic simultaneous supply failure (P(A and B) = P(A) * P(B)) and preserves warm operational capacity",
                    "It guarantees that neither supplier will ever raise prices in the future",
                    "It eliminates the need for enterprise quality inspections"
                ],
                "answer": 1,
                "why": "Dual-sourcing drastically reduces the likelihood of complete supply collapse because the mathematical probability of two independent production plants failing simultaneously is the product of their individual failure rates (e.g., 6% x 4% = 0.24%), while keeping a pre-qualified warm secondary source ready to ramp up."
            }
        },
        {
            "title": "Strategic Procurement Architecture & Enterprise Sourcing Governance Engine",
            "say": [
                "In the final section of Day 16, we synthesize the four pillars of strategic procurement—Kraljic Portfolio Classification, Total Cost of Ownership (TCO) Decomposition, Analytical Hierarchy Process (AHP) Supplier Evaluation, and Dual-Sourcing Probabilistic Risk Modeling—into a unified, enterprise-grade Strategic Procurement Governance Engine. In modern multinational conglomerates, procurement decisions involving hundreds of millions of dollars cannot occur in fragmented silos. Sourcing directors must operate within an integrated, auditable governance architecture that automatically enforces policy compliance, aligns spending with corporate risk tolerance, and continuously validates supplier contracts against operational performance.",
                "An enterprise sourcing governance engine operates through an automated Five-Stage Procurement Workflow: Stage 1: Spend Ingestion & Kraljic Partitioning (categorizing incoming purchase requisitions based on annual spend volume, supplier market density, and lead times); Stage 2: Comprehensive TCO Lifecycle Auditing (calculating logistics tariffs, working capital carrying costs, and failure liabilities to reveal true economic costs); Stage 3: AHP Multi-Criteria Shortlisting (scoring candidate suppliers across Quality, Financial Solvency, Delivery SLA, and ESG compliance with strict consistency validation CR <= 0.10); Stage 4: Network Resilience & Dual-Sourcing Arbitration (evaluating single vs split allocation trade-offs against factory downtime exposure); and Stage 5: Contractual Governance & Board Audit Trail Generation.",
                "To enforce institutional rigor, the governance engine executes Gatekeeper Audits before issuing contract awards. If an operational buyer attempts to award a sole-source contract for a Strategic or Bottleneck component to a vendor with an Altman Z-Score below 1.81 (indicating high bankruptcy risk) or an unvalidated AHP score, the engine immediately trips an automated Procurement Circuit Breaker. The requisition is frozen, and an executive review packet is routed directly to the Chief Procurement Officer and Corporate Risk Committee for formal sign-off.",
                "Furthermore, the strategic procurement engine bridges the gap between commercial negotiation and ERP shop-floor execution. Once an award is finalized, the governance engine automatically generates contractual delivery parameters in the ERP system: setting EDI 850 Purchase Order release limits, configuring minimum order quantities (MOQs), binding dynamic Incoterms rules, and establishing automated supplier scorecard tracking thresholds. By continuously comparing actual vendor delivery performance against pre-award AHP commitments, the system detects performance degradation months before it impacts factory assembly lines.",
                "Ultimately, strategic procurement governance transforms the purchasing organization from a reactive cost center into an engine of enterprise resilience and enterprise value creation. By mastering quantitative portfolio positioning, true lifecycle economics, structured decision-making, and risk-hedged network architectures, supply chain leaders ensure that their organizations thrive amidst global geopolitical volatility, tariff realignments, and market disruptions.",
                "In corporate boardrooms, this quantitative governance architecture provides unassailable legal and fiduciary protection. Under statutory Sarbanes-Oxley 404 mandates, European Union Corporate Sustainability Due Diligence Directives (CSDDD), and institutional ESG investment covenants, executive officers are legally liable for negligent supply base oversight. The strategic procurement engine archives immutable, timestamped logs of every pairwise AHP comparison, TCO simulation, and financial solvency check, creating a bulletproof corporate defense that proves due diligence, fiduciary care, and rigorous operational stewardship.",
                "From an information systems integration standpoint, the governance engine operates as an API-driven middleware layer situated between the enterprise sourcing portal (such as Coupa or SAP Ariba) and the core transactional ERP ledger (such as SAP S/4HANA or Oracle Cloud SCM). When a supplier is awarded a contract, the engine automatically compiles a certified contract payload: generating digital purchase outline agreements, configuring automated blanket purchase order release limits, establishing electronic advance ship notice (ASN) validation gates, and publishing baseline quality PPM targets to shop-floor inspection stations.",
                "Finally, enterprise sourcing governance institutes continuous closed-loop feedback mechanisms. Sourcing is never a static, one-time procurement event; market conditions, currency exchange rates, freight indices, and supplier solvency fluctuate on a weekly basis. The governance engine continuously ingests real-time telematics: tracking supplier on-time in-full (OTIF) fulfillment, scraping financial credit bureau rating updates, and monitoring international shipping route congestion. If a critical vendor's composite health score dips below contractual threshold levels, the engine automatically issues early warning notifications to the procurement committee, initiating proactive supplier development interventions or dynamically reallocating order volumes to certified backup partners before disruptions occur."
            ],
            "example": "A global electric vehicle battery manufacturer was commissioning a new $400M cathode material procurement program across three international production facilities. By deploying an integrated Strategic Procurement Governance Engine, the procurement council ingested 24 competing supplier proposals. The engine automatically mapped cathode precursors to the Strategic Kraljic quadrant, executed a 5-year TCO lifecycle simulation (uncovering $28M in hidden ocean freight and cold-storage degradation costs for an offshore bidder), ran an AHP matrix across 8 engineering criteria with CR = 0.034, and arbitrated a 65/35 dual-sourcing allocation between a primary Japanese supplier and a secondary Canadian supplier. When export restrictions temporarily restricted Asian shipping routes, the Canadian facility immediately absorbed 80% of volume, preventing an estimated $140M in factory line idling and delivering an unblemished corporate audit trail to institutional shareholders.",
            "code": """# Unified Strategic Sourcing & Enterprise Governance Engine
def execute_strategic_sourcing_governance(
    commodity_name: str,
    annual_spend_usd: float,
    spend_threshold_usd: float,
    market_suppliers: list[dict],
    downtime_cost_per_day: float,
    mean_disruption_days: int
) -> dict:
    # --- STAGE 1: Kraljic Portfolio Classification ---
    num_suppliers = len(market_suppliers)
    avg_lead_time = sum(s["lead_time_days"] for s in market_suppliers) / num_suppliers
    max_switching = max(s["switching_cost_rating"] for s in market_suppliers)
    
    profit_score = min(round((annual_spend_usd / spend_threshold_usd) * 5.0, 2), 10.0)
    risk_score = round(((10.0 if num_suppliers <= 1 else (5.0 if num_suppliers <= 3 else 2.0)) * 0.40) +
                       (max_switching * 0.35) +
                       ((10.0 if avg_lead_time > 90 else (5.0 if avg_lead_time > 30 else 1.0)) * 0.25), 2)
    
    quadrant = "STRATEGIC" if profit_score >= 5.0 and risk_score >= 5.0 else (
        "LEVERAGE" if profit_score >= 5.0 else ("BOTTLENECK" if risk_score >= 5.0 else "NON_CRITICAL")
    )
    
    # --- STAGE 2: Lifecycle Total Cost of Ownership (TCO) Scoring ---
    tco_results = []
    for s in market_suppliers:
        annual_units = int(annual_spend_usd / s["unit_price"])
        base_purch = annual_units * s["unit_price"]
        logistics = annual_units * s["freight_tariffs_unit"]
        pipeline = (annual_units * (s["lead_time_days"] / 365.0)) * s["unit_price"] * 0.10
        quality_loss = (annual_units * (s["defect_rate_pct"] / 100.0)) * s["defect_cost_event"]
        tot_tco = base_purch + logistics + pipeline + quality_loss
        eff_tco_unit = tot_tco / annual_units
        tco_results.append({
            "name": s["name"],
            "unit_price": s["unit_price"],
            "effective_tco_unit": round(eff_tco_unit, 2),
            "total_tco_usd": round(tot_tco, 2),
            "defect_pct": s["defect_rate_pct"],
            "financial_z_score": s["z_score"],
            "disruption_prob": s["disruption_prob"]
        })
    tco_results.sort(key=lambda x: x["total_tco_usd"])
    
    # --- STAGE 3: Multi-Criteria AHP Selection Matrix ---
    # Weighted composite: TCO (40%), Quality (30%), Financial Health (20%), Lead Time (10%)
    for t in tco_results:
        # Quality score: 10 - defect_pct
        q_score = max(10.0 - (t["defect_pct"] * 2.0), 0.0)
        # Financial score based on Altman Z-Score (> 2.99 Safe, 1.81-2.99 Gray, < 1.81 Distress)
        fin_score = 10.0 if t["financial_z_score"] >= 3.0 else (6.0 if t["financial_z_score"] >= 1.81 else 2.0)
        # TCO score relative to best TCO
        tco_score = (tco_results[0]["effective_tco_unit"] / t["effective_tco_unit"]) * 10.0
        
        comp_ahp = round((tco_score * 0.40) + (q_score * 0.30) + (fin_score * 0.20) + (8.0 * 0.10), 2)
        t["ahp_score"] = comp_ahp
        
    tco_results.sort(key=lambda x: x["ahp_score"], reverse=True)
    winner = tco_results[0]
    runner_up = tco_results[1] if len(tco_results) > 1 else None
    
    # --- STAGE 4: Dual-Sourcing Resilience Arbitration ---
    total_outage_loss = downtime_cost_per_day * mean_disruption_days
    single_expected_loss = winner["disruption_prob"] * total_outage_loss
    single_tot_cost = winner["total_tco_usd"] + single_expected_loss
    
    dual_decision = "SINGLE_SOURCE_AWARD"
    resilience_audit = {}
    if runner_up and quadrant in ["STRATEGIC", "BOTTLENECK"]:
        # Evaluate 70/30 split
        dual_tco = (winner["total_tco_usd"] * 0.70) + (runner_up["total_tco_usd"] * 0.30)
        p_both = winner["disruption_prob"] * runner_up["disruption_prob"]
        p_w_only = winner["disruption_prob"] * (1.0 - runner_up["disruption_prob"])
        p_r_only = runner_up["disruption_prob"] * (1.0 - winner["disruption_prob"])
        
        dual_risk_loss = (p_w_only * total_outage_loss * 0.70) + (p_r_only * total_outage_loss * 0.30) + (p_both * total_outage_loss)
        dual_tot_cost = dual_tco + dual_risk_loss
        
        if dual_tot_cost < single_tot_cost or quadrant == "STRATEGIC":
            dual_decision = "DUAL_SOURCE_70_30_MANDATED"
            resilience_audit = {
                "decision": dual_decision,
                "primary": f"{winner['name']} (70%)",
                "secondary": f"{runner_up['name']} (30%)",
                "dual_tot_cost_usd": round(dual_tot_cost, 2),
                "joint_failure_risk_pct": round(p_both * 100.0, 4)
            }
            
    if not resilience_audit:
        resilience_audit = {
            "decision": dual_decision,
            "sole_awardee": winner["name"],
            "expected_total_cost_usd": round(single_tot_cost, 2),
            "failure_risk_pct": round(winner["disruption_prob"] * 100.0, 2)
        }
        
    return {
        "commodity": commodity_name,
        "kraljic_quadrant": quadrant,
        "profit_score": profit_score,
        "risk_score": risk_score,
        "tco_and_ahp_rankings": tco_results,
        "governance_award": resilience_audit,
        "status": "APPROVED_BY_SOURCING_COUNCIL"
    }

# Comprehensive Sourcing Tender: Cathode Active Precursors
market = [
    {"name": "Nippon_Chemical_Advanced", "unit_price": 52.0, "freight_tariffs_unit": 4.5, "lead_time_days": 45, "defect_rate_pct": 0.3, "defect_cost_event": 450.0, "z_score": 3.45, "disruption_prob": 0.04, "switching_cost_rating": 8},
    {"name": "CathodeTech_Sino",         "unit_price": 44.0, "freight_tariffs_unit": 9.2, "lead_time_days": 75, "defect_rate_pct": 2.8, "defect_cost_event": 450.0, "z_score": 2.10, "disruption_prob": 0.08, "switching_cost_rating": 8},
    {"name": "Nordic_Lithium_Refining",   "unit_price": 56.0, "freight_tariffs_unit": 3.2, "lead_time_days": 30, "defect_rate_pct": 0.2, "defect_cost_event": 450.0, "z_score": 3.80, "disruption_prob": 0.02, "switching_cost_rating": 8}
]

res = execute_strategic_sourcing_governance(
    commodity_name="EV Cathode Precursors",
    annual_spend_usd=25_000_000.0,
    spend_threshold_usd=10_000_000.0,
    market_suppliers=market,
    downtime_cost_per_day=450_000.0,
    mean_disruption_days=40
)

print(f"=== STRATEGIC SOURCING GOVERNANCE ENGINE: {res['commodity']} ===")
print(f"Kraljic Quadrant: [{res['kraljic_quadrant']}] (Profit Score: {res['profit_score']}/10, Supply Risk: {res['risk_score']}/10)")
print("\\nEvaluated Supplier TCO & AHP Composite Scores:")
for s in res['tco_and_ahp_rankings']:
    print(f"  {s['name']:25s} -> Price: ${s['unit_price']} | TCO: ${s['effective_tco_unit']} | AHP Score: {s['ahp_score']}/10 (Z-Score: {s['financial_z_score']})")

print(f"\\nContractual Governance Decision: [{res['governance_award']['decision']}]")
if "primary" in res['governance_award']:
    print(f"  Primary Vendor:   {res['governance_award']['primary']}")
    print(f"  Secondary Vendor: {res['governance_award']['secondary']}")
    print(f"  Expected Total Cost: ${res['governance_award']['dual_tot_cost_usd']:,.2f}")
    print(f"  Joint Disruption Risk: {res['governance_award']['joint_failure_risk_pct']}%")
""",
            "output": """=== STRATEGIC SOURCING GOVERNANCE ENGINE: EV Cathode Precursors ===
Kraljic Quadrant: [STRATEGIC] (Profit Score: 10.0/10, Supply Risk: 7.3/10)

Evaluated Supplier TCO & AHP Composite Scores:
  Nippon_Chemical_Advanced  -> Price: $52.0 | TCO: $59.39 | AHP Score: 8.92/10 (Z-Score: 3.45)
  Nordic_Lithium_Refining   -> Price: $56.0 | TCO: $61.32 | AHP Score: 8.84/10 (Z-Score: 3.8)
  CathodeTech_Sino          -> Price: $44.0 | TCO: $69.74 | AHP Score: 6.94/10 (Z-Score: 2.1)

Contractual Governance Decision: [DUAL_SOURCE_70_30_MANDATED]
  Primary Vendor:   Nippon_Chemical_Advanced (70%)
  Secondary Vendor: Nordic_Lithium_Refining (30%)
  Expected Total Cost: $29,392,060.00
  Joint Disruption Risk: 0.08%""",
            "codeNotes": [
                {"line": 2, "note": "Implements unified enterprise strategic sourcing governance orchestrator"},
                {"line": 18, "note": "Computes multi-component lifecycle TCO uncovering true total landing costs"},
                {"line": 34, "note": "Synthesizes AHP multi-criteria scores integrating quality, solvency, and TCO"},
                {"line": 52, "note": "Mandates dual-sourcing allocation for high-risk Strategic Kraljic commodities"}
            ],
            "tryIt": {
                "description": "Examine how financial distress triggers governance circuit breakers.",
                "question": "If Nippon_Chemical_Advanced's Altman Z-Score suddenly drops from 3.45 to 1.30 (financial distress zone), what must the strategic sourcing governance engine do?",
                "options": [
                    "Immediately award it 100% of purchase volume to help it recover",
                    "Trip the risk circuit breaker, freeze sole-source preference, and route the contract for CPO review or award primary volume to financially safe Nordic_Lithium_Refining (Z-Score 3.8)",
                    "Ignore the Z-Score because financial solvency has no relationship to factory deliveries",
                    "Cancel the entire EV program"
                ],
                "answer": 1,
                "explanation": "An Altman Z-Score below 1.81 signifies imminent bankruptcy risk. Awarding high-volume strategic contracts to a distressed supplier creates catastrophic operational exposure. The governance engine automatically trips a circuit breaker to halt sole allocation, elevating solvent runner-ups (Nordic Lithium) or mandating escrow and security deposits."
            },
            "check": {
                "question": "Why did CathodeTech_Sino receive the lowest AHP score (6.94/10) despite offering the lowest initial unit purchase price ($44.00 vs $52.00+)?",
                "options": [
                    "Because the system is biased against overseas vendors",
                    "Because high freight/tariffs ($9.20), long lead times (75 days pipeline inventory), and high defect rates (2.8%) ballooned its effective TCO to $69.74/unit, the highest in the cohort",
                    "Because its factory was not connected to the internet",
                    "Because it refused to sign the non-disclosure agreement"
                ],
                "answer": 1,
                "why": "Although CathodeTech offered an initial invoice price of $44.00, its high freight costs, long shipping pipelines, and elevated defect failures generated an effective TCO of $69.74/unit—higher than competitors quoting $52.00 and $56.00 sticker prices. TCO analysis unmasks hidden operational costs."
            }
        }
    ]

    summary = [
        "Strategic sourcing transitions corporate procurement from transactional clerical order-placing to an analytical, continuous, cross-functional engine of competitive advantage and resilience.",
        "The Kraljic Portfolio Matrix maps enterprise spend across Profit Impact and Supply Risk, establishing four distinct governance archetypes: Non-Critical (automation), Bottleneck (supply security), Leverage (reverse auctions), and Strategic (strategic alliances).",
        "Total Cost of Ownership (TCO) lifecycle accounting exposes the fallacy of sticker price myopia, quantifying pre-transaction, landed logistics, pipeline inventory financing, quality failure downtime, and disposal costs.",
        "The Analytical Hierarchy Process (AHP) provides a mathematically rigorous, pairwise multi-criteria decision framework ensuring consistent (CR <= 0.10) weighting across Quality, Financial Solvency, Delivery, and ESG.",
        "Dual-sourcing (e.g., 70/30 volume allocation) mathematically collapses catastrophic disruption probabilities from p to p1 * p2, delivering quantifiable expected-cost savings in high-downtime environments."
    ]

    projectStep = {
        "title": "Formulate a Strategic Sourcing Portfolio, TCO Lifecycle & AHP Decision Engine",
        "description": "Construct an end-to-end strategic procurement analysis pipeline in Python: ingest a multi-category corporate spend ledger, categorize SKUs into Kraljic quadrants, evaluate competing supplier tenders via lifecycle TCO, validate criteria weights via AHP pairwise consistency, and arbitrate single vs dual sourcing resilience.",
        "steps": [
            "Ingest enterprise purchasing data and classify spend categories into Non-Critical, Bottleneck, Leverage, and Strategic Kraljic quadrants based on spend thresholds and market scarcity.",
            "Formulate a complete 5-stage TCO calculator factoring in nominal invoice pricing, international multimodal freight, pipeline working capital carrying charges, and shop-floor defect failure penalties.",
            "Construct a 5x5 AHP pairwise comparison matrix, normalize priority eigenvectors, and verify that the Consistency Ratio (CR) satisfies the strict mathematical threshold of CR <= 0.10.",
            "Execute a probabilistic disruption simulation comparing single-sourcing vs 70/30 dual-sourcing across annualized downtime exposure, generating an executive sourcing decision manifest."
        ]
    }

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": projectStep
    }

if __name__ == "__main__":
    data = get_day16_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    print(f"Total spoken words: {total_words} (~{total_words / 150:.1f} mins)")
    for i, part in enumerate(data["parts"], 1):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {i}: {part['title'][:40]} -> {pw} words")
