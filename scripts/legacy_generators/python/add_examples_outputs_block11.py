# scripts/add_examples_outputs_block11.py
import json
import os
import sys

metadata = {
    51: [
        ("An international airline passenger luggage barcode tracking system.", "[Trace Engine] Root span generated, 3 child spans linked, Total duration: 420ms"),
        ("An international registered diplomatic pouch stamped with standardized customs transit manifests.", "[W3C Context] Parsed traceparent valid, Baggage user-id=u-9921 propagated"),
        ("A municipal postal mail collection blue box on a suburban street corner.", "[Batch Processor] Buffered 50 spans, Threshold reached, Batch exported via OTLP"),
        ("An airport customs high-risk screening and quarantine inspection lane.", "[Tail Sampler] 100% error spans retained, 99% healthy spans pruned, Saved 92% storage"),
        ("An air traffic control radar and flight recorder diagnostic replay suite.", "[Trace Audit] 10,000,000 spans analyzed, Critical path bottleneck isolated at 460ms")
    ],
    52: [
        ("An international diplomatic motorcade accompanied by armed presidential security escort vehicles.", "[Envoy Sidecar] Transparent proxy intercept active, Target: payment-service:8080"),
        ("An ultra-secure military command fortress equipped with biometric iris scanners and cryptographic keycards.", "[mTLS Zero-Trust] SPIFFE identity verified: spiffe://cluster.local/ns/prod/sa/checkout"),
        ("An automated city highway toll gantry directing traffic across variable toll lanes.", "[Traffic Shifter] Canary weight: 10%, Stable weight: 90%, In-flight connections drained"),
        ("A hospital emergency room triage nurse isolating patients exhibiting contagious symptoms.", "[Outlier Detector] Consecutive errors: 3, Endpoint 10.0.1.42 ejected for 30s"),
        ("A Formula One racing team telemetry diagnostic center monitoring tire wear and engine pressure.", "[Mesh Audit] 50,000 req/sec verified, mTLS latency overhead: 1.2ms, Zero packet loss")
    ],
    53: [
        ("An automobile driver instrument dashboard with odometer, speedometer, and trip computer.", "[Prometheus Registry] Counter: 5, Gauge: 42, Histogram sum: 1520"),
        ("Shoe manufacturing sizing bins organizing inventory into standardized discrete foot-size bins.", "[Histogram Quantile] p90 latency estimated at 100ms across cumulative buckets"),
        ("A municipal water utility utility meter reader scanning electronic meters on a scheduled route.", "[OpenMetrics Exposition] # HELP http_requests_total, # TYPE counter, formatted 3 metrics"),
        ("A marathon runner's GPS watch calculating per-second running pace from cumulative distance.", "[PromQL Rate] Calculated velocity: 15 req/sec across 10s delta with reset compensation"),
        ("An automated aerospace flight control telemetry center recording altitude and engine pressure.", "[Metrics Audit] 500,000 samples/sec ingested, Gorilla TSDB compression: 1.37 B/sample")
    ],
    54: [
        ("Human medical vaccination administering weakened pathogens to build resilient antibodies.", "[Steady State] Baseline verified: errorRate < 1.0%, p99 < 200ms, Hypothesis holding"),
        ("A wind tunnel testing an airplane autopilot system against artificial turbulence and crosswinds.", "[Network Chaos] Injected 50ms latency, 10% packet drop simulated, Call recovered"),
        ("An emergency fire drill in a commercial office building testing alternate escape stairwells.", "[Pod Eviction] PodDisruptionBudget evaluated: minAvailable=2 enforced, Eviction allowed"),
        ("An electrical circuit breaker in a home basement panel tripping to prevent house fires.", "[Circuit Breaker] Consecutive failures reached 3, State: OPEN, Fallback returned"),
        ("An earthquake-resistant skyscraper dissipating seismic shock waves through tuned mass dampers.", "[Chaos Audit] 40,000 req/sec sustained, Blast radius: 2%, Recovery latency: 350ms")
    ],
    55: [
        ("The human autonomic nervous system regulating heart rate and temperature unconsciously.", "[MAPE-K Control] Telemetry signal evaluated: Signal healthy, Autonomous action: NOOP"),
        ("A hospital emergency room patient monitor synchronizing ECG waveforms and blood pressure.", "[Telemetry Fusion] Metric latency spike correlated to Exemplar Trace ID: tr-123"),
        ("High-speed railroad track switching diverting trains around broken rail segments.", "[Mesh Routing] Failing endpoint isolated, Traffic rebalanced: 100% to healthy replicas"),
        ("An automated submarine damage control system sealing bulkheads and pumping bilge water.", "[Self-Healing] Level 2 remediation executed: Pod restarted cleanly in 350ms"),
        ("An interplanetary deep-space probe diagnosing thruster jams autonomously billions of miles from Earth.", "[Capstone Certified] 100,000 req/sec verified, 380ms self-healing recovery, Zero errors")
    ]
}

for d in range(51, 56):
    py_path = f"scripts/dist_day{d}_data.py"
    loc = {}
    with open(py_path, "r", encoding="utf-8") as f:
        code_str = f.read()
    exec(compile(code_str, py_path, "exec"), loc)
    data = loc.get(f"DAY_{d}_DATA") or loc.get(f"day{d}_data")
    assert data, f"Data not found for day {d}"

    data["coursePrefix"] = "dist"
    data["course"] = "dist"

    for p_idx, part in enumerate(data["parts"]):
        ex, out = metadata[d][p_idx]
        part["example"] = ex
        part["output"] = out

    # Write back to dist_dayX_data.py
    with open(py_path, "w", encoding="utf-8") as f:
        f.write(f"# Dist Day {d} Data\nDAY_{d}_DATA = " + repr(data) + f"\nday{d}_data = DAY_{d}_DATA\n")
    print(f"Updated {py_path} with example and output fields.")

# Re-integrate into distributedWebLongLessons.ts
# First read distributedWebLongLessons.ts up to Day 50
ts_path = "src/lib/data/distributedWebLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Locate where day 51 begins
idx_51 = ts_content.find('  {\n    "day": 51,')
if idx_51 == -1:
    idx_51 = ts_content.find('{\n    "day": 51,')
if idx_51 == -1:
    idx_51 = ts_content.find('"day": 51')
    # find preceding '{'
    idx_51 = ts_content.rfind('{', 0, idx_51)

if idx_51 == -1:
    raise ValueError("Could not find day 51 in distributedWebLongLessons.ts")

# Find comma before day 51
comma_idx = ts_content.rfind(',', 0, idx_51)
clean_base = ts_content[:comma_idx].rstrip()

# Now load all 5 days fresh
formatted_days = []
for d in range(51, 56):
    py_path = f"scripts/dist_day{d}_data.py"
    loc = {}
    with open(py_path, "r", encoding="utf-8") as f:
        code_str = f.read()
    exec(compile(code_str, py_path, "exec"), loc)
    data = loc[f"DAY_{d}_DATA"]
    formatted_days.append(",\n" + json.dumps(data, indent=2))

new_ts_content = clean_base + "".join(formatted_days) + "\n];\n"
with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print("Successfully updated distributedWebLongLessons.ts with fully enriched Days 51-55!")
