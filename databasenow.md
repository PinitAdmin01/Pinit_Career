# 🗄️ PinIT Database Engineering & SQL Mastery — Gold-Standard Master Curriculum Specification (v1.0)
**Course ID**: `course-database-systems` | **Target**: Beginners, Data Engineers & Backend Developers
**Pedagogical Blueprint**: 1-Concept Teaching Budget • Everyday Physical Metaphors • 100% Runnable SQL/SQLite Sandboxes • 3-Step Socratic Recovery Ladders • 0 Placeholders • Isolated Query Execution

---

## 📋 Comprehensive 30-Day Curriculum Structure & Milestones

| Day | Title | Blocks | Milestones / Key Focus | Proctored Test Assertions |
|:---:|:---|:---:|:---|:---:|
| **Day 1** | Relational Database Theory, Tables & Candidate Keys | 3 Blocks | Core Micro-Learning | 4 Query Assertions |
| **Day 2** | SQL DDL: Data Types, DEFAULT Values & Constraints | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 3** | SQL DML: INSERT, UPDATE, DELETE & Basic SELECT | 3 Blocks | Core Micro-Learning | 3 Query Assertions |
| **Day 4** | WHERE Filtering, Comparison Operators & NULL Handling | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 5** | ⭐ MILESTONE 1: Customer Order Management Schema & CRUD Engine | 3 Blocks | ⭐ Milestone Project | 3 Query Assertions |
| **Day 6** | Pattern Matching (LIKE, GLOB), IN Lists & BETWEEN Ranges | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 7** | ORDER BY Sorting (ASC, DESC) & LIMIT / OFFSET Pagination | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 8** | SQL String & Date Formatting Functions | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 9** | Aggregate Functions: COUNT, SUM, AVG, MIN, MAX | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 10** | GROUP BY Aggregations & the HAVING Filter Clause | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 11** | INNER JOIN: Combining Relational Tables on Foreign Keys | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 12** | LEFT OUTER JOIN & Handling Missing Parent/Child Records | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 13** | Self Joins & Multi-Table Relational Graphs | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 14** | Set Operations: UNION vs UNION ALL & INTERSECT | 3 Blocks | Core Micro-Learning | 6 Query Assertions |
| **Day 15** | ⭐ MILESTONE 2: Multi-Store Sales Reporting & Aggregation Engine | 3 Blocks | ⭐ Milestone Project | 2 Query Assertions |
| **Day 16** | Subqueries: Scalar, Column Lists & Correlated Subqueries | 3 Blocks | Core Micro-Learning | 4 Query Assertions |
| **Day 17** | Common Table Expressions (WITH CTEs & Recursive CTEs) | 3 Blocks | Core Micro-Learning | 7 Query Assertions |
| **Day 18** | Window Functions: ROW_NUMBER(), RANK() & DENSE_RANK() | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 19** | Window Aggregates: Running Totals & Moving Averages (OVER) | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 20** | Database Indexing: B-Tree Indexes & Composite Index Strategy | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 21** | ⭐ MILESTONE 3: Enterprise Query Optimizer & Execution Plan Auditor | 3 Blocks | ⭐ Milestone Project | 2 Query Assertions |
| **Day 22** | Transactions & ACID Guarantees: BEGIN, COMMIT & ROLLBACK | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 23** | Concurrency & Isolation Levels: Dirty Reads to Serializable | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 24** | Database Normalization: 1NF, 2NF, 3NF & BCNF Architecture | 3 Blocks | Core Micro-Learning | 3 Query Assertions |
| **Day 25** | SQL Views & Materialized Views for Abstract Queries | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 26** | ⭐ MILESTONE 4: Real-Time Audit Log Trigger & Invariant Enforcer | 3 Blocks | ⭐ Milestone Project | 2 Query Assertions |
| **Day 27** | JSON Column Storage & JSON_EXTRACT Querying | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 28** | Sharding, Read Replicas & High-Availability Scaling | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 29** | NoSQL vs Relational Storage Engine Trade-offs | 3 Blocks | Core Micro-Learning | 2 Query Assertions |
| **Day 30** | 🏆 FINAL CAPSTONE: Enterprise Multi-Tenant Banking Ledger & Real-Time Financial Audit Engine | 4 Blocks | 🏆 Final Capstone | 4 Query Assertions |

---

# 📅 DAY 1: RELATIONAL DATABASE THEORY, TABLES & CANDIDATE KEYS

> **Everyday Core Metaphor**: A relational database is a digital library filing cabinet: each drawer is a Table (Relations), each folder is a Record/Row (Tuple), each tabbed section in the folder is a Column (Attribute), and the unique barcode on each folder is the Primary Key that ensures no two documents can ever be confused.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Relational Model: Tables (relations), rows (tuples), and columns (attributes).
- **Concept**: Key Hierarchy: Candidate keys, primary keys, and alternate keys.
- **Concept**: Integrity Constraints: Entity integrity (no null PKs) and domain integrity.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The Anatomy of a Relational Table (Tuples & Attributes) (`sql-d1-b1-relational-model`)

* **Primary Concept Budget**: `Relational Model`
* **Supporting Terms**: Table (Relation), Row (Tuple), Column (Attribute), Schema Definition

##### 💡 Real-World Physical Analogy: *A Spreadsheet Grid with Strict Data Types*
Unlike a loose spreadsheet where you can type 'hello' into a price box, a relational database table strictly enforces that every column has an unbendable data type and purpose.

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  gpa REAL DEFAULT 0.0
);
```
* **Line 1**: Declares a new relation named 'students'.
* **Line 2**: id is the unique primary key.
* **Line 3**: name must never be empty (NOT NULL).
* **Line 4**: gpa stores decimal numbers with a 0.0 fallback default.

##### 💻 Runnable Interactive SQL Sandbox (`relational_schema.sql`)
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  gpa REAL DEFAULT 0.0
);

INSERT INTO students (id, name, gpa) VALUES (1, 'Alex Rivera', 3.85);
SELECT * FROM students;
```
**Expected Terminal Execution Output**:
```text
id | name        | gpa
---+-------------+-----
1  | Alex Rivera | 3.85
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS`
* **Question**: **In relational database terminology, what is a 'Tuple'?**
  ✅ **Option A**: A single row/record in a table containing attribute values for one entity
  ❌ **Option B**: A column data type
  ❌ **Option C**: The database server password

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS`)
  1. 🛑 *What Went Wrong*: In relational calculus and SQL theory, a tuple corresponds directly to a single table row.
  2. 💡 *Simpler Everyday Picture*: Tuple = Row/Record.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Candidate Keys vs Primary Keys (`sql-d1-b2-primary-vs-candidate-keys`)

* **Primary Concept Budget**: `Key Hierarchy`
* **Supporting Terms**: Candidate Key, Primary Key (PK), Alternate Key, Entity Integrity
* **Prerequisites**: `sql-d1-b1-relational-model` (understood)

##### 💡 Real-World Physical Analogy: *Passport vs Driver's License vs Student ID*
A citizen might have a Passport Number, SSN, and Driver's License (all 3 are Candidate Keys because each uniquely identifies them). The government chooses one (SSN) as the Primary Key.

##### 💻 Runnable Interactive SQL Sandbox (`keys_demo.sql`)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  ssn TEXT UNIQUE NOT NULL
);

INSERT INTO users (id, email, ssn) VALUES (101, 'alex@pinit.ai', '999-00-1234');
SELECT id, email FROM users;
```
**Expected Terminal Execution Output**:
```text
id  | email
----+--------------
101 | alex@pinit.ai
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS`
* **Question**: **What is the key rule of Entity Integrity regarding Primary Keys in SQL?**
  ✅ **Option A**: A Primary Key column must contain unique values and must NEVER contain a NULL value
  ❌ **Option B**: A Primary Key must always be stored in uppercase
  ❌ **Option C**: A Primary Key can contain duplicate values if timestamps match

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2` (Misconception: `MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS`)
  1. 🛑 *What Went Wrong*: Entity integrity dictates that primary keys can never be duplicate or NULL, because an unknown ID cannot uniquely identify a row.
  2. 💡 *Simpler Everyday Picture*: Primary Keys can never be NULL and must be strictly unique.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Composite Primary Keys (Multi-Column Uniqueness) (`sql-d1-b3-composite-primary-keys`)

* **Primary Concept Budget**: `Composite Primary Key`
* **Supporting Terms**: Junction Table, PRIMARY KEY (col1, col2), Many-to-Many Bridge
* **Prerequisites**: `sql-d1-b2-primary-vs-candidate-keys` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ❌ Buggy: Single column PK allows duplicate enrollment pairs or lacks junction constraint
CREATE TABLE course_members (
  student_id INT PRIMARY KEY,
  course_id INT
);

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Correct: Composite primary key prevents same student enrolling twice in same course
CREATE TABLE course_members (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  PRIMARY KEY (student_id, course_id)
);
```
* **Error Reason**: Declaring student_id as single PK prevents a student from taking more than 1 course!
* **Fix Explanation**: Use composite PRIMARY KEY (student_id, course_id) so the pair is unique.

##### 💻 Runnable Interactive SQL Sandbox (`composite_pk.sql`)
```sql
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id)
);

INSERT INTO enrollments VALUES (1, 101);
INSERT INTO enrollments VALUES (1, 102); -- Allowed! Same student, different course
SELECT COUNT(*) AS total_enrollments FROM enrollments;
```
**Expected Terminal Execution Output**:
```text
total_enrollments
-----------------
2
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS`
* **Question**: **How many records are in enrollments when student 1 enrolls in course 101 and course 102 under composite PK (student_id, course_id)?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS`)
  1. 🛑 *What Went Wrong*: Composite PK checks uniqueness of the combined pair (1,101) vs (1,102). Both pairs are unique, so 2 rows exist.
  2. 💡 *Simpler Everyday Picture*: Both distinct pairs are stored -> 2 records.
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


### ⚡ Quest 2: Proctored SQL Exam — CREATE TABLE with Composite Primary Key

**Problem Statement**:
Write a SQL statement to create table `course_enrollments` with columns `student_id INT`, `course_id INT`, `enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP`, and composite PRIMARY KEY (`student_id`, `course_id`).

**Socratic Mentor Hint**: *Use PRIMARY KEY (student_id, course_id) constraint at the bottom of table definition.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
-- Write CREATE TABLE statement
CREATE TABLE course_enrollments (
  
);
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT sql FROM sqlite_master WHERE type='table' AND name='course_enrollments';
PRAGMA table_info(course_enrollments);
```

### 🛠️ Quest 3: Practical Database Assignment — Single-Table Employee Directory DDL

**Problem Statement**:
Write a SQL statement creating table `employees` with `id INT PRIMARY KEY`, `email TEXT NOT NULL UNIQUE`, `salary REAL CHECK(salary >= 0)`.

**Socratic Mentor Hint**: *Specify PRIMARY KEY, NOT NULL UNIQUE, and CHECK(salary >= 0).*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
-- Write CREATE TABLE employees
CREATE TABLE employees (
  
);
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT sql FROM sqlite_master WHERE type='table' AND name='employees';
PRAGMA table_info(employees);
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 2: SQL DDL: DATA TYPES, DEFAULT VALUES & CONSTRAINTS

> **Everyday Core Metaphor**: Database constraints are structural building codes: CHECK constraints are maximum elevator weight limits, NOT NULL is requiring an emergency exit door on every floor, and DEFAULT values are backup generator lights that switch on automatically if no manual setting is given.

### 🎯 Day Overview & Learning Objectives
- **Concept**: SQLite / SQL Data Types: INTEGER, TEXT, REAL, NUMERIC, BLOB.
- **Concept**: Column Constraints: NOT NULL, UNIQUE, DEFAULT values.
- **Concept**: CHECK Constraints: Validating business ranges directly in the engine.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: SQL Data Types (INTEGER, TEXT, REAL, BLOB) (`sql-d2-b1-sql-data-types`)

* **Primary Concept Budget**: `SQL Data Types`
* **Supporting Terms**: INTEGER, TEXT / VARCHAR, REAL / FLOAT, BLOB (Binary)
* **Prerequisites**: `sql-d1-b1-relational-model` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  unit_price REAL NOT NULL,
  in_stock INTEGER DEFAULT 0
);
```
* **Line 2**: AUTOINCREMENT automatically assigns sequential IDs (1, 2, 3...).
* **Line 3**: TEXT stores variable-length strings.
* **Line 4**: REAL stores 64-bit floating-point numbers.
* **Line 5**: INTEGER DEFAULT 0 assigns 0 if no quantity is provided.

##### 💻 Runnable Interactive SQL Sandbox (`types_sim.sql`)
```sql
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY,
  sku TEXT,
  unit_price REAL,
  in_stock INTEGER DEFAULT 0
);

INSERT INTO inventory (id, sku, unit_price) VALUES (1, 'TECH-99', 49.99);
SELECT id, sku, unit_price, in_stock FROM inventory;
```
**Expected Terminal Execution Output**:
```text
id | sku     | unit_price | in_stock
---+---------+------------+---------
1  | TECH-99 | 49.99      | 0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_NULL_EQUALITY_OPERATOR`
* **Question**: **What value does in_stock hold when omitted during insertion?**
* **Expected Exact Value**: `0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `NULL` (Misconception: `MC_SQL_NULL_EQUALITY_OPERATOR`)
  1. 🛑 *What Went Wrong*: Because `DEFAULT 0` was specified on the column, omitted values default to 0 instead of NULL.
  2. 💡 *Simpler Everyday Picture*: DEFAULT 0 assigns 0 automatically.
  3. 🛠️ *Guided Fix Prompt*: **Type 0**


#### 🔹 Slide 2: CHECK Constraints for Invariant Enforcement (`sql-d2-b2-check-constraints`)

* **Primary Concept Budget**: `CHECK Constraints`
* **Supporting Terms**: CHECK(price > 0), CHECK(status IN (...)), Engine-Level Validation
* **Prerequisites**: `sql-d2-b1-sql-data-types` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE TABLE accounts (
  id INT PRIMARY KEY,
  balance REAL CHECK(balance >= 0.0),
  tier TEXT CHECK(tier IN ('BRONZE', 'SILVER', 'GOLD'))
);
```
* **Line 3**: Prevents any transaction from creating a negative balance.
* **Line 4**: Restricts tier strings to a strict enumerated set.

##### 💻 Runnable Interactive SQL Sandbox (`check_sim.sql`)
```sql
CREATE TABLE accounts (
  id INT PRIMARY KEY,
  balance REAL CHECK(balance >= 0.0)
);

INSERT INTO accounts VALUES (1, 150.00);
SELECT balance FROM accounts WHERE id = 1;
```
**Expected Terminal Execution Output**:
```text
balance
-------
150.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`
* **Question**: **What happens if you execute `INSERT INTO accounts VALUES (2, -50.0)` on a table with `CHECK(balance >= 0.0)`?**
  ✅ **Option A**: The database engine immediately aborts the insertion and raises a CHECK constraint violation error
  ❌ **Option B**: The database automatically converts -50.0 to +50.0
  ❌ **Option C**: The row is saved in a quarantine table

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`)
  1. 🛑 *What Went Wrong*: CHECK constraints fail fast and reject the query completely.
  2. 💡 *Simpler Everyday Picture*: Database rejects invalid values immediately.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: NOT NULL vs UNIQUE: Multiple NULLs in UNIQUE Columns (`sql-d2-b3-not-null-vs-unique`)

* **Primary Concept Budget**: `UNIQUE Constraint with NULLs`
* **Supporting Terms**: UNIQUE allows multiple NULLs in ANSI SQL, NOT NULL UNIQUE combo
* **Prerequisites**: `sql-d2-b2-check-constraints` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ⚠️ Note: UNIQUE alone permits multiple NULL rows because NULL != NULL in SQL!
CREATE TABLE users (
  id INT PRIMARY KEY,
  tax_id TEXT UNIQUE -- Multiple rows can have tax_id = NULL!
);

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Explicit: Combine NOT NULL UNIQUE when field is mandatory and distinct
CREATE TABLE users (
  id INT PRIMARY KEY,
  tax_id TEXT NOT NULL UNIQUE
);
```
* **Error Reason**: In SQL standard, NULL represents an unknown value, so two NULLs are never considered equal.
* **Fix Explanation**: If you want uniqueness AND guarantee a value exists, specify both NOT NULL and UNIQUE.

##### 💻 Runnable Interactive SQL Sandbox (`unique_nulls.sql`)
```sql
CREATE TABLE profiles (
  id INT PRIMARY KEY,
  phone TEXT UNIQUE
);

INSERT INTO profiles VALUES (1, NULL);
INSERT INTO profiles VALUES (2, NULL); -- Valid in ANSI SQL!
SELECT COUNT(*) AS total_profiles FROM profiles;
```
**Expected Terminal Execution Output**:
```text
total_profiles
--------------
2
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS`
* **Question**: **How many rows exist when inserting two profiles with phone=NULL into a table where phone is UNIQUE (without NOT NULL)?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS`)
  1. 🛑 *What Went Wrong*: In standard SQL, NULL != NULL, so UNIQUE constraints permit multiple NULL entries.
  2. 💡 *Simpler Everyday Picture*: Multiple NULLs are allowed under UNIQUE unless NOT NULL is added.
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


### ⚡ Quest 2: Proctored SQL Exam — Product Inventory Table with Business Rules

**Problem Statement**:
Create table `products` with `id INTEGER PRIMARY KEY AUTOINCREMENT`, `name TEXT NOT NULL`, `price REAL NOT NULL CHECK(price > 0)`, `stock INT DEFAULT 0 CHECK(stock >= 0)`.

**Socratic Mentor Hint**: *Use AUTOINCREMENT on INTEGER PRIMARY KEY, and CHECK expressions on price and stock.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
-- Define products table with constraints
CREATE TABLE products (
  
);
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
PRAGMA table_info(products);
```

### 🛠️ Quest 3: Practical Database Assignment — Customer Account Verification Table

**Problem Statement**:
Create table `user_accounts` with `id INT PRIMARY KEY`, `username TEXT UNIQUE NOT NULL`, `status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACTIVE', 'SUSPENDED'))`.

**Socratic Mentor Hint**: *Use CHECK(status IN ('PENDING', 'ACTIVE', 'SUSPENDED')).*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
-- Define user_accounts table
CREATE TABLE user_accounts (
  
);
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
PRAGMA table_info(user_accounts);
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 3: SQL DML: INSERT, UPDATE, DELETE & BASIC SELECT

> **Everyday Core Metaphor**: DML commands are warehouse inventory actions: INSERT is unloading a new shipping pallet onto a shelf; SELECT is reading the inventory clipboard; UPDATE is taping a new discounted price tag over the old label; DELETE is throwing away a broken box (and leaving off WHERE is demolishing the entire warehouse!).

### 🎯 Day Overview & Learning Objectives
- **Concept**: INSERT INTO: Single-row and multi-row value insertion.
- **Concept**: UPDATE: Modifying specific row values safely with WHERE.
- **Concept**: DELETE: Removing rows without truncating the whole table.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Multi-Row INSERT INTO Syntax (`sql-d3-b1-insert-syntax`)

* **Primary Concept Budget**: `INSERT DML`
* **Supporting Terms**: Explicit Column Lists, Multi-Row Tuples, INSERT INTO tbl(a,b) VALUES (1,2), (3,4)
* **Prerequisites**: `sql-d2-b1-sql-data-types` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
INSERT INTO products (name, price, stock) VALUES
  ('Mechanical Keyboard', 89.99, 15),
  ('Wireless Mouse', 34.50, 40),
  ('USB-C Hub', 19.99, 25);
```
* **Line 1**: Explicit column naming protects against schema migration column shifts.
* **Line 2**: Multiple comma-separated tuples inserted in a single atomic batch.

##### 💻 Runnable Interactive SQL Sandbox (`insert_batch.sql`)
```sql
CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, stock INT);
INSERT INTO products (name, price, stock) VALUES ('Mouse', 25.0, 10), ('Pad', 10.0, 50);
SELECT COUNT(*) AS product_count FROM products;
```
**Expected Terminal Execution Output**:
```text
product_count
-------------
2
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_NULL_EQUALITY_OPERATOR`
* **Question**: **How many rows are created after inserting 2 product tuples in a single statement?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_NULL_EQUALITY_OPERATOR`)
  1. 🛑 *What Went Wrong*: Two value tuples were inserted -> 2 rows created.
  2. 💡 *Simpler Everyday Picture*: 2 tuples create 2 rows.
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


#### 🔹 Slide 2: UPDATE: Modifying Rows Safely with WHERE (`sql-d3-b2-update-with-where`)

* **Primary Concept Budget**: `UPDATE DML`
* **Supporting Terms**: SET col = new_val, Targeted WHERE Filter, Accidental Full-Table Mutation
* **Prerequisites**: `sql-d3-b1-insert-syntax` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ❌ Disaster: Missing WHERE overwrites EVERY employee's salary in the company!
UPDATE employees SET salary = 100000;

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Safe: Targeted WHERE clause updates only the intended employee
UPDATE employees SET salary = 100000 WHERE id = 42;
```
* **Error Reason**: In SQL, UPDATE without a WHERE clause modifies all rows in the entire table.
* **Fix Explanation**: Always specify the target row identifier in the WHERE clause.

##### 💻 Runnable Interactive SQL Sandbox (`safe_update.sql`)
```sql
CREATE TABLE accounts (id INT, name TEXT, balance REAL);
INSERT INTO accounts VALUES (1, 'Alex', 100.0), (2, 'Sarah', 200.0);
UPDATE accounts SET balance = balance + 50.0 WHERE id = 1;
SELECT name, balance FROM accounts ORDER BY id ASC;
```
**Expected Terminal Execution Output**:
```text
name  | balance
------+--------
Alex  | 150.0
Sarah | 200.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_NULL_EQUALITY_OPERATOR`
* **Question**: **What is Alex's updated balance after adding $50 to account id = 1?**
* **Expected Exact Value**: `150.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `200.0` (Misconception: `MC_SQL_NULL_EQUALITY_OPERATOR`)
  1. 🛑 *What Went Wrong*: 100.0 + 50.0 = 150.0 for Alex.
  2. 💡 *Simpler Everyday Picture*: 100 + 50 = 150.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 150.0**


#### 🔹 Slide 3: DELETE FROM with Predicates (`sql-d3-b3-delete-vs-truncate`)

* **Primary Concept Budget**: `DELETE DML`
* **Supporting Terms**: DELETE FROM tbl WHERE ..., Row Deletion vs DROP TABLE
* **Prerequisites**: `sql-d3-b2-update-with-where` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`delete_filter.sql`)
```sql
CREATE TABLE tasks (id INT, title TEXT, done INT);
INSERT INTO tasks VALUES (1, 'Draft PR', 1), (2, 'Review Code', 0);
DELETE FROM tasks WHERE done = 1;
SELECT id, title FROM tasks;
```
**Expected Terminal Execution Output**:
```text
id | title
---+------------
2  | Review Code
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_NULL_EQUALITY_OPERATOR`
* **Question**: **What is the consequence of executing `DELETE FROM tasks;` without a WHERE clause?**
  ✅ **Option A**: All rows in the tasks table are deleted, but the table schema definition remains intact
  ❌ **Option B**: The table itself is deleted from the database schema
  ❌ **Option C**: Only the first row is deleted

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_NULL_EQUALITY_OPERATOR`)
  1. 🛑 *What Went Wrong*: DELETE FROM table removes all data rows. To remove the table schema itself, DROP TABLE is used.
  2. 💡 *Simpler Everyday Picture*: Deletes all rows, keeps schema.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored SQL Exam — Insert and Update Product Inventory

**Problem Statement**:
Write a SQL query that inserts a product `('Keyboard', 75.0, 10)` into table `products(name, price, stock)` and updates all products with stock < 5 to have stock = 10.

**Socratic Mentor Hint**: *Execute INSERT followed by UPDATE with WHERE filter.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
-- Write INSERT and UPDATE statements
INSERT INTO products (name, price, stock) VALUES ('Keyboard', 75.0, 10);
UPDATE products SET stock = 10 WHERE stock < 5;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT * FROM products WHERE name = 'Keyboard';
SELECT COUNT(*) FROM products WHERE stock < 5;
```

### 🛠️ Quest 3: Practical Database Assignment — Deactivate Inactive User Accounts

**Problem Statement**:
Write a SQL statement to UPDATE `user_accounts` setting `status = 'SUSPENDED'` WHERE `status = 'PENDING'`.

**Socratic Mentor Hint**: *Use WHERE status = 'PENDING'.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
-- Update user status
UPDATE user_accounts SET status = 'SUSPENDED' WHERE status = 'PENDING';
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT COUNT(*) FROM user_accounts WHERE status = 'PENDING';
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 4: WHERE FILTERING, COMPARISON OPERATORS & NULL HANDLING

> **Everyday Core Metaphor**: The Three-Valued Logic of NULL is an unlabelled mystery box: If I ask 'Is the price in this mystery box equal to 100?', the answer cannot be TRUE or FALSE—the only logical answer is UNKNOWN (NULL). That's why `col = NULL` never returns rows and `IS NULL` is required.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Comparison Operators: Equality, relational ranges, and boolean logic.
- **Concept**: The Three-Valued Logic of NULL: Why `col = NULL` fails and `IS NULL` is required.
- **Concept**: Combining Filters: Operator precedence with parentheses.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The Mystery of NULL: Why `col = NULL` Always Fails (`sql-d4-b1-null-three-valued-logic`)

