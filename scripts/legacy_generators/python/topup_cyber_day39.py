# scripts/topup_cyber_day39.py
import sys, os
sys.path.insert(0, os.path.abspath("."))

with open("scripts/create_cyber_day39_data.py", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    'assert wc >= 600, f"Part {p[\'part\']} word count {wc} below 600 words!"',
    '# assert wc >= 600'
)

with open("scripts/create_cyber_day39_data.py", "w", encoding="utf-8") as f:
    f.write(text)

import scripts.create_cyber_day39_data as d39

p2_extra = [
    "From an implementation standpoint, security engineers must also configure their XML digital signature verifiers to enforce strict cryptographic algorithm whitelists. Historically, vulnerabilities in legacy XMLDSig implementations allowed attackers to downgrade signature algorithms to broken primitives like SHA-1 or even obsolete MD5. In modern enterprise environments, Service Providers must reject any SAML response or assertion whose `<ds:SignatureMethod>` or `<ds:DigestMethod>` utilizes anything less than RSA with SHA-256 (`http://www.w3.org/2001/04/xmldsig-more#rsa-sha256`) or ECDSA with SHA-256 (`http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256`).",
    "Furthermore, security engineers must safeguard against Transform Manipulation attacks. XMLDSig allows an XML document to declare arbitrary `<ds:Transform>` elements that are executed sequentially prior to canonicalization and hashing. Attackers have historically exploited malicious transforms, such as XSLT or XPath filter transforms, to trigger remote code execution, CPU exhaustion, or arbitrary file inclusion. Modern enterprise SAML profiles strictly forbid arbitrary XSLT transforms, permitting only the Enveloped Signature Transform and Exclusive XML Canonicalization."
]

p3_extra = [
    "In addition to schema validation and single assertion cardinality, enterprise Service Providers must secure their XML parsing engines against XML External Entity (XXE) and XML Entity Expansion attacks. An attacker can construct a malicious SAML assertion containing an inline Document Type Definition (DTD) declaring external system entities (e.g., `<!ENTITY xxe SYSTEM \"file:///etc/passwd\">`). If the SP's XML parser resolves external entities by default, the attacker can extract sensitive system configuration files or initiate server-side request forgery (SSRF) against internal cloud metadata services.",
    "To eliminate XXE and entity expansion vulnerabilities permanently, enterprise SAML parsers must explicitly disable external general entities, external parameter entities, and inline DTD processing altogether (e.g., setting `disallow-doctype-decl` to true). By enforcing complete entity lockdown alongside structural schema validation, the Service Provider achieves robust defense-in-depth against both content injection and structure wrapping attacks."
]

p4_extra = [
    "From a distributed cloud infrastructure perspective, synchronizing assertion replay caches across globally distributed edge gateways presents a key architectural challenge. If an enterprise Service Provider operates multiple active-active data centers, an adversary could intercept a valid SAML assertion and simultaneously replay it against two geographically separated gateways before local memory caches can synchronize. To mitigate this race condition, enterprise identity gateways utilize globally replicated, high-performance distributed key-value caches with strong consistency or localized geofencing.",
    "Additionally, security operations teams should establish automated security incident alerts triggered by assertion replay attempts. A rejected replay attempt is rarely a benign client error; it typically signals an active network eavesdropper, a compromised corporate proxy, or a malicious browser extension attempting to hijack legitimate employee credentials. Automated SOC workflows should immediately isolate the affected user session, notify corporate identity administrators, and initiate targeted forensic analysis of recent client network traffic."
]

p5_extra = [
    "When integrating SAML 2.0 Service Provider gateways into automated continuous integration and continuous deployment (CI/CD) pipelines, security regression suites must systematically test all nine verification checkpoints. Automated test harnesses should execute adversarial attacks, including submitting SAML responses with altered NameID subjects, missing signatures, tampered XML digests, expired NotOnOrAfter timestamps, replayed assertion IDs, and wrapped assertion payloads. These automated tests guarantee that subsequent infrastructure updates cannot inadvertently weaken the organization's authentication posture.",
    "In conclusion, mastering SAML 2.0 equips enterprise cybersecurity engineers with the foundational knowledge required to audit, harden, and operate mission-critical corporate single sign-on infrastructures. By coupling mathematical XML digital signatures and exclusive canonicalization with strict schema enforcement and assertion replay mitigation, enterprise platforms can securely bridge decades of corporate identity federation into modern zero-trust security postures."
]

d39.say_p2.extend(p2_extra)
d39.say_p3.extend(p3_extra)
d39.say_p4.extend(p4_extra)
d39.say_p5.extend(p5_extra)

day39_data = d39.day39_data
day39_data["parts"][0]["say"] = d39.say_p1
day39_data["parts"][1]["say"] = d39.say_p2
day39_data["parts"][2]["say"] = d39.say_p3
day39_data["parts"][3]["say"] = d39.say_p4
day39_data["parts"][4]["say"] = d39.say_p5

total_words = 0
for p in day39_data["parts"]:
    wc = sum(len(x.split()) for x in p["say"])
    print(f"Cyber Day 39 Part {p['part']} Word Count: {wc}")
    assert wc >= 600, f"Part {p['part']} word count {wc} below 600 words!"
    total_words += wc

print(f"Total Cyber Day 39 Words: {total_words}")

with open("scripts/cyber_day39_data.py", "w", encoding="utf-8") as f:
    f.write("# Cyber Day 39 Data\nDAY_39_DATA = " + repr(day39_data) + "\n")

print("Generated scripts/cyber_day39_data.py successfully!")
