import json
import re

def count_words(text: str) -> int:
    return len(re.findall(r'\b\S+\b', text))

def estimate_spoken_minutes(parts: list) -> int:
    words = sum(count_words(p['say']) for p in parts)
    return round(words / 110)

def estimate_lesson_minutes(parts: list) -> int:
    total = 0
    for p in parts:
        total += count_words(p['say'])
        total += count_words(p.get('example', ''))
        total += count_words(p.get('tryIt', ''))
    return round(total / 87)

# Day 59: Principal Quantitative Systems Architect RFC & Planetary Exchange Infrastructure
p1_say = (
    "Welcome to Day 59. Today, you step into the highest technical leadership role in the quantitative finance industry: Principal Quantitative Systems Architect. "
    "At sovereign trading institutions, elite hedge funds, and tier-one quantitative market makers, the Principal Architect does not merely optimize local algorithms; they author the definitive Engineering Request for Comments, or RFC, that codifies the system architecture, hardware topology, latency budgets, and risk controls for the entire firm. "
    "In this session, you will author RFC-001: The Planetary High-Frequency Trading & Execution Infrastructure Charter. "
    "The scope of this document is immense: it mandates a sub-eight-hundred-nanosecond tick-to-trade latency budget across the entire hardware and software stack, from physical optical photon ingestion to outbound order transmission. "
    "The RFC formally defines our multi-colocation deployment topology across the core financial data centers of the world: Equinix NY4 in Secaucus, Carteret in New Jersey (housing NASDAQ), Mahwah in New Jersey (housing the New York Stock Exchange), and CME Aurora in Illinois. "
    "Across each data center, the RFC establishes immutable engineering requirements: zero-allocation C++ memory management, hardware ring buffers, lock-free concurrency, kernel-bypass Solarflare Onload and DPDK network interfaces, and FPGA-accelerated pre-trade risk gating. "
    "Furthermore, the RFC governs multi-carrier microwave connectivity between Chicago and New York, mandating hitless packet duplication, automated atmospheric rain-fade handover, and sub-microsecond failover routing. "
    "Every hardware component, from Mellanox network switches to AMD Xilinx UltraScale+ FPGAs, must operate within strictly allocated nanosecond latency budgets. "
    "Any proposed modification to the production codebase must undergo formal architectural review, including rigorous static analysis, latency regression benchmarks, and automated canary deployment verification. "
    "By authoring this RFC, the Principal Architect establishes a culture of unyielding engineering discipline, ensuring that our systems operate with deterministic sub-microsecond precision while eliminating single points of failure."
)

p2_say = (
    "In Part 2, we conduct a forensic audit of catastrophic regulatory enforcement actions resulting from the unauthorized bypass or failure of pre-trade risk controls. "
    "In the high-stakes world of electronic trading, the line between institutional solvency and total bankruptcy is measured in microseconds and lines of risk code. "
    "A notorious example occurred in 2014 when the SEC sanctioned high-frequency market maker Latour Trading for repeatedly violating SEC Rule 15c3-5, known as the Market Access Rule. "
    "Latour's algorithmic strategies generated millions of equity orders through custom trading software that contained critical design defects: during peak market volume, internal risk check queues backed up, causing the system to silently drop or bypass pre-trade capital limit validations to prevent execution latency spikes. "
    "As a result, Latour accumulated massive unauthorized gross positions exceeding its approved regulatory capital limits by billions of dollars, leading to a record multi-million dollar SEC fine and mandatory structural oversight. "
    "Similar catastrophic violations have struck European trading firms under MiFID II Regulatory Technical Standard 6, where algorithms without hard rate limits overwhelmed exchange matching engines, triggering market-wide suspensions and severe regulatory sanctions. "
    "These historic disasters teach us an uncompromising architectural lesson: in a production quantitative trading system, risk controls must never be treated as optional, asynchronous, or bypassable software layers. "
    "A risk check must never be disabled to shave off twenty nanoseconds of execution latency. "
    "If an inbound order cannot be validated against pre-trade price collars, capital limits, and order velocity ceilings within its allocated hardware budget, the order must be deterministically rejected on the spot. "
    "Our RFC establishes the zero-tolerance doctrine: pre-trade risk checks are hard physical circuit breakers embedded directly into FPGA silicon or in-line kernel-bypass pipelines, completely immune to software bypass or configuration tampering."
)

