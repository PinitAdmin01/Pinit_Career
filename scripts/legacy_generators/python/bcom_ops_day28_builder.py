import sys
import json
import hashlib

def get_day28_data() -> dict:
    day = 28
    title = "Sustainable Procurement & Scope 3 Auditing: Carbon & EUDR Deforestation Compliance"
    goal = "Embed environmental stewardship, regulatory compliance, and ethical governance across global supplier networks by auditing Scope 3 value chain greenhouse gas (GHG) emissions under the GHG Protocol Corporate Standard, enforcing EU Deforestation Regulation (EUDR) polygonal GPS geolocation traceability, inspecting Conflict Minerals (3TG) compliance under Dodd-Frank Section 1502, and benchmarking suppliers with Supplier Ethical Data Exchange (Sedex SMETA) fair labor scorecards to ensure a 100% sustainable supply chain."
    minutes = 45
    recap = "On Day 27, we engineered antifragile supply chains through strategic dual-sourcing, China+1 diversification, and the Supply Chain Resilience Index. Today on Day 28, we confront the imperative of global sustainability, environmental compliance, and ethical human rights governance across multi-tier supplier networks."

    parts = [
        # Part 1: Scope 3 Value Chain Greenhouse Gas (GHG) Auditing & Carbon Accounting
        {
            "title": "Scope 3 Value Chain Greenhouse Gas (GHG) Auditing & Carbon Accounting",
            "say": [
                "Welcome to Day 28 of B.Com Operations, Logistics & Supply Chain Management. Over the past decade, corporate sustainability has evolved from an optional public relations branding exercise into a legally binding, board-level fiduciary and operational mandate. Global institutional investors managing trillions of dollars in assets, international carbon disclosure frameworks such as CDP (formerly Carbon Disclosure Project), and stringent statutory directives—such as the European Union Corporate Sustainability Due Diligence Directive (CSDDD) and Corporate Sustainability Reporting Directive (CSRD)—mandate that corporations measure, audit, and systematically decarbonize their entire environmental footprints.",
                "To structure enterprise carbon accounting, the global standard is the Greenhouse Gas Protocol (GHG Protocol) Corporate Accounting and Reporting Standard, developed jointly by the World Resources Institute (WRI) and the World Business Council for Sustainable Development (WBCSD). The GHG Protocol classifies emissions into three operational scopes: Scope 1 encompasses direct greenhouse gas emissions from company-owned or controlled physical operations (such as natural gas combustion in factory boilers, diesel burned in company-owned delivery fleets, and chemical process emissions); Scope 2 covers indirect greenhouse gas emissions associated with the generation of purchased electricity, steam, heating, and cooling consumed by the organization.",
                "However, the true operational battleground for chief procurement officers and logistics executives is Scope 3: Value Chain Greenhouse Gas Emissions. Scope 3 encompasses all other indirect emissions occurring across an enterprise's upstream and downstream value chain, spanning 15 distinct categories: Category 1 (Purchased Goods and Services); Category 2 (Capital Goods); Category 3 (Fuel- and Energy-Related Activities); Category 4 (Upstream Transportation and Distribution); Category 5 (Waste Generated in Operations); Category 6 (Business Travel); Category 7 (Employee Commuting); Category 8 (Upstream Leased Assets); Category 9 (Downstream Transportation and Distribution); Category 10 (Processing of Sold Products); Category 11 (Use of Sold Products); Category 12 (End-of-Life Treatment of Sold Products); Category 13 (Downstream Leased Assets); Category 14 (Franchises); and Category 15 (Investments).",
                "Across major manufacturing, retail, electronics, automotive, and consumer goods industries, Scope 3 accounts for an astounding 75% to 90% of an enterprise's total carbon footprint. A computer manufacturer, for example, emits only 5% of its emissions inside its own assembly plants (Scope 1 and 2); the remaining 95% originates from the raw silicon wafers, copper mining, injection-molded plastics, trans-Pacific air freight, and end-of-life recycling carried out by thousands of independent tier-1, tier-2, and tier-3 suppliers. An enterprise cannot achieve genuine net-zero status under the Science Based Targets initiative (SBTi) without aggressively decarbonizing its supply base.",
                "In carbon accounting methodology, procurement teams calculate emissions using either the Spend-Based Method or the Activity-Based (Supplier-Specific) Method. The spend-based method multiplies annual financial spend in a commodity category by industry-average environmentally extended input-output (EEIO) emission factors (expressed in kilograms of CO2 equivalent per dollar spent, \\(kgCO_2e / \\$\\)). While useful for initial baseline screening, spend-based accounting is blunt: spending $1 million on green recycled steel generates the same calculated carbon footprint as spending $1 million on dirty coal-fired blast furnace steel. Leading operations teams transition to activity-based carbon accounting, collecting primary supplier data—such as verified Environmental Product Declarations (EPDs), raw kilowatt-hours of renewable energy utilized, and mass balances—calculating actual kilograms of carbon per unit produced.",
                "To accelerate supplier decarbonization, corporations establish internal carbon pricing ($50 to $100 per metric ton of CO2e) incorporated into supplier procurement scorecards. In competitive vendor selections, a supplier with a higher raw purchase price but a significantly lower carbon footprint often wins the contract once internal carbon taxes and future European Carbon Border Adjustment Mechanism (CBAM) import levies are calculated.",
                "In this first part, we construct a Python-based Scope 3 Value Chain Carbon Accounting Engine. This system ingests multi-category supplier procurement data, calculates upstream emissions across Category 1 (Purchased Goods) and Category 4 (Upstream Transport), evaluates supplier carbon intensities, and benchmarks progress against SBTi decarbonization targets."
            ],
            "example": "A multinational sportswear brand headquartered in Beaverton, Oregon audited its global carbon footprint. While its corporate headquarters and retail stores generated 180,000 metric tons of CO2e annually (Scope 1 and 2), its global supply chain generated 7.2 million metric tons across Scope 3, with 68% concentrated in tier-2 textile dyeing mills in Southeast Asia. By deploying an activity-based carbon tracking platform, the brand collaborated with 45 primary textile mills to replace coal boilers with biomass energy and install rooftop solar panels. Over three years, the initiative abated 1.4 million metric tons of Scope 3 CO2e, lowering unit product carbon footprints by 22% and securing top-tier CDP Climate A-List ranking.",
            "code": """# Scope 3 Value Chain Greenhouse Gas (GHG) Accounting Engine
from typing import Dict, List, Any

def audit_scope3_value_chain_emissions(
    purchased_goods: List[Dict[str, Any]],
    upstream_logistics: List[Dict[str, Any]],
    internal_carbon_price_per_tonne: float = 75.0
) -> Dict[str, Any]:
    # Category 1: Purchased Goods and Services (kgCO2e)
    cat1_total_kg = 0.0
    for item in purchased_goods:
        volume = item["units_purchased"]
        # Supplier specific emission factor: kgCO2e per unit
        ef = item.get("supplier_emission_factor_kg_per_unit", 25.0)
        is_primary_data = item.get("verified_epd_available", False)
        # Apply 15% estimation uncertainty penalty if using generic spend-based factor
        penalty = 1.0 if is_primary_data else 1.15
        cat1_total_kg += (volume * ef * penalty)
        
    # Category 4: Upstream Transportation and Distribution (kgCO2e)
    # Emissions = tonne-km * modal emission factor (kgCO2e / tonne-km)
    cat4_total_kg = 0.0
    modal_factors = {
        "ocean_container": 0.015,  # kgCO2e / tonne-km
        "rail_freight": 0.028,
        "electric_truck": 0.035,
        "diesel_truck": 0.095,
        "air_freight": 0.602
    }
    
    for shipment in upstream_logistics:
        weight_tonnes = shipment["weight_tonnes"]
        distance_km = shipment["distance_km"]
        mode = shipment.get("transport_mode", "diesel_truck")
        factor = modal_factors.get(mode, 0.095)
        cat4_total_kg += (weight_tonnes * distance_km * factor)
        
    total_scope3_kg = cat1_total_kg + cat4_total_kg
    total_scope3_tonnes = total_scope3_kg / 1000.0
    carbon_tax_liability = total_scope3_tonnes * internal_carbon_price_per_tonne
    
    # Calculate Supplier Carbon Intensity (Scope 3 tonnes per $1M spend)
    total_spend = sum(item["units_purchased"] * item.get("unit_price_dollars", 100.0) for item in purchased_goods)
    carbon_intensity = (total_scope3_tonnes / (total_spend / 1_000_000.0)) if total_spend > 0 else 0.0
    
    return {
        "cat1_purchased_goods_tonnes": round(cat1_total_kg / 1000.0, 2),
        "cat4_upstream_transport_tonnes": round(cat4_total_kg / 1000.0, 2),
        "total_scope3_tonnes": round(total_scope3_tonnes, 2),
        "total_spend_dollars": round(total_spend, 2),
        "carbon_intensity_tonnes_per_million": round(carbon_intensity, 2),
        "internal_carbon_cost_dollars": round(carbon_tax_liability, 2),
        "sbti_alignment_status": "SBTi_NET_ZERO_ALIGNED" if carbon_intensity <= 120.0 else "EMISSIONS_REDUCTION_REQUIRED"
    }

# Execute Scope 3 Audit
procurement_batch = [
    {"commodity": "Forged Aluminum Chassis", "units_purchased": 50_000, "supplier_emission_factor_kg_per_unit": 18.2, "verified_epd_available": True, "unit_price_dollars": 120.0},
    {"commodity": "Recycled Polymer Housings", "units_purchased": 80_000, "supplier_emission_factor_kg_per_unit": 4.5, "verified_epd_available": True, "unit_price_dollars": 35.0},
    {"commodity": "Lithium Battery Cells", "units_purchased": 15_000, "supplier_emission_factor_kg_per_unit": 42.0, "verified_epd_available": False, "unit_price_dollars": 180.0}
]

logistics_movements = [
    {"shipment_id": "SH-01", "weight_tonnes": 450.0, "distance_km": 1200, "transport_mode": "rail_freight"},
    {"shipment_id": "SH-02", "weight_tonnes": 250.0, "distance_km": 600, "transport_mode": "electric_truck"},
    {"shipment_id": "SH-03", "weight_tonnes": 80.0, "distance_km": 8500, "transport_mode": "ocean_container"}
]

scope3_audit = audit_scope3_value_chain_emissions(procurement_batch, logistics_movements, internal_carbon_price_per_tonne=80.0)
print(f"Cat 1 Purchased Goods: {scope3_audit['cat1_purchased_goods_tonnes']:,} tCO2e")
print(f"Cat 4 Logistics: {scope3_audit['cat4_upstream_transport_tonnes']:,} tCO2e")
print(f"Total Scope 3: {scope3_audit['total_scope3_tonnes']:,} tCO2e")
print(f"Carbon Intensity: {scope3_audit['carbon_intensity_tonnes_per_million']} tonnes/$M spend")
print(f"Internal Carbon Cost: ${scope3_audit['internal_carbon_cost_dollars']:,.2f}")
print(f"Status: {scope3_audit['sbti_alignment_status']}")
""",
            "output": """Cat 1 Purchased Goods: 1,994.5 tCO2e
Cat 4 Logistics: 30.57 tCO2e
Total Scope 3: 2,025.07 tCO2e
Carbon Intensity: 176.09 tonnes/$M spend
Internal Carbon Cost: $162,005.60
Status: EMISSIONS_REDUCTION_REQUIRED""",
            "lineNotes": [
                {"line": 5, "note": "Implements GHG Protocol Scope 3 auditing across Category 1 (goods) and Category 4 (transport)."},
                {"line": 13, "note": "Applies primary verified EPD factors or penalizes unverified spend-based data with 15% uncertainty buffer."},
                {"line": 28, "note": "Evaluates multi-modal transportation carbon factors: ocean container (0.015) vs diesel truck (0.095)."}
            ],
            "tryIt": "Verify the high impact of transport modes: switch the ocean container shipment to 'air_freight' (factor 0.602) and observe the massive surge in logistics emissions.",
            "check": {
                "question": "Under the Greenhouse Gas Protocol Corporate Value Chain Standard, what percentage of an enterprise's total carbon footprint typically originates within Scope 3 emissions?",
                "options": [
                    "75% to 90% of total enterprise emissions",
                    "Less than 5% of emissions",
                    "Exactly 50% split with Scope 1",
                    "Zero emissions, because Scope 3 emissions are legally exempt from carbon accounting"
                ],
                "answer": 0,
                "why": "In most manufacturing, retail, and technology companies, the vast majority (75% to 90%) of carbon emissions occur in the upstream and downstream supply chain (Scope 3)."
            }
        },

        # Part 2: EU Deforestation Regulation (EUDR) Compliance & Satellite GPS Traceability
        {
            "title": "EU Deforestation Regulation (EUDR) Compliance & Satellite GPS Traceability",
            "say": [
                "While greenhouse gas accounting measures corporate climate impact, global statutory law is increasingly targeting direct environmental destruction and biodiversity loss. The most aggressive and operationally disruptive supply chain environmental legislation ever enacted is Regulation (EU) 2023/1115 of the European Parliament and of the Council, officially known as the European Union Deforestation Regulation (EUDR). Entering into legal enforcement, the EUDR fundamentally reshapes global commodity procurement and customs clearance across the European single market.",
                "The EUDR establishes a strict prohibition: relevant commodities and derived products cannot be placed on the EU market, made available on the EU market, or exported from the EU unless they fulfill three cumulative statutory conditions: 1. They are 'Deforestation-Free' (produced on land that has not been subjected to deforestation or forest degradation after the strict statutory cutoff date of December 31, 2020); 2. They have been produced in accordance with the relevant local legislation of the country of production (including land tenure rights, environmental protections, third-party labor rights, and free, prior, and informed consent from indigenous communities); and 3. They are covered by an approved Due Diligence Statement (DDS) submitted to the centralized EU Information System.",
                "The scope of the EUDR covers seven foundational agricultural and forestry commodities that historically drove global tropical deforestation: Cattle, Cocoa, Coffee, Oil Palm, Rubber, Soya, and Wood. Crucially, the regulation applies not only to the raw agricultural commodities, but also to an extensive list of derived intermediate and finished goods listed under Annex I, including leather upholstery, tires, printed paper, wooden furniture, chocolate, glycerol, palm oil derivatives, and animal feed.",
                "The core engineering mechanism that sets the EUDR apart from all previous certification schemes is mandatory, cryptographically verifiable Polygonal GPS Geolocation Traceability. General country-level or regional certificates of origin are completely invalid under the EUDR. Importers and operators must collect the exact geographic coordinates (latitude and longitude to at least six decimal places) of every single agricultural plot or forest concession where the commodity was harvested. For land parcels exceeding 4 hectares, operators must submit full polygonal boundary coordinates defining the exact perimeter of the plot.",
                "These polygonal GPS coordinates are uploaded into the EU Information System and cross-checked via automated algorithms against high-resolution satellite remote sensing imagery (such as the European Space Agency's Copernicus Sentinel satellites, NASA Landsat, and Global Forest Watch). If satellite tree cover analysis reveals that any canopy loss or forest clearing occurred within those polygon boundaries after December 31, 2020, customs authorities automatically impound the shipment. Non-compliant enterprises face severe administrative sanctions, including confiscation of goods, temporary bans from EU public procurement, and mandatory fines up to a minimum of 4% of total EU annual enterprise turnover.",
                "Under EUDR Article 29, the European Commission establishes a three-tier country benchmarking system categorizing producing nations as Low-Risk, Standard-Risk, or High-Risk based on national deforestation rates, expansion of agricultural land, and governance integrity. The risk tier dictates the statutory inspection frequency enforced by EU customs authorities: 1% of consignments for low-risk nations, 3% for standard-risk nations, and an intensive 9% of all imported shipments for high-risk nations. Sourcing from high-risk origins without pristine polygonal data guarantees catastrophic customs clearance bottlenecks.",
                "Furthermore, supply chain segregation is strictly enforced. Commodity operators cannot utilize 'Mass Balance' accounting where non-compliant deforested crops are mixed in bulk grain elevators or palm oil tankers with certified deforestation-free crops. The EUDR mandates strict Physical Identity Preservation: certified batches must remain physically segregated throughout harvesting, milling, storage, ocean transit, and factory processing, ensuring 100% biological and geographic chain-of-custody.",
                "In this part, we implement a Python-based EUDR Deforestation Traceability & Satellite Verification Auditor. This system validates polygonal GPS coordinate integrity, evaluates post-2020 satellite canopy loss overlays, verifies Due Diligence Statement prerequisites, and certifies shipments for lawful EU import clearance."
            ],
            "example": "A European confectionery manufacturer importing cocoa beans from Côte d'Ivoire and Ghana integrated satellite GPS traceability across 12,000 smallholder farms. Prior to shipping a 500-metric-ton container of fermented cocoa beans to the Port of Rotterdam, the company's automated EUDR audit platform screened the GPS polygons of the 350 supplying farms against Copernicus satellite tree cover change maps. The satellite overlay detected that 2 farms had expanded 1.5 hectares into protected forest reserves in 2022. The system automatically excised those two farms from the shipment batch, preserving full EUDR compliance for the remaining 99.4% of the volume and preventing customs seizure.",
            "code": """# EU Deforestation Regulation (EUDR) Traceability & Satellite Verification Auditor
from typing import Dict, List, Any

def verify_eudr_gps_geolocation_compliance(
    shipment_id: str,
    commodity: str,
    farm_plot_polygons: List[Dict[str, Any]],
    cutoff_date: str = "2020-12-31"
) -> Dict[str, Any]:
    valid_commodities = ["cattle", "cocoa", "coffee", "oil_palm", "rubber", "soya", "wood"]
    if commodity.lower() not in valid_commodities:
        raise ValueError(f"Commodity '{commodity}' not regulated under EUDR Annex I.")
        
    total_plots = len(farm_plot_polygons)
    compliant_plots = 0
    deforested_plots = []
    missing_gps_plots = []
    
    for plot in farm_plot_polygons:
        plot_id = plot["plot_id"]
        area_hectares = plot.get("area_hectares", 1.0)
        gps_coordinates = plot.get("gps_coordinates", [])
        satellite_canopy_loss_detected = plot.get("post_2020_forest_loss", False)
        
        # Validation 1: GPS Polygon Integrity (>= 4 points for plots > 4 ha, point GPS for <= 4 ha)
        is_polygon_valid = (
            len(gps_coordinates) >= 4 if area_hectares > 4.0 else len(gps_coordinates) >= 1
        )
        
        if not is_polygon_valid:
            missing_gps_plots.append(plot_id)
            continue
            
        # Validation 2: Deforestation-Free Satellite Check post Dec 31, 2020
        if satellite_canopy_loss_detected:
            deforested_plots.append(plot_id)
            continue
            
        compliant_plots += 1
        
    compliance_rate_pct = (compliant_plots / total_plots * 100.0) if total_plots > 0 else 0.0
    is_fully_compliant = (compliance_rate_pct == 100.0) and (total_plots > 0)
    
    return {
        "shipment_id": shipment_id,
        "regulated_commodity": commodity.upper(),
        "total_farm_plots_audited": total_plots,
        "compliant_plots_count": compliant_plots,
        "deforested_violating_plots": deforested_plots,
        "missing_gps_plots": missing_gps_plots,
        "compliance_rate_pct": round(compliance_rate_pct, 2),
        "is_eudr_cleared": is_fully_compliant,
        "due_diligence_statement_status": (
            "DDS_APPROVED_EU_CUSTOMS_CLEARANCE_PERMITTED"
            if is_fully_compliant
            else "DDS_REJECTED_CUSTOMS_IMPOUNDMENT_RISK"
        )
    }

# Execute EUDR Shipment Audit for Imported Cocoa
cocoa_plots = [
    {"plot_id": "PLOT-CIV-001", "area_hectares": 5.8, "gps_coordinates": [(5.324512, -4.123512), (5.324900, -4.123100), (5.324200, -4.122800), (5.323800, -4.123400)], "post_2020_forest_loss": False},
    {"plot_id": "PLOT-CIV-002", "area_hectares": 2.2, "gps_coordinates": [(5.331200, -4.115400)], "post_2020_forest_loss": False},
    {"plot_id": "PLOT-CIV-003", "area_hectares": 7.1, "gps_coordinates": [(5.345100, -4.102200), (5.345800, -4.101800), (5.344900, -4.101200), (5.344200, -4.101900)], "post_2020_forest_loss": False},
    {"plot_id": "PLOT-CIV-004", "area_hectares": 3.5, "gps_coordinates": [(5.319000, -4.138000)], "post_2020_forest_loss": False}
]

eudr_audit = verify_eudr_gps_geolocation_compliance("SHIP-COCOA-ROTTERDAM-2026", "cocoa", cocoa_plots)
print(f"Shipment: {eudr_audit['shipment_id']} ({eudr_audit['regulated_commodity']})")
print(f"Compliance Rate: {eudr_audit['compliance_rate_pct']}% ({eudr_audit['compliant_plots_count']}/{eudr_audit['total_farm_plots_audited']} plots)")
print(f"EUDR Clearance: {eudr_audit['is_eudr_cleared']}")
print(f"Status: {eudr_audit['due_diligence_statement_status']}")
""",
            "output": """Shipment: SHIP-COCOA-ROTTERDAM-2026 (COCOA)
Compliance Rate: 100.0% (4/4 plots)
EUDR Clearance: True
Status: DDS_APPROVED_EU_CUSTOMS_CLEARANCE_PERMITTED""",
            "lineNotes": [
                {"line": 5, "note": "Implements statutory verification for Regulation (EU) 2023/1115 (EUDR) across Annex I commodities."},
                {"line": 21, "note": "Enforces mandatory polygonal GPS coordinates (>= 4 points for parcels > 4 hectares)."},
                {"line": 28, "note": "Cross-references satellite canopy loss post-December 31, 2020 statutory cutoff date."}
            ],
            "tryIt": "Set post_2020_forest_loss=True on PLOT-CIV-003 and verify that the Due Diligence Statement is immediately rejected with customs impoundment risk.",
            "check": {
                "question": "Under the European Union Deforestation Regulation (EUDR), what is the statutory cutoff date after which products grown on deforested land are permanently prohibited from entry into the EU?",
                "options": [
                    "December 31, 2020",
                    "January 1, 2000",
                    "July 4, 2025",
                    "December 31, 2015"
                ],
                "answer": 0,
                "why": "The EUDR establishes December 31, 2020 as the absolute statutory cutoff date. Any agricultural or forestry plot subjected to deforestation after this date cannot lawfully supply the EU market."
            }
        },

        # Part 3: Conflict Minerals (3TG) Due Diligence & Responsible Sourcing Frameworks
        {
            "title": "Conflict Minerals (3TG) Due Diligence & Responsible Sourcing Frameworks",
            "say": [
                "Beyond carbon emissions and deforestation, sustainable procurement mandates absolute vigilance against financing armed conflict, human rights abuses, and modern slavery in upstream mineral extraction. The foundational statutory framework governing mineral supply chain ethics is Section 1502 of the Dodd-Frank Wall Street Reform and Consumer Protection Act in the United States, alongside the European Union Conflict Minerals Regulation (Regulation (EU) 2017/821) and the OECD Due Diligence Guidance for Responsible Supply Chains of Minerals from Conflict-Affected and High-Risk Areas (CAHRAs).",
                "These legal frameworks focus on four specific minerals collectively designated as '3TG': Tantalum, Tin, Tungsten, and Gold. 3TG minerals are indispensable enablers of modern technology: Tantalum is essential for high-capacitance electronic capacitors inside smartphones and laptops; Tin is required for printed circuit board solder pastes; Tungsten provides durability in vibrating motors, drill bits, and counterweights; and Gold provides corrosion-resistant plating across semiconductor wire bonds and electrical connectors. Historically, the extraction of these minerals in the Democratic Republic of the Congo (DRC) and adjoining Great Lakes nations of Africa financed violent rebel warlords, illicit trade networks, and forced labor.",
                "To comply with Dodd-Frank 1502 and SEC reporting rules, publicly traded corporations must conduct 'Reasonable Country of Origin Inquiries' (RCOI) and exercise multi-tier due diligence throughout their supply chains. The global standard for executing this due diligence is the 5-Step Due Diligence Framework established by the OECD: Step 1: Establish strong enterprise management systems; Step 2: Identify and assess risks in the supply chain; Step 3: Design and implement a strategy to respond to identified risks; Step 4: Carry out independent third-party audits of smelter/refiner due diligence practices; and Step 5: Report annually on supply chain due diligence in SEC Form SD filings.",
                "The primary data exchange tool used across the global electronics and manufacturing industries is the Conflict Minerals Reporting Template (CMRT), maintained by the Responsible Minerals Initiative (RMI). Every year, procurement departments issue CMRT requests to hundreds of tier-1 component suppliers. Tier-1 suppliers cascade these requests down to tier-2 subassembly makers, tier-3 parts fabricators, and ultimately to tier-4 smelters and refiners (SORs). Smelters and refiners represent the crucial 'pinch point' in the mineral supply chain: once ore is melted and refined into pure ingots, its geographic mine origin can no longer be physically detected via chemical assays.",
                "Therefore, due diligence hinges on validating whether the smelters identified in a supplier's CMRT are certified as conformant under the RMI Responsible Minerals Assurance Process (RMAP). RMAP conducts independent on-site audits of smelters to verify that all raw ore purchases are traceable to certified conflict-free mine sites and validated by the International Tin Supply Chain Initiative (ITSCI) bag-and-tag system. If a supplier's bill of materials traces to an active, non-conformant smelter operating in a conflict-affected area without RMAP certification, the enterprise must mandate immediate supplier disengagement or face public disclosure on SEC Form SD.",
                "The legal and commercial penalties for false conflict minerals reporting are severe. Under United States securities regulations, misrepresenting supply chain due diligence in annual SEC Form SD filings exposes corporate officers to direct personal liability under SEC Rule 10b-5 anti-fraud provisions. Furthermore, institutional ESG index funds and pension endowments automatically divest from corporations flagged for unresolved conflict minerals non-compliances, precipitating damaging stock valuation de-ratings.",
                "Furthermore, responsible sourcing frameworks are actively expanding beyond 3TG to encompass transition energy battery minerals, including Cobalt, Lithium, Nickel, and Mica, through extended reporting templates such as the Extended Minerals Reporting Template (EMRT), driven by ethical concerns over artisanal cobalt mining in central Africa.",
                "In this part, we implement a Python-based Conflict Minerals (3TG) CMRT Auditor. This system parses multi-tier supplier smelter lists, checks smelters against the global RMAP Conformant Smelter Database, calculates conflict-free sourcing percentages, and flags high-risk non-conformant smelters requiring executive supply chain remediation."
            ],
            "example": "A Tier-1 automotive electronics manufacturer in Munich integrating electronic control units (ECUs) surveyed its 42 tier-1 PCB and sensor suppliers using the RMI CMRT template. The survey identified 118 unique smelters across the 3TG minerals: 115 smelters were verified as RMAP conformant. However, 3 tantalum smelters identified in a capacitor supplier's bill of materials were flagged as uncertified facilities operating in eastern DRC. The automotive manufacturer issued an immediate corrective action request; the capacitor vendor transitioned its supply routing to an RMAP-certified tantalum smelter in Pennsylvania within 45 days, achieving 100% conflict-free compliance and submitting a clean SEC Form SD.",
            "code": """# Conflict Minerals (3TG) Due Diligence & RMAP Smelter Auditor
from typing import Dict, List, Any

def audit_conflict_minerals_cmrt(
    supplier_cmrt_data: List[Dict[str, Any]],
    rmap_conformant_smelter_cids: List[str]
) -> Dict[str, Any]:
    conformant_set = set(rmap_conformant_smelter_cids)
    smelter_evaluations = []
    non_conformant_count = 0
    total_smelters = 0
    
    for entry in supplier_cmrt_data:
        supplier_name = entry["supplier_name"]
        mineral = entry["mineral_3tg"].upper()
        smelter_id = entry["smelter_cid"]
        smelter_name = entry["smelter_name"]
        country = entry.get("smelter_country", "UNKNOWN")
        
        total_smelters += 1
        is_conformant = smelter_id in conformant_set
        
        if not is_conformant:
            non_conformant_count += 1
            
        smelter_evaluations.append({
            "supplier": supplier_name,
            "mineral": mineral,
            "smelter_cid": smelter_id,
            "smelter_name": smelter_name,
            "country": country,
            "is_rmap_conformant": is_conformant,
            "risk_status": "LOW_RISK_CONFORMANT" if is_conformant else "HIGH_RISK_NON_CONFORMANT_ESCALATION"
        })
        
    conformant_count = total_smelters - non_conformant_count
    conflict_free_rate_pct = (conformant_count / total_smelters * 100.0) if total_smelters > 0 else 100.0
    is_dodd_frank_compliant = non_conformant_count == 0
    
    return {
        "total_smelters_audited": total_smelters,
        "rmap_conformant_smelters": conformant_count,
        "non_conformant_smelters": non_conformant_count,
        "conflict_free_sourcing_pct": round(conflict_free_rate_pct, 2),
        "is_dodd_frank_1502_compliant": is_dodd_frank_compliant,
        "smelter_details": smelter_evaluations,
        "sec_form_sd_filing_status": (
            "DRC_CONFLICT_FREE_CERTIFIED"
            if is_dodd_frank_compliant
            else "UNDETERMINED_CONFLICT_RISK_ACTION_REQUIRED"
        )
    }

# Execute CMRT Smelter Audit
rmap_master_list = ["CID-TAN-0012", "CID-TIN-0045", "CID-TUN-0089", "CID-GLD-0102", "CID-TAN-0033"]

supplier_reports = [
    {"supplier_name": "Apex Microcircuits", "mineral_3tg": "Tantalum", "smelter_cid": "CID-TAN-0012", "smelter_name": "Cabot Performance Materials", "smelter_country": "USA"},
    {"supplier_name": "Apex Microcircuits", "mineral_3tg": "Tin", "smelter_cid": "CID-TIN-0045", "smelter_name": "PT Timah Tbk", "smelter_country": "Indonesia"},
    {"supplier_name": "Apex Microcircuits", "mineral_3tg": "Tungsten", "smelter_cid": "CID-TUN-0089", "smelter_name": "Wolfram Bergbau", "smelter_country": "Austria"},
    {"supplier_name": "Apex Microcircuits", "mineral_3tg": "Gold", "smelter_cid": "CID-GLD-0102", "smelter_name": "Metalor Technologies", "smelter_country": "Switzerland"}
]

cmrt_audit = audit_conflict_minerals_cmrt(supplier_reports, rmap_master_list)
print(f"Total Smelters: {cmrt_audit['total_smelters_audited']} | Conformant: {cmrt_audit['rmap_conformant_smelters']}")
print(f"Conflict-Free Rate: {cmrt_audit['conflict_free_sourcing_pct']}%")
print(f"Dodd-Frank 1502 Compliant: {cmrt_audit['is_dodd_frank_1502_compliant']}")
print(f"SEC Filing Status: {cmrt_audit['sec_form_sd_filing_status']}")
""",
            "output": """Total Smelters: 4 | Conformant: 4
Conflict-Free Rate: 100.0%
Dodd-Frank 1502 Compliant: True
SEC Filing Status: DRC_CONFLICT_FREE_CERTIFIED""",
            "lineNotes": [
                {"line": 5, "note": "Implements OECD Due Diligence Step 4 validating smelters against the RMI RMAP conformant database."},
                {"line": 15, "note": "Cross-checks smelter identification codes (CIDs) to isolate uncertified smelters in supply chains."},
                {"line": 28, "note": "Calculates conflict-free sourcing rate and certifies SEC Form SD 'DRC Conflict Free' status."}
            ],
            "tryIt": "Add an uncertified smelter (CID-TAN-9999) from an unregulated artisanal site and observe how SEC filing status shifts to action required.",
            "check": {
                "question": "Which four minerals are classified as '3TG' under Section 1502 of the Dodd-Frank Act and international conflict minerals due diligence regulations?",
                "options": [
                    "Tantalum, Tin, Tungsten, and Gold",
                    "Titanium, Tellurium, Terbium, and Germanium",
                    "Copper, Nickel, Lithium, and Cobalt",
                    "Steel, Aluminum, Plastic, and Carbon Fiber"
                ],
                "answer": 0,
                "why": "The 3TG conflict minerals explicitly covered by Dodd-Frank 1502 and EU Regulation 2017/821 are Tantalum, Tin, Tungsten, and Gold."
            }
        },

        # Part 4: Supplier Ethical Data Exchange (Sedex SMETA) & Fair Labor Auditing
        {
            "title": "Supplier Ethical Data Exchange (Sedex SMETA) & Fair Labor Auditing",
            "say": [
                "The fourth foundational pillar of sustainable procurement is human rights, labor ethics, and worker welfare. In an era of instant global social media scrutiny, investigative journalism, and stringent legislation—such as the United States Uyghur Forced Labor Prevention Act (UFLPA) and the German Supply Chain Due Diligence Act (Lieferkettensorgfaltspflichtengesetz, LkSG)—corporate leadership is held strictly liable for human rights abuses occurring within their multi-tier supply networks. An enterprise that turns a blind eye to child labor, debt bondage, forced overtime, or unsafe sweatshop working conditions faces devastating brand destruction, import shipment detentions by customs authorities, and severe criminal liability.",
                "To conduct standardized, credible, and globally recognized social compliance auditing, multi-national corporations rely on Sedex (Supplier Ethical Data Exchange) and its auditing methodology: SMETA (Sedex Members Ethical Trade Audit). SMETA is one of the world's most widely utilized social audit formats, governed by the Ethical Trading Initiative (ETI) Base Code and founded on International Labour Organization (ILO) Core Conventions.",
                "SMETA audits are conducted by accredited third-party auditing firms across either a 2-Pillar or 4-Pillar scope. The 4-Pillar SMETA audit evaluates: Pillar 1: Labor Standards; Pillar 2: Health and Safety; Pillar 3: Environmental Management; and Pillar 4: Business Ethics. Qualified lead social auditors visit supplier manufacturing facilities unannounced, conducting extensive confidential worker interviews, inspecting payroll records and biometric time-clock data, inspecting chemical storage and fire exit routes, and reviewing management policies.",
                "In social compliance governance, audit findings are classified into a hierarchy of severity: 1. Zero-Tolerance Non-Conformances (Critical Human Rights Violations): Direct evidence of Child Labor (workers under local statutory age or ILO Convention 138 minimums), Forced or Bonded Labor (withholding workers' passports, charging exorbitant recruitment fees, or restricting physical movement), Extreme Physical Safety Hazards (locked emergency fire exits or structural building collapse risks), or Severe Physical Abuse. A zero-tolerance finding triggers immediate executive escalation, production freezes, and mandatory remediation. 2. Critical Non-Conformances: Systematic violations such as failure to pay legal minimum wages, severe overtime violations (working hours exceeding 60 hours per week), or lack of worker grievance channels. 3. Minor Non-Conformances: Isolated administrative record-keeping oversights.",
                "To eliminate child labor permanently, sustainable procurement mandates a strict 'Child Labor Remediation Protocol'. Merely firing an underage child worker is unacceptable and harmful; it often pushes the vulnerable child into more dangerous informal exploitation. Instead, accredited brands require the factory to fund the child's continued formal schooling, pay a monthly stipend equal to their previous wage until they reach legal working age, and guarantee employment upon completing their education.",
                "Furthermore, under laws like the UFLPA, customs agencies enforce a statutory 'Rebuttable Presumption': any goods manufactured in whole or in part within designated high-risk regions are presumed to be made with forced labor and are barred from customs entry unless the importer proves by clear and convincing evidence that no forced labor was used across any tier of the supply chain. Maintaining audited Sedex SMETA scorecards and verified worker grievance records is vital to satisfying customs rebuttable presumption audits.",
                "In addition, contemporary supply chain human rights governance deploys digital 'Worker Voice' mobile applications. Workers on factory assembly lines can anonymously report wage theft, supervisor intimidation, or locked fire escapes via encrypted smartphone apps in their native language directly to the buying enterprise's compliance office. This continuous, ground-level feedback loop bypasses coached management interviews during scheduled audits, providing unfiltered real-time social telemetry.",
                "In this part, we implement a Python-based Supplier Fair Labor & SMETA Audit Evaluator. This system analyzes social compliance audit records, enforces absolute zero-tolerance human rights filters, scores labor standards, and calculates overall supplier ethical governance maturity."
            ],
            "example": "A global sports apparel conglomerate sourced athletic footwear from an industrial sewing facility in Central Java, Indonesia. During a 4-Pillar unannounced SMETA audit, third-party auditors verified that all 2,400 workers were above legal minimum working age (zero child labor) and held their own identity documents. However, auditors identified that 40 workers had logged 66 hours in a single week during peak production (exceeding the 60-hour ETI Base Code weekly limit). The plant initiated an 8D CAPA, hired 80 additional cross-trained machine operators, and adjusted production line balancing. Within 60 days, overtime compliance reached 100%, securing top-tier Sedex social compliance approval.",
            "code": """# Supplier Ethical Data Exchange (Sedex SMETA) & Fair Labor Auditor
from typing import Dict, List, Any

def evaluate_supplier_fair_labor_scorecard(
    audit_data: Dict[str, Any]
) -> Dict[str, Any]:
    supplier_name = audit_data["supplier_name"]
    facility_id = audit_data["facility_id"]
    
    # 1. Zero-Tolerance Invariants (Mandatory Immediate Disqualification)
    child_labor_detected = audit_data.get("child_labor_detected", False)
    forced_bonded_labor_detected = audit_data.get("forced_or_bonded_labor", False)
    passports_withheld = audit_data.get("identity_documents_withheld", False)
    locked_emergency_exits = audit_data.get("locked_emergency_fire_exits", False)
    
    has_zero_tolerance_violation = (
        child_labor_detected or forced_bonded_labor_detected or 
        passports_withheld or locked_emergency_exits
    )
    
    # 2. Quantitative Labor Standard Scores (0 - 100)
    wages_and_benefits_score = audit_data.get("wages_and_benefits_score", 0.0)
    working_hours_compliance_score = audit_data.get("working_hours_compliance_score", 0.0)
    health_and_safety_score = audit_data.get("health_safety_score", 0.0)
    worker_grievance_channel_score = audit_data.get("grievance_mechanisms_score", 0.0)
    
    labor_standards_composite = (
        wages_and_benefits_score * 0.30 +
        working_hours_compliance_score * 0.25 +
        health_and_safety_score * 0.25 +
        worker_grievance_channel_score * 0.20
    )
    
    is_fair_labor_certified = (not has_zero_tolerance_violation) and (labor_standards_composite >= 80.0)
    
    if has_zero_tolerance_violation:
        labor_status = "ZERO_TOLERANCE_HUMAN_RIGHTS_VIOLATION_DISQUALIFIED"
    elif not is_fair_labor_certified:
        labor_status = "LABOR_STANDARDS_SUB_BENCHMARK_REMEDIATION_REQUIRED"
    else:
        labor_status = "SEDEX_SMETA_FAIR_LABOR_STANDARDS_CERTIFIED"
        
    return {
        "supplier_name": supplier_name,
        "facility_id": facility_id,
        "zero_tolerance_violation": has_zero_tolerance_violation,
        "zero_child_labor_certified": not child_labor_detected,
        "zero_forced_labor_certified": not forced_bonded_labor_detected,
        "labor_standards_score": round(labor_standards_composite, 1),
        "is_fair_labor_certified": is_fair_labor_certified,
        "labor_audit_status": labor_status
    }

# Execute Fair Labor SMETA Audit
plant_audit = {
    "supplier_name": "Surabaya Precision Textiles & Garments",
    "facility_id": "FAC-IDN-TEXTILE-04",
    "child_labor_detected": False,
    "forced_or_bonded_labor": False,
    "identity_documents_withheld": False,
    "locked_emergency_fire_exits": False,
    "wages_and_benefits_score": 92.0,
    "working_hours_compliance_score": 86.0,
    "health_safety_score": 90.0,
    "grievance_mechanisms_score": 88.0
}

labor_eval = evaluate_supplier_fair_labor_scorecard(plant_audit)
print(f"Supplier: {labor_eval['supplier_name']}")
print(f"Zero-Tolerance Violation: {labor_eval['zero_tolerance_violation']}")
print(f"Zero Child Labor: {labor_eval['zero_child_labor_certified']}")
print(f"Labor Standards Score: {labor_eval['labor_standards_score']}/100")
print(f"Fair Labor Certified: {labor_eval['is_fair_labor_certified']}")
print(f"Status: {labor_eval['labor_audit_status']}")
""",
            "output": """Supplier: Surabaya Precision Textiles & Garments
Zero-Tolerance Violation: False
Zero Child Labor: True
Labor Standards Score: 89.2/100
Fair Labor Certified: True
Status: SEDEX_SMETA_FAIR_LABOR_STANDARDS_CERTIFIED""",
            "lineNotes": [
                {"line": 5, "note": "Audits 4-Pillar Sedex SMETA social compliance and ILO Core Conventions."},
                {"line": 10, "note": "Filters absolute zero-tolerance human rights violations: child labor, debt bondage, and locked exits."},
                {"line": 23, "note": "Calculates weighted composite score across wages, working hours, safety, and worker grievance channels."}
            ],
            "tryIt": "Set child_labor_detected=True and observe that the supplier is instantly disqualified regardless of high wages or other scores.",
            "check": {
                "question": "What is the immediate procedural consequence of detecting direct child labor or forced labor during an unannounced Sedex SMETA audit?",
                "options": [
                    "Immediate classification as a Zero-Tolerance Violation, triggering automatic commercial disqualification and mandatory remediation protocols",
                    "A harmless recommendation to print new employee handbook brochures",
                    "A 10% cash discount on the supplier's next invoice",
                    "Nothing, because social compliance audits only measure electricity consumption"
                ],
                "answer": 0,
                "why": "Child labor and forced labor are absolute zero-tolerance violations under SMETA and international law, resulting in immediate supplier disqualification and remediation."
            }
        },

        # Part 5: Executive Synthesis: The Master Sustainable Procurement & Scope 3 ESG Auditor
        {
            "title": "Executive Synthesis: The Master Sustainable Procurement & Scope 3 ESG Auditor",
            "say": [
                "We now culminate Day 28 with an executive synthesis of the complete sustainable procurement, Scope 3 decarbonization, and statutory human rights architecture. In today's interconnected global economy, sustainability is no longer an ancillary public relations initiative; it is an existential operational requirement that directly impacts access to global markets, debt capital costs, customs clearance velocity, and enterprise reputation. Corporate boards and C-suite leadership must govern their supply chains with verifiable empirical evidence.",
                "The Master Sustainable Procurement & Scope 3 ESG Auditor unifies the four operational pillars developed throughout today's master class: Pillar 1: Scope 3 Value Chain Greenhouse Gas Auditing (GHG Protocol Category 1 and Category 4 carbon accounting and SBTi net-zero alignment); Pillar 2: European Union Deforestation Regulation Compliance (polygonal satellite GPS traceability and Due Diligence Statements under Regulation (EU) 2023/1115); Pillar 3: Conflict Minerals Due Diligence (3TG RMI RMAP smelter verification under Dodd-Frank Section 1502); and Pillar 4: Sedex SMETA Fair Labor Standards (strict zero-tolerance human rights protection and ILO Core Convention compliance).",
                "To satisfy enterprise procurement standards and match automated ERP governance, our scorecard exposes the deterministic audit function: `audit_sustainable_procurement(supplier_esg_score, has_eudr_gps_traceability, zero_child_labor_certified)`. Under statutory sustainability rules, a supplier is certified as sustainable and approved for enterprise procurement if and only if three cumulative conditions are met: First, `supplier_esg_score >= 80`; Second, `has_eudr_gps_traceability == True`; and Third, `zero_child_labor_certified == True`.",
                "When all three conditions evaluate to true, the engine issues the official corporate accreditation status: `'SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED'`. Conversely, if any condition fails—whether due to an ESG score below 80, missing satellite GPS plot data, or unverified labor certification—the supplier is categorized as `'ESG_SUPPLY_CHAIN_DEFICIT'`, automatically halting purchasing purchase order releases in the enterprise ERP.",
                "Furthermore, enterprises that operationalize this comprehensive ESG architecture gain immense competitive advantages under emerging cross-border carbon border adjustment mechanisms, such as the EU CBAM. Importers demonstrating verified primary carbon data and zero-deforestation compliance avoid punitive customs tariffs, while unverified competitors face severe financial penalties and port impoundments.",
                "In global financial markets, sustainable supply chains command premium credit ratings and preferential green financing terms. Commercial banks and sovereign wealth funds offer lower interest rate margins on supply chain trade finance facilities (Sustainability-Linked Supply Chain Finance) when suppliers meet verified ESG thresholds, directly lowering working capital financing costs across the entire supply ecosystem.",
                "Corporate compensation committees increasingly tie senior executive long-term incentive plans (LTIP) directly to audited Scope 3 carbon reduction and sustainable supplier compliance percentages. When chief procurement officers and operations vice presidents have 20% of their annual bonus equity compensation anchored to achieving 100% sustainable supplier certification, sustainability shifts from a compliance checkbox into a relentlessly optimized operational KPI.",
                "Finally, enterprise platforms such as SAP Ariba, Coupa, and EcoVadis integrate these audit rules into straight-through procurement workflows. If a supplier's annual SMETA audit expires or their EUDR polygonal boundary data fails satellite verification, the ERP automatically blocks the generation of automated release purchase orders, eliminating compliance risk at the transactional level.",
                "In parallel, international capital markets and ESG rating agencies—such as MSCI ESG Research, Morningstar Sustainalytics, and S&P Global Corporate Sustainability Assessment (CSA)—penalize corporations that exhibit weak value chain transparency. Enterprises that fail to verify their tier-1 and tier-2 suppliers risk severe ESG score downgrades, disqualifying their equity shares and corporate green bonds from European Article 8 and Article 9 sustainable investment funds governed by the Sustainable Finance Disclosure Regulation (SFDR). Maintaining automated, auditable ESG supplier scorecards directly safeguards multi-billion dollar institutional investment inflows.",
                "To eliminate the risk of corporate 'greenwashing' under the European Union Green Claims Directive and statutory anti-deception mandates, all supplier ESG declarations, satellite polygon proofs, and carbon EPDs must be stored with immutable cryptographic audit trails. By anchoring supplier certifications with cryptographic SHA-256 digests and timestamped proof-of-due-diligence, corporations can defend their environmental and ethical claims with unassailable empirical integrity during regulatory customs inspections and stakeholder audits.",
                "In this final part, we construct and execute the Master Sustainable Procurement & Scope 3 ESG Auditor. We verify deterministic mathematical invariants, confirm certification logic, and establish the sovereign baseline for sustainable global operations."
            ],
            "example": "A Fortune 500 global food and beverage conglomerate audited its $1.8 billion agricultural commodities supply chain. Out of 450 global suppliers, 380 met all criteria immediately. However, 70 suppliers were initially flagged with an 'ESG_SUPPLY_CHAIN_DEFICIT' due to missing EUDR farm plot polygons in West Africa or ESG scores below 80. Utilizing the master audit platform, executive procurement deployed satellite GIS mapping tools and supported suppliers in closing energy efficiency gaps. Within nine months, all 70 suppliers achieved verified compliance, earning 100% 'SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED' accreditation and shielding the corporation from European customs sanctions.",
            "code": """# Master Sustainable Procurement & Scope 3 ESG Auditor
from typing import Dict, Any

def audit_sustainable_procurement(
    supplier_esg_score: float,
    has_eudr_gps_traceability: bool,
    zero_child_labor_certified: bool
) -> Dict[str, Any]:
    # Exact statutory certification condition: esgScore >= 80, gpsTraceable == True, laborCert == True
    is_sustainable = (supplier_esg_score >= 80.0) and has_eudr_gps_traceability and zero_child_labor_certified
    
    status = (
        "SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED"
        if is_sustainable
        else "ESG_SUPPLY_CHAIN_DEFICIT"
    )
    
    return {
        "supplierEsgScore": float(supplier_esg_score),
        "eudrGpsTraceable": bool(has_eudr_gps_traceability),
        "fairLaborCertified": bool(zero_child_labor_certified),
        "isSustainableProcurementCertified": is_sustainable,
        "status": status
    }

class MasterSustainableProcurementOrchestrator:
    def __init__(self, enterprise_name: str, program_id: str):
        self.enterprise_name = enterprise_name
        self.program_id = program_id

    def execute_supplier_certification_audit(
        self,
        supplier_id: str,
        supplier_name: str,
        esg_score: float,
        has_gps_traceability: bool,
        zero_child_labor: bool
    ) -> Dict[str, Any]:
        audit_result = audit_sustainable_procurement(esg_score, has_gps_traceability, zero_child_labor)
        return {
            "enterprise": self.enterprise_name,
            "program_id": self.program_id,
            "supplier_id": supplier_id,
            "supplier_name": supplier_name,
            "esg_score": audit_result["supplierEsgScore"],
            "eudr_gps_traceable": audit_result["eudrGpsTraceable"],
            "fair_labor_certified": audit_result["fairLaborCertified"],
            "is_sustainable": audit_result["isSustainableProcurementCertified"],
            "status": audit_result["status"],
            "executive_decision": (
                "APPROVE_SUSTAINABLE_ENTERPRISE_SUPPLIER_CONTRACT"
                if audit_result["isSustainableProcurementCertified"]
                else "REJECT_SUPPLIER_PENDING_ESG_REMEDIATION"
            )
        }

# Execute Master ESG Certification Engine
orchestrator = MasterSustainableProcurementOrchestrator("Apex Global FMCG Conglomerate", "ESG-SCM-2026")

# Test standard benchmark: esgScore=85, gpsTraceable=True, laborCert=True -> Approved
approved_audit = orchestrator.execute_supplier_certification_audit(
    supplier_id="SUP-AGRI-001",
    supplier_name="Sumatra Certified Sustainable Agri-Corp",
    esg_score=85.0,
    has_gps_traceability=True,
    zero_child_labor=True
)

# Test deficit case: esgScore=60, gpsTraceable=True, laborCert=True -> Deficit
deficit_audit = orchestrator.execute_supplier_certification_audit(
    supplier_id="SUP-AGRI-002",
    supplier_name="Sub-Standard Commodity Traders Ltd",
    esg_score=60.0,
    has_gps_traceability=True,
    zero_child_labor=True
)

print(f"Supplier 1: {approved_audit['supplier_name']}")
print(f"ESG Score: {approved_audit['esg_score']} | GPS Traceable: {approved_audit['eudr_gps_traceable']} | Fair Labor: {approved_audit['fair_labor_certified']}")
print(f"Certified: {approved_audit['is_sustainable']} | Status: {approved_audit['status']}")
print(f"Decision: {approved_audit['executive_decision']}")
print("---")
print(f"Supplier 2: {deficit_audit['supplier_name']}")
print(f"ESG Score: {deficit_audit['esg_score']} | Status: {deficit_audit['status']}")
print(f"Decision: {deficit_audit['executive_decision']}")
""",
            "output": """Supplier 1: Sumatra Certified Sustainable Agri-Corp
ESG Score: 85.0 | GPS Traceable: True | Fair Labor: True
Certified: True | Status: SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED
Decision: APPROVE_SUSTAINABLE_ENTERPRISE_SUPPLIER_CONTRACT
---
Supplier 2: Sub-Standard Commodity Traders Ltd
ESG Score: 60.0 | Status: ESG_SUPPLY_CHAIN_DEFICIT
Decision: REJECT_SUPPLIER_PENDING_ESG_REMEDIATION""",
            "lineNotes": [
                {"line": 4, "note": "Deterministic Sustainable Procurement function matching course compliance specification."},
                {"line": 10, "note": "Applies statutory criteria: esgScore >= 80, eudrGpsTraceable == True, fairLaborCertified == True."},
                {"line": 28, "note": "Orchestrates enterprise supplier certification and enforces ERP procurement order releases."}
            ],
            "tryIt": "Test edge cases: pass esg_score=85, has_eudr_gps_traceability=False, zero_child_labor_certified=True. Confirm that status shifts to ESG_SUPPLY_CHAIN_DEFICIT.",
            "check": {
                "question": "Under enterprise sustainable procurement governance, what three conditions must be satisfied for a supplier to be certified as a 'SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED'?",
                "options": [
                    "Supplier ESG score >= 80, verified EUDR satellite GPS traceability, and zero child labor certification",
                    "Supplier must be located in North America and have zero employees",
                    "Supplier must provide free samples and pay 50% discount terms",
                    "Supplier must operate without electricity or computers"
                ],
                "answer": 0,
                "why": "A supplier must demonstrate an ESG score of 80 or above, verified EUDR polygonal GPS plot traceability, and zero child labor certification to earn approved sustainable supplier accreditation."
            }
        }
    ]

    summary = [
        "Scope 3 emissions encompass 15 upstream and downstream value chain categories, typically accounting for 75% to 90% of an enterprise's total carbon footprint.",
        "Transitioning from spend-based to activity-based carbon accounting utilizes primary supplier data and EPDs to track verified decarbonization progress.",
        "Regulation (EU) 2023/1115 (EUDR) mandates polygonal GPS satellite traceability for cattle, cocoa, coffee, palm oil, rubber, soya, and wood harvested post-December 31, 2020.",
        "Conflict Minerals due diligence under Dodd-Frank Section 1502 requires annual RMI CMRT audits cross-referencing smelters against the RMAP conformant database for SEC Form SD reporting.",
        "Sedex SMETA 4-Pillar audits enforce zero-tolerance prohibitions against child labor, debt bondage, and hazardous conditions under ILO Core Conventions.",
        "The Master Sustainable Procurement Engine certifies suppliers as 'SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED' when ESG score >= 80, EUDR GPS is traceable, and zero child labor is certified."
    ]

    projectStep = {
        "title": "Deploy Enterprise Scope 3 Carbon Auditing, EUDR Traceability & Sustainable Sourcing Architecture",
        "steps": [
            "Conduct an activity-based Scope 3 value chain greenhouse gas audit across Category 1 purchased goods and Category 4 upstream transport.",
            "Implement polygonal satellite GPS geolocation verification for EUDR commodities, benchmarking canopy change against the post-2020 cutoff date.",
            "Execute a conflict minerals (3TG) due diligence audit, parsing supplier CMRT declarations against the RMI RMAP conformant smelter registry.",
            "Evaluate supplier ethical welfare using the Sedex SMETA 4-Pillar social compliance framework and zero-tolerance human rights filters.",
            "Synthesize the Master Sustainable Procurement Auditor, validating that ESG score >= 80, GPS traceability, and zero child labor achieve certified supplier status."
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
    data = get_day28_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    print(f"Total spoken words: {total_words} (~{total_words / 150:.1f} mins)")
    for i, part in enumerate(data["parts"], 1):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {i}: {part['title'][:40]} -> {pw} words")
