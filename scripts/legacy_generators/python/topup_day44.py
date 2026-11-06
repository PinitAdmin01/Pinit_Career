import sys
sys.path.append('scripts')
from fullstack_day44_data import DAY_44

p2_topup = "In enterprise Kubernetes deployments, Mutual TLS is frequently orchestrated transparently through service mesh sidecar proxies such as Envoy or Istio. In a service mesh model, application code in Node.js communicates over a local loopback Unix domain socket to the local Envoy sidecar proxy. The Envoy proxy transparently intercepts the outbound network traffic, negotiates the mTLS handshake with the destination service's Envoy sidecar, and streams encrypted ciphertext across the physical network. This architecture offloads TLS CPU overhead to native C++ proxies while providing uniform, audited mutual authentication across the entire enterprise cluster."

p4_topup = "The defensive resilience of dynamic JWKS key rotation is further enhanced through automated health probes and fallback offline keys. In the rare event that the centralized identity provider experiences a transient network outage, consuming microservices continue to validate incoming JWTs using their cached public keys until the local cache time-to-live expires. By setting a conservative cache expiration window (such as twelve hours) and implementing exponential backoff retries on JWKS refresh requests, the microservices ecosystem achieves complete operational independence, decoupling everyday transaction processing from identity server availability."

p5_topup = "The integration of constant-time cryptographic primitives within the Node.js core runtime represents decades of computer science research into side-channel leakage prevention. Enterprise security auditors mandate that all HMAC token verifications, API key comparisons, and digital signature checks pass automated static analysis audits verifying the presence of crypto.timingSafeEqual. By banishing variable-time string comparisons from all authentication codepaths, organizations guarantee that their security posture remains resilient against the most sophisticated network timing analysis attacks."

DAY_44['parts'][1]['say'].append(p2_topup)
DAY_44['parts'][3]['say'].append(p4_topup)
DAY_44['parts'][4]['say'].append(p5_topup)

import pprint
with open('scripts/fullstack_day44_data.py', 'w', encoding='utf-8') as f:
    f.write('# Day 44 Fullstack JS Long Lesson Data\n')
    f.write(f'DAY_44 = {pprint.pformat(DAY_44, width=120, sort_dicts=False)}\n')

print('Topped up Day 44 parts 2, 4, 5!')
