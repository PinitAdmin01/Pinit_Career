import { LongLesson } from './longLessons';

/**
 * DevOps & CI/CD Pipeline Automation (course-devops-cicd, prefix: devops):
 * 30 comprehensive long-format lessons (20-30 minutes each, >= 9.2 spoken minutes)
 * covering Linux administration, Docker, multi-stage builds, Compose, GitHub Actions,
 * Kubernetes architecture, Helm, GitOps (ArgoCD), Prometheus/Grafana observability,
 * and DevSecOps production practices.
 */
export const DEVOPS_WEB_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "DevOps Culture, CI/CD & The 12-Factor App",
    "goal": "Understand the CALMS framework, continuous integration vs delivery, and how to apply 12-Factor principles to decouple configuration from code.",
    "minutes": 25,
    "recap": "Welcome to DevOps and CI/CD Automation. Today we begin by exploring how modern engineering teams move fast without breaking production systems.",
    "parts": [
      {
        "title": "The CALMS Framework for Modern Operations",
        "say": [
          "In traditional software companies, developers wrote code for months and then threw it over a digital wall to operations engineers to deploy.",
          "When the deployment failed, developers blamed operations for misconfiguring servers, and operations blamed developers for writing buggy code.",
          "DevOps was created to tear down that wall by uniting development and operations into a single continuous feedback loop.",
          "To understand DevOps beyond mere tools like Docker or Jenkins, industry leaders formalized the CALMS framework.",
          "CALMS stands for Culture, Automation, Lean, Measurement, and Sharing.",
          "Culture means fostering shared responsibility where developers also monitor their services in production.",
          "Automation eliminates repetitive manual toil by using reproducible scripts and automated testing pipelines.",
          "Lean principles focus on small batch sizes and minimizing inventory, meaning small, frequent releases rather than massive scary launches.",
          "Measurement requires tracking metrics like deployment frequency, lead time for changes, and mean time to recovery.",
          "Sharing ensures that incident learnings and postmortems are shared openly across all teams without blame."
        ],
        "example": "Think of an aircraft manufacturing plant where engineers inspect every fastener as it is installed instead of waiting until the plane rolls onto the runway to check for loose bolts.",
        "code": "interface CalmsPillar {\n  pillar: string;\n  focus: string;\n  metric: string;\n}\n\nconst calmsFramework: CalmsPillar[] = [\n  { pillar: 'Culture', focus: 'Shared responsibility and blameless reviews', metric: 'Team satisfaction score' },\n  { pillar: 'Automation', focus: 'Pipelines replace manual steps', metric: 'Automation test coverage %' },\n  { pillar: 'Lean', focus: 'Small frequent batch deployments', metric: 'Batch size in lines of code' },\n  { pillar: 'Measurement', focus: 'Telemetry and DORA metrics', metric: 'Mean time to recovery (MTTR)' },\n  { pillar: 'Sharing', focus: 'Cross-functional transparency', metric: 'Knowledge sharing articles' },\n];\n\nfor (const item of calmsFramework) {\n  console.log(`[${item.pillar}] ${item.focus} -> Target: ${item.metric}`);\n}",
        "output": "[Culture] Shared responsibility and blameless reviews -> Target: Team satisfaction score\n[Automation] Pipelines replace manual steps -> Target: Automation test coverage %\n[Lean] Small frequent batch deployments -> Target: Batch size in lines of code\n[Measurement] Telemetry and DORA metrics -> Target: Mean time to recovery (MTTR)\n[Sharing] Cross-functional transparency -> Target: Knowledge sharing articles",
        "codeNotes": [
          {
            "line": 7,
            "note": "Defines the 5 pillars of the CALMS model with their concrete operational targets."
          },
          {
            "line": 15,
            "note": "Iterates through each pillar to display how organizational focus pairs with measurable outcomes."
          }
        ],
        "tryIt": "Add another entry for Psychological Safety and observe how it enhances cultural measurement.",
        "check": {
          "question": "What does the L in the CALMS DevOps framework represent?",
          "options": [
            "Logistics management",
            "Lean principles focusing on small batch sizes",
            "Linear regression testing"
          ],
          "answer": 1,
          "why": "The L in CALMS stands for Lean principles, which emphasize eliminating waste and shipping work in small batches."
        }
      },
      {
        "title": "12-Factor App: Factor III (Config in the Environment)",
        "say": [
          "The 12-Factor App methodology was established by engineers at Heroku after observing thousands of cloud application deployments.",
          "One of the most violated rules in enterprise backends is Factor III: Store configuration in the environment.",
          "Configuration consists of anything that changes between deployment targets, such as development, staging, and production.",
          "This includes database connection credentials, payment gateway tokens, API secrets, and server listening ports.",
          "If you commit database passwords inside a configuration file in your Git repository, you create severe security vulnerabilities.",
          "Furthermore, baking config into code forces you to rebuild your binary or container image just to change a staging host.",
          "12-Factor applications strictly separate code from configuration by reading all secrets dynamically from process environment variables.",
          "This guarantees that the exact same compiled container image artifact can run in local development, QA, and production without any modifications.",
          "When deploying to production, the orchestrator injects environment variables into the process at container startup.",
          "This pattern keeps secrets out of version control and ensures full portability across cloud providers."
        ],
        "example": "Think of an electrical appliance with a standard wall plug. The appliance does not hardcode the voltage of your city; it adapts based on the electrical socket it plugs into.",
        "code": "function resolveAppConfig(env: Record<string, string | undefined>) {\n  const dbHost = env.DB_HOST ?? 'localhost';\n  const dbPort = parseInt(env.DB_PORT ?? '5432', 10);\n  const isProd = env.NODE_ENV === 'production';\n  const apiKey = env.PAYMENT_API_KEY;\n\n  if (isProd && !apiKey) {\n    throw new Error('FATAL: PAYMENT_API_KEY missing in production environment!');\n  }\n\n  return {\n    connectionString: `postgres://${dbHost}:${dbPort}/app_db`,\n    mode: isProd ? 'STRICT_PROD' : 'LOCAL_DEV',\n    hasSecret: Boolean(apiKey)\n  };\n}\n\nconst localConfig = resolveAppConfig({ NODE_ENV: 'development' });\nconsole.log('Local Config:', JSON.stringify(localConfig));\n\nconst prodConfig = resolveAppConfig({\n  NODE_ENV: 'production',\n  DB_HOST: 'pg-prod.internal',\n  DB_PORT: '5432',\n  PAYMENT_API_KEY: 'sk_live_9981'\n});\nconsole.log('Prod Config:', JSON.stringify(prodConfig));",
        "output": "Local Config: {\"connectionString\":\"postgres://localhost:5432/app_db\",\"mode\":\"LOCAL_DEV\",\"hasSecret\":false}\nProd Config: {\"connectionString\":\"postgres://pg-prod.internal:5432/app_db\",\"mode\":\"STRICT_PROD\",\"hasSecret\":true}",
        "codeNotes": [
          {
            "line": 7,
            "note": "Guards against booting in production without mandatory secrets injected by the environment."
          },
          {
            "line": 11,
            "note": "Dynamically constructs connection strings from environment variables without hardcoded defaults."
          }
        ],
        "tryIt": "Change the port to 5433 in prodConfig and verify that the connection string updates without code changes.",
        "check": {
          "question": "According to 12-Factor App Factor III, where should database credentials be stored?",
          "options": [
            "In a JSON file committed to the Git repository",
            "In environment variables provided at runtime",
            "Inside the Dockerfile CMD statement"
          ],
          "answer": 1,
          "why": "Storing configuration in environment variables keeps secrets out of Git and allows the exact same image to run across all environments."
        }
      },
      {
        "title": "12-Factor App: Factor IX (Disposability & Graceful Shutdown)",
        "say": [
          "Factor IX of the 12-Factor methodology dictates that applications must be disposable, maximizing robustness with fast startup and graceful shutdown.",
          "In cloud-native architectures, servers, containers, and virtual machines are treated as cattle, not pets.",
          "Any container can be terminated at any moment due to autoscaling down, rolling deployments, or node hardware failures.",
          "Fast startup time is critical because when unexpected traffic spikes arrive, autoscaling must spin up new replicas in seconds.",
          "Equally important is graceful shutdown: when the orchestrator sends a SIGTERM signal, the application must not crash instantly.",
          "Instead, it must stop accepting new incoming requests, complete all in-flight HTTP connections, flush write buffers, and close database connections cleanly.",
          "If an application terminates abruptly, ongoing transactions might corrupt database states or leave customer carts in limbo.",
          "Disposability ensures that shutting down or spinning up instances is an everyday routine rather than a catastrophic emergency.",
          "By designing for quick boot and safe teardown, your backend becomes resilient to crashes and dynamic scaling.",
          "Let us observe how a process manages an in-flight queue during a shutdown signal."
        ],
        "example": "Like a restaurant kitchen that stops taking new orders at 10 PM so chefs can finish cooking dishes already ordered before turning off the ovens.",
        "code": "class ServerDrainer {\n  private activeConnections = 3;\n  private isAccepting = true;\n\n  public receiveSigterm(): string[] {\n    const logs: string[] = [];\n    logs.push('SIGTERM received: Stopping new incoming connections');\n    this.isAccepting = false;\n\n    logs.push(`Draining ${this.activeConnections} active in-flight requests...`);\n    while (this.activeConnections > 0) {\n      logs.push(`Completed request #${this.activeConnections}`);\n      this.activeConnections--;\n    }\n\n    logs.push('All connections drained cleanly. Database pools closed.');\n    logs.push('Process exiting with code 0 (Clean Termination)');\n    return logs;\n  }\n}\n\nconst drainer = new ServerDrainer();\nconst teardownLogs = drainer.receiveSigterm();\nteardownLogs.forEach(log => console.log(log));",
        "output": "SIGTERM received: Stopping new incoming connections\nDraining 3 active in-flight requests...\nCompleted request #3\nCompleted request #2\nCompleted request #1\nAll connections drained cleanly. Database pools closed.\nProcess exiting with code 0 (Clean Termination)",
        "codeNotes": [
          {
            "line": 7,
            "note": "Flips the gate flag so new incoming traffic is rejected or routed to healthy siblings."
          },
          {
            "line": 11,
            "note": "Finishes all existing user requests before closing sockets and exiting cleanly."
          }
        ],
        "tryIt": "Increase initial activeConnections to 5 and observe the drain loop complete each connection.",
        "check": {
          "question": "What is the primary responsibility of an application during a graceful shutdown sequence?",
          "options": [
            "Instantly terminate all connections with an error",
            "Stop accepting new traffic and finish processing in-flight requests",
            "Delete all log files from disk"
          ],
          "answer": 1,
          "why": "Graceful shutdown stops new incoming traffic while allowing existing in-flight requests to complete without data loss."
        }
      },
      {
        "title": "Continuous Integration vs Continuous Delivery vs Continuous Deployment",
        "say": [
          "Engineers frequently lump the acronyms CI and CD together, but they represent distinct phases of automation maturity.",
          "Continuous Integration (CI) is the practice of automating the integration of code changes from multiple contributors into a single software project.",
          "Every time a developer pushes a branch or opens a Pull Request, automated runners trigger a build, run unit tests, and execute static linters.",
          "If any test or lint check fails, the build breaks, and the branch is blocked from merging into the main line.",
          "Continuous Delivery (CD) is the next phase: every build that passes CI is automatically packaged into a release artifact, like a Docker container or zip package.",
          "The artifact is automatically deployed to testing or staging environments, ready to be deployed to production with the click of a button.",
          "Continuous Deployment takes this one step further: there is no manual approval button.",
          "Every single commit that clears all automated tests, security scans, and smoke checks is deployed directly to production users automatically.",
          "While Continuous Delivery keeps the software in a constantly deployable state, Continuous Deployment eliminates all human gates.",
          "High-performing tech organizations achieve hundreds of automated deployments per day using robust continuous deployment."
        ],
        "example": "Like an automated bakery conveyor belt: CI inspects the dough for purity, CD boxes the baked loaves onto delivery trucks, and Continuous Deployment drives the trucks straight to grocery shelves.",
        "code": "type PipelineStage = 'LINT' | 'TEST' | 'PACKAGE' | 'STAGING' | 'PROD';\n\nfunction evaluatePipelineFlow(stagesPassed: PipelineStage[], isManualApprovalGranted: boolean) {\n  const hasCI = stagesPassed.includes('LINT') && stagesPassed.includes('TEST');\n  const hasCDelivery = hasCI && stagesPassed.includes('PACKAGE') && stagesPassed.includes('STAGING');\n  const canDeployProd = hasCDelivery && isManualApprovalGranted;\n\n  return {\n    ciPassed: hasCI,\n    readyForDelivery: hasCDelivery,\n    deployedToProduction: canDeployProd,\n    status: canDeployProd ? 'RELEASED_TO_PROD' : hasCDelivery ? 'READY_IN_STAGING' : 'CI_IN_PROGRESS'\n  };\n}\n\nconsole.log('Automated PR Check:', JSON.stringify(evaluatePipelineFlow(['LINT', 'TEST'], false)));\nconsole.log('Staging Artifact Built:', JSON.stringify(evaluatePipelineFlow(['LINT', 'TEST', 'PACKAGE', 'STAGING'], false)));\nconsole.log('Production Release:', JSON.stringify(evaluatePipelineFlow(['LINT', 'TEST', 'PACKAGE', 'STAGING'], true)));",
        "output": "Automated PR Check: {\"ciPassed\":true,\"readyForDelivery\":false,\"deployedToProduction\":false,\"status\":\"CI_IN_PROGRESS\"}\nStaging Artifact Built: {\"ciPassed\":true,\"readyForDelivery\":true,\"deployedToProduction\":false,\"status\":\"READY_IN_STAGING\"}\nProduction Release: {\"ciPassed\":true,\"readyForDelivery\":true,\"deployedToProduction\":true,\"status\":\"RELEASED_TO_PROD\"}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Checks that linting and unit testing pass before admitting code into the packaging pipeline."
          },
          {
            "line": 6,
            "note": "Continuous delivery holds before production until business verification or manual approval is granted."
          }
        ],
        "tryIt": "Remove TEST from the array and verify that the pipeline halts before staging deployment.",
        "check": {
          "question": "What is the key difference between Continuous Delivery and Continuous Deployment?",
          "options": [
            "Continuous Delivery does not test code",
            "Continuous Delivery requires human approval for production, while Continuous Deployment releases automatically",
            "Continuous Deployment only runs on weekends"
          ],
          "answer": 1,
          "why": "Continuous Delivery prepares a deployable build waiting for a manual release decision, while Continuous Deployment ships straight to production automatically."
        }
      },
      {
        "title": "Pipeline Triggers & Branching Strategies",
        "say": [
          "To run continuous integration effectively, teams must define precise triggers that map Git events to pipeline workflows.",
          "Running a full 45-minute end-to-end regression suite on every single commit push would clog pipeline runners and slow developer velocity.",
          "Modern teams categorize triggers based on git ref patterns and event types.",
          "Pull Request events typically trigger fast feedback suites: linting, type checks, unit tests, and security dependency audits.",
          "Pushes to the main trunk or master branch trigger build artifacts, container image tags, and automatic staging deployments.",
          "Tag creation events (such as pushing v1.4.0) trigger official production releases, changelog generation, and cloud rollouts.",
          "Trunk-Based Development has largely replaced complex GitFlow models in modern DevOps organizations.",
          "In Trunk-Based Development, developers merge small, short-lived branches into main multiple times a day.",
          "Long-lived feature branches that linger for weeks accumulate massive merge conflicts and derail release cycles.",
          "Let us see how a trigger evaluator routes different Git events to their corresponding pipeline stages."
        ],
        "example": "Like an express mail sorting facility where postcards get routed to light airmail vans immediately, while heavy shipping crates are routed to freight trains.",
        "code": "interface GitEvent {\n  action: 'pull_request' | 'push' | 'tag';\n  branch?: string;\n  tagName?: string;\n}\n\nfunction selectPipelineJobs(event: GitEvent): string[] {\n  if (event.action === 'pull_request') {\n    return ['lint', 'unit_tests', 'security_scan'];\n  }\n  if (event.action === 'push' && event.branch === 'main') {\n    return ['lint', 'unit_tests', 'build_docker_image', 'deploy_staging'];\n  }\n  if (event.action === 'tag' && event.tagName?.startsWith('v')) {\n    return ['verify_artifacts', 'deploy_production', 'generate_changelog'];\n  }\n  return ['noop'];\n}\n\nconsole.log('PR Event:', JSON.stringify(selectPipelineJobs({ action: 'pull_request', branch: 'feat/cart' })));\nconsole.log('Main Push:', JSON.stringify(selectPipelineJobs({ action: 'push', branch: 'main' })));\nconsole.log('Release Tag:', JSON.stringify(selectPipelineJobs({ action: 'tag', tagName: 'v2.1.0' })));",
        "output": "PR Event: [\"lint\",\"unit_tests\",\"security_scan\"]\nMain Push: [\"lint\",\"unit_tests\",\"build_docker_image\",\"deploy_staging\"]\nRelease Tag: [\"verify_artifacts\",\"deploy_production\",\"generate_changelog\"]",
        "codeNotes": [
          {
            "line": 8,
            "note": "Executes lightweight validation for fast Pull Request feedback without building heavy images."
          },
          {
            "line": 14,
            "note": "Reserves production deployment actions exclusively for verified SemVer release tags."
          }
        ],
        "tryIt": "Add a trigger rule for hotfix/ branches that runs unit tests and staging deployments directly.",
        "check": {
          "question": "Why do modern DevOps teams prefer Trunk-Based Development over long-lived feature branches?",
          "options": [
            "Because Git cannot support more than two branches",
            "Because merging small, frequent commits prevents massive merge conflicts and painful integration delays",
            "Because it eliminates the need for unit testing"
          ],
          "answer": 1,
          "why": "Trunk-Based Development minimizes integration drift by keeping branches short-lived and merging small changes frequently."
        }
      },
      {
        "title": "Failure Budgets, DORA Metrics & MTTR",
        "say": [
          "High-performing DevOps teams do not aim for 100% perfection or zero failures, because zero failure means zero innovation and never taking risks.",
          "Instead, Site Reliability Engineering (SRE) and DevOps introduced the concept of Error Budgets.",
          "An Error Budget is the allowable room for failure that still meets your customer Service Level Objective (SLO).",
          "If your service promises 99.9% uptime per month, your error budget is 0.1%, or approximately 43 minutes of downtime per month.",
          "As long as your team stays within this error budget, you can deploy experimental features aggressively.",
          "If outages burn through the budget, feature releases freeze and the team focuses 100% on reliability engineering.",
          "The DevOps Research and Assessment (DORA) team established four critical metrics to measure software delivery performance.",
          "These four metrics are Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Mean Time to Recovery (MTTR).",
          "Elite performers deploy on-demand multiple times per day with lead times under an hour.",
          "When incidents inevitably occur, elite teams restore service in minutes through automated rollbacks and canary deployments."
        ],
        "example": "Like a car race pit crew that accepts minor tire wear during aggressive laps as long as the car finishes within the target time and can change tires in under three seconds.",
        "code": "interface DoraReport {\n  deploymentFrequencyPerDay: number;\n  leadTimeHours: number;\n  changeFailurePercent: number;\n  mttrMinutes: number;\n}\n\nfunction evaluateDoraTier(dora: DoraReport): string {\n  if (dora.deploymentFrequencyPerDay >= 3 && dora.leadTimeHours <= 2 && dora.mttrMinutes <= 30) {\n    return 'ELITE_PERFORMER';\n  }\n  if (dora.deploymentFrequencyPerDay >= 1 && dora.leadTimeHours <= 24 && dora.mttrMinutes <= 120) {\n    return 'HIGH_PERFORMER';\n  }\n  return 'MEDIUM_OR_LOW_PERFORMER';\n}\n\nconst currentMetrics: DoraReport = {\n  deploymentFrequencyPerDay: 5,\n  leadTimeHours: 1.2,\n  changeFailurePercent: 4.5,\n  mttrMinutes: 18\n};\n\nconsole.log('DORA Assessment:', evaluateDoraTier(currentMetrics));\nconsole.log('Metrics Summary:', JSON.stringify(currentMetrics));",
        "output": "DORA Assessment: ELITE_PERFORMER\nMetrics Summary: {\"deploymentFrequencyPerDay\":5,\"leadTimeHours\":1.2,\"changeFailurePercent\":4.5,\"mttrMinutes\":18}",
        "codeNotes": [
          {
            "line": 8,
            "note": "Assesses whether release frequency, lead time, and recovery velocity achieve Elite DORA classification."
          },
          {
            "line": 20,
            "note": "Outputs the benchmark results proving rapid recovery from production incidents."
          }
        ],
        "tryIt": "Change mttrMinutes to 90 and observe the performance classification adjust from ELITE to HIGH.",
        "check": {
          "question": "What does Mean Time to Recovery (MTTR) measure in DevOps performance?",
          "options": [
            "How long it takes to write code for a feature",
            "The average time required to restore service after an outage occurs",
            "The duration of the sprint planning meeting"
          ],
          "answer": 1,
          "why": "MTTR measures the average time taken to detect, diagnose, and recover from a production system failure."
        }
      }
    ],
    "summary": [
      "DevOps unites developers and operators under the CALMS framework: Culture, Automation, Lean, Measurement, and Sharing.",
      "12-Factor App Factor III requires storing all configuration in environment variables, decoupling code from target environments.",
      "Factor IX demands disposability: fast startup times and graceful SIGTERM connection draining to protect user requests.",
      "Continuous Integration catches bugs on pull requests, while Continuous Delivery builds deployable artifacts ready for production.",
      "Elite teams track DORA metrics (Deployment Frequency, Lead Time, Change Failure Rate, MTTR) and manage error budgets rather than striving for unrealistic 100% uptime."
    ],
    "projectStep": {
      "title": "DevOps Platform Setup: Environment Config & Pipeline Blueprint",
      "steps": [
        "Audit your microservice code to ensure zero database passwords or API keys are committed to Git.",
        "Define a dynamic configuration module that reads variables from process.env with fallback dev defaults.",
        "Implement a SIGTERM signal listener in your server entry point that drains in-flight requests gracefully.",
        "Document the four DORA metrics and establish baseline alerting thresholds for your release pipeline."
      ]
    }
  },
  {
    "day": 2,
    "title": "Linux Administration, POSIX Signals & Process Daemons",
    "goal": "Master Linux container init processes, understand POSIX signals and exit codes, and manage process lifecycles under systemd or container runtimes.",
    "minutes": 25,
    "recap": "Yesterday we covered the CALMS framework and 12-Factor disposability. Today we explore the Linux operating system primitives that power every modern container runtime.",
    "parts": [
      {
        "title": "The PID 1 Problem in Linux Containers",
        "say": [
          "In a standard Linux operating system, the kernel boots and launches the very first userspace process with Process ID 1, traditionally systemd or init.",
          "PID 1 bears two critical system-level responsibilities: reaping orphaned zombie processes and forwarding signals to child processes.",
          "When a parent process forks a child and then terminates before the child does, the child becomes an orphan.",
          "The Linux kernel automatically re-parents orphaned processes to PID 1, which must periodically invoke wait() or waitpid() to clear their entry from the process table.",
          "If PID 1 fails to reap terminated children, zombie processes accumulate until the kernel runs out of available process IDs, freezing the machine.",
          "In Docker containers, the command specified in your ENTRYPOINT becomes PID 1 inside that container namespace.",
          "If you use a simple Node.js or Python script as your container ENTRYPOINT, it may not know how to reap adopted child processes.",
          "Furthermore, Linux treats PID 1 specially: by default, the kernel ignores signals sent to PID 1 unless the process has explicitly installed a signal handler.",
          "This is why running dumb wrappers without an init system like dumb-init or tini can cause containers to freeze and ignore docker stop commands.",
          "Understanding the PID 1 responsibilities is vital to building rock-solid containerized services."
        ],
        "example": "Like an appointed guardian in a school dormitory: if parents leave early, the guardian takes responsibility for the children and signs them out properly when they depart.",
        "code": "interface ProcessNode {\n  pid: number;\n  ppid: number;\n  command: string;\n  isZombie: boolean;\n}\n\nfunction reapZombies(processes: ProcessNode[]): { active: ProcessNode[]; reapedPids: number[] } {\n  const reaped: number[] = [];\n  const active: ProcessNode[] = [];\n\n  for (const proc of processes) {\n    if (proc.isZombie && proc.ppid === 1) {\n      reaped.push(proc.pid);\n    } else {\n      active.push(proc);\n    }\n  }\n\n  return { active, reapedPids: reaped };\n}\n\nconst processTable: ProcessNode[] = [\n  { pid: 1, ppid: 0, command: 'tini -- node server.js', isZombie: false },\n  { pid: 42, ppid: 1, command: 'node server.js', isZombie: false },\n  { pid: 88, ppid: 1, command: 'sh -c \"git rev-parse\"', isZombie: true },\n  { pid: 89, ppid: 1, command: 'curl -s http://internal', isZombie: true },\n];\n\nconst result = reapZombies(processTable);\nconsole.log('Reaped Zombie PIDs:', result.reapedPids.join(', '));\nconsole.log('Remaining Processes:', result.active.map(p => `PID ${p.pid} (${p.command})`).join(' | '));",
        "output": "Reaped Zombie PIDs: 88, 89\nRemaining Processes: PID 1 (tini -- node server.js) | PID 42 (node server.js)",
        "codeNotes": [
          {
            "line": 8,
            "note": "Filters zombie processes adopted by PID 1 and removes them from the process table."
          },
          {
            "line": 27,
            "note": "Simulates the init reaper freeing kernel process descriptor slots."
          }
        ],
        "tryIt": "Add a non-zombie process to processTable and confirm it remains in the active list.",
        "check": {
          "question": "Why can container processes without an init manager like tini freeze during docker stop?",
          "options": [
            "Because Docker deletes the root directory",
            "Because the Linux kernel does not apply default signal handling to PID 1 unless explicitly registered",
            "Because Node.js cannot run on Linux"
          ],
          "answer": 1,
          "why": "PID 1 receives special treatment from the Linux kernel: default signal handlers are disabled, so unhandled SIGTERM signals are ignored."
        }
      },
      {
        "title": "POSIX Signals: SIGTERM, SIGKILL & SIGHUP",
        "say": [
          "POSIX signals are asynchronous notifications sent by the operating system kernel to a process to inform it of an event.",
          "Every signal has an integer number and a standard symbolic name defined in signal.h.",
          "Signal 15 is SIGTERM, the standard polite request for termination.",
          "When Docker runs `docker stop <container>`, it sends SIGTERM and waits for a grace period (default 10 seconds).",
          "If your process catches SIGTERM, it has that 10-second window to finish active work, close files, and exit cleanly.",
          "Signal 9 is SIGKILL, the uncatchable, unignorable hammer of the operating system.",
          "Processes cannot trap, handle, or ignore SIGKILL; the kernel immediately destroys the process memory space.",
          "If a container does not exit after the 10-second SIGTERM timeout, Docker sends SIGKILL to forcefully murder the process.",
          "Signal 1 is SIGHUP (Hangup), historically sent when a serial terminal disconnected.",
          "In modern daemons like Nginx or PostgreSQL, SIGHUP is conventionally used to trigger a configuration reload without restarting the process."
        ],
        "example": "Like closing a bank branch: SIGTERM is turning the front door sign to Closed and finishing customers in line, while SIGKILL is turning off the master circuit breaker immediately.",
        "code": "type SignalAction = 'GRACEFUL_DRAIN' | 'FORCE_TERMINATE' | 'RELOAD_CONFIG' | 'IGNORE';\n\ninterface SignalSpec {\n  signum: number;\n  name: string;\n  catchable: boolean;\n  action: SignalAction;\n}\n\nconst signalTable: Record<string, SignalSpec> = {\n  SIGTERM: { signum: 15, name: 'SIGTERM', catchable: true, action: 'GRACEFUL_DRAIN' },\n  SIGKILL: { signum: 9, name: 'SIGKILL', catchable: false, action: 'FORCE_TERMINATE' },\n  SIGHUP:  { signum: 1, name: 'SIGHUP',  catchable: true, action: 'RELOAD_CONFIG' },\n  SIGINT:  { signum: 2, name: 'SIGINT',  catchable: true, action: 'GRACEFUL_DRAIN' },\n};\n\nfunction dispatchSignal(sig: string): string {\n  const spec = signalTable[sig];\n  if (!spec) return 'UNKNOWN_SIGNAL';\n  if (!spec.catchable) {\n    return `[${spec.name} (${spec.signum})] Uncatchable! Kernel terminates process immediately.`;\n  }\n  return `[${spec.name} (${spec.signum})] Trap caught. Initiating action: ${spec.action}`;\n}\n\nconsole.log(dispatchSignal('SIGTERM'));\nconsole.log(dispatchSignal('SIGHUP'));\nconsole.log(dispatchSignal('SIGKILL'));",
        "output": "[SIGTERM (15)] Trap caught. Initiating action: GRACEFUL_DRAIN\n[SIGHUP (1)] Trap caught. Initiating action: RELOAD_CONFIG\n[SIGKILL (9)] Uncatchable! Kernel terminates process immediately.",
        "codeNotes": [
          {
            "line": 9,
            "note": "Maps standard POSIX signal numbers (15, 9, 1, 2) to their catchability and intended operational responses."
          },
          {
            "line": 20,
            "note": "Highlights that SIGKILL cannot be intercepted by any application handler."
          }
        ],
        "tryIt": "Add SIGUSR1 (signum 10) for rotating log files without process restart.",
        "check": {
          "question": "Can an application intercept and handle a SIGKILL signal?",
          "options": [
            "Yes, by using process.on(\"SIGKILL\")",
            "No, SIGKILL cannot be caught or blocked by any process in Linux",
            "Only if running as root"
          ],
          "answer": 1,
          "why": "SIGKILL (signal 9) is handled directly by the Linux kernel; user processes are not permitted to catch or block it."
        }
      },
      {
        "title": "Standard Streams & Output Redirection",
        "say": [
          "In UNIX and Linux environments, every newly created process is automatically initialized with three open file descriptors.",
          "File descriptor 0 is standard input (stdin), which reads data from the keyboard or an upstream pipe.",
          "File descriptor 1 is standard output (stdout), which streams normal informational and business application logs.",
          "File descriptor 2 is standard error (stderr), reserved for diagnostic errors, warnings, and unhandled exceptions.",
          "In containerized environments, the 12-Factor App Factor XI stipulates that applications should never manage their own log files on disk.",
          "Instead, applications must write their event stream unbuffered to stdout and stderr.",
          "The container engine (Docker or containerd) captures these two streams and forwards them to a configured logging driver, such as JSON file, Fluentbit, or AWS CloudWatch.",
          "Developers use shell redirection operators like `>` to redirect stdout, `2>` to redirect stderr, and `2>&1` to merge stderr into stdout.",
          "Separating stdout and stderr enables monitoring systems to alert on errors without parsing application payloads.",
          "Let us observe how log severity maps to standard file descriptors in a structured logging pipeline."
        ],
        "example": "Like a hospital with two notification lights: a green light on stdout for routine nurse status updates, and a red strobe on stderr for patient emergencies.",
        "code": "interface LogRecord {\n  level: 'info' | 'warn' | 'error';\n  message: string;\n}\n\nfunction routeStream(record: LogRecord): { fd: number; stream: 'stdout' | 'stderr'; formatted: string } {\n  const isErr = record.level === 'error';\n  const fd = isErr ? 2 : 1;\n  const stream = isErr ? 'stderr' : 'stdout';\n  const formatted = `[${record.level.toUpperCase()}] fd=${fd} -> ${record.message}`;\n  return { fd, stream, formatted };\n}\n\nconst logs: LogRecord[] = [\n  { level: 'info', message: 'Server listening on port 8080' },\n  { level: 'warn', message: 'Database connection pool usage above 80%' },\n  { level: 'error', message: 'Connection to redis failed: ETIMEDOUT' }\n];\n\nfor (const entry of logs) {\n  const routed = routeStream(entry);\n  console.log(routed.formatted);\n}",
        "output": "[INFO] fd=1 -> Server listening on port 8080\n[WARN] fd=1 -> Database connection pool usage above 80%\n[ERROR] fd=2 -> Connection to redis failed: ETIMEDOUT",
        "codeNotes": [
          {
            "line": 7,
            "note": "Maps errors strictly to file descriptor 2 (stderr) while routing info and warn to file descriptor 1 (stdout)."
          },
          {
            "line": 20,
            "note": "Emits structured output consistent with container logging collectors."
          }
        ],
        "tryIt": "Route warn logs to stderr as well and observe how the file descriptor changes.",
        "check": {
          "question": "What is the numeric file descriptor for standard error (stderr) in Linux?",
          "options": [
            "0",
            "1",
            "2"
          ],
          "answer": 2,
          "why": "In Linux, file descriptor 0 is stdin, 1 is stdout, and 2 is stderr."
        }
      },
      {
        "title": "Linux Permissions, UIDs & The Principle of Least Privilege",
        "say": [
          "Linux enforces security through user accounts, group memberships, and permission bitmasks on files and processes.",
          "User ID 0 is the root superuser, which possesses omnipotent privileges over the host kernel, storage devices, and networking stacks.",
          "In containers, if your application runs as root inside the container, any container escape vulnerability can give the attacker root access to the physical host node.",
          "The Principle of Least Privilege mandates that processes must run with the minimum capabilities and permissions necessary to execute their function.",
          "Modern containers define a dedicated unprivileged user, such as `appuser` with UID 10001, and drop all superuser capabilities.",
          "File permissions in Linux are represented by 3 octal digits: User, Group, and Others.",
          "Read is 4, Write is 2, and Execute is 1.",
          "A permission mode of 644 gives the file owner read and write (4+2=6), while group and others receive read-only (4).",
          "A directory permission of 755 gives the owner full access (4+2+1=7), while group and others can read and enter the directory (4+1=5).",
          "Let us inspect an audit function that verifies file permissions and non-root execution."
        ],
        "example": "Like giving a hotel guest an electronic keycard that only opens room 402, rather than handing every visitor the master passkey to the entire building.",
        "code": "interface FileSecurityCheck {\n  path: string;\n  octalMode: string;\n  ownerUid: number;\n}\n\nfunction auditFileSecurity(file: FileSecurityCheck): { isSecure: boolean; flags: string[] } {\n  const flags: string[] = [];\n  if (file.ownerUid === 0) {\n    flags.push('INSECURE_ROOT_OWNERSHIP');\n  }\n  const otherPerm = parseInt(file.octalMode[2], 10);\n  if ((otherPerm & 2) !== 0) {\n    flags.push('WORLD_WRITABLE_SECURITY_RISK');\n  }\n  return {\n    isSecure: flags.length === 0,\n    flags\n  };\n}\n\nconsole.log('App Config (644, UID 10001):', JSON.stringify(auditFileSecurity({ path: '/etc/app.json', octalMode: '644', ownerUid: 10001 })));\nconsole.log('Root Script (777, UID 0):', JSON.stringify(auditFileSecurity({ path: '/app/run.sh', octalMode: '777', ownerUid: 0 })));",
        "output": "App Config (644, UID 10001): {\"isSecure\":true,\"flags\":[]}\nRoot Script (777, UID 0): {\"isSecure\":false,\"flags\":[\"INSECURE_ROOT_OWNERSHIP\",\"WORLD_WRITABLE_SECURITY_RISK\"]}",
        "codeNotes": [
          {
            "line": 8,
            "note": "Flags files owned by UID 0 (root) in container runtime contexts."
          },
          {
            "line": 11,
            "note": "Performs bitwise inspection to verify that external users cannot write to application binaries."
          }
        ],
        "tryIt": "Test an octal mode of 755 owned by UID 10001 and confirm it passes without security flags.",
        "check": {
          "question": "What numerical user ID (UID) represents the Linux root superuser?",
          "options": [
            "0",
            "1",
            "1000"
          ],
          "answer": 0,
          "why": "UID 0 is permanently assigned to the root superuser in all Linux operating systems."
        }
      },
      {
        "title": "Daemon Supervision & Systemd Unit Declarations",
        "say": [
          "A daemon is a background process that runs unattended, providing system or application services to clients.",
          "In traditional Linux virtual machines and bare-metal servers, daemons are managed by systemd, the standard system and service manager.",
          "Systemd uses declarative unit configuration files, commonly with a `.service` extension.",
          "A service unit file defines three main sections: `[Unit]`, `[Service]`, and `[Install]`.",
          "The `[Unit]` section specifies metadata and dependency ordering, such as `After=network.target`.",
          "The `[Service]` section specifies the exact binary path with `ExecStart`, the execution user, environment files, and restart policies.",
          "Directives like `Restart=on-failure` instruct systemd to automatically resurrect the service if it crashes with an unexpected exit code.",
          "The `RestartSec=5s` directive adds a 5-second backoff between restart attempts to prevent runaway CPU loops.",
          "Finally, `[Install]` defines target runlevels, such as `WantedBy=multi-user.target`, so the service boots automatically upon system startup.",
          "Let us inspect a systemd unit generator that validates service configuration parameters."
        ],
        "example": "Like an automated building thermostat that continuously monitors room temperature and restarts the heating unit whenever it detects a furnace flameout.",
        "code": "interface SystemdServiceConfig {\n  name: string;\n  execStart: string;\n  user: string;\n  restartPolicy: 'always' | 'on-failure' | 'no';\n  restartSec: number;\n}\n\nfunction generateSystemdUnit(cfg: SystemdServiceConfig): string {\n  return `[Unit]\nDescription=${cfg.name} Service\nAfter=network.target\n\n[Service]\nType=simple\nUser=${cfg.user}\nExecStart=${cfg.execStart}\nRestart=${cfg.restartPolicy}\nRestartSec=${cfg.restartSec}s\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target`;\n}\n\nconst unit = generateSystemdUnit({\n  name: 'PaymentApi',\n  execStart: '/usr/bin/node /opt/api/server.js',\n  user: 'appuser',\n  restartPolicy: 'on-failure',\n  restartSec: 5\n});\n\nconsole.log(unit);",
        "output": "[Unit]\nDescription=PaymentApi Service\nAfter=network.target\n\n[Service]\nType=simple\nUser=appuser\nExecStart=/usr/bin/node /opt/api/server.js\nRestart=on-failure\nRestartSec=5s\nEnvironment=NODE_ENV=production\n\n[Install]\nWantedBy=multi-user.target",
        "codeNotes": [
          {
            "line": 9,
            "note": "Constructs the standard systemd Unit, Service, and Install sections with production defaults."
          },
          {
            "line": 16,
            "note": "Configures non-root user execution and automated crash recovery with backoff."
          }
        ],
        "tryIt": "Change the restartPolicy to always and inspect the generated systemd configuration.",
        "check": {
          "question": "What directive in a systemd unit file configures automatic resurrection when a process crashes?",
          "options": [
            "Restart=on-failure",
            "Type=simple",
            "Description=Service"
          ],
          "answer": 0,
          "why": "The Restart=on-failure directive instructs systemd to restart the process whenever its exit status code is non-zero."
        }
      },
      {
        "title": "Linux Process Exit Codes & Diagnostic Triage",
        "say": [
          "When any Linux process terminates, it returns an unsigned 8-bit integer exit code to the operating system kernel, ranging from 0 to 255.",
          "Exit code 0 indicates success: the process finished its execution normally without encountering an unhandled error.",
          "Any non-zero exit code (1 through 255) indicates a failure condition.",
          "Exit code 1 represents a general catch-all error, such as a syntax failure or caught exception.",
          "Exit code 2 denotes improper shell built-in usage or missing command line arguments.",
          "Exit codes from 128 upwards carry special diagnostic significance: they indicate that the process was terminated by an unhandled POSIX signal.",
          "The fatal signal formula is: Exit Code = 128 + Signal Number.",
          "For example, when Docker or Kubernetes kills a container due to an Out of Memory (OOM) event, it issues SIGKILL (signal 9).",
          "128 + 9 = 137. Therefore, whenever you see container exit code 137, you instantly know the container was killed by SIGKILL, almost always an OOM kill.",
          "Similarly, exit code 143 corresponds to 128 + 15 (SIGTERM), proving that the container was stopped gracefully during a deployment."
        ],
        "example": "Like medical diagnostic triage codes: code 0 is a clean bill of health, code 137 is an emergency room cardiac arrest, and code 143 is an orderly scheduled discharge.",
        "code": "interface ExitDiagnosis {\n  exitCode: number;\n  meaning: string;\n  category: 'SUCCESS' | 'APPLICATION_ERROR' | 'FATAL_SIGNAL';\n  actionRequired: string;\n}\n\nfunction diagnoseExitCode(code: number): ExitDiagnosis {\n  if (code === 0) {\n    return { exitCode: code, meaning: 'SUCCESS', category: 'SUCCESS', actionRequired: 'None' };\n  }\n  if (code === 137) {\n    return {\n      exitCode: code,\n      meaning: 'KILLED_BY_SIGKILL (128 + 9)',\n      category: 'FATAL_SIGNAL',\n      actionRequired: 'Inspect container memory limits (Likely OOMKilled)'\n    };\n  }\n  if (code === 143) {\n    return {\n      exitCode: code,\n      meaning: 'TERMINATED_BY_SIGTERM (128 + 15)',\n      category: 'FATAL_SIGNAL',\n      actionRequired: 'Normal termination during container scale-down or rollout'\n    };\n  }\n  return {\n    exitCode: code,\n    meaning: 'GENERAL_APPLICATION_ERROR',\n    category: 'APPLICATION_ERROR',\n    actionRequired: 'Inspect application stack trace and stderr logs'\n  };\n}\n\nconsole.log('Exit 0:', JSON.stringify(diagnoseExitCode(0)));\nconsole.log('Exit 137:', JSON.stringify(diagnoseExitCode(137)));\nconsole.log('Exit 143:', JSON.stringify(diagnoseExitCode(143)));",
        "output": "Exit 0: {\"exitCode\":0,\"meaning\":\"SUCCESS\",\"category\":\"SUCCESS\",\"actionRequired\":\"None\"}\nExit 137: {\"exitCode\":137,\"meaning\":\"KILLED_BY_SIGKILL (128 + 9)\",\"category\":\"FATAL_SIGNAL\",\"actionRequired\":\"Inspect container memory limits (Likely OOMKilled)\"}\nExit 143: {\"exitCode\":143,\"meaning\":\"TERMINATED_BY_SIGTERM (128 + 15)\",\"category\":\"FATAL_SIGNAL\",\"actionRequired\":\"Normal termination during container scale-down or rollout\"}",
        "codeNotes": [
          {
            "line": 8,
            "note": "Maps exit codes 0, 137, and 143 to their root operational causes."
          },
          {
            "line": 15,
            "note": "Diagnoses exit code 137 as signal 9 (SIGKILL), the telltale signature of an Out of Memory termination."
          }
        ],
        "tryIt": "Add exit code 130 (128 + 2 SIGINT) to diagnose user Ctrl+C cancellations.",
        "check": {
          "question": "What does container exit code 137 typically indicate in Docker or Kubernetes?",
          "options": [
            "Normal clean completion",
            "The container was terminated by SIGKILL (128 + 9), usually caused by an Out of Memory (OOM) kill",
            "Database connection refused"
          ],
          "answer": 1,
          "why": "Exit code 137 equals 128 + 9 (SIGKILL); the operating system kernel forcefully killed the container, typically because memory exceeded limits."
        }
      }
    ],
    "summary": [
      "In containers, PID 1 is responsible for reaping orphaned child processes and forwarding OS signals; tools like tini prevent zombie leaks.",
      "POSIX signals control process lifecycles: SIGTERM (15) requests graceful shutdown, while SIGKILL (9) is an uncatchable forced termination.",
      "Standard streams separate data and logs: stdin (0), stdout (1), and stderr (2); containers capture stdout and stderr for centralized aggregation.",
      "Security mandates running container processes under unprivileged user IDs (UID > 10000) and avoiding world-writable permissions.",
      "Process exit codes diagnose termination causes: 0 is success, 137 is SIGKILL (OOMKilled), and 143 is graceful SIGTERM shutdown."
    ],
    "projectStep": {
      "title": "Container Process Hardening: Init Wrapper & Signal Traps",
      "steps": [
        "Inspect your Dockerfile ENTRYPOINT to ensure dumb-init or tini is used for PID 1 zombie reaping.",
        "Register signal handlers for SIGTERM and SIGINT in your service code to catch termination notifications.",
        "Route all informational events to stdout and all uncaught exceptions to stderr.",
        "Verify your container exits with code 143 on graceful stop and document the remediation for exit code 137."
      ]
    }
  },
  {
    "day": 3,
    "title": "Docker Architecture, Copy-on-Write & Image Layer Caching",
    "goal": "Understand Linux container virtualization primitives (namespaces, cgroups, OverlayFS) and master Docker image layer caching for blazing-fast builds.",
    "minutes": 25,
    "recap": "Yesterday we mastered Linux signals, PID 1, and process streams. Today we explore how the Linux kernel turns these primitives into isolated Docker containers.",
    "parts": [
      {
        "title": "Virtual Machines vs Containers",
        "say": [
          "To understand Docker, we must first compare containerization with traditional hardware virtualization.",
          "In a Virtual Machine (VM) architecture, a hypervisor like VMware or KVM virtualizes physical hardware: CPU, RAM, disk, and network interfaces.",
          "Each virtual machine boots a complete, independent guest operating system with its own kernel, device drivers, and system daemons.",
          "Because a VM boots an entire operating system, it takes minutes to start and requires gigabytes of memory just to idle.",
          "Containers, by contrast, are not virtual machines: they do not run a hypervisor and they do not boot a guest kernel.",
          "Instead, every container running on a host shares the exact same host Linux kernel.",
          "A container is simply a standard Linux process running with kernel-enforced isolation boundaries around it.",
          "Because there is no guest kernel to boot, containers launch in milliseconds and consume virtually zero overhead beyond the application process itself.",
          "This enables a single physical server to run hundreds of isolated containers where only a dozen VMs could fit.",
          "Let us calculate the density and boot latency differences between VMs and containers."
        ],
        "example": "Like an apartment building versus separate standalone houses: VMs are separate houses with their own plumbing and foundation, while containers are apartments sharing the building foundation and utilities.",
        "code": "interface HostDensityMetric {\n  architecture: 'VirtualMachines' | 'Containers';\n  hostRamMb: number;\n  osOverheadPerInstanceMb: number;\n  appMemoryMb: number;\n  bootTimeSeconds: number;\n}\n\nfunction calculateMaxInstances(metric: HostDensityMetric): { maxInstances: number; totalBootTimeSec: number } {\n  const memPerInstance = metric.osOverheadPerInstanceMb + metric.appMemoryMb;\n  const maxInstances = Math.floor(metric.hostRamMb / memPerInstance);\n  return {\n    maxInstances,\n    totalBootTimeSec: metric.bootTimeSeconds\n  };\n}\n\nconst vmSpecs: HostDensityMetric = {\n  architecture: 'VirtualMachines',\n  hostRamMb: 32768,\n  osOverheadPerInstanceMb: 2048,\n  appMemoryMb: 512,\n  bootTimeSeconds: 45\n};\n\nconst containerSpecs: HostDensityMetric = {\n  architecture: 'Containers',\n  hostRamMb: 32768,\n  osOverheadPerInstanceMb: 20,\n  appMemoryMb: 512,\n  bootTimeSeconds: 0.2\n};\n\nconsole.log('VM Capacity:', JSON.stringify(calculateMaxInstances(vmSpecs)));\nconsole.log('Container Capacity:', JSON.stringify(calculateMaxInstances(containerSpecs)));",
        "output": "VM Capacity: {\"maxInstances\":12,\"totalBootTimeSec\":45}\nContainer Capacity: {\"maxInstances\":61,\"totalBootTimeSec\":0.2}",
        "codeNotes": [
          {
            "line": 10,
            "note": "Calculates memory density: VMs waste 2GB per guest OS, while containers share the host kernel."
          },
          {
            "line": 30,
            "note": "Shows that container density is over 5x higher with sub-second startup times."
          }
        ],
        "tryIt": "Increase appMemoryMb to 1024 and observe how instance capacity scales across both architectures.",
        "check": {
          "question": "What is the fundamental architectural difference between Virtual Machines and Docker containers?",
          "options": [
            "Containers run on Windows while VMs run on Linux",
            "Containers share the host Linux kernel, whereas VMs run a complete guest OS on top of a hypervisor",
            "VMs do not use RAM"
          ],
          "answer": 1,
          "why": "Containers are isolated processes sharing the host Linux kernel; VMs run an entire guest operating system via hypervisor virtualization."
        }
      },
      {
        "title": "Linux Namespaces: Virtualizing What a Process Can See",
        "say": [
          "If containers are just normal Linux processes, how are they isolated from one another?",
          "The answer lies in two Linux kernel primitives: Namespaces and Cgroups.",
          "Namespaces provide the illusion of dedicated resources by partitioning what a process can see.",
          "The PID namespace provides an independent process tree: inside the container, your app is PID 1, while on the host it might be PID 34521.",
          "The NET namespace provides isolated network interfaces, IP addresses, routing tables, and port numbers.",
          "This is why two different containers can both bind to port 80 on the same machine without port collision conflicts.",
          "The MNT (Mount) namespace provides an isolated filesystem view, preventing a container from accessing host files.",
          "The IPC namespace isolates inter-process communication resources like shared memory segments and message queues.",
          "The UTS namespace isolates hostname and domain names, allowing each container to have its own unique hostname.",
          "Finally, the USER namespace isolates user and group IDs, allowing root (UID 0) inside a container to map to an unprivileged UID on the host."
        ],
        "example": "Like wearing virtual reality headsets in an office: everyone is sitting in the same physical room, but each person sees a completely different office environment.",
        "code": "interface LinuxNamespace {\n  type: string;\n  isolates: string;\n  benefit: string;\n}\n\nconst namespaces: LinuxNamespace[] = [\n  { type: 'PID', isolates: 'Process hierarchy and IDs', benefit: 'App runs as PID 1 inside container' },\n  { type: 'NET', isolates: 'Network interfaces and IP routing', benefit: 'Multiple containers can bind port 8080' },\n  { type: 'MNT', isolates: 'Filesystem mount points', benefit: 'Container cannot see host root filesystem' },\n  { type: 'IPC', isolates: 'Shared memory & semaphores', benefit: 'Processes cannot snoop on memory segments' },\n  { type: 'UTS', isolates: 'Hostnames and domain names', benefit: 'Each container has a unique network name' },\n  { type: 'USER', isolates: 'User IDs and Group IDs', benefit: 'Container root maps to unprivileged host UID' },\n];\n\nfor (const ns of namespaces) {\n  console.log(`[${ns.type} Namespace] Isolates ${ns.isolates} (${ns.benefit})`);\n}",
        "output": "[PID Namespace] Isolates Process hierarchy and IDs (App runs as PID 1 inside container)\n[NET Namespace] Isolates Network interfaces and IP routing (Multiple containers can bind port 8080)\n[MNT Namespace] Isolates Filesystem mount points (Container cannot see host root filesystem)\n[IPC Namespace] Isolates Shared memory & semaphores (Processes cannot snoop on memory segments)\n[UTS Namespace] Isolates Hostnames and domain names (Each container has a unique network name)\n[USER Namespace] Isolates User IDs and Group IDs (Container root maps to unprivileged host UID)",
        "codeNotes": [
          {
            "line": 7,
            "note": "Catalogs the 6 core Linux namespaces that establish container isolation boundaries."
          },
          {
            "line": 17,
            "note": "Prints the operational benefit of each namespace in cloud microservice hosting."
          }
        ],
        "tryIt": "Add the Cgroup namespace (CGROUP) introduced in Linux 4.6 to isolate cgroup root directory views.",
        "check": {
          "question": "Which Linux namespace allows multiple containers on the same host to bind to port 80 simultaneously?",
          "options": [
            "PID namespace",
            "NET namespace",
            "UTS namespace"
          ],
          "answer": 1,
          "why": "The NET namespace gives each container its own independent virtual network stack, loopback device, and port space."
        }
      },
      {
        "title": "Linux Control Groups (Cgroups): Limiting Resource Usage",
        "say": [
          "While Namespaces dictate what a process can see, Control Groups (Cgroups) dictate how much a process can use.",
          "Without Cgroups, a single runaway process or memory leak in one container could consume all host RAM and freeze the entire server.",
          "Cgroups allow the kernel to meter, limit, and prioritize hardware resource allocation across process groups.",
          "The memory cgroup sets hard memory limits, such as `--memory 512m`.",
          "If a container attempts to allocate memory exceeding this limit, the Linux kernel Out of Memory (OOM) killer terminates the process.",
          "The cpu cgroup allocates processor time using the Completely Fair Scheduler (CFS) quota mechanism.",
          "Setting `--cpus 1.5` configures a CFS quota of 150,000 microseconds per 100,000 microsecond period.",
          "Cgroups also govern block I/O bandwidth (`--device-read-bps`) and maximum process thread counts (`--pids-limit`).",
          "Cgroups v2, standardized in modern Linux distributions, unifies resource controllers under a single hierarchical tree.",
          "Let us write a calculation function that validates cgroup CPU quota and memory headroom."
        ],
        "example": "Like an electric circuit breaker panel in a home: it does not care what appliances you plug in, but if any room draws more than 15 amperes, the breaker trips to protect the house.",
        "code": "interface CgroupLimits {\n  memoryLimitMb: number;\n  currentMemoryUsageMb: number;\n  cpuQuotaCores: number;\n  periodMicroseconds: number;\n}\n\nfunction evaluateCgroupHealth(limits: CgroupLimits): { oomRisk: boolean; cfsQuotaMicroseconds: number; headroomMb: number } {\n  const headroomMb = limits.memoryLimitMb - limits.currentMemoryUsageMb;\n  const oomRisk = headroomMb < (limits.memoryLimitMb * 0.1); // Under 10% headroom\n  const cfsQuotaMicroseconds = Math.round(limits.cpuQuotaCores * limits.periodMicroseconds);\n\n  return {\n    oomRisk,\n    cfsQuotaMicroseconds,\n    headroomMb\n  };\n}\n\nconst safeContainer: CgroupLimits = {\n  memoryLimitMb: 512,\n  currentMemoryUsageMb: 256,\n  cpuQuotaCores: 2.0,\n  periodMicroseconds: 100000\n};\n\nconsole.log('Safe Container:', JSON.stringify(evaluateCgroupHealth(safeContainer)));\n\nconst leakingContainer: CgroupLimits = {\n  memoryLimitMb: 512,\n  currentMemoryUsageMb: 495,\n  cpuQuotaCores: 1.0,\n  periodMicroseconds: 100000\n};\n\nconsole.log('Leaking Container:', JSON.stringify(evaluateCgroupHealth(leakingContainer)));",
        "output": "Safe Container: {\"oomRisk\":false,\"cfsQuotaMicroseconds\":200000,\"headroomMb\":256}\nLeaking Container: {\"oomRisk\":true,\"cfsQuotaMicroseconds\":100000,\"headroomMb\":17}",
        "codeNotes": [
          {
            "line": 9,
            "note": "Detects imminent OOM danger when available memory drops below 10% of cgroup limits."
          },
          {
            "line": 10,
            "note": "Calculates the exact Linux Completely Fair Scheduler (CFS) quota in microseconds."
          }
        ],
        "tryIt": "Adjust cpuQuotaCores to 0.5 to simulate running on half a CPU core.",
        "check": {
          "question": "What is the role of Linux Control Groups (Cgroups) in container virtualization?",
          "options": [
            "They assign IP addresses to containers",
            "They meter and enforce hardware resource limits on CPU, memory, and I/O",
            "They compile source code into binaries"
          ],
          "answer": 1,
          "why": "Cgroups allow the kernel to enforce resource boundaries, preventing containers from monopolizing CPU or memory."
        }
      },
      {
        "title": "Union Filesystems & Copy-on-Write (Overlay2)",
        "say": [
          "Docker container images can be hundreds of megabytes in size. If starting 10 containers required copying 10 full filesystems, disk space would vanish.",
          "Docker solves this storage challenge using Union Filesystems, specifically the Overlay2 storage driver.",
          "An image consists of an immutable stack of read-only layers representing steps in your Dockerfile.",
          "In Overlay2 terminology, these read-only image layers are known as the `lowerdir`.",
          "When you launch a container, Docker mounts an ultra-thin, ephemeral read-write layer directly on top of the stack, known as the `upperdir`.",
          "The union mount merges lowerdir and upperdir into a unified view (`merged`) presented to the container process.",
          "When the container reads a file that has not been modified, it reads directly from the underlying read-only image layer.",
          "When the container writes to or modifies an existing file, Overlay2 uses the Copy-on-Write (CoW) strategy.",
          "The kernel copies the file from the read-only lower layer up to the writeable upper layer, and the modification takes place there.",
          "The original underlying image layer remains completely unchanged, shared safely by hundreds of running containers."
        ],
        "example": "Like drawing on a sheet of clear plastic placed over a reference map: you can mark new routes on the clear sheet without writing on the original map underneath.",
        "code": "interface FileSystemLayer {\n  layerName: string;\n  isReadOnly: boolean;\n  files: Record<string, string>;\n}\n\nfunction resolveMergedView(lowerLayers: FileSystemLayer[], upperLayer: FileSystemLayer): Record<string, string> {\n  const merged: Record<string, string> = {};\n\n  // First apply read-only lower layers from base up\n  for (const layer of lowerLayers) {\n    for (const [path, content] of Object.entries(layer.files)) {\n      merged[path] = content;\n    }\n  }\n\n  // Then apply writeable upper layer (Copy-on-Write overrides)\n  for (const [path, content] of Object.entries(upperLayer.files)) {\n    merged[path] = content;\n  }\n\n  return merged;\n}\n\nconst baseLayer: FileSystemLayer = {\n  layerName: 'alpine_base',\n  isReadOnly: true,\n  files: { '/etc/os-release': 'NAME=Alpine', '/bin/sh': 'BINARY_DATA' }\n};\n\nconst appLayer: FileSystemLayer = {\n  layerName: 'app_code',\n  isReadOnly: true,\n  files: { '/app/server.js': 'console.log(\"running\")', '/app/config.json': '{\"port\":80}' }\n};\n\nconst containerRw: FileSystemLayer = {\n  layerName: 'container_rw_upperdir',\n  isReadOnly: false,\n  files: { '/app/config.json': '{\"port\":8080,\"mode\":\"MUTATED\"}' }\n};\n\nconst mergedFs = resolveMergedView([baseLayer, appLayer], containerRw);\nconsole.log('Merged Config:', mergedFs['/app/config.json']);\nconsole.log('Base OS File:', mergedFs['/etc/os-release']);",
        "output": "Merged Config: {\"port\":8080,\"mode\":\"MUTATED\"}\nBase OS File: NAME=Alpine",
        "codeNotes": [
          {
            "line": 10,
            "note": "Merges immutable lower layers to establish baseline filesystem content."
          },
          {
            "line": 17,
            "note": "Applies writeable upperdir entries, demonstrating how Copy-on-Write shadows underlying files."
          }
        ],
        "tryIt": "Add a new file /tmp/cache.log to containerRw and verify it appears in the merged filesystem view.",
        "check": {
          "question": "What happens when a running container modifies a file present in an underlying image layer?",
          "options": [
            "The underlying image is permanently altered on disk",
            "The kernel copies the file to the writeable upperdir and modifies it there (Copy-on-Write)",
            "The container crashes with an access error"
          ],
          "answer": 1,
          "why": "OverlayFS uses Copy-on-Write: it copies the file to the container writeable layer, keeping the underlying image layers immutable."
        }
      },
      {
        "title": "Docker Image Layer Caching Mechanics",
        "say": [
          "Every command in a Dockerfile—such as FROM, RUN, COPY, and ADD—creates a distinct, content-addressable layer in the image.",
          "When Docker builds an image, it evaluates whether each layer can be reused from the local build cache.",
          "For commands like RUN npm install, Docker checks if the command string matches a previous build.",
          "For commands like COPY or ADD, Docker calculates a cryptographic checksum of the contents of the files being copied.",
          "If the file contents and command string match an existing cache entry, Docker outputs `CACHED` and skips that step in zero seconds.",
          "Crucially, Docker layer caching is strictly sequential and cascading.",
          "The moment a single layer experiences a cache miss, that layer and all subsequent downstream layers must be recomputed from scratch.",
          "Even if downstream code has not changed at all, invalidating an upstream layer forces Docker to re-run every subsequent instruction.",
          "Understanding this cascading invalidation rule is the single most important skill in optimizing container build pipelines.",
          "Let us trace how a cache invalidator cascades through an instruction sequence."
        ],
        "example": "Like building a house of blocks: if you replace a red block near the foundation, you have to rebuild every block stacked above it.",
        "code": "interface BuildStep {\n  instruction: string;\n  hasChanged: boolean;\n}\n\nfunction simulateDockerBuildCache(steps: BuildStep[]): string[] {\n  const results: string[] = [];\n  let cacheValid = true;\n\n  for (const step of steps) {\n    if (cacheValid && !step.hasChanged) {\n      results.push(`CACHED: ${step.instruction}`);\n    } else {\n      cacheValid = false;\n      results.push(`RUNNING (Cache Miss): ${step.instruction}`);\n    }\n  }\n\n  return results;\n}\n\nconst buildSteps: BuildStep[] = [\n  { instruction: 'FROM node:20-alpine', hasChanged: false },\n  { instruction: 'WORKDIR /app', hasChanged: false },\n  { instruction: 'COPY package*.json ./', hasChanged: false },\n  { instruction: 'RUN npm ci', hasChanged: false },\n  { instruction: 'COPY . . (Source code changed)', hasChanged: true },\n  { instruction: 'RUN npm run build', hasChanged: false },\n];\n\nconst buildLog = simulateDockerBuildCache(buildSteps);\nbuildLog.forEach(log => console.log(log));",
        "output": "CACHED: FROM node:20-alpine\nCACHED: WORKDIR /app\nCACHED: COPY package*.json ./\nCACHED: RUN npm ci\nRUNNING (Cache Miss): COPY . . (Source code changed)\nRUNNING (Cache Miss): RUN npm run build",
        "codeNotes": [
          {
            "line": 9,
            "note": "Reuses cache until the first file change occurs, then marks all subsequent steps as cache misses."
          },
          {
            "line": 30,
            "note": "Shows that RUN npm ci was cached because dependency files were copied before source code."
          }
        ],
        "tryIt": "Set hasChanged to true on package*.json and observe that RUN npm ci is re-executed.",
        "check": {
          "question": "What happens to downstream Dockerfile instructions when an upstream layer experiences a cache miss?",
          "options": [
            "Docker continues caching unaffected instructions",
            "All downstream instructions are invalidated and must re-run",
            "The build fails with an error"
          ],
          "answer": 1,
          "why": "Docker layer caching is sequential; invalidating any layer breaks the cache for all subsequent downstream instructions."
        }
      },
      {
        "title": "Optimizing Dockerfile Instruction Ordering",
        "say": [
          "Now that we understand cascading layer invalidation, we can design Dockerfiles that build in seconds instead of minutes.",
          "Consider the common anti-pattern: `COPY . .` followed by `RUN npm ci`.",
          "Every time you change a single line in a frontend component, `COPY . .` changes its checksum and invalidates the layer cache.",
          "As a result, Docker is forced to re-run `RUN npm ci` from scratch, downloading hundreds of megabytes of npm packages on every build.",
          "To optimize build speed, structure your Dockerfile from least frequently changing instructions to most frequently changing.",
          "First, set the base image and work directory.",
          "Second, copy strictly the dependency manifests: `package.json` and `package-lock.json`.",
          "Third, run your dependency installation: `RUN npm ci`. Because dependencies change rarely, this heavy layer stays cached 99% of the time.",
          "Fourth, copy your actual application source code: `COPY . .`.",
          "Finally, run your compilation command and define your entrypoint command.",
          "Let us run an auditor function that detects this ordering anti-pattern."
        ],
        "example": "Like setting up a kitchen: you install the stove and refrigerators once, stock the pantry once a week, and only prepare fresh ingredients for each dinner.",
        "code": "interface DockerfileAudit {\n  lines: string[];\n}\n\nfunction auditDockerfileStructure(df: DockerfileAudit): { isOptimal: boolean; recommendation: string } {\n  const lines = df.lines.map(l => l.trim());\n  const copyAllIdx = lines.findIndex(l => l.startsWith('COPY . .'));\n  const npmInstallIdx = lines.findIndex(l => l.includes('npm install') || l.includes('npm ci'));\n  const copyPkgIdx = lines.findIndex(l => l.includes('package.json') || l.includes('package*.json'));\n\n  if (copyAllIdx !== -1 && npmInstallIdx !== -1 && copyAllIdx < npmInstallIdx) {\n    return {\n      isOptimal: false,\n      recommendation: 'ANTI-PATTERN: COPY . . occurs before dependency install! Move COPY package*.json ./ before npm ci.'\n    };\n  }\n\n  if (copyPkgIdx !== -1 && npmInstallIdx !== -1 && copyPkgIdx < npmInstallIdx) {\n    return {\n      isOptimal: true,\n      recommendation: 'OPTIMAL: Dependencies are isolated and cached prior to copying volatile source code.'\n    };\n  }\n\n  return { isOptimal: false, recommendation: 'UNRESOLVED: Missing dependency caching strategy.' };\n}\n\nconst badDockerfile = {\n  lines: ['FROM node:20', 'WORKDIR /app', 'COPY . .', 'RUN npm ci', 'CMD [\"node\", \"index.js\"]']\n};\nconsole.log('Unoptimized Build:', JSON.stringify(auditDockerfileStructure(badDockerfile)));\n\nconst goodDockerfile = {\n  lines: ['FROM node:20', 'WORKDIR /app', 'COPY package*.json ./', 'RUN npm ci', 'COPY . .', 'CMD [\"node\", \"index.js\"]']\n};\nconsole.log('Optimized Build:', JSON.stringify(auditDockerfileStructure(goodDockerfile)));",
        "output": "Unoptimized Build: {\"isOptimal\":false,\"recommendation\":\"ANTI-PATTERN: COPY . . occurs before dependency install! Move COPY package*.json ./ before npm ci.\"}\nOptimized Build: {\"isOptimal\":true,\"recommendation\":\"OPTIMAL: Dependencies are isolated and cached prior to copying volatile source code.\"}",
        "codeNotes": [
          {
            "line": 9,
            "note": "Detects if blanket source code copies invalidate dependency download caching."
          },
          {
            "line": 30,
            "note": "Confirms that separating dependency manifests preserves layer cache hits across code revisions."
          }
        ],
        "tryIt": "Test a Python Dockerfile copying requirements.txt before pip install and verify it evaluates as optimal.",
        "check": {
          "question": "Why should COPY package*.json precede RUN npm ci in a Node.js Dockerfile?",
          "options": [
            "Because Node.js cannot run without package.json",
            "To ensure npm dependencies stay cached when only application source code is edited",
            "To reduce network bandwidth on the host machine"
          ],
          "answer": 1,
          "why": "Isolating package.json keeps the heavy npm install layer cached whenever only application source code is modified."
        }
      }
    ],
    "summary": [
      "Containers share the host Linux kernel without a hypervisor, delivering 5x greater compute density and sub-second boot times.",
      "Namespaces isolate what a process can see: PID (processes), NET (networking/ports), MNT (filesystems), and UTS (hostnames).",
      "Control Groups (Cgroups) meter and enforce resource consumption limits on CPU cores, memory limits, and I/O bandwidth.",
      "Overlay2 uses Copy-on-Write: immutable image layers (lowerdir) remain untouched while changes are written to an ephemeral upperdir.",
      "Docker layer caching is sequential and cascading: always copy dependency manifests and install packages before copying volatile source code."
    ],
    "projectStep": {
      "title": "Container Architecture: Optimizing Image Build Layers",
      "steps": [
        "Inspect your existing Dockerfile to verify that dependency installation precedes application code copy steps.",
        "Add a .dockerignore file to exclude node_modules, .git, and local environment files from the build context.",
        "Run docker build with --progress=plain and verify that the package install layer shows CACHED on subsequent builds.",
        "Configure cgroup memory and CPU limits on your test container to safeguard host resources."
      ]
    }
  },
  {
    "day": 4,
    "title": "Docker Multi-Stage Builds & Minimal Production Images",
    "goal": "Eliminate build toolchains from production containers using multi-stage builds, choose secure minimal base images, and enforce non-root execution.",
    "minutes": 25,
    "recap": "Yesterday we mastered container kernel primitives and layer caching. Today we learn how to shrink container images from 1.2 gigabytes to 40 megabytes while eliminating security vulnerabilities.",
    "parts": [
      {
        "title": "The Problem of Bloated Production Images",
        "say": [
          "When teams first containerize applications, they frequently use standard full-featured images like `node:20` or `golang:1.22`.",
          "These heavyweight images contain complete operating system distributions, C/C++ compilers, package managers, curl, and python.",
          "A simple TypeScript backend packaged this way often exceeds 1.2 to 1.5 gigabytes in image size.",
          "Bloated images impose massive performance penalties: they take minutes to push to container registries and minutes to pull onto Kubernetes worker nodes.",
          "During autoscaling events, a 2-minute image pull delay can cause customer request queues to overflow and servers to crash.",
          "Even worse than slow transfers is the security threat: every unnecessary utility left in a container is a weapon for an attacker.",
          "If an attacker exploits a remote code execution vulnerability, having `curl`, `gcc`, and a bash shell inside the container allows them to compile malware and pivot into your private network.",
          "In production, your container does not need a compiler, a package manager, or documentation files.",
          "It only needs the final compiled JavaScript artifacts and the Node.js runtime.",
          "Let us calculate the storage and bandwidth overhead across bloated versus lean container images."
        ],
        "example": "Like an athlete running a marathon: carrying a heavy backpack full of wrenches, hammers, and textbooks will slow you down and exhaust your energy.",
        "code": "interface ContainerImageProfile {\n  name: string;\n  sizeMb: number;\n  cveCount: number;\n  pullTimeSecOn1Gbps: number;\n}\n\nfunction analyzeImageOverhead(images: ContainerImageProfile[]): void {\n  for (const img of images) {\n    const isLean = img.sizeMb <= 150 && img.cveCount === 0;\n    const rating = isLean ? 'PRODUCTION_GRADE' : 'BLOATED_RISK';\n    console.log(`[${img.name}] Size: ${img.sizeMb}MB | CVEs: ${img.cveCount} | Pull: ${img.pullTimeSecOn1Gbps}s -> ${rating}`);\n  }\n}\n\nconst profiles: ContainerImageProfile[] = [\n  { name: 'Monolithic Node (node:20)', sizeMb: 1250, cveCount: 48, pullTimeSecOn1Gbps: 10.0 },\n  { name: 'Debian Slim (node:20-slim)', sizeMb: 240, cveCount: 12, pullTimeSecOn1Gbps: 1.9 },\n  { name: 'Multi-Stage Alpine (node:20-alpine)', sizeMb: 52, cveCount: 0, pullTimeSecOn1Gbps: 0.4 },\n];\n\nanalyzeImageOverhead(profiles);",
        "output": "[Monolithic Node (node:20)] Size: 1250MB | CVEs: 48 | Pull: 10s -> BLOATED_RISK\n[Debian Slim (node:20-slim)] Size: 240MB | CVEs: 12 | Pull: 1.9s -> BLOATED_RISK\n[Multi-Stage Alpine (node:20-alpine)] Size: 52MB | CVEs: 0 | Pull: 0.4s -> PRODUCTION_GRADE",
        "codeNotes": [
          {
            "line": 8,
            "note": "Evaluates production readiness based on size footprint and known Common Vulnerabilities and Exposures (CVEs)."
          },
          {
            "line": 20,
            "note": "Highlights that multi-stage builds reduce image size by over 95% while eliminating CVE vulnerabilities."
          }
        ],
        "tryIt": "Add an entry for Google Distroless with 38MB and 0 CVEs.",
        "check": {
          "question": "Why are large build toolchains like gcc and curl considered security hazards in production containers?",
          "options": [
            "Because they make the terminal font smaller",
            "They provide attackers with the tools needed to download and compile malicious exploits inside your container",
            "Because Linux does not permit compilers in containers"
          ],
          "answer": 1,
          "why": "Unnecessary binaries like curl and gcc expand the attack surface, allowing attackers to download and compile payloads if an exploit occurs."
        }
      },
      {
        "title": "Multi-Stage Build Syntax (FROM ... AS builder)",
        "say": [
          "Before Docker 17.05, teams had to maintain two separate Dockerfiles: one to compile code and a shell script to extract binaries into a second image.",
          "Multi-stage builds revolutionized container packaging by allowing multiple `FROM` instructions in a single Dockerfile.",
          "Each `FROM` instruction begins a new build stage with its own independent base image.",
          "You can name a stage by appending `AS <stage_name>`, for example: `FROM node:20-alpine AS builder`.",
          "In the builder stage, you install all devDependencies, TypeScript compilers, test runners, and build tools.",
          "Once the application is compiled into pure JavaScript inside `/app/dist`, you declare a brand new, minimal production stage: `FROM node:20-alpine AS runner`.",
          "The magic happens with the `--from` flag: `COPY --from=builder /app/dist ./dist`.",
          "This copies only the compiled output and runtime artifacts from the builder stage into the final image.",
          "Everything else from the builder stage—including the TypeScript compiler, devDependencies, and build caches—is completely discarded.",
          "The resulting final image contains strictly the minimal runtime artifacts."
        ],
        "example": "Like an orange juice bottling factory: the heavy squeezing machinery and discarded orange peels stay in the processing plant, while only the pure bottled juice is loaded onto the delivery truck.",
        "code": "interface DockerStage {\n  stageName: string;\n  baseImage: string;\n  retainedInFinalImage: boolean;\n  artifactsProduced: string[];\n}\n\nfunction summarizeMultiStageBuild(stages: DockerStage[]): string[] {\n  const log: string[] = [];\n  for (const stage of stages) {\n    if (stage.retainedInFinalImage) {\n      log.push(`[STAGE: ${stage.stageName}] Base: ${stage.baseImage} -> SHIPPED TO PRODUCTION (Artifacts: ${stage.artifactsProduced.join(', ')})`);\n    } else {\n      log.push(`[STAGE: ${stage.stageName}] Base: ${stage.baseImage} -> DISCARDED AFTER BUILD (Purged: ${stage.artifactsProduced.join(', ')})`);\n    }\n  }\n  return log;\n}\n\nconst buildPlan: DockerStage[] = [\n  { stageName: 'deps', baseImage: 'node:20-alpine', retainedInFinalImage: false, artifactsProduced: ['node_modules (dev + prod)'] },\n  { stageName: 'builder', baseImage: 'node:20-alpine', retainedInFinalImage: false, artifactsProduced: ['tsc', 'dist/bundle.js', 'test-reports'] },\n  { stageName: 'runner', baseImage: 'node:20-alpine', retainedInFinalImage: true, artifactsProduced: ['dist/bundle.js', 'production node_modules'] },\n];\n\nconst summary = summarizeMultiStageBuild(buildPlan);\nsummary.forEach(line => console.log(line));",
        "output": "[STAGE: deps] Base: node:20-alpine -> DISCARDED AFTER BUILD (Purged: node_modules (dev + prod))\n[STAGE: builder] Base: node:20-alpine -> DISCARDED AFTER BUILD (Purged: tsc, dist/bundle.js, test-reports)\n[STAGE: runner] Base: node:20-alpine -> SHIPPED TO PRODUCTION (Artifacts: dist/bundle.js, production node_modules)",
        "codeNotes": [
          {
            "line": 8,
            "note": "Distinguishes between discarded intermediary build stages and the final runtime production layer."
          },
          {
            "line": 20,
            "note": "Proves that heavy compilers and test reports never reach the production container registry."
          }
        ],
        "tryIt": "Add a linter stage to buildPlan and observe it get marked as discarded after build.",
        "check": {
          "question": "What Dockerfile instruction copies compiled files from a previous build stage into the final image?",
          "options": [
            "COPY --from=builder /app/dist ./dist",
            "RUN import builder",
            "ADD --previous-stage"
          ],
          "answer": 0,
          "why": "The COPY instruction with the --from=<stage_name> flag copies artifacts across build stage boundaries."
        }
      },
      {
        "title": "Base Image Selection: Debian vs Alpine vs Distroless",
        "say": [
          "Selecting the right base image for your final production stage is a critical architectural decision.",
          "There are three primary options in the modern container ecosystem: Debian Slim, Alpine Linux, and Google Distroless.",
          "Debian Slim (`node:20-slim`) uses the standard GNU C library (glibc). It is highly compatible with native C++ node addons, but weighs around 180MB.",
          "Alpine Linux (`node:20-alpine`) is an ultra-lightweight security-oriented Linux distribution built on the musl libc and BusyBox.",
          "Alpine images are tiny—often under 45MB—and feature minimal pre-installed packages.",
          "However, because Alpine uses musl libc instead of glibc, some native npm modules (like sharp or canvas) require pre-compiled musl binaries.",
          "Google Distroless (`gcr.io/distroless/nodejs20`) takes minimalism to its ultimate logical conclusion.",
          "Distroless contains only your application and its runtime dependencies.",
          "It contains no package manager (no apt, no apk) and no interactive shell (no bash, no /bin/sh).",
          "If an attacker finds a remote code vulnerability in a Distroless container, they cannot even spawn a shell, rendering most exploit payloads useless."
        ],
        "example": "Like traveling carry-on only: Debian Slim is a full suitcase, Alpine is a minimalist backpack, and Distroless is just passport, phone, and wallet in your pockets.",
        "code": "interface BaseImageSpec {\n  name: string;\n  cLibrary: 'glibc' | 'musl' | 'minimal-glibc';\n  hasShell: boolean;\n  hasPackageManager: boolean;\n  typicalSizeMb: number;\n}\n\nconst baseImages: BaseImageSpec[] = [\n  { name: 'Debian Slim (node:20-slim)', cLibrary: 'glibc', hasShell: true, hasPackageManager: true, typicalSizeMb: 180 },\n  { name: 'Alpine Linux (node:20-alpine)', cLibrary: 'musl', hasShell: true, hasPackageManager: true, typicalSizeMb: 45 },\n  { name: 'Google Distroless (distroless/nodejs20)', cLibrary: 'minimal-glibc', hasShell: false, hasPackageManager: false, typicalSizeMb: 35 },\n];\n\nfor (const img of baseImages) {\n  const securityProfile = !img.hasShell && !img.hasPackageManager ? 'MAXIMUM_HARDENED' : 'STANDARD_ISOLATION';\n  console.log(`[${img.name}] Lib: ${img.cLibrary} | Shell: ${img.hasShell} | PkgMgr: ${img.hasPackageManager} -> ${securityProfile}`);\n}",
        "output": "[Debian Slim (node:20-slim)] Lib: glibc | Shell: true | PkgMgr: true -> STANDARD_ISOLATION\n[Alpine Linux (node:20-alpine)] Lib: musl | Shell: true | PkgMgr: true -> STANDARD_ISOLATION\n[Google Distroless (distroless/nodejs20)] Lib: minimal-glibc | Shell: false | PkgMgr: false -> MAXIMUM_HARDENED",
        "codeNotes": [
          {
            "line": 9,
            "note": "Compares the C runtime libraries and binary capabilities across standard container base images."
          },
          {
            "line": 16,
            "note": "Highlights that Distroless achieves maximum hardening by removing both shells and package managers."
          }
        ],
        "tryIt": "Check what happens if you try to run docker exec -it container sh on a Distroless container (it fails because /bin/sh does not exist).",
        "check": {
          "question": "What makes Google Distroless container images exceptionally secure for production deployments?",
          "options": [
            "They encrypt all files with AES-256",
            "They omit all package managers and interactive shells (no /bin/sh)",
            "They can only run on Google Cloud"
          ],
          "answer": 1,
          "why": "Distroless images contain no shell or package manager, preventing attackers from spawning interactive shells or installing exploits."
        }
      },
      {
        "title": "Pruning DevDependencies in Production Containers",
        "say": [
          "In modern JavaScript and TypeScript development, `devDependencies` represent the vast majority of your `node_modules` folder.",
          "Packages like TypeScript, ESLint, Jest, Vitest, Webpack, and Prettier are essential for development, but 100% useless in production.",
          "A typical `node_modules` directory with devDependencies often consumes 600MB to 1GB of disk space.",
          "If you copy this full directory into your final container, you ship hundreds of megabytes of dead weight.",
          "In a multi-stage build, you must separate dependency installation into two distinct operations.",
          "In the build stage, you run `npm ci` to install all dependencies and compile your TypeScript code into `dist/`.",
          "Before packaging the final stage, you run `npm ci --omit=dev` (or `npm prune --production`).",
          "This strips all build tools, linters, and test runners, leaving only the lean runtime dependencies.",
          "Only this pruned production directory is copied into the final runtime stage.",
          "Let us write a calculation showing the dramatic reduction achieved by pruning devDependencies."
        ],
        "example": "Like removing the scaffolding from a newly constructed skyscraper before the tenants move in: the scaffolding was necessary to build the walls, but has no place in the finished lobby.",
        "code": "interface PackageManifest {\n  dependencies: Record<string, string>;\n  devDependencies: Record<string, string>;\n}\n\nfunction calculateDependencyPayload(manifest: PackageManifest, avgDepSizeMb = 3.5): { devCount: number; prodCount: number; savedMb: number } {\n  const devCount = Object.keys(manifest.devDependencies).length;\n  const prodCount = Object.keys(manifest.dependencies).length;\n  const savedMb = devCount * avgDepSizeMb;\n\n  return {\n    devCount,\n    prodCount,\n    savedMb: Math.round(savedMb)\n  };\n}\n\nconst appManifest: PackageManifest = {\n  dependencies: { express: '^4.19.2', pg: '^8.11.5', zod: '^3.23.8', pino: '^9.1.0' },\n  devDependencies: { typescript: '^5.4.5', '@types/node': '^20.12.7', eslint: '^9.1.1', vitest: '^1.5.0', prettier: '^3.2.5' }\n};\n\nconst result = calculateDependencyPayload(appManifest);\nconsole.log('Production Deps:', result.prodCount);\nconsole.log('Dev Deps Pruned:', result.devCount);\nconsole.log('Disk Space Saved:', result.savedMb, 'MB');",
        "output": "Production Deps: 4\nDev Deps Pruned: 5\nDisk Space Saved: 18 MB",
        "codeNotes": [
          {
            "line": 6,
            "note": "Calculates the payload overhead contributed by devDependencies that should be pruned."
          },
          {
            "line": 20,
            "note": "Demonstrates substantial disk and network savings by discarding devDependencies."
          }
        ],
        "tryIt": "Add 10 more devDependencies like @types packages and observe the disk savings scale up.",
        "check": {
          "question": "What npm command installs strictly production dependencies while excluding development tools?",
          "options": [
            "npm install --all",
            "npm ci --omit=dev",
            "npm build --fast"
          ],
          "answer": 1,
          "why": "The --omit=dev flag (or npm prune --production) ensures that only runtime dependencies are installed, excluding heavy compilers and linters."
        }
      },
      {
        "title": "Non-Root Execution (USER 10001)",
        "say": [
          "By default, if you do not specify a user in your Dockerfile, your container executes as `root` (UID 0).",
          "Running as root inside a container violates the fundamental principle of defense-in-depth.",
          "If a remote code execution vulnerability is discovered in your web framework, the attacker has root privileges inside the container.",
          "From there, exploiting a Linux kernel privilege escalation or mounting a host volume could grant full superuser control of the physical server.",
          "To prevent this catastrophic failure mode, production Dockerfiles must explicitly declare an unprivileged non-root user.",
          "Node.js official images provide a pre-created user named `node` with UID 1000.",
          "In enterprise environments, security teams frequently create dedicated system users with high UIDs, such as `appuser` with UID 10001.",
          "Crucially, you must assign ownership of the application directory to this user before switching: `CHOWN -R 10001:10001 /app`.",
          "Finally, invoke the `USER 10001` directive before the CMD or ENTRYPOINT.",
          "Once switched, even if an attacker compromises the application, they cannot install packages, modify system files, or access kernel-level controls."
        ],
        "example": "Like locking down a store after hours: the cleaning crew has a physical key to enter the building and vacuum the floor, but they do not know the combination to the bank vault.",
        "code": "interface DockerfileUserCheck {\n  hasUserInstruction: boolean;\n  userValue: string;\n}\n\nfunction verifyNonRootCompliance(check: DockerfileUserCheck): { compliant: boolean; effectiveUid: string; status: string } {\n  if (!check.hasUserInstruction) {\n    return { compliant: false, effectiveUid: '0 (root)', status: 'FAILED_INSECURE_ROOT_DEFAULT' };\n  }\n  if (check.userValue === 'root' || check.userValue === '0') {\n    return { compliant: false, effectiveUid: '0 (root)', status: 'FAILED_EXPLICIT_ROOT' };\n  }\n  return { compliant: true, effectiveUid: check.userValue, status: 'PASSED_NON_ROOT_ENFORCED' };\n}\n\nconsole.log('Default Build:', JSON.stringify(verifyNonRootCompliance({ hasUserInstruction: false, userValue: '' })));\nconsole.log('Hardened Build:', JSON.stringify(verifyNonRootCompliance({ hasUserInstruction: true, userValue: '10001' })));",
        "output": "Default Build: {\"compliant\":false,\"effectiveUid\":\"0 (root)\",\"status\":\"FAILED_INSECURE_ROOT_DEFAULT\"}\nHardened Build: {\"compliant\":true,\"effectiveUid\":\"10001\",\"status\":\"PASSED_NON_ROOT_ENFORCED\"}",
        "codeNotes": [
          {
            "line": 6,
            "note": "Fails security audit if the Dockerfile does not explicitly specify a USER directive."
          },
          {
            "line": 16,
            "note": "Confirms that specifying UID 10001 guarantees non-root execution in compliance with production policies."
          }
        ],
        "tryIt": "Test userValue: \"node\" and confirm it satisfies the non-root requirement.",
        "check": {
          "question": "Why should every production Dockerfile end with a non-root USER instruction?",
          "options": [
            "To speed up container startup",
            "To prevent attackers from gaining superuser privileges on the host if a container escape occurs",
            "Because Docker cannot run JavaScript as root"
          ],
          "answer": 1,
          "why": "Enforcing non-root user execution limits the damage of potential security breaches by preventing superuser access to the host kernel."
        }
      },
      {
        "title": "Complete Production Dockerfile Blueprint",
        "say": [
          "Let us synthesize all the best practices we have mastered into a production-grade multi-stage Dockerfile.",
          "Stage 1 is `dependencies`: we copy `package*.json` and run `npm ci` to prepare all modules.",
          "Stage 2 is `builder`: we copy source code and compile TypeScript with `RUN npm run build`.",
          "Stage 3 is `pruner`: we run `npm ci --omit=dev` to strip out heavy compilers and testing tools.",
          "Stage 4 is `runner`: based on an ultra-minimal `node:20-alpine` base image.",
          "In this final runner stage, we create an unprivileged user `appuser` with UID 10001 and GID 10001.",
          "We copy strictly `node_modules` from the pruner stage and `/app/dist` from the builder stage.",
          "We set file ownership to `10001:10001` and switch to `USER 10001`.",
          "Finally, we expose our application port and launch our server with `CMD [\"node\", \"dist/server.js\"]`.",
          "The result is a production container under 50MB with zero devDependencies and zero root privileges."
        ],
        "example": "Like assembling a Formula 1 racing car: every single carbon fiber component is precision-engineered, leaving all bulky manufacturing molds behind in the factory.",
        "code": "const productionDockerfileTemplate = `# Stage 1: Build & Compile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production Dependencies Pruner\nFROM node:20-alpine AS pruner\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\n\n# Stage 3: Minimal Secure Production Runner\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nRUN addgroup -g 10001 -S appgroup && adduser -u 10001 -S appuser -G appgroup\nCOPY --from=pruner --chown=10001:10001 /app/node_modules ./node_modules\nCOPY --from=builder --chown=10001:10001 /app/dist ./dist\nUSER 10001\nEXPOSE 8080\nCMD [\"node\", \"dist/server.js\"]`;\n\nconsole.log('Production Multi-Stage Dockerfile Blueprint:');\nconsole.log(productionDockerfileTemplate);",
        "output": "Production Multi-Stage Dockerfile Blueprint:\n# Stage 1: Build & Compile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production Dependencies Pruner\nFROM node:20-alpine AS pruner\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\n\n# Stage 3: Minimal Secure Production Runner\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nRUN addgroup -g 10001 -S appgroup && adduser -u 10001 -S appuser -G appgroup\nCOPY --from=pruner --chown=10001:10001 /app/node_modules ./node_modules\nCOPY --from=builder --chown=10001:10001 /app/dist ./dist\nUSER 10001\nEXPOSE 8080\nCMD [\"node\", \"dist/server.js\"]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Defines Stage 1 builder to compile TypeScript with full dev tooling."
          },
          {
            "line": 11,
            "note": "Defines Stage 2 pruner to isolate strictly runtime dependencies."
          },
          {
            "line": 16,
            "note": "Defines Stage 3 runner with non-root user creation, minimal copying, and secure execution."
          }
        ],
        "tryIt": "Verify that the runner stage sets NODE_ENV=production to enable framework performance optimizations.",
        "check": {
          "question": "What is the primary benefit of copying artifacts across multiple Docker stages with COPY --from?",
          "options": [
            "It bypasses the need for a Docker daemon",
            "It produces lightweight production containers by excluding compilers and build tools",
            "It allows running Python inside Node.js"
          ],
          "answer": 1,
          "why": "Multi-stage builds exclude heavy build toolchains and devDependencies from the final shipped image, keeping it lean and secure."
        }
      }
    ],
    "summary": [
      "Monolithic production images with build toolchains and package managers expand attack surfaces and slow autoscaling deployments.",
      "Multi-stage builds (FROM ... AS builder) compile artifacts in an isolated stage and copy only finished deliverables to the final image.",
      "Minimal base images like Alpine Linux and Google Distroless reduce image footprints by over 90% and eliminate shell binaries.",
      "Pruning devDependencies via npm ci --omit=dev strips hundreds of megabytes of test runners, linters, and compilers.",
      "Non-root user execution (USER 10001) enforces defense-in-depth, preventing host superuser compromise if container vulnerabilities occur."
    ],
    "projectStep": {
      "title": "Multi-Stage Build Pipeline: Production Container Refactor",
      "steps": [
        "Refactor your backend Dockerfile into a 3-stage pipeline (builder, pruner, and runner).",
        "Use node:20-alpine or Google Distroless as your final runtime base image.",
        "Create an unprivileged user (UID 10001) and ensure all copied files are owned by 10001:10001.",
        "Compare the image size before and after multi-stage refactoring to confirm a 90%+ footprint reduction."
      ]
    }
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Multi-Container Microservices Stack with Docker Compose",
    "goal": "Declare, configure, and orchestrate a multi-tier microservice architecture (Frontend, Backend, PostgreSQL, Redis) using Docker Compose with user-defined networks, healthcheck gates, and persistent volumes.",
    "minutes": 25,
    "recap": "Over the first 4 days, we mastered DevOps culture, Linux process administration, container virtualization, and minimal multi-stage image packaging. Today we achieve Milestone 1: orchestrating an entire multi-tier system.",
    "parts": [
      {
        "title": "Docker Compose Architecture & Service Declarations",
        "say": [
          "Up to this point, we have run individual containers using manual `docker run` commands.",
          "In modern cloud backends, an application is rarely a solitary container.",
          "A typical system consists of a web frontend, an API backend, a PostgreSQL relational database, a Redis cache, and background queue workers.",
          "Manually starting five containers with custom flags, port bindings, and environment variables is error-prone and unmaintainable.",
          "Docker Compose provides declarative multi-container orchestration using a simple `compose.yaml` (or `docker-compose.yml`) file.",
          "In Compose, you define your entire system architecture as code: services, networks, volumes, and secrets.",
          "A single command—`docker compose up -d`—reads the manifest, creates networks, mounts storage, builds images, and starts all services in the background.",
          "Similarly, `docker compose down` gracefully shuts down all containers and networks cleanly without leaving orphaned resources.",
          "Compose serves as the definitive local development standard and the foundation for production orchestrators like Kubernetes.",
          "Let us inspect a service manifest parser that models a Compose multi-service architecture."
        ],
        "example": "Like an orchestra conductor reading a musical score: instead of each musician guessing when to play, the sheet music dictates every instrument, tempo, and entrance.",
        "code": "interface ComposeService {\n  name: string;\n  image?: string;\n  buildContext?: string;\n  ports?: string[];\n  environment: Record<string, string>;\n}\n\nfunction inspectComposeStack(services: ComposeService[]): void {\n  console.log(`Orchestrating stack with ${services.length} services:`);\n  for (const s of services) {\n    const source = s.image ? `Image: ${s.image}` : `Build: ${s.buildContext}`;\n    const portMapping = s.ports ? s.ports.join(', ') : 'Internal only';\n    console.log(` - [${s.name.toUpperCase()}] ${source} | Ports: ${portMapping}`);\n  }\n}\n\nconst microserviceStack: ComposeService[] = [\n  { name: 'frontend', buildContext: './frontend', ports: ['3000:3000'], environment: { VITE_API_URL: 'http://localhost:8080' } },\n  { name: 'api-server', buildContext: './backend', ports: ['8080:8080'], environment: { DB_HOST: 'postgres', REDIS_HOST: 'redis' } },\n  { name: 'postgres', image: 'postgres:16-alpine', environment: { POSTGRES_DB: 'app_db', POSTGRES_PASSWORD: 'secretpassword' } },\n  { name: 'redis', image: 'redis:7-alpine', environment: {} },\n];\n\ninspectComposeStack(microserviceStack);",
        "output": "Orchestrating stack with 4 services:\n - [FRONTEND] Build: ./frontend | Ports: 3000:3000\n - [API-SERVER] Build: ./backend | Ports: 8080:8080\n - [POSTGRES] Image: postgres:16-alpine | Ports: Internal only\n - [REDIS] Image: redis:7-alpine | Ports: Internal only",
        "codeNotes": [
          {
            "line": 9,
            "note": "Iterates through declared services to verify build contexts, image tags, and port exposure."
          },
          {
            "line": 20,
            "note": "Demonstrates that databases and caches are kept internal without exposing host ports."
          }
        ],
        "tryIt": "Add an elasticsearch service to microserviceStack and verify it displays in the orchestration summary.",
        "check": {
          "question": "What is the primary role of Docker Compose in modern software engineering?",
          "options": [
            "To compile C++ code into assembly",
            "To declaratively define, configure, and run multi-container applications with a single file",
            "To purchase cloud domains"
          ],
          "answer": 1,
          "why": "Docker Compose allows developers to define multi-container architectures (services, networks, volumes) in a declarative YAML manifest."
        }
      },
      {
        "title": "User-Defined Bridge Networks & Service Discovery",
        "say": [
          "When containers run on the default Docker bridge network, they can only communicate with each other using raw IP addresses.",
          "In dynamic cloud environments, containers are frequently created, destroyed, and reassigned new IP addresses.",
          "Hardcoding IP addresses like `172.17.0.3` is an operational nightmare that breaks on every container restart.",
          "Docker Compose solves this by automatically creating a user-defined bridge network for your project.",
          "On a user-defined bridge network, Docker provides built-in internal DNS service discovery.",
          "Every container can resolve its peers simply by using their Compose service name as the hostname.",
          "For example, your backend API connects to its database using `postgres:5432`, and to its cache using `redis:6379`.",
          "The embedded Docker DNS server at `127.0.0.11` intercepts these queries and dynamically resolves them to the container active IP address.",
          "Furthermore, user-defined networks provide complete network segmentation.",
          "Containers on different networks cannot communicate with each other, preventing compromised frontend services from directly probing backend databases."
        ],
        "example": "Like an internal office phone extension directory: you do not need to memorize your colleague mobile phone number; you just dial extension \"Sales\" or \"Accounting\".",
        "code": "class DockerInternalDns {\n  private routingTable: Map<string, string> = new Map();\n\n  public registerService(serviceName: string, containerIp: string): void {\n    this.routingTable.set(serviceName, containerIp);\n  }\n\n  public resolveHost(hostname: string): string {\n    const ip = this.routingTable.get(hostname);\n    if (!ip) {\n      throw new Error(`DNS resolution failed: NXDOMAIN for host ${hostname}`);\n    }\n    return ip;\n  }\n}\n\nconst dns = new DockerInternalDns();\ndns.registerService('postgres', '172.28.0.2');\ndns.registerService('redis', '172.28.0.3');\ndns.registerService('api-server', '172.28.0.4');\n\nconsole.log('Resolving postgres:', dns.resolveHost('postgres'));\nconsole.log('Resolving redis:', dns.resolveHost('redis'));\nconsole.log('Resolving api-server:', dns.resolveHost('api-server'));",
        "output": "Resolving postgres: 172.28.0.2\nResolving redis: 172.28.0.3\nResolving api-server: 172.28.0.4",
        "codeNotes": [
          {
            "line": 4,
            "note": "Maintains internal DNS mappings linking Compose service names directly to virtual container IP addresses."
          },
          {
            "line": 19,
            "note": "Resolves service hostnames dynamically, allowing backend code to use stable names like postgres and redis."
          }
        ],
        "tryIt": "Register worker-service at 172.28.0.5 and test its resolution.",
        "check": {
          "question": "How do containers on a user-defined Docker Compose network discover each other?",
          "options": [
            "By scanning all ports sequentially",
            "Through embedded Docker DNS resolving container service names as hostnames",
            "By writing IP addresses into a text file"
          ],
          "answer": 1,
          "why": "Docker embeds an internal DNS server that automatically resolves Compose service names (like postgres or redis) to their container IP addresses."
        }
      },
      {
        "title": "Named Volumes vs Bind Mounts for Data Persistence",
        "say": [
          "Containers are ephemeral: when a container is removed with `docker rm`, its writeable upperdir layer is deleted forever.",
          "If your database writes customer records inside a container filesystem, deleting the container destroys all your customer data.",
          "To persist state across container lifecycles, Docker provides two primary storage mechanisms: Named Volumes and Bind Mounts.",
          "Named Volumes are managed exclusively by the Docker daemon inside `/var/lib/docker/volumes/`.",
          "They are high-performance, isolated from host OS permissions, and survive container restarts and image updates.",
          "For databases like PostgreSQL or MySQL, Named Volumes are the mandatory production standard.",
          "Bind Mounts, by contrast, mount an exact directory from the host machine directly into the container, such as `./src:/app/src`.",
          "Bind Mounts are invaluable during local development because code changes on your host laptop are immediately reflected inside the container without rebuilding images.",
          "However, Bind Mounts depend on host file paths and permissions, making them unsuitable for production deployments.",
          "Let us inspect a storage volume configurator that enforces named volumes for databases and bind mounts for dev code."
        ],
        "example": "Like an external hard drive (Named Volume) that stores family photo backups permanently, versus a shared projector screen (Bind Mount) displaying slides from your laptop in real time.",
        "code": "type VolumeType = 'NAMED_VOLUME' | 'BIND_MOUNT' | 'EPHEMERAL';\n\ninterface VolumeMountSpec {\n  service: string;\n  source: string;\n  target: string;\n  isDatabase: boolean;\n  environment: 'development' | 'production';\n}\n\nfunction selectOptimalStorage(spec: VolumeMountSpec): { type: VolumeType; config: string } {\n  if (spec.isDatabase) {\n    return {\n      type: 'NAMED_VOLUME',\n      config: `${spec.source}:${spec.target}:rw (Managed volume isolated from host fs)`\n    };\n  }\n  if (spec.environment === 'development') {\n    return {\n      type: 'BIND_MOUNT',\n      config: `${spec.source}:${spec.target}:cached (Host hot-reload enabled)`\n    };\n  }\n  return {\n    type: 'EPHEMERAL',\n    config: 'Container root filesystem (Stateless execution)'\n  };\n}\n\nconst dbMount = selectOptimalStorage({\n  service: 'postgres',\n  source: 'pgdata',\n  target: '/var/lib/postgresql/data',\n  isDatabase: true,\n  environment: 'production'\n});\nconsole.log('Database Storage:', JSON.stringify(dbMount));\n\nconst devCodeMount = selectOptimalStorage({\n  service: 'api-server',\n  source: './src',\n  target: '/app/src',\n  isDatabase: false,\n  environment: 'development'\n});\nconsole.log('Dev Code Storage:', JSON.stringify(devCodeMount));",
        "output": "Database Storage: {\"type\":\"NAMED_VOLUME\",\"config\":\"pgdata:/var/lib/postgresql/data:rw (Managed volume isolated from host fs)\"}\nDev Code Storage: {\"type\":\"BIND_MOUNT\",\"config\":\"./src:/app/src:cached (Host hot-reload enabled)\"}",
        "codeNotes": [
          {
            "line": 11,
            "note": "Enforces Named Volumes for database storage to guarantee persistence across container recreation."
          },
          {
            "line": 17,
            "note": "Applies Bind Mounts in development environments to support instant hot-reloading of source code."
          }
        ],
        "tryIt": "Check a production web service with isDatabase: false and verify it remains stateless (EPHEMERAL).",
        "check": {
          "question": "Why must relational databases like PostgreSQL use Named Volumes in Docker Compose?",
          "options": [
            "Because databases cannot write to disks",
            "To guarantee that database records persist permanently on disk even when containers are recreated or upgraded",
            "To encrypt SQL queries"
          ],
          "answer": 1,
          "why": "Named Volumes persist data outside the container ephemeral filesystem, preventing data loss when containers are restarted, destroyed, or upgraded."
        }
      },
      {
        "title": "Dependency Ordering & Healthcheck Conditions",
        "say": [
          "A classic mistake in microservice architectures is starting an API server before its underlying database is ready to accept connections.",
          "By default, Docker Compose provides a simple `depends_on: [postgres]` directive.",
          "However, `depends_on` only waits until the PostgreSQL container process is launched; it does NOT wait until PostgreSQL is ready to handle queries.",
          "PostgreSQL typically takes 5 to 10 seconds to initialize write-ahead logs, verify storage, and bind its socket.",
          "If your API server connects during this initialization window, it crashes immediately with `ECONNREFUSED`.",
          "To solve this race condition, modern Compose uses the extended `depends_on` syntax with condition gates.",
          "You define a `healthcheck` on the database service: `test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]`.",
          "Then, in the API server service, you configure: `depends_on: postgres: { condition: service_healthy }`.",
          "Docker Compose will start the database container, monitor its healthcheck until it succeeds, and only then launch the API server.",
          "Let us simulate this healthcheck gating mechanism."
        ],
        "example": "Like waiting for the traffic light to turn green before driving into an intersection, instead of stepping on the accelerator the moment the car engine turns on.",
        "code": "interface ServiceStartupEvent {\n  service: string;\n  containerRunning: boolean;\n  healthcheckPassing: boolean;\n}\n\nfunction evaluateStartupGate(dbState: ServiceStartupEvent): { canStartApi: boolean; reason: string } {\n  if (!dbState.containerRunning) {\n    return { canStartApi: false, reason: 'BLOCKED: Database container is not running yet.' };\n  }\n  if (!dbState.healthcheckPassing) {\n    return { canStartApi: false, reason: 'BLOCKED: Database container running but NOT HEALTHY (pg_isready failed).' };\n  }\n  return { canStartApi: true, reason: 'APPROVED: Database is HEALTHY. Launching API server.' };\n}\n\nconsole.log('Step 1 (Starting):', JSON.stringify(evaluateStartupGate({ service: 'postgres', containerRunning: false, healthcheckPassing: false })));\nconsole.log('Step 2 (Initializing):', JSON.stringify(evaluateStartupGate({ service: 'postgres', containerRunning: true, healthcheckPassing: false })));\nconsole.log('Step 3 (Ready):', JSON.stringify(evaluateStartupGate({ service: 'postgres', containerRunning: true, healthcheckPassing: true })));",
        "output": "Step 1 (Starting): {\"canStartApi\":false,\"reason\":\"BLOCKED: Database container is not running yet.\"}\nStep 2 (Initializing): {\"canStartApi\":false,\"reason\":\"BLOCKED: Database container running but NOT HEALTHY (pg_isready failed).\"}\nStep 3 (Ready): {\"canStartApi\":true,\"reason\":\"APPROVED: Database is HEALTHY. Launching API server.\"}",
        "codeNotes": [
          {
            "line": 7,
            "note": "Prevents dependent service startup while database initialization is in progress."
          },
          {
            "line": 16,
            "note": "Approves API launch strictly when healthchecks verify the database engine is accepting SQL connections."
          }
        ],
        "tryIt": "Simulate an unhealthy database state where healthcheckPassing is false and verify the API server remains gated.",
        "check": {
          "question": "Why is `depends_on: service_healthy` superior to standard `depends_on` in Docker Compose?",
          "options": [
            "It increases CPU clock speeds",
            "It guarantees dependent services launch only after healthcheck probes confirm database readiness",
            "It compiles SQL tables automatically"
          ],
          "answer": 1,
          "why": "The service_healthy condition waits until readiness probes succeed, preventing connection refused crashes during database boot."
        }
      },
      {
        "title": "Multi-Environment Compose Overrides",
        "say": [
          "In professional teams, you do not want to duplicate your entire Compose file for every environment.",
          "Docker Compose provides built-in multi-file layering to merge configurations cleanly.",
          "By default, running `docker compose up` automatically reads `compose.yaml` and, if present, merges `compose.override.yaml` on top of it.",
          "The base `compose.yaml` defines the standard architecture: service names, networks, volume mounts, and dependency healthchecks.",
          "The `compose.override.yaml` (used locally by developers) adds development-specific settings: bind mounts for hot reloading, exposed debug ports, and verbose log levels.",
          "When deploying to staging or testing environments, you specify an explicit environment file: `docker compose -f compose.yaml -f compose.prod.yaml up -d`.",
          "In the production override file, you remove bind mounts, pull immutable image tags from a private container registry, and enforce restart policies like `restart: always`.",
          "This multi-layer strategy maintains a single authoritative source of truth for your architecture while adapting cleanly to each environment.",
          "Let us inspect a configuration merger that layers environment overrides onto a base Compose service."
        ],
        "example": "Like ordering a coffee: the base order is an espresso shot (base compose), and you add oat milk and vanilla syrup in the morning (override) or drink it black on competition days (prod override).",
        "code": "interface ComposeServiceDef {\n  image?: string;\n  build?: string;\n  restart: string;\n  ports: string[];\n  volumes: string[];\n}\n\nfunction mergeComposeOverrides(base: ComposeServiceDef, override: Partial<ComposeServiceDef>): ComposeServiceDef {\n  return {\n    image: override.image ?? base.image,\n    build: override.build ?? base.build,\n    restart: override.restart ?? base.restart,\n    ports: [...new Set([...base.ports, ...(override.ports ?? [])])],\n    volumes: [...new Set([...base.volumes, ...(override.volumes ?? [])])],\n  };\n}\n\nconst baseService: ComposeServiceDef = {\n  build: './backend',\n  restart: 'unless-stopped',\n  ports: ['8080:8080'],\n  volumes: ['app_data:/app/data']\n};\n\nconst devOverride: Partial<ComposeServiceDef> = {\n  ports: ['9229:9229'], // Node debugger port\n  volumes: ['./backend/src:/app/src'] // Hot-reload bind mount\n};\n\nconst mergedDevConfig = mergeComposeOverrides(baseService, devOverride);\nconsole.log('Merged Dev Config:');\nconsole.log('Ports:', mergedDevConfig.ports.join(', '));\nconsole.log('Volumes:', mergedDevConfig.volumes.join(', '));",
        "output": "Merged Dev Config:\nPorts: 8080:8080, 9229:9229\nVolumes: app_data:/app/data, ./backend/src:/app/src",
        "codeNotes": [
          {
            "line": 9,
            "note": "Merges base architecture with environment overrides without modifying the foundational manifest."
          },
          {
            "line": 26,
            "note": "Adds developer debugging ports and source code bind mounts cleanly on top of baseline specs."
          }
        ],
        "tryIt": "Create a prodOverride that sets restart: \"always\" and inspect the resulting merged configuration.",
        "check": {
          "question": "What file does Docker Compose automatically merge on top of compose.yaml by default?",
          "options": [
            "compose.override.yaml",
            "production.json",
            "docker.env"
          ],
          "answer": 0,
          "why": "Docker Compose automatically layers compose.override.yaml over compose.yaml, enabling seamless local development customization."
        }
      },
      {
        "title": "Milestone 1 Synthesis: Production 4-Tier Compose Architecture",
        "say": [
          "Congratulations on reaching Milestone 1! We have united all foundational concepts into an enterprise 4-tier stack.",
          "Our architecture consists of: a React frontend, an Express TypeScript API, a PostgreSQL database, and a Redis cache.",
          "The frontend communicates with the API over the user-defined network `app-network`.",
          "The API accesses PostgreSQL using the internal hostname `postgres` and Redis using `redis`.",
          "PostgreSQL uses a Named Volume `pgdata` to guarantee that user data persists across deployments.",
          "The API service uses `depends_on: postgres: condition: service_healthy` to eliminate startup race conditions.",
          "Only the frontend port (3000) and API gateway port (8080) are exposed to the host.",
          "Database and cache ports are kept strictly internal, shielded from public internet exposure.",
          "With `docker compose up -d`, the entire resilient enterprise stack boots in under 15 seconds.",
          "Let us review the complete production Compose specification."
        ],
        "example": "Like an entire modern enterprise office building: reception is open to the public on the first floor, but the data center vaults and executive boardrooms are secured behind biometric badges on private internal floors.",
        "code": "const DB_PASSWORD = 'supersecret_vault_pass';\nconst completeComposeSpec = `version: '3.8'\n\nnetworks:\n  app-network:\n    driver: bridge\n\nvolumes:\n  pgdata:\n    driver: local\n\nservices:\n  postgres:\n    image: postgres:16-alpine\n    restart: unless-stopped\n    networks:\n      - app-network\n    environment:\n      POSTGRES_DB: career_db\n      POSTGRES_USER: pinit_admin\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U pinit_admin -d career_db\"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n\n  redis:\n    image: redis:7-alpine\n    restart: unless-stopped\n    networks:\n      - app-network\n\n  api:\n    build:\n      context: ./backend\n      dockerfile: Dockerfile\n    restart: unless-stopped\n    networks:\n      - app-network\n    ports:\n      - \"8080:8080\"\n    environment:\n      NODE_ENV: production\n      DATABASE_URL: postgres://pinit_admin:${DB_PASSWORD}@postgres:5432/career_db\n      REDIS_URL: redis://redis:6379\n    depends_on:\n      postgres:\n        condition: service_healthy\n\n  web:\n    build:\n      context: ./frontend\n    restart: unless-stopped\n    networks:\n      - app-network\n    ports:\n      - \"3000:3000\"\n    depends_on:\n      - api`;\n\nconsole.log('Milestone 1 Production Compose Architecture:');\nconsole.log('Services: postgres, redis, api, web (All wired to app-network)');\nconsole.log('Volumes: pgdata (Persistent Local Driver)');",
        "output": "Milestone 1 Production Compose Architecture:\nServices: postgres, redis, api, web (All wired to app-network)\nVolumes: pgdata (Persistent Local Driver)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Defines user-defined bridge network providing internal DNS service discovery."
          },
          {
            "line": 7,
            "note": "Declares named volume pgdata ensuring database state persistence."
          },
          {
            "line": 42,
            "note": "Gates backend API initialization on database healthcheck readiness."
          }
        ],
        "tryIt": "Inspect the environment variable mapping in the api service and verify it adheres to 12-Factor Factor III.",
        "check": {
          "question": "In an enterprise Docker Compose architecture, why should database ports (e.g. 5432) omit the host `ports:` mapping?",
          "options": [
            "Because PostgreSQL cannot bind to ports",
            "To keep the database accessible strictly inside the private internal network, shielding it from external internet attacks",
            "Because Compose only supports one port mapping per file"
          ],
          "answer": 1,
          "why": "Omitting host port mappings keeps the database internal to the Docker network, allowing only authorized backend services to connect."
        }
      }
    ],
    "summary": [
      "Docker Compose provides declarative orchestration for multi-container stacks using clean, version-controlled YAML manifests.",
      "User-defined bridge networks provide internal DNS resolution: containers address each other by service name (e.g. postgres, redis).",
      "Named Volumes (pgdata) decouple persistent database storage from container lifecycles, preventing catastrophic data loss.",
      "Extended depends_on with service_healthy eliminates boot race conditions by waiting for real database readiness probes.",
      "Multi-layer Compose files (compose.override.yaml) enable rapid local hot-reloading while keeping production definitions lean and secure."
    ],
    "projectStep": {
      "title": "Milestone 1 Synthesis: Multi-Service Stack Orchestration",
      "steps": [
        "Author a root compose.yaml declaring your Frontend, API, PostgreSQL, and Redis microservices.",
        "Configure user-defined bridge networking and attach all services to a shared network.",
        "Implement pg_isready healthchecks on the database service and gate API startup with service_healthy.",
        "Execute docker compose up -d and verify that all 4 containers boot into healthy states with docker compose ps."
      ]
    }
  }
];

export const DEVOPS_LONG_LESSONS = DEVOPS_WEB_LONG_LESSONS;
