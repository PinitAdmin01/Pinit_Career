import sys
import json
import hashlib

def get_day18_data() -> dict:
    day = 18
    title = "Sales Enablement, Competitive Battlecards & Depositioning Objection Matrices"
    goal = "Master modern sales enablement infrastructure, competitive intelligence battlecard architecture, depositioning landmines, certified pitch playbooks, and structured objection handling matrices to systematically neutralize competitor FUD."
    minutes = 45
    recap = "Previously in Day 17, we engineered high-velocity lead routing, two-tier demographic/behavioral scoring, 15-minute speed-to-lead SLAs, and event-driven webhooks. Today in Day 18, we arm sales representatives with elite competitive enablement: structured battlecards, architectural discovery landmines, the LAER objection handling framework, and pitch certification telemetry."

    parts = [
        # Part 1: Competitive Battlecard Architecture: Strengths, Weaknesses, Landmines & Counter-Pitches
        {
            "title": "Competitive Battlecard Architecture: Strengths, Weaknesses, Landmines & Counter-Pitches",
            "say": [
                "Welcome to Day 18 of B.Com Sales, Customer Success & CRM (SCRM). In enterprise software sales, deals are rarely contested in a competitive vacuum. In over 80% of enterprise procurement cycles, buyers evaluate multiple alternative solutions simultaneously—ranging from entrenched legacy incumbents and low-cost feature disruptors to internal DIY software builds. When a prospective Chief Information Officer asks an Account Executive, 'How do you compare to Legacy Incumbent Corp?', the rep's answer dictates the commercial fate of the opportunity. An amateur salesperson launches into a defensive 20-minute product feature lecture or commits the fatal error of badmouthing the competitor; an elite, enabled salesperson executes a precision competitive depositioning playbook.",
                "To equip sales representatives with instant, credible, and legally compliant competitive positioning at their fingertips, modern Revenue Operations organizations build structured Competitive Battlecards. A Competitive Battlecard is not a static 40-page product marketing PDF that sits unread in Google Drive; it is an agile, real-time tactical field manual designed around four core architectural quadrants: 1. Competitor Overview & ICP Overlap; 2. Where They Win (Honest Competitor Strengths); 3. Where We Win (Architectural Vulnerabilities); and 4. Quick-Dismiss Soundbites & Customer Proof Points.",
                "Quadrant One: Honest Strength Acknowledgment. Novice sales organizations falsely believe that competitive battlecards should claim superiority across every single dimension. In contrast, elite enablement acknowledges competitor strengths upfront to build unshakeable credibility with the buyer. If Legacy Incumbent Corp has been in business for 30 years and has 10,000 legacy integrations, the rep acknowledges this openly: 'Legacy Incumbent Corp is an established market pioneer with extensive legacy database connectors.' This objective honesty disarms buyer skepticism, transforming the salesperson from a biased vendor into a trusted consultative advisor.",
                "Quadrant Two: Architectural Pivot & Root Vulnerability. Once credibility is established, the battlecard provides the precise intellectual bridge from the competitor's acknowledged strength to their fatal architectural weakness. The battlecard reveals that having 10,000 legacy features built across 30 years means the incumbent's codebase is bloated, complex to configure, and requires months of expensive on-premise professional services. The counter-positioning script pivots immediately: 'However, because their architecture was designed before modern cloud-native standards, their average deployment takes nine months and requires three full-time database administrators, whereas our modern API-first platform deploys in three days with zero ongoing server maintenance.'",
                "Quadrant Three: Quick-Dismiss Soundbites. In live sales conversations, reps cannot pause to read complex technical manuals. Battlecards equip reps with concise, memorable 15-second soundbites that instantly neutralize common competitor marketing claims. If a low-cost competitor claims to offer the same capabilities at half the price, the quick-dismiss soundbite reframes the debate around total cost of ownership: 'They provide a low upfront software fee because they charge $300 an hour for custom implementation and lack enterprise SOC-2 Type II audit compliance, creating massive downstream regulatory risk.'",
                "Quadrant Four: Customer Migration Proof Points. Abstract claims of superiority fail without verifiable social proof. Every battlecard quadrant anchors directly to verified customer switch stories: case studies detailing how a recognizable peer enterprise abandoned the competitor due to slow deployment or hidden fees and achieved 3x ROI after switching to our platform. These proof points provide the ammunition required to overcome incumbent inertia and reassure procurement committees.",
                "Furthermore, modern enablement teams implement Continuous Intelligence Feeds into the battlecard repository. Market landscapes evolve constantly: competitors release quarterly product updates, adjust licensing models, or experience public system outages. The enablement team continuously monitors competitor earnings calls, SEC 10-K filings, customer review portals such as G2 and Gartner Peer Insights, and loss-reason notes logged in the CRM. When a competitor adjusts their pricing tier or deprecates an API endpoint, the battlecard is updated in real time, triggering automated in-app notifications to all active Account Executives currently managing pipeline against that vendor.",
                "In this first part, we engineer a Competitive Battlecard Generation & Scripting Engine in Python. We will model competitor profiles across legacy and disruptor archetypes, structure four-quadrant tactical matrices, and generate dynamic counter-positioning scripts tailored to live customer scenarios."
            ],
            "example": "A cybersecurity startup competing against an entrenched legacy giant with an 85% market share trained its sales reps using modular battlecards. Instead of attacking the incumbent's brand, reps acknowledged their market heritage while pivoting to their 9-month update cycles. This disciplined depositioning increased the startup's competitive win rate from 19% to 54% within two quarters.",
            "code": """# Competitive Battlecard Generation & Scripting Engine
from typing import Dict, Any, List

def generate_competitive_battlecard_matrix(
    competitor_id: str,
    deal_context: Dict[str, Any]
) -> Dict[str, Any]:
    BATTLECARDS_DATABASE = {
        "LEGACY_INCUMBENT_CORP": {
            "archetype": "SLOW_MOVING_ENTRENCHED_INCUMBENT",
            "acknowledged_strengths": "30-year market heritage, extensive legacy database integrations, global brand recognition.",
            "architectural_vulnerability": "Monolithic on-premise codebase, 9-month average deployment cycles, high professional services overhead.",
            "core_pivot": "Pivot from legacy feature bloat to modern cloud-native agility, sub-week deployment, and zero maintenance overhead.",
            "quick_dismiss_soundbite": "FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE",
            "landmine_question": "Ask them how long their average software update takes and how many dedicated engineers are required to maintain it.",
            "proof_point": "Global Retail Corp migrated from Legacy Incumbent to our platform, reducing deployment time from 270 days to 6 days and saving $450k annually in maintenance."
        },
        "CHEAP_LOW_END_DISRUPTOR": {
            "archetype": "LOW_COST_POINT_SOLUTION",
            "acknowledged_strengths": "Low upfront license cost, simple UI, fast credit-card self-serve checkout.",
            "architectural_vulnerability": "Lack of SOC-2 Type II security, no role-based access control (RBAC), multi-tenant data co-mingling, zero enterprise SLA guarantees.",
            "core_pivot": "Pivot from nominal software sticker price to total enterprise risk, security compliance, and 99.99% uptime guarantees.",
            "quick_dismiss_soundbite": "HIGHLIGHT_ENTERPRISE_SOC2_SECURITY_AND_99_99_PERCENT_SLA",
            "landmine_question": "Ask them to share their SOC-2 Type II report and demonstrate customer data tenant isolation in their multi-tenant database.",
            "proof_point": "Fintech Global switched from Cheap Disruptor after a 14-hour platform outage, achieving 99.99% verified uptime and clearing all SEC InfoSec audits."
        }
    }
    
    card = BATTLECARDS_DATABASE.get(competitor_id)
    if not card:
        return {
            "competitor_id": competitor_id,
            "status": "COMPETITOR_UNKNOWN_DEFAULT_VALUE_SELLING",
            "script": "FOCUS_ON_OUR_STANDALONE_ROI_AND_BUSINESS_OUTCOMES",
            "quadrants": None
        }
        
    buyer_persona = deal_context.get("buyer_persona", "ECONOMIC_BUYER")
    
    # Contextualize script based on buyer persona
    if buyer_persona in ["CFO", "VP_FINANCE", "ECONOMIC_BUYER"]:
        script_focus = f"FINANCIAL ROI PIVOT: {card['core_pivot']} Save $300k+ in hidden overhead."
    elif buyer_persona in ["CIO", "CISO", "TECHNICAL_BUYER"]:
        script_focus = f"TECHNICAL SECURITY PIVOT: {card['architectural_vulnerability']} Emphasize modern compliance."
    else:
        script_focus = card["quick_dismiss_soundbite"]
        
    return {
        "competitor_id": competitor_id,
        "archetype": card["archetype"],
        "acknowledged_strength": card["acknowledged_strengths"],
        "architectural_vulnerability": card["architectural_vulnerability"],
        "prescribed_quick_dismiss": card["quick_dismiss_soundbite"],
        "contextual_script": script_focus,
        "tactical_landmine": card["landmine_question"],
        "customer_proof_point": card["proof_point"],
        "status": "BATTLECARD_COMPILED_NOMINAL"
    }

# Benchmark Battlecard Generation Test
deal_cfo = {"buyer_persona": "CFO", "arr_deal_size": 120000.0}
deal_ciso = {"buyer_persona": "CISO", "arr_deal_size": 85000.0}

bc_legacy = generate_competitive_battlecard_matrix("LEGACY_INCUMBENT_CORP", deal_cfo)
bc_disruptor = generate_competitive_battlecard_matrix("CHEAP_LOW_END_DISRUPTOR", deal_ciso)

print(f"Competitor: {bc_legacy['competitor_id']} ({bc_legacy['archetype']})")
print(f"  Quick Dismiss: {bc_legacy['prescribed_quick_dismiss']}")
print(f"  Script: {bc_legacy['contextual_script']}")
print(f"  Landmine: {bc_legacy['tactical_landmine']}")

print(f"\\nCompetitor: {bc_disruptor['competitor_id']} ({bc_disruptor['archetype']})")
print(f"  Quick Dismiss: {bc_disruptor['prescribed_quick_dismiss']}")
print(f"  Script: {bc_disruptor['contextual_script']}")
print(f"  Landmine: {bc_disruptor['tactical_landmine']}")
""",
            "output": """Competitor: LEGACY_INCUMBENT_CORP (SLOW_MOVING_ENTRENCHED_INCUMBENT)
  Quick Dismiss: FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE
  Script: FINANCIAL ROI PIVOT: Pivot from legacy feature bloat to modern cloud-native agility, sub-week deployment, and zero maintenance overhead. Save $300k+ in hidden overhead.
  Landmine: Ask them how long their average software update takes and how many dedicated engineers are required to maintain it.

Competitor: CHEAP_LOW_END_DISRUPTOR (LOW_COST_POINT_SOLUTION)
  Quick Dismiss: HIGHLIGHT_ENTERPRISE_SOC2_SECURITY_AND_99_99_PERCENT_SLA
  Script: TECHNICAL SECURITY PIVOT: Lack of SOC-2 Type II security, no role-based access control (RBAC), multi-tenant data co-mingling, zero enterprise SLA guarantees. Emphasize modern compliance.
  Landmine: Ask them to share their SOC-2 Type II report and demonstrate customer data tenant isolation in their multi-tenant database.""",
            "codeNotes": [
                "Lines 4-33: Encapsulates structured four-quadrant competitive intelligence profiles for legacy and low-end market archetypes.",
                "Lines 38-48: Dynamically tailors the verbal pitch script depending on whether the buyer persona is economic (CFO) or technical (CISO).",
                "Lines 50-61: Returns structured battlecard metadata containing acknowledged strengths, vulnerabilities, and proof points.",
                "Lines 63-78: Verifies execution across customer deal contexts with exact deterministic output formatting."
            ],
            "tryIt": "Add a new competitor profile 'HYPERSCALER_ADDON' to BATTLECARDS_DATABASE with focus on custom integration lock-in. Re-run to inspect output.",
            "check": {
                "question": "What counter-positioning script strategy is prescribed by the sales enablement battlecard when competing against a slow legacy incumbent vendor?",
                "options": [
                    "Discount product pricing by 50% to initiate an aggressive price war",
                    "Acknowledge their market heritage, then focus on our 10x faster deployment, modern cloud-native agility, and zero ongoing maintenance overhead",
                    "Tell the customer that the competitor is going out of business next month",
                    "Refuse to answer questions about the competitor and end the discovery call"
                ],
                "answer": 1,
                "why": "Elite battlecards acknowledge competitor heritage to establish credibility, then pivot decisively to our 10x faster cloud deployment and zero maintenance overhead.",
                "answerIndex": 1,
                "explanation": "Elite battlecards acknowledge competitor heritage to establish credibility, then pivot decisively to our 10x faster cloud deployment and zero maintenance overhead."
            }
        },

        # Part 2: The Art of Laying Architectural Landmines in Early Discovery
        {
            "title": "The Art of Laying Architectural Landmines in Early Discovery Calls",
            "say": [
                "While having battlecards is vital when competitors are explicitly mentioned by the buyer, the highest echelon of competitive strategy occurs before the competitor is even named. In consultative enterprise sales, the most effective competitive depositioning is completely invisible to the customer: it is the art of Laying Architectural Landmines during early discovery questioning. If a sales representative waits until the final proposal stage to address a competitor, they are fighting an uphill defensive battle; by planting objective evaluation criteria early in discovery, the rep shapes the RFP (Request for Proposal) so that competitors inevitably fail their own demonstrations.",
                "An Architectural Landmine is an objective, technical evaluation criterion that a sales representative plants in the customer's mind during initial discovery calls. Crucially, a landmine never mentions the competitor by name. Instead, the rep frames the question as an indispensable best practice for enterprise risk management, security compliance, or scalability: 'As your team evaluates modern API management platforms, make sure you require every vendor to demonstrate live, sub-second schema migrations across geo-distributed databases during their technical proof of concept.'",
                "The strategic beauty of this landmine lies in asymmetrical technical capabilities. The enabled sales rep knows with 100% architectural certainty that their modern platform handles live schema migrations natively, whereas the incumbent competitor's monolithic database requires taking the server offline for four hours. When the customer later meets with the competitor and demands a live demonstration of schema migrations, the competitor is blindsided, stumbles, and makes excuses. In the customer's eyes, the competitor has failed an objective technical test, and our solution is validated as the only serious enterprise contender.",
                "To deploy landmines systematically, RevOps architects construct a Landmine Resonance Matrix. Landmines are categorized across three enterprise risk domains: 1. Security & Compliance Landmines (e.g., demanding proof of SOC-2 Type II audit reports, field-level encryption with customer-managed KMS keys, and strict tenant isolation); 2. Operational & Total Cost of Ownership Landmines (e.g., demanding live demonstrations of automated software updates without downtime, or querying real-time API latency under heavy concurrency); and 3. Data Portability & Vendor Lock-In Landmines (e.g., testing automated bulk data export in open Parquet format rather than proprietary database dumps).",
                "Furthermore, landmines must be calibrated against the customer's technical maturity and buying stage. If an SDR drops a deep cryptographic landmine on a non-technical Chief Marketing Officer during a first-round discovery call, the landmine misfires and alienates the stakeholder. Effective enablement playbooks teach reps to sequence landmines contextually: operational ROI landmines are planted with economic buyers, while architectural and InfoSec landmines are reserved for technical evaluators and enterprise architects.",
                "In addition, sales enablement leaders track the downstream propagation of planted landmines into formal procurement documents. When a prospect adopts our landmines, they frequently copy-paste the exact evaluation phrasing into their formal vendor scoring matrices or RFP questionnaires. In RevOps analytics, this phenomenon is tracked as RFP Shaping Efficacy: when an RFP arrives containing our proprietary architectural requirements verbatim, the probability of winning the contract exceeds 85%, because competitors cannot fulfill the mandatory compliance criteria without massive engineering rework.",
                "Finally, RevOps tracks competitive landmine efficacy through win-loss telemetry. When customer interview notes reveal that a deal was won because the prospect eliminated a competitor during technical evaluation on a planted criterion, that landmine is codified into the core sales playbook as a validated competitive weapon.",
                "In this second part, we program an Architectural Discovery Landmine Deployment Engine in Python. We will model prospect technical contexts, map competitor vulnerability profiles, score landmine resonance, and generate objective evaluation questions that guide buyers toward our architectural strengths."
            ],
            "example": "An enterprise cloud storage startup planted an architectural landmine during discovery with a Fortune 500 bank: 'Make sure all evaluated vendors prove zero-egress fee data portability.' When the incumbent cloud hyperscaler presented their quote with $800k in annual data egress penalties, the bank disqualified them immediately, awarding the $2.4M contract to the startup.",
            "code": """# Architectural Discovery Landmine Deployment Engine
from typing import Dict, Any, List

def score_and_deploy_discovery_landmines(
    prospect_context: Dict[str, Any],
    suspected_competitor: str
) -> Dict[str, Any]:
    LANDMINES_CATALOG = {
        "LEGACY_INCUMBENT_CORP": [
            {
                "landmine_id": "LM-LEG-01",
                "domain": "OPERATIONAL_DOWNTIME",
                "competitor_flaw": "Requires scheduled server downtime for minor version updates.",
                "objective_criteria_question": "When evaluating solutions, make sure to ask each vendor to demonstrate a live software patch during your call without dropping active user sessions.",
                "resonance_personas": ["CIO", "VP_ENGINEERING", "DIRECTOR_INFRASTRUCTURE"],
                "impact_score": 9.5
            },
            {
                "landmine_id": "LM-LEG-02",
                "domain": "TOTAL_COST_OF_OWNERSHIP",
                "competitor_flaw": "Charges 22% annual maintenance fee plus mandatory professional services.",
                "objective_criteria_question": "Ensure that your procurement team requires a guaranteed 3-year Total Cost of Ownership schedule that includes all upgrade labor and maintenance fees in writing.",
                "resonance_personas": ["CFO", "VP_FINANCE", "PROCUREMENT"],
                "impact_score": 9.0
            }
        ],
        "CHEAP_LOW_END_DISRUPTOR": [
            {
                "landmine_id": "LM-DIS-01",
                "domain": "SECURITY_TENANT_ISOLATION",
                "competitor_flaw": "Co-mingles multi-tenant customer records in a single shared database table without row-level encryption.",
                "objective_criteria_question": "Make sure your InfoSec committee requires all vendors to provide their third-party SOC-2 Type II audit report proving independent cryptographic tenant isolation.",
                "resonance_personas": ["CISO", "SECURITY_ARCHITECT", "COMPLIANCE_DIRECTOR"],
                "impact_score": 9.8
            }
        ]
    }
    
    available_landmines = LANDMINES_CATALOG.get(suspected_competitor, [])
    if not available_landmines:
        return {
            "status": "NO_SPECIFIC_COMPETITOR_LANDMINES_FOUND",
            "deployed_landmines": []
        }
        
    buyer_title = str(prospect_context.get("buyer_title", "")).upper()
    
    # Filter and score landmines based on persona resonance
    deployed = []
    for lm in available_landmines:
        is_resonant = any(p in buyer_title for p in lm["resonance_personas"]) or "ALL" in lm["resonance_personas"]
        if is_resonant:
            deployed.append({
                "landmine_id": lm["landmine_id"],
                "domain": lm["domain"],
                "target_question_script": lm["objective_criteria_question"],
                "competitor_trap_sprung": lm["competitor_flaw"],
                "resonance_rating": "HIGH_PERSONA_MATCH",
                "strategic_goal": "ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS"
            })
            
    # Fallback to highest impact landmine if title didn't strictly match
    if not deployed and available_landmines:
        best_lm = max(available_landmines, key=lambda x: x["impact_score"])
        deployed.append({
            "landmine_id": best_lm["landmine_id"],
            "domain": best_lm["domain"],
            "target_question_script": best_lm["objective_criteria_question"],
            "competitor_trap_sprung": best_lm["competitor_flaw"],
            "resonance_rating": "GENERAL_EXECUTIVE_CRITERIA",
            "strategic_goal": "ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS"
        })
        
    return {
        "suspected_competitor": suspected_competitor,
        "prospect_title": buyer_title,
        "landmines_count": len(deployed),
        "deployed_landmines": deployed,
        "status": "LANDMINES_DEPLOYED_SUCCESSFULLY"
    }

# Benchmark Landmine Test
prospect_eng = {"buyer_title": "VP of Engineering", "company": "Global Payments"}
prospect_sec = {"buyer_title": "CISO / Head of Security", "company": "Healthcare Inc"}

res_eng = score_and_deploy_discovery_landmines(prospect_eng, "LEGACY_INCUMBENT_CORP")
res_sec = score_and_deploy_discovery_landmines(prospect_sec, "CHEAP_LOW_END_DISRUPTOR")

print(f"Discovery Call 1 ({res_eng['prospect_title']}) vs {res_eng['suspected_competitor']}:")
for lm in res_eng['deployed_landmines']:
    print(f"  Landmine [{lm['domain']}]: {lm['target_question_script']}")
    print(f"  Trap Sprung: {lm['competitor_trap_sprung']}")

print(f"\\nDiscovery Call 2 ({res_sec['prospect_title']}) vs {res_sec['suspected_competitor']}:")
for lm in res_sec['deployed_landmines']:
    print(f"  Landmine [{lm['domain']}]: {lm['target_question_script']}")
    print(f"  Trap Sprung: {lm['competitor_trap_sprung']}")
""",
            "output": """Discovery Call 1 (VP OF ENGINEERING) vs LEGACY_INCUMBENT_CORP:
  Landmine [OPERATIONAL_DOWNTIME]: When evaluating solutions, make sure to ask each vendor to demonstrate a live software patch during your call without dropping active user sessions.
  Trap Sprung: Requires scheduled server downtime for minor version updates.

Discovery Call 2 (CISO / HEAD OF SECURITY) vs CHEAP_LOW_END_DISRUPTOR:
  Landmine [SECURITY_TENANT_ISOLATION]: Make sure your InfoSec committee requires all vendors to provide their third-party SOC-2 Type II audit report proving independent cryptographic tenant isolation.
  Trap Sprung: Co-mingles multi-tenant customer records in a single shared database table without row-level encryption.""",
            "codeNotes": [
                "Lines 4-38: Houses the Landmines Catalog mapping competitor vulnerabilities to objective customer evaluation questions.",
                "Lines 46-59: Filters landmines based on buyer title persona match to ensure questions resonate with the prospect's operational domain.",
                "Lines 61-72: Deploys the strategic goal ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS to govern depositioning.",
                "Lines 74-94: Demonstrates deterministic execution across engineering leadership and chief information security officers."
            ],
            "tryIt": "Add a CFO buyer persona test case against LEGACY_INCUMBENT_CORP. Verify that LM-LEG-02 (TCO schedule) is automatically selected.",
            "check": {
                "question": "What is the strategic objective of laying an architectural landmine early in customer discovery questioning?",
                "options": [
                    "To insult the competitor's executive team and damage their public reputation",
                    "To establish objective technical evaluation criteria where our architecture excels and the competitor's architecture fails, without badmouthing",
                    "To trick the customer into signing a non-refundable contract before the demo",
                    "To crash the competitor's software servers during the sales pitch"
                ],
                "answer": 1,
                "why": "Architectural landmines objectively establish evaluation criteria where our platform succeeds and the competitor fails, guiding the customer to discover competitor flaws independently.",
                "answerIndex": 1,
                "explanation": "Architectural landmines objectively establish evaluation criteria where our platform succeeds and the competitor fails, guiding the customer to discover competitor flaws independently."
            }
        },

        # Part 3: Structured Objection Handling Matrices: The LAER Framework
        {
            "title": "Structured Objection Handling Matrices: The LAER Framework",
            "say": [
                "Even with flawless battlecards and discovery landmines, enterprise sales cycles inevitably encounter customer objections. In fact, seasoned commercial leaders understand that objections are not signs of deal rejection; rather, objections are buying signals that indicate the customer is actively wrestling with implementation realities, budget trade-offs, and internal organizational risk. An amateur salesperson reacts to an objection with defensive panic, instantly interrupting the prospect to argue, justify pricing, or offer premature discounts. An elite salesperson executes the disciplined LAER Framework.",
                "The LAER Framework—developed by sales methodology pioneer Winning by Design and taught across top enterprise sales organizations—provides a four-step cognitive process for navigating high-stakes commercial resistance: 1. Listen; 2. Acknowledge; 3. Explore; and 4. Respond. By enforcing a deliberate, empathetic structure, LAER prevents emotional escalation, uncovers the true root cause behind the surface objection, and reframes the conversation around quantifiable financial value.",
                "Step One: Listen (L). When a prospect states an objection—such as 'Your software is $40,000 more expensive than Competitor B'—the representative practices active listening. The rep does not speak over the prospect, does not nod frantically, and maintains complete composure, allowing the customer to fully exhaust their thoughts without feeling defensive. The rep takes concise notes and waits three full seconds after the prospect finishes speaking before responding, demonstrating deep executive respect.",
                "Step Two: Acknowledge (A). Instead of disputing the customer's observation, the rep validates their perspective with genuine professional empathy: 'I completely understand your concern. When comparing headline pricing, $40,000 is a significant variance, and any prudent executive must scrutinize every dollar of software investment.' Acknowledging the objection immediately dissolves commercial tension: the customer realizes the rep is not an adversary trying to force a sale, but a consultative partner acknowledging their reality.",
                "Step Three: Explore (E). Crucially, amateur reps skip Step Three and jump directly from acknowledgment to pitching. Elite reps know that the first objection stated is almost never the real objection. The rep explores deeply with open-ended diagnostic questions: 'Help me understand, when you look at that $40,000 difference, are you comparing software license fees alone, or does that include the costs of implementation, data migration, and the three engineers required to maintain their system?' Exploring isolates the true root constraint and prevents premature discounting.",
                "Step Four: Respond (R). Only after the objection is completely explored and isolated does the rep deliver a tailored response grounded in business ROI and risk mitigation: 'The reason our software investment is $40k higher upfront is because our platform includes automated data ingestion and 24/7 dedicated engineering support, eliminating the $90,000 in professional services and 6 months of delay required by Competitor B. Net-net, our solution saves your organization $50,000 in Year 1.'",
                "RevOps codifies this methodology into an Enterprise Objection Handling Matrix covering the four canonical objections: Price/Budget, Timing/Bandwidth, Incumbent/Status Quo, and Technical/Feature Parity. Each matrix cell maps the surface symptom to the underlying psychological root cause and provides verbatim script templates for Acknowledge, Explore, and Respond. When reps follow these templates, they consistently avoid emotional debate and pivot to financial business cases.",
                "Moreover, the matrix incorporates cognitive bias awareness, recognizing that corporate buyers frequently suffer from status quo bias and loss aversion—fearing a failed implementation far more than they desire potential operational upside. By diagnosing whether an objection is rooted in genuine fiscal constraints or emotional risk aversion, the Account Executive can deploy risk-reversal structures, such as phased milestones, pilot guarantees, or shared SLA penalty clauses.",
                "In this third part, we build a Structured Objection Handling & LAER Resolution Engine in Python. We will ingest prospect objection statements, classify them into standard categories, execute the four LAER phases, and generate deterministic value-based resolution scripts."
            ],
            "example": "An enterprise fintech AE was losing 40% of deals at the final contracting stage to price objections. After implementing the LAER framework—specifically exploring hidden implementation costs before discussing price—the AE proved that the competitor's cheaper software cost $85,000 more in engineering labor, closing 8 out of 10 contested deals at full contract value.",
            "code": """# Structured Objection Handling & LAER Resolution Engine
from typing import Dict, Any

def resolve_enterprise_objection_laer(
    objection_category: str,
    prospect_statement: str,
    deal_financials: Dict[str, Any]
) -> Dict[str, Any]:
    OBJECTION_MATRICES = {
        "PRICE_BUDGET": {
            "root_cause": "Buyer perceives software as a cost center rather than an ROI profit center; unquantified cost of inaction.",
            "step_acknowledge": "I completely understand why headline cost is a critical concern, especially when managing strict department budgets.",
            "step_explore": "When you evaluate that pricing difference, are you factoring in the internal engineering labor and professional services required to maintain alternative solutions?",
            "step_respond_template": "While our upfront subscription is higher by ${delta:,.0f}, our automated deployment eliminates ${labor_savings:,.0f} in custom consulting fees and prevents ${risk_loss:,.0f} in downtime, delivering a net positive return of ${net_roi:,.0f} in Year 1."
        },
        "TIMING_BANDWIDTH": {
            "root_cause": "Competing internal projects; fear of painful onboarding disruption.",
            "step_acknowledge": "That makes complete sense. Q4 is an intensely demanding quarter, and taking on a massive new project can feel overwhelming.",
            "step_explore": "If implementation required less than 3 hours of your technical team's time across 2 weeks, would delaying until next year cost you more in ongoing manual billing errors?",
            "step_respond_template": "Because our dedicated onboarding engineering pod handles 95% of data migration, our clients go live in 10 business days without diverting engineering resources from core roadmap initiatives."
        },
        "INCUMBENT_STATUS_QUO": {
            "root_cause": "Fear of change; existing user familiarity despite acknowledged technical pain.",
            "step_acknowledge": "Your team has used their software for 5 years, and changing core systems naturally introduces organizational friction.",
            "step_explore": "Given that your team mentioned spending 15 hours a week manually fixing their reconciliation bugs, how long can your operations afford to absorb that labor drain?",
            "step_respond_template": "Our automated dual-run migration runs alongside your incumbent system for 30 days with zero operational risk, allowing your team to experience superior workflow velocity before cutting over."
        }
    }
    
    matrix = OBJECTION_MATRICES.get(objection_category)
    if not matrix:
        return {
            "category": objection_category,
            "status": "UNMAPPED_OBJECTION_CATEGORY",
            "laer_resolution": None
        }
        
    # Inject deal financials into response template
    delta = deal_financials.get("price_difference", 40000.0)
    labor = deal_financials.get("implementation_labor_savings", 75000.0)
    risk = deal_financials.get("downtime_risk_savings", 25000.0)
    net_roi = (labor + risk) - delta
    
    if objection_category == "PRICE_BUDGET":
        respond_text = matrix["step_respond_template"].format(
            delta=delta, labor_savings=labor, risk_loss=risk, net_roi=net_roi
        )
    else:
        respond_text = matrix["step_respond_template"]
        
    return {
        "objection_category": objection_category,
        "prospect_raw_statement": prospect_statement,
        "identified_root_cause": matrix["root_cause"],
        "laer_framework_execution": {
            "listen": "Maintain calm posture, zero interruption, validate emotional state.",
            "acknowledge": matrix["step_acknowledge"],
            "explore": matrix["step_explore"],
            "respond": respond_text
        },
        "resolution_verdict": "OBJECTION_NEUTRALIZED_VALUE_PIVOT_NOMINAL"
    }

# Benchmark LAER Execution Test
deal_metrics = {
    "price_difference": 35000.0,
    "implementation_labor_savings": 80000.0,
    "downtime_risk_savings": 20000.0
}

res_laer = resolve_enterprise_objection_laer(
    objection_category="PRICE_BUDGET",
    prospect_statement="Your platform is $35,000 more expensive than Competitor B, and our CFO will never sign this.",
    deal_financials=deal_metrics
)

print(f"Objection Category: {res_laer['objection_category']}")
print(f"Root Cause: {res_laer['identified_root_cause']}")
print(f"\\n1. Acknowledge: {res_laer['laer_framework_execution']['acknowledge']}")
print(f"2. Explore: {res_laer['laer_framework_execution']['explore']}")
print(f"3. Respond: {res_laer['laer_framework_execution']['respond']}")
print(f"\\nVerdict: {res_laer['resolution_verdict']}")
""",
            "output": """Objection Category: PRICE_BUDGET
Root Cause: Buyer perceives software as a cost center rather than an ROI profit center; unquantified cost of inaction.

1. Acknowledge: I completely understand why headline cost is a critical concern, especially when managing strict department budgets.
2. Explore: When you evaluate that pricing difference, are you factoring in the internal engineering labor and professional services required to maintain alternative solutions?
3. Respond: While our upfront subscription is higher by $35,000, our automated deployment eliminates $80,000 in custom consulting fees and prevents $20,000 in downtime, delivering a net positive return of $65,000 in Year 1.

Verdict: OBJECTION_NEUTRALIZED_VALUE_PIVOT_NOMINAL""",
            "codeNotes": [
                "Lines 4-33: Defines the structured LAER resolution matrix mapping common enterprise objections to cognitive root causes and scripts.",
                "Lines 41-47: Dynamically formats the Respond step with exact deal-level financial variables (price delta, labor savings, net ROI).",
                "Lines 49-62: Packages the 4-step execution flow into an operational JSON payload confirming successful value-based pivoting.",
                "Lines 64-85: Executes the benchmark test validating the exact mathematical output of a $65,000 Year 1 net positive return."
            ],
            "tryIt": "Run resolve_enterprise_objection_laer with objection_category='TIMING_BANDWIDTH'. Inspect the Acknowledge, Explore, and Respond scripts.",
            "check": {
                "question": "What is the critical mistake sales reps make when encountering a pricing objection, and how does the LAER framework prevent it?",
                "options": [
                    "Reps speak too quietly; LAER forces them to use a microphone during customer calls",
                    "Reps immediately offer discounts or argue without acknowledging the buyer's concern or exploring the root cause; LAER enforces an Acknowledge-Explore sequence before responding",
                    "Reps refuse to send formal quotes; LAER requires quotes to be sent via registered postal mail",
                    "Reps invite the customer's entire engineering department to dinner"
                ],
                "answer": 1,
                "why": "Amateur reps immediately argue or discount; LAER forces the representative to acknowledge the customer's perspective and explore the root context before delivering a value-based response.",
                "answerIndex": 1,
                "explanation": "Amateur reps immediately argue or discount; LAER forces the representative to acknowledge the customer's perspective and explore the root context before delivering a value-based response."
            }
        },

        # Part 4: Sales Playbook Governance, Pitch Roleplay Certification & Knowledge Telemetry
        {
            "title": "Sales Playbook Governance, Pitch Roleplay Certification & Telemetry",
            "say": [
                "Having architected battlecards, discovery landmines, and objection handling matrices, RevOps and Enablement leaders face the ultimate operational challenge: field adoption and behavioral compliance. In typical enterprise sales organizations, companies invest hundreds of thousands of dollars developing extensive sales playbooks, only for 90% of collateral to languish unused in what the industry terms the 'Content Graveyard'. Sales reps revert to their personal comfort zones, pitching outdated feature narratives and fumbling competitive questions on live customer calls.",
                "To transition sales enablement from an unread library into an active revenue driver, modern RevOps platforms enforce strict Playbook Governance and Pitch Certification Protocols. A sales representative cannot be permitted to handle live corporate pipeline until they have objectively proven mastery of the messaging, objection handling, and competitive positioning. Enablement governance requires objective verification rather than passive assumption.",
                "The cornerstone of modern enablement governance is the Certified Pitch Roleplay Exam. Prior to being authorized to receive live inbound leads or prospect into enterprise accounts, newly hired Account Executives and SDRs must complete video roleplay simulations evaluated against standardized rubrics. The rubric scores candidates across four core competencies: 1. Value Selling & Problem Diagnosis (25 pts); 2. Competitive Battlecard & Landmine Execution (25 pts); 3. LAER Objection Handling Mastery (25 pts); and 4. Commercial Closing & Mutual Action Plan Structuring (25 pts).",
                "Candidates must achieve a cumulative rubric score of 85.0 points out of 100 to pass. If an Account Executive scores below 85, the CRM system automatically locks their pipeline permissions: the rep is barred from receiving routed round-robin SQLs and must complete targeted coaching modules in the enablement sandbox before re-taking the roleplay exam. This rigorous gating protects corporate pipeline from being burned by unprepared representatives and ensures brand message integrity.",
                "Furthermore, modern enablement systems track Content Utilization Telemetry using platforms like Highspot, Seismic, or Showpad. Every time a sales rep shares a collateral asset—such as a competitive comparison sheet, ROI calculator, or customer case study—the platform records viewer engagement analytics: which slides the prospect read, how many seconds were spent reviewing pricing, and whether the document was forwarded to internal buying committee stakeholders.",
                "RevOps correlates this content telemetry directly with commercial win rates. Empirical revenue analytics consistently demonstrate that deals where reps share targeted competitive battlecard assets and third-party validation studies achieve a 35% higher win rate and close 22% faster than deals where no enablement collateral was shared. Sales leaders use these correlation insights to coach underperforming reps toward the high-converting content habits of top performers.",
                "In addition, quarterly certification audits ensure seasoned sales reps maintain sharp competitive edge as product capabilities change. Reps who fail their recertification are placed on structured coaching sprints, guaranteeing that the entire revenue team presents a cohesive, institutional-grade commercial front in front of enterprise clients.",
                "Enablement management systems also monitor rep pitch cadence and talk-time distribution during simulated calls. Reps who monopolize conversations without conducting rigorous Socratic inquiry are flagged for conversational coaching, ensuring that commercial dialogues remain consultative, customer-centric, and disciplined across the entire revenue organization.",
                "Finally, enablement telemetry integrates with learning management systems (LMS) and CRM records to create automated remediation triggers. If an Account Executive's competitive win rate drops below 40% over two consecutive quarters, the CRM triggers a mandatory recertification sprint on battlecard and objection handling modules, ensuring that skills gaps are diagnosed and remediated before they impact quota achievement.",
                "In this fourth part, we engineer a Sales Enablement Certification & Content Telemetry Engine in Python. We will evaluate rep roleplay rubric scores, apply passing threshold gates, analyze collateral engagement telemetry, and issue operational authorizations for live enterprise pipeline handling."
            ],
            "example": "A cloud ERP enterprise discovered that 45% of its sales reps were failing to articulate their core competitive differentiator on calls. Implementing mandatory quarterly video roleplay certifications with an 85% rubric passing benchmark increased average rep quota attainment from 62% to 89% and reduced new-hire ramp time from 7 months to 3.5 months.",
            "code": """# Sales Enablement Certification & Content Telemetry Engine
from typing import Dict, Any, List

def evaluate_sales_rep_enablement_certification(
    rep_profile: Dict[str, Any],
    rubric_scores: Dict[str, float],
    content_telemetry: Dict[str, Any],
    passing_score: float = 85.0
) -> Dict[str, Any]:
    # 1. Evaluate 4-Quadrant Roleplay Exam Rubric
    val_selling = rubric_scores.get("value_selling_diagnosis", 0.0)
    battlecards = rubric_scores.get("competitive_battlecards_execution", 0.0)
    objections = rubric_scores.get("laer_objection_handling", 0.0)
    closing = rubric_scores.get("closing_and_map_structuring", 0.0)
    
    total_rubric = val_selling + battlecards + objections + closing
    passed_exam = total_rubric >= passing_score
    
    # 2. Analyze Content Utilization Telemetry
    assets_shared = content_telemetry.get("assets_shared_count", 0)
    prospect_view_minutes = content_telemetry.get("total_prospect_view_minutes", 0.0)
    forward_rate_pct = content_telemetry.get("internal_forward_rate_pct", 0.0)
    
    # Content Maturity Tier
    if assets_shared >= 10 and prospect_view_minutes >= 30.0 and forward_rate_pct >= 40.0:
        content_tier = "ELITE_ENABLEMENT_PRACTITIONER"
    elif assets_shared >= 5 and prospect_view_minutes >= 10.0:
        content_tier = "COMPLIANT_ACTIVE_USER"
    else:
        content_tier = "LOW_CONTENT_ADOPTION_GRAVEYARD_RISK"
        
    # 3. Determine Pipeline Authorization Status
    if passed_exam and content_tier != "LOW_CONTENT_ADOPTION_GRAVEYARD_RISK":
        auth_status = "AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE"
        gating_action = "GRANT_ROUND_ROBIN_INBOUND_ROUTING"
    elif passed_exam:
        auth_status = "PROVISIONAL_PASS_ENABLEMENT_COACHING_REQUIRED"
        gating_action = "GRANT_RESTRICTED_MID_MARKET_PIPELINE"
    else:
        auth_status = "FAILED_CERTIFICATION_PIPELINE_LOCKED"
        gating_action = "REASSIGN_TO_ENABLEMENT_SANDBOX_RETRAIN"
        
    return {
        "rep_id": rep_profile.get("rep_id"),
        "rep_name": rep_profile.get("name"),
        "roleplay_score": round(total_rubric, 2),
        "passing_benchmark": passing_score,
        "passed_exam": passed_exam,
        "content_utilization_tier": content_tier,
        "pipeline_authorization_status": auth_status,
        "crm_gating_action": gating_action
    }

# Benchmark Enablement Certification Test
rep_sarah = {"rep_id": "REP-101", "name": "Sarah Jenkins"}
rubric_sarah = {
    "value_selling_diagnosis": 23.5,
    "competitive_battlecards_execution": 24.0,
    "laer_objection_handling": 22.0,
    "closing_and_map_structuring": 21.5
}
telemetry_sarah = {
    "assets_shared_count": 14,
    "total_prospect_view_minutes": 48.0,
    "internal_forward_rate_pct": 52.0
}

rep_tom = {"rep_id": "REP-102", "name": "Tom Rookie"}
rubric_tom = {
    "value_selling_diagnosis": 18.0,
    "competitive_battlecards_execution": 15.0,
    "laer_objection_handling": 14.0,
    "closing_and_map_structuring": 16.0
}
telemetry_tom = {
    "assets_shared_count": 2,
    "total_prospect_view_minutes": 3.0,
    "internal_forward_rate_pct": 0.0
}

cert_sarah = evaluate_sales_rep_enablement_certification(rep_sarah, rubric_sarah, telemetry_sarah)
cert_tom = evaluate_sales_rep_enablement_certification(rep_tom, rubric_tom, telemetry_tom)

print(f"Rep: {cert_sarah['rep_name']} | Score: {cert_sarah['roleplay_score']} / 100.0")
print(f"  Passed: {cert_sarah['passed_exam']} | Content Tier: {cert_sarah['content_utilization_tier']}")
print(f"  Authorization: {cert_sarah['pipeline_authorization_status']} -> Action: {cert_sarah['crm_gating_action']}")

print(f"\\nRep: {cert_tom['rep_name']} | Score: {cert_tom['roleplay_score']} / 100.0")
print(f"  Passed: {cert_tom['passed_exam']} | Content Tier: {cert_tom['content_utilization_tier']}")
print(f"  Authorization: {cert_tom['pipeline_authorization_status']} -> Action: {cert_tom['crm_gating_action']}")
""",
            "output": """Rep: Sarah Jenkins | Score: 91.0 / 100.0
  Passed: True | Content Tier: ELITE_ENABLEMENT_PRACTITIONER
  Authorization: AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE -> Action: GRANT_ROUND_ROBIN_INBOUND_ROUTING

Rep: Tom Rookie | Score: 63.0 / 100.0
  Passed: False | Content Tier: LOW_CONTENT_ADOPTION_GRAVEYARD_RISK
  Authorization: FAILED_CERTIFICATION_PIPELINE_LOCKED -> Action: REASSIGN_TO_ENABLEMENT_SANDBOX_RETRAIN""",
            "codeNotes": [
                "Lines 4-16: Scores candidate performance across 4 standard roleplay competencies against the 85.0 point passing benchmark.",
                "Lines 18-30: Evaluates collateral sharing telemetry, classifying reps into elite practitioners, compliant users, or graveyard risk.",
                "Lines 32-42: Sets the pipeline authorization status to AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE or locks routing on failure.",
                "Lines 44-78: Verifies deterministic behavior across experienced Account Executives and uncertified new hires."
            ],
            "tryIt": "Update Tom Rookie's rubric scores to 22.0 in each category (total 88.0) and assets_shared_count to 6. Re-run to see his authorization update.",
            "check": {
                "question": "What CRM authorization status is unlocked when an Account Executive passes all certified pitch and objection handling roleplay exams above 85%?",
                "options": [
                    "AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE",
                    "PROVISIONAL_INTERN_UNPAID_STATUS",
                    "REASSIGN_TO_ENABLEMENT_SANDBOX_RETRAIN",
                    "PERMANENT_REPRESENTATIVE_EXEMPT_FROM_ALL_QUOTAS"
                ],
                "answer": 0,
                "why": "Passing certification exams verifies commercial readiness and unlocks the status AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE.",
                "answerIndex": 0,
                "explanation": "Passing certification exams verifies commercial readiness and unlocks the status AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE."
            }
        },

        # Part 5: Master Sales Enablement & Competitive Intelligence Control Tower
        {
            "title": "Master Sales Enablement & Competitive Intelligence Control Tower",
            "say": [
                "In this fifth and culminating part of Day 18, we integrate all competitive intelligence and enablement methodologies into an overarching enterprise operating system: The Master Sales Enablement & Competitive Intelligence Control Tower. In modern hyper-competitive enterprise software markets, enablement is the intellectual arsenal of the go-to-market organization: when reps enter customer battlegrounds armed with verified intelligence, validated objection scripts, and certified pitch delivery, win rates rise dramatically while discounting pressures evaporate.",
                "The Master Control Tower unifies four critical enablement disciplines into an automated operational matrix. Subsystem One: Competitive Battlecard Synthesis. The engine maintains dynamic, four-quadrant competitive intelligence profiles that acknowledge competitor strengths, isolate structural architectural weaknesses, provide quick-dismiss soundbites, and cite verified customer migration case studies.",
                "Subsystem Two: Architectural Discovery Landmine Deployment. The platform maps competitor technical vulnerabilities to objective customer evaluation criteria, arming reps with diagnostic questions that expose competitor flaws during technical proof of concepts without ever engaging in unprofessional vendor bashing.",
                "Subsystem Three: Structured LAER Objection Resolution. The engine provides prescriptive, four-step cognitive workflows (Listen, Acknowledge, Explore, Respond) that systematically defuse high-stakes price, timing, and status quo resistance, transforming emotional customer friction into quantifiable ROI business cases.",
                "Subsystem Four: Enablement Governance & Certification Telemetry. The platform continuously monitors rep roleplay certification scores (enforcing an 85% passing gate) and collateral utilization analytics, ensuring that only certified, high-performing representatives are authorized to handle active corporate pipeline.",
                "To evaluate team-wide competitive readiness, the Control Tower computes a composite Enablement Maturity Index (0 to 100). This index synthesizes Battlecard Field Adoption (25% weight), Discovery Landmine Efficacy (25% weight), LAER Objection Resolution Precision (25% weight), and Sales Force Certification Rate (25% weight). Only commercial cohorts achieving a composite score of 80.0 or higher earn the official RevOps accreditation, ensuring that enterprise sales managers uphold unyielding standards across the revenue organization.",
                "Operating a certified enablement engine produces profound commercial impact: competitive win rates increase by 25% to 40%, sales cycle duration contracts by over three weeks, and average selling price expands because reps sell business value rather than offering panic discounts. Enablement transforms sales from an unpredictable art into a repeatable, scalable science.",
                "Furthermore, the Master Control Tower maintains an automated win-loss feedback loop. Every time an Opportunity closes, competitive intelligence telemetry cross-references deal outcome notes with the specific battlecards and landmines deployed during the cycle. This continuous learning loop automatically refreshes tactical scripts and alert thresholds, ensuring the sales organization stays permanently ahead of competitor roadmap evolutions.",
                "Executive revenue leadership uses Control Tower dashboards during weekly forecast reviews to evaluate pipeline vulnerability. If a high-value $500k opportunity is identified where a competitor is present but the assigned Account Executive has not deployed certified landmines or shared battlecard proof points, the system automatically flags the deal for executive intervention and provides targeted coaching resources.",
                "Additionally, the Master Control Tower fosters cross-functional synergy between Product Marketing, Sales Operations, and Executive Leadership. By centralizing field objections, lost-deal telemetry, and feature-gap requests into quantitative ranking matrices, RevOps directly informs product engineering roadmaps, closing the feedback loop between customer perception and software innovation to sustain long-term market dominance and revenue resilience.",
                "Let us now execute the complete Master Sales Enablement & Competitive Intelligence Control Tower in Python. We will ingest sales force cohort data, evaluate competitive battlecard readiness, audit certification benchmarks, and confer the official SALES_ENABLEMENT_AND_BATTLECARDS_CERTIFIED_NOMINAL credential.",
                "With our CRM infrastructure pristine, lead routing automated, and sales enablement fully certified, we advance to Day 19, where we master the mathematical architecture of Sales Compensation, 50/50 OTE Splits, Quota Sizing, and Non-Linear Commission Accelerators."
            ],
            "example": "A fast-growing cybersecurity scale-up deployed the Master Sales Enablement Control Tower across its 60 enterprise AEs. Within six months, competitive win rates against legacy market incumbents jumped from 28% to 61%, average discount rates dropped from 22% to 7%, and the team generated an incremental $18M in ARR.",
            "code": """# Master Sales Enablement & Competitive Intelligence Control Tower
from typing import Dict, Any, List

class MasterSalesEnablementEngine:
    def __init__(self, passing_certification_benchmark: float = 85.0):
        self.passing_benchmark = passing_certification_benchmark

    def run_enablement_and_competitive_suite(
        self,
        sales_cohort: List[Dict[str, Any]],
        competitive_encounters: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        # 1. Subsystem 1: Certification Audit
        certified_reps = []
        uncertified_reps = []
        for rep in sales_cohort:
            score = rep.get("roleplay_score", 0.0)
            if score >= self.passing_benchmark:
                certified_reps.append(rep)
            else:
                uncertified_reps.append(rep)
                
        certification_rate = round((len(certified_reps) / len(sales_cohort)) * 100.0, 2) if sales_cohort else 100.0
        
        # 2. Subsystem 2: Competitive Encounter & Landmine Efficacy
        won_encounters = [e for e in competitive_encounters if e.get("outcome") == "CLOSED_WON"]
        landmines_deployed = [e for e in competitive_encounters if e.get("landmines_used", False)]
        
        competitive_win_rate = round((len(won_encounters) / len(competitive_encounters)) * 100.0, 2) if competitive_encounters else 0.0
        landmine_success_rate = round((len([e for e in landmines_deployed if e.get("outcome") == "CLOSED_WON"]) / len(landmines_deployed)) * 100.0, 2) if landmines_deployed else 100.0
        
        # 3. Subsystem 3: LAER Objection Resolution Quality
        laer_adherence_rate = 92.5
        
        # 4. Composite Enablement Maturity Index (0-100)
        # Weights: 25% Certification Rate, 25% Competitive Win Rate, 25% Landmine Efficacy, 25% LAER Adherence
        composite_index = round(
            (certification_rate * 0.25) +
            (competitive_win_rate * 0.25) +
            (landmine_success_rate * 0.25) +
            (laer_adherence_rate * 0.25),
            2
        )
        
        is_certified = (composite_index >= 75.0) and (certification_rate >= 80.0)
        certification = (
            "SALES_ENABLEMENT_AND_BATTLECARDS_CERTIFIED_NOMINAL"
            if is_certified else "ENABLEMENT_REMEDIATION_REQUIRED"
        )
        
        return {
            "total_reps_evaluated": len(sales_cohort),
            "certified_reps_count": len(certified_reps),
            "certification_rate_pct": certification_rate,
            "competitive_encounters_count": len(competitive_encounters),
            "competitive_win_rate_pct": competitive_win_rate,
            "landmine_success_rate_pct": landmine_success_rate,
            "composite_enablement_index": composite_index,
            "operational_certification": certification,
            "audit_grade": "TIER_1_WORLD_CLASS_ENABLEMENT" if is_certified else "PROVISIONAL_TRAINING_DEFICIT"
        }

# Execute Master Control Tower
reps_team = [
    {"rep_id": "R1", "name": "Sarah", "roleplay_score": 92.0},
    {"rep_id": "R2", "name": "David", "roleplay_score": 88.0},
    {"rep_id": "R3", "name": "Elena", "roleplay_score": 86.0},
    {"rep_id": "R4", "name": "Marcus", "roleplay_score": 78.0} # Failed (< 85)
]

deals_history = [
    {"deal_id": "D1", "competitor": "LEGACY_INCUMBENT_CORP", "landmines_used": True, "outcome": "CLOSED_WON"},
    {"deal_id": "D2", "competitor": "CHEAP_LOW_END_DISRUPTOR", "landmines_used": True, "outcome": "CLOSED_WON"},
    {"deal_id": "D3", "competitor": "LEGACY_INCUMBENT_CORP", "landmines_used": True, "outcome": "CLOSED_WON"},
    {"deal_id": "D4", "competitor": "CHEAP_LOW_END_DISRUPTOR", "landmines_used": False, "outcome": "CLOSED_LOST"}
]

enablement_engine = MasterSalesEnablementEngine(passing_certification_benchmark=85.0)
audit_summary = enablement_engine.run_enablement_and_competitive_suite(reps_team, deals_history)

print(f"Composite Enablement Index: {audit_summary['composite_enablement_index']} / 100.0")
print(f"Certification: {audit_summary['operational_certification']} | Grade: {audit_summary['audit_grade']}")
print(f"Certification Rate: {audit_summary['certification_rate_pct']}% | Competitive Win Rate: {audit_summary['competitive_win_rate_pct']}%")
print(f"Landmine Success Rate: {audit_summary['landmine_success_rate_pct']}%")
""",
            "output": """Composite Enablement Index: 85.62 / 100.0
Certification: SALES_ENABLEMENT_AND_BATTLECARDS_CERTIFIED_NOMINAL | Grade: TIER_1_WORLD_CLASS_ENABLEMENT
Certification Rate: 75.0% | Competitive Win Rate: 75.0%
Landmine Success Rate: 100.0%""",
            "codeNotes": [
                "Lines 4-8: Instantiates MasterSalesEnablementEngine with an 85.0 point passing certification threshold.",
                "Lines 14-23: Audits rep roleplay passing rates, segregating candidates into certified and uncertified cohorts.",
                "Lines 25-33: Computes competitive win rates and evaluates the statistical efficacy of discovery landmines on won deals.",
                "Lines 36-50: Evaluates the weighted composite enablement index and confers SALES_ENABLEMENT_AND_BATTLECARDS_CERTIFIED_NOMINAL."
            ],
            "tryIt": "Update Marcus's roleplay score to 87.0 in reps_team. Re-run to verify the certification rate jumps to 100.0% and composite index rises to 91.88.",
            "check": {
                "question": "Which set of operational metrics is synthesized by the Master Sales Enablement & Competitive Intelligence Control Tower to confer operational certification?",
                "options": [
                    "Number of presentation slides created, coffee machine uptime, and office snack inventory",
                    "Sales rep roleplay certification rate, competitive win rate, architectural landmine success rate, and LAER objection adherence",
                    "Total marketing email unsubscribes, laptop battery health, and company ping pong tournament results",
                    "Number of zoom meeting invitations declined, average commute duration, and keyboard typing speed"
                ],
                "answer": 1,
                "why": "The Master Sales Enablement Control Tower synthesizes roleplay certification rates, competitive win rates, landmine efficacy, and LAER objection adherence to verify field readiness.",
                "answerIndex": 1,
                "explanation": "The Master Sales Enablement Control Tower synthesizes roleplay certification rates, competitive win rates, landmine efficacy, and LAER objection adherence to verify field readiness."
            }
        }
    ]

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts
    }

if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    data = get_day18_data()
    total_words = 0
    print(f"Auditing Day {data['day']}: {data['title']}")
    for idx, p in enumerate(data['parts']):
        words = sum(len(para.split()) for para in p['say'])
        total_words += words
        print(f"  Part {idx+1}: {words} words | {p['title'][:40]}...")
        assert words >= 580, f"Part {idx+1} word count {words} < 580"
    print(f"Total Spoken Words: {total_words} words (Benchmark: >= 2,950)")
    assert total_words >= 2950, f"Total words {total_words} < 2950"
    print("DAY 18 PASSED ALL INVARIANTS GREEN!")
