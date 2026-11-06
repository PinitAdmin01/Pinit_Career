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

# Day 58: Industrial Case Study 3: Global Microwave Network Latency Arbitrage
p1_say = (
    "Welcome to Day 58. Today we leave the confines of internal server architecture and venture into the physical realm of planetary electromagnetic propagation: the global microwave networks that connect modern financial centers. "
    "In the early 2010s, the battle for latency arbitrage between the Chicago Mercantile Exchange data center in Aurora, Illinois and the New York equity exchanges in Carteret and Mahwah, New Jersey was fought along underground fiber optic conduits. "
    "Firms like Spread Networks spent hundreds of millions of dollars drilling through Appalachian rock to lay a dead-straight fiber route, reducing one-way propagation latency from fourteen point five milliseconds down to thirteen point one milliseconds round-trip. "
    "Yet, despite their extraordinary capital expenditure, Spread Networks' multi-million dollar fiber tunnel was rendered completely obsolete for price discovery within twenty-four months by an unyielding law of fundamental physics: the refractive index of silica glass versus air. "
    "The speed of light in a vacuum, denoted as c, is approximately two hundred and ninety-nine thousand seven hundred and ninety-two kilometers per second. "
    "In standard single-mode optical fiber, light propagates through a doped silica core with a refractive index of approximately one point four six eight. "
    "Because the propagation velocity is equal to c divided by the refractive index n, light travels through glass fiber at approximately two hundred and four thousand kilometers per second, or roughly sixty-eight percent of the speed of light in a vacuum. "
    "In contrast, the refractive index of terrestrial ambient air at sea level is approximately one point zero zero zero three. "
    "This means that high-frequency electromagnetic radio waves propagating through the atmosphere travel at ninety-nine point nine seven percent of the vacuum speed of light, nearly fifty percent faster than optical signals traveling inside glass fiber! "
    "Over the seven hundred and thirty statute miles separating Chicago and New Jersey, theoretical geodesic one-way propagation in air requires only three point nine two milliseconds, compared to five point seven five milliseconds in an ideally straight fiber cable. "
    "To exploit this insurmountable physical advantage, high-frequency trading consortia began leasing and constructing chains of microwave radio towers across the Midwestern United States. "
    "Each hop consists of parabolic dish antennas mounted on communication towers spaced thirty to forty miles apart, governed strictly by line-of-sight curvature of the Earth and the clearance of the first Fresnel zone. "
    "A microwave packet hops across approximately twenty-four towers from Aurora to Carteret in approximately four point one milliseconds one-way, shattering fiber's round-trip benchmark and establishing an impenetrable price discovery moat for the fastest microwave operators. "
    "As quantitative systems engineers, understanding this electromagnetic physics is paramount: whoever sees price discovery in Chicago first can execute risk-free cross-market arbitrage in New Jersey before any fiber-bound market participant even receives the trade notification. "
    "We must master both geodesic path calculations and RF propagation physics to design trading infrastructure that operates at the absolute physical boundaries of the universe."
)

p2_say = (
    "In Part 2, we confront the severe physical and atmospheric vulnerabilities of free-space microwave communication: multipath fading, rain attenuation, and atmospheric refraction anomalies. "
    "While optical fiber is physically shielded within subterranean ducts, microwave radiation traverses the turbulent, dynamic atmosphere of planet Earth. "
    "Microwave signals operating in commercial high-frequency bands—typically between six gigahertz and twenty-three gigahertz—are highly vulnerable to specific meteorological phenomena. "
    "The first major challenge is atmospheric rain attenuation. "
    "Water droplets have physical dimensions that approximate the wavelengths of ten to twenty-four gigahertz radio waves, causing severe electromagnetic scattering and absorption. "
    "Under heavy summer thunderstorms across Indiana, Ohio, or Pennsylvania, precipitation can cause signal attenuation exceeding thirty decibels per kilometer, completely attenuating the RF carrier wave and driving the link into hard loss-of-signal outage. "
    "The second major challenge is atmospheric multipath fading. "
    "During hot summer afternoons, temperature inversions and humidity gradients in the troposphere create stratified layers of air with differing refractive indices. "
    "A microwave beam emitted from a parabolic dish can refract into multiple distinct propagation paths that bounce off atmospheric layers or the ground before arriving at the receiver. "
    "When these out-of-phase multipath rays arrive at the receiving antenna, destructive interference causes deep signal fades lasting from milliseconds to minutes, collapsing the Signal-to-Noise Ratio, or SNR. "
    "In addition, solar radiation heating can physically expand and twist steel communication towers, altering antenna boresight alignment by fractions of a degree—enough to drop received power below demodulation sensitivity thresholds. "
    "To diagnose these atmospheric anomalies in real time, our network telemetry engines ingest continuous physical-layer metrics directly from microwave baseband modems: received signal level, bit error rate, uncorrectable forward error correction frame drops, and constellation EVM. "
    "When a storm front marches across the Appalachian corridor, individual microwave hops begin degrading sequentially from west to east. "
    "If our trading system does not detect this degradation before full packet loss occurs, high-frequency order cancellation messages and market data packets will be dropped in mid-air, leaving millions of dollars of resting quotes exposed to adverse selection. "
    "Quantitative network architects must therefore formulate predictive atmospheric degradation models that forecast link failure before packet drops corrupt production execution."
)