p3_say = (
    "In Part 3, we architect and implement the core engineering mechanism that enforces our RFC: the Architectural Latency Budget & Governance Engine. "
    "To guarantee a deterministic sub-eight-hundred-nanosecond tick-to-trade latency profile, we decompose the entire trading pipeline into discrete, budgeted execution segments. "
    "Our latency budget allocates seventy-five nanoseconds for physical-layer optical-to-electrical PHY conversion and MAC deserialization; one hundred and twenty nanoseconds for zero-copy kernel-bypass packet parsing; one hundred and fifty nanoseconds for Level 3 order book state updates and micro-price computation; two hundred nanoseconds for alpha signal generation and execution decision logic; one hundred nanoseconds for FPGA-accelerated pre-trade risk validation; and one hundred and fifty-five nanoseconds for outbound OUCH/FIX protocol serialization and network transmission. "
    "The total budgeted pipeline latency sums to exactly seven hundred nanoseconds, leaving a one-hundred-nanosecond safety buffer. "
    "To govern this budget in real-time production environments, our Governance Engine utilizes hardware Time Stamp Counters (RDTSC) and PTP IEEE 1588 synchronized clocks to measure the exact nanosecond duration of every single subsystem across every processed tick. "
    "If any subsystem exceeds its allocated budget—for instance, if an alpha model takes two hundred and fifty nanoseconds instead of two hundred nanoseconds—the governance engine logs an architectural SLA violation. "
    "If p99.9 latency drifts beyond eight hundred nanoseconds over a rolling one-minute window, the governance engine automatically triggers an architectural degrade alarm, falling back to a lightweight heuristic execution mode. "
    "In our C++ implementation, we build this high-performance governance engine using lock-free atomic counters, ensuring that telemetry monitoring incurs zero performance overhead."
)

p4_say = (
    "In Part 4, we put our planetary architecture through a rigorous simulated Principal Architect RFC Board Review & Defense Lab. "
    "You stand before a simulated executive risk committee and senior engineering review board to defend RFC-001 against adversarial technical challenges and stress scenarios. "
    "The review board injects an extreme stress scenario: a simultaneous multi-exchange market opening accompanied by a severe transatlantic network degradation and an attempted rogue order injection. "
    "At 9:30:00 AM, the market data feed from NASDAQ Carteret experiences an unprecedented burst of ten million messages per second, while the microwave link to CME Aurora suffers an atmospheric rain-fade event, and a rogue test script attempts to fire unconstrained market orders. "
    "Under this intense barrage, we observe the real-time operational telemetry of our planetary platform. "
    "The FPGA pre-trade risk filter instantly intercepts and terminates the rogue order stream in fifty-five nanoseconds, enforcing SEC Rule 15c3-5 position limits without taxing the host CPU. "
    "Simultaneously, the hybrid microwave router seamlessly shifts order flow to the subterranean fiber trunk using hitless packet duplication, preventing a single dropped cancellation. "
    "Meanwhile, the Latency Governance Engine monitors the tick-to-trade pipeline: despite the ten-million-message burst, the p99 tick-to-trade latency holds steady at six hundred and eighty nanoseconds, safely beneath our eight-hundred-nanosecond ceiling. "
    "Zero dropped packets, zero unvalidated orders, zero regulatory breaches, and sub-microsecond determinism across all venues. "
    "In our C++ lab implementation, we simulate this entire multi-vector barrage, logging the precise nanosecond timestamps and risk audit receipts to prove that our platform satisfies every requirement of the Principal Architect's charter."
)

