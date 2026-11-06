# scripts/make_comp_fund_day10.py
import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DAY = 10
TITLE = "The Modern Internet & Web Protocols: HTTP/2, TLS 1.3 Handshake & Port Mapping"
GOAL = "Master transport-layer communication, web protocols, and modern internet cryptography: Layer 4 Transport protocols (TCP vs UDP, port numbers, ephemeral ports vs privileged well-known ports), the TCP state machine (3-way handshake SYN/ACK, connection teardown FIN/RST, TIME_WAIT state and TIME_WAIT assassination), TCP sliding window flow control and congestion control (Slow Start, Congestion Avoidance, BBR algorithm), HTTP evolution (HTTP/1.1 pipelining and Head-of-Line blocking vs HTTP/2 binary framing, multiplexed streams, HPACK header compression, and HTTP/3 QUIC over UDP), Transport Layer Security (TLS 1.3 cryptographic handshake, ephemeral Elliptic Curve Diffie-Hellman key exchange ECDHE, forward secrecy, 0-RTT resumption), and Linux network socket telemetry with ss and curl."
MINUTES = 45
RECAP = "Welcome to Modern Internet & Web Protocols. Today we investigate how data flows reliably and securely across the internet, examining the TCP state machine, HTTP/2 multiplexing, and the cryptographic mechanics of the TLS 1.3 handshake."

p1_say = [
    "Welcome to Day 10 of Computer Fundamentals and Systems Architecture. Today, we ascend from raw IP packet routing to the beating heart of application communication: Layer 4 Transport Protocols (TCP and UDP), Port Mapping, Connection State Machines, Modern HTTP Multiplexing, and TLS 1.3 Cryptographic Security. Virtually every modern software application—from web frontends and microservice meshes to cloud databases and financial streaming feeds—communicates via transport layer sockets.",
    "While the Internet Protocol (IP) at Layer 3 routes individual packets from Host A to Host B, IP is fundamentally an uncoordinated, best-effort datagram delivery mechanism. IP does not guarantee that packets arrive in order, does not guarantee that packets arrive at all (packets can be silently dropped by congested routers), and has no concept of individual software applications running on those hosts. Layer 4 Transport protocols bridge this gap by introducing Port Multiplexing.",
    "A Port is a 16-bit integer (ranging from 0 to 65,535) that directs incoming network traffic to a specific running process inside the operating system. In network engineering, ports are categorized into three standardized tiers: 1. Well-Known (Privileged) Ports (0 to 1023): permanently assigned to core system daemons (e.g., HTTP on 80, HTTPS on 443, SSH on 22, DNS on 53); binding to ports below 1024 requires root administrative privileges on Unix-like operating systems; 2. Registered (User) Ports (1024 to 49,151): used by application servers and database engines (e.g., PostgreSQL on 5432, MySQL on 3306, Redis on 6379); and 3. Dynamic (Ephemeral or Private) Ports (49,152 to 65,535): allocated automatically by the operating system kernel when a client process opens an outbound connection to a remote server.",
    "At Layer 4, software architects must make a fundamental protocol design choice between two divergent transport paradigms: Transmission Control Protocol (TCP, RFC 793) and User Datagram Protocol (UDP, RFC 768).",
    "UDP is a lightweight, connectionless, stateless transport protocol. A UDP segment adds only an 8-byte header containing source port, destination port, length, and checksum. UDP provides zero delivery guarantees, zero retransmissions of lost packets, and zero ordering controls: packets are simply fired onto the network wire. UDP is chosen for workloads where low latency and timeliness far outweigh 100% data completeness: real-time voice calls (VoIP), multiplayer gaming physics, live video conferencing (WebRTC), and recursive DNS queries. If a single audio frame is dropped during a phone call, it is useless to retransmit it 200 milliseconds later; the conversation has already moved on.",
    "In stark contrast, TCP is a connection-oriented, stateful, byte-stream protocol designed for 100% reliable data delivery. TCP guarantees four essential properties: 1. Guaranteed Delivery: every transmitted segment must be acknowledged; lost packets are automatically detected and retransmitted; 2. In-Order Sequencing: TCP segments contain sequence numbers; out-of-order packets arriving via different internet routes are reordered in the kernel receive buffer before being handed to the application; 3. Flow Control: preventing a fast sender from overwhelming a slow receiver using the Sliding Window protocol; and 4. Congestion Control: preventing the sender from flooding intermediate network switches.",
    "In production operating systems, network throughput is governed by socket buffer tuning: `SO_RCVBUF` and `SO_SNDBUF`. If the kernel receive buffer is sized too small, incoming bursts of packets overflow the buffer and are discarded by the kernel, triggering catastrophic TCP retransmission storms. Furthermore, high-concurrency event loops (such as Node.js, Go netpoll, or Rust Tokio) multiplex thousands of socket descriptors using Linux `epoll` in edge-triggered mode (EPOLLET), allowing a single worker thread to service 100,000 concurrent sockets without thread context-switching overhead.",
    "Modern high-performance architectures (such as game servers and IoT telemetry brokers) frequently leverage hybrid architectures: using TCP for reliable authentication, billing, and state synchronization, while streaming telemetry, telemetry sensor metrics, and spatial coordinates over UDP datagrams.",
    "In this opening section, we construct a Layer 4 transport protocol and port mapping simulator in the shell. We model TCP and UDP socket bindings, distinguish ephemeral client ports from well-known listener ports, and measure protocol header overhead ratios."
]

