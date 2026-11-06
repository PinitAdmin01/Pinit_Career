"""
Day 13 Builder: Marketing Automation & Drip Sequences: Cart Abandonment Workflows
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Task: TASK-833
"""

import os
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words
from digital_marketing_budget_ensurer import ensure_dmkt_day_budget

def build_day13():
    parts = []

    # Part 1: Event-Driven Lifecycle Architecture & Drip Timing Physics
    p1_say = [
        "Welcome to Day 13 of Digital Marketing and Growth Hacking. Today, we delve into the revenue-generating engine of owned digital media: Event-Driven Marketing Automation and Automated Lifecycle Drip Sequences. While broadcast newsletters provide episodic revenue spikes, automated lifecycle sequences operate 24 hours a day, 365 days a year—triggered dynamically by individual consumer behavioral micro-actions. In high-performing digital enterprises, automated drip sequences typically account for only 5% of total outbound email volume, yet generate between 40% and 55% of total email-attributed gross revenue.",
        
        "The architectural foundation of modern marketing automation is the Event-Driven State Machine. Rather than sending static scheduled batch blasts, modern Customer Data Platforms (such as Segment, mParticle) and Email Service Providers (such as Klaviyo, Braze) listen to real-time webhook event streams. When a user executes a specific event—such as `checkout_started`, `product_viewed`, or `subscription_canceled`—the event payload is ingested within milliseconds, transitioning the customer profile into an automated workflow state machine.",
        
        "Drip sequence effectiveness is governed by the Physics of Delay and Urgency. When an abandonment or trigger event occurs, customer purchase intent decays along an exponential half-life curve. If an automated recovery message is sent too early (e.g., within 2 minutes of abandonment), it feels intrusive, creepy, and may interrupt a user who simply switched browser tabs to retrieve their credit card. Conversely, if the recovery email is delayed past 24 hours, the emotional buying impulse has cooled, or the consumer has already completed the purchase on a competing website.",
        
        "Furthermore, enterprise automation workflows utilize Exit Conditions and Branching Logic. An essential architectural invariant is the suppression exit condition: if a customer completes a purchase (`order_placed`) at any point during a multi-step cart recovery drip, they must be instantly and atomically ejected from the abandonment flow. Failing to implement immediate exit suppression results in sending embarrassing discount codes to customers who already paid full price five minutes earlier, eroding brand credibility and cannibalizing gross margins.",
        
        "In our Python simulation for Part 1, we build an Event-Driven Customer State Machine and Lifecycle Workflow Orchestrator. The engine ingests user event payloads, transitions customer states, evaluates timing delays, and enforces atomic purchase exit conditions. Examine the code below to see state machine automation in action."
    ]

    p1_code = r'''def process_lifecycle_event_state_machine(
    customer_state: dict,
    inbound_event: dict
) -> dict:
    """
    Event-driven lifecycle state machine orchestrator.
    Transitions customer state, schedules drip milestones, and enforces exit conditions.
    """
    user_id = customer_state["user_id"]
    current_flow = customer_state.get("active_flow", "IDLE")
    current_step = customer_state.get("current_step", 0)
    
    event_type = inbound_event["event_type"]
    event_timestamp_sec = inbound_event["timestamp_sec"]
    
    # Invariant Rule 1: Instant Exit Condition on Order Placed
    if event_type == "ORDER_COMPLETED":
        return {
            "user_id": user_id,
            "previous_flow": current_flow,
            "active_flow": "POST_PURCHASE_ONBOARDING",
            "current_step": 1,
            "status": "EXIT_CONDITION_TRIGGERED_SWITCH_TO_POST_PURCHASE",
            "scheduled_action": "SEND_TRANSACTIONAL_RECEIPT_AND_VIP_THANK_YOU"
        }
        
    # Invariant Rule 2: Cart Abandonment Flow Initialization
    if event_type == "CHECKOUT_STARTED" and current_flow == "IDLE":
        cart_value = inbound_event.get("cart_value_usd", 0.0)
        return {
            "user_id": user_id,
            "active_flow": "CART_ABANDONMENT_RECOVERY",
            "current_step": 1,
            "cart_value_usd": cart_value,
            "status": "FLOW_INITIALIZED",
            "scheduled_action": "SCHEDULE_STEP_1_EMAIL_DELAY_60_MINUTES"
        }
        
    # Invariant Rule 3: Drip Progression (Step 1 -> Step 2 after 24h)
    if event_type == "EMAIL_DELIVERED_NO_PURCHASE" and current_flow == "CART_ABANDONMENT_RECOVERY":
        next_step = current_step + 1
        if next_step == 2:
            action = "SCHEDULE_STEP_2_SOCIAL_PROOF_DELAY_24_HOURS"
        elif next_step == 3:
            action = "SCHEDULE_STEP_3_DISCOUNT_INCENTIVE_DELAY_48_HOURS"
        else:
            action = "COMPLETE_FLOW_MOVE_TO_SUNSET_OR_REENGAGEMENT"
            
        return {
            "user_id": user_id,
            "active_flow": current_flow,
            "current_step": next_step,
            "status": "PROGRESSING_DRIP_WORKFLOW",
            "scheduled_action": action
        }
        
    return {
        "user_id": user_id,
        "active_flow": current_flow,
        "current_step": current_step,
        "status": "NO_STATE_CHANGE_EVENT_IGNORED",
        "scheduled_action": "NONE"
    }

if __name__ == "__main__":
    initial_user = {"user_id": "USR_9921", "active_flow": "IDLE", "current_step": 0}
    
    # Event 1: Abandoned Cart ($150 value)
    evt1 = {"event_type": "CHECKOUT_STARTED", "cart_value_usd": 150.0, "timestamp_sec": 1700000000}
    state1 = process_lifecycle_event_state_machine(initial_user, evt1)
    
    # Event 2: 1 hour passed, step 1 sent, still no purchase
    evt2 = {"event_type": "EMAIL_DELIVERED_NO_PURCHASE", "timestamp_sec": 1700003600}
    state2 = process_lifecycle_event_state_machine(state1, evt2)
    
    # Event 3: User finally completes checkout! (Triggers Instant Exit)
    evt3 = {"event_type": "ORDER_COMPLETED", "timestamp_sec": 1700020000}
    state3 = process_lifecycle_event_state_machine(state2, evt3)
    
    print("=== EVENT-DRIVEN LIFECYCLE STATE MACHINE ===")
    print(f"Step 1: Flow: {state1['active_flow']} | Action: {state1['scheduled_action']}")
    print(f"Step 2: Flow: {state2['active_flow']} (Step {state2['current_step']}) | Action: {state2['scheduled_action']}")
    print(f"Step 3: Previous: {state3['previous_flow']} -> Active: {state3['active_flow']} | Status: {state3['status']}")
'''

    p1_output = """=== EVENT-DRIVEN LIFECYCLE STATE MACHINE ===
Step 1: Flow: CART_ABANDONMENT_RECOVERY | Action: SCHEDULE_STEP_1_EMAIL_DELAY_60_MINUTES
Step 2: Flow: CART_ABANDONMENT_RECOVERY (Step 2) | Action: SCHEDULE_STEP_2_SOCIAL_PROOF_DELAY_24_HOURS
Step 3: Previous: CART_ABANDONMENT_RECOVERY -> Active: POST_PURCHASE_ONBOARDING | Status: EXIT_CONDITION_TRIGGERED_SWITCH_TO_POST_PURCHASE"""

    parts.append({
        "title": "Event-Driven Lifecycle Architecture: Webhook Triggers, Customer State Machines & Drip Timing Physics",
        "say": p1_say,
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            "Maintains dynamic customer flow state machines triggered by real-time webhook events.",
            "Implements optimal time delays: Step 1 at 60 minutes, Step 2 at 24 hours.",
            "Enforces atomic exit conditions upon ORDER_COMPLETED, switching immediately to post-purchase onboarding."
        ],
        "check": {
            "question": "What critical flaw occurs if a marketing automation flow lacks an atomic purchase exit condition?",
            "options": [
                "Customers who already completed a purchase receive subsequent abandonment reminders offering discounts, cannibalizing margin and irritating buyers",
                "The email server hard drives fill up with duplicate PDF receipts",
                "The web server automatically issues refunds to all previous buyers",
                "The customer's email address is blocked by their Internet Service Provider"
            ],
            "why": "Without an atomic exit condition, a customer who bought at minute 65 will still receive the 24-hour and 48-hour abandonment discount emails, causing customer service friction and brand cheapening."
        },
        "example": "An apparel brand without exit suppression accidentally sent a 'Take 15% off your abandoned cart' email to 3,200 customers who had paid full price an hour earlier. Over 800 customers called support demanding price adjustments, costing $28,000 in customer support overhead.",
        "tryIt": "Inspect your marketing automation flow. Verify that 'Placed Order' is declared as an absolute flow exit filter across all pre-purchase nurture drips."
    })

    # Part 2: High-Yield Cart Abandonment Sequences: 1h, 24h & 48h
    p2_say = [
        "Across all digital commerce lifecycle workflows, the Cart Abandonment Sequence is undisputed king of revenue recovery. Industry benchmarks indicate that approximately 70% of digital shopping carts are abandoned prior to transaction completion. Without automated intervention, that prospective revenue evaporates permanently. However, by deploying an engineered 3-part Cart Abandonment Drip Architecture, enterprise brands reliably recover between 10% and 18% of abandoned carts.",
        
        "The canonical 3-Step Abandonment Architecture is structured across three precise temporal milestones: 1 Hour, 24 Hours, and 48 Hours. Message 1 (Send Delay: 60 Minutes) is the 'Helpful Service & Scarcity Reminder'. It adopts a low-pressure, customer service tone ('Did you leave something behind?'). Crucially, this message must display dynamic product images, exact cart contents, and an express checkout button that deep-links directly into the pre-filled checkout session. No discounts should be offered in Message 1, as up to 60% of recoverable buyers simply need a gentle reminder.",
        
        "Message 2 (Send Delay: 24 Hours) introduces 'Social Proof & Risk Reversal'. Sent exactly one day later when the consumer is likely back in their daily routine, Message 2 addresses underlying purchase hesitation. It highlights 5-star customer reviews, verified user testimonials, money-back guarantees, hassle-free returns, and press endorsements. By addressing cognitive objections (quality doubts, sizing concerns), Message 2 converts hesitant prospects without compromising margin.",
        
        "Message 3 (Send Delay: 48 Hours) provides the 'Final Escalation & Expiring Incentive'. Only after 48 hours have elapsed without a conversion does the brand introduce a margin-diluting discount—typically a 10% to 15% coupon or free express shipping voucher. To prevent coupon poaching and procrastination, Message 3 must incorporate dynamic countdown timers and explicit expiration deadlines ('Your 10% voucher expires in 24 hours').",
        
        "In our Python simulation for Part 2, we build a 3-Stage Cart Abandonment Financial Recovery Simulator. The script models attrition curves, recovery percentages, average order values (AOV), and net recovered margin across each drip milestone. Inspect the code below to see abandonment recovery economics."
    ]

    p2_code = r'''def simulate_cart_abandonment_drip_recovery(
    monthly_abandoned_carts: int,
    average_cart_value_usd: float,
    gross_margin_pct: float
) -> dict:
    """
    Simulates financial recovery across the canonical 3-stage cart abandonment drip:
    Message 1 (1h - Service Reminder), Message 2 (24h - Social Proof), Message 3 (48h - 10% Incentive).
    """
    total_pipeline_value = monthly_abandoned_carts * average_cart_value_usd
    
    # 1. Message 1: 1h Service Reminder (Recovers 7.5% of carts, 0% discount)
    m1_recovery_rate = 0.075
    m1_recovered_carts = round(monthly_abandoned_carts * m1_recovery_rate)
    m1_revenue = m1_recovered_carts * average_cart_value_usd
    m1_margin = m1_revenue * (gross_margin_pct / 100.0)
    
    # 2. Message 2: 24h Social Proof & Risk Reversal (Recovers 3.5% of remaining, 0% discount)
    remaining_after_m1 = monthly_abandoned_carts - m1_recovered_carts
    m2_recovery_rate = 0.035
    m2_recovered_carts = round(remaining_after_m1 * m2_recovery_rate)
    m2_revenue = m2_recovered_carts * average_cart_value_usd
    m2_margin = m2_revenue * (gross_margin_pct / 100.0)
    
    # 3. Message 3: 48h 10% Expiring Voucher (Recovers 2.5% of remaining, 10% discount)
    remaining_after_m2 = remaining_after_m1 - m2_recovered_carts
    m3_recovery_rate = 0.025
    m3_recovered_carts = round(remaining_after_m2 * m3_recovery_rate)
    m3_revenue = m3_recovered_carts * (average_cart_value_usd * 0.90)
    m3_margin = m3_recovered_carts * ((average_cart_value_usd * 0.90) - (average_cart_value_usd * (1.0 - gross_margin_pct / 100.0)))
    
    # Consolidated Results
    total_recovered_carts = m1_recovered_carts + m2_recovered_carts + m3_recovered_carts
    total_recovered_revenue = round(m1_revenue + m2_revenue + m3_revenue, 2)
    total_net_recovered_margin = round(m1_margin + m2_margin + m3_margin, 2)
    blended_recovery_rate = round((total_recovered_carts / monthly_abandoned_carts) * 100.0, 2)
    
    return {
        "monthly_abandoned_carts": monthly_abandoned_carts,
        "total_abandoned_pipeline_usd": total_pipeline_value,
        "total_recovered_carts": total_recovered_carts,
        "blended_recovery_rate_pct": blended_recovery_rate,
        "total_recovered_revenue_usd": total_recovered_revenue,
        "total_net_recovered_margin_usd": total_net_recovered_margin,
        "stage_breakdown": [
            {"stage": "1h_Service_Reminder", "carts": m1_recovered_carts, "revenue_usd": m1_revenue, "discount_pct": 0},
            {"stage": "24h_Social_Proof", "carts": m2_recovered_carts, "revenue_usd": m2_revenue, "discount_pct": 0},
            {"stage": "48h_Expiring_Incentive", "carts": m3_recovered_carts, "revenue_usd": m3_revenue, "discount_pct": 10}
        ],
        "status": "ABANDONMENT_SIMULATION_COMPLETED"
    }

if __name__ == "__main__":
    sim = simulate_cart_abandonment_drip_recovery(
        monthly_abandoned_carts=10000,
        average_cart_value_usd=150.0,
        gross_margin_pct=60.0
    )
    
    print("=== 3-STAGE CART ABANDONMENT DRIP RECOVERY SIMULATION ===")
    print(f"Total Abandoned Pipeline: ${sim['total_abandoned_pipeline_usd']:,.2f} across {sim['monthly_abandoned_carts']:,} carts")
    print(f"Total Recovered Carts: {sim['total_recovered_carts']:,} ({sim['blended_recovery_rate_pct']}% Blended Recovery Rate)")
    print(f"Recovered Gross Revenue: ${sim['total_recovered_revenue_usd']:,.2f}")
    print(f"Net Recovered Margin: ${sim['total_net_recovered_margin_usd']:,.2f}")
    print("\n--- Milestone Breakdown ---")
    for s in sim["stage_breakdown"]:
        print(f"[{s['stage']}] Recovered: {s['carts']:,} carts | Revenue: ${s['revenue_usd']:,.2f} (Discount: {s['discount_pct']}%)")
'''

    p2_output = """=== 3-STAGE CART ABANDONMENT DRIP RECOVERY SIMULATION ===
Total Abandoned Pipeline: $1,500,000.00 across 10,000 carts
Total Recovered Carts: 1,297 (12.97% Blended Recovery Rate)
Recovered Gross Revenue: $191,205.00
Net Recovered Margin: $113,385.00

--- Milestone Breakdown ---
[1h_Service_Reminder] Recovered: 750 carts | Revenue: $112,500.00 (Discount: 0%)
[24h_Social_Proof] Recovered: 324 carts | Revenue: $48,600.00 (Discount: 0%)
[48h_Expiring_Incentive] Recovered: 223 carts | Revenue: $30,105.00 (Discount: 10%)"""

    parts.append({
        "title": "High-Yield Cart Abandonment Sequences: 1h Urgency, 24h Social Proof & 48h Incentive Optimization",
        "say": p2_say,
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            "Models a 3-step sequence recovering 1,297 carts (12.97% recovery rate) from 10,000 abandoned sessions.",
            "Recovers 84% of revenue without offering any discount in Messages 1 and 2.",
            "Generates $191,205.00 in gross recovered revenue and $113,385.00 in net profit margin."
        ],
        "check": {
            "question": "Why should digital retailers refrain from offering a discount voucher in the very first cart abandonment email sent at 1 hour?",
            "options": [
                "Because over 60% of recoverable buyers convert with a simple service reminder; offering an immediate discount conditions shoppers to abandon carts intentionally and needlessly destroys gross margin",
                "Because email protocols prohibit numbers and percentage symbols in the first email",
                "Because discounts are legally restricted to users who have been abandoned for at least 7 days",
                "Because credit card processors charge double transaction fees on discounted carts"
            ],
            "why": "Offering discounts immediately trains consumers to always abandon carts to wait for a promo code. Withholding discounts until 48 hours captures full-price margin from high-intent buyers first."
        },
        "example": "A consumer electronics brand removed the 15% discount code from their 1-hour cart reminder, replacing it with an inventory scarcity notice. Recovery rate remained constant at 8.2%, but gross margin expanded by $42,000 monthly.",
        "tryIt": "Split-test your 1-hour cart abandonment email: test a simple customer service reminder against a discounted offer. Measure the net profit margin difference."
    })

    # Part 3: Post-Purchase Onboarding & Replenishment Reminders
    p3_say = [
        "While acquisition and abandonment flows capture new transactions, enterprise enterprise valuation is anchored in customer lifetime value (LTV). Acquiring a new customer costs 5 to 7 times more than retaining an existing one. Therefore, the post-purchase lifecycle journey is the primary engine of long-term commercial profitability. Once a customer executes their initial order, marketing automation shifts from sales friction removal to post-purchase onboarding, product education, and predictable replenishment.",
        
        "The first post-purchase milestone is Buyer's Remorse Mitigation. Immediately following transaction confirmation, customers experience a psychological vulnerability window known as cognitive dissonance. If the brand goes completely silent until delivery, return rates spike. High-converting post-purchase flows immediately dispatch a warm, founder-led welcome message setting clear shipping expectations, followed by a product usage guide ('How to get the most out of your purchase on Day 1') before the package arrives.",
        
        "The second milestone is Automated Replenishment & Reorder Reminders. For consumable product categories (such as supplements, cosmetics, pet food, or coffee), consumer usage follows predictable mathematical cycles. If a standard product package contains a 30-day supply, automated algorithms compute the expected depletion date. A dynamic replenishment reminder is scheduled to arrive at Day 23—exactly 7 days prior to run-out—allowing standard shipping time for the reorder to arrive before the customer experiences product stockout.",
        
        "Furthermore, post-purchase automation deploys Cross-Sell & Upsell Recommendation Logic. Using collaborative filtering and market basket analysis, the automation engine identifies complementary product pairings (e.g., recommending a specialized brush to a customer who bought facial cleanser). By suppressing products the customer already owns and offering 1-click frictionless order additions, cross-sell drips expand average customer LTV by 25% to 35%.",
        
        "In our Python simulation for Part 3, we build a Predictive Replenishment and Cross-Sell Recommendation Engine. The script calculates product consumption velocity, schedules optimal reorder send dates, and generates personalized cross-sell recommendations. Inspect the code below to see replenishment modeling."
    ]

    p3_code = r'''def schedule_predictive_replenishment_flow(
    order_data: dict,
    catalog_matrix: dict
) -> dict:
    """
    Schedules predictive replenishment and cross-sell recommendations
    based on product consumption velocity and collaborative filtering.
    """
    purchased_sku = order_data["sku"]
    purchase_timestamp_day = order_data["purchase_day"]
    days_supply = catalog_matrix[purchased_sku]["supply_duration_days"]
    shipping_lead_time_days = 5
    
    # Replenishment timing: (Days Supply - Lead Time - 2 days buffer)
    replenishment_trigger_day = purchase_timestamp_day + (days_supply - shipping_lead_time_days - 2)
    
    # Collaborative filtering cross-sell recommendation
    recommended_cross_sell_sku = catalog_matrix[purchased_sku]["top_cross_sell_sku"]
    cross_sell_trigger_day = purchase_timestamp_day + 14 # Sent 14 days post-purchase after initial satisfaction
    
    return {
        "customer_id": order_data["customer_id"],
        "purchased_sku": purchased_sku,
        "product_name": catalog_matrix[purchased_sku]["name"],
        "supply_duration_days": days_supply,
        "replenishment_scheduled_day": replenishment_trigger_day,
        "replenishment_status": "REPLENISHMENT_REMINDER_SCHEDULED",
        "cross_sell_scheduled_day": cross_sell_trigger_day,
        "cross_sell_sku": recommended_cross_sell_sku,
        "cross_sell_name": catalog_matrix[recommended_cross_sell_sku]["name"],
        "expected_ltv_expansion_pct": 28.5
    }

if __name__ == "__main__":
    catalog = {
        "SKU_COLLAGEN_30D": {
            "name": "Hydrolyzed Collagen Peptides (30-Day Tub)",
            "supply_duration_days": 30,
            "top_cross_sell_sku": "SKU_VITAMIN_C_DROPS"
        },
        "SKU_VITAMIN_C_DROPS": {
            "name": "Liposomal Vitamin C Booster Drops",
            "supply_duration_days": 45,
            "top_cross_sell_sku": "SKU_COLLAGEN_30D"
        }
    }
    
    order = {
        "customer_id": "CUST_5810",
        "sku": "SKU_COLLAGEN_30D",
        "purchase_day": 100
    }
    
    schedule = schedule_predictive_replenishment_flow(order, catalog)
    print("=== PREDICTIVE REPLENISHMENT & CROSS-SELL SCHEDULER ===")
    print(f"Customer: {schedule['customer_id']} | Purchased: {schedule['product_name']}")
    print(f"Supply Duration: {schedule['supply_duration_days']} Days")
    print(f"Replenishment Email Trigger: Day {schedule['replenishment_scheduled_day']} (7 Days Prior to Run-Out)")
    print(f"Cross-Sell Email Trigger: Day {schedule['cross_sell_scheduled_day']} -> Recommended: {schedule['cross_sell_name']}")
    print(f"Projected LTV Expansion: +{schedule['expected_ltv_expansion_pct']}%")
'''

    p3_output = """=== PREDICTIVE REPLENISHMENT & CROSS-SELL SCHEDULER ===
Customer: CUST_5810 | Purchased: Hydrolyzed Collagen Peptides (30-Day Tub)
Supply Duration: 30 Days
Replenishment Email Trigger: Day 123 (7 Days Prior to Run-Out)
Cross-Sell Email Trigger: Day 114 -> Recommended: Liposomal Vitamin C Booster Drops
Projected LTV Expansion: +28.5%"""

    parts.append({
        "title": "Post-Purchase Onboarding, Replenishment Reminders & Cross-Sell Recommendation Drips",
        "say": p3_say,
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            "Calculates exact depletion velocity for a 30-day consumable product.",
            "Triggers automated replenishment reminder at Day 123 (7 days before run-out) factoring shipping lead times.",
            "Schedules cross-sell drip at Day 114 to recommend complementary synergistic products."
        ],
        "check": {
            "question": "Why is sending a replenishment reminder 7 days before product depletion more effective than waiting until the day the customer runs out?",
            "options": [
                "Because shipping takes several days; sending the reminder early ensures the replacement arrives before the customer experiences a break in usage and switches to a local retail competitor",
                "Because email delivery takes 48 hours to cross international time zones",
                "Because credit card transactions must clear 7 days in advance",
                "Because warehouse robots only pack replenishment boxes on weekends"
            ],
            "why": "If a customer runs out of coffee or skincare, they will walk into a brick-and-mortar grocery store that afternoon. Triggering the replenishment reminder before depletion protects the repeat purchase habit."
        },
        "example": "A direct-to-consumer specialty coffee brand automated 23-day replenishment drips for 30-day bags. Repeat purchase rates jumped by 34%, and subscriber churn dropped by 22% over 6 months.",
        "tryIt": "Map the consumption lifecycle of your top product. Calculate the exact day a reorder reminder should trigger factoring in shipping transit times."
    })

    # Part 4: Win-Back Campaigns & Disengagement Mitigation
    p4_say = [
        "Inevitably, a portion of previously active customers will stop purchasing. In customer analytics, this is quantified by the Inter-Purchase Time Interval. If a customer typically purchases every 45 days, but has not purchased in 90 days, their probability of churn increases exponentially. To reclaim these valuable historical relationships before they become permanently lost, lifecycle teams deploy automated Customer Win-Back Campaigns.",
        
        "An effective win-back sequence operates across a calibrated 3-step escalation structure: Step 1 (Day 60-90 of inactivity): 'We miss you / What's new' highlighting newly released product features and brand updates without discounting. Step 2 (Day 90-120): 'Customer feedback survey' asking why they stopped buying (product defect, price, life change), often offering a small incentive for survey completion. Step 3 (Day 120-150): 'Aggressive win-back incentive' (e.g., $20 off their next order over $50) with an explicit 7-day expiration deadline.",
        
        "Crucially, win-back flows must interface seamlessly with the domain's Deliverability Sunset Policy. If a customer fails to engage with all three win-back emails, they must not be kept on the broadcast newsletter list indefinitely. Once a subscriber crosses 180 days of total email inactivity without opening, sending further marketing emails degrades domain reputation. The automated lifecycle engine gracefully offboards the subscriber into an inactive archive, reserving future re-engagement attempts strictly for paid retargeting ads or direct mail.",
        
        "Furthermore, win-back economics must be evaluated against the Maximum Allowable Win-Back Cost (MAWC). Because winning back a lapsed customer avoids the heavy top-of-funnel customer acquisition costs associated with cold prospects, brands can justify allocating up to 40% of expected annual customer gross profit toward win-back discounts and incentives while remaining highly value-accretive.",
        
        "In our Python simulation for Part 4, we build an Automated Lapsed Customer Win-Back and Sunset Offboarding Engine. The script evaluates customer recency intervals, triggers tiered win-back actions, and executes automated sunset archiving for unrecoverable contacts. Examine the code below to see win-back automation."
    ]

    p4_code = r'''def execute_customer_winback_engine(
    lapsed_customer: dict,
    normal_purchase_cycle_days: int = 45
) -> dict:
    """
    Automated Win-Back Escalation and Sunset Offboarding Engine.
    Evaluates purchase recency, routes through 3-tier win-back sequence,
    and enforces deliverability sunset policies.
    """
    c_id = lapsed_customer["customer_id"]
    days_since_last_order = lapsed_customer["days_since_last_order"]
    historical_clv = lapsed_customer["historical_clv_usd"]
    emails_opened_last_90d = lapsed_customer["emails_opened_last_90d"]
    
    # Recency Multiplier (How many normal cycles overdue)
    cycle_multiple = round(days_since_last_order / normal_purchase_cycle_days, 1)
    
    # Tier 1: Mild Lapsed (2x cycle -> Product Update / We Miss You)
    if days_since_last_order <= 90:
        tier = "TIER_1_MILD_LAPSE"
        action = "DISPATCH_NEW_ARRIVALS_AND_MISS_YOU_MESSAGE"
        incentive_offered = "NONE_VALUE_PROPOSITION_ONLY"
    # Tier 2: Moderate Lapsed (2x to 3x cycle -> Feedback Survey)
    elif days_since_last_order <= 135:
        tier = "TIER_2_MODERATE_LAPSE"
        action = "DISPATCH_FEEDBACK_SURVEY_AND_10_PCT_VOUCHER"
        incentive_offered = "10_PERCENT_OFF_NEXT_ORDER"
    # Tier 3: Severe Lapsed (3x to 4x cycle -> High Value Win-Back)
    elif days_since_last_order <= 180 and emails_opened_last_90d > 0:
        tier = "TIER_3_SEVERE_LAPSE"
        action = "DISPATCH_EXPIRING_25_DOLLAR_WINBACK_CREDIT"
        incentive_offered = "25_DOLLAR_CREDIT_ON_50_MINIMUM"
    # Sunset: Inactive > 180 days with zero email opens -> Deliverability Offboard
    else:
        tier = "CHURNED_SUNSET_STATUS"
        action = "AUTOMATICALLY_SUPPRESS_AND_ARCHIVE_FROM_EMAIL"
        incentive_offered = "NONE_ROUTE_TO_META_PAID_RETARGETING"
        
    return {
        "customer_id": c_id,
        "days_since_last_order": days_since_last_order,
        "cycle_multiple": cycle_multiple,
        "historical_clv_usd": historical_clv,
        "lapse_tier": tier,
        "action_directive": action,
        "incentive_offered": incentive_offered,
        "status": "WINBACK_ACTION_ORCHESTRATED"
    }

if __name__ == "__main__":
    customers = [
        {"customer_id": "CUST_LAPSED_01", "days_since_last_order": 75, "historical_clv_usd": 420.0, "emails_opened_last_90d": 2},
        {"customer_id": "CUST_LAPSED_02", "days_since_last_order": 120, "historical_clv_usd": 680.0, "emails_opened_last_90d": 1},
        {"customer_id": "CUST_CHURNED_03", "days_since_last_order": 210, "historical_clv_usd": 150.0, "emails_opened_last_90d": 0}
    ]
    
    print("=== AUTOMATED CUSTOMER WIN-BACK & SUNSET ENGINE ===")
    for c in customers:
        res = execute_customer_winback_engine(c, normal_purchase_cycle_days=45)
        print(f"[{res['customer_id']}] Lapsed: {res['days_since_last_order']}d ({res['cycle_multiple']}x cycle) | CLV: ${res['historical_clv_usd']}")
        print(f"   Tier: {res['lapse_tier']} -> Action: {res['action_directive']}")
        print(f"   Incentive: {res['incentive_offered']}\n")
'''

    p4_output = """=== AUTOMATED CUSTOMER WIN-BACK & SUNSET ENGINE ===
[CUST_LAPSED_01] Lapsed: 75d (1.7x cycle) | CLV: $420.0
   Tier: TIER_1_MILD_LAPSE -> Action: DISPATCH_NEW_ARRIVALS_AND_MISS_YOU_MESSAGE
   Incentive: NONE_VALUE_PROPOSITION_ONLY

[CUST_LAPSED_02] Lapsed: 120d (2.7x cycle) | CLV: $680.0
   Tier: TIER_2_MODERATE_LAPSE -> Action: DISPATCH_FEEDBACK_SURVEY_AND_10_PCT_VOUCHER
   Incentive: 10_PERCENT_OFF_NEXT_ORDER

[CUST_CHURNED_03] Lapsed: 210d (4.7x cycle) | CLV: $150.0
   Tier: CHURNED_SUNSET_STATUS -> Action: AUTOMATICALLY_SUPPRESS_AND_ARCHIVE_FROM_EMAIL
   Incentive: NONE_ROUTE_TO_META_PAID_RETARGETING
"""

    parts.append({
        "title": "Win-Back Campaigns, Sunset Policies & Disengagement Mitigation",
        "say": p4_say,
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            "Calculates purchase recency cycle multiples against normal 45-day intervals.",
            "Escalates incentives gracefully from educational content to $25 credit based on lapse duration.",
            "Enforces deliverability protection by automatically archiving subscribers inactive for > 180 days."
        ],
        "check": {
            "question": "What is the primary reason why win-back campaigns should automatically suppress contacts after 180 days of total inactivity?",
            "options": [
                "Continuing to send emails to subscribers who have ignored messages for 6 months damages sender reputation, increases spam complaints, and risks hitting recycled spam traps",
                "Because historical customer records automatically self-delete after 180 days under cloud storage rules",
                "Because email service providers charge double per contact if they are over 180 days old",
                "Because lapsed customers are prohibited by law from purchasing again"
            ],
            "why": "Lapsed addresses frequently convert into recycled spam traps operated by mailbox providers. Suppressing non-responsive contacts protects the enterprise from devastating domain blacklisting."
        },
        "example": "A beauty subscription box deployed an automated win-back flow. They recovered 14.2% of lapsed customers between days 60 and 120, unlocking $310,000 in annualized revenue while automatically archiving 45,000 dead accounts to protect inbox deliverability.",
        "tryIt": "Determine your customer base's median repeat purchase interval. Build a 3-tier win-back sequence targeting customers at 1.5x, 2.5x, and 3.5x that median cycle."
    })

    # Part 5: APEX Lifecycle Marketing Automation Gateway
    p5_say = [
        "In this final section of Day 13, we synthesize all event-driven workflows, abandonment recovery funnels, replenishment systems, and win-back mechanics into the institutional APEX Lifecycle Marketing Automation Gateway. In high-growth digital organizations, lifecycle marketing is not a collection of disconnected emails; it is a unified, automated revenue machine operating with predictable mathematical precision.",
        
        "The APEX Lifecycle Gateway continuously evaluates five core automated workflow clusters: Cart Abandonment Recovery, Browse Abandonment, Welcome & First-Purchase Onboarding, Predictive Consumable Replenishment, and VIP Churn Win-Back. It monitors flow revenue attribution, recovery conversion rates, revenue per recipient (RPR), and gross margin retention, calculating a consolidated Lifecycle Automation Performance Index (LAPI: 0 to 100).",
        
        "When an enterprise lifecycle infrastructure achieves an LAPI score of 88.0 or higher with an overall cart recovery rate exceeding 10.0% and positive net margin expansion, the system awards the Certified Lifecycle Marketing & Automation Director (CLMA-DIR) credential. This institutional accreditation signals mastery in building resilient, multi-million-dollar automated retention flywheels.",
        
        "In our final Python simulation, we construct the complete APEX Lifecycle Marketing Automation Gateway. The system audits a multi-flow enterprise automation architecture, calculates consolidated revenue and profit recovery, computes the LAPI index, and outputs an executive accreditation dossier. Run the simulation to see lifecycle governance executed."
    ]

    p5_code = r'''def execute_apex_lifecycle_automation_gateway(
    automation_manifest: list
) -> dict:
    """
    APEX Lifecycle Marketing Automation Gateway.
    Synthesizes Cart Abandonment, Browse Abandonment, Replenishment, and Win-Back
    workflows into a consolidated Lifecycle Automation Performance Index (LAPI).
    """
    processed_flows = []
    total_triggered_sessions = 0
    total_conversions = 0
    total_gross_revenue = 0.0
    total_score = 0.0
    
    for flow in automation_manifest:
        f_name = flow["flow_name"]
        triggers = flow["triggered_sessions"]
        convs = flow["converted_sessions"]
        rev = flow["revenue_usd"]
        rpr_target = flow["target_revenue_per_recipient_usd"]
        
        total_triggered_sessions += triggers
        total_conversions += convs
        total_gross_revenue += rev
        
        cvr = round((convs / max(1, triggers)) * 100.0, 2)
        rpr_actual = round(rev / max(1, triggers), 2)
        
        # Scoring Components (Max 25 pts each)
        s_cvr = min(25.0, (cvr / flow["benchmark_cvr_pct"]) * 25.0)
        s_rpr = min(25.0, (rpr_actual / rpr_target) * 25.0)
        s_scale = min(25.0, (triggers / 5000.0) * 25.0)
        s_margin = 25.0 if flow.get("discount_dilution_pct", 0) <= 15.0 else 15.0
        
        flow_score = round(s_cvr + s_rpr + s_scale + s_margin, 1)
        total_score += flow_score
        
        # Directive
        if flow_score >= 85.0:
            directive = "SCALE_VOLUME_AND_EXPAND_AUDIENCE_TRIGGERS"
        elif cvr < flow["benchmark_cvr_pct"]:
            directive = "OPTIMIZE_SUBJECT_LINE_AND_DELAYS"
        else:
            directive = "MAINTAIN_NOMINAL_EXECUTION"
            
        processed_flows.append({
            "flow_name": f_name,
            "triggered_sessions": triggers,
            "conversions": convs,
            "conversion_rate_pct": cvr,
            "revenue_usd": rev,
            "revenue_per_recipient_usd": rpr_actual,
            "flow_score": flow_score,
            "directive": directive
        })
        
    blended_cvr = round((total_conversions / max(1, total_triggered_sessions)) * 100.0, 2)
    blended_rpr = round(total_gross_revenue / max(1, total_triggered_sessions), 2)
    portfolio_lapi = round(total_score / len(automation_manifest), 1)
    
    status = "APEX_LIFECYCLE_AUTOMATION_EXCELLENCE" if portfolio_lapi >= 88.0 and blended_cvr >= 8.0 else "OPTIMIZATION_REQUIRED"
    
    return {
        "total_triggered_sessions": total_triggered_sessions,
        "total_lifecycle_conversions": total_conversions,
        "blended_conversion_rate_pct": blended_cvr,
        "total_recovered_revenue_usd": total_gross_revenue,
        "blended_revenue_per_recipient_usd": blended_rpr,
        "portfolio_lapi_score": portfolio_lapi,
        "gateway_status": status,
        "accreditation": "CERTIFIED_LIFECYCLE_MARKETING_DIRECTOR" if status == "APEX_LIFECYCLE_AUTOMATION_EXCELLENCE" else "PENDING_AUDIT",
        "flows_evaluated": processed_flows
    }

if __name__ == "__main__":
    flows = [
        {
            "flow_name": "Cart_Abandonment_3Stage_Drip",
            "triggered_sessions": 10000,
            "converted_sessions": 1296,
            "revenue_usd": 190755.0,
            "benchmark_cvr_pct": 10.0,
            "target_revenue_per_recipient_usd": 15.0,
            "discount_dilution_pct": 10.0
        },
        {
            "flow_name": "Predictive_Replenishment_Consumable",
            "triggered_sessions": 6000,
            "converted_sessions": 1450,
            "revenue_usd": 116000.0,
            "benchmark_cvr_pct": 20.0,
            "target_revenue_per_recipient_usd": 18.0,
            "discount_dilution_pct": 0.0
        },
        {
            "flow_name": "VIP_Lapsed_Winback_Sequence",
            "triggered_sessions": 4000,
            "converted_sessions": 480,
            "revenue_usd": 48000.0,
            "benchmark_cvr_pct": 10.0,
            "target_revenue_per_recipient_usd": 10.0,
            "discount_dilution_pct": 15.0
        }
    ]
    
    gateway = execute_apex_lifecycle_automation_gateway(flows)
    print("=== APEX LIFECYCLE MARKETING AUTOMATION GATEWAY ===")
    print(f"Triggered Sessions: {gateway['total_triggered_sessions']:,} | Converted: {gateway['total_lifecycle_conversions']:,} ({gateway['blended_conversion_rate_pct']}%)")
    print(f"Total Recovered Revenue: ${gateway['total_recovered_revenue_usd']:,.2f} | Blended RPR: ${gateway['blended_revenue_per_recipient_usd']}")
    print(f"Portfolio LAPI Index: {gateway['portfolio_lapi_score']}/100.0 | Status: {gateway['gateway_status']}")
    print(f"Accreditation: {gateway['accreditation']}")
    print("\n--- Individual Flow Directives ---")
    for f in gateway["flows_evaluated"]:
        print(f"[{f['flow_name']}] Conv: {f['conversion_rate_pct']}% | RPR: ${f['revenue_per_recipient_usd']} | Score: {f['flow_score']} -> {f['directive']}")
'''

    p5_output = """=== APEX LIFECYCLE MARKETING AUTOMATION GATEWAY ===
Triggered Sessions: 20,000 | Converted: 3,226 (16.13%)
Total Recovered Revenue: $354,755.00 | Blended RPR: $17.74
Portfolio LAPI Index: 98.3/100.0 | Status: APEX_LIFECYCLE_AUTOMATION_EXCELLENCE
Accreditation: CERTIFIED_LIFECYCLE_MARKETING_DIRECTOR

--- Individual Flow Directives ---
[Cart_Abandonment_3Stage_Drip] Conv: 12.96% | RPR: $19.08 | Score: 100.0 -> SCALE_VOLUME_AND_EXPAND_AUDIENCE_TRIGGERS
[Predictive_Replenishment_Consumable] Conv: 24.17% | RPR: $19.33 | Score: 100.0 -> SCALE_VOLUME_AND_EXPAND_AUDIENCE_TRIGGERS
[VIP_Lapsed_Winback_Sequence] Conv: 12.0% | RPR: $12.0 | Score: 95.0 -> SCALE_VOLUME_AND_EXPAND_AUDIENCE_TRIGGERS"""

    parts.append({
        "title": "APEX Lifecycle Marketing Automation Gateway & Recovered Revenue Attribution",
        "say": p5_say,
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            "Evaluates multi-flow lifecycle automation capturing $354,755.00 across 20,000 triggered sessions.",
            "Achieves a 16.13% blended lifecycle conversion rate with $17.74 revenue per recipient (RPR).",
            "Awards Certified Lifecycle Marketing Director credential for superior LAPI score of 98.7/100.0."
        ],
        "check": {
            "question": "What core performance metrics determine whether an enterprise marketing automation portfolio achieves APEX excellence certification?",
            "options": [
                "A blended conversion rate >= 8.0%, high revenue per recipient, and a consolidated LAPI score >= 88.0/100.0 with healthy profit margins",
                "Sending at least 10 emails a day to every contact in the database",
                "Having the most complex visual flowchart diagram regardless of revenue output",
                "Offering 50% discounts on every abandoned shopping cart"
            ],
            "why": "Institutional lifecycle marketing is judged on financial output: high conversion rate (>= 8.0%), strong revenue per recipient, and an LAPI score >= 88.0 reflecting high margin retention."
        },
        "example": "A multi-brand apparel retailer deployed the APEX Lifecycle Gateway across 1.4M subscribers. Automating cart abandonment, predictive replenishment, and win-back drips generated $4.2M in annual automated margin, accounting for 48% of total digital earnings.",
        "tryIt": "Input your brand's automated flow metrics into the APEX Lifecycle Gateway. Verify your current LAPI score and identify which flow has the highest optimization potential."
    })

    day_dict = {
        "day": 13,
        "title": "Marketing Automation & Drip Sequences: Cart Abandonment Workflows",
        "parts": parts
    }

    total_words = ensure_dmkt_day_budget(day_dict, min_part_words=580, min_day_words=2950)
    return day_dict, total_words

if __name__ == "__main__":
    day13_data, total_words = build_day13()
    print(f"Day 13 built successfully: {total_words:,} spoken words.")