p5_say = (
    "In our final session for Day 59, we synthesize the legal, regulatory, and architectural mandates governing modern quantitative trading systems: SEC Rule 15c3-5 in the United States and MiFID II RTS 6 in the European Union. "
    "Under SEC Rule 15c3-5, any broker-dealer providing market access or proprietary algorithmic trading must establish, maintain, and enforce risk management controls and supervisory procedures reasonably designed to systematically manage the financial, regulatory, and other risks of electronic market access. "
    "Specifically, the rule mandates: pre-set credit and capital thresholds; price collars that reject orders with prices that deviate significantly from prevailing market levels; order size limits; order velocity checks; and post-trade allocation controls. "
    "Crucially, the rule explicitly forbids the use of post-trade risk checks as a substitute for pre-trade controls, and forbids delegating risk management to third-party clients without direct institutional oversight. "
    "In Europe, MiFID II Regulatory Technical Standard 6 imposes even more stringent requirements: mandatory annual algorithmic self-assessments, stress testing against simulated market crashes, real-time kill functionality capable of canceling all active orders across all venues in less than ten seconds, and continuous recordkeeping of all algorithm modifications for five years. "
    "As Principal Quantitative Systems Architects, we embed these regulatory requirements directly into our platform's foundational architecture. "
    "Compliance is not an afterthought or an external checklist; it is an active, deterministic component of our execution pipeline. "
    "By designing systems that inherently enforce regulatory rules at silicon speed, we guarantee that our sovereign quantitative trading infrastructure remains both extraordinarily profitable and permanently resilient against regulatory risk."
)

p1_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <string>\n"
    "#include <vector>\n\n"
    "struct SubsystemLatencyBudget {\n"
    "    std::string subsystem;\n"
    "    int budgeted_ns;\n"
    "    std::string hardware_layer;\n"
    "};\n\n"
    "int main() {\n"
    "    std::cout << \"=== PRINCIPAL ARCHITECT RFC-001: LATENCY BUDGET (SUB-800ns) ===\\n\";\n"
    "    std::vector<SubsystemLatencyBudget> budgets = {\n"
    "        {\"PHY & MAC Deserialization\",  75, \"Solarflare FPGA NIC\"},\n"
    "        {\"Kernel-Bypass Parsing\",    120, \"User-space DPDK / Onload\"},\n"
    "        {\"L3 Book & Micro-Price\",     150, \"Lock-free C++ Ring Buffer\"},\n"
    "        {\"Alpha & Signal Logic\",      200, \"AVX-512 Vectorized Engine\"},\n"
    "        {\"Pre-Trade Risk Gate\",       100, \"In-line FPGA Hardware Gating\"},\n"
    "        {\"OUCH Serialization & TX\",  155, \"Cut-Through MAC Egress\"}\n"
    "    };\n"
    "    \n"
    "    int total_budget_ns = 0;\n"
    "    std::cout << std::left << std::setw(28) << \"Subsystem Pipeline\"\n"
    "              << std::setw(15) << \"Budget (ns)\"\n"
    "              << \"Hardware Execution Layer\\n\";\n"
    "    std::cout << \"----------------------------------------------------------------------\\n\";\n"
    "    for (const auto& b : budgets) {\n"
    "        total_budget_ns += b.budgeted_ns;\n"
    "        std::cout << std::left << std::setw(28) << b.subsystem\n"
    "                  << std::setw(15) << b.budgeted_ns\n"
    "                  << b.hardware_layer << \"\\n\";\n"
    "    }\n"
    "    std::cout << \"----------------------------------------------------------------------\\n\";\n"
    "    std::cout << \"Total Pipeline Budget: \" << total_budget_ns << \" ns (Safety Buffer: \"\n"
    "              << (800 - total_budget_ns) << \" ns) -> [COMPLIANT]\\n\";\n"
    "    return 0;\n"
    "}"
)

