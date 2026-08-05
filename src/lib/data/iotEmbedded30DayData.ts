import { buildEnrichedDayQuests } from './curriculumEnricher';
export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export const IOT_EMBEDDED_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is an Embedded System? — Microcontrollers (MCUs), GPIO Pins and Safety Limits",
    desc: "An EMBEDDED SYSTEM is a dedicated computer system designed to perform one specific function, often embedded inside a larger mechanical or electrical system. Think of your laptop: it is a general-purpose computer that can run games, web browsers, and write documents. Now, think of your microwave oven, smart thermostat, or electric toothbrush: these are powered by dedicated, single-chip computers called MICROCONTROLLERS (MCUs). Unlike PCs, microcontrollers do not run operating systems like Windows or macOS. Instead, they run a single program continuously from the moment they are powered on. Popular MCU boards include: (1) Arduino Uno: cheap, simple, great for beginners. (2) ESP32: powerful chip with built-in Wi-Fi and Bluetooth. (3) STM32: industrial-grade ARM Cortex processor. GPIO PINS: to interact with the real world, microcontrollers use GPIO (General Purpose Input/Output) pins. A pin can be set to: (1) Input Mode: reads signals from the outside world (like whether a button is pressed or a sensor is active). (2) Output Mode: sends signals to the outside world (like sending electricity to light up an LED or run a motor). SAFETY LIMITS: GPIO pins run on specific voltages. Most modern chips (ESP32/STM32) use 3.3V logic. If you feed 5V of electricity into a 3.3V input pin, you will permanently burn out the chip! We prevent this using a VOLTAGE DIVIDER circuit — a simple arrangement of two resistors in series that reduces a high voltage down to a safe, lower voltage level. (Real world: Hardware engineers designing smart locks use voltage dividers. When a 12V battery is connected to a sensor pin, the divider drops the voltage down to 3V, allowing the ESP32 to safely measure the battery level without frying its processor.)",
    syllabus: ["Embedded System = dedicated computer system for a single task. Microcontroller (MCU) = single chip containing CPU, RAM, and Flash storage. Arduino (simplest), ESP32 (Wi-Fi), STM32 (industrial ARM).", "GPIO Pins (General Purpose Input/Output): interface nodes. Input Mode = reads external high/low voltage signals (sensors/buttons). Output Mode = writes voltage signals (LEDs/motors).", "Voltage logic limits: 3.3V logic (modern standard) vs 5V logic (older Arduino). Pin protection: using resistor Voltage Dividers to drop dangerous high voltages to safe limits."],
    eTitle: "Exam: Voltage Divider Calculator",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Parallel Resistor Calculator",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Bare-Metal Architecture — The Super-Loop Pattern and Interrupt Service Routines (ISRs)",
    desc: "When programming microcontrollers on 'bare-metal' (meaning writing code directly on the chip without an operating system), execution flow is simple and linear. THE SUPER-LOOP PATTERN: in C/C++, a microcontroller program starts in the 'main()' function, runs setup code once, and then enters an infinite loop: while(1) { ... }. This is called a Super-Loop. The processor runs the code inside this loop over and over, forever. Inside the loop, it reads inputs (e.g. checks if a button is pressed), runs logic, and updates outputs (e.g. turns on a fan). FLOATING PIN NOISE: when a GPIO pin is configured as an input and nothing is connected to it, its electrical state floats between HIGH and LOW, picking up electromagnetic noise from the air. This causes your code to falsely register button presses. We solve this by enabling internal Pull-Up or Pull-Down resistors. A pull-up resistor connects the pin to 3.3V (holding the default state HIGH). When you press the button, it connects the pin to Ground (0V), pulling the signal LOW. This guarantees clean, predictable readings. WHAT IS AN INTERRUPT? If your super-loop takes 100ms to run, and the user presses a button for only 10ms, the MCU might miss the press. An Interrupt is a hardware signal that tells the CPU: 'Stop what you are doing immediately, run this priority handler function, then return to where you left off'. The handler function is called an Interrupt Service Routine (ISR). (Real world: In electric vehicles, if the crash sensor detects a collision, it triggers a hardware interrupt. The CPU instantly halts the main entertainment system loop to run the airbag deployment ISR, ensuring life-saving response speeds in microseconds.)",
    syllabus: ["The Super-Loop: while(1) infinite execution loop. The core structure of bare-metal embedded firmware where code runs continuously from top to bottom.", "Floating pin noise: input pins with no connection pick up electromagnetic noise. Solved by enabling internal Pull-Up (holds default state HIGH) or Pull-Down (holds default state LOW) resistors.", "Interrupts & ISRs: hardware signals that halt main loop execution to run a priority Interrupt Service Routine (ISR) instantly. Critical for safety-first events."],
    eTitle: "Exam: Interrupt Handler Setup",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Button Polling Debouncer",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Analog Interfaces: ADC Bit Resolutions & Voltages Scaling",
    desc: "Learn to configure Analog-to-Digital Converters (ADCs), translate analog signals to digital integers, and calibrate sensors. (Real world: Smart thermostats scale raw ADC codes to temperature values, calibrating offsets to improve accuracy.)",
    syllabus: ["Analog-to-Digital Converter properties", "ADC resolution formulas (8, 10, 12 bits)", "Scaling voltage percentages"],
    eTitle: "Exam: Voltage-to-ADC Scale Convertor",
    eDesc: "Write a JS function `scaleVoltageToAdc(voltage, maxVoltage, bitResolution)` returning rounded integer value: `(voltage / maxVoltage) * (Math.pow(2, bitResolution) - 1)`. Return 0 if inputs are negative or maxVoltage <= 0.",
    eStarter: "function scaleVoltageToAdc(voltage, maxVoltage, bitResolution) {\n    // Write your code here\n    \n}",
    eHint: "Divide voltage by max, multiply by scale index and round. Check bounds.",
    eTest: "if (typeof scaleVoltageToAdc !== 'function') throw new Error('Method scaleVoltageToAdc not found.');\nif (scaleVoltageToAdc(1.65, 3.3, 12) !== 2048) throw new Error('12-bit scale conversion failed');\nif (scaleVoltageToAdc(-1, 3.3, 12) !== 0) throw new Error('Negative validation failed');",
    aTitle: "Assignment: ADC-to-Voltage Convertor",
    aDesc: "Write a JS function `scaleAdcToVoltage(adcVal, maxVoltage, bitResolution)` returning voltage float: `(adcVal / (Math.pow(2, bitResolution) - 1)) * maxVoltage`. Return 0 if inputs are negative.",
    aStarter: "function scaleAdcToVoltage(adcVal, maxVoltage, bitResolution) {\n    // Write your code here\n    \n}",
    aHint: "Divide value by scale, multiply by maxVoltage. Verify inputs.",
    aTest: "if (typeof scaleAdcToVoltage !== 'function') throw new Error('Method scaleAdcToVoltage not found.');"
  },
  {
    title: "Actuators: PWM Duty Cycle Integer Scalers",
    desc: "Master Pulse Width Modulation (PWM), configuring duty cycles, and controlling actuators. (Real world: LED dimming firmware maps client percent targets to PWM registers to adjust light brightness.)",
    syllabus: ["PWM signals parameters", "Scaling percentage to integer duty cycles", "Duty cycle bit bounds (8, 16 bits)"],
    eTitle: "Exam: Brightness-to-PWM duty cycle",
    eDesc: "Write a JS function `getPercentToPwm(percent, maxPwmValue)` returning rounded integer: `(percent / 100) * maxPwmValue`. Return 0 if percent is negative. Clamp output to maxPwmValue limit.",
    eStarter: "function getPercentToPwm(percent, maxPwmValue) {\n    // Write your code here\n    \n}",
    eHint: "Calculate percentage scale, round, clamp to maxPwmValue. Verify limits.",
    eTest: "if (typeof getPercentToPwm !== 'function') throw new Error('Method getPercentToPwm not found.');\nif (getPercentToPwm(50, 255) !== 128) throw new Error('50% duty scale failed');\nif (getPercentToPwm(120, 255) !== 255) throw new Error('Over range clamp failed');",
    aTitle: "Assignment: Active PWM Percentage Tracker",
    aDesc: "Write a JS function `getPwmPercent(pwmVal, maxPwmValue)` returning Math.round((pwmVal / maxPwmValue) * 100). Return 0 if maxPwmValue <= 0 or inputs are negative.",
    aStarter: "function getPwmPercent(pwmVal, maxPwmValue) {\n    // Write your code here\n    \n}",
    aHint: "Calculate percentage and round. Verify limits.",
    aTest: "if (typeof getPwmPercent !== 'function') throw new Error('Method getPwmPercent not found.');"
  },
  {
    title: "DSP basics: Sensor Data Window Average smoothing",
    desc: "Understand sensor data filtering, noise cancellation, and calculating moving averages. (Real world: Smart meters apply sliding window averages to ADC readings to filter out transient voltage spikes.)",
    syllabus: ["Analog voltage noise issues", "Window average smoothing pipelines", "Filtering sensor spikes"],
    eTitle: "Exam: Dynamic Window Averager",
    eDesc: "Write a JS function `getSmoothAverage(values, size)` returning the average of latest size elements in values array. Return 0 if values is null/empty or size <= 0.",
    eStarter: "function getSmoothAverage(values, size) {\n    // Write your code here\n    \n}",
    eHint: "Check array slice latest elements, accumulate sum, divide by size. Verify parameter limits.",
    eTest: "if (typeof getSmoothAverage !== 'function') throw new Error('Method getSmoothAverage not found.');\nif (getSmoothAverage([10, 20, 30], 2) !== 25) throw new Error('Standard window average failed');",
    aTitle: "Assignment: Outlier Sensor Filter",
    aDesc: "Write a JS function `filterOutliers(values, threshold)` returning new array copy dropping values whose absolute differences from median is strictly greater than threshold.",
    aStarter: "function filterOutliers(values, threshold) {\n    // Write your code here\n    \n}",
    aHint: "Find median first, filter elements checking threshold values.",
    aTest: "if (typeof filterOutliers !== 'function') throw new Error('Method filterOutliers not found.');"
  },
  {
    title: "Microcontroller Registers: GPIO Pin Direction Mask builders",
    desc: "Master bitwise logic, constructing bitmasks, and updating microcontroller port registers. (Real world: Bootloader code compiles binary masks, setting input/output directions for hardware ports.)",
    syllabus: ["GPIO hardware registers structures", "Pin direction bitmasks configurations", "configuring safe hardware boot values"],
    eTitle: "Exam: GPIO Mask Validator",
    eDesc: "Write a JS function `isValidGpioMask(mask, maxPinCount)` returning true if mask is positive integer and less than Math.pow(2, maxPinCount). Returns false otherwise.",
    eStarter: "function isValidGpioMask(mask, maxPinCount) {\n    // Write your code here\n    \n}",
    eHint: "Check bounds and compare with 2^maxPinCount limit. Check negative.",
    eTest: "if (typeof isValidGpioMask !== 'function') throw new Error('Method isValidGpioMask not found.');\nif (isValidGpioMask(15, 4) !== true) throw new Error('Valid 4-pin mask check failed');",
    aTitle: "Assignment: Pin Mask Builder",
    aDesc: "Write a JS function `buildPinMask(pinIndices)` returning sum of Math.pow(2, index) for each index in array. Return 0 if null.",
    aStarter: "function buildPinMask(pinIndices) {\n    // Write your code here\n    \n}",
    aHint: "Loop indices and accumulate powers of 2.",
    aTest: "if (typeof buildPinMask !== 'function') throw new Error('Method buildPinMask not found.');"
  },
  {
    title: "Firmware Safety: Sensor Threshold Trigger logic",
    desc: "Learn to build threshold validation algorithms, software debouncing logic, and alarm triggers. (Real world: Fire safety systems trigger alert sirens only if temperature readings remain high for 3 consecutive poll cycles.)",
    syllabus: ["Sensor threshold alerts limits", "Consecutive alert window counters", "Debouncing hardware trigger alarms"],
    eTitle: "Exam: Consecutive Threshold Alarm Trigger",
    eDesc: "Write a JS function `isAlarmTriggered(readings, limit, triggerCount)` returning true if there are at least `triggerCount` consecutive values in `readings` array that are strictly greater than `limit`.",
    eStarter: "function isAlarmTriggered(readings, limit, triggerCount) {\n    // Write your code here\n    \n}",
    eHint: "Loop readings, maintaining a streak counter. Reset to 0 when reading <= limit. Return true if streak reaches triggerCount.",
    eTest: "if (typeof isAlarmTriggered !== 'function') throw new Error('Method isAlarmTriggered not found');\nif (isAlarmTriggered([20, 45, 50, 42, 10], 40, 3) !== true) throw new Error('Alarm trigger streak failed');",
    aTitle: "Assignment: Debounced threshold checker",
    aDesc: "Write a JS function `checkSensorAlert(val, limit)` returning val > limit.",
    aStarter: "function checkSensorAlert(val, limit) {\n    // Write your code here\n    \n}",
    aHint: "Simple threshold comparison.",
    aTest: "if (typeof checkSensorAlert !== 'function') throw new Error('Method checkSensorAlert not found');"
  },
  {
    title: "RTOS Schedulers: Task Priority Preemption",
    desc: "Master Real-Time Operating System task scheduling rules. (Real world: Engine throttle control tasks run at highest RTOS priorities, immediately preempting screen render tasks to avoid engine stalls.)",
    syllabus: ["RTOS task scheduler queues", "Task priority bounds and preemptions", "Resolving priority inversions gates"],
    eTitle: "Exam: RTOS Task Preemptor",
    eDesc: "Write a JS function `shouldPreempt(runningPriority, incomingPriority)` returning true if incomingPriority > runningPriority. Return false if either is negative.",
    eStarter: "shouldPreempt = function(runningPriority, incomingPriority) {\n    // Write your code here\n    \n}",
    eHint: "Compare integer priorities, checking bounds.",
    eTest: "if (typeof shouldPreempt !== 'function') throw new Error('Method shouldPreempt not found');\nif (shouldPreempt(5, 8) !== true) throw new Error('RTOS preemption check failed');",
    aTitle: "Assignment: Priority range validator",
    aDesc: "Write a JS function `isPriorityValid(priority)` returning true if priority >= 0 && priority <= 255.",
    aStarter: "function isPriorityValid(priority) {\n    // Write your code here\n    \n}",
    aHint: "Check priority bounds.",
    aTest: "if (typeof isPriorityValid !== 'function') throw new Error('Method isPriorityValid not found');"
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit",
    desc: "Perform evaluations of ADC voltage calibrations, check PWM duty cycles, verify sensor outlier filters, and evaluate RTOS task scheduler parameters. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Firmware calibration parameters scan", "GPIO port registry mask verification", "RTOS task preemptions checks"],
    eTitle: "Exam: Firmware Compliance Auditor",
    eDesc: "Write a JS function `evaluateFirmwareBuild(report)` returning true if report.adcCalibrated === true and report.gpioMaskSafe === true and report.tasksPreemptAllowed === true.",
    eStarter: "function evaluateFirmwareBuild(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.adcCalibrated, report.gpioMaskSafe, and report.tasksPreemptAllowed boolean properties in report.",
    eTest: "if (typeof evaluateFirmwareBuild !== 'function') throw new Error('Method evaluateFirmwareBuild not found');\nconst rep = { adcCalibrated: true, gpioMaskSafe: true, tasksPreemptAllowed: true };\nif (evaluateFirmwareBuild(rep) !== true) throw new Error('Firmware compliance validation failed');",
    aTitle: "Assignment: Code coverage auditor",
    aDesc: "Write a JS function `isCoveragePassed(coveragePct)` returning coveragePct >= 80.",
    aStarter: "function isCoveragePassed(coveragePct) {\n    // Write your code here\n    \n}",
    aHint: "Check threshold.",
    aTest: "if (typeof isCoveragePassed !== 'function') throw new Error('Method isCoveragePassed not found');"
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying RTOS scheduling parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying RTOS scheduling parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying RTOS scheduling parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying RTOS scheduling parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying RTOS scheduling parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying RTOS scheduling parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying RTOS scheduling parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying RTOS scheduling parameters"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying standards validations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying standards validations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying standards validations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Firmware & RTOS compliance audit (Review)",
    desc: "Review microcontroller architectures, evaluate ADC conversions scales, check GPIO registers bitmasks, and verify RTOS task priority preemptions. (Real world: Embedded QA leads run telemetry scans, checking firmware integrity checks.)",
    syllabus: ["Reviewing ADC scaling factors", "Assembling firmware compliance checklists", "Verifying standards validations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const IOT_EMBEDDED_30_DAYS_QUESTS = IOT_EMBEDDED_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `embedded-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `embedded-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `embedded-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `embedded-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `embedded-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('embedded-basics', dayNum, cfg);
});