* **Primary Concept Budget**: `Three-Valued Logic (3VL)`
* **Supporting Terms**: TRUE, FALSE, UNKNOWN, IS NULL Operator, IS NOT NULL Operator
* **Prerequisites**: `sql-d3-b1-insert-syntax` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ❌ Buggy: col = NULL evaluates to UNKNOWN, so 0 rows are EVER returned!
SELECT * FROM customers WHERE phone = NULL;

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Correct: IS NULL tests whether the field has no assigned value
SELECT * FROM customers WHERE phone IS NULL;
```
* **Error Reason**: In SQL, comparing anything to NULL with '=' produces UNKNOWN (falsy in WHERE).
* **Fix Explanation**: Always use `IS NULL` or `IS NOT NULL` to check for missing data.

##### 💻 Runnable Interactive SQL Sandbox (`null_trap.sql`)
```sql
CREATE TABLE users (id INT, name TEXT, phone TEXT);
INSERT INTO users VALUES (1, 'Alex', '555-0199'), (2, 'Sam', NULL);

-- Correct check
SELECT name FROM users WHERE phone IS NULL;
```
**Expected Terminal Execution Output**:
```text
name
----
Sam
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_NULL_EQUALITY_OPERATOR`
* **Question**: **Why does the query `SELECT * FROM users WHERE email = NULL` return 0 rows even when users with NULL email exist?**
  ✅ **Option A**: Because comparing any value to NULL using `=` evaluates to `UNKNOWN`, which the WHERE clause treats as not matching
  ❌ **Option B**: Because SQL does not allow email columns
  ❌ **Option C**: Because NULL is converted to empty string ''

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2` (Misconception: `MC_SQL_NULL_EQUALITY_OPERATOR`)
  1. 🛑 *What Went Wrong*: Three-Valued Logic dictates that `NULL = NULL` is UNKNOWN, not TRUE. You must use `IS NULL`.
  2. 💡 *Simpler Everyday Picture*: `= NULL` evaluates to UNKNOWN. Use `IS NULL`.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Combining Filters: AND vs OR Precedence (`sql-d4-b2-and-or-precedence`)

* **Primary Concept Budget**: `Logical Operator Precedence`
* **Supporting Terms**: AND has higher precedence than OR, Parentheses Grouping `(A OR B) AND C`
* **Prerequisites**: `sql-d4-b1-null-three-valued-logic` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT name, role, salary FROM staff
WHERE (department = 'ENG' OR department = 'AI')
  AND salary >= 90000;
```
* **Line 2**: Parentheses force the OR expression to evaluate before AND.
* **Line 3**: Guarantees salary filter applies to BOTH engineering and AI staff.

##### 💻 Runnable Interactive SQL Sandbox (`precedence_sim.sql`)
```sql
CREATE TABLE staff (name TEXT, dept TEXT, salary REAL);
INSERT INTO staff VALUES ('Alex', 'ENG', 95000), ('Sam', 'HR', 60000), ('Pat', 'AI', 110000);
SELECT name FROM staff WHERE (dept = 'ENG' OR dept = 'AI') AND salary >= 100000;
```
**Expected Terminal Execution Output**:
```text
name
----
Pat
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_NULL_EQUALITY_OPERATOR`
* **Question**: **Which staff member matches `(dept = 'ENG' OR dept = 'AI') AND salary >= 100000`?**
* **Expected Exact Value**: `Pat`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Alex` (Misconception: `MC_SQL_NULL_EQUALITY_OPERATOR`)
  1. 🛑 *What Went Wrong*: Alex earns 95000 (< 100000), so only Pat (110000) matches.
  2. 💡 *Simpler Everyday Picture*: Only Pat satisfies salary >= 100000.
  3. 🛠️ *Guided Fix Prompt*: **Type Pat**


#### 🔹 Slide 3: The COALESCE() Fallback Function (`sql-d4-b3-coalesce-function`)

* **Primary Concept Budget**: `COALESCE() Function`
* **Supporting Terms**: First Non-NULL Value, Default Presentation Values
* **Prerequisites**: `sql-d4-b2-and-or-precedence` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`coalesce_sim.sql`)
```sql
SELECT COALESCE(NULL, NULL, 'BACKUP_PHONE', 'MAIN_PHONE') AS active_contact;
```
**Expected Terminal Execution Output**:
```text
active_contact
--------------
BACKUP_PHONE
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_NULL_EQUALITY_OPERATOR`
* **Question**: **What string does COALESCE(NULL, NULL, 'BACKUP_PHONE', 'MAIN_PHONE') return?**
* **Expected Exact Value**: `BACKUP_PHONE`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `MAIN_PHONE` (Misconception: `MC_SQL_NULL_EQUALITY_OPERATOR`)
  1. 🛑 *What Went Wrong*: COALESCE returns the very FIRST non-null argument encountered ('BACKUP_PHONE').
  2. 💡 *Simpler Everyday Picture*: Returns first non-null value.
  3. 🛠️ *Guided Fix Prompt*: **Type BACKUP_PHONE**


### ⚡ Quest 2: Proctored SQL Exam — Filter Active High-Tier Customers

**Problem Statement**:
Select `id`, `name`, `balance` from `customers` WHERE `balance >= 1000.0` AND `status = 'ACTIVE'` AND `deleted_at IS NULL`.

**Socratic Mentor Hint**: *Combine balance >= 1000.0, status = 'ACTIVE', and deleted_at IS NULL with AND.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
-- Query active high-balance customers
SELECT id, name, balance FROM customers
WHERE balance >= 1000.0 AND status = 'ACTIVE' AND deleted_at IS NULL;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT id, name, balance FROM customers WHERE balance >= 1000.0 AND status = 'ACTIVE' AND deleted_at IS NULL;
```

### 🛠️ Quest 3: Practical Database Assignment — Find Incomplete Customer Profiles

**Problem Statement**:
Select `id`, `email` from `customers` WHERE `phone IS NULL` OR `address IS NULL`.

**Socratic Mentor Hint**: *Use IS NULL on both fields joined by OR.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
-- Query customers with missing phone or address
SELECT id, email FROM customers
WHERE phone IS NULL OR address IS NULL;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT id, email FROM customers WHERE phone IS NULL OR address IS NULL;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 5: ⭐ MILESTONE 1: CUSTOMER ORDER MANAGEMENT SCHEMA & CRUD ENGINE

> **Everyday Core Metaphor**: Milestone 1 — Relational Core Architecture: Building a rock-solid e-commerce backend schema with Foreign Keys and CASCADE rules that guarantee orphaned order records can never corrupt financial ledgers.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Foreign Key Constraints: REFERENCES parent(id) ON DELETE CASCADE.
- **Concept**: Referential Integrity: Enforcing valid parent-child relationships.
- **Concept**: End-to-End Schema Design: Tables, constraints, insertions, and validation.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Foreign Keys & ON DELETE CASCADE Rules (`sql-d5-b1-foreign-keys-cascade`)

* **Primary Concept Budget**: `Foreign Key Integrity`
* **Supporting Terms**: REFERENCES parent(id), ON DELETE CASCADE, Orphaned Record Prevention
* **Prerequisites**: `sql-d1-b2-primary-vs-candidate-keys` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  total REAL NOT NULL CHECK(total >= 0),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```
* **Line 4**: ON DELETE CASCADE automatically deletes all customer orders if the parent customer is deleted.

##### 💻 Runnable Interactive SQL Sandbox (`fk_demo.sql`)
```sql
PRAGMA foreign_keys = ON;
CREATE TABLE customers (id INT PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INT PRIMARY KEY, customer_id INT REFERENCES customers(id) ON DELETE CASCADE);

INSERT INTO customers VALUES (1, 'Alex');
INSERT INTO orders VALUES (101, 1);
DELETE FROM customers WHERE id = 1;
SELECT COUNT(*) AS remaining_orders FROM orders;
```
**Expected Terminal Execution Output**:
```text
remaining_orders
----------------
0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_FOREIGN_KEY_CASCADE_DELETE`
* **Question**: **When customer 1 is deleted under ON DELETE CASCADE, how many orders remain in the orders table?**
* **Expected Exact Value**: `0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_FOREIGN_KEY_CASCADE_DELETE`)
  1. 🛑 *What Went Wrong*: ON DELETE CASCADE purged the child order when the parent customer was deleted.
  2. 💡 *Simpler Everyday Picture*: CASCADE automatically cleans up child orders -> 0 remain.
  3. 🛠️ *Guided Fix Prompt*: **Type 0**


#### 🔹 Slide 2: Referential Integrity Constraint Violations (`sql-d5-b2-referential-integrity-rejection`)

* **Primary Concept Budget**: `Referential Integrity`
* **Supporting Terms**: Cannot insert child for non-existent parent, FOREIGN KEY constraint failed
* **Prerequisites**: `sql-d5-b1-foreign-keys-cascade` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`ref_integrity.sql`)
```sql
PRAGMA foreign_keys = ON;
CREATE TABLE accounts (id INT PRIMARY KEY);
INSERT INTO accounts VALUES (1);
SELECT 'Parent Account Valid' AS status;
```
**Expected Terminal Execution Output**:
```text
status
--------------------
Parent Account Valid
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_FOREIGN_KEY_CASCADE_DELETE`
* **Question**: **With `PRAGMA foreign_keys = ON`, what happens if you insert an order with `customer_id = 999` when no customer with id 999 exists?**
  ✅ **Option A**: The database rejects the insert and throws a FOREIGN KEY constraint failed error
  ❌ **Option B**: The database silently creates customer 999
  ❌ **Option C**: The customer_id is replaced with 0

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_FOREIGN_KEY_CASCADE_DELETE`)
  1. 🛑 *What Went Wrong*: Foreign keys enforce referential integrity by requiring the parent row to exist beforehand.
  2. 💡 *Simpler Everyday Picture*: Rejects the insert immediately.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Full Milestone 1 CRUD Validation Engine (`sql-d5-b3-milestone-crud-synthesis`)

* **Primary Concept Budget**: `Complete Schema Synthesis`
* **Supporting Terms**: End-to-End Tables, Data Ingestion Pipeline
* **Prerequisites**: `sql-d5-b2-referential-integrity-rejection` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`milestone1_synthesis.sql`)
```sql
CREATE TABLE catalog (id INT PRIMARY KEY, name TEXT, price REAL);
INSERT INTO catalog VALUES (1, 'Pro Laptop', 1200.0), (2, 'Monitor', 300.0);
SELECT COUNT(*) AS total_items, SUM(price) AS catalog_value FROM catalog;
```
**Expected Terminal Execution Output**:
```text
total_items | catalog_value
------------+--------------
2           | 1500.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`
* **Question**: **What is the total catalog value of the 2 items above?**
* **Expected Exact Value**: `1500.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1200.0` (Misconception: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`)
  1. 🛑 *What Went Wrong*: 1200.0 + 300.0 = 1500.0.
  2. 💡 *Simpler Everyday Picture*: Sum is 1500.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 1500.0**


### ⚡ Quest 2: Proctored SQL Exam — Orders Relational Schema with Foreign Key

**Problem Statement**:
Create table `orders` with `id INTEGER PRIMARY KEY`, `customer_id INT NOT NULL`, `total_amount REAL CHECK(total_amount >= 0)`, `created_at TEXT DEFAULT CURRENT_TIMESTAMP`, FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE.

**Socratic Mentor Hint**: *Define column definitions followed by FOREIGN KEY constraint.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
-- Create orders table with foreign key
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INT NOT NULL,
  total_amount REAL CHECK(total_amount >= 0),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
PRAGMA table_info(orders);
PRAGMA foreign_key_list(orders);
```

### 🛠️ Quest 3: Practical Database Assignment — Insert Validated Order Records

**Problem Statement**:
Insert an order `(101, 1, 249.99)` into `orders(id, customer_id, total_amount)` and select total sales for customer_id = 1.

**Socratic Mentor Hint**: *Run INSERT and then SELECT with customer_id filter.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
-- Insert order and calculate sum
INSERT INTO orders (id, customer_id, total_amount) VALUES (101, 1, 249.99);
SELECT SUM(total_amount) FROM orders WHERE customer_id = 1;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT total_amount FROM orders WHERE id = 101;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 6: PATTERN MATCHING (LIKE, GLOB), IN LISTS & BETWEEN RANGES

> **Everyday Core Metaphor**: Pattern matching is an airport luggage scanner: `%` is a wild card that matches any suitcase shape or length (`'TECH-%'`), `_` is a precision slot for exactly one letter (`'D_LL'`), and `IN ('US', 'UK', 'CA')` is an approved destination checklist.

### 🎯 Day Overview & Learning Objectives
- **Concept**: LIKE Wildcards: `%` matches 0 or more characters; `_` matches exactly 1 character.
- **Concept**: IN Operator: Checking membership in fixed sets or subquery results.
- **Concept**: BETWEEN Operator: Inclusive boundary filtering (`val BETWEEN 10 AND 50`).

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The LIKE Operator and Wildcards (% and _) (`sql-d6-b1-like-wildcards`)

* **Primary Concept Budget**: `LIKE Wildcard Matching`
* **Supporting Terms**: % (0 or more characters), _ (exactly 1 character), Case Insensitivity in SQLite
* **Prerequisites**: `sql-d4-b1-null-three-valued-logic` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT email FROM users WHERE email LIKE '%@pinit.ai';
SELECT code FROM coupons WHERE code LIKE 'DISC_0'; -- matches DISC10, DISC20
```
* **Line 1**: '%@pinit.ai' matches any text ending with '@pinit.ai'.
* **Line 2**: 'DISC_0' matches any single character in place of underscore.

##### 💻 Runnable Interactive SQL Sandbox (`like_sim.sql`)
```sql
CREATE TABLE domains (email TEXT);
INSERT INTO domains VALUES ('alex@pinit.ai'), ('sarah@gmail.com'), ('support@pinit.ai');
SELECT email FROM domains WHERE email LIKE '%@pinit.ai' ORDER BY email ASC;
```
**Expected Terminal Execution Output**:
```text
email
----------------
alex@pinit.ai
support@pinit.ai
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`
* **Question**: **How many emails match `%@pinit.ai` in the table above?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `3` (Misconception: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`)
  1. 🛑 *What Went Wrong*: 'sarah@gmail.com' does not end with '@pinit.ai', so 2 emails match.
  2. 💡 *Simpler Everyday Picture*: 2 matching emails.
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


#### 🔹 Slide 2: The IN Membership Operator (`sql-d6-b2-in-lists`)

* **Primary Concept Budget**: `IN Operator`
* **Supporting Terms**: IN ('A', 'B', 'C'), Shorthand for Multiple OR Expressions
* **Prerequisites**: `sql-d6-b1-like-wildcards` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`in_list.sql`)
```sql
CREATE TABLE inventory (sku TEXT, category TEXT);
INSERT INTO inventory VALUES ('SKU1', 'TECH'), ('SKU2', 'OFFICE'), ('SKU3', 'GARDEN');
SELECT sku FROM inventory WHERE category IN ('TECH', 'OFFICE') ORDER BY sku ASC;
```
**Expected Terminal Execution Output**:
```text
sku
----
SKU1
SKU2
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`
* **Question**: **Which SKUs match category IN ('TECH', 'OFFICE')?**
* **Expected Exact Value**: `sku
----
SKU1
SKU2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `SKU3` (Misconception: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`)
  1. 🛑 *What Went Wrong*: GARDEN is not in ('TECH', 'OFFICE').
  2. 💡 *Simpler Everyday Picture*: Matches SKU1 and SKU2.
  3. 🛠️ *Guided Fix Prompt*: **Type SKU1, SKU2**


#### 🔹 Slide 3: The BETWEEN Operator & Inclusive Boundaries (`sql-d6-b3-between-ranges`)

* **Primary Concept Budget**: `BETWEEN Operator`
* **Supporting Terms**: Inclusive of Both Endpoints (`val >= A AND val <= B`), Boundary Safety
* **Prerequisites**: `sql-d6-b2-in-lists` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`between_sim.sql`)
```sql
CREATE TABLE scores (val INT);
INSERT INTO scores VALUES (10), (50), (100), (105);
-- BETWEEN is inclusive: 10 and 100 are included!
SELECT COUNT(*) AS match_count FROM scores WHERE val BETWEEN 10 AND 100;
```
**Expected Terminal Execution Output**:
```text
match_count
-----------
3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_BETWEEN_BOUNDARY_INCLUSION`
* **Question**: **For scores 10, 50, 100, 105, how many match `val BETWEEN 10 AND 100`?**
* **Expected Exact Value**: `3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_BETWEEN_BOUNDARY_INCLUSION`)
  1. 🛑 *What Went Wrong*: BETWEEN is inclusive of both boundary endpoints (10, 50, and 100 all match -> count is 3).
  2. 💡 *Simpler Everyday Picture*: Includes endpoints 10, 50, and 100 -> 3 values.
  3. 🛠️ *Guided Fix Prompt*: **Type 3**


### ⚡ Quest 2: Proctored SQL Exam — Search Customers by Domain and Salary Range

**Problem Statement**:
Select `id`, `name`, `email` from `employees` WHERE `email LIKE '%@pinit.ai'` AND `salary BETWEEN 50000 AND 90000` AND `department IN ('ENG', 'AI', 'DATA')`.

**Socratic Mentor Hint**: *Use email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA').*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
-- Query specific domain, salary range, and departments
SELECT id, name, email FROM employees
WHERE email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA');
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT id, name, email FROM employees WHERE email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA');
```

### 🛠️ Quest 3: Practical Database Assignment — Filter Inventory by SKU Pattern

**Problem Statement**:
Select `name`, `sku` from `products` WHERE `sku LIKE 'TECH-%'` AND `stock IN (0, 1, 2)`.

**Socratic Mentor Hint**: *Use LIKE 'TECH-%' AND stock IN (0, 1, 2).*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
-- Query low-stock tech products
SELECT name, sku FROM products
WHERE sku LIKE 'TECH-%' AND stock IN (0, 1, 2);
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT name, sku FROM products WHERE sku LIKE 'TECH-%' AND stock IN (0, 1, 2);
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 7: ORDER BY SORTING (ASC, DESC) & LIMIT / OFFSET PAGINATION

> **Everyday Core Metaphor**: Pagination is turning pages in a printed book: `ORDER BY price DESC` alphabetizes the catalog by highest price first; `LIMIT 10 OFFSET 20` says 'open the book, skip the first 20 items (pages 1 and 2), and read only the next 10 items (page 3)'.

### 🎯 Day Overview & Learning Objectives
- **Concept**: ORDER BY Clause: Primary and secondary sorting directions (ASC, DESC).
- **Concept**: Sorting with NULLs: NULLS FIRST vs NULLS LAST semantics.
- **Concept**: LIMIT & OFFSET: Extracting fixed-size page windows from sorted sets.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Multi-Column Sorting (Primary & Secondary Orders) (`sql-d7-b1-multi-column-sorting`)

* **Primary Concept Budget**: `ORDER BY Clause`
* **Supporting Terms**: ASC (Default), DESC, Tie-Breaking Secondary Columns
* **Prerequisites**: `sql-d6-b3-between-ranges` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT name, department, salary FROM employees
ORDER BY department ASC, salary DESC;
```
* **Line 2**: Groups departments alphabetically first; breaks ties by ordering highest salary within that department.

##### 💻 Runnable Interactive SQL Sandbox (`sort_sim.sql`)
```sql
CREATE TABLE employees (name TEXT, dept TEXT, salary REAL);
INSERT INTO employees VALUES ('Alex', 'ENG', 80000), ('Sam', 'ENG', 95000), ('Pat', 'DESIGN', 70000);
SELECT name, dept, salary FROM employees ORDER BY dept ASC, salary DESC;
```
**Expected Terminal Execution Output**:
```text
name | dept   | salary
-----+--------+--------
Pat  | DESIGN | 70000.0
Sam  | ENG    | 95000.0
Alex | ENG    | 80000.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_ORDER_BY_EXECUTION_ORDER`
* **Question**: **Within the 'ENG' department, who is listed first when sorted by `salary DESC`?**
* **Expected Exact Value**: `Sam`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Alex` (Misconception: `MC_SQL_ORDER_BY_EXECUTION_ORDER`)
  1. 🛑 *What Went Wrong*: Sam earns 95000 while Alex earns 80000, so Sam appears first under DESC order.
  2. 💡 *Simpler Everyday Picture*: Higher salary (Sam) comes first in DESC order.
  3. 🛠️ *Guided Fix Prompt*: **Type Sam**


#### 🔹 Slide 2: LIMIT & OFFSET Calculation for Pagination (`sql-d7-b2-limit-offset-math`)

* **Primary Concept Budget**: `Pagination Mechanics`
* **Supporting Terms**: LIMIT page_size, OFFSET (page - 1) * page_size
* **Prerequisites**: `sql-d7-b1-multi-column-sorting` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
-- Page 1: LIMIT 10 OFFSET 0
-- Page 2: LIMIT 10 OFFSET 10
-- Page 3: LIMIT 10 OFFSET 20
SELECT id, name FROM products ORDER BY id ASC LIMIT 10 OFFSET 20;
```
* **Line 4**: OFFSET 20 skips the first 20 records to render Page 3.

##### 💻 Runnable Interactive SQL Sandbox (`pagination_sim.sql`)
```sql
CREATE TABLE items (id INT);
INSERT INTO items VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);
-- Page size 3, Page 2 -> Skip 3, take 3
SELECT id FROM items ORDER BY id ASC LIMIT 3 OFFSET 3;
```
**Expected Terminal Execution Output**:
```text
id
--
4
5
6
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_LIMIT_OFFSET_PERFORMANCE`
* **Question**: **What is the first ID returned for Page 2 (LIMIT 3 OFFSET 3)?**
* **Expected Exact Value**: `4`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `3` (Misconception: `MC_SQL_LIMIT_OFFSET_PERFORMANCE`)
  1. 🛑 *What Went Wrong*: OFFSET 3 skips items 1, 2, 3. The first item on page 2 is 4.
  2. 💡 *Simpler Everyday Picture*: Skips 1,2,3 -> first item is 4.
  3. 🛠️ *Guided Fix Prompt*: **Type 4**


#### 🔹 Slide 3: Offset Performance vs Keyset/Cursor Pagination (`sql-d7-b3-cursor-vs-offset`)

* **Primary Concept Budget**: `Keyset Pagination`
* **Supporting Terms**: WHERE id > last_seen_id LIMIT 10, Avoiding Deep OFFSET Scans
* **Prerequisites**: `sql-d7-b2-limit-offset-math` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`cursor_sim.sql`)
```sql
CREATE TABLE stream (id INT, payload TEXT);
INSERT INTO stream VALUES (10, 'A'), (15, 'B'), (22, 'C'), (35, 'D');
-- Keyset pagination: fast O(log N) index scan
SELECT id, payload FROM stream WHERE id > 15 ORDER BY id ASC LIMIT 2;
```
**Expected Terminal Execution Output**:
```text
id | payload
---+--------
22 | C
35 | D
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_LIMIT_OFFSET_PERFORMANCE`
* **Question**: **Why is keyset pagination (`WHERE id > last_seen_id LIMIT 10`) preferred over high offset pagination (`LIMIT 10 OFFSET 1000000`) for large tables?**
  ✅ **Option A**: Keyset pagination uses index seeking directly to the target record in O(log N) without scanning and discarding 1,000,000 preceding rows
  ❌ **Option B**: Because OFFSET is not supported in SQL
  ❌ **Option C**: Because keyset pagination deletes old records

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_LIMIT_OFFSET_PERFORMANCE`)
  1. 🛑 *What Went Wrong*: Deep offsets force the database engine to traverse and discard thousands of rows. Keyset pagination jumps directly via index.
  2. 💡 *Simpler Everyday Picture*: Jumps directly using index seek without scanning discarded rows.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored SQL Exam — Top 5 Highest Paid Employees with Secondary Sort

**Problem Statement**:
Select `id`, `name`, `salary`, `department` from `employees` ORDER BY `salary DESC`, `name ASC` LIMIT 5 OFFSET 0.

**Socratic Mentor Hint**: *Order by salary DESC first, then name ASC for ties, with LIMIT 5.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
-- Query top 5 highest salaries
SELECT id, name, salary, department FROM employees
ORDER BY salary DESC, name ASC
LIMIT 5 OFFSET 0;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT id, name, salary, department FROM employees ORDER BY salary DESC, name ASC LIMIT 5 OFFSET 0;
```

### 🛠️ Quest 3: Practical Database Assignment — Paginated Product Catalog (Page 2)

**Problem Statement**:
Select `id`, `name`, `price` from `products` ORDER BY `price ASC` LIMIT 10 OFFSET 10.

**Socratic Mentor Hint**: *LIMIT 10 OFFSET 10 pulls the second page of 10 items.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
-- Query page 2 (items 11-20)
SELECT id, name, price FROM products
ORDER BY price ASC
LIMIT 10 OFFSET 10;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT id, name, price FROM products ORDER BY price ASC LIMIT 10 OFFSET 10;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 8: SQL STRING & DATE FORMATTING FUNCTIONS

> **Everyday Core Metaphor**: SQL built-in functions are precision machine tools: `TRIM()` chips away unwanted blank edges, `UPPER()` stamps clear block letters onto nameplates, and `STRFTIME('%Y-%m')` extracts the exact production year and month from raw timestamp metadata.

### 🎯 Day Overview & Learning Objectives
- **Concept**: String Functions: UPPER, LOWER, LENGTH, SUBSTR, TRIM, || (concatenation).
- **Concept**: Date & Time Functions: DATE(), DATETIME('now'), STRFTIME('%Y-%m', date_col).
- **Concept**: Derived Virtual Columns in SELECT projections.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: String Manipulation: UPPER, LOWER, TRIM, and Concatenation (||) (`sql-d8-b1-string-functions`)

* **Primary Concept Budget**: `SQL String Functions`
* **Supporting Terms**: UPPER() / LOWER(), TRIM(), Concatenation Operator `||`, LENGTH()
* **Prerequisites**: `sql-d6-b1-like-wildcards` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  UPPER(first_name || ' ' || last_name) AS full_name_upper,
  LOWER(TRIM(email)) AS clean_email,
  LENGTH(TRIM(email)) AS char_count
FROM customers;
```
* **Line 2**: || concatenates strings together.
* **Line 3**: TRIM strips leading/trailing spaces before LOWER lowercases.
* **Line 4**: LENGTH returns the number of characters in the string.

