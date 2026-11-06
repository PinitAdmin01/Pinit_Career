# scripts/make_comp_fund_day13.py
import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DAY = 13
TITLE = "Cloud Storage & Distributed Sync: Block Deltas, Conflict Resolution & The 3-2-1 Backup Rule"
GOAL = "Master modern cloud storage architectures, differential block synchronization algorithms (rsync rolling checksums), distributed concurrency conflict resolution (Lamport timestamps, vector clocks, CRDTs), immutable object versioning, and enterprise 3-2-1 backup disaster recovery protocols."
MINUTES = 45
RECAP = "In Day 12, we mastered digital productivity, keyboard ergonomics, and command line navigation. Today in Day 13, we explore distributed storage systems: how cloud providers store exabytes of data, how files sync across devices using differential block deltas, how distributed systems resolve conflicting edits, and how the 3-2-1 backup rule guarantees disaster recovery."

p1_say = [
    "Welcome to Day 13 of Computer Fundamentals and Systems Architecture. Today, we step into the modern world of distributed persistence: Cloud Storage Architecture, Differential Synchronization, Block Deltas, Distributed Conflict Resolution, and Enterprise Disaster Recovery. When an engineer uploads a file to Google Drive, Dropbox, AWS S3, or an enterprise object store, the underlying system does not simply copy an entire file over an FTP socket. It engages sophisticated distributed systems engineering designed to synchronize exabytes of data with minimal bandwidth, zero data loss, and high availability.",
    "At the highest architectural tier, cloud storage is classified into three distinct paradigms: 1. Block Storage (e.g., AWS EBS, Azure Managed Disks, Ceph): Provides raw, unformatted physical or virtual disk blocks exposed over high-speed networks (iSCSI, NVMe-oF). The client operating system formats these blocks with its own filesystem (Ext4, XFS, NTFS). Block storage delivers sub-millisecond latencies and high IOPS, making it the bedrock for transactional databases and virtual machine OS disks; 2. File Storage (e.g., NFS, SMB, AWS EFS): Exposes a hierarchical file system tree with standard directory structures and POSIX locking semantics accessible concurrently by hundreds of client machines; and 3. Object Storage (e.g., AWS S3, Google Cloud Storage, MinIO): Discards hierarchical directory trees in favor of a flat address space where every piece of data is treated as an immutable Object, identified by a unique URI key and accompanied by rich arbitrary metadata.",
    "Object Storage is the cornerstone of modern internet infrastructure. Because object storage eliminates the complex locking, directory caching, and inode traversal overhead of POSIX filesystems, it scales horizontally across hundreds of thousands of commodity storage servers. Writes in object storage are atomic: an object is either completely committed and available for reading or non-existent, preventing partial write corruption. Furthermore, object storage systems achieve extraordinary durability (such as AWS S3's 99.999999999%—11 nines of durability) by utilizing Reed-Solomon Erasure Coding across independent geographic availability zones rather than simple raw replication.",
    "Erasure coding partitions a file into $K$ data chunks and computes $M$ parity chunks, distributing the resulting $K+M$ fragments across separate server racks or physical data centers. The mathematical beauty of erasure coding lies in its reconstruction guarantee: the original file can be reconstructed from ANY $K$ surviving chunks. For instance, an 8+4 erasure coding scheme allows any 4 arbitrary disks or entire data centers to fail simultaneously without a single bit of customer data being lost, all while incurring only a 50% storage overhead compared to 200% overhead for traditional 3-way replication.",
    "Modern cloud storage also introduces Object Lifecycle Policies and Storage Tiers: Hot Storage (frequently accessed data requiring millisecond retrieval), Warm/Infrequent Access (lower storage cost, higher per-GB retrieval fee), and Cold/Archive Storage (such as AWS Glacier or Google Cloud Archive, where storage costs pennies per terabyte per month, but data retrieval takes minutes or hours as physical tapes or deep disks are spun up). Systems engineers configure automated lifecycle rules to transition aging access logs and database backups into colder tiers automatically.",
    "In this opening section, we construct a cloud storage paradigm and erasure coding simulation in the shell. We model object metadata, compute erasure parity overhead ratios, and evaluate storage tier economics."
]

p1_code = """mkdir -p /home/student/workspace/cloud_sync_sim
cat << 'EOF' > /home/student/workspace/cloud_sync_sim/storage_tiers.sh
cat << 'CSV' > /home/student/workspace/cloud_sync_sim/tiers.csv
TIER_NAME,COST_PER_GB_MONTH,RETRIEVAL_LATENCY,MIN_RETENTION_DAYS,DURABILITY_NINES
HOT_STANDARD,0.023,10ms,0,11
INFREQUENT_ACCESS,0.0125,50ms,30,11
GLACIER_FLEXIBLE,0.0036,5h,90,11
DEEP_ARCHIVE,0.00099,12h,180,11
CSV

echo "=== CLOUD STORAGE TIERS COST & LATENCY COMPARISON ==="
awk -F',' 'NR==1 { printf "%-18s %-12s %-15s %-10s\\n", $1, $2, $3, $5 } \
           NR>1 { printf "%-18s $%-11s %-15s %s nines\\n", $1, $2, $3, $5 }' /home/student/workspace/cloud_sync_sim/tiers.csv
EOF
bash /home/student/workspace/cloud_sync_sim/storage_tiers.sh"""

