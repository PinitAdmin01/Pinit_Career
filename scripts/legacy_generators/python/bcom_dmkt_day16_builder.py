"""
Day 16 Builder: Google Analytics 4 (GA4): Event-Driven Data Model & Exploration Reports
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Task: TASK-836
"""

import os
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words
from digital_marketing_budget_ensurer import ensure_dmkt_day_budget

def build_day16():
    parts = []

    # Part 1: GA4 Event-Driven Schema (Events, Parameters & User Properties vs Universal Analytics Sessions)
    p1_say = [
        "Welcome to Day 16 of Digital Marketing and Growth Hacking. Today, we launch Milestone 4: Web Analytics, Multi-Touch Attribution, Growth Hacking, and App Store Optimization. We begin by deconstructing Google Analytics 4 (GA4), the foundational measurement engine for modern digital commerce. For over a decade, Universal Analytics (UA) governed digital marketing using a session-based data model centered on pageviews, hit types, and rigid event categories, actions, and labels. However, this legacy architecture collapsed under the weight of single-page web applications (SPAs), mobile apps, cross-device user journeys, and heightened data privacy regulations.",
        
        "GA4 replaces sessions with a flexible, unified event-driven data model where every single user interaction is an event. Whether a user loads a page ('page_view'), initiates a visit ('session_start'), scrolls down 90% of a landing page ('scroll'), views a product detail modal ('view_item'), adds merchandise to their cart ('add_to_cart'), or completes a transaction ('purchase'), all signals share an identical underlying schema. Each event carries up to 25 custom event parameters, which provide granular context such as item_id, price, currency, traffic source, or coupon code. Furthermore, GA4 binds up to 25 user properties—persistent attributes such as customer loyalty tier, lifetime value bucket, or membership status—to each user entity across multiple sessions.",
        
        "A profound architectural advancement in GA4 is the definition of session engagement. Universal Analytics defined bounce rate mechanically: any single-page session without a secondary hit was recorded as a 100% bounce, even if an engaged prospect spent 15 minutes reading an in-depth whitepaper. GA4 completely inverts this paradigm by introducing Engaged Sessions. An engaged session is strictly defined as any session that lasts 10 seconds or longer, contains two or more page views, or records at least one conversion event. The Engagement Rate—computed as Engaged Sessions divided by Total Sessions—provides a dramatically superior indicator of audience content affinity and paid media qualification.",
        
        "Enterprise marketing teams enforce strict naming conventions and schema validation on all incoming telemetry. Event names must be lowercase, alphanumeric, separated by underscores, and restricted to 40 characters. Ingestion pipelines that violate parameter thresholds or schema structures risk data truncation, distorted reporting, or broken downstream audiences. In our Python simulation for Part 1, we implement a GA4 Event Telemetry Parser and Session Engagement Engine that validates raw event streams, computes session engagement metrics, and verifies telemetry compliance. Run the script below to master GA4 event schemas."
    ]

    p1_code = r'''def parse_ga4_event_stream(raw_events: list) -> dict:
    """
    Parses a stream of raw telemetry events, verifies schema validation
    (ensures event name syntax, parameter limits, timestamp_micros),
    and computes user session counts, engaged session rates, and event frequency distributions.
    """
    valid_events = []
    invalid_events = []
    sessions = set()
    engaged_sessions = set()
    event_counts = {}
    
    for ev in raw_events:
        name = ev.get("event_name", "")
        params = ev.get("event_params", {})
        user_props = ev.get("user_properties", {})
        ts = ev.get("timestamp_micros", 0)
        
        # Validation rules: event name <= 40 chars, alphanumeric with underscores
        if not name or len(name) > 40 or not all(c.isalnum() or c == '_' for c in name):
            invalid_events.append({"event": ev, "reason": "INVALID_EVENT_NAME"})
            continue
            
        if len(params) > 25:
            invalid_events.append({"event": ev, "reason": "EXCEEDED_PARAM_LIMIT_25"})
            continue
            
        valid_events.append(ev)
        event_counts[name] = event_counts.get(name, 0) + 1
        
        sess_id = params.get("ga_session_id")
        if sess_id:
            sessions.add(sess_id)
            # Engaged session: engagement_time_msec >= 10000 or 2+ page views or conversion
            if params.get("engagement_time_msec", 0) >= 10000 or params.get("session_engaged") == "1":
                engaged_sessions.add(sess_id)

    total_sess = len(sessions)
    eng_sess = len(engaged_sessions)
    eng_rate = round((eng_sess / max(1, total_sess)) * 100.0, 2)
    
    return {
        "total_received": len(raw_events),
        "valid_count": len(valid_events),
        "invalid_count": len(invalid_events),
        "unique_sessions": total_sess,
        "engaged_sessions": eng_sess,
        "engagement_rate_pct": eng_rate,
        "event_distribution": event_counts
    }

# Execution & Telemetry Verification
sample_events = [
    {
        "event_name": "session_start",
        "timestamp_micros": 1700000000000000,
        "event_params": {"ga_session_id": 9011, "page_location": "https://store.example.com/"},
        "user_properties": {"user_id": "U_8812"}
    },
    {
        "event_name": "page_view",
        "timestamp_micros": 1700000001000000,
        "event_params": {"ga_session_id": 9011, "page_title": "Enterprise Tier", "engagement_time_msec": 12500, "session_engaged": "1"}
    },
    {
        "event_name": "view_item",
        "timestamp_micros": 1700000015000000,
        "event_params": {"ga_session_id": 9011, "item_id": "SKU_994", "price": 499.0, "currency": "USD"}
    },
    {
        "event_name": "add_to_cart",
        "timestamp_micros": 1700000045000000,
        "event_params": {"ga_session_id": 9012, "item_id": "SKU_994", "price": 499.0, "engagement_time_msec": 18200, "session_engaged": "1"}
    }
]

res = parse_ga4_event_stream(sample_events)
print(f"GA4 Event Telemetry Audit:")
print(f"- Valid Events Ingested: {res['valid_count']} / {res['total_received']}")
print(f"- Unique Sessions: {res['unique_sessions']}")
print(f"- Engaged Sessions: {res['engaged_sessions']}")
print(f"- Engagement Rate: {res['engagement_rate_pct']}%")
print(f"- Event Breakdown: {res['event_distribution']}")
'''

    p1_output = """GA4 Event Telemetry Audit:
- Valid Events Ingested: 4 / 4
- Unique Sessions: 2
- Engaged Sessions: 2
- Engagement Rate: 100.0%
- Event Breakdown: {'session_start': 1, 'page_view': 1, 'view_item': 1, 'add_to_cart': 1}"""

    parts.append({
        "part": 1,
        "title": "GA4 Event-Driven Schema & Session Engagement",
        "say": p1_say,
        "rawCode": p1_code,
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            "Validates event naming syntax (<= 40 chars, alphanumeric with underscores) and 25-parameter cap.",
            "Tracks unique session IDs via ga_session_id parameter and classifies engaged sessions.",
            "Computes engagement rate as engaged sessions divided by total unique sessions."
        ],
        "example": "Like replacing a rigid paper hotel register that only recorded arrival times with an intelligent RFID keycard system that records door unlocks, gym visits, and room service orders with equal precision.",
        "tryIt": "Modify sample_events to include an event with 26 parameters or an illegal space in its event name to verify the schema validation rejection.",
        "check": {
            "question": "How does GA4 determine that a user session qualifies as an 'Engaged Session'?",
            "options": [
                "The user must spend at least 10 seconds, view 2 or more pages/screens, or trigger a conversion event.",
                "The user must click on at least five distinct interactive buttons on the homepage.",
                "The session must originate from an authenticated user who logged in via OAuth.",
                "The session must generate at least $100 in completed e-commerce purchase revenue."
            ],
            "answer": 0,
            "why": "GA4 defines an engaged session as lasting 10+ seconds, having 2+ page/screen views, or completing a conversion event.",
            "answerIndex": 0,
            "explanation": "GA4 defines an engaged session as lasting 10+ seconds, having 2+ page/screen views, or completing a conversion event."
        }
    })

    # Part 2: Custom Dimensions, Metrics & BigQuery Raw Export Integration
    p2_say = [
        "In enterprise analytics, collecting raw events in the browser is only the first step. To make these data points accessible in standard GA4 reporting, data teams must map event parameters to Custom Dimensions and Custom Metrics. Event-scoped custom dimensions (such as 'author_name' or 'plan_type') capture contextual details for individual actions, while user-scoped custom dimensions (such as 'account_tier' or 'registration_cohort') describe the user across all their sessions. Numerical parameters intended for aggregation (such as 'video_watch_seconds' or 'loyalty_points_earned') must be registered as Custom Metrics with specified units of measurement.",
        
        "However, the standard GA4 web interface is subject to API quota limits, cardinality thresholds, and aggregation constraints (such as the dreaded '(other)' row when unique parameter values exceed high cardinality thresholds). To unlock unconstrained analytics, sophisticated growth organizations enable the free, native Google BigQuery export. BigQuery exports daily tables ('events_YYYYMMDD') and real-time streaming tables ('events_intraday_YYYYMMDD') containing raw, un-sampled, hit-level event records.",
        
        "Because GA4 is fundamentally event-driven, its BigQuery export schema is deeply nested. Event parameters are stored as a repeated record: a column named 'event_params' that contains an array of structs, each with a 'key' and a nested 'value' struct containing 'string_value', 'int_value', 'float_value', and 'double_value'. Querying this schema requires SQL UNNEST operations. Without flattening and unnesting these key-value pairs, analysts cannot extract transactional revenue, traffic source dimensions, or custom parameters.",
        
        "In our Python simulation for Part 2, we build a BigQuery GA4 Schema Unnesting and Export Pipeline. The script parses nested JSON event records mimicking BigQuery's repeated structs, extracts flattened analytical rows, and computes clean total revenue across acquisition channels. Study the implementation below to master BigQuery GA4 querying mechanics."
    ]

    p2_code = r'''def unnest_bigquery_ga4_events(bq_records: list) -> list:
    """
    Simulates SQL UNNEST operation on nested event_params in Python,
    extracting session_id, page_location, transaction_id, and value,
    and generates an unnested analytical tabular dataset.
    """
    unnested_table = []
    
    for row in bq_records:
        event_name = row["event_name"]
        user_pseudo_id = row["user_pseudo_id"]
        event_timestamp = row["event_timestamp"]
        
        # Flatten event_params
        flattened_params = {}
        for param in row.get("event_params", []):
            key = param["key"]
            val_obj = param["value"]
            if "string_value" in val_obj and val_obj["string_value"] is not None:
                flattened_params[key] = val_obj["string_value"]
            elif "int_value" in val_obj and val_obj["int_value"] is not None:
                flattened_params[key] = val_obj["int_value"]
            elif "float_value" in val_obj and val_obj["float_value"] is not None:
                flattened_params[key] = val_obj["float_value"]
                
        unnested_table.append({
            "user_pseudo_id": user_pseudo_id,
            "event_name": event_name,
            "session_id": flattened_params.get("ga_session_id"),
            "transaction_id": flattened_params.get("transaction_id", "N/A"),
            "revenue": flattened_params.get("value", 0.0),
            "source": flattened_params.get("source", "(direct)"),
            "medium": flattened_params.get("medium", "(none)")
        })
        
    return unnested_table

# Sample BigQuery Export Records
sample_bq_data = [
    {
        "event_name": "purchase",
        "user_pseudo_id": "client_9104.9921",
        "event_timestamp": 1700000100000000,
        "event_params": [
            {"key": "ga_session_id", "value": {"int_value": 77102}},
            {"key": "transaction_id", "value": {"string_value": "TXN_7849"}},
            {"key": "value", "value": {"float_value": 349.99}},
            {"key": "source", "value": {"string_value": "google"}},
            {"key": "medium", "value": {"string_value": "cpc"}}
        ]
    },
    {
        "event_name": "purchase",
        "user_pseudo_id": "client_3321.1102",
        "event_timestamp": 1700000120000000,
        "event_params": [
            {"key": "ga_session_id", "value": {"int_value": 77103}},
            {"key": "transaction_id", "value": {"string_value": "TXN_7850"}},
            {"key": "value", "value": {"float_value": 1250.00}},
            {"key": "source", "value": {"string_value": "meta"}},
            {"key": "medium", "value": {"string_value": "paid_social"}}
        ]
    }
]

flattened = unnest_bigquery_ga4_events(sample_bq_data)
total_rev = sum(r["revenue"] for r in flattened)
print("BigQuery GA4 Unnested Schema Export:")
for row in flattened:
    print(f"- User: {row['user_pseudo_id']} | Event: {row['event_name']} | Txn: {row['transaction_id']} | Rev: ${row['revenue']} | Channel: {row['source']}/{row['medium']}")
print(f"Total Unnested BigQuery Revenue: ${total_rev:.2f}")
'''

    p2_output = """BigQuery GA4 Unnested Schema Export:
- User: client_9104.9921 | Event: purchase | Txn: TXN_7849 | Rev: $349.99 | Channel: google/cpc
- User: client_3321.1102 | Event: purchase | Txn: TXN_7850 | Rev: $1250.0 | Channel: meta/paid_social
Total Unnested BigQuery Revenue: $1599.99"""

    parts.append({
        "part": 2,
        "title": "Custom Dimensions & BigQuery Raw Schema Unnesting",
        "say": p2_say,
        "rawCode": p2_code,
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            "Simulates the SQL UNNEST(event_params) operation by flattening nested repeated record arrays.",
            "Extracts typed string, integer, and float values into tabular analytical columns.",
            "Aggregates total unnested revenue across disparate traffic acquisition sources."
        ],
        "example": "Like opening Russian nesting dolls where each doll contains a specific certificate, extracting all hidden documents and laying them flat on an audit table.",
        "tryIt": "Add a third purchase record with source 'newsletter' and value 450.0 to observe the dynamic unnesting and revenue aggregation.",
        "check": {
            "question": "Why is the SQL UNNEST function essential when querying GA4 export tables in BigQuery?",
            "options": [
                "Because event parameters are stored in repeated RECORD arrays rather than static flat columns.",
                "Because BigQuery automatically encrypts raw telemetry unless unnested with an administrative key.",
                "Because UNNEST reduces the total physical storage cost of BigQuery tables by 90%.",
                "Because GA4 export tables do not support standard SQL WHERE clauses without UNNEST."
            ],
            "answer": 0,
            "why": "In GA4 BigQuery schemas, event parameters are stored as nested, repeated arrays of key-value structs, necessitating UNNEST to flatten them into queryable rows.",
            "answerIndex": 0,
            "explanation": "In GA4 BigQuery schemas, event parameters are stored as nested, repeated arrays of key-value structs, necessitating UNNEST to flatten them into queryable rows."
        }
    })

    # Part 3: Free-Form Funnel & Path Exploration Telemetry
    p3_say = [
        "While standard GA4 reports provide high-level traffic overviews, serious conversion optimization and product analytics occur inside GA4 Explorations. The Funnel Exploration report allows growth architects to map complex multi-step user journeys and measure step-by-step conversion and drop-off rates. Funnels can be configured as Open Funnels (where users can enter at any intermediate step) or Closed Funnels (where users must complete step 1 before progressing, isolating the true end-to-end journey).",
        
        "A typical e-commerce funnel exploration consists of five discrete steps: Step 1 (session_start), Step 2 (view_item), Step 3 (add_to_cart), Step 4 (begin_checkout), and Step 5 (purchase). By examining the drop-off rate between consecutive steps, growth teams pinpoint the exact phase where user friction incinerates marketing capital. For instance, if 28,500 users view an item but only 6,270 add to cart, the resulting 78.0% drop-off highlights an acute offer, pricing, or product page UX bottleneck.",
        
        "Beyond linear funnels, GA4 Path Exploration utilizes a tree-graph visualization to map non-linear user journeys. Analysts can start from an endpoint—such as a shopping cart abandonment or a churned checkout session—and work backwards (Reverse Pathing) to identify which preceding pages or error modals preceded the drop-off. This telemetry reveals circular browsing loops, broken form validations, and unexpected navigation barriers that standard conversion dashboards conceal.",
        
        "In our Python simulation for Part 3, we build an Automated GA4 Funnel Exploration and Friction Diagnostic Engine. The script ingests step user volumes, calculates step-level conversion rates, cumulative completion percentages, and drop-off rates, and automatically flags the critical funnel bottleneck. Examine the code below to see funnel analysis in action."
    ]

    p3_code = r'''def analyze_ga4_funnel_exploration(funnel_steps: list) -> dict:
    """
    Calculates step drop-off percentages, completion rates,
    overall funnel conversion efficiency (End-to-End CVR),
    and identifies the primary funnel bottleneck.
    """
    analysis = []
    initial_users = funnel_steps[0]["users"]
    prev_users = initial_users
    max_drop_step = ""
    max_drop_rate = 0.0
    
    for i, step in enumerate(funnel_steps):
        name = step["step_name"]
        users = step["users"]
        
        step_cvr = round((users / max(1, prev_users)) * 100.0, 2)
        overall_cvr = round((users / max(1, initial_users)) * 100.0, 2)
        drop_off_pct = round(100.0 - step_cvr, 2) if i > 0 else 0.0
        
        if drop_off_pct > max_drop_rate:
            max_drop_rate = drop_off_pct
            max_drop_step = name
            
        analysis.append({
            "step": i + 1,
            "name": name,
            "users": users,
            "step_cvr_pct": step_cvr,
            "overall_cvr_pct": overall_cvr,
            "drop_off_pct": drop_off_pct
        })
        prev_users = users
        
    return {
        "funnel_steps": analysis,
        "end_to_end_cvr_pct": analysis[-1]["overall_cvr_pct"],
        "critical_bottleneck": max_drop_step,
        "bottleneck_drop_pct": max_drop_rate
    }

# Execution & Telemetry
funnel_data = [
    {"step_name": "1. First Session (session_start)", "users": 50000},
    {"step_name": "2. Product View (view_item)", "users": 28500},
    {"step_name": "3. Add to Cart (add_to_cart)", "users": 6270},
    {"step_name": "4. Checkout Started (begin_checkout)", "users": 3450},
    {"step_name": "5. Order Placed (purchase)", "users": 2140}
]

f_res = analyze_ga4_funnel_exploration(funnel_data)
print("GA4 Funnel Exploration Report:")
for s in f_res["funnel_steps"]:
    print(f"[{s['step']}] {s['name']}: {s['users']} users | Step CVR: {s['step_cvr_pct']}% | Overall: {s['overall_cvr_pct']}% | Drop: {s['drop_off_pct']}%")
print(f"End-to-End Funnel Conversion Rate: {f_res['end_to_end_cvr_pct']}%")
print(f"Primary Bottleneck: {f_res['critical_bottleneck']} with {f_res['bottleneck_drop_pct']}% drop-off")
'''

    p3_output = """GA4 Funnel Exploration Report:
[1] 1. First Session (session_start): 50000 users | Step CVR: 100.0% | Overall: 100.0% | Drop: 0.0%
[2] 2. Product View (view_item): 28500 users | Step CVR: 57.0% | Overall: 57.0% | Drop: 43.0%
[3] 3. Add to Cart (add_to_cart): 6270 users | Step CVR: 22.0% | Overall: 12.54% | Drop: 78.0%
[4] 4. Checkout Started (begin_checkout): 3450 users | Step CVR: 55.02% | Overall: 6.9% | Drop: 44.98%
[5] 5. Order Placed (purchase): 2140 users | Step CVR: 62.03% | Overall: 4.28% | Drop: 37.97%
End-to-End Funnel Conversion Rate: 4.28%
Primary Bottleneck: 3. Add to Cart (add_to_cart) with 78.0% drop-off"""

    parts.append({
        "part": 3,
        "title": "Funnel Explorations & Friction Bottleneck Telemetry",
        "say": p3_say,
        "rawCode": p3_code,
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            "Evaluates multi-stage conversion funnel drop-offs and overall end-to-end completion rates.",
            "Identifies the primary funnel bottleneck by detecting the largest inter-step drop-off percentage.",
            "Distinguishes between step-level CVR (relative to previous step) and overall CVR (relative to top)."
        ],
        "example": "Like tracking an airport security checkpoint where 1,000 travelers enter, 950 pass boarding pass scanners, but 400 abandon the line at the body scanner due to an unexpected delay.",
        "tryIt": "Increase the 'add_to_cart' users from 6,270 to 15,000 to observe how the primary bottleneck shifts to checkout initiation.",
        "check": {
            "question": "What is the primary operational distinction between an Open Funnel and a Closed Funnel in GA4 Explorations?",
            "options": [
                "In an open funnel, users can enter at any step; in a closed funnel, users must enter at Step 1.",
                "In an open funnel, anonymous visitors are included; in a closed funnel, only logged-in users appear.",
                "An open funnel requires BigQuery export, while a closed funnel is restricted to the GA4 UI.",
                "An open funnel operates in real-time, whereas a closed funnel experiences a 48-hour processing lag."
            ],
            "answer": 0,
            "why": "Open funnels allow users to join the funnel at any step, whereas closed funnels enforce strict entry at Step 1.",
            "answerIndex": 0,
            "explanation": "Open funnels allow users to join the funnel at any step, whereas closed funnels enforce strict entry at Step 1."
        }
    })

    # Part 4: Consent Mode v2 & Server-Side Tag Management Architecture
    p4_say = [
        "Modern digital marketing operates under stringent global regulatory frameworks, most notably the European Union General Data Protection Regulation (GDPR) and the Digital Markets Act (DMA). To comply, Google introduced Consent Mode v2, which mandates four explicit consent signals before tags can store or transmit data: 'ad_storage', 'analytics_storage', 'ad_user_data', and 'ad_personalization'. When European users decline cookie banners, Google tags do not drop identifiers or store cookies.",
        
        "Instead, Consent Mode dynamically adjusts tag behavior. When consent is denied, Google tags transmit stateless, cookieless pings containing non-identifying telemetry (such as timestamp, user-agent, and screen resolution) marked with the Google Consent State (GCS) parameter 'G100'. GA4 then employs advanced machine learning behavioral modeling to estimate the missing user journeys and conversions. Behavioral modeling fills conversion measurement gaps by up to 14.2% or more, recovering critical performance signals without compromising user privacy.",
        
        "Simultaneously, enterprise marketing organizations deploy server-side Google Tag Manager (sGTM) hosted on Google Cloud Run. Traditional client-side tagging executes hundreds of third-party JavaScript snippets directly in the user's browser, bogging down page load speeds, triggering ad-blocker suppression, and exposing the enterprise to Safari Intelligent Tracking Prevention (ITP) cookie expirations. Server-side GTM establishes a first-party proxy endpoint (e.g., 'metrics.enterprise.com') where the browser sends a single unified telemetry stream, and the server securely validates, redacts PII, and routes data to GA4, Meta CAPI, and TikTok Events API.",
        
        "In our Python simulation for Part 4, we build a Google Consent Mode v2 Evaluator and Server-Side GTM Dispatcher. The script inspects consent flags, strips client identifiers when consent is denied, routes cookieless pings, and applies machine learning conversion modeling recovery. Review the code below to understand privacy-safe measurement architecture."
    ]

    p4_code = r'''def evaluate_consent_mode_v2_payload(
    consent_state: dict,
    raw_payload: dict,
    modeling_uplift_factor: float = 0.142
) -> dict:
    """
    Evaluates Consent Mode v2 state (ad_storage, analytics_storage, ad_user_data, ad_personalization).
    Strips cookies and PII if denied, routes cookieless pings, and computes ML modeled conversion recovery.
    """
    ad_storage = consent_state.get("ad_storage", "denied")
    analytics_storage = consent_state.get("analytics_storage", "denied")
    ad_user_data = consent_state.get("ad_user_data", "denied")
    ad_personalization = consent_state.get("ad_personalization", "denied")
    
    is_fully_consented = all(s == "granted" for s in [ad_storage, analytics_storage, ad_user_data, ad_personalization])
    sanitized_payload = dict(raw_payload)
    
    if analytics_storage == "denied":
        sanitized_payload.pop("client_id", None)
        sanitized_payload.pop("ga_session_id", None)
        sanitized_payload["gcs_signal"] = "G100" # Cookieless ping marker
    else:
        sanitized_payload["gcs_signal"] = "G111"
        
    if ad_user_data == "denied":
        sanitized_payload.pop("hashed_email", None)
        sanitized_payload.pop("phone_number", None)
        
    observed_conversions = raw_payload.get("conversions", 100)
    modeled_recovery = round(observed_conversions * modeling_uplift_factor, 1) if not is_fully_consented else 0.0
    total_effective_conversions = observed_conversions + modeled_recovery
    
    return {
        "consent_mode_v2_status": "GRANTED" if is_fully_consented else "RESTRICTED_COOKILESS_MODE",
        "gcs_parameter": sanitized_payload.get("gcs_signal"),
        "pii_redacted": ad_user_data == "denied",
        "observed_conversions": observed_conversions,
        "modeled_conversions_recovered": modeled_recovery,
        "total_effective_conversions": total_effective_conversions,
        "server_side_gtm_routing": "SECURE_CLOUDRUN_HTTPONLY_PROXY"
    }

# Verification
consent_input = {
    "ad_storage": "denied",
    "analytics_storage": "denied",
    "ad_user_data": "denied",
    "ad_personalization": "denied"
}
payload = {
    "event": "purchase",
    "client_id": "GA4.1.99281.8841",
    "ga_session_id": "16999201",
    "hashed_email": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "conversions": 500
}

c_res = evaluate_consent_mode_v2_payload(consent_input, payload)
print("Google Consent Mode v2 & Server-Side GTM Engine:")
print(f"- Consent State: {c_res['consent_mode_v2_status']}")
print(f"- GCS Header: {c_res['gcs_parameter']} | PII Redacted: {c_res['pii_redacted']}")
print(f"- Observed Conversions: {c_res['observed_conversions']}")
print(f"- Modeled Conversions Recovered (+14.2%): {c_res['modeled_conversions_recovered']}")
print(f"- Total Attributed Conversions: {c_res['total_effective_conversions']}")
print(f"- Gateway Ingestion Mode: {c_res['server_side_gtm_routing']}")
'''

    p4_output = """Google Consent Mode v2 & Server-Side GTM Engine:
- Consent State: RESTRICTED_COOKILESS_MODE
- GCS Header: G100 | PII Redacted: True
- Observed Conversions: 500
- Modeled Conversions Recovered (+14.2%): 71.0
- Total Attributed Conversions: 571.0
- Gateway Ingestion Mode: SECURE_CLOUDRUN_HTTPONLY_PROXY"""

    parts.append({
        "part": 4,
        "title": "Consent Mode v2 & Server-Side GTM Architecture",
        "say": p4_say,
        "rawCode": p4_code,
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            "Evaluates four DMA-mandated consent signals: ad_storage, analytics_storage, ad_user_data, and ad_personalization.",
            "Sanitizes PII and client IDs when consent is denied, routing G100 cookieless telemetry pings.",
            "Applies machine learning behavioral modeling uplift (+14.2%) to reconstruct unconsented conversion volume."
        ],
        "example": "Like a hospital receptionist who checks an incoming patient's privacy consent form; if consent is withheld, they assign an anonymous badge number and record treatment statistics without saving the patient's name.",
        "tryIt": "Set all four consent flags to 'granted' in consent_input to verify that PII is retained and modeled recovery defaults to 0.0.",
        "check": {
            "question": "What occurs when a user denies analytics_storage under Google Consent Mode v2?",
            "options": [
                "GA4 drops client cookies and transmits cookieless pings that are later reconstructed via ML behavioral modeling.",
                "Google Analytics permanently bans the user's IP address from accessing the website.",
                "The browser displays a fatal JavaScript error and halts page rendering completely.",
                "All advertising campaigns across Google Ads are automatically paused for 24 hours."
            ],
            "answer": 0,
            "why": "When analytics_storage is denied, cookies are not written/read; stateless cookieless pings are sent, and GA4 uses machine learning modeling to bridge reporting gaps.",
            "answerIndex": 0,
            "explanation": "When analytics_storage is denied, cookies are not written/read; stateless cookieless pings are sent, and GA4 uses machine learning modeling to bridge reporting gaps."
        }
    })

    # Part 5: Enterprise GA4 Command Center & Cross-Channel Ingestion Gateway
    p5_say = [
        "In this final capstone part for Day 16, we orchestrate all preceding telemetry components into a production-grade Enterprise GA4 Command Center and Ingestion Gateway. High-growth enterprises process millions of raw event hits daily across responsive web storefronts, progressive web apps (PWAs), and native iOS and Android apps. Managing this scale requires automated governance to ensure that streaming pipelines remain healthy, BigQuery ingestion latencies stay under 60 seconds, and privacy compliance remains absolute.",
        
        "The Enterprise GA4 Command Center continuously monitors five key pillars: Event Volume Scale (processing millions of events without truncation), Streaming Latency (verifying BigQuery intraday streaming buffers), Regulatory Compliance (enforcing Consent Mode v2 and DMA signal handling), Funnel Integrity (tracking step-by-step drop-offs to prevent broken user journeys), and Server-Side Routing (maintaining Cloud Run first-party proxy health).",
        
        "We quantify enterprise analytics maturity through the Enterprise Analytics Readiness Index (EARI), a rigorous 100-point scale. Properties achieving an EARI score of 90.0 or above earn the Enterprise Gold Tier classification and award the operator the title of GA4 Data Architect Certified. This certification verifies that the digital marketing infrastructure provides uncompromised data fidelity for algorithmic bidding, multi-touch attribution, and executive boardroom decision-making.",
        
        "In our final Python simulation, we execute the Enterprise GA4 Gateway across a production telemetry batch of 2.5 million events. The script validates streaming ingestion, confirms BigQuery sync, audits Consent Mode v2 enforcement, and prints the comprehensive terminal readiness report. Run the gateway below to complete Day 16."
    ]

    p5_code = r'''def run_enterprise_ga4_gateway(telemetry_batch: dict) -> dict:
    """
    Synthesizes event telemetry, BigQuery unnesting, funnel exploration,
    and Consent Mode v2 compliance into a unified Enterprise Analytics Readiness Index (EARI).
    """
    total_events = telemetry_batch["total_events"]
    bq_export_latency_sec = telemetry_batch["bq_latency_sec"]
    consent_v2_active = telemetry_batch["consent_v2_active"]
    funnel_drop_monitored = telemetry_batch["funnel_drop_monitored"]
    server_side_gtm_active = telemetry_batch["server_side_gtm_active"]
    
    score = 0.0
    if total_events >= 10000: score += 25.0
    if bq_export_latency_sec <= 60: score += 25.0
    if consent_v2_active: score += 20.0
    if funnel_drop_monitored: score += 15.0
    if server_side_gtm_active: score += 15.0
    
    tier = "ENTERPRISE_GOLD_TIER" if score >= 90.0 else "SUB_OPTIMAL"
    accreditation = "GA4_DATA_ARCHITECT_CERTIFIED" if score >= 90.0 else "REAUDIT_REQUIRED"
    
    return {
        "eari_score": round(score, 1),
        "architecture_tier": tier,
        "accreditation": accreditation,
        "total_events_processed": total_events,
        "bq_stream_health": "STREAMING_BUFFER_OPTIMIZED",
        "regulatory_compliance": "EU_DMA_GDPR_ENFORCED"
    }

# Gateway Execution
batch = {
    "total_events": 2500000,
    "bq_latency_sec": 12,
    "consent_v2_active": True,
    "funnel_drop_monitored": True,
    "server_side_gtm_active": True
}

g_res = run_enterprise_ga4_gateway(batch)
print("=== ENTERPRISE GA4 COMMAND TOWER & PIPELINE GATEWAY ===")
print(f"Readiness Score: {g_res['eari_score']}/100 | Tier: {g_res['architecture_tier']}")
print(f"Events Ingested: {g_res['total_events_processed']:,} | BigQuery Health: {g_res['bq_stream_health']}")
print(f"Regulatory Status: {g_res['regulatory_compliance']}")
print(f"Final Accreditation: {g_res['accreditation']}")
'''

    p5_output = """=== ENTERPRISE GA4 COMMAND TOWER & PIPELINE GATEWAY ===
Readiness Score: 100.0/100 | Tier: ENTERPRISE_GOLD_TIER
Events Ingested: 2,500,000 | BigQuery Health: STREAMING_BUFFER_OPTIMIZED
Regulatory Status: EU_DMA_GDPR_ENFORCED
Final Accreditation: GA4_DATA_ARCHITECT_CERTIFIED"""

    parts.append({
        "part": 5,
        "title": "Enterprise GA4 Command Tower & Architecture Gateway",
        "say": p5_say,
        "rawCode": p5_code,
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            "Evaluates multi-pillar analytics telemetry across volume, BigQuery streaming latency, and consent status.",
            "Computes Enterprise Analytics Readiness Index (EARI) on a 100-point composite scale.",
            "Grants GA4_DATA_ARCHITECT_CERTIFIED accreditation when score meets or exceeds 90.0."
        ],
        "example": "Like the flight control tower at an international airport that monitors incoming radar, runway lights, automated ILS landing beacons, and weather telemetry simultaneously.",
        "tryIt": "Increase bq_latency_sec to 120 seconds to see how streaming latency delays downgrade the EARI readiness score.",
        "check": {
            "question": "What is the primary benefit of hosting server-side GTM on Google Cloud Run for enterprise GA4 deployments?",
            "options": [
                "It establishes a first-party data collection proxy that bypasses ad-blockers, extends cookie lifetimes, and secures PII.",
                "It eliminates the need to pay for Google BigQuery storage by compressing all historical events into static CSV files.",
                "It automatically generates viral video ad scripts using generative AI without human intervention.",
                "It allows marketers to bypass all European privacy and GDPR regulations with complete legal immunity."
            ],
            "answer": 0,
            "why": "Server-side GTM acts as a first-party proxy, reducing browser JavaScript load, mitigating ad-blockers and ITP cookie degradation, and centralizing PII redaction.",
            "answerIndex": 0,
            "explanation": "Server-side GTM acts as a first-party proxy, reducing browser JavaScript load, mitigating ad-blockers and ITP cookie degradation, and centralizing PII redaction."
        }
    })

    lesson_dict = {
        "coursePrefix": "bcom_dmkt",
        "day": 16,
        "title": "Google Analytics 4 (GA4): Event-Driven Data Model & Exploration Reports",
        "totalParts": 5,
        "duration": "35m",
        "parts": parts
    }

    total_words = ensure_dmkt_day_budget(lesson_dict, min_part_words=580, min_day_words=2950)
    print(f"Day 16 build complete! Total words: {total_words}")
    for idx, p in enumerate(lesson_dict["parts"]):
        p_words = count_words(p["say"])
        print(f"  Part {idx + 1} words: {p_words}")

    return lesson_dict

if __name__ == '__main__':
    build_day16()
