# UI/UX Design Systems & Visual Frontend — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **UI/UX Design Systems & Visual Frontend (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🎨 Course Overview
* **Name**: UI/UX Design Systems & Visual Frontend
* **ID**: `course-design-systems`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Frontend SDEs / UI/UX Engineers
* **Learning Interface**: CSS spacing maps, design token configurations, flexbox wrapping trees, and typography contrast reports.
* **Evaluation Sandbox**: Style validators checking hex colors, spacing multipliers, rem typography calculations, grid column widths, flex wrapping constraints, shadow elevations, and WCAG AA contrast rules compliance.

---

## 📅 Detailed Day-by-Day Syllabus

### 🎨 Week 1: Semantic HTML, Layout Positioning & Responsive Typography

#### 🟢 Day 1: HTML & Semantic Page Structure
* **Lecture Syllabus**:
  - Semantic HTML5 landmarks structures
  - A11y document outlines guidelines
  - Lists, navigation tags, and button structures
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: CSS Box Model & Displays Layouts
* **Lecture Syllabus**:
  - Content, padding, border, and margin rules
  - Display properties blocks inline options
  - Border-box sizing layouts configurations
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: CSS Position, Z-Index & Layout Coordinates
* **Lecture Syllabus**:
  - Static relative absolute configurations rules
  - Fixed and sticky position behaviors
  - Z-index stacking contexts margins rules
* **Coding Exam**: `design-basics-exam-day-3` (`validateAbsoluteAnchor`)
  - **Task**: Write a JS function `validateAbsoluteAnchor(parentPos, childPos)` verifying relative-absolute links coordinates.
  - **Test**: `validateAbsoluteAnchor('relative', 'absolute') === true`.
* **Coding Assignment**: `design-basics-assign-day-3` (`isStackOrderValid`)
  - **Task**: Write a JS function `isStackOrderValid(z1, z2)` checking z-index values stack order.
  - **Test**: Confirms true if z2 > z1.

#### 🟢 Day 4: Typography scale grids & responsive font scaling
* **Lecture Syllabus**:
  - Typography scaling ranges configuration
  - Root font-size rem conversions
  - Fluid typography responsive bounds
* **Coding Exam**: `design-basics-exam-day-4` (`convertPxToRem`)
  - **Task**: Write a JS function `convertPxToRem(px, base)` calculating rem.
  - **Test**: Returns decimal scale.
* **Coding Assignment**: `design-basics-assign-day-4` (`isFontScaleAllowed`)
  - **Task**: Write a JS function `isFontScaleAllowed(sizeRem, minRem, maxRem)` checking bounds.
  - **Test**: Asserts size inside bounds limits.

#### 🟢 Day 5: Design Tokens: Color Palette system builders
* **Lecture Syllabus**:
  - Design tokens variables setups
  - Color palette HEX conversions
  - Mapping token namespaces
* **Coding Exam**: `design-basics-exam-day-5` (`isValidHexColor`)
  - **Task**: Write a JS function `isValidHexColor(hexStr)` verifying color code format.
  - **Test**: Confirms starting with # and length 4 or 7.
* **Coding Assignment**: `design-basics-assign-day-5` (`formatTokenName`)
  - **Task**: Write a JS function `formatTokenName(category, name)` formatting variable namespace.
  - **Test**: Output string formatting checks.

#### 🟢 Day 6: Design Tokens: Layout spacing metrics limits
* **Lecture Syllabus**:
  - Grid spacing multiplier standards (8px)
  - Padding and margin token scales
  - Auditing style spacing properties
* **Coding Exam**: `design-basics-exam-day-6` (`isSpacingMultiOf8`)
  - **Task**: Write a JS function `isSpacingMultiOf8(pixelValue)` validating space steps.
  - **Test**: Checks modulo 8 conditions.
* **Coding Assignment**: `design-basics-assign-day-6` (`getSpacingToken`)
  - **Task**: Write a JS function `getSpacingToken(pixelValue)` formatting padding token.
  - **Test**: Divides values mapping scale.

