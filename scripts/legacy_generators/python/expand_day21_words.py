# scripts/expand_day21_words.py
import json

with open("scripts/iot_net_day21.json", "r", encoding="utf-8") as f:
    d = json.load(f)

expansions = [
    # Part 1 addition
    (
        "From an architectural standpoint, buffer management across these four protocol stages requires strict static memory discipline. "
        "Dynamic memory allocations via malloc or new are strictly forbidden in flight-critical and safety-certified industrial embedded firmware. "
        "A typical firmware implementation allocates a single contiguous memory arena—often termed the packet buffer—in the microcontroller's internal SRAM. "
        "As telemetry data transitions from the sensor driver through the CBOR encoder, CoAP layer, DTLS encryption engine, and 6LoWPAN compressor, "
        "the firmware utilizes head-room reservation techniques. Buffer space is pre-allocated at the start of the buffer for lower-layer headers, "
        "allowing each protocol layer to prepend its specific binary header without moving or copying the underlying sensor payload bytes in memory. "
        "This zero-copy architecture minimizes CPU memory bus cycles, reduces instruction pipeline stalls, and ensures that the entire serialization, "
        "encryption, and adaptation pipeline executes in under 150 microseconds on a standard 64-megahertz ARM Cortex-M4 microcontroller core."
    ),
    # Part 2 addition
    (
        "When engineering CBOR telemetry encoders for high-reliability embedded platforms, field alignment and deterministic data representations "
        "must be guaranteed across heterogeneous microcontroller architectures. Standard microprocessors exhibit varying endianness and struct padding rules. "
        "If a developer naively attempts to cast a C-style struct directly to a network byte stream, memory alignment padding bytes inserted by the compiler "
        "will corrupt the data and waste precious radio spectrum. CBOR eliminates this fragility by enforcing canonical, big-endian network byte ordering "
        "and explicit type prefixes for every serialized field. When packing floating-point measurements such as temperature or humidity, the encoder "
        "carefully validates numerical limits to prevent undefined behavior. For example, sensor readings can often be scaled into fixed-point integers—such "
        "as storing millidegrees Celsius inside an unsigned 16-bit integer—yielding even higher compression ratios while avoiding floating-point emulation libraries "
        "on ultra-low-cost microcontrollers lacking hardware floating-point units (FPUs). This mechanical rigor ensures that every single bit transmitted over "
        "the antenna conveys meaningful physical telemetry."
    ),
    # Part 3 addition
    (
        "The state machine governing CoAP Confirmable transactions is specifically engineered to handle the unpredictable packet error rates of wireless links. "
        "When a node transmits a CON request, it starts a retransmission timer initialized to a random duration between ACK_TIMEOUT (typically 2.0 seconds) "
        "and ACK_TIMEOUT multiplied by ACK_RANDOM_FACTOR (typically 1.5, giving a range of 2.0 to 3.0 seconds). If no Acknowledgement is received before the timer fires, "
        "the engine doubles the timeout interval (exponential backoff) and retransmits the exact same datagram with the identical Message ID. "
        "This exponential backoff continues up to MAX_RETRANSMIT attempts (standard default of 4). If all retransmissions fail without an ACK, the transaction engine "
        "notifies the application layer of communication loss, allowing the sensor node to buffer telemetry records in non-volatile flash memory or trigger mesh route recovery. "
        "Furthermore, by maintaining a duplicate detection cache indexed by Message ID and remote endpoint address, the server guarantees idempotency, ensuring that retransmitted "
        "requests are never executed multiple times on physical industrial actuators."
    ),
    # Part 4 addition
    (
        "Cryptographic state synchronization in DTLS over lossy wireless mesh topologies requires careful handling of epoch boundaries and sequence rollover. "
        "The 16-bit Epoch field prevents confusion during cryptographic re-keying operations. If an enterprise gateway initiates a key renegotiation handshake, "
        "packets encrypted under the previous key retain Epoch 1, while newly encrypted packets transition to Epoch 2. The sensor node can accept both epochs "
        "during the transition grace window, preventing dropped telemetry packets while new session keys propagate through the mesh. "
        "Simultaneously, the 48-bit Sequence Number provides an astronomically large sequence space: transmitting one packet every second would require over "
        "8.9 million years to exhaust the sequence space, eliminating any possibility of sequence number rollover attacks. "
        "Coupled with the 64-bit sliding window, this provides mathematical certainty against replay attacks without requiring the constrained node to persist "
        "voluminous packet history in precious SRAM."
    ),
    # Part 5 addition
    (
        "The profound impact of 6LoWPAN IPHC header compression becomes glaringly evident when evaluating multi-hop mesh battery economics. "
        "In a multi-hop wireless grid covering an industrial facility or smart utility network, a packet transmitted by an edge node may traverse five to ten router hops "
        "before reaching the border router gateway. In uncompressed IPv6 networks, transmitting 48 bytes of redundant IP and UDP headers across ten wireless hops burns "
        "480 byte-transmissions of energy purely on routing overhead. By compressing these headers to 6 bytes, the multi-hop transmission burden drops to just 60 byte-transmissions—an "
        "eight-fold reduction in network-wide radio energy expenditure. This dramatic conservation of energy directly prevents router battery starvation, minimizes radio interference "
        "across adjacent RF channels, and allows industrial networks to operate reliably for ten to fifteen years on lithium-thionyl chloride battery cells without maintenance."
    )
]

for idx, exp in enumerate(expansions):
    d["parts"][idx]["say"].append(exp)

with open("scripts/iot_net_day21.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Expanded scripts/iot_net_day21.json successfully.")
