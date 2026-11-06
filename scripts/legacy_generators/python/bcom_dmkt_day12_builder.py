"""
Day 12 Builder: Email Marketing & Deliverability: SPF, DKIM, DMARC, BIMI & List Hygiene
Course: B.Com Digital Marketing & Growth Hacking (bcom_dmkt)
Task: TASK-832
"""

import os
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words
from digital_marketing_budget_ensurer import ensure_dmkt_day_budget

def build_day12():
    parts = []

    # Part 1: DNS Authentication Protocols: SPF, DKIM & DMARC Enforcement
    p1_say = [
        "Welcome to Day 12 of Digital Marketing and Growth Hacking. Today, we confront the foundational technical bedrock of owned digital media: Enterprise Email Marketing and Inbox Deliverability Engineering. In digital growth operations, email remains the single highest-ROI owned acquisition and retention channel, consistently generating upwards of $36 to $42 in revenue for every dollar invested. However, this immense monetization power is entirely contingent upon inbox placement. If an email fails to land in the primary inbox and is relegated to the spam folder—or rejected outright at the mail transfer agent (MTA) gateway—its conversion value drops to absolute zero.",
        
        "Achieving consistent primary inbox placement requires strict compliance with the internet's three core cryptographic authentication protocols: SPF, DKIM, and DMARC. First, Sender Policy Framework (SPF) is a specialized TXT record published in your domain's DNS. It explicitly enumerates the authorized IP addresses and third-party mail servers (such as Klaviyo, SendGrid, or Salesforce Marketing Cloud) permitted to transmit email on behalf of your sending domain. When a receiving mail server (such as Gmail or Outlook) accepts an inbound connection, it verifies whether the connecting IP is declared in your SPF record, returning 'pass', 'softfail' (~all), or 'fail' (-all).",
        
        "Second, DomainKeys Identified Mail (DKIM) provides cryptographic tamper-proofing and identity verification. The sending mail server attaches an encrypted digital signature to the email header using an asymmetric private key (typically 2048-bit RSA). The receiving mail server retrieves the sender's public key published in DNS and verifies that the signature is mathematically valid and that no mail transfer agent altered the message body or headers in transit. DKIM alignment confirms that the domain declared in the 'From' header matches the signing domain in the DKIM 'd=' tag.",
        
        "Third, Domain-based Message Authentication, Reporting, and Conformance (DMARC) unites SPF and DKIM under a unified policy governance umbrella. DMARC instructs receiving mail servers on how to handle messages that fail SPF or DKIM alignment. DMARC policies operate in three escalating enforcement tiers: 'p=none' (monitoring only, all emails delivered), 'p=quarantine' (suspicious unaligned emails routed directly to spam/junk), and 'p=reject' (unaligned emails blocked and dropped entirely at the gateway). Furthermore, DMARC mandates that mailbox providers send daily Aggregate XML Reports (RUA) and Forensic Failure Reports (RUF) back to the domain owner, providing full visibility into unauthorized spoofing attempts.",
        
        "In our Python simulation for Part 1, we build an Enterprise DNS Email Authentication and DMARC Alignment Auditor. The engine audits DNS TXT records, evaluates SPF IP authorization, verifies DKIM cryptographic key length, and assesses DMARC policy enforcement. Examine the code below to see institutional email authentication evaluated."
    ]

    p1_code = r'''def audit_email_dns_authentication(
    domain_dns_records: dict,
    inbound_email_meta: dict
) -> dict:
    """
    Audits DNS authentication protocols: SPF, DKIM, and DMARC alignment.
    Determines mailbox gateway delivery verdict (Inbox vs Quarantine vs Reject).
    """
    sending_ip = inbound_email_meta["connecting_ip"]
    from_domain = inbound_email_meta["from_header_domain"]
    
    # 1. SPF Check
    spf_record = domain_dns_records.get("spf_txt", "")
    spf_authorized_ips = domain_dns_records.get("spf_authorized_ips", [])
    spf_pass = sending_ip in spf_authorized_ips and "v=spf1" in spf_record
    
    # 2. DKIM Check
    dkim_header = inbound_email_meta.get("dkim_signature", {})
    dkim_domain = dkim_header.get("d_tag", "")
    dkim_key_len = domain_dns_records.get("dkim_public_key_bits", 0)
    dkim_valid_sig = dkim_header.get("signature_valid", False)
    dkim_pass = dkim_valid_sig and dkim_key_len >= 2048 and dkim_domain == from_domain
    
    # 3. DMARC Check & Policy Enforcement
    dmarc_record = domain_dns_records.get("dmarc_txt", "")
    dmarc_policy = "none"
    if "p=reject" in dmarc_record:
        dmarc_policy = "reject"
    elif "p=quarantine" in dmarc_record:
        dmarc_policy = "quarantine"
        
    # Alignment: DMARC passes if either SPF or DKIM passes in alignment with From domain
    dmarc_aligned = spf_pass or dkim_pass
    
    # Gateway Delivery Action
    if dmarc_aligned:
        gateway_action = "DELIVER_PRIMARY_INBOX"
        status = "AUTHENTICATION_EXCELLENCE"
    else:
        if dmarc_policy == "reject":
            gateway_action = "DROP_AND_REJECT_AT_GATEWAY"
            status = "DMARC_POLICY_REJECT_ENFORCED"
        elif dmarc_policy == "quarantine":
            gateway_action = "ROUTE_TO_SPAM_FOLDER"
            status = "DMARC_POLICY_QUARANTINE_ENFORCED"
        else:
            gateway_action = "DELIVER_FLAGGED_INSECURE"
            status = "DMARC_MONITORING_ONLY"
            
    return {
        "from_domain": from_domain,
        "spf_authenticated": spf_pass,
        "dkim_authenticated": dkim_pass,
        "dkim_key_bits": dkim_key_len,
        "dmarc_policy": dmarc_policy,
        "dmarc_aligned": dmarc_aligned,
        "gateway_action": gateway_action,
        "compliance_status": status
    }

if __name__ == "__main__":
    dns = {
        "spf_txt": "v=spf1 ip4:198.51.100.24 include:sendgrid.net -all",
        "spf_authorized_ips": ["198.51.100.24", "198.51.100.25"],
        "dkim_public_key_bits": 2048,
        "dmarc_txt": "v=DMARC1; p=reject; rua=mailto:dmarc-rua@enterprise.com; pct=100;"
    }
    
    legitimate_email = {
        "connecting_ip": "198.51.100.24",
        "from_header_domain": "enterprise.com",
        "dkim_signature": {"d_tag": "enterprise.com", "signature_valid": True}
    }
    
    spoofed_email = {
        "connecting_ip": "203.0.113.88",
        "from_header_domain": "enterprise.com",
        "dkim_signature": {"d_tag": "attacker-domain.xyz", "signature_valid": False}
    }
    
    legit_audit = audit_email_dns_authentication(dns, legitimate_email)
    spoof_audit = audit_email_dns_authentication(dns, spoofed_email)
    
    print("=== ENTERPRISE DNS EMAIL AUTHENTICATION AUDIT ===")
    print(f"[Legitimate Message] SPF: {legit_audit['spf_authenticated']} | DKIM: {legit_audit['dkim_authenticated']} ({legit_audit['dkim_key_bits']} bits)")
    print(f"Action: {legit_audit['gateway_action']} | Status: {legit_audit['compliance_status']}")
    print(f"\n[Spoofed Phishing Message] SPF: {spoof_audit['spf_authenticated']} | DKIM: {spoof_audit['dkim_authenticated']}")
    print(f"Action: {spoof_audit['gateway_action']} | Status: {spoof_audit['compliance_status']}")
'''

    p1_output = """=== ENTERPRISE DNS EMAIL AUTHENTICATION AUDIT ===
[Legitimate Message] SPF: True | DKIM: True (2048 bits)
Action: DELIVER_PRIMARY_INBOX | Status: AUTHENTICATION_EXCELLENCE

[Spoofed Phishing Message] SPF: False | DKIM: False
Action: DROP_AND_REJECT_AT_GATEWAY | Status: DMARC_POLICY_REJECT_ENFORCED"""

    parts.append({
        "title": "Email Infrastructure & Authentication Protocols: SPF DNS Records, DKIM Cryptographic Signatures & DMARC Enforcement",
        "say": p1_say,
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            "Evaluates SPF authorized IP list against connecting server IP.",
            "Validates 2048-bit RSA DKIM cryptographic signature and domain alignment.",
            "Enforces DMARC 'p=reject' policy, automatically dropping spoofed messages at the gateway."
        ],
        "check": {
            "question": "Under modern Google and Yahoo bulk sender requirements, what happens to inbound emails from a sender that lacks valid DMARC alignment?",
            "options": [
                "Receiving mail servers progressively throttle, quarantine in spam, or reject the messages outright, causing severe inbox deliverability collapse",
                "The email is automatically upgraded to an SMS text message on the recipient's phone",
                "The email is converted into a PDF attachment and placed in Google Drive",
                "The recipient is required to solve a CAPTCHA before opening the email"
            ],
            "why": "Google and Yahoo mandated that all high-volume senders must have SPF, DKIM, and DMARC records aligned. Unaligned senders face immediate rate limiting, spam placement, and outright rejection."
        },
        "example": "A fintech scale-up upgraded its DMARC policy from 'p=none' to 'p=reject' with 2048-bit DKIM keys. Gateway phishing drops intercepted 14,000 fraudulent spoofed emails monthly while lifting primary inbox placement from 81% to 99.4%.",
        "tryIt": "Query your sending domain's DMARC record using 'dig TXT _dmarc.yourdomain.com'. Verify that your policy is at least 'quarantine' or 'reject'."
    })

    # Part 2: Sender Reputation Governance & Bulk Sender Standards
    p2_say = [
        "Cryptographic DNS authentication is a mandatory prerequisite, but it alone does not guarantee inbox placement. The second crucial pillar of email deliverability is Sender Reputation. Mailbox providers—principally Google (Gmail) and Yahoo—evaluate senders dynamically using behavioral engagement telemetry. Sender reputation is evaluated across two distinct layers: Domain Reputation (associated with your DKIM sending domain) and IP Reputation (associated with the dedicated IP address transmitting your mail).",
        
        "When an organization launches a new dedicated sending IP, mailbox providers treat that IP with deep suspicion because spammers frequently burn through fresh IPs. To establish trust, growth engineering teams execute a disciplined IP Warm-Up Schedule over a 4 to 6-week horizon. On Day 1, the IP transmits only 50 to 100 emails strictly to the most engaged subscribers (users who opened or clicked an email in the last 7 days). Daily volume is expanded gradually by 20% to 30% each day, allowing mailbox algorithms to register high open rates and zero spam complaints before high-volume marketing blasts are initiated.",
        
        "Furthermore, in February 2024, Google and Yahoo introduced rigid, non-negotiable Bulk Sender Guidelines. The most critical operational threshold is the Spam Complaint Ceiling: senders must maintain a spam complaint rate strictly beneath 0.10% (one complaint per 1,000 delivered emails), with an absolute red-line ceiling of 0.30%. If an account's complaint rate crosses 0.30% for even 48 hours, Gmail and Yahoo algorithmically demote the sender's domain reputation to 'Bad', routing all subsequent email campaigns directly to the spam folder across millions of users.",
        
        "Additionally, bulk senders must support One-Click List-Unsubscribe headers (`List-Unsubscribe: <mailto:...>, <https:...>` with `List-Unsubscribe-Post: List-Unsubscribe=One-Click`). This RFC 8058 standard renders a prominent 'Unsubscribe' button directly next to the sender's name in the Gmail UI. If a user cannot find an effortless 1-click unsubscribe button, their natural cognitive reflex is to hit the 'Report Spam' button—inflicting permanent reputational damage on the sender's domain.",
        
        "In our Python simulation for Part 2, we build an IP Warm-Up Scheduler and Spam Complaint Telemetry Auditor. The script generates an incremental daily volume curve and evaluates real-time campaign engagement against Google/Yahoo compliance ceilings. Examine the code below to understand sender reputation governance."
    ]

    p2_code = r'''def audit_sender_reputation_and_warmup(
    warmup_day: int,
    campaign_telemetry: dict
) -> dict:
    """
    Evaluates IP warm-up schedule volume caps and audits Google/Yahoo
    spam complaint thresholds (< 0.10% nominal, >= 0.30% critical red-line).
    """
    # 1. Warm-Up Schedule Volume Cap (Exponential curve: 100 * (1.25 ^ (day - 1)))
    daily_volume_cap = round(100 * (1.25 ** (warmup_day - 1)))
    
    sent = campaign_telemetry["emails_sent"]
    delivered = campaign_telemetry["emails_delivered"]
    complaints = campaign_telemetry["spam_complaints"]
    opens = campaign_telemetry["unique_opens"]
    has_one_click_unsub = campaign_telemetry["has_rfc8058_one_click_unsub"]
    
    deliverability_rate = round((delivered / max(1, sent)) * 100.0, 2)
    open_rate = round((opens / max(1, delivered)) * 100.0, 2)
    complaint_rate = round((complaints / max(1, delivered)) * 100.0, 3)
    
    # Google/Yahoo Regulatory Compliance Assessment
    is_volume_compliant = sent <= daily_volume_cap
    is_complaint_compliant = complaint_rate < 0.10
    is_critical_penalty = complaint_rate >= 0.30
    
    if is_critical_penalty:
        reputation_tier = "CRITICAL_SPAM_PENALTY_RISK_SUSPEND"
        action = "HALT_SENDING_IMMEDIATELY_CLEAN_LIST"
    elif is_complaint_compliant and is_volume_compliant and has_one_click_unsub:
        reputation_tier = "PRISTINE_HIGH_REPUTATION_INBOX"
        action = "CONTINUE_WARMUP_SCALE_VOLUME"
    else:
        reputation_tier = "ELEVATED_COMPLAINT_OR_VOLUME_EXCEEDED"
        action = "THROTTLE_SENDING_ENGAGE_ONLY_7D_ACTIVE"
        
    return {
        "warmup_day": warmup_day,
        "daily_volume_cap": daily_volume_cap,
        "emails_sent": sent,
        "deliverability_rate_pct": deliverability_rate,
        "open_rate_pct": open_rate,
        "complaint_rate_pct": complaint_rate,
        "has_one_click_unsub": has_one_click_unsub,
        "reputation_tier": reputation_tier,
        "action_directive": action
    }

if __name__ == "__main__":
    day_14_telemetry = {
        "emails_sent": 1800,
        "emails_delivered": 1785,
        "unique_opens": 750,
        "spam_complaints": 1,
        "has_rfc8058_one_click_unsub": True
    }
    
    audit = audit_sender_reputation_and_warmup(14, day_14_telemetry)
    print("=== SENDER REPUTATION & IP WARM-UP AUDIT ===")
    print(f"Warm-Up Day: {audit['warmup_day']} | Volume Cap: {audit['daily_volume_cap']:,} emails | Sent: {audit['emails_sent']:,}")
    print(f"Deliverability Rate: {audit['deliverability_rate_pct']}% | Open Rate: {audit['open_rate_pct']}%")
    print(f"Spam Complaint Rate: {audit['complaint_rate_pct']}% (Google Ceiling: < 0.100%)")
    print(f"RFC 8058 One-Click Unsubscribe: {audit['has_one_click_unsub']}")
    print(f"Reputation Tier: {audit['reputation_tier']}")
    print(f"Directive: {audit['action_directive']}")
'''

    p2_output = """=== SENDER REPUTATION & IP WARM-UP AUDIT ===
Warm-Up Day: 14 | Volume Cap: 1,819 emails | Sent: 1,800
Deliverability Rate: 99.17% | Open Rate: 42.02%
Spam Complaint Rate: 0.056% (Google Ceiling: < 0.100%)
RFC 8058 One-Click Unsubscribe: True
Reputation Tier: PRISTINE_HIGH_REPUTATION_INBOX
Directive: CONTINUE_WARMUP_SCALE_VOLUME"""

    parts.append({
        "title": "Inbox Placement & Sender Reputation: IP Warm-Up Schedules, Spam Traps & Engagement Scoring",
        "say": p2_say,
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            "Computes exact exponential warm-up capacity curve for Day 14 (cap: 1,819 emails).",
            "Audits spam complaints (0.056%) against Google's strict 0.100% threshold.",
            "Validates RFC 8058 1-click unsubscribe header to ensure full mailbox compliance."
        ],
        "check": {
            "question": "What is the maximum spam complaint rate permitted by Google and Yahoo before severe algorithmic domain reputation penalties are imposed?",
            "options": [
                "Strictly beneath 0.10% (less than 1 complaint per 1,000 delivered messages)",
                "5.0% of delivered messages",
                "10.0% of total opens",
                "There is no ceiling as long as the company has paid for G-Suite"
            ],
            "why": "Google and Yahoo strictly enforce a 0.10% spam complaint threshold. Crossing 0.30% triggers immediate deliverability penalties and bulk spam placement."
        },
        "example": "A subscription brand sent a blast to 100,000 unsegmented subscribers, generating 350 spam complaints (0.35%). Gmail instantly dropped their domain reputation to 'Bad', collapsing open rates on all subsequent transactional receipts from 60% to 8%.",
        "tryIt": "Calculate your account's spam complaint rate for the last 30 days in Google Postmaster Tools. Confirm that it remains under 0.10%."
    })

    # Part 3: List Hygiene & Subscriber Churn: Hard vs Soft Bounces
    p3_say = [
        "Even with pristine DNS records and flawless warm-up schedules, an email marketing program will degrade into deliverability oblivion without rigorous, automated List Hygiene. A subscriber list is a decaying biological asset: consumer email addresses churn at an average rate of 25% to 30% per year due to abandoned inboxes, job changes, domain closures, and user disengagement. Continuing to blast inactive or invalid addresses signals to mailbox providers that your organization employs sloppy list hygiene, triggering automated spam routing.",
        
        "Email delivery failures fall into two distinct classifications: Hard Bounces and Soft Bounces. A Hard Bounce is a permanent, non-recoverable delivery failure—such as a non-existent email address ('user5849@fakemail.com'), an invalid domain name, or a mailbox provider permanently refusing mail. The golden invariant of email marketing engineering is that any address generating a hard bounce must be immediately, permanently, and automatically suppressed from all future sends. A Hard Bounce rate exceeding 2.0% triggers immediate suspension across leading enterprise email service providers (ESPs).",
        
        "Conversely, a Soft Bounce represents a temporary delivery failure—such as a recipient's mailbox being full, the receiving server experiencing temporary downtime, or the message payload exceeding size limits. ESPs retry soft bounces over a 72-hour window. However, if an address soft-bounces consecutively across 3 to 5 separate campaigns, automated hygiene scripts convert the status into a permanent suppression.",
        
        "Furthermore, growth teams combat list decay through Automated Sunset Policies. A sunset policy establishes a rule-based offboarding sequence for disengaged contacts: if a subscriber has not opened or clicked an email in 90 consecutive days, they are excluded from regular broadcast newsletters and routed into a 2-step re-engagement sequence ('Do you still want to hear from us?'). If they remain inactive, their address is automatically unsubscribed or archived. This pruning dramatically elevates overall open rates (often from 20% to 45%), sending powerful positive engagement signals to Gmail algorithms.",
        
        "In our Python simulation for Part 3, we build an Automated List Hygiene and Subscriber Sunset Governance Engine. The script processes subscriber engagement logs, categorizes hard vs soft bounces, calculates list health metrics, and executes automated sunset suppressions. Inspect the code below to see list hygiene automation."
    ]

    p3_code = r'''def process_email_list_hygiene(
    subscribers_database: list,
    sunset_inactivity_threshold_days: int = 90
) -> dict:
    """
    Automated List Hygiene and Sunset Policy Engine.
    Suppresses hard bounces, converts repeated soft bounces, and sunsets inactive subscribers.
    """
    total_subscribers = len(subscribers_database)
    active_retained = 0
    hard_bounces_suppressed = 0
    soft_bounces_converted = 0
    sunset_disengaged_archived = 0
    
    cleaned_roster = []
    
    for sub in subscribers_database:
        email = sub["email"]
        status = sub.get("delivery_status", "ACTIVE")
        soft_count = sub.get("consecutive_soft_bounces", 0)
        days_inactive = sub.get("days_since_last_engagement", 0)
        
        # Rule 1: Immediate Hard Bounce Suppression
        if status == "HARD_BOUNCE":
            hard_bounces_suppressed += 1
            continue
            
        # Rule 2: Consecutive Soft Bounce Conversion (>= 3 bounces -> Suppress)
        if soft_count >= 3:
            soft_bounces_converted += 1
            continue
            
        # Rule 3: Sunset Policy (Inactivity >= threshold -> Archive)
        if days_inactive >= sunset_inactivity_threshold_days:
            sunset_disengaged_archived += 1
            continue
            
        # Retained Active Subscriber
        active_retained += 1
        cleaned_roster.append({
            "email": email,
            "days_inactive": days_inactive,
            "status": "QUALIFIED_ACTIVE_ENGAGED"
        })
        
    list_retention_pct = round((active_retained / total_subscribers) * 100.0, 2)
    churn_rate_pct = round(100.0 - list_retention_pct, 2)
    
    return {
        "original_subscribers_count": total_subscribers,
        "active_retained_subscribers": active_retained,
        "hard_bounces_pruned": hard_bounces_suppressed,
        "consecutive_soft_bounces_pruned": soft_bounces_converted,
        "sunset_disengaged_archived": sunset_disengaged_archived,
        "list_retention_pct": list_retention_pct,
        "list_churn_pruned_pct": churn_rate_pct,
        "list_health_status": "PRISTINE_ENGAGED_LIST" if list_retention_pct >= 75.0 else "SUBSTANTIAL_PRUNING_REQUIRED"
    }

if __name__ == "__main__":
    sample_subscribers = [
        {"email": "active1@enterprise.com", "delivery_status": "DELIVERED", "consecutive_soft_bounces": 0, "days_since_last_engagement": 5},
        {"email": "active2@consumer.org", "delivery_status": "DELIVERED", "consecutive_soft_bounces": 0, "days_since_last_engagement": 22},
        {"email": "bounced@deadmailbox.xyz", "delivery_status": "HARD_BOUNCE", "consecutive_soft_bounces": 0, "days_since_last_engagement": 120},
        {"email": "full_inbox@domain.com", "delivery_status": "SOFT_BOUNCE", "consecutive_soft_bounces": 4, "days_since_last_engagement": 45},
        {"email": "zombie@ghost.net", "delivery_status": "DELIVERED", "consecutive_soft_bounces": 0, "days_since_last_engagement": 105}
    ]
    
    hygiene = process_email_list_hygiene(sample_subscribers, sunset_inactivity_threshold_days=90)
    print("=== AUTOMATED LIST HYGIENE & SUNSET AUDIT ===")
    print(f"Original Roster: {hygiene['original_subscribers_count']} | Active Retained: {hygiene['active_retained_subscribers']}")
    print(f"Hard Bounces Pruned: {hygiene['hard_bounces_pruned']} | Repeated Soft Bounces Pruned: {hygiene['consecutive_soft_bounces_pruned']}")
    print(f"Disengaged Sunset Contacts Archived: {hygiene['sunset_disengaged_archived']}")
    print(f"List Retention: {hygiene['list_retention_pct']}% | Cleaned Health Status: {hygiene['list_health_status']}")
'''

    p3_output = """=== AUTOMATED LIST HYGIENE & SUNSET AUDIT ===
Original Roster: 5 | Active Retained: 2
Hard Bounces Pruned: 1 | Repeated Soft Bounces Pruned: 1
Disengaged Sunset Contacts Archived: 1
List Retention: 40.0% | Cleaned Health Status: SUBSTANTIAL_PRUNING_REQUIRED"""

    parts.append({
        "title": "List Hygiene & Churn Management: Hard vs Soft Bounces, Inactive Pruning & Double Opt-In Compliance",
        "say": p3_say,
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            "Immediately suppresses permanent hard bounces to protect sender reputation.",
            "Converts contacts with >= 3 consecutive soft bounces into permanent suppressions.",
            "Enforces a 90-day inactivity sunset policy, pruning unengaged zombie contacts."
        ],
        "check": {
            "question": "Why is keeping 90+ day unengaged 'zombie' subscribers on your active newsletter list dangerous for email deliverability?",
            "options": [
                "Because low open rates signal poor relevance to mailbox provider algorithms, increasing the probability that even engaged users will receive your emails in the spam folder",
                "Because unengaged subscribers automatically consume CPU bandwidth on the user's phone",
                "Because the federal government charges a statutory fine per unopened marketing email",
                "Because inactive email addresses automatically convert into SMS numbers after 60 days"
            ],
            "why": "Gmail and Yahoo monitor domain engagement ratios. Blasting hundreds of thousands of users who never open your messages proves to algorithms that your content is unwanted, triggering account-wide spam placement."
        },
        "example": "A retail brand pruned 220,000 subscribers who had not opened an email in 120 days. Their subscriber count shrank by 28%, but total open rates surged from 18% to 41%, and aggregate revenue increased by 32% because primary inbox placement was restored.",
        "tryIt": "Create a segment of contacts who have not opened an email in the last 90 days. Run a 2-step re-engagement drip, then sunset those who do not respond."
    })

    # Part 4: Brand Indicators for Message Identification (BIMI) & VMC
    p4_say = [
        "In the competitive landscape of the primary inbox, visual identity and trust verification directly dictate open rates. The pinnacle of modern email authentication is BIMI: Brand Indicators for Message Identification. BIMI is an open technical specification that enables verified organizations to display their official corporate trademark logo directly adjacent to inbound messages in the email client UI—across Apple Mail, Gmail, and Yahoo Mail.",
        
        "Implementing BIMI requires meeting strict cryptographic prerequisites. First, the sending domain must have DMARC fully enforced at either 'p=quarantine' (with pct=100) or 'p=reject'. A domain running 'p=none' is strictly ineligible for BIMI. Second, the corporate logo must be converted into a standardized, cryptographically formatted SVG Tiny P/S (Portable/Secure) vector graphic.",
        
        "Third, to display logos in Gmail, Google requires a Verified Mark Certificate (VMC). A VMC is a specialized digital certificate issued by a recognized certificate authority (such as DigiCert or Entrust). To obtain a VMC, the enterprise must prove legal ownership of a registered trademark for the logo with a sovereign intellectual property office (such as the USPTO, EUIPO, or UKIPO). The certificate authority validates organizational identity, embeds the SVG vector within an encrypted privacy certificate, and publishes the certificate URL in a BIMI DNS TXT record (`default._bimi.yourdomain.com`).",
        
        "The commercial impact of BIMI and VMC is profound. In addition to displaying the corporate logo, Gmail awards authenticated VMC senders a verified blue checkmark icon. Independent industry testing shows that emails displaying verified brand logos and blue checkmarks achieve an average 18% to 23% lift in open rates and an immediate 35% reduction in brand impersonation phishing attacks, establishing instant cognitive trust at the exact moment of inbox triage.",
        
        "In our Python simulation for Part 4, we build a BIMI and VMC Cryptographic Compliance Validator. The engine audits DMARC enforcement prerequisites, validates SVG Tiny P/S formatting, checks trademark registration status, and outputs a BIMI DNS record string. Examine the simulation below to see BIMI verification."
    ]

    p4_code = r'''def validate_bimi_vmc_compliance(
    domain_audit_data: dict
) -> dict:
    """
    Validates BIMI (Brand Indicators for Message Identification) prerequisites:
    DMARC enforcement (p=quarantine/reject at 100%), SVG Tiny P/S format, and VMC certificate.
    """
    dmarc_policy = domain_audit_data.get("dmarc_policy", "none")
    dmarc_pct = domain_audit_data.get("dmarc_pct", 0)
    logo_format = domain_audit_data.get("logo_format", "")
    has_vmc = domain_audit_data.get("has_verified_mark_certificate", False)
    trademark_registered = domain_audit_data.get("trademark_registered_with_uspto", False)
    
    # 1. DMARC Prerequisite
    dmarc_eligible = (dmarc_policy in ["quarantine", "reject"]) and (dmarc_pct == 100)
    
    # 2. Visual Graphic Prerequisite (Must be SVG Tiny P/S)
    svg_compliant = logo_format == "SVG_TINY_PS"
    
    # 3. VMC Prerequisite
    vmc_compliant = has_vmc and trademark_registered
    
    is_bimi_ready = dmarc_eligible and svg_compliant and vmc_compliant
    
    if is_bimi_ready:
        dns_record = f"v=BIMI1; l=https://cdn.{domain_audit_data.get('domain', 'enterprise.com')}/logo.svg; a=https://cdn.{domain_audit_data.get('domain', 'enterprise.com')}/cert.pem"
        status = "BIMI_VMC_CERTIFIED_BLUE_CHECKMARK_ELIGIBLE"
    elif not dmarc_eligible:
        dns_record = "INELIGIBLE_DMARC_NOT_ENFORCED"
        status = "FAIL_DMARC_POLICY_TOO_WEAK"
    elif not svg_compliant:
        dns_record = "INELIGIBLE_INVALID_LOGO_FORMAT"
        status = "FAIL_LOGO_NOT_SVG_TINY_PS"
    else:
        dns_record = "INELIGIBLE_MISSING_VMC_OR_TRADEMARK"
        status = "FAIL_MISSING_VERIFIED_MARK_CERTIFICATE"
        
    return {
        "domain": domain_audit_data.get("domain", "enterprise.com"),
        "dmarc_eligible": dmarc_eligible,
        "svg_compliant": svg_compliant,
        "vmc_compliant": vmc_compliant,
        "is_bimi_ready": is_bimi_ready,
        "bimi_dns_txt_record": dns_record,
        "status": status
    }

if __name__ == "__main__":
    corp_data = {
        "domain": "acme-corp.com",
        "dmarc_policy": "reject",
        "dmarc_pct": 100,
        "logo_format": "SVG_TINY_PS",
        "has_verified_mark_certificate": True,
        "trademark_registered_with_uspto": True
    }
    
    bimi_audit = validate_bimi_vmc_compliance(corp_data)
    print("=== BIMI & VMC CRYPTOGRAPHIC COMPLIANCE AUDIT ===")
    print(f"Domain: {bimi_audit['domain']}")
    print(f"DMARC Enforcement (p=reject, pct=100): {bimi_audit['dmarc_eligible']}")
    print(f"SVG Tiny P/S Vector Specification: {bimi_audit['svg_compliant']}")
    print(f"VMC Certificate & Registered Trademark: {bimi_audit['vmc_compliant']}")
    print(f"BIMI Status: {bimi_audit['status']}")
    print(f"Published DNS TXT: {bimi_audit['bimi_dns_txt_record']}")
'''

    p4_output = """=== BIMI & VMC CRYPTOGRAPHIC COMPLIANCE AUDIT ===
Domain: acme-corp.com
DMARC Enforcement (p=reject, pct=100): True
SVG Tiny P/S Vector Specification: True
VMC Certificate & Registered Trademark: True
BIMI Status: BIMI_VMC_CERTIFIED_BLUE_CHECKMARK_ELIGIBLE
Published DNS TXT: v=BIMI1; l=https://cdn.acme-corp.com/logo.svg; a=https://cdn.acme-corp.com/cert.pem"""

    parts.append({
        "title": "Brand Indicators for Message Identification (BIMI) & VMC Verified Mark Certificates",
        "say": p4_say,
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            "Validates mandatory DMARC enforcement at p=quarantine/reject with pct=100.",
            "Checks SVG Tiny P/S vector formatting required by the BIMI working group.",
            "Generates compliant default._bimi TXT DNS record embedding the VMC certificate URL."
        ],
        "check": {
            "question": "Why is a registered trademark from a recognized sovereign intellectual property office mandatory to display a verified BIMI logo in Gmail?",
            "options": [
                "Because Google requires a Verified Mark Certificate (VMC), and certificate authorities legally issue VMCs only to holders of registered trademarks to prevent brand impersonation",
                "Because SVG vector graphics cannot be compressed without a trademark serial number",
                "Because the internet DNS root servers charge licensing royalties for unregistered logos",
                "Because email protocols convert non-trademarked logos into animated GIFs"
            ],
            "why": "VMCs exist to prevent phishing and brand impersonation. Certificate authorities legally verify registered trademark ownership with official patent/trademark offices prior to cryptographically binding the logo."
        },
        "example": "A regional bank deployed BIMI with a DigiCert VMC. In addition to stopping brand-spoofing phishing attacks, displaying their official verified logo and blue checkmark in Gmail lifted transactional open rates by 21.4%.",
        "tryIt": "Check whether your company logo is registered with the trademark office. Confirm if your domain satisfies DMARC p=reject to qualify for BIMI."
    })

    # Part 5: APEX Email Deliverability & Domain Reputation Control Gateway
    p5_say = [
        "In this capstone section of Day 12, we assemble all email deliverability disciplines into an institutional APEX Email Deliverability & Reputation Control Gateway. In enterprise growth organizations, email deliverability is governed as a mission-critical infrastructure system. A deliverability failure is treated with the same severity as a production website outage, because losing inbox access halts customer onboarding, transactional receipts, password resets, and automated lifecycle revenue.",
        
        "The APEX Deliverability Gateway continuously ingests real-time sending telemetry: DNS authentication status (SPF, DKIM, DMARC), Google Postmaster Tools reputation tiers, spam complaint rates (strict < 0.100% rule), hard bounce rates (< 2.0%), and BIMI verification. It evaluates this data across a 100-point Enterprise Deliverability Index (EDI), enforcing automated circuit breakers if reputation signals decay.",
        
        "When the EDI composite score reaches 90.0 or higher with zero threshold violations, the gateway confers the certified Email Deliverability & Lifecycle Architect (EDLA) accreditation. This professional certification validates an engineer's capability to protect enterprise sending domains against blacklisting, maintain 99%+ deliverability, and capture maximum lifecycle customer lifetime value.",
        
        "In our final Python simulation, we build the complete APEX Email Deliverability & Domain Reputation Control Gateway. The engine audits multi-brand sending telemetry, executes automated remediation directives, computes the EDI index, and generates an executive compliance audit dossier. Run the simulation to see institutional email governance in action."
    ]

    p5_code = r'''def execute_apex_email_deliverability_gateway(
    portfolio_manifest: list
) -> dict:
    """
    APEX Email Deliverability & Domain Reputation Control Gateway.
    Synthesizes DNS Authentication, Inbox Deliverability, Spam Complaints,
    and BIMI compliance into a consolidated Enterprise Deliverability Index (EDI).
    """
    processed_domains = []
    total_emails_sent = 0
    total_emails_delivered = 0
    total_score = 0.0
    
    for brand in portfolio_manifest:
        d_name = brand["domain"]
        sent = brand["emails_sent"]
        delivered = brand["emails_delivered"]
        complaints = brand["spam_complaints"]
        hard_bounces = brand["hard_bounces"]
        dns_ok = brand["dns_dmarc_aligned"]
        bimi_ok = brand["bimi_vmc_active"]
        
        total_emails_sent += sent
        total_emails_delivered += delivered
        
        deliv_rate = round((delivered / max(1, sent)) * 100.0, 2)
        comp_rate = round((complaints / max(1, delivered)) * 100.0, 3)
        bounce_rate = round((hard_bounces / max(1, sent)) * 100.0, 2)
        
        # Scoring Components (Max 25 pts each)
        s_dns = 25.0 if dns_ok else 0.0
        s_deliv = min(25.0, (deliv_rate / 99.0) * 25.0)
        s_comp = 25.0 if comp_rate <= 0.05 else max(0.0, 25.0 - ((comp_rate - 0.05) / 0.10) * 25.0)
        s_bimi = 25.0 if bimi_ok else 15.0
        
        domain_edi = round(s_dns + s_deliv + s_comp + s_bimi, 1)
        total_score += domain_edi
        
        # Action Directive
        if comp_rate >= 0.15 or bounce_rate >= 2.0:
            directive = "EMERGENCY_THROTTLE_PRUNE_LIST_IMMEDIATELY"
        elif domain_edi >= 90.0 and dns_ok:
            directive = "SCALE_LIFECYCLE_AUTOMATIONS_NOMINAL"
        else:
            directive = "AUDIT_ENGAGEMENT_AND_WARMUP_IP"
            
        processed_domains.append({
            "domain": d_name,
            "deliverability_rate_pct": deliv_rate,
            "spam_complaint_pct": comp_rate,
            "hard_bounce_pct": bounce_rate,
            "edi_score": domain_edi,
            "directive": directive
        })
        
    portfolio_deliv_rate = round((total_emails_delivered / max(1, total_emails_sent)) * 100.0, 2)
    portfolio_edi = round(total_score / len(portfolio_manifest), 1)
    
    gateway_status = "APEX_EMAIL_GOVERNANCE_EXCELLENCE" if portfolio_edi >= 90.0 and portfolio_deliv_rate >= 98.5 else "DELIVERABILITY_RISK_DETECTED"
    
    return {
        "portfolio_emails_sent": total_emails_sent,
        "portfolio_emails_delivered": total_emails_delivered,
        "portfolio_deliverability_pct": portfolio_deliv_rate,
        "portfolio_edi_score": portfolio_edi,
        "gateway_status": gateway_status,
        "accreditation": "EMAIL_DELIVERABILITY_AND_LIFECYCLE_ARCHITECT_CERTIFIED" if gateway_status == "APEX_EMAIL_GOVERNANCE_EXCELLENCE" else "PENDING_AUDIT",
        "domain_evaluations": processed_domains
    }

if __name__ == "__main__":
    brands = [
        {"domain": "enterprise-commerce.com", "emails_sent": 500000, "emails_delivered": 496500, "spam_complaints": 120, "hard_bounces": 1500, "dns_dmarc_aligned": True, "bimi_vmc_active": True},
        {"domain": "brand-lifestyle.org", "emails_sent": 300000, "emails_delivered": 297000, "spam_complaints": 80, "hard_bounces": 900, "dns_dmarc_aligned": True, "bimi_vmc_active": True},
        {"domain": "saas-platform.io", "emails_sent": 200000, "emails_delivered": 198200, "spam_complaints": 45, "hard_bounces": 600, "dns_dmarc_aligned": True, "bimi_vmc_active": False}
    ]
    
    gateway = execute_apex_email_deliverability_gateway(brands)
    print("=== APEX EMAIL DELIVERABILITY CONTROL GATEWAY ===")
    print(f"Total Portfolio Volume: {gateway['portfolio_emails_sent']:,} Sent | {gateway['portfolio_emails_delivered']:,} Delivered")
    print(f"Portfolio Deliverability Rate: {gateway['portfolio_deliverability_pct']}% | EDI Index: {gateway['portfolio_edi_score']}/100.0")
    print(f"Gateway Status: {gateway['gateway_status']}")
    print(f"Accreditation: {gateway['accreditation']}")
    print("\n--- Domain Directives ---")
    for d in gateway["domain_evaluations"]:
        print(f"[{d['domain']}] Deliverability: {d['deliverability_rate_pct']}% | Spam: {d['spam_complaint_pct']}% | EDI: {d['edi_score']} -> {d['directive']}")
'''

    p5_output = """=== APEX EMAIL DELIVERABILITY CONTROL GATEWAY ===
Total Portfolio Volume: 1,000,000 Sent | 991,700 Delivered
Portfolio Deliverability Rate: 99.17% | EDI Index: 96.7/100.0
Gateway Status: APEX_EMAIL_GOVERNANCE_EXCELLENCE
Accreditation: EMAIL_DELIVERABILITY_AND_LIFECYCLE_ARCHITECT_CERTIFIED

--- Domain Directives ---
[enterprise-commerce.com] Deliverability: 99.3% | Spam: 0.024% | EDI: 100.0 -> SCALE_LIFECYCLE_AUTOMATIONS_NOMINAL
[brand-lifestyle.org] Deliverability: 99.0% | Spam: 0.027% | EDI: 100.0 -> SCALE_LIFECYCLE_AUTOMATIONS_NOMINAL
[saas-platform.io] Deliverability: 99.1% | Spam: 0.023% | EDI: 90.0 -> SCALE_LIFECYCLE_AUTOMATIONS_NOMINAL"""

    parts.append({
        "title": "APEX Email Deliverability & Reputation Control Gateway",
        "say": p5_say,
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            "Synthesizes SPF/DKIM/DMARC, deliverability %, spam complaints, and BIMI into 100-point EDI index.",
            "Audits 1,000,000 sent emails across 3 domains, confirming 99.17% deliverability and 0.024% spam complaint rate.",
            "Awards Email Deliverability & Lifecycle Architect (EDLA) certification for pristine portfolio compliance."
        ],
        "check": {
            "question": "What primary composite score and deliverability rate must an enterprise portfolio achieve to earn the APEX Email Governance Excellence certification?",
            "options": [
                "EDI composite score >= 90.0/100.0 and deliverability rate >= 98.5% with zero red-line complaint breaches",
                "Simply paying for a dedicated IP address regardless of spam complaints",
                "Having an email list of over 5 million subscribers regardless of bounce rates",
                "Turning off unsubscribe links so that no complaints can be filed"
            ],
            "why": "Institutional email governance requires composite excellence: high inbox deliverability (>= 98.5%), pristine EDI index (>= 90.0), and complaint rates safely beneath Google's 0.100% ceiling."
        },
        "example": "A global retail marketplace managing 50 million monthly emails deployed the APEX Deliverability Gateway. Real-time complaint throttling and automated sunsetting pushed deliverability to 99.4%, unlocking $3.8M in incremental quarterly revenue.",
        "tryIt": "Input your domain's monthly sent, delivered, complaint, and bounce metrics into the APEX Gateway. Verify your enterprise EDI index score."
    })

    day_dict = {
        "day": 12,
        "title": "Email Marketing & Deliverability: SPF, DKIM, DMARC, BIMI & List Hygiene",
        "parts": parts
    }

    total_words = ensure_dmkt_day_budget(day_dict, min_part_words=580, min_day_words=2950)
    return day_dict, total_words

if __name__ == "__main__":
    day12_data, total_words = build_day12()
    print(f"Day 12 built successfully: {total_words:,} spoken words.")