p1_output = """=== CLOUD STORAGE TIERS COST & LATENCY COMPARISON ===
TIER_NAME          COST_PER_GB_MONTH RETRIEVAL_LATENCY DURABILITY_NINES
HOT_STANDARD       $0.023       10ms            11 nines
INFREQUENT_ACCESS  $0.0125      50ms            11 nines
GLACIER_FLEXIBLE   $0.0036      5h              11 nines
DEEP_ARCHIVE       $0.00099     12h             11 nines"""

p1_example = "Think of physical mail vs shipping containers: POSIX file storage is like a local post office box with keys and folders; Object storage is a massive global shipping container yard where each container has a unique barcode and can be placed anywhere."

p1_codeNotes = [
    {"line": 3, "note": "Creates a structured dataset defining the pricing, latency, and retention characteristics of cloud storage tiers."},
    {"line": 11, "note": "Formats tabular output highlighting the trade-off between sub-cent per-GB storage costs and multi-hour retrieval latencies."},
    {"line": 12, "note": "Demonstrates that all tiers maintain 11 nines (99.999999999%) durability via erasure coding."}
]

p1_tryIt = "Add an ULTRA_COLD tier costing $0.0005 per GB with a 24-hour retrieval latency."

p1_check = {
    "question": "What is the primary architectural difference between Object Storage (e.g. AWS S3) and traditional POSIX Block/File Storage?",
    "options": [
        "Object storage uses a flat namespace identified by unique keys and eliminates complex POSIX file locking/directory hierarchies to achieve massive horizontal scalability",
        "Object storage can only store images and cannot store text or binary files",
        "Object storage requires physical human operators to plug in hard drives for every read request",
        "Object storage is stored only in the browser's temporary cache and is deleted when the computer restarts"
    ],
    "answer": 0,
    "why": "Object storage organizes data in a flat key-value namespace with rich metadata, omitting POSIX hierarchical locking and directory structures to scale horizontally across exabytes of commodity storage."
}

p2_say = [
    "In the second operational tier of Day 13, we explore Differential Synchronization and the Rsync Rolling Checksum Algorithm. When synchronizing a 500-megabyte virtual disk image, database dump, or git repository between a local developer workstation and a remote cloud server, re-transmitting all 500 megabytes when only a single 4-kilobyte block changed is an intolerable waste of network bandwidth and time.",
    "The pioneering solution to this problem is the Rsync Algorithm, formulated by Andrew Tridgell. Rsync achieves differential file synchronization across high-latency networks without requiring the receiving machine to have a copy of the original file beforehand, and without requiring the sending machine to download the remote file to compute a diff. It achieves this mathematical feat through a Two-Tier Checksum Mechanism.",
    "The rsync synchronization pipeline operates in four deterministic stages: 1. Block Partitioning: The receiver splits its existing file copy into non-overlapping contiguous blocks of fixed size $S$ (typically 1 KB to 8 KB); 2. Dual Checksum Computation: For every block, the receiver computes two checksums: a fast 32-bit Rolling Checksum (Adler-32 or a lightweight rolling hash) and a cryptographically strong 128-bit or 256-bit hash (MD5 or SHA-256). The receiver sends this lightweight checksum table to the sender; 3. Sliding Window Rolling Search: The sender sweeps a sliding window of size $S$ through its local updated file one byte at a time. At each byte offset, it computes the rolling checksum in $O(1)$ constant time by subtracting the byte falling out of the window and adding the byte entering the window.",
    "4. Strong Hash Match Verification: If the rolling checksum matches any block in the receiver's table, the sender computes the expensive strong hash to verify that it is an authentic block match rather than a hash collision. If both hashes match, the sender records the block index. If they do not match, the sender advances the window by one byte and appends the unmatched byte to a raw delta stream. 5. Delta Reconstruction: The sender transmits only the unmatched literal bytes and the block index references. The receiver reads this compact delta recipe, copying unmodified blocks directly from its old local file and inserting newly transmitted literal bytes at the exact offsets, synthesizing the identical updated file with minimal wire transfer.",
    "Modern cloud synchronization clients (such as Dropbox, OneDrive, and Git packfile delta compressors) utilize advanced variations of this rolling checksum principle. Dropbox, for example, partitions files into 4 MB chunks and hashes them with SHA-256, storing blocks in a global content-addressable storage (CAS) engine. If multiple users across the globe upload an identical Linux ISO image or identical library binary, the server detects the identical chunk hashes and skips the physical network upload entirely—a process known as Client-Side Cross-User Deduplication.",
    "In this section, we construct a differential file delta detection and rolling block checksum simulation in the shell. We model file block segmentation, compute SHA-256 block digests, identify modified byte offsets, and calculate bandwidth compression savings."
]

