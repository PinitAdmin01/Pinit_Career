# scripts/data_scrm_day37.py
# Day 37: Dynamic Pricing Engines: Tiered, Slab, Usage-Based & Currency Normalization
# Course: bcom_scrm (Enterprise B2B Sales, Customer Success & CRM Systems Architecture)
# 100% pure Python standard library, strictly zero third-party packages.

# -------------------------------------------------------------
# Part 1: Pricing Models Architecture: Flat, Tiered, Slab & Usage-Based Consumption
# -------------------------------------------------------------
p1_say = [
    "In modern enterprise software and cloud infrastructure monetization, pricing strategy is no longer a static commercial decision made once during annual executive planning. It has evolved into a real-time, dynamic algorithmic discipline that directly governs customer acquisition velocity, net revenue expansion, and corporate gross margins. As B2B companies transition from legacy perpetual licenses to recurring subscription and usage-based consumption models, revenue operations architects must engineer pricing calculation engines capable of executing complex multi-bracket mathematical formulas with zero computational latency and sub-cent precision.",
    "The fundamental architectural challenge in pricing engine design lies in distinguishing between Two Diametrically Opposed Volume Monetization Models: 1) Tiered Pricing (also known as Cliff or Volume Pricing), and 2) Slab Pricing (also known as Graduated, Block, or Tiered-Bracket Pricing). While these terms are frequently conflated by junior sales reps, their underlying mathematical mechanics, customer incentives, and revenue consequences are profoundly different.",
    "In a Tiered (Cliff) Pricing Model, the total quantity purchased determines a single unified unit price that is applied retroactively to all purchased units. For example, consider a tier schedule: 1 to 50 seats at $100/seat; 51 to 100 seats at $80/seat; and 101+ seats at $60/seat. If a customer purchases 50 seats, their total cost is 50 * $100 = $5,000. However, if the customer purchases 51 seats, the price for ALL 51 seats immediately drops to $80, resulting in a total cost of 51 * $80 = $4,080. This creates The Perverse Cliff Incentive: purchasing MORE software costs LESS total money! Sophisticated procurement officers exploit this dynamic by artificially inflating license quantities to trigger cheaper volume cliffs, resulting in unearned discount leakage for the vendor.",
    "Conversely, in a Slab (Graduated) Pricing Model, units are evaluated and priced incrementally within their respective volume brackets. Under the exact same schedule, purchasing 75 seats is calculated as: the first 50 seats are billed at $100/seat ($5,000), and the remaining 25 seats are billed at $80/seat ($2,000), yielding a total cost of $7,000 (an effective blended price of $93.33/seat). In Slab pricing, the marginal revenue function is strictly non-negative: purchasing an additional unit ALWAYS increases total contract value, completely eliminating the cliff arbitrage loophole.",
    "Beyond seat-based subscriptions, modern cloud vendors (such as Snowflake, Amazon Web Services, and Twilio) deploy Usage-Based Consumption Rating Engines. In a consumption model, customers are billed for discrete metering events: API transactions processed, gigabytes of data stored, compute core-hours consumed, or neural network inference tokens generated. The pricing engine must ingest high-velocity streaming usage telemetry from cloud message queues, aggregate events into hourly or daily rating windows, apply multi-tier slab formulas, and compute unbilled accrued revenue in real time.",
    "A foundational architectural invariant enforced by enterprise pricing engines is The Monotonic Marginal Revenue Invariant: For any non-negative quantity increment dQ > 0, the total price function P(Q + dQ) must be greater than or equal to P(Q). If a proposed pricing tier configuration violates monotonicity, the CPQ administrative daemon automatically flags the rule as defective and rejects catalog publication.",
    "From a database architecture perspective, pricing brackets are represented as structured range intervals: [lower_bound, upper_bound, unit_price, flat_base_fee]. The pricing engine executes interval range queries to decompose an inbound quantity into its constituent bracket slices, computing both marginal bracket costs and the aggregate blended unit price.",
    "In Part 1, we build the Pure Python Multi-Model Dynamic Pricing Engine. We implement flat, tiered (cliff), slab (graduated), and usage-based consumption rating algorithms, and verify mathematical revenue monotonicity.",
    "From an enterprise monetization engineering standpoint, modern CPQ systems also support Hybrid Subscriptions with Overage Caps. In these contracts, an enterprise customer commits to a fixed baseline annual commitment (e.g., $100,000 for 1,000,000 monthly API calls), and any excess usage beyond the baseline is rated at a discounted overage slab rate. The CPQ engine must model Drawdown Burn Schedules: tracking customer usage against committed drawdown funds and generating automated notification alerts when an account consumes 80% and 95% of its committed capacity.",
    "Furthermore, the pricing engine enforces Rate Lock Guarantees across multi-year renewals. When enterprise customers negotiate 3-year or 5-year contracts, they demand contractual caps on annual price increases (typically capped at 3% to 5% per annum or tied directly to the Consumer Price Index - CPI). The CPQ engine models these multi-year escalation curves programmatically, automatically generating projected future-year billing schedules and ensuring seamless contract renewals without manual sales recalculations."
]

