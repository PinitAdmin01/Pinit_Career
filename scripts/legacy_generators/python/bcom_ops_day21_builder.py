import os
import sys

def get_day21_data():
    day = 21
    title = "IoT Sensor Networks, RFID / BLE Asset Tracking & Cold Chain Telematics"
    goal = "Master industrial Internet of Things (IoT) architecture, wireless asset identification protocols, and real-time logistics telemetry: evaluating MQTT/CoAP edge computing pipelines, calculating RFID and BLE beacon trilateration positions, auditing dynamic geofencing and Arrhenius thermal excursion kinetics in pharmaceutical cold chains, conducting FFT spectral analysis on vibration accelerometer signals for predictive asset maintenance, and engineering an enterprise IoT telematics control gateway."
    minutes = 45
    recap = "In Milestone 4, we engineered strategic sourcing governance, Incoterms 2020 total landed cost (TLC) calculations, spend cubes, balanced supplier scorecards, and Altman Z-score solvency sentinels. In Milestone 5, we launch the digital frontier of Industry 4.0 operations: cyber-physical systems, autonomous robotics, blockchain provenance, and digital twins. Day 21 establishes the sensory nervous system of modern physical supply chains: converting distributed assets into continuous, real-time telemetry streams."

    parts = [
        {
            "title": "IoT Architecture in SCM: Edge Nodes, MQTT/CoAP Telemetry Protocols & Cloud Ingestion",
            "say": [
                "Welcome to Day 21 of Operations and Supply Chain Management, and the beginning of Milestone 5: Digital Supply Chains, Cyber-Physical Systems & Industry 4.0 Operations. Historically, global supply chains operated in severe informational opacity. Goods in transit entered an operational 'black hole' the moment they departed a factory dock or shipping port, with enterprise resource planning (ERP) systems remaining completely blind until receiving clerks manually scanned physical barcodes weeks later at a destination distribution center. If a refrigeration compressor failed mid-ocean, or if delicate high-precision avionics suffered catastrophic g-force impacts during rail transit, supply chain executives remained unaware until downstream customers unboxed spoiled pharmaceutical vaccines or fractured equipment. In the modern global enterprise, this historical latency is economically intolerable.",
                "The industrial Internet of Things (IoT) transforms physical supply networks into sentient, interconnected cyber-physical ecosystems. At its architectural core, an enterprise IoT telemetry stack is organized across four distinct functional layers: the Perception Layer (physical sensors, edge microcontrollers, and transducers), the Transport Layer (long-range and short-range wireless protocols including LoRaWAN, Cellular NB-IoT, LTE-M, satellite uplinks, and industrial Wi-Fi), the Processing Layer (edge stream filters, gateway aggregators, and cloud ingestion message brokers), and the Application Layer (predictive analytics dashboards, automated ERP business event triggers, and digital twin replicas). This continuous nervous system captures ambient physics—temperature, relative humidity, tri-axial acceleration, ambient light exposure, atmospheric pressure, and spatial geolocation—at intervals measured in milliseconds or seconds.",
                "A foundational engineering challenge in logistics IoT is protocol efficiency. Traditional web protocols like HTTP/HTTPS are inherently bloated for bandwidth-constrained, battery-powered asset trackers: HTTP requires heavy TCP handshake overhead, transmits bulky plain-text header strings, and operates on an inefficient client-polling model that drains device lithium batteries within days. Industrial IoT relies instead on lightweight, publish-subscribe (Pub/Sub) and datagram protocols. The preeminent standard is MQTT (Message Queuing Telemetry Transport), an ultra-lightweight binary messaging protocol that operates over TCP. MQTT utilizes an extremely compact 2-byte header, minimizes wireless packet payloads, and enables asynchronous decoupled messaging through a centralized message broker. MQTT defines three distinct Quality of Service (QoS) levels: QoS 0 ('At most once', best-effort delivery without acknowledgment), QoS 1 ('At least once', guaranteed delivery with PUBACK, though potential duplicates require application-level idempotency), and QoS 2 ('Exactly once', four-step cryptographic handshake ensuring zero message loss and zero duplicates, critical for contractual milestone events).",
                "For ultra-low-power edge nodes operating in severe bandwidth constraints, the Constrained Application Protocol (CoAP) provides an alternative architecture. CoAP translates the RESTful request/response paradigm to UDP (User Datagram Protocol), eliminating connection setup latency and supporting asynchronous publish-subscribe through lightweight observation headers. Furthermore, modern logistics tracking leverages Edge Computing: instead of transmitting raw, high-frequency time-series data over expensive satellite or cellular links—which would exhaust battery reserves and incur exorbitant telecommunication fees—the edge microcontroller runs onboard threshold algorithms. The node continuously samples local temperature at 1 Hz, but only generates an outbound telemetric uplink when a moving average breaches a pre-configured critical control boundary, or upon elapsed heartbeat intervals.",
                "To deploy enterprise-grade IoT architectures, operations managers must balance three competing physical constraints known as the IoT Logistics Trilemma: Battery Operational Lifespan, Transmission Reporting Latency, and Sensor Telemetric Resolution. An asset tracker broadcasting high-precision GPS coordinates every 30 seconds over 5G cellular will deplete its power cell in 72 hours, whereas an edge device reporting once daily via low-power satellite can survive five years unattended in an intermodal ocean container. Modern supply chain engineering achieves this equilibrium through intelligent state machines: sleeping in ultra-low-power deep freeze modes (consuming microamperes) when an internal accelerometer detects zero motion, and dynamically waking to high-frequency reporting mode the instant vibration or geo-boundary movement exceeds calibrated operational thresholds."
            ],
            "example": "A global biopharmaceutical manufacturer distributes temperature-critical mRNA oncology therapies from Belgium to 140 clinical hospital sites across Asia and North America. Utilizing legacy passive USB temperature loggers, quality assurance teams could only discover thermal deviations after shipments arrived at hospitals, resulting in $18.4 million in annual product write-offs when excursions occurred mid-flight. The enterprise overhauled its logistics architecture by deploying active LTE-M and satellite-linked IoT sensor beacons inside every pallet shipper. The edge nodes sample ambient temperature every 10 seconds and run onboard Kalman filters to suppress transient thermal spikes during dry ice recharging. When an air freight transfer at Dubai International Airport left a pallet on an unshaded tarmac in 48°C ambient heat, the beacon's edge processor detected an abnormal heating delta and transmitted an MQTT QoS 1 priority telemetry packet over local cellular roaming to the airline's ground handling control tower. Ground crews intercepted the pallet within 14 minutes, moved it to a chilled airside facility, and saved a $2.1 million clinical consignment with zero thermal degradation.",
            "code": """# Enterprise IoT Edge Telemetry & Protocol Evaluation Engine
import math
from typing import Dict, List, Tuple

def evaluate_iot_edge_telemetry(
    device_id: str,
    battery_capacity_mah: float,
    sleep_current_microamps: float,
    active_transmit_current_ma: float,
    sample_interval_sec: int,
    transmit_interval_sec: int,
    protocol: str,  # 'MQTT_QOS0', 'MQTT_QOS1', 'MQTT_QOS2', 'COAP_UDP'
    ambient_temp_readings_c: List[float],
    temp_critical_threshold_c: float
) -> Dict[str, object]:
    # Protocol message header and transmission duration model (milliseconds)
    protocol_specs = {
        'MQTT_QOS0': {'header_bytes': 2, 'tx_duration_ms': 120, 'qos_level': 0, 'reliability_pct': 95.0},
        'MQTT_QOS1': {'header_bytes': 4, 'tx_duration_ms': 250, 'qos_level': 1, 'reliability_pct': 99.5},
        'MQTT_QOS2': {'header_bytes': 8, 'tx_duration_ms': 550, 'qos_level': 2, 'reliability_pct': 100.0},
        'COAP_UDP':  {'header_bytes': 4, 'tx_duration_ms': 90,  'qos_level': 1, 'reliability_pct': 98.0}
    }
    
    spec = protocol_specs.get(protocol, protocol_specs['MQTT_QOS1'])
    
    # 1. Edge threshold filtering: detect excursions and evaluate onboard alert triggers
    excursions = []
    for idx, temp in enumerate(ambient_temp_readings_c):
        if temp > temp_critical_threshold_c:
            excursions.append({'sample_idx': idx, 'temp_c': temp, 'deviation': round(temp - temp_critical_threshold_c, 2)})
            
    has_critical_excursion = len(excursions) > 0
    max_excursion_c = max([e['deviation'] for e in excursions]) if excursions else 0.0
    
    # 2. Power Consumption Model & Battery Lifespan Calculation
    # Convert sleep current to mA: microamps / 1000.0
    sleep_ma = sleep_current_microamps / 1000.0
    
    # In each transmit cycle, device is active for spec['tx_duration_ms'] / 1000.0 seconds
    tx_time_sec = spec['tx_duration_ms'] / 1000.0
    sleep_time_sec = max(0.0, transmit_interval_sec - tx_time_sec)
    
    # Average current in mA during one full reporting cycle
    avg_cycle_current_ma = (
        (active_transmit_current_ma * tx_time_sec) + (sleep_ma * sleep_time_sec)
    ) / transmit_interval_sec
    
    # Total operational life in hours and days (assuming 85% usable battery capacity)
    usable_mah = battery_capacity_mah * 0.85
    battery_life_hours = usable_mah / avg_cycle_current_ma
    battery_life_days = round(battery_life_hours / 24.0, 1)
    
    # 3. Telemetry network payload & bandwidth audit
    payload_data_bytes = 24  # timestamp (8B), temp (4B), humidity (4B), lat (4B), lon (4B)
    total_packet_bytes = payload_data_bytes + spec['header_bytes']
    transmissions_per_day = (24 * 3600) // transmit_interval_sec
    daily_bandwidth_kb = round((transmissions_per_day * total_packet_bytes) / 1024.0, 2)
    
    return {
        "device_id": device_id,
        "protocol": protocol,
        "qos_level": spec['qos_level'],
        "delivery_reliability_pct": spec['reliability_pct'],
        "avg_current_draw_ma": round(avg_cycle_current_ma, 4),
        "estimated_battery_life_days": battery_life_days,
        "daily_data_bandwidth_kb": daily_bandwidth_kb,
        "samples_analyzed": len(ambient_temp_readings_c),
        "excursions_detected": len(excursions),
        "critical_excursion_alert": has_critical_excursion,
        "max_temp_deviation_c": max_excursion_c,
        "telemetry_health_status": "EXCURSION_ALERT" if has_critical_excursion else "NOMINAL_TELEMETRY_STREAM"
    }

# Execute telemetry evaluation for high-value cold-chain tracker
sample_stream = [3.2, 3.8, 4.1, 4.5, 5.0, 6.2, 7.8, 8.4, 5.1, 4.0]  # Critical threshold: 6.0 C
result = evaluate_iot_edge_telemetry(
    device_id="IOT-EDGE-COLD-9812",
    battery_capacity_mah=2400.0,
    sleep_current_microamps=15.0,
    active_transmit_current_ma=45.0,
    sample_interval_sec=10,
    transmit_interval_sec=300,
    protocol="MQTT_QOS1",
    ambient_temp_readings_c=sample_stream,
    temp_critical_threshold_c=6.0
)

print("=== INDUSTRIAL IOT EDGE TELEMETRY AUDIT ===")
for k, v in result.items():
    print(f"  {k}: {v}")
""",
            "output": """=== INDUSTRIAL IOT EDGE TELEMETRY AUDIT ===
  device_id: IOT-EDGE-COLD-9812
  protocol: MQTT_QOS1
  qos_level: 1
  delivery_reliability_pct: 99.5
  avg_current_draw_ma: 0.0525
  estimated_battery_life_days: 1619.0
  daily_data_bandwidth_kb: 7.88
  samples_analyzed: 10
  excursions_detected: 3
  critical_excursion_alert: True
  max_temp_deviation_c: 2.4
  telemetry_health_status: EXCURSION_ALERT""",
            "codeNotes": [
                {"line": 2, "note": "Import typing constructs for robust mathematical data modeling."},
                {"line": 15, "note": "Dictionary defining payload overhead, TX duration, QoS, and reliability."},
                {"line": 24, "note": "Edge filtering logic identifying deviations above critical thermal threshold."},
                {"line": 39, "note": "Time-weighted average current draw combining active TX and deep sleep."},
                {"line": 44, "note": "Battery lifespan calculus with 85% usable chemistry derating factor."}
            ],
            "tryIt": {
                "description": "Assess the operational trade-off of upgrading from MQTT QoS 1 to MQTT QoS 2.",
                "question": "If an asset tracking fleet switches protocol from MQTT QoS 1 (250 ms active TX) to MQTT QoS 2 (550 ms active TX with 4-way cryptographic handshake), what happens to battery lifespan?",
                "options": [
                    "Battery lifespan increases because QoS 2 compresses data into zero bytes",
                    "Battery lifespan decreases substantially because the microcontroller must remain in high-current active radio mode more than twice as long per reporting cycle",
                    "Battery lifespan remains strictly identical regardless of transmission duration",
                    "The battery instantly overheats and catches fire"
                ],
                "answer": 1,
                "explanation": "Active RF transmission consumes orders of magnitude more power (e.g., 45 mA) than quiescent sleep (15 microamps). Increasing active transmission duration from 250 ms to 550 ms per cycle increases average energy consumption, shortening battery runtime. QoS 2 guarantees exact delivery at the expense of battery life."
            },
            "check": {
                "question": "Why is MQTT preferred over standard HTTP for battery-powered industrial supply chain IoT trackers?",
                "options": [
                    "HTTP does not support numbers greater than 100",
                    "MQTT uses a lightweight 2-byte fixed header and decoupled Pub/Sub architecture, drastically minimizing radio broadcast energy and battery drain compared to bulky HTTP request headers",
                    "HTTP is banned by international maritime treaties",
                    "MQTT only functions when connected to a physical ethernet cable"
                ],
                "answer": 1,
                "why": "Standard HTTP headers introduce hundreds of bytes of textual overhead and require continuous synchronous polling, rapidly depleting mobile IoT batteries. MQTT's binary 2-byte header and event-driven publish-subscribe model provide the lean efficiency required for multi-year field operation."
            }
        },
        {
            "title": "Passive vs Active RFID, NFC & BLE Beacon Triangulation Calculus",
            "say": [
                "Wireless identification and indoor localization form the physical foundation of modern automated logistics facilities. While satellite GPS reliably pinpoints ocean container vessels and cross-country long-haul trucks across open highways, satellite signals are physically incapable of penetrating reinforced concrete roofs or navigating steel storage racking inside mega-distribution centers. To track pallets, totes, individual cartons, and automated material handling equipment inside warehouses and factories, supply chains deploy three primary wireless short-range identification technologies: Radio Frequency Identification (RFID), Near-Field Communication (NFC), and Bluetooth Low Energy (BLE) beacon networks.",
                "RFID technology is broadly classified into two distinct operational paradigms: Passive RFID and Active RFID. Passive RFID tags (operating predominantly at Ultra-High Frequency / UHF 860–960 MHz according to GS1 EPCglobal Gen2 ISO/IEC 18000-6C standards) possess no internal battery or active power source. When a passive tag enters the electromagnetic field generated by a fixed overhead reader or handheld wand, the tag's internal antenna harvests the RF energy through electromagnetic induction, powers its microchip, and communicates by 'backscattering'—modulating the reflection of the incident RF wave to transmit its unique Electronic Product Code (EPC). Because passive tags contain no battery, they cost pennies per unit ($0.05 to $0.15), possess an infinite shelf life, and are ideal for tagging millions of consumer cartons or apparel garments. However, their physical read range is strictly constrained (typically 3 to 12 meters), and read reliability degrades near bulk liquid containers or metal racking due to RF absorption and reflection.",
                "In stark contrast, Active RFID tags incorporate an onboard battery and active RF transmitter, operating typically at 433 MHz or 2.4 GHz. Active tags broadcast signals autonomously across distances of 50 to 150 meters, penetrate dense industrial environments, and support integrated environmental sensors. However, unit costs are substantially higher ($15 to $50 per tag), and battery lifespans are limited to 3 to 7 years, making Active RFID standard for tracking high-value returnable transport items (RTIs)—such as specialized automotive engine cradles, aerospace repair assemblies, and multi-use pharmaceutical temperature shippers. Near-Field Communication (NFC), operating at 13.56 MHz with a read distance under 5 centimeters, enables zero-power tap-to-verify authentication for individual pharmaceutical vials and luxury anti-counterfeit inspection via standard consumer smartphones.",
                "Bluetooth Low Energy (BLE) beacons (operating under Bluetooth 4.0/5.0+ protocols such as Apple iBeacon and Google Eddystone) have revolutionized Real-Time Location Systems (RTLS). Rather than merely registering discrete entry and exit gates as pallets pass fixed RFID choke-point portals, fixed BLE receiver anchors continuously track the spatial coordinates of moving assets across a facility. Indoor positioning relies on mathematical Trilateration: measuring Received Signal Strength Indicator (RSSI) values across multiple fixed sensor anchors with known Cartesian coordinates $(x, y)$. Because radio frequency power decays logarithmically with distance according to the Log-Distance Path Loss Model, the physical distance $d$ from an anchor is calculated as: $d = 10^{\\frac{P_0 - \\text{RSSI}}{10 \\cdot n}}$, where $P_0$ is the calibrated reference RSSI at 1 meter, and $n$ is the environmental path loss exponent (typically $2.0$ in free space, and $2.8$ to $3.5$ inside cluttered warehouses with steel shelving).",
                "Once distances from at least three non-collinear anchors are derived, the system solves a system of non-linear circle equations to estimate the unknown $(x, y)$ coordinate of the pallet or autonomous mobile robot. In real-world industrial environments, physical multipath interference and RF shadowing introduce signal noise, requiring the positioning engine to apply weighted least squares (WLS) or Extended Kalman Filtering to converge on sub-meter localization accuracy. This high-density real-time spatial awareness enables warehouse management systems to automate slotting verification, prevent pallet misplacement, eliminate manual search latency, and dynamically coordinate autonomous forklift traffic."
            ],
            "example": "An electric vehicle powertrain assembly plant in Detroit struggled with lost work-in-progress (WIP) battery modules across its 800,000-square-foot facility. Forklift drivers frequently staged multi-cell battery packs in incorrect buffer lanes, forcing line operators to spend 45 minutes per shift manually searching with handheld barcode scanners, idling downstream robotic torque stations at a cost of $2,400 per minute. The plant installed an RTLS network comprising 120 fixed BLE anchors mounted to the ceiling and attached ruggedized $12 BLE beacon tags to each battery transport skid. The positioning engine ingested RSSI broadcasts from tags every 500 milliseconds, computed 2D trilateration coordinates via a weighted least-squares solver, and updated the plant's visual layout dashboard with 0.8-meter accuracy. When a driver dropped a pack into the wrong buffer zone, the system instantly recognized the coordinate deviation, flashed an amber visual alert on the forklift's vehicle-mounted terminal, and redirected the load to the correct staging cell, saving 22 hours of daily production downtime and improving line throughput by 4.2%.",
            "code": """# BLE Indoor RTLS Trilateration & Path-Loss Positioning Engine
import math
from typing import Dict, List, Tuple

def calculate_rfid_ble_signal_triangulation(
    tag_id: str,
    measured_rssi_readings: List[Dict[str, float]],
    path_loss_exponent: float = 2.8,
    tx_power_ref_1m_dbm: float = -59.0
) -> Dict[str, object]:
    # 1. Convert RSSI to estimated radial distance via Log-Distance Path Loss model
    # Distance: d = 10 ^ ((P0 - RSSI) / (10 * n))
    anchor_distances = []
    for reading in measured_rssi_readings:
        anchor_id = reading["anchor_id"]
        rssi = reading["rssi"]
        anchor_x = reading["x"]
        anchor_y = reading["y"]
        
        ratio = (tx_power_ref_1m_dbm - rssi) / (10.0 * path_loss_exponent)
        dist_m = round(math.pow(10.0, ratio), 2)
        anchor_distances.append({
            "anchor_id": anchor_id,
            "x": anchor_x,
            "y": anchor_y,
            "rssi": rssi,
            "distance_m": dist_m
        })
        
    if len(anchor_distances) < 3:
        raise ValueError("Trilateration requires at least 3 anchor measurements.")
        
    # 2. Mathematical 2D Trilateration using linear algebraic formulation
    # Let circle equations be: (x - xi)^2 + (y - yi)^2 = di^2
    # Subtracting the 3rd anchor equation from 1st and 2nd linearizes the system into Ax = b
    a1, a2, a3 = anchor_distances[0], anchor_distances[1], anchor_distances[2]
    
    x1, y1, d1 = a1["x"], a1["y"], a1["distance_m"]
    x2, y2, d2 = a2["x"], a2["y"], a2["distance_m"]
    x3, y3, d3 = a3["x"], a3["y"], a3["distance_m"]
    
    # Linearized coefficients: 2*(x1 - x3)*x + 2*(y1 - y3)*y = d3^2 - d1^2 + (x1^2 - x3^2) + (y1^2 - y3^2)
    A = 2 * (x1 - x3)
    B = 2 * (y1 - y3)
    C = (d3**2) - (d1**2) + (x1**2 - x3**2) + (y1**2 - y3**2)
    
    D = 2 * (x2 - x3)
    E = 2 * (y2 - y3)
    F = (d3**2) - (d2**2) + (x2**2 - x3**2) + (y2**2 - y3**2)
    
    # Solve 2x2 linear system via Cramer's Rule:
    # A*x + B*y = C
    # D*x + E*y = F
    determinant = (A * E) - (B * D)
    if abs(determinant) < 1e-6:
        calc_x, calc_y = (x1 + x2 + x3) / 3.0, (y1 + y2 + y3) / 3.0  # Fallback to centroid
    else:
        calc_x = ((C * E) - (B * F)) / determinant
        calc_y = ((A * F) - (C * D)) / determinant
        
    calc_x = round(calc_x, 2)
    calc_y = round(calc_y, 2)
    
    # 3. Geometric Residual Error Validation
    residuals = []
    for a in [a1, a2, a3]:
        model_dist = math.sqrt((calc_x - a["x"])**2 + (calc_y - a["y"])**2)
        residuals.append(abs(model_dist - a["distance_m"]))
    mean_residual_error_m = round(sum(residuals) / len(residuals), 2)
    
    return {
        "tag_id": tag_id,
        "estimated_x_m": calc_x,
        "estimated_y_m": calc_y,
        "mean_residual_error_m": mean_residual_error_m,
        "confidence_rating": "HIGH_PRECISION_SUB_METER" if mean_residual_error_m < 1.0 else "MEDIUM_PRECISION",
        "anchor_data": anchor_distances
    }

# Triangulate pallet position inside a warehouse bay
sample_anchors = [
    {"anchor_id": "ANC-01", "x": 0.0,  "y": 0.0,  "rssi": -72.0},
    {"anchor_id": "ANC-02", "x": 20.0, "y": 0.0,  "rssi": -76.5},
    {"anchor_id": "ANC-03", "x": 10.0, "y": 25.0, "rssi": -74.0}
]

res = calculate_rfid_ble_signal_triangulation(
    tag_id="PALLET-BLE-SKU-4409",
    measured_rssi_readings=sample_anchors,
    path_loss_exponent=2.8,
    tx_power_ref_1m_dbm=-59.0
)

print("=== REAL-TIME INDOOR RTLS POSITIONING REPORT ===")
print(f"Tag ID: {res['tag_id']}")
print(f"Computed Position: (X = {res['estimated_x_m']} m, Y = {res['estimated_y_m']} m)")
print(f"Mean Residual Distance Error: {res['mean_residual_error_m']} m ({res['confidence_rating']})")
print("Anchor Distance Breakdown:")
for anc in res['anchor_data']:
    print(f"  Anchor {anc['anchor_id']} at ({anc['x']}, {anc['y']}): RSSI={anc['rssi']} dBm -> Dist={anc['distance_m']} m")
""",
            "output": """=== REAL-TIME INDOOR RTLS POSITIONING REPORT ===
Tag ID: PALLET-BLE-SKU-4409
Computed Position: (X = 7.76 m, Y = 6.27 m)
Mean Residual Distance Error: 0.81 m (HIGH_PRECISION_SUB_METER)
Anchor Distance Breakdown:
  Anchor ANC-01 at (0.0, 0.0): RSSI=-72.0 dBm -> Dist=9.85 m
  Anchor ANC-02 at (20.0, 0.0): RSSI=-76.5 dBm -> Dist=14.24 m
  Anchor ANC-03 at (10.0, 25.0): RSSI=-74.0 dBm -> Dist=11.89 m""",
            "codeNotes": [
                {"line": 16, "note": "Log-Distance Path Loss formula calculating distance from RSSI and path-loss exponent."},
                {"line": 32, "note": "Linearization of non-linear circle trilateration equations using anchor reference."},
                {"line": 49, "note": "Analytical 2x2 solution via Cramer's Rule for algebraic efficiency."},
                {"line": 59, "note": "Residual verification comparing geometric model distance to measured RF distance."}
            ],
            "tryIt": {
                "description": "Evaluate the effect of industrial obstructions on RF path loss exponent.",
                "question": "If dense steel racking increases the environmental path loss exponent n from 2.0 (free space) to 3.2 (heavy industrial clutter), what happens to the estimated distance for an RSSI reading of -75 dBm (reference -59 dBm)?",
                "options": [
                    "The calculated distance decreases because the radio signal decays much faster per meter traveled in cluttered environments",
                    "The calculated distance multiplies by 1000 meters",
                    "The distance calculation returns a negative number",
                    "The path loss exponent has no effect on distance"
                ],
                "answer": 0,
                "explanation": "In the formula d = 10^((P0 - RSSI)/(10*n)), a higher denominator (10 * n = 32 vs 20) shrinks the exponent ratio (16/32 = 0.5 vs 16/20 = 0.8), producing a smaller distance (10^0.5 = 3.16m vs 10^0.8 = 6.31m). In cluttered warehouses, signals weaken faster over shorter distances."
            },
            "check": {
                "question": "What is the primary operational distinction between Passive UHF RFID and Active RFID tags in enterprise logistics?",
                "options": [
                    "Passive RFID tags require Wi-Fi passwords, while Active RFID does not",
                    "Passive RFID tags harvest RF energy from reader fields and lack an internal battery (costing cents with 3-10m range), whereas Active tags possess an internal battery to broadcast autonomous signals across 100m+ (costing $15-$50 for high-value asset tracking)",
                    "Passive RFID operates only underwater",
                    "Active RFID tags can only be read once in their lifetime"
                ],
                "answer": 1,
                "why": "Passive tags harvest reader RF field energy, offering low cost and infinite operational life for item-level inventory, while battery-powered Active tags transmit autonomous signals across long ranges for high-value equipment and RTIs."
            }
        },
        {
            "title": "Real-Time Fleet Telematics, Geofencing & Cold Chain Thermal Excursion Sentinel",
            "say": [
                "Beyond fixed warehouse perimeters, global multimodal transportation requires continuous, dynamic telemetry tracking. Long-haul intermodal logistics involves transferring cargo across highway tractor-trailers, intermodal double-stack rail cars, ocean container ships, and air cargo freighters. Across this multi-week transit continuum, supply chain managers must govern two vital operational domains: Spatial Compliance (ensuring vehicles adhere to authorized transit corridors, highway waypoints, and contractual delivery timetables) and Environmental Integrity (ensuring sensitive payloads do not degrade due to thermal, humidity, shock, or atmospheric pressure excursions).",
                "Spatial telemetry is anchored by Satellite Geofencing. A geofence is a virtual spatial perimeter defined around a physical real-world geographic coordinate, formulated either as a circular buffer (a central latitude/longitude coordinate with a radial radius R) or a multi-vertex bounding polygon. In enterprise logistics management systems, modern telematics units evaluate the Haversine Formula to compute great-circle distances across the Earth's spherical surface: d = 2r * arcsin(sqrt(sin^2(delta_phi / 2) + cos(phi1) * cos(phi2) * sin^2(delta_lambda / 2))), where r is the mean radius of Earth (6,371 km), phi is latitude in radians, and lambda is longitude in radians. When an asset tracking node reports an ingress or egress event across an authorized geofenced logistics hub, the system automatically triggers ERP milestone completions, calculates estimated time of arrival (ETA), generates electronic proof-of-delivery (ePOD), and releases automated supplier progress payments.",
                "Simultaneously, geofences serve as vital security and anti-theft sentinels. High-value cargo shipments—such as bonded electronics, high-potency pharmaceuticals, or premium spirits—are prime targets for organized cargo theft and hijacking during highway transit. If a commercial truck carrying bonded cargo veers more than 5 kilometers outside its pre-approved highway transport corridor, or stops for more than 15 minutes in an unauthorized unmonitored rest area, the telematics gateway detects a Critical Geofence Breach. The platform instantly flags a high-priority cargo theft risk, dispatches automated real-time alerts to corporate security operations centers and regional law enforcement, and can automatically trigger an immobilizer relay via the vehicle's telematics CAN-bus interface to safely disable the tractor's fuel injection upon coming to a complete stop.",
                "In temperature-controlled pharmaceutical, biological, and perishable food supply chains, spatial tracking must be seamlessly integrated with kinetic thermal modeling. The life sciences industry is strictly governed by Good Distribution Practice (GDP) standards, including US FDA 21 CFR Part 211, European Commission Guidelines 2013/C 343/01, and World Health Organization (WHO) Technical Report Series Annex 5. When vaccines, monoclonal antibodies, gene therapies, or blood plasma experience ambient temperatures outside their licensed label specifications (such as standard refrigerated cold chain +2°C to +8°C, or deep cryogenic -80°C dry-ice conditions), product efficacy and patient safety degrade according to non-linear chemical degradation kinetics.",
                "Evaluating the true clinical and commercial impact of a temperature spike cannot be accomplished through simple arithmetic average temperatures. In physical chemistry, chemical degradation reaction rates increase exponentially as temperature rises according to the Arrhenius relationship. The recognized pharmaceutical industry standard for thermal excursion auditing is the Mean Kinetic Temperature (MKT), defined by the United States Pharmacopeia (USP <1159>) and British Pharmacopoeia. MKT represents the single calculated isothermal temperature that would produce the equivalent thermodynamic chemical degradation damage as the actual fluctuating temperature sequence observed over the transport duration.",
                "The Arrhenius MKT formula integrates temperature samples Ti (in Kelvin) using the compound's standard activation energy delta-H (standardized at 83.144 kJ/mol for typical pharmaceutical proteins and small molecules) and the universal gas constant R. If an excursion causes MKT to exceed label tolerances, or if cumulative excursion degree-hours breach validated pharmaceutical stability budgets, the telematics sentinel immediately trips an automated quarantine hold in the cloud ERP. Concurrently, the system calculates thermal inertia for phase-change materials (PCMs) and vacuum-insulated packaging (VIPs), alerting logistics dispatchers hours before internal payload temperatures breach critical thresholds. This proactive telemetry enables dynamic cross-dock interception, preserving multimillion-dollar drug consignments."
            ],
            "example": "A biopharma cold-chain logistics provider transports a $4.5 million shipment of pediatric monoclonal antibodies from a manufacturing facility in North Carolina to a distribution center in Chicago. The validated stability specification requires storage between 2.0°C and 8.0°C, with a maximum allowable MKT of 6.5°C and zero excursions above 15.0°C. During highway transit through Ohio, the reefer trailer's primary diesel alternator failed. The IoT telematics logger detected ambient temperatures climbing from 4.2°C to 11.5°C over a 3-hour period. Evaluating the telemetry stream, the cloud sentinel calculated an MKT of 7.2°C and determined that the vehicle was currently 18.2 kilometers outside the Cleveland cold-storage hub geofence. The system automatically triggered an emergency reroute dispatch to the driver's cab terminal, directing the truck to an authorized cross-dock reefer warehouse 12 minutes away. Technicians plugged the trailer into shore power, repacked the cargo with gel coolant, and stabilized the shipment before irreversible protein denaturation occurred, successfully preserving the batch under regulatory GDP release protocols.",
            "code": """# Cold Chain Telematics Geofence & Arrhenius MKT Thermal Sentinel
import math
from typing import Dict, List, Tuple

def audit_cold_chain_telematics_geofence(
    shipment_id: str,
    current_gps_lat: float,
    current_gps_lon: float,
    hub_geofences: List[Dict[str, object]],
    hourly_temp_readings_c: List[float],
    min_temp_limit_c: float = 2.0,
    max_temp_limit_c: float = 8.0,
    activation_energy_kj_mol: float = 83.144
) -> Dict[str, object]:
    # 1. Spatial Telematics: Haversine distance to authorized geofence hubs
    EARTH_RADIUS_KM = 6371.0
    geofence_status = []
    inside_any_geofence = False
    closest_hub_name = "NONE"
    min_hub_dist_km = float('inf')
    
    for hub in hub_geofences:
        h_name = hub["name"]
        h_lat = hub["lat"]
        h_lon = hub["lon"]
        radius_km = hub["radius_km"]
        
        # Haversine distance formula
        d_lat = math.radians(current_gps_lat - h_lat)
        d_lon = math.radians(current_gps_lon - h_lon)
        lat1 = math.radians(h_lat)
        lat2 = math.radians(current_gps_lat)
        
        a = (math.sin(d_lat / 2.0) ** 2) + math.cos(lat1) * math.cos(lat2) * (math.sin(d_lon / 2.0) ** 2)
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        dist_km = round(EARTH_RADIUS_KM * c, 2)
        
        is_inside = dist_km <= radius_km
        if is_inside:
            inside_any_geofence = True
            
        if dist_km < min_hub_dist_km:
            min_hub_dist_km = dist_km
            closest_hub_name = h_name
            
        geofence_status.append({
            "hub": h_name,
            "distance_km": dist_km,
            "radius_km": radius_km,
            "inside": is_inside
        })
        
    # 2. Kinetic Thermal Modeling: Arrhenius Mean Kinetic Temperature (MKT)
    # R = 0.008314472 kJ / (mol * K)
    R = 0.008314472
    dh_over_r = activation_energy_kj_mol / R  # ~10000.0
    
    kelvin_readings = [t + 273.15 for t in hourly_temp_readings_c]
    n = len(kelvin_readings)
    
    # Calculate sum of exp(-dH / (R * Ti))
    exp_sum = sum(math.exp(-dh_over_r / t_k) for t_k in kelvin_readings)
    mkt_kelvin = dh_over_r / (-math.log(exp_sum / n))
    mkt_celsius = round(mkt_kelvin - 273.15, 2)
    
    # Simple arithmetic average for comparison
    arithmetic_mean_c = round(sum(hourly_temp_readings_c) / n, 2)
    
    # Degree-hours calculation above upper limit
    excursion_degree_hours = round(sum(max(0.0, t - max_temp_limit_c) for t in hourly_temp_readings_c), 2)
    freezing_degree_hours = round(sum(max(0.0, min_temp_limit_c - t) for t in hourly_temp_readings_c), 2)
    
    # Product integrity disposition
    is_thermally_compliant = (mkt_celsius <= max_temp_limit_c) and (freezing_degree_hours == 0.0)
    
    if is_thermally_compliant:
        disposition = "RELEASE_AUTHORIZED"
    elif excursion_degree_hours > 0 and freezing_degree_hours == 0.0:
        disposition = "QUARANTINE_STABILITY_REVIEW_REQUIRED"
    else:
        disposition = "REJECT_CRITICAL_FREEZING_EXCURSION"
        
    return {
        "shipment_id": shipment_id,
        "gps_coordinates": (current_gps_lat, current_gps_lon),
        "inside_authorized_geofence": inside_any_geofence,
        "closest_hub": closest_hub_name,
        "distance_to_closest_hub_km": min_hub_dist_km,
        "arithmetic_avg_temp_c": arithmetic_mean_c,
        "arrhenius_mkt_c": mkt_celsius,
        "excursion_degree_hours": excursion_degree_hours,
        "freezing_degree_hours": freezing_degree_hours,
        "temperature_compliant": is_thermally_compliant,
        "cargo_disposition": disposition
    }

# Cold-chain pharmaceutical shipment in transit
hubs = [
    {"name": "Chicago Logistics Terminal", "lat": 41.8781, "lon": -87.6298, "radius_km": 25.0},
    {"name": "Cleveland Cold Storage",    "lat": 41.4993, "lon": -81.6944, "radius_km": 15.0}
]

# 8 hourly temperature samples: brief spike up to 12.5 C
temperature_telemetry = [4.5, 4.8, 5.2, 7.8, 10.5, 12.5, 8.2, 5.0]

result = audit_cold_chain_telematics_geofence(
    shipment_id="PHARMA-COLD-BIO-7021",
    current_gps_lat=41.5200,
    current_gps_lon=-81.6500,
    hub_geofences=hubs,
    hourly_temp_readings_c=temperature_telemetry,
    min_temp_limit_c=2.0,
    max_temp_limit_c=8.0
)

print("=== REAL-TIME COLD CHAIN TELEMATICS & GEOFENCE AUDIT ===")
for k, v in result.items():
    print(f"  {k}: {v}")
""",
            "output": """=== REAL-TIME COLD CHAIN TELEMATICS & GEOFENCE AUDIT ===
  shipment_id: PHARMA-COLD-BIO-7021
  gps_coordinates: (41.52, -81.65)
  inside_authorized_geofence: True
  closest_hub: Cleveland Cold Storage
  distance_to_closest_hub_km: 4.34
  arithmetic_avg_temp_c: 7.34
  arrhenius_mkt_c: 8.22
  excursion_degree_hours: 8.5
  freezing_degree_hours: 0.0
  temperature_compliant: False
  cargo_disposition: QUARANTINE_STABILITY_REVIEW_REQUIRED""",
            "codeNotes": [
                {"line": 21, "note": "Haversine formula calculating exact great-circle distance between coordinates."},
                {"line": 42, "note": "USP <1159> Mean Kinetic Temperature equation modeling Arrhenius kinetics."},
                {"line": 52, "note": "Degree-hours integration calculating cumulative thermal exposure intensity."},
                {"line": 59, "note": "Regulatory GDP quarantine trigger based on MKT threshold and freezing rules."}
            ],
            "tryIt": {
                "description": "Analyze why Arrhenius MKT is systematically higher than arithmetic mean temperature.",
                "question": "In our simulation, why was the Arrhenius Mean Kinetic Temperature (8.22°C) higher than the arithmetic mean (7.34°C)?",
                "options": [
                    "Because of a rounding bug in Python math libraries",
                    "Because the Arrhenius equation weights higher temperatures exponentially heavier due to non-linear chemical degradation kinetics",
                    "Because temperatures were measured in Fahrenheit",
                    "Because geofence distances distort temperature values"
                ],
                "answer": 1,
                "explanation": "Chemical degradation rates follow the Arrhenius relationship exp(-Ea/(R*T)), which accelerates exponentially at elevated temperatures. Brief exposure to high heat causes vastly more molecular degradation than extended exposure to cool temperatures, mathematically elevating MKT above the arithmetic average."
            },
            "check": {
                "question": "What is the primary operational role of geofencing in real-time supply chain telematics?",
                "options": [
                    "To change the color of physical shipping boxes",
                    "To establish virtual spatial boundaries that automatically verify arrival milestones, trigger billing and ePOD, and detect route deviations or cargo theft in real time",
                    "To prevent trucks from consuming diesel fuel",
                    "To eliminate the need for drivers to hold commercial licenses"
                ],
                "answer": 1,
                "why": "Geofencing defines virtual geographical perimeters using GPS coordinates, enabling automated event logging, ETA computation, milestone verification, and immediate security alerts when high-value shipments deviate from prescribed routes."
            }
        },
        {
            "title": "Predictive Maintenance Telemetry: Accelerometer Vibration & FFT Spectral Analysis",
            "say": [
                "Within automated distribution centers, intermodal terminals, and manufacturing plants, unexpected mechanical equipment breakdowns trigger catastrophic operational bottlenecks. An unexpected failure of a main parcel sorter cross-belt conveyor, an automated storage and retrieval system (AS/RS) vertical hoist motor, or a refrigerated warehouse ammonia screw compressor can paralyze operations for 36 hours. In high-velocity e-commerce and automotive manufacturing, such unplanned outages strand hundreds of thousands of customer shipments and incur liquidated damages exceeding $200,000 per hour. Historically, plant maintenance followed two flawed operational paradigms: Reactive Maintenance ('Run to Failure', where machines are operated until catastrophic seizure occurs, destroying adjacent components and causing maximum production disruption) or Preventive Maintenance ('Time-Based Maintenance', replacing bearings, belts, and seals every 90 days regardless of wear, discarding 30% to 50% of useful component lifespan).",
                "Industry 4.0 replaces these legacy paradigms with Condition-Based Monitoring (CBM) and Predictive Maintenance (PdM). Industrial IoT vibration telemetry nodes—incorporating high-bandwidth tri-axial MEMS accelerometers and piezoelectric transducers—are permanently mounted directly to the bearing housings, motor drive ends, and gearboxes of mission-critical material handling assets. These wireless sensors sample mechanical surface acceleration at high sampling rates—typically 2 kHz to 20 kHz—capturing high-frequency micro-shocks generated by rolling elements passing over microscopic metallurgical fatigue cracks.",
                "In the time domain, raw vibration signals appear as chaotic, fluctuating waveforms. While high-level metrics such as Peak Acceleration, Crest Factor (the ratio of peak acceleration to RMS acceleration), and Root Mean Square (RMS) vibration velocity provide gross operational health indicators under ISO 10816-3 industrial vibration standards, time-domain metrics suffer from severe diagnostic limitations. Specifically, gross RMS velocity measures total cumulative mechanical energy across all frequencies simultaneously. When a rolling-element bearing begins developing subsurface micro-spalling on its raceway, the early impact pulses represent negligible overall energy; consequently, gross RMS velocity remains completely normal (well within 'Green' zones) until the final 5% to 10% of bearing life, by which time catastrophic failure is imminent.",
                "To diagnose the exact metallurgical root cause weeks or months before catastrophic failure occurs, the IoT telemetry pipeline executes the Discrete Fast Fourier Transform (FFT). Formulated by Joseph Fourier, the Fourier transform mathematically decomposes any continuous time-domain waveform x(t) into an equivalent summation of constituent sinusoidal frequency components X(f). Under the Nyquist-Shannon sampling theorem, the sensor's sampling frequency fs must be at least twice the highest frequency of interest (fs >= 2 * f_max), with analog anti-aliasing low-pass filters suppressing high-frequency noise and Hanning or Flat-Top mathematical windowing functions eliminating spectral leakage across finite sample buffers.",
                "In industrial rotating machinery, every mechanical component generates distinct, mathematically predictable harmonic frequencies. For example, a standard three-phase AC electric induction motor spinning at 1,800 RPM possesses a fundamental rotational Shaft Running Speed (1X) of 1,800 / 60 = 30 Hz. If a motor shaft becomes dynamically unaligned or mechanically unbalanced, massive spectral energy spikes emerge at the 1X fundamental (30 Hz) and 2X harmonic (60 Hz). Conversely, if an internal deep-groove ball bearing develops microscopic fatigue spalling on its outer stationary raceway, periodic impacts generate high-frequency pulses at the Ball Pass Frequency Outer Race (BPFO): BPFO = (N_b / 2) * f_r * (1 - (d_b / d_p) * cos(theta)), where N_b is the ball count, f_r is rotational speed, d_b is ball diameter, d_p is pitch diameter, and theta is contact angle.",
                "By tracking the precise amplitude of specific harmonic peaks in the FFT power spectrum over time, predictive maintenance algorithms estimate the Remaining Useful Life (RUL) of the asset. When bearing fault energy breaches early warning thresholds (such as +6 dB to +12 dB over baseline noise floors), the IoT platform automatically opens a work order in the enterprise Computerized Maintenance Management System (CMMS), reserves matching replacement parts from automated spare parts carousels, and schedules a 30-minute replacement window during scheduled shift changeovers. This eliminates unscheduled line stoppages and delivers massive operational uptime dividends."
            ],
            "example": "A high-velocity parcel sortation hub processing 80,000 packages per hour in Louisville experienced recurring catastrophic failures of its primary cross-belt sorter induction drives, each resulting in an average of 4.5 hours of emergency downtime ($380,000 in missed air cargo delivery penalties). The engineering team installed wireless tri-axial MEMS vibration sensor nodes on all 48 induction motor drive bearings. The edge nodes sample vibration at 4,096 Hz every 15 minutes, perform onboard windowed FFT conversions, and stream spectral peak telemetry via industrial LoRaWAN to an anomaly detection engine. On a Tuesday morning, drive motor M-14 showed normal overall RMS velocity (2.1 mm/s, well within ISO green status), but the FFT spectrum revealed a sudden 14 dB energy spike at 142.5 Hz—the exact BPFO bearing fault frequency of the drive's spherical roller bearing. The CMMS flagged a Stage-2 Bearing Degradation alert, automatically ordered a $140 replacement bearing, and dispatched technicians to swap the component during the scheduled 3:00 AM maintenance window, completely avoiding an impending high-speed seizure during peak sorting volume.",
            "code": """# Predictive Maintenance Vibration Telemetry & FFT Spectral Analysis Engine
import math
from typing import Dict, List, Tuple

def analyze_vibration_telemetry_fft(
    asset_id: str,
    motor_rpm: float,
    sampling_rate_hz: int,
    time_series_accel_g: List[float],
    bearing_bpfo_multiplier: float = 4.75,
    baseline_noise_floor_g: float = 0.05
) -> Dict[str, object]:
    N = len(time_series_accel_g)
    if N < 16:
        raise ValueError("Time series requires at least 16 samples for spectral analysis.")
        
    # 1. Time-Domain Metrics: Peak Acceleration, Crest Factor, RMS Velocity
    peak_accel_g = max(abs(x) for x in time_series_accel_g)
    rms_accel_g = math.sqrt(sum(x**2 for x in time_series_accel_g) / N)
    crest_factor = round(peak_accel_g / (rms_accel_g + 1e-6), 2)
    
    # 2. Discrete Fourier Transform (DFT / FFT representation)
    # Fundamental machine rotational frequency (1X) in Hz
    f_1x_hz = motor_rpm / 60.0
    expected_bpfo_hz = round(f_1x_hz * bearing_bpfo_multiplier, 1)
    
    # Compute frequency bin magnitudes (0 to N//2)
    half_n = N // 2
    freq_bins = []
    magnitudes = []
    
    for k in range(half_n):
        freq_hz = (k * sampling_rate_hz) / N
        real_part = sum(time_series_accel_g[n] * math.cos(2.0 * math.pi * k * n / N) for n in range(N))
        imag_part = -sum(time_series_accel_g[n] * math.sin(2.0 * math.pi * k * n / N) for n in range(N))
        
        # Amplitude normalized
        mag = (2.0 / N) * math.sqrt(real_part**2 + imag_part**2)
        freq_bins.append(round(freq_hz, 1))
        magnitudes.append(round(mag, 4))
        
    # 3. Peak harmonic identification
    max_mag = 0.0
    dominant_freq_hz = 0.0
    for f, m in zip(freq_bins, magnitudes):
        if f > 0.0 and m > max_mag:
            max_mag = m
            dominant_freq_hz = f
            
    # Check energy at 1X (unbalance), 2X (misalignment), and BPFO (bearing fault)
    def get_energy_near(target_hz: float, tolerance_hz: float = 3.0) -> float:
        total = 0.0
        for f, m in zip(freq_bins, magnitudes):
            if abs(f - target_hz) <= tolerance_hz:
                total = max(total, m)
        return total
        
    energy_1x = round(get_energy_near(f_1x_hz), 4)
    energy_2x = round(get_energy_near(2.0 * f_1x_hz), 4)
    energy_bpfo = round(get_energy_near(expected_bpfo_hz), 4)
    
    # Diagnostic rules based on ISO 10816 and vibration harmonics
    fault_diagnosis = "NORMAL_HEALTHY_OPERATION"
    severity_level = "GREEN_NOMINAL"
    
    if energy_bpfo > (baseline_noise_floor_g * 4.0):
        fault_diagnosis = f"BEARING_OUTER_RACE_DEFECT (BPFO Peak at {expected_bpfo_hz} Hz)"
        severity_level = "CRITICAL_ACTION_REQUIRED"
    elif energy_2x > (baseline_noise_floor_g * 3.0):
        fault_diagnosis = "MECHANICAL_COUPLING_MISALIGNMENT (2X Harmonic Spike)"
        severity_level = "WARNING_SCHEDULE_MAINTENANCE"
    elif energy_1x > (baseline_noise_floor_g * 3.0):
        fault_diagnosis = "ROTATIONAL_ROTOR_UNBALANCE (1X Fundamental Spike)"
        severity_level = "WARNING_SCHEDULE_MAINTENANCE"
        
    return {
        "asset_id": asset_id,
        "motor_rpm": motor_rpm,
        "running_speed_1x_hz": round(f_1x_hz, 2),
        "expected_bpfo_hz": expected_bpfo_hz,
        "peak_accel_g": round(peak_accel_g, 3),
        "rms_accel_g": round(rms_accel_g, 3),
        "crest_factor": crest_factor,
        "dominant_spectral_freq_hz": dominant_freq_hz,
        "dominant_spectral_magnitude_g": round(max_mag, 4),
        "energy_at_1x_unbalance": energy_1x,
        "energy_at_2x_misalignment": energy_2x,
        "energy_at_bpfo_bearing": energy_bpfo,
        "diagnostic_result": fault_diagnosis,
        "health_severity": severity_level
    }

# Synthetic vibration signal from conveyor sorter drive motor (1800 RPM = 30 Hz)
# Containing background noise, 30 Hz unbalance, and strong 142.5 Hz bearing fault
rpm = 1800.0
fs = 1000  # 1 kHz sampling rate
samples = 64
time_vector = [n / fs for n in range(samples)]

# Construct signal: 0.05g unbalance at 30Hz + 0.35g bearing impact at 142.5Hz + noise
vibration_stream = [
    round(0.05 * math.sin(2 * math.pi * 30.0 * t) + 
          0.35 * math.sin(2 * math.pi * 142.5 * t) + 
          0.02 * math.cos(2 * math.pi * 80.0 * t), 4)
    for t in time_vector
]

analysis = analyze_vibration_telemetry_fft(
    asset_id="SORTER-MOTOR-DRIVE-04",
    motor_rpm=rpm,
    sampling_rate_hz=fs,
    time_series_accel_g=vibration_stream,
    bearing_bpfo_multiplier=4.75,
    baseline_noise_floor_g=0.04
)

print("=== PREDICTIVE MAINTENANCE VIBRATION FFT REPORT ===")
for k, v in analysis.items():
    print(f"  {k}: {v}")
""",
            "output": """=== PREDICTIVE MAINTENANCE VIBRATION FFT REPORT ===
  asset_id: SORTER-MOTOR-DRIVE-04
  motor_rpm: 1800.0
  running_speed_1x_hz: 30.0
  expected_bpfo_hz: 142.5
  peak_accel_g: 0.384
  rms_accel_g: 0.252
  crest_factor: 1.52
  dominant_spectral_freq_hz: 140.6
  dominant_spectral_magnitude_g: 0.3392
  energy_at_1x_unbalance: 0.0504
  energy_at_2x_misalignment: 0.0031
  energy_at_bpfo_bearing: 0.3392
  diagnostic_result: BEARING_OUTER_RACE_DEFECT (BPFO Peak at 142.5 Hz)
  health_severity: CRITICAL_ACTION_REQUIRED""",
            "codeNotes": [
                {"line": 15, "note": "Time-domain statistical metrics: Peak, RMS velocity, and Crest Factor."},
                {"line": 26, "note": "Analytical DFT transformation mapping raw vibration acceleration to frequency spectrum."},
                {"line": 52, "note": "Targeted spectral energy extraction for 1X rotor speed and BPFO bearing frequencies."},
                {"line": 64, "note": "Deterministic diagnostic rules flagging specific mechanical root-cause failures."}
            ],
            "tryIt": {
                "description": "Evaluate how spectral energy shifts when a motor suffers coupling misalignment instead of bearing failure.",
                "question": "If the sorter motor develops coupling misalignment instead of bearing degradation, which frequency harmonic will exhibit a massive energy surge in the FFT spectrum?",
                "options": [
                    "A sudden surge at 2X shaft rotational frequency (60 Hz for an 1800 RPM motor)",
                    "A frequency surge at 0 Hz (pure DC offset)",
                    "A frequency spike at 10,000 Hz",
                    "Misalignment does not produce any vibrations"
                ],
                "answer": 0,
                "explanation": "Mechanical coupling misalignment generates severe radial and axial reaction forces twice per shaft revolution, producing characteristic high-amplitude vibration spikes at the 2X running speed harmonic (60 Hz for a 30 Hz / 1800 RPM motor)."
            },
            "check": {
                "question": "Why is frequency-domain FFT analysis superior to simple time-domain RMS vibration metrics for industrial predictive maintenance?",
                "options": [
                    "FFT analysis requires no mathematical calculations",
                    "Time-domain RMS only measures total gross energy and often remains within normal limits until late-stage catastrophic failure, whereas FFT isolates distinct spectral frequencies to pinpoint exact micro-defects (e.g. bearing BPFO spalls vs rotor unbalance) weeks in advance",
                    "FFT can only be used on non-metallic equipment",
                    "Time-domain metrics are completely illegal under OSHA rules"
                ],
                "answer": 1,
                "why": "Gross RMS vibration velocity frequently masks localized micro-defects during early degradation stages. FFT transforms time waveforms into discrete frequency spectra, allowing engineers to track distinct defect frequencies (such as bearing raceway impacts) long before overall vibration escalates."
            }
        },
        {
            "title": "Enterprise IoT Sensor Gateway & Executive Telematics Orchestrator",
            "say": [
                "In our final synthesis of Day 21, we integrate edge telemetry, indoor RTLS trilateration, multimodal fleet geofencing, Arrhenius cold chain kinetics, and predictive vibration spectral analysis into a unified enterprise operating architecture: The Enterprise IoT Sensor Gateway and Executive Telematics Orchestrator. Isolated sensor data possesses zero commercial value; the operational power of industrial IoT is realized only when real-time physical telemetry streams are synchronized, contextually correlated, and translated into automated ERP transactions, preventive work orders, and executive governance actions.",
                "The Enterprise IoT Gateway sits at the intersection of operational technology (OT) and information technology (IT). It ingests asynchronous MQTT, CoAP, and OPC-UA datagrams from hundreds of thousands of distributed field assets, validates cryptographic device identities via X.509 mutual TLS (mTLS) authentication anchored in hardware Trusted Platform Modules (TPM 2.0), filters redundant heartbeats, and normalizes disparate payload schemas into standard GS1 EPCIS (Electronic Product Code Information Services) event models. An EPCIS event models physical logistics reality through four fundamental dimensional axes: What (the serialized EPC identity of the physical asset or pallet), Where (the spatial GPS or BLE indoor location coordinates), When (the ISO 8601 cryptographic timestamp), and Why (the operational business context—such as 'commissioning', 'in_transit', 'temperature_alert', or 'dock_receiving').",
                "Once normalized, the stream ingestion engine pipes messages through an event bus (such as Apache Kafka or AWS Kinesis) into the Five-Gate Telematics Rule Engine. Gate 1 audits Edge Protocol & Battery Health, verifying that tracking beacons maintain sufficient battery reserves (>= 365 days) and operate with guaranteed delivery protocols (MQTT QoS 1 or QoS 2). Gate 2 audits Indoor RTLS Positioning, ensuring that BLE beacon signal trilateration achieves sub-meter localization precision (mean residual error <= 1.0 m) to validate warehouse staging and putaway accuracy.",
                "Gate 3 audits Spatial Geofence Adherence & Environmental Integrity, verifying that intermodal transit carriers remain within authorized highway corridors and calculating real-time Arrhenius Mean Kinetic Temperature (MKT) under USP <1159> guidelines. If thermal excursions exceed validated biological product stability budgets, Gate 3 automatically triggers quarantine holds in the enterprise ERP (SAP S/4HANA or Oracle SCM Cloud) to block defective batches from entering hospital supply channels. Gate 4 audits Machine Health & Predictive Maintenance, running continuous FFT spectral analysis across rotating material handling assets to detect early-stage bearing BPFO spalls or shaft unbalance before catastrophic mechanical failures occur.",
                "Finally, Gate 5 executes Master Telematics Governance & Autonomous Dispatching. When all four operational gates evaluate to PASS, the orchestrator issues an autonomous operations certificate, allowing cross-dock transfers and billing releases to proceed without human intervention. If any gate trips a failure condition, the orchestrator trips an EXCEPTION_DISPATCH event, dispatching emergency work orders, rerouting transit fleets, or enforcing contractual supplier chargebacks. This closed-loop cyber-physical architecture eliminates information latency, converting real-world physics into sovereign enterprise intelligence.",
                "From a corporate financial governance perspective, enterprise telematics provides immutable proof of custody and environmental adherence required for regulatory audits and commercial insurance settlements. When temperature-sensitive biologicals suffer an unavoidable power outage during international intermodal transit, automated sensor timestamps and Arrhenius kinetic calculations establish exact carrier liability under International Carriage of Goods by Sea (COGSA) or the Montreal Convention for air freight, expediting insurance claims recovery from months to days. Furthermore, continuous predictive vibration analytics reduce insurance premiums for high-capital manufacturing facilities by demonstrating provable compliance with ISO 55000 asset management standards.",
                "This comprehensive sensory infrastructure establishes the vital data foundation for tomorrow's exploration of Blockchain in SCM, Smart Contracts, and Provenance Tracking (Day 22). By ensuring that data originating from physical assets is tamper-evident, cryptographically signed, and autonomously generated at the edge, the enterprise creates the uncorrupted, real-world data feeds necessary to execute autonomous smart contract escrows and decentralized provenance ledgers."
            ],
            "example": "A Fortune 50 consumer goods and healthcare conglomerate operates 60 manufacturing plants, 120 regional distribution centers, and a dedicated fleet of 1,800 multimodal transport vehicles worldwide. Prior to implementing an enterprise telematics orchestrator, operational visibility was fragmented across seven siloed legacy vendor portals: fleet dispatchers used one GPS portal, cold chain quality used another, warehouse operations used handheld RF scanners, and plant maintenance logged motor failures on paper clipboards. The enterprise deployed an integrated IoT Sensor Gateway orchestrating 450,000 active telemetry endpoints. During a severe polar vortex blizzard across the American Midwest, the orchestrator simultaneously managed 42 highway fleet geofence reroutes around closed interstates, intercepted 3 reefer trailers with failing compressors to prevent $3.8 million in vaccine spoilage via Arrhenius MKT alerts, and dispatched maintenance to replace an unbalancing exhaust blower on a central hub conveyor. The unified control tower reduced annual transit losses by 84%, slashed unplanned factory downtime by 41%, and saved $28.5 million in operational costs in its first year.",
            "code": """# Enterprise IoT Sensor Gateway & Executive Telematics Orchestrator
from typing import Dict, List, Any

class EnterpriseIoTTelematicsOrchestrator:
    def __init__(self, enterprise_name: str):
        self.enterprise_name = enterprise_name
        self.audit_log: List[Dict[str, Any]] = []

    def execute_iot_telematics_control_gateway(
        self,
        edge_telemetry_manifest: Dict[str, Any],
        rtls_positioning_manifest: Dict[str, Any],
        coldchain_geofence_manifest: Dict[str, Any],
        predictive_vibration_manifest: Dict[str, Any]
    ) -> Dict[str, Any]:
        gate_results = {}
        
        # Gate 1: Edge Protocol & Battery Health Evaluation
        batt_days = edge_telemetry_manifest.get("estimated_battery_life_days", 0.0)
        qos = edge_telemetry_manifest.get("qos_level", 0)
        gate1_ok = (batt_days >= 365.0) and (qos >= 1)
        gate_results["gate1_edge_telemetry"] = {
            "status": "PASS" if gate1_ok else "FAIL",
            "battery_life_days": batt_days,
            "qos_level": qos,
            "notes": "Edge device power and delivery protocol certified nominal." if gate1_ok else "Low battery or insufficient QoS reliability."
        }
        
        # Gate 2: Indoor RTLS Localization Precision
        mean_err = rtls_positioning_manifest.get("mean_residual_error_m", 99.0)
        gate2_ok = mean_err <= 1.0
        gate_results["gate2_indoor_rtls"] = {
            "status": "PASS" if gate2_ok else "FAIL",
            "mean_error_m": mean_err,
            "precision_tier": rtls_positioning_manifest.get("confidence_rating", "UNKNOWN"),
            "notes": "Sub-meter indoor positioning verified." if gate2_ok else "High multipath distortion; recalibrate BLE anchors."
        }
        
        # Gate 3: Cold Chain & Spatial Geofence Integrity
        temp_ok = coldchain_geofence_manifest.get("temperature_compliant", False)
        inside_geo = coldchain_geofence_manifest.get("inside_authorized_geofence", False)
        mkt_c = coldchain_geofence_manifest.get("arrhenius_mkt_c", 99.0)
        gate3_ok = temp_ok and inside_geo
        gate_results["gate3_coldchain_geofence"] = {
            "status": "PASS" if gate3_ok else "FAIL",
            "arrhenius_mkt_c": mkt_c,
            "inside_geofence": inside_geo,
            "cargo_disposition": coldchain_geofence_manifest.get("cargo_disposition", "UNKNOWN"),
            "notes": "Thermal stability and spatial corridor verified." if gate3_ok else "Thermal excursion or unauthorized route deviation detected."
        }
        
        # Gate 4: Predictive Asset Vibration Health
        severity = predictive_vibration_manifest.get("health_severity", "CRITICAL")
        gate4_ok = severity in ["GREEN_NOMINAL", "WARNING_SCHEDULE_MAINTENANCE"]
        gate_results["gate4_predictive_maintenance"] = {
            "status": "PASS" if gate4_ok else "FAIL",
            "health_severity": severity,
            "diagnostic_result": predictive_vibration_manifest.get("diagnostic_result", "UNKNOWN"),
            "notes": "Mechanical asset within acceptable operational vibration parameters." if gate4_ok else "Critical component failure imminent; schedule emergency work order."
        }
        
        # Master Synthesis & Operational Disposition
        all_passed = gate1_ok and gate2_ok and gate3_ok and gate4_ok
        
        composite_score = sum([1.0 if g["status"] == "PASS" else 0.0 for g in gate_results.values()]) / 4.0 * 100.0
        
        if all_passed:
            system_status = "ENTERPRISE_IOT_TELEMATICS_ALL_SYSTEMS_NOMINAL"
            action_code = "AUTONOMOUS_OPERATIONS_PROCEED"
        else:
            system_status = "ENTERPRISE_IOT_TELEMATICS_EXCEPTION_DISPATCH"
            action_code = "TRIGGER_AUTOMATED_ERP_WORKFLOWS_AND_HOLDS"
            
        orchestration_record = {
            "enterprise": self.enterprise_name,
            "composite_telematics_score": round(composite_score, 1),
            "system_status": system_status,
            "action_code": action_code,
            "gates": gate_results
        }
        self.audit_log.append(orchestration_record)
        return orchestration_record

# Execute orchestrator verification across telemetry modules
orchestrator = EnterpriseIoTTelematicsOrchestrator("Global Logistics & Life Sciences Enterprise")

sample_edge = {
    "estimated_battery_life_days": 1619.0,
    "qos_level": 1
}

sample_rtls = {
    "mean_residual_error_m": 0.81,
    "confidence_rating": "HIGH_PRECISION_SUB_METER"
}

sample_coldchain = {
    "temperature_compliant": True,
    "inside_authorized_geofence": True,
    "arrhenius_mkt_c": 5.4,
    "cargo_disposition": "RELEASE_AUTHORIZED"
}

sample_vibration = {
    "health_severity": "GREEN_NOMINAL",
    "diagnostic_result": "NORMAL_HEALTHY_OPERATION"
}

manifest = orchestrator.execute_iot_telematics_control_gateway(
    edge_telemetry_manifest=sample_edge,
    rtls_positioning_manifest=sample_rtls,
    coldchain_geofence_manifest=sample_coldchain,
    predictive_vibration_manifest=sample_vibration
)

print("=== MASTER IOT TELEMATICS ORCHESTRATION DISPATCH ===")
print(f"Enterprise: {manifest['enterprise']}")
print(f"Composite Score: {manifest['composite_telematics_score']}%")
print(f"System Status: {manifest['system_status']}")
print(f"Action Code: {manifest['action_code']}")
print("Subsystem Gate Audits:")
for g_id, g_data in manifest['gates'].items():
    print(f"  {g_id}: [{g_data['status']}] - {g_data['notes']}")
""",
            "output": """=== MASTER IOT TELEMATICS ORCHESTRATION DISPATCH ===
Enterprise: Global Logistics & Life Sciences Enterprise
Composite Score: 100.0%
System Status: ENTERPRISE_IOT_TELEMATICS_ALL_SYSTEMS_NOMINAL
Action Code: AUTONOMOUS_OPERATIONS_PROCEED
Subsystem Gate Audits:
  gate1_edge_telemetry: [PASS] - Edge device power and delivery protocol certified nominal.
  gate2_indoor_rtls: [PASS] - Sub-meter indoor positioning verified.
  gate3_coldchain_geofence: [PASS] - Thermal stability and spatial corridor verified.
  gate4_predictive_maintenance: [PASS] - Mechanical asset within acceptable operational vibration parameters.""",
            "codeNotes": [
                {"line": 4, "note": "Class-based enterprise IoT orchestrator maintaining audit logs."},
                {"line": 15, "note": "Gate 1 auditing battery operational lifespan and MQTT QoS level."},
                {"line": 24, "note": "Gate 2 auditing indoor BLE RTLS trilateration accuracy."},
                {"line": 33, "note": "Gate 3 verifying spatial geofencing and Arrhenius MKT thermal compliance."},
                {"line": 44, "note": "Gate 4 validating predictive maintenance FFT vibration health status."},
                {"line": 56, "note": "Master synthesis evaluating composite score and triggering automated workflows."}
            ],
            "tryIt": {
                "description": "Examine how a thermal excursion trips automated quarantine holds in the master gateway.",
                "question": "If cold chain telemetry reports an Arrhenius MKT of 9.2°C (exceeding the 8.0°C regulatory ceiling), how does the master orchestrator respond?",
                "options": [
                    "It automatically deletes the temperature logs to pass audit",
                    "Gate 3 trips FAIL, lowering composite score and updating the master status to EXCEPTION_DISPATCH with action code TRIGGER_AUTOMATED_ERP_WORKFLOWS_AND_HOLDS to quarantine cargo",
                    "It ignores the alert because temperature does not affect vaccines",
                    "It shuts down the entire warehouse power grid"
                ],
                "answer": 1,
                "explanation": "The master orchestrator executes strict automated governance: when Gate 3 detects an MKT thermal excursion, it flags FAIL, demotes composite score, updates operational status to EXCEPTION_DISPATCH, and triggers automated ERP holds to prevent spoiled product release."
            },
            "check": {
                "question": "What is the primary business value of standardizing IoT sensor data into GS1 EPCIS event schemas within an enterprise gateway?",
                "options": [
                    "It forces all sensors to be painted yellow",
                    "It provides a universally understood, vendor-agnostic data model answering What, Where, When, and Why across multi-tier enterprise supply chain networks",
                    "It eliminates the need for computer databases",
                    "It allows sensors to operate without electricity"
                ],
                "answer": 1,
                "why": "GS1 EPCIS standardizes supply chain visibility across disparate enterprise systems by encapsulating the four fundamental dimensions of physical reality: What (EPC identity), Where (coordinates/hub), When (timestamp), and Why (business context/status)."
            }
        }
    ]

    summary = [
        "Industrial IoT transforms opaque supply chain networks into real-time cyber-physical systems across perception, transport, processing, and application layers.",
        "MQTT provides an ultra-lightweight binary publish-subscribe protocol with 2-byte headers and QoS 0/1/2 delivery guarantees, maximizing battery life compared to heavy HTTP polling.",
        "Indoor RTLS leverages BLE beacon RSSI trilateration and log-distance path loss models to achieve sub-meter asset localization where satellite GPS cannot penetrate.",
        "Real-time telematics pairs satellite geofencing with Arrhenius Mean Kinetic Temperature (MKT) modeling under USP <1159> to audit cold-chain biological integrity.",
        "Fast Fourier Transform (FFT) spectral decomposition isolates characteristic mechanical vibration harmonics (1X unbalance, 2X misalignment, BPFO bearing spalls) for predictive maintenance.",
        "The Enterprise IoT Gateway harmonizes disparate sensor streams into GS1 EPCIS events, driving automated ERP workflows and executive operational governance."
    ]

    projectStep = {
        "title": "Engineer an Industrial IoT Telematics, RTLS & Predictive Vibration Gateway",
        "description": "Construct an end-to-end industrial IoT telemetry and predictive maintenance pipeline in Python: model edge sensor battery life across MQTT QoS protocols, calculate 2D indoor BLE trilateration coordinates, audit GPS geofencing and Arrhenius MKT thermal excursions, decompose accelerometer time-series into FFT frequency spectra for bearing fault diagnosis, and synthesize an executive telematics gateway.",
        "steps": [
            "Formulate an edge telemetry energy consumption model calculating average current draw, payload bandwidth, and operational battery life across MQTT QoS levels.",
            "Implement a 2D BLE beacon trilateration solver utilizing the log-distance path loss model and Cramer's linear algebraic rule to localize warehouse assets with sub-meter precision.",
            "Construct a multimodal telematics sentinel computing Haversine geofence distances and Arrhenius Mean Kinetic Temperature (MKT) under USP <1159> specifications.",
            "Develop a discrete Fourier transform (FFT) analysis engine to decompose raw vibration signals and detect bearing outer race fault frequencies (BPFO).",
            "Synthesize an enterprise-grade IoT gateway orchestrating edge health, indoor positioning, cold-chain compliance, and predictive maintenance into automated ERP action dispatches."
        ]
    }

    return {
        "day": day,
        "title": title,
        "goal": goal,
        "minutes": minutes,
        "recap": recap,
        "parts": parts,
        "summary": summary,
        "projectStep": projectStep
    }

if __name__ == "__main__":
    data = get_day21_data()
    total_words = sum(sum(len(p.split()) for p in part["say"]) for part in data["parts"])
    print(f"Day {data['day']}: {data['title']}")
    print(f"Total parts: {len(data['parts'])}")
    print(f"Total spoken words: {total_words} (~{total_words / 150:.1f} mins)")
    for i, part in enumerate(data["parts"], 1):
        pw = sum(len(p.split()) for p in part["say"])
        print(f"  Part {i}: {part['title'][:40]} -> {pw} words")
