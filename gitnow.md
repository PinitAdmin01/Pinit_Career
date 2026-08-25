# 🐙 PinIT Career OS — Git, GitHub & Version Control Basics (v1.0)
# Complete 30-Day Technical Reference Manual & Master Curriculum

---

## 🌟 Executive Architectural Overview

Welcome to the definitive **Git, GitHub & Version Control Master Reference Document** on PinIT Career OS.
This document provides complete, line-by-line pedagogical and operational blueprints for the 30-day version control architecture, cryptographic object storage, branching strategies, conflict resolution, GitHub collaboration, and CI/CD automation curriculum:
- **30 Handcrafted Days** $\times$ **90 Deep Micro-Learning Blocks** (3 blocks/day, 0 single-block days).
- **100% Real-World Software Engineering, Distributed Systems & Open Source Collaboration Analogies**.
- **Memory Box Diagrams, Multi-Tier System Ledgers, and Execution Flowcharts**.
- **100% Runnable JavaScript / Git Version Control Simulators** with exact expected terminal outputs.
- **Empathetic Socratic Diagnostic Checks & 3-Step Recovery Ladders** (*What Went Wrong* $\to$ *Simpler Everyday Picture* $\to$ *Guided Fix Prompt*).
- **5 Project Milestones + Day 30 Final Capstone**:
  - ⭐ **Day 5 Milestone 1**: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine
  - ⭐ **Day 15 Milestone 2**: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine
  - ⭐ **Day 21 Milestone 3**: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine
  - 🏆 **Day 30 Final Capstone**: Sovereign Git, GitHub & Master Version Control Suite

---

## 📅 Day 1: Git Object Model & Storage Architecture: Blobs, Trees, Commits & Tags

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Is a Cryptographic Content Bank of Immutable Safety Deposit Boxes: Instead of saving delta file differences, Git computes the SHA-1 fingerprint of your file contents; if two identical files exist anywhere in the project, Git only stores one underlying 'Blob' (`blob 12\0Hello World\n`), using 'Tree' directory maps and 'Commit' receipts to link everything into an unbreakable historical chain.

### 🔹 Block 1: Git Object Storage Header: `blob 12\0Hello World\n`

- **Concept Budget / Primary Invariant**: `Git Low-Level Object Storage Header`
- **Supporting Terms & Invariants**: `Object Type (`'blob'`)`, `Byte Length ($12$ bytes)`, `Null Byte Separator (`'\0'`)`, `Header Prefix (`'blob 12\0'`)`, `Status: Git Object Header Formatted Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Content-Addressable Storage Layout Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Content Payload** | 'Hello World\n' (12 Bytes of ASCII Text) | `String` |
| **Storage Header** | type ('blob') + ' ' + length (12) + '\0' | `Header` |
| **Formatted Object** | 'blob 12\0Hello World\n' (GIT OBJECT HEADER FORMATTED NOMINAL!) | `Object` |

#### 🐙 Runnable Git Simulator: `git_object_demo.js`

```javascript
function formatGitObject(type, content) {
  const len = Buffer.byteLength(content, 'utf8');
  return {
    type,
    byteLength: len,
    headerPrefix: `${type} ${len}\0`,
    status: 'GIT_OBJECT_HEADER_FORMATTED_NOMINAL'
  };
}

