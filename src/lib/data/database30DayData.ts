import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const DATABASE_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Relational Database Theory, Tables & Candidate Keys",
    "desc": "Master relational tuples, candidate keys, composite primary keys, and entity integrity rules in relational database architecture.",
    "syllabus": [
      "Relational Model: Tables (relations), rows (tuples), and columns (attributes).",
      "Key Hierarchy: Candidate keys, primary keys, and alternate keys.",
      "Integrity Constraints: Entity integrity (no null PKs) and domain integrity."
    ],
    "eTitle": "CREATE TABLE with Composite Primary Key",
    "eDesc": "Write a SQL statement to create table `course_enrollments` with columns `student_id INT`, `course_id INT`, `enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP`, and composite PRIMARY KEY (`student_id`, `course_id`).",
    "eStarter": "-- Define course_enrollments with composite primary key (student_id, course_id)\nCREATE TABLE course_enrollments (\n  -- TODO: Add columns and composite primary key constraint\n  \n);",
    "eHint": "Specify columns student_id INT, course_id INT, enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP, and PRIMARY KEY (student_id, course_id) at the bottom.",
    "eTest": "SELECT sql FROM sqlite_master WHERE type='table' AND name='course_enrollments';\nPRAGMA table_info(course_enrollments);\nSELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='course_enrollments';",
    "aTitle": "Single-Table Employee Directory DDL",
    "aDesc": "Write a SQL statement creating table `employees` with `id INT PRIMARY KEY`, `email TEXT NOT NULL UNIQUE`, `salary REAL CHECK(salary >= 0)`.",
    "aStarter": "-- Define employees table with PK, NOT NULL UNIQUE email, and CHECK salary >= 0\nCREATE TABLE employees (\n  -- TODO: Add columns and integrity constraints\n  \n);",
    "aHint": "Specify id INT PRIMARY KEY, email TEXT NOT NULL UNIQUE, and salary REAL CHECK(salary >= 0).",
    "aTest": "SELECT sql FROM sqlite_master WHERE type='table' AND name='employees';\nPRAGMA table_info(employees);"
  },
  {
    "day": 2,
    "title": "SQL DDL: Data Types, DEFAULT Values & Constraints",
    "desc": "Define robust schemas with INTEGER, TEXT, REAL, BLOB, NOT NULL, DEFAULT values, and defensive business CHECK constraints.",
    "syllabus": [
      "SQLite / SQL Data Types: INTEGER, TEXT, REAL, NUMERIC, BLOB.",
      "Column Constraints: NOT NULL, UNIQUE, DEFAULT values.",
      "CHECK Constraints: Validating business ranges directly in the engine."
    ],
    "eTitle": "Product Inventory Table with Business Rules",
    "eDesc": "Create table `products` with `id INTEGER PRIMARY KEY AUTOINCREMENT`, `name TEXT NOT NULL`, `price REAL NOT NULL CHECK(price > 0)`, `stock INT DEFAULT 0 CHECK(stock >= 0)`.",
    "eStarter": "-- Define products table with AUTOINCREMENT, NOT NULL, DEFAULT, and CHECK constraints\nCREATE TABLE products (\n  -- TODO: Add columns and constraint definitions\n  \n);",
    "eHint": "Use INTEGER PRIMARY KEY AUTOINCREMENT for id, price REAL NOT NULL CHECK(price > 0), and stock INT DEFAULT 0 CHECK(stock >= 0).",
    "eTest": "PRAGMA table_info(products);\nSELECT sql FROM sqlite_master WHERE type='table' AND name='products';\nSELECT COUNT(*) FROM pragma_table_info('products') WHERE name IN ('id', 'name', 'price', 'stock');",
    "aTitle": "Customer Account Verification Table",
    "aDesc": "Create table `user_accounts` with `id INT PRIMARY KEY`, `username TEXT UNIQUE NOT NULL`, `status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACTIVE', 'SUSPENDED'))`.",
    "aStarter": "-- Define user_accounts table with status enum check constraint\nCREATE TABLE user_accounts (\n  -- TODO: Add columns and status check constraint\n  \n);",
    "aHint": "Use CHECK(status IN ('PENDING', 'ACTIVE', 'SUSPENDED')) and DEFAULT 'PENDING'.",
    "aTest": "PRAGMA table_info(user_accounts);\nSELECT sql FROM sqlite_master WHERE type='table' AND name='user_accounts';"
  },
  {
    "day": 3,
    "title": "SQL DML: INSERT, UPDATE, DELETE & Basic SELECT",
    "desc": "Master fundamental CRUD data manipulation commands in SQL including multi-row INSERT, conditional UPDATE with WHERE, and targeted DELETE.",
    "syllabus": [
      "INSERT INTO: Single-row and multi-row value insertion.",
      "UPDATE: Modifying specific row values safely with WHERE.",
      "DELETE: Removing rows without truncating the whole table."
    ],
    "eTitle": "Insert and Update Product Inventory",
    "eDesc": "Write SQL statements that insert a product ('Keyboard', 75.0, 10) into table products(name, price, stock) and update all products with stock < 5 to stock = 10.",
    "eStarter": "-- Step 1: Insert product ('Keyboard', 75.0, 10) into products\n-- TODO: INSERT INTO products (name, price, stock) VALUES ...;\n\n-- Step 2: Update all products with stock < 5 to stock = 10\n-- TODO: UPDATE products SET stock = 10 WHERE ...;",
    "eHint": "Execute an INSERT INTO products (name, price, stock) VALUES ('Keyboard', 75.0, 10); followed by UPDATE products SET stock = 10 WHERE stock < 5;",
    "eTest": "SELECT * FROM products WHERE name = 'Keyboard';\nSELECT COUNT(*) FROM products WHERE stock < 5;\nSELECT COUNT(*) FROM products WHERE name = 'Keyboard' AND price = 75.0 AND stock = 10;",
    "aTitle": "Deactivate Inactive User Accounts",
    "aDesc": "Write a SQL statement to UPDATE `user_accounts` setting `status = 'SUSPENDED'` WHERE `status = 'PENDING'`.",
    "aStarter": "-- Update user status from PENDING to SUSPENDED\n-- TODO: UPDATE user_accounts SET status = 'SUSPENDED' WHERE ...;",
    "aHint": "Use UPDATE user_accounts SET status = 'SUSPENDED' WHERE status = 'PENDING';",
    "aTest": "SELECT COUNT(*) FROM user_accounts WHERE status = 'PENDING';\nSELECT COUNT(*) FROM user_accounts WHERE status = 'SUSPENDED';"
  },
  {
    "day": 4,
    "title": "WHERE Filtering, Comparison Operators & NULL Handling",
    "desc": "Filter records using =, !=, <, >, <=, >=, AND, OR, NOT, and the three-valued logic of IS NULL / IS NOT NULL operators.",
    "syllabus": [
      "Comparison Operators: Equality, relational ranges, and boolean logic.",
      "The Three-Valued Logic of NULL: Why `col = NULL` fails and `IS NULL` is required.",
      "Combining Filters: Operator precedence with parentheses."
    ],
    "eTitle": "Filter Active High-Tier Customers",
    "eDesc": "Select `id`, `name`, `balance` from `customers` WHERE `balance >= 1000.0` AND `status = 'ACTIVE'` AND `deleted_at IS NULL`.",
    "eStarter": "-- Query active high-balance customers with no soft deletion timestamp\n-- TODO: SELECT id, name, balance FROM customers WHERE ...;",
    "eHint": "Combine balance >= 1000.0, status = 'ACTIVE', and deleted_at IS NULL using AND clauses.",
    "eTest": "SELECT id, name, balance FROM customers WHERE balance >= 1000.0 AND status = 'ACTIVE' AND deleted_at IS NULL;\nSELECT COUNT(*) FROM customers WHERE balance >= 1000.0 AND status = 'ACTIVE' AND deleted_at IS NULL;\nSELECT COUNT(*) FROM customers WHERE (balance < 1000.0 OR status != 'ACTIVE' OR deleted_at IS NOT NULL);",
    "aTitle": "Find Incomplete Customer Profiles",
    "aDesc": "Select `id`, `email` from `customers` WHERE `phone IS NULL` OR `address IS NULL`.",
    "aStarter": "-- Query customers missing phone or address contact information\n-- TODO: SELECT id, email FROM customers WHERE phone IS NULL OR address IS NULL;",
    "aHint": "Use phone IS NULL OR address IS NULL in the WHERE clause.",
    "aTest": "SELECT id, email FROM customers WHERE phone IS NULL OR address IS NULL;\nSELECT COUNT(*) FROM customers WHERE phone IS NULL OR address IS NULL;"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Customer Order Management Schema & CRUD Engine",
    "desc": "Milestone 1: Build a complete relational schema for Customers and Orders with Foreign Keys, Cascades, and transaction CRUD operations.",
    "syllabus": [
      "Foreign Key Constraints: REFERENCES parent(id) ON DELETE CASCADE.",
      "Referential Integrity: Enforcing valid parent-child relationships.",
      "End-to-End Schema Design: Tables, constraints, insertions, and validation."
    ],
    "eTitle": "Orders Relational Schema with Foreign Key",
    "eDesc": "Create table `orders` with `id INTEGER PRIMARY KEY`, `customer_id INT NOT NULL`, `total_amount REAL CHECK(total_amount >= 0)`, `created_at TEXT DEFAULT CURRENT_TIMESTAMP`, FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE.",
    "eStarter": "-- Create orders table with foreign key referencing customers(id) with ON DELETE CASCADE\nCREATE TABLE orders (\n  -- TODO: Define columns and FOREIGN KEY constraint\n  \n);",
    "eHint": "Define column definitions for id, customer_id, total_amount, created_at followed by FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE.",
    "eTest": "PRAGMA table_info(orders);\nPRAGMA foreign_key_list(orders);\nSELECT sql FROM sqlite_master WHERE type='table' AND name='orders';",
    "aTitle": "Insert Validated Order Records",
    "aDesc": "Insert an order `(101, 1, 249.99)` into `orders(id, customer_id, total_amount)` and select total sales for customer_id = 1.",
    "aStarter": "-- Insert order (101, 1, 249.99) and compute total sales sum for customer 1\n-- TODO: INSERT INTO orders ...; SELECT SUM(total_amount) FROM ...;",
    "aHint": "INSERT INTO orders (id, customer_id, total_amount) VALUES (101, 1, 249.99); then SELECT SUM(total_amount) FROM orders WHERE customer_id = 1;",
    "aTest": "SELECT * FROM orders WHERE id = 101;\nSELECT SUM(total_amount) FROM orders WHERE customer_id = 1;"
  },
  {
    "day": 6,
    "title": "Pattern Matching (LIKE, GLOB), IN Lists & BETWEEN Ranges",
    "desc": "Master flexible query filtering using wildcards (LIKE '%text%'), glob patterns, discrete membership (IN), and range predicates (BETWEEN).",
    "syllabus": [
      "The LIKE Operator: Wildcards `%` (any chars) and `_` (single char).",
      "The IN Operator: Discrete set membership filtering.",
      "The BETWEEN Operator: Inclusive range filtering for dates and numbers."
    ],
    "eTitle": "Filter Staff by Domain, Salary & Department",
    "eDesc": "Select `id`, `name`, `email` from `employees` WHERE `email LIKE '%@pinit.ai'` AND `salary BETWEEN 50000 AND 90000` AND `department IN ('ENG', 'AI', 'DATA')`.",
    "eStarter": "-- Query employees matching email domain, salary range, and specific departments\n-- TODO: SELECT id, name, email FROM employees WHERE ...;",
    "eHint": "Use email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA').",
    "eTest": "SELECT id, name, email FROM employees WHERE email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA');\nSELECT COUNT(*) FROM employees WHERE email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA');\nSELECT COUNT(*) FROM employees WHERE email NOT LIKE '%@pinit.ai' OR salary NOT BETWEEN 50000 AND 90000 OR department NOT IN ('ENG', 'AI', 'DATA');",
    "aTitle": "Low Stock Tech SKU Filter",
    "aDesc": "Select `name`, `sku` from `products` WHERE `sku LIKE 'TECH-%'` AND `stock IN (0, 1, 2)`.",
    "aStarter": "-- Query tech products with low stock\n-- TODO: SELECT name, sku FROM products WHERE sku LIKE 'TECH-%' AND stock IN (0, 1, 2);",
    "aHint": "Combine sku LIKE 'TECH-%' and stock IN (0, 1, 2) with AND.",
    "aTest": "SELECT name, sku FROM products WHERE sku LIKE 'TECH-%' AND stock IN (0, 1, 2);\nSELECT COUNT(*) FROM products WHERE sku LIKE 'TECH-%' AND stock IN (0, 1, 2);"
  },
  {
    "day": 7,
    "title": "ORDER BY Sorting (ASC, DESC) & LIMIT / OFFSET Pagination",
    "desc": "Control result order with multi-column sorting (ASC, DESC, NULLS LAST) and implement deterministic data pagination using LIMIT and OFFSET.",
    "syllabus": [
      "ORDER BY: Single and multi-column sorting rules.",
      "ASC vs DESC: Controlling direction per column.",
      "LIMIT & OFFSET: Implementing deterministic pagination."
    ],
    "eTitle": "Top 5 Salaries with Name Tie-Breaker",
    "eDesc": "Select `id`, `name`, `salary`, `department` from `employees` ORDER BY `salary DESC`, `name ASC` LIMIT 5 OFFSET 0.",
    "eStarter": "-- Query top 5 highest-paid employees with tie-breaker sorting\n-- TODO: SELECT id, name, salary, department FROM employees ORDER BY ... LIMIT 5 OFFSET 0;",
    "eHint": "Order by salary DESC, name ASC and append LIMIT 5 OFFSET 0.",
    "eTest": "SELECT id, name, salary, department FROM employees ORDER BY salary DESC, name ASC LIMIT 5 OFFSET 0;\nSELECT COUNT(*) FROM (SELECT id FROM employees ORDER BY salary DESC, name ASC LIMIT 5 OFFSET 0);\nSELECT MAX(salary) FROM (SELECT salary FROM employees ORDER BY salary DESC, name ASC LIMIT 5 OFFSET 0);",
    "aTitle": "Product Catalog Pagination (Page 2)",
    "aDesc": "Select `id`, `name`, `price` from `products` ORDER BY `price ASC` LIMIT 10 OFFSET 10.",
    "aStarter": "-- Query second page (items 11-20) of products by price ascending\n-- TODO: SELECT id, name, price FROM products ORDER BY price ASC LIMIT 10 OFFSET 10;",
    "aHint": "Use ORDER BY price ASC LIMIT 10 OFFSET 10.",
    "aTest": "SELECT id, name, price FROM products ORDER BY price ASC LIMIT 10 OFFSET 10;\nSELECT COUNT(*) FROM (SELECT id FROM products ORDER BY price ASC LIMIT 10 OFFSET 10);"
  },
  {
    "day": 8,
    "title": "SQL String & Date Formatting Functions",
    "desc": "Manipulate text and temporal datatypes with string concatenation (||), UPPER(), LOWER(), TRIM(), and date functions like STRFTIME().",
    "syllabus": [
      "String Concatenation: The `||` operator and formatting labels.",
      "Text Normalization: UPPER(), LOWER(), TRIM(), and LENGTH().",
      "Date Formatting: STRFTIME('%Y-%m', created_at) and DATE() extraction."
    ],
    "eTitle": "Uppercase Customer Full Name & Signup Month",
    "eDesc": "Select `UPPER(first_name || ' ' || last_name) AS full_name`, `STRFTIME('%Y-%m', created_at) AS signup_month` from `customers` ORDER BY `signup_month DESC`.",
    "eStarter": "-- Format uppercase full name and extract signup month\n-- TODO: SELECT UPPER(first_name || ' ' || last_name) AS full_name, STRFTIME('%Y-%m', created_at) AS signup_month FROM ...;",
    "eHint": "Concatenate first_name and last_name with ' ', wrap in UPPER(), and use STRFTIME('%Y-%m', created_at).",
    "eTest": "SELECT UPPER(first_name || ' ' || last_name) AS full_name, STRFTIME('%Y-%m', created_at) AS signup_month FROM customers ORDER BY signup_month DESC;\nSELECT COUNT(*) FROM customers WHERE STRFTIME('%Y-%m', created_at) IS NOT NULL;\nSELECT COUNT(*) FROM customers WHERE UPPER(first_name || ' ' || last_name) LIKE '% %';",
    "aTitle": "Sanitize Customer Email Strings",
    "aDesc": "Select `LOWER(TRIM(email)) AS clean_email`, `LENGTH(TRIM(email)) AS email_len` from `user_accounts`.",
    "aStarter": "-- Sanitize and compute length of email addresses\n-- TODO: SELECT LOWER(TRIM(email)) AS clean_email, LENGTH(TRIM(email)) AS email_len FROM user_accounts;",
    "aHint": "Wrap email with TRIM() inside LOWER() and LENGTH().",
    "aTest": "SELECT LOWER(TRIM(email)) AS clean_email, LENGTH(TRIM(email)) AS email_len FROM user_accounts;\nSELECT COUNT(*) FROM user_accounts WHERE LENGTH(TRIM(email)) > 0;"
  },
  {
    "day": 9,
    "title": "Aggregate Functions: COUNT, SUM, AVG, MIN, MAX & Numeric Rounding",
    "desc": "Summarize dataset distributions across numeric metrics using COUNT(*), COUNT(col), SUM(), AVG(), MIN(), MAX(), and ROUND().",
    "syllabus": [
      "Counting: COUNT(*) (all rows) vs COUNT(col) (non-nulls).",
      "Summation & Averages: SUM(col), AVG(col), and precision rounding with ROUND().",
      "Extremes: MIN(col) and MAX(col) boundary values."
    ],
    "eTitle": "Executive Payroll Summary Statistics",
    "eDesc": "Write a SQL query calculating `COUNT(*) AS total_staff`, `SUM(salary) AS total_payroll`, `ROUND(AVG(salary), 2) AS avg_salary`, `MIN(salary) AS min_salary`, `MAX(salary) AS max_salary` from `employees` WHERE `status = 'ACTIVE'`.",
    "eStarter": "-- Calculate overall payroll metrics for active employees\n-- TODO: SELECT COUNT(*) AS total_staff, SUM(salary) AS total_payroll, ... FROM employees WHERE status = 'ACTIVE';",
    "eHint": "Use SELECT COUNT(*) AS total_staff, SUM(salary) AS total_payroll, ROUND(AVG(salary), 2) AS avg_salary, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees WHERE status = 'ACTIVE';",
    "eTest": "SELECT COUNT(*) AS total_staff, SUM(salary) AS total_payroll, ROUND(AVG(salary), 2) AS avg_salary, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees WHERE status = 'ACTIVE';\nSELECT COUNT(*) FROM employees WHERE status = 'ACTIVE';\nSELECT SUM(salary) FROM employees WHERE status = 'ACTIVE';",
    "aTitle": "Total Inventory Valuation Summary",
    "aDesc": "Select `COUNT(id) AS total_skus`, `SUM(price * stock) AS total_inventory_value` from `products`.",
    "aStarter": "-- Calculate total product count and gross inventory value\n-- TODO: SELECT COUNT(id) AS total_skus, SUM(price * stock) AS total_inventory_value FROM products;",
    "aHint": "Multiply price by stock inside SUM: SUM(price * stock).",
    "aTest": "SELECT COUNT(id) AS total_skus, SUM(price * stock) AS total_inventory_value FROM products;\nSELECT COUNT(*) FROM products;"
  },
  {
    "day": 10,
    "title": "GROUP BY Aggregations & the HAVING Filter Clause",
    "desc": "Segment rows into categorical groups with GROUP BY and filter aggregated group results using the HAVING clause.",
    "syllabus": [
      "GROUP BY Mechanics: Partitioning rows into aggregation buckets.",
      "WHERE vs HAVING: Filtering rows BEFORE aggregation vs groups AFTER aggregation.",
      "Multi-Column Grouping: Sub-categorization and rollup ordering."
    ],
    "eTitle": "Department Staff Count & Payroll Aggregator",
    "eDesc": "Select `department`, `COUNT(*) AS emp_count`, `SUM(salary) AS total_dept_salary` from `employees` GROUP BY `department` HAVING `COUNT(*) >= 3` ORDER BY `total_dept_salary DESC`.",
    "eStarter": "-- Group staff by department and filter groups with >= 3 employees\n-- TODO: SELECT department, COUNT(*) AS emp_count, SUM(salary) AS total_dept_salary FROM employees GROUP BY ... HAVING ... ORDER BY ...;",
    "eHint": "Group by department with GROUP BY department HAVING COUNT(*) >= 3 ORDER BY total_dept_salary DESC.",
    "eTest": "SELECT department, COUNT(*) AS emp_count, SUM(salary) AS total_dept_salary FROM employees GROUP BY department HAVING COUNT(*) >= 3 ORDER BY total_dept_salary DESC;\nSELECT COUNT(*) FROM (SELECT department FROM employees GROUP BY department HAVING COUNT(*) >= 3);\nSELECT MIN(emp_count) FROM (SELECT COUNT(*) AS emp_count FROM employees GROUP BY department HAVING COUNT(*) >= 3);",
    "aTitle": "High-Value Product Categories",
    "aDesc": "Select `category`, `ROUND(AVG(price), 2) AS avg_price` from `products` GROUP BY `category` HAVING `AVG(price) > 50.0`.",
    "aStarter": "-- Find product categories with average price exceeding $50\n-- TODO: SELECT category, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 50.0;",
    "aHint": "Use GROUP BY category HAVING AVG(price) > 50.0.",
    "aTest": "SELECT category, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 50.0;\nSELECT COUNT(*) FROM (SELECT category FROM products GROUP BY category HAVING AVG(price) > 50.0);"
  },
  {
    "day": 11,
    "title": "INNER JOIN: Combining Relational Tables on Foreign Keys",
    "desc": "Combine rows from multiple tables based on related columns using INNER JOIN syntax and explicit ON predicate clauses.",
    "syllabus": [
      "Relational Joins: Inner join mechanics and intersection semantics.",
      "Table Aliasing: Using `c` for customers, `o` for orders to resolve ambiguity.",
      "Filtering & Ordering Joined Datasets."
    ],
    "eTitle": "Customer Order History INNER JOIN",
    "eDesc": "Select `c.name AS customer_name`, `o.id AS order_id`, `o.total_amount`, `o.created_at` from `customers c INNER JOIN orders o ON c.id = o.customer_id` ORDER BY `o.total_amount DESC`.",
    "eStarter": "-- Join customers and orders to retrieve customer order details\n-- TODO: SELECT c.name AS customer_name, o.id AS order_id, o.total_amount, o.created_at FROM customers c INNER JOIN orders o ON ... ORDER BY ...;",
    "eHint": "Use SELECT c.name AS customer_name, o.id AS order_id, o.total_amount, o.created_at FROM customers c INNER JOIN orders o ON c.id = o.customer_id ORDER BY o.total_amount DESC;",
    "eTest": "SELECT c.name AS customer_name, o.id AS order_id, o.total_amount, o.created_at FROM customers c INNER JOIN orders o ON c.id = o.customer_id ORDER BY o.total_amount DESC;\nSELECT COUNT(*) FROM customers c INNER JOIN orders o ON c.id = o.customer_id;\nSELECT MAX(o.total_amount) FROM customers c INNER JOIN orders o ON c.id = o.customer_id;",
    "aTitle": "Employee Department Mapping",
    "aDesc": "Select `e.name AS employee_name`, `d.name AS department_name` from `employees e INNER JOIN departments d ON e.department_id = d.id`.",
    "aStarter": "-- Map employees to their department name\n-- TODO: SELECT e.name AS employee_name, d.name AS department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;",
    "aHint": "Join on e.department_id = d.id.",
    "aTest": "SELECT e.name AS employee_name, d.name AS department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;\nSELECT COUNT(*) FROM employees e INNER JOIN departments d ON e.department_id = d.id;"
  },
  {
    "day": 12,
    "title": "LEFT OUTER JOIN & Handling Missing Parent/Child Records",
    "desc": "Preserve all records from the left table regardless of whether matching child records exist using LEFT OUTER JOIN and COALESCE() defaults.",
    "syllabus": [
      "LEFT JOIN Mechanics: Preserving unmatched parent rows with NULL placeholders.",
      "The COALESCE() Function: Converting NULL aggregates into 0.0 or default strings.",
      "Finding Orphans: Using `WHERE right_table.id IS NULL` to detect unlinked records."
    ],
    "eTitle": "All Customers with Order Metrics (Including Zero Orders)",
    "eDesc": "Select `c.id`, `c.name`, `COUNT(o.id) AS order_count`, `COALESCE(SUM(o.total_amount), 0.0) AS total_spent` from `customers c LEFT JOIN orders o ON c.id = o.customer_id` GROUP BY `c.id`, `c.name` ORDER BY `total_spent DESC`.",
    "eStarter": "-- Query all customers with order counts and spent totals, preserving customers with 0 orders\n-- TODO: SELECT c.id, c.name, COUNT(o.id) AS order_count, COALESCE(SUM(o.total_amount), 0.0) AS total_spent FROM customers c LEFT JOIN orders o ON ... GROUP BY ... ORDER BY ...;",
    "eHint": "LEFT JOIN orders on c.id = o.customer_id, count o.id (not *), wrap SUM(o.total_amount) in COALESCE(..., 0.0), and group by c.id, c.name.",
    "eTest": "SELECT c.id, c.name, COUNT(o.id) AS order_count, COALESCE(SUM(o.total_amount), 0.0) AS total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY total_spent DESC;\nSELECT COUNT(*) FROM customers;\nSELECT COUNT(*) FROM (SELECT c.id FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name);",
    "aTitle": "Detect Zero-Order Inactive Customer Accounts",
    "aDesc": "Identify dormant buyers who have never placed a transaction: perform a left join from `customers c` to `orders o` matching on customer identification, then filter with `WHERE o.id IS NULL` to project only customer names and IDs.",
    "aStarter": "-- Identify customers who have never placed an order\n-- TODO: SELECT c.id, c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;",
    "aHint": "Use LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL.",
    "aTest": "SELECT c.id, c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;\nSELECT COUNT(*) FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;"
  },
  {
    "day": 13,
    "title": "Self Joins & Multi-Table Relational Graphs",
    "desc": "Query hierarchical parent-child relationships within the same table using self joins, table aliases, and traverse multi-table relational schema graphs.",
    "syllabus": [
      "Self Joins: Joining a table to itself using distinct aliases (e.g. employee vs manager).",
      "Hierarchical Adjacency Lists: Representing organizational trees.",
      "Multi-Table Graph Traversal: Joining Orders -> Order_Items -> Products."
    ],
    "eTitle": "Employee-Manager Hierarchy Self Join",
    "eDesc": "Select `e.name AS employee_name`, `COALESCE(m.name, 'TOP_EXECUTIVE') AS manager_name` from `employees e LEFT JOIN employees m ON e.manager_id = m.id` ORDER BY `e.name ASC`.",
    "eStarter": "-- Join employees to itself to pair each employee with their direct manager\n-- TODO: SELECT e.name AS employee_name, COALESCE(m.name, 'TOP_EXECUTIVE') AS manager_name FROM employees e LEFT JOIN employees m ON ... ORDER BY ...;",
    "eHint": "Join the table to itself using aliases: FROM employees e LEFT JOIN employees m ON e.manager_id = m.id and use COALESCE(m.name, 'TOP_EXECUTIVE').",
    "eTest": "SELECT e.name AS employee_name, COALESCE(m.name, 'TOP_EXECUTIVE') AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.name ASC;\nSELECT COUNT(*) FROM employees;\nSELECT COUNT(*) FROM employees WHERE manager_id IS NULL;",
    "aTitle": "Order Line Items 3-Table Join",
    "aDesc": "Select `o.id AS order_id`, `p.name AS product_name`, `oi.quantity`, `oi.price` from `orders o INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON oi.product_id = p.id`.",
    "aStarter": "-- Query order line items with product names across 3 joined tables\n-- TODO: SELECT o.id AS order_id, p.name AS product_name, oi.quantity, oi.price FROM orders o INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON oi.product_id = p.id;",
    "aHint": "Perform two INNER JOIN operations: orders to order_items, then order_items to products.",
    "aTest": "SELECT o.id AS order_id, p.name AS product_name, oi.quantity, oi.price FROM orders o INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON oi.product_id = p.id;\nSELECT COUNT(*) FROM orders o INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON oi.product_id = p.id;"
  },
  {
    "day": 14,
    "title": "Set Operations: UNION vs UNION ALL & INTERSECT / EXCEPT",
    "desc": "Combine and compare query result sets using vertical set operations including UNION (deduplicated), UNION ALL (fast), INTERSECT, and EXCEPT.",
    "syllabus": [
      "UNION vs UNION ALL: Performance cost of deduplication.",
      "INTERSECT: Finding overlapping records across two subqueries.",
      "EXCEPT / MINUS: Finding records present in set A but absent in set B."
    ],
    "eTitle": "Unified Staff and Contractor Directory (UNION ALL)",
    "eDesc": "Select `name`, `email`, `'EMPLOYEE' AS role` from `employees` UNION ALL select `name`, `email`, `'CONTRACTOR' AS role` from `contractors` ORDER BY `name ASC`.",
    "eStarter": "-- Combine employees and contractors into a single directory using UNION ALL\n-- TODO: SELECT name, email, 'EMPLOYEE' AS role FROM employees UNION ALL SELECT ... ORDER BY name ASC;",
    "eHint": "Use UNION ALL to preserve all rows from both tables without deduplication overhead, then sort the combined result with ORDER BY name ASC.",
    "eTest": "SELECT name, email, 'EMPLOYEE' AS role FROM employees UNION ALL SELECT name, email, 'CONTRACTOR' AS role FROM contractors ORDER BY name ASC;\nSELECT COUNT(*) FROM (SELECT name, email FROM employees UNION ALL SELECT name, email FROM contractors);\nSELECT COUNT(DISTINCT email) FROM (SELECT email FROM employees UNION ALL SELECT email FROM contractors);",
    "aTitle": "Deduplicate Customer Email Directory",
    "aDesc": "Select `email` from `online_customers` UNION select `email` from `retail_customers` ORDER BY `email ASC`.",
    "aStarter": "-- Combine and deduplicate customer emails across online and retail channels\n-- TODO: SELECT email FROM online_customers UNION SELECT email FROM retail_customers ORDER BY email ASC;",
    "aHint": "Use UNION (without ALL) to eliminate duplicate emails across datasets.",
    "aTest": "SELECT email FROM online_customers UNION SELECT email FROM retail_customers ORDER BY email ASC;\nSELECT COUNT(*) FROM (SELECT email FROM online_customers UNION SELECT email FROM retail_customers);"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Multi-Store Sales Reporting & Cross-Table Business Intelligence Engine",
    "desc": "Milestone 2: Construct an executive multi-store business intelligence query combining multi-table joins, grouped aggregates, HAVING filters, and revenue rankings.",
    "syllabus": [
      "Multi-Table Joins: Stores -> Orders -> Line Items.",
      "Complex Aggregations: Revenue summation, ticket size averages, distinct order counts.",
      "Executive Threshold Filtering with HAVING and descending ranking."
    ],
    "eTitle": "Executive Store Revenue & Ticket Performance Report",
    "eDesc": "Select `s.branch_name`, `COUNT(DISTINCT o.id) AS total_orders`, `SUM(o.total_amount) AS revenue`, `ROUND(AVG(o.total_amount), 2) AS avg_ticket` from `stores s INNER JOIN orders o ON s.id = o.store_id` GROUP BY `s.id`, `s.branch_name` HAVING `SUM(o.total_amount) >= 10000` ORDER BY `revenue DESC`.",
    "eStarter": "-- Build store revenue BI report with multi-table joins, distinct order counts, and revenue filtering\n-- TODO: SELECT s.branch_name, COUNT(DISTINCT o.id) AS total_orders, ... FROM stores s INNER JOIN orders o ON ... GROUP BY ... HAVING ... ORDER BY ...;",
    "eHint": "Join stores to orders on s.id = o.store_id, compute COUNT(DISTINCT o.id), SUM(o.total_amount), ROUND(AVG(o.total_amount), 2), filter with HAVING SUM(o.total_amount) >= 10000, and ORDER BY revenue DESC.",
    "eTest": "SELECT s.branch_name, COUNT(DISTINCT o.id) AS total_orders, SUM(o.total_amount) AS revenue, ROUND(AVG(o.total_amount), 2) AS avg_ticket FROM stores s INNER JOIN orders o ON s.id = o.store_id GROUP BY s.id, s.branch_name HAVING SUM(o.total_amount) >= 10000 ORDER BY revenue DESC;\nSELECT COUNT(*) FROM (SELECT s.id FROM stores s INNER JOIN orders o ON s.id = o.store_id GROUP BY s.id HAVING SUM(o.total_amount) >= 10000);\nSELECT MAX(revenue) FROM (SELECT SUM(o.total_amount) AS revenue FROM stores s INNER JOIN orders o ON s.id = o.store_id GROUP BY s.id HAVING SUM(o.total_amount) >= 10000);",
    "aTitle": "Category Inventory Valuation by Store",
    "aDesc": "Select `s.branch_name`, `p.category`, `SUM(p.price * p.stock) AS category_value` from `stores s INNER JOIN products p ON s.id = p.store_id` GROUP BY `s.branch_name`, `p.category`.",
    "aStarter": "-- Compute total inventory valuation per category per store branch\n-- TODO: SELECT s.branch_name, p.category, SUM(p.price * p.stock) AS category_value FROM stores s INNER JOIN products p ON s.id = p.store_id GROUP BY s.branch_name, p.category;",
    "aHint": "Join stores and products on s.id = p.store_id and group by s.branch_name, p.category.",
    "aTest": "SELECT s.branch_name, p.category, SUM(p.price * p.stock) AS category_value FROM stores s INNER JOIN products p ON s.id = p.store_id GROUP BY s.branch_name, p.category;\nSELECT COUNT(*) FROM (SELECT s.branch_name, p.category FROM stores s INNER JOIN products p ON s.id = p.store_id GROUP BY s.branch_name, p.category);"
  },
  {
    "day": 16,
    "title": "Subqueries: Scalar, Column Lists & Correlated Subqueries",
    "desc": "Master nested subqueries in SELECT, WHERE, and FROM clauses, evaluating scalar expressions and correlated subqueries with outer references.",
    "syllabus": [
      "Scalar Subqueries: Queries returning a single row and column.",
      "Correlated Subqueries: Subqueries referencing columns from the outer query.",
      "EXISTS vs IN: Performance implications for membership tests."
    ],
    "eTitle": "Employees Earning Above Department Average",
    "eDesc": "Select `e.id`, `e.name`, `e.salary`, `e.department_id` from `employees e` WHERE `e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id)` ORDER BY `e.salary DESC`.",
    "eStarter": "-- Find employees earning more than their department's average salary using a correlated subquery\n-- TODO: SELECT e.id, e.name, e.salary, e.department_id FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id) ORDER BY ...;",
    "eHint": "Write a correlated subquery in the WHERE clause: WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id).",
    "eTest": "SELECT e.id, e.name, e.salary, e.department_id FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id) ORDER BY e.salary DESC;\nSELECT COUNT(*) FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);\nSELECT COUNT(*) FROM employees;",
    "aTitle": "Products Priced Above Global Average",
    "aDesc": "Select `id`, `name`, `price` from `products` WHERE `price > (SELECT AVG(price) FROM products)` ORDER BY `price DESC`.",
    "aStarter": "-- Find products with price above the overall catalog average\n-- TODO: SELECT id, name, price FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price DESC;",
    "aHint": "Use scalar subquery WHERE price > (SELECT AVG(price) FROM products).",
    "aTest": "SELECT id, name, price FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price DESC;\nSELECT COUNT(*) FROM products WHERE price > (SELECT AVG(price) FROM products);"
  },
  {
    "day": 17,
    "title": "Common Table Expressions (WITH CTEs & Recursive CTEs)",
    "desc": "Structure complex nested queries with readable Common Table Expressions (WITH CTE AS (...)) and solve graph/hierarchy traversals with RECURSIVE CTEs.",
    "syllabus": [
      "Non-Recursive CTEs: Improving readability by declaring intermediate result sets.",
      "Recursive CTEs: Base case UNION ALL recursive step for hierarchical data.",
      "Number/Date Generators: Using recursive CTEs to generate ranges without helper tables."
    ],
    "eTitle": "VIP Customer Spend CTE",
    "eDesc": "Write a CTE `CustomerSpend` summing `total_amount AS total_spent` per customer from `orders`, then select `c.name`, `cs.total_spent` from `customers c INNER JOIN CustomerSpend cs ON c.id = cs.customer_id` WHERE `cs.total_spent > 500` ORDER BY `cs.total_spent DESC`.",
    "eStarter": "-- Define CustomerSpend CTE and filter customers spending > 500\n-- TODO: WITH CustomerSpend AS (\n--   SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id\n-- ) SELECT c.name, cs.total_spent FROM customers c INNER JOIN CustomerSpend cs ...;",
    "eHint": "Define `WITH CustomerSpend AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id)` then query it joined to customers.",
    "eTest": "WITH CustomerSpend AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) SELECT c.name, cs.total_spent FROM customers c INNER JOIN CustomerSpend cs ON c.id = cs.customer_id WHERE cs.total_spent > 500 ORDER BY cs.total_spent DESC;\nSELECT COUNT(*) FROM orders;\nSELECT COUNT(DISTINCT customer_id) FROM orders;",
    "aTitle": "Recursive Number Generator (1 to 10)",
    "aDesc": "Write a recursive CTE `NumberSeq(n)` generating numbers 1 through 10 and select `n` from `NumberSeq`.",
    "aStarter": "-- Generate numbers 1 to 10 using recursive CTE\n-- TODO: WITH RECURSIVE NumberSeq(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM NumberSeq WHERE n < 10) SELECT n FROM NumberSeq;",
    "aHint": "Base case is SELECT 1, recursive step is SELECT n + 1 FROM NumberSeq WHERE n < 10.",
    "aTest": "WITH RECURSIVE NumberSeq(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM NumberSeq WHERE n < 10) SELECT n FROM NumberSeq;\nSELECT COUNT(*) FROM (WITH RECURSIVE NumberSeq(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM NumberSeq WHERE n < 10) SELECT n FROM NumberSeq);"
  },
  {
    "day": 18,
    "title": "Window Functions: ROW_NUMBER(), RANK() & DENSE_RANK()",
    "desc": "Perform analytical ranking and ordering calculations across partitions without collapsing rows using ROW_NUMBER(), RANK(), and DENSE_RANK().",
    "syllabus": [
      "Window Architecture: The `OVER (PARTITION BY ... ORDER BY ...)` clause.",
      "ROW_NUMBER() vs RANK() vs DENSE_RANK(): Handling ties and gap numbering.",
      "Top-N per Category Analysis without self-joins."
    ],
    "eTitle": "Salary Ranking by Department (DENSE_RANK)",
    "eDesc": "Select `id`, `name`, `department`, `salary`, `DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank` from `employees` ORDER BY `department`, `dept_salary_rank`.",
    "eStarter": "-- Rank employees by salary within each department without ranking gaps\n-- TODO: SELECT id, name, department, salary, DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank FROM employees ORDER BY ...;",
    "eHint": "Use DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank in the SELECT clause.",
    "eTest": "SELECT id, name, department, salary, DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank FROM employees ORDER BY department, dept_salary_rank;\nSELECT COUNT(*) FROM employees;\nSELECT COUNT(DISTINCT department) FROM employees;",
    "aTitle": "Customer Order Chronological Sequence",
    "aDesc": "Select `id`, `customer_id`, `total_amount`, `ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq` from `orders`.",
    "aStarter": "-- Assign sequential order numbers per customer chronologically\n-- TODO: SELECT id, customer_id, total_amount, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq FROM orders;",
    "aHint": "Use ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC).",
    "aTest": "SELECT id, customer_id, total_amount, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq FROM orders;\nSELECT COUNT(*) FROM orders;"
  },
  {
    "day": 19,
    "title": "Window Aggregates: Running Totals & Moving Averages",
    "desc": "Calculate continuous time-series metrics including cumulative running totals and sliding frame moving averages using window specifications.",
    "syllabus": [
      "Frame Specifications: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.",
      "Moving Window Averages: `ROWS BETWEEN N PRECEDING AND CURRENT ROW`.",
      "Financial Time-Series Analysis in Pure SQL."
    ],
    "eTitle": "Cumulative Running Total Revenue",
    "eDesc": "Select `date(created_at) AS order_day`, `total_amount`, `SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total` from `orders` ORDER BY `created_at ASC`.",
    "eStarter": "-- Calculate continuous cumulative revenue running total over all orders\n-- TODO: SELECT date(created_at) AS order_day, total_amount, SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM orders ORDER BY created_at ASC;",
    "eHint": "Use SUM(total_amount) OVER (ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total.",
    "eTest": "SELECT date(created_at) AS order_day, total_amount, SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM orders ORDER BY created_at ASC;\nSELECT COUNT(*) FROM orders;\nSELECT SUM(total_amount) FROM orders;",
    "aTitle": "Sliding Frame 3-Order Moving Average Calculation",
    "aDesc": "Construct a financial trend monitor: compute a 3-entry moving average of transaction values across sequential purchases using `ROUND(AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3`.",
    "aStarter": "-- Compute 3-order sliding moving average of order values\n-- TODO: SELECT id, total_amount, ROUND(AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3 FROM orders;",
    "aHint": "Use AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW).",
    "aTest": "SELECT id, total_amount, ROUND(AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3 FROM orders;\nSELECT COUNT(*) FROM orders;"
  },
  {
    "day": 20,
    "title": "Database Indexing: B-Tree Indexes & Composite Index Performance",
    "desc": "Accelerate query execution speeds using B-Tree index structures, composite multi-column indexing, unique indexes, and covering indexes.",
    "syllabus": [
      "B-Tree Index Anatomy: Tree balance, leaf nodes, and pointer lookup overhead.",
      "Composite Index Left-Prefix Rule: Column ordering (equality first, range second).",
      "Index Selectivity: When indexes help vs when they cause scan overhead."
    ],
    "eTitle": "Composite Multi-Column Customer Orders Index",
    "eDesc": "Create composite index `idx_orders_cust_date` on table `orders` covering `customer_id` and `created_at DESC`.",
    "eStarter": "-- Create composite B-Tree index on orders table\n-- TODO: CREATE INDEX idx_orders_cust_date ON orders(customer_id, created_at DESC);",
    "eHint": "Use CREATE INDEX idx_orders_cust_date ON orders(customer_id, created_at DESC);",
    "eTest": "SELECT name, tbl_name FROM sqlite_master WHERE type = 'index' AND name = 'idx_orders_cust_date';\nPRAGMA index_info(idx_orders_cust_date);\nSELECT COUNT(*) FROM sqlite_master WHERE type = 'index' AND name = 'idx_orders_cust_date';",
    "aTitle": "Unique Email Index on User Accounts",
    "aDesc": "Create a unique index `idx_users_email_unique` on table `user_accounts` for column `email`.",
    "aStarter": "-- Enforce unique email lookup speed with unique index\n-- TODO: CREATE UNIQUE INDEX idx_users_email_unique ON user_accounts(email);",
    "aHint": "Use CREATE UNIQUE INDEX idx_users_email_unique ON user_accounts(email);",
    "aTest": "SELECT name, tbl_name FROM sqlite_master WHERE type = 'index' AND name = 'idx_users_email_unique';\nPRAGMA index_info(idx_users_email_unique);"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Enterprise Query Optimizer & EXPLAIN QUERY PLAN Diagnostics",
    "desc": "Milestone 3: Analyze and tune query execution plans using EXPLAIN QUERY PLAN, diagnosing full-table scans (SCAN) versus indexed B-Tree searches (SEARCH).",
    "syllabus": [
      "Query Plan Interpretation: SCAN (full table scan) vs SEARCH (B-tree index lookup).",
      "Covering Indexes: Executing queries entirely in index memory without row lookups.",
      "Diagnosing Performance Bottlenecks and Missing Index Regressions."
    ],
    "eTitle": "EXPLAIN QUERY PLAN Index Search Diagnostic",
    "eDesc": "Run an EXPLAIN QUERY PLAN diagnostic for `SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC`.",
    "eStarter": "-- Execute query plan inspection to verify indexed search vs full table scan\n-- TODO: EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC;",
    "eHint": "Prepend `EXPLAIN QUERY PLAN` directly before the SELECT query to output the engine's access path (SCAN vs SEARCH).",
    "eTest": "SELECT * FROM (EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC);\nSELECT COUNT(*) FROM orders WHERE customer_id = 42;\nSELECT id, name FROM sqlite_master WHERE type='index' AND tbl_name='orders';",
    "aTitle": "Verify Unique Index Query Plan",
    "aDesc": "Run an EXPLAIN QUERY PLAN diagnostic on `SELECT * FROM user_accounts WHERE email = 'test@pinit.ai'`.",
    "aStarter": "-- Inspect execution plan for unique email lookup\n-- TODO: EXPLAIN QUERY PLAN SELECT * FROM user_accounts WHERE email = 'test@pinit.ai';",
    "aHint": "Prepend EXPLAIN QUERY PLAN before SELECT * FROM user_accounts WHERE email = 'test@pinit.ai';",
    "aTest": "SELECT * FROM (EXPLAIN QUERY PLAN SELECT * FROM user_accounts WHERE email = 'test@pinit.ai');\nSELECT COUNT(*) FROM user_accounts WHERE email = 'test@pinit.ai';"
  },
  {
    "day": 22,
    "title": "Transactions & ACID Guarantees: BEGIN, COMMIT, ROLLBACK & Savepoints",
    "desc": "Guarantee Atomicity, Consistency, Isolation, and Durability (ACID) using explicit transaction boundaries (BEGIN, COMMIT, ROLLBACK, SAVEPOINT).",
    "syllabus": [
      "ACID Architecture: The 4 pillars of reliable enterprise database systems.",
      "Transaction Blocks: BEGIN TRANSACTION, COMMIT, and ROLLBACK.",
      "Savepoints: Partial rollbacks within nested transaction blocks."
    ],
    "eTitle": "Atomic Funds Transfer Transaction",
    "eDesc": "Write an atomic transaction block: `BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;`.",
    "eStarter": "-- Execute atomic money transfer across accounts within a single transaction\n-- TODO:\n-- BEGIN TRANSACTION;\n-- UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n-- UPDATE accounts SET balance = balance + 100 WHERE id = 2;\n-- COMMIT;",
    "eHint": "Wrap both UPDATE statements between BEGIN TRANSACTION and COMMIT to ensure atomic funds transfer.",
    "eTest": "SELECT id, balance FROM accounts WHERE id IN (1, 2);\nSELECT SUM(balance) FROM accounts WHERE id IN (1, 2);\nSELECT COUNT(*) FROM accounts WHERE id IN (1, 2);",
    "aTitle": "Transaction Rollback Discard",
    "aDesc": "Execute an atomic rollback transaction to safely discard experimental state changes before saving.",
    "aStarter": "-- Begin transaction and execute ROLLBACK to discard all interim modifications\n-- TODO: BEGIN TRANSACTION; ROLLBACK;",
    "aHint": "Execute BEGIN TRANSACTION followed by ROLLBACK.",
    "aTest": "SELECT COUNT(*) FROM accounts;\nSELECT SUM(balance) FROM accounts;"
  },
  {
    "day": 23,
    "title": "Concurrency & Isolation Levels: Dirty Reads to Serializable Isolation",
    "desc": "Manage multi-user database concurrency, understand transaction isolation anomalies (dirty reads, non-repeatable reads, phantom reads), and WAL mode.",
    "syllabus": [
      "Isolation Anomalies: Dirty reads, non-repeatable reads, phantom reads.",
      "Standard Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.",
      "SQLite Concurrency Model: WAL (Write-Ahead Logging) mode and concurrent readers."
    ],
    "eTitle": "Enable Write-Ahead Logging (WAL Concurrency)",
    "eDesc": "Execute `PRAGMA journal_mode = WAL;` to enable SQLite Write-Ahead Logging for high-concurrency read/write operations.",
    "eStarter": "-- Configure SQLite database engine for multi-connection WAL concurrency\n-- TODO: PRAGMA journal_mode = WAL;",
    "eHint": "Run `PRAGMA journal_mode = WAL;` to switch SQLite from rollback journal to WAL mode.",
    "eTest": "PRAGMA journal_mode;\nPRAGMA busy_timeout;\nSELECT COUNT(*) FROM sqlite_master;",
    "aTitle": "Enforce Relational Foreign Keys Pragma",
    "aDesc": "Execute `PRAGMA foreign_keys = ON;` to enable active referential integrity enforcement at the database connection level.",
    "aStarter": "-- Enable foreign key referential integrity checks\n-- TODO: PRAGMA foreign_keys = ON;",
    "aHint": "Execute PRAGMA foreign_keys = ON; directly.",
    "aTest": "PRAGMA foreign_keys;\nSELECT COUNT(*) FROM sqlite_master WHERE type = 'table';"
  },
  {
    "day": 24,
    "title": "Database Normalization: 1NF, 2NF, 3NF & Boyce-Codd (BCNF)",
    "desc": "Eliminate data redundancy and update anomalies through systematic schema decomposition into First (1NF), Second (2NF), and Third Normal Form (3NF).",
    "syllabus": [
      "1NF: Atomic column values and unique rows.",
      "2NF: No partial dependency on composite primary keys.",
      "3NF / BCNF: Eliminating transitive dependencies between non-key attributes."
    ],
    "eTitle": "3NF Normalized Category and Item Tables",
    "eDesc": "Create normalized 3NF tables: `categories(id INT PRIMARY KEY, name TEXT UNIQUE NOT NULL)` and `items(id INT PRIMARY KEY, category_id INT REFERENCES categories(id), name TEXT NOT NULL)`.",
    "eStarter": "-- Create normalized 3NF tables for categories and items to eliminate transitive anomalies\n-- TODO: CREATE TABLE categories (...);\n-- TODO: CREATE TABLE items (...);",
    "eHint": "Create categories(id INT PRIMARY KEY, name TEXT UNIQUE NOT NULL) first, then items(id INT PRIMARY KEY, category_id INT REFERENCES categories(id), name TEXT NOT NULL).",
    "eTest": "PRAGMA table_info(categories);\nPRAGMA table_info(items);\nPRAGMA foreign_key_list(items);",
    "aTitle": "2NF Composite Invoice Line Schema",
    "aDesc": "Create table `invoice_lines` with `invoice_id INT`, `line_num INT`, `amount REAL`, PRIMARY KEY (`invoice_id`, `line_num`).",
    "aStarter": "-- Define composite 2NF invoice_lines table\n-- TODO: CREATE TABLE invoice_lines (invoice_id INT, line_num INT, amount REAL, PRIMARY KEY (invoice_id, line_num));",
    "aHint": "Declare composite PRIMARY KEY (invoice_id, line_num).",
    "aTest": "PRAGMA table_info(invoice_lines);\nSELECT sql FROM sqlite_master WHERE type='table' AND name='invoice_lines';"
  },
  {
    "day": 25,
    "title": "SQL Views & Materialized Views for Abstract Query Layering",
    "desc": "Encapsulate complex multi-table joins and aggregations into reusable logical abstractions using SQL CREATE VIEW and materialized views.",
    "syllabus": [
      "Virtual Tables: Defining reusable query representations with CREATE VIEW.",
      "Security & Access Control: Exposing filtered column subsets through views.",
      "Materialized Views: Caching computed query outputs for ultra-fast reads."
    ],
    "eTitle": "Customer Lifetime Revenue VIEW",
    "eDesc": "Create view `v_customer_revenue` as `SELECT c.id, c.name, COALESCE(SUM(o.total_amount), 0.0) AS total_revenue FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name`.",
    "eStarter": "-- Create reusable logical view for customer revenue calculation\n-- TODO: CREATE VIEW v_customer_revenue AS SELECT c.id, c.name, COALESCE(SUM(o.total_amount), 0.0) AS total_revenue FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;",
    "eHint": "Use CREATE VIEW v_customer_revenue AS SELECT c.id, c.name, COALESCE(SUM(o.total_amount), 0.0) AS total_revenue FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;",
    "eTest": "SELECT * FROM v_customer_revenue ORDER BY total_revenue DESC LIMIT 5;\nSELECT COUNT(*) FROM v_customer_revenue;\nSELECT name FROM sqlite_master WHERE type = 'view' AND name = 'v_customer_revenue';",
    "aTitle": "Active Staff Directory View",
    "aDesc": "Create view `v_active_staff` as `SELECT id, name, email FROM employees WHERE status = 'ACTIVE'`.",
    "aStarter": "-- Create security view filtering only active employees\n-- TODO: CREATE VIEW v_active_staff AS SELECT id, name, email FROM employees WHERE status = 'ACTIVE';",
    "aHint": "CREATE VIEW v_active_staff AS SELECT id, name, email FROM employees WHERE status = 'ACTIVE';",
    "aTest": "SELECT * FROM v_active_staff LIMIT 5;\nSELECT COUNT(*) FROM v_active_staff;"
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 4: Real-Time Audit Log Trigger & Invariant Enforcement",
    "desc": "Milestone 4: Build automated database triggers using AFTER UPDATE and BEFORE INSERT to maintain immutable audit trails and enforce domain invariants.",
    "syllabus": [
      "Database Triggers: Event-driven execution (BEFORE/AFTER INSERT, UPDATE, DELETE).",
      "OLD vs NEW Row Qualifiers: Comparing pre-mutation and post-mutation state.",
      "Enforcing Business Invariants: Using RAISE(ABORT, 'message') to reject invalid writes."
    ],
    "eTitle": "Account Balance Change Audit Trigger",
    "eDesc": "Create trigger `trg_audit_balance_change` AFTER UPDATE OF `balance` ON `accounts` BEGIN `INSERT INTO account_audit (account_id, old_bal, new_bal, changed_at) VALUES (OLD.id, OLD.balance, NEW.balance, CURRENT_TIMESTAMP);` END;",
    "eStarter": "-- Create trigger on accounts to automatically write an audit log row whenever balance updates\n-- TODO:\n-- CREATE TRIGGER trg_audit_balance_change AFTER UPDATE OF balance ON accounts\n-- BEGIN\n--   INSERT INTO account_audit (account_id, old_bal, new_bal, changed_at)\n--   VALUES (OLD.id, OLD.balance, NEW.balance, CURRENT_TIMESTAMP);\n-- END;",
    "eHint": "Define `CREATE TRIGGER trg_audit_balance_change AFTER UPDATE OF balance ON accounts BEGIN INSERT INTO account_audit (account_id, old_bal, new_bal, changed_at) VALUES (OLD.id, OLD.balance, NEW.balance, CURRENT_TIMESTAMP); END;`.",
    "eTest": "SELECT name, tbl_name FROM sqlite_master WHERE type = 'trigger' AND name = 'trg_audit_balance_change';\nSELECT COUNT(*) FROM sqlite_master WHERE type = 'trigger' AND name = 'trg_audit_balance_change';\nPRAGMA table_info(account_audit);",
    "aTitle": "Prevent Negative Balance Insert Trigger",
    "aDesc": "Create trigger `trg_prevent_negative_bal` BEFORE INSERT ON `accounts` WHEN `NEW.balance < 0` BEGIN `SELECT RAISE(ABORT, 'Balance cannot be negative');` END;",
    "aStarter": "-- Create trigger rejecting inserts with negative initial balance\n-- TODO: CREATE TRIGGER trg_prevent_negative_bal BEFORE INSERT ON accounts WHEN NEW.balance < 0 BEGIN SELECT RAISE(ABORT, 'Balance cannot be negative'); END;",
    "aHint": "Use BEFORE INSERT ON accounts WHEN NEW.balance < 0 BEGIN SELECT RAISE(ABORT, 'Balance cannot be negative'); END;.",
    "aTest": "SELECT name, tbl_name FROM sqlite_master WHERE type = 'trigger' AND name = 'trg_prevent_negative_bal';\nSELECT COUNT(*) FROM sqlite_master WHERE type = 'trigger';"
  },
  {
    "day": 27,
    "title": "JSON Column Storage & JSON_EXTRACT Querying in Relational Tables",
    "desc": "Store flexible schema-less document payloads in relational columns and query semi-structured data using JSON_EXTRACT, JSON_ARRAY, and JSON_OBJECT.",
    "syllabus": [
      "Hybrid Relational-Document Architecture: Mixing rigid SQL columns with JSON blobs.",
      "JSON Operators: JSON_EXTRACT(col, '$.path.to.field').",
      "Indexing JSON Fields: Generated columns and expression-based indexes."
    ],
    "eTitle": "Extract Structured Attributes from JSON Metadata",
    "eDesc": "Select `id`, `JSON_EXTRACT(metadata, '$.theme') AS user_theme`, `JSON_EXTRACT(metadata, '$.notifications.email') AS email_notifs` from `user_settings`.",
    "eStarter": "-- Query JSON fields using JSON_EXTRACT path notation\n-- TODO: SELECT id, JSON_EXTRACT(metadata, '$.theme') AS user_theme, JSON_EXTRACT(metadata, '$.notifications.email') AS email_notifs FROM user_settings;",
    "eHint": "Use JSON_EXTRACT(metadata, '$.theme') and JSON_EXTRACT(metadata, '$.notifications.email') from user_settings.",
    "eTest": "SELECT id, JSON_EXTRACT(metadata, '$.theme') AS user_theme, JSON_EXTRACT(metadata, '$.notifications.email') AS email_notifs FROM user_settings;\nSELECT COUNT(*) FROM user_settings WHERE JSON_EXTRACT(metadata, '$.theme') IS NOT NULL;\nSELECT COUNT(*) FROM user_settings;",
    "aTitle": "Administrative Role Document Filter",
    "aDesc": "Search the configuration store for privileged operators: query the table `user_settings` to retrieve primary key IDs where the document property expression `JSON_EXTRACT(metadata, '$.role')` matches the text literal 'ADMIN'.",
    "aStarter": "-- Find users where JSON metadata role property equals 'ADMIN'\n-- TODO: SELECT id FROM user_settings WHERE JSON_EXTRACT(metadata, '$.role') = 'ADMIN';",
    "aHint": "Use WHERE JSON_EXTRACT(metadata, '$.role') = 'ADMIN'.",
    "aTest": "SELECT id FROM user_settings WHERE JSON_EXTRACT(metadata, '$.role') = 'ADMIN';\nSELECT COUNT(*) FROM user_settings WHERE JSON_EXTRACT(metadata, '$.role') = 'ADMIN';"
  },
  {
    "day": 28,
    "title": "Sharding, Read Replicas & High-Availability Database Architectures",
    "desc": "Design horizontally scalable database architectures using hash sharding formulas, write-master / read-replica topologies, and replication lag monitoring.",
    "syllabus": [
      "Horizontal Partitioning (Sharding): Key-based vs Range-based shard routing.",
      "Master-Replica Topology: Scaling read throughput across geographic replica pools.",
      "Replication Lag Monitoring: Tracking LSN (Log Sequence Number) deltas."
    ],
    "eTitle": "Hash Shard Partition Router Expression",
    "eDesc": "Write a SQL query calculating target partition shard ID using modulo math `(id % 4) AS target_shard_id` from table `accounts`.",
    "eStarter": "-- Route account rows to 4 horizontal shards using modulo hashing\n-- TODO: SELECT id, (id % 4) AS target_shard_id FROM accounts;",
    "eHint": "Use the modulo operator: `SELECT id, (id % 4) AS target_shard_id FROM accounts;` to distribute account IDs evenly across 4 shards.",
    "eTest": "SELECT id, (id % 4) AS target_shard_id FROM accounts;\nSELECT COUNT(DISTINCT (id % 4)) FROM accounts;\nSELECT COUNT(*) FROM accounts;",
    "aTitle": "Replication Lag Metric Calculator",
    "aDesc": "Calculate log sequence number (LSN) replication lag between primary master and read replicas.",
    "aStarter": "-- Calculate replication offset lag between primary and replica LSN coordinates\n-- TODO: SELECT replica_name, (primary_lsn - replica_lsn) AS lsn_lag FROM replication_status;",
    "aHint": "Select replica_name, (primary_lsn - replica_lsn) AS lsn_lag from replication_status.",
    "aTest": "SELECT replica_name, (primary_lsn - replica_lsn) AS lsn_lag FROM replication_status;\nSELECT COUNT(*) FROM replication_status WHERE (primary_lsn - replica_lsn) > 0;"
  },
  {
    "day": 29,
    "title": "NoSQL vs Relational Storage Engine Trade-offs & Polyglot Persistence",
    "desc": "Evaluate performance and consistency trade-offs between ACID relational databases, key-value caches, document stores, and wide-column NoSQL engines.",
    "syllabus": [
      "CAP Theorem & Trade-offs: Consistency vs Availability vs Partition tolerance.",
      "Polyglot Architecture: Right storage engine for the right data access pattern.",
      "Query Performance Benchmarking: p99 latency vs throughput QPS."
    ],
    "eTitle": "Storage Benchmark Metrics Evaluation",
    "eDesc": "Write a SQL query selecting `engine_type`, `p99_latency_ms`, `throughput_qps` from `db_benchmarks` ordered by `throughput_qps` descending.",
    "eStarter": "-- Query engine benchmark metrics sorted by throughput QPS descending\n-- TODO: SELECT engine_type, p99_latency_ms, throughput_qps FROM db_benchmarks ORDER BY throughput_qps DESC;",
    "eHint": "Query db_benchmarks selecting engine_type, p99_latency_ms, and throughput_qps, sorting with ORDER BY throughput_qps DESC.",
    "eTest": "SELECT engine_type, p99_latency_ms, throughput_qps FROM db_benchmarks ORDER BY throughput_qps DESC;\nSELECT COUNT(*) FROM db_benchmarks WHERE p99_latency_ms < 5.0;\nSELECT MAX(throughput_qps) FROM db_benchmarks;",
    "aTitle": "Polyglot Architecture Engine Recommendation Lookup",
    "aDesc": "Query polyglot persistence architecture recommendation table to match optimal database engine per workload.",
    "aStarter": "-- Retrieve recommended database engines for specific access patterns\n-- TODO: SELECT use_case, recommended_engine FROM storage_architectures;",
    "aHint": "SELECT use_case, recommended_engine FROM storage_architectures.",
    "aTest": "SELECT use_case, recommended_engine FROM storage_architectures;\nSELECT COUNT(*) FROM storage_architectures;"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Multi-Tenant Banking Ledger & Reconciler",
    "desc": "The ultimate synthesis of PinIT Relational Database Engineering: end-to-end multi-tenant financial transaction ledger, double-entry balance reconciler, defensive anomaly detector, and audit summary view.",
    "syllabus": [
      "Full Schema Architecture: Multi-tenant isolation and foreign key cascade rules.",
      "Double-Entry Reconciliation: Reconciling initial balance + sum(credits) - sum(debits) using CTEs.",
      "Final Capstone Certification Evaluation."
    ],
    "eTitle": "Final Capstone: Banking Ledger Balance Reconciler",
    "eDesc": "Write a CTE `ReconciledLedger` calculating net change per account (`SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END)`), then select `a.id`, `a.account_number`, `a.initial_balance`, `COALESCE(rl.net_change, 0.0) AS net_change`, `(a.initial_balance + COALESCE(rl.net_change, 0.0)) AS reconciled_balance` from `bank_accounts a LEFT JOIN ReconciledLedger rl ON a.id = rl.account_id` ORDER BY `a.id ASC`.",
    "eStarter": "-- Reconcile initial account balances with transaction credit/debit history using CTE\n-- TODO:\n-- WITH ReconciledLedger AS (\n--   SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_change\n--   FROM ledger_entries GROUP BY account_id\n-- ) SELECT a.id, a.account_number, a.initial_balance, COALESCE(rl.net_change, 0.0) AS net_change, ...\n-- FROM bank_accounts a LEFT JOIN ReconciledLedger rl ON a.id = rl.account_id ORDER BY a.id ASC;",
    "eHint": "Build a CTE summing CREDIT as positive and DEBIT as negative amounts, then LEFT JOIN bank_accounts and compute initial_balance + COALESCE(net_change, 0.0).",
    "eTest": "WITH ReconciledLedger AS (SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_change FROM ledger_entries GROUP BY account_id) SELECT a.id, a.account_number, a.initial_balance, COALESCE(rl.net_change, 0.0) AS net_change, (a.initial_balance + COALESCE(rl.net_change, 0.0)) AS reconciled_balance FROM bank_accounts a LEFT JOIN ReconciledLedger rl ON a.id = rl.account_id ORDER BY a.id ASC;\nSELECT COUNT(*) FROM bank_accounts;\nSELECT COUNT(*) FROM ledger_entries WHERE amount > 0;",
    "aTitle": "Final Capstone: Suspicious High-Value Transaction Auditor",
    "aDesc": "Select `account_id`, `amount`, `created_at` from `ledger_entries` WHERE `amount >= 10000.0` OR `tx_type NOT IN ('CREDIT', 'DEBIT')` ORDER BY `amount DESC`.",
    "aStarter": "-- Flag suspicious transactions (>= $10,000 or invalid transaction type)\n-- TODO: SELECT account_id, amount, created_at FROM ledger_entries WHERE amount >= 10000.0 OR tx_type NOT IN ('CREDIT', 'DEBIT') ORDER BY amount DESC;",
    "aHint": "Use WHERE amount >= 10000.0 OR tx_type NOT IN ('CREDIT', 'DEBIT') ORDER BY amount DESC.",
    "aTest": "SELECT account_id, amount, created_at FROM ledger_entries WHERE amount >= 10000.0 OR tx_type NOT IN ('CREDIT', 'DEBIT') ORDER BY amount DESC;\nSELECT COUNT(*) FROM ledger_entries WHERE amount >= 10000.0;"
  }
];

export const DATABASE_30_DAYS_QUESTS: CourseQuest[] = DATABASE_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('sql-mastery', idx + 1, cfg)
);
