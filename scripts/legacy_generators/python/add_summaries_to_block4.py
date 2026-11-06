import json

with open("scripts/block4_iot_net_all_days.json", "r", encoding="utf-8") as f:
    days = json.load(f)

# Summaries for Days 16-20
summaries = {
    16: [
        "CoAP binary header is strictly fixed at 4 bytes (Ver, Type, TKL, Code, MsgID) over UDP port 5683.",
        "Delta encoding enables lightweight option serialization without transmitting full option numbers.",
        "Observe (RFC 7641) delivers asynchronous pub/sub state updates linked via client-generated Tokens.",
        "Blockwise transfers (RFC 7959) break large payloads into powers-of-two chunks fitting link MTUs.",
        "Piggybacked ACKs eliminate redundant transmissions by bundling response payloads into ACK datagrams."
    ],
    17: [
        "MQTT-SN replaces long UTF-8 strings with 2-byte Topic IDs via the REGISTER/REGACK handshake.",
        "Client sleep states allow nodes to disconnect radios and retrieve buffered downlinks using PINGREQ wakeups.",
        "Aggregating gateways multiplex thousands of sensor nodes over a single pooled cloud TCP connection.",
        "QoS -1 enables fire-and-forget single datagram bursts without connection establishment.",
        "MQTTSNGatewayEngine translates wireless UDP frames to cloud MQTT broker uplinks seamlessly."
    ],
    18: [
        "CBOR (RFC 8949) uses uniform 3-bit Major Types to encode data with minimal decoding logic.",
        "Native Byte Strings eliminate the 33% Base64 ASCII bloat required by JSON payloads.",
        "Integer keys in CBOR maps drastically reduce dictionary key overhead compared to string keys.",
        "Uniform type regularity gives CBOR deterministic parsing guarantees superior to MessagePack.",
        "Cutting serialization footprints directly preserves LPWAN radio duty cycles and battery life."
    ],
    19: [
        "DTLS 1.2 record headers add 13 bytes of security metadata to each datagram over UDP.",
        "HelloVerifyRequest stateless cookies defend resource-constrained IoT servers against UDP spoofing DoS.",
        "The RFC 6347 64-bit sliding replay window drops replayed and out-of-window datagrams in microsecond time.",
        "Pre-Shared Key (PSK) ciphersuites execute handshakes ~30x more energy-efficiently than ECDHE.",
        "Production DTLS engines execute replay filtering before decryption to protect hardware accelerators."
    ],
    20: [
        "6LoWPAN bridges the gap between 1280-byte IPv6 MTU requirements and 127-byte 802.15.4 frame constraints.",
        "LOWPAN_IPHC compresses 40-byte IPv6 headers down to 2-7 bytes using stateless MAC address derivation.",
        "LOWPAN_NHC compresses UDP headers from 8 bytes down to 4 bytes using 4-bit port nibble compression.",
        "FRAG1 and FRAGN headers fragment oversized IPv6 datagrams into 8-byte aligned link-layer chunks.",
        "SixLoWPANEngine delivers end-to-end compression, fragmentation, and multihop reassembly verification."
    ]
}

for d in days:
    d_num = d["day"]
    if d_num in summaries:
        d["summary"] = summaries[d_num]

with open("scripts/block4_iot_net_all_days.json", "w", encoding="utf-8") as f:
    json.dump(days, f, indent=2)

print("Added summary arrays to Days 16-20 in scripts/block4_iot_net_all_days.json")
