import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const DATABASE_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Relational Database Theory, Tables & Candidate Keys",
    "desc": "Master relational tuples, candidate keys, composite primary keys, and entity integrity rules.",
    "syllabus": [
      "Relational Model: Tables (relations), rows (tuples), and columns (attributes).",
      "Key Hierarchy: Candidate keys, primary keys, and alternate keys.",
      "Integrity Constraints: Entity integrity (no null PKs) and domain integrity."
    ],
    "eTitle": "CREATE TABLE with Composite Primary Key",
    "eDesc": "Write a SQL statement to create table `course_enrollments` with columns `student_id INT`, `course_id INT`, `enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP`, and composite PRIMARY KEY (`student_id`, `course_id`).",
    "eStarter": "-- Write CREATE TABLE statement\nCREATE TABLE course_enrollments (\n  \n);",
    "eHint": "Use PRIMARY KEY (student_id, course_id) constraint at the bottom of table definition.",
    "eTest": "SELECT sql FROM sqlite_master WHERE type='table' AND name='course_enrollments';\nPRAGMA table_info(course_enrollments);",
    "aTitle": "Single-Table Employee Directory DDL",
    "aDesc": "Write a SQL statement creating table `employees` with `id INT PRIMARY KEY`, `email TEXT NOT NULL UNIQUE`, `salary REAL CHECK(salary >= 0)`.",
    "aStarter": "-- Write CREATE TABLE employees\nCREATE TABLE employees (\n  \n);",
    "aHint": "Specify PRIMARY KEY, NOT NULL UNIQUE, and CHECK(salary >= 0).",
    "aTest": "SELECT sql FROM sqlite_master WHERE type='table' AND name='employees';\nPRAGMA table_info(employees);"
  },
  {
    "day": 2,
    "title": "SQL DDL: Data Types, DEFAULT Values & Constraints",
    "desc": "Define robust schemas with INTEGER, TEXT, REAL, BLOB, NOT NULL, DEFAULT, and CHECK constraints.",
    "syllabus": [
      "SQLite / SQL Data Types: INTEGER, TEXT, REAL, NUMERIC, BLOB.",
      "Column Constraints: NOT NULL, UNIQUE, DEFAULT values.",
      "CHECK Constraints: Validating business ranges directly in the engine."
    ],
    "eTitle": "Product Inventory Table with Business Rules",
    "eDesc": "Create table `products` with `id INTEGER PRIMARY KEY AUTOINCREMENT`, `name TEXT NOT NULL`, `price REAL NOT NULL CHECK(price > 0)`, `stock INT DEFAULT 0 CHECK(stock >= 0)`.",
    "eStarter": "-- Define products table with constraints\nCREATE TABLE products (\n  \n);",
    "eHint": "Use AUTOINCREMENT on INTEGER PRIMARY KEY, and CHECK expressions on price and stock.",
    "eTest": "PRAGMA table_info(products);",
    "aTitle": "Customer Account Verification Table",
    "aDesc": "Create table `user_accounts` with `id INT PRIMARY KEY`, `username TEXT UNIQUE NOT NULL`, `status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACTIVE', 'SUSPENDED'))`.",
    "aStarter": "-- Define user_accounts table\nCREATE TABLE user_accounts (\n  \n);",
    "aHint": "Use CHECK(status IN ('PENDING', 'ACTIVE', 'SUSPENDED')).",
    "aTest": "PRAGMA table_info(user_accounts);"
  },
  {
    "day": 3,
    "title": "SQL DML: INSERT, UPDATE, DELETE & Basic SELECT",
    "desc": "Execute fundamental CRUD data manipulation commands with strict WHERE clauses.",
    "syllabus": [
      "INSERT INTO: Single-row and multi-row value insertion.",
      "UPDATE: Modifying specific row values safely with WHERE.",
      "DELETE: Removing rows without truncating the whole table."
    ],
    "eTitle": "Insert and Update Product Inventory",
    "eDesc": "Write a SQL query that inserts a product `('Keyboard', 75.0, 10)` into table `products(name, price, stock)` and updates all products with stock < 5 to have stock = 10.",
    "eStarter": "-- Write INSERT and UPDATE statements\nINSERT INTO products (name, price, stock) VALUES ('Keyboard', 75.0, 10);\nUPDATE products SET stock = 10 WHERE stock < 5;",
    "eHint": "Execute INSERT followed by UPDATE with WHERE filter.",
    "eTest": "SELECT * FROM products WHERE name = 'Keyboard';\nSELECT COUNT(*) FROM products WHERE stock < 5;",
    "aTitle": "Deactivate Inactive User Accounts",
    "aDesc": "Write a SQL statement to UPDATE `user_accounts` setting `status = 'SUSPENDED'` WHERE `status = 'PENDING'`.",
    "aStarter": "-- Update user status\nUPDATE user_accounts SET status = 'SUSPENDED' WHERE status = 'PENDING';",
    "aHint": "Use WHERE status = 'PENDING'.",
    "aTest": "SELECT COUNT(*) FROM user_accounts WHERE status = 'PENDING';"
  },
  {
    "day": 4,
    "title": "WHERE Filtering, Comparison Operators & NULL Handling",
    "desc": "Filter records using =, !=, <, >, <=, >=, AND, OR, NOT, and the IS NULL / IS NOT NULL operators.",
    "syllabus": [
      "Comparison Operators: Equality, relational ranges, and boolean logic.",
      "The Three-Valued Logic of NULL: Why `col = NULL` fails and `IS NULL` is required.",
      "Combining Filters: Operator precedence with parentheses."
    ],
    "eTitle": "Filter Active High-Tier Customers",
    "eDesc": "Select `id`, `name`, `balance` from `customers` WHERE `balance >= 1000.0` AND `status = 'ACTIVE'` AND `deleted_at IS NULL`.",
    "eStarter": "-- Query active high-balance customers\nSELECT id, name, balance FROM customers\nWHERE balance >= 1000.0 AND status = 'ACTIVE' AND deleted_at IS NULL;",
    "eHint": "Combine balance >= 1000.0, status = 'ACTIVE', and deleted_at IS NULL with AND.",
    "eTest": "SELECT id, name, balance FROM customers WHERE balance >= 1000.0 AND status = 'ACTIVE' AND deleted_at IS NULL;",
    "aTitle": "Find Incomplete Customer Profiles",
    "aDesc": "Select `id`, `email` from `customers` WHERE `phone IS NULL` OR `address IS NULL`.",
    "aStarter": "-- Query customers with missing phone or address\nSELECT id, email FROM customers\nWHERE phone IS NULL OR address IS NULL;",
    "aHint": "Use IS NULL on both fields joined by OR.",
    "aTest": "SELECT id, email FROM customers WHERE phone IS NULL OR address IS NULL;"
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
    "eStarter": "-- Create orders table with foreign key\nCREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer_id INT NOT NULL,\n  total_amount REAL CHECK(total_amount >= 0),\n  created_at TEXT DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE\n);",
    "eHint": "Define column definitions followed by FOREIGN KEY constraint.",
    "eTest": "PRAGMA table_info(orders);\nPRAGMA foreign_key_list(orders);",
    "aTitle": "Insert Validated Order Records",
    "aDesc": "Insert an order `(101, 1, 249.99)` into `orders(id, customer_id, total_amount)` and select total sales for customer_id = 1.",
    "aStarter": "-- Insert order and calculate sum\nINSERT INTO orders (id, customer_id, total_amount) VALUES (101, 1, 249.99);\nSELECT SUM(total_amount) FROM orders WHERE customer_id = 1;",
    "aHint": "Run INSERT and then SELECT with customer_id filter.",
    "aTest": "SELECT total_amount FROM orders WHERE id = 101;"
  },
  {
    "day": 6,
    "title": "Pattern Matching (LIKE, GLOB), IN Lists & BETWEEN Ranges",
    "desc": "Search text using wildcard patterns (%, _), match against multi-item sets (IN), and filter inclusive numerical ranges (BETWEEN).",
    "syllabus": [
      "LIKE Wildcards: `%` matches 0 or more characters; `_` matches exactly 1 character.",
      "IN Operator: Checking membership in fixed sets or subquery results.",
      "BETWEEN Operator: Inclusive boundary filtering (`val BETWEEN 10 AND 50`)."
    ],
    "eTitle": "Search Customers by Domain and Salary Range",
    "eDesc": "Select `id`, `name`, `email` from `employees` WHERE `email LIKE '%@pinit.ai'` AND `salary BETWEEN 50000 AND 90000` AND `department IN ('ENG', 'AI', 'DATA')`.",
    "eStarter": "-- Query specific domain, salary range, and departments\nSELECT id, name, email FROM employees\nWHERE email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA');",
    "eHint": "Use email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA').",
    "eTest": "SELECT id, name, email FROM employees WHERE email LIKE '%@pinit.ai' AND salary BETWEEN 50000 AND 90000 AND department IN ('ENG', 'AI', 'DATA');",
    "aTitle": "Filter Inventory by SKU Pattern",
    "aDesc": "Select `name`, `sku` from `products` WHERE `sku LIKE 'TECH-%'` AND `stock IN (0, 1, 2)`.",
    "aStarter": "-- Query low-stock tech products\nSELECT name, sku FROM products\nWHERE sku LIKE 'TECH-%' AND stock IN (0, 1, 2);",
    "aHint": "Use LIKE 'TECH-%' AND stock IN (0, 1, 2).",
    "aTest": "SELECT name, sku FROM products WHERE sku LIKE 'TECH-%' AND stock IN (0, 1, 2);"
  },
  {
    "day": 7,
    "title": "ORDER BY Sorting (ASC, DESC) & LIMIT / OFFSET Pagination",
    "desc": "Sort single and multi-column query results and build efficient cursor pagination with LIMIT and OFFSET.",
    "syllabus": [
      "ORDER BY Clause: Primary and secondary sorting directions (ASC, DESC).",
      "Sorting with NULLs: NULLS FIRST vs NULLS LAST semantics.",
      "LIMIT & OFFSET: Extracting fixed-size page windows from sorted sets."
    ],
    "eTitle": "Top 5 Highest Paid Employees with Secondary Sort",
    "eDesc": "Select `id`, `name`, `salary`, `department` from `employees` ORDER BY `salary DESC`, `name ASC` LIMIT 5 OFFSET 0.",
    "eStarter": "-- Query top 5 highest salaries\nSELECT id, name, salary, department FROM employees\nORDER BY salary DESC, name ASC\nLIMIT 5 OFFSET 0;",
    "eHint": "Order by salary DESC first, then name ASC for ties, with LIMIT 5.",
    "eTest": "SELECT id, name, salary, department FROM employees ORDER BY salary DESC, name ASC LIMIT 5 OFFSET 0;",
    "aTitle": "Paginated Product Catalog (Page 2)",
    "aDesc": "Select `id`, `name`, `price` from `products` ORDER BY `price ASC` LIMIT 10 OFFSET 10.",
    "aStarter": "-- Query page 2 (items 11-20)\nSELECT id, name, price FROM products\nORDER BY price ASC\nLIMIT 10 OFFSET 10;",
    "aHint": "LIMIT 10 OFFSET 10 pulls the second page of 10 items.",
    "aTest": "SELECT id, name, price FROM products ORDER BY price ASC LIMIT 10 OFFSET 10;"
  },
  {
    "day": 8,
    "title": "SQL String & Date Formatting Functions",
    "desc": "Manipulate text (UPPER, LOWER, SUBSTR, TRIM, LENGTH) and compute dates (DATE, DATETIME, STRFTIME).",
    "syllabus": [
      "String Functions: UPPER, LOWER, LENGTH, SUBSTR, TRIM, || (concatenation).",
      "Date & Time Functions: DATE(), DATETIME('now'), STRFTIME('%Y-%m', date_col).",
      "Derived Virtual Columns in SELECT projections."
    ],
    "eTitle": "Format Customer Full Name and Month of Registration",
    "eDesc": "Select `UPPER(first_name || ' ' || last_name) AS full_name`, `STRFTIME('%Y-%m', created_at) AS signup_month` from `customers` ORDER BY `signup_month DESC`.",
    "eStarter": "-- Format string concatenation and extract month\nSELECT UPPER(first_name || ' ' || last_name) AS full_name, STRFTIME('%Y-%m', created_at) AS signup_month\nFROM customers\nORDER BY signup_month DESC;",
    "eHint": "Use UPPER(first_name || ' ' || last_name) AS full_name and STRFTIME('%Y-%m', created_at) AS signup_month.",
    "eTest": "SELECT UPPER(first_name || ' ' || last_name) AS full_name, STRFTIME('%Y-%m', created_at) AS signup_month FROM customers ORDER BY signup_month DESC;",
    "aTitle": "Sanitize Email Addresses and Compute String Lengths",
    "aDesc": "Select `LOWER(TRIM(email)) AS clean_email`, `LENGTH(TRIM(email)) AS email_len` from `user_accounts`.",
    "aStarter": "-- Sanitize email strings\nSELECT LOWER(TRIM(email)) AS clean_email, LENGTH(TRIM(email)) AS email_len FROM user_accounts;",
    "aHint": "Use LOWER(TRIM(email)) and LENGTH(TRIM(email)).",
    "aTest": "SELECT LOWER(TRIM(email)) AS clean_email, LENGTH(TRIM(email)) AS email_len FROM user_accounts;"
  },
  {
    "day": 9,
    "title": "Aggregate Functions: COUNT, SUM, AVG, MIN, MAX",
    "desc": "Calculate summary statistics across rows using SQL aggregate functions.",
    "syllabus": [
      "COUNT(*) vs COUNT(col): Handling null values in counts.",
      "SUM & AVG: Arithmetic aggregations and precision rounding with ROUND().",
      "MIN & MAX: Finding peak and minimum values in sets."
    ],
    "eTitle": "Department Salary Summary Metrics",
    "eDesc": "Select `COUNT(*) AS total_staff`, `SUM(salary) AS total_payroll`, `ROUND(AVG(salary), 2) AS avg_salary`, `MIN(salary) AS min_salary`, `MAX(salary) AS max_salary` from `employees` WHERE `status = 'ACTIVE'`",
    "eStarter": "SELECT COUNT(*) AS total_staff, SUM(salary) AS total_payroll, ROUND(AVG(salary), 2) AS avg_salary, MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees WHERE status = 'ACTIVE';",
    "eHint": "Use aggregate functions with status = 'ACTIVE' filter.",
    "eTest": "SELECT COUNT(*), SUM(salary), ROUND(AVG(salary), 2) FROM employees WHERE status = 'ACTIVE';",
    "aTitle": "Inventory Value and SKU Count",
    "aDesc": "Select `COUNT(id) AS total_skus`, `SUM(price * stock) AS total_inventory_value` from `products`",
    "aStarter": "SELECT COUNT(id) AS total_skus, SUM(price * stock) AS total_inventory_value FROM products;",
    "aHint": "Multiply price * stock inside SUM().",
    "aTest": "SELECT COUNT(id), SUM(price * stock) FROM products;"
  },
  {
    "day": 10,
    "title": "GROUP BY Aggregations & the HAVING Filter Clause",
    "desc": "Group table rows by categorical keys and filter summarized groups with HAVING.",
    "syllabus": [
      "GROUP BY Clause: Aggregating by single and multiple columns.",
      "WHERE vs HAVING: Filtering individual rows before grouping vs filtering aggregated buckets.",
      "Sorting Aggregated Groups."
    ],
    "eTitle": "High-Volume Sales Departments Filter",
    "eDesc": "Select `department`, `COUNT(*) AS emp_count`, `SUM(salary) AS total_dept_salary` from `employees` GROUP BY `department` HAVING `COUNT(*) >= 3` ORDER BY `total_dept_salary DESC`",
    "eStarter": "SELECT department, COUNT(*) AS emp_count, SUM(salary) AS total_dept_salary FROM employees GROUP BY department HAVING COUNT(*) >= 3 ORDER BY total_dept_salary DESC;",
    "eHint": "Apply HAVING COUNT(*) >= 3 on the grouped department rows.",
    "eTest": "SELECT department, COUNT(*), SUM(salary) FROM employees GROUP BY department HAVING COUNT(*) >= 3;",
    "aTitle": "Categories with Average Price > $50",
    "aDesc": "Select `category`, `ROUND(AVG(price), 2) AS avg_price` from `products` GROUP BY `category` HAVING `AVG(price) > 50.0`",
    "aStarter": "SELECT category, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 50.0;",
    "aHint": "Use HAVING AVG(price) > 50.0.",
    "aTest": "SELECT category, ROUND(AVG(price), 2) FROM products GROUP BY category HAVING AVG(price) > 50.0;"
  },
  {
    "day": 11,
    "title": "INNER JOIN: Combining Relational Tables on Foreign Keys",
    "desc": "Combine matching rows between two related tables using INNER JOIN and ON predicates.",
    "syllabus": [
      "Relational Joins: Cartesian product reduction via ON conditions.",
      "Table Aliasing: Using `c` for customers and `o` for orders.",
      "Multi-Column Projections."
    ],
    "eTitle": "Customer Order Itemization Report",
    "eDesc": "Select `c.name AS customer_name`, `o.id AS order_id`, `o.total_amount`, `o.created_at` from `customers c` INNER JOIN `orders o` ON `c.id = o.customer_id` ORDER BY `o.total_amount DESC`",
    "eStarter": "SELECT c.name AS customer_name, o.id AS order_id, o.total_amount, o.created_at FROM customers c INNER JOIN orders o ON c.id = o.customer_id ORDER BY o.total_amount DESC;",
    "eHint": "Join customers c with orders o on c.id = o.customer_id.",
    "eTest": "SELECT c.name, o.id, o.total_amount FROM customers c INNER JOIN orders o ON c.id = o.customer_id;",
    "aTitle": "Employee Department Lookup",
    "aDesc": "Select `e.name AS employee_name`, `d.name AS department_name` from `employees e` INNER JOIN `departments d` ON `e.department_id = d.id`",
    "aStarter": "SELECT e.name AS employee_name, d.name AS department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;",
    "aHint": "Join employees and departments on department_id.",
    "aTest": "SELECT e.name, d.name FROM employees e INNER JOIN departments d ON e.department_id = d.id;"
  },
  {
    "day": 12,
    "title": "LEFT OUTER JOIN & Handling Missing Parent/Child Records",
    "desc": "Preserve all left-table rows regardless of matching right-table records. A LEFT JOIN retains every left row and fills NULLs where no match exists — enabling customer-order gap analysis and unmatched-record detection.",
    "syllabus": [
      "Outer Joins: Preserving unmatched rows with NULL padding.",
      "COALESCE() Function: Providing clean fallbacks for NULLs.",
      "Finding Unmatched Rows: `WHERE right_table.id IS NULL`."
    ],
    "eTitle": "Customers with and without Orders",
    "eDesc": "Select `c.id`, `c.name`, `COUNT(o.id) AS order_count`, `COALESCE(SUM(o.total_amount), 0.0) AS total_spent` from `customers c` LEFT JOIN `orders o` ON `c.id = o.customer_id` GROUP BY `c.id`, `c.name` ORDER BY `total_spent DESC`",
    "eStarter": "SELECT c.id, c.name, COUNT(o.id) AS order_count, COALESCE(SUM(o.total_amount), 0.0) AS total_spent FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY total_spent DESC;",
    "eHint": "Write FROM customers c LEFT JOIN orders o ON c.id = o.customer_id, GROUP BY c.id, c.name. Wrap the aggregate with COALESCE(SUM(o.total_amount), 0.0) so customers with no orders show 0.0 instead of NULL.",
    "eTest": "SELECT c.id, c.name, COUNT(o.id), COALESCE(SUM(o.total_amount), 0.0) FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name;",
    "aTitle": "Identify Inactive Customers with Zero Orders",
    "aDesc": "Find truly inactive accounts: LEFT JOIN customers to orders, then filter WHERE o.id IS NULL to isolate customers who have never placed a single order.",
    "aStarter": "SELECT c.id, c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;",
    "aHint": "WHERE o.id IS NULL captures customers with zero orders.",
    "aTest": "SELECT c.id, c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;"
  },
  {
    "day": 13,
    "title": "Self Joins & Multi-Table Relational Graphs",
    "desc": "Query hierarchical manager-employee relationships and multi-table business graphs.",
    "syllabus": [
      "Self Joins: Joining a table to itself using distinct aliases (`e` and `m`).",
      "Hierarchical Trees: Parent-child relationship traversal.",
      "Three-Table Joins: Orders -> OrderItems -> Products."
    ],
    "eTitle": "Employee Manager Hierarchy Report",
    "eDesc": "Select `e.name AS employee_name`, `COALESCE(m.name, 'TOP_EXECUTIVE') AS manager_name` from `employees e` LEFT JOIN `employees m` ON `e.manager_id = m.id` ORDER BY `e.name ASC`",
    "eStarter": "SELECT e.name AS employee_name, COALESCE(m.name, 'TOP_EXECUTIVE') AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.name ASC;",
    "eHint": "Join employees to itself with alias m.",
    "eTest": "SELECT e.name, COALESCE(m.name, 'TOP_EXECUTIVE') FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;",
    "aTitle": "Three-Table E-Commerce Line Item Join",
    "aDesc": "Select `o.id AS order_id`, `p.name AS product_name`, `oi.quantity`, `oi.price` from `orders o` INNER JOIN `order_items oi` ON `o.id = oi.order_id` INNER JOIN `products p` ON `oi.product_id = p.id`",
    "aStarter": "SELECT o.id AS order_id, p.name AS product_name, oi.quantity, oi.price FROM orders o INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON oi.product_id = p.id;",
    "aHint": "Chain two INNER JOIN clauses across orders, order_items, and products.",
    "aTest": "SELECT o.id, p.name, oi.quantity FROM orders o INNER JOIN order_items oi ON o.id = oi.order_id INNER JOIN products p ON oi.product_id = p.id;"
  },
  {
    "day": 14,
    "title": "Set Operations: UNION vs UNION ALL & INTERSECT",
    "desc": "Combine, deduplicate, and intersect row sets across compatible SELECT statements.",
    "syllabus": [
      "UNION: Combining and deduplicating rows across queries.",
      "UNION ALL: High-performance combination without deduplication overhead.",
      "INTERSECT & EXCEPT: Finding shared and exclusive row sets."
    ],
    "eTitle": "Unified User Directory from Employees and Contractors",
    "eDesc": "Select `name`, `email`, `'EMPLOYEE' AS role` from `employees` UNION ALL Select `name`, `email`, `'CONTRACTOR' AS role` from `contractors` ORDER BY `name ASC`",
    "eStarter": "SELECT name, email, 'EMPLOYEE' AS role FROM employees UNION ALL SELECT name, email, 'CONTRACTOR' AS role FROM contractors ORDER BY name ASC;",
    "eHint": "Use UNION ALL with static role string literals.",
    "eTest": "SELECT name, email, role FROM (SELECT name, email, 'EMPLOYEE' AS role FROM employees UNION ALL SELECT name, email, 'CONTRACTOR' AS role FROM contractors);",
    "aTitle": "Deduplicated Customer Contact List",
    "aDesc": "Select `email` from `online_customers` UNION Select `email` from `retail_customers` ORDER BY `email ASC`",
    "aStarter": "SELECT email FROM online_customers UNION SELECT email FROM retail_customers ORDER BY email ASC;",
    "aHint": "Use UNION to automatically deduplicate emails.",
    "aTest": "SELECT email FROM (SELECT email FROM online_customers UNION SELECT email FROM retail_customers);"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Multi-Store Sales Reporting & Aggregation Engine",
    "desc": "Milestone 2: Build a comprehensive analytical sales aggregation engine across multiple retail store branches.",
    "syllabus": [
      "Multi-Table Analytical Queries: Joining stores, orders, and items.",
      "Grouped Metrics: Distinct order counts, revenue, and average ticket size.",
      "HAVING Threshold Filters."
    ],
    "eTitle": "Store Branch Quarterly Performance Summary",
    "eDesc": "Select `s.branch_name`, `COUNT(DISTINCT o.id) AS total_orders`, `SUM(o.total_amount) AS revenue`, `ROUND(AVG(o.total_amount), 2) AS avg_ticket` from `stores s` INNER JOIN `orders o` ON `s.id = o.store_id` GROUP BY `s.id`, `s.branch_name` HAVING `SUM(o.total_amount) >= 10000` ORDER BY `revenue DESC`",
    "eStarter": "SELECT s.branch_name, COUNT(DISTINCT o.id) AS total_orders, SUM(o.total_amount) AS revenue, ROUND(AVG(o.total_amount), 2) AS avg_ticket FROM stores s INNER JOIN orders o ON s.id = o.store_id GROUP BY s.id, s.branch_name HAVING SUM(o.total_amount) >= 10000 ORDER BY revenue DESC;",
    "eHint": "Combine stores s and orders o with COUNT(DISTINCT o.id) and HAVING SUM(total_amount) >= 10000.",
    "eTest": "SELECT s.branch_name, COUNT(DISTINCT o.id), SUM(o.total_amount) FROM stores s INNER JOIN orders o ON s.id = o.store_id GROUP BY s.id, s.branch_name HAVING SUM(o.total_amount) >= 10000;",
    "aTitle": "Store Inventory Valuation by Category",
    "aDesc": "Select `s.branch_name`, `p.category`, `SUM(p.price * p.stock) AS category_value` from `stores s` INNER JOIN `products p` ON `s.id = p.store_id` GROUP BY `s.branch_name`, `p.category`",
    "aStarter": "SELECT s.branch_name, p.category, SUM(p.price * p.stock) AS category_value FROM stores s INNER JOIN products p ON s.id = p.store_id GROUP BY s.branch_name, p.category;",
    "aHint": "Group by both s.branch_name and p.category.",
    "aTest": "SELECT s.branch_name, p.category, SUM(p.price * p.stock) FROM stores s INNER JOIN products p ON s.id = p.store_id GROUP BY s.branch_name, p.category;"
  },
  {
    "day": 16,
    "title": "Subqueries: Scalar, Column Lists & Correlated Subqueries",
    "desc": "Write nested queries inside SELECT, WHERE, and FROM clauses.",
    "syllabus": [
      "Scalar Subqueries: Single value returned inside SELECT or WHERE.",
      "IN (Subquery): Matching against dynamically queried id lists.",
      "Correlated Subqueries: Subqueries referencing the outer table."
    ],
    "eTitle": "Employees Earning Above Department Average",
    "eDesc": "Select `e.id`, `e.name`, `e.salary`, `e.department_id` from `employees e` WHERE `e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id)` ORDER BY `e.salary DESC`",
    "eStarter": "SELECT e.id, e.name, e.salary, e.department_id FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id) ORDER BY e.salary DESC;",
    "eHint": "Compare e.salary against the correlated subquery AVG(salary).",
    "eTest": "SELECT e.id, e.name, e.salary FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);",
    "aTitle": "Products Priced Above Overall Catalog Average",
    "aDesc": "Select `id`, `name`, `price` from `products` WHERE `price > (SELECT AVG(price) FROM products)` ORDER BY `price DESC`",
    "aStarter": "SELECT id, name, price FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price DESC;",
    "aHint": "Use scalar subquery (SELECT AVG(price) FROM products).",
    "aTest": "SELECT id, name, price FROM products WHERE price > (SELECT AVG(price) FROM products);"
  },
  {
    "day": 17,
    "title": "Common Table Expressions (WITH CTEs & Recursive CTEs)",
    "desc": "Structure complex multi-step queries into readable, composable Common Table Expressions.",
    "syllabus": [
      "WITH Clause: Temporary named result sets for single query scope.",
      "Chaining Multiple CTEs: WITH StepA AS (...), StepB AS (...).",
      "Recursive CTEs: Hierarchical tree traversal and sequence generation."
    ],
    "eTitle": "Two-Stage High-Value Customer CTE",
    "eDesc": "WITH CustomerSpend AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) SELECT c.name, cs.total_spent FROM customers c INNER JOIN CustomerSpend cs ON c.id = cs.customer_id WHERE cs.total_spent > 500 ORDER BY cs.total_spent DESC;",
    "eStarter": "WITH CustomerSpend AS (\n  SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id\n)\nSELECT c.name, cs.total_spent FROM customers c INNER JOIN CustomerSpend cs ON c.id = cs.customer_id WHERE cs.total_spent > 500 ORDER BY cs.total_spent DESC;",
    "eHint": "Declare CustomerSpend CTE first, then join with customers.",
    "eTest": "WITH CustomerSpend AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) SELECT c.name, cs.total_spent FROM customers c INNER JOIN CustomerSpend cs ON c.id = cs.customer_id WHERE cs.total_spent > 500;",
    "aTitle": "Recursive Hierarchy Traversal CTE",
    "aDesc": "WITH RECURSIVE NumberSeq(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM NumberSeq WHERE n < 10) SELECT n FROM NumberSeq;",
    "aStarter": "WITH RECURSIVE NumberSeq(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM NumberSeq WHERE n < 10\n)\nSELECT n FROM NumberSeq;",
    "aHint": "Use UNION ALL with termination condition WHERE n < 10.",
    "aTest": "WITH RECURSIVE NumberSeq(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM NumberSeq WHERE n < 10) SELECT n FROM NumberSeq;"
  },
  {
    "day": 18,
    "title": "Window Functions: ROW_NUMBER(), RANK() & DENSE_RANK()",
    "desc": "Partition and rank query rows over analytical windows without collapsing group data.",
    "syllabus": [
      "OVER (PARTITION BY ... ORDER BY ...): Analytical window scope.",
      "ROW_NUMBER(): Unique sequential row IDs (1, 2, 3, 4).",
      "RANK() vs DENSE_RANK(): Handling ties with or without gaps."
    ],
    "eTitle": "Rank Employees by Salary Within Department",
    "eDesc": "Select `id`, `name`, `department`, `salary`, `DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank` from `employees` ORDER BY `department`, `dept_salary_rank`",
    "eStarter": "SELECT id, name, department, salary, DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank FROM employees ORDER BY department, dept_salary_rank;",
    "eHint": "Use DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC).",
    "eTest": "SELECT id, name, department, salary, DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank FROM employees;",
    "aTitle": "Assign Row Numbers to Recent Customer Orders",
    "aDesc": "Select `id`, `customer_id`, `total_amount`, `ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq` from `orders`",
    "aStarter": "SELECT id, customer_id, total_amount, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq FROM orders;",
    "aHint": "Use ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC).",
    "aTest": "SELECT id, customer_id, ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY created_at DESC) AS order_seq FROM orders;"
  },
  {
    "day": 19,
    "title": "Window Aggregates: Running Totals & Moving Averages (OVER)",
    "desc": "Compute running financial totals and moving metrics across ordered time windows using SQL window functions — analytic aggregates with OVER() that span row ranges without collapsing the result set.",
    "syllabus": [
      "Running Sum: SUM(val) OVER (ORDER BY date).",
      "Moving Window Frames: ROWS BETWEEN N PRECEDING AND CURRENT ROW.",
      "Analytical Partition Summaries."
    ],
    "eTitle": "Cumulative Running Revenue per Day",
    "eDesc": "Select `date(created_at) AS order_day`, `total_amount`, `SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total` from `orders` ORDER BY `created_at ASC`",
    "eStarter": "SELECT date(created_at) AS order_day, total_amount, SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM orders ORDER BY created_at ASC;",
    "eHint": "Use SUM(...) OVER (ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).",
    "eTest": "SELECT date(created_at), total_amount, SUM(total_amount) OVER(ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) FROM orders;",
    "aTitle": "Moving 3-Order Average Amount",
    "aDesc": "Smooth short-term fluctuations: compute a 3-order moving average by applying AVG(...) OVER with a sliding window of 2 PRECEDING AND CURRENT ROW, rounding to 2 decimal places.",
    "aStarter": "SELECT id, total_amount, ROUND(AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_3 FROM orders;",
    "aHint": "Use ROWS BETWEEN 2 PRECEDING AND CURRENT ROW.",
    "aTest": "SELECT id, total_amount, ROUND(AVG(total_amount) OVER(ORDER BY created_at ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) FROM orders;"
  },
  {
    "day": 20,
    "title": "Database Indexing: B-Tree Indexes & Composite Index Strategy",
    "desc": "Accelerate point lookups and range scans with B-Tree indexes and column ordering rules.",
    "syllabus": [
      "B-Tree Index Internals: O(log N) point search vs O(N) full table scan.",
      "Composite Index Rule: Leftmost prefix matching.",
      "Unique Indexes & Index Overhead on Writes."
    ],
    "eTitle": "Create Composite Index for Fast Customer Search",
    "eDesc": "Write SQL statement creating composite index `idx_orders_cust_date` on table `orders(customer_id, created_at DESC)`",
    "eStarter": "CREATE INDEX idx_orders_cust_date ON orders(customer_id, created_at DESC);",
    "eHint": "Use CREATE INDEX on customer_id and created_at DESC.",
    "eTest": "SELECT name, sql FROM sqlite_master WHERE type='index' AND name='idx_orders_cust_date';",
    "aTitle": "Create Unique Email Index",
    "aDesc": "Write SQL statement creating unique index `idx_users_email_unique` on `user_accounts(email)`",
    "aStarter": "CREATE UNIQUE INDEX idx_users_email_unique ON user_accounts(email);",
    "aHint": "Use CREATE UNIQUE INDEX.",
    "aTest": "SELECT name, sql FROM sqlite_master WHERE type='index' AND name='idx_users_email_unique';"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Enterprise Query Optimizer & Execution Plan Auditor",
    "desc": "Milestone 3: Audit query execution plans using EXPLAIN QUERY PLAN to eliminate full table scans.",
    "syllabus": [
      "EXPLAIN QUERY PLAN: Interpreting SCAN TABLE vs SEARCH TABLE USING INDEX.",
      "Index Selectivity: Cardinality and covering indexes.",
      "Preventing Accidental Full Scans."
    ],
    "eTitle": "Audit Query Plan to Confirm Index Scan",
    "eDesc": "Write `EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC;`",
    "eStarter": "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC;",
    "eHint": "Prefix query with EXPLAIN QUERY PLAN.",
    "eTest": "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42;",
    "aTitle": "Audit Email Lookup Plan",
    "aDesc": "Write `EXPLAIN QUERY PLAN SELECT * FROM user_accounts WHERE email = 'test@pinit.ai';`",
    "aStarter": "EXPLAIN QUERY PLAN SELECT * FROM user_accounts WHERE email = 'test@pinit.ai';",
    "aHint": "Prefix with EXPLAIN QUERY PLAN.",
    "aTest": "EXPLAIN QUERY PLAN SELECT * FROM user_accounts WHERE email = 'test@pinit.ai';"
  },
  {
    "day": 22,
    "title": "Transactions & ACID Guarantees: BEGIN, COMMIT & ROLLBACK",
    "desc": "Guarantee Atomicity, Consistency, Isolation, and Durability across multi-step mutations.",
    "syllabus": [
      "Atomicity: All-or-nothing execution.",
      "Consistency: Enforcing schema constraints across transactions.",
      "Rollback on Failure: Preserving database integrity."
    ],
    "eTitle": "Atomic Bank Transfer Transaction",
    "eDesc": "Write a transaction transferring $100 from account 1 to account 2: BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;",
    "eStarter": "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
    "eHint": "Execute BEGIN TRANSACTION, both updates, and COMMIT.",
    "eTest": "SELECT balance FROM accounts WHERE id IN (1, 2);",
    "aTitle": "Rollback on Invariant Check Failure",
    "aDesc": "Demonstrate ROLLBACK on negative balance validation.",
    "aStarter": "BEGIN TRANSACTION;\nROLLBACK;",
    "aHint": "Use BEGIN TRANSACTION followed by ROLLBACK.",
    "aTest": "SELECT 1;"
  },
  {
    "day": 23,
    "title": "Concurrency & Isolation Levels: Dirty Reads to Serializable",
    "desc": "Understand concurrency anomalies (Dirty Reads, Non-Repeatable Reads, Phantom Reads) and use SQLite PRAGMAs to configure isolation settings that prevent data corruption under concurrent access.",
    "syllabus": [
      "Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.",
      "Write-Ahead Logging (WAL): Concurrent readers and writers in SQLite.",
      "Deadlock Prevention & Lock Escalation."
    ],
    "eTitle": "Set SQLite WAL Pragma for High Concurrency",
    "eDesc": "Write `PRAGMA journal_mode = WAL;` to enable Write-Ahead Logging for concurrent readers and writers.",
    "eStarter": "PRAGMA journal_mode = WAL;",
    "eHint": "Run PRAGMA journal_mode = WAL; — WAL (Write-Ahead Logging) lets concurrent readers and a single writer run simultaneously, reducing lock contention compared to the default DELETE journal mode.",
    "eTest": "PRAGMA journal_mode;",
    "aTitle": "Verify Foreign Key Enforcement Pragma",
    "aDesc": "Enable referential integrity enforcement: PRAGMA foreign_keys = ON; makes SQLite validate foreign key constraints on INSERT and DELETE, preventing orphaned records that corrupt relational consistency.",
    "aStarter": "PRAGMA foreign_keys = ON;",
    "aHint": "Execute PRAGMA foreign_keys = ON.",
    "aTest": "PRAGMA foreign_keys;"
  },
  {
    "day": 24,
    "title": "Database Normalization: 1NF, 2NF, 3NF & BCNF Architecture",
    "desc": "Decompose redundant flat data models into anomaly-free third normal form (3NF) tables.",
    "syllabus": [
      "1NF: Atomic values and unique column entries.",
      "2NF: No partial dependency on composite keys.",
      "3NF: No transitive dependencies (`A -> B -> C`)."
    ],
    "eTitle": "Normalized Product Categories DDL",
    "eDesc": "Create table `categories (id INT PRIMARY KEY, name TEXT UNIQUE NOT NULL)` and table `items (id INT PRIMARY KEY, category_id INT REFERENCES categories(id), name TEXT NOT NULL)`",
    "eStarter": "CREATE TABLE categories (id INT PRIMARY KEY, name TEXT UNIQUE NOT NULL);\nCREATE TABLE items (id INT PRIMARY KEY, category_id INT REFERENCES categories(id), name TEXT NOT NULL);",
    "eHint": "Create parent categories table and child items table with REFERENCES.",
    "eTest": "PRAGMA table_info(categories);\nPRAGMA table_info(items);",
    "aTitle": "Normalized Order Line Items DDL",
    "aDesc": "Create table `invoice_lines (invoice_id INT, line_num INT, amount REAL, PRIMARY KEY (invoice_id, line_num))`",
    "aStarter": "CREATE TABLE invoice_lines (invoice_id INT, line_num INT, amount REAL, PRIMARY KEY (invoice_id, line_num));",
    "aHint": "Use composite PRIMARY KEY (invoice_id, line_num).",
    "aTest": "PRAGMA table_info(invoice_lines);"
  },
  {
    "day": 25,
    "title": "SQL Views & Materialized Views for Abstract Queries",
    "desc": "Encapsulate complex multi-table joins into virtual views for security and simplicity.",
    "syllabus": [
      "CREATE VIEW: Stored query definitions without data duplication.",
      "Materialized Views: Cached physical tables for intensive analytics.",
      "View Security: Granting row and column access through views."
    ],
    "eTitle": "Create Customer Revenue Summary View",
    "eDesc": "Create view `v_customer_revenue` AS SELECT `c.id`, `c.name`, `COALESCE(SUM(o.total_amount), 0.0) AS total_revenue` FROM `customers c` LEFT JOIN `orders o` ON `c.id = o.customer_id` GROUP BY `c.id`, `c.name`",
    "eStarter": "CREATE VIEW v_customer_revenue AS\nSELECT c.id, c.name, COALESCE(SUM(o.total_amount), 0.0) AS total_revenue\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name;",
    "eHint": "Use CREATE VIEW v_customer_revenue AS followed by SELECT query.",
    "eTest": "SELECT * FROM v_customer_revenue;",
    "aTitle": "Create Active Staff Directory View",
    "aDesc": "Create view `v_active_staff` AS SELECT `id`, `name`, `email` FROM `employees` WHERE `status = 'ACTIVE'`",
    "aStarter": "CREATE VIEW v_active_staff AS SELECT id, name, email FROM employees WHERE status = 'ACTIVE';",
    "aHint": "Use CREATE VIEW with WHERE status = 'ACTIVE'.",
    "aTest": "SELECT * FROM v_active_staff;"
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 4: Real-Time Audit Log Trigger & Invariant Enforcer",
    "desc": "Milestone 4: Implement database triggers that automatically write timestamped audit trail records on table updates.",
    "syllabus": [
      "CREATE TRIGGER: AFTER UPDATE OF col ON table.",
      "OLD vs NEW Row References: Accessing pre-update and post-update values.",
      "Automated Audit Logging & Change Tracking."
    ],
    "eTitle": "Create Audit Trigger on Customer Balance Changes",
    "eDesc": "Create trigger `trg_audit_balance_change` AFTER UPDATE OF `balance` ON `accounts` BEGIN INSERT INTO `account_audit (account_id, old_bal, new_bal, changed_at)` VALUES (`OLD.id`, `OLD.balance`, `NEW.balance`, `CURRENT_TIMESTAMP`); END;",
    "eStarter": "CREATE TRIGGER trg_audit_balance_change\nAFTER UPDATE OF balance ON accounts\nBEGIN\n  INSERT INTO account_audit (account_id, old_bal, new_bal, changed_at)\n  VALUES (OLD.id, OLD.balance, NEW.balance, CURRENT_TIMESTAMP);\nEND;",
    "eHint": "Use AFTER UPDATE OF balance ON accounts with OLD and NEW references.",
    "eTest": "SELECT name, sql FROM sqlite_master WHERE type='trigger' AND name='trg_audit_balance_change';",
    "aTitle": "Create Invariant Preventative Trigger",
    "aDesc": "Create trigger preventing negative balance inserts using RAISE(ABORT, 'Balance cannot be negative').",
    "aStarter": "CREATE TRIGGER trg_prevent_negative_bal\nBEFORE INSERT ON accounts\nWHEN NEW.balance < 0\nBEGIN\n  SELECT RAISE(ABORT, 'Balance cannot be negative');\nEND;",
    "aHint": "Use BEFORE INSERT ON accounts WHEN NEW.balance < 0.",
    "aTest": "SELECT name FROM sqlite_master WHERE type='trigger' AND name='trg_prevent_negative_bal';"
  },
  {
    "day": 27,
    "title": "JSON Column Storage & JSON_EXTRACT Querying",
    "desc": "Store and query flexible semi-structured JSON payloads inside SQL relational columns using JSON_EXTRACT for key access — enabling hybrid relational-document queries without a separate NoSQL layer.",
    "syllabus": [
      "JSON_EXTRACT(col, '$.path'): Unpacking nested keys from JSON strings.",
      "JSON Functions: JSON_ARRAY, JSON_OBJECT, JSON_EACH for array unnesting.",
      "Hybrid Relational + Document Architecture."
    ],
    "eTitle": "Extract Nested JSON Configuration Keys",
    "eDesc": "Select `id`, `JSON_EXTRACT(metadata, '$.theme') AS user_theme`, `JSON_EXTRACT(metadata, '$.notifications.email') AS email_notifs` from `user_settings`",
    "eStarter": "SELECT id, JSON_EXTRACT(metadata, '$.theme') AS user_theme, JSON_EXTRACT(metadata, '$.notifications.email') AS email_notifs FROM user_settings;",
    "eHint": "Use JSON_EXTRACT with '$.theme' and '$.notifications.email'.",
    "eTest": "SELECT id, JSON_EXTRACT(metadata, '$.theme') FROM user_settings;",
    "aTitle": "Filter Records by JSON Property",
    "aDesc": "Filter by an embedded JSON attribute: query user_settings WHERE JSON_EXTRACT pulls the role key from the metadata JSON column, returning only rows where the embedded role equals 'ADMIN'.",
    "aStarter": "SELECT id FROM user_settings WHERE JSON_EXTRACT(metadata, '$.role') = 'ADMIN';",
    "aHint": "Use WHERE JSON_EXTRACT(...) = 'ADMIN'.",
    "aTest": "SELECT id FROM user_settings WHERE JSON_EXTRACT(metadata, '$.role') = 'ADMIN';"
  },
  {
    "day": 28,
    "title": "Sharding, Read Replicas & High-Availability Scaling",
    "desc": "Explore horizontal database sharding, primary-replica replication lag, and connection pooling.",
    "syllabus": [
      "Horizontal Partitioning (Sharding): Shard keys and modulo distribution.",
      "Read Replicas: Asynchronous replication and read offloading.",
      "Connection Pooling & High Availability Failover."
    ],
    "eTitle": "Shard Key Modulo Hash Routing",
    "eDesc": "Select `id`, `(id % 4) AS target_shard_id` from `accounts`",
    "eStarter": "SELECT id, (id % 4) AS target_shard_id FROM accounts;",
    "eHint": "Use modulo arithmetic (id % 4).",
    "eTest": "SELECT id, (id % 4) FROM accounts;",
    "aTitle": "Replication Lag Metric Query",
    "aDesc": "Select `replica_name`, `(primary_lsn - replica_lsn) AS lsn_lag` from `replication_status`",
    "aStarter": "SELECT replica_name, (primary_lsn - replica_lsn) AS lsn_lag FROM replication_status;",
    "aHint": "Compute difference between primary and replica LSNs.",
    "aTest": "SELECT replica_name, (primary_lsn - replica_lsn) FROM replication_status;"
  },
  {
    "day": 29,
    "title": "NoSQL vs Relational Storage Engine Trade-offs",
    "desc": "Compare ACID relational consistency with Document, Key-Value, and Columnar stores.",
    "syllabus": [
      "CAP Theorem: Consistency vs Availability vs Partition Tolerance.",
      "Document Stores (MongoDB) vs Key-Value (Redis) vs Relational (Postgres/SQLite).",
      "Selecting the Right Storage Engine for Workloads."
    ],
    "eTitle": "Query Storage Engine Benchmark Metrics",
    "eDesc": "Select `engine_type`, `p99_latency_ms`, `throughput_qps` from `db_benchmarks` ORDER BY `throughput_qps DESC`",
    "eStarter": "SELECT engine_type, p99_latency_ms, throughput_qps FROM db_benchmarks ORDER BY throughput_qps DESC;",
    "eHint": "Select benchmark columns and order by throughput_qps DESC.",
    "eTest": "SELECT engine_type, p99_latency_ms, throughput_qps FROM db_benchmarks;",
    "aTitle": "Categorize Storage Use-Cases",
    "aDesc": "Select `use_case`, `recommended_engine` from `storage_architectures`",
    "aStarter": "SELECT use_case, recommended_engine FROM storage_architectures;",
    "aHint": "Select use_case and recommended_engine.",
    "aTest": "SELECT use_case, recommended_engine FROM storage_architectures;"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Multi-Tenant Banking Ledger & Real-Time Financial Audit Engine",
    "desc": "Final Capstone Synthesis: The complete transactional banking ledger operating system featuring atomic transfers, audit logging triggers, running balances, and multi-tenant reconciliation views.",
    "syllabus": [
      "Full Banking Schema: Accounts, Transactions, Audit Logs, and Reconciliations.",
      "Running Ledger Reconciliation with CTEs and Case Aggregations.",
      "Real-Time Fraud & Anomaly Filtering."
    ],
    "eTitle": "Capstone Banking Ledger Balance Reconciliation",
    "eDesc": "WITH ReconciledLedger AS (SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_change FROM ledger_entries GROUP BY account_id) SELECT a.id, a.account_number, a.initial_balance, COALESCE(rl.net_change, 0.0) AS net_change, (a.initial_balance + COALESCE(rl.net_change, 0.0)) AS reconciled_balance FROM bank_accounts a LEFT JOIN ReconciledLedger rl ON a.id = rl.account_id ORDER BY a.id ASC;",
    "eStarter": "WITH ReconciledLedger AS (\n  SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_change\n  FROM ledger_entries\n  GROUP BY account_id\n)\nSELECT a.id, a.account_number, a.initial_balance, COALESCE(rl.net_change, 0.0) AS net_change, (a.initial_balance + COALESCE(rl.net_change, 0.0)) AS reconciled_balance\nFROM bank_accounts a\nLEFT JOIN ReconciledLedger rl ON a.id = rl.account_id\nORDER BY a.id ASC;",
    "eHint": "Compute net_change per account using CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END inside CTE, then join with bank_accounts.",
    "eTest": "WITH ReconciledLedger AS (SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_change FROM ledger_entries GROUP BY account_id) SELECT a.id, (a.initial_balance + COALESCE(rl.net_change, 0.0)) FROM bank_accounts a LEFT JOIN ReconciledLedger rl ON a.id = rl.account_id;",
    "aTitle": "Capstone Anomaly & Fraud Detection Query",
    "aDesc": "Fraud detection scan: flag suspicious ledger activity by querying entries where the amount exceeds $10,000 (large-value threshold) or the transaction type falls outside the recognised CREDIT and DEBIT categories.",
    "aStarter": "SELECT account_id, amount, created_at FROM ledger_entries WHERE amount >= 10000.0 OR tx_type NOT IN ('CREDIT', 'DEBIT') ORDER BY amount DESC;",
    "aHint": "Filter large amounts >= 10000 or invalid transaction types.",
    "aTest": "SELECT account_id, amount FROM ledger_entries WHERE amount >= 10000.0;"
  }
];

export const DATABASE_30_DAYS_QUESTS: CourseQuest[] = DATABASE_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('sql-mastery', idx + 1, cfg)
);
