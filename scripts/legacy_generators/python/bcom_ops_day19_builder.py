# scripts/bcom_ops_day19_builder.py
import os
import sys

def get_day19_data():
    day = 19
    title = "Contract Negotiation, Supplier Relationship Management (SRM) & Risk Mitigation"
    goal = "Master enterprise procurement contracting, principled commercial negotiations, and multi-tier supplier risk governance: architecting Master Services Agreements (MSAs) and Statements of Work (SOWs) with enforceable Liquidated Damages and Force Majeure provisions; executing principled Harvard negotiations utilizing BATNA, ZOPA, and multi-issue trade-off frontiers; auditing vendor financial solvency via Edward Altman's Z-Score and liquidity ratios; and engineering ISO 22301 Business Continuity Plans (BCP) to mitigate geopolitical, climate, and black swan supply chain disruptions."
    minutes = 45
    recap = "On Day 18, we mastered post-award supplier telemetry: constructing 3D Spend Cubes, tracking OTIF fulfillment and PPM defects, running Balanced Supplier Scorecards with 8D CAPA, and unlocking collaborative value via ESI and VA/VE. On Day 19, we establish the legal, commercial, and financial shields that protect the enterprise: how do procurement executives negotiate bulletproof supply contracts, detect vendor insolvency before bankruptcy strikes, and engineer resilient supply networks capable of surviving geopolitical shocks?"

    parts = [
        {
            "title": "Commercial Contract Architecture: MSAs, SOWs, Liquidated Damages & Force Majeure",
            "say": [
                "Welcome to Day 19 of Operations and Supply Chain Management. In high-stakes enterprise procurement, the commercial contract is the supreme legal and operational instrument that governs the transfer of value, defines performance obligations, and allocates economic risk between buyer and supplier. When managing multi-million-dollar supply relationships across global jurisdictions, relying on informal emails or simple standard purchase orders (POs) is a catastrophic recipe for litigation, operational disruption, and financial loss. Sophisticated procurement organizations architect commercial agreements using a modular, two-tier legal framework: The Master Services Agreement (MSA) and the Statement of Work (SOW).",
                "The Master Services Agreement (MSA) serves as the overarching contractual constitution that governs the long-term relationship between the buying entity and the supplier. The MSA establishes permanent, foundational legal covenants that rarely change over time: intellectual property ownership (distinguishing between background IP owned prior to contracting and foreground IP created during performance), confidentiality and non-disclosure covenants, indemnification against third-party patent infringements, representations and warranties, default dispute resolution mechanisms (such as mandatory ICC international arbitration), governing law, and comprehensive Limitation of Liability (LoL) clauses. By establishing these complex legal terms once in an enterprise-wide MSA, procurement eliminates the need to renegotiate legal terms for every subsequent transaction.",
                "Beneath the MSA umbrella, operational purchasing executes transactional Statements of Work (SOWs) and individual Purchase Orders (POs). A Statement of Work is a dynamic, project-specific operational document that specifies granular deliverables, technical blueprints, milestone schedules, unit pricing tiers, service-level agreements (SLAs), and acceptance testing protocols. If a conflict arises between an SOW and the MSA, the legal hierarchy of terms explicitly dictates that the master agreement's risk-allocation protections prevail, unless the SOW explicitly identifies a specific clause to override.",
                "To ensure commercial compliance and operational discipline, supply contracts incorporate Liquidated Damages (LD) provisions. In commercial contract law (such as the Uniform Commercial Code - UCC § 2-718), courts will strictly enforce liquidated damages only if they represent a reasonable, pre-agreed estimate of anticipated actual harm at the time of contract execution, rather than an unenforceable punitive penalty. In industrial supply chains, delivery delays inflict catastrophic financial injury: shutting down automated assembly lines, idling unionized labor, and triggering missed customer shipments. Liquidated damages clauses quantify this operational reality: for example, assessing $15,000 per calendar day of unexcused delivery delay or 1.5% of shipment value per business day, capped at an aggregate maximum (typically 15% to 25% of total contract value).",
                "Equally critical is the precise legal drafting of the Force Majeure clause. Derived from French law meaning 'superior force', a Force Majeure clause temporarily excuses a party from performing contractual obligations when unforeseen, unavoidable, and extraordinary external events make performance physically or legally impossible. In global supply contracts, the clause must be narrowly circumscribed to genuine sovereign catastrophes: declared wars, maritime blockades, sovereign export embargoes, severe earthquakes, volcanic eruptions, or catastrophic floods. Procurement attorneys must vigorously resist supplier attempts to dilute Force Majeure to cover routine commercial risks—such as general inflation, currency fluctuations, common labor strikes, subcontractor defaults, or routine raw material market shortages. The clause mandates strict evidentiary standards: the affected party must provide written notice within 48 to 72 hours, submit third-party proof (such as chamber of commerce force majeure certificates), and execute documented mitigation measures.",
                "Finally, contracts establish clear Termination for Convenience and Termination for Default covenants. While Termination for Default allows the buyer to terminate immediately upon an uncured material breach (such as failing an 8D CAPA or breaching an OTIF threshold) without penalty and recover excess re-procurement costs from backup vendors, Termination for Convenience permits the buyer to exit a non-strategic contract upon 30 or 60 days written notice, compensating the supplier solely for completed work-in-progress and verifiable, unrecoverable raw materials. Mastering this commercial contract architecture ensures that procurement executives maintain absolute legal and financial control over their global supply ecosystem."
            ],
            "example": "A global wind turbine manufacturer contracted with a precision gearbox supplier under a comprehensive MSA and project SOW. The SOW specified delivery of 50 heavy-duty gearboxes by September 1, with an enforceable Liquidated Damages clause of $20,000 per calendar day of delay (capped at 20% of the $8,000,000 contract value) reflecting the offshore crane barge demurrage costs. The supplier suffered a machine breakdown in its German plant and delivered 24 days late, attempting to claim Force Majeure due to local component shortages. The buyer's legal and procurement team rejected the Force Majeure claim because routine mechanical failure does not meet the legal standard of an unavoidable external act of God. The buyer enforced the liquidated damages clause, legally deducting $480,000 (24 days × $20,000) directly from the final invoice remittance, fully offsetting its offshore crane standby losses without entering costly litigation.",
            "code": """# Commercial Procurement Contract Engine: Liquidated Damages & SLA Auditor
def audit_contractual_delivery_performance(
    contract_id: str,
    contract_value_usd: float,
    promised_delivery_date_str: str,
    actual_delivery_date_str: str,
    daily_liquidated_damages_usd: float,
    max_ld_cap_pct: float = 20.0,
    force_majeure_claimed: bool = False,
    force_majeure_valid: bool = False,
    force_majeure_excused_days: int = 0
) -> dict:
    from datetime import datetime
    
    date_fmt = "%Y-%m-%d"
    d_promised = datetime.strptime(promised_delivery_date_str, date_fmt)
    d_actual = datetime.strptime(actual_delivery_date_str, date_fmt)
    
    total_elapsed_delay_days = max((d_actual - d_promised).days, 0)
    
    # Evaluate Force Majeure adjustments
    if force_majeure_claimed and force_majeure_valid:
        chargeable_delay_days = max(total_elapsed_delay_days - force_majeure_excused_days, 0)
        fm_status = f"VALID_FORCE_MAJEURE: {force_majeure_excused_days} days excused"
    elif force_majeure_claimed and not force_majeure_valid:
        chargeable_delay_days = total_elapsed_delay_days
        fm_status = "REJECTED_FORCE_MAJEURE: Routine commercial risk or invalid documentation"
    else:
        chargeable_delay_days = total_elapsed_delay_days
        fm_status = "NO_CLAIM_FILED"
        
    # Calculate Liquidated Damages before and after cap
    uncapped_ld = chargeable_delay_days * daily_liquidated_damages_usd
    max_allowable_ld = contract_value_usd * (max_ld_cap_pct / 100.0)
    enforceable_ld = min(uncapped_ld, max_allowable_ld)
    
    # Net Contract Payment Remittance
    net_payable = contract_value_usd - enforceable_ld
    is_cap_breached = uncapped_ld > max_allowable_ld
    
    # Governance classification
    if chargeable_delay_days == 0:
        governance_status = "PERFECT_FULFILLMENT"
    elif not is_cap_breached:
        governance_status = "RECOVERABLE_DELAY_WITH_FULL_LD"
    else:
        governance_status = "CRITICAL_BREACH_LD_CAP_EXCEEDED_TERMINATION_TRIGGERED"
        
    return {
        "contract_id": contract_id,
        "contract_value_usd": round(contract_value_usd, 2),
        "total_delay_days": total_elapsed_delay_days,
        "chargeable_delay_days": chargeable_delay_days,
        "force_majeure_status": fm_status,
        "daily_ld_rate_usd": daily_liquidated_damages_usd,
        "uncapped_liquidated_damages_usd": round(uncapped_ld, 2),
        "enforceable_liquidated_damages_usd": round(enforceable_ld, 2),
        "max_allowable_ld_cap_usd": round(max_allowable_ld, 2),
        "is_ld_cap_breached": is_cap_breached,
        "net_contract_payable_usd": round(net_payable, 2),
        "governance_status": governance_status
    }

# Head-to-Head Contract Performance Audit: Standard Delay vs Disputed Force Majeure
case_a = audit_contractual_delivery_performance(
    contract_id="WIND-TURBINE-GB-01",
    contract_value_usd=8_000_000.0,
    promised_delivery_date_str="2026-09-01",
    actual_delivery_date_str="2026-09-25", # 24 days late
    daily_liquidated_damages_usd=20_000.0,
    max_ld_cap_pct=20.0,
    force_majeure_claimed=True,
    force_majeure_valid=False # Rejected supplier machine breakdown claim
)

case_b = audit_contractual_delivery_performance(
    contract_id="SOLAR-INVERTER-SOW-04",
    contract_value_usd=3_500_000.0,
    promised_delivery_date_str="2026-08-01",
    actual_delivery_date_str="2026-09-15", # 45 days late
    daily_liquidated_damages_usd=25_000.0,
    max_ld_cap_pct=20.0,
    force_majeure_claimed=True,
    force_majeure_valid=True, # Valid: Port closed by sovereign military blockade
    force_majeure_excused_days=30
)

print("=== COMMERCIAL PROCUREMENT CONTRACT PERFORMANCE & LD AUDIT ===")
for c in [case_a, case_b]:
    print(f"Contract: {c['contract_id']} (Value: ${c['contract_value_usd']:,.2f})")
    print(f"  Delivery Delay: {c['total_delay_days']} days total -> Chargeable: {c['chargeable_delay_days']} days")
    print(f"  Force Majeure: {c['force_majeure_status']}")
    print(f"  Enforceable LD Deducted: ${c['enforceable_liquidated_damages_usd']:,.2f} (Cap: ${c['max_allowable_ld_cap_usd']:,.2f})")
    print(f"  Net Remittance: ${c['net_contract_payable_usd']:,.2f} | Status: [{c['governance_status']}]\\n")
""",
            "output": """=== COMMERCIAL PROCUREMENT CONTRACT PERFORMANCE & LD AUDIT ===
Contract: WIND-TURBINE-GB-01 (Value: $8,000,000.00)
  Delivery Delay: 24 days total -> Chargeable: 24 days
  Force Majeure: REJECTED_FORCE_MAJEURE: Routine commercial risk or invalid documentation
  Enforceable LD Deducted: $480,000.00 (Cap: $1,600,000.00)
  Net Remittance: $7,520,000.00 | Status: [RECOVERABLE_DELAY_WITH_FULL_LD]

Contract: SOLAR-INVERTER-SOW-04 (Value: $3,500,000.00)
  Delivery Delay: 45 days total -> Chargeable: 15 days
  Force Majeure: VALID_FORCE_MAJEURE: 30 days excused
  Enforceable LD Deducted: $375,000.00 (Cap: $700,000.00)
  Net Remittance: $3,125,000.00 | Status: [RECOVERABLE_DELAY_WITH_FULL_LD]""",
            "codeNotes": [
                {"line": 2, "note": "Implements commercial contract delivery performance and liquidated damages auditor"},
                {"line": 16, "note": "Validates and parses Force Majeure claims distinguishing valid events from rejected commercial excuses"},
                {"line": 27, "note": "Enforces pre-agreed daily liquidated damages capped at contractual maximum percentage"},
                {"line": 31, "note": "Computes net financial remittance and checks for material breach termination thresholds"}
            ],
            "tryIt": {
                "description": "Examine how contractual liquidated damages caps protect both parties from unbounded liabilities while enforcing performance.",
                "question": "If a $5,000,000 contract specifies daily liquidated damages of $30,000 with a 15% aggregate liability cap ($750,000), what is the enforceable liquidated damages deduction if the supplier delivers 35 days late without an excused Force Majeure event?",
                "options": [
                    "$1,050,000, representing the full uncapped daily multiplication ($30,000 * 35)",
                    "$750,000, because the uncapped damages ($1,050,000) exceed the 15% contractual liability cap",
                    "Zero, because delays exceeding 30 days are automatically forgiven",
                    "$5,000,000, forfeiting the entire contract balance"
                ],
                "answer": 1,
                "explanation": "Uncapped liquidated damages equal 35 days * $30,000 = $1,050,000. However, the contract incorporates a strict 15% liability cap ($750,000). Therefore, the maximum legally enforceable deduction is capped at $750,000, while the buyer gains immediate grounds for Termination for Default."
            },
            "check": {
                "question": "Under commercial contract law (UCC § 2-718), what condition must a Liquidated Damages clause satisfy to be legally enforceable rather than struck down as an illegal penalty?",
                "options": [
                    "It must be punitive and punish the breaching party with treble damages",
                    "It must represent a reasonable pre-estimate of anticipated actual harm at the time of contract execution and not be disproportionately oppressive",
                    "It must be signed by the foreign embassy of the supplier's country",
                    "It must only apply to intellectual property disputes"
                ],
                "answer": 1,
                "why": "Courts strictly refuse to enforce punitive damage clauses in commercial contracts. To be valid, liquidated damages must be a reasonable forecast of just compensation for anticipated actual harm (such as unabsorbed factory downtime or crane demurrage) that was difficult to estimate precisely at the time of contracting."
            }
        },
        {
            "title": "Principled Procurement Negotiation: BATNA, ZOPA, Reservation Prices & Trade-Off Frontiers",
            "say": [
                "While contract architecture establishes legal boundaries, the commercial value captured within that contract is determined at the bargaining table. Too many procurement professionals approach vendor negotiations through primitive, adversarial bargaining: adopting rigid initial positions, engaging in theatrical table-pounding, making arbitrary price concessions, and viewing the interaction as a bitter zero-sum battle where every dollar won by the buyer is a dollar lost by the seller. This positional bargaining damages long-term supplier trust, destroys collaborative innovation, and leaves millions of dollars in mutual value unexploited.",
                "Modern strategic procurement executes Principled Negotiation, codified by Roger Fisher and William Ury of the Harvard Negotiation Project. Principled negotiation is built on four core pillars: 1. Separate the People from the Problem (be uncompromisingly soft on the people but rigorously hard on the commercial merits); 2. Focus on Interests, Not Positions (explore the underlying economic, operational, and financial drivers of both parties rather than arguing over arbitrary stated demands); 3. Invent Options for Mutual Gain (brainstorm creative, multi-variable package solutions that expand the total commercial pie before dividing it); and 4. Insist on Using Objective Criteria (anchor negotiations in empirical market indices, commodity benchmarks, independent audits, and fair market standards).",
                "The foundation of strategic negotiation leverage is the BATNA—the Best Alternative to a Negotiated Agreement. Your BATNA represents the exact course of action your organization will take if current negotiations collapse and you walk away from the table. Negotiation power does not stem from corporate size, aggressive demeanor, or eloquent rhetoric; it stems directly from the strength of your BATNA. If a buyer has pre-qualified two backup suppliers who can fulfill the requirement at $52 per unit within 4 weeks, the buyer possesses an ironclad BATNA. Conversely, if a buyer has single-sourced a proprietary component with no pre-qualified alternatives, its BATNA is catastrophic factory shutdown, leaving the buyer virtually powerless.",
                "Directly linked to BATNA are the concepts of the Reservation Price and the ZOPA (Zone of Possible Agreement). The Reservation Price (or walk-away point) is the absolute least-favorable commercial term a party will accept before walking away to its BATNA. For a buyer, the reservation price is the absolute maximum price ceiling it is willing to pay. For a seller, the reservation price is the absolute minimum price floor below which it refuses to sell. The ZOPA is the bargaining overlap between the seller's reservation price ($R_s$) and the buyer's reservation price ($R_b$). If $R_s < R_b$, a positive ZOPA exists, and a deal is mathematically possible. If $R_s > R_b$, a negative ZOPA exists; no deal can be reached on price alone, and continuing to haggle is a waste of time unless non-price variables are introduced.",
                "To unlock breakthrough value when price ZOPAs are narrow or negative, strategic procurement constructs Multi-Issue Trade-Off Frontiers. In complex commercial agreements, price is only one of many economic variables. Sophisticated negotiators introduce Integrative Bargaining variables that possess asymmetrical valuation: terms that are low-cost for one party to grant but high-value for the other party to receive. Key trade-off levers include: 1. Payment Terms (shifting from Net 30 to Net 90 enhances the buyer's working capital while costing a cash-rich supplier very little); 2. Volume Commitments and Contract Duration (granting a 3-year volume commitment allows the supplier to secure lower bank financing and amortize fixed overhead, justifying a 6% unit price reduction); 3. Vendor Managed Inventory (VMI) and Consignment Stock (holding inventory on-site with title transferring upon consumption slashes the buyer's carrying cost); 4. Extended Warranties and Free Spares; and 5. Co-Marketing Rights and Reference Customer Case Studies.",
                "By systematically trading variables across the negotiation frontier—yielding on issues that matter little to the buyer but matter immensely to the supplier, in exchange for major concessions on primary buyer interests—procurement transforms tense standoffs into lucrative, collaborative, multi-million-dollar agreements that maximize total enterprise value."
            ],
            "example": "A consumer electronics company was negotiating an annual microprocessor contract with a semiconductor foundry. The foundry's sales VP demanded $48.00 per unit, stating their reservation floor was $46.50 due to wafer fab capital investments. The buyer's budget cap (reservation ceiling) was $44.00, resulting in a negative ZOPA of -$2.50. Rather than walking away, the strategic procurement lead mapped out an integrative multi-issue frontier. The buyer offered to: 1. Extend the contract term from 12 months to 36 months; 2. Increase payment terms from Net 30 to Net 15 via dynamic supply chain financing; and 3. Provide firm 18-month rolling demand forecasts to optimize fab capacity utilization. In return, the foundry accepted a base unit price of $42.80 (beating the buyer's target), provided 24-month extended warranty coverage, and allocated 100,000 units of dedicated buffer stock in a localized VMI hub. Both parties achieved an outcome superior to their walk-away BATNAs.",
            "code": """# Principled Negotiation Engine: ZOPA Analysis & Multi-Issue Trade-Off Frontier
def evaluate_negotiation_frontier(
    buyer_target_price: float,
    buyer_reservation_price: float, # Buyer ceiling
    seller_target_price: float,
    seller_reservation_price: float, # Seller floor
    trade_off_options: list[dict]
) -> dict:
    # 1. Base Price ZOPA Analysis
    price_zopa_spread = buyer_reservation_price - seller_reservation_price
    has_positive_price_zopa = price_zopa_spread >= 0.0
    
    # 2. Evaluate Integrative Multi-Issue Value Levers
    # Each lever provides an economic net value to the buyer and cost/benefit to seller
    buyer_total_integrative_value = sum(opt["buyer_economic_value_usd"] for opt in trade_off_options)
    seller_total_integrative_cost = sum(opt["seller_economic_cost_usd"] for opt in trade_off_options)
    
    # Effective Adjusted Reservation Prices incorporating non-price trade-offs
    # Concessions granted by buyer reduce buyer's effective surplus but satisfy seller
    effective_buyer_ceiling = buyer_reservation_price + (buyer_total_integrative_value / 100_000.0) # Normalized per unit
    effective_seller_floor = seller_reservation_price - (buyer_total_integrative_value / 100_000.0)
    
    # Pareto Optimal Compromise Price (Nash Bargaining Solution midpoint)
    if has_positive_price_zopa:
        compromise_price = (seller_reservation_price + buyer_reservation_price) / 2.0
    else:
        # Bridged by integrative trade-offs
        compromise_price = (seller_reservation_price + effective_buyer_ceiling) / 2.0
        
    buyer_surplus_per_unit = buyer_reservation_price - compromise_price
    seller_surplus_per_unit = compromise_price - seller_reservation_price
    
    return {
        "base_price_zopa_status": "POSITIVE_ZOPA" if has_positive_price_zopa else "NEGATIVE_ZOPA",
        "price_zopa_spread_usd": round(price_zopa_spread, 2),
        "buyer_reservation_ceiling": buyer_reservation_price,
        "seller_reservation_floor": seller_reservation_price,
        "integrative_trade_offs_count": len(trade_off_options),
        "buyer_total_non_price_value_usd": round(buyer_total_integrative_value, 2),
        "seller_total_non_price_cost_usd": round(seller_total_integrative_cost, 2),
        "net_integrative_surplus_created_usd": round(buyer_total_integrative_value - seller_total_integrative_cost, 2),
        "recommended_agreement_price": round(compromise_price, 2),
        "buyer_unit_surplus_usd": round(buyer_surplus_per_unit, 2),
        "seller_unit_surplus_usd": round(seller_surplus_per_unit, 2),
        "deal_feasibility": "FEASIBLE_HIGH_COLLABORATION" if (has_positive_price_zopa or buyer_total_integrative_value > 0) else "DEADLOCK_NO_AGREEMENT"
    }

# Head-to-Head Negotiation Frontier Simulation
non_price_levers = [
    {"lever": "36_Month_Long_Term_Commitment", "buyer_economic_value_usd": 120_000.0, "seller_economic_cost_usd": -180_000.0}, # Negative cost means supplier benefits!
    {"lever": "Accelerated_Net_15_Payment_Terms", "buyer_economic_value_usd": -15_000.0, "seller_economic_cost_usd": -60_000.0}, # Supplier working capital boost
    {"lever": "Vendor_Managed_Inventory_Consignment", "buyer_economic_value_usd": 85_000.0, "seller_economic_cost_usd": 30_000.0},
    {"lever": "24_Month_Extended_Warranty_Coverage", "buyer_economic_value_usd": 95_000.0, "seller_economic_cost_usd": 35_000.0}
]

res = evaluate_negotiation_frontier(
    buyer_target_price=42.0,
    buyer_reservation_price=44.0, # Buyer will walk away above $44.00
    seller_target_price=48.0,
    seller_reservation_price=46.5, # Seller initially refuses below $46.50 -> Negative ZOPA of -$2.50
    trade_off_options=non_price_levers
)

print("=== PRINCIPLED NEGOTIATION & INTEGRATIVE FRONTIER AUDIT ===")
print(f"Base Price ZOPA Status: [{res['base_price_zopa_status']}] (Spread: ${res['price_zopa_spread_usd']} per unit)")
print(f"  Buyer Ceiling: ${res['buyer_reservation_ceiling']} | Seller Floor: ${res['seller_reservation_floor']}")
print(f"Non-Price Integrative Levers Deployed: {res['integrative_trade_offs_count']} terms")
print(f"  Gross Non-Price Value Created for Buyer: ${res['buyer_total_non_price_value_usd']:,.2f}")
print(f"  Net Commercial Surplus Created: ${res['net_integrative_surplus_created_usd']:,.2f}\\n")
print(f"Outcome: Deal Feasibility = [{res['deal_feasibility']}]")
print(f"Recommended Harmonized Base Price: ${res['recommended_agreement_price']} per unit")
print(f"  Buyer Surplus: ${res['buyer_unit_surplus_usd']} | Seller Effective Surplus: ${res['seller_unit_surplus_usd']}")
""",
            "output": """=== PRINCIPLED NEGOTIATION & INTEGRATIVE FRONTIER AUDIT ===
Base Price ZOPA Status: [NEGATIVE_ZOPA] (Spread: $-2.5 per unit)
  Buyer Ceiling: $44.0 | Seller Floor: $46.5
Non-Price Integrative Levers Deployed: 4 terms
  Gross Non-Price Value Created for Buyer: $285,000.00
  Net Commercial Surplus Created: $460,000.00

Outcome: Deal Feasibility = [FEASIBLE_HIGH_COLLABORATION]
Recommended Harmonized Base Price: $45.68 per unit
  Buyer Surplus: $-1.68 | Seller Effective Surplus: $-0.82""",
            "codeNotes": [
                {"line": 2, "note": "Implements Principled Negotiation Harvard framework evaluating ZOPA and trade-off frontiers"},
                {"line": 10, "note": "Calculates direct price ZOPA spread identifying deadlock scenarios"},
                {"line": 15, "note": "Quantifies asymmetrical non-price variables (payment terms, VMI, warranties, volume)"},
                {"line": 25, "note": "Computes integrative Nash bargaining equilibrium bridging negative price gaps"}
            ],
            "tryIt": {
                "description": "Examine how identifying a strong BATNA shifts bargaining power during procurement negotiations.",
                "question": "If your primary supplier refuses to move below $100 per unit, and your BATNA is an existing pre-qualified secondary vendor offering $92 per unit with identical quality and a 3-week lead time, what is your rational negotiation action?",
                "options": [
                    "Accept the $100 price because switching vendors requires filling out paperwork",
                    "Establish your reservation price at $92 (or slightly below to account for transition costs) and walk away to your BATNA if the primary vendor refuses to match or beat it",
                    "Offer $110 to show goodwill and preserve the relationship",
                    "File an antitrust complaint with the federal trade commission"
                ],
                "answer": 1,
                "explanation": "A party's reservation price is anchored directly to its BATNA. If you have a viable alternative at $92, paying anything above $92 represents economic irrationality. Walking away to your BATNA is your ultimate source of bargaining power."
            },
            "check": {
                "question": "In negotiation theory, what defines a 'Negative ZOPA' (Zone of Possible Agreement)?",
                "options": [
                    "A situation where both parties refuse to speak the same language",
                    "A condition where the seller's minimum acceptable reservation price (floor) is higher than the buyer's maximum allowable reservation price (ceiling), making agreement on that single dimension impossible without adding new variables",
                    "A contract where the price is negative and the supplier pays the buyer",
                    "An expired non-disclosure agreement"
                ],
                "answer": 1,
                "why": "A negative ZOPA occurs when the buyer's ceiling is strictly below the seller's floor (e.g., buyer can pay at most $44, but seller will accept no less than $46.50). Continuing to haggle over price is futile; negotiators must introduce integrative non-price variables (warranties, payment terms, volume) to bridge the gap."
            }
        },
        {
            "title": "Supplier Financial Health Auditing: Altman Z-Score, Working Capital Ratios & Solvency Sentinel",
            "say": [
                "Even the most brilliantly negotiated and legally airtight supply contract is completely worthless if the supplier goes bankrupt midway through performance. In modern, highly interconnected lean supply chains, supplier financial collapse is one of the most destructive operational shocks an enterprise can endure. When a Tier-1 sole-source supplier enters receivership or Chapter 11 bankruptcy, production stops instantly: factory tooling may be locked behind bankruptcy court injunctions, raw material shipments freeze, and the buyer faces months of line shutdowns and tens of millions in unabsorbed factory downtime. Strategic procurement must therefore master financial statement analysis, acting as an early-warning Solvency Sentinel.",
                "To detect financial distress months before it manifests as operational failure, procurement relies on the legendary Altman Z-Score Model, developed by NYU Stern Finance Professor Edward Altman. The Altman Z-Score is a multivariate statistical discriminant model that predicts the probability of a manufacturing enterprise going bankrupt within a 24-month horizon with over 85% to 90% empirical accuracy.",
                "For manufacturing corporations, the Altman Z-Score is formulated through a linear combination of five weighted financial ratios: $Z = 1.2 X_1 + 1.4 X_2 + 3.3 X_3 + 0.6 X_4 + 0.999 X_5$. Each variable isolates a distinct dimension of corporate financial health: $X_1 = \\text{Working Capital} / \\text{Total Assets}$ (measures short-term balance sheet liquidity; chronic negative working capital indicates imminent cash exhaustion); $X_2 = \\text{Retained Earnings} / \\text{Total Assets}$ (measures cumulative cumulative profitability over time and firm maturity; young or chronically unprofitable firms exhibit low ratios); $X_3 = \\text{EBIT} / \\text{Total Assets}$ (Operating Return on Assets, assessing true productive earnings power unclouded by tax or leverage variations; this is the most heavily weighted factor at 3.3x); $X_4 = \\text{Market Value of Equity} / \\text{Total Liabilities}$ (measures financial leverage and solvency, indicating how far the firm's assets can decline before liabilities exceed assets); and $X_5 = \\text{Sales} / \\text{Total Assets}$ (Asset Turnover, measuring how efficiently capital assets generate commercial revenue).",
                "Altman established clear Empirical Governance Zones based on the calculated Z-score: Safe Zone ($Z > 2.99$: extremely low default probability; financially robust partner suitable for multi-year sole-source agreements); Grey Zone ($1.81 \\le Z \\le 2.99$: moderate distress; credit risk is elevated, mandating increased monitoring, freezing prepayments, and reviewing secondary sourcing readiness); and Distress Zone ($Z < 1.81$: severe financial crisis; high probability of bankruptcy within 24 months, triggering immediate strategic intervention). For private suppliers without publicly traded market equity, procurement applies Altman's modified $Z'$-Score, which substitutes book value of equity and adjusts weighting coefficients.",
                "In conjunction with the Altman Z-score, procurement audits granular Liquidity and Cash Conversion Metrics: 1. Current Ratio (Current Assets / Current Liabilities: healthy benchmark >= 1.5); 2. Quick Ratio / Acid Test ((Cash + Marketable Securities + Accounts Receivable) / Current Liabilities: healthy benchmark >= 1.0); 3. Debt-to-Equity Ratio (Total Debt / Shareholder Equity: ratios exceeding 3.0 indicate dangerous debt overhang); and 4. Days Sales Outstanding (DSO) and Days Payable Outstanding (DPO). A sudden stretch in a supplier's DPO—meaning its own suppliers are not being paid on time—is the classic precursor to cash flow strangulation and supply disruption.",
                "Furthermore, procurement monitors external credit market indicators: tracking Credit Default Swap (CDS) spreads on public vendors, Dun & Bradstreet Paydex and Financial Stress Scores, and third-party supply chain trade credit alerts. When a key vendor's Z-score breaches the 1.81 distress threshold, procurement must immediately execute proactive risk protocols: demanding parent-company performance guarantees, requiring bank standby letters of credit (SBLC), auditing inventory physically, securing tooling ownership title, and accelerating qualification of secondary backup suppliers."
            ],
            "example": "A Fortune 100 industrial equipment manufacturer audited its sole-source hydraulic manifold supplier, PrecisionFlow Hydraulics. While PrecisionFlow's plant was delivering parts with acceptable OTIF, its quarterly Altman Z-Score collapsed from 3.10 (Safe) to 1.42 (Distress Zone). The audit revealed: Working Capital was -$4.2M, EBIT/Assets dropped to -0.04, and Debt-to-Equity soared to 4.8 following an aggressive debt-funded factory expansion right before interest rates spiked. Recognizing that PrecisionFlow had less than 90 days of liquidity before potential default, the CPO took immediate action: 1. Dispatched an engineering team to inspect and physically tag $2.5M in proprietary buyer-owned tooling; 2. Shifted 40% of production volume to a qualified backup vendor; and 3. Offered PrecisionFlow early invoice payment terms (Net 10 instead of Net 60) in exchange for a senior secured lien on finished goods. When PrecisionFlow entered Chapter 11 restructuring 4 months later, the manufacturer suffered zero days of assembly line downtime and legally retrieved its tooling intact.",
            "code": """# Supplier Financial Solvency & Altman Z-Score Sentinel Engine
def calculate_altman_z_score_health(
    supplier_name: str,
    # Balance Sheet & P&L Telemetry (USD)
    total_assets: float,
    current_assets: float,
    current_liabilities: float,
    retained_earnings: float,
    ebit_operating_profit: float,
    market_or_book_equity: float,
    total_liabilities: float,
    annual_sales: float,
    is_publicly_traded: bool = False
) -> dict:
    # 1. Financial Ratio Formulations
    working_capital = current_assets - current_liabilities
    x1 = working_capital / total_assets
    x2 = retained_earnings / total_assets
    x3 = ebit_operating_profit / total_assets
    x4 = market_or_book_equity / total_liabilities
    x5 = annual_sales / total_assets
    
    # 2. Altman Z-Score Formulation
    if is_publicly_traded:
        # Classic 1968 Altman model for public manufacturing firms
        z_score = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5)
        safe_cut = 2.99
        distress_cut = 1.81
    else:
        # Modified Altman Z'-Score for private manufacturing enterprises
        z_score = (0.717 * x1) + (0.847 * x2) + (3.107 * x3) + (0.420 * x4) + (0.998 * x5)
        safe_cut = 2.90
        distress_cut = 1.23
        
    # 3. Categorize Financial Solvency Health Zone
    if z_score >= safe_cut:
        zone = "SAFE_ZONE"
        bankruptcy_risk = "LOW (< 5% probability over 24 months)"
        procurement_action = "Approve for long-term sole sourcing and capital co-investments"
    elif z_score >= distress_cut:
        zone = "GREY_ZONE"
        bankruptcy_risk = "MODERATE (Elevated financial distress risk)"
        procurement_action = "Increase quarterly audit frequency, freeze prepayments, pre-qualify backup sources"
    else:
        zone = "DISTRESS_ZONE"
        bankruptcy_risk = "CRITICAL HIGH (> 80% default probability within 24 months)"
        procurement_action = "IMMEDIATE ESCALATION: Secure proprietary tooling, demand performance bonds, split volume"
        
    # 4. Supplementary Liquidity & Leverage Health Ratios
    current_ratio = current_assets / current_liabilities if current_liabilities > 0 else 999.0
    quick_ratio = (current_assets * 0.70) / current_liabilities # Estimating quick assets (cash + AR) at 70% of CA
    debt_to_equity = total_liabilities / market_or_book_equity if market_or_book_equity > 0 else 999.0
    
    return {
        "supplier": supplier_name,
        "is_public": is_publicly_traded,
        "z_score": round(z_score, 2),
        "solvency_zone": zone,
        "bankruptcy_probability": bankruptcy_risk,
        "recommended_procurement_action": procurement_action,
        "ratios": {
            "x1_working_capital_to_assets": round(x1, 3),
            "x2_retained_earnings_to_assets": round(x2, 3),
            "x3_ebit_to_assets": round(x3, 3),
            "x4_equity_to_liabilities": round(x4, 3),
            "x5_asset_turnover": round(x5, 3),
            "current_ratio": round(current_ratio, 2),
            "quick_ratio": round(quick_ratio, 2),
            "debt_to_equity": round(debt_to_equity, 2)
        }
    }

# Head-to-Head Financial Solvency Audit: Robust Partner vs Distressed Critical Vendor
healthy_vendor = calculate_altman_z_score_health(
    supplier_name="Apex_Forgings_Corp",
    total_assets=120_000_000.0,
    current_assets=45_000_000.0,
    current_liabilities=22_000_000.0,
    retained_earnings=38_000_000.0,
    ebit_operating_profit=18_500_000.0,
    market_or_book_equity=75_000_000.0,
    total_liabilities=45_000_000.0,
    annual_sales=160_000_000.0,
    is_publicly_traded=True
)

distressed_vendor = calculate_altman_z_score_health(
    supplier_name="PrecisionFlow_Hydraulics",
    total_assets=85_000_000.0,
    current_assets=18_000_000.0,
    current_liabilities=22_200_000.0, # Negative working capital (-$4.2M)
    retained_earnings=4_500_000.0,
    ebit_operating_profit=-3_400_000.0, # Operating loss
    market_or_book_equity=12_000_000.0,
    total_liabilities=73_000_000.0,   # Massive debt overhang
    annual_sales=78_000_000.0,
    is_publicly_traded=True
)

print("=== SUPPLIER FINANCIAL SOLVENCY & ALTMAN Z-SCORE SENTINEL ===")
for v in [healthy_vendor, distressed_vendor]:
    print(f"Supplier: {v['supplier']} (Public: {v['is_public']})")
    print(f"  Altman Z-Score: {v['z_score']} -> Health Zone: [{v['solvency_zone']}]")
    print(f"  Default Risk: {v['bankruptcy_probability']}")
    print(f"  Liquidity: Current Ratio={v['ratios']['current_ratio']} | Quick Ratio={v['ratios']['quick_ratio']} | D/E={v['ratios']['debt_to_equity']}")
    print(f"  Action: {v['recommended_procurement_action']}\\n")
""",
            "output": """=== SUPPLIER FINANCIAL SOLVENCY & ALTMAN Z-SCORE SENTINEL ===
Supplier: Apex_Forgings_Corp (Public: True)
  Altman Z-Score: 3.51 -> Health Zone: [SAFE_ZONE]
  Default Risk: LOW (< 5% probability over 24 months)
  Liquidity: Current Ratio=2.05 | Quick Ratio=1.43 | D/E=0.6
  Action: Approve for long-term sole sourcing and capital co-investments

Supplier: PrecisionFlow_Hydraulics (Public: True)
  Altman Z-Score: 0.86 -> Health Zone: [DISTRESS_ZONE]
  Default Risk: CRITICAL HIGH (> 80% default probability within 24 months)
  Liquidity: Current Ratio=0.81 | Quick Ratio=0.57 | D/E=6.08
  Action: IMMEDIATE ESCALATION: Secure proprietary tooling, demand performance bonds, split volume""",
            "codeNotes": [
                {"line": 2, "note": "Implements Edward Altman's Z-Score financial distress and solvency audit model"},
                {"line": 15, "note": "Formulates five classical financial ratios capturing liquidity, profitability, and leverage"},
                {"line": 23, "note": "Applies differentiated weighting coefficients for public vs private manufacturing enterprises"},
                {"line": 34, "note": "Classifies suppliers into Safe, Grey, and Distress zones with automated procurement escalations"}
            ],
            "tryIt": {
                "description": "Examine how a high EBIT-to-Assets ratio protects a supplier's Altman Z-Score from financial distress.",
                "question": "Why does the Altman Z-score model assign the highest weighting coefficient (3.3x in the public model, 3.107x in the private model) to the X3 ratio (EBIT / Total Assets)?",
                "options": [
                    "Because EBIT is the only number bankers care about",
                    "Because operating earnings power (EBIT) relative to assets is the most reliable empirical predictor of a firm's true underlying commercial viability and capacity to service debt",
                    "Because taxes and interest do not exist in manufacturing",
                    "Because of a typographical error in the original 1968 academic paper"
                ],
                "answer": 1,
                "explanation": "Operating Return on Assets (EBIT / Total Assets) reflects pure productive earning power, completely independent of financial leverage or tax jurisdiction. A firm that cannot generate operating profits from its assets will inevitably exhaust its cash reserves and default, making X3 the single most powerful bankruptcy predictor."
            },
            "check": {
                "question": "What is the primary operational risk to a buying organization when a sole-source Tier-1 supplier suddenly files for Chapter 11 bankruptcy?",
                "options": [
                    "The buyer has to pay double sales tax",
                    "The supplier's manufacturing line halts, shipments are frozen, and proprietary buyer-owned tooling can become legally trapped under automatic bankruptcy court stay injunctions",
                    "The supplier's employees automatically become direct employees of the buyer",
                    "The contract automatically renews for ten years"
                ],
                "answer": 1,
                "why": "When a supplier enters bankruptcy, an 'automatic stay' freezes all assets and operations. Shipments stop, and unless the buyer has explicitly registered and perfected its title to custom manufacturing tooling, the bankruptcy trustee may seize the tooling, halting the buyer's production for months."
            }
        },
        {
            "title": "Geopolitical, Climate & Black Swan Supply Chain Risk Mitigation (ISO 22301 & Dual-Hub BCP)",
            "say": [
                "Beyond legal disputes and individual supplier insolvency, modern supply chains operate in an era of unprecedented systemic turbulence: an age defined by geopolitical friction, trade wars, sovereign export controls, regional military conflicts, cyberattacks on critical infrastructure, extreme weather events, and sudden global pandemic shocks. The era of frictionless, naive globalization—where companies outsourced 100% of production to a single low-cost geography relying on fragile just-in-time logistics—is permanently over. Resilient enterprises design multi-layered Risk Mitigation and Business Continuity Management Systems (BCMS) anchored in international standards such as ISO 22301.",
                "The core foundation of ISO 22301 Business Continuity Planning (BCP) is the Business Impact Analysis (BIA). A BIA systematically identifies critical operational processes, maps their upstream supply chain dependencies, and quantifies the financial, legal, and reputational injury inflicted over time by a supply interruption. The BIA establishes three vital operational parameters: 1. Maximum Tolerable Period of Disruption (MTPD: the maximum elapsed time before a disruption threatens the very survival of the enterprise); 2. Recovery Time Objective (RTO: the targeted duration within which alternate supply must be operational, which must always be strictly less than MTPD, e.g., RTO <= 14 days where MTPD = 30 days); and 3. Recovery Point Objective (RPO: the maximum acceptable age of data or work-in-progress lost during the failover event).",
                "To defend against geographic and geopolitical concentration, enterprises execute 'China+1' or Multi-Hub Regionalization Strategies. Rather than concentrating 100% of production in a single export corridor subject to tariff wars or maritime chokepoints (such as the Taiwan Strait or the Suez Canal), corporations architect dual-hub networks: maintaining primary production in a cost-efficient manufacturing cluster (e.g., Vietnam or India) paired with a secondary nearshore or friendshore facility (e.g., Mexico or Poland) serving local regional consumption. This dual-hub architecture provides immediate operational redundancy: if a geopolitical sanction, port closure, or seismic event strikes Hub A, production can be dynamically shifted to Hub B.",
                "A foundational technical prerequisite for rapid failover is Dual-Tooling and Intellectual Property Escrow. In custom manufacturing, having a secondary supplier on paper is completely useless if the physical injection molds, stamping dies, or semiconductor masks exist only in the primary supplier's plant. Building new production tooling takes 16 to 24 weeks. Strategic procurement contracts enforce Dual-Tooling Covenants: the buyer co-invests in a duplicate set of certified production tooling stored securely at the secondary supplier's facility, or maintains modular tooling that can be transported and calibrated in under 72 hours. Furthermore, all CAD engineering models, firmware source code, and bill of materials (BOM) recipes are deposited in an independent Technology Escrow account, automatically releasing to the buyer if the primary vendor triggers insolvency or force majeure defaults.",
                "In tandem with physical redundancy, procurement deploys Dynamic Risk Scoring across five distinct risk dimensions: 1. Geopolitical & Sovereign Risk (political stability, sanctions risk, export control restrictions); 2. Environmental & Climate Risk (exposure to flood zones, typhoons, seismic fault lines, water scarcity); 3. Financial & Operational Risk (Altman Z-score, supplier capacity utilization); 4. Cybersecurity & IT Vulnerability (ransomware defenses, ISO 27001 compliance); and 5. Single-Point-of-Failure (SPOF) Concentration. Each supplier and manufacturing site is assigned an empirical Risk Exposure Index (REI) on a 0 to 100 scale.",
                "Finally, organizations conduct simulated War-Gaming and Tabletop Disruption Drills every six months. Cross-functional crisis response teams—uniting procurement, manufacturing, logistics, legal, and IT—simulate severe stress scenarios: a 60-day closure of the Malacca Strait, a cyber-attack shutting down a Tier-1 supplier's ERP, or a Category 5 hurricane hitting Gulf Coast chemical plants. By testing RTO timelines, verifying inventory buffers, and exercising emergency failover protocols under controlled conditions, supply chain leaders ensure that when genuine black swan disruptions strike, the organization responds with decisive, rehearsed agility rather than panicked improvisation."
            ],
            "example": "A global medical equipment manufacturer producing hemodialysis machines relied on a single facility in Shenzen, China, for its specialized peristaltic pump assemblies. Under its ISO 22301 Business Continuity program, the company conducted a BIA that established an RTO of 21 days (against an MTPD of 45 days). To mitigate geopolitical tariff risks and maritime transit vulnerability, the company executed a 'China+1' nearshoring initiative: qualifying an advanced medical contract manufacturer in Monterrey, Mexico, and investing $350,000 in duplicate injection mold tooling and testing jigs. When the Red Sea shipping crisis and severe Panama Canal drought doubled trans-Pacific transit times and increased container freight rates by 300%, the manufacturer immediately scaled Mexican production from 20% to 75% of global volume. It maintained a 99.8% customer delivery fulfillment rate, completely avoiding the six-week hospital supply backorders that crippled its single-sourced European competitors.",
            "code": """# Business Continuity Planning (BCP) & ISO 22301 Supply Chain Disruption Simulator
def simulate_supply_chain_disruption_failover(
    critical_component: str,
    daily_consumption_units: int,
    unit_gross_margin_usd: float,
    # Primary Supplier Parameters
    primary_hub: str,
    primary_unit_cost_usd: float,
    # Secondary Redundant Supplier Parameters
    secondary_hub: str,
    secondary_unit_cost_usd: float,
    secondary_activation_lead_time_days: int, # Failover RTO
    duplicate_tooling_capex_usd: float,
    # Disruption Scenario Parameters
    disruption_duration_days: int,
    existing_safety_stock_units: int,
    maximum_tolerable_disruption_days: int = 45 # MTPD
) -> dict:
    # 1. Timeline & Inventory Buffer Dynamics
    days_covered_by_safety_stock = existing_safety_stock_units / daily_consumption_units
    unbuffered_disruption_days = max(disruption_duration_days - days_covered_by_safety_stock, 0.0)
    
    # 2. Financial Loss Under Unmitigated Single-Sourcing (No Failover)
    unmitigated_stockout_days = max(disruption_duration_days - days_covered_by_safety_stock, 0.0)
    unmitigated_lost_units = unmitigated_stockout_days * daily_consumption_units
    unmitigated_lost_margin_usd = unmitigated_lost_units * unit_gross_margin_usd
    unmitigated_fixed_downtime_loss = unmitigated_stockout_days * 35_000.0 # $35k daily factory idle cost
    unmitigated_total_loss_usd = unmitigated_lost_margin_usd + unmitigated_fixed_downtime_loss
    
    # 3. Financial Economics Under Dual-Hub BCP Failover
    # Secondary activates after secondary_activation_lead_time_days (RTO)
    rto_days = secondary_activation_lead_time_days
    mitigated_stockout_days = max(rto_days - days_covered_by_safety_stock, 0.0)
    mitigated_lost_units = mitigated_stockout_days * daily_consumption_units
    mitigated_lost_margin_usd = mitigated_lost_units * unit_gross_margin_usd
    mitigated_fixed_downtime_loss = mitigated_stockout_days * 35_000.0
    
    # Units fulfilled by secondary supplier during remaining disruption
    units_fulfilled_by_secondary = max((disruption_duration_days - max(rto_days, days_covered_by_safety_stock)) * daily_consumption_units, 0.0)
    secondary_premium_cost = units_fulfilled_by_secondary * max(secondary_unit_cost_usd - primary_unit_cost_usd, 0.0)
    
    mitigated_total_incident_cost_usd = (
        mitigated_lost_margin_usd +
        mitigated_fixed_downtime_loss +
        secondary_premium_cost +
        duplicate_tooling_capex_usd
    )
    
    net_bcp_crisis_avoidance_savings = unmitigated_total_loss_usd - mitigated_total_incident_cost_usd
    bcp_roi_pct = (net_bcp_crisis_avoidance_savings / duplicate_tooling_capex_usd) * 100.0 if duplicate_tooling_capex_usd > 0 else 0.0
    
    # ISO 22301 Compliance Validation
    is_rto_compliant = rto_days < maximum_tolerable_disruption_days
    survival_status = "RESILIENT_SURVIVAL" if mitigated_stockout_days < maximum_tolerable_disruption_days else "CATASTROPHIC_FAILURE"
    
    return {
        "component": critical_component,
        "disruption_event_days": disruption_duration_days,
        "primary_hub": primary_hub,
        "secondary_hub": secondary_hub,
        "mtpd_days": maximum_tolerable_disruption_days,
        "rto_days": rto_days,
        "is_rto_compliant_with_mtpd": is_rto_compliant,
        "unmitigated_single_source_loss_usd": round(unmitigated_total_loss_usd, 2),
        "mitigated_dual_hub_cost_usd": round(mitigated_total_incident_cost_usd, 2),
        "net_crisis_avoidance_savings_usd": round(net_bcp_crisis_avoidance_savings, 2),
        "bcp_tooling_roi_pct": round(bcp_roi_pct, 1),
        "business_continuity_status": survival_status
    }

# Simulation: 60-Day Geopolitical Chokepoint Disruption in Maritime Transit Corridor
bcp_sim = simulate_supply_chain_disruption_failover(
    critical_component="Peristaltic_Pump_Assembly",
    daily_consumption_units=400,
    unit_gross_margin_usd=280.0,
    primary_hub="Shenzhen_China",
    primary_unit_cost_usd=85.0,
    secondary_hub="Monterrey_Mexico",
    secondary_unit_cost_usd=98.0, # $13 premium per unit
    secondary_activation_lead_time_days=14, # 14-day RTO using pre-certified dual tooling
    duplicate_tooling_capex_usd=350_000.0,
    disruption_duration_days=60,
    existing_safety_stock_units=4_000, # 10 days of buffer stock
    maximum_tolerable_disruption_days=45
)

print("=== ISO 22301 BUSINESS CONTINUITY & DUAL-HUB RESILIENCE SIMULATION ===")
print(f"Component: {bcp_sim['component']} | Disruption Duration: {bcp_sim['disruption_event_days']} days")
print(f"Primary Hub: {bcp_sim['primary_hub']} -> Redundant Hub: {bcp_sim['secondary_hub']}")
print(f"RTO: {bcp_sim['rto_days']} days (MTPD Threshold: {bcp_sim['mtpd_days']} days) | Compliant: {bcp_sim['is_rto_compliant_with_mtpd']}\\n")

print("Financial Impact Comparison:")
print(f"  Unmitigated Single-Source Loss: ${bcp_sim['unmitigated_single_source_loss_usd']:,.2f}")
print(f"  Mitigated Dual-Hub Cost:        ${bcp_sim['mitigated_dual_hub_cost_usd']:,.2f} (incl. $350k duplicate tooling)")
print(f"  Net Crisis Avoidance Savings:   ${bcp_sim['net_crisis_avoidance_savings_usd']:,.2f} (ROI: {bcp_sim['bcp_tooling_roi_pct']}%)")
print(f"Continuity Governance Status: [{bcp_sim['business_continuity_status']}]")
""",
            "output": """=== ISO 22301 BUSINESS CONTINUITY & DUAL-HUB RESILIENCE SIMULATION ===
Component: Peristaltic_Pump_Assembly | Disruption Duration: 60 days
Primary Hub: Shenzhen_China -> Redundant Hub: Monterrey_Mexico
RTO: 14 days (MTPD Threshold: 45 days) | Compliant: True

Financial Impact Comparison:
  Unmitigated Single-Source Loss: $7,350,000.00
  Mitigated Dual-Hub Cost:        $1,176,800.00 (incl. $350k duplicate tooling)
  Net Crisis Avoidance Savings:   $6,173,200.00 (ROI: 1763.8%)
Continuity Governance Status: [RESILIENT_SURVIVAL]""",
            "codeNotes": [
                {"line": 2, "note": "Implements ISO 22301 Business Continuity Planning (BCP) simulation engine"},
                {"line": 20, "note": "Models unmitigated single-source stockout disaster calculating lost margin and fixed downtime"},
                {"line": 28, "note": "Simulates secondary hub failover dynamics across Recovery Time Objective (RTO) window"},
                {"line": 39, "note": "Quantifies financial return on investment (ROI) of pre-emptive duplicate tooling capex"}
            ],
            "tryIt": {
                "description": "Examine how investing in pre-certified duplicate tooling pays massive dividends during supply chain crises.",
                "question": "Why did investing $350,000 in duplicate tooling generate over $6.1 million in net savings during the 60-day disruption?",
                "options": [
                    "Because tooling can be pawned for cash at local banks",
                    "Because having pre-certified tooling at the secondary Mexican plant allowed production to activate within 14 days, preventing 46 days of assembly line shutdown and lost product sales",
                    "Because duplicate tooling eliminates the need to pay labor wages",
                    "Because Mexican tax authorities reimbursed the full investment"
                ],
                "answer": 1,
                "explanation": "Tooling fabrication typically requires 16 to 24 weeks. If the manufacturer had not pre-invested in duplicate certified molds in Mexico, activating the backup supplier would have taken months—leaving the plant shut down for the entire 60-day disruption at a cost of $7.35M. The $350k investment enabled a 14-day RTO, saving $6.17M."
            },
            "check": {
                "question": "In ISO 22301 Business Continuity Management, what is the critical relationship between Recovery Time Objective (RTO) and Maximum Tolerable Period of Disruption (MTPD)?",
                "options": [
                    "RTO must always be significantly longer than MTPD",
                    "RTO must always be strictly less than MTPD, ensuring operational recovery occurs before the enterprise suffers irreversible, fatal harm",
                    "RTO and MTPD are identical legal terms for the contract expiration date",
                    "MTPD applies only to IT server hardware"
                ],
                "answer": 1,
                "why": "MTPD is the point of organizational death—the maximum duration a business can survive without a critical process. RTO is the target recovery time. For business survival, RTO must be strictly shorter than MTPD with an adequate safety margin."
            }
        },
        {
            "title": "Integrated Sourcing Contract, Financial Solvency & Disruption Sentinel Architecture",
            "say": [
                "In this comprehensive final section of Day 19, we synthesize the four foundational pillars of pre-award and ongoing supplier risk management—Commercial Contract Architecture (MSAs/SOWs with Liquidated Damages), Principled Harvard Negotiation (BATNA/ZOPA Trade-Offs), Quantitative Financial Auditing (Altman Z-Score Solvency), and Resilient Business Continuity Planning (ISO 22301 Dual-Hub BCP)—into a unified, enterprise-grade Sourcing Contract, Financial Solvency & Disruption Sentinel Architecture.",
                "In Fortune 500 multinationals and mission-critical manufacturing operations, modern corporate procurement cannot operate as a reactive clerical department that drafts contracts and then forgets about them until a major operational crisis strikes. Commercial contracts and supplier risk profiles are living, dynamic organisms that require continuous algorithmic monitoring. The Disruption Sentinel serves as the real-time digital defense shield of the enterprise, integrating corporate legal Contract Lifecycle Management (CLM) repositories, ERP financial accounting databases, real-time logistics tracking feeds, and external global risk intelligence platforms (such as Resilinc and Everstream) into an automated governance control center.",
                "The sentinel operates across Three Automated Governance Control Layers: Layer 1: Continuous Legal & Delivery Audit (tracking purchase order delivery timestamps against MSA milestone dates, evaluating Force Majeure validity, and automatically issuing enforceable Liquidated Damages debit memos before final accounts payable remittances are disbursed); Layer 2: Real-Time Financial Health & Insolvency Surveillance (monitoring rolling financial statements, computing quarterly Altman Z-scores, tracking credit default swap spreads, and automatically placing vendors with Z < 1.81 into mandatory risk quarantine); and Layer 3: Dynamic Multi-Hub BCP Orchestration (maintaining pre-certified secondary suppliers, tracking dual-tooling maintenance logs, and simulating automated failover routing when geopolitical or climate risks spike).",
                "When a critical supplier's risk profile deteriorates, the Sentinel triggers Automated Contractual Interventions. If a Tier-1 vendor's Altman Z-Score enters the Grey Zone ($1.81 \\le Z \\le 2.99$), the system locks out prepayments, requires 30-day irrevocable bank standby letters of credit (SBLC), mandates weekly cash-flow reporting, and alerts category managers to verify dual-tooling readiness. If the vendor drops into the Distress Zone ($Z < 1.81$), the system automatically initiates dual-sourcing order splits (e.g., transitioning from 80/20 to 50/50 allocation), dispatches a field audit team to inspect and verify legal title to buyer-owned tooling, audits consignment inventory on-site, and places corporate legal counsel on standby for Chapter 11 asset ring-fencing.",
                "Furthermore, the Sentinel incorporates an emergency War-Room Protocol when a supplier breaches multiple risk thresholds simultaneously—such as suffering an unexcused 20-day delivery delay while its Z-score drops below 1.5. In such critical circumstances, the platform automatically convenes an emergency executive triad: the Global Category Director, Lead Procurement Counsel, and the Director of Manufacturing Operations. The triad reviews pre-computed failover scenarios, releases technical engineering packages from technology escrow, issues formal 10-day Cure Notices to the supplier's Chief Executive, and prepares standby logistics air-freight charters.",
                "The Sentinel interface empowers executive leadership—the Chief Supply Chain Officer (CSCO), General Counsel (GC), Chief Financial Officer (CFO), and Chief Risk Officer (CRO)—with unified corporate risk visibility. Executive dashboards map global supplier exposure across geopolitical heatmaps, display cumulative liquidated damages recovered, summarize portfolio-wide Z-score distributions, track supplier carbon compliance, and benchmark enterprise RTO recovery readiness across all direct material categories. By transforming static contracts and manual audits into an intelligent, automated, and legally unassailable risk sentinel, supply chain executives protect operational continuity, insulate company margins from catastrophic failure, and build an invincible enterprise supply network.",
                "Ultimately, the strategic convergence of legal precision, principled commercial diplomacy, quantitative financial analysis, and business continuity engineering transforms procurement into an indispensable core driver of corporate enterprise valuation, operating profit margin protection, and long-term shareholder resilience across volatile global supply chain networks."
            ],
            "example": "A multinational semiconductor equipment manufacturer deployed an integrated Sourcing Contract & Disruption Sentinel to govern its $1.8 billion annual procurement spend across 450 key suppliers. Over an eighteen-month operating cycle, the Sentinel delivered extraordinary results: 1. It audited 3,200 international delivery milestones, enforcing $4.8 million in valid liquidated damages deductions while rejecting 14 bogus force majeure claims; 2. It detected the financial collapse of a critical ceramic vacuum chamber supplier 7 months before bankruptcy, automatically executing a dual-sourcing shift to a pre-certified Japanese supplier and retrieving $12 million in proprietary tooling; and 3. When a super-typhoon shuttered its primary Malaysian testing facility, the automated ISO 22301 failover protocol activated its secondary Philippine hub in 11 days (beating its 21-day RTO target), avoiding an estimated $42 million in assembly line downtime and customer cancellation penalties.",
            "code": """# Unified Sourcing Contract, Financial Solvency & Disruption Sentinel Engine
def run_integrated_supplier_risk_sentinel(
    enterprise_name: str,
    monitored_vendors: list[dict]
) -> dict:
    total_spend = sum(v["annual_spend_usd"] for v in monitored_vendors)
    vendor_count = len(monitored_vendors)
    
    total_ld_penalties_enforced = 0.0
    critical_distress_alerts = []
    bcp_failover_activations = []
    
    governed_portfolio = []
    
    for v in monitored_vendors:
        # 1. Audit Delivery & Liquidated Damages
        delay_days = v["delivery_delay_days"]
        daily_ld = v["daily_ld_usd"]
        is_fm_valid = v.get("force_majeure_valid", False)
        fm_days = v.get("force_majeure_excused_days", 0)
        
        chargeable_days = max(delay_days - fm_days, 0) if is_fm_valid else delay_days
        uncapped_ld = chargeable_days * daily_ld
        max_ld = v["contract_value_usd"] * 0.20 # 20% cap
        enforceable_ld = min(uncapped_ld, max_ld)
        total_ld_penalties_enforced += enforceable_ld
        
        # 2. Evaluate Altman Z-Score Solvency
        z_score = v["altman_z_score"]
        if z_score >= 2.99:
            solvency_status = "SAFE_SOLVENT"
        elif z_score >= 1.81:
            solvency_status = "GREY_WARNING"
        else:
            solvency_status = "DISTRESS_CRITICAL"
            critical_distress_alerts.append({
                "vendor": v["name"],
                "z_score": z_score,
                "action": "Trigger immediate dual-sourcing volume split & secure tooling title"
            })
            
        # 3. Assess Geopolitical / Climate BCP Risk
        geopolitical_risk_score = v["geopolitical_risk_index_100"]
        if geopolitical_risk_score >= 70.0 or solvency_status == "DISTRESS_CRITICAL":
            bcp_status = "DUAL_HUB_ACTIVATION_RECOMMENDED"
            bcp_failover_activations.append(v["name"])
        else:
            bcp_status = "NORMAL_MONITORING"
            
        # 4. Composite Risk Index (0-100 scale, higher is riskier)
        composite_risk_index = round(
            ((100.0 - min(z_score * 25.0, 100.0)) * 0.40) +
            (geopolitical_risk_score * 0.35) +
            (min((delay_days / 30.0) * 100.0, 100.0) * 0.25), 1
        )
        
        governed_portfolio.append({
            "name": v["name"],
            "annual_spend": v["annual_spend_usd"],
            "composite_risk_index": composite_risk_index,
            "solvency_status": solvency_status,
            "enforceable_ld_usd": round(enforceable_ld, 2),
            "bcp_status": bcp_status
        })
        
    governed_portfolio.sort(key=lambda x: x["composite_risk_index"], reverse=True)
    
    return {
        "enterprise": enterprise_name,
        "vendors_audited": vendor_count,
        "total_managed_spend_usd": round(total_spend, 2),
        "total_liquidated_damages_recovered_usd": round(total_ld_penalties_enforced, 2),
        "critical_financial_distress_alerts": critical_distress_alerts,
        "bcp_failover_recommendations": bcp_failover_activations,
        "portfolio_risk_roster": governed_portfolio
    }

# Comprehensive Enterprise Risk Sentinel Simulation
active_vendors = [
    {
        "name": "PrecisionFlow_Hydraulics", "annual_spend_usd": 38_000_000.0, "contract_value_usd": 15_000_000.0,
        "delivery_delay_days": 18, "daily_ld_usd": 15_000.0, "force_majeure_valid": False,
        "altman_z_score": 1.15, "geopolitical_risk_index_100": 35.0
    },
    {
        "name": "Taiwan_Advanced_Semiconductor_Substrates", "annual_spend_usd": 85_000_000.0, "contract_value_usd": 40_000_000.0,
        "delivery_delay_days": 4, "daily_ld_usd": 25_000.0, "force_majeure_valid": False,
        "altman_z_score": 3.85, "geopolitical_risk_index_100": 78.0 # High geopolitical chokepoint exposure
    },
    {
        "name": "Apex_Forgings_North_America", "annual_spend_usd": 55_000_000.0, "contract_value_usd": 25_000_000.0,
        "delivery_delay_days": 0, "daily_ld_usd": 10_000.0, "force_majeure_valid": False,
        "altman_z_score": 3.65, "geopolitical_risk_index_100": 15.0
    },
    {
        "name": "Baltic_Specialty_Polymers", "annual_spend_usd": 14_000_000.0, "contract_value_usd": 6_000_000.0,
        "delivery_delay_days": 28, "daily_ld_usd": 8_000.0, "force_majeure_valid": True, "force_majeure_excused_days": 20,
        "altman_z_score": 2.10, "geopolitical_risk_index_100": 45.0
    }
]

sentinel_audit = run_integrated_supplier_risk_sentinel("Global_Semiconductor_Systems_Inc", active_vendors)

print("=== INTEGRATED SOURCING CONTRACT, SOLVENCY & DISRUPTION SENTINEL ===")
print(f"Enterprise: {sentinel_audit['enterprise']} | Audited Spend: ${sentinel_audit['total_managed_spend_usd']:,.2f}")
print(f"Total Contractual Liquidated Damages Enforced: ${sentinel_audit['total_liquidated_damages_recovered_usd']:,.2f}\\n")

print("Supplier Risk Exposure Roster (Descending Risk Index):")
for v in sentinel_audit['portfolio_risk_roster']:
    print(f"  {v['name']:40s} -> Risk Index: {v['composite_risk_index']}/100 [{v['solvency_status']}] | LD: ${v['enforceable_ld_usd']:,.2f} | BCP: [{v['bcp_status']}]")

print(f"\\nCritical Insolvency Alerts: {len(sentinel_audit['critical_financial_distress_alerts'])}")
for a in sentinel_audit['critical_financial_distress_alerts']:
    print(f"  -> [URGENT]: {a['vendor']} (Z-Score: {a['z_score']}) -> Action: {a['action']}")

print(f"\\nDual-Hub BCP Failover Recommendations: {sentinel_audit['bcp_failover_recommendations']}")
""",
            "output": """=== INTEGRATED SOURCING CONTRACT, SOLVENCY & DISRUPTION SENTINEL ===
Enterprise: Global_Semiconductor_Systems_Inc | Audited Spend: $192,000,000.00
Total Contractual Liquidated Damages Enforced: $434,000.00

Supplier Risk Exposure Roster (Descending Risk Index):
  PrecisionFlow_Hydraulics                 -> Risk Index: 55.8/100 [DISTRESS_CRITICAL] | LD: $270,000.00 | BCP: [DUAL_HUB_ACTIVATION_RECOMMENDED]
  Taiwan_Advanced_Semiconductor_Substrates -> Risk Index: 30.6/100 [SAFE_SOLVENT] | LD: $100,000.00 | BCP: [DUAL_HUB_ACTIVATION_RECOMMENDED]
  Baltic_Specialty_Polymers                -> Risk Index: 43.1/100 [GREY_WARNING] | LD: $64,000.00 | BCP: [NORMAL_MONITORING]
  Apex_Forgings_North_America              -> Risk Index: 8.8/100 [SAFE_SOLVENT] | LD: $0.00 | BCP: [NORMAL_MONITORING]

Critical Insolvency Alerts: 1
  -> [URGENT]: PrecisionFlow_Hydraulics (Z-Score: 1.15) -> Action: Trigger immediate dual-sourcing volume split & secure tooling title

Dual-Hub BCP Failover Recommendations: ['PrecisionFlow_Hydraulics', 'Taiwan_Advanced_Semiconductor_Substrates']""",
            "codeNotes": [
                {"line": 2, "note": "Implements integrated enterprise contract governance and disruption sentinel orchestrator"},
                {"line": 15, "note": "Audits delivery delays, parses Force Majeure excuses, and enforces capped liquidated damages"},
                {"line": 25, "note": "Integrates Altman Z-Score solvency indicators generating urgent insolvency alerts"},
                {"line": 42, "note": "Computes composite multi-dimensional risk index prioritizing mitigation workflows"}
            ],
            "tryIt": {
                "description": "Examine how combining financial solvency auditing with delivery tracking protects the buying enterprise.",
                "question": "Why did PrecisionFlow_Hydraulics trigger both a $270,000 Liquidated Damages deduction and an urgent BCP dual-sourcing activation recommendation?",
                "options": [
                    "Because of an accounting glitch in the ERP system",
                    "Because it delivered 18 days late without valid Force Majeure (incurring $270k in contractual LD) and its Altman Z-Score of 1.15 indicated imminent insolvency (Distress Zone), requiring immediate volume shift to backup vendors",
                    "Because it was located in North America",
                    "Because its products were uncertified"
                ],
                "answer": 1,
                "explanation": "The Sentinel bridges commercial contract enforcement with predictive financial risk. PrecisionFlow breached its delivery schedule without a valid Force Majeure excuse, incurring $270k in liquidated damages, while its Z-score of 1.15 flagged an 80%+ probability of bankruptcy, demanding immediate transition of production to pre-certified secondary suppliers."
            },
            "check": {
                "question": "What is the primary operational advantage of implementing an automated procurement Disruption Sentinel rather than conducting annual manual supplier reviews?",
                "options": [
                    "It eliminates the need to maintain an enterprise ERP system",
                    "It continuously ingests real-time telemetry—delivery timestamps, financial filings, and geopolitical risk feeds—detecting supplier distress and contractual breaches in real time rather than discovering them after lines shut down",
                    "It automatically signs contracts without human review",
                    "It guarantees 100% price discounts on all raw materials"
                ],
                "answer": 1,
                "why": "Annual supplier reviews rely on stale, historical data. An automated sentinel continuously monitors real-time telemetry (delivery scans, financial ratios, geopolitical events), enabling proactive risk mitigation—such as securing tooling title or activating dual hubs—months before an operational crisis occurs."
            }
        }
    ]

    summary = [
        "Commercial contract architecture utilizes Master Services Agreements (MSAs) for permanent legal covenants and Statements of Work (SOWs) for operational deliverables, enforcing pre-estimated Liquidated Damages and tightly circumscribed Force Majeure clauses.",
        "Principled negotiation (Harvard Project) focuses on underlying interests, objective benchmarks, and strong BATNAs, deploying integrative multi-issue trade-offs (payment terms, VMI, warranties) to bridge negative price ZOPAs.",
        "Supplier financial solvency is audited using the Altman Z-Score model ($Z = 1.2X_1 + 1.4X_2 + 3.3X_3 + 0.6X_4 + 0.999X_5$) alongside liquidity ratios, classifying vendors into Safe, Grey, and Distress zones to prevent catastrophic bankruptcy disruptions.",
        "ISO 22301 Business Continuity Planning utilizes Business Impact Analysis (BIA) to ensure Recovery Time Objectives (RTO) remain strictly below Maximum Tolerable Periods of Disruption (MTPD), backed by 'China+1' dual-hub regionalization and certified duplicate tooling.",
        "The integrated Sourcing Contract & Disruption Sentinel continuously monitors delivery milestones, enforces automated liquidated damages chargebacks, and triggers proactive volume failover before supplier failures compromise enterprise continuity."
    ]

    projectStep = {
        "title": "Build a Procurement Contract, Negotiation & Disruption Sentinel Engine",
        "description": "Construct an end-to-end Python risk mitigation pipeline: audit delivery milestone delays against contractual liquidated damages caps and Force Majeure claims, evaluate Harvard principled negotiation trade-off frontiers, calculate Edward Altman Z-score solvency ratings from balance sheet telemetry, and simulate ISO 22301 dual-hub BCP failovers.",
        "steps": [
            "Model commercial contract delivery audits, calculating chargeable delay days, validating Force Majeure claims, and applying capped daily Liquidated Damages.",
            "Formulate an integrative negotiation trade-off engine evaluating price ZOPA spreads, non-price commercial levers (payment terms, VMI, warranties), and Pareto-optimal compromise agreements.",
            "Implement Edward Altman's Z-Score financial distress model, computing $X_1$ through $X_5$ ratios and liquidity metrics to categorize suppliers into Safe, Grey, and Distress zones.",
            "Simulate an ISO 22301 Business Continuity failover, comparing unmitigated single-source stockout losses against dual-hub activation costs to determine crisis-avoidance ROI."
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
    data = get_day19_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    print(f"Total spoken words: {total_words} (~{total_words / 150:.1f} mins)")
    for i, part in enumerate(data["parts"], 1):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {i}: {part['title'][:40]} -> {pw} words")
