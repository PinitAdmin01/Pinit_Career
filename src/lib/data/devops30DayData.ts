import { buildEnrichedDayQuests } from './curriculumEnricher';
export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export const DEVOPS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is DevOps? — Linux, the Terminal and Your First Navigation Commands",
    desc: "DevOps combines Development and Operations — it bridges the gap between developers who write code and operations engineers who deploy and maintain it in production. Before DevOps, these were two completely separate teams with opposing goals: developers wanted to release features fast, operations teams wanted stability and resisted changes. This conflict made software releases slow, risky, and painful. DevOps solves this with automated deployment pipelines, standardised environments, and the ability to release code dozens of times per day reliably. To work in DevOps, you MUST know Linux. Here is why: over 90 percent of the world's servers run Linux. Every major cloud provider's virtual machines default to Linux. Docker containers are built on Linux kernel features. Kubernetes runs on Linux nodes. AWS EC2, Google Cloud, Azure VMs — all Linux. Linux is not optional in DevOps. What is Linux? Linux is an open-source operating system kernel created by Linus Torvalds in 1991. Ubuntu, CentOS, Amazon Linux, Debian, and RHEL are all Linux distributions — different flavours of the same Linux kernel. The terminal (also called the command line or shell) is how you interact with Linux servers: instead of clicking icons like Windows or Mac, you type text commands. The most common shell is Bash. When you open a terminal you see a prompt like ubuntu@myserver:~$ which tells you: who you are (ubuntu), which server (myserver), and where you are in the filesystem (~ means home directory). BASIC NAVIGATION COMMANDS: pwd (print working directory) — shows your current location. Type pwd, press Enter, see something like /home/ubuntu. ls (list) — shows files and directories at current location. ls -l shows detailed list with file sizes and permissions. ls -la also shows hidden files (files starting with a dot). cd (change directory) — cd /etc moves you to /etc. cd ~ returns to home. cd .. goes one level up. cd - returns to previous directory. mkdir name — creates a new directory. mkdir myproject creates a folder called myproject. touch filename — creates an empty file. touch script.sh creates an empty script file. cp source destination — copies a file. cp app.log app_backup.log. mv source destination — moves or renames a file. rm filename — deletes a file permanently (no recycle bin in Linux — be careful!). rm -rf directory — deletes a directory and everything inside it. The Linux filesystem starts at / called root. All directories branch out from /. (Real world: A DevOps engineer joining a new company with no documentation can map an entire server in 10 minutes using only terminal commands: pwd to confirm location, ls /etc to find configuration files, ls /var/log to find error logs, ls /usr/bin to see what tools are installed. These basics unlock everything else.)",
    syllabus: ["DevOps = Development + Operations. Automates deployment pipelines, enables releasing code dozens of times per day. 90 percent of world servers run Linux. Docker, Kubernetes, AWS EC2, GCP, Azure all run Linux. Learning Linux is non-negotiable for DevOps, cloud, and backend roles.", "Linux = open-source OS kernel (Linus Torvalds, 1991). Ubuntu, CentOS, Amazon Linux = Linux distributions. The terminal (Bash shell) = how you control Linux with text commands. Prompt ubuntu@server:~$ shows: username, hostname, current directory. ~ means home directory (/home/ubuntu).", "Navigation commands: pwd (where am I?), ls (list files), ls -la (include hidden files), cd /path (move to directory), cd ~ (go home), cd .. (go up one level), mkdir name (create folder), touch file.txt (create empty file), cp src dst (copy), mv src dst (move/rename), rm file (delete permanently — no undo!), rm -rf dir (delete folder and contents). Filesystem starts at / (root)."],
    eTitle: "Exam: Directory Path Selector",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Linux File Operations",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Linux Permissions — Who Can Read, Write and Execute Every File on Your Server",
    desc: "In Linux, every file and directory has permissions that control exactly who can read it, write to it, and execute it. Understanding permissions is critical for two reasons: security (wrong permissions = data breach or hacked server) and functionality (wrong permissions = application cannot start or read its config files). Every file has THREE permission sets: Owner (the user who created the file), Group (a set of users who share access), Others (everyone else on the system). Each set has THREE bits: Read (r) means you can view the file contents. Write (w) means you can modify the file. Execute (x) means you can run the file as a program (for scripts) or enter a directory (for folders). When you run ls -la you see something like: -rw-r--r-- 1 ubuntu www-data 4096 Jul 10 index.html. Breaking this down: the first character is the type (- for regular file, d for directory, l for symlink). The next 9 characters are the permission triplets: rw- is the owner's permissions (read and write, not execute), then r-- is the group's permissions (read only), then r-- is others' permissions (read only). Users and groups: every Linux user has a username and belongs to one or more groups. The root user is the superuser who can do anything on the system. sudo (superuser do) lets you run a single command with root privileges: sudo apt-get install nginx installs nginx even when you do not have root access. useradd username creates a new user. usermod -aG groupname username adds a user to a group. Principle of Least Privilege: when you deploy a web application (like nginx or your Node.js app) it should NEVER run as root. Instead create a dedicated service account (www-data for nginx, deploy for your app). Give that account only the exact permissions it needs. If an application running as www-data gets hacked, the attacker only has www-data's limited permissions. If an application running as root gets hacked, the attacker has full control of the entire server. (Real world: In 2017, a company's .env file containing database passwords had permissions 777 — readable by everyone on the system. Correct permissions should be 600: only the owner can read it, nobody else can even see the contents. One wrong chmod command was the direct cause of a catastrophic data breach. Permissions are not theoretical — they have real consequences.)",
    syllabus: ["Linux permissions: every file has 3 sets — Owner, Group, Others. Each set has 3 bits: r (read=4), w (write=2), x (execute=1). ls -la shows: -rwxr-xr-- where first char is type (- file, d directory), next 9 chars = 3 triplets for owner, group, others. Wrong permissions = security breach or broken deployments.", "Users and groups: root = superuser (full control). sudo command = run as root temporarily. useradd username (create user), usermod -aG groupname username (add to group), id username (see user's UID and groups). Principle of Least Privilege: apps run as dedicated service accounts (www-data, deploy), never as root.", "Service accounts security: nginx runs as www-data user, not root. Your app runs as a deploy user with minimal permissions. If app running as root gets hacked: attacker has FULL server. If app as deploy user gets hacked: damage limited to deploy's permissions only. This one principle prevents most server compromises."],
    eTitle: "Exam: Permission Calculator",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Process State Checker",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Linux Networking & Scripting (Bash)",
    desc: "Bash variables, loops, cron schedules, and network commands (ping, nslookup, dig, ss, netstat). (Real world: Cron jobs poll remote check monitors periodically.)",
    syllabus: ["Bash loops, conditions, and variable formats", "Cron scheduled task pipelines", "Network lookup tools validation"],
    eTitle: "Exam: Cron Schedule Validator",
    eDesc: "Write a JS function `buildCronSchedule(hour)` returning '0 ' + hour + ' * * *' if hour is between 0 and 23. Return null if invalid.",
    eStarter: "function buildCronSchedule(hour) {\n    // Write your code here\n    \n}",
    eHint: "Check if hour is a valid integer between 0 and 23 inclusive, then concatenate string.",
    eTest: "if (typeof buildCronSchedule !== 'function') throw new Error('Method buildCronSchedule not found.');\nif (buildCronSchedule(5) !== '0 5 * * *') throw new Error('Failed to generate cron');\nif (buildCronSchedule(24) !== null) throw new Error('Failed on invalid hour limit');",
    aTitle: "Assignment: Bash Exit Code Checker",
    aDesc: "Write a JS function `isExitSuccess(code)` returning true if exit code is 0.",
    aStarter: "function isExitSuccess(code) {\n    // Write your code here\n    \n}",
    aHint: "Compare code directly to 0.",
    aTest: "if (typeof isExitSuccess !== 'function') throw new Error('Method isExitSuccess not found.');"
  },
  {
    title: "Docker: Containers storage overlay sizes",
    desc: "Master Docker container dimensions. (Real world: SDEs audit docker images sizes, stripping build caches to ensure quick network registry pulls.)",
    syllabus: ["Docker container layer concepts", "Measuring storage cache sizes", "Optimizing multi-stage build layers"],
    eTitle: "Exam: Container Storage Auditor",
    eDesc: "Write a JS function `isImageSizeSafe(baseMb, overlayMb, maxLimitMb)` returning true if baseMb + overlayMb <= maxLimitMb. Return false if inputs are negative.",
    eStarter: "function isImageSizeSafe(baseMb, overlayMb, maxLimitMb) {\n    // Write your code here\n    \n}",
    eHint: "Compare sum of base image and container overlay writes against thresholds limits.",
    eTest: "if (typeof isImageSizeSafe !== 'function') throw new Error('Method isImageSizeSafe not found');\nif (isImageSizeSafe(200, 150, 400) !== true) throw new Error('Container size auditor failed');",
    aTitle: "Assignment: Docker Port binding constructor",
    aDesc: "Write a JS function `getDockerPortMap(host, container)` returning string: `[host]:[container]`.",
    aStarter: "function getDockerPortMap(host, container) {\n    // Write your code here\n    \n}",
    aHint: "Format port mapping string.",
    aTest: "if (typeof getDockerPortMap !== 'function') throw new Error('Method getDockerPortMap not found');"
  },
  {
    title: "Docker: Containers networking bridges check",
    desc: "Master isolated container communications. (Real world: Production servers run private networking bridges, routing frontend containers to database layers.)",
    syllabus: ["Docker bridge network architecture", "Routing isolated container DNS", "Validating container socket gates"],
    eTitle: "Exam: Bridge Routing Validator",
    eDesc: "Write a JS function `canBridgeResolve(originNet, targetNet)` returning true if originNet === targetNet. Returns false otherwise.",
    eStarter: "function canBridgeResolve(originNet, targetNet) {\n    // Write your code here\n    \n}",
    eHint: "Check network boundaries. Nodes must share the same bridge network namespace.",
    eTest: "if (typeof canBridgeResolve !== 'function') throw new Error('Method canBridgeResolve not found');\nif (canBridgeResolve('prod-net', 'prod-net') !== true) throw new Error('Network bridge validator failed');",
    aTitle: "Assignment: Subnet range inspector",
    aDesc: "Write a JS function `isSubnetAllowed(ip, prefix)` returning true if ip starts with prefix.",
    aStarter: "function isSubnetAllowed(ip, prefix) {\n    // Write your code here\n    \n}",
    aHint: "Verify ip startsWith prefix.",
    aTest: "if (typeof isSubnetAllowed !== 'function') throw new Error('Method isSubnetAllowed not found');"
  },
  {
    title: "CI/CD: GitHub Actions runners pipeline scheduler",
    desc: "Master automated pipeline events. (Real world: CI pipelines monitor repository changes, launching runner scripts when pull requests targets main paths.)",
    syllabus: ["CI/CD pipeline event scheduling triggers", "GitHub Actions workflow syntax configurations", "Job runners sequential executions rules"],
    eTitle: "Exam: GitHub Actions Event Filter",
    eDesc: "Write a JS function `isPipelineTriggered(event, branch)` returning true if event === 'pull_request' and branch === 'main'. Returns false otherwise.",
    eStarter: "function isPipelineTriggered(event, branch) {\n    // Write your code here\n    \n}",
    eHint: "Check event name and target branch string matches.",
    eTest: "if (typeof isPipelineTriggered !== 'function') throw new Error('Method isPipelineTriggered not found');\nif (isPipelineTriggered('pull_request', 'main') !== true) throw new Error('Actions event filter failed');",
    aTitle: "Assignment: Actions runner selector",
    aDesc: "Write a JS function `getRunnerOs(runnerLabel)` returning 'linux' if label is 'ubuntu-latest', 'windows' if 'windows-latest'. Return 'other' otherwise.",
    aStarter: "function getRunnerOs(runnerLabel) {\n    // Write your code here\n    \n}",
    aHint: "Map labels to OS.",
    aTest: "if (typeof getRunnerOs !== 'function') throw new Error('Method getRunnerOs not found');"
  },
  {
    title: "Kubernetes: Pod replicas autoscaler checks",
    desc: "Master container orchestration limits. (Real world: Autoscaler controllers monitor CPU allocations metrics, scaling pod configurations to balance system loads.)",
    syllabus: ["Kubernetes pod replicas parameters", "CPU utilization scaling triggers", "Configuring target minimum and maximum replicas limits"],
    eTitle: "Exam: K8s Replicas Autoscaler Auditor",
    eDesc: "Write a JS function `calculateScaledReplicas(current, cpuUtil, targetUtil, max)` returning Math.min(max, Math.ceil(current * (cpuUtil / targetUtil))). Return current if targetUtil <= 0.",
    eStarter: "function calculateScaledReplicas(current, cpuUtil, targetUtil, max) {\n    // Write your code here\n    \n}",
    eHint: "Compute scaled replicas count based on utilization ratios, clamping to maximum bounds.",
    eTest: "if (typeof calculateScaledReplicas !== 'function') throw new Error('Method calculateScaledReplicas not found');\nif (calculateScaledReplicas(2, 80, 50, 5) !== 4) throw new Error('Autoscaler math failed');",
    aTitle: "Assignment: Pod status health auditor",
    aDesc: "Write a JS function `isPodReady(status)` returning true if status === 'Running' or status === 'Completed'.",
    aStarter: "function isPodReady(status) {\n    // Write your code here\n    \n}",
    aHint: "Check status variables.",
    aTest: "if (typeof isPodReady !== 'function') throw new Error('Method isPodReady not found');"
  },
  {
    title: "Kubernetes: ConfigMaps parameters compiler",
    desc: "Master Kubernetes application states configurations. (Real world: Deployment pods mount ConfigMaps config files, reading environment variables namespaces at runtime.)",
    syllabus: ["Kubernetes ConfigMap and Secret layouts", "Mounting config keys to pod volumes", "Parsing environment namespaces values"],
    eTitle: "Exam: ConfigMap Yaml Key Parser",
    eDesc: "Write a JS function `isConfigKeyValValid(yamlStr, expectedKey)` returning true if yamlStr contains expectedKey + ':'. Returns false otherwise.",
    eStarter: "function isConfigKeyValValid(yamlStr, expectedKey) {\n    // Write your code here\n    \n}",
    eHint: "Check if configuration string includes key name with colon spacer. Check null.",
    eTest: "if (typeof isConfigKeyValValid !== 'function') throw new Error('Method isConfigKeyValValid not found');\nif (isConfigKeyValValid('db_port: 5432', 'db_port') !== true) throw new Error('ConfigMap key parser failed');",
    aTitle: "Assignment: Secret data encryption checker",
    aDesc: "Write a JS function `isSecretBase64(secretVal)` returning true if length of secretVal % 4 === 0.",
    aStarter: "function isSecretBase64(secretVal) {\n    // Write your code here\n    \n}",
    aHint: "Check length formatting.",
    aTest: "if (typeof isSecretBase64 !== 'function') throw new Error('Method isSecretBase64 not found');"
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit",
    desc: "Perform evaluations of pipeline execution times, check container sizes limits, verify Kubernetes replicas scaling boundaries, and compile release parameters profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Pipeline execution timing diagnostics", "Container layer sizes audits", "Kubernetes autoscaler scaling parameters validation"],
    eTitle: "Exam: Pipeline Release Compliance Auditor",
    eDesc: "Write a JS function `evaluatePipelineBuild(report)` returning true if report.imagesSafe === true and report.triggersOk === true and report.podsStable === true.",
    eStarter: "function evaluatePipelineBuild(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.imagesSafe, report.triggersOk, and report.podsStable boolean properties in report.",
    eTest: "if (typeof evaluatePipelineBuild !== 'function') throw new Error('Method evaluatePipelineBuild not found');\nconst rep = { imagesSafe: true, triggersOk: true, podsStable: true };\nif (evaluatePipelineBuild(rep) !== true) throw new Error('Pipeline compliance validation failed');",
    aTitle: "Assignment: Deployment rating evaluator",
    aDesc: "Write a JS function `getBuildRating(errorsCount)` returning 'SUCCESS' if errorsCount === 0, 'UNSTABLE' if errorsCount <= 2, and 'FAILED' otherwise.",
    aStarter: "function getBuildRating(errorsCount) {\n    // Write your code here\n    \n}",
    aHint: "Verify errors boundaries.",
    aTest: "if (typeof getBuildRating !== 'function') throw new Error('Method getBuildRating not found');"
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Pipeline & Deployment compliance audit (Review)",
    desc: "Review pipeline build parameters, Docker container layer dimensions, GitHub Action event triggers configurations, and Kubernetes pod replicas status profiles. (Real world: Devops leads audit deployment scripts, ensuring release artifacts conform to compliance check parameters.)",
    syllabus: ["Reviewing container sizes benchmarks", "Assembling release audit checklists", "Verifying Kubernetes routing configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const DEVOPS_30_DAYS_QUESTS = DEVOPS_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `devops-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `devops-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `devops-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `devops-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `devops-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('devops-basics', dayNum, cfg);
});
