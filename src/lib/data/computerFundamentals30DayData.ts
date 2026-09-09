import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const COMPUTER_FUNDAMENTALS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "What is a Computer? — Input, Process, Output & Files",
    "desc": "Every computer follows three steps: Input (you provide information), Process (the computer does something with it), and Output (the computer shows or saves the result). Everything you do on a computer — typing a message, saving a photo, searching the web — follows this same pattern.",
    "syllabus": [
      "The Input → Process → Output (IPO) model: how every computer task works.",
      "Files and Folders: how your computer organises and stores information.",
      "The Operating System: the manager that runs all your apps and handles your files."
    ],
    "eTitle": "IPO Step Identifier",
    "eDesc": "Write a function `identifyIpoStep(action)` that returns 'INPUT' when action is 'typing', 'PROCESS' when action is 'calculating', and 'OUTPUT' when action is 'displaying'.",
    "eStarter": "function identifyIpoStep(action) {\n  // Return 'INPUT', 'PROCESS', or 'OUTPUT' based on the action\n  \n}",
    "eHint": "Use if/else or a switch: if action === 'typing' return 'INPUT', if 'calculating' return 'PROCESS', if 'displaying' return 'OUTPUT'.",
    "eTest": "if (identifyIpoStep('typing') !== 'INPUT') throw new Error('typing should be INPUT');\nif (identifyIpoStep('calculating') !== 'PROCESS') throw new Error('calculating should be PROCESS');\nif (identifyIpoStep('displaying') !== 'OUTPUT') throw new Error('displaying should be OUTPUT');\nconsole.log('All 3 IPO tests passed!');",
    "aTitle": "File Path Builder",
    "aDesc": "Write a function `buildFilePath(folder, filename)` that returns the full path as a string in the format 'folder/filename'.",
    "aStarter": "function buildFilePath(folder, filename) {\n  // Return the full path string\n  \n}",
    "aHint": "Return folder + '/' + filename",
    "aTest": "if (buildFilePath('Documents', 'notes.txt') !== 'Documents/notes.txt') throw new Error('Test 1 failed');\nif (buildFilePath('Photos', 'holiday.jpg') !== 'Photos/holiday.jpg') throw new Error('Test 2 failed');\nconsole.log('Both file path tests passed!');"
  },
  {
    "day": 2,
    "title": "Operating System Architecture: Kernel, System Calls & Process States",
    "desc": "Understand how software controls physical silicon: Operating System Kernels (Monolithic vs Microkernel), User Space (Ring 3) vs Kernel Space (Ring 0) Protection Rings, POSIX System Calls (`fork`, `exec`, `read`, `write`), Process Lifecycle States (Ready $\\to$ Running $\\to$ Blocked/Waiting $\\to$ Terminated), and Context Switching.",
    "syllabus": [
      "Kernel space privilege separation vs unprivileged user space.",
      "Hardware interrupts and POSIX system call execution flow.",
      "Process state transition diagrams and scheduler dispatch loops."
    ],
    "eTitle": "POSIX System Call & Kernel Mode Transition Validator",
    "eDesc": "Implement function validateSyscallExecution(callerRingLevel, syscallOpcodeValid, kernelTrapDispatched) certifying secure kernel execution.",
    "eStarter": "function validateSyscallExecution(ring, opcodeValid, trapDispatched) {\n  // A syscall is valid only if called from User Space (ring === 3), opcode is valid, and trap is dispatched.\n  // Return an object: { callerRing: ring, isTransitionSuccessful: boolean, targetRingAfterTrap: number, status: string }\n  \n}",
    "eHint": "Check if (ring === 3 && opcodeValid && trapDispatched) -> isApproved is true, targetRingAfterTrap is 0, status is 'KERNEL_SYSTEM_CALL_DISPATCHED_TO_RING_ZERO'. Otherwise isApproved is false, targetRingAfterTrap is ring, status is 'ILLEGAL_INSTRUCTION_OR_PRIVILEGE_VIOLATION'.",
    "eTest": "const pass = validateSyscallExecution(3, true, true);\nconst fail = validateSyscallExecution(0, true, true); // Kernel cannot trap to itself\nconst invalidOp = validateSyscallExecution(3, false, true);\nif (!pass.isTransitionSuccessful || pass.targetRingAfterTrap !== 0 || fail.isTransitionSuccessful || invalidOp.isTransitionSuccessful || pass.status !== 'KERNEL_SYSTEM_CALL_DISPATCHED_TO_RING_ZERO') throw new Error('Syscall validation failed');",
    "aTitle": "Kernel Mode Privilege Evaluator",
    "aDesc": "Write isKernelModePrivileged(ringLevel) returning true if ringLevel is 0 (Kernel Space), false if ringLevel is 3 (User Space), and throwing an Error for any invalid ring level.",
    "aStarter": "function isKernelModePrivileged(ringLevel) {\n  // Return true if ringLevel === 0, false if ringLevel === 3, else throw new Error('Invalid ring level')\n  \n}",
    "aHint": "Check if ringLevel === 0 (return true), else if ringLevel === 3 (return false), otherwise throw new Error('Invalid ring level');",
    "aTest": "if (isKernelModePrivileged(0) !== true) throw new Error('Ring 0 must be privileged (true)');\nif (isKernelModePrivileged(3) !== false) throw new Error('Ring 3 must be unprivileged (false)');\nlet threw = false;\ntry { isKernelModePrivileged(99); } catch (e) { threw = true; }\nif (!threw) throw new Error('Invalid ring must throw error');"
  },
  {
    "day": 3,
    "title": "File Systems & Directory Hierarchy: POSIX Inodes & Chmod Permissions (755)",
    "desc": "Master hierarchical data organization on disk: Directory Trees (Absolute paths `/var/log` vs Relative paths `../config`), File Allocation Tables (NTFS, EXT4, APFS), Inodes, Hard Links vs Soft Symlinks, and Unix Octal File Permissions (Chmod $755 = \\text{rwxr-xr-x} = (4+2+1)(4+0+1)(4+0+1)$).",
    "syllabus": [
      "Absolute filesystem root paths vs relative path traversal.",
      "File metadata, storage block pointers, and inode allocation tables.",
      "Calculating Unix octal permission bits ($r=4, w=2, x=1$)."
    ],
    "eTitle": "Unix Octal Permission (Chmod) Bitmask Decoder",
    "eDesc": "Implement function decodeChmodOctal(octalNumber) converting a 3-digit octal number (e.g. `755`) into its standard Unix permission string representation (e.g. `'rwxr-xr-x'`).",
    "eStarter": "function decodeChmodOctal(octal) {\n  // Convert 3-digit octal (e.g. 755) to permission string (e.g. 'rwxr-xr-x').\n  // For each digit: bit 4 = 'r', bit 2 = 'w', bit 1 = 'x' (or '-' if absent).\n  // Return { octalPermission: octal, permissionString: str, isOwnerFullControl: boolean, status: 'CHMOD_PERMISSIONS_DECODED' }\n  \n}",
    "eHint": "Split octal into digits. For each digit d: (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-'). Join the 3 mapped strings.",
    "eTest": "const res = decodeChmodOctal(755); // 7=rwx, 5=r-x, 5=r-x -> 'rwxr-xr-x'\nconst priv = decodeChmodOctal(600); // 6=rw-, 0=---, 0=--- -> 'rw-------'\nconst full = decodeChmodOctal(777); // 7=rwx, 7=rwx, 7=rwx -> 'rwxrwxrwx'\nif (res.permissionString !== 'rwxr-xr-x' || priv.permissionString !== 'rw-------' || full.permissionString !== 'rwxrwxrwx' || !res.isOwnerFullControl || priv.isOwnerFullControl) throw new Error('Chmod decoder failed');",
    "aTitle": "File Write Permission Checker",
    "aDesc": "Write canWriteFile(octalDigit) returning true if the write permission bit (value 2) is active in the given permission digit (e.g. 2, 3, 6, 7), and false otherwise (e.g. 0, 1, 4, 5).",
    "aStarter": "function canWriteFile(octalDigit) {\n  // Check if the write bit (2) is set in octalDigit\n  \n}",
    "aHint": "Use bitwise AND: return (octalDigit & 2) !== 0; or check if octalDigit is 2, 3, 6, or 7.",
    "aTest": "if (canWriteFile(7) !== true) throw new Error('Digit 7 (rwx) must allow write');\nif (canWriteFile(6) !== true) throw new Error('Digit 6 (rw-) must allow write');\nif (canWriteFile(5) !== false) throw new Error('Digit 5 (r-x) must NOT allow write');\nif (canWriteFile(4) !== false) throw new Error('Digit 4 (r--) must NOT allow write');\nif (canWriteFile(0) !== false) throw new Error('Digit 0 (---) must NOT allow write');"
  },
  {
    "day": 4,
    "title": "Command Line Interface (CLI) Mastery: Piping, Redirection & Grep Filters",
    "desc": "Harness the power of the terminal command line: Standard Streams (`stdin 0`, `stdout 1`, `stderr 2`), File Redirection (`>`, `>>`, `2>&1`), Unix Pipe Chains (`|`), Directory Navigation (`cd`, `ls -la`, `mkdir -p`), and Pattern Filtering (`grep -rn 'ERROR' /var/log | wc -l`).",
    "syllabus": [
      "Standard input, standard output, and standard error streams.",
      "Unix pipeline architecture and composable single-purpose utilities.",
      "Regular expression search and multi-file text filtering in the terminal."
    ],
    "eTitle": "Unix Pipeline Line & Token Counter Simulator",
    "eDesc": "Implement function simulateGrepPipeWc(rawLogTextArray, searchRegexPattern) filtering matching log lines and returning line count (emulating `grep pattern | wc -l`).",
    "eStarter": "function simulateGrepPipeWc(logLines, pattern) {\n  // Filter logLines that match pattern using RegExp. Return { totalInputLines, matchingLinesCount, matchedSnippets, status }\n  \n}",
    "eHint": "Create const re = new RegExp(pattern); filter with logLines.filter(line => re.test(line)); return { totalInputLines: logLines.length, matchingLinesCount: matches.length, matchedSnippets: matches, status: 'PIPELINE_FILTER_EXECUTED_NOMINAL' };",
    "eTest": "const logs = ['[INFO] Booting server', '[ERROR] Database connection timed out', '[INFO] Request handled', '[ERROR] Port 443 in use'];\nconst res = simulateGrepPipeWc(logs, 'ERROR');\nconst emptyRes = simulateGrepPipeWc(logs, 'FATAL');\nif (res.matchingLinesCount !== 2 || res.matchedSnippets.length !== 2 || emptyRes.matchingLinesCount !== 0 || res.status !== 'PIPELINE_FILTER_EXECUTED_NOMINAL') throw new Error('Pipeline simulation failed');",
    "aTitle": "Log Stream Severity Filter",
    "aDesc": "Write filterLogsBySeverity(logLines, severity) returning an array of log lines that start with '[' + severity.toUpperCase() + ']'.",
    "aStarter": "function filterLogsBySeverity(logLines, severity) {\n  // Filter and return only lines starting with [SEVERITY]\n  \n}",
    "aHint": "Use const prefix = '[' + severity.toUpperCase() + ']'; return logLines.filter(l => l.startsWith(prefix));",
    "aTest": "const logs = ['[INFO] Starting', '[ERROR] Timeout', '[WARN] Slow disk', '[ERROR] Crash'];\nconst errors = filterLogsBySeverity(logs, 'ERROR');\nif (errors.length !== 2 || errors[0] !== '[ERROR] Timeout' || errors[1] !== '[ERROR] Crash') throw new Error('Filter ERROR failed');\nconst infos = filterLogsBySeverity(logs, 'info');\nif (infos.length !== 1 || infos[0] !== '[INFO] Starting') throw new Error('Filter info failed');\nif (filterLogsBySeverity(logs, 'FATAL').length !== 0) throw new Error('Missing severity must return empty array');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Computer Hardware, Kernel Architecture & Terminal CLI Engine",
    "desc": "Milestone 1: Build a complete foundational OS & computing engine: High-speed memory bus bandwidth calculation ($25,600$ MB/s), Ring 0 POSIX syscall verification, Chmod octal permission decoding (`755` $\\to$ `rwxr-xr-x`), and Unix pipeline grep filtering.",
    "syllabus": [
      "Synthesis of hardware data transfer, kernel traps, POSIX permissions, and CLI pipelines.",
      "System integrity and operating system fundamentals certification.",
      "Milestone 1 certification."
    ],
    "eTitle": "Computer & OS Foundations Master Kernel",
    "eDesc": "Implement function executeComputerFoundationsKernel(busOk, kernelOk, chmodOk, cliOk) certifying combined computing foundations execution.",
    "eStarter": "function executeComputerFoundationsKernel(bus, kernel, chmod, cli) {\n  // Verify that all 4 foundation flags evaluate to true.\n  // Return { hardwareBusCertified: bus, kernelSyscallsVerified: kernel, filePermissionsDecoded: chmod, cliPipingOperational: cli, foundationsCertified: boolean, engineStatus: string }\n  \n}",
    "eHint": "const isNominal = bus && kernel && chmod && cli; return { hardwareBusCertified: bus, kernelSyscallsVerified: kernel, filePermissionsDecoded: chmod, cliPipingOperational: cli, foundationsCertified: isNominal, engineStatus: isNominal ? 'COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL' : 'COMPUTING_FOUNDATIONS_DEFECT' };",
    "eTest": "const res = executeComputerFoundationsKernel(true, true, true, true);\nconst failBus = executeComputerFoundationsKernel(false, true, true, true);\nconst failKernel = executeComputerFoundationsKernel(true, false, true, true);\nif (res.engineStatus !== 'COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL' || !res.foundationsCertified || failBus.foundationsCertified || failKernel.engineStatus !== 'COMPUTING_FOUNDATIONS_DEFECT') throw new Error('Milestone 1 kernel failed');",
    "aTitle": "Computing Foundations Health Evaluator",
    "aDesc": "Write evaluateFoundationsHealth(busSpeedMb, kernelRing, chmodString) returning 'HEALTHY' if busSpeedMb >= 25000, kernelRing === 0, and chmodString === 'rwxr-xr-x', otherwise returning 'DEGRADED'.",
    "aStarter": "function evaluateFoundationsHealth(busSpeedMb, kernelRing, chmodString) {\n  // Return 'HEALTHY' if all three conditions meet benchmarks, else 'DEGRADED'\n  \n}",
    "aHint": "Check: if (busSpeedMb >= 25000 && kernelRing === 0 && chmodString === 'rwxr-xr-x') return 'HEALTHY'; else return 'DEGRADED';",
    "aTest": "if (evaluateFoundationsHealth(25600, 0, 'rwxr-xr-x') !== 'HEALTHY') throw new Error('Nominal inputs must be HEALTHY');\nif (evaluateFoundationsHealth(10000, 0, 'rwxr-xr-x') !== 'DEGRADED') throw new Error('Slow bus must be DEGRADED');\nif (evaluateFoundationsHealth(25600, 3, 'rwxr-xr-x') !== 'DEGRADED') throw new Error('Ring 3 must be DEGRADED');\nif (evaluateFoundationsHealth(25600, 0, 'rw-r--r--') !== 'DEGRADED') throw new Error('Different chmod must be DEGRADED');"
  },
  {
    "day": 6,
    "title": "Process Management & Multitasking: Process ID (PID), Threads & CPU Throttling",
    "desc": "Master how the operating system juggles hundreds of concurrent tasks: Process Control Blocks (PCB), Unique Process IDs (PID), Preemptive vs Cooperative Scheduling, CPU Time Slices, Context Switch Overhead ($< 5\\,\\mu\\text{s}$), Threads vs Processes, and CPU Thermal Throttling.",
    "syllabus": [
      "Process lifecycle, memory address space isolation, and Process Control Blocks.",
      "Preemptive time-slice scheduling and round-robin dispatch algorithms.",
      "Thread concurrency, race conditions, and Task Manager / htop diagnostics."
    ],
    "eTitle": "CPU Round-Robin Time-Slice Scheduler Simulator",
    "eDesc": "Implement function simulateRoundRobinScheduler(taskBurstTimesArray, timeQuantumMs) calculating total elapsed execution time across all scheduled processes.",
    "eStarter": "function simulateRoundRobinScheduler(bursts, quantum) {\n  // Emulate round-robin scheduling by deducting min(remaining, quantum) per process until all tasks reach 0.\n  // Return { totalElapsedTimeMs: number, totalContextSwitchCycles: number, status: string }\n  \n}",
    "eHint": "Copy bursts into a queue array. While some tasks > 0, iterate and deduct Math.min(queue[i], quantum), incrementing totalTime and cycles counter.",
    "eTest": "const res = simulateRoundRobinScheduler([10, 5, 8], 4); // Tasks take 10+5+8 = 23 ms total\nconst single = simulateRoundRobinScheduler([6], 2); // 6 ms total\nconst empty = simulateRoundRobinScheduler([], 4); // 0 ms total\nif (res.totalElapsedTimeMs !== 23 || single.totalElapsedTimeMs !== 6 || empty.totalElapsedTimeMs !== 0 || res.status !== 'SCHEDULER_ROUND_ROBIN_COMPLETED') throw new Error('Scheduler simulation failed');",
    "aTitle": "Process Table Formatter",
    "aDesc": "Write formatProcessEntry(pid, processName, cpuUsagePercent) returning a string in the format 'PID <pid>: <processName> (<cpuUsagePercent>%)'.",
    "aStarter": "function formatProcessEntry(pid, name, cpu) {\n  // Return formatted string: `PID ${pid}: ${name} (${cpu}%)`\n  \n}",
    "aHint": "Use template string: return `PID ${pid}: ${name} (${cpu}%)`;",
    "aTest": "if (formatProcessEntry(1024, 'node', 12.5) !== 'PID 1024: node (12.5%)') throw new Error('Test 1 failed');\nif (formatProcessEntry(1, 'systemd', 0.1) !== 'PID 1: systemd (0.1%)') throw new Error('Test 2 failed');\nif (formatProcessEntry(4096, 'chrome', 45) !== 'PID 4096: chrome (45%)') throw new Error('Test 3 failed');"
  },
  {
    "day": 7,
    "title": "Computer Memory Hierarchy: L1/L2/L3 CPU Caches, RAM & Virtual Paging",
    "desc": "Bridge the speed gap between lightning-fast CPUs and slower storage: The Memory Speed Pyramid (Registers 0.5ns $\\to$ L1 Cache 1ns $\\to$ L2 Cache 4ns $\\to$ L3 Cache 10ns $\\to$ DDR5 RAM 100ns $\\to$ NVMe SSD 10,000ns), Virtual Memory Paging (4KB Page Frames), Translation Lookaside Buffers (TLB), Page Faults, and Swap Space.",
    "syllabus": [
      "Memory hierarchy access latency trade-offs and cache locality.",
      "Virtual memory address translation via Page Tables and the MMU.",
      "Page replacement algorithms (LRU) and avoiding thrashing."
    ],
    "eTitle": "Memory Access Latency & Cache Hit Ratio Evaluator",
    "eDesc": "Implement function calculateEffectiveMemoryAccessTime(cacheHitRatioPct, cacheLatencyNs, ramLatencyNs) calculating Average Memory Access Time ($AMAT = L_{\\text{cache}} + (1 - \\text{Hit Ratio}) \\times L_{\\text{RAM}}$).",
    "eStarter": "function calculateEffectiveMemoryAccessTime(hitPct, lCache, lRam) {\n  // Calculate missRate = 1 - (hitPct / 100). AMAT = lCache + (missRate * lRam).\n  // Return { cacheHitRatioPercent: hitPct, amatNanoseconds: number, isUltraFastMemoryAccess: boolean (<= 15.0), status: string }\n  \n}",
    "eHint": "Calculate missRate = 1 - (hitPct / 100); const amat = lCache + (missRate * lRam); return { cacheHitRatioPercent: hitPct, amatNanoseconds: Number(amat.toFixed(2)), isUltraFastMemoryAccess: amat <= 15.0, status: 'AMAT_COMPUTED' };",
    "eTest": "const res = calculateEffectiveMemoryAccessTime(95.0, 5.0, 100.0); // 5.0 + 5.0 = 10.00 ns\nconst slow = calculateEffectiveMemoryAccessTime(50.0, 5.0, 100.0); // 5.0 + 50.0 = 55.00 ns\nconst perfect = calculateEffectiveMemoryAccessTime(100.0, 5.0, 100.0); // 5.00 ns\nif (res.amatNanoseconds !== 10.00 || !res.isUltraFastMemoryAccess || slow.isUltraFastMemoryAccess || perfect.amatNanoseconds !== 5.00) throw new Error('AMAT calculation failed');",
    "aTitle": "Virtual Memory Paging Calculator",
    "aDesc": "Write calculateRequiredPages(dataSizeBytes, pageSizeBytes) returning the integer number of pages needed to store the data (using Math.ceil(dataSizeBytes / pageSizeBytes)).",
    "aStarter": "function calculateRequiredPages(dataSizeBytes, pageSizeBytes) {\n  // Calculate and return Math.ceil(dataSizeBytes / pageSizeBytes)\n  \n}",
    "aHint": "Use Math.ceil(dataSizeBytes / pageSizeBytes) to calculate required page count.",
    "aTest": "if (calculateRequiredPages(8192, 4096) !== 2) throw new Error('8192 bytes with 4096 page size must be 2 pages');\nif (calculateRequiredPages(5000, 4096) !== 2) throw new Error('5000 bytes with 4096 page size must require 2 pages');\nif (calculateRequiredPages(4096, 4096) !== 1) throw new Error('4096 bytes must require exactly 1 page');\nif (calculateRequiredPages(0, 4096) !== 0) throw new Error('0 bytes must require 0 pages');"
  },
  {
    "day": 8,
    "title": "Storage Technologies & Data Integrity: NVMe Flash, RAID Parity & SHA-256 Checksums",
    "desc": "Store and protect digital assets permanently: Solid State Drives (NAND Flash Cells: SLC, MLC, TLC, QLC), Wear Leveling & TRIM commands, Redundant Array of Independent Disks (RAID 0 Striping, RAID 1 Mirroring, RAID 5 Distributed Parity with $N-1$ Usable Capacity), and Cryptographic SHA-256 Data Integrity Checksums.",
    "syllabus": [
      "NAND Flash physical wear mechanics and SSD endurance (TBW).",
      "RAID storage configurations, fault tolerance, and capacity math.",
      "Cryptographic hashing for file integrity verification."
    ],
    "eTitle": "RAID 5 Usable Storage Capacity & Parity Calculator",
    "eDesc": "Implement function calculateRaid5Capacity(diskCount, singleDiskSizeTb) calculating total usable storage ($Usable = (N - 1) \\times \\text{Disk Size}$) and certifying fault tolerance (tolerates exactly 1 drive failure).",
    "eStarter": "function calculateRaid5Capacity(disks, sizeTb) {\n  // If disks < 3 throw new Error('RAID 5 requires minimum 3 disks').\n  // Return { totalDisks, singleDiskSizeTb, usableCapacityTb: (disks - 1) * sizeTb, parityOverheadTb: sizeTb, tolerableDriveFailures: 1, status: 'RAID_5_ARRAY_CONFIGURED_NOMINAL' }\n  \n}",
    "eHint": "RAID 5 stripes parity across all disks: usable capacity is (disks - 1) * sizeTb, with exactly 1 disk equivalent for parity.",
    "eTest": "const res = calculateRaid5Capacity(4, 8); // (4 - 1) * 8 = 24 TB\nconst minDisks = calculateRaid5Capacity(3, 4); // (3 - 1) * 4 = 8 TB\nlet threw = false;\ntry { calculateRaid5Capacity(2, 4); } catch (e) { threw = true; }\nif (res.usableCapacityTb !== 24 || minDisks.usableCapacityTb !== 8 || !threw || res.tolerableDriveFailures !== 1) throw new Error('RAID 5 calculation failed');",
    "aTitle": "RAID Storage Configuration Capacity Calculator",
    "aDesc": "Write calculateRaidCapacity(disks, sizeTb, raidLevel) returning usable capacity: for 'RAID0' return disks * sizeTb; for 'RAID1' return sizeTb; for 'RAID5' return (disks - 1) * sizeTb.",
    "aStarter": "function calculateRaidCapacity(disks, sizeTb, raidLevel) {\n  // Compute usable capacity based on RAID level ('RAID0', 'RAID1', 'RAID5')\n  \n}",
    "aHint": "Use a switch or if/else on raidLevel: RAID0 = disks * sizeTb; RAID1 = sizeTb; RAID5 = (disks - 1) * sizeTb.",
    "aTest": "if (calculateRaidCapacity(4, 2, 'RAID0') !== 8) throw new Error('RAID0 4x2TB must be 8TB');\nif (calculateRaidCapacity(2, 4, 'RAID1') !== 4) throw new Error('RAID1 2x4TB must be 4TB');\nif (calculateRaidCapacity(4, 8, 'RAID5') !== 24) throw new Error('RAID5 4x8TB must be 24TB');\nif (calculateRaidCapacity(6, 10, 'RAID5') !== 50) throw new Error('RAID5 6x10TB must be 50TB');"
  },
  {
    "day": 9,
    "title": "Computer Networking Basics: TCP/IP 4-Layer Model, IPv4 Subnetting & DNS Flow",
    "desc": "Understand the plumbing of the global Internet: The TCP/IP 4-Layer Protocol Stack (Application, Transport, Internet, Network Access), IPv4 vs IPv6 Addressing, CIDR Subnetting ($/24 = 256$ Total IPs, $254$ Usable Hosts), MAC Hardware Addresses, DHCP Leases, and Domain Name System (DNS Recursive Resolver $\\to$ Root $\\to$ TLD $\\to$ Authoritative Name Server).",
    "syllabus": [
      "Core Foundations: Principles and architecture of Computer Networking Basics: TCP/IP 4-Layer Model, IPv4 Subnetting & DNS Flow.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "IPv4 CIDR Subnet Usable Host Calculator",
    "eDesc": "Implement function calculateSubnetHosts(cidrPrefixLength) calculating total usable host IP addresses ($Usable = 2^{(32 - \\text{Prefix})} - 2$).",
    "eStarter": "function calculateSubnetHosts(prefix) {\n  // Host bits = 32 - prefix. Total IPs = Math.pow(2, hostBits). Usable hosts = Math.max(0, totalIps - 2).\n  // Return { cidrPrefix: `/${prefix}`, totalAddresses: totalIps, usableHostCount: usableHosts, status: 'SUBNET_CALCULATED' }\n  \n}",
    "eHint": "Host bits = 32 − prefix; subtract 2 for network and broadcast addresses: Math.max(0, Math.pow(2, 32 - prefix) - 2).",
    "eTest": "const res24 = calculateSubnetHosts(24); // 2^8 - 2 = 254\nconst res30 = calculateSubnetHosts(30); // 2^2 - 2 = 2\nconst res32 = calculateSubnetHosts(32); // 2^0 - 2 -> 0 usable\nif (res24.usableHostCount !== 254 || res30.usableHostCount !== 2 || res32.usableHostCount !== 0) throw new Error('Subnet calculation failed');",
    "aTitle": "IPv4 Address Octet Validator",
    "aDesc": "Write isValidIpv4Octet(octetNumber) returning true if octetNumber is an integer between 0 and 255 inclusive, and false otherwise.",
    "aStarter": "function isValidIpv4Octet(octet) {\n  // Return true if octet is an integer between 0 and 255 inclusive\n  \n}",
    "aHint": "Check: return Number.isInteger(octet) && octet >= 0 && octet <= 255;",
    "aTest": "if (isValidIpv4Octet(192) !== true) throw new Error('192 is a valid octet');\nif (isValidIpv4Octet(0) !== true) throw new Error('0 is a valid octet');\nif (isValidIpv4Octet(255) !== true) throw new Error('255 is a valid octet');\nif (isValidIpv4Octet(256) !== false) throw new Error('256 is out of range');\nif (isValidIpv4Octet(-1) !== false) throw new Error('-1 is negative');\nif (isValidIpv4Octet(12.5) !== false) throw new Error('12.5 is not integer');"
  },
  {
    "day": 10,
    "title": "The Modern Internet & Web Protocols: HTTP/2, TLS 1.3 Handshake & Port Mapping",
    "desc": "Master client-server web communications: HTTP/1.1 vs HTTP/2 Multiplexing vs HTTP/3 QUIC (UDP), TLS 1.3 Cryptographic Handshake (1-RTT session establishment), Standard Network Ports (Port 80 HTTP, Port 443 HTTPS, Port 22 SSH, Port 53 DNS), and REST API HTTP Methods (GET, POST, PUT, DELETE).",
    "syllabus": [
      "Core Foundations: Principles and architecture of The Modern Internet & Web Protocols: HTTP/2, TLS 1.3 Handshake & Port Mapping.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Standard Network Port & Protocol Mapping Auditor",
    "eDesc": "Implement function lookupStandardPort(protocolName) mapping protocol to standard IANA well-known port number.",
    "eStarter": "function lookupStandardPort(protocol) {\n  // Map protocol string (HTTP -> 80, HTTPS -> 443, SSH -> 22, DNS -> 53, FTP -> 21). Throw Error if unknown.\n  // Return { protocolName, standardPortNumber: port, isEncryptedByDefault: port === 443 || port === 22, status: 'PORT_MAPPED' }\n  \n}",
    "eHint": "Use a dictionary map: { 'HTTP': 80, 'HTTPS': 443, 'SSH': 22, 'DNS': 53, 'FTP': 21 }. If !port, throw new Error('Unknown protocol');",
    "eTest": "const https = lookupStandardPort('HTTPS');\nconst ssh = lookupStandardPort('SSH');\nconst dns = lookupStandardPort('DNS');\nlet threw = false;\ntry { lookupStandardPort('UNKNOWN_XYZ'); } catch(e) { threw = true; }\nif (https.standardPortNumber !== 443 || !https.isEncryptedByDefault || ssh.standardPortNumber !== 22 || dns.standardPortNumber !== 53 || !threw) throw new Error('Port mapping failed');",
    "aTitle": "Network URL Endpoint Formatter",
    "aDesc": "Write formatNetworkEndpoint(protocol, host, port) returning '<protocol>://<host>' if port matches the standard (80 for http, 443 for https), else '<protocol>://<host>:<port>'.",
    "aStarter": "function formatNetworkEndpoint(protocol, host, port) {\n  // Return protocol://host (omitting port if standard 80/443), else protocol://host:port\n  \n}",
    "aHint": "Check: if ((protocol === 'http' && port === 80) || (protocol === 'https' && port === 443)) return `${protocol}://${host}`; else return `${protocol}://${host}:${port}`;",
    "aTest": "if (formatNetworkEndpoint('https', 'pinit.app', 443) !== 'https://pinit.app') throw new Error('Standard https port 443 should omit port');\nif (formatNetworkEndpoint('http', 'localhost', 80) !== 'http://localhost') throw new Error('Standard http port 80 should omit port');\nif (formatNetworkEndpoint('https', 'api.pinit.app', 8443) !== 'https://api.pinit.app:8443') throw new Error('Custom port 8443 must be included');\nif (formatNetworkEndpoint('http', 'localhost', 3000) !== 'http://localhost:3000') throw new Error('Dev port 3000 must be included');"
  },
  {
    "day": 11,
    "title": "Browser Developer Tools & Web Inspection: DOM, Network Waterfall & LocalStorage",
    "desc": "Inspect and debug modern web applications like a software engineer: Document Object Model (DOM) Tree Inspection, CSS Style Rules & Box Model (Margin, Border, Padding, Content), Network Waterfall Latency (DNS, TLS, TTFB Time to First Byte $< 200\\text{ms}$), Browser Storage (LocalStorage, SessionStorage, HTTP Cookies with `Secure; HttpOnly; SameSite=Strict`), and JavaScript Console Debugging.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Browser Developer Tools & Web Inspection: DOM, Network Waterfall & LocalStorage.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Network Waterfall TTFB & Web Performance Auditor",
    "eDesc": "Implement function auditNetworkLatency(dnsTimeMs, tlsTimeMs, ttfbTimeMs, downloadTimeMs) calculating Total Page Load Time and certifying sub-500ms web performance ($Total \\le 500$ ms).",
    "eStarter": "function auditNetworkLatency(dns, tls, ttfb, download) {\n  // Sum all 4 latencies. Certified if total <= 500 ms.\n  // Return { dnsMs, tlsMs, ttfbMs, downloadMs, totalLoadTimeMs: total, isPerformanceCertified: total <= 500, status: string }\n  \n}",
    "eHint": "Sum dns + tls + ttfb + download; isFast is total <= 500. Status is 'WEB_PAGE_LOAD_HIGH_PERFORMANCE_CERTIFIED' if fast, else 'LATENCY_BOTTLENECK_DETECTED'.",
    "eTest": "const pass = auditNetworkLatency(20, 30, 150, 100); // 300 ms <= 500\nconst slow = auditNetworkLatency(100, 200, 400, 300); // 1000 ms\nconst boundary = auditNetworkLatency(50, 50, 200, 200); // 500 ms exactly -> pass\nif (pass.totalLoadTimeMs !== 300 || !pass.isPerformanceCertified || slow.isPerformanceCertified || !boundary.isPerformanceCertified) throw new Error('Network audit failed');",
    "aTitle": "HTTP Status Code Category Classifier",
    "aDesc": "Write classifyHttpStatusCode(statusCode) returning 'INFORMATIONAL' for 100-199, 'SUCCESS' for 200-299, 'REDIRECTION' for 300-399, 'CLIENT_ERROR' for 400-499, and 'SERVER_ERROR' for 500-599.",
    "aStarter": "function classifyHttpStatusCode(statusCode) {\n  // Return category string based on 100-599 status code ranges\n  \n}",
    "aHint": "Check status range: 100-199 => 'INFORMATIONAL', 200-299 => 'SUCCESS', 300-399 => 'REDIRECTION', 400-499 => 'CLIENT_ERROR', 500-599 => 'SERVER_ERROR'.",
    "aTest": "if (classifyHttpStatusCode(200) !== 'SUCCESS') throw new Error('200 is SUCCESS');\nif (classifyHttpStatusCode(404) !== 'CLIENT_ERROR') throw new Error('404 is CLIENT_ERROR');\nif (classifyHttpStatusCode(500) !== 'SERVER_ERROR') throw new Error('500 is SERVER_ERROR');\nif (classifyHttpStatusCode(301) !== 'REDIRECTION') throw new Error('301 is REDIRECTION');\nif (classifyHttpStatusCode(101) !== 'INFORMATIONAL') throw new Error('101 is INFORMATIONAL');"
  },
  {
    "day": 12,
    "title": "Digital Productivity & Advanced Keyboard Shortcuts: Touch Typing & OS Ergonomics",
    "desc": "Supercharge your digital workflow speed: Ergonomic Touch Typing (Target $\\ge 60$ Words Per Minute WPM), Window Management Shortcuts (Windows Snap, macOS Mission Control, Virtual Desktops), Advanced Text Navigation (Word-by-word `Ctrl+Arrows`, multi-cursor editing, Line jumping), Clipboard History (`Win+V`), and Global Spotlight Search.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Digital Productivity & Advanced Keyboard Shortcuts: Touch Typing & OS Ergonomics.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Typing Speed (WPM) & Net Accuracy Scorecard",
    "eDesc": "Implement function calculateNetWpm(grossWordsTyped, uncorrectedErrors, testMinutes) calculating Net Typing Speed ($Net WPM = \\frac{Gross Words - Errors}{Minutes}$) and certifying professional productivity ($Net WPM \\ge 60$).",
    "eStarter": "function calculateNetWpm(words, errors, minutes) {\n  // Net words = Math.max(0, words - errors). Net WPM = netWords / minutes.\n  // Return { grossWordsTyped, uncorrectedErrors, testMinutes, netWpm: Number(wpm.toFixed(1)), isProfessionalTypingCertified: wpm >= 60.0, status }\n  \n}",
    "eHint": "Net WPM = (words - errors) / minutes. Certified if >= 60.0 WPM; format to 1 decimal place with toFixed(1).",
    "eTest": "const res = calculateNetWpm(210, 10, 3); // 200 / 3 = 66.7 WPM\nconst low = calculateNetWpm(120, 20, 3); // 100 / 3 = 33.3 WPM\nconst zero = calculateNetWpm(5, 10, 1); // 0 WPM\nif (res.netWpm !== 66.7 || !res.isProfessionalTypingCertified || low.isProfessionalTypingCertified || zero.netWpm !== 0) throw new Error('WPM calculation failed');",
    "aTitle": "Typing Accuracy Percentage Evaluator",
    "aDesc": "Write calculateTypingAccuracy(grossWords, errors) returning accuracy percentage as Number(((grossWords - errors) / grossWords * 100).toFixed(1)), or 0.0 if grossWords <= 0.",
    "aStarter": "function calculateTypingAccuracy(grossWords, errors) {\n  // Return accuracy percentage rounded to 1 decimal place: ((gross - errors) / gross) * 100\n  \n}",
    "aHint": "If grossWords <= 0 return 0.0; else return Number((((grossWords - errors) / grossWords) * 100).toFixed(1));",
    "aTest": "if (calculateTypingAccuracy(100, 5) !== 95.0) throw new Error('100 words with 5 errors must be 95.0%');\nif (calculateTypingAccuracy(200, 10) !== 95.0) throw new Error('200 words with 10 errors must be 95.0%');\nif (calculateTypingAccuracy(50, 0) !== 100.0) throw new Error('50 words with 0 errors must be 100.0%');\nif (calculateTypingAccuracy(0, 0) !== 0.0) throw new Error('0 words must return 0.0%');"
  },
  {
    "day": 13,
    "title": "Cloud Storage & Distributed Sync: Block Deltas & The 3-2-1 Backup Rule",
    "desc": "Never lose a byte of critical data: Cloud File Synchronization Mechanics (Block-level delta syncing), Conflict Resolution Strategies (Last-Write-Wins vs Branching copies), End-to-End Zero-Knowledge Encryption, and The Gold-Standard 3-2-1 Enterprise Backup Rule (3 total copies of data, across 2 different physical media types, with 1 copy stored securely off-site in the cloud).",
    "syllabus": [
      "Core Foundations: Principles and architecture of Cloud Storage & Distributed Sync: Block Deltas & The 3-2-1 Backup Rule.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "3-2-1 Data Protection & Backup Compliance Auditor",
    "eDesc": "Implement function auditThreeTwoOneBackup(totalCopiesCount, distinctMediaTypesCount, hasOffsiteCloudCopy) certifying adherence to the 3-2-1 backup standard ($Copies \\ge 3, Media \\ge 2, Offsite = true$).",
    "eStarter": "function auditThreeTwoOneBackup(copies, media, offsite) {\n  // Compliant if copies >= 3 && media >= 2 && offsite === true.\n  // Return { totalDataCopies: copies, distinctMediaTypes: media, offsiteCopySecured: offsite, isThreeTwoOneCompliant: boolean, status: string }\n  \n}",
    "eHint": "Check: const isCompliant = copies >= 3 && media >= 2 && Boolean(offsite); status is 'THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS' if compliant, else 'CATASTROPHIC_DATA_LOSS_RISK'.",
    "eTest": "const pass = auditThreeTwoOneBackup(3, 2, true);\nconst failMedia = auditThreeTwoOneBackup(3, 1, true);\nconst failOffsite = auditThreeTwoOneBackup(4, 2, false);\nif (!pass.isThreeTwoOneCompliant || failMedia.isThreeTwoOneCompliant || failOffsite.isThreeTwoOneCompliant || pass.status !== 'THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS') throw new Error('Backup audit failed');",
    "aTitle": "Backup Storage Redundancy Scorer",
    "aDesc": "Write scoreBackupHealth(copies, mediaTypes, hasCloudCopy) returning score out of 100: 40 points for copies >= 3, 30 points for mediaTypes >= 2, and 30 points for hasCloudCopy === true.",
    "aStarter": "function scoreBackupHealth(copies, mediaTypes, hasCloudCopy) {\n  // Calculate and return total score out of 100 (40 + 30 + 30)\n  \n}",
    "aHint": "let score = 0; if (copies >= 3) score += 40; if (mediaTypes >= 2) score += 30; if (hasCloudCopy) score += 30; return score;",
    "aTest": "if (scoreBackupHealth(3, 2, true) !== 100) throw new Error('Full 3-2-1 compliance must score 100');\nif (scoreBackupHealth(3, 1, true) !== 70) throw new Error('Missing second media must score 70');\nif (scoreBackupHealth(1, 1, false) !== 0) throw new Error('1 local copy must score 0');\nif (scoreBackupHealth(4, 3, false) !== 70) throw new Error('Missing cloud offsite must score 70');"
  },
  {
    "day": 14,
    "title": "Data Formats & Encoding Standards: Binary, Hexadecimal, ASCII & UTF-8",
    "desc": "Understand how text, numbers, and multimedia are represented in bits: Number Radixes (Binary Base 2, Decimal Base 10, Hexadecimal Base 16 `0x`), Character Encodings (7-bit ASCII vs Variable-length 1-to-4 byte UTF-8), Structured Serialization Formats (JSON, YAML, CSV), and Binary MIME Types.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Data Formats & Encoding Standards: Binary, Hexadecimal, ASCII & UTF-8.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Hexadecimal to Decimal & Binary Radix Converter",
    "eDesc": "Implement function convertHexToDecimalAndBinary(hexString) converting a hex string (e.g. `'FF'`) into its decimal number and 8-bit binary representation.",
    "eStarter": "function convertHexToDecimalAndBinary(hex) {\n  // Parse hex to decimal using parseInt(hex, 16), then format decimal to binary with padStart(8, '0').\n  // Return { hexInput: hex.toUpperCase(), decimalValue: dec, binaryRepresentation: bin, status: 'RADIX_CONVERTED' }\n  \n}",
    "eHint": "const dec = parseInt(hex, 16); const bin = dec.toString(2).padStart(8, '0'); return { hexInput: hex.toUpperCase(), decimalValue: dec, binaryRepresentation: bin, status: 'RADIX_CONVERTED' };",
    "eTest": "const ff = convertHexToDecimalAndBinary('FF'); // 255 -> '11111111'\nconst a0 = convertHexToDecimalAndBinary('A0'); // 160 -> '10100000'\nconst zero = convertHexToDecimalAndBinary('00'); // 0 -> '00000000'\nif (ff.decimalValue !== 255 || ff.binaryRepresentation !== '11111111' || a0.decimalValue !== 160 || zero.decimalValue !== 0) throw new Error('Hex conversion failed');",
    "aTitle": "Byte Size Unit Formatter",
    "aDesc": "Write formatBytesToKbOrMb(bytes) returning '<x> KB' if bytes < 1,048,576 (e.g. 2048 -> '2 KB'), or '<x> MB' if bytes >= 1,048,576 (e.g. 5242880 -> '5 MB').",
    "aStarter": "function formatBytesToKbOrMb(bytes) {\n  // If bytes >= 1048576 return `${Math.round(bytes / 1048576)} MB`, else `${Math.round(bytes / 1024)} KB`\n  \n}",
    "aHint": "Divide by 1024 for KB or 1048576 for MB: if (bytes >= 1048576) return Math.round(bytes / 1048576) + ' MB'; else return Math.round(bytes / 1024) + ' KB';",
    "aTest": "if (formatBytesToKbOrMb(2048) !== '2 KB') throw new Error('2048 bytes must be 2 KB');\nif (formatBytesToKbOrMb(10485760) !== '10 MB') throw new Error('10485760 bytes must be 10 MB');\nif (formatBytesToKbOrMb(5120) !== '5 KB') throw new Error('5120 bytes must be 5 KB');\nif (formatBytesToKbOrMb(1048576) !== '1 MB') throw new Error('1048576 bytes must be 1 MB');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Memory Hierarchy, TCP/IP Networking, DevTools & Data Encoding Engine",
    "desc": "Milestone 2: Build a complete systems networking and productivity master engine: AMAT memory cache latency ($10.0$ ns), /24 subnet usable hosts ($254$), DevTools sub-500ms network audit ($300$ ms), $66.7$ Net WPM touch typing, 3-2-1 backup certification, and `0xFF` hex conversion ($255$).",
    "syllabus": [
      "Core Foundations: Principles and architecture of ⭐ MILESTONE 2: Complete Memory Hierarchy, TCP/IP Networking, DevTools & Data Encoding Engine.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Systems Networking & Digital Productivity Master Engine",
    "eDesc": "Implement function executeSystemsProductivityMaster(amatOk, subnetOk, devtoolsOk, wpmOk, backupOk, encodingOk) certifying combined systems execution.",
    "eStarter": "function executeSystemsProductivityMaster(amat, subnet, devtools, wpm, backup, encoding) {\n  // Verify all 6 systems criteria evaluate to true.\n  // Return { memoryLatencyOptimized, subnettingVerified, webDevToolsCertified, typingProductivityVerified, threeTwoOneBackupCompliant, dataEncodingAccurate, engineStatus }\n  \n}",
    "eHint": "Check if all 6 inputs are true: const isNominal = amat && subnet && devtools && wpm && backup && encoding; status is 'SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE' if nominal, else 'SYSTEMS_DEFECT'.",
    "eTest": "const res = executeSystemsProductivityMaster(true, true, true, true, true, true);\nconst failWpm = executeSystemsProductivityMaster(true, true, true, false, true, true);\nconst failBackup = executeSystemsProductivityMaster(true, true, true, true, false, true);\nif (res.engineStatus !== 'SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE' || failWpm.engineStatus !== 'SYSTEMS_DEFECT' || failBackup.engineStatus !== 'SYSTEMS_DEFECT') throw new Error('Milestone 2 systems master failed');",
    "aTitle": "Systems Productivity Health Scorecard",
    "aDesc": "Write evaluateSystemsProductivity(amatNs, hostCount, loadTimeMs, netWpm) returning 'EXCELLENT' if amatNs <= 15, hostCount >= 254, loadTimeMs <= 500, and netWpm >= 60, otherwise 'NEEDS_IMPROVEMENT'.",
    "aStarter": "function evaluateSystemsProductivity(amatNs, hostCount, loadTimeMs, netWpm) {\n  // Check all 4 benchmarks: amatNs <= 15, hostCount >= 254, loadTimeMs <= 500, netWpm >= 60\n  \n}",
    "aHint": "if (amatNs <= 15 && hostCount >= 254 && loadTimeMs <= 500 && netWpm >= 60) return 'EXCELLENT'; else return 'NEEDS_IMPROVEMENT';",
    "aTest": "if (evaluateSystemsProductivity(10.0, 254, 300, 66.7) !== 'EXCELLENT') throw new Error('All benchmarks met must be EXCELLENT');\nif (evaluateSystemsProductivity(25.0, 254, 300, 66.7) !== 'NEEDS_IMPROVEMENT') throw new Error('Slow AMAT must be NEEDS_IMPROVEMENT');\nif (evaluateSystemsProductivity(10.0, 100, 300, 66.7) !== 'NEEDS_IMPROVEMENT') throw new Error('Low host count must be NEEDS_IMPROVEMENT');\nif (evaluateSystemsProductivity(10.0, 254, 800, 66.7) !== 'NEEDS_IMPROVEMENT') throw new Error('Slow page load must be NEEDS_IMPROVEMENT');\nif (evaluateSystemsProductivity(10.0, 254, 300, 40.0) !== 'NEEDS_IMPROVEMENT') throw new Error('Slow typing must be NEEDS_IMPROVEMENT');"
  },
  {
    "day": 16,
    "title": "Information Security & Digital Hygiene: Password Entropy (>= 64 bits) & MFA (TOTP)",
    "desc": "Protect your personal and organizational digital perimeter: Calculating Password Shannon Entropy ($Bits = L \\times \\log_2(N) \\ge 64$ bits of cryptographic strength), Multi-Factor Authentication (Time-based One-Time Passwords TOTP RFC 6238 vs FIDO2 WebAuthn Hardware Security Keys), Password Vaults, and Social Engineering Phishing Defense.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Information Security & Digital Hygiene: Password Entropy (>= 64 bits) & MFA (TOTP).",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Password Shannon Entropy & Strength Auditor",
    "eDesc": "Implement function calculatePasswordEntropy(passwordLength, characterPoolSize) calculating entropy bits ($Bits = L \\times \\log_2(N)$) and certifying military-grade entropy ($\\ge 64.0$ bits).",
    "eStarter": "function calculatePasswordEntropy(len, pool) {\n  // Calculate entropy = len * (Math.log(pool) / Math.log(2)). Certified strong if entropy >= 64.0.\n  // Return { passwordLength: len, characterPoolSize: pool, entropyBits: Number(entropy.toFixed(1)), isCryptographicallyStrong: boolean, status: string }\n  \n}",
    "eHint": "Entropy = len * (Math.log(pool) / Math.log(2)). Round to 1 decimal with toFixed(1). Strong if >= 64.0 bits.",
    "eTest": "const strong = calculatePasswordEntropy(12, 94); // 78.7 bits >= 64 -> Strong\nconst weak = calculatePasswordEntropy(6, 26); // 28.2 bits -> Weak\nconst medium = calculatePasswordEntropy(8, 62); // 47.6 bits -> Weak\nif (strong.entropyBits !== 78.7 || !strong.isCryptographicallyStrong || weak.isCryptographicallyStrong || medium.isCryptographicallyStrong) throw new Error('Entropy calculation failed');",
    "aTitle": "Password Complexity Strength Evaluator",
    "aDesc": "Write isPasswordComplex(password) returning true if password has length >= 8 and contains at least one uppercase letter, one lowercase letter, and one numeric digit.",
    "aStarter": "function isPasswordComplex(password) {\n  // Return true if length >= 8, has [A-Z], [a-z], and [0-9]\n  \n}",
    "aHint": "Check: password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);",
    "aTest": "if (isPasswordComplex('Pass1234') !== true) throw new Error('Pass1234 is complex');\nif (isPasswordComplex('short1A') !== false) throw new Error('short1A is too short (<8)');\nif (isPasswordComplex('alllowercase1') !== false) throw new Error('Missing uppercase letter');\nif (isPasswordComplex('ALLUPPERCASE1') !== false) throw new Error('Missing lowercase letter');\nif (isPasswordComplex('NoDigitsHere') !== false) throw new Error('Missing digit');"
  },
  {
    "day": 17,
    "title": "Operating System Security: User Account Control (UAC), Sudo & Firewalls",
    "desc": "Lock down workstations and servers against malware: The Principle of Least Privilege (PoLP), Standard User Accounts vs Administrator/Root, Windows User Account Control (UAC Prompts), POSIX `sudo` privilege escalation, Stateful Packet Inspection (SPI) Firewalls, and Application Sandboxing.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Operating System Security: User Account Control (UAC), Sudo & Firewalls.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Principle of Least Privilege (PoLP) Access Gatekeeper",
    "eDesc": "Implement function evaluatePrivilegeElevation(isRootRequired, isUserSudoAuthenticated, hasMultiFactorApproved) verifying if administrative privilege elevation is authorized.",
    "eStarter": "function evaluatePrivilegeElevation(rootReq, sudoAuth, mfaApproved) {\n  // If !rootReq return 'EXECUTE_AS_STANDARD_UNPRIVILEGED_USER'.\n  // If sudoAuth && mfaApproved return 'ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE', else 'ACCESS_DENIED_PRIVILEGE_ELEVATION_REJECTED'.\n  \n}",
    "eHint": "Check if (!rootReq) return 'EXECUTE_AS_STANDARD_UNPRIVILEGED_USER'; if (sudoAuth && mfaApproved) return 'ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE'; else return 'ACCESS_DENIED_PRIVILEGE_ELEVATION_REJECTED';",
    "eTest": "const standard = evaluatePrivilegeElevation(false, false, false);\nconst approved = evaluatePrivilegeElevation(true, true, true);\nconst deniedMfa = evaluatePrivilegeElevation(true, true, false);\nconst deniedSudo = evaluatePrivilegeElevation(true, false, true);\nif (standard !== 'EXECUTE_AS_STANDARD_UNPRIVILEGED_USER' || approved !== 'ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE' || deniedMfa !== 'ACCESS_DENIED_PRIVILEGE_ELEVATION_REJECTED' || deniedSudo !== 'ACCESS_DENIED_PRIVILEGE_ELEVATION_REJECTED') throw new Error('Privilege gate failed');",
    "aTitle": "Firewall Port Rule Evaluator",
    "aDesc": "Write isPortAllowedByFirewall(port, allowedPortsList, isFirewallEnabled) returning true if firewall is disabled or port is included in allowedPortsList, and false otherwise.",
    "aStarter": "function isPortAllowedByFirewall(port, allowedPorts, isEnabled) {\n  // Return true if !isEnabled or allowedPorts contains port\n  \n}",
    "aHint": "Check: return !isEnabled || allowedPorts.includes(port);",
    "aTest": "if (isPortAllowedByFirewall(443, [80, 443, 22], true) !== true) throw new Error('Allowed port 443 should pass');\nif (isPortAllowedByFirewall(3389, [80, 443], true) !== false) throw new Error('Blocked port 3389 must be rejected');\nif (isPortAllowedByFirewall(3389, [80, 443], false) !== true) throw new Error('Disabled firewall must allow all ports');\nif (isPortAllowedByFirewall(80, [80], true) !== true) throw new Error('Port 80 must pass');"
  },
  {
    "day": 18,
    "title": "Cryptography Fundamentals: Symmetric AES-256 vs Asymmetric RSA-4096 & SSH Keys",
    "desc": "Master the mathematical shields of modern computing: Symmetric Ciphers (AES-256: One shared secret key for ultra-fast bulk encryption), Asymmetric Public-Key Cryptography (RSA-4096 / Elliptic Curve Ed25519: Public key encrypts, Private key decrypts), Digital Signatures for non-repudiation, and Passwordless SSH Keypair Authentication.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Cryptography Fundamentals: Symmetric AES-256 vs Asymmetric RSA-4096 & SSH Keys.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Cryptographic Keypair Encryption & Decryption Simulator",
    "eDesc": "Implement function simulateAsymmetricKeyPair(isPublicKeyUsedForEncryption, isMatchingPrivateKeyProvidedForDecryption) validating asymmetric cryptographic workflows.",
    "eStarter": "function simulateAsymmetricKeyPair(pubEnc, privDec) {\n  // Asymmetric recovery succeeds only if pubEnc === true && privDec === true.\n  // Return { encryptedWithPublicKey: pubEnc, decryptedWithPrivateKey: privDec, isDataRecoveredSuccessfully: boolean, status: string }\n  \n}",
    "eHint": "const isSuccess = Boolean(pubEnc && privDec); status is 'ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL' if success, else 'CRYPTOGRAPHIC_FAILURE_INVALID_KEY'.",
    "eTest": "const pass = simulateAsymmetricKeyPair(true, true);\nconst failPriv = simulateAsymmetricKeyPair(true, false);\nconst failPub = simulateAsymmetricKeyPair(false, true);\nif (!pass.isDataRecoveredSuccessfully || failPriv.isDataRecoveredSuccessfully || failPub.isDataRecoveredSuccessfully || pass.status !== 'ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL') throw new Error('Crypto simulation failed');",
    "aTitle": "Cipher Key Size Strength Evaluator",
    "aDesc": "Write isCryptographicallySecureKeySize(cipherType, bitLength) returning true if (cipherType === 'AES' && bitLength >= 256) or (cipherType === 'RSA' && bitLength >= 3072), false otherwise.",
    "aStarter": "function isCryptographicallySecureKeySize(cipherType, bitLength) {\n  // Return true if AES >= 256 or RSA >= 3072, else false\n  \n}",
    "aHint": "if (cipherType === 'AES') return bitLength >= 256; if (cipherType === 'RSA') return bitLength >= 3072; return false;",
    "aTest": "if (isCryptographicallySecureKeySize('AES', 256) !== true) throw new Error('AES-256 is secure');\nif (isCryptographicallySecureKeySize('AES', 128) !== false) throw new Error('AES-128 is below 256-bit standard');\nif (isCryptographicallySecureKeySize('RSA', 4096) !== true) throw new Error('RSA-4096 is secure');\nif (isCryptographicallySecureKeySize('RSA', 2048) !== false) throw new Error('RSA-2048 is below 3072 standard');\nif (isCryptographicallySecureKeySize('DES', 56) !== false) throw new Error('DES is legacy insecure');"
  },
  {
    "day": 19,
    "title": "Hardware Peripherals & Display Interfaces: USB4, Thunderbolt 4 (40 Gbps) & HDMI 2.1",
    "desc": "Connect external hardware devices at maximum bandwidth: USB Protocol Evolution (USB 2.0 480 Mbps $\\to$ USB 3.2 Gen 2 10 Gbps $\\to$ USB4 / Thunderbolt 4 @ 40 Gbps with USB Type-C Power Delivery 100W/240W), DisplayPort 2.1 vs HDMI 2.1 ($48$ Gbps uncompressed 4K@120Hz), and GPU PCIe Gen 5 expansion.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Hardware Peripherals & Display Interfaces: USB4, Thunderbolt 4 (40 Gbps) & HDMI 2.1.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Peripheral Bus Bandwidth & Video Stream Throughput Auditor",
    "eDesc": "Implement function calculatePeripheralBandwidthGbps(interfaceType) returning theoretical maximum throughput in Gigabits per second (Gbps).",
    "eStarter": "function calculatePeripheralBandwidthGbps(interfaceType) {\n  // Map interfaceType (USB_2_0 -> 0.48, USB_3_2_GEN_2 -> 10.0, THUNDERBOLT_4 -> 40.0, USB4 -> 40.0, HDMI_2_1 -> 48.0, DISPLAYPORT_2_1 -> 80.0).\n  // Throw error if unknown. Return { interfaceType, bandwidthGbps: bw, isUltraHighSpeedFortyPlus: bw >= 40.0, status: 'PERIPHERAL_BANDWIDTH_MAPPED' }\n  \n}",
    "eHint": "Map interfaces: USB_2_0: 0.48, USB_3_2_GEN_2: 10.0, THUNDERBOLT_4: 40.0, USB4: 40.0, HDMI_2_1: 48.0, DISPLAYPORT_2_1: 80.0. Throw new Error('Unknown interface') if not found.",
    "eTest": "const tb4 = calculatePeripheralBandwidthGbps('THUNDERBOLT_4');\nconst hdmi = calculatePeripheralBandwidthGbps('HDMI_2_1');\nconst usb2 = calculatePeripheralBandwidthGbps('USB_2_0');\nlet threw = false;\ntry { calculatePeripheralBandwidthGbps('UNKNOWN'); } catch (e) { threw = true; }\nif (tb4.bandwidthGbps !== 40.0 || !tb4.isUltraHighSpeedFortyPlus || hdmi.bandwidthGbps !== 48.0 || usb2.bandwidthGbps !== 0.48 || !threw) throw new Error('Bandwidth calculation failed');",
    "aTitle": "File Transfer Duration Estimator",
    "aDesc": "Write estimateTransferSeconds(fileSizeGigabytes, interfaceSpeedGbps) calculating transfer time as (fileSizeGigabytes * 8) / interfaceSpeedGbps, returned rounded to 2 decimal places.",
    "aStarter": "function estimateTransferSeconds(fileSizeGb, speedGbps) {\n  // Convert Gigabytes to Gigabits (* 8) then divide by speedGbps, return rounded to 2 decimal places\n  \n}",
    "aHint": "const gigabits = fileSizeGb * 8; return Number((gigabits / speedGbps).toFixed(2));",
    "aTest": "if (estimateTransferSeconds(10, 40.0) !== 2.0) throw new Error('10GB over 40Gbps Thunderbolt must be 2.0s');\nif (estimateTransferSeconds(10, 0.48) !== 166.67) throw new Error('10GB over 480Mbps USB 2.0 must be 166.67s');\nif (estimateTransferSeconds(5, 10.0) !== 4.0) throw new Error('5GB over 10Gbps USB 3.2 must be 4.0s');\nif (estimateTransferSeconds(0, 40.0) !== 0.0) throw new Error('0GB must take 0.0s');"
  },
  {
    "day": 20,
    "title": "Software Installation & Package Managers: APT, Homebrew, Winget & PATH Variables",
    "desc": "Automate and standardize software deployments: The System `PATH` Environment Variable (How the shell resolves binary executables), CLI Package Managers (Linux `apt`, macOS `brew`, Windows `winget`/`choco`), Dependency Resolution Trees, Silent Unattended Installation Flags (`/S`, `-y`), and Checksum Verification.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Software Installation & Package Managers: APT, Homebrew, Winget & PATH Variables.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "System PATH Environment Binary Resolution Engine",
    "eDesc": "Implement function resolveBinaryInPath(commandName, pathDirectoriesArray, mockFilesystemMap) searching directories in `PATH` order and returning absolute path to the first executable match.",
    "eStarter": "function resolveBinaryInPath(cmd, pathDirs, fsMap) {\n  // Iterate pathDirs in order. For each dir, test `${dir}/${cmd}` in fsMap.\n  // If fsMap[fullPath] && fsMap[fullPath].isExecutable, return { command: cmd, resolvedPath: fullPath, isFound: true, status: 'BINARY_FOUND_IN_PATH' }.\n  // If not found, return { command: cmd, resolvedPath: null, isFound: false, status: 'COMMAND_NOT_FOUND' }.\n  \n}",
    "eHint": "Loop over pathDirs: const fullPath = `${dir}/${cmd}`; if (fsMap[fullPath]?.isExecutable) return { command: cmd, resolvedPath: fullPath, isFound: true, status: 'BINARY_FOUND_IN_PATH' };",
    "eTest": "const dirs = ['/usr/local/bin', '/usr/bin', '/bin'];\nconst fs = { '/usr/bin/git': { isExecutable: true }, '/bin/ls': { isExecutable: true } };\nconst res = resolveBinaryInPath('git', dirs, fs);\nconst lsRes = resolveBinaryInPath('ls', dirs, fs);\nconst fail = resolveBinaryInPath('unknown_tool', dirs, fs);\nif (res.resolvedPath !== '/usr/bin/git' || !res.isFound || lsRes.resolvedPath !== '/bin/ls' || fail.isFound) throw new Error('Path resolution failed');",
    "aTitle": "System PATH Environment String Builder",
    "aDesc": "Write appendToPathEnvironment(currentPathString, newDirectory) returning the updated PATH string with newDirectory appended (separated by ':') only if newDirectory is not already present.",
    "aStarter": "function appendToPathEnvironment(currentPath, newDir) {\n  // Split currentPath by ':', check if newDir exists; if not append and rejoin with ':'\n  \n}",
    "aHint": "const dirs = currentPath ? currentPath.split(':') : []; if (!dirs.includes(newDir)) dirs.push(newDir); return dirs.join(':');",
    "aTest": "if (appendToPathEnvironment('/usr/bin:/bin', '/usr/local/bin') !== '/usr/bin:/bin:/usr/local/bin') throw new Error('New directory must be appended');\nif (appendToPathEnvironment('/usr/bin:/bin', '/usr/bin') !== '/usr/bin:/bin') throw new Error('Existing directory should not be duplicated');\nif (appendToPathEnvironment('', '/opt/bin') !== '/opt/bin') throw new Error('Empty path should return new dir');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine",
    "desc": "Milestone 3: Build a complete systems security and peripheral master engine: 78.7-bit password Shannon entropy, PoLP sudo authentication, Asymmetric RSA/SSH keypair decryption, 40 Gbps Thunderbolt 4 throughput, and `/usr/bin/git` PATH resolution.",
    "syllabus": [
      "Core Foundations: Principles and architecture of ⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Systems Security & Peripherals Master Engine",
    "eDesc": "Implement function executeSecurityPeripheralsMaster(entropyOk, sudoOk, cryptoOk, tb4Ok, pathOk) certifying combined security execution.",
    "eStarter": "function executeSecurityPeripheralsMaster(entropy, sudo, crypto, tb4, path) {\n  // Check if all 5 security subsystems evaluate to true.\n  // Return { passwordEntropyVerified: entropy, privilegeElevationEnforced: sudo, cryptographyKeypairTested: crypto, peripheralBandwidthCertified: tb4, pathResolutionValidated: path, engineStatus: string }\n  \n}",
    "eHint": "const isNominal = entropy && sudo && crypto && tb4 && path; return { passwordEntropyVerified: entropy, privilegeElevationEnforced: sudo, cryptographyKeypairTested: crypto, peripheralBandwidthCertified: tb4, pathResolutionValidated: path, engineStatus: isNominal ? 'SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE' : 'SECURITY_DEFECT' };",
    "eTest": "const res = executeSecurityPeripheralsMaster(true, true, true, true, true);\nconst failEntropy = executeSecurityPeripheralsMaster(false, true, true, true, true);\nconst failSudo = executeSecurityPeripheralsMaster(true, false, true, true, true);\nif (res.engineStatus !== 'SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE' || failEntropy.engineStatus !== 'SECURITY_DEFECT' || failSudo.engineStatus !== 'SECURITY_DEFECT') throw new Error('Milestone 3 security master failed');",
    "aTitle": "Enterprise Security & Package Manager Auditor",
    "aDesc": "Write auditSecurityPosture(entropyBits, isSudoElevated, isCryptoValid, isPathClean) returning 'AUDIT_PASSED' if entropyBits >= 64, isSudoElevated is true, isCryptoValid is true, and isPathClean is true, otherwise 'AUDIT_FAILED'.",
    "aStarter": "function auditSecurityPosture(entropyBits, isSudo, isCrypto, isPath) {\n  // Return 'AUDIT_PASSED' if entropyBits >= 64 && isSudo && isCrypto && isPath, else 'AUDIT_FAILED'\n  \n}",
    "aHint": "if (entropyBits >= 64 && isSudo && isCrypto && isPath) return 'AUDIT_PASSED'; else return 'AUDIT_FAILED';",
    "aTest": "if (auditSecurityPosture(78.7, true, true, true) !== 'AUDIT_PASSED') throw new Error('Nominal posture must be AUDIT_PASSED');\nif (auditSecurityPosture(32.0, true, true, true) !== 'AUDIT_FAILED') throw new Error('Low entropy must fail audit');\nif (auditSecurityPosture(78.7, false, true, true) !== 'AUDIT_FAILED') throw new Error('Unauthenticated sudo must fail audit');\nif (auditSecurityPosture(78.7, true, false, true) !== 'AUDIT_FAILED') throw new Error('Invalid crypto must fail audit');"
  },
  {
    "day": 22,
    "title": "Virtualization & Containerization Basics: Type 1/2 Hypervisors vs Docker Isolation",
    "desc": "Isolate software environments for maximum stability: Hardware Virtualization (Type 1 Bare-Metal Hypervisors e.g. ESXi/KVM vs Type 2 Hosted Hypervisors e.g. VirtualBox), Full Virtual Machines with Guest OS overhead vs Lightweight OS-level Containerization (Docker, Linux Namespaces & Cgroups sharing host kernel with near-zero overhead).",
    "syllabus": [
      "Core Foundations: Principles and architecture of Virtualization & Containerization Basics: Type 1/2 Hypervisors vs Docker Isolation.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "VM vs Container Resource Overhead & Startup Time Evaluator",
    "eDesc": "Implement function compareVmVsContainerOverhead(isContainer) returning expected boot latency (seconds) and RAM overhead (MB).",
    "eStarter": "function compareVmVsContainerOverhead(isContainer) {\n  // If isContainer is true, return { architectureType: 'LIGHTWEIGHT_CONTAINER_CGROUPS', startupLatencySeconds: 0.5, memoryOverheadMb: 20, sharesHostKernel: true, status: 'CONTAINER_HIGH_EFFICIENCY' }.\n  // If false (VM), return { architectureType: 'FULL_GUEST_OS_VIRTUAL_MACHINE', startupLatencySeconds: 45.0, memoryOverheadMb: 2048, sharesHostKernel: false, status: 'VM_HEAVY_OVERHEAD' }.\n  \n}",
    "eHint": "Check if (isContainer) return container metrics (0.5s, 20MB, sharesHostKernel true); else return VM metrics (45s, 2048MB, sharesHostKernel false).",
    "eTest": "const c = compareVmVsContainerOverhead(true);\nconst vm = compareVmVsContainerOverhead(false);\nif (c.startupLatencySeconds !== 0.5 || !c.sharesHostKernel || c.memoryOverheadMb !== 20 || vm.startupLatencySeconds !== 45.0 || vm.sharesHostKernel || vm.memoryOverheadMb !== 2048) throw new Error('Virtualization comparison failed');",
    "aTitle": "Container Server Density Calculator",
    "aDesc": "Write calculateServerInstanceCapacity(totalServerRamMb, ramPerInstanceMb, isContainer) returning total runnable instances: containers have 20MB overhead per instance, VMs have 2048MB guest OS overhead per instance.",
    "aStarter": "function calculateServerInstanceCapacity(totalRamMb, appRamMb, isContainer) {\n  // Total cost per instance = appRamMb + (isContainer ? 20 : 2048). Return Math.floor(totalRamMb / costPerInstance)\n  \n}",
    "aHint": "const overhead = isContainer ? 20 : 2048; return Math.floor(totalRamMb / (appRamMb + overhead));",
    "aTest": "if (calculateServerInstanceCapacity(16384, 100, true) !== 136) throw new Error('16GB server with 100MB container apps (+20MB overhead) must run 136 instances');\nif (calculateServerInstanceCapacity(16384, 100, false) !== 7) throw new Error('16GB server with 100MB VM apps (+2048MB overhead) can only run 7 instances');\nif (calculateServerInstanceCapacity(1024, 500, false) !== 0) throw new Error('Cannot run VM when total RAM < app + 2048MB overhead');"
  },
  {
    "day": 23,
    "title": "Troubleshooting & Diagnostic Methodology: The 7-Step Systematic IT Protocol",
    "desc": "Diagnose and resolve any digital glitch methodically: The 7-Step Technical Troubleshooting Protocol: 1. Identify Symptom $\\to$ 2. Reproduce Problem $\\to$ 3. Formulate Hypothesis $\\to$ 4. Test Hypothesis $\\to$ 5. Implement Plan of Action $\\to$ 6. Verify Full System Functionality $\\to$ 7. Document Findings & Root Cause.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Troubleshooting & Diagnostic Methodology: The 7-Step Systematic IT Protocol.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Systematic 7-Step Troubleshooting Protocol Orchestrator",
    "eDesc": "Implement function validateTroubleshootingProtocol(stepCompletedCount) verifying if IT diagnostic workflow completed all 7 sequential steps.",
    "eStarter": "function validateTroubleshootingProtocol(stepsCount) {\n  // Check if stepsCount === 7. Return { stepsCompletedCount: stepsCount, isDiagnosticProtocolCertified: boolean, status: string }\n  \n}",
    "eHint": "const isComplete = stepsCount === 7; return { stepsCompletedCount: stepsCount, isDiagnosticProtocolCertified: isComplete, status: isComplete ? 'SEVEN_STEP_TROUBLESHOOTING_PROTOCOL_CERTIFIED_NOMINAL' : 'INCOMPLETE_DIAGNOSTIC_INVESTIGATION' };",
    "eTest": "const pass = validateTroubleshootingProtocol(7);\nconst fail = validateTroubleshootingProtocol(5);\nconst zero = validateTroubleshootingProtocol(0);\nif (!pass.isDiagnosticProtocolCertified || fail.isDiagnosticProtocolCertified || zero.isDiagnosticProtocolCertified || pass.status !== 'SEVEN_STEP_TROUBLESHOOTING_PROTOCOL_CERTIFIED_NOMINAL') throw new Error('Troubleshooting check failed');",
    "aTitle": "IT Troubleshooting Next Step Resolver",
    "aDesc": "Write getNextTroubleshootingStep(stepNumber) returning step name: 1->'IDENTIFY_PROBLEM', 2->'REPRODUCE_ISSUE', 3->'FORMULATE_HYPOTHESIS', 4->'TEST_HYPOTHESIS', 5->'IMPLEMENT_PLAN', 6->'VERIFY_FUNCTIONALITY', 7->'DOCUMENT_FINDINGS', and 'INVALID_STEP' otherwise.",
    "aStarter": "function getNextTroubleshootingStep(stepNum) {\n  // Return matching step string for step numbers 1 to 7, or 'INVALID_STEP'\n  \n}",
    "aHint": "const steps = ['IDENTIFY_PROBLEM', 'REPRODUCE_ISSUE', 'FORMULATE_HYPOTHESIS', 'TEST_HYPOTHESIS', 'IMPLEMENT_PLAN', 'VERIFY_FUNCTIONALITY', 'DOCUMENT_FINDINGS']; return steps[stepNum - 1] || 'INVALID_STEP';",
    "aTest": "if (getNextTroubleshootingStep(1) !== 'IDENTIFY_PROBLEM') throw new Error('Step 1 failed');\nif (getNextTroubleshootingStep(7) !== 'DOCUMENT_FINDINGS') throw new Error('Step 7 failed');\nif (getNextTroubleshootingStep(4) !== 'TEST_HYPOTHESIS') throw new Error('Step 4 failed');\nif (getNextTroubleshootingStep(0) !== 'INVALID_STEP') throw new Error('Step 0 must be invalid');\nif (getNextTroubleshootingStep(8) !== 'INVALID_STEP') throw new Error('Step 8 must be invalid');"
  },
  {
    "day": 24,
    "title": "Automation Scripting for Power Users: Bash / PowerShell Logic & Cron Schedulers",
    "desc": "Automate repetitive digital tasks like an elite systems engineer: Writing Bash & PowerShell Scripts, Variables, Exit Status Codes (`exit 0` success vs `exit 1` error), Conditional `if-else` Logic, File Loops, and Recurring Schedule Automation (Unix Cron Syntax `0 2 * * *` = Run 2:00 AM daily).",
    "syllabus": [
      "Core Foundations: Principles and architecture of Automation Scripting for Power Users: Bash / PowerShell Logic & Cron Schedulers.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Script Exit Status & Error Code Handler",
    "eDesc": "Implement function evaluateScriptExecution(exitCode) validating execution status based on POSIX exit codes ($0 = Success, >0 = Error).",
    "eStarter": "function evaluateScriptExecution(code) {\n  // Success if code === 0. Return { exitCode: code, isExecutionSuccessful: boolean, status: string }\n  \n}",
    "eHint": "const isSuccess = code === 0; return { exitCode: code, isExecutionSuccessful: isSuccess, status: isSuccess ? 'SCRIPT_EXECUTION_COMPLETED_SUCCESSFULLY_EXIT_ZERO' : 'SCRIPT_EXECUTION_FAILED_NON_ZERO_EXIT_CODE' };",
    "eTest": "const pass = evaluateScriptExecution(0);\nconst fail = evaluateScriptExecution(127); // Command not found\nconst fail1 = evaluateScriptExecution(1); // General error\nif (!pass.isExecutionSuccessful || fail.isExecutionSuccessful || fail1.isExecutionSuccessful || pass.status !== 'SCRIPT_EXECUTION_COMPLETED_SUCCESSFULLY_EXIT_ZERO') throw new Error('Script execution evaluation failed');",
    "aTitle": "Cron Expression Builder & Validator",
    "aDesc": "Write buildDailyCronExpression(hour, minute, scriptPath) returning 'minute hour * * * scriptPath' if hour is 0-23 and minute is 0-59, otherwise throwing an Error('Invalid cron time').",
    "aStarter": "function buildDailyCronExpression(hour, minute, scriptPath) {\n  // Validate hour in [0, 23] and minute in [0, 59], return `${minute} ${hour} * * * ${scriptPath}`\n  \n}",
    "aHint": "if (hour < 0 || hour > 23 || minute < 0 || minute > 59) throw new Error('Invalid cron time'); return `${minute} ${hour} * * * ${scriptPath}`;",
    "aTest": "if (buildDailyCronExpression(2, 0, '/backup.sh') !== '0 2 * * * /backup.sh') throw new Error('2:00 AM cron line failed');\nif (buildDailyCronExpression(14, 30, '/sync.sh') !== '30 14 * * * /sync.sh') throw new Error('14:30 cron line failed');\nlet threw = false;\ntry { buildDailyCronExpression(25, 0, '/err.sh'); } catch (e) { threw = true; }\nif (!threw) throw new Error('Hour 25 must throw error');\nlet threwMin = false;\ntry { buildDailyCronExpression(12, 60, '/err.sh'); } catch (e) { threwMin = true; }\nif (!threwMin) throw new Error('Minute 60 must throw error');"
  },
  {
    "day": 25,
    "title": "Office Productivity Suites & Macro Automation: Spreadsheet Formulas & VLOOKUP",
    "desc": "Master the foundational business software powering global commerce: Spreadsheet Mathematical Functions (`SUM`, `AVERAGE`, `IF`, `VLOOKUP`/`XLOOKUP`), Dynamic Cell Referencing (Absolute `$A$1` vs Relative `A1`), Pivot Tables, Document Version Tracking, and Keyboard-Driven Office Workflows.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Office Productivity Suites & Macro Automation: Spreadsheet Formulas & VLOOKUP.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Spreadsheet XLOOKUP Key-Value Search Simulator",
    "eDesc": "Implement function simulateXlookup(lookupKey, tableArray, keyColumn, returnColumn) finding exact match and returning target value.",
    "eStarter": "function simulateXlookup(key, table, keyCol, retCol) {\n  // Find row in table where row[keyCol] === key. Return { found: boolean, value: matchedValue, status: string }\n  \n}",
    "eHint": "const row = table.find(r => r[keyCol] === key); if (!row) return { found: false, value: null, status: 'N/A_NOT_FOUND' }; return { found: true, value: row[retCol], status: 'XLOOKUP_EXACT_MATCH_FOUND' };",
    "eTest": "const data = [{ id: 'E101', name: 'Alice', salary: 90000 }, { id: 'E102', name: 'Bob', salary: 80000 }];\nconst res = simulateXlookup('E101', data, 'id', 'salary');\nconst missing = simulateXlookup('E999', data, 'id', 'salary');\nconst nameRes = simulateXlookup('E102', data, 'id', 'name');\nif (res.value !== 90000 || !res.found || missing.found || nameRes.value !== 'Bob') throw new Error('XLOOKUP simulation failed');",
    "aTitle": "Spreadsheet Sales Tax & Gross Total Calculator",
    "aDesc": "Write calculateSpreadsheetGross(itemsArray, taxRatePercent) returning an object { subtotal: number, taxAmount: number, grandTotal: number } rounded to 2 decimal places.",
    "aStarter": "function calculateSpreadsheetGross(items, taxRate) {\n  // Sum items (item.price * item.quantity), calculate taxAmount, return { subtotal, taxAmount, grandTotal }\n  \n}",
    "aHint": "const subtotal = items.reduce((acc, it) => acc + (it.price * it.quantity), 0); const taxAmount = subtotal * (taxRate / 100); return { subtotal: Number(subtotal.toFixed(2)), taxAmount: Number(taxAmount.toFixed(2)), grandTotal: Number((subtotal + taxAmount).toFixed(2)) };",
    "aTest": "const items = [{ price: 50, quantity: 2 }, { price: 20, quantity: 1 }]; // Subtotal = 120\nconst res = calculateSpreadsheetGross(items, 10);\nif (res.subtotal !== 120 || res.taxAmount !== 12 || res.grandTotal !== 132) throw new Error('Spreadsheet calculation failed');\nconst empty = calculateSpreadsheetGross([], 10);\nif (empty.subtotal !== 0 || empty.grandTotal !== 0) throw new Error('Empty items must produce 0 total');"
  },
  {
    "day": 26,
    "title": "Data Privacy & Digital Footprint: VPN Tunnels, DNS-over-HTTPS & Cookie Tracking",
    "desc": "Reclaim your privacy on the modern web: Third-Party Tracking Cookies vs First-Party, Browser Canvas Fingerprinting, Encrypted DNS (DNS-over-HTTPS DoH / DNS-over-TLS DoT: Hiding browsing domains from local ISPs), Virtual Private Network (VPN) WireGuard Encrypted Tunnels, and GDPR/CCPA Privacy Rights.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Data Privacy & Digital Footprint: VPN Tunnels, DNS-over-HTTPS & Cookie Tracking.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "DNS-over-HTTPS (DoH) Privacy & Encryption Auditor",
    "eDesc": "Implement function auditDnsSecurity(isDnsOverHttpsEnabled, isVpnTunnelActive) verifying if browsing metadata is protected from ISP interception.",
    "eStarter": "function auditDnsSecurity(doh, vpn) {\n  // Digital footprint is shielded only if both doh and vpn evaluate to true.\n  // Return { dnsEncryptedDoH: doh, vpnTunnelActive: vpn, isDigitalFootprintMasked: boolean, status: string }\n  \n}",
    "eHint": "const isPrivate = Boolean(doh && vpn); return { dnsEncryptedDoH: doh, vpnTunnelActive: vpn, isDigitalFootprintMasked: isPrivate, status: isPrivate ? 'DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE' : 'METADATA_EXPOSED_TO_ISP' };",
    "eTest": "const pass = auditDnsSecurity(true, true);\nconst failDoh = auditDnsSecurity(false, true);\nconst failVpn = auditDnsSecurity(true, false);\nif (!pass.isDigitalFootprintMasked || failDoh.isDigitalFootprintMasked || failVpn.isDigitalFootprintMasked || pass.status !== 'DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE') throw new Error('DNS audit failed');",
    "aTitle": "Digital Privacy Scorecard Evaluator",
    "aDesc": "Write calculatePrivacyScore(hasVpn, hasDoh, blocksTrackers) returning numerical score out of 100: 40 points for VPN, 30 points for DoH, and 30 points for tracker blocking.",
    "aStarter": "function calculatePrivacyScore(hasVpn, hasDoh, blocksTrackers) {\n  // Calculate score: (hasVpn ? 40 : 0) + (hasDoh ? 30 : 0) + (blocksTrackers ? 30 : 0)\n  \n}",
    "aHint": "let score = 0; if (hasVpn) score += 40; if (hasDoh) score += 30; if (blocksTrackers) score += 30; return score;",
    "aTest": "if (calculatePrivacyScore(true, true, true) !== 100) throw new Error('Full privacy stack must score 100');\nif (calculatePrivacyScore(true, false, false) !== 40) throw new Error('VPN only must score 40');\nif (calculatePrivacyScore(false, true, true) !== 60) throw new Error('DoH + Tracker blocking must score 60');\nif (calculatePrivacyScore(false, false, false) !== 0) throw new Error('No privacy protection must score 0');"
  },
  {
    "day": 27,
    "title": "Remote Work Tools & Collaboration Infrastructure: SSH, RDP & Cloud VDI",
    "desc": "Collaborate seamlessly across distributed teams: Secure Shell (SSH Remote Terminal Access), Remote Desktop Protocol (RDP Port 3389), Virtual Desktop Infrastructure (Cloud VDI e.g. Amazon WorkSpaces), Bandwidth Quality of Service (QoS for Video Conferencing), and Asynchronous Collaboration Hygiene.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Remote Work Tools & Collaboration Infrastructure: SSH, RDP & Cloud VDI.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Remote Work Network Bandwidth & Latency Evaluator",
    "eDesc": "Implement function evaluateRemoteWorkConnection(downloadSpeedMbps, latencyPingMs) verifying if home network supports HD video conferencing and cloud VDI (Download $\\ge 50.0$ Mbps, Ping $\\le 30.0$ ms).",
    "eStarter": "function evaluateRemoteWorkConnection(speedMbps, pingMs) {\n  // Nominal if speedMbps >= 50.0 && pingMs <= 30.0.\n  // Return { downloadMbps: speedMbps, latencyPingMs: pingMs, isRemoteConnectionNominal: boolean, status: string }\n  \n}",
    "eHint": "const isNominal = speedMbps >= 50.0 && pingMs <= 30.0; return { downloadMbps: speedMbps, latencyPingMs: pingMs, isRemoteConnectionNominal: isNominal, status: isNominal ? 'REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL' : 'UNSTABLE_HIGH_LATENCY_CONNECTION' };",
    "eTest": "const pass = evaluateRemoteWorkConnection(100.0, 15.0);\nconst slowSpeed = evaluateRemoteWorkConnection(15.0, 20.0);\nconst highPing = evaluateRemoteWorkConnection(100.0, 120.0);\nif (!pass.isRemoteConnectionNominal || slowSpeed.isRemoteConnectionNominal || highPing.isRemoteConnectionNominal || pass.status !== 'REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL') throw new Error('Remote connection evaluation failed');",
    "aTitle": "SSH Remote Login Command Generator",
    "aDesc": "Write generateSshCommand(username, hostname, port, privateKeyPath) returning 'ssh <username>@<hostname>' (if port is 22 and no key), or adding ' -p <port>' and ' -i <key>' when provided.",
    "aStarter": "function generateSshCommand(user, host, port, keyPath) {\n  // Format ssh command string with optional -p and -i flags\n  \n}",
    "aHint": "let cmd = `ssh ${user}@${host}`; if (port && port !== 22) cmd += ` -p ${port}`; if (keyPath) cmd += ` -i ${keyPath}`; return cmd;",
    "aTest": "if (generateSshCommand('ubuntu', '192.168.1.50', 22, null) !== 'ssh ubuntu@192.168.1.50') throw new Error('Standard port 22 command failed');\nif (generateSshCommand('admin', 'server.pinit.app', 2222, null) !== 'ssh admin@server.pinit.app -p 2222') throw new Error('Custom port 2222 command failed');\nif (generateSshCommand('dev', 'cloud.pinit.app', 22, '~/.ssh/id_rsa') !== 'ssh dev@cloud.pinit.app -i ~/.ssh/id_rsa') throw new Error('Keypath command failed');\nif (generateSshCommand('dev', 'cloud.pinit.app', 2222, '~/.ssh/id_rsa') !== 'ssh dev@cloud.pinit.app -p 2222 -i ~/.ssh/id_rsa') throw new Error('Port + key command failed');"
  },
  {
    "day": 28,
    "title": "Hardware Maintenance, Thermals & Power Management: Thermal Throttling & UPS",
    "desc": "Maintain hardware longevity and prevent unexpected outages: CPU Junction Temperatures ($T_j \\le 85^\\circ\\text{C}$), Thermal Paste Degradation & Liquid Cooling Loops, Power Supply Unit (PSU) 80-Plus Efficiency Ratings (Bronze, Gold, Platinum $\\ge 90\\%$), and Uninterruptible Power Supply (UPS) Battery Runtime.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Hardware Maintenance, Thermals & Power Management: Thermal Throttling & UPS.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "CPU Thermal Junction Throttling Auditor",
    "eDesc": "Implement function auditCpuThermals(currentTempCelsius, maxJunctionTempCelsius) evaluating if CPU is operating within safe thermal margins ($Temp \\le Max - 10^\\circ\\text{C}$).",
    "eStarter": "function auditCpuThermals(temp, maxTemp) {\n  // isThrottling if temp >= (maxTemp - 5). isSafe if temp <= (maxTemp - 15).\n  // Return { currentTemperatureCelsius: temp, maxJunctionTemperatureCelsius: maxTemp, isThermalThrottlingActive: boolean, isOperatingSafeAndCool: boolean, status: string }\n  \n}",
    "eHint": "const isThrottling = temp >= (maxTemp - 5); const isSafe = temp <= (maxTemp - 15); return { currentTemperatureCelsius: temp, maxJunctionTemperatureCelsius: maxTemp, isThermalThrottlingActive: isThrottling, isOperatingSafeAndCool: isSafe, status: isThrottling ? 'CRITICAL_THERMAL_THROTTLING_ACTIVE' : (isSafe ? 'CPU_THERMALS_COOL_AND_NOMINAL' : 'ELEVATED_TEMPERATURE_WARNING') };",
    "eTest": "const cool = auditCpuThermals(65, 100); // Safe and cool\nconst hot = auditCpuThermals(98, 100); // Throttling\nconst warning = auditCpuThermals(90, 100); // Elevated\nif (!cool.isOperatingSafeAndCool || cool.isThermalThrottlingActive || !hot.isThermalThrottlingActive || warning.status !== 'ELEVATED_TEMPERATURE_WARNING') throw new Error('Thermal audit failed');",
    "aTitle": "UPS Battery Runtime Calculator",
    "aDesc": "Write calculateUpsRuntimeMinutes(batteryWattHours, loadWatts, efficiencyPercent) calculating runtime in minutes as ((batteryWattHours * (efficiencyPercent / 100)) / loadWatts) * 60, returned rounded to 1 decimal place.",
    "aStarter": "function calculateUpsRuntimeMinutes(batteryWh, loadWatts, efficiencyPct) {\n  // Compute available watt-hours, divide by loadWatts, multiply by 60 for minutes, round to 1 decimal\n  \n}",
    "aHint": "const availableWh = batteryWh * (efficiencyPct / 100); return Number(((availableWh / loadWatts) * 60).toFixed(1));",
    "aTest": "if (calculateUpsRuntimeMinutes(500, 250, 90) !== 108.0) throw new Error('500Wh at 250W (90% eff) must be 108.0 minutes');\nif (calculateUpsRuntimeMinutes(300, 150, 80) !== 96.0) throw new Error('300Wh at 150W (80% eff) must be 96.0 minutes');\nif (calculateUpsRuntimeMinutes(1000, 500, 100) !== 120.0) throw new Error('1000Wh at 500W (100% eff) must be 120.0 minutes');"
  },
  {
    "day": 29,
    "title": "Sustainable Computing & E-Waste: DoD 5220.22-M 7-Pass Data Sanitization",
    "desc": "Practice environmentally and legally responsible hardware lifecycle management: Energy Star Standby Power Ratings, Cloud Carbon Intensity (gCO2e/kWh), Hardware Refurbishment vs Safe Recycling, and Department of Defense (DoD 5220.22-M) 7-Pass Drive Overwrite Sanitization before disposal.",
    "syllabus": [
      "Core Foundations: Principles and architecture of Sustainable Computing & E-Waste: DoD 5220.22-M 7-Pass Data Sanitization.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "DoD 5220.22-M 7-Pass Storage Drive Sanitization Simulator",
    "eDesc": "Implement function simulateDodSanitization(completedPassesCount) verifying if drive overwrite satisfies the 7-pass military sanitization standard ($Passes = 7$).",
    "eStarter": "function simulateDodSanitization(passes) {\n  // Certified if passes === 7.\n  // Return { overwritePassesCompleted: passes, isDodSanitizationCertified: boolean, status: string }\n  \n}",
    "eHint": "const isCertified = passes === 7; return { overwritePassesCompleted: passes, isDodSanitizationCertified: isCertified, status: isCertified ? 'DOD_5220_22_M_SEVEN_PASS_SANITIZATION_CERTIFIED_ZERO_DATA_REMANENCE' : 'INCOMPLETE_SANITIZATION_DATA_LEAK_RISK' };",
    "eTest": "const pass = simulateDodSanitization(7);\nconst fail = simulateDodSanitization(3);\nconst zero = simulateDodSanitization(0);\nif (!pass.isDodSanitizationCertified || fail.isDodSanitizationCertified || zero.isDodSanitizationCertified || pass.status !== 'DOD_5220_22_M_SEVEN_PASS_SANITIZATION_CERTIFIED_ZERO_DATA_REMANENCE') throw new Error('Sanitization simulation failed');",
    "aTitle": "Data Sanitization Progress & Standard Validator",
    "aDesc": "Write validateDriveSanitization(passesCompleted, targetStandard) returning true if passesCompleted >= 7 for 'DOD_5220_22_M' or passesCompleted >= 1 for 'NIST_800_88_CLEAR', false otherwise.",
    "aStarter": "function validateDriveSanitization(passes, standard) {\n  // Return true if DoD standard has >= 7 passes or NIST standard has >= 1 pass, else false\n  \n}",
    "aHint": "if (standard === 'DOD_5220_22_M') return passes >= 7; if (standard === 'NIST_800_88_CLEAR') return passes >= 1; return false;",
    "aTest": "if (validateDriveSanitization(7, 'DOD_5220_22_M') !== true) throw new Error('7 passes on DoD standard must be certified');\nif (validateDriveSanitization(3, 'DOD_5220_22_M') !== false) throw new Error('3 passes on DoD standard is incomplete');\nif (validateDriveSanitization(1, 'NIST_800_88_CLEAR') !== true) throw new Error('1 pass on NIST standard is certified');\nif (validateDriveSanitization(0, 'NIST_800_88_CLEAR') !== false) throw new Error('0 passes is incomplete');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Computer Literacy & OS Operating System Suite",
    "desc": "Final Capstone Synthesis: The complete sovereign digital productivity and computer operating system suite: 1. Hardware & OS Foundations (25,600 MB/s memory bus, Ring 0 system calls, 755 chmod octal decoding, and Unix grep pipelines); 2. Systems Networking & Storage (10ns AMAT memory cache, /24 subnetting, 300ms Web DevTools, 66.7 WPM touch typing, and 3-2-1 backup compliance); 3. Security & Peripherals (78.7-bit password entropy, PoLP sudo authentication, RSA asymmetric keys, 40 Gbps Thunderbolt 4, and PATH resolution); 4. Modern Workflows & Virtualization (0.5s Docker container isolation, 7-Step troubleshooting protocol, exit 0 bash scripts, XLOOKUP simulation, and DoH privacy protection); 5. Maintenance & Sustainability (65°C cool thermals, 100 Mbps remote work connection, and DoD 5220.22-M 7-pass data sanitization).",
    "syllabus": [
      "Core Foundations: Principles and architecture of 🏆 FINAL CAPSTONE: Sovereign Computer Literacy & OS Operating System Suite.",
      "Practical Applications: Formulas, CLI tools, and operating system mechanics.",
      "Professional Best Practices: System security, digital productivity, and enterprise IT standards."
    ],
    "eTitle": "Sovereign Computer Literacy & OS Master Suite Orchestrator",
    "eDesc": "Implement function orchestrateComputerMasterSuite(foundationsOk, systemsOk, securityOk, workflowsOk, maintenanceOk) certifying comprehensive computer literacy and OS fundamentals mastery.",
    "eStarter": "function orchestrateComputerMasterSuite(foundations, systems, security, workflows, maintenance) {\n  // Verify that all 5 computing pillars evaluate to true.\n  // Return { computingFoundationsModule: foundations, systemsNetworkingModule: systems, systemsSecurityModule: security, modernWorkflowsModule: workflows, maintenanceSustainabilityModule: maintenance, sovereignComputerMasterCertified: boolean, certified: boolean, status: string }\n  \n}",
    "eHint": "const isCertified = foundations && systems && security && workflows && maintenance; return { computingFoundationsModule: foundations, systemsNetworkingModule: systems, systemsSecurityModule: security, modernWorkflowsModule: workflows, maintenanceSustainabilityModule: maintenance, sovereignComputerMasterCertified: isCertified, certified: true, status: isCertified ? 'SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL' : 'COMPUTER_SUITE_DEFECT' };",
    "eTest": "const ok = orchestrateComputerMasterSuite(true, true, true, true, true);\nconst fail = orchestrateComputerMasterSuite(true, true, false, true, true);\nconst failWorkflows = orchestrateComputerMasterSuite(true, true, true, false, true);\nif (!ok.sovereignComputerMasterCertified || fail.sovereignComputerMasterCertified || failWorkflows.sovereignComputerMasterCertified || !ok.certified || ok.status !== 'SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL') throw new Error('Capstone orchestrator failed');",
    "aTitle": "Sovereign Systems Audit Report Generator",
    "aDesc": "Write generateSystemAuditReport(systemName, passedModulesCount, totalModulesCount) returning an object { systemName, scorePercentage: string ('100.0%'), isCertified: boolean, status: string }.",
    "aStarter": "function generateSystemAuditReport(name, passed, total) {\n  // Calculate percentage = ((passed / total) * 100).toFixed(1) + '%'\n  // Return { systemName: name, scorePercentage, isCertified: passed === total, status: passed === total ? 'CERTIFIED_SOVEREIGN_SYSTEM' : 'NEEDS_REMEDIATION' }\n  \n}",
    "aHint": "const pct = ((passed / total) * 100).toFixed(1) + '%'; const certified = passed === total; return { systemName: name, scorePercentage: pct, isCertified: certified, status: certified ? 'CERTIFIED_SOVEREIGN_SYSTEM' : 'NEEDS_REMEDIATION' };",
    "aTest": "const cert = generateSystemAuditReport('PinIT OS', 5, 5);\nif (!cert.isCertified || cert.scorePercentage !== '100.0%' || cert.status !== 'CERTIFIED_SOVEREIGN_SYSTEM') throw new Error('100% audit failed');\nconst partial = generateSystemAuditReport('Legacy Workstation', 4, 5);\nif (partial.isCertified || partial.scorePercentage !== '80.0%' || partial.status !== 'NEEDS_REMEDIATION') throw new Error('Partial audit failed');\nconst zero = generateSystemAuditReport('Broken Node', 0, 5);\nif (zero.isCertified || zero.scorePercentage !== '0.0%') throw new Error('Zero audit failed');"
  }
];

export const COMPUTER_FUNDAMENTALS_30_DAYS_QUESTS: CourseQuest[] = COMPUTER_FUNDAMENTALS_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('comp_fund', idx + 1, cfg)
);
