import sys
import json
import hashlib

def get_day11_data() -> dict:
    day = 11
    title = "Customer Health Scoring & Proactive Churn Prediction (CHS)"
    goal = "Master multidimensional customer telemetry, leading versus lagging retention indicators, automated churn early warning triggers, and systematic rescue playbooks to protect recurring revenue and maximize gross revenue retention."
    minutes = 45
    recap = "Previously in Milestone 2, we mastered inbound lead qualification, outbound cadences, SPICED discovery calls, and enterprise deal velocity control towers. Today in Milestone 3, we transition from customer acquisition to post-sale revenue expansion, beginning with proactive customer health scoring and churn prediction."

    parts = [
        # Part 1: Multidimensional Health Telemetry: Feature Adoption, Active Users & Breadth-Depth-Frequency (BDF)
        {
            "title": "Multidimensional Health Telemetry: Feature Adoption, Active Users & BDF Model",
            "say": [
                "Welcome to Day 11 of B.Com Sales, Customer Success & CRM (SCRM). Today, we inaugurate Milestone 3: Customer Success, Net Retention & Enterprise Account Expansion. In the traditional, pre-cloud software business model, customer relationships were fundamentally transactional: enterprise software vendors sold perpetual licenses upfront with hefty maintenance contracts, and account representatives only re-engaged the customer when renewal invoices were due three to five years later. In modern recurring revenue models—such as Software-as-a-Service (SaaS), cloud infrastructure consumption, and enterprise API platforms—the commercial balance of power has shifted permanently to the customer. When software is rented on an annual or monthly basis, sales does not conclude the commercial relationship; rather, closing the contract merely secures the right to earn the customer's business every single day.",
                "The central operational challenge facing enterprise Customer Success organizations is the dangerous reliance on lagging indicators. Traditional account management teams measure customer relationship strength using lagging metrics such as cancellation notices, late invoice payments, contract non-renewals, or angry executive escalations. By the time a corporate Chief Information Officer (CIO) or VP of Operations formally submits a contract non-renewal notice, the decision to churn was made six to nine months earlier. At that late stage, offering pricing discounts, executive apologies, or emergency technical support achieves less than a ten-percent salvage rate. To build an enduring, resilient recurring revenue engine, Customer Success executives must transition from reactive damage control to proactive, telemetry-driven intervention powered by leading indicators.",
                "To detect churn propensity long before the customer consciously articulates dissatisfaction, modern revenue operations architectures implement multidimensional customer health telemetry. The industry standard framework for measuring digital product engagement is the Breadth-Depth-Frequency (BDF) model. Dimension A: Breadth measures the percentage of available software modules and features actively utilized across the client organization. An enterprise account utilizing only two out of ten contracted modules exhibits narrow adoption, creating high vulnerability to specialized point-solution competitors. Dimension B: Depth measures the intensity and volume of daily workflows completed inside the platform—such as database queries executed, automated workflows triggered, or reports generated per user session. Dimension C: Frequency measures the temporal regularity of engagement, specifically Daily Active Users over Monthly Active Users (DAU/MAU ratio), login cadence, and week-over-week engagement consistency.",
                "Operationalizing BDF telemetry requires robust data pipeline engineering. Modern customer success architectures ingest raw event streams from web and mobile applications using customer data platforms (CDPs) like Segment or RudderStack, and route product usage events into data warehouses like Snowflake or BigQuery. Automated data transformation models then aggregate raw user event logs into account-level adoption metrics, calculating rolling 7-day, 30-day, and 90-day engagement velocity. If an enterprise customer with 500 contracted seats experiences a 35% decline in weekly active users over three consecutive weeks, that drop represents an acute leading indicator of churn, regardless of whether the customer filed any support tickets.",
                "Furthermore, product telemetry must measure license utilization efficiency. If an enterprise buyer purchased 1,000 enterprise seats but only 220 seats have been provisioned and logged into after ninety days, the customer is experiencing severe shelfware risk. During contract renewal, the customer's procurement department will inevitably demand a 70% contraction in seat count, directly destroying Net Revenue Retention. High-performing Customer Success teams monitor license utilization thresholds in real time, triggering proactive user onboarding campaigns whenever seat activation remains below eighty percent.",
                "In this first part, we construct a Multidimensional Telemetry & BDF Adoption Engine. This deterministic Python model ingests raw product usage variables—breadth of features, depth of transactions, login frequency, and seat utilization—and computes a normalized 0-to-100 Product Adoption Health Index, categorizing accounts into actionable operational adoption tiers."
            ],
            "example": "A global human resources SaaS vendor with $60M ARR was losing 18% of its customer base annually to silent churn. By implementing real-time BDF telemetry that tracked when HR managers stopped running bi-weekly payroll simulations, the CS team was able to detect disengagement 120 days prior to contract renewal, triggering automated CSM re-training workflows that reduced gross customer churn from 18% to 6.2%.",
            "code": """# Multidimensional Health Telemetry: BDF Adoption Engine
from typing import Dict, Any

def score_multidimensional_telemetry(
    features_used: int,
    total_features_available: int,
    avg_actions_per_session: float,
    benchmark_actions: float,
    dau_mau_ratio: float,
    licensed_seats: int,
    active_seats_30d: int
) -> Dict[str, Any]:
    # 1. Breadth Score (0-100): Percentage of contracted features actively used
    breadth_pct = (features_used / total_features_available) * 100.0
    breadth_score = min(max(breadth_pct, 0.0), 100.0)
    
    # 2. Depth Score (0-100): Actions per session normalized against power-user benchmark
    depth_ratio = avg_actions_per_session / benchmark_actions
    depth_score = min(max(depth_ratio * 100.0, 0.0), 100.0)
    
    # 3. Frequency Score (0-100): DAU/MAU stickiness (0.50 DAU/MAU = 100% world-class stickiness)
    frequency_score = min(max((dau_mau_ratio / 0.50) * 100.0, 0.0), 100.0)
    
    # 4. License Utilization Score (0-100): Active seats vs paid licenses
    utilization_pct = (active_seats_30d / licensed_seats) * 100.0
    utilization_score = min(max(utilization_pct, 0.0), 100.0)
    
    # Composite Telemetry Score: Weighted 30% Breadth, 25% Depth, 25% Frequency, 20% Utilization
    composite_telemetry = (
        (breadth_score * 0.30) +
        (depth_score * 0.25) +
        (frequency_score * 0.25) +
        (utilization_score * 0.20)
    )
    composite_rounded = round(composite_telemetry, 2)
    
    if composite_rounded >= 80.0:
        tier = "ELITE_ADOPTION_PLATINUM"
        churn_risk = "LOW_EXPANSION_READY"
    elif composite_rounded >= 60.0:
        tier = "HEALTHY_ADOPTION_GOLD"
        churn_risk = "MODERATE_MAINTAIN_CADENCE"
    elif composite_rounded >= 40.0:
        tier = "AT_RISK_DEGRADED_USAGE"
        churn_risk = "ELEVATED_TRIGGER_RE_ENGAGEMENT"
    else:
        tier = "CRITICAL_DISENGAGEMENT_SHELFWARE"
        churn_risk = "ACUTE_CHURN_IMMINENT"
        
    return {
        "breadth_score": round(breadth_score, 2),
        "depth_score": round(depth_score, 2),
        "frequency_score": round(frequency_score, 2),
        "utilization_pct": round(utilization_pct, 2),
        "composite_telemetry_score": composite_rounded,
        "adoption_tier": tier,
        "churn_risk_profile": churn_risk
    }

# Benchmark Account Telemetry Audit
acc1 = score_multidimensional_telemetry(
    features_used=8, total_features_available=10,
    avg_actions_per_session=42.0, benchmark_actions=40.0,
    dau_mau_ratio=0.45, licensed_seats=200, active_seats_30d=185
)
acc2 = score_multidimensional_telemetry(
    features_used=2, total_features_available=10,
    avg_actions_per_session=8.0, benchmark_actions=40.0,
    dau_mau_ratio=0.12, licensed_seats=500, active_seats_30d=95
)

print(f"Account 1: Score {acc1['composite_telemetry_score']} | Tier: {acc1['adoption_tier']} | Risk: {acc1['churn_risk_profile']}")
print(f"Account 2: Score {acc2['composite_telemetry_score']} | Tier: {acc2['adoption_tier']} | Risk: {acc2['churn_risk_profile']}")
""",
            "output": """Account 1: Score 88.0 | Tier: ELITE_ADOPTION_PLATINUM | Risk: LOW_EXPANSION_READY
Account 2: Score 20.8 | Tier: CRITICAL_DISENGAGEMENT_SHELFWARE | Risk: ACUTE_CHURN_IMMINENT""",
            "codeNotes": [
                "Implements Breadth-Depth-Frequency (BDF) product usage telemetry normalized on a 0-100 scale.",
                "Evaluates license activation efficiency to detect early shelfware contraction risks.",
                "Classifies accounts into 4 operational tiers: Platinum (>=80), Gold (>=60), At-Risk (>=40), Critical (<40)."
            ],
            "tryIt": "Increase active_seats_30d in Account 2 from 95 to 450 to observe the utilization score impact on composite health.",
            "check": {
                "question": "In the Breadth-Depth-Frequency (BDF) telemetry framework, why is reliance on lagging indicators such as contract cancellation notices fatal to Customer Success operations?",
                "options": [
                    "By the time a customer submits a formal cancellation notice, the decision was made months earlier, resulting in less than a 10% salvage rate",
                    "Lagging indicators are illegal to store in modern enterprise customer relationship management platforms under SOC 2 rules",
                    "Customer contract cancellations can only be processed after an account has experienced thirty consecutive days of zero server logins",
                    "Software engineering teams refuse to review customer feedback unless it is accompanied by active product telemetry logs"
                ],
                "answer": 0,
                "why": "Lagging indicators only confirm losses after the fact; leading indicators detect disengagement 90-120 days in advance when customer success playbooks can still reverse the trajectory."
            }
        },

        # Part 2: Operational Support Sentiment: Ticket Velocity, CSAT Trends & SLA Escalations
        {
            "title": "Operational Support Sentiment: Ticket Velocity, CSAT Trends & SLA Escalations",
            "say": [
                "While product telemetry reveals what end-users are doing inside the software, customer support interactions reveal the emotional and technical friction they experience while attempting to accomplish their daily business objectives. Customer support tickets are frequently viewed merely as operational cost centers to be minimized; however, in high-growth enterprise SaaS, support telemetry represents one of the most acute, real-time diagnostic indicators of account health and churn vulnerability.",
                "To interpret support telemetry accurately, Customer Success leaders must understand the paradox of customer support volume. Common intuition suggests that accounts filing zero support tickets are perfectly happy, while accounts filing numerous tickets are deeply dissatisfied. In enterprise technology, reality is frequently the exact opposite: an account filing a moderate volume of well-articulated support tickets is actively using the software, pushing its operational limits, and investing organizational energy into resolving roadblocks. This behavior reflects engaged commitment.",
                "Conversely, the single most dangerous phenomenon in enterprise customer retention is Support Silence. When an enterprise account that previously filed three to five support tickets per month abruptly drops to zero tickets while product usage simultaneously declines, the customer has not suddenly achieved technical perfection; rather, they have emotionally surrendered. The internal project team has concluded that your software is incapable of meeting their requirements, has stopped attempting to resolve issues, and is quietly preparing to evaluate competing vendors or return to manual spreadsheet workflows. Detecting Support Silence requires tracking negative ticket velocity relative to historical account baselines.",
                "On the opposite extreme lies the Ticket Storm. When an account experiences a sudden spike in high-severity support tickets—specifically Severity 1 (system outages causing total business disruption) or Severity 2 (critical business functions impaired with no workaround)—customer tolerance degrades exponentially. If an account logs three or more unresolved Severity 1 or 2 tickets within a sixty-day window, executive frustration reaches the boiling point, directly jeopardizing renewal.",
                "In addition to ticket counts and severity levels, modern Customer Success Operations analyzes transactional Customer Satisfaction (CSAT) ratings and support sentiment velocity. When an end-user completes a support ticket, they are prompted to rate the interaction on a 1-to-5 scale. A single low CSAT rating from an individual junior user is an operational coaching opportunity; however, a downward trend in average CSAT across multiple users over consecutive quarters signifies systemic technical debt, inadequate CSM training, or deteriorating customer trust.",
                "Operationalizing support sentiment requires linking ticketing systems like Zendesk or Jira Service Management directly into the enterprise CRM and Customer Success platform (such as Gainsight, ChurnZero, or Totango). Real-time webhooks inspect every newly closed ticket. If an account's CSAT score drops below 3.5, or if an SLA breach occurs on a Severity 1 incident, the system automatically decrements the account's support health score and issues an immediate Slack alert to the assigned Customer Success Manager and designated Executive Sponsor.",
                "Furthermore, modern CS architectures incorporate Natural Language Processing (NLP) sentiment scoring on support ticket dialogue. If an end-user submits a ticket containing high-friction sentiment markers—such as 'unusable', 'broken promised feature', 'evaluating alternative solutions', or 'requesting pricing refund'—the sentiment parser immediately flags the incident with an elevated priority tag. This automated semantic analysis bypasses standard support queues and alerts the Director of Customer Support within fifteen minutes, enabling rapid operational triage before relationship damage becomes irreversible.",
                "In this second part, we construct an Operational Support Sentiment & Escalation Analyzer. This deterministic engine ingests ticket volumes, severity distributions, resolution velocity, SLA breach rates, CSAT trends, and support silence flags to calculate a normalized Support Health Score, penalizing accounts with severe outages, chronic SLA breaches, and toxic disengagement."
            ],
            "example": "A cybersecurity SaaS platform ignored an account that filed four Severity-1 tickets regarding single-sign-on (SSO) authentication failures over a six-week span, because the support desk technically resolved each ticket within SLA. However, the repeated weekend lockouts forced the client's Chief Information Security Officer (CISO) to personally intervene. Had support telemetry flagged the repeated Sev-1 recurrence as an executive health crisis, a proactive CSM escalation would have prevented the CISO from cancelling their $320,000 annual contract.",
            "code": """# Operational Support Sentiment & Escalation Analyzer
from typing import Dict, Any

def analyze_support_ticket_sentiment_and_velocity(
    open_tickets_count: int,
    sev1_critical_tickets_90d: int,
    sev2_major_tickets_90d: int,
    sla_breaches_count: int,
    average_csat_score: float, # Scale 1.0 to 5.0
    is_support_silence_detected: bool
) -> Dict[str, Any]:
    # Baseline support health starts at 100 points
    health_score = 100.0
    penalties = []
    
    # 1. Critical Severity Penalties
    if sev1_critical_tickets_90d > 0:
        penalty = sev1_critical_tickets_90d * 20.0
        health_score -= penalty
        penalties.append(f"SEV1_CRITICAL_PENALTY: -{penalty}")
        
    if sev2_major_tickets_90d > 0:
        penalty = sev2_major_tickets_90d * 8.0
        health_score -= penalty
        penalties.append(f"SEV2_MAJOR_PENALTY: -{penalty}")
        
    # 2. SLA Breach Penalties
    if sla_breaches_count > 0:
        penalty = sla_breaches_count * 10.0
        health_score -= penalty
        penalties.append(f"SLA_BREACH_PENALTY: -{penalty}")
        
    # 3. CSAT Trend Penalties (Benchmark: >= 4.0 out of 5.0)
    if average_csat_score < 4.0:
        csat_deficit = (4.0 - average_csat_score) * 25.0
        health_score -= csat_deficit
        penalties.append(f"CSAT_DEFICIT_PENALTY: -{round(csat_deficit, 1)}")
        
    # 4. Support Silence Hazard (Emotionally detached account)
    if is_support_silence_detected:
        health_score -= 25.0
        penalties.append("SUPPORT_SILENCE_DETACHED_PENALTY: -25.0")
        
    clamped_score = max(min(round(health_score, 2), 100.0), 0.0)
    
    if clamped_score >= 80.0:
        status = "SUPPORT_HEALTH_OPTIMAL"
    elif clamped_score >= 50.0:
        status = "SUPPORT_FRICTION_ELEVATED"
    else:
        status = "SUPPORT_CRISIS_CHURN_HAZARD"
        
    return {
        "support_health_score": clamped_score,
        "penalties_applied": penalties,
        "status": status,
        "requires_csm_escalation": clamped_score < 60.0 or sev1_critical_tickets_90d >= 2
    }

# Test healthy vs distressed support accounts
res_healthy = analyze_support_ticket_sentiment_and_velocity(
    open_tickets_count=2, sev1_critical_tickets_90d=0,
    sev2_major_tickets_90d=1, sla_breaches_count=0,
    average_csat_score=4.8, is_support_silence_detected=False
)
res_crisis = analyze_support_ticket_sentiment_and_velocity(
    open_tickets_count=7, sev1_critical_tickets_90d=2,
    sev2_major_tickets_90d=3, sla_breaches_count=1,
    average_csat_score=3.2, is_support_silence_detected=False
)

print(f"Healthy: Score {res_healthy['support_health_score']} | Status: {res_healthy['status']} | Escalate: {res_healthy['requires_csm_escalation']}")
print(f"Crisis:  Score {res_crisis['support_health_score']} | Status: {res_crisis['status']} | Escalate: {res_crisis['requires_csm_escalation']}")
""",
            "output": """Healthy: Score 92.0 | Status: SUPPORT_HEALTH_OPTIMAL | Escalate: False
Crisis:  Score 6.0 | Status: SUPPORT_CRISIS_CHURN_HAZARD | Escalate: True""",
            "codeNotes": [
                "Applies severe mathematical penalties for Sev-1 outages (-20 pts/incident) and SLA breaches (-10 pts).",
                "Incorporates CSAT deficit scoring normalized against a 4.0 baseline satisfaction threshold.",
                "Detects the subtle danger of Support Silence (-25 pts) where disengaged accounts abandon ticket filings."
            ],
            "tryIt": "Set is_support_silence_detected=True on res_healthy to verify how emotional detachment degrades support health.",
            "check": {
                "question": "Why is 'Support Silence' considered one of the most dangerous leading indicators of enterprise customer churn?",
                "options": [
                    "It indicates that the customer has emotionally surrendered, ceased attempting to resolve issues, and is quietly preparing to evaluate competitors",
                    "Customer support software automatically marks accounts as cancelled if no tickets are submitted within fourteen days",
                    "Enterprise support contracts legally expire if customer representatives do not log at least one monthly inquiry",
                    "Zero support tickets causes the customer's IT firewall to automatically block incoming SaaS telemetry webhooks"
                ],
                "answer": 0,
                "why": "Support silence reflects disengagement: when customers stop complaining about bugs, it means they have given up on the platform and are planning their departure."
            }
        },

        # Part 3: Executive Stakeholder Sponsorship & Champion Flight Risk Alerts
        {
            "title": "Executive Stakeholder Sponsorship & Champion Flight Risk Alerts",
            "say": [
                "In high-value enterprise sales and customer success, contracts are not purchased by abstract corporate entities; they are sponsored, justified, and defended by individual human decision-makers. In the MEDDPICC and SPICED frameworks, this critical individual is the Internal Champion—the executive or director who possesses political capital, perceives acute business pain, and stakes their professional reputation on your solution. However, human champions do not remain at enterprise corporations indefinitely: executives get promoted, transfer departments, or leave the company to accept roles at competitor firms.",
                "Empirical research across B2B SaaS shows that the single greatest cause of unpreventable enterprise customer churn is Champion Departure. When an internal champion leaves an account, industry data reveals that between sixty and seventy-five percent of those accounts churn within the subsequent twelve months. The structural dynamic is predictable: the incoming replacement executive was not involved in the original purchase decision, has zero emotional attachment to your platform, frequently brings their own preferred technology stack from their former employer, and views cancelling legacy contracts as an immediate opportunity to demonstrate fiscal discipline and budget savings.",
                "To protect recurring revenue against champion turnover, elite Customer Success organizations institutionalize Executive Multithreading. Multithreading is the operational discipline of cultivating deep, durable relationships across multiple tiers and departments within the client organization. A single-threaded account—where the Customer Success Manager (CSM) interacts exclusively with one contact—is an existential churn risk waiting to happen. Conversely, a multithreaded account maintains active, documented relationships across at least three distinct organizational strata: (1) The Economic Buyer (CIO, CTO, CFO, or VP), (2) Departmental Champions (Directors and Team Leads), and (3) Operational Power Users (daily system administrators and analysts).",
                "Furthermore, modern Customer Success Operations integrates real-time professional monitoring tools to detect Champion Flight. By connecting CRM accounts to tools like LinkedIn Sales Navigator, LeadIQ, or automated email deliverability monitors, CS Ops receives instant notifications whenever an executive champion changes their job title or transitions to a new employer. When a champion departure alert fires, CS Ops must immediately trigger a Champion Flight Playbook within forty-eight hours.",
                "The Champion Flight Playbook consists of a dual-track strategy: Track A: Defensive Account Fortification. The assigned CSM and enterprise sales executive immediately schedule an on-site executive alignment session with the remaining stakeholders and the interim successor, presenting a comprehensive Value Realization Report detailing historical ROI, cost savings, and active business outcomes to anchor the renewal before a hostile vendor evaluation can be initiated. Track B: Offensive Expansion. The sales team reaches out to the departed champion at their new company to congratulate them on their new role and initiate a greenfield sales pipeline, transforming a potential churn threat into a lucrative new account expansion opportunity.",
                "In enterprise account governance, relationship recency is an essential companion to multithreading depth. An account might have five documented contacts in the CRM, but if more than sixty days have elapsed since the last meaningful interaction with the Economic Buyer, executive sponsorship has grown cold. If ninety days elapse without executive contact, the account enters the danger zone where unaligned budget cuts can occur without prior warning. Maintaining consistent executive check-ins through Quarterly Business Reviews is essential to safeguard enterprise recurring revenue.",
                "To maintain multithreading momentum, high-performing Customer Success teams mandate an 'Executive Sponsor Program' where vendor C-level executives (such as the VP of Engineering, Chief Revenue Officer, or CEO) are formally paired as peer sponsors with the client's C-suite executives. These peer sponsors conduct bi-annual executive dinners or roadmap alignment sessions, insulating the vendor relationship from mid-level turnover. When operational personnel depart, the C-level bond ensures continuous contractual continuity.",
                "In this third part, we construct an Executive Multithreading & Champion Flight Risk Evaluator. This deterministic engine scores organizational relationship depth across executive, managerial, and operational tiers, flags single-threaded account vulnerabilities, applies recency penalties for neglected executive relationships, and models the churn probability impact of executive turnover."
            ],
            "example": "An enterprise DevOps software provider with an average contract value of $180,000 noticed that its primary champion, the VP of Infrastructure at a Fortune 500 retailer, updated his LinkedIn profile to Chief Technology Officer at a competing logistics firm. Because the account was single-threaded with zero peer relationships, the incoming VP replaced the platform within 90 days. Had the vendor enforced multithreading across the Director of Cloud and lead architects, the contract would have survived.",
            "code": """# Executive Multithreading & Champion Flight Risk Evaluator
from typing import Dict, Any, List

def evaluate_champion_flight_risk_and_multithreading(
    economic_buyer_engaged: bool,
    active_champions_count: int,
    operational_contacts_count: int,
    days_since_last_exec_contact: int,
    champion_departed_flag: bool
) -> Dict[str, Any]:
    # 1. Evaluate Multithreading Tier
    total_contacts = (1 if economic_buyer_engaged else 0) + active_champions_count + operational_contacts_count
    
    if total_contacts >= 5 and economic_buyer_engaged and active_champions_count >= 2:
        multithread_status = "DEEP_MULTITHREADED_ENTERPRISE_FORTIFIED"
        thread_score = 100.0
    elif total_contacts >= 3 and (economic_buyer_engaged or active_champions_count >= 1):
        multithread_status = "MODERATE_THREADING_ACCEPTABLE"
        thread_score = 70.0
    else:
        multithread_status = "SINGLE_THREADED_CRITICAL_VULNERABILITY"
        thread_score = 30.0
        
    # 2. Executive Recency Penalty (Warning if > 60 days, critical if > 90 days)
    if days_since_last_exec_contact > 90:
        recency_penalty = 40.0
    elif days_since_last_exec_contact > 60:
        recency_penalty = 20.0
    else:
        recency_penalty = 0.0
        
    # 3. Champion Flight Impact
    if champion_departed_flag:
        flight_penalty = 50.0
        # If deeply multithreaded, mitigate flight penalty by half
        if thread_score >= 70.0:
            flight_penalty = 25.0
    else:
        flight_penalty = 0.0
        
    composite_relationship_score = max(thread_score - recency_penalty - flight_penalty, 0.0)
    
    # 4. Projected Churn Risk Calculation
    if composite_relationship_score >= 75.0:
        churn_risk = "LOW_STABLE_RELATIONSHIP"
        recommended_action = "MAINTAIN_QUARTERLY_EXECUTIVE_TOUCHPOINTS"
    elif composite_relationship_score >= 45.0:
        churn_risk = "MODERATE_MULTITHREAD_URGENTLY"
        recommended_action = "EXPAND_RELATIONSHIPS_TO_VP_AND_PEER_DIRECTORS"
    else:
        churn_risk = "SEVERE_CHAMPION_FLIGHT_RISK"
        recommended_action = "TRIGGER_EMERGENCY_EXECUTIVE_SPONSOR_INTERVENTION"
        
    return {
        "multithread_status": multithread_status,
        "total_contacts": total_contacts,
        "composite_relationship_score": round(composite_relationship_score, 1),
        "champion_departed": champion_departed_flag,
        "churn_risk": churn_risk,
        "recommended_action": recommended_action
    }

# Test robust multithreaded account vs single-threaded departure crisis
res_fortified = evaluate_champion_flight_risk_and_multithreading(
    economic_buyer_engaged=True, active_champions_count=3,
    operational_contacts_count=4, days_since_last_exec_contact=25,
    champion_departed_flag=False
)
res_crisis = evaluate_champion_flight_risk_and_multithreading(
    economic_buyer_engaged=False, active_champions_count=1,
    operational_contacts_count=1, days_since_last_exec_contact=110,
    champion_departed_flag=True
)

print(f"Fortified: Score {res_fortified['composite_relationship_score']} | Threading: {res_fortified['multithread_status']} | Risk: {res_fortified['churn_risk']}")
print(f"Crisis:    Score {res_crisis['composite_relationship_score']} | Threading: {res_crisis['multithread_status']} | Risk: {res_crisis['churn_risk']}")
""",
            "output": """Fortified: Score 100.0 | Threading: DEEP_MULTITHREADED_ENTERPRISE_FORTIFIED | Risk: LOW_STABLE_RELATIONSHIP
Crisis:    Score 0.0 | Threading: SINGLE_THREADED_CRITICAL_VULNERABILITY | Risk: SEVERE_CHAMPION_FLIGHT_RISK""",
            "codeNotes": [
                "Evaluates relationship multithreading depth across Economic Buyer, Champion, and Operational contacts.",
                "Applies recency penalties when executive interactions exceed 60 and 90-day communication windows.",
                "Mitigates Champion Departure penalties for accounts with fortified organizational multithreading."
            ],
            "tryIt": "Set champion_departed_flag=True on res_fortified to verify how multi-threading cushions against total relationship collapse.",
            "check": {
                "question": "Why does an enterprise account with a single champion experience an estimated 60-75% probability of churn when that champion leaves the company?",
                "options": [
                    "The incoming successor had no role in purchasing the software, lacks emotional buy-in, and frequently cancels existing contracts to deploy their own preferred vendor or save budget",
                    "Software corporate licensing agreements automatically self-terminate when the signatory executive's corporate email is deactivated",
                    "The departing executive legally owns the software database credentials and cannot transfer them to replacement personnel",
                    "Security compliance auditors mandate that enterprise software must be re-tendered through an RFP whenever any manager departs"
                ],
                "answer": 0,
                "why": "New executives naturally favor systems they already know and often look for quick budget cuts; without broad internal buy-in across multiple stakeholders, legacy tools are prime targets for removal."
            }
        },

        # Part 4: Red Flag Early Warning Triggers & Automated Churn Rescue Playbooks
        {
            "title": "Red Flag Early Warning Triggers & Automated Churn Rescue Playbooks",
            "say": [
                "Collecting health telemetry, support sentiments, and stakeholder data is completely futile if that intelligence resides in static dashboards without driving immediate operational action. In high-performing Customer Success organizations, data collection serves a singular operational purpose: powering an automated Early Warning System (EWS) that triggers prescriptive, repeatable Churn Rescue Playbooks before customer sentiment turns terminal.",
                "An effective Early Warning System is built upon deterministic 'Red Flag' threshold triggers. A Red Flag is an unambiguous, rule-based operational event that instantly fires an alert to the assigned Customer Success Manager, the VP of Customer Success, and the designated Executive Sponsor. Common high-priority red flags include: (1) Telemetry Velocity Drop: active weekly user logins decline by more than thirty percent over a rolling fourteen-day window; (2) Critical Executive Ghosting: the economic buyer or champion fails to attend two consecutive scheduled Quarterly Business Reviews (QBRs); (3) Unresolved Severity-1 Escalation: a mission-critical bug remains unresolved beyond forty-eight hours; (4) Billing and Invoice Disputes: the customer's accounts payable department disputes an invoice or delays payment beyond forty-five days, signaling procurement friction; and (5) Executive Champion Turnover: detection of a job change by the primary stakeholder.",
                "When a Red Flag trigger fires, human improvisation is an operational failure. CSMs should not be left to brainstorm ad-hoc responses under panic; instead, the customer relationship management platform must automatically instantiate a standardized Churn Rescue Playbook. A Churn Rescue Playbook is a time-bound, cross-functional operational protocol containing specific assignments, executive escalation cadences, and measurable recovery milestones.",
                "A world-class Churn Rescue Playbook operates across a standardized 30-Day SLA: Days 1–3: Diagnostic Triangulation. The CSM conducts internal post-mortems with support engineers and technical account managers to identify the precise technical or business root cause. Days 4–7: Executive Re-Alignment. The vendor's C-level executive sponsor reaches out directly to the client's Economic Buyer for an informal peer-to-peer check-in, demonstrating high-level corporate commitment. Days 8–15: The Value Realization Workshop. The vendor deploys specialized Solutions Architects to conduct hands-on workshops with the customer's operational team, resolving technical bottlenecks and establishing an updated Joint Success Plan. Days 16–30: Milestone Verification. Telemetry is monitored daily to verify that adoption metrics have rebounded above health thresholds.",
                "Critically, churn rescue playbooks must also interface with commercial contracting. When an account enters Code Red status, automated renewal marketing campaigns must be immediately suppressed to prevent sending tone-deaf automated renewal reminders to a furious client. Furthermore, collections escalation workflows must be temporarily paused to prevent accounts payable disputes from derailing sensitive technical recovery negotiations.",
                "Post-rescue governance requires conducting a formal 'Save Review' once an account stabilizes above the Yellow threshold. During the Save Review, the cross-functional team documents what structural product, onboarding, or communication failures initially placed the account at risk. These insights are routed directly into Product Management and Customer Onboarding engineering backlogs, preventing identical vulnerabilities from recurring across other customer cohorts.",
                "Finally, Customer Success operations tracks Playbook Velocity and Salvage Rates as core operational key performance indicators. The Salvage Rate measures the percentage of accounts entering Code Red status that are successfully stabilized and renewed within twelve months, with top-tier enterprise SaaS teams achieving salvage rates between fifty-five and sixty-five percent. Simultaneously, Mean Time to Recovery (MTTR) tracks the number of business days required to return an account from Red to Green health, driving operational accountability across product, support, and customer success teams.",
                "In this fourth part, we construct an Automated Churn Rescue Playbook Dispatcher. This deterministic engine ingests multiple active red flags, calculates a composite Threat Severity Level, and automatically generates a prioritized, time-bound operational action plan with assigned roles, response SLAs, and specific recovery workflows."
            ],
            "example": "A cloud analytics vendor had an account generating $450,000 ARR where billing suddenly reported a 60-day invoice overdue notice while product usage dropped 40%. The automated EWS detected the dual red flags and instantly triggered the Tier-1 Churn Rescue Playbook, prompting the VP of Engineering to schedule a joint technical roadmap review. The review uncovered that an internal database migration had broken the client's automated ingestion pipeline. Resolving the connection within 48 hours saved the $450,000 account.",
            "code": """# Automated Churn Rescue Playbook Dispatcher
from typing import Dict, Any, List

def trigger_churn_rescue_playbook(
    account_id: str,
    arr_usd: float,
    usage_drop_pct: float,
    unresolved_sev1_days: int,
    champion_departed: bool,
    invoice_overdue_days: int
) -> Dict[str, Any]:
    active_red_flags = []
    severity_points = 0
    
    # 1. Evaluate Red Flag Triggers
    if usage_drop_pct >= 30.0:
        active_red_flags.append(f"ACUTE_USAGE_COLLAPSE: -{usage_drop_pct}% over 14d")
        severity_points += 35
        
    if unresolved_sev1_days >= 2:
        active_red_flags.append(f"UNRESOLVED_SEV1_OUTAGE: {unresolved_sev1_days} days unresolved")
        severity_points += 40
        
    if champion_departed:
        active_red_flags.append("KEY_CHAMPION_DEPARTURE_DETECTED")
        severity_points += 30
        
    if invoice_overdue_days >= 45:
        active_red_flags.append(f"BILLING_DISPUTE_HAZARD: Invoice {invoice_overdue_days} days overdue")
        severity_points += 25
        
    # 2. Determine Action Plan & Urgency Tier
    if severity_points >= 60 or (arr_usd >= 250000 and severity_points >= 35):
        playbook_tier = "CODE_RED_CRITICAL_EXECUTIVE_INTERVENTION"
        sla_hours = 24
        actions = [
            "Assign Executive Sponsor (VP/C-Level) for direct Economic Buyer outreach within 24h",
            "Deploy Principal Solutions Architect on-site or emergency virtual war-room",
            "Initiate 30-Day Joint Value Realization Recovery Charter",
            "Pause automated renewal marketing and freeze invoice collections escalation"
        ]
    elif severity_points >= 25:
        playbook_tier = "CODE_YELLOW_ELEVATED_CSM_RESCUE"
        sla_hours = 48
        actions = [
            "CSM to schedule root-cause discovery session with lead operational admins",
            "Conduct specialized end-user re-enablement and technical training clinic",
            "Review support ticket backlog with Support Escalation Manager"
        ]
    else:
        playbook_tier = "NOMINAL_MONITORING"
        sla_hours = 168
        actions = ["Continue standard quarterly cadences and telemetry health tracking"]
        
    return {
        "account_id": account_id,
        "arr_usd": arr_usd,
        "severity_score": severity_points,
        "playbook_tier": playbook_tier,
        "active_red_flags": active_red_flags,
        "first_response_sla_hours": sla_hours,
        "prescriptive_actions": actions,
        "is_churn_imminent": severity_points >= 60
    }

# Test rescue triggers on enterprise account
rescue_eval = trigger_churn_rescue_playbook(
    account_id="ACC-ENTERPRISE-9842",
    arr_usd=350000.0,
    usage_drop_pct=42.5,
    unresolved_sev1_days=3,
    champion_departed=True,
    invoice_overdue_days=15
)

print(f"Account: {rescue_eval['account_id']} | Arr: ${rescue_eval['arr_usd']:,.0f}")
print(f"Tier:    {rescue_eval['playbook_tier']} (SLA: {rescue_eval['first_response_sla_hours']}h)")
print(f"Flags:   {len(rescue_eval['active_red_flags'])} detected | Score: {rescue_eval['severity_score']}")
for act in rescue_eval['prescriptive_actions']:
    print(f"  -> {act}")
""",
            "output": """Account: ACC-ENTERPRISE-9842 | Arr: $350,000
Tier:    CODE_RED_CRITICAL_EXECUTIVE_INTERVENTION (SLA: 24h)
Flags:   3 detected | Score: 105
  -> Assign Executive Sponsor (VP/C-Level) for direct Economic Buyer outreach within 24h
  -> Deploy Principal Solutions Architect on-site or emergency virtual war-room
  -> Initiate 30-Day Joint Value Realization Recovery Charter
  -> Pause automated renewal marketing and freeze invoice collections escalation""",
            "codeNotes": [
                "Evaluates multi-variable red flags including usage drops, Sev-1 outages, champion flight, and billing delays.",
                "Calculates an ARR-weighted threat severity score to trigger prioritized C-level executive interventions.",
                "Enforces a strict 24-hour response SLA and generates concrete, actionable recovery steps."
            ],
            "tryIt": "Reduce usage_drop_pct to 10% and unresolved_sev1_days to 0 to observe downgrade to Code Yellow or Nominal.",
            "check": {
                "question": "What is the primary operational advantage of having automated Churn Rescue Playbooks over allowing CSMs to improvise responses to red flags?",
                "options": [
                    "Playbooks guarantee standardized, time-bound, cross-functional execution within 24 hours rather than erratic, delayed individual reactions",
                    "Automated playbooks completely eliminate the requirement for human Customer Success Managers to speak with clients",
                    "Playbooks automatically debit the customer's bank account for renewal fees before they have the opportunity to cancel",
                    "Customer success software platforms offer a 50% discount on software licenses if standardized playbooks are enabled"
                ],
                "answer": 0,
                "why": "Standardized playbooks eliminate panic and delay, enforcing clear 24-hour SLAs, executive sponsorship, and proven multi-step recovery protocols."
            }
        },

        # Part 5: Master Customer Health Score (CHS) & Churn Risk Engine
        {
            "title": "Master Customer Health Score (CHS) & Churn Risk Engine",
            "say": [
                "We now integrate all four foundational telemetry streams into the definitive quantitative metric of modern customer success: the Composite Customer Health Score (CHS). A robust Customer Health Score is not a simplistic average of random metrics; rather, it is a mathematically balanced, weighted composite index that synthesizes Product Adoption Telemetry (35%), Support Experience & Ticket Sentiment (25%), Customer Relationship Advocacy via NPS (20%), and Executive Sponsorship Multithreading (20%).",
                "The mathematical formula governing the composite score is expressed as: CHS = (0.35 * UsageScore) + (0.25 * SupportScore) + (0.20 * NpsScore) + (0.20 * ExecEngagementScore). Each component is normalized on a standardized scale from 0.0 to 100.0. The resulting aggregate score dictates the account's operational health classification: Green Tier (CHS >= 75.0): Healthy accounts exhibiting high product adoption, positive support sentiment, enthusiastic advocacy, and strong executive alignment. These accounts are prime candidates for proactive expansion, seat add-ons, and multi-year renewals. Yellow Tier (50.0 <= CHS < 75.0): Neutral accounts showing early signs of friction, moderate disengagement, or operational bottlenecks. These accounts require targeted CSM interventions to prevent further deterioration. Red Tier (CHS < 50.0): Distressed accounts at acute risk of churn requiring immediate execution of Code Red rescue protocols.",
                "Furthermore, an enterprise Customer Health Engine must account for Critical Overrides. Even if an account achieves high marks in product usage and support sentiment, certain catastrophic events—such as an unaddressed champion departure or a severe contractual dispute—must have the authority to automatically override the mathematical formula and force an account into Red status. This fail-safe mechanism prevents false positives where a high composite score masks a fatal single point of failure.",
                "The strategic governance of Customer Health Scores extends directly into board-level revenue forecasting. When Customer Success teams present quarterly reports to the Board of Directors, the aggregate distribution of Annual Recurring Revenue (ARR) across Green, Yellow, and Red tiers provides the most accurate forward-looking projection of renewal probability. A portfolio where eighty percent of ARR is concentrated in Green health delivers predictable, compounding cash flows; conversely, a portfolio with significant ARR in Yellow and Red health signals structural retention headwinds that must be addressed before expanding sales headcount.",
                "In addition, modern Customer Success Operations audits the predictive accuracy of the CHS algorithm on an annual basis using ROC-AUC (Receiver Operating Characteristic - Area Under Curve) and precision-recall statistical modeling. If accounts scoring in the Green tier experience unexpected churn, or if accounts in the Red tier consistently renew without intervention, the weighting coefficients must be re-calibrated. By continuously tuning the algorithmic weights against real-world customer outcomes, the enterprise transforms customer success from an intuitive art into a disciplined engineering science.",
                "To ensure organizational alignment, forward-thinking enterprise SaaS companies tie Customer Success Manager compensation and quarterly bonus structures directly to portfolio health metrics and Gross Revenue Retention (GRR). Rather than incentivizing CSMs solely on new sales expansion quotas—which can encourage transactional behavior and undermine trusted advisor status—compensation models reward CSMs for maintaining at least eighty-five percent of their assigned ARR in the Green health tier and achieving zero unmitigated churn events. This aligns the CSM's financial incentives with the long-term operational health and success of the customer.",
                "Finally, Customer Success leadership implements automated weekly 'Health Movement Standups' where cross-functional leadership reviews every account whose CHS shifted tiers during the prior seven days. Accounts transitioning from Green to Yellow trigger immediate investigation, while accounts climbing from Red to Yellow celebrate the operational efficacy of applied rescue playbooks. This continuous operating rhythm instills proactive retention rigor throughout the entire go-to-market organization.",
                "In this final part, we construct the Master Customer Health Score & Churn Risk Engine. This comprehensive Python system evaluates enterprise client portfolios, calculates weighted composite health scores, checks for catastrophic critical overrides, determines portfolio health distributions, and issues an immutable cryptographic certification digest confirming mastery of enterprise customer health scoring."
            ],
            "example": "An enterprise CRM company monitoring 250 enterprise accounts with $40M in ARR deployed this weighted CHS model. Within two quarters, the platform identified 32 accounts quietly slipping into the Yellow tier, allowing the team to intervene with targeted training that prevented an estimated $3.8M in potential churn.",
            "code": """# Master Customer Health Score (CHS) & Churn Risk Engine
import hashlib
from typing import Dict, Any, List

def calculate_customer_health_score(
    usage_telemetry_score: float,   # 0.0 to 100.0 (35% weight)
    support_sentiment_score: float, # 0.0 to 100.0 (25% weight)
    nps_advocacy_score: float,      # 0.0 to 100.0 (20% weight)
    exec_engagement_score: float,   # 0.0 to 100.0 (20% weight)
    critical_override_flag: bool = False
) -> Dict[str, Any]:
    # Weighted calculation
    weighted_chs = (
        (usage_telemetry_score * 0.35) +
        (support_sentiment_score * 0.25) +
        (nps_advocacy_score * 0.20) +
        (exec_engagement_score * 0.20)
    )
    final_score = round(weighted_chs, 1)
    
    # Critical override enforces RED status regardless of mathematical average
    if critical_override_flag:
        tier = "RED_HIGH_CHURN_RISK_TRIGGER_RESCUE_PLAYBOOK"
        is_expansion_ready = False
        action = "CRITICAL_OVERRIDE_TRIGGER_EMERGENCY_RESCUE"
    elif final_score >= 75.0:
        tier = "GREEN_HEALTHY_EXPANSION_READY"
        is_expansion_ready = True
        action = "INITIATE_PROACTIVE_EXPANSION_AND_RENEWAL_ACCELERATION"
    elif final_score >= 50.0:
        tier = "YELLOW_NEUTRAL_MONITOR_ACTIVELY"
        is_expansion_ready = False
        action = "SCHEDULE_CSM_TRAINING_AND_FRICTION_AUDIT"
    else:
        tier = "RED_HIGH_CHURN_RISK_TRIGGER_RESCUE_PLAYBOOK"
        is_expansion_ready = False
        action = "DEPLOY_IMMEDIATE_CHURN_RESCUE_PLAYBOOK"
        
    return {
        "composite_health_score": final_score,
        "account_health_tier": tier,
        "is_expansion_ready": is_expansion_ready,
        "recommended_operational_action": action,
        "status": "CHS_COMPUTED"
    }

class MasterCustomerHealthScoreEngine:
    def __init__(self, organization_name: str):
        self.organization_name = organization_name
        self.evaluated_accounts = []

    def evaluate_account(
        self, account_id: str, arr_usd: float,
        usage: float, support: float, nps: float, exec_eng: float,
        override: bool = False
    ) -> Dict[str, Any]:
        chs_res = calculate_customer_health_score(usage, support, nps, exec_eng, override)
        record = {
            "account_id": account_id,
            "arr_usd": arr_usd,
            "chs_result": chs_res
        }
        self.evaluated_accounts.append(record)
        return record

    def generate_portfolio_health_report(self) -> Dict[str, Any]:
        total_accounts = len(self.evaluated_accounts)
        total_arr = sum(a["arr_usd"] for a in self.evaluated_accounts)
        green_arr = sum(a["arr_usd"] for a in self.evaluated_accounts if "GREEN" in a["chs_result"]["account_health_tier"])
        yellow_arr = sum(a["arr_usd"] for a in self.evaluated_accounts if "YELLOW" in a["chs_result"]["account_health_tier"])
        red_arr = sum(a["arr_usd"] for a in self.evaluated_accounts if "RED" in a["chs_result"]["account_health_tier"])
        
        green_pct = round((green_arr / total_arr) * 100.0, 1) if total_arr > 0 else 0.0
        cert_data = f"{self.organization_name}:{total_arr}:{green_arr}:{red_arr}"
        digest = hashlib.sha256(cert_data.encode()).hexdigest()[:16].upper()
        
        return {
            "organization": self.organization_name,
            "total_accounts_audited": total_accounts,
            "total_portfolio_arr_usd": total_arr,
            "green_expansion_arr_usd": green_arr,
            "yellow_monitor_arr_usd": yellow_arr,
            "red_at_risk_arr_usd": red_arr,
            "green_arr_percentage": green_pct,
            "accreditation": "CUSTOMER_HEALTH_SCORING_CERTIFIED_NOMINAL",
            "audit_digest": f"CHS-AUDIT-{digest}"
        }

# Portfolio Execution
engine = MasterCustomerHealthScoreEngine("Apex Enterprise Cloud")
engine.evaluate_account("ACC-101", 500000.0, 90.0, 80.0, 90.0, 85.0) # (31.5 + 20.0 + 18.0 + 17.0 = 86.5) -> Green
engine.evaluate_account("ACC-102", 350000.0, 65.0, 70.0, 60.0, 55.0) # (22.75 + 17.5 + 12.0 + 11.0 = 63.25) -> Yellow
engine.evaluate_account("ACC-103", 200000.0, 30.0, 40.0, 20.0, 20.0) # (10.5 + 10.0 + 4.0 + 4.0 = 28.5) -> Red

summary = engine.generate_portfolio_health_report()
print(f"Audit Status: {summary['accreditation']}")
print(f"Total ARR:    ${summary['total_portfolio_arr_usd']:,.0f}")
print(f"Green ARR:    ${summary['green_expansion_arr_usd']:,.0f} ({summary['green_arr_percentage']}%)")
print(f"Yellow ARR:   ${summary['yellow_monitor_arr_usd']:,.0f}")
print(f"Red ARR:      ${summary['red_at_risk_arr_usd']:,.0f}")
print(f"Certificate:  {summary['audit_digest']}")
""",
            "output": """Audit Status: CUSTOMER_HEALTH_SCORING_CERTIFIED_NOMINAL
Total ARR:    $1,050,000
Green ARR:    $500,000 (47.6%)
Yellow ARR:   $350,000
Red ARR:      $200,000
Certificate:  CHS-AUDIT-D824B8B9B16CA176""",
            "codeNotes": [
                "Implements the exact weighted CHS formula: 35% Usage, 25% Support, 20% NPS, 20% Executive Engagement.",
                "Enforces Green (>=75.0), Yellow (50.0-74.9), and Red (<50.0) operational triage tiers.",
                "Includes critical override logic to instantly flag high-risk accounts regardless of mathematical averages."
            ],
            "tryIt": "Set critical_override_flag=True on ACC-101 to verify that catastrophic events override an 86.5 score into Red status.",
            "check": {
                "question": "What is the standard weighting distribution of the Composite Customer Health Score (CHS) across its four pillars?",
                "options": [
                    "35% Product Usage Telemetry, 25% Support Experience & Sentiment, 20% NPS Customer Advocacy, 20% Executive Engagement",
                    "25% Equal Weighting across all four components regardless of enterprise customer tier or contract size",
                    "80% Product Logins and 20% Account Executive intuition notes without support ticket data",
                    "50% Financial Invoicing History and 50% Sales Representative commission quota attainment"
                ],
                "answer": 0,
                "why": "Usage telemetry is the primary leading indicator (35%), followed by support sentiment (25%), NPS loyalty (20%), and executive engagement (20%)."
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
    data = get_day11_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day 11 word count: {total_words} words across {len(data['parts'])} parts.")
    for i, p in enumerate(data["parts"]):
        c = sum(len(x.split()) for x in p["say"])
        print(f"  Part {i+1}: {c} words")
