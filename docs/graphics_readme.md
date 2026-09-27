# 3D Interactive Graphics & Avatar Animation — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **3D Interactive Graphics & Avatar Animation (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🔮 Course Overview
* **Name**: 3D Interactive Graphics & Avatar Animation
* **ID**: `course-3d-graphics`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: 3D Graphics Engineers / Frontend SDEs
* **Learning Interface**: WebGL canvas containers, vector transformation matrices trackers, and shader output logs.
* **Evaluation Sandbox**: 3D math compilers inspecting perspective projections, rotation quaternions, rigging weights, and animation keyframes.

---

## 📅 Detailed Day-by-Day Syllabus

### 🔮 Week 1: Coordinate Systems, Projections & Transformations Math

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
* **Coding Exam**: `g3d-basics-exam-day-3` (`normalizeVector3`)
  - **Task**: Write a JS function `normalizeVector3(x, y, z)` returning array [nx, ny, nz] representing the unit vector.
  - **Test**: `normalizeVector3(3, 0, 0)` returns `[1, 0, 0]`.
* **Coding Assignment**: `g3d-basics-assign-day-3` (`getVector3Magnitude`)
  - **Task**: Write a JS function `getVector3Magnitude(x, y, z)` calculating magnitude.
  - **Test**: Computes root sum of squares.

#### 🟢 Day 4: 3D Euclidean Space: Vertex Distance & Bounding spheres
* **Lecture Syllabus**:
  - 3D Euclidean distance calculations
  - Bounding spheres overlap checking
  - Optimizing collision checks
* **Coding Exam**: `g3d-basics-exam-day-4` (`getVectorDistance`)
  - **Task**: Write a JS function `getVectorDistance(x1, y1, z1, x2, y2, z2)` returning Euclidean distance.
  - **Test**: Computes spatial distance between coordinates.
* **Coding Assignment**: `g3d-basics-assign-day-4` (`isSphereColliding`)
  - **Task**: Write a JS function `isSphereColliding(dist, r1, r2)` verifying bounding sphere overlaps.
  - **Test**: Compares distance with combined radii.

#### 🟢 Day 5: 3D Translation Matrices & Transform Composition
* **Lecture Syllabus**:
  - Mesh translations calculations
  - Vertex coordinates offset shifts
  - Homogeneous translation matrices layout
* **Coding Exam**: `g3d-basics-exam-day-5` (`translatePoint`)
  - **Task**: Write a JS function `translatePoint(point, offset)` translating coordinates.
  - **Test**: Multiplies coordinate segments.
* **Coding Assignment**: `g3d-basics-assign-day-5` (`isTranslationArrayValid`)
  - **Task**: Write a JS function `isTranslationArrayValid(arr)` verifying offset format.
  - **Test**: Asserts 3-length arrays checks.

#### 🟢 Day 6: Camera Viewports: Field of View (FOV) & Frustums
* **Lecture Syllabus**:
  - Vertical Field of View (FOV)
  - Frustum bounds geometry
  - Trigonometric height conversions
* **Coding Exam**: `g3d-basics-exam-day-6` (`getFrustumHeight`)
  - **Task**: Write a JS function `getFrustumHeight(fovDeg, distance)` calculating viewport dimensions.
  - **Test**: Evaluates frustum heights.
* **Coding Assignment**: `g3d-basics-assign-day-6` (`getRequiredDistance`)
  - **Task**: Write a JS function `getRequiredDistance(fovDeg, targetHeight)` solving for target distance.
  - **Test**: Reverse FOV math.

#### 🟢 Day 7: Camera Target alignment: LookAt direction vectors
* **Lecture Syllabus**:
  - Camera view matrices configurations
  - LookAt target vectors alignments
  - Preventing matrix inversion exceptions
* **Coding Exam**: `g3d-basics-exam-day-7` (`isLookDirectionValid`)
  - **Task**: Write a JS function `isLookDirectionValid(camPos, targetPos, upVec)` auditing camera look alignments.
  - **Test**: Blocks zero-magnitude or parallel target directions.
* **Coding Assignment**: `g3d-basics-assign-day-7` (`getCrossProductMagnitude`)
  - **Task**: Write a JS function `getCrossProductMagnitude(v1, v2)` calculating cross products.
  - **Test**: Computes perpendicular vector magnitudes.

---

### 🔮 Week 2: Lighting, View Matrices & Interaction Raycasting

#### 🟢 Day 8: Bone Armatures & Rigging Weights Normalizers
* **Lecture Syllabus**:
  - Armature joint parent-child hierarchies
  - Rigging influence weights matrices
  - Normalizing vertex rigging values
