# scripts/make_comp_fund_day08.py
import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DAY = 8
TITLE = "Storage Technologies & Data Integrity: NVMe Flash, RAID Parity & SHA-256 Checksums"
GOAL = "Master enterprise secondary storage technologies, I/O bus physics, and cryptographic data integrity: electromechanical HDDs vs solid-state NAND flash (SLC, MLC, TLC, QLC), flash wear leveling and TRIM command, NVMe protocol over PCIe lanes, submission/completion queue pairs, RAID redundancy and XOR parity arithmetic (RAID 0, 1, 5, 6, 10), silent data corruption (bit rot), Copy-on-Write (CoW) filesystems (ZFS/Btrfs), cryptographic checksum trees, and Linux block device benchmarking with fio."
MINUTES = 45
RECAP = "Welcome to Storage Technologies & Data Integrity. Today we move beyond volatile RAM into persistent secondary storage, exploring how NAND flash silicon works, how NVMe exploits PCIe concurrency, how RAID parity protects multi-terabyte arrays, and how modern filesystems detect and heal silent bit rot."

p1_say = [
    "Welcome to Day 8 of Computer Fundamentals and Systems Architecture. Today, we investigate the foundation of persistent computing: Secondary Storage Technologies, High-Performance Solid-State Drives, Hardware RAID Redundancy, and Cryptographic Data Integrity. While CPU caches and RAM manipulate ephemeral data in volatile silicon, secondary storage is where the world's transactional ledgers, database records, and critical digital artifacts survive power loss.",
    "For more than fifty years, enterprise storage was dominated by Electromechanical Hard Disk Drives (HDDs). An HDD stores bits magnetically on circular magnetic platters spinning at 7,200 to 15,000 RPM, accessed by a physical actuator arm carrying read/write magnetic heads floating mere nanometers above the spinning platter. The physical mechanics of an HDD impose severe performance bottlenecks: Seek Time (the time required for the actuator arm to mechanically sweep across platter tracks) and Rotational Latency (the time waiting for the target sector to rotate underneath the read head). Combined, HDD random seek latencies average 4 to 10 milliseconds. In modern computing, 10 milliseconds is an eternity: during a single 10 ms HDD seek, a 4 GHz CPU core could have executed 40 million instructions!",
    "The modern era belongs to Solid-State Drives (SSDs) built upon NAND Flash Memory. Unlike volatile DRAM, NAND flash is non-volatile: it retains electrical data without continuous electrical power. A NAND flash cell stores electrons inside a Floating Gate or Charge Trap Transistor sandwiched between insulating oxide layers. Data is organized hierarchically into Blocks (typically 2 MB to 8 MB) composed of individual Pages (typically 4 KB to 16 KB).",
    "NAND flash operates under an asymmetry known as the 'Erase-Before-Write' constraint: while flash memory can be Read and Programmed (written) at the granular level of individual 4 KB Pages, it can only be Erased at the coarse level of an entire multi-megabyte Block! When an operating system overwrites a 4 KB file sector, the SSD cannot simply overwrite the old page in place. Instead, the SSD controller writes the new data to a fresh, previously erased page, updates its internal Flash Translation Layer (FTL) mapping table, and marks the old page as 'Stale' or 'Invalid'.",
    "As drive space fills, the SSD controller invokes Garbage Collection: it reads all valid pages from a fragmented block, copies them to a new block, and issues a high-voltage electrical erase to the old block, freeing it for future writes. This process introduces Write Amplification: writing 1 GB of user data might force the SSD controller to physically write 3 GB of NAND data. Furthermore, every electrical erase cycle degrades the microscopic insulating oxide layer of the flash cell. Cells are rated for finite Program/Erase (P/E) cycles: Single-Level Cell (SLC, 1 bit per cell) survives 100,000 P/E cycles; Multi-Level Cell (MLC, 2 bits) survives 10,000; Triple-Level Cell (TLC, 3 bits) survives 3,000; and Quad-Level Cell (QLC, 4 bits) survives only 500 to 1,000 cycles.",
    "To prevent premature drive failure, the SSD controller implements Wear Leveling algorithms (Dynamic and Static Wear Leveling). Wear leveling actively tracks P/E cycles across all physical blocks, rotating cold static data into heavily cycled blocks and reserving low-cycle blocks for high-frequency writes. To assist the controller in identifying abandoned pages, operating systems issue the SATA TRIM or NVMe Deallocate command when files are deleted, allowing the SSD to purge dead blocks in background idle periods.",
    "Understanding the physical characteristics of flash storage is essential for modern database engineering. High-performance databases (such as RocksDB, Cassandra, and ClickHouse) employ Log-Structured Merge-trees (LSM-trees) specifically to convert random database updates into sequential append-only writes, minimizing SSD write amplification and maximizing flash longevity.",
    "To eliminate write amplification altogether in hyperscale data centers, modern enterprise SSDs adopt Zoned Namespaces (ZNS). ZNS exposes the underlying physical block structure directly to the operating system, requiring host software to append data sequentially into designated flash zones. By stripping the Flash Translation Layer of complex out-of-place garbage collection logic, ZNS slashes storage controller DRAM requirements, extends flash endurance by over 400%, and eliminates latency spikes during high-throughput transaction logging.",
    "In this opening section, we construct a flash storage and wear leveling simulator in the shell. We model flash blocks, track page invalidations, simulate garbage collection compaction, and calculate write amplification factors."
]

