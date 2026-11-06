import json

topup_p1 = [
    "To fully master Linux namespaces and cgroups v2, security engineers must understand the specific mechanics of User Namespaces (userns) and rootless container execution. In a default Docker configuration without user namespaces, root inside the container (UID 0) corresponds directly to UID 0 (root) on the host kernel. If an attacker exploits a container escape vulnerability (such as a kernel privilege escalation or an unmasked `/proc` or `/sys` mount), they arrive on the host with full superuser privileges. User namespaces eliminate this catastrophic failure mode by translating UID/GID ranges using host configuration files `/etc/subuid` and `/etc/subgid`. For instance, container UID 0 is mapped to unprivileged host UID 100000. If an attacker escapes a rootless container, the host kernel treats their process as unprivileged UID 100000, possessing zero authority to touch host system files or manipulate other processes.",
    "Furthermore, the transition from cgroups v1 to cgroups v2 (unified control hierarchy) resolved critical architectural flaws in Linux resource governance. In cgroups v1, each resource controller (cpu, memory, blkio) operated in an independent, disjointed directory hierarchy, creating race conditions and unpredictable out-of-memory behavior where processes could be killed by one controller while another controller ignored memory exhaustion. Under cgroups v2, Linux provides a single unified tree anchored at `/sys/fs/cgroup/`. Controllers are enabled atomically on a per-cgroup basis via `cgroup.subtree_control`. Critically, cgroups v2 introduces two-tier memory control: `memory.high` acts as a soft throttling threshold that slows down allocation and forces background page reclamation without crashing the process, whereas `memory.max` enforces a hard limit that immediately triggers the kernel OOM killer if allocations cannot be reclaimed. Pairing `memory.max` with `pids.max` guarantees that no compromised workload can exhaust host physical RAM or crash the kernel thread scheduler."
]

topup_p2 = [
    "To engineer robust privilege separation, engineers must master the internal architecture of POSIX Linux capabilities across its five distinct sets: Effective, Permitted, Inheritable, Bounding, and Ambient. The Effective set contains the capabilities currently activated and evaluated during kernel permission checks. The Permitted set defines the maximum capabilities the process is legally allowed to enable in its Effective set. The Bounding set acts as a system-wide ceiling: once a capability is dropped from the Bounding set, neither the process nor any of its child processes can ever acquire it, even if executing a setuid root binary. The Ambient set, introduced in Linux 4.3, allows non-root processes to preserve unprivileged capabilities across `execve()` system calls, making modern rootless daemons possible without setuid binaries.",
    "Crucially, securing Linux hosts requires enforcing `prctl(PR_SET_NO_NEW_PRIVS, 1)`. When the `NO_NEW_PRIVS` flag is set, the kernel guarantees that the process and all its descendants can never gain new privileges through setuid or setgid binaries. For instance, even if a compromised container process executes `/usr/bin/sudo` or `/bin/su`, the setuid bit is completely ignored by the kernel. Additionally, security audits must strictly prohibit `CAP_NET_RAW` (which allows raw packet creation, spoofing, and promiscuous ARP cache poisoning on local networks) and `CAP_DAC_READ_SEARCH` (which allows bypassing file read permission checks, enabling attackers to read sensitive database credentials and `/etc/shadow` without requiring full root access). By enforcing capability bounding sets and dropping all unnecessary privileges, the host attack surface is reduced to the absolute minimum."
]

topup_p3 = [
    "Delving deeper into seccomp-bpf, security engineers must understand how the Linux kernel executes Berkeley Packet Filter bytecode on system call invocation. Originally developed for network packet filtering in tools like `tcpdump`, classic BPF provides an ultra-fast, in-kernel register-based virtual machine. In seccomp-bpf, instead of filtering network packets, the BPF program inspects a `seccomp_data` struct passed by the kernel containing the system call architecture (`arch`), the system call number (`nr`), the instruction pointer (`instruction_pointer`), and up to six 64-bit system call arguments (`args[0]` through `args[5]`). The BPF filter executes in constant time, meaning syscall interception introduces negligible performance overhead (typically less than one percent), making it universally deployable across latency-critical production microservices.",
    "Crucially, seccomp filters are additive and immutable: once a seccomp filter is attached via `seccomp(SECCOMP_SET_MODE_FILTER, ...)`, it can never be removed or weakened by the calling process or any of its descendants. Any subsequent filters attached by child processes can only further restrict the permitted syscall set, never expand it. Furthermore, production seccomp policies utilize `SECCOMP_RET_LOG` during initial staging and canary deployments. This permits operational teams to log all unrecognized system calls to the Linux audit framework without terminating live production transactions. Once an application's syscall footprint is completely baselined across test suites, the policy is promoted to enforce `SECCOMP_RET_ERRNO` or `SECCOMP_RET_KILL_PROCESS`, shutting down zero-day kernel exploits before an attacker can invoke vulnerable kernel routines."
]

