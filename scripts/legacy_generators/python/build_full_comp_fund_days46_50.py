import json

SNIPPETS = {
    46: {
        1: """mkdir -p /home/student/workspace/ha_quorum_arch
echo "CLUSTER_ENGINE: COROSYNC_PACEMAKER_RAFT_QUORUM" > /home/student/workspace/ha_quorum_arch/quorum_spec.cfg
echo "QUORUM_FORMULA: STRICT_MAJORITY_GREATER_THAN_N_DIV_2" >> /home/student/workspace/ha_quorum_arch/quorum_spec.cfg
echo "SPLIT_BRAIN_DEFENSE: STONITH_IPMI_ILO_HARDWARE_FENCING" >> /home/student/workspace/ha_quorum_arch/quorum_spec.cfg
echo "MINORITY_POLICY: IMMEDIATE_DEMOTION_TO_READ_ONLY_SAFE_MODE" >> /home/student/workspace/ha_quorum_arch/quorum_spec.cfg
echo "TOPOLOGY_COMPARE: ACTIVE_PASSIVE_VS_ACTIVE_ACTIVE_MULTI_MASTER" >> /home/student/workspace/ha_quorum_arch/quorum_spec.cfg
cat /home/student/workspace/ha_quorum_arch/quorum_spec.cfg""",
        2: """mkdir -p /home/student/workspace/split_brain_forensics
echo "OUTAGE_EVENT: 2_NODE_POSTGRES_CROSS_RACK_FIBER_SEVERED" > /home/student/workspace/split_brain_forensics/incident.log
echo "FAULT_DYNAMICS: BOTH_NODES_PROMOTED_TO_PRIMARY_CONCURRENTLY" >> /home/student/workspace/split_brain_forensics/incident.log
echo "DATA_CORRUPTION: DIVERGENT_WAL_TRANSACTIONS_TWO_WEEK_RECOVERY" >> /home/student/workspace/split_brain_forensics/incident.log
echo "REMEDIATION_1: DEPLOY_3RD_WITNESS_ARBITER_NODE_IN_AZ_C" >> /home/student/workspace/split_brain_forensics/incident.log
echo "REMEDIATION_2: ENFORCE_OUT_OF_BAND_IPMI_STONITH_POWER_KILL" >> /home/student/workspace/split_brain_forensics/incident.log
cat /home/student/workspace/split_brain_forensics/incident.log""",
        3: """mkdir -p /home/student/workspace/quorum_coordinator
echo "CLUSTER_NODES: NODE_A_AZ1_NODE_B_AZ2_WITNESS_C_AZ3" > /home/student/workspace/quorum_coordinator/election.log
echo "HEARTBEAT_MONITOR: UDP_100MS_INTERVAL_500MS_DEAD_THRESHOLD" >> /home/student/workspace/quorum_coordinator/election.log
echo "PARTITION_SIMULATION: NODE_A_ISOLATED_1_OF_3_VOTES_DEMOTED" >> /home/student/workspace/quorum_coordinator/election.log
echo "MAJORITY_PARTITION: NODE_B_AND_WITNESS_C_2_OF_3_VOTES_QUORUM" >> /home/student/workspace/quorum_coordinator/election.log
echo "ELECTION_STATUS: NODE_B_PROMOTED_AFTER_STONITH_CONFIRMATION" >> /home/student/workspace/ha_quorum_arch/quorum_spec.cfg
cat /home/student/workspace/quorum_coordinator/election.log""",
        4: """mkdir -p /home/student/workspace/stonith_partition_lab
echo "IPTABLES_INJECTION: DROP_ALL_HEARTBEAT_PACKETS_TO_NODE_1" > /home/student/workspace/stonith_partition_lab/failover.txt
echo "MINORITY_NODE_1: QUORUM_LOST_1_OF_3_WRITE_LOCK_ENGAGED" >> /home/student/workspace/stonith_partition_lab/failover.txt
echo "STONITH_EXECUTION: IPMI_CHASSIS_POWER_OFF_NODE_1_VERIFIED" >> /home/student/workspace/stonith_partition_lab/failover.txt
echo "MAJORITY_CLUSTER: NODE_2_ELECTED_PRIMARY_IN_3_2_SECONDS" >> /home/student/workspace/stonith_partition_lab/failover.txt
echo "LAB_VERDICT: 100_PCT_WRITE_AVAILABILITY_ZERO_SPLIT_BRAIN" >> /home/student/workspace/stonith_partition_lab/failover.txt
cat /home/student/workspace/stonith_partition_lab/failover.txt""",
        5: """mkdir -p /home/student/workspace/ha_cluster_cert
echo "QUORUM_MATH_AUDIT: N_DIV_2_PLUS_1_MAJORITY_VERIFIED" > /home/student/workspace/ha_cluster_cert/day46_audit.txt
echo "SPLIT_BRAIN_AUDIT: DUAL_PRIMARY_PREVENTION_PROVEN" >> /home/student/workspace/ha_cluster_cert/day46_audit.txt
echo "STONITH_FENCING_AUDIT: OUT_OF_BAND_POWER_ISOLATION_ACTIVE" >> /home/student/workspace/ha_cluster_cert/day46_audit.txt
echo "FAILOVER_AUDIT: SUB_5_SECOND_DETERMINISTIC_PROMOTION" >> /home/student/workspace/ha_cluster_cert/day46_audit.txt
echo "DAY_46_CERTIFICATION: HIGH_AVAILABILITY_CLUSTERING_MASTERED" >> /home/student/workspace/ha_cluster_cert/day46_audit.txt
cat /home/student/workspace/ha_cluster_cert/day46_audit.txt"""
    },
    47: {
        1: """mkdir -p /home/student/workspace/san_nas_arch
echo "BLOCK_SAN_TIER: ISCSI_AND_FIBRE_CHANNEL_RAW_SCSI_LUNS" > /home/student/workspace/san_nas_arch/storage_spec.cfg
echo "FILE_NAS_TIER: NFSV4_AND_SMB3_POSIX_SHARED_FILESYSTEMS" >> /home/student/workspace/san_nas_arch/storage_spec.cfg
echo "RAID_GEOMETRY: RAID0_STRIPE_RAID1_MIRROR_RAID6_DUAL_PARITY_RAID10" >> /home/student/workspace/san_nas_arch/storage_spec.cfg
echo "ERASURE_CODING: REED_SOLOMON_8_PLUS_4_GALOIS_FIELD_PARITY" >> /home/student/workspace/san_nas_arch/storage_spec.cfg
echo "INVARIANT: SURVIVES_UP_TO_M_SIMULTANEOUS_DISK_FAILURES" >> /home/student/workspace/san_nas_arch/storage_spec.cfg
cat /home/student/workspace/san_nas_arch/storage_spec.cfg""",
        2: """mkdir -p /home/student/workspace/raid5_ure_forensics
echo "ARRAY_CONFIG: 24_DRIVE_12TB_RAID5_SINGLE_PARITY_VOLUME" > /home/student/workspace/raid5_ure_forensics/rebuild_crash.log
echo "INITIAL_FAULT: DRIVE_12_PHYSICAL_SECTOR_FAILURE_DEGRADED_MODE" >> /home/student/workspace/raid5_ure_forensics/rebuild_crash.log
echo "REBUILD_STRESS: 23_REMAINING_DRIVES_READ_AT_100_PCT_FOR_18H" >> /home/student/workspace/raid5_ure_forensics/rebuild_crash.log
echo "SECOND_FAULT: DRIVE_18_UNRECOVERABLE_READ_ERROR_URE_ABORT" >> /home/student/workspace/raid5_ure_forensics/rebuild_crash.log
echo "ARCHITECTURAL_FIX: MIGRATE_TO_RAID6_OR_REED_SOLOMON_ERASURE" >> /home/student/workspace/raid5_ure_forensics/rebuild_crash.log
cat /home/student/workspace/raid5_ure_forensics/rebuild_crash.log""",
        3: """mkdir -p /home/student/workspace/erasure_engine
echo "ENCODING_MATRIX: 4_DATA_SHARDS_PLUS_2_PARITY_SHARDS_RS_4_2" > /home/student/workspace/erasure_engine/reed_solomon.log
echo "STRIPE_WRITE: 64KB_BLOCK_DISTRIBUTED_ACROSS_6_VIRTUAL_DISKS" >> /home/student/workspace/erasure_engine/reed_solomon.log
echo "FAULT_INJECTION: DISK_2_AND_DISK_5_DESTROYED_SIMULTANEOUSLY" >> /home/student/workspace/erasure_engine/reed_solomon.log
echo "GALOIS_RECONSTRUCTION: VANDERMONDE_MATRIX_INVERSION_SUCCESS" >> /home/student/workspace/erasure_engine/reed_solomon.log
echo "INTEGRITY_CHECK: SHA256_RECONSTRUCTED_PAYLOAD_100_PCT_MATCH" >> /home/student/workspace/erasure_engine/reed_solomon.log
cat /home/student/workspace/erasure_engine/reed_solomon.log""",
        4: """mkdir -p /home/student/workspace/iscsi_mpio_lab
echo "SAN_TARGET: LINUX_LIO_TARGETCLI_BLOCK_LUN_0_EXPORTED" > /home/student/workspace/iscsi_mpio_lab/multipath.txt
echo "NETWORK_FABRIC: DUAL_25GBE_OPTICAL_PATHS_NIC_A_AND_NIC_B" >> /home/student/workspace/iscsi_mpio_lab/multipath.txt
echo "MPIO_POLICY: DM_MULTIPATH_QUEUE_LENGTH_ACTIVE_ACTIVE" >> /home/student/workspace/iscsi_mpio_lab/multipath.txt
echo "CABLE_CUT_TEST: NIC_A_SEVERED_UNDER_80000_IOPS_DB_LOAD" >> /home/student/workspace/iscsi_mpio_lab/multipath.txt
echo "FAILOVER_VERDICT: ZERO_IO_ERRORS_SUB_MILLISECOND_PATH_SWITCH" >> /home/student/workspace/iscsi_mpio_lab/multipath.txt
cat /home/student/workspace/iscsi_mpio_lab/multipath.txt""",
        5: """mkdir -p /home/student/workspace/storage_cert
echo "SAN_VS_NAS_AUDIT: SCSI_3_PR_BLOCK_LUN_VS_NFS_VERIFIED" > /home/student/workspace/storage_cert/day47_audit.txt
echo "RAID_URE_AUDIT: RAID5_OBSOLESCENCE_AND_RAID6_PROVEN" >> /home/student/workspace/storage_cert/day47_audit.txt
echo "ERASURE_CODING_AUDIT: REED_SOLOMON_4_PLUS_2_RECOVERY_ACTIVE" >> /home/student/workspace/storage_cert/day47_audit.txt
echo "ISCSI_MPIO_AUDIT: DUAL_FABRIC_MULTIPATH_FAILOVER_NOMINAL" >> /home/student/workspace/storage_cert/day47_audit.txt
echo "DAY_47_CERTIFICATION: ENTERPRISE_STORAGE_PROTOCOLS_MASTERED" >> /home/student/workspace/storage_cert/day47_audit.txt
cat /home/student/workspace/storage_cert/day47_audit.txt"""
    },
    48: {
        1: """mkdir -p /home/student/workspace/iac_immutable_arch
echo "PARADIGM_SHIFT: DISPOSABLE_CATTLE_OVER_HANDCRAFTED_PETS" > /home/student/workspace/iac_immutable_arch/iac_spec.cfg
echo "STATE_ENGINE: DECLARATIVE_DAG_TERRAFORM_OPENTOFU_GRAPH" >> /home/student/workspace/iac_immutable_arch/iac_spec.cfg
echo "IMAGE_PIPELINE: HASHICORP_PACKER_PREBAKED_GOLDEN_AMI" >> /home/student/workspace/iac_immutable_arch/iac_spec.cfg
echo "DRIFT_RECONCILER: CONTINUOUS_SHA256_STATE_DIFF_DETECTION" >> /home/student/workspace/iac_immutable_arch/iac_spec.cfg
echo "IMMUTABLE_RULE: ZERO_IN_PLACE_SSH_PATCHING_REPLACE_ON_UPDATE" >> /home/student/workspace/iac_immutable_arch/iac_spec.cfg
cat /home/student/workspace/iac_immutable_arch/iac_spec.cfg""",
        2: """mkdir -p /home/student/workspace/snowflake_forensics
echo "OUTAGE_EVENT: 8_YEAR_SNOWFLAKE_SERVER_HARDWARE_FAILURE" > /home/student/workspace/snowflake_forensics/drift_incident.log
echo "ROOT_CAUSE: 12_SYSADMINS_APPLIED_UNDOCUMENTED_MANUAL_HOTFIXES" >> /home/student/workspace/snowflake_forensics/drift_incident.log
echo "BUSINESS_IMPACT: 3_WEEKS_DOWNTIME_USD_1400000_REVENUE_LOSS" >> /home/student/workspace/snowflake_forensics/drift_incident.log
echo "CVE_PATCH_RULING: VETO_MANUAL_SSH_APT_UPGRADE_ON_2000_VMS" >> /home/student/workspace/snowflake_forensics/drift_incident.log
echo "IMMUTABLE_ROLLOUT: PACKER_GOLDEN_IMAGE_ASG_BLUE_GREEN_REFRESH" >> /home/student/workspace/snowflake_forensics/drift_incident.log
cat /home/student/workspace/snowflake_forensics/drift_incident.log""",
        3: """mkdir -p /home/student/workspace/state_reconciler
echo "DESIRED_STATE_SPEC: NGINX_1_26_TLS_STRICT_PORT_443_OPEN" > /home/student/workspace/state_reconciler/reconcile.log
echo "ACTUAL_STATE_SCAN: DRIFT_DETECTED_PORT_8080_OPEN_MANUAL_EDIT" >> /home/student/workspace/state_reconciler/reconcile.log
echo "PLAN_COMPUTATION: REVOKE_PORT_8080_RESTORE_IMMUTABLE_CFG" >> /home/student/workspace/state_reconciler/reconcile.log
echo "CONVERGE_EXECUTION: IDEMPOTENT_STATE_APPLIED_IN_180_MS" >> /home/student/workspace/state_reconciler/reconcile.log
echo "RECONCILER_STATUS: ZERO_CONFIGURATION_DRIFT_VERIFIED" >> /home/student/workspace/state_reconciler/reconcile.log
cat /home/student/workspace/state_reconciler/reconcile.log""",
        4: """mkdir -p /home/student/workspace/self_healing_lab
echo "UNAUTHORIZED_CHANGE: MANUAL_SSH_MODIFIED_SYSCTL_AND_SSHD_CFG" > /home/student/workspace/self_healing_lab/drift_guard.txt
echo "DETECTION_LATENCY: 12_SECONDS_VIA_CONTINUOUS_STATE_POLLING" >> /home/student/workspace/self_healing_lab/drift_guard.txt
echo "REMEDIATION_ACTION: TAINTED_INSTANCE_CORDONED_AND_TERMINATED" >> /home/student/workspace/self_healing_lab/drift_guard.txt
echo "REPLACEMENT_BOOT: GOLDEN_IMAGE_SPAWNED_IN_14_SECONDS" >> /home/student/workspace/self_healing_lab/drift_guard.txt
echo "LAB_VERDICT: SELF_HEALING_IMMUTABLE_FLEET_100_PCT_CONVERGED" >> /home/student/workspace/self_healing_lab/drift_guard.txt
cat /home/student/workspace/self_healing_lab/drift_guard.txt""",
        5: """mkdir -p /home/student/workspace/iac_cert
echo "DECLARATIVE_DAG_AUDIT: STATE_GRAPH_IDEMPOTENCY_VERIFIED" > /home/student/workspace/iac_cert/day48_audit.txt
echo "GOLDEN_IMAGE_AUDIT: PACKER_15S_BOOT_PIPELINE_VERIFIED" >> /home/student/workspace/iac_cert/day48_audit.txt
echo "SNOWFLAKE_ELIMINATION_AUDIT: ZERO_MANUAL_SSH_ACCESS_ENFORCED" >> /home/student/workspace/iac_cert/day48_audit.txt
echo "DRIFT_RECONCILIATION_AUDIT: 30S_AUTO_REMEDIATION_ACTIVE" >> /home/student/workspace/iac_cert/day48_audit.txt
echo "DAY_48_CERTIFICATION: IAC_AND_IMMUTABLE_ARCHITECTURE_MASTERED" >> /home/student/workspace/iac_cert/day48_audit.txt
cat /home/student/workspace/iac_cert/day48_audit.txt"""
    },
    49: {
        1: """mkdir -p /home/student/workspace/bcdr_arch
echo "RTO_METRIC: MAX_ACCEPTABLE_DOWNTIME_DURATION_SLA_5_MIN" > /home/student/workspace/bcdr_arch/dr_spec.cfg
echo "RPO_METRIC: MAX_ACCEPTABLE_DATA_LOSS_WINDOW_SLA_15_SEC" >> /home/student/workspace/bcdr_arch/dr_spec.cfg
echo "BACKUP_TOPOLOGY: 3_COPIES_2_MEDIA_1_OFFSITE_1_IMMUTABLE_0_ERRORS" >> /home/student/workspace/bcdr_arch/dr_spec.cfg
echo "STANDBY_TIERS: HOT_ACTIVE_WARM_STANDBY_COLD_PILOT_LIGHT" >> /home/student/workspace/bcdr_arch/dr_spec.cfg
echo "INVARIANT: UNTESTED_BACKUP_EQUALS_ZERO_BACKUP_EXISTENCE" >> /home/student/workspace/bcdr_arch/dr_spec.cfg
cat /home/student/workspace/bcdr_arch/dr_spec.cfg""",
        2: """mkdir -p /home/student/workspace/backup_failure_forensics
echo "INCIDENT_EVENT: ACCIDENTAL_RM_RF_ON_300GB_PRODUCTION_POSTGRES" > /home/student/workspace/backup_failure_forensics/postmortem.log
echo "BACKUP_1_2_FAILURE: DISK_QUOTA_FULL_AND_S3_IAM_DENIED_SILENTLY" >> /home/student/workspace/backup_failure_forensics/postmortem.log
echo "BACKUP_3_FAILURE: CRON_DUMP_PRODUCED_0_BYTE_FILES_FOR_6_MONTHS" >> /home/student/workspace/backup_failure_forensics/postmortem.log
echo "REMEDIATION_1: S3_OBJECT_LOCK_WORM_RANSOMWARE_IMMUTABILITY" >> /home/student/workspace/backup_failure_forensics/postmortem.log
echo "REMEDIATION_2: AUTOMATED_DAILY_SANDBOX_RESTORE_AND_SQL_AUDIT" >> /home/student/workspace/backup_failure_forensics/postmortem.log
cat /home/student/workspace/backup_failure_forensics/postmortem.log""",
        3: """mkdir -p /home/student/workspace/restore_verifier
echo "SNAPSHOT_CREATED: PG_BASEBACKUP_AES256_SHA256_8F92A1C4" > /home/student/workspace/restore_verifier/verification.log
echo "WORM_UPLOAD: S3_OBJECT_LOCK_COMPLIANCE_MODE_30_DAYS" >> /home/student/workspace/restore_verifier/verification.log
echo "SANDBOX_RESTORE: EPHEMERAL_CONTAINER_RESTORED_IN_48_SECONDS" >> /home/student/workspace/restore_verifier/verification.log
echo "SQL_INTEGRITY_CHECK: 14200000_ROWS_CHECKSUM_100_PCT_VALID" >> /home/student/workspace/restore_verifier/verification.log
echo "VERIFIER_STATUS: RTO_48S_RPO_4S_ZERO_RESTORATION_ERRORS" >> /home/student/workspace/restore_verifier/verification.log
cat /home/student/workspace/restore_verifier/verification.log""",
        4: """mkdir -p /home/student/workspace/gameday_failover_lab
echo "DISASTER_SIMULATION: US_EAST_1_PRIMARY_REGION_BLACKOUT" > /home/student/workspace/gameday_failover_lab/drill.txt
echo "REPLICA_PROMOTION: US_WEST_2_WARM_STANDBY_PROMOTED_IN_19S" >> /home/student/workspace/gameday_failover_lab/drill.txt
echo "DNS_ROUTING_SWITCH: ROUTE53_HEALTH_CHECK_TTL_60S_CONVERGED" >> /home/student/workspace/gameday_failover_lab/drill.txt
echo "COMPUTE_QUOTA_AUDIT: PRE_WARMED_ASG_SCALED_TO_100_PCT_LOAD" >> /home/student/workspace/gameday_failover_lab/drill.txt
echo "GAMEDAY_VERDICT: FULL_REGIONAL_RECOVERY_IN_112_SECONDS_SLA_MET" >> /home/student/workspace/gameday_failover_lab/drill.txt
cat /home/student/workspace/gameday_failover_lab/drill.txt""",
        5: """mkdir -p /home/student/workspace/bcdr_cert
echo "RTO_RPO_CALCULUS_AUDIT: SLA_BOUNDS_MATHEMATICALLY_VERIFIED" > /home/student/workspace/bcdr_cert/day49_audit.txt
echo "RULE_3_2_1_1_0_AUDIT: WORM_AIRGAP_AND_ZERO_ERRORS_ACTIVE" >> /home/student/workspace/bcdr_cert/day49_audit.txt
echo "SANDBOX_RESTORE_AUDIT: CONTINUOUS_AUTOMATED_RECOVERY_PROVEN" >> /home/student/workspace/bcdr_cert/day49_audit.txt
echo "MULTI_REGION_DR_AUDIT: SUB_2_MINUTE_REGIONAL_FAILOVER_READY" >> /home/student/workspace/bcdr_cert/day49_audit.txt
echo "DAY_49_CERTIFICATION: ENTERPRISE_DISASTER_RECOVERY_MASTERED" >> /home/student/workspace/bcdr_cert/day49_audit.txt
cat /home/student/workspace/bcdr_cert/day49_audit.txt"""
    },
    50: {
        1: """mkdir -p /home/student/workspace/apex_resilience_spec
echo "PLATFORM_NAME: APEX_RESILIENCE_HA_AND_DR_ORCHESTRATOR" > /home/student/workspace/apex_resilience_spec/blueprint.cfg
echo "CLUSTERING_LAYER: 3_NODE_RAFT_QUORUM_WITH_IPMI_STONITH" >> /home/student/workspace/apex_resilience_spec/blueprint.cfg
echo "STORAGE_LAYER: DUAL_25GBE_ISCSI_MPIO_AND_RS_4_2_ERASURE" >> /home/student/workspace/apex_resilience_spec/blueprint.cfg
echo "INFRASTRUCTURE_LAYER: PACKER_GOLDEN_IMAGES_TERRAFORM_DRIFT_GUARD" >> /home/student/workspace/apex_resilience_spec/blueprint.cfg
echo "RECOVERY_LAYER: 3_2_1_1_0_WORM_BACKUPS_RTO_42S_RPO_0S" >> /home/student/workspace/apex_resilience_spec/blueprint.cfg
cat /home/student/workspace/apex_resilience_spec/blueprint.cfg""",
        2: """mkdir -p /home/student/workspace/flapping_forensics
echo "INCIDENT_TRACE: INTERMITTENT_PACKET_JITTER_10S_FAILOVER_LOOP" > /home/student/workspace/flapping_forensics/flap_audit.log
echo "FAILURE_CASCADE: NODE_A_AND_NODE_B_MUTUAL_STONITH_DUAL_KILL" >> /home/student/workspace/flapping_forensics/flap_audit.log
echo "ROOT_CAUSE: ZERO_HYSTERESIS_DAMPING_ON_HEARTBEAT_PROMOTION" >> /home/student/workspace/flapping_forensics/flap_audit.log
echo "REMEDIATION_1: EXPONENTIAL_BACKOFF_HYSTERESIS_DAMPER_WINDOW" >> /home/student/workspace/flapping_forensics/flap_audit.log
echo "REMEDIATION_2: SERIALIZED_RAFT_TERM_FENCING_TOKEN_LOCK" >> /home/student/workspace/flapping_forensics/flap_audit.log
cat /home/student/workspace/flapping_forensics/flap_audit.log""",
        3: """mkdir -p /home/student/workspace/apex_resilience_engine
echo "QUORUM_STATE: 3_OF_3_NODES_HEALTHY_HYSTERESIS_DAMPER_ARMED" > /home/student/workspace/apex_resilience_engine/orchestrator.log
echo "STORAGE_STATE: ISCSI_MPIO_DUAL_PATH_AND_RAID6_PARITY_OPTIMAL" >> /home/student/workspace/apex_resilience_engine/orchestrator.log
echo "IAC_STATE: GOLDEN_IMAGE_V19_DEPLOYED_ZERO_DRIFT_DETECTED" >> /home/student/workspace/apex_resilience_engine/orchestrator.log
echo "BACKUP_STATE: WORM_SNAPSHOT_VERIFIED_IN_EPHEMERAL_SANDBOX" >> /home/student/workspace/apex_resilience_engine/orchestrator.log
echo "ENGINE_STATUS: APEX_RESILIENCE_AUTONOMOUS_SHIELD_ACTIVE" >> /home/student/workspace/apex_resilience_engine/orchestrator.log
cat /home/student/workspace/apex_resilience_engine/orchestrator.log""",
        4: """mkdir -p /home/student/workspace/compound_failure_viva
echo "COMPOUND_FAULT: PRIMARY_SAN_LINK_CUT_PLUS_PRIMARY_NODE_POWER_LOSS" > /home/student/workspace/compound_failure_viva/viva_results.txt
echo "STEP_1_QUORUM: REGION_2_WITNESSES_DETECT_LOSS_2_OF_3_QUORUM" >> /home/student/workspace/compound_failure_viva/viva_results.txt
echo "STEP_2_STONITH: IPMI_POWER_ISOLATION_OF_PRIMARY_NODE_CONFIRMED" >> /home/student/workspace/compound_failure_viva/viva_results.txt
echo "STEP_3_STORAGE: SYNC_REPLICATION_CHECKPOINT_VERIFIED_RPO_ZERO" >> /home/student/workspace/compound_failure_viva/viva_results.txt
echo "VIVA_VERDICT: STANDBY_PROMOTED_AND_DNS_SWITCHED_IN_42_SECONDS" >> /home/student/workspace/compound_failure_viva/viva_results.txt
cat /home/student/workspace/compound_failure_viva/viva_results.txt""",
        5: """mkdir -p /home/student/workspace/milestone_9_cert
echo "PILLAR_1_HA: 3_NODE_QUORUM_AND_STONITH_FENCING_VERIFIED" > /home/student/workspace/milestone_9_cert/day50_viva.txt
echo "PILLAR_2_STORAGE: ISCSI_MPIO_AND_REED_SOLOMON_PARITY_VERIFIED" >> /home/student/workspace/milestone_9_cert/day50_viva.txt
echo "PILLAR_3_IAC: IMMUTABLE_GOLDEN_IMAGES_AND_DRIFT_GUARD_VERIFIED" >> /home/student/workspace/milestone_9_cert/day50_viva.txt
echo "PILLAR_4_BCDR: 3_2_1_1_0_SANDBOX_RESTORE_42S_RTO_VERIFIED" >> /home/student/workspace/milestone_9_cert/day50_viva.txt
echo "MILESTONE_9_VERDICT: APEX_RESILIENCE_SUITE_BOARD_APPROVED" >> /home/student/workspace/milestone_9_cert/day50_viva.txt
cat /home/student/workspace/milestone_9_cert/day50_viva.txt"""
    }
}

# Fix typo in Day 46 Part 3 snippet where it echoed to ha_quorum_arch/quorum_spec.cfg instead of quorum_coordinator/election.log
SNIPPETS[46][3] = SNIPPETS[46][3].replace(
    '>> /home/student/workspace/ha_quorum_arch/quorum_spec.cfg',
    '>> /home/student/workspace/quorum_coordinator/election.log'
)

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

with open("scripts/comp_fund_days46_50_snippets.py", "w", encoding="utf-8") as f:
    f.write(f"SNIPPETS = {repr(SNIPPETS)}\n")
    f.write(f"OUTPUTS = {repr(OUTPUTS)}\n")

print("Wrote scripts/comp_fund_days46_50_snippets.py successfully!")
