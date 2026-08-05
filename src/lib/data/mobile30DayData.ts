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

export const MOBILE_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is Mobile App Development? — Native vs Cross-Platform and Your First Expo App",
    desc: "Mobile app development means building applications that run on smartphones (iOS for iPhones, and Android for phones like Samsung, OnePlus, Xiaomi). Before React Native, if you wanted to build an app for both platforms, you had to write the app TWICE. You wrote one version in Swift or Objective-C for iOS, and a completely separate version in Java or Kotlin for Android. This was expensive and slow because companies had to hire two separate teams of developers. In 2015, Facebook released React Native. React Native is a cross-platform framework. It allows you to write your mobile app in JavaScript using React, and React Native compiles your code into real, native UI elements on both iOS and Android. One codebase, two apps. What is Expo? Setting up a raw React Native environment requires installing massive tools like Android Studio (for Android emulation) and Xcode (which requires a Mac and handles iOS compilation). This setup takes hours and is extremely frustrating. Expo is a framework and platform built on top of React Native that makes development simple. With Expo, you run a command: npx create-expo-app my-app. Then you cd my-app and run npm run start. Expo starts a local server and displays a QR code in your terminal. You install the free 'Expo Go' app on your physical iPhone or Android phone, scan the QR code with your phone camera, and boom — your app loads on your physical phone instantly! When you edit App.js on your computer and save, the changes update on your phone screen in less than a second over Wi-Fi. (Real world: Major apps like Discord, Shopify, Tesla, Instagram, and Coinbase use React Native. Developers write the business logic once in JavaScript, saving millions of dollars in development costs while maintaining a smooth native look and feel on both platforms.)",
    syllabus: ["Mobile OS: iOS (Apple, Swift) vs Android (Google, Kotlin). Native development = write twice. Cross-platform (React Native) = write once in JavaScript/React, compile to real native apps for both iOS and Android.", "Expo = helper framework built on React Native. Eliminates complex installation of Android Studio / Xcode. npx create-expo-app my-app initializes the project. npm run start runs development server.", "Expo Go = free app on Play Store / App Store. Scan terminal QR code over Wi-Fi to load and test your app on your physical phone instantly. Fast refresh updates the screen immediately on save."],
    eTitle: "Exam: Mobile Development Basics",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Environment Setup",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "React Native Core Components — Views, Texts, Images and Safe Area Layouts",
    desc: "When building web pages, you use HTML tags like <div>, <p>, <img>, and <span>. In mobile development, these HTML tags DO NOT exist. Mobile operating systems do not understand HTML. React Native provides special CORE COMPONENTS that translate directly into native iOS and Android interface elements. Let us learn the four most important components: (1) <View>: the fundamental wrapper component, equivalent to a <div> in HTML. Used for layout, grouping, and styling. (2) <Text>: the only component that can display text. In HTML you can write text directly inside a <div>. In React Native, writing text outside a <Text> tag causes an immediate crash! Always wrap text: <Text>Hello World</Text>. (3) <Image>: used to display local images or remote network images: <Image source={{ uri: 'https://placekitten.com/200' }} style={{ width: 100, height: 100 }} />. Unlike HTML, you MUST specify width and height for network images, or they will render with 0 width/height and be invisible. (4) <SafeAreaView>: mobile screens have notches, rounded corners, status bars, and home indicator lines at the bottom. If you place a View at the top, it will get hidden under the battery icon or camera notch. SafeAreaView automatically adds padding to push your content into the visible safe zone of the screen. Always wrap your main App layout in SafeAreaView. Styling in React Native uses a StyleSheet library: const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' } }). (Real world: On the WhatsApp chat list page, the container holding the chats is a View. The sender's name and message text are inside Text tags. The sender's profile picture is an Image. The entire screen is wrapped in a SafeAreaView so the top status bar doesn't overlap the chat headers.)",
    syllabus: ["Core Components: React Native uses custom native-translated tags instead of HTML. View = container (like div). Text = text display (mandatory wrapper for text, direct text inside View crashes app).", "Image component: displays images. Local source={require('./img.png')}. Network source={{ uri: 'http...' }}. Network images REQUIRE explicit width and height styling or they render with size 0.", "SafeAreaView: automatically adds paddings to prevent content from getting covered by notches, camera holes, status bars, or bottom navigation lines. Always wrap root components in SafeAreaView."],
    eTitle: "Exam: UI Component Analyzer",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Layout Component Resolver",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "React Native Styling & Flexbox Primitives",
    desc: "Master StyleSheet style declarations, Flexbox coordinates (flexDirection, justifyContent, alignItems), and responsive units. (Real world: Flexible row alignments distribute dashboard items cleanly across different mobile screen widths.)",
    syllabus: ["StyleSheet style creation rules", "Flex layouts flexDirection properties", "Responsive width/height margins rules"],
    eTitle: "Exam: Profile Layout Configurator",
    eDesc: "Write a JS function `buildProfileHeaderModel(avatarUrl, name, isCentred)` returning an alignment stylesheet config object containing correct centering keys.",
    eStarter: "function buildProfileHeaderModel(avatarUrl, name, isCentred) {\n    // Write your code here\n    \n}",
    eHint: "Return object { align: isCentred ? 'center' : 'left', avatar: avatarUrl, title: name }.",
    eTest: "if (typeof buildProfileHeaderModel !== 'function') throw new Error('Method buildProfileHeaderModel not found.');\nconst res = buildProfileHeaderModel('avatar.png', 'Arjun', true);\nif (res.align !== 'center') throw new Error('Centering configuration failed');",
    aTitle: "Assignment: Safe Margin Resolver",
    aDesc: "Write a JS function `resolveSafeInsets(insets, defaultMargin)` returning an inset padding object with values fallback to defaultMargin.",
    aStarter: "function resolveSafeInsets(insets, defaultMargin) {\n    // Write your code here\n    \n}",
    aHint: "Check properties, fallback if null or negative.",
    aTest: "if (typeof resolveSafeInsets !== 'function') throw new Error('Method resolveSafeInsets not found.');"
  },
  {
    title: "State Management: Native input events handlers",
    desc: "Master TextInput input bounds. (Real world: Mobile input text fields capture keystrokes, formatting numbers instantly into structured phone numbers layouts.)",
    syllabus: ["TextInput properties and keyboards types", "State management hooks (useState)", "Parsing numeric values fields"],
    eTitle: "Exam: Phone Input Formatter",
    eDesc: "Write a JS function `formatMobilePhone(digits)` returning string in format `(XXX) XXX-XXXX`. Return empty string if input length !== 10 or is non-numeric.",
    eStarter: "function formatMobilePhone(digits) {\n    // Write your code here\n    \n}",
    eHint: "Slice the 10-digit input string, formatting tokens via string template.",
    eTest: "if (typeof formatMobilePhone !== 'function') throw new Error('Method formatMobilePhone not found');\nif (formatMobilePhone('1234567890') !== '(123) 456-7890') throw new Error('Phone formatter failed');",
    aTitle: "Assignment: Numeric input validator",
    aDesc: "Write a JS function `isNumericString(str)` returning true if str contains only digits.",
    aStarter: "function isNumericString(str) {\n    // Write your code here\n    \n}",
    aHint: "Verify characters regex: /^[0-9]+$/.",
    aTest: "if (typeof isNumericString !== 'function') throw new Error('Method isNumericString not found');"
  },
  {
    title: "Custom Lists: Recycled scroll loaders",
    desc: "Master FlatList list managers. (Real world: News apps configure item heights, recycling cell nodes offscreen to keep memory footprints low.)",
    syllabus: ["FlatList data rendering loops", "Recycling items layouts concepts", "Threshold scroll offsets calculations"],
    eTitle: "Exam: Scroll Offset Eviction Auditor",
    eDesc: "Write a JS function `shouldEvictListCache(scrollOffset, limit)` returning true if scrollOffset >= limit. Return false if inputs are negative.",
    eStarter: "function shouldEvictListCache(scrollOffset, limit) {\n    // Write your code here\n    \n}",
    eHint: "Compare current offset variable with eviction threshold limit.",
    eTest: "if (typeof shouldEvictListCache !== 'function') throw new Error('Method shouldEvictListCache not found');\nif (shouldEvictListCache(500, 400) !== true) throw new Error('Eviction boundary logic failed');",
    aTitle: "Assignment: Scroll percentage checker",
    aDesc: "Write a JS function `getScrollPercentage(y, max)` returning Math.round((y / max) * 100).",
    aStarter: "function getScrollPercentage(y, max) {\n    // Write your code here\n    \n}",
    aHint: "Divide offset by max height bounds, rounding results.",
    aTest: "if (typeof getScrollPercentage !== 'function') throw new Error('Method getScrollPercentage not found');"
  },
  {
    title: "Touch Handlers: Press gestures velocity gates",
    desc: "Master TouchableOpacity click triggers. (Real world: Game controllers track tap events duration, filtering out double-tap operations if triggers are too close.)",
    syllabus: ["Touchable components (TouchableOpacity)", "Double-tap delay configurations", "Gesture event properties maps"],
    eTitle: "Exam: Gesture Velocity Gate",
    eDesc: "Write a JS function `isGestureSwiped(durationMs, distancePx)` returning true if durationMs <= 300 and distancePx >= 50. Returns false otherwise.",
    eStarter: "function isGestureSwiped(durationMs, distancePx) {\n    // Write your code here\n    \n}",
    eHint: "Verify duration and distance thresholds match swipe parameters.",
    eTest: "if (typeof isGestureSwiped !== 'function') throw new Error('Method isGestureSwiped not found');\nif (isGestureSwiped(200, 80) !== true) throw new Error('Swipe detector failed');",
    aTitle: "Assignment: Press duration validator",
    aDesc: "Write a JS function `isLongPress(durationMs)` returning true if durationMs >= 500.",
    aStarter: "function isLongPress(durationMs) {\n    // Write your code here\n    \n}",
    aHint: "Compare duration variables.",
    aTest: "if (typeof isLongPress !== 'function') throw new Error('Method isLongPress not found');"
  },
  {
    title: "Hardware Integration: Camera permission checker",
    desc: "Master device hardware configurations. (Real world: Imaging modules query device hardware layers, requesting user permissions blocks before opening camera feeds.)",
    syllabus: ["Native device modules access", "Permission statuses (granted, denied)", "Async permission state updates"],
    eTitle: "Exam: Camera Permission Router",
    eDesc: "Write a JS function `routeCameraStatus(status)` returning 'ACTIVE' if status is 'granted', 'BLOCKED' if 'denied', and 'PROMPT' otherwise.",
    eStarter: "function routeCameraStatus(status) {\n    // Write your code here\n    \n}",
    eHint: "Compare permission strings mapping to navigation endpoints.",
    eTest: "if (typeof routeCameraStatus !== 'function') throw new Error('Method routeCameraStatus not found');\nif (routeCameraStatus('denied') !== 'BLOCKED') throw new Error('Permission router failed');",
    aTitle: "Assignment: Permission request count guard",
    aDesc: "Write a JS function `canRequestAgain(tries)` returning true if tries < 2.",
    aStarter: "function canRequestAgain(tries) {\n    // Write your code here\n    \n}",
    aHint: "Verify attempts limit bounds.",
    aTest: "if (typeof canRequestAgain !== 'function') throw new Error('Method canRequestAgain not found');"
  },
  {
    title: "Hardware Integration: Accelerometer data parser",
    desc: "Master hardware sensor processing. (Real world: Health tracking services fetch accelerometer outputs, calculating steps counts by checking velocity offsets.)",
    syllabus: ["Accelerometer sensor data streams", "DSP filter calculations values", "Step counting algorithms parameters"],
    eTitle: "Exam: Accelerometer Threshold Auditor",
    eDesc: "Write a JS function `isAccSpikeDetected(x, y, z, limit)` returning true if Math.sqrt(x*x + y*y + z*z) >= limit. Return false if inputs are negative/null.",
    eStarter: "function isAccSpikeDetected(x, y, z, limit) {\n    // Write your code here\n    \n}",
    eHint: "Calculate vector magnitude using square root of sums, comparing with limits.",
    eTest: "if (typeof isAccSpikeDetected !== 'function') throw new Error('Method isAccSpikeDetected not found');\nif (isAccSpikeDetected(3, 4, 0, 5) !== true) throw new Error('Accelerometer sensor parser failed');",
    aTitle: "Assignment: Static position checker",
    aDesc: "Write a JS function `isDeviceFlat(zValue)` returning true if Math.abs(zValue - 9.8) <= 0.2.",
    aStarter: "function isDeviceFlat(zValue) {\n    // Write your code here\n    \n}",
    aHint: "Check proximity to standard gravity metric (9.8).",
    aTest: "if (typeof isDeviceFlat !== 'function') throw new Error('Method isDeviceFlat not found');"
  },
  {
    title: "App Store Deployments: Version code validation",
    desc: "Master mobile build deployment. (Real world: Google Play and iOS App Store checks parse config files, rejecting deployments containing version codes smaller than active builds.)",
    syllabus: ["Configuring semantic versions (1.0.0)", "Version code integer updates", "Exporting release IPA/AAB files"],
    eTitle: "Exam: Version Code Upgrade Auditor",
    eDesc: "Write a JS function `isVersionCodeAllowed(oldCode, newCode)` returning true if newCode > oldCode and newCode > 0. Returns false otherwise.",
    eStarter: "function isVersionCodeAllowed(oldCode, newCode) {\n    // Write your code here\n    \n}",
    eHint: "Compare version integers, checking positive ranges.",
    eTest: "if (typeof isVersionCodeAllowed !== 'function') throw new Error('Method isVersionCodeAllowed not found');\nif (isVersionCodeAllowed(5, 6) !== true) throw new Error('Version check failed');",
    aTitle: "Assignment: Build prefix string builder",
    aDesc: "Write a JS function `getBuildTag(verName, code)` returning string: `v' + verName + '-' + code`.",
    aStarter: "function getBuildTag(verName, code) {\n    // Write your code here\n    \n}",
    aHint: "Concatenate version details.",
    aTest: "if (typeof getBuildTag !== 'function') throw new Error('Method getBuildTag not found');"
  },
  {
    title: "Final Capstone: Mobile Application Audit",
    desc: "Perform evaluations of layout rendering performance, check lists evictions configurations, evaluate touch gestures thresholds, and compile app build parameters. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Layout rendering diagnostics", "Hardware DSP sensors validation", "Release build parameters check"],
    eTitle: "Exam: Mobile Compliance Auditor",
    eDesc: "Write a JS function `evaluateMobileBuild(report)` returning true if report.gesturesOk === true and report.permissionsOk === true and report.versionAllowed === true.",
    eStarter: "function evaluateMobileBuild(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.gesturesOk, report.permissionsOk, and report.versionAllowed boolean properties in report.",
    eTest: "if (typeof evaluateMobileBuild !== 'function') throw new Error('Method evaluateMobileBuild not found');\nconst rep = { gesturesOk: true, permissionsOk: true, versionAllowed: true };\nif (evaluateMobileBuild(rep) !== true) throw new Error('Mobile build compliance verification failed');",
    aTitle: "Assignment: Optimization rater",
    aDesc: "Write a JS function `getBuildRater(lagMs)` returning 'pass' if lagMs <= 16, 'fail' otherwise.",
    aStarter: "function getBuildRater(lagMs) {\n    // Write your code here\n    \n}",
    aHint: "Compare latency value limits (16ms frame target).",
    aTest: "if (typeof getBuildRater !== 'function') throw new Error('Method getBuildRater not found');"
  },
  {
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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
    title: "Final Capstone: Mobile Application Audit (Review)",
    desc: "Review mobile app build parameters, FlatList scroll eviction thresholds, hardware sensor permission configurations, and version codes validation profiles. (Real world: Core engineers audit mobile repositories, ensuring release builds conform to store requirements.)",
    syllabus: ["Reviewing scroll caching properties", "Assembling release audit checklists", "Verifying hardware sensor configurations"],
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

export const MOBILE_30_DAYS_QUESTS = MOBILE_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `mobile-basics-lecture-day-${dayNum}`,
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
        id: `mobile-basics-lecture2-day-1`,
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
        id: `mobile-basics-lecture3-day-1`,
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
        id: `mobile-basics-lecture2-day-2`,
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
        id: `mobile-basics-lecture3-day-2`,
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
  return buildEnrichedDayQuests('mobile-basics', dayNum, cfg);
});
