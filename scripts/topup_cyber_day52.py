import json
import re

topup_p2 = [
    "To validate MITRE ATT&CK coverage systematically, detection engineers leverage Adversary Emulation frameworks like Red Canary's Atomic Red Team. Rather than waiting for real attackers to test detections, Atomic Red Team provides scripted, modular open-source test cases mapped directly to specific ATT&CK technique IDs. For instance, to test detection coverage for Technique T1059.001, a CI/CD test runner executes a benign atomic PowerShell download cradle command on an isolated test machine. The automated testing pipeline queries the SIEM API thirty seconds later to verify whether the correlation rule fired and created an incident. If the alert fails to generate, the pipeline fails, flagging a regression in detection coverage before adversaries can exploit the gap.",
    "Furthermore, modern detection engineering pairs the offensive MITRE ATT&CK matrix with its defensive counterpart, MITRE D3FEND (Detection, Denial, and Disruption Framework). While ATT&CK catalogs what adversaries do to systems, D3FEND catalogs the defensive engineering countermeasures required to neutralize those techniques: such as Process Spawning Limitation, Inbound Network Traffic Filtering, File Encryption Decoy Sinks, and Kernel Execution Prevention. By aligning threat hunts and detection engineering across both ATT&CK and D3FEND, enterprise blue teams establish a complete, mathematically grounded operational loop between threat observation and defensive architecture."
]

topup_p3 = [
    "Delving deeper into Sigma rule syntax, detection engineers must master Field Value Modifiers to handle real-world attacker evasion techniques like string obfuscation and base64 encoding. Standard string matching fails when an attacker encodes malicious PowerShell scripts into base64 (`-EncodedCommand`). In base64, the byte representation changes depending on the character offset (the three possible encoding alignments). Sigma provides the powerful `|base64offset` modifier: when applied to a string, `base64offset` automatically calculates and matches all three possible base64 representations of the target string. Other essential modifiers include `|contains`, `|endswith`, `|startswith`, `|re` (regular expressions), and `|all` (requiring all listed array values to match).",
    "Additionally, the modern Sigma specification introduces Correlation Rules. A Sigma correlation rule links multiple independent Sigma log detection rules together using temporal operators: for example, defining a `correlated` rule that triggers only when a `process_creation` rule (such as `whoami.exe` execution) occurs within sixty seconds of a `network_connection` rule (such as an outbound SMB connection on port 445) from the same host. This enables detection engineers to express complex multi-event attack chains directly in portable YAML without writing vendor-specific correlation queries."
]

topup_p4 = [
    "To analyze complex compiled executables, YARA provides specialized Binary Modules, most notably the Portable Executable (`pe`) and Executable and Linkable Format (`elf`) modules. By declaring `import 'pe'`, a YARA rule can inspect internal Windows PE binary headers: calculating the Import Hash (`pe.imphash()`), inspecting section entropy (to detect packed or encrypted malware sections with entropy greater than 7.0), verifying digital signature validity (`pe.signatures`), and checking exported function names. For example, threat hunters author rules targeting Cobalt Strike beacons by matching specific, anomalous `imphash` values shared across thousands of custom-compiled threat actor implants.",
    "Furthermore, YARA rules are actively deployed into live endpoint detection engines and sandbox analysis pipelines. When an EDR agent detects an anomalous memory injection event via kernel hooks, it can dump the target process's virtual memory address space directly into an in-memory buffer and pass it to an embedded YARA scanning engine. Because the malware decrypts its operational payloads and configuration strings (such as command-and-control server URIs and encryption keys) only when loaded into RAM, memory-based YARA scanning exposes malware configurations that are completely invisible to static disk scanners."
]

topup_p5 = [
    "Synthesizing threat hunting into operational maturity requires measuring clear quantitative metrics: the Threat Hunting Success Rate (the percentage of hunts that yield either an active intrusion discovery, an unmonitored security risk, or a new production detection rule) and the Dwell Time Reduction Factor. In elite organizations, proactive threat hunting accounts for over forty percent of all high-severity incident discoveries, proving that waiting passively for automated alerts leaves organizations blind to advanced tradecraft.",
    "Furthermore, high-maturity detection engineering implements Automated Detection as Code (DaC) workflows: every Sigma rule, YARA signature, and correlation query is managed in a centralized Git repository. When a detection engineer commits a new rule, automated CI/CD runners validate YAML syntax, execute Atomic Red Team tests against telemetry replay databases, verify false positive rates across ninety days of historical baseline logs, and push approved rules directly into production SIEM and EDR platforms. This establishes an automated, regression-free software engineering discipline for enterprise threat defense."
]

with open("scripts/create_cyber_day52_data.py", "r", encoding="utf-8") as f:
    text = f.read()

new_text = text
for i, topup in enumerate([topup_p2, topup_p3, topup_p4, topup_p5], 2):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    def make_repl(ts):
        return lambda m: m.group(1) + ts + m.group(2)
    new_text = re.sub(pattern, make_repl(topup_str), new_text, count=1)

with open("scripts/create_cyber_day52_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated create_cyber_day52_data.py with topups safely!")