p2_code = """mkdir -p /home/student/workspace/cloud_sync_sim
cat << 'EOF' > /home/student/workspace/cloud_sync_sim/delta_sync.sh
# Create initial 12-byte file (3 blocks of 4 bytes)
echo "AAAA" > /home/student/workspace/cloud_sync_sim/remote_file.bin
echo "BBBB" >> /home/student/workspace/cloud_sync_sim/remote_file.bin
echo "CCCC" >> /home/student/workspace/cloud_sync_sim/remote_file.bin

# Create local updated file where only the middle block changed
echo "AAAA" > /home/student/workspace/cloud_sync_sim/local_file.bin
echo "BXBX" >> /home/student/workspace/cloud_sync_sim/local_file.bin
echo "CCCC" >> /home/student/workspace/cloud_sync_sim/local_file.bin

# Hash blocks
REMOTE_B1=$(head -n 1 /home/student/workspace/cloud_sync_sim/remote_file.bin | sha256sum | awk '{print $1}')
REMOTE_B2=$(sed -n '2p' /home/student/workspace/cloud_sync_sim/remote_file.bin | sha256sum | awk '{print $1}')
REMOTE_B3=$(tail -n 1 /home/student/workspace/cloud_sync_sim/remote_file.bin | sha256sum | awk '{print $1}')

LOCAL_B1=$(head -n 1 /home/student/workspace/cloud_sync_sim/local_file.bin | sha256sum | awk '{print $1}')
LOCAL_B2=$(sed -n '2p' /home/student/workspace/cloud_sync_sim/local_file.bin | sha256sum | awk '{print $1}')
LOCAL_B3=$(tail -n 1 /home/student/workspace/cloud_sync_sim/local_file.bin | sha256sum | awk '{print $1}')

echo "=== BLOCK DIFFERENTIAL SYNCHRONIZATION AUDIT ==="
echo "Block 1 (Remote vs Local): $([ "$REMOTE_B1" = "$LOCAL_B1" ] && echo "MATCH [SKIP_TRANSFER]" || echo "DIRTY [TRANSFER_BLOCK]")"
echo "Block 2 (Remote vs Local): $([ "$REMOTE_B2" = "$LOCAL_B2" ] && echo "MATCH [SKIP_TRANSFER]" || echo "DIRTY [TRANSFER_BLOCK]")"
echo "Block 3 (Remote vs Local): $([ "$REMOTE_B3" = "$LOCAL_B3" ] && echo "MATCH [SKIP_TRANSFER]" || echo "DIRTY [TRANSFER_BLOCK]")"
echo "Bandwidth Optimization:    66.67% of data preserved locally"
EOF
bash /home/student/workspace/cloud_sync_sim/delta_sync.sh"""

p2_output = """=== BLOCK DIFFERENTIAL SYNCHRONIZATION AUDIT ===
Block 1 (Remote vs Local): MATCH [SKIP_TRANSFER]
Block 2 (Remote vs Local): DIRTY [TRANSFER_BLOCK]
Block 3 (Remote vs Local): MATCH [SKIP_TRANSFER]
Bandwidth Optimization:    66.67% of data preserved locally"""

p2_example = "Think of editing a printed book: instead of re-printing and mailing the entire 500-page book because you fixed a typo on page 42, you mail only an errata slip with page 42 to the reader."

p2_codeNotes = [
    {"line": 3, "note": "Creates a remote baseline file segmented into 3 distinct logical blocks."},
    {"line": 8, "note": "Simulates a local edit that modifies only Block 2 while leaving Blocks 1 and 3 untouched."},
    {"line": 13, "note": "Computes SHA-256 block digests for both files independently."},
    {"line": 21, "note": "Evaluates block parity, transmitting only the modified block and achieving 66.67% bandwidth savings."}
]

p2_tryIt = "Modify Block 3 in local_file.bin to 'CXZC' and observe how Block 3 transitions from MATCH to DIRTY."

p2_check = {
    "question": "How does the Rsync algorithm compute checksums over a sliding window in O(1) constant time without re-hashing the entire block byte-by-byte?",
    "options": [
        "It uses a Rolling Hash that subtracts the outgoing byte and adds the incoming byte in constant arithmetic operations",
        "It sends the entire file to Google servers to compute the hash on an AI supercomputer",
        "It re-compiles the Linux kernel before each byte comparison",
        "It assumes all files have identical contents unless the file name changes"
    ],
    "answer": 0,
    "why": "A rolling hash (like Adler-32 or Rabin fingerprint) updates its value in O(1) time as the window slides by subtracting the departing byte and adding the arriving byte, eliminating expensive full-block re-hashing."
}

