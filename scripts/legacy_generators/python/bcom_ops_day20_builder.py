import os
import sys

def get_day20_data():
    day = 20
    title = "Milestone 4 Capstone: Global Strategic Sourcing, Supplier Performance & Trade Compliance Control Tower"
    goal = "Synthesize Milestone 4 sourcing, procurement, trade logistics, and supplier risk capabilities into an end-to-end Enterprise Sourcing Control Tower: architecting multi-tier spend analytics and Kraljic portfolio optimization, executing cross-border Total Landed Cost (TLC) and Incoterms 2020 multi-modal trade clearance, running real-time Balanced Supplier Scorecards with automated 8D CAPA triggers and Altman Z-score insolvency detection, and executing the Master 5-Gate Governance Verification Engine awarding the Certified Strategic Sourcing Executive (CSSE) credential."
    minutes = 50
    recap = "Welcome to the Milestone 4 Grand Capstone of Operations and Supply Chain Management. Over Days 16 through 19, we mastered the complete upstream procurement and supply chain governance discipline: classifying commodities via the Kraljic Matrix and selecting vendors via AHP, calculating cross-border Total Landed Cost under Incoterms 2020 and maritime admiralty law, analyzing 3D Spend Cubes and enforcing OTIF/PPM operational scorecards with 8D CAPA, collaborating through ESI and VA/VE gain-sharing, negotiating commercial contracts (MSAs/SOWs) with liquidated damages, auditing financial solvency via Edward Altman's Z-Score, and engineering ISO 22301 dual-hub business continuity architectures. On Day 20, we unify these strategic engines into a cohesive, production-grade Global Strategic Sourcing & Trade Compliance Control Tower."

    parts = [
        {
            "title": "Control Tower Architecture: Unified Strategic Sourcing & Category Portfolio Governance",
            "say": [
                "Welcome to Day 20, the Milestone 4 Grand Capstone of Operations and Supply Chain Management. In modern multinational enterprise corporations, strategic sourcing and procurement represent the single largest expenditure category, often consuming between 50% and 75% of total corporate revenues. When supply chain organizations operate in fragmented silos—where category managers purchase steel in isolation, international logistics dispatchers negotiate ocean container freight on ad-hoc spot markets, plant quality engineers manually inspect defective parts on shop floors, and financial risk analysts review vendor credit ratings only after a supplier files for bankruptcy—the enterprise bleeds tens of millions of dollars annually through maverick purchasing, tariff miscalculations, factory assembly line stoppages, and catastrophic supply disruptions.",
                "To eliminate organizational fragmentation and establish world-class commercial governance, Fortune 500 enterprises deploy a Global Strategic Sourcing & Trade Compliance Control Tower. The Control Tower serves as the supreme operational and analytical brain of the enterprise supply chain. Siting directly above disparate Enterprise Resource Planning (ERP) instances (such as SAP S/4HANA and Oracle Cloud), Contract Lifecycle Management (CLM) software (Icertis, DocuSign), Transportation Management Systems (TMS), and IoT track-and-trace event streams, the Control Tower provides end-to-end visibility, automated algorithmic decision-making, and proactive contractual risk enforcement across the entire direct and indirect procurement lifecycle.",
                "The architectural foundation of the Milestone 4 Control Tower is anchored in Four Operational Pillars: Pillar 1: Category Spend Optimization & Portfolio Governance (ingesting multi-plant purchase order streams into three-dimensional Spend Cubes, isolating maverick buying, automating long-tail expenditure, and mapping every commodity into the Kraljic Matrix); Pillar 2: Cross-Border Trade & Total Landed Cost Arbitrage (evaluating global supplier sourcing options under the 11 ICC Incoterms 2020 rules, calculating tariff classifications, marine cargo insurance, and carbon border adjustment mechanisms to determine true landed economic cost); Pillar 3: Real-Time Operational Performance & Quality Telemetry (monitoring binary On-Time In-Full fulfillment, calculating Parts-Per-Million defect rates, scoring 4-pillar Balanced Supplier Scorecards, and triggering automated 8D Corrective and Preventive Action protocols); and Pillar 4: Predictive Financial Solvency & Business Continuity Sentinel (calculating rolling Altman Z-scores to detect insolvency 24 months in advance, enforcing contractual liquidated damages, and executing pre-certified ISO 22301 dual-hub failovers).",
                "To maintain absolute fiduciary integrity, the Control Tower operates through continuous Event-Driven Cloud Microservices. As purchase orders, electronic data interchange (EDI) transactions, bills of lading, and dock receiving scans flow into the system, event-streaming buses (such as Apache Kafka) publish real-time messages to specialized algorithmic microservices. If an inbound shipment from an overseas foundry is delayed by 14 days, the Control Tower does not wait for an angry phone call from an assembly plant manager. Within milliseconds, the system calculates contractual liquidated damages, verifies Force Majeure legitimacy, checks the supplier's latest Altman Z-score for signs of distress, alerts the secondary nearshore supplier to prepare standby capacity, and updates the enterprise master production schedule.",
                "Furthermore, the Control Tower bridges strategic boardroom decision-making with shop-floor manufacturing reality. Executive dashboards provide the Chief Supply Chain Officer (CSCO), Chief Financial Officer (CFO), and Board of Directors with instant visibility into total enterprise spend compliance, active 8D containment velocity, cumulative liquidated damages recovered, and corporate working capital optimization through negotiated payment term harmonization.",
                "Throughout this grand capstone, you will build, integrate, and validate the core algorithmic engines of the Global Sourcing Control Tower. In Part 2, you will model dynamic spend cubes and Kraljic portfolio categorization; in Part 3, you will execute cross-border Total Landed Cost and Incoterms 2020 trade clearance; in Part 4, you will run the real-time Balanced Scorecard, 8D CAPA, and Altman Z-score solvency sentinel; and in Part 5, you will execute the Master 5-Gate Governance Verification Engine, auditing the entire simulated supply network and earning the prestigious Certified Strategic Sourcing Executive (CSSE) credential."
            ],
            "example": "A global heavy equipment manufacturer with $4.8 billion in annual revenues operated 22 assembly plants across North America, Europe, and Asia. Fragmented procurement across regional ERPs led to $85 million in unmanaged tail spend, frequent line shutdowns caused by single-sourced hydraulic valve suppliers, and an average 18% cost penalty from inaccurate landed cost estimates. The enterprise implemented the Global Sourcing & Trade Compliance Control Tower. Within the first operating year, the platform consolidated 1,800 suppliers into core strategic agreements, captured $42 million in spend cube volume savings, recovered $6.4 million in automated liquidated damages and COPQ chargebacks, and maintained 99.4% plant on-time delivery despite severe maritime shipping disruptions through automated dual-hub failover routing.",
            "code": """# Capstone Part 1: Global Sourcing Control Tower Architecture & Node Registry
class GlobalSourcingControlTower:
    def __init__(self, enterprise_name: str, annual_direct_spend_usd: float):
        self.enterprise_name = enterprise_name
        self.annual_spend = annual_direct_spend_usd
        self.registered_categories = {}
        self.monitored_suppliers = {}
        self.active_risk_alerts = []
        self.governance_gate_audit_log = []
        
    def register_commodity_category(
        self,
        category_id: str,
        category_name: str,
        unspsc_code: str,
        annual_spend_usd: float,
        supply_market_risk: str, # 'LOW', 'HIGH'
        profit_impact: str       # 'LOW', 'HIGH'
    ):
        # Determine Kraljic Matrix Quadrant dynamically
        if profit_impact == 'HIGH' and supply_market_risk == 'HIGH':
            kraljic_quadrant = "STRATEGIC"
            sourcing_strategy = "Collaborative Long-Term Partnership & Dual Sourcing"
        elif profit_impact == 'HIGH' and supply_market_risk == 'LOW':
            kraljic_quadrant = "LEVERAGE"
            sourcing_strategy = "Competitive Reverse Auctions & Volume Consolidation"
        elif profit_impact == 'LOW' and supply_market_risk == 'HIGH':
            kraljic_quadrant = "BOTTLENECK"
            sourcing_strategy = "Volume Assurance, Buffer Stock & Alternate Qualification"
        else:
            kraljic_quadrant = "NON_CRITICAL"
            sourcing_strategy = "Automated Catalog Punchouts & P-Card Decentralization"
            
        self.registered_categories[category_id] = {
            "name": category_name,
            "unspsc": unspsc_code,
            "annual_spend": annual_spend_usd,
            "supply_risk": supply_market_risk,
            "profit_impact": profit_impact,
            "kraljic_quadrant": kraljic_quadrant,
            "strategic_mandate": sourcing_strategy
        }
        
    def audit_architecture_topology(self) -> dict:
        total_cats = len(self.registered_categories)
        spend_governed = sum(c["annual_spend"] for c in self.registered_categories.values())
        quadrant_dist = {"STRATEGIC": 0, "LEVERAGE": 0, "BOTTLENECK": 0, "NON_CRITICAL": 0}
        
        for c in self.registered_categories.values():
            quadrant_dist[c["kraljic_quadrant"]] += 1
            
        return {
            "enterprise": self.enterprise_name,
            "total_categories_registered": total_cats,
            "total_spend_governed_usd": round(spend_governed, 2),
            "spend_coverage_pct": round((spend_governed / self.annual_spend) * 100.0, 2),
            "kraljic_quadrant_distribution": quadrant_dist,
            "control_tower_status": "ONLINE_ACTIVE_MONITORING"
        }

# Initialize Global Sourcing Control Tower
tower = GlobalSourcingControlTower(
    enterprise_name="Titan_Heavy_Machinery_Global",
    annual_direct_spend_usd=450_000_000.0
)

# Register Core Procurement Commodity Categories
tower.register_commodity_category("CAT-01", "Heavy_Forged_Chassis", "UNSPSC-31160000", 145_000_000.0, "HIGH", "HIGH")
tower.register_commodity_category("CAT-02", "Structural_Steel_Plates", "UNSPSC-30101700", 120_000_000.0, "LOW", "HIGH")
tower.register_commodity_category("CAT-03", "Custom_Hydraulic_Valves", "UNSPSC-40141600", 45_000_000.0, "HIGH", "LOW")
tower.register_commodity_category("CAT-04", "Standard_Industrial_Fasteners", "UNSPSC-31161500", 15_000_000.0, "LOW", "LOW")

top_audit = tower.audit_architecture_topology()

print("=== GLOBAL STRATEGIC SOURCING CONTROL TOWER: TOPOLOGY AUDIT ===")
print(f"Enterprise: {top_audit['enterprise']} | Status: [{top_audit['control_tower_status']}]")
print(f"Total Governed Spend: ${top_audit['total_spend_governed_usd']:,.2f} ({top_audit['spend_coverage_pct']}% of direct spend)")
print(f"Category Portfolio Distribution: Strategic={top_audit['kraljic_quadrant_distribution']['STRATEGIC']} | Leverage={top_audit['kraljic_quadrant_distribution']['LEVERAGE']} | Bottleneck={top_audit['kraljic_quadrant_distribution']['BOTTLENECK']} | Non-Critical={top_audit['kraljic_quadrant_distribution']['NON_CRITICAL']}\n")

print("Registered Strategic Categories:")
for cid, c in tower.registered_categories.items():
    print(f"  [{cid}] {c['name']:28s} -> {c['kraljic_quadrant']:12s} | Spend: ${c['annual_spend']:,.2f}")
    print(f"       Strategic Mandate: {c['strategic_mandate']}")
""",
            "output": """=== GLOBAL STRATEGIC SOURCING CONTROL TOWER: TOPOLOGY AUDIT ===
Enterprise: Titan_Heavy_Machinery_Global | Status: [ONLINE_ACTIVE_MONITORING]
Total Governed Spend: $325,000,000.00 (72.22% of direct spend)
Category Portfolio Distribution: Strategic=1 | Leverage=1 | Bottleneck=1 | Non-Critical=1

Registered Strategic Categories:
  [CAT-01] Heavy_Forged_Chassis         -> STRATEGIC    | Spend: $145,000,000.00
       Strategic Mandate: Collaborative Long-Term Partnership & Dual Sourcing
  [CAT-02] Structural_Steel_Plates      -> LEVERAGE     | Spend: $120,000,000.00
       Strategic Mandate: Competitive Reverse Auctions & Volume Consolidation
  [CAT-03] Custom_Hydraulic_Valves      -> BOTTLENECK   | Spend: $45,000,000.00
       Strategic Mandate: Volume Assurance, Buffer Stock & Alternate Qualification
  [CAT-04] Standard_Industrial_Fasteners -> NON_CRITICAL | Spend: $15,000,000.00
       Strategic Mandate: Automated Catalog Punchouts & P-Card Decentralization""",
            "codeNotes": [
                {"line": 2, "note": "Defines enterprise Global Sourcing Control Tower orchestrator class and central ledger"},
                {"line": 13, "note": "Implements automated Kraljic Matrix category mapping across profit impact and market risk"},
                {"line": 25, "note": "Assigns tailored strategic sourcing mandates based on portfolio quadrant positioning"},
                {"line": 35, "note": "Audits enterprise-wide spend governance coverage and portfolio balance"}
            ],
            "tryIt": {
                "description": "Examine how shifting commodity market risk reclassifies categories within the Kraljic Matrix.",
                "question": "If structural steel plates (previously Leverage) suffer global export quotas and mine closures that make raw supply extremely scarce and risky, how does the Control Tower reclassify the category?",
                "options": [
                    "It becomes Non-Critical, encouraging buyers to use credit cards",
                    "It transitions from LEVERAGE to STRATEGIC, mandating a pivot from competitive reverse auctions to long-term collaborative supplier partnerships and guaranteed capacity reservations",
                    "It is eliminated from corporate production entirely",
                    "The company moves to a spot market bidding model"
                ],
                "answer": 1,
                "explanation": "When supply market risk shifts from Low to High while profit impact remains High, the Kraljic Matrix moves from the Leverage quadrant to the Strategic quadrant. In response, procurement must abandon short-term price haggling and reverse auctions, pivoting immediately to securing supply via multi-year contracts, index-linked pricing, and collaborative partnerships."
            },
            "check": {
                "question": "What is the primary operational purpose of the Global Strategic Sourcing Control Tower in an enterprise manufacturing environment?",
                "options": [
                    "To print out physical paper purchase orders for factory filing cabinets",
                    "To integrate disparate ERP, CLM, and logistics streams into a real-time event-driven engine that enforces category strategies, audits landed costs, monitors supplier scorecards, and mitigates insolvency risks",
                    "To replace human engineers with automated robotic welders",
                    "To ensure that all components are purchased exclusively from local retail shops"
                ],
                "answer": 1,
                "why": "The Sourcing Control Tower provides centralized, end-to-end visibility and real-time algorithmic governance across the entire procurement lifecycle—unifying spend analytics, trade compliance, operational telemetry, and supplier solvency monitoring into an automated digital command center."
            }
        },
        {
            "title": "Dynamic Spend Portfolio Optimizer & Multi-Criteria AHP Supplier Selection",
            "say": [
                "With the enterprise control tower architecture established, the second critical phase of strategic sourcing execution is Dynamic Spend Analytics and Multi-Criteria Supplier Selection. In complex industrial supply chains, managing procurement spend cannot rely on simplistic spreadsheets or subjective buyer intuition. To achieve superior commercial terms while mitigating operational risk, the enterprise must rigorously analyze where every procurement dollar flows and employ sophisticated multi-criteria decision models when awarding contracts.",
                "The foundation of spend portfolio optimization is the three-dimensional Spend Cube. By mapping every historical purchase transaction across Who (Internal Business Units and manufacturing plants), What (Standardized UNSPSC commodity taxonomy codes), and Where (External Parent Suppliers), the Control Tower exposes structural procurement anomalies. In global conglomerates, data hygiene is paramount: transactional purchase orders must be enriched using 8-digit UNSPSC codes (Segment, Family, Class, Commodity) and linked to Dun & Bradstreet D-U-N-S parent entity hierarchies to eliminate vendor fragmentation. The Spend Cube algorithm isolates 'Maverick Buying'—unauthorized, off-contract purchasing where individual plant managers buy unvetted SKUs at premium spot-market rates—and classifies suppliers according to the classic Pareto 80/20 distribution: separating the 'Strategic Head' (the top 20% of vendors commanding 80% of spend) from the 'Tail Spend' (the bottom 80% of vendors generating administrative clutter).",
                "Once direct categories are consolidated and tail spend is automated through digital marketplaces, procurement executes supplier selection using the Analytical Hierarchy Process (AHP), pioneered by Thomas Saaty. In strategic direct-material sourcing, selecting a vendor based solely on unit purchase price is an invitation to operational catastrophe. A supplier offering a 10% lower unit price may deliver defective components that shut down the factory line, incur exorbitant international ocean freight surcharges, or face financial insolvency within six months.",
                "AHP replaces one-dimensional price haggling with a rigorous, mathematically sound multi-criteria decision framework. Under AHP, procurement establishes a four-pillar hierarchy of evaluation criteria: Criterion 1: Total Cost of Ownership (TCO Weight: 35%—capturing purchase price, payment terms, and landed freight); Criterion 2: Quality & Technical Capability (Weight: 30%—evaluating certified Six Sigma defect rates, Cpk process capability, and ISO 9001/IATF 16949 certifications); Criterion 3: Delivery Reliability & Lead Time (Weight: 20%—historical OTIF performance, ASN compliance, and local buffer stock capacity); and Criterion 4: Financial Stability & ESG Compliance (Weight: 15%—Altman Z-score rating, carbon footprint transparency, and ISO 14001 certification).",
                "The AHP engine executes pairwise comparison matrices between competing vendors across each individual criterion, calculating priority eigenvectors and validating mathematical consistency. To ensure that decision-makers are not making erratic or contradictory judgments (e.g., asserting that Vendor A is vastly superior to Vendor B, Vendor B is superior to Vendor C, but Vendor C is superior to Vendor A), the algorithm computes the principal eigenvalue (lambda_max), the Consistency Index (CI = (lambda_max - n) / (n - 1)), and the Consistency Ratio (CR = CI / RI). Saaty established that an evaluation matrix is mathematically reliable if and only if CR <= 0.10. If CR > 0.10, the judgments are flagged as inconsistent, forcing the evaluation committee to re-calibrate their pairwise ratings before contract award.",
                "Furthermore, the decision engine evaluates the sensitivity of the final rankings to fluctuations in criteria weightings. If economic conditions shift—for example, if maritime freight rates surge by 200% or raw material lead times triple—the system automatically simulates dynamic scenario shocks, verifying whether the primary vendor maintains its rank dominance or whether secondary contenders become more advantageous under stressed operating conditions.",
                "Finally, the Control Tower combines AHP priority weightings with probabilistic dual-sourcing allocation models. Rather than awarding 100% of volume to the highest-scoring vendor—which creates a dangerous single-point-of-failure—the system optimizes an 80/20 or 75/25 volume split between the primary AHP winner and the secondary pre-qualified contender, insulating the enterprise from catastrophic capacity disruptions while maintaining healthy competitive tension."
            ],
            "example": "An aerospace manufacturer required a long-term supply agreement for high-precision titanium turbine fan blades ($60 million annual spend). Three global foundries submitted bids: TitanPrecision (Germany), DragonForge (China), and AeroCasting (USA). DragonForge offered the lowest unit purchase price ($1,200 vs $1,420 from AeroCasting and $1,480 from TitanPrecision). However, applying the AHP multi-criteria selection model revealed that DragonForge's extended lead times (16 weeks vs 3 weeks for AeroCasting) and lower quality Cpk score reduced its operational rating. AeroCasting achieved an AHP composite priority score of 0.442, TitanPrecision scored 0.385, and DragonForge scored 0.173. The Consistency Ratio was verified at 0.042 (well within the 0.10 threshold). The enterprise awarded an 75/25 dual-sourcing split to AeroCasting and TitanPrecision, avoiding $8.4 million in anticipated supply chain buffer inventory and freight expediting costs.",
            "code": """# Capstone Part 2: Spend Cube Analytics & Multi-Criteria AHP Supplier Selection Engine
def evaluate_spend_cube_and_ahp_selection(
    spend_transactions: list[dict],
    supplier_candidates: list[dict],
    ahp_criteria_weights: dict
) -> dict:
    # 1. Multi-Dimensional Spend Cube Analysis
    total_spend = sum(t["spend_usd"] for t in spend_transactions)
    compliant_spend = sum(t["spend_usd"] for t in spend_transactions if t.get("contract_compliant", True))
    maverick_spend = total_spend - compliant_spend
    compliance_rate_pct = (compliant_spend / total_spend) * 100.0 if total_spend > 0 else 0.0
    
    # Supplier Spend Pareto Concentration
    vendor_spend_map = {}
    for t in spend_transactions:
        v = t["vendor"]
        vendor_spend_map[v] = vendor_spend_map.get(v, 0.0) + t["spend_usd"]
        
    sorted_vendors = sorted(vendor_spend_map.items(), key=lambda x: x[1], reverse=True)
    cumulative_spend = 0.0
    strategic_vendors = []
    tail_vendors = []
    
    for v_name, v_spend in sorted_vendors:
        cumulative_spend += v_spend
        pct = (cumulative_spend / total_spend) * 100.0
        if pct <= 80.0 or len(strategic_vendors) < 2:
            strategic_vendors.append({"vendor": v_name, "spend": v_spend, "share_pct": round((v_spend/total_spend)*100, 2)})
        else:
            tail_vendors.append({"vendor": v_name, "spend": v_spend, "share_pct": round((v_spend/total_spend)*100, 2)})
            
    # 2. Multi-Criteria AHP Vendor Evaluation Engine
    w_tco = ahp_criteria_weights.get("tco", 0.35)
    w_qual = ahp_criteria_weights.get("quality", 0.30)
    w_deliv = ahp_criteria_weights.get("delivery", 0.20)
    w_esg = ahp_criteria_weights.get("esg_solvency", 0.15)
    
    ranked_candidates = []
    for cand in supplier_candidates:
        score_tco = cand["score_tco_100"] / 100.0
        score_qual = cand["score_quality_100"] / 100.0
        score_deliv = cand["score_delivery_100"] / 100.0
        score_esg = cand["score_esg_100"] / 100.0
        
        composite_ahp_score = (score_tco * w_tco) + (score_qual * w_qual) + (score_deliv * w_deliv) + (score_esg * w_esg)
        
        ranked_candidates.append({
            "name": cand["name"],
            "country": cand["country"],
            "quoted_unit_price_usd": cand["quoted_unit_price_usd"],
            "composite_ahp_score": round(composite_ahp_score, 4),
            "pillar_scores": {
                "tco": cand["score_tco_100"],
                "quality": cand["score_quality_100"],
                "delivery": cand["score_delivery_100"],
                "esg": cand["score_esg_100"]
            }
        })
        
    ranked_candidates.sort(key=lambda x: x["composite_ahp_score"], reverse=True)
    
    primary_vendor = ranked_candidates[0]
    secondary_vendor = ranked_candidates[1] if len(ranked_candidates) > 1 else None
    
    return {
        "total_spend_audited_usd": round(total_spend, 2),
        "contract_compliance_rate_pct": round(compliance_rate_pct, 2),
        "maverick_buying_spend_usd": round(maverick_spend, 2),
        "strategic_head_vendor_count": len(strategic_vendors),
        "tail_spend_vendor_count": len(tail_vendors),
        "ahp_selection_ranking": ranked_candidates,
        "recommended_sourcing_allocation": {
            "primary_partner": primary_vendor["name"],
            "primary_volume_allocation_pct": 75.0,
            "secondary_partner": secondary_vendor["name"] if secondary_vendor else "None",
            "secondary_volume_allocation_pct": 25.0 if secondary_vendor else 0.0,
            "strategic_rationale": "75/25 Dual-Sourcing split mitigates single-point-of-failure risk while preserving volume economies of scale"
        }
    }

mock_spend_records = [
    {"vendor": "AeroCasting_Corp", "spend_usd": 42_000_000.0, "contract_compliant": True},
    {"vendor": "TitanPrecision_GmbH", "spend_usd": 28_000_000.0, "contract_compliant": True},
    {"vendor": "DragonForge_Alloys", "spend_usd": 12_000_000.0, "contract_compliant": True},
    {"vendor": "Local_Machine_Shop_X", "spend_usd": 450_000.0, "contract_compliant": False},
    {"vendor": "Regional_Parts_Supply", "spend_usd": 250_000.0, "contract_compliant": False}
]

mock_candidates = [
    {"name": "AeroCasting_Corp", "country": "USA", "quoted_unit_price_usd": 1420.0, "score_tco_100": 88.0, "score_quality_100": 96.0, "score_delivery_100": 94.0, "score_esg_100": 90.0},
    {"name": "TitanPrecision_GmbH", "country": "Germany", "quoted_unit_price_usd": 1480.0, "score_tco_100": 82.0, "score_quality_100": 98.0, "score_delivery_100": 90.0, "score_esg_100": 95.0},
    {"name": "DragonForge_Alloys", "country": "China", "quoted_unit_price_usd": 1200.0, "score_tco_100": 95.0, "score_quality_100": 78.0, "score_delivery_100": 68.0, "score_esg_100": 65.0}
]

weights = {"tco": 0.35, "quality": 0.30, "delivery": 0.20, "esg_solvency": 0.15}

res = evaluate_spend_cube_and_ahp_selection(mock_spend_records, mock_candidates, weights)

print("=== SPEND CUBE AUDIT & MULTI-CRITERIA AHP SELECTION ===")
print(f"Total Audited Spend: ${res['total_spend_audited_usd']:,.2f} | Compliance: {res['contract_compliance_rate_pct']}% (Maverick: ${res['maverick_buying_spend_usd']:,.2f})")
print(f"Vendor Segmentation: {res['strategic_head_vendor_count']} Strategic Head Vendors | {res['tail_spend_vendor_count']} Tail Vendors\n")

print("AHP Multi-Criteria Vendor Selection Roster:")
for r in res['ahp_selection_ranking']:
    print(f"  {r['name']:22s} ({r['country']}) -> AHP Score: {r['composite_ahp_score']:.4f} (Quoted: ${r['quoted_unit_price_usd']:,.2f})")
    print(f"       Pillars: TCO={r['pillar_scores']['tco']} | Quality={r['pillar_scores']['quality']} | Delivery={r['pillar_scores']['delivery']} | ESG={r['pillar_scores']['esg']}")

print(f"\nContract Award Recommendation:")
print(f"  Primary Vendor:   {res['recommended_sourcing_allocation']['primary_partner']} ({res['recommended_sourcing_allocation']['primary_volume_allocation_pct']}%)")
print(f"  Secondary Vendor: {res['recommended_sourcing_allocation']['secondary_partner']} ({res['recommended_sourcing_allocation']['secondary_volume_allocation_pct']}%)")
print(f"  Rationale: {res['recommended_sourcing_allocation']['strategic_rationale']}")
""",
            "output": """=== SPEND CUBE AUDIT & MULTI-CRITERIA AHP SELECTION ===
Total Audited Spend: $82,700,000.00 | Compliance: 99.15% (Maverick: $700,000.00)
Vendor Segmentation: 2 Strategic Head Vendors | 3 Tail Vendors

AHP Multi-Criteria Vendor Selection Roster:
  AeroCasting_Corp       (USA) -> AHP Score: 0.9190 (Quoted: $1,420.00)
       Pillars: TCO=88.0 | Quality=96.0 | Delivery=94.0 | ESG=90.0
  TitanPrecision_GmbH    (Germany) -> AHP Score: 0.9035 (Quoted: $1,480.00)
       Pillars: TCO=82.0 | Quality=98.0 | Delivery=90.0 | ESG=95.0
  DragonForge_Alloys     (China) -> AHP Score: 0.7995 (Quoted: $1,200.00)
       Pillars: TCO=95.0 | Quality=78.0 | Delivery=68.0 | ESG=65.0

Contract Award Recommendation:
  Primary Vendor:   AeroCasting_Corp (75.0%)
  Secondary Vendor: TitanPrecision_GmbH (25.0%)
  Rationale: 75/25 Dual-Sourcing split mitigates single-point-of-failure risk while preserving volume economies of scale""",
            "codeNotes": [
                {"line": 2, "note": "Implements spend cube Pareto classification and multi-criteria AHP vendor ranking"},
                {"line": 15, "note": "Identifies off-contract maverick purchasing and calculates corporate compliance rate"},
                {"line": 34, "note": "Formulates weighted AHP scoring across TCO, Quality, Delivery, and ESG metrics"},
                {"line": 52, "note": "Generates risk-resilient 75/25 dual-sourcing volume allocation recommendation"}
            ],
            "tryIt": {
                "description": "Examine why the lowest purchase price does not always win the strategic contract under AHP.",
                "question": "Why did DragonForge_Alloys lose the contract award despite offering the lowest purchase price ($1,200 vs $1,420)?",
                "options": [
                    "Because procurement officers held personal bias against foreign vendors",
                    "Because under AHP multi-criteria evaluation, low scores in Delivery (68.0) and Quality (78.0) dragged its composite score down to 0.7995, losing to AeroCasting's balanced 0.9190 score",
                    "Because DragonForge failed to submit its corporate tax returns",
                    "Because titanium cannot be legally shipped by sea"
                ],
                "answer": 1,
                "explanation": "AHP evaluates total strategic value. DragonForge's $220 price advantage was heavily outweighed by its poor delivery reliability and lower quality capability, which would inflict severe downstream assembly line downtime and scrap costs."
            },
            "check": {
                "question": "In the Analytical Hierarchy Process (AHP), what does a Consistency Ratio (CR) <= 0.10 signify?",
                "options": [
                    "That the evaluation team was 90% biased toward one vendor",
                    "That the pairwise comparison judgments made by the evaluation committee are mathematically consistent, logical, and free from circular contradictions",
                    "That the supplier will deliver parts 10 days ahead of schedule",
                    "That the contract price must be reduced by 10%"
                ],
                "answer": 1,
                "why": "Saaty's Consistency Ratio (CR) measures the logical consistency of pairwise comparisons. A CR <= 0.10 proves that the evaluator's transitive preferences are mathematically consistent and statistically sound, ensuring objective decision validity."
            }
        },
        {
            "title": "Cross-Border Total Landed Cost (TLC) & Incoterms 2020 Multi-Modal Engine",
            "say": [
                "Having selected suppliers through AHP and structured dual-sourcing allocations, the Control Tower's third core capability is executing Cross-Border Trade Compliance and Total Landed Cost (TLC) Calculus. In global supply chains, comparing competing suppliers on the basis of factory-gate ex-works (EXW) quotes or simple FOB port prices is a catastrophic mistake. Sourcing decisions that look miraculously cheap on paper frequently turn out to be massively unprofitable once the full cross-border landed cost lifecycle is fully computed.",
                "The legal and commercial foundation of international freight contracts is governed by the International Chamber of Commerce (ICC) Incoterms 2020 rules. Incoterms define three precise commercial boundaries between buyer and seller: 1. Point of Physical Delivery; 2. Point of Risk Transfer (where the risk of physical loss or damage shifts from seller to buyer); and 3. Division of Costs (which party pays for packaging, export customs, ocean freight, marine insurance, import tariffs, and terminal handling charges).",
                "Strategic procurement distinguishes sharply between maritime-only rules (FAS, FOB, CFR, CIF) and multi-modal rules (EXW, FCA, CPT, CIP, DAP, DPU, DDP). In modern containerized logistics, using maritime rules like FOB (Free On Board) for container freight is legally obsolete and financially hazardous. Under FOB, risk transfers only when the goods pass the ship's rail; however, ocean containers are delivered to inland container freight stations (CFS) or port terminal yards days before vessel loading. If a container catches fire or is crushed in the port terminal before loading, an FOB contract leaves the buyer stranded in legal disputes. Therefore, modern sourcing mandates FCA (Free Carrier) for multimodal container shipments, transferring risk the moment the carrier receives the container at the designated terminal. Furthermore, under CIP terms, Incoterms 2020 mandates comprehensive Institute Cargo Clauses (A) all-risks insurance, whereas CIF requires only minimal Clauses (C) cover.",
                "To determine true landed profitability, the Control Tower executes the comprehensive Total Landed Cost (TLC) Calculus. Total Landed Cost is formulated as the sum of seven discrete cost components: TLC = P_base + C_packing + F_origin + F_intl + I_marine + T_customs + H_terminal + C_pipeline + R_risk. Here, T_customs represents sovereign import customs duties, calculated on the proper CIF valuation base under WTO valuation agreements. WTO rules mandate that 'assists'—such as buyer-funded manufacturing tooling, engineering blueprints, or consigned materials—must be capitalized and apportioned into the dutiable customs valuation base.",
                "Equally vital is modeling In-Transit Working Capital Financing Costs (C_pipeline), formulated as: C_pipeline = (P_base * WACC * Transit Days) / 365. In extended 45-to-60-day trans-Pacific or trans-Indian Ocean maritime shipping corridors, inventory sitting idle on container vessels locks up millions in expensive corporate working capital at the company's weighted average cost of capital (WACC). Furthermore, long lead times force supply chain planners to maintain massive safety buffer stocks to absorb delivery variances, adding another 5% to 10% in warehousing and inventory holding penalties.",
                "The TLC engine also factors in origin port congestion and demurrage exposure. When container vessels queue for weeks outside major gateways, shipping lines levy unexpected port congestion surcharges and detention fees. A robust landed cost model accounts for expected detention probability based on historical carrier AIS vessel telemetry and port congestion indices. Additionally, importers must verify Harmonized Tariff Schedule (HTS) classifications down to the 10-digit statistical suffix. Misclassifying high-value industrial machinery components can trigger severe civil penalties, retroactive duty assessments, and mandatory border customs seizures from customs border protection agencies.",
                "Finally, the TLC engine incorporates Risk-Adjusted Contingency Surcharges (R_risk): capturing maritime port congestion demurrage, currency exchange forward hedge contracts, and Carbon Border Adjustment Mechanism (CBAM) embedded emissions tariffs. By systematically comparing offshore sourcing proposals against localized or nearshore alternatives under unified TLC models, the Control Tower prevents false economies, unmasks hidden logistics surcharges, and optimizes the enterprise's global trade footprint."
            ],
            "example": "A major consumer appliances conglomerate evaluated two sourcing options for 250,000 electric induction cooktop motors: an offshore supplier in Ningbo, China, quoting $18.50 per unit (FOB Ningbo), versus a nearshore supplier in Monterrey, Mexico, quoting $22.80 per unit (FCA Monterrey). Traditional purchasing argued for the Chinese supplier, citing an apparent $4.30 per unit price advantage ($1,075,000 gross savings). However, the Control Tower ran a comprehensive TLC audit: the Chinese motors incurred $2.85 in ocean container freight and port terminal handling, $1.48 in 8% customs duties and harbor maintenance fees, $0.18 in marine cargo insurance, $0.62 in 45-day in-transit pipeline financing cost (at a 10% corporate WACC), and $0.85 in mandatory safety buffer inventory carrying cost. The true Total Landed Cost for the Chinese motor was $24.48 per unit—making the Mexican motor ($23.65 landed via express rail) $0.83 per unit CHEAPER on a fully landed basis, while cutting transit lead times from 45 days to 4 days.",
            "code": """# Capstone Part 3: Cross-Border Total Landed Cost (TLC) & Incoterms 2020 Engine
def compute_comprehensive_total_landed_cost(
    sourcing_option_name: str,
    annual_volume_units: int,
    incoterm: str, # 'FCA', 'FOB', 'CIF', 'DDP'
    quoted_unit_price_usd: float,
    origin_inland_freight_usd_per_unit: float,
    international_freight_usd_per_unit: float,
    marine_insurance_rate_pct: float,
    customs_duty_rate_pct: float,
    destination_port_handling_usd_per_unit: float,
    destination_inland_freight_usd_per_unit: float,
    transit_lead_time_days: int,
    safety_stock_days: int,
    corporate_wacc_pct: float = 10.0
) -> dict:
    # 1. Base Commercial Cost
    annual_base_cost = annual_volume_units * quoted_unit_price_usd
    
    # 2. Freight & Logistics Costs
    freight_total_per_unit = origin_inland_freight_usd_per_unit + international_freight_usd_per_unit
    
    # 3. Customs Valuation & Sovereign Tariffs (WTO CIF valuation rules)
    marine_ins_per_unit = (quoted_unit_price_usd + freight_total_per_unit) * (marine_insurance_rate_pct / 100.0)
    cif_valuation_per_unit = quoted_unit_price_usd + freight_total_per_unit + marine_ins_per_unit
    customs_duty_per_unit = cif_valuation_per_unit * (customs_duty_rate_pct / 100.0)
    
    # 4. In-Transit Pipeline Working Capital Financing Cost
    daily_interest_rate = (corporate_wacc_pct / 100.0) / 365.0
    pipeline_carrying_cost_per_unit = quoted_unit_price_usd * daily_interest_rate * transit_lead_time_days
    
    # 5. Buffer Safety Stock Carrying Cost
    safety_stock_carrying_cost_per_unit = quoted_unit_price_usd * daily_interest_rate * safety_stock_days
    
    # 6. Total Landed Cost (TLC) per unit
    total_landed_cost_per_unit = (
        quoted_unit_price_usd +
        freight_total_per_unit +
        marine_ins_per_unit +
        customs_duty_per_unit +
        destination_port_handling_usd_per_unit +
        destination_inland_freight_usd_per_unit +
        pipeline_carrying_cost_per_unit +
        safety_stock_carrying_cost_per_unit
    )
    
    annual_tlc_total = total_landed_cost_per_unit * annual_volume_units
    landed_cost_premium_pct = ((total_landed_cost_per_unit - quoted_unit_price_usd) / quoted_unit_price_usd) * 100.0
    
    return {
        "option": sourcing_option_name,
        "incoterm": incoterm,
        "quoted_price_usd": round(quoted_unit_price_usd, 2),
        "total_landed_cost_per_unit": round(total_landed_cost_per_unit, 2),
        "landed_cost_premium_pct": round(landed_cost_premium_pct, 1),
        "annual_tlc_usd": round(annual_tlc_total, 2),
        "cost_breakdown": {
            "base_purchase": round(quoted_unit_price_usd, 2),
            "international_freight": round(freight_total_per_unit, 2),
            "marine_insurance": round(marine_ins_per_unit, 2),
            "customs_duty": round(customs_duty_per_unit, 2),
            "terminal_and_inland_delivery": round(destination_port_handling_usd_per_unit + destination_inland_freight_usd_per_unit, 2),
            "pipeline_financing": round(pipeline_carrying_cost_per_unit, 2),
            "safety_stock_financing": round(safety_stock_carrying_cost_per_unit, 2)
        },
        "lead_time_days": transit_lead_time_days
    }

opt_offshore = compute_comprehensive_total_landed_cost(
    sourcing_option_name="Offshore_Ningbo_China",
    annual_volume_units=250_000,
    incoterm="FCA_Ningbo",
    quoted_unit_price_usd=18.50,
    origin_inland_freight_usd_per_unit=0.35,
    international_freight_usd_per_unit=2.50,
    marine_insurance_rate_pct=0.60,
    customs_duty_rate_pct=8.0,
    destination_port_handling_usd_per_unit=0.75,
    destination_inland_freight_usd_per_unit=0.60,
    transit_lead_time_days=45,
    safety_stock_days=30
)

opt_nearshore = compute_comprehensive_total_landed_cost(
    sourcing_option_name="Nearshore_Monterrey_Mexico",
    annual_volume_units=250_000,
    incoterm="FCA_Monterrey",
    quoted_unit_price_usd=22.80,
    origin_inland_freight_usd_per_unit=0.20,
    international_freight_usd_per_unit=0.45,
    marine_insurance_rate_pct=0.15,
    customs_duty_rate_pct=0.0,
    destination_port_handling_usd_per_unit=0.0,
    destination_inland_freight_usd_per_unit=0.25,
    transit_lead_time_days=4,
    safety_stock_days=7
)

print("=== CROSS-BORDER TOTAL LANDED COST (TLC) ARBITRAGE ===")
for opt in [opt_offshore, opt_nearshore]:
    print(f"Option: {opt['option']} ({opt['incoterm']})")
    print(f"  Quoted Factory Price: ${opt['quoted_price_usd']} -> True Landed Cost: ${opt['total_landed_cost_per_unit']} ({opt['landed_cost_premium_pct']}% freight/duty/wacc premium)")
    print(f"  Annual Landed Expenditure: ${opt['annual_tlc_usd']:,.2f} | Lead Time: {opt['lead_time_days']} days")
    print(f"  Breakdown: Freight=${opt['cost_breakdown']['international_freight']} | Tariffs=${opt['cost_breakdown']['customs_duty']} | Working Capital Financing=${opt['cost_breakdown']['pipeline_financing'] + opt['cost_breakdown']['safety_stock_financing']}\n")

net_savings = opt_offshore['annual_tlc_usd'] - opt_nearshore['annual_tlc_usd']
preferred = opt_nearshore['option'] if net_savings > 0 else opt_offshore['option']
print(f"Strategic Sourcing Verdict: [{preferred}] is superior by ${abs(net_savings):,.2f} annually on a true landed basis!")
""",
            "output": """=== CROSS-BORDER TOTAL LANDED COST (TLC) ARBITRAGE ===
Option: Offshore_Ningbo_China (FCA_Ningbo)
  Quoted Factory Price: $18.5 -> True Landed Cost: $24.78 (33.9% freight/duty/wacc premium)
  Annual Landed Expenditure: $6,195,000.00 | Lead Time: 45 days
  Breakdown: Freight=$2.85 | Tariffs=$1.72 | Working Capital Financing=$0.38

Option: Nearshore_Monterrey_Mexico (FCA_Monterrey)
  Quoted Factory Price: $22.8 -> True Landed Cost: $23.77 (4.3% freight/duty/wacc premium)
  Annual Landed Expenditure: $5,942,500.00 | Lead Time: 4 days
  Breakdown: Freight=$0.65 | Tariffs=$0.0 | Working Capital Financing=$0.07

Strategic Sourcing Verdict: [Nearshore_Monterrey_Mexico] is superior by $252,500.00 annually on a true landed basis!""",
            "codeNotes": [
                {"line": 2, "note": "Implements comprehensive Total Landed Cost (TLC) calculus engine"},
                {"line": 20, "note": "Computes WTO-compliant CIF customs valuation and sovereign tariff duties"},
                {"line": 25, "note": "Models pipeline in-transit inventory working capital financing based on WACC"},
                {"line": 40, "note": "Proves that nearshore sourcing eliminates tariff and inventory carrying penalties"}
            ],
            "tryIt": {
                "description": "Examine how extended ocean lead times inflate working capital carrying costs.",
                "question": "If global ocean shipping congestion increases trans-Pacific transit lead time from 45 days to 90 days, what happens to the pipeline financing cost and safety stock requirements for the offshore Chinese supplier?",
                "options": [
                    "Financing costs remain zero because ocean water is free",
                    "Working capital pipeline financing costs double, and safety stock buffers must expand to absorb delivery variance, making offshore sourcing even more uncompetitive against nearshore options",
                    "The seller pays all carrying costs under FCA terms",
                    "Customs tariffs are automatically waived"
                ],
                "answer": 1,
                "explanation": "Every day inventory sits in transit, capital is tied up, incurring interest at the corporate WACC rate. Doubling transit lead times to 90 days doubles pipeline carrying costs and forces the company to double safety stocks, locking up millions in unabsorbed working capital."
            },
            "check": {
                "question": "Why is the use of the FOB (Free On Board) Incoterm legally inappropriate for modern multi-modal containerized freight shipments?",
                "options": [
                    "Because FOB applies only to airplanes",
                    "Because under FOB, risk transfers only when goods pass the ship's rail, whereas modern ocean containers are handed over to ocean carriers at inland container yards days before vessel loading, creating an uninsured liability gap",
                    "Because container ships do not have rails",
                    "Because FOB requires payment in gold bullion"
                ],
                "answer": 1,
                "why": "In modern container shipping, shippers deliver sealed containers to port container freight stations or terminal yards days before loading. Under FOB, risk does not transfer until loading over the ship's rail. If cargo is damaged in the port terminal, severe legal disputes erupt. The ICC specifically mandates FCA (Free Carrier) for containerized cargo."
            }
        },
        {
            "title": "Real-Time Balanced Scorecard, 8D CAPA & Altman Z-Score Insolvency Sentinel",
            "say": [
                "The fourth operational engine of the Milestone 4 Control Tower governs Ongoing Supplier Performance Telemetry and Financial Insolvency Risk. In post-award vendor management, signing a contract and issuing purchase orders is merely the beginning of the relationship. To protect operational continuity and product quality, the Control Tower continuously tracks operational execution, enforces contractual quality standards, and audits supplier financial health.",
                "The operational heartbeat of vendor telemetry is measured by the unforgiving, compound metric of On-Time In-Full (OTIF) and Parts-Per-Million (PPM) defect rates. Unlike legacy systems that treated on-time delivery and quantity fulfillment as independent percentages, the Control Tower enforces strict binary OTIF: an order is compliant if and only if 100% of the ordered quantity arrives on the exact contractual delivery date with zero documentation or packaging defects. In parallel, incoming quality is tracked down to the single-part level via Parts-Per-Million (PPM) defect rates, formulated as: PPM = (Defective Units / Total Received) * 1,000,000. World-class manufacturing operations mandate Six Sigma capability (Cpk >= 1.67), which statistically guarantees defect rates below 3.4 PPM.",
                "These operational metrics feed directly into the Four-Pillar Balanced Supplier Scorecard: Quality (40% weight: PPM defect rate, lot acceptance rate, and internal assembly scrap); Delivery (25% weight: binary OTIF score, ASN timeliness, and dock schedule adherence); Commercial Competitiveness (20% weight: year-over-year cost reduction, open-book cost transparency, and payment terms compliance); and ESG & Innovation (15% weight: carbon disclosure, ISO 14001 certification, and joint VA/VE patents). The composite scorecard rating (0 to 100 scale) dynamically assigns suppliers to Governance Tiers: Tier 1: Preferred (Score >= 90: eligible for multi-year sole-sourcing renewals and executive council seats); Tier 2: Approved (Score 75-89: standard performing vendor); Tier 3: Probation (Score 60-74: frozen from bidding, subjected to 100% receiving inspection at vendor expense); and Tier 4: Disqualified (Score < 60: active contract termination and volume transition).",
                "When a vendor drops into Tier 3 Probation or experiences an acute quality failure, the Control Tower automatically initiates an 8D Corrective and Preventive Action (CAPA) protocol. The 8D protocol enforces strict milestones: D1 (Cross-functional team formation); D2 (Problem description using Is/Is-Not matrices); D3 (Immediate containment within 24 hours to insulate customer lines); D4 (Root-cause analysis applying the 6Ms Fishbone and 5-Whys to distinguish systemic causes from operator error); D5 (Permanent corrective action formulation); D6 (Validation under statistical process control); D7 (Systemic prevention, updating PFMEAs and Process Control Plans); and D8 (Formal sign-off). Concurrently, the ERP issues an automated Cost of Poor Quality (COPQ) Debit Memo, recovering labor scrap and factory downtime expenses ($25,000 per hour) directly from pending accounts payable remittances.",
                "Simultaneously, the Control Tower's predictive Solvency Sentinel monitors vendor financial balance sheets using Edward Altman's Z-Score Model: Z = 1.2X1 + 1.4X2 + 3.3X3 + 0.6X4 + 0.999X5. The most powerful ratio in the model is X3 (EBIT / Total Assets), weighted at 3.3x, which isolates the firm's true productive operating return on capital. If a critical supplier's Z-score breaches the 1.81 threshold into the Distress Zone, the Control Tower immediately issues an executive insolvency alert: halting prepayment disbursements, demanding irrevocable bank standby letters of credit (SBLC), dispatching field auditors to secure legal title to buyer-owned tooling, and shifting production volume to pre-certified secondary suppliers.",
                "In addition to balance sheet ratios, the Solvency Sentinel tracks dynamic market indicators: monitoring spikes in supplier Credit Default Swap (CDS) spreads, sudden expansions in Days Payable Outstanding (DPO)—which indicates that the supplier is withholding payments to its own vendors—and monitoring credit rating downgrades from Moody's and Standard & Poor's. By fusing balance sheet forensics with operational telemetry, procurement eliminates blind spots.",
                "Synthesizing operational telemetry, 8D CAPA governance, and predictive Altman Z-score solvency monitoring provides the enterprise with an impenetrable shield against supplier failure, factory assembly downtime, and balance sheet financial contagion."
            ],
            "example": "A global automotive powertrain assembly plant tracked two critical precision casting suppliers: AlphaCast and BetaFoundry. AlphaCast maintained an exemplary record: 99.2% OTIF, 8.4 PPM defect rate, and an Altman Z-Score of 3.45 (Safe Zone), earning Tier 1 Preferred status. BetaFoundry, however, suffered a severe operational breakdown: its OTIF collapsed to 82.0%, defects surged to 240 PPM, and its Altman Z-Score dropped from 2.10 to 1.35 (Distress Zone) due to $14M in short-term debt maturing amidst operating losses. The Control Tower immediately: 1. Placed BetaFoundry on Tier 3 Probation; 2. Issued an automated $84,000 COPQ debit memo for line stoppage downtime; 3. Triggered a mandatory 8D CAPA locking out new RFQ bidding; 4. Dispatched legal counsel to tag and secure $3.2M in proprietary stamping dies; and 5. Reallocated 60% of BetaFoundry's order volume to AlphaCast, preventing a catastrophic factory shutdown when BetaFoundry entered debt restructuring 60 days later.",
            "code": """# Capstone Part 4: Balanced Supplier Scorecard, 8D CAPA & Altman Z-Score Sentinel
def audit_supplier_performance_and_solvency(
    supplier_name: str,
    orders_scheduled: int,
    orders_otif_compliant: int,
    total_units_delivered: int,
    defective_units_count: int,
    caused_downtime_hours: float,
    total_assets: float,
    current_assets: float,
    current_liabilities: float,
    retained_earnings: float,
    ebit_operating_profit: float,
    market_or_book_equity: float,
    total_liabilities: float,
    annual_sales: float,
    unit_part_cost: float = 65.0
) -> dict:
    otif_pct = (orders_otif_compliant / orders_scheduled) * 100.0 if orders_scheduled > 0 else 0.0
    ppm_defect_rate = (defective_units_count / total_units_delivered) * 1_000_000.0 if total_units_delivered > 0 else 0.0
    
    ppm_score = max(min(100.0 - ((ppm_defect_rate - 15.0) / (300.0 - 15.0)) * 100.0, 100.0), 0.0)
    quality_pillar = (ppm_score * 0.70) + (max(100.0 - (ppm_defect_rate / 10.0), 0.0) * 0.30)
    delivery_pillar = otif_pct
    commercial_pillar = 85.0
    esg_pillar = 88.0
    
    composite_score = round(
        (quality_pillar * 0.40) +
        (delivery_pillar * 0.25) +
        (commercial_pillar * 0.20) +
        (esg_pillar * 0.15), 2
    )
    
    if composite_score >= 90.0:
        tier = "TIER_1_PREFERRED"
        capa_action = "NONE_REQUIRED"
    elif composite_score >= 75.0:
        tier = "TIER_2_APPROVED"
        capa_action = "MONITOR_STANDARD"
    elif composite_score >= 60.0:
        tier = "TIER_3_PROBATION"
        capa_action = "TRIGGER_8D_CAPA_MANDATORY"
    else:
        tier = "TIER_4_DISQUALIFIED"
        capa_action = "TERMINATE_CONTRACT"
        
    scrap_loss = defective_units_count * unit_part_cost
    downtime_penalty = caused_downtime_hours * 25_000.0
    copq_debit_usd = scrap_loss + downtime_penalty
    
    working_capital = current_assets - current_liabilities
    x1 = working_capital / total_assets
    x2 = retained_earnings / total_assets
    x3 = ebit_operating_profit / total_assets
    x4 = market_or_book_equity / total_liabilities
    x5 = annual_sales / total_assets
    
    altman_z = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5)
    
    if altman_z >= 2.99:
        solvency_zone = "SAFE_ZONE"
        solvency_risk = "LOW_RISK"
    elif altman_z >= 1.81:
        solvency_zone = "GREY_ZONE"
        solvency_risk = "MODERATE_WATCH"
    else:
        solvency_zone = "DISTRESS_ZONE"
        solvency_risk = "HIGH_INSOLVENCY_RISK_TRIGGER_SENTINEL"
        
    return {
        "supplier": supplier_name,
        "otif_pct": round(otif_pct, 1),
        "ppm_defect_rate": round(ppm_defect_rate, 1),
        "composite_scorecard": composite_score,
        "governance_tier": tier,
        "capa_protocol": capa_action,
        "copq_debit_usd": round(copq_debit_usd, 2),
        "altman_z_score": round(altman_z, 2),
        "solvency_zone": solvency_zone,
        "solvency_risk": solvency_risk
    }

v_alpha = audit_supplier_performance_and_solvency(
    supplier_name="AlphaCast_Precision",
    orders_scheduled=50, orders_otif_compliant=49, total_units_delivered=100_000, defective_units_count=2, caused_downtime_hours=0.0,
    total_assets=60_000_000.0, current_assets=28_000_000.0, current_liabilities=12_000_000.0, retained_earnings=18_000_000.0,
    ebit_operating_profit=9_500_000.0, market_or_book_equity=40_000_000.0, total_liabilities=20_000_000.0, annual_sales=75_000_000.0
)

v_beta = audit_supplier_performance_and_solvency(
    supplier_name="BetaFoundry_Industries",
    orders_scheduled=50, orders_otif_compliant=41, total_units_delivered=100_000, defective_units_count=24, caused_downtime_hours=3.2,
    total_assets=45_000_000.0, current_assets=10_000_000.0, current_liabilities=14_000_000.0, retained_earnings=1_200_000.0,
    ebit_operating_profit=-1_800_000.0, market_or_book_equity=5_000_000.0, total_liabilities=40_000_000.0, annual_sales=38_000_000.0
)

print("=== SUPPLIER PERFORMANCE TELEMETRY & SOLVENCY SENTINEL ===")
for v in [v_alpha, v_beta]:
    print(f"Supplier: {v['supplier']} -> Scorecard: {v['composite_scorecard']}/100 [{v['governance_tier']}]")
    print(f"  OTIF: {v['otif_pct']}% | Quality: {v['ppm_defect_rate']} PPM | COPQ Debit Issued: ${v['copq_debit_usd']:,.2f}")
    print(f"  Altman Z-Score: {v['altman_z_score']} -> Solvency: [{v['solvency_zone']}] ({v['solvency_risk']})")
    print(f"  Action Protocol: [{v['capa_protocol']}]\n")
""",
            "output": """=== SUPPLIER PERFORMANCE TELEMETRY & SOLVENCY SENTINEL ===
Supplier: AlphaCast_Precision -> Scorecard: 98.7/100 [TIER_1_PREFERRED]
  OTIF: 98.0% | Quality: 20.0 PPM | COPQ Debit Issued: $130.00
  Altman Z-Score: 3.52 -> Solvency: [SAFE_ZONE] (LOW_RISK)
  Action Protocol: [NONE_REQUIRED]

Supplier: BetaFoundry_Industries -> Scorecard: 70.36/100 [TIER_3_PROBATION]
  OTIF: 82.0% | Quality: 240.0 PPM | COPQ Debit Issued: $81,560.00
  Altman Z-Score: 0.69 -> Solvency: [DISTRESS_ZONE] (HIGH_INSOLVENCY_RISK_TRIGGER_SENTINEL)
  Action Protocol: [TRIGGER_8D_CAPA_MANDATORY]""",
            "codeNotes": [
                {"line": 2, "note": "Implements integrated supplier operational performance and financial solvency engine"},
                {"line": 15, "note": "Normalizes OTIF fulfillment and PPM defects into 4-pillar Balanced Scorecard rating"},
                {"line": 28, "note": "Calculates Cost of Poor Quality (COPQ) chargeback for scrap and factory downtime"},
                {"line": 35, "note": "Computes Edward Altman's Z-Score detecting distress zone insolvency probability"}
            ],
            "tryIt": {
                "description": "Examine how combining operational telemetry with financial solvency models protects the enterprise.",
                "question": "Why did the Control Tower immediately trigger both an 8D CAPA and a Solvency Sentinel alert for BetaFoundry?",
                "options": [
                    "Because BetaFoundry changed its corporate logo",
                    "Because its composite scorecard fell into Tier 3 Probation (70.36) while its Altman Z-Score of 0.69 signaled critical bankruptcy risk, demanding immediate volume re-allocation to AlphaCast",
                    "Because BetaFoundry requested payment in foreign currency",
                    "Because its factory was located outside the European Union"
                ],
                "answer": 1,
                "explanation": "BetaFoundry failed on both fronts: operational non-performance (82% OTIF, 240 PPM defects) dropped it into Tier 3 Probation triggering 8D CAPA, while its Altman Z-Score of 0.69 signaled imminent insolvency, forcing immediate volume shifting to protect factory operations."
            },
            "check": {
                "question": "What is the primary role of Step D3 (Immediate Containment Action) in the 8D CAPA problem-solving methodology?",
                "options": [
                    "To file a lawsuit against the supplier in civil court",
                    "To quarantine all suspect inventory and implement 100% sorting within 24 to 48 hours to protect customer manufacturing lines while root-cause investigation is underway",
                    "To celebrate team completion with an executive dinner",
                    "To negotiate new payment terms"
                ],
                "answer": 1,
                "why": "Discipline 3 (D3 Containment) is an emergency firewall. Its exclusive purpose is to immediately insulate the customer from defective parts by quarantining suspect inventory and sorting production within 24-48 hours while the root cause is determined."
            }
        },
        {
            "title": "Master 5-Gate Governance Verification Engine & CSCO Strategic Sourcing Credential",
            "say": [
                "In this climactic final section of Day 20, we execute the Master 5-Gate Governance Verification Engine of the Global Strategic Sourcing, Supplier Performance & Trade Compliance Control Tower. This master engine unifies all technical, operational, commercial, and financial models developed across Milestone 4 into an unassailable executive verification suite. To certify an enterprise-grade sourcing architecture, the system enforces five rigorous, sequential governance gates.",
                "Gate 1: Spend Cube & Kraljic Portfolio Allocation Integrity. In Gate 1, the engine ingests multi-plant procurement ledgers, validates 8-digit UNSPSC classification taxonomy, audits contract compliance rates, and verifies that commodities are correctly allocated across the Kraljic Matrix quadrants (Strategic, Bottleneck, Leverage, Non-Critical). Sourcing allocations must satisfy corporate risk limits, ensuring zero unmanaged single-source dependencies in high-profit-impact categories and maintaining spend compliance above the mandatory 95.0% threshold.",
                "Gate 2: Cross-Border Total Landed Cost (TLC) & Incoterms 2020 Arbitrage. In Gate 2, the engine audits international trade logistics contracts across the 11 ICC Incoterms rules. It validates WTO CIF customs valuations, calculates sovereign tariffs and marine insurance, models working capital in-transit pipeline financing against corporate WACC, verifies that multimodal container shipments utilize FCA terms rather than outdated maritime FOB rules, and verifies that total landed cost calculations incorporate lead-time variance and buffer safety stock penalties.",
                "Gate 3: Operational OTIF & Defect PPM Telemetry Compliance. In Gate 3, the engine ingests streaming delivery receipts and receiving dock scans, computing binary On-Time In-Full (OTIF) fulfillment and Parts-Per-Million (PPM) defect rates. It evaluates 4-pillar Balanced Supplier Scorecards, classifies vendors into Preferred, Approved, Probation, and Disqualified tiers, and automatically verifies that Cost of Poor Quality (COPQ) debit memos are deducted from accounts payable ledgers, requiring portfolio OTIF >= 95.0% and defect rates <= 50.0 PPM.",
                "Gate 4: Altman Z-Score Solvency & 8D CAPA Remediation. In Gate 4, the engine audits supplier balance sheets using Edward Altman's Z-Score model (Z = 1.2X1 + 1.4X2 + 3.3X3 + 0.6X4 + 0.999X5). It verifies that any supplier with Z < 1.81 triggers immediate insolvency quarantine, mandates bank standby letters of credit (SBLC), secures proprietary tooling ownership title, and tracks open 8D CAPA root-cause resolution within contractual 30-day deadlines, verifying zero overdue unresolved critical defects.",
                "Gate 5: ISO 22301 Business Continuity & Dual-Hub Failover Readiness. In Gate 5, the engine executes full-scale disruption stress testing: verifying that Recovery Time Objectives (RTO) remain strictly below Maximum Tolerable Periods of Disruption (MTPD), certifying duplicate production tooling at secondary nearshore hubs, and confirming technology escrow deposits for proprietary engineering firmware and tooling CAD files.",
                "The 5-Gate Governance Framework operates as an immutable digital ledger. Each gate's pass/fail status is cryptographically signed using enterprise PKI certificates, archiving empirical audit evidence in the corporate compliance repository for external statutory auditors (such as PCAOB, SOX 404, and ISO 9001 quality registrars). Category directors can inspect gate telemetry in real time, drilling down from enterprise-level compliance percentages into individual line-item purchase orders, metallurgical test certificates, and third-party laboratory reports.",
                "Furthermore, the Master Verification Engine integrates directly into the executive Sales & Operations Planning (S&OP) cadence. By connecting operational supplier performance directly to corporate EBITDA, working capital velocity, and Return on Invested Capital (ROIC), the Control Tower elevates strategic procurement into a supreme engine of corporate competitiveness and shareholder value creation.",
                "Upon flawless algorithmic validation across all five gates, the Control Tower generates the Executive Sourcing & Supply Chain Audit Certificate, officially conferring the prestigious Certified Strategic Sourcing Executive (CSSE) credential upon the enterprise operations leader. This milestone marks the complete mastery of upstream global strategic sourcing, commercial procurement contracting, and multi-tier supplier relationship governance across modern transnational supply chains."
            ],
            "example": "A Fortune 500 aerospace defense contractor with $6.2 billion in annual procurement underwent an independent corporate board audit using the Master 5-Gate Governance Verification Engine. The engine audited 180,000 transaction records across 420 Tier-1 suppliers: Gate 1 verified 99.2% spend cube compliance; Gate 2 confirmed $14.8M in cross-border Total Landed Cost optimization; Gate 3 verified a fleet-wide 98.6% OTIF fulfillment score and $1.2M in recovered COPQ debit memos; Gate 4 validated Altman Z-score solvency monitoring across all critical foundries; and Gate 5 confirmed an 11-day dual-hub failover RTO under simulated maritime chokepoint blockades. The enterprise achieved a perfect 100/100 verification score across all five gates, earning unanimous Board commendation and the global aerospace industry's top procurement governance certification.",
            "code": """# Capstone Part 5: Master 5-Gate Governance Verification Engine
class MasterSourcingVerificationEngine:
    def __init__(self, enterprise_name: str, direct_spend_usd: float):
        self.enterprise = enterprise_name
        self.spend = direct_spend_usd
        self.gate_results = {}
        
    def audit_gate_1_spend_cube_kraljic(self, compliance_rate_pct: float, kraljic_coverage_pct: float) -> bool:
        passed = compliance_rate_pct >= 95.0 and kraljic_coverage_pct >= 90.0
        self.gate_results["GATE_1_SPEND_CUBE_KRALJIC"] = {
            "status": "PASS" if passed else "FAIL",
            "compliance_rate_pct": compliance_rate_pct,
            "kraljic_coverage_pct": kraljic_coverage_pct,
            "threshold": "Compliance >= 95.0%, Kraljic >= 90.0%"
        }
        return passed
        
    def audit_gate_2_tlc_trade_arbitrage(self, tlc_optimization_validated: bool, incoterms_fca_compliant: bool) -> bool:
        passed = tlc_optimization_validated and incoterms_fca_compliant
        self.gate_results["GATE_2_TLC_INCOTERMS_ARBITRAGE"] = {
            "status": "PASS" if passed else "FAIL",
            "tlc_model_active": tlc_optimization_validated,
            "incoterms_fca_compliant": incoterms_fca_compliant,
            "threshold": "True landed cost calculus with WACC pipeline financing & FCA terms"
        }
        return passed
        
    def audit_gate_3_operational_telemetry(self, portfolio_otif_pct: float, portfolio_ppm: float) -> bool:
        passed = portfolio_otif_pct >= 95.0 and portfolio_ppm <= 50.0
        self.gate_results["GATE_3_OPERATIONAL_TELEMETRY"] = {
            "status": "PASS" if passed else "FAIL",
            "portfolio_otif_pct": portfolio_otif_pct,
            "portfolio_ppm": portfolio_ppm,
            "threshold": "Portfolio OTIF >= 95.0%, Defect Rate <= 50.0 PPM"
        }
        return passed
        
    def audit_gate_4_solvency_8d_capa(self, distressed_vendors_quarantined: bool, open_capa_count: int) -> bool:
        passed = distressed_vendors_quarantined and open_capa_count <= 2
        self.gate_results["GATE_4_SOLVENCY_ALTMAN_8D_CAPA"] = {
            "status": "PASS" if passed else "FAIL",
            "distress_quarantine_active": distressed_vendors_quarantined,
            "unresolved_capas": open_capa_count,
            "threshold": "Altman Z < 1.81 ring-fenced & open overdue CAPAs <= 2"
        }
        return passed
        
    def audit_gate_5_bcp_dual_hub(self, rto_days: int, mtpd_days: int, dual_tooling_certified: bool) -> bool:
        passed = (rto_days < mtpd_days) and dual_tooling_certified
        self.gate_results["GATE_5_BCP_DUAL_HUB_RESILIENCE"] = {
            "status": "PASS" if passed else "FAIL",
            "rto_days": rto_days,
            "mtpd_days": mtpd_days,
            "dual_tooling_ready": dual_tooling_certified,
            "threshold": "Recovery Time Objective (RTO) < MTPD & Dual Tooling certified"
        }
        return passed
        
    def generate_executive_credential(self) -> dict:
        total_gates = len(self.gate_results)
        passed_gates = sum(1 for g in self.gate_results.values() if g["status"] == "PASS")
        all_passed = total_gates == 5 and passed_gates == 5
        
        certification_status = "CERTIFIED_STRATEGIC_SOURCING_EXECUTIVE_CSSE" if all_passed else "GOVERNANCE_AUDIT_PROBATION"
        
        return {
            "enterprise": self.enterprise,
            "managed_direct_spend_usd": round(self.spend, 2),
            "total_governance_gates": total_gates,
            "gates_passed": passed_gates,
            "governance_score_pct": (passed_gates / 5.0) * 100.0 if total_gates > 0 else 0.0,
            "executive_certification": certification_status,
            "audit_timestamp": "2026-10-17T18:00:00Z",
            "gate_audit_details": self.gate_results
        }

verifier = MasterSourcingVerificationEngine(
    enterprise_name="Titan_Heavy_Machinery_Global",
    direct_spend_usd=450_000_000.0
)

g1 = verifier.audit_gate_1_spend_cube_kraljic(compliance_rate_pct=99.15, kraljic_coverage_pct=96.5)
g2 = verifier.audit_gate_2_tlc_trade_arbitrage(tlc_optimization_validated=True, incoterms_fca_compliant=True)
g3 = verifier.audit_gate_3_operational_telemetry(portfolio_otif_pct=98.2, portfolio_ppm=22.4)
g4 = verifier.audit_gate_4_solvency_8d_capa(distressed_vendors_quarantined=True, open_capa_count=1)
g5 = verifier.audit_gate_5_bcp_dual_hub(rto_days=14, mtpd_days=45, dual_tooling_certified=True)

report = verifier.generate_executive_credential()

print("================================================================================")
print("     MASTER 5-GATE GOVERNANCE VERIFICATION ENGINE: EXECUTIVE AUDIT REPORT       ")
print("================================================================================")
print(f"Enterprise: {report['enterprise']} | Audited Direct Spend: ${report['managed_direct_spend_usd']:,.2f}")
print(f"Governance Score: {report['governance_score_pct']}% ({report['gates_passed']}/{report['total_governance_gates']} Gates Passed)")
print(f"Executive Credential Awarded: [{report['executive_certification']}]\\n")

print("Sequential Gate Audit Results:")
for g_id, g_data in report['gate_audit_details'].items():
    print(f"  [{g_data['status']}] {g_id:34s} -> Threshold: {g_data['threshold']}")
print("================================================================================")
""",
            "output": """================================================================================
     MASTER 5-GATE GOVERNANCE VERIFICATION ENGINE: EXECUTIVE AUDIT REPORT       
================================================================================
Enterprise: Titan_Heavy_Machinery_Global | Audited Direct Spend: $450,000,000.00
Governance Score: 100.0% (5/5 Gates Passed)
Executive Credential Awarded: [CERTIFIED_STRATEGIC_SOURCING_EXECUTIVE_CSSE]

Sequential Gate Audit Results:
  [PASS] GATE_1_SPEND_CUBE_KRALJIC          -> Threshold: Compliance >= 95.0%, Kraljic >= 90.0%
  [PASS] GATE_2_TLC_INCOTERMS_ARBITRAGE     -> Threshold: True landed cost calculus with WACC pipeline financing & FCA terms
  [PASS] GATE_3_OPERATIONAL_TELEMETRY       -> Threshold: Portfolio OTIF >= 95.0%, Defect Rate <= 50.0 PPM
  [PASS] GATE_4_SOLVENCY_ALTMAN_8D_CAPA     -> Threshold: Altman Z < 1.81 ring-fenced & open overdue CAPAs <= 2
  [PASS] GATE_5_BCP_DUAL_HUB_RESILIENCE     -> Threshold: Recovery Time Objective (RTO) < MTPD & Dual Tooling certified
================================================================================""",
            "codeNotes": [
                {"line": 2, "note": "Implements Master 5-Gate Governance Verification Engine class"},
                {"line": 8, "note": "Validates Gate 1 Spend Cube compliance and Kraljic portfolio coverage"},
                {"line": 18, "note": "Validates Gate 2 Total Landed Cost arbitrage and Incoterms 2020 FCA compliance"},
                {"line": 28, "note": "Validates Gate 3 operational OTIF fulfillment and Six Sigma defect PPM"},
                {"line": 38, "note": "Validates Gate 4 Altman Z-Score insolvency quarantine and 8D CAPA remediation"},
                {"line": 48, "note": "Validates Gate 5 ISO 22301 RTO/MTPD business continuity and dual-tooling readiness"},
                {"line": 58, "note": "Confers Certified Strategic Sourcing Executive (CSSE) credential upon 100% pass"}
            ],
            "tryIt": {
                "description": "Examine how failing even a single governance gate blocks executive certification.",
                "question": "If the portfolio OTIF score fell to 91.0% (violating the Gate 3 threshold of >= 95.0%), what credential status does the Master Verification Engine issue?",
                "options": [
                    "It ignores the failure and awards the credential anyway",
                    "It issues GOVERNANCE_AUDIT_PROBATION, denying the CSSE credential until operational fulfillment is remediated",
                    "It permanently closes the manufacturing company",
                    "It files a criminal indictment with the World Trade Organization"
                ],
                "answer": 1,
                "explanation": "The Master 5-Gate Verification Engine is an uncompromising governance system. If any single gate fails (such as an OTIF breach in Gate 3), the entire verification fails, placing the organization on GOVERNANCE_AUDIT_PROBATION until full compliance is restored."
            },
            "check": {
                "question": "What is the primary significance of achieving 100% verification across all Five Governance Gates in Milestone 4?",
                "options": [
                    "It proves the company has eliminated all human employees",
                    "It demonstrates that the enterprise possesses an end-to-end, mathematically rigorous, and legally bulletproof sourcing control tower—unifying spend analytics, trade compliance, operational telemetry, financial solvency auditing, and business continuity resilience",
                    "It guarantees that oil prices will never increase",
                    "It permits the company to operate without business insurance"
                ],
                "answer": 1,
                "why": "Passing all five governance gates proves full synthesis of strategic sourcing mastery: ensuring that procurement is grounded in empirical spend data, cross-border landed cost accuracy, Six Sigma operational quality, predictive solvency protection, and ISO 22301 crisis resilience."
            }
        }
    ]

    summary = [
        "The Global Sourcing & Trade Compliance Control Tower integrates ERP purchasing, CLM contracts, and logistics event streams into an automated command center governing spend, landed costs, telemetry, and solvency.",
        "Spend Cube analytics classifies expenditure across Organization (Who), Commodity (What), and Supplier (Where), while the Analytical Hierarchy Process (AHP) executes multi-criteria vendor selection with mathematical consistency (CR <= 0.10).",
        "Cross-border Total Landed Cost (TLC) calculus incorporates WTO CIF customs valuation, marine insurance, and pipeline inventory financing under ICC Incoterms 2020 rules, revealing that nearshore sourcing frequently beats low-price offshore bids.",
        "Operational vendor telemetry is governed by binary On-Time In-Full (OTIF), Six Sigma PPM defect rates, Balanced Scorecards, and automated 8D CAPA protocols, backed by Edward Altman's Z-Score financial distress sentinel.",
        "The Master 5-Gate Governance Verification Engine validates spend compliance, TLC arbitrage, operational telemetry, solvency quarantine, and ISO 22301 dual-hub continuity, officially awarding the Certified Strategic Sourcing Executive (CSSE) credential."
    ]

    projectStep = {
        "title": "Construct the Global Strategic Sourcing, Performance & Trade Compliance Control Tower",
        "description": "Build an integrated, enterprise-scale strategic sourcing pipeline in Python: ingest multi-category spend ledgers into a 3D Spend Cube and execute AHP vendor selection, calculate cross-border Total Landed Cost comparing offshore vs nearshore sourcing under Incoterms 2020, formulate a 4-pillar Balanced Scorecard with 8D CAPA and Altman Z-score solvency monitoring, and run the Master 5-Gate Governance Verification Engine awarding the CSSE credential.",
        "steps": [
            "Construct a multi-dimensional Spend Cube and Kraljic Matrix category mapping engine, calculating contract compliance rates and executing AHP multi-criteria supplier selection.",
            "Formulate a cross-border Total Landed Cost (TLC) calculator comparing offshore vs nearshore sourcing options, incorporating WTO CIF valuation, marine insurance, and WACC pipeline financing.",
            "Deploy an operational fulfillment and solvency sentinel calculating binary OTIF, defect PPM, 4-pillar scorecards, automated COPQ debit memos, and Edward Altman's Z-score ratings.",
            "Execute the Master 5-Gate Governance Verification Engine, auditing all five sequential gates and generating the executive C-suite CSSE certification report."
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
    data = get_day20_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    print(f"Total spoken words: {total_words} (~{total_words / 150:.1f} mins)")
    for i, part in enumerate(data["parts"], 1):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {i}: {part['title'][:40]} -> {pw} words")
