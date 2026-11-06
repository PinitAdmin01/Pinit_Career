import json
import re

topup_p2 = [
    "To fully understand the difference between Alpine and Distroless, engineers must examine the underlying C runtime library and package architecture. Alpine Linux is built upon `musl libc` and uses the `apk` package manager. While Alpine images are remarkably small (often around five megabytes), `musl libc` introduces subtle binary compatibility issues with standard glibc-compiled Node.js native addons or Python C-extensions, and Alpine still includes `/bin/sh`. In contrast, Distroless images retain standard `glibc` (built from Debian stable) while completely omitting the package manager, shell, and coreutils. This guarantees full glibc binary compatibility for complex enterprise applications without introducing the vulnerabilities associated with shell binaries or package management utilities.",
    "Furthermore, multi-stage builds enable automated security scanning at the boundary between compilation and packaging. In high-assurance CI/CD pipelines, security gates inspect the intermediate builder stage for build-time secrets (such as stray `.npmrc` authentication tokens, private SSH keys used for git cloning, or internal API tokens). By leveraging Docker's BuildKit secret mounting (`RUN --mount=type=secret,id=npmrc`), secrets are mounted into memory only during the single `npm install` execution step and are never written to any intermediate or final image layer on disk. This completely neutralizes secret leakage via container image layer inspection (`docker history`)."
]

topup_p3 = [
    "Delving deeper into container storage security, engineers must analyze the operational differences between bind mounts, named volumes, and tmpfs storage. A bind mount connects a host directory directly into a container (`-v /var/log:/var/log`). If misconfigured with write permissions, an escaped process can overwrite host logs, modify host crontabs (`/etc/cron.d`), or access host SSH authorized keys. Therefore, if a bind mount is unavoidable, it must be mounted with the `:ro` (read-only) attribute. For container-local state, named volumes managed by the container runtime are preferred over direct host paths because the runtime isolates the volume within a protected storage directory with restricted filesystem permissions.",
    "Crucially, securing in-memory `tmpfs` mounts requires configuring explicit resource quotas alongside security flags. A `tmpfs` mount without a `size` limit dynamically allocates pages from the host kernel's virtual memory subsystem. A rogue or compromised process could execute a memory-exhaustion denial-of-service attack by repeatedly writing gigabytes of garbage data to `/tmp`, starving host processes and triggering the kernel out-of-memory killer. By enforcing `--tmpfs /tmp:rw,noexec,nosuid,nodev,size=64m`, the maximum memory consumption of the writable scratch directory is strictly bounded, preventing host resource starvation while preserving application functionality."
]

topup_p4 = [
    "To establish an effective enterprise vulnerability management lifecycle, organizations must understand the structure of a Software Bill of Materials (SBOM) and the mechanics of vulnerability scanners. An SBOM generated in CycloneDX or SPDX format includes detailed component metadata: package name, ecosystem (e.g., `pkg:deb/debian/openssl`, `pkg:npm/express`), exact version, license identifiers (e.g., MIT, Apache-2.0), and cryptographic package hashes. Scanners like Trivy and Grype parse this structured inventory and match package coordinate strings against Common Platform Enumeration (CPE) records and vulnerability data feeds.",
    "Importantly, modern DevSecOps pipelines do not treat all CVEs equally. Relying solely on raw CVSS scores creates severe alert fatigue, as development teams are overwhelmed by hundreds of theoretical vulnerabilities that cannot be executed in the application's runtime context. By incorporating EPSS (Exploit Prediction Scoring System) and Reachability Analysis, security teams distinguish between passive library vulnerabilities and actively weaponized threats. Reachability analysis traces application call graphs to determine whether vulnerable functions inside a library are actually invoked by application code. If a vulnerable function is never imported or called, the real-world risk is substantially lower, enabling security engineers to focus immediate emergency remediation on reachable, high-EPSS vulnerabilities."
]

topup_p5 = [
    "Synthesizing container hardening into continuous compliance requires integrating container image signing and admission enforcement. In cloud-native production environments, verifying that a container image passed security checks at build time is insufficient; the runtime cluster must cryptographically verify that the deployed image was not modified or replaced in the registry before deployment. Enterprise platforms implement Sigstore and Cosign: upon successfully passing the five-checkpoint security gate in CI/CD, the build system signs the OCI image digest using an automated cryptographic signing key, creating a verifiable attestation stored directly in the container registry alongside the image.",
    "At deployment time, cluster admission controllers (such as Kyverno or Open Policy Agent Gatekeeper) intercept every pod creation request, verifying the cryptographic Cosign signature, validating the SBOM attestation, and asserting that the pod's securityContext strictly specifies non-root execution and a read-only root filesystem. Any pod attempting to deploy an unsigned image, an image containing unmitigated critical CVEs, or a container requesting root privileges is rejected at the API server boundary before scheduling. This creates an end-to-end cryptographic chain of custody from source code commit to production container execution."
]

with open("scripts/create_cyber_day47_data.py", "r", encoding="utf-8") as f:
    text = f.read()

# Apply topups to say_p2, say_p3, say_p4, say_p5
new_text = text
for i, topup in enumerate([topup_p2, topup_p3, topup_p4, topup_p5], 2):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    new_text = re.sub(pattern, rf'\1{topup_str}\2', new_text, count=1)

with open("scripts/create_cyber_day47_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated create_cyber_day47_data.py with topups!")