topup_p4 = [
    "To achieve defense-in-depth, security engineers combine Mandatory Access Control with kernel-level auditing via `auditd`. In SELinux, security contexts follow the strict four-field format `user:role:type:level`. The `type` field is the cornerstone of Type Enforcement: for example, a web server process runs in the `httpd_t` domain, while web assets reside in the `httpd_sys_content_t` type. The SELinux kernel security server contains an access vector cache (AVC) that evaluates every single system interaction against the compiled policy: even if a developer inadvertently sets `/etc/shadow` permissions to world-readable (`chmod 777`), the kernel blocks `httpd_t` from reading `shadow_t` because no allow rule exists in the policy, logging an `avc: denied` event to `/var/log/audit/audit.log`.",
    "Similarly, the Linux Audit Subsystem (`auditd`) provides immutable tamper logging by hooking directly into kernel syscall entry and exit points. Using `auditctl`, administrators establish persistent rules such as `auditctl -w /etc/passwd -p wa -k identity_tampering`, which logs every write (`w`) or attribute change (`a`) to the user database with the exact process ID, executable path, parent process, and real user ID (`auid`). When integrated with File Integrity Monitoring (FIM), any discrepancy between the monitored file's cryptographic SHA-256 hash and the cryptographically signed golden baseline triggers an automated security incident response, isolating the compromised host from the network mesh in sub-second timeframes."
]

topup_p5 = [
    "Synthesizing these host defense pillars into enterprise operations requires aligning with established industry benchmarks, specifically the Center for Internet Security (CIS) Linux Benchmark and the DISA Security Technical Implementation Guides (STIGs). A fully hardened production Linux host implements comprehensive filesystem hardening: the `/tmp`, `/var/tmp`, and `/dev/shm` partitions must be mounted on dedicated partitions with `noexec`, `nosuid`, and `nodev` mount flags, preventing attackers from downloading and executing malicious binaries in world-writable directories. Additionally, kernel core dumps must be permanently disabled via `/etc/security/limits.conf` (`* hard core 0`) and sysctl (`fs.suid_dumpable=0`), preventing attackers from deliberately crashing privileged daemons to extract cryptographic keys or plaintext passwords from core dump memory files.",
    "Furthermore, network host hardening enforces kernel-level packet sanity checks via sysctl parameters: `net.ipv4.conf.all.rp_filter = 1` enforces strict reverse path filtering to block IP spoofing; `net.ipv4.conf.all.accept_redirects = 0` and `net.ipv4.conf.all.send_redirects = 0` reject ICMP redirect packets that could poison host routing tables; and `net.ipv4.tcp_syncookies = 1` mitigates TCP SYN flood denial-of-service attacks. When these kernel network protections operate alongside user namespaces, cgroups v2 limits, capability stripping, seccomp filters, and file integrity monitoring, the Linux host becomes a fortress capable of repelling sophisticated multi-stage advanced persistent threats across hybrid and multi-cloud environments."
]

# Read original create_cyber_day46_data.py
with open("scripts/create_cyber_day46_data.py", "r", encoding="utf-8") as f:
    text = f.read()

# Let's inspect create_cyber_day46_data.py structure
# We can import day46_data after appending topups
import re

# We will rewrite create_cyber_day46_data.py with topups included
new_text = text

# Let's see how say_p1 is defined and insert topup_p1 before the closing bracket
for i, topup in enumerate([topup_p1, topup_p2, topup_p3, topup_p4, topup_p5], 1):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    # find say_p{i} = [ ... ]
    # We match say_p{i} = [ up to ]\n
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    new_text = re.sub(pattern, rf'\1{topup_str}\2', new_text, count=1)

with open("scripts/create_cyber_day46_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated scripts/create_cyber_day46_data.py with topups!")