#### 🟢 Day 7: Figma Variables export maps validator
* **Lecture Syllabus**:
  - Figma variables design tokens configurations
  - JSON tokens export maps structures
  - Converting JSON design maps to CSS variables
* **Coding Exam**: `design-basics-exam-day-7` (`isValidTokenJson`)
  - **Task**: Write a JS function `isValidTokenJson(jsonStr)` parsing tokens.
  - **Test**: Confirms colors and spacing keys existence.
* **Coding Assignment**: `design-basics-assign-day-7` (`countTokens`)
  - **Task**: Write a JS function `countTokens(tokenMap)` counting color keys.
  - **Test**: Returns key list size.

---

### 🎨 Week 2: Layout Systems, Grid, Flexbox & Component Spacing

#### 🟢 Day 8: Visual Hierarchy: Component layout contrast check
* **Lecture Syllabus**:
  - Luminosity contrast requirements (WCAG)
  - Calculating relative contrast levels
  - Validating accessible design colors configurations
* **Coding Exam**: `design-basics-exam-day-8` (`isContrastRatioAllowed`)
  - **Task**: Write a JS function `isContrastRatioAllowed(ratio, targetLimit)` checking accessibility contrast.
  - **Test**: Compares ratio bounds.
* **Coding Assignment**: `design-basics-assign-day-8` (`getWcagRating`)
  - **Task**: Write a JS function `getWcagRating(ratio)` mapping AAA, AA, or FAIL ratings.
  - **Test**: Check scale margins.

#### 🟢 Day 9: CSS Grid: Dynamic layout column calculators
* **Lecture Syllabus**:
  - CSS grid-template-columns properties configurations
  - Grid gaps and alignments properties
  - Dynamic column count wrapping
* **Coding Exam**: `design-basics-exam-day-9` (`calculateGridCols`)
  - **Task**: Write a JS function `calculateGridCols(containerWidth, minColWidth, gap)` calculating columns.
  - **Test**: Computes division math limits.
* **Coding Assignment**: `design-basics-assign-day-9` (`isColWidthSafe`)
  - **Task**: Write a JS function `isColWidthSafe(width)` checking bounds.
  - **Test**: Enforces minimum width 120.

#### 🟢 Day 10: CSS Flexbox: Auto-wrap child counts checker
* **Lecture Syllabus**:
  - CSS flex direction and wrapping parameters
  - Flex grow shrink sizing rules
  - Centering child components layouts
* **Coding Exam**: `design-basics-exam-day-10` (`isFlexWrapRequired`)
  - **Task**: Write a JS function `isFlexWrapRequired(totalChildrenWidth, containerWidth)` flagging wrapping.
  - **Test**: Checks if combined sizes exceed container boundary.
* **Coding Assignment**: `design-basics-assign-day-10` (`getFlexItemBasis`)
  - **Task**: Write a JS function `getFlexItemBasis(container, count)` calculating item sizes.
  - **Test**: Returns floor division.

#### 🟢 Day 11: Visual Hierarchy: Component layout depth mapping
* **Lecture Syllabus**:
  - CSS box-shadow layering configurations
  - Simulating depth elevation layers
  - Border elevations guidelines
* **Coding Exam**: `design-basics-exam-day-11` (`getShadowElevation`)
  - **Task**: Write a JS function `getShadowElevation(level)` compiling box shadow properties.
  - **Test**: Compiles string checking formats.
* **Coding Assignment**: `design-basics-assign-day-11` (`isShadowBlurred`)
  - **Task**: Write a JS function `isShadowBlurred(blurRadius)` checking blur limits.
  - **Test**: Checks radius thresholds.

#### 🟢 Day 12: Figma Auto Layout auto-spacing metrics
* **Lecture Syllabus**:
  - Figma auto layout alignments maps
  - Auto spacing properties conversion rules
  - Converting padding and gap values to CSS styles
* **Coding Exam**: `design-basics-exam-day-12` (`isGapValueSafe`)
  - **Task**: Write a JS function `isGapValueSafe(gap)` auditing gap values.
  - **Test**: Checks gap is between 4 and 64.
