# 📱 PinIT Career OS — Mobile Application Development & React Native (v1.0)
# Complete 30-Day Technical Reference Manual & Master Curriculum

---

## 🌟 Executive Architectural Overview

Welcome to the definitive **Mobile Application Development & React Native Reference Document** on PinIT Career OS.
This document provides complete, line-by-line pedagogical and operational blueprints for the 30-day cross-platform mobile engineering curriculum:
- **30 Handcrafted Days** $\times$ **90 Deep Micro-Learning Blocks** (3 blocks/day, 0 single-block days).
- **100% Real-World Mobile Architecture, Layouts, Native Hardware APIs, Physics & Testing Analogies**.
- **Memory Box Diagrams, Multi-Tier System Ledgers, and Execution Flowcharts**.
- **100% Runnable JavaScript / Mobile Logic Simulators** with exact expected terminal outputs.
- **Empathetic Socratic Diagnostic Checks & 3-Step Recovery Ladders** (*What Went Wrong* $\to$ *Simpler Everyday Picture* $\to$ *Guided Fix Prompt*).
- **5 Project Milestones + Day 30 Final Capstone**:
  - ⭐ **Day 5 Milestone 1**: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine
  - ⭐ **Day 15 Milestone 2**: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine
  - ⭐ **Day 21 Milestone 3**: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router
  - 🏆 **Day 30 Final Capstone**: Sovereign Cross-Platform Mobile Application Suite

---

## 📅 Day 1: Mobile Architecture & React Native Bridge: JS Thread, Hermes & JSI

> **💡 Everyday Metaphor / Intuitive Model**:
> The React Native JSI Bridge Is an In-Person Direct Handshake: The legacy bridge serialized every touch event into a slow postal letter (JSON string over asynchronous queue); the modern JSI C++ bridge allows JavaScript to tap the native iOS/Android C++ engine directly on the shoulder (`JSI_DIRECT_MEMORY_INVOCATION_NOMINAL`), eliminating serialization lag.

### 🔹 Block 1: Mobile Architecture: Classifying JSI Direct Memory Calls (`isJsiDirectCall: true`)

- **Concept Budget / Primary Invariant**: `Mobile Architecture Runtime Bridge Classifier`
- **Supporting Terms & Invariants**: `Target Thread (`'JS_THREAD'`)`, `JSI Direct Call (`true`)`, `Hermes Bytecode Engine`, `Zero JSON Serialization Overhead`, `Status: JSI Direct Memory Invocation Nominal`

#### 📦 Memory Box / Data Layout Diagram: React Native 3-Thread Architecture Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **1. JS Thread (Hermes)** | Executes business logic & React reconciliation | `JS Thread` |
| **2. Shadow Thread (Yoga)** | Calculates Flexbox C++ layout box nodes | `Shadow` |
| **3. UI Thread (Native)** | Renders UIKit / Android Views via direct JSI memory pointers (NOMINAL!) | `UI Thread` |

#### 📱 Runnable Mobile Simulator: `bridge_classifier_demo.js`

```javascript
function classifyBridge(thread, isJsi) {
  const ok = isJsi === true;
  return {
    thread,
    isJsiDirectCall: isJsi,
    isZeroSerializationOverhead: ok,
    engine: 'Hermes',
    status: ok ? 'JSI_DIRECT_MEMORY_INVOCATION_NOMINAL' : 'LEGACY_SERIALIZED_BRIDGE_OVERHEAD'
  };
}

console.log(JSON.stringify(classifyBridge('JS_THREAD', true)));
console.log(JSON.stringify(classifyBridge('UI_MAIN_THREAD', false)));
```

**Expected Terminal Output**:
```text
{"thread":"JS_THREAD","isJsiDirectCall":true,"isZeroSerializationOverhead":true,"engine":"Hermes","status":"JSI_DIRECT_MEMORY_INVOCATION_NOMINAL"}
{"thread":"UI_MAIN_THREAD","isJsiDirectCall":false,"isZeroSerializationOverhead":false,"engine":"Hermes","status":"LEGACY_SERIALIZED_BRIDGE_OVERHEAD"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a native mobile call uses the zero-overhead C++ JSI memory interface?*

- **Target Answer**: `JSI_DIRECT_MEMORY_INVOCATION_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'LEGACY_SERIALIZED_BRIDGE_OVERHEAD'**:
  - *What Went Wrong*: JSI calls bypass serialization: JSI_DIRECT_MEMORY_INVOCATION_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type JSI_DIRECT_MEMORY_INVOCATION_NOMINAL

---

### 🔹 Block 2: The 3 Core Execution Threads in React Native

- **Concept Budget / Primary Invariant**: `3-Thread Model Invariant`
- **Supporting Terms & Invariants**: `3 Threads (1. JavaScript Thread, 2. Shadow Layout Thread, 3. Native UI Main Thread)`

#### ⚙️ Syntax & Template Anatomy: 3 Threads Breakdown

```text
// 1. JAVASCRIPT THREAD: Runs your React app, API calls, and Zustand state
// 2. SHADOW THREAD:     Computes Flexbox layout coordinates in C++ Yoga
// 3. UI MAIN THREAD:    Draws pixels to device screen at 60/120 FPS
```

- **Line 1**: JS execution thread.
- **Line 2**: C++ Yoga layout engine.
- **Line 3**: Native platform drawing thread.

#### 📱 Runnable Mobile Simulator: `threads_count_demo.js`

```javascript
function getThreadsCount() {
  return 3;
}

console.log(getThreadsCount());
```

**Expected Terminal Output**:
```text
3
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many core execution threads comprise the React Native runtime architecture?*

- **Target Answer**: `3`
- **Typed Misconception ID**: `MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI`

**Diagnostic Recovery Paths**:
- **If Student Triggers '1'**:
  - *What Went Wrong*: React Native offloads work across 3 threads: JS Thread, Shadow Thread, and UI Thread.
  - *Simpler Mental Model*: Type 3.
  - *Guided Fix Action*: Type 3

---

### 🔹 Block 3: Hermes Engine: Ahead-of-Time (AOT) Bytecode Compilation for Fast Startup

- **Concept Budget / Primary Invariant**: `Hermes Bytecode Invariant`
- **Supporting Terms & Invariants**: `Hermes Engine (`Compiles JS files into optimized bytecode at build time, slashing app launch time (TTI) and memory consumption`)`

#### 📱 Runnable Mobile Simulator: `hermes_rule_demo.js`

```javascript
function getHermesRule() {
  return 'HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START';
}

console.log(getHermesRule());
```

**Expected Terminal Output**:
```text
HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why is the Hermes JavaScript engine enabled by default in modern React Native apps?*

- **Target Answer**: `HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START`
- **Typed Misconception ID**: `MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'JUST_IN_TIME'**:
  - *What Went Wrong*: Hermes compiles Ahead-of-Time: HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START.
  - *Simpler Mental Model*: Matches HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START.
  - *Guided Fix Action*: Type HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START

---

## 📅 Day 2: React Native Core Components & Layouts: View, Text & SafeAreaView

> **💡 Everyday Metaphor / Intuitive Model**:
> SafeAreaView Is a High-End Picture Matting Frame: If you paste a photo edge-to-edge on glass, the camera notch and home indicator bar punch holes right through the image; `SafeAreaView` calculates top and bottom padding dynamically ($852\text{px} - 59\text{px} - 34\text{px} = 759\text{px}$), preserving clean viewable margins.

### 🔹 Block 1: Safe Area Math: Calculating Usable Height ($852 - 59 - 34 = 759\text{px}$)

- **Concept Budget / Primary Invariant**: `Safe Area Inset Layout Calculator`
- **Supporting Terms & Invariants**: `Device Height ($852\text{px}$)`, `Top Notch Inset ($59\text{px}$)`, `Bottom Indicator Inset ($34\text{px}$)`, `Usable Height ($759\text{px}$)`, `Status: Safe Area Content Height Calculated Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Safe Area Inset Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Total Screen Height** | 852px (iPhone 15 display boundary) | `Total Height` |
| **Notch & Dynamic Island** | topInset: 59px (Sensor housing clearance) | `Top Inset` |
| **Usable Viewport** | 852 - (59 + 34) = 759px (CALCULATED NOMINAL!) | `Usable Height` |

#### 📱 Runnable Mobile Simulator: `safe_area_demo.js`

```javascript
function calcSafeArea(totalH, top, bottom) {
  const usable = totalH - (top + bottom);
  return {
    totalDeviceHeight: totalH,
    usableContentHeight: usable,
    status: 'SAFE_AREA_CONTENT_HEIGHT_CALCULATED_NOMINAL'
  };
}

console.log(JSON.stringify(calcSafeArea(852, 59, 34)));
```

**Expected Terminal Output**:
```text
{"totalDeviceHeight":852,"usableContentHeight":759,"status":"SAFE_AREA_CONTENT_HEIGHT_CALCULATED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the usable screen height on an 852px device with 59px top and 34px bottom insets?*

- **Target Answer**: `759`
- **Typed Misconception ID**: `MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT`

**Diagnostic Recovery Paths**:
- **If Student Triggers '852'**:
  - *What Went Wrong*: 852 is total screen height. Subtracting insets (59 + 34 = 93) gives 759.
  - *Simpler Mental Model*: Height is 759.
  - *Guided Fix Action*: Type 759

---

### 🔹 Block 2: The Mandatory Text Container: `<Text>`

- **Concept Budget / Primary Invariant**: ``<Text>` Invariant`
- **Supporting Terms & Invariants**: ``<Text>` (`Unlike the web where strings can sit bare inside a <div>, React Native will crash with an invariant violation unless every string is wrapped in a <Text> component`)`

#### ⚙️ Syntax & Template Anatomy: Strict Text Invariant

```text
/* ❌ CRASH: Invariant Violation */
<View>Hello World</View>

/* ✅ NOMINAL: Proper Text Wrapping */
<View>
  <Text>Hello World</Text>
</View>
```

- **Line 2**: Bare string inside View crashes React Native.
- **Line 6**: String properly wrapped in <Text> component.

#### 📱 Runnable Mobile Simulator: `text_comp_demo.js`

```javascript
function getTextComp() {
  return 'Text';
}

console.log(getTextComp());
```

**Expected Terminal Output**:
```text
Text
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What core primitive component must wrap all text strings in React Native?*

- **Target Answer**: `Text`
- **Typed Misconception ID**: `MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'View'**:
  - *What Went Wrong*: View cannot host raw strings. Strings must be enclosed in Text.
  - *Simpler Mental Model*: Type Text.
  - *Guided Fix Action*: Type Text

---

### 🔹 Block 3: Image Invariant: Explicit Width and Height on Remote Network Images

- **Concept Budget / Primary Invariant**: `Image Dimension Invariant`
- **Supporting Terms & Invariants**: `Image Dimensions (`Remote network images have 0x0 default size until downloaded; declaring explicit width and height styles is mandatory to prevent invisible 0px images`)`

#### 📱 Runnable Mobile Simulator: `image_dim_demo.js`

```javascript
function getImageRule() {
  return 'ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES';
}

console.log(getImageRule());
```

**Expected Terminal Output**:
```text
ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why must remote images in React Native always specify explicit width and height styles?*

- **Target Answer**: `ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES`
- **Typed Misconception ID**: `MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'AUTOSIZE_REMOTE'**:
  - *What Went Wrong*: Remote images default to 0x0. Standard is: ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES.
  - *Simpler Mental Model*: Matches ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES.
  - *Guided Fix Action*: Type ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES

---

## 📅 Day 3: StyleSheet & Flexbox Mobile Math: Yoga C++ Layout Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Yoga Mobile Flexbox Is a Vertical Smartphone Scroll: While web CSS defaults to horizontal rows (`flexDirection: 'row'`), a phone is held vertically in one hand, so React Native defaults to vertical stacking (`flexDirection: 'column'`), multiplying point coordinates by the device pixel ratio ($100\text{dp} \times 3.0 = 300\text{px}$).

### 🔹 Block 1: Pixel Scaling: Calculating Physical Pixels on High-DPI Displays ($100\text{dp} \times 3.0 = 300\text{px}$)

- **Concept Budget / Primary Invariant**: `Physical Pixel Resolution Scaler`
- **Supporting Terms & Invariants**: `Density-Independent Points ($100\text{dp}$)`, `Pixel Ratio ($3.0\times$ Retina)`, `Physical Pixels ($300\text{px}$)`, `Status: Physical Pixels Calculated Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Display Pixel Density Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Logical dp Unit** | 100dp (Abstract density-independent coordinate) | `Logical` |
| **Device Pixel Ratio** | PixelRatio.get() = 3.0 (Super Retina display scale) | `Scale` |
| **Physical Hardware Pixels** | 100 * 3.0 = 300 physical pixels (CALCULATED NOMINAL!) | `Physical` |

#### 📱 Runnable Mobile Simulator: `pixel_scale_demo.js`

```javascript
function calcPixels(dp, scale) {
  const phys = Math.round(dp * scale);
  return {
    dp,
    scale,
    physicalPixels: phys,
    status: 'PHYSICAL_PIXELS_CALCULATED_NOMINAL'
  };
}

console.log(JSON.stringify(calcPixels(100, 3.0)));
```

**Expected Terminal Output**:
```text
{"dp":100,"scale":3,"physicalPixels":300,"status":"PHYSICAL_PIXELS_CALCULATED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many physical screen pixels are rendered for a 100dp view on a @3x Retina display?*

- **Target Answer**: `300`
- **Typed Misconception ID**: `MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH`

**Diagnostic Recovery Paths**:
- **If Student Triggers '100'**:
  - *What Went Wrong*: 100 is logical points. On @3x display: 100 * 3 = 300.
  - *Simpler Mental Model*: Pixel count is 300.
  - *Guided Fix Action*: Type 300

---

### 🔹 Block 2: The React Native Default Flex Direction: `column`

- **Concept Budget / Primary Invariant**: `Default Flex Direction Invariant`
- **Supporting Terms & Invariants**: ``flexDirection: 'column'` (`The default primary layout axis in React Native, optimizing for portrait smartphone screens`)`

#### ⚙️ Syntax & Template Anatomy: Web vs Mobile Flexbox Comparison

```text
/* Web CSS Default */
div { display: flex; flex-direction: row; }

/* React Native Default (Yoga) */
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column' } /* COLUMN BY DEFAULT! */
});
```

- **Line 2**: Web defaults to row.
- **Line 6**: React Native defaults to column.

#### 📱 Runnable Mobile Simulator: `flex_dir_demo.js`

```javascript
function getDefaultFlex() {
  return 'column';
}

console.log(getDefaultFlex());
```

**Expected Terminal Output**:
```text
column
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the default flexDirection for View containers in React Native?*

- **Target Answer**: `column`
- **Typed Misconception ID**: `MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'row'**:
  - *What Went Wrong*: row is the web CSS default. React Native defaults to column.
  - *Simpler Mental Model*: Type column.
  - *Guided Fix Action*: Type column

---

### 🔹 Block 3: Style Performance: Using `StyleSheet.create` for ID Referencing & Bridge Optimization

- **Concept Budget / Primary Invariant**: `StyleSheet Optimization Invariant`
- **Supporting Terms & Invariants**: `StyleSheet.create (`Creates immutable style IDs, sending styles across the native bridge once rather than recreating style objects on every render cycle`)`

#### 📱 Runnable Mobile Simulator: `stylesheet_rule_demo.js`

```javascript
function getStyleSheetRule() {
  return 'USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS';
}

console.log(getStyleSheetRule());
```

**Expected Terminal Output**:
```text
USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why should StyleSheet.create be used instead of inline style objects in React Native?*

- **Target Answer**: `USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS`
- **Typed Misconception ID**: `MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'INLINE_IS_SAME'**:
  - *What Went Wrong*: Inline objects trigger GC churn. Standard is: USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS.
  - *Simpler Mental Model*: Matches USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS.
  - *Guided Fix Action*: Type USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS

---

## 📅 Day 4: Touch Responders & Pressable Physics: Hit Slop & Android Ripple

> **💡 Everyday Metaphor / Intuitive Model**:
> hitSlop Is an Invisible Magnetic Field Around a Physical Button: An icon button may be visually small ($24\times24\text{dp}$), but adding a $12\text{dp}$ hitSlop creates an invisible magnetic perimeter ($48\times48\text{dp}$), allowing a hurried user's thumb to activate the action without precision tapping.

### 🔹 Block 1: Touch Targets: Auditing Visual $24\text{dp}$ + $12\text{dp}$ hitSlop to Reach $48\text{dp}$ Standard

- **Concept Budget / Primary Invariant**: `Touch Target & Hit Slop Minimum Dimension Auditor`
- **Supporting Terms & Invariants**: `Visual Dimensions ($24\times24\text{dp}$)`, `hitSlop Insets ($12\text{dp}$ all sides)`, `Effective Touch Area ($48\times48\text{dp}$)`, `Status: Touch Target Accessibility Compliant Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Touch Target Geometry Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Visual Icon Size** | 24x24dp (Tight navigation bar icon) | `Visual` |
| **hitSlop Expansion** | top: 12, bottom: 12, left: 12, right: 12 (Adds 24dp padding) | `hitSlop` |
| **Effective Touch Area** | 24 + 24 = 48x48dp (TOUCH TARGET COMPLIANT NOMINAL!) | `Effective` |

#### 📱 Runnable Mobile Simulator: `touch_target_demo.js`

```javascript
function auditTouch(w, h, hitH, hitV) {
  const tw = w + (hitH * 2);
  const th = h + (hitV * 2);
  const ok = tw >= 48 && th >= 48;
  return {
    effectiveTouchDimensions: `${tw}x${th}`,
    isTouchTargetCompliant: ok,
    status: ok ? 'TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(auditTouch(24, 24, 12, 12)));
console.log(JSON.stringify(auditTouch(20, 20, 5, 5)));
```

