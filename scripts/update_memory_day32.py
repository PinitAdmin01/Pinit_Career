import sys

sys.stdout.reconfigure(encoding='utf-8')

mem_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

with open(mem_path, 'r', encoding='utf-8') as f:
    current = f.read()

entry = """### Course 16: Cloud Native AWS Architecture (`cloud`) - Month 2 Block 7 Day 32 (Completed 2026-10-24)
- **Day Completed**: Day 32: EKS Compute Engine: Managed Node Groups vs Karpenter Dynamic Node Auto-Provisioning.
- **Course 16 Progress**: **32 / 60 Days (53.3% Complete)**.
- **Pedagogical Invariants Met**:
  - Part 1: 658 words (EKS Managed Node Groups vs Karpenter: Cloud-Native Auto-Scaling Paradigm Shift & Cluster Autoscaler Scaling Latency Bottlenecks).
  - Part 2: 588 words (Karpenter Architecture & NodePool Declarative Scheduling: CRD Controllers, Bin-Packing Algorithms & Just-in-Time Instance Provisioning).
  - Part 3: 618 words (EC2 Spot Interruption Handling & Node Disruption Budgets: EventBridge SQS Webhook Draining, Rebalance Recommendations & Graceful Termination).
  - Part 4: 616 words (EKS AMI Management, Bottlerocket OS & Security Hardening: Transactional Updates, Read-Only Rootfs & Container Isolation).
  - Part 5: 586 words (Masterclass Synthesis: Production Karpenter Bin-Packing & Spot Interruption Controller Engine, `KARPENTER_DYNAMIC_ENGINE_GRADE_A_PLUS_CERTIFIED`).
  - Total Day 32 Word Count: **3,066 words** (all 5 parts strictly >= 580 words; avatar speaking >= 20 minutes).
- **Visuals Envelopes**:
  - `src/lib/data/lessonVisuals/cloud/day-32.json` generated and verified with 5 Gate v2 workflow specifications:
    `unschedPod -> karpenter -> fleetApi -> ec2Join`, `nodePool -> binPack -> instanceSelect -> spotOpt`, `spotWarning -> eventBridge -> sqsQueue -> cordonDrain`, `bottlerocket -> updateOperator -> a_b_partition -> reboot`, `scheduler -> podQueue -> binPacker -> spotWorker`.
  - 4 synchronized steps per visual (`say1`, `say2`, `example`, `tryIt`) matching raw SHA-256 codeHash contracts.
- **Verification Suite**:
  - `tests/cloud_days31_35_expansion.test.ts`: Passed (5/5 assertions GREEN across Days 31-32).
  - TypeScript Compiler (`npx tsc --noEmit`): Completely clean (0 errors).
- **Target Branch**: `main`

"""

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(entry + current)

print("Updated PROJECT_MEMORY.md with Day 32 entry.")
