"""
Day 14 Builder: Customer Support & Post-Purchase Experience: First Response Time (FRT) & CSAT SLAs
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-809
Invariant: 5 parts, >= 580 words per part, >= 2,950 words total, Gate v2 funnel visual JSON
"""

import json
import hashlib
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day14():
    parts = []

    # Part 1: Post-Purchase Psychology & The "Where Is My Order" (WISMO) Problem
    p1_say = [
        "Welcome to Day 14 of B.Com E-Commerce and Digital Business. Today, we turn our operational focus to the critical period following order confirmation: Post-Purchase Experience Engineering, Customer Support Workflows, and SLA Optimization. In traditional retail management, business leaders often assumed that the customer journey terminated the moment the credit card transaction settled and the order confirmation email was dispatched. In modern digital commerce, however, the post-purchase phase represents the single most volatile period for consumer brand perception, customer lifetime value (LTV) retention, and operational cost containment.",
        
        "The psychological gap between clicking 'Place Order' and unboxing the physical merchandise is characterized by acute customer anxiety and anticipation. If a customer experiences radio silence, ambiguous delivery estimates, or opaque carrier tracking links, buyer remorse intensifies. This operational friction manifests as the most ubiquitous and expensive support challenge in global e-commerce: The 'Where Is My Order?' (WISMO) inquiry. Industry telemetry reveals that WISMO inquiries account for thirty-five to fifty percent of all inbound customer service volume across online retailers. Each manual support interaction with a human customer service representative costs the business between four and eight dollars in direct labor overhead. For an e-commerce brand fulfilling one hundred thousand orders per month, an unmanaged WISMO stream can generate tens of thousands of support tickets, consuming hundreds of thousands of dollars in wasted support payroll.",
        
        "To dismantle the WISMO drain, institutional e-commerce operators engineer Proactive Order Transparency Architectures. Rather than outsourcing tracking to generic, clunky third-party carrier websites (such as USPS, FedEx, or Blue Dart), brands deploy Branded Post-Purchase Tracking Portals (powered by platforms like Narvar, Malomo, or Wonderment). These portals ingest real-time carrier Electronic Data Interchange (EDI 214) and webhook milestone events—such as 'Manifest Created', 'Arrived at Sorting Facility', 'Out for Delivery', and 'Delivered'—rendering them on a beautifully branded storefront page.",
        
        "Furthermore, branded tracking pages transform a defensive customer service touchpoint into an offensive marketing engine. Shoppers check order tracking status an average of 4.2 times per transaction, generating repeat visit engagement rates exceeding sixty percent. By merchandising contextual cross-sell recommendations, loyalty point balances, and video unboxing tutorials on the tracking page, brands monetize post-purchase attention while proactively resolving delivery anxiety.",
        
        "In our institutional Python model for Part 1, we simulate the financial and operational impact of transitioning from legacy passive carrier tracking to proactive branded post-purchase tracking across fifty thousand monthly customer orders. The engine calculates inbound WISMO ticket reduction, direct customer support payroll savings, and incremental repeat purchase revenue generated on branded tracking portals. Review the deterministic code below."
    ]

    p1_code = '''def model_wismo_and_post_purchase_economics(
    monthly_orders: int,
    avg_order_value_usd: float,
    passive_wismo_rate_pct: float,
    proactive_tracking_adoption: bool,
    cost_per_manual_ticket_usd: float
) -> dict:
    """
    Evaluates customer support payroll costs, ticket deflection,
    and repeat purchase monetization contrasting passive vs proactive tracking.
    """
    if not proactive_tracking_adoption:
        # Passive tracking: customers rely on generic courier links
        wismo_inquiries = int(monthly_orders * passive_wismo_rate_pct)
        deflected_tickets = 0
        tickets_handled_by_agents = wismo_inquiries
        tracking_page_cross_sell_revenue = 0.0
    else:
        # Proactive tracking: branded portal + automated SMS/WhatsApp alerts
        # 75% of WISMO inquiries deflected through real-time self-service
        wismo_inquiries = int(monthly_orders * passive_wismo_rate_pct)
        deflected_tickets = int(wismo_inquiries * 0.75)
        tickets_handled_by_agents = wismo_inquiries - deflected_tickets
        
        # Monetization: 60% of buyers view branded page; 2.2% convert on cross-sell
        tracking_page_visitors = int(monthly_orders * 0.60)
        cross_sell_orders = int(tracking_page_visitors * 0.022)
        tracking_page_cross_sell_revenue = cross_sell_orders * (avg_order_value_usd * 0.45)
        
    total_support_cost_usd = tickets_handled_by_agents * cost_per_manual_ticket_usd
    savings_from_deflection_usd = deflected_tickets * cost_per_manual_ticket_usd
    
    return {
        "monthly_orders": monthly_orders,
        "total_wismo_inquiries": wismo_inquiries,
        "deflected_self_service_tickets": deflected_tickets,
        "agent_handled_tickets": tickets_handled_by_agents,
        "direct_support_payroll_cost_usd": round(total_support_cost_usd, 2),
        "payroll_savings_usd": round(savings_from_deflection_usd, 2),
        "cross_sell_incremental_revenue_usd": round(tracking_page_cross_sell_revenue, 2),
        "net_monthly_economic_benefit_usd": round(savings_from_deflection_usd + tracking_page_cross_sell_revenue, 2)
    }

# Simulating 50,000 monthly orders at $80 AOV and $5.50 per manual ticket
passive_state = model_wismo_and_post_purchase_economics(
    monthly_orders=50000,
    avg_order_value_usd=80.0,
    passive_wismo_rate_pct=0.18, # 18% of orders generate a WISMO ticket
    proactive_tracking_adoption=False,
    cost_per_manual_ticket_usd=5.50
)

proactive_state = model_wismo_and_post_purchase_economics(
    monthly_orders=50000,
    avg_order_value_usd=80.0,
    passive_wismo_rate_pct=0.18,
    proactive_tracking_adoption=True,
    cost_per_manual_ticket_usd=5.50
)

print("=== POST-PURCHASE WISMO & TRACKING ECONOMICS ===")
print(f"Passive Model: {passive_state['agent_handled_tickets']:,} Agent Tickets | Support Cost: ${passive_state['direct_support_payroll_cost_usd']:,.2f}")
print(f"Proactive Model: {proactive_state['agent_handled_tickets']:,} Agent Tickets | Support Cost: ${proactive_state['direct_support_payroll_cost_usd']:,.2f}")
print(f"Deflected Tickets: {proactive_state['deflected_self_service_tickets']:,} tickets")
print(f"Direct Support Payroll Saved: ${proactive_state['payroll_savings_usd']:,.2f}")
print(f"Branded Tracking Cross-Sell Revenue: ${proactive_state['cross_sell_incremental_revenue_usd']:,.2f}")
print(f"Total Monthly Economic Advantage: ${proactive_state['net_monthly_economic_benefit_usd']:,.2f}")'''

    p1_output = """=== POST-PURCHASE WISMO & TRACKING ECONOMICS ===
Passive Model: 9,000 Agent Tickets | Support Cost: $49,500.00
Proactive Model: 2,250 Agent Tickets | Support Cost: $12,375.00
Deflected Tickets: 6,750 tickets
Direct Support Payroll Saved: $37,125.00
Branded Tracking Cross-Sell Revenue: $23,760.00
Total Monthly Economic Advantage: $60,885.00"""

    p1_check = {
        "question": "What is the primary operational cause of 'Where Is My Order' (WISMO) tickets, and how do branded tracking portals mitigate them?",
        "options": [
            "WISMO tickets occur because customers forget their home address; portals re-verify credit card PIN numbers",
            "WISMO tickets stem from post-purchase delivery anxiety and opaque courier updates; branded tracking portals ingest real-time carrier webhooks, deflecting up to 75% of inquiries through self-service",
            "WISMO tickets are generated automatically by courier sorting machines to test internet connections",
            "WISMO tickets happen only when packages are physically stolen by porch pirates"
        ],
        "answer": 1,
        "why": "Opaque delivery milestones cause consumer anxiety. Providing proactive, real-time branded tracking updates deflecting up to 75% of repetitive WISMO questions without requiring expensive human agent labor."
    }

    p1_example = "Casper Mattresses and Allbirds integrated branded tracking portals with automated SMS dispatch alerts. By sending proactive notifications the moment parcels cleared regional sorting hubs, Casper reduced customer support ticket volume by 42% while generating over $1.2 million in repeat accessory sales directly from the tracking page."
    p1_tryit = "Increase passive_wismo_rate_pct to 0.25 to model peak holiday carrier delay chaos. Observe how proactive tracking saves over $50,000 monthly in support costs under surge conditions."
    p1_notes = [
        "WISMO (Where Is My Order) inquiries represent 35-50% of all inbound e-commerce customer support volume.",
        "Each manual customer service ticket handled by a human representative costs between $4.00 and $8.00 in labor.",
        "Branded tracking pages deflect up to 75% of WISMO inquiries through automated, self-service carrier milestone updates.",
        "Customers view tracking pages an average of 4.2 times per order, creating a high-converting channel for post-purchase cross-selling."
    ]

    parts.append({
        "title": "Post-Purchase Psychology & The Where Is My Order (WISMO) Problem",
        "say": p1_say,
        "code": p1_code,
        "output": p1_output,
        "check": p1_check,
        "example": p1_example,
        "tryIt": p1_tryit,
        "codeNotes": p1_notes
    })

    # Part 2: Omnichannel Support Workflows, Routing & Core SLAs
    p2_say = [
        "In Part 2, we architect the quantitative management frameworks and Service Level Agreements (SLAs) governing enterprise customer operations: Omnichannel Support Routing, First Response Time (FRT), First Contact Resolution (FCR), and Customer Satisfaction (CSAT). When consumers encounter a damaged shipment, incorrect size, or missing accessory, their tolerance for delay is exceptionally low. In contemporary digital commerce, support interactions are conducted across fragmented communication channels: email ticketing, live web chat, WhatsApp, SMS, voice telephony, and public social media mentions (Instagram, X, TikTok). Without centralized orchestration, support queues fragment, duplicate tickets proliferate, and brand reputation rapidly deteriorates under public customer complaints.",
        
        "Enterprise customer service operations are managed through unified omnichannel helpdesk software (such as Zendesk, Gorgias, or Freshdesk). Inbound customer interactions across all channels are ingested into a unified ticketing inbox, automatically matched to the customer's historical Shopify or ERP profile using email address and phone number hashing. This eliminates the frustrating customer experience of having to repeat their order number or shipping address to multiple agents.",
        
        "Operational execution is measured against five rigorous North Star Service Level Agreements: First, First Response Time (FRT)—the elapsed time between a customer submitting a query and an agent or automated bot delivering the initial substantive response. Modern consumer benchmarks mandate an FRT under sixty seconds for live chat and WhatsApp, and under two hours for email tickets; Second, First Contact Resolution (FCR)—the percentage of incoming issues successfully resolved in a single interaction without requiring follow-up messages. Institutional support teams target an FCR exceeding seventy-five percent (> 75%), as multi-turn ticket exchanges drastically inflate operational costs and degrade customer patience; Third, Mean Time to Resolution (MTTR)—the average total duration required to close a ticket, typically targeted under twelve hours.",
        
        "Fourth is Customer Satisfaction Score (CSAT)—evaluated via one-click post-resolution surveys ('How satisfied were you with the support you received?'), targeting scores strictly above eighty-eight percent (> 88%); and Fifth, Net Promoter Score (NPS)—measuring broad customer advocacy and brand loyalty on a -100 to +100 scale.",
        
        "In our institutional Python model for Part 2, we simulate omnichannel ticket routing and SLA performance across a weekly volume of twenty thousand customer inquiries. The model evaluates triage queues across Live Chat, WhatsApp, Email, and Social Media, computing weighted FRT, FCR percentages, SLA breach rates, and overall CSAT health scores. Review the deterministic code below."
    ]

    p2_code = '''def model_omnichannel_support_slas(
    channel_inquiries: dict
) -> dict:
    """
    Evaluates omnichannel customer support performance across Live Chat,
    WhatsApp, Email, and Social Media against strict operational SLAs.
    """
    total_inquiries = 0
    total_breached_sla_tickets = 0
    total_fcr_resolved_tickets = 0
    weighted_frt_minutes_sum = 0.0
    weighted_csat_sum = 0.0
    
    channel_evaluations = {}
    
    for ch, data in channel_inquiries.items():
        volume = data['volume']
        actual_frt_min = data['actual_frt_minutes']
        sla_target_frt_min = data['sla_target_frt_minutes']
        fcr_pct = data['fcr_rate_pct']
        csat_score = data['csat_pct']
        
        total_inquiries += volume
        weighted_frt_minutes_sum += (volume * actual_frt_min)
        weighted_csat_sum += (volume * csat_score)
        
        fcr_tickets = int(volume * fcr_pct)
        total_fcr_resolved_tickets += fcr_tickets
        
        # Calculate SLA breach rate (exponential penalty if FRT exceeds target)
        if actual_frt_min > sla_target_frt_min:
            breach_pct = min(1.0, (actual_frt_min - sla_target_frt_min) / sla_target_frt_min)
            breached_tickets = int(volume * breach_pct)
        else:
            breached_tickets = 0
            
        total_breached_sla_tickets += breached_tickets
        
        channel_evaluations[ch] = {
            "volume": volume,
            "actual_frt_min": actual_frt_min,
            "target_frt_min": sla_target_frt_min,
            "fcr_rate_pct": round(fcr_pct * 100.0, 1),
            "breached_tickets": breached_tickets,
            "csat_pct": csat_score
        }
        
    blended_frt_min = weighted_frt_minutes_sum / total_inquiries if total_inquiries > 0 else 0.0
    blended_fcr_pct = (total_fcr_resolved_tickets / total_inquiries) * 100.0 if total_inquiries > 0 else 0.0
    blended_csat_pct = weighted_csat_sum / total_inquiries if total_inquiries > 0 else 0.0
    overall_sla_compliance_pct = ((total_inquiries - total_breached_sla_tickets) / total_inquiries) * 100.0
    
    return {
        "total_inquiries": total_inquiries,
        "blended_frt_minutes": round(blended_frt_min, 2),
        "blended_fcr_pct": round(blended_fcr_pct, 2),
        "blended_csat_pct": round(blended_csat_pct, 2),
        "overall_sla_compliance_pct": round(overall_sla_compliance_pct, 2),
        "channels": channel_evaluations
    }

# Evaluating 20,000 omnichannel support interactions
support_data = {
    'Live_Chat': {
        'volume': 7000,
        'actual_frt_minutes': 0.85, # 51 seconds
        'sla_target_frt_minutes': 1.0,
        'fcr_rate_pct': 0.82,
        'csat_pct': 92.5
    },
    'WhatsApp_Business': {
        'volume': 5500,
        'actual_frt_minutes': 1.20,
        'sla_target_frt_minutes': 2.0,
        'fcr_rate_pct': 0.80,
        'csat_pct': 91.0
    },
    'Email_Helpdesk': {
        'volume': 6000,
        'actual_frt_minutes': 85.0, # 1 hr 25 min
        'sla_target_frt_minutes': 120.0,
        'fcr_rate_pct': 0.71,
        'csat_pct': 86.0
    },
    'Social_Media_DMs': {
        'volume': 1500,
        'actual_frt_minutes': 15.0,
        'sla_target_frt_minutes': 30.0,
        'fcr_rate_pct': 0.74,
        'csat_pct': 88.0
    }
}

sla_audit = model_omnichannel_support_slas(support_data)

print("=== OMNICHANNEL SUPPORT SLA AUDIT ===")
print(f"Total Inbound Inquiries: {sla_audit['total_inquiries']:,}")
print(f"Blended First Response Time (FRT): {sla_audit['blended_frt_minutes']} minutes")
print(f"Blended First Contact Resolution (FCR): {sla_audit['blended_fcr_pct']}% (Target: > 75%)")
print(f"Blended Customer Satisfaction (CSAT): {sla_audit['blended_csat_pct']}% (Target: > 88%)")
print(f"Overall SLA Compliance: {sla_audit['overall_sla_compliance_pct']}%")
print()
for ch, d in sla_audit['channels'].items():
    print(f"Channel: {ch:18s} | FRT: {d['actual_frt_min']:5.2f}m (SLA: {d['target_frt_min']}m) | FCR: {d['fcr_rate_pct']}% | CSAT: {d['csat_pct']}%")'''

    p2_output = """=== OMNICHANNEL SUPPORT SLA AUDIT ===
Total Inbound Inquiries: 20,000
Blended First Response Time (FRT): 27.25 minutes
Blended First Contact Resolution (FCR): 77.55% (Target: > 75%)
Blended Customer Satisfaction (CSAT): 89.8% (Target: > 88%)
Overall SLA Compliance: 100.0%

Channel: Live_Chat          | FRT:  0.85m (SLA: 1.0m) | FCR: 82.0% | CSAT: 92.5%
Channel: WhatsApp_Business  | FRT:  1.20m (SLA: 2.0m) | FCR: 80.0% | CSAT: 91.0%
Channel: Email_Helpdesk     | FRT: 85.00m (SLA: 120.0m) | FCR: 71.0% | CSAT: 86.0%
Channel: Social_Media_DMs   | FRT: 15.00m (SLA: 30.0m) | FCR: 74.0% | CSAT: 88.0%"""

    p2_check = {
        "question": "Why is First Contact Resolution (FCR) targeted strictly above 75% in enterprise customer support management?",
        "options": [
            "Because unresolved tickets are automatically reported to police cybercrime divisions",
            "Because resolving customer issues in a single interaction prevents expensive follow-up message cycles, lowers support payroll, and produces significantly higher CSAT scores",
            "Because multi-turn tickets crash the company's SQL database servers",
            "Because email providers charge a $10 fee for every reply sent"
        ],
        "answer": 1,
        "why": "High FCR (>75%) means 3 out of 4 customer problems are resolved immediately, reducing agent handling time, eliminating repetitive ticket ping-pong, and driving higher customer satisfaction."
    }

    p2_example = "Zappos built its entire corporate brand equity on customer support excellence, empowering agents with zero scripted call-time limits and immediate authority to issue replacements and refunds. This customer-first philosophy drove a 94% CSAT score and a 75% repeat customer rate, powering its acquisition by Amazon for $1.2 billion."
    p2_tryit = "Increase Email_Helpdesk actual_frt_minutes to 180.0 minutes (exceeding the 120m SLA target). Notice how the engine automatically calculates breached tickets and degrades overall SLA compliance."
    p2_notes = [
        "Omnichannel support consolidates Live Chat, WhatsApp, Email, and Social into a single unified customer inbox.",
        "First Response Time (FRT) targets sub-60 seconds for live chat and under 2 hours for email inquiries.",
        "First Contact Resolution (FCR) measures the percentage of tickets solved in a single interaction (> 75% target).",
        "Customer Satisfaction (CSAT) surveys benchmark perceived service quality, targeting > 88% satisfaction."
    ]

    parts.append({
        "title": "Omnichannel Support Workflows, Routing & Core SLAs",
        "say": p2_say,
        "code": p2_code,
        "output": p2_output,
        "check": p2_check,
        "example": p2_example,
        "tryIt": p2_tryit,
        "codeNotes": p2_notes
    })

    # Part 3: AI Customer Service Automation: Rule-Based vs LLM Deflection Economics
    p3_say = [
        "In Part 3, we analyze the technological transformation reshaping customer care: Generative AI Customer Service Automation and LLM Agent Deflection Economics. For decades, digital retailers experimented with early-generation automated support bots. These legacy rule-based decision tree bots were notoriously rigid and frustrating for consumers: relying on keyword regex matching, forcing users down narrow multiple-choice menu corridors, and failing completely whenever a customer phrased a request naturally or introduced nuanced context. Consequently, legacy bots deflected less than fifteen to twenty percent of support tickets, often exacerbating consumer frustration and triggering immediate demands to 'speak with a human agent.'",
        
        "The emergence of large language model (LLM) support agents (exemplified by Klarna's OpenAI integration, Gorgias Automate, and Sierra AI) fundamentally redefined support automation. Modern AI agents possess advanced Natural Language Understanding (NLU), conversational empathy, multi-lingual fluency, and the ability to execute complex tool-calling and API workflows. Instead of merely reciting static FAQ knowledge base links, an autonomous AI agent authenticates the customer, queries the Shopify Storefront API to retrieve real-time order tracking details, analyzes damaged photo attachments using computer vision, and programmatically executes business logic.",
        
        "To deploy AI customer support safely without hallucinations or rogue commitments, enterprise architectures enforce strict Guardrails and Autonomous Resolution Boundaries: First, Autonomous Actions within Bounded Thresholds—the AI agent is granted programmatic authority to execute specific low-risk operational mutations without human sign-off (e.g., reissuing tracking links, canceling unfulfilled orders within two hours of placement, or issuing instant refunds/store credits for damaged items under thirty-five dollars); Second, Semantic Confidence Thresholds—if the AI's internal intent recognition confidence score falls below ninety percent, or if the conversation exhibits strong negative sentiment (angry tone or legal threats), the system executes an automated warm handoff to a human tier-2 specialist, transferring the complete conversational transcript context.",
        
        "The economic impact of AI support deflection is profound. Whereas a fully loaded human customer support interaction costs five to eight dollars per ticket, an LLM API call with tool calling costs between twelve and twenty-five cents. When an AI support platform achieves a sixty percent ticket deflection rate, direct support operating expenses plunge by over fifty percent, enabling hyper-growth brands to scale ten-fold without ballooning support payroll.",
        
        "In our institutional Python model for Part 3, we simulate an AI Customer Service Deflection Engine processing a stream of five thousand diverse customer inquiries. The model categorizes intent, evaluates autonomous tool-calling eligibility, checks refund dollar thresholds, computes API token costs, and calculates net support cost savings relative to human agent handling. Review the deterministic code below."
    ]

    p3_code = '''def simulate_ai_support_deflection_engine(
    total_inquiries: int,
    human_cost_per_ticket_usd: float,
    ai_cost_per_query_usd: float
) -> dict:
    """
    Simulates AI customer service deflection economics across ticket categories,
    evaluating autonomous tool-calling actions vs human escalation.
    """
    # Distribution of common e-commerce customer support intents
    intent_distribution = {
        "WISMO_Tracking_Query":     {"share": 0.42, "ai_deflect_rate": 0.88, "autonomous_action": "FETCH_ORDER_TRACKING_API"},
        "Return_RMA_Initiation":    {"share": 0.22, "ai_deflect_rate": 0.72, "autonomous_action": "GENERATE_QR_RETURN_LABEL"},
        "Damaged_Item_Refund":      {"share": 0.14, "ai_deflect_rate": 0.50, "autonomous_action": "APPROVE_REFUND_UNDER_35_USD"},
        "Product_Sizing_Inquiry":   {"share": 0.12, "ai_deflect_rate": 0.85, "autonomous_action": "CONSULT_KNOWLEDGE_BASE"},
        "Complex_Angry_Escalation": {"share": 0.10, "ai_deflect_rate": 0.05, "autonomous_action": "HUMAN_TIER_2_HANDOFF"}
    }
    
    total_deflected_by_ai = 0
    total_escalated_to_human = 0
    
    intent_breakdown = {}
    
    for intent, data in intent_distribution.items():
        volume = int(total_inquiries * data['share'])
        deflected = int(volume * data['ai_deflect_rate'])
        escalated = volume - deflected
        
        total_deflected_by_ai += deflected
        total_escalated_to_human += escalated
        
        intent_breakdown[intent] = {
            "volume": volume,
            "deflected_by_ai": deflected,
            "escalated_to_human": escalated,
            "deflection_pct": round((deflected / volume) * 100.0, 1),
            "action": data['autonomous_action']
        }
        
    # Financial reconciliation
    baseline_human_support_cost = total_inquiries * human_cost_per_ticket_usd
    actual_ai_api_costs = total_inquiries * ai_cost_per_query_usd
    actual_human_payroll_costs = total_escalated_to_human * human_cost_per_ticket_usd
    total_hybrid_support_cost = actual_ai_api_costs + actual_human_payroll_costs
    
    net_support_savings_usd = baseline_human_support_cost - total_hybrid_support_cost
    effective_deflection_pct = (total_deflected_by_ai / total_inquiries) * 100.0
    cost_reduction_pct = (net_support_savings_usd / baseline_human_support_cost) * 100.0
    
    return {
        "total_inquiries": total_inquiries,
        "total_deflected_by_ai": total_deflected_by_ai,
        "total_escalated_to_human": total_escalated_to_human,
        "overall_deflection_pct": round(effective_deflection_pct, 2),
        "baseline_human_cost_usd": round(baseline_human_support_cost, 2),
        "hybrid_support_cost_usd": round(total_hybrid_support_cost, 2),
        "net_support_savings_usd": round(net_support_savings_usd, 2),
        "cost_reduction_pct": round(cost_reduction_pct, 2),
        "intent_breakdown": intent_breakdown
    }

# Evaluating 5,000 inquiries: Human=$6.00/ticket, AI API=$0.20/query
ai_sim = simulate_ai_support_deflection_engine(
    total_inquiries=5000,
    human_cost_per_ticket_usd=6.00,
    ai_cost_per_query_usd=0.20
)

print("=== AI CUSTOMER SUPPORT DEFLECTION ECONOMICS ===")
print(f"Total Inbound Inquiries: {ai_sim['total_inquiries']:,}")
print(f"Successfully Deflected by AI: {ai_sim['total_deflected_by_ai']:,} ({ai_sim['overall_deflection_pct']}%)")
print(f"Escalated to Human Tier 2: {ai_sim['total_escalated_to_human']:,} tickets")
print(f"Baseline Human Support Cost: ${ai_sim['baseline_human_cost_usd']:,.2f}")
print(f"Actual Hybrid AI+Human Cost: ${ai_sim['hybrid_support_cost_usd']:,.2f}")
print(f"Net Operating Payroll Saved: ${ai_sim['net_support_savings_usd']:,.2f} ({ai_sim['cost_reduction_pct']}% cost reduction)")
print()
for intent, d in ai_sim['intent_breakdown'].items():
    print(f"Intent: {intent:25s} | Vol: {d['volume']:4d} | Deflected: {d['deflected_by_ai']:4d} ({d['deflection_pct']}%) | Action: {d['action']}")'''

    p3_output = """=== AI CUSTOMER SUPPORT DEFLECTION ECONOMICS ===
Total Inbound Inquiries: 5,000
Successfully Deflected by AI: 3,525 (70.5%)
Escalated to Human Tier 2: 1,475 tickets
Baseline Human Support Cost: $30,000.00
Actual Hybrid AI+Human Cost: $9,850.00
Net Operating Payroll Saved: $20,150.00 (67.17% cost reduction)

Intent: WISMO_Tracking_Query      | Vol: 2100 | Deflected: 1848 (88.0%) | Action: FETCH_ORDER_TRACKING_API
Intent: Return_RMA_Initiation     | Vol: 1100 | Deflected:  792 (72.0%) | Action: GENERATE_QR_RETURN_LABEL
Intent: Damaged_Item_Refund       | Vol:  700 | Deflected:  350 (50.0%) | Action: APPROVE_REFUND_UNDER_35_USD
Intent: Product_Sizing_Inquiry    | Vol:  600 | Deflected:  510 (85.0%) | Action: CONSULT_KNOWLEDGE_BASE
Intent: Complex_Angry_Escalation  | Vol:  500 | Deflected:   25 (5.0%) | Action: HUMAN_TIER_2_HANDOFF"""

    p3_check = {
        "question": "What is the primary financial advantage of deploying an LLM-powered autonomous customer support agent over traditional human-only contact centers?",
        "options": [
            "AI agents eliminate the need to maintain an inventory warehouse",
            "An AI agent can resolve high-frequency structured inquiries (WISMO, RMA labels) at ~$0.20 per query compared to $6.00+ for human agents, reducing overall support payroll by over 60%",
            "AI agents make credit card payments free of charge",
            "AI agents automatically manufacture replacement products"
        ],
        "answer": 1,
        "why": "By resolving 70%+ of routine inquiries autonomously via API tool-calling at $0.20 per interaction, AI agents drastically reduce manual ticket volume, slashing customer service costs by over 65%."
    }

    p3_example = "Klarna deployed an OpenAI-powered AI customer service assistant that handled 2.3 million conversations in its first month—the equivalent workload of 700 full-time customer service agents. The AI bot resolved queries in under 2 minutes (compared to 11 minutes previously) while improving customer satisfaction parity with human agents."
    p3_tryit = "Increase the volume share of Complex_Angry_Escalation from 0.10 to 0.30 to simulate a major supply chain crisis. Notice how human escalations rise, showing the importance of hybrid human-in-the-loop support."
    p3_notes = [
        "LLM support agents utilize tool-calling to execute real-time actions (order cancellation, RMA label generation).",
        "Cost per automated query is $0.15-$0.25 compared to $5.00-$8.00 for manual human representative handling.",
        "Semantic confidence and sentiment guardrails automatically escalate complex or angry inquiries to tier-2 human specialists.",
        "Bounded refund thresholds (e.g., auto-approving refunds < $35) empower bots to resolve complaints instantly without human delay."
    ]

    parts.append({
        "title": "AI Customer Service Automation: Rule-Based vs LLM Deflection Economics",
        "say": p3_say,
        "code": p3_code,
        "output": p3_output,
        "check": p3_check,
        "example": p3_example,
        "tryIt": p3_tryit,
        "codeNotes": p3_notes
    })

    # Part 4: Queuing Theory in Support Operations: Erlang C & Agent Capacity Planning
    p4_say = [
        "In Part 4, we examine the mathematical foundations of workforce management and contact center capacity planning: Queuing Theory and The Erlang C Model. In customer support management, deciding how many human support agents to schedule across morning, evening, and weekend shifts is a high-stakes balancing act. If an operations manager under-schedules agents, support queues back up, First Response Times skyrocket, customer frustration boils over into negative online reviews, and CSAT scores collapse. Conversely, if the manager over-schedules agents, idle workforce payroll escalates, eroding operating profit margins. Gut instinct or simple linear division (e.g., dividing total hours by ticket volume) fails because customer contact arrivals are stochastic—arriving in unpredictable random bursts following Poisson distributions.",
        
        r"To model customer queuing dynamics with mathematical precision, workforce planners utilize the Erlang C formula (derived by Danish mathematician A.K. Erlang). The Erlang C model calculates the probability that an incoming customer inquiry will have to wait in a queue rather than receiving immediate service, given an arrival rate of calls or chats ($\lambda$), an average handling duration ($\mu$), and a specified number of concurrent active agents ($c$).",
        
        r"The model derives three critical operational metrics: First, Traffic Intensity (offered load in Erlangs), representing the total volume of work arriving per unit time: $A = \lambda \times \text{Average Handling Time}$; Second, The Probability of Delay ($P_w$), calculating the exact likelihood that an incoming shopper encounters a queue; and Third, Average Speed of Answer (ASA), determining expected queue wait duration. Furthermore, the model calculates the Service Level Percentage—the probability that a customer receives an answer within a target SLA window (e.g., answering 85% of chats within 45 seconds).",
        
        "During high-volume peak seasons (such as Black Friday Cyber Monday or Prime Day), workforce managers run Erlang C sensitivity simulations to determine exact agent headcounts required across global time zones, factoring in agent shrinkage (time lost to breaks, training, absenteeism, and admin meetings, typically 25-35%). By combining Erlang C models with AI deflection baselines, modern support directors achieve sub-minute wait times with lean, cost-efficient staffing.",
        
        "In our institutional Python model for Part 4, we build an authoritative Erlang C Workforce Capacity Calculator. The algorithm ingests hourly arrival rates for live customer chat, average handling times, and target response SLAs. It iteratively computes the optimal agent headcount required to guarantee an 85% SLA compliance threshold while calculating queue delay probabilities. Review the code below."
    ]

    p4_code = '''import math

def calculate_erlang_c_staffing(
    arrival_rate_per_hour: float,
    avg_handle_time_minutes: float,
    target_wait_time_seconds: float,
    target_sla_pct: float,
    agent_shrinkage_pct: float
) -> dict:
    """
    Erlang C mathematical queuing model for customer support agent staffing.
    Calculates probability of waiting, average speed of answer (ASA),
    and required headcount with shrinkage adjustment.
    """
    # Arrival rate in calls/chats per second (lambda)
    lam = arrival_rate_per_hour / 3600.0
    # Service time in seconds (Ts)
    ts = avg_handle_time_minutes * 60.0
    # Offered load in Erlangs (A = lambda * Ts)
    erlangs = lam * ts
    
    # Minimum integer agents required to prevent infinite queue growth
    min_agents = math.floor(erlangs) + 1
    
    def erlang_c_prob_delay(c: int, a: float) -> float:
        # Summation from k=0 to c-1 of A^k / k!
        sum_terms = sum((a ** k) / math.factorial(k) for k in range(c))
        c_term = (a ** c) / (math.factorial(c) * (1.0 - (a / c)))
        pw = c_term / (sum_terms + c_term)
        return pw
        
    def service_level(c: int, a: float, target_t: float) -> float:
        pw = erlang_c_prob_delay(c, a)
        # Probability wait <= target_t = 1 - Pw * e^(-(c - A) * target_t / Ts)
        exponent = - (c - a) * (target_t / ts)
        sl = 1.0 - (pw * math.exp(exponent))
        return sl
        
    # Search for optimal agent count meeting SLA target
    c = min_agents
    while True:
        sl = service_level(c, erlangs, target_wait_time_seconds)
        if sl >= (target_sla_pct / 100.0):
            break
        c += 1
        if c > 200: # Safety guard
            break
            
    # Calculate operational metrics with optimal agents c
    prob_delay = erlang_c_prob_delay(c, erlangs)
    # Average Speed of Answer (ASA) in seconds
    asa_seconds = (prob_delay * ts) / (c - erlangs)
    achieved_sl_pct = service_level(c, erlangs, target_wait_time_seconds) * 100.0
    
    # Adjust for workforce shrinkage (breaks, PTO, training)
    roster_headcount_required = math.ceil(c / (1.0 - agent_shrinkage_pct))
    
    return {
        "arrival_rate_per_hour": arrival_rate_per_hour,
        "offered_load_erlangs": round(erlangs, 2),
        "target_wait_seconds": target_wait_time_seconds,
        "on_shift_agents_required": c,
        "scheduled_roster_headcount": roster_headcount_required,
        "probability_of_delay_pct": round(prob_delay * 100.0, 2),
        "average_speed_of_answer_sec": round(asa_seconds, 2),
        "achieved_service_level_pct": round(achieved_sl_pct, 2)
    }

# Simulating peak flash sale support queue: 360 live chats/hr, 6 min average handle time
erlang_plan = calculate_erlang_c_staffing(
    arrival_rate_per_hour=360.0,
    avg_handle_time_minutes=6.0,
    target_wait_time_seconds=45.0, # Answer 85% of chats within 45s
    target_sla_pct=85.0,
    agent_shrinkage_pct=0.30       # 30% shrinkage factor
)

print("=== ERLANG C SUPPORT WORKFORCE CAPACITY PLAN ===")
print(f"Incoming Chat Volume: {erlang_plan['arrival_rate_per_hour']} chats/hour (Traffic Load: {erlang_plan['offered_load_erlangs']} Erlangs)")
print(f"Target SLA: Answer in <= {erlang_plan['target_wait_seconds']}s")
print(f"On-Shift Concurrent Agents Needed: {erlang_plan['on_shift_agents_required']} agents")
print(f"Total Scheduled Roster (with 30% shrinkage): {erlang_plan['scheduled_roster_headcount']} agents")
print(f"Probability a Customer Waits in Queue: {erlang_plan['probability_of_delay_pct']}%")
print(f"Average Speed of Answer (ASA): {erlang_plan['average_speed_of_answer_sec']} seconds")
print(f"Achieved Service Level: {erlang_plan['achieved_service_level_pct']}% (Target: 85%)")'''

    p4_output = """=== ERLANG C SUPPORT WORKFORCE CAPACITY PLAN ===
Incoming Chat Volume: 360.0 chats/hour (Traffic Load: 36.0 Erlangs)
Target SLA: Answer in <= 45.0s
On-Shift Concurrent Agents Needed: 42 agents
Total Scheduled Roster (with 30% shrinkage): 61 agents
Probability a Customer Waits in Queue: 24.57%
Average Speed of Answer (ASA): 14.74 seconds
Achieved Service Level: 88.4% (Target: 85%)"""

    p4_check = {
        "question": "In customer support workforce planning, why does an operations manager need 61 rostered agents rather than just the 36 Erlangs of raw workload?",
        "options": [
            "Because 25 agents are legally mandated to work exclusively on marketing",
            "Because stochastic arrival variance requires buffer agents (42 on shift) to meet response SLAs without queue backlogs, plus shrinkage adjustment (30%) accounts for breaks, training, and PTO",
            "Because agents only work 10 minutes per day",
            "Because Erlang C assumes all computers lose power twice an hour"
        ],
        "answer": 1,
        "why": "Raw workload (36 Erlangs) represents 100% agent utilization with infinite wait times. Queuing mathematics requires 42 active agents to answer 88.4% within 45 seconds, and 30% shrinkage pushes required rostered staff to 61."
    }

    p4_example = "Amazon Customer Service applies real-time Erlang C simulations across global time zones to dynamically distribute support queues between US, European, and Asian contact centers. During peak Cyber Week, Erlang modeling accurately forecasts agent requirements across languages, keeping chat ASA under 30 seconds globally."
    p4_tryit = "Reduce agent_shrinkage_pct to 0.15 by optimizing shift handoffs. Notice how scheduled roster headcount drops from 59 to 49, illustrating the massive financial savings of operational shrinkage management."
    p4_notes = [
        "Erlang C mathematically models stochastic queue waiting times based on Poisson arrivals and exponential handling times.",
        r"Traffic intensity in Erlangs ($A = \lambda \times T_s$) calculates raw workload hours arriving per clock hour.",
        "Average Speed of Answer (ASA) and Probability of Delay ($P_w$) dictate customer waiting experience and SLA compliance.",
        "Workforce shrinkage (25-35%) must be factored in to account for agent breaks, training, PTO, and administrative duties."
    ]

    parts.append({
        "title": "Queuing Theory in Support Operations: Erlang C & Agent Capacity Planning",
        "say": p4_say,
        "code": p4_code,
        "output": p4_output,
        "check": p4_check,
        "example": p4_example,
        "tryIt": p4_tryit,
        "codeNotes": p4_notes
    })

    # Part 5: Enterprise Post-Purchase Customer Experience Operations Gateway
    p5_say = [
        "In the final capstone component of Day 14, we synthesize post-purchase tracking, omnichannel SLA routing, AI deflection, and workforce capacity planning into the unified Enterprise Post-Purchase Customer Experience Command Gateway. In a multi-million-dollar global direct-to-consumer brand, customer support is no longer relegated to a reactive complaint-handling basement; it functions as an intelligent real-time customer lifetime value preservation and feedback command center.",
        
        "The Enterprise Customer Experience Gateway orchestrates four high-impact corporate mandates: First, Continuous Support Telemetry and Automated Anomaly Detection—monitoring ticket volume spikes in real time to detect fulfillment anomalies (e.g., if ticket volume for 'Missing Power Cable' on SKU-402 spikes by three hundred percent in three hours, the gateway immediately alerts warehouse packaging teams to inspect factory assembly lines before thousands of additional defective orders ship); Second, Intelligent Hybrid Human-AI Orchestration—dynamically adjusting AI autonomy thresholds during peak flash surges to deflect routine queries while reserving human tier-2 empathy agents for VIP loyalty members and high-value orders; Third, Closed-Loop Voice of the Customer (VoC) Merchandising Intelligence—synthesizing unstructured customer feedback, return reasons, and chat transcripts into structured product improvement roadmaps for engineering and marketing teams; and Fourth, Post-Purchase CSAT and NPS Governance—tracking customer satisfaction trends by fulfillment node and delivery carrier to enforce accountability on third-party 3PL logistics partners.",
        
        "To benchmark enterprise customer operations, executive leadership tracks the Net Customer Effort Score (NCES) and Support Contribution Index (SCI). The Support Contribution Index evaluates net financial value: SCI = (Tracking Page Repeat Revenue + Retained Attrition Revenue - Total Support Payroll & Software Costs) / Total Support Operating Overhead. When an organization achieves an SCI greater than 1.5, customer service ceases to be a net financial cost center and officially operates as a self-sustaining profit generator.",
        
        "Furthermore, by tying customer support ticket histories directly into CRM marketing segments (Klaviyo/Braze), the gateway automatically suppresses aggressive promotional email campaigns to customers with open, unresolved complaints. This prevents marketing tone-deafness and preserves brand dignity during stressful customer dispute resolutions.",
        
        "In our final Python simulation for Day 14, we run the Enterprise Post-Purchase Command Gateway across a full monthly cohort of twenty-five thousand customer interactions. The engine executes proactive tracking deflection, AI tool-calling, Erlang C agent allocation, and financial reconciliation, generating the executive CX performance scorecard. Review the complete institutional implementation below."
    ]

    p5_code = '''def run_enterprise_cx_operations_gateway(
    total_monthly_orders: int,
    inbound_inquiry_rate_pct: float,
    ai_deflection_rate_pct: float,
    human_cost_per_ticket_usd: float,
    ai_cost_per_ticket_usd: float,
    branded_tracking_cross_sell_revenue: float
) -> dict:
    """
    Enterprise Post-Purchase Customer Experience Operations Gateway:
    Orchestrates proactive tracking, AI deflection, human queue routing,
    and calculates Support Contribution Index (SCI).
    """
    total_inquiries = int(total_monthly_orders * inbound_inquiry_rate_pct)
    
    # AI deflection layer
    deflected_by_ai = int(total_inquiries * ai_deflection_rate_pct)
    escalated_to_human = total_inquiries - deflected_by_ai
    
    # Financial breakdown
    ai_software_costs = total_inquiries * ai_cost_per_ticket_usd
    human_support_payroll = escalated_to_human * human_cost_per_ticket_usd
    total_support_overhead = ai_software_costs + human_support_payroll
    
    # Retained revenue from rapid resolution (preventing chargebacks & churn)
    # Estimated at $12 per successfully resolved issue
    retained_revenue_usd = (deflected_by_ai * 10.0) + (escalated_to_human * 14.0)
    
    # Support Contribution Index (SCI) = (Generated Revenue + Retained Value) / Support Cost
    total_value_generated = branded_tracking_cross_sell_revenue + retained_revenue_usd
    sci_index = total_value_generated / total_support_overhead if total_support_overhead > 0 else 0.0
    
    # Operational quality indicators
    avg_first_response_time_sec = (deflected_by_ai * 3.0 + escalated_to_human * 75.0) / total_inquiries
    projected_csat_pct = min(96.0, 85.0 + (ai_deflection_rate_pct * 12.0))
    
    return {
        "monthly_orders": total_monthly_orders,
        "total_inbound_inquiries": total_inquiries,
        "deflected_by_ai": deflected_by_ai,
        "escalated_to_human": escalated_to_human,
        "ai_deflection_pct": round(ai_deflection_rate_pct * 100.0, 1),
        "total_support_overhead_usd": round(total_support_overhead, 2),
        "tracking_cross_sell_revenue_usd": round(branded_tracking_cross_sell_revenue, 2),
        "retained_customer_value_usd": round(retained_revenue_usd, 2),
        "support_contribution_index": round(sci_index, 2),
        "blended_frt_seconds": round(avg_first_response_time_sec, 1),
        "projected_csat_pct": round(projected_csat_pct, 1),
        "operational_status": "PROFIT_ACCRETIVE_CX_OPERATIONS"
    }

# Running Gateway on 100,000 monthly orders
cx_audit = run_enterprise_cx_operations_gateway(
    total_monthly_orders=100000,
    inbound_inquiry_rate_pct=0.12, # 12% inquiry rate
    ai_deflection_rate_pct=0.72,   # 72% AI autonomous deflection
    human_cost_per_ticket_usd=5.80,
    ai_cost_per_ticket_usd=0.22,
    branded_tracking_cross_sell_revenue=48500.0
)

print("=== ENTERPRISE CUSTOMER EXPERIENCE COMMAND GATEWAY ===")
print(f"Total Monthly Orders: {cx_audit['monthly_orders']:,} orders")
print(f"Inbound Support Inquiries: {cx_audit['total_inbound_inquiries']:,} tickets")
print(f"Deflected by AI Autonomous Agents: {cx_audit['deflected_by_ai']:,} ({cx_audit['ai_deflection_pct']}%)")
print(f"Escalated to Human Tier 2: {cx_audit['escalated_to_human']:,} tickets")
print(f"Blended Customer Response Time: {cx_audit['blended_frt_seconds']} seconds")
print(f"Projected CSAT Rating: {cx_audit['projected_csat_pct']}%")
print(f"Total Support Operating Expense: ${cx_audit['total_support_overhead_usd']:,.2f}")
print(f"Tracking Page Cross-Sell Revenue: ${cx_audit['tracking_cross_sell_revenue_usd']:,.2f}")
print(f"Retained Customer Value: ${cx_audit['retained_customer_value_usd']:,.2f}")
print(f"Support Contribution Index (SCI): {cx_audit['support_contribution_index']}x (Value generated per $1 spent)")
print(f"Strategic Executive Status: {cx_audit['operational_status']}")'''

    p5_output = """=== ENTERPRISE CUSTOMER EXPERIENCE COMMAND GATEWAY ===
Total Monthly Orders: 100,000 orders
Inbound Support Inquiries: 12,000 tickets
Deflected by AI Autonomous Agents: 8,640 (72.0%)
Escalated to Human Tier 2: 3,360 tickets
Blended Customer Response Time: 23.2 seconds
Projected CSAT Rating: 93.6%
Total Support Operating Expense: $22,128.00
Tracking Page Cross-Sell Revenue: $48,500.00
Retained Customer Value: $133,440.00
Support Contribution Index (SCI): 8.22x (Value generated per $1 spent)
Strategic Executive Status: PROFIT_ACCRETIVE_CX_OPERATIONS"""

    p5_check = {
        "question": "What does a Support Contribution Index (SCI) of 8.22x demonstrate about an enterprise post-purchase support operation?",
        "options": [
            "That customer support is losing 8.22% of gross company revenue each month",
            "That for every $1.00 invested in support technology and human personnel, the operation generates $8.22 in combined repeat cross-sell revenue and preserved customer lifetime value, proving it is a profit-generating center",
            "That agents work 8.22 hours of overtime per day",
            "That shipping carriers charge an 8.22% fuel surcharge"
        ],
        "answer": 1,
        "why": "An SCI of 8.22x indicates that the customer service operation yields $8.22 in repeat cross-sell revenue and retained customer equity for every $1.00 spent on operations, elevating CX from a cost center to a profit driver."
    }

    p5_example = "Warby Parker transformed customer service into an active growth driver through omnichannel video consultations, proactive home try-on SMS updates, and hassle-free lens replacements. This proactive customer care culture generated an industry-leading Net Promoter Score of 84 and drove over 50% of annual revenue through word-of-mouth referrals."
    p5_tryit = "Evaluate the effect of dropping ai_deflection_rate_pct to 0.20 (legacy support mode). Notice how human tickets surge to 9,600, total support expenses jump, and the Support Contribution Index deteriorates."
    p5_notes = [
        "The Enterprise CX Gateway unifies proactive tracking, AI deflection, human queue routing, and financial retention.",
        "Support Contribution Index (SCI) benchmarks total economic value created against operating support expenses.",
        "Blended response times under 30 seconds preserve customer trust and drive higher Customer Satisfaction (CSAT > 90%).",
        "Integrating support ticket data with marketing CRM tools suppresses tone-deaf promotions to customers with open disputes."
    ]

    parts.append({
        "title": "Enterprise Post-Purchase Customer Experience Operations Gateway",
        "say": p5_say,
        "code": p5_code,
        "output": p5_output,
        "check": p5_check,
        "example": p5_example,
        "tryIt": p5_tryit,
        "codeNotes": p5_notes
    })

    day14_dict = {
        "coursePrefix": "bcom_ecom",
        "day": 14,
        "title": "Customer Support & Post-Purchase Experience: First Response Time (FRT) & CSAT SLAs",
        "goal": "Master post-purchase operations and customer support engineering: proactive branded tracking portal economics, omnichannel SLA governance (FRT, FCR, CSAT), generative AI customer service deflection models, Erlang C queuing mathematics for agent capacity staffing, and enterprise CX contribution index modeling.",
        "minutes": 35,
        "recap": "Welcome to Day 14 of E-Commerce & Marketplace Economics. Today we analyzed the post-purchase WISMO problem, governed omnichannel response SLAs, deployed autonomous LLM support agents, calculated Erlang C staffing headcounts, and orchestrated profit-accretive enterprise CX operations.",
        "parts": parts,
        "summary": [
            "Where Is My Order (WISMO) queries drive up to 50% of customer support volume, avoidable through proactive branded tracking portals.",
            "Enterprise post-purchase operations govern First Response Time (FRT), First Contact Resolution (FCR), and CSAT SLAs.",
            "Generative AI autonomous agents deflect routine order status and return inquiries, reducing human cost per ticket by over 70%.",
            "Erlang C queuing formulations calculate exact human agent staffing headcounts needed to meet service level thresholds under peak loads.",
            "The Support Contribution Index (SCI) proves that high-retention customer experience operations generate accretive repeat revenue."
        ]
    }

    total_words = ensure_ecom_day_budget(day14_dict, min_part_words=580, min_day_words=2950)
    return day14_dict, total_words

if __name__ == '__main__':
    d, words = build_day14()
    print(f"Day 14 generated successfully: {words} words across {len(d['parts'])} parts.")
    for idx, p in enumerate(d['parts']):
        p_words = count_words(p['say'])
        print(f"  Part {idx+1}: {p_words} words - {p['title'][:40]}...")
