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

export const DISTRIBUTED_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is a Distributed System? — Monolith vs Microservices and Scaling Methods",
    desc: "A DISTRIBUTED SYSTEM is a collection of independent computers that appear to the end-user as a single, unified system. Before distributed systems, companies ran their applications on a single, massive computer. This is called a MONOLITH. A monolith is simple to build and deploy because all the code lives in one place. But it has two fatal flaws: (1) Scalability Limit: you can only buy a computer so big (Vertical Scaling). Eventually, you hit a hardware wall. (2) Single Point of Failure: if a bug crashes one part of the monolith (like a payment module), the entire application crashes, taking down the login page, search page, and everything else. A distributed system solves this by breaking the application into smaller services (called MICROSERVICES) that run on multiple different servers. If one server crashes, the other servers continue running, keeping the application online. SCALING METHODS: (1) Vertical Scaling (Scale Up): adding more power (more CPU, more RAM) to your existing server. Simple, but expensive and has a hard physical limit. (2) Horizontal Scaling (Scale Out): adding more servers to your network fleet. Instead of one giant computer, you connect 10 small computers. This has no limit — you can keep adding servers as your traffic grows. (Real world: When you scroll the feed on Twitter/X, you are talking to thousands of microservices in a distributed system. The post retrieval service, notifications service, direct messages service, and search service all run on separate servers. If the notifications service crashes, you can still scroll and view posts because the services are isolated.)",
    syllabus: ["Distributed System = multiple independent computers working together to appear as one. Monolith = one giant codebase running on one server (simple, but hard to scale and has single point of failure).", "Microservices = breaking monolith into small, isolated services (e.g., payment service, cart service) running on separate servers. A failure in one service does not crash the entire application.", "Scaling models: Vertical Scaling (buying a bigger server with more CPU/RAM, simple but has hardware limits) vs Horizontal Scaling (adding more small servers, unlimited scale, standard production choice)."],
    eTitle: "Exam: Systems Availability Calculator",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Scalability Plan Draft",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "How the Web Works — The Request Lifecycle, DNS Resolution and Reverse Proxies",
    desc: "When a user types 'youtube.com' in a browser, a complex request lifecycle begins. Understanding this sequence is essential for any backend or systems engineer. THE REQUEST LIFECYCLE: (1) DNS Lookup: the browser does not know where youtube.com is. It must resolve the domain name into an IP address. (2) Connection: the browser establishes a TCP connection with the server. (3) Request: browser sends an HTTP request. (4) Processing: the server processes the request and queries databases. (5) Response: the server returns an HTTP response (HTML/video stream). (6) Rendering: browser displays the page. DNS RESOLUTION (Domain Name System): the phonebook of the internet. It translates human-friendly domains into computer-friendly IP addresses (e.g. 172.217.16.14). The lookup sequence: Browser cache -> OS cache -> ISP recursive resolver -> Root Nameserver -> TLD Nameserver (like .com) -> Authoritative Nameserver (which holds the real IP). TTL (Time to Live) defines how many seconds a DNS resolver should cache a record before checking the authoritative server again. REVERSE PROXIES & LOAD BALANCERS: in production, your request does not hit the application server directly. Instead, it hits a REVERSE PROXY (like Nginx). A reverse proxy sits in front of your application servers, acting as a traffic cop. It handles: security (hiding backend server IPs), SSL termination (decrypting HTTPS requests), and load balancing (distributing incoming requests across multiple backend servers using algorithms like Round Robin). (Real world: Every single search query on Google passes through their global DNS servers to find the closest data center, then hits a load balancer that routes the query to a free server. This entire lifecycle completes in under 200 milliseconds.)",
    syllabus: ["The Request Lifecycle: detailed path of a web request from browser input, DNS lookup, TCP handshakes, HTTP request payloads, server processing, and browser page rendering.", "DNS (Domain Name System): translates domain names to IP addresses. Propagation path: recursive resolver, root servers, TLD servers (.com, .in), authoritative nameserver. TTL caches DNS records.", "Reverse Proxy (Nginx) & Load Balancer: sits in front of backend servers. Hides server IPs, handles SSL encryption/decryption, and balances load across servers (Round Robin)."],
    eTitle: "Exam: DNS Host Resolver",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Network Layer Selector",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Stateless Scaling & Sticky Sessions",
    desc: "Learn to design stateless servers, manage sessions, and handle sticky routing. (Real world: E-commerce sites store sessions in shared Redis caches, allowing any application server to fulfill subsequent requests.)",
    syllabus: ["Designing stateless application tiers", "Sticky sessions routing algorithms", "Shared distributed session stores"],
    eTitle: "Exam: Sticky Session Router",
    eDesc: "Write a JS function `routeStickySession(userId, servers)` returning servers[hash(userId) % servers.length], where hash is the sum of character codes. Return null if inputs are invalid.",
    eStarter: "function routeStickySession(userId, servers) {\n    // Write your code here\n    \n}",
    eHint: "Calculate key hash sum, apply modulo servers array length, and return target node.",
    eTest: "if (typeof routeStickySession !== 'function') throw new Error('Method routeStickySession not found.');\nconst srvs = ['srv-A', 'srv-B'];\nlet code = 0;\nfor (let i = 0; i < 'usr-1'.length; i++) code += 'usr-1'.charCodeAt(i);\nconst idx = code % srvs.length;\nif (routeStickySession('usr-1', srvs) !== srvs[idx]) throw new Error('Sticky session routing failed');",
    aTitle: "Assignment: Stateless Token Validator",
    aDesc: "Write a JS function `isTokenValid(token)` returning true if token starts with 'session_' and is at least 16 characters long.",
    aStarter: "function isTokenValid(token) {\n    // Write your code here\n    \n}",
    aHint: "Verify string prefix and length limits.",
    aTest: "if (typeof isTokenValid !== 'function') throw new Error('Method isTokenValid not found.');"
  },
  {
    title: "Load Balancers: Consistent Hashing partitions",
    desc: "Master load balancing hash tables. (Real world: Dynamic web gateways run consistent hashing, allocating requests to primary server slots while minimizing reshuffling when nodes crash.)",
    syllabus: ["Consistent hashing ring structures", "Hashing keys partitions mapping", "Virtual node allocations limits"],
    eTitle: "Exam: Consistent Hash Ring Router",
    eDesc: "Write a JS function `routeConsistentHash(keyHash, nodesList)` returning the first node in nodesList (sorted ascending) whose nodeHash >= keyHash. Return the first node in the list (wrap around) if no node is greater.",
    eStarter: "function routeConsistentHash(keyHash, nodesList) {\n    // Write your code here\n    \n}",
    eHint: "Iterate sorted node objects lists finding matching hashes boundaries.",
    eTest: "if (typeof routeConsistentHash !== 'function') throw new Error('Method routeConsistentHash not found');\nconst nds = [{ name: 'N1', hash: 100 }, { name: 'N2', hash: 200 }];\nif (routeConsistentHash(150, nds).name !== 'N2') throw new Error('Consistent hash routing failed');\nif (routeConsistentHash(250, nds).name !== 'N1') throw new Error('Wrap around failed');",
    aTitle: "Assignment: Hash difference estimator",
    aDesc: "Write a JS function `getHashDistance(h1, h2, ringSize)` returning the distance on the ring `(h2 - h1 + ringSize) % ringSize`.",
    aStarter: "function getHashDistance(h1, h2, ringSize) {\n    // Write your code here\n    \n}",
    aHint: "Implement modular subtraction math.",
    aTest: "if (typeof getHashDistance !== 'function') throw new Error('Method getHashDistance not found');"
  },
  {
    title: "Load Balancers: Heartbeat health checks",
    desc: "Master system diagnostics. (Real world: Gateway routers ping upstream nodes periodically, evicting unresponsive server slots from the active cluster mappings.)",
    syllabus: ["Heartbeat ping systems architectures", "Tracking sequential failed pings thresholds", "Evicting bad nodes from active routing tables"],
    eTitle: "Exam: Server Health Checker",
    eDesc: "Write a JS function `isServerOffline(sequentialFailures, threshold)` returning true if sequentialFailures >= threshold.",
    eStarter: "function isServerOffline(sequentialFailures, threshold) {\n    // Write your code here\n    \n}",
    eHint: "Compare current failure counts with max thresholds.",
    eTest: "if (typeof isServerOffline !== 'function') throw new Error('Method isServerOffline not found');\nif (isServerOffline(3, 3) !== true) throw new Error('Health check logic failed');",
    aTitle: "Assignment: System recovery indicator",
    aDesc: "Write a JS function `resetFailuresOnSuccess(statusCode)` returning 0 if statusCode === 200.",
    aStarter: "function resetFailuresOnSuccess(statusCode) {\n    // Write your code here\n    \n}",
    aHint: "Check HTTP status code.",
    aTest: "if (typeof resetFailuresOnSuccess !== 'function') throw new Error('Method resetFailuresOnSuccess not found');"
  },
  {
    title: "CAP Theorem: Paxos consensus quorum voters",
    desc: "Master CAP partitions logic. (Real world: Distributed databases verify write operations against cluster majorities, ensuring consistent storage states.)",
    syllabus: ["CAP theorem consistency availability boundaries", "Quorum consensus calculations rules", "Leader voter election processes"],
    eTitle: "Exam: Consensus Quorum Validator",
    eDesc: "Write a JS function `isQuorumAchieved(activeVotes, totalNodes)` returning true if activeVotes > Math.floor(totalNodes / 2). Return false if activeVotes <= 0.",
    eStarter: "function isQuorumAchieved(activeVotes, totalNodes) {\n    // Write your code here\n    \n}",
    eHint: "Verify if votes count is strictly greater than half of total nodes cluster size.",
    eTest: "if (typeof isQuorumAchieved !== 'function') throw new Error('Method isQuorumAchieved not found');\nif (isQuorumAchieved(3, 5) !== true) throw new Error('Quorum validator failed');\nif (isQuorumAchieved(2, 5) !== false) throw new Error('Invalid quorum permitted');",
    aTitle: "Assignment: Quorum minimum size finder",
    aDesc: "Write a JS function `getMinQuorum(totalNodes)` returning Math.floor(totalNodes / 2) + 1.",
    aStarter: "function getMinQuorum(totalNodes) {\n    // Write your code here\n    \n}",
    aHint: "Calculate strict majority size.",
    aTest: "if (typeof getMinQuorum !== 'function') throw new Error('Method getMinQuorum not found');"
  },
  {
    title: "Distributed Caching: Cache Stampede lock guards",
    desc: "Master system latency scaling. (Real world: High-traffic servers write mutual exclusion locks on cache misses, preventing database overloads during cold starts.)",
    syllabus: ["Cache stampede (thundering herd) concepts", "Mutual exclusion cache lock algorithms", "Configuring cache TTL expirations values"],
    eTitle: "Exam: Cache Stampede Mutex Guard",
    eDesc: "Write a JS function `shouldFetchFromDb(cacheExpired, isLocked)` returning true if cacheExpired === true and isLocked === false. Returns false otherwise.",
    eStarter: "shouldFetchFromDb = function(cacheExpired, isLocked) {\n    // Write your code here\n    \n}",
    eHint: "Evaluate expired status and active mutex locks. Return boolean.",
    eTest: "if (typeof shouldFetchFromDb !== 'function') throw new Error('Method shouldFetchFromDb not found');\nif (shouldFetchFromDb(true, false) !== true) throw new Error('Stampede lock guard failed');",
    aTitle: "Assignment: Lock expiry duration check",
    aDesc: "Write a JS function `isLockExpired(lockAcquiredTime, ttl, current)` returning true if lockAcquiredTime + ttl <= current.",
    aStarter: "function isLockExpired(lockAcquiredTime, ttl, current) {\n    // Write your code here\n    \n}",
    aHint: "Compare timestamp sums.",
    aTest: "if (typeof isLockExpired !== 'function') throw new Error('Method isLockExpired not found');"
  },
  {
    title: "Database Sharding: Hash range keys mapping",
    desc: "Master data partitioning designs. (Real world: Sharded clusters hash user keys, routing user profiles to correct physical database partitions.)",
    syllabus: ["Database sharding partition schemes", "Hash partitioning ranges configurations", "Calculating shard indexes targets"],
    eTitle: "Exam: Database Shard Router",
    eDesc: "Write a JS function `getShardId(userId, totalShards)` returning `userId % totalShards`. Return 0 if totalShards <= 0.",
    eStarter: "function getShardId(userId, totalShards) {\n    // Write your code here\n    \n}",
    eHint: "Perform modular arithmetic dividing userId index by shard count.",
    eTest: "if (typeof getShardId !== 'function') throw new Error('Method getShardId not found');\nif (getShardId(105, 10) !== 5) throw new Error('Shard routing math failed');",
    aTitle: "Assignment: Shard range key boundaries check",
    aDesc: "Write a JS function `isKeyInShardRange(key, minKey, maxKey)` returning true if key >= minKey && key <= maxKey.",
    aStarter: "function isKeyInShardRange(key, minKey, maxKey) {\n    // Write your code here\n    \n}",
    aHint: "Compare key value bounds.",
    aTest: "if (typeof isKeyInShardRange !== 'function') throw new Error('Method isKeyInShardRange not found');"
  },
  {
    title: "Final Capstone: Distributed Infrastructure Audit",
    desc: "Perform evaluations of infrastructure routing topologies, check consistent hash rings partitions, evaluate consensus voting statuses, and compile system availability ratings. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Consistent hashing partition audits", "Consensus voter quorum verification", "Evaluating cache Stampede lock boundaries"],
    eTitle: "Exam: Infrastructure Compliance Auditor",
    eDesc: "Write a JS function `evaluateInfrastructure(report)` returning true if report.quorumOk === true and report.shardDistributed === true and report.stampedeLocked === true.",
    eStarter: "function evaluateInfrastructure(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.quorumOk, report.shardDistributed, and report.stampedeLocked boolean properties in report.",
    eTest: "if (typeof evaluateInfrastructure !== 'function') throw new Error('Method evaluateInfrastructure not found');\nconst rep = { quorumOk: true, shardDistributed: true, stampedeLocked: true };\nif (evaluateInfrastructure(rep) !== true) throw new Error('Infrastructure compliance validation failed');",
    aTitle: "Assignment: Infrastructure rating evaluator",
    aDesc: "Write a JS function `getAvailabilityRating(uptimePct)` returning 'SLA_MET' if uptimePct >= 99.99, 'SLA_BREACHED' otherwise.",
    aStarter: "function getAvailabilityRating(uptimePct) {\n    // Write your code here\n    \n}",
    aHint: "Verify uptime intervals limits.",
    aTest: "if (typeof getAvailabilityRating !== 'function') throw new Error('Method getAvailabilityRating not found');"
  },
  {
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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
    title: "Final Capstone: Distributed Infrastructure Audit (Review)",
    desc: "Review distributed infrastructure audits, analyze consistent hashing ring structures, check quorum voting patterns, and verify sharding key routing. (Real world: Infrastructure architects audit distributed clusters, ensuring replication pipelines meet target SLAs.)",
    syllabus: ["Reviewing consistent hash rings", "Assembling infrastructure audit checklists", "Verifying database sharding parameters"],
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

export const DISTRIBUTED_30_DAYS_QUESTS = DISTRIBUTED_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `distributed-basics-lecture-day-${dayNum}`,
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
        id: `distributed-basics-lecture2-day-1`,
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
        id: `distributed-basics-lecture3-day-1`,
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
        id: `distributed-basics-lecture2-day-2`,
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
        id: `distributed-basics-lecture3-day-2`,
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
  return buildEnrichedDayQuests('distributed-basics', dayNum, cfg);
});