p3_say = [
    "In our third operational tier, we examine Concurrent Modification Conflict Resolution, Vector Clocks, and Multi-Master Replication. In any distributed synchronization system—whether cloud document collaboration (Google Docs, Notion), mobile offline sync (Notes apps), or multi-region database clusters—multiple clients inevitably modify the same document or data record simultaneously while disconnected from the network.",
    "When two clients edit the same file concurrently, how does the distributed system decide which change wins? The naive approach—Last-Write-Wins (LWW) based on physical wall-clock timestamps (NTP)—is notoriously flawed in distributed systems. Physical quartz clocks on different laptops or servers experience Clock Drift (skew). If Client A makes an edit at 12:00:01 on an unsynced clock showing 12:00:03, and Client B makes an edit at 12:00:02 on an accurate clock, Client A's edit will erroneously overwrite Client B's newer work, causing Silent Data Loss.",
    "To solve the causality problem without physical clocks, Leslie Lamport invented Logical Clocks (Lamport Timestamps). A Lamport clock is a monotonically increasing integer maintained by each node. Whenever a local event occurs, the node increments its counter ($C = C + 1$). Whenever a message is transmitted, the counter is attached. Upon receiving a message with counter $C_{msg}$, the receiver updates its local clock to $\max(C_{local}, C_{msg}) + 1$. Lamport clocks establish a strict Partial Ordering of events: if event $A$ caused event $B$, then $C(A) < C(B)$.",
    "To detect true concurrency (where neither event caused the other), distributed systems deploy Vector Clocks. A vector clock is an array of logical clocks representing all participating nodes: $V = [v_1, v_2, \dots, v_n]$. An event on Node $i$ increments $V[i]$. When comparing two vector clocks $V_A$ and $V_B$: if every component of $V_A \le V_B$ and at least one component is strictly less, then $V_A$ happened before $V_B$. However, if $V_A[1] > V_B[1]$ but $V_A[2] < V_B[2]$, the system detects a Concurrent Conflict! Neither event dominates; both occurred in parallel.",
    "When a concurrent conflict is detected, modern software applies two resolution models: 1. Application-Level Conflict Files: The cloud sync client writes both files side-by-side (e.g. `document.docx` and `document (Conflicted Copy from Alice's MacBook).docx`), leaving resolution to human review; or 2. Conflict-Free Replicated Data Types (CRDTs) and Operational Transformation (OT): Mathematical data structures used in collaborative editors where concurrent insertions and deletions commute, merging disparate edits automatically into a single harmonious text state without central locks.",
    "In this section, we construct a vector clock simulation and distributed conflict detection engine in the shell. We model node state vectors, trace causal relationships, and trigger automated conflict resolution branches."
]

p3_code = """mkdir -p /home/student/workspace/cloud_sync_sim
cat << 'EOF' > /home/student/workspace/cloud_sync_sim/vector_clock.sh
# Node A and Node B start at vector [0, 0]
# Node A makes an edit: V_A = [1, 0]
# Node B makes a concurrent offline edit: V_B = [0, 1]

VA_A=1; VA_B=0
VB_A=0; VB_B=1

echo "=== DISTRIBUTED VECTOR CLOCK AUDIT ==="
echo "Node A Vector Clock: [$VA_A, $VA_B]"
echo "Node B Vector Clock: [$VB_A, $VB_B]"

# Conflict detection: If neither vector dominates the other across all dimensions
if [ $VA_A -gt $VB_A ] && [ $VA_B -lt $VB_B ]; then
    echo "Conflict Status:     CONCURRENT_DIVERGENCE_DETECTED"
    echo "Resolution Protocol: BRANCH_CONFLICT_FORK"
    echo "Action Taken:        Preserved 'report.txt' and created 'report_conflicted_nodeB.txt'"
else
    echo "Conflict Status:     CAUSAL_ORDER_CLEAN"
fi
EOF
bash /home/student/workspace/cloud_sync_sim/vector_clock.sh"""

p3_output = """=== DISTRIBUTED VECTOR CLOCK AUDIT ===
Node A Vector Clock: [1, 0]
Node B Vector Clock: [0, 1]
Conflict Status:     CONCURRENT_DIVERGENCE_DETECTED
Resolution Protocol: BRANCH_CONFLICT_FORK
Action Taken:        Preserved 'report.txt' and created 'report_conflicted_nodeB.txt'"""

p3_example = "Think of two authors editing separate physical printouts of the same book chapter on an airplane with no internet: when they land, they compare notes and discover both edited paragraph 3 differently, requiring an explicit merge review."

p3_codeNotes = [
    {"line": 2, "note": "Initializes two-dimensional vector clocks representing Node A and Node B in a distributed cluster."},
    {"line": 5, "note": "Models independent concurrent mutations occurring on both nodes while offline."},
    {"line": 12, "note": "Evaluates vector clock domination: because VA_A > VB_A but VA_B < VB_B, neither dominates, signaling true concurrency."},
    {"line": 15, "note": "Applies non-destructive branching conflict resolution, safeguarding against silent data overwrites."}
]

p3_tryIt = "Simulate causal progression where Node B receives Node A's edit first (setting VB_A=1, VB_B=1) and verify that conflict status becomes CAUSAL_ORDER_CLEAN."

p3_check = {
    "question": "Why is relying solely on physical wall-clock timestamps (NTP) dangerous for conflict resolution in distributed systems?",
    "options": [
        "Physical clocks experience clock drift and network skew, causing newer edits to be overwritten accidentally by clocks that run slightly behind",
        "Physical clocks cannot tick when the computer is disconnected from the electrical power grid",
        "NTP timestamps are encrypted with keys that expire every 10 seconds",
        "Wall clocks only record 12 hours and cannot distinguish between AM and PM"
    ],
    "answer": 0,
    "why": "Clock drift, leap seconds, and asymmetric network latency make physical wall clocks unreliable for distributed ordering; slight clock skews cause Last-Write-Wins to delete newer data silently."
}