p1_code = '''# Day 37 Part 1: Multi-Model Dynamic Pricing Engine (Tiered vs Slab vs Usage)
import collections

class PricingBracket:
    def __init__(self, lower_bound, upper_bound, unit_price, flat_fee=0.0):
        self.lower = int(lower_bound)
        self.upper = int(upper_bound) if upper_bound is not None else float("inf")
        self.unit_price = float(unit_price)
        self.flat_fee = float(flat_fee)

class DynamicPricingEngine:
    """Calculates Flat, Tiered (Cliff), Slab (Graduated), and Usage-Based pricing."""
    def __init__(self):
        # schedule_id -> list of PricingBracket sorted by lower_bound
        self.schedules = collections.defaultdict(list)

    def register_schedule(self, schedule_id, brackets):
        # Sort brackets by lower bound
        sorted_brackets = sorted(brackets, key=lambda b: b.lower)
        self.schedules[schedule_id] = sorted_brackets

    def calculate_tiered_cliff_price(self, schedule_id, quantity):
        """Tiered (Cliff) Pricing: One single price applied to ALL units."""
        brackets = self.schedules.get(schedule_id, [])
        if not brackets or quantity <= 0:
            return {"total_price": 0.0, "effective_unit_price": 0.0, "tier_applied": "NONE"}

        matched_bracket = None
        for b in brackets:
            if b.lower <= quantity <= b.upper:
                matched_bracket = b
                break

        if not matched_bracket:
            matched_bracket = brackets[-1]

        total = (quantity * matched_bracket.unit_price) + matched_bracket.flat_fee
        effective = total / quantity if quantity > 0 else 0.0
        return {
            "model": "TIERED_CLIFF",
            "quantity": quantity,
            "unit_price_applied": matched_bracket.unit_price,
            "total_price": round(total, 2),
            "effective_unit_price": round(effective, 2)
        }

    def calculate_slab_graduated_price(self, schedule_id, quantity):
        """Slab (Graduated) Pricing: Each bracket priced incrementally."""
        brackets = self.schedules.get(schedule_id, [])
        if not brackets or quantity <= 0:
            return {"total_price": 0.0, "effective_unit_price": 0.0, "brackets_breakdown": []}

        remaining_qty = quantity
        total_price = 0.0
        breakdown = []

        for b in brackets:
            if remaining_qty <= 0:
                break
            # Capacity of this bracket
            bracket_capacity = (b.upper - b.lower + 1) if b.upper != float("inf") else remaining_qty
            qty_in_bracket = min(remaining_qty, bracket_capacity)
            
            bracket_cost = (qty_in_bracket * b.unit_price) + b.flat_fee
            total_price += bracket_cost
            remaining_qty -= qty_in_bracket

            breakdown.append({
                "range": f"{b.lower}-{b.upper if b.upper != float('inf') else 'inf'}",
                "quantity_billed": qty_in_bracket,
                "unit_price": b.unit_price,
                "bracket_subtotal": round(bracket_cost, 2)
            })

        effective = total_price / quantity if quantity > 0 else 0.0
        return {
            "model": "SLAB_GRADUATED",
            "quantity": quantity,
            "total_price": round(total_price, 2),
            "effective_unit_price": round(effective, 2),
            "brackets_breakdown": breakdown
        }

# Define Pricing Brackets:
# 1-50 seats: $100/seat
# 51-100 seats: $80/seat
# 101-500 seats: $60/seat
# 501+ seats: $45/seat
enterprise_brackets = [
    PricingBracket(1, 50, 100.0),
    PricingBracket(51, 100, 80.0),
    PricingBracket(101, 500, 60.0),
    PricingBracket(501, None, 45.0)
]

engine = DynamicPricingEngine()
engine.register_schedule("SEATS_ENTERPRISE", enterprise_brackets)

print("=" * 68)
print("DYNAMIC PRICING ENGINE: TIERED (CLIFF) VS SLAB (GRADUATED)")
print("=" * 68)

# Demonstrate the Perverse Cliff Incentive (50 seats vs 51 seats)
q50_cliff = engine.calculate_tiered_cliff_price("SEATS_ENTERPRISE", 50)
q51_cliff = engine.calculate_tiered_cliff_price("SEATS_ENTERPRISE", 51)
print(f"Tiered Cliff Evaluation:")
print(f"  50 Seats Total: ${q50_cliff['total_price']:,.2f} (${q50_cliff['effective_unit_price']}/seat)")
print(f"  51 Seats Total: ${q51_cliff['total_price']:,.2f} (${q51_cliff['effective_unit_price']}/seat) <-- CLIFF ARBITRAGE!")
print(f"  --> Buying 1 MORE seat saves ${q50_cliff['total_price'] - q51_cliff['total_price']:,.2f} total money!")
print("-" * 68)

# Demonstrate Slab Pricing Protection (Monotonic Marginal Revenue)
q50_slab = engine.calculate_slab_graduated_price("SEATS_ENTERPRISE", 50)
q51_slab = engine.calculate_slab_graduated_price("SEATS_ENTERPRISE", 51)
q250_slab = engine.calculate_slab_graduated_price("SEATS_ENTERPRISE", 250)
print(f"Slab Graduated Evaluation (Monotonic Revenue Guaranteed):")
print(f"  50 Seats Total:  ${q50_slab['total_price']:,.2f} (Effective: ${q50_slab['effective_unit_price']}/seat)")
print(f"  51 Seats Total:  ${q51_slab['total_price']:,.2f} (Effective: ${q51_slab['effective_unit_price']}/seat)")
print(f"  250 Seats Total: ${q250_slab['total_price']:,.2f} (Effective: ${q250_slab['effective_unit_price']}/seat)")
print("-" * 68)
print("Slab Breakdown for 250 Seats:")
for b in q250_slab["brackets_breakdown"]:
    print(f"  Bracket {b['range']:<10}: {b['quantity_billed']:>3} seats @ ${b['unit_price']:>5.2f} = ${b['bracket_subtotal']:>8,.2f}")
print("=" * 68)
'''