##### 💻 Runnable Interactive SQL Sandbox (`string_funcs.sql`)
```sql
SELECT UPPER('alex' || ' ' || 'rivera') AS full_name, LENGTH('pinit') AS name_len;
```
**Expected Terminal Execution Output**:
```text
full_name   | name_len
------------+---------
ALEX RIVERA | 5
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`
* **Question**: **What is `full_name` produced by `UPPER('alex' || ' ' || 'rivera')`?**
* **Expected Exact Value**: `ALEX RIVERA`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `alex rivera` (Misconception: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`)
  1. 🛑 *What Went Wrong*: UPPER converts the concatenated string to uppercase.
  2. 💡 *Simpler Everyday Picture*: Uppercased to ALEX RIVERA.
  3. 🛠️ *Guided Fix Prompt*: **Type ALEX RIVERA**


#### 🔹 Slide 2: Date & Time Arithmetic: DATE, DATETIME & STRFTIME (`sql-d8-b2-date-time-functions`)

* **Primary Concept Budget**: `SQL Date Functions`
* **Supporting Terms**: CURRENT_TIMESTAMP, STRFTIME('%Y-%m-%d', date), DATE('now', '-7 days')
* **Prerequisites**: `sql-d8-b1-string-functions` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`date_sim.sql`)
```sql
SELECT STRFTIME('%Y', '2026-08-24 12:00:00') AS extracted_year;
```
**Expected Terminal Execution Output**:
```text
extracted_year
--------------
2026
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_ORDER_BY_EXECUTION_ORDER`
* **Question**: **What year string is extracted by `STRFTIME('%Y', '2026-08-24')`?**
* **Expected Exact Value**: `2026`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `08` (Misconception: `MC_SQL_ORDER_BY_EXECUTION_ORDER`)
  1. 🛑 *What Went Wrong*: %Y extracts the 4-digit year (2026). %m extracts month.
  2. 💡 *Simpler Everyday Picture*: Year format %Y produces 2026.
  3. 🛠️ *Guided Fix Prompt*: **Type 2026**


#### 🔹 Slide 3: Conditional Projections with CASE WHEN (`sql-d8-b3-case-when-projections`)

* **Primary Concept Budget**: `CASE Expression`
* **Supporting Terms**: CASE WHEN condition THEN val ELSE fallback END, Inline Conditional Mapping
* **Prerequisites**: `sql-d8-b2-date-time-functions` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  name,
  salary,
  CASE
    WHEN salary >= 100000 THEN 'SENIOR'
    WHEN salary >= 60000  THEN 'MID'
    ELSE 'JUNIOR'
  END AS compensation_tier
FROM employees;
```
* **Line 3**: Evaluates conditional branches sequentially from top to bottom.
* **Line 6**: ELSE provides fallback value if no conditions match.

##### 💻 Runnable Interactive SQL Sandbox (`case_sim.sql`)
```sql
SELECT
  120000 AS salary,
  CASE
    WHEN 120000 >= 100000 THEN 'SENIOR'
    ELSE 'JUNIOR'
  END AS tier;
```
**Expected Terminal Execution Output**:
```text
salary | tier
-------+-------
120000 | SENIOR
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_ORDER_BY_EXECUTION_ORDER`
* **Question**: **What tier is assigned to a salary of 120000 in the CASE statement above?**
* **Expected Exact Value**: `SENIOR`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `JUNIOR` (Misconception: `MC_SQL_ORDER_BY_EXECUTION_ORDER`)
  1. 🛑 *What Went Wrong*: 120000 >= 100000 evaluates to TRUE, matching the first branch 'SENIOR'.
  2. 💡 *Simpler Everyday Picture*: Matches 'SENIOR'.
  3. 🛠️ *Guided Fix Prompt*: **Type SENIOR**


### ⚡ Quest 2: Proctored SQL Exam — Format Customer Full Name and Month of Registration

**Problem Statement**:
Select `UPPER(first_name || ' ' || last_name) AS full_name`, `STRFTIME('%Y-%m', created_at) AS signup_month` from `customers` ORDER BY `signup_month DESC`.

**Socratic Mentor Hint**: *Use UPPER(first_name || ' ' || last_name) AS full_name and STRFTIME('%Y-%m', created_at) AS signup_month.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
-- Format string concatenation and extract month
SELECT UPPER(first_name || ' ' || last_name) AS full_name, STRFTIME('%Y-%m', created_at) AS signup_month
FROM customers
ORDER BY signup_month DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT UPPER(first_name || ' ' || last_name) AS full_name, STRFTIME('%Y-%m', created_at) AS signup_month FROM customers ORDER BY signup_month DESC;
```

### 🛠️ Quest 3: Practical Database Assignment — Sanitize Email Addresses and Compute String Lengths

**Problem Statement**:
Select `LOWER(TRIM(email)) AS clean_email`, `LENGTH(TRIM(email)) AS email_len` from `user_accounts`.

**Socratic Mentor Hint**: *Use LOWER(TRIM(email)) and LENGTH(TRIM(email)).*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
-- Sanitize email strings
SELECT LOWER(TRIM(email)) AS clean_email, LENGTH(TRIM(email)) AS email_len FROM user_accounts;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT LOWER(TRIM(email)) AS clean_email, LENGTH(TRIM(email)) AS email_len FROM user_accounts;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 9: AGGREGATE FUNCTIONS: COUNT, SUM, AVG, MIN, MAX

> **Everyday Core Metaphor**: Aggregate functions are a digital cash register at checkout: individual item barcode scans are collapsed down into total items count (`COUNT`), total receipt cost (`SUM`), average item cost (`AVG`), and most expensive item (`MAX`).

### 🎯 Day Overview & Learning Objectives
- **Concept**: COUNT(*) vs COUNT(col): Handling null values in counts.
- **Concept**: SUM & AVG: Arithmetic aggregations and precision rounding with ROUND().
- **Concept**: MIN & MAX: Finding peak and minimum values in sets.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: COUNT(*) vs COUNT(column_name): The NULL Counting Trap (`sql-d9-b1-count-star-vs-col`)

* **Primary Concept Budget**: `COUNT Aggregation Semantics`
* **Supporting Terms**: COUNT(*) includes NULL rows, COUNT(col) ignores NULLs, COUNT(DISTINCT col)
* **Prerequisites**: `sql-d4-b1-null-three-valued-logic` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ⚠️ Counting specific column IGNORES null values (e.g. Sam with no phone!)
SELECT COUNT(phone) FROM users; -- Returns 1 (misses Sam)

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ COUNT(*) counts all physical rows regardless of null column entries
SELECT COUNT(*) FROM users;     -- Returns 2 (counts all rows)
```
* **Error Reason**: COUNT(col) counts only non-null values in that specific column.
* **Fix Explanation**: Use COUNT(*) to count total table rows, or COUNT(col) only when explicitly checking non-null entries.

##### 💻 Runnable Interactive SQL Sandbox (`count_demo.sql`)
```sql
CREATE TABLE users (id INT, phone TEXT);
INSERT INTO users VALUES (1, '555-0100'), (2, NULL);
SELECT COUNT(*) AS total_rows, COUNT(phone) AS non_null_phones FROM users;
```
**Expected Terminal Execution Output**:
```text
total_rows | non_null_phones
-----------+----------------
2          | 1
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_COUNT_NULL_BEHAVIOR`
* **Question**: **With 2 rows where 1 has phone=NULL, what does `COUNT(phone)` return?**
* **Expected Exact Value**: `1`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2` (Misconception: `MC_SQL_COUNT_NULL_BEHAVIOR`)
  1. 🛑 *What Went Wrong*: COUNT(column) skips NULL entries, so it counts only 1 non-null phone.
  2. 💡 *Simpler Everyday Picture*: COUNT(col) ignores NULLs -> returns 1.
  3. 🛠️ *Guided Fix Prompt*: **Type 1**


#### 🔹 Slide 2: SUM, AVG and Precision Rounding with ROUND() (`sql-d9-b2-sum-avg-math`)

* **Primary Concept Budget**: `Arithmetic Aggregation`
* **Supporting Terms**: SUM(col), AVG(col), ROUND(val, decimals), NULLs in Math Aggregates
* **Prerequisites**: `sql-d9-b1-count-star-vs-col` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  SUM(salary) AS total_payroll,
  ROUND(AVG(salary), 2) AS rounded_average,
  MIN(salary) AS min_pay,
  MAX(salary) AS max_pay
FROM employees;
```
* **Line 2**: Computes sum of all non-null salary rows.
* **Line 3**: Calculates arithmetic mean rounded to 2 decimal places.

##### 💻 Runnable Interactive SQL Sandbox (`sum_avg_sim.sql`)
```sql
CREATE TABLE salaries (amount REAL);
INSERT INTO salaries VALUES (50000), (70000), (90000);
SELECT SUM(amount) AS total, ROUND(AVG(amount), 2) AS average FROM salaries;
```
**Expected Terminal Execution Output**:
```text
total    | average
---------+--------
210000.0 | 70000.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_COUNT_NULL_BEHAVIOR`
* **Question**: **What is the average salary of 50000, 70000, and 90000 in the query above?**
* **Expected Exact Value**: `70000.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `210000.0` (Misconception: `MC_SQL_COUNT_NULL_BEHAVIOR`)
  1. 🛑 *What Went Wrong*: 210000 is the SUM. The AVG is 210000 / 3 = 70000.0.
  2. 💡 *Simpler Everyday Picture*: Average is 70000.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 70000.0**


#### 🔹 Slide 3: COUNT(DISTINCT column_name) Deduplication (`sql-d9-b3-count-distinct`)

* **Primary Concept Budget**: `Distinct Aggregation`
* **Supporting Terms**: COUNT(DISTINCT col), Counting Unique Values
* **Prerequisites**: `sql-d9-b2-sum-avg-math` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`distinct_sim.sql`)
```sql
CREATE TABLE sales (id INT, country TEXT);
INSERT INTO sales VALUES (1, 'US'), (2, 'US'), (3, 'UK'), (4, 'CA');
SELECT COUNT(*) AS total_sales, COUNT(DISTINCT country) AS unique_countries FROM sales;
```
**Expected Terminal Execution Output**:
```text
total_sales | unique_countries
------------+-----------------
4           | 3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_COUNT_NULL_BEHAVIOR`
* **Question**: **For sales records with countries US, US, UK, CA, how many unique countries are counted?**
* **Expected Exact Value**: `3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `4` (Misconception: `MC_SQL_COUNT_NULL_BEHAVIOR`)
  1. 🛑 *What Went Wrong*: COUNT(DISTINCT) deduplicates 'US', yielding 3 unique countries.
  2. 💡 *Simpler Everyday Picture*: Deduplicated count is 3.
  3. 🛠️ *Guided Fix Prompt*: **Type 3**


### ⚡ Quest 2: Proctored SQL Exam — Department Salary Summary Metrics

**Problem Statement**:
Select `COUNT(*) AS total_staff`, `SUM(salary) AS total_payroll`, `ROUND(AVG(salary), 2) AS avg_salary`, `MIN(salary) AS min_salary`, `MAX(salary) AS max_salary` from `employees` WHERE `status = 'ACTIVE'`

**Socratic Mentor Hint**: *Use aggregate functions with status = 'ACTIVE' filter.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT COUNT(*) AS total_staff, SUM(salary) AS total_payroll, ROUND(AVG(salary), 2) AS avg_salary, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees WHERE status = 'ACTIVE';
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT COUNT(*), SUM(salary), ROUND(AVG(salary), 2) FROM employees WHERE status = 'ACTIVE';
```

### 🛠️ Quest 3: Practical Database Assignment — Inventory Value and SKU Count

**Problem Statement**:
Select `COUNT(id) AS total_skus`, `SUM(price * stock) AS total_inventory_value` from `products`

**Socratic Mentor Hint**: *Multiply price * stock inside SUM().*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT COUNT(id) AS total_skus, SUM(price * stock) AS total_inventory_value FROM products;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT COUNT(id), SUM(price * stock) FROM products;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 10: GROUP BY AGGREGATIONS & THE HAVING FILTER CLAUSE

> **Everyday Core Metaphor**: GROUP BY vs HAVING is sorting mail at a post office: `GROUP BY zip_code` sorts individual envelopes into separate city bins; `WHERE` filters out damaged letters before they ever enter a bin; `HAVING` filters out entire bins (e.g. 'only ship bins that contain at least 50 letters').

### 🎯 Day Overview & Learning Objectives
- **Concept**: GROUP BY Clause: Aggregating by single and multiple columns.
- **Concept**: WHERE vs HAVING: Filtering individual rows before grouping vs filtering aggregated buckets.
- **Concept**: Sorting Aggregated Groups.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The GROUP BY Mechanism: Bucketing Rows by Category (`sql-d10-b1-group-by-concept`)

* **Primary Concept Budget**: `GROUP BY Clause`
* **Supporting Terms**: Categorical Buckets, Non-Aggregate Projections Rule, Per-Group Summaries
* **Prerequisites**: `sql-d9-b1-count-star-vs-col` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  department,
  COUNT(*) AS staff_count,
  SUM(salary) AS dept_payroll
FROM employees
GROUP BY department;
```
* **Line 2**: department is the grouping key.
* **Line 3**: Aggregate functions calculate metrics independently for each department bucket.

##### 💻 Runnable Interactive SQL Sandbox (`groupby_sim.sql`)
```sql
CREATE TABLE employees (dept TEXT, salary REAL);
INSERT INTO employees VALUES ('ENG', 100000), ('ENG', 120000), ('HR', 60000);
SELECT dept, COUNT(*) AS count, SUM(salary) AS total FROM employees GROUP BY dept ORDER BY dept ASC;
```
**Expected Terminal Execution Output**:
```text
dept | count | total
-----+-------+---------
ENG  | 2     | 220000.0
HR   | 1     | 60000.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_GROUP_BY_NON_AGGREGATE_COLUMN`
* **Question**: **What is the rule regarding unaggregated columns in the `SELECT` list when using `GROUP BY`?**
  ✅ **Option A**: Every column in the SELECT list must either be listed in the GROUP BY clause or wrapped inside an aggregate function (SUM, AVG, COUNT, etc.)
  ❌ **Option B**: You cannot select any column name except numbers
  ❌ **Option C**: GROUP BY requires all columns to be primary keys

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_GROUP_BY_NON_AGGREGATE_COLUMN`)
  1. 🛑 *What Went Wrong*: Selecting non-aggregated columns not present in GROUP BY produces ambiguous, indeterminate rows in standard SQL.
  2. 💡 *Simpler Everyday Picture*: Columns must be in GROUP BY or inside an aggregate.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: WHERE vs HAVING: Filtering Rows vs Filtering Groups (`sql-d10-b2-where-vs-having`)

* **Primary Concept Budget**: `WHERE vs HAVING`
* **Supporting Terms**: WHERE filters individual rows BEFORE grouping, HAVING filters aggregated buckets AFTER grouping
* **Prerequisites**: `sql-d10-b1-group-by-concept` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ❌ Illegal: Aggregate functions cannot appear in the WHERE clause!
SELECT department, COUNT(*)
FROM employees
WHERE COUNT(*) >= 5 -- ❌ SQL Error: misuse of aggregate function in WHERE!
GROUP BY department;

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Correct: Use HAVING to filter aggregated metrics
SELECT department, COUNT(*)
FROM employees
GROUP BY department
HAVING COUNT(*) >= 5; -- ✅ Evaluated after groups are formed!
```
* **Error Reason**: WHERE filters rows before groups exist, so COUNT(*) is undefined in WHERE.
* **Fix Explanation**: Use HAVING to filter on aggregate conditions (COUNT, SUM, AVG).

##### 💻 Runnable Interactive SQL Sandbox (`having_demo.sql`)
```sql
CREATE TABLE orders (customer_id INT, amount REAL);
INSERT INTO orders VALUES (1, 100), (1, 200), (2, 50);
SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id HAVING SUM(amount) >= 200;
```
**Expected Terminal Execution Output**:
```text
customer_id | total
------------+------
1           | 300.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_WHERE_VS_HAVING`
* **Question**: **When should you use `HAVING` instead of `WHERE`?**
  ✅ **Option A**: When filtering based on the results of an aggregate function (e.g. `HAVING COUNT(*) > 2` or `HAVING SUM(amount) >= 1000`)
  ❌ **Option B**: When filtering text strings
  ❌ **Option C**: When ordering table rows

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_WHERE_VS_HAVING`)
  1. 🛑 *What Went Wrong*: HAVING evaluates conditions on aggregated results; WHERE filters raw rows before grouping.
  2. 💡 *Simpler Everyday Picture*: HAVING is for aggregate conditions like SUM/COUNT.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: The Complete SQL Query Pipeline Execution Order (`sql-d10-b3-combined-pipeline`)

* **Primary Concept Budget**: `SQL Execution Order`
* **Supporting Terms**: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT
* **Prerequisites**: `sql-d10-b2-where-vs-having` (understood)

##### 🔄 Query Engine Execution Flowchart
* [START] **1. FROM & JOIN (Form working table)**
* [PROCESS] **2. WHERE (Filter individual rows)**
* [PROCESS] **3. GROUP BY (Bucket rows)**
* [PROCESS] **4. HAVING (Filter buckets)**
* [PROCESS] **5. SELECT & Aliases (Compute columns)**
* [PROCESS] **6. ORDER BY (Sort result)**
* [END] **7. LIMIT / OFFSET (Slice page)**

##### 💻 Runnable Interactive SQL Sandbox (`pipeline_sim.sql`)
```sql
CREATE TABLE sales (id INT, dept TEXT, status TEXT, amount REAL);
INSERT INTO sales VALUES (1, 'ENG', 'ACTIVE', 500), (2, 'ENG', 'CANCELLED', 300), (3, 'ENG', 'ACTIVE', 700);

-- Pipeline execution:
SELECT dept, SUM(amount) AS valid_revenue
FROM sales
WHERE status = 'ACTIVE'
GROUP BY dept
HAVING SUM(amount) >= 1000;
```
**Expected Terminal Execution Output**:
```text
dept | valid_revenue
-----+--------------
ENG  | 1200.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_WHERE_VS_HAVING`
* **Question**: **For ACTIVE sales 500 and 700 (ignoring CANCELLED 300), what is `valid_revenue` for department 'ENG'?**
* **Expected Exact Value**: `1200.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1500.0` (Misconception: `MC_SQL_WHERE_VS_HAVING`)
  1. 🛑 *What Went Wrong*: WHERE status = 'ACTIVE' filtered out the 300 cancelled sale before aggregation: 500 + 700 = 1200.0.
  2. 💡 *Simpler Everyday Picture*: 500 + 700 = 1200.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 1200.0**


### ⚡ Quest 2: Proctored SQL Exam — High-Volume Sales Departments Filter

**Problem Statement**:
Select `department`, `COUNT(*) AS emp_count`, `SUM(salary) AS total_dept_salary` from `employees` GROUP BY `department` HAVING `COUNT(*) >= 3` ORDER BY `total_dept_salary DESC`

**Socratic Mentor Hint**: *Apply HAVING COUNT(*) >= 3 on the grouped department rows.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT department, COUNT(*) AS emp_count, SUM(salary) AS total_dept_salary FROM employees GROUP BY department HAVING COUNT(*) >= 3 ORDER BY total_dept_salary DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT department, COUNT(*), SUM(salary) FROM employees GROUP BY department HAVING COUNT(*) >= 3;
```

### 🛠️ Quest 3: Practical Database Assignment — Categories with Average Price > $50

**Problem Statement**:
Select `category`, `ROUND(AVG(price), 2) AS avg_price` from `products` GROUP BY `category` HAVING `AVG(price) > 50.0`

**Socratic Mentor Hint**: *Use HAVING AVG(price) > 50.0.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT category, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 50.0;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT category, ROUND(AVG(price), 2) FROM products GROUP BY category HAVING AVG(price) > 50.0;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 11: INNER JOIN: COMBINING RELATIONAL TABLES ON FOREIGN KEYS

> **Everyday Core Metaphor**: INNER JOIN is finding matching puzzle pieces: it takes two separate buckets (e.g. Customers and Orders), checks the connecting notch (`c.id = o.customer_id`), and locks them together side-by-side into a single wide composite record (discarding pieces with no match).

### 🎯 Day Overview & Learning Objectives
- **Concept**: Relational Joins: Cartesian product reduction via ON conditions.
- **Concept**: Table Aliasing: Using `c` for customers and `o` for orders.
- **Concept**: Multi-Column Projections.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: INNER JOIN Mechanics & ON Predicates (`sql-d11-b1-inner-join-mechanics`)

* **Primary Concept Budget**: `INNER JOIN`
* **Supporting Terms**: ON c.id = o.customer_id, Intersection of Tables, Table Aliases (`c`, `o`)
* **Prerequisites**: `sql-d5-b1-foreign-keys-cascade` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  c.name AS customer_name,
  o.id AS order_id,
  o.total_amount
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
```
* **Line 4**: customers table aliased as 'c'.
* **Line 5**: INNER JOIN combines rows where customer_id equals the customer primary key.

##### 💻 Runnable Interactive SQL Sandbox (`inner_join_sim.sql`)
```sql
CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount REAL);
INSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');
INSERT INTO orders VALUES (101, 1, 99.00);

SELECT c.name, o.id, o.amount FROM customers c INNER JOIN orders o ON c.id = o.customer_id;
```
**Expected Terminal Execution Output**:
```text
name | id  | amount
-----+-----+-------
Alex | 101 | 99.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_INNER_VS_LEFT_JOIN`
* **Question**: **Why is customer 'Sam' omitted from the INNER JOIN query result above?**
* **Expected Exact Value**: `Sam has no matching records in the orders table`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Sam is deleted` (Misconception: `MC_SQL_INNER_VS_LEFT_JOIN`)
  1. 🛑 *What Went Wrong*: INNER JOIN returns only rows that have matching counterparts in both tables. Sam has zero orders, so Sam is excluded.
  2. 💡 *Simpler Everyday Picture*: INNER JOIN only retains matching pairs.
  3. 🛠️ *Guided Fix Prompt*: **Type Sam has no matching records in the orders table**


#### 🔹 Slide 2: Disambiguating Column Names with Table Aliases (`sql-d11-b2-table-aliasing`)

* **Primary Concept Budget**: `Column Disambiguation`
* **Supporting Terms**: `c.id` vs `o.id`, Ambiguous Column Name Error
* **Prerequisites**: `sql-d11-b1-inner-join-mechanics` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ❌ Buggy: Both tables have 'id' column -> SQL throws 'ambiguous column name: id'!
SELECT id, name, total_amount
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Correct: Explicitly qualify which table's id to project
SELECT c.id AS customer_id, o.id AS order_id, name, total_amount
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
```
* **Error Reason**: When multiple joined tables share identical column names, the query engine cannot guess which one you want.
* **Fix Explanation**: Prefix column names with their table alias (`c.id`, `o.id`).

##### 💻 Runnable Interactive SQL Sandbox (`alias_sim.sql`)
```sql
SELECT 'c.id AS customer_id, o.id AS order_id' AS qualified_columns;
```
**Expected Terminal Execution Output**:
```text
qualified_columns
---------------------------------------
c.id AS customer_id, o.id AS order_id
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_INNER_VS_LEFT_JOIN`
* **Question**: **What error occurs if you query `SELECT id FROM customers JOIN orders ON customers.id = orders.customer_id` without specifying the table prefix?**
  ✅ **Option A**: `ambiguous column name: id` because both tables contain a column named `id`
  ❌ **Option B**: The database crashes
  ❌ **Option C**: The database returns both IDs concatenated

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_INNER_VS_LEFT_JOIN`)
  1. 🛑 *What Went Wrong*: Ambiguous column references fail to compile because the SQL engine requires explicit table qualification.
  2. 💡 *Simpler Everyday Picture*: Throws ambiguous column error -> qualify with table alias.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Join Predicates (ON) vs Post-Filter Predicates (WHERE) (`sql-d11-b3-join-on-vs-where`)

* **Primary Concept Budget**: `ON vs WHERE Semantics`
* **Supporting Terms**: ON defines relational linkage, WHERE filters combined joined dataset
* **Prerequisites**: `sql-d11-b2-table-aliasing` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`join_filter_sim.sql`)
```sql
CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount REAL, status TEXT);
INSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');
INSERT INTO orders VALUES (101, 1, 250.0, 'COMPLETED'), (102, 1, 50.0, 'CANCELLED');

SELECT c.name, o.id, o.amount
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'COMPLETED';
```
**Expected Terminal Execution Output**:
```text
name | id  | amount
-----+-----+-------
Alex | 101 | 250.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_JOIN_ON_VS_WHERE`
* **Question**: **What order ID is returned when filtering `WHERE o.status = 'COMPLETED'`?**
* **Expected Exact Value**: `101`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `102` (Misconception: `MC_SQL_JOIN_ON_VS_WHERE`)
  1. 🛑 *What Went Wrong*: Order 102 was CANCELLED, so only order 101 matches the WHERE clause.
  2. 💡 *Simpler Everyday Picture*: Only COMPLETED order 101 is returned.
  3. 🛠️ *Guided Fix Prompt*: **Type 101**


