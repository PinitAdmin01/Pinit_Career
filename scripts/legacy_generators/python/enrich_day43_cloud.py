import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day43_cloud.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix raw escape sequence in regex string
content = content.replace("r'const match = raw.match(/^ENC\\[(.*)\\]_WITH_/);'", "const match = raw.match(/^ENC\\[(.*)\\]_WITH_/);")

# 1. Enrich Part 1
p1_extra = '''    "Additionally, platform teams manage Multi-Region Keys using standardized AWS KMS Key Aliases across all accounts. While an MRK shares the same Key ID (e.g. 'mrk-9876-abcd') across all regions, alias names such as 'alias/production-database-key' are regional pointers. Enterprise Infrastructure as Code (IaC) pipelines ensure that identical alias names are deployed in both primary and replica regions, enabling application microservices to reference the local key transparently via the alias URI 'arn:aws:kms:current-region:account:alias/production-database-key' without hardcoding regional identifiers.",
    "From an enterprise monitoring and compliance standpoint, every cryptographic operation executed against an MRK generates regional AWS CloudTrail events under the event source 'kms.amazonaws.com'. Security Operations Center (SOC) teams ingest these audit events into AWS Security Lake, writing automated OpenSearch queries that monitor cross-region replica synchronization latency and assert that 100% of decryption calls in secondary disaster recovery regions utilize local replica keys rather than making cross-continental API requests."'''

# 2. Enrich Part 2
p2_extra = '''    "From an operational networking perspective, CloudHSM appliances reside within private subnets of a dedicated Security VPC and cannot be assigned public IPv4 addresses or direct Internet Gateway attachments. Enterprise platform architects share access to CloudHSM clusters across multiple spoke VPCs and AWS accounts using AWS Transit Gateway or VPC Peering. The CloudHSM client daemon establishes mutually authenticated, TLS 1.3 encrypted tunnels directly to the hardware appliances using an ephemeral software token provisioned during client initialization.",
    "To satisfy stringent banking compliance such as PCI-DSS Requirement 3.5 and 3.6, organizations implement formal cryptographic key ceremony runbooks. During an HSM initialization ceremony, multiple designated Cryptographic Officers (COs) physically convene or connect via secure out-of-band terminals to generate root Wrapping Keys (AES Key Wrap RFC 3394) and set quorum approval thresholds. By enforcing that no single human has physical, administrative, or cryptographic access to unwrap keys, the enterprise eliminates insider threat risk while maintaining full auditability."'''

# 3. Enrich Part 3
p3_extra = '''    "In addition to Data Key Caching, production systems deploy Multi-Keyrings within the AWS Encryption SDK to achieve cryptographic defense-in-depth and seamless cross-region failover. An AWS KMS Multi-Keyring combines a primary regional KMS key with one or more secondary backup KMS keys or escrow keys. When encrypting a payload, the SDK requests a Data Encryption Key from the primary KMS key and encrypts that same DEK under every secondary key configured in the keyring, generating multiple encrypted data key envelopes in the message header. If the primary KMS key becomes unavailable, the decryption process automatically attempts decryption using any available backup key in the keyring, providing zero-downtime cryptographic resilience.",
    "Furthermore, security engineers configure CloudWatch Alarms on KMS API metrics: monitoring 'KMSThroughput', 'ThrottlingException', and 'KeyUsageCount'. By correlating cache hit ratios from the AWS Encryption SDK with application throughput, operations teams verify that data key caching remains effective during major traffic events, maintaining steady-state KMS API utilization well below regional account thresholds."'''

# 4. Enrich Part 4
p4_extra = '''    "In large-scale data lake environments, managing millions of individual user encryption keys directly within AWS KMS would rapidly exceed service quotas and incur unsustainable per-key monthly costs. To solve this scalability challenge, enterprise architects implement a Hierarchical Key Derivation Architecture. A master AWS KMS Customer Managed Key serves as a Key Encryption Key (KEK) to protect and wrap unique, tenant-specific or user-specific Data Encryption Keys stored in an Amazon DynamoDB table with client-side encryption. When processing data ingestion, the system derives an ephemeral user key, encrypts the sensitive records, and writes the ciphertext to immutable S3 Object Lock archives.",
    "When a user invokes their GDPR Article 17 'Right to be Forgotten', an automated AWS Step Functions state machine executes the Crypto-Shredding protocol: calling a conditional DynamoDB delete operation that permanently purges the user's wrapped key record and overwrites the storage block with cryptographically secure pseudorandom bytes. Once the key record is destroyed, any future attempt to read the user's historical records from the immutable S3 archive results in a permanent cryptographic failure. The workflow logs this verified cryptographic failure to CloudTrail Lake, generating an immutable, audit-ready Certificate of Cryptographic Erasure that completely satisfies GDPR regulators while maintaining WORM compliance."'''

# 5. Enrich Part 5
p5_extra = '''    "To prevent unauthorized key destruction or administrative tampering, security operations teams deploy automated guardrails using AWS Config and Service Control Policies (SCPs). An enterprise SCP attached to the root of AWS Organizations blocks any IAM principal—including account root users—from calling 'kms:ScheduleKeyDeletion' or 'kms:DisableKey' on production KMS keys without approval from the central Security Operations account. Concurrently, AWS Config evaluates the rule 'kms-cmk-not-scheduled-for-deletion' in real time, triggering immediate incident response notifications if any key is placed into pending deletion status.",
    "Finally, Site Reliability Engineering (SRE) teams establish comprehensive Key Disaster Recovery Runbooks. In the event of a regional outage or suspected key compromise, SREs follow codified runbooks to rotate compromised keys, reissue active grants, and reroute cryptographic traffic to secondary Multi-Region Key replicas within seconds. Automated health checks continuously validate that all replica keys in secondary disaster recovery regions are synchronized and capable of handling production decryption workloads, guaranteeing uninterrupted business continuity across the entire enterprise cloud estate."'''

# Insert extras before closing bracket of each say list
# We can find the pX_say blocks and append the extras
def append_to_say(content, marker, extra):
    target = marker
    idx = content.find(target)
    if idx == -1:
        print(f"Error finding marker {marker}")
        return content
    # find the next ']'
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

with open('scripts/build_day43_cloud.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Enrichment complete! Saved scripts/build_day43_cloud.py.")
