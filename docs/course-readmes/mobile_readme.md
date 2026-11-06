# Mobile Application Development — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Mobile Application Development (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 📱 Course Overview
* **Name**: Mobile Application Development
* **ID**: `course-mobile-dev`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Mobile Developers / Frontend Developers / React Native Engineers
* **Learning Interface**: Touch coordinates maps, lists cache parameters, device accelerometer logs, and app stores release profiles.
* **Evaluation Sandbox**: Device simulators checking phone formatting fields, scroll container eviction logic, gestures press timing limits, camera permission routers, accelerometer steps spikes, and app store versions increment safety checks.

---

## 📅 Detailed Day-by-Day Syllabus

### 📱 Week 1: Monolith vs Mobile, Styling & Input Event Handling

#### 🟢 Day 1: Introduction to React Native, Expo & Mobile Architecture
* **Lecture Syllabus**:
  - Native vs Cross-platform models
  - React Native and Expo structures
  - Metro Bundler compilation loops
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: React Native Core Components & JSX Structures
* **Lecture Syllabus**:
  - Core React Native elements (View, Text)
  - ScrollView scrolling container structures
  - SafeAreaView safe padding boundaries
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: React Native Styling & Flexbox Primitives
* **Lecture Syllabus**:
  - StyleSheet style creation rules
  - Flex layouts flexDirection properties
  - Responsive width/height margins rules
* **Coding Exam**: `mobile-basics-exam-day-3` (`buildProfileHeaderModel`)
  - **Task**: Write a JS function `buildProfileHeaderModel(avatarUrl, name, isCentred)` returning styling coordinates alignment map.
  - **Test**: `buildProfileHeaderModel('a.png', 'Arjun', true).align === 'center'`.
* **Coding Assignment**: `mobile-basics-assign-day-3` (`resolveSafeInsets`)
  - **Task**: Write a JS function `resolveSafeInsets(insets, defaultMargin)` checking safe areas padding.
  - **Test**: Resolves missing side parameters values.

#### 🟢 Day 4: State Management: Native input events handlers
* **Lecture Syllabus**:
  - TextInput properties and keyboards types
  - State management hooks (useState)
  - Parsing numeric values fields
* **Coding Exam**: `mobile-basics-exam-day-4` (`formatMobilePhone`)
  - **Task**: Write a JS function `formatMobilePhone(digits)` formatting text inputs to `(XXX) XXX-XXXX`.
  - **Test**: Restricts inputs other than 10 digits strings.
* **Coding Assignment**: `mobile-basics-assign-day-4` (`isNumericString`)
  - **Task**: Write a JS function `isNumericString(str)` checking key inputs.
  - **Test**: Evaluates number string pattern matches.

#### 🟢 Day 5: Custom Lists: Recycled scroll loaders
* **Lecture Syllabus**:
  - FlatList data rendering loops
  - Recycling items layouts concepts
  - Threshold scroll offsets calculations
* **Coding Exam**: `mobile-basics-exam-day-5` (`shouldEvictListCache`)
  - **Task**: Write a JS function `shouldEvictListCache(scrollOffset, limit)` evicting offscreen resources.
  - **Test**: Checks bounds limit.
* **Coding Assignment**: `mobile-basics-assign-day-5` (`getScrollPercentage`)
  - **Task**: Write a JS function `getScrollPercentage(y, max)` tracking scroll progress.
  - **Test**: Returns rounded offset percentage.

#### 🟢 Day 6: Touch Handlers: Press gestures velocity gates
* **Lecture Syllabus**:
  - Touchable components (TouchableOpacity)
  - Double-tap delay configurations
  - Gesture event properties maps
* **Coding Exam**: `mobile-basics-exam-day-6` (`isGestureSwiped`)
  - **Task**: Write a JS function `isGestureSwiped(durationMs, distancePx)` calculating gesture speeds.
  - **Test**: Flags durations <= 300ms and distance >= 50px as swipes.
* **Coding Assignment**: `mobile-basics-assign-day-6` (`isLongPress`)
  - **Task**: Write a JS function `isLongPress(durationMs)` checking tap timings.
  - **Test**: Threshold verification checks.

#### 🟢 Day 7: Hardware Integration: Camera permission checker
* **Lecture Syllabus**:
  - Native device modules access
  - Permission statuses (granted, denied)
  - Async permission state updates
* **Coding Exam**: `mobile-basics-exam-day-7` (`routeCameraStatus`)
  - **Task**: Write a JS function `routeCameraStatus(status)` returning route endpoints based on device permissions.
  - **Test**: Routes denied to BLOCKED.
* **Coding Assignment**: `mobile-basics-assign-day-7` (`canRequestAgain`)
  - **Task**: Write a JS function `canRequestAgain(tries)` verifying retries.
  - **Test**: Blocks counts exceeding 1 retry.

---

### 📱 Week 2: Hardware Integrations, Sensors & Deployments

#### 🟢 Day 8: Hardware Integration: Accelerometer data parser
* **Lecture Syllabus**:
  - Accelerometer sensor data streams
  - DSP filter calculations values
  - Step counting algorithms parameters
* **Coding Exam**: `mobile-basics-exam-day-8` (`isAccSpikeDetected`)
  - **Task**: Write a JS function `isAccSpikeDetected(x, y, z, limit)` checking gravity vector spikes.
  - **Test**: Evaluates 3D vector values.
* **Coding Assignment**: `mobile-basics-assign-day-8` (`isDeviceFlat`)
  - **Task**: Write a JS function `isDeviceFlat(zValue)` identifying layout posture.
  - **Test**: Proximity checks to standard gravity (9.8).

#### 🟢 Day 9: App Store Deployments: Version code validation
* **Lecture Syllabus**:
  - Configuring semantic versions (1.0.0)
  - Version code integer updates
  - Exporting release IPA/AAB files
* **Coding Exam**: `mobile-basics-exam-day-9` (`isVersionCodeAllowed`)
  - **Task**: Write a JS function `isVersionCodeAllowed(oldCode, newCode)` checking release versions.
  - **Test**: Restricts downgrades.
* **Coding Assignment**: `mobile-basics-assign-day-9` (`getBuildTag`)
  - **Task**: Write a JS function `getBuildTag(verName, code)` building config identifiers.
  - **Test**: Formatting details output.

#### 🟢 Day 10: Final Capstone: Mobile Application Audit
* **Lecture Syllabus**:
  - Layout rendering diagnostics
  - Hardware DSP sensors validation
  - Release build parameters check
* **Coding Exam**: `mobile-basics-exam-day-10` (`evaluateMobileBuild`)
  - **Task**: Write a JS function `evaluateMobileBuild(report)` auditing mobile app.
  - **Test**: Checks gestures, permissions, and version codes.
* **Coding Assignment**: `mobile-basics-assign-day-10` (`getBuildRater`)
  - **Task**: Write a JS function `getBuildRater(lagMs)` rating layouts.
  - **Test**: Targets under 16ms boundaries.

---

### 📱 Week 3: Applied Mobile Deployment & Release Checks

#### 🟢 Day 11: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

---

### 📱 Week 4: Applied Mobile Deployment & Release Checks (Review)

#### 🟢 Day 15: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Reviewing scroll caching properties
  - Assembling release audit checklists
  - Verifying hardware sensor configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Mobile Application Audit (Review)
* **Lecture Syllabus**:
  - Assemble final mobile application deployment and metrics audit report
  - Verify FlatList scroll cache eviction rules and gesture velocities gates
  - Confirm hardware camera permission checks and sensor accelerometer step parser configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