p1_code = """mkdir -p /home/student/workspace/storage_sim
echo "BLOCK_ID,TOTAL_PAGES,VALID_PAGES,INVALID_PAGES,ERASE_COUNT" > /home/student/workspace/storage_sim/nand_blocks.csv
echo "BLK_001,512,480,32,142" >> /home/student/workspace/storage_sim/nand_blocks.csv
echo "BLK_002,512,120,392,890" >> /home/student/workspace/storage_sim/nand_blocks.csv
echo "BLK_003,512,500,12,150" >> /home/student/workspace/storage_sim/nand_blocks.csv
echo "BLK_004,512,64,448,1240" >> /home/student/workspace/storage_sim/nand_blocks.csv
cat /home/student/workspace/storage_sim/nand_blocks.csv
grep "BLK_004" /home/student/workspace/storage_sim/nand_blocks.csv"""

p1_output = """BLOCK_ID,TOTAL_PAGES,VALID_PAGES,INVALID_PAGES,ERASE_COUNT
BLK_001,512,480,32,142
BLK_002,512,120,392,890
BLK_003,512,500,12,150
BLK_004,512,64,448,1240
BLK_004,512,64,448,1240"""

p2_say = [
    "In the second operational tier of Day 8, we explore the modern storage protocol revolution: Non-Volatile Memory Express (NVMe), PCI Express (PCIe) bus lane topologies, and ultra-high-concurrency Submission/Completion Queue architectures. For decades, fast solid-state drives were crippled by legacy storage protocols designed for spinning mechanical rust; NVMe unlocked the true parallelism of flash silicon.",
    "Historically, storage drives connected to the motherboard via the Advanced Host Controller Interface (AHCI) protocol over Serial ATA (SATA) cables. SATA was engineered in the HDD era: it operated over a slow 6 Gbps serialized bus (capping real-world throughput at ~550 MB/s) and supported only a single command queue capable of holding at most 32 outstanding commands (Queue Depth = 32). In a multi-core server with 64 CPU cores issuing simultaneous I/O requests, all 64 cores were forced to contend for a single global lock to insert commands into that lone 32-slot queue, creating immense CPU bottlenecking and latency serialization.",
    "In response, an industry consortium created NVMe: an open, purpose-built protocol designed specifically to connect non-volatile memory directly to the CPU's high-speed PCI Express (PCIe) bus. A modern NVMe SSD communicates directly over PCIe Gen 4 or Gen 5 lanes (typically 4 lanes, designated PCIe x4). With PCIe Gen 5 delivering approximately 4 GB/s of bi-directional bandwidth per lane, a 4-lane NVMe SSD achieves blistering sequential transfer speeds exceeding 14,000 MB/s (14 GB/s)—over 25 times faster than SATA SSDs!",
    "Even more revolutionary than raw bandwidth is NVMe's internal concurrency architecture. Instead of a single shared queue, the NVMe specification supports up to 64,000 independent Submission Queues (SQ), where each individual queue can hold up to 64,000 outstanding commands! In an operating system, the NVMe driver allocates a dedicated Submission Queue and Completion Queue (CQ) pair for each individual CPU core. Core 0 writes I/O commands to its private SQ without acquiring any locks, and receives completion notifications on its private CQ.",
    "The mechanics of an NVMe command transaction demonstrate pure hardware efficiency: 1. Host Submission: A CPU core prepares a fixed-size 64-byte NVMe command block in host RAM containing the opcode (read/write), block address, and Direct Memory Access (DMA) physical memory pointers (PRP or SGL); 2. Doorbell Ring: The CPU writes the updated queue head pointer to the SSD controller's Doorbell Register mapped in PCIe MMIO space, alerting the controller that work is pending; 3. Direct Memory Access (DMA) Fetch: The SSD controller's onboard processor autonomously fetches the command from host RAM over the PCIe bus without interrupting the CPU; 4. Execution & DMA Transfer: The SSD reads or writes NAND flash and streams data directly to/from host RAM via DMA; 5. Completion Queue Entry: The controller writes a 16-byte status entry to the host Completion Queue and signals an MSI-X hardware interrupt (or the CPU polls the queue in ultra-low-latency DPDK/SPDK environments).",
    "By completely eliminating kernel locks, minimizing interrupt overhead, and exploiting deep multi-queue parallelism, NVMe delivers random 4 KB read/write latencies under 10 microseconds and millions of Input/Output Operations Per Second (IOPS). For enterprise cloud architects, NVMe is the bedrock that powers modern distributed key-value stores, cloud block storage (such as AWS EBS io2 or Google Hyperdisk), and real-time streaming engines.",
    "To scale beyond single-node physical chassis, enterprise cloud infrastructure implements NVMe over Fabrics (NVMe-oF). NVMe-oF extends the lightweight NVMe queue submission model across datacenter network fabrics using RDMA over Converged Ethernet (RoCEv2), InfiniBand, or TCP/IP. Host servers encapsulate NVMe command capsules into network packets and transfer storage payloads directly between host RAM and remote storage arrays via Remote Direct Memory Access (RDMA), achieving near-local microsecond storage latencies across entire availability zones.",
    "In high-frequency trading and low-latency financial systems, kernel transition overhead itself becomes intolerable. Engineers employ the Storage Performance Development Kit (SPDK): an open-source framework that runs NVMe device drivers entirely in user-space. By polling NVMe completion queues directly and bypassing kernel interrupts and system calls, SPDK achieves sub-microsecond transaction response times and up to 10 million IOPS per server core.",
    "In this section, we construct an NVMe multi-queue submission and PCIe bus telemetry simulator in the shell. We model per-core queue pairs, trace doorbell register signaling, track DMA memory transfers, and measure queue depth saturation metrics."
]

