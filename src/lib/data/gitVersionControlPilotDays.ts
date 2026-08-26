import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const GIT_VERSION_CONTROL_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "What is Version Control? — Your Project's Infinite Undo Button",
    "overviewMetaphor": "Git is like an infinite Undo button for your entire project: every time you reach a safe checkpoint, you take a 'snapshot' called a commit; if anything breaks, you can instantly rewind the project to any previous snapshot — no lost work, no panic, just confident development.",
    "blocks": [
      {
        "id": "git-d1-b1-why-version-control",
        "day": 1,
        "blockNumber": 1,
        "title": "Why Do We Need Version Control? — The essay_FINAL_v3_LAST.docx Problem",
        "conceptBudget": {
          "primaryConcept": "The Version Control Problem",
          "supportingTerms": [
            "Version Chaos (Saving files as essay_v1.docx, essay_v2_FINAL.docx, essay_FINAL_LAST.docx — no clear history, no safe way to undo)",
            "Collaboration Conflict (Two people overwriting each other's changes)",
            "Version Control Solution (One tool tracks every change, who made it, and when)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Infinite File Name Problem",
            "simpleExplanation": "Imagine writing an essay and naming your files: essay_v1.docx, essay_v2_FIXED.docx, essay_FINAL.docx, essay_FINAL_ACTUALLY_FINAL.docx, essay_I_GIVE_UP.docx. Now imagine doing this across a team of 5 people. Version control solves this: one tool, clear history, always safe to undo."
          },
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Without Version Control vs With Git",
              "nodes": [
                { "id": "1", "label": "Without Git: essay_v1.docx, essay_FINAL_LAST.docx (confusion, lost work)", "kind": "start" },
                { "id": "2", "label": "Problem: which version is current? who changed what? can we undo?", "kind": "decision" },
                { "id": "3", "label": "With Git: every change is a named commit with full history and authorship", "kind": "process" },
                { "id": "4", "label": "Result: instant undo, team-safe, no lost work, full audit trail", "kind": "end" }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "version_control_demo.js",
            "initialCode": "function describeVersionControl() {\n  return {\n    problem: 'MULTIPLE_COPIES_NO_CLEAR_HISTORY',\n    solution: 'VERSION_CONTROL_TRACKS_EVERY_CHANGE',\n    status: 'VERSION_CONTROL_UNDERSTOOD'\n  };\n}\n\nconsole.log(JSON.stringify(describeVersionControl()));",
            "expectedOutput": "{\"problem\":\"MULTIPLE_COPIES_NO_CLEAR_HISTORY\",\"solution\":\"VERSION_CONTROL_TRACKS_EVERY_CHANGE\",\"status\":\"VERSION_CONTROL_UNDERSTOOD\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which of the following BEST describes the main problem that version control solves?",
          "options": [
            "Files take up too much disk space",
            "Tracking every change to a project so nothing is ever lost",
            "Making code run faster",
            "Encrypting your files for security"
          ],
          "correctIndex": 1,
          "primaryMisconceptionId": "MC_GIT_VERSION_CONTROL_PURPOSE",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_GIT_VERSION_CONTROL_PURPOSE",
              "errorExplanation": "Version control is not about storage space. It tracks the history of every change so you can review, compare, or undo them at any time.",
              "recoveryPath": {
                "simplerExplanation": "Think of Git as an infinite Undo button for your project folder.",
                "guidedFixPrompt": "Select option 1: Tracking every change to a project so nothing is ever lost"
              }
            }
          }
        }
      },
      {
        "id": "git-d1-b2-what-is-a-commit",
        "day": 1,
        "blockNumber": 2,
        "title": "What is a Commit? — Taking a Snapshot of Your Project",
        "conceptBudget": {
          "primaryConcept": "Git Commit: A Project Snapshot",
          "supportingTerms": [
            "Commit (A saved snapshot of your entire project at one moment in time)",
            "Commit Message (A short description of what changed: e.g. 'Add login page')",
            "Author (Who made the change)",
            "Timestamp (When the change was made)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d1-b1-why-version-control",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Photo Album of Your Project",
            "simpleExplanation": "A commit is like a photograph of your project folder taken at one moment in time. The photograph captures exactly what every file looked like at that instant. Git keeps an album of all your photographs in order — you can flip back to any one of them instantly."
          },
          {
            "type": "runnable_code",
            "filename": "commit_demo.js",
            "initialCode": "function describeCommit(message, author) {\n  return {\n    snapshotType: 'PROJECT_SNAPSHOT',\n    message: message,\n    author: author,\n    canUndo: true,\n    status: 'COMMIT_SNAPSHOT_RECORDED'\n  };\n}\n\nconsole.log(JSON.stringify(describeCommit('Add login page', 'Alice')));",
            "expectedOutput": "{\"snapshotType\":\"PROJECT_SNAPSHOT\",\"message\":\"Add login page\",\"author\":\"Alice\",\"canUndo\":true,\"status\":\"COMMIT_SNAPSHOT_RECORDED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does a Git commit store?",
          "options": [
            "Only the files you deleted",
            "A snapshot of your entire project at that moment, plus a message describing the change",
            "Just the name of the developer who made changes",
            "A backup copy stored on the internet"
          ],
          "correctIndex": 1,
          "primaryMisconceptionId": "MC_GIT_COMMIT_SNAPSHOT_CONCEPT",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_GIT_COMMIT_SNAPSHOT_CONCEPT",
              "errorExplanation": "A commit captures a snapshot of ALL tracked files in the project at that moment, not just deleted ones.",
              "recoveryPath": {
                "simplerExplanation": "Think of a commit as a complete photograph of your project folder — every file, captured at that instant.",
                "guidedFixPrompt": "Select option 1: A snapshot of your entire project at that moment, plus a message describing the change"
              }
            }
          }
        }
      },
      {
        "id": "git-d1-b3-what-is-a-repository",
        "day": 1,
        "blockNumber": 3,
        "title": "What is a Repository? — Your Project's History Book",
        "conceptBudget": {
          "primaryConcept": "Git Repository: The History Store",
          "supportingTerms": [
            "Repository (A folder where Git stores your project AND the full history of every commit ever made)",
            "Local Repository (The copy on your own computer)",
            "Remote Repository (A shared copy on a server like GitHub, for team collaboration)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d1-b2-what-is-a-commit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Library for Your Project",
            "simpleExplanation": "A repository is like a library for your project. The library holds not just the current version of every file, but the complete history of every change — who changed what, when, and why. The local library is on your laptop; the remote library (GitHub) is the shared copy your whole team can access."
          },
          {
            "type": "runnable_code",
            "filename": "repository_demo.js",
            "initialCode": "function describeRepository(name) {\n  return {\n    repositoryName: name,\n    storesCurrentFiles: true,\n    storesFullHistory: true,\n    supportsTeamCollaboration: true,\n    status: 'REPOSITORY_DESCRIBED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(describeRepository('my-project')));",
            "expectedOutput": "{\"repositoryName\":\"my-project\",\"storesCurrentFiles\":true,\"storesFullHistory\":true,\"supportsTeamCollaboration\":true,\"status\":\"REPOSITORY_DESCRIBED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which of the following BEST describes a Git repository?",
          "options": [
            "A website for sharing code",
            "A type of file format for compressing data",
            "A project folder that also stores the complete history of every change ever made",
            "A programming language used to write Git commands"
          ],
          "correctIndex": 2,
          "primaryMisconceptionId": "MC_GIT_REPOSITORY_LOCAL_REMOTE",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_GIT_REPOSITORY_LOCAL_REMOTE",
              "errorExplanation": "GitHub is a website that hosts repositories, but the repository itself is the folder containing your project and its full commit history — it can exist entirely on your local computer.",
              "recoveryPath": {
                "simplerExplanation": "A repository is your project folder plus a complete history of every commit. GitHub is just one place to store it online.",
                "guidedFixPrompt": "Select option 2: A project folder that also stores the complete history of every change ever made"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Local Repository Inception: `git init`, `git clone` & Identity Configuration",
    "overviewMetaphor": "Initializing a Repository Is Laying the Foundation for a Construction Project: `git init` builds the hidden `.git` control room under the site floor; `git config --global user.name` issues your digital badge (`Alice Smith <alice@company.com>`), stamping every brick you lay with a verifiable author signature.",
    "blocks": [
      {
        "id": "git-d2-b1-author-identity-validator",
        "day": 2,
        "blockNumber": 1,
        "title": "Author Identity: `user.name` & `user.email` Validation (`alice@company.com`)",
        "conceptBudget": {
          "primaryConcept": "Git Author Identity & Configuration Validator",
          "supportingTerms": [
            "Author Name (`'Alice Smith'`)",
            "Author Email (`'alice@company.com'`)",
            "Identity Configured (`true`)",
            "Config Scope (`'GLOBAL_OR_LOCAL'`)",
            "Status: Git Author Identity Configured Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d1-b1-object-model-header-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Configuration Hierarchy & Identity Ledger",
              "boxes": [
                {
                  "label": "Author Full Name",
                  "value": "'Alice Smith' (min 2 characters)",
                  "varType": "Name",
                  "isUpdated": false
                },
                {
                  "label": "Author Email Address",
                  "value": "'alice@company.com' (Valid RFC email format)",
                  "varType": "Email",
                  "isUpdated": false
                },
                {
                  "label": "Identity Status",
                  "value": "GIT AUTHOR IDENTITY CONFIGURED NOMINAL (VALID COMMIT BADGE!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "author_config_demo.js",
            "initialCode": "function validateIdentity(name, email) {\n  const ok = name.trim().length >= 2 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n  return {\n    name,\n    email,\n    isIdentityConfigured: ok,\n    status: ok ? 'GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL' : 'GIT_AUTHOR_IDENTITY_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateIdentity('Alice Smith', 'alice@company.com')));",
            "expectedOutput": "{\"name\":\"Alice Smith\",\"email\":\"alice@company.com\",\"isIdentityConfigured\":true,\"status\":\"GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that Git author name and email credentials are validly configured?",
          "expectedStringOutput": "GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL",
          "acceptableAnswers": [
            "GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL",
            "status\":\"GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY",
              "errorExplanation": "Valid author info awards GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL.",
                "guidedFixPrompt": "Type GIT_AUTHOR_IDENTITY_CONFIGURED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "git-d2-b2-config-hierarchy-system-global-local",
        "day": 2,
        "blockNumber": 2,
        "title": "Configuration Scope Precedence: Local (`.git/config`) Overrides Global (`~/.gitconfig`)",
        "conceptBudget": {
          "primaryConcept": "Configuration Precedence Invariant",
          "supportingTerms": [
            "Config Hierarchy (Local repository config overrides Global user config, which overrides System machine config)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d2-b1-author-identity-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Git Config Scope Hierarchy",
            "codeSnippet": "// 1. Local:  git config --local user.email \"work@corp.com\" (Stored in .git/config -> HIGHEST PRECEDENCE!)\n// 2. Global: git config --global user.email \"personal@gmail.com\" (Stored in ~/.gitconfig)\n// 3. System: git config --system core.editor \"vim\" (Stored in /etc/gitconfig -> Lowest)",
            "lineNotes": {
              "1": "Repository-specific overrides.",
              "2": "User-wide default.",
              "3": "OS machine-wide default."
            }
          },
          {
            "type": "runnable_code",
            "filename": "config_precedence_demo.js",
            "initialCode": "function getHighestConfigPrecedence() {\n  return 'LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG';\n}\n\nconsole.log(getHighestConfigPrecedence());",
            "expectedOutput": "LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which Git configuration level has the highest priority and overrides all other configuration files?",
          "expectedStringOutput": "LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG",
          "acceptableAnswers": [
            "LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG",
            "Local",
            "Local config",
            "--local"
          ],
          "primaryMisconceptionId": "MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY",
          "diagnosisMap": {
            "GLOBAL": {
              "misconceptionId": "MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY",
              "errorExplanation": "Global applies everywhere unless overridden locally: LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG.",
              "recoveryPath": {
                "simplerExplanation": "Matches LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG.",
                "guidedFixPrompt": "Type LOCAL_REPOSITORY_CONFIG_OVERRIDES_GLOBAL_USER_CONFIG"
              }
            }
          }
        }
      },
      {
        "id": "git-d2-b3-modern-default-branch-main",
        "day": 2,
        "blockNumber": 3,
        "title": "Modern Default Branch Standard: `main` vs Legacy `master`",
        "conceptBudget": {
          "primaryConcept": "Default Branch Invariant",
          "supportingTerms": [
            "Default Branch (`main`: Configured via `git config --global init.defaultBranch main` replacing outdated legacy default `master`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d2-b2-config-hierarchy-system-global-local",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "default_branch_demo.js",
            "initialCode": "function getModernDefaultBranch() {\n  return 'main';\n}\n\nconsole.log(getModernDefaultBranch());",
            "expectedOutput": "main",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the modern industry standard default branch name for newly initialized Git repositories?",
          "expectedStringOutput": "main",
          "acceptableAnswers": [
            "main",
            "Main",
            "'main'"
          ],
          "primaryMisconceptionId": "MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY",
          "diagnosisMap": {
            "master": {
              "misconceptionId": "MC_GIT_LOCAL_INIT_CLONE_CONFIG_IDENTITY",
              "errorExplanation": "master is legacy. The modern universal standard is main.",
              "recoveryPath": {
                "simplerExplanation": "Type main.",
                "guidedFixPrompt": "Type main"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "The Three Trees Architecture: Working Directory, Staging Area & Commit History",
    "overviewMetaphor": "The Three Trees Are a Photographer's Studio: The Working Directory is your live chaotic photo stage (Untracked props & modified clothing); the Staging Area (`git add`) is the camera viewfinder framing the exact snapshot; pressing the camera shutter (`git commit`) freezes that frame permanently into the historical photo album (`COMMITTED_CLEAN`).",
    "blocks": [
      {
        "id": "git-d3-b1-three-trees-state-transition-tracker",
        "day": 3,
        "blockNumber": 1,
        "title": "Three Trees States: Untracked $\\to$ Staged $\\to$ `COMMITTED_CLEAN`",
        "conceptBudget": {
          "primaryConcept": "Three-Tree File State Transition Engine",
          "supportingTerms": [
            "Untracked File State",
            "Staged Index State",
            "Working Tree Clean (`true`)",
            "State (`'COMMITTED_CLEAN'`)",
            "Status: Working Tree Clean Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d2-b1-author-identity-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "The Three Trees Computational Pipeline Ledger",
              "boxes": [
                {
                  "label": "Tree 1: Working Tree",
                  "value": "Files on disk (Untracked, Modified, Deleted)",
                  "varType": "Working Tree",
                  "isUpdated": false
                },
                {
                  "label": "Tree 2: Staging Area (Index)",
                  "value": ".git/index (Prepared snapshot via `git add`)",
                  "varType": "Index",
                  "isUpdated": false
                },
                {
                  "label": "Tree 3: Commit History (HEAD)",
                  "value": ".git/objects (Immutable commit snapshots -> COMMITTED_CLEAN!)",
                  "varType": "HEAD",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "three_trees_demo.js",
            "initialCode": "function trackState(hist, disk, staged) {\n  if (hist === 'NONE' && !staged) return { state: 'UNTRACKED', isClean: false };\n  if (staged) return { state: 'STAGED', isClean: false };\n  if (disk) return { state: 'MODIFIED', isClean: false };\n  return { state: 'COMMITTED_CLEAN', isClean: true, status: 'WORKING_TREE_CLEAN_NOMINAL' };\n}\n\nconsole.log(JSON.stringify(trackState('COMMITTED', false, false)));\nconsole.log(JSON.stringify(trackState('NONE', true, false)));",
            "expectedOutput": "{\"state\":\"COMMITTED_CLEAN\",\"isClean\":true,\"status\":\"WORKING_TREE_CLEAN_NOMINAL\"}\n{\"state\":\"UNTRACKED\",\"isClean\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state is assigned to a file when disk changes are committed and the working tree is completely synchronized with HEAD?",
          "expectedStringOutput": "COMMITTED_CLEAN",
          "acceptableAnswers": [
            "COMMITTED_CLEAN",
            "state\":\"COMMITTED_CLEAN\"",
            "Clean",
            "Committed clean"
          ],
          "primaryMisconceptionId": "MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY",
          "diagnosisMap": {
            "STAGED": {
              "misconceptionId": "MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY",
              "errorExplanation": "Staged means waiting for commit. Once committed, state becomes COMMITTED_CLEAN.",
              "recoveryPath": {
                "simplerExplanation": "State is COMMITTED_CLEAN.",
                "guidedFixPrompt": "Type COMMITTED_CLEAN"
              }
            }
          }
        }
      },
      {
        "id": "git-d3-b2-atomic-commit-philosophy",
        "day": 3,
        "blockNumber": 2,
        "title": "The Atomic Commit Philosophy: One Logical Change per Commit",
        "conceptBudget": {
          "primaryConcept": "Atomic Commit Invariant",
          "supportingTerms": [
            "Atomic Commit (A single, indivisible unit of work that implements one feature or bugfix; if reverted, it cleanly removes the feature without breaking unrelated code)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d3-b1-three-trees-state-transition-tracker",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Atomic Commit Rules",
            "codeSnippet": "// ❌ ANTI-PATTERN: git add . && git commit -m \"fixed 10 bugs, refactored database, and changed css\"\n// ✅ ATOMIC COMMIT: git commit -m \"fix(auth): resolve JWT expiration bug\"\n//                  git commit -m \"refactor(db): optimize user query index\"",
            "lineNotes": {
              "1": "Messy compound commit impossible to bisect or revert cleanly.",
              "2": "Atomic isolated unit of work 1.",
              "3": "Atomic isolated unit of work 2."
            }
          },
          {
            "type": "runnable_code",
            "filename": "atomic_commit_demo.js",
            "initialCode": "function getAtomicCommitRule() {\n  return 'EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE';\n}\n\nconsole.log(getAtomicCommitRule());",
            "expectedOutput": "EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core engineering principle dictates that each Git commit should contain exactly one single, complete logical unit of work?",
          "expectedStringOutput": "EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE",
          "acceptableAnswers": [
            "EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE",
            "Atomic commits",
            "Atomic commit"
          ],
          "primaryMisconceptionId": "MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY",
          "diagnosisMap": {
            "LARGE": {
              "misconceptionId": "MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY",
              "errorExplanation": "Mega-commits harm debugging: EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE.",
              "recoveryPath": {
                "simplerExplanation": "Matches EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE.",
                "guidedFixPrompt": "Type EACH_COMMIT_MUST_REPRESENT_EXACTLY_ONE_COMPLETE_LOGICAL_CHANGE"
              }
            }
          }
        }
      },
      {
        "id": "git-d3-b3-git-add-patch-interactive-staging",
        "day": 3,
        "blockNumber": 3,
        "title": "Interactive Staging: `git add -p` (Staging Specific Hunks)",
        "conceptBudget": {
          "primaryConcept": "Interactive Hunk Staging Invariant",
          "supportingTerms": [
            "`git add -p` (Allows developers to review and selectively stage individual code hunks `[y,n,q,a,d,s,e]` within a single modified file)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d3-b2-atomic-commit-philosophy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "add_patch_demo.js",
            "initialCode": "function getGitAddPatchFlag() {\n  return '-p';\n}\n\nconsole.log(getGitAddPatchFlag());",
            "expectedOutput": "-p",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git add` enables interactive hunk-by-hunk code staging?",
          "expectedStringOutput": "-p",
          "acceptableAnswers": [
            "-p",
            "--patch",
            "-p (patch)"
          ],
          "primaryMisconceptionId": "MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY",
          "diagnosisMap": {
            "-A": {
              "misconceptionId": "MC_GIT_THREE_TREES_WORKING_STAGING_HISTORY",
              "errorExplanation": "-A stages all files indiscriminately. Interactive hunk staging uses -p.",
              "recoveryPath": {
                "simplerExplanation": "Type -p.",
                "guidedFixPrompt": "Type -p"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Git Status & Inspection Mechanics: `git status -s`, `git diff` & Conventional Commits",
    "overviewMetaphor": "Git Status Is an Airport Departure Screen: The two-column short code display (` M` vs `M `) tells you which flights are boarding at the staging gate (`M `) vs which flights are still in the terminal lobby (` M`); Conventional Commit prefixes (`feat:`, `fix:`) ensure flight manifests are machine-readable for automated changelog generation.",
    "blocks": [
      {
        "id": "git-d4-b1-conventional-commit-parser",
        "day": 4,
        "blockNumber": 1,
        "title": "Conventional Commits: `feat(auth): add JWT authentication endpoint`",
        "conceptBudget": {
          "primaryConcept": "Conventional Commit Parser & Semantic Type Validator",
          "supportingTerms": [
            "Commit Type (`'feat'`)",
            "Commit Scope (`'auth'`)",
            "Commit Description (`'add JWT authentication endpoint'`)",
            "Commit Validity (`true`)",
            "Status: Conventional Commit Valid Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d3-b1-three-trees-state-transition-tracker",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Conventional Commit Structure Ledger",
              "boxes": [
                {
                  "label": "Type Prefix",
                  "value": "'feat' (New feature introduction for user)",
                  "varType": "Type",
                  "isUpdated": false
                },
                {
                  "label": "Optional Scope",
                  "value": "'(auth)' (Authentication module boundary)",
                  "varType": "Scope",
                  "isUpdated": false
                },
                {
                  "label": "Imperative Message",
                  "value": "'add JWT authentication endpoint' (CONVENTIONAL COMMIT VALID NOMINAL!)",
                  "varType": "Desc",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "conventional_commit_demo.js",
            "initialCode": "function parseCommit(msg) {\n  const m = msg.match(/^(feat|fix|docs|style|refactor|perf|test|chore)(\\([a-z0-9-]+\\))?: (.+)$/);\n  if (!m) return { isValid: false, status: 'CONVENTIONAL_COMMIT_INVALID' };\n  return {\n    isValid: true,\n    type: m[1],\n    scope: m[2] ? m[2].replace(/[()]/g, '') : null,\n    desc: m[3],\n    status: 'CONVENTIONAL_COMMIT_VALID_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(parseCommit('feat(auth): add JWT authentication endpoint')));\nconsole.log(JSON.stringify(parseCommit('updated code')));",
            "expectedOutput": "{\"isValid\":true,\"type\":\"feat\",\"scope\":\"auth\",\"desc\":\"add JWT authentication endpoint\",\"status\":\"CONVENTIONAL_COMMIT_VALID_NOMINAL\"}\n{\"isValid\":false,\"status\":\"CONVENTIONAL_COMMIT_INVALID\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What semantic commit type prefix is extracted from `'feat(auth): add JWT authentication endpoint'`?",
          "expectedStringOutput": "feat",
          "acceptableAnswers": [
            "feat",
            "type\":\"feat\"",
            "'feat'"
          ],
          "primaryMisconceptionId": "MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS",
          "diagnosisMap": {
            "auth": {
              "misconceptionId": "MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS",
              "errorExplanation": "auth is the scope. The commit type prefix is feat.",
              "recoveryPath": {
                "simplerExplanation": "Type is feat.",
                "guidedFixPrompt": "Type feat"
              }
            }
          }
        }
      },
      {
        "id": "git-d4-b2-git-status-short-format-matrix",
        "day": 4,
        "blockNumber": 2,
        "title": "Two-Column `git status -s`: Column 1 (Index) vs Column 2 (Working Tree)",
        "conceptBudget": {
          "primaryConcept": "Short Status Format Invariant",
          "supportingTerms": [
            "Two-Column Short Format (`XY`: Column X = Staged in Index; Column Y = Unstaged in Working Tree; ` M` = modified on disk unstaged; `M ` = modified and staged)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d4-b1-conventional-commit-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "git status -s Code Matrix",
            "codeSnippet": "// ?? file.txt  -> Untracked file\n//  M file.txt  -> Modified in Working Tree, NOT staged\n// M  file.txt  -> Modified and STAGED in Index\n// MM file.txt  -> Modified, staged, then modified AGAIN in working tree!\n// A  file.txt  -> Added and staged",
            "lineNotes": {
              "1": "Untracked.",
              "2": "Unstaged modification.",
              "3": "Staged modification.",
              "4": "Staged with further unstaged edits.",
              "5": "Newly added."
            }
          },
          {
            "type": "runnable_code",
            "filename": "status_short_demo.js",
            "initialCode": "function getShortStatusCodeMeaning() {\n  return 'COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE';\n}\n\nconsole.log(getShortStatusCodeMeaning());",
            "expectedOutput": "COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In `git status -s`, what do the first and second columns respectively indicate?",
          "expectedStringOutput": "COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE",
          "acceptableAnswers": [
            "COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE",
            "Staged and unstaged",
            "Index and working tree"
          ],
          "primaryMisconceptionId": "MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS",
          "diagnosisMap": {
            "REVERSE": {
              "misconceptionId": "MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS",
              "errorExplanation": "Column 1 is Index. Column 2 is Working Tree: COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE.",
              "recoveryPath": {
                "simplerExplanation": "Matches COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE.",
                "guidedFixPrompt": "Type COLUMN_1_REPRESENTS_STAGED_INDEX_AND_COLUMN_2_REPRESENTS_WORKING_TREE"
              }
            }
          }
        }
      },
      {
        "id": "git-d4-b3-git-diff-vs-git-diff-staged",
        "day": 4,
        "blockNumber": 3,
        "title": "`git diff` (Working Tree) vs `git diff --staged` (Staged Index)",
        "conceptBudget": {
          "primaryConcept": "Git Diff Staged Invariant",
          "supportingTerms": [
            "`git diff` (Shows unstaged edits between Working Tree and Index)",
            "`git diff --staged` (Shows staged edits between Index and HEAD that WILL be included in the next commit)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d4-b2-git-status-short-format-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "diff_staged_demo.js",
            "initialCode": "function getDiffStagedCommand() {\n  return 'git diff --staged';\n}\n\nconsole.log(getDiffStagedCommand());",
            "expectedOutput": "git diff --staged",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git command displays exact line diffs for changes currently staged in the index ready to be committed?",
          "expectedStringOutput": "git diff --staged",
          "acceptableAnswers": [
            "git diff --staged",
            "git diff --cached",
            "git diff --staged / cached"
          ],
          "primaryMisconceptionId": "MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS",
          "diagnosisMap": {
            "git diff": {
              "misconceptionId": "MC_GIT_STATUS_INSPECTION_DIFF_CONVENTIONAL_COMMITS",
              "errorExplanation": "git diff only shows unstaged edits. Staged edits require git diff --staged.",
              "recoveryPath": {
                "simplerExplanation": "Type git diff --staged.",
                "guidedFixPrompt": "Type git diff --staged"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete foundational Git version control engine: 1. Low-level object header formatting (`blob 12\\0`); 2. Author identity validation (`alice@company.com`); 3. Three-Tree state transitions (`COMMITTED_CLEAN`); 4. Conventional commit parsing (`feat(auth)`).",
    "blocks": [
      {
        "id": "git-d5-b1-git-foundations-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Git Foundations Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Git Foundations Master Kernel",
          "supportingTerms": [
            "Object Storage Engine",
            "Author Identity Engine",
            "Three Trees State Engine",
            "Conventional Commit Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d4-b3-git-diff-vs-git-diff-staged",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Git Foundations Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Constructs raw Git object headers (blob 12\\0)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Validates author identity credentials (Alice Smith <alice@company.com>)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Tracks three-tree state transitions to COMMITTED_CLEAN",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Parses conventional commits (feat(auth)) & activates Foundations kernel!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "git_kernel_demo.js",
            "initialCode": "function runGitFoundations() {\n  return {\n    objectSubsystem: 'ONLINE_BLOB_HEADER_ACTIVE',\n    identitySubsystem: 'ONLINE_AUTHOR_ALICE_ACTIVE',\n    treeSubsystem: 'ONLINE_COMMITTED_CLEAN_ACTIVE',\n    commitSubsystem: 'ONLINE_CONVENTIONAL_FEAT_ACTIVE',\n    engineStatus: 'GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runGitFoundations().engineStatus);",
            "expectedOutput": "GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Git Foundations Master Kernel?",
          "expectedStringOutput": "GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS",
              "errorExplanation": "Matches GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type GIT_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "git-d5-b2-git-foundations-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Git Foundations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Git Foundations Invariant Verification",
          "supportingTerms": [
            "Storage Invariant",
            "Tree Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d5-b1-git-foundations-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "git_audit_demo.js",
            "initialCode": "function auditGit(o, a, t, c) {\n  const passed = o && a && t && c;\n  return {\n    objectsVerified: o,\n    authorVerified: a,\n    treesVerified: t,\n    commitsVerified: c,\n    grade: passed ? 'GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditGit(true, true, true, true)));",
            "expectedOutput": "{\"objectsVerified\":true,\"authorVerified\":true,\"treesVerified\":true,\"commitsVerified\":true,\"grade\":\"GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Object Model, Author Identity, Three Trees, and Conventional Commits pass 100%?",
          "expectedStringOutput": "GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED",
            "grade\":\"GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS",
              "errorExplanation": "All checks passing awards GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type GIT_FOUNDATIONS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "git-d5-b3-milestone1-git-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Git Foundations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Git Foundations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d5-b2-git-foundations-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_git_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_OBJECT_MODEL_BLOBS_TREES_COMMITS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Git Object Model, Three-Tree Pipeline & Atomic Commit Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "File Ignoring & Repository Hygiene: `.gitignore` Rules & `git rm --cached`",
    "overviewMetaphor": "`.gitignore` Is a Security Gate at a Chemical Cleanroom: It blocks dirty build dust (`node_modules/`, `dist/`), temporary logs (`*.log`), and confidential passcodes (`.env`) from ever entering the sterile repository; if someone accidentally tracks a secret file, `git rm --cached` un-indexes it without deleting the file from your local computer disk.",
    "blocks": [
      {
        "id": "git-d6-b1-gitignore-pattern-evaluator",
        "day": 6,
        "blockNumber": 1,
        "title": "`.gitignore` Pattern Matching: Wildcards (`*.log`) & Negation (`!important.log`)",
        "conceptBudget": {
          "primaryConcept": ".gitignore Glob Pattern Matcher & Filter Evaluator",
          "supportingTerms": [
            "Target Path (`'server.log'` $\\to$ Ignored)",
            "Exception Path (`'important.log'` $\\to$ Tracked)",
            "Status: File Ignored by Gitignore Rule"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d1-b1-object-model-header-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": ".gitignore Glob Evaluation Ledger",
              "boxes": [
                {
                  "label": "Rule 1: 'node_modules/'",
                  "value": "Ignores all files within node_modules directories",
                  "varType": "Dir Rule",
                  "isUpdated": false
                },
                {
                  "label": "Rule 2: '*.log'",
                  "value": "Ignores server.log, debug.log, error.log",
                  "varType": "Wildcard",
                  "isUpdated": false
                },
                {
                  "label": "Rule 3: '!important.log'",
                  "value": "Negation Exception -> important.log is TRACKED (EVALUATED NOMINAL!)",
                  "varType": "Negation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gitignore_demo.js",
            "initialCode": "function checkIgnore(path, patterns) {\n  let ignored = false;\n  for (const p of patterns) {\n    if (p.startsWith('!') && path.endsWith(p.slice(1))) { ignored = false; continue; }\n    if (p.startsWith('*') && path.endsWith(p.slice(1))) ignored = true;\n    else if (p.endsWith('/') && path.includes(p)) ignored = true;\n  }\n  return {\n    path,\n    isIgnored: ignored,\n    status: ignored ? 'FILE_IGNORED_BY_GITIGNORE_RULE' : 'FILE_TRACKED_IN_REPOSITORY'\n  };\n}\n\nconst rules = ['node_modules/', '*.log', '!important.log'];\nconsole.log(JSON.stringify(checkIgnore('server.log', rules)));\nconsole.log(JSON.stringify(checkIgnore('important.log', rules)));",
            "expectedOutput": "{\"path\":\"server.log\",\"isIgnored\":true,\"status\":\"FILE_IGNORED_BY_GITIGNORE_RULE\"}\n{\"path\":\"important.log\",\"isIgnored\":false,\"status\":\"FILE_TRACKED_IN_REPOSITORY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is 'important.log' ignored when .gitignore contains rules `*.log` followed by `!important.log`?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "isIgnored\":false",
            "No",
            "Tracked"
          ],
          "primaryMisconceptionId": "MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING",
              "errorExplanation": "The exclamation mark ! is a negative exception that re-includes the file: isIgnored: false.",
              "recoveryPath": {
                "simplerExplanation": "Negation re-includes file -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "git-d6-b2-git-rm-cached-untracking",
        "day": 6,
        "blockNumber": 2,
        "title": "Untracking Committed Files: `git rm --cached <file>` vs `git rm <file>`",
        "conceptBudget": {
          "primaryConcept": "git rm --cached Invariant",
          "supportingTerms": [
            "`git rm --cached <file>` (Removes file from Git tracking/index while keeping the physical file intact on your local hard drive)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d6-b1-gitignore-pattern-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "git rm Command Differences",
            "codeSnippet": "// ❌ DANGEROUS: git rm .env         (Deletes .env from Git tracking AND deletes it from hard drive!)\n// ✅ SAFE:      git rm --cached .env (Removes .env from Git tracking BUT PRESERVES file on disk!)",
            "lineNotes": {
              "1": "Deletes local disk file.",
              "2": "Preserves local disk file."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rm_cached_demo.js",
            "initialCode": "function getUntrackWithoutDeleteCommand() {\n  return 'git rm --cached';\n}\n\nconsole.log(getUntrackWithoutDeleteCommand());",
            "expectedOutput": "git rm --cached",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git command removes an already-tracked file from the repository index without deleting it from your local filesystem?",
          "expectedStringOutput": "git rm --cached",
          "acceptableAnswers": [
            "git rm --cached",
            "git rm --cached <file>",
            "rm --cached"
          ],
          "primaryMisconceptionId": "MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING",
          "diagnosisMap": {
            "git rm": {
              "misconceptionId": "MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING",
              "errorExplanation": "git rm deletes the physical file from disk. Safe untracking requires git rm --cached.",
              "recoveryPath": {
                "simplerExplanation": "Type git rm --cached.",
                "guidedFixPrompt": "Type git rm --cached"
              }
            }
          }
        }
      },
      {
        "id": "git-d6-b3-gitignore-directory-slashes",
        "day": 6,
        "blockNumber": 3,
        "title": "Directory Slashes: Trailing Slash `/` vs Leading Slash `/` in Rules",
        "conceptBudget": {
          "primaryConcept": "Gitignore Slash Anchoring Invariant",
          "supportingTerms": [
            "Leading Slash (`/build`: Only matches build at the repository root)",
            "Trailing Slash (`dist/`: Matches any directory named dist at any depth in the repository tree)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d6-b2-git-rm-cached-untracking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "slash_anchor_demo.js",
            "initialCode": "function getLeadingSlashMeaning() {\n  return 'LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY';\n}\n\nconsole.log(getLeadingSlashMeaning());",
            "expectedOutput": "LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does a leading forward slash in a `.gitignore` pattern (e.g. `/docs`) enforce?",
          "expectedStringOutput": "LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY",
          "acceptableAnswers": [
            "LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY",
            "Anchors to repository root",
            "Root directory only"
          ],
          "primaryMisconceptionId": "MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING",
          "diagnosisMap": {
            "ANY": {
              "misconceptionId": "MC_GIT_GITIGNORE_RULES_CACHED_UNTRACKING",
              "errorExplanation": "Without leading slash matches anywhere. Leading slash uses LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY.",
              "recoveryPath": {
                "simplerExplanation": "Matches LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY.",
                "guidedFixPrompt": "Type LEADING_SLASH_ANCHORS_MATCHING_EXCLUSIVELY_TO_THE_REPOSITORY_ROOT_DIRECTORY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Undoing Local Changes: `git restore`, Unstaging & `git commit --amend`",
    "overviewMetaphor": "Git Restore Is an Undo Button on a Word Processor: If you type bad code on disk, `git restore <file>` discards the edits and restores the file from the index; if you staged files by mistake, `git restore --staged <file>` takes them out of the staging box without touching your disk; if you made a typo in your commit message, `git commit --amend` updates it instantly.",
    "blocks": [
      {
        "id": "git-d7-b1-git-restore-command-dispatcher",
        "day": 7,
        "blockNumber": 1,
        "title": "Modern Undo: `git restore --staged <file>` vs `git restore <file>`",
        "conceptBudget": {
          "primaryConcept": "Git Local Undo Command Dispatcher",
          "supportingTerms": [
            "Unstage Files (`'git restore --staged <file>'`)",
            "Discard Working Changes (`'git restore <file>'`)",
            "Amend Commit (`'git commit --amend --no-edit'`)",
            "Status: Git Undo Command Dispatched Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d6-b1-gitignore-pattern-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Modern Git Undo Command Mapping Ledger",
              "boxes": [
                {
                  "label": "Target: Discard Disk Edits",
                  "value": "git restore <file> (Restores working file from Index)",
                  "varType": "Working Tree",
                  "isUpdated": false
                },
                {
                  "label": "Target: Unstage Staged File",
                  "value": "git restore --staged <file> (Restores Index from HEAD)",
                  "varType": "Index",
                  "isUpdated": false
                },
                {
                  "label": "Target: Amend Previous Commit",
                  "value": "git commit --amend --no-edit (GIT UNDO COMMAND DISPATCHED NOMINAL!)",
                  "varType": "HEAD",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "undo_dispatch_demo.js",
            "initialCode": "function dispatchUndo(target) {\n  const map = {\n    'UNSTAGE_FILES': 'git restore --staged <file>',\n    'DISCARD_WORKING_CHANGES': 'git restore <file>',\n    'AMEND_PREVIOUS_COMMIT': 'git commit --amend --no-edit'\n  };\n  return {\n    target,\n    command: map[target],\n    status: 'GIT_UNDO_COMMAND_DISPATCHED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(dispatchUndo('UNSTAGE_FILES')));\nconsole.log(JSON.stringify(dispatchUndo('DISCARD_WORKING_CHANGES')));",
            "expectedOutput": "{\"target\":\"UNSTAGE_FILES\",\"command\":\"git restore --staged <file>\",\"status\":\"GIT_UNDO_COMMAND_DISPATCHED_NOMINAL\"}\n{\"target\":\"DISCARD_WORKING_CHANGES\",\"command\":\"git restore <file>\",\"status\":\"GIT_UNDO_COMMAND_DISPATCHED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What modern Git command unstages a file from the staging area while preserving all edits in the working directory?",
          "expectedStringOutput": "git restore --staged <file>",
          "acceptableAnswers": [
            "git restore --staged <file>",
            "git restore --staged",
            "restore --staged"
          ],
          "primaryMisconceptionId": "MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND",
          "diagnosisMap": {
            "git restore <file>": {
              "misconceptionId": "MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND",
              "errorExplanation": "git restore <file> discards working tree changes. Unstaging requires the --staged flag.",
              "recoveryPath": {
                "simplerExplanation": "Use --staged: git restore --staged <file>.",
                "guidedFixPrompt": "Type git restore --staged <file>"
              }
            }
          }
        }
      },
      {
        "id": "git-d7-b2-git-commit-amend-mechanics",
        "day": 7,
        "blockNumber": 2,
        "title": "Amending Commits: `git commit --amend` Rewriting the Most Recent Commit",
        "conceptBudget": {
          "primaryConcept": "git commit --amend Invariant",
          "supportingTerms": [
            "Commit Amend (Combines staged changes with the previous commit and allows rewording the commit message; creates a NEW SHA hash replacing the previous commit)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d7-b1-git-restore-command-dispatcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Amending Workflow",
            "codeSnippet": "// 1. Made a commit with a typo: git commit -m \"featt: add login\"\n// 2. Fix the message without creating a new commit:\n//    git commit --amend -m \"feat: add login\"\n// 3. Forgot to add a file? Stage it, then: git commit --amend --no-edit",
            "lineNotes": {
              "1": "Initial typo commit.",
              "2": "Rewording message.",
              "3": "Adding forgotten files without prompt."
            }
          },
          {
            "type": "runnable_code",
            "filename": "amend_demo.js",
            "initialCode": "function getAmendNoEditFlag() {\n  return '--no-edit';\n}\n\nconsole.log(getAmendNoEditFlag());",
            "expectedOutput": "--no-edit",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git commit --amend` includes newly staged files into the previous commit without prompting to edit the commit message?",
          "expectedStringOutput": "--no-edit",
          "acceptableAnswers": [
            "--no-edit",
            "--no-edit flag",
            "no-edit"
          ],
          "primaryMisconceptionId": "MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND",
          "diagnosisMap": {
            "-m": {
              "misconceptionId": "MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND",
              "errorExplanation": "-m supplies a new message. Retaining the existing message uses --no-edit.",
              "recoveryPath": {
                "simplerExplanation": "Type --no-edit.",
                "guidedFixPrompt": "Type --no-edit"
              }
            }
          }
        }
      },
      {
        "id": "git-d7-b3-git-clean-removing-untracked-files",
        "day": 7,
        "blockNumber": 3,
        "title": "Cleaning Untracked Artifacts: `git clean -fd`",
        "conceptBudget": {
          "primaryConcept": "git clean Invariant",
          "supportingTerms": [
            "`git clean -fd` (`-f` force, `-d` include directories: Permanently deletes all untracked files and directories from the working tree)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d7-b2-git-commit-amend-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "git_clean_demo.js",
            "initialCode": "function getGitCleanCommand() {\n  return 'git clean -fd';\n}\n\nconsole.log(getGitCleanCommand());",
            "expectedOutput": "git clean -fd",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git command forcibly removes all untracked files and directories from the working tree?",
          "expectedStringOutput": "git clean -fd",
          "acceptableAnswers": [
            "git clean -fd",
            "git clean -df",
            "git clean -f -d"
          ],
          "primaryMisconceptionId": "MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND",
          "diagnosisMap": {
            "git restore": {
              "misconceptionId": "MC_GIT_UNDOING_CHANGES_RESTORE_UNSTAGE_AMEND",
              "errorExplanation": "git restore only affects tracked files. Deleting untracked files uses git clean -fd.",
              "recoveryPath": {
                "simplerExplanation": "Type git clean -fd.",
                "guidedFixPrompt": "Type git clean -fd"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Git History Inspection: `git log --oneline --graph`, `git show` & Pickaxe Search",
    "overviewMetaphor": "Git Pickaxe Search Is a Metal Detector on a Forensic Crime Scene: When a critical API key (`STRIPE_KEY = \"sk_test_123\"`) is found leaked in production, `git log -S \"STRIPE_KEY\"` scans every commit diff in the repository's entire history, pinning the exact commit hash (`a1b2c3d`) and author who introduced the leak.",
    "blocks": [
      {
        "id": "git-d8-b1-pickaxe-string-search-engine",
        "day": 8,
        "blockNumber": 1,
        "title": "Pickaxe Search: `git log -S \"STRIPE_KEY\"` $\\to$ Commit `a1b2c3d` Found",
        "conceptBudget": {
          "primaryConcept": "Git Pickaxe String Search & History Audit Engine",
          "supportingTerms": [
            "Search Query (`'STRIPE_KEY'`)",
            "Matched Commit SHA (`'a1b2c3d'`)",
            "Matched Count ($1$ commit)",
            "Author (`'Alice'`)",
            "Status: Git Pickaxe Search Completed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d7-b1-git-restore-command-dispatcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Pickaxe Forensic Code Search Ledger",
              "boxes": [
                {
                  "label": "Search Target String",
                  "value": "'STRIPE_KEY' (Looking for introduction or deletion)",
                  "varType": "Query",
                  "isUpdated": false
                },
                {
                  "label": "Scanned Commit Diff",
                  "value": "+ const STRIPE_KEY = \"sk_test_123\"; (Introduced in commit a1b2c3d)",
                  "varType": "Diff",
                  "isUpdated": false
                },
                {
                  "label": "Forensic Audit Result",
                  "value": "Commit: a1b2c3d | Author: Alice (GIT PICKAXE SEARCH COMPLETED NOMINAL!)",
                  "varType": "Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pickaxe_demo.js",
            "initialCode": "function searchPickaxe(history, query) {\n  const matched = history.filter(c => c.diff.includes(query));\n  return {\n    query,\n    matchedCount: matched.length,\n    sha: matched[0]?.sha,\n    status: 'GIT_PICKAXE_SEARCH_COMPLETED_NOMINAL'\n  };\n}\n\nconst hist = [\n  { sha: 'a1b2c3d', message: 'feat: add stripe integration', diff: '+ const STRIPE_KEY = \"sk_test_123\";' },\n  { sha: 'e4f5g6h', message: 'docs: update readme', diff: '+ # Readme' }\n];\nconsole.log(JSON.stringify(searchPickaxe(hist, 'STRIPE_KEY')));",
            "expectedOutput": "{\"query\":\"STRIPE_KEY\",\"matchedCount\":1,\"sha\":\"a1b2c3d\",\"status\":\"GIT_PICKAXE_SEARCH_COMPLETED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git log` activates the Pickaxe search engine to find commits that introduced or deleted a specific string?",
          "expectedStringOutput": "-S",
          "acceptableAnswers": [
            "-S",
            "-S flag",
            "Pickaxe -S"
          ],
          "primaryMisconceptionId": "MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH",
          "diagnosisMap": {
            "--grep": {
              "misconceptionId": "MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH",
              "errorExplanation": "--grep searches commit messages. Searching actual code diff changes uses the Pickaxe -S flag.",
              "recoveryPath": {
                "simplerExplanation": "Type -S.",
                "guidedFixPrompt": "Type -S"
              }
            }
          }
        }
      },
      {
        "id": "git-d8-b2-git-log-formatting-graph-oneline",
        "day": 8,
        "blockNumber": 2,
        "title": "ASCII Topology Visualization: `git log --oneline --graph --all`",
        "conceptBudget": {
          "primaryConcept": "Git Log Topology Formatting Invariant",
          "supportingTerms": [
            "`git log --oneline --graph --all` (Renders a colorful ASCII tree showing branch divergences, merges, HEAD location, and commit messages on single lines)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d8-b1-pickaxe-string-search-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "git log Visualization Command",
            "codeSnippet": "// git log --oneline --graph --decorate --all\n// * 4b825dc (HEAD -> main, origin/main) feat: add payment webhook\n// | * c789abc (feature-login) feat: add OAuth2 login\n// |/  \n// * e4f5g6h chore: initial commit",
            "lineNotes": {
              "1": "Comprehensive log inspection command.",
              "2": "Active branch HEAD pointer.",
              "3": "Feature branch divergence.",
              "4": "Branch fork point.",
              "5": "Common ancestor."
            }
          },
          {
            "type": "runnable_code",
            "filename": "git_log_demo.js",
            "initialCode": "function getLogGraphCommand() {\n  return 'git log --oneline --graph --all';\n}\n\nconsole.log(getLogGraphCommand());",
            "expectedOutput": "git log --oneline --graph --all",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git log command renders an ASCII graphical tree diagram of all branch topologies across the repository?",
          "expectedStringOutput": "git log --oneline --graph --all",
          "acceptableAnswers": [
            "git log --oneline --graph --all",
            "git log --graph",
            "log --oneline --graph --all"
          ],
          "primaryMisconceptionId": "MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH",
          "diagnosisMap": {
            "git status": {
              "misconceptionId": "MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH",
              "errorExplanation": "git status shows working tree. Branch graph inspection uses git log --oneline --graph --all.",
              "recoveryPath": {
                "simplerExplanation": "Type git log --oneline --graph --all.",
                "guidedFixPrompt": "Type git log --oneline --graph --all"
              }
            }
          }
        }
      },
      {
        "id": "git-d8-b3-author-date-vs-committer-date",
        "day": 8,
        "blockNumber": 3,
        "title": "Metadata Invariant: Author Date vs Committer Date in `git show`",
        "conceptBudget": {
          "primaryConcept": "Author vs Committer Timestamp Invariant",
          "supportingTerms": [
            "Author Date (When the code was originally authored)",
            "Committer Date (When the commit was created, amended, rebased, or cherry-picked by a developer)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d8-b2-git-log-formatting-graph-oneline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "author_committer_demo.js",
            "initialCode": "function getAuthorVsCommitterRule() {\n  return 'AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND';\n}\n\nconsole.log(getAuthorVsCommitterRule());",
            "expectedOutput": "AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do Git Author Date and Committer Date timestamps differ on a rebased commit?",
          "expectedStringOutput": "AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND",
          "acceptableAnswers": [
            "AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND",
            "Author is creation, committer is rebase",
            "Committer date changes"
          ],
          "primaryMisconceptionId": "MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH",
          "diagnosisMap": {
            "IDENTICAL": {
              "misconceptionId": "MC_GIT_LOG_INSPECTION_SHOW_PICKAXE_SEARCH",
              "errorExplanation": "Rebasing updates committer timestamp: AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND.",
                "guidedFixPrompt": "Type AUTHOR_DATE_RECORDS_ORIGINAL_CREATION_AND_COMMITTER_DATE_RECORDS_REBASE_OR_AMEND"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Git Branching Architecture: Pointer Mechanics & Fast-Forward Merges",
    "overviewMetaphor": "A Git Branch Is a Sticky Bookmark in a Book, Not a Separate Copy of the Library: The bookmark (`main` or `feature-login`) is simply a 41-byte text file pointing to a commit SHA; creating a branch (`git switch -c feature`) simply pastes a new sticky note on the current page, moving effortlessly with zero disk overhead.",
    "blocks": [
      {
        "id": "git-d9-b1-branch-pointer-advance-simulator",
        "day": 9,
        "blockNumber": 1,
        "title": "Branch Pointer Mechanics: Advancing `main` $\\to$ Commit `f9e8d7c`",
        "conceptBudget": {
          "primaryConcept": "Git Branch Pointer Advance Engine",
          "supportingTerms": [
            "Branch Name (`'main'`)",
            "Previous SHA (`'a1b2c3d'`)",
            "Current SHA (`'f9e8d7c'`)",
            "Ref Path (`'.git/refs/heads/main'`)",
            "Status: Branch Pointer Advanced Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d8-b1-pickaxe-string-search-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Branch Pointer Ref File Ledger",
              "boxes": [
                {
                  "label": "Ref File Path",
                  "value": ".git/refs/heads/main (41-byte ASCII text file)",
                  "varType": "Ref File",
                  "isUpdated": false
                },
                {
                  "label": "Previous Target",
                  "value": "Commit: a1b2c3d",
                  "varType": "Old SHA",
                  "isUpdated": false
                },
                {
                  "label": "Advanced Target",
                  "value": "Commit: f9e8d7c (BRANCH POINTER ADVANCED NOMINAL!)",
                  "varType": "New SHA",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "branch_pointer_demo.js",
            "initialCode": "function advanceBranch(branch, oldSha, newSha) {\n  return {\n    branch,\n    currentSha: newSha,\n    refPath: `.git/refs/heads/${branch}`,\n    status: 'BRANCH_POINTER_ADVANCED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(advanceBranch('main', 'a1b2c3d', 'f9e8d7c')));",
            "expectedOutput": "{\"branch\":\"main\",\"currentSha\":\"f9e8d7c\",\"refPath\":\".git/refs/heads/main\",\"status\":\"BRANCH_POINTER_ADVANCED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where in the `.git` directory structure does Git store local branch pointers?",
          "expectedStringOutput": ".git/refs/heads/main",
          "acceptableAnswers": [
            ".git/refs/heads/main",
            ".git/refs/heads/",
            "refs/heads",
            "refPath\":\".git/refs/heads/main\""
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
          "diagnosisMap": {
            ".git/branches": {
              "misconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
              "errorExplanation": "Git stores branch refs under .git/refs/heads/main.",
              "recoveryPath": {
                "simplerExplanation": "Path is .git/refs/heads/main.",
                "guidedFixPrompt": "Type .git/refs/heads/main"
              }
            }
          }
        }
      },
      {
        "id": "git-d9-b2-fast-forward-merge-mechanics",
        "day": 9,
        "blockNumber": 2,
        "title": "Fast-Forward Merges: Moving the Branch Pointer Forward with No New Commit",
        "conceptBudget": {
          "primaryConcept": "Fast-Forward Merge Invariant",
          "supportingTerms": [
            "Fast-Forward (`Fast-forward`: Occurs when the target branch has no divergent commits since the feature branch was created; Git simply slides the pointer forward without creating a merge commit)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d9-b1-branch-pointer-advance-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Fast-Forward Pointer Movement",
            "codeSnippet": "// BEFORE MERGE: main -> C1; feature -> C1 -> C2 -> C3\n// COMMAND:      git switch main && git merge feature\n// AFTER MERGE:  Fast-forward: main -> C3 (No merge commit created!)",
            "lineNotes": {
              "1": "Linear divergence without main commits.",
              "2": "Merge execution.",
              "3": "Pointer slides directly to C3."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fast_forward_demo.js",
            "initialCode": "function getFastForwardMergeRule() {\n  return 'FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT';\n}\n\nconsole.log(getFastForwardMergeRule());",
            "expectedOutput": "FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What occurs during a Git Fast-Forward merge when the target branch has no divergent commits?",
          "expectedStringOutput": "FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT",
          "acceptableAnswers": [
            "FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT",
            "Advances pointer",
            "No merge commit created"
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
          "diagnosisMap": {
            "MERGE_COMMIT": {
              "misconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
              "errorExplanation": "Fast-forward creates no commit: FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT.",
              "recoveryPath": {
                "simplerExplanation": "Matches FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT.",
                "guidedFixPrompt": "Type FAST_FORWARD_MERGES_SIMPLY_ADVANCE_THE_BRANCH_POINTER_WITHOUT_CREATING_A_MERGE_COMMIT"
              }
            }
          }
        }
      },
      {
        "id": "git-d9-b3-git-switch-vs-git-checkout",
        "day": 9,
        "blockNumber": 3,
        "title": "Modern Branch Switching: `git switch` Replacing Overloaded `git checkout`",
        "conceptBudget": {
          "primaryConcept": "git switch Invariant",
          "supportingTerms": [
            "`git switch <branch>` (Introduced in Git 2.23 to cleanly separate branch switching from file restoring `git restore`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d9-b2-fast-forward-merge-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "switch_demo.js",
            "initialCode": "function getModernSwitchCommand() {\n  return 'git switch -c';\n}\n\nconsole.log(getModernSwitchCommand());",
            "expectedOutput": "git switch -c",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What modern Git command creates and immediately switches to a new branch in a single command?",
          "expectedStringOutput": "git switch -c",
          "acceptableAnswers": [
            "git switch -c",
            "git switch -c <name>",
            "switch -c"
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
          "diagnosisMap": {
            "git checkout -b": {
              "misconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
              "errorExplanation": "checkout -b is legacy. Modern Git uses git switch -c.",
              "recoveryPath": {
                "simplerExplanation": "Type git switch -c.",
                "guidedFixPrompt": "Type git switch -c"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "3-Way Merge Mechanics: Common Ancestor (`merge-base`), Recursive & ORT Merges",
    "overviewMetaphor": "A 3-Way Merge Is a Triangle DNA Paternity Test for Code: When Alice and Bob both make independent changes on separate branches, Git finds their common ancestor parent (`merge-base`); if Alice changed line 1 and Bob changed line 50, Git merges both changes automatically into a dual-parent commit (`parentCount: 2`) without conflicts.",
    "blocks": [
      {
        "id": "git-d10-b1-three-way-merge-commit-generator",
        "day": 10,
        "blockNumber": 1,
        "title": "3-Way Merge Commit: Combining Dual Parents (`main456` & `feat789`)",
        "conceptBudget": {
          "primaryConcept": "3-Way Merge Common Ancestor & Dual Parent Generator",
          "supportingTerms": [
            "Merge Base SHA (`'base123'`)",
            "Parent 1 SHA (`'main456'`)",
            "Parent 2 SHA (`'feat789'`)",
            "Parent Count ($2$ parents)",
            "Status: Three-Way Merge Commit Generated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d9-b1-branch-pointer-advance-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "3-Way Merge Dual-Parent Topology Ledger",
              "boxes": [
                {
                  "label": "Common Ancestor",
                  "value": "merge-base SHA: base123",
                  "varType": "Ancestor",
                  "isUpdated": false
                },
                {
                  "label": "Parent 1 (Ours)",
                  "value": "Commit: main456 (Current active HEAD)",
                  "varType": "Parent 1",
                  "isUpdated": false
                },
                {
                  "label": "Parent 2 (Theirs)",
                  "value": "Commit: feat789 (Incoming topic branch)",
                  "varType": "Parent 2",
                  "isUpdated": false
                },
                {
                  "label": "Merge Commit Record",
                  "value": "Dual Parents: [main456, feat789] (MERGE COMMIT GENERATED NOMINAL!)",
                  "varType": "Merge Node",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "three_way_merge_demo.js",
            "initialCode": "function createMergeCommit(base, p1, p2, msg) {\n  return {\n    base,\n    parent1: p1,\n    parent2: p2,\n    parentCount: 2,\n    message: msg,\n    isThreeWayMerge: true,\n    status: 'THREE_WAY_MERGE_COMMIT_GENERATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(createMergeCommit('base123', 'main456', 'feat789', 'Merge feature into main')));",
            "expectedOutput": "{\"base\":\"base123\",\"parent1\":\"main456\",\"parent2\":\"feat789\",\"parentCount\":2,\"message\":\"Merge feature into main\",\"isThreeWayMerge\":true,\"status\":\"THREE_WAY_MERGE_COMMIT_GENERATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many parent commit hashes are referenced by a standard non-fast-forward 3-way merge commit?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "parentCount\":2",
            "2 parents",
            "two"
          ],
          "primaryMisconceptionId": "MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF",
              "errorExplanation": "Standard commits have 1 parent. Merge commits reference 2 parents.",
              "recoveryPath": {
                "simplerExplanation": "Type 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "git-d10-b2-git-merge-abort-safeguard",
        "day": 10,
        "blockNumber": 2,
        "title": "Emergency Exit: `git merge --abort` Restoring Pre-Merge State",
        "conceptBudget": {
          "primaryConcept": "git merge --abort Invariant",
          "supportingTerms": [
            "`git merge --abort` (Safely terminates a conflicted merge in progress and restores the working tree and index to the exact state prior to running `git merge`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d10-b1-three-way-merge-commit-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Merge Abort Command",
            "codeSnippet": "// $ git merge feature-auth\n// Automatic merge failed; fix conflicts and then commit the result.\n// $ git merge --abort\n// -> Instantly restores working directory and HEAD back to clean main!",
            "lineNotes": {
              "1": "Merge execution.",
              "2": "Conflict encountered.",
              "3": "Safe abort command.",
              "4": "Clean restoration."
            }
          },
          {
            "type": "runnable_code",
            "filename": "merge_abort_demo.js",
            "initialCode": "function getMergeAbortCommand() {\n  return 'git merge --abort';\n}\n\nconsole.log(getMergeAbortCommand());",
            "expectedOutput": "git merge --abort",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What command aborts a conflicted merge operation and returns the working tree to its exact pre-merge state?",
          "expectedStringOutput": "git merge --abort",
          "acceptableAnswers": [
            "git merge --abort",
            "merge --abort"
          ],
          "primaryMisconceptionId": "MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF",
          "diagnosisMap": {
            "git reset --hard": {
              "misconceptionId": "MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF",
              "errorExplanation": "git reset --hard can destroy uncommitted work. The official safe merge abort command is git merge --abort.",
              "recoveryPath": {
                "simplerExplanation": "Type git merge --abort.",
                "guidedFixPrompt": "Type git merge --abort"
              }
            }
          }
        }
      },
      {
        "id": "git-d10-b3-no-ff-flag-preserving-feature-branch-history",
        "day": 10,
        "blockNumber": 3,
        "title": "Preserving Branch Topology: `git merge --no-ff`",
        "conceptBudget": {
          "primaryConcept": "--no-ff Merge Invariant",
          "supportingTerms": [
            "`--no-ff` (Forces Git to create a merge commit even if a fast-forward is possible, preserving the historical existence and boundary of the feature branch)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d10-b2-git-merge-abort-safeguard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "no_ff_demo.js",
            "initialCode": "function getNoFfFlag() {\n  return '--no-ff';\n}\n\nconsole.log(getNoFfFlag());",
            "expectedOutput": "--no-ff",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git merge` forces the creation of a merge commit even when a fast-forward merge is possible?",
          "expectedStringOutput": "--no-ff",
          "acceptableAnswers": [
            "--no-ff",
            "--no-ff flag",
            "no-ff"
          ],
          "primaryMisconceptionId": "MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF",
          "diagnosisMap": {
            "--ff-only": {
              "misconceptionId": "MC_GIT_THREE_WAY_MERGES_FAST_FORWARD_NO_FF",
              "errorExplanation": "--ff-only rejects merges if fast-forward is impossible. Forcing merge commits uses --no-ff.",
              "recoveryPath": {
                "simplerExplanation": "Type --no-ff.",
                "guidedFixPrompt": "Type --no-ff"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Merge Conflict Detection & Resolution: Conflict Markers (`<<<<<<< HEAD`)",
    "overviewMetaphor": "A Merge Conflict Is Two Co-Authors Editing the Exact Same Sentence in a Book: Author 1 writes 'The door was red' while Author 2 writes 'The door was blue'; Git stops the printing press, inserting `<<<<<<< HEAD` around both sentences so the human editor can resolve the conflict cleanly to 'The door was blue with red trim'.",
    "blocks": [
      {
        "id": "git-d11-b1-merge-conflict-resolver-guard",
        "day": 11,
        "blockNumber": 1,
        "title": "Conflict Resolution: Resolving `<<<<<<< HEAD` to `'const PORT = 3000;'`",
        "conceptBudget": {
          "primaryConcept": "Merge Conflict Marker Parser & Clean Resolution Guard",
          "supportingTerms": [
            "Conflict Text Block",
            "Chosen Side (`'OURS'`)",
            "Resolved Text (`'const PORT = 3000;'`)",
            "Conflict Markers Remaining (`false`)",
            "Status: Merge Conflict Resolved Clean Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d10-b1-three-way-merge-commit-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Merge Conflict Marker Anatomy Ledger",
              "boxes": [
                {
                  "label": "Ours (HEAD)",
                  "value": "<<<<<<< HEAD\\nconst PORT = 3000; (Current branch version)",
                  "varType": "Ours",
                  "isUpdated": false
                },
                {
                  "label": "Divider Marker",
                  "value": "======= (Separates conflicting versions)",
                  "varType": "Divider",
                  "isUpdated": false
                },
                {
                  "label": "Theirs (Incoming)",
                  "value": "const PORT = 8080;\\n>>>>>>> feature-port (Incoming branch version)",
                  "varType": "Theirs",
                  "isUpdated": false
                },
                {
                  "label": "Clean Resolution",
                  "value": "const PORT = 3000; (MERGE CONFLICT RESOLVED CLEAN NOMINAL!)",
                  "varType": "Resolved",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "conflict_resolve_demo.js",
            "initialCode": "function resolveConflict(raw, choice) {\n  const m = raw.match(/<<<<<<< HEAD\\n([\\s\\S]*?)\\n=======\\n([\\s\\S]*?)\\n>>>>>>> [a-zA-Z0-9_-]+/);\n  const resolved = choice === 'OURS' ? m[1] : m[2];\n  return {\n    resolvedText: resolved,\n    hasMarkers: false,\n    status: 'MERGE_CONFLICT_RESOLVED_CLEAN_NOMINAL'\n  };\n}\n\nconst raw = '<<<<<<< HEAD\\nconst PORT = 3000;\\n=======\\nconst PORT = 8080;\\n>>>>>>> feature-port';\nconsole.log(JSON.stringify(resolveConflict(raw, 'OURS')));",
            "expectedOutput": "{\"resolvedText\":\"const PORT = 3000;\",\"hasMarkers\":false,\"status\":\"MERGE_CONFLICT_RESOLVED_CLEAN_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What clean code string is produced when resolving the conflict block to 'OURS'?",
          "expectedStringOutput": "const PORT = 3000;",
          "acceptableAnswers": [
            "const PORT = 3000;",
            "resolvedText\":\"const PORT = 3000;\""
          ],
          "primaryMisconceptionId": "MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION",
          "diagnosisMap": {
            "const PORT = 8080;": {
              "misconceptionId": "MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION",
              "errorExplanation": "PORT 8080 is THEIRS. Selecting OURS resolves to const PORT = 3000;.",
              "recoveryPath": {
                "simplerExplanation": "Resolves to const PORT = 3000;.",
                "guidedFixPrompt": "Type const PORT = 3000;"
              }
            }
          }
        }
      },
      {
        "id": "git-d11-b2-conflict-marker-opening-syntax",
        "day": 11,
        "blockNumber": 2,
        "title": "Conflict Marker Syntax: `<<<<<<<`, `=======`, and `>>>>>>>`",
        "conceptBudget": {
          "primaryConcept": "Conflict Marker Syntax Invariant",
          "supportingTerms": [
            "Marker Syntax (`<<<<<<< HEAD` denotes current branch changes; `=======` denotes center divider; `>>>>>>> branch` denotes incoming branch changes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d11-b1-merge-conflict-resolver-guard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "3-Part Conflict Marker Anatomy",
            "codeSnippet": "// <<<<<<< HEAD         (Top marker: Shows changes on the currently checked out branch)\n// const DB_URL = \"localhost:5432\";\n// =======              (Center divider: Separates the two conflicting versions)\n// const DB_URL = \"db.prod.internal:5432\";\n// >>>>>>> feature-db   (Bottom marker: Shows changes on the incoming branch being merged)",
            "lineNotes": {
              "1": "Local branch start.",
              "2": "Local branch code.",
              "3": "Divider separator.",
              "4": "Incoming branch code.",
              "5": "Incoming branch end."
            }
          },
          {
            "type": "runnable_code",
            "filename": "marker_syntax_demo.js",
            "initialCode": "function getConflictMarkerStart() {\n  return '<<<<<<<';\n}\n\nconsole.log(getConflictMarkerStart());",
            "expectedOutput": "<<<<<<<",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 7-character string marks the opening boundary of a Git merge conflict block?",
          "expectedStringOutput": "<<<<<<<",
          "acceptableAnswers": [
            "<<<<<<<",
            "7 angle brackets",
            "Opening conflict marker"
          ],
          "primaryMisconceptionId": "MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION",
          "diagnosisMap": {
            "=======": {
              "misconceptionId": "MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION",
              "errorExplanation": "======= is the middle divider. The opening marker is <<<<<<<.",
              "recoveryPath": {
                "simplerExplanation": "Type <<<<<<<.",
                "guidedFixPrompt": "Type <<<<<<<"
              }
            }
          }
        }
      },
      {
        "id": "git-d11-b3-completing-merge-after-conflict-resolution",
        "day": 11,
        "blockNumber": 3,
        "title": "Completing Conflict Resolution: `git add <file>` and `git commit`",
        "conceptBudget": {
          "primaryConcept": "Conflict Completion Workflow Invariant",
          "supportingTerms": [
            "Completion Steps (1. Manually edit file to remove conflict markers; 2. Stage resolved file with `git add <file>`; 3. Run `git commit` to finalize merge commit)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d11-b2-conflict-marker-opening-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "complete_conflict_demo.js",
            "initialCode": "function getConflictCompletionStandard() {\n  return 'STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE';\n}\n\nconsole.log(getConflictCompletionStandard());",
            "expectedOutput": "STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the mandatory next step after editing a conflicted file to remove conflict markers?",
          "expectedStringOutput": "STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE",
          "acceptableAnswers": [
            "STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE",
            "git add then git commit",
            "git add and git commit"
          ],
          "primaryMisconceptionId": "MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION",
          "diagnosisMap": {
            "PUSH": {
              "misconceptionId": "MC_GIT_MERGE_CONFLICT_MARKERS_RESOLUTION",
              "errorExplanation": "You must stage and commit locally first: STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE.",
              "recoveryPath": {
                "simplerExplanation": "Matches STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE.",
                "guidedFixPrompt": "Type STAGE_RESOLVED_FILES_WITH_GIT_ADD_THEN_RUN_GIT_COMMIT_TO_FINALIZE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Git Stash & Work-in-Progress (WIP) Preservation: `stash save`, `pop` & `apply`",
    "overviewMetaphor": "Git Stash Is a Coat Check at a Restaurant: You are in the middle of writing unfinished messy code (`wip: payment`), but urgent hotfix duty calls; you hand your jacket to the coat check (`git stash save`), switch branches with a clean working tree to fix the bug, and retrieve your jacket when you return (`git stash pop`).",
    "blocks": [
      {
        "id": "git-d12-b1-stash-lifo-stack-manager",
        "day": 12,
        "blockNumber": 1,
        "title": "Git Stash LIFO Stack: Pushing `'wip: payment'` & Popping Back",
        "conceptBudget": {
          "primaryConcept": "Git Stash LIFO Stack Manager Simulator",
          "supportingTerms": [
            "Popped Stash Message (`'wip: payment'`)",
            "Remaining Stack Size ($1$ item)",
            "LIFO Architecture",
            "Status: Stash Popped Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d11-b1-merge-conflict-resolver-guard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Stash LIFO Stack Ledger",
              "boxes": [
                {
                  "label": "Initial Stack",
                  "value": "[stash@{0}: 'wip: auth']",
                  "varType": "Stack",
                  "isUpdated": false
                },
                {
                  "label": "PUSH Action",
                  "value": "Pushes 'wip: payment' -> stack@{0}: 'wip: payment', stack@{1}: 'wip: auth'",
                  "varType": "Push",
                  "isUpdated": false
                },
                {
                  "label": "POP Action",
                  "value": "Pops top item 'wip: payment' (STASH POPPED NOMINAL!)",
                  "varType": "Pop",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "stash_lifo_demo.js",
            "initialCode": "function runStash() {\n  const stack = [{ id: 'stash@{0}', message: 'wip: auth' }];\n  stack.unshift({ id: 'stash@{0}', message: 'wip: payment' });\n  const popped = stack.shift();\n  return {\n    poppedMessage: popped.message,\n    remainingLength: stack.length,\n    status: 'STASH_POPPED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(runStash()));",
            "expectedOutput": "{\"poppedMessage\":\"wip: payment\",\"remainingLength\":1,\"status\":\"STASH_POPPED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What message string was popped from the top of the Git stash stack?",
          "expectedStringOutput": "wip: payment",
          "acceptableAnswers": [
            "wip: payment",
            "poppedMessage\":\"wip: payment\""
          ],
          "primaryMisconceptionId": "MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION",
          "diagnosisMap": {
            "wip: auth": {
              "misconceptionId": "MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION",
              "errorExplanation": "Stash is LIFO (Last In First Out). The latest pushed item 'wip: payment' is popped first.",
              "recoveryPath": {
                "simplerExplanation": "Top item is 'wip: payment'.",
                "guidedFixPrompt": "Type wip: payment"
              }
            }
          }
        }
      },
      {
        "id": "git-d12-b2-stash-pop-vs-stash-apply",
        "day": 12,
        "blockNumber": 2,
        "title": "`git stash pop` (Applies and Deletes) vs `git stash apply` (Applies and Retains)",
        "conceptBudget": {
          "primaryConcept": "stash pop vs apply Invariant",
          "supportingTerms": [
            "`git stash pop` (Restores uncommitted work and removes stash from list)",
            "`git stash apply` (Restores uncommitted work while preserving the stash in the list for re-use across multiple branches)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d12-b1-stash-lifo-stack-manager",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Stash Command Distinctions",
            "codeSnippet": "// git stash pop   -> Restores working changes AND drops stash@{0} from list\n// git stash apply -> Restores working changes BUT keeps stash@{0} intact in list",
            "lineNotes": {
              "1": "Restores and deletes.",
              "2": "Restores and preserves."
            }
          },
          {
            "type": "runnable_code",
            "filename": "stash_diff_demo.js",
            "initialCode": "function getStashApplyBehavior() {\n  return 'GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK';\n}\n\nconsole.log(getStashApplyBehavior());",
            "expectedOutput": "GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does `git stash apply` differ from `git stash pop`?",
          "expectedStringOutput": "GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK",
          "acceptableAnswers": [
            "GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK",
            "Does not delete stash",
            "Preserves stash in stack"
          ],
          "primaryMisconceptionId": "MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION",
          "diagnosisMap": {
            "DELETES": {
              "misconceptionId": "MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION",
              "errorExplanation": "pop deletes. apply uses GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK.",
              "recoveryPath": {
                "simplerExplanation": "Matches GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK.",
                "guidedFixPrompt": "Type GIT_STASH_APPLY_RESTORES_CHANGES_WITHOUT_DELETING_THE_STASH_FROM_THE_STACK"
              }
            }
          }
        }
      },
      {
        "id": "git-d12-b3-stashing-untracked-files-include-untracked",
        "day": 12,
        "blockNumber": 3,
        "title": "Stashing Untracked Files: The `-u` (`--include-untracked`) Flag",
        "conceptBudget": {
          "primaryConcept": "Stash Untracked Invariant",
          "supportingTerms": [
            "`git stash -u` (By default, `git stash` ONLY shelves tracked files; `-u` or `--include-untracked` forces Git to stash newly created untracked files as well)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d12-b2-stash-pop-vs-stash-apply",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stash_untracked_demo.js",
            "initialCode": "function getStashUntrackedFlag() {\n  return '-u';\n}\n\nconsole.log(getStashUntrackedFlag());",
            "expectedOutput": "-u",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git stash` ensures newly created untracked files are included in the stash snapshot?",
          "expectedStringOutput": "-u",
          "acceptableAnswers": [
            "-u",
            "--include-untracked",
            "-u (--include-untracked)"
          ],
          "primaryMisconceptionId": "MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION",
          "diagnosisMap": {
            "-a": {
              "misconceptionId": "MC_GIT_STASH_WORK_IN_PROGRESS_PRESERVATION",
              "errorExplanation": "-a includes ignored files too. Stashing untracked files uses -u.",
              "recoveryPath": {
                "simplerExplanation": "Type -u.",
                "guidedFixPrompt": "Type -u"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Git Tagging & Release Management: Lightweight Tags, Annotated Tags & SemVer",
    "overviewMetaphor": "A Git Release Tag Is a Wax Seal on a Signed Royal Decree: Unlike a moving branch pointer that advances with every new commit, an Annotated Tag (`git tag -a v1.0.0 -m \"Release\"`) permanently cements the exact commit SHA, timestamp, and author signature, establishing an immutable release milestone.",
    "blocks": [
      {
        "id": "git-d13-b1-semver-tag-parser-auditor",
        "day": 13,
        "blockNumber": 1,
        "title": "Semantic Version Tagging: Parsing `v2.1.4` $\\to$ `{ major: 2, minor: 1, patch: 4 }`",
        "conceptBudget": {
          "primaryConcept": "Semantic Version String Parser & Tag Auditor",
          "supportingTerms": [
            "Raw Tag (`'v2.1.4'`)",
            "Major Version ($2$)",
            "Minor Version ($1$)",
            "Patch Version ($4$)",
            "Valid SemVer (`true`)",
            "Status: SemVer Tag Parsed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d12-b1-stash-lifo-stack-manager",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Semantic Versioning Release Tag Ledger",
              "boxes": [
                {
                  "label": "Major Component (2)",
                  "value": "Breaking API changes (v2.0.0)",
                  "varType": "Major",
                  "isUpdated": false
                },
                {
                  "label": "Minor Component (1)",
                  "value": "Backwards-compatible new features (v2.1.0)",
                  "varType": "Minor",
                  "isUpdated": false
                },
                {
                  "label": "Patch Component (4)",
                  "value": "Backwards-compatible bugfixes -> v2.1.4 (SEMVER TAG PARSED NOMINAL!)",
                  "varType": "Patch",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "semver_demo.js",
            "initialCode": "function parseSemver(tag) {\n  const m = tag.match(/^v?(\\d+)\\.(\\d+)\\.(\\d+)$/);\n  return {\n    tag,\n    major: parseInt(m[1], 10),\n    minor: parseInt(m[2], 10),\n    patch: parseInt(m[3], 10),\n    isValidSemver: true,\n    status: 'SEMVER_TAG_PARSED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(parseSemver('v2.1.4')));",
            "expectedOutput": "{\"tag\":\"v2.1.4\",\"major\":2,\"minor\":1,\"patch\":4,\"isValidSemver\":true,\"status\":\"SEMVER_TAG_PARSED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What minor version integer is parsed from the release tag 'v2.1.4'?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "minor\":1",
            "minor: 1"
          ],
          "primaryMisconceptionId": "MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED",
              "errorExplanation": "2 is the major version. The minor version is 1.",
              "recoveryPath": {
                "simplerExplanation": "Minor version is 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "git-d13-b2-annotated-vs-lightweight-tags",
        "day": 13,
        "blockNumber": 2,
        "title": "Annotated Tags (`git tag -a`) vs Lightweight Tags (`git tag`)",
        "conceptBudget": {
          "primaryConcept": "Annotated Tag Invariant",
          "supportingTerms": [
            "Annotated Tag (`git tag -a v1.0.0 -m \"msg\"`: Stored as a full Git object in database containing tagger name, email, date, message, and GPG signature; lightweight tags are just raw pointers)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d13-b1-semver-tag-parser-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Tag Creation Commands",
            "codeSnippet": "// LIGHTWEIGHT TAG: git tag v1.0.0          (Just a commit reference pointer)\n// ANNOTATED TAG:   git tag -a v1.0.0 -m \"Production v1.0 Release\" (Full cryptographic metadata!)",
            "lineNotes": {
              "1": "Pointer only.",
              "2": "Production standard annotated release object."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tag_types_demo.js",
            "initialCode": "function getAnnotatedTagFlag() {\n  return '-a';\n}\n\nconsole.log(getAnnotatedTagFlag());",
            "expectedOutput": "-a",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git tag` creates an annotated release tag containing full author metadata and release notes?",
          "expectedStringOutput": "-a",
          "acceptableAnswers": [
            "-a",
            "--annotate",
            "-a flag"
          ],
          "primaryMisconceptionId": "MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED",
          "diagnosisMap": {
            "-m": {
              "misconceptionId": "MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED",
              "errorExplanation": "-m supplies message. Creating annotated tag requires -a.",
              "recoveryPath": {
                "simplerExplanation": "Type -a.",
                "guidedFixPrompt": "Type -a"
              }
            }
          }
        }
      },
      {
        "id": "git-d13-b3-pushing-tags-to-remote-repositories",
        "day": 13,
        "blockNumber": 3,
        "title": "Pushing Tags: `git push origin --tags` vs Standard Branch Pushes",
        "conceptBudget": {
          "primaryConcept": "Tag Push Invariant",
          "supportingTerms": [
            "`git push origin --tags` (By default, `git push` does NOT transfer local tags to remote servers; `--tags` or explicit tag name `git push origin v1.0.0` is required)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d13-b2-annotated-vs-lightweight-tags",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "push_tags_demo.js",
            "initialCode": "function getPushTagsCommand() {\n  return 'git push origin --tags';\n}\n\nconsole.log(getPushTagsCommand());",
            "expectedOutput": "git push origin --tags",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git command pushes all local release tags to the remote origin repository?",
          "expectedStringOutput": "git push origin --tags",
          "acceptableAnswers": [
            "git push origin --tags",
            "push origin --tags",
            "git push --tags"
          ],
          "primaryMisconceptionId": "MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED",
          "diagnosisMap": {
            "git push": {
              "misconceptionId": "MC_GIT_TAGGING_RELEASES_SEMVER_ANNOTATED",
              "errorExplanation": "git push ignores tags by default. Pushing tags requires git push origin --tags.",
              "recoveryPath": {
                "simplerExplanation": "Type git push origin --tags.",
                "guidedFixPrompt": "Type git push origin --tags"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Time-Travel & Reset Modes: Soft (`--soft`), Mixed (`--mixed`), Hard (`--hard`) & Reflog",
    "overviewMetaphor": "Git Reset Is a Time Machine with 3 Safety Settings: `--soft` rewinds time to un-commit your work while keeping everything staged; `--mixed` un-commits and un-stages while keeping code on disk; `--hard` vaporizes uncommitted code; but `git reflog` is the black-box flight recorder that can resurrect deleted commits even after a hard reset disaster!",
    "blocks": [
      {
        "id": "git-d14-b1-reset-mode-outcome-evaluator",
        "day": 14,
        "blockNumber": 1,
        "title": "Reset Modes: Soft (Safe) vs Mixed (Moderate) vs Hard (Destructive)",
        "conceptBudget": {
          "primaryConcept": "Git Reset Mode State Outcome Matrix Evaluator",
          "supportingTerms": [
            "`--soft` (Preserves index & disk $\\implies$ `'SAFE'`)",
            "`--mixed` (Preserves disk, resets index $\\implies$ `'MODERATE'`)",
            "`--hard` (Discards disk & index $\\implies$ `'DESTRUCTIVE'`)",
            "Status: Reset Outcome Evaluated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d13-b1-semver-tag-parser-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Reset Mode Safety Matrix Ledger",
              "boxes": [
                {
                  "label": "git reset --soft",
                  "value": "Rewinds HEAD | Keeps Index STAGED | Keeps Working Disk -> SAFE",
                  "varType": "Soft",
                  "isUpdated": false
                },
                {
                  "label": "git reset --mixed",
                  "value": "Rewinds HEAD | Unstages Index | Keeps Working Disk -> MODERATE (DEFAULT)",
                  "varType": "Mixed",
                  "isUpdated": false
                },
                {
                  "label": "git reset --hard",
                  "value": "Rewinds HEAD | Clears Index | Clears Working Disk -> DESTRUCTIVE (EVALUATED NOMINAL!)",
                  "varType": "Hard",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "reset_modes_demo.js",
            "initialCode": "function evaluateReset(mode) {\n  const map = {\n    'SOFT': { indexPreserved: true, diskPreserved: true, danger: 'SAFE' },\n    'MIXED': { indexPreserved: false, diskPreserved: true, danger: 'MODERATE' },\n    'HARD': { indexPreserved: false, diskPreserved: false, danger: 'DESTRUCTIVE' }\n  };\n  return { mode, ...map[mode], status: 'RESET_OUTCOME_EVALUATED_NOMINAL' };\n}\n\nconsole.log(JSON.stringify(evaluateReset('SOFT')));\nconsole.log(JSON.stringify(evaluateReset('HARD')));",
            "expectedOutput": "{\"mode\":\"SOFT\",\"indexPreserved\":true,\"diskPreserved\":true,\"danger\":\"SAFE\",\"status\":\"RESET_OUTCOME_EVALUATED_NOMINAL\"}\n{\"mode\":\"HARD\",\"indexPreserved\":false,\"diskPreserved\":false,\"danger\":\"DESTRUCTIVE\",\"status\":\"RESET_OUTCOME_EVALUATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What danger level classification is assigned to `git reset --hard`?",
          "expectedStringOutput": "DESTRUCTIVE",
          "acceptableAnswers": [
            "DESTRUCTIVE",
            "danger\":\"DESTRUCTIVE\"",
            "Destructive"
          ],
          "primaryMisconceptionId": "MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG",
          "diagnosisMap": {
            "SAFE": {
              "misconceptionId": "MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG",
              "errorExplanation": "--soft is safe. --hard destroys uncommitted changes: DESTRUCTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Danger is DESTRUCTIVE.",
                "guidedFixPrompt": "Type DESTRUCTIVE"
              }
            }
          }
        }
      },
      {
        "id": "git-d14-b2-git-reflog-recovery-lifesaver",
        "day": 14,
        "blockNumber": 2,
        "title": "The Reflog Lifesaver: Resurrecting Lost Commits via `git reflog`",
        "conceptBudget": {
          "primaryConcept": "git reflog Recovery Invariant",
          "supportingTerms": [
            "`git reflog` (A local chronological log of every HEAD pointer change; even if you run `git reset --hard`, reflog records the old commit SHA, allowing recovery via `git reset --hard HEAD@{1}`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d14-b1-reset-mode-outcome-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Reflog Recovery Sequence",
            "codeSnippet": "// 1. Accidental disaster: git reset --hard HEAD~5 (Lost 5 commits!)\n// 2. View local HEAD journal: git reflog\n//    4b825dc HEAD@{0}: reset: moving to HEAD~5\n//    c789abc HEAD@{1}: commit: feat: awesome feature\n// 3. Resurrect instantly: git reset --hard HEAD@{1}",
            "lineNotes": {
              "1": "Accidental deletion.",
              "2": "Inspecting reflog journal.",
              "3": "Instant recovery."
            }
          },
          {
            "type": "runnable_code",
            "filename": "reflog_demo.js",
            "initialCode": "function getReflogRecoveryCommand() {\n  return 'git reflog';\n}\n\nconsole.log(getReflogRecoveryCommand());",
            "expectedOutput": "git reflog",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git command inspects the historical journal of all local HEAD pointer movements to recover seemingly lost commits?",
          "expectedStringOutput": "git reflog",
          "acceptableAnswers": [
            "git reflog",
            "reflog",
            "git reflog command"
          ],
          "primaryMisconceptionId": "MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG",
          "diagnosisMap": {
            "git log": {
              "misconceptionId": "MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG",
              "errorExplanation": "git log hides disconnected commits. Inspecting raw pointer history uses git reflog.",
              "recoveryPath": {
                "simplerExplanation": "Type git reflog.",
                "guidedFixPrompt": "Type git reflog"
              }
            }
          }
        }
      },
      {
        "id": "git-d14-b3-git-revert-public-safe-undo",
        "day": 14,
        "blockNumber": 3,
        "title": "`git revert <sha>`: Creating Forward Inverting Commits for Shared Branches",
        "conceptBudget": {
          "primaryConcept": "git revert Invariant",
          "supportingTerms": [
            "`git revert <sha>` (Creates a NEW commit that applies the exact inverse mathematical diff of a target commit, safely undoing changes on public branches without rewriting history)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d14-b2-git-reflog-recovery-lifesaver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "revert_demo.js",
            "initialCode": "function getPublicUndoCommand() {\n  return 'git revert <sha>';\n}\n\nconsole.log(getPublicUndoCommand());",
            "expectedOutput": "git revert <sha>",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git command safely undoes changes on a shared public branch by generating a new forward inverting commit?",
          "expectedStringOutput": "git revert <sha>",
          "acceptableAnswers": [
            "git revert <sha>",
            "git revert",
            "revert"
          ],
          "primaryMisconceptionId": "MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG",
          "diagnosisMap": {
            "git reset": {
              "misconceptionId": "MC_GIT_RESET_MODES_SOFT_MIXED_HARD_REFLOG",
              "errorExplanation": "git reset rewrites history and breaks shared branches. Public undoing uses git revert <sha>.",
              "recoveryPath": {
                "simplerExplanation": "Type git revert <sha>.",
                "guidedFixPrompt": "Type git revert <sha>"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete intermediate version control engine: 1. Branch pointer advances (`main` $\\to$ `f9e8d7c`); 2. 3-Way merge dual parent generation; 3. Merge conflict resolution without marker artifacts; 4. LIFO stash stack management; 5. SemVer tag auditing (`v2.1.4`); 6. Safe `--soft` reset evaluation.",
    "blocks": [
      {
        "id": "git-d15-b1-git-branching-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Git Branching & Conflict Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Git Branching & Conflict Master Engine",
          "supportingTerms": [
            "Branch Pointer Engine",
            "3-Way Merge Engine",
            "Conflict Resolution Engine",
            "Stash Stack Engine",
            "SemVer Tag Engine",
            "Reset Modes Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d14-b3-git-revert-public-safe-undo",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Git Branching Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Advances branch pointers (main -> f9e8d7c) & constructs 3-way merges (2 parents)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Resolves conflict markers cleanly to 'const PORT = 3000;'",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Manages LIFO stashes, parses SemVer tags (v2.1.4), & audits reset modes",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Git Branching & Conflict Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "branching_kernel_demo.js",
            "initialCode": "function runBranchingMaster() {\n  return {\n    pointerSubsystem: 'ONLINE_F9E8D7C_ADVANCED',\n    mergeSubsystem: 'ONLINE_2PARENTS_ACTIVE',\n    conflictSubsystem: 'ONLINE_PORT3000_CLEAN',\n    stashSubsystem: 'ONLINE_LIFO_STACK_ACTIVE',\n    tagSubsystem: 'ONLINE_V2_1_4_SEMVER_ACTIVE',\n    resetSubsystem: 'ONLINE_REFLOG_SAFE_ACTIVE',\n    engineStatus: 'GIT_BRANCHING_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runBranchingMaster().engineStatus);",
            "expectedOutput": "GIT_BRANCHING_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Git Branching & Conflict Master Engine?",
          "expectedStringOutput": "GIT_BRANCHING_MASTER_ACTIVE",
          "acceptableAnswers": [
            "GIT_BRANCHING_MASTER_ACTIVE",
            "engineStatus: GIT_BRANCHING_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
              "errorExplanation": "Matches GIT_BRANCHING_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type GIT_BRANCHING_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "git-d15-b2-git-branching-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Git Branching Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Git Branching Invariant Verification",
          "supportingTerms": [
            "Branching Invariant",
            "Merge Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d15-b1-git-branching-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "branching_audit_demo.js",
            "initialCode": "function auditBranching(b, m, c, s, t, r) {\n  const passed = b && m && c && s && t && r;\n  return {\n    branchesVerified: b,\n    mergesVerified: m,\n    conflictsVerified: c,\n    stashVerified: s,\n    tagsVerified: t,\n    resetsVerified: r,\n    grade: passed ? 'GIT_BRANCHING_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditBranching(true, true, true, true, true, true)));",
            "expectedOutput": "{\"branchesVerified\":true,\"mergesVerified\":true,\"conflictsVerified\":true,\"stashVerified\":true,\"tagsVerified\":true,\"resetsVerified\":true,\"grade\":\"GIT_BRANCHING_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Branching, 3-Way Merges, Conflict Resolution, Stash, Tags, and Resets pass 100%?",
          "expectedStringOutput": "GIT_BRANCHING_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "GIT_BRANCHING_ENGINE_AUDIT_PASSED",
            "grade\":\"GIT_BRANCHING_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
              "errorExplanation": "All checks passing awards GIT_BRANCHING_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards GIT_BRANCHING_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type GIT_BRANCHING_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "git-d15-b3-milestone2-git-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Git Branching Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Git Branching Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d15-b2-git-branching-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_git_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_BRANCHING_POINTERS_HEAD_SWITCH",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Rebase vs Merge Architecture: Linear History Mechanics & The Golden Rule of Rebasing",
    "overviewMetaphor": "Rebasing Is Unplugging a LEGO Feature Tower and Re-Snapping It onto the Top of the Main Castle: Instead of creating a messy spiderweb of merge bubbles, `git rebase main` replays your commits one-by-one as brand-new bricks on top of the latest `main`; but The Golden Rule warns: NEVER rebase bricks on a public shared branch, or you will dismantle your teammates' foundations!",
    "blocks": [
      {
        "id": "git-d16-b1-rebase-linear-replay-simulator",
        "day": 16,
        "blockNumber": 1,
        "title": "Rebase Mechanics: Replaying 2 Commits on Top of `main9999`",
        "conceptBudget": {
          "primaryConcept": "Git Rebase Linear Commit Replay Simulator",
          "supportingTerms": [
            "Target Base SHA (`'main9999'`)",
            "Rebased Count ($2$ commits)",
            "Linear History (`true`)",
            "New SHA Generation",
            "Status: Git Rebase Linear Replay Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d15-b1-git-branching-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Rebase Linear Replay Topology Ledger",
              "boxes": [
                {
                  "label": "New Base Target",
                  "value": "main HEAD commit: main9999",
                  "varType": "Base SHA",
                  "isUpdated": false
                },
                {
                  "label": "Replayed Commit 1",
                  "value": "c111111 -> rebased_c111111_on_main999 (New SHA!)",
                  "varType": "Commit 1",
                  "isUpdated": false
                },
                {
                  "label": "Replayed Commit 2",
                  "value": "c222222 -> rebased_c222222_on_rebase (GIT REBASE LINEAR REPLAY NOMINAL!)",
                  "varType": "Commit 2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rebase_demo.js",
            "initialCode": "function simulateRebase(newBase, commits) {\n  let cur = newBase;\n  const rebased = commits.map(c => {\n    const s = `rebased_${c.sha.slice(0, 7)}_on_${cur.slice(0, 7)}`;\n    cur = s;\n    return { oldSha: c.sha, newSha: s, msg: c.msg };\n  });\n  return {\n    rebasedCount: rebased.length,\n    isLinear: true,\n    status: 'GIT_REBASE_LINEAR_REPLAY_NOMINAL'\n  };\n}\n\nconst commits = [{ sha: 'c111111', msg: 'feat: login' }, { sha: 'c222222', msg: 'feat: logout' }];\nconsole.log(JSON.stringify(simulateRebase('main9999', commits)));",
            "expectedOutput": "{\"rebasedCount\":2,\"isLinear\":true,\"status\":\"GIT_REBASE_LINEAR_REPLAY_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many topic commits were replayed linearly onto the new base branch in the rebase simulation?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "rebasedCount\":2",
            "2 commits"
          ],
          "primaryMisconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
              "errorExplanation": "There were 2 topic commits rebased.",
              "recoveryPath": {
                "simplerExplanation": "Count is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "git-d16-b2-the-golden-rule-of-rebasing",
        "day": 16,
        "blockNumber": 2,
        "title": "The Golden Rule of Rebasing: Never Rebase Public Shared Branches",
        "conceptBudget": {
          "primaryConcept": "Golden Rule of Rebasing Invariant",
          "supportingTerms": [
            "Golden Rule (`NEVER_REBASE_PUBLIC_SHARED_BRANCHES`: Rebasing rewrites commit SHA hashes; rebasing a shared branch forces teammates to reconcile duplicate divergent histories)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d16-b1-rebase-linear-replay-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Rebasing Rules of Engagement",
            "codeSnippet": "// ✅ SAFE:     git rebase main (On your PRIVATE local feature branch before creating a PR)\n// ❌ DISASTER: git rebase main (On the shared `develop` or `main` branch used by the entire team!)",
            "lineNotes": {
              "1": "Private local branch rebase.",
              "2": "Public shared branch disaster."
            }
          },
          {
            "type": "runnable_code",
            "filename": "golden_rule_demo.js",
            "initialCode": "function getGoldenRule() {\n  return 'NEVER_REBASE_PUBLIC_SHARED_BRANCHES';\n}\n\nconsole.log(getGoldenRule());",
            "expectedOutput": "NEVER_REBASE_PUBLIC_SHARED_BRANCHES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the inviolable Golden Rule of Git Rebasing?",
          "expectedStringOutput": "NEVER_REBASE_PUBLIC_SHARED_BRANCHES",
          "acceptableAnswers": [
            "NEVER_REBASE_PUBLIC_SHARED_BRANCHES",
            "Never rebase public shared branches",
            "Never rebase shared branches"
          ],
          "primaryMisconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
          "diagnosisMap": {
            "ALWAYS": {
              "misconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
              "errorExplanation": "Shared branch rebasing causes chaos: NEVER_REBASE_PUBLIC_SHARED_BRANCHES.",
              "recoveryPath": {
                "simplerExplanation": "Matches NEVER_REBASE_PUBLIC_SHARED_BRANCHES.",
                "guidedFixPrompt": "Type NEVER_REBASE_PUBLIC_SHARED_BRANCHES"
              }
            }
          }
        }
      },
      {
        "id": "git-d16-b3-git-rebase-abort-mechanics",
        "day": 16,
        "blockNumber": 3,
        "title": "Aborting Conflicted Rebases: `git rebase --abort`",
        "conceptBudget": {
          "primaryConcept": "git rebase --abort Invariant",
          "supportingTerms": [
            "`git rebase --abort` (Safely halts a conflicted rebase in progress and resets the topic branch back to its original commit state)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d16-b2-the-golden-rule-of-rebasing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rebase_abort_demo.js",
            "initialCode": "function getRebaseAbortCommand() {\n  return 'git rebase --abort';\n}\n\nconsole.log(getRebaseAbortCommand());",
            "expectedOutput": "git rebase --abort",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git command safely terminates a conflicted rebase operation and restores the branch to its pre-rebase state?",
          "expectedStringOutput": "git rebase --abort",
          "acceptableAnswers": [
            "git rebase --abort",
            "rebase --abort"
          ],
          "primaryMisconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
          "diagnosisMap": {
            "git merge --abort": {
              "misconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
              "errorExplanation": "git merge --abort is for merges. Aborting rebases uses git rebase --abort.",
              "recoveryPath": {
                "simplerExplanation": "Type git rebase --abort.",
                "guidedFixPrompt": "Type git rebase --abort"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Interactive Rebasing (`git rebase -i`): Squashing, Rewording, Dropping & Fixups",
    "overviewMetaphor": "Interactive Rebasing Is Editing a Movie Before the Cinema Premiere: While filming, you made 10 messy takes (`wip: fix typo`, `wip: test`); `git rebase -i` lets you 'squash' and 'fixup' those 10 bloopers into 1 Oscar-worthy feature commit (`finalResultingCommits: 1`) before submitting your Pull Request.",
    "blocks": [
      {
        "id": "git-d17-b1-interactive-rebase-squasher",
        "day": 17,
        "blockNumber": 1,
        "title": "Interactive Squashing: 3 WIP Commits $\\to$ 1 Clean Commit",
        "conceptBudget": {
          "primaryConcept": "Interactive Rebase Command Script Parser & Squasher",
          "supportingTerms": [
            "Original Commits ($3$ commits)",
            "Final Resulting Commits ($1$ commit)",
            "Squashed Count ($2$ squashed)",
            "Status: Interactive Rebase Todo Parsed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d16-b1-rebase-linear-replay-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Interactive Rebase Command Script Ledger",
              "boxes": [
                {
                  "label": "Line 1: 'pick a1b2c3d'",
                  "value": "Keeps commit: 'feat: add auth'",
                  "varType": "Pick",
                  "isUpdated": false
                },
                {
                  "label": "Line 2: 'squash e4f5g6h'",
                  "value": "Melds 'fix: typo' into Line 1",
                  "varType": "Squash",
                  "isUpdated": false
                },
                {
                  "label": "Line 3: 'fixup 9876543'",
                  "value": "Melds 'test: add test' discarding message -> 1 Final Commit (PARSED NOMINAL!)",
                  "varType": "Fixup",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "interactive_rebase_demo.js",
            "initialCode": "function parseRebaseTodo(lines) {\n  let finalCount = 0;\n  let squashedCount = 0;\n  lines.forEach(l => {\n    if (l.startsWith('pick') || l.startsWith('reword')) finalCount++;\n    else if (l.startsWith('squash') || l.startsWith('fixup')) squashedCount++;\n  });\n  return {\n    finalCount,\n    squashedCount,\n    status: 'INTERACTIVE_REBASE_TODO_PARSED_NOMINAL'\n  };\n}\n\nconst todo = ['pick a1b2c3d feat: add auth', 'squash e4f5g6h fix: typo in auth', 'fixup 9876543 test: add test'];\nconsole.log(JSON.stringify(parseRebaseTodo(todo)));",
            "expectedOutput": "{\"finalCount\":1,\"squashedCount\":2,\"status\":\"INTERACTIVE_REBASE_TODO_PARSED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many final commits remain after squashing 2 micro-commits into 1 picked commit?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "finalCount\":1",
            "1 commit",
            "one"
          ],
          "primaryMisconceptionId": "MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP",
              "errorExplanation": "Squashing combines them into a single commit: 1.",
              "recoveryPath": {
                "simplerExplanation": "Remaining count is 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "git-d17-b2-squash-vs-fixup-commands",
        "day": 17,
        "blockNumber": 2,
        "title": "`squash` (Combines Messages) vs `fixup` (Discards Message)",
        "conceptBudget": {
          "primaryConcept": "squash vs fixup Invariant",
          "supportingTerms": [
            "`squash` (Melds commit into predecessor and prompts to combine both commit messages)",
            "`fixup` (Melds commit into predecessor but automatically discards its commit message, keeping only the parent message)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d17-b1-interactive-rebase-squasher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Interactive Rebase Command Directives",
            "codeSnippet": "// pick   c111111 feat(auth): add JWT login\n// squash c222222 fix: typo in auth message  -> Pauses editor to merge commit messages\n// fixup  c333333 chore: lint whitespace     -> Melds silently, DISCARDING message!",
            "lineNotes": {
              "1": "Base commit.",
              "2": "Combines messages.",
              "3": "Discards message."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fixup_command_demo.js",
            "initialCode": "function getFixupName() {\n  return 'fixup';\n}\n\nconsole.log(getFixupName());",
            "expectedOutput": "fixup",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What interactive rebase command melds a commit into its predecessor while automatically discarding its commit log message?",
          "expectedStringOutput": "fixup",
          "acceptableAnswers": [
            "fixup",
            "f",
            "fixup command"
          ],
          "primaryMisconceptionId": "MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP",
          "diagnosisMap": {
            "squash": {
              "misconceptionId": "MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP",
              "errorExplanation": "squash preserves both messages. Discarding the message uses fixup.",
              "recoveryPath": {
                "simplerExplanation": "Type fixup.",
                "guidedFixPrompt": "Type fixup"
              }
            }
          }
        }
      },
      {
        "id": "git-d17-b3-git-rebase-autosquash",
        "day": 17,
        "blockNumber": 3,
        "title": "Automated Cleanup: `git commit --fixup <sha>` & `git rebase -i --autosquash`",
        "conceptBudget": {
          "primaryConcept": "Autosquash Invariant",
          "supportingTerms": [
            "`--autosquash` (Automatically pairs `fixup! <sha>` commits with their target commits and sets todo lines to `fixup` without manual editing)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d17-b2-squash-vs-fixup-commands",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "autosquash_demo.js",
            "initialCode": "function getAutosquashFlag() {\n  return '--autosquash';\n}\n\nconsole.log(getAutosquashFlag());",
            "expectedOutput": "--autosquash",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git rebase -i` automatically reorders and marks fixup commits in the todo list?",
          "expectedStringOutput": "--autosquash",
          "acceptableAnswers": [
            "--autosquash",
            "autosquash",
            "--autosquash flag"
          ],
          "primaryMisconceptionId": "MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP",
          "diagnosisMap": {
            "--auto": {
              "misconceptionId": "MC_GIT_INTERACTIVE_REBASE_SQUASH_REWORD_FIXUP",
              "errorExplanation": "The exact flag is --autosquash.",
              "recoveryPath": {
                "simplerExplanation": "Type --autosquash.",
                "guidedFixPrompt": "Type --autosquash"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Cherry-Picking & Selective Patching: `git cherry-pick <sha>` & Hotfixes",
    "overviewMetaphor": "Cherry-Picking Is Plucking One Ripe Fruit from a Tree Without Chopping Down the Branch: If an urgent security patch (`if (!user) return 401;`) was committed on the experimental `v2.0` branch, `git cherry-pick fix_c789abc` transplants that single isolated patch directly onto the production `prod_v1` branch instantly.",
    "blocks": [
      {
        "id": "git-d18-b1-cherry-pick-patch-applicator",
        "day": 18,
        "blockNumber": 1,
        "title": "Cherry-Pick Patch: Transplanting `fix_c789abc` onto `prod_v1_head`",
        "conceptBudget": {
          "primaryConcept": "Cherry-Pick Patch Applicator & Conflict Guard",
          "supportingTerms": [
            "Target Head (`'prod_v1_head'`)",
            "Cherry SHA (`'fix_c789abc'`)",
            "Applied Diff (`'+ if (!user) return 401;'`)",
            "Cherry Pick Clean (`true`)",
            "Status: Cherry Pick Applied Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d17-b1-interactive-rebase-squasher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Cherry-Pick Patch Transplantation Ledger",
              "boxes": [
                {
                  "label": "Target Branch Head",
                  "value": "prod_v1_head (Production legacy release branch)",
                  "varType": "Head",
                  "isUpdated": false
                },
                {
                  "label": "Source Isolated Commit",
                  "value": "fix_c789abc ('fix: auth null check')",
                  "varType": "Source SHA",
                  "isUpdated": false
                },
                {
                  "label": "Transplanted Result",
                  "value": "cherry_fix_c78_onto_prod_v1 (CHERRY PICK APPLIED NOMINAL!)",
                  "varType": "New SHA",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cherry_pick_demo.js",
            "initialCode": "function cherryPick(head, cherrySha, diff) {\n  return {\n    targetHead: head,\n    cherrySha,\n    newSha: `cherry_${cherrySha.slice(0, 7)}_onto_${head.slice(0, 7)}`,\n    isClean: true,\n    status: 'CHERRY_PICK_APPLIED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(cherryPick('prod_v1_head', 'fix_c789abc', '+ if (!user) return 401;')));",
            "expectedOutput": "{\"targetHead\":\"prod_v1_head\",\"cherrySha\":\"fix_c789abc\",\"newSha\":\"cherry_fix_c78_onto_prod_v1\",\"isClean\":true,\"status\":\"CHERRY_PICK_APPLIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms clean application of an isolated cherry-picked commit patch?",
          "expectedStringOutput": "CHERRY_PICK_APPLIED_NOMINAL",
          "acceptableAnswers": [
            "CHERRY_PICK_APPLIED_NOMINAL",
            "status\":\"CHERRY_PICK_APPLIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING",
              "errorExplanation": "Matches CHERRY_PICK_APPLIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type CHERRY_PICK_APPLIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "git-d18-b2-cherry-pick-no-commit-flag",
        "day": 18,
        "blockNumber": 2,
        "title": "Cherry-Picking Without Committing: `git cherry-pick -n` (`--no-commit`)",
        "conceptBudget": {
          "primaryConcept": "Cherry-Pick No-Commit Invariant",
          "supportingTerms": [
            "`-n` / `--no-commit` (Applies changes from target commit into the working tree and staging area without creating a commit, allowing developers to inspect or modify the patch before committing)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d18-b1-cherry-pick-patch-applicator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Cherry-Pick Command Options",
            "codeSnippet": "// git cherry-pick c789abc    -> Applies patch AND immediately creates commit\n// git cherry-pick -n c789abc -> Applies patch to Staging/Working Tree WITHOUT committing!",
            "lineNotes": {
              "1": "Immediate commit.",
              "2": "Staging only mode."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cherry_no_commit_demo.js",
            "initialCode": "function getCherryNoCommitFlag() {\n  return '-n';\n}\n\nconsole.log(getCherryNoCommitFlag());",
            "expectedOutput": "-n",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What short flag passed to `git cherry-pick` applies changes to the staging area without creating a commit?",
          "expectedStringOutput": "-n",
          "acceptableAnswers": [
            "-n",
            "--no-commit",
            "-n (--no-commit)"
          ],
          "primaryMisconceptionId": "MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING",
          "diagnosisMap": {
            "-a": {
              "misconceptionId": "MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING",
              "errorExplanation": "No-commit flag is -n.",
              "recoveryPath": {
                "simplerExplanation": "Type -n.",
                "guidedFixPrompt": "Type -n"
              }
            }
          }
        }
      },
      {
        "id": "git-d18-b3-cherry-pick-range-syntax",
        "day": 18,
        "blockNumber": 3,
        "title": "Cherry-Picking Commit Ranges: `git cherry-pick A..B`",
        "conceptBudget": {
          "primaryConcept": "Cherry-Pick Range Invariant",
          "supportingTerms": [
            "`git cherry-pick A..B` (Applies all commits from after A up to and including B; `A^..B` includes commit A)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d18-b2-cherry-pick-no-commit-flag",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cherry_range_demo.js",
            "initialCode": "function getCherryRangeOperator() {\n  return '..';\n}\n\nconsole.log(getCherryRangeOperator());",
            "expectedOutput": "..",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What two-character syntax operator specifies a range of commits in `git cherry-pick A..B`?",
          "expectedStringOutput": "..",
          "acceptableAnswers": [
            "..",
            "double dot",
            ".. operator"
          ],
          "primaryMisconceptionId": "MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING",
          "diagnosisMap": {
            "...": {
              "misconceptionId": "MC_GIT_CHERRY_PICK_SELECTIVE_PATCHING",
              "errorExplanation": "... is symmetric difference. Range operator is ...",
              "recoveryPath": {
                "simplerExplanation": "Type ...",
                "guidedFixPrompt": "Type .."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Remote Repositories & Protocol Mechanics: HTTPS, SSH Keys & Remote Management",
    "overviewMetaphor": "Git Remotes Are Satellite Ground Stations: Your local laptop talks to the GitHub satellite using either an encrypted HTTPS radio frequency (requiring Personal Access Tokens) or an elliptic-curve SSH cryptographic key (`ed25519`), routing packets securely to `origin`.",
    "blocks": [
      {
        "id": "git-d19-b1-remote-protocol-parser",
        "day": 19,
        "blockNumber": 1,
        "title": "Remote Protocols: Detecting SSH (`git@github.com:...`) vs HTTPS",
        "conceptBudget": {
          "primaryConcept": "Git Remote URL Protocol & SSH Key Type Parser",
          "supportingTerms": [
            "SSH Protocol (`'git@github.com:org/repo.git'`)",
            "HTTPS Protocol",
            "Secure Transport (`true`)",
            "Status: SSH Remote Protocol Detected"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d18-b1-cherry-pick-patch-applicator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Remote Protocol Detection Ledger",
              "boxes": [
                {
                  "label": "SSH Remote URL",
                  "value": "git@github.com:org/repo.git (Port 22 SSH Key Authentication)",
                  "varType": "SSH URL",
                  "isUpdated": false
                },
                {
                  "label": "HTTPS Remote URL",
                  "value": "https://github.com/org/repo.git (Port 443 PAT Token)",
                  "varType": "HTTPS URL",
                  "isUpdated": false
                },
                {
                  "label": "Protocol Detection",
                  "value": "Protocol: SSH | Secure: true (SSH REMOTE PROTOCOL DETECTED!)",
                  "varType": "Detection",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "remote_protocol_demo.js",
            "initialCode": "function parseProtocol(url) {\n  if (url.startsWith('git@') || url.startsWith('ssh://')) return { proto: 'SSH', isSecure: true, status: 'SSH_REMOTE_PROTOCOL_DETECTED' };\n  if (url.startsWith('https://')) return { proto: 'HTTPS', isSecure: true, status: 'HTTPS_REMOTE_PROTOCOL_DETECTED' };\n  return { proto: 'UNKNOWN', isSecure: false };\n}\n\nconsole.log(JSON.stringify(parseProtocol('git@github.com:org/repo.git')));\nconsole.log(JSON.stringify(parseProtocol('https://github.com/org/repo.git')));",
            "expectedOutput": "{\"proto\":\"SSH\",\"isSecure\":true,\"status\":\"SSH_REMOTE_PROTOCOL_DETECTED\"}\n{\"proto\":\"HTTPS\",\"isSecure\":true,\"status\":\"HTTPS_REMOTE_PROTOCOL_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protocol is detected from remote URL `'git@github.com:org/repo.git'`?",
          "expectedStringOutput": "SSH",
          "acceptableAnswers": [
            "SSH",
            "proto\":\"SSH\"",
            "SSH protocol"
          ],
          "primaryMisconceptionId": "MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS",
          "diagnosisMap": {
            "HTTPS": {
              "misconceptionId": "MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS",
              "errorExplanation": "git@ denotes SSH protocol authentication.",
              "recoveryPath": {
                "simplerExplanation": "Protocol is SSH.",
                "guidedFixPrompt": "Type SSH"
              }
            }
          }
        }
      },
      {
        "id": "git-d19-b2-modern-ssh-ed25519-key-generation",
        "day": 19,
        "blockNumber": 2,
        "title": "Modern SSH Cryptography: Ed25519 (`ssh-keygen -t ed25519`)",
        "conceptBudget": {
          "primaryConcept": "Ed25519 SSH Invariant",
          "supportingTerms": [
            "`ed25519` (Modern high-speed elliptic-curve signature algorithm replacing outdated legacy RSA 2048/4096 keys)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d19-b1-remote-protocol-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SSH Key Generation Command",
            "codeSnippet": "// ssh-keygen -t ed25519 -C \"alice@company.com\"\n// -> Generates ~/.ssh/id_ed25519 (Private Secret Key - NEVER SHARE!)\n// -> Generates ~/.ssh/id_ed25519.pub (Public Key - Upload to GitHub!)",
            "lineNotes": {
              "1": "Modern keygen command.",
              "2": "Private key.",
              "3": "Public key for GitHub."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ed25519_demo.js",
            "initialCode": "function getRecommendedSshAlgorithm() {\n  return 'ed25519';\n}\n\nconsole.log(getRecommendedSshAlgorithm());",
            "expectedOutput": "ed25519",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the industry-standard recommended elliptic curve algorithm for modern Git SSH keys?",
          "expectedStringOutput": "ed25519",
          "acceptableAnswers": [
            "ed25519",
            "Ed25519",
            "-t ed25519"
          ],
          "primaryMisconceptionId": "MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS",
          "diagnosisMap": {
            "RSA": {
              "misconceptionId": "MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS",
              "errorExplanation": "RSA is older and bulkier. The modern standard is ed25519.",
              "recoveryPath": {
                "simplerExplanation": "Type ed25519.",
                "guidedFixPrompt": "Type ed25519"
              }
            }
          }
        }
      },
      {
        "id": "git-d19-b3-git-remote-add-and-rename",
        "day": 19,
        "blockNumber": 3,
        "title": "Managing Remotes: `git remote add origin <url>` and `git remote -v`",
        "conceptBudget": {
          "primaryConcept": "git remote Invariant",
          "supportingTerms": [
            "`git remote add <name> <url>` (Links a remote nickname to a URL)",
            "`git remote -v` (Displays fetch and push URLs for all configured remotes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d19-b2-modern-ssh-ed25519-key-generation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "remote_v_demo.js",
            "initialCode": "function getRemoteVerboseFlag() {\n  return '-v';\n}\n\nconsole.log(getRemoteVerboseFlag());",
            "expectedOutput": "-v",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git remote` prints verbose URLs for fetch and push endpoints?",
          "expectedStringOutput": "-v",
          "acceptableAnswers": [
            "-v",
            "--verbose",
            "-v (--verbose)"
          ],
          "primaryMisconceptionId": "MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS",
          "diagnosisMap": {
            "-l": {
              "misconceptionId": "MC_GIT_REMOTE_REPOSITORIES_HTTPS_SSH_KEYS",
              "errorExplanation": "Verbose remote inspection uses -v.",
              "recoveryPath": {
                "simplerExplanation": "Type -v.",
                "guidedFixPrompt": "Type -v"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Remote Synchronization Workflow: `git fetch`, `git pull --rebase` & Upstream Tracking",
    "overviewMetaphor": "Git Fetch vs Pull Is Checking Weather Radar vs Walking Outside in the Rain: `git fetch` downloads satellite radar updates into `.git/refs/remotes/origin/` without getting your clothes wet; `git pull --rebase` downloads the rain and smoothly walks your local steps on top of the fresh pavement without creating useless merge bubbles.",
    "blocks": [
      {
        "id": "git-d20-b1-remote-sync-rebase-simulator",
        "day": 20,
        "blockNumber": 1,
        "title": "Remote Sync: `git pull --rebase` Preventing Merge Bubbles",
        "conceptBudget": {
          "primaryConcept": "Git Fetch vs Pull Remote Synchronization Simulator",
          "supportingTerms": [
            "Local SHA (`'loc123'`)",
            "Remote Origin SHA (`'rem456'`)",
            "Sync Strategy (`'FETCH_AND_REBASE'`)",
            "Merge Bubble Prevented (`true`)",
            "Status: Remote Sync Simulated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d19-b1-remote-protocol-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Remote Synchronization Strategy Ledger",
              "boxes": [
                {
                  "label": "Standard `git pull`",
                  "value": "git fetch + git merge -> Creates unsightly 'Merge branch main' bubbles!",
                  "varType": "Merge Pull",
                  "isUpdated": false
                },
                {
                  "label": "Professional `git pull --rebase`",
                  "value": "git fetch + git rebase -> Replays local commits linearly on top of origin/main!",
                  "varType": "Rebase Pull",
                  "isUpdated": false
                },
                {
                  "label": "Sync Outcome",
                  "value": "Merge Bubble Prevented: true (REMOTE SYNC SIMULATED NOMINAL!)",
                  "varType": "Outcome",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "remote_sync_demo.js",
            "initialCode": "function simulateSync(loc, rem, isRebase) {\n  return {\n    syncStrategy: isRebase ? 'FETCH_AND_REBASE' : 'FETCH_AND_MERGE',\n    isMergeBubblePrevented: isRebase,\n    status: 'REMOTE_SYNC_SIMULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(simulateSync('loc123', 'rem456', true)));",
            "expectedOutput": "{\"syncStrategy\":\"FETCH_AND_REBASE\",\"isMergeBubblePrevented\":true,\"status\":\"REMOTE_SYNC_SIMULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What sync strategy is executed when running `git pull --rebase`?",
          "expectedStringOutput": "FETCH_AND_REBASE",
          "acceptableAnswers": [
            "FETCH_AND_REBASE",
            "syncStrategy\":\"FETCH_AND_REBASE\"",
            "Fetch and rebase"
          ],
          "primaryMisconceptionId": "MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH",
          "diagnosisMap": {
            "FETCH_AND_MERGE": {
              "misconceptionId": "MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH",
              "errorExplanation": "Standard pull merges. git pull --rebase executes FETCH_AND_REBASE.",
              "recoveryPath": {
                "simplerExplanation": "Strategy is FETCH_AND_REBASE.",
                "guidedFixPrompt": "Type FETCH_AND_REBASE"
              }
            }
          }
        }
      },
      {
        "id": "git-d20-b2-upstream-tracking-branch-setup",
        "day": 20,
        "blockNumber": 2,
        "title": "Setting Upstream Tracking: `git push -u origin <branch>`",
        "conceptBudget": {
          "primaryConcept": "Upstream Tracking Invariant",
          "supportingTerms": [
            "`-u` / `--set-upstream` (Links your local branch to `origin/<branch>`, allowing future `git push` and `git pull` commands to run without arguments)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d20-b1-remote-sync-rebase-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Upstream Tracking Command",
            "codeSnippet": "// 1. First push: git push -u origin feature-auth\n//    -> Sets up local branch 'feature-auth' to track remote 'origin/feature-auth'\n// 2. Subsequent pushes: git push  (No arguments needed!)",
            "lineNotes": {
              "1": "Initial push with upstream flag.",
              "2": "Streamlined subsequent pushes."
            }
          },
          {
            "type": "runnable_code",
            "filename": "upstream_demo.js",
            "initialCode": "function getSetUpstreamFlag() {\n  return '-u';\n}\n\nconsole.log(getSetUpstreamFlag());",
            "expectedOutput": "-u",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git push` sets the upstream tracking reference for a new branch?",
          "expectedStringOutput": "-u",
          "acceptableAnswers": [
            "-u",
            "--set-upstream",
            "-u (--set-upstream)"
          ],
          "primaryMisconceptionId": "MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH",
          "diagnosisMap": {
            "-f": {
              "misconceptionId": "MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH",
              "errorExplanation": "-f is force push. Upstream tracking uses -u.",
              "recoveryPath": {
                "simplerExplanation": "Type -u.",
                "guidedFixPrompt": "Type -u"
              }
            }
          }
        }
      },
      {
        "id": "git-d20-b3-git-fetch-prune-remote-branches",
        "day": 20,
        "blockNumber": 3,
        "title": "Cleaning Deleted Remote Refs: `git fetch -p` (`--prune`)",
        "conceptBudget": {
          "primaryConcept": "git fetch --prune Invariant",
          "supportingTerms": [
            "`git fetch -p` (Deletes stale local tracking references in `.git/refs/remotes/origin/` for remote branches that have been merged and deleted on GitHub)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d20-b2-upstream-tracking-branch-setup",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fetch_prune_demo.js",
            "initialCode": "function getFetchPruneFlag() {\n  return '-p';\n}\n\nconsole.log(getFetchPruneFlag());",
            "expectedOutput": "-p",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git fetch` deletes local references to remote branches that no longer exist on the server?",
          "expectedStringOutput": "-p",
          "acceptableAnswers": [
            "-p",
            "--prune",
            "-p (--prune)"
          ],
          "primaryMisconceptionId": "MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH",
          "diagnosisMap": {
            "-d": {
              "misconceptionId": "MC_GIT_REMOTE_SYNC_FETCH_PULL_REBASE_PUSH",
              "errorExplanation": "Pruning remote tracking refs uses -p.",
              "recoveryPath": {
                "simplerExplanation": "Type -p.",
                "guidedFixPrompt": "Type -p"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete advanced version control and remote synchronization engine: 1. Linear rebase commit replay; 2. Interactive rebase squashing (1 clean resulting commit); 3. Cherry-pick isolated patch application; 4. SSH remote protocol verification (`ed25519`); 5. `git pull --rebase` synchronization.",
    "blocks": [
      {
        "id": "git-d21-b1-git-advanced-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Git Remote & Advanced Rebase Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Git Remote & Advanced Rebase Master Engine",
          "supportingTerms": [
            "Linear Rebase Engine",
            "Interactive Squash Engine",
            "Cherry Pick Engine",
            "SSH Protocol Engine",
            "Rebase Sync Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d20-b3-git-fetch-prune-remote-branches",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Advanced Rebase & Sync Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Simulates linear rebasing & interactive squashing (1 clean resulting commit)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Applies isolated cherry-pick patches (fix_c789abc) to production release heads",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Verifies ed25519 SSH protocols & simulates pull --rebase remote sync",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Git Remote & Advanced Rebase Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "advanced_kernel_demo.js",
            "initialCode": "function runAdvancedMaster() {\n  return {\n    rebaseSubsystem: 'ONLINE_LINEAR_REPLAY_ACTIVE',\n    squashSubsystem: 'ONLINE_1COMMIT_SQUASHED_ACTIVE',\n    cherrySubsystem: 'ONLINE_ISOLATED_PATCH_ACTIVE',\n    sshSubsystem: 'ONLINE_ED25519_PROTOCOL_ACTIVE',\n    syncSubsystem: 'ONLINE_REBASE_SYNC_ACTIVE',\n    engineStatus: 'GIT_ADVANCED_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runAdvancedMaster().engineStatus);",
            "expectedOutput": "GIT_ADVANCED_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Git Remote & Advanced Rebase Master Engine?",
          "expectedStringOutput": "GIT_ADVANCED_MASTER_ACTIVE",
          "acceptableAnswers": [
            "GIT_ADVANCED_MASTER_ACTIVE",
            "engineStatus: GIT_ADVANCED_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
              "errorExplanation": "Matches GIT_ADVANCED_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type GIT_ADVANCED_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "git-d21-b2-git-advanced-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Git Advanced Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Git Advanced Invariant Verification",
          "supportingTerms": [
            "Rebase Invariant",
            "Remote Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d21-b1-git-advanced-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "advanced_audit_demo.js",
            "initialCode": "function auditAdvanced(reb, sq, ch, ssh, sync) {\n  const passed = reb && sq && ch && ssh && sync;\n  return {\n    rebaseVerified: reb,\n    squashVerified: sq,\n    cherryVerified: ch,\n    sshVerified: ssh,\n    syncVerified: sync,\n    grade: passed ? 'GIT_ADVANCED_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditAdvanced(true, true, true, true, true)));",
            "expectedOutput": "{\"rebaseVerified\":true,\"squashVerified\":true,\"cherryVerified\":true,\"sshVerified\":true,\"syncVerified\":true,\"grade\":\"GIT_ADVANCED_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Rebasing, Squashing, Cherry-Picking, SSH, and Sync pass 100%?",
          "expectedStringOutput": "GIT_ADVANCED_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "GIT_ADVANCED_ENGINE_AUDIT_PASSED",
            "grade\":\"GIT_ADVANCED_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
              "errorExplanation": "All checks passing awards GIT_ADVANCED_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards GIT_ADVANCED_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type GIT_ADVANCED_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "git-d21-b3-milestone3-git-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Git Advanced Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Git Advanced Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d21-b2-git-advanced-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_git_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_REBASE_VS_MERGE_LINEAR_HISTORY",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "GitHub Collaboration & Pull Request (PR) Lifecycle: Forking vs Branching Models",
    "overviewMetaphor": "A GitHub Pull Request Is a Formal Architectural Proposal Before City Council: Instead of hammering changes directly onto the city highway (`main`), you build the detour on a separate model branch, attach blueprints and linked problem reports (`Closes #108`), inviting senior inspectors to review and sign off before concrete is poured.",
    "blocks": [
      {
        "id": "git-d22-b1-pr-metadata-auditor",
        "day": 22,
        "blockNumber": 1,
        "title": "PR Lifecycle: Substantive Description & Linked Issue (`Closes #108`)",
        "conceptBudget": {
          "primaryConcept": "GitHub Pull Request Issue Linker & Metadata Auditor",
          "supportingTerms": [
            "Linked Issue ID ($108$)",
            "Issue Linked (`true`)",
            "Description Substantive (`true`)",
            "PR Ready for Review (`true`)",
            "Status: Pull Request Metadata Ready for Review Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d21-b1-git-advanced-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GitHub Pull Request Metadata Ledger",
              "boxes": [
                {
                  "label": "PR Title",
                  "value": "'feat: add stripe checkout'",
                  "varType": "Title",
                  "isUpdated": false
                },
                {
                  "label": "Linked Issue Keyword",
                  "value": "'Closes #108' -> Automatically closes issue #108 on merge",
                  "varType": "Keyword",
                  "isUpdated": false
                },
                {
                  "label": "PR Review Readiness",
                  "value": "Ready: true | Issue: 108 (PR METADATA READY FOR REVIEW NOMINAL!)",
                  "varType": "Readiness",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pr_audit_demo.js",
            "initialCode": "function auditPr(title, body) {\n  const m = body.match(/(?:Fixes|Closes|Resolves)\\s+#(\\d+)/i);\n  const ready = body.trim().length >= 30 && !!m;\n  return {\n    issueId: m ? parseInt(m[1], 10) : null,\n    isReady: ready,\n    status: ready ? 'PULL_REQUEST_METADATA_READY_FOR_REVIEW_NOMINAL' : 'PR_METADATA_INCOMPLETE'\n  };\n}\n\nconst body = 'This PR implements Stripe webhooks.\\n\\nCloses #108.';\nconsole.log(JSON.stringify(auditPr('feat: add stripe checkout', body)));",
            "expectedOutput": "{\"issueId\":108,\"isReady\":true,\"status\":\"PULL_REQUEST_METADATA_READY_FOR_REVIEW_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What issue ID integer was automatically linked to the Pull Request from 'Closes #108'?",
          "expectedStringOutput": "108",
          "acceptableAnswers": [
            "108",
            "issueId\":108",
            "Issue 108",
            "#108"
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE",
          "diagnosisMap": {
            "42": {
              "misconceptionId": "MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE",
              "errorExplanation": "The body references issue #108.",
              "recoveryPath": {
                "simplerExplanation": "Issue ID is 108.",
                "guidedFixPrompt": "Type 108"
              }
            }
          }
        }
      },
      {
        "id": "git-d22-b2-draft-pull-requests",
        "day": 22,
        "blockNumber": 2,
        "title": "Draft Pull Requests: Work-in-Progress Transparency Without Triggering Review Alerts",
        "conceptBudget": {
          "primaryConcept": "Draft PR Invariant",
          "supportingTerms": [
            "Draft PR (`Draft`: Prevents accidental merging and signals to the team that code is still in active development while allowing automated CI testing to run)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d22-b1-pr-metadata-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Draft PR States",
            "codeSnippet": "// 1. Create Draft PR -> CI runs tests, notifications to reviewers are suppressed\n// 2. Polish code & squash commits\n// 3. Click \"Ready for review\" -> Notifies designated reviewers!",
            "lineNotes": {
              "1": "Draft state.",
              "2": "Refinement.",
              "3": "Promotion to active review."
            }
          },
          {
            "type": "runnable_code",
            "filename": "draft_pr_demo.js",
            "initialCode": "function getDraftPrBenefit() {\n  return 'DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI';\n}\n\nconsole.log(getDraftPrBenefit());",
            "expectedOutput": "DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What primary operational safeguard is provided by GitHub Draft Pull Requests?",
          "expectedStringOutput": "DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI",
          "acceptableAnswers": [
            "DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI",
            "Prevents accidental merging",
            "Prevents merging while running CI"
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE",
          "diagnosisMap": {
            "BLOCKS_CI": {
              "misconceptionId": "MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE",
              "errorExplanation": "CI still runs on draft PRs: DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI.",
              "recoveryPath": {
                "simplerExplanation": "Matches DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI.",
                "guidedFixPrompt": "Type DRAFT_PRS_PREVENT_ACCIDENTAL_MERGING_WHILE_RUNNING_AUTOMATED_CI"
              }
            }
          }
        }
      },
      {
        "id": "git-d22-b3-forking-vs-branching-models",
        "day": 22,
        "blockNumber": 3,
        "title": "Collaboration Models: Fork & Pull (Open Source) vs Shared Repository (Internal Teams)",
        "conceptBudget": {
          "primaryConcept": "Fork vs Branch Invariant",
          "supportingTerms": [
            "Fork & Pull (Contributors clone an independent copy of repo under their account without write access)",
            "Shared Repo (Team members push branches directly to company repo)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d22-b2-draft-pull-requests",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "collab_models_demo.js",
            "initialCode": "function getOpenSourceModel() {\n  return 'FORK_AND_PULL_MODEL';\n}\n\nconsole.log(getOpenSourceModel());",
            "expectedOutput": "FORK_AND_PULL_MODEL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What collaboration model is standard for open-source GitHub projects where contributors lack direct write permissions?",
          "expectedStringOutput": "FORK_AND_PULL_MODEL",
          "acceptableAnswers": [
            "FORK_AND_PULL_MODEL",
            "Fork and pull",
            "Forking model"
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE",
          "diagnosisMap": {
            "SHARED": {
              "misconceptionId": "MC_GIT_GITHUB_PULL_REQUESTS_PR_LIFECYCLE",
              "errorExplanation": "Shared branch requires write permissions. Open source uses FORK_AND_PULL_MODEL.",
              "recoveryPath": {
                "simplerExplanation": "Matches FORK_AND_PULL_MODEL.",
                "guidedFixPrompt": "Type FORK_AND_PULL_MODEL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Code Review Best Practices: Reviewing Diffs, Inline Comments & LGTM Approvals",
    "overviewMetaphor": "Code Review Is Co-Pilot Flight Verification Before Takeoff: The reviewer scans instrument gauges (unified diffs), points out minor cabin noise (`nit: rename var`), and stamps the flight manifest with 'LGTM' (Looks Good To Me) only when all safety checks are certified.",
    "blocks": [
      {
        "id": "git-d23-b1-code-review-verdict-evaluator",
        "day": 23,
        "blockNumber": 1,
        "title": "Review Verdicts: Evaluating `'APPROVE'` (LGTM) vs `'REQUEST_CHANGES'`",
        "conceptBudget": {
          "primaryConcept": "GitHub Code Review Verdict Evaluator",
          "supportingTerms": [
            "Verdict (`'APPROVE'`)",
            "Approved (`true`)",
            "Total Comments ($1$ nitpick)",
            "Status: Pull Request Approved LGTM Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d22-b1-pr-metadata-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Code Review Verdict Decision Ledger",
              "boxes": [
                {
                  "label": "Review Comments",
                  "value": "[{ isNitpick: true, text: 'nit: rename variable' }]",
                  "varType": "Comments",
                  "isUpdated": false
                },
                {
                  "label": "Blocking Bugs Found",
                  "value": "false (No architectural or security blockers)",
                  "varType": "Blockers",
                  "isUpdated": false
                },
                {
                  "label": "Verdict Outcome",
                  "value": "Verdict: APPROVE | Approved: true (PULL REQUEST APPROVED LGTM NOMINAL!)",
                  "varType": "Verdict",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "review_verdict_demo.js",
            "initialCode": "function evaluateReview(comments, hasBlockers) {\n  if (hasBlockers) return { verdict: 'REQUEST_CHANGES', isApproved: false };\n  const isApproved = comments.every(c => c.isNitpick);\n  return {\n    verdict: isApproved ? 'APPROVE' : 'COMMENT',\n    isApproved,\n    status: isApproved ? 'PULL_REQUEST_APPROVED_LGTM_NOMINAL' : 'REVIEW_COMMENTS_SUBMITTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateReview([{ isNitpick: true, text: 'nit: rename var' }], false)));",
            "expectedOutput": "{\"verdict\":\"APPROVE\",\"isApproved\":true,\"status\":\"PULL_REQUEST_APPROVED_LGTM_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What review verdict is awarded when comments consist exclusively of non-blocking nitpicks?",
          "expectedStringOutput": "APPROVE",
          "acceptableAnswers": [
            "APPROVE",
            "verdict\":\"APPROVE\"",
            "LGTM",
            "Approve"
          ],
          "primaryMisconceptionId": "MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM",
          "diagnosisMap": {
            "REQUEST_CHANGES": {
              "misconceptionId": "MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM",
              "errorExplanation": "Nitpicks do not block approval. Verdict is APPROVE.",
              "recoveryPath": {
                "simplerExplanation": "Verdict is APPROVE.",
                "guidedFixPrompt": "Type APPROVE"
              }
            }
          }
        }
      },
      {
        "id": "git-d23-b2-github-suggested-changes-syntax",
        "day": 23,
        "blockNumber": 2,
        "title": "Suggested Changes: Proposing Direct Inline Code Replacements (`suggestion`)",
        "conceptBudget": {
          "primaryConcept": "Suggested Changes Invariant",
          "supportingTerms": [
            "`suggestion` markdown blocks (Allows reviewers to write direct replacement code snippets that the PR author can apply with a single click button on GitHub)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d23-b1-code-review-verdict-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Suggested Change Markdown Format",
            "codeSnippet": "// In a GitHub PR inline comment:\n// ```suggestion\n// const maxRetries = 3;\n// ```\n// -> Author clicks \"Commit suggestion\" to apply immediately!",
            "lineNotes": {
              "1": "GitHub comment.",
              "2": "Opening suggestion fence.",
              "3": "Proposed replacement code.",
              "4": "Closing fence.",
              "5": "Instant apply."
            }
          },
          {
            "type": "runnable_code",
            "filename": "suggested_changes_demo.js",
            "initialCode": "function getSuggestedChangesFence() {\n  return '```suggestion';\n}\n\nconsole.log(getSuggestedChangesFence());",
            "expectedOutput": "```suggestion",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What markdown fence tag activates GitHub's interactive 1-click suggested change feature?",
          "expectedStringOutput": "```suggestion",
          "acceptableAnswers": [
            "```suggestion",
            "suggestion",
            "```suggestion```"
          ],
          "primaryMisconceptionId": "MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM",
          "diagnosisMap": {
            "```diff": {
              "misconceptionId": "MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM",
              "errorExplanation": "diff provides syntax coloring. Interactive 1-click suggestions require ```suggestion.",
              "recoveryPath": {
                "simplerExplanation": "Type ```suggestion.",
                "guidedFixPrompt": "Type ```suggestion"
              }
            }
          }
        }
      },
      {
        "id": "git-d23-b3-lgtm-acronym-meaning",
        "day": 23,
        "blockNumber": 3,
        "title": "Engineering Acronym: LGTM (Looks Good To Me)",
        "conceptBudget": {
          "primaryConcept": "LGTM Invariant",
          "supportingTerms": [
            "LGTM (`Looks Good To Me`: The universal tech industry shorthand for approving a code review)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d23-b2-github-suggested-changes-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lgtm_demo.js",
            "initialCode": "function getLgtm() {\n  return 'LGTM';\n}\n\nconsole.log(getLgtm());",
            "expectedOutput": "LGTM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 4-letter acronym is universally used across software engineering teams to indicate PR approval?",
          "expectedStringOutput": "LGTM",
          "acceptableAnswers": [
            "LGTM",
            "lgtm",
            "'LGTM'"
          ],
          "primaryMisconceptionId": "MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM",
          "diagnosisMap": {
            "WIP": {
              "misconceptionId": "MC_GIT_CODE_REVIEW_INLINE_COMMENTS_LGTM",
              "errorExplanation": "WIP is Work In Progress. Approval shorthand is LGTM.",
              "recoveryPath": {
                "simplerExplanation": "Type LGTM.",
                "guidedFixPrompt": "Type LGTM"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "GitHub Branch Protection Rules: Required CI Status Checks & Protected `main`",
    "overviewMetaphor": "Branch Protection Rules Are Bank Vault Laser Grids: No single person—not even the project manager—can walk into the vault and change production `main` directly (`git push --force` is blocked); the laser grid only opens when 1 approving human key turns (`minApprovalsRequired: 1`) AND the automated security robot passes (`ciPassed: true`).",
    "blocks": [
      {
        "id": "git-d24-b1-branch-protection-gatekeeper",
        "day": 24,
        "blockNumber": 1,
        "title": "Branch Protection: Approvals $\\ge 1$ & CI Passed $\\implies$ Merge Allowed",
        "conceptBudget": {
          "primaryConcept": "GitHub Branch Protection Rule Gatekeeper & Merge Auditor",
          "supportingTerms": [
            "Approvals Received ($2$)",
            "Min Approvals ($1$)",
            "CI Passing (`true`)",
            "Merge Eligible (`true`)",
            "Status: Branch Protection Passed Merge Permitted Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d23-b1-code-review-verdict-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Branch Protection Rule Gatekeeper Ledger",
              "boxes": [
                {
                  "label": "Human Review Gate",
                  "value": "Approvals: 2 >= Min Required: 1 -> Review Gate PASSED",
                  "varType": "Human Gate",
                  "isUpdated": false
                },
                {
                  "label": "Automated CI Gate",
                  "value": "GitHub Actions Tests -> PASSING (All test suites green)",
                  "varType": "CI Gate",
                  "isUpdated": false
                },
                {
                  "label": "Merge Permission",
                  "value": "Merge Allowed: true (BRANCH PROTECTION PASSED MERGE PERMITTED NOMINAL!)",
                  "varType": "Permission",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "branch_protection_demo.js",
            "initialCode": "function checkMerge(approvals, minReq, ciOk, isProtected) {\n  const ok = approvals >= minReq && ciOk;\n  return {\n    mergeAllowed: ok,\n    status: ok ? 'BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL' : 'MERGE_BLOCKED'\n  };\n}\n\nconsole.log(JSON.stringify(checkMerge(2, 1, true, true)));",
            "expectedOutput": "{\"mergeAllowed\":true,\"status\":\"BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a Pull Request meets both human review and automated CI branch protection criteria?",
          "expectedStringOutput": "BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL",
          "acceptableAnswers": [
            "BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL",
            "status\":\"BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS",
          "diagnosisMap": {
            "MERGE_BLOCKED": {
              "misconceptionId": "MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS",
              "errorExplanation": "With 2 approvals and CI passing, the status is BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL.",
                "guidedFixPrompt": "Type BRANCH_PROTECTION_PASSED_MERGE_PERMITTED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "git-d24-b2-dismiss-stale-pull-request-approvals",
        "day": 24,
        "blockNumber": 2,
        "title": "Dismiss Stale Approvals: Invalidating Old Reviews When New Code Is Pushed",
        "conceptBudget": {
          "primaryConcept": "Dismiss Stale Approvals Invariant",
          "supportingTerms": [
            "Dismiss Stale Approvals (A critical branch protection rule that automatically resets existing PR approvals whenever new commits are pushed, preventing unreviewed changes from slipping into production)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d24-b1-branch-protection-gatekeeper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Security Rule Rationale",
            "codeSnippet": "// 1. Reviewer approves PR based on Commit A\n// 2. Author secretly pushes malicious/buggy Commit B\n// 3. WITH DISMISS STALE APPROVALS: Approval is revoked immediately -> Requires NEW review!",
            "lineNotes": {
              "1": "Initial approval.",
              "2": "New commit added.",
              "3": "Security revocation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "stale_approvals_demo.js",
            "initialCode": "function getDismissStaleRuleEffect() {\n  return 'AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED';\n}\n\nconsole.log(getDismissStaleRuleEffect());",
            "expectedOutput": "AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the 'Dismiss stale pull request approvals when new commits are pushed' protection rule enforce?",
          "expectedStringOutput": "AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED",
          "acceptableAnswers": [
            "AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED",
            "Revokes approvals on new commits",
            "Resets approvals"
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS",
          "diagnosisMap": {
            "BLOCKS_PUSH": {
              "misconceptionId": "MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS",
              "errorExplanation": "It allows pushing but revokes approval: AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED.",
                "guidedFixPrompt": "Type AUTOMATICALLY_REVOKES_APPROVALS_WHEN_NEW_COMMITS_ARE_PUSHED"
              }
            }
          }
        }
      },
      {
        "id": "git-d24-b3-blocking-force-pushes-to-protected-branches",
        "day": 24,
        "blockNumber": 3,
        "title": "Blocking Force Pushes: Protecting Production History Against `--force`",
        "conceptBudget": {
          "primaryConcept": "Block Force Push Invariant",
          "supportingTerms": [
            "Block Force Pushes (Ensures developers cannot overwrite or delete public commit history on `main` via `git push --force`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d24-b2-dismiss-stale-pull-request-approvals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "block_force_demo.js",
            "initialCode": "function getProtectedBranchRule() {\n  return 'BLOCK_FORCE_PUSHES_AND_DELETIONS';\n}\n\nconsole.log(getProtectedBranchRule());",
            "expectedOutput": "BLOCK_FORCE_PUSHES_AND_DELETIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What destructive Git operation is blocked by default on GitHub protected branches?",
          "expectedStringOutput": "BLOCK_FORCE_PUSHES_AND_DELETIONS",
          "acceptableAnswers": [
            "BLOCK_FORCE_PUSHES_AND_DELETIONS",
            "Force pushes and deletions",
            "Force push"
          ],
          "primaryMisconceptionId": "MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS",
          "diagnosisMap": {
            "MERGES": {
              "misconceptionId": "MC_GIT_BRANCH_PROTECTION_RULES_CI_STATUS",
              "errorExplanation": "Merges are allowed through PRs. Destructive force pushes are blocked: BLOCK_FORCE_PUSHES_AND_DELETIONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLOCK_FORCE_PUSHES_AND_DELETIONS.",
                "guidedFixPrompt": "Type BLOCK_FORCE_PUSHES_AND_DELETIONS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Git Workflows & Branching Strategies: Trunk-Based Development vs GitFlow",
    "overviewMetaphor": "Trunk-Based vs GitFlow Is High-Speed Bullet Trains vs Traditional Freight Rail: Trunk-Based development runs short, frequent trains every hour straight into the central station (`main`), using track switches (feature flags) to safely toggle new cargo; GitFlow builds separate side tracks (`develop`, `release/*`, `hotfix/*`) for heavy cargo departing once a month.",
    "blocks": [
      {
        "id": "git-d25-b1-workflow-strategy-matcher",
        "day": 25,
        "blockNumber": 1,
        "title": "Workflow Matching: Continuous Delivery $\\to$ `'TRUNK_BASED_DEVELOPMENT'`",
        "conceptBudget": {
          "primaryConcept": "Team Workflow Strategy Matcher",
          "supportingTerms": [
            "Deployment Frequency (`'CONTINUOUS_DEPLOYMENT_DAILY'`)",
            "Strategy (`'TRUNK_BASED_DEVELOPMENT'`)",
            "Branch Lifespan ($24$ hours)",
            "Status: High Velocity Trunk Based Matched"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d24-b1-branch-protection-gatekeeper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Branching Strategy Architecture Ledger",
              "boxes": [
                {
                  "label": "Trunk-Based Development",
                  "value": "Short-lived branches (<24 hrs) | Direct merge to main | Feature Flags -> HIGH VELOCITY CI/CD",
                  "varType": "Trunk",
                  "isUpdated": false
                },
                {
                  "label": "GitFlow Architecture",
                  "value": "Long-lived develop & release branches | Strict version gateways -> SCHEDULED RELEASES",
                  "varType": "GitFlow",
                  "isUpdated": false
                },
                {
                  "label": "Matched Strategy",
                  "value": "TRUNK_BASED_DEVELOPMENT (MATCHED NOMINAL!)",
                  "varType": "Strategy",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "workflow_matcher_demo.js",
            "initialCode": "function matchWorkflow(freq, flags) {\n  if (freq === 'CONTINUOUS_DEPLOYMENT_DAILY' || flags) {\n    return { strategy: 'TRUNK_BASED_DEVELOPMENT', maxHours: 24, status: 'HIGH_VELOCITY_TRUNK_BASED_MATCHED' };\n  }\n  return { strategy: 'GIT_FLOW', maxHours: 168 };\n}\n\nconsole.log(JSON.stringify(matchWorkflow('CONTINUOUS_DEPLOYMENT_DAILY', true)));",
            "expectedOutput": "{\"strategy\":\"TRUNK_BASED_DEVELOPMENT\",\"maxHours\":24,\"status\":\"HIGH_VELOCITY_TRUNK_BASED_MATCHED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Git branching strategy is recommended for high-velocity teams practicing continuous daily deployment with feature flags?",
          "expectedStringOutput": "TRUNK_BASED_DEVELOPMENT",
          "acceptableAnswers": [
            "TRUNK_BASED_DEVELOPMENT",
            "strategy\":\"TRUNK_BASED_DEVELOPMENT\"",
            "Trunk-based development",
            "Trunk based"
          ],
          "primaryMisconceptionId": "MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW",
          "diagnosisMap": {
            "GIT_FLOW": {
              "misconceptionId": "MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW",
              "errorExplanation": "GitFlow is designed for scheduled releases. High-velocity CI/CD uses TRUNK_BASED_DEVELOPMENT.",
              "recoveryPath": {
                "simplerExplanation": "Strategy is TRUNK_BASED_DEVELOPMENT.",
                "guidedFixPrompt": "Type TRUNK_BASED_DEVELOPMENT"
              }
            }
          }
        }
      },
      {
        "id": "git-d25-b2-feature-flags-in-trunk-based-dev",
        "day": 25,
        "blockNumber": 2,
        "title": "Decoupling Deployment from Release: Feature Flags in Trunk-Based Development",
        "conceptBudget": {
          "primaryConcept": "Feature Flags Invariant",
          "supportingTerms": [
            "Feature Flags (`if (flags.isEnabled('new-checkout'))`: Allows merging incomplete features into production `main` daily without exposing unreleased UI to end users)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d25-b1-workflow-strategy-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Feature Flag Pattern",
            "codeSnippet": "// Merged into production main, but disabled by default:\n// if (featureFlags.isOn('NEW_PAYMENT_FLOW')) {\n//   renderStripeV3Checkout();\n// } else {\n//   renderLegacyCheckout();\n// }",
            "lineNotes": {
              "1": "Production code path.",
              "2": "Flag condition.",
              "3": "Experimental feature.",
              "4": "Fallback.",
              "5": "Safe default."
            }
          },
          {
            "type": "runnable_code",
            "filename": "feature_flags_demo.js",
            "initialCode": "function getFeatureFlagPurpose() {\n  return 'DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE';\n}\n\nconsole.log(getFeatureFlagPurpose());",
            "expectedOutput": "DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What major architectural capability is unlocked by implementing feature flags alongside trunk-based development?",
          "expectedStringOutput": "DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE",
          "acceptableAnswers": [
            "DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE",
            "Decouples deployment from release",
            "Deploy without releasing"
          ],
          "primaryMisconceptionId": "MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW",
          "diagnosisMap": {
            "SPEED": {
              "misconceptionId": "MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW",
              "errorExplanation": "Primary purpose is: DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE.",
              "recoveryPath": {
                "simplerExplanation": "Matches DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE.",
                "guidedFixPrompt": "Type DECOUPLES_CODE_DEPLOYMENT_FROM_USER_FEATURE_RELEASE"
              }
            }
          }
        }
      },
      {
        "id": "git-d25-b3-gitflow-branch-hierarchy",
        "day": 25,
        "blockNumber": 3,
        "title": "GitFlow Branches: `main`, `develop`, `feature/*`, `release/*`, and `hotfix/*`",
        "conceptBudget": {
          "primaryConcept": "GitFlow Branches Invariant",
          "supportingTerms": [
            "GitFlow Structure (`main` = production releases; `develop` = integration trunk; `feature/*` = new capabilities; `release/*` = pre-production staging; `hotfix/*` = urgent production patches)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d25-b2-feature-flags-in-trunk-based-dev",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gitflow_branches_demo.js",
            "initialCode": "function getGitFlowIntegrationBranch() {\n  return 'develop';\n}\n\nconsole.log(getGitFlowIntegrationBranch());",
            "expectedOutput": "develop",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In the traditional GitFlow branching model, what is the name of the primary day-to-day integration branch?",
          "expectedStringOutput": "develop",
          "acceptableAnswers": [
            "develop",
            "develop branch",
            "'develop'"
          ],
          "primaryMisconceptionId": "MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW",
          "diagnosisMap": {
            "main": {
              "misconceptionId": "MC_GIT_WORKFLOWS_TRUNK_BASED_GITFLOW",
              "errorExplanation": "In GitFlow, main is reserved exclusively for production releases. Daily integration occurs in develop.",
              "recoveryPath": {
                "simplerExplanation": "Branch is develop.",
                "guidedFixPrompt": "Type develop"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "GitHub Issues, Milestones & Project Boards: Agile Kanban Workflow Tracking",
    "overviewMetaphor": "GitHub Project Boards Are an Air Traffic Control Flight Strip Bay: Issues are incoming aircraft flights; grouping them into Milestones sets the landing window target ($Completion = 50.0\\%$); and dragging issue cards across Kanban columns (Todo $\\to$ In Progress $\\to$ Done) updates the entire team's flight radar in real time.",
    "blocks": [
      {
        "id": "git-d26-b1-milestone-burndown-calculator",
        "day": 26,
        "blockNumber": 1,
        "title": "Sprint Milestones: Calculating $50.0\\%$ Completion ($5$ Closed / $10$ Total)",
        "conceptBudget": {
          "primaryConcept": "GitHub Issue Template & Milestone Burndown Calculator",
          "supportingTerms": [
            "Closed Issues ($5$)",
            "Open Issues ($5$)",
            "Total Issues ($10$)",
            "Completion Percentage ($50.0\\%$)",
            "Status: Milestone In Progress"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d25-b1-workflow-strategy-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Agile Milestone Burndown Ledger",
              "boxes": [
                {
                  "label": "Closed Issues",
                  "value": "5 completed sprint tasks",
                  "varType": "Closed",
                  "isUpdated": false
                },
                {
                  "label": "Open Issues",
                  "value": "5 remaining sprint tasks",
                  "varType": "Open",
                  "isUpdated": false
                },
                {
                  "label": "Progress Calculation",
                  "value": "(5 / 10) * 100 = 50.0% Completion (MILESTONE IN PROGRESS NOMINAL!)",
                  "varType": "Percent",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "milestone_calc_demo.js",
            "initialCode": "function calcMilestone(closed, open) {\n  const tot = closed + open;\n  const pct = Number(((closed / tot) * 100).toFixed(1));\n  return {\n    total: tot,\n    completionPct: pct,\n    isComplete: open === 0,\n    status: 'MILESTONE_IN_PROGRESS'\n  };\n}\n\nconsole.log(JSON.stringify(calcMilestone(5, 5)));",
            "expectedOutput": "{\"total\":10,\"completionPct\":50,\"isComplete\":false,\"status\":\"MILESTONE_IN_PROGRESS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What completion percentage number is calculated for a milestone with 5 closed and 5 open issues?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50",
            "50.0",
            "completionPct\":50",
            "50%"
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS",
              "errorExplanation": "5 out of 10 is 50%.",
              "recoveryPath": {
                "simplerExplanation": "Percentage is 50.",
                "guidedFixPrompt": "Type 50"
              }
            }
          }
        }
      },
      {
        "id": "git-d26-b2-github-issue-templates",
        "day": 26,
        "blockNumber": 2,
        "title": "Standardizing Bug Reports: Issue Templates (`.github/ISSUE_TEMPLATE`)",
        "conceptBudget": {
          "primaryConcept": "Issue Templates Invariant",
          "supportingTerms": [
            "Issue Form (`.github/ISSUE_TEMPLATE/bug_report.yml`: Enforces structured bug reproduction steps, expected vs actual behavior, and environment logs from users)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d26-b1-milestone-burndown-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Issue Template Directory Structure",
            "codeSnippet": "// .github/\n// └── ISSUE_TEMPLATE/\n//     ├── bug_report.yml\n//     └── feature_request.yml",
            "lineNotes": {
              "1": "GitHub metadata directory.",
              "2": "Issue templates folder.",
              "3": "Structured bug YAML form.",
              "4": "Feature request form."
            }
          },
          {
            "type": "runnable_code",
            "filename": "issue_template_demo.js",
            "initialCode": "function getIssueTemplateDirectory() {\n  return '.github/ISSUE_TEMPLATE';\n}\n\nconsole.log(getIssueTemplateDirectory());",
            "expectedOutput": ".github/ISSUE_TEMPLATE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In what repository directory path does GitHub look for custom Issue Templates?",
          "expectedStringOutput": ".github/ISSUE_TEMPLATE",
          "acceptableAnswers": [
            ".github/ISSUE_TEMPLATE",
            ".github/ISSUE_TEMPLATE/",
            "ISSUE_TEMPLATE"
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS",
          "diagnosisMap": {
            ".github/workflows": {
              "misconceptionId": "MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS",
              "errorExplanation": "workflows is for GitHub Actions. Issue templates live in .github/ISSUE_TEMPLATE.",
              "recoveryPath": {
                "simplerExplanation": "Type .github/ISSUE_TEMPLATE.",
                "guidedFixPrompt": "Type .github/ISSUE_TEMPLATE"
              }
            }
          }
        }
      },
      {
        "id": "git-d26-b3-automated-kanban-project-boards",
        "day": 26,
        "blockNumber": 3,
        "title": "Automated Kanban Workflows: Auto-Closing Cards on PR Merge",
        "conceptBudget": {
          "primaryConcept": "Project Automation Invariant",
          "supportingTerms": [
            "Automated Kanban (`Auto-move`: Moving cards from 'In Progress' to 'Done' automatically when associated PRs merge into `main`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d26-b2-github-issue-templates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "kanban_demo.js",
            "initialCode": "function getAutoMoveTargetColumn() {\n  return 'Done';\n}\n\nconsole.log(getAutoMoveTargetColumn());",
            "expectedOutput": "Done",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What destination column do merged Pull Request cards automatically move to on GitHub Projects boards?",
          "expectedStringOutput": "Done",
          "acceptableAnswers": [
            "Done",
            "Done column",
            "'Done'"
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS",
          "diagnosisMap": {
            "In Progress": {
              "misconceptionId": "MC_GIT_GITHUB_ISSUES_MILESTONES_PROJECTS",
              "errorExplanation": "In Progress is for open PRs. Merging moves cards to Done.",
              "recoveryPath": {
                "simplerExplanation": "Column is Done.",
                "guidedFixPrompt": "Type Done"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "GitHub Actions CI/CD Basics: Automated Workflow Pipelines (`.github/workflows`)",
    "overviewMetaphor": "GitHub Actions Is an Automated Robotic Quality Testing Assembly Line: Every time you push a commit or open a PR (`on: [push, pull_request]`), GitHub spins up a clean cloud virtual machine (`runs-on: ubuntu-latest`), clones your code (`actions/checkout@v4`), and runs your automated test suites (`npm test`) before allowing code to deploy.",
    "blocks": [
      {
        "id": "git-d27-b1-github-actions-yaml-validator",
        "day": 27,
        "blockNumber": 1,
        "title": "CI/CD Workflows: Validating `.github/workflows/ci.yml` YAML Structure",
        "conceptBudget": {
          "primaryConcept": "GitHub Actions Workflow YAML Structure Validator",
          "supportingTerms": [
            "Workflow Name (`'name: CI'`)",
            "Triggers (`'on: [push, pull_request]'`)",
            "Jobs Definition",
            "Checkout Action (`'actions/checkout@v4'`)",
            "Status: GitHub Actions Workflow Valid Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d26-b1-milestone-burndown-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GitHub Actions CI Pipeline Ledger",
              "boxes": [
                {
                  "label": "Trigger Event",
                  "value": "on: [push, pull_request] -> Fires on code upload",
                  "varType": "Trigger",
                  "isUpdated": false
                },
                {
                  "label": "Virtual Runner",
                  "value": "runs-on: ubuntu-latest (Clean ephemeral container)",
                  "varType": "Runner",
                  "isUpdated": false
                },
                {
                  "label": "Checkout & Test",
                  "value": "uses: actions/checkout@v4 | run: npm test (WORKFLOW VALID NOMINAL!)",
                  "varType": "Steps",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ci_workflow_demo.js",
            "initialCode": "function validateWorkflow(yaml) {\n  const ok = yaml.includes('name:') && yaml.includes('on:') && yaml.includes('jobs:') && yaml.includes('actions/checkout');\n  return {\n    isValid: ok,\n    status: ok ? 'GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL' : 'DEFECT'\n  };\n}\n\nconst yaml = 'name: CI\\non: [push, pull_request]\\njobs:\\n  test:\\n    runs-on: ubuntu-latest\\n    steps:\\n      - uses: actions/checkout@v4\\n      - run: npm test';\nconsole.log(JSON.stringify(validateWorkflow(yaml)));",
            "expectedOutput": "{\"isValid\":true,\"status\":\"GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms valid configuration of a GitHub Actions CI workflow YAML file?",
          "expectedStringOutput": "GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL",
          "acceptableAnswers": [
            "GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL",
            "status\":\"GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS",
              "errorExplanation": "Contains name, on, jobs, checkout: GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL.",
                "guidedFixPrompt": "Type GITHUB_ACTIONS_WORKFLOW_VALID_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "git-d27-b2-actions-checkout-essential-step",
        "day": 27,
        "blockNumber": 2,
        "title": "The Essential Step: `actions/checkout@v4` Clones Repo onto the Cloud Runner",
        "conceptBudget": {
          "primaryConcept": "actions/checkout Invariant",
          "supportingTerms": [
            "`actions/checkout@v4` (A runner begins completely empty; without `uses: actions/checkout@v4`, your repository files do not exist on the runner and subsequent build scripts fail immediately)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d27-b1-github-actions-yaml-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standard CI Job Anatomy",
            "codeSnippet": "name: Node.js CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4  # CRITICAL: Clones your repository files into the runner!\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n      - run: npm ci\n      - run: npm test",
            "lineNotes": {
              "1": "Pipeline name.",
              "2": "Triggers.",
              "3": "Jobs array.",
              "4": "Job definition.",
              "5": "OS runner.",
              "6": "Steps array.",
              "7": "Repository checkout.",
              "8": "Runtime setup.",
              "9": "Version config.",
              "10": "Version parameter.",
              "11": "Clean install.",
              "12": "Test execution."
            }
          },
          {
            "type": "runnable_code",
            "filename": "checkout_action_demo.js",
            "initialCode": "function getStandardCheckoutAction() {\n  return 'actions/checkout@v4';\n}\n\nconsole.log(getStandardCheckoutAction());",
            "expectedOutput": "actions/checkout@v4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What official GitHub Action must be included in workflow steps to clone repository code onto the virtual runner?",
          "expectedStringOutput": "actions/checkout@v4",
          "acceptableAnswers": [
            "actions/checkout@v4",
            "actions/checkout",
            "checkout@v4"
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS",
          "diagnosisMap": {
            "setup-node": {
              "misconceptionId": "MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS",
              "errorExplanation": "setup-node configures Node. Cloning the code requires actions/checkout@v4.",
              "recoveryPath": {
                "simplerExplanation": "Type actions/checkout@v4.",
                "guidedFixPrompt": "Type actions/checkout@v4"
              }
            }
          }
        }
      },
      {
        "id": "git-d27-b3-workflow-file-directory-location",
        "day": 27,
        "blockNumber": 3,
        "title": "Workflow Directory Path: `.github/workflows/*.yml`",
        "conceptBudget": {
          "primaryConcept": "Workflow Directory Invariant",
          "supportingTerms": [
            "`.github/workflows` (GitHub exclusively parses YAML workflow automation definitions located within this specific directory)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d27-b2-actions-checkout-essential-step",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "workflow_dir_demo.js",
            "initialCode": "function getWorkflowDir() {\n  return '.github/workflows';\n}\n\nconsole.log(getWorkflowDir());",
            "expectedOutput": ".github/workflows",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In what repository directory path must GitHub Actions CI/CD YAML files be saved?",
          "expectedStringOutput": ".github/workflows",
          "acceptableAnswers": [
            ".github/workflows",
            ".github/workflows/",
            "workflows"
          ],
          "primaryMisconceptionId": "MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS",
          "diagnosisMap": {
            ".github": {
              "misconceptionId": "MC_GIT_GITHUB_ACTIONS_CI_CD_WORKFLOWS",
              "errorExplanation": "Workflows must be placed inside the nested .github/workflows directory.",
              "recoveryPath": {
                "simplerExplanation": "Type .github/workflows.",
                "guidedFixPrompt": "Type .github/workflows"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Git Submodules & Monorepo Multi-Package Management: `git submodule` Mechanics",
    "overviewMetaphor": "Git Submodules Are Nested Russian Matryoshka Dolls: Your main application repository contains a locked reference pointer (`lib/shared` at commit `c789abc`) pointing to an entirely separate Git repository; cloning the parent doll with `git clone --recursive` unrolls all nested child repositories automatically.",
    "blocks": [
      {
        "id": "git-d28-b1-gitmodules-config-parser",
        "day": 28,
        "blockNumber": 1,
        "title": "Submodule Architecture: Parsing `.gitmodules` (`lib/shared` Pointer)",
        "conceptBudget": {
          "primaryConcept": "Git Submodule .gitmodules Config Parser & Pointer Validator",
          "supportingTerms": [
            "Submodule Path (`'lib/shared'`)",
            "Submodule URL (`'https://github.com/org/shared.git'`)",
            "Valid Submodule (`true`)",
            "Status: Gitmodules Parsed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d27-b1-github-actions-yaml-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Git Submodule Configuration Ledger",
              "boxes": [
                {
                  "label": "Submodule Root Config",
                  "value": ".gitmodules text file at repository root",
                  "varType": "Config",
                  "isUpdated": false
                },
                {
                  "label": "Relative Target Path",
                  "value": "path = lib/shared",
                  "varType": "Path",
                  "isUpdated": false
                },
                {
                  "label": "Remote Repository URL",
                  "value": "url = https://github.com/org/shared.git (GITMODULES PARSED NOMINAL!)",
                  "varType": "URL",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "submodule_demo.js",
            "initialCode": "function parseGitmodules(text) {\n  const p = text.match(/path\\s*=\\s*(\\S+)/);\n  const u = text.match(/url\\s*=\\s*(\\S+)/);\n  return {\n    path: p ? p[1] : null,\n    url: u ? u[1] : null,\n    isValid: !!(p && u),\n    status: 'GITMODULES_PARSED_NOMINAL'\n  };\n}\n\nconst text = '[submodule \"lib/shared\"]\\n\\tpath = lib/shared\\n\\turl = https://github.com/org/shared.git';\nconsole.log(JSON.stringify(parseGitmodules(text)));",
            "expectedOutput": "{\"path\":\"lib/shared\",\"url\":\"https://github.com/org/shared.git\",\"isValid\":true,\"status\":\"GITMODULES_PARSED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What relative submodule path is parsed from the `.gitmodules` configuration?",
          "expectedStringOutput": "lib/shared",
          "acceptableAnswers": [
            "lib/shared",
            "path\":\"lib/shared\"",
            "'lib/shared'"
          ],
          "primaryMisconceptionId": "MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT",
          "diagnosisMap": {
            "shared": {
              "misconceptionId": "MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT",
              "errorExplanation": "The path is lib/shared.",
              "recoveryPath": {
                "simplerExplanation": "Path is lib/shared.",
                "guidedFixPrompt": "Type lib/shared"
              }
            }
          }
        }
      },
      {
        "id": "git-d28-b2-git-clone-recursive-submodules",
        "day": 28,
        "blockNumber": 2,
        "title": "Cloning Submodules: `git clone --recursive <url>`",
        "conceptBudget": {
          "primaryConcept": "--recursive Clone Invariant",
          "supportingTerms": [
            "`--recursive` / `--recurse-submodules` (Instructs Git to initialize and fetch all nested submodules during repository cloning in a single command)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d28-b1-gitmodules-config-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Submodule Cloning Commands",
            "codeSnippet": "// 1. Modern single-step clone: git clone --recursive https://github.com/org/parent.git\n// 2. Cloned without flag? Initialize manually: git submodule update --init --recursive",
            "lineNotes": {
              "1": "Single-step recursive clone.",
              "2": "Post-clone manual initialization."
            }
          },
          {
            "type": "runnable_code",
            "filename": "clone_recursive_demo.js",
            "initialCode": "function getCloneRecursiveFlag() {\n  return '--recursive';\n}\n\nconsole.log(getCloneRecursiveFlag());",
            "expectedOutput": "--recursive",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What flag passed to `git clone` automatically downloads all nested submodule dependencies?",
          "expectedStringOutput": "--recursive",
          "acceptableAnswers": [
            "--recursive",
            "--recurse-submodules",
            "--recursive flag"
          ],
          "primaryMisconceptionId": "MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT",
          "diagnosisMap": {
            "--all": {
              "misconceptionId": "MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT",
              "errorExplanation": "Submodule cloning uses --recursive or --recurse-submodules.",
              "recoveryPath": {
                "simplerExplanation": "Type --recursive.",
                "guidedFixPrompt": "Type --recursive"
              }
            }
          }
        }
      },
      {
        "id": "git-d28-b3-monorepos-vs-polyrepos",
        "day": 28,
        "blockNumber": 3,
        "title": "Architecture Comparison: Monorepos (Single Unified Repo) vs Polyrepos",
        "conceptBudget": {
          "primaryConcept": "Monorepo vs Polyrepo Invariant",
          "supportingTerms": [
            "Monorepo (Houses multiple related services and packages within one repository, enabling atomic cross-service refactors without submodule pointer synchronization overhead)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d28-b2-git-clone-recursive-submodules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "monorepo_demo.js",
            "initialCode": "function getMonorepoBenefit() {\n  return 'ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT';\n}\n\nconsole.log(getMonorepoBenefit());",
            "expectedOutput": "ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What major development advantage is provided by Monorepo architectures over multi-repo submodules?",
          "expectedStringOutput": "ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT",
          "acceptableAnswers": [
            "ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT",
            "Atomic cross-package refactoring",
            "Atomic refactoring"
          ],
          "primaryMisconceptionId": "MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT",
          "diagnosisMap": {
            "SMALLER": {
              "misconceptionId": "MC_GIT_SUBMODULES_MONOREPO_MANAGEMENT",
              "errorExplanation": "Monorepos are larger but provide: ENBALES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT.",
                "guidedFixPrompt": "Type ENABLES_ATOMIC_CROSS_PACKAGE_REFACTORING_IN_A_SINGLE_COMMIT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Git Hooks & Automated Pre-Commit Linting: Husky, Lint-Staged & Commitlint",
    "overviewMetaphor": "Git Hooks Are Bouncers at a VIP Club Entrance: Before `git commit` allows your code inside the repository door, the `pre-commit` hook scans your staged code with ESLint and Prettier (`lint-staged`); if any linting errors or bad commit messages are detected, the hook returns exit code 1 and turns you away at the velvet rope!",
    "blocks": [
      {
        "id": "git-d29-b1-pre-commit-gatekeeper",
        "day": 29,
        "blockNumber": 1,
        "title": "Pre-Commit Gatekeeper: Linter Passed + TypeCheck Passed $\\implies$ Commit Allowed",
        "conceptBudget": {
          "primaryConcept": "Pre-Commit Hook Lint-Staged Execution Gatekeeper",
          "supportingTerms": [
            "Linter Passed (`true`)",
            "TypeCheck Passed (`true`)",
            "Message Valid (`true`)",
            "Commit Allowed (`true`)",
            "Status: Pre Commit Hook Passed Commit Allowed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d28-b1-gitmodules-config-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Pre-Commit Hook Quality Gate Ledger",
              "boxes": [
                {
                  "label": "ESLint Linter Check",
                  "value": "lint-staged -> PASSED (0 formatting or syntax errors)",
                  "varType": "Linter",
                  "isUpdated": false
                },
                {
                  "label": "TypeScript Typecheck",
                  "value": "tsc --noEmit -> PASSED (0 compiler type errors)",
                  "varType": "TypeScript",
                  "isUpdated": false
                },
                {
                  "label": "Commit Gate Verdict",
                  "value": "Commit Allowed: true (PRE COMMIT HOOK PASSED COMMIT ALLOWED NOMINAL!)",
                  "varType": "Verdict",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pre_commit_demo.js",
            "initialCode": "function evaluateHook(linter, tsc, msg) {\n  const ok = linter && tsc && msg;\n  return {\n    isCommitAllowed: ok,\n    status: ok ? 'PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL' : 'COMMIT_ABORTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateHook(true, true, true)));",
            "expectedOutput": "{\"isCommitAllowed\":true,\"status\":\"PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that client-side pre-commit linting and typecheck hooks passed successfully?",
          "expectedStringOutput": "PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL",
          "acceptableAnswers": [
            "PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL",
            "status\":\"PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY",
          "diagnosisMap": {
            "COMMIT_ABORTED": {
              "misconceptionId": "MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY",
              "errorExplanation": "All checks passing awards PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL.",
                "guidedFixPrompt": "Type PRE_COMMIT_HOOK_PASSED_COMMIT_ALLOWED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "git-d29-b2-lint-staged-lightning-fast-execution",
        "day": 29,
        "blockNumber": 2,
        "title": "High Performance Quality: `lint-staged` Running Only on Staged Diffs",
        "conceptBudget": {
          "primaryConcept": "lint-staged Invariant",
          "supportingTerms": [
            "`lint-staged` (Runs linters and formatters exclusively on files currently in `git status` staged index, executing in 200ms instead of 45 seconds across a 50,000 file codebase)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d29-b1-pre-commit-gatekeeper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "package.json lint-staged Config",
            "codeSnippet": "// \"lint-staged\": {\n//   \"*.{js,ts,tsx}\": [\n//     \"eslint --fix\",\n//     \"prettier --write\"\n//   ]\n// }",
            "lineNotes": {
              "1": "Config section.",
              "2": "Staged file pattern match.",
              "3": "Lint fix runner.",
              "4": "Prettier formatter runner.",
              "5": "Close."
            }
          },
          {
            "type": "runnable_code",
            "filename": "lint_staged_demo.js",
            "initialCode": "function getLintStagedOptimization() {\n  return 'RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME';\n}\n\nconsole.log(getLintStagedOptimization());",
            "expectedOutput": "RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is `lint-staged` preferred over running global repository lint scripts inside pre-commit hooks?",
          "expectedStringOutput": "RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME",
          "acceptableAnswers": [
            "RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME",
            "Runs only on staged files",
            "Faster execution on staged files"
          ],
          "primaryMisconceptionId": "MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY",
          "diagnosisMap": {
            "ALL": {
              "misconceptionId": "MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY",
              "errorExplanation": "lint-staged restricts execution to: RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME.",
              "recoveryPath": {
                "simplerExplanation": "Matches RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME.",
                "guidedFixPrompt": "Type RUNS_LINTERS_EXCLUSIVELY_ON_STAGED_FILES_SAVING_TIME"
              }
            }
          }
        }
      },
      {
        "id": "git-d29-b3-git-hook-location-path",
        "day": 29,
        "blockNumber": 3,
        "title": "Hook Directory: `.git/hooks/pre-commit` and `.husky`",
        "conceptBudget": {
          "primaryConcept": "Hook Path Invariant",
          "supportingTerms": [
            "`.git/hooks` (Native Git hook scripts directory; Husky copies version-controlled scripts from `.husky/` into `.git/hooks/` for team sharing)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d29-b2-lint-staged-lightning-fast-execution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hook_name_demo.js",
            "initialCode": "function getPreCommitHookFileName() {\n  return 'pre-commit';\n}\n\nconsole.log(getPreCommitHookFileName());",
            "expectedOutput": "pre-commit",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard file name for the Git client-side hook that executes before a commit snapshot is created?",
          "expectedStringOutput": "pre-commit",
          "acceptableAnswers": [
            "pre-commit",
            "pre-commit hook",
            "'pre-commit'"
          ],
          "primaryMisconceptionId": "MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY",
          "diagnosisMap": {
            "post-commit": {
              "misconceptionId": "MC_GIT_HOOKS_PRE_COMMIT_LINTING_HUSKY",
              "errorExplanation": "post-commit runs after. Pre-commit validation runs in pre-commit.",
              "recoveryPath": {
                "simplerExplanation": "Type pre-commit.",
                "guidedFixPrompt": "Type pre-commit"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Git, GitHub & Master Version Control Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete sovereign Git and GitHub master version control suite: 1. Core Object Storage & Commits (SHA-1 hashing, three-tree staging, and conventional commit parsing); 2. Branching & Conflict Resolution (3-way merge conflict resolution, stash stack management, and SemVer tagging); 3. Advanced History & Remotes (Linear rebasing, interactive squashing, cherry-picking, and SSH key authentication); 4. GitHub Collaboration & Governance (PR metadata linking, code review approvals, branch protection, and workflow matching); 5. Automation & Quality Gates (Milestone sprint tracking, GitHub Actions CI/CD workflows, submodules, and Husky pre-commit hooks).",
    "blocks": [
      {
        "id": "git-d30-b1-sovereign-git-master-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Sovereign Git & Master Version Control Suite Orchestrator",
        "conceptBudget": {
          "primaryConcept": "Sovereign Git & Master Version Control Suite Orchestrator",
          "supportingTerms": [
            "Git Foundations Module",
            "Branching & Conflicts Module",
            "Advanced History & Remotes Module",
            "GitHub Collaboration & Governance Module",
            "Automation & Quality Gates Module",
            "Status: Sovereign Git and Version Control Master Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d29-b1-pre-commit-gatekeeper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Day 30 Sovereign Git & Version Control Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Foundations & Three Trees: Blob/Tree/Commit SHA storage & conventional commits",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Branching & Merges: 3-way ORT merges, conflict resolution (PORT 3000), & stash stack",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Advanced Rebasing & Remotes: Linear squashing, cherry-picking, & ed25519 SSH sync",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "GitHub Collaboration: PR lifecycle (Closes #108), LGTM reviews, & branch protection",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "CI/CD Automation: GitHub Actions workflows, submodules, & Husky pre-commit hooks -> SOVEREIGN GIT MASTER CERTIFIED!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "git_capstone_demo.js",
            "initialCode": "function orchestrateGitMaster(f, b, a, c, q) {\n  const ok = f && b && a && c && q;\n  return {\n    foundationsModule: f,\n    branchingModule: b,\n    advancedModule: a,\n    collabModule: c,\n    automationModule: q,\n    sovereignGitCertified: ok,\n    status: ok ? 'SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(orchestrateGitMaster(true, true, true, true, true).status);",
            "expectedOutput": "SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms full Day 30 Sovereign Git & Version Control Master Certification?",
          "expectedStringOutput": "SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL",
            "status: SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE",
              "errorExplanation": "All 5 modules active awards SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "git-d30-b2-sovereign-git-master-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Platform-Wide Git & GitHub Quality Audit: 100/100 Score Benchmark",
        "conceptBudget": {
          "primaryConcept": "Platform Quality Audit Benchmark",
          "supportingTerms": [
            "Foundations Audit",
            "Collaboration Audit",
            "Automation Audit",
            "100/100 Quality Standard"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d30-b1-sovereign-git-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "git_final_audit.js",
            "initialCode": "function runFullGitAudit() {\n  return {\n    foundationsScore: '20/20',\n    branchingScore: '20/20',\n    advancedRebaseScore: '20/20',\n    collaborationScore: '20/20',\n    automationScore: '20/20',\n    finalScore: '100/100',\n    grade: 'SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(runFullGitAudit()));",
            "expectedOutput": "{\"foundationsScore\":\"20/20\",\"branchingScore\":\"20/20\",\"advancedRebaseScore\":\"20/20\",\"collaborationScore\":\"20/20\",\"automationScore\":\"20/20\",\"finalScore\":\"100/100\",\"grade\":\"SOVEREIGN_GIT_AND_VERSION_CONTROL_MASTER_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What final score string is awarded on the comprehensive 30-Day Git & Version Control platform audit?",
          "expectedStringOutput": "100/100",
          "acceptableAnswers": [
            "100/100",
            "finalScore\":\"100/100\"",
            "100 / 100",
            "100%"
          ],
          "primaryMisconceptionId": "MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE",
          "diagnosisMap": {
            "90/100": {
              "misconceptionId": "MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE",
              "errorExplanation": "All modules passing achieves 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Type 100/100.",
                "guidedFixPrompt": "Type 100/100"
              }
            }
          }
        }
      },
      {
        "id": "git-d30-b3-git-capstone-cert-seal",
        "day": 30,
        "blockNumber": 3,
        "title": "PinIT Sovereign Git & GitHub Master Professional Certification Seal",
        "conceptBudget": {
          "primaryConcept": "Sovereign Professional Certification Seal",
          "supportingTerms": [
            "Git Master Certified",
            "Enterprise Collaboration Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "git-d30-b2-sovereign-git-master-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "git_cert_seal.js",
            "initialCode": "console.log('🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]');",
            "expectedOutput": "🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What final certification seal string confirms sovereign graduation from the Git & Version Control curriculum?",
          "expectedStringOutput": "🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]",
          "acceptableAnswers": [
            "🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]",
            "SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]"
          ],
          "primaryMisconceptionId": "MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_GIT_CAPSTONE_SOVEREIGN_VERSION_CONTROL_SUITE",
              "errorExplanation": "Matches final capstone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 PIN-IT CAREER OS: SOVEREIGN GIT, GITHUB & MASTER VERSION CONTROL SUITE CERTIFIED [100/100]"
              }
            }
          }
        }
      }
    ]
  }
];
