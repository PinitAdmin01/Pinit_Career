# scripts/topup_cyber_day34.py

content = open("scripts/create_cyber_day34_data.py", "r", encoding="utf-8").read()

p1_extra = """    "Seventh, Cross-Signing and Zero-Downtime Root CA Migration: When a Root Certificate Authority nears its twenty-year cryptographic retirement, replacing it in billions of consumer devices cannot occur overnight. PKI architectures solve this through Cross-Signing: an established, mature Root CA issues a cross-signature on the newly generated Root CA's intermediate certificate. Legacy devices that recognize only the older root accept the certificate through the cross-signed chain, while modern devices validate against the newer root directly, ensuring seamless global interoperability without service interruptions.",
"""

p2_extra = """    "Seventh, Public Key Pinning (HPKP) Deprecation and Modern DANE Standards: In the mid-2010s, web standards experimented with HTTP Public Key Pinning (HPKP), allowing servers to instruct browsers to accept only specific public key hashes. However, HPKP became notorious for self-inflicted Denial of Service: if an organization lost their pinned backup private keys or experienced a certificate reissuance error, their website became permanently bricked and inaccessible for months! The IETF deprecated HPKP in favor of Certificate Transparency (CT) and DNS-based Authentication of Named Entities (DANE / TLSA via DNSSEC), which provides cryptographic domain key binding without bricking risks.",
"""

p3_extra = """    "Sixth, OCSP Must-Staple Extensions (RFC 7633): While OCSP stapling is a dramatic improvement over direct client OCSP queries, an active network attacker could still execute a downgrade attack by intercepting the TLS handshake and stripping the stapled OCSP response! If browsers fall back to soft-fail, the attacker's revoked certificate is accepted. To eliminate this downgrade attack, enterprise domains configure the OCSP Must-Staple X.509 extension. When present, the browser is strictly forbidden from connecting unless a valid, fresh OCSP response is present in the TLS handshake, turning soft-fail into an unshakeable hard-fail security guarantee.",
"""

p4_extra = """    "Sixth, Gossip Protocols and Independent Log Monitors: Merkle tree append-only logs are only effective if their consistency is continuously audited. What prevents a compromised CT log operator from presenting a 'split view'—showing one version of the log containing a rogue certificate to a victim, while showing a clean version to security researchers? To prevent split-view attacks, modern browsers and security monitors participate in CT Gossip Protocols: clients exchange cryptographic Merkle tree heads (STHs) and audit consistency proofs (`proof-of-inclusion`), mathematically proving that all observers across the globe see the exact same immutable ledger of issued certificates.",
"""

p5_extra = """    "Fifth, Automated Certificate Management Environment (ACME) Protocol: In modern DevOps and cloud infrastructure, managing certificates manually via email and human CSR generation is an obsolete, dangerous antipattern. The industry revolutionized PKI issuance through the ACME protocol (RFC 8555), popularized by Let's Encrypt. ACME agents (such as Certbot or Traefik) automatically prove domain control by answering automated HTTP-01 or DNS-01 cryptographic challenges, requesting certificate issuance, configuring TLS listeners, and renewing certificates every sixty days with zero human intervention.",
    "Sixth, Mutual TLS (mTLS) in Service Meshes: Beyond public-facing web servers, enterprise internal microservices deploy private PKI fabrics managed by HashiCorp Vault, SPIFFE/SPIRE, or Istio. Every microservice pod is issued an ephemeral, short-lived X.509 certificate valid for twenty-four hours. Microservices communicate exclusively over mutual TLS, evaluating client certificates against strict admission policies, guaranteeing zero-trust identity across multi-cloud enterprise clusters.",
"""

# Replace in content
content = content.replace(
    '    "In the TypeScript snippet below, we construct the PkiNode',
    f'{p1_extra}    "In the TypeScript snippet below, we construct the PkiNode'
)

content = content.replace(
    '    "In the TypeScript snippet below, we demonstrate how asymmetric key pairs',
    f'{p2_extra}    "In the TypeScript snippet below, we demonstrate how asymmetric key pairs'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the OcspStaplingValidator',
    f'{p3_extra}    "In the TypeScript snippet below, we implement the OcspStaplingValidator'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the CertificateTransparencyAuditor',
    f'{p4_extra}    "In the TypeScript snippet below, we implement the CertificateTransparencyAuditor'
)

content = content.replace(
    '    "In the TypeScript snippet below, we implement the ProductionPkiChainValidator',
    f'{p5_extra}    "In the TypeScript snippet below, we implement the ProductionPkiChainValidator'
)

open("scripts/create_cyber_day34_data.py", "w", encoding="utf-8").write(content)
print("Updated scripts/create_cyber_day34_data.py with expansions.")
