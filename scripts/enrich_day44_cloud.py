import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day44_cloud.py', 'r', encoding='utf-8') as f:
    content = f.read()

p1_extra = '''    "A critical architectural requirement when routing traffic through centralized inspection or firewall appliances is Transit Gateway Appliance Mode. In standard TGW routing, return traffic from a destination VPC can be routed across a different Availability Zone than the initial outbound request (asymmetric routing). While standard stateless routers tolerate asymmetric routing, stateful firewalls track TCP three-way handshakes: if an inspection appliance receives return SYN-ACK packets without having observed the initial SYN, it drops the connection. Enabling Appliance Mode on the Inspection VPC attachment forces Transit Gateway to route bidirectional traffic symmetrically to the same Availability Zone throughout the session lifecycle, preserving stateful inspection integrity.",
    "Additionally, Transit Gateway supports Multicast routing across VPCs. In financial market data distribution and multimedia broadcasting, applications publish single packet streams to multicast groups (e.g., 224.0.0.0/4). AWS Transit Gateway acts as a cloud-native multicast router, mapping EC2 instance network interfaces to multicast domains and replicating packets natively at hardware line rate without requiring complex overlay GRE meshes."'''

p2_extra = '''    "To ensure predictable rule evaluation and prevent accidental traffic blackouts, AWS Network Firewall supports Rule Evaluation Ordering modes: Default Action Order and Strict Action Order. In Default Order, rules are evaluated based on action priority (Pass, then Drop, then Alert). In Strict Order, rules are evaluated strictly in descending order of rule priority numbers (from 1 to 30,000), identical to traditional enterprise firewall configurations. Security teams enforce Strict Order so that high-priority emergency drop rules cannot be unintentionally bypassed by lower-priority allow rules.",
    "Furthermore, enterprise architectures combine AWS Network Firewall with Amazon Route 53 Resolver DNS Firewall. Before an application microservice initiates a TCP connection to an external domain, it must resolve the domain via the VPC Route 53 Resolver (.2 address). DNS Firewall inspects the outgoing DNS query at the resolver level, comparing queried domain names against AWS-managed threat intelligence domain lists. If a domain is identified as a known phishing, malware, or botnet domain, DNS Firewall returns an NXDOMAIN or NODATA response immediately, neutralizing the threat before an IP packet or TLS handshake can even be generated!"'''

p3_extra = '''    "From a security governance perspective, Interface VPC Endpoints support Endpoint Policies. An endpoint policy is a resource-based IAM policy attached directly to the Interface Endpoint that controls which IAM principals can access the endpoint and which specific provider resources can be invoked. For example, a security policy can mandate that only IAM roles from the organization's verified Production AWS Account can call the payment endpoint, blocking unauthorized cross-account invocations even if network connectivity is established.",
    "Platform architects must also understand the difference between AWS PrivateLink and AWS Gateway Load Balancer (GWLB). While PrivateLink provides reverse-proxy application access via Network Load Balancers and local ENIs, Gateway Load Balancer operates at Layer 3 using GENEVE encapsulation (port 6081). GWLB is specifically designed for third-party next-generation firewalls (NGFW) and intrusion detection systems, transparently routing raw, unmodified IP packets through firewall inspection fleets without altering source or destination IP headers."'''

p4_extra = '''    "To optimize global traffic distribution and establish resilient hybrid-cloud redundancy, global transit networks integrate AWS Direct Connect Gateways (DXGW) with Transit Gateway peerings. Enterprise data centers connect to AWS via 10 Gbps or 100 Gbps dedicated Direct Connect circuits. By advertising corporate on-premises prefixes via BGP to the Direct Connect Gateway and attaching it to regional Transit Gateways, global networks achieve deterministic failover: if a physical Direct Connect cross-connect fails, BGP automatically fails over to backup IPsec VPN attachments over the AWS backbone within three seconds.",
    "Additionally, global network engineers employ BGP path tuning mechanisms such as AS-Path prepending and Multi-Exit Discriminator (MED) values across inter-region TGW attachments. This engineering precision ensures that latency-sensitive financial transaction flows traverse the shortest transatlantic fiber path, while batch analytical replication jobs utilize secondary links, maximizing bandwidth utilization without saturating critical transactional corridors."'''

p5_extra = '''    "To eliminate network downtime and accelerate root-cause analysis, SRE teams deploy AWS Network Access Analyzer and VPC Reachability Analyzer. Unlike active packet pinging or traceroute probes that can be blocked by firewalls, VPC Reachability Analyzer uses formal mathematical logic and automated reasoning (the same technology behind IAM Access Analyzer) to trace the end-to-end hop path between any two network interfaces, proving mathematically whether a route table, security group, or network firewall rule blocks traffic without sending a single live packet!",
    "Finally, Site Reliability Engineering runbooks establish automated Network Drift Remediation pipelines. When an infrastructure engineer inadvertently alters an enterprise Transit Gateway route table or deletes an inspection route in Terraform, AWS Config rules flag the non-compliant resource instantly, triggering an AWS Systems Manager Automation runbook that reverts the routing table to the codified production state in less than five seconds, guaranteeing zero uninspected bypass across the multi-account AWS cloud estate."'''

def append_to_say(content, marker, extra):
    idx = content.find(marker)
    if idx == -1:
        print(f"Error finding marker {marker}")
        return content
    end_idx = content.find('\n]', idx)
    if end_idx == -1:
        print(f"Error finding closing bracket for {marker}")
        return content
    return content[:end_idx] + ',\n' + extra + content[end_idx:]

content = append_to_say(content, 'p1_say = [', p1_extra)
content = append_to_say(content, 'p2_say = [', p2_extra)
content = append_to_say(content, 'p3_say = [', p3_extra)
content = append_to_say(content, 'p4_say = [', p4_extra)
content = append_to_say(content, 'p5_say = [', p5_extra)

with open('scripts/build_day44_cloud.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Enrichment complete! Saved scripts/build_day44_cloud.py.")
