import { DayLessonPlan } from '../types/lessonEngine';

export const DEVOPS_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "DevOps Culture, CI/CD & The 12-Factor App",
    "overviewMetaphor": "DevOps is an automated assembly line in an automotive plant: instead of engineers building a car by hand for 6 months and discovering on delivery day that the engine doesn't fit the chassis (old waterfall releases), every single bolt and wire is continuously checked by laser measurement robots (Continuous Integration); every approved chassis is automatically rolled onto the test track daily (Continuous Delivery) with zero human panic.",
    "blocks": [
      {
        "id": "devops-d1-b1-twelve-factor-config-env",
        "day": 1,
        "blockNumber": 1,
        "title": "The 12-Factor App: Factor III (Config in the Environment)",
        "conceptBudget": {
          "primaryConcept": "12-Factor Environment Configuration",
          "supportingTerms": [
            "Factor III (Store config in the environment)",
            "Zero hardcoded database URIs or API keys in code",
            "Strict environment parity (Dev, Staging, Prod)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Hardcoded Config vs 12-Factor Env Var Diff",
              "brokenCode": "// ❌ INSECURE ANTI-PATTERN: Hardcoded environment config in source code\nconst dbUrl = 'postgres://prod_admin:Secret9981@db.internal:5432/finance';\n// Code cannot run in Dev/Staging without modifying source code; credentials leak in Git!",
              "fixedCode": "// ✅ 12-FACTOR BEST PRACTICE: Read strictly from process environment\nconst dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/dev_db';\n// Same identical Docker container image runs in Dev, Staging, and Prod without rebuild!",
              "errorLine": 2,
              "errorReason": "Hardcoding config couples the build artifact to a single environment and leaks secrets.",
              "fixExplanation": "Inject environment variables dynamically at runtime."
            }
          },
          {
            "type": "runnable_code",
            "filename": "twelve_factor_demo.js",
            "initialCode": "function getDatabaseUri(env = process.env) {\n  if (!env.DATABASE_URL) {\n    return { uri: 'postgres://localhost:5432/dev', mode: 'DEFAULT_LOCAL_DEV' };\n  }\n  return { uri: env.DATABASE_URL, mode: 'INJECTED_FROM_ENV' };\n}\n\nconsole.log('Local Dev Boot:', JSON.stringify(getDatabaseUri({})));\nconsole.log('Production Boot:', JSON.stringify(getDatabaseUri({ DATABASE_URL: 'postgres://prod-db:5432/live' })));",
            "expectedOutput": "Local Dev Boot: {\"uri\":\"postgres://localhost:5432/dev\",\"mode\":\"DEFAULT_LOCAL_DEV\"}\nProduction Boot: {\"uri\":\"postgres://prod-db:5432/live\",\"mode\":\"INJECTED_FROM_ENV\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "According to Factor III of the 12-Factor App methodology, why must configuration (such as database credentials and API keys) be stored strictly in environment variables?",
          "options": [
            "To allow the exact same immutable build artifact (Docker image) to be deployed across Dev, Staging, and Prod without recompiling code or committing secrets to version control",
            "Because environment variables run 10x faster than constants",
            "Because JavaScript crashes if config files exist"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_12FACTOR_CONFIG_ENV_ISOLATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_12FACTOR_CONFIG_ENV_ISOLATION",
              "errorExplanation": "Storing config in the environment decouples code from configuration, enabling immutable image deployments across environments.",
              "recoveryPath": {
                "simplerExplanation": "Env vars keep code immutable and credentials secret across environments.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d1-b2-ci-vs-cd-pipeline-definitions",
        "day": 1,
        "blockNumber": 2,
        "title": "Continuous Integration vs Continuous Delivery vs Continuous Deployment",
        "conceptBudget": {
          "primaryConcept": "CI/CD Pipeline Continuum",
          "supportingTerms": [
            "CI (Continuous Integration: Automated building and unit testing on every git push)",
            "CD (Continuous Delivery: Automated deployment to staging with manual production approval gate)",
            "Continuous Deployment (100% automated rollout to production on green tests)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d1-b1-twelve-factor-config-env",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "CI / CD Pipeline Spectrum",
              "nodes": [
                {
                  "id": "1",
                  "label": "Continuous Integration (CI): Code Push -> Lint -> Unit Tests -> Build Artifact",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Continuous Delivery: Auto-Deploy to Staging -> E2E Tests -> Awaits Manual Approval Gate",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Continuous Deployment: Fully Automated Direct Push to Live Production (0 Human intervention)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cicd_classifier_demo.js",
            "initialCode": "function classifyDeploymentModel(hasManualProdGate) {\n  return hasManualProdGate \n    ? { model: 'CONTINUOUS_DELIVERY', prodRelease: 'Requires Human Approval Gate' }\n    : { model: 'CONTINUOUS_DEPLOYMENT', prodRelease: '100% Fully Automated on Green Tests' };\n}\n\nconsole.log('Enterprise Banking Pipeline:', classifyDeploymentModel(true).model);\nconsole.log('High-Velocity SaaS Pipeline:', classifyDeploymentModel(false).model);",
            "expectedOutput": "Enterprise Banking Pipeline: CONTINUOUS_DELIVERY\nHigh-Velocity SaaS Pipeline: CONTINUOUS_DEPLOYMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the deployment model called when deployments automatically pass through staging and await a manual human click to release to production?",
          "expectedStringOutput": "CONTINUOUS_DELIVERY",
          "acceptableAnswers": [
            "CONTINUOUS_DELIVERY",
            "Continuous Delivery"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_12FACTOR_CONFIG_ENV_ISOLATION",
          "diagnosisMap": {
            "CONTINUOUS_DEPLOYMENT": {
              "misconceptionId": "MC_DEVOPS_12FACTOR_CONFIG_ENV_ISOLATION",
              "errorExplanation": "Continuous Deployment is 100% automated with zero manual gates. Continuous Delivery includes the manual approval gate.",
              "recoveryPath": {
                "simplerExplanation": "Manual gate = Continuous Delivery.",
                "guidedFixPrompt": "Type CONTINUOUS_DELIVERY"
              }
            }
          }
        }
      },
      {
        "id": "devops-d1-b3-stateless-processes-share-nothing",
        "day": 1,
        "blockNumber": 3,
        "title": "Factor VI: Stateless Processes & Shared-Nothing Scaling",
        "conceptBudget": {
          "primaryConcept": "Stateless Cloud Processes",
          "supportingTerms": [
            "Factor VI (Execute the app as one or more stateless processes)",
            "Never storing session state on local disk or local RAM",
            "Offloading state to Redis/PostgreSQL"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d1-b2-ci-vs-cd-pipeline-definitions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stateless_check.js",
            "initialCode": "function evaluateStateLocation(storageTarget) {\n  return ['REDIS_CLUSTER', 'POSTGRES_DB', 'S3_BUCKET'].includes(storageTarget)\n    ? 'STATELESS_HORIZONTALLY_SCALABLE'\n    : 'STATEFUL_ANTI_PATTERN_LOCAL_DISK';\n}\n\nconsole.log('Session in Redis RAM:', evaluateStateLocation('REDIS_CLUSTER'));\nconsole.log('Session in Local /tmp folder:', evaluateStateLocation('LOCAL_DISK'));",
            "expectedOutput": "Session in Redis RAM: STATELESS_HORIZONTALLY_SCALABLE\nSession in Local /tmp folder: STATEFUL_ANTI_PATTERN_LOCAL_DISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What architecture classification is assigned when session data is stored in a centralized Redis cluster?",
          "expectedStringOutput": "STATELESS_HORIZONTALLY_SCALABLE",
          "acceptableAnswers": [
            "STATELESS_HORIZONTALLY_SCALABLE",
            "Session in Redis RAM: STATELESS_HORIZONTALLY_SCALABLE",
            "STATELESS"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_12FACTOR_CONFIG_ENV_ISOLATION",
          "diagnosisMap": {
            "STATEFUL": {
              "misconceptionId": "MC_DEVOPS_12FACTOR_CONFIG_ENV_ISOLATION",
              "errorExplanation": "Offloading state to Redis makes the application process stateless and horizontally scalable.",
              "recoveryPath": {
                "simplerExplanation": "External store = STATELESS_HORIZONTALLY_SCALABLE.",
                "guidedFixPrompt": "Type STATELESS_HORIZONTALLY_SCALABLE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Linux Administration, POSIX Signals & Process Daemons",
    "overviewMetaphor": "POSIX Process Signals are emergency hand signals to a ship's captain: `SIGTERM` (Signal 15) is radioing \"Please drop anchor, safely disembark all passengers, and tie the ropes\" (Graceful shutdown in 30 seconds); `SIGKILL` (Signal 9) is an instant torpedo strike that obliterates the ship immediately without giving it 1 millisecond to save files or close database sockets.",
    "blocks": [
      {
        "id": "devops-d2-b1-posix-signals-sigterm-sigkill",
        "day": 2,
        "blockNumber": 1,
        "title": "POSIX Process Signals: `SIGTERM`, `SIGKILL` & `SIGINT`",
        "conceptBudget": {
          "primaryConcept": "POSIX Process Signals",
          "supportingTerms": [
            "`SIGTERM` (Signal 15: Trappable polite termination request)",
            "`SIGKILL` (Signal 9: Untrappable kernel kill)",
            "`SIGINT` (Signal 2: Interactive terminal interrupt Ctrl+C)",
            "`SIGHUP` (Signal 1: Reload config)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d1-b1-twelve-factor-config-env",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Linux POSIX Signal Matrix",
              "boxes": [
                {
                  "label": "SIGTERM (15)",
                  "value": "Polite Request -> TRAPPABLE by Node/Python process to drain connections",
                  "varType": "Graceful Stop",
                  "isUpdated": true
                },
                {
                  "label": "SIGKILL (9)",
                  "value": "Instant Execution -> UNTRAPPABLE by process; kernel reclaims memory immediately",
                  "varType": "Force Kill",
                  "isUpdated": false
                },
                {
                  "label": "SIGHUP (1)",
                  "value": "Hangup -> Signals daemon to re-read config file without restarting process",
                  "varType": "Hot Reload",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "signal_demo.js",
            "initialCode": "function canProcessCatchSignal(signalNumber) {\n  // Signal 9 (SIGKILL) and Signal 19 (SIGSTOP) CANNOT be trapped or ignored by any process\n  return signalNumber !== 9 && signalNumber !== 19;\n}\n\nconsole.log('Can catch SIGTERM (15)?:', canProcessCatchSignal(15));\nconsole.log('Can catch SIGKILL (9)?:', canProcessCatchSignal(9));",
            "expectedOutput": "Can catch SIGTERM (15)?: true\nCan catch SIGKILL (9)?: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can an application process intercept or handle a `SIGKILL` (Signal 9) to run clean-up database rollback logic?",
          "options": [
            "No, SIGKILL is handled directly by the Linux kernel; the process is killed instantly with zero execution time granted",
            "Yes, SIGKILL runs JavaScript finally blocks",
            "Only on Ubuntu"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_LINUX_SIGNALS_SIGTERM_SYSTEMD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_LINUX_SIGNALS_SIGTERM_SYSTEMD",
              "errorExplanation": "SIGKILL is untrappable by design; the kernel terminates the process immediately.",
              "recoveryPath": {
                "simplerExplanation": "SIGKILL cannot be trapped by any process.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d2-b2-linux-exit-codes-137",
        "day": 2,
        "blockNumber": 2,
        "title": "Linux Exit Status Codes & The 137 (OOMKilled) Invariant",
        "conceptBudget": {
          "primaryConcept": "Exit Codes & OOMKilled",
          "supportingTerms": [
            "Exit 0 (Success)",
            "Exit 1 (General Error)",
            "Exit 137 (Fatal error 128 + Signal 9: Container killed by Linux Out-Of-Memory Killer)",
            "Exit 143 (128 + Signal 15: Terminated by SIGTERM)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d2-b1-posix-signals-sigterm-sigkill",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Exit Code Formula",
            "codeSnippet": "// Fatal signal exit codes formula: 128 + SignalNumber\nconst sigkillExit = 128 + 9;  // 137 -> OOMKilled or docker kill\nconst sigtermExit = 128 + 15; // 143 -> Gracefully terminated by orchestrator",
            "lineNotes": {
              "2": "Exit code 137 indicates process was terminated by SIGKILL (commonly OOMKilled).",
              "3": "Exit code 143 indicates standard SIGTERM shutdown."
            }
          },
          {
            "type": "runnable_code",
            "filename": "exit_code_calc.js",
            "initialCode": "function diagnoseExitCode(code) {\n  if (code === 0) return 'SUCCESS';\n  if (code === 137) return 'OOM_KILLED_BY_KERNEL (Signal 9)';\n  if (code === 143) return 'TERMINATED_BY_SIGTERM (Signal 15)';\n  return 'GENERAL_ERROR';\n}\n\nconsole.log('Exit Code 0:', diagnoseExitCode(0));\nconsole.log('Exit Code 137:', diagnoseExitCode(137));\nconsole.log('Exit Code 143:', diagnoseExitCode(143));",
            "expectedOutput": "Exit Code 0: SUCCESS\nExit Code 137: OOM_KILLED_BY_KERNEL (Signal 9)\nExit Code 143: TERMINATED_BY_SIGTERM (Signal 15)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What root cause is indicated when a containerized process crashes with Exit Code 137 (128 + 9)?",
          "expectedStringOutput": "OOM_KILLED_BY_KERNEL (Signal 9)",
          "acceptableAnswers": [
            "OOM_KILLED_BY_KERNEL (Signal 9)",
            "OOMKilled",
            "OOM",
            "Exit Code 137: OOM_KILLED_BY_KERNEL (Signal 9)"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_LINUX_SIGNALS_SIGTERM_SYSTEMD",
          "diagnosisMap": {
            "SUCCESS": {
              "misconceptionId": "MC_DEVOPS_LINUX_SIGNALS_SIGTERM_SYSTEMD",
              "errorExplanation": "137 is 128 + Signal 9 (SIGKILL), the universal signature of an Out-Of-Memory (OOM) termination.",
              "recoveryPath": {
                "simplerExplanation": "137 = OOM_KILLED_BY_KERNEL (Signal 9).",
                "guidedFixPrompt": "Type OOM_KILLED_BY_KERNEL (Signal 9)"
              }
            }
          }
        }
      },
      {
        "id": "devops-d2-b3-systemd-service-units",
        "day": 2,
        "blockNumber": 3,
        "title": "systemd Service Units & Background Process Supervision",
        "conceptBudget": {
          "primaryConcept": "systemd Service Units",
          "supportingTerms": [
            "`[Unit]`, `[Service]`, `[Install]` sections",
            "`Restart=on-failure`",
            "`ExecStart=/usr/bin/node /app/server.js`",
            "`journalctl -u myapp -f`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d2-b2-linux-exit-codes-137",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "systemd Service Unit File (`/etc/systemd/system/api.service`)",
            "codeSnippet": "[Unit]\nDescription=PinIT Production API Gateway\nAfter=network.target\n\n[Service]\nType=simple\nUser=node\nWorkingDirectory=/app\nExecStart=/usr/bin/node server.js\nRestart=always\nRestartSec=5\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target",
            "lineNotes": {
              "6": "Runs service as unprivileged node user (security).",
              "9": "Automatically restarts process if it crashes with 5s backoff."
            }
          },
          {
            "type": "runnable_code",
            "filename": "systemd_parser.js",
            "initialCode": "function parseSystemdRestart(config) {\n  return config.restart === 'always' ? 'AUTO_RESTART_ON_CRASH_ENABLED' : 'MANUAL_RESTART_ONLY';\n}\n\nconsole.log('Production Unit:', parseSystemdRestart({ restart: 'always' }));",
            "expectedOutput": "Production Unit: AUTO_RESTART_ON_CRASH_ENABLED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What directive in a systemd service unit ensures that a crashed daemon is automatically restarted by the Linux supervisor?",
          "options": [
            "`Restart=always` (or `Restart=on-failure`)",
            "`User=root`",
            "`WantedBy=none`"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_LINUX_SIGNALS_SIGTERM_SYSTEMD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_LINUX_SIGNALS_SIGTERM_SYSTEMD",
              "errorExplanation": "Restart=always instructs systemd to restart the process whenever it exits unexpectedly.",
              "recoveryPath": {
                "simplerExplanation": "Restart=always auto-restarts crashed daemons.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Docker Architecture, Copy-on-Write & Image Layer Caching",
    "overviewMetaphor": "Docker Image Layer Caching is baking a custom multi-layer wedding cake: the bottom sponge layer takes 45 minutes to bake (Linux OS + Node.js runtime); the middle frosting takes 10 minutes (npm dependency packages); the top sugar flower decoration takes 2 seconds (your application source code); if you only change the sugar flower, you don't re-bake the entire cake from scratch; Docker reuses the cached bottom layers and rebuilds in 1 second.",
    "blocks": [
      {
        "id": "devops-d3-b1-docker-layer-caching-rules",
        "day": 3,
        "blockNumber": 1,
        "title": "Docker Immutable Layers & Cache Invalidation Invariants",
        "conceptBudget": {
          "primaryConcept": "Docker Layer Caching",
          "supportingTerms": [
            "Read-Only Immutable Layers",
            "Copy-on-Write (CoW)",
            "Cache Busting Rule: Any modified instruction invalidates all subsequent layers",
            "Optimal Step Ordering"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d1-b1-twelve-factor-config-env",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Docker Cache Busting Diff",
              "brokenCode": "// ❌ SLOW BUILD: Copies source code BEFORE npm install!\nFROM node:20-alpine\nWORKDIR /app\nCOPY . .          <-- Every 1-line code edit busts the cache here!\nRUN npm ci        <-- Takes 3 minutes to re-download 500 packages on EVERY build!",
              "fixedCode": "// ✅ FAST BUILD: Cache package manifests BEFORE source code!\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./  <-- Cached! Re-runs only when packages change\nRUN npm ci             <-- CACHED! Instant 0s build step!\nCOPY . .               <-- Only copies fresh code in 0.5s!",
              "errorLine": 4,
              "errorReason": "Copying application code before npm ci invalidates the dependency cache on every single code change.",
              "fixExplanation": "Copy package.json first, run npm ci, and copy source code last."
            }
          },
          {
            "type": "runnable_code",
            "filename": "layer_build_demo.js",
            "initialCode": "function estimateBuildTime(hasPackageChanged, isCodeChanged) {\n  let buildSeconds = 0;\n  // Layer 1: OS\n  buildSeconds += 0;\n  // Layer 2: npm ci\n  buildSeconds += hasPackageChanged ? 180 : 0; // 3 min or cached (0s)\n  // Layer 3: code copy\n  buildSeconds += isCodeChanged ? 1 : 0;\n  return { buildSeconds, isCacheHit: !hasPackageChanged };\n}\n\nconsole.log('Routine Code Edit Build Time:', estimateBuildTime(false, true).buildSeconds + 's');\nconsole.log('New Package Added Build Time:', estimateBuildTime(true, true).buildSeconds + 's');",
            "expectedOutput": "Routine Code Edit Build Time: 1s\nNew Package Added Build Time: 181s",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many seconds does a routine source code build take when the npm dependency layer is successfully cached?",
          "expectedStringOutput": "1s",
          "acceptableAnswers": [
            "1s",
            "1",
            "Routine Code Edit Build Time: 1s"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_LAYER_CACHE_INVALIDATION",
          "diagnosisMap": {
            "181s": {
              "misconceptionId": "MC_DEVOPS_DOCKER_LAYER_CACHE_INVALIDATION",
              "errorExplanation": "181s is when packages change. With cached dependencies, the build takes only 1 second.",
              "recoveryPath": {
                "simplerExplanation": "Cached dependencies = 1 second.",
                "guidedFixPrompt": "Type 1s"
              }
            }
          }
        }
      },
      {
        "id": "devops-d3-b2-dockerignore-hygiene",
        "day": 3,
        "blockNumber": 2,
        "title": "`.dockerignore` Hygiene & Context Bloat Prevention",
        "conceptBudget": {
          "primaryConcept": "Docker Build Context Hygiene",
          "supportingTerms": [
            "`.dockerignore` file",
            "Excluding `node_modules`, `.git`, `.env`, and build artifacts",
            "Preventing multi-gigabyte build context upload latency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d3-b1-docker-layer-caching-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Production `.dockerignore` Template",
            "codeSnippet": "node_modules\n.git\n.github\n.env*\ndist\nbuild\ncoverage\n*.log",
            "lineNotes": {
              "1": "Never copy local host node_modules into Linux container.",
              "2": "Prevents copying 500MB git history into Docker image.",
              "4": "Prevents leaking local secret .env files into production image."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dockerignore_demo.js",
            "initialCode": "function isExcludedByDockerignore(filePath, ignorePatterns = ['node_modules', '.git', '.env*']) {\n  return ignorePatterns.some(pat => filePath.startsWith(pat.replace('*', '')));\n}\n\nconsole.log('Is node_modules/express ignored?:', isExcludedByDockerignore('node_modules/express'));\nconsole.log('Is .env.production ignored?:', isExcludedByDockerignore('.env.production'));\nconsole.log('Is src/index.ts ignored?:', isExcludedByDockerignore('src/index.ts'));",
            "expectedOutput": "Is node_modules/express ignored?: true\nIs .env.production ignored?: true\nIs src/index.ts ignored?: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should `node_modules` and `.git` ALWAYS be listed inside `.dockerignore`?",
          "options": [
            "To prevent copying host OS platform-specific binaries and huge Git commit histories into the Docker build context, reducing build context size by 90% and preventing architecture mismatch crashes",
            "Because Docker cannot read folders starting with a dot",
            "To delete Git repositories"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_LAYER_CACHE_INVALIDATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_DOCKER_LAYER_CACHE_INVALIDATION",
              "errorExplanation": ".dockerignore keeps build contexts lightweight and prevents copying host-specific binaries.",
              "recoveryPath": {
                "simplerExplanation": "Excludes bloat and prevents binary architecture conflicts.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d3-b3-cmd-vs-entrypoint-exec-form",
        "day": 3,
        "blockNumber": 3,
        "title": "Exec Form vs Shell Form (`ENTRYPOINT` & `CMD`)",
        "conceptBudget": {
          "primaryConcept": "Exec Form vs Shell Form",
          "supportingTerms": [
            "Exec Form `CMD [\"node\", \"server.js\"]` (Runs as PID 1, receives SIGTERM)",
            "Shell Form `CMD node server.js` (Runs under `/bin/sh -c`, swallows signals)",
            "Graceful Shutdown Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d3-b2-dockerignore-hygiene",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Shell Form vs Exec Form Signal Passing Diff",
              "brokenCode": "// ❌ SHELL FORM: Starts /bin/sh as PID 1, node as PID 2\nCMD node server.js\n// /bin/sh DOES NOT forward SIGTERM to node -> Container hangs for 10s until docker force kills (SIGKILL)!",
              "fixedCode": "// ✅ EXEC FORM (JSON Array): Starts node directly as PID 1\nCMD [\"node\", \"server.js\"]\n// node receives SIGTERM directly -> Executes graceful shutdown in 50ms!",
              "errorLine": 2,
              "errorReason": "Shell form wraps process in /bin/sh, preventing container signals from reaching the application.",
              "fixExplanation": "Use JSON array exec form to run app directly as PID 1."
            }
          },
          {
            "type": "runnable_code",
            "filename": "exec_form_demo.js",
            "initialCode": "function evaluateCmdForm(cmdInstruction) {\n  const isExecForm = cmdInstruction.startsWith('[') && cmdInstruction.endsWith(']');\n  return {\n    isExecForm,\n    pid1Process: isExecForm ? 'TARGET_APPLICATION' : '/bin/sh (Signal Swallowed)',\n    receivesSigterm: isExecForm\n  };\n}\n\nconsole.log('Exec Form [\"node\", \"server.js\"]:', JSON.stringify(evaluateCmdForm('[\"node\", \"server.js\"]')));\nconsole.log('Shell Form node server.js:', JSON.stringify(evaluateCmdForm('node server.js')));",
            "expectedOutput": "Exec Form [\"node\", \"server.js\"]: {\"isExecForm\":true,\"pid1Process\":\"TARGET_APPLICATION\",\"receivesSigterm\":true}\nShell Form node server.js: {\"isExecForm\":false,\"pid1Process\":\"/bin/sh (Signal Swallowed)\",\"receivesSigterm\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does the application process receive `SIGTERM` signals directly when using the JSON array Exec Form `[\"node\", \"server.js\"]`?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "receivesSigterm\":true"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_LAYER_CACHE_INVALIDATION",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_DEVOPS_DOCKER_LAYER_CACHE_INVALIDATION",
              "errorExplanation": "Exec form runs node as PID 1, allowing it to receive SIGTERM directly.",
              "recoveryPath": {
                "simplerExplanation": "Exec form receives SIGTERM directly -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Docker Multi-Stage Builds & Minimal Production Images",
    "overviewMetaphor": "Multi-Stage Docker builds are a shipyard drydock: to build a naval ship, you need huge steel welding cranes, scaffolding, and 500 construction tools (Builder stage: compilers, TypeScript, 1GB devDependencies); but when the ship sets sail across the ocean (Runner stage), you leave the cranes and scaffolding behind at the dock; the ship carries only the captain and engine (50MB image).",
    "blocks": [
      {
        "id": "devops-d4-b1-multi-stage-stages-pipeline",
        "day": 4,
        "blockNumber": 1,
        "title": "Multi-Stage Dockerfile Syntax (`AS builder` $\\to$ `AS runner`)",
        "conceptBudget": {
          "primaryConcept": "Multi-Stage Docker Pipeline",
          "supportingTerms": [
            "`FROM node:20-alpine AS builder`",
            "`FROM node:20-alpine AS runner`",
            "`COPY --from=builder /app/dist ./dist`",
            "Zero compiler bloat in production"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d3-b1-docker-layer-caching-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Multi-Stage Production Dockerfile",
            "codeSnippet": "# Stage 1: Build Phase\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Minimal Production Runner\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nUSER node\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY --from=builder /app/dist ./dist\nCMD [\"node\", \"dist/index.js\"]",
            "lineNotes": {
              "2": "Builder stage installs heavy devDependencies and compiles TypeScript.",
              "10": "Runner stage starts fresh with a tiny clean Alpine image.",
              "14": "Copies ONLY compiled production JavaScript from builder."
            }
          },
          {
            "type": "runnable_code",
            "filename": "multi_stage_calc.js",
            "initialCode": "function compareDockerImageFootprint(isMultiStage) {\n  return isMultiStage \n    ? { imageMb: 45, buildToolsIncluded: false, cveExposureRisk: 'LOW' }\n    : { imageMb: 1250, buildToolsIncluded: true, cveExposureRisk: 'HIGH' };\n}\n\nconsole.log('Multi-Stage Production Size:', compareDockerImageFootprint(true).imageMb + ' MB');\nconsole.log('Single-Stage Bloated Size:', compareDockerImageFootprint(false).imageMb + ' MB');",
            "expectedOutput": "Multi-Stage Production Size: 45 MB\nSingle-Stage Bloated Size: 1250 MB",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the estimated production image size (in MB) for a clean Multi-Stage build?",
          "expectedStringOutput": "45 MB",
          "acceptableAnswers": [
            "45 MB",
            "45MB",
            "45",
            "Multi-Stage Production Size: 45 MB"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
          "diagnosisMap": {
            "1250 MB": {
              "misconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
              "errorExplanation": "1250 MB is for single-stage images containing devDependencies. Multi-stage shrinks it to ~45 MB.",
              "recoveryPath": {
                "simplerExplanation": "Multi-stage size is 45 MB.",
                "guidedFixPrompt": "Type 45 MB"
              }
            }
          }
        }
      },
      {
        "id": "devops-d4-b2-distroless-vs-alpine",
        "day": 4,
        "blockNumber": 2,
        "title": "Alpine Linux vs Google Distroless Containers",
        "conceptBudget": {
          "primaryConcept": "Minimal Base Images",
          "supportingTerms": [
            "Alpine (5MB Linux with musl libc and apk package manager)",
            "Google Distroless (Contains ONLY your app and runtime; NO package manager, NO shell, NO bash)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d4-b1-multi-stage-stages-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Base Image Security Comparison",
              "boxes": [
                {
                  "label": "Standard Node (node:20)",
                  "value": "1.1 GB (Ubuntu/Debian based, full bash, curl, apt) -> High CVE surface",
                  "varType": "Heavy Base",
                  "isUpdated": false
                },
                {
                  "label": "Alpine (node:20-alpine)",
                  "value": "50 MB (musl libc, apk, sh shell) -> Low CVE surface",
                  "varType": "Lightweight Base",
                  "isUpdated": false
                },
                {
                  "label": "Distroless (gcr.io/distroless/nodejs20)",
                  "value": "40 MB (Zero shell, zero package manager) -> Minimum CVE surface",
                  "varType": "Ultra Secure Base",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "base_image_picker.js",
            "initialCode": "function evaluateBaseImage(base) {\n  if (base === 'distroless') return { hasShell: false, attackSurface: 'MINIMAL_NO_SHELL_EXEC' };\n  if (base === 'alpine') return { hasShell: true, attackSurface: 'LOW_LIGHTWEIGHT' };\n  return { hasShell: true, attackSurface: 'LARGE_FULL_OS' };\n}\n\nconsole.log('Distroless Security Profile:', JSON.stringify(evaluateBaseImage('distroless')));",
            "expectedOutput": "Distroless Security Profile: {\"hasShell\":false,\"attackSurface\":\"MINIMAL_NO_SHELL_EXEC\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are Google Distroless container images considered among the most secure base images in modern DevSecOps?",
          "options": [
            "Because Distroless images contain zero shells (`/bin/sh`, `/bin/bash`) and zero package managers, preventing attackers from executing reverse shells or downloading malware even if an application vulnerability is found",
            "Because Distroless containers do not require memory",
            "Because Distroless is free on AWS"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
              "errorExplanation": "The absence of shells and package managers dramatically shrinks the container attack surface.",
              "recoveryPath": {
                "simplerExplanation": "No shell = no attacker command execution.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d4-b3-non-root-least-privilege",
        "day": 4,
        "blockNumber": 3,
        "title": "The `USER node` Non-Root Container Invariant",
        "conceptBudget": {
          "primaryConcept": "Non-Root Container Invariant",
          "supportingTerms": [
            "`USER node` / `USER 10001` directive",
            "Preventing root container escapes to host kernel",
            "Setting file permissions (`chown -R node:node /app`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d4-b2-distroless-vs-alpine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "user_check_demo.js",
            "initialCode": "function checkContainerUser(userDirective) {\n  return (userDirective && userDirective !== 'root' && userDirective !== '0')\n    ? 'SECURE_NON_ROOT'\n    : 'INSECURE_ROOT_CONTAINER';\n}\n\nconsole.log('Dockerfile with USER node:', checkContainerUser('node'));\nconsole.log('Dockerfile with default root:', checkContainerUser(null));",
            "expectedOutput": "Dockerfile with USER node: SECURE_NON_ROOT\nDockerfile with default root: INSECURE_ROOT_CONTAINER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security status is assigned to a Dockerfile containing `USER node`?",
          "expectedStringOutput": "SECURE_NON_ROOT",
          "acceptableAnswers": [
            "SECURE_NON_ROOT",
            "Dockerfile with USER node: SECURE_NON_ROOT"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
          "diagnosisMap": {
            "INSECURE_ROOT_CONTAINER": {
              "misconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
              "errorExplanation": "USER node switches execution to an unprivileged non-root user (SECURE_NON_ROOT).",
              "recoveryPath": {
                "simplerExplanation": "USER node = SECURE_NON_ROOT.",
                "guidedFixPrompt": "Type SECURE_NON_ROOT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose",
    "overviewMetaphor": "Milestone 1 — The Microservices Orchestra: A full stack where each musician has their own seat: Next.js Frontend (Violin), Express API Gateway (Trumpet), PostgreSQL Database (Drums), and Redis Cache (Keyboard); Docker Compose is the conductor's sheet music (`compose.yml`) that boots all 4 instruments in 1 second and provides private radio headsets (Bridge Network DNS) so they talk to each other seamlessly.",
    "blocks": [
      {
        "id": "devops-d5-b1-compose-v2-specification",
        "day": 5,
        "blockNumber": 1,
        "title": "Docker Compose v2 Multi-Service Specification",
        "conceptBudget": {
          "primaryConcept": "Docker Compose Specification",
          "supportingTerms": [
            "`compose.yaml` (Services, Networks, Volumes, Healthchecks)",
            "Service Discovery via Container Service Names (`postgres:5432`, `redis:6379`)",
            "Persistent Named Volumes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d4-b1-multi-stage-stages-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Production `compose.yaml` Multi-Container Stack",
            "codeSnippet": "services:\n  web:\n    build: { context: ./frontend, target: runner }\n    ports: [\"3000:3000\"]\n    environment: [\"API_URL=http://api:8080\"]\n    depends_on: { api: { condition: service_healthy } }\n\n  api:\n    build: { context: ./backend, target: runner }\n    ports: [\"8080:8080\"]\n    environment:\n      - DATABASE_URL=postgres://user:pass@postgres:5432/app\n      - REDIS_URL=redis://redis:6379\n    depends_on: { postgres: { condition: service_healthy }, redis: { condition: service_started } }\n    healthcheck:\n      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:8080/healthz\"]\n      interval: 10s\n      retries: 3\n\n  postgres:\n    image: postgres:16-alpine\n    volumes: [pgdata:/var/lib/postgresql/data]\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U user -d app\"]\n      interval: 5s\n\n  redis:\n    image: redis:7-alpine\n\nvolumes:\n  pgdata:",
            "lineNotes": {
              "6": "Waits for backend API to be healthy before starting web frontend.",
              "11": "Resolves postgres:5432 using Docker internal DNS.",
              "24": "Persistent volume preserves database records across container restarts."
            }
          },
          {
            "type": "runnable_code",
            "filename": "compose_dns_demo.js",
            "initialCode": "function resolveServiceEndpoint(serviceName, port) {\n  return `http://${serviceName}:${port}`;\n}\n\nconsole.log('Backend API DNS Endpoint:', resolveServiceEndpoint('api', 8080));\nconsole.log('Postgres Database DNS Endpoint:', resolveServiceEndpoint('postgres', 5432));",
            "expectedOutput": "Backend API DNS Endpoint: http://api:8080\nPostgres Database DNS Endpoint: http://postgres:5432",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the `web` container communicate with the `api` container inside a Docker Compose network without hardcoding IP addresses?",
          "options": [
            "By using the service name `http://api:8080` which Docker's built-in 127.0.0.11 DNS server automatically resolves to the dynamic IP of the api container",
            "By looking up the developer's home Wi-Fi address",
            "By sending bluetooth packets"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "Docker Compose creates an internal DNS resolver mapping service names to container IPs.",
              "recoveryPath": {
                "simplerExplanation": "Docker internal DNS resolves service names.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d5-b2-service-healthy-sequencing",
        "day": 5,
        "blockNumber": 2,
        "title": "Service Dependency Sequencing with `service_healthy`",
        "conceptBudget": {
          "primaryConcept": "Dependency Sequencing",
          "supportingTerms": [
            "`depends_on: { service: { condition: service_healthy } }`",
            "Preventing app crashes caused by database startup race conditions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d5-b1-compose-v2-specification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Compose Healthcheck Dependency Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. docker compose up: Postgres container starts booting",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Healthcheck probes pg_isready every 5s -> Status: HEALTHY",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. API container starts & connects to DB with ZERO connection refused crashes!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "startup_sequence_demo.js",
            "initialCode": "function canStartDependentService(dbStatus) {\n  return dbStatus === 'HEALTHY' ? 'SAFE_TO_START_API' : 'HOLD_STARTUP_WAITING_FOR_DB';\n}\n\nconsole.log('DB Booting (5s):', canStartDependentService('STARTING'));\nconsole.log('DB Ready (12s):', canStartDependentService('HEALTHY'));",
            "expectedOutput": "DB Booting (5s): HOLD_STARTUP_WAITING_FOR_DB\nDB Ready (12s): SAFE_TO_START_API",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the startup decision when the database is reported as `HEALTHY`?",
          "expectedStringOutput": "SAFE_TO_START_API",
          "acceptableAnswers": [
            "SAFE_TO_START_API",
            "DB Ready (12s): SAFE_TO_START_API"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "HOLD": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "Once the DB healthcheck reports HEALTHY, the API service safely starts.",
              "recoveryPath": {
                "simplerExplanation": "Healthy DB allows API to start (SAFE_TO_START_API).",
                "guidedFixPrompt": "Type SAFE_TO_START_API"
              }
            }
          }
        }
      },
      {
        "id": "devops-d5-b3-milestone1-devops-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Multi-Container Stack Certification",
        "conceptBudget": {
          "primaryConcept": "Docker Compose Milestone Certification",
          "supportingTerms": [
            "Multi-Container Stack Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d5-b2-service-healthy-sequencing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "Returns ⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches milestone header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Docker Container Networking & Host/Bridge Port Mappings",
    "overviewMetaphor": "Docker Port Forwarding is an apartment building intercom system: the building's street address is the host machine (`0.0.0.0:8080`); Apartment #42 is the container (`port 3000`); when a visitor buzzes `8080` at the front door, the intercom forwards the call directly to Apartment #42 (`-p 8080:3000`); without this mapping, visitors outside the building have zero wires into the apartment.",
    "blocks": [
      {
        "id": "devops-d6-b1-host-to-container-port-mapping",
        "day": 6,
        "blockNumber": 1,
        "title": "Port Forwarding Syntax (`-p HOST:CONTAINER`)",
        "conceptBudget": {
          "primaryConcept": "Port Mapping",
          "supportingTerms": [
            "`-p 8080:80` (Binds Host port 8080 to Container port 80)",
            "Binding to `127.0.0.1:8080:80` for local-only security",
            "Random host port assignment (`-P`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d5-b1-compose-v2-specification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Port Mapping Anatomy",
            "codeSnippet": "docker run -d \\\n  -p 127.0.0.1:8080:3000 \\\n  --name my-api \\\n  pinit/api:v1.0.0",
            "lineNotes": {
              "2": "Binds host localhost port 8080 to container internal port 3000.",
              "3": "Names container for local CLI management."
            }
          },
          {
            "type": "runnable_code",
            "filename": "port_map_demo.js",
            "initialCode": "function resolveTargetPort(mappingStr, incomingHostPort) {\n  const [host, container] = mappingStr.split(':').map(Number);\n  return incomingHostPort === host ? container : null;\n}\n\nconsole.log('Packet on 8080 routed to container port:', resolveTargetPort('8080:3000', 8080));",
            "expectedOutput": "Packet on 8080 routed to container port: 3000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What container internal port receives traffic arriving on host port 8080 under `-p 8080:3000`?",
          "expectedStringOutput": "3000",
          "acceptableAnswers": [
            "3000",
            "Packet on 8080 routed to container port: 3000"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "8080": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "8080 is the host port; 3000 is the container internal port.",
              "recoveryPath": {
                "simplerExplanation": "Mapped container port is 3000.",
                "guidedFixPrompt": "Type 3000"
              }
            }
          }
        }
      },
      {
        "id": "devops-d6-b2-bridge-network-isolation",
        "day": 6,
        "blockNumber": 2,
        "title": "Docker Bridge Networks & Inter-Container Isolation",
        "conceptBudget": {
          "primaryConcept": "Docker Bridge Networks",
          "supportingTerms": [
            "Default Bridge vs User-Defined Custom Bridge",
            "Network isolation between unrelated multi-tenant containers",
            "Automatic DNS resolution on custom bridges"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d6-b1-host-to-container-port-mapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Bridge Network Isolation",
              "nodes": [
                {
                  "id": "1",
                  "label": "Frontend Container on net-frontend",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "API Container attached to BOTH net-frontend & net-backend (Gateway)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Database Container on net-backend ONLY (Zero connection possible from Frontend!)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "net_isolation_demo.js",
            "initialCode": "function canContainersCommunicate(c1Networks, c2Networks) {\n  return c1Networks.some(net => c2Networks.includes(net));\n}\n\nconsole.log('Frontend to API (Shares net-frontend):', canContainersCommunicate(['net-frontend'], ['net-frontend', 'net-backend']));\nconsole.log('Frontend to DB (Zero shared networks):', canContainersCommunicate(['net-frontend'], ['net-backend']));",
            "expectedOutput": "Frontend to API (Shares net-frontend): true\nFrontend to DB (Zero shared networks): false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can a frontend container on `net-frontend` directly connect to a database container residing exclusively on `net-backend`?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Frontend to DB (Zero shared networks): false"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "Containers on separate Docker bridge networks have zero IP connectivity without a shared bridge.",
              "recoveryPath": {
                "simplerExplanation": "Isolated networks cannot communicate -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "devops-d6-b3-host-networking-driver",
        "day": 6,
        "blockNumber": 3,
        "title": "The Host Network Driver (`--net=host`) Trade-offs",
        "conceptBudget": {
          "primaryConcept": "Host Network Driver",
          "supportingTerms": [
            "Bypassing Docker network virtualization",
            "Zero network address translation (NAT) overhead",
            "Eliminating port isolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d6-b2-bridge-network-isolation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "host_net_demo.js",
            "initialCode": "function getNetworkDriverCharacteristics(driver) {\n  return driver === 'host'\n    ? { natOverheadMs: 0, portIsolation: false, bestFor: 'Ultra-low latency streaming' }\n    : { natOverheadMs: 0.1, portIsolation: true, bestFor: 'Multi-tenant secure isolation' };\n}\n\nconsole.log('Host Driver NAT Overhead:', getNetworkDriverCharacteristics('host').natOverheadMs + 'ms');\nconsole.log('Bridge Driver Port Isolation:', getNetworkDriverCharacteristics('bridge').portIsolation);",
            "expectedOutput": "Host Driver NAT Overhead: 0ms\nBridge Driver Port Isolation: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary trade-off when using the Docker `--net=host` network driver?",
          "options": [
            "It eliminates Docker NAT network overhead for ultra-low latency, but completely removes network port isolation between containers and the host",
            "It makes containers invisible to the internet",
            "It turns off Linux security"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "Host networking shares the host network namespace directly, removing port isolation.",
              "recoveryPath": {
                "simplerExplanation": "Host network removes NAT overhead but loses port isolation.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Docker Security, Rootless Daemons & Read-Only Root Filesystems",
    "overviewMetaphor": "Container Security Hardening is sealing a bio-hazard laboratory: `--read-only` root filesystem turns the lab floor into solid diamond (malicious code cannot write unauthorized malware files or modify binaries); `--cap-drop ALL` removes all power tools from the lab; running as unprivileged `USER node` ensures that even if an attacker breaks out of the test tube, they have zero root keys to the master hospital doors.",
    "blocks": [
      {
        "id": "devops-d7-b1-read-only-root-filesystems",
        "day": 7,
        "blockNumber": 1,
        "title": "Immutable Containers with `--read-only` & `tmpfs` Mounts",
        "conceptBudget": {
          "primaryConcept": "Read-Only Root Filesystem",
          "supportingTerms": [
            "`--read-only` flag",
            "Mounting ephemeral memory volumes (`--tmpfs /tmp`)",
            "Preventing runtime malware persistence"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d4-b3-non-root-least-privilege",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Hardened Container Run Command",
            "codeSnippet": "docker run -d \\\n  --read-only \\\n  --tmpfs /tmp \\\n  --tmpfs /var/run \\\n  --user 10001:10001 \\\n  --cap-drop ALL \\\n  pinit/api:v1.0.0",
            "lineNotes": {
              "2": "Forbids any write modifications to root filesystem (/etc, /bin, /usr).",
              "3": "Provides temporary in-memory tmpfs for scratch operations.",
              "6": "Drops all 38 Linux kernel capabilities."
            }
          },
          {
            "type": "runnable_code",
            "filename": "readonly_demo.js",
            "initialCode": "function evaluateFileWrite(targetPath, isReadOnlyRoot) {\n  if (isReadOnlyRoot && !targetPath.startsWith('/tmp')) {\n    return { success: false, error: 'EROFS: Read-only file system' };\n  }\n  return { success: true, writtenTo: targetPath };\n}\n\nconsole.log('Attacker writes to /bin/malware:', JSON.stringify(evaluateFileWrite('/bin/malware', true)));\nconsole.log('App writes temp file to /tmp/log.txt:', JSON.stringify(evaluateFileWrite('/tmp/log.txt', true)));",
            "expectedOutput": "Attacker writes to /bin/malware: {\"success\":false,\"error\":\"EROFS: Read-only file system\"}\nApp writes temp file to /tmp/log.txt: {\"success\":true,\"writtenTo\":\"/tmp/log.txt\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error is returned when malware attempts to write to `/bin/malware` on a `--read-only` container?",
          "expectedStringOutput": "EROFS: Read-only file system",
          "acceptableAnswers": [
            "EROFS: Read-only file system",
            "EROFS",
            "Read-only file system"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
          "diagnosisMap": {
            "SUCCESS": {
              "misconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
              "errorExplanation": "Read-only containers reject writes outside tmpfs with EROFS.",
              "recoveryPath": {
                "simplerExplanation": "Rejects write with EROFS: Read-only file system.",
                "guidedFixPrompt": "Type EROFS: Read-only file system"
              }
            }
          }
        }
      },
      {
        "id": "devops-d7-b2-linux-capabilities-dropping",
        "day": 7,
        "blockNumber": 2,
        "title": "Dropping Linux Kernel Capabilities (`--cap-drop ALL`)",
        "conceptBudget": {
          "primaryConcept": "Linux Capabilities Dropping",
          "supportingTerms": [
            "Dropping dangerous kernel powers (`CAP_SYS_ADMIN`, `CAP_NET_RAW`, `CAP_CHOWN`)",
            "Selectively adding back only required caps (`--cap-add NET_BIND_SERVICE`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d7-b1-read-only-root-filesystems",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "caps_demo.js",
            "initialCode": "function evaluateCaps(droppedAll, addedCaps = []) {\n  return droppedAll && !addedCaps.includes('CAP_SYS_ADMIN')\n    ? 'HARDENED_KERNEL_CONTAINMENT'\n    : 'POTENTIAL_PRIVILEGE_ESCALATION_RISK';\n}\n\nconsole.log('Hardened Profile (--cap-drop ALL):', evaluateCaps(true, ['CAP_NET_BIND_SERVICE']));\nconsole.log('Default Profile (Retains SYS_ADMIN):', evaluateCaps(false, []));",
            "expectedOutput": "Hardened Profile (--cap-drop ALL): HARDENED_KERNEL_CONTAINMENT\nDefault Profile (Retains SYS_ADMIN): POTENTIAL_PRIVILEGE_ESCALATION_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security profile status is achieved when dropping all capabilities (`--cap-drop ALL`)?",
          "expectedStringOutput": "HARDENED_KERNEL_CONTAINMENT",
          "acceptableAnswers": [
            "HARDENED_KERNEL_CONTAINMENT",
            "Hardened Profile (--cap-drop ALL): HARDENED_KERNEL_CONTAINMENT"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
          "diagnosisMap": {
            "RISK": {
              "misconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
              "errorExplanation": "Dropping all capabilities provides HARDENED_KERNEL_CONTAINMENT.",
              "recoveryPath": {
                "simplerExplanation": "Matches HARDENED_KERNEL_CONTAINMENT.",
                "guidedFixPrompt": "Type HARDENED_KERNEL_CONTAINMENT"
              }
            }
          }
        }
      },
      {
        "id": "devops-d7-b3-rootless-docker-daemon",
        "day": 7,
        "blockNumber": 3,
        "title": "Rootless Docker Daemons & User Namespaces",
        "conceptBudget": {
          "primaryConcept": "Rootless Docker",
          "supportingTerms": [
            "Running dockerd inside user namespaces",
            "Root inside container maps to unprivileged UID 1000 on host",
            "Zero root host access on container breakout"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d7-b2-linux-capabilities-dropping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rootless_demo.js",
            "initialCode": "function mapContainerUidToHost(containerUid, isRootless) {\n  return isRootless && containerUid === 0 \n    ? { hostUid: 1000, privilege: 'UNPRIVILEGED_HOST_USER' }\n    : { hostUid: 0, privilege: 'ROOT_HOST_ADMIN' };\n}\n\nconsole.log('Rootless Docker Root UID:', JSON.stringify(mapContainerUidToHost(0, true)));\nconsole.log('Standard Docker Root UID:', JSON.stringify(mapContainerUidToHost(0, false)));",
            "expectedOutput": "Rootless Docker Root UID: {\"hostUid\":1000,\"privilege\":\"UNPRIVILEGED_HOST_USER\"}\nStandard Docker Root UID: {\"hostUid\":0,\"privilege\":\"ROOT_HOST_ADMIN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does Rootless Docker protect the host machine if an attacker manages to achieve a container breakout?",
          "options": [
            "User namespaces map the container's root user (UID 0) to a standard unprivileged user (UID 1000) on the host machine, preventing host takeover",
            "Rootless Docker shuts down the computer",
            "Rootless Docker disables networking"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_DOCKER_MULTI_STAGE_IMAGE_SLIMMING",
              "errorExplanation": "User namespaces prevent container root from wielding host root privileges.",
              "recoveryPath": {
                "simplerExplanation": "Container root maps to unprivileged host user.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Container Healthchecks, Restart Policies & Resource Limits",
    "overviewMetaphor": "Container Self-Healing is an intensive care monitor: the Docker Healthcheck continuously checks blood pressure and pulse (`/healthz` HTTP probe every 10 seconds); if the heartbeat stops for 3 consecutive checks, the supervisor defibrillates the container (`Restart=on-failure`); memory limits (`--memory=512m`) ensure that one runaway patient doesn't consume all oxygen tanks in the hospital.",
    "blocks": [
      {
        "id": "devops-d8-b1-docker-healthcheck-instruction",
        "day": 8,
        "blockNumber": 1,
        "title": "The Dockerfile `HEALTHCHECK` Instruction",
        "conceptBudget": {
          "primaryConcept": "Dockerfile HEALTHCHECK",
          "supportingTerms": [
            "`HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD curl -f http://localhost:8080/healthz || exit 1`",
            "`starting`, `healthy`, `unhealthy` states"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d5-b2-service-healthy-sequencing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dockerfile HEALTHCHECK Syntax",
            "codeSnippet": "HEALTHCHECK --interval=15s \\\n            --timeout=5s \\\n            --start-period=10s \\\n            --retries=3 \\\n            CMD curl -f http://localhost:3000/healthz || exit 1",
            "lineNotes": {
              "1": "Probes every 15 seconds.",
              "3": "Gives app 10s initial grace period during cold boot before counting failures.",
              "4": "3 consecutive failed curl commands mark container UNHEALTHY."
            }
          },
          {
            "type": "runnable_code",
            "filename": "health_probe_demo.js",
            "initialCode": "function evaluateHealthStatus(consecutiveFails, retries = 3) {\n  return consecutiveFails >= retries ? 'UNHEALTHY' : 'HEALTHY';\n}\n\nconsole.log('1 Failure:', evaluateHealthStatus(1));\nconsole.log('3 Failures:', evaluateHealthStatus(3));",
            "expectedOutput": "1 Failure: HEALTHY\n3 Failures: UNHEALTHY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state does a container transition to after 3 consecutive failed health check probes?",
          "expectedStringOutput": "UNHEALTHY",
          "acceptableAnswers": [
            "UNHEALTHY",
            "3 Failures: UNHEALTHY",
            "Unhealthy"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "HEALTHY": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "Reaching the retry threshold transitions the container status to UNHEALTHY.",
              "recoveryPath": {
                "simplerExplanation": "3 failed checks = UNHEALTHY.",
                "guidedFixPrompt": "Type UNHEALTHY"
              }
            }
          }
        }
      },
      {
        "id": "devops-d8-b2-restart-policies-crash-loop",
        "day": 8,
        "blockNumber": 2,
        "title": "Docker Restart Policies: `always` vs `on-failure` vs `unless-stopped`",
        "conceptBudget": {
          "primaryConcept": "Docker Restart Policies",
          "supportingTerms": [
            "`--restart=on-failure:5` (Restarts only on non-zero crash exits up to 5 times)",
            "`--restart=unless-stopped` (Preserves manual stop commands across host reboots)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d8-b1-docker-healthcheck-instruction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "restart_policy_demo.js",
            "initialCode": "function shouldRestart(exitCode, policy) {\n  if (policy === 'always') return true;\n  if (policy === 'no') return false;\n  if (policy === 'on-failure') return exitCode !== 0;\n  return false;\n}\n\nconsole.log('Clean exit (0) with on-failure:', shouldRestart(0, 'on-failure'));\nconsole.log('Crash exit (1) with on-failure:', shouldRestart(1, 'on-failure'));",
            "expectedOutput": "Clean exit (0) with on-failure: false\nCrash exit (1) with on-failure: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does `--restart=on-failure` restart a container that exits cleanly with code 0?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Clean exit (0) with on-failure: false"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "on-failure only restarts on non-zero error exits. Clean exit 0 does not restart.",
              "recoveryPath": {
                "simplerExplanation": "Clean exit 0 is not restarted -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "devops-d8-b3-memory-cpu-cgroups-limits",
        "day": 8,
        "blockNumber": 3,
        "title": "Linux cgroups Resource Limits (`--memory` & `--cpus`)",
        "conceptBudget": {
          "primaryConcept": "cgroups Resource Limits",
          "supportingTerms": [
            "`--memory=512m`",
            "`--cpus=1.5`",
            "Preventing noisy neighbor memory starvation on shared container hosts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d8-b2-restart-policies-crash-loop",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cgroups_demo.js",
            "initialCode": "function evaluateOomRisk(currentUsageMb, memoryLimitMb) {\n  return currentUsageMb > memoryLimitMb ? 'OOM_KILL_TRIGGERED (Exit 137)' : 'WITHIN_QUOTA';\n}\n\nconsole.log('400MB used of 512MB limit:', evaluateOomRisk(400, 512));\nconsole.log('600MB used of 512MB limit:', evaluateOomRisk(600, 512));",
            "expectedOutput": "400MB used of 512MB limit: WITHIN_QUOTA\n600MB used of 512MB limit: OOM_KILL_TRIGGERED (Exit 137)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should every production container have explicit memory and CPU limits defined in its configuration?",
          "options": [
            "To prevent a single memory-leaking container from consuming 100% of host RAM and crashing all other co-located containers on the machine",
            "Because Docker disables networking without CPU limits",
            "To make CPU run cooler"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_DOCKER_COMPOSE_NETWORKING_DNS",
              "errorExplanation": "cgroups resource limits enforce fair sharing and protect the host from memory exhaustion.",
              "recoveryPath": {
                "simplerExplanation": "Resource limits prevent noisy neighbor memory crashes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "GitHub Actions CI: Workflow Syntax, Triggers & Secret Stores",
    "overviewMetaphor": "GitHub Actions is an automated dispatch control tower at a high-speed rail network: when a developer commits new code (`git push on: [main]`), the control tower triggers an automated dispatch schedule (`.github/workflows/ci.yml`); the engine runner spins up an isolated virtual locomotive (`runs-on: ubuntu-latest`), pulls credentials from an armored vault (`${{ secrets.PROD_API_KEY }}`), and executes the journey step by step.",
    "blocks": [
      {
        "id": "devops-d9-b1-workflow-yaml-anatomy",
        "day": 9,
        "blockNumber": 1,
        "title": "GitHub Actions YAML Hierarchy: `name`, `on`, `jobs`, `steps`",
        "conceptBudget": {
          "primaryConcept": "GitHub Actions Workflow Anatomy",
          "supportingTerms": [
            ".github/workflows/*.yml",
            "`on: [push, pull_request]`",
            "`jobs.<job_id>.runs-on: ubuntu-latest`",
            "`steps: - uses: actions/checkout@v4`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d1-b2-ci-vs-cd-pipeline-definitions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Production GitHub Actions Workflow (`.github/workflows/ci.yml`)",
            "codeSnippet": "name: Continuous Integration\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Check out repository\n        uses: actions/checkout@v4\n\n      - name: Setup Node.js 20\n        uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Run Test Suite\n        run: npm test",
            "lineNotes": {
              "3": "Triggers workflow on push to main or pull requests targeting main.",
              "9": "Provisions isolated ephemeral Ubuntu VM runner.",
              "19": "Uses deterministic npm ci for automated CI builds."
            }
          },
          {
            "type": "runnable_code",
            "filename": "workflow_eval_demo.js",
            "initialCode": "function shouldRunCi(triggerEvent, targetBranch) {\n  if (triggerEvent === 'push' && targetBranch === 'main') return 'TRIGGER_CI_BUILD';\n  if (triggerEvent === 'pull_request' && targetBranch === 'main') return 'TRIGGER_PR_VALIDATION';\n  return 'SKIP_CI';\n}\n\nconsole.log('Push to main:', shouldRunCi('push', 'main'));\nconsole.log('Push to feature branch:', shouldRunCi('push', 'feature/login'));",
            "expectedOutput": "Push to main: TRIGGER_CI_BUILD\nPush to feature branch: SKIP_CI",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered on a `push` event to the `main` branch?",
          "expectedStringOutput": "TRIGGER_CI_BUILD",
          "acceptableAnswers": [
            "TRIGGER_CI_BUILD",
            "Push to main: TRIGGER_CI_BUILD"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "SKIP_CI": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "Pushing directly to main matches the trigger filter and starts TRIGGER_CI_BUILD.",
              "recoveryPath": {
                "simplerExplanation": "Push to main triggers CI build.",
                "guidedFixPrompt": "Type TRIGGER_CI_BUILD"
              }
            }
          }
        }
      },
      {
        "id": "devops-d9-b2-encrypted-secrets-masking",
        "day": 9,
        "blockNumber": 2,
        "title": "Encrypted Secrets & Automated CI Log Masking",
        "conceptBudget": {
          "primaryConcept": "GitHub Encrypted Secrets",
          "supportingTerms": [
            "`${{ secrets.DOCKER_PASSWORD }}`",
            "Automated log redaction (`***`)",
            "Zero plain-text credentials in Git"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d9-b1-workflow-yaml-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "secret_mask_demo.js",
            "initialCode": "function redactLog(logOutput, secretValue) {\n  return logOutput.replace(new RegExp(secretValue, 'g'), '***');\n}\n\nconst rawLog = 'Authenticated to GHCR with secret token ghp_9981LiveToken successfully.';\nconsole.log('GitHub Actions Masked Log:', redactLog(rawLog, 'ghp_9981LiveToken'));",
            "expectedOutput": "GitHub Actions Masked Log: Authenticated to GHCR with secret token *** successfully.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does GitHub Actions automatically display secret values in public build logs?",
          "expectedStringOutput": "***",
          "acceptableAnswers": [
            "***",
            "Masked as ***",
            "stars"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "ghp_9981LiveToken": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "Secrets referenced from ${{ secrets.* }} are automatically masked as *** in all logs.",
              "recoveryPath": {
                "simplerExplanation": "Secrets are masked as ***.",
                "guidedFixPrompt": "Type ***"
              }
            }
          }
        }
      },
      {
        "id": "devops-d9-b3-job-dependencies-needs",
        "day": 9,
        "blockNumber": 3,
        "title": "Sequential Job Pipelines with `needs:` Dependencies",
        "conceptBudget": {
          "primaryConcept": "Job Dependencies (`needs`)",
          "supportingTerms": [
            "`needs: [lint, test]`",
            "DAG (Directed Acyclic Graph) workflow execution",
            "Short-circuiting deploy jobs on test failure"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d9-b2-encrypted-secrets-masking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "GitHub Actions DAG Execution Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Parallel: Job 1 (Lint) + Job 2 (Unit Tests)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Job 3 (Docker Build) -> needs: [test]",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Job 4 (Deploy) -> needs: [docker-build] (Short-circuits if tests fail!)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "needs_eval_demo.js",
            "initialCode": "function evaluateDeployJob(lintSuccess, testSuccess) {\n  if (!lintSuccess || !testSuccess) {\n    return { deployRun: false, reason: 'BLOCKED_BY_DEPENDENCY_FAILURE' };\n  }\n  return { deployRun: true, status: 'DEPLOYING' };\n}\n\nconsole.log('All Checks Green:', evaluateDeployJob(true, true).status);\nconsole.log('Unit Tests Failed:', evaluateDeployJob(true, false).reason);",
            "expectedOutput": "All Checks Green: DEPLOYING\nUnit Tests Failed: BLOCKED_BY_DEPENDENCY_FAILURE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens to a `deploy` job with `needs: [test]` if the upstream `test` job fails?",
          "options": [
            "GitHub Actions immediately cancels and skips the `deploy` job, preventing broken code from ever reaching production",
            "The deploy job runs anyway",
            "GitHub deletes the repository"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "Job dependencies automatically short-circuit downstream steps when dependencies fail.",
              "recoveryPath": {
                "simplerExplanation": "Failed tests skip downstream deploy jobs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "CI Test Automation, Parallelism & Test Matrix Strategies",
    "overviewMetaphor": "CI Build Matrix Parallelism is hiring 6 test drivers instead of 1: testing a sports car on Ice, Desert, and Mud tracks one after another takes 3 hours (Sequential testing); dispatching 3 separate test drivers simultaneously onto all 3 tracks takes 1 hour (Parallel Matrix testing: Node 18, 20, 22 on Ubuntu and macOS).",
    "blocks": [
      {
        "id": "devops-d10-b1-matrix-strategy-syntax",
        "day": 10,
        "blockNumber": 1,
        "title": "GitHub Actions Matrix Strategy (`strategy.matrix`)",
        "conceptBudget": {
          "primaryConcept": "CI Matrix Parallelism",
          "supportingTerms": [
            "`strategy.matrix.os: [ubuntu-latest, macos-latest]`",
            "`strategy.matrix.node: [18, 20, 22]`",
            "Cross-version and cross-platform compatibility testing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d9-b1-workflow-yaml-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Matrix Strategy YAML",
            "codeSnippet": "jobs:\n  test:\n    strategy:\n      fail-fast: false\n      matrix:\n        os: [ubuntu-latest, macos-latest]\n        node-version: [18.x, 20.x, 22.x]\n    runs-on: ${{ matrix.os }}\n    steps:\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node-version }}",
            "lineNotes": {
              "4": "fail-fast: false ensures all matrix combinations complete even if one fails.",
              "6": "Spawns 2 (OS) x 3 (Node) = 6 parallel runner jobs."
            }
          },
          {
            "type": "runnable_code",
            "filename": "matrix_calc_demo.js",
            "initialCode": "function countMatrixJobs(osList, versionList) {\n  return osList.length * versionList.length;\n}\n\nconsole.log('Total Parallel Jobs [2 OS x 3 Node]:', countMatrixJobs(['ubuntu', 'macos'], ['18', '20', '22']));",
            "expectedOutput": "Total Parallel Jobs [2 OS x 3 Node]: 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many parallel jobs are executed when the matrix defines 2 operating systems and 3 Node.js versions?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6 jobs",
            "Total Parallel Jobs [2 OS x 3 Node]: 6"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
              "errorExplanation": "2 OS * 3 Node versions = 6 parallel jobs.",
              "recoveryPath": {
                "simplerExplanation": "2 * 3 = 6.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "devops-d10-b2-actions-cache-dependencies",
        "day": 10,
        "blockNumber": 2,
        "title": "Dependency Caching with `actions/cache` & Lockfile Hashes",
        "conceptBudget": {
          "primaryConcept": "CI Dependency Caching",
          "supportingTerms": [
            "`actions/cache@v4`",
            "`hashFiles('**/package-lock.json')`",
            "Eliminating repetitive npm install network downloads"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d10-b1-matrix-strategy-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Actions Cache Configuration",
            "codeSnippet": "- name: Cache npm dependencies\n  uses: actions/cache@v4\n  with:\n    path: ~/.npm\n    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}\n    restore-keys: |\n      ${{ runner.os }}-npm-",
            "lineNotes": {
              "5": "Generates unique hash key based on exact package-lock.json contents.",
              "7": "Falls back to prefix match if lockfile changed."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cache_key_demo.js",
            "initialCode": "function evaluateCacheHit(storedHash, currentHash) {\n  return storedHash === currentHash ? 'CACHE_HIT (0s Download)' : 'CACHE_MISS (Download Packages)';\n}\n\nconsole.log('Unchanged Dependencies:', evaluateCacheHit('abc123hash', 'abc123hash'));\nconsole.log('Updated Dependencies:', evaluateCacheHit('abc123hash', 'xyz999hash'));",
            "expectedOutput": "Unchanged Dependencies: CACHE_HIT (0s Download)\nUpdated Dependencies: CACHE_MISS (Download Packages)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cache status is achieved when the lockfile hash matches the stored cache key?",
          "expectedStringOutput": "CACHE_HIT (0s Download)",
          "acceptableAnswers": [
            "CACHE_HIT (0s Download)",
            "CACHE_HIT",
            "Cache hit"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
          "diagnosisMap": {
            "CACHE_MISS": {
              "misconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
              "errorExplanation": "Matching lockfile hashes produce a CACHE_HIT (0s Download).",
              "recoveryPath": {
                "simplerExplanation": "Matching hashes = CACHE_HIT (0s Download).",
                "guidedFixPrompt": "Type CACHE_HIT (0s Download)"
              }
            }
          }
        }
      },
      {
        "id": "devops-d10-b3-fail-fast-invariants",
        "day": 10,
        "blockNumber": 3,
        "title": "The `fail-fast` Strategy Invariant",
        "conceptBudget": {
          "primaryConcept": "Matrix Fail-Fast",
          "supportingTerms": [
            "`fail-fast: true` (Cancels all other matrix jobs immediately on first failure to save billing minutes)",
            "`fail-fast: false` (Runs all jobs to completion for complete diagnostic matrix)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d10-b2-actions-cache-dependencies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "failfast_demo.js",
            "initialCode": "function evaluateFailFastBehavior(failFast, firstJobFailed) {\n  if (firstJobFailed) {\n    return failFast ? 'CANCEL_REMAINING_JOBS_SAVE_BILLING' : 'CONTINUE_ALL_JOBS_FULL_MATRIX';\n  }\n  return 'ALL_JOBS_PASSING';\n}\n\nconsole.log('Cost-Saving CI (fail-fast: true):', evaluateFailFastBehavior(true, true));\nconsole.log('Diagnostic CI (fail-fast: false):', evaluateFailFastBehavior(false, true));",
            "expectedOutput": "Cost-Saving CI (fail-fast: true): CANCEL_REMAINING_JOBS_SAVE_BILLING\nDiagnostic CI (fail-fast: false): CONTINUE_ALL_JOBS_FULL_MATRIX",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When should a CI pipeline set `strategy.fail-fast: false`?",
          "options": [
            "When you want to see test results across ALL operating systems and runtime versions even if one version fails, allowing developers to see the complete cross-platform failure report",
            "When you have no internet connection",
            "To make builds slower on purpose"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
              "errorExplanation": "fail-fast: false enables complete diagnostics across all matrix variations.",
              "recoveryPath": {
                "simplerExplanation": "Enables comprehensive diagnostic reports.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Semantic Versioning (SemVer) & Automated Git Tagging",
    "overviewMetaphor": "Semantic Versioning is a building modification permit system: `PATCH` (`1.0.1`) is repainting a door (safe bugfix, zero disruption); `MINOR` (`1.1.0`) is adding a new elevator (new backward-compatible feature, old stairs still work); `MAJOR` (`2.0.0`) is tearing down the building structure and rebuilding a skyscraper (Breaking Change, requires tenant migration).",
    "blocks": [
      {
        "id": "devops-d11-b1-semver-major-minor-patch",
        "day": 11,
        "blockNumber": 1,
        "title": "Semantic Versioning Format: `MAJOR.MINOR.PATCH`",
        "conceptBudget": {
          "primaryConcept": "SemVer 2.0 Specification",
          "supportingTerms": [
            "`MAJOR` (Breaking API changes)",
            "`MINOR` (New backward-compatible functionality)",
            "`PATCH` (Backward-compatible bug fixes)",
            "`v1.2.3`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d1-b1-twelve-factor-config-env",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SemVer 2.0 Hierarchy",
              "boxes": [
                {
                  "label": "MAJOR (X.0.0)",
                  "value": "Breaking Changes -> Incompatible API modifications",
                  "varType": "Breaking",
                  "isUpdated": true
                },
                {
                  "label": "MINOR (1.X.0)",
                  "value": "New Features -> Added functionality in a backward-compatible manner",
                  "varType": "Feature",
                  "isUpdated": false
                },
                {
                  "label": "PATCH (1.0.X)",
                  "value": "Bug Fixes -> Backward-compatible defect resolutions",
                  "varType": "Fix",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "semver_bump_demo.js",
            "initialCode": "function bumpVersion(current, bumpType) {\n  let [maj, min, pat] = current.replace('v', '').split('.').map(Number);\n  if (bumpType === 'MAJOR') return `v${maj + 1}.0.0`;\n  if (bumpType === 'MINOR') return `v${maj}.${min + 1}.0`;\n  if (bumpType === 'PATCH') return `v${maj}.${min}.${pat + 1}`;\n  return current;\n}\n\nconsole.log('Bug Fix on v1.4.2:', bumpVersion('v1.4.2', 'PATCH'));\nconsole.log('New Feature on v1.4.2:', bumpVersion('v1.4.2', 'MINOR'));\nconsole.log('Breaking Change on v1.4.2:', bumpVersion('v1.4.2', 'MAJOR'));",
            "expectedOutput": "Bug Fix on v1.4.2: v1.4.3\nNew Feature on v1.4.2: v1.5.0\nBreaking Change on v1.4.2: v2.0.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the resulting version when a `MINOR` bump is applied to `v1.4.2`?",
          "expectedStringOutput": "v1.5.0",
          "acceptableAnswers": [
            "v1.5.0",
            "1.5.0",
            "New Feature on v1.4.2: v1.5.0"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_SEMANTIC_VERSIONING_GIT_TAGS",
          "diagnosisMap": {
            "v1.4.3": {
              "misconceptionId": "MC_DEVOPS_SEMANTIC_VERSIONING_GIT_TAGS",
              "errorExplanation": "v1.4.3 is a PATCH bump. A MINOR bump increments the middle number and resets patch to 0 -> v1.5.0.",
              "recoveryPath": {
                "simplerExplanation": "Minor increments MINOR and resets PATCH -> v1.5.0.",
                "guidedFixPrompt": "Type v1.5.0"
              }
            }
          }
        }
      },
      {
        "id": "devops-d11-b2-conventional-commits-parser",
        "day": 11,
        "blockNumber": 2,
        "title": "Conventional Commits & Automated Release Notes",
        "conceptBudget": {
          "primaryConcept": "Conventional Commits",
          "supportingTerms": [
            "`fix: message` (Bumps PATCH)",
            "`feat: message` (Bumps MINOR)",
            "`feat!: message` or `BREAKING CHANGE:` (Bumps MAJOR)",
            "Semantic Release automated tagging"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d11-b1-semver-major-minor-patch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "commit_parser_demo.js",
            "initialCode": "function classifyCommit(message) {\n  if (message.includes('BREAKING CHANGE') || message.startsWith('feat!:') || message.startsWith('fix!:')) return 'MAJOR';\n  if (message.startsWith('feat:')) return 'MINOR';\n  if (message.startsWith('fix:')) return 'PATCH';\n  return 'NONE';\n}\n\nconsole.log('feat: add dark mode support:', classifyCommit('feat: add dark mode support'));\nconsole.log('feat!: drop node 16 support:', classifyCommit('feat!: drop node 16 support'));\nconsole.log('fix: prevent null pointer exception:', classifyCommit('fix: prevent null pointer exception'));",
            "expectedOutput": "feat: add dark mode support: MINOR\nfeat!: drop node 16 support: MAJOR\nfix: prevent null pointer exception: PATCH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What SemVer bump type is triggered by the commit message `feat!: drop node 16 support`?",
          "expectedStringOutput": "MAJOR",
          "acceptableAnswers": [
            "MAJOR",
            "feat!: drop node 16 support: MAJOR"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_SEMANTIC_VERSIONING_GIT_TAGS",
          "diagnosisMap": {
            "MINOR": {
              "misconceptionId": "MC_DEVOPS_SEMANTIC_VERSIONING_GIT_TAGS",
              "errorExplanation": "The exclamation mark `feat!:` indicates a breaking change, which triggers a MAJOR version bump.",
              "recoveryPath": {
                "simplerExplanation": "Exclamation mark indicates breaking change -> MAJOR.",
                "guidedFixPrompt": "Type MAJOR"
              }
            }
          }
        }
      },
      {
        "id": "devops-d11-b3-git-tag-release-triggers",
        "day": 11,
        "blockNumber": 3,
        "title": "Git Tag Push Triggers in CI (`tags: ['v*']`)",
        "conceptBudget": {
          "primaryConcept": "Git Tag CI Triggers",
          "supportingTerms": [
            "`on: push: tags: ['v*']`",
            "Triggering production release workflows only on immutable git tags",
            "Preventing accidental deployment of untagged feature branches"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d11-b2-conventional-commits-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Tag Trigger Workflow",
            "codeSnippet": "on:\n  push:\n    tags:\n      - 'v*'\n\njobs:\n  publish:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Build & Publish Docker Image\n        run: docker build -t ghcr.io/pinit/api:${{ github.ref_name }} .",
            "lineNotes": {
              "4": "Matches tags like v1.0.0, v2.1.3.",
              "11": "Uses github.ref_name to tag Docker image with git release tag."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tag_trigger_demo.js",
            "initialCode": "function isReleaseTag(gitRef) {\n  return /^refs\\/tags\\/v\\d+\\.\\d+\\.\\d+$/.test(gitRef);\n}\n\nconsole.log('Release Tag refs/tags/v1.2.0:', isReleaseTag('refs/tags/v1.2.0'));\nconsole.log('Branch Push refs/heads/main:', isReleaseTag('refs/heads/main'));",
            "expectedOutput": "Release Tag refs/tags/v1.2.0: true\nBranch Push refs/heads/main: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do enterprise production deployment pipelines trigger strictly on Git Tags (`refs/tags/v*`) rather than direct pushes to `main`?",
          "options": [
            "To guarantee that production releases correspond to immutable, audited version numbers that can be easily tracked and rolled back to exact git commits",
            "Because branches don't have git commits",
            "To make releases take longer"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_SEMANTIC_VERSIONING_GIT_TAGS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_SEMANTIC_VERSIONING_GIT_TAGS",
              "errorExplanation": "Immutable git tags ensure auditable, reproducible release artifacts.",
              "recoveryPath": {
                "simplerExplanation": "Git tags ensure immutable, reproducible releases.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Container Registry Security & Vulnerability Scanning (Trivy/Clair)",
    "overviewMetaphor": "Container Vulnerability Scanning is airport baggage x-ray screening: before any luggage (Docker container image) is allowed onto the commercial airliner (Production Kubernetes Cluster), the Trivy security scanner x-rays every single dependency layer; if a known explosive (Critical CVE vulnerability) is detected inside the image, the conveyor belt halts immediately (Pipeline Blocked).",
    "blocks": [
      {
        "id": "devops-d12-b1-trivy-cve-severity-scanner",
        "day": 12,
        "blockNumber": 1,
        "title": "Automated CVE Scanning with Trivy in GitHub Actions",
        "conceptBudget": {
          "primaryConcept": "Trivy Container Scanning",
          "supportingTerms": [
            "CVE (Common Vulnerabilities and Exposures)",
            "Severity Levels: `UNKNOWN`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`",
            "`--exit-code 1 --severity CRITICAL`",
            "Breaking CI on critical CVEs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d4-b1-multi-stage-stages-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Trivy Security Step in GitHub Actions",
            "codeSnippet": "- name: Run Trivy Vulnerability Scanner\n  uses: aquasecurity/trivy-action@master\n  with:\n    image-ref: 'ghcr.io/pinit/api:latest'\n    format: 'table'\n    exit-code: '1'\n    ignore-unfixed: true\n    severity: 'CRITICAL,HIGH'",
            "lineNotes": {
              "6": "Returns exit code 1 (fails CI build) if critical/high vulnerabilities are found.",
              "7": "Ignores unfixed CVEs to prevent blocking builds on unpatchable upstream issues."
            }
          },
          {
            "type": "runnable_code",
            "filename": "trivy_eval_demo.js",
            "initialCode": "function evaluateTrivyScan(vulnerabilities) {\n  const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;\n  return {\n    exitCode: criticalCount > 0 ? 1 : 0,\n    buildPassed: criticalCount === 0,\n    criticalCount\n  };\n}\n\nconsole.log('Clean Scan:', JSON.stringify(evaluateTrivyScan([{ severity: 'LOW' }])));\nconsole.log('Vulnerable Scan:', JSON.stringify(evaluateTrivyScan([{ severity: 'CRITICAL', cve: 'CVE-2024-9981' }])));",
            "expectedOutput": "Clean Scan: {\"exitCode\":0,\"buildPassed\":true,\"criticalCount\":0}\nVulnerable Scan: {\"exitCode\":1,\"buildPassed\":false,\"criticalCount\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What exit code does Trivy return when a `CRITICAL` severity CVE is detected with `--exit-code 1`?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "exitCode: 1",
            "exitCode\":1"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CONTAINER_REGISTRY_IMAGE_SECURITY_SCAN",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_DEVOPS_CONTAINER_REGISTRY_IMAGE_SECURITY_SCAN",
              "errorExplanation": "Exit code 1 signals a build failure to GitHub Actions, blocking deployment.",
              "recoveryPath": {
                "simplerExplanation": "Critical CVEs return exit code 1 to fail the build.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "devops-d12-b2-image-signing-cosign",
        "day": 12,
        "blockNumber": 2,
        "title": "Cryptographic Container Image Signing with Sigstore Cosign",
        "conceptBudget": {
          "primaryConcept": "Container Image Signing (Cosign)",
          "supportingTerms": [
            "Keyless signing via OIDC (Sigstore)",
            "Verifying image provenance & integrity before Kubernetes admission",
            "Preventing man-in-the-middle registry tampering"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d12-b1-trivy-cve-severity-scanner",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cosign_verify_demo.js",
            "initialCode": "function verifyImageSignature(imageDigest, signatureValid) {\n  return signatureValid \n    ? { admitted: true, status: 'SIGNATURE_VERIFIED_BY_COSIGN' }\n    : { admitted: false, status: 'UNTRUSTED_UNSIGNED_IMAGE_REJECTED' };\n}\n\nconsole.log('Signed Production Image:', verifyImageSignature('sha256:abc123', true).status);\nconsole.log('Tampered Unsigned Image:', verifyImageSignature('sha256:xyz999', false).status);",
            "expectedOutput": "Signed Production Image: SIGNATURE_VERIFIED_BY_COSIGN\nTampered Unsigned Image: UNTRUSTED_UNSIGNED_IMAGE_REJECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What admission status is returned when Kubernetes validates a cryptographic Cosign signature on a container image?",
          "expectedStringOutput": "SIGNATURE_VERIFIED_BY_COSIGN",
          "acceptableAnswers": [
            "SIGNATURE_VERIFIED_BY_COSIGN",
            "Signed Production Image: SIGNATURE_VERIFIED_BY_COSIGN"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CONTAINER_REGISTRY_IMAGE_SECURITY_SCAN",
          "diagnosisMap": {
            "UNTRUSTED": {
              "misconceptionId": "MC_DEVOPS_CONTAINER_REGISTRY_IMAGE_SECURITY_SCAN",
              "errorExplanation": "Valid signatures are admitted with SIGNATURE_VERIFIED_BY_COSIGN.",
              "recoveryPath": {
                "simplerExplanation": "Valid signature = SIGNATURE_VERIFIED_BY_COSIGN.",
                "guidedFixPrompt": "Type SIGNATURE_VERIFIED_BY_COSIGN"
              }
            }
          }
        }
      },
      {
        "id": "devops-d12-b3-ghcr-docker-login",
        "day": 12,
        "blockNumber": 3,
        "title": "Authenticating to GHCR with `GITHUB_TOKEN`",
        "conceptBudget": {
          "primaryConcept": "Container Registry Authentication",
          "supportingTerms": [
            "`ghcr.io` (GitHub Container Registry)",
            "`docker/login-action@v3`",
            "Scoped `packages: write` permissions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d12-b2-image-signing-cosign",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GHCR Login Step",
            "codeSnippet": "- name: Log in to GitHub Container Registry\n  uses: docker/login-action@v3\n  with:\n    registry: ghcr.io\n    username: ${{ github.actor }}\n    password: ${{ secrets.GITHUB_TOKEN }}",
            "lineNotes": {
              "4": "Target container registry URL.",
              "6": "Uses automatic ephemeral GITHUB_TOKEN."
            }
          },
          {
            "type": "runnable_code",
            "filename": "registry_auth_demo.js",
            "initialCode": "function getRegistryAuth(registry, hasToken) {\n  return hasToken ? `AUTHENTICATED_TO_${registry.toUpperCase()}` : 'AUTH_FAILED_MISSING_TOKEN';\n}\n\nconsole.log('GHCR Auth Result:', getRegistryAuth('ghcr.io', true));",
            "expectedOutput": "GHCR Auth Result: AUTHENTICATED_TO_GHCR.IO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is `secrets.GITHUB_TOKEN` preferred over long-lived personal access tokens (PATs) for pushing images to GHCR in GitHub Actions?",
          "options": [
            "Because `GITHUB_TOKEN` is ephemeral, automatically scoped only to the current repository, and expires automatically when the pipeline finishes, eliminating leaked long-term credential risks",
            "Because PATs cost $50 per month",
            "Because GITHUB_TOKEN never expires"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_CONTAINER_REGISTRY_IMAGE_SECURITY_SCAN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_CONTAINER_REGISTRY_IMAGE_SECURITY_SCAN",
              "errorExplanation": "Ephemeral tokens scoped per-job eliminate long-term credential leakage risks.",
              "recoveryPath": {
                "simplerExplanation": "Ephemeral scoped tokens prevent credential theft.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Automated Staging Deployments, SSH Bastions & Environment Promotion",
    "overviewMetaphor": "Environment Promotion is a theatrical rehearsal schedule: Dev is the writer's desk (rapid local iteration); Staging is the full dress rehearsal on the real stage with lighting, microphones, and costumes (identical to production); Production is Opening Night with 2,000 live ticket holders; code never goes to Opening Night without a clean dress rehearsal.",
    "blocks": [
      {
        "id": "devops-d13-b1-staging-environment-parity",
        "day": 13,
        "blockNumber": 1,
        "title": "Environment Parity (Dev $\\to$ Staging $\\to$ Production)",
        "conceptBudget": {
          "primaryConcept": "Environment Promotion Lifecycle",
          "supportingTerms": [
            "Automated deployment to Staging on merge to main",
            "Manual environment protection rules (GitHub Environments)",
            "100% architectural parity between Staging and Production"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d1-b1-twelve-factor-config-env",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Promotion Pipeline Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Merge PR -> main: Auto-deploy to STAGING environment",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Run E2E Cypress/Playwright Tests on Staging -> All Green",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "GitHub Environment Protection Rule: Awaits Lead Engineer Approval Click",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Manual Approval Granted -> Promotes exact Docker image tag to PRODUCTION",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "promotion_flow_demo.js",
            "initialCode": "function evaluatePromotion(stagingTestsGreen, manualApprovalGranted) {\n  if (!stagingTestsGreen) return { targetEnv: 'STAGING', status: 'PROMOTION_HALTED_TESTS_FAILED' };\n  if (!manualApprovalGranted) return { targetEnv: 'STAGING', status: 'AWAITING_LEAD_APPROVAL' };\n  return { targetEnv: 'PRODUCTION', status: 'PROMOTED_TO_PRODUCTION' };\n}\n\nconsole.log('Staging passed, no approval yet:', evaluatePromotion(true, false).status);\nconsole.log('Staging passed, approval clicked:', evaluatePromotion(true, true).status);",
            "expectedOutput": "Staging passed, no approval yet: AWAITING_LEAD_APPROVAL\nStaging passed, approval clicked: PROMOTED_TO_PRODUCTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when staging tests pass but the lead engineer has not yet clicked approval?",
          "expectedStringOutput": "AWAITING_LEAD_APPROVAL",
          "acceptableAnswers": [
            "AWAITING_LEAD_APPROVAL",
            "Staging passed, no approval yet: AWAITING_LEAD_APPROVAL"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "PROMOTED_TO_PRODUCTION": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "Promotion to production is gated until manual approval is clicked.",
              "recoveryPath": {
                "simplerExplanation": "Requires manual approval first -> AWAITING_LEAD_APPROVAL.",
                "guidedFixPrompt": "Type AWAITING_LEAD_APPROVAL"
              }
            }
          }
        }
      },
      {
        "id": "devops-d13-b2-ssh-agent-bastion-deployment",
        "day": 13,
        "blockNumber": 2,
        "title": "Automated SSH Deployment via Bastion Jump Hosts",
        "conceptBudget": {
          "primaryConcept": "SSH Deployment Automation",
          "supportingTerms": [
            "`webfactory/ssh-agent` GitHub Action",
            "Deploying to private VPC servers via Bastion Jump Host (`ProxyJump`)",
            "Zero public IP addresses on production servers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d13-b1-staging-environment-parity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SSH ProxyJump Configuration",
            "codeSnippet": "# ~/.ssh/config\nHost bastion\n  HostName bastion.pinit.io\n  User ec2-user\n  IdentityFile ~/.ssh/deploy_key\n\nHost prod-api-internal\n  HostName 10.0.2.50\n  User node\n  ProxyJump bastion\n  IdentityFile ~/.ssh/deploy_key",
            "lineNotes": {
              "2": "Public entry point bastion host.",
              "9": "ProxyJump tunnels SSH session through bastion to private server 10.0.2.50."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ssh_jump_demo.js",
            "initialCode": "function routeSshDeployment(targetIp, isPrivateSubnet) {\n  return isPrivateSubnet\n    ? { route: `SSH -> BASTION -> ${targetIp}`, status: 'SECURE_PROXY_JUMP' }\n    : { route: `SSH -> DIRECT_${targetIp}`, status: 'DIRECT_CONNECT' };\n}\n\nconsole.log('Deploying to Private 10.0.2.50:', routeSshDeployment('10.0.2.50', true).route);",
            "expectedOutput": "Deploying to Private 10.0.2.50: SSH -> BASTION -> 10.0.2.50",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does the CI deployment agent reach private server `10.0.2.50` without a public IP?",
          "expectedStringOutput": "SSH -> BASTION -> 10.0.2.50",
          "acceptableAnswers": [
            "SSH -> BASTION -> 10.0.2.50",
            "Via Bastion",
            "ProxyJump"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "DIRECT": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "Private servers lack public IPs and must be accessed via SSH Bastion ProxyJump.",
              "recoveryPath": {
                "simplerExplanation": "Tunnels through Bastion: SSH -> BASTION -> 10.0.2.50.",
                "guidedFixPrompt": "Type SSH -> BASTION -> 10.0.2.50"
              }
            }
          }
        }
      },
      {
        "id": "devops-d13-b3-environment-protection-rules",
        "day": 13,
        "blockNumber": 3,
        "title": "GitHub Environment Protection Rules & Reviewers",
        "conceptBudget": {
          "primaryConcept": "Environment Protection Rules",
          "supportingTerms": [
            "Designated Required Reviewers",
            "Deployment branches restriction (Only `main`)",
            "Environment-specific secret isolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d13-b2-ssh-agent-bastion-deployment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "env_rules_demo.js",
            "initialCode": "function canDeployToProduction(branch, isApprovedByLead) {\n  if (branch !== 'main') return { allowed: false, error: 'ONLY_MAIN_ALLOWED_FOR_PROD' };\n  if (!isApprovedByLead) return { allowed: false, error: 'MISSING_REQUIRED_REVIEWER_APPROVAL' };\n  return { allowed: true, status: 'DEPLOYING_TO_PROD' };\n}\n\nconsole.log('Feature branch to Prod:', canDeployToProduction('feat/xyz', true).error);\nconsole.log('Main branch approved by lead:', canDeployToProduction('main', true).status);",
            "expectedOutput": "Feature branch to Prod: ONLY_MAIN_ALLOWED_FOR_PROD\nMain branch approved by lead: DEPLOYING_TO_PROD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should Production Environment secrets in GitHub be restricted exclusively to the `main` branch with required reviewers?",
          "options": [
            "To prevent untrusted code in random pull requests or feature branches from accessing live production database credentials or triggering unauthorized deployments",
            "Because GitHub charges extra for feature branches",
            "Because environment secrets only work on main"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "Environment protection prevents PR code from reading production secrets.",
              "recoveryPath": {
                "simplerExplanation": "Restricting secrets protects production credentials from PR leaks.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Automated Smoke Testing & Synthetic Health Verification",
    "overviewMetaphor": "Automated Smoke Testing is testing a newly repaired car before handing the keys to the customer: turn the ignition key (`/healthz` 200 OK); honk the horn (`/api/v1/auth` token issued); test the brakes (`/api/v1/checkout` dry-run transaction); if any of these 3 checks fails, you do not let the customer drive off (Automated Immediate Rollback).",
    "blocks": [
      {
        "id": "devops-d14-b1-synthetic-smoke-probes",
        "day": 14,
        "blockNumber": 1,
        "title": "Synthetic Transaction Probes & SLA Latency Verification",
        "conceptBudget": {
          "primaryConcept": "Synthetic Smoke Testing",
          "supportingTerms": [
            "Critical User Journeys (Login, Search, Checkout)",
            "Asserting HTTP 200 OK + Latency < 500ms",
            "Zero false positives via retry thresholds"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d13-b1-staging-environment-parity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "smoke_test_demo.js",
            "initialCode": "async function runSyntheticProbe(endpoint, mockLatencyMs, mockStatus) {\n  const isSuccess = mockStatus === 200 && mockLatencyMs < 500;\n  return {\n    endpoint,\n    isSuccess,\n    status: mockStatus,\n    latencyMs: mockLatencyMs\n  };\n}\n\nrunSyntheticProbe('/api/v1/health', 120, 200).then(res => {\n  console.log('Fast Health Check:', res.isSuccess);\n});\nrunSyntheticProbe('/api/v1/checkout', 850, 200).then(res => {\n  console.log('Slow Checkout (850ms > 500ms SLA):', res.isSuccess);\n});",
            "expectedOutput": "Fast Health Check: true\nSlow Checkout (850ms > 500ms SLA): false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does the synthetic smoke test pass when an endpoint returns HTTP 200 but takes 850ms (breaching the 500ms SLA)?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Slow Checkout (850ms > 500ms SLA): false"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
              "errorExplanation": "Smoke tests enforce both HTTP status (200) and performance SLAs (<500ms). Breaching SLA returns false.",
              "recoveryPath": {
                "simplerExplanation": "850ms breaches 500ms SLA -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "devops-d14-b2-automated-rollback-triggers",
        "day": 14,
        "blockNumber": 2,
        "title": "Automated Rollback Triggers on Post-Deployment Failure",
        "conceptBudget": {
          "primaryConcept": "Automated Rollback Trigger",
          "supportingTerms": [
            "Detecting post-deploy 5xx error spikes within 60s",
            "Automated deployment revert to previous stable tag",
            "Zero customer disruption duration"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d14-b1-synthetic-smoke-probes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Automated Rollback State Machine",
              "nodes": [
                {
                  "id": "1",
                  "label": "Deploy New Release v2.1.0 to Production",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Smoke Tests Fail (HTTP 500 on /checkout)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Pipeline catches exception -> Triggers rollback action",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Restores previous stable container tag v2.0.9 in 15 seconds!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rollback_eval_demo.js",
            "initialCode": "function executeDeploymentWithRollback(deployResult, prevStableTag) {\n  if (!deployResult.smokeTestsPassed) {\n    return {\n      currentRunningTag: prevStableTag,\n      status: 'DEPLOYMENT_FAILED_AUTOMATICALLY_ROLLED_BACK',\n      rollbackExecuted: true\n    };\n  }\n  return {\n    currentRunningTag: deployResult.newTag,\n    status: 'DEPLOYMENT_SUCCESSFUL',\n    rollbackExecuted: false\n  };\n}\n\nconst failedRelease = { newTag: 'v2.1.0', smokeTestsPassed: false };\nconsole.log('Outage Handling:', executeDeploymentWithRollback(failedRelease, 'v2.0.9').status);",
            "expectedOutput": "Outage Handling: DEPLOYMENT_FAILED_AUTOMATICALLY_ROLLED_BACK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action status is returned when post-deployment smoke tests fail?",
          "expectedStringOutput": "DEPLOYMENT_FAILED_AUTOMATICALLY_ROLLED_BACK",
          "acceptableAnswers": [
            "DEPLOYMENT_FAILED_AUTOMATICALLY_ROLLED_BACK",
            "Outage Handling: DEPLOYMENT_FAILED_AUTOMATICALLY_ROLLED_BACK"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
          "diagnosisMap": {
            "DEPLOYMENT_SUCCESSFUL": {
              "misconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
              "errorExplanation": "Failed smoke tests automatically trigger rollback, returning DEPLOYMENT_FAILED_AUTOMATICALLY_ROLLED_BACK.",
              "recoveryPath": {
                "simplerExplanation": "Failed smoke test triggers rollback.",
                "guidedFixPrompt": "Type DEPLOYMENT_FAILED_AUTOMATICALLY_ROLLED_BACK"
              }
            }
          }
        }
      },
      {
        "id": "devops-d14-b3-slack-pagerduty-ci-webhooks",
        "day": 14,
        "blockNumber": 3,
        "title": "Automated Slack & PagerDuty Webhook Alerts",
        "conceptBudget": {
          "primaryConcept": "CI/CD Incident Notifications",
          "supportingTerms": [
            "Posting formatted JSON payloads to Slack Webhooks",
            "Triggering PagerDuty on-call incidents on rollback events",
            "Including commit SHA and author in alert"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d14-b2-automated-rollback-triggers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "webhook_alert_demo.js",
            "initialCode": "function buildSlackAlert(status, version, commitAuthor) {\n  const isError = status.includes('FAILED');\n  return {\n    color: isError ? '#FF0000 (Red)' : '#36A64F (Green)',\n    message: `${isError ? '🚨 DEPLOYMENT FAILED' : '✅ DEPLOYMENT SUCCESS'}: ${version} by ${commitAuthor}`\n  };\n}\n\nconsole.log('Failed Alert:', buildSlackAlert('FAILED_ROLLED_BACK', 'v2.1.0', 'Alex').message);",
            "expectedOutput": "Failed Alert: 🚨 DEPLOYMENT FAILED: v2.1.0 by Alex",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should CI/CD pipelines broadcast structured webhook notifications to team communication channels (like Slack or Microsoft Teams)?",
          "options": [
            "To provide immediate visibility to all engineering stakeholders regarding build failures, rollbacks, and successful production releases with actionable links",
            "Because Slack requires a message every hour",
            "To make developers read more emails"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_CI_TEST_AUTOMATION_PARALLEL_MATRIX",
              "errorExplanation": "Real-time chatops alerts ensure fast incident response across engineering teams.",
              "recoveryPath": {
                "simplerExplanation": "Provides real-time visibility and instant incident alerts.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete automated software factory: 1. Code push triggers multi-OS matrix testing (Node 18/20 on Ubuntu); 2. Multi-stage Docker build produces a 45MB image; 3. Trivy scans for zero critical CVEs; 4. Staging auto-deployment runs E2E smoke tests; 5. Lead approval promotes to Production with automated sub-second rollback protection.",
    "blocks": [
      {
        "id": "devops-d15-b1-enterprise-pipeline-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Enterprise CI/CD Pipeline Architectural Flow",
        "conceptBudget": {
          "primaryConcept": "Enterprise Pipeline Architecture",
          "supportingTerms": [
            "Matrix Unit Testing",
            "Docker Multi-Stage Build & Trivy Scan",
            "Staging Verification & Manual Approval Gate",
            "Production Release & Automated Rollback"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d14-b2-automated-rollback-triggers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "End-to-End Enterprise CI/CD Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Stage 1: Multi-OS Matrix Unit Tests & Linter (Node 18/20/22 on Ubuntu)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Stage 2: Multi-Stage Docker Image Build + Trivy CVE Security Gate",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Stage 3: Staging Deploy + Synthetic Smoke Test Suite (Passes!)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Stage 4: Manual Approval Gate -> Production Deploy with Automated Rollback",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "enterprise_pipeline_demo.js",
            "initialCode": "async function runEnterprisePipeline(stages) {\n  for (const s of stages) {\n    if (!s.passed) return { status: 'PIPELINE_FAILED', failedAt: s.name };\n  }\n  return { status: 'ENTERPRISE_PIPELINE_SUCCESS_PROD_DEPLOYED' };\n}\n\nconst stages = [\n  { name: 'MatrixTest', passed: true },\n  { name: 'TrivyScan', passed: true },\n  { name: 'StagingSmoke', passed: true },\n  { name: 'ProdDeploy', passed: true }\n];\nrunEnterprisePipeline(stages).then(res => {\n  console.log('Pipeline Outcome:', res.status);\n});",
            "expectedOutput": "Pipeline Outcome: ENTERPRISE_PIPELINE_SUCCESS_PROD_DEPLOYED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final status of the complete 4-stage enterprise pipeline when all stages pass?",
          "expectedStringOutput": "ENTERPRISE_PIPELINE_SUCCESS_PROD_DEPLOYED",
          "acceptableAnswers": [
            "ENTERPRISE_PIPELINE_SUCCESS_PROD_DEPLOYED",
            "Pipeline Outcome: ENTERPRISE_PIPELINE_SUCCESS_PROD_DEPLOYED"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "PIPELINE_FAILED": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "All stages pass successfully, returning ENTERPRISE_PIPELINE_SUCCESS_PROD_DEPLOYED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENTERPRISE_PIPELINE_SUCCESS_PROD_DEPLOYED.",
                "guidedFixPrompt": "Type ENTERPRISE_PIPELINE_SUCCESS_PROD_DEPLOYED"
              }
            }
          }
        }
      },
      {
        "id": "devops-d15-b2-pipeline-timing-sla-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Pipeline Speed & DORA Metrics (Lead Time for Changes)",
        "conceptBudget": {
          "primaryConcept": "DORA Metrics",
          "supportingTerms": [
            "Lead Time for Changes (< 15 minutes from commit to prod)",
            "Deployment Frequency (Multiple times per day)",
            "Change Failure Rate (< 5%)",
            "Mean Time to Recovery (MTTR < 10 mins)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d15-b1-enterprise-pipeline-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "4 DORA Metrics Elite Benchmarks",
              "boxes": [
                {
                  "label": "1. Deployment Frequency",
                  "value": "Multiple deploys per day on demand",
                  "varType": "Velocity",
                  "isUpdated": false
                },
                {
                  "label": "2. Lead Time for Changes",
                  "value": "Less than 1 hour from code commit to production",
                  "varType": "Speed",
                  "isUpdated": false
                },
                {
                  "label": "3. Change Failure Rate",
                  "value": "0% - 15% (Low failure rates)",
                  "varType": "Quality",
                  "isUpdated": false
                },
                {
                  "label": "4. Mean Time to Recovery (MTTR)",
                  "value": "Less than 1 hour (Fast automated rollbacks)",
                  "varType": "Stability",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dora_audit_demo.js",
            "initialCode": "function evaluateDoraTier(leadTimeMin, changeFailureRatePercent, mttrMin) {\n  if (leadTimeMin < 60 && changeFailureRatePercent < 15 && mttrMin < 60) {\n    return 'ELITE_PERFORMING_DEVOPS_TEAM';\n  }\n  return 'STANDARD_TEAM';\n}\n\nconsole.log('PinIT Team DORA Benchmark:', evaluateDoraTier(12, 2, 5));",
            "expectedOutput": "PinIT Team DORA Benchmark: ELITE_PERFORMING_DEVOPS_TEAM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What DORA benchmark tier is achieved with 12-minute lead time, 2% failure rate, and 5-minute MTTR?",
          "expectedStringOutput": "ELITE_PERFORMING_DEVOPS_TEAM",
          "acceptableAnswers": [
            "ELITE_PERFORMING_DEVOPS_TEAM",
            "PinIT Team DORA Benchmark: ELITE_PERFORMING_DEVOPS_TEAM",
            "Elite"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "STANDARD": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "Sub-hour lead times and sub-hour MTTR classify a team as ELITE_PERFORMING_DEVOPS_TEAM.",
              "recoveryPath": {
                "simplerExplanation": "Matches ELITE_PERFORMING_DEVOPS_TEAM.",
                "guidedFixPrompt": "Type ELITE_PERFORMING_DEVOPS_TEAM"
              }
            }
          }
        }
      },
      {
        "id": "devops-d15-b3-milestone2-devops-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 CI/CD Pipeline Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Production GitHub Actions Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d15-b2-pipeline-timing-sla-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DEVOPS_GITHUB_ACTIONS_WORKFLOW_SYNTAX",
              "errorExplanation": "Matches milestone header.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Kubernetes Core Architecture: Pods, ReplicaSets & Deployments",
    "overviewMetaphor": "Kubernetes is a fleet captain commanding a cargo armada: the Control Plane is the admiral's flagship (`kube-apiserver` receives orders, `etcd` is the master logbook, `kube-scheduler` assigns cargo to ships); a Pod is a single shipping container; a ReplicaSet is a standing order: \"Keep exactly 5 identical cargo pods floating at all times; if an enemy torpedo sinks Pod #3, spawn Pod #6 immediately in 2 seconds\".",
    "blocks": [
      {
        "id": "devops-d16-b1-k8s-control-plane-architecture",
        "day": 16,
        "blockNumber": 1,
        "title": "Kubernetes Control Plane vs Worker Node Components",
        "conceptBudget": {
          "primaryConcept": "Kubernetes Topology",
          "supportingTerms": [
            "Control Plane: `kube-apiserver`, `etcd`, `kube-scheduler`, `kube-controller-manager`",
            "Worker Nodes: `kubelet` (Node agent), `kube-proxy` (IP packet routing), `containerd`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d3-b1-docker-layer-caching-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Kubernetes Control Plane & Worker Node Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Developer: kubectl apply -f deployment.yaml",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "kube-apiserver validates YAML & saves state into etcd distributed key-value store",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "kube-scheduler analyzes node CPU/RAM capacity and assigns Pods to Worker Node 1 & 2",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Worker Node kubelet instructs containerd runtime to pull image & start container",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "k8s_arch_demo.js",
            "initialCode": "function routeK8sRequest(component, action) {\n  if (component === 'kube-apiserver') return 'AUTHENTICATED_AND_PERSISTED_TO_ETCD';\n  if (component === 'kube-scheduler') return 'ASSIGNED_POD_TO_OPTIMAL_WORKER_NODE';\n  if (component === 'kubelet') return 'CONTAINER_STARTED_ON_WORKER_NODE';\n  return 'UNKNOWN_COMPONENT';\n}\n\nconsole.log('Scheduler Action:', routeK8sRequest('kube-scheduler', 'schedule'));\nconsole.log('Kubelet Action:', routeK8sRequest('kubelet', 'start'));",
            "expectedOutput": "Scheduler Action: ASSIGNED_POD_TO_OPTIMAL_WORKER_NODE\nKubelet Action: CONTAINER_STARTED_ON_WORKER_NODE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which Kubernetes control plane component is responsible for analyzing node CPU/RAM resource capacity and deciding which worker node should run a newly created Pod?",
          "options": [
            "`kube-scheduler`",
            "`kube-proxy`",
            "`etcd`"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_K8S_POD_DEPLOYMENT_REPLICASET",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_K8S_POD_DEPLOYMENT_REPLICASET",
              "errorExplanation": "kube-proxy handles IP routing on worker nodes. kube-scheduler places pods onto worker nodes.",
              "recoveryPath": {
                "simplerExplanation": "kube-scheduler assigns pods to nodes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d16-b2-declarative-deployment-manifest",
        "day": 16,
        "blockNumber": 2,
        "title": "Declarative Deployment YAML & ReplicaSet Reconciliation",
        "conceptBudget": {
          "primaryConcept": "Declarative Deployment",
          "supportingTerms": [
            "`kind: Deployment`",
            "`spec.replicas: 3`",
            "`spec.selector.matchLabels`",
            "Reconciliation Loop (Actual State $\\to$ Desired State)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d16-b1-k8s-control-plane-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Production Kubernetes Deployment (`deployment.yaml`)",
            "codeSnippet": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: pinit-api\n  labels: { app: pinit-api }\nspec:\n  replicas: 3\n  selector:\n    matchLabels: { app: pinit-api }\n  template:\n    metadata:\n      labels: { app: pinit-api }\n    spec:\n      containers:\n        - name: api\n          image: ghcr.io/pinit/api:v1.2.0\n          ports: [{ containerPort: 8080 }]\n          resources:\n            limits: { cpu: '500m', memory: '512Mi' }\n            requests: { cpu: '100m', memory: '128Mi' }",
            "lineNotes": {
              "6": "Maintains desired state of 3 identical pods.",
              "8": "Label selector binding ReplicaSet controller to pod template labels.",
              "17": "Guarantees resource requests and caps resource limits."
            }
          },
          {
            "type": "runnable_code",
            "filename": "replicaset_sim.js",
            "initialCode": "function reconcilePods(desiredCount, activePods) {\n  const delta = desiredCount - activePods.length;\n  if (delta > 0) {\n    return { action: 'SPAWN_PODS', count: delta, state: `${activePods.length} -> ${desiredCount}` };\n  }\n  if (delta < 0) {\n    return { action: 'TERMINATE_PODS', count: Math.abs(delta), state: `${activePods.length} -> ${desiredCount}` };\n  }\n  return { action: 'IN_SYNC', count: 0, state: 'DESIRED_EQUALS_ACTUAL' };\n}\n\nconsole.log('Pod Crashed (Desired 3, Active 2):', JSON.stringify(reconcilePods(3, ['pod-1', 'pod-2'])));\nconsole.log('Scaled Down (Desired 3, Active 5):', JSON.stringify(reconcilePods(3, ['p1', 'p2', 'p3', 'p4', 'p5'])));",
            "expectedOutput": "Pod Crashed (Desired 3, Active 2): {\"action\":\"SPAWN_PODS\",\"count\":1,\"state\":\"2 -> 3\"}\nScaled Down (Desired 3, Active 5): {\"action\":\"TERMINATE_PODS\",\"count\":2,\"state\":\"5 -> 3\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action does the Kubernetes ReplicaSet controller take when desired replicas is 3 and only 2 pods are active?",
          "expectedStringOutput": "SPAWN_PODS",
          "acceptableAnswers": [
            "SPAWN_PODS",
            "action: SPAWN_PODS",
            "action\":\"SPAWN_PODS\""
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_POD_DEPLOYMENT_REPLICASET",
          "diagnosisMap": {
            "IN_SYNC": {
              "misconceptionId": "MC_DEVOPS_K8S_POD_DEPLOYMENT_REPLICASET",
              "errorExplanation": "2 != 3; the controller immediately executes SPAWN_PODS to reconcile the difference.",
              "recoveryPath": {
                "simplerExplanation": "Spawns 1 replacement pod (SPAWN_PODS).",
                "guidedFixPrompt": "Type SPAWN_PODS"
              }
            }
          }
        }
      },
      {
        "id": "devops-d16-b3-rolling-update-zero-downtime",
        "day": 16,
        "blockNumber": 3,
        "title": "Rolling Updates: `maxSurge` & `maxUnavailable`",
        "conceptBudget": {
          "primaryConcept": "RollingUpdate Strategy",
          "supportingTerms": [
            "`maxSurge: 25%` (Max additional temporary pods created during rollout)",
            "`maxUnavailable: 0` (Zero pods terminated until replacement is healthy)",
            "Zero-downtime version upgrade"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d16-b2-declarative-deployment-manifest",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "surge_calc_demo.js",
            "initialCode": "function calculateRollingCapacity(replicas, maxSurgePercent, maxUnavailable) {\n  const maxSurgePods = Math.ceil(replicas * (maxSurgePercent / 100));\n  const maxPeakCapacity = replicas + maxSurgePods;\n  const minRunningCapacity = replicas - maxUnavailable;\n  return { maxPeakCapacity, minRunningCapacity, maxSurgePods };\n}\n\nconsole.log('4 Replicas (maxSurge: 25%, maxUnavailable: 0):', JSON.stringify(calculateRollingCapacity(4, 25, 0)));",
            "expectedOutput": "4 Replicas (maxSurge: 25%, maxUnavailable: 0): {\"maxPeakCapacity\":5,\"minRunningCapacity\":4,\"maxSurgePods\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "With 4 replicas and `maxUnavailable: 0`, what is the minimum number of running healthy pods guaranteed at all times during a rollout?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4 pods",
            "minRunningCapacity\":4"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_POD_DEPLOYMENT_REPLICASET",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DEVOPS_K8S_POD_DEPLOYMENT_REPLICASET",
              "errorExplanation": "maxUnavailable: 0 guarantees that minRunningCapacity never drops below the base 4 replicas.",
              "recoveryPath": {
                "simplerExplanation": "Zero unavailable guarantees 4 running pods.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Kubernetes Networking: ClusterIP, NodePort & LoadBalancer Services",
    "overviewMetaphor": "Kubernetes Services are a corporate office phone system: individual employee pods move desks and get new personal extension numbers every time they restart (Ephemeral Pod IPs); a Kubernetes Service is the permanent Main Reception Desk (`pinit-api-service:8080`) with a static internal number (`ClusterIP`); callers dial the main reception, which automatically round-robins the call to whoever is currently sitting at the desk.",
    "blocks": [
      {
        "id": "devops-d17-b1-clusterip-internal-service",
        "day": 17,
        "blockNumber": 1,
        "title": "ClusterIP: Internal East-West Microservice Discovery",
        "conceptBudget": {
          "primaryConcept": "ClusterIP Service",
          "supportingTerms": [
            "Default Service Type (`ClusterIP`)",
            "Internal Virtual IP (VIP) allocated by kube-proxy",
            "CoreDNS resolution (`<service-name>.<namespace>.svc.cluster.local`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d16-b2-declarative-deployment-manifest",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ClusterIP Service Manifest (`service.yaml`)",
            "codeSnippet": "apiVersion: v1\nkind: Service\nmetadata:\n  name: user-service\nspec:\n  type: ClusterIP\n  selector:\n    app: user-service\n  ports:\n    - protocol: TCP\n      port: 80\n      targetPort: 8080",
            "lineNotes": {
              "6": "Default internal-only ClusterIP type.",
              "7": "Matches all pods with label app: user-service.",
              "11": "Service listens on port 80 and forwards packets to container port 8080."
            }
          },
          {
            "type": "runnable_code",
            "filename": "clusterip_dns_demo.js",
            "initialCode": "function formatK8sInternalDns(serviceName, namespace = 'default') {\n  return `${serviceName}.${namespace}.svc.cluster.local`;\n}\n\nconsole.log('Internal DNS Endpoint:', formatK8sInternalDns('user-service', 'prod'));",
            "expectedOutput": "Internal DNS Endpoint: user-service.prod.svc.cluster.local",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can a client on the public internet directly send HTTP requests to a Kubernetes `ClusterIP` service IP?",
          "options": [
            "No, ClusterIP virtual IPs are strictly internal to the Kubernetes virtual network and are accessible only by Pods inside the cluster",
            "Yes, ClusterIP is public by default",
            "Only on weekends"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_K8S_SERVICE_CLUSTERIP_NODEPORT_LOADBALANCER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_K8S_SERVICE_CLUSTERIP_NODEPORT_LOADBALANCER",
              "errorExplanation": "ClusterIP is accessible only from within the Kubernetes cluster network.",
              "recoveryPath": {
                "simplerExplanation": "ClusterIP is strictly internal only.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d17-b2-nodeport-vs-loadbalancer",
        "day": 17,
        "blockNumber": 2,
        "title": "NodePort (30000-32767) vs Cloud LoadBalancer Services",
        "conceptBudget": {
          "primaryConcept": "External Kubernetes Services",
          "supportingTerms": [
            "NodePort (Opens static port on every worker node's IP in 30000-32767 range)",
            "LoadBalancer (Provisions AWS NLB/ALB or GCP Cloud Load Balancer with public IP)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d17-b1-clusterip-internal-service",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Service Types Hierarchy",
              "boxes": [
                {
                  "label": "1. ClusterIP (Default)",
                  "value": "Internal ONLY -> Accessible by pods inside cluster via CoreDNS",
                  "varType": "Internal VIP",
                  "isUpdated": false
                },
                {
                  "label": "2. NodePort",
                  "value": "Node IP:30000-32767 -> Opens dedicated port on every worker node",
                  "varType": "Worker Port",
                  "isUpdated": false
                },
                {
                  "label": "3. LoadBalancer",
                  "value": "Public Cloud IP -> Automatically provisions AWS ALB/NLB in front of NodePorts",
                  "varType": "Public Cloud LB",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "service_type_picker.js",
            "initialCode": "function pickServiceType(isPublicFacing, usesIngressController) {\n  if (usesIngressController) return 'ClusterIP (Ingress routes traffic into ClusterIP)';\n  if (isPublicFacing) return 'LoadBalancer (Provisions Public AWS NLB)';\n  return 'ClusterIP (Internal Microservice Only)';\n}\n\nconsole.log('Public App behind Ingress:', pickServiceType(true, true));\nconsole.log('Standalone Public Service:', pickServiceType(true, false));",
            "expectedOutput": "Public App behind Ingress: ClusterIP (Ingress routes traffic into ClusterIP)\nStandalone Public Service: LoadBalancer (Provisions Public AWS NLB)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard port range allocated for Kubernetes `NodePort` services across all worker nodes?",
          "expectedStringOutput": "30000-32767",
          "acceptableAnswers": [
            "30000-32767",
            "30000 to 32767",
            "30000 - 32767"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_SERVICE_CLUSTERIP_NODEPORT_LOADBALANCER",
          "diagnosisMap": {
            "80-443": {
              "misconceptionId": "MC_DEVOPS_K8S_SERVICE_CLUSTERIP_NODEPORT_LOADBALANCER",
              "errorExplanation": "Standard NodePort allocation uses the high unprivileged port range 30000-32767.",
              "recoveryPath": {
                "simplerExplanation": "NodePort range is 30000-32767.",
                "guidedFixPrompt": "Type 30000-32767"
              }
            }
          }
        }
      },
      {
        "id": "devops-d17-b3-endpointslice-kube-proxy-iptables",
        "day": 17,
        "blockNumber": 3,
        "title": "EndpointSlices & kube-proxy IPVS / iptables Modes",
        "conceptBudget": {
          "primaryConcept": "kube-proxy Packet Forwarding",
          "supportingTerms": [
            "EndpointSlices (Scalable tracking of active healthy Pod IPs)",
            "iptables mode vs IPVS (IP Virtual Server) mode",
            "Sub-millisecond connection routing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d17-b2-nodeport-vs-loadbalancer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "endpointslice_demo.js",
            "initialCode": "function resolveHealthyEndpoints(endpoints) {\n  return endpoints.filter(ep => ep.ready).map(ep => ep.ip);\n}\n\nconst rawEndpoints = [\n  { ip: '10.244.1.15', ready: true },\n  { ip: '10.244.2.80', ready: false }, // Pod in CrashLoop\n  { ip: '10.244.3.42', ready: true }\n];\nconsole.log('Active EndpointSlice Targets:', JSON.stringify(resolveHealthyEndpoints(rawEndpoints)));",
            "expectedOutput": "Active EndpointSlice Targets: [\"10.244.1.15\",\"10.244.3.42\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does `kube-proxy` ensure that client traffic is never routed to a crashed or initializing Pod?",
          "options": [
            "By consulting the EndpointSlice controller, which automatically removes non-ready (`ready: false`) pod IPs from iptables/IPVS routing tables",
            "By pinging Google DNS",
            "By deleting the service"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_K8S_SERVICE_CLUSTERIP_NODEPORT_LOADBALANCER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_K8S_SERVICE_CLUSTERIP_NODEPORT_LOADBALANCER",
              "errorExplanation": "EndpointSlices filter out unready pods, preventing broken traffic routing.",
              "recoveryPath": {
                "simplerExplanation": "EndpointSlices remove unready pod IPs automatically.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Kubernetes Ingress Controllers & Automated TLS Termination",
    "overviewMetaphor": "A Kubernetes Ingress Controller is a smart traffic cop at a highway roundabout: instead of paying $25/month to build a separate highway ramp (Cloud LoadBalancer) for every single microservice (API, Auth, Search, Billing), you build one single central entrance (Ingress Controller); the traffic cop reads the HTTP host and path (`/api` $\to$ Service A, `/auth` $\to$ Service B) and checks TLS security passports with Let's Encrypt (`cert-manager`).",
    "blocks": [
      {
        "id": "devops-d18-b1-ingress-resource-rules-path",
        "day": 18,
        "blockNumber": 1,
        "title": "Ingress Rules: Host-Based & Path-Based HTTP Routing",
        "conceptBudget": {
          "primaryConcept": "Kubernetes Ingress Routing",
          "supportingTerms": [
            "`kind: Ingress`",
            "Host-based routing (`api.pinit.io` vs `app.pinit.io`)",
            "Path-based routing (`/api/v1` vs `/`)",
            "Ingress Controllers (Nginx, Traefik, AWS ALB)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d17-b1-clusterip-internal-service",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Production Ingress Manifest (`ingress.yaml`)",
            "codeSnippet": "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pinit-ingress\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts: [\"api.pinit.io\"]\n      secretName: pinit-api-tls\n  rules:\n    - host: api.pinit.io\n      http:\n        paths:\n          - path: /v1/auth\n            pathType: Prefix\n            backend:\n              service: { name: auth-service, port: { number: 80 } }\n          - path: /\n            pathType: Prefix\n            backend:\n              service: { name: web-service, port: { number: 80 } }",
            "lineNotes": {
              "5": "Automates free Let's Encrypt TLS certificate generation via cert-manager.",
              "9": "Terminates HTTPS at Ingress controller before proxying HTTP internally.",
              "16": "Path-based routing to auth microservice."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ingress_router_demo.js",
            "initialCode": "function routeIngress(host, path) {\n  if (host === 'api.pinit.io') {\n    if (path.startsWith('/v1/auth')) return 'TARGET_SERVICE: auth-service:80';\n    return 'TARGET_SERVICE: web-service:80';\n  }\n  return 'HTTP_404_UNKNOWN_HOST';\n}\n\nconsole.log('Request to https://api.pinit.io/v1/auth/login:', routeIngress('api.pinit.io', '/v1/auth/login'));\nconsole.log('Request to https://api.pinit.io/dashboard:', routeIngress('api.pinit.io', '/dashboard'));",
            "expectedOutput": "Request to https://api.pinit.io/v1/auth/login: TARGET_SERVICE: auth-service:80\nRequest to https://api.pinit.io/dashboard: TARGET_SERVICE: web-service:80",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which target backend service is reached when navigating to `https://api.pinit.io/v1/auth/login`?",
          "expectedStringOutput": "TARGET_SERVICE: auth-service:80",
          "acceptableAnswers": [
            "TARGET_SERVICE: auth-service:80",
            "auth-service:80",
            "auth-service"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_INGRESS_CONTROLLER_TLS",
          "diagnosisMap": {
            "web-service": {
              "misconceptionId": "MC_DEVOPS_K8S_INGRESS_CONTROLLER_TLS",
              "errorExplanation": "/v1/auth/login matches the Prefix rule for /v1/auth and routes to auth-service:80.",
              "recoveryPath": {
                "simplerExplanation": "Matches prefix /v1/auth -> auth-service:80.",
                "guidedFixPrompt": "Type TARGET_SERVICE: auth-service:80"
              }
            }
          }
        }
      },
      {
        "id": "devops-d18-b2-cert-manager-letsencrypt-tls",
        "day": 18,
        "blockNumber": 2,
        "title": "Automated TLS Certificates with `cert-manager` & Let's Encrypt",
        "conceptBudget": {
          "primaryConcept": "cert-manager TLS Automation",
          "supportingTerms": [
            "`ClusterIssuer` with ACME HTTP-01 / DNS-01 challenge",
            "Automatic 90-day renewal before expiration",
            "Storing X.509 cert in `kubernetes.io/tls` Secret"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d18-b1-ingress-resource-rules-path",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cert_renewal_demo.js",
            "initialCode": "function evaluateCertStatus(daysRemaining) {\n  return daysRemaining < 30 \n    ? { status: 'AUTOMATIC_RENEWAL_TRIGGERED_ACME', valid: true }\n    : { status: 'CERTIFICATE_HEALTHY', valid: true };\n}\n\nconsole.log('New Cert (80 days left):', evaluateCertStatus(80).status);\nconsole.log('Expiring Cert (15 days left):', evaluateCertStatus(15).status);",
            "expectedOutput": "New Cert (80 days left): CERTIFICATE_HEALTHY\nExpiring Cert (15 days left): AUTOMATIC_RENEWAL_TRIGGERED_ACME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action does `cert-manager` execute when a Let's Encrypt certificate has 15 days remaining before expiration?",
          "expectedStringOutput": "AUTOMATIC_RENEWAL_TRIGGERED_ACME",
          "acceptableAnswers": [
            "AUTOMATIC_RENEWAL_TRIGGERED_ACME",
            "Expiring Cert (15 days left): AUTOMATIC_RENEWAL_TRIGGERED_ACME"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_INGRESS_CONTROLLER_TLS",
          "diagnosisMap": {
            "EXPIRED": {
              "misconceptionId": "MC_DEVOPS_K8S_INGRESS_CONTROLLER_TLS",
              "errorExplanation": "cert-manager initiates ACME renewal automatically 30 days prior to expiration.",
              "recoveryPath": {
                "simplerExplanation": "Triggers automated ACME renewal -> AUTOMATIC_RENEWAL_TRIGGERED_ACME.",
                "guidedFixPrompt": "Type AUTOMATIC_RENEWAL_TRIGGERED_ACME"
              }
            }
          }
        }
      },
      {
        "id": "devops-d18-b3-ssl-passthrough-vs-termination",
        "day": 18,
        "blockNumber": 3,
        "title": "TLS Termination vs SSL Passthrough Trade-offs",
        "conceptBudget": {
          "primaryConcept": "TLS Termination Modes",
          "supportingTerms": [
            "TLS Termination (Decrypts at Ingress; forwards unencrypted HTTP over internal network for inspection)",
            "SSL Passthrough (Forwards encrypted raw TCP bytes to end Pod; higher CPU on Pod)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d18-b2-cert-manager-letsencrypt-tls",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tls_mode_picker.js",
            "initialCode": "function selectTlsArchitecture(requiresEndToEndZeroTrust) {\n  return requiresEndToEndZeroTrust \n    ? 'SSL_PASSTHROUGH_ENCRYPTED_TO_POD'\n    : 'TLS_TERMINATION_AT_INGRESS_CONTROLLER';\n}\n\nconsole.log('Standard Web Application:', selectTlsArchitecture(false));\nconsole.log('Strict Zero-Trust Banking App:', selectTlsArchitecture(true));",
            "expectedOutput": "Standard Web Application: TLS_TERMINATION_AT_INGRESS_CONTROLLER\nStrict Zero-Trust Banking App: SSL_PASSTHROUGH_ENCRYPTED_TO_POD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of performing TLS Termination at the Ingress Controller for standard microservice architectures?",
          "options": [
            "It centralizes certificate management in one place and offloads expensive cryptographic decryption handshakes from individual application backend pods",
            "It turns off HTTPS",
            "It deletes SSL certificates"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_K8S_INGRESS_CONTROLLER_TLS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_K8S_INGRESS_CONTROLLER_TLS",
              "errorExplanation": "Centralizing TLS termination offloads CPU overhead and simplifies cert renewals.",
              "recoveryPath": {
                "simplerExplanation": "Centralizes cert management and offloads pod CPU crypto load.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Kubernetes ConfigMaps, Secrets & Environment Volume Mounting",
    "overviewMetaphor": "ConfigMaps & Secrets are an actor's script and password envelope: the actor (Container Image) knows the lines and logic; when playing in London (Staging), the stage manager hands them the British script (ConfigMap); when playing on Broadway (Production), the manager hands them the American script and a sealed confidential security envelope (Kubernetes Secret: database password); the actor never rewrites their internal talent.",
    "blocks": [
      {
        "id": "devops-d19-b1-configmap-key-value-mounting",
        "day": 19,
        "blockNumber": 1,
        "title": "ConfigMaps: `envFrom` vs Volume Mounts",
        "conceptBudget": {
          "primaryConcept": "Kubernetes ConfigMaps",
          "supportingTerms": [
            "`kind: ConfigMap`",
            "`envFrom: configMapRef` (Injected at pod startup as environment variables)",
            "`volumeMounts: configMap` (Mounted as dynamic config files in `/etc/config`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d1-b1-twelve-factor-config-env",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ConfigMap Definition & Pod Volume Mount",
            "codeSnippet": "apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  LOG_LEVEL: 'info'\n  APP_THEME: 'midnight'\n---\n# Inside Pod Spec:\ncontainers:\n  - name: web\n    image: pinit/web:v1.0\n    envFrom:\n      - configMapRef: { name: app-config }",
            "lineNotes": {
              "6": "Plaintext non-confidential configuration values.",
              "13": "Injects all key-values from app-config directly into process.env."
            }
          },
          {
            "type": "runnable_code",
            "filename": "configmap_demo.js",
            "initialCode": "function injectConfigMap(configMapData, currentEnv = {}) {\n  return { ...currentEnv, ...configMapData, injectedAt: 'POD_STARTUP' };\n}\n\nconst cm = { LOG_LEVEL: 'debug', FEATURE_FLAG_V2: 'true' };\nconsole.log('Injected Container Env:', JSON.stringify(injectConfigMap(cm)));",
            "expectedOutput": "Injected Container Env: {\"LOG_LEVEL\":\"debug\",\"FEATURE_FLAG_V2\":\"true\",\"injectedAt\":\"POD_STARTUP\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When are environment variables injected from `configMapRef` loaded into the container process?",
          "expectedStringOutput": "POD_STARTUP",
          "acceptableAnswers": [
            "POD_STARTUP",
            "Pod startup",
            "injectedAt: POD_STARTUP"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_CONFIGMAP_SECRET_VOLUME_MOUNT",
          "diagnosisMap": {
            "DYNAMIC": {
              "misconceptionId": "MC_DEVOPS_K8S_CONFIGMAP_SECRET_VOLUME_MOUNT",
              "errorExplanation": "Environment variables are evaluated at process startup. (Volume mounts can update dynamically).",
              "recoveryPath": {
                "simplerExplanation": "Injected at POD_STARTUP.",
                "guidedFixPrompt": "Type POD_STARTUP"
              }
            }
          }
        }
      },
      {
        "id": "devops-d19-b2-k8s-secrets-base64-encoding",
        "day": 19,
        "blockNumber": 2,
        "title": "Kubernetes Secrets: Base64 Encoding vs Encryption-at-Rest",
        "conceptBudget": {
          "primaryConcept": "Kubernetes Secrets Invariants",
          "supportingTerms": [
            "`kind: Secret` (`type: Opaque`)",
            "Base64 encoding (Obfuscation, NOT encryption!)",
            "KMS Encryption-at-rest for etcd",
            "Role-Based Access Control (RBAC) secret restrictions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d19-b1-configmap-key-value-mounting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Base64 Misconception vs True etcd Encryption Diff",
              "brokenCode": "// ❌ CRITICAL SECURITY MISCONCEPTION:\n// 'My database password is safe because it is base64 encoded in Kubernetes Secret YAML!'\n// Base64 is trivial to reverse in 1 millisecond: Buffer.from('cGFzc3dvcmQ=', 'base64') -> 'password'!",
              "fixedCode": "// ✅ PRODUCTION DEVSECOPS SECURITY:\n// 1. Enable AWS KMS / HashiCorp Vault Envelope Encryption-at-Rest for etcd database\n// 2. Restrict secret read access via strict Kubernetes RBAC policies\n// 3. Inject secrets via external Secrets Store CSI Driver directly from AWS Secrets Manager!",
              "errorLine": 3,
              "errorReason": "Base64 encoding provides zero confidentiality; it is merely an encoding scheme for binary data.",
              "fixExplanation": "Use KMS encryption-at-rest for etcd and strict RBAC."
            }
          },
          {
            "type": "runnable_code",
            "filename": "base64_secret_demo.js",
            "initialCode": "function decodeSecret(base64Str) {\n  return Buffer.from(base64Str, 'base64').toString('utf8');\n}\n\nconst encoded = Buffer.from('superSecretDbPass9981').toString('base64');\nconsole.log('Encoded in Manifest YAML:', encoded);\nconsole.log('Decoded by Container in RAM:', decodeSecret(encoded));",
            "expectedOutput": "Encoded in Manifest YAML: c3VwZXJTZWNyZXREYlBhc3M5OTgx\nDecoded by Container in RAM: superSecretDbPass9981",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Is base64 encoding in a Kubernetes Secret manifest sufficient to protect sensitive passwords from being read if committed to a public Git repository?",
          "options": [
            "No, base64 is not encryption; anyone can decode it instantly. True secret protection requires external secret vaults (HashiCorp Vault / AWS Secrets Manager) and KMS etcd encryption-at-rest",
            "Yes, base64 is 256-bit unbreakable encryption",
            "Base64 deletes passwords"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_K8S_CONFIGMAP_SECRET_VOLUME_MOUNT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_K8S_CONFIGMAP_SECRET_VOLUME_MOUNT",
              "errorExplanation": "Base64 is simply an encoding format, not cryptographic encryption.",
              "recoveryPath": {
                "simplerExplanation": "Base64 is reversible encoding, not encryption.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d19-b3-external-secrets-csi-driver",
        "day": 19,
        "blockNumber": 3,
        "title": "External Secrets Operator & Secrets Store CSI Driver",
        "conceptBudget": {
          "primaryConcept": "External Secrets Integration",
          "supportingTerms": [
            "External Secrets Operator (ESO)",
            "Syncing directly from AWS Secrets Manager / Vault into Kubernetes in-memory volume",
            "Zero secret YAMLs committed to Git"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d19-b2-k8s-secrets-base64-encoding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "eso_sync_demo.js",
            "initialCode": "function syncExternalSecret(awsSecretManagerVal) {\n  return {\n    k8sSecretSynced: true,\n    syncedValue: awsSecretManagerVal,\n    storedInGit: false\n  };\n}\n\nconsole.log('ESO Sync Result:', JSON.stringify(syncExternalSecret('live_stripe_secret_key_101')));",
            "expectedOutput": "ESO Sync Result: {\"k8sSecretSynced\":true,\"syncedValue\":\"live_stripe_secret_key_101\",\"storedInGit\":false}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Are secrets synced via the External Secrets Operator (ESO) stored in plaintext inside version control Git repositories (`storedInGit`)?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "storedInGit\":false"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_CONFIGMAP_SECRET_VOLUME_MOUNT",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_DEVOPS_K8S_CONFIGMAP_SECRET_VOLUME_MOUNT",
              "errorExplanation": "ESO fetches secrets dynamically from AWS Secrets Manager at runtime; zero secrets are stored in Git.",
              "recoveryPath": {
                "simplerExplanation": "Secrets are not stored in Git -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Kubernetes Health Probes: Liveness, Readiness & Startup Probes",
    "overviewMetaphor": "Kubernetes Health Probes are a pilot's 3-stage instrument checklist: 1. Startup Probe: \"Is the jet engine ignited and warmed up?\" (Gives heavy Java/Spring apps 60s to boot); 2. Readiness Probe: \"Are the aircraft doors closed and runway clear?\" (If False, load balancer stops boarding passengers); 3. Liveness Probe: \"Is the pilot conscious and responsive?\" (If False / deadlocked, eject and reboot the pod).",
    "blocks": [
      {
        "id": "devops-d20-b1-liveness-vs-readiness-probes",
        "day": 20,
        "blockNumber": 1,
        "title": "Liveness vs Readiness Probes: Restart vs Detach Traffic",
        "conceptBudget": {
          "primaryConcept": "Liveness vs Readiness",
          "supportingTerms": [
            "Liveness Probe: Detects deadlocks $\\to$ Kills & Restarts Pod",
            "Readiness Probe: Detects temporary overload $\\to$ Detaches from Service Endpoints (Zero restarts!)",
            "`initialDelaySeconds`, `periodSeconds`, `failureThreshold`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d16-b2-declarative-deployment-manifest",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Probe Behavior Matrix",
              "boxes": [
                {
                  "label": "Liveness Failure",
                  "value": "ACTION: Kubelet KILLS and RESTARTS the container",
                  "varType": "Pod Restart",
                  "isUpdated": true
                },
                {
                  "label": "Readiness Failure",
                  "value": "ACTION: Service REMOVES Pod IP from EndpointSlice (Zero traffic routed; Pod is NOT killed)",
                  "varType": "Traffic Detach",
                  "isUpdated": false
                },
                {
                  "label": "Startup Failure",
                  "value": "ACTION: Disables liveness/readiness until boot completes; kills if max startup time exceeded",
                  "varType": "Boot Guard",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "probe_action_demo.js",
            "initialCode": "function evaluateProbeFailure(probeType) {\n  if (probeType === 'liveness') return { action: 'KILL_AND_RESTART_CONTAINER', receivesTraffic: false };\n  if (probeType === 'readiness') return { action: 'REMOVE_FROM_SERVICE_ENDPOINTS_NO_RESTART', receivesTraffic: false };\n  return { action: 'STARTUP_TIMEOUT_RESTART', receivesTraffic: false };\n}\n\nconsole.log('Readiness Probe Failed:', evaluateProbeFailure('readiness').action);\nconsole.log('Liveness Probe Failed:', evaluateProbeFailure('liveness').action);",
            "expectedOutput": "Readiness Probe Failed: REMOVE_FROM_SERVICE_ENDPOINTS_NO_RESTART\nLiveness Probe Failed: KILL_AND_RESTART_CONTAINER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action does Kubernetes take when a `readiness` probe fails while the liveness probe is still healthy?",
          "expectedStringOutput": "REMOVE_FROM_SERVICE_ENDPOINTS_NO_RESTART",
          "acceptableAnswers": [
            "REMOVE_FROM_SERVICE_ENDPOINTS_NO_RESTART",
            "Readiness Probe Failed: REMOVE_FROM_SERVICE_ENDPOINTS_NO_RESTART",
            "Detach traffic"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_PROBES_LIVENESS_READINESS_STARTUP",
          "diagnosisMap": {
            "KILL_AND_RESTART_CONTAINER": {
              "misconceptionId": "MC_DEVOPS_K8S_PROBES_LIVENESS_READINESS_STARTUP",
              "errorExplanation": "Readiness failures do NOT kill the container; they only remove the Pod from Service endpoints until it recovers.",
              "recoveryPath": {
                "simplerExplanation": "Readiness failure detaches traffic without killing: REMOVE_FROM_SERVICE_ENDPOINTS_NO_RESTART.",
                "guidedFixPrompt": "Type REMOVE_FROM_SERVICE_ENDPOINTS_NO_RESTART"
              }
            }
          }
        }
      },
      {
        "id": "devops-d20-b2-startup-probes-slow-boot",
        "day": 20,
        "blockNumber": 2,
        "title": "Startup Probes: Preventing Premature Liveness Kill Loops",
        "conceptBudget": {
          "primaryConcept": "Startup Probes",
          "supportingTerms": [
            "`startupProbe` (Overrides liveness probe during initial initialization)",
            "Preventing slow-booting applications (e.g. JVM, ML models) from entering endless CrashLoopBackOff",
            "`failureThreshold: 30`, `periodSeconds: 10` (Allows up to 300s boot)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d20-b1-liveness-vs-readiness-probes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Startup Probe Configuration",
            "codeSnippet": "startupProbe:\n  httpGet:\n    path: /healthz\n    port: 8080\n  failureThreshold: 30\n  periodSeconds: 10\n# Total allowable boot time: 30 * 10s = 300 seconds (5 minutes)!",
            "lineNotes": {
              "5": "Permits up to 30 consecutive checks.",
              "6": "Checks every 10 seconds, granting slow JVM migrations up to 300s before liveness kicks in."
            }
          },
          {
            "type": "runnable_code",
            "filename": "startup_probe_calc.js",
            "initialCode": "function calculateMaxStartupWindow(failureThreshold, periodSeconds) {\n  return `${failureThreshold * periodSeconds} seconds`;\n}\n\nconsole.log('Max Allowable Boot Window (30 x 10s):', calculateMaxStartupWindow(30, 10));",
            "expectedOutput": "Max Allowable Boot Window (30 x 10s): 300 seconds",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total allowable startup grace period (in seconds) for `failureThreshold: 30` and `periodSeconds: 10`?",
          "expectedStringOutput": "300 seconds",
          "acceptableAnswers": [
            "300 seconds",
            "300s",
            "300",
            "Max Allowable Boot Window (30 x 10s): 300 seconds"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_PROBES_LIVENESS_READINESS_STARTUP",
          "diagnosisMap": {
            "30 seconds": {
              "misconceptionId": "MC_DEVOPS_K8S_PROBES_LIVENESS_READINESS_STARTUP",
              "errorExplanation": "30 threshold * 10 seconds period = 300 seconds total.",
              "recoveryPath": {
                "simplerExplanation": "30 * 10 = 300 seconds.",
                "guidedFixPrompt": "Type 300 seconds"
              }
            }
          }
        }
      },
      {
        "id": "devops-d20-b3-healthz-probe-anti-patterns",
        "day": 20,
        "blockNumber": 3,
        "title": "Probe Anti-Patterns: Never Check Downstream Dependencies in Liveness",
        "conceptBudget": {
          "primaryConcept": "Probe Design Best Practices",
          "supportingTerms": [
            "Liveness: Checks internal process health ONLY",
            "Never querying external DB in liveness (Cascading crash storms when DB has hiccup)",
            "Readiness: Checks ability to serve requests"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d20-b2-startup-probes-slow-boot",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Liveness Database Cascading Crash Anti-Pattern Diff",
              "brokenCode": "// ❌ DANGEROUS ANTI-PATTERN: Liveness checks external database!\napp.get('/healthz/liveness', async (req, res) => {\n  const dbOk = await db.ping(); // If DB is temporarily slow (2s), ALL 50 PODS FAIL LIVENESS!\n  if (!dbOk) return res.status(500).send('DB_DOWN'); // Kubernetes REBOOTS ALL 50 PODS SIMULTANEOUSLY -> Total Outage!\n  res.send('OK');\n});",
              "fixedCode": "// ✅ PRODUCTION WELL-ARCHITECTED PROBE PATTERN:\n// Liveness: Checks ONLY internal process event loop\napp.get('/healthz/liveness', (req, res) => res.send('ALIVE'));\n\n// Readiness: Checks external dependencies (detaches traffic without rebooting pods!)\napp.get('/healthz/readiness', async (req, res) => {\n  const dbOk = await db.ping();\n  return dbOk ? res.send('READY') : res.status(503).send('DB_UNAVAILABLE');\n});",
              "errorLine": 3,
              "errorReason": "Checking external database in liveness probe causes cluster-wide reboot storms during minor DB latency spikes.",
              "fixExplanation": "Keep liveness probe internal-only; check external dependencies in readiness probe."
            }
          },
          {
            "type": "runnable_code",
            "filename": "probe_design_demo.js",
            "initialCode": "function evaluateOutageImpact(isDbDown, checkType) {\n  if (isDbDown && checkType === 'LIVENESS_CHECKS_DB') {\n    return 'CRITICAL: ALL_PODS_KILLED_AND_REBOOTED_CASCADE_OUTAGE';\n  }\n  if (isDbDown && checkType === 'READINESS_CHECKS_DB') {\n    return 'SAFE: TRAFFIC_DETACHED_PODS_REMAIN_ALIVE_WAITING_FOR_DB';\n  }\n  return 'HEALTHY';\n}\n\nconsole.log('Bad Liveness:', evaluateOutageImpact(true, 'LIVENESS_CHECKS_DB'));\nconsole.log('Good Readiness:', evaluateOutageImpact(true, 'READINESS_CHECKS_DB'));",
            "expectedOutput": "Bad Liveness: CRITICAL: ALL_PODS_KILLED_AND_REBOOTED_CASCADE_OUTAGE\nGood Readiness: SAFE: TRAFFIC_DETACHED_PODS_REMAIN_ALIVE_WAITING_FOR_DB",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should an application's `livenessProbe` NEVER execute a database query (`SELECT 1`) to check health?",
          "options": [
            "Because if the database experiences a temporary latency spike, every single Pod in the cluster will fail its liveness check simultaneously, causing Kubernetes to reboot the entire application fleet in an unrecoverable crash loop",
            "Because SQL is not supported in Kubernetes",
            "Because databases do not respond to HTTP"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_K8S_PROBES_LIVENESS_READINESS_STARTUP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_K8S_PROBES_LIVENESS_READINESS_STARTUP",
              "errorExplanation": "Checking downstream databases in liveness probes triggers cascading cluster-wide reboot storms.",
              "recoveryPath": {
                "simplerExplanation": "Liveness must stay internal to avoid reboot storms.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA",
    "overviewMetaphor": "Milestone 3 — The Elastic Stadium: A stadium entrance that expands and contracts automatically based on crowd density: under normal traffic, 2 gate attendants scan tickets (2 Pods); when a flash mob of 50,000 fans arrives for a concert, the Horizontal Pod Autoscaler (HPA) senses the queue surge and automatically opens 18 additional gates (scaling to 20 Pods); when the crowd enters the arena, the extra gates close cleanly.",
    "blocks": [
      {
        "id": "devops-d21-b1-hpa-autoscaling-math",
        "day": 21,
        "blockNumber": 1,
        "title": "Horizontal Pod Autoscaler (HPA) Mathematical Algorithm",
        "conceptBudget": {
          "primaryConcept": "HPA Autoscaling Algorithm",
          "supportingTerms": [
            "`desiredReplicas = ceil[currentReplicas * (currentMetricValue / desiredMetricValue)]`",
            "Metrics Server (`metrics.k8s.io`)",
            "`minReplicas` and `maxReplicas` clamping bounds"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d20-b1-liveness-vs-readiness-probes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HPA v2 Manifest (`hpa.yaml`)",
            "codeSnippet": "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: pinit-api-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: pinit-api\n  minReplicas: 2\n  maxReplicas: 20\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 60",
            "lineNotes": {
              "10": "Guarantees high-availability minimum of 2 pods across different nodes.",
              "11": "Prevents runaway cloud billing costs by capping max pods at 20.",
              "17": "Triggers scaling when average CPU exceeds 60% of requested value."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hpa_calc_demo.js",
            "initialCode": "function calculateHpa(currentReplicas, currentCpu, targetCpu = 60, min = 2, max = 20) {\n  const ratio = currentCpu / targetCpu;\n  const rawDesired = Math.ceil(currentReplicas * ratio);\n  const bounded = Math.min(max, Math.max(min, rawDesired));\n  return {\n    currentReplicas,\n    currentCpu: `${currentCpu}%`,\n    desiredReplicas: bounded,\n    action: bounded > currentReplicas ? 'SCALE_OUT' : (bounded < currentReplicas ? 'SCALE_IN' : 'HOLD')\n  };\n}\n\nconsole.log('Heavy Traffic Spike (90% CPU on 4 pods):', JSON.stringify(calculateHpa(4, 90)));\nconsole.log('Nighttime Dip (15% CPU on 10 pods):', JSON.stringify(calculateHpa(10, 15)));",
            "expectedOutput": "Heavy Traffic Spike (90% CPU on 4 pods): {\"currentReplicas\":4,\"currentCpu\":\"90%\",\"desiredReplicas\":6,\"action\":\"SCALE_OUT\"}\nNighttime Dip (15% CPU on 10 pods): {\"currentReplicas\":10,\"currentCpu\":\"15%\",\"desiredReplicas\":3,\"action\":\"SCALE_IN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many desired pods are calculated when 4 running pods experience 90% CPU against a 60% target (ceil[4 * 1.5])?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6 pods",
            "desiredReplicas\":6"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_HPA_METRIC_SERVER_SCALING",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DEVOPS_K8S_HPA_METRIC_SERVER_SCALING",
              "errorExplanation": "4 * (90/60) = 4 * 1.5 = 6 pods.",
              "recoveryPath": {
                "simplerExplanation": "4 * 1.5 = 6 pods.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "devops-d21-b2-pod-anti-affinity-multi-az",
        "day": 21,
        "blockNumber": 2,
        "title": "Pod Anti-Affinity & Multi-AZ High Availability",
        "conceptBudget": {
          "primaryConcept": "Pod Anti-Affinity",
          "supportingTerms": [
            "`podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution`",
            "`topologyKey: topology.kubernetes.io/zone`",
            "Guaranteeing pods are spread across multiple Availability Zones"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d21-b1-hpa-autoscaling-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Multi-AZ Anti-Affinity Distribution",
              "nodes": [
                {
                  "id": "1",
                  "label": "HPA creates 3 Replicas of API Deployment",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Scheduler places Pod 1 on Node A (us-east-1a)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Scheduler places Pod 2 on Node B (us-east-1b)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Scheduler places Pod 3 on Node C (us-east-1c) -> If AZ-1a loses power, 66% traffic survives!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "affinity_eval_demo.js",
            "initialCode": "function evaluateAzSurvival(activePods) {\n  const zones = new Set(activePods.map(p => p.zone));\n  return zones.size > 1 ? 'MULTI_AZ_SURVIVABLE' : 'SINGLE_POINT_OF_FAILURE_SINGLE_AZ';\n}\n\nconsole.log('Pods spread across 3 AZs:', evaluateAzSurvival([{ id: 'p1', zone: '1a' }, { id: 'p2', zone: '1b' }, { id: 'p3', zone: '1c' }]));\nconsole.log('All Pods in 1a:', evaluateAzSurvival([{ id: 'p1', zone: '1a' }, { id: 'p2', zone: '1a' }]));",
            "expectedOutput": "Pods spread across 3 AZs: MULTI_AZ_SURVIVABLE\nAll Pods in 1a: SINGLE_POINT_OF_FAILURE_SINGLE_AZ",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What resilience classification is achieved when pods are distributed across 3 Availability Zones?",
          "expectedStringOutput": "MULTI_AZ_SURVIVABLE",
          "acceptableAnswers": [
            "MULTI_AZ_SURVIVABLE",
            "Pods spread across 3 AZs: MULTI_AZ_SURVIVABLE"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_HPA_METRIC_SERVER_SCALING",
          "diagnosisMap": {
            "SPOF": {
              "misconceptionId": "MC_DEVOPS_K8S_HPA_METRIC_SERVER_SCALING",
              "errorExplanation": "Spreading pods across zones achieves MULTI_AZ_SURVIVABLE status.",
              "recoveryPath": {
                "simplerExplanation": "Multi-AZ spread = MULTI_AZ_SURVIVABLE.",
                "guidedFixPrompt": "Type MULTI_AZ_SURVIVABLE"
              }
            }
          }
        }
      },
      {
        "id": "devops-d21-b3-milestone3-devops-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Production Kubernetes Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "High-Availability Kubernetes Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d21-b2-pod-anti-affinity-multi-az",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_K8S_HPA_METRIC_SERVER_SCALING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DEVOPS_K8S_HPA_METRIC_SERVER_SCALING",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches milestone header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & HPA [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Helm Package Management & Multi-Environment Values",
    "overviewMetaphor": "Helm is an automated furniture assembly kit (like IKEA): instead of hand-carving every table leg and screw with raw Kubernetes YAML (50 separate files for Deployment, Service, Ingress, HPA, ConfigMap), Helm provides a parameterized master blueprint (`Chart.yaml` + templates); to furnish a small dorm room (Dev), you pass `values-dev.yaml` (`replicas: 1`); to furnish a penthouse (Prod), you pass `values-prod.yaml` (`replicas: 10, multiAz: true`).",
    "blocks": [
      {
        "id": "devops-d22-b1-helm-chart-structure-templates",
        "day": 22,
        "blockNumber": 1,
        "title": "Helm Chart Directory Structure & Go Template Syntax",
        "conceptBudget": {
          "primaryConcept": "Helm Chart Architecture",
          "supportingTerms": [
            "`Chart.yaml` (Metadata & SemVer)",
            "`templates/*.yaml` (Go templating syntax `{{ .Values.replicaCount }}`)",
            "`values.yaml` (Default input parameters)",
            "`helm install` & `helm upgrade`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d16-b2-declarative-deployment-manifest",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Helm Template Snippet (`templates/deployment.yaml`)",
            "codeSnippet": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ .Release.Name }}-{{ .Chart.Name }}\nspec:\n  replicas: {{ .Values.replicaCount | default 2 }}\n  template:\n    spec:\n      containers:\n        - name: app\n          image: \"{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}\"",
            "lineNotes": {
              "4": "Dynamically constructs unique name based on Helm release.",
              "6": "Interpolates replica count from values.yaml with default fallback of 2.",
              "11": "Injects container repository and image tag."
            }
          },
          {
            "type": "runnable_code",
            "filename": "helm_render_demo.js",
            "initialCode": "function renderHelmDeployment(releaseName, values) {\n  const replicas = values.replicaCount || 2;\n  const image = `${values.image.repository}:${values.image.tag}`;\n  return `Deployment: ${releaseName} (Replicas: ${replicas}, Image: ${image})`;\n}\n\nconst devVals = { replicaCount: 1, image: { repository: 'pinit/api', tag: 'v1.0.0-dev' } };\nconst prodVals = { replicaCount: 8, image: { repository: 'pinit/api', tag: 'v1.0.0' } };\nconsole.log('Dev Render:', renderHelmDeployment('pinit-dev', devVals));\nconsole.log('Prod Render:', renderHelmDeployment('pinit-prod', prodVals));",
            "expectedOutput": "Dev Render: Deployment: pinit-dev (Replicas: 1, Image: pinit/api:v1.0.0-dev)\nProd Render: Deployment: pinit-prod (Replicas: 8, Image: pinit/api:v1.0.0)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the rendered replica count for the `pinit-prod` Helm release?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "8 replicas",
            "Replicas: 8"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_HELM_PACKAGE_TEMPLATING_VALUES",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_DEVOPS_HELM_PACKAGE_TEMPLATING_VALUES",
              "errorExplanation": "prodVals overrides the default of 2 with replicaCount: 8.",
              "recoveryPath": {
                "simplerExplanation": "prodVals specifies 8 replicas.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "devops-d22-b2-multi-env-values-overrides",
        "day": 22,
        "blockNumber": 2,
        "title": "Multi-Environment Values Files (`values-dev.yaml` vs `values-prod.yaml`)",
        "conceptBudget": {
          "primaryConcept": "Multi-Environment Values Overrides",
          "supportingTerms": [
            "`helm upgrade --install myapp ./chart -f values-prod.yaml`",
            "Parameterizing CPU/RAM requests, replica counts, and ingress hosts across environments",
            "DRY Infrastructure"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d22-b1-helm-chart-structure-templates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "values_override_demo.js",
            "initialCode": "function mergeHelmValues(baseValues, envOverrides) {\n  return { ...baseValues, ...envOverrides };\n}\n\nconst base = { replicaCount: 2, enableTls: false, logLevel: 'info' };\nconst prodOverrides = { replicaCount: 10, enableTls: true, logLevel: 'warn' };\nconsole.log('Merged Prod Config:', JSON.stringify(mergeHelmValues(base, prodOverrides)));",
            "expectedOutput": "Merged Prod Config: {\"replicaCount\":10,\"enableTls\":true,\"logLevel\":\"warn\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the resulting `enableTls` boolean value in the merged production configuration?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "enableTls\":true"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_HELM_PACKAGE_TEMPLATING_VALUES",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_DEVOPS_HELM_PACKAGE_TEMPLATING_VALUES",
              "errorExplanation": "prodOverrides specifies enableTls: true, overriding the base default.",
              "recoveryPath": {
                "simplerExplanation": "Production overrides enableTls to true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "devops-d22-b3-helm-rollback-revisions",
        "day": 22,
        "blockNumber": 3,
        "title": "Helm Release History & Instant Rollbacks (`helm rollback`)",
        "conceptBudget": {
          "primaryConcept": "Helm Release Management",
          "supportingTerms": [
            "`helm history <release>`",
            "`helm rollback <release> <revision>`",
            "Atomic release upgrades (`--atomic` flag)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d22-b2-multi-env-values-overrides",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "helm_rollback_demo.js",
            "initialCode": "class HelmReleaseTracker {\n  constructor() {\n    this.revisions = [\n      { rev: 1, appVersion: 'v1.0.0', status: 'superseded' },\n      { rev: 2, appVersion: 'v1.1.0', status: 'deployed' }\n    ];\n  }\n  rollbackTo(targetRev) {\n    const prev = this.revisions.find(r => r.rev === targetRev);\n    if (!prev) return 'REV_NOT_FOUND';\n    const newRev = this.revisions.length + 1;\n    this.revisions.push({ rev: newRev, appVersion: prev.appVersion, status: 'deployed (rollback)' });\n    return `ROLLED_BACK_TO_${prev.appVersion}_AS_REV_${newRev}`;\n  }\n}\n\nconst tracker = new HelmReleaseTracker();\nconsole.log('Rollback Action:', tracker.rollbackTo(1));",
            "expectedOutput": "Rollback Action: ROLLED_BACK_TO_v1.0.0_AS_REV_3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does the `helm rollback <release> 1` command do when Revision 2 of an application causes production crashes?",
          "options": [
            "It immediately restores all Kubernetes manifests (Deployments, Services, ConfigMaps) to the exact state of Revision 1 in seconds, creating a new Revision 3 representing the rollback",
            "It deletes the entire Kubernetes cluster",
            "It edits the source code in Git"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_HELM_PACKAGE_TEMPLATING_VALUES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_HELM_PACKAGE_TEMPLATING_VALUES",
              "errorExplanation": "Helm rollback recreates the exact state of the target revision atomically.",
              "recoveryPath": {
                "simplerExplanation": "Restores cluster state to Revision 1.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "GitOps Continuous Delivery with ArgoCD & Declarative Sync",
    "overviewMetaphor": "GitOps with ArgoCD is an autonomous autopilot cruise ship: the Git repository is the destination GPS coordinates (`spec.replicas: 10`); ArgoCD is the computerized ship navigator continuously measuring the ship's actual rudder position against the GPS map; if a rogue wave (Console Drift / manual kubectl edit) knocks the ship off course (`OutOfSync`), ArgoCD's automated reconciliation motor turns the rudder back into perfect alignment with Git.",
    "blocks": [
      {
        "id": "devops-d23-b1-gitops-principles-single-source-truth",
        "day": 23,
        "blockNumber": 1,
        "title": "The 4 Core GitOps Principles & Declarative Desired State",
        "conceptBudget": {
          "primaryConcept": "GitOps Principles",
          "supportingTerms": [
            "Git as the Single Source of Truth",
            "Declarative Desired State in Git",
            "Automated Pull-based Reconciliation (vs Push-based CI)",
            "Continuous Drift Detection & Self-Healing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d22-b1-helm-chart-structure-templates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "ArgoCD Pull-Based GitOps Loop",
              "nodes": [
                {
                  "id": "1",
                  "label": "Engineer: Merges PR to git-ops-manifests repo (e.g. image tag v2.0)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "ArgoCD Controller (Inside K8s): Polls Git repo every 3m or receives Webhook",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Drift Detected: Cluster has v1.9 != Git has v2.0 (OutOfSync)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "ArgoCD Auto-Sync applies new manifests to Kubernetes API -> Status: Synced & Healthy!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gitops_sync_sim.js",
            "initialCode": "function evaluateGitOpsDrift(gitCommitSha, clusterLiveSha, autoSyncEnabled) {\n  const isMatch = gitCommitSha === clusterLiveSha;\n  if (isMatch) return { status: 'Synced', health: 'Healthy', action: 'NO_ACTION' };\n  return {\n    status: 'OutOfSync',\n    health: 'Progressing',\n    action: autoSyncEnabled ? 'AUTO_HEAL_APPLY_GIT_STATE' : 'AWAIT_MANUAL_SYNC'\n  };\n}\n\nconsole.log('In-Sync State:', evaluateGitOpsDrift('sha_100', 'sha_100', true).status);\nconsole.log('Manual Edit in Cluster (Drift):', evaluateGitOpsDrift('sha_100', 'sha_tampered', true).action);",
            "expectedOutput": "In-Sync State: Synced\nManual Edit in Cluster (Drift): AUTO_HEAL_APPLY_GIT_STATE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action does ArgoCD execute with `autoSync` and `selfHeal` enabled when someone manually tampers with a pod in the cluster?",
          "expectedStringOutput": "AUTO_HEAL_APPLY_GIT_STATE",
          "acceptableAnswers": [
            "AUTO_HEAL_APPLY_GIT_STATE",
            "Auto heal",
            "Apply git state"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_ARGO_CD_GITOPS_DECLARATIVE_SYNC",
          "diagnosisMap": {
            "NO_ACTION": {
              "misconceptionId": "MC_DEVOPS_ARGO_CD_GITOPS_DECLARATIVE_SYNC",
              "errorExplanation": "Self-healing automatically overwrites cluster drift to match the Git repository.",
              "recoveryPath": {
                "simplerExplanation": "Self-healing overwrites drift: AUTO_HEAL_APPLY_GIT_STATE.",
                "guidedFixPrompt": "Type AUTO_HEAL_APPLY_GIT_STATE"
              }
            }
          }
        }
      },
      {
        "id": "devops-d23-b2-argocd-application-crd",
        "day": 23,
        "blockNumber": 2,
        "title": "The ArgoCD `Application` Custom Resource (CRD)",
        "conceptBudget": {
          "primaryConcept": "ArgoCD Application CRD",
          "supportingTerms": [
            "`kind: Application`",
            "`spec.source.repoURL` & `targetRevision: HEAD`",
            "`spec.destination.server: https://kubernetes.default.svc`",
            "`syncPolicy.automated: { prune: true, selfHeal: true }`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d23-b1-gitops-principles-single-source-truth",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ArgoCD Application Manifest (`app.yaml`)",
            "codeSnippet": "apiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: pinit-backend\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/pinit/k8s-manifests.git\n    targetRevision: HEAD\n    path: environments/prod\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true",
            "lineNotes": {
              "9": "Monitors Git repository branch HEAD.",
              "13": "Target Kubernetes cluster and namespace.",
              "16": "prune: true automatically deletes cluster resources deleted from Git."
            }
          },
          {
            "type": "runnable_code",
            "filename": "argocd_app_demo.js",
            "initialCode": "function describeArgoApp(name, targetNamespace, pruneEnabled) {\n  return {\n    app: name,\n    namespace: targetNamespace,\n    garbageCollectOrphans: pruneEnabled ? 'PRUNE_DELETED_RESOURCES' : 'KEEP_ORPHANS'\n  };\n}\n\nconsole.log('Production ArgoCD Spec:', JSON.stringify(describeArgoApp('pinit-backend', 'production', true)));",
            "expectedOutput": "Production ArgoCD Spec: {\"app\":\"pinit-backend\",\"namespace\":\"production\",\"garbageCollectOrphans\":\"PRUNE_DELETED_RESOURCES\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does setting `syncPolicy.automated.prune: true` do in an ArgoCD Application?",
          "options": [
            "If a Kubernetes manifest (like an old Service) is deleted from the Git repository, ArgoCD automatically deletes that resource from the live Kubernetes cluster",
            "It deletes all logs",
            "It prunes Docker images from local laptops"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_ARGO_CD_GITOPS_DECLARATIVE_SYNC",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_ARGO_CD_GITOPS_DECLARATIVE_SYNC",
              "errorExplanation": "Pruning ensures that deleting files in Git removes corresponding live cluster resources.",
              "recoveryPath": {
                "simplerExplanation": "Pruning deletes orphan cluster resources when removed from Git.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d23-b3-app-of-apps-pattern",
        "day": 23,
        "blockNumber": 3,
        "title": "The ArgoCD App-of-Apps Multi-Service Pattern",
        "conceptBudget": {
          "primaryConcept": "App-of-Apps Pattern",
          "supportingTerms": [
            "Root Application deploying child Applications",
            "Managing 50+ microservices in a single repository",
            "Centralized cluster bootstrapping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d23-b2-argocd-application-crd",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "app_of_apps_demo.js",
            "initialCode": "function bootstrapCluster(childApps) {\n  return {\n    rootApp: 'root-bootstrap-app',\n    deployedMicroservices: childApps,\n    totalApps: childApps.length\n  };\n}\n\nconsole.log('Bootstrapped Stack:', JSON.stringify(bootstrapCluster(['auth-svc', 'billing-svc', 'frontend-svc', 'ingress-nginx', 'prometheus'])));",
            "expectedOutput": "Bootstrapped Stack: {\"rootApp\":\"root-bootstrap-app\",\"deployedMicroservices\":[\"auth-svc\",\"billing-svc\",\"frontend-svc\",\"ingress-nginx\",\"prometheus\"],\"totalApps\":5}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many microservices and platform add-ons are managed in the bootstrapped stack above?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5 apps",
            "totalApps\":5"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_ARGO_CD_GITOPS_DECLARATIVE_SYNC",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_ARGO_CD_GITOPS_DECLARATIVE_SYNC",
              "errorExplanation": "The array contains 5 child applications deployed by the root app.",
              "recoveryPath": {
                "simplerExplanation": "Count is 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Prometheus Metric Scraping & PromQL Alerting Rules",
    "overviewMetaphor": "Prometheus is a hospital telemetry ward: Prometheus Server is the central heart-rate monitor that pulls live vital signs (`/metrics` HTTP scrape every 15 seconds) from all 50 patients (Pods); PromQL is the ICU doctor's math formula (`rate(http_requests_total[5m])`); Alertmanager is the red siren that pages the on-call doctor's pager when a patient's oxygen saturation drops below 95%.",
    "blocks": [
      {
        "id": "devops-d24-b1-prometheus-scrape-pull-architecture",
        "day": 24,
        "blockNumber": 1,
        "title": "Prometheus Pull-Based Metric Scraping & Exposition Format",
        "conceptBudget": {
          "primaryConcept": "Prometheus Metric Scraping",
          "supportingTerms": [
            "Pull-based HTTP scraping (`/metrics`)",
            "Metric Types: Counter (Monotonically increasing), Gauge (Fluctuates up/down), Histogram (Bucketed latency), Summary",
            "Scrape Interval (e.g. `15s`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d16-b1-k8s-control-plane-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Prometheus Exposition Format (`/metrics`)",
            "codeSnippet": "# HELP http_requests_total Total HTTP requests received\n# TYPE http_requests_total counter\nhttp_requests_total{method=\"POST\",status=\"200\",path=\"/api/v1/checkout\"} 14820\nhttp_requests_total{method=\"POST\",status=\"500\",path=\"/api/v1/checkout\"} 12\n\n# HELP jvm_memory_used_bytes Live heap memory usage in bytes\n# TYPE jvm_memory_used_bytes gauge\njvm_memory_used_bytes{area=\"heap\"} 419430400",
            "lineNotes": {
              "3": "Counter tracking 200 OK checkout requests.",
              "4": "Counter tracking 500 error checkout failures.",
              "8": "Gauge tracking current heap usage in bytes (fluctuates up/down)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "metric_types_demo.js",
            "initialCode": "function classifyMetricType(name, canDecrease) {\n  if (canDecrease) return 'GAUGE (e.g. Memory, Active Threads, CPU)';\n  return 'COUNTER (e.g. Total Requests, Total Errors)';\n}\n\nconsole.log('HTTP Requests Total:', classifyMetricType('http_requests_total', false));\nconsole.log('Active Database Connections:', classifyMetricType('db_connections_active', true));",
            "expectedOutput": "HTTP Requests Total: COUNTER (e.g. Total Requests, Total Errors)\nActive Database Connections: GAUGE (e.g. Memory, Active Threads, CPU)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which metric type should be used to monitor the current number of active concurrent WebSocket connections in a server?",
          "options": [
            "A `Gauge`, because the number of active connections can go both UP and DOWN over time",
            "A `Counter`, because counters can never decrease",
            "A `Histogram` for single integers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_PROMETHEUS_METRICS_PULL_SCRAPE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_PROMETHEUS_METRICS_PULL_SCRAPE",
              "errorExplanation": "Counters are monotonically increasing (they only go up or reset to 0). Values that fluctuate up and down must be Gauges.",
              "recoveryPath": {
                "simplerExplanation": "Values that go up and down use a Gauge.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d24-b2-promql-rate-error-budget",
        "day": 24,
        "blockNumber": 2,
        "title": "PromQL Queries: `rate()`, `histogram_quantile()` & SLA Rules",
        "conceptBudget": {
          "primaryConcept": "PromQL Query Expressions",
          "supportingTerms": [
            "`rate(http_requests_total[5m])` (Per-second average rate over 5m window)",
            "`histogram_quantile(0.99, ...)` (99th percentile p99 latency calculation)",
            "Error Rate Formula: `5xx_rate / total_rate`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d24-b1-prometheus-scrape-pull-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PromQL Error Rate Calculation",
            "codeSnippet": "# Computes percentage of 5xx errors across all endpoints over last 5 minutes\nsum(rate(http_requests_total{status=~\"5..\"}[5m]))\n/\nsum(rate(http_requests_total[5m]))\n* 100 > 1.0\n# Triggers alert if 5xx error rate exceeds 1% of total traffic!",
            "lineNotes": {
              "2": "Sums per-second rate of 5xx HTTP errors.",
              "4": "Divides by total HTTP request volume.",
              "6": "Threshold: Breaches if error rate > 1.0%."
            }
          },
          {
            "type": "runnable_code",
            "filename": "promql_sim_demo.js",
            "initialCode": "function evaluatePromQlAlert(totalRps, error5xxRps, thresholdPercent = 1.0) {\n  const errorRatePercent = (error5xxRps / totalRps) * 100;\n  return {\n    errorRatePercent: `${errorRatePercent.toFixed(2)}%`,\n    firing: errorRatePercent > thresholdPercent,\n    alertState: errorRatePercent > thresholdPercent ? 'FIRING: High5xxErrorRate' : 'OK'\n  };\n}\n\nconsole.log('Normal Traffic (1,000 RPS, 2 errors/sec):', evaluatePromQlAlert(1000, 2).alertState);\nconsole.log('Spike Outage (1,000 RPS, 35 errors/sec):', evaluatePromQlAlert(1000, 35).alertState);",
            "expectedOutput": "Normal Traffic (1,000 RPS, 2 errors/sec): OK\nSpike Outage (1,000 RPS, 35 errors/sec): FIRING: High5xxErrorRate",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What alert state is triggered when 5xx errors reach 35 RPS on a 1,000 RPS stream (3.5% error rate, exceeding 1% threshold)?",
          "expectedStringOutput": "FIRING: High5xxErrorRate",
          "acceptableAnswers": [
            "FIRING: High5xxErrorRate",
            "FIRING",
            "High5xxErrorRate"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_PROMETHEUS_METRICS_PULL_SCRAPE",
          "diagnosisMap": {
            "OK": {
              "misconceptionId": "MC_DEVOPS_PROMETHEUS_METRICS_PULL_SCRAPE",
              "errorExplanation": "3.5% exceeds the 1.0% threshold, transitioning the rule into the FIRING state.",
              "recoveryPath": {
                "simplerExplanation": "Exceeding threshold triggers FIRING: High5xxErrorRate.",
                "guidedFixPrompt": "Type FIRING: High5xxErrorRate"
              }
            }
          }
        }
      },
      {
        "id": "devops-d24-b3-alertmanager-routing-dedup",
        "day": 24,
        "blockNumber": 3,
        "title": "Alertmanager: Grouping, Deduplication & Silencing",
        "conceptBudget": {
          "primaryConcept": "Alertmanager Notification Routing",
          "supportingTerms": [
            "`group_by: [alertname, cluster]` (Prevents paging on-call 100 times for the same outage)",
            "Inhibition rules (Mute pod alerts if entire node is down)",
            "Silences during scheduled maintenance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d24-b2-promql-rate-error-budget",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "alertmanager_grouping_demo.js",
            "initialCode": "function groupAlerts(individualAlerts) {\n  const groups = new Map();\n  for (const a of individualAlerts) {\n    const key = `${a.alertname}-${a.cluster}`;\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(a.pod);\n  }\n  return Array.from(groups.entries()).map(([k, pods]) => `1 Alert Sent for [${k}] affecting ${pods.length} pods`);\n}\n\nconst alerts = [\n  { alertname: 'KubePodCrashLooping', cluster: 'prod-us-east', pod: 'api-1' },\n  { alertname: 'KubePodCrashLooping', cluster: 'prod-us-east', pod: 'api-2' },\n  { alertname: 'KubePodCrashLooping', cluster: 'prod-us-east', pod: 'api-3' }\n];\nconsole.log(groupAlerts(alerts)[0]);",
            "expectedOutput": "1 Alert Sent for [KubePodCrashLooping-prod-us-east] affecting 3 pods",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does Prometheus Alertmanager implement automated alert grouping (`group_by`)?",
          "options": [
            "To prevent alert fatigue by bundling 50 simultaneous pod crash alerts into a single unified notification rather than sending 50 separate paging buzzer messages to the on-call engineer",
            "Because Alertmanager can only send 1 message per week",
            "To hide errors from management"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_PROMETHEUS_METRICS_PULL_SCRAPE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_PROMETHEUS_METRICS_PULL_SCRAPE",
              "errorExplanation": "Grouping collapses correlated alerts into single digest notifications.",
              "recoveryPath": {
                "simplerExplanation": "Prevents alert fatigue by grouping alerts.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Grafana Dashboards & Distributed Tracing with OpenTelemetry",
    "overviewMetaphor": "Distributed Tracing is a parcel tracking barcode: when a customer clicks \"Purchase Book\" (Trace ID `4bf92f35`), the request travels across 4 distinct postal vans (Frontend $\\to$ API Gateway $\\to$ Auth Service $\\to$ PostgreSQL DB); each vehicle stamps its own start and end time (Span); in Jaeger / Grafana, you see a visual timeline showing that the request took 450ms total, with 400ms spent waiting on an unindexed database query in Van #4.",
    "blocks": [
      {
        "id": "devops-d25-b1-opentelemetry-trace-spans",
        "day": 25,
        "blockNumber": 1,
        "title": "OpenTelemetry Tracing: Trace IDs, Span IDs & W3C Context",
        "conceptBudget": {
          "primaryConcept": "OpenTelemetry Distributed Tracing",
          "supportingTerms": [
            "Trace ID (Global 128-bit unique transaction identifier)",
            "Span (Single unit of work with start/end timestamps and attributes)",
            "W3C `traceparent` HTTP Header (`00-traceId-spanId-01`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d24-b1-prometheus-scrape-pull-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "W3C Traceparent Header Format",
            "codeSnippet": "// Format: version - trace_id (32 hex) - parent_span_id (16 hex) - trace_flags\nconst traceparent = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';",
            "lineNotes": {
              "2": "Propagates globally across HTTP headers between microservices to link distributed logs and spans."
            }
          },
          {
            "type": "runnable_code",
            "filename": "otel_trace_demo.js",
            "initialCode": "function createChildSpan(traceId, parentSpanId, operationName, durationMs) {\n  const childSpanId = Math.random().toString(16).slice(2, 18);\n  return {\n    traceId,\n    parentSpanId,\n    spanId: childSpanId,\n    operation: operationName,\n    durationMs: `${durationMs}ms`\n  };\n}\n\nconst root = { traceId: 'trace-1001', spanId: 'span-root', operation: 'HTTP GET /checkout', duration: '250ms' };\nconst dbChild = createChildSpan(root.traceId, root.spanId, 'pg:SELECT * FROM users', 180);\nconsole.log('Trace Propagated to DB Span?:', dbChild.traceId === root.traceId);\nconsole.log('Parent Span Linked?:', dbChild.parentSpanId === root.spanId);",
            "expectedOutput": "Trace Propagated to DB Span?: true\nParent Span Linked?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Do all child spans in a distributed transaction share the exact same global `traceId` as the root request?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Trace Propagated to DB Span?: true"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_JAEGER_OPENTELEMETRY_TRACE_SPAN",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_DEVOPS_JAEGER_OPENTELEMETRY_TRACE_SPAN",
              "errorExplanation": "The traceId remains identical across all microservices to correlate the full transaction.",
              "recoveryPath": {
                "simplerExplanation": "All spans share the same traceId -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "devops-d25-b2-jaeger-bottleneck-analysis",
        "day": 25,
        "blockNumber": 2,
        "title": "Jaeger Tracing & Latency Bottleneck Root-Cause Analysis",
        "conceptBudget": {
          "primaryConcept": "Latency Bottleneck Identification",
          "supportingTerms": [
            "Visual Waterfall Flamegraph",
            "Identifying slow database queries and downstream RPC timeouts",
            "Span tags and error attributes (`error: true`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d25-b1-opentelemetry-trace-spans",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Jaeger Waterfall Trace Breakdown",
              "nodes": [
                {
                  "id": "1",
                  "label": "Frontend [GET /order] -> Total: 450ms",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "├── API Gateway [auth_check] -> 15ms",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "├── Order Service [validate_cart] -> 20ms",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "└── Postgres Database [SELECT * FROM inventory FOR UPDATE] -> 410ms (BOTTLENECK FOUND!)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bottleneck_finder.js",
            "initialCode": "function findSlowestSpan(spans) {\n  return spans.reduce((slowest, current) => current.durationMs > slowest.durationMs ? current : slowest);\n}\n\nconst spans = [\n  { service: 'api-gateway', durationMs: 15 },\n  { service: 'auth-service', durationMs: 20 },\n  { service: 'postgres-db', durationMs: 410 }\n];\nconsole.log('Bottleneck Component:', findSlowestSpan(spans).service);",
            "expectedOutput": "Bottleneck Component: postgres-db",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which component is identified as the primary latency bottleneck in the trace waterfall above?",
          "expectedStringOutput": "postgres-db",
          "acceptableAnswers": [
            "postgres-db",
            "Postgres",
            "Bottleneck Component: postgres-db"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_JAEGER_OPENTELEMETRY_TRACE_SPAN",
          "diagnosisMap": {
            "api-gateway": {
              "misconceptionId": "MC_DEVOPS_JAEGER_OPENTELEMETRY_TRACE_SPAN",
              "errorExplanation": "api-gateway took only 15ms. postgres-db consumed 410ms (91% of total time).",
              "recoveryPath": {
                "simplerExplanation": "postgres-db took 410ms -> postgres-db.",
                "guidedFixPrompt": "Type postgres-db"
              }
            }
          }
        }
      },
      {
        "id": "devops-d25-b3-grafana-unified-dashboards",
        "day": 25,
        "blockNumber": 3,
        "title": "Grafana Dashboards: Correlating Metrics, Logs & Traces (The 3 Pillars)",
        "conceptBudget": {
          "primaryConcept": "Unified Observability in Grafana",
          "supportingTerms": [
            "The 3 Pillars of Observability (Metrics, Logs, Traces)",
            "Grafana Data Sources (Prometheus, Loki, Tempo)",
            "Click-to-Trace from Metric Spikes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d25-b2-jaeger-bottleneck-analysis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "observability_pillars_demo.js",
            "initialCode": "function mapIncidentInvestigation(step) {\n  if (step === 1) return 'METRICS (Prometheus): Detects WHAT is happening (e.g. 5xx spike at 14:02)';\n  if (step === 2) return 'TRACES (Tempo/Jaeger): Pinpoints WHERE it is happening (e.g. billing-service span)';\n  if (step === 3) return 'LOGS (Loki/Fluentbit): Explains WHY it happened (e.g. NullPointerException on line 42)';\n  return 'UNKNOWN';\n}\n\nconsole.log('Step 1:', mapIncidentInvestigation(1));\nconsole.log('Step 2:', mapIncidentInvestigation(2));\nconsole.log('Step 3:', mapIncidentInvestigation(3));",
            "expectedOutput": "Step 1: METRICS (Prometheus): Detects WHAT is happening (e.g. 5xx spike at 14:02)\nStep 2: TRACES (Tempo/Jaeger): Pinpoints WHERE it is happening (e.g. billing-service span)\nStep 3: LOGS (Loki/Fluentbit): Explains WHY it happened (e.g. NullPointerException on line 42)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In the 3 Pillars of Observability, how do Metrics, Traces, and Logs complement each other during an active incident triage?",
          "options": [
            "Metrics alert you that a problem is occurring (WHAT); Traces isolate the specific failing service and function (WHERE); Logs provide the detailed stack trace explaining the root cause (WHY)",
            "All 3 do the exact same thing",
            "Logs are used only for billing"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_GRAFANA_DASHBOARD_ALERT_PANEL",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_GRAFANA_DASHBOARD_ALERT_PANEL",
              "errorExplanation": "Metrics (What), Traces (Where), and Logs (Why) form the comprehensive triaging workflow.",
              "recoveryPath": {
                "simplerExplanation": "Metrics=What, Traces=Where, Logs=Why.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Centralized Logging with Fluentbit, Elasticsearch & Kibana",
    "overviewMetaphor": "Centralized Logging is a city-wide security camera network: instead of an officer driving to 500 individual buildings to watch local VHS tapes (`kubectl logs pod-xyz` on 500 pods), Fluentbit daemon cameras continuously stream live footage into a central police surveillance headquarters (Elasticsearch cluster); detectives search 100 million video frames in 1 second using search filters (Kibana).",
    "blocks": [
      {
        "id": "devops-d26-b1-fluentbit-daemonset-collection",
        "day": 26,
        "blockNumber": 1,
        "title": "Fluentbit DaemonSet & Container Stdout/Stderr Harvesting",
        "conceptBudget": {
          "primaryConcept": "Fluentbit Log Harvesting",
          "supportingTerms": [
            "DaemonSet (Runs 1 Fluentbit pod per worker node)",
            "Harvesting `/var/log/containers/*.log`",
            "Parsing structured JSON logs and enriching with Kubernetes metadata (Pod, Namespace, Container)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d16-b1-k8s-control-plane-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Fluentbit Pipeline Configuration (`fluent-bit.conf`)",
            "codeSnippet": "[INPUT]\n    Name              tail\n    Path              /var/log/containers/*.log\n    Parser            docker\n    Tag               kube.*\n\n[FILTER]\n    Name              kubernetes\n    Match             kube.*\n    Kube_URL          https://kubernetes.default.svc:443\n\n[OUTPUT]\n    Name              es\n    Match             *\n    Host              elasticsearch.logging.svc\n    Port              9200\n    Index             k8s-logs",
            "lineNotes": {
              "2": "Tails all container log files from the node filesystem.",
              "7": "Enriches raw logs with pod name, namespace, and labels from Kube API.",
              "12": "Streams structured logs into Elasticsearch cluster on port 9200."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fluentbit_enrich_demo.js",
            "initialCode": "function enrichLog(rawLog, podMeta) {\n  return {\n    timestamp: new Date().toISOString(),\n    message: rawLog.msg,\n    level: rawLog.level,\n    k8s: {\n      pod: podMeta.podName,\n      namespace: podMeta.namespace,\n      node: podMeta.nodeName\n    }\n  };\n}\n\nconst enriched = enrichLog({ level: 'error', msg: 'DB connection timeout' }, { podName: 'api-7f8d', namespace: 'prod', nodeName: 'ip-10-0-1-5' });\nconsole.log('Enriched JSON Log:', JSON.stringify(enriched));",
            "expectedOutput": "Enriched JSON Log: {\"timestamp\":\"2026-08-24T17:00:00.000Z\",\"message\":\"DB connection timeout\",\"level\":\"error\",\"k8s\":{\"pod\":\"api-7f8d\",\"namespace\":\"prod\",\"node\":\"ip-10-0-1-5\"}}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is Fluentbit deployed as a Kubernetes `DaemonSet` rather than as a sidecar container inside every single application Pod?",
          "options": [
            "Running 1 Fluentbit DaemonSet per node consumes vastly less CPU and memory (harvesting all node container log files from `/var/log/containers`) compared to running hundreds of redundant sidecar logging containers",
            "Because sidecars cannot read logs",
            "Because DaemonSets are free"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_ELK_LOGSTASH_FLUENTD_LOG_AGGREGATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_ELK_LOGSTASH_FLUENTD_LOG_AGGREGATION",
              "errorExplanation": "DaemonSets provide node-level efficiency without sidecar memory bloat.",
              "recoveryPath": {
                "simplerExplanation": "DaemonSet runs 1 collector per node, saving huge memory.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d26-b2-log-redaction-pii",
        "day": 26,
        "blockNumber": 2,
        "title": "Automated PII & Secret Redaction at Ingestion",
        "conceptBudget": {
          "primaryConcept": "Log Secret Redaction",
          "supportingTerms": [
            "Masking Passwords, JWTs, Credit Cards, and Social Security Numbers",
            "Regex filter masks (`[FILTER] Name rewrite_tag / mask`)",
            "Compliance with GDPR & PCI-DSS"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d26-b1-fluentbit-daemonset-collection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pii_mask_demo.js",
            "initialCode": "function maskSensitiveLog(rawString) {\n  return rawString\n    .replace(/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g, '[REDACTED_EMAIL]')\n    .replace(/bearer\\s+[A-Za-z0-9-_.]+/gi, 'Bearer [REDACTED_JWT]');\n}\n\nconst dirtyLog = 'User alex@example.com authenticated with header Bearer eyJhbGciOiJIUzI1NiJ9.abc.xyz';\nconsole.log('Sanitized Log:', maskSensitiveLog(dirtyLog));",
            "expectedOutput": "Sanitized Log: User [REDACTED_EMAIL] authenticated with header Bearer [REDACTED_JWT]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the redacted email placeholder in the sanitized log output above?",
          "expectedStringOutput": "[REDACTED_EMAIL]",
          "acceptableAnswers": [
            "[REDACTED_EMAIL]",
            "REDACTED_EMAIL"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_ELK_LOGSTASH_FLUENTD_LOG_AGGREGATION",
          "diagnosisMap": {
            "alex@example.com": {
              "misconceptionId": "MC_DEVOPS_ELK_LOGSTASH_FLUENTD_LOG_AGGREGATION",
              "errorExplanation": "PII redaction replaces alex@example.com with [REDACTED_EMAIL].",
              "recoveryPath": {
                "simplerExplanation": "Replaced with [REDACTED_EMAIL].",
                "guidedFixPrompt": "Type [REDACTED_EMAIL]"
              }
            }
          }
        }
      },
      {
        "id": "devops-d26-b3-log-retention-lifecycle",
        "day": 26,
        "blockNumber": 3,
        "title": "Elasticsearch Index Lifecycle Management (ILM) & Hot/Warm/Cold Storage",
        "conceptBudget": {
          "primaryConcept": "Index Lifecycle Management (ILM)",
          "supportingTerms": [
            "Hot Tier (Fast NVMe SSDs for last 7 days)",
            "Warm Tier (Cheaper disks for 30 days)",
            "Cold/Frozen Tier (Archived to S3)",
            "Automated index deletion after 90 days"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d26-b2-log-redaction-pii",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Log ILM Tiering Strategy",
              "boxes": [
                {
                  "label": "Hot Tier (Days 0-7)",
                  "value": "High-IOPS SSDs -> Real-time live searching & active debugging",
                  "varType": "High Cost Fast",
                  "isUpdated": false
                },
                {
                  "label": "Warm Tier (Days 8-30)",
                  "value": "Standard EBS / HDD -> Read-only index queries",
                  "varType": "Medium Cost",
                  "isUpdated": false
                },
                {
                  "label": "Cold/Archived (Days 31-90)",
                  "value": "Compressed in S3 / Glacier -> Compliance auditing only",
                  "varType": "Low Cost",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ilm_tier_demo.js",
            "initialCode": "function getIlmTier(logAgeDays) {\n  if (logAgeDays <= 7) return 'HOT_TIER_SSD';\n  if (logAgeDays <= 30) return 'WARM_TIER_HDD';\n  if (logAgeDays <= 90) return 'COLD_TIER_S3';\n  return 'EXPIRED_DELETED';\n}\n\nconsole.log('3-Day-Old Logs:', getIlmTier(3));\nconsole.log('45-Day-Old Logs:', getIlmTier(45));\nconsole.log('120-Day-Old Logs:', getIlmTier(120));",
            "expectedOutput": "3-Day-Old Logs: HOT_TIER_SSD\n45-Day-Old Logs: COLD_TIER_S3\n120-Day-Old Logs: EXPIRED_DELETED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What storage tier is assigned to 45-day-old logs under the ILM policy above?",
          "expectedStringOutput": "COLD_TIER_S3",
          "acceptableAnswers": [
            "COLD_TIER_S3",
            "45-Day-Old Logs: COLD_TIER_S3"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_ELK_LOGSTASH_FLUENTD_LOG_AGGREGATION",
          "diagnosisMap": {
            "HOT_TIER_SSD": {
              "misconceptionId": "MC_DEVOPS_ELK_LOGSTASH_FLUENTD_LOG_AGGREGATION",
              "errorExplanation": "Hot tier is for <= 7 days. 45 days routes to COLD_TIER_S3.",
              "recoveryPath": {
                "simplerExplanation": "45 days routes to COLD_TIER_S3.",
                "guidedFixPrompt": "Type COLD_TIER_S3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Zero-Downtime Blue-Green & Canary Rollout Orchestration",
    "overviewMetaphor": "Canary Deployments are miners sending a canary into a coal mine: instead of sending 1,000 miners underground at once (100% Big-Bang deployment), you release a tiny canary first (`5% traffic weight`); automated telemetry monitors the canary's health (Error rates, p99 latency); if the canary thrives for 10 minutes, you safely shift 20%, 50%, then 100% of miners into the mine; if the canary gets sick, you instantly pull it out (0s Rollback) without hurting a single customer.",
    "blocks": [
      {
        "id": "devops-d27-b1-blue-green-traffic-cutover",
        "day": 27,
        "blockNumber": 1,
        "title": "Blue-Green Deployments: Instant Service Selector Cutover",
        "conceptBudget": {
          "primaryConcept": "Blue-Green Deployment",
          "supportingTerms": [
            "Blue Fleet (Current Live v1.0)",
            "Green Fleet (New Idle v2.0)",
            "Instant Service Selector Flip (`spec.selector.version: v2.0`)",
            "Instant 0-second rollback on failure"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d17-b1-clusterip-internal-service",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Blue-Green Selector Cutover Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Service points to Blue (v1.0) -> Receiving 100% Traffic",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Deploy Green (v2.0) alongside Blue -> Runs private smoke tests",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "kubectl patch service selector: version=v2.0 -> 100% Traffic flips to Green in 1 millisecond!",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "If bug found: Flip selector back to Blue instantly (Zero rebuild needed!)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "blue_green_sim.js",
            "initialCode": "class BlueGreenServiceRouter {\n  constructor() {\n    this.target = 'BLUE_v1.0';\n  }\n  flipToGreen() { this.target = 'GREEN_v2.0'; return 'CUTOVER_TO_GREEN_SUCCESS'; }\n  rollbackToBlue() { this.target = 'BLUE_v1.0'; return 'INSTANT_ROLLBACK_TO_BLUE_SUCCESS'; }\n}\n\nconst router = new BlueGreenServiceRouter();\nconsole.log('Initial Live Target:', router.target);\nconsole.log('Flip Action:', router.flipToGreen());\nconsole.log('Current Target:', router.target);",
            "expectedOutput": "Initial Live Target: BLUE_v1.0\nFlip Action: CUTOVER_TO_GREEN_SUCCESS\nCurrent Target: GREEN_v2.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the active live target after executing the `flipToGreen()` cutover?",
          "expectedStringOutput": "GREEN_v2.0",
          "acceptableAnswers": [
            "GREEN_v2.0",
            "Current Target: GREEN_v2.0",
            "Green"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_BLUE_GREEN_TRAFFIC_CUTOVER",
          "diagnosisMap": {
            "BLUE_v1.0": {
              "misconceptionId": "MC_DEVOPS_BLUE_GREEN_TRAFFIC_CUTOVER",
              "errorExplanation": "The cutover switches the live target to GREEN_v2.0.",
              "recoveryPath": {
                "simplerExplanation": "Active target is GREEN_v2.0.",
                "guidedFixPrompt": "Type GREEN_v2.0"
              }
            }
          }
        }
      },
      {
        "id": "devops-d27-b2-argo-rollouts-canary-shifting",
        "day": 27,
        "blockNumber": 2,
        "title": "Argo Rollouts: Progressive Canary Traffic Shifting",
        "conceptBudget": {
          "primaryConcept": "Canary Traffic Shifting",
          "supportingTerms": [
            "Argo Rollouts Custom Resource (`kind: Rollout`)",
            "Step Percentages: `setWeight: 10%`, `pause: { duration: 10m }`, `setWeight: 50%`, `setWeight: 100%`",
            "Automated metric analysis"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d27-b1-blue-green-traffic-cutover",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Argo Rollouts Canary Strategy (`rollout.yaml`)",
            "codeSnippet": "apiVersion: argoproj.io/v1alpha1\nkind: Rollout\nmetadata:\n  name: pinit-api\nspec:\n  replicas: 10\n  strategy:\n    canary:\n      steps:\n        - setWeight: 10\n        - pause: { duration: 5m }\n        - setWeight: 50\n        - pause: { duration: 10m }\n        - setWeight: 100",
            "lineNotes": {
              "9": "Routes 10% of live traffic to canary pod version.",
              "10": "Pauses 5 minutes to gather Prometheus telemetry metrics.",
              "13": "Promotes to 100% full release if all metrics stay green."
            }
          },
          {
            "type": "runnable_code",
            "filename": "canary_step_demo.js",
            "initialCode": "function evaluateCanaryProgression(currentWeight, errorRatePercent) {\n  if (errorRatePercent > 2.0) {\n    return { action: 'ABORT_AND_ROLLBACK', targetWeight: 0, reason: 'ERROR_RATE_BREACH' };\n  }\n  const nextWeight = currentWeight === 10 ? 50 : (currentWeight === 50 ? 100 : 100);\n  return { action: nextWeight === 100 ? 'PROMOTE_FULL_PRODUCTION' : 'PROGRESS_NEXT_STEP', targetWeight: nextWeight };\n}\n\nconsole.log('Clean 10% step (0.1% errors):', JSON.stringify(evaluateCanaryProgression(10, 0.1)));\nconsole.log('Failing 10% step (4.5% errors):', JSON.stringify(evaluateCanaryProgression(10, 4.5)));",
            "expectedOutput": "Clean 10% step (0.1% errors): {\"action\":\"PROGRESS_NEXT_STEP\",\"targetWeight\":50}\nFailing 10% step (4.5% errors): {\"action\":\"ABORT_AND_ROLLBACK\",\"targetWeight\":0,\"reason\":\"ERROR_RATE_BREACH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action does Argo Rollouts execute when the 10% canary step experiences a 4.5% error rate spike?",
          "expectedStringOutput": "ABORT_AND_ROLLBACK",
          "acceptableAnswers": [
            "ABORT_AND_ROLLBACK",
            "action\":\"ABORT_AND_ROLLBACK\""
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CANARY_ROLLOUT_ANALYSIS_FLUID",
          "diagnosisMap": {
            "PROGRESS_NEXT_STEP": {
              "misconceptionId": "MC_DEVOPS_CANARY_ROLLOUT_ANALYSIS_FLUID",
              "errorExplanation": "Error spikes above threshold trigger an immediate automated rollback (ABORT_AND_ROLLBACK).",
              "recoveryPath": {
                "simplerExplanation": "High error rate triggers ABORT_AND_ROLLBACK.",
                "guidedFixPrompt": "Type ABORT_AND_ROLLBACK"
              }
            }
          }
        }
      },
      {
        "id": "devops-d27-b3-chaos-engineering-litmus",
        "day": 27,
        "blockNumber": 3,
        "title": "Chaos Engineering: Automated Pod Kill & Latency Injection",
        "conceptBudget": {
          "primaryConcept": "Chaos Engineering in Staging",
          "supportingTerms": [
            "Chaos Mesh / Litmus Chaos",
            "Injecting random pod kills, packet loss, and CPU hogs",
            "Proving self-healing resilience before production"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d27-b2-argo-rollouts-canary-shifting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "chaos_demo.js",
            "initialCode": "function simulatePodKillResilience(totalReplicas, killedCount, hasHpa) {\n  const remaining = totalReplicas - killedCount;\n  return (remaining > 0 && hasHpa)\n    ? 'CHAOS_PASSED_ZERO_SERVICE_OUTAGE'\n    : 'CHAOS_FAILED_OUTAGE_OCCURRED';\n}\n\nconsole.log('Chaos Test on 5 Replicas (2 Killed):', simulatePodKillResilience(5, 2, true));",
            "expectedOutput": "Chaos Test on 5 Replicas (2 Killed): CHAOS_PASSED_ZERO_SERVICE_OUTAGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the core purpose of running automated Chaos Engineering experiments (like killing random pods) in staging environments?",
          "options": [
            "To proactively discover system weaknesses and verify that Kubernetes self-healing and autoscaling can withstand real-world component failures without dropping user traffic",
            "To delete server hard drives",
            "To test developer typing speed"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_CHAOS_ENGINEERING_FAULT_INJECTION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_CHAOS_ENGINEERING_FAULT_INJECTION",
              "errorExplanation": "Chaos experiments validate self-healing resilience under adverse failure conditions.",
              "recoveryPath": {
                "simplerExplanation": "Validates self-healing under failure.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "DevSecOps: Automated SAST, DAST & Software Supply Chain Security",
    "overviewMetaphor": "DevSecOps is a multi-tier automobile crash-test facility: SAST (Static Analysis: SonarQube) inspects the raw steel blueprints before casting (catches SQL injection on line 42 in code); SCA (Software Composition Analysis: Snyk) checks the supplier bolt inventory for known recalls (CVEs in npm packages); DAST (Dynamic Analysis: OWASP ZAP) crashes a live prototype into a wall at 60 MPH (attacks the running web app from the outside to find open security doors).",
    "blocks": [
      {
        "id": "devops-d28-b1-sast-vs-dast-vs-sca",
        "day": 28,
        "blockNumber": 1,
        "title": "The DevSecOps Triad: SAST vs DAST vs SCA",
        "conceptBudget": {
          "primaryConcept": "DevSecOps Security Triad",
          "supportingTerms": [
            "SAST (Static Application Security Testing: SonarQube/Semgrep)",
            "SCA (Software Composition Analysis: Snyk/Trivy/Dependabot)",
            "DAST (Dynamic Application Security Testing: OWASP ZAP)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d12-b1-trivy-cve-severity-scanner",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "DevSecOps Security Triad",
              "boxes": [
                {
                  "label": "1. SAST (Static Code)",
                  "value": "White-Box -> Scans source code for vulnerabilities (SQLi, XSS, hardcoded secrets) before build",
                  "varType": "Code Analysis",
                  "isUpdated": false
                },
                {
                  "label": "2. SCA (Dependencies)",
                  "value": "Supply Chain -> Scans third-party open-source packages (package.json) for known CVEs",
                  "varType": "Dependency Audit",
                  "isUpdated": false
                },
                {
                  "label": "3. DAST (Dynamic Runtime)",
                  "value": "Black-Box -> Attacks running application over HTTP from outside without source code access",
                  "varType": "Runtime Penetration",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "security_scanner_selector.js",
            "initialCode": "function selectSecurityScanner(target) {\n  if (target === 'SOURCE_CODE_TEXT') return 'SAST (e.g. Semgrep / SonarQube)';\n  if (target === 'THIRD_PARTY_NPM_PACKAGES') return 'SCA (e.g. Snyk / Dependabot)';\n  if (target === 'RUNNING_HTTPS_ENDPOINT') return 'DAST (e.g. OWASP ZAP)';\n  return 'UNKNOWN';\n}\n\nconsole.log('Scanning Git Repository Source Code:', selectSecurityScanner('SOURCE_CODE_TEXT'));\nconsole.log('Scanning Open-Source Dependencies:', selectSecurityScanner('THIRD_PARTY_NPM_PACKAGES'));\nconsole.log('Penetration Testing Live Staging URL:', selectSecurityScanner('RUNNING_HTTPS_ENDPOINT'));",
            "expectedOutput": "Scanning Git Repository Source Code: SAST (e.g. Semgrep / SonarQube)\nScanning Open-Source Dependencies: SCA (e.g. Snyk / Dependabot)\nPenetration Testing Live Staging URL: DAST (e.g. OWASP ZAP)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which security scanner type is used for penetration testing a running HTTPS endpoint without source code access?",
          "expectedStringOutput": "DAST (e.g. OWASP ZAP)",
          "acceptableAnswers": [
            "DAST (e.g. OWASP ZAP)",
            "DAST",
            "Penetration Testing Live Staging URL: DAST (e.g. OWASP ZAP)"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DEVSECOPS_SAST_DAST_SCA_SCANNING",
          "diagnosisMap": {
            "SAST": {
              "misconceptionId": "MC_DEVOPS_DEVSECOPS_SAST_DAST_SCA_SCANNING",
              "errorExplanation": "SAST is for static source code. DAST is for attacking running live HTTP endpoints.",
              "recoveryPath": {
                "simplerExplanation": "Running HTTP app uses DAST.",
                "guidedFixPrompt": "Type DAST (e.g. OWASP ZAP)"
              }
            }
          }
        }
      },
      {
        "id": "devops-d28-b2-sbom-software-bill-materials",
        "day": 28,
        "blockNumber": 2,
        "title": "Software Bill of Materials (SBOM) & CycloneDX / SPDX",
        "conceptBudget": {
          "primaryConcept": "SBOM Generation",
          "supportingTerms": [
            "SBOM (Software Bill of Materials: CycloneDX, SPDX)",
            "Complete inventory of all transitive dependencies, licenses, and hashes",
            "Executive Order 14028 compliance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d28-b1-sast-vs-dast-vs-sca",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sbom_generator_demo.js",
            "initialCode": "function generateSbomRecord(packageName, version, license) {\n  return {\n    bomFormat: 'CycloneDX',\n    specVersion: '1.5',\n    component: { name: packageName, version, license, verified: true }\n  };\n}\n\nconsole.log('SBOM Record for Express:', JSON.stringify(generateSbomRecord('express', '4.18.2', 'MIT')));",
            "expectedOutput": "SBOM Record for Express: {\"bomFormat\":\"CycloneDX\",\"specVersion\":\"1.5\",\"component\":{\"name\":\"express\",\"version\":\"4.18.2\",\"license\":\"MIT\",\"verified\":true}}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are enterprise engineering teams required to generate a Software Bill of Materials (SBOM) for every production release?",
          "options": [
            "An SBOM provides a complete, machine-readable inventory of every open-source dependency and sub-dependency inside an application, allowing instant identification of newly discovered zero-day vulnerabilities (like Log4j)",
            "Because SBOM makes images download 50% faster",
            "To replace package.json"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_DEVSECOPS_SAST_DAST_SCA_SCANNING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_DEVSECOPS_SAST_DAST_SCA_SCANNING",
              "errorExplanation": "SBOMs enable instant security tracking when zero-day vulnerabilities emerge in open-source components.",
              "recoveryPath": {
                "simplerExplanation": "Enables instant discovery of vulnerable dependencies.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d28-b3-git-secret-leak-prevention",
        "day": 28,
        "blockNumber": 3,
        "title": "Pre-Commit Hooks & Git Secret Leak Prevention (TruffleHog/Gitleaks)",
        "conceptBudget": {
          "primaryConcept": "Secret Leak Prevention",
          "supportingTerms": [
            "Pre-commit hooks (`gitleaks protect`)",
            "Entropy checks detecting raw AWS keys (`AKIA...`) and private keys (`BEGIN RSA PRIVATE KEY`) before git commit",
            "Shift-Left Security"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d28-b2-sbom-software-bill-materials",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gitleaks_demo.js",
            "initialCode": "function evaluateCommitDiff(diffContent) {\n  const hasAwsKey = /AKIA[0-9A-Z]{16}/.test(diffContent);\n  const hasPrivateKey = /BEGIN (RSA )?PRIVATE KEY/.test(diffContent);\n  if (hasAwsKey || hasPrivateKey) {\n    return { commitAllowed: false, error: 'BLOCKED_BY_PRE_COMMIT_SECRET_LEAK_DETECTED' };\n  }\n  return { commitAllowed: true, status: 'CLEAN_DIFF' };\n}\n\nconsole.log('Clean Code Diff:', evaluateCommitDiff('const a = 10;').status);\nconsole.log('Leaked AWS Key Diff:', evaluateCommitDiff('const key = \"AKIAIOSFODNN7EXAMPLE\";').error);",
            "expectedOutput": "Clean Code Diff: CLEAN_DIFF\nLeaked AWS Key Diff: BLOCKED_BY_PRE_COMMIT_SECRET_LEAK_DETECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error message is triggered by a pre-commit hook when an AWS access key is found in a staged file?",
          "expectedStringOutput": "BLOCKED_BY_PRE_COMMIT_SECRET_LEAK_DETECTED",
          "acceptableAnswers": [
            "BLOCKED_BY_PRE_COMMIT_SECRET_LEAK_DETECTED",
            "Leaked AWS Key Diff: BLOCKED_BY_PRE_COMMIT_SECRET_LEAK_DETECTED"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_DEVSECOPS_SAST_DAST_SCA_SCANNING",
          "diagnosisMap": {
            "CLEAN_DIFF": {
              "misconceptionId": "MC_DEVOPS_DEVSECOPS_SAST_DAST_SCA_SCANNING",
              "errorExplanation": "The pre-commit scanner blocks the commit with BLOCKED_BY_PRE_COMMIT_SECRET_LEAK_DETECTED.",
              "recoveryPath": {
                "simplerExplanation": "Secret triggers BLOCKED_BY_PRE_COMMIT_SECRET_LEAK_DETECTED.",
                "guidedFixPrompt": "Type BLOCKED_BY_PRE_COMMIT_SECRET_LEAK_DETECTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Zero-Downtime Database Migrations & The Expand-Contract Pattern",
    "overviewMetaphor": "The Expand-Contract Migration Pattern is building a new bridge alongside an old bridge: Phase 1 (Expand): You build the new 4-lane highway next to the old 2-lane bridge and write data to BOTH bridges (Dual Writing); Phase 2 (Migrate): You reroute all traffic to the new bridge; Phase 3 (Contract): After verifying zero traffic uses the old bridge, you safely demolish the old bridge (Drop old column).",
    "blocks": [
      {
        "id": "devops-d29-b1-expand-contract-3-phases",
        "day": 29,
        "blockNumber": 1,
        "title": "The 3 Phases of Expand-Contract (Parallel Run)",
        "conceptBudget": {
          "primaryConcept": "Expand-Contract Pattern",
          "supportingTerms": [
            "Phase 1: Expand (Add new nullable column; app writes to BOTH old and new)",
            "Phase 2: Migrate (Backfill historical records; deploy new app reading new column)",
            "Phase 3: Contract (Drop old deprecated column safely)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d16-b3-rolling-update-zero-downtime",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Expand-Contract 3-Phase Migration Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Phase 1 (Expand): ADD COLUMN full_name VARCHAR(255) NULL (Backward compatible with live app!)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "App v2.0 Deployed: Dual-writes to both name AND full_name -> Backfill script updates old rows",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Phase 2 (Migrate): App v3.0 reads strictly from full_name -> Zero queries use old name column",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Phase 3 (Contract): DROP COLUMN name -> Clean zero-downtime schema evolution complete!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "expand_contract_demo.js",
            "initialCode": "function simulateSchemaAccess(phase, requestedColumn) {\n  if (phase === 'EXPAND') {\n    return ['name', 'full_name'].includes(requestedColumn) ? 'COMPATIBLE_200_OK' : 'ERROR_404';\n  }\n  if (phase === 'CONTRACT') {\n    return requestedColumn === 'full_name' ? 'COMPATIBLE_200_OK' : 'CRASH_COLUMN_DROPPED';\n  }\n  return 'UNKNOWN';\n}\n\nconsole.log('Old App querying old name during EXPAND:', simulateSchemaAccess('EXPAND', 'name'));\nconsole.log('New App querying full_name during EXPAND:', simulateSchemaAccess('EXPAND', 'full_name'));\nconsole.log('Old App querying dropped name after CONTRACT:', simulateSchemaAccess('CONTRACT', 'name'));",
            "expectedOutput": "Old App querying old name during EXPAND: COMPATIBLE_200_OK\nNew App querying full_name during EXPAND: COMPATIBLE_200_OK\nOld App querying dropped name after CONTRACT: CRASH_COLUMN_DROPPED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can an older running application version still successfully query the database during the `EXPAND` phase?",
          "expectedStringOutput": "COMPATIBLE_200_OK",
          "acceptableAnswers": [
            "COMPATIBLE_200_OK",
            "Old App querying old name during EXPAND: COMPATIBLE_200_OK",
            "Yes"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_ZERO_DOWNTIME_DB_SCHEMA_MIGRATION",
          "diagnosisMap": {
            "CRASH": {
              "misconceptionId": "MC_DEVOPS_ZERO_DOWNTIME_DB_SCHEMA_MIGRATION",
              "errorExplanation": "Expand phase is strictly backward-compatible, returning COMPATIBLE_200_OK.",
              "recoveryPath": {
                "simplerExplanation": "Expand is backward-compatible -> COMPATIBLE_200_OK.",
                "guidedFixPrompt": "Type COMPATIBLE_200_OK"
              }
            }
          }
        }
      },
      {
        "id": "devops-d29-b2-database-lock-avoidance",
        "day": 29,
        "blockNumber": 2,
        "title": "DDL Lock Avoidance & Online Index Creation (`CONCURRENTLY`)",
        "conceptBudget": {
          "primaryConcept": "Online DDL Locks",
          "supportingTerms": [
            "`CREATE INDEX CONCURRENTLY` in PostgreSQL",
            "`ALGORITHM=INPLACE` in MySQL",
            "Avoiding `ACCESS EXCLUSIVE` table locks that freeze live web requests"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d29-b1-expand-contract-3-phases",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PostgreSQL Zero-Downtime DDL Syntax",
            "codeSnippet": "-- ❌ BLOCKING: Locks entire table for writes for 20 minutes!\nCREATE INDEX idx_users_email ON users(email);\n\n-- ✅ ZERO-DOWNTIME: Builds index in background without blocking live INSERT/UPDATE queries!\nCREATE INDEX CONCURRENTLY idx_users_email ON users(email);",
            "lineNotes": {
              "2": "Acquires exclusive table lock, queueing all write transactions until index finishes.",
              "5": "CONCURRENTLY builds index in multi-pass mode with zero write downtime."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ddl_lock_demo.js",
            "initialCode": "function evaluateDdlLock(isConcurrently) {\n  return isConcurrently\n    ? { lockType: 'SHARE_UPDATE_EXCLUSIVE', allowsLiveWrites: true, downtime: '0s' }\n    : { lockType: 'ACCESS_EXCLUSIVE', allowsLiveWrites: false, downtime: 'TABLE_LOCKED' };\n}\n\nconsole.log('CREATE INDEX CONCURRENTLY:', evaluateDdlLock(true).allowsLiveWrites);\nconsole.log('Standard CREATE INDEX:', evaluateDdlLock(false).allowsLiveWrites);",
            "expectedOutput": "CREATE INDEX CONCURRENTLY: true\nStandard CREATE INDEX: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must large production database indexes always be created using `CREATE INDEX CONCURRENTLY` in PostgreSQL?",
          "options": [
            "Because standard index creation acquires an exclusive table lock that blocks all incoming customer write operations (INSERT, UPDATE, DELETE) for minutes or hours, causing severe application downtime",
            "Because CONCURRENTLY makes indexes smaller",
            "Because PostgreSQL disables standard indexes"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_DEVOPS_ZERO_DOWNTIME_DB_SCHEMA_MIGRATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_ZERO_DOWNTIME_DB_SCHEMA_MIGRATION",
              "errorExplanation": "CONCURRENTLY avoids table locks, allowing continuous live write traffic.",
              "recoveryPath": {
                "simplerExplanation": "CONCURRENTLY avoids blocking table locks.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "devops-d29-b3-automated-migration-jobs",
        "day": 29,
        "blockNumber": 3,
        "title": "Kubernetes Pre-Install Helm Hooks & Migration Jobs",
        "conceptBudget": {
          "primaryConcept": "Kubernetes Schema Migration Jobs",
          "supportingTerms": [
            "`helm.sh/hook: pre-install,pre-upgrade`",
            "`helm.sh/hook-delete-policy: hook-succeeded`",
            "Running database migrations before deploying new application pods"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d29-b2-database-lock-avoidance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "migration_hook_demo.js",
            "initialCode": "function evaluateMigrationHook(migrationJobSuccess) {\n  if (!migrationJobSuccess) {\n    return { proceedToDeployment: false, action: 'HALT_ROLLOUT_DB_MIGRATION_FAILED' };\n  }\n  return { proceedToDeployment: true, action: 'START_APPLICATION_ROLLING_UPDATE' };\n}\n\nconsole.log('Failed Migration Job:', evaluateMigrationHook(false).action);\nconsole.log('Successful Migration Job:', evaluateMigrationHook(true).action);",
            "expectedOutput": "Failed Migration Job: HALT_ROLLOUT_DB_MIGRATION_FAILED\nSuccessful Migration Job: START_APPLICATION_ROLLING_UPDATE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken when a pre-upgrade database migration job fails in Kubernetes?",
          "expectedStringOutput": "HALT_ROLLOUT_DB_MIGRATION_FAILED",
          "acceptableAnswers": [
            "HALT_ROLLOUT_DB_MIGRATION_FAILED",
            "Failed Migration Job: HALT_ROLLOUT_DB_MIGRATION_FAILED",
            "Halt rollout"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_ZERO_DOWNTIME_DB_SCHEMA_MIGRATION",
          "diagnosisMap": {
            "START": {
              "misconceptionId": "MC_DEVOPS_ZERO_DOWNTIME_DB_SCHEMA_MIGRATION",
              "errorExplanation": "A failed migration hook immediately halts the deployment rollout to protect data integrity.",
              "recoveryPath": {
                "simplerExplanation": "Halts rollout on migration failure.",
                "guidedFixPrompt": "Type HALT_ROLLOUT_DB_MIGRATION_FAILED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise GitOps Continuous Delivery & Zero-Downtime Multi-Cluster Kubernetes Platform",
    "overviewMetaphor": "Final Capstone Synthesis: The complete production enterprise DevOps & GitOps platform featuring GitHub Actions CI, ArgoCD GitOps, Helm Charts, Prometheus & Grafana telemetry, DevSecOps security gates, and zero-downtime Canary deployments across Multi-Cluster Kubernetes.",
    "blocks": [
      {
        "id": "devops-d30-b1-enterprise-gitops-architecture",
        "day": 30,
        "blockNumber": 1,
        "title": "Multi-Cluster Enterprise GitOps Platform Architecture",
        "conceptBudget": {
          "primaryConcept": "Enterprise GitOps Multi-Cluster Topology",
          "supportingTerms": [
            "Multi-Cluster ArgoCD (US East + EU West)",
            "Centralized Observability (Prometheus, Grafana, OpenTelemetry, Fluentbit)",
            "Automated Security Gate (Trivy, Cosign, Gitleaks)",
            "Canary Traffic Shifting with Automated Rollback"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d29-b1-expand-contract-3-phases",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Enterprise GitOps Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "GitHub: Developer merges feature branch to main",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "GitHub Actions: Matrix Tests -> Trivy CVE Scan -> Cosign Signing -> Pushes Image to GHCR",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "ArgoCD Controller: Pulls updated Helm GitOps manifests & syncs across US and EU K8s Clusters",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Argo Rollouts: Executes 10% -> 50% -> 100% Canary shifting verified by Prometheus SLA Telemetry",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "enterprise_capstone_demo.js",
            "initialCode": "class EnterpriseGitOpsPlatform {\n  constructor() {\n    this.clusters = ['k8s-us-east-prod', 'k8s-eu-west-prod'];\n    this.securityGate = 'PASSED (0 Critical CVEs)';\n    this.gitOpsSync = 'SYNCED_HEALTHY';\n  }\n  executeRelease(version) {\n    return {\n      releaseId: `rel_${Date.now()}`,\n      version,\n      clustersSynced: this.clusters.length,\n      canaryStatus: 'PROMOTED_100_PERCENT',\n      downtime: '0.00 seconds'\n    };\n  }\n}\n\nconst platform = new EnterpriseGitOpsPlatform();\nconsole.log('Enterprise Release Outcome:', JSON.stringify(platform.executeRelease('v3.0.0')));",
            "expectedOutput": "Enterprise Release Outcome: {\"releaseId\":\"rel_1724518800000\",\"version\":\"v3.0.0\",\"clustersSynced\":2,\"canaryStatus\":\"PROMOTED_100_PERCENT\",\"downtime\":\"0.00 seconds\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many production Kubernetes clusters are synced simultaneously during the enterprise GitOps release?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 clusters",
            "clustersSynced\":2"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CAPSTONE_ENTERPRISE_GITOPS_K8S_CICD_PLATFORM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DEVOPS_CAPSTONE_ENTERPRISE_GITOPS_K8S_CICD_PLATFORM",
              "errorExplanation": "ArgoCD coordinates multi-cluster deployments across both us-east and eu-west (2 clusters).",
              "recoveryPath": {
                "simplerExplanation": "2 clusters are synced.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "devops-d30-b2-platform-reliability-dora-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise SRE & DORA Metrics Final Audit",
        "conceptBudget": {
          "primaryConcept": "Enterprise SRE Audit",
          "supportingTerms": [
            "99.99% Availability SLA",
            "MTTR < 5 minutes via automated canary rollbacks",
            "Zero manual kubectl production modifications"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d30-b1-enterprise-gitops-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sre_audit_demo.js",
            "initialCode": "function auditPlatformQuality(automatedRollbacks, gitOpsOnly, zeroDowntimeMigrations) {\n  const compliant = automatedRollbacks && gitOpsOnly && zeroDowntimeMigrations;\n  return compliant ? 'ENTERPRISE_SRE_GRADE_A_PLUS' : 'COMPLIANCE_FAILED';\n}\n\nconsole.log('Platform Audit Status:', auditPlatformQuality(true, true, true));",
            "expectedOutput": "Platform Audit Status: ENTERPRISE_SRE_GRADE_A_PLUS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What SRE compliance grade is achieved across the enterprise platform?",
          "expectedStringOutput": "ENTERPRISE_SRE_GRADE_A_PLUS",
          "acceptableAnswers": [
            "ENTERPRISE_SRE_GRADE_A_PLUS",
            "Platform Audit Status: ENTERPRISE_SRE_GRADE_A_PLUS",
            "Grade A+"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CAPSTONE_ENTERPRISE_GITOPS_K8S_CICD_PLATFORM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DEVOPS_CAPSTONE_ENTERPRISE_GITOPS_K8S_CICD_PLATFORM",
              "errorExplanation": "The platform achieves full compliance with ENTERPRISE_SRE_GRADE_A_PLUS.",
              "recoveryPath": {
                "simplerExplanation": "Grade is ENTERPRISE_SRE_GRADE_A_PLUS.",
                "guidedFixPrompt": "Type ENTERPRISE_SRE_GRADE_A_PLUS"
              }
            }
          }
        }
      },
      {
        "id": "devops-d30-b3-devops-mastery-certification",
        "day": 30,
        "blockNumber": 3,
        "title": "DevOps & CI/CD Pipeline Automation Master Certification",
        "conceptBudget": {
          "primaryConcept": "DevOps Master Certification",
          "supportingTerms": [
            "100/100 Gold Standard",
            "Zero Defects",
            "Production DevOps & GitOps Mastery"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "devops-d30-b2-platform-reliability-dora-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_devops_cert.js",
            "initialCode": "console.log('🎉 DevOps & CI/CD Pipeline Automation Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]');",
            "expectedOutput": "🎉 DevOps & CI/CD Pipeline Automation Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification score is achieved across the 30-day DevOps & CI/CD curriculum?",
          "expectedStringOutput": "🎉 DevOps & CI/CD Pipeline Automation Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
          "acceptableAnswers": [
            "🎉 DevOps & CI/CD Pipeline Automation Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "100/100",
            "100"
          ],
          "primaryMisconceptionId": "MC_DEVOPS_CAPSTONE_ENTERPRISE_GITOPS_K8S_CICD_PLATFORM",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_DEVOPS_CAPSTONE_ENTERPRISE_GITOPS_K8S_CICD_PLATFORM",
              "errorExplanation": "The complete Gold-Standard course achieves 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 🎉 DevOps & CI/CD Pipeline Automation Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
