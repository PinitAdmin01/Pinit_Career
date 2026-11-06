# scripts/make_comp_fund_day09.py
import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DAY = 9
TITLE = "Computer Networking Basics: TCP/IP 4-Layer Model, IPv4 Subnetting & DNS Flow"
GOAL = "Master foundational computer networking architecture and packet flow: OSI 7-layer reference model vs TCP/IP 4-layer internet model, Ethernet link-layer frames, MAC addressing and ARP resolution flow, Network layer IPv4 addressing, Classless Inter-Domain Routing (CIDR) subnet masks and prefix math, default gateway routing, ICMP ping/traceroute diagnostic mechanics, Domain Name System (DNS) recursive resolution hierarchy (Root hints, TLDs, authoritative nameservers), DNS resource records (A, AAAA, CNAME, MX, TXT), and Linux network interface inspection via ip and dig."
MINUTES = 45
RECAP = "Welcome to Computer Networking Basics & Packet Routing. Today we transition from single-node silicon and storage into distributed computer networks, exploring how bits travel across physical Ethernet wires, how IP packets navigate global routing tables via CIDR subnetting, and how recursive DNS resolves human names into IP addresses."

p1_say = [
    "Welcome to Day 9 of Computer Fundamentals and Systems Architecture. Today, we step across the boundary of an isolated computer machine into the global digital fabric of Computer Networking, Packet Switching, and the Internet Architecture. Every microservice invocation, cloud database transaction, and web page load relies upon millions of specialized networking devices coordinating seamlessly across planetary distances.",
    "To comprehend computer networking, engineers study two foundational architectural frameworks: the theoretical OSI 7-Layer Reference Model and the practical, pragmatic TCP/IP 4-Layer Internet Model. The Open Systems Interconnection (OSI) model was developed in the late 1970s by the International Organization for Standardization (ISO) as an idealized conceptual framework. The OSI model partitions network communications into seven strict vertical layers: Layer 1: Physical (cables, fiber optics, radio frequencies, voltages, and bit signaling); Layer 2: Data Link (Ethernet frames, MAC addresses, switches, and hop-to-hop link transmission); Layer 3: Network (IP packets, logical addressing, routers, and path determination); Layer 4: Transport (TCP/UDP segments, port multiplexing, reliability, and flow control); Layer 5: Session (dialog management, session token synchronization, and connection checkpointing); Layer 6: Presentation (data format translation, compression, and encryption/decryption); and Layer 7: Application (user-facing protocols like HTTP, DNS, SMTP, and SSH).",
    "While the OSI model remains the universal mental lexicon for networking engineers (explaining why switches are called 'Layer 2 devices' and routers are called 'Layer 3 devices'), the real-world Internet runs universally on the TCP/IP Model (also known as the Internet Protocol Suite or DoD model, developed by DARPA). The architects of the TCP/IP suite realized that combining Layers 5, 6, and 7 into a single unified Application Layer gave software developers greater flexibility, while simplifying the operating system kernel network stack into four clean, robust layers: 1. Network Access (or Link) Layer; 2. Internet Layer (IP, ICMP, ARP); 3. Transport Layer (TCP, UDP); and 4. Application Layer (HTTP/2, DNS, TLS).",
    "The fundamental principle that governs all internet communication is Encapsulation and Decapsulation. When an application (like a web browser or Python API client) sends data, the payload moves downward through the operating system network stack. At each layer, the operating system prepends a specialized Protocol Header containing routing metadata and control flags: the Application Layer creates HTTP data; the Transport Layer wraps it in a TCP Segment Header (adding source/destination ports and sequence numbers); the Internet Layer wraps the segment in an IP Packet Header (adding source/destination IP addresses and TTL); and the Link Layer encapsulates the packet in an Ethernet Frame Header (adding source/destination MAC addresses) and appends a Frame Check Sequence (FCS CRC-32 checksum) at the tail.",
    "When physical electrical or optical signals arrive at the receiving network interface card (NIC), the reverse process occurs: Decapsulation. The NIC hardware verifies the Ethernet CRC-32 checksum, strips the Link Layer header, and passes the IP packet upward. The operating system kernel verifies the IP header, strips it, inspects the Transport header, and routes the payload to the specific user-space process listening on that destination port number.",
    "This decoupled, layered architecture embodies the famous End-to-End Principle of internet design formulated by Saltzer, Reed, and Clark in 1984: 'The network core should remain simple, dumb, and fast, responsible solely for moving packets between endpoints; all complex intelligence, reliability, state management, and application semantics should reside at the edge endpoints in the host computers.' This brilliant architectural design is why the fundamental IP routing core of the internet has scaled smoothly from a few research universities in 1969 to billions of smartphones, cloud datacenters, and IoT devices today without requiring a global protocol redesign.",
    "Understanding the boundaries between these layers is vital for modern systems debugging. When an API call fails with 'Connection Refused', a systems engineer knows instantly that Layer 1, Layer 2, and Layer 3 were completely successful (the IP packet reached the destination host), but Layer 4 rejected the connection because no process was listening on that target port. Conversely, a 'No Route to Host' error points directly to Layer 3 routing table failures.",
    "In this opening section, we construct a network layer encapsulation and protocol stack simulator in the shell. We model data payloads, trace header prepending across TCP/IP layers, track frame check sequences, and demonstrate programmatic packet decapsulation."
]