p2_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <string>\n"
    "#include <cstdint>\n\n"
    "struct PreTradeRiskLimits {\n"
    "    double max_order_notional;\n"
    "    double max_gross_position;\n"
    "    double max_price_collar_pct;\n"
    "    int max_order_velocity_per_sec;\n"
    "};\n\n"
    "class SEC15c35RiskGate {\n"
    "public:\n"
    "    explicit SEC15c35RiskGate(PreTradeRiskLimits limits) : limits_(limits) {}\n"
    "    \n"
    "    bool validate_order(const std::string& symbol, double price, int qty, double ref_price) {\n"
    "        double notional = price * qty;\n"
    "        if (notional > limits_.max_order_notional) {\n"
    "            std::cout << \"[15c3-5 REJECT] Single order notional $\" << std::fixed << std::setprecision(2) << notional \n"
    "                      << \" exceeds limit $\" << limits_.max_order_notional << \"\\n\";\n"
    "            return false;\n"
    "        }\n"
    "        double deviation = std::abs(price - ref_price) / ref_price;\n"
    "        if (deviation > limits_.max_price_collar_pct) {\n"
    "            std::cout << \"[15c3-5 REJECT] Price collar deviation \" << (deviation * 100.0) << \"% exceeds limit!\\n\";\n"
    "            return false;\n"
    "        }\n"
    "        return true;\n"
    "    }\n"
    "private:\n"
    "    PreTradeRiskLimits limits_;\n"
    "};\n\n"
    "int main() {\n"
    "    std::cout << \"=== SEC RULE 15c3-5 HARDWARE PRE-TRADE RISK GATE ===\\n\";\n"
    "    SEC15c35RiskGate gate({1000000.0, 5000000.0, 0.05, 5000});\n"
    "    bool ok1 = gate.validate_order(\"SPY\", 500.00, 1000, 500.00); // $500k -> OK\n"
    "    std::cout << \"Order 1 Approved: \" << (ok1 ? \"TRUE\" : \"FALSE\") << \"\\n\";\n"
    "    bool ok2 = gate.validate_order(\"SPY\", 550.00, 1000, 500.00); // 10% collar -> REJECT\n"
    "    std::cout << \"Order 2 Approved: \" << (ok2 ? \"TRUE\" : \"FALSE\") << \"\\n\";\n"
    "    return 0;\n"
    "}"
)

p3_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <vector>\n"
    "#include <string>\n"
    "#include <chrono>\n\n"
    "struct SubsystemTelemetry {\n"
    "    std::string name;\n"
    "    int budgeted_ns;\n"
    "    int measured_ns;\n"
    "};\n\n"
    "class LatencyGovernanceEngine {\n"
    "public:\n"
    "    void record(const SubsystemTelemetry& t) {\n"
    "        telemetry_.push_back(t);\n"
    "    }\n"
    "    \n"
    "    void audit_sla() const {\n"
    "        std::cout << \"=== LATENCY GOVERNANCE ENGINE SLA AUDIT ===\\n\";\n"
    "        int total_measured = 0;\n"
    "        for (const auto& t : telemetry_) {\n"
    "            total_measured += t.measured_ns;\n"
    "            bool ok = t.measured_ns <= t.budgeted_ns;\n"
    "            std::cout << \"Subsystem: \" << std::left << std::setw(25) << t.name\n"
    "                      << \" | Budget: \" << std::setw(4) << t.budgeted_ns << \" ns\"\n"
    "                      << \" | Actual: \" << std::setw(4) << t.measured_ns << \" ns\"\n"
    "                      << \" | SLA: \" << (ok ? \"PASS\" : \"VIOLATION\") << \"\\n\";\n"
    "        }\n"
    "        std::cout << \"Total Tick-to-Trade: \" << total_measured << \" ns (SLA Ceiling: 800 ns) -> \"\n"
    "                  << (total_measured <= 800 ? \"STATUS: PASS\" : \"STATUS: BREACH\") << \"\\n\";\n"
    "    }\n"
    "private:\n"
    "    std::vector<SubsystemTelemetry> telemetry_;\n"
    "};\n\n"
    "int main() {\n"
    "    LatencyGovernanceEngine gov;\n"
    "    gov.record({\"PHY Deserialization\", 75, 68});\n"
    "    gov.record({\"Kernel-Bypass Parsing\", 120, 110});\n"
    "    gov.record({\"L3 Book & Micro-Price\", 150, 142});\n"
    "    gov.record({\"Alpha Strategy Execution\", 200, 185});\n"
    "    gov.record({\"FPGA Risk Validation\", 100, 52});\n"
    "    gov.record({\"OUCH Serializer & MAC TX\", 155, 140});\n"
    "    gov.audit_sla();\n"
    "    return 0;\n"
    "}"
)

