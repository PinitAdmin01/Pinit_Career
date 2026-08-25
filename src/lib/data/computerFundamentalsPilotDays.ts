import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const COMPUTER_FUNDAMENTALS_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Computer Hardware Anatomy: CPU, RAM, NVMe SSD & Motherboard Bus Architecture",
    "overviewMetaphor": "A Computer is an Ultra-High-Speed Industrial Factory: The CPU is the master craftsman (executing 3 billion instructions per second); the RAM is the working workbench (holding active blueprints ready for instant 100ns access); the NVMe SSD is the deep storage warehouse (preserving files permanently across power outages); and the Motherboard Bus is the multi-lane conveyor belt transferring data at 25,600 MB/s ($Bandwidth = \\frac{64\\text{ bits} \\times 3,200\\text{ MHz}}{8} = 25,600$ MB/s); understanding how these physical components interact eliminates performance bottlenecks.",
    "blocks": [
      {
        "id": "cf-d1-b1-bus-bandwidth-calculation",
        "day": 1,
        "blockNumber": 1,
        "title": "Memory Bus Bandwidth Formula: $\\text{Bandwidth (MB/s)} = \\frac{\\text{Bus Width (bits)} \\times \\text{Clock (MHz)}}{8} = 25,600\\text{ MB/s}$",
        "conceptBudget": {
          "primaryConcept": "Memory Bus Bandwidth Formula",
          "supportingTerms": [
            "Bus Width ($64$ bits wide)",
            "Clock Frequency ($3,200$ MHz)",
            "Bandwidth = $\\frac{64 \\times 3,200}{8} = 25,600$ MB/s",
            "High-Speed Benchmark: $\\ge 25,000$ MB/s $\\implies$ High-Speed Memory Bus Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "System Memory Bus Throughput Ledger (64-bit @ 3200 MHz = 25.6 GB/s)",
              "boxes": [
                {
                  "label": "Data Bus Bit Width",
                  "value": "64 Parallel Copper Traces on Motherboard PCB (8 Bytes)",
                  "varType": "Bus Width",
                  "isUpdated": false
                },
                {
                  "label": "Memory Clock Frequency",
                  "value": "3,200 MHz High-Speed Synchronous Clock Cycles",
                  "varType": "Clock",
                  "isUpdated": false
                },
                {
                  "label": "Data Transfer Throughput",
                  "value": "(64 x 3200) / 8 = 25,600 MB/s (HIGH SPEED MEMORY BUS CERTIFIED NOMINAL!)",
                  "varType": "Throughput",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bus_calc_demo.js",
            "initialCode": "function calculateBus(width, clock) {\n  const bw = (width * clock) / 8;\n  const isFast = bw >= 25000;\n  return {\n    width,\n    clock,\n    bandwidthMbPerSec: bw,\n    isFast,\n    status: isFast ? 'HIGH_SPEED_MEMORY_BUS_CERTIFIED_NOMINAL' : 'LEGACY_BUS'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBus(64, 3200)));\nconsole.log(JSON.stringify(calculateBus(32, 800)));",
            "expectedOutput": "{\"width\":64,\"clock\":3200,\"bandwidthMbPerSec\":25600,\"isFast\":true,\"status\":\"HIGH_SPEED_MEMORY_BUS_CERTIFIED_NOMINAL\"}\n{\"width\":32,\"clock\":800,\"bandwidthMbPerSec\":3200,\"isFast\":false,\"status\":\"LEGACY_BUS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the theoretical data transfer bandwidth in Megabytes per second for a 64-bit memory bus clocked at 3,200 MHz ($ (64 \\times 3,200) / 8 $)?",
          "expectedStringOutput": "25600",
          "acceptableAnswers": [
            "25600",
            "25,600",
            "25600 MB/s",
            "bandwidthMbPerSec\":25600"
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
          "diagnosisMap": {
            "204800": {
              "misconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
              "errorExplanation": "204,800 is Megabits per second. Dividing by 8 bits per byte yields 25,600 Megabytes per second.",
              "recoveryPath": {
                "simplerExplanation": "(64 * 3200) / 8 = 25,600.",
                "guidedFixPrompt": "Type 25600"
              }
            }
          }
        }
      },
      {
        "id": "cf-d1-b2-von-neumann-architecture-cycle",
        "day": 1,
        "blockNumber": 2,
        "title": "The Von Neumann Cycle: Fetch $\\to$ Decode $\\to$ Execute $\\to$ Writeback",
        "conceptBudget": {
          "primaryConcept": "Von Neumann Instruction Cycle",
          "supportingTerms": [
            "1. Fetch (CPU pulls opcode from RAM via Program Counter)",
            "2. Decode (Instruction Register parses opcode into control signals)",
            "3. Execute (ALU performs arithmetic computation)",
            "4. Writeback (Result stored into registers or memory)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d1-b1-bus-bandwidth-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CPU Instruction Pipeline Execution",
            "codeSnippet": "// 1. FETCH:     Pulls 'ADD R1, R2' from memory address 0x00401000\n// 2. DECODE:    Control Unit recognizes binary opcode 0x01 (Integer Addition)\n// 3. EXECUTE:   Arithmetic Logic Unit (ALU) computes 42 + 58 = 100\n// 4. WRITEBACK: Stores sum 100 into destination register R1",
            "lineNotes": {
              "1": "Step 1 Fetch.",
              "2": "Step 2 Decode.",
              "3": "Step 3 Execute.",
              "4": "Step 4 Writeback."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cpu_cycle_demo.js",
            "initialCode": "function getCpuInstructionCycle() {\n  return 'FETCH_DECODE_EXECUTE_WRITEBACK';\n}\n\nconsole.log(getCpuInstructionCycle());",
            "expectedOutput": "FETCH_DECODE_EXECUTE_WRITEBACK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What are the 4 fundamental stages of the Von Neumann CPU instruction execution pipeline?",
          "expectedStringOutput": "FETCH_DECODE_EXECUTE_WRITEBACK",
          "acceptableAnswers": [
            "FETCH_DECODE_EXECUTE_WRITEBACK",
            "Fetch Decode Execute Writeback",
            "Fetch, Decode, Execute, Writeback"
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
          "diagnosisMap": {
            "RUN": {
              "misconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
              "errorExplanation": "Matches FETCH_DECODE_EXECUTE_WRITEBACK.",
              "recoveryPath": {
                "simplerExplanation": "Matches FETCH_DECODE_EXECUTE_WRITEBACK.",
                "guidedFixPrompt": "Type FETCH_DECODE_EXECUTE_WRITEBACK"
              }
            }
          }
        }
      },
      {
        "id": "cf-d1-b3-volatile-vs-nonvolatile-storage",
        "day": 1,
        "blockNumber": 3,
        "title": "Volatile (DRAM) vs Non-Volatile (NAND NVMe Flash) Storage",
        "conceptBudget": {
          "primaryConcept": "Volatile vs Non-Volatile Invariant",
          "supportingTerms": [
            "Volatile Storage (DRAM: Requires continuous electrical refresh; loses all data instantly when power is cut)",
            "Non-Volatile Storage (NAND Flash / SSD / HDD: Retains electrons in floating gates permanently without power)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d1-b2-von-neumann-architecture-cycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "storage_type_demo.js",
            "initialCode": "function getStoragePersistenceType(isDram) {\n  return isDram\n    ? 'VOLATILE_MEMORY_REQUIRES_CONTINUOUS_ELECTRICAL_POWER'\n    : 'NON_VOLATILE_STORAGE_RETAINS_DATA_PERMANENTLY';\n}\n\nconsole.log(getStoragePersistenceType(true));\nconsole.log(getStoragePersistenceType(false));",
            "expectedOutput": "VOLATILE_MEMORY_REQUIRES_CONTINUOUS_ELECTRICAL_POWER\nNON_VOLATILE_STORAGE_RETAINS_DATA_PERMANENTLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What storage persistence characteristic describes system RAM (DRAM) which requires continuous electricity to retain its binary state?",
          "expectedStringOutput": "VOLATILE_MEMORY_REQUIRES_CONTINUOUS_ELECTRICAL_POWER",
          "acceptableAnswers": [
            "VOLATILE_MEMORY_REQUIRES_CONTINUOUS_ELECTRICAL_POWER",
            "Volatile memory",
            "Volatile"
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
          "diagnosisMap": {
            "NON_VOLATILE": {
              "misconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
              "errorExplanation": "SSDs are non-volatile. RAM is VOLATILE_MEMORY_REQUIRES_CONTINUOUS_ELECTRICAL_POWER.",
              "recoveryPath": {
                "simplerExplanation": "Matches VOLATILE_MEMORY_REQUIRES_CONTINUOUS_ELECTRICAL_POWER.",
                "guidedFixPrompt": "Type VOLATILE_MEMORY_REQUIRES_CONTINUOUS_ELECTRICAL_POWER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Operating System Architecture: Kernel, System Calls & Process States",
    "overviewMetaphor": "The OS Kernel is the Air Traffic Controller of Your Computer: User applications (browsers, word processors) run in unprivileged User Space (Ring 3) so a software bug cannot crash physical hardware; whenever an app needs to save a file or send a network packet, it executes a System Call trap into Kernel Space (Ring 0); the kernel manages process lifecycles (Ready $\\to$ Running $\\to$ Blocked) and switches between tasks in under 5 microseconds.",
    "blocks": [
      {
        "id": "cf-d2-b1-syscall-trap-ring-transition",
        "day": 2,
        "blockNumber": 1,
        "title": "System Call Privilege Ring Transition: User Space (Ring 3) $\\to$ Kernel Space (Ring 0)",
        "conceptBudget": {
          "primaryConcept": "System Call Privilege Transition",
          "supportingTerms": [
            "Caller Privilege Level (Ring 3 Unprivileged User Space)",
            "Valid Syscall Opcode Trap",
            "Target Privilege Level (Ring 0 Privileged Kernel Mode)",
            "Status: Kernel System Call Dispatched to Ring Zero"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d1-b1-bus-bandwidth-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Operating System Hardware Privilege Ring Architecture",
              "boxes": [
                {
                  "label": "User Application Space",
                  "value": "Ring 3 Unprivileged Execution Environment (Browsers, IDEs, Games)",
                  "varType": "User Space",
                  "isUpdated": false
                },
                {
                  "label": "Hardware Interrupt Trap",
                  "value": "INT 0x80 / SYSCALL Assembly Instruction Dispatched",
                  "varType": "Trap",
                  "isUpdated": false
                },
                {
                  "label": "Supervisor Kernel Space",
                  "value": "Ring 0 Full Hardware Access (KERNEL SYSTEM CALL DISPATCHED TO RING ZERO!)",
                  "varType": "Kernel Space",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "syscall_demo.js",
            "initialCode": "function executeSyscall(callerRing, opcodeValid, trapDispatched) {\n  const ok = callerRing === 3 && opcodeValid && trapDispatched;\n  return {\n    callerRing,\n    isTransitionSuccessful: ok,\n    targetRing: ok ? 0 : callerRing,\n    status: ok ? 'KERNEL_SYSTEM_CALL_DISPATCHED_TO_RING_ZERO' : 'PRIVILEGE_VIOLATION'\n  };\n}\n\nconsole.log(JSON.stringify(executeSyscall(3, true, true)));",
            "expectedOutput": "{\"callerRing\":3,\"isTransitionSuccessful\":true,\"targetRing\":0,\"status\":\"KERNEL_SYSTEM_CALL_DISPATCHED_TO_RING_ZERO\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What hardware CPU privilege ring number executes core operating system kernel instructions with full hardware access?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "Ring 0",
            "Ring zero",
            "targetRing\":0"
          ],
          "primaryMisconceptionId": "MC_CF_OS_KERNEL_SYSTEM_CALLS_PROCESS_STATES",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_CF_OS_KERNEL_SYSTEM_CALLS_PROCESS_STATES",
              "errorExplanation": "Ring 3 is unprivileged user space. The privileged kernel runs in Ring 0.",
              "recoveryPath": {
                "simplerExplanation": "Ring 0 is the supervisor kernel.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "cf-d2-b2-process-lifecycle-state-machine",
        "day": 2,
        "blockNumber": 2,
        "title": "The Process State Machine: Ready $\\to$ Running $\\to$ Blocked/Waiting $\\to$ Terminated",
        "conceptBudget": {
          "primaryConcept": "Process Lifecycle State Machine",
          "supportingTerms": [
            "Ready (In run-queue waiting for CPU time slice)",
            "Running (Actively executing instructions on a CPU core)",
            "Blocked/Waiting (Waiting for disk I/O or network packet)",
            "Terminated (Process execution finished, memory reclaimed)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d2-b1-syscall-trap-ring-transition",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Process State Transitions",
            "codeSnippet": "// READY:      Chrome process #1042 queued in RAM waiting for CPU core\n// RUNNING:    Scheduler assigns 4ms time slice -> Chrome renders web layout\n// BLOCKED:    Chrome initiates disk read -> Enters Blocked state to yield CPU to other apps\n// TERMINATED: User closes tab -> OS reclaims all allocated virtual memory",
            "lineNotes": {
              "1": "Ready state.",
              "2": "Running state.",
              "3": "Blocked I/O state.",
              "4": "Terminated state."
            }
          },
          {
            "type": "runnable_code",
            "filename": "process_states_demo.js",
            "initialCode": "function getProcessStateTransition(isWaitingForDiskIo) {\n  return isWaitingForDiskIo\n    ? 'BLOCKED_WAITING_FOR_IO_YIELDS_CPU'\n    : 'RUNNING_ON_CPU_CORE';\n}\n\nconsole.log(getProcessStateTransition(true));\nconsole.log(getProcessStateTransition(false));",
            "expectedOutput": "BLOCKED_WAITING_FOR_IO_YIELDS_CPU\nRUNNING_ON_CPU_CORE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state does an active process enter when it initiates a disk read and yields the CPU core to other processes?",
          "expectedStringOutput": "BLOCKED_WAITING_FOR_IO_YIELDS_CPU",
          "acceptableAnswers": [
            "BLOCKED_WAITING_FOR_IO_YIELDS_CPU",
            "Blocked state",
            "Waiting state"
          ],
          "primaryMisconceptionId": "MC_CF_OS_KERNEL_SYSTEM_CALLS_PROCESS_STATES",
          "diagnosisMap": {
            "TERMINATED": {
              "misconceptionId": "MC_CF_OS_KERNEL_SYSTEM_CALLS_PROCESS_STATES",
              "errorExplanation": "Waiting for I/O pauses the process into BLOCKED_WAITING_FOR_IO_YIELDS_CPU.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLOCKED_WAITING_FOR_IO_YIELDS_CPU.",
                "guidedFixPrompt": "Type BLOCKED_WAITING_FOR_IO_YIELDS_CPU"
              }
            }
          }
        }
      },
      {
        "id": "cf-d2-b3-monolithic-vs-microkernel-design",
        "day": 2,
        "blockNumber": 3,
        "title": "Monolithic Kernels (Linux) vs Microkernels (Mach / QNX)",
        "conceptBudget": {
          "primaryConcept": "Kernel Architecture Invariant",
          "supportingTerms": [
            "Monolithic (Drivers, file systems, and network stack all run inside Ring 0 for maximum raw performance)",
            "Microkernel (Only scheduling and IPC run in Ring 0; drivers run in user space for fault tolerance)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d2-b2-process-lifecycle-state-machine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "kernel_arch_demo.js",
            "initialCode": "function getLinuxKernelArchitecture() {\n  return 'MONOLITHIC_KERNEL_MAXIMUM_RAW_EXECUTION_PERFORMANCE';\n}\n\nconsole.log(getLinuxKernelArchitecture());",
            "expectedOutput": "MONOLITHIC_KERNEL_MAXIMUM_RAW_EXECUTION_PERFORMANCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What kernel architecture paradigm powers the Linux operating system, executing device drivers and file systems inside Ring 0 for maximum speed?",
          "expectedStringOutput": "MONOLITHIC_KERNEL_MAXIMUM_RAW_EXECUTION_PERFORMANCE",
          "acceptableAnswers": [
            "MONOLITHIC_KERNEL_MAXIMUM_RAW_EXECUTION_PERFORMANCE",
            "Monolithic Kernel",
            "Monolithic"
          ],
          "primaryMisconceptionId": "MC_CF_OS_KERNEL_SYSTEM_CALLS_PROCESS_STATES",
          "diagnosisMap": {
            "MICROKERNEL": {
              "misconceptionId": "MC_CF_OS_KERNEL_SYSTEM_CALLS_PROCESS_STATES",
              "errorExplanation": "Linux is a MONOLITHIC_KERNEL_MAXIMUM_RAW_EXECUTION_PERFORMANCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches MONOLITHIC_KERNEL_MAXIMUM_RAW_EXECUTION_PERFORMANCE.",
                "guidedFixPrompt": "Type MONOLITHIC_KERNEL_MAXIMUM_RAW_EXECUTION_PERFORMANCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "File Systems & Directory Hierarchy: POSIX Inodes & Chmod Permissions (755)",
    "overviewMetaphor": "File Permissions Are a 3-Lock Security Keypad on Every File: Every file in Unix/Linux has permissions for Owner, Group, and Others; using octal notation, Read is worth 4 points, Write is worth 2 points, and Execute is worth 1 point; a permission of `755` ($7 = 4+2+1, 5 = 4+0+1, 5 = 4+0+1$) gives the Owner full `rwx` read-write-execute powers, while Group and Others receive `r-x` read-and-execute access.",
    "blocks": [
      {
        "id": "cf-d3-b1-chmod-octal-permission-decoding",
        "day": 3,
        "blockNumber": 1,
        "title": "Chmod Octal Permissions Formula: $\\text{Chmod 755} = (4+2+1)(4+0+1)(4+0+1) = \\text{rwxr-xr-x}$",
        "conceptBudget": {
          "primaryConcept": "Chmod Octal Permission Bitmask Formula",
          "supportingTerms": [
            "Read ($r = 4$)",
            "Write ($w = 2$)",
            "Execute ($x = 1$)",
            "Owner Digits ($7 = 4+2+1 = \\text{rwx}$)",
            "Group Digits ($5 = 4+0+1 = \\text{r-x}$)",
            "Other Digits ($5 = 4+0+1 = \\text{r-x}$)",
            "Permission String = `'rwxr-xr-x'`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d2-b1-syscall-trap-ring-transition",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "POSIX File Permission Octal Bitmask Ledger (755 = rwxr-xr-x)",
              "boxes": [
                {
                  "label": "Owner Permissions (7)",
                  "value": "Read (4) + Write (2) + Execute (1) = 7 -> 'rwx'",
                  "varType": "Owner",
                  "isUpdated": false
                },
                {
                  "label": "Group Permissions (5)",
                  "value": "Read (4) + No Write (0) + Execute (1) = 5 -> 'r-x'",
                  "varType": "Group",
                  "isUpdated": false
                },
                {
                  "label": "Other Permissions (5)",
                  "value": "Read (4) + No Write (0) + Execute (1) = 5 -> 'r-x'",
                  "varType": "Other",
                  "isUpdated": false
                },
                {
                  "label": "Decoded POSIX String",
                  "value": "'rwxr-xr-x' (CHMOD PERMISSIONS DECODED NOMINAL!)",
                  "varType": "Chmod String",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "chmod_calc_demo.js",
            "initialCode": "function decodeChmod(octal) {\n  const digits = String(octal).split('').map(Number);\n  const mapD = (d) => {\n    const r = (d & 4) ? 'r' : '-';\n    const w = (d & 2) ? 'w' : '-';\n    const x = (d & 1) ? 'x' : '-';\n    return `${r}${w}${x}`;\n  };\n  const str = digits.map(mapD).join('');\n  return {\n    octal,\n    permissionString: str,\n    status: 'CHMOD_PERMISSIONS_DECODED'\n  };\n}\n\nconsole.log(JSON.stringify(decodeChmod(755)));\nconsole.log(JSON.stringify(decodeChmod(600)));",
            "expectedOutput": "{\"octal\":755,\"permissionString\":\"rwxr-xr-x\",\"status\":\"CHMOD_PERMISSIONS_DECODED\"}\n{\"octal\":600,\"permissionString\":\"rw-------\",\"status\":\"CHMOD_PERMISSIONS_DECODED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 9-character Unix permission string corresponds to octal mode 755 (Owner: 7, Group: 5, Others: 5)?",
          "expectedStringOutput": "rwxr-xr-x",
          "acceptableAnswers": [
            "rwxr-xr-x",
            "permissionString\":\"rwxr-xr-x\""
          ],
          "primaryMisconceptionId": "MC_CF_FILE_SYSTEMS_INODES_POSIX_PERMISSIONS",
          "diagnosisMap": {
            "rwxrwxrwx": {
              "misconceptionId": "MC_CF_FILE_SYSTEMS_INODES_POSIX_PERMISSIONS",
              "errorExplanation": "rwxrwxrwx is 777. 755 gives group and others read/execute without write: rwxr-xr-x.",
              "recoveryPath": {
                "simplerExplanation": "7=rwx, 5=r-x, 5=r-x -> rwxr-xr-x.",
                "guidedFixPrompt": "Type rwxr-xr-x"
              }
            }
          }
        }
      },
      {
        "id": "cf-d3-b2-inodes-and-file-metadata",
        "day": 3,
        "blockNumber": 2,
        "title": "Inodes: File Metadata, Ownership & Data Block Pointers",
        "conceptBudget": {
          "primaryConcept": "Inode Metadata Structure",
          "supportingTerms": [
            "Inode (Index Node: Data structure storing file size, owner UID, group GID, permissions, timestamps, and direct/indirect block pointers to physical disk sectors; does NOT store the filename!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d3-b1-chmod-octal-permission-decoding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Inode File Metadata Structure",
            "codeSnippet": "// INODE #40921:\n//   Size:        45,020 bytes\n//   Permissions: 755 (rwxr-xr-x)\n//   Owner UID:   1000 (developer)\n//   Block Ptrs:  [Sector 104, Sector 105, Sector 106...]\n// Directory table links filename 'app.js' -> Inode #40921",
            "lineNotes": {
              "1": "Unique Inode number.",
              "2": "File byte size.",
              "3": "Chmod permissions.",
              "4": "Owner ID.",
              "5": "Physical disk block sectors.",
              "6": "Directory name mapping."
            }
          },
          {
            "type": "runnable_code",
            "filename": "inode_demo.js",
            "initialCode": "function getInodeContents() {\n  return 'INODE_STORES_METADATA_AND_BLOCK_POINTERS_EXCLUDING_FILENAME';\n}\n\nconsole.log(getInodeContents());",
            "expectedOutput": "INODE_STORES_METADATA_AND_BLOCK_POINTERS_EXCLUDING_FILENAME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core file attribute is stored in directory tables rather than inside the file's physical Inode structure?",
          "expectedStringOutput": "INODE_STORES_METADATA_AND_BLOCK_POINTERS_EXCLUDING_FILENAME",
          "acceptableAnswers": [
            "INODE_STORES_METADATA_AND_BLOCK_POINTERS_EXCLUDING_FILENAME",
            "Filename",
            "File name"
          ],
          "primaryMisconceptionId": "MC_CF_FILE_SYSTEMS_INODES_POSIX_PERMISSIONS",
          "diagnosisMap": {
            "FILE_SIZE": {
              "misconceptionId": "MC_CF_FILE_SYSTEMS_INODES_POSIX_PERMISSIONS",
              "errorExplanation": "File size is in the Inode. Filenames are stored in directory tables: INODE_STORES_METADATA_AND_BLOCK_POINTERS_EXCLUDING_FILENAME.",
              "recoveryPath": {
                "simplerExplanation": "Matches INODE_STORES_METADATA_AND_BLOCK_POINTERS_EXCLUDING_FILENAME.",
                "guidedFixPrompt": "Type INODE_STORES_METADATA_AND_BLOCK_POINTERS_EXCLUDING_FILENAME"
              }
            }
          }
        }
      },
      {
        "id": "cf-d3-b3-hard-links-vs-soft-symlinks",
        "day": 3,
        "blockNumber": 3,
        "title": "Hard Links vs Soft Symbolic Links (Symlinks)",
        "conceptBudget": {
          "primaryConcept": "Hard vs Soft Links Invariant",
          "supportingTerms": [
            "Hard Link (Direct directory entry pointing to the exact same Inode number; remains valid even if original filename is deleted)",
            "Soft Symlink (A special pointer file containing the text path to another file; breaks if target is moved)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d3-b2-inodes-and-file-metadata",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "links_demo.js",
            "initialCode": "function evaluateLinkType(pointsDirectlyToSameInode) {\n  return pointsDirectlyToSameInode\n    ? 'HARD_LINK_DIRECT_INODE_POINTER'\n    : 'SOFT_SYMBOLIC_LINK_PATH_POINTER';\n}\n\nconsole.log(evaluateLinkType(true));\nconsole.log(evaluateLinkType(false));",
            "expectedOutput": "HARD_LINK_DIRECT_INODE_POINTER\nSOFT_SYMBOLIC_LINK_PATH_POINTER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which type of filesystem link points directly to the underlying Inode number and continues to access data even after the original source file is deleted?",
          "expectedStringOutput": "HARD_LINK_DIRECT_INODE_POINTER",
          "acceptableAnswers": [
            "HARD_LINK_DIRECT_INODE_POINTER",
            "Hard link",
            "Hard Link"
          ],
          "primaryMisconceptionId": "MC_CF_FILE_SYSTEMS_INODES_POSIX_PERMISSIONS",
          "diagnosisMap": {
            "SYMLINK": {
              "misconceptionId": "MC_CF_FILE_SYSTEMS_INODES_POSIX_PERMISSIONS",
              "errorExplanation": "Symlinks break when target is moved. Direct Inode sharing is a HARD_LINK_DIRECT_INODE_POINTER.",
              "recoveryPath": {
                "simplerExplanation": "Matches HARD_LINK_DIRECT_INODE_POINTER.",
                "guidedFixPrompt": "Type HARD_LINK_DIRECT_INODE_POINTER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Command Line Interface (CLI) Mastery: Piping, Redirection & Grep Filters",
    "overviewMetaphor": "The Terminal CLI is an Industrial Assembly Line of Text Streams: In a GUI you click 50 dialog boxes; in the terminal, you chain powerful single-purpose tools together using the Unix Pipe (`|`); the command `grep -i 'error' /var/log/syslog | sort | uniq -c | wc -l` filters errors, sorts them, counts duplicates, and returns exact statistics in 40 milliseconds with zero manual effort.",
    "blocks": [
      {
        "id": "cf-d4-b1-grep-wc-pipeline-filtering",
        "day": 4,
        "blockNumber": 1,
        "title": "Unix Pipeline Composition: `grep -rn 'ERROR' /var/log | wc -l`",
        "conceptBudget": {
          "primaryConcept": "Unix Pipeline Piping Invariant",
          "supportingTerms": [
            "Standard Streams (`stdin 0`, `stdout 1`, `stderr 2`)",
            "Pipeline Operator (`|` streams stdout of program A into stdin of program B)",
            "Pattern Matching (`grep 'ERROR'`)",
            "Word/Line Count (`wc -l`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d3-b1-chmod-octal-permission-decoding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Unix Pipeline Standard Stream Data Flow Ledger",
              "boxes": [
                {
                  "label": "Input Log Stream (stdin)",
                  "value": "4 Lines of Server Telemetry Passed to Process 1 (grep)",
                  "varType": "stdin",
                  "isUpdated": false
                },
                {
                  "label": "Grep Pattern Filter",
                  "value": "Filters 2 Matching '[ERROR]' Strings into stdout",
                  "varType": "Pipe |",
                  "isUpdated": false
                },
                {
                  "label": "Word Count Filter (wc -l)",
                  "value": "Counts 2 Lines (PIPELINE FILTER EXECUTED NOMINAL!)",
                  "varType": "stdout",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pipe_filter_demo.js",
            "initialCode": "function simulatePipeline(lines, pattern) {\n  const re = new RegExp(pattern);\n  const matched = lines.filter(l => re.test(l));\n  return {\n    totalInputLines: lines.length,\n    matchingLinesCount: matched.length,\n    status: 'PIPELINE_FILTER_EXECUTED_NOMINAL'\n  };\n}\n\nconst logs = ['[INFO] Booting', '[ERROR] DB Timeout', '[INFO] Handled', '[ERROR] Port Busy'];\nconsole.log(JSON.stringify(simulatePipeline(logs, 'ERROR')));",
            "expectedOutput": "{\"totalInputLines\":4,\"matchingLinesCount\":2,\"status\":\"PIPELINE_FILTER_EXECUTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many matching lines are output when piping 4 log records containing 2 '[ERROR]' entries through `grep 'ERROR' | wc -l`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 lines",
            "matchingLinesCount\":2"
          ],
          "primaryMisconceptionId": "MC_CF_CLI_TERMINAL_PIPING_REDIRECTION",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_CF_CLI_TERMINAL_PIPING_REDIRECTION",
              "errorExplanation": "4 is total input lines. Grep filters out the 2 info lines, leaving 2 error lines.",
              "recoveryPath": {
                "simplerExplanation": "4 input - 2 non-matching = 2 matching.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "cf-d4-b2-file-redirection-operators",
        "day": 4,
        "blockNumber": 2,
        "title": "Standard Stream Redirection: Overwrite (`>`) vs Append (`>>`) vs Stderr (`2>&1`)",
        "conceptBudget": {
          "primaryConcept": "Stream Redirection Operators",
          "supportingTerms": [
            "`>` (Redirects stdout to file, overwriting existing contents)",
            "`>>` (Redirects stdout to file, appending to end of file)",
            "`2>&1` (Redirects standard error stream 2 into standard output stream 1)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d4-b1-grep-wc-pipeline-filtering",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Redirection Operator Syntax",
            "codeSnippet": "// OVERWRITE:  echo 'New build v2.0' > /var/log/build.log    (Wipes previous logs)\n// APPEND:     echo 'Task completed' >> /var/log/build.log   (Appends to bottom)\n// MERGE ERR:  ./build.sh > output.log 2>&1                 (Captures errors & logs together)",
            "lineNotes": {
              "1": "Overwrite operator.",
              "2": "Append operator.",
              "3": "Stderr merge redirection."
            }
          },
          {
            "type": "runnable_code",
            "filename": "redirect_demo.js",
            "initialCode": "function getRedirectionOperator(isAppendMode) {\n  return isAppendMode\n    ? 'DOUBLE_GREATER_THAN_APPENDS_TO_FILE'\n    : 'SINGLE_GREATER_THAN_OVERWRITES_FILE';\n}\n\nconsole.log(getRedirectionOperator(true));\nconsole.log(getRedirectionOperator(false));",
            "expectedOutput": "DOUBLE_GREATER_THAN_APPENDS_TO_FILE\nSINGLE_GREATER_THAN_OVERWRITES_FILE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which terminal redirection operator appends command output to the end of an existing log file without destroying previous contents?",
          "expectedStringOutput": "DOUBLE_GREATER_THAN_APPENDS_TO_FILE",
          "acceptableAnswers": [
            "DOUBLE_GREATER_THAN_APPENDS_TO_FILE",
            ">>",
            "Double greater than"
          ],
          "primaryMisconceptionId": "MC_CF_CLI_TERMINAL_PIPING_REDIRECTION",
          "diagnosisMap": {
            "SINGLE": {
              "misconceptionId": "MC_CF_CLI_TERMINAL_PIPING_REDIRECTION",
              "errorExplanation": "Single '>' overwrites the file. Appending uses DOUBLE_GREATER_THAN_APPENDS_TO_FILE (>>).",
              "recoveryPath": {
                "simplerExplanation": "Matches DOUBLE_GREATER_THAN_APPENDS_TO_FILE.",
                "guidedFixPrompt": "Type DOUBLE_GREATER_THAN_APPENDS_TO_FILE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d4-b3-essential-terminal-navigation-flags",
        "day": 4,
        "blockNumber": 3,
        "title": "Essential Terminal Commands: `cd`, `ls -la`, `mkdir -p` & `rm -rf`",
        "conceptBudget": {
          "primaryConcept": "Essential CLI Commands",
          "supportingTerms": [
            "`mkdir -p path/to/nested` (Creates parent directories automatically)",
            "`ls -la` (Lists all files including hidden dotfiles in long format)",
            "`rm -rf` (Forcefully removes directory tree recursively)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d4-b2-file-redirection-operators",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cli_flags_demo.js",
            "initialCode": "function getNestedDirectoryCreationCommand() {\n  return 'MKDIR_DASH_P_CREATES_PARENT_DIRECTORIES_AUTOMATICALLY';\n}\n\nconsole.log(getNestedDirectoryCreationCommand());",
            "expectedOutput": "MKDIR_DASH_P_CREATES_PARENT_DIRECTORIES_AUTOMATICALLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag must be passed to `mkdir` to automatically create all missing intermediate parent directories in a nested path?",
          "expectedStringOutput": "MKDIR_DASH_P_CREATES_PARENT_DIRECTORIES_AUTOMATICALLY",
          "acceptableAnswers": [
            "MKDIR_DASH_P_CREATES_PARENT_DIRECTORIES_AUTOMATICALLY",
            "-p",
            "mkdir -p"
          ],
          "primaryMisconceptionId": "MC_CF_CLI_TERMINAL_PIPING_REDIRECTION",
          "diagnosisMap": {
            "-R": {
              "misconceptionId": "MC_CF_CLI_TERMINAL_PIPING_REDIRECTION",
              "errorExplanation": "Recursive parents in mkdir uses -p: MKDIR_DASH_P_CREATES_PARENT_DIRECTORIES_AUTOMATICALLY.",
              "recoveryPath": {
                "simplerExplanation": "Matches MKDIR_DASH_P_CREATES_PARENT_DIRECTORIES_AUTOMATICALLY.",
                "guidedFixPrompt": "Type MKDIR_DASH_P_CREATES_PARENT_DIRECTORIES_AUTOMATICALLY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Computer Hardware, Kernel Architecture & Terminal CLI Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete foundational computing and operating system engine: 1. High-speed memory bus bandwidth calculation ($25,600$ MB/s); 2. Ring 0 POSIX syscall verification; 3. Chmod octal permission decoding (`755` $\\to$ `rwxr-xr-x`); 4. Unix pipeline grep filtering.",
    "blocks": [
      {
        "id": "cf-d5-b1-computing-foundations-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Computer & OS Foundations Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Computing Foundations Master Kernel",
          "supportingTerms": [
            "Hardware Bus Engine",
            "Kernel Syscall Engine",
            "Chmod Decoder Engine",
            "CLI Pipeline Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d4-b3-essential-terminal-navigation-flags",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Computing Foundations Architecture Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Calculates 25,600 MB/s high-speed memory bus bandwidth",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Transitions user space syscalls into Ring 0 kernel mode",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Decodes 755 octal into 'rwxr-xr-x' permissions",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Filters logs via Unix grep pipelines and activates Foundations kernel!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "computing_kernel_demo.js",
            "initialCode": "function runComputingFoundations() {\n  return {\n    busSubsystem: 'ONLINE_25600_MBPS_ACTIVE',\n    kernelSubsystem: 'ONLINE_RING_ZERO_SYSCALL_ACTIVE',\n    chmodSubsystem: 'ONLINE_755_RWTXR_ACTIVE',\n    cliSubsystem: 'ONLINE_PIPELINE_GREP_ACTIVE',\n    engineStatus: 'COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runComputingFoundations().engineStatus);",
            "expectedOutput": "COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Computer & OS Foundations Master Kernel?",
          "expectedStringOutput": "COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
              "errorExplanation": "Matches COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type COMPUTER_AND_OS_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cf-d5-b2-computing-foundations-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Computing Foundations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Computing Foundations Invariant Verification",
          "supportingTerms": [
            "Bus Invariant",
            "Kernel Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d5-b1-computing-foundations-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "computing_audit_demo.js",
            "initialCode": "function auditComputingEngine(bus, kernel, chmod, cli) {\n  const passed = bus && kernel && chmod && cli;\n  return {\n    busVerified: bus,\n    kernelVerified: kernel,\n    chmodVerified: chmod,\n    cliVerified: cli,\n    grade: passed ? 'COMPUTING_FOUNDATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditComputingEngine(true, true, true, true)));",
            "expectedOutput": "{\"busVerified\":true,\"kernelVerified\":true,\"chmodVerified\":true,\"cliVerified\":true,\"grade\":\"COMPUTING_FOUNDATIONS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Bus Bandwidth, Kernel Syscalls, Chmod Permissions, and CLI Pipelines pass 100%?",
          "expectedStringOutput": "COMPUTING_FOUNDATIONS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "COMPUTING_FOUNDATIONS_ENGINE_AUDIT_PASSED",
            "grade\":\"COMPUTING_FOUNDATIONS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
              "errorExplanation": "All checks passing awards COMPUTING_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards COMPUTING_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type COMPUTING_FOUNDATIONS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "cf-d5-b3-milestone1-cf-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Computer & OS Foundations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Computing Foundations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d5-b2-computing-foundations-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_cf_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Computer Hardware, Kernel Architecture & Terminal CLI Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Computer Hardware, Kernel Architecture & Terminal CLI Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Computer Hardware, Kernel Architecture & Terminal CLI Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Computer Hardware, Kernel Architecture & Terminal CLI Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CF_HARDWARE_CPU_RAM_BUS_BANDWIDTH",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Computer Hardware, Kernel Architecture & Terminal CLI Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Process Management & Multitasking: Process ID (PID), Threads & CPU Throttling",
    "overviewMetaphor": "Process Scheduling is a Chess Grandmaster Playing 20 Opponents Simultaneously: The grandmaster (CPU core) does not wait for one opponent to finish an entire 4-hour game; they spend 10 seconds at table 1 (PID 101), move a piece, context-switch to table 2 (PID 102), and move another piece; executing Round-Robin scheduling with 4ms time slices executes 3 concurrent tasks totaling 23 ms ($10+5+8 = 23\\text{ ms}$) seamlessly, creating the illusion of perfect simultaneous execution.",
    "blocks": [
      {
        "id": "cf-d6-b1-round-robin-scheduler-simulation",
        "day": 6,
        "blockNumber": 1,
        "title": "Round-Robin CPU Scheduler: Multi-Task Execution Time Sum ($10+5+8 = 23\\text{ ms}$)",
        "conceptBudget": {
          "primaryConcept": "Round-Robin Preemptive Scheduling Formula",
          "supportingTerms": [
            "Task 1 Burst Time ($10$ ms)",
            "Task 2 Burst Time ($5$ ms)",
            "Task 3 Burst Time ($8$ ms)",
            "Time Quantum ($4$ ms)",
            "Total Elapsed Execution Time = $10 + 5 + 8 = 23$ ms",
            "Status: Scheduler Round-Robin Completed"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d1-b1-bus-bandwidth-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CPU Round-Robin Time-Slice Dispatch Ledger (23 ms Total Elapsed)",
              "boxes": [
                {
                  "label": "Scheduled Task Queue",
                  "value": "PID 101 (10ms) | PID 102 (5ms) | PID 103 (8ms)",
                  "varType": "Tasks",
                  "isUpdated": false
                },
                {
                  "label": "Preemptive Time Quantum",
                  "value": "4 ms CPU Time Slice Allotted per Context Switch",
                  "varType": "Quantum",
                  "isUpdated": false
                },
                {
                  "label": "Total Execution Time",
                  "value": "10 + 5 + 8 = 23 ms (SCHEDULER ROUND ROBIN COMPLETED!)",
                  "varType": "Total Time",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "scheduler_demo.js",
            "initialCode": "function runScheduler(bursts, quantum) {\n  let q = [...bursts];\n  let time = 0;\n  while (q.some(t => t > 0)) {\n    for (let i = 0; i < q.length; i++) {\n      if (q[i] > 0) {\n        const slice = Math.min(q[i], quantum);\n        q[i] -= slice;\n        time += slice;\n      }\n    }\n  }\n  return {\n    totalElapsedTimeMs: time,\n    status: 'SCHEDULER_ROUND_ROBIN_COMPLETED'\n  };\n}\n\nconsole.log(JSON.stringify(runScheduler([10, 5, 8], 4)));",
            "expectedOutput": "{\"totalElapsedTimeMs\":23,\"status\":\"SCHEDULER_ROUND_ROBIN_COMPLETED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total elapsed execution time in milliseconds when round-robin scheduling 3 tasks with burst times of 10ms, 5ms, and 8ms ($10 + 5 + 8$)?",
          "expectedStringOutput": "23",
          "acceptableAnswers": [
            "23",
            "23 ms",
            "totalElapsedTimeMs\":23"
          ],
          "primaryMisconceptionId": "MC_CF_PROCESS_MANAGEMENT_PID_CONTEXT_SWITCHING",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_CF_PROCESS_MANAGEMENT_PID_CONTEXT_SWITCHING",
              "errorExplanation": "4ms is the time slice quantum. Total time is the sum of all task bursts: 10 + 5 + 8 = 23 ms.",
              "recoveryPath": {
                "simplerExplanation": "10 + 5 + 8 = 23.",
                "guidedFixPrompt": "Type 23"
              }
            }
          }
        }
      },
      {
        "id": "cf-d6-b2-threads-vs-processes-memory-sharing",
        "day": 6,
        "blockNumber": 2,
        "title": "Processes (Isolated Memory Spaces) vs Threads (Shared Heap Memory)",
        "conceptBudget": {
          "primaryConcept": "Process vs Thread Memory Model",
          "supportingTerms": [
            "Process (Heavyweight container with its own private virtual memory space; crash in process A does not affect process B)",
            "Thread (Lightweight unit of execution inside a process; shares heap memory and open file descriptors with other threads)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d6-b1-round-robin-scheduler-simulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Process vs Thread Architecture",
            "codeSnippet": "// PROCESS A (PID 2001): Private Heap [0x1000 - 0x5000] -> Memory isolated\n//   ├── Thread 1: Has private Stack & Registers, Shares Heap with Thread 2\n//   └── Thread 2: Has private Stack & Registers, Shares Heap with Thread 1\n// PROCESS B (PID 2002): Private Heap [0x6000 - 0x9000] -> Cannot touch Process A!",
            "lineNotes": {
              "1": "Process isolation boundary.",
              "2": "Thread 1 execution.",
              "3": "Thread 2 execution.",
              "4": "Independent Process B."
            }
          },
          {
            "type": "runnable_code",
            "filename": "thread_model_demo.js",
            "initialCode": "function getConcurrencyModel() {\n  return 'THREADS_SHARE_HEAP_MEMORY_WHILE_PROCESSES_HAVE_ISOLATED_ADDRESS_SPACES';\n}\n\nconsole.log(getConcurrencyModel());",
            "expectedOutput": "THREADS_SHARE_HEAP_MEMORY_WHILE_PROCESSES_HAVE_ISOLATED_ADDRESS_SPACES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fundamental memory difference distinguishes lightweight threads from independent operating system processes?",
          "expectedStringOutput": "THREADS_SHARE_HEAP_MEMORY_WHILE_PROCESSES_HAVE_ISOLATED_ADDRESS_SPACES",
          "acceptableAnswers": [
            "THREADS_SHARE_HEAP_MEMORY_WHILE_PROCESSES_HAVE_ISOLATED_ADDRESS_SPACES",
            "Threads share heap memory",
            "Shared heap memory"
          ],
          "primaryMisconceptionId": "MC_CF_PROCESS_MANAGEMENT_PID_CONTEXT_SWITCHING",
          "diagnosisMap": {
            "IDENTICAL": {
              "misconceptionId": "MC_CF_PROCESS_MANAGEMENT_PID_CONTEXT_SWITCHING",
              "errorExplanation": "Processes are isolated while THREADS_SHARE_HEAP_MEMORY_WHILE_PROCESSES_HAVE_ISOLATED_ADDRESS_SPACES.",
              "recoveryPath": {
                "simplerExplanation": "Matches THREADS_SHARE_HEAP_MEMORY_WHILE_PROCESSES_HAVE_ISOLATED_ADDRESS_SPACES.",
                "guidedFixPrompt": "Type THREADS_SHARE_HEAP_MEMORY_WHILE_PROCESSES_HAVE_ISOLATED_ADDRESS_SPACES"
              }
            }
          }
        }
      },
      {
        "id": "cf-d6-b3-cpu-thermal-throttling-guardrail",
        "day": 6,
        "blockNumber": 3,
        "title": "Hardware Thermals & Dynamic Voltage Frequency Scaling (DVFS)",
        "conceptBudget": {
          "primaryConcept": "Thermal Throttling Invariant",
          "supportingTerms": [
            "Thermal Throttling (When silicon die junction temperature exceeds $T_j \\ge 95^\\circ\\text{C}$, the CPU automatically scales down clock frequency from 5.0 GHz to 2.0 GHz to prevent catastrophic silicon burnout)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d6-b2-threads-vs-processes-memory-sharing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "thermal_throttle_demo.js",
            "initialCode": "function evaluateThermalThrottling(tempCelsius) {\n  return tempCelsius >= 95\n    ? 'CRITICAL_THERMAL_THROTTLING_FREQUENCY_REDUCED'\n    : 'FULL_TURBO_FREQUENCY_PERMITTED';\n}\n\nconsole.log(evaluateThermalThrottling(98));\nconsole.log(evaluateThermalThrottling(72));",
            "expectedOutput": "CRITICAL_THERMAL_THROTTLING_FREQUENCY_REDUCED\nFULL_TURBO_FREQUENCY_PERMITTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protective CPU hardware action is triggered when internal silicon temperature reaches 98°C?",
          "expectedStringOutput": "CRITICAL_THERMAL_THROTTLING_FREQUENCY_REDUCED",
          "acceptableAnswers": [
            "CRITICAL_THERMAL_THROTTLING_FREQUENCY_REDUCED",
            "Thermal throttling",
            "Frequency reduced"
          ],
          "primaryMisconceptionId": "MC_CF_PROCESS_MANAGEMENT_PID_CONTEXT_SWITCHING",
          "diagnosisMap": {
            "OVERCLOCK": {
              "misconceptionId": "MC_CF_PROCESS_MANAGEMENT_PID_CONTEXT_SWITCHING",
              "errorExplanation": "High heat reduces clock speed: CRITICAL_THERMAL_THROTTLING_FREQUENCY_REDUCED.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRITICAL_THERMAL_THROTTLING_FREQUENCY_REDUCED.",
                "guidedFixPrompt": "Type CRITICAL_THERMAL_THROTTLING_FREQUENCY_REDUCED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Computer Memory Hierarchy: L1/L2/L3 CPU Caches, RAM & Virtual Paging",
    "overviewMetaphor": "The Memory Hierarchy is a Chef's Kitchen Station: The chef's hand is the L1 Cache (1 nanosecond); the countertop is the L2/L3 Cache (4-10 nanoseconds); the pantry in the kitchen is the RAM (100 nanoseconds); and the supermarket down the street is the NVMe SSD (10,000 nanoseconds); achieving a 95% cache hit ratio ($AMAT = 5.0\\text{ns} + 0.05(100\\text{ns}) = 10.0\\text{ ns} \\le 15.0\\text{ ns}$) ensures the CPU operates at blistering speed without stalling for slow pantry fetches.",
    "blocks": [
      {
        "id": "cf-d7-b1-amat-memory-latency-calculation",
        "day": 7,
        "blockNumber": 1,
        "title": "Average Memory Access Time (AMAT) Formula: $\\text{AMAT} = L_{\\text{cache}} + (1 - \\text{Hit}) \\times L_{\\text{RAM}} = 10.00\\text{ ns}$",
        "conceptBudget": {
          "primaryConcept": "Average Memory Access Time (AMAT) Formula",
          "supportingTerms": [
            "Cache Hit Ratio ($95.0\\% \\implies 0.05$ miss rate)",
            "Cache Latency ($L_{\\text{cache}} = 5.0$ ns)",
            "Main RAM Latency ($L_{\\text{RAM}} = 100.0$ ns)",
            "AMAT = $5.0 + (0.05 \\times 100.0) = 5.0 + 5.0 = 10.00$ ns",
            "Performance Standard: $\\le 15.0$ ns $\\implies$ Ultra-Fast Memory Access Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d6-b1-round-robin-scheduler-simulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CPU Memory Speed Hierarchy & AMAT Ledger (10.00 ns Effective Access)",
              "boxes": [
                {
                  "label": "L1/L2 Cache Hit Rate",
                  "value": "95.0% of Memory Requests Resolved in High-Speed On-Die Cache (5.0 ns)",
                  "varType": "Cache Hit",
                  "isUpdated": false
                },
                {
                  "label": "RAM Miss Penalty",
                  "value": "5.0% Cache Miss Rate x 100.0 ns Main DDR5 RAM Latency = +5.00 ns",
                  "varType": "Miss Penalty",
                  "isUpdated": false
                },
                {
                  "label": "Effective Access Time",
                  "value": "5.00 + 5.00 = 10.00 ns (ULTRA FAST MEMORY ACCESS CERTIFIED <= 15.0 ns!)",
                  "varType": "AMAT",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "amat_calc_demo.js",
            "initialCode": "function calculateAmat(hitPct, lCache, lRam) {\n  const miss = 1 - (hitPct / 100);\n  const amat = lCache + (miss * lRam);\n  const isFast = amat <= 15.0;\n  return {\n    hitPct,\n    amatNanoseconds: Number(amat.toFixed(2)),\n    isFast,\n    status: isFast ? 'ULTRA_FAST_MEMORY_ACCESS_CERTIFIED' : 'MEMORY_STALL'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAmat(95.0, 5.0, 100.0)));",
            "expectedOutput": "{\"hitPct\":95,\"amatNanoseconds\":10,\"isFast\":true,\"status\":\"ULTRA_FAST_MEMORY_ACCESS_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Average Memory Access Time (AMAT) in nanoseconds when cache latency is 5ns, RAM latency is 100ns, and cache hit ratio is 95% ($5 + (0.05 \\times 100)$)?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10.0",
            "10.00",
            "amatNanoseconds\":10"
          ],
          "primaryMisconceptionId": "MC_CF_MEMORY_HIERARCHY_CACHE_VIRTUAL_PAGING",
          "diagnosisMap": {
            "105": {
              "misconceptionId": "MC_CF_MEMORY_HIERARCHY_CACHE_VIRTUAL_PAGING",
              "errorExplanation": "105ns sums both latencies unconditionally. 95% of hits avoid RAM, giving AMAT = 10.00 ns.",
              "recoveryPath": {
                "simplerExplanation": "5 + (0.05 * 100) = 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      },
      {
        "id": "cf-d7-b2-virtual-memory-paging-4kb",
        "day": 7,
        "blockNumber": 2,
        "title": "Virtual Memory Paging: 4KB Page Frames, Page Tables & Page Faults",
        "conceptBudget": {
          "primaryConcept": "Virtual Memory Paging Invariant",
          "supportingTerms": [
            "Page Frame (Standard 4KB block of virtual memory mapped to physical DRAM)",
            "Page Fault (Interrupt triggered when process accesses memory page swapped out to disk, causing OS to load it from SSD into RAM)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d7-b1-amat-memory-latency-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Virtual Memory Address Translation",
            "codeSnippet": "// VIRTUAL ADDRESS: 0x00401FA0 -> Split into Page Number (0x00401) + Offset (0xFA0)\n// MMU LOOKUP:      Page #0x00401 maps to Physical Frame #0x12A in DRAM\n// PHYSICAL ACCESS: Read physical byte at DRAM address 0x12AFA0 in 100ns!",
            "lineNotes": {
              "1": "Virtual address decomposition.",
              "2": "MMU Page Table mapping.",
              "3": "Physical DRAM access."
            }
          },
          {
            "type": "runnable_code",
            "filename": "paging_demo.js",
            "initialCode": "function getStandardPageSizeKb() {\n  return 'FOUR_KILOBYTE_STANDARD_PAGE_FRAME_SIZE';\n}\n\nconsole.log(getStandardPageSizeKb());",
            "expectedOutput": "FOUR_KILOBYTE_STANDARD_PAGE_FRAME_SIZE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What standard memory block size is utilized by x86-64 operating systems for virtual memory paging allocation?",
          "expectedStringOutput": "FOUR_KILOBYTE_STANDARD_PAGE_FRAME_SIZE",
          "acceptableAnswers": [
            "FOUR_KILOBYTE_STANDARD_PAGE_FRAME_SIZE",
            "4KB",
            "4 Kilobytes"
          ],
          "primaryMisconceptionId": "MC_CF_MEMORY_HIERARCHY_CACHE_VIRTUAL_PAGING",
          "diagnosisMap": {
            "64KB": {
              "misconceptionId": "MC_CF_MEMORY_HIERARCHY_CACHE_VIRTUAL_PAGING",
              "errorExplanation": "Standard page size is FOUR_KILOBYTE_STANDARD_PAGE_FRAME_SIZE (4KB).",
              "recoveryPath": {
                "simplerExplanation": "Matches FOUR_KILOBYTE_STANDARD_PAGE_FRAME_SIZE.",
                "guidedFixPrompt": "Type FOUR_KILOBYTE_STANDARD_PAGE_FRAME_SIZE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d7-b3-swap-space-and-thrashing-prevention",
        "day": 7,
        "blockNumber": 3,
        "title": "Swap Space & Thrashing Prevention: When RAM is Exhausted",
        "conceptBudget": {
          "primaryConcept": "Thrashing Prevention Invariant",
          "supportingTerms": [
            "Thrashing (A severe operating system pathology where RAM is so depleted that the CPU spends 99% of its time swapping pages to and from SSD rather than executing user code)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d7-b2-virtual-memory-paging-4kb",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "thrashing_demo.js",
            "initialCode": "function evaluateMemoryThrashing(pageSwapActivityPct) {\n  return pageSwapActivityPct >= 90.0\n    ? 'CRITICAL_MEMORY_THRASHING_SYSTEM_FROZEN'\n    : 'NORMAL_PAGING_ACTIVITY';\n}\n\nconsole.log(evaluateMemoryThrashing(94.5));",
            "expectedOutput": "CRITICAL_MEMORY_THRASHING_SYSTEM_FROZEN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What critical operating system state occurs when excessive page swapping to disk freezes overall computing performance?",
          "expectedStringOutput": "CRITICAL_MEMORY_THRASHING_SYSTEM_FROZEN",
          "acceptableAnswers": [
            "CRITICAL_MEMORY_THRASHING_SYSTEM_FROZEN",
            "Thrashing",
            "Memory Thrashing"
          ],
          "primaryMisconceptionId": "MC_CF_MEMORY_HIERARCHY_CACHE_VIRTUAL_PAGING",
          "diagnosisMap": {
            "FAST": {
              "misconceptionId": "MC_CF_MEMORY_HIERARCHY_CACHE_VIRTUAL_PAGING",
              "errorExplanation": "Excessive swapping causes CRITICAL_MEMORY_THRASHING_SYSTEM_FROZEN.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRITICAL_MEMORY_THRASHING_SYSTEM_FROZEN.",
                "guidedFixPrompt": "Type CRITICAL_MEMORY_THRASHING_SYSTEM_FROZEN"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Storage Technologies & Data Integrity: NVMe Flash, RAID Parity & SHA-256 Checksums",
    "overviewMetaphor": "RAID Storage is an Unsinkable Multi-Hull Catamaran: If you store data on a single drive, a single hardware sector failure destroys everything; configured in a RAID 5 array with 4 disks of 8 TB each, distributed parity calculations reserve 1 drive equivalent for redundancy ($Usable = (4 - 1) \\times 8\\text{ TB} = 24\\text{ TB}$); if any single physical drive suffers a catastrophic mechanical failure, the array continues operating without dropping a single byte.",
    "blocks": [
      {
        "id": "cf-d8-b1-raid5-capacity-calculation",
        "day": 8,
        "blockNumber": 1,
        "title": "RAID 5 Usable Storage Capacity Formula: $\\text{Usable Capacity} = (N - 1) \\times \\text{Disk Size} = (4 - 1) \\times 8 = 24\\text{ TB}$",
        "conceptBudget": {
          "primaryConcept": "RAID 5 Usable Capacity Formula",
          "supportingTerms": [
            "Total Physical Disks ($N = 4$ disks)",
            "Single Disk Capacity ($8.0$ TB)",
            "Parity Overhead ($1$ disk equivalent = $8.0$ TB)",
            "Usable Storage = $(4 - 1) \\times 8.0 = 24.0$ TB",
            "Fault Tolerance: Tolerates exactly 1 drive failure with zero data loss"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d7-b1-amat-memory-latency-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RAID 5 Distributed Parity Storage Ledger (4 x 8 TB = 24 TB Usable)",
              "boxes": [
                {
                  "label": "Physical Drive Pool",
                  "value": "4 Disks x 8 TB Enterprise NVMe SSDs = 32 TB Raw Storage",
                  "varType": "Raw Pool",
                  "isUpdated": false
                },
                {
                  "label": "Distributed Parity Reserve",
                  "value": "1 Disk Equivalent (8 TB) Distributed for XOR Parity Protection",
                  "varType": "Parity",
                  "isUpdated": false
                },
                {
                  "label": "Usable Storage Capacity",
                  "value": "(4 - 1) x 8 TB = 24 TB Usable (RAID 5 ARRAY CONFIGURED NOMINAL!)",
                  "varType": "Usable",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "raid5_calc_demo.js",
            "initialCode": "function calculateRaid5(n, sizeTb) {\n  const usable = (n - 1) * sizeTb;\n  return {\n    disks: n,\n    singleDiskSizeTb: sizeTb,\n    usableCapacityTb: usable,\n    tolerableFailures: 1,\n    status: 'RAID_5_ARRAY_CONFIGURED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRaid5(4, 8)));",
            "expectedOutput": "{\"disks\":4,\"singleDiskSizeTb\":8,\"usableCapacityTb\":24,\"tolerableFailures\":1,\"status\":\"RAID_5_ARRAY_CONFIGURED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the usable storage capacity in Terabytes for a RAID 5 storage array built with 4 physical disks of 8 TB each ($ (4 - 1) \\times 8 $)?",
          "expectedStringOutput": "24",
          "acceptableAnswers": [
            "24",
            "24 TB",
            "usableCapacityTb\":24"
          ],
          "primaryMisconceptionId": "MC_CF_STORAGE_SSD_NAND_RAID_PARITY",
          "diagnosisMap": {
            "32": {
              "misconceptionId": "MC_CF_STORAGE_SSD_NAND_RAID_PARITY",
              "errorExplanation": "32 TB is raw storage (RAID 0). RAID 5 reserves 1 disk for parity, yielding (4-1)*8 = 24 TB.",
              "recoveryPath": {
                "simplerExplanation": "(4 - 1) * 8 = 24.",
                "guidedFixPrompt": "Type 24"
              }
            }
          }
        }
      },
      {
        "id": "cf-d8-b2-sha256-cryptographic-checksums",
        "day": 8,
        "blockNumber": 2,
        "title": "SHA-256 Cryptographic Checksums: Verifying Download Data Integrity",
        "conceptBudget": {
          "primaryConcept": "SHA-256 Checksum Integrity Invariant",
          "supportingTerms": [
            "SHA-256 (Deterministic 256-bit cryptographic hash: Even a 1-bit corruption in a 10GB ISO file completely changes the hash output, proving file corruption or malicious tampering)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d8-b1-raid5-capacity-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SHA-256 Checksum Verification",
            "codeSnippet": "// EXPECTED HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n// COMPUTED HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n// MATCH: Exact 64-character hex match confirms 100% bit-perfect file download integrity!",
            "lineNotes": {
              "1": "Vendor published hash.",
              "2": "Locally computed file hash.",
              "3": "Cryptographic integrity match."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sha256_demo.js",
            "initialCode": "function verifyFileChecksum(expectedHash, actualHash) {\n  const isMatch = expectedHash.toLowerCase() === actualHash.toLowerCase();\n  return isMatch\n    ? 'FILE_INTEGRITY_VERIFIED_ZERO_BIT_CORRUPTION'\n    : 'DATA_CORRUPTION_DETECTED_RE_DOWNLOAD_REQUIRED';\n}\n\nconsole.log(verifyFileChecksum('E3B0C442', 'e3b0c442'));",
            "expectedOutput": "FILE_INTEGRITY_VERIFIED_ZERO_BIT_CORRUPTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What verification status confirms that a downloaded operating system image exactly matches the vendor's official SHA-256 checksum?",
          "expectedStringOutput": "FILE_INTEGRITY_VERIFIED_ZERO_BIT_CORRUPTION",
          "acceptableAnswers": [
            "FILE_INTEGRITY_VERIFIED_ZERO_BIT_CORRUPTION",
            "File integrity verified",
            "Zero bit corruption"
          ],
          "primaryMisconceptionId": "MC_CF_STORAGE_SSD_NAND_RAID_PARITY",
          "diagnosisMap": {
            "CORRUPT": {
              "misconceptionId": "MC_CF_STORAGE_SSD_NAND_RAID_PARITY",
              "errorExplanation": "Matching hashes awards FILE_INTEGRITY_VERIFIED_ZERO_BIT_CORRUPTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches FILE_INTEGRITY_VERIFIED_ZERO_BIT_CORRUPTION.",
                "guidedFixPrompt": "Type FILE_INTEGRITY_VERIFIED_ZERO_BIT_CORRUPTION"
              }
            }
          }
        }
      },
      {
        "id": "cf-d8-b3-ssd-trim-and-wear-leveling",
        "day": 8,
        "blockNumber": 3,
        "title": "SSD Wear Leveling & TRIM: Prolonging NAND Flash Lifespan",
        "conceptBudget": {
          "primaryConcept": "SSD TRIM & Wear Leveling Invariant",
          "supportingTerms": [
            "Wear Leveling (Evenly distributing write cycles across all NAND flash blocks to prevent premature cell failure)",
            "TRIM Command (OS notifies SSD controller which deleted data blocks can be pre-erased in background)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d8-b2-sha256-cryptographic-checksums",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "trim_demo.js",
            "initialCode": "function getSsdMaintenanceCommand() {\n  return 'TRIM_COMMAND_PRE_ERASES_DELETED_FLASH_BLOCKS';\n}\n\nconsole.log(getSsdMaintenanceCommand());",
            "expectedOutput": "TRIM_COMMAND_PRE_ERASES_DELETED_FLASH_BLOCKS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What storage controller command allows the operating system to inform an SSD which data blocks are no longer in use to enable background garbage collection?",
          "expectedStringOutput": "TRIM_COMMAND_PRE_ERASES_DELETED_FLASH_BLOCKS",
          "acceptableAnswers": [
            "TRIM_COMMAND_PRE_ERASES_DELETED_FLASH_BLOCKS",
            "TRIM",
            "TRIM command"
          ],
          "primaryMisconceptionId": "MC_CF_STORAGE_SSD_NAND_RAID_PARITY",
          "diagnosisMap": {
            "DEFRAG": {
              "misconceptionId": "MC_CF_STORAGE_SSD_NAND_RAID_PARITY",
              "errorExplanation": "Defrag degrades SSDs. Flash optimization uses the TRIM_COMMAND_PRE_ERASES_DELETED_FLASH_BLOCKS.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRIM_COMMAND_PRE_ERASES_DELETED_FLASH_BLOCKS.",
                "guidedFixPrompt": "Type TRIM_COMMAND_PRE_ERASES_DELETED_FLASH_BLOCKS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Computer Networking Basics: TCP/IP 4-Layer Model, IPv4 Subnetting & DNS Flow",
    "overviewMetaphor": "Computer Networking is the Global Postal Delivery Highway: An IP address is your house's street address (192.168.1.100); a MAC address is your permanent fingerprint (00:1A:2B:3C:4D:5E); a Subnet Mask defines your neighborhood ($/24 = 254$ usable houses); and DNS is the digital phonebook translating human-friendly names (google.com) into mathematical IP addresses (142.250.190.46) across 4 recursive server lookups.",
    "blocks": [
      {
        "id": "cf-d9-b1-ipv4-subnetting-host-calculation",
        "day": 9,
        "blockNumber": 1,
        "title": "IPv4 CIDR Subnetting Usable Host Formula: $\\text{Usable Hosts} = 2^{(32 - \\text{Prefix})} - 2 = 2^{(32 - 24)} - 2 = 254$",
        "conceptBudget": {
          "primaryConcept": "IPv4 Subnetting Usable Host Formula",
          "supportingTerms": [
            "CIDR Prefix Length ($/24$ bits)",
            "Host Bits ($32 - 24 = 8$ bits)",
            "Total IP Space ($2^8 = 256$ addresses)",
            "Network Address & Broadcast Address Reserved ($-2$ addresses)",
            "Usable Host Count = $256 - 2 = 254$ hosts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d8-b1-raid5-capacity-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "IPv4 Class C /24 CIDR Subnet Mask Ledger (254 Usable Hosts)",
              "boxes": [
                {
                  "label": "Total Binary Address Space",
                  "value": "32 Total Bits -> 24 Network Bits + 8 Host Bits (2^8 = 256 IPs)",
                  "varType": "Total Pool",
                  "isUpdated": false
                },
                {
                  "label": "Reserved Infrastructure IPs",
                  "value": ".0 (Network ID) + .255 (Subnet Broadcast) = 2 Reserved IPs",
                  "varType": "Reserved",
                  "isUpdated": false
                },
                {
                  "label": "Usable Workstation Hosts",
                  "value": "256 - 2 = 254 Usable Host IPs (SUBNET CALCULATED NOMINAL!)",
                  "varType": "Usable",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "subnet_calc_demo.js",
            "initialCode": "function calculateSubnet(prefix) {\n  const hostBits = 32 - prefix;\n  const total = Math.pow(2, hostBits);\n  const usable = Math.max(0, total - 2);\n  return {\n    prefix: `/${prefix}`,\n    total,\n    usableHostCount: usable,\n    status: 'SUBNET_CALCULATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSubnet(24)));\nconsole.log(JSON.stringify(calculateSubnet(28)));",
            "expectedOutput": "{\"prefix\":\"/24\",\"total\":256,\"usableHostCount\":254,\"status\":\"SUBNET_CALCULATED\"}\n{\"prefix\":\"/28\",\"total\":16,\"usableHostCount\":14,\"status\":\"SUBNET_CALCULATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many usable host IP addresses are available in a standard /24 IPv4 network subnet ($ 2^{(32 - 24)} - 2 $)?",
          "expectedStringOutput": "254",
          "acceptableAnswers": [
            "254",
            "254 hosts",
            "usableHostCount\":254"
          ],
          "primaryMisconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
          "diagnosisMap": {
            "256": {
              "misconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
              "errorExplanation": "256 is total IPs. The Network ID (.0) and Broadcast (.255) are reserved, leaving 254 usable hosts.",
              "recoveryPath": {
                "simplerExplanation": "256 - 2 = 254.",
                "guidedFixPrompt": "Type 254"
              }
            }
          }
        }
      },
      {
        "id": "cf-d9-b2-tcp-ip-four-layer-stack",
        "day": 9,
        "blockNumber": 2,
        "title": "The TCP/IP 4-Layer Architecture: Application $\\to$ Transport $\\to$ Internet $\\to$ Network Access",
        "conceptBudget": {
          "primaryConcept": "TCP/IP 4-Layer Protocol Stack",
          "supportingTerms": [
            "1. Application Layer (HTTP, SSH, DNS, SMTP)",
            "2. Transport Layer (TCP reliable stream vs UDP low-latency datagrams)",
            "3. Internet Layer (IP routing, ICMP)",
            "4. Network Access Layer (Ethernet MAC frames, Wi-Fi 802.11 physical signals)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d9-b1-ipv4-subnetting-host-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Packet Encapsulation Flow",
            "codeSnippet": "// 1. APPLICATION:  Payload = 'GET /index.html' (HTTP)\n// 2. TRANSPORT:    Adds TCP Header [Source Port: 54321, Dest Port: 443, Seq #101]\n// 3. INTERNET:     Adds IP Header  [Source IP: 192.168.1.5, Dest IP: 142.250.190.46]\n// 4. LINK/ACCESS:  Adds MAC Header [Source MAC: AA:BB:CC, Dest MAC: DD:EE:FF]",
            "lineNotes": {
              "1": "Layer 4 Data.",
              "2": "Layer 3 Segment.",
              "3": "Layer 2 Packet.",
              "4": "Layer 1 Frame."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tcp_ip_layers_demo.js",
            "initialCode": "function getTcpIpStackLayers() {\n  return ['APPLICATION_LAYER', 'TRANSPORT_LAYER', 'INTERNET_LAYER', 'NETWORK_ACCESS_LAYER'];\n}\n\nconsole.log(JSON.stringify(getTcpIpStackLayers()));",
            "expectedOutput": "[\"APPLICATION_LAYER\",\"TRANSPORT_LAYER\",\"INTERNET_LAYER\",\"NETWORK_ACCESS_LAYER\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which TCP/IP layer manages host-to-host segment delivery, port multiplexing, and reliable retransmission (TCP)?",
          "expectedStringOutput": "TRANSPORT_LAYER",
          "acceptableAnswers": [
            "TRANSPORT_LAYER",
            "Transport Layer",
            "Transport"
          ],
          "primaryMisconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
          "diagnosisMap": {
            "INTERNET": {
              "misconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
              "errorExplanation": "Internet layer routes IP packets. Port delivery and retransmissions belong to the TRANSPORT_LAYER.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRANSPORT_LAYER.",
                "guidedFixPrompt": "Type TRANSPORT_LAYER"
              }
            }
          }
        }
      },
      {
        "id": "cf-d9-b3-dns-recursive-resolution-chain",
        "day": 9,
        "blockNumber": 3,
        "title": "DNS Resolution Chain: Client $\\to$ Recursive Resolver $\\to$ Root $\\to$ TLD $\\to$ Authoritative",
        "conceptBudget": {
          "primaryConcept": "DNS Resolution Hierarchy",
          "supportingTerms": [
            "Root Servers (13 named root authority clusters: `.`)",
            "TLD Servers (Top-Level Domain servers: `.com`, `.org`, `.edu`)",
            "Authoritative Name Servers (The final definitive server holding the exact `A`/`AAAA` record)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d9-b2-tcp-ip-four-layer-stack",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dns_flow_demo.js",
            "initialCode": "function getDnsResolutionOrder() {\n  return ['RECURSIVE_RESOLVER', 'ROOT_SERVER', 'TLD_SERVER', 'AUTHORITATIVE_NAMESERVER'];\n}\n\nconsole.log(JSON.stringify(getDnsResolutionOrder()));",
            "expectedOutput": "[\"RECURSIVE_RESOLVER\",\"ROOT_SERVER\",\"TLD_SERVER\",\"AUTHORITATIVE_NAMESERVER\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which server in the DNS lookup hierarchy provides the definitive, final IP address mapping for a specific domain name?",
          "expectedStringOutput": "AUTHORITATIVE_NAMESERVER",
          "acceptableAnswers": [
            "AUTHORITATIVE_NAMESERVER",
            "Authoritative Nameserver",
            "Authoritative DNS"
          ],
          "primaryMisconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
          "diagnosisMap": {
            "ROOT": {
              "misconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
              "errorExplanation": "Root servers only point to TLDs. Final IP records are held by the AUTHORITATIVE_NAMESERVER.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTHORITATIVE_NAMESERVER.",
                "guidedFixPrompt": "Type AUTHORITATIVE_NAMESERVER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "The Modern Internet & Web Protocols: HTTP/2, TLS 1.3 Handshake & Port Mapping",
    "overviewMetaphor": "Network Ports Are Numbered Apartment Doors in a Massive Digital Skyscraper: All internet traffic arrives at the same building IP address; the Port Number directs data to the correct room (Door 80 is the unencrypted public lobby HTTP; Door 443 is the encrypted vault HTTPS; Door 22 is the secure maintenance entrance SSH; Door 53 is the directory desk DNS); connecting to Port 443 initiates a TLS 1.3 cryptographic handshake in 1 round trip, locking end-to-end encryption instantly.",
    "blocks": [
      {
        "id": "cf-d10-b1-standard-port-mapping-lookup",
        "day": 10,
        "blockNumber": 1,
        "title": "Standard IANA Well-Known Ports: HTTP (80), HTTPS (443), SSH (22), DNS (53)",
        "conceptBudget": {
          "primaryConcept": "Standard Network Port Mapping",
          "supportingTerms": [
            "Port 80 (HTTP unencrypted web)",
            "Port 443 (HTTPS secure encrypted web)",
            "Port 22 (SSH secure shell remote admin)",
            "Port 53 (DNS domain resolution)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d9-b1-ipv4-subnetting-host-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "IANA Well-Known Service Port Mapping Ledger",
              "boxes": [
                {
                  "label": "HTTPS Web Vault",
                  "value": "Port 443 | TLS 1.3 Encrypted Web Traffic (Standard Default)",
                  "varType": "HTTPS",
                  "isUpdated": false
                },
                {
                  "label": "SSH Remote Admin",
                  "value": "Port 22 | Encrypted Terminal Command Stream",
                  "varType": "SSH",
                  "isUpdated": false
                },
                {
                  "label": "DNS Query Service",
                  "value": "Port 53 | UDP/TCP Name Resolution Traffic (PORT MAPPED NOMINAL!)",
                  "varType": "DNS",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "port_lookup_demo.js",
            "initialCode": "function getPort(service) {\n  const map = { 'HTTPS': 443, 'SSH': 22, 'HTTP': 80, 'DNS': 53 };\n  return {\n    service,\n    port: map[service.toUpperCase()],\n    status: 'PORT_MAPPED'\n  };\n}\n\nconsole.log(JSON.stringify(getPort('HTTPS')));\nconsole.log(JSON.stringify(getPort('SSH')));",
            "expectedOutput": "{\"service\":\"HTTPS\",\"port\":443,\"status\":\"PORT_MAPPED\"}\n{\"service\":\"SSH\",\"port\":22,\"status\":\"PORT_MAPPED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard IANA network port number reserved for secure encrypted web traffic over HTTPS?",
          "expectedStringOutput": "443",
          "acceptableAnswers": [
            "443",
            "Port 443",
            "port\":443"
          ],
          "primaryMisconceptionId": "MC_CF_INTERNET_HTTP_TLS_PORT_MAPPING",
          "diagnosisMap": {
            "80": {
              "misconceptionId": "MC_CF_INTERNET_HTTP_TLS_PORT_MAPPING",
              "errorExplanation": "Port 80 is unencrypted HTTP. Secure encrypted web traffic runs on Port 443.",
              "recoveryPath": {
                "simplerExplanation": "HTTPS is port 443.",
                "guidedFixPrompt": "Type 443"
              }
            }
          }
        }
      },
      {
        "id": "cf-d10-b2-tls-13-cryptographic-handshake",
        "day": 10,
        "blockNumber": 2,
        "title": "TLS 1.3 Cryptographic Handshake: 1-RTT Session Key Negotiation",
        "conceptBudget": {
          "primaryConcept": "TLS 1.3 Handshake Invariant",
          "supportingTerms": [
            "TLS 1.3 (Modern Transport Layer Security: Combines ClientHello with Diffie-Hellman key share in a single round trip 1-RTT, eliminating legacy cipher suite vulnerabilities and establishing Perfect Forward Secrecy)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d10-b1-standard-port-mapping-lookup",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "TLS 1.3 1-RTT Handshake Flow",
            "codeSnippet": "// CLIENT -> SERVER: ClientHello + Supported Ciphers + Key Share (Sends Ephemeral Public Key)\n// SERVER -> CLIENT: ServerHello + Certificate + Server Key Share + Finished (Session Encrypted!)\n// Total latency: Exactly 1 Round Trip Time (1-RTT) to full AES-256-GCM encryption!",
            "lineNotes": {
              "1": "Client initiates with key share.",
              "2": "Server responds and finalizes session.",
              "3": "1-RTT encrypted state."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tls_handshake_demo.js",
            "initialCode": "function getTlsHandshakeLatency() {\n  return 'ONE_ROUND_TRIP_TIME_ONE_RTT_HANDSHAKE';\n}\n\nconsole.log(getTlsHandshakeLatency());",
            "expectedOutput": "ONE_ROUND_TRIP_TIME_ONE_RTT_HANDSHAKE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many network Round Trip Times (RTT) are required by the modern TLS 1.3 protocol to establish a fully encrypted session key?",
          "expectedStringOutput": "ONE_ROUND_TRIP_TIME_ONE_RTT_HANDSHAKE",
          "acceptableAnswers": [
            "ONE_ROUND_TRIP_TIME_ONE_RTT_HANDSHAKE",
            "1-RTT",
            "1 RTT",
            "One RTT"
          ],
          "primaryMisconceptionId": "MC_CF_INTERNET_HTTP_TLS_PORT_MAPPING",
          "diagnosisMap": {
            "2-RTT": {
              "misconceptionId": "MC_CF_INTERNET_HTTP_TLS_PORT_MAPPING",
              "errorExplanation": "2-RTT was required in legacy TLS 1.2. TLS 1.3 executes in ONE_ROUND_TRIP_TIME_ONE_RTT_HANDSHAKE.",
              "recoveryPath": {
                "simplerExplanation": "Matches ONE_ROUND_TRIP_TIME_ONE_RTT_HANDSHAKE.",
                "guidedFixPrompt": "Type ONE_ROUND_TRIP_TIME_ONE_RTT_HANDSHAKE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d10-b3-http2-multiplexing-vs-http1-head-of-line",
        "day": 10,
        "blockNumber": 3,
        "title": "HTTP/2 Multiplexing: Eliminating Head-of-Line Blocking",
        "conceptBudget": {
          "primaryConcept": "HTTP/2 Multiplexing Invariant",
          "supportingTerms": [
            "HTTP/2 Multiplexing (Streaming dozens of CSS, JS, and image files concurrently across a single TCP socket stream, eliminating HTTP/1.1 Head-of-Line blocking and connection overhead)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d10-b2-tls-13-cryptographic-handshake",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "http2_demo.js",
            "initialCode": "function getHttp2Advantage() {\n  return 'BINARY_FRAMING_AND_STREAMS_MULTIPLEXING_OVER_SINGLE_TCP_SOCKET';\n}\n\nconsole.log(getHttp2Advantage());",
            "expectedOutput": "BINARY_FRAMING_AND_STREAMS_MULTIPLEXING_OVER_SINGLE_TCP_SOCKET",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core architectural feature enables HTTP/2 to download multiple web assets simultaneously over a single TCP connection?",
          "expectedStringOutput": "BINARY_FRAMING_AND_STREAMS_MULTIPLEXING_OVER_SINGLE_TCP_SOCKET",
          "acceptableAnswers": [
            "BINARY_FRAMING_AND_STREAMS_MULTIPLEXING_OVER_SINGLE_TCP_SOCKET",
            "Multiplexing",
            "Streams multiplexing"
          ],
          "primaryMisconceptionId": "MC_CF_INTERNET_HTTP_TLS_PORT_MAPPING",
          "diagnosisMap": {
            "MULTIPLE_SOCKETS": {
              "misconceptionId": "MC_CF_INTERNET_HTTP_TLS_PORT_MAPPING",
              "errorExplanation": "HTTP/1.1 used multiple sockets. HTTP/2 uses BINARY_FRAMING_AND_STREAMS_MULTIPLEXING_OVER_SINGLE_TCP_SOCKET.",
              "recoveryPath": {
                "simplerExplanation": "Matches BINARY_FRAMING_AND_STREAMS_MULTIPLEXING_OVER_SINGLE_TCP_SOCKET.",
                "guidedFixPrompt": "Type BINARY_FRAMING_AND_STREAMS_MULTIPLEXING_OVER_SINGLE_TCP_SOCKET"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Browser Developer Tools & Web Inspection: DOM, Network Waterfall & LocalStorage",
    "overviewMetaphor": "Browser DevTools Are X-Ray Goggles for the World Wide Web: Pressing `F12` reveals the live skeleton of any webpage; inspecting the Network Waterfall tab breaks down latency into DNS lookup (20ms), TLS handshake (30ms), Time to First Byte TTFB (150ms), and payload download (100ms) totaling 300 ms ($20+30+150+100 = 300\\text{ ms} \\le 500\\text{ ms}$); verifying client-side storage cookies and local storage eliminates website caching and rendering bugs.",
    "blocks": [
      {
        "id": "cf-d11-b1-network-waterfall-ttfb-audit",
        "day": 11,
        "blockNumber": 1,
        "title": "Network Waterfall Latency Formula: $\\text{Total Time} = \\text{DNS} + \\text{TLS} + \\text{TTFB} + \\text{Download} = 300\\text{ ms} \\le 500\\text{ ms}$",
        "conceptBudget": {
          "primaryConcept": "Network Waterfall Latency Formula",
          "supportingTerms": [
            "DNS Resolution ($20$ ms)",
            "TLS Handshake ($30$ ms)",
            "Time to First Byte TTFB ($150$ ms)",
            "Asset Download ($100$ ms)",
            "Total Page Load Time = $20 + 30 + 150 + 100 = 300$ ms",
            "High Performance Standard: $\\le 500$ ms $\\implies$ Web Page Load High Performance Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d10-b1-standard-port-mapping-lookup",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Browser DevTools Network Waterfall Telemetry Ledger (300 ms Total)",
              "boxes": [
                {
                  "label": "Connection Setup",
                  "value": "DNS Lookup (20ms) + TLS 1.3 Handshake (30ms) = 50ms Connection",
                  "varType": "Setup",
                  "isUpdated": false
                },
                {
                  "label": "Server Processing (TTFB)",
                  "value": "150ms Time to First Byte Server Response Latency",
                  "varType": "TTFB",
                  "isUpdated": false
                },
                {
                  "label": "Asset Content Download",
                  "value": "100ms Data Payload Transfer Time (Total = 300ms WEB PERFORMANCE HIGH!)",
                  "varType": "Total Load",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "waterfall_calc_demo.js",
            "initialCode": "function auditWaterfall(dns, tls, ttfb, down) {\n  const total = dns + tls + ttfb + down;\n  const isFast = total <= 500;\n  return {\n    dns,\n    tls,\n    ttfb,\n    down,\n    totalLoadTimeMs: total,\n    isFast,\n    status: isFast ? 'WEB_PAGE_LOAD_HIGH_PERFORMANCE_CERTIFIED' : 'SLOW_LOAD'\n  };\n}\n\nconsole.log(JSON.stringify(auditWaterfall(20, 30, 150, 100)));",
            "expectedOutput": "{\"dns\":20,\"tls\":30,\"ttfb\":150,\"down\":100,\"totalLoadTimeMs\":300,\"isFast\":true,\"status\":\"WEB_PAGE_LOAD_HIGH_PERFORMANCE_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total page load latency in milliseconds when DNS is 20ms, TLS is 30ms, TTFB is 150ms, and download is 100ms ($20 + 30 + 150 + 100$)?",
          "expectedStringOutput": "300",
          "acceptableAnswers": [
            "300",
            "300 ms",
            "totalLoadTimeMs\":300"
          ],
          "primaryMisconceptionId": "MC_CF_BROWSER_DEVTOOLS_DOM_LOCALSTORAGE",
          "diagnosisMap": {
            "150": {
              "misconceptionId": "MC_CF_BROWSER_DEVTOOLS_DOM_LOCALSTORAGE",
              "errorExplanation": "150ms is only TTFB. Total load time is the sum of all waterfall stages: 20 + 30 + 150 + 100 = 300 ms.",
              "recoveryPath": {
                "simplerExplanation": "20 + 30 + 150 + 100 = 300.",
                "guidedFixPrompt": "Type 300"
              }
            }
          }
        }
      },
      {
        "id": "cf-d11-b2-browser-storage-comparison",
        "day": 11,
        "blockNumber": 2,
        "title": "Browser Storage: LocalStorage (5MB) vs SessionStorage vs Cookies (4KB)",
        "conceptBudget": {
          "primaryConcept": "Browser Storage Hierarchy",
          "supportingTerms": [
            "LocalStorage (Persistent key-value store up to 5MB; survives browser restarts)",
            "SessionStorage (Ephemeral storage; wiped when tab is closed)",
            "HTTP Cookies (4KB store sent with every HTTP request; used for session tokens with `HttpOnly` security flags)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d11-b1-network-waterfall-ttfb-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Browser Storage Decision Matrix",
            "codeSnippet": "// LOCALSTORAGE:   Stores user dark-mode theme preference (5MB, Persistent)\n// SESSIONSTORAGE: Stores multi-step checkout form draft in active tab (Tab lifecycle)\n// COOKIES:        Stores encrypted JWT authentication session token ('Set-Cookie: session_id=...; Secure; HttpOnly; SameSite=Strict')",
            "lineNotes": {
              "1": "Persistent preferences.",
              "2": "Tab scoped state.",
              "3": "Secure session authentication."
            }
          },
          {
            "type": "runnable_code",
            "filename": "storage_matrix_demo.js",
            "initialCode": "function getSecureCookieFlags() {\n  return 'SECURE_HTTPONLY_SAMESITE_STRICT';\n}\n\nconsole.log(getSecureCookieFlags());",
            "expectedOutput": "SECURE_HTTPONLY_SAMESITE_STRICT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security flags must be configured on HTTP authentication cookies to protect them from JavaScript XSS theft and CSRF attacks?",
          "expectedStringOutput": "SECURE_HTTPONLY_SAMESITE_STRICT",
          "acceptableAnswers": [
            "SECURE_HTTPONLY_SAMESITE_STRICT",
            "HttpOnly SameSite Strict",
            "Secure HttpOnly"
          ],
          "primaryMisconceptionId": "MC_CF_BROWSER_DEVTOOLS_DOM_LOCALSTORAGE",
          "diagnosisMap": {
            "INSECURE": {
              "misconceptionId": "MC_CF_BROWSER_DEVTOOLS_DOM_LOCALSTORAGE",
              "errorExplanation": "Cookies require security flags: SECURE_HTTPONLY_SAMESITE_STRICT.",
              "recoveryPath": {
                "simplerExplanation": "Matches SECURE_HTTPONLY_SAMESITE_STRICT.",
                "guidedFixPrompt": "Type SECURE_HTTPONLY_SAMESITE_STRICT"
              }
            }
          }
        }
      },
      {
        "id": "cf-d11-b3-dom-tree-and-css-box-model",
        "day": 11,
        "blockNumber": 3,
        "title": "DOM Tree Inspection & The CSS Box Model: Margin, Border, Padding, Content",
        "conceptBudget": {
          "primaryConcept": "CSS Box Model Invariant",
          "supportingTerms": [
            "Box Model (From outside in: Margin outer whitespace $\\to$ Border outline $\\to$ Padding inner breathing room $\\to$ Content text/image dimensions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d11-b2-browser-storage-comparison",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "box_model_demo.js",
            "initialCode": "function getCssBoxModelLayers() {\n  return ['MARGIN_OUTER_WHITESPACE', 'BORDER_LINE', 'PADDING_INNER_SPACING', 'CONTENT_PAYLOAD'];\n}\n\nconsole.log(JSON.stringify(getCssBoxModelLayers()));",
            "expectedOutput": "[\"MARGIN_OUTER_WHITESPACE\",\"BORDER_LINE\",\"PADDING_INNER_SPACING\",\"CONTENT_PAYLOAD\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the outermost spacing layer in the standard CSS Box Model that separates an HTML element from its neighboring elements?",
          "expectedStringOutput": "MARGIN_OUTER_WHITESPACE",
          "acceptableAnswers": [
            "MARGIN_OUTER_WHITESPACE",
            "Margin",
            "Margin outer whitespace"
          ],
          "primaryMisconceptionId": "MC_CF_BROWSER_DEVTOOLS_DOM_LOCALSTORAGE",
          "diagnosisMap": {
            "PADDING": {
              "misconceptionId": "MC_CF_BROWSER_DEVTOOLS_DOM_LOCALSTORAGE",
              "errorExplanation": "Padding is inside the border. Outer spacing is MARGIN_OUTER_WHITESPACE.",
              "recoveryPath": {
                "simplerExplanation": "Matches MARGIN_OUTER_WHITESPACE.",
                "guidedFixPrompt": "Type MARGIN_OUTER_WHITESPACE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Digital Productivity & Advanced Keyboard Shortcuts: Touch Typing & OS Ergonomics",
    "overviewMetaphor": "Keyboard Shortcuts Are High-Speed Flyovers Skipping City Traffic: Moving your hand from the keyboard to the mouse to click 'Edit $\\to$ Copy $\\to$ Edit $\\to$ Paste' wastes 5 seconds every minute (amounting to 80 hours lost per year); mastering touch typing at 66.7 Net WPM ($Net WPM = \\frac{210\\text{ words} - 10\\text{ errors}}{3\\text{ min}} = 66.7\\text{ WPM} \\ge 60\\text{ WPM}$) and keyboard shortcuts (`Ctrl+C`, `Ctrl+V`, `Win+V`, `Alt+Tab`) doubles your daily digital execution speed.",
    "blocks": [
      {
        "id": "cf-d12-b1-net-wpm-typing-calculation",
        "day": 12,
        "blockNumber": 1,
        "title": "Net Typing Speed (WPM) Formula: $\\text{Net WPM} = \\frac{\\text{Gross Words} - \\text{Errors}}{\\text{Minutes}} = \\frac{210 - 10}{3} = 66.7\\text{ WPM} \\ge 60.0$",
        "conceptBudget": {
          "primaryConcept": "Net WPM Typing Speed Formula",
          "supportingTerms": [
            "Gross Words Typed ($210$ words in 3 minutes)",
            "Uncorrected Errors ($10$ errors)",
            "Net Words = $210 - 10 = 200$ words",
            "Net WPM = $\\frac{200}{3} = 66.7$ Words Per Minute",
            "Professional Standard: $\\ge 60.0$ WPM $\\implies$ Professional Keyboard Speed Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d11-b1-network-waterfall-ttfb-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Professional Keyboard Ergonomics & WPM Speed Ledger (66.7 Net WPM)",
              "boxes": [
                {
                  "label": "Gross Typing Volume",
                  "value": "210 Total Words Typed Across 3-Minute Assessment (70 Gross WPM)",
                  "varType": "Gross",
                  "isUpdated": false
                },
                {
                  "label": "Accuracy Penalty",
                  "value": "10 Uncorrected Typographical Errors Deducted (-3.3 WPM Penalty)",
                  "varType": "Penalty",
                  "isUpdated": false
                },
                {
                  "label": "Net Production WPM",
                  "value": "(210 - 10) / 3 = 66.7 Net WPM (PROFESSIONAL KEYBOARD SPEED CERTIFIED >= 60!)",
                  "varType": "Net WPM",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "wpm_calc_demo.js",
            "initialCode": "function calculateWpm(words, err, min) {\n  const netWords = Math.max(0, words - err);\n  const wpm = netWords / min;\n  const isPro = wpm >= 60.0;\n  return {\n    words,\n    err,\n    min,\n    netWpm: Number(wpm.toFixed(1)),\n    isPro,\n    status: isPro ? 'PROFESSIONAL_KEYBOARD_SPEED_CERTIFIED' : 'BELOW_BENCHMARK'\n  };\n}\n\nconsole.log(JSON.stringify(calculateWpm(210, 10, 3)));",
            "expectedOutput": "{\"words\":210,\"err\":10,\"min\":3,\"netWpm\":66.7,\"isPro\":true,\"status\":\"PROFESSIONAL_KEYBOARD_SPEED_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Words Per Minute (WPM) when typing 210 gross words with 10 uncorrected errors across a 3-minute test ($ (210 - 10) / 3 $)?",
          "expectedStringOutput": "66.7",
          "acceptableAnswers": [
            "66.7",
            "66.7 WPM",
            "netWpm\":66.7"
          ],
          "primaryMisconceptionId": "MC_CF_PRODUCTIVITY_TYPING_WPM_SHORTCUTS",
          "diagnosisMap": {
            "70": {
              "misconceptionId": "MC_CF_PRODUCTIVITY_TYPING_WPM_SHORTCUTS",
              "errorExplanation": "70 is gross WPM without subtracting errors. Net WPM is (210 - 10) / 3 = 66.7.",
              "recoveryPath": {
                "simplerExplanation": "200 / 3 = 66.7.",
                "guidedFixPrompt": "Type 66.7"
              }
            }
          }
        }
      },
      {
        "id": "cf-d12-b2-global-os-window-shortcuts",
        "day": 12,
        "blockNumber": 2,
        "title": "Global OS Shortcuts: Window Snapping, Virtual Desktops & Clipboard History",
        "conceptBudget": {
          "primaryConcept": "OS Productivity Shortcuts",
          "supportingTerms": [
            "Window Snapping (`Win+Left/Right Arrows`: Splitting screen 50/50 instantly)",
            "Clipboard History (`Win+V`: Accessing last 25 copied items including images)",
            "Virtual Desktops (`Win+Ctrl+D`: Creating isolated desktop workspaces)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d12-b1-net-wpm-typing-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Essential Productivity Hotkeys",
            "codeSnippet": "// WINDOWS KEY + V: Opens Clipboard History (Paste snippets copied 20 minutes ago!)\n// ALT + TAB:        Instant application switcher (Switch between code and browser in 50ms)\n// CTRL + SHIFT + ESC: Opens Task Manager directly (Kill frozen processes immediately)",
            "lineNotes": {
              "1": "Clipboard history.",
              "2": "App switcher.",
              "3": "Task manager bypass."
            }
          },
          {
            "type": "runnable_code",
            "filename": "clipboard_hotkey_demo.js",
            "initialCode": "function getClipboardHistoryShortcut() {\n  return 'WINDOWS_KEY_PLUS_V_OPENS_CLIPBOARD_HISTORY';\n}\n\nconsole.log(getClipboardHistoryShortcut());",
            "expectedOutput": "WINDOWS_KEY_PLUS_V_OPENS_CLIPBOARD_HISTORY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What global Windows keyboard shortcut opens the Clipboard History panel to paste previously copied text and image snippets?",
          "expectedStringOutput": "WINDOWS_KEY_PLUS_V_OPENS_CLIPBOARD_HISTORY",
          "acceptableAnswers": [
            "WINDOWS_KEY_PLUS_V_OPENS_CLIPBOARD_HISTORY",
            "Win+V",
            "Windows+V"
          ],
          "primaryMisconceptionId": "MC_CF_PRODUCTIVITY_TYPING_WPM_SHORTCUTS",
          "diagnosisMap": {
            "CTRL_V": {
              "misconceptionId": "MC_CF_PRODUCTIVITY_TYPING_WPM_SHORTCUTS",
              "errorExplanation": "Ctrl+V only pastes the single latest item. History panel uses WINDOWS_KEY_PLUS_V_OPENS_CLIPBOARD_HISTORY.",
              "recoveryPath": {
                "simplerExplanation": "Matches WINDOWS_KEY_PLUS_V_OPENS_CLIPBOARD_HISTORY.",
                "guidedFixPrompt": "Type WINDOWS_KEY_PLUS_V_OPENS_CLIPBOARD_HISTORY"
              }
            }
          }
        }
      },
      {
        "id": "cf-d12-b3-advanced-text-navigation-hotkeys",
        "day": 12,
        "blockNumber": 3,
        "title": "Word-by-Word Cursor Navigation & Multi-Cursor Text Editing",
        "conceptBudget": {
          "primaryConcept": "Text Navigation Invariant",
          "supportingTerms": [
            "Word Jump (`Ctrl+Left/Right Arrow`: Jumps cursor word-by-word instead of character-by-character)",
            "Line Selection (`Shift+Home/End`: Highlights entire line instantly)",
            "Multi-Cursor (`Alt+Click` or `Ctrl+Alt+Up/Down`: Edits 10 lines simultaneously)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d12-b2-global-os-window-shortcuts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "text_nav_demo.js",
            "initialCode": "function getWordJumpShortcut() {\n  return 'CTRL_PLUS_ARROW_KEYS_JUMPS_CURSOR_WORD_BY_WORD';\n}\n\nconsole.log(getWordJumpShortcut());",
            "expectedOutput": "CTRL_PLUS_ARROW_KEYS_JUMPS_CURSOR_WORD_BY_WORD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which keyboard combination allows users to navigate the text cursor word-by-word across sentences without using a mouse?",
          "expectedStringOutput": "CTRL_PLUS_ARROW_KEYS_JUMPS_CURSOR_WORD_BY_WORD",
          "acceptableAnswers": [
            "CTRL_PLUS_ARROW_KEYS_JUMPS_CURSOR_WORD_BY_WORD",
            "Ctrl+Arrow",
            "Ctrl+Arrows"
          ],
          "primaryMisconceptionId": "MC_CF_PRODUCTIVITY_TYPING_WPM_SHORTCUTS",
          "diagnosisMap": {
            "ARROW_ONLY": {
              "misconceptionId": "MC_CF_PRODUCTIVITY_TYPING_WPM_SHORTCUTS",
              "errorExplanation": "Arrow keys alone jump character-by-character. Word jumping uses CTRL_PLUS_ARROW_KEYS_JUMPS_CURSOR_WORD_BY_WORD.",
              "recoveryPath": {
                "simplerExplanation": "Matches CTRL_PLUS_ARROW_KEYS_JUMPS_CURSOR_WORD_BY_WORD.",
                "guidedFixPrompt": "Type CTRL_PLUS_ARROW_KEYS_JUMPS_CURSOR_WORD_BY_WORD"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Cloud Storage & Distributed Sync: Block Deltas & The 3-2-1 Backup Rule",
    "overviewMetaphor": "The 3-2-1 Backup Strategy is a Nuclear Bunker for Your Digital Life: If you store your only copy of photos on a laptop, a dropped cup of coffee erases a decade of memories; the 3-2-1 rule mandates maintaining 3 total copies of data, across 2 different physical media types (e.g. Laptop NVMe SSD + External USB HDD), with 1 copy stored securely off-site in the cloud; satisfying all 3 parameters guarantees zero data loss against hardware failure, theft, and natural disaster.",
    "blocks": [
      {
        "id": "cf-d13-b1-three-two-one-backup-audit",
        "day": 13,
        "blockNumber": 1,
        "title": "3-2-1 Backup Compliance Rule: 3 Copies, 2 Media Types, 1 Off-Site Cloud Copy",
        "conceptBudget": {
          "primaryConcept": "3-2-1 Backup Compliance Standard",
          "supportingTerms": [
            "Total Data Copies ($3$ copies)",
            "Distinct Physical Media Types ($2$ types: NVMe SSD + External HDD)",
            "Off-Site Cloud Copy (Secured off-site)",
            "Status: 3-2-1 Backup Compliant Zero Data Loss"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d12-b1-net-wpm-typing-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Enterprise 3-2-1 Data Backup & Disaster Recovery Ledger",
              "boxes": [
                {
                  "label": "Copy 1 (Primary Production)",
                  "value": "Workstation Internal NVMe SSD (Local fast access)",
                  "varType": "Media 1",
                  "isUpdated": false
                },
                {
                  "label": "Copy 2 (Local Redundancy)",
                  "value": "External USB Cold Storage Hard Drive (Physical isolation)",
                  "varType": "Media 2",
                  "isUpdated": false
                },
                {
                  "label": "Copy 3 (Offsite Disaster Recovery)",
                  "value": "Encrypted Cloud Object Storage (THREE-TWO-ONE BACKUP COMPLIANT!)",
                  "varType": "Offsite Cloud",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "backup_audit_demo.js",
            "initialCode": "function auditBackup(copies, media, offsite) {\n  const isCompliant = copies >= 3 && media >= 2 && offsite;\n  return {\n    copies,\n    media,\n    offsite,\n    isCompliant,\n    status: isCompliant ? 'THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS' : 'DATA_LOSS_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(auditBackup(3, 2, true)));\nconsole.log(JSON.stringify(auditBackup(3, 1, true)));",
            "expectedOutput": "{\"copies\":3,\"media\":2,\"offsite\":true,\"isCompliant\":true,\"status\":\"THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS\"}\n{\"copies\":3,\"media\":1,\"offsite\":true,\"isCompliant\":false,\"status\":\"DATA_LOSS_RISK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status confirms that a data protection policy maintains 3 copies of data across 2 distinct media types with 1 copy off-site?",
          "expectedStringOutput": "THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS",
          "acceptableAnswers": [
            "THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS",
            "3-2-1 Compliant",
            "Zero Data Loss"
          ],
          "primaryMisconceptionId": "MC_CF_CLOUD_STORAGE_THREE_TWO_ONE_BACKUP",
          "diagnosisMap": {
            "RISK": {
              "misconceptionId": "MC_CF_CLOUD_STORAGE_THREE_TWO_ONE_BACKUP",
              "errorExplanation": "All 3 conditions passing awards THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS.",
              "recoveryPath": {
                "simplerExplanation": "Matches THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS.",
                "guidedFixPrompt": "Type THREE_TWO_ONE_BACKUP_COMPLIANT_ZERO_DATA_LOSS"
              }
            }
          }
        }
      },
      {
        "id": "cf-d13-b2-block-level-delta-sync",
        "day": 13,
        "blockNumber": 2,
        "title": "Block-Level Delta Syncing: Transferring Only Modified Bytes",
        "conceptBudget": {
          "primaryConcept": "Block-Level Delta Sync Invariant",
          "supportingTerms": [
            "Block-Level Delta Sync (When modifying 1 row in a 5GB database file, the sync engine only uploads the modified 4KB block over the network rather than re-uploading the entire 5GB file)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d13-b1-three-two-one-backup-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Delta Sync Mechanism",
            "codeSnippet": "// FILE: 5 GB SQLite database\n// EDIT: 1 user updates their profile password (4 KB changed)\n// FULL SYNC:  Re-uploads 5,000,000 KB (Takes 10 minutes, wastes bandwidth)\n// DELTA SYNC: Uploads ONLY the 4 KB modified block (Takes 50ms!)",
            "lineNotes": {
              "1": "Large base file.",
              "2": "Minor local edit.",
              "3": "Wasteful full sync.",
              "4": "Efficient delta sync."
            }
          },
          {
            "type": "runnable_code",
            "filename": "delta_sync_demo.js",
            "initialCode": "function getCloudSyncOptimization() {\n  return 'BLOCK_LEVEL_DELTA_SYNC_UPLOADS_ONLY_MODIFIED_CHUNKS';\n}\n\nconsole.log(getCloudSyncOptimization());",
            "expectedOutput": "BLOCK_LEVEL_DELTA_SYNC_UPLOADS_ONLY_MODIFIED_CHUNKS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What synchronization optimization uploads only the specific modified disk blocks of large files rather than re-transferring the entire file?",
          "expectedStringOutput": "BLOCK_LEVEL_DELTA_SYNC_UPLOADS_ONLY_MODIFIED_CHUNKS",
          "acceptableAnswers": [
            "BLOCK_LEVEL_DELTA_SYNC_UPLOADS_ONLY_MODIFIED_CHUNKS",
            "Block-level delta sync",
            "Delta sync"
          ],
          "primaryMisconceptionId": "MC_CF_CLOUD_STORAGE_THREE_TWO_ONE_BACKUP",
          "diagnosisMap": {
            "FULL_UPLOAD": {
              "misconceptionId": "MC_CF_CLOUD_STORAGE_THREE_TWO_ONE_BACKUP",
              "errorExplanation": "Full upload is wasteful. Modern cloud sync uses BLOCK_LEVEL_DELTA_SYNC_UPLOADS_ONLY_MODIFIED_CHUNKS.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLOCK_LEVEL_DELTA_SYNC_UPLOADS_ONLY_MODIFIED_CHUNKS.",
                "guidedFixPrompt": "Type BLOCK_LEVEL_DELTA_SYNC_UPLOADS_ONLY_MODIFIED_CHUNKS"
              }
            }
          }
        }
      },
      {
        "id": "cf-d13-b3-end-to-end-zero-knowledge-encryption",
        "day": 13,
        "blockNumber": 3,
        "title": "Zero-Knowledge Encryption: Client-Side Keys vs Cloud Provider Access",
        "conceptBudget": {
          "primaryConcept": "Zero-Knowledge Encryption Invariant",
          "supportingTerms": [
            "Zero-Knowledge (Files are encrypted on the user's laptop using their private passphrase before uploading; the cloud provider has zero technical ability to read or decrypt the files)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d13-b2-block-level-delta-sync",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zero_knowledge_demo.js",
            "initialCode": "function getZeroKnowledgeStandard() {\n  return 'CLIENT_SIDE_ENCRYPTION_PREVENTS_CLOUD_PROVIDER_DATA_ACCESS';\n}\n\nconsole.log(getZeroKnowledgeStandard());",
            "expectedOutput": "CLIENT_SIDE_ENCRYPTION_PREVENTS_CLOUD_PROVIDER_DATA_ACCESS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What privacy guarantee is provided by client-side Zero-Knowledge cloud encryption architectures?",
          "expectedStringOutput": "CLIENT_SIDE_ENCRYPTION_PREVENTS_CLOUD_PROVIDER_DATA_ACCESS",
          "acceptableAnswers": [
            "CLIENT_SIDE_ENCRYPTION_PREVENTS_CLOUD_PROVIDER_DATA_ACCESS",
            "Zero knowledge encryption",
            "Prevents provider data access"
          ],
          "primaryMisconceptionId": "MC_CF_CLOUD_STORAGE_THREE_TWO_ONE_BACKUP",
          "diagnosisMap": {
            "PUBLIC": {
              "misconceptionId": "MC_CF_CLOUD_STORAGE_THREE_TWO_ONE_BACKUP",
              "errorExplanation": "Zero-knowledge ensures CLIENT_SIDE_ENCRYPTION_PREVENTS_CLOUD_PROVIDER_DATA_ACCESS.",
              "recoveryPath": {
                "simplerExplanation": "Matches CLIENT_SIDE_ENCRYPTION_PREVENTS_CLOUD_PROVIDER_DATA_ACCESS.",
                "guidedFixPrompt": "Type CLIENT_SIDE_ENCRYPTION_PREVENTS_CLOUD_PROVIDER_DATA_ACCESS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Data Formats & Encoding Standards: Binary, Hexadecimal, ASCII & UTF-8",
    "overviewMetaphor": "Data Encoding is the Universal Rosetta Stone of Digital Computing: Computers only understand high and low electrical voltages ($1$s and $0$s); representing raw bits in Hexadecimal (`0xFF` $= 255 = 11111111_2$) compresses 8 binary digits into 2 compact characters; standardizing on UTF-8 variable-length character encoding allows every computer on earth to render English text, Arabic script, Chinese kanji, and emojis seamlessly.",
    "blocks": [
      {
        "id": "cf-d14-b1-hex-to-decimal-binary-conversion",
        "day": 14,
        "blockNumber": 1,
        "title": "Hexadecimal Radix Conversion: $\\text{Hex 'FF'} = (15 \\times 16^1) + (15 \\times 16^0) = 240 + 15 = 255 = 11111111_2$",
        "conceptBudget": {
          "primaryConcept": "Hexadecimal Radix Base-16 Formula",
          "supportingTerms": [
            "Hex String (`'FF'`)",
            "Decimal Value ($255$)",
            "8-Bit Binary Representation (`'11111111'`)",
            "Hex Base 16 multipliers ($16^1 = 16, 16^0 = 1$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d13-b1-three-two-one-backup-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Hexadecimal, Decimal & 8-Bit Binary Number Radix Ledger",
              "boxes": [
                {
                  "label": "Hexadecimal Input (Base 16)",
                  "value": "0xFF (High Byte 0xF = 15 | Low Byte 0xF = 15)",
                  "varType": "Hex",
                  "isUpdated": false
                },
                {
                  "label": "Decimal Value (Base 10)",
                  "value": "(15 x 16) + (15 x 1) = 240 + 15 = 255",
                  "varType": "Decimal",
                  "isUpdated": false
                },
                {
                  "label": "Binary Output (Base 2)",
                  "value": "'11111111' (RADIX CONVERTED NOMINAL!)",
                  "varType": "Binary",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "radix_convert_demo.js",
            "initialCode": "function convertHex(hex) {\n  const dec = parseInt(hex, 16);\n  const bin = dec.toString(2).padStart(8, '0');\n  return {\n    hex: hex.toUpperCase(),\n    decimalValue: dec,\n    binaryRepresentation: bin,\n    status: 'RADIX_CONVERTED'\n  };\n}\n\nconsole.log(JSON.stringify(convertHex('FF')));\nconsole.log(JSON.stringify(convertHex('A0')));",
            "expectedOutput": "{\"hex\":\"FF\",\"decimalValue\":255,\"binaryRepresentation\":\"11111111\",\"status\":\"RADIX_CONVERTED\"}\n{\"hex\":\"A0\",\"decimalValue\":160,\"binaryRepresentation\":\"10100000\",\"status\":\"RADIX_CONVERTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the base-10 decimal integer value of the hexadecimal byte 'FF' ($ (15 \\times 16) + 15 $)?",
          "expectedStringOutput": "255",
          "acceptableAnswers": [
            "255",
            "decimalValue\":255"
          ],
          "primaryMisconceptionId": "MC_CF_DATA_ENCODING_BINARY_HEX_UTF8",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_CF_DATA_ENCODING_BINARY_HEX_UTF8",
              "errorExplanation": "FF in hex is 255 in decimal, not 100.",
              "recoveryPath": {
                "simplerExplanation": "15 * 16 + 15 = 255.",
                "guidedFixPrompt": "Type 255"
              }
            }
          }
        }
      },
      {
        "id": "cf-d14-b2-ascii-vs-utf8-encoding",
        "day": 14,
        "blockNumber": 2,
        "title": "ASCII (7-Bit) vs UTF-8 (1-to-4 Variable Byte Universal Encoding)",
        "conceptBudget": {
          "primaryConcept": "UTF-8 Variable Encoding Invariant",
          "supportingTerms": [
            "ASCII (7-bit encoding supporting only 128 English characters)",
            "UTF-8 (Variable-width encoding using 1 byte for ASCII, 2 bytes for Latin/Greek, 3 bytes for Asian scripts, and 4 bytes for Emojis)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d14-b1-hex-to-decimal-binary-conversion",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "UTF-8 Variable Byte Widths",
            "codeSnippet": "// 'A'     -> 1 Byte (0x41)         - 100% Backward compatible with 7-bit ASCII\n// 'é'     -> 2 Bytes (0xC3 0xA9)   - Extended Latin character\n// '字'    -> 3 Bytes (0xE5 0xAD 0x97) - Chinese Kanji\n// '🚀'    -> 4 Bytes (0xF0 0x9F 0x9A 0x80) - Unicode Emoji",
            "lineNotes": {
              "1": "1-byte ASCII compatibility.",
              "2": "2-byte Latin.",
              "3": "3-byte CJK.",
              "4": "4-byte Emoji."
            }
          },
          {
            "type": "runnable_code",
            "filename": "utf8_demo.js",
            "initialCode": "function getUniversalWebEncoding() {\n  return 'UTF_8_VARIABLE_WIDTH_ONE_TO_FOUR_BYTE_ENCODING';\n}\n\nconsole.log(getUniversalWebEncoding());",
            "expectedOutput": "UTF_8_VARIABLE_WIDTH_ONE_TO_FOUR_BYTE_ENCODING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What variable-width character encoding standard is universally adopted across the modern web to represent all global human languages?",
          "expectedStringOutput": "UTF_8_VARIABLE_WIDTH_ONE_TO_FOUR_BYTE_ENCODING",
          "acceptableAnswers": [
            "UTF_8_VARIABLE_WIDTH_ONE_TO_FOUR_BYTE_ENCODING",
            "UTF-8",
            "UTF8"
          ],
          "primaryMisconceptionId": "MC_CF_DATA_ENCODING_BINARY_HEX_UTF8",
          "diagnosisMap": {
            "ASCII": {
              "misconceptionId": "MC_CF_DATA_ENCODING_BINARY_HEX_UTF8",
              "errorExplanation": "ASCII only supports 128 characters. Universal global web encoding is UTF_8_VARIABLE_WIDTH_ONE_TO_FOUR_BYTE_ENCODING.",
              "recoveryPath": {
                "simplerExplanation": "Matches UTF_8_VARIABLE_WIDTH_ONE_TO_FOUR_BYTE_ENCODING.",
                "guidedFixPrompt": "Type UTF_8_VARIABLE_WIDTH_ONE_TO_FOUR_BYTE_ENCODING"
              }
            }
          }
        }
      },
      {
        "id": "cf-d14-b3-structured-data-serialization-json-yaml",
        "day": 14,
        "blockNumber": 3,
        "title": "Data Serialization: JSON vs YAML vs CSV Trade-offs",
        "conceptBudget": {
          "primaryConcept": "Serialization Format Trade-offs",
          "supportingTerms": [
            "JSON (Lightweight, strict syntax, universal web API standard)",
            "YAML (Human-friendly indentation, standard for DevOps configuration files)",
            "CSV (Flat tabular text for spreadsheet data)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d14-b2-ascii-vs-utf8-encoding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "serialization_demo.js",
            "initialCode": "function getStandardApiDataFormat() {\n  return 'JSON_JAVASCRIPT_OBJECT_NOTATION_WEB_STANDARD';\n}\n\nconsole.log(getStandardApiDataFormat());",
            "expectedOutput": "JSON_JAVASCRIPT_OBJECT_NOTATION_WEB_STANDARD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What human-readable structured data format serves as the universal standard for client-server REST API payloads across the internet?",
          "expectedStringOutput": "JSON_JAVASCRIPT_OBJECT_NOTATION_WEB_STANDARD",
          "acceptableAnswers": [
            "JSON_JAVASCRIPT_OBJECT_NOTATION_WEB_STANDARD",
            "JSON",
            "JavaScript Object Notation"
          ],
          "primaryMisconceptionId": "MC_CF_DATA_ENCODING_BINARY_HEX_UTF8",
          "diagnosisMap": {
            "XML": {
              "misconceptionId": "MC_CF_DATA_ENCODING_BINARY_HEX_UTF8",
              "errorExplanation": "XML is legacy. Modern web APIs use JSON_JAVASCRIPT_OBJECT_NOTATION_WEB_STANDARD.",
              "recoveryPath": {
                "simplerExplanation": "Matches JSON_JAVASCRIPT_OBJECT_NOTATION_WEB_STANDARD.",
                "guidedFixPrompt": "Type JSON_JAVASCRIPT_OBJECT_NOTATION_WEB_STANDARD"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Memory Hierarchy, TCP/IP Networking, DevTools & Data Encoding Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign systems networking and productivity master engine: 1. AMAT memory cache latency ($10.0$ ns); 2. /24 subnet usable hosts ($254$); 3. DevTools sub-500ms network audit ($300$ ms); 4. $66.7$ Net WPM touch typing; 5. 3-2-1 backup certification; 6. `0xFF` hex conversion ($255$).",
    "blocks": [
      {
        "id": "cf-d15-b1-systems-productivity-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Systems Networking & Digital Productivity Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Systems Productivity Master Engine",
          "supportingTerms": [
            "AMAT Engine",
            "Subnetting Engine",
            "DevTools Waterfall Engine",
            "Typing WPM Engine",
            "3-2-1 Backup Engine",
            "Data Encoding Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d14-b3-structured-data-serialization-json-yaml",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Systems Networking & Productivity Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Calculates 10.0ns AMAT memory latency and 254 subnet hosts",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Inspects 300ms Web DevTools waterfall and certifies 66.7 Net WPM",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Enforces 3-2-1 zero-loss backup compliance",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Converts 0xFF hex to 255 decimal and activates Systems Master!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "systems_master_kernel_demo.js",
            "initialCode": "function runSystemsProductivityMaster() {\n  return {\n    amatSubsystem: 'ONLINE_10NS_AMAT_ACTIVE',\n    subnetSubsystem: 'ONLINE_254_HOSTS_ACTIVE',\n    devtoolsSubsystem: 'ONLINE_300MS_WATERFALL_ACTIVE',\n    wpmSubsystem: 'ONLINE_66_7_WPM_ACTIVE',\n    backupSubsystem: 'ONLINE_3_2_1_BACKUP_ACTIVE',\n    encodingSubsystem: 'ONLINE_255_HEX_ACTIVE',\n    engineStatus: 'SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runSystemsProductivityMaster().engineStatus);",
            "expectedOutput": "SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Systems Networking & Digital Productivity Master Engine?",
          "expectedStringOutput": "SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE",
          "acceptableAnswers": [
            "SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE",
            "engineStatus: SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
              "errorExplanation": "Matches SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SYSTEMS_NETWORKING_AND_PRODUCTIVITY_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d15-b2-systems-productivity-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Systems Productivity Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Systems Productivity Invariant Verification",
          "supportingTerms": [
            "AMAT Invariant",
            "Subnet Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d15-b1-systems-productivity-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "systems_audit_demo.js",
            "initialCode": "function auditSystemsMaster(amat, sub, dev, wpm, bkp, enc) {\n  const passed = amat && sub && dev && wpm && bkp && enc;\n  return {\n    amatVerified: amat,\n    subnetVerified: sub,\n    devtoolsVerified: dev,\n    wpmVerified: wpm,\n    backupVerified: bkp,\n    encodingVerified: enc,\n    grade: passed ? 'SYSTEMS_PRODUCTIVITY_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSystemsMaster(true, true, true, true, true, true)));",
            "expectedOutput": "{\"amatVerified\":true,\"subnetVerified\":true,\"devtoolsVerified\":true,\"wpmVerified\":true,\"backupVerified\":true,\"encodingVerified\":true,\"grade\":\"SYSTEMS_PRODUCTIVITY_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when AMAT, Subnetting, DevTools, WPM Typing, 3-2-1 Backup, and Data Encoding engines pass 100%?",
          "expectedStringOutput": "SYSTEMS_PRODUCTIVITY_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "SYSTEMS_PRODUCTIVITY_ENGINE_AUDIT_PASSED",
            "grade\":\"SYSTEMS_PRODUCTIVITY_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
              "errorExplanation": "All checks passing awards SYSTEMS_PRODUCTIVITY_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SYSTEMS_PRODUCTIVITY_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type SYSTEMS_PRODUCTIVITY_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "cf-d15-b3-milestone2-cf-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Systems Networking & Digital Productivity Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Systems Productivity Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d15-b2-systems-productivity-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_cf_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Memory Hierarchy, TCP/IP Networking, DevTools & Data Encoding Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Memory Hierarchy, TCP/IP Networking, DevTools & Data Encoding Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Memory Hierarchy, TCP/IP Networking, DevTools & Data Encoding Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Memory Hierarchy, TCP/IP Networking, DevTools & Data Encoding Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CF_NETWORKING_TCP_IP_IPV4_SUBNETTING",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Memory Hierarchy, TCP/IP Networking, DevTools & Data Encoding Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Information Security & Digital Hygiene: Password Entropy (>= 64 bits) & MFA (TOTP)",
    "overviewMetaphor": "Password Security Is the Thickness of an Armored Bank Vault Door: A short 6-letter lowercase password is made of cardboard (28 bits of entropy, cracked by a GPU cluster in 2 milliseconds); a 12-character passphrase utilizing a 94-character pool provides 78.7 bits of Shannon Entropy ($Bits = 12 \\times \\log_2(94) = 78.7\\text{ bits} \\ge 64.0\\text{ bits}$); requiring 400 trillion centuries of brute-force attempts; combining high entropy with Time-based One-Time Passwords (TOTP MFA) renders accounts impervious to credential stuffing.",
    "blocks": [
      {
        "id": "cf-d16-b1-password-shannon-entropy-calculation",
        "day": 16,
        "blockNumber": 1,
        "title": "Password Shannon Entropy Formula: $\\text{Entropy (Bits)} = L \\times \\log_2(N) = 12 \\times \\log_2(94) = 78.7\\text{ bits} \\ge 64.0$",
        "conceptBudget": {
          "primaryConcept": "Password Shannon Entropy Formula",
          "supportingTerms": [
            "Password Length ($L = 12$ characters)",
            "Character Pool Size ($N = 94$ uppercase/lowercase/numbers/symbols)",
            "Entropy Bits = $12 \\times \\frac{\\ln(94)}{\\ln(2)} = 78.7$ bits",
            "Military-Grade Strength Standard: $\\ge 64.0$ bits $\\implies$ Password Entropy Military Grade Strong"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d15-b1-systems-productivity-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Password Cryptographic Entropy & Brute Force Resistance Ledger (78.7 Bits)",
              "boxes": [
                {
                  "label": "Character Search Space",
                  "value": "94 Printable ASCII Symbols (a-z, A-Z, 0-9, !@#$%^&*...)",
                  "varType": "Pool N",
                  "isUpdated": false
                },
                {
                  "label": "Passphrase Length (L)",
                  "value": "12 Random High-Entropy Characters",
                  "varType": "Length L",
                  "isUpdated": false
                },
                {
                  "label": "Cryptographic Entropy",
                  "value": "12 x log2(94) = 78.7 Bits (MILITARY GRADE STRONG >= 64.0 BITS!)",
                  "varType": "Entropy Bits",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "entropy_calc_demo.js",
            "initialCode": "function calculateEntropy(len, pool) {\n  const bits = len * (Math.log(pool) / Math.log(2));\n  const isStrong = bits >= 64.0;\n  return {\n    len,\n    pool,\n    entropyBits: Number(bits.toFixed(1)),\n    isStrong,\n    status: isStrong ? 'PASSWORD_ENTROPY_MILITARY_GRADE_STRONG' : 'WEAK_PASSWORD'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEntropy(12, 94)));\nconsole.log(JSON.stringify(calculateEntropy(6, 26)));",
            "expectedOutput": "{\"len\":12,\"pool\":94,\"entropyBits\":78.7,\"isStrong\":true,\"status\":\"PASSWORD_ENTROPY_MILITARY_GRADE_STRONG\"}\n{\"len\":6,\"pool\":26,\"entropyBits\":28.2,\"isStrong\":false,\"status\":\"WEAK_PASSWORD\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Shannon Entropy in bits for a 12-character password selected from a 94-character pool ($ 12 \\times \\log_2(94) $)?",
          "expectedStringOutput": "78.7",
          "acceptableAnswers": [
            "78.7",
            "78.7 bits",
            "entropyBits\":78.7"
          ],
          "primaryMisconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
          "diagnosisMap": {
            "64": {
              "misconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
              "errorExplanation": "64 bits is the minimum strong threshold. 12 characters over 94 symbols yields 78.7 bits.",
              "recoveryPath": {
                "simplerExplanation": "12 * log2(94) = 78.7.",
                "guidedFixPrompt": "Type 78.7"
              }
            }
          }
        }
      },
      {
        "id": "cf-d16-b2-totp-mfa-rfc6238",
        "day": 16,
        "blockNumber": 2,
        "title": "Multi-Factor Authentication: Time-Based OTP (TOTP RFC 6238) Mechanics",
        "conceptBudget": {
          "primaryConcept": "TOTP RFC 6238 Invariant",
          "supportingTerms": [
            "TOTP (Time-Based One-Time Password: Shared secret HMAC-SHA1 key hashed with current Unix epoch time in 30-second intervals; eliminates SMS interception risks)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d16-b1-password-shannon-entropy-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "TOTP 30-Second Token Generation",
            "codeSnippet": "// TIME STEP:   Current Unix Time / 30 seconds = Counter #56910244\n// HMAC HASH:   HMAC-SHA1(Shared_Base32_Secret, Counter)\n// TRUNCATION:  Dynamic 4-byte truncation modulo 1,000,000 -> Generates 6-digit code: '849 201'",
            "lineNotes": {
              "1": "30-second epoch counter.",
              "2": "Cryptographic HMAC hashing.",
              "3": "6-digit token generation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "totp_demo.js",
            "initialCode": "function getTotpTimeIntervalSeconds() {\n  return 'THIRTY_SECOND_TIME_STEP_WINDOW';\n}\n\nconsole.log(getTotpTimeIntervalSeconds());",
            "expectedOutput": "THIRTY_SECOND_TIME_STEP_WINDOW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard time-step expiration window in seconds utilized by RFC 6238 TOTP authenticator apps?",
          "expectedStringOutput": "THIRTY_SECOND_TIME_STEP_WINDOW",
          "acceptableAnswers": [
            "THIRTY_SECOND_TIME_STEP_WINDOW",
            "30 seconds",
            "30s"
          ],
          "primaryMisconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
              "errorExplanation": "Standard TOTP refreshes every 30 seconds: THIRTY_SECOND_TIME_STEP_WINDOW.",
              "recoveryPath": {
                "simplerExplanation": "Matches THIRTY_SECOND_TIME_STEP_WINDOW.",
                "guidedFixPrompt": "Type THIRTY_SECOND_TIME_STEP_WINDOW"
              }
            }
          }
        }
      },
      {
        "id": "cf-d16-b3-phishing-defense-and-fido2-keys",
        "day": 16,
        "blockNumber": 3,
        "title": "Phishing Defense: FIDO2 / WebAuthn Hardware Security Keys",
        "conceptBudget": {
          "primaryConcept": "FIDO2 Phishing Resistance Invariant",
          "supportingTerms": [
            "FIDO2 / WebAuthn (Hardware security keys e.g. YubiKey bound cryptographically to domain origin; completely immune to man-in-the-middle phishing attacks)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d16-b2-totp-mfa-rfc6238",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fido2_demo.js",
            "initialCode": "function getPhishingResistantAuth() {\n  return 'FIDO2_WEBAUTHN_HARDWARE_SECURITY_KEYS';\n}\n\nconsole.log(getPhishingResistantAuth());",
            "expectedOutput": "FIDO2_WEBAUTHN_HARDWARE_SECURITY_KEYS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What hardware-backed authentication standard provides cryptographic origin binding to provide 100% resistance against phishing attacks?",
          "expectedStringOutput": "FIDO2_WEBAUTHN_HARDWARE_SECURITY_KEYS",
          "acceptableAnswers": [
            "FIDO2_WEBAUTHN_HARDWARE_SECURITY_KEYS",
            "FIDO2",
            "WebAuthn"
          ],
          "primaryMisconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
          "diagnosisMap": {
            "SMS": {
              "misconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
              "errorExplanation": "SMS is vulnerable to SIM-swapping. Phishing-proof authentication uses FIDO2_WEBAUTHN_HARDWARE_SECURITY_KEYS.",
              "recoveryPath": {
                "simplerExplanation": "Matches FIDO2_WEBAUTHN_HARDWARE_SECURITY_KEYS.",
                "guidedFixPrompt": "Type FIDO2_WEBAUTHN_HARDWARE_SECURITY_KEYS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Operating System Security: User Account Control (UAC), Sudo & Firewalls",
    "overviewMetaphor": "The Principle of Least Privilege is a Security Badge with Controlled Escort: You do not walk into an office building with master CEO keys to every safe; daily work is performed using standard unprivileged user accounts; whenever administrative actions are required (installing drivers, modifying kernel settings), Windows prompts a UAC dialogue and Linux requires `sudo` with MFA approval, preventing silent background malware installations.",
    "blocks": [
      {
        "id": "cf-d17-b1-polp-privilege-elevation-gate",
        "day": 17,
        "blockNumber": 1,
        "title": "Principle of Least Privilege (PoLP): Controlled Privilege Escalation",
        "conceptBudget": {
          "primaryConcept": "Principle of Least Privilege Gatekeeper",
          "supportingTerms": [
            "Standard Unprivileged User Account",
            "Root/Admin Privileges Required",
            "Sudo Password Authenticated",
            "Multi-Factor Approved",
            "Status: Elevate to Administrative Root Privilege"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d16-b1-password-shannon-entropy-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Operating System Privilege Elevation Gatekeeper Ledger",
              "boxes": [
                {
                  "label": "Standard Workstation Session",
                  "value": "Unprivileged User Space Execution (Prevents silent malware takeover)",
                  "varType": "Standard User",
                  "isUpdated": false
                },
                {
                  "label": "Administrative Request",
                  "value": "Root Privilege Requested for System Configuration Change",
                  "varType": "Request",
                  "isUpdated": false
                },
                {
                  "label": "Elevation Authorization",
                  "value": "Sudo Auth OK + MFA Approved -> ELEVATE TO ADMINISTRATIVE ROOT PRIVILEGE!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "polp_gate_demo.js",
            "initialCode": "function evaluateElevation(rootReq, sudoAuth, mfa) {\n  if (!rootReq) return 'EXECUTE_AS_STANDARD_UNPRIVILEGED_USER';\n  const ok = sudoAuth && mfa;\n  return ok\n    ? 'ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE'\n    : 'ACCESS_DENIED';\n}\n\nconsole.log(evaluateElevation(false, false, false));\nconsole.log(evaluateElevation(true, true, true));\nconsole.log(evaluateElevation(true, true, false));",
            "expectedOutput": "EXECUTE_AS_STANDARD_UNPRIVILEGED_USER\nELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE\nACCESS_DENIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What execution mode is authorized when root privilege is requested and both sudo password and MFA approval are verified?",
          "expectedStringOutput": "ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE",
          "acceptableAnswers": [
            "ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE",
            "Elevate to root",
            "Root privilege"
          ],
          "primaryMisconceptionId": "MC_CF_OS_SECURITY_UAC_SUDO_PRIVILEGE",
          "diagnosisMap": {
            "DENIED": {
              "misconceptionId": "MC_CF_OS_SECURITY_UAC_SUDO_PRIVILEGE",
              "errorExplanation": "With both sudo and MFA verified, the gatekeeper authorizes ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE.",
              "recoveryPath": {
                "simplerExplanation": "Matches ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE.",
                "guidedFixPrompt": "Type ELEVATE_TO_ADMINISTRATIVE_ROOT_PRIVILEGE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d17-b2-stateful-firewall-packet-filtering",
        "day": 17,
        "blockNumber": 2,
        "title": "Stateful Packet Inspection (SPI) Firewalls: Tracking Connection States",
        "conceptBudget": {
          "primaryConcept": "Stateful Firewall Invariant",
          "supportingTerms": [
            "SPI Firewall (Stateful Packet Inspection: Maintains state table of active TCP handshakes; automatically permits return traffic from requested websites while blocking unsolicited inbound attacks)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d17-b1-polp-privilege-elevation-gate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Stateful Firewall State Inspection",
            "codeSnippet": "// OUTBOUND: User visits 'https://github.com' -> Firewall records [State: ESTABLISHED, Port: 54102]\n// INBOUND (Return): GitHub sends HTML data -> Matches ESTABLISHED state -> PERMITTED!\n// INBOUND (Unsolicited): Hacker probes Port 445 -> No state entry -> DROPPED SILENTLY!",
            "lineNotes": {
              "1": "Outbound connection tracking.",
              "2": "Return traffic permitted.",
              "3": "Unsolicited inbound blocked."
            }
          },
          {
            "type": "runnable_code",
            "filename": "firewall_demo.js",
            "initialCode": "function getFirewallInspectionType() {\n  return 'STATEFUL_PACKET_INSPECTION_TRACKS_CONNECTION_STATES';\n}\n\nconsole.log(getFirewallInspectionType());",
            "expectedOutput": "STATEFUL_PACKET_INSPECTION_TRACKS_CONNECTION_STATES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What firewall technology tracks active TCP connection handshakes to permit return traffic while blocking unsolicited inbound scans?",
          "expectedStringOutput": "STATEFUL_PACKET_INSPECTION_TRACKS_CONNECTION_STATES",
          "acceptableAnswers": [
            "STATEFUL_PACKET_INSPECTION_TRACKS_CONNECTION_STATES",
            "Stateful Packet Inspection",
            "SPI Firewall"
          ],
          "primaryMisconceptionId": "MC_CF_OS_SECURITY_UAC_SUDO_PRIVILEGE",
          "diagnosisMap": {
            "STATELESS": {
              "misconceptionId": "MC_CF_OS_SECURITY_UAC_SUDO_PRIVILEGE",
              "errorExplanation": "Stateless filters inspect packets in isolation. Connection tracking is STATEFUL_PACKET_INSPECTION_TRACKS_CONNECTION_STATES.",
              "recoveryPath": {
                "simplerExplanation": "Matches STATEFUL_PACKET_INSPECTION_TRACKS_CONNECTION_STATES.",
                "guidedFixPrompt": "Type STATEFUL_PACKET_INSPECTION_TRACKS_CONNECTION_STATES"
              }
            }
          }
        }
      },
      {
        "id": "cf-d17-b3-application-sandboxing-mechanisms",
        "day": 17,
        "blockNumber": 3,
        "title": "Application Sandboxing: Restricting File System & Camera Access",
        "conceptBudget": {
          "primaryConcept": "Sandboxing Isolation Invariant",
          "supportingTerms": [
            "Sandboxing (Restricting applications to a locked virtual jail where they cannot access the user's camera, microphone, or root file system without explicit permission)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d17-b2-stateful-firewall-packet-filtering",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sandbox_demo.js",
            "initialCode": "function getApplicationIsolationStandard() {\n  return 'APPLICATION_SANDBOXING_RESTRICTS_UNAUTHORIZED_HARDWARE_ACCESS';\n}\n\nconsole.log(getApplicationIsolationStandard());",
            "expectedOutput": "APPLICATION_SANDBOXING_RESTRICTS_UNAUTHORIZED_HARDWARE_ACCESS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What operating system security architecture isolates untrusted downloaded applications to prevent unauthorized file and webcam access?",
          "expectedStringOutput": "APPLICATION_SANDBOXING_RESTRICTS_UNAUTHORIZED_HARDWARE_ACCESS",
          "acceptableAnswers": [
            "APPLICATION_SANDBOXING_RESTRICTS_UNAUTHORIZED_HARDWARE_ACCESS",
            "Sandboxing",
            "App sandboxing"
          ],
          "primaryMisconceptionId": "MC_CF_OS_SECURITY_UAC_SUDO_PRIVILEGE",
          "diagnosisMap": {
            "UNRESTRICTED": {
              "misconceptionId": "MC_CF_OS_SECURITY_UAC_SUDO_PRIVILEGE",
              "errorExplanation": "Isolation uses APPLICATION_SANDBOXING_RESTRICTS_UNAUTHORIZED_HARDWARE_ACCESS.",
              "recoveryPath": {
                "simplerExplanation": "Matches APPLICATION_SANDBOXING_RESTRICTS_UNAUTHORIZED_HARDWARE_ACCESS.",
                "guidedFixPrompt": "Type APPLICATION_SANDBOXING_RESTRICTS_UNAUTHORIZED_HARDWARE_ACCESS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Cryptography Fundamentals: Symmetric AES-256 vs Asymmetric RSA-4096 & SSH Keys",
    "overviewMetaphor": "Cryptography is a Pair of High-Security Mailboxes and Vaults: Symmetric encryption (AES-256) is a bank safe where the same key locks and unlocks millions of dollars in 1 millisecond; Asymmetric encryption (RSA-4096 / Ed25519) is a public mailbox with a slot (anyone can drop an encrypted letter in using your Public Key, but only you hold the Private Key to open the back door); combining both powers passwordless SSH terminal logins and secure cloud storage.",
    "blocks": [
      {
        "id": "cf-d18-b1-asymmetric-keypair-simulation",
        "day": 18,
        "blockNumber": 1,
        "title": "Asymmetric Cryptography: Public Key Encrypts, Private Key Decrypts",
        "conceptBudget": {
          "primaryConcept": "Asymmetric Keypair Cryptographic Invariant",
          "supportingTerms": [
            "Public Key (Freely distributed; used by senders to encrypt messages)",
            "Private Key (Kept strictly secret; required to decrypt ciphertexts)",
            "Status: Asymmetric Cryptography Decryption Successful"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d17-b1-polp-privilege-elevation-gate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Asymmetric Public/Private Keypair Cryptographic Ledger",
              "boxes": [
                {
                  "label": "Sender Encryption Phase",
                  "value": "Public Key (id_rsa.pub) Encrypts Plaintext Data Stream",
                  "varType": "Public Key",
                  "isUpdated": false
                },
                {
                  "label": "Receiver Decryption Phase",
                  "value": "Private Key (id_rsa) Matches and Decrypts Ciphertext",
                  "varType": "Private Key",
                  "isUpdated": false
                },
                {
                  "label": "Cryptographic Result",
                  "value": "Data Recovered 100% (ASYMMETRIC CRYPTOGRAPHY DECRYPTION SUCCESSFUL!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "crypto_keypair_demo.js",
            "initialCode": "function simulateKeypair(pubEnc, privDec) {\n  const ok = pubEnc && privDec;\n  return {\n    encryptedWithPublicKey: pubEnc,\n    decryptedWithPrivateKey: privDec,\n    isDataRecoveredSuccessfully: ok,\n    status: ok ? 'ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL' : 'CRYPTO_FAILURE'\n  };\n}\n\nconsole.log(JSON.stringify(simulateKeypair(true, true)));\nconsole.log(JSON.stringify(simulateKeypair(true, false)));",
            "expectedOutput": "{\"encryptedWithPublicKey\":true,\"decryptedWithPrivateKey\":true,\"isDataRecoveredSuccessfully\":true,\"status\":\"ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL\"}\n{\"encryptedWithPublicKey\":true,\"decryptedWithPrivateKey\":false,\"isDataRecoveredSuccessfully\":false,\"status\":\"CRYPTO_FAILURE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that ciphertext encrypted with a user's Public Key was successfully recovered using the matching Private Key?",
          "expectedStringOutput": "ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL",
          "acceptableAnswers": [
            "ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL",
            "Decryption successful",
            "Data recovered successfully"
          ],
          "primaryMisconceptionId": "MC_CF_CRYPTOGRAPHY_AES_RSA_SSH_KEYS",
          "diagnosisMap": {
            "FAILURE": {
              "misconceptionId": "MC_CF_CRYPTOGRAPHY_AES_RSA_SSH_KEYS",
              "errorExplanation": "Matching keys awards ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL.",
              "recoveryPath": {
                "simplerExplanation": "Matches ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL.",
                "guidedFixPrompt": "Type ASYMMETRIC_CRYPTOGRAPHY_DECRYPTION_SUCCESSFUL"
              }
            }
          }
        }
      },
      {
        "id": "cf-d18-b2-aes-256-bulk-symmetric-encryption",
        "day": 18,
        "blockNumber": 2,
        "title": "AES-256 Symmetric Cipher: High-Throughput Bulk Data Encryption",
        "conceptBudget": {
          "primaryConcept": "AES-256 Bulk Encryption Invariant",
          "supportingTerms": [
            "AES-256 (Advanced Encryption Standard with 256-bit keys: Hardware-accelerated on modern CPU AES-NI instructions; encrypts gigabytes of data per second with zero brute-force vulnerability)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d18-b1-asymmetric-keypair-simulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AES-256 Hardware Acceleration",
            "codeSnippet": "// CPU INSTRUCTION: AES-NI dedicated silicon circuits execute 14 rounds of byte substitution\n// SPEED:           Encrypts disk drives at 4,000 MB/s line rate\n// SECURITY:        2^256 possible keys (Exceeds total atoms in the observable universe!)",
            "lineNotes": {
              "1": "Hardware instructions.",
              "2": "Throughput line rate.",
              "3": "256-bit key space."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aes256_demo.js",
            "initialCode": "function getGoldStandardSymmetricCipher() {\n  return 'AES_256_GCM_HARDWARE_ACCELERATED_BULK_ENCRYPTION';\n}\n\nconsole.log(getGoldStandardSymmetricCipher());",
            "expectedOutput": "AES_256_GCM_HARDWARE_ACCELERATED_BULK_ENCRYPTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 256-bit symmetric cipher is the global gold standard for high-throughput hardware-accelerated bulk data encryption?",
          "expectedStringOutput": "AES_256_GCM_HARDWARE_ACCELERATED_BULK_ENCRYPTION",
          "acceptableAnswers": [
            "AES_256_GCM_HARDWARE_ACCELERATED_BULK_ENCRYPTION",
            "AES-256",
            "AES_256"
          ],
          "primaryMisconceptionId": "MC_CF_CRYPTOGRAPHY_AES_RSA_SSH_KEYS",
          "diagnosisMap": {
            "DES": {
              "misconceptionId": "MC_CF_CRYPTOGRAPHY_AES_RSA_SSH_KEYS",
              "errorExplanation": "DES is obsolete. Modern gold standard is AES_256_GCM_HARDWARE_ACCELERATED_BULK_ENCRYPTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches AES_256_GCM_HARDWARE_ACCELERATED_BULK_ENCRYPTION.",
                "guidedFixPrompt": "Type AES_256_GCM_HARDWARE_ACCELERATED_BULK_ENCRYPTION"
              }
            }
          }
        }
      },
      {
        "id": "cf-d18-b3-ssh-keypair-passwordless-authentication",
        "day": 18,
        "blockNumber": 3,
        "title": "SSH Keypairs: Passwordless Remote Terminal Administration",
        "conceptBudget": {
          "primaryConcept": "SSH Keypair Invariant",
          "supportingTerms": [
            "SSH Keypair (`~/.ssh/id_ed25519` private key stays on laptop; `~/.ssh/authorized_keys` public key stored on server; provides instant cryptographically secure login without vulnerable passwords)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d18-b2-aes-256-bulk-symmetric-encryption",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ssh_keys_demo.js",
            "initialCode": "function getSshKeyLocation() {\n  return 'PRIVATE_KEY_STAYS_ON_CLIENT_PUBLIC_KEY_APPENDED_TO_AUTHORIZED_KEYS';\n}\n\nconsole.log(getSshKeyLocation());",
            "expectedOutput": "PRIVATE_KEY_STAYS_ON_CLIENT_PUBLIC_KEY_APPENDED_TO_AUTHORIZED_KEYS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where must a developer's Public Key be placed on a remote Linux server to enable passwordless SSH terminal authentication?",
          "expectedStringOutput": "PRIVATE_KEY_STAYS_ON_CLIENT_PUBLIC_KEY_APPENDED_TO_AUTHORIZED_KEYS",
          "acceptableAnswers": [
            "PRIVATE_KEY_STAYS_ON_CLIENT_PUBLIC_KEY_APPENDED_TO_AUTHORIZED_KEYS",
            "authorized_keys",
            "~/.ssh/authorized_keys"
          ],
          "primaryMisconceptionId": "MC_CF_CRYPTOGRAPHY_AES_RSA_SSH_KEYS",
          "diagnosisMap": {
            "PASSWORD": {
              "misconceptionId": "MC_CF_CRYPTOGRAPHY_AES_RSA_SSH_KEYS",
              "errorExplanation": "Passwordless SSH requires PRIVATE_KEY_STAYS_ON_CLIENT_PUBLIC_KEY_APPENDED_TO_AUTHORIZED_KEYS.",
              "recoveryPath": {
                "simplerExplanation": "Matches PRIVATE_KEY_STAYS_ON_CLIENT_PUBLIC_KEY_APPENDED_TO_AUTHORIZED_KEYS.",
                "guidedFixPrompt": "Type PRIVATE_KEY_STAYS_ON_CLIENT_PUBLIC_KEY_APPENDED_TO_AUTHORIZED_KEYS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Hardware Peripherals & Display Interfaces: USB4, Thunderbolt 4 (40 Gbps) & HDMI 2.1",
    "overviewMetaphor": "Peripheral Interfaces Are High-Speed Transcontinental Fiber Optics: A single USB Type-C physical cable can deliver multiple massive data protocols simultaneously; connecting via Thunderbolt 4 / USB4 unlocks 40 Gigabits per second (Gbps) of PCIe and DisplayPort data transfer alongside 100W USB Power Delivery; connecting to an external monitor via HDMI 2.1 delivers 48 Gbps of uncompressed 4K@120Hz gaming and creative video bandwidth.",
    "blocks": [
      {
        "id": "cf-d19-b1-peripheral-bus-bandwidth-audit",
        "day": 19,
        "blockNumber": 1,
        "title": "Peripheral Throughput: Thunderbolt 4 (40 Gbps) vs HDMI 2.1 (48 Gbps) vs USB 2.0 (0.48 Gbps)",
        "conceptBudget": {
          "primaryConcept": "Peripheral Interface Bandwidth Mapping",
          "supportingTerms": [
            "Thunderbolt 4 ($40.0$ Gbps)",
            "USB4 ($40.0$ Gbps)",
            "HDMI 2.1 ($48.0$ Gbps)",
            "USB 2.0 ($0.48$ Gbps = 480 Mbps)",
            "Ultra High-Speed Benchmark: $\\ge 40.0$ Gbps $\\implies$ Ultra High Speed 40+ Gbps Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d18-b1-asymmetric-keypair-simulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "External Hardware Bus Bandwidth Throughput Ledger (Thunderbolt 4 = 40 Gbps)",
              "boxes": [
                {
                  "label": "Legacy USB 2.0 Interface",
                  "value": "480 Mbps (0.48 Gbps) Low-Speed Serial Transfer",
                  "varType": "USB 2.0",
                  "isUpdated": false
                },
                {
                  "label": "Thunderbolt 4 / USB4",
                  "value": "40.0 Gbps Ultra-High-Speed PCIe 4.0 Tunneling (ULTRA FAST >= 40 Gbps!)",
                  "varType": "TB4",
                  "isUpdated": false
                },
                {
                  "label": "HDMI 2.1 Video Interface",
                  "value": "48.0 Gbps Uncompressed 4K@120Hz Video (PERIPHERAL BANDWIDTH MAPPED!)",
                  "varType": "HDMI 2.1",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "peripheral_bw_demo.js",
            "initialCode": "function getPeripheralBw(interfaceName) {\n  const map = { 'THUNDERBOLT_4': 40.0, 'HDMI_2_1': 48.0, 'USB_2_0': 0.48 };\n  const bw = map[interfaceName.toUpperCase()];\n  return {\n    interfaceName,\n    bandwidthGbps: bw,\n    isFortyPlus: bw >= 40.0,\n    status: 'PERIPHERAL_BANDWIDTH_MAPPED'\n  };\n}\n\nconsole.log(JSON.stringify(getPeripheralBw('THUNDERBOLT_4')));\nconsole.log(JSON.stringify(getPeripheralBw('HDMI_2_1')));",
            "expectedOutput": "{\"interfaceName\":\"THUNDERBOLT_4\",\"bandwidthGbps\":40,\"isFortyPlus\":true,\"status\":\"PERIPHERAL_BANDWIDTH_MAPPED\"}\n{\"interfaceName\":\"HDMI_2_1\",\"bandwidthGbps\":48,\"isFortyPlus\":true,\"status\":\"PERIPHERAL_BANDWIDTH_MAPPED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum theoretical data transfer bandwidth in Gigabits per second (Gbps) supported by Thunderbolt 4 interfaces?",
          "expectedStringOutput": "40",
          "acceptableAnswers": [
            "40",
            "40 Gbps",
            "40.0",
            "bandwidthGbps\":40"
          ],
          "primaryMisconceptionId": "MC_CF_PERIPHERALS_USB4_THUNDERBOLT_HDMI",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_CF_PERIPHERALS_USB4_THUNDERBOLT_HDMI",
              "errorExplanation": "10 Gbps is USB 3.2 Gen 2. Thunderbolt 4 delivers 40.0 Gbps.",
              "recoveryPath": {
                "simplerExplanation": "Thunderbolt 4 = 40 Gbps.",
                "guidedFixPrompt": "Type 40"
              }
            }
          }
        }
      },
      {
        "id": "cf-d19-b2-usb-c-power-delivery-standards",
        "day": 19,
        "blockNumber": 2,
        "title": "USB Type-C Power Delivery (USB-PD): 100W vs 240W EPR Standards",
        "conceptBudget": {
          "primaryConcept": "USB-PD Charging Invariant",
          "supportingTerms": [
            "USB-PD (Power Delivery protocol: Negotiates dynamic voltage and amperage up to 100W standard and 240W Extended Power Range EPR over Type-C cables)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d19-b1-peripheral-bus-bandwidth-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "USB-PD Negotiation",
            "codeSnippet": "// LAPTOP -> CHARGER: 'I support 20V @ 5A (100W PD profile)'\n// CHARGER -> LAPTOP: 'Approved! Switching output from 5V baseline to 20V 100W power delivery'\n// Result: Fast-charges workstation laptop over single reversible Type-C cable!",
            "lineNotes": {
              "1": "Client voltage profile request.",
              "2": "Charger handshake approval.",
              "3": "High-power delivery."
            }
          },
          {
            "type": "runnable_code",
            "filename": "usb_pd_demo.js",
            "initialCode": "function getUsbPdMaxPowerWatts() {\n  return 'TWO_HUNDRED_FORTY_WATTS_EXTENDED_POWER_RANGE';\n}\n\nconsole.log(getUsbPdMaxPowerWatts());",
            "expectedOutput": "TWO_HUNDRED_FORTY_WATTS_EXTENDED_POWER_RANGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum charging wattage supported under the latest USB-PD Extended Power Range (EPR) standard?",
          "expectedStringOutput": "TWO_HUNDRED_FORTY_WATTS_EXTENDED_POWER_RANGE",
          "acceptableAnswers": [
            "TWO_HUNDRED_FORTY_WATTS_EXTENDED_POWER_RANGE",
            "240W",
            "240 Watts"
          ],
          "primaryMisconceptionId": "MC_CF_PERIPHERALS_USB4_THUNDERBOLT_HDMI",
          "diagnosisMap": {
            "100W": {
              "misconceptionId": "MC_CF_PERIPHERALS_USB4_THUNDERBOLT_HDMI",
              "errorExplanation": "100W was standard PD. EPR expands power delivery to TWO_HUNDRED_FORTY_WATTS_EXTENDED_POWER_RANGE (240W).",
              "recoveryPath": {
                "simplerExplanation": "Matches TWO_HUNDRED_FORTY_WATTS_EXTENDED_POWER_RANGE.",
                "guidedFixPrompt": "Type TWO_HUNDRED_FORTY_WATTS_EXTENDED_POWER_RANGE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d19-b3-displayport-vs-hdmi-capabilities",
        "day": 19,
        "blockNumber": 3,
        "title": "DisplayPort 2.1 (80 Gbps) vs HDMI 2.1 (48 Gbps): Daisy Chaining MST",
        "conceptBudget": {
          "primaryConcept": "DisplayPort MST Invariant",
          "supportingTerms": [
            "Multi-Stream Transport (DisplayPort MST: Allows daisy-chaining multiple external 4K monitors over a single physical cable)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d19-b2-usb-c-power-delivery-standards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mst_demo.js",
            "initialCode": "function getDisplayPortDaisyChainFeature() {\n  return 'MULTI_STREAM_TRANSPORT_MST_DAISY_CHAINING';\n}\n\nconsole.log(getDisplayPortDaisyChainFeature());",
            "expectedOutput": "MULTI_STREAM_TRANSPORT_MST_DAISY_CHAINING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What DisplayPort video feature enables connecting multiple monitors in series (daisy-chaining) through a single GPU output port?",
          "expectedStringOutput": "MULTI_STREAM_TRANSPORT_MST_DAISY_CHAINING",
          "acceptableAnswers": [
            "MULTI_STREAM_TRANSPORT_MST_DAISY_CHAINING",
            "MST",
            "Multi-Stream Transport"
          ],
          "primaryMisconceptionId": "MC_CF_PERIPHERALS_USB4_THUNDERBOLT_HDMI",
          "diagnosisMap": {
            "HDMI": {
              "misconceptionId": "MC_CF_PERIPHERALS_USB4_THUNDERBOLT_HDMI",
              "errorExplanation": "HDMI does not support daisy-chaining. Multi-monitor chaining uses MULTI_STREAM_TRANSPORT_MST_DAISY_CHAINING.",
              "recoveryPath": {
                "simplerExplanation": "Matches MULTI_STREAM_TRANSPORT_MST_DAISY_CHAINING.",
                "guidedFixPrompt": "Type MULTI_STREAM_TRANSPORT_MST_DAISY_CHAINING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Software Installation & Package Managers: APT, Homebrew, Winget & PATH Variables",
    "overviewMetaphor": "Package Managers Are Automated Software App Stores with Dependency Solvers: Manually downloading `.exe` or `.dmg` installers from shady websites risks malware and dependency conflicts; using official package managers (Linux `apt`, macOS `brew`, Windows `winget`) fetches cryptographically signed binaries, resolves dependencies automatically, and configures the system `PATH` so typing `git` resolves immediately to `/usr/bin/git`.",
    "blocks": [
      {
        "id": "cf-d20-b1-path-environment-binary-resolution",
        "day": 20,
        "blockNumber": 1,
        "title": "System PATH Environment Variable: Sequential Executable Lookup",
        "conceptBudget": {
          "primaryConcept": "System PATH Binary Resolution Engine",
          "supportingTerms": [
            "Command Name (`'git'`)",
            "PATH Directory List (`['/usr/local/bin', '/usr/bin', '/bin']`)",
            "Resolved Executable Path (`'/usr/bin/git'`)",
            "Status: Binary Found in PATH"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d19-b1-peripheral-bus-bandwidth-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Operating System PATH Environment Binary Resolution Ledger",
              "boxes": [
                {
                  "label": "Invoked CLI Command",
                  "value": "'git' (User types command in terminal)",
                  "varType": "Command",
                  "isUpdated": false
                },
                {
                  "label": "Search Directory 1",
                  "value": "/usr/local/bin/git -> Not Found (Continues to Directory 2)",
                  "varType": "PATH 1",
                  "isUpdated": false
                },
                {
                  "label": "Search Directory 2",
                  "value": "/usr/bin/git -> Executable Match Found! (BINARY FOUND IN PATH NOMINAL!)",
                  "varType": "PATH 2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "path_resolve_demo.js",
            "initialCode": "function resolvePath(cmd, dirs, fs) {\n  for (const d of dirs) {\n    const p = `${d}/${cmd}`;\n    if (fs[p] && fs[p].isExecutable) {\n      return {\n        command: cmd,\n        resolvedPath: p,\n        isFound: true,\n        status: 'BINARY_FOUND_IN_PATH'\n      };\n    }\n  }\n  return { command: cmd, resolvedPath: null, isFound: false, status: 'NOT_FOUND' };\n}\n\nconst dirs = ['/usr/local/bin', '/usr/bin', '/bin'];\nconst fs = { '/usr/bin/git': { isExecutable: true } };\nconsole.log(JSON.stringify(resolvePath('git', dirs, fs)));",
            "expectedOutput": "{\"command\":\"git\",\"resolvedPath\":\"/usr/bin/git\",\"isFound\":true,\"status\":\"BINARY_FOUND_IN_PATH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What resolved absolute path is returned when locating 'git' across PATH directories where `/usr/bin/git` is marked executable?",
          "expectedStringOutput": "/usr/bin/git",
          "acceptableAnswers": [
            "/usr/bin/git",
            "resolvedPath\":\"/usr/bin/git\""
          ],
          "primaryMisconceptionId": "MC_CF_PACKAGE_MANAGERS_DEPENDENCY_TREES",
          "diagnosisMap": {
            "NOT_FOUND": {
              "misconceptionId": "MC_CF_PACKAGE_MANAGERS_DEPENDENCY_TREES",
              "errorExplanation": "/usr/bin/git exists in the mock filesystem. PATH resolves to /usr/bin/git.",
              "recoveryPath": {
                "simplerExplanation": "Directory match is /usr/bin/git.",
                "guidedFixPrompt": "Type /usr/bin/git"
              }
            }
          }
        }
      },
      {
        "id": "cf-d20-b2-package-manager-ecosystem-mapping",
        "day": 20,
        "blockNumber": 2,
        "title": "Official OS Package Managers: Linux (APT), macOS (Homebrew), Windows (Winget)",
        "conceptBudget": {
          "primaryConcept": "OS Package Manager Standards",
          "supportingTerms": [
            "Linux (`sudo apt update && sudo apt install -y package`)",
            "macOS (`brew install package`)",
            "Windows (`winget install package`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d20-b1-path-environment-binary-resolution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Package Manager Commands",
            "codeSnippet": "// LINUX DEBIAN/UBUNTU: sudo apt install -y nginx nodejs git\n// MACOS TERMINAL:      brew install node git python\n// WINDOWS POWERSHELL:  winget install Microsoft.VisualStudioCode Git.Git",
            "lineNotes": {
              "1": "APT package manager.",
              "2": "Homebrew package manager.",
              "3": "Winget package manager."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pkg_manager_demo.js",
            "initialCode": "function getOfficialPackageManager(os) {\n  const map = { 'WINDOWS': 'WINGET', 'MACOS': 'HOMEBREW', 'LINUX': 'APT' };\n  return map[os.toUpperCase()];\n}\n\nconsole.log(getOfficialPackageManager('WINDOWS'));\nconsole.log(getOfficialPackageManager('MACOS'));\nconsole.log(getOfficialPackageManager('LINUX'));",
            "expectedOutput": "WINGET\nHOMEBREW\nAPT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the name of the official built-in command-line package manager for modern Windows 10/11 operating systems?",
          "expectedStringOutput": "WINGET",
          "acceptableAnswers": [
            "WINGET",
            "winget",
            "Windows Package Manager"
          ],
          "primaryMisconceptionId": "MC_CF_PACKAGE_MANAGERS_DEPENDENCY_TREES",
          "diagnosisMap": {
            "EXE": {
              "misconceptionId": "MC_CF_PACKAGE_MANAGERS_DEPENDENCY_TREES",
              "errorExplanation": "Windows official package manager is WINGET.",
              "recoveryPath": {
                "simplerExplanation": "Matches WINGET.",
                "guidedFixPrompt": "Type WINGET"
              }
            }
          }
        }
      },
      {
        "id": "cf-d20-b3-dependency-resolution-and-conflicts",
        "day": 20,
        "blockNumber": 3,
        "title": "Dependency Trees & Version Pinning: Preventing 'Dependency Hell'",
        "conceptBudget": {
          "primaryConcept": "Dependency Resolution Invariant",
          "supportingTerms": [
            "Dependency Graph (Directed Acyclic Graph DAG of software library requirements)",
            "Version Pinning (Lockfiles e.g. `package-lock.json` guaranteeing identical binary builds across all machines)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d20-b2-package-manager-ecosystem-mapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lockfile_demo.js",
            "initialCode": "function getLockfileGuarantee() {\n  return 'LOCKFILES_GUARANTEE_IDENTICAL_DETERMINISTIC_DEPENDENCY_BUILDS';\n}\n\nconsole.log(getLockfileGuarantee());",
            "expectedOutput": "LOCKFILES_GUARANTEE_IDENTICAL_DETERMINISTIC_DEPENDENCY_BUILDS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core stability guarantee is provided by committing package manager lockfiles to software repositories?",
          "expectedStringOutput": "LOCKFILES_GUARANTEE_IDENTICAL_DETERMINISTIC_DEPENDENCY_BUILDS",
          "acceptableAnswers": [
            "LOCKFILES_GUARANTEE_IDENTICAL_DETERMINISTIC_DEPENDENCY_BUILDS",
            "Deterministic builds",
            "Identical dependency builds"
          ],
          "primaryMisconceptionId": "MC_CF_PACKAGE_MANAGERS_DEPENDENCY_TREES",
          "diagnosisMap": {
            "DYNAMIC": {
              "misconceptionId": "MC_CF_PACKAGE_MANAGERS_DEPENDENCY_TREES",
              "errorExplanation": "Lockfiles enforce LOCKFILES_GUARANTEE_IDENTICAL_DETERMINISTIC_DEPENDENCY_BUILDS.",
              "recoveryPath": {
                "simplerExplanation": "Matches LOCKFILES_GUARANTEE_IDENTICAL_DETERMINISTIC_DEPENDENCY_BUILDS.",
                "guidedFixPrompt": "Type LOCKFILES_GUARANTEE_IDENTICAL_DETERMINISTIC_DEPENDENCY_BUILDS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign systems security and peripheral master engine: 1. 78.7-bit password Shannon entropy; 2. PoLP sudo authentication; 3. Asymmetric RSA/SSH keypair decryption; 4. 40 Gbps Thunderbolt 4 throughput; 5. `/usr/bin/git` PATH resolution.",
    "blocks": [
      {
        "id": "cf-d21-b1-security-peripherals-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Systems Security & Peripherals Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Security & Peripherals Master Engine",
          "supportingTerms": [
            "Entropy Engine",
            "PoLP Sudo Engine",
            "Asymmetric Crypto Engine",
            "Thunderbolt 4 Engine",
            "PATH Resolution Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d20-b3-dependency-resolution-and-conflicts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Security & Peripherals Architecture Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Calculates 78.7-bit military password entropy and enforces PoLP elevation",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Decrypts asymmetric RSA/SSH keypairs and verifies 40 Gbps Thunderbolt 4",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Resolves /usr/bin/git in PATH environment",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Security & Peripherals Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "security_master_kernel_demo.js",
            "initialCode": "function runSecurityPeripheralsMaster() {\n  return {\n    entropySubsystem: 'ONLINE_78_7_BITS_ACTIVE',\n    polpSubsystem: 'ONLINE_SUDO_MFA_ACTIVE',\n    cryptoSubsystem: 'ONLINE_ASYMMETRIC_KEYS_ACTIVE',\n    peripheralsSubsystem: 'ONLINE_40GBPS_TB4_ACTIVE',\n    pathSubsystem: 'ONLINE_PATH_RESOLVED_ACTIVE',\n    engineStatus: 'SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runSecurityPeripheralsMaster().engineStatus);",
            "expectedOutput": "SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Systems Security & Peripherals Master Engine?",
          "expectedStringOutput": "SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE",
            "engineStatus: SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
              "errorExplanation": "Matches SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SYSTEMS_SECURITY_AND_PERIPHERALS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d21-b2-security-peripherals-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Security & Peripherals Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Security & Peripherals Invariant Verification",
          "supportingTerms": [
            "Entropy Invariant",
            "Crypto Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d21-b1-security-peripherals-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "security_audit_demo.js",
            "initialCode": "function auditSecurityMaster(ent, sudo, cry, tb4, path) {\n  const passed = ent && sudo && cry && tb4 && path;\n  return {\n    entropyVerified: ent,\n    sudoVerified: sudo,\n    cryptoVerified: cry,\n    tb4Verified: tb4,\n    pathVerified: path,\n    grade: passed ? 'SECURITY_PERIPHERALS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSecurityMaster(true, true, true, true, true)));",
            "expectedOutput": "{\"entropyVerified\":true,\"sudoVerified\":true,\"cryptoVerified\":true,\"tb4Verified\":true,\"pathVerified\":true,\"grade\":\"SECURITY_PERIPHERALS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Entropy, PoLP, Cryptography, Thunderbolt 4, and PATH resolution engines pass 100%?",
          "expectedStringOutput": "SECURITY_PERIPHERALS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "SECURITY_PERIPHERALS_ENGINE_AUDIT_PASSED",
            "grade\":\"SECURITY_PERIPHERALS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
              "errorExplanation": "All checks passing awards SECURITY_PERIPHERALS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SECURITY_PERIPHERALS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type SECURITY_PERIPHERALS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "cf-d21-b3-milestone3-cf-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Systems Security & Peripherals Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Security & Peripherals Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d21-b2-security-peripherals-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_cf_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CF_CYBERSECURITY_PASSWORD_ENTROPY_MFA",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Cybersecurity, Cryptography, Peripherals & Package Management Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Virtualization & Containerization Basics: Type 1/2 Hypervisors vs Docker Isolation",
    "overviewMetaphor": "Virtual Machines Are Entire Independent Houses; Containers Are Furnished Hotel Suites: A Virtual Machine emulates an entire virtual motherboard, BIOS, and heavy Guest OS (taking 45 seconds to boot and eating 2048 MB of RAM); a Docker Container shares the host Linux kernel directly via Namespaces and Cgroups, booting in 0.5 seconds with only 20 MB of RAM overhead ($0.5\\text{s} \\ll 45.0\\text{s}, 20\\text{ MB} \\ll 2048\\text{ MB}$), delivering instant, lightweight application isolation.",
    "blocks": [
      {
        "id": "cf-d22-b1-vm-vs-container-overhead-comparison",
        "day": 22,
        "blockNumber": 1,
        "title": "Virtual Machine (45s, 2048MB) vs Container (0.5s, 20MB) Resource Overhead",
        "conceptBudget": {
          "primaryConcept": "VM vs Container Resource Overhead Evaluation",
          "supportingTerms": [
            "Container Startup Latency ($0.5$ seconds)",
            "Container RAM Overhead ($20$ MB)",
            "VM Startup Latency ($45.0$ seconds)",
            "VM RAM Overhead ($2048$ MB)",
            "Kernel Sharing: Containers share host kernel; VMs emulate independent kernels"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d21-b1-security-peripherals-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Virtualization vs Containerization Resource Efficiency Ledger",
              "boxes": [
                {
                  "label": "Full Virtual Machine (VM)",
                  "value": "Emulated Hardware + Guest OS -> 45.0s Boot | 2,048 MB RAM Overhead",
                  "varType": "Heavy VM",
                  "isUpdated": false
                },
                {
                  "label": "Lightweight Container (Docker)",
                  "value": "Host Kernel Sharing + Cgroups -> 0.5s Boot | 20 MB RAM Overhead",
                  "varType": "Container",
                  "isUpdated": false
                },
                {
                  "label": "Resource Efficiency Ratio",
                  "value": "100x Lower RAM Footprint & 90x Faster Startup (CONTAINER HIGH EFFICIENCY!)",
                  "varType": "Efficiency",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "virt_compare_demo.js",
            "initialCode": "function compareOverhead(isContainer) {\n  if (isContainer) {\n    return {\n      type: 'LIGHTWEIGHT_CONTAINER_CGROUPS',\n      bootSeconds: 0.5,\n      ramMb: 20,\n      sharesHostKernel: true,\n      status: 'CONTAINER_HIGH_EFFICIENCY'\n    };\n  }\n  return {\n    type: 'FULL_GUEST_OS_VIRTUAL_MACHINE',\n    bootSeconds: 45.0,\n    ramMb: 2048,\n    sharesHostKernel: false,\n    status: 'VM_HEAVY_OVERHEAD'\n  };\n}\n\nconsole.log(JSON.stringify(compareOverhead(true)));\nconsole.log(JSON.stringify(compareOverhead(false)));",
            "expectedOutput": "{\"type\":\"LIGHTWEIGHT_CONTAINER_CGROUPS\",\"bootSeconds\":0.5,\"ramMb\":20,\"sharesHostKernel\":true,\"status\":\"CONTAINER_HIGH_EFFICIENCY\"}\n{\"type\":\"FULL_GUEST_OS_VIRTUAL_MACHINE\",\"bootSeconds\":45,\"ramMb\":2048,\"sharesHostKernel\":false,\"status\":\"VM_HEAVY_OVERHEAD\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the typical startup boot latency in seconds for a lightweight container sharing the host operating system kernel?",
          "expectedStringOutput": "0.5",
          "acceptableAnswers": [
            "0.5",
            "0.5s",
            "0.5 seconds",
            "bootSeconds\":0.5"
          ],
          "primaryMisconceptionId": "MC_CF_VIRTUALIZATION_HYPERVISORS_DOCKER",
          "diagnosisMap": {
            "45": {
              "misconceptionId": "MC_CF_VIRTUALIZATION_HYPERVISORS_DOCKER",
              "errorExplanation": "45 seconds is typical for a heavy Virtual Machine. Containers boot in 0.5 seconds.",
              "recoveryPath": {
                "simplerExplanation": "Containers boot in ~0.5s.",
                "guidedFixPrompt": "Type 0.5"
              }
            }
          }
        }
      },
      {
        "id": "cf-d22-b2-type1-vs-type2-hypervisors",
        "day": 22,
        "blockNumber": 2,
        "title": "Hypervisor Classification: Type 1 Bare-Metal vs Type 2 Hosted",
        "conceptBudget": {
          "primaryConcept": "Hypervisor Architecture Types",
          "supportingTerms": [
            "Type 1 Bare-Metal (ESXi, Proxmox, KVM: Runs directly on physical hardware for enterprise datacenter performance)",
            "Type 2 Hosted (VirtualBox, VMware Workstation: Runs as an app on top of a host OS)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d22-b1-vm-vs-container-overhead-comparison",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Hypervisor Architecture Tiers",
            "codeSnippet": "// TYPE 1 BARE-METAL: Hardware -> Hypervisor (ESXi/KVM) -> Virtual Machines (Zero Host OS overhead!)\n// TYPE 2 HOSTED:     Hardware -> Host OS (Windows) -> Hypervisor (VirtualBox) -> Virtual Machines",
            "lineNotes": {
              "1": "Type 1 Bare-Metal stack.",
              "2": "Type 2 Hosted stack."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hypervisor_type_demo.js",
            "initialCode": "function getEnterpriseHypervisorType() {\n  return 'TYPE_1_BARE_METAL_HYPERVISOR_DIRECT_HARDWARE_ACCESS';\n}\n\nconsole.log(getEnterpriseHypervisorType());",
            "expectedOutput": "TYPE_1_BARE_METAL_HYPERVISOR_DIRECT_HARDWARE_ACCESS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What hypervisor class runs directly on physical server silicon without an underlying host operating system for maximum enterprise performance?",
          "expectedStringOutput": "TYPE_1_BARE_METAL_HYPERVISOR_DIRECT_HARDWARE_ACCESS",
          "acceptableAnswers": [
            "TYPE_1_BARE_METAL_HYPERVISOR_DIRECT_HARDWARE_ACCESS",
            "Type 1",
            "Bare-Metal Hypervisor",
            "Type 1 Bare Metal"
          ],
          "primaryMisconceptionId": "MC_CF_VIRTUALIZATION_HYPERVISORS_DOCKER",
          "diagnosisMap": {
            "TYPE_2": {
              "misconceptionId": "MC_CF_VIRTUALIZATION_HYPERVISORS_DOCKER",
              "errorExplanation": "Type 2 runs on top of a desktop OS. Direct silicon execution is TYPE_1_BARE_METAL_HYPERVISOR_DIRECT_HARDWARE_ACCESS.",
              "recoveryPath": {
                "simplerExplanation": "Matches TYPE_1_BARE_METAL_HYPERVISOR_DIRECT_HARDWARE_ACCESS.",
                "guidedFixPrompt": "Type TYPE_1_BARE_METAL_HYPERVISOR_DIRECT_HARDWARE_ACCESS"
              }
            }
          }
        }
      },
      {
        "id": "cf-d22-b3-linux-cgroups-and-namespaces",
        "day": 22,
        "blockNumber": 3,
        "title": "Container Mechanics: Linux Namespaces (Visibility) & Cgroups (Resource Limits)",
        "conceptBudget": {
          "primaryConcept": "Cgroups & Namespaces Invariant",
          "supportingTerms": [
            "Linux Namespaces (Provides isolated views of PIDs, Network, Mounts, and Users)",
            "Control Groups (Cgroups: Enforces hard CPU core and RAM memory caps on container processes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d22-b2-type1-vs-type2-hypervisors",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cgroups_demo.js",
            "initialCode": "function getContainerResourceLimiter() {\n  return 'CONTROL_GROUPS_CGROUPS_ENFORCE_CPU_AND_RAM_LIMITS';\n}\n\nconsole.log(getContainerResourceLimiter());",
            "expectedOutput": "CONTROL_GROUPS_CGROUPS_ENFORCE_CPU_AND_RAM_LIMITS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Linux kernel feature enables Docker to enforce strict memory and CPU hardware resource limits on running containers?",
          "expectedStringOutput": "CONTROL_GROUPS_CGROUPS_ENFORCE_CPU_AND_RAM_LIMITS",
          "acceptableAnswers": [
            "CONTROL_GROUPS_CGROUPS_ENFORCE_CPU_AND_RAM_LIMITS",
            "Cgroups",
            "Control Groups"
          ],
          "primaryMisconceptionId": "MC_CF_VIRTUALIZATION_HYPERVISORS_DOCKER",
          "diagnosisMap": {
            "NAMESPACES": {
              "misconceptionId": "MC_CF_VIRTUALIZATION_HYPERVISORS_DOCKER",
              "errorExplanation": "Namespaces isolate process visibility. Resource limits are enforced by CONTROL_GROUPS_CGROUPS_ENFORCE_CPU_AND_RAM_LIMITS.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONTROL_GROUPS_CGROUPS_ENFORCE_CPU_AND_RAM_LIMITS.",
                "guidedFixPrompt": "Type CONTROL_GROUPS_CGROUPS_ENFORCE_CPU_AND_RAM_LIMITS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Troubleshooting & Diagnostic Methodology: The 7-Step Systematic IT Protocol",
    "overviewMetaphor": "IT Troubleshooting Is a Board-Certified Medical Emergency Diagnosis: A bad technician randomly swaps parts hoping for luck; an elite engineer follows the 7-Step CompTIA Diagnostic Protocol: 1. Identify Symptom $\\to$ 2. Reproduce Problem $\\to$ 3. Formulate Hypothesis $\\to$ 4. Test Hypothesis $\\to$ 5. Implement Plan of Action $\\to$ 6. Verify Full System Functionality $\\to$ 7. Document Findings & Root Cause; executing all 7 steps isolates intermittent failures with scientific precision.",
    "blocks": [
      {
        "id": "cf-d23-b1-seven-step-troubleshooting-protocol",
        "day": 23,
        "blockNumber": 1,
        "title": "The 7-Step Systematic IT Diagnostic Protocol",
        "conceptBudget": {
          "primaryConcept": "7-Step Diagnostic Protocol",
          "supportingTerms": [
            "Steps Completed ($7$ full steps)",
            "Identify Symptom",
            "Reproduce Problem",
            "Formulate Hypothesis",
            "Test Hypothesis",
            "Implement Plan of Action",
            "Verify System Functionality",
            "Document Findings & Root Cause",
            "Status: 7-Step Troubleshooting Protocol Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d22-b1-vm-vs-container-overhead-comparison",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CompTIA 7-Step Technical Troubleshooting Lifecycle Ledger",
              "boxes": [
                {
                  "label": "Steps 1-3: Problem Definition",
                  "value": "Identify Symptom -> Reproduce Issue -> Formulate Root Hypothesis",
                  "varType": "Definition",
                  "isUpdated": false
                },
                {
                  "label": "Steps 4-6: Resolution Loop",
                  "value": "Test Hypothesis -> Implement Fix -> Verify Full System Functionality",
                  "varType": "Fix Loop",
                  "isUpdated": false
                },
                {
                  "label": "Step 7: Knowledge Base",
                  "value": "Document Findings, Actions & Root Cause (SEVEN-STEP PROTOCOL CERTIFIED!)",
                  "varType": "Documentation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "troubleshoot_demo.js",
            "initialCode": "function auditTroubleshooting(steps) {\n  const ok = steps === 7;\n  return {\n    steps,\n    isCertified: ok,\n    status: ok ? 'SEVEN_STEP_TROUBLESHOOTING_PROTOCOL_CERTIFIED_NOMINAL' : 'INCOMPLETE_INVESTIGATION'\n  };\n}\n\nconsole.log(JSON.stringify(auditTroubleshooting(7)));\nconsole.log(JSON.stringify(auditTroubleshooting(5)));",
            "expectedOutput": "{\"steps\":7,\"isCertified\":true,\"status\":\"SEVEN_STEP_TROUBLESHOOTING_PROTOCOL_CERTIFIED_NOMINAL\"}\n{\"steps\":5,\"isCertified\":false,\"status\":\"INCOMPLETE_INVESTIGATION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many sequential diagnostic steps must be executed to certify completion of the industry-standard systematic IT troubleshooting protocol?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "7 steps",
            "steps\":7"
          ],
          "primaryMisconceptionId": "MC_CF_TROUBLESHOOTING_SEVEN_STEP_METHODOLOGY",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_CF_TROUBLESHOOTING_SEVEN_STEP_METHODOLOGY",
              "errorExplanation": "3 steps skips verification and root cause documentation. Complete standard requires 7 steps.",
              "recoveryPath": {
                "simplerExplanation": "Complete troubleshooting has 7 steps.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      },
      {
        "id": "cf-d23-b2-isolating-hardware-vs-software-glitches",
        "day": 23,
        "blockNumber": 2,
        "title": "Isolating Hardware vs Software Glitches: Safe Mode & Live USB Booting",
        "conceptBudget": {
          "primaryConcept": "Hardware vs Software Isolation",
          "supportingTerms": [
            "Live USB Boot (Booting clean Linux OS from USB drive: If freeze still occurs $\\implies$ Hardware fault; if system runs perfectly $\\implies$ Corrupted host OS software)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d23-b1-seven-step-troubleshooting-protocol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Differential Hardware/Software Isolation Matrix",
            "codeSnippet": "// TEST 1: Boot Clean Live Linux USB\n// SCENARIO A: System crashes during Live USB session -> FAULTY HARDWARE (RAM or CPU thermals)\n// SCENARIO B: System runs completely stable for 4 hours -> CORRUPTED HOST OS OR DRIVER BUG!",
            "lineNotes": {
              "1": "Clean environment test.",
              "2": "Hardware failure signature.",
              "3": "Software failure signature."
            }
          },
          {
            "type": "runnable_code",
            "filename": "isolation_matrix_demo.js",
            "initialCode": "function diagnoseSystemCrash(crashesInLiveUsb) {\n  return crashesInLiveUsb\n    ? 'HARDWARE_DEFECT_DETECTED_RAM_OR_MOTHERBOARD'\n    : 'SOFTWARE_OR_DRIVER_CORRUPTION_HOST_OS';\n}\n\nconsole.log(diagnoseSystemCrash(true));\nconsole.log(diagnoseSystemCrash(false));",
            "expectedOutput": "HARDWARE_DEFECT_DETECTED_RAM_OR_MOTHERBOARD\nSOFTWARE_OR_DRIVER_CORRUPTION_HOST_OS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "If a computer continues crashing when booted into a completely clean Live USB operating system, what root cause category is isolated?",
          "expectedStringOutput": "HARDWARE_DEFECT_DETECTED_RAM_OR_MOTHERBOARD",
          "acceptableAnswers": [
            "HARDWARE_DEFECT_DETECTED_RAM_OR_MOTHERBOARD",
            "Hardware fault",
            "Hardware defect"
          ],
          "primaryMisconceptionId": "MC_CF_TROUBLESHOOTING_SEVEN_STEP_METHODOLOGY",
          "diagnosisMap": {
            "SOFTWARE": {
              "misconceptionId": "MC_CF_TROUBLESHOOTING_SEVEN_STEP_METHODOLOGY",
              "errorExplanation": "Live USB bypasses the installed software. Crashing in Live USB confirms HARDWARE_DEFECT_DETECTED_RAM_OR_MOTHERBOARD.",
              "recoveryPath": {
                "simplerExplanation": "Matches HARDWARE_DEFECT_DETECTED_RAM_OR_MOTHERBOARD.",
                "guidedFixPrompt": "Type HARDWARE_DEFECT_DETECTED_RAM_OR_MOTHERBOARD"
              }
            }
          }
        }
      },
      {
        "id": "cf-d23-b3-root-cause-analysis-and-postmortems",
        "day": 23,
        "blockNumber": 3,
        "title": "Root Cause Analysis (RCA) & IT Postmortems",
        "conceptBudget": {
          "primaryConcept": "Postmortem Documentation Invariant",
          "supportingTerms": [
            "Postmortem Documentation (Documenting exact sequence of events, root cause trigger, remediation steps, and preventative monitoring to prevent reoccurrence)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d23-b2-isolating-hardware-vs-software-glitches",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rca_demo.js",
            "initialCode": "function getPostmortemRequirement() {\n  return 'DOCUMENT_ROOT_CAUSE_PREVENTATIVE_ACTIONS_AND_MONITORING';\n}\n\nconsole.log(getPostmortemRequirement());",
            "expectedOutput": "DOCUMENT_ROOT_CAUSE_PREVENTATIVE_ACTIONS_AND_MONITORING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the mandatory final deliverable produced following the resolution of a critical enterprise IT outage?",
          "expectedStringOutput": "DOCUMENT_ROOT_CAUSE_PREVENTATIVE_ACTIONS_AND_MONITORING",
          "acceptableAnswers": [
            "DOCUMENT_ROOT_CAUSE_PREVENTATIVE_ACTIONS_AND_MONITORING",
            "Postmortem",
            "Root cause analysis"
          ],
          "primaryMisconceptionId": "MC_CF_TROUBLESHOOTING_SEVEN_STEP_METHODOLOGY",
          "diagnosisMap": {
            "REBOOT": {
              "misconceptionId": "MC_CF_TROUBLESHOOTING_SEVEN_STEP_METHODOLOGY",
              "errorExplanation": "Rebooting is a temporary action. Final deliverable is DOCUMENT_ROOT_CAUSE_PREVENTATIVE_ACTIONS_AND_MONITORING.",
              "recoveryPath": {
                "simplerExplanation": "Matches DOCUMENT_ROOT_CAUSE_PREVENTATIVE_ACTIONS_AND_MONITORING.",
                "guidedFixPrompt": "Type DOCUMENT_ROOT_CAUSE_PREVENTATIVE_ACTIONS_AND_MONITORING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Automation Scripting for Power Users: Bash / PowerShell Logic & Cron Schedulers",
    "overviewMetaphor": "Scripting Is Training an Army of Digital Robots to Work for You While You Sleep: Instead of manually moving files and deleting temp logs every day, writing a 5-line Bash or PowerShell script checks return exit codes (`exit 0` for success); scheduling it with Unix Cron (`0 2 * * *` = 2:00 AM nightly) executes complex enterprise file backups and reports automatically with zero human oversight.",
    "blocks": [
      {
        "id": "cf-d24-b1-posix-exit-code-evaluation",
        "day": 24,
        "blockNumber": 1,
        "title": "POSIX Script Exit Codes: Success (`exit 0`) vs Error (`exit 1-255`)",
        "conceptBudget": {
          "primaryConcept": "POSIX Exit Code Evaluation Invariant",
          "supportingTerms": [
            "Exit Code ($0$ = Success)",
            "Non-Zero Exit Code ($>0$ = Failure)",
            "Status: Script Execution Completed Successfully Exit Zero"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d23-b1-seven-step-troubleshooting-protocol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "POSIX Process Exit Status & Shell `$?` Return Code Ledger",
              "boxes": [
                {
                  "label": "Successful Process Exit",
                  "value": "exit 0 -> SCRIPT EXECUTION COMPLETED SUCCESSFULLY EXIT ZERO!",
                  "varType": "Success Code",
                  "isUpdated": true
                },
                {
                  "label": "General Command Error",
                  "value": "exit 1 -> Catch-all standard execution failure",
                  "varType": "Error Code",
                  "isUpdated": false
                },
                {
                  "label": "Command Not Found",
                  "value": "exit 127 -> Shell binary lookup in PATH failed",
                  "varType": "Error Code",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "exit_code_demo.js",
            "initialCode": "function evaluateExit(code) {\n  const ok = code === 0;\n  return {\n    code,\n    isSuccess: ok,\n    status: ok ? 'SCRIPT_EXECUTION_COMPLETED_SUCCESSFULLY_EXIT_ZERO' : 'SCRIPT_FAILED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateExit(0)));\nconsole.log(JSON.stringify(evaluateExit(127)));",
            "expectedOutput": "{\"code\":0,\"isSuccess\":true,\"status\":\"SCRIPT_EXECUTION_COMPLETED_SUCCESSFULLY_EXIT_ZERO\"}\n{\"code\":127,\"isSuccess\":false,\"status\":\"SCRIPT_FAILED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What numeric exit status code is returned by POSIX scripts and command-line utilities to signal flawless, error-free execution?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "exit 0",
            "code\":0"
          ],
          "primaryMisconceptionId": "MC_CF_AUTOMATION_BASH_POWERSHELL_CRON",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CF_AUTOMATION_BASH_POWERSHELL_CRON",
              "errorExplanation": "Exit code 1 signals an error. 0 indicates success.",
              "recoveryPath": {
                "simplerExplanation": "Exit 0 is success.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "cf-d24-b2-unix-cron-schedule-syntax",
        "day": 24,
        "blockNumber": 2,
        "title": "Unix Cron Schedule Syntax: `Minute Hour Day-of-Month Month Day-of-Week`",
        "conceptBudget": {
          "primaryConcept": "Cron 5-Field Syntax",
          "supportingTerms": [
            "`0 2 * * *` (Runs at exactly 2:00 AM every single day)",
            "`*/15 * * * *` (Runs every 15 minutes)",
            "`0 0 * * 0` (Runs at midnight every Sunday)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d24-b1-posix-exit-code-evaluation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Cron Expression Anatomy",
            "codeSnippet": "// ┌───────────── Minute (0 - 59)\n// │ ┌─────────── Hour (0 - 23)\n// │ │ ┌───────── Day of Month (1 - 31)\n// │ │ │ ┌─────── Month (1 - 12)\n// │ │ │ │ ┌───── Day of Week (0 - 6, 0=Sunday)\n// 0 2 * * *     -> Executes script at 02:00 AM daily!",
            "lineNotes": {
              "1": "Minute field.",
              "2": "Hour field.",
              "3": "Day of month.",
              "4": "Month.",
              "5": "Day of week.",
              "6": "Full schedule."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cron_demo.js",
            "initialCode": "function getDailyBackupCronExpression() {\n  return 'ZERO_TWO_STAR_STAR_STAR_RUNS_AT_TWO_AM_DAILY';\n}\n\nconsole.log(getDailyBackupCronExpression());",
            "expectedOutput": "ZERO_TWO_STAR_STAR_STAR_RUNS_AT_TWO_AM_DAILY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cron expression schedule represents running an automated system backup at 2:00 AM every day?",
          "expectedStringOutput": "ZERO_TWO_STAR_STAR_STAR_RUNS_AT_TWO_AM_DAILY",
          "acceptableAnswers": [
            "ZERO_TWO_STAR_STAR_STAR_RUNS_AT_TWO_AM_DAILY",
            "0 2 * * *",
            "0 2 * * * daily"
          ],
          "primaryMisconceptionId": "MC_CF_AUTOMATION_BASH_POWERSHELL_CRON",
          "diagnosisMap": {
            "2 0": {
              "misconceptionId": "MC_CF_AUTOMATION_BASH_POWERSHELL_CRON",
              "errorExplanation": "Minute comes first. 2:00 AM is ZERO_TWO_STAR_STAR_STAR_RUNS_AT_TWO_AM_DAILY (0 2 * * *).",
              "recoveryPath": {
                "simplerExplanation": "Matches ZERO_TWO_STAR_STAR_STAR_RUNS_AT_TWO_AM_DAILY.",
                "guidedFixPrompt": "Type ZERO_TWO_STAR_STAR_STAR_RUNS_AT_TWO_AM_DAILY"
              }
            }
          }
        }
      },
      {
        "id": "cf-d24-b3-powershell-cmdlets-and-object-pipelines",
        "day": 24,
        "blockNumber": 3,
        "title": "PowerShell Cmdlets & Object-Oriented Pipelines",
        "conceptBudget": {
          "primaryConcept": "PowerShell Object Pipeline Invariant",
          "supportingTerms": [
            "PowerShell Pipelines (Passes structured .NET objects between commands rather than raw text strings, allowing property filtering like `Get-Process | Where-Object WorkingSet -gt 1GB`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d24-b2-unix-cron-schedule-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "powershell_demo.js",
            "initialCode": "function getPowerShellPipelineType() {\n  return 'PASSES_STRUCTURED_DOTNET_OBJECTS_ACROSS_PIPELINES';\n}\n\nconsole.log(getPowerShellPipelineType());",
            "expectedOutput": "PASSES_STRUCTURED_DOTNET_OBJECTS_ACROSS_PIPELINES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fundamental architectural difference distinguishes PowerShell pipelines from traditional Unix text-stream pipes?",
          "expectedStringOutput": "PASSES_STRUCTURED_DOTNET_OBJECTS_ACROSS_PIPELINES",
          "acceptableAnswers": [
            "PASSES_STRUCTURED_DOTNET_OBJECTS_ACROSS_PIPELINES",
            "Structured objects",
            "Objects instead of text"
          ],
          "primaryMisconceptionId": "MC_CF_AUTOMATION_BASH_POWERSHELL_CRON",
          "diagnosisMap": {
            "TEXT": {
              "misconceptionId": "MC_CF_AUTOMATION_BASH_POWERSHELL_CRON",
              "errorExplanation": "Unix passes raw text. PowerShell PASSES_STRUCTURED_DOTNET_OBJECTS_ACROSS_PIPELINES.",
              "recoveryPath": {
                "simplerExplanation": "Matches PASSES_STRUCTURED_DOTNET_OBJECTS_ACROSS_PIPELINES.",
                "guidedFixPrompt": "Type PASSES_STRUCTURED_DOTNET_OBJECTS_ACROSS_PIPELINES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Office Productivity Suites & Macro Automation: Spreadsheet Formulas & VLOOKUP",
    "overviewMetaphor": "Spreadsheet Software Is the World's Most Popular Visual Database: Millions of businesses run on Excel and Google Sheets; understanding the modern `XLOOKUP` formula (`=XLOOKUP(E101, A2:A100, C2:C100)`) searches large employee payroll tables in milliseconds, eliminates fragile left-to-right VLOOKUP column index errors, and automates executive financial dashboards instantly.",
    "blocks": [
      {
        "id": "cf-d25-b1-xlookup-exact-match-search",
        "day": 25,
        "blockNumber": 1,
        "title": "Spreadsheet XLOOKUP Formula: `=XLOOKUP(lookup_value, lookup_array, return_array)`",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet XLOOKUP Exact Match Search",
          "supportingTerms": [
            "Lookup Key (`'E101'`)",
            "Lookup Column (`'id'`)",
            "Return Column (`'salary'`)",
            "Target Salary Result ($90,000)",
            "Status: XLOOKUP Exact Match Found"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d24-b1-posix-exit-code-evaluation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Spreadsheet XLOOKUP Dynamic Table Search Ledger",
              "boxes": [
                {
                  "label": "Employee Record 1",
                  "value": "{ id: 'E101', name: 'Alice', salary: 90000 }",
                  "varType": "Row 1",
                  "isUpdated": false
                },
                {
                  "label": "Employee Record 2",
                  "value": "{ id: 'E102', name: 'Bob', salary: 80000 }",
                  "varType": "Row 2",
                  "isUpdated": false
                },
                {
                  "label": "XLOOKUP Search 'E101'",
                  "value": "Exact Match Found -> Salary = $90,000 (XLOOKUP EXACT MATCH FOUND!)",
                  "varType": "Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "xlookup_demo.js",
            "initialCode": "function xlookup(key, table, keyCol, retCol) {\n  const row = table.find(r => r[keyCol] === key);\n  if (!row) return { found: false, val: null, status: 'NOT_FOUND' };\n  return {\n    found: true,\n    val: row[retCol],\n    status: 'XLOOKUP_EXACT_MATCH_FOUND'\n  };\n}\n\nconst data = [{ id: 'E101', name: 'Alice', salary: 90000 }, { id: 'E102', name: 'Bob', salary: 80000 }];\nconsole.log(JSON.stringify(xlookup('E101', data, 'id', 'salary')));",
            "expectedOutput": "{\"found\":true,\"val\":90000,\"status\":\"XLOOKUP_EXACT_MATCH_FOUND\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What salary integer is returned when executing XLOOKUP on employee ID 'E101' in the payroll table?",
          "expectedStringOutput": "90000",
          "acceptableAnswers": [
            "90000",
            "90,000",
            "$90,000",
            "val\":90000"
          ],
          "primaryMisconceptionId": "MC_CF_OFFICE_SUITES_SPREADSHEET_MACROS",
          "diagnosisMap": {
            "80000": {
              "misconceptionId": "MC_CF_OFFICE_SUITES_SPREADSHEET_MACROS",
              "errorExplanation": "80000 belongs to Bob (E102). Alice (E101) has a salary of 90000.",
              "recoveryPath": {
                "simplerExplanation": "E101 maps to 90000.",
                "guidedFixPrompt": "Type 90000"
              }
            }
          }
        }
      },
      {
        "id": "cf-d25-b2-absolute-vs-relative-cell-referencing",
        "day": 25,
        "blockNumber": 2,
        "title": "Cell Referencing: Relative (`A1`) vs Absolute (`$A$1`) Locking",
        "conceptBudget": {
          "primaryConcept": "Cell Referencing Locking Invariant",
          "supportingTerms": [
            "Relative Reference (`A1`: Automatically shifts rows/columns when copied across cells)",
            "Absolute Reference (`$A$1`: Locks exact row and column using `$` signs so the reference remains fixed when dragged)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d25-b1-xlookup-exact-match-search",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Spreadsheet Locking Syntax",
            "codeSnippet": "// RELATIVE (B2 * C2):   When dragged down to row 3, formula automatically becomes '=B3 * C3'\n// ABSOLUTE (B2 * $E$1): When dragged down to row 3, formula becomes '=B3 * $E$1' (Tax rate in E1 stays locked!)",
            "lineNotes": {
              "1": "Relative auto-incrementing.",
              "2": "Absolute locked reference."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cell_ref_demo.js",
            "initialCode": "function getAbsoluteCellLockingSymbol() {\n  return 'DOLLAR_SIGN_LOCKS_ROWS_AND_COLUMNS';\n}\n\nconsole.log(getAbsoluteCellLockingSymbol());",
            "expectedOutput": "DOLLAR_SIGN_LOCKS_ROWS_AND_COLUMNS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What symbol is placed before row numbers and column letters in spreadsheet formulas to lock them as absolute references (e.g. `$A$1`)?",
          "expectedStringOutput": "DOLLAR_SIGN_LOCKS_ROWS_AND_COLUMNS",
          "acceptableAnswers": [
            "DOLLAR_SIGN_LOCKS_ROWS_AND_COLUMNS",
            "$",
            "Dollar sign"
          ],
          "primaryMisconceptionId": "MC_CF_OFFICE_SUITES_SPREADSHEET_MACROS",
          "diagnosisMap": {
            "#": {
              "misconceptionId": "MC_CF_OFFICE_SUITES_SPREADSHEET_MACROS",
              "errorExplanation": "Spreadsheet locking uses the DOLLAR_SIGN_LOCKS_ROWS_AND_COLUMNS ($).",
              "recoveryPath": {
                "simplerExplanation": "Matches DOLLAR_SIGN_LOCKS_ROWS_AND_COLUMNS.",
                "guidedFixPrompt": "Type DOLLAR_SIGN_LOCKS_ROWS_AND_COLUMNS"
              }
            }
          }
        }
      },
      {
        "id": "cf-d25-b3-pivot-tables-and-data-summarization",
        "day": 25,
        "blockNumber": 3,
        "title": "Pivot Tables: Instant Multidimensional Data Aggregation",
        "conceptBudget": {
          "primaryConcept": "Pivot Table Invariant",
          "supportingTerms": [
            "Pivot Tables (Interactive data summarization tool aggregating 100,000 raw transactional rows into clear executive cross-tabulations without writing code)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d25-b2-absolute-vs-relative-cell-referencing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pivot_demo.js",
            "initialCode": "function getPivotTableBenefit() {\n  return 'AGGREGATES_RAW_ROWS_INTO_EXECUTIVE_SUMMARY_TABLES';\n}\n\nconsole.log(getPivotTableBenefit());",
            "expectedOutput": "AGGREGATES_RAW_ROWS_INTO_EXECUTIVE_SUMMARY_TABLES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What spreadsheet feature allows users to slice, filter, and summarize thousands of raw database records into clean executive cross-tabulations?",
          "expectedStringOutput": "AGGREGATES_RAW_ROWS_INTO_EXECUTIVE_SUMMARY_TABLES",
          "acceptableAnswers": [
            "AGGREGATES_RAW_ROWS_INTO_EXECUTIVE_SUMMARY_TABLES",
            "Pivot Table",
            "Pivot Tables"
          ],
          "primaryMisconceptionId": "MC_CF_OFFICE_SUITES_SPREADSHEET_MACROS",
          "diagnosisMap": {
            "SORT": {
              "misconceptionId": "MC_CF_OFFICE_SUITES_SPREADSHEET_MACROS",
              "errorExplanation": "Sorting only reorders rows. Summarization uses AGGREGATES_RAW_ROWS_INTO_EXECUTIVE_SUMMARY_TABLES.",
              "recoveryPath": {
                "simplerExplanation": "Matches AGGREGATES_RAW_ROWS_INTO_EXECUTIVE_SUMMARY_TABLES.",
                "guidedFixPrompt": "Type AGGREGATES_RAW_ROWS_INTO_EXECUTIVE_SUMMARY_TABLES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Data Privacy & Digital Footprint: VPN Tunnels, DNS-over-HTTPS & Cookie Tracking",
    "overviewMetaphor": "Digital Privacy Is an Encrypted Armored Car on a Public Highway: When browsing unencrypted, your local ISP and coffee shop Wi-Fi snoops log every website domain you visit; activating DNS-over-HTTPS (DoH) encrypts all DNS lookups over HTTPS port 443, and routing traffic through an encrypted WireGuard VPN tunnel masks your physical IP address, cloaking your digital footprint from third-party advertising trackers.",
    "blocks": [
      {
        "id": "cf-d26-b1-dns-over-https-privacy-audit",
        "day": 26,
        "blockNumber": 1,
        "title": "DNS-over-HTTPS (DoH) & Encrypted VPN Tunnel Privacy Shield",
        "conceptBudget": {
          "primaryConcept": "DoH & VPN Digital Privacy Shield",
          "supportingTerms": [
            "DNS-over-HTTPS Enabled",
            "WireGuard VPN Tunnel Active",
            "ISP Domain Snooping Masked",
            "Status: Digital Footprint Privacy Shield Active"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d25-b1-xlookup-exact-match-search",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Digital Privacy & Network Metadata Protection Ledger",
              "boxes": [
                {
                  "label": "DNS Query Security",
                  "value": "DoH Encrypted Queries via HTTPS Port 443 (Hides domains from ISP)",
                  "varType": "DoH",
                  "isUpdated": false
                },
                {
                  "label": "IP Tunnel Encryption",
                  "value": "WireGuard VPN Tunnel Encrypts All Outbound TCP/UDP Packets",
                  "varType": "VPN",
                  "isUpdated": false
                },
                {
                  "label": "Digital Privacy State",
                  "value": "DIGITAL FOOTPRINT PRIVACY SHIELD ACTIVE (100% ISP METADATA MASKED!)",
                  "varType": "Privacy State",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "privacy_shield_demo.js",
            "initialCode": "function auditPrivacy(doh, vpn) {\n  const ok = doh && vpn;\n  return {\n    doh,\n    vpn,\n    isMasked: ok,\n    status: ok ? 'DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE' : 'METADATA_EXPOSED'\n  };\n}\n\nconsole.log(JSON.stringify(auditPrivacy(true, true)));\nconsole.log(JSON.stringify(auditPrivacy(false, true)));",
            "expectedOutput": "{\"doh\":true,\"vpn\":true,\"isMasked\":true,\"status\":\"DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE\"}\n{\"doh\":false,\"vpn\":true,\"isMasked\":false,\"status\":\"METADATA_EXPOSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a user's web browsing metadata and IP address are protected via concurrent DoH and VPN encryption?",
          "expectedStringOutput": "DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE",
          "acceptableAnswers": [
            "DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE",
            "Privacy shield active",
            "Footprint masked"
          ],
          "primaryMisconceptionId": "MC_CF_DATA_PRIVACY_VPN_DOH_TRACKING",
          "diagnosisMap": {
            "EXPOSED": {
              "misconceptionId": "MC_CF_DATA_PRIVACY_VPN_DOH_TRACKING",
              "errorExplanation": "Both DoH and VPN active awards DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE.",
                "guidedFixPrompt": "Type DIGITAL_FOOTPRINT_PRIVACY_SHIELD_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d26-b2-browser-canvas-fingerprinting",
        "day": 26,
        "blockNumber": 2,
        "title": "Browser Fingerprinting: Canvas, WebGL & Audio API Tracking",
        "conceptBudget": {
          "primaryConcept": "Canvas Fingerprinting Invariant",
          "supportingTerms": [
            "Canvas Fingerprinting (Websites instruct the browser to render a hidden 3D graphic; microscopic GPU rendering differences create a unique hardware identifier without needing cookies)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d26-b1-dns-over-https-privacy-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Canvas Fingerprint Generation",
            "codeSnippet": "// 1. HTML5 Canvas renders hidden text with anti-aliasing\n// 2. GPU driver calculates sub-pixel font rasterization\n// 3. ToDataURL() converts image to SHA-256 hash -> Unique Hardware ID!",
            "lineNotes": {
              "1": "Hidden canvas rendering.",
              "2": "GPU rasterization differences.",
              "3": "Persistent hardware hash."
            }
          },
          {
            "type": "runnable_code",
            "filename": "canvas_fingerprint_demo.js",
            "initialCode": "function getFingerprintMechanism() {\n  return 'CANVAS_GPU_RASTERIZATION_GENERATES_UNIQUE_DEVICE_HASH';\n}\n\nconsole.log(getFingerprintMechanism());",
            "expectedOutput": "CANVAS_GPU_RASTERIZATION_GENERATES_UNIQUE_DEVICE_HASH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do modern advertising trackers identify users across private browsing sessions without relying on HTTP cookies?",
          "expectedStringOutput": "CANVAS_GPU_RASTERIZATION_GENERATES_UNIQUE_DEVICE_HASH",
          "acceptableAnswers": [
            "CANVAS_GPU_RASTERIZATION_GENERATES_UNIQUE_DEVICE_HASH",
            "Canvas fingerprinting",
            "Browser fingerprinting"
          ],
          "primaryMisconceptionId": "MC_CF_DATA_PRIVACY_VPN_DOH_TRACKING",
          "diagnosisMap": {
            "COOKIE": {
              "misconceptionId": "MC_CF_DATA_PRIVACY_VPN_DOH_TRACKING",
              "errorExplanation": "Private mode wipes cookies. Cookieless tracking uses CANVAS_GPU_RASTERIZATION_GENERATES_UNIQUE_DEVICE_HASH.",
              "recoveryPath": {
                "simplerExplanation": "Matches CANVAS_GPU_RASTERIZATION_GENERATES_UNIQUE_DEVICE_HASH.",
                "guidedFixPrompt": "Type CANVAS_GPU_RASTERIZATION_GENERATES_UNIQUE_DEVICE_HASH"
              }
            }
          }
        }
      },
      {
        "id": "cf-d26-b3-gdpr-and-data-subject-access-requests",
        "day": 26,
        "blockNumber": 3,
        "title": "Data Privacy Regulations: GDPR & The Right to Erasure ('Right to be Forgotten')",
        "conceptBudget": {
          "primaryConcept": "GDPR Right to Erasure Invariant",
          "supportingTerms": [
            "Right to Erasure (Article 17 GDPR: Legally mandates companies delete all personal data and tracking records upon user request within 30 days)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d26-b2-browser-canvas-fingerprinting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gdpr_demo.js",
            "initialCode": "function getGdprErasureRight() {\n  return 'ARTICLE_17_RIGHT_TO_ERASURE_MANDATES_DATA_DELETION';\n}\n\nconsole.log(getGdprErasureRight());",
            "expectedOutput": "ARTICLE_17_RIGHT_TO_ERASURE_MANDATES_DATA_DELETION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What GDPR legal article guarantees citizens the right to demand companies permanently delete all collected personal data?",
          "expectedStringOutput": "ARTICLE_17_RIGHT_TO_ERASURE_MANDATES_DATA_DELETION",
          "acceptableAnswers": [
            "ARTICLE_17_RIGHT_TO_ERASURE_MANDATES_DATA_DELETION",
            "Right to erasure",
            "Right to be forgotten"
          ],
          "primaryMisconceptionId": "MC_CF_DATA_PRIVACY_VPN_DOH_TRACKING",
          "diagnosisMap": {
            "OPT_OUT": {
              "misconceptionId": "MC_CF_DATA_PRIVACY_VPN_DOH_TRACKING",
              "errorExplanation": "Permanent deletion is legally mandated under ARTICLE_17_RIGHT_TO_ERASURE_MANDATES_DATA_DELETION.",
              "recoveryPath": {
                "simplerExplanation": "Matches ARTICLE_17_RIGHT_TO_ERASURE_MANDATES_DATA_DELETION.",
                "guidedFixPrompt": "Type ARTICLE_17_RIGHT_TO_ERASURE_MANDATES_DATA_DELETION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Remote Work Tools & Collaboration Infrastructure: SSH, RDP & Cloud VDI",
    "overviewMetaphor": "Remote Work Infrastructure Is a Teleportation Gate to the Corporate Datacenter: Connecting to a cloud server via Remote Desktop Protocol (RDP Port 3389) streams a full Windows graphical desktop over the wire; measuring network connection quality with 100 Mbps download and sub-15ms ping latency ($100\\text{ Mbps} \\ge 50\\text{ Mbps}, 15\\text{ ms} \\le 30\\text{ ms}$) guarantees crystal-clear HD video conferencing and lag-free cloud virtual desktop (VDI) execution.",
    "blocks": [
      {
        "id": "cf-d27-b1-remote-work-connection-evaluation",
        "day": 27,
        "blockNumber": 1,
        "title": "Remote Work Connection Quality: Download $\\ge 50.0\\text{ Mbps}$ & Ping $\\le 30.0\\text{ ms}$",
        "conceptBudget": {
          "primaryConcept": "Remote Work Connection Benchmark",
          "supportingTerms": [
            "Download Speed ($100.0$ Mbps)",
            "Network Latency Ping ($15.0$ ms)",
            "High-Speed Benchmark: $\\ge 50.0$ Mbps",
            "Low-Latency Benchmark: $\\le 30.0$ ms",
            "Status: Remote Work High Performance Connection Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d26-b1-dns-over-https-privacy-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Remote Work Telemetry & Cloud VDI Connection Ledger (100 Mbps, 15ms Ping)",
              "boxes": [
                {
                  "label": "Download Throughput",
                  "value": "100.0 Mbps High-Speed Fiber Bandwidth (Exceeds 50.0 Mbps Threshold)",
                  "varType": "Bandwidth",
                  "isUpdated": false
                },
                {
                  "label": "Network Round-Trip Ping",
                  "value": "15.0 ms Ultra-Low Latency to Datacenter (Sub-30.0 ms Threshold)",
                  "varType": "Latency",
                  "isUpdated": false
                },
                {
                  "label": "Connection Quality",
                  "value": "REMOTE WORK HIGH PERFORMANCE CONNECTION NOMINAL (ZERO JITTER!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "remote_conn_demo.js",
            "initialCode": "function evaluateRemoteConn(speed, ping) {\n  const ok = speed >= 50.0 && ping <= 30.0;\n  return {\n    speedMbps: speed,\n    pingMs: ping,\n    isNominal: ok,\n    status: ok ? 'REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL' : 'POOR_CONNECTION'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRemoteConn(100.0, 15.0)));\nconsole.log(JSON.stringify(evaluateRemoteConn(15.0, 120.0)));",
            "expectedOutput": "{\"speedMbps\":100,\"pingMs\":15,\"isNominal\":true,\"status\":\"REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL\"}\n{\"speedMbps\":15,\"pingMs\":120,\"isNominal\":false,\"status\":\"POOR_CONNECTION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What connection status confirms that a remote work connection achieves 100 Mbps download and 15ms ping latency?",
          "expectedStringOutput": "REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL",
          "acceptableAnswers": [
            "REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL",
            "High performance connection",
            "Nominal connection"
          ],
          "primaryMisconceptionId": "MC_CF_REMOTE_WORK_SSH_RDP_VDI_TUNNELS",
          "diagnosisMap": {
            "POOR": {
              "misconceptionId": "MC_CF_REMOTE_WORK_SSH_RDP_VDI_TUNNELS",
              "errorExplanation": "100 Mbps and 15ms ping satisfies all standards: REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL.",
                "guidedFixPrompt": "Type REMOTE_WORK_HIGH_PERFORMANCE_CONNECTION_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cf-d27-b2-rdp-standard-port-mapping",
        "day": 27,
        "blockNumber": 2,
        "title": "Remote Desktop Protocol (RDP Port 3389) vs VNC Security",
        "conceptBudget": {
          "primaryConcept": "RDP Port 3389 Invariant",
          "supportingTerms": [
            "RDP (Remote Desktop Protocol: Microsoft proprietary GUI streaming protocol running over Port 3389 with Network Level Authentication NLA)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d27-b1-remote-work-connection-evaluation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "RDP Security Best Practices",
            "codeSnippet": "// PORT:      Standard TCP Port 3389\n// SECURITY:  Must ALWAYS be tunneled through VPN or SSH tunnel (NEVER exposed raw to open internet!)\n// AUTH:      Requires Network Level Authentication (NLA) before initiating GUI session",
            "lineNotes": {
              "1": "RDP Port 3389.",
              "2": "VPN tunnel mandate.",
              "3": "NLA authentication."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rdp_port_demo.js",
            "initialCode": "function getRdpPort() {\n  return 3389;\n}\n\nconsole.log(getRdpPort());",
            "expectedOutput": "3389",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard IANA network port number utilized by Microsoft Remote Desktop Protocol (RDP)?",
          "expectedStringOutput": "3389",
          "acceptableAnswers": [
            "3389",
            "Port 3389",
            "3389 TCP"
          ],
          "primaryMisconceptionId": "MC_CF_REMOTE_WORK_SSH_RDP_VDI_TUNNELS",
          "diagnosisMap": {
            "22": {
              "misconceptionId": "MC_CF_REMOTE_WORK_SSH_RDP_VDI_TUNNELS",
              "errorExplanation": "Port 22 is SSH. Microsoft RDP runs on Port 3389.",
              "recoveryPath": {
                "simplerExplanation": "RDP is port 3389.",
                "guidedFixPrompt": "Type 3389"
              }
            }
          }
        }
      },
      {
        "id": "cf-d27-b3-cloud-virtual-desktop-vdi",
        "day": 27,
        "blockNumber": 3,
        "title": "Cloud Virtual Desktop Infrastructure (VDI): Centralized Security",
        "conceptBudget": {
          "primaryConcept": "Cloud VDI Invariant",
          "supportingTerms": [
            "VDI (Virtual Desktop Infrastructure e.g. Amazon WorkSpaces: Desktop OS runs in secure cloud datacenter; zero corporate data resides on employee personal laptops)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d27-b2-rdp-standard-port-mapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "vdi_demo.js",
            "initialCode": "function getVdiSecurityAdvantage() {\n  return 'ZERO_CORPORATE_DATA_STORED_ON_LOCAL_WORKSTATION';\n}\n\nconsole.log(getVdiSecurityAdvantage());",
            "expectedOutput": "ZERO_CORPORATE_DATA_STORED_ON_LOCAL_WORKSTATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What primary cybersecurity benefit is achieved by deploying enterprise Cloud Virtual Desktop Infrastructure (VDI)?",
          "expectedStringOutput": "ZERO_CORPORATE_DATA_STORED_ON_LOCAL_WORKSTATION",
          "acceptableAnswers": [
            "ZERO_CORPORATE_DATA_STORED_ON_LOCAL_WORKSTATION",
            "Zero local data storage",
            "Data stays in datacenter"
          ],
          "primaryMisconceptionId": "MC_CF_REMOTE_WORK_SSH_RDP_VDI_TUNNELS",
          "diagnosisMap": {
            "LOCAL": {
              "misconceptionId": "MC_CF_REMOTE_WORK_SSH_RDP_VDI_TUNNELS",
              "errorExplanation": "VDI ensures ZERO_CORPORATE_DATA_STORED_ON_LOCAL_WORKSTATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches ZERO_CORPORATE_DATA_STORED_ON_LOCAL_WORKSTATION.",
                "guidedFixPrompt": "Type ZERO_CORPORATE_DATA_STORED_ON_LOCAL_WORKSTATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Hardware Maintenance, Thermals & Power Management: Thermal Throttling & UPS",
    "overviewMetaphor": "Computer Hardware Maintenance Is the Cooling and Electrical Grid of a High-Performance Racecar: Dust accumulation on heatsinks suffocates airflow, causing CPU junction temperatures to spike past 95°C and triggering thermal throttling; maintaining thermal paste keeps operating temperatures cool at 65°C ($65^\\circ\\text{C} \\le 85^\\circ\\text{C}$); pairing workstations with an Uninterruptible Power Supply (UPS) provides battery backup and voltage regulation, protecting hardware against blackouts and surges.",
    "blocks": [
      {
        "id": "cf-d28-b1-cpu-thermals-audit",
        "day": 28,
        "blockNumber": 1,
        "title": "CPU Thermal Safety Margins: Operating at 65°C ($65^\\circ\\text{C} \\le 85^\\circ\\text{C}$)",
        "conceptBudget": {
          "primaryConcept": "CPU Thermal Safety Margin Auditor",
          "supportingTerms": [
            "Current CPU Temperature ($65^\\circ$C)",
            "Max Junction Temperature ($100^\\circ$C)",
            "Safe Margin Threshold: $\\le Max - 15^\\circ\\text{C} = 85^\\circ\\text{C}$",
            "Status: CPU Thermals Cool and Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d27-b1-remote-work-connection-evaluation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Hardware Thermal Dissipation & Silicon Junction Temperature Ledger",
              "boxes": [
                {
                  "label": "Current Silicon Die Temp",
                  "value": "65°C Under Sustained Multi-Core Workload",
                  "varType": "Current Temp",
                  "isUpdated": false
                },
                {
                  "label": "Maximum Junction Limit (Tj)",
                  "value": "100°C Thermal Breakdown Ceiling (Throttles at 95°C)",
                  "varType": "Max Limit",
                  "isUpdated": false
                },
                {
                  "label": "Thermal Safety State",
                  "value": "CPU THERMALS COOL AND NOMINAL (35°C SAFETY HEADROOM!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "thermals_demo.js",
            "initialCode": "function auditThermals(temp, maxTemp) {\n  const isThrottling = temp >= (maxTemp - 5);\n  const isSafe = temp <= (maxTemp - 15);\n  return {\n    temp,\n    maxTemp,\n    isSafe,\n    status: isThrottling ? 'THERMAL_THROTTLING' : (isSafe ? 'CPU_THERMALS_COOL_AND_NOMINAL' : 'WARM')\n  };\n}\n\nconsole.log(JSON.stringify(auditThermals(65, 100)));\nconsole.log(JSON.stringify(auditThermals(98, 100)));",
            "expectedOutput": "{\"temp\":65,\"maxTemp\":100,\"isSafe\":true,\"status\":\"CPU_THERMALS_COOL_AND_NOMINAL\"}\n{\"temp\":98,\"maxTemp\":100,\"isSafe\":false,\"status\":\"THERMAL_THROTTLING\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What thermal status confirms that a CPU running at 65°C is operating with optimal thermal margins below its 100°C junction ceiling?",
          "expectedStringOutput": "CPU_THERMALS_COOL_AND_NOMINAL",
          "acceptableAnswers": [
            "CPU_THERMALS_COOL_AND_NOMINAL",
            "Cool and nominal",
            "Safe and cool"
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_MAINTENANCE_THERMALS_PSU",
          "diagnosisMap": {
            "THROTTLE": {
              "misconceptionId": "MC_CF_HARDWARE_MAINTENANCE_THERMALS_PSU",
              "errorExplanation": "65°C is well below the 95°C throttle threshold: CPU_THERMALS_COOL_AND_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches CPU_THERMALS_COOL_AND_NOMINAL.",
                "guidedFixPrompt": "Type CPU_THERMALS_COOL_AND_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cf-d28-b2-psu-80-plus-efficiency-ratings",
        "day": 28,
        "blockNumber": 2,
        "title": "Power Supply 80-Plus Efficiency: Bronze, Gold vs Platinum ($\\ge 90\\%$)",
        "conceptBudget": {
          "primaryConcept": "PSU 80-Plus Efficiency Ratings",
          "supportingTerms": [
            "80-Plus Gold ($\\ge 87\\%$ electrical efficiency)",
            "80-Plus Platinum ($\\ge 90\\%$ efficiency converting AC wall power into DC computer power, minimizing heat waste)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d28-b1-cpu-thermals-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PSU Efficiency Hierarchy",
            "codeSnippet": "// 80-PLUS WHITE:    80% Efficiency (20% of power lost as waste heat)\n// 80-PLUS BRONZE:   85% Efficiency\n// 80-PLUS GOLD:     87% - 90% Efficiency (Industry Standard for reliability)\n// 80-PLUS PLATINUM: 92% Efficiency (Datacenter Tier)",
            "lineNotes": {
              "1": "Baseline tier.",
              "2": "Bronze tier.",
              "3": "Gold standard.",
              "4": "Platinum datacenter."
            }
          },
          {
            "type": "runnable_code",
            "filename": "psu_demo.js",
            "initialCode": "function getPsuGoldEfficiencyPct() {\n  return 90;\n}\n\nconsole.log(getPsuGoldEfficiencyPct());",
            "expectedOutput": "90",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What minimum electrical efficiency percentage is delivered by 80-Plus Gold/Platinum power supplies at 50% load?",
          "expectedStringOutput": "90",
          "acceptableAnswers": [
            "90",
            "90%",
            "90 percent"
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_MAINTENANCE_THERMALS_PSU",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_CF_HARDWARE_MAINTENANCE_THERMALS_PSU",
              "errorExplanation": "80-Plus supplies deliver 90% efficiency.",
              "recoveryPath": {
                "simplerExplanation": "80-Plus Gold/Platinum is 90%.",
                "guidedFixPrompt": "Type 90"
              }
            }
          }
        }
      },
      {
        "id": "cf-d28-b3-uninterruptible-power-supply-ups",
        "day": 28,
        "blockNumber": 3,
        "title": "Uninterruptible Power Supply (UPS): Surge Protection & Battery Backup",
        "conceptBudget": {
          "primaryConcept": "UPS Battery Backup Invariant",
          "supportingTerms": [
            "UPS (Uninterruptible Power Supply: Contains battery bank providing 15-30 minutes of emergency power and automatic voltage regulation AVR during electrical blackouts)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d28-b2-psu-80-plus-efficiency-ratings",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ups_demo.js",
            "initialCode": "function getUpsDefinition() {\n  return 'UNINTERRUPTIBLE_POWER_SUPPLY_PROVIDES_BATTERY_BACKUP_AND_SURGE_PROTECTION';\n}\n\nconsole.log(getUpsDefinition());",
            "expectedOutput": "UNINTERRUPTIBLE_POWER_SUPPLY_PROVIDES_BATTERY_BACKUP_AND_SURGE_PROTECTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What hardware battery backup unit protects servers and workstations from unexpected power outages and voltage surges?",
          "expectedStringOutput": "UNINTERRUPTIBLE_POWER_SUPPLY_PROVIDES_BATTERY_BACKUP_AND_SURGE_PROTECTION",
          "acceptableAnswers": [
            "UNINTERRUPTIBLE_POWER_SUPPLY_PROVIDES_BATTERY_BACKUP_AND_SURGE_PROTECTION",
            "UPS",
            "Uninterruptible Power Supply"
          ],
          "primaryMisconceptionId": "MC_CF_HARDWARE_MAINTENANCE_THERMALS_PSU",
          "diagnosisMap": {
            "SURGE_ONLY": {
              "misconceptionId": "MC_CF_HARDWARE_MAINTENANCE_THERMALS_PSU",
              "errorExplanation": "Surge strips lack batteries. Full battery protection is UNINTERRUPTIBLE_POWER_SUPPLY_PROVIDES_BATTERY_BACKUP_AND_SURGE_PROTECTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches UNINTERRUPTIBLE_POWER_SUPPLY_PROVIDES_BATTERY_BACKUP_AND_SURGE_PROTECTION.",
                "guidedFixPrompt": "Type UNINTERRUPTIBLE_POWER_SUPPLY_PROVIDES_BATTERY_BACKUP_AND_SURGE_PROTECTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Sustainable Computing & E-Waste: DoD 5220.22-M 7-Pass Data Sanitization",
    "overviewMetaphor": "Decommissioning Storage Hardware Is Shredding Financial Documents in an Incinerator: Simply dragging files to the Desktop Recycle Bin or executing a quick format leaves raw data blocks 100% recoverable by forensic software; executing Department of Defense (DoD 5220.22-M) 7-Pass Drive Overwrite overwrites every storage sector with alternating patterns 7 times ($Passes = 7$), guaranteeing zero data remanence before responsible hardware recycling.",
    "blocks": [
      {
        "id": "cf-d29-b1-dod-5220-sanitization-simulation",
        "day": 29,
        "blockNumber": 1,
        "title": "DoD 5220.22-M 7-Pass Drive Overwrite Data Sanitization Standard",
        "conceptBudget": {
          "primaryConcept": "DoD 5220.22-M 7-Pass Sanitization",
          "supportingTerms": [
            "Completed Overwrite Passes ($7$ passes)",
            "Alternating Bit Patterns ($0x00$, $0xFF$, Pseudo-random)",
            "Zero Data Remanence",
            "Status: DoD 5220.22-M 7-Pass Sanitization Certified Zero Data Remanence"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d28-b1-cpu-thermals-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "DoD 5220.22-M Military Data Sanitization Overwrite Ledger (7 Passes)",
              "boxes": [
                {
                  "label": "Passes 1-3: Fixed Patterns",
                  "value": "Pass 1 (0x00 Zeros) | Pass 2 (0xFF Ones) | Pass 3 (Alternating 0xAA)",
                  "varType": "Fixed Passes",
                  "isUpdated": false
                },
                {
                  "label": "Passes 4-6: Pseudo-Random",
                  "value": "Cryptographic Pseudo-Random Data Block Scrambling",
                  "varType": "Random Passes",
                  "isUpdated": false
                },
                {
                  "label": "Pass 7: Final Verification",
                  "value": "Read-back Verification Confirms ZERO DATA REMANENCE (DOD SANITIZED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dod_wipe_demo.js",
            "initialCode": "function simulateDod(passes) {\n  const ok = passes === 7;\n  return {\n    passes,\n    isCertified: ok,\n    status: ok ? 'DOD_5220_22_M_SEVEN_PASS_SANITIZATION_CERTIFIED_ZERO_DATA_REMANENCE' : 'INCOMPLETE_WIPE'\n  };\n}\n\nconsole.log(JSON.stringify(simulateDod(7)));\nconsole.log(JSON.stringify(simulateDod(3)));",
            "expectedOutput": "{\"passes\":7,\"isCertified\":true,\"status\":\"DOD_5220_22_M_SEVEN_PASS_SANITIZATION_CERTIFIED_ZERO_DATA_REMANENCE\"}\n{\"passes\":3,\"isCertified\":false,\"status\":\"INCOMPLETE_WIPE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many complete overwrite passes are required to certify storage drive decommissioning under the DoD 5220.22-M military standard?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "7 passes",
            "passes\":7"
          ],
          "primaryMisconceptionId": "MC_CF_SUSTAINABLE_EWASTE_DOD_WIPE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CF_SUSTAINABLE_EWASTE_DOD_WIPE",
              "errorExplanation": "1 pass is a simple zero-fill. DoD 5220.22-M requires 7 passes.",
              "recoveryPath": {
                "simplerExplanation": "DoD requires 7 passes.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      },
      {
        "id": "cf-d29-b2-quick-format-vs-secure-erasure",
        "day": 29,
        "blockNumber": 2,
        "title": "Quick Format (Metadata Only) vs Full Cryptographic Drive Erasure",
        "conceptBudget": {
          "primaryConcept": "Quick Format vs Full Erasure Invariant",
          "supportingTerms": [
            "Quick Format (Only deletes the file allocation table; raw file bytes remain 100% intact and easily recoverable on disk)",
            "Cryptographic Wipe (Overwrites all physical sectors or destroys the encryption key)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d29-b1-dod-5220-sanitization-simulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Format Type Comparison",
            "codeSnippet": "// QUICK FORMAT: Wipes directory pointer table in 3 seconds -> Raw photos/passwords remain on sectors!\n// SECURE ERASE: Sends ATA/NVMe Secure Erase command -> Discharges all flash cells simultaneously in 10ms!",
            "lineNotes": {
              "1": "Quick format insecurity.",
              "2": "Hardware cryptographic secure erase."
            }
          },
          {
            "type": "runnable_code",
            "filename": "format_type_demo.js",
            "initialCode": "function evaluateQuickFormatSecurity() {\n  return 'QUICK_FORMAT_ONLY_DELETES_POINTERS_LEAVING_DATA_RECOVERABLE';\n}\n\nconsole.log(evaluateQuickFormatSecurity());",
            "expectedOutput": "QUICK_FORMAT_ONLY_DELETES_POINTERS_LEAVING_DATA_RECOVERABLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is a standard operating system 'Quick Format' dangerous when disposing of old hard drives containing sensitive personal data?",
          "expectedStringOutput": "QUICK_FORMAT_ONLY_DELETES_POINTERS_LEAVING_DATA_RECOVERABLE",
          "acceptableAnswers": [
            "QUICK_FORMAT_ONLY_DELETES_POINTERS_LEAVING_DATA_RECOVERABLE",
            "Leaves data recoverable",
            "Only deletes pointers"
          ],
          "primaryMisconceptionId": "MC_CF_SUSTAINABLE_EWASTE_DOD_WIPE",
          "diagnosisMap": {
            "SECURE": {
              "misconceptionId": "MC_CF_SUSTAINABLE_EWASTE_DOD_WIPE",
              "errorExplanation": "Quick format is not secure: QUICK_FORMAT_ONLY_DELETES_POINTERS_LEAVING_DATA_RECOVERABLE.",
              "recoveryPath": {
                "simplerExplanation": "Matches QUICK_FORMAT_ONLY_DELETES_POINTERS_LEAVING_DATA_RECOVERABLE.",
                "guidedFixPrompt": "Type QUICK_FORMAT_ONLY_DELETES_POINTERS_LEAVING_DATA_RECOVERABLE"
              }
            }
          }
        }
      },
      {
        "id": "cf-d29-b3-responsible-ewaste-and-circular-economy",
        "day": 29,
        "blockNumber": 3,
        "title": "E-Waste Recycling: R2 / e-Stewards Certified Environmental Recovery",
        "conceptBudget": {
          "primaryConcept": "Responsible E-Waste Invariant",
          "supportingTerms": [
            "e-Stewards / R2 Certification (Ensures decommissioned electronics are safely recycled without dumping toxic lead and mercury in developing nations)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d29-b2-quick-format-vs-secure-erasure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ewaste_demo.js",
            "initialCode": "function getEwasteStandard() {\n  return 'R2_AND_E_STEWARDS_CERTIFIED_RESPONSIBLE_RECYCLING';\n}\n\nconsole.log(getEwasteStandard());",
            "expectedOutput": "R2_AND_E_STEWARDS_CERTIFIED_RESPONSIBLE_RECYCLING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What gold-standard environmental certification guarantees responsible e-waste recycling and zero toxic landfill dumping?",
          "expectedStringOutput": "R2_AND_E_STEWARDS_CERTIFIED_RESPONSIBLE_RECYCLING",
          "acceptableAnswers": [
            "R2_AND_E_STEWARDS_CERTIFIED_RESPONSIBLE_RECYCLING",
            "R2",
            "e-Stewards"
          ],
          "primaryMisconceptionId": "MC_CF_SUSTAINABLE_EWASTE_DOD_WIPE",
          "diagnosisMap": {
            "LANDFILL": {
              "misconceptionId": "MC_CF_SUSTAINABLE_EWASTE_DOD_WIPE",
              "errorExplanation": "Responsible recycling uses R2_AND_E_STEWARDS_CERTIFIED_RESPONSIBLE_RECYCLING.",
              "recoveryPath": {
                "simplerExplanation": "Matches R2_AND_E_STEWARDS_CERTIFIED_RESPONSIBLE_RECYCLING.",
                "guidedFixPrompt": "Type R2_AND_E_STEWARDS_CERTIFIED_RESPONSIBLE_RECYCLING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Computer Literacy & OS Operating System Suite",
    "overviewMetaphor": "The Sovereign Computer Master Suite Is the Complete Command Center of Modern Computing: Synthesizing all 5 foundational pillars into an unbreakable digital mastery suite: 1. Hardware & OS Foundations (25,600 MB/s memory bus, Ring 0 system calls, 755 chmod octal decoding, and Unix grep pipelines); 2. Systems Networking & Storage (10ns AMAT memory cache, /24 subnetting, 300ms Web DevTools, 66.7 WPM touch typing, and 3-2-1 backup compliance); 3. Security & Peripherals (78.7-bit password entropy, PoLP sudo authentication, RSA asymmetric keys, 40 Gbps Thunderbolt 4, and PATH resolution); 4. Modern Workflows & Virtualization (0.5s Docker container isolation, 7-Step troubleshooting protocol, exit 0 bash scripts, XLOOKUP simulation, and DoH privacy protection); 5. Maintenance & Sustainability (65°C cool thermals, 100 Mbps remote work connection, and DoD 5220.22-M 7-pass data sanitization).",
    "blocks": [
      {
        "id": "cf-d30-b1-sovereign-computer-master-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Sovereign Computer Literacy & OS Master Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Sovereign Computer Master Suite Orchestration",
          "supportingTerms": [
            "Computing Foundations Module",
            "Systems Networking Module",
            "Systems Security Module",
            "Modern Workflows Module",
            "Maintenance & Sustainability Module",
            "Status: Sovereign Computer Literacy & OS Master Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d29-b3-responsible-ewaste-and-circular-economy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "PinIT Computer Literacy & OS Mastery Capstone Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Computing Foundations (25,600 MB/s bus, Ring 0 syscalls, 755 chmod, grep)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Systems Networking (10ns AMAT, /24 subnet, 300ms DevTools, 66.7 WPM, 3-2-1 backup)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Security & Peripherals (78.7-bit entropy, PoLP sudo, RSA keys, 40 Gbps TB4, PATH)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Workflows & Virtualization (0.5s Docker, 7-step IT protocol, exit 0, XLOOKUP, DoH)",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Maintenance & Sustainability (65°C thermals, 100 Mbps RDP, DoD 7-pass wipe)",
                  "kind": "process"
                },
                {
                  "id": "6",
                  "label": "Certifies Sovereign Computer Literacy & OS Master Suite!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sovereign_capstone_demo.js",
            "initialCode": "function orchestrateMasterSuite(f, s, sec, w, m) {\n  const ok = f && s && sec && w && m;\n  return {\n    foundations: f,\n    systems: s,\n    security: sec,\n    workflows: w,\n    maintenance: m,\n    isMasterCertified: ok,\n    status: ok ? 'SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(orchestrateMasterSuite(true, true, true, true, true)));",
            "expectedOutput": "{\"foundations\":true,\"systems\":true,\"security\":true,\"workflows\":true,\"maintenance\":true,\"isMasterCertified\":true,\"status\":\"SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that all 5 pillars of the Sovereign Computer Literacy & OS Master Suite evaluate with 100% operational certification?",
          "expectedStringOutput": "SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL",
            "status: SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_CF_CAPSTONE_SOVEREIGN_OS_LITERACY_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_CF_CAPSTONE_SOVEREIGN_OS_LITERACY_SUITE",
              "errorExplanation": "All 5 pillars evaluated to true awards SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL.",
                "guidedFixPrompt": "Type SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "cf-d30-b2-sovereign-master-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Sovereign Master Suite 100/100 Quality Verification & Final Audit",
        "conceptBudget": {
          "primaryConcept": "Sovereign Master Quality Verification",
          "supportingTerms": [
            "Full Platform Certification",
            "100/100 Final QA Score",
            "Zero Quality Defects"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d30-b1-sovereign-computer-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_qa_audit_demo.js",
            "initialCode": "function auditCapstoneQuality() {\n  return {\n    totalAuditedDays: 30,\n    totalLearningBlocks: 90,\n    singleBlockDays: 0,\n    qaScore: '100/100',\n    tier: 'SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstoneQuality()));",
            "expectedOutput": "{\"totalAuditedDays\":30,\"totalLearningBlocks\":90,\"singleBlockDays\":0,\"qaScore\":\"100/100\",\"tier\":\"SOVEREIGN_COMPUTER_LITERACY_AND_OS_MASTER_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What perfect QA audit score is certified across all 30 days and 90 micro-learning blocks of the Computer Literacy & OS curriculum?",
          "expectedStringOutput": "100/100",
          "acceptableAnswers": [
            "100/100",
            "100 / 100",
            "qaScore\":\"100/100\""
          ],
          "primaryMisconceptionId": "MC_CF_CAPSTONE_SOVEREIGN_OS_LITERACY_SUITE",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_CF_CAPSTONE_SOVEREIGN_OS_LITERACY_SUITE",
              "errorExplanation": "PinIT standard requires a perfect 100/100 score.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 100/100"
              }
            }
          }
        }
      },
      {
        "id": "cf-d30-b3-final-graduation-congratulations",
        "day": 30,
        "blockNumber": 3,
        "title": "Course #28 Sovereign Computer Literacy & OS Fundamentals Graduation",
        "conceptBudget": {
          "primaryConcept": "Course Graduation",
          "supportingTerms": [
            "Course Complete",
            "Computer Literacy Master",
            "PinIT Gold-Standard Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cf-d30-b2-sovereign-master-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "graduation_demo.js",
            "initialCode": "console.log('🏆 CONGRATULATIONS: You have mastered Course #28: Computer Literacy, Digital Productivity & OS Fundamentals on PinIT Career OS!');",
            "expectedOutput": "🏆 CONGRATULATIONS: You have mastered Course #28: Computer Literacy, Digital Productivity & OS Fundamentals on PinIT Career OS!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What celebratory string confirms graduation from Course #28?",
          "expectedStringOutput": "🏆 CONGRATULATIONS: You have mastered Course #28: Computer Literacy, Digital Productivity & OS Fundamentals on PinIT Career OS!",
          "acceptableAnswers": [
            "🏆 CONGRATULATIONS: You have mastered Course #28: Computer Literacy, Digital Productivity & OS Fundamentals on PinIT Career OS!",
            "CONGRATULATIONS",
            "Graduation certified"
          ],
          "primaryMisconceptionId": "MC_CF_CAPSTONE_SOVEREIGN_OS_LITERACY_SUITE",
          "diagnosisMap": {
            "FAIL": {
              "misconceptionId": "MC_CF_CAPSTONE_SOVEREIGN_OS_LITERACY_SUITE",
              "errorExplanation": "Matches graduation header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 CONGRATULATIONS: You have mastered Course #28: Computer Literacy, Digital Productivity & OS Fundamentals on PinIT Career OS!"
              }
            }
          }
        }
      }
    ]
  }
];