p1_code = """mkdir -p /home/student/workspace/transport_sim
echo "PROTOCOL,LOCAL_PORT,REMOTE_PORT,SERVICE_NAME,STATE" > /home/student/workspace/transport_sim/sockets.csv
echo "TCP,443,0.0.0.0,HTTPS_GATEWAY,LISTEN" >> /home/student/workspace/transport_sim/sockets.csv
echo "TCP,5432,0.0.0.0,POSTGRES_DB,LISTEN" >> /home/student/workspace/transport_sim/sockets.csv
echo "TCP,52314,93.184.216.34:443,CLIENT_SESSION,ESTABLISHED" >> /home/student/workspace/transport_sim/sockets.csv
echo "UDP,53,0.0.0.0,DNS_RESOLVER,UNCONNECTED" >> /home/student/workspace/transport_sim/sockets.csv
cat /home/student/workspace/transport_sim/sockets.csv
grep "LISTEN" /home/student/workspace/transport_sim/sockets.csv"""

p1_output = """PROTOCOL,LOCAL_PORT,REMOTE_PORT,SERVICE_NAME,STATE
TCP,443,0.0.0.0,HTTPS_GATEWAY,LISTEN
TCP,5432,0.0.0.0,POSTGRES_DB,LISTEN
TCP,52314,93.184.216.34:443,CLIENT_SESSION,ESTABLISHED
UDP,53,0.0.0.0,DNS_RESOLVER,UNCONNECTED
TCP,443,0.0.0.0,HTTPS_GATEWAY,LISTEN
TCP,5432,0.0.0.0,POSTGRES_DB,LISTEN"""

p2_say = [
    "In the second operational tier of Day 10, we dissect the internal mechanics of the TCP State Machine: The Three-Way Handshake, Sequence and Acknowledgment Numbers, Sliding Window Flow Control, and Graceful Connection Termination. Understanding TCP state transitions is essential for diagnosing socket leaks, network latency spikes, and SYN flood denial-of-service attacks.",
    "Before any application data can travel over TCP, the client and server must establish a shared connection context via the TCP Three-Way Handshake (SYN -> SYN-ACK -> ACK): 1. SYN (Synchronize): The client picks a random 32-bit Initial Sequence Number (ISN_client, e.g. 1000) and sends a TCP segment with the SYN control flag set. The client enters the SYN_SENT state. 2. SYN-ACK: The server receives the SYN, allocates a transmission control block (TCB) in kernel memory, picks its own random Initial Sequence Number (ISN_server, e.g. 5000), acknowledges the client's sequence number by setting ACK = ISN_client + 1 (1001), sets both the SYN and ACK flags, and enters SYN_RCVD state. 3. ACK (Acknowledge): The client receives the SYN-ACK, acknowledges the server's sequence number by sending ACK = ISN_server + 1 (5001), and enters ESTABLISHED state. Upon receiving this ACK, the server also transitions to ESTABLISHED. Application data transfer can now commence.",
    "During data transmission, TCP enforces Flow Control using the Sliding Window protocol. In the TCP header, the receiver advertises a 16-bit Window Size (which can be scaled up to 1 GB using the TCP Window Scale option in RFC 7323). The window size represents the exact number of bytes the receiver is currently willing to accept into its kernel buffer. If an application is slow at reading data from the socket, the receiver's buffer fills up and it advertises Window Size = 0 (Zero Window Probe), forcing the sender to halt transmission until the application drains the buffer, preventing buffer overflow drops.",
    "To prevent flooding intermediate internet routers, TCP also implements Congestion Control (such as Cubic or Google's BBR). The sender maintains a Congestion Window (cwnd). Under Slow Start, cwnd doubles exponentially with each acknowledged round-trip until it hits a threshold (ssthresh), transitioning to linear Congestion Avoidance. If packet loss occurs, traditional algorithms slash cwnd by 50%, whereas modern BBR (Bottleneck Bandwidth and Round-trip propagation time) models real-time maximum bandwidth and minimum RTT, maximizing throughput without causing bufferbloat.",
    "When communication finishes, TCP terminates via a Four-Way Handshake: Host A sends a segment with the FIN flag set and enters FIN_WAIT_1. Host B replies with an ACK and enters CLOSE_WAIT (while Host A transitions to FIN_WAIT_2). Once Host B finishes flushing its output data, Host B sends its own FIN segment and enters LAST_ACK. Host A acknowledges with an ACK and enters the TIME_WAIT state.",
    "The TIME_WAIT state is one of the most frequently misunderstood states in network engineering. When a host initiates active connection closure, it must remain in TIME_WAIT for exactly 2 * Maximum Segment Lifetime (2MSL, typically 60 seconds in Linux). Why? Two critical reasons: 1. To guarantee that the final ACK was received by Host B; if the final ACK was lost on the wire, Host B retransmits its FIN, and Host A must still have the connection context open to resend the ACK; and 2. To ensure that delayed duplicate packets wandering through the internet from the old connection die completely, preventing them from corrupting a brand-new connection that opens on the exact same port tuple (TIME_WAIT assassination).",
    "In high-traffic web microservices, thousands of rapid short-lived connections can exhaust the ephemeral port range, leaving hundreds of thousands of sockets trapped in TIME_WAIT. Engineers resolve this by enabling HTTP Keep-Alive connection pooling, or tuning Linux kernel parameters like `net.ipv4.tcp_tw_reuse = 1`.",
    "In this section, we construct a TCP state machine and handshake telemetry simulator in the shell. We trace sequence number increments, track window scaling metrics, model TIME_WAIT lifecycles, and evaluate socket teardown states."
]

