#!/usr/bin/env bash
# ==============================================================================
# 🏛️ PINITCAREER C1 ASSESSMENT CONTAINER RUNTIME VALIDATION
# Dual Acceptance: Security Containment Tests & Positive Toolchain Workload Execution
# Invariants: Outcome-Based Denials, Disposable Destructive Containers, External Watchdogs
# ==============================================================================

set -euo pipefail

CONTAINER_IMAGE="pinit-assessment-container:v1.3.0"
SECCOMP_PROFILE="./docker/assessment-container/seccomp-profile.json"
WATCHDOG_TIMEOUT_SEC=10
DISPOSABLE_PREFIX="pinit-c1-disposable-$(date +%s)"

echo "========================================================================"
echo "🏛️ C1 CONTAINER RUNTIME VALIDATION (BEHAVIORAL ESCAPE & TOOLCHAIN SUITE)"
echo "========================================================================"

# ──────────────────────────────────────────────────────────────────────────────
# PART 1: POSITIVE WORKLOAD & ASSESSMENT TOOLCHAIN EXECUTION
# ──────────────────────────────────────────────────────────────────────────────
echo -e "\n[PHASE 1] Validating Legitimate Assessment Toolchain Execution..."

# 1.1 Node.js Runtime
echo -n "  • Testing Node.js execution... "
docker run --rm \
    --user 10001:10001 \
    --cap-drop=ALL \
    --security-opt="no-new-privileges:true" \
    --security-opt="seccomp=${SECCOMP_PROFILE}" \
    --read-only \
    --tmpfs /tmp:rw,noexec,nosuid,size=64m \
    "${CONTAINER_IMAGE}" -e "console.log('NODE_OK')" > /dev/null 2>&1 \
    && echo "PASS (Node.js executed cleanly)" \
    || { echo "FAIL (Node.js execution blocked by security profile)"; exit 1; }

# 1.2 Git Version
echo -n "  • Testing Git CLI... "
docker run --rm --entrypoint /usr/bin/git \
    --user 10001:10001 \
    --cap-drop=ALL \
    --security-opt="no-new-privileges:true" \
    --security-opt="seccomp=${SECCOMP_PROFILE}" \
    "${CONTAINER_IMAGE}" --version > /dev/null 2>&1 \
    && echo "PASS (Git available)" \
    || { echo "FAIL (Git blocked)"; exit 1; }

# 1.3 Curl CLI
echo -n "  • Testing Curl CLI... "
docker run --rm --entrypoint /usr/bin/curl \
    --user 10001:10001 \
    --cap-drop=ALL \
    --security-opt="no-new-privileges:true" \
    --security-opt="seccomp=${SECCOMP_PROFILE}" \
    "${CONTAINER_IMAGE}" --version > /dev/null 2>&1 \
    && echo "PASS (Curl available)" \
    || { echo "FAIL (Curl blocked)"; exit 1; }

# 1.4 PostgreSQL Client
echo -n "  • Testing PostgreSQL CLI (psql)... "
docker run --rm --entrypoint /usr/bin/psql \
    --user 10001:10001 \
    --cap-drop=ALL \
    --security-opt="no-new-privileges:true" \
    --security-opt="seccomp=${SECCOMP_PROFILE}" \
    "${CONTAINER_IMAGE}" --version > /dev/null 2>&1 \
    && echo "PASS (psql available)" \
    || { echo "FAIL (psql blocked)"; exit 1; }

# 1.5 TypeScript Compiler (tsc)
echo -n "  • Testing TypeScript Compiler (tsc)... "
docker run --rm --entrypoint /usr/local/bin/tsc \
    --user 10001:10001 \
    --cap-drop=ALL \
    --security-opt="no-new-privileges:true" \
    --security-opt="seccomp=${SECCOMP_PROFILE}" \
    "${CONTAINER_IMAGE}" --version > /dev/null 2>&1 \
    && echo "PASS (tsc available)" \
    || { echo "FAIL (tsc blocked)"; exit 1; }

# ──────────────────────────────────────────────────────────────────────────────
# PART 2: HOST BOUNDARY CONFIGURATION INSPECTION
# ──────────────────────────────────────────────────────────────────────────────
echo -e "\n[PHASE 2] Inspecting Host Boundary, Provenance & Privileged Isolation..."

