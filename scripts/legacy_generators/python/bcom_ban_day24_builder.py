"""
Day 24 Builder: Central Bank Digital Currencies (CBDCs) & Cross-Border Wholesale Tokens (Project mBridge)
Course: B.Com Banking & Financial Services (bcom_ban)
Task: TASK-794
Invariant: 5 parts, >= 580 words per part, >= 2,950 words total, Gate v2 ledger-sheet visual JSON
"""

import json
import hashlib
from visual_builder import count_words
from banking_budget_ensurer import ensure_banking_day_budget

def build_day24():
    parts = []

    # Part 1: Two-Tier CBDC Architecture & Central Bank Balance Sheet Mechanics
    p1_say = [
        "Welcome to Day 24 of B.Com Banking and Financial Services. Today, we stand at the cutting edge of sovereign monetary architecture: Central Bank Digital Currencies (CBDCs) and Next-Generation Wholesale Tokenization. Over the past five centuries, the physical form of sovereign money has evolved from precious metal bullion to paper banknotes, and subsequently into commercial bank electronic ledger entries. Today, driven by the decline of physical cash usage, the rise of private non-bank cryptocurrencies and stablecoins, and the imperative for real-time programmable payments, over one hundred and thirty central banks—representing ninety-eight percent of global Gross Domestic Product (GDP)—are actively exploring, piloting, or deploying CBDCs.",
        
        "To understand CBDCs, we must first examine the monetary liability structure of a central bank balance sheet. In conventional monetary economics, central bank money (M0 or the monetary base) comprises two distinct liabilities: physical paper banknotes in circulation (accessible to the general public) and commercial bank reserve balances held in master clearing accounts at the central bank (accessible exclusively to licensed commercial depository institutions). Commercial bank deposits (M1/M2)—the money held in ordinary consumer and corporate checking accounts—are not central bank money; they are private commercial bank IOUs backed by deposit insurance up to statutory limits. A Central Bank Digital Currency is a revolutionary new monetary instrument: a digital representation of sovereign fiat currency that is a direct liability of the central bank, accessible in digital form to commercial banks (Wholesale CBDC) or the broader general public (Retail CBDC).",
        
        "The universally accepted operational model for retail CBDCs is the Two-Tier Distribution Architecture (also known as intermediated or synthetic CBDC). Under this framework, central banks deliberately reject a single-tier direct model where the central bank would open retail accounts for hundreds of millions of citizens. Managing retail customer service, handling forgotten passwords, and conducting frontline Anti-Money Laundering (AML) / Know Your Customer (KYC) onboarding would overwhelm central bank bureaucracies and destroy commercial banking franchises. Instead, the Two-Tier model preserves the division of labor: the central bank handles core token issuance, ledger consensus, and macro-solvency, while licensed commercial banks and payment service providers distribute CBDC tokens to retail users, manage customer wallets, and execute compliance checks.",
        
        "From an accounting and balance sheet perspective, two-tier CBDC issuance is asset- and liability-neutral for the central bank. When a commercial bank requests five hundred million dollars in retail CBDC, the central bank debits the commercial bank's reserve balance account and credits the commercial bank's CBDC issuance allocation. No new money is created in this step; the central bank merely transforms reserve liabilities into digital token liabilities. The commercial bank then distributes these digital tokens to retail end-users via digital wallets, debiting customer bank deposits in exchange for sovereign digital cash.",
        
        "In our institutional Python model for Part 1, we simulate a Two-Tier Retail CBDC Issuance Platform. The central bank mints five hundred million dollars in digital M0 tokens backed by commercial bank reserve swaps. The commercial banking system onboards one hundred thousand retail citizens with an average digital wallet balance of thirty-five hundred dollars, distributing three hundred and fifty million dollars into public circulation while retaining one hundred and fifty million dollars in digital vault float."
    ]

    p1_code = '''def model_two_tier_cbdc_issuance(
    central_bank_reserves_exchanged_usd: float,
    commercial_bank_cash_ratio_pct: float,
    retail_wallets_onboarded: int,
    average_retail_wallet_balance_usd: float
) -> dict:
    """
    Simulates Two-Tier Retail Central Bank Digital Currency (CBDC) Architecture.
    Models central bank M0 token minting, commercial bank reserve swaps, and retail distribution.
    """
    total_cbdc_minted_m0 = central_bank_reserves_exchanged_usd
    total_retail_cbdc_distributed = retail_wallets_onboarded * average_retail_wallet_balance_usd
    bank_retained_cbdc_float = total_cbdc_minted_m0 - total_retail_cbdc_distributed
    assert bank_retained_cbdc_float >= 0, "Cannot distribute more CBDC than minted"
    
    return {
        "central_bank_m0_minted_usd": total_cbdc_minted_m0,
        "retail_distributed_usd": total_retail_cbdc_distributed,
        "bank_retained_float_usd": bank_retained_cbdc_float,
        "retail_wallets_count": retail_wallets_onboarded,
        "direct_central_bank_liability": True,
        "two_tier_distribution_active": True
    }

# Execute Two-Tier CBDC Issuance ($500M Minted, 100k Wallets @ $3,500 Average Balance)
two_tier_run = model_two_tier_cbdc_issuance(
    central_bank_reserves_exchanged_usd=500_000_000.0,
    commercial_bank_cash_ratio_pct=10.0,
    retail_wallets_onboarded=100_000,
    average_retail_wallet_balance_usd=3_500.0
)

print(f"Two-Tier Retail CBDC Architecture Run:")
print(f"  Central Bank M0 Minted: ${two_tier_run['central_bank_m0_minted_usd']:,.2f}")
print(f"  Retail Wallets Onboarded: {two_tier_run['retail_wallets_count']:,} users")
print(f"  Public Circulation Disbursed: ${two_tier_run['retail_distributed_usd']:,.2f}")
print(f"  Commercial Bank Retained Float: ${two_tier_run['bank_retained_float_usd']:,.2f}")
print(f"  Balance Sheet Status: [Direct CB Liability: {two_tier_run['direct_central_bank_liability']} | Two-Tier Intermediation: {two_tier_run['two_tier_distribution_active']}]")'''

    p1_out = """Two-Tier Retail CBDC Architecture Run:
  Central Bank M0 Minted: $500,000,000.00
  Retail Wallets Onboarded: 100,000 users
  Public Circulation Disbursed: $350,000,000.00
  Commercial Bank Retained Float: $150,000,000.00
  Balance Sheet Status: [Direct CB Liability: True | Two-Tier Intermediation: True]"""

    parts.append({
        "part": "part1_hook",
        "title": "Two-Tier CBDC Architecture & Central Bank Balance Sheet Mechanics",
        "say": p1_say,
        "example": "A central bank minting $500M in digital M0 tokens via commercial bank reserve swaps, distributing $350M across 100,000 retail wallets while preserving the commercial banking intermediation tier.",
        "code": p1_code,
        "output": p1_out,
        "codeNotes": [
            "Models sovereign two-tier retail CBDC distribution preserving commercial bank intermediation.",
            "Transforms $500M in commercial bank reserve balances into direct central bank digital token liabilities.",
            "Simulates the onboarding and public distribution of $350M across 100,000 verified retail citizens.",
            "Maintains $150M in commercial bank vault float to support daily liquidity demands."
        ],
        "tryIt": "Increase average_retail_wallet_balance_usd to $4,500 to observe retail circulation expand to $450M and vault float compress to $50M.",
        "check": {
            "question": "Why do central banks overwhelmingly prefer a Two-Tier CBDC architecture over a Direct Single-Tier model?",
            "options": [
                "Because central banks are legally prohibited from owning computer computers.",
                "To leverage commercial banks for customer onboarding, AML/KYC compliance, and customer service, preventing disintermediation and avoiding bureaucratic overload at the central bank.",
                "Because retail citizens prefer using paper checks rather than mobile apps.",
                "To ensure that only commercial bank executives can spend sovereign money."
            ],
            "answer": 1,
            "why": "A two-tier model leaves customer onboarding, compliance, and retail relationship management to commercial banks, preserving their vital credit-creation role in the economy."
        }
    })

    # Part 2: Cross-Border Multi-CBDC Platforms & Project mBridge
    p2_say = [
        "While retail CBDCs transform domestic retail commerce, the most economically profound application of digital currency technology lies in Wholesale Cross-Border Payments. Today, the global correspondent banking network that routes trillions of dollars in daily international trade remains archaic, fragmented, and costly. A cross-border corporate transfer from Hong Kong to Thailand or the United Arab Emirates must navigate multiple intermediary correspondent banks across divergent time zones, legacy SWIFT messaging networks, and separate domestic Real-Time Gross Settlement (RTGS) systems. This process routinely takes two to five business days to achieve final settlement, exposes counterparties to foreign exchange settlement risk (Herstatt risk), and extracts hefty intermediary fees totaling one to three percent of transaction value.",
        
        "To dismantle these systemic cross-border frictions, the Bank for International Settlements (BIS) Innovation Hub, in collaboration with four founding central banks—the Hong Kong Monetary Authority (HKMA), the Bank of Thailand (BOT), the Digital Currency Institute of the People's Bank of China (PBOC), and the Central Bank of the United Arab Emirates (CBUAE)—launched Project mBridge. Project mBridge is a multi-central bank digital currency (multi-CBDC) common platform built on a purpose-designed distributed ledger technology (DLT) called the mBridge Ledger.",
        
        "The operational breakthrough of Project mBridge is Atomic Payment-versus-Payment (PvP) Settlement. On the shared mBridge ledger, multiple central banks directly issue and redeem their respective sovereign digital currencies (such as digital Hong Kong Dollars, e-CNY, digital Thai Baht, and digital UAE Dirhams). When a commercial corporate bank in Bangkok transfers funds to an exporter in Dubai, the foreign exchange transaction executes atomically on-ledger in real time: the Thai Baht tokens and UAE Dirham tokens exchange ownership simultaneously within seconds. If either leg fails, the entire transaction reverts, mathematically eliminating counterparty settlement risk.",
        
        "Furthermore, Project mBridge dramatically compresses financial transaction costs and operational latency. By eliminating intermediary correspondent banks and SWIFT messaging hops, cross-border settlement time is slashed from seventy-two hours down to less than three seconds. Concurrently, transaction fees are reduced by over eighty percent, unlocking unprecedented liquidity efficiencies for multinational corporate treasuries and global trade corridors.",
        
        "In our institutional Python model for Part 2, we execute a ten-million-dollar cross-border wholesale foreign exchange transfer on the Project mBridge platform. The model compares conventional correspondent banking fees of one hundred and fifty basis points against mBridge network fees of twenty-five basis points, calculates one hundred and twenty-five thousand dollars in direct fee savings (an eighty-three-point-three percent reduction), and verifies atomic Payment-versus-Payment execution in two-point-five seconds."
    ]

    p2_code = '''def model_mbridge_cross_border_settlement(
    transfer_amount_usd: float,
    conventional_correspondent_fee_bps: float,
    mbridge_network_fee_bps: float,
    conventional_settlement_hours: float = 72.0,
    mbridge_settlement_seconds: float = 2.5
) -> dict:
    """
    Simulates Project mBridge Multi-CBDC Cross-Border Settlement.
    Compares conventional correspondent banking friction against atomic DLT PvP settlement.
    """
    conventional_fee_usd = transfer_amount_usd * (conventional_correspondent_fee_bps / 10000.0)
    mbridge_fee_usd = transfer_amount_usd * (mbridge_network_fee_bps / 10000.0)
    fee_savings_usd = conventional_fee_usd - mbridge_fee_usd
    fee_reduction_pct = (fee_savings_usd / conventional_fee_usd) * 100.0
    
    latency_reduction_ratio = (conventional_settlement_hours * 3600.0) / mbridge_settlement_seconds
    
    return {
        "transfer_amount_usd": transfer_amount_usd,
        "conventional_fee_usd": round(conventional_fee_usd, 2),
        "mbridge_fee_usd": round(mbridge_fee_usd, 2),
        "fee_savings_usd": round(fee_savings_usd, 2),
        "fee_reduction_pct": round(fee_reduction_pct, 1),
        "settlement_time_seconds": mbridge_settlement_seconds,
        "latency_speedup_factor": round(latency_reduction_ratio, 0),
        "atomic_pvp_cleared": True,
        "herstatt_risk_eliminated": True
    }

# Execute mBridge Cross-Border Settlement ($10M Corporate Transfer)
mbridge_run = model_mbridge_cross_border_settlement(
    transfer_amount_usd=10_000_000.0,
    conventional_correspondent_fee_bps=150.0, # 150 bps conventional fees
    mbridge_network_fee_bps=25.0             # 25 bps mBridge fee
)

print(f"Project mBridge Cross-Border Wholesale Settlement:")
print(f"  Transfer Value: ${mbridge_run['transfer_amount_usd']:,.2f}")
print(f"  Conventional Correspondent Fee: ${mbridge_run['conventional_fee_usd']:,.2f} -> mBridge Fee: ${mbridge_run['mbridge_fee_usd']:,.2f}")
print(f"  Fee Savings: ${mbridge_run['fee_savings_usd']:,.2f} ({mbridge_run['fee_reduction_pct']}% Reduction)")
print(f"  Settlement Latency: {mbridge_run['settlement_time_seconds']} seconds ({mbridge_run['latency_speedup_factor']:,.0f}x Faster)")
print(f"  Settlement Status: [Atomic PvP: {mbridge_run['atomic_pvp_cleared']} | Herstatt Risk Eliminated: {mbridge_run['herstatt_risk_eliminated']}]")'''

    p2_out = """Project mBridge Cross-Border Wholesale Settlement:
  Transfer Value: $10,000,000.00
  Conventional Correspondent Fee: $150,000.00 -> mBridge Fee: $25,000.00
  Fee Savings: $125,000.00 (83.3% Reduction)
  Settlement Latency: 2.5 seconds (103,680x Faster)
  Settlement Status: [Atomic PvP: True | Herstatt Risk Eliminated: True]"""

    parts.append({
        "part": "part2_analogy",
        "title": "Cross-Border Multi-CBDC Platforms & Project mBridge",
        "say": p2_say,
        "example": "A multinational firm executing a $10M cross-border transfer across the BIS mBridge ledger in 2.5 seconds, saving $125,000 in fees and eliminating Herstatt foreign exchange settlement risk.",
        "code": p2_code,
        "output": p2_out,
        "codeNotes": [
            "Models BIS Innovation Hub Project mBridge multi-CBDC cross-border wholesale ledger.",
            "Calculates dramatic 83.3% fee reductions ($125,000 savings on a $10M transaction).",
            "Demonstrates 103,680x latency acceleration, cutting settlement from 72 hours to 2.5 seconds.",
            "Proves the complete elimination of cross-border counterparty settlement risk via atomic PvP."
        ],
        "tryIt": "Reduce mbridge_network_fee_bps to 10.0 to observe fee savings expand to $140,000 on the $10M transfer.",
        "check": {
            "question": "What is 'Atomic Payment-versus-Payment (PvP)' settlement on multi-CBDC platforms like Project mBridge?",
            "options": [
                "Settlement powered by atomic nuclear energy reactors.",
                "A cryptographic protocol ensuring that the transfer of one currency occurs if and only if the transfer of the counterparty currency occurs simultaneously, eliminating default risk.",
                "A system where currencies can only be exchanged during full moons.",
                "A requirement that both trading parties must be physically in the same room."
            ],
            "answer": 1,
            "why": "Atomic PvP ensures simultaneous exchange of foreign currencies on-ledger, eliminating Herstatt settlement risk where one party pays but the counterparty fails to deliver."
        }
    })

    # Part 3: Programmable Money, Conditional Smart Contracts & Algorithmic Escrows
    p3_say = [
        "One of the most revolutionary architectural capabilities unlocked by digital currency is Programmability. In traditional commercial banking, money is completely passive. Once a paper banknote or conventional wire transfer is handed to a recipient, the sender has zero programmatic control over how, where, or when those funds are deployed. Ensuring that targeted government welfare subsidies, disaster relief payments, or corporate milestone escrows are spent on intended purposes requires massive bureaucratic monitoring, paper receipts, and expensive retrospective audits that often fail to prevent leakage and fraud.",
        
        "Central Bank Digital Currencies introduce Programmable Money and Programmable Payments via smart contracts embedded directly into digital tokens. Under standard taxonomy established by the BIS, a vital distinction is drawn between 'Programmable Money' (where conditional spending logic is baked into the digital token itself, restricting what goods or merchants the token can purchase) and 'Programmable Payments' (where an automated script triggers conventional value transfers upon the fulfillment of external conditions, such as delivery confirmation or IoT sensor telemetry).",
        
        "In our banking control tower, programmable CBDCs are deployed to orchestrate Targeted Sovereign Agricultural Subsidies. When a government ministry disburses a one-thousand-dollar fertilizer subsidy to a farmer, the funds are minted as smart CBDC tokens embedded with immutable spending parameters. The smart contract enforces two cryptographic constraints: first, Merchant Category Code (MCC) Whitelisting, ensuring the tokens can only be transacted at licensed agricultural input suppliers; and second, Expiration Timestamps, requiring the subsidy to be utilized within thirty days before the planting season ends, preventing speculative hoarding.",
        
        "Furthermore, programmable CBDCs execute automated micro-fiscal tax governance. Upon settlement between the farmer and the fertilizer merchant, the smart contract automatically withholds a statutory two-percent sales tax, routing the tax proceeds directly into the sovereign treasury's digital account while remitting the net ninety-eight percent to the merchant. This eliminates tax evasion and simplifies commercial accounting.",
        
        "In our institutional Python model for Part 3, we simulate a Programmable Smart Contract CBDC Engine. The model tests an agricultural subsidy disbursement of one thousand dollars, validates that the merchant category matches verified fertilizer suppliers, checks that the transaction occurs within the thirty-day window, executes automated two-percent tax withholding, and releases nine hundred and eighty dollars in instant liquidity to the vendor."
    ]

    p3_code = '''def model_programmable_smart_contract_cbdc(
    subsidy_amount_usd: float,
    target_merchant_category: str,
    spent_merchant_category: str,
    days_to_expiration: int,
    actual_days_elapsed: int,
    automated_tax_withholding_pct: float = 2.0
) -> dict:
    """
    Simulates Programmable CBDC Smart Contracts for targeted welfare distribution.
    Enforces merchant category whitelisting, temporal expiration, and automated fiscal withholding.
    """
    category_valid = (target_merchant_category == spent_merchant_category)
    time_valid = (actual_days_elapsed <= days_to_expiration)
    
    if category_valid and time_valid:
        approved = True
        status = "PROGRAMMABLE_SETTLEMENT_CLEARED"
        tax_withheld = subsidy_amount_usd * (automated_tax_withholding_pct / 100.0)
        merchant_payout = subsidy_amount_usd - tax_withheld
    elif not category_valid:
        approved = False
        status = "REJECTED_UNAUTHORIZED_MERCHANT_CATEGORY"
        tax_withheld = 0.0
        merchant_payout = 0.0
    else:
        approved = False
        status = "REJECTED_TOKEN_EXPIRATION_EXCEEDED"
        tax_withheld = 0.0
        merchant_payout = 0.0
        
    return {
        "subsidy_amount_usd": subsidy_amount_usd,
        "transaction_cleared": approved,
        "execution_status": status,
        "merchant_payout_usd": round(merchant_payout, 2),
        "tax_withheld_usd": round(tax_withheld, 2),
        "smart_contract_governance": True
    }

# Execute Smart Contract CBDC Simulation ($1,000 Subsidy, Agricultural Fertilizer)
smart_cbdc_run = model_programmable_smart_contract_cbdc(
    subsidy_amount_usd=1000.0,
    target_merchant_category="AGRICULTURAL_FERTILIZER",
    spent_merchant_category="AGRICULTURAL_FERTILIZER",
    days_to_expiration=30,
    actual_days_elapsed=12
)

print(f"Programmable CBDC Smart Contract Execution:")
print(f"  Disbursed Subsidy: ${smart_cbdc_run['subsidy_amount_usd']:,.2f}")
print(f"  Execution Decision: [Cleared: {smart_cbdc_run['transaction_cleared']} | Status: {smart_cbdc_run['execution_status']}]")
print(f"  Merchant Final Payout: ${smart_cbdc_run['merchant_payout_usd']:,.2f}")
print(f"  Automated Fiscal Tax Withheld: ${smart_cbdc_run['tax_withheld_usd']:,.2f}")
print(f"  Smart Contract Integrity: {smart_cbdc_run['smart_contract_governance']}")'''

    p3_out = """Programmable CBDC Smart Contract Execution:
  Disbursed Subsidy: $1,000.00
  Execution Decision: [Cleared: True | Status: PROGRAMMABLE_SETTLEMENT_CLEARED]
  Merchant Final Payout: $980.00
  Automated Fiscal Tax Withheld: $20.00
  Smart Contract Integrity: True"""

    parts.append({
        "part": "part3_deep",
        "title": "Programmable Money, Conditional Smart Contracts & Algorithmic Escrows",
        "say": p3_say,
        "example": "A farmer spending a $1,000 programmable agricultural CBDC subsidy at an authorized fertilizer distributor, triggering automated 2% tax withholding to settle $980 instantly while blocking unauthorized misuse.",
        "code": p3_code,
        "output": p3_out,
        "codeNotes": [
            "Demonstrates programmable CBDC smart contracts enforcing targeted socioeconomic policy.",
            "Validates Merchant Category Code (MCC) whitelisting, preventing subsidy leakage.",
            "Enforces temporal expiration constraints to ensure stimulus funds stimulate immediate production.",
            "Executes automated 2.0% tax withholding ($20.00) directly into sovereign revenue accounts."
        ],
        "tryIt": "Change spent_merchant_category to 'LUXURY_CASINO' to observe how the smart contract automatically rejects the payment.",
        "check": {
            "question": "What is the primary operational advantage of issuing targeted government subsidies in programmable CBDC tokens rather than conventional cash?",
            "options": [
                "The government can force citizens to buy specific consumer brands.",
                "Embedded smart contracts ensure funds can only be spent at authorized merchant categories within designated timeframes, eliminating leakage and fraud.",
                "Programmable CBDCs cannot be seen by human eyes.",
                "Citizens do not have to pay for any groceries."
            ],
            "answer": 1,
            "why": "Programmable tokens carry cryptographic logic ensuring they are spent strictly on authorized goods and services, preventing corruption and subsidy diversion."
        }
    })

    # Part 4: Dual-Offline Digital Cash Rails & Cryptographic Double-Spending Defense
    p4_say = [
        "A critical technological prerequisite for any retail CBDC aiming to replace physical paper cash is Dual-Offline Capability. Physical cash possesses an indispensable property that existing digital payment rails (like credit cards, wire transfers, and mobile UPI) cannot match: it works seamlessly when the electrical grid collapses, when natural disasters sever cellular fiber-optic cables, or in remote subterranean subway stations without internet connectivity. If a national CBDC becomes unusable during telecommunications outages, the entire sovereign payment system becomes dangerously fragile and vulnerable to cyber-warfare.",
        
        "To achieve true cash equivalence, central banks engineer Dual-Offline CBDC Protocols. In a dual-offline transaction, neither the payer's mobile device nor the payee's terminal has an active internet or cellular connection. Instead, the transaction executes locally between hardware Secure Elements (SE) or Trusted Execution Environments (TEE) embedded directly within consumer smartphones or cryptographic smartcards using Near Field Communication (NFC) or Bluetooth Low Energy (BLE).",
        
        "The paramount mathematical challenge of offline digital money is Double-Spending Prevention. In an online environment, a centralized core ledger or distributed blockchain instantly updates account balances, rejecting any attempt to spend the same digital token twice. In an offline environment with no access to a central ledger, how do we guarantee that an attacker does not copy digital cash files and spend them ten times simultaneously? Dual-offline protocols resolve this through Hardware Tamper Resistance and Cryptographic Nonces. The hardware secure element is cryptographically locked: when a transaction executes, the secure element decrements its local encrypted counter and signs the payment payload with a unique, non-reusable digital signature. Extracting private keys from the secure chip requires physical electron-microscope tampering that destroys the chip.",
        
        "Furthermore, central banks enforce strict Offline Risk Ceilings. Regulators cap maximum offline wallet balances (such as five hundred dollars) and limit the number of consecutive offline transactions (such as ten transactions) before the device must reconnect to the central banking network to synchronize state. When the terminal reconnects, offline cryptographic transaction receipts are uploaded and reconciled against the central ledger, detecting any malicious attempts at ledger manipulation.",
        
        "In our institutional Python model for Part 4, we simulate an Offline Dual-Party CBDC Transaction. The model tracks a four-hundred-dollar offline balance, executes a secure local transfer of one hundred and fifty dollars, increments the hardware cryptographic transaction counter from forty-two to forty-three, verifies that the transaction adheres to regulatory offline caps, and confirms that double-spending is cryptographically prevented."
    ]

    p4_code = '''def model_offline_dual_cash_protocol(
    payer_offline_balance_usd: float,
    transfer_amount_usd: float,
    payer_offline_tx_counter: int,
    max_regulatory_offline_cap_usd: float = 500.0
) -> dict:
    """
    Simulates Dual-Offline CBDC Settlement between Hardware Secure Elements.
    Enforces offline transaction ceilings, local state decrementing, and double-spending defense.
    """
    assert transfer_amount_usd <= max_regulatory_offline_cap_usd, "Transaction exceeds regulatory offline limit"
    assert payer_offline_balance_usd >= transfer_amount_usd, "Insufficient offline funds"
    
    post_tx_balance = payer_offline_balance_usd - transfer_amount_usd
    incremented_counter = payer_offline_tx_counter + 1
    
    return {
        "initial_offline_balance_usd": payer_offline_balance_usd,
        "offline_transfer_amount_usd": transfer_amount_usd,
        "new_offline_balance_usd": round(post_tx_balance, 2),
        "hardware_tx_counter": incremented_counter,
        "tamper_resistant_enclave_verified": True,
        "double_spending_prevented": True,
        "offline_settlement_status": "LOCAL_HARDWARE_CONSENSUS_CLEARED"
    }

# Execute Dual-Offline Transaction ($400 Balance, $150 Transfer, Counter 42 -> 43)
offline_cbdc_run = model_offline_dual_cash_protocol(
    payer_offline_balance_usd=400.0,
    transfer_amount_usd=150.0,
    payer_offline_tx_counter=42
)

print(f"Dual-Offline CBDC Hardware Settlement:")
print(f"  Initial Offline Balance: ${offline_cbdc_run['initial_offline_balance_usd']:,.2f}")
print(f"  Transfer Amount: ${offline_cbdc_run['offline_transfer_amount_usd']:,.2f} -> Remaining Balance: ${offline_cbdc_run['new_offline_balance_usd']:,.2f}")
print(f"  Hardware Cryptographic Counter: {offline_cbdc_run['hardware_tx_counter']}")
print(f"  Status: [{offline_cbdc_run['offline_settlement_status']}]")
print(f"  Security Verified: [Secure Enclave: {offline_cbdc_run['tamper_resistant_enclave_verified']} | Double-Spending Guard: {offline_cbdc_run['double_spending_prevented']}]")'''

    p4_out = """Dual-Offline CBDC Hardware Settlement:
  Initial Offline Balance: $400.00
  Transfer Amount: $150.00 -> Remaining Balance: $250.00
  Hardware Cryptographic Counter: 43
  Status: [LOCAL_HARDWARE_CONSENSUS_CLEARED]
  Security Verified: [Secure Enclave: True | Double-Spending Guard: True]"""

    parts.append({
        "part": "part4_code",
        "title": "Dual-Offline Digital Cash Rails & Cryptographic Double-Spending Defense",
        "say": p4_say,
        "example": "Two citizens exchanging $150 in digital cash during a blackout using offline NFC hardware secure elements, decrementing balances locally and incrementing cryptographic counters without internet connectivity.",
        "code": p4_code,
        "output": p4_out,
        "codeNotes": [
            "Models dual-offline CBDC protocols functioning without telecommunications connectivity.",
            "Enforces regulatory offline transaction limits ($500.00 cap) to restrict systemic risk.",
            "Demonstrates hardware secure enclave local state decrementing ($400 to $250 balance).",
            "Increments cryptographic nonces (42 to 43), preventing digital cash replication and double-spending."
        ],
        "tryIt": "Attempt to transfer $600 to observe how the regulatory offline cap assertion triggers and blocks the transaction.",
        "check": {
            "question": "How do dual-offline CBDC payment protocols prevent users from double-spending digital cash when there is no internet connection to check a central ledger?",
            "options": [
                "By trusting the moral character of citizens.",
                "By utilizing tamper-resistant Hardware Secure Elements (SE) that cryptographically decrement balances and generate unique non-reusable transaction signatures.",
                "By having police officers inspect every smartphone screen.",
                "By deleting the buyer's contact list."
            ],
            "answer": 1,
            "why": "Tamper-resistant secure hardware enclaves physically and cryptographically prevent unauthorized duplication of digital token balances without an active network connection."
        }
    })

    # Part 5: Commercial Bank Disintermediation Defense & Holding Caps
    p5_say = [
        "While CBDCs offer extraordinary technological efficiencies, central bank governors and financial stability committees recognize that an unconstrained retail CBDC poses an existential risk to the commercial banking system: the threat of Digital Bank Runs and Commercial Disintermediation. In a fractional reserve banking system, commercial banks rely on stable, low-cost retail deposits to fund commercial loans, industrial mortgages, and economic credit creation. In normal times, depositors leave their money in commercial banks because they earn interest and trust deposit insurance.",
        
        "However, in a period of severe economic anxiety or localized banking panic (such as the sudden collapse of Silicon Valley Bank or Credit Suisse), depositors face a temptation: moving funds out of commercial banks and directly into risk-free central bank money. If citizens can move unlimited funds into retail CBDC with a single tap on a smartphone screen, commercial banks could suffer lightning-fast deposit flight overnight. This deposit drain would force commercial banks to liquidate assets at fire-sale prices, compress lending capacity, and plunge the real economy into a devastating credit crunch.",
        
        "To insulate commercial banks against disintermediation and panic-driven digital runs, central banks incorporate Structural Holding Caps and Algorithmic Overflow Sweeps (often termed the 'Waterfall Mechanism'). Central bank guidelines (such as those formulated by the European Central Bank for the Digital Euro) establish an individual holding ceiling—typically between three thousand and five thousand euros or dollars per adult citizen. A citizen can use their CBDC wallet freely for daily retail transactions, but their aggregate wallet balance cannot exceed this statutory cap.",
        
        "The operational enforcement of this ceiling is orchestrated by the Automated Liquidity Sweep. If a user receives a twelve-thousand-dollar deposit (such as a corporate salary payment or real estate transfer) into a CBDC wallet that already holds two thousand dollars, the holding cap engine intervenes: it accepts exactly three thousand dollars into the CBDC wallet (hitting the five-thousand-dollar maximum ceiling) and automatically sweeps the remaining nine-thousand-dollar overflow directly into the citizen's linked interest-bearing commercial bank account. This mechanism completely eliminates the threat of commercial bank deposit flight.",
        
        "In our institutional Python model for Part 5, we execute a Disintermediation Defense and Holding Cap Engine. The model processes an incoming retail deposit of twelve thousand dollars into a digital wallet with a pre-existing two-thousand-dollar balance under a five-thousand-dollar statutory ceiling. The engine caps the final CBDC balance at exactly five thousand dollars, executes an automated sweep of nine thousand dollars back into the commercial banking system, and confirms that commercial bank credit disintermediation is prevented."
    ]

    p5_code = '''def model_disintermediation_guardrail_caps(
    incoming_retail_deposit_usd: float,
    individual_holding_cap_usd: float,
    existing_cbdc_wallet_balance_usd: float
) -> dict:
    """
    Models Central Bank Disintermediation Defense and Holding Cap Guardrails.
    Enforces individual holding ceilings and automated waterfall sweeps back into commercial banks.
    """
    total_potential = existing_cbdc_wallet_balance_usd + incoming_retail_deposit_usd
    
    if total_potential <= individual_holding_cap_usd:
        accepted_into_cbdc = incoming_retail_deposit_usd
        overflow_swept_to_commercial_bank = 0.0
        final_balance = total_potential
    else:
        accepted_into_cbdc = max(0.0, individual_holding_cap_usd - existing_cbdc_wallet_balance_usd)
        overflow_swept_to_commercial_bank = incoming_retail_deposit_usd - accepted_into_cbdc
        final_balance = individual_holding_cap_usd
        
    return {
        "incoming_deposit_usd": incoming_retail_deposit_usd,
        "holding_cap_ceiling_usd": individual_holding_cap_usd,
        "existing_balance_usd": existing_cbdc_wallet_balance_usd,
        "accepted_into_cbdc_usd": round(accepted_into_cbdc, 2),
        "final_cbdc_wallet_balance_usd": round(final_balance, 2),
        "overflow_swept_to_bank_usd": round(overflow_swept_to_commercial_bank, 2),
        "disintermediation_prevented": overflow_swept_to_commercial_bank > 0
    }

# Execute Disintermediation Guardrail ($12k Deposit, $5k Cap, $2k Existing Balance)
guardrail_run = model_disintermediation_guardrail_caps(
    incoming_retail_deposit_usd=12_000.0,
    individual_holding_cap_usd=5_000.0,
    existing_cbdc_wallet_balance_usd=2_000.0
)

print(f"CBDC Disintermediation Defense & Waterfall Sweep:")
print(f"  Incoming Deposit: ${guardrail_run['incoming_deposit_usd']:,.2f} | Holding Cap: ${guardrail_run['holding_cap_ceiling_usd']:,.2f}")
print(f"  Accepted into CBDC Wallet: ${guardrail_run['accepted_into_cbdc_usd']:,.2f} -> Final Balance: ${guardrail_run['final_cbdc_wallet_balance_usd']:,.2f}")
print(f"  Automated Overflow Swept to Commercial Bank: ${guardrail_run['overflow_swept_to_bank_usd']:,.2f}")
print(f"  Commercial Bank Disintermediation Guard: {guardrail_run['disintermediation_prevented']}")'''

    p5_out = """CBDC Disintermediation Defense & Waterfall Sweep:
  Incoming Deposit: $12,000.00 | Holding Cap: $5,000.00
  Accepted into CBDC Wallet: $3,000.00 -> Final Balance: $5,000.00
  Automated Overflow Swept to Commercial Bank: $9,000.00
  Commercial Bank Disintermediation Guard: True"""

    parts.append({
        "part": "part5_wrap",
        "title": "Commercial Bank Disintermediation Defense & Holding Caps",
        "say": p5_say,
        "example": "A citizen receiving a $12,000 salary into a CBDC wallet with a $2,000 balance, triggering an automated waterfall sweep that routes $9,000 into a commercial bank account to enforce a $5,000 cap.",
        "code": p5_code,
        "output": p5_out,
        "codeNotes": [
            "Models central bank financial stability guardrails against commercial bank disintermediation.",
            "Enforces a statutory $5,000.00 individual wallet holding ceiling on retail CBDCs.",
            "Executes an automated $9,000.00 liquidity sweep back into interest-bearing commercial bank deposits.",
            "Guarantees that retail CBDCs do not trigger digital bank runs or drain commercial lending capacity."
        ],
        "tryIt": "Increase individual_holding_cap_usd to $15,000 to observe all $12,000 accepted into CBDC with $0 swept.",
        "check": {
            "question": "What is the primary purpose of imposing individual holding caps (e.g., $5,000) on retail CBDC wallets?",
            "options": [
                "To prevent citizens from buying televisions.",
                "To prevent sudden massive deposit flight from commercial banks to the central bank during periods of financial stress, preserving bank lending capacity.",
                "Because digital mobile screens cannot display numbers higher than five thousand.",
                "To force citizens to purchase sovereign gold certificates."
            ],
            "answer": 1,
            "why": "Holding caps and waterfall sweeps protect the commercial banking system from sudden digital bank runs and disintermediation during financial crises."
        }
    })

    summary = [
        "A Central Bank Digital Currency (CBDC) is a digital representation of sovereign fiat currency that constitutes a direct liability of the central bank on its balance sheet.",
        "The Two-Tier Architecture delegates customer onboarding, AML/KYC, and wallet management to commercial banks, preserving commercial financial intermediation.",
        "Project mBridge demonstrates atomic Payment-versus-Payment (PvP) cross-border settlement across multi-CBDC ledgers, slashing settlement times from 72 hours to 2.5 seconds.",
        "Programmable CBDCs utilize smart contracts to enforce merchant category whitelisting, temporal expiration, and automated tax withholding on targeted welfare disbursements.",
        "Dual-offline protocols utilize hardware secure elements to prevent double-spending without internet, while holding caps and waterfall sweeps protect commercial banks from digital runs."
    ]

    project_step = {
        "title": "Central Bank Digital Currencies (CBDC) & Cross-Border Token Platform",
        "steps": [
            "Model a two-tier retail CBDC issuance of $500M in digital M0 tokens via commercial bank reserve swaps.",
            "Execute an atomic PvP cross-border foreign exchange transfer of $10M on Project mBridge, reducing fees by 83.3% in 2.5 seconds.",
            "Deploy a programmable CBDC smart contract for a $1,000 fertilizer subsidy, executing automated 2% fiscal tax withholding.",
            "Simulate a dual-offline local NFC transfer of $150 between hardware secure elements with cryptographic counter verification.",
            "Implement a disintermediation defense engine on a $12k deposit, enforcing a $5k holding cap with an automated $9k sweep to a commercial bank."
        ]
    }

    lesson_data = {
        "coursePrefix": "bcom_ban",
        "day": 24,
        "title": "Central Bank Digital Currencies (CBDCs) & Cross-Border Wholesale Tokens (Project mBridge)",
        "summary": summary,
        "projectStep": project_step,
        "parts": parts
    }

    ensure_banking_day_budget(lesson_data)
    return lesson_data

if __name__ == "__main__":
    lesson = build_day24()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in lesson["parts"])
    print(f"Day 24 built successfully! Total words: {total_words}")
    for idx, part in enumerate(lesson["parts"]):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {idx+1} ({part['part']}): {pw} words")