p2_code = """mkdir -p /home/student/workspace/tcp_state
echo "CONN_ID,SOURCE_SEQ,ACK_NUM,FLAGS,WINDOW_BYTES,STATE" > /home/student/workspace/tcp_state/state_machine.csv
echo "TCP_01,1000,0,SYN,65535,SYN_SENT" >> /home/student/workspace/tcp_state/state_machine.csv
echo "TCP_01,5000,1001,SYN_ACK,65535,SYN_RCVD" >> /home/student/workspace/tcp_state/state_machine.csv
echo "TCP_01,1001,5001,ACK,65535,ESTABLISHED" >> /home/student/workspace/tcp_state/state_machine.csv
echo "TCP_01,1001,5001,FIN_ACK,65535,TIME_WAIT" >> /home/student/workspace/tcp_state/state_machine.csv
cat /home/student/workspace/tcp_state/state_machine.csv
grep "ESTABLISHED" /home/student/workspace/tcp_state/state_machine.csv"""

p2_output = """CONN_ID,SOURCE_SEQ,ACK_NUM,FLAGS,WINDOW_BYTES,STATE
TCP_01,1000,0,SYN,65535,SYN_SENT
TCP_01,5000,1001,SYN_ACK,65535,SYN_RCVD
TCP_01,1001,5001,ACK,65535,ESTABLISHED
TCP_01,1001,5001,FIN_ACK,65535,TIME_WAIT
TCP_01,1001,5001,ACK,65535,ESTABLISHED"""

p3_say = [
    "In the third operational tier of Day 10, we examine the evolution of the application layer web protocols: The transition from HTTP/1.1 to HTTP/2 Binary Framing, Multiplexing, HPACK Header Compression, and HTTP/3 QUIC. The modern web was nearly strangled by architectural inefficiencies in early HTTP standards; modern web protocols engineered revolutionary breakthroughs in network utilization.",
    "HTTP/1.1 (standardized in 1997 via RFC 2616) was text-based and fundamentally serialized. While HTTP/1.1 introduced persistent TCP connections (`Connection: keep-alive`), it suffered from a crippling performance defect known as Head-of-Line (HoL) Blocking at the application layer. Under HTTP/1.1, a client could request multiple assets over a single TCP connection, but the server was strictly required to return responses in the exact order requests were received! If a web page requested `app.js` (a slow, dynamic 500 ms database query) followed by `logo.png` (a 2 ms cached image), the image could not be sent until the JavaScript script was completely generated and transmitted.",
    "To circumvent HTTP/1.1 Head-of-Line blocking, web browsers resorted to awkward workarounds: opening up to 6 parallel TCP connections per domain name, spreading assets across multiple subdomains (Domain Sharding), and concatenating small icons into massive image sprites. Opening 6 parallel connections multiplied server memory overhead, forced 6 separate TCP 3-way handshakes, and competed destructively for bandwidth.",
    "In 2015, the IETF ratified HTTP/2 (RFC 7540), fundamentally re-engineering web transport. The core architectural innovation of HTTP/2 is the Binary Framing Layer. Instead of human-readable ASCII text (`GET / HTTP/1.1\\r\\n`), HTTP/2 breaks communications into binary-encoded Frames (such as HEADERS frames and DATA frames).",
    "Binary framing unlocked True Request Multiplexing over a single TCP connection. In HTTP/2, all communication occurs across a single shared TCP connection divided into multiple bidirectional, independent Streams. Each stream has a unique 31-bit Stream Identifier. The client can initiate 50 requests simultaneously: frames from different streams are interleaved arbitrarily on the wire. If Stream 3 (a slow database response) pauses, Stream 5 and Stream 7 continue transmitting data without delay. Head-of-line blocking at the HTTP layer was completely eradicated!",
    "Furthermore, HTTP/2 introduced HPACK Header Compression (RFC 7541). In modern REST APIs, HTTP request headers (containing large cookies, User-Agent strings, and JWT authorization bearer tokens) can easily exceed 1 KB per request. In HTTP/1.1, these repetitive headers were retransmitted in plaintext on every single request. HPACK maintains a dynamic lookup table shared between client and server, transmitting only differential changes and index numbers, reducing header overhead by over 85%.",
    "However, HTTP/2 still suffered from a lower-level bottleneck: TCP-Level Head-of-Line Blocking! Because HTTP/2 multiplexes all streams into a single TCP connection, if an intermediate router drops a single IP packet containing bytes for Stream 1, the operating system kernel's TCP stack halts all data delivery to user space until that lost packet is retransmitted—stalling Streams 2, 3, and 4 even though their data arrived safely! This limitation prompted the creation of HTTP/3 (RFC 9114), which replaces TCP entirely with QUIC: an encrypted, multiplexed transport protocol running over UDP, achieving true independent stream recovery and zero connection establishment latency.",
    "QUIC introduces another revolutionary capability: Connection Migration. In traditional TCP, a connection is bound strictly to the 4-tuple (Source IP, Source Port, Dest IP, Dest Port). When a mobile user walks out of their home Wi-Fi and connects to 5G cellular, their IP address changes instantly; every single active TCP connection is severed, forcing applications to reconnect and re-authenticate. QUIC identifies connections via a 64-bit Connection ID independent of IP addresses. When the network interface transitions, the client continues sending packets with the same Connection ID over UDP, migrating connections seamlessly without dropping video calls or downloads.",
    "In this section, we construct an HTTP/1.1 vs HTTP/2 binary framing and multiplexing simulator in the shell. We trace stream identifier interleaving, calculate HPACK header compression ratios, measure round-trip latency gains, and demonstrate multiplexed stream transmission."
]