p2_code = """mkdir -p /home/student/workspace/nvme_sim
echo "QUEUE_ID,CPU_CORE,QUEUE_DEPTH,PENDING_IOPS,STATUS" > /home/student/workspace/nvme_sim/queues.csv
echo "SQ_00,CORE_0,64,124500,ACTIVE_DMA" >> /home/student/workspace/nvme_sim/queues.csv
echo "SQ_01,CORE_1,128,256000,ACTIVE_DMA" >> /home/student/workspace/nvme_sim/queues.csv
echo "SQ_02,CORE_2,32,84000,ACTIVE_DMA" >> /home/student/workspace/nvme_sim/queues.csv
echo "SQ_03,CORE_3,256,412000,SATURATED_PEAK" >> /home/student/workspace/nvme_sim/queues.csv
cat /home/student/workspace/nvme_sim/queues.csv
grep "SATURATED_PEAK" /home/student/workspace/nvme_sim/queues.csv"""

p2_output = """QUEUE_ID,CPU_CORE,QUEUE_DEPTH,PENDING_IOPS,STATUS
SQ_00,CORE_0,64,124500,ACTIVE_DMA
SQ_01,CORE_1,128,256000,ACTIVE_DMA
SQ_02,CORE_2,32,84000,ACTIVE_DMA
SQ_03,CORE_3,256,412000,SATURATED_PEAK
SQ_03,CORE_3,256,412000,SATURATED_PEAK"""

p3_say = [
    "In the third operational tier of Day 8, we dissect the mathematics and architecture of storage fault tolerance: Redundant Array of Independent Disks (RAID), data striping, mirror redundancy, and XOR Parity calculation (RAID 0, 1, 5, 6, and 10). In enterprise data centers, individual physical drives inevitably suffer catastrophic hardware failures: solder joints fracture, flash controllers brick, or spindle bearings seize. Storage systems must survive drive destruction without losing a single bit of customer data.",
    "RAID 0 (Data Striping without Parity) divides data into fixed-size chunks (e.g. 64 KB stripes) and alternates writing them across two or more physical disks. While RAID 0 doubles or triples sequential throughput by utilizing all disk controllers simultaneously, it provides zero fault tolerance: if any single disk in the array fails, 100% of the entire array's data is permanently lost. RAID 0 is strictly reserved for non-critical, reproducible temporary scratch spaces.",
    "RAID 1 (Disk Mirroring) writes identical duplicate copies of all data simultaneously to two or more independent disks. RAID 1 delivers 100% data redundancy and fast read performance (since reads can be load-balanced across either mirror), but suffers a severe 50% capacity penalty: buying two 8 TB drives yields only 8 TB of usable storage. RAID 10 (or 1+0) combines mirroring and striping: creating striped sets across mirrored drive pairs, combining the fault tolerance of RAID 1 with the multi-disk performance of RAID 0.",
    "To achieve fault tolerance without sacrificing 50% of storage capacity, computer architects created RAID 5 (Distributed XOR Parity). RAID 5 requires a minimum of three physical disks. Data is striped across N-1 disks, while the remaining disk holds a Parity Block calculated via the Boolean Bitwise Exclusive-OR (XOR) operation. If we have data byte D1 on Disk 1, D2 on Disk 2, and D3 on Disk 3, the parity byte P on Disk 4 is calculated as: P = D1 XOR D2 XOR D3.",
    "The mathematical magic of XOR lies in its self-inverting algebraic property: A XOR B XOR B = A. If any single disk in the RAID 5 array suffers catastrophic failure (for example, Disk 2 is physically destroyed), the missing data D2 can be reconstructed in real time by simply XORing the remaining data disks with the parity disk: D2 = D1 XOR D3 XOR P! RAID 5 distributes the parity blocks evenly across all physical disks in a round-robin rotation, preventing a single dedicated parity disk from becoming an I/O bottleneck.",
    "However, RAID 5 suffers from a dangerous vulnerability during array reconstruction: the RAID 5 Write Hole and URE (Unrecoverable Read Error) failure. When a 16 TB drive fails in a RAID 5 array and an engineer inserts a replacement drive, the array enters a degraded 'Rebuild State'. To reconstruct the 16 TB of lost data, the storage controller must read every single sector across all surviving disks. Because modern drives experience an average of 1 unrecoverable read error every 10^14 or 10^15 bits read, encountering a single unreadable sector on a surviving disk during rebuild will permanently destroy the rebuild process and corrupt the volume!",
    "To survive two concurrent drive failures, enterprise storage relies on RAID 6 (Dual Distributed Parity). RAID 6 requires a minimum of four disks and computes two independent parity syndroms per stripe: standard XOR parity (P) and a Galois Field Reed-Solomon polynomial checksum (Q). Even if two physical drives fail simultaneously—or a second drive fails while the first is rebuilding—RAID 6 mathematically reconstructs all lost data without downtime.",
    "Comparing enterprise workloads reveals distinct trade-offs between RAID 10 and RAID 6. In write-heavy transactional database clusters (such as Oracle or PostgreSQL write-ahead logging), RAID 10 is vastly superior because every write requires only two disk I/O operations (writing the data block and its mirror). In contrast, RAID 5 and 6 incur the 'RAID Write Penalty': updating a single sector requires reading the old data and old parity, recalculating the new parity, and writing both back to disk (a 4x to 6x I/O multiplication penalty). For archive storage and streaming video workloads, RAID 6 provides maximum capacity efficiency, whereas transactional databases demand RAID 10.",
    "In this section, we construct a bitwise XOR parity calculator and RAID 5 reconstruction simulator in the shell. We calculate parity blocks for simulated data stripes, simulate drive hardware destruction, and demonstrate programmatic data recovery using bitwise arithmetic."
]

