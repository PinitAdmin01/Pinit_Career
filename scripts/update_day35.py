with open('scripts/generate_quant_day35.py', 'r', encoding='utf-8') as f:
    text = f.read()

p2_code_insert = '''        "In ultra-low latency implementations, the mass cancellation pipeline is offloaded directly to field-programmable gate arrays (FPGAs) or kernel-bypass network cards utilizing Solarflare OpenOnload or DPDK. When an underlying spot tick breaches the volatility jump threshold, the FPGA parses the packet in silicon and emits hardware-synthesized cancel packets directly onto the physical fiber link in under 800 nanoseconds, bypassing the host operating system kernel entirely.",
        "This hardware-level cancel pipeline ensures that the market maker's cancel requests arrive at the exchange matching engine ahead of software-driven sweep orders from competing proprietary desks, turning potential catastrophic adverse selection into a structural technological moat.",
'''

p3_code_insert = '''        "Microstructural analysis of the Avellaneda-Stoikov quoting equations reveals that the optimal half-spread expands nonlinearly during periods of heightened market volatility. When underlying trading volume surges and order flow becomes toxic, the engine automatically widens quoting spreads across the entire option chain, extracting a higher risk premium from market participants and insulating the desk from adverse selection.",
        "Furthermore, the quoting engine continuously computes the asymmetric order arrival intensity kappa for bids versus asks. If natural market order flow is dominated by aggressive put buying, kappa_bid surges, signaling to the quoting engine that market participants possess informed bearish order flow. The engine responds by shaving its bid sizes and lowering bid prices faster than theoretical models predict, preserving capital through adaptive microstructure learning.",
'''

p4_code_insert = '''        "In addition to standard passive near-touch slicing, the hedging execution gateway incorporates Dark Pool liquidity hunting and Midpoint Match orders. When rebalancing large Delta imbalances (e.g., exceeding 10,000 shares), routing the entire volume to public lit exchanges would telegraph market maker inventory distress and cause adverse market impact. By routing non-displayed midpoint orders to alternative trading systems (ATSs), the gateway captures hidden institutional block liquidity with zero spread crossing costs.",
        "The gateway also implements an adaptive time-in-force engine: passive limit orders that remain unfilled after 500 milliseconds are dynamically re-priced or cancelled based on micro-price momentum. If underlying spot price moves away from the resting limit order, the engine cancels the order and re-evaluates Whalley-Wilmott band compliance, ensuring that resting hedging orders never become stale liabilities.",
'''

p5_code_insert = '''        "The Grand Master 5-Gate defense audit is conducted under simulated extreme market chaos conditions, injecting artificial network packet drops, corrupted market data feeds, and simultaneous multi-strike order book sweeps. The platform must demonstrate automated failover to redundant hot-standby instances with zero state loss and zero duplicate execution reports.",
        "Upon successfully completing the 5-Gate defense audit, the platform generates an immutable, cryptographically signed audit certificate. Chief Risk Officers, Chief Technology Officers, and regulatory compliance supervisors review and sign off on this institutional accreditation, certifying that the high-frequency options market making platform meets the highest global standards for institutional quantitative deployment.",
'''

# Insert into p2_say
idx2 = text.find('        "Under FINRA Rule 5210, automated market makers must demonstrate')
if idx2 != -1:
    text = text[:idx2] + p2_code_insert + text[idx2:]

# Insert into p3_say
idx3 = text.find('        "By dynamically coupling SABR volatility valuation with Avellaneda-Stoikov')
if idx3 != -1:
    text = text[:idx3] + p3_code_insert + text[idx3:]

# Insert into p4_say
idx4 = text.find('        "By automating delta rebalancing within mathematically calibrated deadbands')
if idx4 != -1:
    text = text[:idx4] + p4_code_insert + text[idx4:]

# Insert into p5_say
idx5 = text.find('        "Earning this certification represents the pinnacle of quantitative systems engineering')
if idx5 != -1:
    text = text[:idx5] + p5_code_insert + text[idx5:]

with open('scripts/generate_quant_day35.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated scripts/generate_quant_day35.py successfully.')