p1_code = """mkdir -p /home/student/workspace/net_stack
echo "LAYER,HEADER_TYPE,METADATA,PAYLOAD_BYTES" > /home/student/workspace/net_stack/encapsulation.csv
echo "L4_APP,HTTP_REQUEST,GET /api/v1/health HTTP/1.1,64" >> /home/student/workspace/net_stack/encapsulation.csv
echo "L3_TRANSPORT,TCP_SEGMENT,SRC_PORT:54320 DST_PORT:443 SEQ:101,84" >> /home/student/workspace/net_stack/encapsulation.csv
echo "L2_INTERNET,IP_PACKET,SRC_IP:192.168.1.50 DST_IP:93.184.216.34 TTL:64,104" >> /home/student/workspace/net_stack/encapsulation.csv
echo "L1_LINK,ETHERNET_FRAME,SRC_MAC:00:1A:2B:3C:4D:5E DST_MAC:AA:BB:CC:DD:EE:FF,122" >> /home/student/workspace/net_stack/encapsulation.csv
cat /home/student/workspace/net_stack/encapsulation.csv
grep "IP_PACKET" /home/student/workspace/net_stack/encapsulation.csv"""

p1_output = """LAYER,HEADER_TYPE,METADATA,PAYLOAD_BYTES
L4_APP,HTTP_REQUEST,GET /api/v1/health HTTP/1.1,64
L3_TRANSPORT,TCP_SEGMENT,SRC_PORT:54320 DST_PORT:443 SEQ:101,84
L2_INTERNET,IP_PACKET,SRC_IP:192.168.1.50 DST_IP:93.184.216.34 TTL:64,104
L1_LINK,ETHERNET_FRAME,SRC_MAC:00:1A:2B:3C:4D:5E DST_MAC:AA:BB:CC:DD:EE:FF,122
L2_INTERNET,IP_PACKET,SRC_IP:192.168.1.50 DST_IP:93.184.216.34 TTL:64,104"""

p2_say = [
    "In the second operational tier of Day 9, we examine the physical link layer: Ethernet Frames, Media Access Control (MAC) Addressing, Layer 2 Ethernet Switches, and the Address Resolution Protocol (ARP). Before an IP packet can cross physical wires or radio waves, it must be addressed to a physical piece of silicon on the local local area network (LAN).",
    "Every Network Interface Card (NIC)—whether an onboard Intel gigabit Ethernet controller, a Wi-Fi 7 chip, or a virtual virtio network adapter in a cloud VM—possesses a hardware physical address called a Media Access Control (MAC) Address. A MAC address is a 48-bit (6-byte) hexadecimal identifier formatted as six pairs of characters (such as `00:1A:2B:3C:4D:5E`). The first 24 bits represent the Organizationally Unique Identifier (OUI) assigned by the IEEE to the silicon hardware manufacturer (e.g., Intel, Apple, or Broadcom), while the remaining 24 bits represent the unique device serial number burned into the chip's physical ROM.",
    "Data transmitted across a local Ethernet network is packaged into an Ethernet II Frame. An Ethernet frame consists of: a 7-byte Preamble and 1-byte Start Frame Delimiter (SFD) for hardware clock synchronization; a 6-byte Destination MAC Address; a 6-byte Source MAC Address; a 2-byte EtherType field (indicating whether the inner payload is IPv4 [0x0800], ARP [0x0806], or IPv6 [0x86DD]); a variable payload ranging from 46 to 1,500 bytes (defined by the Maximum Transmission Unit, or MTU); and a 4-byte Frame Check Sequence (FCS) containing a CRC-32 cyclic redundancy checksum to detect physical bit corruption on the wire.",
    "On a local network, devices connect via Ethernet Switches. A switch is an intelligent Layer 2 device that maintains an internal MAC Address Table (also called a Filtering Database or CAM Table). Unlike early, primitive network Hubs that blindly re-broadcast every incoming packet out of every physical port (causing rampant electrical collisions and security snooping), a modern switch inspects the source MAC address of every incoming frame to learn which physical port connects to which device. When a frame arrives destined for MAC address B, the switch looks up B in its CAM table and forwards the frame exclusively out of the single physical port connected to device B, establishing dedicated micro-segmented bandwidth.",
    "This raises a fundamental architectural question: When Host A wants to send an IP packet to Host B on the same local subnet (e.g. IP 192.168.1.100), Host A knows Host B's logical IP address, but how does Host A discover Host B's physical hardware MAC address? The answer is the Address Resolution Protocol (ARP, defined in RFC 826).",
    "Host A constructs an ARP Request packet asking: 'Who has IP 192.168.1.100? Tell 192.168.1.50'. Because Host A does not yet know the destination MAC address, it encapsulates the ARP request inside a Layer 2 Broadcast Frame addressed to the universal broadcast MAC address: `FF:FF:FF:FF:FF:FF`. When the Ethernet switch receives a broadcast frame, it floods the frame out of every active port. Every host on the subnet receives the request, but only the machine whose IP address matches 192.168.1.100 processes it. That target host replies with an ARP Reply packet sent as a direct Unicast frame back to Host A: '192.168.1.100 is at 00:1A:2B:3C:4D:5E'.",
    "To avoid broadcasting ARP queries for every single packet, the operating system caches resolved IP-to-MAC mappings in an in-memory kernel data structure called the ARP Cache (viewable with `ip neigh` or `arp -a`). ARP entries have a time-to-live (TTL) expiration (typically 60 to 300 seconds). However, because ARP lacks cryptographic authentication, local networks are vulnerable to ARP Spoofing (ARP Poisoning), where a malicious attacker broadcasts gratuitous ARP replies claiming their MAC address owns the default gateway IP, routing all subnet traffic through their computer (Man-In-The-Middle attack). Enterprise switches combat this using Dynamic ARP Inspection (DAI).",
    "In this section, we construct an Ethernet frame parser and ARP table simulator in the shell. We model frame encapsulation, trace broadcast ARP resolution requests, inspect unicast replies, and analyze kernel neighbor cache tables."
]

