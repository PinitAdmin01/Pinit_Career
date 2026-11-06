"""
Day 9 Builder: First-Party Audience Segmentation, Lookalike Modeling & Algorithmic Seed Scaling
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Task: TASK-829
"""

import os
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words
from digital_marketing_budget_ensurer import ensure_dmkt_day_budget

def build_day09():
    parts = []

    # Part 1: Customer Data Platform (CDP) Ingestion & RFM Value Decile Segmentation
    p1_say = [
        "Welcome to Day 9 of Digital Marketing and Growth Hacking. Today, we address the single most valuable long-term asset in modern digital growth: First-Party Data Architecture, Customer Data Platforms (CDPs), and Algorithmic Audience Segmentation. With the accelerating deprecation of third-party tracking cookies and mobile advertising identifiers (Apple's ATT), brands that rely on rented third-party data broker lists face catastrophic signal degradation. Long-term market dominance belongs exclusively to organizations that capture, enrich, and activate their own proprietary first-party customer relationships.",
        
        "The foundational intelligence engine of first-party marketing is the RFM Customer Segmentation Framework. RFM evaluates every transacting customer across three quantitative behavioral dimensions: Recency (how many days have elapsed since their last purchase?), Frequency (how many discrete transactions have they completed across their lifetime?), and Monetary Value (what is the total gross revenue they have contributed to the business?).",
        
        "By assigning integer scores from 1 to 5 across Recency, Frequency, and Monetary dimensions, marketing data engineers segment a multi-million-customer database into actionable behavioral deciles. The apex tier is the 'Champions / VIP Tier' (scores of 5-5-5 or 4-5-5): customers who purchase frequently, have transacted recently, and generate disproportionately high order values. While Champions typically account for only 5% of total customer headcount, they routinely contribute 40% to 60% of total enterprise net gross margin.",
        
        "Identifying these top-decile VIPs is not merely an exercise in customer appreciation; it forms the critical mathematical foundation for all paid acquisition scaling. When media buyers export seed audiences to ad networks, seeding the algorithm with your entire customer database (including one-time discount seekers and refund requesters) poisons the lookalike machine learning model. Instead, isolating the top 5% Champions creates a pristine, high-signal seed audience that instructs ad networks to hunt exclusively for high-lifetime-value prospects.",
        
        "In our institutional Python simulation for Part 1, we construct an enterprise RFM Customer Profile Segmentor. The engine ingests raw customer transaction histories, calculates recency, frequency, and monetary scores, assigns standardized customer segment labels, and identifies the pristine VIP seed audience for paid media activation. Review the code below to see RFM segmentation execute deterministically."
    ]

    p1_code = '''def segment_rfm_customer_profiles(
    customer_records: list[dict],
    vip_spend_threshold: float = 500.0,
    vip_min_orders: int = 3
) -> dict:
    """
    Ingests customer transaction logs and calculates RFM segment classifications.
    Isolates Champions (VIPs) for ad network lookalike seed activation.
    """
    total_customers = len(customer_records)
    segmented_cohorts = {
        "VIP_CHAMPIONS": [],
        "LOYAL_CORE": [],
        "POTENTIAL_LOYALISTS": [],
        "AT_RISK_DORMANT": []
    }
    
    vip_revenue = 0.0
    total_revenue = 0.0
    
    for cust in customer_records:
        cid = cust["customer_id"]
        recency_days = cust["recency_days"]
        orders_count = cust["orders_count"]
        lifetime_spend = cust["lifetime_spend"]
        
        total_revenue += lifetime_spend
        
        # Classification Logic
        if lifetime_spend >= vip_spend_threshold and orders_count >= vip_min_orders and recency_days <= 60:
            segmented_cohorts["VIP_CHAMPIONS"].append(cid)
            vip_revenue += lifetime_spend
        elif orders_count >= 2 and recency_days <= 90:
            segmented_cohorts["LOYAL_CORE"].append(cid)
        elif recency_days <= 30 and orders_count == 1:
            segmented_cohorts["POTENTIAL_LOYALISTS"].append(cid)
        else:
            segmented_cohorts["AT_RISK_DORMANT"].append(cid)
            
    vip_count = len(segmented_cohorts["VIP_CHAMPIONS"])
    vip_pct = round((vip_count / total_customers) * 100.0, 1) if total_customers > 0 else 0.0
    vip_rev_pct = round((vip_revenue / total_revenue) * 100.0, 1) if total_revenue > 0 else 0.0
    
    return {
        "total_customers_analyzed": total_customers,
        "total_revenue_analyzed": round(total_revenue, 2),
        "vip_champions_count": vip_count,
        "vip_percentage_of_base": vip_pct,
        "vip_revenue_contribution": round(vip_revenue, 2),
        "vip_revenue_share_pct": vip_rev_pct,
        "seed_audience_status": "PRISTINE_VIP_SEED_EXTRACTED" if vip_count >= 1 else "SEED_VOLUME_INSUFFICIENT"
    }

if __name__ == "__main__":
    customers = [
        {"customer_id": "CUST-101", "recency_days": 14, "orders_count": 5, "lifetime_spend": 750.0},
        {"customer_id": "CUST-102", "recency_days": 25, "orders_count": 4, "lifetime_spend": 620.0},
        {"customer_id": "CUST-103", "recency_days": 45, "orders_count": 2, "lifetime_spend": 180.0},
        {"customer_id": "CUST-104", "recency_days": 18, "orders_count": 1, "lifetime_spend": 85.0},
        {"customer_id": "CUST-105", "recency_days": 180, "orders_count": 1, "lifetime_spend": 45.0}
    ]
    res = segment_rfm_customer_profiles(customers, vip_spend_threshold=500.0, vip_min_orders=3)
    print("Customer Data Platform (CDP) RFM Segmentation Report:")
    print(f"  Total Customer Records: {res['total_customers_analyzed']}")
    print(f"  Total Analyzed Revenue: ${res['total_revenue_analyzed']:,.2f}")
    print(f"  VIP Champions Extracted: {res['vip_champions_count']} ({res['vip_percentage_of_base']}%)")
    print(f"  VIP Revenue Contribution: ${res['vip_revenue_contribution']:,.2f} ({res['vip_revenue_share_pct']}%)")
    print(f"  Seed Audience Status: {res['seed_audience_status']}")
'''

    p1_output = """Customer Data Platform (CDP) RFM Segmentation Report:
  Total Customer Records: 5
  Total Analyzed Revenue: $1,680.00
  VIP Champions Extracted: 2 (40.0%)
  VIP Revenue Contribution: $1,370.00 (81.5%)
  Seed Audience Status: PRISTINE_VIP_SEED_EXTRACTED"""

    p1_example = (
        "Enterprise Case Study: An omni-channel luxury apparel retailer uploaded its entire 250,000-customer "
        "email list to Meta as a lookalike seed, but the resulting campaigns generated a dismal 1.4x ROAS. A marketing data "
        "scientist performed an RFM value audit, discovering that 70% of the uploaded list consisted of one-time outlet "
        "discount shoppers who never returned. The team rebuilt the seed list by applying strict RFM criteria (3+ orders, "
        "spent > $500, active within 60 days), isolating the top 12,000 VIP Champions who drove 68% of enterprise margin. "
        "Building a 1% lookalike audience from this refined VIP seed produced an instant surge to 3.8x ROAS, cutting acquisition "
        "CPA from $84 down to $38."
    )

    p1_code_notes = [
        "Ingests customer transaction logs and calculates RFM classifications across 5 customer profiles.",
        "Isolates 2 VIP Champions who contribute $1,370.00 (81.5%) of the $1,680.00 total customer revenue.",
        "Extracts PRISTINE_VIP_SEED_EXTRACTED cohort, guaranteeing high-signal seed input for algorithmic lookalike models."
    ]

    p1_tryit = "Increase vip_spend_threshold to $800.0 to observe how higher qualification criteria shrink the VIP cohort."

    p1_check = {
        "question": "Why should enterprise growth marketers build Lookalike audiences from top-decile RFM VIP Champions rather than their entire customer list?",
        "options": [
            "Seeding the algorithm with high-LTV VIPs trains machine learning models to identify high-value prospective buyers rather than low-margin discount hunters.",
            "Ad platforms charge 50% higher taxes on large audience uploads.",
            "Customer data platforms delete all customers who purchase fewer than three items.",
            "It eliminates the need to pay for web hosting server bandwidth."
        ],
        "answer": 0,
        "why": "Ad network lookalike models mirror the statistical characteristics of the seed list. Seeding with high-spending VIPs ensures the algorithm optimizes for high-LTV customers."
    }

    parts.append({
        "title": "Customer Data Platform (CDP) Ingestion & RFM Value Decile Segmentation",
        "say": p1_say,
        "example": p1_example,
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_code_notes,
        "tryIt": p1_tryit,
        "check": p1_check
    })

    # Part 2: Privacy-Preserving Custom Audience Cryptographic Hashing
    p2_say = [
        "Having extracted pristine VIP customer cohorts from the CDP, we must address the legal, architectural, and cryptographic protocols required to transmit this data to advertising platforms like Meta, Google, and LinkedIn.",
        
        "Under global data privacy regulations—including GDPR in Europe, CCPA/CPRA in California, and DPDP in India—uploading raw Personally Identifiable Information (PII) such as plaintext customer emails, phone numbers, and physical addresses to a third-party ad network is a severe criminal regulatory violation. Ad platforms require all customer identifiers to be cryptographically hashed using the Secure Hash Algorithm 256-bit (SHA-256) protocol prior to transmission.",
        
        "SHA-256 is a one-way mathematical cryptographic hashing function. Given an input string, SHA-256 produces a deterministic 64-character hexadecimal fingerprint (e.g., `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918`). Crucially, the process is computationally irreversible: it is impossible for an unauthorized party to decode the hash back into the original email address. When Meta receives the hashed list, it matches the hashes against its own internal database of pre-hashed user credentials.",
        
        "However, cryptographic hashing is unforgiving of formatting discrepancies: hashing `John.Doe@Example.com ` produces a completely different hash than `johndoe@example.com`! To achieve high Match Rates (the percentage of uploaded records that the ad platform successfully links to active user profiles), data engineers must enforce strict normalization standards: trimming leading/trailing whitespace, converting all text to lowercase, stripping punctuation, and formatting phone numbers under the international E.164 standard (e.g., `+14155552671`).",
        
        "In our institutional Python simulation for Part 2, we build a Privacy-Preserving First-Party Audience Hashing Engine. The engine normalizes raw customer emails and phone numbers, executes deterministic SHA-256 cryptographic hashing, audits payload hygiene, and simulates platform match rate resolution. Review the code below to see privacy-preserving hashing execute deterministically."
    ]

    p2_code = '''import hashlib

def hash_first_party_custom_audience_payload(
    raw_customers: list[dict]
) -> dict:
    """
    Normalizes and cryptographically hashes first-party customer records
    using SHA-256 under GDPR/CCPA privacy standards for ad network activation.
    """
    hashed_records = []
    
    for c in raw_customers:
        email = c.get("email", "").strip().lower()
        phone = c.get("phone", "").strip()
        # Clean phone: remove hyphens, spaces, parentheses
        clean_phone = "".join(ch for ch in phone if ch.isdigit() or ch == "+")
        
        # SHA-256 hashing
        email_hash = hashlib.sha256(email.encode("utf-8")).hexdigest() if email else None
        phone_hash = hashlib.sha256(clean_phone.encode("utf-8")).hexdigest() if clean_phone else None
        
        hashed_records.append({
            "customer_id": c.get("customer_id"),
            "email_sha256": email_hash,
            "phone_sha256": phone_hash
        })
        
    # Platform identity graph matching benchmark on normalized data
    match_rate_pct = 85.0
    matched_count = int(len(hashed_records) * (match_rate_pct / 100.0))
    
    compliance_status = "GDPR_CCPA_CRYPTO_HASHED_COMPLIANT"
    
    return {
        "raw_records_processed": len(raw_customers),
        "hashed_records": hashed_records,
        "simulated_matched_users": matched_count,
        "match_rate_percentage": match_rate_pct,
        "compliance_status": compliance_status
    }

if __name__ == "__main__":
    records = [
        {"customer_id": "CUST-101", "email": "Sarah.Connor@Resistance.org ", "phone": "+1 (555) 019-2834"},
        {"customer_id": "CUST-102", "email": "John.Reese@Cyberdyne.com", "phone": "+1 555-019-5821"}
    ]
    res = hash_first_party_custom_audience_payload(records)
    print("Privacy-Preserving First-Party Audience Hashing Report:")
    print(f"  Records Processed: {res['raw_records_processed']}")
    print(f"  Compliance Standard: {res['compliance_status']}")
    print(f"  Identity Graph Match Rate: {res['match_rate_percentage']}%")
    print("  Hashed Payload Samples:")
    for h in res['hashed_records']:
        print(f"    - ID: {h['customer_id']}")
        print(f"      Email Hash: {h['email_sha256'][:24]}... (64-char SHA256)")
        print(f"      Phone Hash: {h['phone_sha256'][:24]}... (64-char SHA256)")
'''

    p2_output = """Privacy-Preserving First-Party Audience Hashing Report:
  Records Processed: 2
  Compliance Standard: GDPR_CCPA_CRYPTO_HASHED_COMPLIANT
  Identity Graph Match Rate: 85.0%
  Hashed Payload Samples:
    - ID: CUST-101
      Email Hash: 5374e2dcc15480d28c869285... (64-char SHA256)
      Phone Hash: 33b93c6906089bf46c7d00e2... (64-char SHA256)
    - ID: CUST-102
      Email Hash: fe573a3f98bd3a0a5e15271f... (64-char SHA256)
      Phone Hash: f769dfe113e11e4908f86ef1... (64-char SHA256)"""

    p2_example = (
        "Enterprise Case Study: A national fintech bank faced a potential $10M GDPR fine for exporting plaintext "
        "customer loan application data to third-party ad pixels. The security and growth engineering teams deployed an "
        "automated data transformation pipeline that intercepts all customer records, strips whitespace, converts text to lowercase, "
        "and hashes emails and phone numbers via SHA-256 before transmitting payloads over HTTPS. Normalizing records increased "
        "their Meta identity graph match rate from 52% to 85%, allowing the bank to reactivate 65,000 existing depositors while "
        "achieving 100% statutory privacy compliance."
    )

    p2_code_notes = [
        "Normalizes PII by stripping whitespace, converting emails to lowercase, and formatting international phone numbers.",
        "Generates deterministic 64-character SHA-256 cryptographic hashes for full GDPR/CCPA privacy compliance.",
        "Simulates an 85.0% identity graph match rate, validating clean data hygiene for ad platform activation."
    ]

    p2_tryit = "Add a third customer record and observe how the engine automatically formats and hashes both email and phone fields."

    p2_check = {
        "question": "Why must customer PII (such as emails and phone numbers) be normalized and hashed with SHA-256 before uploading to ad platforms?",
        "options": [
            "It protects consumer privacy under GDPR/CCPA by ensuring PII cannot be reversed, while clean normalization ensures maximum identity graph match rates.",
            "SHA-256 compresses customer data to reduce website hosting costs by 90%.",
            "Ad platforms automatically block accounts that upload fewer than 10,000 plaintext files.",
            "Hashing converts customer records into high-resolution JPG images."
        ],
        "answer": 0,
        "why": "SHA-256 is an irreversible cryptographic hash required by privacy regulations (GDPR/CCPA); normalizing text ensures identical hashes match across ad identity graphs."
    }

    parts.append({
        "title": "Privacy-Preserving Custom Audience Cryptographic Hashing",
        "say": p2_say,
        "example": p2_example,
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_code_notes,
        "tryIt": p2_tryit,
        "check": p2_check
    })

    # Part 3: Lookalike (LAL) Modeling & Algorithmic Seed Audience Scaling
    p3_say = [
        "Once a privacy-compliant custom audience of VIP customers is ingested into the advertising network, performance marketers leverage one of the most powerful machine learning capabilities in digital advertising: Algorithmic Lookalike (LAL) Modeling.",
        
        "A Lookalike Audience is a prospective target audience generated by ad platform machine learning algorithms. The algorithm analyzes the shared demographic attributes, browsing behaviors, app installations, purchasing patterns, and content engagement habits of the individuals in your uploaded seed list. The model then scans the entire active user population of the target country to identify individuals who exhibit statistical affinity to your seed customers.",
        
        "Lookalike audiences are configured in percentage tiers ranging from 1% to 10% of the total target country population. The formula for estimated audience size is: Reach = Total Country Active Users * (LAL Tier % / 100). For example, in a country with 200,000,000 active social media users, a 1.0% Lookalike Audience encompasses exactly: 200,000,000 * 0.01 = 2,000,000 prospective users.",
        
        "There is an inverse relationship between Lookalike Percentage Tier, Audience Similarity, and Reach. The 1% Lookalike represents the top 1% of the population that most closely matches your seed customers: it possesses the highest statistical similarity, delivers the highest conversion rates, and commands the highest ROAS. As you expand to 2%, 3%, 5%, and 10% lookalikes, audience reach scales proportionally (up to 20,000,000 users at 10%), but topical similarity and conversion affinity dilute.",
        
        "Enterprise growth strategists utilize a Tiered Lookalike Scaling Strategy. During initial product-market fit or cash-constrained growth phases, budgets are concentrated exclusively on the 1% tier. As media budgets scale past $50,000/month and the 1% audience fatigues, media buyers horizontally expand into 2% and 3-5% tiers, layering custom creative hooks to capture broad-reach demand while maintaining acceptable unit economics.",
        
        "In our institutional Python model for Part 3, we implement the Lookalike Reach and Audience Tier Evaluator. The function takes the total country addressable population and the lookalike percentage tier, calculates the exact estimated audience size, verifies the audience tier classification, and outputs the targeting dossier. Review the code below to see lookalike calculations execute deterministically."
    ]

    p3_code = '''def calculate_lookalike_reach(
    total_country_population: int,
    lookalike_tier_percent: float # e.g., 1.0 for 1% Lookalike
) -> dict:
    """
    Calculates estimated audience size and affinity classification
    for an algorithmic Lookalike (LAL) audience tier.
    Formula: Reach = Total Population * (LAL % / 100)
    """
    fraction = lookalike_tier_percent / 100.0
    estimated_size = int(total_country_population * fraction)
    
    # Classify similarity and reach tiers
    if lookalike_tier_percent <= 1.0:
        tier_status = "1_PERCENT_HIGHEST_SIMILARITY"
        affinity_score = 98.0
    elif lookalike_tier_percent <= 3.0:
        tier_status = "2_TO_3_PERCENT_HIGH_SIMILARITY"
        affinity_score = 85.0
    elif lookalike_tier_percent <= 5.0:
        tier_status = "4_TO_5_PERCENT_BALANCED_SCALE"
        affinity_score = 70.0
    else:
        tier_status = "6_TO_10_PERCENT_BROAD_EXPANSION"
        affinity_score = 50.0
        
    return {
        "totalCountryPopulation": total_country_population,
        "lookalikeTierPercent": lookalike_tier_percent,
        "estimatedAudienceSize": estimated_size,
        "tierStatus": tier_status,
        "affinityScore": affinity_score
    }

if __name__ == "__main__":
    res = calculate_lookalike_reach(total_country_population=200000000, lookalike_tier_percent=1.0)
    print("Meta Algorithmic Lookalike (LAL) Audience Scaling Report:")
    print(f"  Target Country Addressable Base: {res['totalCountryPopulation']:,} users")
    print(f"  Lookalike Percentage Tier: {res['lookalikeTierPercent']:.1f}%")
    print(f"  Estimated Audience Reach: {res['estimatedAudienceSize']:,} users")
    print(f"  Audience Tier Classification: {res['tierStatus']}")
    print(f"  Statistical Affinity Score: {res['affinityScore']} / 100.0")
'''

    p3_output = """Meta Algorithmic Lookalike (LAL) Audience Scaling Report:
  Target Country Addressable Base: 200,000,000 users
  Lookalike Percentage Tier: 1.0%
  Estimated Audience Reach: 2,000,000 users
  Audience Tier Classification: 1_PERCENT_HIGHEST_SIMILARITY
  Statistical Affinity Score: 98.0 / 100.0"""

    p3_example = (
        "Enterprise Case Study: A high-growth B2B fintech company expanding into the United States (200M addressable "
        "social audience) launched a 1% Lookalike audience from its 5,000 verified CFO seed customers. The 1% LAL delivered "
        "a pristine audience of 2,000,000 highly qualified executives, generating demo requests at $145 CPA and a 4.2x ROAS. "
        "When the team attempted to scale spend by jumping directly to a 10% LAL (20,000,000 users), CPA spiked to $410 as "
        "affinity diluted. By restructuring into sequential tiers (1%, then 2%, then 3%), the marketing team scaled monthly "
        "ad spend from $20,000 to $120,000 while maintaining a blended CPA under $185."
    )

    p3_code_notes = [
        "Calculates lookalike audience reach as 200,000,000 * 0.01 = 2,000,000 addressable users.",
        "Assigns 1_PERCENT_HIGHEST_SIMILARITY status with 98.0/100.0 statistical affinity to seed profiles.",
        "Demonstrates the mathematical mechanics of algorithmic audience scaling across paid acquisition campaigns."
    ]

    p3_tryit = "Increase lookalike_tier_percent to 5.0% and observe audience size scale to 10,000,000 users while affinity adjusts."

    p3_check = {
        "question": "In digital advertising, what does a 1% Lookalike Audience represent compared to a 10% Lookalike Audience?",
        "options": [
            "A 1% Lookalike contains the top 1% of users who have the highest statistical similarity to your seed customers, offering highest conversion affinity.",
            "A 1% Lookalike reaches 90% fewer people but costs 10 times more in platform fees.",
            "A 1% Lookalike only displays ads for one hour per day.",
            "A 1% Lookalike is restricted to users over 80 years old."
        ],
        "answer": 0,
        "why": "A 1% Lookalike captures the top 1% of the population most statistically similar to your seed audience, providing the highest conversion affinity and ROAS."
    }

    parts.append({
        "title": "Lookalike (LAL) Modeling & Algorithmic Seed Audience Scaling",
        "say": p3_say,
        "example": p3_example,
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_code_notes,
        "tryIt": p3_tryit,
        "check": p3_check
    })

    # Part 4: Dynamic Exclusion Lists & Audience Overlap Suppression
    p4_say = [
        "While defining whom to target is essential, in enterprise performance marketing, knowing whom NOT to target is equally critical to financial profitability. One of the most widespread causes of wasted ad budget in digital marketing is Failing to Suppress Existing Customers from Top-of-Funnel Prospecting Campaigns.",
        
        "When an e-commerce brand spends $50.00 to acquire a new customer, displaying a prospecting discount ad to that same customer three days after they purchased is pure capital incineration. The existing customer would have visited the site organically or via transactional email; paying $3.50 per click to an ad network to re-acquire an already converted user severely depresses blended ROAS and artificially inflates platform-reported conversion metrics.",
        
        "To enforce negative targeting hygiene, growth engineers deploy Dynamic Audience Suppression Lists. Every active ad set must contain explicit custom audience exclusions: (1) 180-Day Past Purchasers (suppressed from cold prospecting), (2) Active CRM Subscribers (suppressed from introductory brand awareness ads), and (3) Open Support Ticket Inquiries (suppressed to avoid serving promotional ads to frustrated customers).",
        
        "Furthermore, suppression architecture prevents Audience Overlap Cannibalization across distinct campaign stages. By excluding 30-Day Website Visitors from Cold Lookalike campaigns and funneling them into dedicated Mid-Funnel Retargeting ad sets with tailored social proof messaging, media buyers eliminate internal auction competition and guide users through a structured, progressive conversion narrative.",
        
        "In our institutional Python model for Part 4, we build an automated Audience Overlap Suppression and Hygiene Filter. The engine ingests a prospective audience cohort, cross-references it against real-time suppression lists (past purchasers and open leads), removes overlapping identities, and calculates saved ad spend. Review the code below to see audience suppression execute deterministically."
    ]

    p4_code = '''def filter_and_suppress_audience_overlap(
    prospect_cohort: list[str],
    existing_purchaser_suppression: set,
    cpc_benchmark: float = 3.50
) -> dict:
    """
    Filters raw prospect audience cohorts against first-party suppression lists.
    Eliminates wasteful impressions served to existing converted customers.
    """
    total_raw_prospects = len(prospect_cohort)
    clean_prospects = []
    suppressed_customers = []
    
    for prospect_id in prospect_cohort:
        if prospect_id in existing_purchaser_suppression:
            suppressed_customers.append(prospect_id)
        else:
            clean_prospects.append(prospect_id)
            
    suppressed_count = len(suppressed_customers)
    suppression_pct = round((suppressed_count / total_raw_prospects) * 100.0, 1) if total_raw_prospects > 0 else 0.0
    estimated_wasted_spend_saved = round(suppressed_count * cpc_benchmark * 1.5, 2)
    
    return {
        "total_prospects_evaluated": total_raw_prospects,
        "clean_prospects_count": len(clean_prospects),
        "suppressed_existing_customers_count": suppressed_count,
        "suppression_percentage": suppression_pct,
        "estimated_wasted_spend_saved": estimated_wasted_spend_saved,
        "hygiene_status": "PROSPECTING_AUDIENCE_PRISTINELY_FILTERED"
    }

if __name__ == "__main__":
    prospects = [f"USER_{i:04d}" for i in range(1, 101)]
    # Simulate that 12 users in the prospect list are already existing purchasers
    purchasers = {f"USER_{i:04d}" for i in range(5, 17)}
    
    res = filter_and_suppress_audience_overlap(prospects, purchasers, cpc_benchmark=3.50)
    print("Audience Overlap & Customer Suppression Hygiene Report:")
    print(f"  Total Evaluated Prospects: {res['total_prospects_evaluated']}")
    print(f"  Clean Eligible Prospects: {res['clean_prospects_count']}")
    print(f"  Existing Customers Suppressed: {res['suppressed_existing_customers_count']} ({res['suppression_percentage']}%)")
    print(f"  Estimated Wasted Ad Spend Saved: ${res['estimated_wasted_spend_saved']:.2f}")
    print(f"  Audience Hygiene Status: {res['hygiene_status']}")
'''

    p4_output = """Audience Overlap & Customer Suppression Hygiene Report:
  Total Evaluated Prospects: 100
  Clean Eligible Prospects: 88
  Existing Customers Suppressed: 12 (12.0%)
  Estimated Wasted Ad Spend Saved: $63.00
  Audience Hygiene Status: PROSPECTING_AUDIENCE_PRISTINELY_FILTERED"""

    p4_example = (
        "Enterprise Case Study: A subscription coffee brand spending $100,000/month on Meta ads discovered that "
        "their top-performing 'Cold Prospecting' ad set was actually delivering 22% of its impressions to active monthly "
        "subscribers who had purchased within the last 14 days. By configuring an automated server-side webhook that dynamically "
        "adds every new subscriber to a 180-day exclusion custom audience, the brand eliminated $22,000/month in completely "
        "wasted ad spend. Reallocating that budget into true net-new customer acquisition increased new subscriber growth by "
        "28% with zero increase in total monthly marketing spend."
    )

    p4_code_notes = [
        "Evaluates 100 candidate prospective audience IDs against a real-time purchaser suppression set.",
        "Suppresses 12 existing customers (12.0%), saving $63.00 in wasted ad spend across the sample cohort.",
        "Guarantees that cold acquisition campaigns target 100% net-new incremental prospective customers."
    ]

    p4_tryit = "Add 10 additional IDs to purchasers and observe how suppressed count and saved spend scale proportionally."

    p4_check = {
        "question": "What is the primary commercial benefit of excluding existing purchasers from cold prospecting ad campaigns?",
        "options": [
            "It prevents wasting ad budget on people who have already bought, ensuring 100% of acquisition capital drives incremental new customers.",
            "It automatically lowers the price of shipping containers from China.",
            "It forces existing customers to change their credit card numbers.",
            "It deletes old customer reviews from product pages."
        ],
        "answer": 0,
        "why": "Excluding existing customers eliminates media spend waste, prevents paying to re-acquire already converted users, and focuses capital on incremental acquisition."
    }

    parts.append({
        "title": "Dynamic Exclusion Lists & Audience Overlap Suppression",
        "say": p4_say,
        "example": p4_example,
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_code_notes,
        "tryIt": p4_tryit,
        "check": p4_check
    })

    # Part 5: Enterprise First-Party Audience Command Gateway & Growth Director Accreditation
    p5_say = [
        "We conclude Day 9 by unifying all first-party audience disciplines into the Enterprise First-Party Audience Command Gateway. In the post-cookie digital advertising era, audience architecture is the ultimate competitive moat separating fragile direct-response advertisers from sovereign, enterprise-grade growth engines.",
        
        "The Enterprise First-Party Audience Command Gateway validates four mission-critical operational gates: (1) First-Party CDP Health (verifying that high-value RFM VIP Champions are identified and segmented), (2) Cryptographic Privacy Compliance (confirming that 100% of customer identifiers are normalized and hashed via SHA-256 with >= 80% identity graph match rate), (3) Algorithmic Lookalike Precision (verifying that lookalike expansion utilizes high-affinity 1% seed modeling to capture incremental demand), and (4) Suppression Hygiene (confirming that past purchasers and active subscribers are systematically excluded from top-of-funnel campaigns).",
        
        "When an enterprise growth program satisfies all four operational criteria, the gateway confers the premier professional certification: First-Party Audience Director Certified (FPA-DC). This accreditation certifies that the enterprise's customer data architecture operates with institutional cryptographic compliance, maximum algorithmic targeting leverage, and zero ad spend leakage.",
        
        "In our final Python simulation for Day 9, we execute the comprehensive Enterprise First-Party Audience Command Gateway. The gateway synthesizes telemetry across all four operational tiers, validates gate criteria, calculates the composite First-Party Audience Index, and outputs the official director accreditation dossier. Review the complete code below to observe the full gateway execution."
    ]

    p5_code = '''def run_enterprise_audience_command_gateway(
    audience_telemetry: dict
) -> dict:
    """
    Executes the Enterprise First-Party Audience Command Gateway.
    Synthesizes RFM segmentation, SHA-256 privacy compliance,
    Lookalike 1% affinity, and audience suppression hygiene.
    Confers FPA-DC (First-Party Audience Director Certified) accreditation.
    """
    rfm_vip_share_pct = audience_telemetry.get("rfm_vip_share_pct", 0.0)
    crypto_match_rate_pct = audience_telemetry.get("crypto_match_rate_pct", 0.0)
    lal_affinity_score = audience_telemetry.get("lal_affinity_score", 0.0)
    suppression_hygiene_active = audience_telemetry.get("suppression_hygiene_active", False)
    
    # Gate Evaluations
    gate_rfm = rfm_vip_share_pct >= 50.0 # VIPs contribute >= 50% revenue
    gate_crypto = crypto_match_rate_pct >= 80.0
    gate_lal = lal_affinity_score >= 90.0 # 1% LAL high affinity
    gate_suppression = suppression_hygiene_active
    
    all_passed = gate_rfm and gate_crypto and gate_lal and gate_suppression
    
    composite_audience_index = round(
        (min(100.0, rfm_vip_share_pct * 1.2) * 0.25) + 
        (crypto_match_rate_pct * 0.25) + 
        (lal_affinity_score * 0.25) + 
        ((100.0 if suppression_hygiene_active else 0.0) * 0.25),
        2
    )
    
    status = "GATEWAY_APPROVED_NOMINAL" if all_passed else "GATEWAY_REMEDIATION_REQUIRED"
    accreditation = "FIRST_PARTY_AUDIENCE_DIRECTOR_CERTIFIED" if all_passed else "ACCREDITATION_PENDING"
    
    return {
        "composite_audience_index": composite_audience_index,
        "gate_rfm_segmentation_passed": gate_rfm,
        "gate_crypto_match_rate_passed": gate_crypto,
        "gate_lookalike_affinity_passed": gate_lal,
        "gate_suppression_hygiene_passed": gate_suppression,
        "gateway_status": status,
        "accreditation_conferred": accreditation
    }

if __name__ == "__main__":
    telemetry = {
        "rfm_vip_share_pct": 81.5,
        "crypto_match_rate_pct": 85.0,
        "lal_affinity_score": 98.0,
        "suppression_hygiene_active": True
    }
    res = run_enterprise_audience_command_gateway(telemetry)
    print("=" * 65)
    print("ENTERPRISE FIRST-PARTY AUDIENCE COMMAND GATEWAY")
    print("=" * 65)
    print(f"Composite Audience Performance Index: {res['composite_audience_index']} / 100.0")
    print(f"  [Gate 1] RFM VIP Revenue Concentration (>= 50%):   {'PASS' if res['gate_rfm_segmentation_passed'] else 'FAIL'}")
    print(f"  [Gate 2] SHA-256 Privacy Match Rate (>= 80%):       {'PASS' if res['gate_crypto_match_rate_passed'] else 'FAIL'}")
    print(f"  [Gate 3] Lookalike 1% Affinity Score (>= 90.0):     {'PASS' if res['gate_lookalike_affinity_passed'] else 'FAIL'}")
    print(f"  [Gate 4] Dynamic Suppression Hygiene (Active):      {'PASS' if res['gate_suppression_hygiene_passed'] else 'FAIL'}")
    print("-" * 65)
    print(f"Gateway Operational Status:   {res['gateway_status']}")
    print(f"Accreditation Conferred:      {res['accreditation_conferred']}")
    print("=" * 65)
'''

    p5_output = """=================================================================
ENTERPRISE FIRST-PARTY AUDIENCE COMMAND GATEWAY
=================================================================
Composite Audience Performance Index: 95.2 / 100.0
  [Gate 1] RFM VIP Revenue Concentration (>= 50%):   PASS
  [Gate 2] SHA-256 Privacy Match Rate (>= 80%):       PASS
  [Gate 3] Lookalike 1% Affinity Score (>= 90.0):     PASS
  [Gate 4] Dynamic Suppression Hygiene (Active):      PASS
-----------------------------------------------------------------
Gateway Operational Status:   GATEWAY_APPROVED_NOMINAL
Accreditation Conferred:      FIRST_PARTY_AUDIENCE_DIRECTOR_CERTIFIED
================================================================="""

    p5_example = (
        "Enterprise Case Study: A global direct-to-consumer beverage conglomerate deployed the First-Party "
        "Audience Command Gateway across 6 portfolio brands. By standardizing RFM VIP seed extraction (81.5% revenue share), "
        "automating SHA-256 cryptographic hashing (85.0% match rate), deploying 1% Lookalike models (98.0 affinity), and enforcing "
        "real-time purchaser suppression across all ad accounts, the conglomerate achieved a composite score of 95.2. "
        "Over 12 months, customer acquisition efficiency increased by 42%, acquiring 180,000 new subscribers while remaining "
        "100% insulated against third-party cookie loss."
    )

    p5_code_notes = [
        "Synthesizes RFM VIP concentration (81.5%), SHA-256 match rate (85.0%), 1% LAL affinity (98.0), and suppression hygiene.",
        "Calculates composite index (95.2/100.0), validating that all 4 audience criteria pass simultaneously.",
        "Confers FIRST_PARTY_AUDIENCE_DIRECTOR_CERTIFIED accreditation, certifying institutional audience architecture mastery."
    ]

    p5_tryit = "Set crypto_match_rate_pct to 75.0% and observe how Gate 2 fails, halting accreditation."

    p5_check = {
        "question": "What does earning the First-Party Audience Director Certified (FPA-DC) accreditation signify?",
        "options": [
            "Mastery of customer RFM segmentation, privacy-preserving SHA-256 hashing, algorithmic lookalike scaling, and dynamic audience suppression hygiene.",
            "Sending unencrypted customer credit card spreadsheets to media agencies over public email.",
            "Renting third-party cold email marketing spam lists from anonymous vendors.",
            "Deleting the customer database when quarterly revenue goals are missed."
        ],
        "answer": 0,
        "why": "The FPA-DC credential validates advanced institutional competence in first-party data architecture, privacy-preserving cryptographic compliance, and lookalike targeting science."
    }

    parts.append({
        "title": "Enterprise First-Party Audience Command Gateway & Growth Director Accreditation",
        "say": p5_say,
        "example": p5_example,
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_code_notes,
        "tryIt": p5_tryit,
        "check": p5_check
    })

    day09_dict = {
        "coursePrefix": "bcom_dmkt",
        "day": 9,
        "title": "First-Party Audience Segmentation, Lookalike Modeling & Algorithmic Seed Scaling",
        "goal": "Master first-party customer audience architecture: RFM customer segmentation, SHA-256 privacy-preserving cryptographic hashing, algorithmic Lookalike modeling (1% to 10% tiers), dynamic audience suppression, and the Enterprise First-Party Audience Command Gateway.",
        "minutes": 40,
        "recap": "Day 9 provides master-level proficiency in first-party audience engineering. Learn how to extract high-value VIP seeds, hash customer identifiers for GDPR/CCPA compliance, and deploy 1% Lookalike audiences to scale customer acquisition.",
        "parts": parts,
        "summary": [
            "RFM Segmentation: Isolates VIP Champions contributing 81.5% of total revenue to build high-signal seed audiences.",
            "Privacy-Preserving SHA-256 Hashing: Normalizes customer PII and hashes records to achieve an 85.0% identity graph match rate under GDPR/CCPA.",
            "Lookalike Algorithmic Modeling: Expands seed audiences to 2,000,000 users at 1.0% tier, achieving 98.0 statistical affinity.",
            "Audience Suppression Hygiene: Filters existing purchasers to save $63.00/hundred users in wasted ad spend and eliminate internal cannibalization.",
            "Enterprise Audience Command Gateway: Unanimously confers FIRST_PARTY_AUDIENCE_DIRECTOR_CERTIFIED accreditation at 95.2 composite performance."
        ]
    }

    total_words = ensure_dmkt_day_budget(day09_dict, min_part_words=580, min_day_words=2950)
    return day09_dict, total_words

if __name__ == '__main__':
    d, w = build_day09()
    print(f"Day 9 Built Successfully! Total Spoken Words: {w:,}")
    for idx, p in enumerate(d['parts']):
        words = count_words(" ".join(p['say']))
        print(f"  Part {idx+1}: {p['title'][:45]}... ({words} words)")
