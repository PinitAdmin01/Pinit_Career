import sys
import json
import hashlib

def get_day27_data() -> dict:
    day = 27
    title = "Advanced Sales Methodology: The Challenger Sale (Teach, Tailor, Take Control)"
    goal = "Master Matthew Dixon & Brent Adamson's Challenger Sale methodology, the empirical distribution of the 5 B2B sales profiles, the three core execution pillars (Commercial Teaching, Tailoring for Resonance, Taking Control), and the 6-step choreographic commercial pitch arc to dominate complex enterprise software transactions."
    minutes = 45
    recap = "In Day 26, we engineered technical outbound deliverability infrastructure: SPF/DKIM/DMARC DNS authentication, secondary domain quarantine, 21-day inbox warming, and 50-email daily caps. Today in Day 27, we conquer the psychological and conversational apex of modern B2B revenue generation: The Challenger Sale. Grounded in landmark CEB/Gartner research across 6,000 corporate sales representatives, we deconstruct why traditional 'Relationship Builders' systematically fail in complex multi-stakeholder enterprise deals, master Commercial Teaching to reframe buyer assumptions, tailor strategic narratives to the C-suite, and assert constructive commercial tension to command high-margin closes."

    parts = [
        {
            "title": "Empirical Foundations: Dixon & Adamson's Research & The 5 Sales Rep Profiles",
            "say": [
                "Welcome to Day 27 of Enterprise Sales, Customer Success and CRM. In the history of professional sales methodology, no study has revolutionized the understanding of B2B buying behavior more profoundly than the landmark research conducted by Matthew Dixon and Brent Adamson of the Corporate Executive Board (now Gartner). Following the 2008 global financial crisis, CEB surveyed over 6,000 corporate sales professionals and enterprise procurement leaders across 90 global enterprises. For decades, conventional sales wisdom held that 'selling is fundamentally about building relationships'—that charismatic reps who take prospects out to lavish dinners, remember their children's birthdays, and cater to every customer whim naturally achieve the highest quota attainments. The empirical data collected by Dixon and Adamson delivered a devastating, definitive refutation of this legacy myth. In complex enterprise B2B sales, relationship building not only fails to drive top performance; it is the single least effective sales approach in existence.",
                "The CEB research conducted rigorous factor analysis across 44 discrete rep skills, behaviors, and commercial attributes. The statistical clustering revealed that every B2B sales representative falls into one of five distinct behavioral profiles: The Hard Worker, The Lone Wolf, The Reactive Problem Solver, The Relationship Builder, and The Challenger. The Hard Worker (comprising approximately 21% of the sales population) is characterized by sheer kinetic effort: they arrive early, make 80 phone calls daily, log dozens of CRM tasks, and relentlessly execute outbound activity. The Lone Wolf (representing roughly 18%) is the mercurial, rule-breaking maverick: they refuse to follow standard CRM processes or submit administrative forecasts, yet they rely on raw natural instincts and aggressive charisma to drive numbers. The Reactive Problem Solver (comprising roughly 14%) operates like an elite customer service agent embedded in sales: they are deeply focused on post-sale operational details, tracking customer implementation tickets and troubleshooting software glitches rather than generating net-new enterprise pipeline.",
                "The fourth profile is The Relationship Builder, representing approximately 21% of the enterprise sales workforce. Relationship Builders are generous, highly likable, and deeply accommodating. Their primary psychological objective in sales conversations is to avoid conflict, generate goodwill, build internal friendships, and satisfy every customer request. When an enterprise prospect demands a feature concession, an extended free trial, or a 30% price discount, the Relationship Builder advocates internally on behalf of the customer rather than defending the vendor's economic margins. In low-complexity, transactional, commoditized environments, Relationship Builders perform adequately. However, in complex enterprise deals—characterized by multi-million-dollar commitments, multi-stakeholder Decision-Making Units (DMUs), and intense risk aversion—Relationship Builders completely collapse, accounting for less than 7% of all top performers.",
                "The fifth and dominant profile is The Challenger, representing 27% of the general sales population. Challengers approach commercial conversations through a radically different mental model. They do not seek customer approval or social validation; they seek intellectual respect. Challengers possess an intimate, rigorous understanding of the customer's business model, macro industry pressures, and operational cost drivers. Rather than asking passive, open-ended discovery questions ('What keeps you up at night?'), Challengers arrive at the meeting with a provocative point of view. They actively push prospects out of their comfort zones, challenge the customer's flawed operating assumptions, introduce disruptive industry insights, and assert constructive tension during commercial negotiations.",
                "When CEB isolated the top 20% of sales performers in complex enterprise sales environments, the statistical dominance of The Challenger was overwhelming: Challengers accounted for a staggering 54% of all top-performing sales representatives. Conversely, Relationship Builders represented a microscopic 4% to 7% of elite performers. Why does the Challenger dominate complex B2B deals? Because in modern enterprise software, buyers do not suffer from a lack of information; they suffer from cognitive overload, risk paralysis, and consensus gridlock across 6 to 10 executive stakeholders. An agreeable Relationship Builder who simply asks what the customer wants adds zero economic value. Enterprise executives desperately crave trusted commercial advisors who teach them what they *should* want, identify blind spots that are bleeding corporate cash, and guide them decisively to a superior commercial outcome.",
                "Understanding the five profiles provides sales leaders and revenue architects with a predictive diagnostic framework. Building an elite enterprise sales engine requires shifting rep hiring, training, enablement, and coaching away from passive relationship management toward active Challenger commercial execution. Over the remaining parts of today's curriculum, we deconstruct the three operational pillars that define Challenger mastery: Commercial Teaching, Tailoring for Resonance, and Taking Control."
            ],
            "example": "During a global procurement evaluation for a $1.2M cloud data warehouse, Vendor A's Account Executive (a classic Relationship Builder) spent four weeks taking the client's IT director to golf outings and agreeing to every custom feature request. Meanwhile, Vendor B's Account Executive (a disciplined Challenger) secured a 45-minute meeting with the Chief Financial Officer and delivered a provocative commercial teaching pitch proving that the client was overpaying by $450,000 annually due to un-indexed query compute sprawl. Vendor B reframed the entire RFP around automated workload optimization and took control of pricing, closing the $1.2M contract while Vendor A was eliminated despite four months of social goodwill.",
            "code": """# Enterprise Sales Rep Profile & Performance Distribution Analyzer
from typing import Dict, Any, List

def analyze_sales_rep_profile(
    rep_name: str,
    deal_complexity_tier: str,
    asserts_constructive_tension: bool,
    delivers_commercial_insight: bool,
    tailors_to_economic_buyer: bool,
    prioritizes_conflict_avoidance: bool,
    hours_spent_on_customer_support: float
) -> Dict[str, Any]:
    \"\"\"
    Classifies enterprise sales reps into Dixon & Adamson's 5 Profiles:
    - THE_CHALLENGER: Teaches, tailors, asserts constructive tension
    - THE_RELATIONSHIP_BUILDER: Prioritizes customer comfort & conflict avoidance
    - THE_REACTIVE_PROBLEM_SOLVER: Disproportionately consumes time on support
    - THE_HARD_WORKER: Kinetic task volume without strategic reframe
    - THE_LONE_WOLF: Independent instinct-driven closer
    Evaluates expected win rate based on deal complexity (TRANSACTIONAL vs COMPLEX_ENTERPRISE).
    \"\"\"
    profile = "THE_HARD_WORKER"
    
    if delivers_commercial_insight and asserts_constructive_tension and tailors_to_economic_buyer:
        profile = "THE_CHALLENGER"
    elif prioritizes_conflict_avoidance and not asserts_constructive_tension:
        profile = "THE_RELATIONSHIP_BUILDER"
    elif hours_spent_on_customer_support >= 15.0:
        profile = "THE_REACTIVE_PROBLEM_SOLVER"
    elif asserts_constructive_tension and not delivers_commercial_insight:
        profile = "THE_LONE_WOLF"
        
    # Statistical Benchmark Win Rates from CEB / Gartner Research
    win_rate_matrix = {
        "THE_CHALLENGER": {"TRANSACTIONAL": 35.0, "COMPLEX_ENTERPRISE": 54.0},
        "THE_RELATIONSHIP_BUILDER": {"TRANSACTIONAL": 28.0, "COMPLEX_ENTERPRISE": 4.0},
        "THE_HARD_WORKER": {"TRANSACTIONAL": 30.0, "COMPLEX_ENTERPRISE": 17.0},
        "THE_LONE_WOLF": {"TRANSACTIONAL": 25.0, "COMPLEX_ENTERPRISE": 22.0},
        "THE_REACTIVE_PROBLEM_SOLVER": {"TRANSACTIONAL": 20.0, "COMPLEX_ENTERPRISE": 3.0}
    }
    
    complexity_key = deal_complexity_tier.upper().strip()
    if complexity_key not in ["TRANSACTIONAL", "COMPLEX_ENTERPRISE"]:
        complexity_key = "COMPLEX_ENTERPRISE"
        
    expected_win_share_pct = win_rate_matrix[profile][complexity_key]
    is_elite_closer = (profile == "THE_CHALLENGER") and (complexity_key == "COMPLEX_ENTERPRISE")
    
    status = (
        "CHALLENGER_PROFILE_ACTIVE_DOMINANT_WIN_RATE"
        if is_elite_closer
        else f"PROFILE_{profile}_BENCHMARK_EVALUATED"
    )
    
    return {
        "rep_name": rep_name,
        "profile": profile,
        "deal_complexity": complexity_key,
        "top_performer_win_share_pct": expected_win_share_pct,
        "is_elite_closer": is_elite_closer,
        "status": status
    }

# Benchmark Verifications
challenger_rep = analyze_sales_rep_profile(
    rep_name="Marcus Vance",
    deal_complexity_tier="COMPLEX_ENTERPRISE",
    asserts_constructive_tension=True,
    delivers_commercial_insight=True,
    tailors_to_economic_buyer=True,
    prioritizes_conflict_avoidance=False,
    hours_spent_on_customer_support=2.0
)

relationship_rep = analyze_sales_rep_profile(
    rep_name="David Miller",
    deal_complexity_tier="COMPLEX_ENTERPRISE",
    asserts_constructive_tension=False,
    delivers_commercial_insight=False,
    tailors_to_economic_buyer=False,
    prioritizes_conflict_avoidance=True,
    hours_spent_on_customer_support=4.0
)

print(f"{challenger_rep['rep_name']} Profile: {challenger_rep['profile']} | Elite Closer: {challenger_rep['is_elite_closer']}")
print(f"Top Performer Win Share: {challenger_rep['top_performer_win_share_pct']}% | Status: {challenger_rep['status']}")
print(f"{relationship_rep['rep_name']} Profile: {relationship_rep['profile']} | Top Performer Win Share: {relationship_rep['top_performer_win_share_pct']}%")
""",
            "output": """Marcus Vance Profile: THE_CHALLENGER | Elite Closer: True
Top Performer Win Share: 54.0% | Status: CHALLENGER_PROFILE_ACTIVE_DOMINANT_WIN_RATE
David Miller Profile: THE_RELATIONSHIP_BUILDER | Top Performer Win Share: 4.0%""",
            "codeNotes": [
                "Line 4: Defines analyze_sales_rep_profile classifying behavioral traits into Dixon & Adamson's 5 sales profiles.",
                "Lines 18-28: Evaluates combinations of commercial insight, constructive tension, and conflict avoidance to assign profiles.",
                "Lines 31-38: Implements empirical CEB/Gartner win-rate matrix contrasting transactional vs complex enterprise environments.",
                "Lines 44-52: Validates that The Challenger captures a dominant 54% share of top enterprise closers while Relationship Builders capture only 4%."
            ],
            "tryIt": "Change hours_spent_on_customer_support to 20.0 for an unaligned rep. Observe how the function classifies them as THE_REACTIVE_PROBLEM_SOLVER with a 3.0% enterprise win share.",
            "check": {
                "question": "According to CEB/Gartner research across 6,000 corporate sales representatives, what percentage of top-performing sales closers in complex B2B enterprise deals are Challengers?",
                "options": [
                    "4% to 7%",
                    "15%",
                    "54%",
                    "100%"
                ],
                "answer": 2,
                "why": "CEB research revealed that Challengers represent 54% of all top-performing enterprise sales closers, whereas Relationship Builders represent under 7%.",
                "answerIndex": 2,
                "explanation": "CEB research revealed that Challengers represent 54% of all top-performing enterprise sales closers, whereas Relationship Builders represent under 7%."
            }
        },
        {
            "title": "Pillar 1: Commercial Teaching & Surfacing Unconsidered Needs",
            "say": [
                "Having established why Challengers dominate complex B2B deals, we now dissect the first foundational pillar of the Challenger methodology: Commercial Teaching. In traditional sales training, representatives are taught to practice 'solution selling' by asking probing questions to discover the customer's known, stated needs ('Tell me about your current pain points', 'What features are missing from your existing software?'). The fatal flaw of this approach is that if you only solve problems that the customer already knows they have, you are trapped in a commoditized bake-off. The customer will simply write an RFP listing those known requirements, send it to five competing vendors, and select the lowest bidder.",
                "Commercial Teaching reverses this dynamic entirely. A Challenger does not ask customers what problems they have; a Challenger teaches customers about massive, unconsidered problems they did not know existed. The primary objective of Commercial Teaching is to deliver an intellectual reframe—introducing a provocative, data-backed perspective that challenges the customer's fundamental assumptions about their operational efficiency, risk exposure, or competitive positioning. When executed with surgical precision, Commercial Teaching leads the customer to a profound realization: 'I thought our business was performing well in this area, but we are actually losing millions of dollars every quarter.'",
                "To be commercially effective, a teaching pitch must adhere to four strict design criteria: Lead TO, Not With, Your Differentiators; Surface Unconsidered Needs; Calculate the Quantifiable Cost of Inaction; and Resonate with Industry Realities. The cardinal rule of Commercial Teaching is 'Lead TO, Not With, Your Solution'. Amateurs begin meetings by immediately presenting their product demo, showing off dashboards, and bragging about patented algorithms. In contrast, a Challenger spends the first 80% of the conversation discussing the customer's business without ever mentioning their own product. The Challenger builds an undeniable, compelling case around a hidden industry vulnerability—a vulnerability that can only be solved by the vendor's unique proprietary capabilities.",
                "Consider the concept of Unconsidered Needs. A customer's needs can be categorized into two domains: Stated Needs (problems the customer is actively trying to solve) and Unconsidered Needs (latent vulnerabilities, regulatory blind spots, or compounding inefficiencies that the customer has overlooked). If you compete on Stated Needs, you are competing on price against established incumbents. When you surface an Unconsidered Need, you rewrite the customer's buying criteria. You shift the conversation from a tactical feature comparison to an urgent strategic initiative, positioning your company as the sole visionary partner capable of addressing the threat.",
                "A vital component of Commercial Teaching is the mathematical calculation of the Quantified Cost of Inaction (COI). Enterprise executives do not buy software because it is technically impressive; they buy software to stop financial bleeding or capture measurable enterprise value. A Challenger backs their commercial insight with rigorous econometric data: 'Based on your transaction volume of 4.2 million orders, manual reconciliation latency is costing your balance sheet $180,000 every single month in uncollected interchange fees.' Quantifying the cost of inaction creates intense commercial urgency, breaking the status quo bias and forcing CFOs to prioritize your project over competing capital expenditures.",
                "Furthermore, Commercial Teaching demands intellectual courage. Many sales reps hesitate to challenge a prospect's operational assumptions because they fear provoking defensiveness or anger. However, enterprise executives consistently report that they experience the highest respect and trust for sales reps who constructively dispute their thinking with compelling empirical data. When an Account Executive demonstrates that an executive's current strategy has an unconsidered $500,000 blind spot, the executive does not feel insulted; they feel enlightened and deeply grateful for the revelation. By elevating the conversation to strategic teaching, the Challenger earns a seat at the executive table as an indispensable commercial partner."
            ],
            "example": "A logistics software vendor pitched a Fortune 500 retailer that believed its supply chain was operating at peak efficiency with a 98% on-time delivery rate. Rather than pitching fleet tracking software, the Challenger rep presented a commercial teaching reframe on 'Micro-Dwell Time Accumulation', proving mathematically that 12-minute driver idling delays at loading docks were costing the retailer $2.4M annually in overtime labor and fleet depreciation. The retailer was stunned by the unconsidered blind spot and immediately commissioned a pilot to eliminate dwell time, awarding an $850,000 contract without issuing a competitive RFP.",
            "code": """# Commercial Teaching & Unconsidered Need Reframe Engine
from typing import Dict, Any, List

def evaluate_commercial_teaching_pitch(
    industry_sector: str,
    stated_need: str,
    unconsidered_need: str,
    leads_to_unique_differentiator: bool,
    monthly_cost_of_inaction: float,
    introduces_provocative_reframe: bool
) -> Dict[str, Any]:
    \"\"\"
    Audits a commercial sales pitch against the Challenger Teaching Invariant:
    1. Must surface an UNCONSIDERED need rather than validating stated needs
    2. Must deliver an intellectual REFRAME of the customer's business model
    3. Must lead TO (not with) unique vendor differentiators
    4. Must quantify the financial Cost of Inaction (COI) annually
    \"\"\"
    annual_cost_of_inaction = round(monthly_cost_of_inaction * 12.0, 2)
    
    # Audit Core Teaching Gates
    gate_reframe = introduces_provocative_reframe and (len(unconsidered_need) > 0)
    gate_differentiation = leads_to_unique_differentiator
    gate_urgency = annual_cost_of_inaction >= 100000.0  # Enterprise threshold: >= $100k annual bleeding
    
    is_teaching_mastered = gate_reframe and gate_differentiation and gate_urgency
    
    status = (
        "COMMERCIAL_TEACHING_INSIGHT_CERTIFIED_CHALLENGER"
        if is_teaching_mastered
        else "COMMODITIZED_PITCH_DEFECT_DETECTED"
    )
    
    pitch_classification = (
        "CHALLENGER_COMMERCIAL_TEACHING"
        if is_teaching_mastered
        else "LEGACY_SOLUTION_SELLING_COMMODITIZED"
    )
    
    return {
        "industry_sector": industry_sector,
        "stated_need": stated_need,
        "unconsidered_need": unconsidered_need,
        "annual_cost_of_inaction": annual_cost_of_inaction,
        "leads_to_unique_differentiator": leads_to_unique_differentiator,
        "introduces_provocative_reframe": introduces_provocative_reframe,
        "is_teaching_mastered": is_teaching_mastered,
        "pitch_classification": pitch_classification,
        "status": status
    }

# Benchmark Verifications
challenger_teaching = evaluate_commercial_teaching_pitch(
    industry_sector="Enterprise FinTech",
    stated_need="Faster invoice OCR scanning software",
    unconsidered_need="Uncollected interchange fee leakage across multi-currency settlement rails",
    leads_to_unique_differentiator=True,
    monthly_cost_of_inaction=25000.0,
    introduces_provocative_reframe=True
)

commodity_pitch = evaluate_commercial_teaching_pitch(
    industry_sector="Enterprise FinTech",
    stated_need="Faster invoice OCR scanning software",
    unconsidered_need="",
    leads_to_unique_differentiator=False,
    monthly_cost_of_inaction=2000.0,
    introduces_provocative_reframe=False
)

print(f"Challenger Pitch Status: {challenger_teaching['status']} | Class: {challenger_teaching['pitch_classification']}")
print(f"Annual Cost of Inaction: ${challenger_teaching['annual_cost_of_inaction']:,.2f}")
print(f"Commodity Pitch Status: {commodity_pitch['status']} | Class: {commodity_pitch['pitch_classification']}")
""",
            "output": """Challenger Pitch Status: COMMERCIAL_TEACHING_INSIGHT_CERTIFIED_CHALLENGER | Class: CHALLENGER_COMMERCIAL_TEACHING
Annual Cost of Inaction: $300,000.00
Commodity Pitch Status: COMMODITIZED_PITCH_DEFECT_DETECTED | Class: LEGACY_SOLUTION_SELLING_COMMODITIZED""",
            "codeNotes": [
                "Line 4: Defines evaluate_commercial_teaching_pitch auditing commercial reframes, differentiators, and Cost of Inaction.",
                "Lines 14-22: Evaluates three mandatory teaching gates: unconsidered reframe, unique vendor alignment, and >= $100k annual COI.",
                "Lines 24-34: Confirms COMMERCIAL_TEACHING_INSIGHT_CERTIFIED_CHALLENGER status when all three gates clear green.",
                "Lines 40-52: Demonstrates deterministic classification distinguishing high-margin Challenger pitches from commodity pitches."
            ],
            "tryIt": "Reduce monthly_cost_of_inaction to 5,000.0 ($60k annually). Observe how the pitch fails the enterprise urgency threshold, switching to COMMODITIZED_PITCH_DEFECT_DETECTED.",
            "check": {
                "question": "What is the cardinal rule of Commercial Teaching in the Challenger Sale methodology?",
                "options": [
                    "Lead WITH your product features in the first five minutes",
                    "Lead TO (not with) your unique differentiators by first surfacing an unconsidered customer vulnerability",
                    "Offer an immediate 20% discount if the customer agrees to sign within 48 hours",
                    "Agree with every assumption the customer makes about their operational performance"
                ],
                "answer": 1,
                "why": "Challengers never lead with their product; they first build an undeniable case around an unconsidered business vulnerability that leads directly to their unique solution.",
                "answerIndex": 1,
                "explanation": "Challengers never lead with their product; they first build an undeniable case around an unconsidered business vulnerability that leads directly to their unique solution."
            }
        },
        {
            "title": "Pillar 2: Tailoring for Executive Resonance & DMU Multi-Threading",
            "say": [
                "Having formulated a powerful Commercial Teaching reframe, the enterprise sales professional must now confront a complex organizational reality: in B2B transactions, decisions are never made by a single person. Gartner research demonstrates that the modern enterprise buying journey involves an average of 6.8 to 10 distinct executive stakeholders, each representing different functional departments with divergent incentives, distinct vocabularies, and conflicting political agendas. This brings us to the second operational pillar of the Challenger methodology: Tailoring for Executive Resonance.",
                "Tailoring is the deliberate adaptation of your commercial teaching narrative to align with the specific economic, operational, and psychological priorities of each stakeholder within the Decision-Making Unit (DMU). A message that electrifies the Chief Technology Officer will often leave the Chief Financial Officer completely uninspired. Amateur sales representatives commit the fatal error of delivering a generic, one-size-fits-all product presentation to every room. When meeting with the CFO, the amateur talks about cloud API response times, latency benchmarks, and Kubernetes microservices; when meeting with the CTO, they present return on equity ratios and amortization schedules. This total lack of tailoring breeds executive disengagement, leaving stakeholders unconvinced that the vendor understands their unique mandate.",
                "In sharp contrast, a Challenger practices multi-threaded resonance. Before entering any executive conversation, the Challenger identifies the stakeholder's primary business driver and maps the commercial teaching reframe into that executive's native dialect. When speaking with the Chief Financial Officer (CFO), the narrative focuses exclusively on enterprise financial economics: cash flow velocity, working capital efficiency, return on invested capital (ROIC), operational expenditure reduction, and compliance with ASC 606 revenue recognition standards. The Challenger quantifies how the unconsidered business problem directly erodes gross margins and quarterly EBITDA targets.",
                "When pivoting the conversation to the Chief Information Security Officer (CISO) or Chief Technology Officer (CTO), the vocabulary transforms entirely. The technical leadership does not care about sales commission structures; they care about risk mitigation, architecture resilience, and operational scalability. Here, the Challenger tailors the message to SOC 2 Type II compliance, zero-trust network architectures, role-based access controls, automated penetration testing results, 99.99% high-availability SLAs, and mitigating 72-hour regulatory breach liabilities under GDPR and SEC disclosure rules. The CISO must be convinced that partnering with your company actively de-risks their corporate IT infrastructure.",
                "When meeting with the Line of Business Leader (such as the VP of Sales, VP of Operations, or Chief Marketing Officer), the Challenger tailors the reframe to operational throughput and human productivity. The discussion centers on accelerating time-to-value, eliminating repetitive manual workflows, reducing employee churn, and empowering front-line teams to smash quarterly performance targets. By multi-threading this tailored narrative across all executive personas, the Challenger builds broad consensus across the entire buying committee. When the executive committee convenes to vote on budget allocation, every leader in the room champions the project because it directly advances their personal and departmental objectives.",
                "Crucially, tailoring extends beyond adapting slide decks; it dictates which internal customer stakeholders a Challenger chooses to cultivate. In 'The Challenger Customer', Dixon and Adamson revealed that typical sales reps waste weeks building cozy relationships with 'Talkers' and 'Friends'—friendly contacts who love to chat and share gossip but hold zero organizational sway or political courage. Challengers specifically seek out and mobilize 'Mobilizers'—internal champions categorized into Go-Getters, Teachers, and Skeptics. Mobilizers are intellectually demanding, push back on unsubstantiated vendor claims, and prioritize company improvement over personal comfort. When a Challenger arms a skeptical Mobilizer with a rigorously tailored commercial teaching business case, that Mobilizer acts as an unstoppable internal catalyst who navigates corporate procurement, defeats internal status-quo inertia, and drives cross-functional consensus across all executive stakeholders."
            ],
            "example": "During an enterprise sales campaign for a $950,000 automated workflow platform, the Challenger Account Executive met with three distinct stakeholders over two weeks: she presented working capital payback models and $380,000 annual cost savings to the CFO; demonstrated SOC 2 Type II data residency and automated RBAC audit logging to the CISO; and mapped a 35% reduction in employee onboarding cycle times to the VP of HR. Because each stakeholder received a tailored narrative addressing their specific departmental KPIs, the executive board approved the purchase unanimously in a single meeting.",
            "code": """# Challenger Executive Tailoring & DMU Multi-Threading Engine
from typing import Dict, Any, List

def evaluate_executive_tailoring(
    stakeholder_role: str,
    pitch_focus_area: str,
    quantified_metric_type: str,
    addresses_departmental_kpi: bool
) -> Dict[str, Any]:
    \"\"\"
    Audits narrative tailoring across Decision-Making Unit (DMU) roles:
    - CFO: Focus must be ROI, Cash Flow, Working Capital, or EBITDA
    - CISO_CTO: Focus must be InfoSec, Architecture, SOC 2, or Data Security
    - VP_OPERATIONS: Focus must be Throughput, Productivity, or Error Reduction
    \"\"\"
    resonance_matrix = {
        "CFO": {
            "valid_focus": ["ROI_FINANCIAL_METRICS", "CASH_FLOW_OPTIMIZATION", "COST_OF_INACTION", "WORKING_CAPITAL"],
            "metric": "DOLLARS_SAVED_OR_EBITDA"
        },
        "CISO_CTO": {
            "valid_focus": ["INFOSEC_SECURITY_SLA", "SYSTEM_ARCHITECTURE", "SOC2_COMPLIANCE", "DATA_RESIDENCY"],
            "metric": "RISK_REDUCTION_PERCENT_OR_UPTIME"
        },
        "VP_OPERATIONS": {
            "valid_focus": ["EMPLOYEE_PRODUCTIVITY", "WORKFLOW_THROUGHPUT", "ERROR_REDUCTION", "TIME_TO_VALUE"],
            "metric": "HOURS_SAVED_OR_THROUGHPUT_SPEED"
        }
    }
    
    role_key = stakeholder_role.upper().strip()
    focus_key = pitch_focus_area.upper().strip()
    
    if role_key not in resonance_matrix:
        return {
            "stakeholder_role": role_key,
            "has_resonance": False,
            "status": "UNRECOGNIZED_STAKEHOLDER_ROLE",
            "is_tailoring_approved": False
        }
        
    role_spec = resonance_matrix[role_key]
    is_focus_aligned = focus_key in role_spec["valid_focus"]
    is_metric_aligned = (quantified_metric_type == role_spec["metric"])
    
    is_tailoring_approved = is_focus_aligned and is_metric_aligned and addresses_departmental_kpi
    
    status = (
        "EXECUTIVE_RESONANCE_OPTIMAL"
        if is_tailoring_approved
        else "MISALIGNED_MESSAGING_RISK"
    )
    
    return {
        "stakeholder_role": role_key,
        "pitch_focus_area": focus_key,
        "is_focus_aligned": is_focus_aligned,
        "is_metric_aligned": is_metric_aligned,
        "is_tailoring_approved": is_tailoring_approved,
        "status": status
    }

# Benchmark Verifications
cfo_audit = evaluate_executive_tailoring(
    stakeholder_role="CFO",
    pitch_focus_area="CASH_FLOW_OPTIMIZATION",
    quantified_metric_type="DOLLARS_SAVED_OR_EBITDA",
    addresses_departmental_kpi=True
)

ciso_misaligned = evaluate_executive_tailoring(
    stakeholder_role="CISO_CTO",
    pitch_focus_area="CASH_FLOW_OPTIMIZATION", # Pitching CFO cash metrics to a security officer
    quantified_metric_type="DOLLARS_SAVED_OR_EBITDA",
    addresses_departmental_kpi=False
)

print(f"CFO Tailoring Status: {cfo_audit['status']} | Approved: {cfo_audit['is_tailoring_approved']}")
print(f"CISO Misaligned Status: {ciso_misaligned['status']} | Approved: {ciso_misaligned['is_tailoring_approved']}")
""",
            "output": """CFO Tailoring Status: EXECUTIVE_RESONANCE_OPTIMAL | Approved: True
CISO Misaligned Status: MISALIGNED_MESSAGING_RISK | Approved: False""",
            "codeNotes": [
                "Line 4: Defines evaluate_executive_tailoring mapping sales messaging to DMU stakeholder personas.",
                "Lines 12-25: Establishes the resonance matrix defining valid strategic focus areas and metric types for CFO, CISO/CTO, and Operations.",
                "Lines 38-48: Audits alignment between pitch focus, quantitative metrics, and departmental KPIs to certify EXECUTIVE_RESONANCE_OPTIMAL.",
                "Lines 54-66: Demonstrates that pitching generic financial metrics to technical security leaders triggers MISALIGNED_MESSAGING_RISK."
            ],
            "tryIt": "Test evaluate_executive_tailoring with stakeholder_role='VP_OPERATIONS', focus='WORKFLOW_THROUGHPUT', and metric='HOURS_SAVED_OR_THROUGHPUT_SPEED'. Verify optimal resonance.",
            "check": {
                "question": "When tailoring a Challenger commercial teaching narrative to the Chief Financial Officer (CFO), which core themes must dominate the conversation?",
                "options": [
                    "User interface color schemes and dark mode toggles",
                    "Cash flow velocity, working capital optimization, and Cost of Inaction (COI)",
                    "REST API endpoint documentation and Docker container configurations",
                    "Social golf outing invitations"
                ],
                "answer": 1,
                "why": "CFOs are economically driven; tailoring requires focusing on cash flow, working capital, EBITDA impact, and quantifiable Cost of Inaction.",
                "answerIndex": 1,
                "explanation": "CFOs are economically driven; tailoring requires focusing on cash flow, working capital, EBITDA impact, and quantifiable Cost of Inaction."
            }
        },
        {
            "title": "Pillar 3: Taking Control of the Commercial Conversation & Value-Trade Negotiation",
            "say": [
                "We now examine the third, most decisive, and most frequently misunderstood pillar of the Challenger methodology: Taking Control of the Commercial Conversation. In classical sales environments, representatives are conditioned to believe that customer deference equals professionalism. When an enterprise buyer demands early pricing, dictates unreasonable timelines, or insists on free multi-month proof-of-concept trials, passive sales reps immediately capitulate. Dixon and Adamson's empirical research revealed that top-performing Challengers operate with an entirely different psychological posture: they assert constructive commercial tension.",
                "Taking control does not mean being arrogant, aggressive, or combative. Rather, taking control is the disciplined ability to maintain leadership of the sales process, guide the customer through complex commercial decisions, and defend the vendor's economic margins. In enterprise software sales, buyers are constantly attempting to commoditize the transaction and seize leverage. If a sales representative allows the customer to steer the sales process into premature pricing discussions or unstructured evaluations, the deal inevitably degrades into an aggressive procurement discount squeeze.",
                "Taking control operates across two vital commercial battlegrounds: Money and Momentum. The battleground of Money centers on pricing discipline and value defense. When enterprise buyers request pricing early in the sales cycle—often during the very first discovery call—amateur reps panic and disclose price sheets, immediately shifting the dynamic from strategic problem-solving to tactical line-item scrutiny. A Challenger firmly resists: 'Marcus, our pricing scales directly based on transactional volume and compute architecture. But before we discuss pricing models, we must determine whether the $350,000 in unconsidered reconciliation leakage we identified is a tier-one corporate priority for your board this quarter. If it is not, no price we discuss will be justifiable. Shall we verify that business case first?'",
                "Furthermore, during formal contract negotiations, Challengers adhere strictly to the Value-Trade Principle: never grant a price concession without demanding an equal commercial concession in return. Inexperienced sales reps treat discounts as a one-way gift to generate buyer happiness. Challengers understand that unearned discounts signal to procurement that your initial pricing was arbitrary and inflated. If procurement demands a 5% discount, the Challenger takes control: 'We can accommodate a 5% concession on annual license fees, provided your team agrees to execute the agreement by the end of the month, commits to a 3-year term, and approves a joint press release as a customer reference.' By demanding valuable contractual terms in exchange for margin concessions, the Challenger protects annual recurring revenue (ARR) and reinforces corporate authority.",
                "The second battleground is Momentum. Enterprise sales cycles die of inertia and organizational drift. When a deal stalls in legal reviews or security evaluations, passive reps send meek follow-up emails asking, 'Just checking in to see if you had any updates?' Challengers never send 'just checking in' emails. Challengers establish Mutual Action Plans (MAPs) with firm reciprocal commitments. If a customer champion misses an agreed milestone, the Challenger asserts constructive tension: 'Sarah, we mutually agreed that completing InfoSec review by Friday was essential to ensure your new platform goes live before peak holiday trading. Since that review has stalled, your November 1st launch deadline is now in jeopardy. Let us schedule a 20-minute alignment call with your security architect this afternoon to resolve the blocker.'",
                "Finally, taking control requires maintaining peer-level psychological parity throughout high-stakes procurement confrontations. Institutional procurement departments are trained in sophisticated psychological tactics: sudden silences, manufactured outrage, threats of vendor replacement, and mandatory requests for proposal (RFPs). While Relationship Builders shrink under this pressure and slash prices in terror, Challengers stand firm as trusted business advisors. They calmly point back to the quantified Cost of Inaction and the unique architectural differentiators that only their platform provides. By refusing to accept subordinate status, Challengers command executive respect and protect contract margins from aggressive margin erosion.",
                "By mastering the assertion of constructive tension, sales professionals take control of both money and momentum. They command executive respect, protect enterprise contract margins, and steer complex corporate buying units toward successful, timely closings."
            ],
            "example": "An enterprise procurement manager informed a software sales team that they would only be awarded an $800,000 contract if they slashed their price by 20% to match an offshore competitor. The Account Executive, operating as a seasoned Challenger, refused to capitulate. She presented data proving that the competitor's 99.0% SLA represented an average of 87 hours of downtime annually, costing the client's trading desk $1.2M in lost transactions. She offered an alternative: a 4% discount strictly in exchange for a 36-month upfront commitment and Net 15 payment terms. Procurement agreed, preserving $128,000 in software gross margin.",
            "code": """# Challenger Commercial Control & Value-Trade Negotiation Engine
from typing import Dict, Any, List

def evaluate_commercial_control_and_negotiation(
    initial_contract_value: float,
    discount_demanded_pct: float,
    discount_conceded_pct: float,
    concessions_traded: List[str],
    asserted_value_defense: bool,
    asserted_mutual_accountability: bool
) -> Dict[str, Any]:
    \"\"\"
    Audits commercial control and value-trade discipline in enterprise negotiations:
    - Rule 1: Never concede discount > 0 without at least 1 reciprocal commercial trade
    - Rule 2: Maximum allowable negotiated discount ceiling is <= 10.0%
    - Rule 3: Must assert value defense and mutual accountability milestones
    \"\"\"
    final_contract_value = round(initial_contract_value * (1.0 - (discount_conceded_pct / 100.0)), 2)
    margin_preserved_dollars = round(initial_contract_value - final_contract_value, 2)
    
    # 1. Audit Value Trade Invariant
    is_discount_given = discount_conceded_pct > 0.0
    has_reciprocal_trade = len(concessions_traded) >= 1 if is_discount_given else True
    
    # 2. Audit Margin Discipline Ceiling
    is_discount_within_bounds = discount_conceded_pct <= 10.0
    
    # 3. Audit Control Posture
    is_control_asserted = asserted_value_defense and asserted_mutual_accountability and has_reciprocal_trade and is_discount_within_bounds
    
    status = (
        "COMMERCIAL_CONTROL_ASSERTED_MARGINS_PROTECTED"
        if is_control_asserted
        else "COMMERCIAL_CONTROL_SURRENDERED_MARGIN_LEAKAGE"
    )
    
    negotiation_rating = (
        "DISCIPLINED_CHALLENGER_VALUE_TRADER"
        if is_control_asserted
        else "PASSIVE_RELATIONSHIP_BUILDER_CONCESSION"
    )
    
    return {
        "initial_contract_value": initial_contract_value,
        "discount_demanded_pct": discount_demanded_pct,
        "discount_conceded_pct": discount_conceded_pct,
        "final_contract_value": final_contract_value,
        "margin_preserved_dollars": margin_preserved_dollars,
        "concessions_traded": concessions_traded,
        "is_control_asserted": is_control_asserted,
        "negotiation_rating": negotiation_rating,
        "status": status
    }

# Benchmark Verifications
challenger_negotiation = evaluate_commercial_control_and_negotiation(
    initial_contract_value=500000.0,
    discount_demanded_pct=25.0,
    discount_conceded_pct=5.0,
    concessions_traded=["36_MONTH_UPFRONT_COMMITMENT", "NET_15_PAYMENT_TERMS", "CUSTOMER_CASE_STUDY"],
    asserted_value_defense=True,
    asserted_mutual_accountability=True
)

uncontrolled_negotiation = evaluate_commercial_control_and_negotiation(
    initial_contract_value=500000.0,
    discount_demanded_pct=20.0,
    discount_conceded_pct=20.0, # Complete surrender
    concessions_traded=[], # Zero trades demanded
    asserted_value_defense=False,
    asserted_mutual_accountability=False
)

print(f"Challenger Negotiation Status: {challenger_negotiation['status']} | Rating: {challenger_negotiation['negotiation_rating']}")
print(f"Final Contract Value: ${challenger_negotiation['final_contract_value']:,.2f} | Concessions Traded: {len(challenger_negotiation['concessions_traded'])}")
print(f"Uncontrolled Negotiation Status: {uncontrolled_negotiation['status']} | Rating: {uncontrolled_negotiation['negotiation_rating']}")
""",
            "output": """Challenger Negotiation Status: COMMERCIAL_CONTROL_ASSERTED_MARGINS_PROTECTED | Rating: DISCIPLINED_CHALLENGER_VALUE_TRADER
Final Contract Value: $475,000.00 | Concessions Traded: 3
Uncontrolled Negotiation Status: COMMERCIAL_CONTROL_SURRENDERED_MARGIN_LEAKAGE | Rating: PASSIVE_RELATIONSHIP_BUILDER_CONCESSION""",
            "codeNotes": [
                "Line 4: Defines evaluate_commercial_control_and_negotiation benchmarking value-trade discipline and margin preservation.",
                "Lines 18-26: Enforces the Value-Trade Invariant: any discount > 0 must be paired with at least one reciprocal concession trade.",
                "Lines 28-36: Audits negotiated discount ceiling (<= 10.0%) and asserts value defense to confirm COMMERCIAL_CONTROL_ASSERTED_MARGINS_PROTECTED.",
                "Lines 42-56: Demonstrates that caving to buyer discount demands without trade concessions triggers COMMERCIAL_CONTROL_SURRENDERED_MARGIN_LEAKAGE."
            ],
            "tryIt": "Set discount_conceded_pct=15.0 with 2 concessions. Observe how exceeding the 10.0% margin ceiling triggers COMMERCIAL_CONTROL_SURRENDERED_MARGIN_LEAKAGE.",
            "check": {
                "question": "What is the primary characteristic of an Account Executive who successfully 'Takes Control' during enterprise sales negotiations?",
                "options": [
                    "They shout at the procurement team until the contract is signed",
                    "They assert constructive tension, defend value, and practice reciprocal value trading whenever price concessions are discussed",
                    "They agree to any discount requested as long as the deal closes before the end of the month",
                    "They avoid discussing money entirely"
                ],
                "answer": 1,
                "why": "Taking control means asserting constructive commercial tension, defending the economic value proposition, and exchanging price concessions for valuable contractual terms.",
                "answerIndex": 1,
                "explanation": "Taking control means asserting constructive commercial tension, defending the economic value proposition, and exchanging price concessions for valuable contractual terms."
            }
        },
        {
            "title": "The 6-Step Commercial Teaching Pitch Choreography & Master Challenger Engine",
            "say": [
                "To operationalize Commercial Teaching, Tailoring, and Taking Control into an institutional revenue system, Dixon and Adamson engineered the definitive 6-Step Commercial Teaching Pitch Choreography. In enterprise B2B sales, a pitch is not an improvised collection of conversational anecdotes; it is a meticulously structured psychological progression designed to guide an enterprise Decision-Making Unit from complacent status quo contentment to urgent commercial action. The six steps must be executed in strict chronological sequence: Step 1: The Warmer; Step 2: The Reframe; Step 3: Rational Drowning; Step 4: Emotional Impact; Step 5: A New Way; and Step 6: Our Solution.",
                "Step 1 is The Warmer. The Warmer's objective is to build instant credibility by demonstrating an intimate understanding of the customer's operating environment. The sales rep outlines the common industry challenges, regulatory changes, and competitive pressures observed across peer organizations. The prospect nods along, thinking: 'This vendor understands our world.' Step 2 is The Reframe—the single most critical turning point in the entire conversation. In The Reframe, the rep shatters the customer's baseline assumptions. The rep introduces an unexpected, non-obvious root cause behind their business friction: 'You believe your primary operational bottleneck is warehouse throughput, but our research across 200 supply chains proves that your actual bleed is upstream purchase order batching latency.' The reframe hooks the customer's curiosity, shifting their perspective from passive agreement to active intellectual engagement.",
                "Step 3 is Rational Drowning. Having introduced the provocative reframe, the Challenger now uses rigorous mathematical data, research benchmarks, and financial modeling to substantiate the claim. Rational Drowning provides the intellectual justification necessary to appease the analytical mind: charts, statistical variance graphs, and peer industry quartiles demonstrating that this unconsidered flaw is widespread and quantifiable. Step 4 is Emotional Impact. While Rational Drowning satisfies the logical cortex, deals are ultimately decided by human emotion. In Step 4, the rep brings the data home to the prospect's personal reality. The rep paints a vivid picture of the personal, career, and organizational consequences of inaction: 'Marcus, if this leakage continues unaddressed for another three quarters, your department will miss its EBITDA covenant, and executive leadership will mandate emergency headcount freezes.'",
                "Step 5 is A New Way (Value Proposition Mapping). In Step 5, the Challenger outlines the exact architectural capabilities, operational workflows, and behavioral changes required to eliminate the unconsidered problem. Crucially, the rep still does *not* talk about their own proprietary product. Step 5 is entirely focused on defining the *solution criteria*: 'To solve this problem, you need a continuous streaming reconciliation engine with sub-second API webhooks and automated ledger balancing.' The customer agrees that this new approach is indispensable. Finally, Step 6 is Our Solution. Having established that 'A New Way' is mandatory, the rep introduces their product as the sole platform built specifically to fulfill that new architectural standard: 'That new way is exactly what we engineered our platform to deliver.'",
                "Notice the profound architectural elegance of this 6-step choreography: by the time the product is introduced in Step 6, the customer has already bought into the problem (Step 2), verified the mathematical cost (Step 3), felt the personal pain (Step 4), and agreed on the required solution architecture (Step 5). The sales conversation is completely decoupled from low-margin feature bake-offs, positioning the vendor as the definitive category leader.",
                "Furthermore, the transition between Step 5 and Step 6 is the hallmark of true sales mastery. In amateur demonstrations, representatives rush into showing product features early, which triggers defensive buyer skepticism ('They're just trying to sell me software'). In the Challenger pitch, because the customer has already collaborated on defining the criteria for 'A New Way', the reveal of 'Our Solution' feels like an inevitable and logical conclusion. The customer realizes that attempting to build the solution in-house or selecting an ill-equipped legacy competitor will guarantee continued financial hemorrhaging. The Challenger has fundamentally reframed the purchase decision from a discretionary cost into an essential risk-mitigation imperative.",
                "Let us examine the Python implementation of the Master Challenger Sales Orchestration Engine. This enterprise platform consolidates rep profile classification, 6-step pitch progression auditing, and commercial control governance into a unified execution control tower, certifying representatives who master high-velocity Challenger enterprise sales."
            ],
            "example": "An enterprise sales team pitching a Global 100 bank deployed the 6-step Challenger choreography: Step 1 (The Warmer) benchmarked rising customer acquisition costs across retail banking; Step 2 (The Reframe) revealed that branch-level onboarding drop-off was caused by un-digitized KYC forms rather than marketing quality; Step 3 (Rational Drowning) presented Federal Reserve data showing $42M in abandoned deposits; Step 4 (Emotional Impact) personalized the pain of the Chief Retail Banking Officer whose annual bonus was tied to deposit growth; Step 5 (A New Way) mapped the necessity of mobile-first instant biometric verification; and Step 6 (Our Solution) revealed their platform. The bank signed a $2.5M enterprise license within 45 days.",
            "code": """# Master Challenger Sales Orchestration Engine & 6-Step Choreography Auditor
from typing import Dict, Any, List

class MasterChallengerSalesEngine:
    \"\"\"
    Consolidated Master Challenger Sales Control Tower executing:
    - 6-Step Commercial Teaching Choreography Verification
    - Rep Behavioral Profile Classification
    - Multi-Stakeholder DMU Resonance Audit
    - Commercial Tension & Value-Trade Governance
    \"\"\"
    CHALLENGER_PITCH_STEPS = [
        "1_THE_WARMER",
        "2_THE_REFRAME",
        "3_RATIONAL_DROWNING",
        "4_EMOTIONAL_IMPACT",
        "5_A_NEW_WAY",
        "6_OUR_SOLUTION"
    ]
    
    @classmethod
    def audit_commercial_pitch_choreography(cls, executed_steps: List[str]) -> Dict[str, Any]:
        cleaned_steps = [s.upper().strip() for s in executed_steps]
        is_sequential_match = (cleaned_steps == cls.CHALLENGER_PITCH_STEPS)
        steps_count = len(cleaned_steps)
        
        # Check critical transitions
        has_reframe_before_solution = False
        if "2_THE_REFRAME" in cleaned_steps and "6_OUR_SOLUTION" in cleaned_steps:
            reframe_idx = cleaned_steps.index("2_THE_REFRAME")
            solution_idx = cleaned_steps.index("6_OUR_SOLUTION")
            has_reframe_before_solution = reframe_idx < solution_idx
            
        is_choreography_perfect = is_sequential_match and has_reframe_before_solution and (steps_count == 6)
        
        status = (
            "CHALLENGER_CHOREOGRAPHY_CERTIFIED_NOMINAL"
            if is_choreography_perfect
            else "CHOREOGRAPHY_DEFECT_IMPROPER_PITCH_SEQUENCE"
        )
        
        return {
            "executed_steps_count": steps_count,
            "is_sequential_match": is_sequential_match,
            "has_reframe_before_solution": has_reframe_before_solution,
            "is_choreography_perfect": is_choreography_perfect,
            "status": status
        }
        
    @classmethod
    def orchestrate_challenger_deal_inspection(
        cls,
        rep_profile: str,
        pitch_steps: List[str],
        dm_tailored: bool,
        control_maintained: bool,
        annual_coi: float
    ) -> Dict[str, Any]:
        choreography = cls.audit_commercial_pitch_choreography(pitch_steps)
        is_profile_challenger = rep_profile.upper().strip() == "THE_CHALLENGER"
        is_coi_sufficient = annual_coi >= 100000.0
        
        all_gates_cleared = (
            is_profile_challenger and
            choreography["is_choreography_perfect"] and
            dm_tailored and
            control_maintained and
            is_coi_sufficient
        )
        
        status = (
            "CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE"
            if all_gates_cleared
            else "CHALLENGER_EXECUTION_DEFECT_DETECTED"
        )
        
        credential = (
            "CHALLENGER_SALES_METHODOLOGY_CERTIFIED_NOMINAL"
            if all_gates_cleared
            else "REMEDIATION_REQUIRED_RECOACH_CHALLENGER_PILLARS"
        )
        
        return {
            "rep_profile": rep_profile,
            "choreography_status": choreography["status"],
            "dm_tailored": dm_tailored,
            "control_maintained": control_maintained,
            "annual_coi": annual_coi,
            "all_gates_cleared": all_gates_cleared,
            "status": status,
            "credential": credential
        }

# Execute Master Challenger Verification
complete_pitch = [
    "1_THE_WARMER",
    "2_THE_REFRAME",
    "3_RATIONAL_DROWNING",
    "4_EMOTIONAL_IMPACT",
    "5_A_NEW_WAY",
    "6_OUR_SOLUTION"
]

inspection = MasterChallengerSalesEngine.orchestrate_challenger_deal_inspection(
    rep_profile="THE_CHALLENGER",
    pitch_steps=complete_pitch,
    dm_tailored=True,
    control_maintained=True,
    annual_coi=350000.0
)

print(f"Rep Profile: {inspection['rep_profile']} | Choreography: {inspection['choreography_status']}")
print(f"Deal Status: {inspection['status']}")
print(f"Credential Award: {inspection['credential']}")
""",
            "output": """Rep Profile: THE_CHALLENGER | Choreography: CHALLENGER_CHOREOGRAPHY_CERTIFIED_NOMINAL
Deal Status: CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE
Credential Award: CHALLENGER_SALES_METHODOLOGY_CERTIFIED_NOMINAL""",
            "codeNotes": [
                "Line 4: Defines MasterChallengerSalesEngine orchestrating the complete 6-step commercial teaching choreography.",
                "Lines 19-38: Audits pitch step ordering, ensuring Step 2 (The Reframe) strictly precedes Step 6 (Our Solution).",
                "Lines 40-62: Inspects deal governance across Challenger behavioral profile, DMU tailoring, control maintenance, and COI.",
                "Lines 64-75: Validates all gates cleared to award CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE and confer certification."
            ],
            "tryIt": "Swap Step 2 and Step 6 in complete_pitch. Observe how the engine flags CHOREOGRAPHY_DEFECT_IMPROPER_PITCH_SEQUENCE.",
            "check": {
                "question": "What is Step 2 in the 6-Step Commercial Teaching Pitch Choreography, where the sales rep challenges the customer's baseline assumptions?",
                "options": [
                    "The Warmer",
                    "The Reframe",
                    "Rational Drowning",
                    "Our Solution"
                ],
                "answer": 1,
                "why": "Step 2 is The Reframe, the pivotal moment where the rep introduces a provocative insight that fundamentally reframes the customer's problem.",
                "answerIndex": 1,
                "explanation": "Step 2 is The Reframe, the pivotal moment where the rep introduces a provocative insight that fundamentally reframes the customer's problem."
            }
        }
    ]

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": [
            "Deconstructed Dixon & Adamson's CEB research across 6,000 reps, proving Challengers account for 54% of top enterprise performers while Relationship Builders account for <7%.",
            "Mastered Pillar 1 (Commercial Teaching): Leading TO (not with) unique differentiators, surfacing unconsidered needs, and quantifying the Cost of Inaction (COI).",
            "Mastered Pillar 2 (Tailoring): Adapting narratives to multi-stakeholder DMUs (CFO financial metrics, CISO InfoSec compliance, Ops throughput).",
            "Mastered Pillar 3 (Taking Control): Asserting constructive commercial tension, managing momentum, and enforcing the Value-Trade Principle in negotiations.",
            "Executed the 6-Step Commercial Teaching Pitch Choreography: 1. Warmer -> 2. Reframe -> 3. Rational Drowning -> 4. Emotional Impact -> 5. A New Way -> 6. Our Solution, conferring CHALLENGER_SALES_METHODOLOGY_CERTIFIED_NOMINAL."
        ],
        "projectStep": {
            "title": "Execute Challenger Sales Commercial Teaching Pitch & Negotiation Control",
            "steps": [
                "Classify sales representative behavioral profile against the 5 CEB profiles to isolate Challenger attributes.",
                "Construct a Commercial Teaching insight surfacing an unconsidered operational vulnerability leading to unique differentiators.",
                "Calculate annual Cost of Inaction (COI >= $100k) to establish immediate financial urgency.",
                "Tailor commercial narrative across CFO, CTO/CISO, and Operations stakeholders in the Decision-Making Unit.",
                "Execute the 6-Step Pitch Choreography from Warmer to Solution, asserting value-trade commercial control."
            ]
        }
    }

if __name__ == "__main__":
    data = get_day27_data()
    print(f"Generated Day 27 data: {data['title']}")
    words = [sum(len(p.split()) for p in part['say']) for part in data['parts']]
    print(f"Parts word counts: {words} (Total: {sum(words)})")
    for i, w in enumerate(words):
        assert w >= 580, f"Part {i+1} has {w} words (< 580 words!)"
    print("PASS: Day 27 invariant checks passed successfully!")