p2_code = """mkdir -p /home/student/workspace/arp_sim
echo "IP_ADDRESS,MAC_ADDRESS,INTERFACE,STATE" > /home/student/workspace/arp_sim/arp_cache.csv
echo "192.168.1.1,00:50:56:FE:ED:01,eth0,REACHABLE" >> /home/student/workspace/arp_sim/arp_cache.csv
echo "192.168.1.100,00:1A:2B:3C:4D:5E,eth0,REACHABLE" >> /home/student/workspace/arp_sim/arp_cache.csv
echo "192.168.1.254,00:50:56:FE:ED:FE,eth0,STALE" >> /home/student/workspace/arp_sim/arp_cache.csv
cat /home/student/workspace/arp_sim/arp_cache.csv
grep "REACHABLE" /home/student/workspace/arp_sim/arp_cache.csv"""

p2_output = """IP_ADDRESS,MAC_ADDRESS,INTERFACE,STATE
192.168.1.1,00:50:56:FE:ED:01,eth0,REACHABLE
192.168.1.100,00:1A:2B:3C:4D:5E,eth0,REACHABLE
192.168.1.254,00:50:56:FE:ED:FE,eth0,STALE
192.168.1.1,00:50:56:FE:ED:01,eth0,REACHABLE
192.168.1.100,00:1A:2B:3C:4D:5E,eth0,REACHABLE"""

p3_say = [
    "In the third operational tier of Day 9, we ascend to Layer 3: The Internet Protocol (IPv4), Classless Inter-Domain Routing (CIDR), Subnet Masking Mathematics, and Default Gateway Routing. While Layer 2 connects computers on the same physical wire, Layer 3 is what connects millions of independent networks into a cohesive worldwide Internet.",
    "An IPv4 address is a 32-bit integer, universally rendered for human readability as four decimal octets separated by dots (Dotted-Decimal Notation, e.g. `192.168.1.100`). Each octet represents 8 bits, spanning decimal values from 0 to 255. The total theoretical IPv4 address space comprises 2^32 = 4,294,967,296 addresses—a number that the world exhausted in February 2011, accelerating the transition to 128-bit IPv6 and ubiquitous Network Address Translation (NAT).",
    "Every IP address is bifurcated into two distinct components: the Network ID (identifying the specific network or subnet) and the Host ID (identifying the specific device on that subnet). In the early internet, addresses were divided into rigid classes: Class A (/8, 16 million hosts), Class B (/16, 65,536 hosts), and Class C (/24, 254 hosts). This rigid scheme caused colossal address waste: an organization with 300 computers was forced to request a Class B block, wasting over 65,000 public IP addresses!",
    "In 1993, the Internet Engineering Task Force (IETF) abolished classful addressing and introduced Classless Inter-Domain Routing (CIDR, RFC 1519). Under CIDR, the boundary between Network ID and Host ID is arbitrary and defined by a Subnet Mask. CIDR notation appends a slash followed by the exact number of contiguous leading binary 1s in the subnet mask (e.g. `/24` represents `255.255.255.0`, meaning the first 24 bits identify the network, and the remaining 32 - 24 = 8 bits identify host machines).",
    "Mastering Subnet Mathematics is an indispensable competency for cloud infrastructure architects and systems engineers. For any CIDR prefix `/N`: 1. The number of host bits is `H = 32 - N`; 2. The total number of IP addresses in the subnet is `2^H`; 3. The number of usable host IP addresses is `2^H - 2`. We subtract 2 because two addresses are permanently reserved by internet standards: the Network Address (where all host bits are binary 0, representing the subnet itself) and the Directed Broadcast Address (where all host bits are binary 1, used to broadcast to all nodes on the subnet).",
    "For example, in a `/26` subnet (subnet mask `255.255.255.192`): `H = 32 - 26 = 6` host bits. Total IP addresses = 2^6 = 64. Usable host addresses = 64 - 2 = 62. In cloud environments like Amazon Web Services (AWS) VPC, cloud providers reserve five addresses per subnet (Network, VPC Router .1, VPC DNS .2, Future Reservation .3, and Broadcast .255), leaving 59 usable instances in a /26.",
    "How does an operating system decide where to send an outbound packet? It performs a Bitwise Logical AND between the destination IP address and its configured subnet mask. If `(Destination_IP AND Subnet_Mask) == Local_Network_ID`, the destination resides on the local subnet; the OS directly sends an ARP request for the target's MAC address and transmits the frame. If the result does not match, the target is on a remote network across the internet. The host cannot send directly to the remote IP's MAC address; instead, it looks up its Default Gateway (the local router interface, e.g. `192.168.1.1`), resolves the Gateway's MAC address via ARP, and forwards the packet to the router to be hopped across the global BGP routing mesh.",
    "In this section, we construct a binary subnet calculator and routing table simulator in the shell. We perform bitwise AND masking operations, compute network and broadcast boundaries, determine usable host ranges, and evaluate routing table prefix matches."
]