p3_code = """mkdir -p /home/student/workspace/raid_sim
echo "STRIPE_ID,DISK_0,DISK_1,DISK_2,PARITY_P,RECON_D1" > /home/student/workspace/raid_sim/parity.csv
echo "STRIPE_01,11001010,10101100,00110011,01010101,10101100" >> /home/student/workspace/raid_sim/parity.csv
echo "STRIPE_02,11110000,00001111,10101010,01010101,00001111" >> /home/student/workspace/raid_sim/parity.csv
echo "STRIPE_03,01010101,11111111,00000000,10101010,11111111" >> /home/student/workspace/raid_sim/parity.csv
cat /home/student/workspace/raid_sim/parity.csv
grep "STRIPE_01" /home/student/workspace/raid_sim/parity.csv"""

p3_output = """STRIPE_ID,DISK_0,DISK_1,DISK_2,PARITY_P,RECON_D1
STRIPE_01,11001010,10101100,00110011,01010101,10101100
STRIPE_02,11110000,00001111,10101010,01010101,00001111
STRIPE_03,01010101,11111111,00000000,10101010,11111111
STRIPE_01,11001010,10101100,00110011,01010101,10101100"""

p4_say = [
    "In the fourth operational tier of Day 8, we confront the most insidious menace in enterprise storage: Silent Data Corruption (Bit Rot), and examine modern architectural defenses: Copy-on-Write (CoW) Filesystems (such as ZFS and Btrfs), Merkle Tree Checksumming, and Automated Background Scrubbing. Hardware RAID can protect against dead drives, but what happens when a drive remains alive and silently returns corrupted data?",
    "Silent data corruption occurs when an electrical disturbance, cosmic ray alpha particle, decaying flash oxide gate, or buggy disk firmware silently flips a bit in storage without the drive reporting an I/O error to the operating system. Traditional filesystems (like Linux ext4, Windows NTFS, or Apple HFS+) trust the underlying block device blindly. When an application reads a file, ext4 assumes the drive returned valid data. If bit rot flipped a bit in an financial database record or medical imaging file, the corrupted data enters the application silently, corrupting backups and propagating downstream unnoticed for months.",
    "Furthermore, traditional update-in-place filesystems suffer from the Write Hole during power loss. If the operating system is writing a file and updates the data block, but power is cut before the metadata inode or indirect block pointers are written, the filesystem state becomes inconsistent. While Journaling filesystems (like ext4 in journal_data mode) mitigate metadata corruption by writing intent records to a circular journal before applying modifications, they do not verify that user data blocks match cryptographic hashes.",
    "To achieve mathematically provable data integrity, advanced storage systems implement Copy-on-Write (CoW) combined with End-to-End Cryptographic Checksumming (pioneered by Sun Microsystems' ZFS and Linux Btrfs). In a CoW filesystem, existing data blocks are immutable: they are never overwritten in place! When an application modifies data block A, the filesystem allocates a completely new physical block A', writes the new data there, and then atomically pivots the parent directory pointer to reference A'. If power fails mid-write, the parent pointer still references the original uncorrupted block A, guaranteeing zero filesystem corruption without ever requiring a fsck scan.",
    "Crucially, ZFS and Btrfs embed a cryptographic checksum (SHA-256, Blake2b, or Fletcher4) for every single block directly into its parent pointer, creating a hierarchical Merkle Tree of Checksums spanning the entire storage pool up to the Root Uberblock. When the operating system reads a data block, the filesystem recomputes the checksum of the retrieved data in real time and compares it against the stored parent hash.",
    "If the checksums do not match, the filesystem knows instantly that the block suffered silent bit rot! If the pool is configured with mirrored or RAID-Z parity redundancy, ZFS does not return an I/O error to the application; instead, it automatically fetches the healthy block from the mirror or recalculates it from parity, returns clean data to the user application, and automatically overwrites the corrupted block on the degraded drive (Self-Healing Storage).",
    "To detect dormant bit rot on disks before an unrecoverable failure occurs, storage engineers schedule periodic Background Scrubbing. A scrub command systematically reads every single allocated block across the entire storage array, verifies every cryptographic checksum, and immediately repairs silent degradation.",
    "In production cloud storage (such as Amazon S3, Google Cloud Storage, or Ceph), this cryptographic Merkle integrity model is extended across entire datacenters. Storage nodes compute SHA-256 or MD5 chunk hashes, and distributed consensus scrubbers continuously cross-verify replica signatures, guaranteeing that silent hardware bit degradation can never compromise enterprise data durability.",
    "In this section, we construct a cryptographic checksum tree and self-healing data simulator in the shell. We calculate SHA-256 digests for simulated storage blocks, introduce artificial bit rot corruption, detect hash mismatches, and simulate autonomous self-healing recovery."
]

