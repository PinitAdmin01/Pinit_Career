import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { SQL_CHECKS_MARKER } from '../code/sql/sqlCore';

/**
 * 1-Month SQL course (course-database-eng, quest prefix sql-mastery), taught on PostgreSQL.
 *
 * Upgraded from the older SQLite course: the same order of topics, in plain words, for beginners.
 * Week 1: tables and simple queries. Week 2: totals, groups and joins. Week 3: deeper queries and
 * good design. Week 4: transactions, indexes, views, JSON, SQL from code, and a Canteen project.
 *
 * Every practice task runs in the browser on PostgreSQL (PGlite). Its test suite is the setup SQL,
 * the "-- CHECKS --" line, then check queries that return ok/msg (see src/lib/code/sql/sqlCore.ts).
 * A single SELECT answer becomes the view "answer", which the checks read.
 * tests/sql_practice_tasks.test.ts checks every task: the right answer passes, the starter fails.
 *
 * Quest ids (sql-mastery-lecture1/exam/assign-day-N) are unchanged, so saved progress stays valid.
 */
const lines = (...l: string[]) => l.join('\n');
const task = (setup: string, ...checks: string[]) => `${setup}\n${SQL_CHECKS_MARKER}\n${checks.join('\n')}`;

/** The shop database most practice tasks use. */
const SHOP = lines(
  'CREATE TABLE customers (id int PRIMARY KEY, name text NOT NULL, city text, joined_on date);',
  "INSERT INTO customers VALUES (1, 'Asha', 'Pune', '2026-01-10'), (2, 'Ravi', 'Mumbai', '2026-02-03'),",
  "  (3, 'Priya', 'Pune', '2026-03-15'), (4, 'Karan', 'Delhi', '2026-04-01'), (5, 'Meera', NULL, '2026-05-20');",
  'CREATE TABLE products (id int PRIMARY KEY, name text NOT NULL, category text, price numeric(10,2), stock int);',
  "INSERT INTO products VALUES (1, 'Notebook', 'stationery', 60, 120), (2, 'Pen', 'stationery', 10, 500),",
  "  (3, 'Backpack', 'bags', 1200, 15), (4, 'Water bottle', 'kitchen', 350, 40), (5, 'Desk lamp', 'home', 899, 0),",
  "  (6, 'Headphones', 'electronics', 1499, 25), (7, 'Phone stand', 'electronics', 299, 60), (8, 'Stapler', 'stationery', 150, 30);",
  'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), ordered_on date, status text);',
  "INSERT INTO orders VALUES (1, 1, '2026-09-01', 'delivered'), (2, 2, '2026-09-03', 'delivered'), (3, 1, '2026-09-10', 'shipped'),",
  "  (4, 3, '2026-09-12', 'delivered'), (5, 4, '2026-09-20', 'cancelled'), (6, 1, '2026-09-25', 'pending');",
  'CREATE TABLE order_items (order_id int REFERENCES orders(id), product_id int REFERENCES products(id), quantity int, PRIMARY KEY (order_id, product_id));',
  'INSERT INTO order_items VALUES (1, 1, 3), (1, 2, 10), (2, 3, 1), (3, 6, 1), (3, 7, 2), (4, 4, 2), (4, 1, 1), (5, 5, 1), (6, 2, 5);'
);

const SHOP_TABLES = 'Tables: customers (id, name, city, joined_on), products (id, name, category, price, stock), orders (id, customer_id, ordered_on, status) and order_items (order_id, product_id, quantity).';

const CANTEEN_TABLES = lines(
  'CREATE TABLE menu_items (id serial PRIMARY KEY, name text NOT NULL UNIQUE, price numeric(8,2) NOT NULL CHECK (price > 0), is_veg boolean DEFAULT true);',
  "INSERT INTO menu_items (name, price, is_veg) VALUES ('Masala dosa', 60, true), ('Veg thali', 90, true), ('Chicken biryani', 140, false), ('Tea', 15, true), ('Samosa', 20, true);",
  'CREATE TABLE canteen_orders (id serial PRIMARY KEY, student_name text NOT NULL, ordered_at timestamp DEFAULT now());',
  "INSERT INTO canteen_orders (student_name, ordered_at) VALUES ('Asha', '2026-09-28 09:10'), ('Ravi', '2026-09-28 13:05'), ('Asha', '2026-09-28 16:30'), ('Priya', '2026-09-29 12:45');",
  'CREATE TABLE canteen_order_items (order_id int REFERENCES canteen_orders(id) ON DELETE CASCADE, item_id int REFERENCES menu_items(id), quantity int CHECK (quantity > 0), PRIMARY KEY (order_id, item_id));',
  'INSERT INTO canteen_order_items VALUES (1, 1, 1), (1, 4, 2), (2, 3, 1), (2, 5, 2), (3, 4, 1), (3, 5, 1), (4, 2, 1), (4, 4, 1);'
);

/** A check that the answer has exactly these column names (in any order). */
const hasColumns = (...names: string[]) =>
  `SELECT (SELECT array_agg(column_name::text ORDER BY column_name) FROM information_schema.columns WHERE table_name = 'answer') = ARRAY[${[...names].sort().map((n) => `'${n}'`).join(', ')}] AS ok, 'the columns are ${names.join(', ')}' AS msg;`;

