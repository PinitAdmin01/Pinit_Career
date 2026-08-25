// Auto-generated 30-day IoT, Firmware & Embedded Systems Socratic Curriculum Dataset
import { DayLessonPlan } from '../types/lessonEngine';

export const IOT_EMBEDDED_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Embedded Systems Architecture & Microcontrollers",
    "overviewMetaphor": "A Microcontroller (MCU) is a self-contained miniature computer factory on a single silicon chip: unlike a desktop PC that has separate CPU chips, RAM sticks, and SSD drives connected via long motherboard cables, an MCU packs the CPU Core (Worker), Flash ROM (Permanent Blueprint Library), SRAM (Workbench Scratchpad), and GPIO Peripherals (Factory Control Knobs) onto 1 square centimeter of silicon, booting in 5 microseconds on 10 milliwatts of power.",
    "blocks": [
      {
        "id": "iot-d1-b1-mcu-anatomy-memory-map",
        "day": 1,
        "blockNumber": 1,
        "title": "Microcontroller Anatomy: ARM Cortex-M, Flash ROM & SRAM",
        "conceptBudget": {
          "primaryConcept": "MCU Memory Map Architecture",
          "supportingTerms": [
            "Flash ROM (`0x08000000`: Non-volatile code storage)",
            "SRAM (`0x20000000`: Volatile stack/heap/data)",
            "Peripherals MMIO (`0x40000000`: Hardware registers)",
            "Coretex-M Vector Table & Reset Handler"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ARM Cortex-M Standard Memory Map",
              "boxes": [
                {
                  "label": "0x00000000 - 0x1FFFFFFF (Code Flash)",
                  "value": "Vector Table, Bootloader, Firmware instructions (Read-Only)",
                  "varType": "Flash ROM",
                  "isUpdated": false
                },
                {
                  "label": "0x20000000 - 0x3FFFFFFF (SRAM)",
                  "value": "Global variables, Stack frames, Heap allocations (Read/Write)",
                  "varType": "Volatile SRAM",
                  "isUpdated": true
                },
                {
                  "label": "0x40000000 - 0x5FFFFFFF (Peripherals)",
                  "value": "GPIO, UART, SPI, I2C, Timers hardware control registers",
                  "varType": "MMIO Hardware",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "memory_map_lookup.js",
            "initialCode": "function inspectAddress(addressHex) {\n  const addr = parseInt(addressHex, 16);\n  if (addr >= 0x08000000 && addr < 0x08100000) return 'FLASH_SECTOR: EXECUTING_FIRMWARE_OPCODES';\n  if (addr >= 0x20000000 && addr < 0x20020000) return 'SRAM_REGION: LOCAL_STACK_VARIABLE';\n  if (addr >= 0x40000000 && addr < 0x40030000) return 'MMIO_PERIPHERAL: HARDWARE_GPIO_REGISTER';\n  return 'UNKNOWN_REGION';\n}\n\nconsole.log('0x08000104:', inspectAddress('0x08000104'));\nconsole.log('0x20000400:', inspectAddress('0x20000400'));\nconsole.log('0x40020000:', inspectAddress('0x40020000'));",
            "expectedOutput": "0x08000104: FLASH_SECTOR: EXECUTING_FIRMWARE_OPCODES\n0x20000400: SRAM_REGION: LOCAL_STACK_VARIABLE\n0x40020000: MMIO_PERIPHERAL: HARDWARE_GPIO_REGISTER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What memory region is accessed when dereferencing address `0x40020000`?",
          "expectedStringOutput": "MMIO_PERIPHERAL: HARDWARE_GPIO_REGISTER",
          "acceptableAnswers": [
            "MMIO_PERIPHERAL: HARDWARE_GPIO_REGISTER",
            "0x40020000: MMIO_PERIPHERAL: HARDWARE_GPIO_REGISTER",
            "MMIO_PERIPHERAL"
          ],
          "primaryMisconceptionId": "MC_IOT_ARCH_HARVARD_VON_NEUMANN_FLASH_SRAM",
          "diagnosisMap": {
            "FLASH": {
              "misconceptionId": "MC_IOT_ARCH_HARVARD_VON_NEUMANN_FLASH_SRAM",
              "errorExplanation": "Addresses starting with 0x40000000 are peripheral MMIO registers (MMIO_PERIPHERAL: HARDWARE_GPIO_REGISTER).",
              "recoveryPath": {
                "simplerExplanation": "0x40000000 region maps to MMIO peripherals.",
                "guidedFixPrompt": "Type MMIO_PERIPHERAL: HARDWARE_GPIO_REGISTER"
              }
            }
          }
        }
      },
      {
        "id": "iot-d1-b2-harvard-vs-von-neumann",
        "day": 1,
        "blockNumber": 2,
        "title": "Harvard vs Von Neumann Architecture & Bus Interfaces",
        "conceptBudget": {
          "primaryConcept": "Harvard vs Von Neumann Architecture",
          "supportingTerms": [
            "Harvard (Separate Instruction Bus I-Code and Data Bus D-Code: fetch instruction and read data in parallel in 1 clock cycle)",
            "Von Neumann (Shared single bus: Von Neumann bottleneck)",
            "Cortex-M3/M4/M7 Harvard bus matrix"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Bus Architecture Comparison",
              "boxes": [
                {
                  "label": "1. Harvard Architecture (Cortex-M)",
                  "value": "Separate I-Bus + D-Bus -> Simultaneous Instruction Fetch & Data Access -> Deterministic 1-cycle execution",
                  "varType": "High Determinism",
                  "isUpdated": true
                },
                {
                  "label": "2. Von Neumann Architecture",
                  "value": "Shared Unified Bus -> Sequential access -> CPU stalls on data fetch (Bottleneck)",
                  "varType": "Shared Bus",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bus_sim_demo.js",
            "initialCode": "function evaluateBusCycles(architecture) {\n  return architecture === 'HARVARD'\n    ? { cyclesToFetchAndRead: 1, simultaneousAccess: true, instructionBus: 'I-CODE', dataBus: 'D-CODE' }\n    : { cyclesToFetchAndRead: 2, simultaneousAccess: false, bottleneck: 'SHARED_SYSTEM_BUS' };\n}\n\nconsole.log('ARM Cortex-M (Harvard):', JSON.stringify(evaluateBusCycles('HARVARD')));",
            "expectedOutput": "ARM Cortex-M (Harvard): {\"cyclesToFetchAndRead\":1,\"simultaneousAccess\":true,\"instructionBus\":\"I-CODE\",\"dataBus\":\"D-CODE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do real-time embedded microcontrollers (like ARM Cortex-M) implement Harvard Architecture with separate Instruction and Data buses?",
          "options": [
            "To allow the CPU core to fetch the next program instruction from Flash ROM over the I-Code bus at the exact same clock cycle it reads sensor data from SRAM over the D-Code bus, eliminating pipeline stalls",
            "Because Harvard University owns the copyright to microcontrollers",
            "To disable arithmetic calculations"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_ARCH_HARVARD_VON_NEUMANN_FLASH_SRAM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_ARCH_HARVARD_VON_NEUMANN_FLASH_SRAM",
              "errorExplanation": "Dual buses enable simultaneous instruction fetch and data read in 1 cycle.",
              "recoveryPath": {
                "simplerExplanation": "Enables simultaneous instruction fetch and data access in 1 cycle.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d1-b3-mmio-pointer-dereferencing",
        "day": 1,
        "blockNumber": 3,
        "title": "Memory-Mapped I/O: C Pointer Dereferencing & `volatile`",
        "conceptBudget": {
          "primaryConcept": "MMIO Register Access in C",
          "supportingTerms": [
            "`*(volatile uint32_t*)0x40020014`",
            "Direct hardware control without OS kernel syscalls",
            "Preventing aggressive compiler dead-code elimination with `volatile`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b2-harvard-vs-von-neumann",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "C MMIO Register Pointer Macro",
            "codeSnippet": "#define GPIOA_ODR  (*(volatile uint32_t*)(0x40020000 + 0x14))\n\nvoid toggleLed(void) {\n  GPIOA_ODR ^= (1 << 5); // Toggles Pin 5 high/low directly in silicon!\n}",
            "lineNotes": {
              "1": "Casts hex memory address to volatile 32-bit integer pointer and dereferences it.",
              "4": "XOR toggles bit 5 in the hardware Output Data Register."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mmio_sim.js",
            "initialCode": "function simulateMmioWrite(baseAddr, offset, bit) {\n  const effectiveAddress = `0x${(parseInt(baseAddr, 16) + parseInt(offset, 16)).toString(16).toUpperCase()}`;\n  const bitmask = `0x${(1 << bit).toString(16).toUpperCase().padStart(4, '0')}`;\n  return `Writing bitmask ${bitmask} to MMIO hardware register at ${effectiveAddress}`;\n}\n\nconsole.log(simulateMmioWrite('0x40020000', '0x14', 5));",
            "expectedOutput": "Writing bitmask 0x0020 to MMIO hardware register at 0x40020014",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the effective MMIO register address for base `0x40020000` with offset `0x14`?",
          "expectedStringOutput": "0x40020014",
          "acceptableAnswers": [
            "0x40020014",
            "at 0x40020014"
          ],
          "primaryMisconceptionId": "MC_IOT_ARCH_HARVARD_VON_NEUMANN_FLASH_SRAM",
          "diagnosisMap": {
            "0x40020000": {
              "misconceptionId": "MC_IOT_ARCH_HARVARD_VON_NEUMANN_FLASH_SRAM",
              "errorExplanation": "0x40020000 + 0x14 = 0x40020014.",
              "recoveryPath": {
                "simplerExplanation": "Add offset: 0x40020014.",
                "guidedFixPrompt": "Type 0x40020014"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "GPIO Digital Output & LED Control",
    "overviewMetaphor": "A GPIO Output Pin is a microscopic electrical light switch inside the silicon chip: in Push-Pull mode, the chip connects the pin to either 3.3V (Logic HIGH: pushing current out) or 0V GND (Logic LOW: pulling current in); in Open-Drain mode, the chip can only connect to GND or disconnect completely (Float), requiring an external Pull-Up resistor to reach 3.3V (Safe for multi-voltage buses like I2C).",
    "blocks": [
      {
        "id": "iot-d2-b1-push-pull-vs-open-drain",
        "day": 2,
        "blockNumber": 1,
        "title": "GPIO Output Configurations: Push-Pull vs Open-Drain",
        "conceptBudget": {
          "primaryConcept": "Push-Pull vs Open-Drain",
          "supportingTerms": [
            "Push-Pull (High-side P-MOSFET + Low-side N-MOSFET: drives strong 3.3V and 0V)",
            "Open-Drain (Low-side N-MOSFET only: drives 0V or High-Z float)",
            "Current Limit Invariant ($20\\text{mA}$ max per pin)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b3-mmio-pointer-dereferencing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GPIO Output Modes Comparison",
              "boxes": [
                {
                  "label": "1. Push-Pull Output",
                  "value": "HIGH: Connects to 3.3V VDD | LOW: Connects to 0V GND -> Best for LEDs, relays, SPI clock",
                  "varType": "Push-Pull",
                  "isUpdated": true
                },
                {
                  "label": "2. Open-Drain Output",
                  "value": "HIGH: High-Z Float (Needs Pull-Up) | LOW: Connects to GND -> Best for I2C and shared wired-AND buses",
                  "varType": "Open-Drain",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gpio_mode_demo.js",
            "initialCode": "function evaluateOutputMode(useCase) {\n  if (useCase === 'I2C_BUS') return 'OPEN_DRAIN_WITH_PULLUP (Prevents bus short circuits)';\n  if (useCase === 'LED_INDICATOR') return 'PUSH_PULL_OUTPUT (Strong high/low drive)';\n  return 'STANDARD_GPIO';\n}\n\nconsole.log('Use Case I2C:', evaluateOutputMode('I2C_BUS'));\nconsole.log('Use Case LED:', evaluateOutputMode('LED_INDICATOR'));",
            "expectedOutput": "Use Case I2C: OPEN_DRAIN_WITH_PULLUP (Prevents bus short circuits)\nUse Case LED: PUSH_PULL_OUTPUT (Strong high/low drive)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which GPIO output mode is required for driving standard status LEDs directly?",
          "expectedStringOutput": "PUSH_PULL_OUTPUT (Strong high/low drive)",
          "acceptableAnswers": [
            "PUSH_PULL_OUTPUT (Strong high/low drive)",
            "PUSH_PULL_OUTPUT",
            "Push-Pull"
          ],
          "primaryMisconceptionId": "MC_IOT_GPIO_MODES_PULLUP_PULLDOWN_FLOATING",
          "diagnosisMap": {
            "OPEN_DRAIN": {
              "misconceptionId": "MC_IOT_GPIO_MODES_PULLUP_PULLDOWN_FLOATING",
              "errorExplanation": "LEDs need strong high/low drive provided by PUSH_PULL_OUTPUT.",
              "recoveryPath": {
                "simplerExplanation": "LEDs use PUSH_PULL_OUTPUT.",
                "guidedFixPrompt": "Type PUSH_PULL_OUTPUT (Strong high/low drive)"
              }
            }
          }
        }
      },
      {
        "id": "iot-d2-b2-bsrr-atomic-manipulation",
        "day": 2,
        "blockNumber": 2,
        "title": "Atomic Bit Set/Reset Registers (BSRR) vs RMW Race Conditions",
        "conceptBudget": {
          "primaryConcept": "BSRR Atomic Bit Operations",
          "supportingTerms": [
            "Read-Modify-Write (RMW: `ODR |= (1<<5)` has 3 CPU instructions; vulnerable to ISR corruption)",
            "BSRR Register: Single 32-bit atomic write (Bits 0-15 Set; Bits 16-31 Reset)",
            "Zero race condition guarantees"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d2-b1-push-pull-vs-open-drain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "ODR Read-Modify-Write vs Atomic BSRR Register Diff",
              "brokenCode": "// ❌ UNSAFE READ-MODIFY-WRITE (Vulnerable to interrupt corruption):\nGPIOA->ODR |= (1 << 5);\n// 1. CPU loads ODR into register r0\n// 2. Interrupt fires and modifies ODR Pin 6!\n// 3. CPU writes stale r0 back -> OVERWRITES & CLEARS Pin 6 unintentionally!",
              "fixedCode": "// ✅ 100% ATOMIC BSRR WRITE (Zero race conditions):\nGPIOA->BSRR = (1 << 5);       // Atomically SET Pin 5 (Low 16 bits)\nGPIOA->BSRR = (1 << (5 + 16)); // Atomically RESET Pin 5 (High 16 bits)",
              "errorLine": 3,
              "errorReason": "Non-atomic RMW cycles allow interrupts to corrupt adjacent GPIO pin states.",
              "fixExplanation": "Use the hardware atomic BSRR register to set/reset pins in 1 cycle."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bsrr_demo.js",
            "initialCode": "function generateBsrrCommand(pinNumber, action) {\n  if (action === 'SET') {\n    const val = 1 << pinNumber;\n    return `Set Pin ${pinNumber}: BSRR = 0x${val.toString(16).toUpperCase().padStart(8, '0')}`;\n  } else {\n    const val = 1 << (pinNumber + 16);\n    return `Reset Pin ${pinNumber}: BSRR = 0x${val.toString(16).toUpperCase().padStart(8, '0')}`;\n  }\n}\n\nconsole.log(generateBsrrCommand(5, 'SET'));\nconsole.log(generateBsrrCommand(5, 'RESET'));",
            "expectedOutput": "Set Pin 5: BSRR = 0x00000020\nReset Pin 5: BSRR = 0x00200000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 32-bit hex value is written to BSRR to atomically RESET Pin 5 ($1 \\ll 21$)?",
          "expectedStringOutput": "0x00200000",
          "acceptableAnswers": [
            "0x00200000",
            "BSRR = 0x00200000",
            "Reset Pin 5: BSRR = 0x00200000"
          ],
          "primaryMisconceptionId": "MC_IOT_GPIO_MODES_PULLUP_PULLDOWN_FLOATING",
          "diagnosisMap": {
            "0x00000020": {
              "misconceptionId": "MC_IOT_GPIO_MODES_PULLUP_PULLDOWN_FLOATING",
              "errorExplanation": "0x00000020 is for SET. Reset is in the upper 16 bits: 0x00200000.",
              "recoveryPath": {
                "simplerExplanation": "Reset uses upper 16 bits -> 0x00200000.",
                "guidedFixPrompt": "Type 0x00200000"
              }
            }
          }
        }
      },
      {
        "id": "iot-d2-b3-current-limiting-resistor-calc",
        "day": 2,
        "blockNumber": 3,
        "title": "LED Current Limiting Resistor Calculation (Ohm's Law)",
        "conceptBudget": {
          "primaryConcept": "Current Limiting Resistor Math",
          "supportingTerms": [
            "Ohm's Law: $R = \\frac{V_{\\text{DD}} - V_F}{I_F}$",
            "Forward Voltage ($V_F$: 2.0V Red, 3.2V Blue/White)",
            "Forward Current ($I_F$: 5mA to 15mA)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d2-b2-bsrr-atomic-manipulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "led_resistor_calc.js",
            "initialCode": "function calculateLedResistor(vSupply, vForward, iForwardMa) {\n  const rOhms = (vSupply - vForward) / (iForwardMa / 1000);\n  return {\n    supplyVoltage: vSupply,\n    ledForwardVoltage: vForward,\n    targetCurrentMa: iForwardMa,\n    recommendedResistorOhms: Math.round(rOhms)\n  };\n}\n\nconsole.log(JSON.stringify(calculateLedResistor(3.3, 2.0, 10))); // Red LED on 3.3V at 10mA",
            "expectedOutput": "{\"supplyVoltage\":3.3,\"ledForwardVoltage\":2,\"targetCurrentMa\":10,\"recommendedResistorOhms\":130}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What resistor value (in Ohms) is required for a Red LED ($V_F = 2.0\\text{V}$) on a 3.3V supply at 10mA: $(3.3 - 2.0) / 0.010$?",
          "expectedStringOutput": "130",
          "acceptableAnswers": [
            "130",
            "130 Ohms",
            "recommendedResistorOhms\":130"
          ],
          "primaryMisconceptionId": "MC_IOT_GPIO_MODES_PULLUP_PULLDOWN_FLOATING",
          "diagnosisMap": {
            "330": {
              "misconceptionId": "MC_IOT_GPIO_MODES_PULLUP_PULLDOWN_FLOATING",
              "errorExplanation": "(3.3 - 2.0) / 0.010 = 1.3 / 0.010 = 130 Ohms.",
              "recoveryPath": {
                "simplerExplanation": "(3.3 - 2.0) / 0.01 = 130.",
                "guidedFixPrompt": "Type 130"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "GPIO Digital Input & Pushbutton Debouncing",
    "overviewMetaphor": "A Mechanical Pushbutton is a diving board made of metal spring strips: when a human presses the button down, the metal contacts do not make a clean instant electrical connection; they slam, bounce, and vibrate against each other 5 to 20 times in 10 milliseconds (Switch Bounce); if a microcontroller reads the raw pin without debouncing, it counts 1 human button press as 15 separate rapid clicks (e.g. Dispensing 15 sodas at a vending machine!).",
    "blocks": [
      {
        "id": "iot-d3-b1-floating-pin-hazard-pullup",
        "day": 3,
        "blockNumber": 1,
        "title": "The Floating Pin Hazard & Internal Pull-Up/Down Resistors",
        "conceptBudget": {
          "primaryConcept": "Floating Pin Hazard",
          "supportingTerms": [
            "Floating Input (High impedance High-Z state picking up radio noise and electromagnetic interference)",
            "Internal Pull-Up Resistor ($40\\text{k}\\Omega$ to 3.3V)",
            "Internal Pull-Down Resistor ($40\\text{k}\\Omega$ to GND)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d2-b1-push-pull-vs-open-drain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Input Pin Pull Configurations",
              "boxes": [
                {
                  "label": "1. Floating Input (No Pull)",
                  "value": "State: Undefined random 0/1 oscillations from ambient static electricity -> High Hazard!",
                  "varType": "Unstable",
                  "isUpdated": false
                },
                {
                  "label": "2. Pull-Up Input (Active-Low button)",
                  "value": "State: Solid 3.3V HIGH when open; 0V LOW when button pressed to GND -> Standard Industry Practice",
                  "varType": "Stable Active-Low",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "floating_demo.js",
            "initialCode": "function evaluateInputState(pullMode, isButtonPressed) {\n  if (pullMode === 'FLOATING') return isButtonPressed ? 'LOW' : 'RANDOM_ELECTRICAL_NOISE_0_OR_1';\n  if (pullMode === 'PULL_UP') return isButtonPressed ? 'LOW (0V Button Pressed)' : 'HIGH (3.3V Pulled Up)';\n  return 'UNKNOWN';\n}\n\nconsole.log('Floating open:', evaluateInputState('FLOATING', false));\nconsole.log('Pull-up open:', evaluateInputState('PULL_UP', false));\nconsole.log('Pull-up pressed:', evaluateInputState('PULL_UP', true));",
            "expectedOutput": "Floating open: RANDOM_ELECTRICAL_NOISE_0_OR_1\nPull-up open: HIGH (3.3V Pulled Up)\nPull-up pressed: LOW (0V Button Pressed)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must a digital input pin NEVER be left in a floating state without a pull-up or pull-down resistor?",
          "options": [
            "Because high-impedance CMOS inputs act as miniature antennas that pick up electromagnetic static noise from the air, causing the CPU to register thousands of false random button presses",
            "Because floating pins cause the battery to instantly freeze",
            "Because pull-up resistors increase the MCU clock speed"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_GPIO_MODES_PULLUP_PULLDOWN_FLOATING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_GPIO_MODES_PULLUP_PULLDOWN_FLOATING",
              "errorExplanation": "Floating pins pick up ambient noise and cause erratic false triggers.",
              "recoveryPath": {
                "simplerExplanation": "Picks up electromagnetic noise causing false triggers.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d3-b2-mechanical-switch-bounce",
        "day": 3,
        "blockNumber": 2,
        "title": "Mechanical Switch Bounce Dynamics (5ms - 20ms Chatter)",
        "conceptBudget": {
          "primaryConcept": "Switch Contact Bounce",
          "supportingTerms": [
            "Physical spring elasticity in metal contacts",
            "Bounce duration: 5ms to 20ms",
            "RC Low-Pass Filter hardware debouncing vs Software debouncing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d3-b1-floating-pin-hazard-pullup",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Switch Bounce Oscillogram Representation",
            "codeSnippet": "// Physical button press timeline (10ms window):\n// [HIGH] ───┐ ┌─┐ ┌───┐ ┌─\n//           └──┘ └───┘ └─── [LOW (Steady pressed)]\n//           │◄── 10ms Bounce ──►│",
            "lineNotes": {
              "2": "Metal contacts oscillate between 1 and 0 multiple times before settling."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bounce_counter_sim.js",
            "initialCode": "function countRawVsDebounced(samples) {\n  let rawTransitions = 0;\n  for (let i = 1; i < samples.length; i++) {\n    if (samples[i] !== samples[i - 1]) rawTransitions++;\n  }\n  return {\n    totalRawSamples: samples.length,\n    rawFalseTriggersRegistered: rawTransitions,\n    debouncedTruePresses: 1\n  };\n}\n\nconst bounceStream = [1, 0, 1, 0, 0, 1, 0, 0, 0, 0]; // 1 press with bounce\nconsole.log(JSON.stringify(countRawVsDebounced(bounceStream)));",
            "expectedOutput": "{\"totalRawSamples\":10,\"rawFalseTriggersRegistered\":6,\"debouncedTruePresses\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many false trigger transitions did the raw un-debounced button stream register during a single physical button press?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "rawFalseTriggersRegistered\":6"
          ],
          "primaryMisconceptionId": "MC_IOT_DEBOUNCING_SWITCH_BOUNCE_RC_SOFTWARE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_DEBOUNCING_SWITCH_BOUNCE_RC_SOFTWARE",
              "errorExplanation": "The bouncy contact stream oscillated 6 times before settling.",
              "recoveryPath": {
                "simplerExplanation": "Registered 6 false transitions.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "iot-d3-b3-shift-register-integrator-debounce",
        "day": 3,
        "blockNumber": 3,
        "title": "Software Debouncing: 8-Bit Shift Register Integrator",
        "conceptBudget": {
          "primaryConcept": "Shift Register Debouncing Algorithm",
          "supportingTerms": [
            "Shift Register (`history = (history << 1) | sample`)",
            "Steady-State Check: `history == 0x00` (Pressed) or `history == 0xFF` (Released)",
            "Zero CPU blocking (Runs in 1ms timer tick)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d3-b2-mechanical-switch-bounce",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "shift_debounce_sim.js",
            "initialCode": "class Debouncer {\n  constructor() { this.history = 0xFF; }\n  update(sample) {\n    this.history = ((this.history << 1) | (sample & 1)) & 0xFF;\n    if (this.history === 0x00) return 'STEADY_PRESSED';\n    if (this.history === 0xFF) return 'STEADY_RELEASED';\n    return 'BOUNCING';\n  }\n}\n\nconst d = new Debouncer();\nconsole.log('Sample 0 (Bounce start):', d.update(0));\nconsole.log('Sample 1 (Bounce back):', d.update(1));\nfor (let i = 0; i < 7; i++) d.update(0);\nconsole.log('8 consecutive 0s:', d.update(0));",
            "expectedOutput": "Sample 0 (Bounce start): BOUNCING\nSample 1 (Bounce back): BOUNCING\n8 consecutive 0s: STEADY_PRESSED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state is returned after receiving 8 consecutive 0-bits in the shift register debouncer?",
          "expectedStringOutput": "STEADY_PRESSED",
          "acceptableAnswers": [
            "STEADY_PRESSED",
            "8 consecutive 0s: STEADY_PRESSED"
          ],
          "primaryMisconceptionId": "MC_IOT_DEBOUNCING_SWITCH_BOUNCE_RC_SOFTWARE",
          "diagnosisMap": {
            "BOUNCING": {
              "misconceptionId": "MC_IOT_DEBOUNCING_SWITCH_BOUNCE_RC_SOFTWARE",
              "errorExplanation": "8 consecutive 0s fills the 8-bit register with 0x00, confirming STEADY_PRESSED.",
              "recoveryPath": {
                "simplerExplanation": "8 zeros = 0x00 -> STEADY_PRESSED.",
                "guidedFixPrompt": "Type STEADY_PRESSED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Analog-to-Digital Conversion (ADC) & Voltage Dividers",
    "overviewMetaphor": "An ADC (Analog-to-Digital Converter) is a precision digital staircase measuring ocean tides: continuous ocean water level (Analog voltage 0V to 3.3V) rises smoothly; the ADC counts which exact step on a 4,096-step staircase (12-bit Resolution: $2^{12} = 4096$) the water reaches; each step corresponds to an exact voltage height of $0.8\\text{mV}$ (Quantization Step Size $V_{\\text{LSB}}$).",
    "blocks": [
      {
        "id": "iot-d4-b1-sar-adc-quantization-math",
        "day": 4,
        "blockNumber": 1,
        "title": "SAR ADC Architecture & Quantization Step Size ($V_{\\text{LSB}}$)",
        "conceptBudget": {
          "primaryConcept": "ADC Quantization Mathematics",
          "supportingTerms": [
            "Successive Approximation Register (SAR) ADC",
            "Resolution: $N = 10, 12, 16\\text{ bits}$",
            "Quantization Step: $V_{\\text{LSB}} = \\frac{V_{\\text{ref}}}{2^N}$",
            "Quantization Error: $\\pm \\frac{1}{2} V_{\\text{LSB}}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ADC Resolution Comparison (Vref = 3.3V)",
              "boxes": [
                {
                  "label": "10-bit ADC (Arduino Uno)",
                  "value": "Steps: 1,024 | LSB Step: 3.22 mV | Precision: Standard",
                  "varType": "10-bit",
                  "isUpdated": false
                },
                {
                  "label": "12-bit ADC (STM32 / ESP32)",
                  "value": "Steps: 4,096 | LSB Step: 0.805 mV (805 uV) | Precision: High Quality",
                  "varType": "12-bit",
                  "isUpdated": true
                },
                {
                  "label": "16-bit ADC (ADS1115)",
                  "value": "Steps: 65,536 | LSB Step: 0.050 mV (50 uV) | Precision: Laboratory Grade",
                  "varType": "16-bit",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "adc_calc_demo.js",
            "initialCode": "function calculateAdcLsb(bits, vRef = 3.3) {\n  const totalSteps = Math.pow(2, bits);\n  const lsbMv = (vRef / totalSteps) * 1000;\n  return {\n    bits,\n    totalSteps,\n    lsbMillivolts: Number(lsbMv.toFixed(3))\n  };\n}\n\nconsole.log('12-bit ADC LSB:', JSON.stringify(calculateAdcLsb(12, 3.3)));\nconsole.log('10-bit ADC LSB:', JSON.stringify(calculateAdcLsb(10, 3.3)));",
            "expectedOutput": "12-bit ADC LSB: {\"bits\":12,\"totalSteps\":4096,\"lsbMillivolts\":0.806}\n10-bit ADC LSB: {\"bits\":10,\"totalSteps\":1024,\"lsbMillivolts\":3.223}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total discrete quantization steps exist in a 12-bit ADC ($2^{12}$)?",
          "expectedStringOutput": "4096",
          "acceptableAnswers": [
            "4096",
            "4,096",
            "totalSteps\":4096"
          ],
          "primaryMisconceptionId": "MC_IOT_ADC_RESOLUTION_SAMPLING_QUANTIZATION",
          "diagnosisMap": {
            "1024": {
              "misconceptionId": "MC_IOT_ADC_RESOLUTION_SAMPLING_QUANTIZATION",
              "errorExplanation": "1024 is for 10-bit. 12-bit is 2^12 = 4,096.",
              "recoveryPath": {
                "simplerExplanation": "2^12 = 4096.",
                "guidedFixPrompt": "Type 4096"
              }
            }
          }
        }
      },
      {
        "id": "iot-d4-b2-voltage-divider-sensor-circuits",
        "day": 4,
        "blockNumber": 2,
        "title": "Resistive Sensors & Voltage Divider Circuits",
        "conceptBudget": {
          "primaryConcept": "Voltage Divider Circuit Theory",
          "supportingTerms": [
            "Thermistors (NTC temperature), Photoresistors (LDR light), Force sensors (FSR)",
            "Voltage Divider Equation: $V_{\\text{out}} = V_{\\text{in}} \\times \\frac{R_2}{R_1 + R_2}$",
            "Calculating variable sensor resistance from measured ADC voltage"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d4-b1-sar-adc-quantization-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Voltage Divider Circuit Diagram",
            "codeSnippet": "//  Vin (3.3V) ─── [ R1: Fixed 10k Resistor ] ──┬── Vout (To ADC Pin)\n//                                              │\n//                                      [ R2: NTC Thermistor ]\n//                                              │\n//                                             GND (0V)",
            "lineNotes": {
              "1": "Fixed reference resistor forms upper leg.",
              "3": "Variable sensor resistance forms lower leg."
            }
          },
          {
            "type": "runnable_code",
            "filename": "divider_calc_demo.js",
            "initialCode": "function calculateSensorResistance(vIn, vOut, rFixed) {\n  // Vout = Vin * (R_sensor / (R_fixed + R_sensor)) -> R_sensor = R_fixed * (Vout / (Vin - Vout))\n  const rSensor = rFixed * (vOut / (vIn - vOut));\n  return {\n    measuredVout: vOut,\n    calculatedSensorOhms: Math.round(rSensor)\n  };\n}\n\nconsole.log(JSON.stringify(calculateSensorResistance(3.3, 1.65, 10000)));",
            "expectedOutput": "{\"measuredVout\":1.65,\"calculatedSensorOhms\":10000}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the calculated sensor resistance when measured $V_{\\text{out}} = 1.65\\text{V}$ (half of $3.3\\text{V}$) with a $10\\text{k}\\Omega$ fixed resistor?",
          "expectedStringOutput": "10000",
          "acceptableAnswers": [
            "10000",
            "10000 Ohms",
            "10k",
            "calculatedSensorOhms\":10000"
          ],
          "primaryMisconceptionId": "MC_IOT_ADC_RESOLUTION_SAMPLING_QUANTIZATION",
          "diagnosisMap": {
            "5000": {
              "misconceptionId": "MC_IOT_ADC_RESOLUTION_SAMPLING_QUANTIZATION",
              "errorExplanation": "At exact half voltage (1.65V), R_sensor equals R_fixed (10,000 Ohms).",
              "recoveryPath": {
                "simplerExplanation": "Half voltage means equal resistance: 10000.",
                "guidedFixPrompt": "Type 10000"
              }
            }
          }
        }
      },
      {
        "id": "iot-d4-b3-adc-sampling-rate-nyquist",
        "day": 4,
        "blockNumber": 3,
        "title": "Sampling Time, Impedance & The Nyquist-Shannon Theorem",
        "conceptBudget": {
          "primaryConcept": "ADC Sampling Time & Nyquist Limit",
          "supportingTerms": [
            "Sample-and-Hold Capacitor ($C_{\\text{adc}} \\approx 5\\text{pF}$ charging time)",
            "Input Impedance Constraint ($R_{\\text{in}} < 10\\text{k}\\Omega$ to prevent voltage droop)",
            "Nyquist Criterion: $f_s \\ge 2 f_{\\max}$ (Sampling frequency must exceed twice highest signal frequency)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d4-b2-voltage-divider-sensor-circuits",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nyquist_demo.js",
            "initialCode": "function evaluateSamplingRate(signalFreqHz, samplingRateHz) {\n  const nyquistMin = signalFreqHz * 2;\n  const isAliasingPrevented = samplingRateHz >= nyquistMin;\n  return {\n    signalFrequencyHz: signalFreqHz,\n    minimumNyquistRateHz: nyquistMin,\n    actualSamplingRateHz: samplingRateHz,\n    isAliasingPrevented,\n    status: isAliasingPrevented ? 'ACCURATE_SIGNAL_RECONSTRUCTION' : 'SEVERE_ALIASING_DISTORTION'\n  };\n}\n\nconsole.log('Sampling 1kHz audio at 8kHz:', evaluateSamplingRate(1000, 8000).status);\nconsole.log('Sampling 1kHz audio at 1.5kHz:', evaluateSamplingRate(1000, 1500).status);",
            "expectedOutput": "Sampling 1kHz audio at 8kHz: ACCURATE_SIGNAL_RECONSTRUCTION\nSampling 1kHz audio at 1.5kHz: SEVERE_ALIASING_DISTORTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if an analog sensor signal is sampled below the Nyquist rate ($f_s < 2 f_{\\max}$)?",
          "options": [
            "High-frequency sensor vibrations fold back into lower frequencies (Aliasing Distortion), creating ghost false phantom signals that cannot be filtered out mathematically",
            "The microcontroller ADC hardware burns out",
            "The ADC clock reverses direction"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_ADC_RESOLUTION_SAMPLING_QUANTIZATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_ADC_RESOLUTION_SAMPLING_QUANTIZATION",
              "errorExplanation": "Sub-Nyquist sampling causes aliasing where high frequencies masquerade as low frequencies.",
              "recoveryPath": {
                "simplerExplanation": "Causes aliasing distortion and ghost phantom frequencies.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Precision Multi-Channel ADC Sensor Calibration & Signal Conditioning Engine",
    "overviewMetaphor": "Milestone 1 — The Precision Lab Scale: When raw analog sensors come out of the silicon foundry, each sensor has slight manufacturing imperfections (Sensor A reads 20.5°C at freezing 0°C: Offset Error $b$; Sensor B reads only 80°C in boiling 100°C water: Gain Error $m$); Milestone 1 builds the complete linear calibration and noise conditioning engine ($y = mx + b$) with moving average filtering, turning raw ADC noise into laboratory-grade measurements.",
    "blocks": [
      {
        "id": "iot-d5-b1-sensor-conditioning-pipeline",
        "day": 5,
        "blockNumber": 1,
        "title": "Multi-Stage Sensor Conditioning Architecture",
        "conceptBudget": {
          "primaryConcept": "Sensor Signal Conditioning Pipeline",
          "supportingTerms": [
            "Raw ADC Ingestion",
            "Oversampling & Rolling Average Noise Filter",
            "Two-Point Linear Calibration ($y = mx + b$)",
            "Engineering Units Conversion (e.g. °C, Pascals, Lux)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d4-b1-sar-adc-quantization-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Sensor Signal Conditioning Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "12-bit SAR ADC reads 16 raw oversampled values",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Moving Average Filter strips high-frequency electrical noise",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Apply Linear Calibration: PhysicalValue = (m * Voltage) + b",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Emit calibrated floating-point telemetry with threshold alert checks!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sensor_pipeline_demo.js",
            "initialCode": "function runSensorPipeline(samples, m = 100, b = -50, vRef = 3.3) {\n  const avg = samples.reduce((acc, v) => acc + v, 0) / samples.length;\n  const voltage = (avg / 4095) * vRef;\n  const physicalVal = (m * voltage) + b;\n  return {\n    rawAverageCount: Math.round(avg),\n    analogVoltage: Number(voltage.toFixed(3)),\n    calibratedTemperatureC: Number(physicalVal.toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(runSensorPipeline([2040, 2050, 2045, 2055])));",
            "expectedOutput": "{\"rawAverageCount\":2048,\"analogVoltage\":1.65,\"calibratedTemperatureC\":115}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What calibrated temperature (°C) is produced by the conditioning pipeline for the samples above?",
          "expectedStringOutput": "115",
          "acceptableAnswers": [
            "115",
            "115°C",
            "calibratedTemperatureC\":115"
          ],
          "primaryMisconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
              "errorExplanation": "100 * 1.65 + (-50) = 165 - 50 = 115°C.",
              "recoveryPath": {
                "simplerExplanation": "100 * 1.65 - 50 = 115.",
                "guidedFixPrompt": "Type 115"
              }
            }
          }
        }
      },
      {
        "id": "iot-d5-b2-oversampling-enob-gain",
        "day": 5,
        "blockNumber": 2,
        "title": "Oversampling & Decimation for Effective Number of Bits (ENOB)",
        "conceptBudget": {
          "primaryConcept": "Oversampling ENOB Gain",
          "supportingTerms": [
            "Oversampling Factor: $4^n$ samples for $n$ extra bits of resolution",
            "16 samples = +2 extra bits (Transforms 12-bit ADC into 14-bit resolution)",
            "Decimation by right-shifting $n$ bits"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d5-b1-sensor-conditioning-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "enob_demo.js",
            "initialCode": "function calculateOversamplingSamples(extraBits) {\n  const samplesNeeded = Math.pow(4, extraBits);\n  return `To gain +${extraBits} bits of ADC resolution, accumulate ${samplesNeeded} samples.`;\n}\n\nconsole.log(calculateOversamplingSamples(2));\nconsole.log(calculateOversamplingSamples(3));",
            "expectedOutput": "To gain +2 bits of ADC resolution, accumulate 16 samples.\nTo gain +3 bits of ADC resolution, accumulate 64 samples.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many samples must be accumulated to gain +2 bits of extra ADC resolution ($4^2$)?",
          "expectedStringOutput": "16",
          "acceptableAnswers": [
            "16",
            "16 samples",
            "accumulate 16 samples."
          ],
          "primaryMisconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
              "errorExplanation": "4^extraBits = 4^2 = 16 samples.",
              "recoveryPath": {
                "simplerExplanation": "4^2 = 16 samples.",
                "guidedFixPrompt": "Type 16"
              }
            }
          }
        }
      },
      {
        "id": "iot-d5-b3-milestone1-iot-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Precision ADC Sensor Calibration Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Precision Signal Pipeline Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d5-b2-oversampling-enob-gain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_iot_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Precision Multi-Channel ADC Sensor Calibration & Signal Conditioning Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Precision Multi-Channel ADC Sensor Calibration & Signal Conditioning Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Precision Multi-Channel ADC Sensor Calibration & Signal Conditioning Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Precision Multi-Channel ADC Sensor Calibration & Signal Conditioning Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Precision Multi-Channel ADC Sensor Calibration & Signal Conditioning Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Pulse-Width Modulation (PWM) & Motor / LED Dimming",
    "overviewMetaphor": "PWM (Pulse-Width Modulation) is flicking a light switch on and off 1,000 times per second: if the light is ON for 50% of the millisecond and OFF for 50% of the millisecond (50% Duty Cycle), human eyes and electric motors cannot see the rapid flickering; they perceive a smooth, constant 50% brightness or 50% motor speed, delivering variable power with near 100% electrical efficiency.",
    "blocks": [
      {
        "id": "iot-d6-b1-pwm-duty-cycle-math",
        "day": 6,
        "blockNumber": 1,
        "title": "PWM Waveform Anatomy: Frequency, Period & Duty Cycle",
        "conceptBudget": {
          "primaryConcept": "PWM Waveform Parameters",
          "supportingTerms": [
            "Period ($T = t_{\\text{on}} + t_{\\text{off}}$)",
            "Frequency ($f = 1/T$)",
            "Duty Cycle ($D = \\frac{t_{\\text{on}}}{T} \\times 100\\%$)",
            "Average Voltage ($V_{\\text{avg}} = V_{\\text{DD}} \\times D$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d2-b1-push-pull-vs-open-drain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PWM Pulse Timing Anatomy",
            "codeSnippet": "//  ┌──────────┐          ┌──────────┐\n//  │  t_on    │  t_off   │  t_on    │\n// ─┘          └──────────┘          └───\n//  │◄─────── Period T ──────►│",
            "lineNotes": {
              "1": "High duration represents t_on.",
              "4": "Total Period T = t_on + t_off."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pwm_calc_demo.js",
            "initialCode": "function calculatePwmAverage(vSupply, dutyPercent) {\n  const vAvg = vSupply * (dutyPercent / 100);\n  return {\n    supplyVoltage: vSupply,\n    dutyCyclePercent: dutyPercent,\n    effectiveAverageVoltage: Number(vAvg.toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(calculatePwmAverage(3.3, 25)));\nconsole.log(JSON.stringify(calculatePwmAverage(3.3, 75)));",
            "expectedOutput": "{\"supplyVoltage\":3.3,\"dutyCyclePercent\":25,\"effectiveAverageVoltage\":0.83}\n{\"supplyVoltage\":3.3,\"dutyCyclePercent\":75,\"effectiveAverageVoltage\":2.48}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the effective average output voltage of a 3.3V supply at 25% PWM duty cycle ($3.3 \\times 0.25$)?",
          "expectedStringOutput": "0.83",
          "acceptableAnswers": [
            "0.83",
            "0.83V",
            "effectiveAverageVoltage\":0.83"
          ],
          "primaryMisconceptionId": "MC_IOT_PWM_DUTY_CYCLE_FREQUENCY_TIMER",
          "diagnosisMap": {
            "1.65": {
              "misconceptionId": "MC_IOT_PWM_DUTY_CYCLE_FREQUENCY_TIMER",
              "errorExplanation": "1.65V is for 50% duty. 25% duty is 3.3 * 0.25 = 0.83V.",
              "recoveryPath": {
                "simplerExplanation": "3.3 * 0.25 = 0.83V.",
                "guidedFixPrompt": "Type 0.83"
              }
            }
          }
        }
      },
      {
        "id": "iot-d6-b2-hardware-timer-psc-arr-ccr",
        "day": 6,
        "blockNumber": 2,
        "title": "Hardware Timer Registers: Prescaler (PSC), ARR & CCR",
        "conceptBudget": {
          "primaryConcept": "Timer Register Equations",
          "supportingTerms": [
            "Prescaler Register (PSC: Divides main clock)",
            "Auto-Reload Register (ARR: Sets PWM period $T$)",
            "Capture/Compare Register (CCR: Sets duty cycle threshold $t_{\\text{on}}$)",
            "Timer equation: $f_{\\text{pwm}} = \\frac{f_{\\text{clk}}}{(\\text{PSC}+1) \\times (\\text{ARR}+1)}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d6-b1-pwm-duty-cycle-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Timer Register Roles",
              "boxes": [
                {
                  "label": "1. Prescaler (PSC = 83)",
                  "value": "84 MHz Main Clock / (83 + 1) = 1 MHz Timer Counter Clock",
                  "varType": "Clock Divider",
                  "isUpdated": false
                },
                {
                  "label": "2. Auto-Reload (ARR = 999)",
                  "value": "1 MHz / (999 + 1) = Exactly 1,000 Hz (1 kHz) PWM Frequency",
                  "varType": "Period Register",
                  "isUpdated": false
                },
                {
                  "label": "3. Capture/Compare (CCR = 250)",
                  "value": "250 / 1000 = Exactly 25.0% Duty Cycle",
                  "varType": "Duty Register",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "timer_reg_demo.js",
            "initialCode": "function solvePwmRegs(clkHz, targetFreqHz, dutyPercent) {\n  const psc = 83;\n  const timerTick = clkHz / (psc + 1);\n  const arr = Math.round(timerTick / targetFreqHz) - 1;\n  const ccr = Math.round((arr + 1) * (dutyPercent / 100));\n  return { psc, arr, ccr, targetFreqHz, dutyPercent };\n}\n\nconsole.log(JSON.stringify(solvePwmRegs(84000000, 1000, 25)));",
            "expectedOutput": "{\"psc\":83,\"arr\":999,\"ccr\":250,\"targetFreqHz\":1000,\"dutyPercent\":25}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value is loaded into the Capture/Compare Register (CCR) for a 25% duty cycle when ARR is 999 ($1000 \\times 0.25$)?",
          "expectedStringOutput": "250",
          "acceptableAnswers": [
            "250",
            "ccr\":250"
          ],
          "primaryMisconceptionId": "MC_IOT_PWM_DUTY_CYCLE_FREQUENCY_TIMER",
          "diagnosisMap": {
            "999": {
              "misconceptionId": "MC_IOT_PWM_DUTY_CYCLE_FREQUENCY_TIMER",
              "errorExplanation": "999 is ARR. CCR for 25% is (999 + 1) * 0.25 = 250.",
              "recoveryPath": {
                "simplerExplanation": "1000 * 0.25 = 250.",
                "guidedFixPrompt": "Type 250"
              }
            }
          }
        }
      },
      {
        "id": "iot-d6-b3-gamma-correction-led-dimming",
        "day": 6,
        "blockNumber": 3,
        "title": "LED Gamma Correction ($V_{\\text{perceived}} = V_{\\text{linear}}^{\\gamma}$)",
        "conceptBudget": {
          "primaryConcept": "LED Gamma Correction (Weber-Fechner Law)",
          "supportingTerms": [
            "Non-linear human eye perception ($gamma = 2.2$)",
            "Linear PWM looks completely saturated above 40%",
            "Lookup Table (LUT) gamma correction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d6-b2-hardware-timer-psc-arr-ccr",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gamma_lut_demo.js",
            "initialCode": "function calculateGammaPwm(inputPercent, gamma = 2.2) {\n  const normalized = inputPercent / 100;\n  const corrected = Math.pow(normalized, gamma) * 100;\n  return {\n    humanPerceivedBrightnessPercent: inputPercent,\n    requiredPwmDutyPercent: Number(corrected.toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(calculateGammaPwm(50))); // 50% perceived brightness",
            "expectedOutput": "{\"humanPerceivedBrightnessPercent\":50,\"requiredPwmDutyPercent\":21.76}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must firmware developers apply Gamma Correction ($gamma = 2.2$) when implementing smooth LED dimming?",
          "options": [
            "Because the human eye responds logarithmically to light intensity; setting a linear 50% PWM duty cycle looks almost 80% bright to human vision, requiring gamma curvature (21.7% duty) to appear genuinely half-bright",
            "Because LEDs blow up at 50% duty",
            "To save CPU power"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_PWM_DUTY_CYCLE_FREQUENCY_TIMER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_PWM_DUTY_CYCLE_FREQUENCY_TIMER",
              "errorExplanation": "Human eyes perceive light non-linearly, requiring gamma correction.",
              "recoveryPath": {
                "simplerExplanation": "Human vision is logarithmic; gamma maps to perceived linearity.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Hardware Interrupts, ISR Safety & Volatile Memory",
    "overviewMetaphor": "A Hardware Interrupt is an emergency red telephone ringing on the factory floor: the CPU worker pauses their routine conveyor-belt task in 12 nanoseconds, answers the telephone (Interrupt Service Routine: ISR), jots down the alert note on a shared magnetic whiteboard (`volatile` variable), hangs up the phone, and immediately resumes the conveyor-belt task; the Golden Rule of ISRs is: Never have a 10-minute coffee break on the emergency telephone (Keep ISRs under 5 microseconds!).",
    "blocks": [
      {
        "id": "iot-d7-b1-nvic-interrupt-vector-table",
        "day": 7,
        "blockNumber": 1,
        "title": "Nested Vectored Interrupt Controller (NVIC) & Vector Table",
        "conceptBudget": {
          "primaryConcept": "NVIC & Interrupt Vector Table (IVT)",
          "supportingTerms": [
            "Vector Table (Array of function pointers at address `0x08000000`)",
            "NVIC Hardware (Hardware priority grouping, nested preemption in 12 CPU cycles)",
            "Context Stacking: Automatic hardware push of `r0-r3, r12, LR, PC, xPSR`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ARM Cortex-M Interrupt Vector Table (IVT)",
              "boxes": [
                {
                  "label": "Vector 0 (0x00000000)",
                  "value": "Initial Main Stack Pointer (MSP) address",
                  "varType": "Stack Pointer",
                  "isUpdated": false
                },
                {
                  "label": "Vector 1 (0x00000004)",
                  "value": "Reset_Handler() -> Boots firmware entry point",
                  "varType": "Reset Vector",
                  "isUpdated": false
                },
                {
                  "label": "Vector 15 (0x0000003C)",
                  "value": "SysTick_Handler() -> RTOS 1ms timer tick",
                  "varType": "System Tick",
                  "isUpdated": true
                },
                {
                  "label": "Vector 40 (0x000000A0)",
                  "value": "USART1_IRQHandler() -> Serial byte received",
                  "varType": "Peripheral ISR",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nvic_priority_demo.js",
            "initialCode": "function evaluatePreemption(currentRunningIsrPriority, incomingInterruptPriority) {\n  // In ARM NVIC: LOWER numeric priority number = HIGHER urgency!\n  if (incomingInterruptPriority < currentRunningIsrPriority) {\n    return 'PREEMPTION_ALLOWED: PAUSE_CURRENT_ISR_AND_EXECUTE_INCOMING';\n  }\n  return 'QUEUED_PENDING: WAIT_FOR_CURRENT_ISR_TO_COMPLETE';\n}\n\nconsole.log('Running Priority 2, Incoming Priority 0:', evaluatePreemption(2, 0));\nconsole.log('Running Priority 1, Incoming Priority 3:', evaluatePreemption(1, 3));",
            "expectedOutput": "Running Priority 2, Incoming Priority 0: PREEMPTION_ALLOWED: PAUSE_CURRENT_ISR_AND_EXECUTE_INCOMING\nRunning Priority 1, Incoming Priority 3: QUEUED_PENDING: WAIT_FOR_CURRENT_ISR_TO_COMPLETE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can an incoming interrupt with Priority 0 preempt a currently executing ISR with Priority 2 in ARM Cortex-M?",
          "expectedStringOutput": "PREEMPTION_ALLOWED: PAUSE_CURRENT_ISR_AND_EXECUTE_INCOMING",
          "acceptableAnswers": [
            "PREEMPTION_ALLOWED: PAUSE_CURRENT_ISR_AND_EXECUTE_INCOMING",
            "Yes",
            "PREEMPTION_ALLOWED"
          ],
          "primaryMisconceptionId": "MC_IOT_INTERRUPTS_ISR_VOLATILE_CRITICAL_SECTION",
          "diagnosisMap": {
            "QUEUED": {
              "misconceptionId": "MC_IOT_INTERRUPTS_ISR_VOLATILE_CRITICAL_SECTION",
              "errorExplanation": "Lower numeric priority (0) is higher urgency in ARM, allowing preemption (PREEMPTION_ALLOWED).",
              "recoveryPath": {
                "simplerExplanation": "Priority 0 is higher urgency than 2 -> PREEMPTION_ALLOWED.",
                "guidedFixPrompt": "Type PREEMPTION_ALLOWED: PAUSE_CURRENT_ISR_AND_EXECUTE_INCOMING"
              }
            }
          }
        }
      },
      {
        "id": "iot-d7-b2-volatile-keyword-compiler-optimization",
        "day": 7,
        "blockNumber": 2,
        "title": "The `volatile` Keyword: Preventing Optimization Bugs",
        "conceptBudget": {
          "primaryConcept": "The `volatile` Type Qualifier",
          "supportingTerms": [
            "Compiler Optimization: Caching variables in CPU registers (`r4-r11`) across loops",
            "The ISR Asynchronous Bug: Main loop never sees variable updated by ISR",
            "`volatile uint8_t flag;`: Forcing memory reload on every single read"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d7-b1-nvic-interrupt-vector-table",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Non-Volatile ISR Variable Bug vs Volatile Fix",
              "brokenCode": "// ❌ NON-VOLATILE BUG:\nuint8_t buttonPressed = 0;\n\nvoid EXTI0_IRQHandler(void) { buttonPressed = 1; }\n\nint main(void) {\n  while (!buttonPressed); // Compiler optimizes to: while (1); -> INFINITE HANG!\n}",
              "fixedCode": "// ✅ 100% SAFE VOLATILE DECLARATION:\nvolatile uint8_t buttonPressed = 0;\n\nvoid EXTI0_IRQHandler(void) { buttonPressed = 1; }\n\nint main(void) {\n  while (!buttonPressed); // Compiler reloads buttonPressed from SRAM on every loop!\n}",
              "errorLine": 6,
              "errorReason": "Compiler assumes non-volatile variables in local loops never change, caching the value in a register.",
              "fixExplanation": "Qualify variables shared between ISRs and main thread with volatile."
            }
          },
          {
            "type": "runnable_code",
            "filename": "volatile_demo.js",
            "initialCode": "function evaluateCompilerBehavior(isVolatile) {\n  return isVolatile\n    ? { compilerAction: 'RELOAD_FROM_RAM_ON_EVERY_ACCESS', optimizesToInfiniteLoop: false }\n    : { compilerAction: 'CACHE_IN_CPU_REGISTER_FOREVER', optimizesToInfiniteLoop: true };\n}\n\nconsole.log('With volatile:', JSON.stringify(evaluateCompilerBehavior(true)));\nconsole.log('Without volatile:', JSON.stringify(evaluateCompilerBehavior(false)));",
            "expectedOutput": "With volatile: {\"compilerAction\":\"RELOAD_FROM_RAM_ON_EVERY_ACCESS\",\"optimizesToInfiniteLoop\":false}\nWithout volatile: {\"compilerAction\":\"CACHE_IN_CPU_REGISTER_FOREVER\",\"optimizesToInfiniteLoop\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must every variable shared between an Interrupt Service Routine (ISR) and the main `while(1)` loop be declared as `volatile`?",
          "options": [
            "Because the C compiler's optimizer assumes no asynchronous hardware events exist and will cache the variable in a CPU register, creating an infinite loop unless `volatile` forces it to reload from SRAM every time",
            "Because volatile encrypts variables in RAM",
            "Because C requires volatile for all integers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_INTERRUPTS_ISR_VOLATILE_CRITICAL_SECTION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_INTERRUPTS_ISR_VOLATILE_CRITICAL_SECTION",
              "errorExplanation": "volatile prevents the compiler from optimizing away memory reads in loops.",
              "recoveryPath": {
                "simplerExplanation": "Forces the compiler to read from RAM every time, preventing infinite loop bugs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d7-b3-critical-sections-atomic-blocks",
        "day": 7,
        "blockNumber": 3,
        "title": "Critical Sections & Atomic Blocks (`__disable_irq()` / `__enable_irq()`)",
        "conceptBudget": {
          "primaryConcept": "Critical Section Isolation",
          "supportingTerms": [
            "Atomic Operations: Single 32-bit aligned reads/writes are atomic",
            "Non-Atomic Multi-Byte Data structures (e.g. 64-bit timestamps, linked lists, ring buffers)",
            "Critical Section Guards: `__disable_irq()` (PRIMASK register)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d7-b2-volatile-keyword-compiler-optimization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Critical Section Guard in C",
            "codeSnippet": "uint32_t primask = __get_PRIMASK();\n__disable_irq(); // Enter Critical Section: Blocks all interrupts!\n\n// Safely read or modify 64-bit uint64_t timestamp or queue\ntimestamp_64 = shared_system_uptime_64;\n\n__set_PRIMASK(primask); // Exit Critical Section: Restores previous interrupt state",
            "lineNotes": {
              "2": "Blocks all configurable interrupts during multi-byte copy.",
              "7": "Restores PRIMASK state safely even if called inside nested functions."
            }
          },
          {
            "type": "runnable_code",
            "filename": "critical_section_sim.js",
            "initialCode": "function evaluateCriticalAccess(isProtected) {\n  return isProtected\n    ? 'CRITICAL_SECTION_PROTECTED: 64_BIT_COPY_COMPLETED_ATOMICALLY'\n    : 'UNPROTECTED_RACE_HAZARD: MID_BYTE_CORRUPTION_POSSIBLE';\n}\n\nconsole.log(evaluateCriticalAccess(true));",
            "expectedOutput": "CRITICAL_SECTION_PROTECTED: 64_BIT_COPY_COMPLETED_ATOMICALLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms safe multi-byte atomic reading inside a critical section?",
          "expectedStringOutput": "CRITICAL_SECTION_PROTECTED: 64_BIT_COPY_COMPLETED_ATOMICALLY",
          "acceptableAnswers": [
            "CRITICAL_SECTION_PROTECTED: 64_BIT_COPY_COMPLETED_ATOMICALLY",
            "CRITICAL_SECTION_PROTECTED"
          ],
          "primaryMisconceptionId": "MC_IOT_INTERRUPTS_ISR_VOLATILE_CRITICAL_SECTION",
          "diagnosisMap": {
            "HAZARD": {
              "misconceptionId": "MC_IOT_INTERRUPTS_ISR_VOLATILE_CRITICAL_SECTION",
              "errorExplanation": "Protected access yields CRITICAL_SECTION_PROTECTED: 64_BIT_COPY_COMPLETED_ATOMICALLY.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRITICAL_SECTION_PROTECTED.",
                "guidedFixPrompt": "Type CRITICAL_SECTION_PROTECTED: 64_BIT_COPY_COMPLETED_ATOMICALLY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Hardware Timers & Watchdog Timers (WDT)",
    "overviewMetaphor": "A Watchdog Timer (WDT) is a bomb disposal dead-man's switch: a separate hardware clock ticks down from 1,000 milliseconds to 0; every time the main firmware loop finishes its normal work cleanly, it must \"Kick / Feed the Dog\" (Reset the timer back to 1,000ms); if a pointer bug, deadlocked mutex, or electrostatic zap freezes the CPU in an infinite loop, the timer reaches 0 and triggers a hardware chip Reset in 1 millisecond, rebooting the device back to life.",
    "blocks": [
      {
        "id": "iot-d8-b1-independent-watchdog-iwdg",
        "day": 8,
        "blockNumber": 1,
        "title": "Independent Watchdog (IWDG): Dedicated LSI Clock Isolation",
        "conceptBudget": {
          "primaryConcept": "Independent Watchdog Timer (IWDG)",
          "supportingTerms": [
            "Dedicated Internal Low-Speed RC Oscillator (LSI 32kHz / 40kHz)",
            "Isolation Invariant: IWDG runs independently even if main High-Speed Crystal (HSE/PLL) fails",
            "Key Register (`0xAAAA` Reload / `0xCCCC` Start)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d7-b1-nvic-interrupt-vector-table",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Independent Watchdog vs Window Watchdog",
              "boxes": [
                {
                  "label": "1. Independent Watchdog (IWDG)",
                  "value": "Clock: Dedicated 32kHz LSI | Trigger: Resets on timeout ($> 1000\\text{ms}$) | Use: System freeze recovery",
                  "varType": "Failsafe Reset",
                  "isUpdated": true
                },
                {
                  "label": "2. Window Watchdog (WWDG)",
                  "value": "Clock: APB1 Bus Clock | Trigger: Resets if fed TOO EARLY or TOO LATE | Use: Errant fast loop detection",
                  "varType": "Window Guard",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "iwdg_sim_demo.js",
            "initialCode": "function evaluateIwdg(feedIntervalMs, timeoutMs = 1000) {\n  if (feedIntervalMs > timeoutMs) {\n    return 'IWDG_TIMEOUT_EXPIRED: TRIGGER_HARDWARE_SYSTEM_RESET';\n  }\n  return 'IWDG_FED_SUCCESSFULLY: SYSTEM_HEALTHY';\n}\n\nconsole.log('Fed at 200ms:', evaluateIwdg(200, 1000));\nconsole.log('Fed at 1200ms (Frozen Loop):', evaluateIwdg(1200, 1000));",
            "expectedOutput": "Fed at 200ms: IWDG_FED_SUCCESSFULLY: SYSTEM_HEALTHY\nFed at 1200ms (Frozen Loop): IWDG_TIMEOUT_EXPIRED: TRIGGER_HARDWARE_SYSTEM_RESET",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when the firmware freezes in an infinite loop and fails to feed the IWDG for 1,200ms (timeout = 1000ms)?",
          "expectedStringOutput": "IWDG_TIMEOUT_EXPIRED: TRIGGER_HARDWARE_SYSTEM_RESET",
          "acceptableAnswers": [
            "IWDG_TIMEOUT_EXPIRED: TRIGGER_HARDWARE_SYSTEM_RESET",
            "TRIGGER_HARDWARE_SYSTEM_RESET",
            "Hardware reset"
          ],
          "primaryMisconceptionId": "MC_IOT_TIMERS_WATCHDOG_WDT_PRESCALER",
          "diagnosisMap": {
            "HEALTHY": {
              "misconceptionId": "MC_IOT_TIMERS_WATCHDOG_WDT_PRESCALER",
              "errorExplanation": "Exceeding the timeout triggers IWDG_TIMEOUT_EXPIRED: TRIGGER_HARDWARE_SYSTEM_RESET.",
              "recoveryPath": {
                "simplerExplanation": "Triggers hardware reset: IWDG_TIMEOUT_EXPIRED: TRIGGER_HARDWARE_SYSTEM_RESET.",
                "guidedFixPrompt": "Type IWDG_TIMEOUT_EXPIRED: TRIGGER_HARDWARE_SYSTEM_RESET"
              }
            }
          }
        }
      },
      {
        "id": "iot-d8-b2-window-watchdog-wwdg-window",
        "day": 8,
        "blockNumber": 2,
        "title": "Window Watchdog (WWDG): Early & Late Feed Protection",
        "conceptBudget": {
          "primaryConcept": "Window Watchdog (WWDG)",
          "supportingTerms": [
            "Upper Window Limit & Lower Timeout Limit",
            "Detecting corrupted program counter running runaway fast loops",
            "Early Warning Interrupt (EWI) saving crash dump to Flash before reset"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d8-b1-independent-watchdog-iwdg",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "wwdg_window_demo.js",
            "initialCode": "function evaluateWwdg(feedTimeMs, windowMinMs = 50, windowMaxMs = 150) {\n  if (feedTimeMs < windowMinMs) return 'RESET_TRIGGERED: FED_TOO_EARLY (Runaway Fast Loop)';\n  if (feedTimeMs > windowMaxMs) return 'RESET_TRIGGERED: FED_TOO_LATE (Frozen Task)';\n  return 'WWDG_SUCCESS: FED_INSIDE_VALID_WINDOW';\n}\n\nconsole.log('Fed at 10ms:', evaluateWwdg(10));\nconsole.log('Fed at 100ms:', evaluateWwdg(100));\nconsole.log('Fed at 200ms:', evaluateWwdg(200));",
            "expectedOutput": "Fed at 10ms: RESET_TRIGGERED: FED_TOO_EARLY (Runaway Fast Loop)\nFed at 100ms: WWDG_SUCCESS: FED_INSIDE_VALID_WINDOW\nFed at 200ms: RESET_TRIGGERED: FED_TOO_LATE (Frozen Task)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What unique failure mode does a Window Watchdog (WWDG) catch that a standard Independent Watchdog (IWDG) misses?",
          "options": [
            "It catches errant runaway loops where a software bug or corrupted program counter rapidly feeds the watchdog too early before legitimate sensor tasks complete",
            "It detects if the battery is empty",
            "It checks internet speed"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_TIMERS_WATCHDOG_WDT_PRESCALER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_TIMERS_WATCHDOG_WDT_PRESCALER",
              "errorExplanation": "WWDG enforces a minimum feed window to catch runaway fast loop bugs.",
              "recoveryPath": {
                "simplerExplanation": "Enforces minimum feed window to catch early runaway loops.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d8-b3-watchdog-kick-placement",
        "day": 8,
        "blockNumber": 3,
        "title": "Best Practices: Watchdog Kick Placement in State Machines",
        "conceptBudget": {
          "primaryConcept": "Watchdog Kick Architecture",
          "supportingTerms": [
            "Anti-Pattern: Kicking watchdog inside timer ISR (Hides hung main loop!)",
            "Best Practice: Task Health Bitmask (Only kick WDT if all tasks check in)",
            "Preserving reset cause in RCC CSR register"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d8-b2-window-watchdog-wwdg-window",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Watchdog ISR Kick Anti-Pattern vs Task Bitmask Fix",
              "brokenCode": "// ❌ CATASTROPHIC ANTI-PATTERN:\nvoid SysTick_Handler(void) {\n  IWDG_ReloadCounter(); // Kicks watchdog every 1ms from timer interrupt!\n  // Even if main() is DEADLOCKED FOREVER, the timer ISR keeps feeding the watchdog,\n  // completely defeating the watchdog and bricking the device in the field!\n}",
              "fixedCode": "// ✅ PRODUCTION TASK HEALTH BITMASK:\nuint8_t taskHealthBits = 0;\n\nvoid checkAndFeedWatchdog(void) {\n  // Only kick watchdog if Task 1 (Sensors) AND Task 2 (Telemetry) checked in!\n  if (taskHealthBits == (TASK_SENSOR_OK | TASK_TELEMETRY_OK)) {\n    IWDG_ReloadCounter();\n    taskHealthBits = 0; // Reset health bits for next cycle\n  }\n}",
              "errorLine": 3,
              "errorReason": "Kicking watchdogs in timer interrupts keeps feeding the watchdog even if user tasks are deadlocked.",
              "fixExplanation": "Only feed the watchdog when all critical application tasks report healthy."
            }
          },
          {
            "type": "runnable_code",
            "filename": "wdt_bitmask_demo.js",
            "initialCode": "function evaluateTaskHealthFeed(task1Ok, task2Ok) {\n  const mask = (task1Ok ? 1 : 0) | (task2Ok ? 2 : 0);\n  if (mask === 3) return 'ALL_TASKS_HEALTHY: KICK_WATCHDOG';\n  return 'DEGRADED_TASK_DETECTED: WITHHOLD_FEED_ALLOW_WATCHDOG_RESET';\n}\n\nconsole.log('Both tasks OK:', evaluateTaskHealthFeed(true, true));\nconsole.log('Task 2 hung:', evaluateTaskHealthFeed(true, false));",
            "expectedOutput": "Both tasks OK: ALL_TASKS_HEALTHY: KICK_WATCHDOG\nBoth tasks hung: DEGRADED_TASK_DETECTED: WITHHOLD_FEED_ALLOW_WATCHDOG_RESET",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken when Task 2 hangs and fails to report healthy in the task health bitmask?",
          "expectedStringOutput": "DEGRADED_TASK_DETECTED: WITHHOLD_FEED_ALLOW_WATCHDOG_RESET",
          "acceptableAnswers": [
            "DEGRADED_TASK_DETECTED: WITHHOLD_FEED_ALLOW_WATCHDOG_RESET",
            "WITHHOLD_FEED_ALLOW_WATCHDOG_RESET",
            "Withhold feed"
          ],
          "primaryMisconceptionId": "MC_IOT_TIMERS_WATCHDOG_WDT_PRESCALER",
          "diagnosisMap": {
            "KICK": {
              "misconceptionId": "MC_IOT_TIMERS_WATCHDOG_WDT_PRESCALER",
              "errorExplanation": "A hung task withholds the feed to allow watchdog reset recovery (DEGRADED_TASK_DETECTED: WITHHOLD_FEED_ALLOW_WATCHDOG_RESET).",
              "recoveryPath": {
                "simplerExplanation": "Withholds feed to trigger recovery reset.",
                "guidedFixPrompt": "Type DEGRADED_TASK_DETECTED: WITHHOLD_FEED_ALLOW_WATCHDOG_RESET"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "UART Serial Communication & Frame Framing",
    "overviewMetaphor": "UART (Universal Asynchronous Receiver-Transmitter) is Morse code over a single wire without a shared metronome clock: the transmitter starts with a Start Bit (0) to wake up the receiver; both sides agree in advance to listen at the exact same rhythm (Baud Rate: 115,200 bits per second = 8.68 microseconds per bit); after 8 data bits and an optional Parity bit, a Stop Bit (1) returns the line to idle high.",
    "blocks": [
      {
        "id": "iot-d9-b1-uart-frame-structure",
        "day": 9,
        "blockNumber": 1,
        "title": "UART 8N1 Frame Anatomy & Timing Diagrams",
        "conceptBudget": {
          "primaryConcept": "UART 8N1 Frame Anatomy",
          "supportingTerms": [
            "Idle High (3.3V / RS-232 inverted)",
            "Start Bit (Transition High $\\to$ Low)",
            "8 Data Bits (LSB transmitted first)",
            "Stop Bit (1 or 2 bits High)",
            "Bit Time: $T_{\\text{bit}} = 1 / \\text{BaudRate}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d2-b1-push-pull-vs-open-drain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "UART 8N1 Serial Wire Oscillogram",
            "codeSnippet": "//  IDLE   START   D0  D1  D2  D3  D4  D5  D6  D7   STOP   IDLE\n//  ───┐   ┌───┐       ┌───┐           ┌───┐   ┌────────────\n//     └───┘   └───────┘   └───────────┘   └───┘\n//     │ 0 │    Character 'A' = 0x41 (01000001b)   │ 1  │",
            "lineNotes": {
              "1": "Start bit drops line to 0V.",
              "3": "Stop bit returns line to 3.3V."
            }
          },
          {
            "type": "runnable_code",
            "filename": "uart_timing_demo.js",
            "initialCode": "function calculateUartBitTime(baudRate) {\n  const bitTimeUs = (1 / baudRate) * 1e6;\n  const byteTimeUs = bitTimeUs * 10; // 1 start + 8 data + 1 stop = 10 bits\n  return {\n    baudRate,\n    bitTimeMicroseconds: Number(bitTimeUs.toFixed(2)),\n    byteTimeMicroseconds: Number(byteTimeUs.toFixed(2)),\n    maxBytesPerSecond: Math.floor(baudRate / 10)\n  };\n}\n\nconsole.log('115200 Baud:', JSON.stringify(calculateUartBitTime(115200)));\nconsole.log('9600 Baud:', JSON.stringify(calculateUartBitTime(9600)));",
            "expectedOutput": "115200 Baud: {\"baudRate\":115200,\"bitTimeMicroseconds\":8.68,\"byteTimeMicroseconds\":86.81,\"maxBytesPerSecond\":11520}\n9600 Baud: {\"baudRate\":9600,\"bitTimeMicroseconds\":104.17,\"byteTimeMicroseconds\":1041.67,\"maxBytesPerSecond\":960}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the duration (in microseconds) of a single bit at 115,200 baud?",
          "expectedStringOutput": "8.68",
          "acceptableAnswers": [
            "8.68",
            "8.68us",
            "8.68 microseconds",
            "bitTimeMicroseconds\":8.68"
          ],
          "primaryMisconceptionId": "MC_IOT_UART_BAUD_RATE_PARITY_FRAMING",
          "diagnosisMap": {
            "104": {
              "misconceptionId": "MC_IOT_UART_BAUD_RATE_PARITY_FRAMING",
              "errorExplanation": "104us is for 9600 baud. 115200 baud is 8.68us.",
              "recoveryPath": {
                "simplerExplanation": "1 / 115200 = 8.68 microseconds.",
                "guidedFixPrompt": "Type 8.68"
              }
            }
          }
        }
      },
      {
        "id": "iot-d9-b2-baud-rate-clock-drift-tolerance",
        "day": 9,
        "blockNumber": 2,
        "title": "Baud Rate Generators & Maximum Clock Drift ($pm 2.5\\%$)",
        "conceptBudget": {
          "primaryConcept": "Baud Rate Clock Drift Margin",
          "supportingTerms": [
            "Over-Sampling (16x clock samples center of each bit at 8th tick)",
            "Baud Rate Error equation: $\\text{Error}\\% = \\frac{|\\text{Actual} - \\text{Target}|}{\\text{Target}} \\times 100\\%$",
            "Tolerance Limit: $\\le \\pm 2.5\\%$ (Cumulative drift over 10 bits causes framing errors)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d9-b1-uart-frame-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "baud_error_demo.js",
            "initialCode": "function evaluateBaudError(targetBaud, actualBaud) {\n  const errorPercent = (Math.abs(actualBaud - targetBaud) / targetBaud) * 100;\n  const isValid = errorPercent <= 2.5;\n  return {\n    targetBaud,\n    actualBaud,\n    errorPercent: Number(errorPercent.toFixed(2)),\n    status: isValid ? 'BAUD_RATE_WITHIN_TOLERANCE' : 'FRAMING_ERROR_CORRUPT_BYTES'\n  };\n}\n\nconsole.log('Error 1.2%:', evaluateBaudError(115200, 116582).status);\nconsole.log('Error 3.8%:', evaluateBaudError(115200, 119577).status);",
            "expectedOutput": "Error 1.2%: BAUD_RATE_WITHIN_TOLERANCE\nError 3.8%: FRAMING_ERROR_CORRUPT_BYTES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does UART communication fail with Framing Errors if the transmitter and receiver clock frequencies differ by more than $\\pm 2.5\\%$?",
          "options": [
            "Because UART is asynchronous without a shared clock wire; cumulative timing drift causes the receiver's 16x sampling clock to drift into adjacent bit boundaries by the time it reaches the Stop bit",
            "Because UART cables catch fire if clocks drift",
            "Because baud rates must be prime numbers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_UART_BAUD_RATE_PARITY_FRAMING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_UART_BAUD_RATE_PARITY_FRAMING",
              "errorExplanation": "Timing errors accumulate across 10 bits, causing sampling misalignment.",
              "recoveryPath": {
                "simplerExplanation": "Accumulated timing drift samples outside bit centers.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d9-b3-parity-and-framing-errors",
        "day": 9,
        "blockNumber": 3,
        "title": "Parity Checking (Even/Odd) & Hardware Error Flags",
        "conceptBudget": {
          "primaryConcept": "UART Parity & Error Flags",
          "supportingTerms": [
            "Even Parity (Parity bit set to make total 1-bits even)",
            "Odd Parity",
            "Framing Error Flag (FE: Stop bit read as 0)",
            "Overrun Error Flag (ORE: New byte received before CPU reads previous byte)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d9-b2-baud-rate-clock-drift-tolerance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "parity_calc_demo.js",
            "initialCode": "function calculateParityBit(byteVal, mode = 'EVEN') {\n  let ones = 0;\n  for (let i = 0; i < 8; i++) {\n    if (byteVal & (1 << i)) ones++;\n  }\n  const isEven = (ones % 2 === 0);\n  return mode === 'EVEN' ? (isEven ? 0 : 1) : (isEven ? 1 : 0);\n}\n\nconsole.log('Even Parity for 0x41 (01000001b, two 1s):', calculateParityBit(0x41, 'EVEN'));\nconsole.log('Even Parity for 0x43 (01000011b, three 1s):', calculateParityBit(0x43, 'EVEN'));",
            "expectedOutput": "Even Parity for 0x41 (01000001b, two 1s): 0\nEven Parity for 0x43 (01000011b, three 1s): 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Even Parity bit value for byte `0x43` (having three 1-bits)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "Even Parity for 0x43 (01000011b, three 1s): 1"
          ],
          "primaryMisconceptionId": "MC_IOT_UART_BAUD_RATE_PARITY_FRAMING",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_IOT_UART_BAUD_RATE_PARITY_FRAMING",
              "errorExplanation": "Three 1s needs parity bit = 1 to make total 1s even (4).",
              "recoveryPath": {
                "simplerExplanation": "3 ones needs 1 to become even (4).",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "I2C Serial Bus: Master-Slave Addressing & Pull-Ups",
    "overviewMetaphor": "I2C (Inter-Integrated Circuit) is a telephone party line with 100 extension numbers: only 2 wires connect all devices (SDA: Speech Data & SCL: Metronome Clock); both wires are pulled up to 3.3V by shared resistors; when Master wants to talk to Extension 42 (MPU-6050 accelerometer), Master shouts \"0x68 + Write!\" over SDA; Extension 42 pulls the line down for 1 clock tick to say \"ACK: I am here!\", and all other 99 devices stay completely silent.",
    "blocks": [
      {
        "id": "iot-d10-b1-i2c-open-drain-bus-pullups",
        "day": 10,
        "blockNumber": 1,
        "title": "I2C Hardware Architecture: Open-Drain SDA/SCL & Pull-Up Resistors",
        "conceptBudget": {
          "primaryConcept": "I2C Open-Drain Bus Architecture",
          "supportingTerms": [
            "Serial Data (SDA) & Serial Clock (SCL)",
            "Open-Drain / Open-Collector drivers (Wired-AND topology)",
            "Pull-Up Resistors ($4.7\\text{k}\\Omega$ to 3.3V)",
            "Bus Capacitance Limit ($400\\text{pF}$ max)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d2-b1-push-pull-vs-open-drain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "I2C Speed Standards",
              "boxes": [
                {
                  "label": "1. Standard Mode (Sm)",
                  "value": "Clock: 100 kHz | Bit Time: 10 us | Pull-ups: 4.7k - 10k",
                  "varType": "Standard",
                  "isUpdated": false
                },
                {
                  "label": "2. Fast Mode (Fm)",
                  "value": "Clock: 400 kHz | Bit Time: 2.5 us | Pull-ups: 2.2k - 4.7k",
                  "varType": "Fast",
                  "isUpdated": true
                },
                {
                  "label": "3. Fast Mode Plus (Fm+)",
                  "value": "Clock: 1 MHz | Bit Time: 1.0 us | Pull-ups: 1k - 2k",
                  "varType": "High Speed",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "i2c_pullup_calc.js",
            "initialCode": "function evaluateI2cPullup(busCapacitancePf, speedMode = 'FAST_400KHZ') {\n  const maxRiseTimeNs = (speedMode === 'FAST_400KHZ') ? 300 : 1000;\n  const maxResistorOhms = (maxRiseTimeNs * 1e-9) / (0.8473 * busCapacitancePf * 1e-12);\n  return {\n    busCapacitancePf,\n    maxAllowedPullupOhms: Math.round(maxResistorOhms),\n    recommendedStandardResistor: Math.round(maxResistorOhms / 1000) * 1000\n  };\n}\n\nconsole.log(JSON.stringify(evaluateI2cPullup(100, 'FAST_400KHZ')));",
            "expectedOutput": "{\"busCapacitancePf\":100,\"maxAllowedPullupOhms\":3541,\"recommendedStandardResistor\":4000}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must I2C SDA and SCL lines be configured in Open-Drain mode with external pull-up resistors instead of Push-Pull?",
          "options": [
            "Because multiple master and slave chips share the exact same wire; if two chips drove opposite Push-Pull voltages (one driving 3.3V and one driving 0V), it would create a dead short-circuit and burn out the silicon",
            "Because pull-up resistors convert AC to DC",
            "Because Open-Drain mode increases wire length to 10 kilometers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_I2C_ADDRESSING_ACK_NACK_PULLUPS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_I2C_ADDRESSING_ACK_NACK_PULLUPS",
              "errorExplanation": "Open-drain prevents short-circuits when multiple nodes share the wire.",
              "recoveryPath": {
                "simplerExplanation": "Prevents electrical short-circuits on a shared multi-device wire.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d10-b2-i2c-start-stop-ack-nack",
        "day": 10,
        "blockNumber": 2,
        "title": "I2C Protocol Framing: START, STOP, ACK & NACK",
        "conceptBudget": {
          "primaryConcept": "I2C Protocol Framing",
          "supportingTerms": [
            "START Condition (SDA transitions High $\\to$ Low while SCL is High)",
            "STOP Condition (SDA transitions Low $\\to$ High while SCL is High)",
            "ACK Bit (Receiver pulls SDA Low during 9th clock pulse)",
            "NACK Bit (SDA left High during 9th clock pulse)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d10-b1-i2c-open-drain-bus-pullups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "I2C Start & Stop Conditions Anatomy",
            "codeSnippet": "//  START CONDITION:           DATA BIT TRANSITIONS:          STOP CONDITION:\n//  SCL: ────────┐             SCL: ───┐   ┌───               SCL: ────────┐\n//               └──────               └───┘                               └──────\n//  SDA: ───┐                  SDA: ───(Stable)───            SDA:       ┌──────\n//          └───────────                                           ──────┘",
            "lineNotes": {
              "1": "START: SDA falling edge while SCL is HIGH.",
              "3": "Data bits must remain completely stable while SCL is HIGH.",
              "4": "STOP: SDA rising edge while SCL is HIGH."
            }
          },
          {
            "type": "runnable_code",
            "filename": "i2c_frame_sim.js",
            "initialCode": "function evaluateAckStatus(sdaSampleAt9thClock) {\n  return sdaSampleAt9thClock === 0\n    ? 'ACK_RECEIVED: SLAVE_ACKNOWLEDGED_BYTE'\n    : 'NACK_RECEIVED: SLAVE_REJECTED_OR_ABSENT';\n}\n\nconsole.log('SDA Low at Clock 9:', evaluateAckStatus(0));\nconsole.log('SDA High at Clock 9:', evaluateAckStatus(1));",
            "expectedOutput": "SDA Low at Clock 9: ACK_RECEIVED: SLAVE_ACKNOWLEDGED_BYTE\nSDA High at Clock 9: NACK_RECEIVED: SLAVE_REJECTED_OR_ABSENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is confirmed when SDA is pulled LOW (0) during the 9th SCL clock pulse?",
          "expectedStringOutput": "ACK_RECEIVED: SLAVE_ACKNOWLEDGED_BYTE",
          "acceptableAnswers": [
            "ACK_RECEIVED: SLAVE_ACKNOWLEDGED_BYTE",
            "ACK_RECEIVED",
            "SDA Low at Clock 9: ACK_RECEIVED: SLAVE_ACKNOWLEDGED_BYTE"
          ],
          "primaryMisconceptionId": "MC_IOT_I2C_ADDRESSING_ACK_NACK_PULLUPS",
          "diagnosisMap": {
            "NACK": {
              "misconceptionId": "MC_IOT_I2C_ADDRESSING_ACK_NACK_PULLUPS",
              "errorExplanation": "SDA Low at the 9th clock pulse is an ACK.",
              "recoveryPath": {
                "simplerExplanation": "Low on 9th clock = ACK_RECEIVED.",
                "guidedFixPrompt": "Type ACK_RECEIVED: SLAVE_ACKNOWLEDGED_BYTE"
              }
            }
          }
        }
      },
      {
        "id": "iot-d10-b3-clock-stretching-and-repeated-start",
        "day": 10,
        "blockNumber": 3,
        "title": "I2C Clock Stretching & REPEATED START Sequences",
        "conceptBudget": {
          "primaryConcept": "Clock Stretching & Repeated Start",
          "supportingTerms": [
            "Clock Stretching (Slave holds SCL Low to pause Master while processing ADC/sensors)",
            "REPEATED START (Issuing new START without releasing bus with STOP to perform atomic register reads)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d10-b2-i2c-start-stop-ack-nack",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "repeated_start_demo.js",
            "initialCode": "function explainRepeatedStart() {\n  return 'START -> [Addr+W] -> [RegOffset] -> REPEATED_START -> [Addr+R] -> [DataByte] -> NACK -> STOP';\n}\n\nconsole.log(explainRepeatedStart());",
            "expectedOutput": "START -> [Addr+W] -> [RegOffset] -> REPEATED_START -> [Addr+R] -> [DataByte] -> NACK -> STOP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is a REPEATED START sequence used when reading a specific sensor register over I2C?",
          "options": [
            "It switches the communication direction from Write (specifying register pointer) to Read without generating a STOP condition, preventing other multi-master devices from intercepting the bus in between",
            "Because I2C chips crash if a STOP condition is ever sent",
            "To reset the microcontroller CPU"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_I2C_ADDRESSING_ACK_NACK_PULLUPS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_I2C_ADDRESSING_ACK_NACK_PULLUPS",
              "errorExplanation": "Repeated start prevents other masters from hijacking the bus between write and read.",
              "recoveryPath": {
                "simplerExplanation": "Maintains bus control while switching from write to read.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "SPI (Serial Peripheral Interface): High-Speed Full-Duplex Bus",
    "overviewMetaphor": "SPI (Serial Peripheral Interface) is a high-speed conveyor belt loop between two workers: Master and Slave both hold 8-bit shift registers connected in a continuous circle; on every single clock tick from Master (SCK), Master pushes 1 bit out on MOSI (Master Out Slave In) while simultaneously sucking 1 bit in on MISO (Master In Slave Out), transferring an entire 8-bit byte in both directions at 50 Megabits per second (Full Duplex!).",
    "blocks": [
      {
        "id": "iot-d11-b1-spi-full-duplex-shift-registers",
        "day": 11,
        "blockNumber": 1,
        "title": "SPI 4-Wire Architecture & Full-Duplex Shift Registers",
        "conceptBudget": {
          "primaryConcept": "SPI 4-Wire Architecture",
          "supportingTerms": [
            "MOSI (Master Out Slave In) & MISO (Master In Slave Out)",
            "SCK (Serial Clock: Driven exclusively by Master up to 50MHz+)",
            "CS / NSS (Chip Select: Active Low to enable specific slave)",
            "Full-Duplex simultaneous data exchange"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d10-b1-i2c-open-drain-bus-pullups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SPI vs I2C Comparison",
              "boxes": [
                {
                  "label": "1. SPI (4 Wires)",
                  "value": "Speed: 10 - 80 MHz | Duplex: Full Duplex | Addressing: Dedicated CS wire per slave",
                  "varType": "High Speed",
                  "isUpdated": true
                },
                {
                  "label": "2. I2C (2 Wires)",
                  "value": "Speed: 100 kHz - 1 MHz | Duplex: Half Duplex | Addressing: In-band 7-bit software addresses",
                  "varType": "Low Pin Count",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "spi_exchange_sim.js",
            "initialCode": "function simulateSpiFullDuplex(masterByte, slaveByte) {\n  return {\n    masterSentByte: `0x${masterByte.toString(16).toUpperCase()}`,\n    masterReceivedByte: `0x${slaveByte.toString(16).toUpperCase()}`,\n    slaveSentByte: `0x${slaveByte.toString(16).toUpperCase()}`,\n    slaveReceivedByte: `0x${masterByte.toString(16).toUpperCase()}`,\n    isFullDuplex: true\n  };\n}\n\nconsole.log(JSON.stringify(simulateSpiFullDuplex(0x9F, 0x12))); // Master sends ReadID command, receives 0x12",
            "expectedOutput": "{\"masterSentByte\":\"0x9F\",\"masterReceivedByte\":\"0x12\",\"slaveSentByte\":\"0x12\",\"slaveReceivedByte\":\"0x9F\",\"isFullDuplex\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What byte is received by the Master during the SPI full-duplex exchange when sending `0x9F` to a slave holding `0x12`?",
          "expectedStringOutput": "0x12",
          "acceptableAnswers": [
            "0x12",
            "masterReceivedByte\":\"0x12\""
          ],
          "primaryMisconceptionId": "MC_IOT_SPI_CPOL_CPHA_FULL_DUPLEX",
          "diagnosisMap": {
            "0x9F": {
              "misconceptionId": "MC_IOT_SPI_CPOL_CPHA_FULL_DUPLEX",
              "errorExplanation": "0x9F is what the master sent. The master receives the slave's register byte (0x12).",
              "recoveryPath": {
                "simplerExplanation": "Master receives slave's byte -> 0x12.",
                "guidedFixPrompt": "Type 0x12"
              }
            }
          }
        }
      },
      {
        "id": "iot-d11-b2-cpol-cpha-modes-matrix",
        "day": 11,
        "blockNumber": 2,
        "title": "The 4 SPI Modes: Clock Polarity (CPOL) & Clock Phase (CPHA)",
        "conceptBudget": {
          "primaryConcept": "SPI CPOL and CPHA Modes",
          "supportingTerms": [
            "CPOL=0 (Clock Idles Low 0V) vs CPOL=1 (Clock Idles High 3.3V)",
            "CPHA=0 (Sample on 1st edge) vs CPHA=1 (Sample on 2nd edge)",
            "Mode 0 (0,0), Mode 1 (0,1), Mode 2 (1,0), Mode 3 (1,1)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d11-b1-spi-full-duplex-shift-registers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SPI 4 Modes Matrix",
            "codeSnippet": "// Mode 0 (CPOL=0, CPHA=0): Idle Low,  Sample on Leading Rising Edge\n// Mode 1 (CPOL=0, CPHA=1): Idle Low,  Sample on Trailing Falling Edge\n// Mode 2 (CPOL=1, CPHA=0): Idle High, Sample on Leading Falling Edge\n// Mode 3 (CPOL=1, CPHA=1): Idle High, Sample on Trailing Rising Edge",
            "lineNotes": {
              "1": "Standard for SD cards, SPI Flash, and 90% of sensors."
            }
          },
          {
            "type": "runnable_code",
            "filename": "spi_mode_picker.js",
            "initialCode": "function getSpiModeNumber(cpol, cpha) {\n  return `SPI Mode ${(cpol << 1) | cpha}`;\n}\n\nconsole.log('CPOL=0, CPHA=0 ->', getSpiModeNumber(0, 0));\nconsole.log('CPOL=1, CPHA=1 ->', getSpiModeNumber(1, 1));",
            "expectedOutput": "CPOL=0, CPHA=0 -> SPI Mode 0\nCPOL=1, CPHA=1 -> SPI Mode 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What SPI Mode corresponds to CPOL=1 and CPHA=1?",
          "expectedStringOutput": "SPI Mode 3",
          "acceptableAnswers": [
            "SPI Mode 3",
            "Mode 3",
            "3"
          ],
          "primaryMisconceptionId": "MC_IOT_SPI_CPOL_CPHA_FULL_DUPLEX",
          "diagnosisMap": {
            "Mode 0": {
              "misconceptionId": "MC_IOT_SPI_CPOL_CPHA_FULL_DUPLEX",
              "errorExplanation": "CPOL=1, CPHA=1 corresponds to SPI Mode 3 (1<<1 | 1 = 3).",
              "recoveryPath": {
                "simplerExplanation": "(1 << 1) | 1 = 3 -> SPI Mode 3.",
                "guidedFixPrompt": "Type SPI Mode 3"
              }
            }
          }
        }
      },
      {
        "id": "iot-d11-b3-daisy-chain-vs-independent-cs",
        "day": 11,
        "blockNumber": 3,
        "title": "Multi-Slave Topologies: Independent Chip-Select vs Daisy-Chaining",
        "conceptBudget": {
          "primaryConcept": "SPI Multi-Slave Topologies",
          "supportingTerms": [
            "Independent CS (Dedicated GPIO wire per slave: $N$ slaves = $N$ CS pins)",
            "Daisy-Chain (Shift register cascading: Slave 1 MISO $\\to$ Slave 2 MOSI; single shared CS)",
            "LED Matrix drivers (MAX7219)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d11-b2-cpol-cpha-modes-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "daisy_chain_demo.js",
            "initialCode": "function calculateSpiPinCount(numSlaves, topology = 'INDEPENDENT_CS') {\n  return topology === 'INDEPENDENT_CS'\n    ? 3 + numSlaves // SCK + MOSI + MISO + N CS pins\n    : 4; // SCK + MOSI + MISO + 1 shared CS pin!\n}\n\nconsole.log('8 Slaves with Independent CS:', calculateSpiPinCount(8, 'INDEPENDENT_CS'), 'pins');\nconsole.log('8 Slaves with Daisy Chain:', calculateSpiPinCount(8, 'DAISY_CHAIN'), 'pins');",
            "expectedOutput": "8 Slaves with Independent CS: 11 pins\n8 Slaves with Daisy Chain: 4 pins",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total microcontroller pins are required to connect 8 SPI slaves using a Daisy-Chain topology?",
          "expectedStringOutput": "4 pins",
          "acceptableAnswers": [
            "4 pins",
            "4",
            "8 Slaves with Daisy Chain: 4 pins"
          ],
          "primaryMisconceptionId": "MC_IOT_SPI_CPOL_CPHA_FULL_DUPLEX",
          "diagnosisMap": {
            "11": {
              "misconceptionId": "MC_IOT_SPI_CPOL_CPHA_FULL_DUPLEX",
              "errorExplanation": "11 pins is for Independent CS. Daisy chaining shares 1 CS pin, requiring only 4 pins total.",
              "recoveryPath": {
                "simplerExplanation": "Daisy chain needs only 4 pins.",
                "guidedFixPrompt": "Type 4 pins"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Real-Time Operating Systems (RTOS): Tasks & Preemptive Schedulers",
    "overviewMetaphor": "An RTOS (Real-Time Operating System) is an air traffic controller juggling multiple airplane tasks: instead of a single `while(1)` super-loop that gets frozen whenever a sensor is slow (Spaghetti code!), FreeRTOS gives each task its own private Stack and Priority; every 1 millisecond, the SysTick timer interrupts the CPU; if the high-priority Motor Task needs to run, the RTOS preempts the low-priority Display Task in 2 microseconds, guaranteeing deterministic real-time deadlines.",
    "blocks": [
      {
        "id": "iot-d12-b1-super-loop-vs-rtos-multitasking",
        "day": 12,
        "blockNumber": 1,
        "title": "Super-Loop Architecture vs RTOS Preemptive Multitasking",
        "conceptBudget": {
          "primaryConcept": "RTOS Multitasking Architecture",
          "supportingTerms": [
            "Bare-metal `while(1)` Super-Loop (Non-deterministic latency; any slow `delay()` hangs all tasks)",
            "RTOS Tasks & Task Control Blocks (TCB)",
            "SysTick 1ms Hardware Timer Interrupt & Context Switching"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d7-b1-nvic-interrupt-vector-table",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Bare-Metal Super-Loop vs FreeRTOS Multitasking",
              "boxes": [
                {
                  "label": "1. Bare-Metal Super-Loop",
                  "value": "Task 1 (Sensors) -> Task 2 (100ms delay!) -> Task 3 (Motor control misses deadline!)",
                  "varType": "Blocking Lag",
                  "isUpdated": false
                },
                {
                  "label": "2. FreeRTOS Preemptive Tasks",
                  "value": "Motor Task (Priority 4) instantly preempts Display Task (Priority 1) in 2 us -> 100% Deterministic",
                  "varType": "Real-Time RTOS",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rtos_task_demo.js",
            "initialCode": "function evaluateRtosSwitch(runningPriority, readyTaskPriority) {\n  if (readyTaskPriority > runningPriority) {\n    return 'PREEMPT_IMMEDIATELY: SAVE_CONTEXT_SWITCH_TO_HIGHER_PRIORITY_TASK';\n  }\n  return 'CONTINUE_CURRENT_TASK_UNTIL_YIELD_OR_TICK';\n}\n\nconsole.log('Running P1, Higher Task P4 wakes up:', evaluateRtosSwitch(1, 4));",
            "expectedOutput": "Running P1, Higher Task P4 wakes up: PREEMPT_IMMEDIATELY: SAVE_CONTEXT_SWITCH_TO_HIGHER_PRIORITY_TASK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the FreeRTOS preemptive scheduler when a Priority 4 task wakes up while a Priority 1 task is running?",
          "expectedStringOutput": "PREEMPT_IMMEDIATELY: SAVE_CONTEXT_SWITCH_TO_HIGHER_PRIORITY_TASK",
          "acceptableAnswers": [
            "PREEMPT_IMMEDIATELY: SAVE_CONTEXT_SWITCH_TO_HIGHER_PRIORITY_TASK",
            "PREEMPT_IMMEDIATELY",
            "Preempt"
          ],
          "primaryMisconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
          "diagnosisMap": {
            "CONTINUE": {
              "misconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
              "errorExplanation": "Higher priority tasks preempt lower priority tasks immediately in FreeRTOS.",
              "recoveryPath": {
                "simplerExplanation": "Higher priority triggers PREEMPT_IMMEDIATELY.",
                "guidedFixPrompt": "Type PREEMPT_IMMEDIATELY: SAVE_CONTEXT_SWITCH_TO_HIGHER_PRIORITY_TASK"
              }
            }
          }
        }
      },
      {
        "id": "iot-d12-b2-task-states-and-tcb",
        "day": 12,
        "blockNumber": 2,
        "title": "FreeRTOS Task States: Running, Ready, Blocked & Suspended",
        "conceptBudget": {
          "primaryConcept": "Task States & Lifecycle",
          "supportingTerms": [
            "Running (Actively executing on CPU core)",
            "Ready (Ready to execute, waiting for higher priority tasks to yield)",
            "Blocked (Waiting for delay timer `vTaskDelay()` or queue/semaphore event)",
            "Suspended (Explicitly paused via `vTaskSuspend()`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d12-b1-super-loop-vs-rtos-multitasking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "FreeRTOS Task State Transitions",
              "nodes": [
                {
                  "id": "1",
                  "label": "Ready List: Tasks sorted by Priority level",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Scheduler selects highest priority -> Transitions to RUNNING",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Task calls vTaskDelay(100) -> Transitions to BLOCKED (Zero CPU consumption!)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "100ms expires -> Transitions back to READY List!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "task_state_demo.js",
            "initialCode": "function getTaskState(action) {\n  if (action === 'CALL_VTASKDELAY') return 'BLOCKED (CPU freed for lower priority tasks)';\n  if (action === 'SEMAPHORE_GIVEN') return 'READY (Moved to ready list)';\n  return 'RUNNING';\n}\n\nconsole.log(getTaskState('CALL_VTASKDELAY'));",
            "expectedOutput": "BLOCKED (CPU freed for lower priority tasks)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state does a FreeRTOS task transition to when calling `vTaskDelay(100)`?",
          "expectedStringOutput": "BLOCKED (CPU freed for lower priority tasks)",
          "acceptableAnswers": [
            "BLOCKED (CPU freed for lower priority tasks)",
            "BLOCKED",
            "Blocked"
          ],
          "primaryMisconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
          "diagnosisMap": {
            "SUSPENDED": {
              "misconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
              "errorExplanation": "vTaskDelay puts tasks in the BLOCKED state until the timer expires.",
              "recoveryPath": {
                "simplerExplanation": "Delays put tasks in BLOCKED state.",
                "guidedFixPrompt": "Type BLOCKED (CPU freed for lower priority tasks)"
              }
            }
          }
        }
      },
      {
        "id": "iot-d12-b3-stack-overflow-hook-detection",
        "day": 12,
        "blockNumber": 3,
        "title": "Task Stack Watermarks & `vApplicationStackOverflowHook`",
        "conceptBudget": {
          "primaryConcept": "Stack Overflow Detection in RTOS",
          "supportingTerms": [
            "Task Stack allocation in SRAM",
            "High Watermark (`uxTaskGetStackHighWaterMark()`)",
            "Stack Canary (`0xA5A5A5A5` fill pattern)",
            "Stack Overflow Hook callback on memory corruption"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d12-b2-task-states-and-tcb",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stack_canary_demo.js",
            "initialCode": "function evaluateStackCanary(canaryBytes) {\n  const isCorrupted = canaryBytes.some(b => b !== 0xA5);\n  return isCorrupted\n    ? 'STACK_OVERFLOW_DETECTED: TRIGGER_VAPPLICATIONSTACKOVERFLOWHOOK'\n    : 'STACK_HEALTHY: CANARY_UNTOUCHED';\n}\n\nconsole.log('Healthy Stack:', evaluateStackCanary([0xA5, 0xA5, 0xA5, 0xA5]));\nconsole.log('Corrupted Stack:', evaluateStackCanary([0xA5, 0xA5, 0x00, 0x12]));",
            "expectedOutput": "Healthy Stack: STACK_HEALTHY: CANARY_UNTOUCHED\nCorrupted Stack: STACK_OVERFLOW_DETECTED: TRIGGER_VAPPLICATIONSTACKOVERFLOWHOOK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does FreeRTOS detect stack overflows when `configCHECK_FOR_STACK_OVERFLOW = 2` is enabled?",
          "options": [
            "It fills the task's stack with a pattern of `0xA5` bytes at creation; before context switching, the scheduler checks if the last 16 bytes of the stack still contain `0xA5`; if corrupted, it halts and calls `vApplicationStackOverflowHook()`",
            "By measuring CPU temperature",
            "By asking the user"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
              "errorExplanation": "Stack canaries (0xA5) verify that stack boundaries were not breached.",
              "recoveryPath": {
                "simplerExplanation": "Checks 0xA5 canary bytes at the stack boundary.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "RTOS Synchronization: Mutexes, Semaphores & Priority Inversion",
    "overviewMetaphor": "Priority Inversion is the Mars Pathfinder 1997 disaster on the Martian surface: a Low-Priority Meteorological Task acquired a shared data bus Mutex; a High-Priority Information Bus Task woke up and needed the Mutex, so it blocked; a Medium-Priority Communications Task woke up and preempted the Low-Priority task (Preventing it from finishing and releasing the Mutex!); High-Priority was starved for CPU time by Medium-Priority (Inversion!); Priority Inheritance fixes this by temporarily boosting Low-Priority to High-Priority until the Mutex is released.",
    "blocks": [
      {
        "id": "iot-d13-b1-priority-inversion-mars-pathfinder",
        "day": 13,
        "blockNumber": 1,
        "title": "The Priority Inversion Dilemma & Mars Pathfinder Breakdown",
        "conceptBudget": {
          "primaryConcept": "Priority Inversion Vulnerability",
          "supportingTerms": [
            "Low Task ($L$) acquires Mutex $M$",
            "High Task ($H$) blocks waiting for $M$",
            "Medium Task ($M$) preempts $L$ because $M > L$",
            "Result: High Task is starved by Medium Task! (Unbounded Priority Inversion)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d12-b1-super-loop-vs-rtos-multitasking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Priority Inversion Bug vs Priority Inheritance Fix",
              "brokenCode": "// ❌ PRIORITY INVERSION (Mars Pathfinder Outage):\n1. Low Task acquires Mutex\n2. High Task attempts Mutex acquisition -> BLOCKED!\n3. Medium Task wakes up -> PREEMPTS Low Task!\n4. Low Task never runs -> Mutex never released -> High Task times out -> SYSTEM WATCHDOG REBOOTS!",
              "fixedCode": "// ✅ PRIORITY INHERITANCE PROTOCOL (Automatic Solution):\n1. Low Task acquires Mutex\n2. High Task attempts Mutex acquisition -> BLOCKED!\n3. RTOS BOOSTS Low Task priority to match High Task!\n4. Medium Task CANNOT preempt boosted Low Task -> Low Task releases Mutex -> High Task runs instantly!",
              "errorLine": 3,
              "errorReason": "Medium priority task preempts mutex holder, blocking high priority task indefinitely.",
              "fixExplanation": "Use Mutexes with Priority Inheritance to boost lock holder priority."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mars_inversion_sim.js",
            "initialCode": "function evaluatePriorityInheritance(useInheritance) {\n  return useInheritance\n    ? { highTaskBlockedDurationMs: 2, priorityInversionAverted: true, systemState: 'MARS_ROVER_NOMINAL' }\n    : { highTaskBlockedDurationMs: 1500, priorityInversionAverted: false, systemState: 'WATCHDOG_SYSTEM_REBOOT' };\n}\n\nconsole.log('With Inheritance:', JSON.stringify(evaluatePriorityInheritance(true)));\nconsole.log('Without Inheritance:', JSON.stringify(evaluatePriorityInheritance(false)));",
            "expectedOutput": "With Inheritance: {\"highTaskBlockedDurationMs\":2,\"priorityInversionAverted\":true,\"systemState\":\"MARS_ROVER_NOMINAL\"}\nWithout Inheritance: {\"highTaskBlockedDurationMs\":1500,\"priorityInversionAverted\":false,\"systemState\":\"WATCHDOG_SYSTEM_REBOOT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the Priority Inheritance Protocol prevent unbounded Priority Inversion in real-time embedded systems?",
          "options": [
            "When a high-priority task blocks waiting for a mutex held by a low-priority task, the RTOS temporarily elevates the low-priority task to the high-priority level, preventing medium-priority tasks from preempting it until the mutex is safely released",
            "By deleting medium-priority tasks from RAM",
            "By running all tasks at priority 0"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_SEMAPHORES_MUTEX_QUEUE_DEADLOCK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_SEMAPHORES_MUTEX_QUEUE_DEADLOCK",
              "errorExplanation": "Priority inheritance temporarily boosts the lock holder's priority to prevent preemption.",
              "recoveryPath": {
                "simplerExplanation": "Temporarily elevates lock holder to high-priority level.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d13-b2-semaphores-vs-mutexes",
        "day": 13,
        "blockNumber": 2,
        "title": "Binary Semaphores vs Mutexes: Ownership & Recursive Locking",
        "conceptBudget": {
          "primaryConcept": "Binary Semaphore vs Mutex",
          "supportingTerms": [
            "Mutex (Has Ownership: ONLY the task that locked it can unlock it; supports Priority Inheritance)",
            "Binary Semaphore (No Ownership: Task A waits, ISR or Task B signals `xSemaphoreGive()`; used for task synchronization)",
            "Recursive Mutex (`xSemaphoreTakeRecursive()`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d13-b1-priority-inversion-mars-pathfinder",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mutex vs Binary Semaphore Differences",
              "boxes": [
                {
                  "label": "1. Mutex (`xSemaphoreCreateMutex`)",
                  "value": "Ownership: YES | Priority Inheritance: YES | Use Case: Shared resource mutual exclusion (SPI bus)",
                  "varType": "Resource Lock",
                  "isUpdated": true
                },
                {
                  "label": "2. Binary Semaphore (`xSemaphoreCreateBinary`)",
                  "value": "Ownership: NO | Priority Inheritance: NO | Use Case: ISR-to-Task event signaling",
                  "varType": "Signaling",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mutex_vs_sem_demo.js",
            "initialCode": "function selectPrimitive(useCase) {\n  if (useCase === 'PROTECT_SHARED_I2C_BUS') return 'MUTEX (Requires ownership & priority inheritance)';\n  if (useCase === 'SIGNAL_FROM_ISR_TO_TASK') return 'BINARY_SEMAPHORE (Allows ISR to give without ownership)';\n  return 'COUNTING_SEMAPHORE';\n}\n\nconsole.log(selectPrimitive('PROTECT_SHARED_I2C_BUS'));\nconsole.log(selectPrimitive('SIGNAL_FROM_ISR_TO_TASK'));",
            "expectedOutput": "MUTEX (Requires ownership & priority inheritance)\nBINARY_SEMAPHORE (Allows ISR to give without ownership)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which synchronization primitive is required for signaling task execution from an Interrupt Service Routine (ISR)?",
          "expectedStringOutput": "BINARY_SEMAPHORE (Allows ISR to give without ownership)",
          "acceptableAnswers": [
            "BINARY_SEMAPHORE (Allows ISR to give without ownership)",
            "BINARY_SEMAPHORE",
            "Binary semaphore"
          ],
          "primaryMisconceptionId": "MC_IOT_SEMAPHORES_MUTEX_QUEUE_DEADLOCK",
          "diagnosisMap": {
            "MUTEX": {
              "misconceptionId": "MC_IOT_SEMAPHORES_MUTEX_QUEUE_DEADLOCK",
              "errorExplanation": "Mutexes have ownership and cannot be unlocked from ISRs. ISR signaling uses BINARY_SEMAPHORE.",
              "recoveryPath": {
                "simplerExplanation": "ISR signaling uses BINARY_SEMAPHORE.",
                "guidedFixPrompt": "Type BINARY_SEMAPHORE (Allows ISR to give without ownership)"
              }
            }
          }
        }
      },
      {
        "id": "iot-d13-b3-freertos-queues-fifo",
        "day": 13,
        "blockNumber": 3,
        "title": "FreeRTOS Queues: Thread-Safe Pass-by-Value Messaging",
        "conceptBudget": {
          "primaryConcept": "FreeRTOS Message Queues",
          "supportingTerms": [
            "`xQueueCreate(length, itemSize)`",
            "`xQueueSend()` & `xQueueReceive()` with block timeouts",
            "Pass-by-value safety (Copies bytes into queue storage, eliminating dangling pointer bugs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d13-b2-semaphores-vs-mutexes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "queue_pass_demo.js",
            "initialCode": "function simulateQueuePass(item) {\n  // FreeRTOS Queues copy data by value into private internal buffer\n  const queueStorage = JSON.parse(JSON.stringify(item));\n  return {\n    queuedItem: queueStorage,\n    passByValueVerified: true,\n    isThreadSafe: true\n  };\n}\n\nconsole.log(JSON.stringify(simulateQueuePass({ temp: 24.5, humidity: 60 })));",
            "expectedOutput": "{\"queuedItem\":{\"temp\":24.5,\"humidity\":60},\"passByValueVerified\":true,\"isThreadSafe\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do FreeRTOS message queues copy data items by value into queue memory rather than storing raw pointers?",
          "options": [
            "To prevent dangerous race conditions and dangling pointer memory corruption if the sending task modifies or deallocates the local variable before the receiving task finishes reading it",
            "Because microcontrollers cannot handle memory pointers",
            "To slow down queue transfers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_SEMAPHORES_MUTEX_QUEUE_DEADLOCK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_SEMAPHORES_MUTEX_QUEUE_DEADLOCK",
              "errorExplanation": "Pass-by-value copies protect against race conditions and dangling pointers.",
              "recoveryPath": {
                "simplerExplanation": "Prevents race conditions and dangling pointer corruption.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Direct Memory Access (DMA) & Circular Buffers",
    "overviewMetaphor": "DMA (Direct Memory Access) is an automated forklift in a warehouse: instead of the master chef (CPU Core) stopping their gourmet cooking to manually carry 10,000 bags of flour one-by-one from the delivery truck (ADC / UART peripheral) into the pantry (SRAM), the chef turns on the automated forklift (DMA Controller); the forklift moves 10,000 bags directly into memory in the background while the chef continues cooking at 100% speed with 0% CPU overhead.",
    "blocks": [
      {
        "id": "iot-d14-b1-dma-controller-channels",
        "day": 14,
        "blockNumber": 1,
        "title": "DMA Controller Architecture & Peripheral-to-Memory Streams",
        "conceptBudget": {
          "primaryConcept": "DMA Controller Architecture",
          "supportingTerms": [
            "Peripheral-to-Memory (P2M: ADC/UART to RAM)",
            "Memory-to-Peripheral (M2P: RAM to DAC/SPI display)",
            "Memory-to-Memory (M2M: Fast SRAM block copy)",
            "Bus Matrix Arbitration & Priority Streams"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CPU Polling vs DMA Data Transfer",
              "boxes": [
                {
                  "label": "1. CPU Interrupt Copying (100k samples/sec)",
                  "value": "CPU Usage: 92.0% -> CPU is 100% choked handling ISR interrupts",
                  "varType": "CPU Choked",
                  "isUpdated": false
                },
                {
                  "label": "2. DMA Direct Transfer (100k samples/sec)",
                  "value": "CPU Usage: 0.5% -> DMA moves bytes silently over bus matrix; CPU is 99.5% free!",
                  "varType": "Zero CPU Load",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dma_savings_demo.js",
            "initialCode": "function calculateCpuUsage(samplesPerSec, useDma) {\n  return useDma \n    ? { samplesPerSec, cpuLoadPercent: 0.5, status: 'CPU_FREE_FOR_DSP_ALGORITHMS' }\n    : { samplesPerSec, cpuLoadPercent: 88.0, status: 'CPU_SATURATED_BY_ISR_OVERHEAD' };\n}\n\nconsole.log('With DMA:', JSON.stringify(calculateCpuUsage(100000, true)));\nconsole.log('Without DMA:', JSON.stringify(calculateCpuUsage(100000, false)));",
            "expectedOutput": "With DMA: {\"samplesPerSec\":100000,\"cpuLoadPercent\":0.5,\"status\":\"CPU_FREE_FOR_DSP_ALGORITHMS\"}\nWithout DMA: {\"samplesPerSec\":100000,\"cpuLoadPercent\":88,\"status\":\"CPU_SATURATED_BY_ISR_OVERHEAD\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the approximate CPU load percentage when using DMA to transfer 100,000 samples per second?",
          "expectedStringOutput": "0.5",
          "acceptableAnswers": [
            "0.5",
            "0.5%",
            "cpuLoadPercent\":0.5"
          ],
          "primaryMisconceptionId": "MC_IOT_MEMORY_ALIGNMENT_DMA_CIRCULAR_BUFFER",
          "diagnosisMap": {
            "88": {
              "misconceptionId": "MC_IOT_MEMORY_ALIGNMENT_DMA_CIRCULAR_BUFFER",
              "errorExplanation": "88% is for CPU interrupt copying. DMA offloads the transfer down to ~0.5% CPU load.",
              "recoveryPath": {
                "simplerExplanation": "DMA reduces CPU load to 0.5%.",
                "guidedFixPrompt": "Type 0.5"
              }
            }
          }
        }
      },
      {
        "id": "iot-d14-b2-circular-dma-ping-pong-buffers",
        "day": 14,
        "blockNumber": 2,
        "title": "Circular Mode & Half-Transfer / Transfer-Complete Interrupts",
        "conceptBudget": {
          "primaryConcept": "Circular DMA Ping-Pong Buffering",
          "supportingTerms": [
            "Circular DMA Buffer (Automatically wraps to start address without CPU restart)",
            "Half-Transfer Complete ISR (HT: Fires at 50% buffer fill)",
            "Transfer Complete ISR (TC: Fires at 100% buffer fill)",
            "Ping-Pong Processing (DSP processes Buffer A while DMA fills Buffer B)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d14-b1-dma-controller-channels",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Ping-Pong DMA Buffer Execution Loop",
              "nodes": [
                {
                  "id": "1",
                  "label": "DMA streams ADC samples into Buffer A (Indices 0 to 511)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Half-Transfer ISR fires -> CPU processes Buffer A in background",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "DMA continues streaming into Buffer B (Indices 512 to 1023)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Transfer Complete ISR fires -> CPU processes Buffer B; DMA wraps to Buffer A! (Zero data loss)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ping_pong_sim.js",
            "initialCode": "function evaluateDmaEvent(event) {\n  if (event === 'HALF_TRANSFER') return 'HT_ISR: CPU_PROCESSES_BUFFER_A_WHILE_DMA_FILLS_BUFFER_B';\n  if (event === 'TRANSFER_COMPLETE') return 'TC_ISR: CPU_PROCESSES_BUFFER_B_WHILE_DMA_FILLS_BUFFER_A';\n  return 'IDLE';\n}\n\nconsole.log(evaluateDmaEvent('HALF_TRANSFER'));\nconsole.log(evaluateDmaEvent('TRANSFER_COMPLETE'));",
            "expectedOutput": "HT_ISR: CPU_PROCESSES_BUFFER_A_WHILE_DMA_FILLS_BUFFER_B\nTC_ISR: CPU_PROCESSES_BUFFER_B_WHILE_DMA_FILLS_BUFFER_A",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does Double-Buffered Ping-Pong DMA prevent data corruption during continuous high-speed audio/sensor streaming?",
          "options": [
            "The CPU processes the first half of the buffer (Buffer A) while the DMA hardware simultaneously fills the second half (Buffer B); when full, the roles flip, ensuring the CPU never reads from memory actively being written by DMA",
            "By clearing the memory buffer to zeros",
            "By pausing the ADC clock"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_MEMORY_ALIGNMENT_DMA_CIRCULAR_BUFFER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_MEMORY_ALIGNMENT_DMA_CIRCULAR_BUFFER",
              "errorExplanation": "Ping-pong buffers cleanly separate the CPU processing chunk from the active DMA write chunk.",
              "recoveryPath": {
                "simplerExplanation": "Processes Buffer A while DMA writes Buffer B, eliminating race conditions.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d14-b3-cache-coherency-dma-memory-alignment",
        "day": 14,
        "blockNumber": 3,
        "title": "DMA Cache Coherency & 32-Bit Memory Alignment",
        "conceptBudget": {
          "primaryConcept": "DMA Cache Coherency & Alignment",
          "supportingTerms": [
            "Data Cache (D-Cache) Coherency Hazard on Cortex-M7",
            "`SCB_CleanDCache()` (Flushes CPU cache to SRAM before DMA transmit)",
            "`SCB_InvalidateDCache()` (Discards stale CPU cache before reading DMA receive)",
            "32-bit (4-byte) Memory Alignment Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d14-b2-circular-dma-ping-pong-buffers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ARM Cortex-M7 D-Cache Management for DMA",
            "codeSnippet": "// Before DMA transmits buffer from SRAM to SPI:\nSCB_CleanDCache_by_Addr((uint32_t*)txBuffer, BUFFER_SIZE); // Push dirty cache to RAM\n\n// After DMA receives new buffer from ADC into SRAM:\nSCB_InvalidateDCache_by_Addr((uint32_t*)rxBuffer, BUFFER_SIZE); // Invalidate stale cache",
            "lineNotes": {
              "2": "Clean: Ensures DMA controller reads the CPU's latest written data from RAM.",
              "5": "Invalidate: Forces CPU core to read newly arrived DMA bytes from RAM."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cache_coherency_demo.js",
            "initialCode": "function evaluateDmaCacheAction(direction) {\n  return direction === 'TX_TO_PERIPHERAL'\n    ? 'CLEAN_DCACHE: FLUSH_CPU_REGISTERS_TO_RAM'\n    : 'INVALIDATE_DCACHE: FORCE_CPU_TO_RELOAD_FRESH_DMA_BYTES_FROM_RAM';\n}\n\nconsole.log('DMA Transmit:', evaluateDmaCacheAction('TX_TO_PERIPHERAL'));\nconsole.log('DMA Receive:', evaluateDmaCacheAction('RX_FROM_PERIPHERAL'));",
            "expectedOutput": "DMA Transmit: CLEAN_DCACHE: FLUSH_CPU_REGISTERS_TO_RAM\nDMA Receive: INVALIDATE_DCACHE: FORCE_CPU_TO_RELOAD_FRESH_DMA_BYTES_FROM_RAM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cache maintenance operation must be performed before reading newly received DMA buffer bytes on a cached ARM Cortex-M7 core?",
          "expectedStringOutput": "INVALIDATE_DCACHE: FORCE_CPU_TO_RELOAD_FRESH_DMA_BYTES_FROM_RAM",
          "acceptableAnswers": [
            "INVALIDATE_DCACHE: FORCE_CPU_TO_RELOAD_FRESH_DMA_BYTES_FROM_RAM",
            "INVALIDATE_DCACHE",
            "Invalidate D-Cache"
          ],
          "primaryMisconceptionId": "MC_IOT_MEMORY_ALIGNMENT_DMA_CIRCULAR_BUFFER",
          "diagnosisMap": {
            "CLEAN": {
              "misconceptionId": "MC_IOT_MEMORY_ALIGNMENT_DMA_CIRCULAR_BUFFER",
              "errorExplanation": "Clean is for transmit. Receiving requires INVALIDATE_DCACHE to discard stale cached copies.",
              "recoveryPath": {
                "simplerExplanation": "Receive requires INVALIDATE_DCACHE.",
                "guidedFixPrompt": "Type INVALIDATE_DCACHE: FORCE_CPU_TO_RELOAD_FRESH_DMA_BYTES_FROM_RAM"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Multi-Tasking RTOS Telemetry Engine with DMA & Circular Buffers",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete industrial telemetry acquisition unit: 1. Multi-channel ADC reads continuous analog sensor voltages via DMA circular ping-pong buffer (0% CPU load); 2. Half-Transfer interrupt triggers FreeRTOS signal; 3. High-Priority Sensor Task filters data and acquires SPI mutex with Priority Inheritance; 4. Formats telemetry packets and sends to thread-safe FreeRTOS Queue; 5. UART Task streams packets at 115,200 baud with zero dropped frames.",
    "blocks": [
      {
        "id": "iot-d15-b1-rtos-dma-engine-architecture",
        "day": 15,
        "blockNumber": 1,
        "title": "Multi-Tasking RTOS Telemetry Engine Architecture",
        "conceptBudget": {
          "primaryConcept": "RTOS Telemetry Architecture",
          "supportingTerms": [
            "DMA Circular Stream",
            "FreeRTOS Task Priorities",
            "Priority Inheritance Mutex",
            "Thread-Safe Message Queue"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d14-b2-circular-dma-ping-pong-buffers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "End-to-End RTOS Telemetry Architecture Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "DMA streams ADC samples continuously into RAM buffer",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Half-Transfer ISR signals Binary Semaphore to SensorTask",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "SensorTask (Priority 3) acquires SPI Mutex with Priority Inheritance",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Pushes formatted packet to FreeRTOS Queue -> UART Task streams out at 115,200 baud!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rtos_engine_sim.js",
            "initialCode": "function runRtosEngineCycle(sensorSample, queue) {\n  const packet = {\n    sample: sensorSample,\n    dmaTransferred: true,\n    mutexProtected: true,\n    timestamp: Date.now()\n  };\n  queue.push(packet);\n  return {\n    queuedPacket: packet,\n    engineStatus: 'RTOS_TELEMETRY_ENGINE_ACTIVE'\n  };\n}\n\nconst q = [];\nconsole.log(runRtosEngineCycle(1024, q).engineStatus);",
            "expectedOutput": "RTOS_TELEMETRY_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms operational readiness of the synthesized RTOS telemetry engine?",
          "expectedStringOutput": "RTOS_TELEMETRY_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "RTOS_TELEMETRY_ENGINE_ACTIVE",
            "Engine Status: RTOS_TELEMETRY_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
          "diagnosisMap": {
            "OFFLINE": {
              "misconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
              "errorExplanation": "Matches RTOS_TELEMETRY_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches RTOS_TELEMETRY_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type RTOS_TELEMETRY_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "iot-d15-b2-real-time-deadline-benchmarks",
        "day": 15,
        "blockNumber": 2,
        "title": "Real-Time Deadline Benchmarking & Jitter Analysis",
        "conceptBudget": {
          "primaryConcept": "RTOS Jitter & Deadline Benchmarking",
          "supportingTerms": [
            "Hard Real-Time Deadline: < 50us response",
            "Jitter: $\\Delta t < 2\\text{us}$",
            "Zero Dropped Telemetry Frames SLA"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d15-b1-rtos-dma-engine-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "deadline_audit_demo.js",
            "initialCode": "function auditRtosDeadlines(responseLatencyUs, jitterUs) {\n  const passed = responseLatencyUs <= 50 && jitterUs <= 2.0;\n  return {\n    responseLatencyUs,\n    jitterUs,\n    compliant: passed,\n    grade: passed ? 'HARD_REAL_TIME_CERTIFIED' : 'DEADLINE_BREACHED'\n  };\n}\n\nconsole.log(JSON.stringify(auditRtosDeadlines(18, 0.8)));",
            "expectedOutput": "{\"responseLatencyUs\":18,\"jitterUs\":0.8,\"compliant\":true,\"grade\":\"HARD_REAL_TIME_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What grade is awarded to the RTOS engine meeting 18us latency and 0.8us jitter?",
          "expectedStringOutput": "HARD_REAL_TIME_CERTIFIED",
          "acceptableAnswers": [
            "HARD_REAL_TIME_CERTIFIED",
            "grade\":\"HARD_REAL_TIME_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
          "diagnosisMap": {
            "BREACHED": {
              "misconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
              "errorExplanation": "18us <= 50us and 0.8us <= 2.0us qualifies for HARD_REAL_TIME_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards HARD_REAL_TIME_CERTIFIED.",
                "guidedFixPrompt": "Type HARD_REAL_TIME_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "iot-d15-b3-milestone2-iot-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Multi-Tasking RTOS Telemetry Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Multi-Tasking RTOS Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d15-b2-real-time-deadline-benchmarks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_iot_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Multi-Tasking RTOS Telemetry Engine with DMA & Circular Buffers [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Multi-Tasking RTOS Telemetry Engine with DMA & Circular Buffers [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Multi-Tasking RTOS Telemetry Engine with DMA & Circular Buffers [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Multi-Tasking RTOS Telemetry Engine with DMA & Circular Buffers [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOT_RTOS_TASKS_PREEMPTION_PRIORITY_INVERSION",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Multi-Tasking RTOS Telemetry Engine with DMA & Circular Buffers [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Ultra-Low Power Modes & Deep Sleep Wake-Up Triggers",
    "overviewMetaphor": "Deep Sleep in IoT is a hibernating grizzly bear: running the microcontroller at full speed (20mA active current) drains a small coin-cell battery in 4 days; putting the chip into Deep Sleep (Shutting down the CPU core, PLL high-speed clock, and Flash memory) drops current consumption down to 2 microamps (10,000x less power!); an ultra-low-power Real-Time Clock (RTC) timer wakes the chip up for 50 milliseconds once per hour to read a sensor, extending battery life to 10 full years.",
    "blocks": [
      {
        "id": "iot-d16-b1-power-modes-spectrum",
        "day": 16,
        "blockNumber": 1,
        "title": "Microcontroller Power Modes: Run, Sleep, Stop & Standby / Deep Sleep",
        "conceptBudget": {
          "primaryConcept": "MCU Power Modes Spectrum",
          "supportingTerms": [
            "Run Mode (CPU active, peripherals clocked: ~15-30mA)",
            "Sleep Mode (CPU stopped, peripherals active: ~5mA)",
            "Stop Mode (All clocks stopped, SRAM retained: ~20-50uA)",
            "Standby / Deep Sleep Mode (Core powered down, SRAM lost, only RTC running: ~1-3uA)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Power Modes Current Profile (STM32 / ESP32)",
              "boxes": [
                {
                  "label": "1. Run Mode (168 MHz)",
                  "value": "Current: 25.0 mA | Clocks: All Active | SRAM: Retained | Wakeup: 0 us",
                  "varType": "Full Active",
                  "isUpdated": false
                },
                {
                  "label": "2. Stop Mode",
                  "value": "Current: 35.0 uA | Clocks: Low Power | SRAM: Retained | Wakeup: 5 us",
                  "varType": "Fast Wakeup",
                  "isUpdated": false
                },
                {
                  "label": "3. Deep Sleep / Standby",
                  "value": "Current: 2.5 uA | Clocks: RTC 32kHz only | SRAM: Powered Down | Wakeup: 100 us",
                  "varType": "10-Year Battery",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "power_mode_demo.js",
            "initialCode": "function evaluatePowerProfile(mode) {\n  if (mode === 'DEEP_SLEEP') return { currentMicroamps: 2.5, sramRetained: false, wakeupSource: 'RTC_TIMER_OR_WAKEUP_PIN' };\n  if (mode === 'STOP_MODE') return { currentMicroamps: 35.0, sramRetained: true, wakeupSource: 'ANY_EXTI_INTERRUPT' };\n  return { currentMicroamps: 25000.0, sramRetained: true, status: 'RUN_MODE' };\n}\n\nconsole.log('Deep Sleep Profile:', JSON.stringify(evaluatePowerProfile('DEEP_SLEEP')));\nconsole.log('Stop Mode Profile:', JSON.stringify(evaluatePowerProfile('STOP_MODE')));",
            "expectedOutput": "Deep Sleep Profile: {\"currentMicroamps\":2.5,\"sramRetained\":false,\"wakeupSource\":\"RTC_TIMER_OR_WAKEUP_PIN\"}\nStop Mode Profile: {\"currentMicroamps\":35,\"sramRetained\":true,\"wakeupSource\":\"ANY_EXTI_INTERRUPT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the typical current draw (in microamps) of an ultra-low power microcontroller in Deep Sleep mode?",
          "expectedStringOutput": "2.5",
          "acceptableAnswers": [
            "2.5",
            "2.5 uA",
            "2.5 microamps",
            "currentMicroamps\":2.5"
          ],
          "primaryMisconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
          "diagnosisMap": {
            "25000": {
              "misconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
              "errorExplanation": "25,000 uA (25mA) is for Run Mode. Deep Sleep draws only ~2.5 uA.",
              "recoveryPath": {
                "simplerExplanation": "Deep Sleep draws only 2.5 microamps.",
                "guidedFixPrompt": "Type 2.5"
              }
            }
          }
        }
      },
      {
        "id": "iot-d16-b2-battery-life-duty-cycle-math",
        "day": 16,
        "blockNumber": 2,
        "title": "Battery Longevity Math: Average Current & Duty Cycle ($I_{\\text{avg}}$)",
        "conceptBudget": {
          "primaryConcept": "Average Current Duty Cycle Equation",
          "supportingTerms": [
            "$I_{\\text{avg}} = \\frac{(I_{\\text{active}} \\times t_{\\text{active}}) + (I_{\\text{sleep}} \\times t_{\\text{sleep}})}{t_{\\text{active}} + t_{\\text{sleep}}}$",
            "Battery Lifetime (Hours) = $\\frac{\\text{Capacity (mAh)}}{I_{\\text{avg}}}$",
            "Self-Discharge Derating (1% per year on Li-SOCl2 batteries)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d16-b1-power-modes-spectrum",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Average Current Equation",
            "codeSnippet": "const activeCurrentMa = 20.0; // 20mA when radio transmits (100ms)\nconst sleepCurrentMa = 0.003; // 3uA in deep sleep (59.9 seconds)\nconst totalPeriodSec = 60.0;  // 1-minute cycle\nconst avgCurrentMa = ((activeCurrentMa * 0.1) + (sleepCurrentMa * 59.9)) / totalPeriodSec; // 0.036 mA!",
            "lineNotes": {
              "4": "Spends 99.8% of time sleeping, dropping average current down to 36 microamps."
            }
          },
          {
            "type": "runnable_code",
            "filename": "battery_calc_demo.js",
            "initialCode": "function calculateIotYears(batteryMah, iActiveMa, tActiveSec, iSleepUa, tSleepSec) {\n  const period = tActiveSec + tSleepSec;\n  const iAvg = ((iActiveMa * tActiveSec) + ((iSleepUa / 1000) * tSleepSec)) / period;\n  const hours = batteryMah / iAvg;\n  const years = hours / (24 * 365.25);\n  return {\n    batteryCapacityMah: batteryMah,\n    averageCurrentMicroamps: Number((iAvg * 1000).toFixed(1)),\n    expectedBatteryYears: Number(years.toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateIotYears(2400, 20.0, 0.1, 3.0, 59.9))); // 100ms active per minute on 2400mAh cell",
            "expectedOutput": "{\"batteryCapacityMah\":2400,\"averageCurrentMicroamps\":36.3,\"expectedBatteryYears\":7.5}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the expected operating life (in years) of a 2400mAh battery operating at 36.3 microamps average current?",
          "expectedStringOutput": "7.5",
          "acceptableAnswers": [
            "7.5",
            "7.5 years",
            "expectedBatteryYears\":7.5"
          ],
          "primaryMisconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
              "errorExplanation": "2400 mAh / 0.0363 mA = 66,115 hours ≈ 7.5 years.",
              "recoveryPath": {
                "simplerExplanation": "2400 / 0.0363 / 8766 = 7.5 years.",
                "guidedFixPrompt": "Type 7.5"
              }
            }
          }
        }
      },
      {
        "id": "iot-d16-b3-brownout-reset-bod",
        "day": 16,
        "blockNumber": 3,
        "title": "Brownout Detectors (BOD) & Supply Voltage Glitch Protection",
        "conceptBudget": {
          "primaryConcept": "Brownout Detection (BOD)",
          "supportingTerms": [
            "Brownout Hazard (Supply voltage drops into undefined 2.0V region, causing CPU to execute corrupt opcodes and overwrite flash memory)",
            "BOD Threshold Voltage ($V_{\\text{BOD}} = 2.7\\text{V}$)",
            "Safe hardware reset hold"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d16-b2-battery-life-duty-cycle-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bod_sim_demo.js",
            "initialCode": "function evaluateBodSafety(supplyVoltage, bodThreshold = 2.7) {\n  if (supplyVoltage < bodThreshold) {\n    return 'BOD_TRIPPED: HOLD_CPU_IN_SAFE_HARDWARE_RESET_TO_PREVENT_CORRUPT_EXECUTION';\n  }\n  return 'VOLTAGE_HEALTHY: CPU_RUNNING_SAFELY';\n}\n\nconsole.log('Voltage 3.3V:', evaluateBodSafety(3.3));\nconsole.log('Voltage 2.2V (Dying Battery):', evaluateBodSafety(2.2));",
            "expectedOutput": "Voltage 3.3V: VOLTAGE_HEALTHY: CPU_RUNNING_SAFELY\nVoltage 2.2V (Dying Battery): BOD_TRIPPED: HOLD_CPU_IN_SAFE_HARDWARE_RESET_TO_PREVENT_CORRUPT_EXECUTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is an integrated Brownout Detector (BOD) circuit mandatory in production battery-powered IoT devices?",
          "options": [
            "Because when a battery dies and drops below minimum operating voltage, the CPU logic gates begin misinterpreting instructions, which can accidentally erase Flash memory unless the BOD holds the chip in a safe hardware Reset state",
            "Because BOD circuits recharge the battery using solar energy",
            "To increase CPU clock frequency"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
              "errorExplanation": "BOD prevents errant CPU execution and flash corruption during low-voltage dips.",
              "recoveryPath": {
                "simplerExplanation": "Holds CPU in reset to prevent code corruption during voltage dips.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "MQTT Protocol: Topics, QoS Tiers & Last Will and Testament",
    "overviewMetaphor": "MQTT is an international postal sorting hub for lightweight telegrams: a weather sensor in Alaska sends a 20-byte message to the topic `alaska/glacier/temp` (Publish); 500 mobile apps around the world subscribe to `alaska/+/temp` (Subscribe); if the sensor's battery dies unexpectedly, the MQTT broker automatically sends an emergency broadcast (\"Glacier sensor is DEAD!\") that the sensor registered in advance (Last Will and Testament: LWT).",
    "blocks": [
      {
        "id": "iot-d17-b1-mqtt-topic-hierarchy-wildcards",
        "day": 17,
        "blockNumber": 1,
        "title": "MQTT Topic Hierarchy & Wildcard Filtering (`+` vs `#`)",
        "conceptBudget": {
          "primaryConcept": "MQTT Topic Architecture",
          "supportingTerms": [
            "Topic Path (`factory/building1/floor2/temp`)",
            "Single-Level Wildcard (`+`: matches exactly 1 level, e.g. `factory/+/floor2/temp`)",
            "Multi-Level Wildcard (`#`: matches all remaining levels, e.g. `factory/#`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d9-b1-uart-frame-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "MQTT Wildcard Matching Rules",
              "boxes": [
                {
                  "label": "Subscription: sensors/+/temperature",
                  "value": "Matches: sensors/room1/temperature, sensors/room2/temperature | Rejects: sensors/factory/line1/temperature",
                  "varType": "Single Level",
                  "isUpdated": false
                },
                {
                  "label": "Subscription: sensors/#",
                  "value": "Matches: sensors/room1, sensors/factory/line1/machine4/temp (All nested subtopics)",
                  "varType": "Multi Level",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mqtt_wildcard_demo.js",
            "initialCode": "function evaluateMqttMatch(sub, pub) {\n  const subParts = sub.split('/');\n  const pubParts = pub.split('/');\n  for (let i = 0; i < subParts.length; i++) {\n    if (subParts[i] === '#') return 'MATCHED_VIA_MULTI_LEVEL_WILDCARD';\n    if (subParts[i] === '+') {\n      if (i >= pubParts.length) return 'NO_MATCH';\n      continue;\n    }\n    if (subParts[i] !== pubParts[i]) return 'NO_MATCH';\n  }\n  return subParts.length === pubParts.length ? 'MATCHED_EXACT_OR_SINGLE_LEVEL' : 'NO_MATCH';\n}\n\nconsole.log(evaluateMqttMatch('sensors/+/temp', 'sensors/kitchen/temp'));\nconsole.log(evaluateMqttMatch('factory/#', 'factory/line1/boiler/press'));",
            "expectedOutput": "MATCHED_EXACT_OR_SINGLE_LEVEL\nMATCHED_VIA_MULTI_LEVEL_WILDCARD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does the subscription `factory/#` match the published topic `factory/line1/boiler/press`?",
          "expectedStringOutput": "MATCHED_VIA_MULTI_LEVEL_WILDCARD",
          "acceptableAnswers": [
            "MATCHED_VIA_MULTI_LEVEL_WILDCARD",
            "Yes",
            "Matched"
          ],
          "primaryMisconceptionId": "MC_IOT_MQTT_TOPICS_QOS_RETAIN_WILL",
          "diagnosisMap": {
            "NO_MATCH": {
              "misconceptionId": "MC_IOT_MQTT_TOPICS_QOS_RETAIN_WILL",
              "errorExplanation": "# matches all remaining hierarchical levels, matching successfully.",
              "recoveryPath": {
                "simplerExplanation": "# matches all sub-levels -> MATCHED_VIA_MULTI_LEVEL_WILDCARD.",
                "guidedFixPrompt": "Type MATCHED_VIA_MULTI_LEVEL_WILDCARD"
              }
            }
          }
        }
      },
      {
        "id": "iot-d17-b2-mqtt-qos-tiers",
        "day": 17,
        "blockNumber": 2,
        "title": "MQTT Quality of Service (QoS) Tiers: 0, 1 & 2",
        "conceptBudget": {
          "primaryConcept": "MQTT QoS Tiers",
          "supportingTerms": [
            "QoS 0: At most once (Fire and forget, zero ACK: lowest latency)",
            "QoS 1: At least once (PUBACK required: guaranteed delivery, risk of duplicates)",
            "QoS 2: Exactly once (4-step handshake: `PUBLISH -> PUBREC -> PUBREL -> PUBCOMP`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d17-b1-mqtt-topic-hierarchy-wildcards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "MQTT QoS Tier Trade-offs",
              "boxes": [
                {
                  "label": "QoS 0 (At Most Once)",
                  "value": "Overhead: 1 packet (PUBLISH) | Guarantee: No ACK -> Best for frequent sensor telemetry",
                  "varType": "Fast Telemetry",
                  "isUpdated": false
                },
                {
                  "label": "QoS 1 (At Least Once)",
                  "value": "Overhead: 2 packets (PUBLISH + PUBACK) | Guarantee: Delivered $\\ge 1$ time -> Standard IoT",
                  "varType": "Standard Delivery",
                  "isUpdated": true
                },
                {
                  "label": "QoS 2 (Exactly Once)",
                  "value": "Overhead: 4 packets (4-way handshake) | Guarantee: Exactly 1 delivery -> Critical Actuation/Billing",
                  "varType": "Zero Duplicates",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "qos_handshake_demo.js",
            "initialCode": "function getQosPacketCount(qosLevel) {\n  if (qosLevel === 0) return { packetsExchanged: 1, flow: 'PUBLISH' };\n  if (qosLevel === 1) return { packetsExchanged: 2, flow: 'PUBLISH -> PUBACK' };\n  return { packetsExchanged: 4, flow: 'PUBLISH -> PUBREC -> PUBREL -> PUBCOMP' };\n}\n\nconsole.log('QoS 1:', JSON.stringify(getQosPacketCount(1)));\nconsole.log('QoS 2:', JSON.stringify(getQosPacketCount(2)));",
            "expectedOutput": "QoS 1: {\"packetsExchanged\":2,\"flow\":\"PUBLISH -> PUBACK\"}\nQoS 2: {\"packetsExchanged\":4,\"flow\":\"PUBLISH -> PUBREC -> PUBREL -> PUBCOMP\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many network packets are exchanged in total for a QoS 2 message delivery?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4 packets",
            "packetsExchanged\":4"
          ],
          "primaryMisconceptionId": "MC_IOT_MQTT_TOPICS_QOS_RETAIN_WILL",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_IOT_MQTT_TOPICS_QOS_RETAIN_WILL",
              "errorExplanation": "2 packets is for QoS 1. QoS 2 requires a 4-packet handshake.",
              "recoveryPath": {
                "simplerExplanation": "QoS 2 uses 4 packets.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "iot-d17-b3-lwt-and-retained-messages",
        "day": 17,
        "blockNumber": 3,
        "title": "Retained Messages & Last Will and Testament (LWT)",
        "conceptBudget": {
          "primaryConcept": "MQTT Retained & LWT Features",
          "supportingTerms": [
            "Retained Message (Broker stores latest payload for new subscribers)",
            "Last Will and Testament (LWT: Broker publishes pre-defined payload on ungraceful TCP disconnect)",
            "Keep-Alive Ping (PINGREQ / PINGRESP)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d17-b2-mqtt-qos-tiers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lwt_demo.js",
            "initialCode": "function evaluateLwtTrigger(disconnectType) {\n  return disconnectType === 'UNGRACEFUL_NETWORK_DROP_OR_CRASH'\n    ? 'BROKER_PUBLISHES_LWT: topic=\"sensors/device_99/status\", payload=\"OFFLINE_CRASH\"'\n    : 'CLEAN_DISCONNECT: LWT_DISCARDED_SILENTLY';\n}\n\nconsole.log(evaluateLwtTrigger('UNGRACEFUL_NETWORK_DROP_OR_CRASH'));\nconsole.log(evaluateLwtTrigger('CLEAN_DISCONNECT_PACKET_SENT'));",
            "expectedOutput": "BROKER_PUBLISHES_LWT: topic=\"sensors/device_99/status\", payload=\"OFFLINE_CRASH\"\nCLEAN_DISCONNECT: LWT_DISCARDED_SILENTLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When does an MQTT broker broadcast a client's Last Will and Testament (LWT) message?",
          "options": [
            "Only when the client disconnects unexpectedly without sending a clean `DISCONNECT` packet (e.g. battery dies, cellular signal drops, or firmware crashes)",
            "Every 5 minutes while connected",
            "Only when the user clicks log out"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_MQTT_TOPICS_QOS_RETAIN_WILL",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_MQTT_TOPICS_QOS_RETAIN_WILL",
              "errorExplanation": "LWT is triggered exclusively on unexpected ungraceful connection drops.",
              "recoveryPath": {
                "simplerExplanation": "Broadcasts when device disconnects unexpectedly without clean DISCONNECT.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "CoAP & Constrained Application Protocol over UDP",
    "overviewMetaphor": "CoAP (Constrained Application Protocol) is HTTP re-engineered for miniature microcontrollers with 16KB of RAM: standard HTTP requires heavy TCP handshakes (1,000+ bytes of headers and TLS overhead); CoAP runs over UDP with a compact 4-byte binary header, bringing familiar REST verbs (`GET`, `POST`, `PUT`, `DELETE`) to low-power embedded devices with 90% less network overhead.",
    "blocks": [
      {
        "id": "iot-d18-b1-coap-4byte-header-anatomy",
        "day": 18,
        "blockNumber": 1,
        "title": "CoAP Header Anatomy & UDP Transport Layer",
        "conceptBudget": {
          "primaryConcept": "CoAP Binary Header Anatomy (RFC 7252)",
          "supportingTerms": [
            "UDP Port 5683 (No TCP handshake delay)",
            "4-Byte Binary Header: Version (2 bits), Type (2 bits: CON, NON, ACK, RST), Token Length (4 bits), Code (8 bits), Message ID (16 bits)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d17-b1-mqtt-topic-hierarchy-wildcards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CoAP 4-Byte Binary Header Layout",
            "codeSnippet": "//  0                   1                   2                   3\n//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1\n// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n// |Ver| T |  TKL  |      Code     |          Message ID           |\n// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+",
            "lineNotes": {
              "4": "Compact 4-byte base header allows ultra-fast parsing on 8-bit/32-bit MCUs."
            }
          },
          {
            "type": "runnable_code",
            "filename": "coap_size_compare.js",
            "initialCode": "function compareHttpVsCoap(payloadBytes = 20) {\n  const httpOverhead = 250; // HTTP/1.1 headers + TCP header\n  const coapOverhead = 4 + 8; // 4-byte CoAP header + 8-byte UDP header\n  return {\n    httpTotalBytes: payloadBytes + httpOverhead,\n    coapTotalBytes: payloadBytes + coapOverhead,\n    bandwidthReductionPercent: Number((((httpOverhead - coapOverhead) / (payloadBytes + httpOverhead)) * 100).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(compareHttpVsCoap(20)));",
            "expectedOutput": "{\"httpTotalBytes\":270,\"coapTotalBytes\":32,\"bandwidthReductionPercent\":88.1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What bandwidth reduction percentage is achieved by CoAP over HTTP for a 20-byte sensor payload?",
          "expectedStringOutput": "88.1",
          "acceptableAnswers": [
            "88.1",
            "88.1%",
            "bandwidthReductionPercent\":88.1"
          ],
          "primaryMisconceptionId": "MC_IOT_COAP_REST_UDP_CONFIRMABLE",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_IOT_COAP_REST_UDP_CONFIRMABLE",
              "errorExplanation": "CoAP cuts total packet size from 270 bytes down to 32 bytes (88.1% savings).",
              "recoveryPath": {
                "simplerExplanation": "Saves 88.1% bandwidth.",
                "guidedFixPrompt": "Type 88.1"
              }
            }
          }
        }
      },
      {
        "id": "iot-d18-b2-con-vs-non-messages",
        "day": 18,
        "blockNumber": 2,
        "title": "Confirmable (CON) vs Non-Confirmable (NON) Messages",
        "conceptBudget": {
          "primaryConcept": "CoAP Message Types",
          "supportingTerms": [
            "Confirmable (CON: Requires ACK with matching Message ID; retransmits with exponential backoff)",
            "Non-Confirmable (NON: Fire-and-forget UDP datagram)",
            "Reset (RST: Rejection of unrecognized packet)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d18-b1-coap-4byte-header-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coap_con_demo.js",
            "initialCode": "function evaluateCoapRetries(type, ackReceived) {\n  if (type === 'NON') return 'NON_CONFIRMABLE: SENT_WITHOUT_ACK_EXPECTATION';\n  if (type === 'CON' && !ackReceived) return 'CON_RETRY: EXPONENTIAL_BACKOFF_RETRANSMISSION_TRIGGERED';\n  return 'CON_SUCCESS: ACK_RECEIVED_MATCHING_MSG_ID';\n}\n\nconsole.log(evaluateCoapRetries('CON', true));\nconsole.log(evaluateCoapRetries('CON', false));",
            "expectedOutput": "CON_SUCCESS: ACK_RECEIVED_MATCHING_MSG_ID\nCON_RETRY: EXPONENTIAL_BACKOFF_RETRANSMISSION_TRIGGERED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when a Confirmable (CON) CoAP message does not receive an ACK?",
          "expectedStringOutput": "CON_RETRY: EXPONENTIAL_BACKOFF_RETRANSMISSION_TRIGGERED",
          "acceptableAnswers": [
            "CON_RETRY: EXPONENTIAL_BACKOFF_RETRANSMISSION_TRIGGERED",
            "CON_RETRY",
            "Retransmission triggered"
          ],
          "primaryMisconceptionId": "MC_IOT_COAP_REST_UDP_CONFIRMABLE",
          "diagnosisMap": {
            "DROP": {
              "misconceptionId": "MC_IOT_COAP_REST_UDP_CONFIRMABLE",
              "errorExplanation": "CON messages trigger exponential backoff retransmission on missing ACKs.",
              "recoveryPath": {
                "simplerExplanation": "Triggers CON_RETRY with exponential backoff.",
                "guidedFixPrompt": "Type CON_RETRY: EXPONENTIAL_BACKOFF_RETRANSMISSION_TRIGGERED"
              }
            }
          }
        }
      },
      {
        "id": "iot-d18-b3-coap-observe-rfc-7641",
        "day": 18,
        "blockNumber": 3,
        "title": "CoAP Observe Pattern (RFC 7641): Server Push over UDP",
        "conceptBudget": {
          "primaryConcept": "CoAP Observe Extension",
          "supportingTerms": [
            "Observe Option (`Observe: 0` in GET request)",
            "Server registers client in observer list",
            "Server pushes asynchronous state changes without client polling",
            "Eliminates wasteful polling loops"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d18-b2-con-vs-non-messages",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coap_observe_demo.js",
            "initialCode": "function explainCoapObserve() {\n  return 'Client sends GET /temp with Observe=0 -> Server automatically pushes notifications whenever temperature changes!';\n}\n\nconsole.log(explainCoapObserve());",
            "expectedOutput": "Client sends GET /temp with Observe=0 -> Server automatically pushes notifications whenever temperature changes!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of the CoAP Observe pattern (RFC 7641) for IoT sensor nodes?",
          "options": [
            "It allows a client to subscribe to a sensor resource with a single GET request; the server then pushes updates only when the sensor value actually changes, eliminating continuous wasteful polling requests",
            "Because CoAP Observe encrypts the hard drive",
            "To convert UDP packets into TCP streams"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_COAP_REST_UDP_CONFIRMABLE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_COAP_REST_UDP_CONFIRMABLE",
              "errorExplanation": "Observe pattern enables server push updates on state change, eliminating polling overhead.",
              "recoveryPath": {
                "simplerExplanation": "Server pushes updates on value change, eliminating polling.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Bluetooth Low Energy (BLE): GATT Profiles, Services & Characteristics",
    "overviewMetaphor": "BLE (Bluetooth Low Energy) is a hospital patient chart: the Peripheral (Smartwatch) broadcasts advertising packets (Beacon); the Central (Smartphone) connects and browses the GATT Profile (Folder of charts); the Folder contains Primary Services (Heart Rate Service: `0x180D`); each Service contains Characteristics (Heart Rate Measurement: `0x2A37`); instead of the phone constantly asking \"What is the pulse now?\", the Watch pushes instant Notifications whenever the heart beats.",
    "blocks": [
      {
        "id": "iot-d19-b1-gatt-profile-hierarchy",
        "day": 19,
        "blockNumber": 1,
        "title": "GATT Architecture: Profiles, Services, Characteristics & Descriptors",
        "conceptBudget": {
          "primaryConcept": "BLE GATT Profile Hierarchy",
          "supportingTerms": [
            "Generic Attribute Profile (GATT)",
            "Primary Service (Group of related data, e.g. Battery Service `0x180F`)",
            "Characteristic (Data value + Permissions: Read, Write, Notify)",
            "Client Characteristic Configuration Descriptor (CCCD: `0x2902` enables notifications)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d9-b1-uart-frame-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GATT Data Hierarchy Structure",
              "boxes": [
                {
                  "label": "Profile: Heart Rate Monitor",
                  "value": "Folder containing Services -> Standardized Bluetooth SIG Profile",
                  "varType": "Profile",
                  "isUpdated": false
                },
                {
                  "label": "Service: Heart Rate (0x180D)",
                  "value": "Contains: Measurement Characteristic (0x2A37) + Sensor Location (0x2A38)",
                  "varType": "Service",
                  "isUpdated": true
                },
                {
                  "label": "Characteristic: HR Measurement",
                  "value": "Value: [Flags, BPM] | Permissions: NOTIFY (Pushes live BPM to phone)",
                  "varType": "Characteristic",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gatt_demo.js",
            "initialCode": "function explainGattTree() {\n  return 'Profile -> Service (0x180D) -> Characteristic (0x2A37: Value + CCCD 0x2902)';\n}\n\nconsole.log(explainGattTree());",
            "expectedOutput": "Profile -> Service (0x180D) -> Characteristic (0x2A37: Value + CCCD 0x2902)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the role of the Client Characteristic Configuration Descriptor (CCCD, UUID `0x2902`) in BLE GATT?",
          "options": [
            "It is a 2-byte descriptor written by the client phone (`0x0001`) to enable asynchronous Notifications on a characteristic, allowing the peripheral to stream live data without polling",
            "It sets the Bluetooth password",
            "It increases antenna signal range"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "Writing 0x0001 to CCCD enables notifications from peripheral to central.",
              "recoveryPath": {
                "simplerExplanation": "Enables asynchronous notifications on a characteristic.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d19-b2-ble-advertising-packet-anatomy",
        "day": 19,
        "blockNumber": 2,
        "title": "BLE Advertising Packets (31-Byte Payload) & Beacons (iBeacon)",
        "conceptBudget": {
          "primaryConcept": "BLE Advertising & Beacons",
          "supportingTerms": [
            "31-Byte Max Advertising Payload (`ADV_IND`)",
            "Advertising Channels (37, 38, 39 to avoid Wi-Fi interference)",
            "iBeacon Protocol (Apple: Proximity UUID + Major + Minor + Measured Tx Power at 1m)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d19-b1-gatt-profile-hierarchy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "adv_packet_demo.js",
            "initialCode": "function calculateDistanceRssi(rssi, txPower1m = -59, pathLossFactor = 2.0) {\n  // Distance = 10 ^ ((TxPower - RSSI) / (10 * n))\n  const ratio = (txPower1m - rssi) / (10 * pathLossFactor);\n  const distanceMeters = Math.pow(10, ratio);\n  return {\n    measuredRssi: rssi,\n    calibratedTxPower1m: txPower1m,\n    estimatedDistanceMeters: Number(distanceMeters.toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(calculateDistanceRssi(-59))); // At 1 meter\nconsole.log(JSON.stringify(calculateDistanceRssi(-75))); // Further away",
            "expectedOutput": "{\"measuredRssi\":-59,\"calibratedTxPower1m\":-59,\"estimatedDistanceMeters\":1}\n{\"measuredRssi\":-75,\"calibratedTxPower1m\":-59,\"estimatedDistanceMeters\":6.31}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the estimated distance (in meters) when the measured RSSI matches the calibrated 1-meter Tx power of -59 dBm?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1m",
            "1 meter",
            "estimatedDistanceMeters\":1"
          ],
          "primaryMisconceptionId": "MC_IOT_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "6.31": {
              "misconceptionId": "MC_IOT_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "When RSSI == TxPower at 1m, distance is exactly 1 meter.",
              "recoveryPath": {
                "simplerExplanation": "Matching 1m Tx power gives 1 meter.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "iot-d19-b3-ble-throughput-connection-intervals",
        "day": 19,
        "blockNumber": 3,
        "title": "Connection Intervals (7.5ms - 4s) & Maximum BLE Throughput",
        "conceptBudget": {
          "primaryConcept": "BLE Connection Intervals & Throughput",
          "supportingTerms": [
            "Connection Interval ($T_{\\text{conn}}$: 7.5ms to 4000ms)",
            "Slave Latency (Number of connection events slave can sleep through without dropping connection)",
            "BLE 5.0 2M PHY & Data Length Extension (DLE: 251-byte MTU)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d19-b2-ble-advertising-packet-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ble_throughput_demo.js",
            "initialCode": "function evaluateBleThroughput(phyMode, connIntervalMs) {\n  return phyMode === '2M_PHY'\n    ? { maxThroughputKbps: 1400, connIntervalMs, latency: 'ULTRA_LOW' }\n    : { maxThroughputKbps: 700, connIntervalMs, latency: 'STANDARD' };\n}\n\nconsole.log(JSON.stringify(evaluateBleThroughput('2M_PHY', 7.5)));",
            "expectedOutput": "{\"maxThroughputKbps\":1400,\"connIntervalMs\":7.5,\"latency\":\"ULTRA_LOW\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum practical throughput (in kbps) achievable with BLE 5.0 2M PHY?",
          "expectedStringOutput": "1400",
          "acceptableAnswers": [
            "1400",
            "1400 kbps",
            "maxThroughputKbps\":1400"
          ],
          "primaryMisconceptionId": "MC_IOT_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
          "diagnosisMap": {
            "700": {
              "misconceptionId": "MC_IOT_BLE_GATT_SERVICES_CHARACTERISTICS_NOTIFY",
              "errorExplanation": "700 kbps is for 1M PHY. 2M PHY doubles throughput up to ~1400 kbps.",
              "recoveryPath": {
                "simplerExplanation": "2M PHY achieves 1400 kbps.",
                "guidedFixPrompt": "Type 1400"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Digital Signal Processing (DSP) & 1D Kalman Filtering",
    "overviewMetaphor": "A 1D Kalman Filter is an intelligent sensor lie detector: your GPS says \"You are at Latitude 40.0001\" (Measurement with electrical noise); your car's speedometer and physics model says \"Given your speed, you must be at Latitude 40.0000\" (Prediction); the Kalman Filter calculates the exact optimal mathematical blend (Kalman Gain $K$) between the noisy sensor and the physics model, outputting a crystal-clear true position without lag.",
    "blocks": [
      {
        "id": "iot-d20-b1-kalman-filter-theory",
        "day": 20,
        "blockNumber": 1,
        "title": "1D Kalman Filter Mathematics: Prediction & Update Steps",
        "conceptBudget": {
          "primaryConcept": "1D Kalman Filter Algorithm",
          "supportingTerms": [
            "State Estimate ($x$)",
            "Error Covariance ($p$)",
            "Process Noise Covariance ($q$)",
            "Measurement Noise Covariance ($r$)",
            "Kalman Gain: $K = \\frac{p}{p + r}$",
            "State Update: $x = x + K(z - x)$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d4-b1-sar-adc-quantization-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "1D Kalman Filter Equations",
            "codeSnippet": "// 1. PREDICTION STEP:\np = p + q;\n\n// 2. MEASUREMENT UPDATE STEP:\nconst k = p / (p + r);  // Optimal Kalman Gain (0.0 to 1.0)\nx = x + k * (measurement - x); // Updated State Estimate\np = (1 - k) * p;        // Updated Error Covariance",
            "lineNotes": {
              "2": "Increases estimation uncertainty over time by process noise q.",
              "5": "Calculates trust ratio between measurement and model.",
              "6": "Updates estimate weighted by Kalman gain k."
            }
          },
          {
            "type": "runnable_code",
            "filename": "kalman_step_demo.js",
            "initialCode": "function runKalmanStep(x, p, measurement, q = 0.01, r = 0.1) {\n  p = p + q;\n  const k = p / (p + r);\n  const updatedX = x + (k * (measurement - x));\n  const updatedP = (1 - k) * p;\n  return {\n    kalmanGainK: Number(k.toFixed(3)),\n    estimatedStateX: Number(updatedX.toFixed(2)),\n    updatedErrorP: Number(updatedP.toFixed(3))\n  };\n}\n\nconsole.log(JSON.stringify(runKalmanStep(20.0, 1.0, 25.0)));",
            "expectedOutput": "{\"kalmanGainK\":0.91,\"estimatedStateX\":24.55,\"updatedErrorP\":0.091}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the Kalman Gain $K = \\frac{p}{p + r}$ dynamically adapt when sensor measurement noise $r$ is extremely high?",
          "options": [
            "When measurement noise $r$ is high, $K$ approaches 0, causing the filter to largely ignore the noisy sensor measurements and trust the internal state model prediction",
            "It turns off the CPU",
            "It causes the filter to oscillate wildly"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
              "errorExplanation": "High noise r drives K -> 0, placing more weight on the model prediction.",
              "recoveryPath": {
                "simplerExplanation": "K approaches 0, trusting the internal model over noisy data.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d20-b2-ema-vs-moving-average",
        "day": 20,
        "blockNumber": 2,
        "title": "Exponential Moving Average (EMA) vs Sliding Window Filter",
        "conceptBudget": {
          "primaryConcept": "Exponential Moving Average (EMA)",
          "supportingTerms": [
            "EMA Formula: $y_n = \\alpha x_n + (1 - \\alpha) y_{n-1}$",
            "Memory Invariant: EMA requires only 1 state variable (4 bytes RAM vs 200-byte array buffer for moving window)",
            "Smoothing factor $\\alpha \\in (0, 1)$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d20-b1-kalman-filter-theory",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ema_filter_demo.js",
            "initialCode": "function evaluateEma(sample, prevEma, alpha = 0.2) {\n  const ema = (alpha * sample) + ((1 - alpha) * prevEma);\n  return Number(ema.toFixed(2));\n}\n\nlet filtered = 20.0;\nconst noisyStream = [25.0, 18.0, 24.0, 20.0];\nfor (const s of noisyStream) filtered = evaluateEma(s, filtered, 0.2);\nconsole.log('Final Smoothed Value:', filtered);",
            "expectedOutput": "Final Smoothed Value: 20.44",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the primary RAM advantage of an Exponential Moving Average (EMA) filter over a 50-sample Moving Average buffer on an MCU?",
          "expectedStringOutput": "20.44",
          "acceptableAnswers": [
            "20.44",
            "Final Smoothed Value: 20.44"
          ],
          "primaryMisconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
          "diagnosisMap": {
            "25": {
              "misconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
              "errorExplanation": "EMA filters smooth toward the true mean (20.44).",
              "recoveryPath": {
                "simplerExplanation": "Smoothed output is 20.44.",
                "guidedFixPrompt": "Type 20.44"
              }
            }
          }
        }
      },
      {
        "id": "iot-d20-b3-cmsis-dsp-accelerators",
        "day": 20,
        "blockNumber": 3,
        "title": "ARM CMSIS-DSP Library & SIMD Hardware Instructions",
        "conceptBudget": {
          "primaryConcept": "CMSIS-DSP Hardware Acceleration",
          "supportingTerms": [
            "ARM Cortex-M4/M7 FPU (Single-precision hardware Floating Point Unit)",
            "SIMD Instructions (`SMLAD`: Dual 16-bit Multiply-Accumulate in 1 cycle)",
            "CMSIS-DSP library (`arm_fir_f32`, `arm_biquad_cascade_df1_f32`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d20-b2-ema-vs-moving-average",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cmsis_dsp_demo.js",
            "initialCode": "function evaluateDspPerformance(hasHardwareFpu) {\n  return hasHardwareFpu\n    ? { cyclesPerFloatMultiply: 1, filterLatencyUs: 1.2, speedup: '15x FASTER' }\n    : { cyclesPerFloatMultiply: 45, filterLatencyUs: 18.0, speedup: 'SOFTWARE_EMULATED' };\n}\n\nconsole.log(JSON.stringify(evaluateDspPerformance(true)));",
            "expectedOutput": "{\"cyclesPerFloatMultiply\":1,\"filterLatencyUs\":1.2,\"speedup\":\"15x FASTER\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the ARM Cortex-M4 Hardware FPU and CMSIS-DSP library accelerate digital signal filtering on microcontrollers?",
          "options": [
            "It executes 32-bit floating point multiplications and dual 16-bit SIMD multiply-accumulate operations in a single hardware clock cycle, executing DSP filters 15x faster than software emulation",
            "By overclocking the battery",
            "By converting analog signals into audio files"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_SENSORS_CALIBRATION_NOISE_KALMAN_FILTER",
              "errorExplanation": "Hardware FPU and SIMD execute float math in 1 cycle without software emulation overhead.",
              "recoveryPath": {
                "simplerExplanation": "Executes float math in 1 hardware clock cycle.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Ultra-Low Power Wireless BLE/MQTT Sensor Node",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete wireless field sensor unit: 1. Microcontroller wakes from Deep Sleep via RTC Alarm; 2. Reads I2C temperature sensor in 2ms; 3. Applies 1D Kalman filter to eliminate analog noise; 4. Transmits BLE GATT notification packet to gateway; 5. Re-enters 2-microamp Deep Sleep; 6. 10-year continuous field battery operation achieved.",
    "blocks": [
      {
        "id": "iot-d21-b1-wireless-sensor-architecture",
        "day": 21,
        "blockNumber": 1,
        "title": "Ultra-Low Power Wireless Node Architectural Cycle",
        "conceptBudget": {
          "primaryConcept": "Wireless Sensor Node Architecture",
          "supportingTerms": [
            "RTC Periodic Wakeup",
            "I2C Sensor Acquisition",
            "1D Kalman Filter Smoothing",
            "BLE GATT Notification",
            "Deep Sleep Return"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d20-b1-kalman-filter-theory",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Wireless Sensor Power & Data Lifecycle",
              "nodes": [
                {
                  "id": "1",
                  "label": "RTC Timer wakes MCU from Deep Sleep (2uA -> 20mA)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "I2C Sensor Read -> 1D Kalman Filter eliminates noise in 2ms",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Transmits BLE GATT Notification packet to Gateway (10ms radio burst)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Re-enters 2uA Deep Sleep mode! (10-Year Field Battery Life Achieved)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "wireless_node_sim.js",
            "initialCode": "function runWirelessNodeCycle() {\n  return {\n    wakeSource: 'RTC_TIMER_ALARM',\n    sensorSampleRead: '24.2 C',\n    kalmanFiltered: '24.0 C',\n    blePacketSent: '0x00180D (HR/Temp Notification)',\n    powerState: 'DEEP_SLEEP_2UA',\n    nodeStatus: 'WIRELESS_SENSOR_NODE_HEALTHY'\n  };\n}\n\nconsole.log(JSON.stringify(runWirelessNodeCycle()));",
            "expectedOutput": "{\"wakeSource\":\"RTC_TIMER_ALARM\",\"sensorSampleRead\":\"24.2 C\",\"kalmanFiltered\":\"24.0 C\",\"blePacketSent\":\"0x00180D (HR/Temp Notification)\",\"powerState\":\"DEEP_SLEEP_2UA\",\"nodeStatus\":\"WIRELESS_SENSOR_NODE_HEALTHY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the operational status of the synthesized wireless sensor node?",
          "expectedStringOutput": "WIRELESS_SENSOR_NODE_HEALTHY",
          "acceptableAnswers": [
            "WIRELESS_SENSOR_NODE_HEALTHY",
            "nodeStatus\":\"WIRELESS_SENSOR_NODE_HEALTHY\""
          ],
          "primaryMisconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
              "errorExplanation": "The node initializes with WIRELESS_SENSOR_NODE_HEALTHY.",
              "recoveryPath": {
                "simplerExplanation": "Matches WIRELESS_SENSOR_NODE_HEALTHY.",
                "guidedFixPrompt": "Type WIRELESS_SENSOR_NODE_HEALTHY"
              }
            }
          }
        }
      },
      {
        "id": "iot-d21-b2-field-energy-budget-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Field Energy Budget Audit & 10-Year Deployment Certification",
        "conceptBudget": {
          "primaryConcept": "Energy Budget SLA Audit",
          "supportingTerms": [
            "Average Current: < 50uA",
            "Active Duration: < 50ms per cycle",
            "10-Year Field Deployment Certification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d21-b1-wireless-sensor-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "energy_audit_demo.js",
            "initialCode": "function auditFieldNode(avgCurrentUa, activeDurationMs) {\n  const passed = avgCurrentUa <= 50.0 && activeDurationMs <= 50.0;\n  return {\n    avgCurrentUa,\n    activeDurationMs,\n    compliant: passed,\n    grade: passed ? 'TEN_YEAR_IOT_FIELD_CERTIFIED' : 'ENERGY_BUDGET_EXCEEDED'\n  };\n}\n\nconsole.log(JSON.stringify(auditFieldNode(32.5, 25.0)));",
            "expectedOutput": "{\"avgCurrentUa\":32.5,\"activeDurationMs\":25,\"compliant\":true,\"grade\":\"TEN_YEAR_IOT_FIELD_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification grade is awarded to the node meeting 32.5uA average current and 25ms active duration?",
          "expectedStringOutput": "TEN_YEAR_IOT_FIELD_CERTIFIED",
          "acceptableAnswers": [
            "TEN_YEAR_IOT_FIELD_CERTIFIED",
            "grade\":\"TEN_YEAR_IOT_FIELD_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
          "diagnosisMap": {
            "EXCEEDED": {
              "misconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
              "errorExplanation": "All metrics exceed targets, qualifying for TEN_YEAR_IOT_FIELD_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards TEN_YEAR_IOT_FIELD_CERTIFIED.",
                "guidedFixPrompt": "Type TEN_YEAR_IOT_FIELD_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "iot-d21-b3-milestone3-iot-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Ultra-Low Power Wireless BLE/MQTT Sensor Node Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Wireless Low-Power Node Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d21-b2-field-energy-budget-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_iot_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Ultra-Low Power Wireless BLE/MQTT Sensor Node [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Ultra-Low Power Wireless BLE/MQTT Sensor Node [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Ultra-Low Power Wireless BLE/MQTT Sensor Node [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Ultra-Low Power Wireless BLE/MQTT Sensor Node [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOT_POWER_MANAGEMENT_DEEP_SLEEP_WAKEUP",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Ultra-Low Power Wireless BLE/MQTT Sensor Node [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Motor Control: Steppers, Servos & H-Bridge Drivers",
    "overviewMetaphor": "An H-Bridge Motor Driver is an electrical railroad junction: a DC motor spins forward when current flows Left-to-Right (+ to -); it spins in reverse when current flows Right-to-Left (- to +); an H-Bridge uses 4 MOSFET switches in the shape of an \"H\"; closing Switches Q1 and Q4 spins the motor forward; closing Switches Q2 and Q3 spins it in reverse; the cardinal rule of H-Bridges is Shoot-Through Prevention: Never turn on Q1 and Q2 at the same time (Dead short-circuit that destroys the MOSFETs!).",
    "blocks": [
      {
        "id": "iot-d22-b1-h-bridge-motor-control",
        "day": 22,
        "blockNumber": 1,
        "title": "Dual H-Bridge Driver Architecture & Shoot-Through Dead-Time",
        "conceptBudget": {
          "primaryConcept": "H-Bridge Motor Driver Circuit",
          "supportingTerms": [
            "4-Transistor H-Bridge (Q1, Q2 High-Side; Q3, Q4 Low-Side)",
            "Forward (Q1 + Q4 ON) vs Reverse (Q2 + Q3 ON)",
            "Shoot-Through Short Circuit Hazard",
            "Dead-Time Insertion ($t_{\\text{dead}} \\approx 500\\text{ns}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d6-b1-pwm-duty-cycle-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "H-Bridge Switch Configurations",
              "boxes": [
                {
                  "label": "1. Forward Drive",
                  "value": "Q1 (High-Side Left) + Q4 (Low-Side Right) CLOSED -> Current flows + to -",
                  "varType": "Forward",
                  "isUpdated": true
                },
                {
                  "label": "2. Reverse Drive",
                  "value": "Q2 (High-Side Right) + Q3 (Low-Side Left) CLOSED -> Current flows - to +",
                  "varType": "Reverse",
                  "isUpdated": false
                },
                {
                  "label": "3. Shoot-Through Hazard",
                  "value": "Q1 + Q3 CLOSED SIMULTANEOUSLY -> Direct power-to-ground short circuit! (Destroys chip)",
                  "varType": "Dead Short",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "h_bridge_sim.js",
            "initialCode": "function evaluateHBridge(q1, q2, q3, q4) {\n  if ((q1 && q3) || (q2 && q4)) {\n    return 'CATASTROPHIC_SHOOT_THROUGH_SHORT_CIRCUIT_PREVENTED';\n  }\n  if (q1 && q4) return 'MOTOR_SPINNING_FORWARD';\n  if (q2 && q3) return 'MOTOR_SPINNING_REVERSE';\n  return 'MOTOR_COASTING_OR_BRAKING';\n}\n\nconsole.log('Q1+Q4 ON:', evaluateHBridge(1, 0, 0, 1));\nconsole.log('Q2+Q3 ON:', evaluateHBridge(0, 1, 1, 0));\nconsole.log('Q1+Q3 Fault:', evaluateHBridge(1, 0, 1, 0));",
            "expectedOutput": "Q1+Q4 ON: MOTOR_SPINNING_FORWARD\nQ2+Q3 ON: MOTOR_SPINNING_REVERSE\nQ1+Q3 Fault: CATASTROPHIC_SHOOT_THROUGH_SHORT_CIRCUIT_PREVENTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do hardware PWM timer channels on motor-control MCUs (like STM32 Advanced Timers TIM1/TIM8) generate complementary outputs with automatic Dead-Time insertion?",
          "options": [
            "To insert a tiny delay (e.g. 500ns) between turning off the high-side MOSFET and turning on the low-side MOSFET, ensuring both transistors are never on simultaneously during switching transitions (Shoot-Through prevention)",
            "To speed up the motor by 1000 RPM",
            "Because motors cannot spin without dead-time"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_ACTUATORS_SERVO_STEPPER_H_BRIDGE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_ACTUATORS_SERVO_STEPPER_H_BRIDGE",
              "errorExplanation": "Dead-time insertion prevents simultaneous conduction (shoot-through) during transistor switching.",
              "recoveryPath": {
                "simplerExplanation": "Inserts delay to prevent shoot-through short-circuits.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d22-b2-stepper-motor-microstepping",
        "day": 22,
        "blockNumber": 2,
        "title": "Stepper Motors: Full-Step, Half-Step & 1/16 Microstepping (A4988 / TMC2209)",
        "conceptBudget": {
          "primaryConcept": "Stepper Motor Microstepping",
          "supportingTerms": [
            "Step Angle (1.8° per step = 200 steps per revolution)",
            "A4988 STEP/DIR interface",
            "Microstepping (Sine/Cosine current modulation for silent smooth rotation without resonance vibrations)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d22-b1-h-bridge-motor-control",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stepper_calc_demo.js",
            "initialCode": "function calculateMicrosteps(revolutions, baseStepsPerRev = 200, microstepDivision = 16) {\n  const totalPulses = revolutions * baseStepsPerRev * microstepDivision;\n  return {\n    revolutions,\n    microstepMode: `1/${microstepDivision} Microstepping`,\n    totalStepPulsesRequired: totalPulses,\n    angularResolutionDegrees: Number((1.8 / microstepDivision).toFixed(4))\n  };\n}\n\nconsole.log(JSON.stringify(calculateMicrosteps(5, 200, 16)));",
            "expectedOutput": "{\"revolutions\":5,\"microstepMode\":\"1/16 Microstepping\",\"totalStepPulsesRequired\":16000,\"angularResolutionDegrees\":0.1125}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total step pulses are required to rotate a standard stepper motor 5 full revolutions in 1/16 microstepping mode ($5 \\times 200 \\times 16$)?",
          "expectedStringOutput": "16000",
          "acceptableAnswers": [
            "16000",
            "16,000",
            "totalStepPulsesRequired\":16000"
          ],
          "primaryMisconceptionId": "MC_IOT_ACTUATORS_SERVO_STEPPER_H_BRIDGE",
          "diagnosisMap": {
            "1000": {
              "misconceptionId": "MC_IOT_ACTUATORS_SERVO_STEPPER_H_BRIDGE",
              "errorExplanation": "5 * 200 * 16 = 16,000 step pulses.",
              "recoveryPath": {
                "simplerExplanation": "5 * 200 * 16 = 16000.",
                "guidedFixPrompt": "Type 16000"
              }
            }
          }
        }
      },
      {
        "id": "iot-d22-b3-rc-servo-50hz-pwm-timing",
        "day": 22,
        "blockNumber": 3,
        "title": "RC Servo Control: 50Hz (20ms) PWM Pulse Width Modulation",
        "conceptBudget": {
          "primaryConcept": "RC Servo Pulse Width Standard",
          "supportingTerms": [
            "Standard 50Hz PWM frequency (20ms period)",
            "Pulse Width: 1.0ms (0° full left), 1.5ms (90° center), 2.0ms (180° full right)",
            "Closed-loop internal potentiometer feedback"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d22-b2-stepper-motor-microstepping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "servo_timing_demo.js",
            "initialCode": "function getServoPulseMs(angleDeg) {\n  const clamped = Math.max(0, Math.min(180, angleDeg));\n  const pulseMs = 1.0 + ((clamped / 180) * 1.0); // 1.0ms to 2.0ms\n  return {\n    angle: clamped,\n    pulseDurationMs: Number(pulseMs.toFixed(2)),\n    pwmPeriodMs: 20.0\n  };\n}\n\nconsole.log(JSON.stringify(getServoPulseMs(0)));\nconsole.log(JSON.stringify(getServoPulseMs(90)));\nconsole.log(JSON.stringify(getServoPulseMs(180)));",
            "expectedOutput": "{\"angle\":0,\"pulseDurationMs\":1,\"pwmPeriodMs\":20}\n{\"angle\":90,\"pulseDurationMs\":1.5,\"pwmPeriodMs\":20}\n{\"angle\":180,\"pulseDurationMs\":2,\"pwmPeriodMs\":20}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pulse width (in ms) positions a standard RC servo motor at its exact 90° center point?",
          "expectedStringOutput": "1.5",
          "acceptableAnswers": [
            "1.5",
            "1.5ms",
            "pulseDurationMs\":1.5"
          ],
          "primaryMisconceptionId": "MC_IOT_ACTUATORS_SERVO_STEPPER_H_BRIDGE",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_IOT_ACTUATORS_SERVO_STEPPER_H_BRIDGE",
              "errorExplanation": "1.0ms is for 0°. 90° center requires a 1.5ms pulse width.",
              "recoveryPath": {
                "simplerExplanation": "Center 90° requires 1.5ms pulse.",
                "guidedFixPrompt": "Type 1.5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Non-Volatile Memory: EEPROM & Flash Wear-Leveling",
    "overviewMetaphor": "Flash Memory is a whiteboard made of fine sandstone: EEPROM allows you to erase and rewrite individual letters (1 byte at a time up to 1,000,000 times); Flash Memory requires you to erase an entire chalkboard paragraph (4KB Sector Erase: turning all bits to 1s) before writing new data; after 10,000 to 100,000 sector erases, the silicon oxide layer wears out permanently; Flash Wear-Leveling rotates writes in a circle across all sectors, preventing premature flash burnout.",
    "blocks": [
      {
        "id": "iot-d23-b1-eeprom-vs-nor-nand-flash",
        "day": 23,
        "blockNumber": 1,
        "title": "Non-Volatile Memory Comparison: EEPROM, NOR Flash & NAND Flash",
        "conceptBudget": {
          "primaryConcept": "NVM Silicon Architecture",
          "supportingTerms": [
            "EEPROM (Byte-erasable, 1M erase cycles: perfect for calibration parameters)",
            "NOR Flash (Execute-In-Place XIP, sector-erasable, 100k cycles: firmware storage)",
            "NAND Flash (Block-erasable, high density: gigabyte storage)",
            "The Bit Rule: Flash bits can be written from 1 to 0 individually, but can ONLY be reset to 1 via an entire Sector Erase"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "NVM Technologies Comparison",
              "boxes": [
                {
                  "label": "1. EEPROM (I2C 24LC256)",
                  "value": "Erase: Byte-level | Endurance: 1,000,000 cycles | Use: WiFi creds, device serial number",
                  "varType": "High Endurance",
                  "isUpdated": false
                },
                {
                  "label": "2. NOR Flash (SPI W25Q128)",
                  "value": "Erase: 4KB Sector | Endurance: 100,000 cycles | Use: Firmware binary code execution",
                  "varType": "Execute-In-Place",
                  "isUpdated": true
                },
                {
                  "label": "3. NAND Flash (SD Card / eMMC)",
                  "value": "Erase: 128KB Block | Endurance: 3,000 cycles | Use: Massive audio/video logging",
                  "varType": "High Density",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nvm_compare_demo.js",
            "initialCode": "function selectNvmType(useCase) {\n  if (useCase === 'CONFIG_STORE_DAILY_WRITES') return 'EEPROM (1,000,000 cycles byte-level write)';\n  if (useCase === 'FIRMWARE_XIP_EXECUTION') return 'NOR_FLASH (Direct instruction fetch)';\n  return 'NAND_FLASH';\n}\n\nconsole.log(selectNvmType('CONFIG_STORE_DAILY_WRITES'));\nconsole.log(selectNvmType('FIRMWARE_XIP_EXECUTION'));",
            "expectedOutput": "EEPROM (1,000,000 cycles byte-level write)\nNOR_FLASH (Direct instruction fetch)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why can NOR Flash memory not overwrite an existing data byte directly from `0x00` back to `0xFF` without performing a Sector Erase?",
          "options": [
            "Because Flash memory cells can only program bits from 1 to 0 by injecting electrons into the floating gate; removing those electrons to return bits back to 1 requires a high-voltage block/sector erase across the entire 4KB sector",
            "Because NOR Flash is read-only",
            "Because SPI cables cannot transmit 1s"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_STORAGE_EEPROM_FLASH_WEAR_LEVELING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_STORAGE_EEPROM_FLASH_WEAR_LEVELING",
              "errorExplanation": "Electron discharge requires high-voltage sector erasure across 4KB blocks.",
              "recoveryPath": {
                "simplerExplanation": "Requires high-voltage erase to clear floating gate back to 1s.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d23-b2-wear-leveling-circular-logs",
        "day": 23,
        "blockNumber": 2,
        "title": "Wear-Leveling Algorithms: Circular Append Logs & LittleFS",
        "conceptBudget": {
          "primaryConcept": "Flash Wear-Leveling Techniques",
          "supportingTerms": [
            "Append-Only Circular Log (Never rewrite the same flash address; append new state with incrementing sequence number)",
            "Dynamic vs Static Wear-Leveling",
            "Power-Fail Safe File Systems (LittleFS / FatFS)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d23-b1-eeprom-vs-nor-nand-flash",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "wear_level_demo.js",
            "initialCode": "function calculateFlashLifeYears(writesPerDay, sectorEndurance = 100000, sectorCount = 10) {\n  const totalAllowedWrites = sectorEndurance * sectorCount;\n  const lifespanYears = totalAllowedWrites / (writesPerDay * 365.25);\n  return {\n    writesPerDay,\n    sectorCount,\n    wearLevelingLifespanYears: Number(lifespanYears.toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateFlashLifeYears(100, 100000, 10))); // 100 writes/day across 10 sectors",
            "expectedOutput": "{\"writesPerDay\":100,\"sectorCount\":10,\"wearLevelingLifespanYears\":27.4}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the expected operating life (in years) of a 10-sector wear-leveled flash system receiving 100 writes per day?",
          "expectedStringOutput": "27.4",
          "acceptableAnswers": [
            "27.4",
            "27.4 years",
            "wearLevelingLifespanYears\":27.4"
          ],
          "primaryMisconceptionId": "MC_IOT_STORAGE_EEPROM_FLASH_WEAR_LEVELING",
          "diagnosisMap": {
            "2.7": {
              "misconceptionId": "MC_IOT_STORAGE_EEPROM_FLASH_WEAR_LEVELING",
              "errorExplanation": "2.7 years is for a single un-leveled sector. 10 wear-leveled sectors extends life to 27.4 years.",
              "recoveryPath": {
                "simplerExplanation": "10 sectors * 100,000 / (100 * 365.25) = 27.4 years.",
                "guidedFixPrompt": "Type 27.4"
              }
            }
          }
        }
      },
      {
        "id": "iot-d23-b3-power-cut-atomic-writes",
        "day": 23,
        "blockNumber": 3,
        "title": "Power-Cut Resilience & Atomic Metadata Records",
        "conceptBudget": {
          "primaryConcept": "Power-Cut Resilient Flash Operations",
          "supportingTerms": [
            "Sudden Power Loss Hazard (Writing half a byte when power dies corrupts metadata)",
            "Two-Phase Commit Record (`READY -> WRITTEN -> COMMITTED`)",
            "CRC32 Checksum Validation on Boot"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d23-b2-wear-leveling-circular-logs",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "flash_powercut_demo.js",
            "initialCode": "function validateFlashRecord(recordCrc, calculatedCrc, commitMagic) {\n  const isValid = (recordCrc === calculatedCrc) && (commitMagic === 0xAA55);\n  return isValid\n    ? 'FLASH_RECORD_VALID_AND_COMMITTED'\n    : 'CORRUPTED_MID_WRITE_POWER_CUT: ROLLBACK_TO_PREVIOUS_RECORD';\n}\n\nconsole.log(validateFlashRecord(0x1234, 0x1234, 0xAA55));\nconsole.log(validateFlashRecord(0x1234, 0x9999, 0xAA55));",
            "expectedOutput": "FLASH_RECORD_VALID_AND_COMMITTED\nCORRUPTED_MID_WRITE_POWER_CUT: ROLLBACK_TO_PREVIOUS_RECORD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the bootloader when a flash record has a mismatched CRC from an interrupted mid-write power cut?",
          "expectedStringOutput": "CORRUPTED_MID_WRITE_POWER_CUT: ROLLBACK_TO_PREVIOUS_RECORD",
          "acceptableAnswers": [
            "CORRUPTED_MID_WRITE_POWER_CUT: ROLLBACK_TO_PREVIOUS_RECORD",
            "ROLLBACK_TO_PREVIOUS_RECORD",
            "Rollback"
          ],
          "primaryMisconceptionId": "MC_IOT_STORAGE_EEPROM_FLASH_WEAR_LEVELING",
          "diagnosisMap": {
            "ACCEPT": {
              "misconceptionId": "MC_IOT_STORAGE_EEPROM_FLASH_WEAR_LEVELING",
              "errorExplanation": "Corrupted CRC records must trigger an automatic rollback to the previous valid record.",
              "recoveryPath": {
                "simplerExplanation": "Rolls back: CORRUPTED_MID_WRITE_POWER_CUT: ROLLBACK_TO_PREVIOUS_RECORD.",
                "guidedFixPrompt": "Type CORRUPTED_MID_WRITE_POWER_CUT: ROLLBACK_TO_PREVIOUS_RECORD"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Over-The-Air (OTA) Firmware Updates & Dual-Bank Bootloaders",
    "overviewMetaphor": "Dual-Bank OTA Bootloading is changing an airplane engine mid-flight: the aircraft flies normally on Slot 0 (Active Engine); over the cellular radio, the flight computer downloads the new software update into Slot 1 (Spare Engine) in the background; on the next reboot, the Bootloader tests Slot 1; if Slot 1 crashes within 10 seconds (Watchdog trip), the Bootloader automatically flips back to Slot 0 in 50 milliseconds, ensuring remote devices in the desert never brick.",
    "blocks": [
      {
        "id": "iot-d24-b1-dual-bank-flash-partitioning",
        "day": 24,
        "blockNumber": 1,
        "title": "Dual-Bank Flash Partitioning & Bootloader State Machines",
        "conceptBudget": {
          "primaryConcept": "Dual-Bank OTA Architecture",
          "supportingTerms": [
            "Bootloader Sector (`0x08000000`)",
            "Slot 0 (Active Primary Firmware `0x08020000`)",
            "Slot 1 (Secondary OTA Staging Bank `0x080A0000`)",
            "NVM Boot Flags (`OTA_IMG_NEW`, `OTA_IMG_TEST`, `OTA_IMG_VALID`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d23-b1-eeprom-vs-nor-nand-flash",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Dual-Bank Flash Layout",
              "boxes": [
                {
                  "label": "0x08000000 - 0x0801FFFF (128KB)",
                  "value": "Secure Bootloader (Immutable gold image with hardware crypto engine)",
                  "varType": "Bootloader",
                  "isUpdated": false
                },
                {
                  "label": "0x08020000 - 0x0809FFFF (512KB)",
                  "value": "Slot 0: Active Production Firmware (Running application)",
                  "varType": "Bank A (Active)",
                  "isUpdated": false
                },
                {
                  "label": "0x080A0000 - 0x0811FFFF (512KB)",
                  "value": "Slot 1: OTA Target Staging Bank (Receives binary over radio)",
                  "varType": "Bank B (OTA)",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dual_bank_demo.js",
            "initialCode": "function evaluateBootSlot(otaDownloaded, otaVerified) {\n  return (otaDownloaded && otaVerified)\n    ? 'BOOT_SLOT_1_NEW_IMAGE (In Trial Boot Mode)'\n    : 'BOOT_SLOT_0_ACTIVE_IMAGE (Standard Boot)';\n}\n\nconsole.log(evaluateBootSlot(true, true));\nconsole.log(evaluateBootSlot(true, false));",
            "expectedOutput": "BOOT_SLOT_1_NEW_IMAGE (In Trial Boot Mode)\nBOOT_SLOT_0_ACTIVE_IMAGE (Standard Boot)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which slot does the bootloader boot into when a newly downloaded OTA image is successfully verified?",
          "expectedStringOutput": "BOOT_SLOT_1_NEW_IMAGE (In Trial Boot Mode)",
          "acceptableAnswers": [
            "BOOT_SLOT_1_NEW_IMAGE (In Trial Boot Mode)",
            "BOOT_SLOT_1",
            "Slot 1"
          ],
          "primaryMisconceptionId": "MC_IOT_OTA_DUAL_BANK_ROLLBACK_SECURE_BOOT",
          "diagnosisMap": {
            "SLOT_0": {
              "misconceptionId": "MC_IOT_OTA_DUAL_BANK_ROLLBACK_SECURE_BOOT",
              "errorExplanation": "Verified new images boot into Slot 1 for trial execution.",
              "recoveryPath": {
                "simplerExplanation": "Boots into Slot 1 for testing.",
                "guidedFixPrompt": "Type BOOT_SLOT_1_NEW_IMAGE (In Trial Boot Mode)"
              }
            }
          }
        }
      },
      {
        "id": "iot-d24-b2-watchdog-trial-boot-rollback",
        "day": 24,
        "blockNumber": 2,
        "title": "Self-Test Trial Boot & Automatic Watchdog Rollback",
        "conceptBudget": {
          "primaryConcept": "OTA Automatic Rollback Protocol",
          "supportingTerms": [
            "Trial Boot State (`OTA_STATE_TESTING`)",
            "Confirm Image API (`esp_ota_mark_app_valid_cancel_rollback()`)",
            "Watchdog Auto-Rollback (If new firmware crashes before calling confirmation API, bootloader marks image `INVALID` and reboots to Slot 0)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d24-b1-dual-bank-flash-partitioning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "OTA Trial Boot & Rollback State Machine",
              "nodes": [
                {
                  "id": "1",
                  "label": "Bootloader launches Slot 1 in TRIAL_MODE",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Firmware runs 10s Self-Test (Connects WiFi, tests sensors)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "PASSED: Firmware calls mark_app_valid() -> Slot 1 committed permanently!",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "CRASHED: Watchdog resets MCU -> Bootloader rolls back to Slot 0! (Zero Bricked Devices)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ota_rollback_sim.js",
            "initialCode": "function evaluateOtaHealth(didSelfTestPass) {\n  return didSelfTestPass\n    ? 'OTA_COMMITTED: NEW_FIRMWARE_PERMANENTLY_CONFIRMED'\n    : 'OTA_ROLLBACK_TRIGGERED: BOOTLOADER_REVERTS_TO_SLOT_0_GOLD_IMAGE';\n}\n\nconsole.log('Self-Test Passed:', evaluateOtaHealth(true));\nconsole.log('Self-Test Crash:', evaluateOtaHealth(false));",
            "expectedOutput": "Self-Test Passed: OTA_COMMITTED: NEW_FIRMWARE_PERMANENTLY_CONFIRMED\nSelf-Test Crash: OTA_ROLLBACK_TRIGGERED: BOOTLOADER_REVERTS_TO_SLOT_0_GOLD_IMAGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the bootloader if the newly updated firmware crashes during its trial self-test boot?",
          "expectedStringOutput": "OTA_ROLLBACK_TRIGGERED: BOOTLOADER_REVERTS_TO_SLOT_0_GOLD_IMAGE",
          "acceptableAnswers": [
            "OTA_ROLLBACK_TRIGGERED: BOOTLOADER_REVERTS_TO_SLOT_0_GOLD_IMAGE",
            "OTA_ROLLBACK_TRIGGERED",
            "Reverts to slot 0"
          ],
          "primaryMisconceptionId": "MC_IOT_OTA_DUAL_BANK_ROLLBACK_SECURE_BOOT",
          "diagnosisMap": {
            "BRICK": {
              "misconceptionId": "MC_IOT_OTA_DUAL_BANK_ROLLBACK_SECURE_BOOT",
              "errorExplanation": "Dual-bank bootloaders roll back to the golden Slot 0 image on crash.",
              "recoveryPath": {
                "simplerExplanation": "Rolls back: OTA_ROLLBACK_TRIGGERED: BOOTLOADER_REVERTS_TO_SLOT_0_GOLD_IMAGE.",
                "guidedFixPrompt": "Type OTA_ROLLBACK_TRIGGERED: BOOTLOADER_REVERTS_TO_SLOT_0_GOLD_IMAGE"
              }
            }
          }
        }
      },
      {
        "id": "iot-d24-b3-differential-delta-firmware-updates",
        "day": 24,
        "blockNumber": 3,
        "title": "Differential Delta Firmware Updates (BSDiff / JOBL)",
        "conceptBudget": {
          "primaryConcept": "Delta Firmware Compression",
          "supportingTerms": [
            "Full Binary Download: 1MB payload ($0.50 cellular cost per device)",
            "Differential Delta Patch: 15KB binary difference patch (98% cellular bandwidth savings)",
            "In-place patch reconstructor algorithm"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d24-b2-watchdog-trial-boot-rollback",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "delta_patch_demo.js",
            "initialCode": "function calculateFleetUpdateSavings(fleetSize, fullMb = 1.0, deltaKb = 20) {\n  const fullTotalMb = fleetSize * fullMb;\n  const deltaTotalMb = (fleetSize * deltaKb) / 1024;\n  return {\n    fleetSize,\n    fullUpdateTotalMb: fullTotalMb,\n    deltaUpdateTotalMb: Number(deltaTotalMb.toFixed(1)),\n    cellularDataSavedMb: Number((fullTotalMb - deltaTotalMb).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateFleetUpdateSavings(10000))); // 10,000 vehicle fleet",
            "expectedOutput": "{\"fleetSize\":10000,\"fullUpdateTotalMb\":10000,\"deltaUpdateTotalMb\":195.3,\"cellularDataSavedMb\":9804.7}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many Megabytes of cellular data are saved when updating a fleet of 10,000 IoT devices with a 20KB delta patch instead of 1MB full binary?",
          "expectedStringOutput": "9804.7",
          "acceptableAnswers": [
            "9804.7",
            "9804.7 MB",
            "cellularDataSavedMb\":9804.7"
          ],
          "primaryMisconceptionId": "MC_IOT_OTA_DUAL_BANK_ROLLBACK_SECURE_BOOT",
          "diagnosisMap": {
            "5000": {
              "misconceptionId": "MC_IOT_OTA_DUAL_BANK_ROLLBACK_SECURE_BOOT",
              "errorExplanation": "10,000 MB - 195.3 MB = 9,804.7 MB saved.",
              "recoveryPath": {
                "simplerExplanation": "Saves 9,804.7 MB of bandwidth.",
                "guidedFixPrompt": "Type 9804.7"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Hardware Security: Secure Boot, Root of Trust & Cryptographic Accelerators",
    "overviewMetaphor": "Hardware Secure Boot is a silicon passport control checkpoint: when the chip powers on, the ROM Bootloader (Burned permanently into silicon at the TSMC semiconductor factory) uses a hardware cryptographic accelerator to verify the digital signature (ECDSA) on the firmware binary using a Public Key locked inside physical eFuses; if an attacker modifies even a single bit of firmware code, the signature fails and the silicon refuses to execute, stopping hackers from installing malicious botnets.",
    "blocks": [
      {
        "id": "iot-d25-b1-hardware-root-of-trust-efuses",
        "day": 25,
        "blockNumber": 1,
        "title": "Hardware Root of Trust (RoT) & One-Time Programmable eFuses",
        "conceptBudget": {
          "primaryConcept": "Hardware Root of Trust & eFuses",
          "supportingTerms": [
            "Immutable Mask ROM Bootloader (Burned during silicon manufacturing)",
            "eFuses (One-Time Programmable microscopic silicon fuses blown with high current)",
            "SHA-256 Digest of OEM Public Key locked inside eFuse registers",
            "Anti-Rollback Version Counter"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Hardware Security Chain of Trust",
              "boxes": [
                {
                  "label": "1. Silicon Mask ROM",
                  "value": "Immutable factory code -> Measures OEM Public Key in eFuse",
                  "varType": "Root of Trust",
                  "isUpdated": false
                },
                {
                  "label": "2. eFuse Key Storage",
                  "value": "Permanently blown silicon fuses -> Read/Write locked forever",
                  "varType": "Hardware Keys",
                  "isUpdated": false
                },
                {
                  "label": "3. Application Firmware",
                  "value": "Signed by OEM Private Key -> Verified by ROM before execution",
                  "varType": "Secure App",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rot_demo.js",
            "initialCode": "function evaluateChainOfTrust(isEfuseBurned, isSignatureValid) {\n  if (!isEfuseBurned) return 'SECURITY_WARNING: EFUSE_NOT_BLOWN_ROOT_OF_TRUST_OPEN';\n  if (!isSignatureValid) return 'BOOT_HALTED: SIGNATURE_INVALID_UNTRUSTED_FIRMWARE_REJECTED';\n  return 'SECURE_BOOT_VERIFIED: CHAIN_OF_TRUST_ESTABLISHED';\n}\n\nconsole.log(evaluateChainOfTrust(true, true));\nconsole.log(evaluateChainOfTrust(true, false));",
            "expectedOutput": "SECURE_BOOT_VERIFIED: CHAIN_OF_TRUST_ESTABLISHED\nBOOT_HALTED: SIGNATURE_INVALID_UNTRUSTED_FIRMWARE_REJECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the Secure Boot ROM if the firmware image signature fails verification against the eFuse public key?",
          "expectedStringOutput": "BOOT_HALTED: SIGNATURE_INVALID_UNTRUSTED_FIRMWARE_REJECTED",
          "acceptableAnswers": [
            "BOOT_HALTED: SIGNATURE_INVALID_UNTRUSTED_FIRMWARE_REJECTED",
            "BOOT_HALTED",
            "Firmware rejected"
          ],
          "primaryMisconceptionId": "MC_IOT_SECURITY_HARDWARE_ROOT_OF_TRUST_CRYPTO",
          "diagnosisMap": {
            "BOOT": {
              "misconceptionId": "MC_IOT_SECURITY_HARDWARE_ROOT_OF_TRUST_CRYPTO",
              "errorExplanation": "Invalid signatures halt execution immediately (BOOT_HALTED).",
              "recoveryPath": {
                "simplerExplanation": "Halts boot: BOOT_HALTED: SIGNATURE_INVALID_UNTRUSTED_FIRMWARE_REJECTED.",
                "guidedFixPrompt": "Type BOOT_HALTED: SIGNATURE_INVALID_UNTRUSTED_FIRMWARE_REJECTED"
              }
            }
          }
        }
      },
      {
        "id": "iot-d25-b2-flash-encryption-aes-xts",
        "day": 25,
        "blockNumber": 2,
        "title": "Transparent Flash Encryption: AES-XTS-256 On-the-Fly",
        "conceptBudget": {
          "primaryConcept": "Transparent Flash Encryption",
          "supportingTerms": [
            "External SPI Flash Sniffing Hazard (Attacker clips logic analyzer to flash chip to steal firmware)",
            "Hardware Flash Decryption Engine (AES-256-XTS decrypts instructions in 1 clock cycle as they stream into CPU cache)",
            "Physical readout protection (RDP Level 2)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d25-b1-hardware-root-of-trust-efuses",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "flash_encryption_demo.js",
            "initialCode": "function evaluatePhysicalSniffing(isEncryptionActive) {\n  return isEncryptionActive\n    ? 'PHYSICAL_PROBE_SAFE: SPI_BUS_SHOWS_AES_PSEUDORANDOM_CIPHERTEXT'\n    : 'CRITICAL_VULNERABILITY: SPI_BUS_REVEALS_PLAINTEXT_FIRMWARE_AND_KEYS';\n}\n\nconsole.log(evaluatePhysicalSniffing(true));\nconsole.log(evaluatePhysicalSniffing(false));",
            "expectedOutput": "PHYSICAL_PROBE_SAFE: SPI_BUS_SHOWS_AES_PSEUDORANDOM_CIPHERTEXT\nCRITICAL_VULNERABILITY: SPI_BUS_REVEALS_PLAINTEXT_FIRMWARE_AND_KEYS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does Hardware Flash Encryption protect IoT devices against physical logic-analyzer sniffing attacks?",
          "options": [
            "It stores the entire firmware binary encrypted on the SPI Flash chip; the hardware decryption engine automatically decrypts instructions on-the-fly inside the MCU silicon boundary, ensuring physical probe pins only see meaningless pseudorandom ciphertext",
            "By melting the SPI pins",
            "By hiding the Flash chip under paint"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_SECURITY_HARDWARE_ROOT_OF_TRUST_CRYPTO",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_SECURITY_HARDWARE_ROOT_OF_TRUST_CRYPTO",
              "errorExplanation": "On-the-fly hardware decryption keeps external bus lines completely ciphered.",
              "recoveryPath": {
                "simplerExplanation": "Encrypts flash so external probe pins only see ciphertext.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d25-b3-secure-elements-atecc608",
        "day": 25,
        "blockNumber": 3,
        "title": "Hardware Secure Elements: ATECC608 & TPM Side-Channel Defense",
        "conceptBudget": {
          "primaryConcept": "Hardware Secure Elements",
          "supportingTerms": [
            "Secure Element (ATECC608A / Optiga Trust M over I2C)",
            "Tamper Resistance: Active metal shields, glitch detectors, differential power analysis (DPA) countermeasures",
            "Zero Key Exposure: Private keys never leave the secure element chip"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d25-b2-flash-encryption-aes-xts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "secure_element_demo.js",
            "initialCode": "function signMessageWithSecureElement(payloadHash) {\n  return {\n    payloadHash,\n    signatureECDSA: '0x3045022100... (Generated inside secure enclave)',\n    privateKeyExposedToHostCpu: false,\n    tamperResistanceActive: true\n  };\n}\n\nconsole.log(JSON.stringify(signMessageWithSecureElement('0xAABBCCDD')));",
            "expectedOutput": "{\"payloadHash\":\"0xAABBCCDD\",\"signatureECDSA\":\"0x3045022100... (Generated inside secure enclave)\",\"privateKeyExposedToHostCpu\":false,\"tamperResistanceActive\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the device private key ever exposed into host MCU RAM during Secure Element cryptographic operations?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "No",
            "privateKeyExposedToHostCpu\":false"
          ],
          "primaryMisconceptionId": "MC_IOT_SECURITY_HARDWARE_ROOT_OF_TRUST_CRYPTO",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_IOT_SECURITY_HARDWARE_ROOT_OF_TRUST_CRYPTO",
              "errorExplanation": "Private keys never leave the secure element enclave, remaining protected from host MCU bugs.",
              "recoveryPath": {
                "simplerExplanation": "Private keys are never exposed: false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "CAN Bus (Controller Area Network) & Automotive Differential Signaling",
    "overviewMetaphor": "CAN Bus is an emergency boardroom meeting where everyone speaks at the same time: all cars and factory robots connect to 2 twisted wires (CAN_High & CAN_Low); Dominant bit (0: 2.0V difference) shouts over Recessive bit (1: 0V difference); if the Braking System (ID `0x010`) and the Radio (ID `0x500`) transmit at the exact same microsecond, the lower numeric ID (Braking System) wins Bitwise Arbitration instantly without corrupting a single bit of message data!",
    "blocks": [
      {
        "id": "iot-d26-b1-can-differential-signaling",
        "day": 26,
        "blockNumber": 1,
        "title": "CAN Physical Layer: Differential Voltages & Common-Mode Noise",
        "conceptBudget": {
          "primaryConcept": "CAN Physical Layer (ISO 11898)",
          "supportingTerms": [
            "CAN_H & CAN_L over $120\\Omega$ Twisted Pair cable",
            "Recessive State (Bit 1: CAN_H = 2.5V, CAN_L = 2.5V, $\\Delta V = 0\\text{V}$)",
            "Dominant State (Bit 0: CAN_H = 3.5V, CAN_L = 1.5V, $\\Delta V = 2.0\\text{V}$)",
            "Common-Mode Noise Rejection (Engine spark ignition noise cancels out)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d2-b1-push-pull-vs-open-drain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CAN Bus Voltage Levels",
              "boxes": [
                {
                  "label": "1. Recessive Bit (Logic 1)",
                  "value": "CAN_H: 2.5V | CAN_L: 2.5V | Differential: 0.0V -> Bus is idle or floating",
                  "varType": "Recessive 1",
                  "isUpdated": false
                },
                {
                  "label": "2. Dominant Bit (Logic 0)",
                  "value": "CAN_H: 3.5V | CAN_L: 1.5V | Differential: +2.0V -> Actively driven (Wins bus)",
                  "varType": "Dominant 0",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "can_volt_demo.js",
            "initialCode": "function evaluateCanDiff(canH, canL) {\n  const diff = canH - canL;\n  return diff >= 1.5\n    ? 'DOMINANT_BIT_0 (Differential Voltage = ' + diff.toFixed(1) + 'V)'\n    : 'RECESSIVE_BIT_1 (Differential Voltage = ' + diff.toFixed(1) + 'V)';\n}\n\nconsole.log(evaluateCanDiff(3.5, 1.5));\nconsole.log(evaluateCanDiff(2.5, 2.5));",
            "expectedOutput": "DOMINANT_BIT_0 (Differential Voltage = 2.0V)\nRECESSIVE_BIT_1 (Differential Voltage = 0.0V)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What logic bit is detected on a CAN bus when CAN_H is 3.5V and CAN_L is 1.5V (Differential = 2.0V)?",
          "expectedStringOutput": "DOMINANT_BIT_0 (Differential Voltage = 2.0V)",
          "acceptableAnswers": [
            "DOMINANT_BIT_0 (Differential Voltage = 2.0V)",
            "DOMINANT_BIT_0",
            "Bit 0",
            "Dominant 0"
          ],
          "primaryMisconceptionId": "MC_IOT_CAN_BUS_ARBITRATION_DIFFERENTIAL_FRAMING",
          "diagnosisMap": {
            "RECESSIVE": {
              "misconceptionId": "MC_IOT_CAN_BUS_ARBITRATION_DIFFERENTIAL_FRAMING",
              "errorExplanation": "2.0V differential represents DOMINANT_BIT_0.",
              "recoveryPath": {
                "simplerExplanation": "2.0V difference = DOMINANT_BIT_0.",
                "guidedFixPrompt": "Type DOMINANT_BIT_0 (Differential Voltage = 2.0V)"
              }
            }
          }
        }
      },
      {
        "id": "iot-d26-b2-bitwise-arbitration-engine",
        "day": 26,
        "blockNumber": 2,
        "title": "Non-Destructive Bitwise Arbitration & Priority IDs",
        "conceptBudget": {
          "primaryConcept": "CAN Non-Destructive Bitwise Arbitration",
          "supportingTerms": [
            "11-bit Standard Identifier vs 29-bit Extended ID",
            "Dominant 0 overwrites Recessive 1",
            "Arbitration Rule: Lower numeric ID has HIGHER physical priority",
            "Zero collision backoff delay (Winner continues without interruption!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d26-b1-can-differential-signaling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "can_arbitration_demo.js",
            "initialCode": "function arbitrateCan(idA, idB) {\n  const winner = Math.min(idA, idB);\n  return {\n    nodeA_Id: `0x${idA.toString(16).toUpperCase()}`,\n    nodeB_Id: `0x${idB.toString(16).toUpperCase()}`,\n    winningId: `0x${winner.toString(16).toUpperCase()}`,\n    winner: (winner === idA) ? 'NODE_A' : 'NODE_B',\n    nonDestructiveConfirmed: true\n  };\n}\n\nconsole.log(JSON.stringify(arbitrateCan(0x010, 0x180))); // Brake system (0x010) vs Dashboard (0x180)",
            "expectedOutput": "{\"nodeA_Id\":\"0x10\",\"nodeB_Id\":\"0x180\",\"winningId\":\"0x10\",\"winner\":\"NODE_A\",\"nonDestructiveConfirmed\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which node wins arbitration when Node A transmits ID `0x010` and Node B transmits ID `0x180` simultaneously?",
          "expectedStringOutput": "NODE_A",
          "acceptableAnswers": [
            "NODE_A",
            "Node A",
            "winner\":\"NODE_A\""
          ],
          "primaryMisconceptionId": "MC_IOT_CAN_BUS_ARBITRATION_DIFFERENTIAL_FRAMING",
          "diagnosisMap": {
            "NODE_B": {
              "misconceptionId": "MC_IOT_CAN_BUS_ARBITRATION_DIFFERENTIAL_FRAMING",
              "errorExplanation": "Lower numeric ID (0x010 < 0x180) wins CAN arbitration.",
              "recoveryPath": {
                "simplerExplanation": "Lowest ID wins -> NODE_A.",
                "guidedFixPrompt": "Type NODE_A"
              }
            }
          }
        }
      },
      {
        "id": "iot-d26-b3-can-fd-flexible-data-rate",
        "day": 26,
        "blockNumber": 3,
        "title": "CAN FD (Flexible Data-Rate): 8 Mbps & 64-Byte Payloads",
        "conceptBudget": {
          "primaryConcept": "CAN FD Enhancements (ISO 11898-1:2015)",
          "supportingTerms": [
            "Classic CAN limits (1 Mbps, 8 payload bytes)",
            "CAN FD Dual Bit-Rate (Arbitration phase at 1 Mbps; Data payload phase at 5-8 Mbps)",
            "Extended payload: Up to 64 bytes per frame (8x data expansion)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d26-b2-bitwise-arbitration-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "can_fd_compare_demo.js",
            "initialCode": "function compareCanClassicVsFd(payloadBytes) {\n  return {\n    classicCanPayloadLimit: 8,\n    canFdPayloadLimit: 64,\n    canFdPayloadCapacity: `${64 / 8}x LARGER`,\n    maxDataBaudRate: '8 Mbps'\n  };\n}\n\nconsole.log(JSON.stringify(compareCanClassicVsFd(64)));",
            "expectedOutput": "{\"classicCanPayloadLimit\":8,\"canFdPayloadLimit\":64,\"canFdPayloadCapacity\":\"8x LARGER\",\"maxDataBaudRate\":\"8 Mbps\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum payload size (in bytes) supported by a single CAN FD frame?",
          "expectedStringOutput": "64",
          "acceptableAnswers": [
            "64",
            "64 bytes",
            "canFdPayloadLimit\":64"
          ],
          "primaryMisconceptionId": "MC_IOT_CAN_BUS_ARBITRATION_DIFFERENTIAL_FRAMING",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_IOT_CAN_BUS_ARBITRATION_DIFFERENTIAL_FRAMING",
              "errorExplanation": "8 bytes is for Classic CAN. CAN FD increases payload capacity to 64 bytes.",
              "recoveryPath": {
                "simplerExplanation": "CAN FD expands payload to 64 bytes.",
                "guidedFixPrompt": "Type 64"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Cellular NB-IoT & LoRaWAN Long-Range LPWAN Networks",
    "overviewMetaphor": "LPWAN (Low-Power Wide-Area Networks) is sending a postcard across an entire state using a tiny flashlight: Wi-Fi only reaches 30 meters; LoRaWAN uses Chirp Spread Spectrum modulation (Spreading Factor SF12: repeating each chirp over a wider frequency band) to transmit sensor data 15 kilometers through concrete buildings directly to a mountain gateway, running on a single battery for 8 years.",
    "blocks": [
      {
        "id": "iot-d27-b1-lora-css-spreading-factor",
        "day": 27,
        "blockNumber": 1,
        "title": "LoRa Chirp Spread Spectrum (CSS) & Spreading Factors (SF7 - SF12)",
        "conceptBudget": {
          "primaryConcept": "LoRa CSS Modulation & Spreading Factors",
          "supportingTerms": [
            "Chirp Spread Spectrum (Linear frequency sweep over bandwidth $BW = 125\\text{kHz}$)",
            "Spreading Factor ($SF = 7 \\text{ to } 12$)",
            "Symbol Duration ($T_s = \\frac{2^{SF}}{BW}$)",
            "Trade-off: High SF increases link budget range ($+15\\text{dB}$) but multiplies Time-on-Air"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d16-b2-battery-life-duty-cycle-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LoRa Spreading Factor Spectrum (125kHz Bandwidth)",
              "boxes": [
                {
                  "label": "SF7 (Fast / Near)",
                  "value": "Symbol: 1.02 ms | Time-on-Air: 40 ms | Range: 2-5 km | Best for urban nodes",
                  "varType": "High Speed",
                  "isUpdated": false
                },
                {
                  "label": "SF10 (Medium)",
                  "value": "Symbol: 8.19 ms | Time-on-Air: 320 ms | Range: 8-12 km | Suburban balance",
                  "varType": "Balanced",
                  "isUpdated": false
                },
                {
                  "label": "SF12 (Long Range / Deep)",
                  "value": "Symbol: 32.77 ms | Time-on-Air: 1,300 ms | Range: 15-25 km | Underground meters",
                  "varType": "Maximum Penetration",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lora_sf_demo.js",
            "initialCode": "function calculateSymbolTime(sf, bwKhz = 125) {\n  const symbolMs = (Math.pow(2, sf) / (bwKhz * 1000)) * 1000;\n  return {\n    spreadingFactor: `SF${sf}`,\n    symbolDurationMs: Number(symbolMs.toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(calculateSymbolTime(7)));\nconsole.log(JSON.stringify(calculateSymbolTime(12)));",
            "expectedOutput": "{\"spreadingFactor\":\"SF7\",\"symbolDurationMs\":1.02}\n{\"spreadingFactor\":\"SF12\",\"symbolDurationMs\":32.77}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the symbol duration (in ms) of a LoRa transmission using Spreading Factor SF12 on a 125kHz channel?",
          "expectedStringOutput": "32.77",
          "acceptableAnswers": [
            "32.77",
            "32.77ms",
            "symbolDurationMs\":32.77"
          ],
          "primaryMisconceptionId": "MC_IOT_LORAWAN_SPREADING_FACTOR_DUTY_CYCLE",
          "diagnosisMap": {
            "1.02": {
              "misconceptionId": "MC_IOT_LORAWAN_SPREADING_FACTOR_DUTY_CYCLE",
              "errorExplanation": "1.02ms is for SF7. SF12 symbol duration is 2^12 / 125,000 = 32.77 ms.",
              "recoveryPath": {
                "simplerExplanation": "2^12 / 125 = 32.77 ms.",
                "guidedFixPrompt": "Type 32.77"
              }
            }
          }
        }
      },
      {
        "id": "iot-d27-b2-lorawan-duty-cycle-regulations",
        "day": 27,
        "blockNumber": 2,
        "title": "LoRaWAN 1% Duty Cycle Limits & Adaptive Data Rate (ADR)",
        "conceptBudget": {
          "primaryConcept": "LoRaWAN Duty Cycle Regulations",
          "supportingTerms": [
            "ETSI European ISM Band Constraint (1% max transmission duty cycle: 36 seconds per hour max)",
            "Enforcing inter-transmission cooldown ($T_{\\text{cooldown}} = T_{\\text{air}} \\times 99$)",
            "Adaptive Data Rate (ADR: Server optimizes device SF based on gateway SNR)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d27-b1-lora-css-spreading-factor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cooldown_calc_demo.js",
            "initialCode": "function calculateLoraCooldown(toaMs) {\n  const cooldownSec = (toaMs * 99) / 1000;\n  return {\n    timeOnAirMs: toaMs,\n    required1PercentCooldownSec: Number(cooldownSec.toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateLoraCooldown(50))); // 50ms transmission",
            "expectedOutput": "{\"timeOnAirMs\":50,\"required1PercentCooldownSec\":4.95}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must LoRaWAN firmware strictly calculate and respect the 1% ETSI duty cycle regulation?",
          "options": [
            "Because the 868MHz/915MHz unlicensed ISM bands are shared by millions of public devices; transmitting continuously would jam the entire radio spectrum, violating telecommunications law",
            "Because LoRa chips melt after 1 second of transmission",
            "To speed up internet downloads"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_LORAWAN_SPREADING_FACTOR_DUTY_CYCLE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_LORAWAN_SPREADING_FACTOR_DUTY_CYCLE",
              "errorExplanation": "Unlicensed ISM bands enforce 1% duty cycles to prevent spectrum jamming.",
              "recoveryPath": {
                "simplerExplanation": "Prevents spectrum jamming on shared unlicensed ISM bands.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d27-b3-cellular-nbiot-psm-edrx",
        "day": 27,
        "blockNumber": 3,
        "title": "Cellular NB-IoT: Power Saving Mode (PSM) & eDRX",
        "conceptBudget": {
          "primaryConcept": "Cellular NB-IoT Power Saving (PSM / eDRX)",
          "supportingTerms": [
            "NB-IoT (Narrowband IoT on LTE Cat-NB1 / NB2)",
            "Power Saving Mode (PSM: Radio sleeps for up to 410 days without losing cellular network registration)",
            "extended Discontinuous Reception (eDRX: Periodic paging windows)",
            "Deep sleep current: ~3uA"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d27-b2-lorawan-duty-cycle-regulations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nbiot_psm_demo.js",
            "initialCode": "function evaluateCellularPsm(usePsm) {\n  return usePsm\n    ? { sleepCurrentUa: 3.5, reconnectLatency: '0 SECONDS (No re-attachment needed)', batteryLifeYears: 10.0 }\n    : { sleepCurrentUa: 15000, reconnectLatency: '15 SECONDS full network attach', batteryLifeYears: 0.2 };\n}\n\nconsole.log(JSON.stringify(evaluateCellularPsm(true)));",
            "expectedOutput": "{\"sleepCurrentUa\":3.5,\"reconnectLatency\":\"0 SECONDS (No re-attachment needed)\",\"batteryLifeYears\":10}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many years of battery life are achieved on NB-IoT when leveraging 3.5uA Power Saving Mode (PSM)?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10 years",
            "batteryLifeYears\":10"
          ],
          "primaryMisconceptionId": "MC_IOT_CELLULAR_NBIOT_LTE_M_POWER_SAVING",
          "diagnosisMap": {
            "0.2": {
              "misconceptionId": "MC_IOT_CELLULAR_NBIOT_LTE_M_POWER_SAVING",
              "errorExplanation": "0.2 years is without PSM. PSM extends battery life to 10 years.",
              "recoveryPath": {
                "simplerExplanation": "PSM delivers 10 years battery life.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Edge AI & TinyML Quantized Neural Network Inference",
    "overviewMetaphor": "TinyML is packing a grand piano into a pocket suitcase: a full-sized PyTorch neural network uses 32-bit floating point numbers (40 Megabytes of RAM: Impossible for a microcontroller with 256KB of SRAM!); TinyML quantizes all weights into 8-bit integers (INT8: 4x RAM reduction); CMSIS-NN SIMD instructions multiply 4 integer weights at the exact same time in 1 CPU clock tick, running real-time voice keyword recognition on 50 microwatts of power.",
    "blocks": [
      {
        "id": "iot-d28-b1-tinyml-tflm-architecture",
        "day": 28,
        "blockNumber": 1,
        "title": "TensorFlow Lite for Microcontrollers (TFLM) & Tensor Arena RAM",
        "conceptBudget": {
          "primaryConcept": "TFLM Engine & Tensor Arena",
          "supportingTerms": [
            "TensorFlow Lite Micro (TFLM: Zero dynamic heap allocation `malloc` runtime)",
            "Tensor Arena (Pre-allocated static SRAM array for model weights and activation buffers)",
            "FlatBuffer model format (`model.tflite` stored in Flash ROM)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "TinyML Memory Footprint",
              "boxes": [
                {
                  "label": "1. Flash ROM (model_data.h)",
                  "value": "Size: 45 KB | Storage: INT8 Model weights and topology FlatBuffer (Read-Only)",
                  "varType": "Flash ROM",
                  "isUpdated": false
                },
                {
                  "label": "2. SRAM (tensor_arena[32768])",
                  "value": "Size: 32 KB | Storage: Intermediate layer activation buffers (Static RAM)",
                  "varType": "Tensor Arena",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "arena_calc_demo.js",
            "initialCode": "function evaluateArenaSize(weightsKb, activationKb, overheadKb = 2) {\n  const totalSramNeeded = activationKb + overheadKb;\n  return {\n    flashRomModelBytes: weightsKb * 1024,\n    sramArenaBytesRequired: totalSramNeeded * 1024,\n    fitsIn256KbSramMcu: totalSramNeeded <= 256\n  };\n}\n\nconsole.log(JSON.stringify(evaluateArenaSize(45, 28)));",
            "expectedOutput": "{\"flashRomModelBytes\":46080,\"sramArenaBytesRequired\":30720,\"fitsIn256KbSramMcu\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does TensorFlow Lite for Microcontrollers (TFLM) require developers to pass a static `tensor_arena` byte array rather than using `malloc()`?",
          "options": [
            "To guarantee 100% deterministic memory allocation and completely eliminate dangerous dynamic heap fragmentation crashes during long-term mission-critical edge deployments",
            "Because C cannot run malloc",
            "To encrypt the neural network weights"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_EDGE_TINYML_QUANTIZATION_INT8_DSP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_EDGE_TINYML_QUANTIZATION_INT8_DSP",
              "errorExplanation": "Static tensor arenas prevent heap fragmentation and memory leaks.",
              "recoveryPath": {
                "simplerExplanation": "Eliminates dynamic heap fragmentation crashes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d28-b2-int8-quantization-math",
        "day": 28,
        "blockNumber": 2,
        "title": "INT8 Uniform Affine Quantization: Scale & Zero-Point ($q = \\text{round}(x/s) + z$)",
        "conceptBudget": {
          "primaryConcept": "INT8 Quantization Mathematics",
          "supportingTerms": [
            "Quantization Equation: $q = \\text{clamp}\\left(\\text{round}\\left(\\frac{x}{\\text{scale}}\\right) + \\text{zeroPoint}, -128, 127\\right)$",
            "Dequantization Equation: $x = (q - \\text{zeroPoint}) \\times \\text{scale}$",
            "4x RAM Compression with $< 1\\%$ accuracy drop"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d28-b1-tinyml-tflm-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quantize_calc_demo.js",
            "initialCode": "function quantizeFloatToInt8(floatVal, scale = 0.05, zeroPoint = -8) {\n  const rawQ = Math.round(floatVal / scale) + zeroPoint;\n  const clampedQ = Math.max(-128, Math.min(127, rawQ));\n  const dequantized = (clampedQ - zeroPoint) * scale;\n  return {\n    originalFloat: floatVal,\n    int8Quantized: clampedQ,\n    reconstructedFloat: Number(dequantized.toFixed(3))\n  };\n}\n\nconsole.log(JSON.stringify(quantizeFloatToInt8(6.4)));",
            "expectedOutput": "{\"originalFloat\":6.4,\"int8Quantized\":120,\"reconstructedFloat\":6.4}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What INT8 integer is produced when quantizing $6.4$ with scale $= 0.05$ and zero-point $= -8$ ($6.4 / 0.05 + (-8)$)?",
          "expectedStringOutput": "120",
          "acceptableAnswers": [
            "120",
            "int8Quantized\":120"
          ],
          "primaryMisconceptionId": "MC_IOT_EDGE_TINYML_QUANTIZATION_INT8_DSP",
          "diagnosisMap": {
            "128": {
              "misconceptionId": "MC_IOT_EDGE_TINYML_QUANTIZATION_INT8_DSP",
              "errorExplanation": "6.4 / 0.05 = 128; 128 - 8 = 120.",
              "recoveryPath": {
                "simplerExplanation": "128 - 8 = 120.",
                "guidedFixPrompt": "Type 120"
              }
            }
          }
        }
      },
      {
        "id": "iot-d28-b3-cmsis-nn-simd-acceleration",
        "day": 28,
        "blockNumber": 3,
        "title": "CMSIS-NN SIMD Intrinsics & 4x Integer Multiply-Accumulate",
        "conceptBudget": {
          "primaryConcept": "CMSIS-NN SIMD Optimization",
          "supportingTerms": [
            "ARM SIMD Instructions (`__SMLAD`: Dual 16x16 multiply-accumulate)",
            "`arm_convolve_s8()` & `arm_fully_connected_s8()`",
            "5x faster TinyML inference time (Under 10ms for gesture/keyword detection)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d28-b2-int8-quantization-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cmsis_nn_demo.js",
            "initialCode": "function evaluateInferenceSpeed(useCmsisNn) {\n  return useCmsisNn\n    ? { latencyMs: 6.5, fps: 153, speedup: '5.2x FASTER (SIMD INT8)' }\n    : { latencyMs: 34.0, fps: 29, speedup: 'SOFTWARE_REFERENCE' };\n}\n\nconsole.log(JSON.stringify(evaluateInferenceSpeed(true)));",
            "expectedOutput": "{\"latencyMs\":6.5,\"fps\":153,\"speedup\":\"5.2x FASTER (SIMD INT8)\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What inference latency (in ms) is achieved by CMSIS-NN SIMD acceleration on an ARM Cortex-M4 MCU?",
          "expectedStringOutput": "6.5",
          "acceptableAnswers": [
            "6.5",
            "6.5ms",
            "latencyMs\":6.5"
          ],
          "primaryMisconceptionId": "MC_IOT_EDGE_TINYML_QUANTIZATION_INT8_DSP",
          "diagnosisMap": {
            "34": {
              "misconceptionId": "MC_IOT_EDGE_TINYML_QUANTIZATION_INT8_DSP",
              "errorExplanation": "34ms is unoptimized software. CMSIS-NN SIMD runs in 6.5ms.",
              "recoveryPath": {
                "simplerExplanation": "CMSIS-NN runs in 6.5ms.",
                "guidedFixPrompt": "Type 6.5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Hardware Debugging: SWD, JTAG & Logic Analyzer Tracing",
    "overviewMetaphor": "A Logic Analyzer & SWD Debugger is an MRI machine for a live microcontroller: instead of guessing why firmware froze by adding slow `printf()` statements that alter timing (Heisenbugs!), Serial Wire Debug (SWD: SWDIO + SWCLK) allows you to pause the CPU, inspect hardware registers, step through assembly instructions, and capture 100 million digital voltage samples per second with zero firmware overhead.",
    "blocks": [
      {
        "id": "iot-d29-b1-swd-vs-jtag-architecture",
        "day": 29,
        "blockNumber": 1,
        "title": "Hardware Debug Interfaces: 2-Pin SWD vs 5-Pin JTAG",
        "conceptBudget": {
          "primaryConcept": "SWD vs JTAG Debug Protocols",
          "supportingTerms": [
            "Serial Wire Debug (SWD: 2 pins -> SWDIO bidirectional data, SWCLK clock)",
            "JTAG (5 pins -> TDI, TDO, TCK, TMS, TRST)",
            "ARM CoreSight Debug Access Port (DAP)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d1-b1-mcu-anatomy-memory-map",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SWD vs JTAG Pin Count Comparison",
              "boxes": [
                {
                  "label": "1. SWD (Serial Wire Debug)",
                  "value": "Pins: 2 (SWDIO, SWCLK) + GND | Speed: Up to 10 MHz | Use: Space-constrained microcontrollers",
                  "varType": "Modern Standard",
                  "isUpdated": true
                },
                {
                  "label": "2. JTAG (IEEE 1149.1)",
                  "value": "Pins: 4-5 (TDI, TDO, TCK, TMS, TRST) | Speed: Up to 50 MHz | Use: Multi-core FPGAs & boundary scan",
                  "varType": "Legacy Standard",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "debug_pin_demo.js",
            "initialCode": "function selectDebugInterface(pcbPinBudget) {\n  return pcbPinBudget <= 2\n    ? 'SWD (SWDIO + SWCLK: Saves 3 PCB traces)'\n    : 'JTAG (Full boundary scan support)';\n}\n\nconsole.log(selectDebugInterface(2));\nconsole.log(selectDebugInterface(5));",
            "expectedOutput": "SWD (SWDIO + SWCLK: Saves 3 PCB traces)\nJTAG (Full boundary scan support)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many dedicated signal pins are required to connect an ARM SWD hardware debugger (excluding GND)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 pins",
            "SWD (SWDIO + SWCLK: Saves 3 PCB traces)"
          ],
          "primaryMisconceptionId": "MC_IOT_DIAGNOSTICS_SWD_JTAG_LOGIC_ANALYZER",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_IOT_DIAGNOSTICS_SWD_JTAG_LOGIC_ANALYZER",
              "errorExplanation": "5 pins is for JTAG. SWD requires only 2 pins (SWDIO + SWCLK).",
              "recoveryPath": {
                "simplerExplanation": "SWD needs only 2 pins.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "iot-d29-b2-itm-swo-real-time-printf",
        "day": 29,
        "blockNumber": 2,
        "title": "Instrumentation Trace Macrocell (ITM) & SWO High-Speed Tracing",
        "conceptBudget": {
          "primaryConcept": "ITM / SWO Real-Time Tracing",
          "supportingTerms": [
            "Serial Wire Output (SWO pin)",
            "ITM Channel 0 (`ITM_SendChar()`)",
            "Zero-Cycle Profiling (Hardware tracing without CPU execution pause or UART baud rate bottlenecks)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d29-b1-swd-vs-jtag-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "itm_trace_demo.js",
            "initialCode": "function compareLoggingOverhead(method) {\n  return method === 'ITM_SWO_PIN'\n    ? { cpuCyclesLost: 1, baudRate: '20 Mbps', nonIntrusive: true }\n    : { cpuCyclesLost: 850, baudRate: '115.2 kbps', nonIntrusive: false, risk: 'HEISENBUG_TIMING_ALTERATION' };\n}\n\nconsole.log('SWO Logging:', JSON.stringify(compareLoggingOverhead('ITM_SWO_PIN')));\nconsole.log('UART Printf:', JSON.stringify(compareLoggingOverhead('UART_PRINTF')));",
            "expectedOutput": "SWO Logging: {\"cpuCyclesLost\":1,\"baudRate\":\"20 Mbps\",\"nonIntrusive\":true}\nUART Printf: {\"cpuCyclesLost\":850,\"baudRate\":\"115.2 kbps\",\"nonIntrusive\":false,\"risk\":\"HEISENBUG_TIMING_ALTERATION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is ARM ITM / SWO hardware tracing preferred over standard UART `printf()` for debugging high-speed real-time firmware?",
          "options": [
            "Because ITM writes directly to dedicated hardware FIFO trace registers in 1 CPU cycle at 20+ Mbps, completely eliminating the severe timing delays and Heisenbugs caused by slow UART software routines",
            "Because SWO turns off interrupts",
            "Because UART cables are illegal in embedded systems"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOT_DIAGNOSTICS_SWD_JTAG_LOGIC_ANALYZER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOT_DIAGNOSTICS_SWD_JTAG_LOGIC_ANALYZER",
              "errorExplanation": "ITM SWO writes in 1 cycle without blocking execution or altering real-time timing.",
              "recoveryPath": {
                "simplerExplanation": "Writes in 1 cycle, eliminating timing distortions.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iot-d29-b3-hardfault-handler-stack-dump",
        "day": 29,
        "blockNumber": 3,
        "title": "HardFault Crash Analysis: Parsing Stacked Exception Frames",
        "conceptBudget": {
          "primaryConcept": "HardFault Exception Analysis",
          "supportingTerms": [
            "Stacked Hardware Exception Frame (`r0, r1, r2, r3, r12, LR, PC, xPSR`)",
            "Program Counter (PC: Exact memory address of crashing assembly instruction)",
            "Link Register (LR: Calling function return address)",
            "Configurable Fault Status Register (CFSR: Precise fault reason: Divide-by-zero, Unaligned access, BusFault)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d29-b2-itm-swo-real-time-printf",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "C HardFault Exception Handler Frame",
            "codeSnippet": "void HardFault_Handler_C(uint32_t *stacked_registers) {\n  uint32_t stacked_pc = stacked_registers[6]; // Crashing instruction PC\n  uint32_t stacked_lr = stacked_registers[5]; // Caller return address LR\n  uint32_t cfsr = SCB->CFSR;                  // Fault status register\n  // Breakpoint here in debugger to inspect crash location instantly!\n  __BKPT(0);\n}",
            "lineNotes": {
              "2": "PC register pinpoints the exact offending instruction in disassembly.",
              "4": "CFSR flags explain why the CPU faulted."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hardfault_dump_demo.js",
            "initialCode": "function decodeHardFault(pcHex, cfsrHex) {\n  return {\n    exceptionType: 'HARD_FAULT_EXCEPTION',\n    faultingInstructionAddress: pcHex,\n    cfsrCode: cfsrHex,\n    rootCauseDiagnosis: (cfsrHex === '0x00010000') ? 'UNDEFINED_INSTRUCTION' : 'MEMORY_ACCESS_VIOLATION'\n  };\n}\n\nconsole.log(JSON.stringify(decodeHardFault('0x0800142A', '0x00010000')));",
            "expectedOutput": "{\"exceptionType\":\"HARD_FAULT_EXCEPTION\",\"faultingInstructionAddress\":\"0x0800142A\",\"cfsrCode\":\"0x00010000\",\"rootCauseDiagnosis\":\"UNDEFINED_INSTRUCTION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the root cause diagnosis when CFSR contains `0x00010000`?",
          "expectedStringOutput": "UNDEFINED_INSTRUCTION",
          "acceptableAnswers": [
            "UNDEFINED_INSTRUCTION",
            "rootCauseDiagnosis\":\"UNDEFINED_INSTRUCTION\""
          ],
          "primaryMisconceptionId": "MC_IOT_DIAGNOSTICS_SWD_JTAG_LOGIC_ANALYZER",
          "diagnosisMap": {
            "MEMORY": {
              "misconceptionId": "MC_IOT_DIAGNOSTICS_SWD_JTAG_LOGIC_ANALYZER",
              "errorExplanation": "0x00010000 in CFSR diagnoses an UNDEFINED_INSTRUCTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches UNDEFINED_INSTRUCTION.",
                "guidedFixPrompt": "Type UNDEFINED_INSTRUCTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Industrial Mission-Critical Autonomous Robotic Manufacturing System",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete industrial robotics control unit: 1. Hardware Root of Trust verified via eFuses; 2. Dual-Bank OTA bootloader active on Slot 0; 3. FreeRTOS Preemptive Schedulers manage high-priority CAN motor actuation tasks; 4. DMA Circular ADC streams multi-channel sensor data; 5. 1D Kalman noise filtering; 6. Microsecond-accurate CAN FD bus dispatch; 7. Independent Watchdog ensures 99.999% uptime with zero lockups.",
    "blocks": [
      {
        "id": "iot-d30-b1-capstone-architecture-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Industrial Robotic Manufacturing System Architecture",
        "conceptBudget": {
          "primaryConcept": "Capstone Embedded System Architecture",
          "supportingTerms": [
            "Hardware Root of Trust",
            "Preemptive RTOS Multi-Tasking",
            "DMA Circular Buffering",
            "CAN Bus Actuation",
            "Watchdog Supervision"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d29-b3-hardfault-handler-stack-dump",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Mission-Critical Industrial Robotics Master Loop",
              "nodes": [
                {
                  "id": "1",
                  "label": "Secure Boot ROM validates eFuse ECDSA signature -> Boots FreeRTOS",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "DMA streams ADC analog sensors -> 1D Kalman filter eliminates electrical noise",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "MotorTask (Priority 4) acquires SPI Mutex and dispatches CAN FD motor pulses",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Task Health Bitmask kicks Watchdog -> 100% Deterministic Real-Time Manufacturing Cycle!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_iot_engine.js",
            "initialCode": "function runIndustrialController() {\n  return {\n    rootOfTrustVerified: true,\n    bootloaderSlot: 'SLOT_0_PROD',\n    rtosScheduler: 'PREEMPTIVE_PRIORITY_SCHEDULER_ACTIVE',\n    dmaTransferring: true,\n    kalmanNoiseFilter: 'ACTIVE_CONVERGED',\n    canBusActuating: true,\n    watchdogSupervised: true,\n    systemStatus: 'INDUSTRIAL_ROBOTICS_CONTROLLER_CERTIFIED'\n  };\n}\n\nconsole.log(runIndustrialController().systemStatus);",
            "expectedOutput": "INDUSTRIAL_ROBOTICS_CONTROLLER_CERTIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What system status string confirms successful execution of the Day 30 Final Capstone engine?",
          "expectedStringOutput": "INDUSTRIAL_ROBOTICS_CONTROLLER_CERTIFIED",
          "acceptableAnswers": [
            "INDUSTRIAL_ROBOTICS_CONTROLLER_CERTIFIED",
            "System Status: INDUSTRIAL_ROBOTICS_CONTROLLER_CERTIFIED"
          ],
          "primaryMisconceptionId": "MC_IOT_CAPSTONE_AUTONOMOUS_SMART_FACTORY_ROBOTICS",
          "diagnosisMap": {
            "OFFLINE": {
              "misconceptionId": "MC_IOT_CAPSTONE_AUTONOMOUS_SMART_FACTORY_ROBOTICS",
              "errorExplanation": "Matches INDUSTRIAL_ROBOTICS_CONTROLLER_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Matches header status.",
                "guidedFixPrompt": "Type INDUSTRIAL_ROBOTICS_CONTROLLER_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "iot-d30-b2-enterprise-readiness-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Quality Audit & Zero-Defect Firmware Certification",
        "conceptBudget": {
          "primaryConcept": "Enterprise Quality Framework Audit",
          "supportingTerms": [
            "MISRA C:2012 Safety Compliance",
            "Hard Real-Time Latency: < 50us",
            "Watchdog Failsafe Recovery: 100%",
            "Zero Unhandled HardFaults SLA"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d30-b1-capstone-architecture-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditIndustrialController(misraCompliant, hardRealTimeUnder50us, watchdogActive) {\n  const passed = misraCompliant && hardRealTimeUnder50us && watchdogActive;\n  return {\n    misraCompliant,\n    hardRealTimeUnder50us,\n    watchdogActive,\n    grade: passed ? 'ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED' : 'AUDIT_FAILED'\n  };\n}\n\nconsole.log(JSON.stringify(auditIndustrialController(true, true, true)));",
            "expectedOutput": "{\"misraCompliant\":true,\"hardRealTimeUnder50us\":true,\"watchdogActive\":true,\"grade\":\"ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification grade is awarded upon passing the complete Enterprise Embedded Systems Quality Audit?",
          "expectedStringOutput": "ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED",
          "acceptableAnswers": [
            "ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED",
            "grade\":\"ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_IOT_CAPSTONE_AUTONOMOUS_SMART_FACTORY_ROBOTICS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOT_CAPSTONE_AUTONOMOUS_SMART_FACTORY_ROBOTICS",
              "errorExplanation": "Passing all metrics awards ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED.",
                "guidedFixPrompt": "Type ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "iot-d30-b3-final-capstone-graduation",
        "day": 30,
        "blockNumber": 3,
        "title": "🏆 Graduation: PinIT Certified Embedded Systems & IoT Architect",
        "conceptBudget": {
          "primaryConcept": "Course Graduation Certification",
          "supportingTerms": [
            "30 Days Completed",
            "90 Micro-Learning Blocks Certified",
            "60 Proctored Coding Challenges Mastered",
            "PinIT Certified Embedded Systems & IoT Architect"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iot-d30-b2-enterprise-readiness-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "graduation_cert.js",
            "initialCode": "console.log('🏆 GRADUATION: PinIT Certified Embedded Systems, Firmware & IoT Architect [30/30 DAYS 100% COMPLETE]');",
            "expectedOutput": "🏆 GRADUATION: PinIT Certified Embedded Systems, Firmware & IoT Architect [30/30 DAYS 100% COMPLETE]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What graduation message celebrates completing the 30-day Embedded Systems, Firmware & IoT curriculum?",
          "expectedStringOutput": "🏆 GRADUATION: PinIT Certified Embedded Systems, Firmware & IoT Architect [30/30 DAYS 100% COMPLETE]",
          "acceptableAnswers": [
            "🏆 GRADUATION: PinIT Certified Embedded Systems, Firmware & IoT Architect [30/30 DAYS 100% COMPLETE]",
            "30/30 DAYS 100% COMPLETE"
          ],
          "primaryMisconceptionId": "MC_IOT_CAPSTONE_AUTONOMOUS_SMART_FACTORY_ROBOTICS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOT_CAPSTONE_AUTONOMOUS_SMART_FACTORY_ROBOTICS",
              "errorExplanation": "Matches final graduation title.",
              "recoveryPath": {
                "simplerExplanation": "Matches final graduation title.",
                "guidedFixPrompt": "Type 🏆 GRADUATION: PinIT Certified Embedded Systems, Firmware & IoT Architect [30/30 DAYS 100% COMPLETE]"
              }
            }
          }
        }
      }
    ]
  }
];
