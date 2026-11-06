import json

SNIPPETS = {
    51: {
        1: """mkdir -p /home/student/workspace/knight_autopsy_arch
echo "INCIDENT_DATE: AUGUST_1_2012_KNIGHT_CAPITAL_440M_LOSS" > /home/student/workspace/knight_autopsy_arch/postmortem.cfg
echo "ROOT_CAUSE_1: MANUAL_UNSCRIPTED_DEPLOYMENT_MISSED_SERVER_8" >> /home/student/workspace/knight_autopsy_arch/postmortem.cfg
echo "ROOT_CAUSE_2: REPURPOSED_FLAG_ACTIVATED_8YR_DEAD_POWER_PEG" >> /home/student/workspace/knight_autopsy_arch/postmortem.cfg
echo "ROOT_CAUSE_3: ZERO_AUTOMATED_FINANCIAL_KILL_SWITCH_CIRCUIT" >> /home/student/workspace/knight_autopsy_arch/postmortem.cfg
echo "INVARIANT: ATOMIC_CLUSTER_DEPLOY_AND_DEAD_CODE_ELIMINATION" >> /home/student/workspace/knight_autopsy_arch/postmortem.cfg
cat /home/student/workspace/knight_autopsy_arch/postmortem.cfg""",
        2: """mkdir -p /home/student/workspace/partial_deploy_forensics
echo "CLUSTER_SIZE: 8_PRODUCTION_SMARS_ORDER_ROUTING_SERVERS" > /home/student/workspace/partial_deploy_forensics/mismatch.log
echo "NODES_1_TO_7_HASH: SHA256_NEW_RLP_ENGINE_9A8F2C1E" >> /home/student/workspace/partial_deploy_forensics/mismatch.log
echo "NODE_8_ROGUE_HASH: SHA256_LEGACY_POWER_PEG_4D1B7E00" >> /home/student/workspace/partial_deploy_forensics/mismatch.log
echo "ANOMALY_VOLUME: 4000000_ERRONEOUS_ORDERS_IN_45_MINUTES" >> /home/student/workspace/partial_deploy_forensics/mismatch.log
echo "ARCHITECT_RULING: VETO_FLAG_REUSE_MANDATE_ATOMIC_HASH_GATE" >> /home/student/workspace/partial_deploy_forensics/mismatch.log
cat /home/student/workspace/partial_deploy_forensics/mismatch.log""",
        3: """mkdir -p /home/student/workspace/deploy_hash_gate
echo "PREFLIGHT_SCAN: QUERYING_ALL_8_PRODUCTION_CLUSTER_NODES" > /home/student/workspace/deploy_hash_gate/gate_audit.log
echo "BINARY_ATTESTATION: 8_OF_8_NODES_MATCH_SHA256_9A8F2C1E" >> /home/student/workspace/deploy_hash_gate/gate_audit.log
echo "SCHEMA_VALIDATION: ZERO_DEPRECATED_ZOMBIE_FLAGS_PRESENT" >> /home/student/workspace/deploy_hash_gate/gate_audit.log
echo "ROLLBACK_TRIGGER: ARMED_FOR_ANY_SINGLE_NODE_HASH_DRIFT" >> /home/student/workspace/deploy_hash_gate/gate_audit.log
echo "GATE_VERDICT: ATOMIC_DEPLOYMENT_PARITY_100_PCT_VERIFIED" >> /home/student/workspace/deploy_hash_gate/gate_audit.log
cat /home/student/workspace/deploy_hash_gate/gate_audit.log""",
        4: """mkdir -p /home/student/workspace/kill_switch_lab
echo "CIRCUIT_BREAKER_CFG: MAX_LOSS_USD_500000_PER_60_SECONDS" > /home/student/workspace/kill_switch_lab/breaker.txt
echo "SIMULATED_FAULT: RUNAWAY_INFINITE_BUY_HIGH_SELL_LOW_LOOP" >> /home/student/workspace/kill_switch_lab/breaker.txt
echo "DETECTION_LATENCY: THRESHOLD_BREACHED_AT_6_4_MILLISECONDS" >> /home/student/workspace/kill_switch_lab/breaker.txt
echo "KILL_ACTION: HARDWARE_TCP_FIN_RST_ORDER_GATEWAY_SEVERED" >> /home/student/workspace/kill_switch_lab/breaker.txt
echo "LAB_VERDICT: TRADING_HALTED_IN_6_4MS_SAVING_USD_439500000" >> /home/student/workspace/kill_switch_lab/breaker.txt
cat /home/student/workspace/kill_switch_lab/breaker.txt""",
        5: """mkdir -p /home/student/workspace/knight_cert
echo "DEAD_CODE_AUDIT: ZERO_DORMANT_TEST_PATHS_IN_PROD_BINARY" > /home/student/workspace/knight_cert/day51_audit.txt
echo "FLAG_HYGIENE_AUDIT: IMMUTABLE_MONOTONIC_FEATURE_FLAGS_ONLY" >> /home/student/workspace/knight_cert/day51_audit.txt
echo "ATOMIC_DEPLOY_AUDIT: SHA256_FLEET_ATTESTATION_ENFORCED" >> /home/student/workspace/knight_cert/day51_audit.txt
echo "CIRCUIT_BREAKER_AUDIT: SUB_10MS_CAPITAL_KILL_SWITCH_ACTIVE" >> /home/student/workspace/knight_cert/day51_audit.txt
echo "DAY_51_CERTIFICATION: KNIGHT_CAPITAL_FORENSICS_MASTERED" >> /home/student/workspace/knight_cert/day51_audit.txt
cat /home/student/workspace/knight_cert/day51_audit.txt"""
    },
    52: {
        1: """mkdir -p /home/student/workspace/crowdstrike_autopsy
echo "INCIDENT_DATE: JULY_19_2024_8_5_MILLION_WINDOWS_BSOD" > /home/student/workspace/crowdstrike_autopsy/ring0_spec.cfg
echo "PRIVILEGE_LEVEL: CPU_RING_0_KERNEL_DRIVER_CSAGENT_SYS" >> /home/student/workspace/crowdstrike_autopsy/ring0_spec.cfg
echo "TRIGGER_PAYLOAD: CHANNEL_FILE_291_DYNAMIC_RULE_UPDATE" >> /home/student/workspace/crowdstrike_autopsy/ring0_spec.cfg
echo "KERNEL_EXCEPTION: PAGE_FAULT_IN_NONPAGED_AREA_OFFSET_0X9C" >> /home/student/workspace/crowdstrike_autopsy/ring0_spec.cfg
echo "INVARIANT: RING_0_FAULTS_CRASH_ENTIRE_OS_WITH_ZERO_SAFETY_NET" >> /home/student/workspace/crowdstrike_autopsy/ring0_spec.cfg
cat /home/student/workspace/crowdstrike_autopsy/ring0_spec.cfg""",
        2: """mkdir -p /home/student/workspace/bsod_dump_forensics
echo "EXPECTED_ARRAY_BOUNDS: 20_PARAMETER_FIELDS_IN_IPC_TEMPLATE" > /home/student/workspace/bsod_dump_forensics/crash_dump.log
echo "ACTUAL_TEMPLATE_ACCESS: INDEX_21_OUT_OF_BOUNDS_READ_ATTEMPT" >> /home/student/workspace/bsod_dump_forensics/crash_dump.log
echo "INVALID_MEMORY_ADDR: NULL_POINTER_PLUS_0X0000009C_DEREFERENCE" >> /home/student/workspace/bsod_dump_forensics/crash_dump.log
echo "DELIVERY_VIOLATION: SIMULTANEOUS_GLOBAL_PUSH_BYPASSED_CANARIES" >> /home/student/workspace/bsod_dump_forensics/crash_dump.log
echo "RECOVERY_CHALLENGE: BITLOCKER_SAFE_MODE_MANUAL_FILE_DELETION" >> /home/student/workspace/bsod_dump_forensics/crash_dump.log
cat /home/student/workspace/bsod_dump_forensics/crash_dump.log""",
        3: """mkdir -p /home/student/workspace/safe_kernel_parser
echo "PARSER_STEP_1: CRYPTOGRAPHIC_SIGNATURE_AND_MAGIC_HEADER_CHECK" > /home/student/workspace/safe_kernel_parser/bounds_guard.log
echo "PARSER_STEP_2: STRICT_FIELD_COUNT_BOUNDS_CHECK_21_GT_20_REJECT" >> /home/student/workspace/safe_kernel_parser/bounds_guard.log
echo "PARSER_STEP_3: NON_NULL_POINTER_RANGE_VALIDATION_BEFORE_READ" >> /home/student/workspace/safe_kernel_parser/bounds_guard.log
echo "FALLBACK_ACTION: GRACEFUL_ERROR_RETURN_RETAIN_LAST_KNOWN_GOOD" >> /home/student/workspace/safe_kernel_parser/bounds_guard.log
echo "PARSER_STATUS: ZERO_RING_0_PAGE_FAULTS_ON_MALFORMED_INPUT" >> /home/student/workspace/safe_kernel_parser/bounds_guard.log
cat /home/student/workspace/safe_kernel_parser/bounds_guard.log""",
        4: """mkdir -p /home/student/workspace/canary_rollout_lab
echo "FLEET_POPULATION: 500000_ENTERPRISE_ENDPOINT_MACHINES" > /home/student/workspace/canary_rollout_lab/progressive.txt
echo "STAGE_0_SANDBOX: USER_SPACE_FUZZER_AND_VM_BOOT_VERIFICATION" >> /home/student/workspace/canary_rollout_lab/progressive.txt
echo "STAGE_1_CANARY: 0_1_PCT_COHORT_DETECTED_CRASH_WITHIN_30_SEC" >> /home/student/workspace/canary_rollout_lab/progressive.txt
echo "AUTO_HALT_GATE: ROLLOUT_ABORTED_AND_CHANNEL_FILE_REVERTED" >> /home/student/workspace/canary_rollout_lab/progressive.txt
echo "LAB_VERDICT: 99_9_PCT_OF_FLEET_PROTECTED_ZERO_GLOBAL_OUTAGE" >> /home/student/workspace/canary_rollout_lab/progressive.txt
cat /home/student/workspace/canary_rollout_lab/progressive.txt""",
        5: """mkdir -p /home/student/workspace/crowdstrike_cert
echo "RING_0_BOUNDS_AUDIT: DEFENSIVE_ARRAY_AND_NULL_CHECKS_VERIFIED" > /home/student/workspace/crowdstrike_cert/day52_audit.txt
echo "USERSPACE_SANDBOX_AUDIT: PRE_DEPLOY_FUZZING_GATE_ACTIVE" >> /home/student/workspace/crowdstrike_cert/day52_audit.txt
echo "STAGED_CANARY_AUDIT: 0_1_TO_1_TO_10_TO_100_PCT_RINGS_ENFORCED" >> /home/student/workspace/crowdstrike_cert/day52_audit.txt
echo "BOOT_FALLBACK_AUDIT: AUTO_REVERT_ON_EARLY_BOOT_CRASH_VERIFIED" >> /home/student/workspace/crowdstrike_cert/day52_audit.txt
echo "DAY_52_CERTIFICATION: KERNEL_DRIVER_SAFETY_AND_CANARIES_MASTERED" >> /home/student/workspace/crowdstrike_cert/day52_audit.txt
cat /home/student/workspace/crowdstrike_cert/day52_audit.txt"""
    },
    53: {
        1: """mkdir -p /home/student/workspace/redos_automata_arch
echo "OUTAGE_DATE: JULY_2_2019_CLOUDFLARE_82_PCT_TRAFFIC_DROP" > /home/student/workspace/redos_automata_arch/automata_spec.cfg
echo "VULNERABLE_ENGINE: BACKTRACKING_NFA_PCRE_EXPONENTIAL_O_2_N" >> /home/student/workspace/redos_automata_arch/automata_spec.cfg
echo "RESILIENT_ENGINE: THOMPSON_DFA_GOOGLE_RE2_RUST_REGEX_O_N" >> /home/student/workspace/redos_automata_arch/automata_spec.cfg
echo "TOXIC_PATTERN: NESTED_OR_ADJACENT_GREEDY_QUANTIFIERS" >> /home/student/workspace/redos_automata_arch/automata_spec.cfg
echo "INVARIANT: UNTRUSTED_INPUT_MATCHING_MUST_BE_STRICTLY_LINEAR_O_N" >> /home/student/workspace/redos_automata_arch/automata_spec.cfg
cat /home/student/workspace/redos_automata_arch/automata_spec.cfg""",
        2: """mkdir -p /home/student/workspace/cloudflare_waf_forensics
echo "DEPLOYED_WAF_RULE: GREEDY_ADJACENT_WILDCARDS_BEFORE_EQUALS" > /home/student/workspace/cloudflare_waf_forensics/waf_trace.log
echo "TRIGGER_REQUEST: HTTP_HEADER_WITH_LONG_STRING_MISSING_EQUALS" >> /home/student/workspace/cloudflare_waf_forensics/waf_trace.log
echo "BACKTRACK_EXPLOSION: MILLIONS_OF_NFA_STATE_PERMUTATIONS_TRIED" >> /home/student/workspace/cloudflare_waf_forensics/waf_trace.log
echo "GLOBAL_IMPACT: 100_PCT_CPU_SATURATION_ACROSS_194_EDGE_CITIES" >> /home/student/workspace/cloudflare_waf_forensics/waf_trace.log
echo "ARCHITECTURAL_FIX: MIGRATE_WAF_ENGINE_FROM_PCRE_TO_RUST_DFA" >> /home/student/workspace/cloudflare_waf_forensics/waf_trace.log
cat /home/student/workspace/cloudflare_waf_forensics/waf_trace.log""",
        3: """mkdir -p /home/student/workspace/re2_linear_engine
echo "STATIC_AST_SCAN: FLAGGED_NESTED_QUANTIFIER_GROUP_PLUS_PLUS" > /home/student/workspace/re2_linear_engine/benchmark.log
echo "ADVERSARIAL_INPUT: 30_REPEATED_CHARS_WITH_NON_MATCHING_TAIL" >> /home/student/workspace/re2_linear_engine/benchmark.log
echo "NFA_PCRE_LATENCY: OVER_10000_MS_EXPONENTIAL_2_POW_30_HANG" >> /home/student/workspace/re2_linear_engine/benchmark.log
echo "DFA_RE2_LATENCY: 0_004_MS_SINGLE_PASS_30_STEP_EXECUTION" >> /home/student/workspace/re2_linear_engine/benchmark.log
echo "ENGINE_STATUS: LINEAR_TIME_O_N_GUARANTEE_MATHEMATICALLY_PROVEN" >> /home/student/workspace/re2_linear_engine/benchmark.log
cat /home/student/workspace/re2_linear_engine/benchmark.log""",
        4: """mkdir -p /home/student/workspace/redos_gateway_lab
echo "ATTACK_VECTOR: 1000_CONCURRENT_REDOS_API_REQUESTS_PER_SEC" > /home/student/workspace/redos_gateway_lab/gateway_defense.txt
echo "LEGACY_PCRE_GATEWAY: CPU_100_PCT_HTTP_504_GATEWAY_TIMEOUT" >> /home/student/workspace/redos_gateway_lab/gateway_defense.txt
echo "RE2_DFA_GATEWAY: CPU_4_PCT_P99_LATENCY_0_8_MILLISECONDS" >> /home/student/workspace/redos_gateway_lab/gateway_defense.txt
echo "CI_CD_LINTER_GATE: BLOCKED_3_BACKTRACKING_REGEX_PR_COMMITS" >> /home/student/workspace/redos_gateway_lab/gateway_defense.txt
echo "LAB_VERDICT: ZERO_CPU_STARVATION_UNDER_ADVERSARIAL_PAYLOADS" >> /home/student/workspace/redos_gateway_lab/gateway_defense.txt
cat /home/student/workspace/redos_gateway_lab/gateway_defense.txt""",
        5: """mkdir -p /home/student/workspace/redos_cert
echo "NFA_VS_DFA_AUDIT: THOMPSON_SIMULATION_O_N_COMPLEXITY_VERIFIED" > /home/student/workspace/redos_cert/day53_audit.txt
echo "WAF_OUTAGE_AUDIT: GREEDY_QUANTIFIER_BACKTRACKING_ELIMINATED" >> /home/student/workspace/redos_cert/day53_audit.txt
echo "RE2_ENGINE_AUDIT: ZERO_BACKTRACKING_DFA_RUNTIME_ENFORCED" >> /home/student/workspace/redos_cert/day53_audit.txt
echo "CI_REGEX_GATE_AUDIT: AUTOMATED_REDOS_STATIC_ANALYSIS_ACTIVE" >> /home/student/workspace/redos_cert/day53_audit.txt
echo "DAY_53_CERTIFICATION: REDOS_AND_LINEAR_AUTOMATA_MASTERED" >> /home/student/workspace/redos_cert/day53_audit.txt
cat /home/student/workspace/redos_cert/day53_audit.txt"""
    },
    54: {
        1: """mkdir -p /home/student/workspace/os_convergence_arch
echo "LINUX_KERNEL: MONOLITHIC_RING_0_WITH_DYNAMIC_LKM_AND_IO_URING" > /home/student/workspace/os_convergence_arch/kernels.cfg
echo "WINDOWS_NT_KERNEL: HYBRID_EXECUTIVE_OBJECT_MANAGER_IRP_AND_IOCP" >> /home/student/workspace/os_convergence_arch/kernels.cfg
echo "MACOS_DARWIN_XNU: HYBRID_MACH_MICROKERNEL_IPC_PLUS_BSD_POSIX" >> /home/student/workspace/os_convergence_arch/kernels.cfg
echo "ASYNC_IO_TRIAD: LINUX_IO_URING_WINDOWS_IOCP_MACOS_KQUEUE" >> /home/student/workspace/os_convergence_arch/kernels.cfg
echo "INVARIANT: NATIVE_KERNEL_PRIMITIVES_OUTPERFORM_POSIX_EMULATION" >> /home/student/workspace/os_convergence_arch/kernels.cfg
cat /home/student/workspace/os_convergence_arch/kernels.cfg""",
        2: """mkdir -p /home/student/workspace/nt_irp_forensics
echo "INCIDENT_1: WINDOWS_ANTIVIRUS_FILTER_IRP_NO_MORE_STACK_BSOD" > /home/student/workspace/nt_irp_forensics/nt_audit.log
echo "INCIDENT_2: CYGWIN_POSIX_EMULATION_DB_COLLAPSED_TO_8000_IOPS" >> /home/student/workspace/nt_irp_forensics/nt_audit.log
echo "EMULATION_BOTTLENECK: FORK_COPY_AND_PIPE_TRANSLATION_OVERHEAD" >> /home/student/workspace/nt_irp_forensics/nt_audit.log
echo "NATIVE_NT_FIX: REARCHITECT_WITH_CREATE_IO_COMPLETION_PORT_IOCP" >> /home/student/workspace/nt_irp_forensics/nt_audit.log
echo "PERFORMANCE_RESTORED: 100000_IOPS_PARITY_WITH_LINUX_IO_URING" >> /home/student/workspace/nt_irp_forensics/nt_audit.log
cat /home/student/workspace/nt_irp_forensics/nt_audit.log""",
        3: """mkdir -p /home/student/workspace/cross_platform_io
echo "LINUX_BACKEND: IO_URING_SUBMISSION_AND_COMPLETION_RING_BUFFERS" > /home/student/workspace/cross_platform_io/event_loop.log
echo "WINDOWS_BACKEND: WIN32_IOCP_OVERLAPPED_IRP_THREAD_POOL" >> /home/student/workspace/cross_platform_io/event_loop.log
echo "MACOS_BACKEND: XNU_KQUEUE_KEVENT_KERNEL_EVENT_NOTIFICATION" >> /home/student/workspace/cross_platform_io/event_loop.log
echo "ZERO_COPY_PARITY: SUB_50_MICROSECOND_P99_ACROSS_ALL_3_OS_TARGETS" >> /home/student/workspace/cross_platform_io/event_loop.log
echo "ABSTRACTION_STATUS: UNIFIED_NATIVE_ASYNC_IO_ENGINE_VERIFIED" >> /home/student/workspace/cross_platform_io/event_loop.log
cat /home/student/workspace/cross_platform_io/event_loop.log""",
        4: """mkdir -p /home/student/workspace/os_syscall_bench
echo "LINUX_CLONE_FORK: COW_PAGE_TABLE_CLONE_42_MICROSECONDS" > /home/student/workspace/os_syscall_bench/bench_matrix.txt
echo "WINDOWS_CREATE_PROCESS: EXECUTIVE_SECTION_AND_CSRSS_950_MICROSECONDS" >> /home/student/workspace/os_syscall_bench/bench_matrix.txt
echo "WINDOWS_NATIVE_THREAD: CREATE_THREAD_POOL_WORK_18_MICROSECONDS" >> /home/student/workspace/os_syscall_bench/bench_matrix.txt
echo "XNU_MACH_MSG_IPC: PORT_RIGHTS_MESSAGE_PASSING_VERIFIED" >> /home/student/workspace/os_syscall_bench/bench_matrix.txt
echo "BENCHMARK_VERDICT: USE_PROCESS_POOLS_ON_LINUX_THREAD_IOCP_ON_NT" >> /home/student/workspace/os_syscall_bench/bench_matrix.txt
cat /home/student/workspace/os_syscall_bench/bench_matrix.txt""",
        5: """mkdir -p /home/student/workspace/os_convergence_cert
echo "LINUX_MONOLITHIC_AUDIT: LKM_AND_IO_URING_RINGS_VERIFIED" > /home/student/workspace/os_convergence_cert/day54_audit.txt
echo "WINDOWS_NT_AUDIT: OBJECT_MANAGER_IRP_STACK_AND_IOCP_VERIFIED" >> /home/student/workspace/os_convergence_cert/day54_audit.txt
echo "MACOS_XNU_AUDIT: MACH_IPC_PORTS_AND_BSD_KQUEUE_VERIFIED" >> /home/student/workspace/os_convergence_cert/day54_audit.txt
echo "CROSS_PLATFORM_AUDIT: 100K_IOPS_NATIVE_PARITY_VERIFIED" >> /home/student/workspace/os_convergence_cert/day54_audit.txt
echo "DAY_54_CERTIFICATION: MULTI_OS_KERNEL_INTERNALS_MASTERED" >> /home/student/workspace/os_convergence_cert/day54_audit.txt
cat /home/student/workspace/os_convergence_cert/day54_audit.txt"""
    },
    55: {
        1: """mkdir -p /home/student/workspace/dist_os_microvm_arch
echo "DISTRIBUTED_OS: KUBERNETES_DATACENTER_ABSTRACTION_PLANE" > /home/student/workspace/dist_os_microvm_arch/cloud_os.cfg
echo "KERNEL_MAPPING: ETCD_VFS_SCHEDULER_CFS_CNI_NET_CSI_BLOCK" >> /home/student/workspace/dist_os_microvm_arch/cloud_os.cfg
echo "MICROVM_ENGINE: AWS_FIRECRACKER_KVM_5MS_BOOT_5MB_RAM" >> /home/student/workspace/dist_os_microvm_arch/cloud_os.cfg
echo "UNIKERNEL_MODEL: SINGLE_ADDRESS_SPACE_RING_0_LIBRARY_OS" >> /home/student/workspace/dist_os_microvm_arch/cloud_os.cfg
echo "INVARIANT: MINIMAL_KERNEL_CODE_MAXIMIZES_SECURITY_AND_DENSITY" >> /home/student/workspace/dist_os_microvm_arch/cloud_os.cfg
cat /home/student/workspace/dist_os_microvm_arch/cloud_os.cfg""",
        2: """mkdir -p /home/student/workspace/cold_start_forensics
echo "OUTAGE_EVENT: FLASH_SALE_90_PCT_SERVERLESS_CHECKOUT_TIMEOUT" > /home/student/workspace/cold_start_forensics/boot_trace.log
echo "LEGACY_VM_PENALTY: 45_SEC_BOOT_BIOS_ACPI_PCI_SYSTEMD_DAEMONS" >> /home/student/workspace/cold_start_forensics/boot_trace.log
echo "SHARED_CONTAINER_RISK: MULTI_TENANT_HOST_KERNEL_CVE_BREAKOUT" >> /home/student/workspace/cold_start_forensics/boot_trace.log
echo "FIRECRACKER_FIX: STRIP_LEGACY_DEVICES_VIRTIO_NET_BLOCK_ONLY" >> /home/student/workspace/cold_start_forensics/boot_trace.log
echo "COLD_START_RESULT: 5_MILLISECOND_KVM_BOOT_WITH_HARDWARE_ISOLATION" >> /home/student/workspace/cold_start_forensics/boot_trace.log
cat /home/student/workspace/cold_start_forensics/boot_trace.log""",
        3: """mkdir -p /home/student/workspace/firecracker_runner
echo "API_SOCKET_INIT: PUT_BOOT_SOURCE_VMLINUX_STRIPPED_KERNEL" > /home/student/workspace/firecracker_runner/microvm.log
echo "ROOTFS_ATTACH: PUT_DRIVES_READONLY_SQUASHFS_ROOT_IMAGE" >> /home/student/workspace/firecracker_runner/microvm.log
echo "MACHINE_CFG: 1_VCPU_128MB_RAM_VIRTIO_VSOCK_ENABLED" >> /home/student/workspace/firecracker_runner/microvm.log
echo "INSTANCE_START: KVM_VMENTRY_TO_USERSPACE_READY_IN_4_8_MS" >> /home/student/workspace/firecracker_runner/microvm.log
echo "RUNNER_STATUS: HARDWARE_ISOLATED_MICROVM_EXECUTION_VERIFIED" >> /home/student/workspace/firecracker_runner/microvm.log
cat /home/student/workspace/firecracker_runner/microvm.log""",
        4: """mkdir -p /home/student/workspace/density_bench_lab
echo "WORKLOAD_SCALE: 500_CONCURRENT_UNTRUSTED_TENANT_FUNCTIONS" > /home/student/workspace/density_bench_lab/density.txt
echo "TRADITIONAL_QEMU_VM: 500GB_RAM_REQUIRED_OOM_AT_64_INSTANCES" >> /home/student/workspace/density_bench_lab/density.txt
echo "FIRECRACKER_MICROVM: 2_5GB_OVERHEAD_ALL_500_BOOTED_IN_1_9_SEC" >> /home/student/workspace/density_bench_lab/density.txt
echo "ISOLATION_AUDIT: INTEL_VT_X_EPT_SEPARATE_GUEST_KERNELS_VERIFIED" >> /home/student/workspace/density_bench_lab/density.txt
echo "LAB_VERDICT: 200X_DENSITY_GAIN_WITH_ZERO_SHARED_KERNEL_SURFACE" >> /home/student/workspace/density_bench_lab/density.txt
cat /home/student/workspace/density_bench_lab/density.txt""",
        5: """mkdir -p /home/student/workspace/cloud_os_cert
echo "KUBERNETES_OS_AUDIT: ETCD_SCHEDULER_CNI_CSI_MAPPING_VERIFIED" > /home/student/workspace/cloud_os_cert/day55_audit.txt
echo "FIRECRACKER_AUDIT: 5MS_BOOT_5MB_OVERHEAD_KVM_ISOLATION_VERIFIED" >> /home/student/workspace/cloud_os_cert/day55_audit.txt
echo "UNIKERNEL_AUDIT: SINGLE_ADDRESS_SPACE_ZERO_SYSCALL_RING_SWITCH" >> /home/student/workspace/cloud_os_cert/day55_audit.txt
echo "MULTI_TENANT_AUDIT: 500_MICROVM_DENSITY_BENCHMARK_PASSED" >> /home/student/workspace/cloud_os_cert/day55_audit.txt
echo "DAY_55_CERTIFICATION: DISTRIBUTED_OS_AND_MICROVMS_MASTERED" >> /home/student/workspace/cloud_os_cert/day55_audit.txt
cat /home/student/workspace/cloud_os_cert/day55_audit.txt"""
    }
}

OUTPUTS = {}
for d, parts in SNIPPETS.items():
    OUTPUTS[d] = {}
    for p, cmd in parts.items():
        lines = []
        for line in cmd.splitlines():
            if line.startswith('echo "'):
                val = line.split('echo "', 1)[1].rsplit('"', 1)[0]
                lines.append(val)
        OUTPUTS[d][p] = "\n".join(lines)

with open("scripts/comp_fund_days51_55_snippets.py", "w", encoding="utf-8") as f:
    f.write(f"SNIPPETS = {repr(SNIPPETS)}\n")
    f.write(f"OUTPUTS = {repr(OUTPUTS)}\n")

print("Wrote scripts/comp_fund_days51_55_snippets.py successfully!")