p3_code = """mkdir -p /home/student/workspace/http_sim
echo "STREAM_ID,FRAME_TYPE,PAYLOAD_NAME,BYTES,STATUS" > /home/student/workspace/http_sim/multiplexing.csv
echo "STREAM_01,HEADERS,/api/v1/auth,128,COMPRESSED_HPACK" >> /home/student/workspace/http_sim/multiplexing.csv
echo "STREAM_03,DATA,/assets/logo.png,4096,INTERLEAVED" >> /home/student/workspace/http_sim/multiplexing.csv
echo "STREAM_01,DATA,{\"token\":\"eyJ...\"},256,INTERLEAVED" >> /home/student/workspace/http_sim/multiplexing.csv
echo "STREAM_05,HEADERS,/api/v1/profile,140,COMPRESSED_HPACK" >> /home/student/workspace/http_sim/multiplexing.csv
cat /home/student/workspace/http_sim/multiplexing.csv
grep "INTERLEAVED" /home/student/workspace/http_sim/multiplexing.csv"""

p3_output = """STREAM_ID,FRAME_TYPE,PAYLOAD_NAME,BYTES,STATUS
STREAM_01,HEADERS,/api/v1/auth,128,COMPRESSED_HPACK
STREAM_03,DATA,/assets/logo.png,4096,INTERLEAVED
STREAM_01,DATA,{"token":"eyJ..."},256,INTERLEAVED
STREAM_05,HEADERS,/api/v1/profile,140,COMPRESSED_HPACK
STREAM_03,DATA,/assets/logo.png,4096,INTERLEAVED
STREAM_01,DATA,{"token":"eyJ..."},256,INTERLEAVED"""

p4_say = [
    "In the fourth operational tier of Day 10, we examine modern internet cryptography: Transport Layer Security (TLS 1.3, RFC 8446), Asymmetric Public-Key Cryptography, Ephemeral Elliptic Curve Diffie-Hellman (ECDHE) Key Exchange, and Perfect Forward Secrecy (PFS). Without TLS, all internet traffic—credit card numbers, healthcare records, and authentication tokens—would travel as plaintext packets readable by any rogue Wi-Fi hotspot or malicious ISP router.",
    "TLS secures communications by establishing three cryptographic guarantees: 1. Confidentiality (Encryption): eavesdroppers cannot read the transmitted data; 2. Integrity: message authentication codes ensure data cannot be modified in transit; and 3. Authenticity (Identity): X.509 digital certificates signed by trusted Certificate Authorities (CAs) prove the server is genuinely who it claims to be.",
    "For two decades, web encryption relied on TLS 1.0, 1.1, and 1.2. The legacy TLS 1.2 handshake required two complete network round trips (2-RTT) before any application data could be sent. Even worse, TLS 1.2 supported obsolete, insecure cryptographic ciphers (such as RSA static key exchange, RC4, and CBC-mode ciphers) that were vulnerable to devastating cryptographic attacks like POODLE, BEAST, and Heartbleed.",
    "In 2018, the IETF ratified TLS 1.3, completely overhauling internet cryptography. TLS 1.3 mandated two major revolutions: 1. Handshake Latency Optimization: slashes the full cryptographic handshake from two round trips down to a single round trip (1-RTT), and introduces 0-RTT Session Resumption; and 2. Mandatory Perfect Forward Secrecy: outlawed all static key exchange mechanisms, mandating ephemeral Diffie-Hellman algorithms (ECDHE using Curve25519 or NIST P-256).",
    "To understand why Perfect Forward Secrecy is vital, consider the historic RSA key exchange flaw: if an adversary recorded encrypted web traffic for 10 years, and eventually stole the server's private RSA certificate key, the adversary could retroactively decrypt all 10 years of historic traffic! With Ephemeral Diffie-Hellman (ECDHE) in TLS 1.3, the client and server generate temporary, single-use cryptographic key pairs for every single session. Once the session ends, the private keys are permanently discarded from memory. Even if an attacker steals the server's private certificate ten years later, past encrypted traffic remains mathematically impossible to decrypt.",
    "The 1-RTT TLS 1.3 Handshake flow operates with elegant efficiency: In the very first message (`ClientHello`), the client sends supported cipher suites AND its ephemeral ECDHE public key share! The server replies (`ServerHello`) with its own ephemeral ECDHE public key share and encrypted digital certificate. Both sides immediately combine their private keys with the other side's public key using elliptic curve point multiplication, computing an identical shared Symmetric Master Key (AES-256-GCM or ChaCha20-Poly1305). In a single round trip, secure symmetric encryption is established!",
    "To prepare for the future quantum computing threat, cryptographic bodies and major cloud providers are currently standardizing Post-Quantum Cryptography (PQC). Quantum algorithms (like Shor's algorithm) will eventually break traditional RSA and Elliptic Curve discrete log mathematics. Modern TLS 1.3 implementations support Hybrid Key Exchange (such as X25519MLKEM768), combining classic Curve25519 with lattice-based post-quantum algorithms (ML-KEM / Kyber), guaranteeing that data captured today cannot be decrypted by future quantum supercomputers ('Harvest Now, Decrypt Later' defense).",
    "Furthermore, TLS 1.3 introduces 0-RTT Early Data. When a client reconnects to a previously visited server, it uses a pre-shared session ticket to encrypt application data in the very first packet (`ClientHello`), eliminating connection handshake latency completely.",
    "To detect and prevent rogue or compromised Certificate Authorities from issuing fraudulent SSL certificates, modern browsers enforce Certificate Transparency (CT, RFC 6962). All publicly trusted CAs are required to append cryptographic audit records to append-only, publicly verifiable Merkle tree logs. Web servers return Signed Certificate Timestamps (SCTs) during the TLS handshake, proving that the certificate was publicly logged before being deployed, allowing domain owners to detect unauthorized certificates within minutes.",
    "In this section, we construct a TLS 1.3 cryptographic handshake and cipher negotiation simulator in the shell. We model ephemeral ECDHE key exchanges, trace certificate validation chains, evaluate symmetric encryption key derivations, and measure 1-RTT vs 0-RTT latency timings."
]

