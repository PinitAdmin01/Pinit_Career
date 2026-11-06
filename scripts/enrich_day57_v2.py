import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/day57_builder.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Part 3 target last sentence
p3_old = '"In this third segment, we construct an On-Premise Encrypted Vector & Graph Retrieval Engine in pure standard Python. We implement FIPS-compliant payload encryption, execute in-memory HNSW-style nearest-neighbor search, enforce cryptographic role-based partition filtering, and calculate secure retrieval latencies."'

p3_new = '''"To mitigate embedding inversion attacks where attackers reconstruct original documents from vector coordinates, sovereign architectures deploy Differential Privacy and Dimensional Shuffling techniques prior to persistent indexing. By introducing calibrated Gaussian noise to non-critical vector dimensions and periodically applying orthogonal matrix rotations, the platform prevents neural decoders from reconstructing verbatim textual phrases while preserving 99.8% of semantic retrieval rank order. Furthermore, query-side anonymization strips all user identifiers from vector search requests, ensuring that even internal database administrators analyzing index access logs cannot correlate query embeddings with individual executive identities.",
                    "High-Availability Disaster Recovery across geographically distributed air-gapped bunkers represents another fundamental architectural requirement. Regulated financial and defense institutions cannot tolerate single-point data loss, yet cannot replicate data over the public Internet. Sovereign vector deployments utilize Dedicated Dark Fiber Point-to-Point Links protected by optical line-rate MACsec (IEEE 802.1AE) hardware encryption. Vector updates, HNSW graph delta segments, and encrypted document payloads replicate synchronously between primary and secondary subterranean data centers, guaranteeing zero data loss (RPO = 0) and instantaneous failover capability without exposing unencrypted packets to transit networks.",
                    "In this third segment, we construct an On-Premise Encrypted Vector & Graph Retrieval Engine in pure standard Python. We implement FIPS-compliant payload encryption, execute in-memory HNSW-style nearest-neighbor search, enforce cryptographic role-based partition filtering, and calculate secure retrieval latencies."'''

content = content.replace(p3_old, p3_new)

# Part 5 replacement
p5_old = '''"In this final masterclass implementation, we construct the unified Sovereign Cognitive Appliance Control Engine in pure standard Python. We execute a full four-stage sovereign deployment audit, verify all cryptographic proofs, simulate multi-tier clearance queries, test hardware tamper zeroization, and confer the prestigious executive credential: Certified Sovereign AI Systems Architect (CSAISA).",
                    "This elite architectural capability positions you at the absolute forefront of enterprise technology: an architect capable of deploying state-of-the-art cognitive supercomputing in the world's most restrictive, high-security, and high-concurrency sovereign environments."'''

p5_new = '''"Fiduciary governance in autonomous central banking demands unprecedented auditability and operational resilience. When an on-premise cognitive appliance assists in evaluating distressed sovereign debt restructuring proposals or executing emergency foreign exchange swap lines, every intermediate cognitive decision must be accompanied by an indelible cryptographic provenance certificate. The appliance must not only ensure that models run within impenetrable hardware boundaries, but also that every retrieved document chunk, prompt evaluation, and inference output is cryptographically signed and archived into an immutable, air-gapped write-once compliance vault.",
                    "The economic calculus of sovereign on-premise appliances diverges substantially from public cloud economics. While public clouds offer zero upfront capital expenditure, they introduce continuous operational expenditure volatility, unpredictable API price changes, and catastrophic regulatory liability in the event of an extraterritorial data subpoena. A sovereign appliance requires substantial initial capital investment in DGX clusters, HSM hardware, and Faraday enclosure infrastructure, but amortizes across billions of high-security tokens at near-zero marginal cost, yielding lower five-year total cost of ownership while providing absolute statutory immunity and complete technical independence.",
                    "Air-gapped maintenance cycles require meticulous human-in-the-loop operational runbooks. Because automatic over-the-air patches are prohibited by physical disconnection, platform engineers perform scheduled maintenance through cryptographic data diode import stations. Firmware upgrades, kernel patches, and updated model checkpoints are signed by three independent security custodians using hardware smartcards before being introduced to the production enclave, guaranteeing that the air-gapped cluster remains immune to supply chain poisoning and unauthorized backdoors.",
                    "In this final masterclass implementation, we construct the unified Sovereign Cognitive Appliance Control Engine in pure standard Python. We execute a full four-stage sovereign deployment audit, verify all cryptographic proofs, simulate multi-tier clearance queries, test hardware tamper zeroization, and confer the prestigious executive credential: Certified Sovereign AI Systems Architect (CSAISA).",
                    "This elite architectural capability positions you at the absolute forefront of enterprise technology: an architect capable of deploying state-of-the-art cognitive supercomputing in the world's most restrictive, high-security, and high-concurrency sovereign environments."'''

content = content.replace(p5_old, p5_new)

with open('scripts/day57_builder.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated day57_builder.py")