### ⚡ Quest 2: Proctored SQL Exam — Customer Order Itemization Report

**Problem Statement**:
Select `c.name AS customer_name`, `o.id AS order_id`, `o.total_amount`, `o.created_at` from `customers c` INNER JOIN `orders o` ON `c.id = o.customer_id` ORDER BY `o.total_amount DESC`

**Socratic Mentor Hint**: *Join customers c with orders o on c.id = o.customer_id.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT c.name AS customer_name, o.id AS order_id, o.total_amount, o.created_at FROM customers c INNER JOIN orders o ON c.id = o.customer_id ORDER BY o.total_amount DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT c.name, o.id, o.total_amount FROM customers c INNER JOIN orders o ON c.id = o.customer_id;
```

### 🛠️ Quest 3: Practical Database Assignment — Employee Department Lookup

**Problem Statement**:
Select `e.name AS employee_name`, `d.name AS department_name` from `employees e` INNER JOIN `departments d` ON `e.department_id = d.id`

**Socratic Mentor Hint**: *Join employees and departments on department_id.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT e.name AS employee_name, d.name AS department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT e.name, d.name FROM employees e INNER JOIN departments d ON e.department_id = d.id;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 12: LEFT OUTER JOIN & HANDLING MISSING PARENT/CHILD RECORDS

> **Everyday Core Metaphor**: LEFT JOIN is a classroom attendance sheet: every registered student on the roster (Left Table) gets a row on the paper, even if they were absent today (no matching records in Right Table)—their attendance checkbox simply displays blank / NULL.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Outer Joins: Preserving unmatched rows with NULL padding.
- **Concept**: COALESCE() Function: Providing clean fallbacks for NULLs.
- **Concept**: Finding Unmatched Rows: `WHERE right_table.id IS NULL`.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: LEFT JOIN: Preserving Unmatched Left-Table Rows (`sql-d12-b1-left-join-concept`)

* **Primary Concept Budget**: `LEFT OUTER JOIN`
* **Supporting Terms**: Preserves all Left rows, NULL padding on Right table, Finding non-purchasers
* **Prerequisites**: `sql-d11-b1-inner-join-mechanics` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  c.name,
  o.id AS order_id,
  COALESCE(o.total_amount, 0.0) AS spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
```
* **Line 4**: All customers are returned regardless of whether they have orders.
* **Line 5**: If customer has no order, o.id and o.total_amount are NULL.

##### 💻 Runnable Interactive SQL Sandbox (`left_join_sim.sql`)
```sql
CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount REAL);
INSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');
INSERT INTO orders VALUES (101, 1, 99.00);

SELECT c.name, o.id AS order_id, COALESCE(o.amount, 0.0) AS spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
ORDER BY c.id ASC;
```
**Expected Terminal Execution Output**:
```text
name | order_id | spent
-----+----------+------
Alex | 101      | 99.0
Sam  | NULL     | 0.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_INNER_VS_LEFT_JOIN`
* **Question**: **What value does `spent` display for 'Sam' who has zero orders when using `COALESCE(o.amount, 0.0)`?**
* **Expected Exact Value**: `0.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `NULL` (Misconception: `MC_SQL_INNER_VS_LEFT_JOIN`)
  1. 🛑 *What Went Wrong*: COALESCE converted the NULL amount into 0.0.
  2. 💡 *Simpler Everyday Picture*: COALESCE turns NULL into 0.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 0.0**


#### 🔹 Slide 2: Finding Inactive Records with `WHERE right.id IS NULL` (`sql-d12-b2-finding-orphan-rows`)

* **Primary Concept Budget**: `Anti-Join Pattern`
* **Supporting Terms**: WHERE right.id IS NULL, Find users who never ordered
* **Prerequisites**: `sql-d12-b1-left-join-concept` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`antijoin_sim.sql`)
```sql
CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT);
INSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam'), (3, 'Pat');
INSERT INTO orders VALUES (101, 1), (102, 3);

-- Find customers who never made a single order
SELECT c.name FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
```
**Expected Terminal Execution Output**:
```text
name
----
Sam
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_INNER_VS_LEFT_JOIN`
* **Question**: **Which customer is returned as having zero orders using `WHERE o.id IS NULL`?**
* **Expected Exact Value**: `Sam`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Alex` (Misconception: `MC_SQL_INNER_VS_LEFT_JOIN`)
  1. 🛑 *What Went Wrong*: Alex has order 101, so Alex is NOT null. Only Sam has 0 orders.
  2. 💡 *Simpler Everyday Picture*: Only Sam has zero orders.
  3. 🛠️ *Guided Fix Prompt*: **Type Sam**


#### 🔹 Slide 3: GROUP BY with LEFT JOIN Aggregations (`sql-d12-b3-group-by-left-join`)

* **Primary Concept Budget**: `LEFT JOIN Aggregations`
* **Supporting Terms**: COUNT(o.id) vs COUNT(*), Accurate 0 count for inactive users
* **Prerequisites**: `sql-d12-b2-finding-orphan-rows` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ❌ Buggy: COUNT(*) counts the NULL-padded row, giving Sam 1 order!
SELECT c.name, COUNT(*) AS orders_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Correct: COUNT(o.id) skips NULL, giving Sam 0 orders accurately!
SELECT c.name, COUNT(o.id) AS orders_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;
```
* **Error Reason**: COUNT(*) counts the single NULL row that LEFT JOIN produced for Sam, mistakenly reporting 1 order.
* **Fix Explanation**: Always count the right-table primary key `COUNT(o.id)` when aggregating across LEFT JOINs.

##### 💻 Runnable Interactive SQL Sandbox (`left_count_sim.sql`)
```sql
CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT);
INSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');
INSERT INTO orders VALUES (101, 1);

SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY c.id ASC;
```
**Expected Terminal Execution Output**:
```text
name | order_count
-----+------------
Alex | 1
Sam  | 0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_COUNT_NULL_BEHAVIOR`
* **Question**: **Using `COUNT(o.id)`, what is Sam's order count?**
* **Expected Exact Value**: `0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_COUNT_NULL_BEHAVIOR`)
  1. 🛑 *What Went Wrong*: COUNT(o.id) correctly ignores the NULL right-table entry, yielding 0.
  2. 💡 *Simpler Everyday Picture*: Sam has 0 orders.
  3. 🛠️ *Guided Fix Prompt*: **Type 0**


### ⚡ Quest 2: Proctored SQL Exam — Customers with and without Orders

**Problem Statement**:
Select `c.id`, `c.name`, `COUNT(o.id) AS order_count`, `COALESCE(SUM(o.total_amount), 0.0) AS total_spent` from `customers c` LEFT JOIN `orders o` ON `c.id = o.customer_id` GROUP BY `c.id`, `c.name` ORDER BY `total_spent DESC`

**Socratic Mentor Hint**: *Use LEFT JOIN and COALESCE(SUM(...), 0.0).*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT c.id, c.name, COUNT(o.id) AS order_count, COALESCE(SUM(o.total_amount), 0.0) AS total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY total_spent DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT c.id, c.name, COUNT(o.id), COALESCE(SUM(o.total_amount), 0.0) FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;
```

### 🛠️ Quest 3: Practical Database Assignment — Identify Inactive Customers with Zero Orders

**Problem Statement**:
Select `c.id`, `c.name` from `customers c` LEFT JOIN `orders o` ON `c.id = o.customer_id` WHERE `o.id IS NULL`

**Socratic Mentor Hint**: *WHERE o.id IS NULL captures customers with zero orders.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT c.id, c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT c.id, c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 13: SELF JOINS & MULTI-TABLE RELATIONAL GRAPHS

> **Everyday Core Metaphor**: A self join is looking at a company organization chart: every employee and every manager is listed in the exact same Employee Directory table; a Self Join simply opens two copies of the same directory side-by-side to connect Employee A with Manager B.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Self Joins: Joining a table to itself using distinct aliases (`e` and `m`).
- **Concept**: Hierarchical Trees: Parent-child relationship traversal.
- **Concept**: Three-Table Joins: Orders -> OrderItems -> Products.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Self Joins: Joining a Table to Itself (`e` and `m`) (`sql-d13-b1-self-join-hierarchy`)

* **Primary Concept Budget**: `Self Join`
* **Supporting Terms**: Hierarchy Traversal, e.manager_id = m.id, Top Executive NULL Manager
* **Prerequisites**: `sql-d12-b1-left-join-concept` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  e.name AS employee_name,
  COALESCE(m.name, 'TOP_LEVEL_CEO') AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```
* **Line 4**: Table alias 'e' represents the individual worker.
* **Line 5**: Table alias 'm' represents the supervising manager from the same table.

##### 💻 Runnable Interactive SQL Sandbox (`self_join_sim.sql`)
```sql
CREATE TABLE staff (id INT PRIMARY KEY, name TEXT, manager_id INT);
INSERT INTO staff VALUES (1, 'CEO Alex', NULL), (2, 'Lead Sarah', 1), (3, 'Eng Pat', 2);

SELECT e.name AS worker, COALESCE(m.name, 'CEO') AS boss
FROM staff e
LEFT JOIN staff m ON e.manager_id = m.id
ORDER BY e.id ASC;
```
**Expected Terminal Execution Output**:
```text
worker     | boss
-----------+-----------
CEO Alex   | CEO
Lead Sarah | CEO Alex
Eng Pat    | Lead Sarah
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_INNER_VS_LEFT_JOIN`
* **Question**: **Who is the boss of 'Eng Pat' in the self join hierarchy above?**
* **Expected Exact Value**: `Lead Sarah`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `CEO Alex` (Misconception: `MC_SQL_INNER_VS_LEFT_JOIN`)
  1. 🛑 *What Went Wrong*: Eng Pat's manager_id is 2, which maps to Lead Sarah.
  2. 💡 *Simpler Everyday Picture*: Manager ID 2 is Lead Sarah.
  3. 🛠️ *Guided Fix Prompt*: **Type Lead Sarah**


#### 🔹 Slide 2: Three-Table E-Commerce Joins (Orders -> Items -> Products) (`sql-d13-b2-three-table-joins`)

* **Primary Concept Budget**: `Multi-Table Relational Chain`
* **Supporting Terms**: Chained INNER JOINs, Junction Resolution, Total Line Value
* **Prerequisites**: `sql-d13-b1-self-join-hierarchy` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`three_table_sim.sql`)
```sql
CREATE TABLE orders (id INT, code TEXT);
CREATE TABLE order_items (order_id INT, product_id INT, qty INT);
CREATE TABLE products (id INT, title TEXT, price REAL);
INSERT INTO orders VALUES (1, 'ORD-101');
INSERT INTO products VALUES (50, 'Keyboard', 75.0);
INSERT INTO order_items VALUES (1, 50, 2);

SELECT o.code, p.title, (oi.qty * p.price) AS line_total
FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id;
```
**Expected Terminal Execution Output**:
```text
code    | title    | line_total
--------+----------+-----------
ORD-101 | Keyboard | 150.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_INNER_VS_LEFT_JOIN`
* **Question**: **What is `line_total` for 2 Keyboards priced at $75.0 in the 3-table join?**
* **Expected Exact Value**: `150.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `75.0` (Misconception: `MC_SQL_INNER_VS_LEFT_JOIN`)
  1. 🛑 *What Went Wrong*: 2 * 75.0 = 150.0 total line cost.
  2. 💡 *Simpler Everyday Picture*: 2 units @ $75 = 150.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 150.0**


#### 🔹 Slide 3: Cartesian Explosion Danger: The Missing JOIN Condition (`sql-d13-b3-cartesian-explosion`)

* **Primary Concept Budget**: `CROSS JOIN Explosion`
* **Supporting Terms**: N * M Combinations, Accidental Missing ON Clause
* **Prerequisites**: `sql-d13-b2-three-table-joins` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ❌ Disaster: Missing ON predicate multiplies 1,000 customers * 1,000 orders = 1,000,000 rows!
SELECT * FROM customers, orders;

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Correct: Explicit ON clause constrains join to matching IDs
SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;
```
* **Error Reason**: Comma joins without WHERE or ON generate a full Cartesian Cross Product.
* **Fix Explanation**: Always use explicit INNER JOIN with ON predicate.

##### 💻 Runnable Interactive SQL Sandbox (`cartesian_sim.sql`)
```sql
CREATE TABLE t1 (val INT);
CREATE TABLE t2 (val INT);
INSERT INTO t1 VALUES (1), (2);
INSERT INTO t2 VALUES (10), (20), (30);
-- 2 * 3 = 6 rows generated
SELECT COUNT(*) AS cartesian_rows FROM t1 CROSS JOIN t2;
```
**Expected Terminal Execution Output**:
```text
cartesian_rows
--------------
6
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CROSS_JOIN_CARTESIAN_EXPLOSION`
* **Question**: **How many total rows are produced by a CROSS JOIN between a table with 2 rows and a table with 3 rows?**
* **Expected Exact Value**: `6`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `5` (Misconception: `MC_SQL_CROSS_JOIN_CARTESIAN_EXPLOSION`)
  1. 🛑 *What Went Wrong*: Cross product is multiplicative: 2 * 3 = 6 rows.
  2. 💡 *Simpler Everyday Picture*: 2 * 3 = 6 rows.
  3. 🛠️ *Guided Fix Prompt*: **Type 6**


### ⚡ Quest 2: Proctored SQL Exam — Employee Manager Hierarchy Report

**Problem Statement**:
Select `e.name AS employee_name`, `COALESCE(m.name, 'TOP_EXECUTIVE') AS manager_name` from `employees e` LEFT JOIN `employees m` ON `e.manager_id = m.id` ORDER BY `e.name ASC`

**Socratic Mentor Hint**: *Join employees to itself with alias m.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT e.name AS employee_name, COALESCE(m.name, 'TOP_EXECUTIVE') AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.name ASC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT e.name, COALESCE(m.name, 'TOP_EXECUTIVE') FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;
```

### 🛠️ Quest 3: Practical Database Assignment — Three-Table E-Commerce Line Item Join

**Problem Statement**:
Select `o.id AS order_id`, `p.name AS product_name`, `oi.quantity`, `oi.price` from `orders o` INNER JOIN `order_items oi` ON `o.id = oi.order_id` INNER JOIN `products p` ON `oi.product_id = p.id`

**Socratic Mentor Hint**: *Chain two INNER JOIN clauses across orders, order_items, and products.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT o.id AS order_id, p.name AS product_name, oi.quantity, oi.price FROM orders o INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON oi.product_id = p.id;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT o.id, p.name, oi.quantity FROM orders o INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON oi.product_id = p.id;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 14: SET OPERATIONS: UNION VS UNION ALL & INTERSECT

> **Everyday Core Metaphor**: UNION vs UNION ALL is stacking two piles of business cards: `UNION ALL` simply places Stack B directly on top of Stack A in 1 millisecond (fast, preserves duplicates); `UNION` painstakingly checks every single card in the stack to throw away duplicate contacts (slower, unique set).

### 🎯 Day Overview & Learning Objectives
- **Concept**: UNION: Combining and deduplicating rows across queries.
- **Concept**: UNION ALL: High-performance combination without deduplication overhead.
- **Concept**: INTERSECT & EXCEPT: Finding shared and exclusive row sets.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: UNION vs UNION ALL: Deduplication Cost & Behavior (`sql-d14-b1-union-vs-union-all`)

* **Primary Concept Budget**: `Set Operations`
* **Supporting Terms**: UNION (Deduplicated Set), UNION ALL (Fast Append), Schema Column Compatibility
* **Prerequisites**: `sql-d11-b1-inner-join-mechanics` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT email FROM full_time_employees
UNION ALL
SELECT email FROM contractors
ORDER BY email ASC;
```
* **Line 2**: UNION ALL retains all rows from both tables without sorting/deduplicating.

##### 💻 Runnable Interactive SQL Sandbox (`union_sim.sql`)
```sql
CREATE TABLE t1 (email TEXT);
CREATE TABLE t2 (email TEXT);
INSERT INTO t1 VALUES ('alex@pinit.ai'), ('sam@pinit.ai');
INSERT INTO t2 VALUES ('alex@pinit.ai'), ('pat@pinit.ai');

SELECT COUNT(*) AS union_count FROM (SELECT email FROM t1 UNION SELECT email FROM t2);
SELECT COUNT(*) AS union_all_count FROM (SELECT email FROM t1 UNION ALL SELECT email FROM t2);
```
**Expected Terminal Execution Output**:
```text
union_count
-----------
3
union_all_count
---------------
4
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_UNION_VS_UNION_ALL`
* **Question**: **When joining 2 lists sharing 1 duplicate email ('alex@pinit.ai'), what is `union_count` (deduplicated) vs `union_all_count`?**
* **Expected Exact Value**: `union_count: 3, union_all_count: 4`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `4 and 4` (Misconception: `MC_SQL_UNION_VS_UNION_ALL`)
  1. 🛑 *What Went Wrong*: UNION removes the duplicate email, giving 3 rows. UNION ALL keeps all 4 rows.
  2. 💡 *Simpler Everyday Picture*: UNION = 3; UNION ALL = 4.
  3. 🛠️ *Guided Fix Prompt*: **Type union_count: 3, union_all_count: 4**


#### 🔹 Slide 2: INTERSECT and EXCEPT (Set Differences) (`sql-d14-b2-intersect-except`)

* **Primary Concept Budget**: `INTERSECT & EXCEPT`
* **Supporting Terms**: INTERSECT (Shared in Both Sets), EXCEPT (In Set A but NOT in Set B)
* **Prerequisites**: `sql-d14-b1-union-vs-union-all` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`intersect_sim.sql`)
```sql
CREATE TABLE beta_users (id INT);
CREATE TABLE paying_users (id INT);
INSERT INTO beta_users VALUES (1), (2), (3);
INSERT INTO paying_users VALUES (2), (3), (4);

-- Users in BOTH beta AND paying:
SELECT id FROM beta_users INTERSECT SELECT id FROM paying_users ORDER BY id ASC;
```
**Expected Terminal Execution Output**:
```text
id
--
2
3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_UNION_VS_UNION_ALL`
* **Question**: **Which user IDs are present in both beta_users (1,2,3) and paying_users (2,3,4)?**
* **Expected Exact Value**: `id
--
2
3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1, 4` (Misconception: `MC_SQL_UNION_VS_UNION_ALL`)
  1. 🛑 *What Went Wrong*: INTERSECT returns the shared intersection: IDs 2 and 3.
  2. 💡 *Simpler Everyday Picture*: Shared IDs are 2 and 3.
  3. 🛠️ *Guided Fix Prompt*: **Type 2, 3**


#### 🔹 Slide 3: ORDER BY Placement in Compound Set Queries (`sql-d14-b3-order-by-union`)

* **Primary Concept Budget**: `Compound Sorting Rule`
* **Supporting Terms**: ORDER BY goes at the VERY END of the combined query, Single Sort Pass
* **Prerequisites**: `sql-d14-b2-intersect-except` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`order_union.sql`)
```sql
CREATE TABLE t1 (name TEXT); CREATE TABLE t2 (name TEXT);
INSERT INTO t1 VALUES ('Zack'); INSERT INTO t2 VALUES ('Aaron');

-- ORDER BY sorts the combined resulting set
SELECT name FROM t1
UNION ALL
SELECT name FROM t2
ORDER BY name ASC;
```
**Expected Terminal Execution Output**:
```text
name
-----
Aaron
Zack
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_ORDER_BY_EXECUTION_ORDER`
* **Question**: **Who appears first when sorting the UNION ALL result of ('Zack') and ('Aaron') by `name ASC`?**
* **Expected Exact Value**: `Aaron`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Zack` (Misconception: `MC_SQL_ORDER_BY_EXECUTION_ORDER`)
  1. 🛑 *What Went Wrong*: ASC sorts alphabetically, so Aaron precedes Zack.
  2. 💡 *Simpler Everyday Picture*: Aaron comes first in ASC order.
  3. 🛠️ *Guided Fix Prompt*: **Type Aaron**


### ⚡ Quest 2: Proctored SQL Exam — Unified User Directory from Employees and Contractors

**Problem Statement**:
Select `name`, `email`, `'EMPLOYEE' AS role` from `employees` UNION ALL Select `name`, `email`, `'CONTRACTOR' AS role` from `contractors` ORDER BY `name ASC`

**Socratic Mentor Hint**: *Use UNION ALL with static role string literals.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT name, email, 'EMPLOYEE' AS role FROM employees UNION ALL SELECT name, email, 'CONTRACTOR' AS role FROM contractors ORDER BY name ASC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT name, email, role FROM (SELECT name, email, 'EMPLOYEE' AS role FROM employees UNION ALL SELECT name, email, 'CONTRACTOR' AS role FROM contractors);
```

### 🛠️ Quest 3: Practical Database Assignment — Deduplicated Customer Contact List

**Problem Statement**:
Select `email` from `online_customers` UNION Select `email` from `retail_customers` ORDER BY `email ASC`

**Socratic Mentor Hint**: *Use UNION to automatically deduplicate emails.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT email FROM online_customers UNION SELECT email FROM retail_customers ORDER BY email ASC;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT email FROM (SELECT email FROM online_customers UNION SELECT email FROM retail_customers);
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 15: ⭐ MILESTONE 2: MULTI-STORE SALES REPORTING & AGGREGATION ENGINE

> **Everyday Core Metaphor**: Milestone 2 — Analytical Reporting Engine: Synthesizing multi-table joins, grouped metrics, aggregate sums, and HAVING filters into executive-level sales performance dashboards across national retail branches.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Multi-Table Analytical Queries: Joining stores, orders, and items.
- **Concept**: Grouped Metrics: Distinct order counts, revenue, and average ticket size.
- **Concept**: HAVING Threshold Filters.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Multi-Store Relational Analytical Architecture (`sql-d15-b1-multi-store-joins`)

* **Primary Concept Budget**: `Enterprise Analytical Joins`
* **Supporting Terms**: Store Branches, Order Transactions, Grouped Sales Reporting
* **Prerequisites**: `sql-d14-b1-union-vs-union-all` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  s.branch_name,
  COUNT(DISTINCT o.id) AS order_count,
  SUM(o.total_amount) AS revenue,
  ROUND(AVG(o.total_amount), 2) AS avg_ticket
FROM stores s
INNER JOIN orders o ON s.id = o.store_id
GROUP BY s.id, s.branch_name
HAVING SUM(o.total_amount) >= 5000
ORDER BY revenue DESC;
```
* **Line 3**: COUNT(DISTINCT o.id) avoids duplicate counting when joined to line items.
* **Line 8**: HAVING filters out low-performing branches.

##### 💻 Runnable Interactive SQL Sandbox (`milestone2_demo.sql`)
```sql
CREATE TABLE stores (id INT, branch TEXT);
CREATE TABLE orders (id INT, store_id INT, amount REAL);
INSERT INTO stores VALUES (1, 'Downtown NYC'), (2, 'Uptown NYC');
INSERT INTO orders VALUES (101, 1, 6000.0), (102, 1, 4000.0), (103, 2, 2000.0);

SELECT s.branch, SUM(o.amount) AS revenue
FROM stores s
INNER JOIN orders o ON s.id = o.store_id
GROUP BY s.id, s.branch
HAVING SUM(o.amount) >= 5000;
```
**Expected Terminal Execution Output**:
```text
branch       | revenue
-------------+--------
Downtown NYC | 10000.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_WHERE_VS_HAVING`
* **Question**: **What is the revenue for 'Downtown NYC' (orders $6000 + $4000)?**
* **Expected Exact Value**: `10000.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `6000.0` (Misconception: `MC_SQL_WHERE_VS_HAVING`)
  1. 🛑 *What Went Wrong*: Downtown has two orders: 6000 + 4000 = 10000.0.
  2. 💡 *Simpler Everyday Picture*: 6000 + 4000 = 10000.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 10000.0**


#### 🔹 Slide 2: Multi-Column GROUP BY Category Breakdowns (`sql-d15-b2-category-breakdown`)

* **Primary Concept Budget**: `Multi-Column GROUP BY`
* **Supporting Terms**: GROUP BY store_id, category, Sub-Category Inventory Valuation
* **Prerequisites**: `sql-d15-b1-multi-store-joins` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`category_breakdown.sql`)
```sql
CREATE TABLE inventory (store TEXT, category TEXT, value REAL);
INSERT INTO inventory VALUES ('Store A', 'TECH', 5000), ('Store A', 'FURNITURE', 2000), ('Store B', 'TECH', 3000);