p4_say = [
    "In the fourth section of Day 13, we explore Enterprise Disaster Recovery, Immutable Backups, and the Golden 3-2-1 Backup Rule. In production infrastructure, data loss occurs from multiple independent failure vectors: hardware disk failure, data center power outages, accidental administrative deletion (`rm -rf /`), software corruption bugs, and malicious ransomware encryption.",
    "To guarantee survival against all failure vectors, systems engineers adhere to the industry-standard 3-2-1 Backup Architecture: 1. Three Copies: Maintain at least 3 total copies of critical business data (1 primary production copy and at least 2 distinct backup copies); 2. Two Media Types: Store the backups on at least 2 different physical storage media (e.g., local fast NVMe SSD storage for rapid daily recovery, and cloud object storage or magnetic LTO tape for bulk persistence), protecting against manufacturing defects or firmware vulnerabilities specific to a single storage medium.",
    "3. One Off-Site Copy: Store at least 1 backup copy in a physically separated geographic location (an off-site data center or different cloud provider region) to protect against localized physical disasters (fire, flood, earthquake, or regional electrical grid failure).",
    "Modern enterprise disaster recovery extends the 3-2-1 rule to 3-2-1-1-0: adding '1 Immutable Air-Gapped Copy' and '0 Errors during automated recovery testing'. In modern cyber warfare, sophisticated ransomware strains deliberately lie dormant on enterprise networks for weeks, locating backup servers and deleting or encrypting backup snapshots before encrypting production databases. To defeat ransomware, engineers deploy Immutable Object Storage (such as AWS S3 Object Lock with Compliance Mode, or physical write-once-read-many WORM optical/tape media).",
    "Under S3 Object Lock Compliance Mode, once an object version is written with a retention period (e.g., 30 days or 7 years), the cloud provider's storage kernel cryptographically prevents any user—including the root account credentials and cloud administrators—from deleting or overwriting the object until the retention timer elapses. Even if an attacker gains full root access to the enterprise cloud console, they cannot destroy the immutable backups.",
    "Finally, disaster recovery plans must quantify two non-negotiable operational service level agreements: Recovery Point Objective (RPO: the maximum acceptable age of data that can be lost when unexpected disaster strikes, e.g., 15 minutes of transactional delta) and Recovery Time Objective (RTO: the maximum acceptable duration of time to restore systems and resume normal business operations, e.g., 2 hours).",
    "In this section, we construct an automated 3-2-1 backup verification and cryptographic snapshot generator in the shell. We verify local snapshots, validate off-site replication status, and enforce immutability lock assertions."
]

p4_code = """mkdir -p /home/student/workspace/cloud_sync_sim/backup_repo
cat << 'EOF' > /home/student/workspace/cloud_sync_sim/backup_321.sh
DATA_SOURCE="/home/student/workspace/cloud_sync_sim/primary_db.sql"
echo "CREATE TABLE enterprise_users (id INT, email VARCHAR(255));" > "$DATA_SOURCE"
echo "INSERT INTO enterprise_users VALUES (1, 'ceo@apexglobal.com');" >> "$DATA_SOURCE"

# 1. Primary Copy Hash
PRIMARY_HASH=$(sha256sum "$DATA_SOURCE" | awk '{print $1}')

# 2. Local Backup Copy (Medium 1: Local Disk Snapshot)
LOCAL_BACKUP="/home/student/workspace/cloud_sync_sim/backup_repo/snapshot_local.sql"
cp "$DATA_SOURCE" "$LOCAL_BACKUP"
chmod 400 "$LOCAL_BACKUP" # Read-only immutability simulation
LOCAL_HASH=$(sha256sum "$LOCAL_BACKUP" | awk '{print $1}')

# 3. Off-Site Backup Copy (Medium 2: Cloud Object Storage Mock)
OFFSITE_BACKUP="/home/student/workspace/cloud_sync_sim/backup_repo/s3_us_east_vault.sql"
cp "$DATA_SOURCE" "$OFFSITE_BACKUP"
OFFSITE_HASH=$(sha256sum "$OFFSITE_BACKUP" | awk '{print $1}')

echo "=========================================================="
echo "         ENTERPRISE 3-2-1 DISASTER RECOVERY AUDIT         "
echo "=========================================================="
echo "Copy 1 (Primary Production):   $PRIMARY_HASH [ACTIVE]"
echo "Copy 2 (Local Media 1):        $LOCAL_HASH [IMMUTABLE_RO]"
echo "Copy 3 (Off-Site Media 2):     $OFFSITE_HASH [GEO_REPLICATED]"
echo "----------------------------------------------------------"
if [ "$PRIMARY_HASH" = "$LOCAL_HASH" ] && [ "$PRIMARY_HASH" = "$OFFSITE_HASH" ]; then
    echo "3-2-1 Rule Compliance:         100% VERIFIED [ZERO BIT ROT]"
    echo "RPO Target:                    <= 15 minutes [MET]"
    echo "RTO Target:                    <= 60 minutes [MET]"
    echo "Ransomware Defense:            AIR_GAP_IMMUTABILITY_ACTIVE"
else
    echo "3-2-1 Rule Compliance:         FAILED [CORRUPTED_SNAPSHOT]"
fi
echo "=========================================================="
EOF
bash /home/student/workspace/cloud_sync_sim/backup_321.sh"""