* **Coding Assignment**: `design-basics-assign-day-12` (`isPaddingSymm`)
  - **Task**: Write a JS function `isPaddingSymm(top, bottom)` checking padding parity.
  - **Test**: Compares numbers.

#### 🟢 Day 13: Atomic Design: Atom components properties validation
* **Lecture Syllabus**:
  - Atomic design components configurations
  - Button state variables (disabled, hover)
  - Basic inputs labels mappings
* **Coding Exam**: `design-basics-exam-day-13` (`isButtonStateAllowed`)
  - **Task**: Write a JS function `isButtonStateAllowed(state)` auditing state options.
  - **Test**: Validates default, hover, focus, or disabled options.
* **Coding Assignment**: `design-basics-assign-day-13` (`getDisabledColor`)
  - **Task**: Write a JS function `getDisabledColor(theme)` selecting color hex codes.
  - **Test**: Returns theme color values.

#### 🟢 Day 14: Molecules: Form input components validation
* **Lecture Syllabus**:
  - Combining atomic components layouts
  - Input text field validators
  - Dynamic validation error states labels
* **Coding Exam**: `design-basics-exam-day-14` (`isFormInputValid`)
  - **Task**: Write a JS function `isFormInputValid(text, req)` verifying inputs.
  - **Test**: Checks required and length parameters.
* **Coding Assignment**: `design-basics-assign-day-14` (`formatInputPrefix`)
  - **Task**: Write a JS function `formatInputPrefix(val, prefix)` compiling element class labels.
  - **Test**: Outputs lowercased strings.

---

### 🎨 Week 3: Organisms, Modals & Component Library Architecture

#### 🟢 Day 15: Organisms: Navigation bar layouts spacing checks
* **Lecture Syllabus**:
  - NavBar branding layouts configurations
  - Calculating padding and spacer widths
  - Spacing nav elements alignment rules
* **Coding Exam**: `design-basics-exam-day-15` (`getSidebarWidth`)
  - **Task**: Write a JS function `getSidebarWidth(isCollapsed, openWidth)` returning width.
  - **Test**: Evaluates boolean flags.
* **Coding Assignment**: `design-basics-assign-day-15` (`isNavOverflow`)
  - **Task**: Write a JS function `isNavOverflow(count, limit)` checking links count.
  - **Test**: Checks index bounds.

#### 🟢 Day 16: Organisms: Modals overlay configurations
* **Lecture Syllabus**:
  - Overlay backdrop configurations
  - Escape key closing event handlings
  - Trapping page focus layouts
* **Coding Exam**: `design-basics-exam-day-16` (`getBackdropOpacity`)
  - **Task**: Write a JS function `getBackdropOpacity(isOpen)` scaling overlay backdrop opacity.
  - **Test**: Returns opacity value based on open status.
* **Coding Assignment**: `design-basics-assign-day-16` (`isEscapeKey`)
  - **Task**: Write a JS function `isEscapeKey(event)` checking key mappings.
  - **Test**: Handles Escape or code 27.

#### 🟢 Day 17: Final Capstone: Design System Audit
* **Lecture Syllabus**:
  - Typography scaling ratios evaluations
  - Design tokens spacing grids check
  - Luminosity contrast audit evaluations
* **Coding Exam**: `design-basics-exam-day-17` (`evaluateDesignSystem`)
  - **Task**: Write a JS function `evaluateDesignSystem(report)` auditing token structures.
  - **Test**: Checks contrast, grid, and layout shift parameters.
* **Coding Assignment**: `design-basics-assign-day-17` (`calcClsPenalty`)
  - **Task**: Write a JS function `calcClsPenalty(clsScore)` rating layout stability.
  - **Test**: Categorizes shift penalty values.

---

### 🎨 Week 4: Applied Design Auditing & Capstone System Review

#### 🟢 Day 18: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Design System Audit (Review)
* **Lecture Syllabus**:
  - Reviewing design systems typography scale properties
  - Assembling components specifications checklist
  - Verifying design tokens conversions
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Design System Audit (Review)
* **Lecture Syllabus**:
  - Assemble final design system audit report
  - Verify tokens conversions to CSS variables
  - Confirm WCAG AA contrast compliance and layout shifting checklist
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