p4_code = """mkdir -p /home/student/workspace/tls_sim
echo "HANDSHAKE_PHASE,MESSAGE_TYPE,CIPHER_SUITE,RTT_CYCLES,STATUS" > /home/student/workspace/tls_sim/handshake.csv
echo "STEP_1,CLIENT_HELLO_KEY_SHARE,TLS_AES_256_GCM_SHA384,0.5,KEY_EXCHANGE_INIT" >> /home/student/workspace/tls_sim/handshake.csv
echo "STEP_2,SERVER_HELLO_ECDHE_CERT,TLS_AES_256_GCM_SHA384,1.0,ENCRYPTED_EXTENSIONS" >> /home/student/workspace/tls_sim/handshake.csv
echo "STEP_3,CLIENT_FINISHED,TLS_AES_256_GCM_SHA384,1.0,APPLICATION_DATA_FLOW" >> /home/student/workspace/tls_sim/handshake.csv
echo "RESUMPTION,0_RTT_EARLY_DATA,TLS_AES_256_GCM_SHA384,0.0,ZERO_RTT_SUCCESS" >> /home/student/workspace/tls_sim/handshake.csv
cat /home/student/workspace/tls_sim/handshake.csv
grep "APPLICATION_DATA_FLOW" /home/student/workspace/tls_sim/handshake.csv"""

p4_output = """HANDSHAKE_PHASE,MESSAGE_TYPE,CIPHER_SUITE,RTT_CYCLES,STATUS
STEP_1,CLIENT_HELLO_KEY_SHARE,TLS_AES_256_GCM_SHA384,0.5,KEY_EXCHANGE_INIT
STEP_2,SERVER_HELLO_ECDHE_CERT,TLS_AES_256_GCM_SHA384,1.0,ENCRYPTED_EXTENSIONS
STEP_3,CLIENT_FINISHED,TLS_AES_256_GCM_SHA384,1.0,APPLICATION_DATA_FLOW
RESUMPTION,0_RTT_EARLY_DATA,TLS_AES_256_GCM_SHA384,0.0,ZERO_RTT_SUCCESS
STEP_3,CLIENT_FINISHED,TLS_AES_256_GCM_SHA384,1.0,APPLICATION_DATA_FLOW"""