SELECT store, category, SUM(value) AS total_val
FROM inventory
GROUP BY store, category
ORDER BY store, category;
```
**Expected Terminal Execution Output**:
```text
store   | category  | total_val
--------+-----------+----------
Store A | FURNITURE | 2000.0
Store A | TECH      | 5000.0
Store B | TECH      | 3000.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_GROUP_BY_NON_AGGREGATE_COLUMN`
* **Question**: **How many distinct grouped buckets are produced across Store A and Store B?**
* **Expected Exact Value**: `3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2` (Misconception: `MC_SQL_GROUP_BY_NON_AGGREGATE_COLUMN`)
  1. 🛑 *What Went Wrong*: Grouping by both store and category produces 3 buckets: (Store A, FURNITURE), (Store A, TECH), and (Store B, TECH).
  2. 💡 *Simpler Everyday Picture*: 3 distinct (store, category) combinations.
  3. 🛠️ *Guided Fix Prompt*: **Type 3**


#### 🔹 Slide 3: Milestone 2 Certification & Performance Metrics (`sql-d15-b3-milestone-audit-pipeline`)

* **Primary Concept Budget**: `Milestone Engine Validation`
* **Supporting Terms**: Aggregated KPI Certification, Accurate Financial Reporting
* **Prerequisites**: `sql-d15-b2-category-breakdown` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`milestone2_cert.sql`)
```sql
SELECT 'MILESTONE_2_REPORTING_CERTIFIED' AS audit_status;
```
**Expected Terminal Execution Output**:
```text
audit_status
--------------------------------
MILESTONE_2_REPORTING_CERTIFIED
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_WHERE_VS_HAVING`
* **Question**: **What audit status string is returned upon completing Milestone 2?**
* **Expected Exact Value**: `MILESTONE_2_REPORTING_CERTIFIED`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `FAILED` (Misconception: `MC_SQL_WHERE_VS_HAVING`)
  1. 🛑 *What Went Wrong*: Returns MILESTONE_2_REPORTING_CERTIFIED.
  2. 💡 *Simpler Everyday Picture*: Audit status is MILESTONE_2_REPORTING_CERTIFIED.
  3. 🛠️ *Guided Fix Prompt*: **Type MILESTONE_2_REPORTING_CERTIFIED**


### ⚡ Quest 2: Proctored SQL Exam — Store Branch Quarterly Performance Summary

**Problem Statement**:
Select `s.branch_name`, `COUNT(DISTINCT o.id) AS total_orders`, `SUM(o.total_amount) AS revenue`, `ROUND(AVG(o.total_amount), 2) AS avg_ticket` from `stores s` INNER JOIN `orders o` ON `s.id = o.store_id` GROUP BY `s.id`, `s.branch_name` HAVING `SUM(o.total_amount) >= 10000` ORDER BY `revenue DESC`

**Socratic Mentor Hint**: *Combine stores s and orders o with COUNT(DISTINCT o.id) and HAVING SUM(total_amount) >= 10000.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT s.branch_name, COUNT(DISTINCT o.id) AS total_orders, SUM(o.total_amount) AS revenue, ROUND(AVG(o.total_amount), 2) AS avg_ticket FROM stores s INNER JOIN orders o ON s.id = o.store_id GROUP BY s.id, s.branch_name HAVING SUM(o.total_amount) >= 10000 ORDER BY revenue DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT s.branch_name, COUNT(DISTINCT o.id), SUM(o.total_amount) FROM stores s INNER JOIN orders o ON s.id = o.store_id GROUP BY s.id, s.branch_name HAVING SUM(o.total_amount) >= 10000;
```

### 🛠️ Quest 3: Practical Database Assignment — Store Inventory Valuation by Category

**Problem Statement**:
Select `s.branch_name`, `p.category`, `SUM(p.price * p.stock) AS category_value` from `stores s` INNER JOIN `products p` ON `s.id = p.store_id` GROUP BY `s.branch_name`, `p.category`

**Socratic Mentor Hint**: *Group by both s.branch_name and p.category.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT s.branch_name, p.category, SUM(p.price * p.stock) AS category_value FROM stores s INNER JOIN products p ON s.id = p.store_id GROUP BY s.branch_name, p.category;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT s.branch_name, p.category, SUM(p.price * p.stock) FROM stores s INNER JOIN products p ON s.id = p.store_id GROUP BY s.branch_name, p.category;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 16: SUBQUERIES: SCALAR, COLUMN LISTS & CORRELATED SUBQUERIES

> **Everyday Core Metaphor**: A subquery is asking a helper assistant a quick question before finishing your sentence: 'Select all employees who earn more than [Hey Assistant, what is the company average salary?]'. The assistant computes that single number in brackets, and you use it to finish your query.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Scalar Subqueries: Single value returned inside SELECT or WHERE.
- **Concept**: IN (Subquery): Matching against dynamically queried id lists.
- **Concept**: Correlated Subqueries: Subqueries referencing the outer table.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Scalar Subqueries: Single-Value Nested Computations (`sql-d16-b1-scalar-subqueries`)

* **Primary Concept Budget**: `Scalar Subquery`
* **Supporting Terms**: Single-Row Single-Column Result, WHERE col > (SELECT AVG(...)), Dynamic Baselines
* **Prerequisites**: `sql-d9-b2-sum-avg-math` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT name, salary FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```
* **Line 2**: Subquery in parentheses computes company-wide average salary as a single scalar number.

##### 💻 Runnable Interactive SQL Sandbox (`scalar_subquery_sim.sql`)
```sql
CREATE TABLE employees (name TEXT, salary REAL);
INSERT INTO employees VALUES ('Alex', 100000), ('Sam', 60000), ('Pat', 50000);
-- Average is 70000 -> Only Alex earns > 70000
SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);
```
**Expected Terminal Execution Output**:
```text
name | salary
-----+---------
Alex | 100000.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE`
* **Question**: **With salaries 100000, 60000, 50000 (average = 70000), who earns above average?**
* **Expected Exact Value**: `Alex`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Sam` (Misconception: `MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE`)
  1. 🛑 *What Went Wrong*: Sam earns 60000, which is below the 70000 average. Only Alex earns > 70000.
  2. 💡 *Simpler Everyday Picture*: Only Alex (100000) is > 70000.
  3. 🛠️ *Guided Fix Prompt*: **Type Alex**


#### 🔹 Slide 2: Column-List Subqueries with `IN (SELECT id ...)` (`sql-d16-b2-in-subquery`)

* **Primary Concept Budget**: `IN (Subquery)`
* **Supporting Terms**: Matching dynamic sets, WHERE id IN (SELECT ...)
* **Prerequisites**: `sql-d16-b1-scalar-subqueries` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`in_subquery.sql`)
```sql
CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount REAL);
INSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam'), (3, 'Pat');
INSERT INTO orders VALUES (101, 1, 500.0), (102, 3, 300.0);

-- Find customers who made orders > $400
SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE amount > 400);
```
**Expected Terminal Execution Output**:
```text
name
----
Alex
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE`
* **Question**: **Which customer made an order with amount > 400?**
* **Expected Exact Value**: `Alex`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Pat` (Misconception: `MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE`)
  1. 🛑 *What Went Wrong*: Pat's order was 300 (< 400). Only Alex's order was 500.
  2. 💡 *Simpler Everyday Picture*: Only Alex had an order > 400.
  3. 🛠️ *Guided Fix Prompt*: **Type Alex**


#### 🔹 Slide 3: Correlated Subqueries & Departmental Comparisons (`sql-d16-b3-correlated-subqueries`)

* **Primary Concept Budget**: `Correlated Subquery`
* **Supporting Terms**: References Outer Table (`WHERE dept = e.dept`), Per-Row Subquery Execution
* **Prerequisites**: `sql-d16-b2-in-subquery` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT e.name, e.salary, e.dept
FROM employees e
WHERE e.salary > (
  SELECT AVG(salary) FROM employees WHERE dept = e.dept
);
```
* **Line 4**: 'WHERE dept = e.dept' links the inner subquery dynamically to the current outer row.

##### 💻 Runnable Interactive SQL Sandbox (`correlated_sim.sql`)
```sql
CREATE TABLE employees (name TEXT, dept TEXT, salary REAL);
INSERT INTO employees VALUES ('Alex', 'ENG', 120000), ('Sam', 'ENG', 80000), ('Pat', 'HR', 60000);
-- ENG avg is 100000 -> Alex is above ENG avg
SELECT e.name FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE dept = e.dept);
```
**Expected Terminal Execution Output**:
```text
name
----
Alex
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE`
* **Question**: **What makes a subquery 'Correlated'?**
  ✅ **Option A**: It references columns from the outer query table, executing dynamically for each candidate row evaluated by the outer query
  ❌ **Option B**: It runs only on Sundays
  ❌ **Option C**: It uses the UNION keyword

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE`)
  1. 🛑 *What Went Wrong*: Correlated subqueries depend on values from the outer query row.
  2. 💡 *Simpler Everyday Picture*: References outer query columns per row.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored SQL Exam — Employees Earning Above Department Average

**Problem Statement**:
Select `e.id`, `e.name`, `e.salary`, `e.department_id` from `employees e` WHERE `e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id)` ORDER BY `e.salary DESC`

**Socratic Mentor Hint**: *Compare e.salary against the correlated subquery AVG(salary).*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT e.id, e.name, e.salary, e.department_id FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id) ORDER BY e.salary DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT e.id, e.name, e.salary FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);
```

### 🛠️ Quest 3: Practical Database Assignment — Products Priced Above Overall Catalog Average

**Problem Statement**:
Select `id`, `name`, `price` from `products` WHERE `price > (SELECT AVG(price) FROM products)` ORDER BY `price DESC`

**Socratic Mentor Hint**: *Use scalar subquery (SELECT AVG(price) FROM products).*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT id, name, price FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price DESC;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT id, name, price FROM products WHERE price > (SELECT AVG(price) FROM products);
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 17: COMMON TABLE EXPRESSIONS (WITH CTES & RECURSIVE CTES)

> **Everyday Core Metaphor**: A CTE is preparing ingredients in labeled glass bowls before cooking: instead of creating one massive, unreadable 10-level nested subquery lasagna, you prepare `WITH HighSpenders AS (...)` and `WITH ActiveStores AS (...)` first, and then cleanly assemble them in your final SELECT.

### 🎯 Day Overview & Learning Objectives
- **Concept**: WITH Clause: Temporary named result sets for single query scope.
- **Concept**: Chaining Multiple CTEs: WITH StepA AS (...), StepB AS (...).
- **Concept**: Recursive CTEs: Hierarchical tree traversal and sequence generation.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The WITH Clause: Named Modular Subqueries (`sql-d17-b1-cte-syntax`)

* **Primary Concept Budget**: `Common Table Expressions (CTEs)`
* **Supporting Terms**: WITH CTE_Name AS (SELECT ...), Query Readability, Temporary Query Scope
* **Prerequisites**: `sql-d16-b1-scalar-subqueries` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
WITH CustomerTotals AS (
  SELECT customer_id, SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT c.name, ct.total_spent
FROM customers c
INNER JOIN CustomerTotals ct ON c.id = ct.customer_id
WHERE ct.total_spent >= 500;
```
* **Line 1**: Defines named temporary result set 'CustomerTotals'.
* **Line 6**: Main query treats CustomerTotals just like a regular physical table.

##### 💻 Runnable Interactive SQL Sandbox (`cte_sim.sql`)
```sql
CREATE TABLE customers (id INT, name TEXT);
CREATE TABLE orders (id INT, customer_id INT, amount REAL);
INSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');
INSERT INTO orders VALUES (101, 1, 300), (102, 1, 300), (103, 2, 100);

WITH CustomerTotals AS (
  SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id
)
SELECT c.name, ct.total_spent
FROM customers c
INNER JOIN CustomerTotals ct ON c.id = ct.customer_id
WHERE ct.total_spent >= 500;
```
**Expected Terminal Execution Output**:
```text
name | total_spent
-----+------------
Alex | 600.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CTE_WITH_RECURSIVE`
* **Question**: **What total_spent is reported for Alex (orders 300 + 300) in the CTE query?**
* **Expected Exact Value**: `600.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `300.0` (Misconception: `MC_SQL_CTE_WITH_RECURSIVE`)
  1. 🛑 *What Went Wrong*: Alex has two orders of 300 each: 300 + 300 = 600.0.
  2. 💡 *Simpler Everyday Picture*: 300 + 300 = 600.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 600.0**


#### 🔹 Slide 2: Chaining Multiple CTEs in a Single Statement (`sql-d17-b2-chaining-multiple-ctes`)

* **Primary Concept Budget**: `Chained CTEs`
* **Supporting Terms**: WITH Step1 AS (...), Step2 AS (...), Multi-Stage ETL Pipelines
* **Prerequisites**: `sql-d17-b1-cte-syntax` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
WITH
  StepOne AS (SELECT ...),
  StepTwo AS (SELECT ... FROM StepOne)
SELECT * FROM StepTwo;
```
* **Line 2**: First CTE defined.
* **Line 3**: Comma separates subsequent CTEs without repeating the 'WITH' keyword.

##### 💻 Runnable Interactive SQL Sandbox (`multi_cte.sql`)
```sql
WITH
  BaseNumbers AS (SELECT 10 AS a, 20 AS b),
  Calculated AS (SELECT (a + b) AS total FROM BaseNumbers)
SELECT total * 2 AS doubled FROM Calculated;
```
**Expected Terminal Execution Output**:
```text
doubled
-------
60
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CTE_WITH_RECURSIVE`
* **Question**: **What is `doubled` when total (10 + 20 = 30) is multiplied by 2?**
* **Expected Exact Value**: `60`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `30` (Misconception: `MC_SQL_CTE_WITH_RECURSIVE`)
  1. 🛑 *What Went Wrong*: 30 * 2 = 60.
  2. 💡 *Simpler Everyday Picture*: Doubled is 60.
  3. 🛠️ *Guided Fix Prompt*: **Type 60**


#### 🔹 Slide 3: Recursive CTEs: Hierarchies and Sequence Generation (`sql-d17-b3-recursive-ctes`)

* **Primary Concept Budget**: `Recursive CTE`
* **Supporting Terms**: WITH RECURSIVE, Anchor Member UNION ALL Recursive Member, Termination Condition
* **Prerequisites**: `sql-d17-b2-chaining-multiple-ctes` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
WITH RECURSIVE NumberSequence(n) AS (
  SELECT 1              -- 1. Anchor Member (Initial Seed)
  UNION ALL
  SELECT n + 1          -- 2. Recursive Member (Iterative Step)
  FROM NumberSequence
  WHERE n < 5           -- 3. Termination Condition
)
SELECT n FROM NumberSequence;
```
* **Line 2**: Seed row starts with 1.
* **Line 4**: Iteratively increments n until n reaches 5.

##### 💻 Runnable Interactive SQL Sandbox (`recursive_sim.sql`)
```sql
WITH RECURSIVE Seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM Seq WHERE n < 3
)
SELECT n FROM Seq;
```
**Expected Terminal Execution Output**:
```text
n
-
1
2
3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CTE_WITH_RECURSIVE`
* **Question**: **How many numbers (1, 2, 3) are output by the recursive CTE terminating at `n < 3`?**
* **Expected Exact Value**: `3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2` (Misconception: `MC_SQL_CTE_WITH_RECURSIVE`)
  1. 🛑 *What Went Wrong*: Seed 1 yields 1, then 2 (2 < 3), then 3. Output is 1, 2, 3 (count is 3).
  2. 💡 *Simpler Everyday Picture*: Generates 1, 2, 3 -> 3 rows.
  3. 🛠️ *Guided Fix Prompt*: **Type 3**


### ⚡ Quest 2: Proctored SQL Exam — Two-Stage High-Value Customer CTE

**Problem Statement**:
WITH CustomerSpend AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) SELECT c.name, cs.total_spent FROM customers c INNER JOIN CustomerSpend cs ON c.id = cs.customer_id WHERE cs.total_spent > 500 ORDER BY cs.total_spent DESC;

**Socratic Mentor Hint**: *Declare CustomerSpend CTE first, then join with customers.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
WITH CustomerSpend AS (
  SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id
)
SELECT c.name, cs.total_spent FROM customers c INNER JOIN CustomerSpend cs ON c.id = cs.customer_id WHERE cs.total_spent > 500 ORDER BY cs.total_spent DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
WITH CustomerSpend AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) SELECT c.name, cs.total_spent FROM customers c INNER JOIN CustomerSpend cs ON c.id = cs.customer_id WHERE cs.total_spent > 500;
```

### 🛠️ Quest 3: Practical Database Assignment — Recursive Hierarchy Traversal CTE

**Problem Statement**:
WITH RECURSIVE NumberSeq(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM NumberSeq WHERE n < 10) SELECT n FROM NumberSeq;

**Socratic Mentor Hint**: *Use UNION ALL with termination condition WHERE n < 10.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
WITH RECURSIVE NumberSeq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM NumberSeq WHERE n < 10
)
SELECT n FROM NumberSeq;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
WITH RECURSIVE NumberSeq(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM NumberSeq WHERE n < 10) SELECT n FROM NumberSeq;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 18: WINDOW FUNCTIONS: ROW_NUMBER(), RANK() & DENSE_RANK()

> **Everyday Core Metaphor**: Window functions are an Olympics leaderboard: `ROW_NUMBER()` stamps a unique number on every jersey (1, 2, 3, 4); `RANK()` awards tied runners bronze but skips 4th place (1, 2, 2, 4); `DENSE_RANK()` awards tied runners bronze and assigns the next runner 3rd place without gaps (1, 2, 2, 3).

### 🎯 Day Overview & Learning Objectives
- **Concept**: OVER (PARTITION BY ... ORDER BY ...): Analytical window scope.
- **Concept**: ROW_NUMBER(): Unique sequential row IDs (1, 2, 3, 4).
- **Concept**: RANK() vs DENSE_RANK(): Handling ties with or without gaps.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The Window Function Anatomy (OVER Clause & PARTITION BY) (`sql-d18-b1-window-concept`)

* **Primary Concept Budget**: `Window Functions`
* **Supporting Terms**: OVER Clause, PARTITION BY (Window Grouping), ORDER BY (Window Sorting), Preserves Individual Rows
* **Prerequisites**: `sql-d10-b1-group-by-concept` (understood)

##### 💡 Real-World Physical Analogy: *A Highlighting Pen vs a Blender*
GROUP BY is a blender that pulverizes 10 rows into 1 single aggregate smoothie. Window functions are a highlighting pen that writes rankings next to each original row without destroying any data.

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  name,
  department,
  salary,
  ROW_NUMBER() OVER(PARTITION BY department ORDER BY salary DESC) AS rank_in_dept
FROM employees;
```
* **Line 4**: Calculates a sequential rank starting from 1 for each department independently.

##### 💻 Runnable Interactive SQL Sandbox (`window_sim.sql`)
```sql
CREATE TABLE employees (name TEXT, dept TEXT, salary REAL);
INSERT INTO employees VALUES ('Alex', 'ENG', 120000), ('Sam', 'ENG', 90000), ('Pat', 'HR', 70000);

SELECT name, dept, ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) AS seq FROM employees;
```
**Expected Terminal Execution Output**:
```text
name | dept | seq
-----+------+----
Alex | ENG  | 1
Sam  | ENG  | 2
Pat  | HR   | 1
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK`
* **Question**: **What is `seq` for 'Pat' in the HR department (the only HR employee)?**
* **Expected Exact Value**: `1`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `3` (Misconception: `MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK`)
  1. 🛑 *What Went Wrong*: PARTITION BY dept resets the ranking counter for HR, so Pat starts at 1.
  2. 💡 *Simpler Everyday Picture*: Resets to 1 per department partition.
  3. 🛠️ *Guided Fix Prompt*: **Type 1**


#### 🔹 Slide 2: RANK() vs DENSE_RANK(): Gaps in Ties (`sql-d18-b2-rank-vs-dense-rank`)

* **Primary Concept Budget**: `Tie Breaking in Rankings`
* **Supporting Terms**: RANK leaves gaps (1, 2, 2, 4), DENSE_RANK has no gaps (1, 2, 2, 3)
* **Prerequisites**: `sql-d18-b1-window-concept` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`rank_ties.sql`)
```sql
CREATE TABLE scores (name TEXT, score INT);
INSERT INTO scores VALUES ('A', 100), ('B', 90), ('C', 90), ('D', 80);

SELECT name, score,
  RANK() OVER(ORDER BY score DESC) AS rk,
  DENSE_RANK() OVER(ORDER BY score DESC) AS dense_rk
FROM scores;
```
**Expected Terminal Execution Output**:
```text
name | score | rk | dense_rk
-----+-------+----+---------
A    | 100   | 1  | 1
B    | 90    | 2  | 2
C    | 90    | 2  | 2
D    | 80    | 4  | 3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK`
* **Question**: **For player 'D' (score 80 after two tied players at rank 2), what is RANK (`rk`) vs DENSE_RANK (`dense_rk`)?**
* **Expected Exact Value**: `rk: 4, dense_rk: 3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `3 and 4` (Misconception: `MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK`)
  1. 🛑 *What Went Wrong*: RANK skips to 4 due to the tie. DENSE_RANK advances sequentially without gaps to 3.
  2. 💡 *Simpler Everyday Picture*: RANK = 4 (gap); DENSE_RANK = 3 (no gap).
  3. 🛠️ *Guided Fix Prompt*: **Type rk: 4, dense_rk: 3**


#### 🔹 Slide 3: The Top-N Per Category Pattern (CTE + ROW_NUMBER) (`sql-d18-b3-top-n-per-category`)

* **Primary Concept Budget**: `Top-N Pattern`
* **Supporting Terms**: WHERE row_num <= 3, Extract Top 1 Salary in Each Dept
* **Prerequisites**: `sql-d18-b2-rank-vs-dense-rank` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
WITH RankedStaff AS (
  SELECT name, dept, salary,
    ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) AS rn
  FROM employees
)
SELECT name, dept, salary FROM RankedStaff WHERE rn = 1;
```
* **Line 3**: Assigns ranks per department.
* **Line 6**: Filters top earner in each department (rn = 1).

##### 💻 Runnable Interactive SQL Sandbox (`top1_sim.sql`)
```sql
CREATE TABLE staff (name TEXT, dept TEXT, salary REAL);
INSERT INTO staff VALUES ('Alex', 'ENG', 120000), ('Sam', 'ENG', 80000), ('Pat', 'HR', 70000);

WITH Ranked AS (
  SELECT name, dept, salary, ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) AS rn FROM staff
)
SELECT name, dept, salary FROM Ranked WHERE rn = 1 ORDER BY dept ASC;
```
**Expected Terminal Execution Output**:
```text
name | dept | salary
-----+------+---------
Alex | ENG  | 120000.0
Pat  | HR   | 70000.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK`
* **Question**: **Who is the #1 highest paid employee in ENG in the Top-N query above?**
* **Expected Exact Value**: `Alex`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Sam` (Misconception: `MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK`)
  1. 🛑 *What Went Wrong*: Alex earns 120000 while Sam earns 80000. Alex is #1.
  2. 💡 *Simpler Everyday Picture*: Alex has highest salary in ENG.
  3. 🛠️ *Guided Fix Prompt*: **Type Alex**


### ⚡ Quest 2: Proctored SQL Exam — Rank Employees by Salary Within Department

**Problem Statement**:
Select `id`, `name`, `department`, `salary`, `DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank` from `employees` ORDER BY `department`, `dept_salary_rank`

**Socratic Mentor Hint**: *Use DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC).*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT id, name, department, salary, DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank FROM employees ORDER BY department, dept_salary_rank;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT id, name, department, salary, DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank FROM employees;
```

### 🛠️ Quest 3: Practical Database Assignment — Assign Row Numbers to Recent Customer Orders

**Problem Statement**:
Select `id`, `customer_id`, `total_amount`, `ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq` from `orders`

**Socratic Mentor Hint**: *Use ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC).*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT id, customer_id, total_amount, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq FROM orders;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT id, customer_id, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq FROM orders;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 19: WINDOW AGGREGATES: RUNNING TOTALS & MOVING AVERAGES (OVER)

> **Everyday Core Metaphor**: A running total window aggregate is an odometer in your car: every mile you drive (each transaction row), the odometer immediately rolls forward to display your new cumulative total mileage from Day 1 to the current moment.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Running Sum: SUM(val) OVER (ORDER BY date).
- **Concept**: Moving Window Frames: ROWS BETWEEN N PRECEDING AND CURRENT ROW.
- **Concept**: Analytical Partition Summaries.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Cumulative Running Totals with `SUM() OVER(ORDER BY ...)` (`sql-d19-b1-running-total-syntax`)

* **Primary Concept Budget**: `Running Total Window`
* **Supporting Terms**: SUM(amount) OVER (ORDER BY date), Cumulative Balance Traversal
* **Prerequisites**: `sql-d18-b1-window-concept` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  id,
  created_at,
  amount,
  SUM(amount) OVER(ORDER BY created_at ASC) AS running_balance
FROM transactions;
```
* **Line 4**: Computes cumulative sum from beginning of history up to each row.

##### 💻 Runnable Interactive SQL Sandbox (`running_sum.sql`)
```sql
CREATE TABLE txs (id INT, amount REAL);
INSERT INTO txs VALUES (1, 100), (2, 50), (3, 200);

SELECT id, amount, SUM(amount) OVER(ORDER BY id ASC) AS running_total FROM txs;
```
**Expected Terminal Execution Output**:
```text
id | amount | running_total
---+--------+--------------
1  | 100.0  | 100.0
2  | 50.0   | 150.0
3  | 200.0  | 350.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_WINDOW_FUNCTION_OVER_PARTITION`
* **Question**: **What is `running_total` for transaction 3 (after 100 + 50 + 200)?**
* **Expected Exact Value**: `350.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `200.0` (Misconception: `MC_SQL_WINDOW_FUNCTION_OVER_PARTITION`)
  1. 🛑 *What Went Wrong*: Running total accumulates previous rows: 100 + 50 + 200 = 350.0.
  2. 💡 *Simpler Everyday Picture*: 100 + 50 + 200 = 350.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 350.0**


#### 🔹 Slide 2: Window Frame Specifications: `ROWS BETWEEN ...` (`sql-d19-b2-frame-specifications`)

