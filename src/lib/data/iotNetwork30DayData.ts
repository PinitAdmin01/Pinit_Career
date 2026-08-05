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

export const IOT_NETWORK_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "Introduction to Wireless IoT Networks — LPWANs, LoRaWAN and BLE Packets",
    desc: "An IoT (Internet of Things) network connects smart devices to the internet. Unlike your phone or laptop which send high-definition video over high-speed Wi-Fi, most IoT devices are small, battery-powered sensors (like soil moisture monitors or smart water meters). These sensors only need to send small amounts of data (like 'soil is dry') over very long distances while running on a single battery for 10 years. Traditional Wi-Fi or Bluetooth cannot do this: Wi-Fi drains batteries in days, and standard Bluetooth only reaches 10 meters. We solve this using two classes of networks: (1) LPWAN (Low-Power Wide-Area Network): wireless networks designed for long range and low battery usage. The dominant LPWAN standard is LoRaWAN (Long Range Wide Area Network), which can send signals up to 15 kilometers in rural areas. (2) BLE (Bluetooth Low Energy): a short-range, ultra-low-power version of Bluetooth. Instead of establishing a constant connection, BLE devices announce themselves by broadcasting small, 31-byte message envelopes called ADVERTISING PACKETS. Nearby receivers scan for these packets without needing to pair. (Real world: City parking sensors use LoRaWAN. When a car parks, the sensor detects it and broadcasts a tiny 10-byte packet containing its ID and status. The signal travels 5 kilometers to a city-owned gateway, which routes it to the parking app's database. Because of LoRaWAN's efficiency, the sensor's battery lasts for 7 years without replacement.)",
    syllabus: ["IoT Network requirements: low power, low data rates, and long range. Traditional Wi-Fi/Bluetooth limitations.", "LPWAN & LoRaWAN: low-power long-range protocols. Star-of-stars topology where sensors transmit directly to internet-connected gateways.", "BLE Advertising: broadcasting sensor readings in small 31-byte packets without pairing. Used for tracking tags and low-power beacons."],
    eTitle: "Exam: BLE Packet Validator",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Packet Size Remaining",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Wireless Signal Strength — RSSI Decibel Scales and Link Quality Metrics",
    desc: "When designing wireless IoT networks, you must measure how strong the signal is. We measure wireless signal strength using a metric called RSSI (Received Signal Strength Indicator). RSSI is measured in decibels relative to 1 milliwatt, written as 'dBm'. dBm is a logarithmic scale, not a linear one. (1) 0 dBm = exactly 1 milliwatt of power. (2) Positive dBm: signals stronger than 1 milliwatt (e.g. +20 dBm is the transmit power of a standard router). (3) Negative dBm: signals weaker than 1 milliwatt. Because wireless signals decay rapidly as they travel through the air, IoT receivers measure signals in deep negatives. RSSI RANGES: (1) -30 to -50 dBm: excellent, strong signal. (2) -60 to -70 dBm: good, reliable signal. (3) -80 to -90 dBm: weak signal, prone to packet drops. (4) -100 dBm or lower: extremely weak, connection lost. Why decibels? Because a signal's power drops by a factor of 100 or 1,000 as it travels. Instead of writing tiny decimals like 0.0000000001 watts, decibels allow us to write simple, manageable numbers like -100 dBm. (Real world: When you look at the Wi-Fi or cellular signal bars on your smartphone, the software is reading the raw negative dBm value from the modem. It maps -50 dBm to 4 full bars, -75 dBm to 2 bars, and -90 dBm to 1 bar, helping users find better reception.)",
    syllabus: ["RSSI (Received Signal Strength Indicator): measuring signal power at the receiver using logarithmic decibels (dBm).", "dBm Scale: 0 dBm = 1mW. Signals weaken as they travel, resulting in negative dBm values. +3 dBm doubles the power; -3 dBm halves it.", "Signal Quality thresholds: mapping raw negative dBm ranges to user-friendly levels: Excellent (-50), Good (-70), Weak (-80), Lost (-100)."],
    eTitle: "Exam: RSSI Quality Categorizer",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Signal Quality Ratio",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Path Loss Link Budget equations",
    desc: "Master signal propagation mathematics. (Real world: RF simulation scripts calculate path losses, locating optimal places to deploy LoRaWAN gateways.)",
    syllabus: ["Free Space Path Loss (FSPL) math", "Antenna transmission budgets", "Path loss dB calculations"],
    eTitle: "Exam: Path Loss Estimator",
    eDesc: "Write a JS function `getFreeSpaceLoss(distanceKm, frequencyMhz)` returning loss: `20 * Math.log10(distanceKm) + 20 * Math.log10(frequencyMhz) + 32.44`. Return 0 if inputs <= 0.",
    eStarter: "function getFreeSpaceLoss(distanceKm, frequencyMhz) {\n    // Write your code here\n    \n}",
    eHint: "Use Math.log10. Sum calculations, add constant. Verify parameters positive.",
    eTest: "if (typeof getFreeSpaceLoss !== 'function') throw new Error('Method getFreeSpaceLoss not found');\nif (Math.abs(getFreeSpaceLoss(10, 868) - 111.19) > 0.5) throw new Error('Path loss math failed');",
    aTitle: "Assignment: Link Margin Auditor",
    aDesc: "Write a JS function `getLinkMargin(txPower, rxSens, loss)` returning txPower - loss - rxSens. (Loss is subtraction, Sensitivity is negative addition).",
    aStarter: "function getLinkMargin(txPower, rxSens, loss) {\n    // Write your code here\n    \n}",
    aHint: "Apply subtraction parameters, rxSens is negative so subtract it (adds absolute).",
    aTest: "if (typeof getLinkMargin !== 'function') throw new Error('Method getLinkMargin not found');"
  },
  {
    title: "LoRaWAN Spreading Factor durations",
    desc: "Learn to analyze transmission time-on-air. (Real world: Industrial nodes select higher Spreading Factors to extend reach, balancing increased battery consumption.)",
    syllabus: ["LoRa Spreading Factors (SF7-SF12)", "Time-on-Air (ToA) variables equations", "duty cycle transmission limits"],
    eTitle: "Exam: Spreading Factor Scale",
    eDesc: "Write a JS function `isAirtimeSafe(sf, sizeBytes, maxMs)` returning true if estimated airtime: `sizeBytes * sf * 2` is strictly less than maxMs. Return false if sf is negative or sizeBytes <= 0.",
    eStarter: "function isAirtimeSafe(sf, sizeBytes, maxMs) {\n    // Write your code here\n    \n}",
    eHint: "Multiply parameters, compare with limit. Verify positive boundaries.",
    eTest: "if (typeof isAirtimeSafe !== 'function') throw new Error('Method isAirtimeSafe not found');\nif (isAirtimeSafe(7, 50, 1000) !== true) throw new Error('Safe airtime check failed');",
    aTitle: "Assignment: ToA Ticks Calculator",
    aDesc: "Write a JS function `getAirtimeMs(sf, sizeBytes)` returning sizeBytes * sf * 2. Return 0 if inputs are negative.",
    aStarter: "function getAirtimeMs(sf, sizeBytes) {\n    // Write your code here\n    \n}",
    aHint: "Multiply parameters. Check negative.",
    aTest: "if (typeof getAirtimeMs !== 'function') throw new Error('Method getAirtimeMs not found');"
  },
  {
    title: "NB-IoT Cellular connection retries",
    desc: "Understand wireless network access attempt loops. (Real world: Remote sensors increment cellular attempts counter on network dropouts, sleep-cycling to avoid battery drains.)",
    syllabus: ["NB-IoT cellular access loops", "checking connection attempt parameters", "preventing battery drain resets"],
    eTitle: "Exam: Cellular Access Gatekeeper",
    eDesc: "Write a JS function `canRetryConnection(attempt, maxRetry)` returning true if attempt < maxRetry. Return false if attempt is negative or maxRetry <= 0.",
    eStarter: "function canRetryConnection(attempt, maxRetry) {\n    // Write your code here\n    \n}",
    eHint: "Compare parameters, verify inputs are positive numbers.",
    eTest: "if (typeof canRetryConnection !== 'function') throw new Error('Method canRetryConnection not found');\nif (canRetryConnection(2, 5) !== true) throw new Error('Access retry check failed');",
    aTitle: "Assignment: Retries remaining scale",
    aDesc: "Write a JS function `getRetriesLeft(attempt, maxRetry)` returning maxRetry - attempt. Return 0 if limit is met.",
    aStarter: "function getRetriesLeft(attempt, maxRetry) {\n    // Write your code here\n    \n}",
    aHint: "Subtract attempt from max. Clamp to >= 0.",
    aTest: "if (typeof getRetriesLeft !== 'function') throw new Error('Method getRetriesLeft not found');"
  },
  {
    title: "LPWAN region whitelisted frequencies",
    desc: "Master wireless channel spectrum regulations. (Real world: Telemetry nodes inspect regional tables, ensuring transmission frequencies match regulatory channels whitelists.)",
    syllabus: ["Regional radio spectrum whitelist regulations", "LPWAN channel frequency tables", "Restricted radio band checker"],
    eTitle: "Exam: Frequency Whitelist Checker",
    eDesc: "Write a JS function `isFrequencyAllowed(freq, whitelist)` returning true if freq exists inside whitelist array. Return false if whitelist is empty or null.",
    eStarter: "function isFrequencyAllowed(freq, whitelist) {\n    // Write your code here\n    \n}",
    eHint: "Check array presence using includes(). Verify array is valid.",
    eTest: "if (typeof isFrequencyAllowed !== 'function') throw new Error('Method isFrequencyAllowed not found');\nif (isFrequencyAllowed(868.1, [868.1, 868.3]) !== true) throw new Error('Allowed frequency check failed');",
    aTitle: "Assignment: ISM Band Range Auditor",
    aDesc: "Write a JS function `isIsmBandRange(freq, min, max)` returning true if freq is between min and max inclusive.",
    aStarter: "function isIsmBandRange(freq, min, max) {\n    // Write your code here\n    \n}",
    aHint: "Check range bounds.",
    aTest: "if (typeof isIsmBandRange !== 'function') throw new Error('Method isIsmBandRange not found');"
  },
  {
    title: "MQTT Message Protocols: Topic wildcard validation",
    desc: "Master MQTT messaging patterns. (Real world: Gateway brokers route topic subscriptions, checking wildcard character rules to prevent security isolation violations.)",
    syllabus: ["MQTT topic hierarchical namespaces", "Single level plus wildcard operators", "Multi level hash wildcard configurations"],
    eTitle: "Exam: MQTT Topic Parser",
    eDesc: "Write a JS function `isTopicMatch(pubTopic, subTopic)` returning true if pubTopic === subTopic or subTopic === '#'. Return false if either is null or empty.",
    eStarter: "function isTopicMatch(pubTopic, subTopic) {\n    // Write your code here\n    \n}",
    eHint: "Check direct equality or wildcard match. Verify parameters are valid.",
    eTest: "if (typeof isTopicMatch !== 'function') throw new Error('Method isTopicMatch not found');\nif (isTopicMatch('sensors/temp', '#') !== true) throw new Error('MQTT wildcard parser failed');",
    aTitle: "Assignment: Subtopic level counter",
    aDesc: "Write a JS function `getSubtopicLevels(topic)` returning topic.split('/').length. Return 0 if empty.",
    aStarter: "function getSubtopicLevels(topic) {\n    // Write your code here\n    \n}",
    aHint: "Split string and check array length.",
    aTest: "if (typeof getSubtopicLevels !== 'function') throw new Error('Method getSubtopicLevels not found');"
  },
  {
    title: "IP Address configuration: DHCP Pool validators",
    desc: "Master network layer routing parameters. (Real world: Ethernet gateway services allocate IP addresses, confirming requested client interfaces fall inside pool limits.)",
    syllabus: ["Ethernet networks DHCP allocations", "IP address numeric ranges boundaries", "Subnet gateways defaults targets"],
    eTitle: "Exam: DHCP Pool Evaluator",
    eDesc: "Write a JS function `isIpInPool(ip, startIp, endIp)` returning true if last octet of ip is between last octet of startIp and endIp inclusive, assuming first 3 octets match.",
    eStarter: "function isIpInPool(ip, startIp, endIp) {\n    // Write your code here\n    \n}",
    eHint: "Parse octets using split('.'). Verify matching prefix networks, and compare tail numbers.",
    eTest: "if (typeof isIpInPool !== 'function') throw new Error('Method isIpInPool not found');\nif (isIpInPool('192.168.1.50', '192.168.1.10', '192.168.1.100') !== true) throw new Error('DHCP pool range validator failed');",
    aTitle: "Assignment: IP octet checker",
    aDesc: "Write a JS function `isOctetValid(num)` returning num >= 0 && num <= 255.",
    aStarter: "function isOctetValid(num) {\n    // Write your code here\n    \n}",
    aHint: "Check integer boundaries.",
    aTest: "if (typeof isOctetValid !== 'function') throw new Error('Method isOctetValid not found');"
  },
  {
    title: "Final Capstone: IoT network compliance audit",
    desc: "Perform evaluations of wireless path loss margins, check Spreading Factors airtimes, verify MQTT topic wildcards namespaces, and evaluate IP address allocations pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Wireless links margins scans", "MQTT routing topics validation", "IP address pools compliance reviews"],
    eTitle: "Exam: Network Compliance Auditor",
    eDesc: "Write a JS function `evaluateNetworkBuild(report)` returning true if report.linksMarginSafe === true and report.topicsAllowed === true and report.dhcpPoolsOk === true.",
    eStarter: "function evaluateNetworkBuild(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.linksMarginSafe, report.topicsAllowed, and report.dhcpPoolsOk boolean properties in report.",
    eTest: "if (typeof evaluateNetworkBuild !== 'function') throw new Error('Method evaluateNetworkBuild not found');\nconst rep = { linksMarginSafe: true, topicsAllowed: true, dhcpPoolsOk: true };\nif (evaluateNetworkBuild(rep) !== true) throw new Error('Network compliance check failed');",
    aTitle: "Assignment: Network packet drop tracker",
    aDesc: "Write a JS function `isLossAcceptable(lossPct)` returning lossPct <= 2.0.",
    aStarter: "function isLossAcceptable(lossPct) {\n    // Write your code here\n    \n}",
    aHint: "Compare loss thresholds.",
    aTest: "if (typeof isLossAcceptable !== 'function') throw new Error('Method isLossAcceptable not found');"
  },
  {
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying gateway routing parameters"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying gateway routing parameters"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying gateway routing parameters"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying gateway routing parameters"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying gateway routing parameters"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying gateway routing parameters"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying gateway routing parameters"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying gateway routing parameters"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying standards validations"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying standards validations"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying standards validations"],
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
    title: "Final Capstone: IoT network compliance audit (Review)",
    desc: "Review wireless path loss equations, evaluate spreading factors airtimes, check MQTT topics routing parameters, and verify IP address allocation pools. (Real world: Telemetry engineers run spectrum audits, confirming network parameters.)",
    syllabus: ["Reviewing path loss link budgets", "Assembling wireless compliance checklists", "Verifying standards validations"],
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

export const IOT_NETWORK_30_DAYS_QUESTS = IOT_NETWORK_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `network-basics-lecture-day-${dayNum}`,
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
        id: `network-basics-lecture2-day-1`,
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
        id: `network-basics-lecture3-day-1`,
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
        id: `network-basics-lecture2-day-2`,
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
        id: `network-basics-lecture3-day-2`,
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
  return buildEnrichedDayQuests('network-basics', dayNum, cfg);
});