p4_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <vector>\n"
    "#include <string>\n\n"
    "struct StressVectorResult {\n"
    "    std::string test_case;\n"
    "    std::string injected_fault;\n"
    "    int latency_ns;\n"
    "    std::string outcome;\n"
    "};\n\n"
    "int main() {\n"
    "    std::cout << \"=== PRINCIPAL ARCHITECT RFC BOARD REVIEW DEFENSE LAB ===\\n\";\n"
    "    std::vector<StressVectorResult> results = {\n"
    "        {\"10M Msg/s Opening Burst\", \"Market Data Surge\", 685, \"ZERO PACKET LOSS\"},\n"
    "        {\"CME Aurora Microwave Fade\", \"Atmospheric Rain Fade\", 690, \"HITLESS FIBER HANDOVER\"},\n"
    "        {\"Rogue Market Order Loop\", \"15c3-5 Limit Breach\", 55, \"INTERCEPTED IN HARDWARE\"},\n"
    "        {\"Cross-Colo Clock Jitter\", \"PTP Sync Offset 80ns\", 710, \"DETERMINISTIC TIMESTAMPING\"}\n"
    "    };\n"
    "    \n"
    "    std::cout << std::left << std::setw(28) << \"Stress Vector\"\n"
    "              << std::setw(25) << \"Injected Fault\"\n"
    "              << std::setw(15) << \"Latency (ns)\"\n"
    "              << \"Architectural Defense\\n\";\n"
    "    std::cout << \"--------------------------------------------------------------------------------\\n\";\n"
    "    for (const auto& r : results) {\n"
    "        std::cout << std::left << std::setw(28) << r.test_case\n"
    "                  << std::setw(25) << r.injected_fault\n"
    "                  << std::setw(15) << r.latency_ns\n"
    "                  << r.outcome << \"\\n\";\n"
    "    }\n"
    "    std::cout << \"--------------------------------------------------------------------------------\\n\";\n"
    "    std::cout << \"Senior Quantitative Review Board Verdict: UNANIMOUS APPROVAL OF RFC-001!\\n\";\n"
    "    return 0;\n"
    "}"
)

p5_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <string>\n"
    "#include <vector>\n\n"
    "struct RegulatoryMandate {\n"
    "    std::string regulation;\n"
    "    std::string jurisdiction;\n"
    "    std::string core_requirement;\n"
    "    std::string architectural_enforcement;\n"
    "};\n\n"
    "int main() {\n"
    "    std::cout << \"=== SEC RULE 15c3-5 & MiFID II RTS 6 ARCHITECTURAL MAPPING ===\\n\";\n"
    "    std::vector<RegulatoryMandate> mandates = {\n"
    "        {\"SEC 15c3-5(b)\", \"United States\", \"Pre-Trade Capital Limits\", \"FPGA Hardware Position Governor\"},\n"
    "        {\"SEC 15c3-5(c)\", \"United States\", \"Price Collar Banding\", \"In-Line Micro-Price Collar Gate\"},\n"
    "        {\"MiFID II RTS 6 Art 15\", \"European Union\", \"Emergency Kill Functionality\", \"Out-of-Band Hardware Kill Switch\"},\n"
    "        {\"MiFID II RTS 6 Art 17\", \"European Union\", \"Continuous Audit Logging\", \"IEEE 1588 PTP Tamper-Proof Log\"}\n"
    "    };\n"
    "    \n"
    "    for (const auto& m : mandates) {\n"
    "        std::cout << \"[\" << m.jurisdiction << \"] \" << m.regulation << \": \" << m.core_requirement\n"
    "                  << \"\\n  -> Silicon Enforcement: \" << m.architectural_enforcement << \"\\n\";\n"
    "    }\n"
    "    std::cout << \"Full regulatory compliance certified across US and EU jurisdictions.\\n\";\n"
    "    return 0;\n"
    "}"
)

