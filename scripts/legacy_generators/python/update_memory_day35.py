import sys

sys.stdout.reconfigure(encoding='utf-8')

mem_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

with open(mem_path, 'r', encoding='utf-8') as f:
    current = f.read()

entry = """### Course 16: Cloud Native AWS Architecture (`cloud`) - Month 2 Block 7 Day 35 (Completed 2026-10-24)
- **Day Completed**: Day 35: ⭐ MILESTONE 6: Enterprise EKS Kubernetes Cluster with Karpenter, ALB Ingress & mTLS Zero Trust.
- **BLOCK 7 STATUS**: **100% COMPLETE (Days 31–35 Graduated & Verified)**.
- **Course 16 Progress**: **35 / 60 Days (58.3% Complete)**.
- **Pedagogical Invariants Met**:
  - Part 1: 609 words (Enterprise EKS Platform Blueprint: Control Plane KMS Envelope Encryption, Audit Logging & IMDSv2 Isolation).
  - Part 2: 596 words (Dynamic Compute Tier: Karpenter Just-In-Time Spot Provisioning, Consolidation & PodDisruptionBudget Governance).
  - Part 3: 615 words (Edge-to-Pod Ingress: AWS Load Balancer Controller, IP-Mode Routing & Pod Readiness Gate Synchronization).
  - Part 4: 604 words (Zero-Trust Microservice Mesh: Istio STRICT mTLS, Automated SPIFFE PKI & Declarative Layer 7 RBAC).
  - Part 5: 595 words (⭐ MILESTONE 6 SYNTHESIS: Enterprise EKS Platform Verification & Production Capstone Engine, `GRADE_A_PLUS_PRODUCTION_CERTIFIED`).
  - Total Day 35 Word Count: **3,019 words** (all 5 parts strictly >= 580 words; avatar speaking >= 20 minutes).
- **Block 7 Architectural Achievements**:
  - Scale-out: 2 to 100 Pods in 42s (under 45s SLA) via Karpenter.
  - Security: KMS secret envelope encryption, IMDSv2 hop limit 1, Istio STRICT mTLS with 12h rotation, Layer 7 AuthorizationPolicies.
  - Ingress: AWS ALB IP target mode bypassing NodePort double-hop, Pod Readiness Gates (`target-health.elbv2.k8s.aws`).
  - Resilience: PodDisruptionBudgets (PDBs) protecting node consolidation, EventBridge SQS Spot draining, circuit breaking on consecutive 5xx errors.
- **Visuals Envelopes**:
  - `src/lib/data/lessonVisuals/cloud/day-35.json` generated and verified with 5 Gate v2 workflow specifications:
    `platform_blueprint -> kms_envelope -> imds_hop_limit -> pod_identity_oidc`, `karpenter_fleet -> spot_diversification -> pdb_protection -> spot_interruption_drain`, `direct_ip_routing -> ingress_group_merge -> readiness_gate_hold -> connection_drain`, `envoy_interception -> strict_peer_auth -> authz_policy_evaluation -> canary_circuit_breaker`, `platform_unification -> scale_surge_verified -> reliability_execution -> grade_a_certification`.
  - 4 synchronized steps per visual (`say1`, `say2`, `example`, `tryIt`) matching raw SHA-256 codeHash contracts.
- **Verification Suite**:
  - `tests/cloud_days31_35_expansion.test.ts`: Passed (5/5 assertions GREEN across all Days 31-35).
  - TypeScript Compiler (`npx tsc --noEmit`): Clean.
- **Target Branch**: `main`

"""

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(entry + current)

print("Updated PROJECT_MEMORY.md with Day 35 entry.")