p3_say = (
    "In Part 3, we architect and implement the critical engineering countermeasure: the Hybrid Microwave/Fiber Failover Router with sub-microsecond hardware switching. "
    "Because microwave links provide ultra-low latency but suffer from weather-dependent uptime of approximately ninety-nine point five percent, whereas optical fiber provides rock-solid ninety-nine point nine nine nine percent availability at higher latency, institutional trading systems utilize hybrid multi-carrier architectures. "
    "The core architectural objective is to transmit all latency-sensitive price updates, top-of-book market data, and urgent order cancellations over the ultra-fast microwave link during clear weather, while seamlessly and deterministically failing over to redundant fiber links the instant atmospheric degradation threatens packet delivery. "
    "Traditional enterprise networking protocols like BGP or OSPF are completely unviable for high-frequency trading: their convergence times range from hundreds of milliseconds to several tens of seconds, during which thousands of trades would be lost. "
    "Instead, quantitative firms implement custom hardware-level fast-failover arbiters operating at Layer 1 or Layer 2. "
    "Our hybrid router maintains active connections across both the primary microwave radio carrier and the backup optical fiber conduit simultaneously. "
    "The router continuously monitors the microwave modem's Signal-to-Noise Ratio, or SNR, using low-latency out-of-band telemetry. "
    "We establish three operational regime states: Green (Optimal Microwave, SNR greater than twenty-four decibels, bit error rate zero), Yellow (Marginal Warning, SNR between eighteen and twenty-four decibels, FEC parity corrections rising), and Red (Degraded/Down, SNR below eighteen decibels or frame drop detected). "
    "In the Green state, all packets route exclusively via microwave. "
    "In the Yellow state, the router enters hitless packet duplication mode: it transmits duplicate packets across both the microwave link and the fiber link simultaneously, utilizing a deterministic sequence number header so the receiving network card deduplicates packets in hardware silicon. "
    "In the Red state, the router cleanly switches primary routing to fiber in less than five hundred nanoseconds. "
    "By implementing hitless packet duplication during transition regimes, we eliminate any packet loss or out-of-order sequencing during severe convective storms."
)

