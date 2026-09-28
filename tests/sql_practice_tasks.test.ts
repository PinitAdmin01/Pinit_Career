import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';

import { DATABASE_30_DAYS_CONFIGS } from '../src/lib/data/database30DayData';
import { runSqlPractice, splitSqlTask, SQL_TEXT_PARSERS, type SqlDatabase } from '../src/lib/code/sql/sqlCore';

/** A correct answer for every practice task: [Practice 1, Practice 2] per day. */
const SOLUTIONS: [string, string][] = [
  ['SELECT name, price FROM products;', 'SELECT * FROM customers;'],
  [
    'CREATE TABLE expenses (id serial PRIMARY KEY, item text NOT NULL, amount numeric(10,2) NOT NULL, spent_on date DEFAULT CURRENT_DATE);',
    'CREATE TABLE students (roll_no int PRIMARY KEY, name text NOT NULL, email text UNIQUE, marks int DEFAULT 0);',
  ],
  [
    "INSERT INTO products (id, name, category, price, stock) VALUES (9, 'Sticky notes', 'stationery', 45, 200);",
    "UPDATE products SET price = price * 1.10 WHERE category = 'electronics';\nDELETE FROM products WHERE name = 'Stapler';",
  ],
  ['SELECT name FROM products WHERE price < 1000 AND stock > 0;', 'SELECT name FROM customers WHERE city IS NULL;'],
  [
    "SELECT name FROM products WHERE name LIKE 'P%';",
    "SELECT id FROM orders WHERE ordered_on BETWEEN '2026-09-05' AND '2026-09-20' AND status IN ('delivered', 'shipped');",
  ],
  ['SELECT name FROM products ORDER BY price DESC LIMIT 3;', 'SELECT name FROM products ORDER BY name LIMIT 3 OFFSET 3;'],
  [
    'SELECT upper(name) AS name_caps, round(price * 1.18, 2) AS price_with_gst FROM products;',
    "SELECT id, date '2026-09-30' - ordered_on AS days_ago FROM orders;",
  ],
  [
    'SELECT count(*) AS product_count, min(price) AS lowest, max(price) AS highest FROM products;',
    'SELECT sum(stock) AS total_stock, round(avg(price), 2) AS avg_price FROM products;',
  ],
  [
    'SELECT category, count(*) AS product_count FROM products GROUP BY category;',
    'SELECT category FROM products GROUP BY category HAVING count(*) > 1;',
  ],
  [
    'CREATE TABLE reviews (id serial PRIMARY KEY, product_id int REFERENCES products(id), rating int CHECK (rating BETWEEN 1 AND 5), comment text);',
    'SELECT customer_id, count(*) AS orders FROM orders GROUP BY customer_id;',
  ],
  [
    'SELECT o.id AS order_id, c.name AS customer_name FROM orders o JOIN customers c ON c.id = o.customer_id;',
    'SELECT p.name AS product, oi.quantity FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = 1;',
  ],
  [
    'SELECT c.name, count(o.id) AS order_count FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name;',
    'SELECT p.name FROM products p LEFT JOIN order_items oi ON oi.product_id = p.id WHERE oi.product_id IS NULL;',
  ],
  [
    "SELECT p.name AS product, sum(oi.quantity) AS units FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id WHERE o.status = 'delivered' GROUP BY p.name;",
    'SELECT e.name AS employee, m.name AS manager FROM employees e JOIN employees m ON m.id = e.manager_id;',
  ],
  [
    'SELECT city FROM customers WHERE city IS NOT NULL UNION SELECT city FROM stores;',
    'SELECT city FROM customers WHERE city IS NOT NULL EXCEPT SELECT city FROM stores;',
  ],
  [
    'SELECT name FROM products WHERE price > (SELECT avg(price) FROM products);',
    "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered');",
  ],
  [
    'WITH order_totals AS (SELECT oi.order_id, sum(oi.quantity * p.price) AS total FROM order_items oi JOIN products p ON p.id = oi.product_id GROUP BY oi.order_id) SELECT order_id, total FROM order_totals WHERE total > 500;',
    'WITH RECURSIVE nums(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM nums WHERE n < 10) SELECT n FROM nums;',
  ],
  [
    'SELECT name, category, rank() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category FROM products;',
    'WITH ranked AS (SELECT category, name, row_number() OVER (PARTITION BY category ORDER BY price DESC) AS rn FROM products) SELECT category, name FROM ranked WHERE rn = 1;',
  ],
  [
    'SELECT day, amount, sum(amount) OVER (ORDER BY day) AS running_total FROM daily_sales;',
    'SELECT day, round(avg(amount) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg FROM daily_sales;',
  ],
  [
    "SELECT name, CASE WHEN price < 100 THEN 'budget' WHEN price < 1000 THEN 'mid' ELSE 'premium' END AS price_band FROM products;",
    "SELECT count(*) FILTER (WHERE status = 'delivered') AS delivered_count, count(*) FILTER (WHERE status IN ('shipped', 'pending')) AS open_count, count(*) FILTER (WHERE status = 'cancelled') AS cancelled_count FROM orders;",
  ],
  [
    'SELECT DISTINCT customer_name, customer_city FROM orders_flat;',
    'CREATE TABLE people (id serial PRIMARY KEY, name text, city text);\nINSERT INTO people (name, city) SELECT DISTINCT customer_name, customer_city FROM orders_flat;',
  ],
  [
    'ALTER TABLE accounts ADD CONSTRAINT email_unique UNIQUE (email);\nALTER TABLE accounts ADD CONSTRAINT balance_not_negative CHECK (balance >= 0);',
    'CREATE TABLE books (id serial PRIMARY KEY, title text, author_id int REFERENCES authors(id) ON DELETE CASCADE);',
  ],
  [
    'BEGIN;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;',
    "BEGIN;\nUPDATE stock SET units = units - 5 WHERE product = 'Pen';\nINSERT INTO sales VALUES ('Pen', 5);\nCOMMIT;",
  ],
  ['CREATE INDEX idx_orders_customer ON orders (customer_id);', 'CREATE UNIQUE INDEX idx_users_email ON users (lower(email));'],
  [
    'CREATE VIEW product_summary AS SELECT name, round(price * 1.18, 2) AS price_with_gst FROM products;',
    'CREATE VIEW customer_order_counts AS SELECT c.name, count(o.id) AS order_count FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.name;',
  ],
  [
    "SELECT data->>'page' AS page FROM events WHERE data->>'type' = 'click';",
    "SELECT data->>'type' AS type, count(*) AS events FROM events GROUP BY data->>'type';",
  ],
  [
    'PREPARE find_customer(text) AS SELECT * FROM customers WHERE name = $1;',
    "PREPARE search_customers(text) AS SELECT name FROM customers WHERE name ILIKE '%' || $1 || '%';",
  ],
  [
    'CREATE TABLE menu_items (id serial PRIMARY KEY, name text NOT NULL UNIQUE, price numeric(8,2) NOT NULL CHECK (price > 0), is_veg boolean DEFAULT true);',
    'CREATE TABLE canteen_orders (id serial PRIMARY KEY, student_name text NOT NULL, ordered_at timestamp DEFAULT now());\nCREATE TABLE canteen_order_items (order_id int REFERENCES canteen_orders(id) ON DELETE CASCADE, item_id int REFERENCES menu_items(id), quantity int CHECK (quantity > 0), PRIMARY KEY (order_id, item_id));',
  ],
  [
    'SELECT m.name, sum(ci.quantity) AS units FROM canteen_order_items ci JOIN menu_items m ON m.id = ci.item_id GROUP BY m.name ORDER BY units DESC LIMIT 1;',
    'SELECT co.ordered_at::date AS day, sum(ci.quantity * m.price) AS revenue FROM canteen_orders co JOIN canteen_order_items ci ON ci.order_id = co.id JOIN menu_items m ON m.id = ci.item_id GROUP BY co.ordered_at::date;',
  ],
  ['CREATE TABLE products_backup AS TABLE products;', 'INSERT INTO products SELECT * FROM products_backup;'],
  [
    'SELECT max(price) AS second_highest FROM products WHERE price < (SELECT max(price) FROM products);',
    'SELECT email, count(*) AS times FROM signups GROUP BY email HAVING count(*) > 1;',
  ],
];

