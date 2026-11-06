# scripts/topup_day31_rigorous.py
import json

with open("scripts/iot_net_day31.json", "r", encoding="utf-8") as f:
    d = json.load(f)

p1_extra = (
    "In industrial process instrumentation, sensors frequently measure physical quantities that require 32-bit single-precision floating-point numbers "
    "or 32-bit signed integers (such as totalized water volume or cumulative kilowatt-hours). "
    "Because the Modbus specification strictly defines registers as 16-bit quantities, transmitting a 32-bit IEEE 754 float requires spanning two consecutive 16-bit registers. "
    "However, because Modbus does not standardize word order for multi-register data types, different PLC and instrument manufacturers adopt divergent endianness conventions: "
    "Big-Endian (ABCD, high word first), Little-Endian (CDAB, low word first), or Byte-Swapped variants (BADC and DCBA). "
    "An enterprise IoT edge gateway must implement configurable byte and word reordering parsers. "
    "By evaluating device profile metadata (such as Modbus device profiles or electronic data sheets), "
    "the gateway unpacks the paired 16-bit integers and converts them into standard IEEE 754 floating-point numbers with bit-perfect mathematical accuracy."
)

p2_extra = (
    "In real-world factory installations, terminating resistors and fail-safe biasing networks are critical to maintaining signal integrity over RS-485 differential lines. "
    "According to transmission line theory, when high-frequency electrical pulses travel along a cable whose electrical length exceeds one-tenth of the signal rise time, "
    "any impedance mismatch at the cable ends causes electromagnetic wave reflections that bounce back and forth, corrupting bit transitions. "
    "To eliminate reflections, a 120-Ohm termination resistor must be installed across Line A and Line B at each physical end of the daisy chain, matching the cable characteristic impedance. "
    "Furthermore, when all transmitters on the half-duplex bus disable their drivers (DE=LOW), the differential bus enters an un-driven high-impedance tri-state condition. "
    "In this floating state, ambient electrical noise can easily induce small differential voltages, causing receiver Schmitt triggers to chatter and inject phantom bytes into UART buffers. "
    "To guarantee stability during bus silence, fail-safe biasing resistor networks pull Line A up to Vcc through a 560-Ohm resistor and pull Line B down to ground through a 560-Ohm resistor, "
    "holding the differential idle voltage securely above the +200 millivolt logic mark threshold."
)

p3_extra = (
    "Modern industrial edge gateways leverage Modbus TCP bridges to integrate legacy factory equipment directly into enterprise MQTT 5.0 and cloud data lakes. "
    "The gateway maintains persistent TCP client sockets connected to dozens of remote Modbus TCP PLCs while simultaneously managing local serial RS-485 master ports. "
    "A high-performance asynchronous event loop (built using epoll or asyncio) multiplexes incoming requests, queuing serial transactions to match the physical baud rate limits of the RS-485 line. "
    "Upon acquiring register responses, the gateway's telemetry pipeline normalizes the raw register arrays into semantic JSON or Google Protocol Buffer messages, "
    "decorating measurements with ISO 8601 UTC timestamps, engineering units (degrees Celsius, bar, liters per minute), and asset metadata tags before publishing them to cloud brokers over mutual TLS."
)

p4_extra = (
    "In complex manufacturing plants containing dozens of variable-speed pumps, conveyors, and furnaces, "
    "a naive linear round-robin polling schedule can result in unacceptably high telemetry latency for safety-critical parameters. "
    "Advanced industrial polling engines implement Tiered Priority Scheduling: high-priority safety interlocks and over-pressure relief valves are polled at 50-millisecond intervals, "
    "standard process telemetry is polled at 500-millisecond intervals, and slow ambient environmental parameters are polled every 10 seconds. "
    "Furthermore, the polling manager tracks physical bus health metrics, including sliding-window packet delivery ratios (PDR) and CRC error frequencies. "
    "If a specific slave begins dropping more than 5% of its frames, the manager automatically flags the node for preventive maintenance, "
    "allowing technicians to inspect loose screw terminals or ground fault shields before a complete communication blackout halts production."
)

p5_extra = (
    "Mastering the architecture and implementation of industrial fieldbuses, serial-to-Ethernet translation bridges, "
    "and fault-tolerant multi-drop polling engines establishes the essential foundation for Month 2 of IoT Networking & Cloud Protocols. "
    "By bridging legacy physical-layer RS-485 differential signals with modern TCP/IP sockets, "
    "you acquire the specialized engineering capabilities required to unlock dark operational technology (OT) data from factory floors "
    "and stream it securely into enterprise cloud analytics platforms, driving the intelligence, efficiency, and sustainability of global industrial operations."
)

d["parts"][0]["say"].append(p1_extra)
d["parts"][1]["say"].append(p2_extra)
d["parts"][2]["say"].append(p3_extra)
d["parts"][3]["say"].append(p4_extra)
d["parts"][4]["say"].append(p5_extra)

with open("scripts/iot_net_day31.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Day 31 rigorous topup complete.")