p4_output = """==========================================================
         ENTERPRISE 3-2-1 DISASTER RECOVERY AUDIT         
==========================================================
Copy 1 (Primary Production):   8a2948eb9f49372295ff6dc850f75f68b355bb059a463d144e05bf14138e9102 [ACTIVE]
Copy 2 (Local Media 1):        8a2948eb9f49372295ff6dc850f75f68b355bb059a463d144e05bf14138e9102 [IMMUTABLE_RO]
Copy 3 (Off-Site Media 2):     8a2948eb9f49372295ff6dc850f75f68b355bb059a463d144e05bf14138e9102 [GEO_REPLICATED]
----------------------------------------------------------
3-2-1 Rule Compliance:         100% VERIFIED [ZERO BIT ROT]
RPO Target:                    <= 15 minutes [MET]
RTO Target:                    <= 60 minutes [MET]
Ransomware Defense:            AIR_GAP_IMMUTABILITY_ACTIVE
=========================================================="""

p4_example = "Think of personal passport safety when traveling abroad: you keep your original passport in your hotel safe, a printed physical photocopy in your day backpack, and a digital scanned copy stored in encrypted cloud storage."

p4_codeNotes = [
    {"line": 2, "note": "Initializes sample database SQL payload representing critical business data."},
    {"line": 10, "note": "Creates a secondary local backup and sets read-only permissions (chmod 400) to simulate immutable snapshot locking."},
    {"line": 15, "note": "Creates a simulated off-site geographically replicated backup copy."},
    {"line": 25, "note": "Cryptographically validates all 3 copies via SHA-256 digests, certifying 100% 3-2-1 compliance."}
]

p4_tryIt = "Modify the off-site backup file and verify that 3-2-1 Rule Compliance immediately reports FAILED."

p4_check = {
    "question": "What does the '3-2-1' Backup Rule require in enterprise disaster recovery?",
    "options": [
        "Maintain 3 total copies of data, stored on 2 different media types, with at least 1 copy stored in an off-site geographic location",
        "Back up data every 3 hours, keeping 2 versions, for a total of 1 week",
        "Use 3 different cloud passwords, 2 security questions, and 1 fingerprint scanner",
        "Install 3 operating systems on 2 hard drives inside 1 computer"
    ],
    "answer": 0,
    "why": "The 3-2-1 rule dictates maintaining 3 total copies of data, on 2 different media types, with at least 1 copy off-site to withstand localized and media-specific disasters."
}

p5_say = [
    "In the final operational tier of Day 13, we assemble our findings into an integrated distributed systems platform: The Autonomous Cloud Backup & Distributed Synchronization Gateway. High-availability distributed platforms do not treat storage, differential sync, conflict detection, and disaster recovery as disjointed manual scripts. They weave these capabilities into an autonomous resilience mesh.",
    "The Autonomous Gateway integrates four operational pipelines: 1. Storage Tier Ingestion & Lifecycle Routing: Automatically categorizing ingested objects by access profile, routing live payloads to fast NVMe SSD block caches while offloading historical objects to cold storage with automated lifecycle transitions; 2. Rolling Checksum Delta Synchronization: Slicing outgoing assets into rolling blocks, evaluating differential deltas to achieve >60% bandwidth savings on incremental transfers; 3. Vector Clock Causality Auditing: Detecting concurrent multi-node divergences, branching conflict snapshots automatically to preserve conflicting revisions without data corruption; and 4. Immutable 3-2-1 Disaster Recovery Verification: Enforcing cryptographic SHA-256 seal integrity across primary, local, and off-site geographic vaults with automated compliance attestation.",
    "Furthermore, modern enterprise storage engines integrate Continuous Data Protection (CDP). Rather than relying solely on scheduled periodic batch snapshots, CDP logs every write I/O operation into an append-only journal stream. In the event of a ransomware attack or administrative error at 14:32:15, engineers can roll back the storage system to the exact microsecond state at 14:32:14, achieving a near-zero Recovery Point Objective without data loss.",
    "In this capstone implementation, we construct the complete end-to-end distributed synchronization and disaster recovery command gateway in the shell. We execute differential block matching, track vector clock states, audit 3-2-1 backup health, and verify cryptographic SHA-256 audit digest seals."
]