* **Coding Exam**: `g3d-basics-exam-day-8` (`normalizeWeights`)
  - **Task**: Write a JS function `normalizeWeights(w1, w2)` scaling rigging values.
  - **Test**: Outputs relative weights summing to 1.0.
* **Coding Assignment**: `g3d-basics-assign-day-8` (`toDegToRad`)
  - **Task**: Write a JS function `toDegToRad(deg)` converting angles.
  - **Test**: Multiplies degrees by PI/180.

#### 🟢 Day 9: Linear Interpolation (Lerp) & Keyframe Blending
* **Lecture Syllabus**:
  - Keyframe animation interpolation
  - Linear interpolation formula (lerp)
  - Clamping interpolation progress bounds
* **Coding Exam**: `g3d-basics-exam-day-9` (`lerp`)
  - **Task**: Write a JS function `lerp(a, b, t)` interpolating values.
  - **Test**: Clamps progress between 0.0 and 1.0.
* **Coding Assignment**: `g3d-basics-assign-day-9` (`normalizeBlend`)
  - **Task**: Write a JS function `normalizeBlend(q1, q2, t)` blending vectors.
  - **Test**: Returns normalized scale.

#### 🟢 Day 10: Rotation Quaternions & Euler Angles conversions
* **Lecture Syllabus**:
  - Rotation representations in 3D spaces
  - Avoiding gimbal lock limitations
  - Euler angles to Quaternions mapping
* **Coding Exam**: `g3d-basics-exam-day-10` (`getQuaternionW`)
  - **Task**: Write a JS function `getQuaternionW(x, y, z)` solving unit quaternion W components.
  - **Test**: Returns root of remaining squares sum.
* **Coding Assignment**: `g3d-basics-assign-day-10` (`isUnitQuaternion`)
  - **Task**: Write a JS function `isUnitQuaternion(x, y, z, w)` checking normalization.
  - **Test**: Checks if squared components sum to 1.0.

#### 🟢 Day 11: Lighting Models: Dot Products & Surface Normals
* **Lecture Syllabus**:
  - Diffuse lighting equations (Lambertian model)
  - Calculating vertex normal vectors
  - Dot product light incidence angles
* **Coding Exam**: `g3d-basics-exam-day-11` (`calculateDiffuse`)
  - **Task**: Write a JS function `calculateDiffuse(normalX, normalY, normalZ, lightX, lightY, lightZ)` computing dot product intensity.
  - **Test**: Returns lighting projection.
* **Coding Assignment**: `g3d-basics-assign-day-11` (`isLightReflected`)
  - **Task**: Write a JS function `isLightReflected(dotProduct)` validating highlight limits.
  - **Test**: Checks threshold boundaries.

#### 🟢 Day 12: 3D View Matrices & Projection transforms
* **Lecture Syllabus**:
  - Camera translation lookAt transformations
  - Perspective camera projection parameters
  - Clipping matrices bounds configurations
* **Coding Exam**: `g3d-basics-exam-day-12` (`getViewTranslation`)
  - **Task**: Write a JS function `getViewTranslation(x, y, z)` negating target position.
  - **Test**: Returns inverted camera position translations.
* **Coding Assignment**: `g3d-basics-assign-day-12` (`isNearPlaneSafe`)
  - **Task**: Write a JS function `isNearPlaneSafe(near, far)` checking clipping bounds.
  - **Test**: Verifies near and far values boundaries.

#### 🟢 Day 13: 3D Coordinate bounds checks & View culling
* **Lecture Syllabus**:
  - WebGL coordinate bounding box structures
  - Frustum culling culling boundaries
  - Pruning off-screen meshes draw calls
* **Coding Exam**: `g3d-basics-exam-day-13` (`isPointInBounds`)
  - **Task**: Write a JS function `isPointInBounds(x, y, z, minX, maxX, ...)` auditing coordinate ranges.
  - **Test**: Restricts objects to box regions.
* **Coding Assignment**: `g3d-basics-assign-day-13` (`getBoxSize`)
  - **Task**: Write a JS function `getBoxSize(minVal, maxVal)` finding width.
  - **Test**: Returns subtraction values.

#### 🟢 Day 14: 3D Raycasting & Screen-to-World coordinate unprojecting
* **Lecture Syllabus**:
  - Unprojecting screen coordinates to world lines
  - Ray intersection detection formulas
  - Calculating ray-sphere collision sweeps
* **Coding Exam**: `g3d-basics-exam-day-14` (`isRayHit`)
  - **Task**: Write a JS function `isRayHit(rayOrigin, rayDir, sphereCenter, sphereRadius)` checking lines overlap.
  - **Test**: Checks ray intersections with bounding spheres.