**Expected Terminal Output**:
```text
{"effectiveTouchDimensions":"48x48","isTouchTargetCompliant":true,"status":"TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL"}
{"effectiveTouchDimensions":"30x30","isTouchTargetCompliant":false,"status":"DEFECT"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a touchable component meets the minimum 48x48dp touch target threshold?*

- **Target Answer**: `TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: 24 + (12*2) = 48x48 produces TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL

---

### 🔹 Block 2: The Mobile Accessibility Minimum Touch Target: 48dp

- **Concept Budget / Primary Invariant**: `48dp Minimum Invariant`
- **Supporting Terms & Invariants**: `48dp Minimum (`The official Apple Human Interface Guidelines and Google Material Design standard for reliable finger tap registration`)`

#### ⚙️ Syntax & Template Anatomy: Pressable with hitSlop Syntax

```text
<Pressable
  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  android_ripple={{ color: 'rgba(0,0,0,0.12)', borderless: true }}
  onPress={handleAction}
>
  <Icon name="trash" size={24} />
</Pressable>
```

- **Line 2**: hitSlop expands touch boundary to 48x48dp.
- **Line 3**: android_ripple configures Material design ink ripple.
- **Line 6**: Visual icon remains compact at 24dp.

#### 📱 Runnable Mobile Simulator: `min_target_demo.js`

```javascript
function getMinTarget() {
  return 48;
}

console.log(getMinTarget());
```

**Expected Terminal Output**:
```text
48
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the minimum recommended touch target dimension in density-independent pixels (dp) on mobile?*

- **Target Answer**: `48`
- **Typed Misconception ID**: `MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK`

**Diagnostic Recovery Paths**:
- **If Student Triggers '20'**:
  - *What Went Wrong*: 20dp is too small for human fingertips. The standard is 48dp.
  - *Simpler Mental Model*: Type 48.
  - *Guided Fix Action*: Type 48

---

### 🔹 Block 3: Modern React Native: Replacing `TouchableOpacity` with `<Pressable>`

- **Concept Budget / Primary Invariant**: `Pressable Invariant`
- **Supporting Terms & Invariants**: ``<Pressable>` (`The modern foundational touch primitive providing flexible state callbacks: onPressIn, onPressOut, onLongPress, and pressed render props`)`

#### 📱 Runnable Mobile Simulator: `pressable_rule_demo.js`

```javascript
function getTouchPrimitiveRule() {
  return 'PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS';
}

console.log(getTouchPrimitiveRule());
```

**Expected Terminal Output**:
```text
PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What touch primitive is recommended in modern React Native applications?*

- **Target Answer**: `PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS`
- **Typed Misconception ID**: `MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'TOUCHABLE_HIGHLIGHT'**:
  - *What Went Wrong*: Standard is: PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS.
  - *Simpler Mental Model*: Matches PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS.
  - *Guided Fix Action*: Type PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS

---

## 📅 Day 5: ⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 1 Synthesis: The complete foundational mobile layout and runtime execution engine: 1. JSI bridge invocation classification; 2. Safe area content height calculation; 3. Physical pixel density scaling; 4. 48dp touch target accessibility auditing.

### 🔹 Block 1: Mobile Foundations Master Engine Synthesis

- **Concept Budget / Primary Invariant**: `Mobile Foundations Master Engine`
- **Supporting Terms & Invariants**: `JSI Bridge Subsystem`, `Safe Area Subsystem`, `Pixel Scaling Subsystem`, `Touch Target Subsystem`

#### 🔄 Mobile Execution Flowchart: Milestone 1 Mobile Foundations Pipeline

1. **Initializes Hermes runtime & classifies zero-overhead JSI direct calls**
2. **Calculates notch safe area content heights & Retina pixel scaling**
3. **Audits 48dp minimum touch targets & hitSlop thumb boundaries**
4. **Activates Mobile Foundations Master Engine!**

#### 📱 Runnable Mobile Simulator: `mobile_kernel_demo.js`

```javascript
function runMobileFoundations() {
  return {
    bridgeSubsystem: 'ONLINE_JSI_DIRECT_ACTIVE',
    safeAreaSubsystem: 'ONLINE_INSET_CALCULATOR_ACTIVE',
    pixelsSubsystem: 'ONLINE_DENSITY_SCALER_ACTIVE',
    touchSubsystem: 'ONLINE_48DP_TARGETS_ACTIVE',
    engineStatus: 'MOBILE_FOUNDATIONS_MASTER_ACTIVE'
  };
}

console.log(runMobileFoundations().engineStatus);
```

**Expected Terminal Output**:
```text
MOBILE_FOUNDATIONS_MASTER_ACTIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the Mobile Foundations Master Engine?*

