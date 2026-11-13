# Document 04 — Graphify Intelligence Extract

**Workspace Root**: `<repo-root>` (`Present-Career-os`)  
**Inspection Date**: 2026-11-13T11:45:00+05:30  
**Graphify CLI**: `0.9.99`  
**Associated Commit SHA**: `5d887012c9a1668eed74960d0b6560e5aa663f92`  

---

## 1. Ground-Truth Graphify Metric Reconciliation

An inconsistency in preliminary reporting cited ~5,648 nodes and ~8,368 edges. Direct inspection of all three Graphify output artifacts resolves this definitively:

| Artifact | File Location | File Size | Verified Metric | Forensic Role |
| :--- | :--- | :---: | :--- | :--- |
| **`manifest.json`** | `graphify-out/manifest.json` | **0.57 MB** | **2,858 indexed source files** | Hash index mapping each source file to AST and semantic fingerprints. |
| **`graph.json`** | `graphify-out/graph.json` | **32.36 MB** | **31,886 nodes**<br>**56,096 links** | The authoritative, complete directed AST knowledge graph of the repository. |
| **`GRAPH_REPORT.md`** | `graphify-out/GRAPH_REPORT.md` | **1.09 MB** | **31,886 nodes**<br>**56,096 edges**<br>**1,808 communities** | Human/LLM-readable graph analysis report generated at commit `5d887012`. |
| **`graph.html`** | `graphify-out/graph.html` | **1.76 MB** | WebGL Network View | Interactive 3D visualization of the repository AST. |

### Reconciliation of the Preliminary Count:
- The preliminary count (~5,648 nodes / ~8,368 edges) was produced during early scoped testing by querying an isolated sub-component community.
- The actual full repository build at commit `5d887012` contains **31,886 AST nodes** and **56,096 directed edges**.
- **Freshness**: Running `git rev-parse HEAD` returns `5d887012`. The graph is **100% current and not stale**.

---

## 2. Decision on Raw Graph Exclusion

- **Raw `graph.json` Size**: **32.36 MB**.
- **Context Boundary**: Uploading 32.36 MB of raw JSON into external reasoning models (ChatGPT Go, Claude 3.5 Sonnet / Opus) causes context window exhaustion, high API latency, or rate-limiting.
- **Decision**: **Raw `graph.json` is preserved locally in `graphify-out/` and strictly EXCLUDED from `CLOUD.zip`**. Instead, this document provides the curated structural topology, god nodes, and community extracts.

---

## 3. Top Architectural God Nodes & Community Hubs

From [`graphify-out/GRAPH_REPORT.md`](file:///./graphify-out/GRAPH_REPORT.md), Graphify identifies the primary architectural focal points ("God Nodes") with the highest degree centrality:

1. **`src/types/database.ts`**:
   The central type hub (5,000+ lines) defining all Supabase PostgreSQL entities. Virtually all database-accessing routes and hooks depend on this module.
2. **`src/lib/data/coursesData.ts`**:
   The registry aggregating course metadata, lesson loaders, and quest configurations across the 55 courses.
3. **`getLongLesson`** ([`src/lib/data/longLessons.ts`](file:///./src/lib/data/longLessons.ts)):
   The dynamic dispatch hub routing lesson requests to the 53 physical data stores.
4. **`useLessonEngine.ts`** ([`src/app/quests/lesson/hooks/useLessonEngine.ts`](file:///./src/app/quests/lesson/hooks/useLessonEngine.ts)):
   The monolithic hook (1,760 lines) orchestrating slides, audio narration, and Pyodide evaluation.
5. **`smartVoiceRouter.ts`** ([`src/lib/smartVoiceRouter.ts`](file:///./src/lib/smartVoiceRouter.ts)):
   The central voice dispatch bridge between client IndexedDB, remote FastAPI, and browser WebSpeech.

---

## 4. Graphify Coverage Exclusions & Data Generator Blind Spots

Inspection of [`.graphifyignore`](file:///./.graphifyignore) reveals deliberate exclusions designed to prevent the knowledge graph from exceeding memory limits:
```gitignore
node_modules/
.next/
out/
scripts/
scratch/
src/lib/data/lessonVisuals/
src/lib/data/*LongLessons.ts
src/generated/
public/
raw_avatars_source/
```

### Critical Missing Relationships (The Generator-to-Data Pipeline):
Because `scripts/`, `src/lib/data/*LongLessons.ts`, and `src/generated/` are excluded, Graphify has an **architectural blind spot** regarding how curriculum data is generated, transformed, and loaded:

```
+------------------------------------+
|  132 GENERATOR & AUDIT SCRIPTS     |  (EXCLUDED from Graphify)
|  (scripts/legacy_generators/*.py)  |
+------------------------------------+
                  |
                  | [Writes raw TypeScript data stores]
                  v
+------------------------------------+
|   53 PHYSICAL DATA STORES          |  (EXCLUDED from Graphify)
|   (src/lib/data/*LongLessons.ts)   |
+------------------------------------+
                  |
                  | [Pre-build extraction via build-long-lessons-json.cjs]
                  v
+------------------------------------+
|   CACHED RUNTIME JSONs             |  (EXCLUDED from Graphify)
|   (src/generated/*.json)           |
+------------------------------------+
                  |
                  | [Imported into application code]
                  v
+------------------------------------+
|   APP HOOKS & UI COMPONENTS        |  (INDEXED in Graphify)
|   (useLessonEngine.ts, page.tsx)   |
+------------------------------------+
```

### Architectural Consequence of this Blind Spot:
When autonomous AI models edit generator scripts in `scripts/`, they do not see the downstream AST consequences in `src/lib/data/longLessonTypes.ts` or `useLessonEngine.ts`. This explains why automated expansions emitted `"partNumber"` instead of `"part"`, triggering 410 TypeScript errors without the model catching the contract violation during generation.