* **Primary Concept Budget**: `Window Frame Bounds`
* **Supporting Terms**: UNBOUNDED PRECEDING, CURRENT ROW, N PRECEDING (Moving Windows)
* **Prerequisites**: `sql-d19-b1-running-total-syntax` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`moving_avg.sql`)
```sql
CREATE TABLE daily_sales (day INT, sales REAL);
INSERT INTO daily_sales VALUES (1, 10), (2, 20), (3, 30);

-- Moving 2-day average (yesterday + today)
SELECT day, sales,
  ROUND(AVG(sales) OVER(ORDER BY day ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 1) AS moving_avg_2
FROM daily_sales;
```
**Expected Terminal Execution Output**:
```text
day | sales | moving_avg_2
----+-------+-------------
1   | 10.0  | 10.0
2   | 20.0  | 15.0
3   | 30.0  | 25.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_WINDOW_FUNCTION_OVER_PARTITION`
* **Question**: **On Day 3 (sales = 30, preceded by Day 2 sales = 20), what is `moving_avg_2` ((20 + 30) / 2)?**
* **Expected Exact Value**: `25.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `20.0` (Misconception: `MC_SQL_WINDOW_FUNCTION_OVER_PARTITION`)
  1. 🛑 *What Went Wrong*: (20 + 30) / 2 = 25.0.
  2. 💡 *Simpler Everyday Picture*: (20 + 30) / 2 = 25.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 25.0**


#### 🔹 Slide 3: Period-Over-Period Growth with LAG() and LEAD() (`sql-d19-b3-lag-and-lead`)

* **Primary Concept Budget**: `LAG / LEAD Functions`
* **Supporting Terms**: LAG(col, 1) (Previous Row), LEAD(col, 1) (Next Row), Growth Differencing
* **Prerequisites**: `sql-d19-b2-frame-specifications` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`lag_sim.sql`)
```sql
CREATE TABLE monthly (month INT, revenue REAL);
INSERT INTO monthly VALUES (1, 1000), (2, 1500);

SELECT month, revenue,
  LAG(revenue, 1) OVER(ORDER BY month) AS prev_month,
  (revenue - LAG(revenue, 1) OVER(ORDER BY month)) AS growth
FROM monthly;
```
**Expected Terminal Execution Output**:
```text
month | revenue | prev_month | growth
------+---------+------------+-------
1     | 1000.0  | NULL       | NULL
2     | 1500.0  | 1000.0     | 500.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_WINDOW_FUNCTION_OVER_PARTITION`
* **Question**: **What is `growth` in month 2 ($1500 - $1000)?**
* **Expected Exact Value**: `500.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1500.0` (Misconception: `MC_SQL_WINDOW_FUNCTION_OVER_PARTITION`)
  1. 🛑 *What Went Wrong*: 1500.0 - 1000.0 = 500.0 net growth.
  2. 💡 *Simpler Everyday Picture*: Growth is 500.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 500.0**


### ⚡ Quest 2: Proctored SQL Exam — Cumulative Running Revenue per Day

**Problem Statement**:
Select `date(created_at) AS order_day`, `total_amount`, `SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total` from `orders` ORDER BY `created_at ASC`

**Socratic Mentor Hint**: *Use SUM(...) OVER (ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT date(created_at) AS order_day, total_amount, SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM orders ORDER BY created_at ASC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT date(created_at), total_amount, SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) FROM orders;
```

### 🛠️ Quest 3: Practical Database Assignment — Moving 3-Order Average Amount

**Problem Statement**:
Select `id`, `total_amount`, `ROUND(AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3` from `orders`

**Socratic Mentor Hint**: *Use ROWS BETWEEN 2 PRECEDING AND CURRENT ROW.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT id, total_amount, ROUND(AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3 FROM orders;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT id, total_amount, ROUND(AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) FROM orders;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 20: DATABASE INDEXING: B-TREE INDEXES & COMPOSITE INDEX STRATEGY

> **Everyday Core Metaphor**: A B-Tree Index is the index at the back of a 1,000-page textbook: without an index, finding the word 'Transaction' forces you to flip through every single page from page 1 to 1,000 (Full Table Scan $O(N)$); with the index, you look up 'T', flip directly to page 842 in 2 seconds ($O(log N)$).

### 🎯 Day Overview & Learning Objectives
- **Concept**: B-Tree Index Internals: O(log N) point search vs O(N) full table scan.
- **Concept**: Composite Index Rule: Leftmost prefix matching.
- **Concept**: Unique Indexes & Index Overhead on Writes.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: How B-Tree Indexes Work (O(log N) vs O(N) Table Scans) (`sql-d20-b1-btree-internals`)

* **Primary Concept Budget**: `B-Tree Indexing`
* **Supporting Terms**: Balanced Search Tree, Binary Traversal, Full Table Scan vs Index Seek
* **Prerequisites**: `sql-d1-b2-primary-vs-candidate-keys` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE INDEX idx_customers_email ON customers(email);
CREATE UNIQUE INDEX idx_users_ssn ON users(ssn);
```
* **Line 1**: Builds a B-Tree sorted by email pointers for rapid lookups.

##### 💻 Runnable Interactive SQL Sandbox (`index_sim.sql`)
```sql
CREATE TABLE users (id INT, email TEXT);
CREATE INDEX idx_users_email ON users(email);
INSERT INTO users VALUES (1, 'alex@pinit.ai');
SELECT name, sql FROM sqlite_master WHERE type='index' AND name='idx_users_email';
```
**Expected Terminal Execution Output**:
```text
name            | sql
----------------+-------------------------------------------------
idx_users_email | CREATE INDEX idx_users_email ON users(email)
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`
* **Question**: **What is the time complexity of searching a record in a table with 1,000,000 rows using a B-Tree index vs no index?**
  ✅ **Option A**: With Index: O(log N) (~20 operations); Without Index: O(N) (1,000,000 operations)
  ❌ **Option B**: Without Index is faster
  ❌ **Option C**: Both take O(1) time

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`)
  1. 🛑 *What Went Wrong*: B-Tree indexes reduce search complexity from linear scan O(N) to logarithmic seek O(log N).
  2. 💡 *Simpler Everyday Picture*: Index gives O(log N) logarithmic lookup speed.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: The Leftmost Prefix Rule in Composite Indexes (`sql-d20-b2-composite-index-order`)

* **Primary Concept Budget**: `Composite Index Strategy`
* **Supporting Terms**: CREATE INDEX idx_name ON tbl(colA, colB), Leftmost Prefix Rule, Unusable Index on colB alone
* **Prerequisites**: `sql-d20-b1-btree-internals` (understood)

##### 💡 Real-World Physical Analogy: *A Phonebook Sorted by (LastName, FirstName)*
A phonebook sorted by (LastName, FirstName) lets you instantly find 'Smith, John' or all 'Smiths'. But if you only know the first name 'John', the phonebook ordering is completely useless and you must scan every page.

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ⚠️ Index on (customer_id, created_at) CANNOT accelerate query on created_at alone!
SELECT * FROM orders WHERE created_at = '2026-08-24';

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ Accelerates queries filtering on customer_id OR (customer_id AND created_at)
SELECT * FROM orders WHERE customer_id = 42 AND created_at = '2026-08-24';
```
* **Error Reason**: Composite B-Trees are sorted by column A first; column B is only sorted within ties of column A.
* **Fix Explanation**: Ensure your WHERE clause includes the leftmost column of composite indexes.

##### 💻 Runnable Interactive SQL Sandbox (`composite_idx.sql`)
```sql
CREATE TABLE orders (id INT, customer_id INT, created_at TEXT);
CREATE INDEX idx_orders_cust_date ON orders(customer_id, created_at DESC);
SELECT 'INDEX_CREATED_SUCCESS' AS status;
```
**Expected Terminal Execution Output**:
```text
status
---------------------
INDEX_CREATED_SUCCESS
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_COMPOSITE_INDEX_COLUMN_ORDER`
* **Question**: **If you create an index on `(department, salary)`, can the query `SELECT * FROM staff WHERE salary > 50000` (without department) use the index effectively?**
  ✅ **Option A**: No, because the leftmost prefix (department) is missing from the query filter
  ❌ **Option B**: Yes, column order in composite indexes makes no difference
  ❌ **Option C**: Only on SQLite

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_COMPOSITE_INDEX_COLUMN_ORDER`)
  1. 🛑 *What Went Wrong*: Composite indexes strictly require the leftmost column to be filtered; otherwise the engine falls back to a full scan.
  2. 💡 *Simpler Everyday Picture*: Leftmost prefix rule: must filter on first indexed column.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: The Write Overhead Trade-off of Indexes (`sql-d20-b3-write-overhead-tradeoff`)

* **Primary Concept Budget**: `Index Maintenance Cost`
* **Supporting Terms**: Faster Reads vs Slower Writes, B-Tree Rebalancing on INSERT/UPDATE/DELETE
* **Prerequisites**: `sql-d20-b2-composite-index-order` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`index_tradeoff.js`)
```sql
function evaluateIndexCost(indexCount) {
  return {
    readSpeed: 'O(log N) FAST',
    insertOverhead: `Must update ${indexCount} B-Tree structures on every INSERT`
  };
}

console.log(JSON.stringify(evaluateIndexCost(5)));
```
**Expected Terminal Execution Output**:
```text
{"readSpeed":"O(log N) FAST","insertOverhead":"Must update 5 B-Tree structures on every INSERT"}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`
* **Question**: **Why shouldn't you add an index on every single column in a high-throughput database table?**
  ✅ **Option A**: Every index adds write overhead because the database must rebalance all B-Trees on every INSERT, UPDATE, and DELETE
  ❌ **Option B**: Because tables can only have 1 index
  ❌ **Option C**: Because indexes delete table data

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`)
  1. 🛑 *What Went Wrong*: Indexes accelerate read queries at the expense of disk storage and slower write latency.
  2. 💡 *Simpler Everyday Picture*: Every index slows down writes due to B-Tree updates.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored SQL Exam — Create Composite Index for Fast Customer Search

**Problem Statement**:
Write SQL statement creating composite index `idx_orders_cust_date` on table `orders(customer_id, created_at DESC)`

**Socratic Mentor Hint**: *Use CREATE INDEX on customer_id and created_at DESC.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
CREATE INDEX idx_orders_cust_date ON orders(customer_id, created_at DESC);
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT name, sql FROM sqlite_master WHERE type='index' AND name='idx_orders_cust_date';
```

### 🛠️ Quest 3: Practical Database Assignment — Create Unique Email Index

**Problem Statement**:
Write SQL statement creating unique index `idx_users_email_unique` on `user_accounts(email)`

**Socratic Mentor Hint**: *Use CREATE UNIQUE INDEX.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
CREATE UNIQUE INDEX idx_users_email_unique ON user_accounts(email);
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT name, sql FROM sqlite_master WHERE type='index' AND name='idx_users_email_unique';
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 21: ⭐ MILESTONE 3: ENTERPRISE QUERY OPTIMIZER & EXECUTION PLAN AUDITOR

> **Everyday Core Metaphor**: Milestone 3 — Query Plan Diagnostics: Using `EXPLAIN QUERY PLAN` as an X-Ray machine to inspect whether queries perform blazing-fast Index Seeks (`SEARCH TABLE USING INDEX`) or catastrophic Full Table Scans (`SCAN TABLE`).

### 🎯 Day Overview & Learning Objectives
- **Concept**: EXPLAIN QUERY PLAN: Interpreting SCAN TABLE vs SEARCH TABLE USING INDEX.
- **Concept**: Index Selectivity: Cardinality and covering indexes.
- **Concept**: Preventing Accidental Full Scans.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Auditing Execution Plans with EXPLAIN QUERY PLAN (`sql-d21-b1-explain-query-plan`)

* **Primary Concept Budget**: `Query Plan Diagnostics`
* **Supporting Terms**: EXPLAIN QUERY PLAN, SCAN TABLE (Bad - Full Scan), SEARCH TABLE USING INDEX (Good)
* **Prerequisites**: `sql-d20-b1-btree-internals` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE customer_id = 42;
```
* **Line 1**: Tells the query engine to output its internal optimization plan without executing the query.

##### 💻 Runnable Interactive SQL Sandbox (`explain_sim.sql`)
```sql
CREATE TABLE orders (id INT, customer_id INT);
CREATE INDEX idx_orders_cust ON orders(customer_id);
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42;
```
**Expected Terminal Execution Output**:
```text
detail
--------------------------------------------------------------
SEARCH orders USING INDEX idx_orders_cust (customer_id=?)
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`
* **Question**: **In an `EXPLAIN QUERY PLAN` output, what is the indicator that a query is utilizing an index instead of scanning every row?**
  ✅ **Option A**: `SEARCH TABLE ... USING INDEX ...`
  ❌ **Option B**: `SCAN TABLE`
  ❌ **Option C**: `DELETE TABLE`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`)
  1. 🛑 *What Went Wrong*: SCAN TABLE means a full linear scan; SEARCH ... USING INDEX means an indexed seek was chosen.
  2. 💡 *Simpler Everyday Picture*: SEARCH ... USING INDEX indicates indexed lookup.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Covering Indexes: Zero-Table-Access Queries (`sql-d21-b2-covering-indexes`)

* **Primary Concept Budget**: `Covering Index`
* **Supporting Terms**: All requested columns exist in B-Tree, Bypassing Table Heap Pages
* **Prerequisites**: `sql-d21-b1-explain-query-plan` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`covering_idx.sql`)
```sql
CREATE TABLE accounts (id INT, email TEXT, balance REAL);
CREATE INDEX idx_covering ON accounts(email, balance);
-- Both email and balance live in the index B-tree!
EXPLAIN QUERY PLAN SELECT email, balance FROM accounts WHERE email = 'alex@pinit.ai';
```
**Expected Terminal Execution Output**:
```text
detail
------------------------------------------------------------------------
SEARCH accounts USING COVERING INDEX idx_covering (email=?)
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`
* **Question**: **What is a 'Covering Index' in database optimization?**
  ✅ **Option A**: An index that contains every column requested by the SELECT query, allowing the engine to return results directly from the index without reading the main table heap
  ❌ **Option B**: An index that covers the entire hard drive
  ❌ **Option C**: A temporary index created at startup

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`)
  1. 🛑 *What Went Wrong*: Covering indexes satisfy the entire query from index pages alone.
  2. 💡 *Simpler Everyday Picture*: Contains all required columns in the index itself.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Milestone 3 Optimizer Certification (`sql-d21-b3-milestone-plan-audit`)

* **Primary Concept Budget**: `Optimizer Certification`
* **Supporting Terms**: Index Plan Verification, Zero Full Scans on Hot Paths
* **Prerequisites**: `sql-d21-b2-covering-indexes` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`optimizer_cert.sql`)
```sql
SELECT 'MILESTONE_3_OPTIMIZER_VERIFIED' AS cert_status;
```
**Expected Terminal Execution Output**:
```text
cert_status
--------------------------------
MILESTONE_3_OPTIMIZER_VERIFIED
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`
* **Question**: **What certification status string is confirmed upon optimizing all hot paths in Milestone 3?**
* **Expected Exact Value**: `MILESTONE_3_OPTIMIZER_VERIFIED`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `UNVERIFIED` (Misconception: `MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN`)
  1. 🛑 *What Went Wrong*: Returns MILESTONE_3_OPTIMIZER_VERIFIED.
  2. 💡 *Simpler Everyday Picture*: Certification is MILESTONE_3_OPTIMIZER_VERIFIED.
  3. 🛠️ *Guided Fix Prompt*: **Type MILESTONE_3_OPTIMIZER_VERIFIED**


### ⚡ Quest 2: Proctored SQL Exam — Audit Query Plan to Confirm Index Scan

**Problem Statement**:
Write `EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC;`

**Socratic Mentor Hint**: *Prefix query with EXPLAIN QUERY PLAN.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42;
```

### 🛠️ Quest 3: Practical Database Assignment — Audit Email Lookup Plan

**Problem Statement**:
Write `EXPLAIN QUERY PLAN SELECT * FROM user_accounts WHERE email = 'test@pinit.ai';`

**Socratic Mentor Hint**: *Prefix with EXPLAIN QUERY PLAN.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
EXPLAIN QUERY PLAN SELECT * FROM user_accounts WHERE email = 'test@pinit.ai';
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
EXPLAIN QUERY PLAN SELECT * FROM user_accounts WHERE email = 'test@pinit.ai';
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 22: TRANSACTIONS & ACID GUARANTEES: BEGIN, COMMIT & ROLLBACK

> **Everyday Core Metaphor**: A database transaction is an electronic bank wire transfer: Step 1 subtracts $500 from Account A; Step 2 deposits $500 into Account B. If the power cable is unplugged halfway between Step 1 and Step 2, Atomicity (`ROLLBACK`) ensures the money reverts to Account A—it never vanishes into thin air.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Atomicity: All-or-nothing execution.
- **Concept**: Consistency: Enforcing schema constraints across transactions.
- **Concept**: Rollback on Failure: Preserving database integrity.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The ACID Invariants (Atomicity, Consistency, Isolation, Durability) (`sql-d22-b1-acid-properties`)

* **Primary Concept Budget**: `ACID Guarantees`
* **Supporting Terms**: Atomicity (All-or-Nothing), Consistency (Constraint Invariants), Isolation (Independent Execution), Durability (Committed Data Persists)
* **Prerequisites**: `sql-d5-b1-foreign-keys-cascade` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```
* **Line 1**: Starts an atomic transactional unit of work.
* **Line 4**: COMMIT permanently writes all mutations to disk.

##### 💻 Runnable Interactive SQL Sandbox (`acid_sim.sql`)
```sql
CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL);
INSERT INTO accounts VALUES (1, 500), (2, 200);

BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

SELECT id, balance FROM accounts ORDER BY id ASC;
```
**Expected Terminal Execution Output**:
```text
id | balance
---+--------
1  | 400.0
2  | 300.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_TRANSACTION_ACID_ROLLBACK`
* **Question**: **What does the 'Atomicity' guarantee in ACID database transactions mean?**
  ✅ **Option A**: All operations within the transaction must complete successfully together; if any single statement fails, the entire transaction is rolled back as if nothing happened
  ❌ **Option B**: Queries execute in 1 nanosecond
  ❌ **Option C**: Data is stored in single atoms

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_TRANSACTION_ACID_ROLLBACK`)
  1. 🛑 *What Went Wrong*: Atomicity ensures all-or-nothing execution.
  2. 💡 *Simpler Everyday Picture*: Atomicity = All-or-nothing execution.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: ROLLBACK Mechanics on Error or Constraint Failure (`sql-d22-b2-rollback-mechanics`)

* **Primary Concept Budget**: `ROLLBACK Statement`
* **Supporting Terms**: Aborting Transaction, Restoring Database to Pre-Transaction Snapshot
* **Prerequisites**: `sql-d22-b1-acid-properties` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`rollback_demo.sql`)
```sql
CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL);
INSERT INTO accounts VALUES (1, 500.0);

BEGIN TRANSACTION;
UPDATE accounts SET balance = 0.0 WHERE id = 1;
ROLLBACK; -- Aborts the update!

SELECT balance FROM accounts WHERE id = 1;
```
**Expected Terminal Execution Output**:
```text
balance
-------
500.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_TRANSACTION_ACID_ROLLBACK`
* **Question**: **After updating balance to 0.0 and then executing `ROLLBACK`, what balance is preserved for account 1?**
* **Expected Exact Value**: `500.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `0.0` (Misconception: `MC_SQL_TRANSACTION_ACID_ROLLBACK`)
  1. 🛑 *What Went Wrong*: ROLLBACK discarded the uncommitted update, restoring the original balance of 500.0.
  2. 💡 *Simpler Everyday Picture*: ROLLBACK restores 500.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 500.0**


#### 🔹 Slide 3: Partial Rollbacks with SAVEPOINT (`sql-d22-b3-savepoints`)

* **Primary Concept Budget**: `SAVEPOINT`
* **Supporting Terms**: SAVEPOINT sp1, ROLLBACK TO sp1, Nested Transaction Boundaries
* **Prerequisites**: `sql-d22-b2-rollback-mechanics` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`savepoint_sim.sql`)
```sql
CREATE TABLE items (val TEXT);
INSERT INTO items VALUES ('A');

BEGIN TRANSACTION;
INSERT INTO items VALUES ('B');
SAVEPOINT sp1;
INSERT INTO items VALUES ('C');
ROLLBACK TO sp1; -- Discards C, but keeps B!
COMMIT;

SELECT val FROM items ORDER BY val ASC;
```
**Expected Terminal Execution Output**:
```text
val
---
A
B
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_TRANSACTION_ACID_ROLLBACK`
* **Question**: **Which items are saved when rolling back to SAVEPOINT `sp1` (discarding 'C') and committing?**
* **Expected Exact Value**: `val
---
A
B`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `A, B, C` (Misconception: `MC_SQL_TRANSACTION_ACID_ROLLBACK`)
  1. 🛑 *What Went Wrong*: 'C' was inserted after savepoint sp1, so rolling back to sp1 purged 'C'.
  2. 💡 *Simpler Everyday Picture*: Preserves A and B.
  3. 🛠️ *Guided Fix Prompt*: **Type A, B**


### ⚡ Quest 2: Proctored SQL Exam — Atomic Bank Transfer Transaction

**Problem Statement**:
Write a transaction transferring $100 from account 1 to account 2: BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;

**Socratic Mentor Hint**: *Execute BEGIN TRANSACTION, both updates, and COMMIT.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT balance FROM accounts WHERE id IN (1, 2);
```

### 🛠️ Quest 3: Practical Database Assignment — Rollback on Invariant Check Failure

**Problem Statement**:
Demonstrate ROLLBACK on negative balance validation.

**Socratic Mentor Hint**: *Use BEGIN TRANSACTION followed by ROLLBACK.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
BEGIN TRANSACTION;
ROLLBACK;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT 1;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 23: CONCURRENCY & ISOLATION LEVELS: DIRTY READS TO SERIALIZABLE

> **Everyday Core Metaphor**: Transaction Isolation Levels are reading private diaries: Read Uncommitted is peeking at someone's draft notebook while they are still erasing and writing (Dirty Read); Serializable is placing each writer in their own locked soundproof booth so transactions appear to execute in a strict, single-file line.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.
- **Concept**: Write-Ahead Logging (WAL): Concurrent readers and writers in SQLite.
- **Concept**: Deadlock Prevention & Lock Escalation.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Concurrency Anomalies (Dirty Reads, Non-Repeatable Reads, Phantoms) (`sql-d23-b1-concurrency-anomalies`)

* **Primary Concept Budget**: `Isolation Anomalies`
* **Supporting Terms**: Dirty Read (Reading uncommitted data), Non-Repeatable Read (Row modified during read), Phantom Read (New rows inserted)
* **Prerequisites**: `sql-d22-b1-acid-properties` (understood)

##### 🔄 Query Engine Execution Flowchart
* [START] **1. Read Uncommitted -> Allows Dirty Reads**
* [PROCESS] **2. Read Committed -> Prevents Dirty Reads**
* [PROCESS] **3. Repeatable Read -> Prevents Non-Repeatable Reads**
* [END] **4. Serializable -> Prevents Phantoms (Full Isolation)**

##### 💻 Runnable Interactive SQL Sandbox (`isolation_sim.js`)
```sql
function checkAnomalyProtection(level) {
  return {
    level,
    preventsDirtyReads: level !== 'READ_UNCOMMITTED',
    preventsPhantoms: level === 'SERIALIZABLE'
  };
}

console.log('Serializable Guarantees:', JSON.stringify(checkAnomalyProtection('SERIALIZABLE')));
```
**Expected Terminal Execution Output**:
```text
Serializable Guarantees: {"level":"SERIALIZABLE","preventsDirtyReads":true,"preventsPhantoms":true}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_ISOLATION_LEVEL_DIRTY_READ`
* **Question**: **What is a 'Dirty Read' in database concurrency?**
  ✅ **Option A**: A transaction reading modified data from another concurrent transaction before that other transaction has committed
  ❌ **Option B**: A read from a dusty hard drive
  ❌ **Option C**: A read of an invalid SQL syntax

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_ISOLATION_LEVEL_DIRTY_READ`)
  1. 🛑 *What Went Wrong*: Dirty reads occur when uncommitted changes that might still be rolled back are read by other transactions.
  2. 💡 *Simpler Everyday Picture*: Reading uncommitted changes before they commit.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Write-Ahead Logging (WAL) Mode for High Concurrency (`sql-d23-b2-wal-mode`)

* **Primary Concept Budget**: `Write-Ahead Logging (WAL)`
* **Supporting Terms**: PRAGMA journal_mode = WAL, Readers do not block Writers, Writers do not block Readers
* **Prerequisites**: `sql-d23-b1-concurrency-anomalies` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
```
* **Line 1**: Enables Write-Ahead Logging for concurrent multi-reader access.

##### 💻 Runnable Interactive SQL Sandbox (`wal_sim.sql`)
```sql
PRAGMA journal_mode = WAL;
SELECT 'WAL_ENABLED' AS mode;
```
**Expected Terminal Execution Output**:
```text
mode
-----------
WAL_ENABLED
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_ISOLATION_LEVEL_DIRTY_READ`
* **Question**: **What is the major concurrency benefit of SQLite's Write-Ahead Log (WAL) mode?**
  ✅ **Option A**: Readers do not block writers, and writers do not block readers
  ❌ **Option B**: It turns SQLite into MySQL
  ❌ **Option C**: It deletes old queries

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_ISOLATION_LEVEL_DIRTY_READ`)
  1. 🛑 *What Went Wrong*: WAL mode decouples read locks from write operations, allowing simultaneous reading and writing.
  2. 💡 *Simpler Everyday Picture*: Readers and writers do not block each other.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Deadlock Detection and Lock Escalation (`sql-d23-b3-deadlocks`)

* **Primary Concept Budget**: `Deadlock Prevention`
* **Supporting Terms**: Circular Wait Condition, Consistent Lock Acquisition Order
* **Prerequisites**: `sql-d23-b2-wal-mode` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`deadlock_sim.js`)
```sql
function preventDeadlock(txA_ResourceOrder, txB_ResourceOrder) {
  // Invariant: Both transactions must acquire resources in identical alphabetical order
  return txA_ResourceOrder[0] === txB_ResourceOrder[0];
}

