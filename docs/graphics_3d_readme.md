# 3D Interactive Graphics & Avatar Animation — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **3D Interactive Graphics & Avatar Animation (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🔮 Course Overview
* **Name**: 3D Interactive Graphics & Avatar Animation
* **ID**: `course-3d-graphics`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Graphic Programmers / WebGL Developers / Avatar System SDEs
* **Learning Interface**: 3D viewports view, bone joint lists, shader variables logs, and frames-per-second performance metrics.
* **Evaluation Sandbox**: 3D render engines checking vector normalization, column-major translation matrices configurations, scaling dimensions, skeletal bone weight bounds, morph target blendshapes linear interpolation calculations, camera projection aspect ratios parameters, and GPU execution metrics.

---

## 📅 Detailed Day-by-Day Syllabus

### 🔮 Week 1: 3D Coordinate Spaces, Vectors & Translation Math

#### 🟢 Day 1: 3D Coordinate Spaces & Canvas Viewport setups
* **Lecture Syllabus**:
  - Normalized Device Coordinates (NDC) space maps
  - Mapping world coordinates to screen viewports
  - Configuring WebGL canvas context bounds
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Real-Time Render Loops & Delta Time Schedulers
* **Lecture Syllabus**:
  - requestAnimationFrame rendering tick sequences
  - Calculating frame delta time in seconds
  - Lag compensation scaling for animations
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: 3D Vectors: Magnitude Normalization & Light Reflections
* **Lecture Syllabus**:
  - Calculating 3D vector magnitudes
  - Vector normalization and unit vectors
  - Zero division guards in normalization
* **Coding Exam**: `graphics3d-basics-exam-day-3` (`normalizeVector3`)
  - **Task**: Write a JS function `normalizeVector3(x, y, z)` returning normalized unit vector array coordinates.
  - **Test**: `normalizeVector3(3, 0, 0)` returns `[1, 0, 0]`.
* **Coding Assignment**: `graphics3d-basics-assign-day-3` (`getVector3Magnitude`)
  - **Task**: Write a JS function `getVector3Magnitude(x, y, z)` calculating vector length.
  - **Test**: Computes root sum of squares.

#### 🟢 Day 4: Matrices: Translation matrices & Avatar offset coordinates
* **Lecture Syllabus**:
  - 4x4 Transformation matrices properties
  - Applying coordinate translations offsets
  - Constructing homogeneous translation matrices
* **Coding Exam**: `graphics3d-basics-exam-day-4` (`buildTranslationMatrix`)
  - **Task**: Write a JS function `buildTranslationMatrix(tx, ty, tz)` building column-major translation matrices.
  - **Test**: Checks matrix values at indices 12, 13, and 14.
* **Coding Assignment**: `graphics3d-basics-assign-day-4` (`isIdentityMatrix`)
  - **Task**: Write a JS function `isIdentityMatrix(m)` checking identity array maps.
  - **Test**: Confirms identity defaults index values.

#### 🟢 Day 5: Matrices: Scaling transformations & Avatar proportions
* **Lecture Syllabus**:
  - Scaling matrices configurations
  - Adjusting height width scaling parameters
  - Resizing bones coordinates factors
* **Coding Exam**: `graphics3d-basics-exam-day-5` (`buildScalingMatrix`)
  - **Task**: Write a JS function `buildScalingMatrix(sx, sy, sz)` compiling scaling transformation matrices.
  - **Test**: Checks matrix diagonal indexes values.
* **Coding Assignment**: `graphics3d-basics-assign-day-5` (`isUniformScale`)
  - **Task**: Write a JS function `isUniformScale(sx, sy, sz)` checking scale properties.
  - **Test**: Confirms true if scale elements match.

#### 🟢 Day 6: Avatar Rigging: Bone weights skinning interpolator
* **Lecture Syllabus**:
  - Skeletal rigging structures pipelines
  - Bone influence weights allocations
  - Calculating dynamic skinning coordinates
* **Coding Exam**: `graphics3d-basics-exam-day-6` (`isSkinningWeightNormalized`)
  - **Task**: Write a JS function `isSkinningWeightNormalized(weightsList)` verifying sum of joint weights is 1.0.
  - **Test**: Computes weights sums matching tolerance ranges.
* **Coding Assignment**: `graphics3d-basics-assign-day-6` (`exceedsMaxInfluences`)
  - **Task**: Write a JS function `exceedsMaxInfluences(weightsList, max)` auditing bone counts.
  - **Test**: Enforces maximum influences limits.

#### 🟢 Day 7: Morph Targets: Facial blendshapes weights interpolator
* **Lecture Syllabus**:
  - Morph target blendshapes schemas
  - Vertex position delta additions
  - Evaluating facial expression keyframes interpolations
* **Coding Exam**: `graphics3d-basics-exam-day-7` (`interpolateMorph`)
  - **Task**: Write a JS function `interpolateMorph(baseVal, targetVal, weight)` interpolating mesh animations deltas.
  - **Test**: Computes linear interpolation calculations between mesh base and targets.
* **Coding Assignment**: `graphics3d-basics-assign-day-7` (`clampWeight`)
  - **Task**: Write a JS function `clampWeight(weight)` bounding blendshape weights.
  - **Test**: Restricts inputs range to [0, 1].

---

### 🔮 Week 2: Projection Cameras & Engine compliance Audits

#### 🟢 Day 8: 3D Cameras: Perspective projection matrix setup
* **Lecture Syllabus**:
  - Camera frustum parameters configuration
  - Perspective vs Orthographic matrices math
  - Structuring projection matrix coordinates maps
* **Coding Exam**: `graphics3d-basics-exam-day-8` (`buildPerspectiveMatrix`)
  - **Task**: Write a JS function `buildPerspectiveMatrix(fovRad, aspect, near, far)` building projection matrix.
  - **Test**: Checks indices calculations formulas accuracy.
* **Coding Assignment**: `graphics3d-basics-assign-day-8` (`isNearFarPlaneSafe`)
  - **Task**: Write a JS function `isNearFarPlaneSafe(near, far)` checking clipping bounds.
  - **Test**: Verify near is positive and far is greater.

#### 🟢 Day 9: Final Capstone: 3D Engine & Avatar compliance audit
* **Lecture Syllabus**:
  - Transformations matrices compliance checks
  - Rigging weights normalization validation
  - Camera projection parameters checks
* **Coding Exam**: `graphics3d-basics-exam-day-9` (`evaluateGraphicsBuild`)
  - **Task**: Write a JS function `evaluateGraphicsBuild(report)` auditing 3D rendering parameters.
  - **Test**: Validates matrices, skinning weights, and camera projections.
* **Coding Assignment**: `graphics3d-basics-assign-day-9` (`getGraphicsFpsRating`)
  - **Task**: Write a JS function `getGraphicsFpsRating(fps)` rating rendering.
  - **Test**: Returns excellent, playable, or unplayable.

---

### 🔮 Week 3: Applied Graphics Engineering & Shader Tuning

#### 🟢 Day 10: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 11: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

---

### 🔮 Week 4: Applied Graphics Engineering & Shader Tuning (Review)

#### 🟢 Day 15: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing perspective camera parameters
  - Assembling graphics compliance checklists
  - Verifying matrix transformations coordinates
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: 3D Engine & Avatar compliance audit (Review)
* **Lecture Syllabus**:
  - Assemble final 3D engines and avatar animations compliance audit report
  - Verify transformation translation scaling matrices and camera perspective projections
  - Confirm skeletal rigging skinning weights and facial blendshapes keyframes interpolation configurations
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