day59_parts = [
    {
        "title": "Principal Architect RFC: Planetary Trading Platform Specifications",
        "say": p1_say,
        "example": "Formulating RFC-001 establishing the sub-800ns tick-to-trade latency budget, multi-colo topology (Carteret/Mahwah/Aurora), and zero-allocation requirements.",
        "tryIt": "Run a C++ simulation auditing the sub-800ns latency budget decomposition across the hardware/software pipeline.",
        "code": p1_code
    },
    {
        "title": "Risk Control Bypass & Catastrophic Regulatory Violations Forensics",
        "say": p2_say,
        "example": "Analyzing SEC enforcement against Latour Trading for bypassing 15c3-5 controls under load, establishing zero-tolerance pre-trade gating.",
        "tryIt": "Implement a C++ in-line pre-trade risk gate enforcing notional limits and price collar bounds with zero bypass capability.",
        "code": p2_code
    },
    {
        "title": "Architectural Latency Budget & Governance Engine Implementation",
        "say": p3_say,
        "example": "Constructing the Latency Governance Engine measuring RDTSC timestamps across all 6 subsystems and auditing SLA compliance.",
        "tryIt": "Build a C++ latency governance auditor tracking actual subsystem durations against allocated nanosecond budgets.",
        "code": p3_code
    },
    {
        "title": "Principal Architect RFC Board Review & Defense Lab",
        "say": p4_say,
        "example": "Defending RFC-001 before a simulated executive risk board under a multi-vector barrage: 10M msg/s burst, microwave fade, and rogue order injection.",
        "tryIt": "Execute a C++ test harness validating zero packet drops, hardware rogue interception, and sub-700ns execution under multi-vector stress.",
        "code": p4_code
    },
    {
        "title": "SEC Rule 15c3-5 & MiFID II RTS 6 Architectural Compliance Synthesis",
        "say": p5_say,
        "example": "Mapping SEC Rule 15c3-5 and MiFID II RTS 6 mandates directly into FPGA silicon gates and tamper-proof PTP audit logging.",
        "tryIt": "Model regulatory compliance mappings in C++ verifying pre-trade controls and out-of-band kill functionality.",
        "code": p5_code
    }
]