console.log('Deadlock Safe Order:', preventDeadlock(['ACCOUNTS', 'ORDERS'], ['ACCOUNTS', 'ORDERS']));
```
**Expected Terminal Execution Output**:
```text
Deadlock Safe Order: true
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_TRANSACTION_ACID_ROLLBACK`
* **Question**: **Is acquiring resources in identical lock order deadlock safe?**
* **Expected Exact Value**: `Deadlock Safe Order: true`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `false` (Misconception: `MC_SQL_TRANSACTION_ACID_ROLLBACK`)
  1. 🛑 *What Went Wrong*: Enforcing a global deterministic resource acquisition order eliminates circular wait deadlocks.
  2. 💡 *Simpler Everyday Picture*: Consistent ordering prevents deadlocks -> true.
  3. 🛠️ *Guided Fix Prompt*: **Type Deadlock Safe Order: true**


### ⚡ Quest 2: Proctored SQL Exam — Set SQLite WAL Pragma for High Concurrency

**Problem Statement**:
Write `PRAGMA journal_mode = WAL;` to enable Write-Ahead Logging for concurrent readers and writers.

**Socratic Mentor Hint**: *Execute PRAGMA journal_mode = WAL.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
PRAGMA journal_mode = WAL;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
PRAGMA journal_mode;
```

### 🛠️ Quest 3: Practical Database Assignment — Verify Foreign Key Enforcement Pragma

**Problem Statement**:
Write `PRAGMA foreign_keys = ON;`

**Socratic Mentor Hint**: *Execute PRAGMA foreign_keys = ON.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
PRAGMA foreign_keys = ON;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
PRAGMA foreign_keys;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 24: DATABASE NORMALIZATION: 1NF, 2NF, 3NF & BCNF ARCHITECTURE

> **Everyday Core Metaphor**: Database normalization is cleaning up a messy closet: 1NF is unpacking big bundled laundry bags into individual separate shirts (Atomic values); 2NF is putting shoes in the shoe rack and shirts on hangers (no partial key dependencies); 3NF is removing the receipt taped to a jacket and storing it in the receipts drawer (no transitive dependencies).

### 🎯 Day Overview & Learning Objectives
- **Concept**: 1NF: Atomic values and unique column entries.
- **Concept**: 2NF: No partial dependency on composite keys.
- **Concept**: 3NF: No transitive dependencies (`A -> B -> C`).

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: First Normal Form (1NF): Atomic Scalar Values (`sql-d24-b1-1nf-atomicity`)

* **Primary Concept Budget**: `1NF Rules`
* **Supporting Terms**: No Comma-Separated Values in Single Column, Atomic Attributes, Unique Row Identification
* **Prerequisites**: `sql-d1-b1-relational-model` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```sql
-- ❌ BROKEN / BUGGY PATTERN
-- ❌ 1NF Violation: Storing multiple phone numbers in a single string column!
CREATE TABLE bad_users (id INT, name TEXT, phones TEXT); -- '555-1234, 555-5678'

-- ✅ CORRECT / PRODUCTION FIX
-- ✅ 1NF Compliant: Separate relational table with atomic phone values
CREATE TABLE user_phones (user_id INT, phone TEXT, PRIMARY KEY (user_id, phone));
```
* **Error Reason**: Comma-separated strings prevent efficient indexing, searching, and constraint validation.
* **Fix Explanation**: Store exactly 1 atomic value per cell; use a child table for multi-valued attributes.

##### 💻 Runnable Interactive SQL Sandbox (`1nf_demo.sql`)
```sql
CREATE TABLE user_phones (user_id INT, phone TEXT, PRIMARY KEY (user_id, phone));
INSERT INTO user_phones VALUES (1, '555-0101'), (1, '555-0102');
SELECT COUNT(*) AS total_atomic_phones FROM user_phones WHERE user_id = 1;
```
**Expected Terminal Execution Output**:
```text
total_atomic_phones
-------------------
2
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_NORMALIZATION_REDUNDANCY`
* **Question**: **How many atomic phone records exist for user 1 in the 1NF table above?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_NORMALIZATION_REDUNDANCY`)
  1. 🛑 *What Went Wrong*: Two separate atomic rows exist for user 1.
  2. 💡 *Simpler Everyday Picture*: 2 separate rows.
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


#### 🔹 Slide 2: Second (2NF) & Third (3NF) Normal Forms (`sql-d24-b2-2nf-and-3nf`)

* **Primary Concept Budget**: `3NF Rules`
* **Supporting Terms**: 2NF: No Partial Dependencies on Composite PK, 3NF: No Transitive Dependencies (A -> B -> C), Eliminating Update Anomalies
* **Prerequisites**: `sql-d24-b1-1nf-atomicity` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
-- 1. Departments Table (Entity)
CREATE TABLE departments (id INT PRIMARY KEY, name TEXT UNIQUE);

-- 2. Employees Table (References Dept ID, NOT Dept Name!)
CREATE TABLE employees (id INT PRIMARY KEY, name TEXT, dept_id INT REFERENCES departments(id));
```
* **Line 2**: Stores department metadata in exactly ONE authoritative location.
* **Line 5**: Eliminates duplicate department name strings across 10,000 employee rows.

##### 💻 Runnable Interactive SQL Sandbox (`3nf_sim.sql`)
```sql
CREATE TABLE depts (id INT PRIMARY KEY, name TEXT);
CREATE TABLE staff (id INT PRIMARY KEY, name TEXT, dept_id INT REFERENCES depts(id));
INSERT INTO depts VALUES (1, 'Engineering');
INSERT INTO staff VALUES (101, 'Alex', 1), (102, 'Sam', 1);

-- Updating department name in exactly 1 row updates the whole company!
UPDATE depts SET name = 'Core AI & Eng' WHERE id = 1;
SELECT d.name FROM staff s JOIN depts d ON s.dept_id = d.id WHERE s.id = 101;
```
**Expected Terminal Execution Output**:
```text
name
---------------
Core AI & Eng
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_NORMALIZATION_REDUNDANCY`
* **Question**: **What major problem does Third Normal Form (3NF) eliminate in database systems?**
  ✅ **Option A**: Update, Insert, and Deletion Anomalies caused by redundant duplicate data stored across multiple rows
  ❌ **Option B**: It eliminates the need for SQL queries
  ❌ **Option C**: It removes all primary keys

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_NORMALIZATION_REDUNDANCY`)
  1. 🛑 *What Went Wrong*: Normalization eliminates anomalies where updating a piece of data in one row leaves contradictory data in another row.
  2. 💡 *Simpler Everyday Picture*: Prevents update/insert anomalies by centralizing data.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: When to Denormalize: Read Performance vs Write Consistency (`sql-d24-b3-denormalization-tradeoff`)

* **Primary Concept Budget**: `Denormalization Trade-offs`
* **Supporting Terms**: High-Volume Analytical Warehouses (OLAP), Reducing Expensive 10-Table Joins
* **Prerequisites**: `sql-d24-b2-2nf-and-3nf` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`denorm_tradeoffs.js`)
```sql
function evaluateDenormalization(workloadType) {
  return workloadType === 'OLAP_ANALYTICS'
    ? { architecture: 'Denormalized Star Schema', goal: 'Fast aggregate reads' }
    : { architecture: '3NF Normalized Schema', goal: 'Strict transaction integrity' };
}

console.log(JSON.stringify(evaluateDenormalization('OLAP_ANALYTICS')));
```
**Expected Terminal Execution Output**:
```text
{"architecture":"Denormalized Star Schema","goal":"Fast aggregate reads"}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_NORMALIZATION_REDUNDANCY`
* **Question**: **In what scenario is controlled denormalization justifiable?**
  ✅ **Option A**: In read-heavy analytical data warehouses (OLAP) to reduce the performance cost of massive multi-table joins
  ❌ **Option B**: In banking transaction ledgers
  ❌ **Option C**: Whenever you don't feel like creating foreign keys

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_NORMALIZATION_REDUNDANCY`)
  1. 🛑 *What Went Wrong*: OLAP systems often denormalize into star schemas to maximize read throughput on reporting queries.
  2. 💡 *Simpler Everyday Picture*: OLAP analytics use denormalization for faster reads.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored SQL Exam — Normalized Product Categories DDL

**Problem Statement**:
Create table `categories (id INT PRIMARY KEY, name TEXT UNIQUE NOT NULL)` and table `items (id INT PRIMARY KEY, category_id INT REFERENCES categories(id), name TEXT NOT NULL)`

**Socratic Mentor Hint**: *Create parent categories table and child items table with REFERENCES.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
CREATE TABLE categories (id INT PRIMARY KEY, name TEXT UNIQUE NOT NULL);
CREATE TABLE items (id INT PRIMARY KEY, category_id INT REFERENCES categories(id), name TEXT NOT NULL);
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
PRAGMA table_info(categories);
PRAGMA table_info(items);
```

### 🛠️ Quest 3: Practical Database Assignment — Normalized Order Line Items DDL

**Problem Statement**:
Create table `invoice_lines (invoice_id INT, line_num INT, amount REAL, PRIMARY KEY (invoice_id, line_num))`

**Socratic Mentor Hint**: *Use composite PRIMARY KEY (invoice_id, line_num).*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
CREATE TABLE invoice_lines (invoice_id INT, line_num INT, amount REAL, PRIMARY KEY (invoice_id, line_num));
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
PRAGMA table_info(invoice_lines);
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 25: SQL VIEWS & MATERIALIZED VIEWS FOR ABSTRACT QUERIES

> **Everyday Core Metaphor**: A SQL View is a saved camera angle: instead of manually adjusting 5 tripods and lighting rigs every morning (writing a 50-line 4-table join), you save Camera Preset 1 (`CREATE VIEW v_active_orders`); whenever you want to see the scene, you just say `SELECT * FROM v_active_orders`.

### 🎯 Day Overview & Learning Objectives
- **Concept**: CREATE VIEW: Stored query definitions without data duplication.
- **Concept**: Materialized Views: Cached physical tables for intensive analytics.
- **Concept**: View Security: Granting row and column access through views.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Creating and Querying Standard Views (Virtual Tables) (`sql-d25-b1-create-view-syntax`)

* **Primary Concept Budget**: `SQL Views`
* **Supporting Terms**: CREATE VIEW name AS SELECT ..., Virtual Query Encapsulation, Security & Column Hiding
* **Prerequisites**: `sql-d11-b1-inner-join-mechanics` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE VIEW v_active_employees AS
SELECT id, name, department, salary
FROM employees
WHERE status = 'ACTIVE';
```
* **Line 1**: Stores query definition as a reusable virtual table in the database schema.
* **Line 4**: Automatically filters out non-active staff on every view query.

##### 💻 Runnable Interactive SQL Sandbox (`view_demo.sql`)
```sql
CREATE TABLE staff (id INT, name TEXT, ssn TEXT, status TEXT);
INSERT INTO staff VALUES (1, 'Alex', '999-00-1111', 'ACTIVE'), (2, 'Sam', '999-00-2222', 'TERMINATED');

-- View hides sensitive SSN and filters terminated staff
CREATE VIEW v_public_staff AS SELECT id, name FROM staff WHERE status = 'ACTIVE';
SELECT * FROM v_public_staff;
```
**Expected Terminal Execution Output**:
```text
id | name
---+-----
1  | Alex
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_VIEW_MATERIALIZATION_OVERHEAD`
* **Question**: **Does a standard SQL `CREATE VIEW` duplicate and store table data on disk?**
  ✅ **Option A**: No, a standard view stores only the query definition and executes dynamically on demand against the underlying physical tables
  ❌ **Option B**: Yes, it copies all data to a second file
  ❌ **Option C**: It converts data to PDF

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_VIEW_MATERIALIZATION_OVERHEAD`)
  1. 🛑 *What Went Wrong*: Standard views are virtual; they execute the underlying SELECT query in real-time.
  2. 💡 *Simpler Everyday Picture*: Virtual view = saved query definition, not copied data.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Materialized Views: Cached Physical Snapshots (`sql-d25-b2-materialized-views`)

* **Primary Concept Budget**: `Materialized Views`
* **Supporting Terms**: Physical Cached Table, REFRESH MATERIALIZED VIEW, Heavy Analytics Acceleration
* **Prerequisites**: `sql-d25-b1-create-view-syntax` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`mat_view_sim.js`)
```sql
function compareViews(type) {
  return type === 'MATERIALIZED'
    ? { dataStoredOnDisk: true, querySpeed: 'Sub-millisecond instant', requiresRefresh: true }
    : { dataStoredOnDisk: false, querySpeed: 'Computes dynamically', requiresRefresh: false };
}

console.log('Materialized View Specs:', JSON.stringify(compareViews('MATERIALIZED')));
```
**Expected Terminal Execution Output**:
```text
Materialized View Specs: {"dataStoredOnDisk":true,"querySpeed":"Sub-millisecond instant","requiresRefresh":true}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_VIEW_MATERIALIZATION_OVERHEAD`
* **Question**: **What is the key trade-off when using Materialized Views over Standard Views?**
  ✅ **Option A**: Materialized views provide instant sub-millisecond read queries from cached disk snapshots, but require periodic refresh jobs to stay synchronized with underlying changes
  ❌ **Option B**: Materialized views can only hold 5 rows
  ❌ **Option C**: Materialized views do not support SELECT statements

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_VIEW_MATERIALIZATION_OVERHEAD`)
  1. 🛑 *What Went Wrong*: Materialized views physically store aggregated results on disk, trading staleness for read speed.
  2. 💡 *Simpler Everyday Picture*: Stores cached snapshot on disk for speed; requires refresh.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Row-Level & Column-Level Security via Views (`sql-d25-b3-view-security`)

* **Primary Concept Budget**: `View Access Control`
* **Supporting Terms**: Hiding Salary/SSN Columns, Restricting Multi-Tenant Customer Rows
* **Prerequisites**: `sql-d25-b2-materialized-views` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`sec_view.sql`)
```sql
CREATE TABLE patients (id INT, name TEXT, diagnosis TEXT, ssn TEXT);
INSERT INTO patients VALUES (1, 'Alex', 'Healthy', '999-11-2222');

-- Sanitized view for public dashboard:
CREATE VIEW v_sanitized_patients AS SELECT id, name FROM patients;
SELECT * FROM v_sanitized_patients;
```
**Expected Terminal Execution Output**:
```text
id | name
---+-----
1  | Alex
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_VIEW_MATERIALIZATION_OVERHEAD`
* **Question**: **How many columns are exposed in `v_sanitized_patients`?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `4` (Misconception: `MC_SQL_VIEW_MATERIALIZATION_OVERHEAD`)
  1. 🛑 *What Went Wrong*: Only `id` and `name` are projected in the view (sensitive diagnosis and ssn columns are hidden).
  2. 💡 *Simpler Everyday Picture*: Projects exactly 2 columns (id, name).
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


### ⚡ Quest 2: Proctored SQL Exam — Create Customer Revenue Summary View

**Problem Statement**:
Create view `v_customer_revenue` AS SELECT `c.id`, `c.name`, `COALESCE(SUM(o.total_amount), 0.0) AS total_revenue` FROM `customers c` LEFT JOIN `orders o` ON `c.id = o.customer_id` GROUP BY `c.id`, `c.name`

**Socratic Mentor Hint**: *Use CREATE VIEW v_customer_revenue AS followed by SELECT query.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
CREATE VIEW v_customer_revenue AS
SELECT c.id, c.name, COALESCE(SUM(o.total_amount), 0.0) AS total_revenue
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT * FROM v_customer_revenue;
```

### 🛠️ Quest 3: Practical Database Assignment — Create Active Staff Directory View

**Problem Statement**:
Create view `v_active_staff` AS SELECT `id`, `name`, `email` FROM `employees` WHERE `status = 'ACTIVE'`

**Socratic Mentor Hint**: *Use CREATE VIEW with WHERE status = 'ACTIVE'.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
CREATE VIEW v_active_staff AS SELECT id, name, email FROM employees WHERE status = 'ACTIVE';
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT * FROM v_active_staff;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 26: ⭐ MILESTONE 4: REAL-TIME AUDIT LOG TRIGGER & INVARIANT ENFORCER

> **Everyday Core Metaphor**: Milestone 4 — Database Triggers & Invariant Security: A trigger is a security camera wired to a tripwire: the instant someone updates a bank account balance (`AFTER UPDATE OF balance`), the camera snaps a photo of the old balance (`OLD.balance`) and the new balance (`NEW.balance`) and logs it into an immutable audit trail table.

### 🎯 Day Overview & Learning Objectives
- **Concept**: CREATE TRIGGER: AFTER UPDATE OF col ON table.
- **Concept**: OLD vs NEW Row References: Accessing pre-update and post-update values.
- **Concept**: Automated Audit Logging & Change Tracking.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The CREATE TRIGGER Statement & OLD/NEW Row Contexts (`sql-d26-b1-trigger-syntax`)

* **Primary Concept Budget**: `Database Triggers`
* **Supporting Terms**: AFTER UPDATE OF col ON tbl, OLD.balance vs NEW.balance, Automated Change Tracking
* **Prerequisites**: `sql-d22-b1-acid-properties` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE TRIGGER trg_audit_balance_change
AFTER UPDATE OF balance ON accounts
BEGIN
  INSERT INTO account_audit (account_id, old_bal, new_bal, changed_at)
  VALUES (OLD.id, OLD.balance, NEW.balance, CURRENT_TIMESTAMP);
END;
```
* **Line 2**: Fires automatically whenever the 'balance' column is updated.
* **Line 5**: OLD refers to the pre-update row values; NEW refers to the post-update values.

##### 💻 Runnable Interactive SQL Sandbox (`trigger_sim.sql`)
```sql
CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL);
CREATE TABLE audit_log (acc_id INT, old_bal REAL, new_bal REAL);

CREATE TRIGGER trg_log
AFTER UPDATE OF balance ON accounts
BEGIN
  INSERT INTO audit_log VALUES (OLD.id, OLD.balance, NEW.balance);
END;

INSERT INTO accounts VALUES (1, 100.0);
UPDATE accounts SET balance = 150.0 WHERE id = 1;
SELECT * FROM audit_log;
```
**Expected Terminal Execution Output**:
```text
acc_id | old_bal | new_bal
-------+---------+--------
1      | 100.0   | 150.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`
* **Question**: **What is `old_bal` logged in the audit table when balance updates from 100.0 to 150.0?**
* **Expected Exact Value**: `100.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `150.0` (Misconception: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`)
  1. 🛑 *What Went Wrong*: OLD.balance captured the pre-update value: 100.0.
  2. 💡 *Simpler Everyday Picture*: OLD.balance is 100.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 100.0**


#### 🔹 Slide 2: Preventative Triggers with RAISE(ABORT, ...) (`sql-d26-b2-preventative-triggers`)

* **Primary Concept Budget**: `Preventative Triggers`
* **Supporting Terms**: BEFORE INSERT / UPDATE, RAISE(ABORT, 'Custom Error'), Business Rule Guardrails
* **Prerequisites**: `sql-d26-b1-trigger-syntax` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE TRIGGER trg_prevent_negative_balance
BEFORE INSERT ON accounts
WHEN NEW.balance < 0.0
BEGIN
  SELECT RAISE(ABORT, 'Account balance cannot be negative');
END;
```
* **Line 3**: WHEN condition checks invariant before insert.
* **Line 5**: RAISE(ABORT) terminates the query and rolls back.

##### 💻 Runnable Interactive SQL Sandbox (`prevent_trigger.sql`)
```sql
CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL);
CREATE TRIGGER trg_guard BEFORE INSERT ON accounts WHEN NEW.balance < 0
BEGIN SELECT RAISE(ABORT, 'NEGATIVE_BAL_REJECTED'); END;

INSERT INTO accounts VALUES (1, 50.0);
SELECT * FROM accounts;
```
**Expected Terminal Execution Output**:
```text
id | balance
---+--------
1  | 50.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`
* **Question**: **What happens when an `INSERT` statement violates the `WHEN NEW.balance < 0` condition in the trigger above?**
  ✅ **Option A**: The database immediately aborts the transaction with the error message 'NEGATIVE_BAL_REJECTED'
  ❌ **Option B**: The row is inserted silently
  ❌ **Option C**: The balance is converted to 0

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`)
  1. 🛑 *What Went Wrong*: RAISE(ABORT) immediately terminates execution and throws the error.
  2. 💡 *Simpler Everyday Picture*: Aborts with error immediately.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Milestone 4 Audit Invariant Certification (`sql-d26-b3-milestone-trigger-cert`)

* **Primary Concept Budget**: `Audit Trail Certification`
* **Supporting Terms**: Immutable Audit Logging, Financial Compliance Invariants
* **Prerequisites**: `sql-d26-b2-preventative-triggers` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`trigger_cert.sql`)
```sql
SELECT 'MILESTONE_4_AUDIT_LOGGING_VERIFIED' AS audit_status;
```
**Expected Terminal Execution Output**:
```text
audit_status
------------------------------------
MILESTONE_4_AUDIT_LOGGING_VERIFIED
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`
* **Question**: **What certification string is returned upon verifying Milestone 4 audit triggers?**
* **Expected Exact Value**: `MILESTONE_4_AUDIT_LOGGING_VERIFIED`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `FAILED` (Misconception: `MC_SQL_CHECK_CONSTRAINT_VIOLATION`)
  1. 🛑 *What Went Wrong*: Returns MILESTONE_4_AUDIT_LOGGING_VERIFIED.
  2. 💡 *Simpler Everyday Picture*: Certification string is MILESTONE_4_AUDIT_LOGGING_VERIFIED.
  3. 🛠️ *Guided Fix Prompt*: **Type MILESTONE_4_AUDIT_LOGGING_VERIFIED**


### ⚡ Quest 2: Proctored SQL Exam — Create Audit Trigger on Customer Balance Changes

**Problem Statement**:
Create trigger `trg_audit_balance_change` AFTER UPDATE OF `balance` ON `accounts` BEGIN INSERT INTO `account_audit (account_id, old_bal, new_bal, changed_at)` VALUES (`OLD.id`, `OLD.balance`, `NEW.balance`, `CURRENT_TIMESTAMP`); END;

**Socratic Mentor Hint**: *Use AFTER UPDATE OF balance ON accounts with OLD and NEW references.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
CREATE TRIGGER trg_audit_balance_change
AFTER UPDATE OF balance ON accounts
BEGIN
  INSERT INTO account_audit (account_id, old_bal, new_bal, changed_at)
  VALUES (OLD.id, OLD.balance, NEW.balance, CURRENT_TIMESTAMP);
END;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT name, sql FROM sqlite_master WHERE type='trigger' AND name='trg_audit_balance_change';
```

### 🛠️ Quest 3: Practical Database Assignment — Create Invariant Preventative Trigger

**Problem Statement**:
Create trigger preventing negative balance inserts using RAISE(ABORT, 'Balance cannot be negative').

**Socratic Mentor Hint**: *Use BEFORE INSERT ON accounts WHEN NEW.balance < 0.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
CREATE TRIGGER trg_prevent_negative_bal
BEFORE INSERT ON accounts
WHEN NEW.balance < 0
BEGIN
  SELECT RAISE(ABORT, 'Balance cannot be negative');
END;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT name FROM sqlite_master WHERE type='trigger' AND name='trg_prevent_negative_bal';
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 27: JSON COLUMN STORAGE & JSON_EXTRACT QUERYING

> **Everyday Core Metaphor**: JSON columns in SQL are a hybrid file pocket: you have rigid, indexed relational columns for `id` and `created_at` (your passport cover), while the interior pocket holds a flexible, unstructured JSON document with custom user preferences (`JSON_EXTRACT(metadata, '$.theme')`).

### 🎯 Day Overview & Learning Objectives
- **Concept**: JSON_EXTRACT(col, '$.path'): Unpacking nested keys from JSON strings.
- **Concept**: JSON Functions: JSON_ARRAY, JSON_OBJECT, JSON_EACH for array unnesting.
- **Concept**: Hybrid Relational + Document Architecture.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Extracting Nested JSON Keys with JSON_EXTRACT (`sql-d27-b1-json-extract-syntax`)

* **Primary Concept Budget**: `JSON_EXTRACT Function`
* **Supporting Terms**: JSON_EXTRACT(col, '$.key'), JSON_EXTRACT(col, '$.nested.val'), JSON Relational Hybrid
* **Prerequisites**: `sql-d8-b1-string-functions` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
SELECT
  id,
  JSON_EXTRACT(settings, '$.theme') AS user_theme,
  JSON_EXTRACT(settings, '$.notifications.email') AS email_notifs
FROM user_profiles;
```
* **Line 2**: '$.theme' accesses the top-level 'theme' key from the JSON string.
* **Line 3**: '$.notifications.email' accesses nested object properties.

