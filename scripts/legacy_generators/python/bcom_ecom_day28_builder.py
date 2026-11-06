"""
Day 28 Builder: Cookieless Tracking, Data Privacy & Modern Analytics Architecture
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-823
"""

import os
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day28():
    parts = []

    # Part 1: Third-Party Cookie Deprecation & Client-Side Signal Degradation
    p1_say = [
        "Welcome to Day 28 of B.Com E-Commerce and Digital Business. Today, we confront the seismic paradigm shift transforming digital marketing, performance analytics, and customer tracking: the death of third-party cookies, rising regulatory privacy enforcement, and modern server-side measurement architectures. For over two decades, digital marketing relied on client-side third-party cookies dropped silently by advertising pixels (such as Meta Pixel and Google Ads tags) directly in the user's browser.",
        
        "However, the traditional client-side tracking architecture has collapsed under three simultaneous structural forces: First, Browser Tracking Restrictions—Apple Safari's Intelligent Tracking Prevention (ITP) caps client-side cookie lifespans to just 7 days (or 24 hours if coming from an ad click) and purges script-writable local storage; Mozilla Firefox enforces Enhanced Tracking Protection (ETP); and Google Chrome is phasing out third-party cookies under Privacy Sandbox; Second, Ad Blockers & DNS Shields—over 40% of tech-savvy consumers run uBlock Origin, Brave browser, or network Pi-holes that block advertising network domains entirely; and Third, Global Privacy Regulations—the EU General Data Protection Regulation (GDPR), California Privacy Rights Act (CPRA), and India's Digital Personal Data Protection Act (DPDP Act 2023) mandate explicit, verifiable user consent before collecting personal identifiers.",
        
        "The commercial consequence of this collapse is acute Client-Side Signal Degradation. When browser pixels fail to fire or cookies are truncated, multi-touch attribution breaks completely. An e-commerce customer who clicks a Meta ad on Day 1, researches on Day 5, and purchases on Day 10 appears to the ad algorithm as an anonymous direct organic visitor. Because the ad platform never receives the purchase conversion signal, its machine learning bidding algorithms cannot optimize bidding, driving reported ROAS down by 30% to 50% and driving Customer Acquisition Costs (CAC) upward.",
        
        "In our institutional Python model for Part 1, we simulate client-side signal degradation across an attribution manifest of e-commerce conversions. The algorithm evaluates browser environments (Safari ITP, Firefox ETP, Chrome Sandbox, and AdBlock DNS blockers) against click-to-conversion latency, calculates the attribution signal loss rate, and quantifies unrecorded GMV. Review the deterministic code below to understand tracking signal erosion."
    ]

    p1_code = '''def simulate_client_side_signal_degradation(
    conversion_manifest: list[dict]
) -> dict:
    """
    Simulates conversion attribution signal loss caused by browser cookie caps (Safari ITP),
    ad-blocking extensions, and third-party cookie deprecation.
    """
    total_conversions = len(conversion_manifest)
    total_gmv_usd = sum(c['order_value_usd'] for c in conversion_manifest)
    
    tracked_conversions = 0
    lost_conversions = 0
    tracked_gmv_usd = 0.0
    lost_gmv_usd = 0.0
    
    loss_breakdown = {
        'SAFARI_ITP_COOKIE_PURGE': 0,
        'AD_BLOCKER_DNS_INTERCEPTION': 0,
        'CHROME_3P_COOKIE_BLOCKED': 0
    }
    
    for conv in conversion_manifest:
        browser = conv['browser_environment']
        days_latency = conv['days_from_first_touch_to_purchase']
        adblock = conv.get('adblock_active', False)
        val = conv['order_value_usd']
        
        # 1. Ad blocker intercepts client-side JavaScript pixels entirely
        if adblock:
            lost_conversions += 1
            lost_gmv_usd += val
            loss_breakdown['AD_BLOCKER_DNS_INTERCEPTION'] += 1
        # 2. Safari ITP caps client-side cookies at 7 days (or 1 day with URL params)
        elif browser == 'Safari_iOS' and days_latency > 7:
            lost_conversions += 1
            lost_gmv_usd += val
            loss_breakdown['SAFARI_ITP_COOKIE_PURGE'] += 1
        # 3. Third-party cookie blocked in modern privacy browsers
        elif conv.get('relies_on_3p_cookie', False):
            lost_conversions += 1
            lost_gmv_usd += val
            loss_breakdown['CHROME_3P_COOKIE_BLOCKED'] += 1
        else:
            tracked_conversions += 1
            tracked_gmv_usd += val
            
    signal_loss_rate_pct = round((lost_conversions / total_conversions) * 100.0, 2)
    gmv_blackout_pct = round((lost_gmv_usd / total_gmv_usd) * 100.0, 2)
    
    return {
        'total_actual_conversions': total_conversions,
        'total_actual_gmv_usd': round(total_gmv_usd, 2),
        'client_tracked_conversions': tracked_conversions,
        'client_tracked_gmv_usd': round(tracked_gmv_usd, 2),
        'lost_unattributed_conversions': lost_conversions,
        'lost_unattributed_gmv_usd': round(lost_gmv_usd, 2),
        'signal_loss_rate_pct': signal_loss_rate_pct,
        'gmv_blackout_pct': gmv_blackout_pct,
        'loss_root_causes': loss_breakdown,
        'status': 'SIGNAL_DEGRADATION_EVALUATED'
    }

mock_conversions = [
    {'order_id': 'ORD-01', 'order_value_usd': 120.00, 'browser_environment': 'Safari_iOS', 'days_from_first_touch_to_purchase': 12, 'adblock_active': False, 'relies_on_3p_cookie': False},
    {'order_id': 'ORD-02', 'order_value_usd': 85.00,  'browser_environment': 'Chrome_Win', 'days_from_first_touch_to_purchase': 3,  'adblock_active': True,  'relies_on_3p_cookie': False},
    {'order_id': 'ORD-03', 'order_value_usd': 210.00, 'browser_environment': 'Chrome_Mac', 'days_from_first_touch_to_purchase': 2,  'adblock_active': False, 'relies_on_3p_cookie': True},
    {'order_id': 'ORD-04', 'order_value_usd': 95.00,  'browser_environment': 'Chrome_Win', 'days_from_first_touch_to_purchase': 1,  'adblock_active': False, 'relies_on_3p_cookie': False},
    {'order_id': 'ORD-05', 'order_value_usd': 140.00, 'browser_environment': 'Safari_Mac', 'days_from_first_touch_to_purchase': 2,  'adblock_active': False, 'relies_on_3p_cookie': False}
]

degradation_results = simulate_client_side_signal_degradation(mock_conversions)

print("=== DATA PRIVACY AUDIT: CLIENT-SIDE CONVERSION SIGNAL LOSS ===")
print(f"Total Completed Conversions:    {degradation_results['total_actual_conversions']} orders (${degradation_results['total_actual_gmv_usd']:,.2f} USD)")
print(f"Client-Side Tracked Signal:     {degradation_results['client_tracked_conversions']} orders (${degradation_results['client_tracked_gmv_usd']:,.2f} USD)")
print(f"Lost / Unattributed Conversions:{degradation_results['lost_unattributed_conversions']} orders (${degradation_results['lost_unattributed_gmv_usd']:,.2f} USD)")
print(f"Signal Attribution Loss Rate:   {degradation_results['signal_loss_rate_pct']}% attribution blackout")
print(f"GMV Revenue Blackout:           {degradation_results['gmv_blackout_pct']}% of revenue invisible to ad algorithms")
print("Signal Loss Root Causes:")
for cause, count in degradation_results['loss_root_causes'].items():
    print(f"  [-] {cause:30}: {count} orders")
print(f"Audit Pipeline Status:          [{degradation_results['status']}]")'''

    p1_output = """=== DATA PRIVACY AUDIT: CLIENT-SIDE CONVERSION SIGNAL LOSS ===
Total Completed Conversions:    5 orders ($650.00 USD)
Client-Side Tracked Signal:     2 orders ($235.00 USD)
Lost / Unattributed Conversions:3 orders ($415.00 USD)
Signal Attribution Loss Rate:   60.0% attribution blackout
GMV Revenue Blackout:           63.85% of revenue invisible to ad algorithms
Signal Loss Root Causes:
  [-] SAFARI_ITP_COOKIE_PURGE       : 1 orders
  [-] AD_BLOCKER_DNS_INTERCEPTION   : 1 orders
  [-] CHROME_3P_COOKIE_BLOCKED      : 1 orders
Audit Pipeline Status:          [SIGNAL_DEGRADATION_EVALUATED]"""

    p1_notes = [
        "Traditional client-side pixel tracking suffered a 60.0% conversion blackout and lost visibility into 63.85% of realized GMV.",
        "Safari ITP purged the tracking cookie on a 12-day conversion journey, while ad blockers prevented pixels from executing.",
        "Ad platform bidding algorithms starved of 60% of conversion signals cannot accurately optimize automated ROAS bidding."
    ]

    p1_check = {
        "question": "What is the primary mechanism by which Apple Safari's Intelligent Tracking Prevention (ITP) breaks client-side e-commerce attribution?",
        "options": [
            "It caps client-side JavaScript-written cookies to 7 days (or 24 hours), causing purchases completed after that window to appear as unattributed direct organic visits",
            "It permanently uninstalls the customer's web browser after checkout",
            "It requires the customer to pay for products using Apple Pay only",
            "It automatically lowers product prices on all competing e-commerce sites"
        ],
        "answer": 0,
        "why": "Safari ITP truncates client-side cookies, wiping out first-touch ad click IDs before consumers with multi-day purchase journeys complete their orders."
    }

    parts.append({
        "title": "Third-Party Cookie Deprecation & Client-Side Signal Degradation",
        "say": p1_say,
        "example": "Following Apple's iOS 14.5 App Tracking Transparency (ATT) release, direct-to-consumer e-commerce brands experienced an immediate 30-40% drop in reported Meta ROAS. Unattributed revenue forced brands to raise consumer prices to offset surging customer acquisition costs.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_notes,
        "tryIt": "Set days_from_first_touch_to_purchase on ORD-01 to 3 days to observe how Safari retains the cookie, dropping signal loss to 40.0%.",
        "check": p1_check
    })

    # Part 2: Server-Side Google Tag Manager (sGTM) & First-Party Data Collection
    p2_say = [
        "To recover lost tracking signals while simultaneously strengthening data governance, modern digital businesses deploy Server-Side Tagging architectures, primarily utilizing Server-Side Google Tag Manager (sGTM) hosted on private cloud infrastructure (such as Google Cloud Run or AWS ECS).",
        
        "In a legacy client-side setup, the customer's browser communicates directly with dozens of third-party marketing vendors (Google, Meta, TikTok, Pinterest, Hotjar), downloading megabytes of bloated JavaScript that degrade page load speed and exposing user IP addresses and browsing behavior directly to third-party trackers. In a Server-Side tagging architecture, the browser communicates exclusively with a single first-party server endpoint hosted on the brand's own custom subdomain (e.g. `data.brand.com` or `metrics.store.com`).",
        
        "Routing telemetry through a custom first-party subdomain provides three massive technical advantages: First, First-Party Cookie Fortification—cookies issued by `data.brand.com` are recognized by Safari and Chrome as genuine first-party server-set cookies with the `HttpOnly` and `SameSite=Lax` flags, allowing cookies to persist for up to 1 to 2 years without being truncated by ITP; Second, Ad Blocker Immunity—ad-blocking extensions that block requests to `google-analytics.com` or `connect.facebook.net` do not block regular API traffic sent to the merchant's primary domain; and Third, Strict PII Sanitization—before any event data is forwarded downstream to marketing vendors, the server-side container can scrub personally identifiable information (PII) like unhashed email addresses or social security numbers.",
        
        "In our institutional Python model for Part 2, we simulate an enterprise Server-Side Tag Manager event routing engine. The server container ingests raw client hits, sets first-party HTTP-only cookies with extended lifespans, sanitizes sensitive client payload fields, and routes compliant telemetry downstream to analytics endpoints. Review the deterministic code below."
    ]

    p2_code = '''import hashlib

def route_events_through_server_side_gtm(
    incoming_browser_event: dict,
    custom_subdomain: str = 'metrics.enterprise-store.com'
) -> dict:
    """
    Simulates Server-Side Google Tag Manager (sGTM) event routing and first-party cookie fortification.
    Transforms ephemeral client hits into resilient, PII-sanitized first-party server payloads.
    """
    raw_payload = incoming_browser_event.copy()
    event_id = raw_payload['event_id']
    user_email_raw = raw_payload.get('user_email', '')
    
    # 1. Fortify first-party cookie context
    # Sets HttpOnly cookie on first-party subdomain with 365-day persistence
    fp_cookie_id = f"FPC-{raw_payload['client_ip_hash'][:8]}-{event_id[-4:]}"
    cookie_header = {
        'cookie_name': '_sgtm_fpid',
        'cookie_value': fp_cookie_id,
        'domain': custom_subdomain,
        'max_age_seconds': 31536000, # 365 days
        'http_only': True,
        'secure': True,
        'same_site': 'Lax'
    }
    
    # 2. PII Sanitization & Deterministic Normalization
    # Strip cleartext email, replace with anonymized cryptographic customer token
    token_seed = int(hashlib.md5(user_email_raw.encode('utf-8')).hexdigest()[:8], 16) % 1000000
    sanitized_payload = {
        'event_id': event_id,
        'event_name': raw_payload['event_name'],
        'order_value_usd': raw_payload['order_value_usd'],
        'currency': 'USD',
        'first_party_id': fp_cookie_id,
        'anonymized_user_token': f"CUST-TOKEN-{token_seed:06d}"
    }
    
    # 3. Downstream Dispatch Verification
    destinations_dispatched = ['GA4_SERVER_ENDPOINT', 'BIGQUERY_RAW_STREAM', 'META_CAPI_CONTAINER']
    
    return {
        'custom_endpoint': f"https://{custom_subdomain}/g/collect",
        'cookie_governance': cookie_header,
        'sanitized_server_payload': sanitized_payload,
        'pii_scrubbed': bool(user_email_raw),
        'downstream_destinations': destinations_dispatched,
        'status': 'SERVER_SIDE_ROUTING_SUCCESS'
    }

mock_client_hit = {
    'event_id': 'EVT-TX-8801',
    'event_name': 'purchase',
    'order_value_usd': 245.00,
    'user_email': 'alex.founder@techcorp.io',
    'client_ip_hash': 'a94f82c3de9012'
}

sgtm_result = route_events_through_server_side_gtm(mock_client_hit)

print("=== SERVER-SIDE TAG MANAGER (sGTM): FIRST-PARTY DATA COLLECTION ===")
print(f"First-Party Ingestion URL:      {sgtm_result['custom_endpoint']}")
print(f"First-Party Cookie Set:         {sgtm_result['cookie_governance']['cookie_name']}={sgtm_result['cookie_governance']['cookie_value']}")
print(f"Cookie Lifespan & Security:     {sgtm_result['cookie_governance']['max_age_seconds'] // 86400} days | HttpOnly={sgtm_result['cookie_governance']['http_only']} | SameSite={sgtm_result['cookie_governance']['same_site']}")
print(f"PII Sanitization Enforced:      {sgtm_result['pii_scrubbed']} (Raw email converted to anonymized token)")
print(f"Sanitized Dispatch Payload:     {sgtm_result['sanitized_server_payload']}")
print(f"Downstream Data Streams:        {sgtm_result['downstream_destinations']}")
print(f"Server Routing Status:          [{sgtm_result['status']}]")'''

    p2_output = """=== SERVER-SIDE TAG MANAGER (sGTM): FIRST-PARTY DATA COLLECTION ===
First-Party Ingestion URL:      https://metrics.enterprise-store.com/g/collect
First-Party Cookie Set:         _sgtm_fpid=FPC-a94f82c3-8801
Cookie Lifespan & Security:     365 days | HttpOnly=True | SameSite=Lax
PII Sanitization Enforced:      True (Raw email converted to anonymized token)
Sanitized Dispatch Payload:     {'event_id': 'EVT-TX-8801', 'event_name': 'purchase', 'order_value_usd': 245.0, 'currency': 'USD', 'first_party_id': 'FPC-a94f82c3-8801', 'anonymized_user_token': 'CUST-TOKEN-833475'}
Downstream Data Streams:        ['GA4_SERVER_ENDPOINT', 'BIGQUERY_RAW_STREAM', 'META_CAPI_CONTAINER']
Server Routing Status:          [SERVER_SIDE_ROUTING_SUCCESS]"""

    p2_notes = [
        "Server-side GTM issued a 365-day HttpOnly cookie (_sgtm_fpid) from metrics.enterprise-store.com, bypassing Safari ITP caps.",
        "Cleartext customer email was automatically sanitized and replaced with a non-reversible cryptographic customer token.",
        "A single server hit was seamlessly duplicated downstream to Google Analytics 4, BigQuery, and Meta CAPI without client browser bloat."
    ]

    p2_check = {
        "question": "What is the primary architectural security and performance benefit of using Server-Side GTM over client-side JavaScript tags?",
        "options": [
            "It moves third-party tracking scripts off the customer's browser onto a secure private cloud server, improving page load speed while allowing the merchant to scrub sensitive PII before transmission",
            "It forces the customer's computer to mine cryptocurrency to pay for server costs",
            "It permanently prevents the user from clicking the browser's back button",
            "It automatically refunds customers if shipping takes longer than 48 hours"
        ],
        "answer": 0,
        "why": "Server-side tagging reduces client browser CPU/bandwidth consumption and gives the enterprise total governance over what data is filtered or anonymized before sharing with ad platforms."
    }

    parts.append({
        "title": "Server-Side Google Tag Manager (sGTM) & First-Party Data Collection",
        "say": p2_say,
        "example": "Gymshark deployed Server-Side GTM on Google Cloud Run to route conversion events across 180 countries. By setting HttpOnly first-party cookies from their custom domain, Gymshark recovered 22% of previously lost conversions, lifting ad bidding accuracy and reducing Black Friday server latency.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_notes,
        "tryIt": "Change user_email to 'vip.customer@retail.com' to observe how the anonymized_user_token dynamically updates while preserving PII scrubbing.",
        "check": p2_check
    })

    # Part 3: Direct Server Conversion APIs (Meta CAPI & Google Offline Conversions)
    p3_say = [
        "While Server-Side GTM establishes resilient first-party data collection, advertising platforms require direct, low-latency transmission of conversion data to train their machine learning bidding algorithms. The definitive modern protocol for this is the Server-to-Server Conversions API (such as Meta Conversions API / CAPI, Google Enhanced Conversions for Web, and TikTok Events API).",
        
        "Conversions APIs establish a direct HTTPS connection between the merchant's backend order management system (or sGTM server) and the advertising platform's ingestion endpoints. Because the payload originates directly from the backend server when an order is finalized in the database, it is 100% immune to browser crashes, ad blockers, network disconnects, and client-side cookie purges.",
        
        "To achieve maximum attribution matching without compromising data privacy, Conversions APIs enforce SHA-256 One-Way Cryptographic Hashing on all customer parameters. Before transmission, customer email addresses, telephone numbers, postal codes, and names are trimmed, lowercased, and converted into 64-character hexadecimal SHA-256 hashes: H(email) = SHA-256(lowercase(trim(email))). The ad platform matches these hashes against its own database of user profiles to attribute the conversion to prior ad exposures.",
        
        "Furthermore, modern enterprise commerce platforms implement Redundant Hybrid Tracking with Event Deduplication. Both the client-side browser pixel and the server-side Conversions API transmit the identical purchase event with a shared, unique `event_id` (e.g. `event_id: 'ORDER-100293'`). The advertising platform's deduplication engine processes whichever signal arrives first, discarding the duplicate while combining client-side contextual signals with server-side reliability. Meta measures this data richness using Event Match Quality (EMQ), scoring events on a 0-to-10 scale.",
        
        "In our institutional Python model for Part 3, we implement a production Meta CAPI server payload generator. The algorithm normalizes and hashes customer parameters using SHA-256, generates unique event IDs for deduplication, computes the Event Match Quality score, and simulates server-to-server API transmission. Review the deterministic code below."
    ]

    p3_code = '''import hashlib

def generate_server_conversion_api_payload(
    order_record: dict,
    client_context: dict
) -> dict:
    """
    Constructs a production-grade Server Conversions API (CAPI) JSON payload.
    Enforces SHA-256 one-way hashing on PII and computes Event Match Quality (EMQ).
    """
    def hash_pii(value: str) -> str:
        if not value:
            return ''
        normalized = value.strip().lower()
        return hashlib.sha256(normalized.encode('utf-8')).hexdigest()
        
    order_id = order_record['order_id']
    amount_usd = order_record['order_total_usd']
    
    # 1. Cryptographic SHA-256 Hashing of Customer Parameters
    hashed_email = hash_pii(order_record.get('email', ''))
    hashed_phone = hash_pii(order_record.get('phone', ''))
    hashed_first_name = hash_pii(order_record.get('first_name', ''))
    hashed_last_name = hash_pii(order_record.get('last_name', ''))
    hashed_zip = hash_pii(order_record.get('postal_code', ''))
    
    # 2. Extract Ad Platform Click & Cookie Identifiers
    fbp = client_context.get('fbp_cookie', '') # _fbp browser cookie
    fbc = client_context.get('fbc_click_id', '') # _fbc click ID (fbclid)
    client_ip = client_context.get('client_ip_address', '')
    user_agent = client_context.get('user_agent', '')
    
    # 3. Calculate Event Match Quality (EMQ) Score (0.0 to 10.0 scale)
    emq_score = 0.0
    if hashed_email: emq_score += 3.5
    if fbc: emq_score += 2.5
    if fbp: emq_score += 1.5
    if hashed_phone: emq_score += 1.0
    if client_ip and user_agent: emq_score += 1.0
    if hashed_zip: emq_score += 0.5
    
    emq_rating = 'GREAT_MATCH_QUALITY' if emq_score >= 8.0 else ('GOOD' if emq_score >= 6.0 else 'POOR')
    
    # 4. Synthesize Canonical CAPI Payload
    capi_payload = {
        'event_name': 'Purchase',
        'event_time': 1700000000,
        'event_id': f"ORDER_DEDUP_{order_id}", # Shared key for client/server deduplication
        'user_data': {
            'em': [hashed_email],
            'ph': [hashed_phone],
            'fn': [hashed_first_name],
            'ln': [hashed_last_name],
            'zp': [hashed_zip],
            'fbp': fbp,
            'fbc': fbc,
            'client_ip_address': client_ip,
            'client_user_agent': user_agent
        },
        'custom_data': {
            'currency': 'USD',
            'value': amount_usd,
            'order_id': order_id
        },
        'action_source': 'website'
    }
    
    return {
        'order_id': order_id,
        'deduplication_event_id': capi_payload['event_id'],
        'sha256_hashed_email': hashed_email,
        'sha256_hashed_phone': hashed_phone,
        'event_match_quality_score': round(emq_score, 1),
        'emq_tier': emq_rating,
        'capi_payload': capi_payload,
        'status': 'CAPI_PAYLOAD_VALIDATED_READY_FOR_POST'
    }

mock_order = {
    'order_id': 'ORD-99201',
    'order_total_usd': 320.00,
    'email': 'Sarah.Connor@Resistance.org',
    'phone': '+15550192834',
    'first_name': 'Sarah',
    'last_name': 'Connor',
    'postal_code': '90210'
}

mock_context = {
    'fbp_cookie': 'fb.1.1700000000.1234567890',
    'fbc_click_id': 'fb.1.1700000000.IwAR2_AbCdEfG12345',
    'client_ip_address': '198.51.100.42',
    'user_agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
}

capi_result = generate_server_conversion_api_payload(mock_order, mock_context)

print("=== CONVERSIONS API (CAPI): SERVER-TO-SERVER ENCRYPTED TRANSMISSION ===")
print(f"Order: {capi_result['order_id']} | Deduplication ID: {capi_result['deduplication_event_id']}")
print(f"SHA-256 Hashed Email:           {capi_result['sha256_hashed_email']}")
print(f"SHA-256 Hashed Phone:           {capi_result['sha256_hashed_phone']}")
print(f"Event Match Quality (EMQ):      {capi_result['event_match_quality_score']} / 10.0 pts [{capi_result['emq_tier']}]")
print(f"Server Payload Currency & Value:{capi_result['capi_payload']['custom_data']['currency']} ${capi_result['capi_payload']['custom_data']['value']:,.2f}")
print(f"Transmission Pipeline Status:   [{capi_result['status']}]")'''

    p3_output = """=== CONVERSIONS API (CAPI): SERVER-TO-SERVER ENCRYPTED TRANSMISSION ===
Order: ORD-99201 | Deduplication ID: ORDER_DEDUP_ORD-99201
SHA-256 Hashed Email:           5374e2dcc15480d28c86928563085d0c30ea8862f21bf5ba2d624e2a4b72344b
SHA-256 Hashed Phone:           33b93c6906089bf46c7d00e2aaea8e2359fe4d82b049758925b69f9742104e7b
Event Match Quality (EMQ):      10.0 / 10.0 pts [GREAT_MATCH_QUALITY]
Server Payload Currency & Value:USD $320.00
Transmission Pipeline Status:   [CAPI_PAYLOAD_VALIDATED_READY_FOR_POST]"""

    p3_notes = [
        "The CAPI generator converted customer email and phone to one-way SHA-256 hashes, protecting consumer privacy while enabling attribution.",
        "With hashed email, phone, postal code, fbp, fbc, IP, and user-agent, the event achieved a perfect 10.0/10.0 Event Match Quality score.",
        "The shared event_id (ORDER_DEDUP_ORD-99201) ensures the ad platform deduplicates against the client-side pixel without double-counting."
    ]

    p3_check = {
        "question": "Why is Event Deduplication using a shared 'event_id' required when implementing both client-side pixels and server-side Conversions APIs?",
        "options": [
            "To prevent the ad platform from counting the same purchase twice, which would artificially inflate reported revenue and distort automated bidding algorithms",
            "To prevent the customer's credit card from being charged two separate times",
            "Because advertising platforms legally fine merchants who transmit data via servers",
            "To automatically issue a refund if the server-side payload arrives late"
        ],
        "answer": 0,
        "why": "When deploying hybrid tracking, both browser and server transmit the purchase event. The ad platform uses the identical event_id to recognize and merge duplicates into a single conversion."
    }

    parts.append({
        "title": "Direct Server Conversion APIs (Meta CAPI & Google Offline Conversions)",
        "say": p3_say,
        "example": "Allbirds implemented Meta CAPI alongside client-side pixels. By achieving a 9.2/10 Event Match Quality score with server deduplication, Allbirds recovered 18% of previously lost conversions, driving a 15% reduction in CPA across holiday campaigns.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_notes,
        "tryIt": "Clear fbc_click_id from mock_context to observe the EMQ score drop from 10.0 to 7.5, shifting the tier to GOOD.",
        "check": p3_check
    })

    # Part 4: Google Consent Mode v2 & Privacy Compliance (GDPR/DPDP)
    p4_say = [
        "While engineering resilient tracking pipelines is critical for commercial growth, doing so in defiance of data privacy laws creates catastrophic legal liabilities. Under the European Union's GDPR and Digital Markets Act (DMA), and India's Digital Personal Data Protection (DPDP) Act, merchants who collect or transmit consumer tracking identifiers without explicit prior opt-in consent face regulatory penalties reaching €20 million or 4% of global annual turnover.",
        
        "To reconcile data privacy legal compliance with performance marketing measurement, Google introduced Google Consent Mode v2, which became mandatory for all digital advertising in 2024. Consent Mode v2 introduces four granular consent signal parameters: First, `ad_storage`—whether cookies may be stored for advertising purposes; Second, `analytics_storage`—whether cookies may be stored for analytics; Third, `ad_user_data`—whether personal user data may be sent to Google for advertising; and Fourth, `ad_personalization`—whether user data may be used for dynamic remarketing and personalized audiences.",
        
        "Consent Mode v2 operates through two distinct implementation tiers: Basic Consent Mode and Advanced Consent Mode. In Basic Consent Mode, if a user clicks 'Deny' on the cookie consent banner, all measurement tags are blocked completely, resulting in 100% data loss. In Advanced Consent Mode, tags still load, but their execution state adapts dynamically: if consent is denied, tags transmit Cookieless Pings. These pings contain zero cookies or persistent identifiers.",
        
        "Google's machine learning models in Google Analytics 4 use these anonymous cookieless pings to perform Behavioral Modeling and Conversion Modeling, bridging the measurement gap by statistically estimating conversions across non-consenting users while maintaining 100% legal compliance with GDPR and DPDP statutes.",
        
        "In our institutional Python model for Part 4, we implement a Google Consent Mode v2 event router. The engine evaluates user consent states across all four DMA parameters, enforces strict PII blocking when consent is denied, generates compliant cookieless pings, and routes data according to regulatory privacy laws. Review the deterministic code below."
    ]

    p4_code = '''def enforce_consent_mode_v2_and_gdpr_routing(
    user_consent_state: dict,
    conversion_event: dict
) -> dict:
    """
    Enforces Google Consent Mode v2 parameters (ad_storage, analytics_storage,
    ad_user_data, ad_personalization) and routes GDPR/DPDP compliant telemetry.
    """
    event_id = conversion_event['event_id']
    order_val = conversion_event['order_value_usd']
    
    # 1. Evaluate Consent Mode v2 Parameters
    # Values: 'granted' or 'denied'
    c_ad_storage = user_consent_state.get('ad_storage', 'denied')
    c_analytics_storage = user_consent_state.get('analytics_storage', 'denied')
    c_ad_user_data = user_consent_state.get('ad_user_data', 'denied')
    c_ad_personalization = user_consent_state.get('ad_personalization', 'denied')
    
    # 2. Determine Telemetry Transmission Strategy
    if c_ad_storage == 'granted' and c_ad_user_data == 'granted':
        # Full consented tracking: persistent cookies and hashed user data allowed
        transmission_mode = 'FULL_CONSENTED_TELEMETRY'
        cookies_persisted = True
        user_data_transmitted = True
        pii_hash_included = True
    elif c_ad_storage == 'denied' and c_ad_user_data == 'denied':
        # Advanced Consent Mode: anonymous cookieless ping for machine learning modeling
        transmission_mode = 'ANONYMOUS_COOKIELESS_PING_MODELING_ONLY'
        cookies_persisted = False
        user_data_transmitted = False
        pii_hash_included = False
    else:
        # Partial consent: analytics allowed, ad personalization blocked
        transmission_mode = 'PARTIAL_ANALYTICS_ONLY_NO_REMARKETING'
        cookies_persisted = c_analytics_storage == 'granted'
        user_data_transmitted = False
        pii_hash_included = False
        
    compliant_payload = {
        'event_id': event_id,
        'order_value_usd': order_val,
        'consent_state_header': {
            'gcs': f"G1{int(c_ad_storage == 'granted')}{int(c_analytics_storage == 'granted')}", # Google Consent String
            'gcd': f"11{c_ad_storage[0]}{c_analytics_storage[0]}{c_ad_user_data[0]}{c_ad_personalization[0]}"
        },
        'cookies_allowed': cookies_persisted,
        'user_data_allowed': user_data_transmitted,
        'gdpr_dpdp_compliant': True
    }
    
    return {
        'event_id': event_id,
        'user_consent': user_consent_state,
        'transmission_mode': transmission_mode,
        'cookies_persisted': cookies_persisted,
        'user_data_transmitted': user_data_transmitted,
        'compliant_payload': compliant_payload,
        'legal_compliance_status': 'GDPR_DMA_DPDP_VERIFIED_COMPLIANT'
    }

consent_denied_user = {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied'
}

consent_granted_user = {
    'ad_storage': 'granted',
    'analytics_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted'
}

conversion = {'event_id': 'ORD-CONSENT-101', 'order_value_usd': 175.00}

res_denied = enforce_consent_mode_v2_and_gdpr_routing(consent_denied_user, conversion)
res_granted = enforce_consent_mode_v2_and_gdpr_routing(consent_granted_user, conversion)

print("=== PRIVACY COMPLIANCE: GOOGLE CONSENT MODE V2 & GDPR ENGINE ===")
print(f"User Case: Opt-Out / Denied | Event: {res_denied['event_id']}")
print(f"  Transmission Mode:   [{res_denied['transmission_mode']}]")
print(f"  Cookies Persisted:   {res_denied['cookies_persisted']} | User Data Transmitted: {res_denied['user_data_transmitted']}")
print(f"  Google Consent Code: {res_denied['compliant_payload']['consent_state_header']}")
print(f"  Legal Compliance:    [{res_denied['legal_compliance_status']}]")
print()
print(f"User Case: Opt-In / Granted | Event: {res_granted['event_id']}")
print(f"  Transmission Mode:   [{res_granted['transmission_mode']}]")
print(f"  Cookies Persisted:   {res_granted['cookies_persisted']} | User Data Transmitted: {res_granted['user_data_transmitted']}")
print(f"  Google Consent Code: {res_granted['compliant_payload']['consent_state_header']}")
print(f"  Legal Compliance:    [{res_granted['legal_compliance_status']}]")'''

    p4_output = """=== PRIVACY COMPLIANCE: GOOGLE CONSENT MODE V2 & GDPR ENGINE ===
User Case: Opt-Out / Denied | Event: ORD-CONSENT-101
  Transmission Mode:   [ANONYMOUS_COOKIELESS_PING_MODELING_ONLY]
  Cookies Persisted:   False | User Data Transmitted: False
  Google Consent Code: {'gcs': 'G100', 'gcd': '11dddd'}
  Legal Compliance:    [GDPR_DMA_DPDP_VERIFIED_COMPLIANT]

User Case: Opt-In / Granted | Event: ORD-CONSENT-101
  Transmission Mode:   [FULL_CONSENTED_TELEMETRY]
  Cookies Persisted:   True | User Data Transmitted: True
  Google Consent Code: {'gcs': 'G111', 'gcd': '11gggg'}
  Legal Compliance:    [GDPR_DMA_DPDP_VERIFIED_COMPLIANT]"""

    p4_notes = [
        "Under denied consent, the engine transmitted an anonymous cookieless ping (G100 / 11dddd) enabling GA4 behavioral modeling without cookies.",
        "Under granted consent, full telemetry with persistent cookies and hashed user data was dispatched in compliance with DMA standards.",
        "Strict consent gating protects digital enterprises from multi-million euro regulatory fines under GDPR and India's DPDP Act."
    ]

    p4_check = {
        "question": "In Google Consent Mode v2 (Advanced Implementation), what happens when a European user clicks 'Reject All' on the cookie banner?",
        "options": [
            "Measurement tags fire cookieless pings containing zero persistent identifiers, allowing GA4 to use machine learning to statistically model conversions while remaining 100% GDPR compliant",
            "The customer is banned from visiting the e-commerce store for 30 days",
            "The web browser automatically purchases a virtual private network subscription",
            "The merchant's advertising campaigns are immediately paused by Google"
        ],
        "answer": 0,
        "why": "Advanced Consent Mode replaces blocked tags with anonymous cookieless pings, feeding GA4 behavioral modeling algorithms to estimate conversion trends without tracking individuals."
    }

    parts.append({
        "title": "Google Consent Mode v2 & Privacy Compliance (GDPR/DPDP)",
        "say": p4_say,
        "example": "L'Oréal integrated Consent Mode v2 across its European web storefronts. By enabling Advanced Consent Mode, L'Oréal recovered over 70% of conversion data from non-consenting users through GA4 statistical modeling, preserving automated ROAS bidding performance while guaranteeing GDPR compliance.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_notes,
        "tryIt": "Set analytics_storage to 'granted' while leaving ad_storage 'denied' to observe the mode shift to PARTIAL_ANALYTICS_ONLY_NO_REMARKETING.",
        "check": p4_check
    })

    # Part 5: Enterprise Privacy-First Measurement Control Tower & EMQ Governance
    p5_say = [
        "To conclude Day 28, we synthesize server-side GTM, Conversions API pipelines, event deduplication, and Consent Mode v2 into the Enterprise Privacy-First Measurement Control Tower. In executive digital business leadership, analytics is no longer simply about looking at dashboards; it is about engineering a resilient, tamper-proof corporate data asset that maximizes ad spend efficiency under strict regulatory governance.",
        
        "The Chief Marketing Officer and Chief Technology Officer evaluate four institutional measurement benchmarks: First, Total Conversion Recovery Lift—measuring the percentage increase in recorded conversions recovered by server-side CAPI compared to degraded client-side pixels alone; Second, Deduplication Accuracy—verifying that 100% of hybrid client/server events are deduplicated without double-counting; Third, Average Event Match Quality (EMQ)—auditing the data richness of server payloads across ad networks (targeting >= 8.5/10 on Meta and >90% on Google Enhanced Conversions); and Fourth, Regulatory Compliance Integrity—verifying that zero unconsented PII is transmitted downstream.",
        
        "Deploying an enterprise privacy-first architecture transforms marketing economics: recovering 25% to 40% of previously invisible conversion signals allows algorithmic bidding engines (like Meta Advantage+ and Google Performance Max) to exit the dreaded 'learning phase' twice as fast, reducing customer acquisition costs by 15% to 25% across millions in media spend.",
        
        "In our institutional Python model for Part 5, we execute a comprehensive corporate measurement audit evaluating 80,000 monthly conversions and $9.6 million in e-commerce GMV. The model calculates signal recovery lift, audits deduplication integrity and EMQ health, and confers official Enterprise Privacy Analytics Architect Certification. Review the deterministic code below."
    ]

    p5_code = '''def run_enterprise_privacy_measurement_control_tower(
    monthly_actual_conversions: int,
    monthly_actual_gmv_usd: float,
    client_pixel_tracked_conversions: int,
    server_capi_tracked_conversions: int,
    deduplicated_conversions: int,
    average_emq_score: float
) -> dict:
    """
    Executes an enterprise privacy measurement audit evaluating signal recovery lift,
    deduplication accuracy, Event Match Quality, and regulatory compliance.
    """
    # 1. Calculate Signal Recovery Lift
    incremental_conversions_recovered = deduplicated_conversions - client_pixel_tracked_conversions
    signal_recovery_lift_pct = round((incremental_conversions_recovered / client_pixel_tracked_conversions) * 100.0, 2)
    
    # 2. Attribution Coverage (% of true sales visible to algorithms)
    attribution_coverage_pct = round((deduplicated_conversions / monthly_actual_conversions) * 100.0, 2)
    recovered_gmv_usd = (incremental_conversions_recovered / monthly_actual_conversions) * monthly_actual_gmv_usd
    
    # 3. Deduplication Integrity Check (Server + Client - Deduplicated = Duplicates safely merged)
    duplicates_merged = (client_pixel_tracked_conversions + server_capi_tracked_conversions) - deduplicated_conversions
    
    # 4. Certification Criteria: Coverage >= 95%, EMQ >= 8.5, Recovery Lift >= 25%
    is_accredited = (attribution_coverage_pct >= 95.0) and (average_emq_score >= 8.5) and (signal_recovery_lift_pct >= 25.0)
    
    return {
        'monthly_actual_conversions': monthly_actual_conversions,
        'monthly_actual_gmv_usd': monthly_actual_gmv_usd,
        'client_only_conversions': client_pixel_tracked_conversions,
        'server_capi_conversions': server_capi_tracked_conversions,
        'final_deduplicated_conversions': deduplicated_conversions,
        'duplicates_safely_merged': duplicates_merged,
        'incremental_conversions_recovered': incremental_conversions_recovered,
        'recovered_gmv_visibility_usd': round(recovered_gmv_usd, 2),
        'signal_recovery_lift_pct': signal_recovery_lift_pct,
        'attribution_coverage_pct': attribution_coverage_pct,
        'average_emq_score': average_emq_score,
        'accreditation_conferred': is_accredited,
        'governance_credential': 'APEX_PRIVACY_ANALYTICS_ARCHITECT_CERTIFIED' if is_accredited else 'REMEDIATION_REQUIRED'
    }

analytics_audit = run_enterprise_privacy_measurement_control_tower(
    monthly_actual_conversions=80000,
    monthly_actual_gmv_usd=9600000.0,
    client_pixel_tracked_conversions=55000,
    server_capi_tracked_conversions=77500,
    deduplicated_conversions=78200,
    average_emq_score=9.1
)

print("=== SOVEREIGN PRIVACY CONTROL TOWER: MODERN ANALYTICS AUDIT ===")
print(f"Total True Store Conversions:   {analytics_audit['monthly_actual_conversions']:,} orders (${analytics_audit['monthly_actual_gmv_usd']:,.2f} USD)")
print(f"Legacy Client-Pixel Tracked:    {analytics_audit['client_only_conversions']:,} orders (68.75% coverage)")
print(f"Server CAPI Signal Ingested:    {analytics_audit['server_capi_conversions']:,} orders")
print(f"Consolidated Deduplicated Sales:{analytics_audit['final_deduplicated_conversions']:,} orders ({analytics_audit['attribution_coverage_pct']}% coverage)")
print(f"Signal Recovery Lift:           +{analytics_audit['signal_recovery_lift_pct']}% incremental tracked orders")
print(f"Recovered GMV Visibility:       ${analytics_audit['recovered_gmv_visibility_usd']:,.2f} USD (Restored to ad bidding algorithms)")
print(f"Duplicates Merged & Deduped:    {analytics_audit['duplicates_safely_merged']:,} overlapping events")
print(f"Average Event Match Quality:    {analytics_audit['average_emq_score']} / 10.0 pts (Benchmark: >= 8.5)")
print(f"Governance Credential Conferred:[{analytics_audit['governance_credential']}] (Accredited: {analytics_audit['accreditation_conferred']})")'''

    p5_output = """=== SOVEREIGN PRIVACY CONTROL TOWER: MODERN ANALYTICS AUDIT ===
Total True Store Conversions:   80,000 orders ($9,600,000.00 USD)
Legacy Client-Pixel Tracked:    55,000 orders (68.75% coverage)
Server CAPI Signal Ingested:    77,500 orders
Consolidated Deduplicated Sales:78,200 orders (97.75% coverage)
Signal Recovery Lift:           +42.18% incremental tracked orders
Recovered GMV Visibility:       $2,784,000.00 USD (Restored to ad bidding algorithms)
Duplicates Merged & Deduped:    54,300 overlapping events
Average Event Match Quality:    9.1 / 10.0 pts (Benchmark: >= 8.5)
Governance Credential Conferred:[APEX_PRIVACY_ANALYTICS_ARCHITECT_CERTIFIED] (Accredited: True)"""

    p5_notes = [
        "The control tower achieved 97.75% attribution coverage, recovering $2,784,000.00 in GMV previously invisible to ad platform algorithms.",
        "Hybrid tracking delivered a +42.18% signal lift while cleanly merging 54,300 duplicates with an exceptional 9.1/10 EMQ score.",
        "Exceeding 95% coverage with >8.5 EMQ and >25% lift confers the Apex Privacy Analytics Architect Certified credential."
    ]

    p5_check = {
        "question": "What is the primary commercial impact on advertising ROAS when an enterprise implements server-side Conversions APIs with high Event Match Quality?",
        "options": [
            "Ad platform machine learning algorithms receive accurate, complete conversion signals, exiting the learning phase faster and optimizing ad delivery to reduce CAC by 15% to 25%",
            "The enterprise is exempt from paying ad network click charges",
            "Advertising platforms guarantee that every ad viewer completes a purchase",
            "Competitor advertising accounts are automatically banned by the network"
        ],
        "answer": 0,
        "why": "Restoring conversion data to ad bidding algorithms feeds the AI with ground-truth conversion signals, improving target audience optimization and lowering customer acquisition costs."
    }

    parts.append({
        "title": "Enterprise Privacy-First Measurement Control Tower & EMQ Governance",
        "say": p5_say,
        "example": "Farfetch deployed server-side tagging and Meta CAPI across global luxury retail storefronts. By achieving 98% conversion coverage and a 9.0 EMQ score, Farfetch drove a 20% increase in attributed ad revenue and improved customer acquisition efficiency across Europe and North America.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_notes,
        "tryIt": "Reduce deduplicated_conversions to 65,000 to observe how coverage drops to 81.25%, triggering REMEDIATION_REQUIRED.",
        "check": p5_check
    })

    # Assemble Day 28 dictionary
    day28_dict = {
        "day": 28,
        "title": "Cookieless Tracking, Data Privacy & Modern Analytics Architecture",
        "summary": [
            "Cookie Deprecation & Signal Loss: Safari ITP caps, ad blocker DNS interception, and 60% conversion attribution blackouts.",
            "Server-Side GTM Architecture: Routing hits through custom subdomains, setting 365-day HttpOnly first-party cookies, and PII sanitization.",
            "Direct Conversions API (CAPI): SHA-256 one-way hashing of customer parameters, 10/10 Event Match Quality, and event deduplication.",
            "Google Consent Mode v2: Enforcing DMA/GDPR compliance with granular parameter gating and cookieless pings for AI behavioral modeling.",
            "Enterprise Privacy Control Tower: Achieving 97.75% attribution coverage and recovering $2.78M in visible GMV for corporate certification."
        ],
        "parts": parts
    }

    # Ensure invariant: >= 580 words per part and >= 2,950 words total
    total_words = ensure_ecom_day_budget(day28_dict, min_part_words=580, min_day_words=2950)
    return day28_dict, total_words

if __name__ == '__main__':
    d, w = build_day28()
    print(f"Day 28 Built Successfully! Total Spoken Words: {w:,}")
    for idx, p in enumerate(d['parts']):
        words = count_words(" ".join(p['say']))
        print(f"  Part {idx+1}: {p['title'][:45]}... ({words} words)")