- **Target Answer**: `MOBILE_FOUNDATIONS_MASTER_ACTIVE`
- **Typed Misconception ID**: `MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches MOBILE_FOUNDATIONS_MASTER_ACTIVE.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type MOBILE_FOUNDATIONS_MASTER_ACTIVE

---

### 🔹 Block 2: Mobile Foundations Engine Invariant Verification & Precision Audit

- **Concept Budget / Primary Invariant**: `Mobile Foundations Invariant Verification`
- **Supporting Terms & Invariants**: `Bridge Invariant`, `Touch Invariant`, `100% Quality Invariant`

#### 📱 Runnable Mobile Simulator: `mobile_audit_demo.js`

```javascript
function auditMobile(b, s, p, t) {
  const passed = b && s && p && t;
  return {
    bridgeVerified: b,
    safeAreaVerified: s,
    pixelsVerified: p,
    touchVerified: t,
    grade: passed ? 'MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditMobile(true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"bridgeVerified":true,"safeAreaVerified":true,"pixelsVerified":true,"touchVerified":true,"grade":"MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when JSI Bridge, Safe Area, Pixel Scaler, and Touch Targets pass 100%?*

- **Target Answer**: `MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED.
  - *Guided Fix Action*: Type MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 1 Mobile Foundations Certification

- **Concept Budget / Primary Invariant**: `Milestone 1 Certification`
- **Supporting Terms & Invariants**: `Mobile Foundations Verified`, `100% Quality Invariant`

#### 📱 Runnable Mobile Simulator: `milestone1_mobile_cert.js`

```javascript
console.log('⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 1 completion?*

- **Target Answer**: `⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]

---

## 📅 Day 6: Asset Bundling & Vector Icons: Expo Vector Icons & Local Images

> **💡 Everyday Metaphor / Intuitive Model**:
> Local Asset Bundling Is a Pre-Packed Luggage Bag: A bundled image (`require('./logo.png')`) is packed directly into the app binary, returning a numeric asset ID (0 network latency); a remote URL (`{ uri: 'https://...' }`) is ordering room service from across the city, failing completely if the airplane is in offline flight mode.

### 🔹 Block 1: Asset Management: Classifying `require (LOCAL_BUNDLED_ASSET)` vs `{ uri } (REMOTE_NETWORK_URI)`

- **Concept Budget / Primary Invariant**: `Mobile Image Asset URI Type Classifier`
- **Supporting Terms & Invariants**: `Local Bundled Asset (Numeric ID `42`)`, `Remote Network URI (`'https://cdn.pinit.io/logo.png'`)`, `Network Dependency (`requiresNetwork`)`, `Status: Asset Source Classified Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Asset Source Architecture Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **require('./img.png')** | Evaluates to numeric integer asset ID 42 (Bundled in binary, 0 network latency) | `Local Asset` |
| **{ uri: 'https://...' }** | Remote network resource (Requires active HTTP download) | `Remote URI` |
| **Classification Status** | ASSET SOURCE CLASSIFIED NOMINAL (OFFLINE RESILIENCY VERIFIED!) | `Status` |

#### 📱 Runnable Mobile Simulator: `asset_classifier_demo.js`

```javascript
function classifyAsset(src) {
  if (typeof src === 'number') {
    return { source: src, type: 'LOCAL_BUNDLED_ASSET', requiresNetwork: false, status: 'ASSET_SOURCE_CLASSIFIED_NOMINAL' };
  }
  if (typeof src === 'object' && src.uri) {
    return { source: src.uri, type: 'REMOTE_NETWORK_URI', requiresNetwork: true, status: 'ASSET_SOURCE_CLASSIFIED_NOMINAL' };
  }
}

console.log(JSON.stringify(classifyAsset(42)));
console.log(JSON.stringify(classifyAsset({ uri: 'https://cdn.pinit.io/logo.png' })));
```

**Expected Terminal Output**:
```text
{"source":42,"type":"LOCAL_BUNDLED_ASSET","requiresNetwork":false,"status":"ASSET_SOURCE_CLASSIFIED_NOMINAL"}
{"source":"https://cdn.pinit.io/logo.png","type":"REMOTE_NETWORK_URI","requiresNetwork":true,"status":"ASSET_SOURCE_CLASSIFIED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What asset type is assigned to a bundled image loaded via require() numeric asset ID?*

- **Target Answer**: `LOCAL_BUNDLED_ASSET`
- **Typed Misconception ID**: `MC_MOB_ASSET_BUNDLING_VECTOR_ICONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'REMOTE_NETWORK_URI'**:
  - *What Went Wrong*: Numeric require() resolves to LOCAL_BUNDLED_ASSET with zero network requirement.
  - *Simpler Mental Model*: Type is LOCAL_BUNDLED_ASSET.
  - *Guided Fix Action*: Type LOCAL_BUNDLED_ASSET

---

### 🔹 Block 2: The Runtime Type of a `require('./img.png')`: `number`

- **Concept Budget / Primary Invariant**: `Require Return Type Invariant`
- **Supporting Terms & Invariants**: ``number` (`Metro bundler maps local required images to static numeric resource index numbers in the JavaScript bundle`)`

#### ⚙️ Syntax & Template Anatomy: Local Require Mechanics

```text
const iconSource = require('./assets/avatar.png');
console.log(typeof iconSource); // prints 'number'!

<Image source={iconSource} style={{ width: 48, height: 48 }} />
```

- **Line 1**: Metro transforms image import to numeric integer.
- **Line 2**: typeof is 'number'.
- **Line 4**: Image renders instantly from native resource pool.

#### 📱 Runnable Mobile Simulator: `require_type_demo.js`

```javascript
function getRequireType() {
  return 'number';
}

console.log(getRequireType());
```

**Expected Terminal Output**:
```text
number
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the JavaScript runtime data type of an image loaded with require('./image.png') in React Native?*

- **Target Answer**: `number`
- **Typed Misconception ID**: `MC_MOB_ASSET_BUNDLING_VECTOR_ICONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'string'**:
  - *What Went Wrong*: In React Native, require() returns a resource table index number, not a file path string.
  - *Simpler Mental Model*: Type number.
  - *Guided Fix Action*: Type number

---

### 🔹 Block 3: Vector Icon Performance: Rendering Crisp Icons with `@expo/vector-icons`

- **Concept Budget / Primary Invariant**: `Vector Icon Invariant`
- **Supporting Terms & Invariants**: ``@expo/vector-icons` (`Renders vector icons as scalable TrueType font glyphs, providing crisp rendering at any size with zero PNG pixelation`)`

#### 📱 Runnable Mobile Simulator: `vector_icons_demo.js`

```javascript
function getVectorIconRule() {
  return 'USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY';
}

console.log(getVectorIconRule());
```

**Expected Terminal Output**:
```text
USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do production mobile apps render scalable vector icons with zero image blur?*

- **Target Answer**: `USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY`
- **Typed Misconception ID**: `MC_MOB_ASSET_BUNDLING_VECTOR_ICONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'USE_PNG'**:
  - *What Went Wrong*: PNGs blur on high-DPI. Standard is: USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY.
  - *Simpler Mental Model*: Matches USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY.
  - *Guided Fix Action*: Type USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY

---

## 📅 Day 7: React Navigation: Native Stack Navigator & Screen Param Pipelines

> **💡 Everyday Metaphor / Intuitive Model**:
> The Native Stack Navigator Is a Deck of Playing Cards: Tapping a course card pushes a new Detail card cleanly on top of the deck (`navigation.navigate('CourseDetail', { id })`); swiping back from the left bezel smoothly pops the top card off to reveal the previous screen with zero re-rendering.

### 🔹 Block 1: Navigation: Validating Destination Route (`CourseDetailScreen`) & Strong Route Params

- **Concept Budget / Primary Invariant**: `Navigation Stack Route Parameter Validator`
- **Supporting Terms & Invariants**: `Destination Screen (`'CourseDetailScreen'`)`, `Route Parameters (`{ courseId: 'mobile-dev' }`)`, `Registered Routes Registry`, `Status: Stack Navigation Route Validated Nominal`

#### 📦 Memory Box / Data Layout Diagram: Native Stack Route Parameter Pipeline Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Source Screen** | HomeScreen -> navigation.navigate('CourseDetailScreen', { courseId: 'mobile-dev' }) | `Dispatch` |
| **Route Params Pipeline** | route.params.courseId = 'mobile-dev' (Type-safe parameter validation) | `Params` |
| **Validation Status** | STACK NAVIGATION ROUTE VALIDATED NOMINAL (NATIVE TRANSITION!) | `Status` |

#### 📱 Runnable Mobile Simulator: `stack_nav_demo.js`

```javascript
function validateRoute(name, params) {
  const reg = ['HomeScreen', 'CourseDetailScreen', 'ProfileScreen'];
  const ok = reg.includes(name) && typeof params === 'object' && params !== null;
  return {
    destinationRoute: name,
    isRouteValid: ok,
    status: ok ? 'STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(validateRoute('CourseDetailScreen', { courseId: 'mobile-dev' })));
```

**Expected Terminal Output**:
```text
{"destinationRoute":"CourseDetailScreen","isRouteValid":true,"status":"STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a navigation push destination and route parameters are valid?*

- **Target Answer**: `STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Matches STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL

---

### 🔹 Block 2: The High-Performance Native Screen Host: `NativeStackNavigator`

- **Concept Budget / Primary Invariant**: ``createNativeStackNavigator` Invariant`
- **Supporting Terms & Invariants**: ``createNativeStackNavigator` (`Uses native iOS UINavigationController and Android Fragment views for native memory management and 60 FPS transitions`)`

#### ⚙️ Syntax & Template Anatomy: Native Stack Navigator Setup

```text
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </Stack.Navigator>
  );
}
```

- **Line 1**: Import createNativeStackNavigator.
- **Line 3**: Initialize Stack navigator instance.
- **Line 7**: Declare type-safe Screen routes.

#### 📱 Runnable Mobile Simulator: `native_stack_demo.js`

```javascript
function getNativeStackComp() {
  return 'NativeStackNavigator';
}

console.log(getNativeStackComp());
```

**Expected Terminal Output**:
```text
NativeStackNavigator
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What navigator uses native platform screen hierarchies rather than simulated JavaScript animations?*

- **Target Answer**: `NativeStackNavigator`
- **Typed Misconception ID**: `MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'JSStackNavigator'**:
  - *What Went Wrong*: Legacy JS stack is slow. Native screens use NativeStackNavigator.
  - *Simpler Mental Model*: Type NativeStackNavigator.
  - *Guided Fix Action*: Type NativeStackNavigator

---

### 🔹 Block 3: TypeScript Safety: Defining `NativeStackScreenProps` for Route Parameters

- **Concept Budget / Primary Invariant**: `Type-Safe Navigation Invariant`
- **Supporting Terms & Invariants**: ``NativeStackScreenProps` (`Provides compile-time autocomplete and type-checking on route.params, eliminating runtime undefined parameter crashes`)`

#### 📱 Runnable Mobile Simulator: `type_safe_nav_demo.js`

```javascript
function getNavTypeSafetyRule() {
  return 'DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE';
}

console.log(getNavTypeSafetyRule());
```

**Expected Terminal Output**:
```text
DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do professional mobile engineering teams prevent navigation parameter crashes?*

- **Target Answer**: `DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE`
- **Typed Misconception ID**: `MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'UNTYPED_PARAMS'**:
  - *What Went Wrong*: Untyped params cause runtime crashes. Standard is: DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE.
  - *Simpler Mental Model*: Matches DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE.
  - *Guided Fix Action*: Type DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE

---

## 📅 Day 8: Bottom Tabs & Drawer Navigators: Tab Badges & Gesture Transitions

> **💡 Everyday Metaphor / Intuitive Model**:
> Bottom Tab Navigation Is the Dashboard of a Sports Car: The 4 core dials (Home, Courses, Quests, Profile) sit fixed at the bottom within comfortable thumb reach (`bottom`); unread notifications light up an illuminated counter badge (`tabBarBadge: '99+'`), providing immediate situational awareness.

### 🔹 Block 1: Tab Navigation: Formatting Badges ($0 \to \text{undefined}, 5 \to 5, 150 \to \text{'99+'}$)

- **Concept Budget / Primary Invariant**: `Tab Bar Notification Badge Formatter`
- **Supporting Terms & Invariants**: `Zero Count (`undefined` hidden)`, `Normal Count ($5$)`, `Overflow Count (`'99+'`)`, `Status: Tab Bar Badge Formatted Nominal`

#### 📦 Memory Box / Data Layout Diagram: Bottom Tab Notification Badge Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **0 Unread Count** | tabBarBadge = undefined (Badge hidden cleanly) | `Hidden` |
| **5 Unread Count** | tabBarBadge = 5 (Numeric badge displayed) | `Normal` |
| **150 Unread Count** | tabBarBadge = '99+' (Formatted nominal to fit pill!) | `Overflow` |

#### 📱 Runnable Mobile Simulator: `tab_badge_demo.js`

```javascript
function formatBadge(count) {
  if (count <= 0) return { badge: undefined, hasBadge: false, status: 'TAB_BAR_BADGE_FORMATTED_NOMINAL' };
  if (count > 99) return { badge: '99+', hasBadge: true, status: 'TAB_BAR_BADGE_FORMATTED_NOMINAL' };
  return { badge: count, hasBadge: true, status: 'TAB_BAR_BADGE_FORMATTED_NOMINAL' };
}

console.log(JSON.stringify(formatBadge(0)));
console.log(JSON.stringify(formatBadge(5)));
console.log(JSON.stringify(formatBadge(150)));
```

**Expected Terminal Output**:
```text
{"hasBadge":false,"status":"TAB_BAR_BADGE_FORMATTED_NOMINAL"}
{"badge":5,"hasBadge":true,"status":"TAB_BAR_BADGE_FORMATTED_NOMINAL"}
{"badge":"99+","hasBadge":true,"status":"TAB_BAR_BADGE_FORMATTED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What badge value is formatted for 150 unread messages to fit cleanly inside a mobile tab icon pill?*

- **Target Answer**: `99+`
- **Typed Misconception ID**: `MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '150'**:
  - *What Went Wrong*: 3-digit numbers overflow badge bubbles. Format count > 99 as '99+'.
  - *Simpler Mental Model*: Badge is 99+.
  - *Guided Fix Action*: Type 99+

---

### 🔹 Block 2: The Ergonomic Mobile Tab Position: `bottom`

- **Concept Budget / Primary Invariant**: `Bottom Position Invariant`
- **Supporting Terms & Invariants**: ``bottom` (`Placing main navigation tabs at the bottom of the viewport allows comfortable one-handed thumb interaction without straining to reach top corners`)`

#### ⚙️ Syntax & Template Anatomy: Bottom Tab Ergonomics

```text
// ONE-HANDED THUMB ZONE ERGONOMICS:
// 1. Top 20% of screen:     Hard to reach (Header & Status only)
// 2. Middle 50% of screen:  Easy viewing (Scrollable Content)
// 3. Bottom 30% of screen:  NATURAL THUMB ZONE (Bottom Tab Bar!)
```

- **Line 2**: Top reach zone.
- **Line 3**: Middle view zone.
- **Line 4**: Bottom thumb zone: Primary interactive navigation.

#### 📱 Runnable Mobile Simulator: `tab_position_demo.js`

```javascript
function getTabPos() {
  return 'bottom';
}

console.log(getTabPos());
```

**Expected Terminal Output**:
```text
bottom
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Where should primary application navigation tabs be positioned for ergonomic one-handed smartphone use?*

- **Target Answer**: `bottom`
- **Typed Misconception ID**: `MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'top'**:
  - *What Went Wrong*: Top position causes thumb strain. Mobile tabs are placed at the bottom.
  - *Simpler Mental Model*: Type bottom.
  - *Guided Fix Action*: Type bottom

---

### 🔹 Block 3: Drawer Interaction: Enabling Edge Swipe Gestures

- **Concept Budget / Primary Invariant**: `Edge Swipe Invariant`
- **Supporting Terms & Invariants**: `Edge Swipe Gesture (`'swipeEdgeWidth: 50': Allows opening side drawers with a natural thumb swipe from the screen boundary while preventing gesture conflicts in map/list content`)`

#### 📱 Runnable Mobile Simulator: `drawer_gesture_demo.js`

```javascript
function getDrawerRule() {
  return 'USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS';
}

console.log(getDrawerRule());
```

**Expected Terminal Output**:
```text
USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What gesture configuration prevents side drawers from conflicting with horizontal list scrolling?*

- **Target Answer**: `USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS`
- **Typed Misconception ID**: `MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FULL_SCREEN_SWIPE'**:
  - *What Went Wrong*: Full screen swipe breaks inner sliders. Standard is: USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS.
  - *Simpler Mental Model*: Matches USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS.
  - *Guided Fix Action*: Type USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS

---

## 📅 Day 9: Keyboard Handling & Forms in Mobile: KeyboardAvoidingView & Scroll Dismiss

> **💡 Everyday Metaphor / Intuitive Model**:
> KeyboardAvoidingView Is an Automatic Elevator for Form Inputs: When the smartphone soft keyboard slides up from the floor, `KeyboardAvoidingView` detects the platform (`'padding'` on iOS vs `'height'` on Android), lifting the input fields upward so the keyboard never covers the user's typing field (`KEYBOARD_AVOIDING_BEHAVIOR_RESOLVED_NOMINAL`).

### 🔹 Block 1: Keyboard Handling: Mapping `'ios'` $\to$ `'padding'` vs `'android'` $\to$ `'height'`

- **Concept Budget / Primary Invariant**: `KeyboardAvoidingView Behavior Platform Matcher`
- **Supporting Terms & Invariants**: `Platform OS (`'ios'` vs `'android'`)`, `Recommended Behavior (`'padding'` vs `'height'`)`, `Status: Keyboard Avoiding Behavior Resolved Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Keyboard Behavior Architecture Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **iOS Platform** | behavior='padding' (Pushes view up smoothly using layout padding) | `iOS` |
| **Android Platform** | behavior='height' (Adjusts container height with windowSoftInputMode) | `Android` |
| **Behavior Resolution** | KEYBOARD AVOIDING BEHAVIOR RESOLVED NOMINAL (0 OCCLUSION!) | `Status` |

#### 📱 Runnable Mobile Simulator: `keyboard_behavior_demo.js`

```javascript
function resolveKeyboardBehavior(os) {
  const beh = os === 'ios' ? 'padding' : 'height';
  return {
    platformOs: os,
    recommendedBehavior: beh,
    status: 'KEYBOARD_AVOIDING_BEHAVIOR_RESOLVED_NOMINAL'
  };
}

console.log(JSON.stringify(resolveKeyboardBehavior('ios')));
console.log(JSON.stringify(resolveKeyboardBehavior('android')));
```

**Expected Terminal Output**:
```text
{"platformOs":"ios","recommendedBehavior":"padding","status":"KEYBOARD_AVOIDING_BEHAVIOR_RESOLVED_NOMINAL"}
{"platformOs":"android","recommendedBehavior":"height","status":"KEYBOARD_AVOIDING_BEHAVIOR_RESOLVED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What KeyboardAvoidingView behavior property is recommended for iOS devices?*

- **Target Answer**: `padding`
- **Typed Misconception ID**: `MC_MOB_KEYBOARD_AVOIDING_FORM_STATE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'height'**:
  - *What Went Wrong*: height is for Android. iOS requires 'padding' to avoid layout jumping.
  - *Simpler Mental Model*: Behavior is padding.
  - *Guided Fix Action*: Type padding

---

### 🔹 Block 2: The Programmatic Keyboard Dismissal API: `Keyboard.dismiss`

- **Concept Budget / Primary Invariant**: ``Keyboard.dismiss` Invariant`
- **Supporting Terms & Invariants**: ``Keyboard.dismiss()` (`Dismisses the active software keyboard and releases focus from any focused TextInput element`)`

#### ⚙️ Syntax & Template Anatomy: Keyboard Dismissal Setup

```text
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

function ScreenWrapper({ children }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
}
```

- **Line 5**: Tapping anywhere outside the input dismisses soft keyboard.
- **Line 5.2**: accessible={false} prevents accessibility tree noise.

#### 📱 Runnable Mobile Simulator: `keyboard_dismiss_demo.js`

```javascript
function getKeyboardDismiss() {
  return 'Keyboard.dismiss';
}

console.log(getKeyboardDismiss());
```

**Expected Terminal Output**:
```text
Keyboard.dismiss
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What core React Native method programmatically closes the on-screen soft keyboard?*

- **Target Answer**: `Keyboard.dismiss`
- **Typed Misconception ID**: `MC_MOB_KEYBOARD_AVOIDING_FORM_STATE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'Keyboard.close'**:
  - *What Went Wrong*: The React Native API method is Keyboard.dismiss().
  - *Simpler Mental Model*: Type Keyboard.dismiss.
  - *Guided Fix Action*: Type Keyboard.dismiss

---

### 🔹 Block 3: ScrollView Touch Invariant: `keyboardShouldPersistTaps="handled"`

- **Concept Budget / Primary Invariant**: ``keyboardShouldPersistTaps` Invariant`
- **Supporting Terms & Invariants**: ``keyboardShouldPersistTaps="handled"` (`Ensures that pressing a submit button while the keyboard is open executes the button's onPress immediately without requiring a 2nd tap`)`

#### 📱 Runnable Mobile Simulator: `persist_taps_demo.js`

```javascript
function getPersistTapsRule() {
  return 'SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS';
}

console.log(getPersistTapsRule());
```

**Expected Terminal Output**:
```text
SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What ScrollView property allows immediate button tapping while the soft keyboard is open?*

- **Target Answer**: `SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS`
- **Typed Misconception ID**: `MC_MOB_KEYBOARD_AVOIDING_FORM_STATE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'NEVER'**:
  - *What Went Wrong*: 'never' forces users to tap twice. Standard is: SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS.
  - *Simpler Mental Model*: Matches SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS.
  - *Guided Fix Action*: Type SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS

---

## 📅 Day 10: Global State & Local Persistence in Mobile: Zustand & AsyncStorage / MMKV

> **💡 Everyday Metaphor / Intuitive Model**:
> MMKV Is a Direct Memory-Mapped SSD in a Smartphone: Legacy AsyncStorage wrote serialized JSON strings across a slow asynchronous bridge; MMKV uses C++ mmap() system calls directly into shared flash memory, allowing Zustand stores to rehydrate instantly on cold boot in under $2\text{ms}$.

### 🔹 Block 1: Mobile Storage: Serializing Key-Value JSON Payloads (`MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL`)

- **Concept Budget / Primary Invariant**: `Mobile Storage MMKV / AsyncStorage Key-Value Persister`
- **Supporting Terms & Invariants**: `Storage Key (`'user_session'`)`, `Serialized JSON Payload`, `Payload Length`, `Status: Mobile State Payload Serialized Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile State Persistence Pipeline Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Zustand State Store** | { userId: 101, token: 'jwt-abc' } | `RAM` |
| **MMKV C++ mmap Layer** | Direct memory mapping to local disk partition (2ms persistence) | `Flash Disk` |
| **Serialization Status** | MOBILE STATE PAYLOAD SERIALIZED NOMINAL (ZERO DATA LOSS!) | `Status` |

#### 📱 Runnable Mobile Simulator: `storage_serialize_demo.js`

```javascript
function serializeState(key, data) {
  const str = JSON.stringify(data);
  return {
    storageKey: key,
    payloadLength: str.length,
    serializedJson: str,
    status: 'MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL'
  };
}

console.log(JSON.stringify(serializeState('user_session', { userId: 101, token: 'jwt-abc' })));
```

**Expected Terminal Output**:
```text
{"storageKey":"user_session","payloadLength":35,"serializedJson":"{\"userId\":101,\"token\":\"jwt-abc\"}","status":"MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms successful serialization of state data for mobile disk persistence?*

- **Target Answer**: `MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Matches MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL

---

### 🔹 Block 2: The High-Performance Native Storage Engine: `MMKV`

- **Concept Budget / Primary Invariant**: `MMKV Engine Invariant`
- **Supporting Terms & Invariants**: ``MMKV` (`WeChat's memory-mapped key-value storage framework providing synchronous, high-speed C++ storage in React Native`)`

#### ⚙️ Syntax & Template Anatomy: Zustand with MMKV Persistence

```text
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const mmkvStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: (name) => storage.getString(name) ?? null,
  removeItem: (name) => storage.delete(name)
};

export const useAppStore = create(persist((set) => ({
  theme: 'dark',
  setTheme: (t) => set({ theme: t })
}), { name: 'app-storage', storage: createJSONStorage(() => mmkvStorage) }));
```

- **Line 3**: Import MMKV high-speed engine.
- **Line 5**: Instant synchronous C++ storage binding.
- **Line 14**: Zustand persist store.

#### 📱 Runnable Mobile Simulator: `mmkv_acronym_demo.js`

```javascript
function getFastStorage() {
  return 'MMKV';
}

console.log(getFastStorage());
```

**Expected Terminal Output**:
```text
MMKV
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the acronym for the high-speed C++ memory-mapped mobile storage engine?*

- **Target Answer**: `MMKV`
- **Typed Misconception ID**: `MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'AsyncStorage'**:
  - *What Went Wrong*: AsyncStorage is slow and async. The high-speed C++ engine is MMKV.
  - *Simpler Mental Model*: Type MMKV.
  - *Guided Fix Action*: Type MMKV

---

### 🔹 Block 3: Startup Speed: Eliminating Flash of Default State with Synchronous Storage

- **Concept Budget / Primary Invariant**: `Synchronous Rehydration Invariant`
- **Supporting Terms & Invariants**: `Synchronous Rehydration (`Reading stored user session data synchronously during initial component mounting prevents visual login flashes`)`

#### 📱 Runnable Mobile Simulator: `sync_storage_demo.js`

```javascript
function getStorageAdvantageRule() {
  return 'SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START';
}

console.log(getStorageAdvantageRule());
```

**Expected Terminal Output**:
```text
SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What visual glitch is eliminated by using synchronous local storage in mobile apps?*

- **Target Answer**: `SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START`
- **Typed Misconception ID**: `MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'NO_ADVANTAGE'**:
  - *What Went Wrong*: Standard is: SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START.
  - *Simpler Mental Model*: Matches SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START.
  - *Guided Fix Action*: Type SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START

---

## 📅 Day 11: Native Device APIs: Camera & Media Library Permissions

> **💡 Everyday Metaphor / Intuitive Model**:
> Mobile Hardware Permissions Are a Multi-Tier Security Gate: When the app first requests camera access, the OS asks the user (Gate 1); if the user grants it (`GRANTED`), the lens opens; if permanently denied (`DENIED`), the gate is padlocked, requiring the app to open the OS Settings app (`Linking.openSettings()`).

### 🔹 Block 1: Hardware Permissions: Evaluating `GRANTED` vs `DENIED` with `Linking.openSettings()`

- **Concept Budget / Primary Invariant**: `Mobile Hardware Permission Flow Evaluator`
- **Supporting Terms & Invariants**: `Permission Status (`'GRANTED'` vs `'DENIED'`)`, `Can Ask Again (`true` vs `false`)`, `Action Required (`'REDIRECT_TO_SYSTEM_SETTINGS'`)`, `Status: Permission Granted Nominal`

#### 📦 Memory Box / Data Layout Diagram: Native Hardware Permission State Machine Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Status: GRANTED** | canAccessHardware = true -> action: 'PROCEED_CAMERA_CAPTURE' | `Granted` |
| **Status: DENIED (canAsk: false)** | canAccessHardware = false -> action: 'REDIRECT_TO_SYSTEM_SETTINGS' | `Permanent Denial` |
| **Flow Resolution** | PERMISSION FLOW EVALUATED NOMINAL (SECURITY BOUNDARIES RESPECTED!) | `Status` |

#### 📱 Runnable Mobile Simulator: `permission_flow_demo.js`

```javascript
function evalPermission(status, canAsk) {
  if (status === 'GRANTED') return { canAccess: true, action: 'PROCEED_CAMERA_CAPTURE', status: 'PERMISSION_GRANTED_NOMINAL' };
  if (canAsk) return { canAccess: false, action: 'REQUEST_PERMISSION_DIALOG', status: 'PERMISSION_PENDING_REQUEST' };
  return { canAccess: false, action: 'REDIRECT_TO_SYSTEM_SETTINGS', status: 'PERMISSION_DENIED_PERMANENTLY' };
}

console.log(JSON.stringify(evalPermission('GRANTED', false)));
console.log(JSON.stringify(evalPermission('DENIED', false)));
```

**Expected Terminal Output**:
```text
{"canAccess":true,"action":"PROCEED_CAMERA_CAPTURE","status":"PERMISSION_GRANTED_NOMINAL"}
{"canAccess":false,"action":"REDIRECT_TO_SYSTEM_SETTINGS","status":"PERMISSION_DENIED_PERMANENTLY"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What action is triggered when hardware permission is permanently denied and cannot be requested again?*

- **Target Answer**: `REDIRECT_TO_SYSTEM_SETTINGS`
- **Typed Misconception ID**: `MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'CRASH_APP'**:
  - *What Went Wrong*: Apps must gracefully direct users to settings: REDIRECT_TO_SYSTEM_SETTINGS.
  - *Simpler Mental Model*: Action is REDIRECT_TO_SYSTEM_SETTINGS.
  - *Guided Fix Action*: Type REDIRECT_TO_SYSTEM_SETTINGS

---

### 🔹 Block 2: The System Settings Linking API: `Linking.openSettings`

- **Concept Budget / Primary Invariant**: ``Linking.openSettings` Invariant`
- **Supporting Terms & Invariants**: ``Linking.openSettings()` (`Opens the native iOS/Android system settings page for the current application so the user can manually enable camera/location permissions`)`

#### ⚙️ Syntax & Template Anatomy: Settings Redirection Syntax

```text
import { Linking, Alert } from 'react-native';

function promptUserSettings() {
  Alert.alert(
    'Camera Permission Required',
    'Please enable camera access in your device settings to take profile photos.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() }
    ]
  );
}
```

- **Line 1**: Import Linking API.
- **Line 8**: Linking.openSettings() jumps directly into app permissions in iOS/Android Settings.

#### 📱 Runnable Mobile Simulator: `open_settings_demo.js`

```javascript
function getSettingsMethod() {
  return 'Linking.openSettings';
}

console.log(getSettingsMethod());
```

**Expected Terminal Output**:
```text
Linking.openSettings
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What React Native API opens the OS settings page for the running app?*

- **Target Answer**: `Linking.openSettings`
- **Typed Misconception ID**: `MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'Settings.open'**:
  - *What Went Wrong*: The React Native standard API is Linking.openSettings().
  - *Simpler Mental Model*: Type Linking.openSettings.
  - *Guided Fix Action*: Type Linking.openSettings

---

### 🔹 Block 3: Network Performance: Compressing Camera Images ($0.7$ Quality) Before Upload

- **Concept Budget / Primary Invariant**: `Image Compression Invariant`
- **Supporting Terms & Invariants**: `Image Compression (`Compressing raw 12MB photos to ~400KB with 0.7 quality saves user mobile data and reduces backend S3 storage costs by 95%`)`

#### 📱 Runnable Mobile Simulator: `image_compress_demo.js`

```javascript
function getImageCompressionRule() {
  return 'COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH';
}

console.log(getImageCompressionRule());
```

**Expected Terminal Output**:
```text
COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why should mobile applications compress camera images before network upload?*

- **Target Answer**: `COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH`
- **Typed Misconception ID**: `MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'RAW_12MB'**:
  - *What Went Wrong*: Raw images drain battery. Standard is: COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH.
  - *Simpler Mental Model*: Matches COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH.
  - *Guided Fix Action*: Type COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH

---

## 📅 Day 12: Native Geolocation & Maps: Foreground vs Background GPS Tracking

> **💡 Everyday Metaphor / Intuitive Model**:
> Mobile GPS Filtering Is a High-Precision Surveying Tool: A raw GPS chip often reports rough cell tower triangulation ($150\text{m}$ error circle); setting an accuracy threshold ($le 20\text{m}$) filters out noisy approximations so map markers drop exactly onto the user's real building doorstep.

### 🔹 Block 1: Geolocation: Filtering High-Accuracy GPS Coordinates ($8.5\text{m} \le 20\text{m}$ Passing)

- **Concept Budget / Primary Invariant**: `GPS Coordinate Distance & Accuracy Filter`
- **Supporting Terms & Invariants**: `Reported Accuracy ($8.5\text{m}$ vs $150\text{m}$)`, `Accuracy Ceiling ($20\text{m}$)`, `Fix Acceptance Status`, `Status: GPS Location Fix Accepted Nominal`

#### 📦 Memory Box / Data Layout Diagram: GPS Accuracy Filtering Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Hardware Fix A** | accuracy: 8.5m <= 20m threshold -> Fix ACCEPTED (NOMINAL!) | `Accurate Fix` |
| **Hardware Fix B** | accuracy: 150m > 20m threshold -> Cell tower noise DISCARDED | `Inaccurate Fix` |
| **Filter Status** | GPS LOCATION FIX ACCEPTED NOMINAL (PRECISION MAPPING VERIFIED!) | `Status` |

#### 📱 Runnable Mobile Simulator: `gps_filter_demo.js`

```javascript
function filterGps(acc, maxAllowed) {
  const ok = acc <= maxAllowed;
  return {
    accuracyMeters: acc,
    isFixAccepted: ok,
    status: ok ? 'GPS_LOCATION_FIX_ACCEPTED_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(filterGps(8.5, 20)));
console.log(JSON.stringify(filterGps(150, 20)));
```

**Expected Terminal Output**:
```text
{"accuracyMeters":8.5,"isFixAccepted":true,"status":"GPS_LOCATION_FIX_ACCEPTED_NOMINAL"}
{"accuracyMeters":150,"isFixAccepted":false,"status":"DEFECT"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a GPS coordinate meets the 20m accuracy precision threshold?*

- **Target Answer**: `GPS_LOCATION_FIX_ACCEPTED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_GEOLOCATION_MAPS_TRACKING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: 8.5m is within 20m: GPS_LOCATION_FIX_ACCEPTED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type GPS_LOCATION_FIX_ACCEPTED_NOMINAL

---

### 🔹 Block 2: The Standard High-Accuracy GPS Threshold: 20 Meters

- **Concept Budget / Primary Invariant**: `20 Meter Accuracy Invariant`
- **Supporting Terms & Invariants**: `20 Meter Threshold (`The standard maximum acceptable horizontal accuracy radius for interactive map positioning and navigation routing`)`

#### ⚙️ Syntax & Template Anatomy: expo-location High Accuracy

```text
import * as Location from 'expo-location';

const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High,
  timeInterval: 5000
});
console.log(location.coords.accuracy); // <= 20 meters
```

- **Line 3**: Location.Accuracy.High activates GPS satellite receiver.
- **Line 6**: coords.accuracy returns horizontal error radius in meters.

#### 📱 Runnable Mobile Simulator: `gps_threshold_demo.js`

```javascript
function getGpsThreshold() {
  return 20;
}

console.log(getGpsThreshold());
```

**Expected Terminal Output**:
```text
20
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the standard maximum horizontal accuracy threshold in meters for accepting a GPS fix?*

- **Target Answer**: `20`
- **Typed Misconception ID**: `MC_MOB_GEOLOCATION_MAPS_TRACKING`

**Diagnostic Recovery Paths**:
- **If Student Triggers '500'**:
  - *What Went Wrong*: 500m is half a kilometer away. High accuracy threshold is 20m.
  - *Simpler Mental Model*: Type 20.
  - *Guided Fix Action*: Type 20

---

### 🔹 Block 3: Battery Protection: Disabling Continuous GPS Polling When Inactive

- **Concept Budget / Primary Invariant**: `GPS Power Invariant`
- **Supporting Terms & Invariants**: `GPS Power Management (`Continuous GPS satellite hardware polling will drain a smartphone battery in 2 hours; always stop location subscriptions on unmount`)`

#### 📱 Runnable Mobile Simulator: `gps_power_demo.js`

```javascript
function getGpsPowerRule() {
  return 'REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY';
}

console.log(getGpsPowerRule());
```

**Expected Terminal Output**:
```text
REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why must location subscription watchers be explicitly removed when a map screen unmounts?*

- **Target Answer**: `REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY`
- **Typed Misconception ID**: `MC_MOB_GEOLOCATION_MAPS_TRACKING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'KEEP_RUNNING'**:
  - *What Went Wrong*: Leaving GPS on drains power rapidly. Standard is: REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY.
  - *Simpler Mental Model*: Matches REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY.
  - *Guided Fix Action*: Type REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY

---

## 📅 Day 13: Native Biometrics Authentication: FaceID, TouchID & Biometric Keys

> **💡 Everyday Metaphor / Intuitive Model**:
> Biometric Authentication Is an Optical Retina Scanner on a Safe: It checks that the hardware scanner is physically present (`hasHardware`), verifies that the user's face is enrolled in the vault registry (`isEnrolled`), and unlocks the safe with FaceID without transmitting sensitive passwords over the network (`BIOMETRIC_AUTHENTICATION_READY_NOMINAL`).

### 🔹 Block 1: Biometrics: Auditing Hardware Availability, Enrollment & `FaceID` Support

- **Concept Budget / Primary Invariant**: `Biometric Authentication Capability Auditor`
- **Supporting Terms & Invariants**: `Hardware Available (`true`)`, `Biometrics Enrolled (`true`)`, `Supported Types (`['FACIAL_RECOGNITION']`)`, `Status: Biometric Authentication Ready Nominal`

#### 📦 Memory Box / Data Layout Diagram: Native Biometrics Authentication Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **hasHardwareAsync()** | true (Secure Enclave / Biometric sensor present) | `Hardware` |
| **isEnrolledAsync()** | true (User has scanned Face or Fingerprint in OS) | `Enrolled` |
| **Audit Readiness** | BIOMETRIC AUTHENTICATION READY NOMINAL (INSTANT LOGIN!) | `Status` |

#### 📱 Runnable Mobile Simulator: `biometrics_demo.js`

```javascript
function auditBio(hw, enrolled, types) {
  const ok = hw && enrolled && Array.isArray(types) && types.length > 0;
  return {
    hardwareAvailable: hw,
    isBiometricsReady: ok,
    status: ok ? 'BIOMETRIC_AUTHENTICATION_READY_NOMINAL' : 'BIOMETRIC_UNAVAILABLE'
  };
}

console.log(JSON.stringify(auditBio(true, true, ['FACIAL_RECOGNITION'])));
console.log(JSON.stringify(auditBio(true, false, ['FINGERPRINT'])));
```

**Expected Terminal Output**:
```text
{"hardwareAvailable":true,"isBiometricsReady":true,"status":"BIOMETRIC_AUTHENTICATION_READY_NOMINAL"}
{"hardwareAvailable":true,"isBiometricsReady":false,"status":"BIOMETRIC_UNAVAILABLE"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that biometric authentication is fully configured and ready for user login?*

- **Target Answer**: `BIOMETRIC_AUTHENTICATION_READY_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'BIOMETRIC_UNAVAILABLE'**:
  - *What Went Wrong*: Matches BIOMETRIC_AUTHENTICATION_READY_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type BIOMETRIC_AUTHENTICATION_READY_NOMINAL

---

### 🔹 Block 2: The Apple Facial Recognition Brand Name: `FaceID`

- **Concept Budget / Primary Invariant**: `FaceID Invariant`
- **Supporting Terms & Invariants**: ``FaceID` (`Apple's hardware facial recognition technology powered by the TrueDepth camera and Secure Enclave`)`

#### ⚙️ Syntax & Template Anatomy: expo-local-authentication Setup

```text
import * as LocalAuthentication from 'expo-local-authentication';

const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Unlock PinIT Career OS with FaceID',
  fallbackLabel: 'Use Device Passcode'
});
if (result.success) {
  console.log('Login verified via FaceID!');
}
```

- **Line 3**: authenticateAsync prompts native system biometric sheet.
- **Line 7**: result.success confirms biometric signature.

#### 📱 Runnable Mobile Simulator: `faceid_name_demo.js`

```javascript
function getFaceIdName() {
  return 'FaceID';
}

console.log(getFaceIdName());
```

**Expected Terminal Output**:
```text
FaceID
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the official brand name of Apple's biometric facial recognition technology?*

- **Target Answer**: `FaceID`
- **Typed Misconception ID**: `MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'TouchID'**:
  - *What Went Wrong*: TouchID is fingerprint scanning. Facial recognition is FaceID.
  - *Simpler Mental Model*: Type FaceID.
  - *Guided Fix Action*: Type FaceID

---

### 🔹 Block 3: Biometric Fallback: Always Providing Fallback to Device Passcode / PIN

- **Concept Budget / Primary Invariant**: `Passcode Fallback Invariant`
- **Supporting Terms & Invariants**: `Passcode Fallback (`If a user is wearing a face mask or has a wet thumb, the system must provide immediate fallback to the device PIN to prevent account lockout`)`

#### 📱 Runnable Mobile Simulator: `passcode_fallback_demo.js`

```javascript
function getBiometricFallbackRule() {
  return 'ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION';
}

console.log(getBiometricFallbackRule());
```

**Expected Terminal Output**:
```text
ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What fallback mechanism must always accompany biometric authentication in mobile apps?*

- **Target Answer**: `ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION`
- **Typed Misconception ID**: `MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'NO_FALLBACK'**:
  - *What Went Wrong*: Biometrics can fail sensor checks. Standard is: ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION.
  - *Simpler Mental Model*: Matches ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION.
  - *Guided Fix Action*: Type ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION

---

## 📅 Day 14: Offline-First Storage & Local SQLite: Migrations & Optimistic Sync

> **💡 Everyday Metaphor / Intuitive Model**:
> Local SQLite Schema Versioning Is a Building Permit Inspector: When the app launches, the inspector checks the SQLite database version stamp (`PRAGMA user_version`); if the disk has version 1 and the new code requires version 3, the inspector executes migrations 2 and 3 sequentially before granting app access.

### 🔹 Block 1: Local SQLite: Resolving Database Schema Migrations ($v1 \to v3 = 2$ Steps)

- **Concept Budget / Primary Invariant**: `SQLite Schema Migration Version Resolver`
- **Supporting Terms & Invariants**: `Current DB Version ($1$)`, `Target App Version ($3$)`, `Migration Steps Count ($2$ steps)`, `Status: SQLite Schema Migration Required`

#### 📦 Memory Box / Data Layout Diagram: Local SQLite Database Migration Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **PRAGMA user_version** | Current on-device DB version = 1 | `Current Version` |
| **App Target Schema** | Target schema version = 3 (Requires 2 migrations) | `Target Version` |
| **Migration Resolver** | SQLITE SCHEMA MIGRATION REQUIRED (2 STEPS PENDING NOMINAL!) | `Status` |

#### 📱 Runnable Mobile Simulator: `sqlite_migration_demo.js`

```javascript
function resolveMigration(curr, target) {
  const needs = curr < target;
  return {
    currentDbVersion: curr,
    targetAppVersion: target,
    requiresMigration: needs,
    migrationStepsCount: Math.max(0, target - curr),
    status: needs ? 'SQLITE_SCHEMA_MIGRATION_REQUIRED' : 'SQLITE_SCHEMA_UP_TO_DATE_NOMINAL'
  };
}

console.log(JSON.stringify(resolveMigration(1, 3)));
console.log(JSON.stringify(resolveMigration(3, 3)));
```

**Expected Terminal Output**:
```text
{"currentDbVersion":1,"targetAppVersion":3,"requiresMigration":true,"migrationStepsCount":2,"status":"SQLITE_SCHEMA_MIGRATION_REQUIRED"}
{"currentDbVersion":3,"targetAppVersion":3,"requiresMigration":false,"migrationStepsCount":0,"status":"SQLITE_SCHEMA_UP_TO_DATE_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many schema migration steps must execute when current DB is version 1 and target is version 3?*

- **Target Answer**: `2`
- **Typed Misconception ID**: `MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '3'**:
  - *What Went Wrong*: 3 - 1 = 2 migration steps (v1->v2 and v2->v3).
  - *Simpler Mental Model*: Steps count is 2.
  - *Guided Fix Action*: Type 2

---

### 🔹 Block 2: The SQLite User Version Query: `PRAGMA user_version`

- **Concept Budget / Primary Invariant**: ``PRAGMA user_version` Invariant`
- **Supporting Terms & Invariants**: ``PRAGMA user_version` (`The built-in SQLite integer register used to track and store schema migration version numbers`)`

#### ⚙️ Syntax & Template Anatomy: SQLite Version PRAGMA

```text
// Read current database version:
const [{ user_version }] = await db.getAllAsync('PRAGMA user_version');

// Update version after running migration SQL:
await db.execAsync('PRAGMA user_version = 3;');
```

- **Line 2**: Reads user_version integer.
- **Line 5**: Atomically updates schema version.

#### 📱 Runnable Mobile Simulator: `sqlite_pragma_demo.js`

```javascript
function getPragma() {
  return 'PRAGMA user_version';
}

console.log(getPragma());
```

**Expected Terminal Output**:
```text
PRAGMA user_version
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What SQLite PRAGMA statement is used to read and update schema migration version numbers?*

- **Target Answer**: `PRAGMA user_version`
- **Typed Misconception ID**: `MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'PRAGMA schema_version'**:
  - *What Went Wrong*: schema_version is reserved for internal SQLite engine tables. User migrations use PRAGMA user_version.
  - *Simpler Mental Model*: Type PRAGMA user_version.
  - *Guided Fix Action*: Type PRAGMA user_version

---

### 🔹 Block 3: Offline UX: Optimistic UI Updates with Local SQLite Synchronization

- **Concept Budget / Primary Invariant**: `Optimistic UI Invariant`
- **Supporting Terms & Invariants**: `Optimistic UI (`Instantly writing changes to local SQLite and updating UI immediately, syncing with cloud backend in the background`)`

#### 📱 Runnable Mobile Simulator: `optimistic_ui_demo.js`

```javascript
function getOptimisticUiRule() {
  return 'UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER';
}

console.log(getOptimisticUiRule());
```

**Expected Terminal Output**:
```text
UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do offline-first mobile apps achieve zero perceived UI latency when creating or editing data?*

- **Target Answer**: `UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER`
- **Typed Misconception ID**: `MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'WAIT_FOR_SERVER'**:
  - *What Went Wrong*: Waiting for server causes lag in weak network. Standard is: UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER.
  - *Simpler Mental Model*: Matches UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER.
  - *Guided Fix Action*: Type UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER

---

## 📅 Day 15: ⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 2 Synthesis: The complete intermediate native device integration engine: 1. Asset URI source classification; 2. Stack navigation route parameter validation; 3. Tab bar badge formatting; 4. Keyboard avoiding behavior matching; 5. Biometric readiness auditing; 6. SQLite schema migration resolution.

### 🔹 Block 1: Native Capabilities Master Engine Synthesis

- **Concept Budget / Primary Invariant**: `Native Capabilities Master Engine`
- **Supporting Terms & Invariants**: `Asset Classification Subsystem`, `Stack Navigation Subsystem`, `Tab Badge Subsystem`, `Keyboard Avoiding Subsystem`, `Biometrics Subsystem`, `SQLite Subsystem`

#### 🔄 Mobile Execution Flowchart: Milestone 2 Native Capabilities Pipeline

1. **Classifies local bundled image assets & validates typed navigation routes**
2. **Formats overflow notification tab badges & resolves keyboard avoidance**
3. **Audits hardware FaceID biometrics & executes SQLite schema migrations**
4. **Activates Native Capabilities Master Engine!**

#### 📱 Runnable Mobile Simulator: `native_kernel_demo.js`

```javascript
function runNativeMaster() {
  return {
    assetsSubsystem: 'ONLINE_ASSET_BUNDLER_ACTIVE',
    navigationSubsystem: 'ONLINE_STACK_ROUTER_ACTIVE',
    tabSubsystem: 'ONLINE_BADGE_FORMATTER_ACTIVE',
    keyboardSubsystem: 'ONLINE_AVOIDANCE_MATCHER_ACTIVE',
    biometricsSubsystem: 'ONLINE_FACEID_ACTIVE',
    sqliteSubsystem: 'ONLINE_MIGRATIONS_ACTIVE',
    engineStatus: 'NATIVE_CAPABILITIES_MASTER_ACTIVE'
  };
}

console.log(runNativeMaster().engineStatus);
```

**Expected Terminal Output**:
```text
NATIVE_CAPABILITIES_MASTER_ACTIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the Native Capabilities Master Engine?*

- **Target Answer**: `NATIVE_CAPABILITIES_MASTER_ACTIVE`
- **Typed Misconception ID**: `MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches NATIVE_CAPABILITIES_MASTER_ACTIVE.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type NATIVE_CAPABILITIES_MASTER_ACTIVE

---

### 🔹 Block 2: Native Capabilities Engine Invariant Verification & Precision Audit

- **Concept Budget / Primary Invariant**: `Native Capabilities Invariant Verification`
- **Supporting Terms & Invariants**: `Navigation Invariant`, `SQLite Invariant`, `100% Quality Invariant`

#### 📱 Runnable Mobile Simulator: `native_audit_demo.js`

```javascript
function auditNative(a, n, t, k, b, s) {
  const passed = a && n && t && k && b && s;
  return {
    assetsVerified: a,
    navigationVerified: n,
    tabVerified: t,
    keyboardVerified: k,
    biometricsVerified: b,
    sqliteVerified: s,
    grade: passed ? 'NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditNative(true, true, true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"assetsVerified":true,"navigationVerified":true,"tabVerified":true,"keyboardVerified":true,"biometricsVerified":true,"sqliteVerified":true,"grade":"NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when Assets, Navigation, Tabs, Keyboards, Biometrics, and SQLite pass 100%?*

- **Target Answer**: `NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED.
  - *Guided Fix Action*: Type NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 2 Native Capabilities Certification

- **Concept Budget / Primary Invariant**: `Milestone 2 Certification`
- **Supporting Terms & Invariants**: `Native Capabilities Verified`, `100% Quality Invariant`

#### 📱 Runnable Mobile Simulator: `milestone2_mobile_cert.js`

```javascript
console.log('⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 2 completion?*

- **Target Answer**: `⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]

---

## 📅 Day 16: Reanimated 3: Shared Values, Worklets & UI Thread Animations

> **💡 Everyday Metaphor / Intuitive Model**:
> Reanimated 3 Worklets Are On-Chip Coprocessors: Instead of asking the JavaScript thread to calculate 120 animation frames per second across a crowded bridge, `useSharedValue` loads the animation physics (`withSpring`) directly into the GPU UI thread worklet coprocessor (`'worklet'`), guaranteeing zero stutter even during heavy data fetching.

### 🔹 Block 1: Spring Physics: Calculating Damping Ratio $\zeta = \frac{c}{2 \sqrt{m \cdot k}}$ ($0.5$ Under-Damped Bouncy)

- **Concept Budget / Primary Invariant**: `Reanimated 3 Spring Physics Damping Ratio Calculator`
- **Supporting Terms & Invariants**: `Damping Coefficient ($c = 10$)`, `Mass ($m = 1$)`, `Stiffness ($k = 100$)`, `Damping Ratio ($\zeta = 0.5$)`, `Status: Spring Physics Calculated Nominal`

#### 📦 Memory Box / Data Layout Diagram: Reanimated 3 Spring Damping Physics Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Spring Parameters** | damping: 10, mass: 1, stiffness: 100 | `Params` |
| **Critical Damping (2*sqrt(m*k))** | 2 * sqrt(1 * 100) = 2 * 10 = 20 | `Critical` |
| **Damping Ratio Zeta** | 10 / 20 = 0.5 < 1.0 (BOUNCY SPRING NOMINAL!) | `Zeta` |

#### 📱 Runnable Mobile Simulator: `spring_physics_demo.js`

```javascript
function calcSpringZeta(c, m, k) {
  const crit = 2 * Math.sqrt(m * k);
  const zeta = Number((c / crit).toFixed(2));
  const bouncy = zeta < 1.0;
  return {
    dampingRatioZeta: zeta,
    isUnderDampedBouncy: bouncy,
    status: 'SPRING_PHYSICS_CALCULATED_NOMINAL'
  };
}

console.log(JSON.stringify(calcSpringZeta(10, 1, 100)));
console.log(JSON.stringify(calcSpringZeta(20, 1, 100)));
```

**Expected Terminal Output**:
```text
{"dampingRatioZeta":0.5,"isUnderDampedBouncy":true,"status":"SPRING_PHYSICS_CALCULATED_NOMINAL"}
{"dampingRatioZeta":1,"isUnderDampedBouncy":false,"status":"SPRING_PHYSICS_CALCULATED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the damping ratio zeta for a spring with damping 10, mass 1, and stiffness 100?*

- **Target Answer**: `0.5`
- **Typed Misconception ID**: `MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '1.0'**:
  - *What Went Wrong*: 10 / (2 * sqrt(100)) = 10 / 20 = 0.5.
  - *Simpler Mental Model*: Ratio is 0.5.
  - *Guided Fix Action*: Type 0.5

---

### 🔹 Block 2: The UI Thread Function Directive: `'worklet'`

- **Concept Budget / Primary Invariant**: ``'worklet'` Directive Invariant`
- **Supporting Terms & Invariants**: ``'worklet'` (`The string directive placed at the top of a JS function signaling Reanimated to compile and execute it directly on the 120 FPS UI thread`)`

#### ⚙️ Syntax & Template Anatomy: Reanimated 3 Worklet Syntax

```text
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function AnimatedCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet'; // Runs synchronously on the UI Thread!
    return { transform: [{ scale: scale.value }] };
  });
}
```

- **Line 4**: useSharedValue holds thread-safe animation value.
- **Line 7**: 'worklet' directive executes style calculation directly on UI thread.

#### 📱 Runnable Mobile Simulator: `worklet_directive_demo.js`

```javascript
function getWorklet() {
  return 'worklet';
}

console.log(getWorklet());
```

**Expected Terminal Output**:
```text
worklet
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What string directive marks a function for execution on the UI thread in Reanimated?*

- **Target Answer**: `worklet`
- **Typed Misconception ID**: `MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'use worklet'**:
  - *What Went Wrong*: The exact Reanimated directive is 'worklet'.
  - *Simpler Mental Model*: Type worklet.
  - *Guided Fix Action*: Type worklet

---

### 🔹 Block 3: Thread Safety: Modifying `.value` on Shared Values Without React State Re-renders

- **Concept Budget / Primary Invariant**: `Shared Value Invariant`
- **Supporting Terms & Invariants**: ``useSharedValue` (`Mutating 'scale.value' updates the UI thread directly without triggering costly React component re-render reconciliation passes`)`

#### 📱 Runnable Mobile Simulator: `shared_value_demo.js`

```javascript
function getSharedValueRule() {
  return 'MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS';
}

console.log(getSharedValueRule());
```

**Expected Terminal Output**:
```text
MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do Reanimated shared values achieve 120 FPS performance compared to standard useState hooks?*

- **Target Answer**: `MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS`
- **Typed Misconception ID**: `MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'RE_RENDERS_EVERY_FRAME'**:
  - *What Went Wrong*: Shared values bypass React render cycles: MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS.
  - *Simpler Mental Model*: Matches MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS.
  - *Guided Fix Action*: Type MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS

---

## 📅 Day 17: Gesture Handler: Pan, Pinch, Tap & Swipe Physics

> **💡 Everyday Metaphor / Intuitive Model**:
> Swipe-to-Dismiss Is an Air-Hockey Puck: If you slide the puck slowly past the halfway line ($|t_x| > 100\text{px}$) OR flick it with high explosive wrist velocity ($|v_x| > 500\text{px/s}$), the puck flies into the goal (`SWIPE_DISMISS_TRIGGERED_NOMINAL`); otherwise, the rubber bumper snaps it back to center.

### 🔹 Block 1: Gesture Physics: Classifying Distance ($>100\text{px}$) & Velocity ($>500\text{px/s}$) Dismissal

- **Concept Budget / Primary Invariant**: `Pan Gesture Swipe Velocity Threshold Classifier`
- **Supporting Terms & Invariants**: `Translation X ($-120\text{px}$)`, `Velocity X ($-800\text{px/s}$)`, `Dismiss Thresholds`, `Status: Swipe Dismiss Triggered Nominal`

#### 📦 Memory Box / Data Layout Diagram: Pan Gesture Physics Threshold Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Distance Condition** | |tx: -120px| > 100px threshold -> DISMISS TRIGGERED | `Distance` |
| **Velocity Condition** | |vx: -800px/s| > 500px/s threshold -> FLICK DISMISS TRIGGERED | `Velocity` |
| **Gesture Resolution** | SWIPE DISMISS TRIGGERED NOMINAL (NATURAL INERTIA VERIFIED!) | `Status` |

#### 📱 Runnable Mobile Simulator: `gesture_velocity_demo.js`

```javascript
function classifySwipe(tx, vx, threshDist, threshVel) {
  const ok = Math.abs(tx) > threshDist || Math.abs(vx) > threshVel;
  return {
    translationX: tx,
    velocityX: vx,
    isDismissTriggered: ok,
    status: ok ? 'SWIPE_DISMISS_TRIGGERED_NOMINAL' : 'SWIPE_REVERTED_TO_ORIGIN'
  };
}

console.log(JSON.stringify(classifySwipe(-120, 100, 100, 500)));
console.log(JSON.stringify(classifySwipe(-30, -800, 100, 500)));
```

**Expected Terminal Output**:
```text
{"translationX":-120,"velocityX":100,"isDismissTriggered":true,"status":"SWIPE_DISMISS_TRIGGERED_NOMINAL"}
{"translationX":-30,"velocityX":-800,"isDismissTriggered":true,"status":"SWIPE_DISMISS_TRIGGERED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a swipe gesture exceeded distance or velocity thresholds for item deletion?*

- **Target Answer**: `SWIPE_DISMISS_TRIGGERED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SWIPE_REVERTED_TO_ORIGIN'**:
  - *What Went Wrong*: Both tests exceed threshold: SWIPE_DISMISS_TRIGGERED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type SWIPE_DISMISS_TRIGGERED_NOMINAL

---

### 🔹 Block 2: The Mandatory Root Wrapper: `GestureHandlerRootView`

- **Concept Budget / Primary Invariant**: ``GestureHandlerRootView` Invariant`
- **Supporting Terms & Invariants**: ``GestureHandlerRootView` (`The root container component required at the very top of your app tree to capture native touch responder events`)`

#### ⚙️ Syntax & Template Anatomy: GestureHandlerRootView Setup

```text
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
```

- **Line 1**: Import GestureHandlerRootView.
- **Line 5**: Wrap root app with style={{ flex: 1 }} to receive all touch physics.

#### 📱 Runnable Mobile Simulator: `gesture_root_demo.js`

```javascript
function getGestureRoot() {
  return 'GestureHandlerRootView';
}

console.log(getGestureRoot());
```

**Expected Terminal Output**:
```text
GestureHandlerRootView
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What root component must wrap a React Native application to enable native gesture handling?*

- **Target Answer**: `GestureHandlerRootView`
- **Typed Misconception ID**: `MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'View'**:
  - *What Went Wrong*: Standard View cannot route native gestures. Use GestureHandlerRootView.
  - *Simpler Mental Model*: Type GestureHandlerRootView.
  - *Guided Fix Action*: Type GestureHandlerRootView

---

### 🔹 Block 3: Gesture Composition: Combining Simultaneous Gestures with `Gesture.Simultaneous()`

- **Concept Budget / Primary Invariant**: `Gesture Composition Invariant`
- **Supporting Terms & Invariants**: ``Gesture.Simultaneous()` (`Allows a user to pinch-to-zoom and pan/drag an image at the exact same instant without gesture cancellations`)`

#### 📱 Runnable Mobile Simulator: `simultaneous_gesture_demo.js`

```javascript
function getGestureCompositionRule() {
  return 'USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION';
}

console.log(getGestureCompositionRule());
```

**Expected Terminal Output**:
```text
USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do mobile applications allow simultaneous pinch-zoom and pan dragging on photos?*

- **Target Answer**: `USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION`
- **Typed Misconception ID**: `MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'EXCLUSIVE_GESTURES'**:
  - *What Went Wrong*: Standard is: USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION.
  - *Simpler Mental Model*: Matches USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION.
  - *Guided Fix Action*: Type USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION

---

## 📅 Day 18: High-Performance Virtualized Lists: FlatList & FlashList Optimization

> **💡 Everyday Metaphor / Intuitive Model**:
> FlatList getItemLayout Is an Elevator with a Pre-Calculated Floor Height: If every floor is exactly $60\text{px}$ high, jumping to floor 10 doesn't require measuring every ceiling along the way; the elevator instantly multiplies ($60\text{px} \times 10 = 600\text{px}$), teleporting to the exact scroll offset in 0 milliseconds.

### 🔹 Block 1: List Optimization: Calculating `getItemLayout` Offset ($60\text{px} \times 10 = 600\text{px}$)

- **Concept Budget / Primary Invariant**: `FlatList getItemLayout Offset Calculator`
- **Supporting Terms & Invariants**: `Item Length ($60\text{px}$)`, `Row Index ($10$)`, `Computed Offset ($600\text{px}$)`, `Zero Dynamic Measurement Overhead`, `Status: Get Item Layout Computed Nominal`

#### 📦 Memory Box / Data Layout Diagram: FlatList getItemLayout Math Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Fixed Item Height** | length = 60px (Standard list item row height) | `Length` |
| **Target Row Index** | index = 10 (Target item in 10,000 row list) | `Index` |
| **Calculated Offset** | offset = 60 * 10 = 600px (COMPUTED NOMINAL - 0 MS LAG!) | `Offset` |

#### 📱 Runnable Mobile Simulator: `item_layout_demo.js`

```javascript
function calcItemLayout(itemH, idx) {
  return {
    length: itemH,
    offset: itemH * idx,
    index: idx,
    status: 'GET_ITEM_LAYOUT_COMPUTED_NOMINAL'
  };
}

console.log(JSON.stringify(calcItemLayout(60, 10)));
```

**Expected Terminal Output**:
```text
{"length":60,"offset":600,"index":10,"status":"GET_ITEM_LAYOUT_COMPUTED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What scroll offset is calculated for item index 10 with a fixed row height of 60px?*

- **Target Answer**: `600`
- **Typed Misconception ID**: `MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '60'**:
  - *What Went Wrong*: Offset = itemHeight * index = 60 * 10 = 600.
  - *Simpler Mental Model*: Offset is 600.
  - *Guided Fix Action*: Type 600

---

### 🔹 Block 2: The High-Performance Recycled List Engine: `FlashList`

- **Concept Budget / Primary Invariant**: ``FlashList` Invariant`
- **Supporting Terms & Invariants**: ``FlashList` (`Shopify's recycling virtualization list component that reuses existing native views rather than destroying and recreating them, achieving 5x higher FPS`)`

#### ⚙️ Syntax & Template Anatomy: Shopify FlashList Setup

```text
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={largeDataset}
  estimatedItemSize={60}
  renderItem={({ item }) => <UserRow user={item} />}
/>
```

- **Line 1**: Import FlashList from @shopify/flash-list.
- **Line 5**: estimatedItemSize enables native view recycling.

#### 📱 Runnable Mobile Simulator: `flashlist_name_demo.js`

```javascript
function getFlashListEngine() {
  return 'FlashList';
}

console.log(getFlashListEngine());
```

**Expected Terminal Output**:
```text
FlashList
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What high-speed recycled list component was developed by Shopify for React Native?*

- **Target Answer**: `FlashList`
- **Typed Misconception ID**: `MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'ScrollView'**:
  - *What Went Wrong*: ScrollView renders all items at once. Shopify's recycling list is FlashList.
  - *Simpler Mental Model*: Type FlashList.
  - *Guided Fix Action*: Type FlashList

---

### 🔹 Block 3: Memory Invariant: Never Writing Inline Arrow Functions for `renderItem`

- **Concept Budget / Primary Invariant**: ``renderItem` Invariant`
- **Supporting Terms & Invariants**: `Stable Callback Invariant (`Declaring 'renderItem' as a useCallback or stable top-level function prevents FlatList from recreating item templates on every parent re-render`)`

#### 📱 Runnable Mobile Simulator: `render_item_rule_demo.js`

```javascript
function getRenderItemRule() {
  return 'MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS';
}

console.log(getRenderItemRule());
```

**Expected Terminal Output**:
```text
MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why should renderItem callbacks in virtualized lists be memoized with useCallback?*

- **Target Answer**: `MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS`
- **Typed Misconception ID**: `MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'INLINE_IS_FAST'**:
  - *What Went Wrong*: Inline functions trigger full row re-renders. Standard is: MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS.
  - *Simpler Mental Model*: Matches MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS.
  - *Guided Fix Action*: Type MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS

---

## 📅 Day 19: Deep Linking, Universal Links & App Links: `myapp://` Scheme

> **💡 Everyday Metaphor / Intuitive Model**:
> Deep Linking Is a Postal Routing Label on an Inbound Package: Clicking a link in a mobile browser (`pinit://course/mobile-dev?day=19`) instructs the OS to bypass the browser, launch the PinIT mobile app directly, and route the user immediately to Day 19 of the Mobile Dev course.

### 🔹 Block 1: Deep Linking: Parsing `pinit://course/mobile-dev` Scheme & Screen Params

- **Concept Budget / Primary Invariant**: `Deep Link URL Scheme Parser & Screen Param Extractor`
- **Supporting Terms & Invariants**: `Custom Scheme (`'pinit'`)`, `Target Screen (`'course'`)`, `Route ID (`'mobile-dev'`)`, `Status: Deep Link Parsed Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Deep Link Routing Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Raw URL String** | pinit://course/mobile-dev?day=19 (Inbound external link) | `Raw Link` |
| **Parsed Scheme & Target** | scheme: 'pinit' | targetScreen: 'course' | routeId: 'mobile-dev' | `Parsed` |
| **Routing Status** | DEEP LINK PARSED NOMINAL (INBOUND ROUTING ACTIVE!) | `Status` |

#### 📱 Runnable Mobile Simulator: `deep_link_demo.js`

```javascript
function parseLink(url) {
  const parts = url.split('://');
  const scheme = parts[0];
  const rest = parts[1] || '';
  const [path] = rest.split('?');
  const [screen, id] = path.split('/');
  return {
    scheme,
    targetScreen: screen,
    routeId: id || null,
    status: 'DEEP_LINK_PARSED_NOMINAL'
  };
}

console.log(JSON.stringify(parseLink('pinit://course/mobile-dev?day=19')));
```

**Expected Terminal Output**:
```text
{"scheme":"pinit","targetScreen":"course","routeId":"mobile-dev","status":"DEEP_LINK_PARSED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What routeId is extracted from 'pinit://course/mobile-dev?day=19'?*

- **Target Answer**: `mobile-dev`
- **Typed Misconception ID**: `MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'course'**:
  - *What Went Wrong*: 'course' is targetScreen. 'mobile-dev' is routeId.
  - *Simpler Mental Model*: routeId is mobile-dev.
  - *Guided Fix Action*: Type mobile-dev

---

### 🔹 Block 2: The iOS Universal Links Association File: `apple-app-site-association`

- **Concept Budget / Primary Invariant**: `AASA File Invariant`
- **Supporting Terms & Invariants**: ``apple-app-site-association` (`The JSON file hosted at https://yourdomain.com/.well-known/apple-app-site-association that cryptographically proves your app owns the domain`)`

#### ⚙️ Syntax & Template Anatomy: AASA JSON File Structure

```text
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID123.com.pinit.career",
        "paths": [ "/course/*", "/quests/*" ]
      }
    ]
  }
}
```

- **Line 5**: appID binds Apple Team ID to Bundle Identifier.
- **Line 6**: paths declares deep-linkable URL patterns.

#### 📱 Runnable Mobile Simulator: `aasa_filename_demo.js`

```javascript
function getAasaFilename() {
  return 'apple-app-site-association';
}

console.log(getAasaFilename());
```

**Expected Terminal Output**:
```text
apple-app-site-association
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the exact name of the configuration file hosted on web servers for iOS Universal Links?*

- **Target Answer**: `apple-app-site-association`
- **Typed Misconception ID**: `MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'assetlinks.json'**:
  - *What Went Wrong*: assetlinks.json is for Android App Links. iOS uses apple-app-site-association (with no .json extension).
  - *Simpler Mental Model*: Type apple-app-site-association.
  - *Guided Fix Action*: Type apple-app-site-association

---

### 🔹 Block 3: Security: Why HTTPS Universal Links are Superior to Custom URL Schemes

- **Concept Budget / Primary Invariant**: `Universal Links Security Invariant`
- **Supporting Terms & Invariants**: `Universal Links (`HTTPS Universal Links cannot be hijacked by malicious rogue apps because domain ownership is verified via TLS certificates`)`

#### 📱 Runnable Mobile Simulator: `universal_links_demo.js`

```javascript
function getDeepLinkSecurityRule() {
  return 'PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING';
}

console.log(getDeepLinkSecurityRule());
```

**Expected Terminal Output**:
```text
PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why are HTTPS Universal Links more secure than custom URL schemes like myapp://?*

- **Target Answer**: `PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING`
- **Typed Misconception ID**: `MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SCHEMES_ARE_SAME'**:
  - *What Went Wrong*: Any rogue app can register myapp://. Standard is: PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING.
  - *Simpler Mental Model*: Matches PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING.
  - *Guided Fix Action*: Type PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING

---

## 📅 Day 20: Push Notifications Architecture: APNs & FCM Token Registration

> **💡 Everyday Metaphor / Intuitive Model**:
> Push Notifications Are Registered Mobile Mailboxes: When a user installs the app, the device registers with Apple (APNs) or Google (FCM) to generate a unique postal mailbox token (`ExponentPushToken[xxxx]`); the PinIT backend uses this token to push study reminders directly to the user's lock screen.

### 🔹 Block 1: Push Notifications: Validating `ExponentPushToken[...]` Token Format

- **Concept Budget / Primary Invariant**: `Expo Push Token Validation & Channel Formatter`
- **Supporting Terms & Invariants**: `Push Token String (`'ExponentPushToken[xxxxxx_yyyyy]'`)`, `Prefix & Suffix Validation`, `Status: Expo Push Token Validated Nominal`

#### 📦 Memory Box / Data Layout Diagram: Push Notification Device Registration Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **1. Device APNs/FCM Request** | Notifications.getExpoPushTokenAsync() | `Request` |
| **2. Formatted Device Token** | 'ExponentPushToken[xxxxxx_yyyyy]' (Token validated nominal) | `Token` |
| **3. Backend Cloud Registry** | EXPO PUSH TOKEN VALIDATED NOMINAL (REGISTERED FOR DISPATCH!) | `Status` |

#### 📱 Runnable Mobile Simulator: `push_token_demo.js`

```javascript
function validatePushToken(tok) {
  const ok = typeof tok === 'string' && tok.startsWith('ExponentPushToken[') && tok.endsWith(']');
  return {
    pushToken: tok,
    isValidExpoToken: ok,
    status: ok ? 'EXPO_PUSH_TOKEN_VALIDATED_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(validatePushToken('ExponentPushToken[xxxxxx_yyyyy]')));
```

**Expected Terminal Output**:
```text
{"pushToken":"ExponentPushToken[xxxxxx_yyyyy]","isValidExpoToken":true,"status":"EXPO_PUSH_TOKEN_VALIDATED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a device push token has a valid ExponentPushToken format?*

- **Target Answer**: `EXPO_PUSH_TOKEN_VALIDATED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Matches EXPO_PUSH_TOKEN_VALIDATED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type EXPO_PUSH_TOKEN_VALIDATED_NOMINAL

---

### 🔹 Block 2: Android Notification Channels: Mandatory on Android 8.0+ (API 26)

- **Concept Budget / Primary Invariant**: `Notification Channel Invariant`
- **Supporting Terms & Invariants**: `API 26 (`Android 8.0 Oreo introduced mandatory notification channels; notifications without an assigned channel are silently dropped by the OS`)`

#### ⚙️ Syntax & Template Anatomy: Android Notification Channel Setup

```text
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default Notifications',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#3b82f6'
  });
}
```

- **Line 5**: setNotificationChannelAsync creates channel on Android API 26+.
- **Line 7**: AndroidImportance.MAX shows heads-up banner.

#### 📱 Runnable Mobile Simulator: `android_channel_demo.js`

```javascript
function getAndroidChannelApi() {
  return 26;
}

console.log(getAndroidChannelApi());
```

**Expected Terminal Output**:
```text
26
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Starting at what Android API level are notification channels strictly mandatory?*

- **Target Answer**: `26`
- **Typed Misconception ID**: `MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM`

**Diagnostic Recovery Paths**:
- **If Student Triggers '21'**:
  - *What Went Wrong*: Notification channels were introduced in Android 8.0 (API Level 26).
  - *Simpler Mental Model*: Type 26.
  - *Guided Fix Action*: Type 26

---

### 🔹 Block 3: Notification Routing: Navigating to Target Screens on Notification Response

- **Concept Budget / Primary Invariant**: `Notification Response Invariant`
- **Supporting Terms & Invariants**: ``addNotificationResponseReceivedListener` (`Listens for user taps on background notifications, extracting the data payload to navigate directly to the relevant quest screen`)`

#### 📱 Runnable Mobile Simulator: `notification_routing_demo.js`

```javascript
function getNotificationRoutingRule() {
  return 'ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED';
}

console.log(getNotificationRoutingRule());
```

**Expected Terminal Output**:
```text
ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What behavior must mobile applications implement when a user taps a push notification banner?*

- **Target Answer**: `ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED`
- **Typed Misconception ID**: `MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'OPEN_HOME_ONLY'**:
  - *What Went Wrong*: Standard is: ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED.
  - *Simpler Mental Model*: Matches ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED.
  - *Guided Fix Action*: Type ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED

---

## 📅 Day 21: ⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 3 Synthesis: The complete high-performance mobile UI physics and external routing engine: 1. Spring physics damping calculation; 2. Swipe-to-dismiss velocity classification; 3. FlatList getItemLayout computation; 4. Deep link URL parsing; 5. Expo push token validation.

### 🔹 Block 1: Mobile Physics & Routing Master Engine Synthesis

- **Concept Budget / Primary Invariant**: `Mobile Physics & Routing Master Engine`
- **Supporting Terms & Invariants**: `Spring Physics Subsystem`, `Gesture Handler Subsystem`, `Virtualized List Subsystem`, `Deep Linking Subsystem`, `Push Token Subsystem`

#### 🔄 Mobile Execution Flowchart: Milestone 3 Mobile Physics & Routing Pipeline

1. **Calculates under-damped spring physics & audits pan swipe velocities**
2. **Computes fixed-height list layouts & parses deep link URL schemes**
3. **Validates ExponentPushTokens & activates Mobile Physics Master Engine!**

#### 📱 Runnable Mobile Simulator: `physics_kernel_demo.js`

```javascript
function runPhysicsMaster() {
  return {
    springSubsystem: 'ONLINE_SPRING_PHYSICS_ACTIVE',
    gestureSubsystem: 'ONLINE_PAN_PHYSICS_ACTIVE',
    listSubsystem: 'ONLINE_ITEM_LAYOUT_ACTIVE',
    deepLinkSubsystem: 'ONLINE_URL_SCHEME_ACTIVE',
    pushSubsystem: 'ONLINE_EXPO_TOKEN_ACTIVE',
    engineStatus: 'MOBILE_PHYSICS_MASTER_ACTIVE'
  };
}

console.log(runPhysicsMaster().engineStatus);
```

**Expected Terminal Output**:
```text
MOBILE_PHYSICS_MASTER_ACTIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the Mobile Physics & Routing Master Engine?*

- **Target Answer**: `MOBILE_PHYSICS_MASTER_ACTIVE`
- **Typed Misconception ID**: `MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches MOBILE_PHYSICS_MASTER_ACTIVE.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type MOBILE_PHYSICS_MASTER_ACTIVE

---

### 🔹 Block 2: Mobile Physics Engine Invariant Verification & Precision Audit

- **Concept Budget / Primary Invariant**: `Mobile Physics Invariant Verification`
- **Supporting Terms & Invariants**: `Physics Invariant`, `Routing Invariant`, `100% Quality Invariant`

#### 📱 Runnable Mobile Simulator: `physics_audit_demo.js`

```javascript
function auditPhysics(s, g, l, d, p) {
  const passed = s && g && l && d && p;
  return {
    springVerified: s,
    gesturesVerified: g,
    listVerified: l,
    deepLinksVerified: d,
    pushVerified: p,
    grade: passed ? 'MOBILE_PHYSICS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditPhysics(true, true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"springVerified":true,"gesturesVerified":true,"listVerified":true,"deepLinksVerified":true,"pushVerified":true,"grade":"MOBILE_PHYSICS_ENGINE_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when Spring Physics, Gestures, Lists, Deep Links, and Push Tokens pass 100%?*

- **Target Answer**: `MOBILE_PHYSICS_ENGINE_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards MOBILE_PHYSICS_ENGINE_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards MOBILE_PHYSICS_ENGINE_AUDIT_PASSED.
  - *Guided Fix Action*: Type MOBILE_PHYSICS_ENGINE_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 3 Mobile Physics & Routing Certification

- **Concept Budget / Primary Invariant**: `Milestone 3 Certification`
- **Supporting Terms & Invariants**: `Mobile Physics Verified`, `100% Quality Invariant`

#### 📱 Runnable Mobile Simulator: `milestone3_mobile_cert.js`

```javascript
console.log('⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 3 completion?*

- **Target Answer**: `⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]

---

## 📅 Day 22: Native Modules & TurboModules: Writing C++ / Kotlin / Swift JSI Bridges

> **💡 Everyday Metaphor / Intuitive Model**:
> TurboModules Are Direct Native C++ Pipes: While legacy native modules forced data to wait in an asynchronous JSON staging area, TurboModules instantiate C++ Host Objects directly in the JS global scope (`JSI`), allowing JavaScript to invoke low-level cryptography or DSP algorithms synchronously in nanoseconds.

### 🔹 Block 1: TurboModules: Verifying Codegen Specification (`TURBOMODULE_SPEC_VERIFIED_NOMINAL`)

- **Concept Budget / Primary Invariant**: `TurboModule Codegen Specification Type Verifier`
- **Supporting Terms & Invariants**: `TurboModule Name (`'NativeMathTurboModule'`)`, `Exported Native Methods (`['multiply', 'computeFastHash']`)`, `Status: TurboModule Spec Verified Nominal`

#### 📦 Memory Box / Data Layout Diagram: New Architecture TurboModule Spec Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Codegen Spec File** | NativeMathTurboModule.ts (TypeScript interface contract) | `Spec Interface` |
| **C++ JSI Host Object** | Direct memory method binding: multiply(a, b) -> synchronous C++ | `Host Object` |
| **Verification Status** | TURBOMODULE SPEC VERIFIED NOMINAL (NANOSECOND JSI BRIDGING!) | `Status` |

#### 📱 Runnable Mobile Simulator: `turbomodule_spec_demo.js`

```javascript
function verifySpec(name, methods) {
  const ok = typeof name === 'string' && Array.isArray(methods) && methods.length > 0;
  return {
    moduleName: name,
    exportedMethods: methods,
    isTurboModuleValid: ok,
    status: ok ? 'TURBOMODULE_SPEC_VERIFIED_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(verifySpec('NativeMathTurboModule', ['multiply', 'computeFastHash'])));
```

**Expected Terminal Output**:
```text
{"moduleName":"NativeMathTurboModule","exportedMethods":["multiply","computeFastHash"],"isTurboModuleValid":true,"status":"TURBOMODULE_SPEC_VERIFIED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a TurboModule specification adheres to Codegen architecture standards?*

- **Target Answer**: `TURBOMODULE_SPEC_VERIFIED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Matches TURBOMODULE_SPEC_VERIFIED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type TURBOMODULE_SPEC_VERIFIED_NOMINAL

---

### 🔹 Block 2: The New Architecture Direct Memory Engine: `JSI`

- **Concept Budget / Primary Invariant**: `JSI Engine Invariant`
- **Supporting Terms & Invariants**: ``JSI` (`JavaScript Interface: The lightweight C++ abstraction layer that enables JavaScript to hold direct references to C++ Host Objects`)`

#### ⚙️ Syntax & Template Anatomy: TurboModule Codegen Spec

```text
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readonly multiply: (a: number, b: number) => number;
  readonly computeFastHash: (input: string) => Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeMath');
```

- **Line 4**: Spec interface extends TurboModule.
- **Line 5**: Synchronous direct C++ method call.
- **Line 9**: TurboModuleRegistry enforces JSI binding.

#### 📱 Runnable Mobile Simulator: `jsi_bridge_demo.js`

```javascript
function getNewArchBridge() {
  return 'JSI';
}

console.log(getNewArchBridge());
```

**Expected Terminal Output**:
```text
JSI
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the acronym for the direct C++ memory interface powering React Native's New Architecture?*

- **Target Answer**: `JSI`
- **Typed Misconception ID**: `MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'Bridge'**:
  - *What Went Wrong*: Legacy bridge used JSON queues. New architecture uses JSI.
  - *Simpler Mental Model*: Type JSI.
  - *Guided Fix Action*: Type JSI

---

### 🔹 Block 3: Codegen Guarantee: Zero-Cost Static Typing Between TypeScript & Native C++

- **Concept Budget / Primary Invariant**: `Codegen Invariant`
- **Supporting Terms & Invariants**: `Codegen (`Automatically generates C++ and Objective-C/Java scaffolding from TypeScript spec files at build time, ensuring 100% type safety across native boundaries`)`

#### 📱 Runnable Mobile Simulator: `codegen_rule_demo.js`

```javascript
function getCodegenRule() {
  return 'CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE';
}

console.log(getCodegenRule());
```

**Expected Terminal Output**:
```text
CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What build-time tool enforces type safety between JavaScript and native C++ code in TurboModules?*

- **Target Answer**: `CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE`
- **Typed Misconception ID**: `MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'MANUAL_CASTING'**:
  - *What Went Wrong*: Standard is: CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE.
  - *Simpler Mental Model*: Matches CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE.
  - *Guided Fix Action*: Type CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE

---

## 📅 Day 23: Background Tasks & App Lifecycle: AppState & Headless JS

> **💡 Everyday Metaphor / Intuitive Model**:
> AppState Is a Smartphone Sentry Guard: When the user minimizes the app to take a phone call (`'active' -> 'background'`), the sentry instantly detects the transition, triggers an emergency auto-save of open form drafts (`triggerBackgroundPersist: true`), and safely pauses resource-heavy timers before the OS freezes the process.

### 🔹 Block 1: App Lifecycle: Handling `active \to background` Transition & Auto-Persistence

- **Concept Budget / Primary Invariant**: `AppState Lifecycle Transition Handler`
- **Supporting Terms & Invariants**: `Previous State (`'active'`)`, `Current State (`'background'`)`, `Auto-Persist Trigger (`triggerBackgroundPersist: true`)`, `Status: App State Transition Handled Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile AppState Lifecycle State Machine Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **1. Active State** | App is running in foreground with user interaction | `Foreground` |
| **2. Transition to Background** | AppState.addEventListener('change') fires ('active' -> 'background') | `Event` |
| **3. Auto-Persist Trigger** | triggerBackgroundPersist = true (HANDLED NOMINAL - ZERO DATA LOSS!) | `Persist` |

#### 📱 Runnable Mobile Simulator: `app_state_demo.js`

```javascript
function handleStateTransition(prev, next) {
  const persist = prev === 'active' && next === 'background';
  return {
    previousState: prev,
    currentState: next,
    triggerBackgroundPersist: persist,
    status: 'APP_STATE_TRANSITION_HANDLED_NOMINAL'
  };
}

console.log(JSON.stringify(handleStateTransition('active', 'background')));
console.log(JSON.stringify(handleStateTransition('background', 'active')));
```

**Expected Terminal Output**:
```text
{"previousState":"active","currentState":"background","triggerBackgroundPersist":true,"status":"APP_STATE_TRANSITION_HANDLED_NOMINAL"}
{"previousState":"background","currentState":"active","triggerBackgroundPersist":false,"status":"APP_STATE_TRANSITION_HANDLED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Does moving from 'active' to 'background' trigger background persistence in the AppState transition handler?*

- **Target Answer**: `true`
- **Typed Misconception ID**: `MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'false'**:
  - *What Went Wrong*: Moving to background MUST trigger auto-save before the OS suspends memory.
  - *Simpler Mental Model*: Output is true.
  - *Guided Fix Action*: Type true

---

### 🔹 Block 2: The Foreground AppState Value: `'active'`

- **Concept Budget / Primary Invariant**: ``'active'` AppState Invariant`
- **Supporting Terms & Invariants**: ``'active'` (`Indicates the application is running in the foreground and currently receiving user touch and keyboard events`)`

#### ⚙️ Syntax & Template Anatomy: AppState Listener Setup

```text
import { AppState } from 'react-native';
import { useEffect } from 'react';

useEffect(() => {
  const sub = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      console.log('App has returned to the foreground!');
    }
  });
  return () => sub.remove();
}, []);
```

- **Line 4**: Listen for OS app state changes.
- **Line 5**: Check for active foreground state.
- **Line 9**: Unsubscribe listener to prevent memory leaks.

#### 📱 Runnable Mobile Simulator: `active_state_demo.js`

```javascript
function getActiveState() {
  return 'active';
}

console.log(getActiveState());
```

**Expected Terminal Output**:
```text
active
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What AppState string value represents an app running in the active foreground?*

- **Target Answer**: `active`
- **Typed Misconception ID**: `MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'foreground'**:
  - *What Went Wrong*: React Native uses 'active', 'background', and 'inactive' (on iOS).
  - *Simpler Mental Model*: Type active.
  - *Guided Fix Action*: Type active

---

### 🔹 Block 3: Background Processing: Headless JS Tasks on Android

- **Concept Budget / Primary Invariant**: `Headless JS Invariant`
- **Supporting Terms & Invariants**: `Headless JS (`Allows running JavaScript tasks in the background on Android even when the app UI activity is completely closed`)`

#### 📱 Runnable Mobile Simulator: `headless_js_demo.js`

```javascript
function getHeadlessRule() {
  return 'USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI';
}

console.log(getHeadlessRule());
```

**Expected Terminal Output**:
```text
USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What mechanism allows running background JavaScript tasks on Android without launching the app UI?*

- **Target Answer**: `USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI`
- **Typed Misconception ID**: `MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'RUN_WEB_WORKER'**:
  - *What Went Wrong*: Standard is: USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI.
  - *Simpler Mental Model*: Matches USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI.
  - *Guided Fix Action*: Type USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI

---

## 📅 Day 24: Battery & Memory Optimization: Profiling Hermes Heap Memory Leaks

> **💡 Everyday Metaphor / Intuitive Model**:
> Hermes Heap Profiling Is a Water Meter on an Apartment Complex: If your JavaScript heap allocation is $45\text{MB}$ against a $150\text{MB}$ safe threshold, water flows normally (`HERMES_HEAP_MEMORY_NOMINAL`); if an uncleaned timer leaks memory until consumption hits $220\text{MB}$, the emergency valve shuts down the process to prevent an OS Out-Of-Memory (OOM) crash.

### 🔹 Block 1: Memory Profiling: Auditing Hermes Heap Memory ($45\text{MB} \le 150\text{MB}$ Ceiling Passing)

- **Concept Budget / Primary Invariant**: `Hermes Heap Memory Footprint Evaluator`
- **Supporting Terms & Invariants**: `Allocated Heap ($45\text{MB}$ vs $220\text{MB}$)`, `Safe Memory Ceiling ($150\text{MB}$)`, `Memory Status`, `Status: Hermes Heap Memory Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Hermes Heap Allocation Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **App Heap Allocation A** | heap: 45MB <= 150MB ceiling -> MEMORY NOMINAL (HEALTHY RUNTIME!) | `Healthy Heap` |
| **App Heap Allocation B** | heap: 220MB > 150MB ceiling -> OOM CRASH RISK DETECTED | `Leaking Heap` |
| **Audit Resolution** | HERMES HEAP MEMORY NOMINAL (ZERO CLOSURE RETAIN CYCLES!) | `Status` |

#### 📱 Runnable Mobile Simulator: `memory_leak_demo.js`

```javascript
function evalMemory(heapMb, maxMb) {
  const ok = heapMb <= maxMb;
  return {
    currentHeapMb: heapMb,
    isMemoryNominal: ok,
    status: ok ? 'HERMES_HEAP_MEMORY_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(evalMemory(45, 150)));
console.log(JSON.stringify(evalMemory(220, 150)));
```

**Expected Terminal Output**:
```text
{"currentHeapMb":45,"isMemoryNominal":true,"status":"HERMES_HEAP_MEMORY_NOMINAL"}
{"currentHeapMb":220,"isMemoryNominal":false,"status":"DEFECT"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a mobile app's Hermes heap memory remains within the safe 150MB ceiling?*

- **Target Answer**: `HERMES_HEAP_MEMORY_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_BATTERY_MEMORY_HERMES_PROFILING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: 45MB <= 150MB produces HERMES_HEAP_MEMORY_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type HERMES_HEAP_MEMORY_NOMINAL

---

### 🔹 Block 2: The Standard Mobile Safe Heap Ceiling: 150MB

- **Concept Budget / Primary Invariant**: `150MB Safe Ceiling Invariant`
- **Supporting Terms & Invariants**: `150MB Threshold (`The industry standard safe memory budget for high-performance React Native mobile applications to prevent OOM termination on budget devices`)`

#### ⚙️ Syntax & Template Anatomy: Hermes Heap Profiling

```text
// In Chrome DevTools / Flipper:
// 1. Record Heap Snapshot
// 2. Filter by 'Retained Size'
// 3. Keep total JS heap <= 150 MB for crash-free reliability across all devices
```

- **Line 2**: Heap snapshot captures all memory objects.
- **Line 4**: Target allocation budget: <= 150MB.

#### 📱 Runnable Mobile Simulator: `heap_ceiling_demo.js`

```javascript
function getHeapCeiling() {
  return 150;
}

console.log(getHeapCeiling());
```

**Expected Terminal Output**:
```text
150
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the recommended maximum safe JavaScript heap memory budget in megabytes (MB) on mobile?*

- **Target Answer**: `150`
- **Typed Misconception ID**: `MC_MOB_BATTERY_MEMORY_HERMES_PROFILING`

**Diagnostic Recovery Paths**:
- **If Student Triggers '2000'**:
  - *What Went Wrong*: 2GB is desktop scale. Mobile OS kills apps exceeding ~150-200MB.
  - *Simpler Mental Model*: Type 150.
  - *Guided Fix Action*: Type 150

---

### 🔹 Block 3: Memory Leaks: Always Cleaning Up Event Listeners and Timers in `useEffect`

- **Concept Budget / Primary Invariant**: `Cleanup Function Invariant`
- **Supporting Terms & Invariants**: ``useEffect` Cleanup (`Returning a cleanup function that cancels setInterval and removes native event subscriptions prevents abandoned closures from retaining memory`)`

#### 📱 Runnable Mobile Simulator: `cleanup_leak_demo.js`

```javascript
function getMemoryLeakRule() {
  return 'ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS';
}

console.log(getMemoryLeakRule());
```

**Expected Terminal Output**:
```text
ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do React Native developers prevent retain cycle memory leaks when using subscriptions or timers?*

- **Target Answer**: `ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS`
- **Typed Misconception ID**: `MC_MOB_BATTERY_MEMORY_HERMES_PROFILING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'LEAVE_LISTENERS'**:
  - *What Went Wrong*: Standard is: ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS.
  - *Simpler Mental Model*: Matches ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS.
  - *Guided Fix Action*: Type ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS

---

## 📅 Day 25: Mobile Security & Keychain Storage: EncryptedSharedPreferences & Keychain

> **💡 Everyday Metaphor / Intuitive Model**:
> Expo SecureStore Is a Bank Safe Deposit Box: Unencrypted storage (AsyncStorage) is a notepad left open on a coffee shop table; `expo-secure-store` encrypts sensitive OAuth tokens with AES-256 GCM inside the iPhone's hardware Secure Enclave (`Keychain`) and Android Keystore, protecting credentials even on rooted devices.

### 🔹 Block 1: Mobile Security: Routing Sensitive Tokens to `HARDWARE_KEYCHAIN_SECURE_STORE`

- **Concept Budget / Primary Invariant**: `Secure Store Key-Value Payload Auditor`
- **Supporting Terms & Invariants**: `Key Name (`'auth_refresh_token'`)`, `Sensitive Data Classification (`true`)`, `Storage Target (`'HARDWARE_KEYCHAIN_SECURE_STORE'`)`, `Status: Secure Store Target Resolved Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Hardware Cryptographic Storage Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **auth_refresh_token** | Sensitive OAuth credential -> Routed to HARDWARE_KEYCHAIN_SECURE_STORE | `Hardware Vault` |
| **app_theme_mode** | Non-sensitive UI setting -> Routed to STANDARD_STORAGE | `Plain Disk` |
| **Security Resolution** | SECURE STORE TARGET RESOLVED NOMINAL (AES-256 HARDWARE BACKED!) | `Status` |

#### 📱 Runnable Mobile Simulator: `secure_store_demo.js`

```javascript
function auditStoreKey(key, val) {
  const sensitive = key.includes('token') || key.includes('secret') || key.includes('key');
  return {
    keyName: key,
    storageTarget: sensitive ? 'HARDWARE_KEYCHAIN_SECURE_STORE' : 'STANDARD_STORAGE',
    status: 'SECURE_STORE_TARGET_RESOLVED_NOMINAL'
  };
}

console.log(JSON.stringify(auditStoreKey('auth_refresh_token', 'secret123')));
console.log(JSON.stringify(auditStoreKey('app_theme_mode', 'dark')));
```

**Expected Terminal Output**:
```text
{"keyName":"auth_refresh_token","storageTarget":"HARDWARE_KEYCHAIN_SECURE_STORE","status":"SECURE_STORE_TARGET_RESOLVED_NOMINAL"}
{"keyName":"app_theme_mode","storageTarget":"STANDARD_STORAGE","status":"SECURE_STORE_TARGET_RESOLVED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What storage target is assigned to sensitive keys like auth_refresh_token?*

- **Target Answer**: `HARDWARE_KEYCHAIN_SECURE_STORE`
- **Typed Misconception ID**: `MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'STANDARD_STORAGE'**:
  - *What Went Wrong*: Sensitive tokens must NEVER be stored in standard storage. Target is HARDWARE_KEYCHAIN_SECURE_STORE.
  - *Simpler Mental Model*: Target is HARDWARE_KEYCHAIN_SECURE_STORE.
  - *Guided Fix Action*: Type HARDWARE_KEYCHAIN_SECURE_STORE

---

### 🔹 Block 2: The iOS Hardware Secure Storage Subsystem: `Keychain`

- **Concept Budget / Primary Invariant**: `iOS Keychain Invariant`
- **Supporting Terms & Invariants**: ``Keychain` (`Apple's encrypted hardware-backed database for securely storing passwords, private keys, and authentication certificates`)`

#### ⚙️ Syntax & Template Anatomy: expo-secure-store API

```text
import * as SecureStore from 'expo-secure-store';

// Write to iOS Keychain / Android Keystore:
await SecureStore.setItemAsync('user_token', 'jwt_xyz_123', {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
});

// Read token:
const token = await SecureStore.getItemAsync('user_token');
```

- **Line 4**: Stores token with hardware encryption.
- **Line 5**: WHEN_UNLOCKED_THIS_DEVICE_ONLY prevents export to cloud backups.

#### 📱 Runnable Mobile Simulator: `keychain_name_demo.js`

```javascript
function getIosStorage() {
  return 'Keychain';
}

console.log(getIosStorage());
```

**Expected Terminal Output**:
```text
Keychain
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the name of Apple's secure hardware-backed encrypted storage subsystem?*

- **Target Answer**: `Keychain`
- **Typed Misconception ID**: `MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'UserDefaults'**:
  - *What Went Wrong*: UserDefaults is plaintext. Secure storage on iOS is Keychain.
  - *Simpler Mental Model*: Type Keychain.
  - *Guided Fix Action*: Type Keychain

---

### 🔹 Block 3: Vulnerability Alert: Never Storing Sensitive JWTs in Unencrypted AsyncStorage

- **Concept Budget / Primary Invariant**: `Plaintext Token Storage Vulnerability`
- **Supporting Terms & Invariants**: `AsyncStorage Vulnerability (`AsyncStorage stores data in plaintext SQLite / XML files that any rooted device or malicious sidecar app can easily inspect and steal`)`

#### 📱 Runnable Mobile Simulator: `security_vulnerability_demo.js`

```javascript
function getSecurityStorageRule() {
  return 'NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE';
}

console.log(getSecurityStorageRule());
```

**Expected Terminal Output**:
```text
NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What critical security rule governs the storage of OAuth tokens in mobile applications?*

- **Target Answer**: `NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE`
- **Typed Misconception ID**: `MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'ASYNC_STORAGE_IS_SAFE'**:
  - *What Went Wrong*: Standard is: NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE.
  - *Simpler Mental Model*: Matches NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE.
  - *Guided Fix Action*: Type NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE

---

## 📅 Day 26: Mobile Accessibility: Screen Readers VoiceOver & TalkBack Optimization

> **💡 Everyday Metaphor / Intuitive Model**:
> Accessibility Props Are Braille Labels on Elevator Buttons: A sighted user sees an icon button with a trash can; adding `accessibilityLabel="Delete lesson item"` and `accessibilityRole="button"` ensures blind users navigating with Apple VoiceOver or Google TalkBack hear clear spoken instructions (`MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL`).

### 🔹 Block 1: Mobile Accessibility: Auditing `accessible`, `accessibilityLabel` & `accessibilityRole`

- **Concept Budget / Primary Invariant**: `Mobile Accessibility Props Auditor`
- **Supporting Terms & Invariants**: `Accessible Element (`true`)`, `Accessibility Label (`'Complete Lesson'`)`, `Accessibility Role (`'button'`)`, `Status: Mobile Accessibility Verified Nominal`

#### 📦 Memory Box / Data Layout Diagram: Mobile Screen Reader Accessibility Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **accessible={true}** | Groups subviews into single focusable element | `Focus Group` |
| **accessibilityLabel='...'** | Spoken name read aloud by VoiceOver/TalkBack | `Speech Label` |
| **accessibilityRole='button'** | Announces native role trait ('Button, double tap to activate') | `Role Trait` |

#### 📱 Runnable Mobile Simulator: `accessibility_audit_demo.js`

```javascript
function auditA11y(acc, label, role) {
  const validRoles = ['button', 'header', 'link', 'image', 'none'];
  const ok = acc && typeof label === 'string' && label.length > 0 && validRoles.includes(role);
  return {
    accessible: acc,
    accessibilityLabel: label,
    accessibilityRole: role,
    isAccessibleElement: ok,
    status: ok ? 'MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(auditA11y(true, 'Complete Lesson', 'button')));
console.log(JSON.stringify(auditA11y(true, '', 'button')));
```

**Expected Terminal Output**:
```text
{"accessible":true,"accessibilityLabel":"Complete Lesson","accessibilityRole":"button","isAccessibleElement":true,"status":"MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL"}
{"accessible":true,"accessibilityLabel":"","accessibilityRole":"button","isAccessibleElement":false,"status":"DEFECT"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that an interactive mobile element provides compliant accessibility labels and roles?*

- **Target Answer**: `MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Matches MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL

---

### 🔹 Block 2: The Android Native Screen Reader Name: `TalkBack`

- **Concept Budget / Primary Invariant**: `TalkBack Invariant`
- **Supporting Terms & Invariants**: ``TalkBack` (`Google's built-in Android accessibility service providing spoken feedback, gesture navigation, and vibration cues`)`

#### ⚙️ Syntax & Template Anatomy: Accessible Icon Button

```text
<Pressable
  accessible={true}
  accessibilityLabel="Delete this lesson"
  accessibilityRole="button"
  accessibilityHint="Permanently removes this quest from your saved list"
  onPress={handleDelete}
>
  <Icon name="trash-2" size={24} />
</Pressable>
```

- **Line 2**: accessible={true} groups icon and button.
- **Line 3**: accessibilityLabel provides clear spoken context for VoiceOver and TalkBack.
- **Line 4**: accessibilityRole informs screen reader of component type.

#### 📱 Runnable Mobile Simulator: `talkback_name_demo.js`

```javascript
function getAndroidReader() {
  return 'TalkBack';
}

console.log(getAndroidReader());
```

**Expected Terminal Output**:
```text
TalkBack
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the name of Android's built-in native screen reader?*

- **Target Answer**: `TalkBack`
- **Typed Misconception ID**: `MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'VoiceOver'**:
  - *What Went Wrong*: VoiceOver is iOS. Android's screen reader is TalkBack.
  - *Simpler Mental Model*: Type TalkBack.
  - *Guided Fix Action*: Type TalkBack

---

### 🔹 Block 3: Dynamic Announcements: Using `AccessibilityInfo.announceForAccessibility`

- **Concept Budget / Primary Invariant**: ``AccessibilityInfo` Invariant`
- **Supporting Terms & Invariants**: ``AccessibilityInfo.announceForAccessibility()` (`Imperatively triggers the screen reader to speak dynamic changes, such as 'Quest successfully completed!'`)`

#### 📱 Runnable Mobile Simulator: `a11y_announce_demo.js`

```javascript
function getAnnouncementRule() {
  return 'USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS';
}

console.log(getAnnouncementRule());
```

**Expected Terminal Output**:
```text
USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do React Native apps notify screen reader users when an asynchronous background action completes?*

- **Target Answer**: `USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS`
- **Typed Misconception ID**: `MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'ALERT_ONLY'**:
  - *What Went Wrong*: Standard is: USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS.
  - *Simpler Mental Model*: Matches USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS.
  - *Guided Fix Action*: Type USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS

---

## 📅 Day 27: Automated Testing in Mobile: Jest, RNTL & Maestro / Detox E2E

> **💡 Everyday Metaphor / Intuitive Model**:
> Maestro E2E Testing Is a Robot Customer in a Retail Store: Instead of a human QA engineer tapping on a physical glass screen, Maestro reads a declarative YAML test script (`maestro test login.yaml`), launches the app (`launchApp`), taps the login button, and verifies that the Welcome dashboard appears (`MAESTRO_E2E_FLOW_VERIFIED_NOMINAL`).

### 🔹 Block 1: E2E Testing: Validating Maestro YAML Flow Structure (`launchApp` + `assertVisible`)

- **Concept Budget / Primary Invariant**: `Maestro E2E Test Flow Step Auditor`
- **Supporting Terms & Invariants**: `Flow Name (`'LoginFlow'`)`, `Launch App Action (`'launchApp'`)`, `Assert Visible Action (`'assertVisible'`)`, `Status: Maestro E2E Flow Verified Nominal`

#### 📦 Memory Box / Data Layout Diagram: Maestro Mobile E2E Automation Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **1. launchApp Step** | Launches simulator application sandbox | `Launch` |
| **2. tapOn Step** | Simulates native finger tap on 'login_button' | `Tap` |
| **3. assertVisible Step** | Verifies 'Welcome' screen text (MAESTRO E2E FLOW NOMINAL!) | `Assertion` |

#### 📱 Runnable Mobile Simulator: `maestro_flow_demo.js`

```javascript
function auditMaestro(name, steps) {
  const hasLaunch = steps.some(s => s.action === 'launchApp');
  const hasAssert = steps.some(s => s.action === 'assertVisible');
  const ok = hasLaunch && hasAssert;
  return {
    flowName: name,
    totalSteps: steps.length,
    isFlowValid: ok,
    status: ok ? 'MAESTRO_E2E_FLOW_VERIFIED_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(auditMaestro('LoginFlow', [{ action: 'launchApp' }, { action: 'tapOn', target: 'login_btn' }, { action: 'assertVisible', text: 'Welcome' }])));
```

**Expected Terminal Output**:
```text
{"flowName":"LoginFlow","totalSteps":3,"isFlowValid":true,"status":"MAESTRO_E2E_FLOW_VERIFIED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a Maestro mobile E2E test flow contains valid launch and assertion steps?*

- **Target Answer**: `MAESTRO_E2E_FLOW_VERIFIED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Matches MAESTRO_E2E_FLOW_VERIFIED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type MAESTRO_E2E_FLOW_VERIFIED_NOMINAL

---

### 🔹 Block 2: The Modern Declarative Mobile E2E Testing Tool: `Maestro`

- **Concept Budget / Primary Invariant**: `Maestro Invariant`
- **Supporting Terms & Invariants**: ``Maestro` (`Mobile Studio's open-source declarative YAML-based UI test automation framework designed for React Native, iOS, and Android`)`

#### ⚙️ Syntax & Template Anatomy: Maestro YAML Flow Syntax

```text
appId: com.pinit.career
---
- launchApp
- tapOn: "Get Started"
- assertVisible: "Choose Your Career Track"
- tapOn: "UI/UX Design Systems"
```

- **Line 1**: appId specifies target bundle identifier.
- **Line 3**: launchApp starts test.
- **Line 5**: assertVisible verifies screen state without brittle XPath selectors.

#### 📱 Runnable Mobile Simulator: `maestro_name_demo.js`

```javascript
function getE2eTool() {
  return 'Maestro';
}

console.log(getE2eTool());
```

**Expected Terminal Output**:
```text
Maestro
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What modern declarative YAML-based mobile E2E automation tool is industry standard for React Native?*

- **Target Answer**: `Maestro`
- **Typed Misconception ID**: `MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'Selenium'**:
  - *What Went Wrong*: Selenium is for web. The modern mobile declarative framework is Maestro.
  - *Simpler Mental Model*: Type Maestro.
  - *Guided Fix Action*: Type Maestro

---

### 🔹 Block 3: Component Testing: Querying by Accessibility Role with React Native Testing Library

- **Concept Budget / Primary Invariant**: `RNTL Accessibility Query Invariant`
- **Supporting Terms & Invariants**: ``getByRole` / `getByLabelText` (`Testing components using accessible roles and labels rather than testIDs ensures tests verify what screen readers actually perceive`)`

#### 📱 Runnable Mobile Simulator: `rntl_rule_demo.js`

```javascript
function getRntlQueryRule() {
  return 'PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS';
}

console.log(getRntlQueryRule());
```

**Expected Terminal Output**:
```text
PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why should React Native component tests query elements by accessibility role instead of testIDs?*

- **Target Answer**: `PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS`
- **Typed Misconception ID**: `MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'USE_TEST_IDS_ONLY'**:
  - *What Went Wrong*: Standard is: PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS.
  - *Simpler Mental Model*: Matches PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS.
  - *Guided Fix Action*: Type PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS

---

## 📅 Day 28: CI/CD Pipelines with Fastlane & EAS Build: Automated Code Signing & OTA Updates

> **💡 Everyday Metaphor / Intuitive Model**:
> EAS Build Is an Automated Cloud Aircraft Factory: Instead of compiling iOS and Android binaries on an engineer's laptop, EAS Build in the cloud manages distribution certificates, signs binaries (`distribution: 'store'`), and deploys instant Over-the-Air bug fixes directly to users in seconds (`eas update`).

### 🔹 Block 1: Release Automation: Classifying EAS Profiles (`production` $\to$ `'store'` vs `development`)

- **Concept Budget / Primary Invariant**: `EAS Build Profile Target Classifier`
- **Supporting Terms & Invariants**: `Profile Name (`'production'` vs `'development'`)`, `Distribution (`'store'` vs `'internal'`)`, `Development Client Flag`, `Status: EAS Build Profile Classified Nominal`

#### 📦 Memory Box / Data Layout Diagram: EAS Build Profile Architecture Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Profile: production** | distribution = 'store', isDevelopmentClient = false (Signed for App Store) | `Store Build` |
| **Profile: development** | distribution = 'internal', isDevelopmentClient = true (Live reload enabled) | `Dev Build` |
| **EAS Resolution** | EAS BUILD PROFILE CLASSIFIED NOMINAL (CLOUD CI/CD SIGNED!) | `Status` |

#### 📱 Runnable Mobile Simulator: `eas_profile_demo.js`

```javascript
function classifyEasProfile(name) {
  const map = {
    'development': { distribution: 'internal', isDev: true },
    'production': { distribution: 'store', isDev: false }
  };
  const cfg = map[name];
  return {
    profileName: name,
    distribution: cfg.distribution,
    isDevelopmentClient: cfg.isDev,
    status: 'EAS_BUILD_PROFILE_CLASSIFIED_NOMINAL'
  };
}

console.log(JSON.stringify(classifyEasProfile('production')));
console.log(JSON.stringify(classifyEasProfile('development')));
```

**Expected Terminal Output**:
```text
{"profileName":"production","distribution":"store","isDevelopmentClient":false,"status":"EAS_BUILD_PROFILE_CLASSIFIED_NOMINAL"}
{"profileName":"development","distribution":"internal","isDevelopmentClient":true,"status":"EAS_BUILD_PROFILE_CLASSIFIED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What distribution target is configured for the 'production' EAS build profile?*

- **Target Answer**: `store`
- **Typed Misconception ID**: `MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'internal'**:
  - *What Went Wrong*: internal is for preview/dev builds. Production builds use distribution: 'store'.
  - *Simpler Mental Model*: Distribution is store.
  - *Guided Fix Action*: Type store

---

### 🔹 Block 2: The Over-The-Air Instant Update CLI: `eas update`

- **Concept Budget / Primary Invariant**: ``eas update` Invariant`
- **Supporting Terms & Invariants**: ``eas update` (`The Expo CLI command that publishes JS bundle updates directly to installed devices, bypassing multi-day app store review queues for JS bug fixes`)`

#### ⚙️ Syntax & Template Anatomy: EAS Update Pipeline

```text
# 1. Publish instant JS bugfix to production channel:
eas update --branch production --message "Fix Day 28 navigation edge case"

# 2. Devices receive new JS bundle on next app launch automatically!
```

- **Line 2**: eas update publishes JS and asset diffs to cloud CDN.
- **Line 4**: End users receive update instantly without visiting App Store.

#### 📱 Runnable Mobile Simulator: `eas_update_demo.js`

```javascript
function getEasUpdateCmd() {
  return 'eas update';
}

console.log(getEasUpdateCmd());
```

**Expected Terminal Output**:
```text
eas update
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What command publishes instant Over-The-Air JavaScript updates to production apps?*

- **Target Answer**: `eas update`
- **Typed Misconception ID**: `MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'eas build'**:
  - *What Went Wrong*: eas build compiles native binaries. Instant OTA updates use eas update.
  - *Simpler Mental Model*: Type eas update.
  - *Guided Fix Action*: Type eas update

---

### 🔹 Block 3: OTA Boundary: When Full Binary Re-builds are Required (Native Code Changes)

- **Concept Budget / Primary Invariant**: `OTA Boundary Invariant`
- **Supporting Terms & Invariants**: `OTA Native Boundary (`OTA updates can only update JavaScript and asset bundles; changes to native C++, iOS Pods, or Android Gradle dependencies require a full binary build`)`

#### 📱 Runnable Mobile Simulator: `ota_boundary_demo.js`

```javascript
function getOtaBoundaryRule() {
  return 'NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION';
}

console.log(getOtaBoundaryRule());
```

**Expected Terminal Output**:
```text
NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *When is an Over-The-Air update insufficient, requiring a full new binary submission to the app stores?*

- **Target Answer**: `NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION`
- **Typed Misconception ID**: `MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'OTA_ALWAYS_WORKS'**:
  - *What Went Wrong*: Standard is: NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION.
  - *Simpler Mental Model*: Matches NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION.
  - *Guided Fix Action*: Type NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION

---

## 📅 Day 29: App Store & Google Play Store Submission: Privacy Manifests & App Bundles

> **💡 Everyday Metaphor / Intuitive Model**:
> Staged Rollout Is a Controlled Water Dam Valve: Instead of opening the floodgates to 100% of millions of global users on Day 1, releasing to a $25\%$ cohort (`STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL`) allows crash monitoring in Sentry, protecting 75% of your user base if an unforeseen edge-case occurs.

### 🔹 Block 1: Store Release: Validating Staged Rollout Percentages ($1 \le p \le 100$)

- **Concept Budget / Primary Invariant**: `App Store Staged Rollout Percentage Validator`
- **Supporting Terms & Invariants**: `Rollout Percentage ($25\%$)`, `Validation Status`, `Risk Mitigation`, `Status: Staged Rollout Percentage Validated Nominal`

#### 📦 Memory Box / Data Layout Diagram: App Store Staged Rollout Phased Release Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Phase 1 (Day 1)** | rolloutPercentage = 10% (Early adopter telemetry monitoring) | `Phase 1` |
| **Phase 2 (Day 3)** | rolloutPercentage = 25% (VALIDATED NOMINAL - ZERO CRASH SPIKES!) | `Phase 2` |
| **Phase 3 (Day 7)** | rolloutPercentage = 100% (Full global deployment) | `Phase 3` |

#### 📱 Runnable Mobile Simulator: `rollout_validator_demo.js`

```javascript
function validateRollout(pct) {
  const ok = pct >= 1 && pct <= 100;
  return {
    rolloutPercentage: pct,
    isRolloutValid: ok,
    status: ok ? 'STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(validateRollout(25)));
console.log(JSON.stringify(validateRollout(150)));
```

**Expected Terminal Output**:
```text
{"rolloutPercentage":25,"isRolloutValid":true,"status":"STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL"}
{"rolloutPercentage":150,"isRolloutValid":false,"status":"DEFECT"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a store release rollout percentage is within the valid 1-100% range?*

- **Target Answer**: `STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Matches STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL

---

### 🔹 Block 2: The Google Play Store Binary Format: `.aab` (Android App Bundle)

- **Concept Budget / Primary Invariant**: `Android App Bundle Invariant`
- **Supporting Terms & Invariants**: ``.aab` (`Android App Bundle: Google Play's publishing format that generates optimized, device-tailored APKs, reducing user download sizes by 35%`)`

#### ⚙️ Syntax & Template Anatomy: Android App Bundle vs Legacy APK

```text
/* ❌ LEGACY: Monolithic Fat APK (Includes all CPU architectures) */
app-release.apk (95 MB download)

/* ✅ MODERN: Android App Bundle (.aab) */
app-release.aab (Play Store serves dynamic 18 MB APK tailored to user CPU/Screen!)
```

- **Line 2**: Fat APKs bloat user downloads.
- **Line 5**: .aab delivers device-optimized dynamic APKs.

#### 📱 Runnable Mobile Simulator: `aab_format_demo.js`

```javascript
function getAabFormat() {
  return '.aab';
}

console.log(getAabFormat());
```

**Expected Terminal Output**:
```text
.aab
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the mandatory file extension for publishing production applications to Google Play?*

- **Target Answer**: `.aab`
- **Typed Misconception ID**: `MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '.apk'**:
  - *What Went Wrong*: Google Play requires Android App Bundles (.aab) for all new apps.
  - *Simpler Mental Model*: Type .aab.
  - *Guided Fix Action*: Type .aab

---

### 🔹 Block 3: Apple Compliance: Mandatory Privacy Manifests (`PrivacyInfo.xcprivacy`)

- **Concept Budget / Primary Invariant**: `Privacy Manifest Invariant`
- **Supporting Terms & Invariants**: ``PrivacyInfo.xcprivacy` (`Apple's required privacy manifest file detailing all third-party SDK data collection and required reason APIs`)`

#### 📱 Runnable Mobile Simulator: `privacy_manifest_demo.js`

```javascript
function getPrivacyManifestRule() {
  return 'DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL';
}

console.log(getPrivacyManifestRule());
```

**Expected Terminal Output**:
```text
DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What file must be configured to pass Apple App Store review for Required Reason APIs?*

- **Target Answer**: `DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL`
- **Typed Misconception ID**: `MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'NO_MANIFEST'**:
  - *What Went Wrong*: Standard is: DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL.
  - *Simpler Mental Model*: Matches DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL.
  - *Guided Fix Action*: Type DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL

---

## 📅 Day 30: 🏆 FINAL CAPSTONE: Sovereign Cross-Platform Mobile Application Suite

> **💡 Everyday Metaphor / Intuitive Model**:
> Final Capstone Synthesis: The complete sovereign cross-platform mobile application master suite: 1. Runtime Architecture & Core Layouts; 2. Navigation & Native Hardware APIs; 3. High-Performance Physics & Virtualization; 4. Native Security & Optimization; 5. Automated Testing & Store Deployment.

### 🔹 Block 1: Sovereign Mobile Application Suite Orchestration

- **Concept Budget / Primary Invariant**: `Sovereign Mobile Application Suite Orchestrator`
- **Supporting Terms & Invariants**: `Architecture Module`, `Native Hardware Module`, `Physics & Routing Module`, `Security & A11y Module`, `Testing & Deployment Module`

#### 🔄 Mobile Execution Flowchart: Sovereign Mobile Application Master Pipeline

1. **Initializes JSI C++ bridge, Safe Area layouts & 48dp touch targets**
2. **Mounts Native Stack & Bottom Tabs with FaceID biometrics & offline SQLite**
3. **Executes Reanimated 3 worklets, Gesture Handler physics & FlatList virtualization**
4. **Enforces iOS Keychain AES-256 storage, VoiceOver a11y & Maestro E2E test flows**
5. **Certifies Sovereign Cross-Platform Mobile Application Master Suite!**

#### 📱 Runnable Mobile Simulator: `capstone_orchestrator_demo.js`

```javascript
function orchestrateMobileSuite(arch, nat, phys, sec, dep) {
  const ok = arch && nat && phys && sec && dep;
  return {
    architectureModule: arch,
    nativeModule: nat,
    physicsModule: phys,
    securityModule: sec,
    deploymentModule: dep,
    certified: ok,
    status: ok ? 'SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'
  };
}

console.log(JSON.stringify(orchestrateMobileSuite(true, true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"architectureModule":true,"nativeModule":true,"physicsModule":true,"securityModule":true,"deploymentModule":true,"certified":true,"status":"SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that all 5 mobile engineering modules are certified nominal?*

- **Target Answer**: `SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL`
- **Typed Misconception ID**: `MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Matches SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL

---

### 🔹 Block 2: Platform-Wide Mobile Engineering Precision Audit

- **Concept Budget / Primary Invariant**: `Capstone Audit Score Invariant`
- **Supporting Terms & Invariants**: `Score: 100/100`, `Zero Defect Invariant`, `Sovereign Tier Certification`

#### 📱 Runnable Mobile Simulator: `capstone_audit_score_demo.js`

```javascript
function auditCapstone() {
  return {
    certified: true,
    score: '100/100',
    tier: 'SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED'
  };
}

console.log(JSON.stringify(auditCapstone()));
```

**Expected Terminal Output**:
```text
{"certified":true,"score":"100/100","tier":"SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit score is awarded upon completing the Sovereign Mobile Application Capstone?*

- **Target Answer**: `100/100`
- **Typed Misconception ID**: `MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '90/100'**:
  - *What Went Wrong*: Full verification achieves 100/100.
  - *Simpler Mental Model*: Score is 100/100.
  - *Guided Fix Action*: Type 100/100

---

### 🔹 Block 3: Conferral of Sovereign Mobile Application Engineer Credential

- **Concept Budget / Primary Invariant**: `Sovereign Mobile Engineer Credential`
- **Supporting Terms & Invariants**: `Platform Mastery`, `Cross-Platform React Native Specialization`, `Production Certified`

#### 📱 Runnable Mobile Simulator: `capstone_conferral_demo.js`

```javascript
console.log('🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]');
```

**Expected Terminal Output**:
```text
🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What credential title is officially conferred upon course graduation?*

- **Target Answer**: `🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]`
- **Typed Misconception ID**: `MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches conferral header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type 🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]

---