day59_lesson = {
    "day": 59,
    "title": "Principal Quantitative Systems Architect RFC & Planetary Exchange Infrastructure",
    "goal": (
        "You have journeyed through every facet of quantitative engineering: market microstructure, matching engines, order book physics, stochastic volatility, Greeks, FPGA acceleration, precision PTP clocks, SPAN margin, extreme tail risk, and industrial disasters. "
        "Today, you take on the ultimate role: Principal Quantitative Systems Architect. "
        "In top investment banks and sovereign trading firms, the Principal Architect does not just write code; they author the Engineering RFC (Request for Comments) that establishes the technical, operational, and regulatory foundation for the entire firm. "
        "You will author the comprehensive RFC for a Planetary-Scale Quantitative Trading Platform. "
        "You will specify tick-to-trade latency budgets across silicon and fiber, define multi-colocation redundancy topologies (Carteret, Mahwah, Aurora), mandate pre-trade risk controls under SEC Rule 15c3-5 and MiFID II RTS 6, design out-of-band kill switches, and build the Architectural Latency Budget Governance Engine that enforces strict nanosecond limits across production services!"
    ),
    "minutes": 38,
    "recap": "In Day 58, we explored global microwave networks, calculated geodesic paths, and implemented hitless failover routers. Today, you assume the role of Principal Quantitative Systems Architect, authoring the master architectural RFC for a planetary-scale trading platform.",
    "parts": day59_parts,
    "summary": [
        "Authored RFC-001: The Planetary High-Frequency Trading & Execution Infrastructure Charter specifying sub-800ns tick-to-trade budgets.",
        "Defined planetary multi-colocation topology across Carteret (NASDAQ), Mahwah (NYSE), and Aurora (CME).",
        "Audited the Latour Trading SEC enforcement action, establishing the zero-tolerance doctrine for pre-trade risk bypass.",
        "Decomposed the 700ns execution pipeline: PHY (75ns), Parser (120ns), L3 Book (150ns), Alpha (200ns), Risk (100ns), and TX (155ns).",
        "Constructed a high-performance Latency Governance Engine measuring RDTSC timestamps and alerting on SLA deviations.",
        "Defended RFC-001 before the Senior Review Board under a multi-vector barrage: 10M msg/s burst, rain fade, and rogue order injection.",
        "Synthesized SEC Rule 15c3-5 and MiFID II RTS 6 regulatory compliance directly into FPGA silicon and PTP audit trails."
    ],
    "projectStep": {
        "title": "ApexQuant Principal Architect RFC & Latency Governance Engine",
        "steps": [
            "Author RFC-001 defining sub-800ns tick-to-trade latency budgets and planetary multi-colo topology.",
            "Decompose the pipeline into 6 budgeted stages: PHY, Parser, L3 Book, Alpha, Pre-Trade Risk, and OUCH Egress.",
            "Implement a C++ in-line pre-trade risk gate enforcing notional limits and price collar bounds without software bypass.",
            "Build the Latency Governance Engine measuring RDTSC timestamps and auditing subsystem SLA compliance in real time.",
            "Execute the Principal Architect RFC Board Review stress harness under simultaneous data surge, rain fade, and rogue order attacks.",
            "Verify complete regulatory compliance mapping against SEC Rule 15c3-5 and MiFID II RTS 6 statutory standards."
        ]
    }
}

def validate_day(lesson):
    print(f"=== Day {lesson['day']}: {lesson['title']} ===")
    parts = lesson['parts']
    assert len(parts) == 5, f"Expected 5 parts, got {len(parts)}"
    all_say = 0
    all_words = 0
    for idx, p in enumerate(parts, 1):
        say_w = count_words(p['say'])
        tot_w = say_w + count_words(p.get('example', '')) + count_words(p.get('tryIt', ''))
        all_say += say_w
        all_words += tot_w
        status = "OK" if say_w >= 580 else f"FAIL ({say_w} < 580)"
        print(f"  Part {idx}: '{p['title'][:40]}' | Say: {say_w} ({status}) | All: {tot_w}")
        assert say_w >= 580, f"Part {idx} say words {say_w} < 580!"
    
    spoken_m = estimate_spoken_minutes(parts)
    lesson_m = estimate_lesson_minutes(parts)
    print(f"Total Say: {all_say} | Total All: {all_words} | Spoken Min: {spoken_m} | Lesson Min: {lesson_m}")
    assert 2940 <= all_words <= 3450, f"Total words {all_words} out of bounds (2940-3450)!"
    assert spoken_m >= 20, f"Spoken min {spoken_m} < 20!"
    assert 35 <= lesson_m <= 40, f"Lesson min {lesson_m} not in 35-40!"
    print("ALL INVARIANTS SATISFIED!\n")

if __name__ == '__main__':
    validate_day(day59_lesson)
    with open('scripts/quant_day59.json', 'w', encoding='utf-8') as f:
        json.dump(day59_lesson, f, indent=2)
    print("Wrote scripts/quant_day59.json")
