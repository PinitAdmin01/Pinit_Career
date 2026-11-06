with open('scripts/generate_quant_day32.py', 'r', encoding='utf-8') as f:
    text = f.read()

p2_code_insert = '''        "In high-frequency quantitative market making, options desks monitor Gamma concentration across expiration buckets. When near-dated options enter the final hours before expiration, Gamma approaches a Dirac delta function at-the-money, creating extreme pin risk. If the stock trades near a high-open-interest strike, market makers must rapidly adjust their delta hedges in response to microscopic spot fluctuations. Cross-Greeks like Vanna provide critical early warning signals for these pin risk events by revealing how volatility shifts alter the effective hedging requirement across the strike strip.",
        "Microarchitectural profiling indicates that precalculating intermediate terms such as d1, d2, and the Gaussian density phi(d1) allows the processor to compute Gamma, Vanna, and Volga within a single tightly unrolled loop. Modern compilers vectorize these operations across adjacent strikes using AVX2 FMA instructions, maintaining peak floating-point throughput without incurring pipeline stalls or cache invalidation delays.",
'''

p3_code_insert = '''        "During historical liquidity cascades, such as the collapse of volatility-selling exchange-traded products like XIV in February 2018 (Volmageddon), automated market makers that failed to dynamically hedge short Gamma suffered catastrophic losses within minutes. As the VIX index surged by over 100% in a single trading session, the market makers were forced to buy massive volumes of VIX futures and equity puts to cover accelerating short Gamma exposure, triggering a self-reinforcing liquidity black hole across the entire derivatives ecosystem.",
        "Institutional trading desks mitigate short Gamma risks by establishing strict real-time stop-loss boundaries and automated gamma scalping mandates. If aggregate Gamma breaches predefined risk parameters, trading algorithms automatically execute offsetting options trades in deep liquid series or adjust quote widths to deter further adverse inventory accumulation.",
'''

p4_code_insert = '''        "To ensure deterministic execution across volatile market regimes, the portfolio aggregator utilizes pre-allocated static ring buffers for all intermediate Greek accumulations. By avoiding any heap memory allocation during the aggregation loop, the engine completely eliminates the risk of memory fragmentation or operating system page faults. Every position struct is aligned to a 64-byte CPU cache boundary, allowing the hardware prefetcher to stream data seamlessly from L2 cache into vector execution units.",
        "Furthermore, the aggregator implements lock-free atomic sequence counters to publish updated portfolio risk totals to downstream quoting threads. When the market data ingestion thread deposits a new underlying spot tick, the aggregator updates the risk state and increments the sequence counter using memory_order_release semantics. This guarantees that execution algorithms read fully synchronized, coherent Greek vectors without suffering mutex lock contention.",
'''

p5_code_insert = '''        "Under FINRA Rule 5210 and the SEC Market Access Rule 15c3-5, broker-dealers must establish objective, documented limits for aggregate capital commitment across all trading accounts. The multi-factor stress matrix acts as the foundational mechanical gate: if a projected market shock exceeds the firm approved capital buffer, the trading system automatically engages circuit breakers to restrict quote generation and reduce risk exposures before any exchange rules are breached.",
        "Independent risk audit teams conduct quarterly reverse-engineering reviews of the stress testing kernel, validating that higher-order Taylor approximations remain aligned with full contract repricing models. By continuously validating mathematical accuracy against simulated crisis scenarios, quantitative firms maintain operational sovereignty and regulatory compliance under extreme market conditions.",
'''

# Replace in p2_say
idx2 = text.find('        "Furthermore, modern high-frequency trading platforms vectorize cross-Greek')
if idx2 != -1:
    text = text[:idx2] + p2_code_insert + text[idx2:]

# Replace in p3_say
idx3 = text.find('        "Post-incident forensic analysis of quantitative firm collapses')
if idx3 != -1:
    text = text[:idx3] + p3_code_insert + text[idx3:]

# Replace in p4_say
idx4 = text.find('        "Rigorous verification testing confirms that the zero-allocation')
if idx4 != -1:
    text = text[:idx4] + p4_code_insert + text[idx4:]

# Replace in p5_say
idx5 = text.find('        "Independent supervisory personnel and chief risk officers')
if idx5 != -1:
    text = text[:idx5] + p5_code_insert + text[idx5:]

with open('scripts/generate_quant_day32.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated scripts/generate_quant_day32.py successfully.')