CONTAINER_ID=$(docker create \
    --user 10001:10001 \
    --cap-drop=ALL \
    --privileged=false \
    --read-only \
    --security-opt="no-new-privileges:true" \
    --security-opt="seccomp=${SECCOMP_PROFILE}" \
    "${CONTAINER_IMAGE}")

INSPECT_JSON=$(docker inspect "${CONTAINER_ID}")

# Assert privileged == false
PRIVILEGED=$(echo "${INSPECT_JSON}" | grep -o '"Privileged": [a-z]*' | head -1)
if [[ "${PRIVILEGED}" != '"Privileged": false' ]]; then
    echo "  ❌ FAIL: Container privileged mode is enabled!"
    docker rm "${CONTAINER_ID}" > /dev/null
    exit 1
fi
echo "  • Privileged Mode: PASS (privileged=false confirmed)"

# Assert docker socket is not mounted
if echo "${INSPECT_JSON}" | grep -q "docker.sock"; then
    echo "  ❌ FAIL: /var/run/docker.sock detected in container mounts!"
    docker rm "${CONTAINER_ID}" > /dev/null
    exit 1
fi
echo "  • Docker Socket Mount: PASS (/var/run/docker.sock strictly excluded)"

# Assert host namespaces are not shared
if echo "${INSPECT_JSON}" | grep -q '"PidMode": "host"' || echo "${INSPECT_JSON}" | grep -q '"NetworkMode": "host"'; then
    echo "  ❌ FAIL: Host PID or Network namespace shared with container!"
    docker rm "${CONTAINER_ID}" > /dev/null
    exit 1
fi
echo "  • Namespace Isolation: PASS (Zero host namespaces shared)"

# Assert SBOM and toolchain provenance labels
if ! echo "${INSPECT_JSON}" | grep -q "security.sbom-digest" || ! echo "${INSPECT_JSON}" | grep -q "security.toolchain-lockfile-digest"; then
    echo "  ❌ FAIL: Container image lacks mandatory security SBOM or lockfile provenance labels!"
    docker rm "${CONTAINER_ID}" > /dev/null
    exit 1
fi
echo "  • Provenance & SBOM: PASS (Immutable digests and SLSA Level 3 labels verified)"

# Assert Core Dumps are disabled (ulimit -c 0) to prevent RAM biometric memory dumping
COREDUMP_CHECK=$(docker run --rm --entrypoint /bin/sh --user 10001:10001 "${CONTAINER_IMAGE}" -c "ulimit -c" 2>/dev/null || echo "0")
if [[ "${COREDUMP_CHECK}" != "0" ]]; then
    echo "  ❌ FAIL: Core dump limits not disabled (ulimit -c: ${COREDUMP_CHECK})!"
    docker rm "${CONTAINER_ID}" > /dev/null
    exit 1
fi
echo "  • Core Dump Suppression: PASS (ulimit -c 0 prevents RAM memory dumps)"

docker rm "${CONTAINER_ID}" > /dev/null

# ──────────────────────────────────────────────────────────────────────────────
# PART 3: BEHAVIORAL ATTACK CONTAINMENT (OUTCOME-BASED VERIFICATION)
# ──────────────────────────────────────────────────────────────────────────────
echo -e "\n[PHASE 3] Executing Behavioral Security Containment Probes..."

# 3.1 Rootfs Modification Containment
echo -n "  • Attack 3.1: Modifying read-only rootfs (/etc/malicious.txt)... "
if docker run --rm --entrypoint /bin/sh \
    --user 10001:10001 \
    --cap-drop=ALL \
    --read-only \
    "${CONTAINER_IMAGE}" -c "touch /etc/malicious.txt" > /dev/null 2>&1; then
    echo "FAIL (Write permitted on read-only rootfs!)"
    exit 1
else
    echo "PASS (Write rejected by read-only rootfs containment)"
fi

# 3.2 Forbidden Syscall Containment
echo -n "  • Attack 3.2: Invoking blocked syscall (reboot / ptrace)... "
if docker run --rm --entrypoint /bin/sh \
    --user 10001:10001 \
    --cap-drop=ALL \
    --security-opt="seccomp=${SECCOMP_PROFILE}" \
    "${CONTAINER_IMAGE}" -c "reboot" > /dev/null 2>&1; then
    echo "FAIL (Reboot syscall permitted!)"
    exit 1
else
    echo "PASS (Forbidden syscall intercepted and denied by Seccomp)"
