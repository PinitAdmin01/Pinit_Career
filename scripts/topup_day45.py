import sys
sys.path.append('scripts')
from fullstack_day45_data import DAY_45

p2_topup = "In production cloud architecture, edge caching and rate limiting are intimately tied to infrastructure cost governance. When an enterprise platform absorbs millions of daily API requests, every database query avoided translates directly into lower cloud compute bills and reduced hardware provisioning requirements. By shielding the persistent database behind an intelligent two-tier caching fabric and an atomic sliding window rate limiter, the system achieves maximum economic efficiency while guaranteeing predictable, sub-millisecond latencies for legitimate users."

p3_topup = "The defensive maturity of the asynchronous task mesh is demonstrated during catastrophic downstream outages. When an upstream banking partner or cloud database experiences complete connectivity blackouts lasting thirty minutes or more, the task mesh does not fail. Jobs accumulate safely within persistent Redis streams and sorted sets. Once connectivity is restored, workers resume processing smoothly under jittered backoff, clearing the backlog without dropping a single transaction or requiring human emergency intervention."

p4_topup = "The implementation of Zero-Trust cryptographic invariants transforms enterprise security from an afterthought into an immutable architectural foundation. By verifying Mutual TLS certificates at the transport layer, enforcing Ed25519 payload signatures at the application layer, and executing timing-safe HMAC comparisons in constant CPU cycles, the platform satisfies the most stringent regulatory compliance frameworks (including SOC 2 Type II, PCI-DSS Level 1, and ISO 27001) while delivering uncompromised microservices velocity."

p5_topup = "The 5-Gate Distributed Systems Defense Matrix cements a permanent standard of software engineering craftsmanship across all PinIT Career OS enterprise teams. In peer architectural reviews and viva voce defenses, candidates defend their telemetry metrics, demonstrate automated recovery from simulated network partitions, and explain cryptographic trade-offs to senior principal engineers. Achieving full certification validates that the architect possesses the elite systems skills necessary to design, deploy, and command mission-critical distributed platforms on the global stage."

DAY_45['parts'][1]['say'].append(p2_topup)
DAY_45['parts'][2]['say'].append(p3_topup)
DAY_45['parts'][3]['say'].append(p4_topup)
DAY_45['parts'][4]['say'].append(p5_topup)

import pprint
with open('scripts/fullstack_day45_data.py', 'w', encoding='utf-8') as f:
    f.write('# Day 45 Fullstack JS Long Lesson Data\n')
    f.write(f'DAY_45 = {pprint.pformat(DAY_45, width=120, sort_dicts=False)}\n')

print('Topped up Day 45 parts 2, 3, 4, 5!')
