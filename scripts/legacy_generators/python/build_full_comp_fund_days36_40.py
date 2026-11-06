import os

def build():
    snippets = {
        36: {
            1: """mkdir -p /home/student/workspace/ebpf_arch
echo "RUNTIME_ENGINE: IN_KERNEL_EBPF_SANDBOX_VM" > /home/student/workspace/ebpf_arch/verifier.cfg
echo "SAFETY_GATE: STATIC_DAG_VERIFIER_NO_UNBOUNDED_LOOPS" >> /home/student/workspace/ebpf_arch/verifier.cfg
echo "COMPILATION: JIT_NATIVE_X86_64_ARM64_MACHINE_CODE" >> /home/student/workspace/ebpf_arch/verifier.cfg
echo "HOOK_POINTS: KPROBES_UPROBES_TRACEPOINTS_XDP" >> /home/student/workspace/ebpf_arch/verifier.cfg
echo "STORAGE_STRUCTS: BPF_MAPS_HASH_ARRAY_RINGBUF" >> /home/student/workspace/ebpf_arch/verifier.cfg
cat /home/student/workspace/ebpf_arch/verifier.cfg""",
            2: """mkdir -p /home/student/workspace/ebpf_detective
echo "INCIDENT_SYMPTOM: RANDOM_250MS_DB_QUERY_MICRO_STALLS" > /home/student/workspace/ebpf_detective/trace.log
echo "LEGACY_PRINTF_FAILURE: 80_PCT_THROUGHPUT_DROP_DISK_FULL" >> /home/student/workspace/ebpf_detective/trace.log
echo "EBPF_HOOK: TRACEPOINT_BLOCK_BLOCK_RQ_COMPLETE" >> /home/student/workspace/ebpf_detective/trace.log
echo "ROOT_CAUSE_FOUND: RAID_BATTERY_CACHE_FLUSH_250MS_SPIKE" >> /home/student/workspace/ebpf_detective/trace.log
echo "EBPF_OVERHEAD: SUB_0_5_PCT_CPU_ZERO_DISK_IO" >> /home/student/workspace/ebpf_detective/trace.log
cat /home/student/workspace/ebpf_detective/trace.log""",
            3: """mkdir -p /home/student/workspace/ebpf_biolatency
echo "PROBE_ATTACH: KPROBE_BLK_MQ_START_AND_COMPLETE_REQUEST" > /home/student/workspace/ebpf_biolatency/histogram.txt
echo "BUCKET_128_TO_255_US: 48200_IO_OPERATIONS" >> /home/student/workspace/ebpf_biolatency/histogram.txt
echo "BUCKET_256_TO_511_US: 12400_IO_OPERATIONS" >> /home/student/workspace/ebpf_biolatency/histogram.txt
echo "BUCKET_128_TO_255_MS: 6_OUTLIER_CACHE_FLUSH_SPIKES" >> /home/student/workspace/ebpf_biolatency/histogram.txt
echo "HISTOGRAM_STATUS: IN_KERNEL_LOG2_MAP_AGGREGATION_VERIFIED" >> /home/student/workspace/ebpf_biolatency/histogram.txt
cat /home/student/workspace/ebpf_biolatency/histogram.txt""",
            4: """mkdir -p /home/student/workspace/ebpf_bench
echo "WORKLOAD_RATE: 100000_QPS_PRODUCTION_TRAFFIC" > /home/student/workspace/ebpf_bench/comparison.txt
echo "SYSLOG_PRINTF_MODE: 78_PCT_CPU_OVERHEAD_14200_DROPPED" >> /home/student/workspace/ebpf_bench/comparison.txt
echo "EBPF_KERNEL_MAP_MODE: 0_4_PCT_CPU_OVERHEAD_0_DROPPED" >> /home/student/workspace/ebpf_bench/comparison.txt
echo "OPENAT_TRACE: TRACEPOINT_SYSCALLS_SYS_ENTER_OPENAT_ACTIVE" >> /home/student/workspace/ebpf_bench/comparison.txt
echo "BENCHMARK_VERDICT: EBPF_IN_KERNEL_AGGREGATION_SUPERIOR" >> /home/student/workspace/ebpf_bench/comparison.txt
cat /home/student/workspace/ebpf_bench/comparison.txt""",
            5: """mkdir -p /home/student/workspace/ebpf_cert
echo "VERIFIER_AUDIT: BOUNDED_LOOPS_AND_VALID_PTRS_VERIFIED" > /home/student/workspace/ebpf_cert/day36_audit.txt
echo "JIT_AUDIT: NATIVE_MACHINE_INSTRUCTION_EMISSION_ACTIVE" >> /home/student/workspace/ebpf_cert/day36_audit.txt
echo "PROBE_AUDIT: KPROBES_UPROBES_TRACEPOINTS_NOMINAL" >> /home/student/workspace/ebpf_cert/day36_audit.txt
echo "MAP_AUDIT: ZERO_COPY_BPF_RINGBUF_TELEMETRY_VERIFIED" >> /home/student/workspace/ebpf_cert/day36_audit.txt
echo "DAY_36_CERTIFICATION: MODERN_LINUX_EBPF_TRACING_MASTERED" >> /home/student/workspace/ebpf_cert/day36_audit.txt
cat /home/student/workspace/ebpf_cert/day36_audit.txt"""
        },
        37: {
            1: """mkdir -p /home/student/workspace/use_red_arch
echo "HARDWARE_METHODOLOGY: BRENDAN_GREGG_USE_U_S_E" > /home/student/workspace/use_red_arch/methodology.cfg
echo "SERVICE_METHODOLOGY: MICROSERVICE_RED_RATE_ERRORS_DURATION" >> /home/student/workspace/use_red_arch/methodology.cfg
echo "RESOURCE_PILLARS: CPU_MEMORY_STORAGE_NETWORK_BUSES" >> /home/student/workspace/use_red_arch/methodology.cfg
echo "LINUX_60S_CHECKLIST: UPTIME_VMSTAT_MPSTAT_IOSTAT_SAR" >> /home/student/workspace/use_red_arch/methodology.cfg
echo "INVARIANT: ALL_3_USE_METRICS_MANDATORY_PER_RESOURCE" >> /home/student/workspace/use_red_arch/methodology.cfg
cat /home/student/workspace/use_red_arch/methodology.cfg""",
            2: """mkdir -p /home/student/workspace/use_detective
echo "RED_SYMPTOM: RATE_5000_RPS_ERR_0_1_PCT_P99_1200MS" > /home/student/workspace/use_detective/bottleneck.log
echo "CPU_AND_RAM_USE: CPU_U_30_PCT_S_0_MEM_U_40_PCT_S_0" >> /home/student/workspace/use_detective/bottleneck.log
echo "STORAGE_USE: DISK_U_15_PCT_AWAIT_S_0_ERRORS_0" >> /home/student/workspace/use_detective/bottleneck.log
echo "NETWORK_USE_ALERT: NIC_U_99_PCT_TX_DROPS_4000_PER_SEC" >> /home/student/workspace/use_detective/bottleneck.log
echo "ROOT_CAUSE_VERDICT: GIGABIT_NIC_TX_QUEUE_SATURATION" >> /home/student/workspace/use_detective/bottleneck.log
cat /home/student/workspace/use_detective/bottleneck.log""",
            3: """mkdir -p /home/student/workspace/use_scanner
echo "PROC_LOADAVG: 1M_24_50_5M_22_10_UNINTERRUPTIBLE_IO_WAIT" > /home/student/workspace/use_scanner/scan_report.txt
echo "VMSTAT_CPU_RUNQ: R_2_PROCS_B_18_BLOCKED_ON_DISK_IO" >> /home/student/workspace/use_scanner/scan_report.txt
echo "IOSTAT_NVME0N1: UTIL_99_8_PCT_AQU_SZ_34_2_SATURATED" >> /home/student/workspace/use_scanner/scan_report.txt
echo "MEM_PSI_PRESSURE: SOME_AVG10_0_00_FULL_AVG10_0_00" >> /home/student/workspace/use_scanner/scan_report.txt
echo "SCANNER_VERDICT: STORAGE_QUEUE_SATURATION_PINPOINTED" >> /home/student/workspace/use_scanner/scan_report.txt
cat /home/student/workspace/use_scanner/scan_report.txt""",
            4: """mkdir -p /home/student/workspace/multi_bottleneck_lab
echo "INJECTED_FAULT_1: STRESS_NG_HDD_QUEUE_DEPTH_64" > /home/student/workspace/multi_bottleneck_lab/stress_audit.txt
echo "INJECTED_FAULT_2: TC_QDISC_NETEM_TX_QUEUE_OVERFLOW" >> /home/student/workspace/multi_bottleneck_lab/stress_audit.txt
echo "DETECTION_TIME: 4_2_SECONDS_VIA_AUTOMATED_USE_SCAN" >> /home/student/workspace/multi_bottleneck_lab/stress_audit.txt
echo "FALSE_UPGRADE_AVOIDED: SAVED_USD_80000_UNNEEDED_CPU_BUY" >> /home/student/workspace/multi_bottleneck_lab/stress_audit.txt
echo "LAB_STATUS: MULTI_DIMENSIONAL_BOTTLENECKS_ISOLATED" >> /home/student/workspace/multi_bottleneck_lab/stress_audit.txt
cat /home/student/workspace/multi_bottleneck_lab/stress_audit.txt""",
            5: """mkdir -p /home/student/workspace/use_red_cert
echo "CPU_USE_AUDIT: UTILIZATION_RUNQ_AND_MCE_VERIFIED" > /home/student/workspace/use_red_cert/day37_audit.txt
echo "MEMORY_USE_AUDIT: CAPACITY_SWAP_PSI_OOM_VERIFIED" >> /home/student/workspace/use_red_cert/day37_audit.txt
echo "STORAGE_USE_AUDIT: IOSTAT_UTIL_AQU_SZ_ERR_VERIFIED" >> /home/student/workspace/use_red_cert/day37_audit.txt
echo "NETWORK_USE_AUDIT: BANDWIDTH_QDISC_DROPS_RETRANS_VERIFIED" >> /home/student/workspace/use_red_cert/day37_audit.txt
echo "DAY_37_CERTIFICATION: USE_AND_RED_CALCULUS_MASTERED" >> /home/student/workspace/use_red_cert/day37_audit.txt
cat /home/student/workspace/use_red_cert/day37_audit.txt"""
        },
        38: {
            1: """mkdir -p /home/student/workspace/perf_flame_arch
echo "SAMPLING_PROFILER: LINUX_PERF_RECORD_FREQ_99_HZ_NMI" > /home/student/workspace/perf_flame_arch/profiler.cfg
echo "WHY_99_HZ: PREVENTS_LOCKSTEP_ALIASING_WITH_100HZ_TIMERS" >> /home/student/workspace/perf_flame_arch/profiler.cfg
echo "FLAME_X_AXIS: ALPHABETICAL_SAMPLE_POPULATION_WIDTH_IS_TIME" >> /home/student/workspace/perf_flame_arch/profiler.cfg
echo "FLAME_Y_AXIS: CALL_STACK_DEPTH_PARENT_BELOW_CHILD_ABOVE" >> /home/student/workspace/perf_flame_arch/profiler.cfg
echo "PMU_COUNTERS: IPC_INSTRUCTIONS_PER_CYCLE_CACHE_BRANCH_MISS" >> /home/student/workspace/perf_flame_arch/profiler.cfg
cat /home/student/workspace/perf_flame_arch/profiler.cfg""",
            2: """mkdir -p /home/student/workspace/allocator_detective
echo "FLAME_GRAPH_HOT_TOWER: GLIBC_PTMALLOC_ARENA_LOCK_68_PCT" > /home/student/workspace/allocator_detective/flame_audit.log
echo "PMU_TELEMETRY: IPC_0_42_SEVERE_L3_CACHE_COHERENCE_STALL" >> /home/student/workspace/allocator_detective/flame_audit.log
echo "REMEDIATION_1: PRE_ALLOCATED_OBJECT_RING_BUFFER_POOLS" >> /home/student/workspace/allocator_detective/flame_audit.log
echo "REMEDIATION_2: LINK_JEMALLOC_THREAD_LOCAL_TCACHE_O1" >> /home/student/workspace/allocator_detective/flame_audit.log
echo "POST_FIX_RESULT: 60_PCT_CPU_SAVED_IPC_RESTORED_TO_2_4" >> /home/student/workspace/allocator_detective/flame_audit.log
cat /home/student/workspace/allocator_detective/flame_audit.log""",
            3: """mkdir -p /home/student/workspace/dual_flame_gen
echo "ON_CPU_CAPTURE: PERF_SCRIPT_STACKCOLLAPSE_PERF_PL" > /home/student/workspace/dual_flame_gen/profile_pipeline.log
echo "OFF_CPU_CAPTURE: EBPF_SCHED_SWITCH_OFFCPUTIME_STACKS" >> /home/student/workspace/dual_flame_gen/profile_pipeline.log
echo "OFF_CPU_DISCOVERY: 92_PCT_ELAPSED_TIME_IN_FUTEX_WAIT" >> /home/student/workspace/dual_flame_gen/profile_pipeline.log
echo "SVG_ARTIFACT: INTERACTIVE_ON_AND_OFF_CPU_FLAMEGRAPHS" >> /home/student/workspace/dual_flame_gen/profile_pipeline.log
echo "PROFILER_STATUS: DUAL_SPECTRUM_FLAME_PIPELINE_VERIFIED" >> /home/student/workspace/dual_flame_gen/profile_pipeline.log
cat /home/student/workspace/dual_flame_gen/profile_pipeline.log""",
            4: """mkdir -p /home/student/workspace/pmu_branch_lab
echo "UNSORTED_ARRAY_BRANCH_MISS: 18_4_PCT_PIPELINE_FLUSHES" > /home/student/workspace/pmu_branch_lab/perf_stat.txt
echo "UNSORTED_EXECUTION_TIME: 1420_MS_IPC_0_68" >> /home/student/workspace/pmu_branch_lab/perf_stat.txt
echo "SORTED_ARRAY_BRANCH_MISS: 0_1_PCT_BPU_PREDICTED" >> /home/student/workspace/pmu_branch_lab/perf_stat.txt
echo "SORTED_OR_BRANCHLESS_TIME: 235_MS_IPC_2_85_6X_FASTER" >> /home/student/workspace/pmu_branch_lab/perf_stat.txt
echo "PMU_VERDICT: HARDWARE_BRANCH_PREDICTION_DOMINATES_IPC" >> /home/student/workspace/pmu_branch_lab/perf_stat.txt
cat /home/student/workspace/pmu_branch_lab/perf_stat.txt""",
            5: """mkdir -p /home/student/workspace/profiling_cert
echo "PERF_SAMPLING_AUDIT: 99HZ_DWARF_FP_UNWINDING_VERIFIED" > /home/student/workspace/profiling_cert/day38_audit.txt
echo "ON_CPU_FLAME_AUDIT: HOT_PLATEAU_IDENTIFICATION_VERIFIED" >> /home/student/workspace/profiling_cert/day38_audit.txt
echo "OFF_CPU_FLAME_AUDIT: SCHED_SWITCH_BLOCK_TIME_VERIFIED" >> /home/student/workspace/profiling_cert/day38_audit.txt
echo "PMU_COUNTER_AUDIT: IPC_CACHE_AND_BRANCH_MISS_VERIFIED" >> /home/student/workspace/profiling_cert/day38_audit.txt
echo "DAY_38_CERTIFICATION: SYSTEMS_PROFILING_AND_FLAMES_MASTERED" >> /home/student/workspace/profiling_cert/day38_audit.txt
cat /home/student/workspace/profiling_cert/day38_audit.txt"""
        },
        39: {
            1: """mkdir -p /home/student/workspace/coredump_arch
echo "BINARY_FORMAT: ELF_ET_CORE_STATIC_PROCESS_SNAPSHOT" > /home/student/workspace/coredump_arch/elf_core.cfg
echo "KERNEL_LIMIT_GATE: RLIMIT_CORE_UNLIMITED_IN_SYSTEMD" >> /home/student/workspace/coredump_arch/elf_core.cfg
echo "KERNEL_ROUTE: PROC_SYS_KERNEL_CORE_PATTERN_SYSTEMD_COREDUMP" >> /home/student/workspace/coredump_arch/elf_core.cfg
echo "ELF_NOTES: NT_PRSTATUS_REGISTERS_AND_SIGINFO_FAULT" >> /home/student/workspace/coredump_arch/elf_core.cfg
echo "SYMBOL_FORMAT: DETACHED_DWARF_DEBUG_INFO_BUILD_ID_MATCH" >> /home/student/workspace/coredump_arch/elf_core.cfg
cat /home/student/workspace/coredump_arch/elf_core.cfg""",
            2: """mkdir -p /home/student/workspace/gdb_detective
echo "INITIAL_GDB_VIEW: HEX_0x0000555555555123_IN_QUESTION_MARKS" > /home/student/workspace/gdb_detective/postmortem.log
echo "DIAGNOSIS: STRIPPED_PRODUCTION_BINARY_NOT_CORRUPT_CORE" >> /home/student/workspace/gdb_detective/postmortem.log
echo "SYMBOL_LOAD_CMD: gdb_s_app_debug_e_app_c_core_1234" >> /home/student/workspace/gdb_detective/postmortem.log
echo "RESOLVED_FAULT: ORDER_ROUTER_CPP_LINE_412_NULL_PTR_RAX_0x0" >> /home/student/workspace/gdb_detective/postmortem.log
echo "REGISTER_STATE: RIP_0x555555555123_CR2_0x0000000000000018" >> /home/student/workspace/gdb_detective/postmortem.log
cat /home/student/workspace/gdb_detective/postmortem.log""",
            3: """mkdir -p /home/student/workspace/crash_triage_bot
echo "INGEST_EVENT: CORE_DUMP_SIGNAL_11_SIGSEGV_CAPTURED" > /home/student/workspace/crash_triage_bot/triage_report.txt
echo "GDB_BATCH_CMD: thread_apply_all_bt_full_and_info_reg" >> /home/student/workspace/crash_triage_bot/triage_report.txt
echo "FAULTING_THREAD: LWP_8842_WORKER_POOL_3_DEREF_OFFSET_0x18" >> /home/student/workspace/crash_triage_bot/triage_report.txt
echo "LOCAL_VARS: order_ptr_NULL_client_id_99402_qty_500" >> /home/student/workspace/crash_triage_bot/triage_report.txt
echo "TRIAGE_STATUS: AUTOMATED_RCA_REPORT_GENERATED_IN_1_8S" >> /home/student/workspace/crash_triage_bot/triage_report.txt
cat /home/student/workspace/crash_triage_bot/triage_report.txt""",
            4: """mkdir -p /home/student/workspace/stack_unwind_lab
echo "CORRUPTION_TYPE: STACK_BUFFER_OVERFLOW_SAVED_RBP_CLOBBERED" > /home/student/workspace/stack_unwind_lab/unwind.txt
echo "RAW_RSP_POINTER: 0x7fffffffe140_VALID_STACK_MEMORY" >> /home/student/workspace/stack_unwind_lab/unwind.txt
echo "DWARF_CFI_TABLE: EH_FRAME_UNWIND_WITHOUT_RBP_FRAME_PTR" >> /home/student/workspace/stack_unwind_lab/unwind.txt
echo "RECOVERED_CALLER: PARSE_WIRE_PACKET_AT_0x555555554890" >> /home/student/workspace/stack_unwind_lab/unwind.txt
echo "UNWIND_VERDICT: CALL_CHAIN_RECONSTRUCTED_AND_PATCHED" >> /home/student/workspace/stack_unwind_lab/unwind.txt
cat /home/student/workspace/stack_unwind_lab/unwind.txt""",
            5: """mkdir -p /home/student/workspace/coredump_cert
echo "ULIMIT_CORE_AUDIT: SYSTEMD_LIMITCORE_INFINITY_VERIFIED" > /home/student/workspace/coredump_cert/day39_audit.txt
echo "DWARF_ARCHIVE_AUDIT: BUILD_ID_DEBUGINFO_SERVER_SYNCED" >> /home/student/workspace/coredump_cert/day39_audit.txt
echo "GDB_AUTOMATION_AUDIT: THREAD_APPLY_ALL_BT_SCRIPT_ACTIVE" >> /home/student/workspace/coredump_cert/day39_audit.txt
echo "STORAGE_QUOTA_AUDIT: COREDUMP_MAX_USE_AND_ZSTD_ACTIVE" >> /home/student/workspace/coredump_cert/day39_audit.txt
echo "DAY_39_CERTIFICATION: CORE_DUMP_FORENSICS_MASTERED" >> /home/student/workspace/coredump_cert/day39_audit.txt
cat /home/student/workspace/coredump_cert/day39_audit.txt"""
        },
        40: {
            1: """mkdir -p /home/student/workspace/apextrace_spec
echo "PLATFORM_NAME: APEXTRACE_SOVEREIGN_OBSERVABILITY_ENGINE" > /home/student/workspace/apextrace_spec/architecture.cfg
echo "EBPF_DATAPLANE: BOUNDED_RINGBUF_AND_LRU_HASH_MAPS" >> /home/student/workspace/apextrace_spec/architecture.cfg
echo "METHODOLOGY_ENGINE: AUTOMATED_USE_AND_RED_CORRELATOR" >> /home/student/workspace/apextrace_spec/architecture.cfg
echo "PROFILING_ENGINE: CONTINUOUS_99HZ_ON_AND_OFF_CPU_FLAMES" >> /home/student/workspace/apextrace_spec/architecture.cfg
echo "NON_INTERFERENCE_SLA: SUB_1_PCT_CPU_ZERO_BLOCKING_DISK_IO" >> /home/student/workspace/apextrace_spec/architecture.cfg
cat /home/student/workspace/apextrace_spec/architecture.cfg""",
            2: """mkdir -p /home/student/workspace/bpf_oom_forensics
echo "INCIDENT: DDOS_10M_SPOOFED_IPS_EXHAUSTED_KERNEL_SLAB" > /home/student/workspace/bpf_oom_forensics/map_leak.log
echo "ROOT_CAUSE: UNBOUNDED_BPF_MAP_TYPE_HASH_WITHOUT_EVICTION" >> /home/student/workspace/bpf_oom_forensics/map_leak.log
echo "FIX_1: MIGRATE_TO_BPF_MAP_TYPE_LRU_HASH_FIXED_CAP" >> /home/student/workspace/bpf_oom_forensics/map_leak.log
echo "FIX_2: STREAM_EVENTS_VIA_BOUNDED_BPF_MAP_TYPE_RINGBUF" >> /home/student/workspace/bpf_oom_forensics/map_leak.log
echo "KERNEL_MEMORY_STATUS: ZERO_UNEVICTABLE_SLAB_GROWTH" >> /home/student/workspace/bpf_oom_forensics/map_leak.log
cat /home/student/workspace/bpf_oom_forensics/map_leak.log""",
            3: """mkdir -p /home/student/workspace/apextrace_pipeline
echo "MODULE_1_EBPF: BIO_AND_SOCKET_LATENCY_HISTOGRAMS_UP" > /home/student/workspace/apextrace_pipeline/runtime.log
echo "MODULE_2_USE_RED: 60S_HARDWARE_AND_SERVICE_MATRIX_UP" >> /home/student/workspace/apextrace_pipeline/runtime.log
echo "MODULE_3_FLAME: ON_AND_OFF_CPU_SVG_GENERATOR_UP" >> /home/student/workspace/apextrace_pipeline/runtime.log
echo "MODULE_4_COREDUMP: DEDUPLICATED_GDB_DWARF_TRIAGE_UP" >> /home/student/workspace/apextrace_pipeline/runtime.log
echo "PLATFORM_STATUS: APEXTRACE_UNIFIED_DAEMON_OPERATIONAL" >> /home/student/workspace/apextrace_pipeline/runtime.log
cat /home/student/workspace/apextrace_pipeline/runtime.log""",
            4: """mkdir -p /home/student/workspace/viva_chaos_lab
echo "CHAOS_1_OFF_CPU_LOCK: 500MS_STALL_AT_5_PCT_CPU_INJECTED" > /home/student/workspace/viva_chaos_lab/defense.txt
echo "APEXTRACE_PINPOINT: SCHED_SWITCH_FLAME_FOUND_DB_POOL_MUTEX" >> /home/student/workspace/viva_chaos_lab/defense.txt
echo "CHAOS_2_CRASH_STORM: 100_SIGSEGV_PER_SEC_LOOP_INJECTED" >> /home/student/workspace/viva_chaos_lab/defense.txt
echo "APEXTRACE_SHIELD: BUILD_ID_RATE_LIMIT_AND_ZSTD_CAP_HELD" >> /home/student/workspace/viva_chaos_lab/defense.txt
echo "TOTAL_MONITORING_OVERHEAD: 0_62_PCT_CPU_SLA_VERIFIED" >> /home/student/workspace/viva_chaos_lab/defense.txt
cat /home/student/workspace/viva_chaos_lab/defense.txt""",
            5: """mkdir -p /home/student/workspace/milestone_7_cert
echo "PILLAR_1_EBPF: VERIFIER_SAFE_KPROBES_AND_LRU_MAPS_VERIFIED" > /home/student/workspace/milestone_7_cert/day40_viva.txt
echo "PILLAR_2_USE_RED: HARDWARE_AND_SERVICE_CALCULUS_VERIFIED" >> /home/student/workspace/milestone_7_cert/day40_viva.txt
echo "PILLAR_3_FLAMES: 99HZ_PMU_ON_AND_OFF_CPU_GRAPHS_VERIFIED" >> /home/student/workspace/milestone_7_cert/day40_viva.txt
echo "PILLAR_4_FORENSICS: ELF_CORE_DWARF_GDB_TRIAGE_VERIFIED" >> /home/student/workspace/milestone_7_cert/day40_viva.txt
echo "MILESTONE_7_VERDICT: APEXTRACE_OBSERVABILITY_BOARD_APPROVED" >> /home/student/workspace/milestone_7_cert/day40_viva.txt
cat /home/student/workspace/milestone_7_cert/day40_viva.txt"""
        }
    }

    outputs = {}
    for day, parts in snippets.items():
        outputs[day] = {}
        for p, code in parts.items():
            lines = [l.strip() for l in code.strip().split('\n') if l.strip()]
            out_lines = []
            for l in lines:
                if l.startswith('echo "'):
                    text = l.split('echo "', 1)[1].rsplit('"', 1)[0]
                    out_lines.append(text)
            outputs[day][p] = "\n".join(out_lines)

    with open("scripts/comp_fund_days36_40_snippets.py", "w", encoding="utf-8") as f:
        f.write("SNIPPETS = " + repr(snippets) + "\n")
        f.write("OUTPUTS = " + repr(outputs) + "\n")
    print("Wrote scripts/comp_fund_days36_40_snippets.py successfully.")

if __name__ == "__main__":
    build()