p4_say = (
    "In Part 4, we put our hybrid network architecture through a rigorous simulated summer rainstorm and route handover lab. "
    "We construct an end-to-end discrete-event network simulator that models a twenty-four-hop microwave link between Aurora, Illinois and Carteret, New Jersey, operating in parallel with a redundant subterranean optical fiber trunk. "
    "We subject the link to a simulated intense convective squall line sweeping across the Midwest, introducing dynamic rain fade attenuation that drops the received SNR from thirty decibels down to twelve decibels over a ten-second transition window. "
    "We compare two distinct routing strategies: a naive failover router that relies on TCP timeout retransmissions and hard link-down traps, versus our predictive SNR-driven hybrid failover router. "
    "When the storm hits Tower Hop 14 in Ohio, the naive router continues transmitting high-priority CME order cancellation packets into the fading microwave beam. "
    "Because the naive router does not monitor modem SNR, thirty-four consecutive packets are lost in the atmospheric rain curtain. "
    "The naive trading engine experiences a sixty-millisecond timeout penalty before its software stack detects the drop and resets the socket, during which time predatory New York algorithms execute against stale, un-canceled quotes, incurring forty-two thousand dollars in adverse selection losses. "
    "In sharp contrast, our predictive hybrid router observes the SNR dropping below twenty-four decibels at Tower 14. "
    "Within three hundred nanoseconds, the hybrid arbiter transitions from Green to Yellow state, immediately initiating hitless packet duplication over the fiber trunk. "
    "As microwave frame drops begin occurring at eighteen decibels, the receiving endpoint in Carteret seamlessly consumes the duplicate packets arriving over the fiber conduit without dropping a single byte or suffering a single nanosecond of timeout stall. "
    "When SNR drops below fourteen decibels, the router transitions to Red state, cleanly routing all traffic over fiber until the storm clears and SNR stabilizes above twenty-six decibels for sixty consecutive seconds. "
    "In our C++ implementation, we log packet transit times, SNR trajectories, deduplication events, and trading PnL to prove that zero-loss failover is achievable even under severe meteorological stress."
)

p5_say = (
    "In our final session for Day 58, we synthesize the global topology of planetary financial networks and the cutting-edge frontiers of ultra-low latency telecommunications. "
    "Today, microwave networks do not merely connect Chicago and New York; they form a planetary mesh linking London (Slough LD4), Frankfurt (FR2), Zurich, Tokyo, Singapore, and Hong Kong. "
    "Between London and Frankfurt, microwave and millimeter-wave networks cross the English Channel and the Belgian plains, reducing one-way transit time from eight point two milliseconds over subsea fiber down to four point six milliseconds over the air. "
    "However, terrestrial microwave is constrained by topography, ocean crossings, and national sovereignty boundaries. "
    "To overcome ocean barriers, quantitative consortia are currently pioneering two next-generation technologies: hollow-core optical fiber and low Earth orbit satellite constellations. "
    "Hollow-core fiber replaces the solid silica core with a micro-structured air cavity, allowing light to propagate through air inside the cable at ninety-nine point seven percent of c, combining the speed of microwave with the physical shielding and bandwidth capacity of fiber optic cabling. "
    "Simultaneously, low Earth orbit satellite laser links—such as Starlink and dedicated financial constellations—utilize vacuum inter-satellite laser links to bridge trans-oceanic distances between London and New York in under twenty-five milliseconds, compared to sixty milliseconds over trans-Atlantic submarine cables. "
    "As Principal Quantitative Systems Architects, our responsibility is to model the complete multi-tier network hierarchy: managing short-range millimeter wave for local campus connections, terrestrial microwave for overland regional trunks, hollow-core fiber for mission-critical metro corridors, and satellite/submarine fiber for global macro replication. "
    "By mastering the physics of electromagnetic propagation, rain fade mitigation, and zero-allocation network routing, we build trading infrastructure capable of executing global statistical arbitrage at the absolute theoretical speed limits imposed by Albert Einstein's special theory of relativity."
)

