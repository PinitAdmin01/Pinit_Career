with open('scripts/generate_quant_day34.py', 'r', encoding='utf-8') as f:
    text = f.read()

p2_code_insert = '''        "In addition, numerical stability analysis demonstrates that evaluating Hagan's formula for deep out-of-the-money options requires careful handling of the logarithm ratio z / x(z). When the asset price approaches the strike price, both z and x(z) approach zero simultaneously, which can cause floating-point roundoff errors in naive implementations. By expanding the ratio into a Taylor series when |z| < 1e-5, the engine eliminates division by zero and preserves double-precision accuracy across all strikes.",
'''

p3_code_insert = '''        "Furthermore, quantitative research proves that calendar spread arbitrage frequently emerges when independent SABR models are fitted to adjacent tenors without inter-tenor smoothing. If market makers do not enforce global cross-maturity constraints, the short-dated total variance can exceed long-dated variance during volatile macro announcements, creating negative forward variances that expose the desk to catastrophic multi-leg exploitation.",
'''

p4_code_insert = '''        "Mathematical analysis of the Steffen monotonic interpolation algorithm reveals why it is uniquely suited for volatility surface construction: unlike traditional natural cubic splines which enforce continuous second derivatives (C2 continuity), Steffen splines enforce first-derivative continuity (C1) while restricting the slope at each knot to prevent local extrema between data points. This guarantees that if market implied variance is strictly increasing across expiration tenors, the interpolated variance curve will never dip downwards, completely eliminating calendar spread arbitrage.",
        "In modern low-latency C++ implementations, the 2D surface interpolator is structured as an immutable, cache-aligned data matrix. When a background calibration thread fits updated SABR parameters or spline knots, it constructs a complete new surface instance in off-path memory. Once verified against all arbitrage invariants, the new surface pointer is swapped into production using an atomic pointer exchange (std::atomic<SurfaceSnapshot*>). The execution threads reading option prices experience zero lock contention and zero memory stalls, achieving deterministic nanosecond pricing.",
'''

p5_code_insert = '''        "Under FINRA Rule 5210, automated trading systems must maintain rigorous supervisory controls preventing the propagation of erroneous market data into public quotations. The streaming ingestion pipeline incorporates dual-ring telemetry logging: every incoming quote tick and its associated outlier score are written to a lock-free circular ring buffer shared with the real-time compliance monitor. If more than 5 anomalous ticks arrive within a 100-millisecond rolling window, the engine automatically flags a market data feed anomaly.",
        "Furthermore, during fast market conditions such as non-farm payroll releases or interest rate decisions, exchange feeds can experience brief packet re-ordering. The ingestion pipeline tracks sequential exchange timestamps, rejecting out-of-order ticks that could distort the fitted volatility curve. This temporal integrity check ensures that the calibrated surface reflects the true current state of the order book, preventing stale quote exploitation.",
'''

# Insert into p2_say
idx2 = text.find('        "By enforcing strict boundary checks on Rho and Nu')
if idx2 != -1:
    text = text[:idx2] + p2_code_insert + text[idx2:]

# Insert into p3_say
idx3 = text.find('        "In addition, the arbitrage scanner evaluates the asymptotic wing')
if idx3 != -1:
    text = text[:idx3] + p3_code_insert + text[idx3:]

# Insert into p4_say
idx4 = text.find('        "Rigorous stress testing confirms that the monotonic surface engine')
if idx4 != -1:
    text = text[:idx4] + p4_code_insert + text[idx4:]

# Insert into p5_say
idx5 = text.find('        "Furthermore, the pipeline records high-resolution telemetry on all rejected ticks')
if idx5 != -1:
    text = text[:idx5] + p5_code_insert + text[idx5:]

with open('scripts/generate_quant_day34.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated scripts/generate_quant_day34.py successfully.')
