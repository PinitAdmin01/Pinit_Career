"""
Day 21 Builder: International E-Commerce & Cross-Border Expansion: Localization, Multi-Currency Pricing & Harmonized System (HS) Codes
Course: B.Com E-Commerce & Digital Business (bcom_ecom)
Task: TASK-816
"""

import os
from visual_builder import count_words
from ecommerce_budget_ensurer import ensure_ecom_day_budget

def build_day21():
    parts = []

    # Part 1: Cross-Border Market Opportunity, Geo-Targeting, Geofencing & Dynamic IP Localization
    p1_say = [
        "Welcome to Day 21 of B.Com E-Commerce and Digital Business. Today, we inaugurate Milestone 4 by expanding our commercial scope beyond domestic boundaries into the complex, high-margin domain of International E-Commerce and Cross-Border Expansion. While domestic digital commerce allows merchants to operate under a unified currency, homogeneous tax code, and single-carrier logistics network, cross-border commerce forces enterprises to solve multi-jurisdictional fragmentation. An e-commerce brand that scales globally captures vast addressable consumer markets across Europe, Asia-Pacific, Latin America, and North America, diversifying its revenue streams away from single-nation macroeconomic downturns.",
        
        "The technological gateway to international commerce begins with Dynamic IP Geolocation, Edge-Based DNS Routing, and Geofencing. When an international consumer navigates to your digital storefront, edge servers (via Cloudflare, Fastly, or AWS CloudFront) instantly resolve the visitor's Internet Protocol (IP) address against geo-location databases (such as MaxMind GeoIP2). Within fifteen milliseconds, the edge gateway determines the shopper's country, geographic subdivision, local language preference, and sovereign jurisdiction. The system dynamically presents the shopper with an intuitive country-selector modal or automatically routes them to a dedicated localized top-level domain (e.g., routing a German buyer from `.com` to `.de`, or presenting `/en-gb` to a British shopper).",
        
        "However, international geo-routing is far more than visual language translation; it governs strict Regulatory Geofencing and Catalog Availability. Due to bilateral trade treaties, intellectual property licensing restrictions, electrical voltage standards (110V vs 230V), and national regulatory prohibitions (such as the European Union's REACH chemical compliance or FDA cosmetics directives), certain SKUs cannot legally cross sovereign borders. Advanced cross-border catalog engines dynamically sanitize the visible product catalog based on the resolved IP jurisdiction, automatically suppressing non-compliant products before an overseas customer can add them to their shopping cart.",
        
        "In our institutional Python model for Part 1, we simulate an edge-level IP geolocation, sovereign domain routing, and catalog compliance gateway. The engine processes incoming consumer IP packets, maps them against sovereign regulatory rule sets, sets localized currency flags, and enforces catalog compliance filtering. Review the deterministic code below to master edge-level cross-border localization."
    ]

    p1_code = '''def simulate_ip_geolocation_and_catalog_routing(
    incoming_visitor_ips: list[dict],
    sovereign_geo_registry: dict
) -> dict:
    """
    Edge-level IP Geolocation and Cross-Border Catalog Routing Gateway.
    Resolves visitor IPs, routes to localized storefronts, and filters restricted SKUs.
    """
    routing_results = []
    jurisdiction_counts = {}
    catalog_suppression_events = 0
    
    for visitor in incoming_visitor_ips:
        ip = visitor['ip_address']
        requested_sku = visitor['target_sku']
        
        # Resolve geo mapping
        geo_info = sovereign_geo_registry.get(ip, {
            'country_code': 'US', 'country_name': 'United States',
            'currency': 'USD', 'domain_route': 'store.com',
            'restricted_categories': []
        })
        
        country = geo_info['country_code']
        jurisdiction_counts[country] = jurisdiction_counts.get(country, 0) + 1
        
        # Check SKU category restrictions (e.g. lithium batteries, unapproved botanicals)
        sku_category = visitor.get('sku_category', 'general_apparel')
        is_restricted = sku_category in geo_info['restricted_categories']
        
        if is_restricted:
            catalog_suppression_events += 1
            action = 'SUPPRESS_SKU_REDIRECT_SAFE_COLLECTION'
        else:
            action = 'RENDER_LOCALIZED_PDP'
            
        routing_results.append({
            'visitor_id': visitor['visitor_id'],
            'ip': ip,
            'country': country,
            'assigned_currency': geo_info['currency'],
            'routed_storefront': geo_info['domain_route'],
            'target_sku': requested_sku,
            'catalog_action': action,
            'compliant': not is_restricted
        })
        
    return {
        'total_international_visitors_routed': len(incoming_visitor_ips),
        'jurisdiction_distribution': jurisdiction_counts,
        'catalog_suppression_count': catalog_suppression_events,
        'sample_routings': routing_results[:3]
    }

geo_registry = {
    '84.115.220.45': {
        'country_code': 'DE', 'country_name': 'Germany',
        'currency': 'EUR', 'domain_route': 'store.de',
        'restricted_categories': ['unapproved_supplements', 'non_ce_electronics']
    },
    '185.86.151.11': {
        'country_code': 'GB', 'country_name': 'United Kingdom',
        'currency': 'GBP', 'domain_route': 'store.co.uk',
        'restricted_categories': ['flammable_aerosols']
    },
    '103.25.144.12': {
        'country_code': 'AU', 'country_name': 'Australia',
        'currency': 'AUD', 'domain_route': 'store.com.au',
        'restricted_categories': ['raw_wood_crafts', 'organic_seeds']
    }
}

mock_visitors = [
    {'visitor_id': 'VIS-001', 'ip_address': '84.115.220.45', 'target_sku': 'SKU-HOODIE-BLK', 'sku_category': 'general_apparel'},
    {'visitor_id': 'VIS-002', 'ip_address': '84.115.220.45', 'target_sku': 'SKU-NOOTROPIC-PRO', 'sku_category': 'unapproved_supplements'}, # Restricted in DE!
    {'visitor_id': 'VIS-003', 'ip_address': '185.86.151.11', 'target_sku': 'SKU-BOOTS-BRN', 'sku_category': 'general_apparel'},
    {'visitor_id': 'VIS-004', 'ip_address': '103.25.144.12', 'target_sku': 'SKU-BAMBOO-DESK', 'sku_category': 'raw_wood_crafts'} # Biosecurity restriction in AU!
]

edge_audit = simulate_ip_geolocation_and_catalog_routing(mock_visitors, geo_registry)

print("=== EDGE IP GEOLOCATION & CROSS-BORDER CATALOG ROUTING AUDIT ===")
print(f"Total Visitors Processed:       {edge_audit['total_international_visitors_routed']}")
print(f"Jurisdictions Resolved:         {edge_audit['jurisdiction_distribution']}")
print(f"Restricted SKU Suppressions:    {edge_audit['catalog_suppression_count']} (Protected import compliance)")
print()
print("Sample Visitor Localization Routing:")
for r in edge_audit['sample_routings']:
    print(f"  [{r['visitor_id']}] IP: {r['ip']} -> Country: {r['country']} | Currency: {r['assigned_currency']} | Route: {r['routed_storefront']} | Action: [{r['catalog_action']}]")'''

    p1_output = """=== EDGE IP GEOLOCATION & CROSS-BORDER CATALOG ROUTING AUDIT ===
Total Visitors Processed:       4
Jurisdictions Resolved:         {'DE': 2, 'GB': 1, 'AU': 1}
Restricted SKU Suppressions:    2 (Protected import compliance)

Sample Visitor Localization Routing:
  [VIS-001] IP: 84.115.220.45 -> Country: DE | Currency: EUR | Route: store.de | Action: [RENDER_LOCALIZED_PDP]
  [VIS-002] IP: 84.115.220.45 -> Country: DE | Currency: EUR | Route: store.de | Action: [SUPPRESS_SKU_REDIRECT_SAFE_COLLECTION]
  [VIS-003] IP: 185.86.151.11 -> Country: GB | Currency: GBP | Route: store.co.uk | Action: [RENDER_LOCALIZED_PDP]"""

    p1_notes = [
        "Edge IP resolution routed international traffic seamlessly to designated sovereign storefronts (store.de, store.co.uk).",
        "Enforcing regulatory geofencing suppressed 2 non-compliant SKU sessions (unapproved supplements in DE and raw wood in AU).",
        "Automated catalog filtering shields the enterprise from biosecurity seizures, customs fines, and shipping return costs."
    ]

    p1_check = {
        "question": "Why is edge-level catalog filtering based on visitor IP address critical in international cross-border e-commerce?",
        "options": [
            "It prevents overseas shoppers from purchasing products that violate destination country biosecurity, electrical, or chemical import laws before checkout",
            "It secretly charges overseas customers double the price without their consent",
            "It eliminates the need to pay international air freight carriers",
            "It prevents foreign governments from inspecting cargo manifests"
        ],
        "answer": 0,
        "why": "Filtering catalogs at the edge prevents consumers from ordering items prohibited by local regulatory bodies (such as Australian biosecurity or EU cosmetics directives), preventing customs seizures and chargebacks."
    }

    parts.append({
        "title": "Cross-Border Market Opportunity, Geo-Targeting, Geofencing & Dynamic IP Localization",
        "say": p1_say,
        "example": "ASOS serves shoppers in over 200 countries by implementing localized sovereign storefronts. When a French shopper arrives, ASOS automatically routes them to asos.fr, converts prices to Euros, presents French sizing standards, and filters out aerosol beauty products that cannot be shipped via air freight.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_notes,
        "tryIt": "Add a Japanese IP ('133.242.18.1') into the registry with JPY currency and observe how the edge router sets store.jp and filters unapproved cosmetics.",
        "check": p1_check
    })

    # Part 2: Multi-Currency Pricing Engines, Dynamic FX Hedging, FX Volatility Buffers & Payment Gateway Surcharges
    p2_say = [
        "Presenting prices in an international shopper's native currency is one of the most powerful conversion drivers in global commerce. Industry benchmarks indicate that forcing an overseas consumer to calculate currency conversions manually in their head depresses checkout conversion rates by up to thirty-five percent. However, offering Multi-Currency Pricing introduces substantial corporate balance sheet exposure to Foreign Exchange (FX) volatility and cross-border payment merchant discount rates (MDR).",
        
        "To establish a robust multi-currency pricing engine, financial engineers incorporate three core pricing layers: First, Dynamic Spot FX Ingestion—the system connects via financial APIs to real-time central bank or interbank currency exchange feeds, updating baseline exchange rates on an automated schedule; Second, FX Volatility Buffers—because foreign exchange markets fluctuate continuously throughout the day while e-commerce catalog prices cannot jitter every ten seconds without alienating customers, brands add an institutional FX volatility buffer (typically 1.5% to 2.5%) onto the base exchange rate to hedge against currency depreciation between order placement and treasury settlement; and Third, Cross-Border Gateway Interchange Surcharges—international payment acquiring networks (e.g., Visa, Mastercard, Stripe, Adyen) levy cross-border interchange fees (ranging from 1.0% to 2.0%) on non-domestic credit cards, which must be factored into the pricing markup.",
        
        "Finally, enterprise pricing engines apply Localized Psychological Charm Rounding. In the United States and United Kingdom, consumers are accustomed to decimal charm pricing ending in `.99` or `.95`. In contrast, in markets like Japan (JPY), South Korea (KRW), or Scandinavia, prices are conventionally quoted in rounded integer numbers (e.g., ¥14,800 rather than ¥14,800.73). Failing to respect cultural pricing conventions destroys consumer trust and signals an unsophisticated foreign merchant.",
        
        "In our institutional Python model for Part 2, we simulate an enterprise multi-currency pricing engine. The program accepts base USD catalog prices, applies spot exchange rates, injects corporate FX volatility hedges and payment gateway spreads, and formats output prices according to country-specific psychological rounding rules. Review the deterministic code below to master global currency pricing."
    ]

    p2_code = '''def calculate_multicurrency_localized_pricing(
    base_catalog_usd: float,
    target_currency: str,
    spot_fx_rate: float,
    fx_volatility_buffer_pct: float,
    gateway_crossborder_spread_pct: float,
    rounding_convention: str
) -> dict:
    """
    Enterprise Multi-Currency Pricing Engine.
    Converts base catalog USD into hedged, localized consumer retail prices.
    """
    # 1. Calculate effective hedged exchange rate: Spot * (1 + (buffer + spread) / 100)
    # Note: To protect merchant margin, if local currency per USD increases, merchant converts at safe rate
    total_hedge_markup_pct = fx_volatility_buffer_pct + gateway_crossborder_spread_pct
    hedged_fx_rate = spot_fx_rate * (1.0 + (total_hedge_markup_pct / 100.0))
    
    # Raw converted price
    raw_converted_price = base_catalog_usd * hedged_fx_rate
    
    # 2. Apply cultural psychological charm rounding
    if rounding_convention == 'END_95':
        # E.g. 92.40 -> 92.95, 92.96 -> 93.95
        import math
        final_price = math.floor(raw_converted_price) + 0.95
        if final_price < raw_converted_price:
            final_price += 1.00
    elif rounding_convention == 'END_99':
        import math
        final_price = math.floor(raw_converted_price) + 0.99
        if final_price < raw_converted_price:
            final_price += 1.00
    elif rounding_convention == 'ROUND_INTEGER_100':
        # E.g. Japanese Yen: round to nearest 100 yen
        final_price = round(raw_converted_price / 100.0) * 100.0
    else:
        final_price = round(raw_converted_price, 2)
        
    merchant_hedge_protection_usd = (final_price / spot_fx_rate) - base_catalog_usd
    
    return {
        'base_catalog_usd': round(base_catalog_usd, 2),
        'target_currency': target_currency,
        'spot_fx_rate': spot_fx_rate,
        'hedged_fx_rate': round(hedged_fx_rate, 4),
        'raw_converted_price': round(raw_converted_price, 2),
        'final_localized_retail_price': round(final_price, 2),
        'hedge_markup_pct': round(total_hedge_markup_pct, 2),
        'margin_protection_usd': round(merchant_hedge_protection_usd, 2)
    }

currencies_to_quote = [
    {'curr': 'EUR', 'spot': 0.920, 'buffer': 2.0, 'spread': 1.5, 'rounding': 'END_95'},
    {'curr': 'GBP', 'spot': 0.785, 'buffer': 1.5, 'spread': 1.5, 'rounding': 'END_99'},
    {'curr': 'JPY', 'spot': 152.5, 'buffer': 2.5, 'spread': 2.0, 'rounding': 'ROUND_INTEGER_100'}
]

base_item_usd = 120.00 # $120 Premium Leather Backpack

print("=== ENTERPRISE MULTI-CURRENCY LOCALIZED PRICING ENGINE ===")
print(f"Base Item Catalog Value:        ${base_item_usd:.2f} USD")
print()

for c in currencies_to_quote:
    res = calculate_multicurrency_localized_pricing(
        base_catalog_usd=base_item_usd,
        target_currency=c['curr'],
        spot_fx_rate=c['spot'],
        fx_volatility_buffer_pct=c['buffer'],
        gateway_crossborder_spread_pct=c['spread'],
        rounding_convention=c['rounding']
    )
    print(f"Currency [{res['target_currency']}]:")
    print(f"  Spot FX: {res['spot_fx_rate']} -> Hedged FX: {res['hedged_fx_rate']} (+{res['hedge_markup_pct']}%)")
    print(f"  Raw Conversion: {res['raw_converted_price']:,.2f} {res['target_currency']}")
    print(f"  Final Localized Retail: {res['final_localized_retail_price']:,.2f} {res['target_currency']} (Margin Protection: +${res['margin_protection_usd']:.2f} USD)")
    print()'''

    p2_output = """=== ENTERPRISE MULTI-CURRENCY LOCALIZED PRICING ENGINE ===
Base Item Catalog Value:        $120.00 USD

Currency [EUR]:
  Spot FX: 0.92 -> Hedged FX: 0.9522 (+3.5%)
  Raw Conversion: 114.26 EUR
  Final Localized Retail: 114.95 EUR (Margin Protection: +$4.95 USD)

Currency [GBP]:
  Spot FX: 0.785 -> Hedged FX: 0.8086 (+3.0%)
  Raw Conversion: 97.03 GBP
  Final Localized Retail: 97.99 GBP (Margin Protection: +$4.83 USD)

Currency [JPY]:
  Spot FX: 152.5 -> Hedged FX: 159.3625 (+4.5%)
  Raw Conversion: 19,123.50 JPY
  Final Localized Retail: 19,100.00 JPY (Margin Protection: +$5.25 USD)"""

    p2_notes = [
        "Incorporating a 3.0% to 4.5% total buffer protected the merchant against FX fluctuations and cross-border gateway interchange fees.",
        "Cultural price rounding cleanly applied decimal charm pricing in Europe/UK (.95 and .99) and 100-unit integer rounding in Japan (19,100 JPY).",
        "Every localized transaction yielded positive margin protection ($4.83 to $5.25 USD) shielding corporate earnings from currency depreciation."
    ]

    p2_check = {
        "question": "Why do institutional e-commerce pricing engines add an FX Volatility Buffer onto raw spot exchange rates?",
        "options": [
            "To hedge against rapid currency fluctuations and international payment gateway spreads between customer purchase and treasury settlement",
            "Because international banks require all digital transactions to be rounded to prime numbers",
            "To artificially trigger higher customs duty inspections at destination borders",
            "Because currency exchange rates are strictly prohibited from changing on weekends"
        ],
        "answer": 0,
        "why": "Exchange rates oscillate continuously while consumer catalog prices must remain stable. An FX volatility buffer absorbs interim currency swings and gateway fees, protecting corporate gross margins."
    }

    parts.append({
        "title": "Multi-Currency Pricing Engines, Dynamic FX Hedging, FX Volatility Buffers & Payment Gateway Surcharges",
        "say": p2_say,
        "example": "Allbirds operates localized multi-currency pricing across Canada, the UK, Europe, and New Zealand. Rather than recalculating shoe prices hourly with volatile spot rates, Allbirds locks seasonal hedged exchange rates with psychological charm endings ($145 USD, £120 GBP, €140 EUR), protecting operating profits while providing shoppers transparent local pricing.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_notes,
        "tryIt": "Set fx_volatility_buffer_pct to 5.0% for the JPY quote to observe how the hedged retail price shifts to 19,300 JPY.",
        "check": p2_check
    })

    # Part 3: Harmonized System (HS) Tariff Classification, Import Duties, VAT/GST De Minimis Thresholds & Total Landed Cost (TLC) Modeling
    p3_say = [
        "The single greatest cause of cross-border customer dissatisfaction and cart abandonment is unexpected customs duty charges at delivery. When an overseas customer orders a jacket for one hundred dollars, only to have the local postal courier demand an additional forty-five dollars in customs duties and value-added tax upon arrival, the customer often refuses delivery. This triggers an expensive Return to Origin (RTO), where the merchant forfeits outward shipping costs, pays return carrier freight, and absorbs restocking write-downs.",
        
        "To eliminate this friction, world-class e-commerce platforms calculate the Total Landed Cost (TLC) at checkout. Total Landed Cost represents the complete, all-inclusive price required to manufacture, transport, clear customs, and deliver an order to the end consumer's doorstep. Calculating TLC requires four mathematical variables: First, Harmonized System (HS) Tariff Classification—developed by the World Customs Organization (WCO), the 6-digit HS code (supplemented by national 8-to-10 digit tariff suffixes) identifies the exact legal classification, material composition, and duty tariff rate of the imported good; Second, Customs Valuation Base—most nations calculate import duties on a CIF basis (Cost, Insurance, and Freight), meaning duty is assessed on the sum of the product price plus shipping and insurance, whereas a minority (like the United States) utilize FOB (Free on Board) valuation excluding transport; Third, Import Duty Calculation—applying the statutory ad valorem duty percentage (e.g., 8.5% on leather goods); and Fourth, Value-Added Tax (VAT) or Goods and Services Tax (GST)—calculated on the landed customs value (CIF plus import duty).",
        
        "Furthermore, international trade specialists navigate De Minimis Thresholds. The De Minimis value is the statutory minimum threshold below which imported goods enter a country duty-free and tax-free. In the United States, under Section 321, shipments under eight hundred dollars enter completely free of duty. In contrast, the European Union and United Kingdom eliminated low-value VAT exemptions, requiring merchants to collect and remit local VAT on all imported e-commerce parcels regardless of value.",
        
        "In our institutional Python model for Part 3, we build an enterprise Total Landed Cost (TLC) engine. The model evaluates commercial invoice line items, determines CIF valuation, checks sovereign De Minimis thresholds, computes ad valorem customs duties, and applies destination consumption taxes (VAT/GST). Review the deterministic code below to master landed cost mathematics."
    ]

    p3_code = '''def calculate_total_landed_cost(
    item_value_usd: float,
    international_freight_usd: float,
    cargo_insurance_usd: float,
    hs_code: str,
    destination_country_code: str,
    global_tariff_schedule: dict
) -> dict:
    """
    Enterprise Total Landed Cost (TLC) Calculation Engine.
    Computes CIF valuation, checks De Minimis thresholds, and calculates duties and VAT/GST.
    """
    cif_valuation_usd = item_value_usd + international_freight_usd + cargo_insurance_usd
    
    country_rules = global_tariff_schedule.get(destination_country_code, {
        'de_minimis_duty_usd': 0.0,
        'de_minimis_vat_usd': 0.0,
        'standard_vat_rate_pct': 20.0,
        'tariffs': {}
    })
    
    duty_rate_pct = country_rules['tariffs'].get(hs_code, 5.0) # Default 5% if unspecified
    vat_rate_pct = country_rules['standard_vat_rate_pct']
    
    # 1. Evaluate De Minimis Duty Exemption
    if cif_valuation_usd <= country_rules['de_minimis_duty_usd']:
        duty_exempt = True
        customs_duty_usd = 0.0
    else:
        duty_exempt = False
        customs_duty_usd = cif_valuation_usd * (duty_rate_pct / 100.0)
        
    # 2. Evaluate De Minimis VAT Exemption
    if cif_valuation_usd <= country_rules['de_minimis_vat_usd']:
        vat_exempt = True
        vat_gst_usd = 0.0
    else:
        vat_exempt = False
        # VAT is assessed on CIF + Import Duty
        vat_taxable_base_usd = cif_valuation_usd + customs_duty_usd
        vat_gst_usd = vat_taxable_base_usd * (vat_rate_pct / 100.0)
        
    total_landed_cost_usd = cif_valuation_usd + customs_duty_usd + vat_gst_usd
    effective_tax_rate_pct = ((customs_duty_usd + vat_gst_usd) / cif_valuation_usd) * 100.0
    
    return {
        'destination_country': destination_country_code,
        'hs_code': hs_code,
        'cif_valuation_usd': round(cif_valuation_usd, 2),
        'duty_exempt': duty_exempt,
        'customs_duty_usd': round(customs_duty_usd, 2),
        'vat_exempt': vat_exempt,
        'vat_gst_usd': round(vat_gst_usd, 2),
        'total_landed_cost_usd': round(total_landed_cost_usd, 2),
        'effective_border_friction_pct': round(effective_tax_rate_pct, 2)
    }

tariff_schedules = {
    'GB': { # United Kingdom
        'de_minimis_duty_usd': 180.0,  # £135 threshold (~$180 USD) for duty
        'de_minimis_vat_usd': 0.0,     # £0 threshold! VAT applies to all goods
        'standard_vat_rate_pct': 20.0,
        'tariffs': {'6403.99': 8.0, '6109.10': 12.0} # Shoes: 8%, Cotton Tees: 12%
    },
    'US': { # United States
        'de_minimis_duty_usd': 800.0,  # Section 321 $800 duty exemption
        'de_minimis_vat_usd': 800.0,
        'standard_vat_rate_pct': 0.0,
        'tariffs': {'6403.99': 10.0, '6109.10': 16.5}
    },
    'DE': { # Germany (EU)
        'de_minimis_duty_usd': 160.0,  # €150 threshold for duty
        'de_minimis_vat_usd': 0.0,     # €0 threshold! EU VAT applies on all goods
        'standard_vat_rate_pct': 19.0,
        'tariffs': {'6403.99': 8.0, '6109.10': 12.0}
    }
}

# Test Scenario: $140 Cotton Apparel parcel into UK vs US
uk_tlc = calculate_total_landed_cost(
    item_value_usd=140.0, international_freight_usd=25.0, cargo_insurance_usd=5.0,
    hs_code='6109.10', destination_country_code='GB', global_tariff_schedule=tariff_schedules
)

us_tlc = calculate_total_landed_cost(
    item_value_usd=140.0, international_freight_usd=25.0, cargo_insurance_usd=5.0,
    hs_code='6109.10', destination_country_code='US', global_tariff_schedule=tariff_schedules
)

print("=== TOTAL LANDED COST (TLC) CROSS-BORDER SIMULATION ===")
print("UK Order (CIF: $170.00):")
print(f"  Duty Status: Exempt={uk_tlc['duty_exempt']} (${uk_tlc['customs_duty_usd']:.2f}) | VAT (20%): ${uk_tlc['vat_gst_usd']:.2f}")
print(f"  Total Landed Cost: ${uk_tlc['total_landed_cost_usd']:.2f} (Border Friction: +{uk_tlc['effective_border_friction_pct']}%)")
print()
print("US Order (CIF: $170.00):")
print(f"  Duty Status: Exempt={us_tlc['duty_exempt']} (${us_tlc['customs_duty_usd']:.2f}) | Sales Tax: ${us_tlc['vat_gst_usd']:.2f}")
print(f"  Total Landed Cost: ${us_tlc['total_landed_cost_usd']:.2f} (Border Friction: +{us_tlc['effective_border_friction_pct']}%)")'''

    p3_output = """=== TOTAL LANDED COST (TLC) CROSS-BORDER SIMULATION ===
UK Order (CIF: $170.00):
  Duty Status: Exempt=True ($0.00) | VAT (20%): $34.00
  Total Landed Cost: $204.00 (Border Friction: +20.0%)

US Order (CIF: $170.00):
  Duty Status: Exempt=True ($0.00) | Sales Tax: $0.00
  Total Landed Cost: $170.00 (Border Friction: +0.0%)"""

    p3_notes = [
        "Under UK trade rules, the $170.00 CIF parcel was exempt from import duty (< $180 threshold) but subject to 20% VAT ($34.00).",
        "In contrast, the US Section 321 exemption allowed the identical $170.00 order to enter completely duty-free and tax-free.",
        "Accurately quoting the $204.00 total landed cost at checkout guarantees zero surprise delivery fees for the British consumer."
    ]

    p3_check = {
        "question": "What is the key difference between CIF (Cost, Insurance, Freight) and FOB (Free on Board) customs valuation?",
        "options": [
            "CIF assesses import duties on the combined total of product price, international shipping, and cargo insurance, whereas FOB assesses duty on product price alone",
            "CIF is only applicable to orders delivered by supersonic passenger jets",
            "FOB requires the customer to pay customs duties in physical gold bullion",
            "CIF completely eliminates the requirement to pay local VAT"
        ],
        "answer": 0,
        "why": "Most international customs jurisdictions (including the EU and UK) calculate tariffs using CIF valuation, adding freight and insurance to the customs duty and tax base."
    }

    parts.append({
        "title": "Harmonized System (HS) Tariff Classification, Import Duties, VAT/GST De Minimis Thresholds & Total Landed Cost (TLC) Modeling",
        "say": p3_say,
        "example": "Gymshark partnered with cross-border fulfillment provider Global-e to calculate real-time landed costs for international shoppers. By calculating exact HS-code tariffs and EU VAT at online checkout, Gymshark reduced cross-border package refusal rates from 18% to under 1.2%, unlocking £25M in annual international sales.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_notes,
        "tryIt": "Increase the item_value_usd to $250.00 in the UK simulation to observe how the parcel breaches the £135 threshold, triggering an 8% customs duty plus 20% VAT.",
        "check": p3_check
    })

    # Part 4: International Shipping Compliance: Delivered Duty Paid (DDP) vs Delivered Duty Unpaid (DDU), Customs Clearance Protocols & Restricted Goods Screening
    p4_say = [
        "In the operational execution of cross-border logistics, an enterprise must make a foundational architectural choice: Delivered Duty Paid (DDP) versus Delivered Duty Unpaid (DDU, formally designated as DAP - Delivered at Place under Incoterms 2020). Operating under DDU means the merchant collects only the product price and baseline freight at checkout. When the parcel arrives in the destination country, customs authorities place the package in bonded detention, sending an invoice to the customer demanding payment for import duties, clearance disbursement fees, and local taxes before delivery can occur. DDU creates high customer friction, extended delivery delays (averaging 7 to 14 days in customs holding), and catastrophic return rates exceeding twenty percent.",
        
        "In contrast, enterprise cross-border commerce is built upon Delivered Duty Paid (DDP). Under a DDP model, the merchant's checkout engine calculates exact customs duties and import VAT in real time, pre-collecting all government fees directly from the customer at purchase. The carrier (e.g., DHL Express, FedEx Cross Border, UPS i-parcel) transmits digital customs declarations (EDI / ITMATT electronic advance data) to customs clearance brokers while the freight is in transit. Upon flight touchdown, the shipment passes through expedited customs clearance channels without physical detention, delivering directly to the customer's residence with zero surprise charges. DDP achieves delivery success rates exceeding ninety-eight percent.",
        
        "Concurrently, international fulfillment requires strict Customs Documentation and Commercial Invoice Generation. Every international parcel must be accompanied by accurate CN22 (for postal parcels under 2kg) or CN23 / Commercial Invoice forms. These documents legally certify the Harmonized System (HS) tariff code, country of origin (COO), net item weight, and accurate commercial transaction value. Under-declaring shipment values to evade foreign duties is a severe criminal offense under international customs laws (violating the US Export Administration Regulations and EU Customs Code), subjecting merchants to crippling fines, permanent export revocation, and carrier blacklisting.",
        
        "In our institutional Python model for Part 4, we simulate an international customs clearance and shipping compliance engine. The algorithm audits international shipments for DDP vs DDU logistics routing, verifies electronic commercial invoice declarations, screens restricted destination materials, and calculates delivery risk indices. Review the deterministic code below to master cross-border shipping compliance."
    ]

    p4_code = '''def evaluate_cross_border_shipping_compliance(
    shipment_manifest: list[dict]
) -> dict:
    """
    International Shipping Compliance & Customs Clearance Engine.
    Audits DDP vs DDU shipping models, validates commercial invoices, and scores delivery reliability.
    """
    total_parcels = len(shipment_manifest)
    ddp_parcels = 0
    ddu_parcels = 0
    invoice_errors = 0
    customs_holds_projected = 0
    total_customs_precollected_usd = 0.0
    
    for parcel in shipment_manifest:
        incoterm = parcel['incoterm']
        has_hs_code = bool(parcel.get('hs_code'))
        has_accurate_coo = bool(parcel.get('country_of_origin'))
        has_declared_value = parcel.get('declared_value_usd', 0) > 0
        
        # Verify commercial invoice compliance
        is_invoice_valid = has_hs_code and has_accurate_coo and has_declared_value
        
        if not is_invoice_valid:
            invoice_errors += 1
            customs_holds_projected += 1
            parcel['clearance_status'] = 'FLAGGED_INVOICE_DEFICIENCY'
        elif incoterm == 'DDP':
            ddp_parcels += 1
            total_customs_precollected_usd += parcel.get('precollected_duties_usd', 0.0)
            parcel['clearance_status'] = 'EXPEDITED_GREEN_LANE'
        elif incoterm == 'DDU':
            ddu_parcels += 1
            # DDU shipments experience customs inspection and buyer refusal risk
            customs_holds_projected += 1
            parcel['clearance_status'] = 'BONDED_CUSTOMS_HOLD_PENDING_BUYER_PAYMENT'
        else:
            parcel['clearance_status'] = 'UNKNOWN_INCOTERM'
            
    ddp_adoption_rate_pct = (ddp_parcels / total_parcels) * 100.0 if total_parcels > 0 else 0.0
    delivery_success_projected_pct = 98.5 if ddu_parcels == 0 and invoice_errors == 0 else max(75.0, 98.5 - (ddu_parcels * 5.0) - (invoice_errors * 10.0))
    
    return {
        'total_shipments_audited': total_parcels,
        'ddp_count': ddp_parcels,
        'ddu_count': ddu_parcels,
        'commercial_invoice_errors': invoice_errors,
        'projected_customs_holds': customs_holds_projected,
        'total_precollected_duties_usd': round(total_customs_precollected_usd, 2),
        'ddp_adoption_rate_pct': round(ddp_adoption_rate_pct, 1),
        'projected_delivery_success_rate_pct': round(delivery_success_projected_pct, 1),
        'manifest_clearance_records': shipment_manifest[:3]
    }

mock_manifest = [
    {
        'tracking_id': 'EXP-701-GB', 'destination': 'GB', 'incoterm': 'DDP',
        'hs_code': '6109.10', 'country_of_origin': 'VN', 'declared_value_usd': 85.0,
        'precollected_duties_usd': 17.0
    },
    {
        'tracking_id': 'EXP-702-DE', 'destination': 'DE', 'incoterm': 'DDP',
        'hs_code': '6403.99', 'country_of_origin': 'IT', 'declared_value_usd': 210.0,
        'precollected_duties_usd': 56.70
    },
    {
        'tracking_id': 'EXP-703-FR', 'destination': 'FR', 'incoterm': 'DDU', # DDU Risk!
        'hs_code': '6204.62', 'country_of_origin': 'CN', 'declared_value_usd': 130.0,
        'precollected_duties_usd': 0.0
    },
    {
        'tracking_id': 'EXP-704-JP', 'destination': 'JP', 'incoterm': 'DDP',
        'hs_code': '', 'country_of_origin': 'US', 'declared_value_usd': 95.0, # Missing HS Code!
        'precollected_duties_usd': 0.0
    }
]

shipping_audit = evaluate_cross_border_shipping_compliance(mock_manifest)

print("=== INTERNATIONAL SHIPPING & CUSTOMS COMPLIANCE AUDIT ===")
print(f"Total Parcels Audited:          {shipping_audit['total_shipments_audited']}")
print(f"DDP Pre-Collected Parcels:      {shipping_audit['ddp_count']} ({shipping_audit['ddp_adoption_rate_pct']}%)")
print(f"DDU Risk Parcels:               {shipping_audit['ddu_count']} (Subject to buyer refusal)")
print(f"Commercial Invoice Errors:      {shipping_audit['commercial_invoice_errors']} (Missing customs data)")
print(f"Pre-Collected Duties Remitted:  ${shipping_audit['total_precollected_duties_usd']:,.2f}")
print(f"Projected Delivery Success:     {shipping_audit['projected_delivery_success_rate_pct']}% (Target: >= 98.0%)")
print()
print("Sample Manifest Clearance Statuses:")
for m in shipping_audit['manifest_clearance_records']:
    print(f"  [{m['tracking_id']}] -> Dest: {m['destination']} | Incoterm: {m['incoterm']} | Status: [{m['clearance_status']}]")'''

    p4_output = """=== INTERNATIONAL SHIPPING & CUSTOMS COMPLIANCE AUDIT ===
Total Parcels Audited:          4
DDP Pre-Collected Parcels:      2 (50.0%)
DDU Risk Parcels:               1 (Subject to buyer refusal)
Commercial Invoice Errors:      1 (Missing customs data)
Pre-Collected Duties Remitted:  $73.70
Projected Delivery Success:     83.5% (Target: >= 98.0%)

Sample Manifest Clearance Statuses:
  [EXP-701-GB] -> Dest: GB | Incoterm: DDP | Status: [EXPEDITED_GREEN_LANE]
  [EXP-702-DE] -> Dest: DE | Incoterm: DDP | Status: [EXPEDITED_GREEN_LANE]
  [EXP-703-FR] -> Dest: FR | Incoterm: DDU | Status: [BONDED_CUSTOMS_HOLD_PENDING_BUYER_PAYMENT]"""

    p4_notes = [
        "DDP shipments passed through customs with zero delay via expedited green-lane clearance, with $73.70 in pre-collected duties.",
        "The DDU parcel into France was routed to bonded customs detention, subjecting the order to buyer payment refusal risk.",
        "Missing HS code on parcel EXP-704-JP triggered a compliance deficiency hold, reducing projected delivery success to 83.5%."
    ]

    p4_check = {
        "question": "Why is Delivered Duty Paid (DDP) universally preferred over Delivered Duty Unpaid (DDU) for modern consumer cross-border e-commerce?",
        "options": [
            "DDP pre-collects all duties and taxes at checkout, eliminating surprise delivery fees and customs detention, raising delivery success to over 98%",
            "DDP legally exempts international merchants from generating commercial invoices",
            "DDU is only permitted for domestic postal mail within the same city",
            "DDP guarantees that commercial airplanes fly twice as fast across the ocean"
        ],
        "answer": 0,
        "why": "DDU causes significant customer dissatisfaction and high return rates because buyers are ambushed with customs invoices before receiving goods. DDP provides frictionless door-to-door delivery."
    }

    parts.append({
        "title": "International Shipping Compliance: Delivered Duty Paid (DDP) vs Delivered Duty Unpaid (DDU), Customs Clearance Protocols & Restricted Goods Screening",
        "say": p4_say,
        "example": "Farfetch powers luxury fashion across 190 countries using strict DDP logistics. By pre-clearing electronic commercial invoices with customs authorities prior to flight departure, Farfetch delivers luxury apparel from Milan boutiques to New York or Tokyo penthouses in 48 hours without customs holding.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_notes,
        "tryIt": "Fix parcel EXP-704-JP by adding hs_code='3304.99' and incoterm='DDP' to observe the delivery success rate jump to 93.5%.",
        "check": p4_check
    })

    # Part 5: Enterprise Global Expansion Command Gateway & GCE-AI Certification
    p5_say = [
        "To conclude Day 21, we synthesize edge IP geolocation, multi-currency pricing hedging, total landed cost modeling, and DDP customs compliance into the Enterprise Global Commerce Expansion Command Gateway. International expansion is not merely an opportunistic marketing campaign; it is a multi-dimensional corporate capability that requires synchronized execution across finance, legal compliance, software engineering, and global logistics.",
        
        "The Enterprise Global Expansion Command Gateway evaluates four strategic operational pillars to calculate the Global Commerce Expansion & Accreditation Index (GCE-AI, 100 max points): First, Landed Cost Precision & Tax Compliance (30 points)—it audits the mathematical accuracy of real-time duty and VAT calculations, ensuring landed cost variance remains below 2.0%; Second, DDP Logistics Adoption & Delivery Reliability (25 points)—it benchmarks the percentage of cross-border orders dispatched under Delivered Duty Paid protocols (target >= 95.0%), driving first-attempt delivery completion above 98.0%; Third, Localized Payment & Currency Experience (25 points)—it verifies that shoppers can transact in their native currencies using dominant local alternative payment methods (APMs, such as iDEAL in the Netherlands, Bancontact in Belgium, and Klarna in DACH); and Fourth, Regulatory Compliance & Customs Velocity (20 points)—it tracks commercial invoice completeness and customs clearance passage rate (target >= 99.0%).",
        
        "Achieving a GCE-AI score of 85.0 points or above confers the Apex Global Commerce Expansion Certification. In our institutional Python capstone for Day 21, we simulate an enterprise global expansion command gateway governing an international digital commerce operation generating ten million dollars in quarterly cross-border GMV. Review the deterministic code below to master global commerce governance."
    ]

    p5_code = '''def run_enterprise_global_expansion_gateway(
    quarterly_crossborder_gmv_usd: float,
    landed_cost_accuracy_pct: float,
    ddp_shipment_share_pct: float,
    local_payment_coverage_pct: float,
    customs_compliance_rate_pct: float
) -> dict:
    """
    Enterprise Global Commerce Expansion Command Gateway.
    Synthesizes cross-border metrics into the GCE-AI accreditation score.
    """
    # 1. Landed Cost & Tax Compliance (30 pts, target >= 98% accuracy)
    score_tax = min(30.0, (landed_cost_accuracy_pct / 98.0) * 30.0)
    
    # 2. DDP Logistics Adoption (25 pts, target >= 95% DDP)
    score_ddp = min(25.0, (ddp_shipment_share_pct / 95.0) * 25.0)
    
    # 3. Localized Payment & Currency (25 pts, target >= 90% local APM coverage)
    score_payments = min(25.0, (local_payment_coverage_pct / 90.0) * 25.0)
    
    # 4. Customs Compliance & Velocity (20 pts, target >= 99% pass rate)
    score_customs = min(20.0, (customs_compliance_rate_pct / 99.0) * 20.0)
    
    gce_ai_score = round(score_tax + score_ddp + score_payments + score_customs, 2)
    certified = gce_ai_score >= 85.0
    
    return {
        'quarterly_crossborder_gmv_usd': round(quarterly_crossborder_gmv_usd, 2),
        'gce_ai_composite_score': gce_ai_score,
        'pillar_scores': {
            'landed_cost_precision_pts': round(score_tax, 2),
            'ddp_logistics_adoption_pts': round(score_ddp, 2),
            'local_payment_experience_pts': round(score_payments, 2),
            'customs_compliance_pts': round(score_customs, 2)
        },
        'system_kpis': {
            'landed_cost_accuracy': f"{landed_cost_accuracy_pct}%",
            'ddp_share': f"{ddp_shipment_share_pct}%",
            'local_payment_coverage': f"{local_payment_coverage_pct}%",
            'customs_pass_rate': f"{customs_compliance_rate_pct}%"
        },
        'certification_conferred': certified,
        'governance_status': 'APEX_GLOBAL_COMMERCE_EXPANSION_CERTIFIED' if certified else 'GLOBAL_EXPANSION_REMEDIATION_REQUIRED'
    }

expansion_audit = run_enterprise_global_expansion_gateway(
    quarterly_crossborder_gmv_usd=10000000.0, # $10M Cross-Border GMV
    landed_cost_accuracy_pct=98.5,             # 98.5% Landed Cost precision
    ddp_shipment_share_pct=96.2,               # 96.2% DDP adoption
    local_payment_coverage_pct=92.0,           # 92.0% Local payment coverage
    customs_compliance_rate_pct=99.4           # 99.4% Customs clearance rate
)

print("=== ENTERPRISE GLOBAL EXPANSION COMMAND GATEWAY & ACCREDITATION ===")
print(f"Quarterly Cross-Border GMV:     ${expansion_audit['quarterly_crossborder_gmv_usd']:,.2f}")
print(f"GCE-AI Composite Score:         {expansion_audit['gce_ai_composite_score']} / 100.00 pts")
print(f"Pillar Breakdown:               Landed Cost: {expansion_audit['pillar_scores']['landed_cost_precision_pts']} | DDP: {expansion_audit['pillar_scores']['ddp_logistics_adoption_pts']} | Payments: {expansion_audit['pillar_scores']['local_payment_experience_pts']} | Customs: {expansion_audit['pillar_scores']['customs_compliance_pts']}")
print(f"System Performance KPIs:        {expansion_audit['system_kpis']}")
print(f"Platform Governance Status:     [{expansion_audit['governance_status']}] (Certified: {expansion_audit['certification_conferred']})")'''

    p5_output = """=== ENTERPRISE GLOBAL EXPANSION COMMAND GATEWAY & ACCREDITATION ===
Quarterly Cross-Border GMV:     $10,000,000.00
GCE-AI Composite Score:         100.0 / 100.00 pts
Pillar Breakdown:               Landed Cost: 30.0 | DDP: 25.0 | Payments: 25.0 | Customs: 20.0
System Performance KPIs:        {'landed_cost_accuracy': '98.5%', 'ddp_share': '96.2%', 'local_payment_coverage': '92.0%', 'customs_pass_rate': '99.4%'}
Platform Governance Status:     [APEX_GLOBAL_COMMERCE_EXPANSION_CERTIFIED] (Certified: True)"""

    p5_notes = [
        "The Global Expansion Gateway verified operational excellence across $10M in quarterly cross-border e-commerce GMV.",
        "Exceeding benchmark targets in DDP logistics (96.2%) and customs compliance (99.4%) minimized delivery disputes and customs holds.",
        "Achieving a perfect 100.0/100 GCE-AI score confers the Apex Global Commerce Expansion Certification."
    ]

    p5_check = {
        "question": "What is the strategic value of offering local alternative payment methods (APMs) like iDEAL or Klarna in European cross-border commerce?",
        "options": [
            "In many European markets, local APMs account for over 60% of digital transactions; offering only credit cards alienates the majority of consumers and depresses conversion rates",
            "Local payment methods prevent European central banks from tracking revenue",
            "Alternative payment methods legally bypass all European customs inspection rules",
            "Credit cards are illegal for online shopping in the European Union"
        ],
        "answer": 0,
        "why": "Consumer payment preferences vary drastically by region. For example, in the Netherlands, over 60% of all e-commerce transactions occur via iDEAL; omitting it destroys checkout conversion."
    }

    parts.append({
        "title": "Enterprise Global Expansion Command Gateway & GCE-AI Certification",
        "say": p5_say,
        "example": "Glossier expanded into Canada, the UK, and Europe by deploying an integrated global commerce gateway. By combining localized pricing, DDP air freight with DHL, and local payment methods like Klarna and PayPal, Glossier drove international sales to 30% of total company revenue within 18 months.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_notes,
        "tryIt": "Lower local_payment_coverage_pct to 60.0% to observe how missing local payment methods drops the GCE-AI score and triggers an expansion remediation alert.",
        "check": p5_check
    })

    # Assemble Day 21 dictionary
    day21_dict = {
        "day": 21,
        "title": "International E-Commerce & Cross-Border Expansion: Localization, Multi-Currency Pricing & Harmonized System (HS) Codes",
        "summary": [
            "Edge-level IP geolocation, sovereign domain routing (.co.uk, .de) and regulatory catalog compliance filtering.",
            "Multi-currency pricing engines, dynamic spot FX hedging, volatility buffers (1.5-2.5%) and cultural psychological rounding.",
            "Total Landed Cost (TLC) modeling: Harmonized System (HS) codes, CIF valuation, import tariffs, and De Minimis exemptions.",
            "Delivered Duty Paid (DDP) versus Delivered Duty Unpaid (DDU), commercial invoice compliance, and expedited customs clearance.",
            "Enterprise Global Commerce Expansion Command Gateway and GCE-AI institutional operational certification."
        ],
        "parts": parts
    }

    # Ensure invariant: >= 580 words per part and >= 2,950 words total
    total_words = ensure_ecom_day_budget(day21_dict, min_part_words=580, min_day_words=2950)
    return day21_dict, total_words

if __name__ == '__main__':
    d, w = build_day21()
    print(f"Day 21 Built Successfully! Total Spoken Words: {w:,}")
    for idx, p in enumerate(d['parts']):
        words = count_words(" ".join(p['say']))
        print(f"  Part {idx+1}: {p['title'][:45]}... ({words} words)")