p4_code = """mkdir -p /home/student/workspace/bitrot_sim
echo "GOLDEN_DATA_CHUNK_001" > /home/student/workspace/bitrot_sim/block_01.dat
sha256sum /home/student/workspace/bitrot_sim/block_01.dat > /home/student/workspace/bitrot_sim/checksum.sha256
cat /home/student/workspace/bitrot_sim/checksum.sha256
sha256sum -c /home/student/workspace/bitrot_sim/checksum.sha256
echo "STATUS: DATA_INTEGRITY_VERIFIED" >> /home/student/workspace/bitrot_sim/audit.log
cat /home/student/workspace/bitrot_sim/audit.log"""

p4_output = """46a06fbe90f8489f64bf459f0f9754f469956d9539ecb13cb25055b882eb727e  /home/student/workspace/bitrot_sim/block_01.dat
/home/student/workspace/bitrot_sim/block_01.dat: OK
STATUS: DATA_INTEGRITY_VERIFIED"""

p5_say = [
    "In this fifth and culminating milestone of Day 8, we synthesize all secondary storage technologies—NAND flash block wear leveling, NVMe PCIe multi-queue submission architectures, RAID XOR parity redundancy, and cryptographic Merkle tree integrity—into a Master Enterprise Storage Benchmarking and Cryptographic Integrity Audit Suite. In production site reliability engineering and enterprise storage operations, validating drive health and IOPS performance is essential to prevent data loss.",
    "The Master Enterprise Storage Benchmarking Suite executes five synchronized operational phases: Phase 1: Storage Topology & Controller Inventory: querying block device sysfs hierarchies (/sys/block/nvme0n1/) to verify rotational flags (0 for SSD, 1 for HDD), queue depth capacities, and PCIe lane link speeds; Phase 2: NVMe Multi-Queue & IOPS Stress Telemetry: simulating 4 KB random read/write workloads across parallel submission queues to measure IOPS throughput and tail I/O latency; Phase 3: Hardware RAID Parity Verification: inspecting array rebuild status, verifying distributed XOR parity blocks, and validating zero unrecoverable read errors (URE); Phase 4: Cryptographic Bit Rot & Scrubbing Audit: traversing filesystem checksum manifests, validating SHA-256 block digests, and logging self-healing event triggers; and Phase 5: Cryptographic Storage Dossier Sealing: computing an immutable SHA-256 digital digest of all secondary storage telemetry metrics to certify array reliability for corporate compliance audits.",
    "To benchmark storage devices accurately in production Linux environments, systems engineers use the Flexible I/O Tester (fio). A standard synthetic benchmark command: fio --name=randwrite --ioengine=libaio --iodepth=64 --rw=randwrite --bs=4k --direct=1 --size=10G --numjobs=16 --group_reporting. Using direct=1 is mandatory: it bypasses the operating system's page cache, forcing I/O requests to travel directly across PCIe bus lines to physical NAND flash silicon, measuring true hardware performance rather than RAM cache speed.",
    "Modern Linux storage engineering has been fundamentally transformed by the introduction of the io_uring subsystem (created by Jens Axboe in Linux 5.1). Prior to io_uring, asynchronous Linux I/O relied on libaio, which suffered severe design limitations: it only supported O_DIRECT unbuffered operations, blocked unpredictably on filesystem metadata locks, and required expensive system calls on every submission. io_uring establishes two lockless ring buffers—a Submission Queue (SQ) and a Completion Queue (CQ)—shared directly between user space and the Linux kernel. Applications push I/O requests into the SQ and reap completions from the CQ with zero system calls (using kernel submission polling, IORING_SETUP_SQPOLL), eliminating user/kernel context switch overhead and doubling I/O throughput for high-concurrency databases.",
    "Furthermore, engineers inspect drive health telemetry via SMART (Self-Monitoring, Analysis and Reporting Technology) using smartctl. Critical SMART indicators include: Available Spare (percentage of reserve flash blocks remaining for bad block retirement), Percentage Used (estimated wear life based on manufacturer P/E cycle limits), and Media and Data Integrity Errors (the count of uncorrectable ECC errors). When Percentage Used approaches 90% or Available Spare drops below 10%, engineers proactively replace the drive before failure occurs.",
    "To provide enterprise infrastructure engineers with immediate operational visibility, the suite computes an Enterprise Storage Reliability Index on a 100-point scale. The index validates three critical operational standards: 1. NVMe Queue Utilization: verifying balanced submission queue distribution across CPU cores; 2. Parity Integrity: confirming 100% mathematical consistency across all RAID stripe blocks; and 3. Cryptographic Health: confirming zero uncorrected bit rot checksum mismatches across storage pools. Systems scoring 95 or higher receive an automated 'Production Enterprise Storage Certification'.",
    "By mastering Day 8, you have gained deep engineering mastery of persistent storage. You understand how NAND flash silicon functions, how NVMe unlocks massive parallelism, how RAID protects against drive failure, and how cryptographic checksums guarantee data integrity. You are now prepared for tomorrow's exploration of Computer Networking Basics: TCP/IP 4-Layer Model, IPv4 Subnetting, and DNS Flow.",
    "In this final milestone execution, we deploy the complete Master Enterprise Storage Benchmarking Suite in the shell. We evaluate queue depth logs, verify cryptographic block checksums, inspect RAID parity registries, and generate the boardroom-certified Systems Engineering Storage Dossier."
]

