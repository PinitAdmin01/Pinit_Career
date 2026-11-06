# scripts/build_full_git_days31_32.py
import sys
import os
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')

# We define the bash scripts for Days 31 and 32
bash_snippets = {
    (31, 1): """mkdir -p /home/student/workspace/git_pack_v2
echo "PACKFILE_SIGNATURE: PACK" > /home/student/workspace/git_pack_v2/header.txt
echo "PACKFILE_VERSION: 2" >> /home/student/workspace/git_pack_v2/header.txt
echo "PACKFILE_OBJECT_COUNT: 25480" >> /home/student/workspace/git_pack_v2/header.txt
echo "TRAILER_CHECKSUM: SHA-1 / SHA-256 VALIDATED" >> /home/student/workspace/git_pack_v2/header.txt
cat /home/student/workspace/git_pack_v2/header.txt
grep "PACKFILE_SIGNATURE" /home/student/workspace/git_pack_v2/header.txt""",

    (31, 2): """mkdir -p /home/student/workspace/git_fanout
echo "FANOUT_TABLE_ENTRIES: 256" > /home/student/workspace/git_fanout/fanout.txt
echo "FANOUT_SLOT_00: 98 objects" >> /home/student/workspace/git_fanout/fanout.txt
echo "FANOUT_SLOT_7F: 12740 objects (cumulative mid)" >> /home/student/workspace/git_fanout/fanout.txt
echo "FANOUT_SLOT_FF: 25480 objects (total count)" >> /home/student/workspace/git_fanout/fanout.txt
echo "LOOKUP_COMPLEXITY: O(1) Interval + O(log N) Binary Search" >> /home/student/workspace/git_fanout/fanout.txt
cat /home/student/workspace/git_fanout/fanout.txt
grep "LOOKUP_COMPLEXITY" /home/student/workspace/git_fanout/fanout.txt""",

    (31, 3): """mkdir -p /home/student/workspace/git_deltas
echo "DELTA_TYPE: OBJ_OFS_DELTA" > /home/student/workspace/git_deltas/delta_stats.txt
echo "BASE_OBJECT_OFFSET: -4280 bytes" >> /home/student/workspace/git_deltas/delta_stats.txt
echo "COMPRESSION_ALGORITHM: Sliding Window Copy/Insert" >> /home/student/workspace/git_deltas/delta_stats.txt
echo "SAVINGS_PERCENTAGE: 91.2% reduction vs loose objects" >> /home/student/workspace/git_deltas/delta_stats.txt
cat /home/student/workspace/git_deltas/delta_stats.txt
grep "SAVINGS_PERCENTAGE" /home/student/workspace/git_deltas/delta_stats.txt""",

    (31, 4): """mkdir -p /home/student/workspace/git_pack_parser
echo "PARSER_STATUS: INITIALIZED" > /home/student/workspace/git_pack_parser/run.txt
echo "PACK_INDEX_FILE: .git/objects/pack/pack-7b89f2.idx" >> /home/student/workspace/git_pack_parser/run.txt
echo "VERIFIED_OBJECTS: 25480 / 25480 PASS" >> /home/student/workspace/git_pack_parser/run.txt
echo "DECOMPRESSED_BYTES: 148592000" >> /home/student/workspace/git_pack_parser/run.txt
echo "CRC32_INTEGRITY: 100% MATCH" >> /home/student/workspace/git_pack_parser/run.txt
cat /home/student/workspace/git_pack_parser/run.txt
grep "CRC32_INTEGRITY" /home/student/workspace/git_pack_parser/run.txt""",

    (31, 5): """mkdir -p /home/student/workspace/git_pack_gateway
echo "GATEWAY: MasterPackfileArchitectureGateway" > /home/student/workspace/git_pack_gateway/audit.txt
echo "INODE_PRESSURE: ELIMINATED (25480 loose -> 1 packfile)" >> /home/student/workspace/git_pack_gateway/audit.txt
echo "SEEK_LATENCY: < 2ms (2 disk seeks max)" >> /home/student/workspace/git_pack_gateway/audit.txt
echo "AUDIT_SEAL: PACKFILE-V2-STORAGE-CERTIFIED" >> /home/student/workspace/git_pack_gateway/audit.txt
cat /home/student/workspace/git_pack_gateway/audit.txt
grep "AUDIT_SEAL" /home/student/workspace/git_pack_gateway/audit.txt""",

    (32, 1): """mkdir -p /home/student/workspace/git_index_dirc
echo "DIRC_HEADER_SIGNATURE: DIRC" > /home/student/workspace/git_index_dirc/dirc.txt
echo "INDEX_VERSION: 2" >> /home/student/workspace/git_index_dirc/dirc.txt
echo "ENTRY_COUNT: 18450" >> /home/student/workspace/git_index_dirc/dirc.txt
echo "STAT_CACHE_SIZE_PER_ENTRY: 40 bytes (ctime, mtime, dev, ino, mode, uid, gid, size)" >> /home/student/workspace/git_index_dirc/dirc.txt
cat /home/student/workspace/git_index_dirc/dirc.txt
grep "DIRC_HEADER_SIGNATURE" /home/student/workspace/git_index_dirc/dirc.txt""",

    (32, 2): """mkdir -p /home/student/workspace/git_stat_cache_audit
echo "INCIDENT: The rsync Stat Cache Invalidation Disaster" > /home/student/workspace/git_stat_cache_audit/incident.txt
echo "FILES_AFFECTED: 200000 repository files" >> /home/student/workspace/git_stat_cache_audit/incident.txt
echo "MTIME_DESYNC: Sub-second nanosecond truncation by rsync" >> /home/student/workspace/git_stat_cache_audit/incident.txt
echo "HASH_OVERHEAD: 200000 SHA-1 recalculations on git status (12-minute freeze)" >> /home/student/workspace/git_stat_cache_audit/incident.txt
echo "REMEDY: git update-index --refresh to restore stat cache synchronization" >> /home/student/workspace/git_stat_cache_audit/incident.txt
cat /home/student/workspace/git_stat_cache_audit/incident.txt
grep "REMEDY" /home/student/workspace/git_stat_cache_audit/incident.txt""",

    (32, 3): """mkdir -p /home/student/workspace/git_index_stages
echo "STAGE_0: Normal clean merge state (merged file)" > /home/student/workspace/git_index_stages/stages.txt
echo "STAGE_1: Common ancestor (base) version" >> /home/student/workspace/git_index_stages/stages.txt
echo "STAGE_2: Target branch HEAD (ours) version" >> /home/student/workspace/git_index_stages/stages.txt
echo "STAGE_3: Incoming branch (theirs) version" >> /home/student/workspace/git_index_stages/stages.txt
echo "CONFLICT_RESOLUTION: Unmerged entries resolved into Stage 0 upon git add" >> /home/student/workspace/git_index_stages/stages.txt
cat /home/student/workspace/git_index_stages/stages.txt
grep "CONFLICT_RESOLUTION" /home/student/workspace/git_index_stages/stages.txt""",

    (32, 4): """mkdir -p /home/student/workspace/git_tree_cache
echo "EXTENSION_SIGNATURE: TREE (Cached Tree Extension)" > /home/student/workspace/git_tree_cache/tree_ext.txt
echo "CACHED_ROOT_TREE_SHA: e8f2a1b94c3d" >> /home/student/workspace/git_tree_cache/tree_ext.txt
echo "WRITE_TREE_ACCELERATION: 95% subtree reuse without directory scanning" >> /home/student/workspace/git_tree_cache/tree_ext.txt
echo "EXTENSION_REUC: Resolve Undo records historical conflict resolutions" >> /home/student/workspace/git_tree_cache/tree_ext.txt
cat /home/student/workspace/git_tree_cache/tree_ext.txt
grep "WRITE_TREE_ACCELERATION" /home/student/workspace/git_tree_cache/tree_ext.txt""",

    (32, 5): """mkdir -p /home/student/workspace/git_index_gateway
echo "GATEWAY: MasterGitIndexIntegrityGateway" > /home/student/workspace/git_index_gateway/seal.txt
echo "DIRC_PARITY: 18450 index entries verified against working tree" >> /home/student/workspace/git_index_gateway/seal.txt
echo "STATUS_SCAN_LATENCY: 42ms across 18450 files" >> /home/student/workspace/git_index_gateway/seal.txt
echo "AUDIT_SEAL: GIT-INDEX-DIRC-INTEGRITY-CERTIFIED" >> /home/student/workspace/git_index_gateway/seal.txt
cat /home/student/workspace/git_index_gateway/seal.txt
grep "AUDIT_SEAL" /home/student/workspace/git_index_gateway/seal.txt"""
}

# Run each snippet using tsx script to get exact deterministic stdout!
runner_script = """import { executeBashSuite } from '../src/lib/code/runners/bashRunner';
import * as fs from 'fs';

async function main() {
  const code = fs.readFileSync(process.argv[2], 'utf8');
  const res = await executeBashSuite(code);
  process.stdout.write(res.stdout || '');
}
main();
"""

with open("scripts/run_single_bash.ts", "w", encoding="utf-8") as f:
    f.write(runner_script)

print("Created runner script scripts/run_single_bash.ts.")
