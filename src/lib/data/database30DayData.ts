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

export const DATABASE_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is a Database? — SQL vs NoSQL, Tables and Schemas Explained from Scratch",
    desc: "A DATABASE is an organized collection of data stored and accessed electronically. Before databases, applications stored data in simple text files. But text files are slow: if you have 1 million users, finding one user means scanning the entire file from start to finish. Also, if two users update a file at the same time, the file gets corrupted. Databases solve this. They are built to handle millions of operations per second safely and instantly. Databases are split into two major categories: SQL and NoSQL. SQL (Relational Databases) organize data into structured tables with rows and columns, like a collection of spreadsheets. The structure of these tables is defined by a SCHEMA — a set of rules defining what columns exist and what data type each column can hold (e.g. name must be a string, age must be an integer). Relational databases use SQL (Structured Query Language) to read and write data. Examples include PostgreSQL, MySQL, and SQLite. SQL databases are perfect when your data is highly structured and must be 100 percent accurate, like banking systems. NoSQL (Non-Relational Databases) do not use tables. Instead, they store data in flexible formats, most commonly as JSON-like documents. Examples include MongoDB and DynamoDB. NoSQL databases are perfect when you need to store unstructured data that changes constantly, or when you need massive scaling across multiple servers. To understand relational databases, you must understand their anatomy: a DATABASE contains TABLES. A TABLE has COLUMNS (representing attributes like id, email, password) and ROWS (representing individual user records). (Real world: When you sign up on Instagram, their server inserts your username, email, and hashed password as a new row into the 'users' table in their PostgreSQL database. When you scroll your feed, the backend runs SQL queries to fetch your posts from the 'posts' table instantly.)",
    syllabus: ["Database = specialized software for storing and retrieving data safely and instantly. Relational (SQL) databases store data in tables with fixed schemas. Non-Relational (NoSQL) databases store data in flexible documents.", "Table anatomy: a table has columns (attributes like id, username, email, created_at) and rows (individual records of data). Each column has a data type constraint (INT, VARCHAR, TIMESTAMP) that cannot be violated.", "SQL vs NoSQL trade-offs: choose SQL (PostgreSQL, MySQL) for structured transactions, financial records, and complex relationships. Choose NoSQL (MongoDB) for rapid scaling, unstructured logs, or fast-changing data shapes."],
    eTitle: "Exam: Schema Creator",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Schema Analyzer",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "SQL CRUD Operations — SELECT, INSERT, UPDATE, DELETE and the Safe WHERE Clause",
    desc: "CRUD stands for Create, Read, Update, and Delete. These are the four fundamental operations you perform on any database. In SQL, each operation has a corresponding command: (1) CREATE uses the INSERT command. To add a new user to our table: INSERT INTO users (name, email, age) VALUES ('Amit', 'amit@gmail.com', 25);. This inserts a new row with these values. (2) READ uses the SELECT command. To retrieve columns: SELECT name, email FROM users;. To get all columns: SELECT * FROM users;. (3) UPDATE modifies existing rows. To change Amit's email: UPDATE users SET email = 'amit_new@gmail.com' WHERE name = 'Amit';. (4) DELETE removes rows: DELETE FROM users WHERE name = 'Amit';. THE GOLDEN RULE OF DATABASES: NEVER run an UPDATE or DELETE statement without a WHERE clause! The WHERE clause specifies which row to modify or delete. If you run 'UPDATE users SET email = \"hacked@gmail.com\";' without 'WHERE name = \"Amit\"', SQL will update EVERY SINGLE USER in your database to have that hacked email address! Similarly, running 'DELETE FROM users;' without a WHERE clause will wipe out your entire users table, deleting every customer record instantly. This mistake has cost junior developers their jobs. Always write and double-check your WHERE clause before pressing enter. (Real world: When you edit your profile bio on LinkedIn and hit save, the website sends an UPDATE query to their database: UPDATE profiles SET bio = 'New Bio Text' WHERE user_id = 9872;. This updates only your bio, leaving all other users' profiles untouched.)",
    syllabus: ["CRUD operations: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). These four commands form the foundation of all database interactions and backend application API logic.", "INSERT syntax: INSERT INTO table (col1, col2) VALUES (val1, val2);. SELECT syntax: SELECT col1, col2 FROM table;. SELECT * FROM table retrieves all columns. Aliases with AS rename columns: SELECT name AS customer_name.", "UPDATE and DELETE safety: The WHERE clause filters which rows are affected. Running UPDATE or DELETE without WHERE modifies/deletes ALL rows in the table. This is the most dangerous mistake in backend engineering."],
    eTitle: "Exam: CRUD Query Builder",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Record Deletion Safeguards",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "SQL Filtering: WHERE, LIKE, IN, BETWEEN & ORDER BY",
    desc: "Learn to filter and sort query results using clauses and patterns comparisons. (Real world: Search feeds filter items using WHERE clauses, matching categories with IN lists and sorting by timestamps.)",
    syllabus: ["WHERE clauses and comparison operators", "Pattern matching using LIKE and wildcards", "Ordering and limiting results with ORDER BY and LIMIT"],
    eTitle: "Exam: Query Filter Constructor",
    eDesc: "Write a JS function `buildFilterQuery(minAge, category)` returning SQL string `'SELECT * FROM users WHERE age >= ' + minAge + \" AND category = '\" + category + \"'\"`.",
    eStarter: "function buildFilterQuery(minAge, category) {\n    // Write your code here\n    \n}",
    eHint: "Concatenate parameters into the SQL string matching syntax exactly.",
    eTest: "if (typeof buildFilterQuery !== 'function') throw new Error('Method buildFilterQuery not found.');\nif (buildFilterQuery(18, 'premium') !== \"SELECT * FROM users WHERE age >= 18 AND category = 'premium'\") throw new Error('Query string compilation failed');",
    aTitle: "Assignment: SQL Sort Constructor",
    aDesc: "Write a JS function `buildSortedQuery(col, direction)` returning SQL string `'SELECT * FROM users ORDER BY ' + col + ' ' + direction`.",
    aStarter: "function buildSortedQuery(col, direction) {\n    // Write your code here\n    \n}",
    aHint: "Concatenate sorting parameters.",
    aTest: "if (typeof buildSortedQuery !== 'function') throw new Error('Method buildSortedQuery not found.');"
  },
  {
    title: "SQL Joins: Combining multi-tables data fields",
    desc: "Master INNER, LEFT, RIGHT, and FULL database joins. (Real world: E-commerce dashboards join order tables with customer detail tables, calculating shipping destinations.)",
    syllabus: ["INNER JOIN and LEFT JOIN structures", "Joining tables over foreign key maps", "Filtering joined queries records"],
    eTitle: "Exam: Inner Join Query Builder",
    eDesc: "Write a JS function `buildJoinQuery(table1, table2, joinKey)` returning SQL string `'SELECT * FROM ' + table1 + ' INNER JOIN ' + table2 + ' ON ' + table1 + '.' + joinKey + ' = ' + table2 + '.' + joinKey`.",
    eStarter: "function buildJoinQuery(table1, table2, joinKey) {\n    // Write your code here\n    \n}",
    eHint: "Concatenate string tokens forming valid JOIN queries.",
    eTest: "if (typeof buildJoinQuery !== 'function') throw new Error('Method buildJoinQuery not found');\nif (buildJoinQuery('orders', 'users', 'userId') !== 'SELECT * FROM orders INNER JOIN users ON orders.userId = users.userId') throw new Error('Join query compile failed');",
    aTitle: "Assignment: Left join query constructor",
    aDesc: "Write a JS function `buildLeftJoinQuery(t1, t2, key)` returning SQL string with LEFT JOIN syntax.",
    aStarter: "function buildLeftJoinQuery(t1, t2, key) {\n    // Write your code here\n    \n}",
    aHint: "Construct Left Join query.",
    aTest: "if (typeof buildLeftJoinQuery !== 'function') throw new Error('Method buildLeftJoinQuery not found');"
  },
  {
    title: "SQL Aggregations: SUM, AVG, COUNT, MIN, MAX & GROUP BY",
    desc: "Master aggregates processing database records. (Real world: Financial reporting modules execute GROUP BY queries, finding total ledger deposit values by currencies.)",
    syllabus: ["Aggregate calculations functions syntax", "Grouping rows using GROUP BY", "Filtering aggregated groups with HAVING"],
    eTitle: "Exam: Group By Query Builder",
    eDesc: "Write a JS function `buildGroupQuery(table, col, agg)` returning SQL string `'SELECT ' + col + ', ' + agg + '(*) FROM ' + table + ' GROUP BY ' + col`.",
    eStarter: "function buildGroupQuery(table, col, agg) {\n    // Write your code here\n    \n}",
    eHint: "Assemble table, aggregate, and column grouping names.",
    eTest: "if (typeof buildGroupQuery !== 'function') throw new Error('Method buildGroupQuery not found');\nif (buildGroupQuery('users', 'country', 'COUNT') !== 'SELECT country, COUNT(*) FROM users GROUP BY country') throw new Error('Group query compile failed');",
    aTitle: "Assignment: Having clause builder",
    aDesc: "Write a JS function `buildHavingQuery(limit)` returning string: `'HAVING COUNT(*) > ' + limit`.",
    aStarter: "function buildHavingQuery(limit) {\n    // Write your code here\n    \n}",
    aHint: "Concatenate having limit bounds.",
    aTest: "if (typeof buildHavingQuery !== 'function') throw new Error('Method buildHavingQuery not found');"
  },
  {
    title: "Database Indexing: Index scans vs Sequential scans",
    desc: "Master table optimization indexes. (Real world: DBAs audit query execution plans, creating B-Tree indexes to convert expensive sequential table scans to fast index searches.)",
    syllabus: ["Sequential vs Index execution scans", "B-Tree index structure advantages", "Auditing execution scan cost parameters"],
    eTitle: "Exam: Scan Optimizer Auditor",
    eDesc: "Write a JS function `isScanOptimized(scanType, cost)` returning true if scanType === 'Index Scan' or (scanType === 'Seq Scan' && cost < 100). Returns false otherwise.",
    eStarter: "function isScanOptimized(scanType, cost) {\n    // Write your code here\n    \n}",
    eHint: "Compare scanType and cost bounds to evaluate indexing benefits.",
    eTest: "if (typeof isScanOptimized !== 'function') throw new Error('Method isScanOptimized not found');\nif (isScanOptimized('Seq Scan', 500) !== false) throw new Error('Inefficient scan allowed');",
    aTitle: "Assignment: Cost reduction ratio calculator",
    aDesc: "Write a JS function `getCostReduction(oldCost, newCost)` returning OldCost / NewCost.",
    aStarter: "function getCostReduction(oldCost, newCost) {\n    // Write your code here\n    \n}",
    aHint: "Divide old cost by new optimized cost.",
    aTest: "if (typeof getCostReduction !== 'function') throw new Error('Method getCostReduction not found');"
  },
  {
    title: "Transaction isolation levels & ACIDs rules",
    desc: "Master transaction safety behaviors. (Real world: Banking databases configure isolation states to serializable, preventing dirty reads anomalies during transfers.)",
    syllabus: ["ACID transaction properties parameters", "Dirty reads, non-repeatable reads, phantom reads", "Read Committed vs Serializable isolations limits"],
    eTitle: "Exam: Transaction Isolation Validator",
    eDesc: "Write a JS function `isIsolationSafe(level)` returning true if level is 'REPEATABLE READ' or 'SERIALIZABLE'. Returns false otherwise.",
    eStarter: "function isIsolationSafe(level) {\n    // Write your code here\n    \n}",
    eHint: "Verify input level string matches safe isolation modes.",
    eTest: "if (typeof isIsolationSafe !== 'function') throw new Error('Method isIsolationSafe not found');\nif (isIsolationSafe('SERIALIZABLE') !== true) throw new Error('Isolation safety validation failed');",
    aTitle: "Assignment: Phantom read risk checker",
    aDesc: "Write a JS function `hasPhantomRisk(level)` returning true if level === 'READ UNCOMMITTED' || level === 'READ COMMITTED'.",
    aStarter: "function hasPhantomRisk(level) {\n    // Write your code here\n    \n}",
    aHint: "Identify weaker isolation levels.",
    aTest: "if (typeof hasPhantomRisk !== 'function') throw new Error('Method hasPhantomRisk not found');"
  },
  {
    title: "Database Replication: Master-Slave configurations",
    desc: "Master system scaling configurations. (Real world: Web applications direct write transactions to Master databases and read requests to replication replicas.)",
    syllabus: ["Synchronous vs Asynchronous replication pipelines", "Read replicas load distributions", "Master node failover recovery procedures"],
    eTitle: "Exam: DB Replication Router",
    eDesc: "Write a JS function `routeQuery(queryType)` returning 'PRIMARY' if queryType is 'WRITE' or 'UPDATE', and 'REPLICA' if queryType is 'READ'. Return 'PRIMARY' otherwise.",
    eStarter: "function routeQuery(queryType) {\n    // Write your code here\n    \n}",
    eHint: "Verify queryType operation category matching PRIMARY/REPLICA servers.",
    eTest: "if (typeof routeQuery !== 'function') throw new Error('Method routeQuery not found');\nif (routeQuery('READ') !== 'REPLICA') throw new Error('Query routing failed');",
    aTitle: "Assignment: Slave replication sync lag checker",
    aDesc: "Write a JS function `isReplicaHealthy(syncLagSec)` returning true if syncLagSec <= 5.",
    aStarter: "function isReplicaHealthy(syncLagSec) {\n    // Write your code here\n    \n}",
    aHint: "Compare replication delay value limits.",
    aTest: "if (typeof isReplicaHealthy !== 'function') throw new Error('Method isReplicaHealthy not found');"
  },
  {
    title: "Final Capstone: Database Query Optimizer & Compliance Audit",
    desc: "Perform evaluations of SQL queries execution plans, check index scans cost reductions, evaluate transaction isolations safety levels, and compile performance ratings. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Query execution plan analysis", "Index scans optimization criteria", "Transaction isolation levels compliance checks"],
    eTitle: "Exam: Query Optimizer Auditor",
    eDesc: "Write a JS function `evaluateDbOptimizations(report)` returning true if report.scanType === 'Index Scan' and report.syncLagSec <= 3 and report.isolationSafe === true.",
    eStarter: "function evaluateDbOptimizations(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify scanType, syncLagSec, and isolationSafe properties limits in report.",
    eTest: "if (typeof evaluateDbOptimizations !== 'function') throw new Error('Method evaluateDbOptimizations not found');\nconst rep = { scanType: 'Index Scan', syncLagSec: 1, isolationSafe: true };\nif (evaluateDbOptimizations(rep) !== true) throw new Error('Database compliance evaluation failed');",
    aTitle: "Assignment: DB Query optimization score compiler",
    aDesc: "Write a JS function `getOptimizationScore(oldCost, newCost)` returning Math.round(((oldCost - newCost) / oldCost) * 100).",
    aStarter: "function getOptimizationScore(oldCost, newCost) {\n    // Write your code here\n    \n}",
    aHint: "Compute reduction ratio rounding values.",
    aTest: "if (typeof getOptimizationScore !== 'function') throw new Error('Method getOptimizationScore not found');"
  },
  {
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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
    title: "Final Capstone: Database Query Optimizer & Compliance Audit (Review)",
    desc: "Review database query optimizer audits, evaluate index scans execution costs, verify master-slave replication sync delays, and check isolation levels configurations. (Real world: DBAs audit enterprise databases, locating slow queries to prevent outages.)",
    syllabus: ["Reviewing query indexing structures", "Assembling query optimization checklists", "Verifying replication status parameters"],
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

export const DATABASE_30_DAYS_QUESTS = DATABASE_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `database-basics-lecture-day-${dayNum}`,
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
        id: `database-basics-lecture2-day-1`,
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
        id: `database-basics-lecture3-day-1`,
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
        id: `database-basics-lecture2-day-2`,
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
        id: `database-basics-lecture3-day-2`,
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
  return buildEnrichedDayQuests('database-basics', dayNum, cfg);
});