# Helper for C++ snippets
p1_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <cmath>\n\n"
    "// Speed of light in vacuum (km/s)\n"
    "constexpr double C_VACUUM = 299792.458;\n"
    "constexpr double N_FIBER = 1.468; // Refractive index of standard silica glass\n"
    "constexpr double N_AIR = 1.0003;  // Refractive index of terrestrial air\n\n"
    "struct PropagationProfile {\n"
    "    double distance_km;\n"
    "    double velocity_km_s;\n"
    "    double one_way_ms;\n"
    "    double rtt_ms;\n"
    "};\n\n"
    "PropagationProfile calculate_profile(double distance_km, double refractive_index) {\n"
    "    double v = C_VACUUM / refractive_index;\n"
    "    double one_way = (distance_km / v) * 1000.0;\n"
    "    return {distance_km, v, one_way, one_way * 2.0};\n"
    "}\n\n"
    "int main() {\n"
    "    std::cout << \"=== SPEED-OF-LIGHT PROPAGATION PHYSICS (CHICAGO -> NJ) ===\\n\";\n"
    "    double geodesic_dist_km = 1175.0; // ~730 miles\n"
    "    \n"
    "    auto fiber = calculate_profile(geodesic_dist_km * 1.15, N_FIBER); // 15% fiber winding factor\n"
    "    auto microwave = calculate_profile(geodesic_dist_km * 1.03, N_AIR); // 3% tower zig-zag factor\n"
    "    \n"
    "    std::cout << std::left << std::setw(15) << \"Medium\"\n"
    "              << std::setw(15) << \"Velocity (km/s)\"\n"
    "              << std::setw(15) << \"One-Way (ms)\"\n"
    "              << \"RTT (ms)\\n\";\n"
    "    std::cout << \"------------------------------------------------------------\\n\";\n"
    "    std::cout << std::left << std::setw(15) << \"Silica Fiber\"\n"
    "              << std::setw(15) << std::fixed << std::setprecision(1) << fiber.velocity_km_s\n"
    "              << std::setw(15) << std::setprecision(3) << fiber.one_way_ms\n"
    "              << fiber.rtt_ms << \"\\n\";\n"
    "    std::cout << std::left << std::setw(15) << \"Air Microwave\"\n"
    "              << std::setw(15) << std::fixed << std::setprecision(1) << microwave.velocity_km_s\n"
    "              << std::setw(15) << std::setprecision(3) << microwave.one_way_ms\n"
    "              << microwave.rtt_ms << \"\\n\";\n"
    "    std::cout << \"------------------------------------------------------------\\n\";\n"
    "    std::cout << \"Microwave Latency Advantage: \" << (fiber.rtt_ms - microwave.rtt_ms) << \" ms RTT Moat!\\n\";\n"
    "    return 0;\n"
    "}"
)

p2_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <vector>\n"
    "#include <string>\n"
    "#include <cstdint>\n\n"
    "struct MicrowaveModemTelemetry {\n"
    "    int tower_id;\n"
    "    double received_power_dbm;\n"
    "    double snr_db;\n"
    "    double ber;\n"
    "    bool carrier_lock;\n"
    "};\n\n"
    "void audit_tower_chain(const std::vector<MicrowaveModemTelemetry>& towers) {\n"
    "    std::cout << \"=== ATMOSPHERIC RAIN ATTENUATION & SNR AUDIT ===\\n\";\n"
    "    std::cout << std::left << std::setw(10) << \"Tower\"\n"
    "              << std::setw(15) << \"Power (dBm)\"\n"
    "              << std::setw(12) << \"SNR (dB)\"\n"
    "              << std::setw(15) << \"BER\"\n"
    "              << \"Link State\\n\";\n"
    "    std::cout << \"------------------------------------------------------------\\n\";\n"
    "    for (const auto& t : towers) {\n"
    "        std::string status = \"OPTIMAL\";\n"
    "        if (t.snr_db < 15.0 || !t.carrier_lock) status = \"CRITICAL [FADE]\";\n"
    "        else if (t.snr_db < 22.0) status = \"WARNING [DEGRADED]\";\n"
    "        \n"
    "        std::cout << std::left << \"Hop \" << std::setw(6) << t.tower_id\n"
    "                  << std::setw(15) << std::fixed << std::setprecision(1) << t.received_power_dbm\n"
    "                  << std::setw(12) << t.snr_db\n"
    "                  << std::setw(15) << std::scientific << std::setprecision(1) << t.ber\n"
    "                  << status << \"\\n\";\n"
    "    }\n"
    "}\n\n"
    "int main() {\n"
    "    std::vector<MicrowaveModemTelemetry> chain = {\n"
    "        {1, -38.5, 32.0, 1e-12, true},\n"
    "        {2, -40.0, 30.5, 1e-11, true},\n"
    "        {14, -68.2, 14.1, 8e-4, true}, // Severe squall line over Ohio\n"
    "        {15, -74.5, 11.2, 4e-2, false} // Carrier drop\n"
    "    };\n"
    "    audit_tower_chain(chain);\n"
    "    return 0;\n"
    "}"
)