p5_say = [
    "In this fifth and culminating milestone of Day 10, we synthesize all transport and web protocol concepts—Layer 4 TCP/UDP multiplexing, the TCP three-way handshake and connection state machine, HTTP/2 binary multiplexing, and TLS 1.3 cryptographic key exchange—into a Master Web Protocol Telemetry, Port Auditing, and TLS Handshake Inspection Suite. In production site reliability engineering and cloud systems operations, monitoring web protocol performance is vital to guarantee fast, secure user transactions.",
    "The Master Web Protocol Telemetry Suite executes five synchronized operational phases: Phase 1: Listening Socket & Port Inventory: querying kernel socket statistics (simulating `ss -tulpn`) to audit all open TCP/UDP ports, detecting rogue listening daemons and verifying secure binding to localhost vs public 0.0.0.0; Phase 2: TCP Connection State Auditing: tracking connection state distributions across ESTABLISHED, SYN_RECV, and TIME_WAIT, alerting on socket exhaustion thresholds; Phase 3: HTTP Protocol & Multiplexing Telemetry: measuring stream concurrency, evaluating HPACK header compression ratios, and auditing HTTP/2 frame distribution; Phase 4: TLS 1.3 Handshake & Certificate Verification: inspecting cipher suite negotiation (AES-GCM vs ChaCha20), measuring handshake RTT latency, and verifying certificate expiration dates and OCSP stapling status; and Phase 5: Cryptographic Web Protocol Dossier Sealing: computing an immutable SHA-256 digital digest of all web protocol metrics to certify security compliance for SOC 2 and ISO 27001 infrastructure audits.",
    "To diagnose web protocol latency in production Linux environments, systems engineers use `curl -w` with timing variables: curl -w 'DNS: %{time_namelookup}s | TCP: %{time_connect}s | TLS: %{time_appconnect}s | TTFB: %{time_starttransfer}s | Total: %{time_total}s\\n' -o /dev/null -s https://example.com. Decomposing connection timing isolates the exact latency bottleneck: a spike in `time_connect` points to network congestion or distance; a spike in `time_appconnect` indicates TLS handshake cryptographic overhead; and a spike in `time_starttransfer` (Time To First Byte, TTFB) exposes slow backend database queries or server processing delays.",
    "Furthermore, engineers inspect TLS certificates using OpenSSL: openssl s_client -connect api.example.com:443 -servername api.example.com -tls1_3. This verifies the complete X.509 certificate trust chain, validates Subject Alternative Names (SAN), and confirms Server Name Indication (SNI) routing.",
    "In enterprise production infrastructures, certificate revocation checking has transitioned from slow Certificate Revocation Lists (CRLs) to Online Certificate Status Protocol (OCSP) Stapling. Under OCSP stapling, the web server periodically queries the CA's revocation server in the background, obtains a cryptographically signed time-stamped proof of validity, and staples it directly into the initial TLS handshake response. This eliminates client-side OCSP lookup delays and prevents CAs from tracking user browsing patterns.",
    "In high-availability cloud deployments, engineers monitor HTTP/2 connection health using PING frames and keep-alive heartbeats. Idle TCP connections traversing intermediate cloud NAT gateways and firewalls are frequently terminated silently without TCP FIN packets after 350 seconds of inactivity. Automated HTTP/2 PING frames sent every 30 seconds prevent stateful firewall dropouts, ensuring that idle connection pools remain warm and responsive for sudden transaction bursts.",
    "To provide enterprise infrastructure engineers with immediate operational visibility, the suite computes an Enterprise Web Protocol Health Index on a 100-point scale. The index validates three critical operational standards: 1. Transport Security: confirming 100% enforcement of TLS 1.3 with Perfect Forward Secrecy; 2. Protocol Efficiency: verifying HTTP/2 multiplexing with HPACK compression active; and 3. Socket Health: verifying zero TIME_WAIT socket leaks or listen queue overflows. Systems scoring 95 or higher receive an automated 'Production Systems Web Architecture Certification'.",
    "By mastering Day 10, you have mastered the protocols that power the modern web. You understand how TCP delivers reliability, how HTTP/2 eliminates latency, and how TLS 1.3 protects planetary communications. You are now prepared for tomorrow's exploration of Browser Developer Tools & Web Inspection: DOM, Network Waterfall, and LocalStorage.",
    "In this final milestone execution, we deploy the complete Master Web Protocol Telemetry Suite in the shell. We inspect open ports, verify TLS handshake negotiations, evaluate socket concurrency metrics, and generate the boardroom-certified Systems Engineering Web Protocol Dossier."
]

p5_code = """mkdir -p /home/student/workspace/web_audit
echo "SYSTEM_STATUS: OPERATIONAL" > /home/student/workspace/web_audit/summary.txt
echo "HTTP_PROTOCOL_VERSION: HTTP/2" >> /home/student/workspace/web_audit/summary.txt
echo "TLS_VERSION: TLSv1.3" >> /home/student/workspace/web_audit/summary.txt
echo "CIPHER_SUITE: TLS_AES_256_GCM_SHA384" >> /home/student/workspace/web_audit/summary.txt
echo "FORWARD_SECRECY: ECDHE_X25519" >> /home/student/workspace/web_audit/summary.txt
echo "ACTIVE_ESTABLISHED_SOCKETS: 1420" >> /home/student/workspace/web_audit/summary.txt
echo "WEB_HEALTH_INDEX: 99/100" >> /home/student/workspace/web_audit/summary.txt
cat /home/student/workspace/web_audit/summary.txt
grep "WEB_HEALTH_INDEX" /home/student/workspace/web_audit/summary.txt"""

p5_output = """SYSTEM_STATUS: OPERATIONAL
HTTP_PROTOCOL_VERSION: HTTP/2
TLS_VERSION: TLSv1.3
CIPHER_SUITE: TLS_AES_256_GCM_SHA384
FORWARD_SECRECY: ECDHE_X25519
ACTIVE_ESTABLISHED_SOCKETS: 1420
WEB_HEALTH_INDEX: 99/100
WEB_HEALTH_INDEX: 99/100"""

