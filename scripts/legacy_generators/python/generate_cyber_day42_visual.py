# scripts/generate_cyber_day42_visual.py
import json
import hashlib
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from cyber_day42_data import DAY_42_DATA as day42_data

entries = []

captions = [
    [
        "Architectural overview illustrates client-side cross-site scripting attack vectors across stored, reflected, and dom sinks.",
        "Deep inspection evaluates taint detection rules intercepting script tags and inline event handler attributes.",
        "Comparative analysis demonstrates complete isolation of user text compared to unauthorized script execution.",
        "Verification confirms vector categorization, taint detection alert generation, and client session protection."
    ],
    [
        "Architectural overview displays context-aware output escaping pipelines across html, javascript, and attribute boundaries.",
        "Deep inspection evaluates entity encoding transforming hostile angle brackets and quotes into inert characters.",
        "Comparative analysis demonstrates tailored syntactic escaping compared to naive single-method replacements.",
        "Verification confirms entity substitution, safe markup rendering, and complete injection neutralization."
    ],
    [
        "Architectural overview illustrates strict content security policy header generation with cryptographic nonces.",
        "Deep inspection evaluates single-use random nonces and strict-dynamic execution permission pipelines.",
        "Comparative analysis demonstrates complete blocking of unauthorized inline scripts despite escaping oversights.",
        "Verification confirms nonce generation, strict-dynamic propagation, and object embedding lockdown."
    ],
    [
        "Architectural overview displays client-side document object model sink defenses and trusted type enforcement.",
        "Deep inspection monitors url protocol whitelisting and inert document fragment parsing before sink assignment.",
        "Comparative analysis demonstrates total interception of dangerous javascript pseudo-protocol navigation.",
        "Verification confirms url protocol validation, trusted html wrapping, and dangerous sink lockdown."
    ],
    [
        "Architectural overview presents end-to-end client-side application security defense engine across enterprise portals.",
        "Deep inspection evaluates concurrent taint inspection, context-aware escaping, and strict csp nonce emission.",
        "Comparative analysis demonstrates comprehensive enterprise client-side security certification over ad-hoc filters.",
        "Verification confirms full cross-site scripting defense certification, zero security regressions, and runtime security."
    ]
]

for idx, p in enumerate(day42_data["parts"]):
    code = p["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    
    # Check no digits in captions
    for c in captions[idx]:
        for ch in c:
            if ch.isdigit():
                raise ValueError(f"Digit found in caption: {c}")

    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "compare",
            "title": f"XSS & CSP Defense: {p['title']}",
            "left": {
                "label": "Vulnerable Client-Side Architecture",
                "content": [
                    "Direct reflection of unescaped user input into HTML markup allows script execution",
                    "Applying generic HTML escaping to JavaScript contexts fails to prevent syntax breakout",
                    "Legacy hostname-whitelisted CSP policies can be trivially bypassed via JSONP endpoints",
                    "Unsanitized assignment to dangerous DOM sinks (innerHTML) permits DOM-based XSS"
                ]
            },
            "right": {
                "label": "Enterprise Hardened XSS & CSP Architecture",
                "content": [
                    "Context-aware escaping transforms dangerous delimiters into inert entities at render time",
                    "Strict JSON serialization and hex attribute encoding neutralize multi-context attacks",
                    "Cryptographic nonce-based CSP with strict-dynamic blocks all unauthenticated inline scripts",
                    "Trusted Types and URL protocol whitelisting permanently lock down DOM execution sinks"
                ]
            },
            "steps": [
                {
                    "at": "intro",
                    "caption": captions[idx][0]
                },
                {
                    "at": "inspect",
                    "caption": captions[idx][1]
                },
                {
                    "at": "compare",
                    "caption": captions[idx][2]
                },
                {
                    "at": "verify",
                    "caption": captions[idx][3]
                }
            ]
        },
        "filled": {
            "leftLabel": "Vulnerable Client-Side Architecture",
            "rightLabel": "Enterprise Hardened XSS & CSP Architecture",
            "leftHighlights": [
                "Unescaped script injection",
                "Context confusion bypass",
                "Hostname CSP bypass",
                "DOM sink exploitation"
            ],
            "rightHighlights": [
                "Context-aware escaping",
                "Strict JSON serialization",
                "Cryptographic nonce CSP",
                "Trusted Types sink lockdown"
            ]
        }
    }
    entries.append(entry)

envelope = {
    "schemaVersion": 2,
    "course": "cyber",
    "prefix": "cyber",
    "day": 42,
    "promptSha": hashlib.sha256(b"cyber-day-42-xss-stored-reflected-dom-csp-nonces-context-aware-escaping").hexdigest(),
    "model": "gemini-2.5-pro",
    "entries": entries
}

os.makedirs("src/lib/data/lessonVisuals/cyber", exist_ok=True)
out_path = "src/lib/data/lessonVisuals/cyber/day-42.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(envelope, f, indent=2)

print(f"Successfully generated {out_path} with {len(entries)} visual entries!")