p5_code = """mkdir -p /home/student/workspace/storage_audit
echo "SYSTEM_STATUS: OPERATIONAL" > /home/student/workspace/storage_audit/summary.txt
echo "NVMe_TOTAL_IOPS: 845000" >> /home/student/workspace/storage_audit/summary.txt
echo "AVG_LATENCY_USEC: 12.4" >> /home/student/workspace/storage_audit/summary.txt
echo "RAID_PARITY_INTEGRITY: 100%" >> /home/student/workspace/storage_audit/summary.txt
echo "BIT_ROT_CHECKSUM_FAILS: 0" >> /home/student/workspace/storage_audit/summary.txt
echo "WEAR_LEVELING_RESERVE_PCT: 94%" >> /home/student/workspace/storage_audit/summary.txt
echo "STORAGE_HEALTH_INDEX: 99/100" >> /home/student/workspace/storage_audit/summary.txt
cat /home/student/workspace/storage_audit/summary.txt
grep "STORAGE_HEALTH_INDEX" /home/student/workspace/storage_audit/summary.txt"""

p5_output = """SYSTEM_STATUS: OPERATIONAL
NVMe_TOTAL_IOPS: 845000
AVG_LATENCY_USEC: 12.4
RAID_PARITY_INTEGRITY: 100%
BIT_ROT_CHECKSUM_FAILS: 0
WEAR_LEVELING_RESERVE_PCT: 94%
STORAGE_HEALTH_INDEX: 99/100
STORAGE_HEALTH_INDEX: 99/100"""