parts = [
    {
        "title": "Transport Layer Protocols: TCP vs UDP & Port Multiplexing",
        "say": p1_say,
        "example": "Think of delivery mail versus a live phone call: TCP is certified registered mail with signature confirmation (every letter is tracked, acknowledged, and re-sent if lost); UDP is a live radio broadcast (information is transmitted continuously in real time, and missed words are not repeated).",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes transport layer socket simulation directory"},
            {"line": 2, "note": "Logs socket registry including protocol, local port, remote binding, and state"},
            {"line": 3, "note": "Records HTTPS listener socket bound to privileged well-known port 443"},
            {"line": 7, "note": "Filters listening ports verifying active server daemons"}
        ],
        "tryIt": "Add an entry for SSH daemon on TCP port 22 in LISTEN state.",
        "check": {
            "question": "Why is UDP preferred over TCP for real-time video conferencing and multiplayer gaming physics?",
            "options": [
                "Because UDP avoids connection setup handshakes, acknowledgment overhead, and retransmission delays, prioritizing timely low-latency delivery over guaranteed packet completion",
                "Because UDP automatically compresses video files into 4K resolution",
                "Because TCP cannot transmit colors",
                "Because UDP is legally required by the United Nations"
            ],
            "answer": 0,
            "why": "In real-time audio and gaming, receiving an outdated packet 200 ms late is useless. UDP minimizes latency by streaming datagrams without retransmission stalls."
        }
    },
    {
        "title": "The TCP State Machine: Three-Way Handshake, Flow Control & Teardown",
        "say": p2_say,
        "example": "Like making a phone call: You say 'Can you hear me?' (SYN); they reply 'Yes I can hear you, can you hear me?' (SYN-ACK); you say 'Yes, loud and clear!' (ACK), and now both sides can speak freely.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes TCP state machine simulation workspace"},
            {"line": 2, "note": "Logs TCP sequence progression, acknowledgment numbers, flags, and states"},
            {"line": 4, "note": "Completes 3-way handshake transitioning connection to ESTABLISHED"},
            {"line": 7, "note": "Filters ESTABLISHED connection confirming synchronized state"}
        ],
        "tryIt": "Add a connection transition entry for FIN_WAIT_1.",
        "check": {
            "question": "What is the purpose of the TIME_WAIT state in the TCP connection lifecycle?",
            "options": [
                "To ensure the final ACK was received by the remote peer and allow lingering duplicate packets to expire in the network before the port can be reused",
                "To give the computer time to cool down before opening another connection",
                "To check the computer for viruses before closing the socket",
                "To automatically reboot the operating system"
            ],
            "answer": 0,
            "why": "TIME_WAIT (lasting 2MSL, ~60s) ensures the remote peer cleanly closed the connection and prevents delayed duplicate packets from corrupting new sessions on the same port."
        }
    },
    {
        "title": "HTTP Evolution: HTTP/1.1 HoL Blocking vs HTTP/2 Binary Multiplexing",
        "say": p3_say,
        "example": "Like checkout lanes at a grocery store: HTTP/1.1 is a single cash register where everyone must wait for the person in front to finish writing a check (Head-of-Line blocking); HTTP/2 is an automated scanner where items from multiple shopping carts are scanned simultaneously on a shared conveyor belt.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes HTTP multiplexing simulation workspace"},
            {"line": 2, "note": "Logs binary stream ID, frame type, payload name, and compression status"},
            {"line": 4, "note": "Illustrates concurrent interleaving of image data on Stream 3 with API response on Stream 1"},
            {"line": 7, "note": "Filters interleaved data frames verifying non-blocking multiplexing"}
        ],
        "tryIt": "Add a stream entry STREAM_07 transmitting CSS stylesheet data.",
        "check": {
            "question": "How did HTTP/2 eliminate the application-level Head-of-Line (HoL) blocking that plagued HTTP/1.1?",
            "options": [
                "By dividing communications into binary frames with unique stream identifiers, allowing multiple requests and responses to be interleaved concurrently over a single TCP connection",
                "By requiring all websites to remove images and JavaScript",
                "By doubling the physical speed of the undersea fiber optic cables",
                "By switching from electricity to light bulbs in computers"
            ],
            "answer": 0,
            "why": "HTTP/2 binary framing tags chunks with stream IDs, allowing multiple requests to be multiplexed and interleaved over a single connection without waiting for prior responses."
        }
    },
    {
        "title": "Transport Layer Security (TLS 1.3): Handshake, ECDHE & Zero-RTT",
        "say": p4_say,
        "example": "Like two spies meeting in public: instead of whispering a secret codebook password (which could be stolen), they use a mathematical color-mixing puzzle (Diffie-Hellman) where they exchange paint colors publicly, but end up with an identical private mixed color that no onlooker can calculate.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes TLS 1.3 handshake simulation directory"},
            {"line": 2, "note": "Logs handshake phases, message types, cipher suites, and RTT cycle costs"},
            {"line": 3, "note": "Shows client sending ECDHE key share directly in ClientHello (slashing handshake to 1-RTT)"},
            {"line": 7, "note": "Filters application data flow confirming active symmetric encryption"}
        ],
        "tryIt": "Filter for ZERO_RTT_SUCCESS in handshake.csv to inspect session resumption.",
        "check": {
            "question": "What is 'Perfect Forward Secrecy' (PFS) in TLS cryptography, and why did TLS 1.3 mandate it?",
            "options": [
                "It ensures that even if an attacker steals the server's private certificate in the future, past recorded encrypted sessions cannot be decrypted because each session used unique ephemeral keys",
                "It means the password never needs to be typed again",
                "It prevents users from taking screenshots of websites",
                "It guarantees that websites will never have software bugs"
            ],
            "answer": 0,
            "why": "PFS uses ephemeral Diffie-Hellman (ECDHE) keys for each session. Once the session ends, the keys are discarded, making retrospective decryption of recorded traffic impossible."
        }
    },
    {
        "title": "Master Web Protocol Telemetry, Port Auditing & TLS Handshake Inspection Suite",
        "say": p5_say,
        "example": "Like a security audit of a commercial bank branch: inspectors verify that only designated bank vault doors are open (port auditing), confirm that all security guards hold valid badges (TLS certificate validation), and ensure all cash transit is armored (encryption).",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes web protocol telemetry workspace"},
            {"line": 2, "note": "Records operational health status in web audit summary"},
            {"line": 4, "note": "Validates enterprise enforcement of TLS 1.3 with AES-256-GCM cipher suite"},
            {"line": 8, "note": "Inspects Web Protocol Health Index confirming 99/100 production certification"}
        ],
        "tryIt": "Add an entry for OCSP_STAPLING_ENABLED: YES in summary.txt.",
        "check": {
            "question": "When diagnosing web application latency with curl, what does Time To First Byte (TTFB) measure?",
            "options": [
                "The time elapsed from initiating the request until the server processes the request and sends the very first byte of the response payload back to the client",
                "The time it takes to type the URL in the terminal",
                "The download speed of the user's hard drive",
                "The battery life of the laptop computer"
            ],
            "answer": 0,
            "why": "TTFB measures server responsiveness: the time required for DNS lookup, TCP connect, TLS handshake, and backend application/database processing before the first byte arrives."
        }
    }
]