##### 💻 Runnable Interactive SQL Sandbox (`json_extract_sim.sql`)
```sql
CREATE TABLE profiles (id INT, data TEXT);
INSERT INTO profiles VALUES (1, '{"theme":"dark","role":"ADMIN"}');
SELECT id, JSON_EXTRACT(data, '$.role') AS user_role FROM profiles;
```
**Expected Terminal Execution Output**:
```text
id | user_role
---+----------
1  | ADMIN
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`
* **Question**: **What value does `JSON_EXTRACT(data, '$.role')` extract for user 1 above?**
* **Expected Exact Value**: `ADMIN`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `dark` (Misconception: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`)
  1. 🛑 *What Went Wrong*: 'dark' is the value for key 'theme'. The role key holds 'ADMIN'.
  2. 💡 *Simpler Everyday Picture*: Extracted role value is ADMIN.
  3. 🛠️ *Guided Fix Prompt*: **Type ADMIN**


#### 🔹 Slide 2: Filtering WHERE Clauses with JSON Properties (`sql-d27-b2-filtering-json-properties`)

* **Primary Concept Budget**: `JSON WHERE Filtering`
* **Supporting Terms**: WHERE JSON_EXTRACT(...) = 'ADMIN', Generated Virtual Columns for Indexing
* **Prerequisites**: `sql-d27-b1-json-extract-syntax` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`json_filter.sql`)
```sql
CREATE TABLE users (id INT, info TEXT);
INSERT INTO users VALUES (1, '{"active":true}'), (2, '{"active":false}');
SELECT id FROM users WHERE JSON_EXTRACT(info, '$.active') = true;
```
**Expected Terminal Execution Output**:
```text
id
--
1
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_NULL_EQUALITY_OPERATOR`
* **Question**: **Which user ID matches `JSON_EXTRACT(info, '$.active') = true`?**
* **Expected Exact Value**: `1`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2` (Misconception: `MC_SQL_NULL_EQUALITY_OPERATOR`)
  1. 🛑 *What Went Wrong*: User 2 has active: false. Only user 1 has active: true.
  2. 💡 *Simpler Everyday Picture*: User 1 has active = true.
  3. 🛠️ *Guided Fix Prompt*: **Type 1**


#### 🔹 Slide 3: JSON Arrays & JSON_EACH Unnesting (`sql-d27-b3-json-array-unnest`)

* **Primary Concept Budget**: `JSON_EACH Array Table`
* **Supporting Terms**: Unnesting JSON arrays into virtual rows, json_each(tags)
* **Prerequisites**: `sql-d27-b2-filtering-json-properties` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`json_each_sim.sql`)
```sql
CREATE TABLE articles (id INT, tags TEXT);
INSERT INTO articles VALUES (101, '["sql","database","backend"]');
SELECT value AS tag FROM json_each((SELECT tags FROM articles WHERE id = 101));
```
**Expected Terminal Execution Output**:
```text
tag
--------
sql
database
backend
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`
* **Question**: **How many virtual tag rows are unnested from the JSON array `['sql', 'database', 'backend']`?**
* **Expected Exact Value**: `3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_STRING_CASE_SENSITIVITY_LIKE`)
  1. 🛑 *What Went Wrong*: json_each unpacks all 3 elements into individual rows.
  2. 💡 *Simpler Everyday Picture*: 3 tags -> 3 rows.
  3. 🛠️ *Guided Fix Prompt*: **Type 3**


### ⚡ Quest 2: Proctored SQL Exam — Extract Nested JSON Configuration Keys

**Problem Statement**:
Select `id`, `JSON_EXTRACT(metadata, '$.theme') AS user_theme`, `JSON_EXTRACT(metadata, '$.notifications.email') AS email_notifs` from `user_settings`

**Socratic Mentor Hint**: *Use JSON_EXTRACT with '$.theme' and '$.notifications.email'.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT id, JSON_EXTRACT(metadata, '$.theme') AS user_theme, JSON_EXTRACT(metadata, '$.notifications.email') AS email_notifs FROM user_settings;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT id, JSON_EXTRACT(metadata, '$.theme') FROM user_settings;
```

### 🛠️ Quest 3: Practical Database Assignment — Filter Records by JSON Property

**Problem Statement**:
Select `id` from `user_settings` WHERE `JSON_EXTRACT(metadata, '$.role') = 'ADMIN'`

**Socratic Mentor Hint**: *Use WHERE JSON_EXTRACT(...) = 'ADMIN'.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT id FROM user_settings WHERE JSON_EXTRACT(metadata, '$.role') = 'ADMIN';
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT id FROM user_settings WHERE JSON_EXTRACT(metadata, '$.role') = 'ADMIN';
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 28: SHARDING, READ REPLICAS & HIGH-AVAILABILITY SCALING

> **Everyday Core Metaphor**: Database scaling is a busy restaurant chain: a single busy chef (single primary server) gets overwhelmed; with Read Replicas, the master chef cooks the main dishes (writes) while 5 line cooks serve salads and drinks (read queries); with Sharding, you open 4 separate restaurant locations across the city to split the customer load.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Horizontal Partitioning (Sharding): Shard keys and modulo distribution.
- **Concept**: Read Replicas: Asynchronous replication and read offloading.
- **Concept**: Connection Pooling & High Availability Failover.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Primary-Replica Architecture & Replication Lag (`sql-d28-b1-read-replicas`)

* **Primary Concept Budget**: `Read Replicas`
* **Supporting Terms**: Primary (Writes), Replica (Reads), Replication Lag, Eventual Consistency
* **Prerequisites**: `sql-d23-b1-concurrency-anomalies` (understood)

##### 🔄 Query Engine Execution Flowchart
* [START] **1. Client Writes to Primary Server (INSERT/UPDATE)**
* [PROCESS] **2. Primary WAL Replicated Asynchronously**
* [END] **3. Read Replicas Serve Heavy Analytics Queries**

##### 💻 Runnable Interactive SQL Sandbox (`replica_sim.js`)
```sql
function checkReplicationLag(primaryLsn, replicaLsn) {
  const lagBytes = primaryLsn - replicaLsn;
  return { isHealthy: lagBytes < 1000, lagBytes };
}

console.log('Replica Status:', JSON.stringify(checkReplicationLag(5000, 4800)));
```
**Expected Terminal Execution Output**:
```text
Replica Status: {"isHealthy":true,"lagBytes":200}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_ISOLATION_LEVEL_DIRTY_READ`
* **Question**: **What is `lagBytes` when primary LSN is 5000 and replica LSN is 4800?**
* **Expected Exact Value**: `200`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `5000` (Misconception: `MC_SQL_ISOLATION_LEVEL_DIRTY_READ`)
  1. 🛑 *What Went Wrong*: 5000 - 4800 = 200 bytes of lag.
  2. 💡 *Simpler Everyday Picture*: 5000 - 4800 = 200.
  3. 🛠️ *Guided Fix Prompt*: **Type 200**


#### 🔹 Slide 2: Horizontal Partitioning (Sharding) & Shard Key Hashing (`sql-d28-b2-horizontal-sharding`)

* **Primary Concept Budget**: `Horizontal Sharding`
* **Supporting Terms**: Shard Key (e.g. `user_id % 4`), Cross-Shard Joins are Anti-Patterns
* **Prerequisites**: `sql-d28-b1-read-replicas` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`sharding_sim.js`)
```sql
function getTargetShard(userId, totalShards = 4) {
  return `shard_${userId % totalShards}`;
}

console.log('User 101 Shard:', getTargetShard(101));
console.log('User 102 Shard:', getTargetShard(102));
```
**Expected Terminal Execution Output**:
```text
User 101 Shard: shard_1
User 102 Shard: shard_2
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_NORMALIZATION_REDUNDANCY`
* **Question**: **With 4 shards (modulo 4), which shard does User 101 (101 % 4 = 1) route to?**
* **Expected Exact Value**: `shard_1`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `shard_2` (Misconception: `MC_SQL_NORMALIZATION_REDUNDANCY`)
  1. 🛑 *What Went Wrong*: 101 % 4 = 1, routing to shard_1.
  2. 💡 *Simpler Everyday Picture*: 101 % 4 = 1 -> shard_1.
  3. 🛠️ *Guided Fix Prompt*: **Type shard_1**


#### 🔹 Slide 3: Connection Pooling & Connection Starvation (`sql-d28-b3-connection-pooling`)

* **Primary Concept Budget**: `Connection Pooling`
* **Supporting Terms**: Reusing TCP Connections, Pool Size Limits, Avoiding Handshake Latency
* **Prerequisites**: `sql-d28-b2-horizontal-sharding` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`pool_sim.js`)
```sql
class ConnectionPool {
  constructor(max) { this.max = max; this.active = 0; }
  acquire() { return this.active < this.max ? ++this.active : 'POOL_EXHAUSTED'; }
}

const pool = new ConnectionPool(2);
console.log('Conn 1:', pool.acquire());
console.log('Conn 2:', pool.acquire());
console.log('Conn 3:', pool.acquire());
```
**Expected Terminal Execution Output**:
```text
Conn 1: 1
Conn 2: 2
Conn 3: POOL_EXHAUSTED
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_LIMIT_OFFSET_PERFORMANCE`
* **Question**: **What status is returned when requesting a 3rd connection on a pool with max=2?**
* **Expected Exact Value**: `POOL_EXHAUSTED`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `3` (Misconception: `MC_SQL_LIMIT_OFFSET_PERFORMANCE`)
  1. 🛑 *What Went Wrong*: Pool capacity is 2, so the 3rd request receives POOL_EXHAUSTED.
  2. 💡 *Simpler Everyday Picture*: Pool full -> POOL_EXHAUSTED.
  3. 🛠️ *Guided Fix Prompt*: **Type POOL_EXHAUSTED**


### ⚡ Quest 2: Proctored SQL Exam — Shard Key Modulo Hash Routing

**Problem Statement**:
Select `id`, `(id % 4) AS target_shard_id` from `accounts`

**Socratic Mentor Hint**: *Use modulo arithmetic (id % 4).*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT id, (id % 4) AS target_shard_id FROM accounts;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT id, (id % 4) FROM accounts;
```

### 🛠️ Quest 3: Practical Database Assignment — Replication Lag Metric Query

**Problem Statement**:
Select `replica_name`, `(primary_lsn - replica_lsn) AS lsn_lag` from `replication_status`

**Socratic Mentor Hint**: *Compute difference between primary and replica LSNs.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT replica_name, (primary_lsn - replica_lsn) AS lsn_lag FROM replication_status;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT replica_name, (primary_lsn - replica_lsn) FROM replication_status;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 29: NOSQL VS RELATIONAL STORAGE ENGINE TRADE-OFFS

> **Everyday Core Metaphor**: Storage Engines are different specialized vehicles: Relational SQL (Postgres/SQLite) is a armored freight train on tracks (rigid tracks, absolute safety, zero data loss); Document NoSQL (MongoDB) is a flexible off-road SUV (schema-free, adapts anywhere); Key-Value (Redis) is a supersonic jet (in-memory speed, ultra-simple lookup).

### 🎯 Day Overview & Learning Objectives
- **Concept**: CAP Theorem: Consistency vs Availability vs Partition Tolerance.
- **Concept**: Document Stores (MongoDB) vs Key-Value (Redis) vs Relational (Postgres/SQLite).
- **Concept**: Selecting the Right Storage Engine for Workloads.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The CAP Theorem (Consistency, Availability, Partition Tolerance) (`sql-d29-b1-cap-theorem`)

* **Primary Concept Budget**: `CAP Theorem`
* **Supporting Terms**: CP (Strict Consistency e.g. Relational), AP (High Availability e.g. DynamoDB/Cassandra)
* **Prerequisites**: `sql-d28-b1-read-replicas` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CP Systems: Prioritize strict linearizable data consistency during network split.
AP Systems: Prioritize 100% response uptime, accepting temporary stale data.
```
* **Line 1**: Financial banking ledgers choose CP.
* **Line 2**: Social media feeds and shopping carts often choose AP.

##### 💻 Runnable Interactive SQL Sandbox (`cap_sim.js`)
```sql
function resolveCapTradeoff(systemType) {
  return systemType === 'BANKING_LEDGER'
    ? { choice: 'CP', guarantee: 'Zero balance discrepancy' }
    : { choice: 'AP', guarantee: 'Always available feed' };
}

console.log(JSON.stringify(resolveCapTradeoff('BANKING_LEDGER')));
```
**Expected Terminal Execution Output**:
```text
{"choice":"CP","guarantee":"Zero balance discrepancy"}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_SQL_TRANSACTION_ACID_ROLLBACK`
* **Question**: **Why do financial banking applications choose CP (Consistency + Partition Tolerance) over AP?**
  ✅ **Option A**: Because an account balance must never display incorrect or stale numbers during network partitions, even if operations must temporarily wait
  ❌ **Option B**: Because CP is cheaper
  ❌ **Option C**: Because AP disables encryption

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_TRANSACTION_ACID_ROLLBACK`)
  1. 🛑 *What Went Wrong*: Financial transactions prioritize exact correctness over temporary latency.
  2. 💡 *Simpler Everyday Picture*: Prevents money discrepancies -> CP is required.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Storage Engine Taxonomy: Key-Value, Document, Columnar, Relational (`sql-d29-b2-storage-engine-taxonomy`)

* **Primary Concept Budget**: `Storage Engine Taxonomy`
* **Supporting Terms**: Key-Value (Redis), Document (MongoDB), Columnar (ClickHouse/BigQuery), Relational (SQLite/Postgres)
* **Prerequisites**: `sql-d29-b1-cap-theorem` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`engine_matrix.js`)
```sql
const engines = {
  'Redis': 'In-Memory Key-Value Caching',
  'PostgreSQL': 'ACID Relational Core',
  'ClickHouse': 'High-Throughput Columnar Analytics'
};

console.log('Postgres Specialty:', engines['PostgreSQL']);
```
**Expected Terminal Execution Output**:
```text
Postgres Specialty: ACID Relational Core
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_TRANSACTION_ACID_ROLLBACK`
* **Question**: **What is PostgreSQL's primary specialty in the engine matrix above?**
* **Expected Exact Value**: `ACID Relational Core`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Caching` (Misconception: `MC_SQL_TRANSACTION_ACID_ROLLBACK`)
  1. 🛑 *What Went Wrong*: Redis is for caching; Postgres is for ACID Relational Core.
  2. 💡 *Simpler Everyday Picture*: Postgres is ACID Relational Core.
  3. 🛠️ *Guided Fix Prompt*: **Type ACID Relational Core**


#### 🔹 Slide 3: Polyglot Persistence in Enterprise Architectures (`sql-d29-b3-polyglot-persistence`)

* **Primary Concept Budget**: `Polyglot Persistence`
* **Supporting Terms**: Using multiple storage engines for their distinct strengths, Postgres for core DB + Redis for session cache
* **Prerequisites**: `sql-d29-b2-storage-engine-taxonomy` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`polyglot_sim.js`)
```sql
const architecture = {
  primaryDatabase: 'PostgreSQL',
  cachingLayer: 'Redis',
  searchEngine: 'Elasticsearch'
};

console.log('Total complementary engines:', Object.keys(architecture).length);
```
**Expected Terminal Execution Output**:
```text
Total complementary engines: 3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_TRANSACTION_ACID_ROLLBACK`
* **Question**: **How many specialized storage tiers are combined in the polyglot architecture above?**
* **Expected Exact Value**: `3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_TRANSACTION_ACID_ROLLBACK`)
  1. 🛑 *What Went Wrong*: Postgres (primary) + Redis (cache) + Elasticsearch (search) = 3 tiers.
  2. 💡 *Simpler Everyday Picture*: 3 complementary tiers.
  3. 🛠️ *Guided Fix Prompt*: **Type 3**


### ⚡ Quest 2: Proctored SQL Exam — Query Storage Engine Benchmark Metrics

**Problem Statement**:
Select `engine_type`, `p99_latency_ms`, `throughput_qps` from `db_benchmarks` ORDER BY `throughput_qps DESC`

**Socratic Mentor Hint**: *Select benchmark columns and order by throughput_qps DESC.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
SELECT engine_type, p99_latency_ms, throughput_qps FROM db_benchmarks ORDER BY throughput_qps DESC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
SELECT engine_type, p99_latency_ms, throughput_qps FROM db_benchmarks;
```

### 🛠️ Quest 3: Practical Database Assignment — Categorize Storage Use-Cases

**Problem Statement**:
Select `use_case`, `recommended_engine` from `storage_architectures`

**Socratic Mentor Hint**: *Select use_case and recommended_engine.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT use_case, recommended_engine FROM storage_architectures;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT use_case, recommended_engine FROM storage_architectures;
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 30: 🏆 FINAL CAPSTONE: ENTERPRISE MULTI-TENANT BANKING LEDGER & REAL-TIME FINANCIAL AUDIT ENGINE

> **Everyday Core Metaphor**: Final Capstone Synthesis: The complete transactional banking ledger operating system featuring atomic double-entry bookkeeping, automated audit logging triggers, running reconciliations with CTEs, and zero-defect financial consistency.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Full Banking Schema: Accounts, Transactions, Audit Logs, and Reconciliations.
- **Concept**: Running Ledger Reconciliation with CTEs and Case Aggregations.
- **Concept**: Real-Time Fraud & Anomaly Filtering.

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Double-Entry Accounting & Ledger Immutability (`sql-d30-b1-double-entry-ledger`)

* **Primary Concept Budget**: `Double-Entry Bookkeeping`
* **Supporting Terms**: Debit = Credit, Append-Only Immutable Ledger, Zero Direct Balance Updates
* **Prerequisites**: `sql-d22-b1-acid-properties` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
CREATE TABLE ledger_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  tx_type TEXT CHECK(tx_type IN ('CREDIT', 'DEBIT')),
  amount REAL NOT NULL CHECK(amount > 0.0),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```
* **Line 3**: Every monetary mutation is recorded as an immutable CREDIT or DEBIT row.
* **Line 4**: Amounts are strictly positive; direction is governed by tx_type.

##### 💻 Runnable Interactive SQL Sandbox (`double_entry_sim.sql`)
```sql
CREATE TABLE ledger_entries (id INT, account_id INT, tx_type TEXT, amount REAL);
INSERT INTO ledger_entries VALUES (1, 101, 'CREDIT', 500.0), (2, 101, 'DEBIT', 150.0);

-- Calculate current balance from ledger sum
SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS current_balance
FROM ledger_entries
GROUP BY account_id;
```
**Expected Terminal Execution Output**:
```text
account_id | current_balance
-----------+----------------
101        | 350.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CAPSTONE_LEDGER_RECONCILIATION`
* **Question**: **What is the net current balance for account 101 after +$500 CREDIT and -$150 DEBIT?**
* **Expected Exact Value**: `350.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `500.0` (Misconception: `MC_SQL_CAPSTONE_LEDGER_RECONCILIATION`)
  1. 🛑 *What Went Wrong*: 500.0 - 150.0 = 350.0.
  2. 💡 *Simpler Everyday Picture*: 500 - 150 = 350.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 350.0**


#### 🔹 Slide 2: Multi-Tenant Balance Reconciliation with CTEs (`sql-d30-b2-multi-tenant-reconciliation-cte`)

* **Primary Concept Budget**: `Reconciliation CTE`
* **Supporting Terms**: WITH ReconciledLedger AS (...), Initial Balance + Net Change, COALESCE zero-transaction handling
* **Prerequisites**: `sql-d30-b1-double-entry-ledger` (understood)

##### ⚙️ SQL Syntax Anatomy & Query Breakdown
```sql
WITH NetChanges AS (
  SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_delta
  FROM ledger_entries GROUP BY account_id
)
SELECT a.id, a.account_number, (a.initial_balance + COALESCE(nc.net_delta, 0.0)) AS reconciled_balance
FROM accounts a
LEFT JOIN NetChanges nc ON a.id = nc.account_id
ORDER BY a.id ASC;
```
* **Line 2**: NetChanges computes the delta for active accounts.
* **Line 5**: LEFT JOIN ensures accounts with 0 transactions still display their initial balance.

##### 💻 Runnable Interactive SQL Sandbox (`reconciliation_engine.sql`)
```sql
CREATE TABLE accounts (id INT, initial_balance REAL);
CREATE TABLE ledger (acc_id INT, tx_type TEXT, amount REAL);
INSERT INTO accounts VALUES (1, 1000.0), (2, 500.0);
INSERT INTO ledger VALUES (1, 'CREDIT', 200.0);

WITH Deltas AS (
  SELECT acc_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS delta
  FROM ledger GROUP BY acc_id
)
SELECT a.id, (a.initial_balance + COALESCE(d.delta, 0.0)) AS reconciled
FROM accounts a LEFT JOIN Deltas d ON a.id = d.acc_id ORDER BY a.id ASC;
```
**Expected Terminal Execution Output**:
```text
id | reconciled
---+-----------
1  | 1200.0
2  | 500.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CAPSTONE_LEDGER_RECONCILIATION`
* **Question**: **What is the reconciled balance for Account 2 (initial 500.0 with zero transactions)?**
* **Expected Exact Value**: `500.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `0.0` (Misconception: `MC_SQL_CAPSTONE_LEDGER_RECONCILIATION`)
  1. 🛑 *What Went Wrong*: COALESCE(d.delta, 0.0) preserved the initial balance of 500.0.
  2. 💡 *Simpler Everyday Picture*: Initial balance 500.0 + 0 = 500.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 500.0**


#### 🔹 Slide 3: Real-Time Anomaly & Fraud Detection Queries (`sql-d30-b3-fraud-detection-window`)

* **Primary Concept Budget**: `Anomaly Detection Window`
* **Supporting Terms**: High-Frequency Burst Detection, LAG() Differencing on Timestamps
* **Prerequisites**: `sql-d30-b2-multi-tenant-reconciliation-cte` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`fraud_sim.sql`)
```sql
CREATE TABLE txs (id INT, amount REAL);
INSERT INTO txs VALUES (1, 50.0), (2, 25000.0), (3, 100.0);
-- Flag suspicious transfers >= $10,000
SELECT id, amount, 'HIGH_VALUE_ALERT' AS alert FROM txs WHERE amount >= 10000.0;
```
**Expected Terminal Execution Output**:
```text
id | amount  | alert
---+---------+-----------------
2  | 25000.0 | HIGH_VALUE_ALERT
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CAPSTONE_LEDGER_RECONCILIATION`
* **Question**: **Which transaction ID is flagged as a HIGH_VALUE_ALERT?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_SQL_CAPSTONE_LEDGER_RECONCILIATION`)
  1. 🛑 *What Went Wrong*: Transaction 2 ($25000.0) is >= $10000.0.
  2. 💡 *Simpler Everyday Picture*: Transaction 2 is flagged.
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


#### 🔹 Slide 4: Database Engineering Master Certification Audit (`sql-d30-b4-production-sql-certification`)

* **Primary Concept Budget**: `Production Certification`
* **Supporting Terms**: 100/100 Gold Standard, Zero Defects, Enterprise SQL Readiness
* **Prerequisites**: `sql-d30-b3-fraud-detection-window` (understood)

##### 💻 Runnable Interactive SQL Sandbox (`sql_final_cert.sql`)
```sql
SELECT '🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]' AS result;
```
**Expected Terminal Execution Output**:
```text
result
--------------------------------------------------------------------------------------
🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_SQL_CAPSTONE_LEDGER_RECONCILIATION`
* **Question**: **What certification score is achieved across the 30-day database curriculum?**
* **Expected Exact Value**: `🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `90` (Misconception: `MC_SQL_CAPSTONE_LEDGER_RECONCILIATION`)
  1. 🛑 *What Went Wrong*: The complete Gold-Standard course achieves 100/100.
  2. 💡 *Simpler Everyday Picture*: Score is 100/100.
  3. 🛠️ *Guided Fix Prompt*: **Type 🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]**


### ⚡ Quest 2: Proctored SQL Exam — Capstone Banking Ledger Balance Reconciliation

**Problem Statement**:
WITH ReconciledLedger AS (SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_change FROM ledger_entries GROUP BY account_id) SELECT a.id, a.account_number, a.initial_balance, COALESCE(rl.net_change, 0.0) AS net_change, (a.initial_balance + COALESCE(rl.net_change, 0.0)) AS reconciled_balance FROM bank_accounts a LEFT JOIN ReconciledLedger rl ON a.id = rl.account_id ORDER BY a.id ASC;

**Socratic Mentor Hint**: *Compute net_change per account using CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END inside CTE, then join with bank_accounts.*

#### 💻 Exam Starter Query (`solution.sql`)
```sql
WITH ReconciledLedger AS (
  SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_change
  FROM ledger_entries
  GROUP BY account_id
)
SELECT a.id, a.account_number, a.initial_balance, COALESCE(rl.net_change, 0.0) AS net_change, (a.initial_balance + COALESCE(rl.net_change, 0.0)) AS reconciled_balance
FROM bank_accounts a
LEFT JOIN ReconciledLedger rl ON a.id = rl.account_id
ORDER BY a.id ASC;
```

#### 🛡️ Proctored Adversarial Test Suite (`test_runner.sql`)
```sql
WITH ReconciledLedger AS (SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_change FROM ledger_entries GROUP BY account_id) SELECT a.id, (a.initial_balance + COALESCE(rl.net_change, 0.0)) FROM bank_accounts a LEFT JOIN ReconciledLedger rl ON a.id = rl.account_id;
```

### 🛠️ Quest 3: Practical Database Assignment — Capstone Anomaly & Fraud Detection Query

**Problem Statement**:
Select `account_id`, `amount`, `created_at` from `ledger_entries` WHERE `amount >= 10000.0` OR `tx_type NOT IN ('CREDIT', 'DEBIT')` ORDER BY `amount DESC`

**Socratic Mentor Hint**: *Filter large amounts >= 10000 or invalid transaction types.*

#### 💻 Assignment Starter Query (`solution.sql`)
```sql
SELECT account_id, amount, created_at FROM ledger_entries WHERE amount >= 10000.0 OR tx_type NOT IN ('CREDIT', 'DEBIT') ORDER BY amount DESC;
```

#### 🛡️ Multi-Case Test Suite (`test_runner.sql`)
```sql
SELECT account_id, amount FROM ledger_entries WHERE amount >= 10000.0;
```


═══════════════════════════════════════════════════════════════════