export const DATABASE_30_DAYS_CONFIGS: DayConfig[] = [
  // ── WEEK 1: Tables and simple queries ─────────────────────────────────────
  {
    title: 'What a Database Is: Tables, Rows and Your First SELECT',
    desc: 'A database stores information in tables, like well-organised spreadsheets that many people and apps can use at once. Today you learn how tables, rows and columns work, what a primary key is, and you write your first SELECT to read data. (Real world: every app you use, from food delivery to banking, keeps its data in a database like this.)',
    syllabus: [
      'Databases, tables, rows and columns.',
      'Primary keys: one unique id for every row.',
      'Reading data with SELECT and FROM.'
    ],
    eTitle: 'List the Products',
    eDesc: `Show the name and price of every product. ${SHOP_TABLES}`,
    eStarter: lines('-- Show the name and the price of every product', 'SELECT name', 'FROM products;'),
    eHint: 'List both columns after SELECT, separated by a comma: SELECT name, price FROM products;',
    eTest: task(SHOP,
      "SELECT count(*) = 8 AS ok, 'returns all 8 products' AS msg FROM answer;",
      hasColumns('name', 'price')),
    aTitle: 'Everything About Customers',
    aDesc: `Show every column of the customers table. ${SHOP_TABLES}`,
    aStarter: lines('-- Show all the columns of customers (hint: *)', 'SELECT name', 'FROM customers;'),
    aHint: 'The star means every column: SELECT * FROM customers;',
    aTest: task(SHOP,
      "SELECT count(*) = 5 AS ok, 'returns all 5 customers' AS msg FROM answer;",
      hasColumns('id', 'name', 'city', 'joined_on'))
  },
  {
    title: 'Creating Tables: Data Types and Keys',
    desc: 'Before you can store data, you create a table and decide what each column holds: text, whole numbers, money or dates. You also add simple rules, like "this column cannot be empty" and "this is the id". (Real world: a bank decides exactly what an account row contains before the first customer signs up.)',
    syllabus: [
      'CREATE TABLE and the main data types: text, int, numeric, date, boolean.',
      'NOT NULL, DEFAULT and PRIMARY KEY.',
      'serial ids that count up by themselves, and DROP TABLE.'
    ],
    eTitle: 'An Expenses Table',
    eDesc: 'Create a table `expenses` with: `id` (serial, primary key), `item` (text, not null), `amount` (numeric(10,2), not null) and `spent_on` (date, default CURRENT_DATE).',
    eStarter: lines('CREATE TABLE expenses (', '  id serial PRIMARY KEY', '  -- add item, amount and spent_on', ');'),
    eHint: 'Add three lines after the id, each ending with a comma except the last: item text NOT NULL, amount numeric(10,2) NOT NULL, spent_on date DEFAULT CURRENT_DATE',
    eTest: task('',
      "SELECT count(*) = 4 AS ok, 'expenses has the columns id, item, amount and spent_on' AS msg FROM information_schema.columns WHERE table_name = 'expenses' AND column_name IN ('id', 'item', 'amount', 'spent_on');",
      "SELECT bool_and(is_nullable = 'NO') AS ok, 'item and amount are NOT NULL' AS msg FROM information_schema.columns WHERE table_name = 'expenses' AND column_name IN ('item', 'amount');",
      "SELECT column_default ILIKE '%current_date%' AS ok, 'spent_on defaults to today' AS msg FROM information_schema.columns WHERE table_name = 'expenses' AND column_name = 'spent_on';",
      "SELECT count(*) = 1 AS ok, 'id is the primary key' AS msg FROM information_schema.table_constraints WHERE table_name = 'expenses' AND constraint_type = 'PRIMARY KEY';"),
    aTitle: 'A Students Table',
    aDesc: 'Create a table `students` with: `roll_no` (int, primary key), `name` (text, not null), `email` (text, unique) and `marks` (int, default 0).',
    aStarter: lines('CREATE TABLE students (', '  roll_no int PRIMARY KEY,', '  name text', ');'),
    aHint: 'name needs NOT NULL, then add email text UNIQUE and marks int DEFAULT 0.',
    aTest: task('',
      "SELECT count(*) = 4 AS ok, 'students has the columns roll_no, name, email and marks' AS msg FROM information_schema.columns WHERE table_name = 'students' AND column_name IN ('roll_no', 'name', 'email', 'marks');",
      "SELECT is_nullable = 'NO' AS ok, 'name is NOT NULL' AS msg FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'name';",
      "SELECT count(*) = 1 AS ok, 'email is UNIQUE' AS msg FROM information_schema.table_constraints WHERE table_name = 'students' AND constraint_type = 'UNIQUE';",
      "SELECT column_default = '0' AS ok, 'marks defaults to 0' AS msg FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'marks';")
  },
  {
    title: 'Adding, Changing and Deleting Rows',
    desc: 'Tables change all the time: new orders arrive, prices change, old records are removed. Today you learn INSERT to add rows, UPDATE to change them and DELETE to remove them, and why a missing WHERE can change every row by accident. (Real world: every "Save", "Edit" and "Delete" button in an app runs one of these.)',
    syllabus: [
      'INSERT INTO ... VALUES, one row or many.',
      'UPDATE ... SET ... WHERE, and why WHERE matters.',
      'DELETE FROM ... WHERE, and RETURNING to see what changed.'
    ],
    eTitle: 'Add a Product',
    eDesc: `Add a new product: id 9, name 'Sticky notes', category 'stationery', price 45, stock 200. ${SHOP_TABLES}`,
    eStarter: lines("INSERT INTO products (id, name)", "VALUES (9, 'Sticky notes');"),
    eHint: "List all five columns and all five values in the same order: (id, name, category, price, stock) VALUES (9, 'Sticky notes', 'stationery', 45, 200)",
    eTest: task(SHOP,
      "SELECT count(*) = 1 AS ok, 'product 9 is Sticky notes, stationery, 45.00, stock 200' AS msg FROM products WHERE id = 9 AND name = 'Sticky notes' AND category = 'stationery' AND price = 45 AND stock = 200;",
      "SELECT count(*) = 9 AS ok, 'there are now 9 products' AS msg FROM products;"),
    aTitle: 'New Prices and a Clean-Up',
    aDesc: `Raise the price of every product in the 'electronics' category by 10%, then delete the product named 'Stapler' (the shop stopped selling it). ${SHOP_TABLES}`,
    aStarter: lines("UPDATE products SET price = price * 1.10 WHERE category = 'electronics';", '-- now delete the Stapler'),
    aHint: "Add: DELETE FROM products WHERE name = 'Stapler';",
    aTest: task(SHOP,
      "SELECT (SELECT price FROM products WHERE name = 'Headphones') = 1648.90 AS ok, 'Headphones now cost 1648.90' AS msg;",
      "SELECT (SELECT price FROM products WHERE name = 'Phone stand') = 328.90 AS ok, 'Phone stand now costs 328.90' AS msg;",
      "SELECT (SELECT price FROM products WHERE name = 'Pen') = 10 AS ok, 'other prices did not change' AS msg;",
      "SELECT count(*) = 0 AS ok, 'the Stapler is deleted' AS msg FROM products WHERE name = 'Stapler';",
      "SELECT count(*) = 7 AS ok, 'only that one product was deleted' AS msg FROM products;")
  },
  {
    title: 'Filtering Rows with WHERE',
    desc: 'Most questions are about some rows, not all of them: products under 500 rupees, customers from Pune, orders still pending. WHERE keeps only the rows you want. You also meet NULL, which means "unknown", and the trap of comparing with it. (Real world: every filter on a shopping site is a WHERE.)',
    syllabus: [
      'Comparisons: =, <>, <, >, <=, >=.',
      'Combining conditions with AND, OR, NOT and brackets.',
      'NULL, IS NULL and IS NOT NULL.'
    ],
    eTitle: 'Affordable and In Stock',
    eDesc: `Show the names of products that cost less than 1000 and have stock above 0. ${SHOP_TABLES}`,
    eStarter: lines('SELECT name', 'FROM products', 'WHERE price < 1000;'),
    eHint: 'Add a second condition with AND: WHERE price < 1000 AND stock > 0',
    eTest: task(SHOP,
      "SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Notebook', 'Pen', 'Phone stand', 'Stapler', 'Water bottle'] AS ok, 'returns the 5 products under 1000 that are in stock' AS msg;"),
    aTitle: 'Customers Without a City',
    aDesc: `Show the names of customers whose city is unknown (NULL). ${SHOP_TABLES}`,
    aStarter: lines('SELECT name', 'FROM customers', 'WHERE city = NULL;'),
    aHint: 'Nothing is ever "equal" to NULL. Use WHERE city IS NULL.',
    aTest: task(SHOP,
      "SELECT (SELECT array_agg(name) FROM answer) = ARRAY['Meera'] AS ok, 'returns Meera, the only customer with no city' AS msg;")
  },
  {
    title: 'Searching Text and Ranges: LIKE, IN, BETWEEN',
    desc: 'Search boxes, date filters and "show only these categories" all need more than = and <. Today you search text with LIKE and ILIKE, check a list of values with IN, and choose a range with BETWEEN. (Real world: typing "head" in a shop\'s search box and getting Headphones.)',
    syllabus: [
      'LIKE with % and _, and ILIKE for any capital letters.',
      'IN (...) for a list of values.',
      'BETWEEN ... AND ... for numbers and dates.'
    ],
    eTitle: 'Names Starting with P',
    eDesc: `Show the names of products whose name starts with the letter P. ${SHOP_TABLES}`,
    eStarter: lines('SELECT name', 'FROM products', "WHERE name LIKE 'p%';"),
    eHint: "LIKE cares about capital letters. Use LIKE 'P%' or ILIKE 'p%'.",
    eTest: task(SHOP,
      "SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Pen', 'Phone stand'] AS ok, 'returns Pen and Phone stand' AS msg;"),
    aTitle: 'Orders in a Date Range',
    aDesc: `Show the ids of orders placed from 2026-09-05 to 2026-09-20 (both days included) whose status is 'delivered' or 'shipped'. ${SHOP_TABLES}`,
    aStarter: lines('SELECT id', 'FROM orders', "WHERE ordered_on BETWEEN '2026-09-05' AND '2026-09-20';"),
    aHint: "Add AND status IN ('delivered', 'shipped').",
    aTest: task(SHOP,
      "SELECT (SELECT array_agg(id ORDER BY id) FROM answer) = ARRAY[3, 4] AS ok, 'returns orders 3 and 4' AS msg;")
  },
  {
    title: 'Sorting and Pages: ORDER BY, LIMIT, OFFSET',
    desc: 'Results are only useful in a sensible order: cheapest first, newest first, A to Z. Today you sort with ORDER BY, take the top few rows with LIMIT, and split long lists into pages with OFFSET. (Real world: "Sort by price: low to high" and the page numbers at the bottom of a shopping site.)',
    syllabus: [
      'ORDER BY one or more columns, ASC and DESC.',
      'LIMIT for the top N rows.',
      'OFFSET for pages, and where NULLs go when sorting.'
    ],
    eTitle: 'Top 3 Most Expensive',
    eDesc: `Show the names of the 3 most expensive products, the most expensive first. ${SHOP_TABLES}`,
    eStarter: lines('SELECT name', 'FROM products', 'ORDER BY price;'),
    eHint: 'Sort with DESC for highest first, then add LIMIT 3.',
    eTest: task(SHOP,
      "SELECT (SELECT array_agg(name) FROM answer) = ARRAY['Headphones', 'Backpack', 'Desk lamp'] AS ok, 'returns Headphones, Backpack, Desk lamp in that order' AS msg;"),
    aTitle: 'Page 2 of the Catalogue',
    aDesc: `Products are shown 3 per page, sorted by name A to Z. Show the names on page 2. ${SHOP_TABLES}`,
    aStarter: lines('SELECT name', 'FROM products', 'ORDER BY name', 'LIMIT 3;'),
    aHint: 'Page 2 skips the first 3 rows: add OFFSET 3.',
    aTest: task(SHOP,
      "SELECT (SELECT array_agg(name) FROM answer) = ARRAY['Notebook', 'Pen', 'Phone stand'] AS ok, 'returns Notebook, Pen, Phone stand' AS msg;")
  },
  {
    title: 'Useful Functions for Text, Numbers and Dates',
    desc: 'PostgreSQL has built-in functions to clean and reshape data inside a query: change capital letters, join text, round money, and work with dates. You also learn AS to give results clear column names. (Real world: an invoice showing "PEN - Rs 11.80" is built with functions like these.)',
    syllabus: [
      'Text: upper, lower, length, concatenation with ||.',
      'Numbers: round and simple maths; column names with AS.',
      'Dates: current_date, subtracting dates, extract and to_char.'
    ],
    eTitle: 'Names in Capitals with GST',
    eDesc: `For every product, show its name in capital letters as \`name_caps\`, and its price plus 18% GST rounded to 2 decimals as \`price_with_gst\`. ${SHOP_TABLES}`,
    eStarter: lines('SELECT upper(name) AS name_caps,', '       price AS price_with_gst', 'FROM products;'),
    eHint: 'round(price * 1.18, 2) AS price_with_gst',
    eTest: task(SHOP,
      "SELECT count(*) = 8 AS ok, 'returns all 8 products' AS msg FROM answer;",
      "SELECT (SELECT price_with_gst FROM answer WHERE name_caps = 'PEN') = 11.80 AS ok, 'PEN costs 11.80 with GST' AS msg;",
      "SELECT (SELECT price_with_gst FROM answer WHERE name_caps = 'HEADPHONES') = 1768.82 AS ok, 'HEADPHONES cost 1768.82 with GST' AS msg;"),
    aTitle: 'How Old Is Each Order?',
    aDesc: `For every order, show its \`id\` and how many days before 2026-09-30 it was placed, as \`days_ago\`. ${SHOP_TABLES}`,
    aStarter: lines('SELECT id,', '       ordered_on AS days_ago', 'FROM orders;'),
    aHint: "Subtracting two dates gives days: date '2026-09-30' - ordered_on AS days_ago",
    aTest: task(SHOP,
      "SELECT (SELECT days_ago FROM answer WHERE id = 1) = 29 AS ok, 'order 1 is 29 days old' AS msg;",
      "SELECT (SELECT days_ago FROM answer WHERE id = 6) = 5 AS ok, 'order 6 is 5 days old' AS msg;")
  },

  // ── WEEK 2: Totals, groups and joins ──────────────────────────────────────
  {
    title: 'Counting and Totals: COUNT, SUM, AVG, MIN, MAX',
    desc: 'Managers rarely want every row; they want numbers: how many orders, total sales, average price. Aggregate functions turn many rows into one answer. You also learn how they treat NULL values. (Real world: the numbers on every business dashboard.)',
    syllabus: [
      'COUNT(*) and COUNT(column).',
      'SUM, AVG, MIN and MAX.',
      'How NULL affects totals, and rounding averages.'
    ],
    eTitle: 'Catalogue in Numbers',
    eDesc: `Return one row with the number of products as \`product_count\`, the lowest price as \`lowest\` and the highest price as \`highest\`. ${SHOP_TABLES}`,
    eStarter: lines('SELECT count(*) AS product_count', 'FROM products;'),
    eHint: 'Add min(price) AS lowest and max(price) AS highest to the SELECT list.',
    eTest: task(SHOP,
      "SELECT (SELECT product_count FROM answer) = 8 AS ok, '8 products' AS msg;",
      "SELECT (SELECT lowest FROM answer) = 10 AND (SELECT highest FROM answer) = 1499 AS ok, 'lowest price 10, highest 1499' AS msg;"),
    aTitle: 'Stock and Average Price',
    aDesc: `Return one row with the total units in stock as \`total_stock\` and the average price rounded to 2 decimals as \`avg_price\`. ${SHOP_TABLES}`,
    aStarter: lines('SELECT sum(stock) AS total_stock,', '       avg(price) AS avg_price', 'FROM products;'),
    aHint: 'round(avg(price), 2) AS avg_price',
    aTest: task(SHOP,
      "SELECT (SELECT total_stock FROM answer) = 790 AS ok, 'total stock is 790' AS msg;",
      "SELECT (SELECT avg_price::text FROM answer) = '558.38' AS ok, 'average price is 558.38' AS msg;")
  },
  {
    title: 'Groups: GROUP BY and HAVING',
    desc: 'GROUP BY splits rows into groups and gives one result per group: sales per city, products per category, orders per customer. HAVING then filters the groups, the way WHERE filters rows. (Real world: "Top-selling categories this month" on a seller dashboard.)',
    syllabus: [
      'GROUP BY one or more columns.',
      'The rule: every selected column is grouped or aggregated.',
      'HAVING to filter groups, and WHERE vs HAVING.'
    ],
    eTitle: 'Products per Category',
    eDesc: `Show each \`category\` and its number of products as \`product_count\`. ${SHOP_TABLES}`,
    eStarter: lines('SELECT category, count(*) AS product_count', 'FROM products;'),
    eHint: 'Add GROUP BY category at the end.',
    eTest: task(SHOP,
      "SELECT count(*) = 5 AS ok, 'one row per category (5)' AS msg FROM answer;",
      "SELECT (SELECT product_count FROM answer WHERE category = 'stationery') = 3 AS ok, 'stationery has 3 products' AS msg;"),
    aTitle: 'Categories with Several Products',
    aDesc: `Show only the categories that have more than one product (column \`category\`). ${SHOP_TABLES}`,
    aStarter: lines('SELECT category', 'FROM products', 'GROUP BY category;'),
    aHint: 'Add HAVING count(*) > 1 after GROUP BY.',
    aTest: task(SHOP,
      "SELECT (SELECT array_agg(category ORDER BY category) FROM answer) = ARRAY['electronics', 'stationery'] AS ok, 'returns electronics and stationery' AS msg;")
  },
  {
    title: 'Linking Tables: Relationships and Foreign Keys',
    desc: 'Real data lives in several linked tables: customers, their orders, and the products in each order. A foreign key is a column that points to a row in another table, and PostgreSQL makes sure it always points to something real. (Real world: an order in a food app always belongs to a real customer and a real restaurant.)',
    syllabus: [
      'One-to-many and many-to-many relationships.',
      'FOREIGN KEY ... REFERENCES, and what it prevents.',
      'Linking tables in a design: customers, orders, order_items.'
    ],
    eTitle: 'A Reviews Table',
    eDesc: 'The `products` table exists. Create a table `reviews` with `id` (serial, primary key), `product_id` (int, a foreign key to products.id), `rating` (int, must be between 1 and 5) and `comment` (text).',
    eStarter: lines('CREATE TABLE reviews (', '  id serial PRIMARY KEY,', '  product_id int,', '  rating int,', '  comment text', ');'),
    eHint: 'product_id int REFERENCES products(id), rating int CHECK (rating BETWEEN 1 AND 5)',
    eTest: task(SHOP,
      "SELECT count(*) = 1 AS ok, 'product_id is a foreign key to products' AS msg FROM information_schema.table_constraints WHERE table_name = 'reviews' AND constraint_type = 'FOREIGN KEY';",
      "SELECT count(*) = 1 AS ok, 'rating has a CHECK rule' AS msg FROM pg_constraint WHERE conrelid = 'reviews'::regclass AND contype = 'c';"),
    aTitle: 'Orders per Customer',
    aDesc: `Show each \`customer_id\` from the orders table and how many orders it has, as \`orders\`. ${SHOP_TABLES}`,
    aStarter: lines('SELECT customer_id', 'FROM orders;'),
    aHint: 'SELECT customer_id, count(*) AS orders FROM orders GROUP BY customer_id;',
    aTest: task(SHOP,
      "SELECT count(*) = 4 AS ok, 'one row for each of the 4 customers who ordered' AS msg FROM answer;",
      "SELECT (SELECT orders FROM answer WHERE customer_id = 1) = 3 AS ok, 'customer 1 has 3 orders' AS msg;")
  },
  {
    title: 'Joining Tables: INNER JOIN',
    desc: 'A JOIN puts linked tables side by side in one result: each order next to its customer\'s name, each order item next to its product. INNER JOIN keeps only rows that have a match on both sides. You also learn table aliases to keep joins short. (Real world: "Order #1042 by Asha, 3 items" on an admin screen.)',
    syllabus: [
      'JOIN ... ON: matching a foreign key to a primary key.',
      'Table aliases like o and c.',
      'Joining and then filtering, sorting and totalling.'
    ],
    eTitle: 'Orders with Customer Names',
    eDesc: `Show every order's id as \`order_id\` and its customer's name as \`customer_name\`. ${SHOP_TABLES}`,
    eStarter: lines('SELECT o.id AS order_id,', '       o.customer_id AS customer_name', 'FROM orders o;'),
    eHint: 'JOIN customers c ON c.id = o.customer_id, then select c.name AS customer_name.',
    eTest: task(SHOP,
      "SELECT count(*) = 6 AS ok, 'returns all 6 orders' AS msg FROM answer;",
      "SELECT (SELECT customer_name FROM answer WHERE order_id = 2) = 'Ravi' AS ok, 'order 2 belongs to Ravi' AS msg;"),
    aTitle: 'What Was in Order 1?',
    aDesc: `Show the product names as \`product\` and the \`quantity\` of each item in order 1. ${SHOP_TABLES}`,
    aStarter: lines('SELECT oi.product_id AS product, oi.quantity', 'FROM order_items oi', 'WHERE oi.order_id = 1;'),
    aHint: 'JOIN products p ON p.id = oi.product_id and select p.name AS product.',
    aTest: task(SHOP,
      "SELECT (SELECT array_agg(product || ' x' || quantity ORDER BY product) FROM answer) = ARRAY['Notebook x3', 'Pen x10'] AS ok, 'returns Notebook x3 and Pen x10' AS msg;")
  },
  {
    title: 'Keeping Rows Without a Match: LEFT JOIN',
    desc: 'INNER JOIN drops rows with no match, so a customer who never ordered disappears from the results. LEFT JOIN keeps every row from the left table and fills the missing side with NULL. It is how you find "customers with no orders" or "products never sold". (Real world: a shop owner looking for products nobody has bought.)',
    syllabus: [
      'LEFT JOIN and the NULLs it produces.',
      'Counting with LEFT JOIN: count(column) vs count(*).',
      'Finding rows with no match: WHERE ... IS NULL.'
    ],
    eTitle: 'Every Customer\'s Order Count',
    eDesc: `Show every customer's \`name\` and their number of orders as \`order_count\`, including customers with no orders (0). ${SHOP_TABLES}`,
    eStarter: lines('SELECT c.name, count(o.id) AS order_count', 'FROM customers c', 'JOIN orders o ON o.customer_id = c.id', 'GROUP BY c.name;'),
    eHint: 'Change JOIN to LEFT JOIN so customers without orders are kept.',
    eTest: task(SHOP,
      "SELECT count(*) = 5 AS ok, 'all 5 customers are listed' AS msg FROM answer;",
      "SELECT (SELECT order_count FROM answer WHERE name = 'Meera') = 0 AS ok, 'Meera has 0 orders' AS msg;",
      "SELECT (SELECT order_count FROM answer WHERE name = 'Asha') = 3 AS ok, 'Asha has 3 orders' AS msg;"),
    aTitle: 'Products Nobody Ordered',
    aDesc: `Show the names of products that appear in no order. ${SHOP_TABLES}`,
    aStarter: lines('SELECT p.name', 'FROM products p', 'LEFT JOIN order_items oi ON oi.product_id = p.id;'),
    aHint: 'Keep only the rows where the order side is missing: WHERE oi.product_id IS NULL',
    aTest: task(SHOP,
      "SELECT (SELECT array_agg(name) FROM answer) = ARRAY['Stapler'] AS ok, 'returns only Stapler' AS msg;")
  },
  {
    title: 'Joining Many Tables, and a Table to Itself',
    desc: 'Real questions often need three or four tables: which products did each customer buy? You chain joins one after another. You also learn the self join, where a table is joined to itself, for example employees and their managers. (Real world: "customers who bought this also bought..." starts with joins like these.)',
    syllabus: [
      'Chaining several JOINs.',
      'Joining, filtering and grouping together.',
      'Self joins with two aliases for the same table.'
    ],
    eTitle: 'Units Sold in Delivered Orders',
    eDesc: `For delivered orders only, show each product's name as \`product\` and the total quantity sold as \`units\`. ${SHOP_TABLES}`,
    eStarter: lines('SELECT p.name AS product, sum(oi.quantity) AS units', 'FROM order_items oi', 'JOIN products p ON p.id = oi.product_id', 'GROUP BY p.name;'),
    eHint: "Also JOIN orders o ON o.id = oi.order_id, and add WHERE o.status = 'delivered' before GROUP BY.",
    eTest: task(SHOP,
      "SELECT count(*) = 4 AS ok, '4 products were in delivered orders' AS msg FROM answer;",
      "SELECT (SELECT units FROM answer WHERE product = 'Notebook') = 4 AND (SELECT units FROM answer WHERE product = 'Pen') = 10 AS ok, 'Notebook 4 units, Pen 10 units' AS msg;"),
    aTitle: 'Employees and Their Managers',
    aDesc: 'Table: employees (id, name, manager_id), where manager_id is the id of another employee. Show each employee\'s name as `employee` and their manager\'s name as `manager`, for employees who have a manager.',
    aStarter: lines('SELECT e.name AS employee, e.manager_id AS manager', 'FROM employees e;'),
    aHint: 'JOIN employees m ON m.id = e.manager_id, and select m.name AS manager.',
    aTest: task(lines(
      'CREATE TABLE employees (id int PRIMARY KEY, name text, manager_id int);',
      "INSERT INTO employees VALUES (1, 'Anita', NULL), (2, 'Vikram', 1), (3, 'Sara', 1), (4, 'Joel', 2);"),
      "SELECT (SELECT array_agg(employee || '>' || manager ORDER BY employee) FROM answer) = ARRAY['Joel>Vikram', 'Sara>Anita', 'Vikram>Anita'] AS ok, 'Joel reports to Vikram; Sara and Vikram report to Anita' AS msg;")
  },
  {
    title: 'Combining Results: UNION, INTERSECT, EXCEPT',
    desc: 'Sometimes you stack the results of two queries on top of each other, find what they have in common, or find what is in one but not the other. That is UNION, INTERSECT and EXCEPT. (Real world: "cities where we have customers but no store yet" is a business question you can answer in one query.)',
    syllabus: [
      'UNION and UNION ALL: removing duplicates or keeping them.',
      'INTERSECT and EXCEPT.',
      'The rule: both queries return the same number and type of columns.'
    ],
    eTitle: 'All Cities',
    eDesc: 'Tables: customers (id, name, city) and stores (city). Show every city that has a customer or a store, each city once. Ignore customers with no city.',
    eStarter: lines('SELECT city FROM customers WHERE city IS NOT NULL', 'UNION ALL', 'SELECT city FROM stores;'),
    eHint: 'UNION ALL keeps duplicates. UNION removes them.',
    eTest: task(lines(SHOP, "CREATE TABLE stores (city text); INSERT INTO stores VALUES ('Pune'), ('Bengaluru'), ('Delhi');"),
      "SELECT (SELECT array_agg(city ORDER BY city) FROM answer) = ARRAY['Bengaluru', 'Delhi', 'Mumbai', 'Pune'] AS ok, 'returns Bengaluru, Delhi, Mumbai, Pune once each' AS msg;"),
    aTitle: 'Customers but No Store',
    aDesc: 'Same tables. Show the cities that have customers but no store.',
    aStarter: lines('SELECT city FROM customers WHERE city IS NOT NULL', 'INTERSECT', 'SELECT city FROM stores;'),
    aHint: 'INTERSECT finds cities in both. EXCEPT finds cities in the first query but not the second.',
    aTest: task(lines(SHOP, "CREATE TABLE stores (city text); INSERT INTO stores VALUES ('Pune'), ('Bengaluru'), ('Delhi');"),
      "SELECT (SELECT array_agg(city) FROM answer) = ARRAY['Mumbai'] AS ok, 'returns only Mumbai' AS msg;")
  },

  // ── WEEK 3: Deeper queries and good design ────────────────────────────────
  {
    title: 'Queries Inside Queries: Subqueries',
    desc: 'A subquery is a query inside another query. It lets you answer questions in steps: first find the average price, then find the products above it. Subqueries can return one value, a list for IN, or a whole table. (Real world: "customers who spent more than the average customer".)',
    syllabus: [
      'Subqueries that return one value.',
      'IN and EXISTS with a subquery.',
      'Subqueries in FROM, and when a JOIN is clearer.'
    ],
    eTitle: 'Above-Average Prices',
    eDesc: `Show the names of products that cost more than the average product price. ${SHOP_TABLES}`,
    eStarter: lines('SELECT name', 'FROM products', 'WHERE price > (SELECT min(price) FROM products);'),
    eHint: 'The inner query should find the average: (SELECT avg(price) FROM products)',
    eTest: task(SHOP,
      "SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Backpack', 'Desk lamp', 'Headphones'] AS ok, 'returns Backpack, Desk lamp, Headphones' AS msg;"),
    aTitle: 'Customers with a Delivered Order',
    aDesc: `Show the names of customers who have at least one delivered order. ${SHOP_TABLES}`,
    aStarter: lines('SELECT name', 'FROM customers', 'WHERE id IN (SELECT customer_id FROM orders);'),
    aHint: "Only delivered orders: (SELECT customer_id FROM orders WHERE status = 'delivered')",
    aTest: task(SHOP,
      "SELECT (SELECT array_agg(name ORDER BY name) FROM answer) = ARRAY['Asha', 'Priya', 'Ravi'] AS ok, 'returns Asha, Priya, Ravi' AS msg;")
  },
  {
    title: 'Readable Queries with WITH',
    desc: 'Long queries become hard to read. WITH lets you name a step, like "order_totals", and then use it like a table in the rest of the query. It is called a CTE (common table expression). You also meet recursive WITH for counting and trees. (Real world: analysts at every company write reports as a chain of named steps.)',
    syllabus: [
      'WITH name AS (...) SELECT ... FROM name.',
      'Several steps in one WITH.',
      'WITH RECURSIVE for sequences and hierarchies.'
    ],
    eTitle: 'Big Orders',
    eDesc: `Using WITH, work out each order's total value (quantity times price) and show the orders whose total is above 500, as \`order_id\` and \`total\`. ${SHOP_TABLES}`,
    eStarter: lines('WITH order_totals AS (', '  SELECT oi.order_id, sum(oi.quantity * p.price) AS total', '  FROM order_items oi', '  JOIN products p ON p.id = oi.product_id', '  GROUP BY oi.order_id', ')', 'SELECT order_id, total', 'FROM order_totals;'),
    eHint: 'Add WHERE total > 500 to the last SELECT.',
    eTest: task(SHOP,
      "SELECT (SELECT array_agg(order_id ORDER BY order_id) FROM answer) = ARRAY[2, 3, 4, 5] AS ok, 'returns orders 2, 3, 4 and 5' AS msg;",
      "SELECT (SELECT total FROM answer WHERE order_id = 3) = 2097 AS ok, 'order 3 is worth 2097' AS msg;"),
    aTitle: 'Count to Ten',
    aDesc: 'Using WITH RECURSIVE, return the numbers 1 to 10 in a column named `n`.',
    aStarter: lines('WITH RECURSIVE nums(n) AS (', '  SELECT 1', '  -- add UNION ALL and the next number, stopping at 10', ')', 'SELECT n FROM nums;'),
    aHint: 'After SELECT 1 add: UNION ALL SELECT n + 1 FROM nums WHERE n < 10',
    aTest: task('',
      "SELECT count(*) = 10 AND sum(n) = 55 AS ok, 'returns the 10 numbers 1 to 10' AS msg FROM answer;")
  },
  {
    title: 'Ranking Rows: Window Functions',
    desc: 'Window functions calculate across a group of rows while keeping every row: a rank within each category, a row number, the top item per group. They are one of the most asked-about SQL topics in data and backend interviews. (Real world: a leaderboard showing each player\'s rank in their league.)',
    syllabus: [
      'OVER (ORDER BY ...) with ROW_NUMBER, RANK and DENSE_RANK.',
      'PARTITION BY: ranking inside each group.',
      'The top item per group with a window function in a CTE.'
    ],
    eTitle: 'Rank Within Category',
    eDesc: `Show each product's \`name\`, \`category\` and its price rank inside its category as \`rank_in_category\` (1 = most expensive). ${SHOP_TABLES}`,
    eStarter: lines('SELECT name, category,', '       rank() OVER (ORDER BY price DESC) AS rank_in_category', 'FROM products;'),
    eHint: 'Rank inside each category: OVER (PARTITION BY category ORDER BY price DESC)',
    eTest: task(SHOP,
      "SELECT (SELECT rank_in_category FROM answer WHERE name = 'Phone stand') = 2 AS ok, 'Phone stand is 2nd in electronics' AS msg;",
      "SELECT (SELECT rank_in_category FROM answer WHERE name = 'Stapler') = 1 AND (SELECT rank_in_category FROM answer WHERE name = 'Pen') = 3 AS ok, 'Stapler is 1st and Pen 3rd in stationery' AS msg;"),
    aTitle: 'Most Expensive per Category',
    aDesc: `Show one row per category: the \`category\` and the \`name\` of its most expensive product. ${SHOP_TABLES}`,
    aStarter: lines('WITH ranked AS (', '  SELECT category, name,', '         row_number() OVER (PARTITION BY category ORDER BY price DESC) AS rn', '  FROM products', ')', 'SELECT category, name', 'FROM ranked;'),
    aHint: 'Keep only the first row of each category: WHERE rn = 1',
    aTest: task(SHOP,
      "SELECT count(*) = 5 AS ok, 'one row per category (5)' AS msg FROM answer;",
      "SELECT (SELECT name FROM answer WHERE category = 'stationery') = 'Stapler' AND (SELECT name FROM answer WHERE category = 'electronics') = 'Headphones' AS ok, 'Stapler for stationery, Headphones for electronics' AS msg;")
  },
  {
    title: 'Running Totals and Moving Averages',
    desc: 'Window functions can also add up as they go: a running total of sales, or the average of the last three days. You control which rows are included with a frame, like "the 2 rows before this one". (Real world: a sales chart showing total revenue so far this month.)',
    syllabus: [
      'SUM(...) OVER (ORDER BY ...) for running totals.',
      'Frames: ROWS BETWEEN n PRECEDING AND CURRENT ROW.',
      'LAG and LEAD: comparing a row with the one before.'
    ],
    eTitle: 'Revenue So Far',
    eDesc: 'Table: daily_sales (day, amount). Show `day`, `amount` and the running total of amount up to that day as `running_total`.',
    eStarter: lines('SELECT day, amount,', '       sum(amount) OVER () AS running_total', 'FROM daily_sales;'),
    eHint: 'A running total needs an order: sum(amount) OVER (ORDER BY day)',
    eTest: task(lines(
      'CREATE TABLE daily_sales (day date, amount numeric);',
      "INSERT INTO daily_sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200), ('2026-09-03', 2097), ('2026-09-04', 760);"),
      "SELECT (SELECT running_total FROM answer WHERE day = '2026-09-01') = 280 AS ok, 'the first day''s running total is 280' AS msg;",
      "SELECT (SELECT running_total FROM answer WHERE day = '2026-09-03') = 3577 AS ok, 'by the third day it is 3577' AS msg;"),
    aTitle: '3-Day Moving Average',
    aDesc: 'Same table. Show `day` and the average of that day and the 2 days before it, rounded to 2 decimals, as `moving_avg`.',
    aStarter: lines('SELECT day,', '       round(avg(amount) OVER (), 2) AS moving_avg', 'FROM daily_sales;'),
    aHint: 'OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)',
    aTest: task(lines(
      'CREATE TABLE daily_sales (day date, amount numeric);',
      "INSERT INTO daily_sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200), ('2026-09-03', 2097), ('2026-09-04', 760);"),
      "SELECT (SELECT moving_avg FROM answer WHERE day = '2026-09-02') = 740 AS ok, 'day 2 averages days 1-2: 740.00' AS msg;",
      "SELECT (SELECT moving_avg FROM answer WHERE day = '2026-09-04') = 1352.33 AS ok, 'day 4 averages days 2-4: 1352.33' AS msg;")
  },
  {
    title: 'Decisions Inside a Query: CASE',
    desc: 'CASE lets a query make decisions, like an if/else: label a price as budget, mid or premium; turn a status code into words; or count different kinds of rows in one pass. (Real world: a report that groups customers into "new", "regular" and "loyal".)',
    syllabus: [
      'CASE WHEN ... THEN ... ELSE ... END.',
      'CASE inside ORDER BY and GROUP BY.',
      'Counting by condition with FILTER or SUM(CASE ...).'
    ],
    eTitle: 'Price Bands',
    eDesc: `Show each product's \`name\` and a \`price_band\`: 'budget' if the price is under 100, 'mid' if under 1000, otherwise 'premium'. ${SHOP_TABLES}`,
    eStarter: lines('SELECT name,', "       CASE WHEN price < 100 THEN 'budget' ELSE 'premium' END AS price_band", 'FROM products;'),
    eHint: "Add a middle step: WHEN price < 1000 THEN 'mid' (after the budget line).",
    eTest: task(SHOP,
      "SELECT (SELECT count(*) FROM answer WHERE price_band = 'budget') = 2 AND (SELECT count(*) FROM answer WHERE price_band = 'mid') = 4 AND (SELECT count(*) FROM answer WHERE price_band = 'premium') = 2 AS ok, '2 budget, 4 mid and 2 premium products' AS msg;"),
    aTitle: 'Order Status Summary',
    aDesc: `Return one row with the number of delivered orders as \`delivered_count\`, the number of shipped or pending orders as \`open_count\`, and the number of cancelled orders as \`cancelled_count\`. ${SHOP_TABLES}`,
    aStarter: lines('SELECT count(*) AS delivered_count', 'FROM orders;'),
    aHint: "count(*) FILTER (WHERE status = 'delivered') AS delivered_count, and the same idea for the others.",
    aTest: task(SHOP,
      "SELECT (SELECT delivered_count FROM answer) = 3 AND (SELECT open_count FROM answer) = 2 AND (SELECT cancelled_count FROM answer) = 1 AS ok, '3 delivered, 2 open, 1 cancelled' AS msg;")
  },
  {
    title: 'Designing Good Tables: Normalization',
    desc: 'A badly designed table repeats the same information again and again, so one change must be made in many places and mistakes creep in. Normalization is splitting data into sensible tables so each fact is stored once. You learn the first three normal forms in plain words. (Real world: a customer\'s address stored once, not copied into every order.)',
    syllabus: [
      'The problems with repeated data.',
      '1NF, 2NF and 3NF in plain words.',
      'Splitting a flat table into linked tables.'
    ],
    eTitle: 'Find the Real Customers',
    eDesc: 'Table: orders_flat (order_id, customer_name, customer_city, product, price), where customer details repeat on every order. Show each customer once, with `customer_name` and `customer_city`.',
    eStarter: lines('SELECT customer_name, customer_city', 'FROM orders_flat;'),
    eHint: 'SELECT DISTINCT removes repeated rows.',
    eTest: task(lines(
      'CREATE TABLE orders_flat (order_id int, customer_name text, customer_city text, product text, price numeric);',
      "INSERT INTO orders_flat VALUES (1, 'Asha', 'Pune', 'Pen', 10), (2, 'Asha', 'Pune', 'Notebook', 60), (3, 'Ravi', 'Mumbai', 'Pen', 10), (4, 'Priya', 'Pune', 'Backpack', 1200);"),
      "SELECT count(*) = 3 AS ok, 'each of the 3 customers appears once' AS msg FROM answer;"),
    aTitle: 'Split Out a People Table',
    aDesc: 'Same orders_flat table. Create a table `people` with `id` (serial, primary key), `name` and `city`, and fill it with each customer once, using INSERT ... SELECT.',
    aStarter: lines('CREATE TABLE people (id serial PRIMARY KEY, name text, city text);', 'INSERT INTO people (name, city)', 'SELECT customer_name, customer_city FROM orders_flat;'),
    aHint: 'Add DISTINCT to the SELECT so each customer is inserted once.',
    aTest: task(lines(
      'CREATE TABLE orders_flat (order_id int, customer_name text, customer_city text, product text, price numeric);',
      "INSERT INTO orders_flat VALUES (1, 'Asha', 'Pune', 'Pen', 10), (2, 'Asha', 'Pune', 'Notebook', 60), (3, 'Ravi', 'Mumbai', 'Pen', 10), (4, 'Priya', 'Pune', 'Backpack', 1200);"),
      "SELECT count(*) = 3 AS ok, 'people has 3 rows' AS msg FROM people;",
      "SELECT count(*) = 1 AS ok, 'Asha appears once' AS msg FROM people WHERE name = 'Asha';")
  },
  {
    title: 'Constraints That Protect Your Data',
    desc: 'Constraints are rules the database enforces for you, whatever app or person writes the data: no duplicate emails, no negative balances, no orders for customers that do not exist. Today you add them to existing tables and choose what happens when a linked row is deleted. (Real world: a bank database that simply refuses a negative balance.)',
    syllabus: [
      'UNIQUE and CHECK, and adding them with ALTER TABLE.',
      'Foreign key actions: ON DELETE CASCADE, SET NULL, RESTRICT.',
      'Why rules belong in the database as well as in the app.'
    ],
    eTitle: 'Protect the Accounts Table',
    eDesc: 'Table: accounts (id, email, balance). Use ALTER TABLE to make `email` unique and to make sure `balance` can never be below 0.',
    eStarter: lines('ALTER TABLE accounts ADD CONSTRAINT email_unique UNIQUE (email);', '-- add a CHECK so balance is never below 0'),
    eHint: 'ALTER TABLE accounts ADD CONSTRAINT balance_not_negative CHECK (balance >= 0);',
    eTest: task("CREATE TABLE accounts (id int PRIMARY KEY, email text, balance numeric); INSERT INTO accounts VALUES (1, 'asha@example.com', 500);",
      "SELECT count(*) = 1 AS ok, 'email is UNIQUE' AS msg FROM pg_constraint WHERE conrelid = 'accounts'::regclass AND contype = 'u';",
      "SELECT count(*) = 1 AS ok, 'balance has a CHECK rule' AS msg FROM pg_constraint WHERE conrelid = 'accounts'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) ILIKE '%balance%';"),
    aTitle: 'Books That Follow Their Author',
    aDesc: 'Table: authors (id, name). Create a table `books` with `id` (serial, primary key), `title` (text) and `author_id` (a foreign key to authors), so that deleting an author also deletes their books.',
    aStarter: lines('CREATE TABLE books (', '  id serial PRIMARY KEY,', '  title text,', '  author_id int REFERENCES authors(id)', ');'),
    aHint: 'Add ON DELETE CASCADE after REFERENCES authors(id).',
    aTest: task('CREATE TABLE authors (id int PRIMARY KEY, name text);',
      "SELECT count(*) = 1 AS ok, 'deleting an author deletes their books (ON DELETE CASCADE)' AS msg FROM pg_constraint WHERE conrelid = 'books'::regclass AND contype = 'f' AND confdeltype = 'c';")
  },

  // ── WEEK 4: Real-world skills and the Canteen project ─────────────────────
  {
    title: 'Transactions: All or Nothing',
    desc: 'Some changes must happen together or not at all: moving money takes it from one account and adds it to another. A transaction groups statements so they either all succeed (COMMIT) or all undo (ROLLBACK). You also learn what ACID means in plain words. (Real world: a UPI payment never takes your money without delivering it.)',
    syllabus: [
      'BEGIN, COMMIT and ROLLBACK.',
      'ACID in plain words.',
      'What happens when two people change the same row.'
    ],
    eTitle: 'Transfer Money',
    eDesc: 'Table: accounts (id, name, balance). In one transaction, move 500 from account 1 to account 2.',
    eStarter: lines('BEGIN;', 'UPDATE accounts SET balance = balance - 500 WHERE id = 1;', '-- add the money to account 2', 'COMMIT;'),
    eHint: 'Before COMMIT, add: UPDATE accounts SET balance = balance + 500 WHERE id = 2;',
    eTest: task("CREATE TABLE accounts (id int PRIMARY KEY, name text, balance numeric); INSERT INTO accounts VALUES (1, 'Asha', 1000), (2, 'Ravi', 200);",
      "SELECT (SELECT balance FROM accounts WHERE id = 1) = 500 AND (SELECT balance FROM accounts WHERE id = 2) = 700 AS ok, 'Asha has 500 and Ravi 700' AS msg;"),
    aTitle: 'Record a Sale',
    aDesc: 'Tables: stock (product, units) and sales (product, quantity). In one transaction, reduce the Pen stock by 5 and add a row to sales for 5 Pens.',
    aStarter: lines('BEGIN;', "UPDATE stock SET units = units - 5 WHERE product = 'Pen';", 'COMMIT;'),
    aHint: "Before COMMIT, add: INSERT INTO sales VALUES ('Pen', 5);",
    aTest: task("CREATE TABLE stock (product text PRIMARY KEY, units int); INSERT INTO stock VALUES ('Pen', 500), ('Notebook', 120); CREATE TABLE sales (product text, quantity int);",
      "SELECT (SELECT units FROM stock WHERE product = 'Pen') = 495 AS ok, 'Pen stock is now 495' AS msg;",
      "SELECT count(*) = 1 AS ok, 'one sale of 5 Pens is recorded' AS msg FROM sales WHERE product = 'Pen' AND quantity = 5;")
  },
  {
    title: 'Faster Queries: Indexes and EXPLAIN',
    desc: 'On a big table, finding one row can mean reading millions. An index is like the index at the back of a book: it lets PostgreSQL jump straight to the right rows. EXPLAIN shows how PostgreSQL plans to run a query, so you can see whether an index is used. (Real world: searching a phone number among crores of accounts in milliseconds.)',
    syllabus: [
      'CREATE INDEX, and what an index costs.',
      'Reading EXPLAIN: Seq Scan vs Index Scan.',
      'Unique indexes and indexes on expressions like lower(email).'
    ],
    eTitle: 'Index the Customer Column',
    eDesc: `Create an index named \`idx_orders_customer\` on the \`customer_id\` column of orders. ${SHOP_TABLES}`,
    eStarter: lines('-- create the index here'),
    eHint: 'CREATE INDEX idx_orders_customer ON orders (customer_id);',
    eTest: task(SHOP,
      "SELECT count(*) = 1 AS ok, 'idx_orders_customer exists on orders(customer_id)' AS msg FROM pg_indexes WHERE indexname = 'idx_orders_customer' AND tablename = 'orders' AND indexdef ILIKE '%(customer_id)%';"),
    aTitle: 'One Account per Email',
    aDesc: 'Table: users (id, email). Create a unique index named `idx_users_email` on lower(email), so "Asha@x.com" and "asha@x.com" count as the same email.',
    aStarter: lines('CREATE INDEX idx_users_email ON users (email);'),
    aHint: 'CREATE UNIQUE INDEX idx_users_email ON users (lower(email));',
    aTest: task('CREATE TABLE users (id int PRIMARY KEY, email text);',
      "SELECT count(*) = 1 AS ok, 'a UNIQUE index on lower(email)' AS msg FROM pg_indexes WHERE indexname = 'idx_users_email' AND indexdef ILIKE '%unique%lower(email)%';")
  },
  {
    title: 'Saved Queries: Views',
    desc: 'A view is a saved query with a name. You use it like a table, but it always shows fresh data. Views hide complicated joins behind a simple name and let you give people only the columns they need. (Real world: a "monthly_sales" view that the whole finance team uses.)',
    syllabus: [
      'CREATE VIEW and CREATE OR REPLACE VIEW.',
      'Using views to simplify joins and hide columns.',
      'Materialized views: saved results you refresh.'
    ],
    eTitle: 'A Price List View',
    eDesc: `Create a view \`product_summary\` with each product's \`name\` and its price with 18% GST rounded to 2 decimals as \`price_with_gst\`. ${SHOP_TABLES}`,
    eStarter: lines('CREATE VIEW product_summary AS', 'SELECT name', 'FROM products;'),
    eHint: 'Add round(price * 1.18, 2) AS price_with_gst to the SELECT.',
    eTest: task(SHOP,
      "SELECT count(*) = 1 AS ok, 'the view product_summary exists' AS msg FROM information_schema.views WHERE table_name = 'product_summary';",
      "SELECT (SELECT price_with_gst FROM product_summary WHERE name = 'Pen') = 11.80 AS ok, 'Pen shows 11.80' AS msg;"),
    aTitle: 'Orders per Customer View',
    aDesc: `Create a view \`customer_order_counts\` with every customer's \`name\` and their number of orders as \`order_count\`, including customers with 0 orders. ${SHOP_TABLES}`,
    aStarter: lines('CREATE VIEW customer_order_counts AS', 'SELECT c.name, count(o.id) AS order_count', 'FROM customers c', 'JOIN orders o ON o.customer_id = c.id', 'GROUP BY c.name;'),
    aHint: 'Use LEFT JOIN so customers without orders stay in the view.',
    aTest: task(SHOP,
      "SELECT (SELECT order_count FROM customer_order_counts WHERE name = 'Meera') = 0 AS ok, 'Meera shows 0 orders' AS msg;",
      "SELECT (SELECT order_count FROM customer_order_counts WHERE name = 'Asha') = 3 AS ok, 'Asha shows 3 orders' AS msg;")
  },
  {
    title: 'JSON Data in PostgreSQL',
    desc: 'Some data does not fit neat columns: app events, settings, answers from an API. PostgreSQL can store JSON in a jsonb column and still query inside it. Today you read values with -> and ->>, filter by them and count them. (Real world: apps log every click as a JSON event and analyse them with SQL.)',
    syllabus: [
      'json vs jsonb, and storing JSON in a column.',
      'Reading values with -> and ->>.',
      'Filtering, grouping and the @> "contains" operator.'
    ],
    eTitle: 'Pages That Were Clicked',
    eDesc: 'Table: events (id, data jsonb), where data looks like {"type": "click", "page": "/home"}. Show the page (as text) of every click event, in a column named `page`.',
    eStarter: lines("SELECT data->'page' AS page", 'FROM events;'),
    eHint: "->> gives text. Use data->>'page' and add WHERE data->>'type' = 'click'.",
    eTest: task(lines(
      'CREATE TABLE events (id int, data jsonb);',
      'INSERT INTO events VALUES',
      '  (1, \'{"type": "click", "page": "/home"}\'), (2, \'{"type": "view", "page": "/cart"}\'),',
      '  (3, \'{"type": "click", "page": "/cart"}\'), (4, \'{"type": "click", "page": "/home"}\'), (5, \'{"type": "view", "page": "/home"}\');'),
      "SELECT (SELECT array_agg(page ORDER BY page) FROM answer) = ARRAY['/cart', '/home', '/home'] AS ok, 'returns the 3 click pages as text' AS msg;"),
    aTitle: 'Events per Type',
    aDesc: 'Same table. Show each event `type` (as text) and how many events it has, as `events`.',
    aStarter: lines("SELECT data->>'type' AS type", 'FROM events;'),
    aHint: "SELECT data->>'type' AS type, count(*) AS events FROM events GROUP BY data->>'type';",
    aTest: task(lines(
      'CREATE TABLE events (id int, data jsonb);',
      'INSERT INTO events VALUES',
      '  (1, \'{"type": "click", "page": "/home"}\'), (2, \'{"type": "view", "page": "/cart"}\'),',
      '  (3, \'{"type": "click", "page": "/cart"}\'), (4, \'{"type": "click", "page": "/home"}\'), (5, \'{"type": "view", "page": "/home"}\');'),
      "SELECT (SELECT events FROM answer WHERE type = 'click') = 3 AND (SELECT events FROM answer WHERE type = 'view') = 2 AS ok, '3 click events and 2 view events' AS msg;")
  },
  {
    title: 'Using a Database from Python and Node.js',
    desc: 'Apps talk to PostgreSQL through a driver: psycopg in Python and pg in Node.js. The most important rule is to never glue user input into SQL text, which allows SQL injection attacks. Instead you send parameters separately. In SQL itself you see the same idea with prepared statements. (Real world: the login form of every website must be safe from SQL injection.)',
    syllabus: [
      'Connecting from Python (psycopg) and Node.js (pg).',
      'SQL injection, and why parameters stop it.',
      'Prepared statements: PREPARE and EXECUTE with $1.'
    ],
    eTitle: 'A Safe Customer Lookup',
    eDesc: `Create a prepared statement named \`find_customer\` that takes one text parameter and returns the customers whose name equals it. ${SHOP_TABLES}`,
    eStarter: lines("PREPARE find_customer AS", "SELECT * FROM customers WHERE name = 'Asha';"),
    eHint: 'PREPARE find_customer(text) AS SELECT * FROM customers WHERE name = $1;',
    eTest: task(SHOP,
      "CREATE TEMP TABLE check_result AS EXECUTE find_customer('Ravi');",
      "SELECT count(*) = 1 AND min(name) = 'Ravi' AS ok, 'EXECUTE find_customer(''Ravi'') returns Ravi' AS msg FROM check_result;"),
    aTitle: 'A Safe Search Box',
    aDesc: `Create a prepared statement named \`search_customers\` that takes one text parameter and returns the names of customers whose name contains it, ignoring capital letters. ${SHOP_TABLES}`,
    aStarter: lines('PREPARE search_customers(text) AS', 'SELECT name FROM customers WHERE name = $1;'),
    aHint: "WHERE name ILIKE '%' || $1 || '%'",
    aTest: task(SHOP,
      "CREATE TEMP TABLE check_result AS EXECUTE search_customers('RA');",
      "SELECT (SELECT array_agg(name ORDER BY name) FROM check_result) = ARRAY['Karan', 'Meera', 'Ravi'] AS ok, 'searching RA finds Karan, Meera and Ravi' AS msg;")
  },
  {
    title: 'Project: Designing the Canteen Database',
    desc: 'This week you build a database for a college canteen from scratch: the menu, student orders and the items in each order. Today you plan the tables, choose data types and keys, and write the CREATE TABLE statements with all the rules from this course. (Real world: every food ordering app starts with exactly this kind of design.)',
    syllabus: [
      'From user stories to tables and relationships.',
      'Choosing types, keys and constraints.',
      'Writing and checking the schema.'
    ],
    eTitle: 'The Menu Table',
    eDesc: 'Create `menu_items` with `id` (serial, primary key), `name` (text, not null, unique), `price` (numeric(8,2), not null, must be above 0) and `is_veg` (boolean, default true).',
    eStarter: lines('CREATE TABLE menu_items (', '  id serial PRIMARY KEY,', '  name text,', '  price numeric(8,2)', ');'),
    eHint: 'name text NOT NULL UNIQUE, price numeric(8,2) NOT NULL CHECK (price > 0), is_veg boolean DEFAULT true',
    eTest: task('',
      "SELECT count(*) = 4 AS ok, 'menu_items has id, name, price and is_veg' AS msg FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name IN ('id', 'name', 'price', 'is_veg');",
      "SELECT count(*) = 1 AS ok, 'name is UNIQUE' AS msg FROM pg_constraint WHERE conrelid = 'menu_items'::regclass AND contype = 'u';",
      "SELECT count(*) = 1 AS ok, 'price has a CHECK rule' AS msg FROM pg_constraint WHERE conrelid = 'menu_items'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) ILIKE '%price%';",
      "SELECT bool_and(is_nullable = 'NO') AS ok, 'name and price are NOT NULL' AS msg FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name IN ('name', 'price');",
      "SELECT column_default = 'true' AS ok, 'is_veg defaults to true' AS msg FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_veg';"),
    aTitle: 'Orders and Order Items',
    aDesc: 'menu_items exists. Create `canteen_orders` (`id` serial primary key, `student_name` text not null, `ordered_at` timestamp default now()) and `canteen_order_items` (`order_id` referencing canteen_orders with ON DELETE CASCADE, `item_id` referencing menu_items, `quantity` int above 0, primary key (order_id, item_id)).',
    aStarter: lines('CREATE TABLE canteen_orders (', '  id serial PRIMARY KEY,', '  student_name text NOT NULL,', '  ordered_at timestamp DEFAULT now()', ');', '-- now create canteen_order_items'),
    aHint: 'CREATE TABLE canteen_order_items (order_id int REFERENCES canteen_orders(id) ON DELETE CASCADE, item_id int REFERENCES menu_items(id), quantity int CHECK (quantity > 0), PRIMARY KEY (order_id, item_id));',
    aTest: task('CREATE TABLE menu_items (id serial PRIMARY KEY, name text NOT NULL UNIQUE, price numeric(8,2) NOT NULL CHECK (price > 0), is_veg boolean DEFAULT true);',
      "SELECT count(*) = 1 AS ok, 'canteen_orders exists' AS msg FROM information_schema.tables WHERE table_name = 'canteen_orders';",
      "SELECT count(*) = 2 AS ok, 'canteen_order_items has 2 foreign keys' AS msg FROM information_schema.table_constraints WHERE table_name = 'canteen_order_items' AND constraint_type = 'FOREIGN KEY';",
      "SELECT count(*) = 1 AS ok, 'deleting an order deletes its items' AS msg FROM pg_constraint WHERE conrelid = 'canteen_order_items'::regclass AND contype = 'f' AND confdeltype = 'c';",
      "SELECT count(*) = 1 AS ok, 'the primary key is (order_id, item_id)' AS msg FROM information_schema.table_constraints WHERE table_name = 'canteen_order_items' AND constraint_type = 'PRIMARY KEY';")
  },
  {
    title: 'Project: Reports for the Canteen',
    desc: 'Now the canteen database has real orders. Today you write the reports the canteen manager needs: best-selling items, revenue per day, and each student\'s spending, using joins, groups, CTEs and window functions from earlier weeks. (Real world: the daily sales report every restaurant owner checks.)',
    syllabus: [
      'Turning a manager\'s question into a query.',
      'Best sellers, daily revenue and spending per student.',
      'Saving useful reports as views.'
    ],
    eTitle: 'Best Seller',
    eDesc: 'Canteen tables: menu_items (id, name, price, is_veg), canteen_orders (id, student_name, ordered_at) and canteen_order_items (order_id, item_id, quantity). Show the single best-selling item by total quantity, as `name` and `units`.',
    eStarter: lines('SELECT m.name, sum(ci.quantity) AS units', 'FROM canteen_order_items ci', 'JOIN menu_items m ON m.id = ci.item_id', 'GROUP BY m.name;'),
    eHint: 'Add ORDER BY units DESC LIMIT 1.',
    eTest: task(CANTEEN_TABLES,
      "SELECT count(*) = 1 AS ok, 'returns one row' AS msg FROM answer;",
      "SELECT (SELECT name FROM answer) = 'Tea' AND (SELECT units FROM answer) = 4 AS ok, 'Tea is the best seller with 4 units' AS msg;"),
    aTitle: 'Revenue per Day',
    aDesc: 'Same tables. Show each day (the date part of ordered_at) as `day` and the money taken that day (quantity times price) as `revenue`.',
    aStarter: lines('SELECT co.ordered_at AS day, sum(ci.quantity * m.price) AS revenue', 'FROM canteen_orders co', 'JOIN canteen_order_items ci ON ci.order_id = co.id', 'JOIN menu_items m ON m.id = ci.item_id', 'GROUP BY co.ordered_at;'),
    aHint: 'Use co.ordered_at::date AS day, and GROUP BY co.ordered_at::date.',
    aTest: task(CANTEEN_TABLES,
      "SELECT count(*) = 2 AS ok, 'one row for each of the 2 days' AS msg FROM answer;",
      "SELECT (SELECT revenue FROM answer WHERE day = '2026-09-28') = 305 AS ok, '28 September took 305' AS msg;",
      "SELECT (SELECT revenue FROM answer WHERE day = '2026-09-29') = 105 AS ok, '29 September took 105' AS msg;")
  },
  {
    title: 'Backups, Permissions, and SQL vs NoSQL',
    desc: 'Data is precious, so companies back it up, limit who can change it, and choose the right kind of database for each job. Today you learn pg_dump backups, copying tables, roles and GRANT, and when a NoSQL database like MongoDB or Redis makes more sense than PostgreSQL. (Real world: a deleted table restored from last night\'s backup.)',
    syllabus: [
      'Backups with pg_dump, and copying a table in SQL.',
      'Roles, GRANT and REVOKE: least privilege.',
      'SQL vs NoSQL: when to use which.'
    ],
    eTitle: 'Back Up the Products',
    eDesc: `Create a table \`products_backup\` that is a full copy of products (all columns and rows). ${SHOP_TABLES}`,
    eStarter: lines('CREATE TABLE products_backup (id int, name text);'),
    eHint: 'CREATE TABLE products_backup AS TABLE products;  (or AS SELECT * FROM products)',
    eTest: task(SHOP,
      "SELECT count(*) = 8 AS ok, 'products_backup has all 8 rows' AS msg FROM products_backup;",
      "SELECT count(*) = 5 AS ok, 'products_backup has all 5 columns' AS msg FROM information_schema.columns WHERE table_name = 'products_backup';"),
    aTitle: 'Restore After an Accident',
    aDesc: 'Someone deleted every row from products by mistake. A table products_backup has yesterday\'s copy. Put the rows back into products.',
    aStarter: lines('-- copy the rows from products_backup back into products'),
    aHint: 'INSERT INTO products SELECT * FROM products_backup;',
    aTest: task(lines(SHOP, 'CREATE TABLE products_backup AS TABLE products;', 'DELETE FROM order_items;', 'DELETE FROM products;'),
      "SELECT count(*) = 8 AS ok, 'products has its 8 rows back' AS msg FROM products;",
      "SELECT (SELECT price FROM products WHERE name = 'Headphones') = 1499 AS ok, 'the data is the same as the backup' AS msg;")
  },
  {
    title: 'SQL Interview Practice',
    desc: 'SQL questions appear in almost every backend, data and analyst interview. Today you practise the classics: second highest value, duplicates, top N per group, and explaining joins and indexes out loud, plus how to talk about your Canteen project. (Real world: "find the second highest salary" is one of the most asked interview questions.)',
    syllabus: [
      'Classic questions: second highest, duplicates, top N per group.',
      'Explaining JOIN types, indexes and transactions clearly.',
      'Talking about your project and your next steps.'
    ],
    eTitle: 'Second Highest Price',
    eDesc: `Return the second highest product price as \`second_highest\`. ${SHOP_TABLES}`,
    eStarter: lines('SELECT max(price) AS second_highest', 'FROM products;'),
    eHint: 'Find the highest price below the highest: WHERE price < (SELECT max(price) FROM products)',
    eTest: task(SHOP,
      "SELECT (SELECT second_highest FROM answer) = 1200 AS ok, 'the second highest price is 1200' AS msg;"),
    aTitle: 'Duplicate Emails',
    aDesc: 'Table: signups (id, email). Show each email that appears more than once as `email`, and how many times as `times`.',
    aStarter: lines('SELECT email, count(*) AS times', 'FROM signups', 'GROUP BY email;'),
    aHint: 'Add HAVING count(*) > 1.',
    aTest: task(lines(
      'CREATE TABLE signups (id int, email text);',
      "INSERT INTO signups VALUES (1, 'asha@x.com'), (2, 'ravi@x.com'), (3, 'asha@x.com'), (4, 'priya@x.com'), (5, 'ravi@x.com'), (6, 'asha@x.com');"),
      "SELECT count(*) = 2 AS ok, 'returns the 2 repeated emails' AS msg FROM answer;",
      "SELECT (SELECT times FROM answer WHERE email = 'asha@x.com') = 3 AS ok, 'asha@x.com appears 3 times' AS msg;")
  }
];

export const DATABASE_30_DAYS_QUESTS: CourseQuest[] = DATABASE_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('sql-mastery', idx + 1, cfg)
);