* **Coding Assignment**: `g3d-basics-assign-day-14` (`getIntersectionDistance`)
  - **Task**: Write a JS function `getIntersectionDistance(hitPoint, rayOrigin)` calculating pick depth.
  - **Test**: Returns 3D Euclidean separation.

---

### 🔮 Week 3: Shaders, Textures & Skeletal Armature hierarchies

#### 🟢 Day 15: Morph Targets & Shape Blendshapes weight mixers
* **Lecture Syllabus**:
  - Morph targets shapes models
  - Blending facial expression weight keys
  - Dynamic vertex positions shape offsets
* **Coding Exam**: `g3d-basics-exam-day-15` (`clampBlendshapeWeight`)
  - **Task**: Write a JS function `clampBlendshapeWeight(weight)` limiting shape blend inputs.
  - **Test**: Clamps values between 0.0 and 1.0.
* **Coding Assignment**: `g3d-basics-assign-day-15` (`getActiveBlendshapes`)
  - **Task**: Write a JS function `getActiveBlendshapes(shapes)` filtering out dormant shapes.
  - **Test**: Selects shapes exceeding 0.05 thresholds.

#### 🟢 Day 16: Sprite Animators: UV Coordinate mappings offset calculations
* **Lecture Syllabus**:
  - UV texture coordinates grids layouts
  - Texture coordinate offset animations
  - Sprite sheet grids dimensions maps
* **Coding Exam**: `g3d-basics-exam-day-16` (`getUvOffset`)
  - **Task**: Write a JS function `getUvOffset(frameIndex, totalFrames)` finding sheet coordinates.
  - **Test**: Computes frame offsets slots.
* **Coding Assignment**: `g3d-basics-assign-day-16` (`getUvScale`)
  - **Task**: Write a JS function `getUvScale(columns)` scaling UV grids.
  - **Test**: Returns column divisions.

#### 🟢 Day 17: Texture Map Mipmap level scale selectors
* **Lecture Syllabus**:
  - Mipmapping details selections logic
  - Calculating pixel texture detail scaling
  - Reducing far distance rendering noise
* **Coding Exam**: `g3d-basics-exam-day-17` (`selectMipmapLevel`)
  - **Task**: Write a JS function `selectMipmapLevel(distance, maxLevel)` selecting levels.
  - **Test**: Applies Log2 distance scale controls.
* **Coding Assignment**: `g3d-basics-assign-day-17` (`isPowerOfTwo`)
  - **Task**: Write a JS function `isPowerOfTwo(size)` verifying dimension power.
  - **Test**: Performs bitwise power check.

#### 🟢 Day 18: Keyframe tracks time validations
* **Lecture Syllabus**:
  - Keyframe tracks timeline validations
  - Sorting timestamp indexes structures
  - Pruning keyframe tracks duplicate entries
* **Coding Exam**: `g3d-basics-exam-day-18` (`isTimelineSequenceValid`)
  - **Task**: Write a JS function `isTimelineSequenceValid(timestamps)` checking sequence ordering.
  - **Test**: Confirms ascending timestamps indexes.
* **Coding Assignment**: `g3d-basics-assign-day-18` (`getTrackDuration`)
  - **Task**: Write a JS function `getTrackDuration(timestamps)` determining timelines duration.
  - **Test**: Computes overall track span.

#### 🟢 Day 19: Inverse Kinematics: Joint chain distance constraints
* **Lecture Syllabus**:
  - Inverse Kinematics (IK) joint architectures
  - Joint length restrictions and distance checks
  - Targeting arm coordinates calculations
* **Coding Exam**: `g3d-basics-exam-day-19` (`canReachTarget`)
  - **Task**: Write a JS function `canReachTarget(lengths, targetDist)` checking reachability.
  - **Test**: Confirms total segment length matches target distance.
* **Coding Assignment**: `g3d-basics-assign-day-19` (`getTotalLength`)
  - **Task**: Write a JS function `getTotalLength(lengths)` summing lengths.
  - **Test**: Reduces segment arrays.

#### 🟢 Day 20: Bone matrix hierarchy nodes traversals
* **Lecture Syllabus**:
  - Bone joint hierarchies models
  - Parent-Child transform node maps
  - Recursive tree traversal rules
* **Coding Exam**: `g3d-basics-exam-day-20` (`findBoneNode`)
  - **Task**: Write a JS function `findBoneNode(root, targetName)` searching bone trees.
  - **Test**: Recurses child nodes locating matching target name keys.
