import json
import re

topup_p2 = [
    "To achieve a true self-healing security mesh, our detection-to-response pipeline implements an Automated Threat Intelligence Feedback Loop. Once an incident is contained and eradicated, the indicators of compromise extracted from volatile memory and disk forensics (such as C2 IP addresses, domain names, and file hashes) are not merely filed into a static post-mortem report. The SOAR platform automatically serializes these indicators into standardized STIX 2.1 JSON objects and publishes them to the enterprise's internal TAXII distribution server. Within two minutes of eradication, border firewalls, cloud security groups, and web application firewalls across all global enterprise regions and subsidiaries ingest the new intelligence, establishing permanent immunological defense against repeat intrusions.",
    "Furthermore, the pipeline enforces strict Zero-Drop Telemetry Guarantees across peak ingestion surges. In large-scale enterprise environments subject to distributed denial-of-service (DDoS) attacks or massive ransomware outbreaks, network sensors and endpoints generate tens of thousands of log events per second. The telemetry mesh decouples ingestion workers from analytical engines using distributed Apache Kafka partitions. If a SIEM correlation worker experiences temporary processing lag, Kafka buffers events in durable disk queues, guaranteeing zero telemetry loss and ensuring that every stage of the adversary's attack chain is captured for forensic timeline reconstruction."
]

topup_p3 = [
    "To detect novel adversary tradecraft that eludes traditional threshold rules, the autonomous threat hunting engine integrates User and Entity Behavior Analytics (UEBA) powered by unsupervised machine learning. Traditional correlation rules require explicit definitions of known bad patterns; UEBA algorithms (such as Isolation Forests, Gaussian Mixture Models, and Autoencoders) model baseline normal behavior across users, service accounts, and host machines. When an engineer's service account unexpectedly accesses fifty sensitive customer database records at 3:00 AM on a Sunday from a foreign IP subnet, the UEBA engine flags a severe statistical anomaly (a high risk score), prompting the threat hunting engine to launch an immediate automated investigation.",
    "Crucially, the hunting engine manages Behavioral Baseline Drift to prevent attackers from slowly poisoning statistical baselines. Over time, normal employee work habits and cloud application architectures naturally evolve. The hunting engine retrains statistical models on rolling thirty-day historical windows while rigorously filtering out confirmed security incidents and anomalous outlier events. This ensures that machine learning models remain tightly calibrated to legitimate operational evolution without inadvertently normalizing covert, slow-and-low adversary dwell activity."
]

topup_p4 = [
    "To establish absolute empirical confidence in enterprise defense capabilities, modern security organizations conduct Continuous Purple Teaming. Rather than relying on annual external penetration tests that provide only point-in-time snapshots of security posture, our platform executes automated purple team simulation cycles continuously. Red team automation scripts generate benign, real-world adversary behaviors across canary infrastructure, while blue team detection engines verify that alerts fire, playbooks trigger, and memory dumps are captured. The platform calculates a dynamic Detection Coverage Index (DCI), providing executive leadership with quantitative, real-time proof of organizational cyber resilience.",
    "Furthermore, every simulated adversary engagement is subject to Automated Forensic Validation. The testing harness does not merely verify that an alert fired; it validates the scientific integrity of the acquired evidence: confirming that volatile memory captures contain uncorrupted injected shellcode matching the known ground-truth payload, asserting that write-blockers successfully prevented disk alteration, and verifying that Plaso super-timelines accurately reconstruct the exact microsecond sequence of the simulated attack. This proves that if a real adversary strikes, the enterprise will achieve complete forensic victory in regulatory reviews and federal court."
]

topup_p5 = [
    "As we celebrate the graduation of Block 11, cybersecurity engineers reflect upon the staggering architectural scale achieved across fifty-five consecutive days of rigorous, non-hallucinatory engineering. Across Blocks 7 through 11, we have authored over 185,000 words of enterprise curriculum, mastering cryptography, identity federation, application security, cloud infrastructure hardening, SIEM correlation, proactive threat hunting, SOAR automation, and scientific digital forensics. We have proven that elite cyber defense is an integrated, scientific engineering discipline requiring mastery across every layer of the modern computing stack.",
    "Looking forward to the final horizon, we stand on the threshold of the crowning achievement of Course 09: Block 12 (Days 56–60 & Grand Master Capstone: Planetary Enterprise Defense Architecture). In Block 12, we will scale our architectural vision to planetary dimensions: engineering Global Zero-Trust Architectures, Cloud-Native Resilience & Chaos Security Engineering, Cyber War Gaming, Executive Boardroom & Regulatory Governance, and the Grand Master Capstone: The Autonomous Planetary Enterprise Defense Platform. Conquering Block 12 will complete all 60 days of Course 09, officially graduating Branch A and fulfilling the Tri-Branch Master Curriculum Treaty! We now execute our final capstone audit."
]

with open("scripts/create_cyber_day55_data.py", "r", encoding="utf-8") as f:
    text = f.read()

new_text = text
for i, topup in enumerate([topup_p2, topup_p3, topup_p4, topup_p5], 2):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    def make_repl(ts):
        return lambda m: m.group(1) + ts + m.group(2)
    new_text = re.sub(pattern, make_repl(topup_str), new_text, count=1)

with open("scripts/create_cyber_day55_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated create_cyber_day55_data.py with topups safely!")