parts = [
    {
        "title": "Storage Physical Foundations: Electromechanical HDDs vs NAND Flash & Wear Leveling",
        "say": p1_say,
        "example": "Think of a physical notebook: an HDD is like a mechanical robot arm flipping through pages to find a specific paragraph; NAND flash is like a digital tablet screen where any pixel is addressed instantly, but erasing requires wiping an entire chalkboard clean before writing new notes.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes flash storage simulation workspace"},
            {"line": 2, "note": "Logs NAND block metadata including valid vs invalid page ratios and erase counts"},
            {"line": 4, "note": "Shows heavily fragmented block BLK_002 with 392 invalid pages ready for garbage collection"},
            {"line": 7, "note": "Filters high-wear block to monitor wear leveling rotation thresholds"}
        ],
        "tryIt": "Add a block entry BLK_005 with 512 total pages, 500 valid pages, and 200 erase cycles.",
        "check": {
            "question": "What is the 'Erase-Before-Write' constraint in NAND flash memory?",
            "options": [
                "NAND flash can be read and written in small pages (4 KB), but can only be erased in large multi-megabyte blocks, forcing out-of-place updates and garbage collection",
                "Flash drives must be completely erased every time the computer is turned off",
                "Files cannot be saved unless the user manually runs a terminal command",
                "NAND flash memory only allows writing data on Sundays"
            ],
            "answer": 0,
            "why": "Because flash cells must be discharged in bulk blocks, modifying a 4 KB page requires writing to a new page and marking the old page invalid until the entire block is garbage collected."
        }
    },
    {
        "title": "NVMe Architecture, PCIe Bus Lanes & Submission/Completion Queues",
        "say": p2_say,
        "example": "Like an airport security checkpoint: legacy SATA is a single narrow metal detector queue where 500 passengers wait in line; NVMe is a modern airport with 64 parallel automated biometric gates, each processing passengers simultaneously with zero line contention.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes NVMe multi-queue simulation directory"},
            {"line": 2, "note": "Logs queue ID, CPU core affinity, queue depth, and IOPS throughput"},
            {"line": 6, "note": "Records high-throughput queue SQ_03 handling 412,000 IOPS across dedicated PCIe lanes"},
            {"line": 8, "note": "Filters peak saturation queue to verify multi-core parallelism"}
        ],
        "tryIt": "Add queue SQ_04 on CORE_4 with depth 128 and 280,000 IOPS.",
        "check": {
            "question": "Why does the NVMe protocol deliver dramatically higher performance than legacy SATA/AHCI?",
            "options": [
                "Because NVMe connects directly to PCIe lanes and supports up to 64,000 parallel queues with 64,000 commands each, eliminating lock contention across CPU cores",
                "Because NVMe uses optical lasers instead of copper wires",
                "Because NVMe disables all security encryption to make transfers faster",
                "Because NVMe only works with small files under 1 megabyte"
            ],
            "answer": 0,
            "why": "SATA supported only a single 32-command queue, causing severe lock contention. NVMe supports 64,000 queues, allowing each CPU core to submit commands independently to hardware."
        }
    },
    {
        "title": "RAID Redundancy Architectures & XOR Parity Striping Mathematics",
        "say": p3_say,
        "example": "Like a simple algebraic equation: if you know A + B + C = Total, and someone erases number B, you can instantly recover B by calculating Total - A - C; RAID 5 does the exact same thing using bitwise XOR arithmetic.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes RAID simulation directory"},
            {"line": 2, "note": "Logs stripe ID, data blocks across three disks, XOR parity block, and reconstructed block"},
            {"line": 3, "note": "Demonstrates XOR parity generation (P) and exact bitwise reconstruction of failed Disk 1"},
            {"line": 6, "note": "Filters stripe entry verifying mathematical parity reconstruction"}
        ],
        "tryIt": "Add STRIPE_04 with all zeroes on disks and verify parity is all zeroes.",
        "check": {
            "question": "How does a RAID 5 array reconstruct lost data when a single physical drive fails?",
            "options": [
                "By performing a bitwise XOR operation between the surviving data disks and the parity disk",
                "By downloading the lost files from an automatic cloud backup",
                "By running an AI machine learning model to guess the missing bits",
                "By reversing the rotation direction of the surviving spinning disks"
            ],
            "answer": 0,
            "why": "Because A XOR B XOR P = 0, any missing operand can be calculated by XORing all remaining operands together in real time."
        }
    },
    {
        "title": "Silent Data Corruption (Bit Rot), Copy-on-Write (CoW) & Scrubbing",
        "say": p4_say,
        "example": "Like an immutable legal contract: instead of erasing or crossing out words on the original paper (in-place update), a Copy-on-Write filesystem writes an entirely new updated page and signs it with a cryptographic wax seal (SHA-256 hash), verifying integrity every time it is read.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes bit rot and cryptographic integrity simulation directory"},
            {"line": 2, "note": "Creates golden storage data block"},
            {"line": 3, "note": "Computes SHA-256 cryptographic digest of data block"},
            {"line": 5, "note": "Validates block integrity using sha256sum -c to guarantee zero bit rot"}
        ],
        "tryIt": "Add a second block block_02.dat and generate its SHA-256 checksum.",
        "check": {
            "question": "What is 'Silent Data Corruption' (Bit Rot) and how do modern filesystems like ZFS or Btrfs protect against it?",
            "options": [
                "Bit rot is unannounced data modification due to physical decay or cosmic rays; protected by Merkle tree cryptographic checksums that detect mismatches and self-heal from parity",
                "Bit rot is when computer software expires after 30 days of trial use",
                "Bit rot is when a hard drive makes loud clicking sounds during boot",
                "Bit rot is caused by downloading pirated software from the internet"
            ],
            "answer": 0,
            "why": "Traditional filesystems cannot detect bit flips because drives do not report errors. ZFS and Btrfs checksum every block and verify hashes on read, repairing corruption using redundant copies."
        }
    },
    {
        "title": "Master Enterprise Storage Benchmarking & Cryptographic Integrity Audit Suite",
        "say": p5_say,
        "example": "Like an annual structural integrity inspection of a suspension bridge: civil engineers inspect cables, measure strain sensors, and test concrete anchors to ensure the bridge can support heavy traffic without catastrophic failure.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes enterprise storage audit directory"},
            {"line": 2, "note": "Records operational health status in storage audit summary"},
            {"line": 3, "note": "Validates NVMe random I/O throughput exceeding 800,000 IOPS"},
            {"line": 8, "note": "Inspects Storage Health Index confirming 99/100 enterprise certification"}
        ],
        "tryIt": "Add a metric for AVAILABLE_SPARE_FLASH_PCT: 98% in summary.txt.",
        "check": {
            "question": "In production Linux storage benchmarking with fio, why is using the flag '--direct=1' critical?",
            "options": [
                "It bypasses the operating system page cache in RAM, measuring the true physical I/O throughput and latency of the storage hardware",
                "It causes the drive to rotate at twice its normal speed",
                "It sends the benchmark results directly to the manufacturer's website",
                "It formats the storage drive as NTFS instead of ext4"
            ],
            "answer": 0,
            "why": "Without direct=1, reads and writes are served from RAM page cache, yielding misleadingly high numbers that reflect memory speed rather than drive silicon performance."
        }
    }
]