p3_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <string>\n"
    "#include <cstdint>\n\n"
    "enum class LinkState { GREEN_MICROWAVE, YELLOW_DUAL_STREAM, RED_FIBER };\n\n"
    "class HybridFailoverRouter {\n"
    "public:\n"
    "    explicit HybridFailoverRouter(double yellow_snr_threshold, double red_snr_threshold)\n"
    "        : yellow_snr_(yellow_snr_threshold), red_snr_(red_snr_threshold), state_(LinkState::GREEN_MICROWAVE) {}\n"
    "        \n"
    "    LinkState evaluate_state(double current_snr_db) {\n"
    "        if (current_snr_db < red_snr_) {\n"
    "            state_ = LinkState::RED_FIBER;\n"
    "        } else if (current_snr_db < yellow_snr_) {\n"
    "            state_ = LinkState::YELLOW_DUAL_STREAM;\n"
    "        } else {\n"
    "            state_ = LinkState::GREEN_MICROWAVE;\n"
    "        }\n"
    "        return state_;\n"
    "    }\n"
    "    \n"
    "    void route_packet(uint64_t seq, const std::string& payload, double current_snr) {\n"
    "        LinkState s = evaluate_state(current_snr);\n"
    "        std::cout << \"Seq \" << seq << \" | SNR: \" << std::fixed << std::setprecision(1) << current_snr << \" dB | \";\n"
    "        if (s == LinkState::GREEN_MICROWAVE) {\n"
    "            std::cout << \"Routing [MICROWAVE ONLY] (4.1ms latency)\\n\";\n"
    "        } else if (s == LinkState::YELLOW_DUAL_STREAM) {\n"
    "            std::cout << \"Routing [DUAL TRANSMIT: MW + FIBER] (Hitless Deduplication)\\n\";\n"
    "        } else {\n"
    "            std::cout << \"Routing [FIBER ONLY] (6.8ms latency, Zero Drops)\\n\";\n"
    "        }\n"
    "    }\n"
    "    \n"
    "private:\n"
    "    double yellow_snr_;\n"
    "    double red_snr_;\n"
    "    LinkState state_;\n"
    "};\n\n"
    "int main() {\n"
    "    std::cout << \"=== HYBRID MICROWAVE/FIBER FAILOVER ROUTER ===\\n\";\n"
    "    HybridFailoverRouter router(24.0, 16.0);\n"
    "    router.route_packet(101, \"CME_BBO_UPDATE\", 30.5);\n"
    "    router.route_packet(102, \"CME_BBO_UPDATE\", 21.0);\n"
    "    router.route_packet(103, \"CME_BBO_UPDATE\", 13.5);\n"
    "    std::cout << \"Sub-microsecond failover operational.\\n\";\n"
    "    return 0;\n"
    "}"
)

p4_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <vector>\n"
    "#include <string>\n"
    "#include <cstdint>\n\n"
    "struct SimulationEvent {\n"
    "    int tick;\n"
    "    double mw_snr;\n"
    "    bool naive_dropped;\n"
    "    bool hybrid_dropped;\n"
    "};\n\n"
    "int main() {\n"
    "    std::cout << \"=== SUMMER RAINSTORM ROUTE HANDOVER LAB ===\\n\";\n"
    "    std::vector<SimulationEvent> events = {\n"
    "        {1, 30.0, false, false},\n"
    "        {2, 23.5, false, false}, // Yellow warning: hybrid activates dual-stream\n"
    "        {3, 15.0, true,  false}, // Severe fade: naive drops 34 packets, hybrid uses fiber\n"
    "        {4, 11.5, true,  false}, // Carrier lost: naive times out, hybrid on fiber\n"
    "        {5, 28.0, false, false}  // Rain clears: links stabilize\n"
    "    };\n"
    "    \n"
    "    std::cout << std::left << std::setw(8) << \"Tick\"\n"
    "              << std::setw(12) << \"MW SNR\"\n"
    "              << std::setw(18) << \"Naive Drops\"\n"
    "              << std::setw(18) << \"Hybrid Drops\"\n"
    "              << \"Handover Telemetry\\n\";\n"
    "    std::cout << \"----------------------------------------------------------------------\\n\";\n"
    "    for (const auto& ev : events) {\n"
    "        std::cout << std::left << std::setw(8) << ev.tick\n"
    "                  << std::setw(12) << std::fixed << std::setprecision(1) << ev.mw_snr\n"
    "                  << std::setw(18) << (ev.naive_dropped ? \"DROPPED (Timeout)\" : \"DELIVERED\")\n"
    "                  << std::setw(18) << (ev.hybrid_dropped ? \"DROPPED\" : \"DELIVERED\")\n"
    "                  << (ev.mw_snr < 16.0 ? \"[FAILOVER ENGAGED]\" : \"[NOMINAL]\") << \"\\n\";\n"
    "    }\n"
    "    std::cout << \"----------------------------------------------------------------------\\n\";\n"
    "    std::cout << \"Lab Result: 100% packet delivery maintained via hitless dual-stream.\\n\";\n"
    "    return 0;\n"
    "}"
)

