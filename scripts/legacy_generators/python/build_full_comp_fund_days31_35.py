import os

def build():
    snippets = {
        31: {
            1: """mkdir -p /home/student/workspace/hypervisor_arch
echo "HYPERVISOR_TYPE_1: BARE_METAL_KVM_ESXI_XEN" > /home/student/workspace/hypervisor_arch/vt_x.cfg
echo "CPU_VIRT_EXT: INTEL_VT_X_VMX_ROOT_AND_NON_ROOT" >> /home/student/workspace/hypervisor_arch/vt_x.cfg
echo "VMCS_CONTROL: GUEST_STATE_AND_HOST_STATE_AREA" >> /home/student/workspace/hypervisor_arch/vt_x.cfg
echo "SENSITIVE_INST_TRAP: VM_EXIT_TO_HYPERVISOR_DISPATCH" >> /home/student/workspace/hypervisor_arch/vt_x.cfg
echo "SLAT_EPT_NPT: HARDWARE_2D_PAGE_TABLE_WALK_ENABLED" >> /home/student/workspace/hypervisor_arch/vt_x.cfg
cat /home/student/workspace/hypervisor_arch/vt_x.cfg""",
            2: """mkdir -p /home/student/workspace/vm_exit_forensics
echo "TRACE_SOURCE: KVM_STAT_HYPERVISOR_TELEMETRY" > /home/student/workspace/vm_exit_forensics/storm.log
echo "ANOMALY_EVENT: IO_INSTRUCTION_VM_EXIT_400000_PER_SEC" >> /home/student/workspace/vm_exit_forensics/storm.log
echo "CYCLE_PENALTY: 2000_CYCLES_PER_VM_EXIT_TRANSITION" >> /home/student/workspace/vm_exit_forensics/storm.log
echo "ROOT_CAUSE: UNBUFFERED_LEGACY_PIO_POLLING_LOOP" >> /home/student/workspace/vm_exit_forensics/storm.log
echo "REMEDIATION: MIGRATE_TO_VIRTIO_RING_BUFFER_PARAVIRT" >> /home/student/workspace/vm_exit_forensics/storm.log
cat /home/student/workspace/vm_exit_forensics/storm.log""",
            3: """mkdir -p /home/student/workspace/kvm_micro_vmm
echo "DEVICE_NODE: /dev/kvm_IOCTL_INTERFACE" > /home/student/workspace/kvm_micro_vmm/vmm_init.log
echo "STEP_1: KVM_CREATE_VM_AND_SET_USER_MEMORY_REGION" >> /home/student/workspace/kvm_micro_vmm/vmm_init.log
echo "STEP_2: KVM_CREATE_VCPU_AND_INIT_SREG_REGISTERS" >> /home/student/workspace/kvm_micro_vmm/vmm_init.log
echo "STEP_3: KVM_RUN_LOOP_HANDLING_KVM_EXIT_IO" >> /home/student/workspace/kvm_micro_vmm/vmm_init.log
echo "VMM_STATUS: GUEST_REAL_MODE_EXECUTION_VERIFIED" >> /home/student/workspace/kvm_micro_vmm/vmm_init.log
cat /home/student/workspace/kvm_micro_vmm/vmm_init.log""",
            4: """mkdir -p /home/student/workspace/ept_slat_lab
echo "SHADOW_PAGE_TABLE_MODE: 300_PCT_QUERY_LATENCY_PENALTY" > /home/student/workspace/ept_slat_lab/paging_bench.txt
echo "SHADOW_PAGE_VM_EXITS: 185000_PAGE_FAULT_INTERCEPTS" >> /home/student/workspace/ept_slat_lab/paging_bench.txt
echo "HARDWARE_EPT_MODE: SILICON_2D_GVA_TO_GPA_TO_HPA_WALK" >> /home/student/workspace/ept_slat_lab/paging_bench.txt
echo "EPT_VM_EXITS: ZERO_PAGE_TABLE_SYNC_TRAPS" >> /home/student/workspace/ept_slat_lab/paging_bench.txt
echo "BENCHMARK_VERDICT: HARDWARE_SLAT_EPT_MANDATORY_IN_BIOS" >> /home/student/workspace/ept_slat_lab/paging_bench.txt
cat /home/student/workspace/ept_slat_lab/paging_bench.txt""",
            5: """mkdir -p /home/student/workspace/virt_cert
echo "VERIFY_CPU_FLAGS: grep_E_vmx_svm_proc_cpuinfo_PASSED" > /home/student/workspace/virt_cert/day31_audit.txt
echo "VERIFY_HYPERVISOR: KVM_KERNEL_MODULE_LOADED" >> /home/student/workspace/virt_cert/day31_audit.txt
echo "VERIFY_SLAT_EPT: EXTENDED_PAGE_TABLES_ACTIVE" >> /home/student/workspace/virt_cert/day31_audit.txt
echo "VERIFY_IO_PATH: VIRTIO_SHARED_MEMORY_RINGS_ACTIVE" >> /home/student/workspace/virt_cert/day31_audit.txt
echo "DAY_31_CERTIFICATION: HARDWARE_VIRTUALIZATION_MASTERED" >> /home/student/workspace/virt_cert/day31_audit.txt
cat /home/student/workspace/virt_cert/day31_audit.txt"""
        },
        32: {
            1: """mkdir -p /home/student/workspace/ns_cgroups_arch
echo "ISOLATION_NAMESPACES: PID_MNT_NET_IPC_UTS_USER" > /home/student/workspace/ns_cgroups_arch/kernel_spec.cfg
echo "SYSCALL_PRIMITIVES: CLONE_UNSHARE_SETNS" >> /home/student/workspace/ns_cgroups_arch/kernel_spec.cfg
echo "CGROUPS_V2_HIERARCHY: UNIFIED_SINGLE_ROOT_TREE" >> /home/student/workspace/ns_cgroups_arch/kernel_spec.cfg
echo "RESOURCE_CONTROLLERS: CPU_MAX_MEMORY_MAX_IO_MAX" >> /home/student/workspace/ns_cgroups_arch/kernel_spec.cfg
echo "INVARIANT: VIEW_IS_NAMESPACE_USAGE_IS_CGROUP_QUOTA" >> /home/student/workspace/ns_cgroups_arch/kernel_spec.cfg
cat /home/student/workspace/ns_cgroups_arch/kernel_spec.cfg""",
            2: """mkdir -p /home/student/workspace/oom_forensics
echo "INCIDENT: NOISY_NEIGHBOR_HOST_RAM_EXHAUSTION_64GB" > /home/student/workspace/oom_forensics/dmesg_oom.log
echo "VICTIM_PROCESS: HOST_PAYMENT_GATEWAY_TERMINATED" >> /home/student/workspace/oom_forensics/dmesg_oom.log
echo "ROOT_CAUSE: CONTAINER_LAUNCHED_WITHOUT_MEMORY_MAX" >> /home/student/workspace/oom_forensics/dmesg_oom.log
echo "ENFORCEMENT_FIX: CGROUP_MEMORY_MAX_536870912_BYTES" >> /home/student/workspace/oom_forensics/dmesg_oom.log
echo "ISOLATION_VERIFIED: LEAKING_CONTAINER_OOM_CONTAINED" >> /home/student/workspace/oom_forensics/dmesg_oom.log
cat /home/student/workspace/oom_forensics/dmesg_oom.log""",
            3: """mkdir -p /home/student/workspace/raw_container_runtime
echo "EXEC_CMD: unshare_pid_net_mount_uts_ipc_fork" > /home/student/workspace/raw_container_runtime/runner.log
echo "PID_MAPPING: CONTAINER_PID_1_MAPS_TO_HOST_PID_48291" >> /home/student/workspace/raw_container_runtime/runner.log
echo "ROOTFS_JAIL: PIVOT_ROOT_TO_ISOLATED_BUNDLE_DIR" >> /home/student/workspace/raw_container_runtime/runner.log
echo "USER_NS_MAP: CONTAINER_UID_0_MAPS_TO_HOST_UID_10001" >> /home/student/workspace/raw_container_runtime/runner.log
echo "RUNTIME_STATUS: ZERO_DOCKER_PURE_KERNEL_CONTAINER_UP" >> /home/student/workspace/raw_container_runtime/runner.log
cat /home/student/workspace/raw_container_runtime/runner.log""",
            4: """mkdir -p /home/student/workspace/cfs_throttle_lab
echo "HOST_HARDWARE: 64_PHYSICAL_CPU_CORES_DETECTED" > /home/student/workspace/cfs_throttle_lab/cpu_stat.txt
echo "CGROUP_CPU_MAX: 200000_QUOTA_PER_100000_PERIOD_2_CORES" >> /home/student/workspace/cfs_throttle_lab/cpu_stat.txt
echo "LEGACY_JVM_BUG: 64_THREADS_SPAWNED_FROM_PROC_CPUINFO" >> /home/student/workspace/cfs_throttle_lab/cpu_stat.txt
echo "CFS_THROTTLE_PENALTY: NR_THROTTLED_4210_PERIODS" >> /home/student/workspace/cfs_throttle_lab/cpu_stat.txt
echo "REMEDIATION: CGROUP_V2_AWARE_RUNTIME_2_ACTIVE_THREADS" >> /home/student/workspace/cfs_throttle_lab/cpu_stat.txt
cat /home/student/workspace/cfs_throttle_lab/cpu_stat.txt""",
            5: """mkdir -p /home/student/workspace/container_internals_cert
echo "NAMESPACE_AUDIT: ALL_6_KERNEL_NAMESPACES_ISOLATED" > /home/student/workspace/container_internals_cert/day32_audit.txt
echo "CGROUP_V2_AUDIT: UNIFIED_CONTROLLERS_ENFORCED" >> /home/student/workspace/container_internals_cert/day32_audit.txt
echo "OOM_PROTECTION: MEMORY_MAX_AND_SWAP_MAX_LOCKED" >> /home/student/workspace/container_internals_cert/day32_audit.txt
echo "CPU_QUOTA_AUDIT: CFS_BANDWIDTH_THROTTLING_OPTIMIZED" >> /home/student/workspace/container_internals_cert/day32_audit.txt
echo "DAY_32_CERTIFICATION: LINUX_CONTAINER_INTERNALS_MASTERED" >> /home/student/workspace/container_internals_cert/day32_audit.txt
cat /home/student/workspace/container_internals_cert/day32_audit.txt"""
        },
        33: {
            1: """mkdir -p /home/student/workspace/overlayfs_arch
echo "MOUNT_TYPE: LINUX_KERNEL_OVERLAYFS_UNION_MOUNT" > /home/student/workspace/overlayfs_arch/mount_spec.cfg
echo "LOWERDIR_LAYERS: IMMUTABLE_READ_ONLY_SHARED_BASE_IMAGES" >> /home/student/workspace/overlayfs_arch/mount_spec.cfg
echo "UPPERDIR_LAYER: EPHEMERAL_WRITABLE_CONTAINER_DIFF_LAYER" >> /home/student/workspace/overlayfs_arch/mount_spec.cfg
echo "WHITEOUT_MECHANISM: CHAR_DEVICE_0_0_MASKING_DELETED_FILES" >> /home/student/workspace/overlayfs_arch/mount_spec.cfg
echo "OCI_RUNTIME_FLOW: CONTAINERD_TO_SHIM_TO_RUNC_EXEC" >> /home/student/workspace/overlayfs_arch/mount_spec.cfg
cat /home/student/workspace/overlayfs_arch/mount_spec.cfg""",
            2: """mkdir -p /home/student/workspace/layer_bloat_forensics
echo "ANTI_PATTERN: SEPARATE_RUN_INSTALL_AND_RUN_CLEAN_LAYERS" > /home/student/workspace/layer_bloat_forensics/manifest_audit.log
echo "LAYER_1_PAYLOAD: 300MB_APT_CACHE_PERMANENTLY_BAKED" >> /home/student/workspace/layer_bloat_forensics/manifest_audit.log
echo "LAYER_2_PAYLOAD: WHITEOUT_FILES_ONLY_ZERO_SPACE_SAVED" >> /home/student/workspace/layer_bloat_forensics/manifest_audit.log
echo "COW_STALL_HAZARD: 10GB_CHMOD_TRIGGERS_FULL_COPY_UP" >> /home/student/workspace/layer_bloat_forensics/manifest_audit.log
echo "REMEDIATION: ATOMIC_SINGLE_RUN_INSTALL_AND_CLEANUP" >> /home/student/workspace/layer_bloat_forensics/manifest_audit.log
cat /home/student/workspace/layer_bloat_forensics/manifest_audit.log""",
            3: """mkdir -p /home/student/workspace/overlay_orchestrator
echo "LOWER_FILE: BASE_CONFIG_V1_IMMUTABLE_IN_LOWERDIR" > /home/student/workspace/overlay_orchestrator/cow_trace.log
echo "MOUNT_SYSCALL: OVERLAY_MERGED_VIEW_INITIALIZED" >> /home/student/workspace/overlay_orchestrator/cow_trace.log
echo "WRITE_INTERCEPT: MODIFY_CONFIG_TRIGGERS_KERNEL_COPY_UP" >> /home/student/workspace/overlay_orchestrator/cow_trace.log
echo "UPPER_FILE: MODIFIED_CONFIG_V2_ISOLATED_IN_UPPERDIR" >> /home/student/workspace/overlay_orchestrator/cow_trace.log
echo "VERIFICATION: LOWERDIR_ORIGINAL_REMAINS_UNTOUCHED" >> /home/student/workspace/overlay_orchestrator/cow_trace.log
cat /home/student/workspace/overlay_orchestrator/cow_trace.log""",
            4: """mkdir -p /home/student/workspace/layer_sharing_lab
echo "CONCURRENT_CONTAINERS: 100_REPLICAS_INSTANTIATED_IN_50MS" > /home/student/workspace/layer_sharing_lab/density_bench.txt
echo "BASE_IMAGE_SIZE: 500MB_SHARED_SINGLE_INODE_PAGE_CACHE" >> /home/student/workspace/layer_sharing_lab/density_bench.txt
echo "TOTAL_LOWERDIR_DISK: 500MB_INSTEAD_OF_50GB_DUPLICATION" >> /home/student/workspace/layer_sharing_lab/density_bench.txt
echo "AGGREGATE_UPPERDIR_DIFF: 12MB_ACROSS_ALL_100_CONTAINERS" >> /home/student/workspace/layer_sharing_lab/density_bench.txt
echo "EFFICIENCY_VERDICT: 99_PCT_STORAGE_AND_RAM_CACHE_SAVINGS" >> /home/student/workspace/layer_sharing_lab/density_bench.txt
cat /home/student/workspace/layer_sharing_lab/density_bench.txt""",
            5: """mkdir -p /home/student/workspace/oci_storage_cert
echo "OVERLAYFS_AUDIT: LOWER_UPPER_WORK_MERGED_VERIFIED" > /home/student/workspace/oci_storage_cert/day33_audit.txt
echo "IMMUTABILITY_AUDIT: CONTENT_ADDRESSABLE_SHA256_DIGESTS" >> /home/student/workspace/oci_storage_cert/day33_audit.txt
echo "COW_HYGIENE_AUDIT: NO_LARGE_FILE_CHMOD_COPY_UP_STALLS" >> /home/student/workspace/oci_storage_cert/day33_audit.txt
echo "OCI_SPEC_AUDIT: CONFIG_JSON_AND_ROOTFS_BUNDLE_COMPLIANT" >> /home/student/workspace/oci_storage_cert/day33_audit.txt
echo "DAY_33_CERTIFICATION: UNION_FILESYSTEMS_AND_OCI_MASTERED" >> /home/student/workspace/oci_storage_cert/day33_audit.txt
cat /home/student/workspace/oci_storage_cert/day33_audit.txt"""
        },
        34: {
            1: """mkdir -p /home/student/workspace/cni_net_arch
echo "NET_ISOLATION: DEDICATED_NETWORK_NAMESPACE_PER_POD" > /home/student/workspace/cni_net_arch/topology.cfg
echo "VIRTUAL_WIRE: VETH_PAIR_CONTAINER_ETH0_TO_HOST_BR0" >> /home/student/workspace/cni_net_arch/topology.cfg
echo "LAYER_2_SWITCH: LINUX_SOFTWARE_BRIDGE_MAC_LEARNING" >> /home/student/workspace/cni_net_arch/topology.cfg
echo "OUTBOUND_ROUTING: IPTABLES_POSTROUTING_SNAT_MASQUERADE" >> /home/student/workspace/cni_net_arch/topology.cfg
echo "INBOUND_PORT_MAP: IPTABLES_PREROUTING_DNAT_FORWARDING" >> /home/student/workspace/cni_net_arch/topology.cfg
cat /home/student/workspace/cni_net_arch/topology.cfg""",
            2: """mkdir -p /home/student/workspace/nat_exhaustion_forensics
echo "OUTAGE_SYMPTOM: OUTBOUND_TCP_SYN_DROPPED_ACROSS_HOST" > /home/student/workspace/nat_exhaustion_forensics/conntrack.log
echo "CONNTRACK_METRIC: 65535_EPHEMERAL_PORTS_IN_TIME_WAIT" >> /home/student/workspace/nat_exhaustion_forensics/conntrack.log
echo "ROOT_CAUSE: UNPOOLED_DB_CONNECTIONS_VIA_SNAT_MASQUERADE" >> /home/student/workspace/nat_exhaustion_forensics/conntrack.log
echo "REMEDIATION_1: PERSISTENT_CONNECTION_POOLING_ENABLED" >> /home/student/workspace/nat_exhaustion_forensics/conntrack.log
echo "REMEDIATION_2: MULTI_IP_SNAT_POOL_AND_TW_REUSE_TUNED" >> /home/student/workspace/nat_exhaustion_forensics/conntrack.log
cat /home/student/workspace/nat_exhaustion_forensics/conntrack.log""",
            3: """mkdir -p /home/student/workspace/veth_bridge_builder
echo "STEP_1: ip_link_add_br_pinit0_type_bridge_up" > /home/student/workspace/veth_bridge_builder/net_setup.log
echo "STEP_2: ip_netns_add_ns_app1_and_ns_app2" >> /home/student/workspace/veth_bridge_builder/net_setup.log
echo "STEP_3: ip_link_add_veth_app1_peer_name_veth_host1" >> /home/student/workspace/veth_bridge_builder/net_setup.log
echo "STEP_4: ASSIGN_172_18_0_2_AND_172_18_0_3_CIDR_24" >> /home/student/workspace/veth_bridge_builder/net_setup.log
echo "PING_VERIFICATION: 0_PACKET_LOSS_ACROSS_VIRTUAL_BRIDGE" >> /home/student/workspace/veth_bridge_builder/net_setup.log
cat /home/student/workspace/veth_bridge_builder/net_setup.log""",
            4: """mkdir -p /home/student/workspace/net_mode_bench
echo "HOST_NETWORK_MODE: 42_GBPS_THROUGHPUT_12_US_LATENCY" > /home/student/workspace/net_mode_bench/iperf3_results.txt
echo "MACVLAN_DIRECT_MODE: 39_GBPS_THROUGHPUT_15_US_LATENCY" >> /home/student/workspace/net_mode_bench/iperf3_results.txt
echo "BRIDGE_NAT_MODE: 24_GBPS_THROUGHPUT_48_US_LATENCY" >> /home/student/workspace/net_mode_bench/iperf3_results.txt
echo "EBPF_CILIUM_ROUTING: 38_GBPS_BYPASSING_IPTABLES_CHAINS" >> /home/student/workspace/net_mode_bench/iperf3_results.txt
echo "ARCHITECTURAL_CHOICE: EBPF_CNI_FOR_HIGH_SCALE_CLUSTERS" >> /home/student/workspace/net_mode_bench/iperf3_results.txt
cat /home/student/workspace/net_mode_bench/iperf3_results.txt""",
            5: """mkdir -p /home/student/workspace/container_net_cert
echo "VETH_PAIR_AUDIT: BIDIRECTIONAL_NAMESPACE_LINKS_ACTIVE" > /home/student/workspace/container_net_cert/day34_audit.txt
echo "BRIDGE_FDB_AUDIT: LAYER_2_MAC_FORWARDING_VERIFIED" >> /home/student/workspace/container_net_cert/day34_audit.txt
echo "NAT_PIPELINE_AUDIT: SNAT_MASQUERADE_AND_DNAT_VERIFIED" >> /home/student/workspace/container_net_cert/day34_audit.txt
echo "CNI_PLUGIN_AUDIT: IPAM_AND_EBPF_DATAPLANE_NOMINAL" >> /home/student/workspace/container_net_cert/day34_audit.txt
echo "DAY_34_CERTIFICATION: CONTAINER_NETWORKING_MASTERED" >> /home/student/workspace/container_net_cert/day34_audit.txt
cat /home/student/workspace/container_net_cert/day34_audit.txt"""
        },
        35: {
            1: """mkdir -p /home/student/workspace/apex_container_spec
echo "ENGINE_NAME: APEX_CONTAINER_SOVEREIGN_ROOTLESS_RUNTIME" > /home/student/workspace/apex_container_spec/architecture.cfg
echo "USER_NAMESPACE: CONTAINER_UID_0_TO_HOST_UID_100000" >> /home/student/workspace/apex_container_spec/architecture.cfg
echo "CGROUPS_V2_LIMITS: CPU_MAX_MEMORY_MAX_PIDS_MAX_100" >> /home/student/workspace/apex_container_spec/architecture.cfg
echo "STORAGE_DRIVER: ROOTLESS_OVERLAYFS_WITH_FAST_COW" >> /home/student/workspace/apex_container_spec/architecture.cfg
echo "SECURITY_ENCLOSURE: SECCOMP_BPF_AND_CAP_DROP_ALL" >> /home/student/workspace/apex_container_spec/architecture.cfg
cat /home/student/workspace/apex_container_spec/architecture.cfg""",
            2: """mkdir -p /home/student/workspace/breakout_forensics
echo "VULNERABILITY: PRIVILEGED_FLAG_ENABLED_ON_WEB_CONTAINER" > /home/student/workspace/breakout_forensics/escape_audit.log
echo "EXPLOIT_VECTOR: DIRECT_MOUNT_OF_HOST_DEV_SDA1_DISK" >> /home/student/workspace/breakout_forensics/escape_audit.log
echo "REMEDIATION_1: ENFORCE_ROOTLESS_USER_NAMESPACE_MAPPING" >> /home/student/workspace/breakout_forensics/escape_audit.log
echo "REMEDIATION_2: DROP_CAP_SYS_ADMIN_AND_MOUNT_DEV_TMPFS" >> /home/student/workspace/breakout_forensics/escape_audit.log
echo "SECURITY_STATUS: HOST_BREAKOUT_SURFACE_ELIMINATED" >> /home/student/workspace/breakout_forensics/escape_audit.log
cat /home/student/workspace/breakout_forensics/escape_audit.log""",
            3: """mkdir -p /home/student/workspace/apex_engine_build
echo "INIT_PHASE: UNSHARE_ALL_NAMESPACES_AND_WRITE_UID_MAP" > /home/student/workspace/apex_engine_build/execution.log
echo "CGROUP_PHASE: ATTACH_PID_TO_SYS_FS_CGROUP_APEX_SLICE" >> /home/student/workspace/apex_engine_build/execution.log
echo "MOUNT_PHASE: OVERLAYFS_MERGED_AND_PIVOT_ROOT_JAIL" >> /home/student/workspace/apex_engine_build/execution.log
echo "NET_PHASE: VETH_PAIR_ATTACHED_AND_SECCOMP_LOCKED" >> /home/student/workspace/apex_engine_build/execution.log
echo "ENGINE_STATUS: APEX_CONTAINER_PID_1_RUNNING_UNPRIVILEGED" >> /home/student/workspace/apex_engine_build/execution.log
cat /home/student/workspace/apex_engine_build/execution.log""",
            4: """mkdir -p /home/student/workspace/chaos_viva_defense
echo "CHAOS_VECTOR_1: MALICIOUS_FORK_BOMB_INJECTED_IN_CONTAINER" > /home/student/workspace/chaos_viva_defense/viva_results.txt
echo "KERNEL_DEFENSE_1: CGROUP_PIDS_MAX_100_BLOCKS_101ST_FORK_EAGAIN" >> /home/student/workspace/chaos_viva_defense/viva_results.txt
echo "CHAOS_VECTOR_2: RUNAWAY_ALLOCATION_BOMB_INJECTED" >> /home/student/workspace/chaos_viva_defense/viva_results.txt
echo "KERNEL_DEFENSE_2: CGROUP_MEMORY_MAX_CONTAINS_OOM_TO_NAMESPACE" >> /home/student/workspace/chaos_viva_defense/viva_results.txt
echo "HOST_IMPACT: 0_PCT_CPU_DEGRADATION_HOST_100_PCT_STABLE" >> /home/student/workspace/chaos_viva_defense/viva_results.txt
cat /home/student/workspace/chaos_viva_defense/viva_results.txt""",
            5: """mkdir -p /home/student/workspace/milestone_6_cert
echo "PILLAR_1_VIRT: INTEL_VT_X_AND_HARDWARE_EPT_VERIFIED" > /home/student/workspace/milestone_6_cert/day35_viva.txt
echo "PILLAR_2_ISOLATION: 6_NAMESPACES_AND_CGROUPS_V2_VERIFIED" >> /home/student/workspace/milestone_6_cert/day35_viva.txt
echo "PILLAR_3_STORAGE: OVERLAYFS_COW_AND_OCI_SPEC_VERIFIED" >> /home/student/workspace/milestone_6_cert/day35_viva.txt
echo "PILLAR_4_NETWORK: VETH_BRIDGE_SNAT_DNAT_CNI_VERIFIED" >> /home/student/workspace/milestone_6_cert/day35_viva.txt
echo "MILESTONE_6_VERDICT: APEX_CONTAINER_ENGINE_BOARD_APPROVED" >> /home/student/workspace/milestone_6_cert/day35_viva.txt
cat /home/student/workspace/milestone_6_cert/day35_viva.txt"""
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

    with open("scripts/comp_fund_days31_35_snippets.py", "w", encoding="utf-8") as f:
        f.write("SNIPPETS = " + repr(snippets) + "\n")
        f.write("OUTPUTS = " + repr(outputs) + "\n")
    print("Wrote scripts/comp_fund_days31_35_snippets.py successfully.")

if __name__ == "__main__":
    build()