console.log(JSON.stringify(formatGitObject('blob', 'Hello World\n')));
```

**Expected Terminal Output**:
```text
{"type":"blob","byteLength":12,"headerPrefix":"blob 12\0","status":"GIT_OBJECT_HEADER_FORMATTED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What exact header prefix string is constructed by Git when storing a 12-byte blob object?*

- **Target Answer**: `blob 12\0`
- **Typed Misconception ID**: `MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'blob 12'**:
  - *What Went Wrong*: Git requires a null byte separator \0 after the byte length: blob 12\0.
  - *Simpler Mental Model*: Includes null byte: blob 12\0.
  - *Guided Fix Action*: Type blob 12\0

---

### 🔹 Block 2: The 4 Core Git Objects: Blobs, Trees, Commits, and Annotated Tags

- **Concept Budget / Primary Invariant**: `Git 4 Object Types Invariant`
- **Supporting Terms & Invariants**: `Blob (Stores raw file content)`, `Tree (Stores directory structures & file names)`, `Commit (Stores root tree hash, parent commit hash, author & message)`, `Tag (Stores annotated release references)`

#### ⚙️ Syntax & Command Anatomy: The 4 Core Git Objects

```text
// 1. BLOB:   Raw byte data of a file (Does NOT store file names!)
// 2. TREE:   Maps filenames & directory paths to SHA Blob hashes
// 3. COMMIT: Points to a top-level Tree, Parent commit(s), Author, & Timestamp
// 4. TAG:    Permanent cryptographic pointer to a specific commit release
```

- **Line 1**: File content.
- **Line 2**: Directory structure.
- **Line 3**: Historical snapshot record.
- **Line 4**: Release marker.

#### 🐙 Runnable Git Simulator: `object_types_demo.js`

```javascript
function getGitObjectTypesTotal() {
  return 4;
}

console.log(getGitObjectTypesTotal());
```

**Expected Terminal Output**:
```text
4
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many fundamental object types exist in Git's low-level content storage engine?*

- **Target Answer**: `4`
- **Typed Misconception ID**: `MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '3'**:
  - *What Went Wrong*: There are 4: Blob, Tree, Commit, and Tag.
  - *Simpler Mental Model*: Type 4.
  - *Guided Fix Action*: Type 4

---

### 🔹 Block 3: SHA-1 / SHA-256 Hashing: 40-Character Hexadecimal Fingerprints

- **Concept Budget / Primary Invariant**: `Git SHA Cryptographic Hashing Invariant`
- **Supporting Terms & Invariants**: `SHA-1 Hash (A 40-character hexadecimal string representing the exact cryptographic digest of an object; identical content ALWAYS yields the exact same SHA hash)`

#### 🐙 Runnable Git Simulator: `sha_length_demo.js`

```javascript
function getSha1HexLength() {
  return 40;
}

console.log(getSha1HexLength());
```

**Expected Terminal Output**:
```text
40
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many hexadecimal characters make up a standard Git SHA-1 object identifier hash?*

- **Target Answer**: `40`
- **Typed Misconception ID**: `MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '32'**:
  - *What Went Wrong*: 32 is MD5. Git SHA-1 hashes are 40 hexadecimal characters.
  - *Simpler Mental Model*: SHA-1 length is 40.
  - *Guided Fix Action*: Type 40

---

## 📅 Day 2: Local Repository Inception: `git init`, `git clone` & Identity Configuration

> **💡 Everyday Metaphor / Intuitive Model**:
> Initializing a Repository Is Laying the Foundation for a Construction Project: `git init` builds the hidden `.git` control room under the site floor; `git config --global user.name` issues your digital badge (`Alice Smith <alice@company.com>`), stamping every brick you lay with a verifiable author signature.

### 🔹 Block 1: Author Identity: `user.name` & `user.email` Validation (`alice@company.com`)

- **Concept Budget / Primary Invariant**: `Git Author Identity & Configuration Validator`
- **Supporting Terms & Invariants**: `Author Name (`'Alice Smith'`)`, `Author Email (`'alice@company.com'`)`, `Identity Configured (`true`)`, `Config Scope (`'GLOBAL_OR_LOCAL'`)`, `Status: Git Author Identity Configured Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Configuration Hierarchy & Identity Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Author Full Name** | 'Alice Smith' (min 2 characters) | `Name` |
| **Author Email Address** | 'alice@company.com' (Valid RFC email format) | `Email` |
| **Identity Status** | GIT AUTHOR IDENTITY CONFIGURED NOMINAL (VALID COMMIT BADGE!) | `Status` |

#### 🐙 Runnable Git Simulator: `author_config_demo.js`

```javascript
function validateIdentity(name, email) {
  const ok = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return {
    name,
    email,
    isIdentityConfigured: ok,
    status: ok ? 'GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL' : 'GIT_AUTHOR_IDENTITY_DEFECT'
  };
}

console.log(JSON.stringify(validateIdentity('Alice Smith', 'alice@company.com')));
```

**Expected Terminal Output**:
```text
{"name":"Alice Smith","email":"alice@company.com","isIdentityConfigured":true,"status":"GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that Git author name and email credentials are validly configured?*

- **Target Answer**: `GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL`
- **Typed Misconception ID**: `MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Valid author info awards GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL.
  - *Simpler Mental Model*: Matches GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL.
  - *Guided Fix Action*: Type GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL

---

### 🔹 Block 2: Configuration Scope Precedence: Local (`.git/config`) Overrides Global (`~/.gitconfig`)

- **Concept Budget / Primary Invariant**: `Configuration Precedence Invariant`
- **Supporting Terms & Invariants**: `Config Hierarchy (Local repository config overrides Global user config, which overrides System machine config)`

#### ⚙️ Syntax & Command Anatomy: Git Config Scope Hierarchy

```text
// 1. Local:  git config --local user.email "work@corp.com" (Stored in .git/config -> HIGHEST PRECEDENCE!)
// 2. Global: git config --global user.email "personal@gmail.com" (Stored in ~/.gitconfig)
// 3. System: git config --system core.editor "vim" (Stored in /etc/gitconfig -> Lowest)
```

- **Line 1**: Repository-specific overrides.
- **Line 2**: User-wide default.
- **Line 3**: OS machine-wide default.

#### 🐙 Runnable Git Simulator: `config_precedence_demo.js`

```javascript
function getHighestConfigPrecedence() {
  return 'LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG';
}

console.log(getHighestConfigPrecedence());
```

**Expected Terminal Output**:
```text
LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Which Git configuration level has the highest priority and overrides all other configuration files?*

- **Target Answer**: `LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG`
- **Typed Misconception ID**: `MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'GLOBAL'**:
  - *What Went Wrong*: Global applies everywhere unless overridden locally: LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG.
  - *Simpler Mental Model*: Matches LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG.
  - *Guided Fix Action*: Type LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG

---

### 🔹 Block 3: Modern Default Branch Standard: `main` vs Legacy `master`

- **Concept Budget / Primary Invariant**: `Default Branch Invariant`
- **Supporting Terms & Invariants**: `Default Branch (`main`: Configured via `git config --global init.defaultBranch main` replacing outdated legacy default `master`)`

#### 🐙 Runnable Git Simulator: `default_branch_demo.js`

```javascript
function getModernDefaultBranch() {
  return 'main';
}

console.log(getModernDefaultBranch());
```

**Expected Terminal Output**:
```text
main
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the modern industry standard default branch name for newly initialized Git repositories?*

- **Target Answer**: `main`
- **Typed Misconception ID**: `MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'master'**:
  - *What Went Wrong*: master is legacy. The modern universal standard is main.
  - *Simpler Mental Model*: Type main.
  - *Guided Fix Action*: Type main

---

## 📅 Day 3: The Three Trees Architecture: Working Directory, Staging Area & Commit History

> **💡 Everyday Metaphor / Intuitive Model**:
> The Three Trees Are a Photographer's Studio: The Working Directory is your live chaotic photo stage (Untracked props & modified clothing); the Staging Area (`git add`) is the camera viewfinder framing the exact snapshot; pressing the camera shutter (`git commit`) freezes that frame permanently into the historical photo album (`COMMITTED_CLEAN`).

### 🔹 Block 1: Three Trees States: Untracked $\to$ Staged $\to$ `COMMITTED_CLEAN`

- **Concept Budget / Primary Invariant**: `Three-Tree File State Transition Engine`
- **Supporting Terms & Invariants**: `Untracked File State`, `Staged Index State`, `Working Tree Clean (`true`)`, `State (`'COMMITTED_CLEAN'`)`, `Status: Working Tree Clean Nominal`

#### 📦 Memory Box / Data Layout Diagram: The Three Trees Computational Pipeline Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Tree 1: Working Tree** | Files on disk (Untracked, Modified, Deleted) | `Working Tree` |
| **Tree 2: Staging Area (Index)** | .git/index (Prepared snapshot via `git add`) | `Index` |
| **Tree 3: Commit History (HEAD)** | .git/objects (Immutable commit snapshots -> COMMITTED_CLEAN!) | `HEAD` |

#### 🐙 Runnable Git Simulator: `three_trees_demo.js`

```javascript
function trackState(hist, disk, staged) {
  if (hist === 'NONE' && !staged) return { state: 'UNTRACKED', isClean: false };
  if (staged) return { state: 'STAGED', isClean: false };
  if (disk) return { state: 'MODIFIED', isClean: false };
  return { state: 'COMMITTED_CLEAN', isClean: true, status: 'WORKING_TREE_CLEAN_NOMINAL' };
}

console.log(JSON.stringify(trackState('COMMITTED', false, false)));
console.log(JSON.stringify(trackState('NONE', true, false)));
```

**Expected Terminal Output**:
```text
{"state":"COMMITTED_CLEAN","isClean":true,"status":"WORKING_TREE_CLEAN_NOMINAL"}
{"state":"UNTRACKED","isClean":false}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What state is assigned to a file when disk changes are committed and the working tree is completely synchronized with HEAD?*

- **Target Answer**: `COMMITTED_CLEAN`
- **Typed Misconception ID**: `MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'STAGED'**:
  - *What Went Wrong*: Staged means waiting for commit. Once committed, state becomes COMMITTED_CLEAN.
  - *Simpler Mental Model*: State is COMMITTED_CLEAN.
  - *Guided Fix Action*: Type COMMITTED_CLEAN

---

### 🔹 Block 2: The Atomic Commit Philosophy: One Logical Change per Commit

- **Concept Budget / Primary Invariant**: `Atomic Commit Invariant`
- **Supporting Terms & Invariants**: `Atomic Commit (A single, indivisible unit of work that implements one feature or bugfix; if reverted, it cleanly removes the feature without breaking unrelated code)`

#### ⚙️ Syntax & Command Anatomy: Atomic Commit Rules

```text
// ❌ ANTI-PATTERN: git add . && git commit -m "fixed 10 bugs, refactored database, and changed css"
// ✅ ATOMIC COMMIT: git commit -m "fix(auth): resolve JWT expiration bug"
//                  git commit -m "refactor(db): optimize user query index"
```

- **Line 1**: Messy compound commit impossible to bisect or revert cleanly.
- **Line 2**: Atomic isolated unit of work 1.
- **Line 3**: Atomic isolated unit of work 2.

#### 🐙 Runnable Git Simulator: `atomic_commit_demo.js`

```javascript
function getAtomicCommitRule() {
  return 'EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE';
}

console.log(getAtomicCommitRule());
```

**Expected Terminal Output**:
```text
EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What core engineering principle dictates that each Git commit should contain exactly one single, complete logical unit of work?*

- **Target Answer**: `EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE`
- **Typed Misconception ID**: `MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'LARGE'**:
  - *What Went Wrong*: Mega-commits harm debugging: EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE.
  - *Simpler Mental Model*: Matches EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE.
  - *Guided Fix Action*: Type EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE

---

### 🔹 Block 3: Interactive Staging: `git add -p` (Staging Specific Hunks)

- **Concept Budget / Primary Invariant**: `Interactive Hunk Staging Invariant`
- **Supporting Terms & Invariants**: ``git add -p` (Allows developers to review and selectively stage individual code hunks `[y,n,q,a,d,s,e]` within a single modified file)`

#### 🐙 Runnable Git Simulator: `add_patch_demo.js`

```javascript
function getGitAddPatchFlag() {
  return '-p';
}

console.log(getGitAddPatchFlag());
```

**Expected Terminal Output**:
```text
-p
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git add` enables interactive hunk-by-hunk code staging?*

- **Target Answer**: `-p`
- **Typed Misconception ID**: `MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers '-A'**:
  - *What Went Wrong*: -A stages all files indiscriminately. Interactive hunk staging uses -p.
  - *Simpler Mental Model*: Type -p.
  - *Guided Fix Action*: Type -p

---

## 📅 Day 4: Git Status & Inspection Mechanics: `git status -s`, `git diff` & Conventional Commits

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Status Is an Airport Departure Screen: The two-column short code display (` M` vs `M `) tells you which flights are boarding at the staging gate (`M `) vs which flights are still in the terminal lobby (` M`); Conventional Commit prefixes (`feat:`, `fix:`) ensure flight manifests are machine-readable for automated changelog generation.

### 🔹 Block 1: Conventional Commits: `feat(auth): add JWT authentication endpoint`

- **Concept Budget / Primary Invariant**: `Conventional Commit Parser & Semantic Type Validator`
- **Supporting Terms & Invariants**: `Commit Type (`'feat'`)`, `Commit Scope (`'auth'`)`, `Commit Description (`'add JWT authentication endpoint'`)`, `Commit Validity (`true`)`, `Status: Conventional Commit Valid Nominal`

#### 📦 Memory Box / Data Layout Diagram: Conventional Commit Structure Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Type Prefix** | 'feat' (New feature introduction for user) | `Type` |
| **Optional Scope** | '(auth)' (Authentication module boundary) | `Scope` |
| **Imperative Message** | 'add JWT authentication endpoint' (CONVENTIONAL COMMIT VALID NOMINAL!) | `Desc` |

#### 🐙 Runnable Git Simulator: `conventional_commit_demo.js`

```javascript
function parseCommit(msg) {
  const m = msg.match(/^(feat|fix|docs|style|refactor|perf|test|chore)(\([a-z0-9-]+\))?: (.+)$/);
  if (!m) return { isValid: false, status: 'CONVENTIONAL_COMMIT_INVALID' };
  return {
    isValid: true,
    type: m[1],
    scope: m[2] ? m[2].replace(/[()]/g, '') : null,
    desc: m[3],
    status: 'CONVENTIONAL_COMMIT_VALID_NOMINAL'
  };
}

console.log(JSON.stringify(parseCommit('feat(auth): add JWT authentication endpoint')));
console.log(JSON.stringify(parseCommit('updated code')));
```

**Expected Terminal Output**:
```text
{"isValid":true,"type":"feat","scope":"auth","desc":"add JWT authentication endpoint","status":"CONVENTIONAL_COMMIT_VALID_NOMINAL"}
{"isValid":false,"status":"CONVENTIONAL_COMMIT_INVALID"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What semantic commit type prefix is extracted from `'feat(auth): add JWT authentication endpoint'`?*

- **Target Answer**: `feat`
- **Typed Misconception ID**: `MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'auth'**:
  - *What Went Wrong*: auth is the scope. The commit type prefix is feat.
  - *Simpler Mental Model*: Type is feat.
  - *Guided Fix Action*: Type feat

---

### 🔹 Block 2: Two-Column `git status -s`: Column 1 (Index) vs Column 2 (Working Tree)

- **Concept Budget / Primary Invariant**: `Short Status Format Invariant`
- **Supporting Terms & Invariants**: `Two-Column Short Format (`XY`: Column X = Staged in Index; Column Y = Unstaged in Working Tree; ` M` = modified on disk unstaged; `M ` = modified and staged)`

#### ⚙️ Syntax & Command Anatomy: git status -s Code Matrix

```text
// ?? file.txt  -> Untracked file
//  M file.txt  -> Modified in Working Tree, NOT staged
// M  file.txt  -> Modified and STAGED in Index
// MM file.txt  -> Modified, staged, then modified AGAIN in working tree!
// A  file.txt  -> Added and staged
```

- **Line 1**: Untracked.
- **Line 2**: Unstaged modification.
- **Line 3**: Staged modification.
- **Line 4**: Staged with further unstaged edits.
- **Line 5**: Newly added.

#### 🐙 Runnable Git Simulator: `status_short_demo.js`

```javascript
function getShortStatusCodeMeaning() {
  return 'COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE';
}

console.log(getShortStatusCodeMeaning());
```

**Expected Terminal Output**:
```text
COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *In `git status -s`, what do the first and second columns respectively indicate?*

- **Target Answer**: `COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE`
- **Typed Misconception ID**: `MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'REVERSE'**:
  - *What Went Wrong*: Column 1 is Index. Column 2 is Working Tree: COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE.
  - *Simpler Mental Model*: Matches COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE.
  - *Guided Fix Action*: Type COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE

---

### 🔹 Block 3: `git diff` (Working Tree) vs `git diff --staged` (Staged Index)

- **Concept Budget / Primary Invariant**: `Git Diff Staged Invariant`
- **Supporting Terms & Invariants**: ``git diff` (Shows unstaged edits between Working Tree and Index)`, ``git diff --staged` (Shows staged edits between Index and HEAD that WILL be included in the next commit)`

#### 🐙 Runnable Git Simulator: `diff_staged_demo.js`

```javascript
function getDiffStagedCommand() {
  return 'git diff --staged';
}

console.log(getDiffStagedCommand());
```

**Expected Terminal Output**:
```text
git diff --staged
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git command displays exact line diffs for changes currently staged in the index ready to be committed?*

- **Target Answer**: `git diff --staged`
- **Typed Misconception ID**: `MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git diff'**:
  - *What Went Wrong*: git diff only shows unstaged edits. Staged edits require git diff --staged.
  - *Simpler Mental Model*: Type git diff --staged.
  - *Guided Fix Action*: Type git diff --staged

---

## 📅 Day 5: ⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 1 Synthesis: The complete foundational Git version control engine: 1. Low-level object header formatting (`blob 12\0`); 2. Author identity validation (`alice@company.com`); 3. Three-Tree state transitions (`COMMITTED_CLEAN`); 4. Conventional commit parsing (`feat(auth)`).

### 🔹 Block 1: Git Foundations Master Kernel Synthesis

- **Concept Budget / Primary Invariant**: `Git Foundations Master Kernel`
- **Supporting Terms & Invariants**: `Object Storage Engine`, `Author Identity Engine`, `Three Trees State Engine`, `Conventional Commit Engine`

#### 🔄 Computing System Execution Flowchart: Milestone 1 Git Foundations Pipeline

1. **Constructs raw Git object headers (blob 12\0)**
2. **Validates author identity credentials (Alice Smith <alice@company.com>)**
3. **Tracks three-tree state transitions to COMMITTED_CLEAN**
4. **Parses conventional commits (feat(auth)) & activates Foundations kernel!**

#### 🐙 Runnable Git Simulator: `git_kernel_demo.js`

```javascript
function runGitFoundations() {
  return {
    objectSubsystem: 'ONLINE_BLOB_HEADER_ACTIVE',
    identitySubsystem: 'ONLINE_AUTHOR_ALICE_ACTIVE',
    treeSubsystem: 'ONLINE_COMMITTED_CLEAN_ACTIVE',
    commitSubsystem: 'ONLINE_CONVENTIONAL_FEAT_ACTIVE',
    engineStatus: 'GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL'
  };
}

console.log(runGitFoundations().engineStatus);
```

**Expected Terminal Output**:
```text
GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the Git Foundations Master Kernel?*

- **Target Answer**: `GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL`
- **Typed Misconception ID**: `MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL

---

### 🔹 Block 2: Git Foundations Engine Invariant Verification & Precision Audit

- **Concept Budget / Primary Invariant**: `Git Foundations Invariant Verification`
- **Supporting Terms & Invariants**: `Storage Invariant`, `Tree Invariant`, `100% Quality Invariant`

#### 🐙 Runnable Git Simulator: `git_audit_demo.js`

```javascript
function auditGit(o, a, t, c) {
  const passed = o && a && t && c;
  return {
    objectsVerified: o,
    authorVerified: a,
    treesVerified: t,
    commitsVerified: c,
    grade: passed ? 'GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditGit(true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"objectsVerified":true,"authorVerified":true,"treesVerified":true,"commitsVerified":true,"grade":"GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when Object Model, Author Identity, Three Trees, and Conventional Commits pass 100%?*

- **Target Answer**: `GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED.
  - *Guided Fix Action*: Type GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 1 Git Foundations Certification

- **Concept Budget / Primary Invariant**: `Milestone 1 Certification`
- **Supporting Terms & Invariants**: `Git Foundations Verified`, `100% Quality Invariant`

#### 🐙 Runnable Git Simulator: `milestone1_git_cert.js`

```javascript
console.log('⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 1 completion?*

- **Target Answer**: `⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]

---

## 📅 Day 6: File Ignoring & Repository Hygiene: `.gitignore` Rules & `git rm --cached`

> **💡 Everyday Metaphor / Intuitive Model**:
> `.gitignore` Is a Security Gate at a Chemical Cleanroom: It blocks dirty build dust (`node_modules/`, `dist/`), temporary logs (`*.log`), and confidential passcodes (`.env`) from ever entering the sterile repository; if someone accidentally tracks a secret file, `git rm --cached` un-indexes it without deleting the file from your local computer disk.

### 🔹 Block 1: `.gitignore` Pattern Matching: Wildcards (`*.log`) & Negation (`!important.log`)

- **Concept Budget / Primary Invariant**: `.gitignore Glob Pattern Matcher & Filter Evaluator`
- **Supporting Terms & Invariants**: `Target Path (`'server.log'` $\to$ Ignored)`, `Exception Path (`'important.log'` $\to$ Tracked)`, `Status: File Ignored by Gitignore Rule`

#### 📦 Memory Box / Data Layout Diagram: .gitignore Glob Evaluation Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Rule 1: 'node_modules/'** | Ignores all files within node_modules directories | `Dir Rule` |
| **Rule 2: '*.log'** | Ignores server.log, debug.log, error.log | `Wildcard` |
| **Rule 3: '!important.log'** | Negation Exception -> important.log is TRACKED (EVALUATED NOMINAL!) | `Negation` |

#### 🐙 Runnable Git Simulator: `gitignore_demo.js`

```javascript
function checkIgnore(path, patterns) {
  let ignored = false;
  for (const p of patterns) {
    if (p.startsWith('!') && path.endsWith(p.slice(1))) { ignored = false; continue; }
    if (p.startsWith('*') && path.endsWith(p.slice(1))) ignored = true;
    else if (p.endsWith('/') && path.includes(p)) ignored = true;
  }
  return {
    path,
    isIgnored: ignored,
    status: ignored ? 'FILE_IGNORED_BY_GITIGNORE_RULE' : 'FILE_TRACKED_IN_REPOSITORY'
  };
}

const rules = ['node_modules/', '*.log', '!important.log'];
console.log(JSON.stringify(checkIgnore('server.log', rules)));
console.log(JSON.stringify(checkIgnore('important.log', rules)));
```

**Expected Terminal Output**:
```text
{"path":"server.log","isIgnored":true,"status":"FILE_IGNORED_BY_GITIGNORE_RULE"}
{"path":"important.log","isIgnored":false,"status":"FILE_TRACKED_IN_REPOSITORY"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Is 'important.log' ignored when .gitignore contains rules `*.log` followed by `!important.log`?*

- **Target Answer**: `false`
- **Typed Misconception ID**: `MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'true'**:
  - *What Went Wrong*: The exclamation mark ! is a negative exception that re-includes the file: isIgnored: false.
  - *Simpler Mental Model*: Negation re-includes file -> false.
  - *Guided Fix Action*: Type false

---

### 🔹 Block 2: Untracking Committed Files: `git rm --cached <file>` vs `git rm <file>`

- **Concept Budget / Primary Invariant**: `git rm --cached Invariant`
- **Supporting Terms & Invariants**: ``git rm --cached <file>` (Removes file from Git tracking/index while keeping the physical file intact on your local hard drive)`

#### ⚙️ Syntax & Command Anatomy: git rm Command Differences

```text
// ❌ DANGEROUS: git rm .env         (Deletes .env from Git tracking AND deletes it from hard drive!)
// ✅ SAFE:      git rm --cached .env (Removes .env from Git tracking BUT PRESERVES file on disk!)
```

- **Line 1**: Deletes local disk file.
- **Line 2**: Preserves local disk file.

#### 🐙 Runnable Git Simulator: `rm_cached_demo.js`

```javascript
function getUntrackWithoutDeleteCommand() {
  return 'git rm --cached';
}

console.log(getUntrackWithoutDeleteCommand());
```

**Expected Terminal Output**:
```text
git rm --cached
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git command removes an already-tracked file from the repository index without deleting it from your local filesystem?*

- **Target Answer**: `git rm --cached`
- **Typed Misconception ID**: `MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git rm'**:
  - *What Went Wrong*: git rm deletes the physical file from disk. Safe untracking requires git rm --cached.
  - *Simpler Mental Model*: Type git rm --cached.
  - *Guided Fix Action*: Type git rm --cached

---

### 🔹 Block 3: Directory Slashes: Trailing Slash `/` vs Leading Slash `/` in Rules

- **Concept Budget / Primary Invariant**: `Gitignore Slash Anchoring Invariant`
- **Supporting Terms & Invariants**: `Leading Slash (`/build`: Only matches build at the repository root)`, `Trailing Slash (`dist/`: Matches any directory named dist at any depth in the repository tree)`

#### 🐙 Runnable Git Simulator: `slash_anchor_demo.js`

```javascript
function getLeadingSlashMeaning() {
  return 'LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY';
}

console.log(getLeadingSlashMeaning());
```

**Expected Terminal Output**:
```text
LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What does a leading forward slash in a `.gitignore` pattern (e.g. `/docs`) enforce?*

- **Target Answer**: `LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY`
- **Typed Misconception ID**: `MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'ANY'**:
  - *What Went Wrong*: Without leading slash matches anywhere. Leading slash uses LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY.
  - *Simpler Mental Model*: Matches LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY.
  - *Guided Fix Action*: Type LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY

---

## 📅 Day 7: Undoing Local Changes: `git restore`, Unstaging & `git commit --amend`

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Restore Is an Undo Button on a Word Processor: If you type bad code on disk, `git restore <file>` discards the edits and restores the file from the index; if you staged files by mistake, `git restore --staged <file>` takes them out of the staging box without touching your disk; if you made a typo in your commit message, `git commit --amend` updates it instantly.

### 🔹 Block 1: Modern Undo: `git restore --staged <file>` vs `git restore <file>`

- **Concept Budget / Primary Invariant**: `Git Local Undo Command Dispatcher`
- **Supporting Terms & Invariants**: `Unstage Files (`'git restore --staged <file>'`)`, `Discard Working Changes (`'git restore <file>'`)`, `Amend Commit (`'git commit --amend --no-edit'`)`, `Status: Git Undo Command Dispatched Nominal`

#### 📦 Memory Box / Data Layout Diagram: Modern Git Undo Command Mapping Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Target: Discard Disk Edits** | git restore <file> (Restores working file from Index) | `Working Tree` |
| **Target: Unstage Staged File** | git restore --staged <file> (Restores Index from HEAD) | `Index` |
| **Target: Amend Previous Commit** | git commit --amend --no-edit (GIT UNDO COMMAND DISPATCHED NOMINAL!) | `HEAD` |

#### 🐙 Runnable Git Simulator: `undo_dispatch_demo.js`

```javascript
function dispatchUndo(target) {
  const map = {
    'UNSTAGE_FILES': 'git restore --staged <file>',
    'DISCARD_WORKING_CHANGES': 'git restore <file>',
    'AMEND_PREVIOUS_COMMIT': 'git commit --amend --no-edit'
  };
  return {
    target,
    command: map[target],
    status: 'GIT_UNDO_COMMAND_DISPATCHED_NOMINAL'
  };
}

console.log(JSON.stringify(dispatchUndo('UNSTAGE_FILES')));
console.log(JSON.stringify(dispatchUndo('DISCARD_WORKING_CHANGES')));
```

**Expected Terminal Output**:
```text
{"target":"UNSTAGE_FILES","command":"git restore --staged <file>","status":"GIT_UNDO_COMMAND_DISPATCHED_NOMINAL"}
{"target":"DISCARD_WORKING_CHANGES","command":"git restore <file>","status":"GIT_UNDO_COMMAND_DISPATCHED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What modern Git command unstages a file from the staging area while preserving all edits in the working directory?*

- **Target Answer**: `git restore --staged <file>`
- **Typed Misconception ID**: `MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git restore <file>'**:
  - *What Went Wrong*: git restore <file> discards working tree changes. Unstaging requires the --staged flag.
  - *Simpler Mental Model*: Use --staged: git restore --staged <file>.
  - *Guided Fix Action*: Type git restore --staged <file>

---

### 🔹 Block 2: Amending Commits: `git commit --amend` Rewriting the Most Recent Commit

- **Concept Budget / Primary Invariant**: `git commit --amend Invariant`
- **Supporting Terms & Invariants**: `Commit Amend (Combines staged changes with the previous commit and allows rewording the commit message; creates a NEW SHA hash replacing the previous commit)`

#### ⚙️ Syntax & Command Anatomy: Amending Workflow

```text
// 1. Made a commit with a typo: git commit -m "featt: add login"
// 2. Fix the message without creating a new commit:
//    git commit --amend -m "feat: add login"
// 3. Forgot to add a file? Stage it, then: git commit --amend --no-edit
```

- **Line 1**: Initial typo commit.
- **Line 2**: Rewording message.
- **Line 3**: Adding forgotten files without prompt.

#### 🐙 Runnable Git Simulator: `amend_demo.js`

```javascript
function getAmendNoEditFlag() {
  return '--no-edit';
}

console.log(getAmendNoEditFlag());
```

**Expected Terminal Output**:
```text
--no-edit
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git commit --amend` includes newly staged files into the previous commit without prompting to edit the commit message?*

- **Target Answer**: `--no-edit`
- **Typed Misconception ID**: `MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND`

**Diagnostic Recovery Paths**:
- **If Student Triggers '-m'**:
  - *What Went Wrong*: -m supplies a new message. Retaining the existing message uses --no-edit.
  - *Simpler Mental Model*: Type --no-edit.
  - *Guided Fix Action*: Type --no-edit

---

### 🔹 Block 3: Cleaning Untracked Artifacts: `git clean -fd`

- **Concept Budget / Primary Invariant**: `git clean Invariant`
- **Supporting Terms & Invariants**: ``git clean -fd` (`-f` force, `-d` include directories: Permanently deletes all untracked files and directories from the working tree)`

#### 🐙 Runnable Git Simulator: `git_clean_demo.js`

```javascript
function getGitCleanCommand() {
  return 'git clean -fd';
}

console.log(getGitCleanCommand());
```

**Expected Terminal Output**:
```text
git clean -fd
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git command forcibly removes all untracked files and directories from the working tree?*

- **Target Answer**: `git clean -fd`
- **Typed Misconception ID**: `MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git restore'**:
  - *What Went Wrong*: git restore only affects tracked files. Deleting untracked files uses git clean -fd.
  - *Simpler Mental Model*: Type git clean -fd.
  - *Guided Fix Action*: Type git clean -fd

---

## 📅 Day 8: Git History Inspection: `git log --oneline --graph`, `git show` & Pickaxe Search

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Pickaxe Search Is a Metal Detector on a Forensic Crime Scene: When a critical API key (`STRIPE_KEY = "sk_test_123"`) is found leaked in production, `git log -S "STRIPE_KEY"` scans every commit diff in the repository's entire history, pinning the exact commit hash (`a1b2c3d`) and author who introduced the leak.

### 🔹 Block 1: Pickaxe Search: `git log -S "STRIPE_KEY"` $\to$ Commit `a1b2c3d` Found

- **Concept Budget / Primary Invariant**: `Git Pickaxe String Search & History Audit Engine`
- **Supporting Terms & Invariants**: `Search Query (`'STRIPE_KEY'`)`, `Matched Commit SHA (`'a1b2c3d'`)`, `Matched Count ($1$ commit)`, `Author (`'Alice'`)`, `Status: Git Pickaxe Search Completed Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Pickaxe Forensic Code Search Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Search Target String** | 'STRIPE_KEY' (Looking for introduction or deletion) | `Query` |
| **Scanned Commit Diff** | + const STRIPE_KEY = "sk_test_123"; (Introduced in commit a1b2c3d) | `Diff` |
| **Forensic Audit Result** | Commit: a1b2c3d | Author: Alice (GIT PICKAXE SEARCH COMPLETED NOMINAL!) | `Result` |

#### 🐙 Runnable Git Simulator: `pickaxe_demo.js`

```javascript
function searchPickaxe(history, query) {
  const matched = history.filter(c => c.diff.includes(query));
  return {
    query,
    matchedCount: matched.length,
    sha: matched[0]?.sha,
    status: 'GIT_PICKAXE_SEARCH_COMPLETED_NOMINAL'
  };
}

const hist = [
  { sha: 'a1b2c3d', message: 'feat: add stripe integration', diff: '+ const STRIPE_KEY = "sk_test_123";' },
  { sha: 'e4f5g6h', message: 'docs: update readme', diff: '+ # Readme' }
];
console.log(JSON.stringify(searchPickaxe(hist, 'STRIPE_KEY')));
```

**Expected Terminal Output**:
```text
{"query":"STRIPE_KEY","matchedCount":1,"sha":"a1b2c3d","status":"GIT_PICKAXE_SEARCH_COMPLETED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git log` activates the Pickaxe search engine to find commits that introduced or deleted a specific string?*

- **Target Answer**: `-S`
- **Typed Misconception ID**: `MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers '--grep'**:
  - *What Went Wrong*: --grep searches commit messages. Searching actual code diff changes uses the Pickaxe -S flag.
  - *Simpler Mental Model*: Type -S.
  - *Guided Fix Action*: Type -S

---

### 🔹 Block 2: ASCII Topology Visualization: `git log --oneline --graph --all`

- **Concept Budget / Primary Invariant**: `Git Log Topology Formatting Invariant`
- **Supporting Terms & Invariants**: ``git log --oneline --graph --all` (Renders a colorful ASCII tree showing branch divergences, merges, HEAD location, and commit messages on single lines)`

#### ⚙️ Syntax & Command Anatomy: git log Visualization Command

```text
// git log --oneline --graph --decorate --all
// * 4b825dc (HEAD -> main, origin/main) feat: add payment webhook
// | * c789abc (feature-login) feat: add OAuth2 login
// |/  
// * e4f5g6h chore: initial commit
```

- **Line 1**: Comprehensive log inspection command.
- **Line 2**: Active branch HEAD pointer.
- **Line 3**: Feature branch divergence.
- **Line 4**: Branch fork point.
- **Line 5**: Common ancestor.

#### 🐙 Runnable Git Simulator: `git_log_demo.js`

```javascript
function getLogGraphCommand() {
  return 'git log --oneline --graph --all';
}

console.log(getLogGraphCommand());
```

**Expected Terminal Output**:
```text
git log --oneline --graph --all
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git log command renders an ASCII graphical tree diagram of all branch topologies across the repository?*

- **Target Answer**: `git log --oneline --graph --all`
- **Typed Misconception ID**: `MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git status'**:
  - *What Went Wrong*: git status shows working tree. Branch graph inspection uses git log --oneline --graph --all.
  - *Simpler Mental Model*: Type git log --oneline --graph --all.
  - *Guided Fix Action*: Type git log --oneline --graph --all

---

### 🔹 Block 3: Metadata Invariant: Author Date vs Committer Date in `git show`

- **Concept Budget / Primary Invariant**: `Author vs Committer Timestamp Invariant`
- **Supporting Terms & Invariants**: `Author Date (When the code was originally authored)`, `Committer Date (When the commit was created, amended, rebased, or cherry-picked by a developer)`

#### 🐙 Runnable Git Simulator: `author_committer_demo.js`

```javascript
function getAuthorVsCommitterRule() {
  return 'AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND';
}

console.log(getAuthorVsCommitterRule());
```

**Expected Terminal Output**:
```text
AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do Git Author Date and Committer Date timestamps differ on a rebased commit?*

- **Target Answer**: `AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND`
- **Typed Misconception ID**: `MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'IDENTICAL'**:
  - *What Went Wrong*: Rebasing updates committer timestamp: AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND.
  - *Simpler Mental Model*: Matches AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND.
  - *Guided Fix Action*: Type AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND

---

## 📅 Day 9: Git Branching Architecture: Pointer Mechanics & Fast-Forward Merges

> **💡 Everyday Metaphor / Intuitive Model**:
> A Git Branch Is a Sticky Bookmark in a Book, Not a Separate Copy of the Library: The bookmark (`main` or `feature-login`) is simply a 41-byte text file pointing to a commit SHA; creating a branch (`git switch -c feature`) simply pastes a new sticky note on the current page, moving effortlessly with zero disk overhead.

### 🔹 Block 1: Branch Pointer Mechanics: Advancing `main` $\to$ Commit `f9e8d7c`

- **Concept Budget / Primary Invariant**: `Git Branch Pointer Advance Engine`
- **Supporting Terms & Invariants**: `Branch Name (`'main'`)`, `Previous SHA (`'a1b2c3d'`)`, `Current SHA (`'f9e8d7c'`)`, `Ref Path (`'.git/refs/heads/main'`)`, `Status: Branch Pointer Advanced Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Branch Pointer Ref File Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Ref File Path** | .git/refs/heads/main (41-byte ASCII text file) | `Ref File` |
| **Previous Target** | Commit: a1b2c3d | `Old SHA` |
| **Advanced Target** | Commit: f9e8d7c (BRANCH POINTER ADVANCED NOMINAL!) | `New SHA` |

#### 🐙 Runnable Git Simulator: `branch_pointer_demo.js`

```javascript
function advanceBranch(branch, oldSha, newSha) {
  return {
    branch,
    currentSha: newSha,
    refPath: `.git/refs/heads/${branch}`,
    status: 'BRANCH_POINTER_ADVANCED_NOMINAL'
  };
}

console.log(JSON.stringify(advanceBranch('main', 'a1b2c3d', 'f9e8d7c')));
```

**Expected Terminal Output**:
```text
{"branch":"main","currentSha":"f9e8d7c","refPath":".git/refs/heads/main","status":"BRANCH_POINTER_ADVANCED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Where in the `.git` directory structure does Git store local branch pointers?*

- **Target Answer**: `.git/refs/heads/main`
- **Typed Misconception ID**: `MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers '.git/branches'**:
  - *What Went Wrong*: Git stores branch refs under .git/refs/heads/main.
  - *Simpler Mental Model*: Path is .git/refs/heads/main.
  - *Guided Fix Action*: Type .git/refs/heads/main

---

### 🔹 Block 2: Fast-Forward Merges: Moving the Branch Pointer Forward with No New Commit

- **Concept Budget / Primary Invariant**: `Fast-Forward Merge Invariant`
- **Supporting Terms & Invariants**: `Fast-Forward (`Fast-forward`: Occurs when the target branch has no divergent commits since the feature branch was created; Git simply slides the pointer forward without creating a merge commit)`

#### ⚙️ Syntax & Command Anatomy: Fast-Forward Pointer Movement

```text
// BEFORE MERGE: main -> C1; feature -> C1 -> C2 -> C3
// COMMAND:      git switch main && git merge feature
// AFTER MERGE:  Fast-forward: main -> C3 (No merge commit created!)
```

- **Line 1**: Linear divergence without main commits.
- **Line 2**: Merge execution.
- **Line 3**: Pointer slides directly to C3.

#### 🐙 Runnable Git Simulator: `fast_forward_demo.js`

```javascript
function getFastForwardMergeRule() {
  return 'FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT';
}

console.log(getFastForwardMergeRule());
```

**Expected Terminal Output**:
```text
FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What occurs during a Git Fast-Forward merge when the target branch has no divergent commits?*

- **Target Answer**: `FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT`
- **Typed Misconception ID**: `MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'MERGE_COMMIT'**:
  - *What Went Wrong*: Fast-forward creates no commit: FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT.
  - *Simpler Mental Model*: Matches FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT.
  - *Guided Fix Action*: Type FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT

---

### 🔹 Block 3: Modern Branch Switching: `git switch` Replacing Overloaded `git checkout`

- **Concept Budget / Primary Invariant**: `git switch Invariant`
- **Supporting Terms & Invariants**: ``git switch <branch>` (Introduced in Git 2.23 to cleanly separate branch switching from file restoring `git restore`)`

#### 🐙 Runnable Git Simulator: `switch_demo.js`

```javascript
function getModernSwitchCommand() {
  return 'git switch -c';
}

console.log(getModernSwitchCommand());
```

**Expected Terminal Output**:
```text
git switch -c
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What modern Git command creates and immediately switches to a new branch in a single command?*

- **Target Answer**: `git switch -c`
- **Typed Misconception ID**: `MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git checkout -b'**:
  - *What Went Wrong*: checkout -b is legacy. Modern Git uses git switch -c.
  - *Simpler Mental Model*: Type git switch -c.
  - *Guided Fix Action*: Type git switch -c

---

## 📅 Day 10: 3-Way Merge Mechanics: Common Ancestor (`merge-base`), Recursive & ORT Merges

> **💡 Everyday Metaphor / Intuitive Model**:
> A 3-Way Merge Is a Triangle DNA Paternity Test for Code: When Alice and Bob both make independent changes on separate branches, Git finds their common ancestor parent (`merge-base`); if Alice changed line 1 and Bob changed line 50, Git merges both changes automatically into a dual-parent commit (`parentCount: 2`) without conflicts.

### 🔹 Block 1: 3-Way Merge Commit: Combining Dual Parents (`main456` & `feat789`)

- **Concept Budget / Primary Invariant**: `3-Way Merge Common Ancestor & Dual Parent Generator`
- **Supporting Terms & Invariants**: `Merge Base SHA (`'base123'`)`, `Parent 1 SHA (`'main456'`)`, `Parent 2 SHA (`'feat789'`)`, `Parent Count ($2$ parents)`, `Status: Three-Way Merge Commit Generated Nominal`

#### 📦 Memory Box / Data Layout Diagram: 3-Way Merge Dual-Parent Topology Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Common Ancestor** | merge-base SHA: base123 | `Ancestor` |
| **Parent 1 (Ours)** | Commit: main456 (Current active HEAD) | `Parent 1` |
| **Parent 2 (Theirs)** | Commit: feat789 (Incoming topic branch) | `Parent 2` |
| **Merge Commit Record** | Dual Parents: [main456, feat789] (MERGE COMMIT GENERATED NOMINAL!) | `Merge Node` |

#### 🐙 Runnable Git Simulator: `three_way_merge_demo.js`

```javascript
function createMergeCommit(base, p1, p2, msg) {
  return {
    base,
    parent1: p1,
    parent2: p2,
    parentCount: 2,
    message: msg,
    isThreeWayMerge: true,
    status: 'THREE_WAY_MERGE_COMMIT_GENERATED_NOMINAL'
  };
}

console.log(JSON.stringify(createMergeCommit('base123', 'main456', 'feat789', 'Merge feature into main')));
```

**Expected Terminal Output**:
```text
{"base":"base123","parent1":"main456","parent2":"feat789","parentCount":2,"message":"Merge feature into main","isThreeWayMerge":true,"status":"THREE_WAY_MERGE_COMMIT_GENERATED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many parent commit hashes are referenced by a standard non-fast-forward 3-way merge commit?*

- **Target Answer**: `2`
- **Typed Misconception ID**: `MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF`

**Diagnostic Recovery Paths**:
- **If Student Triggers '1'**:
  - *What Went Wrong*: Standard commits have 1 parent. Merge commits reference 2 parents.
  - *Simpler Mental Model*: Type 2.
  - *Guided Fix Action*: Type 2

---

### 🔹 Block 2: Emergency Exit: `git merge --abort` Restoring Pre-Merge State

- **Concept Budget / Primary Invariant**: `git merge --abort Invariant`
- **Supporting Terms & Invariants**: ``git merge --abort` (Safely terminates a conflicted merge in progress and restores the working tree and index to the exact state prior to running `git merge`)`

#### ⚙️ Syntax & Command Anatomy: Merge Abort Command

```text
// $ git merge feature-auth
// Automatic merge failed; fix conflicts and then commit the result.
// $ git merge --abort
// -> Instantly restores working directory and HEAD back to clean main!
```

- **Line 1**: Merge execution.
- **Line 2**: Conflict encountered.
- **Line 3**: Safe abort command.
- **Line 4**: Clean restoration.

#### 🐙 Runnable Git Simulator: `merge_abort_demo.js`

```javascript
function getMergeAbortCommand() {
  return 'git merge --abort';
}

console.log(getMergeAbortCommand());
```

**Expected Terminal Output**:
```text
git merge --abort
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What command aborts a conflicted merge operation and returns the working tree to its exact pre-merge state?*

- **Target Answer**: `git merge --abort`
- **Typed Misconception ID**: `MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git reset --hard'**:
  - *What Went Wrong*: git reset --hard can destroy uncommitted work. The official safe merge abort command is git merge --abort.
  - *Simpler Mental Model*: Type git merge --abort.
  - *Guided Fix Action*: Type git merge --abort

---

### 🔹 Block 3: Preserving Branch Topology: `git merge --no-ff`

- **Concept Budget / Primary Invariant**: `--no-ff Merge Invariant`
- **Supporting Terms & Invariants**: ``--no-ff` (Forces Git to create a merge commit even if a fast-forward is possible, preserving the historical existence and boundary of the feature branch)`

#### 🐙 Runnable Git Simulator: `no_ff_demo.js`

```javascript
function getNoFfFlag() {
  return '--no-ff';
}

console.log(getNoFfFlag());
```

**Expected Terminal Output**:
```text
--no-ff
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git merge` forces the creation of a merge commit even when a fast-forward merge is possible?*

- **Target Answer**: `--no-ff`
- **Typed Misconception ID**: `MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF`

**Diagnostic Recovery Paths**:
- **If Student Triggers '--ff-only'**:
  - *What Went Wrong*: --ff-only rejects merges if fast-forward is impossible. Forcing merge commits uses --no-ff.
  - *Simpler Mental Model*: Type --no-ff.
  - *Guided Fix Action*: Type --no-ff

---

## 📅 Day 11: Merge Conflict Detection & Resolution: Conflict Markers (`<<<<<<< HEAD`)

> **💡 Everyday Metaphor / Intuitive Model**:
> A Merge Conflict Is Two Co-Authors Editing the Exact Same Sentence in a Book: Author 1 writes 'The door was red' while Author 2 writes 'The door was blue'; Git stops the printing press, inserting `<<<<<<< HEAD` around both sentences so the human editor can resolve the conflict cleanly to 'The door was blue with red trim'.

### 🔹 Block 1: Conflict Resolution: Resolving `<<<<<<< HEAD` to `'const PORT = 3000;'`

- **Concept Budget / Primary Invariant**: `Merge Conflict Marker Parser & Clean Resolution Guard`
- **Supporting Terms & Invariants**: `Conflict Text Block`, `Chosen Side (`'OURS'`)`, `Resolved Text (`'const PORT = 3000;'`)`, `Conflict Markers Remaining (`false`)`, `Status: Merge Conflict Resolved Clean Nominal`

#### 📦 Memory Box / Data Layout Diagram: Merge Conflict Marker Anatomy Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Ours (HEAD)** | <<<<<<< HEAD\nconst PORT = 3000; (Current branch version) | `Ours` |
| **Divider Marker** | ======= (Separates conflicting versions) | `Divider` |
| **Theirs (Incoming)** | const PORT = 8080;\n>>>>>>> feature-port (Incoming branch version) | `Theirs` |
| **Clean Resolution** | const PORT = 3000; (MERGE CONFLICT RESOLVED CLEAN NOMINAL!) | `Resolved` |

#### 🐙 Runnable Git Simulator: `conflict_resolve_demo.js`

```javascript
function resolveConflict(raw, choice) {
  const m = raw.match(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-zA-Z0-9_-]+/);
  const resolved = choice === 'OURS' ? m[1] : m[2];
  return {
    resolvedText: resolved,
    hasMarkers: false,
    status: 'MERGE_CONFLICT_RESOLVED_CLEAN_NOMINAL'
  };
}

const raw = '<<<<<<< HEAD\nconst PORT = 3000;\n=======\nconst PORT = 8080;\n>>>>>>> feature-port';
console.log(JSON.stringify(resolveConflict(raw, 'OURS')));
```

**Expected Terminal Output**:
```text
{"resolvedText":"const PORT = 3000;","hasMarkers":false,"status":"MERGE_CONFLICT_RESOLVED_CLEAN_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What clean code string is produced when resolving the conflict block to 'OURS'?*

- **Target Answer**: `const PORT = 3000;`
- **Typed Misconception ID**: `MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'const PORT = 8080;'**:
  - *What Went Wrong*: PORT 8080 is THEIRS. Selecting OURS resolves to const PORT = 3000;.
  - *Simpler Mental Model*: Resolves to const PORT = 3000;.
  - *Guided Fix Action*: Type const PORT = 3000;

---

### 🔹 Block 2: Conflict Marker Syntax: `<<<<<<<`, `=======`, and `>>>>>>>`

- **Concept Budget / Primary Invariant**: `Conflict Marker Syntax Invariant`
- **Supporting Terms & Invariants**: `Marker Syntax (`<<<<<<< HEAD` denotes current branch changes; `=======` denotes center divider; `>>>>>>> branch` denotes incoming branch changes)`

#### ⚙️ Syntax & Command Anatomy: 3-Part Conflict Marker Anatomy

```text
// <<<<<<< HEAD         (Top marker: Shows changes on the currently checked out branch)
// const DB_URL = "localhost:5432";
// =======              (Center divider: Separates the two conflicting versions)
// const DB_URL = "db.prod.internal:5432";
// >>>>>>> feature-db   (Bottom marker: Shows changes on the incoming branch being merged)
```

- **Line 1**: Local branch start.
- **Line 2**: Local branch code.
- **Line 3**: Divider separator.
- **Line 4**: Incoming branch code.
- **Line 5**: Incoming branch end.

#### 🐙 Runnable Git Simulator: `marker_syntax_demo.js`

```javascript
function getConflictMarkerStart() {
  return '<<<<<<<';
}

console.log(getConflictMarkerStart());
```

**Expected Terminal Output**:
```text
<<<<<<<
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What 7-character string marks the opening boundary of a Git merge conflict block?*

- **Target Answer**: `<<<<<<<`
- **Typed Misconception ID**: `MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '======='**:
  - *What Went Wrong*: ======= is the middle divider. The opening marker is <<<<<<<.
  - *Simpler Mental Model*: Type <<<<<<<.
  - *Guided Fix Action*: Type <<<<<<<

---

### 🔹 Block 3: Completing Conflict Resolution: `git add <file>` and `git commit`

- **Concept Budget / Primary Invariant**: `Conflict Completion Workflow Invariant`
- **Supporting Terms & Invariants**: `Completion Steps (1. Manually edit file to remove conflict markers; 2. Stage resolved file with `git add <file>`; 3. Run `git commit` to finalize merge commit)`

#### 🐙 Runnable Git Simulator: `complete_conflict_demo.js`

```javascript
function getConflictCompletionStandard() {
  return 'STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE';
}

console.log(getConflictCompletionStandard());
```

**Expected Terminal Output**:
```text
STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the mandatory next step after editing a conflicted file to remove conflict markers?*

- **Target Answer**: `STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE`
- **Typed Misconception ID**: `MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'PUSH'**:
  - *What Went Wrong*: You must stage and commit locally first: STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE.
  - *Simpler Mental Model*: Matches STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE.
  - *Guided Fix Action*: Type STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE

---

## 📅 Day 12: Git Stash & Work-in-Progress (WIP) Preservation: `stash save`, `pop` & `apply`

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Stash Is a Coat Check at a Restaurant: You are in the middle of writing unfinished messy code (`wip: payment`), but urgent hotfix duty calls; you hand your jacket to the coat check (`git stash save`), switch branches with a clean working tree to fix the bug, and retrieve your jacket when you return (`git stash pop`).

### 🔹 Block 1: Git Stash LIFO Stack: Pushing `'wip: payment'` & Popping Back

- **Concept Budget / Primary Invariant**: `Git Stash LIFO Stack Manager Simulator`
- **Supporting Terms & Invariants**: `Popped Stash Message (`'wip: payment'`)`, `Remaining Stack Size ($1$ item)`, `LIFO Architecture`, `Status: Stash Popped Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Stash LIFO Stack Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Initial Stack** | [stash@{0}: 'wip: auth'] | `Stack` |
| **PUSH Action** | Pushes 'wip: payment' -> stack@{0}: 'wip: payment', stack@{1}: 'wip: auth' | `Push` |
| **POP Action** | Pops top item 'wip: payment' (STASH POPPED NOMINAL!) | `Pop` |

#### 🐙 Runnable Git Simulator: `stash_lifo_demo.js`

```javascript
function runStash() {
  const stack = [{ id: 'stash@{0}', message: 'wip: auth' }];
  stack.unshift({ id: 'stash@{0}', message: 'wip: payment' });
  const popped = stack.shift();
  return {
    poppedMessage: popped.message,
    remainingLength: stack.length,
    status: 'STASH_POPPED_NOMINAL'
  };
}

console.log(JSON.stringify(runStash()));
```

**Expected Terminal Output**:
```text
{"poppedMessage":"wip: payment","remainingLength":1,"status":"STASH_POPPED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What message string was popped from the top of the Git stash stack?*

- **Target Answer**: `wip: payment`
- **Typed Misconception ID**: `MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'wip: auth'**:
  - *What Went Wrong*: Stash is LIFO (Last In First Out). The latest pushed item 'wip: payment' is popped first.
  - *Simpler Mental Model*: Top item is 'wip: payment'.
  - *Guided Fix Action*: Type wip: payment

---

### 🔹 Block 2: `git stash pop` (Applies and Deletes) vs `git stash apply` (Applies and Retains)

- **Concept Budget / Primary Invariant**: `stash pop vs apply Invariant`
- **Supporting Terms & Invariants**: ``git stash pop` (Restores uncommitted work and removes stash from list)`, ``git stash apply` (Restores uncommitted work while preserving the stash in the list for re-use across multiple branches)`

#### ⚙️ Syntax & Command Anatomy: Stash Command Distinctions

```text
// git stash pop   -> Restores working changes AND drops stash@{0} from list
// git stash apply -> Restores working changes BUT keeps stash@{0} intact in list
```

- **Line 1**: Restores and deletes.
- **Line 2**: Restores and preserves.

#### 🐙 Runnable Git Simulator: `stash_diff_demo.js`

```javascript
function getStashApplyBehavior() {
  return 'GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK';
}

console.log(getStashApplyBehavior());
```

**Expected Terminal Output**:
```text
GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How does `git stash apply` differ from `git stash pop`?*

- **Target Answer**: `GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK`
- **Typed Misconception ID**: `MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DELETES'**:
  - *What Went Wrong*: pop deletes. apply uses GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK.
  - *Simpler Mental Model*: Matches GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK.
  - *Guided Fix Action*: Type GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK

---

### 🔹 Block 3: Stashing Untracked Files: The `-u` (`--include-untracked`) Flag

- **Concept Budget / Primary Invariant**: `Stash Untracked Invariant`
- **Supporting Terms & Invariants**: ``git stash -u` (By default, `git stash` ONLY shelves tracked files; `-u` or `--include-untracked` forces Git to stash newly created untracked files as well)`

#### 🐙 Runnable Git Simulator: `stash_untracked_demo.js`

```javascript
function getStashUntrackedFlag() {
  return '-u';
}

console.log(getStashUntrackedFlag());
```

**Expected Terminal Output**:
```text
-u
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git stash` ensures newly created untracked files are included in the stash snapshot?*

- **Target Answer**: `-u`
- **Typed Misconception ID**: `MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '-a'**:
  - *What Went Wrong*: -a includes ignored files too. Stashing untracked files uses -u.
  - *Simpler Mental Model*: Type -u.
  - *Guided Fix Action*: Type -u

---

## 📅 Day 13: Git Tagging & Release Management: Lightweight Tags, Annotated Tags & SemVer

> **💡 Everyday Metaphor / Intuitive Model**:
> A Git Release Tag Is a Wax Seal on a Signed Royal Decree: Unlike a moving branch pointer that advances with every new commit, an Annotated Tag (`git tag -a v1.0.0 -m "Release"`) permanently cements the exact commit SHA, timestamp, and author signature, establishing an immutable release milestone.

### 🔹 Block 1: Semantic Version Tagging: Parsing `v2.1.4` $\to$ `{ major: 2, minor: 1, patch: 4 }`

- **Concept Budget / Primary Invariant**: `Semantic Version String Parser & Tag Auditor`
- **Supporting Terms & Invariants**: `Raw Tag (`'v2.1.4'`)`, `Major Version ($2$)`, `Minor Version ($1$)`, `Patch Version ($4$)`, `Valid SemVer (`true`)`, `Status: SemVer Tag Parsed Nominal`

#### 📦 Memory Box / Data Layout Diagram: Semantic Versioning Release Tag Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Major Component (2)** | Breaking API changes (v2.0.0) | `Major` |
| **Minor Component (1)** | Backwards-compatible new features (v2.1.0) | `Minor` |
| **Patch Component (4)** | Backwards-compatible bugfixes -> v2.1.4 (SEMVER TAG PARSED NOMINAL!) | `Patch` |

#### 🐙 Runnable Git Simulator: `semver_demo.js`

```javascript
function parseSemver(tag) {
  const m = tag.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  return {
    tag,
    major: parseInt(m[1], 10),
    minor: parseInt(m[2], 10),
    patch: parseInt(m[3], 10),
    isValidSemver: true,
    status: 'SEMVER_TAG_PARSED_NOMINAL'
  };
}

console.log(JSON.stringify(parseSemver('v2.1.4')));
```

**Expected Terminal Output**:
```text
{"tag":"v2.1.4","major":2,"minor":1,"patch":4,"isValidSemver":true,"status":"SEMVER_TAG_PARSED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What minor version integer is parsed from the release tag 'v2.1.4'?*

- **Target Answer**: `1`
- **Typed Misconception ID**: `MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED`

**Diagnostic Recovery Paths**:
- **If Student Triggers '2'**:
  - *What Went Wrong*: 2 is the major version. The minor version is 1.
  - *Simpler Mental Model*: Minor version is 1.
  - *Guided Fix Action*: Type 1

---

### 🔹 Block 2: Annotated Tags (`git tag -a`) vs Lightweight Tags (`git tag`)

- **Concept Budget / Primary Invariant**: `Annotated Tag Invariant`
- **Supporting Terms & Invariants**: `Annotated Tag (`git tag -a v1.0.0 -m "msg"`: Stored as a full Git object in database containing tagger name, email, date, message, and GPG signature; lightweight tags are just raw pointers)`

#### ⚙️ Syntax & Command Anatomy: Tag Creation Commands

```text
// LIGHTWEIGHT TAG: git tag v1.0.0          (Just a commit reference pointer)
// ANNOTATED TAG:   git tag -a v1.0.0 -m "Production v1.0 Release" (Full cryptographic metadata!)
```

- **Line 1**: Pointer only.
- **Line 2**: Production standard annotated release object.

#### 🐙 Runnable Git Simulator: `tag_types_demo.js`

```javascript
function getAnnotatedTagFlag() {
  return '-a';
}

console.log(getAnnotatedTagFlag());
```

**Expected Terminal Output**:
```text
-a
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git tag` creates an annotated release tag containing full author metadata and release notes?*

- **Target Answer**: `-a`
- **Typed Misconception ID**: `MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED`

**Diagnostic Recovery Paths**:
- **If Student Triggers '-m'**:
  - *What Went Wrong*: -m supplies message. Creating annotated tag requires -a.
  - *Simpler Mental Model*: Type -a.
  - *Guided Fix Action*: Type -a

---

### 🔹 Block 3: Pushing Tags: `git push origin --tags` vs Standard Branch Pushes

- **Concept Budget / Primary Invariant**: `Tag Push Invariant`
- **Supporting Terms & Invariants**: ``git push origin --tags` (By default, `git push` does NOT transfer local tags to remote servers; `--tags` or explicit tag name `git push origin v1.0.0` is required)`

#### 🐙 Runnable Git Simulator: `push_tags_demo.js`

```javascript
function getPushTagsCommand() {
  return 'git push origin --tags';
}

console.log(getPushTagsCommand());
```

**Expected Terminal Output**:
```text
git push origin --tags
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git command pushes all local release tags to the remote origin repository?*

- **Target Answer**: `git push origin --tags`
- **Typed Misconception ID**: `MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git push'**:
  - *What Went Wrong*: git push ignores tags by default. Pushing tags requires git push origin --tags.
  - *Simpler Mental Model*: Type git push origin --tags.
  - *Guided Fix Action*: Type git push origin --tags

---

## 📅 Day 14: Time-Travel & Reset Modes: Soft (`--soft`), Mixed (`--mixed`), Hard (`--hard`) & Reflog

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Reset Is a Time Machine with 3 Safety Settings: `--soft` rewinds time to un-commit your work while keeping everything staged; `--mixed` un-commits and un-stages while keeping code on disk; `--hard` vaporizes uncommitted code; but `git reflog` is the black-box flight recorder that can resurrect deleted commits even after a hard reset disaster!

### 🔹 Block 1: Reset Modes: Soft (Safe) vs Mixed (Moderate) vs Hard (Destructive)

- **Concept Budget / Primary Invariant**: `Git Reset Mode State Outcome Matrix Evaluator`
- **Supporting Terms & Invariants**: ``--soft` (Preserves index & disk $\implies$ `'SAFE'`)`, ``--mixed` (Preserves disk, resets index $\implies$ `'MODERATE'`)`, ``--hard` (Discards disk & index $\implies$ `'DESTRUCTIVE'`)`, `Status: Reset Outcome Evaluated Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Reset Mode Safety Matrix Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **git reset --soft** | Rewinds HEAD | Keeps Index STAGED | Keeps Working Disk -> SAFE | `Soft` |
| **git reset --mixed** | Rewinds HEAD | Unstages Index | Keeps Working Disk -> MODERATE (DEFAULT) | `Mixed` |
| **git reset --hard** | Rewinds HEAD | Clears Index | Clears Working Disk -> DESTRUCTIVE (EVALUATED NOMINAL!) | `Hard` |

#### 🐙 Runnable Git Simulator: `reset_modes_demo.js`

```javascript
function evaluateReset(mode) {
  const map = {
    'SOFT': { indexPreserved: true, diskPreserved: true, danger: 'SAFE' },
    'MIXED': { indexPreserved: false, diskPreserved: true, danger: 'MODERATE' },
    'HARD': { indexPreserved: false, diskPreserved: false, danger: 'DESTRUCTIVE' }
  };
  return { mode, ...map[mode], status: 'RESET_OUTCOME_EVALUATED_NOMINAL' };
}

console.log(JSON.stringify(evaluateReset('SOFT')));
console.log(JSON.stringify(evaluateReset('HARD')));
```

**Expected Terminal Output**:
```text
{"mode":"SOFT","indexPreserved":true,"diskPreserved":true,"danger":"SAFE","status":"RESET_OUTCOME_EVALUATED_NOMINAL"}
{"mode":"HARD","indexPreserved":false,"diskPreserved":false,"danger":"DESTRUCTIVE","status":"RESET_OUTCOME_EVALUATED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What danger level classification is assigned to `git reset --hard`?*

- **Target Answer**: `DESTRUCTIVE`
- **Typed Misconception ID**: `MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SAFE'**:
  - *What Went Wrong*: --soft is safe. --hard destroys uncommitted changes: DESTRUCTIVE.
  - *Simpler Mental Model*: Danger is DESTRUCTIVE.
  - *Guided Fix Action*: Type DESTRUCTIVE

---

### 🔹 Block 2: The Reflog Lifesaver: Resurrecting Lost Commits via `git reflog`

- **Concept Budget / Primary Invariant**: `git reflog Recovery Invariant`
- **Supporting Terms & Invariants**: ``git reflog` (A local chronological log of every HEAD pointer change; even if you run `git reset --hard`, reflog records the old commit SHA, allowing recovery via `git reset --hard HEAD@{1}`)`

#### ⚙️ Syntax & Command Anatomy: Reflog Recovery Sequence

```text
// 1. Accidental disaster: git reset --hard HEAD~5 (Lost 5 commits!)
// 2. View local HEAD journal: git reflog
//    4b825dc HEAD@{0}: reset: moving to HEAD~5
//    c789abc HEAD@{1}: commit: feat: awesome feature
// 3. Resurrect instantly: git reset --hard HEAD@{1}
```

- **Line 1**: Accidental deletion.
- **Line 2**: Inspecting reflog journal.
- **Line 3**: Instant recovery.

#### 🐙 Runnable Git Simulator: `reflog_demo.js`

```javascript
function getReflogRecoveryCommand() {
  return 'git reflog';
}

console.log(getReflogRecoveryCommand());
```

**Expected Terminal Output**:
```text
git reflog
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git command inspects the historical journal of all local HEAD pointer movements to recover seemingly lost commits?*

- **Target Answer**: `git reflog`
- **Typed Misconception ID**: `MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git log'**:
  - *What Went Wrong*: git log hides disconnected commits. Inspecting raw pointer history uses git reflog.
  - *Simpler Mental Model*: Type git reflog.
  - *Guided Fix Action*: Type git reflog

---

### 🔹 Block 3: `git revert <sha>`: Creating Forward Inverting Commits for Shared Branches

- **Concept Budget / Primary Invariant**: `git revert Invariant`
- **Supporting Terms & Invariants**: ``git revert <sha>` (Creates a NEW commit that applies the exact inverse mathematical diff of a target commit, safely undoing changes on public branches without rewriting history)`

#### 🐙 Runnable Git Simulator: `revert_demo.js`

```javascript
function getPublicUndoCommand() {
  return 'git revert <sha>';
}

console.log(getPublicUndoCommand());
```

**Expected Terminal Output**:
```text
git revert <sha>
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git command safely undoes changes on a shared public branch by generating a new forward inverting commit?*

- **Target Answer**: `git revert <sha>`
- **Typed Misconception ID**: `MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git reset'**:
  - *What Went Wrong*: git reset rewrites history and breaks shared branches. Public undoing uses git revert <sha>.
  - *Simpler Mental Model*: Type git revert <sha>.
  - *Guided Fix Action*: Type git revert <sha>

---

## 📅 Day 15: ⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 2 Synthesis: The complete intermediate version control engine: 1. Branch pointer advances (`main` $\to$ `f9e8d7c`); 2. 3-Way merge dual parent generation; 3. Merge conflict resolution without marker artifacts; 4. LIFO stash stack management; 5. SemVer tag auditing (`v2.1.4`); 6. Safe `--soft` reset evaluation.

### 🔹 Block 1: Git Branching & Conflict Master Engine Synthesis

- **Concept Budget / Primary Invariant**: `Git Branching & Conflict Master Engine`
- **Supporting Terms & Invariants**: `Branch Pointer Engine`, `3-Way Merge Engine`, `Conflict Resolution Engine`, `Stash Stack Engine`, `SemVer Tag Engine`, `Reset Modes Engine`

#### 🔄 Computing System Execution Flowchart: Milestone 2 Git Branching Pipeline

1. **Advances branch pointers (main -> f9e8d7c) & constructs 3-way merges (2 parents)**
2. **Resolves conflict markers cleanly to 'const PORT = 3000;'**
3. **Manages LIFO stashes, parses SemVer tags (v2.1.4), & audits reset modes**
4. **Activates Git Branching & Conflict Master Engine!**

#### 🐙 Runnable Git Simulator: `branching_kernel_demo.js`

```javascript
function runBranchingMaster() {
  return {
    pointerSubsystem: 'ONLINE_F9E8D7C_ADVANCED',
    mergeSubsystem: 'ONLINE_2PARENTS_ACTIVE',
    conflictSubsystem: 'ONLINE_PORT3000_CLEAN',
    stashSubsystem: 'ONLINE_LIFO_STACK_ACTIVE',
    tagSubsystem: 'ONLINE_V2_1_4_SEMVER_ACTIVE',
    resetSubsystem: 'ONLINE_REFLOG_SAFE_ACTIVE',
    engineStatus: 'GIT_BRANCHING_MASTER_ACTIVE'
  };
}

console.log(runBranchingMaster().engineStatus);
```

**Expected Terminal Output**:
```text
GIT_BRANCHING_MASTER_ACTIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the Git Branching & Conflict Master Engine?*

- **Target Answer**: `GIT_BRANCHING_MASTER_ACTIVE`
- **Typed Misconception ID**: `MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches GIT_BRANCHING_MASTER_ACTIVE.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type GIT_BRANCHING_MASTER_ACTIVE

---

### 🔹 Block 2: Git Branching Engine Invariant Verification & Precision Audit

- **Concept Budget / Primary Invariant**: `Git Branching Invariant Verification`
- **Supporting Terms & Invariants**: `Branching Invariant`, `Merge Invariant`, `100% Quality Invariant`

#### 🐙 Runnable Git Simulator: `branching_audit_demo.js`

```javascript
function auditBranching(b, m, c, s, t, r) {
  const passed = b && m && c && s && t && r;
  return {
    branchesVerified: b,
    mergesVerified: m,
    conflictsVerified: c,
    stashVerified: s,
    tagsVerified: t,
    resetsVerified: r,
    grade: passed ? 'GIT_BRANCHING_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditBranching(true, true, true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"branchesVerified":true,"mergesVerified":true,"conflictsVerified":true,"stashVerified":true,"tagsVerified":true,"resetsVerified":true,"grade":"GIT_BRANCHING_ENGINE_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when Branching, 3-Way Merges, Conflict Resolution, Stash, Tags, and Resets pass 100%?*

- **Target Answer**: `GIT_BRANCHING_ENGINE_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards GIT_BRANCHING_ENGINE_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards GIT_BRANCHING_ENGINE_AUDIT_PASSED.
  - *Guided Fix Action*: Type GIT_BRANCHING_ENGINE_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 2 Git Branching Certification

- **Concept Budget / Primary Invariant**: `Milestone 2 Certification`
- **Supporting Terms & Invariants**: `Git Branching Verified`, `100% Quality Invariant`

#### 🐙 Runnable Git Simulator: `milestone2_git_cert.js`

```javascript
console.log('⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 2 completion?*

- **Target Answer**: `⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]

---

## 📅 Day 16: Rebase vs Merge Architecture: Linear History Mechanics & The Golden Rule of Rebasing

> **💡 Everyday Metaphor / Intuitive Model**:
> Rebasing Is Unplugging a LEGO Feature Tower and Re-Snapping It onto the Top of the Main Castle: Instead of creating a messy spiderweb of merge bubbles, `git rebase main` replays your commits one-by-one as brand-new bricks on top of the latest `main`; but The Golden Rule warns: NEVER rebase bricks on a public shared branch, or you will dismantle your teammates' foundations!

### 🔹 Block 1: Rebase Mechanics: Replaying 2 Commits on Top of `main9999`

- **Concept Budget / Primary Invariant**: `Git Rebase Linear Commit Replay Simulator`
- **Supporting Terms & Invariants**: `Target Base SHA (`'main9999'`)`, `Rebased Count ($2$ commits)`, `Linear History (`true`)`, `New SHA Generation`, `Status: Git Rebase Linear Replay Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Rebase Linear Replay Topology Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **New Base Target** | main HEAD commit: main9999 | `Base SHA` |
| **Replayed Commit 1** | c111111 -> rebased_c111111_on_main999 (New SHA!) | `Commit 1` |
| **Replayed Commit 2** | c222222 -> rebased_c222222_on_rebase (GIT REBASE LINEAR REPLAY NOMINAL!) | `Commit 2` |

#### 🐙 Runnable Git Simulator: `rebase_demo.js`

```javascript
function simulateRebase(newBase, commits) {
  let cur = newBase;
  const rebased = commits.map(c => {
    const s = `rebased_${c.sha.slice(0, 7)}_on_${cur.slice(0, 7)}`;
    cur = s;
    return { oldSha: c.sha, newSha: s, msg: c.msg };
  });
  return {
    rebasedCount: rebased.length,
    isLinear: true,
    status: 'GIT_REBASE_LINEAR_REPLAY_NOMINAL'
  };
}

const commits = [{ sha: 'c111111', msg: 'feat: login' }, { sha: 'c222222', msg: 'feat: logout' }];
console.log(JSON.stringify(simulateRebase('main9999', commits)));
```

**Expected Terminal Output**:
```text
{"rebasedCount":2,"isLinear":true,"status":"GIT_REBASE_LINEAR_REPLAY_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many topic commits were replayed linearly onto the new base branch in the rebase simulation?*

- **Target Answer**: `2`
- **Typed Misconception ID**: `MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers '3'**:
  - *What Went Wrong*: There were 2 topic commits rebased.
  - *Simpler Mental Model*: Count is 2.
  - *Guided Fix Action*: Type 2

---

### 🔹 Block 2: The Golden Rule of Rebasing: Never Rebase Public Shared Branches

- **Concept Budget / Primary Invariant**: `Golden Rule of Rebasing Invariant`
- **Supporting Terms & Invariants**: `Golden Rule (`NEVER_REBASE_PUBLIC_SHARED_BRANCHES`: Rebasing rewrites commit SHA hashes; rebasing a shared branch forces teammates to reconcile duplicate divergent histories)`

#### ⚙️ Syntax & Command Anatomy: Rebasing Rules of Engagement

```text
// ✅ SAFE:     git rebase main (On your PRIVATE local feature branch before creating a PR)
// ❌ DISASTER: git rebase main (On the shared `develop` or `main` branch used by the entire team!)
```

- **Line 1**: Private local branch rebase.
- **Line 2**: Public shared branch disaster.

#### 🐙 Runnable Git Simulator: `golden_rule_demo.js`

```javascript
function getGoldenRule() {
  return 'NEVER_REBASE_PUBLIC_SHARED_BRANCHES';
}

console.log(getGoldenRule());
```

**Expected Terminal Output**:
```text
NEVER_REBASE_PUBLIC_SHARED_BRANCHES
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the inviolable Golden Rule of Git Rebasing?*

- **Target Answer**: `NEVER_REBASE_PUBLIC_SHARED_BRANCHES`
- **Typed Misconception ID**: `MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'ALWAYS'**:
  - *What Went Wrong*: Shared branch rebasing causes chaos: NEVER_REBASE_PUBLIC_SHARED_BRANCHES.
  - *Simpler Mental Model*: Matches NEVER_REBASE_PUBLIC_SHARED_BRANCHES.
  - *Guided Fix Action*: Type NEVER_REBASE_PUBLIC_SHARED_BRANCHES

---

### 🔹 Block 3: Aborting Conflicted Rebases: `git rebase --abort`

- **Concept Budget / Primary Invariant**: `git rebase --abort Invariant`
- **Supporting Terms & Invariants**: ``git rebase --abort` (Safely halts a conflicted rebase in progress and resets the topic branch back to its original commit state)`

#### 🐙 Runnable Git Simulator: `rebase_abort_demo.js`

```javascript
function getRebaseAbortCommand() {
  return 'git rebase --abort';
}

console.log(getRebaseAbortCommand());
```

**Expected Terminal Output**:
```text
git rebase --abort
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git command safely terminates a conflicted rebase operation and restores the branch to its pre-rebase state?*

- **Target Answer**: `git rebase --abort`
- **Typed Misconception ID**: `MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'git merge --abort'**:
  - *What Went Wrong*: git merge --abort is for merges. Aborting rebases uses git rebase --abort.
  - *Simpler Mental Model*: Type git rebase --abort.
  - *Guided Fix Action*: Type git rebase --abort

---

## 📅 Day 17: Interactive Rebasing (`git rebase -i`): Squashing, Rewording, Dropping & Fixups

> **💡 Everyday Metaphor / Intuitive Model**:
> Interactive Rebasing Is Editing a Movie Before the Cinema Premiere: While filming, you made 10 messy takes (`wip: fix typo`, `wip: test`); `git rebase -i` lets you 'squash' and 'fixup' those 10 bloopers into 1 Oscar-worthy feature commit (`finalResultingCommits: 1`) before submitting your Pull Request.

### 🔹 Block 1: Interactive Squashing: 3 WIP Commits $\to$ 1 Clean Commit

- **Concept Budget / Primary Invariant**: `Interactive Rebase Command Script Parser & Squasher`
- **Supporting Terms & Invariants**: `Original Commits ($3$ commits)`, `Final Resulting Commits ($1$ commit)`, `Squashed Count ($2$ squashed)`, `Status: Interactive Rebase Todo Parsed Nominal`

#### 📦 Memory Box / Data Layout Diagram: Interactive Rebase Command Script Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Line 1: 'pick a1b2c3d'** | Keeps commit: 'feat: add auth' | `Pick` |
| **Line 2: 'squash e4f5g6h'** | Melds 'fix: typo' into Line 1 | `Squash` |
| **Line 3: 'fixup 9876543'** | Melds 'test: add test' discarding message -> 1 Final Commit (PARSED NOMINAL!) | `Fixup` |

#### 🐙 Runnable Git Simulator: `interactive_rebase_demo.js`

```javascript
function parseRebaseTodo(lines) {
  let finalCount = 0;
  let squashedCount = 0;
  lines.forEach(l => {
    if (l.startsWith('pick') || l.startsWith('reword')) finalCount++;
    else if (l.startsWith('squash') || l.startsWith('fixup')) squashedCount++;
  });
  return {
    finalCount,
    squashedCount,
    status: 'INTERACTIVE_REBASE_TODO_PARSED_NOMINAL'
  };
}

const todo = ['pick a1b2c3d feat: add auth', 'squash e4f5g6h fix: typo in auth', 'fixup 9876543 test: add test'];
console.log(JSON.stringify(parseRebaseTodo(todo)));
```

**Expected Terminal Output**:
```text
{"finalCount":1,"squashedCount":2,"status":"INTERACTIVE_REBASE_TODO_PARSED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many final commits remain after squashing 2 micro-commits into 1 picked commit?*

- **Target Answer**: `1`
- **Typed Misconception ID**: `MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP`

**Diagnostic Recovery Paths**:
- **If Student Triggers '3'**:
  - *What Went Wrong*: Squashing combines them into a single commit: 1.
  - *Simpler Mental Model*: Remaining count is 1.
  - *Guided Fix Action*: Type 1

---

### 🔹 Block 2: `squash` (Combines Messages) vs `fixup` (Discards Message)

- **Concept Budget / Primary Invariant**: `squash vs fixup Invariant`
- **Supporting Terms & Invariants**: ``squash` (Melds commit into predecessor and prompts to combine both commit messages)`, ``fixup` (Melds commit into predecessor but automatically discards its commit message, keeping only the parent message)`

#### ⚙️ Syntax & Command Anatomy: Interactive Rebase Command Directives

```text
// pick   c111111 feat(auth): add JWT login
// squash c222222 fix: typo in auth message  -> Pauses editor to merge commit messages
// fixup  c333333 chore: lint whitespace     -> Melds silently, DISCARDING message!
```

- **Line 1**: Base commit.
- **Line 2**: Combines messages.
- **Line 3**: Discards message.

#### 🐙 Runnable Git Simulator: `fixup_command_demo.js`

```javascript
function getFixupName() {
  return 'fixup';
}

console.log(getFixupName());
```

**Expected Terminal Output**:
```text
fixup
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What interactive rebase command melds a commit into its predecessor while automatically discarding its commit log message?*

- **Target Answer**: `fixup`
- **Typed Misconception ID**: `MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'squash'**:
  - *What Went Wrong*: squash preserves both messages. Discarding the message uses fixup.
  - *Simpler Mental Model*: Type fixup.
  - *Guided Fix Action*: Type fixup

---

### 🔹 Block 3: Automated Cleanup: `git commit --fixup <sha>` & `git rebase -i --autosquash`

- **Concept Budget / Primary Invariant**: `Autosquash Invariant`
- **Supporting Terms & Invariants**: ``--autosquash` (Automatically pairs `fixup! <sha>` commits with their target commits and sets todo lines to `fixup` without manual editing)`

#### 🐙 Runnable Git Simulator: `autosquash_demo.js`

```javascript
function getAutosquashFlag() {
  return '--autosquash';
}

console.log(getAutosquashFlag());
```

**Expected Terminal Output**:
```text
--autosquash
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git rebase -i` automatically reorders and marks fixup commits in the todo list?*

- **Target Answer**: `--autosquash`
- **Typed Misconception ID**: `MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP`

**Diagnostic Recovery Paths**:
- **If Student Triggers '--auto'**:
  - *What Went Wrong*: The exact flag is --autosquash.
  - *Simpler Mental Model*: Type --autosquash.
  - *Guided Fix Action*: Type --autosquash

---

## 📅 Day 18: Cherry-Picking & Selective Patching: `git cherry-pick <sha>` & Hotfixes

> **💡 Everyday Metaphor / Intuitive Model**:
> Cherry-Picking Is Plucking One Ripe Fruit from a Tree Without Chopping Down the Branch: If an urgent security patch (`if (!user) return 401;`) was committed on the experimental `v2.0` branch, `git cherry-pick fix_c789abc` transplants that single isolated patch directly onto the production `prod_v1` branch instantly.

### 🔹 Block 1: Cherry-Pick Patch: Transplanting `fix_c789abc` onto `prod_v1_head`

- **Concept Budget / Primary Invariant**: `Cherry-Pick Patch Applicator & Conflict Guard`
- **Supporting Terms & Invariants**: `Target Head (`'prod_v1_head'`)`, `Cherry SHA (`'fix_c789abc'`)`, `Applied Diff (`'+ if (!user) return 401;'`)`, `Cherry Pick Clean (`true`)`, `Status: Cherry Pick Applied Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Cherry-Pick Patch Transplantation Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Target Branch Head** | prod_v1_head (Production legacy release branch) | `Head` |
| **Source Isolated Commit** | fix_c789abc ('fix: auth null check') | `Source SHA` |
| **Transplanted Result** | cherry_fix_c78_onto_prod_v1 (CHERRY PICK APPLIED NOMINAL!) | `New SHA` |

#### 🐙 Runnable Git Simulator: `cherry_pick_demo.js`

```javascript
function cherryPick(head, cherrySha, diff) {
  return {
    targetHead: head,
    cherrySha,
    newSha: `cherry_${cherrySha.slice(0, 7)}_onto_${head.slice(0, 7)}`,
    isClean: true,
    status: 'CHERRY_PICK_APPLIED_NOMINAL'
  };
}

console.log(JSON.stringify(cherryPick('prod_v1_head', 'fix_c789abc', '+ if (!user) return 401;')));
```

**Expected Terminal Output**:
```text
{"targetHead":"prod_v1_head","cherrySha":"fix_c789abc","newSha":"cherry_fix_c78_onto_prod_v1","isClean":true,"status":"CHERRY_PICK_APPLIED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms clean application of an isolated cherry-picked commit patch?*

- **Target Answer**: `CHERRY_PICK_APPLIED_NOMINAL`
- **Typed Misconception ID**: `MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches CHERRY_PICK_APPLIED_NOMINAL.
  - *Simpler Mental Model*: Matches status string.
  - *Guided Fix Action*: Type CHERRY_PICK_APPLIED_NOMINAL

---

### 🔹 Block 2: Cherry-Picking Without Committing: `git cherry-pick -n` (`--no-commit`)

- **Concept Budget / Primary Invariant**: `Cherry-Pick No-Commit Invariant`
- **Supporting Terms & Invariants**: ``-n` / `--no-commit` (Applies changes from target commit into the working tree and staging area without creating a commit, allowing developers to inspect or modify the patch before committing)`

#### ⚙️ Syntax & Command Anatomy: Cherry-Pick Command Options

```text
// git cherry-pick c789abc    -> Applies patch AND immediately creates commit
// git cherry-pick -n c789abc -> Applies patch to Staging/Working Tree WITHOUT committing!
```

- **Line 1**: Immediate commit.
- **Line 2**: Staging only mode.

#### 🐙 Runnable Git Simulator: `cherry_no_commit_demo.js`

```javascript
function getCherryNoCommitFlag() {
  return '-n';
}

console.log(getCherryNoCommitFlag());
```

**Expected Terminal Output**:
```text
-n
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What short flag passed to `git cherry-pick` applies changes to the staging area without creating a commit?*

- **Target Answer**: `-n`
- **Typed Misconception ID**: `MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING`

**Diagnostic Recovery Paths**:
- **If Student Triggers '-a'**:
  - *What Went Wrong*: No-commit flag is -n.
  - *Simpler Mental Model*: Type -n.
  - *Guided Fix Action*: Type -n

---

### 🔹 Block 3: Cherry-Picking Commit Ranges: `git cherry-pick A..B`

- **Concept Budget / Primary Invariant**: `Cherry-Pick Range Invariant`
- **Supporting Terms & Invariants**: ``git cherry-pick A..B` (Applies all commits from after A up to and including B; `A^..B` includes commit A)`

#### 🐙 Runnable Git Simulator: `cherry_range_demo.js`

```javascript
function getCherryRangeOperator() {
  return '..';
}

console.log(getCherryRangeOperator());
```

**Expected Terminal Output**:
```text
..
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What two-character syntax operator specifies a range of commits in `git cherry-pick A..B`?*

- **Target Answer**: `..`
- **Typed Misconception ID**: `MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING`

**Diagnostic Recovery Paths**:
- **If Student Triggers '...'**:
  - *What Went Wrong*: ... is symmetric difference. Range operator is ...
  - *Simpler Mental Model*: Type ...
  - *Guided Fix Action*: Type ..

---

## 📅 Day 19: Remote Repositories & Protocol Mechanics: HTTPS, SSH Keys & Remote Management

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Remotes Are Satellite Ground Stations: Your local laptop talks to the GitHub satellite using either an encrypted HTTPS radio frequency (requiring Personal Access Tokens) or an elliptic-curve SSH cryptographic key (`ed25519`), routing packets securely to `origin`.

### 🔹 Block 1: Remote Protocols: Detecting SSH (`git@github.com:...`) vs HTTPS

- **Concept Budget / Primary Invariant**: `Git Remote URL Protocol & SSH Key Type Parser`
- **Supporting Terms & Invariants**: `SSH Protocol (`'git@github.com:org/repo.git'`)`, `HTTPS Protocol`, `Secure Transport (`true`)`, `Status: SSH Remote Protocol Detected`

#### 📦 Memory Box / Data Layout Diagram: Git Remote Protocol Detection Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **SSH Remote URL** | git@github.com:org/repo.git (Port 22 SSH Key Authentication) | `SSH URL` |
| **HTTPS Remote URL** | https://github.com/org/repo.git (Port 443 PAT Token) | `HTTPS URL` |
| **Protocol Detection** | Protocol: SSH | Secure: true (SSH REMOTE PROTOCOL DETECTED!) | `Detection` |

#### 🐙 Runnable Git Simulator: `remote_protocol_demo.js`

```javascript
function parseProtocol(url) {
  if (url.startsWith('git@') || url.startsWith('ssh://')) return { proto: 'SSH', isSecure: true, status: 'SSH_REMOTE_PROTOCOL_DETECTED' };
  if (url.startsWith('https://')) return { proto: 'HTTPS', isSecure: true, status: 'HTTPS_REMOTE_PROTOCOL_DETECTED' };
  return { proto: 'UNKNOWN', isSecure: false };
}

console.log(JSON.stringify(parseProtocol('git@github.com:org/repo.git')));
console.log(JSON.stringify(parseProtocol('https://github.com/org/repo.git')));
```

**Expected Terminal Output**:
```text
{"proto":"SSH","isSecure":true,"status":"SSH_REMOTE_PROTOCOL_DETECTED"}
{"proto":"HTTPS","isSecure":true,"status":"HTTPS_REMOTE_PROTOCOL_DETECTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What protocol is detected from remote URL `'git@github.com:org/repo.git'`?*

- **Target Answer**: `SSH`
- **Typed Misconception ID**: `MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'HTTPS'**:
  - *What Went Wrong*: git@ denotes SSH protocol authentication.
  - *Simpler Mental Model*: Protocol is SSH.
  - *Guided Fix Action*: Type SSH

---

### 🔹 Block 2: Modern SSH Cryptography: Ed25519 (`ssh-keygen -t ed25519`)

- **Concept Budget / Primary Invariant**: `Ed25519 SSH Invariant`
- **Supporting Terms & Invariants**: ``ed25519` (Modern high-speed elliptic-curve signature algorithm replacing outdated legacy RSA 2048/4096 keys)`

#### ⚙️ Syntax & Command Anatomy: SSH Key Generation Command

```text
// ssh-keygen -t ed25519 -C "alice@company.com"
// -> Generates ~/.ssh/id_ed25519 (Private Secret Key - NEVER SHARE!)
// -> Generates ~/.ssh/id_ed25519.pub (Public Key - Upload to GitHub!)
```

- **Line 1**: Modern keygen command.
- **Line 2**: Private key.
- **Line 3**: Public key for GitHub.

#### 🐙 Runnable Git Simulator: `ed25519_demo.js`

```javascript
function getRecommendedSshAlgorithm() {
  return 'ed25519';
}

console.log(getRecommendedSshAlgorithm());
```

**Expected Terminal Output**:
```text
ed25519
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the industry-standard recommended elliptic curve algorithm for modern Git SSH keys?*

- **Target Answer**: `ed25519`
- **Typed Misconception ID**: `MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'RSA'**:
  - *What Went Wrong*: RSA is older and bulkier. The modern standard is ed25519.
  - *Simpler Mental Model*: Type ed25519.
  - *Guided Fix Action*: Type ed25519

---

### 🔹 Block 3: Managing Remotes: `git remote add origin <url>` and `git remote -v`

- **Concept Budget / Primary Invariant**: `git remote Invariant`
- **Supporting Terms & Invariants**: ``git remote add <name> <url>` (Links a remote nickname to a URL)`, ``git remote -v` (Displays fetch and push URLs for all configured remotes)`

#### 🐙 Runnable Git Simulator: `remote_v_demo.js`

```javascript
function getRemoteVerboseFlag() {
  return '-v';
}

console.log(getRemoteVerboseFlag());
```

**Expected Terminal Output**:
```text
-v
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git remote` prints verbose URLs for fetch and push endpoints?*

- **Target Answer**: `-v`
- **Typed Misconception ID**: `MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '-l'**:
  - *What Went Wrong*: Verbose remote inspection uses -v.
  - *Simpler Mental Model*: Type -v.
  - *Guided Fix Action*: Type -v

---

## 📅 Day 20: Remote Synchronization Workflow: `git fetch`, `git pull --rebase` & Upstream Tracking

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Fetch vs Pull Is Checking Weather Radar vs Walking Outside in the Rain: `git fetch` downloads satellite radar updates into `.git/refs/remotes/origin/` without getting your clothes wet; `git pull --rebase` downloads the rain and smoothly walks your local steps on top of the fresh pavement without creating useless merge bubbles.

### 🔹 Block 1: Remote Sync: `git pull --rebase` Preventing Merge Bubbles

- **Concept Budget / Primary Invariant**: `Git Fetch vs Pull Remote Synchronization Simulator`
- **Supporting Terms & Invariants**: `Local SHA (`'loc123'`)`, `Remote Origin SHA (`'rem456'`)`, `Sync Strategy (`'FETCH_AND_REBASE'`)`, `Merge Bubble Prevented (`true`)`, `Status: Remote Sync Simulated Nominal`

#### 📦 Memory Box / Data Layout Diagram: Remote Synchronization Strategy Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Standard `git pull`** | git fetch + git merge -> Creates unsightly 'Merge branch main' bubbles! | `Merge Pull` |
| **Professional `git pull --rebase`** | git fetch + git rebase -> Replays local commits linearly on top of origin/main! | `Rebase Pull` |
| **Sync Outcome** | Merge Bubble Prevented: true (REMOTE SYNC SIMULATED NOMINAL!) | `Outcome` |

#### 🐙 Runnable Git Simulator: `remote_sync_demo.js`

```javascript
function simulateSync(loc, rem, isRebase) {
  return {
    syncStrategy: isRebase ? 'FETCH_AND_REBASE' : 'FETCH_AND_MERGE',
    isMergeBubblePrevented: isRebase,
    status: 'REMOTE_SYNC_SIMULATED_NOMINAL'
  };
}

console.log(JSON.stringify(simulateSync('loc123', 'rem456', true)));
```

**Expected Terminal Output**:
```text
{"syncStrategy":"FETCH_AND_REBASE","isMergeBubblePrevented":true,"status":"REMOTE_SYNC_SIMULATED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What sync strategy is executed when running `git pull --rebase`?*

- **Target Answer**: `FETCH_AND_REBASE`
- **Typed Misconception ID**: `MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FETCH_AND_MERGE'**:
  - *What Went Wrong*: Standard pull merges. git pull --rebase executes FETCH_AND_REBASE.
  - *Simpler Mental Model*: Strategy is FETCH_AND_REBASE.
  - *Guided Fix Action*: Type FETCH_AND_REBASE

---

### 🔹 Block 2: Setting Upstream Tracking: `git push -u origin <branch>`

- **Concept Budget / Primary Invariant**: `Upstream Tracking Invariant`
- **Supporting Terms & Invariants**: ``-u` / `--set-upstream` (Links your local branch to `origin/<branch>`, allowing future `git push` and `git pull` commands to run without arguments)`

#### ⚙️ Syntax & Command Anatomy: Upstream Tracking Command

```text
// 1. First push: git push -u origin feature-auth
//    -> Sets up local branch 'feature-auth' to track remote 'origin/feature-auth'
// 2. Subsequent pushes: git push  (No arguments needed!)
```

- **Line 1**: Initial push with upstream flag.
- **Line 2**: Streamlined subsequent pushes.

#### 🐙 Runnable Git Simulator: `upstream_demo.js`

```javascript
function getSetUpstreamFlag() {
  return '-u';
}

console.log(getSetUpstreamFlag());
```

**Expected Terminal Output**:
```text
-u
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git push` sets the upstream tracking reference for a new branch?*

- **Target Answer**: `-u`
- **Typed Misconception ID**: `MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH`

**Diagnostic Recovery Paths**:
- **If Student Triggers '-f'**:
  - *What Went Wrong*: -f is force push. Upstream tracking uses -u.
  - *Simpler Mental Model*: Type -u.
  - *Guided Fix Action*: Type -u

---

### 🔹 Block 3: Cleaning Deleted Remote Refs: `git fetch -p` (`--prune`)

- **Concept Budget / Primary Invariant**: `git fetch --prune Invariant`
- **Supporting Terms & Invariants**: ``git fetch -p` (Deletes stale local tracking references in `.git/refs/remotes/origin/` for remote branches that have been merged and deleted on GitHub)`

#### 🐙 Runnable Git Simulator: `fetch_prune_demo.js`

```javascript
function getFetchPruneFlag() {
  return '-p';
}

console.log(getFetchPruneFlag());
```

**Expected Terminal Output**:
```text
-p
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git fetch` deletes local references to remote branches that no longer exist on the server?*

- **Target Answer**: `-p`
- **Typed Misconception ID**: `MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH`

**Diagnostic Recovery Paths**:
- **If Student Triggers '-d'**:
  - *What Went Wrong*: Pruning remote tracking refs uses -p.
  - *Simpler Mental Model*: Type -p.
  - *Guided Fix Action*: Type -p

---

## 📅 Day 21: ⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 3 Synthesis: The complete advanced version control and remote synchronization engine: 1. Linear rebase commit replay; 2. Interactive rebase squashing (1 clean resulting commit); 3. Cherry-pick isolated patch application; 4. SSH remote protocol verification (`ed25519`); 5. `git pull --rebase` synchronization.

### 🔹 Block 1: Git Remote & Advanced Rebase Master Engine Synthesis

- **Concept Budget / Primary Invariant**: `Git Remote & Advanced Rebase Master Engine`
- **Supporting Terms & Invariants**: `Linear Rebase Engine`, `Interactive Squash Engine`, `Cherry Pick Engine`, `SSH Protocol Engine`, `Rebase Sync Engine`

#### 🔄 Computing System Execution Flowchart: Milestone 3 Advanced Rebase & Sync Pipeline

1. **Simulates linear rebasing & interactive squashing (1 clean resulting commit)**
2. **Applies isolated cherry-pick patches (fix_c789abc) to production release heads**
3. **Verifies ed25519 SSH protocols & simulates pull --rebase remote sync**
4. **Activates Git Remote & Advanced Rebase Master Engine!**

#### 🐙 Runnable Git Simulator: `advanced_kernel_demo.js`

```javascript
function runAdvancedMaster() {
  return {
    rebaseSubsystem: 'ONLINE_LINEAR_REPLAY_ACTIVE',
    squashSubsystem: 'ONLINE_1COMMIT_SQUASHED_ACTIVE',
    cherrySubsystem: 'ONLINE_ISOLATED_PATCH_ACTIVE',
    sshSubsystem: 'ONLINE_ED25519_PROTOCOL_ACTIVE',
    syncSubsystem: 'ONLINE_REBASE_SYNC_ACTIVE',
    engineStatus: 'GIT_ADVANCED_MASTER_ACTIVE'
  };
}

console.log(runAdvancedMaster().engineStatus);
```

**Expected Terminal Output**:
```text
GIT_ADVANCED_MASTER_ACTIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the Git Remote & Advanced Rebase Master Engine?*

- **Target Answer**: `GIT_ADVANCED_MASTER_ACTIVE`
- **Typed Misconception ID**: `MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches GIT_ADVANCED_MASTER_ACTIVE.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type GIT_ADVANCED_MASTER_ACTIVE

---

### 🔹 Block 2: Git Advanced Engine Invariant Verification & Precision Audit

- **Concept Budget / Primary Invariant**: `Git Advanced Invariant Verification`
- **Supporting Terms & Invariants**: `Rebase Invariant`, `Remote Invariant`, `100% Quality Invariant`

#### 🐙 Runnable Git Simulator: `advanced_audit_demo.js`

```javascript
function auditAdvanced(reb, sq, ch, ssh, sync) {
  const passed = reb && sq && ch && ssh && sync;
  return {
    rebaseVerified: reb,
    squashVerified: sq,
    cherryVerified: ch,
    sshVerified: ssh,
    syncVerified: sync,
    grade: passed ? 'GIT_ADVANCED_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditAdvanced(true, true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"rebaseVerified":true,"squashVerified":true,"cherryVerified":true,"sshVerified":true,"syncVerified":true,"grade":"GIT_ADVANCED_ENGINE_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when Rebasing, Squashing, Cherry-Picking, SSH, and Sync pass 100%?*

- **Target Answer**: `GIT_ADVANCED_ENGINE_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards GIT_ADVANCED_ENGINE_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards GIT_ADVANCED_ENGINE_AUDIT_PASSED.
  - *Guided Fix Action*: Type GIT_ADVANCED_ENGINE_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 3 Git Advanced Certification

- **Concept Budget / Primary Invariant**: `Milestone 3 Certification`
- **Supporting Terms & Invariants**: `Git Advanced Verified`, `100% Quality Invariant`

#### 🐙 Runnable Git Simulator: `milestone3_git_cert.js`

```javascript
console.log('⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 3 completion?*

- **Target Answer**: `⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]

---

## 📅 Day 22: GitHub Collaboration & Pull Request (PR) Lifecycle: Forking vs Branching Models

> **💡 Everyday Metaphor / Intuitive Model**:
> A GitHub Pull Request Is a Formal Architectural Proposal Before City Council: Instead of hammering changes directly onto the city highway (`main`), you build the detour on a separate model branch, attach blueprints and linked problem reports (`Closes #108`), inviting senior inspectors to review and sign off before concrete is poured.

### 🔹 Block 1: PR Lifecycle: Substantive Description & Linked Issue (`Closes #108`)

- **Concept Budget / Primary Invariant**: `GitHub Pull Request Issue Linker & Metadata Auditor`
- **Supporting Terms & Invariants**: `Linked Issue ID ($108$)`, `Issue Linked (`true`)`, `Description Substantive (`true`)`, `PR Ready for Review (`true`)`, `Status: Pull Request Metadata Ready for Review Nominal`

#### 📦 Memory Box / Data Layout Diagram: GitHub Pull Request Metadata Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **PR Title** | 'feat: add stripe checkout' | `Title` |
| **Linked Issue Keyword** | 'Closes #108' -> Automatically closes issue #108 on merge | `Keyword` |
| **PR Review Readiness** | Ready: true | Issue: 108 (PR METADATA READY FOR REVIEW NOMINAL!) | `Readiness` |

#### 🐙 Runnable Git Simulator: `pr_audit_demo.js`

```javascript
function auditPr(title, body) {
  const m = body.match(/(?:Fixes|Closes|Resolves)\s+#(\d+)/i);
  const ready = body.trim().length >= 30 && !!m;
  return {
    issueId: m ? parseInt(m[1], 10) : null,
    isReady: ready,
    status: ready ? 'PULL_REQUEST_METADATA_READY_FOR_REVIEW_NOMINAL' : 'PR_METADATA_INCOMPLETE'
  };
}

const body = 'This PR implements Stripe webhooks.\n\nCloses #108.';
console.log(JSON.stringify(auditPr('feat: add stripe checkout', body)));
```

**Expected Terminal Output**:
```text
{"issueId":108,"isReady":true,"status":"PULL_REQUEST_METADATA_READY_FOR_REVIEW_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What issue ID integer was automatically linked to the Pull Request from 'Closes #108'?*

- **Target Answer**: `108`
- **Typed Misconception ID**: `MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '42'**:
  - *What Went Wrong*: The body references issue #108.
  - *Simpler Mental Model*: Issue ID is 108.
  - *Guided Fix Action*: Type 108

---

### 🔹 Block 2: Draft Pull Requests: Work-in-Progress Transparency Without Triggering Review Alerts

- **Concept Budget / Primary Invariant**: `Draft PR Invariant`
- **Supporting Terms & Invariants**: `Draft PR (`Draft`: Prevents accidental merging and signals to the team that code is still in active development while allowing automated CI testing to run)`

#### ⚙️ Syntax & Command Anatomy: Draft PR States

```text
// 1. Create Draft PR -> CI runs tests, notifications to reviewers are suppressed
// 2. Polish code & squash commits
// 3. Click "Ready for review" -> Notifies designated reviewers!
```

- **Line 1**: Draft state.
- **Line 2**: Refinement.
- **Line 3**: Promotion to active review.

#### 🐙 Runnable Git Simulator: `draft_pr_demo.js`

```javascript
function getDraftPrBenefit() {
  return 'DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI';
}

console.log(getDraftPrBenefit());
```

**Expected Terminal Output**:
```text
DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What primary operational safeguard is provided by GitHub Draft Pull Requests?*

- **Target Answer**: `DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI`
- **Typed Misconception ID**: `MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'BLOCKS_CI'**:
  - *What Went Wrong*: CI still runs on draft PRs: DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI.
  - *Simpler Mental Model*: Matches DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI.
  - *Guided Fix Action*: Type DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI

---

### 🔹 Block 3: Collaboration Models: Fork & Pull (Open Source) vs Shared Repository (Internal Teams)

- **Concept Budget / Primary Invariant**: `Fork vs Branch Invariant`
- **Supporting Terms & Invariants**: `Fork & Pull (Contributors clone an independent copy of repo under their account without write access)`, `Shared Repo (Team members push branches directly to company repo)`

#### 🐙 Runnable Git Simulator: `collab_models_demo.js`

```javascript
function getOpenSourceModel() {
  return 'FORK_AND_PULL_MODEL';
}

console.log(getOpenSourceModel());
```

**Expected Terminal Output**:
```text
FORK_AND_PULL_MODEL
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What collaboration model is standard for open-source GitHub projects where contributors lack direct write permissions?*

- **Target Answer**: `FORK_AND_PULL_MODEL`
- **Typed Misconception ID**: `MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SHARED'**:
  - *What Went Wrong*: Shared branch requires write permissions. Open source uses FORK_AND_PULL_MODEL.
  - *Simpler Mental Model*: Matches FORK_AND_PULL_MODEL.
  - *Guided Fix Action*: Type FORK_AND_PULL_MODEL

---

## 📅 Day 23: Code Review Best Practices: Reviewing Diffs, Inline Comments & LGTM Approvals

> **💡 Everyday Metaphor / Intuitive Model**:
> Code Review Is Co-Pilot Flight Verification Before Takeoff: The reviewer scans instrument gauges (unified diffs), points out minor cabin noise (`nit: rename var`), and stamps the flight manifest with 'LGTM' (Looks Good To Me) only when all safety checks are certified.

### 🔹 Block 1: Review Verdicts: Evaluating `'APPROVE'` (LGTM) vs `'REQUEST_CHANGES'`

- **Concept Budget / Primary Invariant**: `GitHub Code Review Verdict Evaluator`
- **Supporting Terms & Invariants**: `Verdict (`'APPROVE'`)`, `Approved (`true`)`, `Total Comments ($1$ nitpick)`, `Status: Pull Request Approved LGTM Nominal`

#### 📦 Memory Box / Data Layout Diagram: Code Review Verdict Decision Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Review Comments** | [{ isNitpick: true, text: 'nit: rename variable' }] | `Comments` |
| **Blocking Bugs Found** | false (No architectural or security blockers) | `Blockers` |
| **Verdict Outcome** | Verdict: APPROVE | Approved: true (PULL REQUEST APPROVED LGTM NOMINAL!) | `Verdict` |

#### 🐙 Runnable Git Simulator: `review_verdict_demo.js`

```javascript
function evaluateReview(comments, hasBlockers) {
  if (hasBlockers) return { verdict: 'REQUEST_CHANGES', isApproved: false };
  const isApproved = comments.every(c => c.isNitpick);
  return {
    verdict: isApproved ? 'APPROVE' : 'COMMENT',
    isApproved,
    status: isApproved ? 'PULL_REQUEST_APPROVED_LGTM_NOMINAL' : 'REVIEW_COMMENTS_SUBMITTED'
  };
}

console.log(JSON.stringify(evaluateReview([{ isNitpick: true, text: 'nit: rename var' }], false)));
```

**Expected Terminal Output**:
```text
{"verdict":"APPROVE","isApproved":true,"status":"PULL_REQUEST_APPROVED_LGTM_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What review verdict is awarded when comments consist exclusively of non-blocking nitpicks?*

- **Target Answer**: `APPROVE`
- **Typed Misconception ID**: `MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'REQUEST_CHANGES'**:
  - *What Went Wrong*: Nitpicks do not block approval. Verdict is APPROVE.
  - *Simpler Mental Model*: Verdict is APPROVE.
  - *Guided Fix Action*: Type APPROVE

---

### 🔹 Block 2: Suggested Changes: Proposing Direct Inline Code Replacements (`suggestion`)

- **Concept Budget / Primary Invariant**: `Suggested Changes Invariant`
- **Supporting Terms & Invariants**: ``suggestion` markdown blocks (Allows reviewers to write direct replacement code snippets that the PR author can apply with a single click button on GitHub)`

#### ⚙️ Syntax & Command Anatomy: Suggested Change Markdown Format

```text
// In a GitHub PR inline comment:
// ```suggestion
// const maxRetries = 3;
// ```
// -> Author clicks "Commit suggestion" to apply immediately!
```

- **Line 1**: GitHub comment.
- **Line 2**: Opening suggestion fence.
- **Line 3**: Proposed replacement code.
- **Line 4**: Closing fence.
- **Line 5**: Instant apply.

#### 🐙 Runnable Git Simulator: `suggested_changes_demo.js`

```javascript
function getSuggestedChangesFence() {
  return '```suggestion';
}

console.log(getSuggestedChangesFence());
```

**Expected Terminal Output**:
```text
```suggestion
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What markdown fence tag activates GitHub's interactive 1-click suggested change feature?*

- **Target Answer**: ````suggestion`
- **Typed Misconception ID**: `MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers '```diff'**:
  - *What Went Wrong*: diff provides syntax coloring. Interactive 1-click suggestions require ```suggestion.
  - *Simpler Mental Model*: Type ```suggestion.
  - *Guided Fix Action*: Type ```suggestion

---

### 🔹 Block 3: Engineering Acronym: LGTM (Looks Good To Me)

- **Concept Budget / Primary Invariant**: `LGTM Invariant`
- **Supporting Terms & Invariants**: `LGTM (`Looks Good To Me`: The universal tech industry shorthand for approving a code review)`

#### 🐙 Runnable Git Simulator: `lgtm_demo.js`

```javascript
function getLgtm() {
  return 'LGTM';
}

console.log(getLgtm());
```

**Expected Terminal Output**:
```text
LGTM
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What 4-letter acronym is universally used across software engineering teams to indicate PR approval?*

- **Target Answer**: `LGTM`
- **Typed Misconception ID**: `MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'WIP'**:
  - *What Went Wrong*: WIP is Work In Progress. Approval shorthand is LGTM.
  - *Simpler Mental Model*: Type LGTM.
  - *Guided Fix Action*: Type LGTM

---

## 📅 Day 24: GitHub Branch Protection Rules: Required CI Status Checks & Protected `main`

> **💡 Everyday Metaphor / Intuitive Model**:
> Branch Protection Rules Are Bank Vault Laser Grids: No single person—not even the project manager—can walk into the vault and change production `main` directly (`git push --force` is blocked); the laser grid only opens when 1 approving human key turns (`minApprovalsRequired: 1`) AND the automated security robot passes (`ciPassed: true`).

### 🔹 Block 1: Branch Protection: Approvals $\ge 1$ & CI Passed $\implies$ Merge Allowed

- **Concept Budget / Primary Invariant**: `GitHub Branch Protection Rule Gatekeeper & Merge Auditor`
- **Supporting Terms & Invariants**: `Approvals Received ($2$)`, `Min Approvals ($1$)`, `CI Passing (`true`)`, `Merge Eligible (`true`)`, `Status: Branch Protection Passed Merge Permitted Nominal`

#### 📦 Memory Box / Data Layout Diagram: Branch Protection Rule Gatekeeper Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Human Review Gate** | Approvals: 2 >= Min Required: 1 -> Review Gate PASSED | `Human Gate` |
| **Automated CI Gate** | GitHub Actions Tests -> PASSING (All test suites green) | `CI Gate` |
| **Merge Permission** | Merge Allowed: true (BRANCH PROTECTION PASSED MERGE PERMITTED NOMINAL!) | `Permission` |

#### 🐙 Runnable Git Simulator: `branch_protection_demo.js`

```javascript
function checkMerge(approvals, minReq, ciOk, isProtected) {
  const ok = approvals >= minReq && ciOk;
  return {
    mergeAllowed: ok,
    status: ok ? 'BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL' : 'MERGE_BLOCKED'
  };
}

console.log(JSON.stringify(checkMerge(2, 1, true, true)));
```

**Expected Terminal Output**:
```text
{"mergeAllowed":true,"status":"BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that a Pull Request meets both human review and automated CI branch protection criteria?*

- **Target Answer**: `BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL`
- **Typed Misconception ID**: `MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'MERGE_BLOCKED'**:
  - *What Went Wrong*: With 2 approvals and CI passing, the status is BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL.
  - *Simpler Mental Model*: Matches BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL.
  - *Guided Fix Action*: Type BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL

---

### 🔹 Block 2: Dismiss Stale Approvals: Invalidating Old Reviews When New Code Is Pushed

- **Concept Budget / Primary Invariant**: `Dismiss Stale Approvals Invariant`
- **Supporting Terms & Invariants**: `Dismiss Stale Approvals (A critical branch protection rule that automatically resets existing PR approvals whenever new commits are pushed, preventing unreviewed changes from slipping into production)`

#### ⚙️ Syntax & Command Anatomy: Security Rule Rationale

```text
// 1. Reviewer approves PR based on Commit A
// 2. Author secretly pushes malicious/buggy Commit B
// 3. WITH DISMISS STALE APPROVALS: Approval is revoked immediately -> Requires NEW review!
```

- **Line 1**: Initial approval.
- **Line 2**: New commit added.
- **Line 3**: Security revocation.

#### 🐙 Runnable Git Simulator: `stale_approvals_demo.js`

```javascript
function getDismissStaleRuleEffect() {
  return 'AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED';
}

console.log(getDismissStaleRuleEffect());
```

**Expected Terminal Output**:
```text
AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What does the 'Dismiss stale pull request approvals when new commits are pushed' protection rule enforce?*

- **Target Answer**: `AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED`
- **Typed Misconception ID**: `MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'BLOCKS_PUSH'**:
  - *What Went Wrong*: It allows pushing but revokes approval: AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED.
  - *Simpler Mental Model*: Matches AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED.
  - *Guided Fix Action*: Type AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED

---

### 🔹 Block 3: Blocking Force Pushes: Protecting Production History Against `--force`

- **Concept Budget / Primary Invariant**: `Block Force Push Invariant`
- **Supporting Terms & Invariants**: `Block Force Pushes (Ensures developers cannot overwrite or delete public commit history on `main` via `git push --force`)`

#### 🐙 Runnable Git Simulator: `block_force_demo.js`

```javascript
function getProtectedBranchRule() {
  return 'BLOCK_FORCE_PUSHES_AND_DELETIONS';
}

console.log(getProtectedBranchRule());
```

**Expected Terminal Output**:
```text
BLOCK_FORCE_PUSHES_AND_DELETIONS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What destructive Git operation is blocked by default on GitHub protected branches?*

- **Target Answer**: `BLOCK_FORCE_PUSHES_AND_DELETIONS`
- **Typed Misconception ID**: `MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'MERGES'**:
  - *What Went Wrong*: Merges are allowed through PRs. Destructive force pushes are blocked: BLOCK_FORCE_PUSHES_AND_DELETIONS.
  - *Simpler Mental Model*: Matches BLOCK_FORCE_PUSHES_AND_DELETIONS.
  - *Guided Fix Action*: Type BLOCK_FORCE_PUSHES_AND_DELETIONS

---

## 📅 Day 25: Git Workflows & Branching Strategies: Trunk-Based Development vs GitFlow

> **💡 Everyday Metaphor / Intuitive Model**:
> Trunk-Based vs GitFlow Is High-Speed Bullet Trains vs Traditional Freight Rail: Trunk-Based development runs short, frequent trains every hour straight into the central station (`main`), using track switches (feature flags) to safely toggle new cargo; GitFlow builds separate side tracks (`develop`, `release/*`, `hotfix/*`) for heavy cargo departing once a month.

### 🔹 Block 1: Workflow Matching: Continuous Delivery $\to$ `'TRUNK_BASED_DEVELOPMENT'`

- **Concept Budget / Primary Invariant**: `Team Workflow Strategy Matcher`
- **Supporting Terms & Invariants**: `Deployment Frequency (`'CONTINUOUS_DEPLOYMENT_DAILY'`)`, `Strategy (`'TRUNK_BASED_DEVELOPMENT'`)`, `Branch Lifespan ($24$ hours)`, `Status: High Velocity Trunk Based Matched`

#### 📦 Memory Box / Data Layout Diagram: Branching Strategy Architecture Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Trunk-Based Development** | Short-lived branches (<24 hrs) | Direct merge to main | Feature Flags -> HIGH VELOCITY CI/CD | `Trunk` |
| **GitFlow Architecture** | Long-lived develop & release branches | Strict version gateways -> SCHEDULED RELEASES | `GitFlow` |
| **Matched Strategy** | TRUNK_BASED_DEVELOPMENT (MATCHED NOMINAL!) | `Strategy` |

#### 🐙 Runnable Git Simulator: `workflow_matcher_demo.js`

```javascript
function matchWorkflow(freq, flags) {
  if (freq === 'CONTINUOUS_DEPLOYMENT_DAILY' || flags) {
    return { strategy: 'TRUNK_BASED_DEVELOPMENT', maxHours: 24, status: 'HIGH_VELOCITY_TRUNK_BASED_MATCHED' };
  }
  return { strategy: 'GIT_FLOW', maxHours: 168 };
}

console.log(JSON.stringify(matchWorkflow('CONTINUOUS_DEPLOYMENT_DAILY', true)));
```

**Expected Terminal Output**:
```text
{"strategy":"TRUNK_BASED_DEVELOPMENT","maxHours":24,"status":"HIGH_VELOCITY_TRUNK_BASED_MATCHED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What Git branching strategy is recommended for high-velocity teams practicing continuous daily deployment with feature flags?*

- **Target Answer**: `TRUNK_BASED_DEVELOPMENT`
- **Typed Misconception ID**: `MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'GIT_FLOW'**:
  - *What Went Wrong*: GitFlow is designed for scheduled releases. High-velocity CI/CD uses TRUNK_BASED_DEVELOPMENT.
  - *Simpler Mental Model*: Strategy is TRUNK_BASED_DEVELOPMENT.
  - *Guided Fix Action*: Type TRUNK_BASED_DEVELOPMENT

---

### 🔹 Block 2: Decoupling Deployment from Release: Feature Flags in Trunk-Based Development

- **Concept Budget / Primary Invariant**: `Feature Flags Invariant`
- **Supporting Terms & Invariants**: `Feature Flags (`if (flags.isEnabled('new-checkout'))`: Allows merging incomplete features into production `main` daily without exposing unreleased UI to end users)`

#### ⚙️ Syntax & Command Anatomy: Feature Flag Pattern

```text
// Merged into production main, but disabled by default:
// if (featureFlags.isOn('NEW_PAYMENT_FLOW')) {
//   renderStripeV3Checkout();
// } else {
//   renderLegacyCheckout();
// }
```

- **Line 1**: Production code path.
- **Line 2**: Flag condition.
- **Line 3**: Experimental feature.
- **Line 4**: Fallback.
- **Line 5**: Safe default.

#### 🐙 Runnable Git Simulator: `feature_flags_demo.js`

```javascript
function getFeatureFlagPurpose() {
  return 'DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE';
}

console.log(getFeatureFlagPurpose());
```

**Expected Terminal Output**:
```text
DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What major architectural capability is unlocked by implementing feature flags alongside trunk-based development?*

- **Target Answer**: `DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE`
- **Typed Misconception ID**: `MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SPEED'**:
  - *What Went Wrong*: Primary purpose is: DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE.
  - *Simpler Mental Model*: Matches DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE.
  - *Guided Fix Action*: Type DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE

---

### 🔹 Block 3: GitFlow Branches: `main`, `develop`, `feature/*`, `release/*`, and `hotfix/*`

- **Concept Budget / Primary Invariant**: `GitFlow Branches Invariant`
- **Supporting Terms & Invariants**: `GitFlow Structure (`main` = production releases; `develop` = integration trunk; `feature/*` = new capabilities; `release/*` = pre-production staging; `hotfix/*` = urgent production patches)`

#### 🐙 Runnable Git Simulator: `gitflow_branches_demo.js`

```javascript
function getGitFlowIntegrationBranch() {
  return 'develop';
}

console.log(getGitFlowIntegrationBranch());
```

**Expected Terminal Output**:
```text
develop
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *In the traditional GitFlow branching model, what is the name of the primary day-to-day integration branch?*

- **Target Answer**: `develop`
- **Typed Misconception ID**: `MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'main'**:
  - *What Went Wrong*: In GitFlow, main is reserved exclusively for production releases. Daily integration occurs in develop.
  - *Simpler Mental Model*: Branch is develop.
  - *Guided Fix Action*: Type develop

---

## 📅 Day 26: GitHub Issues, Milestones & Project Boards: Agile Kanban Workflow Tracking

> **💡 Everyday Metaphor / Intuitive Model**:
> GitHub Project Boards Are an Air Traffic Control Flight Strip Bay: Issues are incoming aircraft flights; grouping them into Milestones sets the landing window target ($Completion = 50.0\%$); and dragging issue cards across Kanban columns (Todo $\to$ In Progress $\to$ Done) updates the entire team's flight radar in real time.

### 🔹 Block 1: Sprint Milestones: Calculating $50.0\%$ Completion ($5$ Closed / $10$ Total)

- **Concept Budget / Primary Invariant**: `GitHub Issue Template & Milestone Burndown Calculator`
- **Supporting Terms & Invariants**: `Closed Issues ($5$)`, `Open Issues ($5$)`, `Total Issues ($10$)`, `Completion Percentage ($50.0\%$)`, `Status: Milestone In Progress`

#### 📦 Memory Box / Data Layout Diagram: Agile Milestone Burndown Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Closed Issues** | 5 completed sprint tasks | `Closed` |
| **Open Issues** | 5 remaining sprint tasks | `Open` |
| **Progress Calculation** | (5 / 10) * 100 = 50.0% Completion (MILESTONE IN PROGRESS NOMINAL!) | `Percent` |

#### 🐙 Runnable Git Simulator: `milestone_calc_demo.js`

```javascript
function calcMilestone(closed, open) {
  const tot = closed + open;
  const pct = Number(((closed / tot) * 100).toFixed(1));
  return {
    total: tot,
    completionPct: pct,
    isComplete: open === 0,
    status: 'MILESTONE_IN_PROGRESS'
  };
}

console.log(JSON.stringify(calcMilestone(5, 5)));
```

**Expected Terminal Output**:
```text
{"total":10,"completionPct":50,"isComplete":false,"status":"MILESTONE_IN_PROGRESS"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What completion percentage number is calculated for a milestone with 5 closed and 5 open issues?*

- **Target Answer**: `50`
- **Typed Misconception ID**: `MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '100'**:
  - *What Went Wrong*: 5 out of 10 is 50%.
  - *Simpler Mental Model*: Percentage is 50.
  - *Guided Fix Action*: Type 50

---

### 🔹 Block 2: Standardizing Bug Reports: Issue Templates (`.github/ISSUE_TEMPLATE`)

- **Concept Budget / Primary Invariant**: `Issue Templates Invariant`
- **Supporting Terms & Invariants**: `Issue Form (`.github/ISSUE_TEMPLATE/bug_report.yml`: Enforces structured bug reproduction steps, expected vs actual behavior, and environment logs from users)`

#### ⚙️ Syntax & Command Anatomy: Issue Template Directory Structure

```text
// .github/
// └── ISSUE_TEMPLATE/
//     ├── bug_report.yml
//     └── feature_request.yml
```

- **Line 1**: GitHub metadata directory.
- **Line 2**: Issue templates folder.
- **Line 3**: Structured bug YAML form.
- **Line 4**: Feature request form.

#### 🐙 Runnable Git Simulator: `issue_template_demo.js`

```javascript
function getIssueTemplateDirectory() {
  return '.github/ISSUE_TEMPLATE';
}

console.log(getIssueTemplateDirectory());
```

**Expected Terminal Output**:
```text
.github/ISSUE_TEMPLATE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *In what repository directory path does GitHub look for custom Issue Templates?*

- **Target Answer**: `.github/ISSUE_TEMPLATE`
- **Typed Misconception ID**: `MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '.github/workflows'**:
  - *What Went Wrong*: workflows is for GitHub Actions. Issue templates live in .github/ISSUE_TEMPLATE.
  - *Simpler Mental Model*: Type .github/ISSUE_TEMPLATE.
  - *Guided Fix Action*: Type .github/ISSUE_TEMPLATE

---

### 🔹 Block 3: Automated Kanban Workflows: Auto-Closing Cards on PR Merge

- **Concept Budget / Primary Invariant**: `Project Automation Invariant`
- **Supporting Terms & Invariants**: `Automated Kanban (`Auto-move`: Moving cards from 'In Progress' to 'Done' automatically when associated PRs merge into `main`)`

#### 🐙 Runnable Git Simulator: `kanban_demo.js`

```javascript
function getAutoMoveTargetColumn() {
  return 'Done';
}

console.log(getAutoMoveTargetColumn());
```

**Expected Terminal Output**:
```text
Done
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What destination column do merged Pull Request cards automatically move to on GitHub Projects boards?*

- **Target Answer**: `Done`
- **Typed Misconception ID**: `MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'In Progress'**:
  - *What Went Wrong*: In Progress is for open PRs. Merging moves cards to Done.
  - *Simpler Mental Model*: Column is Done.
  - *Guided Fix Action*: Type Done

---

## 📅 Day 27: GitHub Actions CI/CD Basics: Automated Workflow Pipelines (`.github/workflows`)

> **💡 Everyday Metaphor / Intuitive Model**:
> GitHub Actions Is an Automated Robotic Quality Testing Assembly Line: Every time you push a commit or open a PR (`on: [push, pull_request]`), GitHub spins up a clean cloud virtual machine (`runs-on: ubuntu-latest`), clones your code (`actions/checkout@v4`), and runs your automated test suites (`npm test`) before allowing code to deploy.

### 🔹 Block 1: CI/CD Workflows: Validating `.github/workflows/ci.yml` YAML Structure

- **Concept Budget / Primary Invariant**: `GitHub Actions Workflow YAML Structure Validator`
- **Supporting Terms & Invariants**: `Workflow Name (`'name: CI'`)`, `Triggers (`'on: [push, pull_request]'`)`, `Jobs Definition`, `Checkout Action (`'actions/checkout@v4'`)`, `Status: GitHub Actions Workflow Valid Nominal`

#### 📦 Memory Box / Data Layout Diagram: GitHub Actions CI Pipeline Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Trigger Event** | on: [push, pull_request] -> Fires on code upload | `Trigger` |
| **Virtual Runner** | runs-on: ubuntu-latest (Clean ephemeral container) | `Runner` |
| **Checkout & Test** | uses: actions/checkout@v4 | run: npm test (WORKFLOW VALID NOMINAL!) | `Steps` |

#### 🐙 Runnable Git Simulator: `ci_workflow_demo.js`

```javascript
function validateWorkflow(yaml) {
  const ok = yaml.includes('name:') && yaml.includes('on:') && yaml.includes('jobs:') && yaml.includes('actions/checkout');
  return {
    isValid: ok,
    status: ok ? 'GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL' : 'DEFECT'
  };
}

const yaml = 'name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm test';
console.log(JSON.stringify(validateWorkflow(yaml)));
```

**Expected Terminal Output**:
```text
{"isValid":true,"status":"GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms valid configuration of a GitHub Actions CI workflow YAML file?*

- **Target Answer**: `GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL`
- **Typed Misconception ID**: `MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: Contains name, on, jobs, checkout: GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL.
  - *Simpler Mental Model*: Matches GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL.
  - *Guided Fix Action*: Type GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL

---

### 🔹 Block 2: The Essential Step: `actions/checkout@v4` Clones Repo onto the Cloud Runner

- **Concept Budget / Primary Invariant**: `actions/checkout Invariant`
- **Supporting Terms & Invariants**: ``actions/checkout@v4` (A runner begins completely empty; without `uses: actions/checkout@v4`, your repository files do not exist on the runner and subsequent build scripts fail immediately)`

#### ⚙️ Syntax & Command Anatomy: Standard CI Job Anatomy

```text
name: Node.js CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4  # CRITICAL: Clones your repository files into the runner!
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
```

- **Line 1**: Pipeline name.
- **Line 2**: Triggers.
- **Line 3**: Jobs array.
- **Line 4**: Job definition.
- **Line 5**: OS runner.
- **Line 6**: Steps array.
- **Line 7**: Repository checkout.
- **Line 8**: Runtime setup.
- **Line 9**: Version config.
- **Line 10**: Version parameter.
- **Line 11**: Clean install.
- **Line 12**: Test execution.

#### 🐙 Runnable Git Simulator: `checkout_action_demo.js`

```javascript
function getStandardCheckoutAction() {
  return 'actions/checkout@v4';
}

console.log(getStandardCheckoutAction());
```

**Expected Terminal Output**:
```text
actions/checkout@v4
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What official GitHub Action must be included in workflow steps to clone repository code onto the virtual runner?*

- **Target Answer**: `actions/checkout@v4`
- **Typed Misconception ID**: `MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'setup-node'**:
  - *What Went Wrong*: setup-node configures Node. Cloning the code requires actions/checkout@v4.
  - *Simpler Mental Model*: Type actions/checkout@v4.
  - *Guided Fix Action*: Type actions/checkout@v4

---

### 🔹 Block 3: Workflow Directory Path: `.github/workflows/*.yml`

- **Concept Budget / Primary Invariant**: `Workflow Directory Invariant`
- **Supporting Terms & Invariants**: ``.github/workflows` (GitHub exclusively parses YAML workflow automation definitions located within this specific directory)`

#### 🐙 Runnable Git Simulator: `workflow_dir_demo.js`

```javascript
function getWorkflowDir() {
  return '.github/workflows';
}

console.log(getWorkflowDir());
```

**Expected Terminal Output**:
```text
.github/workflows
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *In what repository directory path must GitHub Actions CI/CD YAML files be saved?*

- **Target Answer**: `.github/workflows`
- **Typed Misconception ID**: `MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '.github'**:
  - *What Went Wrong*: Workflows must be placed inside the nested .github/workflows directory.
  - *Simpler Mental Model*: Type .github/workflows.
  - *Guided Fix Action*: Type .github/workflows

---

## 📅 Day 28: Git Submodules & Monorepo Multi-Package Management: `git submodule` Mechanics

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Submodules Are Nested Russian Matryoshka Dolls: Your main application repository contains a locked reference pointer (`lib/shared` at commit `c789abc`) pointing to an entirely separate Git repository; cloning the parent doll with `git clone --recursive` unrolls all nested child repositories automatically.

### 🔹 Block 1: Submodule Architecture: Parsing `.gitmodules` (`lib/shared` Pointer)

- **Concept Budget / Primary Invariant**: `Git Submodule .gitmodules Config Parser & Pointer Validator`
- **Supporting Terms & Invariants**: `Submodule Path (`'lib/shared'`)`, `Submodule URL (`'https://github.com/org/shared.git'`)`, `Valid Submodule (`true`)`, `Status: Gitmodules Parsed Nominal`

#### 📦 Memory Box / Data Layout Diagram: Git Submodule Configuration Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **Submodule Root Config** | .gitmodules text file at repository root | `Config` |
| **Relative Target Path** | path = lib/shared | `Path` |
| **Remote Repository URL** | url = https://github.com/org/shared.git (GITMODULES PARSED NOMINAL!) | `URL` |

#### 🐙 Runnable Git Simulator: `submodule_demo.js`

```javascript
function parseGitmodules(text) {
  const p = text.match(/path\s*=\s*(\S+)/);
  const u = text.match(/url\s*=\s*(\S+)/);
  return {
    path: p ? p[1] : null,
    url: u ? u[1] : null,
    isValid: !!(p && u),
    status: 'GITMODULES_PARSED_NOMINAL'
  };
}

const text = '[submodule "lib/shared"]\n\tpath = lib/shared\n\turl = https://github.com/org/shared.git';
console.log(JSON.stringify(parseGitmodules(text)));
```

**Expected Terminal Output**:
```text
{"path":"lib/shared","url":"https://github.com/org/shared.git","isValid":true,"status":"GITMODULES_PARSED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What relative submodule path is parsed from the `.gitmodules` configuration?*

- **Target Answer**: `lib/shared`
- **Typed Misconception ID**: `MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'shared'**:
  - *What Went Wrong*: The path is lib/shared.
  - *Simpler Mental Model*: Path is lib/shared.
  - *Guided Fix Action*: Type lib/shared

---

### 🔹 Block 2: Cloning Submodules: `git clone --recursive <url>`

- **Concept Budget / Primary Invariant**: `--recursive Clone Invariant`
- **Supporting Terms & Invariants**: ``--recursive` / `--recurse-submodules` (Instructs Git to initialize and fetch all nested submodules during repository cloning in a single command)`

#### ⚙️ Syntax & Command Anatomy: Submodule Cloning Commands

```text
// 1. Modern single-step clone: git clone --recursive https://github.com/org/parent.git
// 2. Cloned without flag? Initialize manually: git submodule update --init --recursive
```

- **Line 1**: Single-step recursive clone.
- **Line 2**: Post-clone manual initialization.

#### 🐙 Runnable Git Simulator: `clone_recursive_demo.js`

```javascript
function getCloneRecursiveFlag() {
  return '--recursive';
}

console.log(getCloneRecursiveFlag());
```

**Expected Terminal Output**:
```text
--recursive
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What flag passed to `git clone` automatically downloads all nested submodule dependencies?*

- **Target Answer**: `--recursive`
- **Typed Misconception ID**: `MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT`

**Diagnostic Recovery Paths**:
- **If Student Triggers '--all'**:
  - *What Went Wrong*: Submodule cloning uses --recursive or --recurse-submodules.
  - *Simpler Mental Model*: Type --recursive.
  - *Guided Fix Action*: Type --recursive

---

### 🔹 Block 3: Architecture Comparison: Monorepos (Single Unified Repo) vs Polyrepos

- **Concept Budget / Primary Invariant**: `Monorepo vs Polyrepo Invariant`
- **Supporting Terms & Invariants**: `Monorepo (Houses multiple related services and packages within one repository, enabling atomic cross-service refactors without submodule pointer synchronization overhead)`

#### 🐙 Runnable Git Simulator: `monorepo_demo.js`

```javascript
function getMonorepoBenefit() {
  return 'ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT';
}

console.log(getMonorepoBenefit());
```

**Expected Terminal Output**:
```text
ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What major development advantage is provided by Monorepo architectures over multi-repo submodules?*

- **Target Answer**: `ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT`
- **Typed Misconception ID**: `MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SMALLER'**:
  - *What Went Wrong*: Monorepos are larger but provide: ENBALES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT.
  - *Simpler Mental Model*: Matches ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT.
  - *Guided Fix Action*: Type ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT

---

## 📅 Day 29: Git Hooks & Automated Pre-Commit Linting: Husky, Lint-Staged & Commitlint

> **💡 Everyday Metaphor / Intuitive Model**:
> Git Hooks Are Bouncers at a VIP Club Entrance: Before `git commit` allows your code inside the repository door, the `pre-commit` hook scans your staged code with ESLint and Prettier (`lint-staged`); if any linting errors or bad commit messages are detected, the hook returns exit code 1 and turns you away at the velvet rope!

### 🔹 Block 1: Pre-Commit Gatekeeper: Linter Passed + TypeCheck Passed $\implies$ Commit Allowed

- **Concept Budget / Primary Invariant**: `Pre-Commit Hook Lint-Staged Execution Gatekeeper`
- **Supporting Terms & Invariants**: `Linter Passed (`true`)`, `TypeCheck Passed (`true`)`, `Message Valid (`true`)`, `Commit Allowed (`true`)`, `Status: Pre Commit Hook Passed Commit Allowed Nominal`

#### 📦 Memory Box / Data Layout Diagram: Pre-Commit Hook Quality Gate Ledger

| System Component | Invariant & Parameters | Type |
|---|---|---|
| **ESLint Linter Check** | lint-staged -> PASSED (0 formatting or syntax errors) | `Linter` |
| **TypeScript Typecheck** | tsc --noEmit -> PASSED (0 compiler type errors) | `TypeScript` |
| **Commit Gate Verdict** | Commit Allowed: true (PRE COMMIT HOOK PASSED COMMIT ALLOWED NOMINAL!) | `Verdict` |

#### 🐙 Runnable Git Simulator: `pre_commit_demo.js`

```javascript
function evaluateHook(linter, tsc, msg) {
  const ok = linter && tsc && msg;
  return {
    isCommitAllowed: ok,
    status: ok ? 'PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL' : 'COMMIT_ABORTED'
  };
}

console.log(JSON.stringify(evaluateHook(true, true, true)));
```

**Expected Terminal Output**:
```text
{"isCommitAllowed":true,"status":"PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that client-side pre-commit linting and typecheck hooks passed successfully?*

- **Target Answer**: `PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL`
- **Typed Misconception ID**: `MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'COMMIT_ABORTED'**:
  - *What Went Wrong*: All checks passing awards PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL.
  - *Simpler Mental Model*: Matches PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL.
  - *Guided Fix Action*: Type PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL

---

### 🔹 Block 2: High Performance Quality: `lint-staged` Running Only on Staged Diffs

- **Concept Budget / Primary Invariant**: `lint-staged Invariant`
- **Supporting Terms & Invariants**: ``lint-staged` (Runs linters and formatters exclusively on files currently in `git status` staged index, executing in 200ms instead of 45 seconds across a 50,000 file codebase)`

#### ⚙️ Syntax & Command Anatomy: package.json lint-staged Config

```text
// "lint-staged": {
//   "*.{js,ts,tsx}": [
//     "eslint --fix",
//     "prettier --write"
//   ]
// }
```

- **Line 1**: Config section.
- **Line 2**: Staged file pattern match.
- **Line 3**: Lint fix runner.
- **Line 4**: Prettier formatter runner.
- **Line 5**: Close.

#### 🐙 Runnable Git Simulator: `lint_staged_demo.js`

```javascript
function getLintStagedOptimization() {
  return 'RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME';
}

console.log(getLintStagedOptimization());
```

**Expected Terminal Output**:
```text
RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why is `lint-staged` preferred over running global repository lint scripts inside pre-commit hooks?*

- **Target Answer**: `RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME`
- **Typed Misconception ID**: `MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'ALL'**:
  - *What Went Wrong*: lint-staged restricts execution to: RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME.
  - *Simpler Mental Model*: Matches RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME.
  - *Guided Fix Action*: Type RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME

---

### 🔹 Block 3: Hook Directory: `.git/hooks/pre-commit` and `.husky`

- **Concept Budget / Primary Invariant**: `Hook Path Invariant`
- **Supporting Terms & Invariants**: ``.git/hooks` (Native Git hook scripts directory; Husky copies version-controlled scripts from `.husky/` into `.git/hooks/` for team sharing)`

#### 🐙 Runnable Git Simulator: `hook_name_demo.js`

```javascript
function getPreCommitHookFileName() {
  return 'pre-commit';
}

console.log(getPreCommitHookFileName());
```

**Expected Terminal Output**:
```text
pre-commit
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the standard file name for the Git client-side hook that executes before a commit snapshot is created?*

- **Target Answer**: `pre-commit`
- **Typed Misconception ID**: `MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'post-commit'**:
  - *What Went Wrong*: post-commit runs after. Pre-commit validation runs in pre-commit.
  - *Simpler Mental Model*: Type pre-commit.
  - *Guided Fix Action*: Type pre-commit

---

## 📅 Day 30: 🏆 FINAL CAPSTONE: Sovereign Git, GitHub & Master Version Control Suite

> **💡 Everyday Metaphor / Intuitive Model**:
> Day 30 Final Capstone Synthesis: The complete sovereign Git and GitHub master version control suite: 1. Core Object Storage & Commits (SHA-1 hashing, three-tree staging, and conventional commit parsing); 2. Branching & Conflict Resolution (3-way merge conflict resolution, stash stack management, and SemVer tagging); 3. Advanced History & Remotes (Linear rebasing, interactive squashing, cherry-picking, and SSH key authentication); 4. GitHub Collaboration & Governance (PR metadata linking, code review approvals, branch protection, and workflow matching); 5. Automation & Quality Gates (Milestone sprint tracking, GitHub Actions CI/CD workflows, submodules, and Husky pre-commit hooks).

### 🔹 Block 1: Sovereign Git & Master Version Control Suite Orchestrator

- **Concept Budget / Primary Invariant**: `Sovereign Git & Master Version Control Suite Orchestrator`
- **Supporting Terms & Invariants**: `Git Foundations Module`, `Branching & Conflicts Module`, `Advanced History & Remotes Module`, `GitHub Collaboration & Governance Module`, `Automation & Quality Gates Module`, `Status: Sovereign Git and Version Control Master Certified Nominal`

#### 🔄 Computing System Execution Flowchart: Day 30 Sovereign Git & Version Control Architecture

1. **Foundations & Three Trees: Blob/Tree/Commit SHA storage & conventional commits**
2. **Branching & Merges: 3-way ORT merges, conflict resolution (PORT 3000), & stash stack**
3. **Advanced Rebasing & Remotes: Linear squashing, cherry-picking, & ed25519 SSH sync**
4. **GitHub Collaboration: PR lifecycle (Closes #108), LGTM reviews, & branch protection**
5. **CI/CD Automation: GitHub Actions workflows, submodules, & Husky pre-commit hooks -> SOVEREIGN GIT MASTER CERTIFIED!**

#### 🐙 Runnable Git Simulator: `git_capstone_demo.js`

```javascript
function orchestrateGitMaster(f, b, a, c, q) {
  const ok = f && b && a && c && q;
  return {
    foundationsModule: f,
    branchingModule: b,
    advancedModule: a,
    collabModule: c,
    automationModule: q,
    sovereignGitCertified: ok,
    status: ok ? 'SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'
  };
}

console.log(orchestrateGitMaster(true, true, true, true, true).status);
```

**Expected Terminal Output**:
```text
SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status string confirms full Day 30 Sovereign Git & Version Control Master Certification?*

- **Target Answer**: `SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL`
- **Typed Misconception ID**: `MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All 5 modules active awards SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL

---

### 🔹 Block 2: Platform-Wide Git & GitHub Quality Audit: 100/100 Score Benchmark

- **Concept Budget / Primary Invariant**: `Platform Quality Audit Benchmark`
- **Supporting Terms & Invariants**: `Foundations Audit`, `Collaboration Audit`, `Automation Audit`, `100/100 Quality Standard`

#### 🐙 Runnable Git Simulator: `git_final_audit.js`

```javascript
function runFullGitAudit() {
  return {
    foundationsScore: '20/20',
    branchingScore: '20/20',
    advancedRebaseScore: '20/20',
    collaborationScore: '20/20',
    automationScore: '20/20',
    finalScore: '100/100',
    grade: 'SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED'
  };
}

console.log(JSON.stringify(runFullGitAudit()));
```

**Expected Terminal Output**:
```text
{"foundationsScore":"20/20","branchingScore":"20/20","advancedRebaseScore":"20/20","collaborationScore":"20/20","automationScore":"20/20","finalScore":"100/100","grade":"SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What final score string is awarded on the comprehensive 30-Day Git & Version Control platform audit?*

- **Target Answer**: `100/100`
- **Typed Misconception ID**: `MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '90/100'**:
  - *What Went Wrong*: All modules passing achieves 100/100.
  - *Simpler Mental Model*: Type 100/100.
  - *Guided Fix Action*: Type 100/100

---

### 🔹 Block 3: PinIT Sovereign Git & GitHub Master Professional Certification Seal

- **Concept Budget / Primary Invariant**: `Sovereign Professional Certification Seal`
- **Supporting Terms & Invariants**: `Git Master Certified`, `Enterprise Collaboration Verified`, `100% Quality Invariant`

#### 🐙 Runnable Git Simulator: `git_cert_seal.js`

```javascript
console.log('🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]');
```

**Expected Terminal Output**:
```text
🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What final certification seal string confirms sovereign graduation from the Git & Version Control curriculum?*

- **Target Answer**: `🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]`
- **Typed Misconception ID**: `MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches final capstone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type 🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]

---

