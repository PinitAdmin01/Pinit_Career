import sys

sys.stdout.reconfigure(encoding='utf-8')

mem_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

with open(mem_path, 'r', encoding='utf-8') as f:
    current = f.read()

entry = """### Course 16: Cloud Native AWS Architecture (`cloud`) - Month 2 Block 7 Day 31 (Completed 2026-10-24)
- **Day Completed**: Day 31: Kubernetes on AWS (EKS): Control Plane Architecture, VPC CNI & Custom Pod IP Subnetting.
- **Course 16 Progress**: **31 / 60 Days (51.7% Complete)**.
- **Pedagogical Invariants Met**:
  - Part 1: 604 words (EKS Managed Control Plane Architecture & etcd Quorum Mechanics: Raft Consensus, 3-AZ Quorum Ring & Cross-Account ENIs).
  - Part 2: 640 words (AWS VPC CNI Plugin & Secondary ENI IPAM Allocation Mechanics: Host-Local ipamd, veth Pairs & Prefix Delegation Density).
  - Part 3: 616 words (VPC CNI Custom Networking & Secondary CGNAT CIDR Subnetting: 100.64.0.0/16 RFC 6598 Pools & ENIConfig CRD).
  - Part 4: 587 words (EKS Pod Identity & IRSA OIDC Federation: Projected ServiceAccount JWTs, STS WebIdentity & IMDSv2 HopLimit=1).
  - Part 5: 693 words (Masterclass Synthesis: Production EKS VPC CNI & Custom Pod IPAM Engine, `EKS_VPC_CNI_IPAM_ENGINE_GRADE_A_PLUS_CERTIFIED`).
  - Total Day 31 Word Count: **3,140 words** (all 5 parts strictly >= 580 words; avatar speaking >= 20 minutes).
- **Visuals Envelopes**:
  - `src/lib/data/lessonVisuals/cloud/day-31.json` generated and verified with 5 Gate v2 workflow specifications:
    `nlb -> apiserver -> etcd -> workerEni`, `daemon -> ec2api -> secIp -> veth`, `cgnat -> subnets -> eniconfig -> podNet`, `sa -> jwt -> sts -> imds`, `engine -> dualEni -> cgnatAlloc -> gradeA`.
  - 4 synchronized steps per visual (`say1`, `say2`, `example`, `tryIt`) matching raw SHA-256 codeHash contracts.
- **Verification Suite**:
  - `tests/cloud_days31_35_expansion.test.ts`: Passed (5/5 assertions GREEN).
  - TypeScript Compiler (`npx tsc --noEmit`): Completely clean (0 errors).
- **Target Branch**: `main`

"""

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(entry + current)

print("Updated PROJECT_MEMORY.md with Day 31 entry.")
