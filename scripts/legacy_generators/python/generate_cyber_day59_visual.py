# scripts/generate_cyber_day59_visual.py
import json
import hashlib
import re
from scripts.cyber_day59_data import DAY_59_DATA

entries = []
parts = DAY_59_DATA["parts"]

specs_data = [
    {
        "title": "SEC Four-Day Materiality Disclosure vs Delayed Reporting",
        "left_label": "Delayed Unregulated Reporting",
        "left_content": [
            "Conceals cyber incidents for months behind legal nondisclosure agreements",
            "Exposes corporate executives and board members to personal civil liability",
            "Fails to provide investors with transparent material financial impact analysis",
            "Lacks empirical criteria to define whether technical intrusions constitute material harm"
        ],
        "right_label": "Automated SEC Form Eight-K Engine",
        "right_content": [
            "Automated engines assess quantitative and qualitative incident materiality parameters",
            "Mandates transparent disclosure within ninety-six hours of materiality determination",
            "Harmonizes incident reporting with European early warning directives and resilience acts",
            "Protects market integrity and investor trust through standardized public disclosures"
        ],
        "captions": [
            "Architectural layout displays automated regulatory incident materiality assessment pipeline.",
            "Detailed operational inspection tracks financial impact, customer data leakage, and downtime metrics.",
            "Comparative review demonstrates transparent timely regulatory disclosure surpassing dangerous reporting delays.",
            "Final verification certifies compliance with global reporting deadlines and executive legal standards."
        ]
    },
    {
        "title": "FAIR Quantitative Risk Modeling vs Qualitative Color Charts",
        "left_label": "Subjective Color Heatmaps",
        "left_content": [
            "Assigns arbitrary red, amber, and green colors to vulnerabilities without dollar metrics",
            "Suffers from subjective analyst bias and creates dangerous false precision illusions",
            "Cannot quantify how much financial capital a specific cyber intrusion will consume",
            "Fails to demonstrate return on investment for proposed enterprise security initiatives"
        ],
        "right_label": "FAIR Mathematical Risk Taxonomy",
        "right_content": [
            "Deconstructs risk into loss event frequency and expected monetary loss magnitude",
            "Executes thousands of probabilistic simulation trials to calculate loss curves",
            "Expresses digital risk in concrete currency figures understandable to executive boards",
            "Empirically proves security return on investment and justifies security capital allocation"
        ],
        "captions": [
            "Diagram maps quantitative loss event frequency and probabilistic financial loss distribution.",
            "Deep inspection audits annualized loss expectancy equations and expected loss magnitudes.",
            "Comparative analysis illustrates mathematical financial precision replacing arbitrary qualitative color matrices.",
            "Verification confirms quantitative risk modeling justifying strategic capital allocation and insurance underwriting."
        ]
    },
    {
        "title": "Supply Chain Provenance Gating vs Unverified Dependencies",
        "left_label": "Unverified Vendor Libraries",
        "left_content": [
            "Ingests open-source packages and commercial software without dependency inventory audits",
            "Vulnerable to upstream build pipeline compromises and malicious package replacements",
            "Lacks visibility into nested transitive libraries during critical zero-day discoveries",
            "Permits software packages containing unmitigated critical vulnerabilities into production"
        ],
        "right_label": "SLSA Provenance & SBOM Gating",
        "right_content": [
            "Enforces complete machine-readable software bills of materials for all dependencies",
            "Requires verifiable cryptographic provenance attestations generated on isolated build hosts",
            "Deployment admission controllers mathematically block packages lacking provenance manifests",
            "Eliminates build-time injection vulnerabilities and provides instant inventory querying"
        ],
        "captions": [
            "Structural overview maps software supply chain verification gates from source to deployment.",
            "Detailed inspection analyzes machine-readable bill of materials inventories and provenance certificates.",
            "Comparative evaluation demonstrates cryptographic build gating preventing upstream dependency hijack attacks.",
            "Final verification validates deployment admission controllers rejecting unverified vendor packages."
        ]
    },
    {
        "title": "Executive Boardroom KRI Dashboards vs Technical Vanity Metrics",
        "left_label": "Technical Vanity Metrics",
        "left_content": [
            "Presents irrelevant low-level counts of blocked spam emails and firewall port probes",
            "Alienates corporate board directors and creates confusion regarding actual enterprise risk",
            "Fails to establish clear alignment with business objectives and growth strategies",
            "Lacks forward-looking warning signals to prevent catastrophic compliance failures"
        ],
        "right_label": "Strategic Board Governance Dashboards",
        "right_content": [
            "Aligns key risk indicators with formal, board-approved cyber risk appetite statements",
            "Provides forward-looking leading metrics that signal rising risk exposure before disasters",
            "Tracks operational velocity through mean time to detect and remediation metrics",
            "Transforms cybersecurity from an administrative expense into a strategic business enabler"
        ],
        "captions": [
            "Executive dashboard layout maps key risk indicators against formal board appetite thresholds.",
            "Deep operational inspection tracks unpatched vulnerabilities, remediation times, and vendor postures.",
            "Comparative review demonstrates strategic executive reporting surpassing technical vanity metrics.",
            "Verification confirms that enterprise risk posture remains strictly within approved board boundaries."
        ]
    },
    {
        "title": "Production Cyber Governance Platform Engine",
        "left_label": "Fragmented Governance Silos",
        "left_content": [
            "Relies on manual paperwork and spreadsheets for periodic compliance certifications",
            "Fails to calculate quantitative risk, exposing the enterprise to unquantified financial shocks",
            "Third-party vendor risk remains unmonitored, risking catastrophic supply chain breaches",
            "Executive leadership operates without real-time visibility into digital risk posture"
        ],
        "right_label": "Unified Cyber Governance Platform",
        "right_content": [
            "Automated engines assess incident materiality and enforce statutory notification deadlines",
            "Probabilistic risk quantification models millions in annualized risk reduction value",
            "Cryptographic supply chain gates guarantee software dependency integrity across clouds",
            "Boardroom reporting dashboards certify operational resilience and regulatory compliance"
        ],
        "captions": [
            "Comprehensive platform schematic details end-to-end cybersecurity governance and risk engine.",
            "Deep inspection audits regulatory disclosure parameters, quantitative risk curves, and board metrics.",
            "Comparative analysis highlights institutional governance excellence over fragmented compliance workflows.",
            "Formal verification certifies global regulatory readiness and board-level risk governance accreditation."
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
    "day": 59,
    "promptSha": prompt_sha,
    "entries": entries
}

out_path = "src/lib/data/lessonVisuals/cyber/day-59.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Generated {out_path} successfully! Zero-digit check PASSED.")
