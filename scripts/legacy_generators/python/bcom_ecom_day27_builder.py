"""
Day 27 Builder: Cybersecurity & Anti-Fraud Engineering in E-Commerce
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-822
"""

import os
import sys

# Ensure scripts dir is on sys.path
sys.path.extend(['.', 'scripts'])

from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day27():
    parts = []

    # Part 1: Device Fingerprinting, Browser Telemetry & Behavioral Biometrics
    p1_say = [
        "Welcome to Day 27 of B.Com E-Commerce and Digital Business. Today, we address the most dangerous threat to digital enterprise survival: Cybersecurity, Payment Fraud Engineering, and Automated Bot Defense. According to global banking telemetry, e-commerce merchants lose over thirty-eight billion dollars annually to online payment fraud, account takeovers, and synthetic identity schemes. In a card-not-present (CNP) environment, merchants bear 100% of the financial liability for fraudulent transactions unless sophisticated cryptographic protocols are deployed.",
        
        "The first perimeter of defense in modern anti-fraud engineering is Device Fingerprinting and Behavioral Biometrics. Traditional IP address blocking is virtually useless against organized cybercrime syndicates, who route automated traffic through residential proxy networks and commercial VPNs. Instead, enterprise fraud engines collect over one hundred client-side browser hardware and software attributes to generate a deterministic, unique Device Identifier without requiring cookies.",
        
        "Device fingerprinting inspects deep hardware characteristics: HTML5 Canvas rendering hashes (which expose subtle GPU graphics driver rendering discrepancies), WebGL shader compilation signatures, Web Audio API frequency oscillation curves, CPU core concurrency, device memory buffers, and installed system fonts. Simultaneously, the telemetry collector probes for automated headless browsers (such as Puppeteer, Selenium, or Playwright) by querying JavaScript runtime flags like 'navigator.webdriver' and missing Chrome plugins.",
        
        "Furthermore, modern fraud platforms monitor Behavioral Biometrics in real time during the checkout session. Human shoppers exhibit natural entropy in their physical interactions: mouse movements follow curved paths with variable acceleration, keystroke dynamics have irregular dwell and flight times, and touchscreen scrolling displays micro-hesitations. Automated credential-stuffing bots and fraud scripts move cursors in straight geometric lines or programmatically inject input values in zero milliseconds. Quantifying this interaction entropy allows algorithms to classify bot traffic before a single payment request reaches the card network.",
        
        "In our institutional Python model for Part 1, we implement an enterprise device fingerprint and bot telemetry analyzer. The engine ingests client-side browser telemetry, evaluates headless browser flags, canvas inconsistencies, datacenter ASN IP masks, and mouse interaction entropy, computes an aggregate device risk score, and issues automated security verdicts. Review the deterministic code below to master client telemetry defense."
    ]

    p1_code = '''def analyze_device_fingerprint_and_bot_telemetry(telemetry: dict) -> dict:
    """
    Evaluates client-side hardware fingerprints, headless browser flags, and biometric entropy.
    Calculates composite device risk score and issues automated bot mitigation verdicts.
    """
    risk_points = 0.0
    detected_anomalies = []
    
    # 1. Headless browser automation check
    if telemetry.get('navigator_webdriver', False):
        risk_points += 40.0
        detected_anomalies.append('HEADLESS_PUPPETEER_WEBDRIVER_DETECTED')
        
    # 2. Hardware canvas rendering spoofing check
    if telemetry.get('canvas_hash_spoofed', False):
        risk_points += 25.0
        detected_anomalies.append('CANVAS_HARDWARE_HASH_INCONSISTENCY')
        
    # 3. Network proxy / datacenter ASN check
    if telemetry.get('is_datacenter_asn', False):
        risk_points += 20.0
        detected_anomalies.append('HOSTING_DATACENTER_PROXY_IP')
        
    # 4. Behavioral biometric mouse entropy (0.0 = linear bot, 1.0 = human curve)
    mouse_entropy = telemetry.get('mouse_entropy_score', 1.0)
    if mouse_entropy < 0.25:
        risk_points += 15.0
        detected_anomalies.append(f'SYNTHETIC_ZERO_ENTROPY_MOUSE_{mouse_entropy:.2f}')
        
    device_risk_score = round(min(100.0, risk_points), 2)
    
    # Security decision threshold
    if device_risk_score >= 60.0:
        verdict = 'BLOCK_AUTOMATED_BOT'
    elif device_risk_score >= 30.0:
        verdict = 'STEP_UP_CAPTCHA_CHALLENGE'
    else:
        verdict = 'ALLOW_LEGITIMATE_HUMAN'
        
    return {
        'session_id': telemetry['session_id'],
        'device_risk_score': device_risk_score,
        'detected_anomalies': detected_anomalies,
        'security_verdict': verdict,
        'status': 'TELEMETRY_ANALYSIS_COMPLETE'
    }

mock_bot_telemetry = {
    'session_id': 'SES-BOT-9841',
    'navigator_webdriver': True,
    'canvas_hash_spoofed': True,
    'is_datacenter_asn': True,
    'mouse_entropy_score': 0.04
}

mock_human_telemetry = {
    'session_id': 'SES-HUMAN-1102',
    'navigator_webdriver': False,
    'canvas_hash_spoofed': False,
    'is_datacenter_asn': False,
    'mouse_entropy_score': 0.88
}

bot_results = analyze_device_fingerprint_and_bot_telemetry(mock_bot_telemetry)
human_results = analyze_device_fingerprint_and_bot_telemetry(mock_human_telemetry)

print("=== CYBERSECURITY TELEMETRY: CLIENT-SIDE BOT & DEVICE FINGERPRINT AUDIT ===")
print(f"Session: {bot_results['session_id']} | Risk Score: {bot_results['device_risk_score']} / 100.0")
print(f"  Anomalies Flagged: {bot_results['detected_anomalies']}")
print(f"  Security Verdict:  [{bot_results['security_verdict']}]")
print()
print(f"Session: {human_results['session_id']} | Risk Score: {human_results['device_risk_score']} / 100.0")
print(f"  Anomalies Flagged: {human_results['detected_anomalies']}")
print(f"  Security Verdict:  [{human_results['security_verdict']}]")'''

    p1_output = """=== CYBERSECURITY TELEMETRY: CLIENT-SIDE BOT & DEVICE FINGERPRINT AUDIT ===
Session: SES-BOT-9841 | Risk Score: 100.0 / 100.0
  Anomalies Flagged: ['HEADLESS_PUPPETEER_WEBDRIVER_DETECTED', 'CANVAS_HARDWARE_HASH_INCONSISTENCY', 'HOSTING_DATACENTER_PROXY_IP', 'SYNTHETIC_ZERO_ENTROPY_MOUSE_0.04']
  Security Verdict:  [BLOCK_AUTOMATED_BOT]

Session: SES-HUMAN-1102 | Risk Score: 0.0 / 100.0
  Anomalies Flagged: []
  Security Verdict:  [ALLOW_LEGITIMATE_HUMAN]"""

    p1_notes = [
        "Session SES-BOT-9841 triggered a perfect 100.0 risk score across headless webdriver, canvas spoofing, and 0.04 mouse entropy.",
        "Automated bot traffic was intercepted at the network edge before placing fraudulent checkout orders or scraping catalog inventory.",
        "Session SES-HUMAN-1102 exhibited normal human interaction entropy with zero hardware anomalies, allowing frictionless checkout."
    ]

    p1_check = {
        "question": "Why is client-side behavioral biometric analysis (e.g. mouse cursor entropy) more reliable than simple IP address rate limiting?",
        "options": [
            "Modern cyber syndicates rotate through millions of clean residential proxy IPs, but automated scripts cannot easily replicate the biomechanical entropy of human hands",
            "IP addresses are encrypted and cannot be seen by web servers",
            "Behavioral biometrics permanently exempt merchants from paying credit card processing fees",
            "Mouse tracking completely eliminates the need for SSL/TLS certificates"
        ],
        "answer": 0,
        "why": "Botnets easily circumvent IP rate limits by purchasing residential proxy pools, but synthetic cursor movements lack the natural velocity, jitter, and curvature of physical human interactions."
    }

    parts.append({
        "title": "Device Fingerprinting, Browser Telemetry & Behavioral Biometrics",
        "say": p1_say,
        "example": "Cloudflare and DataDome inspect client-side JavaScript execution environments across billions of daily requests. When sneaker scalper bots attempt to purchase limited-edition Nike drops using headless Chromium instances, the engine detects webdriver anomalies in under 15ms and serves a cryptographic proof-of-work challenge.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_notes,
        "tryIt": "Set navigator_webdriver to False in mock_bot_telemetry to observe how risk score drops to 60.0, still maintaining the BLOCK_AUTOMATED_BOT verdict.",
        "check": p1_check
    })

    # Part 2: Synthetic Identity & Account Takeover (ATO) Detection Algorithms
    p2_say = [
        "While automated bots attack storefront availability and scalping queues, the most insidious financial threat against customer retention and brand equity is Account Takeover (ATO) and Synthetic Identity Fraud. In an ATO attack, cybercriminals obtain compromised credential databases from third-party data breaches (using credential stuffing tools) and hijack legitimate customer accounts containing saved payment methods, loyalty reward balances, and stored shipping addresses.",
        
        "Synthetic identity fraud, by contrast, involves constructing fictitious digital identities by combining real, stolen Social Security or PAN numbers with fabricated names, birth dates, and mailing addresses. Fraudsters nurture these synthetic accounts over months, establishing clean credit histories before executing massive 'bust-out' purchases across high-value electronics and luxury goods.",
        
        "To intercept ATO attacks before unauthorized orders are dispatched, enterprise fraud engineering enforces Impossible Travel Velocity Heuristics. When an authentication event occurs, the engine queries the geographic coordinates of the current IP address and compares it against the customer's prior verified login timestamp. If a customer logs into their account from Dallas, Texas at 10:00 AM, and a subsequent login attempt occurs from Frankfurt, Germany at 10:25 AM, the calculated travel velocity exceeds 12,000 miles per hour—a physical impossibility.",
        
        "Beyond impossible velocity, ATO engines track behavioral delta anomalies: sudden changes in shipping addresses immediately preceding high-ticket gift card purchases, abrupt password resets from unrecognized device fingerprints, and rapid brute-force password failure velocities. When aggregate ATO risk crosses critical thresholds, the security gateway immediately revokes active OAuth session tokens, locks stored payment methods, and enforces multi-factor authentication (MFA) via SMS or authenticator app.",
        
        "In our institutional Python model for Part 2, we implement an enterprise Account Takeover detection algorithm. The model evaluates an incoming login event against account historical baselines, computes geographic velocity in miles per hour, flags brute-force password velocities and unrecognized hardware fingerprints, and enforces automated account protection protocols. Review the deterministic code below."
    ]

    p2_code = '''def detect_account_takeover_and_credential_stuffing(
    login_event: dict,
    account_baseline: dict,
    max_physical_speed_mph: float = 600.0
) -> dict:
    """
    Evaluates account takeover (ATO) risk using impossible travel velocity,
    unrecognized device fingerprints, and credential stuffing brute force patterns.
    """
    account_id = login_event['account_id']
    alerts = []
    ato_risk_points = 0.0
    
    # 1. Evaluate Impossible Travel Velocity
    time_elapsed_hours = (login_event['timestamp_epoch'] - account_baseline['last_login_epoch']) / 3600.0
    distance_miles = login_event['distance_from_last_login_miles']
    
    if time_elapsed_hours > 0:
        calculated_speed_mph = round(distance_miles / time_elapsed_hours, 1)
        if calculated_speed_mph > max_physical_speed_mph:
            ato_risk_points += 50.0
            alerts.append(f'IMPOSSIBLE_TRAVEL_VELOCITY_{int(calculated_speed_mph)}_MPH')
    else:
        calculated_speed_mph = 0.0
        
    # 2. Credential stuffing brute-force failure velocity
    failed_attempts = login_event.get('failed_attempts_last_10m', 0)
    if failed_attempts >= 5:
        ato_risk_points += 30.0
        alerts.append(f'BRUTE_FORCE_VELOCITY_{failed_attempts}_FAILURES')
        
    # 3. Unrecognized hardware device fingerprint
    if login_event['device_fingerprint'] != account_baseline['known_device_fingerprint']:
        ato_risk_points += 20.0
        alerts.append('NEW_UNRECOGNIZED_DEVICE_HARDWARE')
        
    ato_risk_score = round(min(100.0, ato_risk_points), 2)
    
    # Enforce defensive security action
    if ato_risk_score >= 70.0:
        action = 'REVOKE_SESSIONS_LOCK_ACCOUNT_AND_RESET_PASSWORD'
    elif ato_risk_score >= 30.0:
        action = 'REQUIRE_STEP_UP_MFA_CHALLENGE'
    else:
        action = 'ALLOW_AUTHENTICATION_SEAMLESS'
        
    return {
        'account_id': account_id,
        'calculated_velocity_mph': calculated_speed_mph,
        'ato_risk_score': ato_risk_score,
        'risk_factors': alerts,
        'enforced_security_action': action,
        'status': 'ATO_HEURISTIC_EVALUATED'
    }

mock_baseline = {
    'last_login_epoch': 1700000000,
    'known_device_fingerprint': 'DEV-FP-WIN-CHROME-9921'
}

# Suspicious Login Event: Dallas to Frankfurt (5,100 miles in 0.5 hours = 10,200 mph)
mock_suspicious_login = {
    'account_id': 'ACC-VIP-501',
    'timestamp_epoch': 1700001800, # 1,800 seconds = 0.5 hours later
    'distance_from_last_login_miles': 5100.0,
    'failed_attempts_last_10m': 6,
    'device_fingerprint': 'DEV-FP-LINUX-FIREFOX-1104'
}

ato_results = detect_account_takeover_and_credential_stuffing(mock_suspicious_login, mock_baseline)

print("=== CYBERSECURITY TELEMETRY: ACCOUNT TAKEOVER (ATO) DEFENSE AUDIT ===")
print(f"Target Customer Account:        {ato_results['account_id']}")
print(f"Calculated Travel Velocity:     {ato_results['calculated_velocity_mph']:,.1f} mph (Max Commercial: 600.0 mph)")
print(f"ATO Composite Risk Score:       {ato_results['ato_risk_score']} / 100.00 pts")
print(f"Risk Factors Detected:          {ato_results['risk_factors']}")
print(f"Enforced Security Action:       [{ato_results['enforced_security_action']}]")
print(f"Audit Pipeline Status:          [{ato_results['status']}]")'''

    p2_output = """=== CYBERSECURITY TELEMETRY: ACCOUNT TAKEOVER (ATO) DEFENSE AUDIT ===
Target Customer Account:        ACC-VIP-501
Calculated Travel Velocity:     10,200.0 mph (Max Commercial: 600.0 mph)
ATO Composite Risk Score:       100.0 / 100.00 pts
Risk Factors Detected:          ['IMPOSSIBLE_TRAVEL_VELOCITY_10200_MPH', 'BRUTE_FORCE_VELOCITY_6_FAILURES', 'NEW_UNRECOGNIZED_DEVICE_HARDWARE']
Enforced Security Action:       [REVOKE_SESSIONS_LOCK_ACCOUNT_AND_RESET_PASSWORD]
Audit Pipeline Status:          [ATO_HEURISTIC_EVALUATED]"""

    p2_notes = [
        "The ATO engine detected 10,200.0 mph impossible travel velocity, instantly flagging credential stuffing from an offshore VPN node.",
        "Combined with 6 failed password attempts and a foreign device fingerprint, the account scored 100.0 risk points.",
        "Active session tokens were immediately revoked, preventing unauthorized draining of stored store credit or payment methods."
    ]

    p2_check = {
        "question": "What is the primary indicator of an automated Account Takeover (ATO) credential stuffing attack?",
        "options": [
            "A sudden spike in login attempts across thousands of accounts originating from unrecognized device fingerprints and datacenter IP addresses with impossible travel velocities",
            "Customers adding multiple items of clothing to their shopping carts",
            "A customer updating their email newsletter subscription preferences",
            "Shoppers browsing products using mobile phones instead of desktop computers"
        ],
        "answer": 0,
        "why": "Credential stuffing attacks use automated bots to test millions of breached username/password pairs, producing dramatic velocity anomalies across IP networks and hardware fingerprints."
    }

    parts.append({
        "title": "Synthetic Identity & Account Takeover (ATO) Detection Algorithms",
        "say": p2_say,
        "example": "PayPal monitors account authentication telemetry across 400+ million active accounts using graph neural networks. When an ATO syndicate attempted to compromise accounts using leaked credentials, impossible travel velocity and device mismatch rules automatically intercepted 99.4% of unauthorized logins.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_notes,
        "tryIt": "Reduce distance_from_last_login_miles to 50.0 and failed_attempts_last_10m to 0 to observe the action downgrade to REQUIRE_STEP_UP_MFA_CHALLENGE based solely on the new device.",
        "check": p2_check
    })

    # Part 3: Real-Time Transaction Risk Scoring & Dynamic 3DS2 Challenge Rules
    p3_say = [
        "When an authenticated or guest session reaches the checkout finalization step, the digital commerce engine must make an instantaneous, high-stakes decision: approve the transaction, challenge the user with two-factor authentication, or reject the card payment entirely. In the payments industry, this decision is governed by Real-Time Transaction Risk Scoring and EMVCo 3-D Secure 2 (3DS2) Dynamic Routing.",
        
        "Every incoming payment transaction contains critical metadata verified across banking networks: Address Verification System (AVS) responses (checking whether the numerical street address and postal ZIP code match bank records), Card Verification Value (CVV2) matching, Bank Identification Number (BIN) card level and issuing country, transaction dollar volume, and order velocity. Inconsistencies—such as a credit card issued by a bank in the Philippines used with a billing address in Florida and shipping to an unverified freight forwarder in Delaware—represent acute payment fraud indicators.",
        
        "Historically, under 3DS1, merchants were forced to route every transaction through clunky pop-up iframe challenges that devastated mobile conversion rates, causing up to 25% checkout drop-off. Modern 3DS2 revolutionizes payment security by introducing Frictionless Checkout Exemptions. The merchant passes over 150 transaction data points to the card-issuing bank (including device fingerprint, customer IP, account age, and shipping history). If the bank's machine learning model verifies that the risk score is low, the transaction clears seamlessly in milliseconds with zero customer friction.",
        
        "However, if transaction risk is elevated, the merchant initiates a 3DS2 Step-Up Challenge (biometric fingerprint or SMS OTP). Crucially, whenever a transaction successfully completes a 3DS2 challenge, the global payment network enforces a Legal Liability Shift: financial responsibility for future fraudulent chargebacks shifts permanently from the merchant to the card-issuing bank! Conversely, high-risk transactions with failed CVVs or severe AVS mismatches are hit with automated Hard Declines to prevent payment processing gateway fines.",
        
        "In our institutional Python model for Part 3, we implement a dynamic transaction risk scoring and 3DS2 routing engine. The model evaluates AVS street/ZIP matches, CVV verification, high-ticket order thresholds, and cross-border destination mismatches, routes orders into Frictionless Exemption, 3DS2 Challenge, or Hard Decline categories, and logs liability shift status. Review the deterministic code below."
    ]

    p3_code = '''def evaluate_transaction_risk_and_3ds2_routing(order_manifest: dict) -> dict:
    """
    Evaluates real-time payment transaction risk across AVS, CVV, and cross-border signals.
    Dynamically routes orders into Frictionless Exemption, 3DS2 Challenge, or Hard Decline.
    """
    order_id = order_manifest['order_id']
    amount_usd = order_manifest['order_amount_usd']
    risk_score = 0.0
    risk_reasons = []
    
    # 1. Address Verification System (AVS) Check
    # 'Y' = Street & Zip match; 'Z' = Zip only; 'N' = Neither match
    avs = order_manifest['avs_result']
    if avs == 'N':
        risk_score += 35.0
        risk_reasons.append('AVS_STREET_AND_ZIP_MISMATCH')
    elif avs == 'Z':
        risk_score += 15.0
        risk_reasons.append('AVS_PARTIAL_ZIP_ONLY_MATCH')
        
    # 2. CVV Verification Check
    cvv_ok = order_manifest['cvv_match']
    if not cvv_ok:
        risk_score += 40.0
        risk_reasons.append('CVV2_SECURITY_CODE_FAILED')
        
    # 3. High-Ticket Order Value Threshold (> $500)
    if amount_usd >= 500.0:
        risk_score += 15.0
        risk_reasons.append(f'HIGH_TICKET_VALUE_${amount_usd:,.2f}')
        
    # 4. Cross-Border Country Discrepancy
    if order_manifest['billing_country'] != order_manifest['shipping_country']:
        risk_score += 10.0
        risk_reasons.append('CROSS_BORDER_BILLING_SHIPPING_MISMATCH')
        
    # 5. Determine 3DS2 Routing & Liability Shift
    if risk_score >= 60.0 or not cvv_ok:
        routing_action = 'HARD_DECLINE_REJECT_PAYMENT'
        liability_shifted = False
    elif risk_score >= 25.0:
        routing_action = 'INITIATE_3DS2_AUTHENTICATION_CHALLENGE'
        liability_shifted = True # Liability shifts to issuing bank upon 3DS2 challenge completion
    else:
        routing_action = 'QUALIFIED_FOR_FRICTIONLESS_EXEMPTION'
        liability_shifted = False
        
    return {
        'order_id': order_id,
        'order_amount_usd': amount_usd,
        'composite_risk_score': round(risk_score, 2),
        'risk_factors': risk_reasons,
        'payment_routing_action': routing_action,
        'chargeback_liability_shifted': liability_shifted,
        'status': 'TRANSACTION_RISK_SCORED'
    }

order_high_risk = {
    'order_id': 'ORD-TX-9011',
    'order_amount_usd': 850.00,
    'avs_result': 'N',
    'cvv_match': False,
    'billing_country': 'US',
    'shipping_country': 'NG'
}

order_challenge = {
    'order_id': 'ORD-TX-9012',
    'order_amount_usd': 580.00,
    'avs_result': 'Z',
    'cvv_match': True,
    'billing_country': 'US',
    'shipping_country': 'US'
}

order_clean = {
    'order_id': 'ORD-TX-9013',
    'order_amount_usd': 85.00,
    'avs_result': 'Y',
    'cvv_match': True,
    'billing_country': 'US',
    'shipping_country': 'US'
}

res_high = evaluate_transaction_risk_and_3ds2_routing(order_high_risk)
res_challenge = evaluate_transaction_risk_and_3ds2_routing(order_challenge)
res_clean = evaluate_transaction_risk_and_3ds2_routing(order_clean)

print("=== REAL-TIME TRANSACTION RISK & 3DS2 DYNAMIC ROUTING AUDIT ===")
print(f"Order: {res_high['order_id']} (${res_high['order_amount_usd']:,.2f}) | Risk: {res_high['composite_risk_score']} pts")
print(f"  Routing: [{res_high['payment_routing_action']}] | Liability Shifted: {res_high['chargeback_liability_shifted']}")
print()
print(f"Order: {res_challenge['order_id']} (${res_challenge['order_amount_usd']:,.2f}) | Risk: {res_challenge['composite_risk_score']} pts")
print(f"  Routing: [{res_challenge['payment_routing_action']}] | Liability Shifted: {res_challenge['chargeback_liability_shifted']}")
print()
print(f"Order: {res_clean['order_id']} (${res_clean['order_amount_usd']:,.2f}) | Risk: {res_clean['composite_risk_score']} pts")
print(f"  Routing: [{res_clean['payment_routing_action']}] | Liability Shifted: {res_clean['chargeback_liability_shifted']}")'''

    p3_output = """=== REAL-TIME TRANSACTION RISK & 3DS2 DYNAMIC ROUTING AUDIT ===
Order: ORD-TX-9011 ($850.00) | Risk: 100.0 pts
  Routing: [HARD_DECLINE_REJECT_PAYMENT] | Liability Shifted: False

Order: ORD-TX-9012 ($580.00) | Risk: 30.0 pts
  Routing: [INITIATE_3DS2_AUTHENTICATION_CHALLENGE] | Liability Shifted: True

Order: ORD-TX-9013 ($85.00) | Risk: 0.0 pts
  Routing: [QUALIFIED_FOR_FRICTIONLESS_EXEMPTION] | Liability Shifted: False"""

    p3_notes = [
        "Order ORD-TX-9011 triggered a Hard Decline due to CVV failure, complete AVS mismatch, and high-ticket international routing.",
        "Order ORD-TX-9012 ($580, partial AVS) triggered a 3DS2 Challenge, securing a full legal chargeback liability shift to the issuing bank.",
        "Order ORD-TX-9013 cleared under Frictionless Exemption with zero customer friction and instant sub-second authorization."
    ]

    p3_check = {
        "question": "What is the strategic commercial value of achieving a 'Liability Shift' through 3DS2 Authentication Challenges?",
        "options": [
            "If the customer later files a fraudulent 'unauthorized transaction' chargeback, the card-issuing bank absorbs the financial loss rather than the merchant",
            "The merchant is exempted from shipping the ordered goods",
            "The card network doubles the merchant's profit margin on that transaction",
            "The customer is legally prevented from returning damaged merchandise"
        ],
        "answer": 0,
        "why": "When a transaction passes 3DS2 challenge authentication, global card network rules shift the fraud liability from the merchant to the card issuer, protecting the merchant from chargeback clawbacks."
    }

    parts.append({
        "title": "Real-Time Transaction Risk Scoring & Dynamic 3DS2 Challenge Rules",
        "say": p3_say,
        "example": "Stripe Radar and Adyen RevenueProtect analyze billions of global card transactions using machine learning. By dynamically requesting 3DS2 challenges only for transactions in the 25-60 risk point corridor, merchants protect over 90% of checkout traffic under frictionless authorization while shielding against high-ticket fraud.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_notes,
        "tryIt": "Set cvv_match to True on ORD-TX-9011 and avs_result to 'Z' to observe how the risk score drops to 35.0, shifting the verdict to INITIATE_3DS2_AUTHENTICATION_CHALLENGE.",
        "check": p3_check
    })

    # Part 4: Chargeback Dispute Automation & Evidence Packet Synthesis
    p4_say = [
        "Despite multi-layered bot defenses and real-time risk scoring, merchants inevitably encounter Chargebacks. A chargeback occurs when a cardholder contacts their issuing bank and disputes a transaction, asserting that they never authorized the purchase, never received the goods, or were victimized by fraud. When a dispute is filed, the payment processor immediately claws back the full transaction amount from the merchant's merchant account, along with a non-refundable $15 to $35 dispute administrative fee.",
        
        "A massive and growing portion of e-commerce chargebacks consists of 'Friendly Fraud' (also known as First-Party Misuse). In friendly fraud, legitimate customers receive their ordered merchandise, enjoy the products, and subsequently file false fraud claims with their bank to get free goods, falsely claiming package non-receipt or card compromise. Merchants who fail to dispute these claims suffer severe financial margin erosion.",
        
        "To combat friendly fraud, payment card networks (such as Visa Compelling Evidence 3.0 / CE30) established formal legal frameworks for Merchant Representment. Under Visa CE30 rules, if a merchant can prove that the disputed card was previously used in at least two undisputed transactions on the same storefront older than 120 days, and that the IP address, device fingerprint, or shipping address matches the current transaction, the issuing bank is legally required to reverse the chargeback and return the merchant's funds.",
        
        "Enterprise chargeback defense engines automate the synthesis of Compelling Evidence Packets. The automated engine aggregates five evidentiary artifacts into a court-ready PDF dossier: First, Carrier Proof of Delivery (POD) with GPS delivery coordinates and timestamp; Second, Recipient signature confirmation; Third, Client device fingerprint and IP access telemetry; Fourth, Historical transaction audit logs showing prior satisfied orders; and Fifth, Terms of Service acceptance timestamps. Transmitting complete evidence packets within the strict 20-day dispute window raises win rates from an industry baseline of 18% to over 75%.",
        
        "In our institutional Python model for Part 4, we implement an automated chargeback compelling evidence synthesizer. The algorithm evaluates a disputed chargeback record against carrier fulfillment telemetry and historical customer account logs, compiles qualifying CE3.0 evidentiary artifacts, projects representment win probability, and issues automated defense recommendations. Review the deterministic code below."
    ]

    p4_code = '''def synthesize_chargeback_compelling_evidence(
    dispute_record: dict,
    fulfillment_telemetry: dict
) -> dict:
    """
    Synthesizes automated chargeback defense packets under Visa Compelling Evidence 3.0 (CE30).
    Evaluates historical purchase continuity, carrier GPS proof of delivery, and device telemetry.
    """
    dispute_id = dispute_record['dispute_id']
    amount_usd = dispute_record['disputed_amount_usd']
    evidence_score = 0.0
    evidence_artifacts = []
    
    # 1. Carrier Proof of Delivery (POD) with GPS coordinates
    if fulfillment_telemetry.get('carrier_gps_verified', False):
        evidence_score += 35.0
        evidence_artifacts.append('CARRIER_GPS_CONFIRMED_DELIVERY_GEOSTAMP')
        
    # 2. Recipient Signature Confirmation
    if fulfillment_telemetry.get('physical_signature_obtained', False):
        evidence_score += 20.0
        evidence_artifacts.append('PHYSICAL_RECIPIENT_SIGNATURE_OBTAINED')
        
    # 3. Visa CE3.0 Qualifying Prior Undisputed Orders (requires >= 2 orders > 120 days old)
    prior_clean_orders = dispute_record.get('prior_undisputed_orders_count', 0)
    if prior_clean_orders >= 2:
        evidence_score += 25.0
        evidence_artifacts.append(f'VISA_CE30_QUALIFIED_{prior_clean_orders}_PRIOR_ORDERS')
        
    # 4. Device Fingerprint & IP Telemetry Match
    if dispute_record.get('device_ip_matched_historical_account', False):
        evidence_score += 20.0
        evidence_artifacts.append('DEVICE_FINGERPRINT_AND_IP_HISTORICAL_MATCH')
        
    projected_win_rate_pct = round(min(95.0, evidence_score), 2)
    
    # Representment decision threshold
    if projected_win_rate_pct >= 70.0:
        recommendation = 'SUBMIT_FORMAL_REPRESENTMENT_DEFENSE'
    elif projected_win_rate_pct >= 40.0:
        recommendation = 'SUBMIT_MANUAL_REVIEW_EVIDENCE'
    else:
        recommendation = 'ACCEPT_DISPUTE_WRITE_OFF_UNPROVABLE'
        
    return {
        'dispute_id': dispute_id,
        'disputed_amount_usd': amount_usd,
        'compelling_evidence_score': evidence_score,
        'evidence_artifacts_compiled': evidence_artifacts,
        'projected_win_rate_pct': projected_win_rate_pct,
        'defense_recommendation': recommendation,
        'status': 'EVIDENCE_DOSSIER_COMPILED'
    }

mock_dispute_friendly_fraud = {
    'dispute_id': 'DISP-VISA-8821',
    'disputed_amount_usd': 340.00,
    'reason_code': '10.4_OTHER_FRAUD_CARD_ABSENT',
    'prior_undisputed_orders_count': 3,
    'device_ip_matched_historical_account': True
}

mock_fulfillment = {
    'carrier_gps_verified': True,
    'physical_signature_obtained': True,
    'carrier_tracking_number': '1Z9999999999999999'
}

dispute_defense = synthesize_chargeback_compelling_evidence(mock_dispute_friendly_fraud, mock_fulfillment)

print("=== CHARGEBACK DEFENSE: COMPELLING EVIDENCE 3.0 DOSSIER AUDIT ===")
print(f"Dispute Case:                   {dispute_defense['dispute_id']} (${dispute_defense['disputed_amount_usd']:,.2f} USD)")
print(f"Compelling Evidence Score:      {dispute_defense['compelling_evidence_score']} / 100.0 pts")
print(f"Projected Representment Win:    {dispute_defense['projected_win_rate_pct']}% success probability")
print("Compiled Evidence Artifacts:")
for artifact in dispute_defense['evidence_artifacts_compiled']:
    print(f"  [+] {artifact}")
print(f"Strategic Defense Recommendation: [{dispute_defense['defense_recommendation']}]")
print(f"Pipeline Execution Status:      [{dispute_defense['status']}]")'''

    p4_output = """=== CHARGEBACK DEFENSE: COMPELLING EVIDENCE 3.0 DOSSIER AUDIT ===
Dispute Case:                   DISP-VISA-8821 ($340.00 USD)
Compelling Evidence Score:      100.0 / 100.0 pts
Projected Representment Win:    95.0% success probability
Compiled Evidence Artifacts:
  [+] CARRIER_GPS_CONFIRMED_DELIVERY_GEOSTAMP
  [+] PHYSICAL_RECIPIENT_SIGNATURE_OBTAINED
  [+] VISA_CE30_QUALIFIED_3_PRIOR_ORDERS
  [+] DEVICE_FINGERPRINT_AND_IP_HISTORICAL_MATCH
Strategic Defense Recommendation: [SUBMIT_FORMAL_REPRESENTMENT_DEFENSE]
Pipeline Execution Status:      [EVIDENCE_DOSSIER_COMPILED]"""

    p4_notes = [
        "The automated evidence synthesizer compiled four ironclad artifacts yielding a 95.0% projected representment win rate.",
        "Visa CE3.0 rules legally enforce reversal when carrier GPS delivery matches historical device and prior clean order history.",
        "Automating evidence generation enables enterprises to contest 100% of friendly fraud disputes before the 20-day cutoff."
    ]

    p4_check = {
        "question": "Under Visa Compelling Evidence 3.0 (CE30), what specific evidence allows merchants to legally overturn friendly fraud chargebacks?",
        "options": [
            "Proving that the customer had at least two prior undisputed transactions and that the current delivery IP address or device fingerprint matches historical customer records",
            "Submitting an affidavit stating that the customer was rude on social media",
            "Offering to refund the customer 50% in digital crypto tokens",
            "Demonstrating that the product was purchased on a Monday morning"
        ],
        "answer": 0,
        "why": "Visa CE3.0 establishes that proving historical account continuity (>=2 clean orders) and matching device/IP/shipping telemetry legally invalidates unauthorized fraud claims."
    }

    parts.append({
        "title": "Chargeback Dispute Automation & Evidence Packet Synthesis",
        "say": p4_say,
        "example": "Chargeflow and Midigator automate chargeback representments for Shopify Plus brands. By integrating carrier APIs (FedEx, UPS) and payment gateways, the software auto-generates 20-page legal evidence dossiers within hours of dispute filing, recovering over $50M in disputed merchant GMV annually.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_notes,
        "tryIt": "Set carrier_gps_verified and physical_signature_obtained to False to observe the evidence score drop to 45.0, downgrading to SUBMIT_MANUAL_REVIEW_EVIDENCE.",
        "check": p4_check
    })

    # Part 5: Enterprise Fraud Defense Control Tower & Dispute Ratio Governance
    p5_say = [
        "To conclude Day 27, we synthesize bot telemetry, account takeover protection, dynamic 3DS2 routing, and chargeback representment into the Enterprise Fraud Defense Control Tower. In digital commerce operations, cybersecurity is not merely a technical concern; it is an existential business continuity requirement. Global payment networks enforce strict regulatory monitoring programs that can abruptly terminate a merchant's ability to process credit card payments.",
        
        "Both Visa (Visa Dispute Monitoring Program / VDMP) and Mastercard (Excessive Chargeback Program / ECP) continuously audit a merchant's Chargeback-to-Transaction Dispute Ratio. The dispute ratio is calculated as: Dispute Ratio (%) = (Total Monthly Chargeback Disputes / Total Monthly Completed Transactions) * 100. If a merchant's dispute ratio breaches 0.90% (90 basis points) for two consecutive months, the merchant enters the Card Network Monitoring Program, incurring monthly non-compliance fines of $25,000 to $100,000.",
        
        "If the dispute ratio breaches 1.50% (150 basis points), card networks place the merchant in Excessive Status, revoking payment gateway privileges and adding the company to the MATCH (Member Alert to Control High-Risk Merchants) blacklist—a catastrophic event that effectively paralyzes an e-commerce business. World-class digital enterprises maintain their dispute ratio rigorously below 0.65% (65 basis points), ensuring exemplary network standing.",
        
        "In our institutional Python model for Part 5, we execute a comprehensive corporate fraud audit evaluating 120,000 monthly transactions and $14.4 million in gross volume. The model calculates the count-based and volume-based dispute ratios, quantifies fraud dollars intercepted by automated shields, evaluates card network regulatory standing, and confers official Enterprise Fraud Defense Architect Certification. Review the deterministic code below."
    ]

    p5_code = '''def run_enterprise_fraud_control_tower(
    monthly_orders_processed: int,
    monthly_volume_usd: float,
    fraud_dollars_intercepted_usd: float,
    chargeback_count: int,
    chargeback_volume_usd: float
) -> dict:
    """
    Executes an enterprise fraud governance audit evaluating card network dispute ratios,
    fraud dollar prevention, regulatory standing, and risk mitigation efficiency.
    """
    # 1. Calculate Card Network Dispute Ratios
    dispute_ratio_count_pct = round((chargeback_count / monthly_orders_processed) * 100.0, 3)
    dispute_ratio_volume_pct = round((chargeback_volume_usd / monthly_volume_usd) * 100.0, 3)
    
    # 2. Evaluate Card Network Monitoring Thresholds (Visa VDMP / Mastercard ECP)
    # Target < 0.65%; Early Warning: 0.65% - 0.90%; Monitoring: 0.90% - 1.50%; Excessive: > 1.50%
    if dispute_ratio_count_pct < 0.65:
        network_standing = 'EXEMPLARY_HEALTHY_PORTFOLIO'
    elif dispute_ratio_count_pct < 0.90:
        network_standing = 'CAUTION_APPROACHING_EARLY_WARNING'
    elif dispute_ratio_count_pct < 1.50:
        network_standing = 'MANDATORY_MONITORING_PENALTY_ZONE'
    else:
        network_standing = 'EXCESSIVE_CHARGEBACK_TERMINATION_RISK'
        
    is_accredited = (dispute_ratio_count_pct < 0.65) and (fraud_dollars_intercepted_usd >= 250000.0)
    
    return {
        'monthly_orders_processed': monthly_orders_processed,
        'monthly_volume_usd': monthly_volume_usd,
        'fraud_dollars_intercepted_usd': fraud_dollars_intercepted_usd,
        'total_chargeback_count': chargeback_count,
        'chargeback_dollars_usd': chargeback_volume_usd,
        'chargeback_ratio_count_pct': dispute_ratio_count_pct,
        'chargeback_ratio_volume_pct': dispute_ratio_volume_pct,
        'card_network_standing': network_standing,
        'accreditation_conferred': is_accredited,
        'governance_credential': 'APEX_FRAUD_DEFENSE_ARCHITECT_CERTIFIED' if is_accredited else 'REMEDIATION_REQUIRED'
    }

fraud_audit = run_enterprise_fraud_control_tower(
    monthly_orders_processed=120000,
    monthly_volume_usd=14400000.0,
    fraud_dollars_intercepted_usd=415000.0,
    chargeback_count=360,
    chargeback_volume_usd=43200.0
)

print("=== SOVEREIGN FRAUD CONTROL TOWER: ENTERPRISE CYBERSECURITY AUDIT ===")
print(f"Total Transactions Processed:   {fraud_audit['monthly_orders_processed']:,} orders (${fraud_audit['monthly_volume_usd']:,.2f} USD)")
print(f"Fraud Losses Intercepted:       ${fraud_audit['fraud_dollars_intercepted_usd']:,.2f} USD (Pre-cleared by bot/3DS2 engines)")
print(f"Total Chargebacks Incurred:     {fraud_audit['total_chargeback_count']} disputes (${fraud_audit['chargeback_dollars_usd']:,.2f} USD)")
print(f"Dispute Ratio (Transaction #):  {fraud_audit['chargeback_ratio_count_pct']:.3f}% (Network Target: < 0.650%)")
print(f"Dispute Ratio (Dollar Volume):  {fraud_audit['chargeback_ratio_volume_pct']:.3f}% (Volume Exposure)")
print(f"Card Network Regulatory Status: [{fraud_audit['card_network_standing']}]")
print(f"Governance Credential Conferred:[{fraud_audit['governance_credential']}] (Accredited: {fraud_audit['accreditation_conferred']})")'''

    p5_output = """=== SOVEREIGN FRAUD CONTROL TOWER: ENTERPRISE CYBERSECURITY AUDIT ===
Total Transactions Processed:   120,000 orders ($14,400,000.00 USD)
Fraud Losses Intercepted:       $415,000.00 USD (Pre-cleared by bot/3DS2 engines)
Total Chargebacks Incurred:     360 disputes ($43,200.00 USD)
Dispute Ratio (Transaction #):  0.300% (Network Target: < 0.650%)
Dispute Ratio (Dollar Volume):  0.300% (Volume Exposure)
Card Network Regulatory Status: [EXEMPLARY_HEALTHY_PORTFOLIO]
Governance Credential Conferred:[APEX_FRAUD_DEFENSE_ARCHITECT_CERTIFIED] (Accredited: True)"""

    p5_notes = [
        "The control tower audited 120,000 orders and maintained an exemplary 0.300% dispute ratio, far below the 0.650% target threshold.",
        "Automated bot shields and dynamic 3DS2 challenges successfully intercepted $415,000.00 in criminal payment fraud.",
        "Maintaining unassailable network standing with >$250k fraud intercepted confers the Apex Fraud Defense Architect Certified credential."
    ]

    p5_check = {
        "question": "What is the critical regulatory consequence if an e-commerce merchant's chargeback dispute ratio exceeds 1.50%?",
        "options": [
            "Payment card networks place the merchant in Excessive Status, imposing massive monthly fines and potentially terminating merchant account processing privileges entirely",
            "The merchant is required to double its shipping speed",
            "All customer passwords are automatically converted to numeric PINs",
            "The merchant is exempted from filing annual corporate tax returns"
        ],
        "answer": 0,
        "why": "Breaching the 1.50% dispute ratio threshold triggers punitive fines from Visa/Mastercard and places the merchant at risk of losing merchant card processing entirely via MATCH blacklisting."
    }

    parts.append({
        "title": "Enterprise Fraud Defense Control Tower & Dispute Ratio Governance",
        "say": p5_say,
        "example": "Shopify processes over $200B in annual GMV using centralized fraud models. By continuously auditing merchant chargeback ratios across hundreds of thousands of independent stores, Shopify's platform keeps platform-wide chargeback rates below 0.35%, protecting merchant payment access.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_notes,
        "tryIt": "Increase chargeback_count to 1,200 to observe how the dispute ratio spikes to 1.000%, plunging status into MANDATORY_MONITORING_PENALTY_ZONE.",
        "check": p5_check
    })

    # Assemble Day 27 dictionary
    day27_dict = {
        "day": 27,
        "title": "Cybersecurity & Anti-Fraud Engineering in E-Commerce",
        "summary": [
            "Device Fingerprinting & Biometrics: HTML5 canvas hashes, WebGL signatures, and mouse cursor entropy preventing automated bot attacks.",
            "Account Takeover (ATO) Defense: Impossible travel velocity heuristics (>600 mph), credential stuffing detection, and automated session revocation.",
            "Dynamic 3DS2 Payment Routing: Real-time risk scoring across AVS and CVV signals, securing legal chargeback liability shifts to card issuers.",
            "Chargeback Dispute Automation: Compiling Visa CE3.0 legal evidence dossiers with carrier GPS timestamps to overturn friendly fraud.",
            "Enterprise Fraud Control Tower: Maintaining dispute ratios below 0.65% across 120,000 transactions to guarantee card network standing."
        ],
        "parts": parts
    }

    # Ensure invariant: >= 580 words per part and >= 2,950 words total
    total_words = ensure_ecom_day_budget(day27_dict, min_part_words=580, min_day_words=2950)
    return day27_dict, total_words

if __name__ == '__main__':
    d, w = build_day27()
    print(f"Day 27 Built Successfully! Total Spoken Words: {w:,}")
    for idx, p in enumerate(d['parts']):
        words = count_words(" ".join(p['say']))
        print(f"  Part {idx+1}: {p['title'][:45]}... ({words} words)")
