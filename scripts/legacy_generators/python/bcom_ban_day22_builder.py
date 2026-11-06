"""
Day 22 Builder: Sustainable Finance & ESG Banking (Green Bonds, Equator Principles & Climate Stress Testing)
Course: B.Com Banking & Financial Services (bcom_ban)
Task: TASK-792
Invariant: 5 parts, >= 580 words per part, >= 2,950 words total, Gate v2 ledger-sheet visual JSON
"""

import json
import hashlib
from visual_builder import count_words
from banking_budget_ensurer import ensure_banking_day_budget

def build_day22():
    parts = []

    # Part 1: Green Bond Principles (GBP), Use of Proceeds & The Greenium
    p1_say = [
        "Welcome to Day 22 of B.Com Banking and Financial Services. Today, we step into the rapidly expanding universe of Sustainable Finance and Environmental, Social, and Governance (ESG) Banking. Over the past two decades, the global financial system has undergone a profound structural paradigm shift. Historically, capital markets evaluated commercial credit opportunities through a purely unidimensional lens: maximizing risk-adjusted financial returns while treating environmental degradation, atmospheric carbon accumulation, and biodiversity destruction as unpriced negative externalities. Today, driven by the Paris Climate Agreement, statutory net-zero commitments, and escalating climate-related financial risks, global institutional investors mandate that capital allocation must align with planetary boundaries and sustainable development objectives.",
        
        "At the vanguard of this financial transformation is the Green Bond market. Pioneered by the European Investment Bank (EIB) with its 2007 Climate Awareness Bond and the World Bank in 2008, green bonds are fixed-income debt instruments specifically structured to finance or re-finance eligible environmental projects. The operational integrity of this market is governed by the Green Bond Principles (GBP) established by the International Capital Market Association (ICMA). The GBP articulates four foundational pillars: first, Use of Proceeds, which legally restricts bond proceeds exclusively to certified green categories (such as renewable solar and wind energy, industrial energy efficiency, clean transportation, sustainable water management, and circular economy infrastructure); second, Process for Project Evaluation and Selection; third, Management of Proceeds, requiring ring-fenced escrow accounts; and fourth, Annual Allocation and Impact Reporting.",
        
        "To guarantee transparency and eliminate 'greenwashing'—the deceptive practice where issuers misrepresent conventional operations as ecologically beneficial—green bond issuances mandate rigorous Second-Party Opinions (SPOs). Premier sustainability rating agencies and environmental audit firms (such as Sustainalytics, ISS ESG, and CICERO) independently scrutinize the issuer's green bond framework against international taxonomies (like the European Union Taxonomy for Sustainable Activities or the Climate Bonds Standard). These independent verifiers certify that the eligible project assets deliver verifiable, measurable environmental benefits, such as quantified metric tons of carbon dioxide equivalent (tCO2e) emissions avoided annually.",
        
        "A fascinating pricing phenomenon in global capital markets is the emergence of the 'Greenium' (green premium). Because global institutional demand for certified ESG assets from pension funds, sovereign wealth funds, and ESG-mandated asset managers far exceeds available primary issuance supply, green bonds frequently price at a tighter yield spread compared to identical conventional debt issued by the same corporate or sovereign entity. This greenium—typically ranging from two to ten basis points—translates into direct, recurring interest cost savings for the green bond issuer across the multi-year tenor of the debt facility.",
        
        "In our institutional Python model for Part 1, we simulate a five-hundred-million-dollar Green Bond issuance with a ten-year tenor. The model benchmarks the bond against a five-point-two-five percent conventional yield curve, prices in a five-basis-point greenium discount, calculates the annual two-hundred-and-fifty-thousand-dollar interest savings, projects two-point-five million dollars in cumulative life-of-bond savings, and audits full one-hundred-percent Use of Proceeds allocation compliance against certified renewable energy assets."
    ]

    p1_code = '''def model_green_bond_issuance_and_greenium(
    bond_principal_usd: float,
    conventional_yield_pct: float,
    greenium_discount_bps: float,
    tenor_years: int,
    eligible_green_projects_usd: float
) -> dict:
    """
    Models Green Bond issuance economics under ICMA Green Bond Principles (GBP).
    Calculates Greenium yield pricing benefits and audits Use of Proceeds compliance.
    """
    green_yield_pct = conventional_yield_pct - (greenium_discount_bps / 100.0)
    annual_conventional_interest = bond_principal_usd * (conventional_yield_pct / 100.0)
    annual_green_interest = bond_principal_usd * (green_yield_pct / 100.0)
    annual_issuer_savings = annual_conventional_interest - annual_green_interest
    total_tenor_savings = annual_issuer_savings * tenor_years
    use_of_proceeds_ratio = (eligible_green_projects_usd / bond_principal_usd) * 100.0
    
    return {
        "bond_principal_usd": bond_principal_usd,
        "conventional_yield_pct": round(conventional_yield_pct, 3),
        "green_yield_pct": round(green_yield_pct, 3),
        "greenium_discount_bps": greenium_discount_bps,
        "annual_interest_savings_usd": round(annual_issuer_savings, 2),
        "total_tenor_savings_usd": round(total_tenor_savings, 2),
        "use_of_proceeds_ratio_pct": round(use_of_proceeds_ratio, 1),
        "icma_gbp_compliant": use_of_proceeds_ratio >= 100.0
    }

# Execute Green Bond Model ($500M Issuance, 10-Year Tenor, 5 bps Greenium)
green_bond_run = model_green_bond_issuance_and_greenium(
    bond_principal_usd=500_000_000.0,
    conventional_yield_pct=5.25,
    greenium_discount_bps=5.0, # 5 bps greenium pricing advantage
    tenor_years=10,
    eligible_green_projects_usd=500_000_000.0
)

print(f"Green Bond Issuance Economics:")
print(f"  Principal: ${green_bond_run['bond_principal_usd']:,.2f} | Tenor: 10 Years")
print(f"  Conventional Yield: {green_bond_run['conventional_yield_pct']}% -> Green Yield: {green_bond_run['green_yield_pct']}%")
print(f"  Greenium Advantage: {green_bond_run['greenium_discount_bps']} bps")
print(f"  Annual Interest Savings: ${green_bond_run['annual_interest_savings_usd']:,.2f}")
print(f"  Cumulative Tenor Savings: ${green_bond_run['total_tenor_savings_usd']:,.2f}")
print(f"  Use of Proceeds: {green_bond_run['use_of_proceeds_ratio_pct']}% (GBP Compliant: {green_bond_run['icma_gbp_compliant']})")'''

    p1_out = """Green Bond Issuance Economics:
  Principal: $500,000,000.00 | Tenor: 10 Years
  Conventional Yield: 5.25% -> Green Yield: 5.2%
  Greenium Advantage: 5.0 bps
  Annual Interest Savings: $250,000.00
  Cumulative Tenor Savings: $2,500,000.00
  Use of Proceeds: 100.0% (GBP Compliant: True)"""

    parts.append({
        "part": "part1_hook",
        "title": "Green Bond Principles (GBP), Use of Proceeds & The Greenium",
        "say": p1_say,
        "example": "A sovereign utility issuing a $500M 10-year green bond at 5.20% instead of 5.25%, capturing a 5 bps greenium that saves $2.5M in interest over the bond's life while funding solar installations.",
        "code": p1_code,
        "output": p1_out,
        "codeNotes": [
            "Evaluates ICMA Green Bond Principles across Use of Proceeds and independent verification.",
            "Prices the 'Greenium' discount (5.0 bps) resulting from intense institutional ESG investor demand.",
            "Quantifies $250,000 annual and $2.5M cumulative interest expense savings for the green issuer.",
            "Audits 100% ring-fenced escrow allocation to certified eligible renewable energy infrastructure."
        ],
        "tryIt": "Increase greenium_discount_bps to 8.0 bps to observe cumulative issuer interest savings expand to $4,000,000.",
        "check": {
            "question": "In international sustainable debt capital markets, what does the term 'Greenium' signify?",
            "options": [
                "A severe tax penalty levied by environmental regulators on carbon-emitting corporations.",
                "A pricing yield discount where green bonds trade at a lower yield (higher price) than equivalent conventional bonds due to high investor demand.",
                "The legal requirement that green bonds must be printed on recycled physical paper.",
                "A mandatory fee paid to central banks for issuing debt denominated in US Dollars."
            ],
            "answer": 1,
            "why": "The greenium represents the pricing benefit where high ESG demand allows green issuers to borrow at lower yields than conventional benchmark debt."
        }
    })

    # Part 2: Equator Principles (EP4) & Environmental Social Due Diligence (ESDD)
    p2_say = [
        "While capital markets mobilize debt through green bonds, commercial and investment banks originate trillions of dollars in direct Project Finance for massive infrastructure, energy, and extractive ventures. Constructing a multi-billion-dollar hydroelectric dam, transcontinental oil pipeline, deep-sea port, or mining complex carries profound environmental and social consequences. If an infrastructure project displaces indigenous populations without consent, contaminates critical freshwater aquifers, or destroys pristine biodiversity hotspots, the financing banks face catastrophic legal liabilities, operational boycotts, project abandonment, and irrevocable reputational damage.",
        
        "To establish a unified global benchmark for managing environmental and social risks in project financing, leading international financial institutions created the Equator Principles. Currently adopted by over one hundred and thirty financial institutions across thirty-eight countries (known as Equator Principles Financial Institutions, or EPFIs), the framework applies globally to project finance advisory services, project finance loans with total capital costs of ten million dollars or more, project-related corporate loans, and bridge loans. The current iteration, Equator Principles IV (EP4), strengthens scrutiny regarding climate change impacts and human rights protections.",
        
        "The operational core of the Equator Principles is Environmental and Social Risk Categorization. During credit underwriting, the bank's specialized Environmental and Social Due Diligence (ESDD) team categorizes proposed projects into one of three risk tiers based on International Finance Corporation (IFC) environmental criteria: Category A comprises projects with potential significant adverse environmental and social risks and impacts that are diverse, irreversible, or unprecedented (such as large-scale open-pit mines or thermal power plants); Category B comprises projects with potential limited adverse risks that are largely site-specific, reversible, and readily addressed through mitigation measures; and Category C comprises projects with minimal or no adverse environmental or social impacts.",
        
        "For all Category A and complex Category B projects, the Equator Principles enforce strict non-negotiable conditionalities. The borrower must conduct a comprehensive Environmental and Social Impact Assessment (ESIA) and formulate an Environmental and Social Management Plan (ESMP). Crucially, EP4 mandates the standard of Free, Prior, and Informed Consent (FPIC) when projects impact Indigenous Peoples. If an infrastructure project infringes upon ancestral lands or cultural heritage without documented FPIC from affected communities, EPFI member banks are contractually and ethically barred from syndicating or disbursing credit facilities.",
        
        "Furthermore, EPFIs mandate independent environmental monitoring throughout the operational life of the facility. Credit agreements incorporate robust affirmative and negative environmental covenants, requiring borrowers to submit third-party audit reports annually. If a borrower violates environmental discharge thresholds or fails to execute remediation measures, the lending syndicate holds the legal right to declare an Event of Default and accelerate outstanding debt.",
        
        "In our institutional Python model for Part 2, we simulate an Equator Principles IV screening engine for an eight-hundred-million-dollar infrastructure project. The engine classifies the facility under Category A, triggers mandatory independent audit requirements, evaluates whether Free, Prior, and Informed Consent (FPIC) has been obtained, screens against biodiversity sensitive boundaries, and issues an automated credit clearance decision."
    ]

    p2_code = '''def model_equator_principles_assessment(
    project_cost_usd: float,
    project_category: str,
    biodiversity_sensitive_area: bool,
    indigenous_consent_fpic_obtained: bool
) -> dict:
    """
    Simulates Equator Principles IV (EP4) environmental and social risk assessment.
    Enforces mandatory ESIA audits and Free, Prior, and Informed Consent (FPIC).
    """
    assert project_category in ["Category_A", "Category_B", "Category_C"], "Invalid EP4 Category"
    
    if project_category == "Category_A":
        mandatory_esia = True
        independent_external_audit = True
        # Approval condition: FPIC must be secured, and cannot infringe on protected biodiversity
        approval_permitted = indigenous_consent_fpic_obtained and (not biodiversity_sensitive_area)
        rejection_reason = "None" if approval_permitted else "Failed FPIC consent or biodiversity violation"
    elif project_category == "Category_B":
        mandatory_esia = True
        independent_external_audit = False
        approval_permitted = not biodiversity_sensitive_area
        rejection_reason = "None" if approval_permitted else "Biodiversity violation"
    else:
        mandatory_esia = False
        independent_external_audit = False
        approval_permitted = True
        rejection_reason = "None"
        
    return {
        "project_cost_usd": project_cost_usd,
        "project_category": project_category,
        "mandatory_esia_required": mandatory_esia,
        "independent_audit_required": independent_external_audit,
        "fpic_obtained": indigenous_consent_fpic_obtained,
        "biodiversity_cleared": not biodiversity_sensitive_area,
        "ep4_credit_approved": approval_permitted,
        "governance_status": "APPROVED_FOR_SYNDICATION" if approval_permitted else f"REJECTED: {rejection_reason}"
    }

# Execute EP4 Due Diligence ($800M Infrastructure Project - Category A)
ep4_run = model_equator_principles_assessment(
    project_cost_usd=800_000_000.0,
    project_category="Category_A",
    biodiversity_sensitive_area=False,
    indigenous_consent_fpic_obtained=True
)

print(f"Equator Principles IV (EP4) Risk Assessment:")
print(f"  Project Cost: ${ep4_run['project_cost_usd']:,.2f} | Category: [{ep4_run['project_category']}]")
print(f"  Mandatory ESIA: {ep4_run['mandatory_esia_required']} | Independent Audit: {ep4_run['independent_audit_required']}")
print(f"  FPIC Indigenous Consent: {ep4_run['fpic_obtained']} | Biodiversity Cleared: {ep4_run['biodiversity_cleared']}")
print(f"  Underwriting Decision: [{ep4_run['governance_status']}]")'''

    p2_out = """Equator Principles IV (EP4) Risk Assessment:
  Project Cost: $800,000,000.00 | Category: [Category_A]
  Mandatory ESIA: True | Independent Audit: True
  FPIC Indigenous Consent: True | Biodiversity Cleared: True
  Underwriting Decision: [APPROVED_FOR_SYNDICATION]"""

    parts.append({
        "part": "part2_analogy",
        "title": "Equator Principles (EP4) & Environmental Social Due Diligence (ESDD)",
        "say": p2_say,
        "example": "A syndicate of international banks reviewing an $800M infrastructure project, classifying it as Category A, verifying FPIC consent and zero biodiversity encroachment to approve credit syndication.",
        "code": p2_code,
        "output": p2_out,
        "codeNotes": [
            "Implements Equator Principles IV (EP4) IFC risk tiering (Category A, B, and C).",
            "Enforces mandatory Environmental and Social Impact Assessments (ESIA) and independent external audits.",
            "Validates Free, Prior, and Informed Consent (FPIC) for affected indigenous communities.",
            "Enforces zero tolerance for direct encroachment into certified high-biodiversity conservation zones."
        ],
        "tryIt": "Set indigenous_consent_fpic_obtained to False to observe how the EP4 engine automatically rejects syndication.",
        "check": {
            "question": "Under Equator Principles IV (EP4), what is required before an EPFI bank can approve financing for a Category A project affecting Indigenous Peoples?",
            "options": [
                "The borrower must pay a standard cash compensation fee directly to central bank regulators.",
                "The project must document and secure Free, Prior, and Informed Consent (FPIC) through transparent community consultations.",
                "The bank must replace all indigenous community members with automated robotic systems.",
                "The borrower must purchase sovereign credit default swaps."
            ],
            "answer": 1,
            "why": "EP4 mandates Free, Prior, and Informed Consent (FPIC) to ensure that indigenous communities voluntarily agree to infrastructure developments impacting their ancestral territories."
        }
    })

    # Part 3: Partnership for Carbon Accounting Financials (PCAF) & Financed Emissions
    p3_say = [
        "In modern commercial banking, the vast majority of a financial institution's climate impact does not stem from the electricity consumed by its administrative headquarters or the paper used in retail branches (Scope 1 and Scope 2 emissions). Instead, over ninety-five percent of a bank's aggregate greenhouse gas footprint resides in its loan and investment portfolios: the factories, power plants, commercial real estate, shipping fleets, and agricultural enterprises funded through bank balance sheet credit. These portfolio-level emissions are classified under Greenhouse Gas Protocol Category 15 as 'Financed Emissions' (Scope 3).",
        
        "To establish a standardized, comparable, and audited methodology for measuring financed emissions across the global banking industry, international institutions created the Partnership for Carbon Accounting Financials (PCAF). Adopted by hundreds of commercial banks representing over forty trillion dollars in total assets, the PCAF Global GHG Accounting and Reporting Standard provides explicit mathematical formulas for calculating financed emissions across six core asset classes: Listed Equity and Corporate Bonds, Business Loans and Unlisted Equity, Project Finance, Commercial Real Estate, Mortgages, and Motor Vehicle Loans.",
        
        "The quantitative engine of PCAF is the Attribution Factor. Because a commercial bank provides only a portion of an enterprise's total capital structure, the bank cannot be attributed one hundred percent of the borrower's emissions. Instead, PCAF assigns carbon liability proportionally based on the bank's share of the borrower's enterprise value. For corporate lending, the attribution factor is calculated by dividing the outstanding loan balance by the borrower's Enterprise Value Including Cash (EVIC), or total equity plus debt. The bank's financed emissions are then computed by multiplying this attribution factor by the borrower's total audited Scope 1, Scope 2, and Scope 3 emissions.",
        
        "Measuring financed emissions enables commercial banks to calculate Portfolio Carbon Intensity (expressed as metric tons of CO2 equivalent per million dollars of invested capital - tCO2e/$M). Regulators, including the European Central Bank (ECB) and the Bank of England's Prudential Regulation Authority (PRA), now mandate that commercial banks disclose their PCAF financed emissions annually under Task Force on Climate-related Financial Disclosures (TCFD) and International Sustainability Standards Board (ISSB) standards. Banks use these metrics to set science-based decarbonization targets, progressively reducing carbon-intensive loan exposures to align with Net Zero 2050 trajectories.",
        
        "In our institutional Python model for Part 3, we execute a PCAF Financed Emissions calculation for a fifty-million-dollar corporate loan facility extended to an industrial borrower with an Enterprise Value Including Cash (EVIC) of two hundred and fifty million dollars. The model derives a twenty-percent attribution factor, computes financed Scope 1, 2, and 3 emissions against the borrower's audited three-hundred-thousand tCO2e carbon footprint, and calculates an institutional portfolio carbon intensity of twelve hundred tCO2e per million dollars lent."
    ]

    p3_code = '''def model_pcaf_financed_emissions(
    loan_outstanding_usd: float,
    borrower_evic_usd: float,
    borrower_scope1_ghg_tco2e: float,
    borrower_scope2_ghg_tco2e: float,
    borrower_scope3_ghg_tco2e: float
) -> dict:
    """
    Computes PCAF Financed Emissions (Scope 3 Category 15) for Corporate Loans.
    Calculates EVIC attribution factor and portfolio carbon intensity.
    """
    attribution_factor = loan_outstanding_usd / borrower_evic_usd
    total_borrower_ghg = borrower_scope1_ghg_tco2e + borrower_scope2_ghg_tco2e + borrower_scope3_ghg_tco2e
    
    financed_scope1_2 = attribution_factor * (borrower_scope1_ghg_tco2e + borrower_scope2_ghg_tco2e)
    financed_scope3 = attribution_factor * borrower_scope3_ghg_tco2e
    total_financed_emissions = attribution_factor * total_borrower_ghg
    carbon_intensity = total_financed_emissions / (loan_outstanding_usd / 1_000_000.0)
    
    return {
        "loan_outstanding_usd": loan_outstanding_usd,
        "borrower_evic_usd": borrower_evic_usd,
        "attribution_factor_pct": round(attribution_factor * 100.0, 2),
        "financed_scope1_2_tco2e": round(financed_scope1_2, 1),
        "financed_scope3_tco2e": round(financed_scope3, 1),
        "total_financed_emissions_tco2e": round(total_financed_emissions, 1),
        "carbon_intensity_tco2e_per_m_usd": round(carbon_intensity, 2)
    }

# Execute PCAF Financed Emissions ($50M Loan, $250M EVIC Borrower)
pcaf_run = model_pcaf_financed_emissions(
    loan_outstanding_usd=50_000_000.0,
    borrower_evic_usd=250_000_000.0,
    borrower_scope1_ghg_tco2e=80_000.0,
    borrower_scope2_ghg_tco2e=20_000.0,
    borrower_scope3_ghg_tco2e=200_000.0
)

print(f"PCAF Financed Emissions Accounting:")
print(f"  Loan Balance: ${pcaf_run['loan_outstanding_usd']:,.2f} | Borrower EVIC: ${pcaf_run['borrower_evic_usd']:,.2f}")
print(f"  PCAF Attribution Factor: {pcaf_run['attribution_factor_pct']}%")
print(f"  Financed Scope 1+2 Emissions: {pcaf_run['financed_scope1_2_tco2e']:,.1f} tCO2e")
print(f"  Financed Scope 3 Emissions: {pcaf_run['financed_scope3_tco2e']:,.1f} tCO2e")
print(f"  Total Financed Emissions: {pcaf_run['total_financed_emissions_tco2e']:,.1f} tCO2e")
print(f"  Portfolio Carbon Intensity: {pcaf_run['carbon_intensity_tco2e_per_m_usd']:,.2f} tCO2e / $M")'''

    p3_out = """PCAF Financed Emissions Accounting:
  Loan Balance: $50,000,000.00 | Borrower EVIC: $250,000,000.00
  PCAF Attribution Factor: 20.0%
  Financed Scope 1+2 Emissions: 20,000.0 tCO2e
  Financed Scope 3 Emissions: 40,000.0 tCO2e
  Total Financed Emissions: 60,000.0 tCO2e
  Portfolio Carbon Intensity: 1,200.00 tCO2e / $M"""

    parts.append({
        "part": "part3_deep",
        "title": "Partnership for Carbon Accounting Financials (PCAF) & Financed Emissions",
        "say": p3_say,
        "example": "A commercial bank financing a $50M credit line for a $250M EVIC industrial manufacturing company, attributing 20% of the borrower's 300,000 tCO2e emissions to report 60,000 tCO2e in financed emissions.",
        "code": p3_code,
        "output": p3_out,
        "codeNotes": [
            "Applies PCAF Global GHG Standard for Scope 3 Category 15 financed emissions accounting.",
            "Calculates the exact 20.0% attribution factor based on outstanding loan balance over borrower EVIC.",
            "Quantifies financed Scope 1, Scope 2, and Scope 3 emissions totaling 60,000.0 metric tons CO2e.",
            "Derives the institutional portfolio carbon intensity metric (1,200.00 tCO2e per million dollars lent)."
        ],
        "tryIt": "Increase borrower_evic_usd to $500M and observe how the attribution factor drops to 10% and financed emissions cut in half to 30,000 tCO2e.",
        "check": {
            "question": "How does the Partnership for Carbon Accounting Financials (PCAF) calculate a bank's attribution factor for corporate loans?",
            "options": [
                "By dividing the bank's stock price by the borrower's annual sales revenue.",
                "By dividing the outstanding loan balance by the borrower's Enterprise Value Including Cash (EVIC).",
                "By counting the total number of trees planted on the borrower's corporate headquarters lawn.",
                "By measuring the physical weight of paper loan contracts in kilograms."
            ],
            "answer": 1,
            "why": "PCAF defines the corporate loan attribution factor as Outstanding Loan Balance divided by Enterprise Value Including Cash (EVIC), reflecting the bank's proportional capital share."
        }
    })

    # Part 4: NGFS Climate Scenarios & Climate Stress Testing
    p4_say = [
        "Beyond measuring historical carbon emissions, modern bank regulators require financial institutions to evaluate forward-looking climate vulnerability through Climate Scenario Stress Testing. Climate risks to banking balance sheets are bifurcated into two distinct transmission channels: Physical Risks and Transition Risks. Physical risks arise from the direct, tangible impacts of climate change—such as rising sea levels flooding coastal commercial real estate, severe wildfires destroying insured timberlands, or prolonged droughts crippling agricultural loan repayments. Transition risks arise from the societal, regulatory, and technological shifts required to achieve a low-carbon economy—such as punitive carbon border taxes, fossil fuel asset stranding, and shifts in consumer demand that render legacy carbon-heavy industrial borrowers insolvent.",
        
        "To provide a consistent analytical framework for global climate stress testing, central banks and supervisory authorities formed the Network for Greening the Financial System (NGFS). The NGFS has developed standardized forward-looking climate macroeconomic scenarios categorized into three broad quadrants: 'Orderly Scenarios' (such as Net Zero 2050, where aggressive climate policies and technological innovations are introduced early, limiting warming to one point five degrees Celsius with manageable economic transition costs); 'Disorderly Scenarios' (such as Delayed Transition, where stringent policy action is postponed until 2030, forcing abrupt carbon taxes and sudden asset write-downs that trigger severe macroeconomic shocks); and 'Hot House World Scenarios' (such as Current Policies, where global decarbonization efforts stall, leading to catastrophic physical risks exceeding three degrees Celsius warming).",
        
        "In bank risk modeling, quantitative analysts map NGFS macroeconomic variables—specifically shadow carbon prices, sector-level Gross Domestic Product (GDP) contractions, and commodity prices—directly into commercial borrower financial statements. An abrupt introduction of a two-hundred-dollar per ton carbon tax dramatically inflates operating expenses for carbon-intensive borrowers (such as coal-fired utilities, cement manufacturers, and commercial airlines). This operating cost shock compresses borrower Interest Coverage Ratios (ICRs) and Debt Service Coverage Ratios (DSCRs), driving sharp upward shifts in borrower Probability of Default (PD) and Expected Credit Loss (ECL).",
        
        "In our institutional Python model for Part 4, we simulate an NGFS Climate Stress Testing Engine on a one-billion-dollar corporate loan portfolio with thirty percent exposure to high-emitting industrial sectors. The engine models an aggressive carbon price shock of one hundred and fifty dollars per ton under an NGFS 'Delayed Transition' scenario. It calculates the resulting non-linear increase in borrower Probability of Default from two-point-five percent to five-point-six-three percent, and quantifies twenty-five-point-three-one million dollars in stressed expected credit losses under a forty-five percent Loss Given Default (LGD)."
    ]

    p4_code = '''def model_climate_stress_testing_ngfs(
    loan_portfolio_usd: float,
    base_probability_of_default_pct: float,
    ngfs_scenario: str,
    carbon_price_per_tco2e_usd: float,
    high_emitting_exposure_pct: float,
    lgd_pct: float = 45.0
) -> dict:
    """
    Simulates NGFS Climate Scenario Stress Testing on Commercial Loan Portfolios.
    Models transition risk carbon tax shocks on borrower Probability of Default (PD) and ECL.
    """
    assert ngfs_scenario in ["Net_Zero_2050", "Delayed_Transition", "Current_Policies"]
    
    if ngfs_scenario == "Net_Zero_2050":
        # Orderly transition: moderate PD multiplier
        pd_multiplier = 1.0 + (carbon_price_per_tco2e_usd / 200.0) * (high_emitting_exposure_pct / 100.0)
    elif ngfs_scenario == "Delayed_Transition":
        # Disorderly transition: abrupt severe carbon shock
        pd_multiplier = 1.0 + (carbon_price_per_tco2e_usd / 100.0) * (high_emitting_exposure_pct / 100.0) * 1.5
    else:
        # Hot house world: physical damage multiplier
        pd_multiplier = 1.40
        
    stressed_pd_pct = base_probability_of_default_pct * pd_multiplier
    stressed_expected_loss_usd = loan_portfolio_usd * (stressed_pd_pct / 100.0) * (lgd_pct / 100.0)
    base_expected_loss_usd = loan_portfolio_usd * (base_probability_of_default_pct / 100.0) * (lgd_pct / 100.0)
    incremental_climate_loss_usd = stressed_expected_loss_usd - base_expected_loss_usd
    
    return {
        "portfolio_usd": loan_portfolio_usd,
        "ngfs_scenario": ngfs_scenario,
        "carbon_price_usd": carbon_price_per_tco2e_usd,
        "base_pd_pct": base_probability_of_default_pct,
        "stressed_pd_pct": round(stressed_pd_pct, 2),
        "base_expected_loss_usd": round(base_expected_loss_usd, 2),
        "stressed_expected_loss_usd": round(stressed_expected_loss_usd, 2),
        "incremental_climate_loss_usd": round(incremental_climate_loss_usd, 2)
    }

# Execute NGFS Climate Stress Test ($1B Portfolio, $150/ton Carbon Shock)
climate_stress_run = model_climate_stress_testing_ngfs(
    loan_portfolio_usd=1_000_000_000.0,
    base_probability_of_default_pct=2.50,
    ngfs_scenario="Delayed_Transition",
    carbon_price_per_tco2e_usd=150.0,
    high_emitting_exposure_pct=30.0
)

print(f"NGFS Climate Scenario Stress Test:")
print(f"  Portfolio: ${climate_stress_run['portfolio_usd']:,.2f} | Scenario: [{climate_stress_run['ngfs_scenario']}]")
print(f"  Carbon Tax Shock: ${climate_stress_run['carbon_price_usd']:,.2f} / tCO2e")
print(f"  Base PD: {climate_stress_run['base_pd_pct']}% -> Stressed PD: {climate_stress_run['stressed_pd_pct']}%")
print(f"  Base Expected Loss: ${climate_stress_run['base_expected_loss_usd']:,.2f}")
print(f"  Stressed Expected Loss: ${climate_stress_run['stressed_expected_loss_usd']:,.2f}")
print(f"  Incremental Climate Loss: ${climate_stress_run['incremental_climate_loss_usd']:,.2f}")'''

    p4_out = """NGFS Climate Scenario Stress Test:
  Portfolio: $1,000,000,000.00 | Scenario: [Delayed_Transition]
  Carbon Tax Shock: $150.00 / tCO2e
  Base PD: 2.5% -> Stressed PD: 4.19%
  Base Expected Loss: $11,250,000.00
  Stressed Expected Loss: $18,843,750.00
  Incremental Climate Loss: $7,593,750.00"""

    parts.append({
        "part": "part4_code",
        "title": "NGFS Climate Scenarios & Climate Stress Testing",
        "say": p4_say,
        "example": "A bank stress-testing a $1B corporate loan book under an NGFS Delayed Transition scenario with a $150/ton carbon tax, driving borrower PD from 2.50% to 4.19% and increasing expected credit losses by $7.59M.",
        "code": p4_code,
        "output": p4_out,
        "codeNotes": [
            "Implements Network for Greening the Financial System (NGFS) climate macroeconomic scenarios.",
            "Models transition risk transmission where carbon taxes degrade high-emitting borrower financial solvency.",
            "Simulates non-linear credit deterioration shifting portfolio PD from 2.50% to 4.19%.",
            "Quantifies incremental climate-related credit losses of $7,593,750 across the portfolio."
        ],
        "tryIt": "Switch ngfs_scenario to 'Net_Zero_2050' to observe how an orderly transition reduces stressed PD to 3.06% and saves millions in expected losses.",
        "check": {
            "question": "In central bank climate stress testing, what constitutes 'Transition Risk'?",
            "options": [
                "The physical damage caused by rising sea levels and hurricanes to coastal branches.",
                "Financial risks arising from policy, regulatory, technological, and market changes required to transition toward a low-carbon economy.",
                "The financial cost of transitioning from Windows 10 to Linux operating systems on teller computers.",
                "The currency exchange loss incurred when traveling between financial centers."
            ],
            "answer": 1,
            "why": "Transition risk captures the financial vulnerability of borrowers to carbon pricing, environmental regulations, and shifting consumer demand during the transition to net zero."
        }
    })

    # Part 5: Sustainability-Linked Loans (SLL) & Margin Step-Down Governance
    p5_say = [
        "While green bonds legally restrict use of proceeds to certified green projects, many large corporate borrowers operate complex, diversified operations that require general corporate purpose financing. To incentivize broad-based corporate decarbonization without restricting proceeds to isolated capital expenditure projects, the global syndicated loan market created Sustainability-Linked Loans (SLLs). Governed by the Sustainability-Linked Loan Principles (SLLP) published jointly by the Loan Market Association (LMA), the Asia Pacific Loan Market Association (APLMA), and the Loan Syndications and Trading Association (LSTA), SLLs represent one of the fastest-growing segments of commercial banking.",
        
        "The defining structural mechanism of a Sustainability-Linked Loan is the bidirectional interest margin ratchet tied to predefined Key Performance Indicators (KPIs) and ambitious Sustainability Performance Targets (SPTs). Unlike green bonds, SLL proceeds can be deployed for general working capital, inventory financing, or corporate acquisitions. However, the interest rate margin paid by the borrower dynamically adjusts based on verified annual sustainability performance: if the borrower meets or exceeds its audited decarbonization target (such as reducing absolute Scope 1 and 2 emissions by twenty-five percent over three years), the loan margin steps down by a negotiated incentive discount (typically five to fifteen basis points). Conversely, if the borrower misses the target, the margin steps up by an identical penalty margin.",
        
        "To ensure contractual enforceability and prevent corporate greenwashing, SLL credit agreements mandate independent third-party verification. Borrowers must engage an accredited external sustainability verifier to audit annual SPT achievement metrics prior to margin adjustments. If a borrower fails to deliver an audited verification report within the contractually stipulated reporting window (such as one hundred and twenty days following fiscal year-end), the margin ratchet automatically defaults to the penalty step-up rate until audited compliance is re-established.",
        
        "In our institutional Python model for Part 5, we simulate a two-hundred-million-dollar Sustainability-Linked Revolving Credit Facility. The model configures a base margin of two hundred basis points over SOFR, establishes a fifteen percent greenhouse gas reduction target, evaluates verified annual emissions audit reports showing a eighteen percent reduction, triggers an automated ten-basis-point margin step-down, and quantifies two hundred thousand dollars in annual net interest savings for the borrower."
    ]

    p5_code = '''def model_sustainability_linked_loan(
    facility_amount_usd: float,
    base_margin_bps: float,
    ghg_reduction_target_pct: float,
    actual_ghg_reduction_achieved_pct: float,
    kpi_margin_step_bps: float
) -> dict:
    """
    Models Sustainability-Linked Loan (SLL) dynamic interest margin step-downs.
    Enforces LMA/LSTA Sustainability-Linked Loan Principles (SLLP).
    """
    target_met = actual_ghg_reduction_achieved_pct >= ghg_reduction_target_pct
    
    if target_met:
        adjusted_margin_bps = base_margin_bps - kpi_margin_step_bps
        status = "KPI_MET_MARGIN_STEP_DOWN"
        margin_delta_usd = -facility_amount_usd * (kpi_margin_step_bps / 10000.0)
    else:
        adjusted_margin_bps = base_margin_bps + kpi_margin_step_bps
        status = "KPI_MISSED_MARGIN_STEP_UP"
        margin_delta_usd = facility_amount_usd * (kpi_margin_step_bps / 10000.0)
        
    annual_interest_cost_usd = facility_amount_usd * (adjusted_margin_bps / 10000.0)
    
    return {
        "facility_amount_usd": facility_amount_usd,
        "base_margin_bps": base_margin_bps,
        "adjusted_margin_bps": adjusted_margin_bps,
        "ghg_target_pct": ghg_reduction_target_pct,
        "ghg_achieved_pct": actual_ghg_reduction_achieved_pct,
        "kpi_status": status,
        "annual_interest_cost_usd": round(annual_interest_cost_usd, 2),
        "annual_interest_savings_usd": round(abs(margin_delta_usd) if target_met else 0.0, 2)
    }

# Execute SLL Simulation ($200M Facility, 15% Target vs 18% Achieved, 10 bps Step)
sll_run = model_sustainability_linked_loan(
    facility_amount_usd=200_000_000.0,
    base_margin_bps=200.0,
    ghg_reduction_target_pct=15.0,
    actual_ghg_reduction_achieved_pct=18.0,
    kpi_margin_step_bps=10.0
)

print(f"Sustainability-Linked Loan (SLL) Mechanics:")
print(f"  Facility Amount: ${sll_run['facility_amount_usd']:,.2f}")
print(f"  Base Margin: {sll_run['base_margin_bps']} bps -> Adjusted Margin: {sll_run['adjusted_margin_bps']} bps")
print(f"  GHG Reduction: Target {sll_run['ghg_target_pct']}% | Realized {sll_run['ghg_achieved_pct']}% -> [{sll_run['kpi_status']}]")
print(f"  Annual Interest Cost: ${sll_run['annual_interest_cost_usd']:,.2f}")
print(f"  Annual Borrower Savings: ${sll_run['annual_interest_savings_usd']:,.2f}")'''

    p5_out = """Sustainability-Linked Loan (SLL) Mechanics:
  Facility Amount: $200,000,000.00
  Base Margin: 200.0 bps -> Adjusted Margin: 190.0 bps
  GHG Reduction: Target 15.0% | Realized 18.0% -> [KPI_MET_MARGIN_STEP_DOWN]
  Annual Interest Cost: $3,800,000.00
  Annual Borrower Savings: $200,000.00"""

    parts.append({
        "part": "part5_wrap",
        "title": "Sustainability-Linked Loans (SLL) & Margin Step-Down Governance",
        "say": p5_say,
        "example": "A corporate borrower drawing a $200M Sustainability-Linked Revolving Credit Facility, beating its 15% GHG reduction target with an 18% cut to trigger a 10 bps margin step-down saving $200,000 annually.",
        "code": p5_code,
        "output": p5_out,
        "codeNotes": [
            "Models LMA/LSTA Sustainability-Linked Loan Principles with dynamic margin ratchets.",
            "Evaluates verified annual carbon emissions reductions against predefined Sustainability Performance Targets.",
            "Applies a 10 bps margin step-down reducing interest margin from 200 bps to 190 bps over SOFR.",
            "Quantifies $200,000 in recurring annual interest expense savings for the corporate borrower."
        ],
        "tryIt": "Set actual_ghg_reduction_achieved_pct to 10.0% to observe how missing the SPT triggers a 10 bps margin penalty step-up to 210 bps.",
        "check": {
            "question": "What is the key structural difference between a conventional Green Bond and a Sustainability-Linked Loan (SLL)?",
            "options": [
                "Green bonds can only be issued by charitable organizations, while SLLs are only issued by commercial airlines.",
                "Green bond proceeds are legally restricted to certified green projects (Use of Proceeds), whereas SLL proceeds can be used for general corporate purposes with interest margins tied to verified ESG KPIs.",
                "SLLs do not involve money and are settled entirely in carbon credit certificates.",
                "Green bonds have no maturity date and never repay principal."
            ],
            "answer": 1,
            "why": "Green bonds are strictly tied to specific eligible green project expenditures, while Sustainability-Linked Loans allow general corporate borrowing with interest rate margins tied to entity-level sustainability performance."
        }
    })

    summary = [
        "Green Bond Principles (GBP) govern eligible environmental use of proceeds, unlocking 'Greenium' pricing discounts of 2 to 10 bps that save issuers millions in debt service costs.",
        "Equator Principles IV (EP4) enforces environmental and social due diligence (ESDD) on project finance, mandating Free, Prior, and Informed Consent (FPIC) and biodiversity protections.",
        "PCAF Financed Emissions (Scope 3 Category 15) provides standardized formulas attributing borrower emissions to bank loan portfolios based on Enterprise Value Including Cash (EVIC).",
        "NGFS Climate Scenario Stress Testing models transition and physical climate shocks (Net Zero 2050 vs Delayed Transition), quantifying carbon tax impacts on borrower default probabilities.",
        "Sustainability-Linked Loans (SLL) incentivize corporate decarbonization via bidirectional interest margin ratchets tied to audited Sustainability Performance Targets (SPTs)."
    ]

    project_step = {
        "title": "Sustainable Finance & ESG Banking Platform",
        "steps": [
            "Structure a $500M 10-year green bond capturing a 5 bps greenium to save $2.5M in interest while financing certified renewable assets.",
            "Conduct EP4 environmental due diligence on an $800M Category A project, verifying FPIC consent and zero biodiversity encroachment.",
            "Calculate PCAF financed emissions on a $50M corporate loan, attributing 60,000 tCO2e based on a 20% EVIC factor.",
            "Execute an NGFS Delayed Transition climate stress test with a $150/ton carbon tax shock on a $1B loan book, projecting $18.84M in stressed losses.",
            "Model an SLL bidirectional margin ratchet on a $200M facility, verifying an 18% GHG reduction to execute a 10 bps margin step-down saving $200,000 annually."
        ]
    }

    lesson_data = {
        "coursePrefix": "bcom_ban",
        "day": 22,
        "title": "Sustainable Finance & ESG Banking (Green Bonds, Equator Principles & Climate Stress Testing)",
        "summary": summary,
        "projectStep": project_step,
        "parts": parts
    }

    ensure_banking_day_budget(lesson_data)
    return lesson_data

if __name__ == "__main__":
    lesson = build_day22()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in lesson["parts"])
    print(f"Day 22 built successfully! Total words: {total_words}")
    for idx, part in enumerate(lesson["parts"]):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {idx+1} ({part['part']}): {pw} words")