p3_code = """mkdir -p /home/student/workspace/subnet_sim
echo "CIDR_BLOCK,NETMASK,TOTAL_IPS,USABLE_HOSTS,NETWORK_ADDR,BROADCAST_ADDR" > /home/student/workspace/subnet_sim/subnets.csv
echo "192.168.1.0/24,255.255.255.0,256,254,192.168.1.0,192.168.1.255" >> /home/student/workspace/subnet_sim/subnets.csv
echo "10.0.0.0/16,255.255.0.0,65536,65534,10.0.0.0,10.0.255.255" >> /home/student/workspace/subnet_sim/subnets.csv
echo "172.16.0.0/26,255.255.255.192,64,62,172.16.0.0,172.16.0.63" >> /home/student/workspace/subnet_sim/subnets.csv
cat /home/student/workspace/subnet_sim/subnets.csv
grep "172.16.0.0/26" /home/student/workspace/subnet_sim/subnets.csv"""

p3_output = """CIDR_BLOCK,NETMASK,TOTAL_IPS,USABLE_HOSTS,NETWORK_ADDR,BROADCAST_ADDR
192.168.1.0/24,255.255.255.0,256,254,192.168.1.0,192.168.1.255
10.0.0.0/16,255.255.0.0,65536,65534,10.0.0.0,10.0.255.255
172.16.0.0/26,255.255.255.192,64,62,172.16.0.0,172.16.0.63
172.16.0.0/26,255.255.255.192,64,62,172.16.0.0,172.16.0.63"""

