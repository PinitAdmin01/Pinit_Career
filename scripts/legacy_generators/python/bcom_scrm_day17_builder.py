import sys
import json
import hashlib

def get_day17_data() -> dict:
    day = 17
    title = "CRM Workflow Automation, SLA Escalation & Lead Routing (Score >= 70 & Round-Robin)"
    goal = "Engineer enterprise lead scoring matrices, weighted demographic and behavioral scoring engines, round-robin territory distribution algorithms, and automated 15-minute SLA escalation workflows to maximize inbound lead conversion velocity."
    minutes = 45
    recap = "Previously in Day 16, we mastered relational CRM database architecture, foreign key integrity, programmatic deduplication, and stage-gated validation rules. Today in Day 17, we construct the high-velocity operational routing engine of Revenue Operations: two-tier demographic and behavioral lead scoring, capacity-aware round-robin distribution, 15-minute speed-to-lead SLA escalations, and event-driven webhook automation."

    parts = [
        # Part 1: Automated Two-Tier Lead Scoring: Demographic Fit + Behavioral Intent (Score >= 70 SQL Threshold)
        {
            "title": "Automated Two-Tier Lead Scoring: Demographic Fit + Behavioral Intent (Score >= 70)",
            "say": [
                "Welcome to Day 17 of B.Com Sales, Customer Success & CRM (SCRM). Yesterday, we established the relational foundation of the revenue engine by architecting pristine CRM database schemas, eliminating duplicate records, and stage-gating pipeline progression. Today, we turn our engineering focus to lead velocity: the automated ingestion, qualification, and routing of inbound prospects. In high-velocity commercial organizations, treating all incoming leads equally is a recipe for operational failure. When an enterprise SDR spends two hours researching a student downloading an academic eBook while a Chief Technology Officer with a $500,000 budget sits untouched in an unassigned queue, marketing spend is wasted and commercial pipeline evaporates.",
                "To separate high-probability buyers from tire-kickers at machine speed, revenue operations architects engineer Two-Tier Lead Scoring Engines. A naive scoring model relies purely on demographic data (who the prospect is) or purely on behavioral data (what the prospect did). Both single-dimension approaches create severe operational distortions. A student or competitor from a Fortune 500 company has a pristine demographic profile (enterprise company size, prestigious corporate domain) but zero purchasing intent. Conversely, a junior engineer downloading ten API documentation sheets has intense behavioral engagement but zero budget signature authority. High-performing RevOps architectures resolve this dilemma by calculating a balanced Composite Lead Score combining explicit Demographic Fit with implicit Behavioral Intent.",
                "Tier One: Demographic / Firmographic Fit (0 to 50 Points). Explicit demographic scoring evaluates how closely the prospective organization and individual contact align with the company's Ideal Customer Profile (ICP). Primary firmographic dimensions include corporate employee headcount (+15 points for mid-market/enterprise tiers between 100 and 1,000 employees), annual corporate revenue (+10 points for companies generating over $20M ARR), target vertical industry (+10 points for strategic sectors like FinTech or HealthTech), and individual buyer authority (+15 points for VP, SVP, or C-suite executive titles). An applicant with a VP title at a 500-employee enterprise immediately captures 40 demographic points.",
                "Tier Two: Behavioral Intent & Digital Body Language (0 to 50 Points). Implicit behavioral scoring tracks the prospect's digital interaction footprint across the marketing web property, product trial, and email campaigns. Because not all digital actions indicate commercial intent, RevOps models assign differentiated point weights based on buying signal strength. Low-intent actions—such as reading a top-of-funnel blog post or opening a marketing newsletter—earn modest scores (+3 to +5 points). Medium-intent actions—such as downloading a technical whitepaper or attending a live product webinar—earn intermediate credit (+10 to +15 points). High-intent commercial actions—such as visiting the enterprise pricing page two or more times (+20 points) or submitting a direct 'Request a Demo' form (+25 points)—demonstrate immediate purchasing urgency.",
                "The two scoring tiers combine additively into a Total Composite Score: Total Score = Demographic Fit (0-50) + Behavioral Intent (0-50). The operational threshold separating standard marketing prospects from Sales Qualified Leads (SQL) is established at exactly 70 points out of 100. When an inbound lead achieves a composite score of 70 or higher (e.g., 40 demographic points + 35 behavioral points = 75 points), the CRM triggers an automated status transition: the prospect is designated as an SQL and immediately handed over to sales for sub-15-minute outreach. In contrast, leads scoring below 70 remain in automated marketing nurture streams, preventing sales rep capacity from being diluted by premature outreach.",
                "Furthermore, modern lead scoring engines incorporate negative score decay. Digital behavioral intent is perishable: a prospect who visited the pricing page thirty days ago without returning exhibits decaying interest. To reflect this reality, behavioral points decay exponentially by 15% every seven days of dormancy. If a prospect stops interacting with marketing assets, their score drops below the 70-point threshold, automatically pausing sales escalation. This dynamic decay ensures that Account Executives only spend time on accounts exhibiting active, current buying momentum.",
                "In this first part, we engineer a Two-Tier Composite Lead Scoring Engine in Python. We will model firmographic ICP rules, calculate behavioral action weights with recency multipliers, evaluate composite thresholds, and classify inbound leads into immediate sales handover or marketing nurture streams."
            ],
            "example": "A B2B cloud security startup was overwhelming its 12 SDRs with 4,000 monthly form submissions, resulting in a sluggish 36-hour average response time. Implementing a two-tier scoring engine with a 70-point SQL threshold filtered out 3,100 unqualified leads and directed SDR focus to the 900 high-intent prospects, doubling demo booking rates from 4.2% to 11.8% in 60 days.",
            "code": """# Automated Two-Tier Lead Scoring Engine: Demographic Fit + Behavioral Intent
from typing import Dict, Any, List

def score_inbound_lead_composite(
    firmographic: Dict[str, Any],
    behavioral_events: List[Dict[str, Any]],
    sql_threshold: int = 70
) -> Dict[str, Any]:
    # --- 1. Tier 1: Demographic / Firmographic Score (Max 50 pts) ---
    demo_score = 0
    
    # Title / Seniority Persona
    title = str(firmographic.get("title", "")).lower()
    if any(t in title for t in ["c-level", "chief", "vp", "vice president", "head of"]):
        demo_score += 25
    elif any(t in title for t in ["director", "principal", "lead"]):
        demo_score += 15
    elif any(t in title for t in ["manager"]):
        demo_score += 8
    else:
        demo_score += 2
        
    # Employee Count Tier
    employees = firmographic.get("employee_count", 0)
    if employees >= 500:
        demo_score += 15
    elif employees >= 100:
        demo_score += 10
    elif employees >= 20:
        demo_score += 5
    else:
        demo_score += 2
        
    # Target Industry Alignment
    industry = str(firmographic.get("industry", "")).lower()
    if any(ind in industry for ind in ["saas", "software", "fintech", "cybersecurity"]):
        demo_score += 10
    elif any(ind in industry for ind in ["finance", "healthcare", "logistics"]):
        demo_score += 6
    else:
        demo_score += 2
        
    demo_score = min(demo_score, 50)
    
    # --- 2. Tier 2: Behavioral Intent Score (Max 50 pts) ---
    behav_score = 0
    EVENT_POINTS = {
        "pricing_page_view": 20,
        "demo_request": 25,
        "webinar_attendance": 15,
        "whitepaper_download": 10,
        "blog_post_read": 3,
        "newsletter_open": 2
    }
    
    for ev in behavioral_events:
        name = ev.get("event_name", "")
        count = ev.get("count", 1)
        pts_per_action = EVENT_POINTS.get(name, 0)
        behav_score += pts_per_action * count
        
    behav_score = min(behav_score, 50)
    
    # --- 3. Composite Score Calculation & SQL Gating ---
    composite_score = demo_score + behav_score
    is_sql = composite_score >= sql_threshold
    
    if is_sql:
        lifecycle_stage = "SALES_QUALIFIED_LEAD_IMMEDIATE_ROUTING"
        routing_action = "DISPATCH_TO_ROUND_ROBIN_SALES_REP"
    elif composite_score >= 45:
        lifecycle_stage = "MARKETING_QUALIFIED_LEAD_EXPEDITED_NURTURE"
        routing_action = "ENROLL_IN_PRODUCT_WARM_CADENCE"
    else:
        lifecycle_stage = "UNQUALIFIED_LEAD_COLD_NURTURE"
        routing_action = "ENROLL_IN_MONTHLY_NEWSLETTER"
        
    return {
        "demographic_score": demo_score,
        "behavioral_score": behav_score,
        "composite_score": composite_score,
        "sql_threshold": sql_threshold,
        "is_sql": is_sql,
        "lifecycle_stage": lifecycle_stage,
        "routing_action": routing_action
    }

# Benchmark Scoring Test
lead_high_intent = {
    "firmographic": {"title": "VP of Engineering", "employee_count": 650, "industry": "FinTech SaaS"},
    "behavioral": [
        {"event_name": "pricing_page_view", "count": 1},
        {"event_name": "webinar_attendance", "count": 1}
    ]
}

lead_low_intent = {
    "firmographic": {"title": "Junior Developer", "employee_count": 15, "industry": "Retail"},
    "behavioral": [
        {"event_name": "blog_post_read", "count": 2},
        {"event_name": "newsletter_open", "count": 1}
    ]
}

res_high = score_inbound_lead_composite(lead_high_intent["firmographic"], lead_high_intent["behavioral"])
res_low = score_inbound_lead_composite(lead_low_intent["firmographic"], lead_low_intent["behavioral"])

print(f"Lead 1: Score {res_high['composite_score']} (Demo {res_high['demographic_score']} + Behav {res_high['behavioral_score']}) -> {res_high['lifecycle_stage']}")
print(f"Lead 2: Score {res_low['composite_score']} (Demo {res_low['demographic_score']} + Behav {res_low['behavioral_score']}) -> {res_low['lifecycle_stage']}")
""",
            "output": """Lead 1: Score 85 (Demo 50 + Behav 35) -> SALES_QUALIFIED_LEAD_IMMEDIATE_ROUTING
Lead 2: Score 14 (Demo 6 + Behav 8) -> UNQUALIFIED_LEAD_COLD_NURTURE""",
            "codeNotes": [
                "Lines 8-36: Evaluates Tier 1 Demographic Fit across title persona, headcount band, and vertical industry up to 50 pts max.",
                "Lines 38-53: Evaluates Tier 2 Behavioral Intent by mapping specific digital body language actions to weighted points.",
                "Lines 55-68: Computes composite score against the 70-point threshold, categorizing leads into SQL, MQL, or cold nurture.",
                "Lines 70-80: Returns structured JSON response detailing demographic, behavioral, and routing actions."
            ],
            "tryIt": "Modify lead_low_intent by adding a 'demo_request' event and changing title to 'Director of DevOps'. Re-run to see it clear the 70-point SQL threshold.",
            "check": {
                "question": "What operational transition is triggered when an inbound enterprise prospect achieves a composite lead score of 75 points against a 70-point threshold?",
                "options": [
                    "The lead is archived into cold storage to conserve CRM database storage",
                    "The lead is classified as an SQL and immediately routed to an active sales rep for sub-15-minute qualification",
                    "The prospect is sent an automated invoice for enterprise licensing",
                    "The lead's company domain is permanently blocked from visiting the marketing website"
                ],
                "answer": 1,
                "why": "A score of 75 clears the 70-point SQL threshold, triggering immediate classification as a Sales Qualified Lead and automated dispatch to sales reps for rapid engagement.",
                "answerIndex": 1,
                "explanation": "A score of 75 clears the 70-point SQL threshold, triggering immediate classification as a Sales Qualified Lead and automated dispatch to sales reps for rapid engagement."
            }
        },

        # Part 2: Round-Robin Territory Routing & Capacity Load Balancing
        {
            "title": "Round-Robin Territory Routing & Fair Capacity Load Balancing",
            "say": [
                "Once an inbound lead is certified as a Sales Qualified Lead (SQL), the RevOps routing engine must instantly assign the prospect to the optimal commercial representative. In rudimentary sales organizations, lead assignment is handled manually by an SDR manager or sales coordinator who reads incoming emails and manually assigns leads based on intuition or favoritism. This manual bottleneck creates intolerable delays—often leaving hot leads unassigned for hours or days—while introducing severe bias where preferred reps receive prime enterprise accounts while struggling reps receive poor-quality leads.",
                "To establish automated speed, absolute operational fairness, and optimized rep productivity, enterprise revenue operations implement Automated Round-Robin Territory Routing. At its mathematical core, round-robin distribution cycles sequentially through an ordered roster of qualified sales reps using modular arithmetic: assigned_rep = rep_roster[current_pointer % len(rep_roster)]. When an inbound lead arrives, the system allocates the record to the representative at the current index pointer and increments the pointer by one for the next incoming lead, ensuring an egalitarian 1-to-1 distribution across the team.",
                "However, naive round-robin algorithms quickly malfunction in real-world commercial environments because they fail to account for operational edge cases. First: Out-of-Office (OOO) and Working Hours Status. If an inbound enterprise lead arrives at 2:00 PM on a Tuesday and the next round-robin rep is on sick leave or vacation, assigning the lead to that dormant rep guarantees a catastrophic SLA breach. Advanced routing engines continuously query HRIS calendar APIs (such as BambooHR or Google Calendar) to verify rep active availability, automatically skipping unavailable reps in the round-robin sequence.",
                "Second: Territory and Vertical Alignment. In enterprise B2B sales, reps are specialized by geography (e.g., North America East vs West, EMEA, APAC), company size (Mid-Market vs Enterprise), or vertical expertise (Healthcare vs Financial Services). High-performing routing architectures evaluate a multi-tiered Routing Topology: the engine first filters the global sales force into a qualified territory pool matching the prospect's geographic domain and employee headcount, and then executes round-robin load balancing exclusively across the members of that specialized pod.",
                "Third: Active Capacity Ceilings. Sales representatives have finite cognitive bandwidth. If Rep A is currently managing 48 active, unclosed discovery deals while Rep B is only managing 12, routing additional leads to Rep A will cause response times to degrade and deal velocity to stall. Modern RevOps routing algorithms implement Dynamic Capacity Load Balancing: each rep is assigned a maximum concurrent active lead threshold (e.g., 30 active working leads). If a rep reaches their capacity ceiling, the engine bypasses them in the rotation until they close or disqualify existing pipeline.",
                "In addition, sophisticated revenue operations platforms incorporate performance-weighted round-robin distribution. While junior SDRs in their 90-day onboarding ramp might carry a routing weight of 0.5 (receiving one lead for every two assigned to seasoned reps), senior elite performers with proven conversion records receive a weight of 1.5. This weighted distribution maximizes expected pipeline conversion without overwhelming ramped reps.",
                "Furthermore, modern routing engines support automated lead re-routing upon non-acceptance. If an assigned sales representative does not actively accept the routed lead within three minutes of assignment—either due to an unscheduled phone call or an urgent customer issue—the engine automatically returns the lead to the head of the round-robin queue and dispatches it to the next available representative. This 'active acknowledgment' guardrail prevents leads from languishing in assigned inboxes while reps are temporarily distracted.",
                "Finally, enterprise routing platforms maintain an immutable distribution ledger. By logging every routing transaction—including timestamp, lead score, assigned territory, bypassed reps, and routing rationale—RevOps leadership can audit distribution equity, proving to commercial executives that leads are allocated with absolute impartiality and algorithmic rigor.",
                "In this second part, we construct a Capacity-Aware Round-Robin Territory Routing Engine. This Python module filters sales reps by territory match, verifies active availability status, inspects open pipeline capacity against workload ceilings, and executes fair sequential distribution."
            ],
            "example": "A SaaS scale-up with 24 SDRs had a 38% variance in pipeline generation across reps, causing high turnover and accusations of managerial favoritism. Deploying an automated round-robin routing engine with OOO skipping and capacity caps equalized lead flow across reps, reducing pipeline variance to under 4% and improving overall quota attainment from 58% to 84%.",
            "code": """# Round-Robin Territory Routing & Capacity Load Balancing Engine
from typing import Dict, Any, List, Optional

def route_lead_round_robin_with_capacity(
    lead: Dict[str, Any],
    rep_roster: List[Dict[str, Any]],
    current_pointer: int,
    max_active_capacity: int = 30
) -> Dict[str, Any]:
    # 1. Filter reps matching lead territory
    lead_territory = lead.get("territory", "GLOBAL")
    eligible_reps = [
        r for r in rep_roster
        if r.get("territory") == lead_territory or r.get("territory") == "GLOBAL"
    ]
    
    if not eligible_reps:
        return {
            "routed": False,
            "assigned_rep": None,
            "next_pointer": current_pointer,
            "status": "UNROUTED_NO_ELIGIBLE_TERRITORY_REPS",
            "reason": f"No active reps configured for territory: {lead_territory}"
        }
        
    # 2. Iterate through roster using modular round-robin to find available, under-capacity rep
    num_reps = len(eligible_reps)
    for attempt in range(num_reps):
        candidate_idx = (current_pointer + attempt) % num_reps
        rep = eligible_reps[candidate_idx]
        
        # Check Availability Status (OOO filter)
        if not rep.get("is_active", True) or rep.get("is_ooo", False):
            continue
            
        # Check Capacity Ceiling
        current_load = rep.get("active_leads_count", 0)
        if current_load >= max_active_capacity:
            continue
            
        # Found available qualified rep!
        next_ptr = (candidate_idx + 1) % num_reps
        return {
            "routed": True,
            "lead_id": lead.get("lead_id"),
            "assigned_rep_id": rep["rep_id"],
            "assigned_rep_name": rep["name"],
            "territory": lead_territory,
            "rep_load_before": current_load,
            "rep_load_after": current_load + 1,
            "current_pointer_used": candidate_idx,
            "next_pointer": next_ptr,
            "status": "LEAD_ROUTED_ROUND_ROBIN_NOMINAL"
        }
        
    return {
        "routed": False,
        "assigned_rep": None,
        "next_pointer": current_pointer,
        "status": "ALL_TERRITORY_REPS_AT_MAX_CAPACITY_OR_OOO",
        "reason": f"All {num_reps} reps in {lead_territory} are either at capacity (>={max_active_capacity}) or OOO."
    }

# Benchmark Routing Test
sales_team = [
    {"rep_id": "REP-01", "name": "Sarah Jenkins", "territory": "NORTH_AMERICA", "is_active": True, "is_ooo": False, "active_leads_count": 28},
    {"rep_id": "REP-02", "name": "David Chen", "territory": "NORTH_AMERICA", "is_active": True, "is_ooo": True, "active_leads_count": 12},  # OOO!
    {"rep_id": "REP-03", "name": "Elena Rostova", "territory": "NORTH_AMERICA", "is_active": True, "is_ooo": False, "active_leads_count": 30}   # At Cap (30)!
]

incoming_lead = {"lead_id": "LD-9901", "company": "Stripe", "territory": "NORTH_AMERICA"}

# Execute routing starting at pointer 0
route_res1 = route_lead_round_robin_with_capacity(incoming_lead, sales_team, current_pointer=0, max_active_capacity=30)
print(f"Lead 1 Routed: {route_res1['routed']} -> Assigned to: {route_res1.get('assigned_rep_name')} (Next Pointer: {route_res1['next_pointer']})")

# Now Sarah has 29 leads. Let's route another lead. Next pointer is 1.
sales_team[0]["active_leads_count"] = 29
incoming_lead_2 = {"lead_id": "LD-9902", "company": "Databricks", "territory": "NORTH_AMERICA"}

route_res2 = route_lead_round_robin_with_capacity(incoming_lead_2, sales_team, current_pointer=1, max_active_capacity=30)
print(f"Lead 2 Routed: {route_res2['routed']} -> Assigned to: {route_res2.get('assigned_rep_name')} (Next Pointer: {route_res2['next_pointer']})")
""",
            "output": """Lead 1 Routed: True -> Assigned to: Sarah Jenkins (Next Pointer: 1)
Lead 2 Routed: True -> Assigned to: Sarah Jenkins (Next Pointer: 1)""",
            "codeNotes": [
                "Lines 7-15: Filters the global sales roster to isolate reps possessing territory eligibility for the incoming account.",
                "Lines 22-38: Evaluates candidates sequentially using modular index offset, checking both OOO status and active lead capacity.",
                "Lines 40-52: Updates the routing pointer and returns full allocation telemetry on successful match.",
                "Lines 54-61: Emits an operational warning if all territory reps are unavailable or saturated at maximum capacity."
            ],
            "tryIt": "Set David Chen's is_ooo to False and re-run to confirm that Lead 2 is correctly routed to David at index 1.",
            "check": {
                "question": "Why is it vital for enterprise RevOps routing engines to incorporate active capacity ceilings alongside round-robin rotation?",
                "options": [
                    "To prevent top reps from receiving higher commissions than lower-performing peers",
                    "To prevent sales reps from becoming cognitively saturated with open leads, ensuring rapid response times and preventing deal neglect",
                    "Because CRM databases cannot store more than 30 records per sales user",
                    "To force prospects to speak with multiple sales reps before receiving a quote"
                ],
                "answer": 1,
                "why": "Capacity ceilings protect reps from becoming overwhelmed with open leads, ensuring every qualified prospect receives focused attention within strict SLA windows.",
                "answerIndex": 1,
                "explanation": "Capacity ceilings protect reps from becoming overwhelmed with open leads, ensuring every qualified prospect receives focused attention within strict SLA windows."
            }
        },

        # Part 3: The 15-Minute Inbound Speed-to-Lead SLA & Multi-Tier Escalation Workflows
        {
            "title": "The 15-Minute Inbound Speed-to-Lead SLA & Multi-Tier Escalation Workflows",
            "say": [
                "In commercial sales operations, time is the ultimate deal killer. While sales leaders invest millions in top-of-funnel marketing campaigns to attract qualified buyers, the economic return on that marketing investment is predominantly decided within the first fifteen minutes of form submission. Pioneering empirical research by InsideSales.com and Harvard Business Review reveals that contacting an inbound lead within five minutes yields a 21x higher qualification rate compared to waiting 30 minutes, and a 100x higher conversion advantage compared to waiting 24 hours.",
                "The psychological and behavioral physics of speed-to-lead are straightforward: when an enterprise VP or Director submits a demo request, they are actively sitting at their computer, experiencing acute pain, thinking about the problem, and comparing vendors. If a sales representative calls or emails within 5 to 15 minutes, the prospect is reachable and enthusiastic. If the company delays for several hours or the next business day, the executive has moved on to other meetings, forgotten the submission, or already booked a discovery call with a faster competitor.",
                "To enforce sub-15-minute response discipline, RevOps architects construct automated Multi-Tier SLA Escalation Engines. These systems act as real-time watchdogs that track elapsed time from initial lead creation until the first verified outbound contact event (such as a logged phone call, personalized email, or LinkedIn touchpoint). If a lead sits in a sales rep's queue untouched, the engine triggers an automated escalation ladder.",
                "Escalation Tier 1: Warning Alert (Elapsed Time: 5 Minutes). If a high-priority SQL remains untouched after five minutes, the CRM triggers automated webhooks into the rep's internal communication channel. A high-priority Slack notification and mobile CRM push alert ping the assigned SDR: 'High-Intent Inbound Lead [Acme Corp - $100k ARR] untouched for 5 minutes. SLA breach in 10 minutes.'",
                "Escalation Tier 2: Manager Escalation (Elapsed Time: 10 Minutes). If the lead remains untouched after ten minutes, the escalation ladder intensifies. The engine dispatches an SMS alert directly to the rep's mobile phone and copies the front-line SDR Manager on an urgent Slack alert, signaling that an active inbound opportunity is at imminent risk of expiration.",
                "Escalation Tier 3: SLA Breach & Automated Reallocation (Elapsed Time: 15 Minutes). At exactly the fifteen-minute mark, the SLA is formally breached. The engine automatically revokes lead ownership from the unresponsive rep, logs an 'SLA_BREACH_PENALTY' in the rep's performance record, and re-routes the lead immediately to the next available 'on-deck' sales rep in the round-robin queue. This automated penalty mechanism ensures that inbound buyers are never left stranded by an unresponsive representative.",
                "Furthermore, executive dashboards track the team-wide Inbound SLA Compliance Rate: Compliance % = (Leads Contacted < 15 min / Total Inbound SQLs) * 100%. High-performing RevOps organizations maintain a mandatory compliance benchmark of 90.0% or higher. Reps with recurring SLA breaches are temporarily removed from the inbound round-robin distribution queue until they complete speed-to-lead remediation training.",
                "Additionally, multi-channel failover logic reinforces the SLA engine. If an initial phone call attempt goes straight to voicemail after 3 minutes, the system immediately prompts an automated SMS follow-up or customized video introduction (via Loom or Vidyard) to maximize contact odds during the critical active session window.",
                "Moreover, automated dialer telemetry integrates directly with the SLA watchdog. When an SDR initiates an outbound dial within the CRM, the telephony platform logs ring duration, voicemail drops, and call disposition codes in real time. If an SDR logs a 'busy' signal or no-answer, the engine automatically schedules three algorithmic re-dial attempts spaced across the subsequent 48 hours, ensuring persistent multi-touch pursuit without manual rep memory.",
                "In this third part, we program a 15-Minute Speed-to-Lead SLA Monitoring & Escalation Engine. This Python module monitors uncontacted lead queues in real time, evaluates elapsed minutes against tiered escalation thresholds, dispatches automated alerts, and reassigns breached leads to backup representatives."
            ],
            "example": "A B2B infrastructure SaaS company reduced its median inbound response time from 140 minutes to 8.5 minutes by implementing a 15-minute automated escalation and re-routing ladder. The rapid response speed increased their inbound demo-held conversion rate by 180%, generating an incremental $4.2M in annual pipeline from existing marketing traffic.",
            "code": """# The 15-Minute Inbound Speed-to-Lead SLA & Multi-Tier Escalation Engine
from typing import Dict, Any, List

def monitor_speed_to_lead_sla_and_escalate(
    leads_queue: List[Dict[str, Any]],
    current_time_minutes: int,
    backup_reps: List[str]
) -> Dict[str, Any]:
    tier1_warnings = []
    tier2_manager_alerts = []
    tier3_breached_reassignments = []
    compliant_leads = []
    
    backup_ptr = 0
    
    for lead in leads_queue:
        created_at = lead.get("created_at_minutes", 0)
        contacted_at = lead.get("contacted_at_minutes")
        elapsed = current_time_minutes - created_at if contacted_at is None else (contacted_at - created_at)
        
        is_contacted = contacted_at is not None
        
        lead_status = {
            "lead_id": lead["lead_id"],
            "assigned_rep": lead["assigned_rep"],
            "elapsed_minutes": elapsed,
            "is_contacted": is_contacted
        }
        
        if is_contacted:
            if elapsed <= 15:
                lead_status["sla_status"] = "COMPLIANT_WITHIN_15M_SLA"
                compliant_leads.append(lead_status)
            else:
                lead_status["sla_status"] = "HISTORICAL_SLA_BREACH_RESOLVED"
                compliant_leads.append(lead_status)
            continue
            
        # Lead is UNTOUCHED: Evaluate live escalation tiers
        if elapsed < 5:
            lead_status["sla_status"] = "SLA_NOMINAL_UNDER_5M"
            compliant_leads.append(lead_status)
        elif elapsed < 10:
            lead_status["sla_status"] = "TIER_1_WARNING_5M_UNTOUCHED"
            lead_status["action"] = "DISPATCH_SLACK_REMINDER_TO_REP"
            tier1_warnings.append(lead_status)
        elif elapsed <= 15:
            lead_status["sla_status"] = "TIER_2_URGENT_10M_MANAGER_ALERT"
            lead_status["action"] = "DISPATCH_SMS_AND_NOTIFY_SDR_MANAGER"
            tier2_manager_alerts.append(lead_status)
        else:
            # Breached > 15 minutes! Reassign to backup rep
            new_rep = backup_reps[backup_ptr % len(backup_reps)] if backup_reps else "UNASSIGNED_QUEUE"
            backup_ptr += 1
            lead_status["sla_status"] = "TIER_3_BREACH_REASSIGNED"
            lead_status["action"] = f"REVOKE_OWNERSHIP_AND_REASSIGN_TO_{new_rep}"
            lead_status["reassigned_to"] = new_rep
            tier3_breached_reassignments.append(lead_status)
            
    total_leads = len(leads_queue)
    breached_count = len(tier3_breached_reassignments)
    compliance_rate = round(((total_leads - breached_count) / total_leads) * 100.0, 2) if total_leads > 0 else 100.0
    
    return {
        "total_monitored_leads": total_leads,
        "sla_compliance_rate_pct": compliance_rate,
        "tier1_warnings_count": len(tier1_warnings),
        "tier2_manager_alerts_count": len(tier2_manager_alerts),
        "tier3_breached_count": breached_count,
        "tier1_warnings": tier1_warnings,
        "tier2_alerts": tier2_manager_alerts,
        "tier3_reassignments": tier3_breached_reassignments,
        "sla_rating": "OPTIMAL_SPEED_TO_LEAD" if compliance_rate >= 90.0 else "SLA_COMPLIANCE_DEFICIT"
    }

# Benchmark SLA Escalation Test
current_time = 30  # Simulation at T=30 minutes
leads_state = [
    {"lead_id": "LD-101", "assigned_rep": "Alice", "created_at_minutes": 27, "contacted_at_minutes": None}, # Elapsed: 3m (Nominal)
    {"lead_id": "LD-102", "assigned_rep": "Bob", "created_at_minutes": 23, "contacted_at_minutes": None},   # Elapsed: 7m (Tier 1 Warning)
    {"lead_id": "LD-103", "assigned_rep": "Charlie", "created_at_minutes": 18, "contacted_at_minutes": None},# Elapsed: 12m (Tier 2 Alert)
    {"lead_id": "LD-104", "assigned_rep": "David", "created_at_minutes": 10, "contacted_at_minutes": None}  # Elapsed: 20m (Tier 3 BREACH!)
]
backups = ["Elena", "Fiona"]

sla_res = monitor_speed_to_lead_sla_and_escalate(leads_state, current_time, backups)
print(f"SLA Compliance Rate: {sla_res['sla_compliance_rate_pct']}% | Rating: {sla_res['sla_rating']}")
print(f"Tier 1 (5m Warning): {sla_res['tier1_warnings_count']} | Tier 2 (10m Alert): {sla_res['tier2_manager_alerts_count']} | Tier 3 (Breach): {sla_res['tier3_breached_count']}")
for b in sla_res['tier3_reassignments']:
    print(f"  Breached Lead {b['lead_id']} originally assigned to {b['assigned_rep']} -> {b['action']}")
""",
            "output": """SLA Compliance Rate: 75.0% | Rating: SLA_COMPLIANCE_DEFICIT
Tier 1 (5m Warning): 1 | Tier 2 (10m Alert): 1 | Tier 3 (Breach): 1
  Breached Lead LD-104 originally assigned to David -> REVOKE_OWNERSHIP_AND_REASSIGN_TO_Elena""",
            "codeNotes": [
                "Lines 13-17: Computes elapsed minutes between lead creation and current simulation time for untouched records.",
                "Lines 32-51: Implements a 3-tier escalation ladder: 5m rep reminder, 10m manager SMS alert, and 15m automated revocation.",
                "Lines 45-51: Reassigns breached leads to designated on-deck backup reps, preventing leads from remaining neglected.",
                "Lines 53-56: Computes team-wide SLA compliance percentage against the 90.0% operational benchmark."
            ],
            "tryIt": "Update LD-104 contacted_at_minutes to 22 (contacted within 12 min). Re-run to verify compliance rate reaches 100.0%.",
            "check": {
                "question": "What operational action is executed by the speed-to-lead escalation engine when an inbound SQL remains completely untouched by the assigned sales rep after 15 minutes?",
                "options": [
                    "The lead is deleted from the CRM to prevent embarrassing the sales representative",
                    "The rep's computer is automatically locked for the remainder of the business day",
                    "Lead ownership is revoked from the unresponsive rep and automatically reassigned to an available backup rep to safeguard conversion",
                    "The customer is charged a late fee for submitting a form outside regular business hours"
                ],
                "answer": 2,
                "why": "At the 15-minute breach threshold, the engine revokes ownership and immediately reassigns the lead to an active backup representative to ensure rapid customer contact.",
                "answerIndex": 2,
                "explanation": "At the 15-minute breach threshold, the engine revokes ownership and immediately reassigns the lead to an active backup representative to ensure rapid customer contact."
            }
        },

        # Part 4: Trigger-Based Workflow Automation & Bi-Directional Webhooks
        {
            "title": "Trigger-Based Workflow Automation & Bi-Directional Webhooks",
            "say": [
                "While lead scoring and routing govern top-of-funnel velocity, post-routing revenue execution depends on event-driven workflow automation. In legacy sales environments, manual administrative friction throttles commercial productivity: when an Account Executive closes a deal, they spend three hours manually copying contract details into an onboarding spreadsheet, emailing the legal department, alerting customer support, and creating accounting invoices in the billing system. This manual busywork wastes 20% to 30% of rep selling time while introducing high human error rates.",
                "To eliminate administrative overhead and bridge the operational gap between Sales, Customer Success, and Finance, modern Revenue Operations architectures deploy Event-Driven Trigger Automation powered by webhooks. In modern CRM engineering, every major state mutation—such as an Opportunity advancing to 'Closed-Won', a customer logging their first support ticket, or a contract signing event via DocuSign—emits an asynchronous event payload.",
                "The core architectural pattern is the Database Trigger & Webhook Dispatch Bus. When an Opportunity transitions to Stage == 'Closed-Won', the CRM trigger interceptor automatically packages an immutable JSON payload containing the Account ID, contracted Annual Recurring Revenue, billing terms, license seat quantity, and primary customer champion contacts. The dispatch engine then broadcasts this payload to registered webhook listener endpoints across the go-to-market software ecosystem.",
                "Consider the multi-system cascade triggered by a single 'Closed-Won' event. First: Customer Success Orchestration. The webhook calls the Customer Success Platform API (e.g., Gainsight, ChurnZero, or Asana), automatically creating a standardized 90-day Customer Onboarding Project, pre-populating milestone dates, and assigning the account to a designated Customer Success Manager. Second: Commercial Slack Broadcast. The webhook dispatches a rich message to the corporate #sales-wins Slack channel, celebrating the closing rep and sharing critical deal intelligence with the company.",
                "Third: Financial ERP & Billing Provisioning. The webhook calls the ERP API (e.g., NetSuite or Stripe Billing), generating an official corporate customer account, issuing the initial annual subscription invoice, and setting up automated recurring billing schedules. Fourth: Application License Provisioning. A secure microservice ingests the contract attributes and provisions the customer's dedicated multi-tenant software instance with the exact number of purchased user seats and enterprise security features.",
                "Crucially, enterprise webhook architectures must implement Idempotency and Exponential Backoff Retries. If the downstream billing API experiences temporary network downtime during contract signing, the CRM webhook dispatcher must not fail silently or generate duplicate invoices upon retry. By embedding unique cryptographic Idempotency Keys (e.g., UUIDv4 or deal-hash signatures) into every event header, receiving systems can safely retry failed deliveries without risk of duplicate financial transactions.",
                "Furthermore, RevOps platforms govern automated task creation throughout the deal lifecycle. When a lead transitions to 'Working', the CRM automatically generates follow-up tasks with strict due dates; when an opportunity idles for 14 days without customer contact, the system alerts the sales manager. This task automation creates an accountable, self-healing revenue machine.",
                "In addition, bi-directional webhook synchronization maintains contract truth between CRM and ERP systems. When finance marks an invoice as 'Paid' in NetSuite or Stripe, an inbound webhook immediately updates the CRM Account object, refreshing the customer's payment health status and unlocking advanced support tiers in customer portals without human latency.",
                "Finally, error monitoring and dead-letter queues safeguard webhook reliability. In the event of downstream API rate limiting or temporary infrastructure failures, unacknowledged webhooks are queued in persistent storage. Automated exponential backoff algorithms retry transmission at increasing intervals (1s, 2s, 4s, 8s, up to 1 hour), ensuring zero revenue transactions are dropped during system maintenance windows.",
                "In this fourth part, we build an Event-Driven CRM Workflow Automation & Webhook Dispatcher in Python. We will model state change triggers, construct standardized JSON payloads, implement idempotency verification, and orchestrate automated downstream task creation across Customer Success, Finance, and Provisioning."
            ],
            "example": "An enterprise HR SaaS company suffered from an average 14-day delay between sales contract closing and technical account provisioning because handoffs relied on manual email notifications. Engineering automated 'Closed-Won' webhook triggers that instantly provisioned software seats and created Asana onboarding boards reduced time-to-first-value from 14 days to 45 seconds.",
            "code": """# Trigger-Based Workflow Automation & Bi-Directional Webhooks Engine
from typing import Dict, Any, List
import hashlib
import time

def process_crm_event_triggers_and_webhooks(
    event_payload: Dict[str, Any],
    registered_webhooks: List[Dict[str, Any]],
    processed_idempotency_keys: set
) -> Dict[str, Any]:
    # 1. Generate Idempotency Key from payload attributes to guarantee at-most-once delivery
    deal_id = event_payload.get("deal_id", "UNKNOWN")
    stage = event_payload.get("stage", "UNKNOWN")
    raw_key_material = f"{deal_id}:{stage}:{event_payload.get('arr_value', 0)}"
    idempotency_key = hashlib.sha256(raw_key_material.encode()).hexdigest()
    
    # 2. Prevent duplicate execution via Idempotency Cache
    if idempotency_key in processed_idempotency_keys:
        return {
            "status": "IDEMPOTENT_TRANSACTION_ALREADY_PROCESSED_SKIPPED",
            "idempotency_key": idempotency_key,
            "dispatched_count": 0,
            "actions_executed": []
        }
        
    processed_idempotency_keys.add(idempotency_key)
    
    # 3. Process Event Triggers based on stage transition
    dispatched_actions = []
    
    if stage == "CLOSED_WON":
        # Multi-system downstream cascade
        for hook in registered_webhooks:
            subsystem = hook.get("subsystem", "")
            endpoint = hook.get("endpoint_url", "")
            
            if subsystem == "CUSTOMER_SUCCESS_ONBOARDING":
                action = {
                    "subsystem": subsystem,
                    "target_endpoint": endpoint,
                    "payload_sent": {
                        "account_id": event_payload.get("account_id"),
                        "arr_value": event_payload.get("arr_value"),
                        "task": "CREATE_90D_ONBOARDING_PROJECT",
                        "assigned_csm": "CSM_AUTO_ROUTER"
                    },
                    "delivery_status": "DELIVERED_HTTP_201_CREATED"
                }
                dispatched_actions.append(action)
                
            elif subsystem == "FINANCE_ERP_BILLING":
                action = {
                    "subsystem": subsystem,
                    "target_endpoint": endpoint,
                    "payload_sent": {
                        "account_id": event_payload.get("account_id"),
                        "invoice_amount": event_payload.get("arr_value"),
                        "payment_terms": "NET_30_ANNUAL_PREPAID",
                        "action": "GENERATE_OFFICIAL_TAX_INVOICE"
                    },
                    "delivery_status": "DELIVERED_HTTP_200_OK"
                }
                dispatched_actions.append(action)
                
            elif subsystem == "SLACK_WINS_BROADCAST":
                action = {
                    "subsystem": subsystem,
                    "target_endpoint": endpoint,
                    "message": f"🎉 Deal Won: {event_payload.get('company')} | ARR: ${event_payload.get('arr_value'):,.2f} by {event_payload.get('rep_name')}!",
                    "delivery_status": "DELIVERED_HTTP_200_OK"
                }
                dispatched_actions.append(action)
                
    else:
        # Standard lateral stage transition tasks
        dispatched_actions.append({
            "subsystem": "SALES_OPERATIONS_CADENCE",
            "action": f"LOG_STAGE_PROGRESSION_TO_{stage}",
            "delivery_status": "LOGGED_LOCAL"
        })
        
    return {
        "status": "EVENT_TRIGGERS_PROCESSED_NOMINAL",
        "idempotency_key": idempotency_key,
        "dispatched_count": len(dispatched_actions),
        "actions_executed": dispatched_actions
    }

# Benchmark Webhook Dispatch Test
registered_listeners = [
    {"subsystem": "CUSTOMER_SUCCESS_ONBOARDING", "endpoint_url": "https://api.gainsight.com/v1/projects"},
    {"subsystem": "FINANCE_ERP_BILLING", "endpoint_url": "https://api.netsuite.com/v2/invoices"},
    {"subsystem": "SLACK_WINS_BROADCAST", "endpoint_url": "https://hooks.slack.com/services/T01/B02/WIN"}
]

closed_won_event = {
    "deal_id": "DEAL-8899",
    "account_id": "ACC-501",
    "company": "Snowflake Inc",
    "arr_value": 150000.0,
    "stage": "CLOSED_WON",
    "rep_name": "Sarah Jenkins"
}

idempotency_cache = set()

# First execution: Event fires and broadcasts
res_first = process_crm_event_triggers_and_webhooks(closed_won_event, registered_listeners, idempotency_cache)
print(f"First Execution: {res_first['status']} | Dispatched: {res_first['dispatched_count']} Actions")
for act in res_first['actions_executed']:
    print(f"  -> [{act['subsystem']}] Status: {act['delivery_status']}")

# Duplicate execution (e.g. network retry): Safely ignored via idempotency
res_second = process_crm_event_triggers_and_webhooks(closed_won_event, registered_listeners, idempotency_cache)
print(f"\nSecond Execution: {res_second['status']} | Dispatched: {res_second['dispatched_count']}")
""",
            "output": """First Execution: EVENT_TRIGGERS_PROCESSED_NOMINAL | Dispatched: 3 Actions
  -> [CUSTOMER_SUCCESS_ONBOARDING] Status: DELIVERED_HTTP_201_CREATED
  -> [FINANCE_ERP_BILLING] Status: DELIVERED_HTTP_200_OK
  -> [SLACK_WINS_BROADCAST] Status: DELIVERED_HTTP_200_OK

Second Execution: IDEMPOTENT_TRANSACTION_ALREADY_PROCESSED_SKIPPED | Dispatched: 0""",
            "codeNotes": [
                "Lines 8-12: Computes a deterministic SHA-256 idempotency key from deal ID, stage, and revenue value to guarantee at-most-once delivery.",
                "Lines 14-20: Verifies whether the transaction key was previously processed, safely skipping duplicate webhook broadcasts.",
                "Lines 27-66: Dispatches targeted downstream payloads to Customer Success, Finance, and Slack on 'Closed-Won' transitions.",
                "Lines 68-75: Emits structured operational telemetry confirming delivery statuses across all registered endpoints."
            ],
            "tryIt": "Change arr_value to 175000.0 in closed_won_event. Re-run to verify a new idempotency key is generated and webhooks dispatch cleanly.",
            "check": {
                "question": "What is the primary architectural purpose of utilizing cryptographic idempotency keys in RevOps webhook dispatching?",
                "options": [
                    "To compress the JSON payload size so it travels faster across WiFi networks",
                    "To guarantee at-most-once execution, ensuring network retries do not generate duplicate invoices or multiple onboarding projects",
                    "To hide customer email addresses from the sales manager",
                    "To prevent sales representatives from closing deals on Friday afternoons"
                ],
                "answer": 1,
                "why": "Idempotency keys prevent duplicate processing during network retries, ensuring downstream billing systems and CS platforms execute transactions exactly once.",
                "answerIndex": 1,
                "explanation": "Idempotency keys prevent duplicate processing during network retries, ensuring downstream billing systems and CS platforms execute transactions exactly once."
            }
        },

        # Part 5: Master Workflow Automation & Routing Operations Control Tower
        {
            "title": "Master RevOps Lead Routing & Automation Operations Control Tower",
            "say": [
                "In this fifth and culminating part of Day 17, we synthesize all operational components into an integrated revenue execution platform: The Master RevOps Lead Routing & Automation Operations Control Tower. In high-velocity commercial enterprises, revenue operations is the air traffic controller of customer demand: incoming market interest must be ingested, scored, routed, monitored, and escalated with zero manual latency and total operational precision.",
                "The Master Control Tower synchronizes four foundational automation subsystems into a unified real-time pipeline. Subsystem One: Two-Tier Demographic & Behavioral Lead Scoring. The engine processes incoming form submissions, calculates firmographic ICP alignment (0-50 pts) and digital body language engagement (0-50 pts), and filters prospects against the strict 70-point SQL threshold, ensuring sales capacity is focused solely on validated high-probability pipeline.",
                "Subsystem Two: Capacity-Aware Round-Robin Territory Routing. Qualified SQLs are instantly evaluated against territory distribution topologies, rep working availability (skipping OOO reps), and active concurrent lead ceilings (capping reps at 30 active leads) to achieve equitable, balanced workload distribution across the commercial team.",
                "Subsystem Three: 15-Minute Speed-to-Lead SLA Escalation Watchdog. The engine monitors uncontacted lead queues in real time, triggering automated Slack warnings at 5 minutes, manager SMS alerts at 10 minutes, and automatic ownership revocation with backup reassignment at exactly 15 minutes, maintaining team-wide compliance above 90.0%.",
                "Subsystem Four: Event-Driven Webhook Automation Bus. Upon stage progression (such as 'Closed-Won'), the engine constructs idempotent event payloads and broadcasts asynchronous webhooks to downstream Customer Success platforms, financial billing ERPs, and company communication channels, eliminating administrative handoff delays.",
                "To evaluate organizational health, the Control Tower computes a composite Lead Velocity Health Score (0 to 100). This index synthesizes SQL Qualification Precision (25% weight), Round-Robin Distribution Equity (25% weight), Speed-to-Lead SLA Compliance (30% weight), and Webhook Automation Reliability (20% weight). Only operations achieving a score of 85.0 or higher earn the official RevOps certification.",
                "Operating a certified RevOps automation engine yields quantifiable commercial dividends: inbound qualification conversion surges by over 200%, sales rep administrative burden drops to near zero, and deal onboarding transitions occur in sub-minute timeframes. By engineering automated workflows at the infrastructure layer, revenue leaders construct an agile, frictionless growth engine capable of scaling smoothly to $100M+ in ARR.",
                "Furthermore, the Master Control Tower maintains comprehensive error-logging and dead-letter queues. In the event of downstream API rate limiting or third-party server outages, failed routing transactions and webhook deliveries are automatically persisted into an encrypted retry buffer. Automated exponential backoff algorithms re-dispatch payloads once downstream connectivity recovers, guaranteeing zero data loss across the commercial architecture.",
                "In addition, the Control Tower exposes executive telemetry that tracks territory conversion velocity by marketing channel. By correlating inbound response latency with opportunity win rates, revenue leaders can quantify the exact dollar value of sub-five-minute speed to lead, enabling evidence-based staffing decisions during major demand generation campaigns.",
                "Finally, continuous automated audit loops verify that routing rules adapt dynamically to headcount changes. When sales leadership hires new representatives or reorganizes regional boundaries, the Control Tower allows zero-downtime routing rule updates without disrupting inflight lead distribution or violating customer communication SLAs.",
                "Let us now execute the complete Master RevOps Lead Routing & Automation Control Tower in Python. We will stream simulated inbound prospects through all four subsystems, verify operational performance thresholds, and confer the official CRM_ROUTING_AND_AUTOMATION_CERTIFIED_NOMINAL credential.",
                "With our CRM database schema fortified and our automated routing and SLA escalation engines certified nominal, we possess the operational infrastructure required to scale pipeline velocity reliably. We are fully prepared to advance to Day 18, where we master Sales Enablement, Competitive Battlecards, and Depositioning Objection Matrices."
            ],
            "example": "An enterprise developer platform scaling from $15M to $60M ARR deployed the Master RevOps Routing & Automation Control Tower. In its first two quarters, the platform processed 28,000 inbound leads, routed 6,200 SQLs with a median response speed of 6.2 minutes, eliminated manual handoff errors, and drove a 48% increase in net new ARR generated per Account Executive.",
            "code": """# Master RevOps Lead Routing & Automation Operations Control Tower
from typing import Dict, Any, List

class MasterLeadRoutingAutomationEngine:
    def __init__(self, sql_threshold: int = 70, target_sla_minutes: int = 15):
        self.sql_threshold = sql_threshold
        self.target_sla = target_sla_minutes

    def execute_lead_routing_automation_suite(
        self,
        inbound_leads: List[Dict[str, Any]],
        sales_roster: List[Dict[str, Any]],
        backup_roster: List[str],
        current_time_minutes: int
    ) -> Dict[str, Any]:
        scored_sqls = []
        nurture_leads = []
        routing_assignments = []
        
        # 1. Subsystem 1: Lead Scoring
        for lead in inbound_leads:
            demo = lead.get("demo_pts", 0)
            behav = lead.get("behav_pts", 0)
            comp_score = demo + behav
            if comp_score >= self.sql_threshold:
                scored_sqls.append(lead)
            else:
                nurture_leads.append(lead)
                
        # 2. Subsystem 2: Capacity-Aware Round-Robin Routing
        rep_pointer = 0
        for sql in scored_sqls:
            # Simple round-robin with capacity check
            assigned = None
            for attempt in range(len(sales_roster)):
                cand_idx = (rep_pointer + attempt) % len(sales_roster)
                cand_rep = sales_roster[cand_idx]
                if cand_rep.get("is_active") and not cand_rep.get("is_ooo") and cand_rep.get("active_leads", 0) < 30:
                    assigned = cand_rep
                    rep_pointer = (cand_idx + 1) % len(sales_roster)
                    cand_rep["active_leads"] = cand_rep.get("active_leads", 0) + 1
                    break
                    
            if assigned:
                routing_assignments.append({
                    "lead_id": sql["lead_id"],
                    "assigned_to": assigned["name"],
                    "status": "ROUTED_SUCCESSFULLY"
                })
            else:
                routing_assignments.append({
                    "lead_id": sql["lead_id"],
                    "assigned_to": "MANUAL_HOLD_QUEUE",
                    "status": "CAPACITY_EXCEEDED"
                })
                
        # 3. Subsystem 3: Speed-to-Lead SLA Compliance Evaluation
        sla_compliant_count = sum(1 for sql in scored_sqls if sql.get("contacted_minutes", 999) <= self.target_sla)
        sla_rate = round((sla_compliant_count / len(scored_sqls)) * 100.0, 2) if scored_sqls else 100.0
        
        # 4. Composite Lead Velocity Health Score (0-100)
        # Weights: 25% SQL Precision, 25% Routing Success, 30% SLA Compliance, 20% Webhook Readiness
        routing_success_rate = round((len([r for r in routing_assignments if r["status"] == "ROUTED_SUCCESSFULLY"]) / len(scored_sqls)) * 100.0, 2) if scored_sqls else 100.0
        webhook_readiness = 98.0
        
        composite_velocity_score = round(
            (100.0 * 0.25) +
            (routing_success_rate * 0.25) +
            (sla_rate * 0.30) +
            (webhook_readiness * 0.20),
            2
        )
        
        is_certified = (composite_velocity_score >= 85.0) and (sla_rate >= 80.0)
        certification = (
            "CRM_ROUTING_AND_AUTOMATION_CERTIFIED_NOMINAL"
            if is_certified else "ROUTING_AUTOMATION_REMEDIATION_REQUIRED"
        )
        
        return {
            "total_inbound_processed": len(inbound_leads),
            "sql_count": len(scored_sqls),
            "nurture_count": len(nurture_leads),
            "routing_success_rate_pct": routing_success_rate,
            "sla_compliance_rate_pct": sla_rate,
            "composite_velocity_health_score": composite_velocity_score,
            "operational_certification": certification,
            "routing_assignments": routing_assignments
        }

# Execute Master Control Tower
incoming_stream = [
    {"lead_id": "LD-01", "demo_pts": 40, "behav_pts": 35, "contacted_minutes": 8},   # Score: 75 (SQL, Contacted in 8m)
    {"lead_id": "LD-02", "demo_pts": 45, "behav_pts": 30, "contacted_minutes": 12},  # Score: 75 (SQL, Contacted in 12m)
    {"lead_id": "LD-03", "demo_pts": 20, "behav_pts": 20, "contacted_minutes": 999}  # Score: 40 (Nurture)
]

roster = [
    {"rep_id": "R1", "name": "Sarah", "is_active": True, "is_ooo": False, "active_leads": 15},
    {"rep_id": "R2", "name": "David", "is_active": True, "is_ooo": False, "active_leads": 20}
]

engine = MasterLeadRoutingAutomationEngine(sql_threshold=70, target_sla_minutes=15)
dossier = engine.execute_lead_routing_automation_suite(incoming_stream, roster, ["Elena"], current_time_minutes=30)

print(f"Composite Velocity Health Score: {dossier['composite_velocity_health_score']} / 100.0")
print(f"Certification: {dossier['operational_certification']}")
print(f"SQLs Processed: {dossier['sql_count']} | Nurture: {dossier['nurture_count']} | SLA Compliance: {dossier['sla_compliance_rate_pct']}%")
for a in dossier['routing_assignments']:
    print(f"  {a['lead_id']} -> Assigned to: {a['assigned_to']} ({a['status']})")
""",
            "output": """Composite Velocity Health Score: 99.6 / 100.0
Certification: CRM_ROUTING_AND_AUTOMATION_CERTIFIED_NOMINAL
SQLs Processed: 2 | Nurture: 1 | SLA Compliance: 100.0%
  LD-01 -> Assigned to: Sarah (ROUTED_SUCCESSFULLY)
  LD-02 -> Assigned to: David (ROUTED_SUCCESSFULLY)""",
            "codeNotes": [
                "Lines 4-8: Initializes MasterLeadRoutingAutomationEngine with configurable SQL score and speed-to-lead SLA thresholds.",
                "Lines 16-25: Filters the incoming lead stream into Sales Qualified Leads (>= 70 pts) and marketing nurture cohorts.",
                "Lines 27-46: Executes capacity-aware round-robin routing across active sales reps, enforcing max workload ceilings.",
                "Lines 54-68: Evaluates composite velocity health score and confers CRM_ROUTING_AND_AUTOMATION_CERTIFIED_NOMINAL."
            ],
            "tryIt": "Add a third SQL with contacted_minutes=25 (exceeding 15m). Re-run to see how SLA compliance and composite health score adjust.",
            "check": {
                "question": "Which set of operational performance metrics is synthesized by the Master RevOps Routing & Automation Control Tower to confer operational certification?",
                "options": [
                    "Average lunch break duration, mouse click velocity, and office parking lot occupancy",
                    "SQL qualification precision, round-robin territory distribution equity, 15-minute speed-to-lead SLA compliance, and webhook automation reliability",
                    "Number of monitors on rep desks, total company Twitter retweets, and office heating temperature",
                    "Total vacation days requested, keyboard backlighting brightness, and email font sizing"
                ],
                "answer": 1,
                "why": "The Master RevOps Routing & Automation Control Tower synthesizes SQL qualification precision, round-robin distribution equity, 15-minute SLA compliance, and webhook automation reliability.",
                "answerIndex": 1,
                "explanation": "The Master RevOps Routing & Automation Control Tower synthesizes SQL qualification precision, round-robin distribution equity, 15-minute SLA compliance, and webhook automation reliability."
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
    data = get_day17_data()
    total_words = 0
    print(f"Auditing Day {data['day']}: {data['title']}")
    for idx, p in enumerate(data['parts']):
        words = sum(len(para.split()) for para in p['say'])
        total_words += words
        print(f"  Part {idx+1}: {words} words | {p['title'][:40]}...")
        assert words >= 580, f"Part {idx+1} word count {words} < 580"
    print(f"Total Spoken Words: {total_words} words (Benchmark: >= 2,950)")
    assert total_words >= 2950, f"Total words {total_words} < 2950"
    print("DAY 17 PASSED ALL INVARIANTS GREEN!")
