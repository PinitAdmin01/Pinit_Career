import json
import re

topup_p2 = [
    "Delving deeper into STIX Patterning grammar, detection engineers must master complex compound expressions and temporal qualifiers. While simple STIX patterns query single observables (such as an IPv4 address), advanced threat intelligence describes sophisticated behavioral sequences. Using STIX comparison operators, set operators, and temporal qualifiers (`START '2026-10-01T00:00:00Z' STOP '2026-10-26T00:00:00Z'`), an indicator can specify: `[file:hashes.'SHA-256' = '4b227777...'] AND [network-traffic:dst_port = 4444]`. When the SOAR platform ingests this compound pattern, its correlation parser decomposes the expression into atomic detection rules across both endpoint file monitoring and perimeter network inspection.",
    "Furthermore, securing TAXII 2.1 transport connections requires rigorous authentication and channel governance. Modern TAXII servers implement OAuth 2.0 bearer token authorization and mutual TLS (mTLS) client certificate verification, preventing rogue third parties from intercepting proprietary commercial threat feeds or spoofing malicious indicator streams. Enterprise SOAR ingestion workers handle TAXII server pagination headers (`X-TAXII-Date-Added-First` and `X-TAXII-Date-Added-Last`), ensuring that millions of historical indicators can be synchronized reliably into local memory databases without triggering connection timeouts or memory overflows."
]

topup_p3 = [
    "To ensure high operational resilience, modern SOAR playbooks implement robust Error Handling, Circuit Breakers, and Exponential Backoff. In real-world enterprise infrastructure, target APIs can become temporarily unavailable: an EDR cloud controller might experience transient network timeouts, or a threat intelligence API (such as VirusTotal) might return an HTTP 429 Too Many Requests response due to API rate-limiting quotas. Production playbooks wrap every external API call in automated retry logic with jittered exponential backoff. If an EDR endpoint fails to respond after three retries, the circuit breaker trips, dynamically rerouting containment through adjacent network switches (e.g., dynamically changing the port VLAN on the physical network switch via SNMP or 802.1X NAC) to achieve physical isolation without human delay.",
    "Additionally, modern playbooks integrate seamlessly with ChatOps platforms (Slack, Microsoft Teams, and PagerDuty). When a high-impact decision gate is reached, the SOAR engine dispatches an interactive card containing enriched incident telemetry, impacted asset details, and an interactive 'Approve Quarantine' button directly to the private incident response channel. When the on-call Incident Commander clicks the button, the webhook payload returns a cryptographically signed approval token to the SOAR engine, which instantly resumes playbook execution. This bridges human judgment with machine-speed execution."
]

topup_p4 = [
    "A vital prerequisite before executing automated containment actions is Forensic Evidence Preservation. If a SOAR playbook immediately terminates a compromised process or deletes a malicious virtual machine, volatile forensic evidence residing in physical RAM (such as plaintext encryption keys, injected shellcode, and active network sockets) is permanently destroyed. Enterprise SOAR playbooks execute Forensic Acquisition as the mandatory first step before destructive containment: triggering an automated volatile memory capture via EDR kernel drivers, acquiring virtual machine snapshot disks in cloud environments (AWS EBS snapshots), and cloning volatile process trees.",
    "Crucially, the Incident Lifecycle Manager records an unbroken Chain of Custody for every digital artifact acquired during automated operations. As memory dumps and network packet captures are generated, the engine calculates SHA-256 cryptographic hashes and signs the records using an internal Hardware Security Module (HSM) private key. The signed hash and custody log are written directly to the immutable incident ledger. This guarantees that forensic evidence gathered by automated bots satisfies international legal admissibility standards (such as Federal Rules of Evidence Rule 902 in the United States and ISO/IEC 27037 digital evidence guidelines)."
]

topup_p5 = [
    "Synthesizing SOAR operations into organizational excellence requires tracking advanced operational metrics: the Automation Coverage Ratio (the percentage of total SOC alert volume remediated entirely by automated playbooks without human intervention; top-tier enterprises achieve over seventy percent automated resolution); Playbook Error Rate; and Human Approval Latency. By automating routine triage and repetitive containment tasks, enterprise organizations eliminate alert fatigue, allowing Tier 2 and Tier 3 analysts to dedicate their intellectual capacity to complex threat hunting and root-cause architecture hardening.",
    "Furthermore, high-maturity enterprise platforms execute regular Chaos SOAR Testing: deliberately injecting synthetic simulated alerts into staging SOAR pipelines to measure end-to-end execution latency, verify API connector authentication token rotation, and assert that rollback actions successfully restore production state within sixty seconds. This continuous empirical testing guarantees that when a real-world multi-stage cyber crisis occurs, the enterprise SOAR platform responds with unflinching, programmatic precision."
]

with open("scripts/create_cyber_day53_data.py", "r", encoding="utf-8") as f:
    text = f.read()

new_text = text
for i, topup in enumerate([topup_p2, topup_p3, topup_p4, topup_p5], 2):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    def make_repl(ts):
        return lambda m: m.group(1) + ts + m.group(2)
    new_text = re.sub(pattern, make_repl(topup_str), new_text, count=1)

with open("scripts/create_cyber_day53_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated create_cyber_day53_data.py with topups safely!")
