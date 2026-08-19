import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const IOT_EMBEDDED_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "Embedded Systems Architecture & Microcontrollers",
    desc: "Understand Harvard vs Von Neumann architecture, CPU cores (ARM Cortex-M, ESP32), and flash/SRAM boundaries.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Embedded Systems Architecture & Microcontrollers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Embedded Systems Architecture & Microcontrollers Validation",
    eDesc: "Implement a JavaScript validation function for Embedded Systems Architecture & Microcontrollers.",
    eStarter: "function iot_embTaskDay1(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay1 !== 'function') throw new Error('Function iot_embTaskDay1 not found');\nif (iot_embTaskDay1('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Embedded Systems Architecture & Microcontrollers Practice",
    aDesc: "Write an auxiliary helper function for Embedded Systems Architecture & Microcontrollers.",
    aStarter: "function iot_embTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "GPIO Digital Output & LED Control",
    desc: "Configure GPIO pin modes (Input, Output, Pull-up, Pull-down) and toggle output voltages.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of GPIO Digital Output & LED Control.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: GPIO Digital Output & LED Control Validation",
    eDesc: "Implement a JavaScript validation function for GPIO Digital Output & LED Control.",
    eStarter: "function iot_embTaskDay2(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay2 !== 'function') throw new Error('Function iot_embTaskDay2 not found');\nif (iot_embTaskDay2('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: GPIO Digital Output & LED Control Practice",
    aDesc: "Write an auxiliary helper function for GPIO Digital Output & LED Control.",
    aStarter: "function iot_embTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "GPIO Digital Input & Pushbutton Debouncing",
    desc: "Read logic state levels, handle floating inputs, and implement software and hardware RC debouncing.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of GPIO Digital Input & Pushbutton Debouncing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: GPIO Digital Input & Pushbutton Debouncing Validation",
    eDesc: "Implement a JavaScript validation function for GPIO Digital Input & Pushbutton Debouncing.",
    eStarter: "function iot_embTaskDay3(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay3 !== 'function') throw new Error('Function iot_embTaskDay3 not found');\nif (iot_embTaskDay3('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: GPIO Digital Input & Pushbutton Debouncing Practice",
    aDesc: "Write an auxiliary helper function for GPIO Digital Input & Pushbutton Debouncing.",
    aStarter: "function iot_embTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Analog-to-Digital Conversion (ADC) & Voltage Sensors",
    desc: "Calibrate analog voltage references, calculate resolution steps (10-bit, 12-bit), and read analog sensors.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Analog-to-Digital Conversion (ADC) & Voltage Sensors.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Analog-to-Digital Conversion (ADC) & Voltage Sensors Validation",
    eDesc: "Implement a JavaScript validation function for Analog-to-Digital Conversion (ADC) & Voltage Sensors.",
    eStarter: "function iot_embTaskDay4(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay4 !== 'function') throw new Error('Function iot_embTaskDay4 not found');\nif (iot_embTaskDay4('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Analog-to-Digital Conversion (ADC) & Voltage Sensors Practice",
    aDesc: "Write an auxiliary helper function for Analog-to-Digital Conversion (ADC) & Voltage Sensors.",
    aStarter: "function iot_embTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Pulse Width Modulation (PWM) & Motor Control",
    desc: "Generate variable duty-cycle PWM waveforms to drive servo motors, DC motor H-bridges, and LED dimmers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Pulse Width Modulation (PWM) & Motor Control.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Pulse Width Modulation (PWM) & Motor Control Validation",
    eDesc: "Implement a JavaScript validation function for Pulse Width Modulation (PWM) & Motor Control.",
    eStarter: "function iot_embTaskDay5(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay5 !== 'function') throw new Error('Function iot_embTaskDay5 not found');\nif (iot_embTaskDay5('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Pulse Width Modulation (PWM) & Motor Control Practice",
    aDesc: "Write an auxiliary helper function for Pulse Width Modulation (PWM) & Motor Control.",
    aStarter: "function iot_embTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Hardware Timers & Interrupt Service Routines (ISRs)",
    desc: "Configure hardware periodic timers, attach pin change interrupts, and manage volatile state flags.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Hardware Timers & Interrupt Service Routines (ISRs).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Hardware Timers & Interrupt Service Routines (ISRs) Validation",
    eDesc: "Implement a JavaScript validation function for Hardware Timers & Interrupt Service Routines (ISRs).",
    eStarter: "function iot_embTaskDay6(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay6 !== 'function') throw new Error('Function iot_embTaskDay6 not found');\nif (iot_embTaskDay6('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Hardware Timers & Interrupt Service Routines (ISRs) Practice",
    aDesc: "Write an auxiliary helper function for Hardware Timers & Interrupt Service Routines (ISRs).",
    aStarter: "function iot_embTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "UART Serial Communication & Protocol Framing",
    desc: "Configure baud rates (9600, 115200), start/stop bits, parity checks, and packet framing delimiters.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of UART Serial Communication & Protocol Framing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: UART Serial Communication & Protocol Framing Validation",
    eDesc: "Implement a JavaScript validation function for UART Serial Communication & Protocol Framing.",
    eStarter: "function iot_embTaskDay7(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay7 !== 'function') throw new Error('Function iot_embTaskDay7 not found');\nif (iot_embTaskDay7('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: UART Serial Communication & Protocol Framing Practice",
    aDesc: "Write an auxiliary helper function for UART Serial Communication & Protocol Framing.",
    aStarter: "function iot_embTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "I2C Bus Communication & Sensor Interfacing",
    desc: "Master I2C master/slave addressing, pull-up resistors, clock stretching, and read temperature/pressure sensors.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of I2C Bus Communication & Sensor Interfacing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: I2C Bus Communication & Sensor Interfacing Validation",
    eDesc: "Implement a JavaScript validation function for I2C Bus Communication & Sensor Interfacing.",
    eStarter: "function iot_embTaskDay8(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay8 !== 'function') throw new Error('Function iot_embTaskDay8 not found');\nif (iot_embTaskDay8('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: I2C Bus Communication & Sensor Interfacing Practice",
    aDesc: "Write an auxiliary helper function for I2C Bus Communication & Sensor Interfacing.",
    aStarter: "function iot_embTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "SPI High-Speed Bus Communication",
    desc: "Configure MOSI, MISO, SCK, CS lines, SPI clock polarities (CPOL/CPHA), and interface with SD cards and displays.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of SPI High-Speed Bus Communication.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: SPI High-Speed Bus Communication Validation",
    eDesc: "Implement a JavaScript validation function for SPI High-Speed Bus Communication.",
    eStarter: "function iot_embTaskDay9(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay9 !== 'function') throw new Error('Function iot_embTaskDay9 not found');\nif (iot_embTaskDay9('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: SPI High-Speed Bus Communication Practice",
    aDesc: "Write an auxiliary helper function for SPI High-Speed Bus Communication.",
    aStarter: "function iot_embTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Direct Memory Access (DMA) in Microcontrollers",
    desc: "Configure DMA channels for zero-CPU peripheral data transfers across UART, SPI, and ADC buffers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Direct Memory Access (DMA) in Microcontrollers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Direct Memory Access (DMA) in Microcontrollers Validation",
    eDesc: "Implement a JavaScript validation function for Direct Memory Access (DMA) in Microcontrollers.",
    eStarter: "function iot_embTaskDay10(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay10 !== 'function') throw new Error('Function iot_embTaskDay10 not found');\nif (iot_embTaskDay10('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Direct Memory Access (DMA) in Microcontrollers Practice",
    aDesc: "Write an auxiliary helper function for Direct Memory Access (DMA) in Microcontrollers.",
    aStarter: "function iot_embTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "FreeRTOS Fundamentals & Task Management",
    desc: "Create prioritized RTOS tasks, allocate stack memory, and manage task lifecycle states.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of FreeRTOS Fundamentals & Task Management.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: FreeRTOS Fundamentals & Task Management Validation",
    eDesc: "Implement a JavaScript validation function for FreeRTOS Fundamentals & Task Management.",
    eStarter: "function iot_embTaskDay11(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay11 !== 'function') throw new Error('Function iot_embTaskDay11 not found');\nif (iot_embTaskDay11('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: FreeRTOS Fundamentals & Task Management Practice",
    aDesc: "Write an auxiliary helper function for FreeRTOS Fundamentals & Task Management.",
    aStarter: "function iot_embTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "FreeRTOS Inter-Task Communication (Queues & Semaphores)",
    desc: "Share data between tasks safely using FreeRTOS message queues, binary semaphores, and mutexes.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of FreeRTOS Inter-Task Communication (Queues & Semaphores).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: FreeRTOS Inter-Task Communication (Queues & Semaphores) Validation",
    eDesc: "Implement a JavaScript validation function for FreeRTOS Inter-Task Communication (Queues & Semaphores).",
    eStarter: "function iot_embTaskDay12(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay12 !== 'function') throw new Error('Function iot_embTaskDay12 not found');\nif (iot_embTaskDay12('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: FreeRTOS Inter-Task Communication (Queues & Semaphores) Practice",
    aDesc: "Write an auxiliary helper function for FreeRTOS Inter-Task Communication (Queues & Semaphores).",
    aStarter: "function iot_embTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Priority Inversion & Mutex Priority Inheritance",
    desc: "Prevent low-priority tasks from blocking high-priority tasks using FreeRTOS mutex priority inheritance.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Priority Inversion & Mutex Priority Inheritance.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Priority Inversion & Mutex Priority Inheritance Validation",
    eDesc: "Implement a JavaScript validation function for Priority Inversion & Mutex Priority Inheritance.",
    eStarter: "function iot_embTaskDay13(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay13 !== 'function') throw new Error('Function iot_embTaskDay13 not found');\nif (iot_embTaskDay13('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Priority Inversion & Mutex Priority Inheritance Practice",
    aDesc: "Write an auxiliary helper function for Priority Inversion & Mutex Priority Inheritance.",
    aStarter: "function iot_embTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Watchdog Timers & Hardware Fault Recovery",
    desc: "Configure hardware watchdog timers to reset frozen microcontrollers and log hard fault registers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Watchdog Timers & Hardware Fault Recovery.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Watchdog Timers & Hardware Fault Recovery Validation",
    eDesc: "Implement a JavaScript validation function for Watchdog Timers & Hardware Fault Recovery.",
    eStarter: "function iot_embTaskDay14(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay14 !== 'function') throw new Error('Function iot_embTaskDay14 not found');\nif (iot_embTaskDay14('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Watchdog Timers & Hardware Fault Recovery Practice",
    aDesc: "Write an auxiliary helper function for Watchdog Timers & Hardware Fault Recovery.",
    aStarter: "function iot_embTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Low-Power Modes & Battery Optimization",
    desc: "Transition microcontrollers to deep sleep (<10uA), configure RTC timer wakeups, and optimize battery life.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Low-Power Modes & Battery Optimization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Low-Power Modes & Battery Optimization Validation",
    eDesc: "Implement a JavaScript validation function for Low-Power Modes & Battery Optimization.",
    eStarter: "function iot_embTaskDay15(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay15 !== 'function') throw new Error('Function iot_embTaskDay15 not found');\nif (iot_embTaskDay15('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Low-Power Modes & Battery Optimization Practice",
    aDesc: "Write an auxiliary helper function for Low-Power Modes & Battery Optimization.",
    aStarter: "function iot_embTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Flash Memory Partitioning & Non-Volatile Storage (NVS)",
    desc: "Store persistent Wi-Fi credentials and device calibration factors in EEPROM / NVS flash sectors.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Flash Memory Partitioning & Non-Volatile Storage (NVS).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Flash Memory Partitioning & Non-Volatile Storage (NVS) Validation",
    eDesc: "Implement a JavaScript validation function for Flash Memory Partitioning & Non-Volatile Storage (NVS).",
    eStarter: "function iot_embTaskDay16(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay16 !== 'function') throw new Error('Function iot_embTaskDay16 not found');\nif (iot_embTaskDay16('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Flash Memory Partitioning & Non-Volatile Storage (NVS) Practice",
    aDesc: "Write an auxiliary helper function for Flash Memory Partitioning & Non-Volatile Storage (NVS).",
    aStarter: "function iot_embTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Wi-Fi Provisioning & Station/AP Modes",
    desc: "Configure ESP32 Wi-Fi station mode, softAP captive portals, and connect to secured enterprise WPA2 networks.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Wi-Fi Provisioning & Station/AP Modes.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Wi-Fi Provisioning & Station/AP Modes Validation",
    eDesc: "Implement a JavaScript validation function for Wi-Fi Provisioning & Station/AP Modes.",
    eStarter: "function iot_embTaskDay17(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay17 !== 'function') throw new Error('Function iot_embTaskDay17 not found');\nif (iot_embTaskDay17('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Wi-Fi Provisioning & Station/AP Modes Practice",
    aDesc: "Write an auxiliary helper function for Wi-Fi Provisioning & Station/AP Modes.",
    aStarter: "function iot_embTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "MQTT Client Implementation on Microcontrollers",
    desc: "Connect to cloud MQTT brokers over TCP, format JSON sensor payloads, and publish at fixed intervals.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of MQTT Client Implementation on Microcontrollers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: MQTT Client Implementation on Microcontrollers Validation",
    eDesc: "Implement a JavaScript validation function for MQTT Client Implementation on Microcontrollers.",
    eStarter: "function iot_embTaskDay18(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay18 !== 'function') throw new Error('Function iot_embTaskDay18 not found');\nif (iot_embTaskDay18('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: MQTT Client Implementation on Microcontrollers Practice",
    aDesc: "Write an auxiliary helper function for MQTT Client Implementation on Microcontrollers.",
    aStarter: "function iot_embTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "MQTT Topic Subscriptions & Remote Actuator Control",
    desc: "Subscribe to command topics, parse incoming JSON action payloads, and trigger relay switches.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of MQTT Topic Subscriptions & Remote Actuator Control.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: MQTT Topic Subscriptions & Remote Actuator Control Validation",
    eDesc: "Implement a JavaScript validation function for MQTT Topic Subscriptions & Remote Actuator Control.",
    eStarter: "function iot_embTaskDay19(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay19 !== 'function') throw new Error('Function iot_embTaskDay19 not found');\nif (iot_embTaskDay19('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: MQTT Topic Subscriptions & Remote Actuator Control Practice",
    aDesc: "Write an auxiliary helper function for MQTT Topic Subscriptions & Remote Actuator Control.",
    aStarter: "function iot_embTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "TLS / SSL Encryption on Resource-Constrained Hardware",
    desc: "Load X.509 root CA certificates in flash and establish secured TLS sockets with cloud endpoints.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of TLS / SSL Encryption on Resource-Constrained Hardware.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: TLS / SSL Encryption on Resource-Constrained Hardware Validation",
    eDesc: "Implement a JavaScript validation function for TLS / SSL Encryption on Resource-Constrained Hardware.",
    eStarter: "function iot_embTaskDay20(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay20 !== 'function') throw new Error('Function iot_embTaskDay20 not found');\nif (iot_embTaskDay20('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: TLS / SSL Encryption on Resource-Constrained Hardware Practice",
    aDesc: "Write an auxiliary helper function for TLS / SSL Encryption on Resource-Constrained Hardware.",
    aStarter: "function iot_embTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Over-the-Air (OTA) Firmware Updates",
    desc: "Implement dual-bank flash memory partitioning, cryptographically verify binary signatures, and handle rollbacks.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Over-the-Air (OTA) Firmware Updates.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Over-the-Air (OTA) Firmware Updates Validation",
    eDesc: "Implement a JavaScript validation function for Over-the-Air (OTA) Firmware Updates.",
    eStarter: "function iot_embTaskDay21(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay21 !== 'function') throw new Error('Function iot_embTaskDay21 not found');\nif (iot_embTaskDay21('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Over-the-Air (OTA) Firmware Updates Practice",
    aDesc: "Write an auxiliary helper function for Over-the-Air (OTA) Firmware Updates.",
    aStarter: "function iot_embTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Sensor Calibration & Digital Filtering (Moving Average)",
    desc: "Calibrate zero-offset sensor errors and apply windowed moving average and exponential smoothing filters.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Sensor Calibration & Digital Filtering (Moving Average).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Sensor Calibration & Digital Filtering (Moving Average) Validation",
    eDesc: "Implement a JavaScript validation function for Sensor Calibration & Digital Filtering (Moving Average).",
    eStarter: "function iot_embTaskDay22(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay22 !== 'function') throw new Error('Function iot_embTaskDay22 not found');\nif (iot_embTaskDay22('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Sensor Calibration & Digital Filtering (Moving Average) Practice",
    aDesc: "Write an auxiliary helper function for Sensor Calibration & Digital Filtering (Moving Average).",
    aStarter: "function iot_embTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Kalman Filter for IMU Sensor Fusion",
    desc: "Fuse noisy accelerometer and gyroscope readings to compute accurate pitch and roll orientation angles.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Kalman Filter for IMU Sensor Fusion.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Kalman Filter for IMU Sensor Fusion Validation",
    eDesc: "Implement a JavaScript validation function for Kalman Filter for IMU Sensor Fusion.",
    eStarter: "function iot_embTaskDay23(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay23 !== 'function') throw new Error('Function iot_embTaskDay23 not found');\nif (iot_embTaskDay23('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Kalman Filter for IMU Sensor Fusion Practice",
    aDesc: "Write an auxiliary helper function for Kalman Filter for IMU Sensor Fusion.",
    aStarter: "function iot_embTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Hardware Interfaces: Relay Switches & Optoisolators",
    desc: "Isolate high-voltage AC mains from microcontrollers using optical optocouplers and flyback diodes.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Hardware Interfaces: Relay Switches & Optoisolators.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Hardware Interfaces: Relay Switches & Optoisolators Validation",
    eDesc: "Implement a JavaScript validation function for Hardware Interfaces: Relay Switches & Optoisolators.",
    eStarter: "function iot_embTaskDay24(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay24 !== 'function') throw new Error('Function iot_embTaskDay24 not found');\nif (iot_embTaskDay24('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Hardware Interfaces: Relay Switches & Optoisolators Practice",
    aDesc: "Write an auxiliary helper function for Hardware Interfaces: Relay Switches & Optoisolators.",
    aStarter: "function iot_embTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Display Drivers (OLED SSD1306 / TFT ST7789)",
    desc: "Render real-time sensor charts, graphical menus, and custom font bitmaps on SPI/I2C displays.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Display Drivers (OLED SSD1306 / TFT ST7789).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Display Drivers (OLED SSD1306 / TFT ST7789) Validation",
    eDesc: "Implement a JavaScript validation function for Display Drivers (OLED SSD1306 / TFT ST7789).",
    eStarter: "function iot_embTaskDay25(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay25 !== 'function') throw new Error('Function iot_embTaskDay25 not found');\nif (iot_embTaskDay25('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Display Drivers (OLED SSD1306 / TFT ST7789) Practice",
    aDesc: "Write an auxiliary helper function for Display Drivers (OLED SSD1306 / TFT ST7789).",
    aStarter: "function iot_embTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Hardware Debugging with Logic Analyzers & Oscilloscopes",
    desc: "Decode I2C/SPI packet waveforms, measure signal rise times, and debug bus contention glitches.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Hardware Debugging with Logic Analyzers & Oscilloscopes.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Hardware Debugging with Logic Analyzers & Oscilloscopes Validation",
    eDesc: "Implement a JavaScript validation function for Hardware Debugging with Logic Analyzers & Oscilloscopes.",
    eStarter: "function iot_embTaskDay26(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay26 !== 'function') throw new Error('Function iot_embTaskDay26 not found');\nif (iot_embTaskDay26('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Hardware Debugging with Logic Analyzers & Oscilloscopes Practice",
    aDesc: "Write an auxiliary helper function for Hardware Debugging with Logic Analyzers & Oscilloscopes.",
    aStarter: "function iot_embTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Industrial Modbus RTU & RS-485 Communication",
    desc: "Interface with factory PLCs using differential RS-485 transceivers and Modbus register maps.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Industrial Modbus RTU & RS-485 Communication.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Industrial Modbus RTU & RS-485 Communication Validation",
    eDesc: "Implement a JavaScript validation function for Industrial Modbus RTU & RS-485 Communication.",
    eStarter: "function iot_embTaskDay27(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay27 !== 'function') throw new Error('Function iot_embTaskDay27 not found');\nif (iot_embTaskDay27('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Industrial Modbus RTU & RS-485 Communication Practice",
    aDesc: "Write an auxiliary helper function for Industrial Modbus RTU & RS-485 Communication.",
    aStarter: "function iot_embTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "CAN Bus Communication in Automotive Systems",
    desc: "Structure CAN 2.0B message frames, arbitration IDs, bit stuffing, and interface with vehicle OBD-II ports.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of CAN Bus Communication in Automotive Systems.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: CAN Bus Communication in Automotive Systems Validation",
    eDesc: "Implement a JavaScript validation function for CAN Bus Communication in Automotive Systems.",
    eStarter: "function iot_embTaskDay28(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay28 !== 'function') throw new Error('Function iot_embTaskDay28 not found');\nif (iot_embTaskDay28('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: CAN Bus Communication in Automotive Systems Practice",
    aDesc: "Write an auxiliary helper function for CAN Bus Communication in Automotive Systems.",
    aStarter: "function iot_embTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Firmware Build Systems (CMake & PlatformIO)",
    desc: "Automate multi-target firmware compilation, unit testing, and dependency management with PlatformIO.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Firmware Build Systems (CMake & PlatformIO).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Firmware Build Systems (CMake & PlatformIO) Validation",
    eDesc: "Implement a JavaScript validation function for Firmware Build Systems (CMake & PlatformIO).",
    eStarter: "function iot_embTaskDay29(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay29 !== 'function') throw new Error('Function iot_embTaskDay29 not found');\nif (iot_embTaskDay29('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Firmware Build Systems (CMake & PlatformIO) Practice",
    aDesc: "Write an auxiliary helper function for Firmware Build Systems (CMake & PlatformIO).",
    aStarter: "function iot_embTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Autonomous Industrial Telemetry Sensor Node",
    desc: "Build a complete ESP32 sensor node with FreeRTOS, DMA sampling, deep sleep management, and OTA update support.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Capstone: Autonomous Industrial Telemetry Sensor Node.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Capstone: Autonomous Industrial Telemetry Sensor Node Validation",
    eDesc: "Implement a JavaScript validation function for Capstone: Autonomous Industrial Telemetry Sensor Node.",
    eStarter: "function iot_embTaskDay30(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof iot_embTaskDay30 !== 'function') throw new Error('Function iot_embTaskDay30 not found');\nif (iot_embTaskDay30('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Autonomous Industrial Telemetry Sensor Node Practice",
    aDesc: "Write an auxiliary helper function for Capstone: Autonomous Industrial Telemetry Sensor Node.",
    aStarter: "function iot_embTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof iot_embTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const IOT_EMBEDDED_30_DAYS_QUESTS = IOT_EMBEDDED_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('iot-emb', i + 1, cfg)
);