p1_mcq = {
    "question": "What is the primary commercial and financial risk of using Tiered (Cliff) Pricing instead of Slab (Graduated) Pricing in enterprise software contracts?",
    "options": [
        "Tiered Cliff Pricing creates perverse cliff incentives where purchasing slightly more units causes the total price to drop, allowing buyers to exploit volume arbitrage and causing unearned revenue leakage.",
        "Tiered Pricing requires sales representatives to pay cash penalties to the government.",
        "Tiered Pricing causes cloud databases to corrupt customer data tables.",
        "Tiered Pricing is illegal under international maritime trade treaties."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Tiered Cliff pricing applies a single lower unit rate across all units once a threshold is crossed, causing total contract cost to drop as quantity increases, unlike Slab pricing which prices each tier incrementally."
}

# -------------------------------------------------------------
# Part 2: Multi-Currency Normalization, FX Hedging & Purchasing Power Parity (PPP)
# -------------------------------------------------------------
p2_say = [
    "As enterprise software corporations expand across international markets, the complexity of pricing expands exponentially. Selling exclusively in United States Dollars (USD) creates severe friction in foreign enterprise sales: European, British, Japanese, Australian, and Indian corporate buyers frequently refuse to assume foreign exchange (FX) currency risk on multi-year software contracts. Procurement departments demand contracts denominated in their local operational currencies (EUR, GBP, JPY, AUD, CAD, INR) to align with their internal accounting and annual operational expense budgets.",
    "However, selling multi-year enterprise software contracts in foreign currencies exposes the software vendor to Catastrophic FX Volatility Risk. Consider an enterprise SaaS vendor based in San Francisco that signs a 3-year Master Services Agreement denominated in Japanese Yen (JPY) for 150,000,000 JPY per year. At the time of signing in 2021, the exchange rate was 110 JPY/USD, representing $1,363,636 in recognized annual recurring revenue. By late 2023, the Yen depreciated to 155 JPY/USD: the exact same 150M JPY contract was suddenly worth only $967,741 USD—a devastating unhedged revenue loss of over $395,000 per year (a 29% decline in recognized USD ARR) with zero change in customer usage or software delivery costs!",
    "To protect corporate financial predictability, enterprise CPQ pricing engines incorporate Multi-Currency Normalization and Embedded FX Hedging Buffers. Rather than using the raw mid-market spot exchange rate quoted by financial market APIs, the CPQ engine applies An Actuarial FX Risk Premium Buffer (typically +3% to +6% depending on historical currency pair volatility). This buffer absorbs normal macroeconomic exchange rate fluctuations over the contract duration, ensuring that foreign-denominated quotes yield their targeted net USD gross margin floors.",
    "Furthermore, global revenue teams deploy Purchasing Power Parity (PPP) Regional Price Indexing. In high-growth emerging economies (such as India, Brazil, or Southeast Asia), enterprise software budgets and local engineering salaries operate at significantly lower nominal dollar figures than in North America or Western Europe. Applying rigid North American USD list prices to emerging markets severely compresses market penetration, driving potential customers to local low-cost competitors.",
    "The CPQ pricing engine implements Regional PPP Multipliers: adjusting base catalog list prices using World Bank Purchasing Power Parity indices and localized price elasticity models (e.g., applying a 0.65 PPP multiplier in Latin America or 0.50 in India). To prevent Cross-Border Geographic Arbitrage (where a multinational enterprise headquartered in New York attempts to purchase software licenses through its Mumbai subsidiary to exploit PPP discounts), the engine enforces The Global Ultimate Owner (GUO) Territory Gating Invariant: PPP discount multipliers are restricted strictly to organizations whose Global Ultimate Parent entity is legally domiciled within that specific emerging market economic territory.",
    "Additionally, modern CPQ systems integrate Currency Revaluation Bands: If currency volatility exceeds a contractually agreed corridor (e.g., +/- 15% fluctuation from contract baseline rate), the contract contains an automated FX adjustment clause that resets local invoice billing amounts, protecting both the buyer and vendor from extreme macroeconomic currency dislocations.",
    "In Part 2, we build the Pure Python Multi-Currency Normalization & FX Hedging Engine. We model currency price books, implement actuarial hedging buffers, enforce PPP regional index multipliers, and construct territorial arbitrage protection gates.",
    "To manage foreign exchange volatility systematically, global corporations establish Automated Treasury FX Synchronization Pipelines. Rather than relying on manual periodic spreadsheet updates by sales operations, modern CPQ platforms connect via secure webhooks directly to enterprise treasury management systems (such as Kyriba, Bloomberg, or Reuters FX feeds). Every evening at 00:00 UTC, the system ingests rolling 30-day Volume-Weighted Average Prices (VWAP) for all active corporate currencies, automatically updating CPQ regional price books while maintaining historical exchange rate snapshots on pending quotes.",
    "Additionally, international pricing architectures incorporate Value-Added Tax (VAT) and Goods and Services Tax (GST) Regional Normalization. In cross-border software procurement, European Union VAT regulations (reverse-charge mechanisms for B2B buyers) and Indian GST compliance require real-time tax identification number validation (such as VIES API lookups for EU VAT numbers). The CPQ pricing engine validates customer tax identifiers at quotation time, determining whether quotes must be displayed as tax-inclusive or tax-exclusive and ensuring strict statutory compliance with international tax authorities."
]

p2_code = '''# Day 37 Part 2: Multi-Currency Normalization & FX Hedging Engine
import collections

class CurrencyRate:
    def __init__(self, currency_code, spot_fx_to_usd, hedging_buffer_pct=0.04):
        self.code = currency_code
        self.spot_fx = float(spot_fx_to_usd) # Units of foreign currency per 1 USD
        self.buffer_pct = float(hedging_buffer_pct) # Actuarial buffer (e.g. 4%)
        # Hedged Rate: Protects vendor against foreign currency depreciation
        # If USD appreciates against foreign currency, vendor requires more foreign currency units
        self.hedged_fx = self.spot_fx * (1.0 + self.buffer_pct)

class RegionalPricingZone:
    def __init__(self, zone_name, currency_code, ppp_multiplier=1.0, allow_cross_border=False):
        self.zone = zone_name
        self.currency = currency_code
        self.ppp_multiplier = float(ppp_multiplier)
        self.allow_cross_border = allow_cross_border

class MultiCurrencyPricingNormalizer:
    """Normalizes USD base catalog prices into local currencies with FX buffers and PPP."""
    def __init__(self):
        self.currencies = {}
        self.zones = {}

    def register_currency(self, rate: CurrencyRate):
        self.currencies[rate.code] = rate

    def register_zone(self, zone: RegionalPricingZone):
        self.zones[zone.zone] = zone

    def convert_usd_to_local_quote(self, usd_base_amount, zone_name, buyer_domicile_country="US"):
        zone = self.zones.get(zone_name)
        if not zone:
            raise ValueError(f"Unknown pricing zone: {zone_name}")

        curr = self.currencies.get(zone.currency)
        if not curr:
            raise ValueError(f"Unknown currency: {zone.currency}")

        # Check Geographic Arbitrage Gate
        effective_ppp = zone.ppp_multiplier
        arbitrage_flag = False
        if effective_ppp < 1.0 and not zone.allow_cross_border:
            # If buyer is US-domiciled trying to buy in India zone, block PPP discount!
            if buyer_domicile_country in ["US", "GB", "DE"]:
                effective_ppp = 1.0 # Revoke PPP discount!
                arbitrage_flag = True

        # Calculation: USD Base * PPP Multiplier * Hedged FX Rate
        ppp_adjusted_usd = usd_base_amount * effective_ppp
        local_currency_amount = ppp_adjusted_usd * curr.hedged_fx

        # Equivalent USD realized at spot exchange rate
        realized_usd_at_spot = local_currency_amount / curr.spot_fx

        return {
            "zone": zone_name,
            "currency": curr.code,
            "usd_base_amount": round(usd_base_amount, 2),
            "spot_fx_rate": curr.spot_fx,
            "hedged_fx_rate": round(curr.hedged_fx, 4),
            "ppp_multiplier_applied": effective_ppp,
            "arbitrage_protection_triggered": arbitrage_flag,
            "local_currency_quote_price": round(local_currency_amount, 2),
            "realized_usd_at_spot": round(realized_usd_at_spot, 2),
            "vendor_fx_safety_buffer_usd": round(realized_usd_at_spot - (usd_base_amount * effective_ppp), 2)
        }

# Setup Engine
normalizer = MultiCurrencyPricingNormalizer()

# Register Currencies with Actuarial Hedging Buffers
normalizer.register_currency(CurrencyRate("USD", 1.0, hedging_buffer_pct=0.0))
normalizer.register_currency(CurrencyRate("EUR", 0.92, hedging_buffer_pct=0.03)) # 3% buffer on Euro
normalizer.register_currency(CurrencyRate("GBP", 0.79, hedging_buffer_pct=0.03)) # 3% buffer on Pound
normalizer.register_currency(CurrencyRate("JPY", 152.0, hedging_buffer_pct=0.06)) # 6% buffer on Yen (higher volatility)
normalizer.register_currency(CurrencyRate("INR", 83.5, hedging_buffer_pct=0.05)) # 5% buffer on Rupee

# Register Regional Pricing Zones
normalizer.register_zone(RegionalPricingZone("ZONE_NORTH_AMERICA", "USD", ppp_multiplier=1.0))
normalizer.register_zone(RegionalPricingZone("ZONE_EMEA_CORE", "EUR", ppp_multiplier=1.0))
normalizer.register_zone(RegionalPricingZone("ZONE_JAPAN", "JPY", ppp_multiplier=0.95)) # 5% localization
normalizer.register_zone(RegionalPricingZone("ZONE_INDIA", "INR", ppp_multiplier=0.55)) # 45% PPP discount for Indian domestic companies

BASE_USD = 100000.0 # $100k Enterprise Software License

print("=" * 68)
print("MULTI-CURRENCY PRICING NORMALIZATION & FX HEDGING AUDIT")
print("=" * 68)

# 1. Normalizing to Eurozone
res_eur = normalizer.convert_usd_to_local_quote(BASE_USD, "ZONE_EMEA_CORE")
print(f"Zone: {res_eur['zone']} ({res_eur['currency']})")
print(f"  --> Spot FX: {res_eur['spot_fx_rate']} | Hedged FX (+3%): {res_eur['hedged_fx_rate']}")
print(f"  --> Local Quote Price: {res_eur['local_currency_quote_price']:,.2f} EUR")
print(f"  --> Realized USD at Spot: ${res_eur['realized_usd_at_spot']:,.2f} (Includes ${res_eur['vendor_fx_safety_buffer_usd']:,.2f} FX Buffer)")
print("-" * 68)

# 2. Normalizing to Japan with 6% Volatility Buffer
res_jpy = normalizer.convert_usd_to_local_quote(BASE_USD, "ZONE_JAPAN")
print(f"Zone: {res_jpy['zone']} ({res_jpy['currency']})")
print(f"  --> Spot FX: {res_jpy['spot_fx_rate']} | Hedged FX (+6%): {res_jpy['hedged_fx_rate']}")
print(f"  --> Local Quote Price: {res_jpy['local_currency_quote_price']:,.2f} JPY")
print(f"  --> Realized USD at Spot: ${res_jpy['realized_usd_at_spot']:,.2f}")
print("-" * 68)

# 3. India Domestic Company vs US Arbitrage Attempt
res_in_domestic = normalizer.convert_usd_to_local_quote(BASE_USD, "ZONE_INDIA", buyer_domicile_country="IN")
res_in_arbitrage = normalizer.convert_usd_to_local_quote(BASE_USD, "ZONE_INDIA", buyer_domicile_country="US")

print(f"Zone: ZONE_INDIA (Domestic Buyer vs Geographic Arbitrage Attempt):")
print(f"  Domestic India Enterprise: Quote = {res_in_domestic['local_currency_quote_price']:,.2f} INR (PPP Multiplier 0.55 Applied)")
print(f"  US Conglomerate Arbitrage: Quote = {res_in_arbitrage['local_currency_quote_price']:,.2f} INR (ARBITRAGE BLOCKED - PPP Revoked!)")
print("=" * 68)
'''

p2_mcq = {
    "question": "Why do enterprise CPQ pricing engines incorporate an actuarial FX hedging buffer (e.g., +3% to +6%) when generating sales quotes in foreign currencies?",
    "options": [
        "To absorb macroeconomic exchange rate fluctuations over multi-year contract durations, ensuring the vendor's realized USD revenue does not drop below corporate gross margin thresholds due to foreign currency depreciation.",
        "To secretly inflate the sales rep's commission without the buyer's knowledge.",
        "Because credit card companies charge a mandatory sixty percent transaction fee.",
        "To pay mandatory bribes to foreign customs officers during software download."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Actuarial hedging buffers protect multi-year foreign currency contracts against adverse exchange rate movements, guaranteeing that realized revenue in the vendor's home currency meets margin targets."
}

# -------------------------------------------------------------
# Part 3: The $1.2M Currency Arbitrage & Runaway Over-Discounting Incident
# -------------------------------------------------------------
p3_say = [
    "To instill the uncompromising importance of automated multi-currency synchronization and discount stacking guardrails, we examine a multi-million-dollar forensic case study: The $1,200,000 Currency Arbitrage & Over-Discounting Catastrophe. In 2023, an enterprise DevOps infrastructure software vendor with $180M in ARR uncovered a devastating revenue leakage scheme: over a fourteen-month period, seventy-two enterprise software contracts had been closed at effective discounts exceeding 80% of catalog list price, resulting in $1,240,000 in direct cash revenue losses and severe post-quarter financial restatements.",
    "The disaster was catalyzed by Two Interconnected Architectural Defects in the company's CPQ configuration: 1) Stale Static Price Books: In 2021, the sales operations team had created regional price books in Japanese Yen (JPY) and Argentine Pesos (ARS) using static exchange rates embedded directly into CRM custom fields, with zero automated sync to live banking FX rate feeds; and 2) Uncoordinated Discount Stacking: The CPQ system allowed sales reps to independently apply three separate discount mechanisms—volume bracket discounts, multi-year prepay discounts, and discretionary partner discounts—without enforcing an aggregate compound discount ceiling.",
    "The vulnerability was discovered by a sophisticated enterprise procurement consultant representing a multi-national conglomerate. The consultant noticed that while the Japanese Yen had depreciated over 35% against the US Dollar between 2021 and 2023, the vendor's JPY Price Book had never been re-indexed. Software that retailed for $100,000 USD was priced in the Japanese price book at 11,000,000 JPY. At 2023 spot rates (155 JPY/USD), 11,000,000 JPY was worth only $70,967 USD—an immediate, unearned 29% currency discount!",
    "The consultant did not stop there. Utilizing their international corporate subsidiary in Tokyo, the consultant requested an enterprise quote for 500 server licenses. The sales rep, eager to hit their end-of-quarter quota: 1) Applied a 30% volume tier discount; 2) Applied an additional 15% multi-year prepay incentive; and 3) Applied a 10% discretionary regional partner discount. Because the CPQ engine evaluated each discount sequentially rather than multiplicatively against list price, the discounts stacked to a catastrophic 55% nominal discount on top of the already-discounted Japanese Yen price book!",
    "The final math was disastrous: A multi-year enterprise software package with a canonical USD list value of $500,000 was sold for 17,325,000 JPY. When the customer wired the funds and the revenue was converted back to USD in the vendor's Silicon Valley bank account, the vendor received exactly $111,774—a catastrophic 77.6% effective discount that wiped out the vendor's gross margin and triggered immediate executive investigations.",
    "The forensic post-mortem uncovered that rogue sales reps across the enterprise had shared the 'Tokyo Currency Trick' in private Slack channels, routing quotes for American and European buyers through Japanese branch offices to artificially suppress prices and close deals rapidly before quarter-end.",
    "The remediation roadmap required rebuilding the entire commercial pricing engine: 1) Deploying automated daily FX synchronization with banking APIs (Open Exchange Rates); 2) Enforcing Compound Multiplicative Discount Stacking: P_net = P_list * (1 - d1) * (1 - d2) * (1 - d3); 3) Establishing an Absolute Minimum Net Price Floor (Hard Gross Margin Gate of 70%); and 4) Mandatory Subsidiary Entity Verification to prevent cross-border quote routing.",
    "In Part 3, we build the Currency Arbitrage Forensic Simulator & Compound Discount Gate in pure Python standard library. We reconstruct the multi-system exploit, quantify the $1.24M revenue loss, demonstrate how uncoordinated discounting compounds across stale FX tables, and deploy the automated CPQ mathematical controls that eliminate commercial arbitrage.",
    "From an executive governance and audit standpoint, the forensic investigation revealed a total breakdown in Cross-Border Opportunity Verification. Sales representatives had registered multinational enterprise accounts with local Japanese business IDs without verifying that the customer's operations, end-users, and infrastructure were genuinely located within the APAC region. This allowed domestic North American accounts to bypass standard domestic pricing entirely.",
    "To permanently eliminate this vulnerability, enterprise RevOps instituted The Ultimate Beneficial Owner (UBO) Territory Verification Gate. Whenever an Account Executive configures an enterprise quote in a regional currency or applies localized pricing discounts, the CPQ engine queries enterprise corporate identity registries (such as Dun & Bradstreet or Bureau van Dijk). The system automatically verifies that at least 60% of the customer's active software users reside within the nominated billing territory before unlocking regional pricing schedules, completely shutting down geographic price arbitrage."
]

p3_code = '''# Day 37 Part 3: Currency Arbitrage Forensic Simulator & Compound Discount Gate
import collections

class StaleFXArbitrageSimulator:
    """Forensic Analysis of Stale Currency Price Books and Runaway Discount Stacking."""
    def __init__(self):
        # 1. Real-World Currency Reality (2023 Spot Rate: 155 JPY per USD)
        self.actual_spot_rate = 155.0
        # 2. Defective Stale CRM Price Book (Frozen at 2021 Rate: 110 JPY per USD)
        self.stale_crm_fx_rate = 110.0

    def simulate_arbitrage_exploit(self, usd_canonical_list=100000.0, d1_volume=0.30, d2_prepay=0.15, d3_partner=0.10):
        """Simulates the $1.2M disaster: Stale FX + Additive Discount Stacking."""
        # Step 1: Stale Price Book lists item in JPY using 2021 rate
        jpy_stale_list_price = usd_canonical_list * self.stale_crm_fx_rate # 11,000,000 JPY

        # Step 2: Additive Discount Stacking (Flawed CPQ: 30% + 15% + 10% = 55% Off!)
        additive_discount_sum = d1_volume + d2_prepay + d3_partner # 0.55
        flawed_jpy_contract_price = jpy_stale_list_price * (1.0 - additive_discount_sum) # 4,950,000 JPY

        # Step 3: Wire Funds and Convert back to USD at ACTUAL 2023 Spot Rate (155 JPY/USD)
        realized_usd_cash = flawed_jpy_contract_price / self.actual_spot_rate

        # Financial Damage Analysis
        total_effective_discount_pct = (1.0 - (realized_usd_cash / usd_canonical_list)) * 100.0
        revenue_leakage_usd = usd_canonical_list - realized_usd_cash

        return {
            "canonical_usd_list": usd_canonical_list,
            "stale_jpy_list": jpy_stale_list_price,
            "flawed_jpy_contract": flawed_jpy_contract_price,
            "realized_usd_cash": round(realized_usd_cash, 2),
            "effective_discount_pct": round(total_effective_discount_pct, 1),
            "revenue_leakage_usd": round(revenue_leakage_usd, 2)
        }

    @staticmethod
    def calculate_guarded_compound_price(usd_list, current_spot_fx, d1, d2, d3, min_margin_floor_pct=0.65):
        """
        Automated Guardrail:
        1. Live FX sync
        2. Multiplicative Compound Discounting: (1-d1)*(1-d2)*(1-d3)
        3. Hard Gross Margin Floor
        """
        # Step 1: Multiplicative Compounding
        compound_factor = (1.0 - d1) * (1.0 - d2) * (1.0 - d3)
        effective_compound_discount = 1.0 - compound_factor

        # Step 2: Margin Floor Enforcement (Max discount allowed = 1.0 - min_margin)
        max_allowed_discount = 1.0 - min_margin_floor_pct
        if effective_compound_discount > max_allowed_discount:
            compound_factor = 1.0 - max_allowed_discount

        guarded_usd_price = usd_list * compound_factor
        guarded_local_jpy_price = guarded_usd_price * current_spot_fx

        return {
            "canonical_usd_list": usd_list,
            "guarded_usd_net": round(guarded_usd_price, 2),
            "guarded_jpy_net": round(guarded_local_jpy_price, 2),
            "effective_discount_pct": round((1.0 - compound_factor) * 100.0, 1)
        }

sim = StaleFXArbitrageSimulator()

print("=" * 68)
print("THE $1.2M CURRENCY ARBITRAGE & OVER-DISCOUNTING FORENSIC AUDIT")
print("=" * 68)

# 1. Forensic Exploit Simulation ($500k Enterprise Deal)
exploit = sim.simulate_arbitrage_exploit(usd_canonical_list=500000.0)
print("Scenario 1: Rogue Deal Dispatched via Stale Tokyo Price Book:")
print(f"  Canonical USD List Value:  ${exploit['canonical_usd_list']:,.2f}")
print(f"  Stale JPY List in CRM:     {exploit['stale_jpy_list']:,.2f} JPY (Frozen at 110 JPY/USD)")
print(f"  Additive Discount Stacking: 30% + 15% + 10% = 55% Off List")
print(f"  Customer Paid (JPY):       {exploit['flawed_jpy_contract']:,.2f} JPY")
print(f"  Realized USD at Spot:      ${exploit['realized_usd_cash']:,.2f} (AT 155 JPY/USD)")
print(f"  ACTUAL EFFECTIVE DISCOUNT: {exploit['effective_discount_pct']}% OFF LIST!")
print(f"  Direct Capital Destroyed:  ${exploit['revenue_leakage_usd']:,.2f} on a single deal!")
print("-" * 68)

# 2. Automated CPQ Guardrails (Live FX + Multiplicative Compounding + Margin Floor)
guarded = sim.calculate_guarded_compound_price(usd_list=500000.0, current_spot_fx=155.0, d1=0.30, d2=0.15, d3=0.10)
print("Scenario 2: Automated CPQ Guardrail (Live FX + Compounding + Floor):")
print(f"  Guarded Net USD Revenue:   ${guarded['guarded_usd_net']:,.2f}")
print(f"  Guarded JPY Contract:      {guarded['guarded_jpy_net']:,.2f} JPY")
print(f"  Controlled Discount Rate:  {guarded['effective_discount_pct']}% (Capped at 35% Max Margin Floor)")
print(f"  Protected Margin Recovery: ${guarded['guarded_usd_net'] - exploit['realized_usd_cash']:,.2f}")
print("=" * 68)
'''

p3_mcq = {
    "question": "What is the primary mathematical flaw of 'Additive Discount Stacking' (e.g., 30% + 15% + 10% = 55% discount) in CPQ engines, and how do modern engines resolve it?",
    "options": [
        "Additive stacking subtracts discounts linearly, rapidly eroding margins; modern CPQ engines enforce multiplicative compounding P = List * (1-d1) * (1-d2) * (1-d3) combined with hard gross margin floors.",
        "Additive stacking is too slow for computer processors to calculate in real time.",
        "Additive stacking forces the customer to pay their invoice using paper gold certificates.",
        "Modern CPQ engines resolve additive stacking by firing all sales representatives who request discounts."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Additive discount stacking leads to severe underpricing; multiplicative compounding reflects true sequential discounting and prevents accidental catastrophic margin destruction."
}

# -------------------------------------------------------------
# Part 4: Discount Matrix Governance & Delegation of Authority (DoA) Thresholds
# -------------------------------------------------------------
p4_say = [
    "Having established how CPQ pricing engines calculate bracket volumes, normalize international currencies, and prevent additive discount compounding, we examine the operational governance framework that controls commercial pricing approvals: Delegation of Authority (DoA) Matrices and Automated Deal Desk Routing.",
    "In competitive enterprise B2B sales cycles, discounting is an inevitable reality of commercial negotiation. Enterprise procurement teams are professionally measured and compensated on their ability to extract price concessions from vendors. If a sales organization enforces a rigid 'zero discount' policy, deal cycles stall, win rates collapse, and competitors win key strategic accounts. Conversely, if sales representatives are granted unrestricted discounting authority, average contract values plummet, sales reps concede pricing prematurely without trading for commercial value, and corporate gross margins evaporate.",
    "To resolve this commercial tension, revenue operations architects implement A Multi-Tier Delegation of Authority (DoA) Matrix. A DoA matrix defines explicit, non-bypassable discount thresholds tied to managerial hierarchy: 1) Tier 1: Account Executive Discretionary Band (0% to 15% discount): Sales reps can apply discounts within this band without requiring managerial sign-off, enabling rapid transaction velocity for standard deals; 2) Tier 2: Regional Sales Director Approval (15.1% to 25% discount): Requires written digital approval from the first-line sales manager, justifying the concession based on competitive pressure or transaction volume;",
    "3) Tier 3: Vice President of Sales Approval (25.1% to 35% discount): Requires executive sales leadership approval, contingent upon customer concessions such as multi-year contract commitments, executive sponsorship, or public case study rights; and 4) Tier 4: Chief Financial Officer (CFO) and Chief Executive Officer (CEO) Approval (>35% discount or below gross margin floor): Mandatory C-suite authorization required for non-standard, transformative enterprise transactions that impact quarterly board forecasts.",
    "Furthermore, modern CPQ approval engines evaluate Multi-Dimensional Concession Matrices rather than relying purely on top-line discount percentages. An Account Executive requesting a 30% discount can be conditionally approved by the system if the customer agrees to compensatory commercial concessions: 1) Extended Contract Duration: Agreeing to a 3-year or 5-year non-cancelable commitment; 2) Favorable Payment Terms: Shifting from Net 60 quarterly billing to annual upfront prepayment in full; 3) Standardized Legal Terms: Waiving custom indemnification redlines and accepting the vendor's standard click-through terms of service; or 4) Marketing Reciprocity: Committing to deliver a joint press release and participate in an annual user conference keynote.",
    "A foundational architectural invariant enforced by the CPQ approval engine is The Non-Bypassable Sequential Sign-Off Invariant: If a quote requires Tier 3 approval, the approval request must traverse through Tier 1 and Tier 2 sequentially (or execute parallel executive sign-offs) before a legally binding proposal document can be generated or electronically signed. Any attempt to export an unapproved quote generates a watermarked 'DRAFT - NOT FOR EXECUTION' document with cryptographic warning headers.",
    "In Part 4, we build the Pure Python Delegation of Authority (DoA) Matrix & Multi-Tier Approval Engine. We model hierarchical approval bands, evaluate multi-dimensional concession scoring, and execute automated quote escalation state machines.",
    "To maintain high transaction velocity during high-volume commercial periods (such as quarter-end closing weeks), modern CPQ approval engines implement Automated Parallel Approval Matrix DAGs. Rather than forcing quotes to crawl through sequential approval queues—where a deal sits idle in a regional director's inbox while the CFO waits to review—the system dispatches simultaneous notification webhooks to all required approvers. The quote state machine aggregates individual sign-offs, updating the master proposal status the instant all requisite organizational nodes have certified their approval.",
    "Furthermore, the approval engine enforces Strict Audit Logging for Exception Overrides. If an executive approver exercises emergency authority to approve an out-of-band discount that breaches gross margin minimums, the system requires the executive to input a detailed commercial justification (minimum 50 characters) and records an immutable cryptographic audit record. These override records are automatically compiled into quarterly compliance reports delivered directly to the Board of Directors' Audit Committee."
]

p4_code = '''# Day 37 Part 4: Delegation of Authority (DoA) Matrix & Approval Engine
import collections
from datetime import datetime

class ApprovalTier:
    def __init__(self, tier_level, role_name, max_discount_pct, required_approver):
        self.level = int(tier_level)
        self.role = role_name
        self.max_discount = float(max_discount_pct) # e.g. 15.0 for 15%
        self.approver = required_approver

class CPQApprovalEngine:
    """Evaluates requested quote discounts against the corporate DoA matrix."""
    def __init__(self):
        # List of ApprovalTier sorted by level
        self.tiers = []
        self.approval_records = []

    def register_tier(self, tier: ApprovalTier):
        self.tiers.append(tier)
        self.tiers.sort(key=lambda t: t.level)

    def evaluate_quote_approvals(self, quote_id, total_list_usd, requested_net_usd, customer_concessions=None):
        """Determines required approval levels and evaluates concession offsets."""
        if customer_concessions is None:
            customer_concessions = []

        total_discount_usd = total_list_usd - requested_net_usd
        discount_pct = (total_discount_usd / total_list_usd) * 100.0 if total_list_usd > 0 else 0.0

        # Concession Credit: Favorable terms can offset discount severity
        # e.g., 3-Year commit grants 5% DoA relief; Upfront annual payment grants 3% relief
        concession_relief_pct = 0.0
        if "THREE_YEAR_COMMITMENT" in customer_concessions:
            concession_relief_pct += 5.0
        if "ANNUAL_UPFRONT_PREPAY" in customer_concessions:
            concession_relief_pct += 3.0
        if "EXECUTIVE_CASE_STUDY" in customer_concessions:
            concession_relief_pct += 2.0

        effective_approval_discount = max(0.0, discount_pct - concession_relief_pct)

        # Determine required approval tier
        required_tier = None
        for t in self.tiers:
            if effective_approval_discount <= t.max_discount:
                required_tier = t
                break

        if not required_tier:
            required_tier = self.tiers[-1] # Highest tier (CFO/CEO)

        auto_approved = (required_tier.level == 1)
        status = "AUTO_APPROVED" if auto_approved else f"PENDING_{required_tier.role.upper()}_APPROVAL"

        record = {
            "quote_id": quote_id,
            "nominal_discount_pct": round(discount_pct, 1),
            "concession_relief_pct": round(concession_relief_pct, 1),
            "effective_doa_discount_pct": round(effective_approval_discount, 1),
            "required_approval_level": required_tier.level,
            "required_role": required_tier.role,
            "assigned_approver": required_tier.approver,
            "status": status,
            "evaluated_at": datetime.utcnow().isoformat()
        }
        self.approval_records.append(record)
        return record

# Setup DoA Matrix
doa_engine = CPQApprovalEngine()
doa_engine.register_tier(ApprovalTier(1, "Account Executive (Self-Approve)", 15.0, "Rep Discretion"))
doa_engine.register_tier(ApprovalTier(2, "Regional Sales Director", 25.0, "Director Sarah Jenkins"))
doa_engine.register_tier(ApprovalTier(3, "Vice President of Sales", 35.0, "VP Marcus Vance"))
doa_engine.register_tier(ApprovalTier(4, "Chief Financial Officer (CFO)", 100.0, "CFO Elena Rostova"))

print("=" * 68)
print("DELEGATION OF AUTHORITY (DoA) APPROVAL WORKFLOW AUDIT")
print("=" * 68)

# Quote 1: 12% Discount (Self-Approved)
q1 = doa_engine.evaluate_quote_approvals("Q-101", 100000.0, 88000.0)
print(f"Quote {q1['quote_id']}: {q1['nominal_discount_pct']}% Discount")
print(f"  --> Required Tier: Level {q1['required_approval_level']} [{q1['required_role']}]")
print(f"  --> Status:        {q1['status']}")
print("-" * 68)

# Quote 2: 28% Discount without concessions -> Escalates to VP of Sales
q2_raw = doa_engine.evaluate_quote_approvals("Q-102", 100000.0, 72000.0)
print(f"Quote {q2_raw['quote_id']} (No Concessions): {q2_raw['nominal_discount_pct']}% Discount")
print(f"  --> Required Tier: Level {q2_raw['required_approval_level']} [{q2_raw['required_role']}]")
print(f"  --> Assigned Approver: {q2_raw['assigned_approver']}")
print(f"  --> Status:        {q2_raw['status']}")
print("-" * 68)

# Quote 3: Exact same 28% Discount WITH Concessions (3-Yr Commit + Upfront Prepay = 8% Relief)
# Effective DoA Discount = 20% -> Downgrades approval from VP to Sales Director!
q3_concessions = ["THREE_YEAR_COMMITMENT", "ANNUAL_UPFRONT_PREPAY"]
q3_guarded = doa_engine.evaluate_quote_approvals("Q-103", 100000.0, 72000.0, customer_concessions=q3_concessions)
print(f"Quote {q3_guarded['quote_id']} (With Concessions Trade): Nominal {q3_guarded['nominal_discount_pct']}% Discount")
print(f"  --> Concession Relief Earned: -{q3_guarded['concession_relief_pct']}% (3-Yr Commit + Prepay)")
print(f"  --> Effective DoA Discount:  {q3_guarded['effective_doa_discount_pct']}%")
print(f"  --> Downgraded Approval:     Level {q3_guarded['required_approval_level']} [{q3_guarded['required_role']}] (Director Approval)")
print("=" * 68)
'''

p4_mcq = {
    "question": "In enterprise CPQ Deal Desk operations, how does a Multi-Dimensional Concession Matrix optimize both deal velocity and gross margin protection?",
    "options": [
        "It grants discount approval relief to sales reps when customers trade valuable commercial concessions (such as 3-year commitments or upfront annual prepayments), lowering approval escalation tiers while securing higher long-term customer lifetime value.",
        "It automatically reduces all software prices by fifty percent on Friday afternoons.",
        "It prevents customers from speaking directly with sales managers.",
        "It requires all sales contracts to be notarized by international ambassadors."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Concession matrices allow revenue teams to trade price for commercial value (multi-year lock-in, upfront cash, or case study rights), accelerating deal velocity while protecting margin."
}

# -------------------------------------------------------------
# Part 5: Building the Production Enterprise Dynamic Pricing & Currency Engine
# -------------------------------------------------------------
p5_say = [
    "In the concluding section of Day 37, we synthesize the four foundational pillars of modern B2B software monetization—slab volume rating, multi-currency normalization with actuarial FX buffers, compound discount stacking prevention, and delegation of authority approval matrices—into an integrated, production-grade Dynamic Pricing Platform in pure Python standard library. In global software corporations, this platform operates as the central mathematical engine determining every quote line item, customer invoice, and revenue forecast.",
    "Our production platform operationalizes Four Core Enterprise Pillars: 1) Slab-Graduated Bracket Evaluation: Decomposing volume quantities into monotonic marginal brackets with zero cliff arbitrage; 2) Multi-Currency FX Engine: Normalizing catalog USD prices into regional currencies with embedded actuarial risk buffers and territorial PPP controls; 3) Compound Discount Guardrails: Multiplicative discount compounding with hard gross margin floors, permanently eliminating runaway margin leakage; and 4) Cryptographic Pricing Verification Token: Sealing the entire pricing manifest—encompassing resolved brackets, FX rates, applied discounts, and DoA approval statuses—with an SHA-256 cryptographic signature, satisfying statutory external auditors.",
    "The engine also enforces Continuous Foreign Exchange Rate Drift Monitoring. If a currency pair moves by more than 5% during an active sales negotiation, the CPQ daemon automatically flags the draft quote, notifying the sales rep of the updated exchange rate and giving the option to lock the rate with an authorized finance hedge or update the local currency quote.",
    "Furthermore, the platform incorporates Automated Executive Deal Summaries. In addition to raw line item prices, the engine computes key commercial metrics for executive leadership: Blended Effective Discount Rate, First-Year Cash Collection, Contract Total Value (TCV), and Projected Gross Margin. By translating complex pricing formulas into actionable business metrics, the system equips sales leaders to make data-driven commercial decisions during high-stakes quarter-end negotiations.",
    "By mastering the computational engineering of dynamic pricing and currency normalization, revenue operations professionals protect corporate margins, eliminate commercial arbitrage, and build predictable, scalable global revenue engines.",
    "In Part 5, we execute this comprehensive Dynamic Pricing & Currency Engine in pure Python standard library. We simulate a complex multi-currency enterprise quote, evaluate slab pricing brackets, apply multiplicative discounts, enforce DoA approvals, and compile the official cryptographically verified CPQ Pricing Certificate.",
    "From a Chief Financial Officer (CFO) and Chief Revenue Officer (CRO) perspective, the deployment of a mathematically rigorous dynamic pricing and currency engine transforms enterprise revenue predictability. In organizations relying on manual spreadsheets and ad-hoc discounting, revenue forecasting is plagued by uncertainty: currency fluctuations distort quarterly numbers, rogue discounts compress operating cash flows, and billing disputes delay cash collection.",
    "By contrast, an enterprise operating on a unified, automated CPQ pricing platform commands absolute commercial control: pricing calculations are 100% deterministic, international currency risks are systematically hedged, and every discount dollar granted is balanced by strategic commercial concessions that maximize customer lifetime value (LTV). Frontline sales representatives negotiate with confidence, backed by real-time guidance and clear delegation boundaries.",
    "Finally, the platform establishes Continuous Closed-Loop Price Elasticity Telemetry. By feeding historical quote win/loss data, requested discount depths, and customer firmographic attributes into statistical pricing models, the enterprise continuously sharpens its catalog list prices and volume tier thresholds, systematically finding the optimal equilibrium between sales velocity, market share expansion, and enterprise profit maximization.",
    "Furthermore, modern enterprise CPQ architectures incorporate Real-Time Margin Waterfall Visualizations directly into the sales representative's quoting console. As line items, slab volumes, and currency adjustments are modified, the system renders an interactive waterfall chart decomposing list price into baseline volume discounts, promotional partner credits, FX hedging adjustments, and net recognized revenue. This visual transparency demystifies corporate pricing policies, helping sales reps understand exactly how commercial deal terms impact organizational profitability and commission payout tiers.",
    "Additionally, enterprise pricing engines archive complete historical price books in cold cloud storage to support multi-year financial audits and legal dispute resolutions, guaranteeing complete historical traceability for every contract issued."
]

p5_code = '''# Day 37 Part 5: Production Enterprise Dynamic Pricing & Currency Engine Suite
import collections
import hashlib
import json
import time
from datetime import datetime

class ProductionEnterprisePricingSuite:
    """Production Enterprise Pricing, Currency Normalization, and DoA Engine."""
    def __init__(self, enterprise_name="Apex Global Technologies"):
        self.enterprise = enterprise_name
        self.slab_brackets = [
            {"lower": 1, "upper": 100, "price": 120.0},
            {"lower": 101, "upper": 500, "price": 95.0},
            {"lower": 501, "upper": 1000, "price": 75.0},
            {"lower": 1001, "upper": None, "price": 55.0}
        ]
        self.fx_rates = {
            "USD": {"spot": 1.0, "buffer": 0.0},
            "EUR": {"spot": 0.92, "buffer": 0.03},
            "GBP": {"spot": 0.79, "buffer": 0.03},
            "JPY": {"spot": 152.0, "buffer": 0.06}
        }
        
    def calculate_slab_subtotal(self, quantity):
        """Calculate un-discounted USD base subtotal using slab brackets."""
        remaining = quantity
        total = 0.0
        for b in self.slab_brackets:
            if remaining <= 0:
                break
            cap = (b["upper"] - b["lower"] + 1) if b["upper"] is not None else remaining
            qty_in_b = min(remaining, cap)
            total += qty_in_b * b["price"]
            remaining -= qty_in_b
        return total

    def execute_complete_pricing_pipeline(self, quote_id, quantity, currency_code, requested_discounts, concessions=None):
        """End-to-End: Slab -> Multiplicative Discounts -> FX Hedging -> DoA Approval."""
        if concessions is None:
            concessions = []

        # 1. Base USD Slab Subtotal
        usd_slab_list = self.calculate_slab_subtotal(quantity)

        # 2. Multiplicative Compound Discounting
        # d_effective = 1 - (1 - d1) * (1 - d2) ...
        compound_mult = 1.0
        for d in requested_discounts:
            compound_mult *= (1.0 - d)
        
        # Hard Gross Margin Floor (Maximum total discount = 40%)
        effective_discount = 1.0 - compound_mult
        margin_floor_capped = False
        if effective_discount > 0.40:
            compound_mult = 0.60 # Capped at 40% max discount
            effective_discount = 0.40
            margin_floor_capped = True

        net_usd_price = usd_slab_list * compound_mult

        # 3. Currency Conversion with Hedging Buffer
        fx_info = self.fx_rates.get(currency_code, self.fx_rates["USD"])
        hedged_fx = fx_info["spot"] * (1.0 + fx_info["buffer"])
        local_currency_net = net_usd_price * hedged_fx

        # 4. DoA Approval Evaluation
        concession_relief = 0.0
        if "THREE_YEAR_COMMITMENT" in concessions:
            concession_relief += 0.05
        if "ANNUAL_UPFRONT_PREPAY" in concessions:
            concession_relief += 0.03

        doa_discount_eval = max(0.0, effective_discount - concession_relief)
        if doa_discount_eval <= 0.15:
            approval_status = "AUTO_APPROVED_AE_DISCRETION"
            approver = "Account Executive"
        elif doa_discount_eval <= 0.25:
            approval_status = "PENDING_SALES_DIRECTOR_APPROVAL"
            approver = "Regional Sales Director"
        elif doa_discount_eval <= 0.35:
            approval_status = "PENDING_VP_SALES_APPROVAL"
            approver = "VP of Global Sales"
        else:
            approval_status = "PENDING_CFO_EXECUTIVE_APPROVAL"
            approver = "Chief Financial Officer"

        pricing_manifest = {
            "quote_id": quote_id,
            "enterprise": self.enterprise,
            "quantity_seats": quantity,
            "currency": currency_code,
            "usd_list_slab_subtotal": round(usd_slab_list, 2),
            "effective_discount_pct": round(effective_discount * 100.0, 1),
            "margin_floor_enforced": margin_floor_capped,
            "net_usd_price": round(net_usd_price, 2),
            "hedged_fx_rate": round(hedged_fx, 4),
            "local_currency_quote_price": round(local_currency_net, 2),
            "approval_status": approval_status,
            "assigned_approver": approver,
            "generated_at": datetime.utcnow().isoformat()
        }

        # Cryptographic Sealing
        token = hashlib.sha256(json.dumps(pricing_manifest, sort_keys=True).encode("utf-8")).hexdigest()
        pricing_manifest["sha256_pricing_token"] = token
        return pricing_manifest

# Execute Pipeline Simulation
suite = ProductionEnterprisePricingSuite()

# Quote A: 750 seats, Eurozone, 20% Volume + 10% Partner discount, 3-Yr Commit concession
quote_eur = suite.execute_complete_pricing_pipeline(
    quote_id="Q-EUR-7001",
    quantity=750,
    currency_code="EUR",
    requested_discounts=[0.20, 0.10], # Compound: 1 - 0.80*0.90 = 28%
    concessions=["THREE_YEAR_COMMITMENT"]
)

# Quote B: 2,500 seats, Japan, 35% Volume + 15% Prepay discount (Triggers Margin Floor Cap!)
quote_jpy = suite.execute_complete_pricing_pipeline(
    quote_id="Q-JPY-9002",
    quantity=2500,
    currency_code="JPY",
    requested_discounts=[0.35, 0.15], # Compound: 1 - 0.65*0.85 = 44.75% -> Capped at 40%!
    concessions=["ANNUAL_UPFRONT_PREPAY"]
)

print("=" * 68)
print("PRODUCTION DYNAMIC PRICING & MULTI-CURRENCY PLATFORM AUDIT")
print("=" * 68)
print(f"Quote Ref: {quote_eur['quote_id']} ({quote_eur['quantity_seats']} Seats | {quote_eur['currency']})")
print(f"  USD Slab List:          ${quote_eur['usd_list_slab_subtotal']:,.2f}")
print(f"  Effective Discount:     {quote_eur['effective_discount_pct']}% (Compounded Multiplicative)")
print(f"  Net USD Amount:         ${quote_eur['net_usd_price']:,.2f}")
print(f"  Hedged FX Rate (EUR):   {quote_eur['hedged_fx_rate']}")
print(f"  Final Local Quote:      {quote_eur['local_currency_quote_price']:,.2f} EUR")
print(f"  Approval Workflow:      {quote_eur['approval_status']} [{quote_eur['assigned_approver']}]")
print(f"  SHA-256 Pricing Token:  {quote_eur['sha256_pricing_token']}")
print("-" * 68)
print(f"Quote Ref: {quote_jpy['quote_id']} ({quote_jpy['quantity_seats']} Seats | {quote_jpy['currency']})")
print(f"  USD Slab List:          ${quote_jpy['usd_list_slab_subtotal']:,.2f}")
print(f"  Margin Floor Enforced:  {quote_jpy['margin_floor_enforced']} (Discount Capped at 40% Max Floor)")
print(f"  Final Local Quote:      {quote_jpy['local_currency_quote_price']:,.2f} JPY")
print(f"  Approval Workflow:      {quote_jpy['approval_status']} [{quote_jpy['assigned_approver']}]")
print(f"  SHA-256 Pricing Token:  {quote_jpy['sha256_pricing_token']}")
print("=" * 68)
'''

p5_mcq = {
    "question": "What is the primary operational purpose of integrating automated Gross Margin Floors into enterprise CPQ pricing pipelines?",
    "options": [
        "To establish non-negotiable pricing ceilings that prevent stacked discounts from eroding contract profitability below corporate gross margin requirements, safeguarding financial sustainability.",
        "To automatically cancel customer orders if the stock market declines by five points.",
        "To force sales representatives to submit handwritten accounting ledgers.",
        "To convert all international sales quotes into cryptocurrency tokens."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Gross margin floors ensure that regardless of how many discounts or incentives are stacked, the net contract price cannot drop below corporate profitability thresholds."
}

DAY_DATA = {
    "day": 37,
    "month": 2,
    "coursePrefix": "bcom_scrm",
    "title": "Dynamic Pricing Engines: Tiered, Slab, Usage-Based & Currency Normalization",
    "goal": "Master enterprise dynamic pricing architecture: tiered vs slab (graduated) pricing algorithms, multi-currency normalization with actuarial FX buffers, compound discount stacking prevention, and DoA approval matrices.",
    "minutes": 40,
    "recap": "Day 37 explores enterprise dynamic pricing: dissecting the $1.2M Currency Arbitrage disaster, contrasting cliff vs slab rating, hedging multi-year currency contracts, and enforcing Delegation of Authority (DoA) matrices.",
    "parts": [
        {
            "part": 1,
            "title": "Pricing Models Architecture: Flat, Tiered, Slab & Usage-Based Consumption",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "part": 2,
            "title": "Multi-Currency Normalization, FX Hedging & Purchasing Power Parity (PPP)",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "part": 3,
            "title": "The $1.2M Currency Arbitrage & Runaway Over-Discounting Incident",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "part": 4,
            "title": "Discount Matrix Governance & Delegation of Authority (DoA) Thresholds",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "part": 5,
            "title": "Building the Production Enterprise Dynamic Pricing & Currency Engine",
            "say": p5_say,
            "code": p5_code,
            "mcq": p5_mcq
        }
    ],
    "summary": [
        "Slab (graduated) pricing guarantees monotonic marginal revenue, completely eliminating cliff volume arbitrage.",
        "Multi-currency normalization applies actuarial FX buffers (+3% to +6%) to protect against multi-year currency volatility.",
        "The $1.2M Currency Arbitrage failure demonstrates the catastrophe of stale price books and additive discount stacking.",
        "Multiplicative compound discounting combined with hard gross margin floors protects enterprise profitability.",
        "Delegation of Authority (DoA) matrices automate approval routing while rewarding customer commercial concessions."
    ],
    "projectStep": {
        "title": "Enterprise Dynamic Pricing & Currency Normalization Engine",
        "steps": [
            "Construct the slab-graduated pricing engine with monotonic interval range evaluation.",
            "Implement multi-currency normalization with actuarial hedging buffers and PPP multipliers.",
            "Deploy multiplicative compound discount algorithms with non-negotiable gross margin floors.",
            "Build the Delegation of Authority approval escalation state machine with concession credits."
        ]
    }
}

if __name__ == "__main__":
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path.cwd()))
    from scripts.bcom_ana_utils import count_words, execute_code
    print(f"Validating Day {DAY_DATA['day']}: {DAY_DATA['title']}...")
    part_words = [count_words(p["say"]) for p in DAY_DATA["parts"]]
    print(f"Part word counts: {part_words} (Total: {sum(part_words)})")
    assert all(w >= 600 for w in part_words), f"Some parts under 600 words: {part_words}"
    for i, p in enumerate(DAY_DATA["parts"]):
        print(f"Testing Part {i+1} code...")
        out = execute_code(p["code"])
        print(f"  Part {i+1} code executed cleanly ({len(out)} chars output)")
    print("Day 37 validation successful!")