p4_say = [
    "In the fourth operational tier of Day 9, we investigate the phonebook of the global internet: The Domain Name System (DNS, RFC 1034 & 1035), Recursive Resolution Hierarchies, Root Nameservers, and Resource Record architectures. Humans navigate the internet using memorable alphabetic names (such as `api.github.com`), but network routers operate exclusively on numeric IP addresses. DNS is the massive, globally distributed, fault-tolerant database that bridges this gap in milliseconds.",
    "DNS is organized as an inverted tree hierarchy rooted at the Root Domain (represented syntactically by a single dot `.`). Below the root are Top-Level Domains (TLDs), split into generic TLDs (gTLDs like `.com`, `.org`, `.net`) and country-code TLDs (ccTLDs like `.uk`, `.jp`, `.de`). Beneath TLDs reside Second-Level Domains (e.g. `github.com`), followed by Subdomains (e.g. `api.github.com`).",
    "When a user types a URL or an application makes an HTTP request to `api.github.com`, how does the computer discover the destination IP? The resolution process follows a strict 4-tier Recursive Query Flow: 1. Local Stub Resolver: The client OS checks its local cache and `/etc/hosts`. If missing, it queries its configured Recursive DNS Resolver (typically provided by the ISP or public resolvers like Google `8.8.8.8` or Cloudflare `1.1.1.1`). 2. Root Nameservers: If the recursive resolver does not have the answer cached, it queries one of the 13 logical Root Nameservers (named `a.root-servers.net` through `m.root-servers.net`, operated via Anycast routing across over 1,500 physical server locations worldwide). The root server replies: 'I don't know api.github.com, but I manage the root; here are the nameservers for .com'.",
    "3. TLD Nameservers: The recursive resolver next queries the `.com` TLD nameserver. The TLD server replies: 'I don't know the exact IP of api.github.com, but github.com is registered with these Authoritative Nameservers (e.g. ns-1.awsdns.com)'. 4. Authoritative Nameservers: Finally, the recursive resolver queries GitHub's authoritative nameserver. Because this server holds the official DNS zone file for the domain, it returns the definitive answer: 'api.github.com has IPv4 address 140.82.121.4' with a Time-To-Live (TTL) of 300 seconds.",
    "The recursive resolver caches the IP mapping for 300 seconds and returns the IP address to your operating system, which finally establishes the TCP connection. Every step of this resolution occurs over UDP port 53 (falling back to TCP port 53 if response payloads exceed 512 bytes or during DNSSEC cryptographic zone transfers).",
    "DNS databases store metadata in distinct Resource Records (RRs). Essential DNS record types include: A Record (maps a hostname to a 32-bit IPv4 address); AAAA Record (maps a hostname to a 128-bit IPv6 address); CNAME Record (Canonical Name, creates an alias pointing one domain name to another domain name, e.g. `www.example.com` -> `example.com`); MX Record (Mail Exchange, specifies email servers and priority rankings); TXT Record (arbitrary text, used for domain ownership validation, SPF, and DKIM email security); and NS Record (specifies the authoritative nameservers for a zone).",
    "Historically, DNS was vulnerable to Cache Poisoning (such as the infamous Kaminsky Bug discovered in 2008), where an attacker forged UDP responses with matching 16-bit Transaction IDs, tricking resolvers into caching fraudulent IP addresses. The internet countered this vulnerability through two key innovations: Source Port Randomization (expanding the entropy space from 16 bits to 32 bits) and DNSSEC (Domain Name System Security Extensions), which cryptographically signs DNS records using public-key cryptography (RRSIG and DNSKEY records), establishing an unbroken chain of trust from the root domain.",
    "Furthermore, modern privacy standards have evolved toward Encrypted DNS: DNS over HTTPS (DoH, RFC 8484) and DNS over TLS (DoT, RFC 7858). By encapsulating plaintext UDP DNS queries inside encrypted TLS tunnels on port 443 or port 853, DoH prevents local Wi-Fi eavesdroppers, commercial ISPs, and malicious middleboxes from snooping on user browsing histories or manipulating resolution endpoints.",
    "Understanding DNS resolution caching and TTL dynamics is critical for DevOps and site reliability engineers during zero-downtime database migrations and blue/green deployments. Lowering DNS record TTLs to 60 seconds days before a migration ensures that client traffic shifts rapidly to the new infrastructure without getting stranded by stale local recursive caches.",
    "In this section, we construct a recursive DNS query flow and zone record simulator in the shell. We trace hierarchical delegations from root servers to authoritative nameservers, parse standard DNS record formats (A, CNAME, TXT), and measure cache TTL decay behaviors."
]

p4_code = """mkdir -p /home/student/workspace/dns_sim
echo "DOMAIN,RECORD_TYPE,VALUE,TTL_SEC,AUTHORITATIVE" > /home/student/workspace/dns_sim/zone_records.csv
echo "github.com,A,140.82.121.4,300,YES" >> /home/student/workspace/dns_sim/zone_records.csv
echo "api.github.com,CNAME,github.com,300,YES" >> /home/student/workspace/dns_sim/zone_records.csv
echo "github.com,MX,10 aspmx.l.google.com,3600,YES" >> /home/student/workspace/dns_sim/zone_records.csv
echo "github.com,TXT,v=spf1 include:_spf.google.com ~all,3600,YES" >> /home/student/workspace/dns_sim/zone_records.csv
cat /home/student/workspace/dns_sim/zone_records.csv
grep "CNAME" /home/student/workspace/dns_sim/zone_records.csv"""

p4_output = """DOMAIN,RECORD_TYPE,VALUE,TTL_SEC,AUTHORITATIVE
github.com,A,140.82.121.4,300,YES
api.github.com,CNAME,github.com,300,YES
github.com,MX,10 aspmx.l.google.com,3600,YES
github.com,TXT,v=spf1 include:_spf.google.com ~all,3600,YES
api.github.com,CNAME,github.com,300,YES"""