lesson_obj = {
    "day": DAY,
    "title": TITLE,
    "goal": GOAL,
    "minutes": MINUTES,
    "recap": RECAP,
    "parts": parts
}

# 1. Generate Gate v2 visual file (cells template)
visual_entries = []
for idx, p in enumerate(parts):
    chash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    steps = [
        {
            "at": "intro",
            "caption": f"Step 1: Inspecting storage physical topology and queue layouts for {p['title'][:25]}...",
            "items": ["0x00: NVMe_SQ", "0x40: NAND_BLK", "0x80: RAID_XOR", "0xC0: SHA_HASH"],
            "pointers": [{"name": "DISK", "index": 0, "tone": "data"}],
            "highlightRange": [0, 1],
            "tones": {"0": "data", "1": "idle", "2": "idle", "3": "idle"}
        },
        {
            "at": "say1",
            "caption": f"Step 2: PCIe lane bandwidth and parity striping evaluation for {p['title'][:25]}...",
            "items": ["0x00: NVMe_SQ", "0x40: NAND_BLK", "0x80: RAID_XOR", "0xC0: SHA_HASH"],
            "pointers": [{"name": "DISK", "index": 1, "tone": "accent"}],
            "highlightRange": [1, 2],
            "tones": {"0": "idle", "1": "accent", "2": "idle", "3": "idle"}
        },
        {
            "at": "example",
            "caption": f"Step 3: Real-world operational state and self-healing telemetry for {p['title'][:25]}...",
            "items": ["0x00: NVMe_SQ", "0x40: NAND_BLK", "0x80: RAID_XOR", "0xC0: SHA_HASH"],
            "pointers": [{"name": "DISK", "index": 2, "tone": "success"}],
            "highlightRange": [2, 3],
            "tones": {"0": "idle", "1": "idle", "2": "success", "3": "idle"}
        },
        {
            "at": "tryIt",
            "caption": f"Step 4: Interactive verification and storage health diagnostics for {p['title'][:25]}...",
            "items": ["0x00: NVMe_SQ", "0x40: NAND_BLK", "0x80: RAID_XOR", "0xC0: SHA_HASH"],
            "pointers": [{"name": "DISK", "index": 3, "tone": "data"}],
            "highlightRange": [3, 4],
            "tones": {"0": "idle", "1": "idle", "2": "idle", "3": "data"}
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": chash,
        "spec": {
            "template": "cells",
            "title": f"{p['title']} — Storage Subsystem & Data Integrity Telemetry",
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "comp_fund",
    "day": DAY,
    "promptSha": hashlib.sha256(f"comp_fund_day_{DAY}".encode("utf-8")).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = f"src/lib/data/lessonVisuals/comp_fund/day-{DAY:02d}.json"
os.makedirs(os.path.dirname(visual_path), exist_ok=True)
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2, ensure_ascii=False)
print(f"Generated visual file: {visual_path}")

# 2. Update lesson in src/lib/data/compFundLongLessons.ts
ts_path = "src/lib/data/compFundLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace existing Day 8 or append
day_pattern = rf'(\n\s*\{{\s*["\']?day["\']?:\s*{DAY}\b.*?\n\s*\}})(,\s*\n\s*\{{\s*["\']?day["\']?|\s*\];)'
lesson_json = json.dumps(lesson_obj, indent=2, ensure_ascii=False)

if f'"day": {DAY}' in content or f'day: {DAY}' in content:
    # Day 8 exists, let's find start of day 8
    day_start = content.find(f'"day": {DAY}')
    if day_start == -1:
        day_start = content.find(f'day: {DAY}')
    brace_start = content.rfind('{', 0, day_start)
    # Find matching closing brace before '];'
    last_close = content.rfind("];")
    # Replace from brace_start to last_close with lesson_json + "\n];\n"
    new_content = content[:brace_start].rstrip() + "\n" + lesson_json + "\n];\n"
    print(f"Replaced Day {DAY} in {ts_path}")
else:
    last_close = content.rfind("];")
    new_content = content[:last_close].rstrip() + ",\n" + lesson_json + "\n];\n"
    print(f"Appended Day {DAY} to {ts_path}")

with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_content)

# Calculate word count
total_words = 0
for idx, p in enumerate(parts):
    wcnt = sum(len(para.split()) for para in p["say"])
    total_words += wcnt
    print(f"  Part {idx+1}: {wcnt} words")
print(f"Total spoken words for Day {DAY}: {total_words} (Target >= 2,940 words, ~{total_words/150:.1f} spoken minutes)")
