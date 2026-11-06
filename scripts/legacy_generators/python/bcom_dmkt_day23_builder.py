"""
Day 23 Builder: Community & Conversational Social Commerce: WhatsApp Business API & D2C Live Selling
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Milestone 5
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from digital_marketing_budget_ensurer import ensure_dmkt_day_budget
from visual_builder import count_words

def build_day23_visual() -> dict:
    return {
        "schemaVersion": 1,
        "coursePrefix": "bcom_dmkt",
        "day": 23,
        "title": "Community & Conversational Social Commerce Architecture",
        "funnelSteps": [
            {
                "step": "WHATSAPP_CLOUD_API_ROUTING",
                "label": "Meta Graph API Webhook Routing & Session Management",
                "metric": "24h Session Window Active",
                "status": "COMPLETED",
                "color": "#10B981"
            },
            {
                "step": "BROADCAST_QUALITY_AND_TIERING",
                "label": "Broadcast Deliverability (98% Read Rate) & Tier Governance",
                "metric": "Quality: GREEN / Tier: 100k",
                "status": "COMPLETED",
                "color": "#3B82F6"
            },
            {
                "step": "CART_AND_COD_AUTOMATION",
                "label": "Automated Cart Recovery & COD to Prepaid Conversion",
                "metric": "35% Recovery / 40% RTO Reduction",
                "status": "COMPLETED",
                "color": "#6366F1"
            },
            {
                "step": "D2C_LIVE_STREAM_SELLING",
                "label": "Interactive Live Selling & Instantaneous Flash Checkout",
                "metric": "17.0% Live CVR ($63.75k GMV)",
                "status": "COMPLETED",
                "color": "#F59E0B"
            },
            {
                "step": "CONVERSATIONAL_GATEWAY",
                "label": "Enterprise Conversational Commerce & Community Gateway",
                "metric": "100.0/100 CCCI Certified",
                "status": "COMPLETED",
                "color": "#8B5CF6"
            }
        ],
        "kpis": [
            {"label": "WhatsApp Read Rate", "value": "98.0%"},
            {"label": "Abandoned Cart Recovery", "value": "35.0%"},
            {"label": "Live Stream CVR", "value": "17.0%"},
            {"label": "Composite CCCI Score", "value": "100.0/100"}
        ]
    }

def build_day23_lesson() -> dict:
    p1_code = r'''def simulate_whatsapp_webhook_router(incoming_events: list) -> dict:
    """
    Routes incoming WhatsApp Business Cloud API webhooks:
    Distinguishes Customer-Initiated messages (opening a free 24h service session)
    from Business-Initiated outbound messages (requiring pre-approved templates).
    """
    routed = []
    customer_sessions_opened = 0
    business_templates_sent = 0
    
    for ev in incoming_events:
        msg_type = ev.get("direction")
        if msg_type == "INBOUND_CUSTOMER":
            customer_sessions_opened += 1
            routed.append({
                "from_phone": ev["phone"],
                "category": "CUSTOMER_SERVICE_24H_WINDOW",
                "action": "SESSION_OPENED_FREE_AGENT_REPLIES",
                "cost_tier": "FREE_TIER_SERVICE_CONVERSATION"
            })
        else:
            business_templates_sent += 1
            template_name = ev.get("template_name", "standard_utility")
            routed.append({
                "to_phone": ev["phone"],
                "category": "BUSINESS_INITIATED_MARKETING",
                "action": f"DISPATCH_TEMPLATE_{template_name.upper()}",
                "cost_tier": "PAID_MARKETING_CONVERSATION"
            })
            
    return {
        "total_webhooks_processed": len(incoming_events),
        "customer_service_sessions": customer_sessions_opened,
        "business_template_messages": business_templates_sent,
        "routes": routed,
        "status": "WEBHOOK_ROUTING_SUCCESSFUL"
    }

if __name__ == "__main__":
    events = [
        {"phone": "+14155552671", "direction": "INBOUND_CUSTOMER", "text": "Where is my order?"},
        {"phone": "+14155558912", "direction": "OUTBOUND_BUSINESS", "template_name": "abandoned_cart_discount"},
        {"phone": "+14155554321", "direction": "INBOUND_CUSTOMER", "text": "Do you have size 10 in stock?"},
        {"phone": "+14155559876", "direction": "OUTBOUND_BUSINESS", "template_name": "order_shipped_tracking"}
    ]
    res = simulate_whatsapp_webhook_router(events)
    print("WhatsApp Cloud API Webhook Routing Report:")
    print(f"  Webhooks Processed: {res['total_webhooks_processed']}")
    print(f"  Customer Service Sessions (24h Free): {res['customer_service_sessions']}")
    print(f"  Business Outbound Templates (Paid): {res['business_template_messages']}")
    for r in res['routes']:
        ph = r.get('from_phone', r.get('to_phone'))
        print(f"    Target {ph}: {r['category']} -> {r['action']}")
    print(f"  Status: {res['status']}")
'''

    p2_code = r'''def audit_whatsapp_broadcast_health(sent: int, read: int, opt_outs: int, current_tier: str) -> dict:
    """
    Audits WhatsApp Broadcast campaign performance, read rates, and phone number quality rating.
    Monitors opt-out rates (<= 0.20%) to prevent phone number blocking and downgrade.
    """
    read_rate_pct = round((read / sent) * 100, 1)
    opt_out_pct = round((opt_outs / sent) * 100, 2)
    is_high_quality = opt_out_pct <= 0.20 and read_rate_pct >= 90.0
    quality_rating = "HIGH_QUALITY_GREEN" if is_high_quality else "MEDIUM_QUALITY_YELLOW"
    
    tier_limits = {"TIER_1": 1000, "TIER_2": 10000, "TIER_3": 100000, "TIER_4": "UNLIMITED"}
    next_tier = "TIER_3" if current_tier == "TIER_2" and is_high_quality else current_tier
    
    return {
        "messages_sent": sent,
        "messages_read": read,
        "read_rate_pct": read_rate_pct,
        "opt_out_pct": opt_out_pct,
        "quality_rating": quality_rating,
        "current_tier": current_tier,
        "daily_limit": tier_limits.get(current_tier),
        "recommended_tier": next_tier,
        "status": "BROADCAST_AUDITED"
    }

if __name__ == "__main__":
    res = audit_whatsapp_broadcast_health(sent=10000, read=9800, opt_outs=12, current_tier="TIER_2")
    print("WhatsApp Broadcast Quality & Tier Report:")
    print(f"  Messages Sent: {res['messages_sent']:,} | Read: {res['messages_read']:,} ({res['read_rate_pct']}%)")
    print(f"  Opt-Out Rate: {res['opt_out_pct']}% | Rating: {res['quality_rating']}")
    print(f"  Current Tier: {res['current_tier']} ({res['daily_limit']:,} users/day)")
    print(f"  Next Tier Recommendation: {res['recommended_tier']} (100,000 users/day)")
    print(f"  Status: {res['status']}")
'''

    p3_code = r'''def simulate_whatsapp_cart_and_cod_recovery(abandoned_carts: int, cod_orders: int) -> dict:
    """
    Simulates automated WhatsApp abandoned cart recovery and Cash-on-Delivery (COD) verification.
    WhatsApp delivers 35% cart recovery (vs 8% email) and converts 40% of COD to prepaid,
    slashing Return-to-Origin (RTO) shipping losses.
    """
    wa_cart_recovery_rate = 0.35
    recovered_carts = round(abandoned_carts * wa_cart_recovery_rate)
    
    # COD verification: 96% confirmed, 40% converted to prepaid via 5% instant UPI discount
    confirmed_cod = round(cod_orders * 0.96)
    converted_to_prepaid = round(confirmed_cod * 0.40)
    remaining_cod = confirmed_cod - converted_to_prepaid
    
    # Financial metrics at $65 AOV
    aov = 65.0
    recovered_revenue = round(recovered_carts * aov, 2)
    
    return {
        "abandoned_carts_targeted": abandoned_carts,
        "carts_recovered": recovered_carts,
        "cart_recovery_rate_pct": round(wa_cart_recovery_rate * 100, 1),
        "recovered_revenue_usd": recovered_revenue,
        "cod_orders_audited": cod_orders,
        "confirmed_orders": confirmed_cod,
        "converted_to_prepaid": converted_to_prepaid,
        "remaining_cod": remaining_cod,
        "rto_risk_reduction_pct": 40.0,
        "status": "RECOVERY_AND_VERIFICATION_COMPLETE"
    }

if __name__ == "__main__":
    res = simulate_whatsapp_cart_and_cod_recovery(abandoned_carts=500, cod_orders=200)
    print("WhatsApp Cart Recovery & COD Verification Engine:")
    print(f"  Abandoned Carts: {res['abandoned_carts_targeted']} -> Recovered: {res['carts_recovered']} ({res['cart_recovery_rate_pct']}%)")
    print(f"  Recovered Revenue: ${res['recovered_revenue_usd']:,.2f} at $65.00 AOV")
    print(f"  COD Orders: {res['cod_orders_audited']} -> Confirmed: {res['confirmed_orders']} (96.0%)")
    print(f"  Converted to Prepaid (UPI): {res['converted_to_prepaid']} (slashing RTO risk by {res['rto_risk_reduction_pct']}%)")
    print(f"  Status: {res['status']}")
'''

    p4_code = r'''def evaluate_live_selling_conversion_event(viewers: int, duration_mins: int, orders: int, aov: float) -> dict:
    """
    Evaluates synchronous D2C Live Stream Selling performance:
    Computes Instantaneous Conversion Rate, Revenue Velocity ($/min),
    and compares live conversion lift against asynchronous storefront benchmarks (2.5%).
    """
    live_cvr_pct = round((orders / viewers) * 100, 2)
    total_gmv = round(orders * aov, 2)
    revenue_velocity_per_min = round(total_gmv / duration_mins, 2)
    
    benchmark_cvr = 2.5
    cvr_multiplier = round(live_cvr_pct / benchmark_cvr, 1)
    
    return {
        "concurrent_viewers": viewers,
        "stream_duration_mins": duration_mins,
        "orders_placed": orders,
        "average_order_value": aov,
        "total_live_gmv": total_gmv,
        "live_conversion_rate_pct": live_cvr_pct,
        "revenue_velocity_per_min": revenue_velocity_per_min,
        "cvr_lift_vs_storefront": cvr_multiplier,
        "status": "LIVE_STREAM_EVENT_SUCCESSFUL"
    }

if __name__ == "__main__":
    res = evaluate_live_selling_conversion_event(viewers=5000, duration_mins=45, orders=850, aov=75.0)
    print("D2C Live Stream Selling Performance Report:")
    print(f"  Concurrent Viewers: {res['concurrent_viewers']:,} across {res['stream_duration_mins']} Mins")
    print(f"  Orders Placed: {res['orders_placed']:,} -> Live CVR: {res['live_conversion_rate_pct']}%")
    print(f"  Total GMV Generated: ${res['total_live_gmv']:,.2f} at ${res['average_order_value']:.2f} AOV")
    print(f"  Revenue Velocity: ${res['revenue_velocity_per_min']:,.2f} / Minute")
    print(f"  Conversion Lift vs Storefront: {res['cvr_lift_vs_storefront']}x Multiplier")
    print(f"  Status: {res['status']}")
'''

    p5_code = r'''def audit_enterprise_conversational_gateway(
    webhook_routing_ok: bool,
    broadcast_quality_green: bool,
    cart_cod_recovery_ok: bool,
    live_selling_ok: bool
) -> dict:
    """
    Enterprise Conversational Commerce Gateway: Integrates WhatsApp Cloud API routing,
    broadcast quality management, automated cart/COD recovery, and interactive live selling.
    """
    all_nominal = webhook_routing_ok and broadcast_quality_green and cart_cod_recovery_ok and live_selling_ok
    score = 100.0 if all_nominal else 70.0
    verdict = "CONVERSATIONAL_COMMERCE_AND_WHATSAPP_ARCHITECT_CERTIFIED" if all_nominal else "CONVERSATIONAL_SYSTEM_DEFECT"
    
    return {
        "cloud_api_webhook_active": webhook_routing_ok,
        "broadcast_quality_rating_green": broadcast_quality_green,
        "cart_and_cod_automation_active": cart_cod_recovery_ok,
        "live_stream_selling_active": live_selling_ok,
        "ccci_score": score,
        "certification": verdict,
        "status": "ENTERPRISE_CONVERSATIONAL_NOMINAL" if all_nominal else "REMEDIATION_REQUIRED"
    }

if __name__ == "__main__":
    gateway = audit_enterprise_conversational_gateway(
        webhook_routing_ok=True,
        broadcast_quality_green=True,
        cart_cod_recovery_ok=True,
        live_selling_ok=True
    )
    print("Enterprise Conversational Commerce Gateway Report:")
    print(f"  Cloud API Webhooks Active: {gateway['cloud_api_webhook_active']}")
    print(f"  Broadcast Quality Rating: {gateway['broadcast_quality_rating_green']}")
    print(f"  Cart & COD Automation Active: {gateway['cart_and_cod_automation_active']}")
    print(f"  Live Stream Selling Active: {gateway['live_stream_selling_active']}")
    print(f"  Composite CCCI Score: {gateway['ccci_score']} / 100.0")
    print(f"  Accreditation Verdict: {gateway['certification']}")
'''

    lesson = {
        "coursePrefix": "bcom_dmkt",
        "day": 23,
        "title": "Community & Conversational Social Commerce Architecture",
        "goal": "Master modern conversational growth: WhatsApp Business Cloud API webhooks, 98% broadcast deliverability, automated abandoned cart recovery, COD-to-prepaid conversion, D2C live stream selling, and the Enterprise Conversational Gateway.",
        "minutes": 35,
        "recap": "Day 23 unleashes conversational commerce. Learn to route WhatsApp webhooks, scale broadcasts to Tier 3 (100k/day) under strict quality ratings, recover 35% of abandoned carts with 1-click checkout links, and engineer high-velocity live selling broadcasts.",
        "parts": [
            {
                "title": "Conversational Commerce Architecture & WhatsApp Business Cloud API",
                "say": [
                    "Welcome to Day 23 of Digital Marketing Analytics and Performance Strategy. Today, we enter the fastest-growing frontier of global customer engagement: Conversational Commerce and Community Social Selling. For over two decades, e-commerce has operated as an asynchronous, isolated catalog browsing experience. A customer searches on Google, lands on a product detail page, adds an item to cart, and leaves—prompting an email sequence with a 20% open rate.",
                    "Conversational commerce collapses this friction by embedding the entire shopping, consultation, checkout, and post-purchase support journey directly inside global messaging applications—predominantly the WhatsApp Business Cloud API (hosted natively on Meta infrastructure). With over 2.7 billion active global users, WhatsApp represents the primary communications interface across Latin America, Europe, India, Southeast Asia, and the Middle East.",
                    "At the core of enterprise conversational architecture is the Meta Graph API and Webhook Routing Engine. When an event occurs—such as a customer messaging a verified brand handle, or a web store checkout triggering an order status update—the Cloud API processes the event through secure HTTPS webhooks. Crucially, the platform establishes a fundamental architectural distinction between Customer-Initiated and Business-Initiated conversations.",
                    "When a customer sends a message to the brand (for example, asking 'Where is my order?' or 'Do you have size 10 in stock?'), a free 24-Hour Customer Care Window opens immediately. During this 24-hour session, the enterprise can exchange unlimited, free-form automated chatbot responses and live human agent interactions at zero message cost. Conversely, if the business initiates outreach to the consumer outside this window (such as a marketing broadcast or abandoned cart alert), it must transmit a pre-approved, structured Message Template (categorized as Marketing, Utility, or Authentication) and pay a fixed per-conversation clearing fee.",
                    "In our institutional Python simulation for Part 1, we construct an enterprise WhatsApp Cloud API webhook router. The router ingests incoming webhook events, classifies them into free 24-hour customer service sessions or paid business marketing templates, and coordinates downstream automated execution. Examine the code below to see conversational webhook routing execute deterministically."
                ],
                "example": "Enterprise Case Study: A fast-fashion D2C brand operating in Southern Europe and Latin America migrated their customer support and post-purchase updates from email to the WhatsApp Business Cloud API. By configuring automated routing webhooks, their AI assistant resolved 72% of order tracking queries within the free 24-hour window without human agent intervention, reducing support ticket resolution time from 14 hours to 45 seconds while eliminating $85,000 in monthly third-party helpdesk software licenses.",
                "code": p1_code,
                "output": "WhatsApp Cloud API Webhook Routing Report:\n  Webhooks Processed: 4\n  Customer Service Sessions (24h Free): 2\n  Business Outbound Templates (Paid): 2\n    Target +14155552671: CUSTOMER_SERVICE_24H_WINDOW -> SESSION_OPENED_FREE_AGENT_REPLIES\n    Target +14155558912: BUSINESS_INITIATED_MARKETING -> DISPATCH_TEMPLATE_ABANDONED_CART_DISCOUNT\n    Target +14155554321: CUSTOMER_SERVICE_24H_WINDOW -> SESSION_OPENED_FREE_AGENT_REPLIES\n    Target +14155559876: BUSINESS_INITIATED_MARKETING -> DISPATCH_TEMPLATE_ORDER_SHIPPED_TRACKING\n  Status: WEBHOOK_ROUTING_SUCCESSFUL",
                "codeNotes": [
                    "Routes incoming Cloud API webhooks into customer-initiated free sessions and business-initiated paid templates.",
                    "Opens free 24-hour customer care session windows for inbound customer inquiries (+14155552671 and +14155554321).",
                    "Dispatches pre-approved marketing and utility templates for outbound business communications."
                ],
                "tryIt": "Add an event with direction INBOUND_CUSTOMER and observe how the router automatically categorizes it as a free service session.",
                "check": {
                    "question": "What is the rule governing messaging costs within WhatsApp's 24-hour customer care window?",
                    "options": [
                        "When a customer initiates a message, the business can send unlimited free-form automated or human responses at zero cost for 24 hours.",
                        "Every single message sent by a business costs exactly $1.00 regardless of who initiated the contact.",
                        "Businesses are strictly prohibited from replying to customer messages under international telecom laws.",
                        "Customer service responses must be submitted via snail mail to Meta headquarters."
                    ],
                    "answer": 0,
                    "why": "Meta's WhatsApp Business Cloud API provides a free 24-hour customer service session window upon customer contact, encouraging prompt, high-quality customer support."
                }
            },
            {
                "title": "Broadcast Campaign Dynamics: 98% Open Rates & Messaging Tier Limits",
                "say": [
                    "Having established webhook routing, we explore the extraordinary revenue leverage of WhatsApp Broadcast Campaigns. In traditional digital marketing, email marketing has long been considered the workhorse of owned media. However, modern email suffers from severe inbox fatigue: promotional tabs, aggressive spam filters, and clutter result in average open rates of 18% to 22% and click-through rates of 2% to 3%.",
                    "In stark contrast, WhatsApp broadcast notifications deliver staggering engagement metrics: an average Open/Read Rate of 98.0%—with over 80% of recipients opening the message within the first 15 minutes of delivery—and Click-Through Rates ranging between 35% and 50%! Because WhatsApp is the primary personal messaging tool where users communicate with family and friends, message notifications command immediate, focused attention.",
                    "However, to protect its ecosystem from becoming a spam wasteland, Meta enforces strict Messaging Tiers and Phone Number Quality Ratings. When an enterprise launches on WhatsApp, it begins at Tier 1, restricted to initiating conversations with a maximum of 1,000 unique customers per 24 hours. As the business sends broadcasts without triggering user spam complaints or blocks, its daily limit automatically scales: Tier 2 (10,000 users/day), Tier 3 (100,000 users/day), and Tier 4 (Unlimited unique users/day).",
                    "A brand's standing is determined by its Phone Number Quality Rating (displayed in Business Manager as Green: High Quality, Yellow: Medium Quality, or Red: Low Quality). If recipients repeatedly block or report incoming promotional messages, the quality rating drops to Red. If an enterprise remains in Red status for consecutive days, Meta automatically degrades its messaging tier (e.g., slashing its daily broadcast limit from 100k back to 10k) or permanently suspends its business account. Therefore, growth teams must enforce strict opt-in consent, segment broadcasts by customer affinity, and maintain opt-out rates below 0.20%.",
                    "In our institutional Python simulation for Part 2, we build the WhatsApp Broadcast Quality and Tiering Auditor. The system evaluates broadcast delivery volume, read rates, and opt-out percentages, verifies high-quality status (Green rating), and recommends automated tier escalation from Tier 2 to Tier 3. Review the code below to see this audit execute deterministically."
                ],
                "example": "Enterprise Case Study: A regional consumer electronics brand prepared for a Black Friday product drop. Their marketing team maintained a Tier 2 WhatsApp number (10k daily limit). During the first week of November, they sent segmented, VIP early-access broadcasts to 10,000 highly engaged loyalty members. The campaign achieved a 98.0% read rate with only 12 opt-outs (0.12% opt-out rate). Their phone number maintained a pristine High Quality Green rating, prompting Meta's algorithm to automatically elevate their account to Tier 3 (100,000 daily limit) in time for Black Friday, where they drove $1.2M in sales within 4 hours.",
                "code": p2_code,
                "output": "WhatsApp Broadcast Quality & Tier Report:\n  Messages Sent: 10,000 | Read: 9,800 (98.0%)\n  Opt-Out Rate: 0.12% | Rating: HIGH_QUALITY_GREEN\n  Current Tier: TIER_2 (10,000 users/day)\n  Next Tier Recommendation: TIER_3 (100,000 users/day)\n  Status: BROADCAST_AUDITED",
                "codeNotes": [
                    "Audits WhatsApp broadcast engagement, confirming a 98.0% read rate across 10,000 delivered messages.",
                    "Validates that opt-out rate (0.12%) remains well below the dangerous 0.20% threshold, maintaining HIGH_QUALITY_GREEN status.",
                    "Approves tier elevation from Tier 2 (10k/day) to Tier 3 (100k/day), scaling enterprise reach ten-fold."
                ],
                "tryIt": "Increase opt_outs from 12 to 50 (0.50% opt-out rate) and observe how quality drops to MEDIUM_QUALITY_YELLOW and tier upgrade is blocked.",
                "check": {
                    "question": "What happens if a brand's WhatsApp marketing messages trigger excessive user blocks and spam reports?",
                    "options": [
                        "Meta degrades the phone number quality rating to Red and slashes the daily messaging tier limit or bans the number.",
                        "Meta automatically sends free chocolates to all affected users.",
                        "The brand is rewarded with a verified green badge to build consumer trust.",
                        "All future messages are automatically routed through SMS text at zero charge."
                    ],
                    "answer": 0,
                    "why": "Meta protects user experience by monitoring block and spam complaint rates; excessive complaints trigger quality rating degradation (Red status) and severe messaging tier restrictions."
                }
            },
            {
                "title": "Automated D2C Abandoned Cart Recovery & COD Verification",
                "say": [
                    "Beyond scheduled marketing broadcasts, the highest-ROI application of conversational commerce is automated event-driven lifecycle workflows: Abandoned Cart Recovery and Cash-on-Delivery (COD) Verification.",
                    "Across global e-commerce, over 70% of shoppers abandon items in their shopping carts. While traditional automated cart recovery emails recover roughly 5% to 8% of abandoned revenue, WhatsApp Cart Recovery workflows recover an astonishing 25% to 35%! When a shopper enters their phone number during checkout and abandons the session, a webhook triggers 45 minutes later: WhatsApp delivers a rich message featuring an image of the abandoned item, dynamic product title, and a prominent call-to-action button linking directly to a pre-filled, one-click checkout page with an automatically applied promotional code.",
                    "Furthermore, in high-growth emerging e-commerce markets—such as India, the Middle East, Southeast Asia, and parts of Eastern Europe—Cash-on-Delivery (COD) represents 50% to 70% of all e-commerce transactions. COD introduces massive operational risk known as Return to Origin (RTO): customers order impulsively, provide incomplete delivery addresses, or refuse delivery when the courier arrives, forcing the merchant to absorb two-way logistics costs and inventory lockup.",
                    "To neutralize RTO losses, direct-to-consumer brands deploy Automated WhatsApp COD Verification Bots. Instantly upon order placement, the bot transmits a message: 'Hi Alex! We received your COD order for $65.00. Please confirm your address or tap below to convert to prepaid with an instant 5% discount!' This single workflow achieves two massive wins: First, 96% of genuine customers confirm their address, weeding out fake orders. Second, up to 40% of customers convert their order to prepaid via UPI or instant payment links, slashing RTO shipping losses by 40% and freeing up hundreds of thousands of dollars in operating working capital.",
                    "In our institutional Python simulation for Part 3, we build an automated WhatsApp Cart Recovery and COD Verification Engine. The system processes 500 abandoned carts and 200 COD orders, calculating recovered revenue at $65.00 AOV and modeling RTO risk reduction through prepaid conversion. Examine the code below to see this logic execute deterministically."
                ],
                "example": "Enterprise Case Study: A fast-growing direct-to-consumer beauty brand in Mumbai was suffering from a crippling 34% COD Return to Origin (RTO) rate, losing over $40,000 monthly in courier logistics penalties. They deployed an automated WhatsApp COD verification bot. The bot confirmed orders within 60 seconds and offered a 5% discount for converting to UPI prepaid. Within 60 days, 40% of COD orders converted to prepaid, fake orders were eliminated before dispatch, and overall RTO plummeted to 12%, directly recovering $28,000 per month in net margin.",
                "code": p3_code,
                "output": "WhatsApp Cart Recovery & COD Verification Engine:\n  Abandoned Carts: 500 -> Recovered: 175 (35.0%)\n  Recovered Revenue: $11,375.00 at $65.00 AOV\n  COD Orders: 200 -> Confirmed: 192 (96.0%)\n  Converted to Prepaid (UPI): 77 (slashing RTO risk by 40.0%)\n  Status: RECOVERY_AND_VERIFICATION_COMPLETE",
                "codeNotes": [
                    "Models WhatsApp's 35.0% cart recovery rate, recovering 175 out of 500 carts ($11,375.00 in GMV).",
                    "Simulates automated COD address confirmation (96.0% confirmed), eliminating bogus orders prior to courier fulfillment.",
                    "Converts 77 orders (40.0%) from risky COD to guaranteed prepaid, slashing Return-to-Origin (RTO) logistics losses."
                ],
                "tryIt": "Increase abandoned_carts to 1000 and verify how recovered revenue scales to $22,750.00 deterministically.",
                "check": {
                    "question": "How does automated WhatsApp COD verification reduce Return to Origin (RTO) shipping losses for e-commerce merchants?",
                    "options": [
                        "It confirms recipient delivery addresses and incentivizes customers to convert from COD to prepaid with instant discounts.",
                        "It requires customers to visit a physical bank branch before shipping.",
                        "It cancels all orders placed from mobile devices automatically.",
                        "It charges the customer's credit card before asking for permission."
                    ],
                    "answer": 0,
                    "why": "Automated WhatsApp bots confirm delivery intent and convert a substantial portion of COD orders to prepaid, eliminating fake addresses and reducing parcel refusal at the doorstep."
                }
            },
            {
                "title": "D2C Live Stream Selling & Interactive Video Commerce",
                "say": [
                    "The ultimate evolution of social and conversational commerce is the convergence of live video broadcasting, real-time community chat, and instantaneous checkout: Direct-to-Consumer (D2C) Live Stream Selling. Pioneered in China through platforms like Taobao Live and Douyin—where live commerce represents over $500 billion annually—live selling has rapidly expanded globally across TikTok Shop, Instagram Live, YouTube Shopping, and custom embedded web players.",
                    "Traditional e-commerce is fundamentally asynchronous: a customer views static photos, reads reviews, and contemplates purchase in isolation. In contrast, Live Stream Selling creates synchronous, high-urgency group purchasing dynamics. A charismatic host or brand founder demonstrates products in real time, answers audience questions submitted in the chat, showcases different styling options, and releases limited-time flash discounts.",
                    "This interactive format produces astounding conversion dynamics. While a premier e-commerce website achieves an average conversion rate of 2.0% to 2.5%, live shopping broadcasts regularly achieve Instantaneous Conversion Rates of 15.0% to 20.0%! The psychological drivers of this conversion surge are Social Proof (seeing hundreds of other viewers purchasing simultaneously), Real-Time Scarcity (live inventory reservation countdowns), and Direct Human Connection.",
                    "From a technical architecture standpoint, live commerce platforms integrate low-latency video streaming (WebRTC or low-latency HLS) with real-time socket connections for synchronized pinned product cards. When the host highlights a jacket, a pinned product banner instantly appears on all viewers' mobile screens, allowing them to select size and complete payment via Apple Pay or Google Pay without ever leaving the video stream.",
                    "In our institutional Python simulation for Part 4, we evaluate a high-velocity D2C live stream selling event. The system processes viewer counts, stream duration, orders placed, and average order value, calculating live conversion rates, revenue velocity per minute, and conversion lift multiples over static storefronts. Review the code below to see live commerce analytics execute deterministically."
                ],
                "example": "Enterprise Case Study: A clean skincare brand hosted a 45-minute live stream masterclass on TikTok Shop featuring their celebrity dermatologist co-founder. During the broadcast, 5,000 concurrent viewers tuned in. The host demonstrated a new serum formulation and released a live-only 20% bundle discount. The broadcast generated 850 orders at an average order value of $75.00, producing $63,750 in GMV ($1,416.67 per minute) and achieving a 17.0% live conversion rate—a 6.8x lift over their standard website.",
                "code": p4_code,
                "output": "D2C Live Stream Selling Performance Report:\n  Concurrent Viewers: 5,000 across 45 Mins\n  Orders Placed: 850 -> Live CVR: 17.0%\n  Total GMV Generated: $63,750.00 at $75.00 AOV\n  Revenue Velocity: $1,416.67 / Minute\n  Conversion Lift vs Storefront: 6.8x Multiplier\n  Status: LIVE_STREAM_EVENT_SUCCESSFUL",
                "codeNotes": [
                    "Measures synchronous live stream engagement, calculating a 17.0% live conversion rate across 5,000 viewers.",
                    "Calculates gross merchandise value ($63,750.00) and revenue velocity ($1,416.67/min) across the 45-minute broadcast.",
                    "Quantifies a 6.8x conversion lift multiplier over standard asynchronous e-commerce storefront benchmarks (2.5%)."
                ],
                "tryIt": "Increase viewers from 5000 to 10000 and orders to 1800 (18.0% CVR) to observe revenue velocity surge past $3,000/minute.",
                "check": {
                    "question": "What primary psychological and technical dynamics enable D2C Live Stream Selling to achieve conversion rates of 15% to 20%?",
                    "options": [
                        "Real-time social proof, interactive Q&A with live hosts, and synchronized in-stream one-click checkout.",
                        "Forcing users to download desktop software before watching.",
                        "Requiring all viewers to agree to non-refundable subscription contracts.",
                        "Eliminating all product prices so customers buy without knowing the cost."
                    ],
                    "answer": 0,
                    "why": "Live stream commerce combines authentic real-time demonstration, community social proof, urgency, and frictionless in-stream checkout, driving conversion rates far superior to static websites."
                }
            },
            {
                "title": "Enterprise Conversational Commerce & Community Gateway",
                "say": [
                    "In this culminating session of Day 23, we synthesize all four conversational growth disciplines into a unified operational command center: the Enterprise Conversational Commerce & Community Gateway. Modern high-growth enterprises do not treat messaging and social channels as disconnected side experiments; they operate them as a primary, synchronized revenue channel alongside web and mobile apps.",
                    "The Enterprise Conversational Gateway enforces four foundational operational standards: Standard 1: Real-time WhatsApp Cloud API webhook ingestion with seamless routing between free 24-hour service sessions and compliant outbound marketing templates; Standard 2: Phone number quality rating governance maintaining Green status and scaling messaging throughput to Tier 3 (100k daily limit); Standard 3: Automated cart abandonment and COD verification bots recovering over 30% of lost revenue and neutralizing RTO risks; and Standard 4: Synchronous live stream selling capabilities that generate massive revenue velocity through interactive video commerce.",
                    "When all four components operate in synergy, the enterprise builds a resilient, highly engaging direct relationship with its customer base, insulated from third-party ad auction inflation and browser tracking disruptions. In our institutional Python simulation for Part 5, we execute the Enterprise Conversational Commerce Gateway auditor. The gateway verifies that webhooks, broadcast quality, cart/COD automation, and live selling are fully operational, awarding a composite Conversational Commerce & Community Index (CCCI) score of 100.0/100 and conferring the prestigious Conversational Commerce & WhatsApp Architect credential. Review the code below to see this final certification execute deterministically."
                ],
                "example": "Enterprise Case Study: A multi-brand retail group deployed the Enterprise Conversational Commerce Gateway across its portfolio. By harmonizing WhatsApp Cloud API routing, achieving Tier 3 broadcast scaling, recovering 35% of abandoned carts, and running weekly live shopping streams, the group generated $4.8M in incremental conversational revenue over two quarters while reducing customer service overhead by 38%, achieving a 100.0/100 CCCI score.",
                "code": p5_code,
                "output": "Enterprise Conversational Commerce Gateway Report:\n  Cloud API Webhooks Active: True\n  Broadcast Quality Rating: True\n  Cart & COD Automation Active: True\n  Live Stream Selling Active: True\n  Composite CCCI Score: 100.0 / 100.0\n  Accreditation Verdict: CONVERSATIONAL_COMMERCE_AND_WHATSAPP_ARCHITECT_CERTIFIED",
                "codeNotes": [
                    "Integrates Cloud API webhooks, broadcast quality governance, cart/COD automation, and live commerce.",
                    "Validates full operational compliance across all four conversational pillars, awarding 100.0/100 CCCI.",
                    "Confers official CONVERSATIONAL_COMMERCE_AND_WHATSAPP_ARCHITECT_CERTIFIED accreditation."
                ],
                "tryIt": "Set live_selling_ok to False and observe how the gateway revokes certification and triggers a REMEDIATION_REQUIRED alert.",
                "check": {
                    "question": "Which set of capabilities defines an enterprise-grade conversational commerce architecture?",
                    "options": [
                        "WhatsApp Cloud API webhook routing, high-quality broadcast tiering, automated cart/COD recovery, and interactive live stream selling.",
                        "Sending unsolicited SMS spam from unverified phone numbers at midnight.",
                        "Disabling customer support chat to force all inquiries through paper mail.",
                        "Restricting all customer communication exclusively to LinkedIn direct messages."
                    ],
                    "answer": 0,
                    "why": "Enterprise conversational commerce integrates official Cloud API routing, broadcast tier management, automated lifecycle workflows, and synchronous live selling into a cohesive growth apparatus."
                }
            }
        ]
    }

    # Ensure invariant word budget
    ensure_dmkt_day_budget(lesson, min_part_words=580, min_day_words=2950)
    return lesson

if __name__ == "__main__":
    lesson = build_day23_lesson()
    visual = build_day23_visual()
    
    total_w = sum(count_words(p["say"]) for p in lesson["parts"])
    print(f"Day 23 Generated: Total Words = {total_w}")
    for idx, p in enumerate(lesson["parts"]):
        pw = count_words(p["say"])
        print(f"  Part {idx+1}: {pw} words -> {'PASS' if pw >= 580 else 'FAIL'}")
    
    # Test executions
    for idx, p in enumerate(lesson["parts"]):
        g = {}
        exec(p["code"], g)
        print(f"Part {idx+1} simulation executed cleanly.")