p5_say = [
    "In this fifth and culminating milestone of Day 9, we synthesize all foundational computer networking concepts—OSI and TCP/IP protocol layering, Ethernet frame encapsulation, ARP neighbor resolution, CIDR subnetting, and recursive DNS flows—into a Master Network Interface Telemetry, Routing Table, and DNS Inspection Suite. In production systems engineering and cloud infrastructure operations, network diagnostic mastery is the defining skill that resolves complex distributed outages.",
    "The Master Network Telemetry Suite executes five synchronized operational phases: Phase 1: Network Interface & Link State Telemetry: querying Linux virtual interface states (simulating `ip link show` and `ip addr show`) to verify MAC addresses, MTU sizing (1500 bytes vs 9000-byte Jumbo Frames), and carrier link status; Phase 2: Layer 2 Neighbor & ARP Cache Auditing: inspecting the kernel ARP table (`ip neigh show`) to detect stale hardware bindings, duplicate IP allocations, and potential ARP poisoning attacks; Phase 3: Layer 3 Routing Table & CIDR Verification: analyzing the kernel IP routing table (`ip route show`) to verify default gateway next-hops, metric priorities, and subnet CIDR prefixes; Phase 4: DNS Resolution & Query Latency Telemetry: simulating recursive DNS query pipelines (`dig +trace`) to measure query round-trip times, verify authoritative SOA serials, and validate DNSSEC cryptographic signatures; and Phase 5: Cryptographic Network Telemetry Dossier Sealing: computing an immutable SHA-256 digital digest of all network telemetry metrics to certify infrastructure health for enterprise compliance audits.",
    "To diagnose network packet loss and path latency in production Linux environments, systems engineers combine ping, traceroute, and MTR (My Traceroute). ICMP Ping measures end-to-end round-trip latency and packet drop rates using ICMP Echo Request (Type 8) and Echo Reply (Type 0). Traceroute reveals the exact hop-by-hop router path across the internet by intentionally manipulating the Time-To-Live (TTL) field in IP headers: starting with TTL=1, each intermediate router decrements TTL by 1. When TTL reaches 0, the router drops the packet and sends back an ICMP Time Exceeded (Type 11) message containing the router's IP address. MTR executes continuous real-time traceroute probes, pinpointing the exact autonomous system (AS) hop responsible for packet drops or routing jitter.",
    "In modern cloud-native architectures (such as Kubernetes clusters running Cilium), packet filtering and load balancing bypass the traditional Linux iptables firewall entirely through eBPF (Extended Berkeley Packet Filter) and XDP (eXpress Data Path). XDP attaches sandboxed byte-code programs directly to the network interface card driver. Incoming packets are processed and routed in physical silicon memory before the kernel even allocates an `sk_buff` socket buffer, filtering millions of malicious DDoS packets per second with near-zero CPU overhead.",
    "Furthermore, engineers inspect socket statistics using `ss -tuln` (the modern replacement for legacy `netstat`). The `ss` command reads socket diagnostics directly from Linux kernel netlink sockets without the high CPU overhead of parsing `/proc/net/`. Monitoring socket Recv-Q and Send-Q queues reveals when an application's TCP listen backlog is overflowing due to CPU scheduling starvation or thread pool exhaustion.",
    "To provide infrastructure engineers with immediate operational visibility, the suite computes an Enterprise Network Health Index on a 100-point scale. The index validates three critical operational standards: 1. Link & Routing Symmetry: confirming an active default gateway route with zero packet collisions; 2. ARP Cache Health: verifying 100% reachable neighbor states on all production interfaces; and 3. DNS Resolution Efficiency: verifying recursive DNS response latencies under 20 milliseconds with zero NXDOMAIN failures. Systems scoring 95 or higher receive an automated 'Production Systems Network Architecture Certification'.",
    "By mastering Day 9, you have unlocked the architecture of the connected world. You understand how Ethernet frames travel across silicon, how IP packets traverse routers via CIDR subnetting, and how DNS turns human intent into machine connections. You are now prepared for tomorrow's exploration of The Modern Internet & Web Protocols: HTTP/2, TLS 1.3 Handshake, and Port Mapping.",
    "In this final milestone execution, we deploy the complete Master Network Telemetry Suite in the shell. We inspect virtual routing tables, verify neighbor cache states, evaluate DNS resolution logs, and generate the boardroom-certified Systems Engineering Network Dossier."
]

p5_code = """mkdir -p /home/student/workspace/net_audit
echo "SYSTEM_STATUS: OPERATIONAL" > /home/student/workspace/net_audit/summary.txt
echo "INTERFACE_NAME: eth0" >> /home/student/workspace/net_audit/summary.txt
echo "IP_ADDRESS_CIDR: 192.168.1.50/24" >> /home/student/workspace/net_audit/summary.txt
echo "DEFAULT_GATEWAY: 192.168.1.1" >> /home/student/workspace/net_audit/summary.txt
echo "ARP_NEIGHBORS_REACHABLE: 3" >> /home/student/workspace/net_audit/summary.txt
echo "DNS_RESOLUTION_LATENCY_MS: 4.2" >> /home/student/workspace/net_audit/summary.txt
echo "NETWORK_HEALTH_INDEX: 99/100" >> /home/student/workspace/net_audit/summary.txt
cat /home/student/workspace/net_audit/summary.txt
grep "NETWORK_HEALTH_INDEX" /home/student/workspace/net_audit/summary.txt"""

p5_output = """SYSTEM_STATUS: OPERATIONAL
INTERFACE_NAME: eth0
IP_ADDRESS_CIDR: 192.168.1.50/24
DEFAULT_GATEWAY: 192.168.1.1
ARP_NEIGHBORS_REACHABLE: 3
DNS_RESOLUTION_LATENCY_MS: 4.2
NETWORK_HEALTH_INDEX: 99/100
NETWORK_HEALTH_INDEX: 99/100"""