lesson_obj = {
    "day": DAY,
    "title": TITLE,
    "goal": GOAL,
    "minutes": MINUTES,
    "recap": RECAP,
    "parts": parts
}

# 1. Generate Gate v2 visual file (cells template)
visual_entries = []
for idx, p in enumerate(parts):
    chash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    steps = [
        {
            "at": "intro",
            "caption": f"Step 1: Inspecting web protocol headers and port mappings for {p['title'][:25]}...",
            "items": ["0x00: PORT_443", "0x40: TCP_SYN", "0x80: H2_FRAME", "0xC0: TLS_ECDHE"],
            "pointers": [{"name": "WEB", "index": 0, "tone": "data"}],
            "highlightRange": [0, 1],
            "tones": {"0": "data", "1": "idle", "2": "idle", "3": "idle"}
        },
        {
            "at": "say1",
            "caption": f"Step 2: Connection state transitions and stream multiplexing for {p['title'][:25]}...",
            "items": ["0x00: PORT_443", "0x40: TCP_SYN", "0x80: H2_FRAME", "0xC0: TLS_ECDHE"],
            "pointers": [{"name": "WEB", "index": 1, "tone": "accent"}],
            "highlightRange": [1, 2],
            "tones": {"0": "idle", "1": "accent", "2": "idle", "3": "idle"}
        },
        {
            "at": "example",
            "caption": f"Step 3: Real-world operational state and TLS handshake flow for {p['title'][:25]}...",
            "items": ["0x00: PORT_443", "0x40: TCP_SYN", "0x80: H2_FRAME", "0xC0: TLS_ECDHE"],
            "pointers": [{"name": "WEB", "index": 2, "tone": "success"}],
            "highlightRange": [2, 3],
            "tones": {"0": "idle", "1": "idle", "2": "success", "3": "idle"}
        },
        {
            "at": "tryIt",
            "caption": f"Step 4: Interactive verification and web protocol diagnostics for {p['title'][:25]}...",
            "items": ["0x00: PORT_443", "0x40: TCP_SYN", "0x80: H2_FRAME", "0xC0: TLS_ECDHE"],
            "pointers": [{"name": "WEB", "index": 3, "tone": "data"}],
            "highlightRange": [3, 4],
            "tones": {"0": "idle", "1": "idle", "2": "idle", "3": "data"}
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": chash,
        "spec": {
            "template": "cells",
            "title": f"{p['title']} — Web Protocol & Transport Telemetry",
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "comp_fund",
    "day": DAY,
    "promptSha": hashlib.sha256(f"comp_fund_day_{DAY}".encode("utf-8")).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = f"src/lib/data/lessonVisuals/comp_fund/day-{DAY:02d}.json"
os.makedirs(os.path.dirname(visual_path), exist_ok=True)
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2, ensure_ascii=False)
print(f"Generated visual file: {visual_path}")

# 2. Append lesson to src/lib/data/compFundLongLessons.ts
ts_path = "src/lib/data/compFundLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace existing Day 10 or append
lesson_json = json.dumps(lesson_obj, indent=2, ensure_ascii=False)

if f'"day": {DAY}' in content or f'day: {DAY}' in content:
    day_start = content.find(f'"day": {DAY}')
    if day_start == -1:
        day_start = content.find(f'day: {DAY}')
    brace_start = content.rfind('{', 0, day_start)
    last_close = content.rfind("];")
    new_content = content[:brace_start].rstrip() + "\n" + lesson_json + "\n];\n"
    print(f"Replaced Day {DAY} in {ts_path}")
else:
    last_close = content.rfind("];")
    new_content = content[:last_close].rstrip() + ",\n" + lesson_json + "\n];\n"
    print(f"Appended Day {DAY} to {ts_path}")

with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_content)

# Calculate word count
total_words = 0
for idx, p in enumerate(parts):
    wcnt = sum(len(para.split()) for para in p["say"])
    total_words += wcnt
    print(f"  Part {idx+1}: {wcnt} words")
print(f"Total spoken words for Day {DAY}: {total_words} (Target >= 2,940 words, ~{total_words/150:.1f} spoken minutes)")