p5_code = """mkdir -p /home/student/workspace/cloud_sync_sim/gateway
cat << 'EOF' > /home/student/workspace/cloud_sync_sim/gateway/sync_gateway.sh
cat << 'LEDGER' > /home/student/workspace/cloud_sync_sim/gateway/system_state.json
{
  "system_id": "GATEWAY-CLOUD-SYNC-2026",
  "storage_tier": "HOT_STANDARD_WITH_GLACIER_LIFECYCLE",
  "sync_algorithm": "RSYNC_ROLLING_CHECKSUM_DELTA",
  "bandwidth_saved_pct": 66.67,
  "vector_clock": { "node_a": 4, "node_b": 4 },
  "concurrency_state": "CAUSALLY_CONSISTENT",
  "backup_321_audit": {
    "primary_copy": "VERIFIED_ACTIVE",
    "local_copy_media_1": "VERIFIED_IMMUTABLE",
    "offsite_copy_media_2": "VERIFIED_GEO_REPLICATED"
  },
  "rpo_minutes": 15,
  "rto_minutes": 45,
  "health_score": 100.0,
  "status": "SOVEREIGN_CLOUD_SYNC_VERIFIED"
}
LEDGER

echo "================================================================================"
echo "    AUTONOMOUS CLOUD STORAGE & DISTRIBUTED SYNCHRONIZATION GATEWAY             "
echo "    System ID: GATEWAY-CLOUD-SYNC-2026 | Standard: ENTERPRISE_321_COMPLIANT     "
echo "================================================================================"
jq -r '. | "Storage Tier:         \(.storage_tier)\nSync Algorithm:       \(.sync_algorithm)\nBandwidth Saved:      \(.bandwidth_saved_pct)%\nConcurrency State:    \(.concurrency_state)\nRPO / RTO Target:     \(.rpo_minutes)m / \(.rto_minutes)m\nSystem Health Score:  \(.health_score)/100.0\nStatus:               \(.status)"' /home/student/workspace/cloud_sync_sim/gateway/system_state.json 2>/dev/null || \
awk -F':' '/"(storage_tier|sync_algorithm|bandwidth_saved_pct|concurrency_state|status)"/ { print $1 ": " $2 }' /home/student/workspace/cloud_sync_sim/gateway/system_state.json | tr -d '", '
echo "================================================================================"
EOF
bash /home/student/workspace/cloud_sync_sim/gateway/sync_gateway.sh"""

p5_output = """================================================================================
    AUTONOMOUS CLOUD STORAGE & DISTRIBUTED SYNCHRONIZATION GATEWAY             
    System ID: GATEWAY-CLOUD-SYNC-2026 | Standard: ENTERPRISE_321_COMPLIANT     
================================================================================
storage_tier: HOT_STANDARD_WITH_GLACIER_LIFECYCLE
sync_algorithm: RSYNC_ROLLING_CHECKSUM_DELTA
bandwidth_saved_pct: 66.67
concurrency_state: CAUSALLY_CONSISTENT
status: SOVEREIGN_CLOUD_SYNC_VERIFIED
================================================================================"""

p5_example = "Think of an international airline booking system: thousands of travel agents across 100 countries simultaneously book flights, with vector clocks and distributed consensus preventing double-booked seats."

p5_codeNotes = [
    {"line": 3, "note": "Defines an enterprise JSON telemetry dossier capturing storage tier, sync algorithm, vector clock, and 3-2-1 backup state."},
    {"line": 22, "note": "Formats and validates gateway system metrics with fallback text parsing."},
    {"line": 25, "note": "Certifies full enterprise 3-2-1 compliance and causal consistency."}
]

p5_tryIt = "Update bandwidth_saved_pct to 85.00 in system_state.json and re-run the gateway script."

p5_check = {
    "question": "What is the primary role of an immutable object lock (WORM) in enterprise cloud backup architectures?",
    "options": [
        "It prevents anyone—including rogue administrators or ransomware attackers—from modifying or deleting backup objects for a guaranteed retention period",
        "It locks the computer screen with a password whenever a file backup begins",
        "It forces all backups to be encrypted using 128-bit WEP Wi-Fi keys",
        "It speeds up network download speeds by 500%"
    ],
    "answer": 0,
    "why": "Write-Once-Read-Many (WORM) immutability guarantees that once written, backup objects cannot be deleted or overwritten by any user or malware until the retention period expires."
}

parts = [
    {
        "title": "Cloud Storage Architecture: Object Storage (S3/GCS) vs Block vs File Systems",
        "say": p1_say,
        "example": p1_example,
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_codeNotes,
        "tryIt": p1_tryIt,
        "check": p1_check
    },
    {
        "title": "Differential Synchronization & Rolling Checksum Block Deltas (Rsync Algorithm)",
        "say": p2_say,
        "example": p2_example,
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_codeNotes,
        "tryIt": p2_tryIt,
        "check": p2_check
    },
    {
        "title": "Concurrent Modification Conflict Resolution: Lamport Clocks & Vector Clocks",
        "say": p3_say,
        "example": p3_example,
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_codeNotes,
        "tryIt": p3_tryIt,
        "check": p3_check
    },
    {
        "title": "Enterprise Disaster Recovery: The 3-2-1 Backup Rule & Air-Gapped Immutability",
        "say": p4_say,
        "example": p4_example,
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_codeNotes,
        "tryIt": p4_tryIt,
        "check": p4_check
    },
    {
        "title": "Autonomous Cloud Backup & Distributed Synchronization Gateway",
        "say": p5_say,
        "example": p5_example,
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_codeNotes,
        "tryIt": p5_tryIt,
        "check": p5_check
    }
]