let db: SqlDatabase;
test.before(async () => {
  db = (await PGlite.create({ parsers: SQL_TEXT_PARSERS })) as unknown as SqlDatabase;
});

test('the SQL course has 30 days and a solution for every practice task', () => {
  assert.equal(DATABASE_30_DAYS_CONFIGS.length, 30);
  assert.equal(SOLUTIONS.length, 30);
});

test('every SQL practice task: the right answer passes and the starter code fails', async () => {
  for (const [i, cfg] of DATABASE_30_DAYS_CONFIGS.entries()) {
    const tasks = [
      { name: 'Practice 1', starter: cfg.eStarter, suite: cfg.eTest, solution: SOLUTIONS[i][0] },
      { name: 'Practice 2', starter: cfg.aStarter, suite: cfg.aTest, solution: SOLUTIONS[i][1] },
    ];
    for (const t of tasks) {
      const label = `Day ${i + 1} ${t.name} (${cfg.title})`;
      const parts = splitSqlTask(t.suite);
      assert.ok(parts && t.starter, `${label}: missing starter, setup or checks`);
      const good = await runSqlPractice(db, parts.setup, t.solution, parts.checks);
      assert.ok(good.passed, `${label}: the right answer fails:\n${good.messages.join('\n')}\n${good.output}`);
      const bad = await runSqlPractice(db, parts.setup, t.starter!, parts.checks);
      assert.ok(!bad.passed, `${label}: the unfinished starter already passes`);
    }
  }
});