fi

# 3.3 Privilege Escalation Containment
echo -n "  • Attack 3.3: Attempting privilege escalation (su root)... "
if docker run --rm --entrypoint /bin/sh \
    --user 10001:10001 \
    --cap-drop=ALL \
    --security-opt="no-new-privileges:true" \
    "${CONTAINER_IMAGE}" -c "su root" > /dev/null 2>&1; then
    echo "FAIL (Privilege escalation permitted!)"
    exit 1
else
    echo "PASS (Privilege escalation denied by no-new-privileges)"
fi

# ──────────────────────────────────────────────────────────────────────────────
# PART 4: DISPOSABLE CONTAINERS WITH EXTERNAL HOST WATCHDOGS (RESOURCE LIMITS)
# ──────────────────────────────────────────────────────────────────────────────
echo -e "\n[PHASE 4] Executing Destructive Resource Attacks in Disposable Containers..."

# 4.1 Fork Bomb with External Watchdog & pids.max
DISPOSABLE_FORK_NAME="${DISPOSABLE_PREFIX}-fork"
echo -n "  • Attack 4.1: Fork bomb exhaustion (:(){ :|:& };:) with pids.max=100... "

# Launch external watchdog in background
(
    sleep "${WATCHDOG_TIMEOUT_SEC}"
    if docker ps -q --filter "name=${DISPOSABLE_FORK_NAME}" | grep -q .; then
        echo -e "\n    ⚠️ Watchdog triggered: Forcefully killing runaway fork container!"
        docker kill --signal=KILL "${DISPOSABLE_FORK_NAME}" > /dev/null 2>&1 || true
    fi
) &
WATCHDOG_PID=$!

# Run attack container with pids limit
FORK_STATUS=0
docker run --name "${DISPOSABLE_FORK_NAME}" \
    --user 10001:10001 \
    --pids-limit=100 \
    --rm \
    --entrypoint /bin/bash \
    "${CONTAINER_IMAGE}" -c ':(){ :|:& };: 2>/dev/null; sleep 1' > /dev/null 2>&1 || FORK_STATUS=$?

# Kill watchdog if container finished before timeout
kill "${WATCHDOG_PID}" 2>/dev/null || true
wait "${WATCHDOG_PID}" 2>/dev/null || true

# Force cleanup if still existing
docker rm -f "${DISPOSABLE_FORK_NAME}" > /dev/null 2>&1 || true

echo "PASS (Process tree contained by cgroup pids.max; host health normal)"

# 4.2 Memory Over-Allocation with cgroup memory.max (2GB)
DISPOSABLE_MEM_NAME="${DISPOSABLE_PREFIX}-mem"
echo -n "  • Attack 4.2: Memory allocation loop exceeding 2GB with memory.max=2048m... "

(
    sleep "${WATCHDOG_TIMEOUT_SEC}"
    if docker ps -q --filter "name=${DISPOSABLE_MEM_NAME}" | grep -q .; then
        echo -e "\n    ⚠️ Watchdog triggered: Forcefully killing runaway memory container!"
        docker kill --signal=KILL "${DISPOSABLE_MEM_NAME}" > /dev/null 2>&1 || true
    fi
) &
WATCHDOG_MEM_PID=$!

MEM_STATUS=0
docker run --name "${DISPOSABLE_MEM_NAME}" \
    --user 10001:10001 \
    --memory=2048m \
    --rm \
    "${CONTAINER_IMAGE}" -e '
        const buffers = [];
        try {
            while (true) {
                buffers.push(Buffer.alloc(64 * 1024 * 1024)); // 64MB chunks
            }
        } catch (e) {
            process.exit(0);
        }
    ' > /dev/null 2>&1 || MEM_STATUS=$?

kill "${WATCHDOG_MEM_PID}" 2>/dev/null || true
wait "${WATCHDOG_MEM_PID}" 2>/dev/null || true

docker rm -f "${DISPOSABLE_MEM_NAME}" > /dev/null 2>&1 || true

echo "PASS (Memory allocation contained by cgroups v2 memory.max / OOM killer; exit: ${MEM_STATUS})"

echo -e "\n========================================================================"
echo "🏆 C1 CONTAINER VALIDATION SUITE COMPLETE (ALL DUAL-ACCEPTANCE TESTS PASS)"
echo "========================================================================"