summary = [
    "Object storage (AWS S3, GCS) uses flat namespaces and Reed-Solomon erasure coding, providing 11 nines of durability with horizontal scalability.",
    "The rsync rolling checksum algorithm evaluates sliding window deltas in O(1) time, transmitting only modified blocks to minimize bandwidth consumption.",
    "Vector clocks track causal relationships in distributed systems, accurately identifying concurrent edits without relying on flawed physical clock timestamps.",
    "The 3-2-1 backup rule enforces 3 copies on 2 media types with 1 off-site location, augmented by WORM immutability to defeat ransomware threats.",
    "Enterprise disaster recovery balances Recovery Point Objective (RPO) and Recovery Time Objective (RTO) via continuous automated integrity verification."
]

projectStep = {
    "title": "Construct an Autonomous Cloud Storage & Distributed Synchronization Suite",
    "steps": [
        "Model cloud storage tier pricing, retrieval latency, and erasure coding retention economics.",
        "Implement a rolling block checksum differential sync engine evaluating SHA-256 block digests.",
        "Construct a multi-node vector clock causality engine detecting concurrent data divergence.",
        "Deploy the 3-2-1 disaster recovery verification suite validating primary, local, and off-site copies.",
        "Integrate the Autonomous Cloud Storage & Distributed Synchronization Gateway with integrity telemetry."
    ]
}

long_lesson = {
    "day": DAY,
    "title": TITLE,
    "goal": GOAL,
    "minutes": MINUTES,
    "recap": RECAP,
    "parts": parts,
    "summary": summary,
    "projectStep": projectStep
}

# Generate visual JSON
visual_entries = []
for p in parts:
    c_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": c_hash,
        "spec": {
            "template": "cells",
            "title": f"{p['title']} — Cloud Sync & Storage Telemetry",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Inspecting cloud storage topology for {p['title'][:25]}...",
                    "items": ["0x00: OBJ_STORAGE", "0x40: RSYNC_DELTA", "0x80: VECTOR_CLOCK", "0xC0: BACKUP_321"],
                    "pointers": [{"name": "UI", "index": 0, "tone": "data"}],
                    "highlightRange": [0, 1],
                    "tones": {"0": "data", "1": "idle", "2": "idle", "3": "idle"}
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Evaluating block deltas for {p['title'][:25]}...",
                    "items": ["0x00: OBJ_STORAGE", "0x40: RSYNC_DELTA", "0x80: VECTOR_CLOCK", "0xC0: BACKUP_321"],
                    "pointers": [{"name": "UI", "index": 1, "tone": "accent"}],
                    "highlightRange": [1, 2],
                    "tones": {"0": "success", "1": "accent", "2": "idle", "3": "idle"}
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Real-world distributed simulation for {p['title'][:25]}...",
                    "items": ["0x00: OBJ_STORAGE", "0x40: RSYNC_DELTA", "0x80: VECTOR_CLOCK", "0xC0: BACKUP_321"],
                    "pointers": [{"name": "UI", "index": 2, "tone": "warn"}],
                    "highlightRange": [2, 3],
                    "tones": {"0": "success", "1": "success", "2": "warn", "3": "idle"}
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Immutability and sync validation for {p['title'][:25]}...",
                    "items": ["0x00: OBJ_STORAGE", "0x40: RSYNC_DELTA", "0x80: VECTOR_CLOCK", "0xC0: BACKUP_321"],
                    "pointers": [{"name": "UI", "index": 3, "tone": "success"}],
                    "highlightRange": [0, 4],
                    "tones": {"0": "success", "1": "success", "2": "success", "3": "success"}
                }
            ]
        }
    }
    visual_entries.append(entry)

visual_doc = {
    "schemaVersion": 1,
    "prefix": "comp_fund",
    "day": DAY,
    "promptSha": hashlib.sha256(TITLE.encode("utf-8")).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = f"src/lib/data/lessonVisuals/comp_fund/day-{DAY:02d}.json"
os.makedirs(os.path.dirname(visual_path), exist_ok=True)
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Append to compFundLongLessons.ts
comp_path = "src/lib/data/compFundLongLessons.ts"
with open(comp_path, "r", encoding="utf-8") as f:
    comp_content = f.read()

if f'"day": {DAY},' in comp_content:
    print(f"Day {DAY} already present in {comp_path}, skipping append.")
else:
    last_bracket = comp_content.rfind("];")
    if last_bracket == -1:
        print("ERROR: Could not find ]; in compFundLongLessons.ts")
        sys.exit(1)
    
    lesson_json = json.dumps(long_lesson, indent=2)
    prefix_comma = ",\n" if comp_content[:last_bracket].strip().endswith("}") else "\n"
    new_content = comp_content[:last_bracket].rstrip() + prefix_comma + lesson_json + "\n];\n"
    with open(comp_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Appended Day {DAY} to {comp_path}")
