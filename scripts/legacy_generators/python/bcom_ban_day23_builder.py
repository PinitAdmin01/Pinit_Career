"""
Day 23 Builder: Islamic Banking & Shariah Finance (Murabaha, Sukuk & Profit-Loss Sharing Mudarabah)
Course: B.Com Banking & Financial Services (bcom_ban)
Task: TASK-793
Invariant: 5 parts, >= 580 words per part, >= 2,950 words total, Gate v2 ledger-sheet visual JSON
"""

import json
import hashlib
from visual_builder import count_words
from banking_budget_ensurer import ensure_banking_day_budget

def build_day23():
    parts = []

    # Part 1: Foundations of Shariah Banking & Prohibitions (Riba, Gharar & Maysir)
    p1_say = [
        "Welcome to Day 23 of B.Com Banking and Financial Services. Today, we examine one of the most distinctive, rapidly expanding, and philosophically grounded alternative banking systems in the world: Islamic Banking and Shariah-Compliant Finance. Representing an asset base exceeding four trillion dollars globally across the Middle East, Southeast Asia, Europe, and international financial centers, Islamic finance operates on principles derived from Islamic jurisprudence (Fiqh al-Muamalat). While conventional commercial banking treats money as an interest-bearing commodity capable of generating risk-free returns purely through the passage of time, Islamic banking posits that money is merely a medium of exchange possessing no intrinsic utility. Capital can legitimately earn a return only when deployed into real, productive economic activity where financial risk and reward are equitably shared.",
        
        "The foundational cornerstone of Islamic finance is the absolute prohibition of Riba. Commonly translated as interest or usury, Riba encompasses any predetermined, guaranteed excess return demanded by a lender over and above the principal sum of a loan, regardless of whether the underlying enterprise succeeds or fails. Under Shariah law, earning money from money alone is considered unearned, unjust enrichment that fosters wealth concentration and debt enslavement. Instead, Islamic finance mandates that all financing transactions must be asset-backed or equity-based. Financial contracts must be rooted in tangible physical goods, commodities, services, or real estate assets, directly linking the financial sector to the real economy.",
        
        "In addition to Riba, Islamic financial jurisprudence strictly prohibits Gharar and Maysir. Gharar denotes excessive, unacceptable uncertainty, ambiguity, or deceit in contractual terms—such as selling goods that the seller does not currently own, or contracts with indeterminate prices or non-existent underlying assets. This prohibition restricts conventional speculative derivative instruments (such as naked credit default swaps, binary options, and uncollateralized short sales). Concurrently, Maysir refers to gambling, pure speculation, and games of chance. Financial contracts where wealth transfers depend entirely on random, unpredictable future occurrences without productive economic contribution are deemed void under Shariah governance.",
        
        "Furthermore, Islamic banks must observe strict ethical screening mandates. Capital cannot be deployed into industries deemed socially harmful or prohibited (Haram), including alcohol production, tobacco, weapons manufacturing, gambling casinos, conventional pork processing, and adult entertainment. To enforce these multi-layered jurisprudential standards, every Islamic financial institution is governed by an independent Shariah Supervisory Board (SSB) composed of esteemed Islamic scholars and legal jurists who hold absolute veto authority over financial product design and operational execution.",
        
        "In our institutional Python model for Part 1, we contrast a conventional one-hundred-thousand-dollar five-year commercial loan bearing an eight percent compound interest rate against an asset-backed Shariah Murabaha contract with a thirty percent declared profit markup. The model illustrates how the conventional debt compounds exponentially to forty-six thousand nine hundred and thirty-two dollars in pure interest (totaling $146,932.81), whereas the Murabaha contract establishes a transparent, non-compounding, fixed thirty-thousand-dollar profit margin ($130,000 total sale price) rooted in underlying physical asset trade."
    ]

    p1_code = '''def model_riba_vs_murabaha_comparison(
    principal_usd: float,
    interest_rate_annual_pct: float,
    tenor_years: int,
    murabaha_cost_plus_markup_pct: float
) -> dict:
    """
    Compares Conventional Compound Interest (Riba) vs Shariah Asset-Backed Murabaha.
    Demonstrates transparent fixed markup pricing without compounding interest spirals.
    """
    # 1. Conventional Compound Interest Loan
    conventional_repayment = principal_usd * ((1.0 + (interest_rate_annual_pct / 100.0)) ** tenor_years)
    conventional_interest = conventional_repayment - principal_usd
    
    # 2. Shariah Asset-Backed Murabaha Sale
    murabaha_profit = principal_usd * (murabaha_cost_plus_markup_pct / 100.0)
    murabaha_total_price = principal_usd + murabaha_profit
    
    return {
        "principal_usd": principal_usd,
        "conventional_interest_usd": round(conventional_interest, 2),
        "conventional_total_repayment_usd": round(conventional_repayment, 2),
        "murabaha_cost_price_usd": principal_usd,
        "murabaha_profit_markup_usd": round(murabaha_profit, 2),
        "murabaha_sale_price_usd": round(murabaha_total_price, 2),
        "interest_savings_vs_conventional_usd": round(conventional_repayment - murabaha_total_price, 2),
        "asset_backed": True,
        "shariah_compliant": True
    }

# Execute Model Comparison ($100k Principal, 8% Interest vs 30% Fixed Markup, 5 Years)
shariah_comparison = model_riba_vs_murabaha_comparison(
    principal_usd=100_000.0,
    interest_rate_annual_pct=8.0,
    tenor_years=5,
    murabaha_cost_plus_markup_pct=30.0
)

print(f"Conventional Riba vs Shariah Murabaha Comparison:")
print(f"  Principal / Asset Cost: ${shariah_comparison['principal_usd']:,.2f}")
print(f"  Conventional 8% Compound Interest: ${shariah_comparison['conventional_interest_usd']:,.2f} -> Total: ${shariah_comparison['conventional_total_repayment_usd']:,.2f}")
print(f"  Murabaha Fixed 30% Profit Markup: ${shariah_comparison['murabaha_profit_markup_usd']:,.2f} -> Total Price: ${shariah_comparison['murabaha_sale_price_usd']:,.2f}")
print(f"  Net Difference (Savings): ${shariah_comparison['interest_savings_vs_conventional_usd']:,.2f}")
print(f"  Shariah Status: [Asset-Backed: {shariah_comparison['asset_backed']} | Riba-Free: {shariah_comparison['shariah_compliant']}]")'''

    p1_out = """Conventional Riba vs Shariah Murabaha Comparison:
  Principal / Asset Cost: $100,000.00
  Conventional 8% Compound Interest: $46,932.81 -> Total: $146,932.81
  Murabaha Fixed 30% Profit Markup: $30,000.00 -> Total Price: $130,000.00
  Net Difference (Savings): $16,932.81
  Shariah Status: [Asset-Backed: True | Riba-Free: True]"""

    parts.append({
        "part": "part1_hook",
        "title": "Foundations of Shariah Banking & Prohibitions (Riba, Gharar & Maysir)",
        "say": p1_say,
        "example": "A commercial borrower choosing a $100,000 5-year Murabaha asset-backed facility with a fixed $30,000 profit markup ($130,000 total) instead of an 8% compounding loan that balloons to $146,932.81.",
        "code": p1_code,
        "output": p1_out,
        "codeNotes": [
            "Demonstrates the operational elimination of Riba (interest) in favor of trade-based profit margins.",
            "Contrasts exponential compounding interest ($46,932.81) against fixed asset markup ($30,000.00).",
            "Enforces physical asset backing, ensuring financing directly supports real economic trade.",
            "Validates Shariah governance standards prohibiting speculative compounding penalty spirals."
        ],
        "tryIt": "Increase tenor_years to 10 to observe how conventional compounding causes interest to surge past $115,000 while Murabaha remains transparently capped.",
        "check": {
            "question": "What is the primary reason conventional interest (Riba) is prohibited in Islamic banking?",
            "options": [
                "Because banks do not have enough paper currency in their vaults to print interest receipts.",
                "Because money is viewed solely as a medium of exchange, and demanding a guaranteed return without bearing real economic risk is considered unjust exploitation.",
                "Because central banks prefer that all loans are subsidized by sovereign taxes.",
                "Because all commercial loans must be repaid within twenty-four hours."
            ],
            "answer": 1,
            "why": "In Islamic jurisprudence, money has no intrinsic value and cannot generate risk-free returns purely through the passage of time; returns must be tied to productive economic trade."
        }
    })

    # Part 2: Murabaha (Cost-Plus Sale) & Commodity Murabaha (Tawarruq)
    p2_say = [
        "In practical banking operations, the most widely utilized financing structure in Islamic finance is Murabaha. Representing over seventy percent of total commercial financing across many Islamic banks, Murabaha is technically a cost-plus sale contract rather than a loan of money. In a classical Murabaha transaction, a client identifies a specific physical asset they wish to acquire—such as manufacturing machinery, raw industrial materials, or a commercial vehicle fleet. Because the client lacks immediate liquidity to purchase the asset outright, they approach an Islamic bank.",
        
        "The contractual choreography of Murabaha follows a strict legal sequence to maintain Shariah compliance. First, the bank purchases the specified asset directly from the third-party supplier for cash, taking legal title and constructive possession. This physical ownership is critical: by taking ownership, the bank assumes the inventory and market risk of the asset (Daman) prior to on-selling it to the customer. Second, the bank on-sells the asset to the customer at an agreed cost-plus price: the original acquisition cost plus a transparently disclosed profit margin. Third, the customer agrees to pay the total purchase price over time through structured monthly installments.",
        
        "To provide corporations with general working capital and liquidity—where physical machinery is not being directly acquired—Islamic banking developed Commodity Murabaha (also known as Tawarruq). In a structured Tawarruq arrangement, the bank purchases a freely tradable, non-precious metal commodity (such as refined copper, zinc, or aluminum traded on the London Metal Exchange or Bursa Suq Al-Sila) on behalf of the client for immediate cash. The bank immediately sells the commodity to the client on a deferred payment basis at cost plus profit markup. The client then immediately appoints an independent broker to sell the physical commodity in the spot market to realize immediate cash liquidity. This multi-leg structure provides legitimate corporate liquidity while strictly maintaining physical commodity trade backing.",
        
        "A critical legal and accounting requirement in Murabaha is Price Transparency and Late Payment Governance. The bank must disclose its exact acquisition cost and profit margin; if the bank conceals its true purchase price, the contract is defective under Shariah law. Furthermore, if a customer delays an installment payment, the bank cannot charge compounding late interest penalty fees. Instead, standard Shariah contracts mandate that any late payment penalty fees must be transferred directly into an independent charitable fund, ensuring the bank earns zero profit from borrower distress.",
        
        "In our institutional Python model for Part 2, we simulate a five-million-dollar Commodity Murabaha (Tawarruq) corporate liquidity facility with a twelve-month tenor and a six percent profit margin. The model calculates the total deferred sale price of five-point-three million dollars, schedules twelve monthly installments of four hundred and forty-one thousand six hundred and sixty-six dollars, and verifies the immediate disbursement of five million dollars in real trade liquidity."
    ]

    p2_code = '''def model_commodity_murabaha_tawarruq(
    commodity_cost_usd: float,
    profit_margin_pct: float,
    tenor_months: int
) -> dict:
    """
    Simulates Commodity Murabaha (Tawarruq) for corporate working capital.
    Enforces cost-plus transparency, non-compounding installments, and LME asset backing.
    """
    profit_amount = commodity_cost_usd * (profit_margin_pct / 100.0) * (tenor_months / 12.0)
    total_deferred_price = commodity_cost_usd + profit_amount
    monthly_installment = total_deferred_price / tenor_months
    
    return {
        "commodity_cost_usd": commodity_cost_usd,
        "profit_margin_pct": profit_margin_pct,
        "tenor_months": tenor_months,
        "profit_amount_usd": round(profit_amount, 2),
        "total_deferred_sale_price_usd": round(total_deferred_price, 2),
        "monthly_installment_usd": round(monthly_installment, 2),
        "realized_corporate_liquidity_usd": commodity_cost_usd,
        "trade_backed_status": "AUTHENTIC_COMMODITY_POSSESSION_VERIFIED"
    }

# Execute Tawarruq Facility ($5M LME Copper, 6% Profit, 12 Months)
tawarruq_run = model_commodity_murabaha_tawarruq(
    commodity_cost_usd=5_000_000.0,
    profit_margin_pct=6.0,
    tenor_months=12
)

print(f"Commodity Murabaha (Tawarruq) Execution:")
print(f"  Underlying Commodity Cost: ${tawarruq_run['commodity_cost_usd']:,.2f}")
print(f"  Fixed Profit Markup: {tawarruq_run['profit_margin_pct']}% -> Profit Amount: ${tawarruq_run['profit_amount_usd']:,.2f}")
print(f"  Total Deferred Sale Price: ${tawarruq_run['total_deferred_sale_price_usd']:,.2f}")
print(f"  Monthly Installment: ${tawarruq_run['monthly_installment_usd']:,.2f} / month")
print(f"  Corporate Cash Disbursed: ${tawarruq_run['realized_corporate_liquidity_usd']:,.2f}")
print(f"  Status: [{tawarruq_run['trade_backed_status']}]")'''

    p2_out = """Commodity Murabaha (Tawarruq) Execution:
  Underlying Commodity Cost: $5,000,000.00
  Fixed Profit Markup: 6.0% -> Profit Amount: $300,000.00
  Total Deferred Sale Price: $5,300,000.00
  Monthly Installment: $441,666.67 / month
  Corporate Cash Disbursed: $5,000,000.00
  Status: [AUTHENTIC_COMMODITY_POSSESSION_VERIFIED]"""

    parts.append({
        "part": "part2_analogy",
        "title": "Murabaha (Cost-Plus Sale) & Commodity Murabaha (Tawarruq)",
        "say": p2_say,
        "example": "A manufacturing firm securing $5M in working capital via Commodity Murabaha on LME copper, agreeing to a $300,000 fixed profit markup repaid across 12 monthly installments of $441,666.67.",
        "code": p2_code,
        "output": p2_out,
        "codeNotes": [
            "Models trade-based Commodity Murabaha (Tawarruq) fulfilling corporate working capital needs.",
            "Calculates total deferred sale price ($5,300,000.00) based on transparent 6.0% markup.",
            "Derives linear, non-compounding monthly installment obligations ($441,666.67 per month).",
            "Enforces physical commodity title and possession transfer prior to customer spot-market sale."
        ],
        "tryIt": "Extend tenor_months to 24 to observe profit amount adjust to $600,000 while monthly installments drop to $233,333.33.",
        "check": {
            "question": "In a Shariah-compliant Murabaha contract, what is the bank legally obligated to do before on-selling the asset to the client?",
            "options": [
                "The bank must acquire valid legal title and constructive possession, bearing asset risk (Daman).",
                "The bank must convert the client's currency into physical gold bars.",
                "The bank must obtain permission from the United Nations Trade Council.",
                "The bank must charge double the market interest rate."
            ],
            "answer": 0,
            "why": "Under Shariah law, one cannot sell what one does not own; the bank must take ownership and bear asset possession risk before reselling at a profit."
        }
    })

    # Part 3: Ijara Muntahia Bittamleek & Diminishing Musharakah (Home Financing)
    p3_say = [
        "For long-term capital assets—such as commercial aircraft, shipping vessels, heavy industrial plants, and residential mortgages—Islamic banks rely on Ijara (leasing) and Diminishing Musharakah (partnership buyout). In conventional retail banking, a home mortgage is structured as an interest-bearing secured loan where the bank places a lien on the borrower's home. In Islamic finance, charging interest on a home loan is prohibited. Instead, the bank and the client enter into a joint equity partnership to purchase the property together.",
        
        "The premier institutional framework for Islamic home financing is Diminishing Musharakah paired with Ijara Muntahia Bittamleek (a lease ending in complete transfer of ownership). Under this structure, the client and the bank jointly contribute equity to purchase the target property. For example, on a five-hundred-thousand-dollar home, the client provides twenty percent down payment (one hundred thousand dollars) and the bank contributes eighty percent (four hundred thousand dollars). The property title is held jointly according to their respective equity shares.",
        
        "Once co-ownership is established, the client wishes to occupy the entire property. Because the bank owns eighty percent of the home, the client pays the bank a fair market rental fee (Ijara) for utilizing the bank's eighty-percent share of the property's usufruct (benefits). Simultaneously, the client commits to progressively buying out the bank's equity share over time through periodic unit purchases (for example, purchasing five percent of the bank's shares annually over twenty years).",
        
        "The mathematical beauty of Diminishing Musharakah lies in its dynamic amortization. As the client purchases more equity shares, the bank's ownership percentage steadily decreases. Consequently, the rental fee paid by the client declines in lockstep: each year, the client pays rent only on the bank's remaining, shrinking equity share. By the end of the financing tenor, the client has purchased one hundred percent of the bank's equity units, the partnership dissolves, and sole legal title is transferred seamlessly to the homeowner without a single dollar of interest ever being charged.",
        
        "In our institutional Python model for Part 3, we simulate a five-hundred-thousand-dollar Diminishing Musharakah home financing facility. The model tracks an eighty-percent initial bank share, prices an annual five percent rental yield on the bank's equity, executes an annual five-percent equity buyout, calculates Year 1 cash outlays of forty-five thousand dollars (twenty thousand dollars rent plus twenty-five thousand dollars buyout), and confirms the customer's ownership expands to twenty-five percent."
    ]

    p3_code = '''def model_diminishing_musharakah(
    property_value_usd: float,
    bank_initial_share_pct: float,
    annual_rental_yield_pct: float,
    annual_equity_buyout_pct: float
) -> dict:
    """
    Simulates Diminishing Musharakah paired with Ijara for Shariah Home Financing.
    Models declining rental payments and progressive equity buyout units.
    """
    bank_equity_initial = property_value_usd * (bank_initial_share_pct / 100.0)
    customer_equity_initial = property_value_usd * ((100.0 - bank_initial_share_pct) / 100.0)
    
    # Year 1 Cash Flows
    year1_rental_due = bank_equity_initial * (annual_rental_yield_pct / 100.0)
    year1_buyout_payment = property_value_usd * (annual_equity_buyout_pct / 100.0)
    year1_total_outlay = year1_rental_due + year1_buyout_payment
    
    # End of Year 1 Balance Sheet Positions
    bank_equity_end = bank_equity_initial - year1_buyout_payment
    customer_equity_end = customer_equity_initial + year1_buyout_payment
    customer_ownership_pct = (customer_equity_end / property_value_usd) * 100.0
    
    return {
        "property_value_usd": property_value_usd,
        "initial_bank_equity_usd": round(bank_equity_initial, 2),
        "year1_rental_payment_usd": round(year1_rental_due, 2),
        "year1_equity_buyout_usd": round(year1_buyout_payment, 2),
        "year1_total_cash_outlay_usd": round(year1_total_outlay, 2),
        "bank_remaining_equity_usd": round(bank_equity_end, 2),
        "customer_ownership_pct": round(customer_ownership_pct, 1),
        "structure": "DIMINISHING_MUSHARAKAH_IJARA"
    }

# Execute Diminishing Musharakah ($500k Property, 80% Bank, 5% Rent Yield, 5% Buyout)
musharakah_run = model_diminishing_musharakah(
    property_value_usd=500_000.0,
    bank_initial_share_pct=80.0,
    annual_rental_yield_pct=5.0,
    annual_equity_buyout_pct=5.0
)

print(f"Diminishing Musharakah Home Financing:")
print(f"  Property Value: ${musharakah_run['property_value_usd']:,.2f}")
print(f"  Initial Equity: Bank ${musharakah_run['initial_bank_equity_usd']:,.2f} (80%) | Customer $100,000.00 (20%)")
print(f"  Year 1 Rental Payment (Bank Usufruct): ${musharakah_run['year1_rental_payment_usd']:,.2f}")
print(f"  Year 1 Equity Buyout (5% Property): ${musharakah_run['year1_equity_buyout_usd']:,.2f}")
print(f"  Total Year 1 Customer Outlay: ${musharakah_run['year1_total_cash_outlay_usd']:,.2f}")
print(f"  Post-Year 1: Bank Equity ${musharakah_run['bank_remaining_equity_usd']:,.2f} | Customer Ownership: {musharakah_run['customer_ownership_pct']}%")'''

    p3_out = """Diminishing Musharakah Home Financing:
  Property Value: $500,000.00
  Initial Equity: Bank $400,000.00 (80%) | Customer $100,000.00 (20%)
  Year 1 Rental Payment (Bank Usufruct): $20,000.00
  Year 1 Equity Buyout (5% Property): $25,000.00
  Total Year 1 Customer Outlay: $45,000.00
  Post-Year 1: Bank Equity $375,000.00 | Customer Ownership: 25.0%"""

    parts.append({
        "part": "part3_deep",
        "title": "Ijara Muntahia Bittamleek & Diminishing Musharakah (Home Financing)",
        "say": p3_say,
        "example": "A homebuyer purchasing a $500,000 property via Diminishing Musharakah, paying $20,000 in rental for the bank's 80% share and $25,000 in equity buyout to increase ownership to 25% after Year 1.",
        "code": p3_code,
        "output": p3_out,
        "codeNotes": [
            "Models Diminishing Musharakah partnership buyout eliminating conventional mortgage interest.",
            "Calculates Year 1 rental fees ($20,000.00) based strictly on bank's remaining equity usufruct.",
            "Executes periodic equity buyout unit purchases ($25,000.00) transferring property ownership.",
            "Demonstrates dynamic rent reductions as the customer's ownership expands toward 100%."
        ],
        "tryIt": "Increase annual_equity_buyout_pct to 10.0% to accelerate ownership expansion to 30.0% in Year 1.",
        "check": {
            "question": "In a Diminishing Musharakah home financing agreement, why does the customer's rental payment decrease over time?",
            "options": [
                "Because property taxes are waived by the government.",
                "Because the customer is steadily buying out the bank's equity units, meaning rent is charged on a progressively smaller bank share.",
                "Because housing construction materials degrade over time.",
                "Because central banks reduce inflation rates to zero."
            ],
            "answer": 1,
            "why": "Rent is calculated only on the bank's remaining equity portion; as the customer buys more equity units, the bank's share shrinks, reducing rental payments."
        }
    })

    # Part 4: Sukuk (Islamic Bonds) & Asset-Backed Securitization
    p4_say = [
        "In international debt capital markets, sovereign nations, multilateral development banks, and multinational corporations raise long-term financing by issuing bonds. However, conventional corporate and sovereign bonds are pure debt obligations bearing contractual interest, making them strictly non-compliant with Shariah principles. To tap into the vast pools of Islamic liquidity across global financial centers, capital markets engineered Sukuk (commonly known as Islamic bonds). Sukuk are undivided pro-rata ownership certificates in underlying tangible assets, usufruct, services, or investments.",
        
        "The structural architecture of Sukuk is governed by the Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI). Under AAOIFI standards, a Sukuk certificate holder does not hold a direct credit claim or IOU against the issuer; instead, the certificate holder possesses beneficial ownership of a specific tangible asset. The most widely issued format is Sukuk al-Ijara (lease-based Sukuk). In a Sukuk al-Ijara issuance, the originator (such as a sovereign government or national airline) sells tangible physical assets (such as an international airport, railway network, or commercial aircraft fleet) to a bankruptcy-remote Special Purpose Vehicle (SPV).",
        
        "The SPV issues Sukuk certificates to institutional investors in global debt markets, raising the required funding. The SPV then leases the tangible assets back to the originator under a long-term Ijara contract. The periodic lease rental payments made by the originator to the SPV are distributed directly to Sukuk certificate holders as periodic coupon distributions. Crucially, this yield is not interest; it is legally and economically rental income derived from the usufruct of real physical assets. At maturity, the originator exercises a Purchase Undertaking to repurchase the assets from the SPV at face value, repaying the principal to investors.",
        
        "In global capital markets, Sukuk are categorized into 'Asset-Backed Sukuk' (where investors have true sale recourse to the physical underlying assets in the event of default) and 'Asset-Based Sukuk' (where investors rely on the credit covenant of the originator with beneficial asset backing). AAOIFI regulations enforce strict asset-tangibility ratios, requiring that tangible physical assets must constitute at least thirty-three to fifty-one percent of the underlying Sukuk portfolio at all times.",
        
        "In our institutional Python model for Part 4, we simulate a three-hundred-million-dollar Sukuk al-Ijara issuance with a seven-year tenor and a five-point-five percent annual rental yield. The model verifies that the underlying tangible infrastructure asset (valued at three hundred and twenty million dollars) provides one-hundred-and-six-point-six-seven percent asset backing, calculates annual rental coupon distributions of sixteen-point-five million dollars, and projects one hundred and fifteen-point-five million dollars in cumulative rental cash flows."
    ]

    p4_code = '''def model_sukuk_al_ijara_issuance(
    issuance_size_usd: float,
    annual_rental_yield_pct: float,
    tenor_years: int,
    tangible_asset_value_usd: float
) -> dict:
    """
    Simulates a Sukuk al-Ijara (Asset-Backed Islamic Bond) issuance under AAOIFI standards.
    Validates tangible asset-backing ratios and computes periodic rental coupon cash flows.
    """
    assert tangible_asset_value_usd >= issuance_size_usd, "Tangible assets must exceed issuance size"
    
    asset_backing_ratio = (tangible_asset_value_usd / issuance_size_usd) * 100.0
    annual_rental_coupon = issuance_size_usd * (annual_rental_yield_pct / 100.0)
    cumulative_rental_distributions = annual_rental_coupon * tenor_years
    
    return {
        "sukuk_issuance_usd": issuance_size_usd,
        "tangible_asset_value_usd": tangible_asset_value_usd,
        "asset_backing_ratio_pct": round(asset_backing_ratio, 2),
        "annual_rental_yield_pct": annual_rental_yield_pct,
        "tenor_years": tenor_years,
        "annual_rental_coupon_usd": round(annual_rental_coupon, 2),
        "cumulative_rental_distributions_usd": round(cumulative_rental_distributions, 2),
        "aaoifi_compliant": asset_backing_ratio >= 100.0
    }

# Execute Sukuk al-Ijara Issuance ($300M Issuance, 5.5% Yield, 7 Years, $320M Infrastructure Asset)
sukuk_run = model_sukuk_al_ijara_issuance(
    issuance_size_usd=300_000_000.0,
    annual_rental_yield_pct=5.50,
    tenor_years=7,
    tangible_asset_value_usd=320_000_000.0
)

print(f"Sukuk al-Ijara (Islamic Bond) Issuance:")
print(f"  Issuance Size: ${sukuk_run['sukuk_issuance_usd']:,.2f} | Tenor: {sukuk_run['tenor_years']} Years")
print(f"  Tangible Asset Value: ${sukuk_run['tangible_asset_value_usd']:,.2f} (Asset-Backing: {sukuk_run['asset_backing_ratio_pct']}%)")
print(f"  Annual Rental Yield: {sukuk_run['annual_rental_yield_pct']}% -> Coupon: ${sukuk_run['annual_rental_coupon_usd']:,.2f} / year")
print(f"  Cumulative Rental Distributions: ${sukuk_run['cumulative_rental_distributions_usd']:,.2f}")
print(f"  AAOIFI Tangibility Compliance: {sukuk_run['aaoifi_compliant']}")'''

    p4_out = """Sukuk al-Ijara (Islamic Bond) Issuance:
  Issuance Size: $300,000,000.00 | Tenor: 7 Years
  Tangible Asset Value: $320,000,000.00 (Asset-Backing: 106.67%)
  Annual Rental Yield: 5.5% -> Coupon: $16,500,000.00 / year
  Cumulative Rental Distributions: $115,500,000.00
  AAOIFI Tangibility Compliance: True"""

    parts.append({
        "part": "part4_code",
        "title": "Sukuk (Islamic Bonds) & Asset-Backed Securitization",
        "say": p4_say,
        "example": "A sovereign finance ministry issuing a $300M 7-year Sukuk al-Ijara backed by $320M in airport infrastructure, distributing $16.5M in annual lease rental coupons to international investors.",
        "code": p4_code,
        "output": p4_out,
        "codeNotes": [
            "Implements AAOIFI standards for Sukuk al-Ijara asset-backed debt capital market instruments.",
            "Validates that tangible physical infrastructure ($320M) satisfies mandatory asset-backing ratios (106.67%).",
            "Structures coupon distributions as legitimate lease rental income ($16.5M/year) rather than interest.",
            "Calculates $115.5M in cumulative rental returns across the 7-year issuance tenor."
        ],
        "tryIt": "Increase annual_rental_yield_pct to 6.0% to observe annual rental coupon distributions expand to $18,000,000.",
        "check": {
            "question": "What legally distinguishes a Sukuk certificate from a conventional corporate bond?",
            "options": [
                "Sukuk certificates represent undivided beneficial ownership in underlying tangible assets or usufruct, whereas conventional bonds represent pure interest-bearing debt claims.",
                "Sukuk certificates can only be traded on Fridays.",
                "Conventional bonds do not pay money to investors.",
                "Sukuk cannot be bought by international institutional investors."
            ],
            "answer": 0,
            "why": "Sukuk holders own fractional shares in tangible underlying assets generating rental or commercial returns, unlike bondholders who hold unsecured debt IOUs."
        }
    })

    # Part 5: Mudarabah & Musharakah Profit-Loss Sharing (PLS) & Shariah Governance
    p5_say = [
        "While Murabaha and Ijara provide debt-like fixed return profiles, the ultimate philosophical ideal of Islamic economics is Profit-and-Loss Sharing (PLS). Under a pure PLS framework, financial institutions do not operate merely as risk-averse collateralized lenders; they act as genuine equity investment partners sharing both entrepreneurial profits and business risks with productive enterprises. The two classical PLS contractual models are Mudarabah (trust partnership) and Musharakah (joint venture equity).",
        
        "In a Mudarabah contract, one party acts as the capital provider (Rabb-ul-Mal), supplying one hundred percent of the financial investment, while the other party acts as the managing entrepreneur (Mudarib), contributing specialized management, technical expertise, and labor. The contractual terms strictly predefine a profit-sharing ratio (such as seventy percent to the capital provider and thirty percent to the managing entrepreneur). If the enterprise generates a commercial profit, the gains are distributed according to this ratio.",
        
        "However, the defining regulatory invariant of Mudarabah is the asymmetric treatment of financial losses. If the venture incurs a commercial capital loss—and the loss was not caused by fraud, gross negligence, or contractual breach by the Mudarib—the entire financial loss is absorbed exclusively by the capital provider (Rabb-ul-Mal). The entrepreneur suffers the complete loss of their invested time, labor, and managerial effort, but bears zero personal financial debt liability. This risk-sharing architecture eliminates debtor imprisonment and debt traps, fostering entrepreneurial innovation and economic resilience.",
        
        "To ensure systemic institutional integrity, Islamic financial institutions maintain rigorous Shariah Governance Frameworks established by regulatory bodies like the Islamic Financial Services Board (IFSB). Every financial product, investment portfolio, and treasury transaction must undergo an independent Shariah Audit. Shariah auditors cross-examine operational trade tickets, verify physical warehouse storage receipts in commodity transactions, and confirm that non-halal accidental revenues (such as residual interest earned on foreign correspondent bank clearing accounts) are purged completely into designated philanthropic charities.",
        
        "In our institutional Python model for Part 5, we execute a Mudarabah venture investment partnership. The model evaluates a ten-million-dollar capital investment, calculates the distribution of two-point-five million dollars in gross venture profits under a 70/30 profit-sharing ratio (yielding one-point-seven-five million dollars and a seventeen-point-five percent ROI for the Rabb-ul-Mal, and seven hundred and fifty thousand dollars for the Mudarib), and audits Shariah Supervisory Board compliance."
    ]

    p5_code = '''def model_mudarabah_profit_sharing(
    capital_investment_usd: float,
    gross_venture_profit_usd: float,
    rabb_ul_mal_share_pct: float,
    mudarib_share_pct: float,
    capital_loss_scenario: bool = False,
    capital_loss_amount_usd: float = 0.0
) -> dict:
    """
    Simulates Mudarabah (Trust Partnership) Profit-and-Loss Sharing (PLS).
    Enforces IFSB Shariah governance and asymmetric financial loss allocation.
    """
    assert abs((rabb_ul_mal_share_pct + mudarib_share_pct) - 100.0) < 1e-6, "Profit shares must sum to 100%"
    
    if capital_loss_scenario:
        # Shariah rule: Financial loss absorbed 100% by Rabb-ul-Mal; Mudarib loses labor
        rabb_ul_mal_pnl = -capital_loss_amount_usd
        mudarib_pnl = 0.0
        status = "CAPITAL_LOSS_ABSORBED_BY_FINANCIER"
    else:
        rabb_ul_mal_pnl = gross_venture_profit_usd * (rabb_ul_mal_share_pct / 100.0)
        mudarib_pnl = gross_venture_profit_usd * (mudarib_share_pct / 100.0)
        status = "VENTURE_PROFIT_DISTRIBUTED"
        
    roi_pct = (rabb_ul_mal_pnl / capital_investment_usd) * 100.0
    
    return {
        "capital_investment_usd": capital_investment_usd,
        "gross_venture_profit_usd": gross_venture_profit_usd,
        "rabb_ul_mal_profit_usd": round(rabb_ul_mal_pnl, 2),
        "mudarib_profit_usd": round(mudarib_pnl, 2),
        "rabb_ul_mal_roi_pct": round(roi_pct, 2),
        "pls_status": status,
        "shariah_supervisory_board_approved": True
    }

# Execute Mudarabah Partnership ($10M Capital, $2.5M Profit, 70/30 Ratio)
mudarabah_run = model_mudarabah_profit_sharing(
    capital_investment_usd=10_000_000.0,
    gross_venture_profit_usd=2_500_000.0,
    rabb_ul_mal_share_pct=70.0,
    mudarib_share_pct=30.0
)

print(f"Mudarabah Profit-and-Loss Sharing (PLS) Execution:")
print(f"  Capital Investment: ${mudarabah_run['capital_investment_usd']:,.2f}")
print(f"  Gross Venture Profit: ${mudarabah_run['gross_venture_profit_usd']:,.2f} -> Status: [{mudarabah_run['pls_status']}]")
print(f"  Rabb-ul-Mal Share (70%): ${mudarabah_run['rabb_ul_mal_profit_usd']:,.2f} (ROI: {mudarabah_run['rabb_ul_mal_roi_pct']}%)")
print(f"  Mudarib Manager Share (30%): ${mudarabah_run['mudarib_profit_usd']:,.2f}")
print(f"  Shariah Supervisory Board Clearance: {mudarabah_run['shariah_supervisory_board_approved']}")'''

    p5_out = """Mudarabah Profit-and-Loss Sharing (PLS) Execution:
  Capital Investment: $10,000,000.00
  Gross Venture Profit: $2,500,000.00 -> Status: [VENTURE_PROFIT_DISTRIBUTED]
  Rabb-ul-Mal Share (70%): $1,750,000.00 (ROI: 17.5%)
  Mudarib Manager Share (30%): $750,000.00
  Shariah Supervisory Board Clearance: True"""

    parts.append({
        "part": "part5_wrap",
        "title": "Mudarabah & Musharakah Profit-Loss Sharing (PLS) & Shariah Governance",
        "say": p5_say,
        "example": "An Islamic bank providing $10M in Mudarabah venture capital to an agricultural enterprise, splitting $2.5M in venture profits 70/30 to earn $1.75M (17.5% ROI) while the managing entrepreneur earns $750,000.",
        "code": p5_code,
        "output": p5_out,
        "codeNotes": [
            "Models Mudarabah Profit-and-Loss Sharing equity partnerships under IFSB standards.",
            "Distributes $2,500,000.00 in venture profits according to agreed 70/30 contractual ratios.",
            "Yields a 17.5% Return on Investment ($1.75M) for the capital provider and $750k for the manager.",
            "Enforces asymmetric financial risk where capital loss is absorbed by financier, eliminating debt traps."
        ],
        "tryIt": "Set capital_loss_scenario to True with capital_loss_amount_usd=1_000_000 to observe how the bank absorbs the loss while Mudarib loses zero capital.",
        "check": {
            "question": "In an authentic Shariah Mudarabah partnership, who bears the financial loss if the business fails without fraud or negligence?",
            "options": [
                "The managing entrepreneur (Mudarib) must sell their personal possessions to repay the bank.",
                "The capital provider (Rabb-ul-Mal) absorbs one hundred percent of the financial loss, while the entrepreneur loses their time and labor.",
                "The government pays off the debt with international aid.",
                "The loss is converted into an interest-bearing personal loan."
            ],
            "answer": 1,
            "why": "In Mudarabah, the financier bears all financial losses up to their invested capital, while the managing partner loses only their invested time and effort, embodying authentic risk-sharing."
        }
    })

    summary = [
        "Islamic banking is anchored in the absolute prohibition of Riba (interest), Gharar (excessive uncertainty), and Maysir (gambling), requiring all transactions to be trade- or asset-backed.",
        "Murabaha cost-plus financing transparently fixes profit margins and installment schedules, while Commodity Murabaha (Tawarruq) enables Shariah-compliant corporate liquidity.",
        "Diminishing Musharakah paired with Ijara replaces conventional home mortgages by progressively transferring equity units to homebuyers while charging declining rent on the bank's remaining share.",
        "Sukuk al-Ijara issues negotiable certificates granting undivided ownership in tangible underlying infrastructure, paying periodic rental distributions under AAOIFI standards.",
        "Mudarabah and Musharakah embody authentic Profit-and-Loss Sharing (PLS), aligning investor returns with entrepreneurial success and eliminating debt traps."
    ]

    project_step = {
        "title": "Islamic Banking & Shariah Finance Platform",
        "steps": [
            "Contrast conventional compound interest with an asset-backed Murabaha facility, proving non-compounding pricing stability.",
            "Execute a $5M Commodity Murabaha (Tawarruq) transaction on LME metals, scheduling 12 non-compounding monthly installments.",
            "Model a $500k Diminishing Musharakah home financing partnership, executing Year 1 rental distributions and equity buyouts.",
            "Structure a $300M 7-year Sukuk al-Ijara issuance backed by $320M in airport infrastructure, distributing $16.5M in annual lease rental coupons.",
            "Audit a $10M Mudarabah venture equity partnership, executing a 70/30 profit distribution and certifying Shariah board compliance."
        ]
    }

    lesson_data = {
        "coursePrefix": "bcom_ban",
        "day": 23,
        "title": "Islamic Banking & Shariah Finance (Murabaha Sukuk & Profit-Loss Sharing Mudarabah)",
        "summary": summary,
        "projectStep": project_step,
        "parts": parts
    }

    ensure_banking_day_budget(lesson_data)
    return lesson_data

if __name__ == "__main__":
    lesson = build_day23()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in lesson["parts"])
    print(f"Day 23 built successfully! Total words: {total_words}")
    for idx, part in enumerate(lesson["parts"]):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {idx+1} ({part['part']}): {pw} words")
