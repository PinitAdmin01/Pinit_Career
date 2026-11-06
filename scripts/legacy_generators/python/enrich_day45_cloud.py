import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day45_cloud.py', 'r', encoding='utf-8') as f:
    content = f.read()

p1_extra = '''    "From an implementation standpoint, Service Control Policies attached to the CDE Organizational Unit utilize fine-grained condition blocks. For example, the SCP blocking direct internet gateways applies an explicit deny on 'ec2:AttachInternetGateway' and 'ec2:CreateInternetGateway' with a condition exception only for the centralized Cloud Platform automation role. Furthermore, SCPs enforce that all Amazon S3 buckets created in the CDE must deny unencrypted HTTP transport by enforcing the condition 'aws:SecureTransport: false', guaranteeing that TLS 1.3 is cryptographically mandated for 100% of internal S3 data transfers.",
    "Additionally, platform engineering teams deploy AWS Control Tower Account Factory for Terraform (AFT) to automate new account provisioning. When an engineer requests a new microservice environment within the CDE OU, AFT provisions the account from a version-controlled Git repository, automatically attaching baseline SCPs, enrolling the account in AWS Security Hub, provisioning the Transit Gateway attachment, and applying AWS Config conformance packs before the account is handed over to development teams."'''

p2_extra = '''    "Under PCI-DSS Requirement 1.3, inbound internet traffic is prohibited from directly accessing any internal system component that stores cardholder data. In our architecture, incoming API calls terminate at public Application Load Balancers protected by AWS WAF in the DMZ VPC. AWS WAF inspects requests using AWS Managed Rules for Core Rule Set (CRS) and Amazon IP Reputation lists. The reverse proxy in the DMZ sanitizes and translates the request, establishing a brand-new TLS connection through Transit Gateway into the Central Inspection VPC before packets can ever touch CDE subnets.",
    "Furthermore, network security teams configure Amazon Route 53 Resolver DNS Firewall within the CDE VPC. Payment containers in private subnets cannot query external public DNS resolvers. All DNS requests resolve via private Route 53 hosted zones and are evaluated by DNS Firewall rules. If a compromised microservice attempts to resolve an unauthorized external domain or known C2 server, DNS Firewall intercepts the request and returns an NXDOMAIN response, thwarting data exfiltration attempts before TCP handshakes can even occur."'''

p3_extra = '''    "To preserve downstream business operations without exposing raw card data, modern tokenization architectures often leverage Format-Preserving Encryption (FPE) standards such as NIST SP 800-38G FF1. Format-preserving encryption encrypts the middle digits of a card number while outputting a surrogate value that matches the exact length, Luhn check structure, and character format of a real credit card. This allows legacy accounting, billing, and fraud-scoring databases to process tokenized transactions without requiring schema alterations or database migrations.",
    "From a cryptographic lifecycle perspective, dedicated CloudHSM appliances within the vault VPC undergo formal key ceremonies. Cryptographic Officers (COs) generate root wrapping keys using M-of-N quorum authentication (e.g. 2-of-3 signatures). The CloudHSM cluster replicates keys securely across Availability Zones using hardware-accelerated end-to-end encrypted tunnels. In the event of an AZ failure, the surviving appliances maintain line-rate tokenization throughput, ensuring zero downtime for payment processing."'''

p4_extra = '''    "For emergency break-glass procedures—such as triaging a catastrophic payment outage at 2 AM—security policies strictly prohibit static root or administrator credentials. Instead, engineers invoke an automated Break-Glass Workflow via AWS Systems Manager and IAM Identity Center. The workflow requires dual-authorization approval from the on-call security officer, granting temporary elevation to a tightly scoped Break-Glass IAM role with a maximum session duration of 60 minutes.",
    "During the active break-glass session, AWS CloudTrail records every executed AWS CLI command and API invocation with high-resolution timestamps. Amazon EventBridge rules stream these high-privilege audit events directly into Amazon OpenSearch and trigger real-time Slack notifications in the Security Operations channel. Once the incident is resolved or the 60-minute session timer expires, AWS STS automatically revokes all active session tokens, ensuring that elevated access is automatically deprovisioned without human oversight."'''

p5_extra = '''    "To ensure continuous audit readiness throughout the fiscal year, SRE and compliance teams deploy automated Chaos Engineering experiments against the CDE perimeter using AWS Fault Injection Service (FIS). Scheduled chaos drills simulate compromised containers attempting to execute egress internet connections, probe for unauthorized cross-VPC routes, or access S3 buckets without TLS. If any synthetic probe succeeds in bypassing perimeter controls, the automated test suite fails the pipeline and raises a critical PagerDuty incident, guaranteeing that configuration drift is caught and eradicated immediately.",
    "Finally, the complete multi-account architecture produces an automated Compliance Artifact Pack for Qualified Security Assessors (QSAs). An automated AWS Step Functions state machine executes quarterly scans: collecting AWS Config compliance scorecards, AWS Security Hub CIS Benchmark reports, IAM Access Analyzer proof of zero external resource access, and CloudHSM FIPS 140-2 Level 3 attestation certificates. This automated evidence generation reduces annual audit prep time from three months to less than two hours, embodying the gold standard of modern cloud security engineering."'''

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

with open('scripts/build_day45_cloud.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Enrichment complete! Saved scripts/build_day45_cloud.py.")