* **Coding Assignment**: `g3d-basics-assign-day-20` (`getChildCount`)
  - **Task**: Write a JS function `getChildCount(node)` verifying children count.
  - **Test**: Reports children sizes.

#### 🟢 Day 21: GLTF model mesh index bounds validations
* **Lecture Syllabus**:
  - glTF file structures definitions
  - GLTF vertex index validation checks
  - Preventing buffer parsing crashes
* **Coding Exam**: `g3d-basics-exam-day-21` (`isMeshBufferValid`)
  - **Task**: Write a JS function `isMeshBufferValid(indices, vertexCount)` checking buffer ranges.
  - **Test**: Drops indices pointing outside vertex array indices.
* **Coding Assignment**: `g3d-basics-assign-day-21` (`getTriangleCount`)
  - **Task**: Write a JS function `getTriangleCount(indices)` counting rendering faces.
  - **Test**: Divides index length by 3.

---

### 🔮 Week 4: Animation Systems, Blending & Production Optimizations

#### 🟢 Day 22: Draw call metrics optimization trackers
* **Lecture Syllabus**:
  - Scene draw calls metrics logs
  - Mesh instancing optimizations rules
  - Reducing graphics pipeline bottlenecks
* **Coding Exam**: `g3d-basics-exam-day-22` (`isDrawCallLimitHealthy`)
  - **Task**: Write a JS function `isDrawCallLimitHealthy(drawCalls, maxAllowed)` checking rendering counts.
  - **Test**: Blocks counts exceeding safety limits.
* **Coding Assignment**: `g3d-basics-assign-day-22` (`getInstancedDrawCalls`)
  - **Task**: Write a JS function `getInstancedDrawCalls(count, size)` estimating savings.
  - **Test**: Applies instancing batch calculations.

#### 🟢 Day 23: Avatar Animation Mixer crossfades
* **Lecture Syllabus**:
  - Animation mixer blending methods
  - Crossfade interpolation weights logs
  - Chaining character state transitions
* **Coding Exam**: `g3d-basics-exam-day-23` (`getBlendWeights`)
  - **Task**: Write a JS function `getBlendWeights(elapsedTime, transitionDuration)` calculating clip fading.
  - **Test**: Emits walk/run complementary weight scales.
* **Coding Assignment**: `g3d-basics-assign-day-23` (`shouldTransitionComplete`)
  - **Task**: Write a JS function `shouldTransitionComplete(weight)` halting blend clocks.
  - **Test**: Flags progress >= 99%.

#### 🟢 Day 24: Avatar Character state machine transitions
* **Lecture Syllabus**:
  - Animation state machine maps
  - State transition rule systems
  - Active state track logs
* **Coding Exam**: `g3d-basics-exam-day-24` (`getNextState`)
  - **Task**: Write a JS function `getNextState(currentState, event, rules)` navigating states.
  - **Test**: Triggers state switch based on rules maps events.
* **Coding Assignment**: `g3d-basics-assign-day-24` (`isValidState`)
  - **Task**: Write a JS function `isValidState(state, allowedStates)` checking status values.
  - **Test**: Verifies list membership.

#### 🟢 Day 25: Capstone: Production 3D Scene Compliance Audit
* **Lecture Syllabus**:
  - Auditing camera perspective projections
  - Checking GLTF buffer allocations
  - Auditing keyframe timelines
* **Coding Exam**: `g3d-basics-exam-day-25` (`evaluateSceneCompliance`)
  - **Task**: Write a JS function `evaluateSceneCompliance(report)` verifying overall scene safety.
  - **Test**: Confirms buffers, timeline, and draw call parameters pass validation.
* **Coding Assignment**: `g3d-basics-assign-day-25` (`isFrameLatencyHealthy`)
  - **Task**: Write a JS function `isFrameLatencyHealthy(fps)` checking rendering frames.
  - **Test**: Flags when fps drops below 60.

#### 🟢 Day 26: Capstone: Production 3D Scene Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing mesh coordinates bounds
  - Verifying normal vector limits
  - Auditing view matrix translations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Capstone: Production 3D Scene Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing rigging weights normalizations
  - Verifying keyframe interpolation timings
  - Auditing light normals
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Capstone: Production 3D Scene Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing frustum clipping limits
  - Verifying raycast intersection paths
  - Auditing morph targets weights
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Capstone: Production 3D Scene Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing mipmapping detail selections
  - Verifying keyframe track alignments
  - Auditing joint arm lengths
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Capstone: Production 3D Scene Compliance Audit (Review)
* **Lecture Syllabus**:
  - Reviewing total evaluation reports
  - Verifying rendering latency limits
  - Auditing graphics release checklist
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
