# scripts/topup_cyber_day36.py
import re

with open("scripts/create_cyber_day36_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Let's inspect paragraphs to add for parts 1 to 5 to make sure each has >= 620 words
p1_extra = [
    "From an engineering governance standpoint, migrating from legacy OAuth 2.0 to OAuth 2.1 requires an aggressive inventory of all existing enterprise client registrations. Security operations teams must systematically inspect API gateway access logs to detect deprecated authorization grant requests. Any legacy clients attempting to invoke the `/token` endpoint with `grant_type=password` or initiating browser redirects with `response_type=token` must be flagged for urgent refactoring. Modern API security gateways should be configured to reject these legacy patterns with an HTTP 400 Bad Request indicating that OAuth 2.1 mandates the Authorization Code Flow with PKCE.",
    "Furthermore, enterprise identity architects must establish strict redirect URI validation mechanisms. Under OAuth 2.1, authorization servers must enforce exact string matching for all redirect URIs registered by client applications. Wildcard matching, such as allowing any subdomain or arbitrary path parameters, is explicitly prohibited because it introduces dangerous open redirector vulnerabilities that attackers can exploit to steal authorization codes. By pairing exact redirect URI matching with mandatory PKCE and deprecating insecure legacy flows, OAuth 2.1 establishes a defensible, deterministic authorization baseline for enterprise microservices and cloud workloads."
]

p2_extra = [
    "In high-security enterprise environments, the generation and storage of the `code_verifier` must adhere strictly to cryptographic standards. The client application must utilize an operating system-level cryptographically secure pseudorandom number generator (CSPRNG), such as Node.js `crypto.randomBytes`, browser `window.crypto.getRandomValues`, or native iOS `SecRandomCopyBytes`. The resulting random entropy must be transformed into an unguessable string using the URL-safe Base64 character set without padding. Storing the verifier in insecure persistent storage, such as browser localStorage or unencrypted SQLite databases, must be avoided; instead, client applications should keep the verifier in transient, in-memory process space or secure operating system keychains.",
    "Additionally, authorization servers must reject the legacy `code_challenge_method=plain` option. While the original RFC 7636 specification allowed a plaintext challenge method for constrained devices unable to compute SHA-256 hashes, OAuth 2.1 deprecates `plain` entirely and mandates `code_challenge_method=S256`. Enforcing SHA-256 ensures that even if an adversary manages to eavesdrop on the authorization request containing the challenge, deriving the original verifier remains computationally infeasible due to the preimage resistance of the SHA-256 cryptographic hash function."
]

p3_extra = [
    "Enterprise security policies frequently mandate that high-privilege confidential clients implement mutual TLS (mTLS) alongside Private Key JWT client authentication (RFC 8705). By binding access tokens cryptographically to the client's mutual TLS certificate (known as sender-constrained tokens), authorization servers ensure that even if an access token is intercepted in transit, an attacker cannot replay it against resource servers without possessing the corresponding client TLS private key. This multi-layered defense-in-depth model eliminates the risks associated with bearer token theft across public networks.",
    "When implementing Private Key JWT authentication, security engineers must also enforce strict token lifetime limits and replay protection on client assertions. The `exp` claim in the client assertion JWT should typically expire within sixty seconds of generation, and authorization servers must record the unique `jti` (JWT ID) claim in an ephemeral cache such as Redis. If a second authentication request is received bearing the same `jti` within the validity window, the authorization server must immediately reject the request as a malicious replay attack and raise an automated security alert."
]

p4_extra = [
    "To maximize the security of Refresh Token Rotation in distributed cloud architectures, identity servers should store refresh token records in a globally synchronized, high-performance database with strong consistency guarantees. When an incoming token exchange request arrives, the server must execute the rotation within an atomic transaction or distributed lock to prevent race conditions. If an attacker and a legitimate client simultaneously submit the same refresh token across different geographic data centers, the atomic transaction ensures that exactly one request succeeds while the second triggers instantaneous token family invalidation.",
    "Moreover, enterprise identity teams must pair Refresh Token Rotation with adaptive risk scoring and automated telemetry. Whenever a token family is invalidated due to suspected reuse, the security operations center (SOC) should receive an automated incident notification detailing the affected user ID, client ID, geographic IP locations, and device fingerprints of both the initial rotation and the duplicate attempt. This real-time intelligence empowers incident responders to isolate compromised user accounts, revoke active SSO sessions, and trigger mandatory out-of-band identity verification before allowing further access."
]

p5_extra = [
    "When deploying OAuth 2.1 audit suites across enterprise continuous integration and continuous deployment (CI/CD) pipelines, automated security tests must continuously assert that all identity endpoints strictly enforce the modern specifications. Security regression test suites must simulate adversarial attacks, including attempting authorization requests without code challenges, supplying mismatched code verifiers, replaying expired client assertions, and presenting rotated refresh tokens. These automated verification gates prevent configuration drift and ensure that developer updates do not accidentally re-enable deprecated grant flows or relax redirect URI validation.",
    "Furthermore, security operations centers must monitor real-time metrics across all authorization server clusters. Metrics should include authorization code issuance rates, token redemption latency, PKCE verification failure rates, and refresh token rotation anomaly spikes. A sudden surge in PKCE verification failures often indicates an active adversary attempting code interception attacks against mobile clients or automated scanners probing the authorization endpoint with invalid parameters. Automated alerting thresholds allow security operations teams to intervene proactively before sensitive user accounts are impacted.",
    "In conclusion, mastering OAuth 2.1, PKCE, asymmetric client authentication, and Refresh Token Rotation equips security engineers with the comprehensive toolkit required to architect resilient, zero-trust identity infrastructures. By enforcing strict mathematical bindings between authorization requests and token exchanges, eliminating static pre-shared secrets, and rapidly containing credential theft through automated token family revocation, modern enterprise systems can safely empower distributed microservices, third-party integrations, and mobile clients across the modern threat landscape."
]

# Let's inject extra paragraphs into say_p1..p5 in create_cyber_day36_data.py
import sys, os
sys.path.insert(0, os.path.abspath("."))
import scripts.create_cyber_day36_data as d36

d36.say_p1.extend(p1_extra)
d36.say_p2.extend(p2_extra)
d36.say_p3.extend(p3_extra)
d36.say_p4.extend(p4_extra)
d36.say_p5.extend(p5_extra)

day36_data = d36.day36_data
day36_data["parts"][0]["say"] = d36.say_p1
day36_data["parts"][1]["say"] = d36.say_p2
day36_data["parts"][2]["say"] = d36.say_p3
day36_data["parts"][3]["say"] = d36.say_p4
day36_data["parts"][4]["say"] = d36.say_p5

total_words = 0
for p in day36_data["parts"]:
    wc = sum(len(x.split()) for x in p["say"])
    print(f"Cyber Day 36 Part {p['part']} Word Count: {wc}")
    assert wc >= 600, f"Part {p['part']} word count {wc} below 600 words!"
    total_words += wc

print(f"Total Cyber Day 36 Words: {total_words}")

with open("scripts/cyber_day36_data.py", "w", encoding="utf-8") as f:
    f.write("# Cyber Day 36 Data\nDAY_36_DATA = " + repr(day36_data) + "\n")

print("Generated scripts/cyber_day36_data.py successfully!")
