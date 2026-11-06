import json
import re

topup_p1 = [
    "To fully protect the Kubernetes control plane, security architects must implement the NodeRestriction admission plugin and audit logging. In large distributed clusters, worker nodes communicate with `kube-apiserver` via the `kubelet` agent. If an attacker gains root access to a single worker node, they can extract the kubelet's client credentials. Without NodeRestriction, a compromised kubelet could modify pods, secrets, and labels on completely different nodes across the cluster. The NodeRestriction admission plugin strictly limits what a kubelet can modify: a kubelet is permitted to modify only its own Node API object and only the Pod API objects actively scheduled to that specific node, preventing cluster-wide lateral pivot.",
    "Furthermore, enterprise compliance mandates configuring the Kubernetes Audit Subsystem via an `AuditPolicy` manifest. Audit logging captures every interaction with `kube-apiserver` across four distinct stages: `RequestReceived`, `ResponseStarted`, `ResponseComplete`, and `Panic`. Policies define audit levels ranging from `Metadata` (logging requesting user, timestamp, resource, and verb) to `RequestResponse` (capturing complete payload bodies). In production, audit logs are streamed in real time via HTTPS webhooks to centralized Security Information and Event Management (SIEM) platforms, enabling immediate automated alerting whenever unauthorized attempts to access secrets or modify RBAC bindings occur."
]

topup_p2 = [
    "Delving deeper into Kubernetes RBAC, engineers must understand the built-in Privilege Escalation Prevention mechanism. Kubernetes prevents users from granting themselves permissions they do not already possess. Specifically, a user cannot create or update a Role or ClusterRole containing API rules unless the user already holds all those permissions across the exact same scope, or unless they possess the specialized `escalate` verb on `roles` in the `rbac.authorization.k8s.io` API group. Similarly, a user cannot bind a Role to a subject via a RoleBinding unless they hold the permissions contained within the Role, or hold the `bind` verb on the target Role. This prevents rogue developers from escalating their privileges to cluster-admin.",
    "Additionally, modern Kubernetes versions implement Bound Service Account Tokens (Projected ServiceAccount Tokens). Instead of generating an indefinite, static secret token stored in etcd, the kubelet requests a short-lived, cryptographically signed JSON Web Token from the API server. This projected token is bound directly to the pod's specific lifetime, pod name, and UID, and carries a strict expiration time (typically one hour) with automated background rotation. If an attacker steals a projected service account token from container memory, the token is useless once the pod terminates or the expiration window elapses, dramatically shrinking the window of credential vulnerability."
]

topup_p3 = [
    "To operationalize Pod Security Admission (PSA) without disrupting active business services, Kubernetes supports a sophisticated progressive rollout strategy across three concurrent modes: `enforce`, `audit`, and `warn`. A namespace can simultaneously configure all three modes using distinct labels: for example, setting `pod-security.kubernetes.io/warn: restricted` immediately alerts developers in their CLI or CI/CD pipelines if a manifest violates restricted standards, while `pod-security.kubernetes.io/audit: restricted` logs non-compliant workloads to the cluster audit log without terminating them. Once development teams refactor their manifests to satisfy restricted requirements, administrators promote the namespace to `pod-security.kubernetes.io/enforce: restricted`, establishing an uncompromising block against non-compliant pods.",
    "Crucially, the PSS Restricted standard mandates kernel-level system call confinement by requiring `seccompProfile.type: RuntimeDefault` or `Localhost`. In default Kubernetes configurations without PSS, containers run with `seccompProfile.type: Unconfined`, leaving the entire surface of over 450 Linux kernel system calls exposed to container processes. Enforcing `RuntimeDefault` seccomp in the restricted profile automatically blocks dozens of dangerous kernel routines (including `ptrace` and `sys_chroot`), ensuring that even if an attacker discovers a container escape flaw, the kernel blocks the requisite system calls at runtime."
]

topup_p4 = [
    "Comparing underlying CNI implementations highlights why modern cloud infrastructure is rapidly transitioning from legacy iptables to eBPF-powered network policies via Cilium. In standard Kubernetes clusters using kube-proxy and iptables, every NetworkPolicy and Service rule is converted into sequential chains of iptables rules in the Linux kernel. In clusters with thousands of pods and services, iptables rule sets grow to tens of thousands of entries, degrading packet throughput and introducing substantial CPU overhead. In contrast, Cilium compiles NetworkPolicy rules directly into extended Berkeley Packet Filter (eBPF) byte-code attached to Linux traffic control (tc) hooks and socket layers, evaluating network rules in constant time O(1) with near-zero latency.",
    "Furthermore, advanced eBPF CNIs support Layer 7 Application-Aware Network Policies. Standard Kubernetes NetworkPolicies operate strictly at OSI Layer 3 (IP) and Layer 4 (TCP/UDP ports). However, in modern microservices, two services might communicate over port 8080 where one service should only have read access. Layer 7 network policies allow administrators to specify HTTP methods and path rules: for instance, permitting `GET /v1/products` while unconditionally rejecting `POST /v1/admin/delete` or `PUT /v1/settings`. This provides deep microservice API segmentation directly at the kernel networking layer without requiring external API gateways."
]

topup_p5 = [
    "To achieve planetary-scale compliance, enterprise Kubernetes deployments align with the CIS Kubernetes Benchmark, implementing stringent node-level hardening. On worker nodes, the `kubelet` configuration file (`/var/lib/kubelet/config.yaml`) must set `authentication.anonymous.enabled: false`, `authorization.mode: Webhook`, and `readOnlyPort: 0`. Disabling the read-only kubelet port (port 10255) prevents unauthenticated attackers on the internal network from dumping pod manifests, environment variables, and node health metrics. Additionally, `--protect-kernel-defaults=true` must be set, ensuring the kubelet aborts startup if host kernel sysctl parameters deviate from secure baselines.",
    "Complementing preventative controls is Runtime Behavioral Anomaly Detection using open-source tools like Falco. Deployed as a DaemonSet across all cluster nodes, Falco leverages eBPF probes to continuously monitor the stream of all system calls across all running containers. If a containerized process unexpectedly spawns a shell (`/bin/bash`), attempts to modify binary directories (`/bin` or `/sbin`), reads sensitive credential files (`/etc/shadow`), or queries the cloud metadata IP, Falco triggers immediate cryptographic security alerts and can invoke automated Kubernetes response actions (such as cordoning the node or deleting the compromised pod) within milliseconds."
]

with open("scripts/create_cyber_day48_data.py", "r", encoding="utf-8") as f:
    text = f.read()

new_text = text
for i, topup in enumerate([topup_p1, topup_p2, topup_p3, topup_p4, topup_p5], 1):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    new_text = re.sub(pattern, rf'\1{topup_str}\2', new_text, count=1)

with open("scripts/create_cyber_day48_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated create_cyber_day48_data.py with topups!")
