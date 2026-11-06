# scripts/generate_cyber_day58_visual.py
import json
import hashlib
import re
from scripts.cyber_day58_data import DAY_58_DATA

entries = []
parts = DAY_58_DATA["parts"]

specs_data = [
    {
        "title": "TIBER-EU Threat-Informed Emulation vs Ad-Hoc Penetration Testing",
        "left_label": "Ad-Hoc Penetration Testing",
        "left_content": [
            "Relies on uncoordinated vulnerability scanners without realistic threat actor profiling",
            "Tests isolated network perimeters without evaluating full multi-stage adversary paths",
            "Delivers static post-mortem findings weeks later without collaborative remediation",
            "Fails to measure organizational detection engineering or incident response reflexes"
        ],
        "right_label": "TIBER-EU Adversary Emulation",
        "right_content": [
            "Threat intelligence profiles exact nation-state and organized cybercrime techniques",
            "Targeted red teams execute controlled campaigns against live enterprise digital twins",
            "Structured three-phase governance certifies threat modeling and remediation closure",
            "Simulates authentic adversary behaviors to stress-test human and automated defenses"
        ],
        "captions": [
            "Architectural layout displays three-phase threat-informed adversary emulation campaign.",
            "Detailed operational inspection audits threat intelligence reports, red team logs, and remediation plans.",
            "Comparative review demonstrates structured regulatory emulation surpassing ad-hoc vulnerability assessments.",
            "Final verification certifies campaign compliance across white, red, and blue oversight committees."
        ]
    },
    {
        "title": "Living-off-the-Land (LotL) Exploitation vs Signature Malware",
        "left_label": "Signature-Based Malware",
        "left_content": [
            "Drops custom compiled executable files that trigger standard antivirus hash signatures",
            "Easily blocked by basic operating system application control policies",
            "Lacks capability to blend into legitimate administrative process lifecycles",
            "Static payloads fail against modern behavioral endpoint detection engines"
        ],
        "right_label": "Living-off-the-Land Binaries",
        "right_content": [
            "Weaponizes built-in, cryptographically signed administrative operating system binaries",
            "Requests Kerberos service tickets using weak encryption for offline password cracking",
            "Steals privileged primary tokens from memory to elevate permissions without passwords",
            "Requires kernel call-stack inspection and anomalous ticket request monitoring to detect"
        ],
        "captions": [
            "Diagram maps execution paths of cryptographically signed administrative operating system utilities.",
            "Deep inspection tracks ticket encryption downgrade requests and privileged memory tokens.",
            "Comparative analysis illustrates stealthy native binary exploitation bypassing basic whitelisting.",
            "Verification confirms behavioral detection rules intercepting anomalous ticket requests and token theft."
        ]
    },
    {
        "title": "Canary Token Deception Mesh vs Passive Log Monitoring",
        "left_label": "Passive Log Monitoring",
        "left_content": [
            "Waits for known intrusion signatures while stealthy attackers discover network shares",
            "Suffers from high alert fatigue and thousands of daily false-positive notifications",
            "Adversaries using legitimate stolen credentials remain completely undetected",
            "Provides zero proactive traps or automated redirection away from real customer data"
        ],
        "right_label": "Active Deception & Honeynets",
        "right_content": [
            "Deploys synthetic credentials and decoy documents with zero legitimate business usage",
            "Any access generates instantaneous high-fidelity alerts with zero false-positive rates",
            "Software-defined networks dynamically redirect intruders into isolated honeynet sandboxes",
            "Synthetic servers record adversary commands while wasting their operational resources"
        ],
        "captions": [
            "Structural overview maps decoy canary tokens and software-defined honeynet redirection mesh.",
            "Detailed inspection analyzes instant webhook triggers upon unauthorized decoy credential access.",
            "Comparative evaluation demonstrates proactive deception trapping attackers before data discovery.",
            "Final verification validates isolated honeynet confinement and automated threat containment."
        ]
    },
    {
        "title": "Purple Team Real-Time Collaboration vs Siloed Operations",
        "left_label": "Siloed Operations",
        "left_content": [
            "Red teams conduct clandestine exercises and deliver massive static reports months later",
            "Blue teams struggle to interpret findings without technical context of attack mechanics",
            "Detection gaps remain unpatched for extended periods, leaving enterprises exposed",
            "Adversarial culture creates organizational friction between offensive and defensive units"
        ],
        "right_label": "Purple Team Collaborative Loop",
        "right_content": [
            "Red and blue operators test specific matrix techniques side-by-side in real time",
            "Engineers inspect telemetry immediately, tuning detection rules within minutes",
            "Maturity heatmaps systematically track tactic coverage across blind, logged, and blocked states",
            "Shared empirical data drives continuous detection engineering and architectural hardening"
        ],
        "captions": [
            "Workflow diagram illustrates iterative red and blue collaborative feedback loop.",
            "Deep operational inspection tracks technique execution, log validation, and instant rule tuning.",
            "Comparative review demonstrates real-time purple teaming permanently closing enterprise blind spots.",
            "Verification confirms ninety-eight percent coverage across prioritized enterprise threat scenarios."
        ]
    },
    {
        "title": "Production Cyber War Gaming Platform Engine",
        "left_label": "Unexercised Enterprise Defenses",
        "left_content": [
            "Defensive playbooks remain untested against multi-stage adversary intrusion chains",
            "Incident response containment velocity is slow, allowing ransomware lateral spread",
            "Executive leadership lacks visibility into technical containment capabilities",
            "Security investments cannot be quantitatively justified against empirical threat data"
        ],
        "right_label": "Unified Live-Fire War Gaming Engine",
        "right_content": [
            "Continuous automated adversary emulation stress-tests defenses across dozens of techniques",
            "Sub-minute mean time to contain proves automated orchestration and response reflexes",
            "Active deception meshes divert intrusions away from production databases into sandboxes",
            "Empirical readiness index provides definitive mathematical proof of combat readiness"
        ],
        "captions": [
            "Comprehensive platform schematic details end-to-end live-fire adversary emulation benchmark.",
            "Deep inspection tracks multi-stage attack campaigns, detection rates, and containment velocity.",
            "Comparative analysis highlights battle-tested combat survivability over untested defensive models.",
            "Formal verification certifies enterprise war gaming accreditation and executive defense readiness."
        ]
    }
]

for i, p in enumerate(parts):
    spec_meta = specs_data[i]
    code_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    
    steps = [
        {"at": "intro", "caption": spec_meta["captions"][0]},
        {"at": "inspect", "caption": spec_meta["captions"][1]},
        {"at": "compare", "caption": spec_meta["captions"][2]},
        {"at": "verify", "caption": spec_meta["captions"][3]},
    ]
    
    # Assert zero digits in captions
    for step in steps:
        assert not re.search(r'\d', step["caption"]), f"Digit found in caption: {step['caption']}"
    
    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "compare",
            "title": spec_meta["title"],
            "left": {
                "label": spec_meta["left_label"],
                "content": spec_meta["left_content"]
            },
            "right": {
                "label": spec_meta["right_label"],
                "content": spec_meta["right_content"]
            },
            "steps": steps
        }
    }
    entries.append(entry)

prompt_content = json.dumps(entries, sort_keys=True)
prompt_sha = hashlib.sha256(prompt_content.encode("utf-8")).hexdigest()

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 58,
    "promptSha": prompt_sha,
    "entries": entries
}

out_path = "src/lib/data/lessonVisuals/cyber/day-58.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully! Zero-digit check PASSED.")