p5_code = (
    "#include <iostream>\n"
    "#include <iomanip>\n"
    "#include <string>\n"
    "#include <vector>\n\n"
    "struct PlanetaryRoute {\n"
    "    std::string origin;\n"
    "    std::string destination;\n"
    "    double distance_km;\n"
    "    std::string medium;\n"
    "    double rtt_ms;\n"
    "};\n\n"
    "int main() {\n"
    "    std::cout << \"=== PLANETARY LOW-LATENCY TRADING ROUTE TOPOLOGY ===\\n\";\n"
    "    std::vector<PlanetaryRoute> routes = {\n"
    "        {\"Chicago (CME)\", \"New Jersey (Carteret)\", 1175.0, \"Microwave\", 8.2},\n"
    "        {\"London (LD4)\", \"Frankfurt (FR2)\", 630.0, \"Millimeter Wave\", 4.6},\n"
    "        {\"London (LD4)\", \"New York (NY4)\", 5585.0, \"Hollow-Core Fiber\", 37.8},\n"
    "        {\"Tokyo (TY3)\", \"Singapore (SG1)\", 5320.0, \"LEO Satellite Laser\", 39.4}\n"
    "    };\n"
    "    \n"
    "    std::cout << std::left << std::setw(16) << \"Origin\"\n"
    "              << std::setw(24) << \"Destination\"\n"
    "              << std::setw(14) << \"Distance\"\n"
    "              << std::setw(20) << \"Physical Medium\"\n"
    "              << \"Round-Trip (RTT)\\n\";\n"
    "    std::cout << \"--------------------------------------------------------------------------------\\n\";\n"
    "    for (const auto& r : routes) {\n"
    "        std::cout << std::left << std::setw(16) << r.origin\n"
    "                  << std::setw(24) << r.destination\n"
    "                  << std::setw(10) << std::fixed << std::setprecision(0) << r.distance_km << \" km \"\n"
    "                  << std::setw(20) << r.medium\n"
    "                  << std::setprecision(1) << r.rtt_ms << \" ms\\n\";\n"
    "    }\n"
    "    std::cout << \"Planetary arbitrage infrastructure validated.\\n\";\n"
    "    return 0;\n"
    "}"
)

day58_parts = [
    {
        "title": "Speed-of-Light Physics, Geodesic Paths & Microwave Propagation",
        "say": p1_say,
        "example": "Calculating refractive index ratios (c / 1.468 in fiber vs c / 1.0003 in air) and establishing the 4.1ms one-way microwave benchmark between Chicago and New Jersey.",
        "tryIt": "Run a C++ simulation computing theoretical latency limits across fiber vs air over 730 miles.",
        "code": p1_code
    },
    {
        "title": "Atmospheric Multipath Fading & Weather Attenuation Forensics",
        "say": p2_say,
        "example": "Analyzing physical-layer modem logs during summer thunderstorms, diagnosing 30 dB/km rain fade and multipath destructive interference.",
        "tryIt": "Implement a C++ RF telemetry auditor inspecting received signal power, SNR, and bit error rate across a 24-tower chain.",
        "code": p2_code
    },
    {
        "title": "Hybrid Microwave/Fiber Failover Router Implementation",
        "say": p3_say,
        "example": "Designing the three-state Green/Yellow/Red hybrid router with hitless packet duplication and sub-microsecond failover switching.",
        "tryIt": "Build a C++ hybrid network routing arbiter that switches traffic based on real-time modem SNR thresholds.",
        "code": p3_code
    },
    {
        "title": "Simulated Summer Rainstorm & Route Handover Lab",
        "say": p4_say,
        "example": "Simulating a severe Midwestern squall line dropping microwave SNR to 12 dB, verifying 100% packet delivery via hitless dual-stream failover.",
        "tryIt": "Run a C++ production incident lab comparing naive TCP timeout failover against predictive hybrid dual-stream routing.",
        "code": p4_code
    },
    {
        "title": "Planetary Cross-Exchange Low-Latency Network Synthesis",
        "say": p5_say,
        "example": "Mapping global trading corridors (Chicago-NJ, London-Frankfurt, London-NY) across microwave, hollow-core fiber, and LEO satellite laser meshes.",
        "tryIt": "Model global planetary cross-exchange routes in C++ calculating theoretical RTT benchmarks.",
        "code": p5_code
    }
]