parts = [
    {
        "title": "Network Architecture Foundations: OSI 7-Layer Model vs TCP/IP 4-Layer Stack",
        "say": p1_say,
        "example": "Think of international postal mail: you write a letter in English (Application); fold it into a standard envelope (Transport); write recipient and return addresses (Internet/Network); and the postal truck transports it across highways (Link/Physical); at each step, an outer container encapsulates the inner message.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes network protocol encapsulation simulation workspace"},
            {"line": 2, "note": "Logs encapsulation layers from L4 Application down to L1 Physical link frame"},
            {"line": 5, "note": "Shows L2 Internet layer adding source and destination IP addresses and TTL"},
            {"line": 7, "note": "Filters IP packet layer verifying packet encapsulation metadata"}
        ],
        "tryIt": "Add an entry for L0_PHYSICAL showing bitstream voltage signaling on optical fiber.",
        "check": {
            "question": "What is the primary difference between the OSI 7-Layer Reference Model and the practical TCP/IP Model?",
            "options": [
                "The OSI model is a theoretical 7-layer framework, whereas TCP/IP is the practical 4-layer model that powers the real-world internet, combining Session, Presentation, and Application layers",
                "The OSI model only works on Apple computers; TCP/IP only works on Windows",
                "The OSI model requires Wi-Fi; TCP/IP requires satellite internet",
                "The OSI model was invented in 2024 to replace all existing web browsers"
            ],
            "answer": 0,
            "why": "The OSI model was designed by ISO as a formal reference model. Real-world networks implemented DARPA's streamlined 4-layer TCP/IP stack (Link, Internet, Transport, Application)."
        }
    },
    {
        "title": "Link Layer Frames, Ethernet MAC Addressing & ARP Resolution Flow",
        "say": p2_say,
        "example": "Like calling out in an office room: Host A shouts 'Who has the social security number 192.168.1.100?' (Broadcast ARP request). The person with that number stands up and whispers directly back: 'My legal name is 00:1A:2B:3C:4D:5E' (Unicast ARP reply).",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes ARP simulation workspace"},
            {"line": 2, "note": "Logs ARP cache table schema including IP, MAC, interface, and cache state"},
            {"line": 4, "note": "Records resolved hardware MAC address for host 192.168.1.100 in REACHABLE state"},
            {"line": 7, "note": "Filters active reachable neighbor entries in the kernel ARP cache"}
        ],
        "tryIt": "Add an entry for gateway 192.168.1.250 with MAC AA:BB:CC:DD:EE:01 in REACHABLE state.",
        "check": {
            "question": "What is the primary role of the Address Resolution Protocol (ARP) in local area networks?",
            "options": [
                "To dynamically map a known Layer 3 logical IP address to an unknown Layer 2 physical hardware MAC address on the local network",
                "To encrypt all passwords sent between web servers and databases",
                "To convert audio files into MP3 format",
                "To reboot the router when internet connectivity is lost"
            ],
            "answer": 0,
            "why": "Routers and computers know IP addresses from software, but Ethernet cards only communicate using physical MAC addresses. ARP resolves the MAC address for a given local IP."
        }
    },
    {
        "title": "Network Layer IPv4 Addressing, Classless Inter-Domain Routing (CIDR) & Subnet Math",
        "say": p3_say,
        "example": "Like an apartment complex address: '100 Main Street, Apt 4B'—the street address (Network ID) routes the mail truck to the building; the apartment number (Host ID) identifies the specific door inside the building.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes CIDR subnet simulation directory"},
            {"line": 2, "note": "Logs CIDR block, netmask, total IP addresses, usable hosts, and boundary addresses"},
            {"line": 5, "note": "Calculates /26 subnet showing 64 total IPs, 62 usable hosts, and .63 broadcast boundary"},
            {"line": 7, "note": "Filters /26 subnet specification to verify prefix calculation accuracy"}
        ],
        "tryIt": "Add a /28 subnet entry with 16 total IPs and 14 usable hosts.",
        "check": {
            "question": "In an IPv4 subnet configured with CIDR prefix /27, how many usable host IP addresses are available?",
            "options": [
                "30 usable host addresses (32 total IPs minus 2 reserved for Network and Broadcast)",
                "27 usable host addresses",
                "128 usable host addresses",
                "254 usable host addresses"
            ],
            "answer": 0,
            "why": "For /27, host bits H = 32 - 27 = 5. Total IPs = 2^5 = 32. Usable hosts = 32 - 2 (network .0 and broadcast .31) = 30."
        }
    },
    {
        "title": "Domain Name System (DNS) Resolution Hierarchy, Root Servers & Caching Flow",
        "say": p4_say,
        "example": "Like asking for a company executive's extension: you call the building directory (Root), who transfers you to the Engineering division secretary (TLD), who looks up the internal staff roster (Authoritative DNS) and connects you directly to the desk phone.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes DNS zone simulation workspace"},
            {"line": 2, "note": "Logs zone records schema including domain, record type, value, TTL, and authority"},
            {"line": 4, "note": "Registers CNAME alias record mapping api.github.com to canonical domain github.com"},
            {"line": 7, "note": "Filters CNAME alias records verifying canonical delegation"}
        ],
        "tryIt": "Add an AAAA IPv6 record for github.com pointing to 2606:50c0:8000::153.",
        "check": {
            "question": "In DNS resolution, what is the difference between a Recursive Resolver and an Authoritative Nameserver?",
            "options": [
                "A Recursive Resolver tracks down the answer on behalf of the client by querying Root, TLD, and authoritative servers; an Authoritative Nameserver holds the official, definitive DNS records for a specific domain",
                "Recursive Resolvers only work on mobile phones; Authoritative Nameservers only work on supercomputers",
                "Authoritative Nameservers are temporary caches that delete records every 10 seconds",
                "Recursive Resolvers only translate website URLs into French and Spanish"
            ],
            "answer": 0,
            "why": "Recursive resolvers (like 8.8.8.8) do the legwork of traversing the DNS tree hierarchy. Authoritative nameservers possess the actual golden zone files containing the IP mappings."
        }
    },
    {
        "title": "Master Network Interface Telemetry, Routing Table & DNS Inspection Suite",
        "say": p5_say,
        "example": "Like the flight control tower of an international airport: controllers monitor runway sensors, verify radar squawk codes (MAC addresses), track flight routing plans (IP routing tables), and clear planes for approach to ensure zero collisions.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes enterprise network telemetry directory"},
            {"line": 2, "note": "Records operational health status in network audit summary"},
            {"line": 4, "note": "Logs assigned IP address with CIDR /24 prefix on primary interface eth0"},
            {"line": 8, "note": "Inspects Network Health Index confirming 99/100 production certification"}
        ],
        "tryIt": "Add an entry for PACKET_DROP_RATE_PCT: 0.00% in summary.txt.",
        "check": {
            "question": "How does the Linux 'traceroute' command determine the intermediate router hops between a client and a destination server?",
            "options": [
                "By sending packets with incrementally increasing Time-To-Live (TTL) values, causing each consecutive router to drop the packet and return an ICMP Time Exceeded message containing its IP",
                "By asking the destination server to email a list of routers it visited",
                "By opening an SSH connection to every router in the world",
                "By reading the physical serial numbers of the undersea fiber optic cables"
            ],
            "answer": 0,
            "why": "Each router decrements the IP TTL field. When TTL reaches 0, the router discards the packet and sends an ICMP Time Exceeded packet back to the sender, revealing the router's identity."
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
            "caption": f"Step 1: Inspecting network packet headers and interface states for {p['title'][:25]}...",
            "items": ["0x00: ETH_FRAME", "0x40: IP_PACKET", "0x80: TCP_SEG", "0xC0: DNS_RECORD"],
            "pointers": [{"name": "NET", "index": 0, "tone": "data"}],
            "highlightRange": [0, 1],
            "tones": {"0": "data", "1": "idle", "2": "idle", "3": "idle"}
        },
        {
            "at": "say1",
            "caption": f"Step 2: Subnet prefix matching and routing evaluation for {p['title'][:25]}...",
            "items": ["0x00: ETH_FRAME", "0x40: IP_PACKET", "0x80: TCP_SEG", "0xC0: DNS_RECORD"],
            "pointers": [{"name": "NET", "index": 1, "tone": "accent"}],
            "highlightRange": [1, 2],
            "tones": {"0": "idle", "1": "accent", "2": "idle", "3": "idle"}
        },
        {
            "at": "example",
            "caption": f"Step 3: Real-world operational state and DNS resolution flow for {p['title'][:25]}...",
            "items": ["0x00: ETH_FRAME", "0x40: IP_PACKET", "0x80: TCP_SEG", "0xC0: DNS_RECORD"],
            "pointers": [{"name": "NET", "index": 2, "tone": "success"}],
            "highlightRange": [2, 3],
            "tones": {"0": "idle", "1": "idle", "2": "success", "3": "idle"}
        },
        {
            "at": "tryIt",
            "caption": f"Step 4: Interactive verification and network telemetry diagnostics for {p['title'][:25]}...",
            "items": ["0x00: ETH_FRAME", "0x40: IP_PACKET", "0x80: TCP_SEG", "0xC0: DNS_RECORD"],
            "pointers": [{"name": "NET", "index": 3, "tone": "data"}],
            "highlightRange": [3, 4],
            "tones": {"0": "idle", "1": "idle", "2": "idle", "3": "data"}
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": chash,
        "spec": {
            "template": "cells",
            "title": f"{p['title']} — Network Subsystem & Routing Telemetry",
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

# Replace existing Day 9 or append
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
