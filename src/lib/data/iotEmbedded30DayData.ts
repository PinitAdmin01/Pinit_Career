import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const IOT_EMBEDDED_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Microcontroller Architecture, Memory-Mapped I/O & Bitwise Register Manipulation",
    "desc": "Master Harvard vs Von Neumann architectures, ARM Cortex-M register sets, Flash ROM vs SRAM boundaries, and memory-mapped peripheral I/O (MMIO).",
    "syllabus": [
      "Harvard Architecture (Separate Instruction & Data buses) vs Von Neumann.",
      "ARM Cortex-M Memory Map: Code Flash (0x00000000), SRAM (0x20000000), Peripherals (0x40000000).",
      "Memory-Mapped I/O (MMIO): Accessing hardware registers via pointer dereferencing."
    ],
    "eTitle": "MMIO Peripheral Address Decoder",
    "eDesc": "Implement function decodePeripheralAddress(addr) returning memory region classification ('FLASH_MEMORY', 'SRAM_DATA', 'PERIPHERAL_MMIO', or 'SYSTEM_CONTROL').",
    "eStarter": "function decodePeripheralAddress(addr) {\n  // TODO: Check address ranges: <0x20000000 Flash, <0x40000000 SRAM, <0xE0000000 Peripheral.\n  \n}",
    "eHint": "Check address ranges: <0x20000000 Flash, <0x40000000 SRAM, <0xE0000000 Peripheral.",
    "eTest": "if (decodePeripheralAddress('0x08000000') !== 'FLASH_MEMORY') throw new Error('Flash decoder failed');\nif (decodePeripheralAddress('0x20001000') !== 'SRAM_DATA') throw new Error('SRAM decoder failed');\nif (decodePeripheralAddress('0x40021000') !== 'PERIPHERAL_MMIO') throw new Error('Peripheral MMIO decoder failed');",
    "aTitle": "SRAM Free Memory Calculator",
    "aDesc": "Implement function calculateFreeSram(totalSramBytes, bssBytes, dataBytes, stackBytes) returning free heap bytes.",
    "aStarter": "function calculateFreeSram(total, bss, data, stack) {\n  // TODO: Subtract bss + data + stack from total.\n  \n}",
    "aHint": "Subtract bss + data + stack from total.",
    "aTest": "if (calculateFreeSram(65536, 1024, 2048, 4096) !== 58368) throw new Error('SRAM calc failed');"
  },
  {
    "day": 2,
    "title": "NVIC Interrupts, Hardware Timers, DMA Circular Buffers & Low-Power Modes",
    "desc": "Configure GPIO pin modes (Input, Output, Pull-up, Pull-down), manipulate Output Data Registers (ODR) and Bit Set/Reset Registers (BSRR).",
    "syllabus": [
      "GPIO Pin Modes: Push-Pull vs Open-Drain outputs.",
      "Atomic Bit Manipulation: BSRR (Bit Set/Reset Register) eliminating Read-Modify-Write race conditions.",
      "Current sinking vs sourcing limits (20mA per pin, 150mA package total)."
    ],
    "eTitle": "GPIO Atomic Bit Set/Reset (BSRR) Simulator",
    "eDesc": "Implement function applyBsrr(currentOdr, pinNumber, action) simulating atomic BSRR register writes (Set bit $N$ via low 16 bits; Reset bit $N$ via high 16 bits).",
    "eStarter": "function applyBsrr(odr, pin, action) {\n  // TODO: Set: odr | (1 << pin); Reset: odr & ~(1 << pin).\n  \n}",
    "eHint": "Set: odr | (1 << pin); Reset: odr & ~(1 << pin).",
    "eTest": "let odr = 0x0000;\nodr = applyBsrr(odr, 5, 'SET');\nif (odr !== 32) throw new Error('BSRR Set pin 5 failed');\nodr = applyBsrr(odr, 5, 'RESET');\nif (odr !== 0) throw new Error('BSRR Reset pin 5 failed');",
    "aTitle": "GPIO Pin Bitmask Formatter",
    "aDesc": "Implement function getPinBitmask(pin) returning `1 << pin` in hex string format.",
    "aStarter": "function getPinBitmask(p) {\n  // TODO: Shift 1 << p and format to hex.\n  \n}",
    "aHint": "Shift 1 << p and format to hex.",
    "aTest": "if (getPinBitmask(3) !== '0x0008') throw new Error('Bitmask format failed');"
  },
  {
    "day": 3,
    "title": "Hardware Communication Protocols: UART Framing, SPI High-Speed Bus, I2C Multi-Master Arbitration, Differential CAN & Hardware CRC-16",
    "desc": "Read logic levels, handle floating inputs with internal pull-up/down resistors, and eliminate mechanical switch chatter with shift register debouncers.",
    "syllabus": [
      "Floating Pin Hazard: Undefined electrical floating states without Pull-Up/Pull-Down resistors.",
      "Mechanical Switch Bounce: 5-20ms of contact oscillation on press/release.",
      "Software Debouncing: Shift Register continuous sampling window."
    ],
    "eTitle": "Shift Register Button Debounce Filter",
    "eDesc": "Implement function processDebounceSample(shiftHistory, newSample) shifting new bit into 8-bit history; returns 'PRESSED' when all 8 bits are 0 (Active Low pressed), 'RELEASED' when all 8 bits are 1, or 'BOUNCING'.",
    "eStarter": "function processDebounceSample(history, sample) {\n  // TODO: Shift history left, append sample, mask & 0xFF; check 0x00 vs 0xFF.\n  \n}",
    "eHint": "Shift history left, append sample, mask & 0xFF; check 0x00 vs 0xFF.",
    "eTest": "let h = 0xFF; // Idle high\nh = processDebounceSample(h, 0).updatedHistory;\nh = processDebounceSample(h, 0).updatedHistory;\nconst b = processDebounceSample(h, 1); // Bounce back high\nif (b.state !== 'BOUNCING_TRANSITION') throw new Error('Bounce state failed to detect oscillation');\nlet pressedH = 0x01;\nfor (let i = 0; i < 8; i++) pressedH = processDebounceSample(pressedH, 0).updatedHistory;\nif (processDebounceSample(pressedH, 0).state !== 'PRESSED_DEBOUNCED') throw new Error('Debounce pressed state failed');",
    "aTitle": "Pull-Up Inverter",
    "aDesc": "Implement function readActiveLowButton(rawGpioState) returning true if rawGpioState === 0.",
    "aStarter": "function readActiveLowButton(raw) {\n  // TODO: Check raw === 0.\n  \n}",
    "aHint": "Check raw === 0.",
    "aTest": "if (readActiveLowButton(0) !== true || readActiveLowButton(1) !== false) throw new Error('Active low failed');"
  },
  {
    "day": 4,
    "title": "Real-Time Operating Systems (FreeRTOS) Kernel Architecture & Task Concurrency",
    "desc": "Convert real-world continuous analog voltages into discrete integers with Successive Approximation Register (SAR) ADCs, quantization math, and voltage dividers.",
    "syllabus": [
      "ADC Resolution ($N$ bits) & Quantization Step Size ($V_{\\text{LSB}} = V_{\\text{ref}} / 2^N$).",
      "Voltage Divider Formula: $V_{\\text{out}} = V_{\\text{in}} \\times \\frac{R_2}{R_1 + R_2}$.",
      "Nyquist-Shannon Sampling Theorem ($f_s \\ge 2 f_{\\max}$) & Anti-Aliasing Filters."
    ],
    "eTitle": "Precision ADC Voltage & LSB Quantization Engine",
    "eDesc": "Implement function rawAdcToVoltage(rawVal, bitResolution = 12, vRef = 3.3) calculating exact measured analog voltage and LSB resolution step size.",
    "eStarter": "function rawAdcToVoltage(raw, bits = 12, vRef = 3.3) {\n  // TODO: Compute (raw / (2^bits - 1)) * vRef; lsb = vRef / 2^bits.\n  \n}",
    "eHint": "Compute (raw / (2^bits - 1)) * vRef; lsb = vRef / 2^bits.",
    "eTest": "const adc12 = rawAdcToVoltage(2048, 12, 3.3);\nif (adc12.voltage < 1.64 || adc12.voltage > 1.66) throw new Error('12-bit ADC voltage calculation incorrect');\nif (adc12.lsbStepMicrovolts < 800 || adc12.lsbStepMicrovolts > 810) throw new Error('LSB step microvolts incorrect');",
    "aTitle": "Voltage Divider Calculator",
    "aDesc": "Implement function calculateVout(vIn, r1, r2) returning `vIn * (r2 / (r1 + r2))`.",
    "aStarter": "function calculateVout(vIn, r1, r2) {\n  // TODO: Compute vIn * (r2 / (r1 + r2)).\n  \n}",
    "aHint": "Compute vIn * (r2 / (r1 + r2)).",
    "aTest": "if (calculateVout(5.0, 10000, 10000) !== 2.5) throw new Error('Voltage divider failed');"
  },
  {
    "day": 5,
    "title": "Embedded IoT Wireless Networking, BLE GATT Profiles, Low-Power Mesh & OTA Firmware Architecture",
    "desc": "Milestone 1: Build a production sensor conditioning engine: Multi-channel ADC reads, two-point offset/gain linear calibration ($y = mx + b$), moving average noise filtering, and threshold alert triggers.",
    "syllabus": [
      "Two-Point Calibration: Offset Error ($b$) and Gain Error ($m$) correction.",
      "Signal Conditioning: Software Oversampling to increase effective number of bits (ENOB).",
      "Rolling Moving Window Filter for electrical noise suppression."
    ],
    "eTitle": "Calibrated Sensor Conditioning Pipeline",
    "eDesc": "Implement function processSensorSignal(rawAdcArray, calibSlope, calibOffset, vRef = 3.3, bits = 12) applying moving average, calibration equation, and unit conversion.",
    "eStarter": "function processSensorSignal(rawArray, m, b, vRef = 3.3, bits = 12) {\n  // TODO: Compute average raw count -> convert to voltage -> apply calibrated = m * V + b.\n  \n}",
    "eHint": "Compute average raw count -> convert to voltage -> apply calibrated = m * V + b.",
    "eTest": "const rawSamples = [2040, 2050, 2045, 2055]; // ~2048 (1.65V)\nconst res = processSensorSignal(rawSamples, 100, -50, 3.3, 12); // Temperature sensor: 100°C/V, -50 offset\nif (res.calibratedValue < 114 || res.calibratedValue > 116) throw new Error('Sensor calibration pipeline failed');",
    "aTitle": "Two-Point Slope Calculator",
    "aDesc": "Implement function calculateCalibrationSlope(y1, y2, x1, x2) returning `(y2 - y1) / (x2 - x1)`.",
    "aStarter": "function calculateCalibrationSlope(y1, y2, x1, x2) {\n  // TODO: Compute delta y / delta x.\n  \n}",
    "aHint": "Compute delta y / delta x.",
    "aTest": "if (calculateCalibrationSlope(100, 200, 1.0, 2.0) !== 100) throw new Error('Slope calc failed');"
  },
  {
    "day": 6,
    "title": "Universal Asynchronous Receiver-Transmitter (UART): Baud Rates, Oversampling & Line Noise",
    "desc": "Generate variable average output voltages using hardware timers, duty cycle registers (CCR), auto-reload registers (ARR), and frequency prescalers.",
    "syllabus": [
      "PWM Fundamentals: Period ($T$), Frequency ($f = 1/T$), and Duty Cycle ($D = t_{\\text{on}} / T \\times 100\\%$).",
      "Timer Calculations: $f_{\\text{pwm}} = \\frac{f_{\\text{timer}}}{(\\text{PSC} + 1) \\times (\\text{ARR} + 1)}$.",
      "Applications: LED gamma-corrected dimming, DC motor H-Bridge speed control, and RC servo positioning."
    ],
    "eTitle": "Hardware Timer PWM Register Calculator",
    "eDesc": "Implement function calculatePwmRegisters(targetFreqHz, timerClockHz = 84000000, targetDutyPercent = 75) calculating optimal PSC, ARR, and CCR registers.",
    "eStarter": "function calculatePwmRegisters(targetFreq, timerClk = 84000000, dutyPercent = 75) {\n  // TODO: Compute arr = (timerClk / (psc + 1)) / targetFreq - 1; ccr = (arr + 1) * duty.\n  \n}",
    "eHint": "Compute arr = (timerClk / (psc + 1)) / targetFreq - 1; ccr = (arr + 1) * duty.",
    "eTest": "const pwm = calculatePwmRegisters(1000, 84000000, 50); // 1kHz PWM at 50% duty\nif (pwm.actualFrequencyHz !== 1000) throw new Error('PWM frequency calculation failed');\nif (pwm.autoReloadARR !== 999 || pwm.captureCompareCCR !== 500) throw new Error('PWM ARR/CCR calculation failed');",
    "aTitle": "Duty Cycle Voltage Estimator",
    "aDesc": "Implement function estimatePwmAverageVoltage(vcc, dutyPercent) returning `vcc * (duty / 100)`.",
    "aStarter": "function estimatePwmAverageVoltage(vcc, d) {\n  // TODO: Compute vcc * duty / 100.\n  \n}",
    "aHint": "Compute vcc * duty / 100.",
    "aTest": "if (estimatePwmAverageVoltage(3.3, 50) !== 1.65) throw new Error('PWM avg voltage failed');"
  },
  {
    "day": 7,
    "title": "Serial Peripheral Interface (SPI): Synchronous Shift Registers, CPOL, CPHA & High-Speed Clocks",
    "desc": "Handle asynchronous hardware events with Nested Vectored Interrupt Controllers (NVIC), Interrupt Service Routines (ISR), `volatile` atomic flags, and critical sections.",
    "syllabus": [
      "Interrupt Vector Table (IVT) & Interrupt Priorities (Preemption vs Sub-priority).",
      "The `volatile` Keyword: Forcing compiler to bypass register caching for variables modified in ISRs.",
      "ISR Golden Rule: Keep ISRs ultra-short (Set a flag or push to lock-free ring buffer; do not block or call `printf`)."
    ],
    "eTitle": "Lock-Free Ring Buffer for ISR Data Streaming",
    "eDesc": "Implement class IsrRingBuffer with pushFromIsr(val) and popInMainThread() using atomic head/tail indices.",
    "eStarter": "class IsrRingBuffer {\n  // TODO: Manage head and tail modulo capacity; push at head, pop at tail.\n  \n}",
    "eHint": "Manage head and tail modulo capacity; push at head, pop at tail.",
    "eTest": "const ring = new IsrRingBuffer(4);\nring.pushFromIsr(10);\nring.pushFromIsr(20);\nif (ring.popInMainThread() !== 10) throw new Error('Ring buffer FIFO order failed');\nif (ring.popInMainThread() !== 20) throw new Error('Ring buffer second pop failed');\nif (ring.popInMainThread() !== null) throw new Error('Empty ring buffer should return null');",
    "aTitle": "Interrupt Latency Calculator",
    "aDesc": "Implement function calculateIsrLatency(cpuFreqHz, cycles = 12) returning latency in nanoseconds.",
    "aStarter": "function calculateIsrLatency(freq, cycles = 12) {\n  // TODO: Compute (cycles / freq) * 1e9.\n  \n}",
    "aHint": "Compute (cycles / freq) * 1e9.",
    "aTest": "const lat = calculateIsrLatency(168000000, 12);\nif (typeof lat !== 'number' || lat < 71 || lat > 72) throw new Error('Latency calc failed');"
  },
  {
    "day": 8,
    "title": "Inter-Integrated Circuit (I2C): Open-Drain Buses, Pull-Ups, Start/Stop Conditions & Clock Stretching",
    "desc": "Schedule periodic tasks with hardware timer interrupts and prevent firmware lockups using Independent Watchdog (IWDG) and Window Watchdog (WWDG) timers.",
    "syllabus": [
      "Hardware General-Purpose Timers vs SysTick Core Timer.",
      "Independent Watchdog (IWDG): Separate low-speed internal RC oscillator (LSI 32kHz) ensuring watchdog trips even if main PLL crashes.",
      "Window Watchdog (WWDG): Enforcing both maximum timeout AND minimum refresh window to catch early errant loops."
    ],
    "eTitle": "Independent Watchdog (IWDG) Hardware Simulator",
    "eDesc": "Implement class WatchdogTimer with feed(), tick(msElapsed), and isResetTriggered() resetting system if not kicked within timeout.",
    "eStarter": "class WatchdogTimer {\n  // TODO: Track remaining time; if tick causes remaining <= 0, trigger hasReset = true.\n  \n}",
    "eHint": "Track remaining time; if tick causes remaining <= 0, trigger hasReset = true.",
    "eTest": "const wdt = new WatchdogTimer(500);\nwdt.tick(200);\nwdt.feed();\nwdt.tick(200);\nif (wdt.isResetTriggered()) throw new Error('Watchdog should not reset when fed in time');\nwdt.tick(600);\nif (!wdt.isResetTriggered()) throw new Error('Watchdog failed to trigger reset on starvation');",
    "aTitle": "WDT Prescaler Calculator",
    "aDesc": "Implement function calculateWdtTimeout(lsiFreq, prescaler, reload) returning timeout in ms.",
    "aStarter": "function calculateWdtTimeout(lsi, psc, rld) {\n  // TODO: Compute (rld * psc / lsi) * 1000.\n  \n}",
    "aHint": "Compute (rld * psc / lsi) * 1000.",
    "aTest": "if (calculateWdtTimeout(32000, 64, 500) !== 1000.0) throw new Error('WDT timeout failed');"
  },
  {
    "day": 9,
    "title": "Controller Area Network (CAN Bus): Differential Signaling, Arbitration & CRC Framing",
    "desc": "Transmit asynchronous serial data with Universal Asynchronous Receiver-Transmitter (UART): Baud rate dividers, 8N1 framing, parity checking, and ring buffers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of UART Serial Communication & Frame Framing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "UART 8N1 Frame Validator & Parity Checker",
    "eDesc": "Implement function validateUartFrame(frameBits, parityMode = 'NONE') validating start bit (0), 8 data bits, parity bit, and stop bit (1).",
    "eStarter": "function validateUartFrame(bits, parity = 'NONE') {\n  // TODO: Check bits[0] === 0 and bits[last] === 1; decode byte from bits.slice(1, 9).\n  \n}",
    "eHint": "Check bits[0] === 0 and bits[last] === 1; decode byte from bits.slice(1, 9).",
    "eTest": "const frameA = [0, 1, 0, 0, 0, 0, 0, 1, 0, 1]; // 'A' = 65 (0x41) with start 0 and stop 1\nconst res = validateUartFrame(frameA);\nif (!res.valid || res.dataByte !== 65 || res.char !== 'A') throw new Error('UART 8N1 frame decoder failed');",
    "aTitle": "Baud Rate Baud-Rate-Register (BRR) Calculator",
    "aDesc": "Implement function calculateUartBrr(fClk, baud) returning `fClk / baud` rounded to nearest int.",
    "aStarter": "function calculateUartBrr(fClk, baud) {\n  // TODO: Compute round(fClk / baud).\n  \n}",
    "aHint": "Compute round(fClk / baud).",
    "aTest": "if (calculateUartBrr(84000000, 115200) !== 729) throw new Error('BRR calc failed');"
  },
  {
    "day": 10,
    "title": "Milestone 2: Multi-Protocol Hardware Bus Engine (Zero-Drop UART/SPI/I2C Transceiver)",
    "desc": "Communicate with multi-sensor peripherals over synchronous 2-wire I2C (SDA/SCL): Open-drain bus, pull-up resistors, 7-bit addressing, and ACK/NACK signaling.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of I2C Serial Bus: Master-Slave Addressing & Pull-Ups.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "I2C 7-Bit Address Byte Encoder & Protocol Simulator",
    "eDesc": "Implement function formatI2cAddressByte(slave7BitAddress, isRead) shifting address left 1 bit and appending R/W bit ($1 = \\text{Read}, 0 = \\text{Write}$).",
    "eStarter": "function formatI2cAddressByte(addr7Bit, isRead) {\n  // TODO: Shift addr7Bit << 1, bitwise OR with (isRead ? 1 : 0).\n  \n}",
    "eHint": "Shift addr7Bit << 1, bitwise OR with (isRead ? 1 : 0).",
    "eTest": "const writeByte = formatI2cAddressByte(0x68, false); // MPU6050 write\nconst readByte = formatI2cAddressByte(0x68, true);   // MPU6050 read\nif (writeByte.wireByteInt !== 0xD0 || readByte.wireByteInt !== 0xD1) throw new Error('I2C address byte format incorrect');",
    "aTitle": "I2C Minimum Pull-Up Resistor Calculator",
    "aDesc": "Implement function calculateMinI2cPullup(vcc, volMax = 0.4, iol = 0.003) returning `(vcc - volMax) / iol`.",
    "aStarter": "function calculateMinI2cPullup(vcc, vol = 0.4, iol = 0.003) {\n  // TODO: Compute (vcc - vol) / iol.\n  \n}",
    "aHint": "Compute (vcc - vol) / iol.",
    "aTest": "if (calculateMinI2cPullup(3.3) !== 967) throw new Error('Pull-up calc failed');"
  },
  {
    "day": 11,
    "title": "Nested Vectored Interrupt Controller (NVIC): Vector Tables, Priority Grouping & Preemption",
    "desc": "Stream megabytes of sensor/display data over 4-wire SPI (MOSI, MISO, SCK, CS): CPOL and CPHA clock polarity modes, full-duplex shift registers, and multi-slave CS lines.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of SPI (Serial Peripheral Interface): High-Speed Full-Duplex Bus.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "SPI Clock Polarity & Phase (CPOL / CPHA) Mode Resolver",
    "eDesc": "Implement function resolveSpiMode(cpol, cpha) returning standard SPI Mode number (0, 1, 2, or 3) and sampling edge description.",
    "eStarter": "function resolveSpiMode(cpol, cpha) {\n  // TODO: Mode = (cpol << 1) | cpha.\n  \n}",
    "eHint": "Mode = (cpol << 1) | cpha.",
    "eTest": "if (resolveSpiMode(0, 0).modeNumber !== 0) throw new Error('SPI Mode 0 failed');\nif (resolveSpiMode(1, 1).modeNumber !== 3) throw new Error('SPI Mode 3 failed');",
    "aTitle": "SPI Transfer Time Calculator",
    "aDesc": "Implement function calculateSpiTransferTimeUs(byteCount, clockFreqHz) returning transfer time in microseconds.",
    "aStarter": "function calculateSpiTransferTimeUs(bytes, freq) {\n  // TODO: Compute (bytes * 8 / freq) * 1e6.\n  \n}",
    "aHint": "Compute (bytes * 8 / freq) * 1e6.",
    "aTest": "if (calculateSpiTransferTimeUs(1024, 10000000) !== 819.2) throw new Error('SPI time failed');"
  },
  {
    "day": 12,
    "title": "Interrupt Service Routines (ISRs): Latency Budgets, Tail-Chaining & Late-Arrival Physics",
    "desc": "Run multi-threaded firmware with FreeRTOS: Task Control Blocks (TCB), preemptive priority-based scheduling, SysTick context switching, and stack overflow hooks.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Real-Time Operating Systems (RTOS): Tasks & Preemptive Schedulers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "FreeRTOS Priority Preemptive Scheduler Simulator",
    "eDesc": "Implement function scheduleNextTask(readyTaskList) returning highest priority READY task (higher number = higher priority) with round-robin tie breaking.",
    "eStarter": "function scheduleNextTask(tasks) {\n  // TODO: Filter tasks with state === 'READY', sort by priority descending, pick first.\n  \n}",
    "eHint": "Filter tasks with state === 'READY', sort by priority descending, pick first.",
    "eTest": "const tasks = [\n  { name: 'TelemetryTask', priority: 1, state: 'READY' },\n  { name: 'MotorControlTask', priority: 4, state: 'READY' },\n  { name: 'DisplayTask', priority: 2, state: 'BLOCKED' }\n];\nconst res = scheduleNextTask(tasks);\nif (res.selectedTask !== 'MotorControlTask' || res.priority !== 4) throw new Error('Preemptive scheduler failed to pick highest priority ready task');",
    "aTitle": "Stack Watermark Checker",
    "aDesc": "Implement function isStackOverflowRisk(freeStackWords, minAllowed = 32) returning true if free < minAllowed.",
    "aStarter": "function isStackOverflowRisk(free, min = 32) {\n  // TODO: Check free < min.\n  \n}",
    "aHint": "Check free < min.",
    "aTest": "if (isStackOverflowRisk(20, 32) !== true) throw new Error('Stack watermark failed');"
  },
  {
    "day": 13,
    "title": "SysTick System Timer & Hardware General-Purpose Timers: Prescalers, ARR & PWM Generation",
    "desc": "Synchronize concurrent RTOS tasks safely: Binary & Counting Semaphores, Mutexes, and Priority Inheritance Protocols to prevent catastrophic Priority Inversion.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of RTOS Synchronization: Mutexes, Semaphores & Priority Inversion.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Priority Inheritance Mutex Protocol Simulator",
    "eDesc": "Implement function acquireMutexWithPriorityInheritance(mutex, requestingTask) boosting mutex holder's priority to match requesting task if higher.",
    "eStarter": "function acquireMutexWithPriorityInheritance(mutex, task) {\n  // TODO: If locked and task.priority > owner.priority, boost owner priority to task.priority.\n  \n}",
    "eHint": "If locked and task.priority > owner.priority, boost owner priority to task.priority.",
    "eTest": "const lowTask = { name: 'LowTask', priority: 1, effectivePriority: 1 };\nconst highTask = { name: 'HighTask', priority: 5, effectivePriority: 5 };\nconst mutex = { isLocked: false, owner: null };\nacquireMutexWithPriorityInheritance(mutex, lowTask);\nconst res = acquireMutexWithPriorityInheritance(mutex, highTask);\nif (!res.priorityInversionAvoided || lowTask.effectivePriority !== 5) throw new Error('Priority inheritance protocol failed to boost low task priority');",
    "aTitle": "Semaphore Counter Formatter",
    "aDesc": "Implement function formatSemaphoreState(available, max) returning `${available}/${max} slots available`.",
    "aStarter": "function formatSemaphoreState(a, m) {\n  // TODO: Format slots string.\n  \n}",
    "aHint": "Format slots string.",
    "aTest": "if (formatSemaphoreState(3, 5) !== '3/5 slots available') throw new Error('Semaphore format failed');"
  },
  {
    "day": 14,
    "title": "Analog-to-Digital Conversion (ADC) & DAC: Successive Approximation (SAR), Sampling Times & Nyquist Limits",
    "desc": "Offload high-speed memory transfers from CPU using Direct Memory Access (DMA) controllers: Circular mode, Half-Transfer / Transfer-Complete ISRs, and cache coherency.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Direct Memory Access (DMA) & Circular Buffers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Double-Buffered DMA Ping-Pong Processor",
    "eDesc": "Implement function processDmaHalfTransfer(dmaBuffer, halfTransferEvent) processing Buffer A on Half-Transfer and Buffer B on Full-Transfer without CPU stall.",
    "eStarter": "function processDmaHalfTransfer(buffer, event) {\n  // TODO: Slice buffer 0 to half for Half-Transfer; half to end for Full-Transfer.\n  \n}",
    "eHint": "Slice buffer 0 to half for Half-Transfer; half to end for Full-Transfer.",
    "eTest": "const buf = [1, 2, 3, 4, 5, 6, 7, 8];\nconst halfRes = processDmaHalfTransfer(buf, 'DMA_HALF_TRANSFER_COMPLETE');\nconst fullRes = processDmaHalfTransfer(buf, 'DMA_TRANSFER_COMPLETE');\nif (halfRes.processedChunk !== 'BUFFER_A' || halfRes.data[0] !== 1) throw new Error('DMA half transfer failed');\nif (fullRes.processedChunk !== 'BUFFER_B' || fullRes.data[0] !== 5) throw new Error('DMA transfer complete failed');",
    "aTitle": "DMA Bandwidth Savings Calculator",
    "aDesc": "Implement function calculateCpuOffloadPercent(dmaBytes, totalBytes) returning `${((dmaBytes/totalBytes)*100).toFixed(1)}%`.",
    "aStarter": "function calculateCpuOffloadPercent(d, t) {\n  // TODO: Compute (d / t) * 100.\n  \n}",
    "aHint": "Compute (d / t) * 100.",
    "aTest": "if (calculateCpuOffloadPercent(950, 1000) !== '95.0%') throw new Error('DMA savings failed');"
  },
  {
    "day": 15,
    "title": "Milestone 3: Real-Time Hardware Signal Generator & DMA Data Engine",
    "desc": "Milestone 2: Build a production RTOS telemetry acquisition system: FreeRTOS task scheduling, DMA circular ADC buffer, SPI sensor reads with priority inheritance mutex, and UART telemetry output.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Multi-Tasking RTOS Telemetry Engine with DMA & Circular Buffers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "RTOS Telemetry Acquisition Engine",
    "eDesc": "Implement function runRtosTelemetryCycle(sensorTasks, dmaBuffer, telemetryQueue) executing task pipeline, acquiring mutexes, and outputting formatted telemetry packets.",
    "eStarter": "function runRtosTelemetryCycle(tasks, dma, queue) {\n  // TODO: Sort ready tasks by priority, extract DMA sample, push telemetry packet to queue.\n  \n}",
    "eHint": "Sort ready tasks by priority, extract DMA sample, push telemetry packet to queue.",
    "eTest": "const tasks = [{ id: 1, name: 'IMU', priority: 3, state: 'READY' }, { id: 2, name: 'GPS', priority: 2, state: 'READY' }];\nconst dma = [100, 200];\nconst q = [];\nconst res = runRtosTelemetryCycle(tasks, dma, q);\nif (res.status !== 'RTOS_CYCLE_COMPLETE_SUCCESS' || q.length !== 2) throw new Error('Milestone 2 RTOS telemetry cycle failed');",
    "aTitle": "Telemetry Packet Header Formatter",
    "aDesc": "Implement function formatTelemetryHeader(seq, length) returning `[TLM:0x${seq.toString(16).toUpperCase()}:${length}B]`.",
    "aStarter": "function formatTelemetryHeader(s, l) {\n  // TODO: Format header string.\n  \n}",
    "aHint": "Format header string.",
    "aTest": "if (formatTelemetryHeader(15, 64) !== '[TLM:0xF:64B]') throw new Error('Header format failed');"
  },
  {
    "day": 16,
    "title": "Direct Memory Access (DMA) Controller: Streams, Channels & Bus Matrix Arbitration",
    "desc": "Maximize battery life for 10-year IoT field deployments: Run, Sleep, Stop, Standby, and Deep Sleep power modes, RTC timer wake-ups, and brownout detectors (BOD).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Ultra-Low Power Modes & Deep Sleep Wake-Up Triggers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "IoT Battery Life & Deep Sleep Current Duty Cycle Calculator",
    "eDesc": "Implement function calculateBatteryLifeYears(batteryCapacityMah, activeCurrentMa, activeDurationSec, sleepCurrentUa, sleepDurationSec) calculating operating life in years.",
    "eStarter": "function calculateBatteryLifeYears(capacityMah, activeMa, activeSec, sleepUa, sleepSec) {\n  // TODO: Compute avgCurrent = (activeMa * activeSec + sleepMa * sleepSec) / period; years = (capacity / avg) / 8766.\n  \n}",
    "eHint": "Compute avgCurrent = (activeMa * activeSec + sleepMa * sleepSec) / period; years = (capacity / avg) / 8766.",
    "eTest": "const res = calculateBatteryLifeYears(2400, 20.0, 1, 5, 59); // 20mA for 1s, 5uA for 59s on 2400mAh battery\nif (res.batteryLifeYears < 0.7 || res.batteryLifeYears > 0.9) throw new Error('Battery life calculation incorrect');",
    "aTitle": "Sleep Mode Current Estimator",
    "aDesc": "Implement function getSleepCurrentUa(mode) returning microamps: 'RUN' -> 15000, 'STOP' -> 50, 'DEEP_SLEEP' -> 2.",
    "aStarter": "function getSleepCurrentUa(m) {\n  // TODO: Return current for mode.\n  \n}",
    "aHint": "Return current for mode.",
    "aTest": "if (getSleepCurrentUa('DEEP_SLEEP') !== 2) throw new Error('Sleep current failed');"
  },
  {
    "day": 17,
    "title": "Circular DMA & Ping-Pong Buffers: Half-Transfer (HT) & Transfer-Complete (TC) Zero-Copy Streaming",
    "desc": "Stream telemetry over low-bandwidth networks with MQTT: Hierarchical topics (`factory/line1/temp`), QoS 0, 1, 2 delivery tiers, Retained messages, and LWT.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of MQTT Protocol: Topics, QoS Tiers & Last Will and Testament.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "MQTT Topic Wildcard Matcher (+ and #)",
    "eDesc": "Implement function matchMqttTopic(subscriptionPattern, publishedTopic) supporting single-level `+` and multi-level `#` wildcards.",
    "eStarter": "function matchMqttTopic(sub, pub) {\n  // TODO: Compare parts: '+' matches single level, '#' matches remaining levels.\n  \n}",
    "eHint": "Compare parts: '+' matches single level, '#' matches remaining levels.",
    "eTest": "if (!matchMqttTopic('sensors/+/temperature', 'sensors/room1/temperature')) throw new Error('Single wildcard failed');\nif (!matchMqttTopic('sensors/#', 'sensors/factory/line2/press')) throw new Error('Multi wildcard failed');\nif (matchMqttTopic('sensors/+/temperature', 'sensors/room1/humidity')) throw new Error('Mismatch should fail');",
    "aTitle": "MQTT QoS Guarantee Classifier",
    "aDesc": "Implement function getMqttQosDescription(qos) returning description string.",
    "aStarter": "function getMqttQosDescription(q) {\n  // TODO: Return description for QoS.\n  \n}",
    "aHint": "Return description for QoS.",
    "aTest": "if (getMqttQosDescription(1) !== 'At least once') throw new Error('QoS description failed');"
  },
  {
    "day": 18,
    "title": "Cache Coherency & Memory Barriers: D-Cache Invalidation, Clean-and-Invalidate & Cortex-M7 Physics",
    "desc": "Build lightweight RESTful IoT services with CoAP (RFC 7252) over UDP: 4-byte header binary serialization, Confirmable (CON) vs Non-Confirmable (NON) packets, and Observe (RFC 7641).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of CoAP & Constrained Application Protocol over UDP.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CoAP 4-Byte Binary Header Serializer",
    "eDesc": "Implement function encodeCoapHeader(ver = 1, type = 'CON', code = 'GET', msgId = 0x1234) encoding 4-byte CoAP header into Uint8Array.",
    "eStarter": "function encodeCoapHeader(ver = 1, type = 'CON', code = 'GET', msgId = 0x1234) {\n  // TODO: Pack (ver<<6)|(type<<4), code, msgId high, msgId low.\n  \n}",
    "eHint": "Pack (ver<<6)|(type<<4), code, msgId high, msgId low.",
    "eTest": "const header = encodeCoapHeader(1, 'CON', 'GET', 0x1234);\nif (header[0] !== 0x40 || header[1] !== 0x01 || header[2] !== 0x12 || header[3] !== 0x34) throw new Error('CoAP 4-byte header encoding failed');",
    "aTitle": "CoAP Code Class Extractor",
    "aDesc": "Implement function getCoapCodeClass(codeByte) returning class number (`codeByte >> 5`).",
    "aStarter": "function getCoapCodeClass(b) {\n  // TODO: Extract byte >> 5.\n  \n}",
    "aHint": "Extract byte >> 5.",
    "aTest": "if (getCoapCodeClass(0x45) !== 2) throw new Error('CoAP class failed');"
  },
  {
    "day": 19,
    "title": "Hardware Watchdog Timers: Independent Watchdog (IWDG), Window Watchdog (WWDG) & Anti-Freeze Fail-Safes",
    "desc": "Design low-power smartphone peripherals with BLE GATT (Generic Attribute Profile): 128-bit UUIDs, Primary Services, Read/Write/Notify Characteristics, and Advertising Packets.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Bluetooth Low Energy (BLE): GATT Profiles, Services & Characteristics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "BLE GATT Characteristic Packet Encoder",
    "eDesc": "Implement function formatBleNotification(charUuid, valueBytes) packaging payload into standard GATT notification packet with timestamp and CRC.",
    "eStarter": "function formatBleNotification(uuid, bytes) {\n  // TODO: Map bytes to uppercase hex string and format notification object.\n  \n}",
    "eHint": "Map bytes to uppercase hex string and format notification object.",
    "eTest": "const res = formatBleNotification('00002A37-0000-1000-8000-00805F9B34FB', [0x00, 0x4B]); // Heart Rate 75 bpm\nif (res.hexData !== '004B' || res.payloadLength !== 2) throw new Error('BLE GATT packet format failed');",
    "aTitle": "16-bit to 128-bit UUID Expander",
    "aDesc": "Implement function expandBleUuid16(uuid16Hex) returning full Bluetooth SIG standard 128-bit UUID.",
    "aStarter": "function expandBleUuid16(u16) {\n  // TODO: Format standard Bluetooth SIG 128-bit UUID.\n  \n}",
    "aHint": "Format standard Bluetooth SIG 128-bit UUID.",
    "aTest": "if (expandBleUuid16('2A37') !== '00002A37-0000-1000-8000-00805F9B34FB') throw new Error('UUID expansion failed');"
  },
  {
    "day": 20,
    "title": "Milestone 4: Zero-CPU DMA Streaming Ring Buffer & Fail-Safe Watchdog Engine",
    "desc": "Filter noisy real-world analog sensor telemetry with discrete algorithms: Moving Average, Exponential Moving Average (EMA), and 1D Kalman Filters.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Digital Signal Processing (DSP) & 1D Kalman Filtering.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "1D Kalman Filter Sensor Noise Eliminator",
    "eDesc": "Implement class KalmanFilter1D with update(measurement) maintaining state estimate $x$ and error covariance $p$ given process noise $q$ and measurement noise $r$.",
    "eStarter": "class KalmanFilter1D {\n  // TODO: Compute p = p + q; k = p / (p + r); x = x + k*(m - x); p = (1 - k)*p.\n  \n}",
    "eHint": "Compute p = p + q; k = p / (p + r); x = x + k*(m - x); p = (1 - k)*p.",
    "eTest": "const kf = new KalmanFilter1D(0.01, 0.1, 1.0, 20.0);\nlet estimate = 20.0;\nconst noisyMeasurements = [25.0, 18.0, 24.0, 19.0, 21.0];\nfor (const m of noisyMeasurements) estimate = kf.update(m);\nif (estimate < 20.0 || estimate > 22.0) throw new Error('Kalman filter failed to smooth noisy measurements toward true mean');",
    "aTitle": "EMA Smoothing Calculator",
    "aDesc": "Implement function calculateEma(currentSample, previousEma, alpha = 0.2) returning `alpha * current + (1 - alpha) * previous`.",
    "aStarter": "function calculateEma(cur, prev, a = 0.2) {\n  // TODO: Compute alpha * cur + (1 - alpha) * prev.\n  \n}",
    "aHint": "Compute alpha * cur + (1 - alpha) * prev.",
    "aTest": "if (calculateEma(30, 20, 0.5) !== 25.0) throw new Error('EMA failed');"
  },
  {
    "day": 21,
    "title": "Real-Time Operating System (RTOS) Physics: Hard vs Soft RTOS, Task Control Blocks & Stacks",
    "desc": "Milestone 3: Build a production wireless sensor node: I2C environmental sensor read, 1D Kalman noise filter, BLE GATT characteristic broadcast, and Deep Sleep RTC wake-up cycle.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Ultra-Low Power Wireless BLE/MQTT Sensor Node.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Wireless Low-Power Sensor Node Pipeline",
    "eDesc": "Implement function runWirelessSensorCycle(rawSensorVal, kalmanFilter, bleGattService, powerManager) executing read, filter, transmit, and sleep workflow.",
    "eStarter": "function runWirelessSensorCycle(rawVal, kf, ble, pwr) {\n  // TODO: Filter value -> notify BLE -> enter sleep -> return status.\n  \n}",
    "eHint": "Filter value -> notify BLE -> enter sleep -> return status.",
    "eTest": "const mockKf = { update: (v) => v * 0.9 };\nconst mockBle = { notify: (uuid, data) => ({ success: true, uuid }) };\nconst mockPwr = { enterDeepSleep: (ms) => true };\nconst res = runWirelessSensorCycle(25.0, mockKf, mockBle, mockPwr);\nif (res.status !== 'SENSOR_NODE_CYCLE_SUCCESS' || res.powerState !== 'DEEP_SLEEP_ENTERED') throw new Error('Milestone 3 wireless sensor cycle failed');",
    "aTitle": "Packet Energy Cost Estimator",
    "aDesc": "Implement function estimatePacketEnergyUj(txCurrentMa, durationMs, voltage = 3.3) returning microjoules ($V \\times I \\times t$).",
    "aStarter": "function estimatePacketEnergyUj(iMa, dMs, v = 3.3) {\n  // TODO: Compute v * i * t * 1e6.\n  \n}",
    "aHint": "Compute v * i * t * 1e6.",
    "aTest": "if (estimatePacketEnergyUj(15, 10, 3.3) !== 495.0) throw new Error('Energy calc failed');"
  },
  {
    "day": 22,
    "title": "Preemptive Scheduling & Context Switching: PendSV Exception, SysTick & Assembly Stack Swapping",
    "desc": "Actuate mechanical hardware with microcontrollers: DC Motors with Dual H-Bridges (L298N / DRV8833), Stepper motors (A4988 step/dir pulses), and RC Servos (50Hz 1ms-2ms pulses).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Motor Control: Steppers, Servos & H-Bridge Drivers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "RC Servo 50Hz PWM Pulse Angle Translator",
    "eDesc": "Implement function angleToServoPulseUs(angleDegrees, minUs = 500, maxUs = 2500) translating 0° to 180° into exact microsecond pulse width.",
    "eStarter": "function angleToServoPulseUs(angle, minUs = 500, maxUs = 2500) {\n  // TODO: Compute minUs + (angle / 180) * (maxUs - minUs); duty at 50Hz is pulse / 20000.\n  \n}",
    "eHint": "Compute minUs + (angle / 180) * (maxUs - minUs); duty at 50Hz is pulse / 20000.",
    "eTest": "const center = angleToServoPulseUs(90);\nconst fullRight = angleToServoPulseUs(180);\nif (center.pulseWidthUs !== 1500 || center.dutyPercent50Hz !== 7.5) throw new Error('90 degree servo pulse incorrect');\nif (fullRight.pulseWidthUs !== 2500 || fullRight.dutyPercent50Hz !== 12.5) throw new Error('180 degree servo pulse incorrect');",
    "aTitle": "Stepper Step-to-Angle Converter",
    "aDesc": "Implement function stepsToDegrees(steps, stepAngle = 1.8) returning `steps * stepAngle`.",
    "aStarter": "function stepsToDegrees(s, a = 1.8) {\n  // TODO: Compute steps * angle.\n  \n}",
    "aHint": "Compute steps * angle.",
    "aTest": "if (stepsToDegrees(200, 1.8) !== 360.0) throw new Error('Stepper step failed');"
  },
  {
    "day": 23,
    "title": "Task Synchronization: Semaphores, Mutexes & Priority Inversion (The Mars Pathfinder Incident)",
    "desc": "Persist configuration data across power cycles: EEPROM byte-addressability vs Flash sector erases (100k write cycles), Flash Translation Layers (FTL), and wear-leveling algorithms.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Non-Volatile Memory: EEPROM & Flash Wear-Leveling.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Circular Flash Log Wear-Leveling Manager",
    "eDesc": "Implement class FlashWearLeveler with writeEntry(data), getLatest(), and getSectorEraseCounts() distributing writes evenly across $N$ flash sectors.",
    "eStarter": "class FlashWearLeveler {\n  // TODO: Advance currentSector on capacity, increment eraseCount on sector wrap.\n  \n}",
    "eHint": "Advance currentSector on capacity, increment eraseCount on sector wrap.",
    "eTest": "const f = new FlashWearLeveler(3, 2);\nfor (let i = 1; i <= 6; i++) f.writeEntry(`Data_${i}`);\nconst erases = f.getSectorEraseCounts();\nif (erases[1] !== 1 || erases[2] !== 1) throw new Error('Flash wear-leveling failed to distribute sector erases');",
    "aTitle": "Flash Endurance Lifetime Calculator",
    "aDesc": "Implement function calculateFlashLifespanYears(writesPerDay, maxEraseCycles = 100000) returning years.",
    "aStarter": "function calculateFlashLifespanYears(w, max = 100000) {\n  // TODO: Compute max / (w * 365.25).\n  \n}",
    "aHint": "Compute max / (w * 365.25).",
    "aTest": "if (calculateFlashLifespanYears(10, 100000) !== 27.4) throw new Error('Lifespan calc failed');"
  },
  {
    "day": 24,
    "title": "Inter-Task Communication: FreeRTOS Queues, Direct-to-Task Notifications & Event Groups",
    "desc": "Update remote firmware safely in the field: Dual-Bank Flash partitioning (Slot 0 Active, Slot 1 OTA Update), cryptographic checksum verification, and automatic rollback on crash.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Over-The-Air (OTA) Firmware Updates & Dual-Bank Bootloaders.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Dual-Bank Bootloader Flash Rollback Validator",
    "eDesc": "Implement function bootloaderSelectSlot(activeSlot, otaSlotValid, otaBootSuccessful) selecting slot and triggering rollback if new firmware fails watchdog boot test.",
    "eStarter": "function bootloaderSelectSlot(activeSlot, otaValid, otaBootSuccess) {\n  // TODO: If otaValid and otaBootSuccess boot slot 1, else rollback to slot 0.\n  \n}",
    "eHint": "If otaValid and otaBootSuccess boot slot 1, else rollback to slot 0.",
    "eTest": "const successBoot = bootloaderSelectSlot(0, true, true);\nconst failedBoot = bootloaderSelectSlot(0, true, false);\nif (successBoot.status !== 'OTA_UPDATE_COMMITTED') throw new Error('OTA commit failed');\nif (failedBoot.status !== 'OTA_BOOT_CRASH_AUTO_ROLLBACK_TRIGGERED' || failedBoot.bootSlot !== 'SLOT_0_FACTORY_FALLBACK') throw new Error('Dual-bank auto-rollback failed');",
    "aTitle": "Firmware CRC32 Formatter",
    "aDesc": "Implement function formatFirmwareHeader(ver, crc) returning `[FW:v${ver}:CRC:0x${crc.toString(16).toUpperCase()}]`.",
    "aStarter": "function formatFirmwareHeader(v, c) {\n  // TODO: Format header string.\n  \n}",
    "aHint": "Format header string.",
    "aTest": "if (formatFirmwareHeader('1.2.0', 0xAABBCCDD) !== '[FW:v1.2.0:CRC:0xAABBCCDD]') throw new Error('CRC header failed');"
  },
  {
    "day": 25,
    "title": "Milestone 5: Preemptive RTOS Kernel & Priority-Inheritance Task Manager Engine",
    "desc": "Protect IoT edge nodes from physical tampering and firmware cloning: Hardware Root of Trust (RoT), Secure Element chips (ATECC608), eFuses, and ECDSA signature verification.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Hardware Security: Secure Boot, Root of Trust & Cryptographic Accelerators.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Hardware Secure Boot ECDSA Signature Verifier",
    "eDesc": "Implement function verifySecureBootSignature(imageSha256, ecdsaSignature, publicRootKey, eFuseLocked) authenticating firmware image before execution.",
    "eStarter": "function verifySecureBootSignature(sha256, sig, pubKey, eFuse) {\n  // TODO: Check eFuse is true, signature starts with 'sig_valid_', pubKey matches production key.\n  \n}",
    "eHint": "Check eFuse is true, signature starts with 'sig_valid_', pubKey matches production key.",
    "eTest": "const valid = verifySecureBootSignature('hash123', 'sig_valid_9981', 'ROOT_KEY_PROD_101', true);\nconst invalidSig = verifySecureBootSignature('hash123', 'sig_fake', 'ROOT_KEY_PROD_101', true);\nconst openEfuse = verifySecureBootSignature('hash123', 'sig_valid_9981', 'ROOT_KEY_PROD_101', false);\nif (!valid.allowed) throw new Error('Valid signature should pass');\nif (invalidSig.allowed || openEfuse.allowed) throw new Error('Untrusted binary or unlocked eFuse must be rejected');",
    "aTitle": "eFuse State Formatter",
    "aDesc": "Implement function formatEfuseStatus(isBlown) returning description.",
    "aStarter": "function formatEfuseStatus(b) {\n  // TODO: Return status description.\n  \n}",
    "aHint": "Return status description.",
    "aTest": "if (!formatEfuseStatus(true).includes('Locked')) throw new Error('eFuse format failed');"
  },
  {
    "day": 26,
    "title": "RTOS Dynamic Memory Allocation: heap_1 through heap_5, Fragmentation & Static Allocation",
    "desc": "Communicate across harsh automotive & industrial environments with CAN Bus 2.0B: Differential voltage (CAN_H / CAN_L), Non-destructive bitwise arbitration, and 11-bit identifier framing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of CAN Bus (Controller Area Network) & Automotive Differential Signaling.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CAN Bus Non-Destructive Bitwise Arbitration Simulator",
    "eDesc": "Implement function arbitrateCanBus(nodeA_Id, nodeB_Id) determining winning node on CAN bus (Dominant 0 overwrites Recessive 1; lower numeric ID wins arbitration).",
    "eStarter": "function arbitrateCanBus(idA, idB) {\n  // TODO: Compare IDs: lowest numeric ID wins arbitration without corrupting bus.\n  \n}",
    "eHint": "Compare IDs: lowest numeric ID wins arbitration without corrupting bus.",
    "eTest": "const res = arbitrateCanBus(0x100, 0x200); // 0x100 is higher priority than 0x200\nif (res.winner !== 'NODE_A' || res.winningId !== 0x100) throw new Error('CAN bus arbitration failed: dominant lower ID should win');",
    "aTitle": "CAN Standard vs Extended ID Formatter",
    "aDesc": "Implement function formatCanId(id) returning standard (11-bit) or extended (29-bit) label.",
    "aStarter": "function formatCanId(id) {\n  // TODO: Check id <= 0x7FF.\n  \n}",
    "aHint": "Check id <= 0x7FF.",
    "aTest": "if (!formatCanId(0x123).includes('Standard')) throw new Error('CAN ID format failed');"
  },
  {
    "day": 27,
    "title": "Software Timers & Idle Task Hook: Watchdog Kicking & Tickless Low-Power Mode (WFI/WFE)",
    "desc": "Connect battery-powered remote devices across 15km distances: LoRa modulation (Spreading Factor SF7-SF12), LoRaWAN Class A/B/C, and Cellular NB-IoT (PSM / eDRX).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cellular NB-IoT & LoRaWAN Long-Range LPWAN Networks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "LoRa Time-on-Air (ToA) & Spreading Factor Calculator",
    "eDesc": "Implement function calculateLoraToaMs(payloadBytes, spreadingFactor = 7, bandwidthKhz = 125) calculating transmission Time-on-Air and legal duty cycle limit.",
    "eStarter": "function calculateLoraToaMs(bytes, sf = 7, bw = 125) {\n  // TODO: Compute symbol duration = 2^sf / bw; total time on air = preamble + payload duration.\n  \n}",
    "eHint": "Compute symbol duration = 2^sf / bw; total time on air = preamble + payload duration.",
    "eTest": "const toa = calculateLoraToaMs(16, 7, 125); // 16 bytes on SF7\nif (toa.timeOnAirMs < 30 || toa.timeOnAirMs > 60) throw new Error('LoRa Time-on-Air calculation failed');",
    "aTitle": "Spreading Factor Range Classifier",
    "aDesc": "Implement function getSfLinkBudget(sf) returning link budget in dB.",
    "aStarter": "function getSfLinkBudget(sf) {\n  // TODO: Compute 130 + (sf - 7) * 2.5.\n  \n}",
    "aHint": "Compute 130 + (sf - 7) * 2.5.",
    "aTest": "if (getSfLinkBudget(7) !== 130.0) throw new Error('SF budget failed');"
  },
  {
    "day": 28,
    "title": "MISRA-C & ISO 26262 Coding Standards: Static Analysis, Undefined Behavior & Safe Embedded Patterns",
    "desc": "Run machine learning models on microcontrollers with TensorFlow Lite for Microcontrollers (TFLM): INT8 post-training quantization, DSP CMSIS-NN SIMD intrinsics, and Arena RAM allocation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Edge AI & TinyML Quantized Neural Network Inference.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "TinyML INT8 Dequantization & Inference Simulator",
    "eDesc": "Implement function dequantizeInt8Value(qVal, scale, zeroPoint) converting 8-bit integer into floating point value $x = (q - z) \\times s$.",
    "eStarter": "function dequantizeInt8Value(q, scale, zeroPoint) {\n  // TODO: Compute (q - zeroPoint) * scale.\n  \n}",
    "eHint": "Compute (q - zeroPoint) * scale.",
    "eTest": "const floatVal = dequantizeInt8Value(120, 0.05, -8);\nif (floatVal !== 6.4) throw new Error('INT8 dequantization failed: expected 6.4');",
    "aTitle": "Tensor Arena Memory Estimator",
    "aDesc": "Implement function estimateTensorArenaBytes(weightsInt8Bytes, activationsBytes, overhead = 1024) returning total arena RAM bytes.",
    "aStarter": "function estimateTensorArenaBytes(w, a, o = 1024) {\n  // TODO: Compute w + a + o.\n  \n}",
    "aHint": "Compute w + a + o.",
    "aTest": "if (estimateTensorArenaBytes(16384, 8192) !== 25600) throw new Error('Arena calc failed');"
  },
  {
    "day": 29,
    "title": "Production Hardware Debugging: SWD/JTAG Protocols, Fault Handlers & Core Dump Forensics",
    "desc": "Debug and trace firmware crashes: Serial Wire Debug (SWD), JTAG boundary scan, ITM / SWO printf trace, and Logic Analyzer protocol decoding.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Hardware Debugging: SWD, JTAG & Logic Analyzer Tracing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "HardFault Crash Dump Register Analyzer",
    "eDesc": "Implement function analyzeHardFaultRegisters(r0, r1, r2, r3, r12, lr, pc, psr) parsing stacked exception frame and pinpointing crashing instruction address (PC).",
    "eStarter": "function analyzeHardFaultRegisters(r0, r1, r2, r3, r12, lr, pc, psr) {\n  // TODO: Format pc, lr in uppercase hex; check psr & (1<<24); if pc===0 guess NULL pointer.\n  \n}",
    "eHint": "Format pc, lr in uppercase hex; check psr & (1<<24); if pc===0 guess NULL pointer.",
    "eTest": "const dump = analyzeHardFaultRegisters(0, 0, 0, 0, 0, 0x08001234, 0x00000000, 0x01000000);\nif (dump.rootCauseGuess !== 'NULL_POINTER_FUNCTION_CALL' || !dump.thumbBitValid) throw new Error('HardFault crash dump analyzer failed');",
    "aTitle": "SWD Pin Name Resolver",
    "aDesc": "Implement function getSwdPinCount() returning 2 ('SWDIO' and 'SWCLK'). When called with a numeric `candidateValue`, return `{ benchmark: 2, candidate: candidateValue, meetsBenchmark: candidateValue >= 2, delta: Number((candidateValue - 2).toFixed(4)) }`.",
    "aStarter": "function getSwdPinCount(candidateValue) {\n  // TODO: Return 2 when called with no arguments, or { benchmark: 2, candidate: candidateValue, meetsBenchmark: candidateValue >= 2, delta: Number((candidateValue - 2).toFixed(4)) }\n  \n}",
    "aHint": "If candidateValue === undefined return 2; otherwise return { benchmark: 2, candidate: candidateValue, meetsBenchmark: candidateValue >= 2, delta: Number((candidateValue - 2).toFixed(4)) }.",
    "aTest": "if (getSwdPinCount() !== 2) throw new Error('Default benchmark value must be 2');\nconst passRes = getSwdPinCount(7);\nconst failRes = getSwdPinCount(-3);\nif (!passRes || !passRes.meetsBenchmark || failRes.meetsBenchmark || passRes.benchmark !== 2) throw new Error('Parameterized benchmark comparison failed');"
  },
  {
    "day": 30,
    "title": "Capstone 1: NanoRTOS Preemptive Kernel & Multitasking Firmware Engine Capstone Viva Gate",
    "desc": "Final Capstone Synthesis: The complete industrial robotics control unit: Multi-tasking FreeRTOS scheduler, DMA circular ADC sensor reads, Kalman filtering, CAN Bus motor actuation, Dual-Bank OTA bootloader, and Hardware Root of Trust security.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Industrial Mission-Critical Autonomous Robotic Manufacturing System.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Capstone Industrial Robotics Control Unit Engine",
    "eDesc": "Implement function executeRoboticControlUnit(sensorData, actuatorCommands, firmwareBank, securityRoT) orchestrating sensor acquisition, CAN bus dispatch, and safety supervision.",
    "eStarter": "function executeRoboticControlUnit(sensorData, commands, fw, security) {\n  // TODO: Verify security -> smooth sensor data -> dispatch CAN commands -> return success object.\n  \n}",
    "eHint": "Verify security -> smooth sensor data -> dispatch CAN commands -> return success object.",
    "eTest": "const security = { isRootOfTrustLocked: true };\nconst fw = { activeSlot: 'SLOT_0_PROD' };\nconst sensors = { rawTemp: 45 };\nconst cmds = [{ motorId: 0x101, targetRpm: 1200 }, { motorId: 0x102, targetRpm: 800 }];\nconst res = executeRoboticControlUnit(sensors, cmds, fw, security);\nif (!res.success || res.systemStatus !== 'INDUSTRIAL_ROBOTICS_CONTROLLER_CERTIFIED' || res.actuatedMotorsCount !== 2) throw new Error('Capstone industrial robotics engine failed');",
    "aTitle": "Capstone Embedded Systems Certification Auditor",
    "aDesc": "Implement function auditEmbeddedCapstoneStatus() returning certification grade. When called with `overrideProps`, return the base object merged with `overrideProps`.",
    "aStarter": "function auditEmbeddedCapstoneStatus(overrideProps) {\n  // TODO: Return {\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED\"} merged with optional overrideProps\n  \n}",
    "aHint": "Return { ...{\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_EMBEDDED_SYSTEMS_FIRMWARE_CERTIFIED\"}, ...(overrideProps || {}) }.",
    "aTest": "const base = auditEmbeddedCapstoneStatus();\nconst custom = auditEmbeddedCapstoneStatus({ verifiedOverride: true });\nif (!base || !custom.verifiedOverride) throw new Error('Object configuration merge failed');"
  }
];

export const IOT_EMBEDDED_30_DAYS_QUESTS: CourseQuest[] = IOT_EMBEDDED_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('iot_emb', idx + 1, cfg)
);