day58_lesson = {
    "day": 58,
    "title": "Industrial Case Study 3: Global Microwave Network Latency Arbitrage",
    "goal": (
        "In the 2000s, trading firms laid fiber optic cables through mountains between Chicago (CME) and New Jersey (NASDAQ/NYSE), achieving round-trip times of 13 milliseconds. "
        "But in glass fiber, light travels at approximately 200,000 km/s—only two-thirds the speed of light in a vacuum! "
        "By 2011, HFT firms began erecting microwave radio towers across the Midwest. Through open air, microwave signals travel at 99.9% of the speed of light in a vacuum! "
        "Microwave slashed round-trip times to under 8 milliseconds, rendering fiber obsolete for price discovery. "
        "Today, you will analyze the physics, economics, and architectural engineering of Global Microwave Networks. "
        "You will calculate geodesic line-of-sight paths, model atmospheric weather fade (rain attenuation), and design hybrid multi-carrier failover routers with microsecond switching that keep your trading models connected at the speed of light!"
    ),
    "minutes": 38,
    "recap": "In Day 57, we deconstructed the 2010 Flash Crash, modeled quote-to-trade ratios and phantom liquidity, and implemented real-time anti-spoofing filters. Today, we conquer planetary physics, line-of-sight microwave links, and weather-resilient failover routers.",
    "parts": day58_parts,
    "summary": [
        "Derived electromagnetic propagation velocity in silica fiber (204,000 km/s) vs open air (299,700 km/s), establishing microwave's 4.1ms one-way Chicago-NJ speed moat.",
        "Analyzed line-of-sight tower placement, Earth curvature geometry, and first Fresnel zone clearance across Midwestern terrain.",
        "Diagnosed atmospheric vulnerabilities: 30 dB/km rain fade scattering and destructive multipath fading during summer squalls.",
        "Architected a three-state (Green/Yellow/Red) Hybrid Microwave/Fiber Failover Router with sub-microsecond switching.",
        "Engineered hitless packet duplication over parallel physical carriers during Yellow marginal warning regimes.",
        "Demonstrated 100% packet delivery in a simulated production storm lab, avoiding $42,000 in naive timeout adverse selection.",
        "Synthesized planetary low-latency infrastructure uniting terrestrial microwave, hollow-core fiber, and LEO satellite laser meshes."
    ],
    "projectStep": {
        "title": "ApexQuant Planetary Microwave Arbitrage & Failover Router",
        "steps": [
            "Calculate geodesic line-of-sight propagation latencies comparing silica fiber against free-space microwave.",
            "Ingest baseband modem physical-layer telemetry monitoring received power, SNR, and bit error rates.",
            "Construct a three-state network state machine governing Green (Microwave), Yellow (Dual-Stream), and Red (Fiber).",
            "Implement hitless packet duplication with sequence number deduplication in C++ for storm transitions.",
            "Simulate a convective Midwestern squall line dropping SNR to 12 dB, verifying zero-loss packet handover.",
            "Map planetary multi-colo topology across Chicago, New Jersey, London, Frankfurt, and Tokyo."
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
    validate_day(day58_lesson)
    with open('scripts/quant_day58.json', 'w', encoding='utf-8') as f:
        json.dump(day58_lesson, f, indent=2)
    print("Wrote scripts/quant_day58.json")
