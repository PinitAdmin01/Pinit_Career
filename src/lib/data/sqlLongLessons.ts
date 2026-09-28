import type { LongLesson } from './longLessons';

/**
 * Long-format lessons for the 1-Month SQL course (quest prefix `sql-mastery`), taught on PostgreSQL.
 * Days follow DATABASE_30_DAYS_CONFIGS in database30DayData.ts. Written for beginners, in plain words.
 * A class is about 20-30 minutes: at least 14 minutes of teaching plus running examples, "your turn"
 * changes and check questions (see estimateLessonMinutes).
 * Every `code` sample runs on PostgreSQL in the browser (PGlite), starting from an empty database, and
 * shows exactly its `output` (checked by tests/sql_long_lessons.test.ts).
 */
const lines = (...l: string[]) => l.join('\n');

/** A small shop used by the join lessons (Days 11-15). Each example starts with it, so it runs on its own. */
const MINI_SHOP = lines(
  'CREATE TABLE customers (id int PRIMARY KEY, name text, city text);',
  "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai'), (3, 'Priya', 'Pune'), (4, 'Meera', NULL);",
  'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), ordered_on date, status text);',
  "INSERT INTO orders VALUES (101, 1, '2026-09-01', 'delivered'), (102, 2, '2026-09-03', 'delivered'), (103, 1, '2026-09-10', 'shipped'), (104, 3, '2026-09-12', 'pending');",
  'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
  "INSERT INTO products VALUES (1, 'Notebook', 60), (2, 'Pen', 10), (3, 'Backpack', 1200), (4, 'Stapler', 150);",
  'CREATE TABLE order_items (order_id int REFERENCES orders(id), product_id int REFERENCES products(id), quantity int, PRIMARY KEY (order_id, product_id));',
  'INSERT INTO order_items VALUES (101, 1, 3), (101, 2, 10), (102, 3, 1), (103, 2, 5), (104, 1, 1);'
);

export const SQL_LONG_LESSONS: LongLesson[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 1,
    title: 'What a Database Is: Tables, Rows and Your First SELECT',
    goal: 'You can explain what a database, a table, a row, a column and a primary key are, and read data with SELECT.',
    minutes: 28,
    parts: [
      {
        title: 'What a database is, and why apps need one',
        say: [
          'Welcome to the SQL course. Every app you use keeps information somewhere: your orders on a shopping app, your messages, your bank balance, the marks on a college portal. That information has to be stored safely, found quickly, and shared by thousands of people at the same time. The program that does this job is called a database.',
          'You might think: why not just use a spreadsheet, like Excel? Spreadsheets are great for one person. But imagine ten thousand people placing orders at the same second. A spreadsheet would get confused, overwrite changes, or become very slow. A database is built for exactly that: many users, lots of data, strict rules, and fast searching.',
          'The most common kind of database is a relational database. It stores information in tables, and the tables can be linked to each other. PostgreSQL, which you will use in this course, is one of the most popular relational databases in the world. Companies like Swiggy, Zomato and many banks and startups use PostgreSQL or databases very similar to it.',
          'To talk to a relational database, you use a language called SQL. People say it as "S-Q-L" or "sequel"; both are fine. SQL stands for Structured Query Language. A query is just a question you ask the database, like "show me all orders from today". SQL reads almost like English, which makes it one of the friendliest languages to start with.',
          'SQL is also one of the most useful skills in the job market. Backend developers, data analysts, testers and even product managers use it every week. By the end of this month, you will design your own database for a college canteen and write the reports a real manager would ask for.'
        ],
        example: 'Think of a college library. Books are not thrown into one big pile. They are arranged on shelves, each book has a number, and there is a register that says who borrowed which book. Because everything is organised, the librarian can answer "who has book 42?" in seconds. A database is that well-organised library for an app\'s information.',
        code: lines(
          'CREATE TABLE students (roll_no int, name text, city text);',
          "INSERT INTO students VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai');",
          'SELECT * FROM students;'
        ),
        output: lines(' roll_no | name | city', '---------+------+--------', '       1 | Asha | Pune', '       2 | Ravi | Mumbai', '(2 rows)'),
        codeNotes: [
          { line: 1, note: 'Create a table called students with three columns. You will learn this properly tomorrow.' },
          { line: 2, note: 'Add two rows of data.' },
          { line: 3, note: 'Ask the database to show every row. This is today\'s main topic.' }
        ],
        tryIt: "Add a third student to the INSERT line, for example (3, 'Priya', 'Pune'), and run it again. The result now shows 3 rows.",
        check: {
          question: 'What is SQL?',
          options: ['A language for asking a database questions and changing its data', 'A type of spreadsheet', 'A programming language only for websites'],
          answer: 0,
          why: 'SQL is the language used to talk to relational databases: to read, add, change and delete data.'
        }
      },
      {
        title: 'Tables, rows and columns',
        say: [
          'A table looks like a grid, just like a sheet in Excel. Each table holds one kind of thing: a students table holds students, a products table holds products, an orders table holds orders. Giving each kind of thing its own table keeps the data tidy.',
          'Each column is one piece of information that every row has. In a students table, the columns might be roll number, name and city. Each column has a name and a type. The type says what kind of value it holds: a whole number, some text, a date, and so on. The database will not let you put text into a number column, which prevents many mistakes.',
          'Each row is one item: one student, one product, one order. When a new student joins, you add a row. When a student changes city, you change their row. When a student leaves, you might delete their row.',
          'The number of columns in a table is fixed when you design it, but the number of rows grows and shrinks as the app is used. A real table might have 5 columns and 50 million rows. The database is built to search those millions of rows quickly.',
          'You will hear a few other words for the same things. Some people call a table a relation, a row a record, and a column a field or attribute. They mean the same things, so do not be confused if you see them in articles or interview questions.'
        ],
        example: 'An attendance register is a table. Each line is a row: one student. The printed headings at the top, like Roll No, Name and Signature, are the columns. Every line fills in the same headings, but with different values.',
        code: lines(
          'CREATE TABLE products (id int, name text, price numeric(8,2), in_stock boolean);',
          "INSERT INTO products VALUES (1, 'Notebook', 60, true), (2, 'Pen', 10, true), (3, 'Desk lamp', 899, false);",
          'SELECT * FROM products;'
        ),
        output: lines(
          ' id | name      | price  | in_stock',
          '----+-----------+--------+----------',
          '  1 | Notebook  |  60.00 | true',
          '  2 | Pen       |  10.00 | true',
          '  3 | Desk lamp | 899.00 | false',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'Four columns, each with a type: a whole number, text, money with 2 decimals, and true/false.' },
          { line: 3, note: 'Numbers are lined up on the right, like in a bank statement. Text is on the left.' }
        ],
        tryIt: "Add a fourth product (4, 'Water bottle', 350, true) to the INSERT line and run it. Count the rows and the columns in the result.",
        check: {
          question: 'In a products table, what is one row?',
          options: ['One product with all its details', 'One detail, like price, for all products', 'The whole table'],
          answer: 0,
          why: 'A row is one item. A column is one detail that every item has, like price.'
        }
      },
      {
        title: 'Primary keys: one unique id for every row',
        say: [
          'Two students can have the same name. Two products can have the same price. So how does the database know exactly which row you mean? Every well-designed table has a primary key: a column whose value is different for every row. Usually it is an id number.',
          'A primary key has two rules. It must be unique, so no two rows share the same id. And it can never be empty. PostgreSQL checks both rules every time a row is added or changed. If you try to break them, it refuses and shows an error.',
          'You mark a primary key when you create the table, with the words PRIMARY KEY after the column. From then on, the database protects it for you. This is much safer than hoping every programmer and every app remembers the rule.',
          'Other tables use the primary key to point to a row. An order, for example, stores the id of the customer who placed it, not their name. Names can change or repeat; ids do not. You will see this idea, called a foreign key, on Day 10.',
          'In the example below, we try to add a second student with roll number 1. Read the error carefully. PostgreSQL tells you exactly which rule was broken, and the name of the rule, students_pkey, which means "the primary key of students".'
        ],
        example: 'Your Aadhaar number is a primary key for people in India. Thousands of people are called Rahul Sharma, but each has a different Aadhaar number, and nobody has an empty one. When an office needs to be sure they have the right person, they use the number, not the name.',
        code: lines(
          'CREATE TABLE students (roll_no int PRIMARY KEY, name text);',
          "INSERT INTO students VALUES (1, 'Asha');",
          "INSERT INTO students VALUES (1, 'Rahul');",
          'SELECT * FROM students;'
        ),
        output: '[Error] duplicate key value violates unique constraint "students_pkey"',
        codeNotes: [
          { line: 1, note: 'roll_no is the primary key: unique and never empty.' },
          { line: 3, note: 'A second row with roll_no 1 breaks the rule, so PostgreSQL refuses.' }
        ],
        tryIt: 'Change the 1 on line 3 to 2 and run it again. Now both students are added and the SELECT shows them.',
        check: {
          question: 'Which column makes the best primary key for a students table?',
          options: ['roll_no, a number that is different for every student', 'name', 'city'],
          answer: 0,
          why: 'A primary key must be unique and never empty. Names and cities can repeat, but each roll number belongs to one student.'
        }
      },
      {
        title: 'SELECT and FROM: reading data',
        say: [
          'Now the most important command in SQL: SELECT. It reads data. The simplest form is SELECT, then the columns you want, then FROM and the table name. For example: SELECT name, price FROM products. Read it as "show the name and price from products".',
          'The star, as in SELECT *, means "every column". It is handy for a quick look at a table, but in real apps you usually list the columns you need. That makes the query clearer, faster, and safer if someone adds new columns to the table later.',
          'The columns come back in the order you list them, not the order in the table. So SELECT price, name shows the price first. You can also give a column a new name in the result with AS, like SELECT name AS product. This is called an alias, and it is very useful for making results easy to read.',
          'SELECT never changes the data. It only reads it. So you can experiment with SELECT as much as you like without any risk. That makes it the perfect place to start.',
          'You can also SELECT a calculation, like price * 2, or even a value without any table, like SELECT 5 + 5. The database works it out for each row and shows the answer.'
        ],
        example: 'SELECT is like asking a shopkeeper to read out certain details from their stock book: "just tell me the item names and prices". The book stays exactly as it was; you only asked to hear part of it.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(8,2), stock int);',
          "INSERT INTO products VALUES (1, 'Notebook', 60, 120), (2, 'Pen', 10, 500), (3, 'Backpack', 1200, 15);",
          'SELECT name, price FROM products;',
          'SELECT name AS product, price * 2 AS price_for_two FROM products;'
        ),
        output: lines(
          ' name     | price',
          '----------+---------',
          ' Notebook |   60.00',
          ' Pen      |   10.00',
          ' Backpack | 1200.00',
          '(3 rows)',
          '',
          ' product  | price_for_two',
          '----------+---------------',
          ' Notebook |        120.00',
          ' Pen      |         20.00',
          ' Backpack |       2400.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Only the two columns we asked for, in that order.' },
          { line: 4, note: 'AS renames a column in the result. price * 2 is worked out for every row.' }
        ],
        tryIt: 'Add a third query: SELECT name, stock FROM products; and run it. Then try SELECT stock, name and notice the column order changes.',
        check: {
          question: 'What does SELECT name, price FROM products do?',
          options: ['Shows the name and price of every product', 'Changes the name and price of products', 'Deletes the other columns'],
          answer: 0,
          why: 'SELECT only reads. It shows the listed columns for every row and never changes the table.'
        }
      },
      {
        title: 'The rules of writing SQL',
        say: [
          'SQL has a few simple writing rules. First, keywords like SELECT and FROM can be written in capitals or small letters; PostgreSQL does not mind. Many people write keywords in capitals so they stand out from table and column names. This course does the same.',
          'Second, text values go inside single quotes, like \'Pune\'. Double quotes mean something different in PostgreSQL: they are for unusual table or column names. So always use single quotes for text. Numbers do not need quotes.',
          'Third, a statement ends with a semicolon. When you run several statements together, the semicolons tell PostgreSQL where one ends and the next begins. Forgetting one is a very common beginner mistake.',
          'Fourth, you can write a query over several lines and add spaces freely. PostgreSQL ignores extra spaces and line breaks. Putting each part of a query on its own line makes long queries much easier to read.',
          'Finally, two dashes start a comment: -- like this. PostgreSQL ignores everything after the dashes on that line. Use comments to explain why a query does something, just like comments in any other language.'
        ],
        example: 'Writing SQL is like filling in a bank form with its own rules: dates in a certain format, names in capital letters, signature in the box. Once you know the few rules, filling it in becomes automatic.',
        code: lines(
          '-- Text in single quotes, numbers without quotes',
          "select 'Hello from PostgreSQL' AS greeting, 5 + 5 AS answer;",
          '',
          'SELECT',
          "  'Pune' AS city,",
          '  2026 AS year;'
        ),
        output: lines(
          ' greeting              | answer',
          '-----------------------+--------',
          ' Hello from PostgreSQL |     10',
          '(1 row)',
          '',
          ' city | year',
          '------+------',
          ' Pune | 2026',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'A comment: PostgreSQL skips it.' },
          { line: 2, note: 'Small-letter select works too. Each value gets a name with AS.' },
          { line: 4, note: 'One query spread over three lines. The semicolon on the last line ends it.' }
        ],
        tryIt: "Change the text on line 2 to use double quotes instead of single quotes and run it. Read the error: PostgreSQL thinks \"Hello...\" is a column name. Change it back.",
        check: {
          question: 'How do you write the text Pune in a SQL query?',
          options: ["'Pune' (single quotes)", '"Pune" (double quotes)', 'Pune (no quotes)'],
          answer: 0,
          why: 'Text values use single quotes. Double quotes are for names of tables or columns, and without quotes PostgreSQL looks for a column called Pune.'
        }
      },
      {
        title: 'Putting it together: a first look at the shop',
        say: [
          'For most of this course, you will practise on a small shop database. It has customers, products, orders, and the items in each order. Today you only need the products and customers tables, but it helps to know the whole picture from the start.',
          'The example below creates a small version of those two tables and asks a few everyday questions: what is in the catalogue, and who are the customers. Every query today is a SELECT, so nothing is changed.',
          'Notice how clear the results are when you choose good column names with AS. A result called product and price is easy to read; a result with long technical names is not. Clear names matter when other people use your reports.',
          'Tomorrow you will learn to create tables yourself, with the right types and rules, instead of relying on tables that already exist. After that, you will add, change and delete rows.',
          'In today\'s practice, you will write two SELECT queries on the shop database: one that shows the name and price of every product, and one that shows every column of the customers table.'
        ],
        example: 'On your first day at a new job, before changing anything, you look around: what is on the shelves, who the regular customers are. Reading data with SELECT is looking around the shop on day one.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text, city text);',
          "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai'), (3, 'Meera', NULL);",
          'CREATE TABLE products (id int PRIMARY KEY, name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Notebook', 'stationery', 60), (2, 'Headphones', 'electronics', 1499);",
          'SELECT name AS product, category, price FROM products;',
          'SELECT name, city FROM customers;'
        ),
        output: lines(
          ' product    | category    | price',
          '------------+-------------+---------',
          ' Notebook   | stationery  |   60.00',
          ' Headphones | electronics | 1499.00',
          '(2 rows)',
          '',
          ' name  | city',
          '-------+--------',
          ' Asha  | Pune',
          ' Ravi  | Mumbai',
          ' Meera | NULL',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'Meera\'s city is NULL: unknown. You will learn how to handle NULL on Day 4.' },
          { line: 5, note: 'A clear column name, product, instead of name.' }
        ],
        tryIt: 'Add a query that shows only the names of all products. Then add one that shows each product name next to its price with 18% GST: price * 1.18 AS with_gst.',
        check: {
          question: 'In the result, what does NULL in Meera\'s city mean?',
          options: ['The city is unknown (no value)', 'She lives in a city called NULL', 'The row has an error'],
          answer: 0,
          why: 'NULL means "no value" or "unknown". It is not text, and it is not zero.'
        }
      }
    ],
    summary: [
      'A database stores an app\'s information safely and lets many people use it at once.',
      'Data lives in tables: each row is one item, each column is one detail with a type.',
      'A primary key is a column that is unique and never empty, usually an id.',
      'SELECT columns FROM table reads data; * means every column; AS renames a column.',
      'Text uses single quotes, statements end with a semicolon, and -- starts a comment.'
    ],
    projectStep: {
      title: 'My Library: plan your first table',
      steps: [
        'This month you keep a small database of your own books, called My Library, next to the lessons.',
        'On paper, list 4 details every book in your library should have, for example id, title, author and pages.',
        'Decide which of them is the primary key, and why.',
        'In the lesson editor, write a SELECT that shows 2 made-up book titles using AS, like SELECT \'Wings of Fire\' AS title;'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 2,
    title: 'Creating Tables: Data Types and Keys',
    goal: 'You can create a table with suitable data types, NOT NULL, DEFAULT and a primary key, and remove a table.',
    minutes: 28,
    recap: 'Yesterday you learned what tables, rows, columns and primary keys are, and read data with SELECT.',
    parts: [
      {
        title: 'CREATE TABLE: designing the shape of your data',
        say: [
          'Yesterday you read from tables that already existed. Today you create your own. The command is CREATE TABLE, followed by the table name and, in brackets, one line per column: the column name and its type, separated by commas.',
          'Creating a table is a design decision. You are deciding what information the app will keep, and in what form, before any data arrives. Getting it right early saves a lot of pain later, because changing a table that already holds millions of rows is slow and risky.',
          'Table and column names are usually written in small letters with underscores between words, like order_items or joined_on. This style is called snake_case, the same as Python. It avoids problems with capital letters and spaces, which PostgreSQL treats specially.',
          'Use clear names that describe what is stored. A column called price is better than p, and a table called customers is better than data1. Your future teammates, and your future self, will thank you.',
          'After you create a table, it is empty. It has columns but no rows. You add rows with INSERT, which you will learn properly tomorrow. In today\'s examples, we add a few rows just to see the table in action.'
        ],
        example: 'Creating a table is like printing a blank form before anyone fills it in. You decide the boxes: name, date of birth, phone number. The printed form has no answers yet, but every copy that gets filled in will have exactly those boxes.',
        code: lines(
          'CREATE TABLE books (',
          '  id int,',
          '  title text,',
          '  author text,',
          '  pages int',
          ');',
          "INSERT INTO books VALUES (1, 'Wings of Fire', 'A. P. J. Abdul Kalam', 180);",
          'SELECT * FROM books;'
        ),
        output: lines(
          ' id | title         | author               | pages',
          '----+---------------+----------------------+-------',
          '  1 | Wings of Fire | A. P. J. Abdul Kalam |   180',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'The table name, then the column list in brackets.' },
          { line: 2, note: 'One column per line: a name, then a type, then a comma.' },
          { line: 5, note: 'The last column has no comma after it.' }
        ],
        tryIt: 'Add a fifth column, published int, to the table (remember the comma on the line before), and add a year like 1999 to the INSERT.',
        check: {
          question: 'What does a new table contain right after CREATE TABLE?',
          options: ['Its columns, but no rows yet', 'One empty row', 'Sample data'],
          answer: 0,
          why: 'CREATE TABLE only defines the columns. Rows are added afterwards with INSERT.'
        }
      },
      {
        title: 'Choosing data types',
        say: [
          'Every column has a data type. The type tells PostgreSQL what values are allowed, how much space to use, and how to sort and compare them. Choosing the right type is one of the most important parts of table design.',
          'For text, use text. It can hold any length, from one letter to a whole essay. For whole numbers, like a quantity or an age, use int. For money, use numeric with a precision, for example numeric(10,2): up to 10 digits in total, 2 of them after the decimal point. Never store money in the types called real or float: they store decimals only approximately, so small rounding errors creep into totals.',
          'For dates, use date, which stores a day like 2026-09-28. For a date and a time together, use timestamp. For yes-or-no values, use boolean, which is true or false.',
          'The right type protects your data. If price is numeric, nobody can store the word "cheap" in it by mistake, and you can add prices, sort them and find the average. If you stored prices as text, sorting would put 1000 before 200, because text is sorted letter by letter.',
          'When you are unsure, ask what you will do with the value. Do maths with it? A number type. Compare it with other dates? date. Just show it? text is usually fine.'
        ],
        example: 'Choosing a type is like choosing the right container in a kitchen: rice goes in a jar, milk in a bottle, eggs in a tray. Put milk in a tray and you have a mess. Put prices in a text column and you get a different kind of mess.',
        code: lines(
          'CREATE TABLE expenses (',
          '  item text,',
          '  amount numeric(10,2),',
          '  spent_on date,',
          '  is_paid boolean',
          ');',
          "INSERT INTO expenses VALUES ('Tea', 20, '2026-09-28', true), ('Rent', 8000.5, '2026-09-01', false);",
          'SELECT * FROM expenses;',
          "SELECT '1000' < '200' AS text_compare, 1000 < 200 AS number_compare;"
        ),
        output: lines(
          ' item | amount  | spent_on   | is_paid',
          '------+---------+------------+---------',
          ' Tea  |   20.00 | 2026-09-28 | true',
          ' Rent | 8000.50 | 2026-09-01 | false',
          '(2 rows)',
          '',
          ' text_compare | number_compare',
          '--------------+----------------',
          ' true         | false',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'numeric(10,2) keeps money exact, always with 2 decimal places.' },
          { line: 4, note: 'A date written as year-month-day text is turned into a real date.' },
          { line: 9, note: 'As text, "1000" comes before "200" (1 before 2). As numbers, 1000 is bigger. Types matter.' }
        ],
        tryIt: "Try inserting the text 'cheap' as an amount by adding ('Snack', 'cheap', '2026-09-28', true) to the INSERT. Read the error. Then remove it.",
        check: {
          question: 'Which type should a price column have?',
          options: ['numeric(10,2)', 'text', 'boolean'],
          answer: 0,
          why: 'numeric stores exact decimals, so money adds up correctly and can be sorted and averaged.'
        }
      },
      {
        title: 'NOT NULL and DEFAULT',
        say: [
          'By default, any column can be left empty, which stores NULL. For some columns that is fine: a customer might not tell you their city. For others it is a mistake: an order without a date, or a product without a name, makes no sense.',
          'NOT NULL after a column\'s type makes that column required. If anyone tries to add a row without it, PostgreSQL refuses with an error. This rule protects the data even if an app has a bug.',
          'DEFAULT gives a column a value automatically when none is given. For example, spent_on date DEFAULT CURRENT_DATE fills in today\'s date, and is_paid boolean DEFAULT false starts every expense as unpaid. Defaults save typing and keep data consistent.',
          'To use a default, you list only the columns you are giving in the INSERT. Any column you leave out gets its default, or NULL if it has none.',
          'You can combine rules on one column, like amount numeric(10,2) NOT NULL. The order of the words after the type does not matter, but the type always comes right after the column name.'
        ],
        example: 'A hotel check-in form has some boxes marked with a red star: name and phone are required. Other boxes are optional. And the check-in date is filled in automatically by the receptionist with today\'s date. NOT NULL is the red star; DEFAULT is the receptionist\'s automatic stamp.',
        code: lines(
          'CREATE TABLE tasks (',
          '  title text NOT NULL,',
          '  done boolean DEFAULT false,',
          "  priority text DEFAULT 'normal'",
          ');',
          "INSERT INTO tasks (title) VALUES ('Finish SQL lesson');",
          "INSERT INTO tasks (title, priority) VALUES ('Pay phone bill', 'high');",
          'SELECT * FROM tasks;',
          'INSERT INTO tasks (done) VALUES (true);'
        ),
        output: lines(
          ' title             | done  | priority',
          '-------------------+-------+----------',
          ' Finish SQL lesson | false | normal',
          ' Pay phone bill    | false | high',
          '(2 rows)',
          '',
          '[Error] null value in column "title" of relation "tasks" violates not-null constraint'
        ),
        codeNotes: [
          { line: 2, note: 'title is required.' },
          { line: 6, note: 'Only title is given, so done becomes false and priority becomes normal.' },
          { line: 9, note: 'No title: PostgreSQL refuses this row, and the run stops here with the error.' }
        ],
        tryIt: "Fix line 9 so the new task has a title: INSERT INTO tasks (title, done) VALUES ('Water plants', true); and add SELECT * FROM tasks; after it. Now you see three tasks.",
        check: {
          question: 'What does DEFAULT false do on a done column?',
          options: ['Fills in false when a new row does not give a value', 'Makes done always false', 'Stops anyone setting done'],
          answer: 0,
          why: 'A default is used only when no value is given. You can still insert or change the value yourself.'
        }
      },
      {
        title: 'Primary keys and serial ids',
        say: [
          'Yesterday you saw that every table should have a primary key. When you create a table, you mark it with PRIMARY KEY. That single phrase means "unique and never NULL", and PostgreSQL enforces both.',
          'Typing a new id for every row is annoying and error-prone: two people might pick the same number at the same moment. So PostgreSQL can create ids for you. The type serial makes a whole number column that counts up automatically: 1, 2, 3 and so on.',
          'With id serial PRIMARY KEY, you simply leave the id out of your INSERT, and PostgreSQL fills in the next number. This is the most common way to create ids in PostgreSQL tables.',
          'You may also see GENERATED ALWAYS AS IDENTITY in newer code. It does the same job as serial. Either is fine for this course; you only need to recognise them.',
          'Ids are never reused. If you delete row 3, the next new row still gets 4, not 3. That is on purpose: an old id might still be mentioned somewhere, like on an old invoice, and reusing it would cause confusion.'
        ],
        example: 'A token machine at a bank counter gives out numbers 1, 2, 3 in order. You never choose your own number, two people never get the same one, and a number is never handed out twice, even if someone leaves the queue. serial is that token machine.',
        code: lines(
          'CREATE TABLE customers (',
          '  id serial PRIMARY KEY,',
          '  name text NOT NULL,',
          '  city text',
          ');',
          "INSERT INTO customers (name, city) VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai');",
          "INSERT INTO customers (name) VALUES ('Meera');",
          'SELECT * FROM customers;'
        ),
        output: lines(
          ' id | name  | city',
          '----+-------+--------',
          '  1 | Asha  | Pune',
          '  2 | Ravi  | Mumbai',
          '  3 | Meera | NULL',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'serial counts up by itself; PRIMARY KEY makes it unique and required.' },
          { line: 6, note: 'No id in the INSERT: PostgreSQL gives 1 and 2.' },
          { line: 7, note: 'Meera gets id 3, and no city, so NULL.' }
        ],
        tryIt: "Add another INSERT for ('Karan', 'Delhi') and run it. Karan gets id 4 without you typing it.",
        check: {
          question: 'What does id serial PRIMARY KEY give you?',
          options: ['An id that PostgreSQL fills in automatically, unique for every row', 'An id you must type yourself', 'A text id'],
          answer: 0,
          why: 'serial counts up automatically, and PRIMARY KEY guarantees each id is unique and present.'
        }
      },
      {
        title: 'UNIQUE, and removing tables with DROP TABLE',
        say: [
          'Sometimes a column that is not the primary key must still be unique. An email address, a phone number or a username should belong to only one account. Add UNIQUE after the column\'s type, and PostgreSQL will refuse a second row with the same value.',
          'UNIQUE allows NULL, though. Two customers can both have no email. That is usually what you want: an unknown email is not a duplicate email. If the column is also required, write both: email text NOT NULL UNIQUE.',
          'To remove a whole table, with all its rows, use DROP TABLE and the table\'s name. Be very careful with this in real life: there is no undo button, and the data is gone. In a company, dropping a table in the live database could be a serious incident.',
          'DROP TABLE IF EXISTS does the same, but without an error if the table does not exist. You will often see it at the top of setup scripts, so they can be run again safely.',
          'In the lesson editor, every run starts with an empty database anyway, so feel free to experiment. On your laptop and at work, always double-check the table name before you press Enter on a DROP.'
        ],
        example: 'A college gives every student an email address. Two students can have the same name, but never the same college email. That email column is UNIQUE. And throwing away the whole admission register at the end of the year, with no copy, would be DROP TABLE: fast, and impossible to undo.',
        code: lines(
          'CREATE TABLE users (',
          '  id serial PRIMARY KEY,',
          '  email text NOT NULL UNIQUE',
          ');',
          "INSERT INTO users (email) VALUES ('asha@example.com');",
          'SELECT count(*) AS users_before FROM users;',
          'DROP TABLE users;',
          'DROP TABLE IF EXISTS users;',
          "SELECT 'the users table is gone' AS note;"
        ),
        output: lines(
          ' users_before',
          '--------------',
          '            1',
          '(1 row)',
          '',
          ' note',
          '-------------------------',
          ' the users table is gone',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Required and unique: every user has one email, and no two users share it.' },
          { line: 7, note: 'The whole table and its rows are removed.' },
          { line: 8, note: 'IF EXISTS: no error, even though the table is already gone.' }
        ],
        tryIt: "Before the SELECT on line 6, add a second INSERT with the same email, 'asha@example.com', and run it. Read the error about the unique rule. Then remove that line.",
        check: {
          question: 'Why add UNIQUE to an email column?',
          options: ['So two accounts can never share the same email', 'To make email required', 'To sort emails'],
          answer: 0,
          why: 'UNIQUE stops duplicates. To make the column required as well, add NOT NULL.'
        }
      },
      {
        title: 'Putting it together: the expenses table',
        say: [
          'Let us design a complete table using everything from today: an expenses table for tracking spending. Think about each column before writing it.',
          'The id should be created automatically, so id serial PRIMARY KEY. The item must always be there, so text NOT NULL. The amount is money and must be there, so numeric(10,2) NOT NULL. The date should default to today, so date DEFAULT CURRENT_DATE. And a category is optional text.',
          'After creating the table, we insert two expenses, one with a date and one without, and read them back. The first has the date we gave. The second gets the date of the day you run it, because of the default. Because that date changes every day, the example prints only whether it matches today, rather than the date itself.',
          'This is exactly the table in today\'s first practice task. The second task asks you to design a students table with a unique email and a default for marks.',
          'Tomorrow you learn to add, change and delete rows properly, including how to change many rows at once, and how to avoid the most dangerous mistake in SQL.'
        ],
        example: 'Designing a table well is like setting up a new notebook for your monthly budget: you rule the columns, write the headings, and decide which ones must always be filled. After that, every entry is quick and tidy.',
        code: lines(
          'CREATE TABLE expenses (',
          '  id serial PRIMARY KEY,',
          '  item text NOT NULL,',
          '  amount numeric(10,2) NOT NULL,',
          '  spent_on date DEFAULT CURRENT_DATE,',
          '  category text',
          ');',
          "INSERT INTO expenses (item, amount, spent_on, category) VALUES ('Rent', 8000, '2026-09-01', 'home');",
          "INSERT INTO expenses (item, amount) VALUES ('Tea', 20);",
          'SELECT id, item, amount, category, spent_on = CURRENT_DATE AS spent_today FROM expenses;'
        ),
        output: lines(
          ' id | item | amount  | category | spent_today',
          '----+------+---------+----------+-------------',
          '  1 | Rent | 8000.00 | home     | false',
          '  2 | Tea  |   20.00 | NULL     | true',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'If no date is given, today\'s date is used.' },
          { line: 9, note: 'Only item and amount: id, date and category are filled in automatically or left NULL.' },
          { line: 10, note: 'Compare the date with today, so the output is the same whichever day you run it.' }
        ],
        tryIt: 'Add spent_on to the list of columns in the last SELECT, and run it. You will see the real dates, including today\'s.',
        check: {
          question: 'Which column definition fits "the amount must always be given, and is money"?',
          options: ['amount numeric(10,2) NOT NULL', 'amount text', 'amount int DEFAULT 0'],
          answer: 0,
          why: 'numeric(10,2) stores exact money, and NOT NULL makes it required.'
        }
      }
    ],
    summary: [
      'CREATE TABLE name (column type, ...) defines a table\'s columns; it starts empty.',
      'Main types: text, int, numeric(10,2) for money, date, timestamp, boolean.',
      'NOT NULL makes a column required; DEFAULT fills in a value when none is given.',
      'id serial PRIMARY KEY creates automatic, unique ids.',
      'UNIQUE stops duplicates; DROP TABLE removes a table and its data for good.'
    ],
    projectStep: {
      title: 'My Library: create the books table',
      steps: [
        'Write CREATE TABLE books with id serial PRIMARY KEY, title text NOT NULL, author text and pages int.',
        'Add an isbn text UNIQUE column and a finished boolean DEFAULT false column.',
        'Insert 2 of your favourite books, leaving out id and finished.',
        'SELECT * FROM books and check the defaults were filled in.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 3,
    title: 'Adding, Changing and Deleting Rows',
    goal: 'You can add rows with INSERT, change them with UPDATE, remove them with DELETE, and always use WHERE safely.',
    minutes: 28,
    recap: 'Yesterday you created tables with data types, NOT NULL, DEFAULT, serial primary keys and UNIQUE.',
    parts: [
      {
        title: 'INSERT: adding rows',
        say: [
          'INSERT INTO adds new rows to a table. The clearest way to write it is to list the columns you are filling, then the values in the same order: INSERT INTO products (name, price) VALUES (\'Pen\', 10).',
          'Always listing the columns is a good habit. It makes the statement easy to read, it lets defaults fill in the columns you leave out, and it keeps working if someone adds a new column to the table later. Writing VALUES without a column list only works if you give every column in the exact table order.',
          'You can add many rows in one INSERT by separating them with commas: VALUES (\'Pen\', 10), (\'Notebook\', 60). This is faster than many separate INSERTs, and it is how data is usually loaded in bulk.',
          'Text values need single quotes. If the text itself contains an apostrophe, like Ravi\'s, you write two single quotes: \'Ravi\'\'s\'. It looks strange, but it is the standard SQL way.',
          'Every row must follow the table\'s rules: types, NOT NULL, UNIQUE and the primary key. If even one row in a multi-row INSERT breaks a rule, the whole INSERT fails and no rows are added. That all-or-nothing behaviour protects the data from half-finished changes.'
        ],
        example: 'INSERT is like adding new entries to a guest book at a wedding. Each guest writes their name, city and message on a new line, in the columns already printed on the page. Nobody rewrites the old lines.',
        code: lines(
          'CREATE TABLE products (id serial PRIMARY KEY, name text NOT NULL, category text, price numeric(10,2));',
          "INSERT INTO products (name, category, price) VALUES ('Notebook', 'stationery', 60);",
          'INSERT INTO products (name, category, price) VALUES',
          "  ('Pen', 'stationery', 10),",
          "  ('Headphones', 'electronics', 1499),",
          "  ('Ravi''s special mug', 'kitchen', 250);",
          'SELECT * FROM products;'
        ),
        output: lines(
          ' id | name               | category    | price',
          '----+--------------------+-------------+---------',
          '  1 | Notebook           | stationery  |   60.00',
          '  2 | Pen                | stationery  |   10.00',
          '  3 | Headphones         | electronics | 1499.00',
          "  4 | Ravi's special mug | kitchen     |  250.00",
          '(4 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'Columns listed, values in the same order. id is filled in automatically.' },
          { line: 3, note: 'One INSERT, three rows, separated by commas.' },
          { line: 6, note: 'Two single quotes inside text make one apostrophe.' }
        ],
        tryIt: "Add a fifth product in its own INSERT: ('Water bottle', 'kitchen', 350). Then try one with no name, like (NULL, 'kitchen', 5), and read the error.",
        check: {
          question: 'Why is it good to list the column names in an INSERT?',
          options: ['It is clearer, uses defaults for missing columns, and keeps working if new columns are added', 'It makes the INSERT faster', 'PostgreSQL requires it'],
          answer: 0,
          why: 'A column list makes the statement readable and safe when the table changes. It is optional, but a strong habit.'
        }
      },
      {
        title: 'RETURNING: seeing what you just added',
        say: [
          'When you insert a row with a serial id, you often need to know which id it got. For example, after creating an order, the app needs the new order\'s id to add its items.',
          'PostgreSQL has a handy extra called RETURNING. Add it at the end of an INSERT, with the columns you want back, and the statement shows you the new rows, just like a SELECT would.',
          'RETURNING also works with UPDATE and DELETE, which you will learn next. It shows exactly which rows were changed or removed. This is great for checking your work and for apps that need the new values.',
          'RETURNING is a PostgreSQL feature. Some other databases have their own ways of doing this, but the idea is the same everywhere: after a change, get back what changed without a second query.',
          'In the lesson editor, RETURNING is also a nice way to see the effect of a statement straight away, without writing a separate SELECT.'
        ],
        example: 'When you post a letter by speed post, the counter gives you a receipt with a tracking number. You did not choose that number, but you need it to follow your letter. RETURNING is the receipt for your new row.',
        code: lines(
          'CREATE TABLE orders (id serial PRIMARY KEY, customer text NOT NULL, status text DEFAULT \'pending\');',
          "INSERT INTO orders (customer) VALUES ('Asha') RETURNING id, status;",
          "INSERT INTO orders (customer, status) VALUES ('Ravi', 'paid'), ('Priya', 'paid') RETURNING id, customer;"
        ),
        output: lines(
          ' id | status',
          '----+---------',
          '  1 | pending',
          '(1 row)',
          '',
          ' id | customer',
          '----+----------',
          '  2 | Ravi',
          '  3 | Priya',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'RETURNING shows the new row\'s id and its default status.' },
          { line: 3, note: 'With several rows, RETURNING shows each new row.' }
        ],
        tryIt: 'Change RETURNING id, status on line 2 to RETURNING * and run it. You get every column of the new row.',
        check: {
          question: 'What does RETURNING id do at the end of an INSERT?',
          options: ['Shows the id of each new row', 'Deletes the row after inserting it', 'Checks the id is unique'],
          answer: 0,
          why: 'RETURNING shows columns of the rows that were just inserted, like a built-in SELECT of the new rows.'
        }
      },
      {
        title: 'UPDATE: changing rows',
        say: [
          'UPDATE changes values in rows that already exist. You write UPDATE, the table, SET and the new values, and then WHERE to choose which rows to change: UPDATE products SET price = 12 WHERE name = \'Pen\'.',
          'You can change several columns at once by separating them with commas: SET price = 12, stock = 400. And the new value can use the old one: SET price = price * 1.10 raises the price by 10 percent, for every row that matches the WHERE.',
          'The WHERE part is the most important part of an UPDATE. It decides which rows change. Most of the time you pick rows by their primary key, like WHERE id = 3, because that is guaranteed to match exactly one row.',
          'PostgreSQL reports how many rows were changed. If it says 0, your WHERE did not match anything, maybe because of a spelling or capital-letter difference. If the number is much bigger than you expected, something is wrong with your WHERE.',
          'Adding RETURNING to an UPDATE shows the rows with their new values. It is a very good habit while learning, because you see immediately what your statement did.',
          'Two special values are useful in SET. SET city = NULL clears a value, for example when a customer asks you to remove their city. SET status = DEFAULT puts back the default value from the table design. Both are cleaner than typing an empty text, which is not the same as NULL and can confuse later queries.'
        ],
        example: 'UPDATE is like a shopkeeper sticking new price labels on the shelf. "Increase the price of every notebook by 5 rupees" is SET price = price + 5 WHERE category = \'notebook\'. Other items keep their old labels.',
        code: lines(
          'CREATE TABLE products (id serial PRIMARY KEY, name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products (name, category, price, stock) VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Headphones', 'electronics', 1499, 25);",
          "UPDATE products SET price = 12, stock = 450 WHERE name = 'Pen' RETURNING name, price, stock;",
          "UPDATE products SET price = price * 1.10 WHERE category = 'electronics' RETURNING name, price;",
          'SELECT name, price FROM products ORDER BY id;'
        ),
        output: lines(
          ' name | price | stock',
          '------+-------+-------',
          ' Pen  | 12.00 |   450',
          '(1 row)',
          '',
          ' name       | price',
          '------------+---------',
          ' Headphones | 1648.90',
          '(1 row)',
          '',
          ' name       | price',
          '------------+---------',
          ' Notebook   |   60.00',
          ' Pen        |   12.00',
          ' Headphones | 1648.90',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Two columns changed in one row, chosen by name.' },
          { line: 4, note: 'The new price uses the old one: 1499 plus 10% is 1648.90.' },
          { line: 5, note: 'ORDER BY id keeps the rows in a fixed order. You will learn ORDER BY on Day 6.' }
        ],
        tryIt: "Add an UPDATE that sets the stock of 'Notebook' to 0, with RETURNING *, and run it.",
        check: {
          question: 'What does UPDATE products SET price = price + 5 WHERE category = \'stationery\' do?',
          options: ['Adds 5 to the price of every stationery product', 'Sets every price to 5', 'Adds a new product'],
          answer: 0,
          why: 'SET price = price + 5 uses each row\'s old price, and WHERE limits the change to stationery products.'
        }
      },
      {
        title: 'DELETE: removing rows',
        say: [
          'DELETE FROM removes rows from a table. Like UPDATE, it uses WHERE to choose which rows: DELETE FROM products WHERE id = 3 removes one product.',
          'DELETE removes whole rows, never single values. If you only want to clear one value, like a phone number, use UPDATE to set it to NULL instead.',
          'Deleted rows are gone. In the lesson editor that does not matter, but on a real database there is no undo, unless you are inside a transaction, which you will learn on Day 22, or unless there is a backup.',
          'Some rows cannot be deleted because other rows depend on them. For example, a product that appears in old orders is protected by a foreign key, and PostgreSQL will refuse to delete it. That protection is a good thing: it stops you breaking the history of your orders. You will see it in action on Day 10.',
          'Because of this, many real apps do not delete important rows at all. They add a column like is_active and set it to false instead. This is called a soft delete, and it keeps history intact.'
        ],
        example: 'DELETE is like tearing a page out of a notebook: the whole page goes, not just one word on it. If you only want to remove one word, you cross it out and write something else, which is UPDATE.',
        code: lines(
          'CREATE TABLE products (id serial PRIMARY KEY, name text, stock int, is_active boolean DEFAULT true);',
          "INSERT INTO products (name, stock) VALUES ('Notebook', 120), ('Old calendar', 0), ('Pen', 500), ('Desk lamp', 0);",
          'DELETE FROM products WHERE stock = 0 AND name = \'Old calendar\' RETURNING name;',
          "UPDATE products SET is_active = false WHERE name = 'Desk lamp';",
          'SELECT name, stock, is_active FROM products ORDER BY id;'
        ),
        output: lines(
          ' name',
          '--------------',
          ' Old calendar',
          '(1 row)',
          '',
          ' name      | stock | is_active',
          '-----------+-------+-----------',
          ' Notebook  |   120 | true',
          ' Pen       |   500 | true',
          ' Desk lamp |     0 | false',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Delete one row, and show which one was removed.' },
          { line: 4, note: 'A soft delete: the lamp is hidden, but its history is kept.' }
        ],
        tryIt: 'Change the DELETE on line 3 to remove every product with stock above 100, and look at which rows are left.',
        check: {
          question: 'You want to remove a customer\'s phone number but keep the customer. What do you use?',
          options: ['UPDATE ... SET phone = NULL WHERE ...', 'DELETE FROM customers WHERE ...', 'DROP TABLE customers'],
          answer: 0,
          why: 'DELETE removes whole rows. To clear one value, UPDATE it to NULL.'
        }
      },
      {
        title: 'The most dangerous mistake: forgetting WHERE',
        say: [
          'Here is the most important safety lesson in this course. An UPDATE or DELETE without WHERE changes every single row in the table. UPDATE products SET price = 0 makes every product free. DELETE FROM customers removes every customer.',
          'This mistake has happened at real companies, and it has caused real outages. It is easy to make: you write the first line, press Enter by accident, and the WHERE never gets typed.',
          'Professional developers protect themselves with a few habits. First, write the WHERE before anything else, or run the same WHERE as a SELECT first to see which rows it matches. Second, use RETURNING or check the number of changed rows. Third, on important data, work inside a transaction so you can undo, which you will learn on Day 22.',
          'Some tools and companies even block UPDATE and DELETE without WHERE on the live database. And that is one reason regular backups exist: to recover from exactly this kind of mistake.',
          'In the example below, notice the SELECT that uses the same WHERE as the DELETE. Checking first, then changing, is a habit worth building from your first week.',
          'A simple trick makes this habit easy. Write the query as SELECT * FROM customers WHERE city = \'Delhi\' first and run it. When the rows look right, change only the first part to DELETE FROM customers and keep the WHERE exactly as it is. Because the WHERE has not changed, you delete exactly the rows you just saw, no more and no fewer.'
        ],
        example: 'It is like a teacher saying "everyone who did not submit homework, stand up", but forgetting to say the "who did not submit homework" part. The whole class stands up. The condition is what makes the instruction safe.',
        code: lines(
          'CREATE TABLE customers (id serial PRIMARY KEY, name text, city text);',
          "INSERT INTO customers (name, city) VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai'), ('Karan', 'Delhi');",
          "SELECT name FROM customers WHERE city = 'Delhi';",
          "DELETE FROM customers WHERE city = 'Delhi';",
          'SELECT count(*) AS left_after_safe_delete FROM customers;',
          'DELETE FROM customers;',
          'SELECT count(*) AS left_after_no_where FROM customers;'
        ),
        output: lines(
          ' name',
          '-------',
          ' Karan',
          '(1 row)',
          '',
          ' left_after_safe_delete',
          '------------------------',
          '                      2',
          '(1 row)',
          '',
          ' left_after_no_where',
          '---------------------',
          '                   0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Check first: exactly which rows will this WHERE match?' },
          { line: 4, note: 'Then delete with the same WHERE.' },
          { line: 6, note: 'No WHERE: every customer is deleted.' }
        ],
        tryIt: 'Add WHERE name = \'Ravi\' to line 6 and run again. Now only Ravi is deleted and one customer is left.',
        check: {
          question: 'What does UPDATE products SET stock = 0; (with no WHERE) do?',
          options: ['Sets the stock of every product to 0', 'Does nothing until you add WHERE', 'Gives an error'],
          answer: 0,
          why: 'Without WHERE, UPDATE and DELETE apply to every row. PostgreSQL does not ask for confirmation.'
        }
      },
      {
        title: 'Putting it together: keeping the shop up to date',
        say: [
          'Let us put today\'s commands together as a small day in the life of the shop. New stock arrives, a price changes, and a product is removed from the catalogue.',
          'Notice the order of the steps: add the new product with INSERT and see its id with RETURNING, raise the prices of one category with a single UPDATE, delete one product chosen by its name, and finally check the result with a SELECT.',
          'Every change has a WHERE, except the INSERT, which does not need one because it only adds a new row. Every change can be checked with RETURNING or a SELECT. These are exactly the habits that keep real data safe.',
          'In today\'s practice, you will add a new product with all its details, and then raise electronics prices by 10 percent and delete a product that is no longer sold. The shop database is ready for you in the practice editor.',
          'Tomorrow you learn WHERE properly: comparisons, AND and OR, and the tricky NULL value. Since UPDATE and DELETE depend on WHERE, tomorrow\'s lesson makes today\'s commands much more powerful.'
        ],
        example: 'A shop owner\'s evening routine: write the new items into the stock book, correct a few prices, strike out an item that is no longer sold, and then read through the book once to check everything is right.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text NOT NULL, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES (1, 'Notebook', 'stationery', 60, 120), (2, 'Headphones', 'electronics', 1499, 25), (3, 'Phone stand', 'electronics', 299, 60), (4, 'Stapler', 'stationery', 150, 30);",
          "INSERT INTO products VALUES (5, 'Sticky notes', 'stationery', 45, 200) RETURNING id, name;",
          "UPDATE products SET price = price * 1.10 WHERE category = 'electronics';",
          "DELETE FROM products WHERE name = 'Stapler';",
          'SELECT name, price FROM products ORDER BY id;'
        ),
        output: lines(
          ' id | name',
          '----+--------------',
          '  5 | Sticky notes',
          '(1 row)',
          '',
          ' name         | price',
          '--------------+---------',
          ' Notebook     |   60.00',
          ' Headphones   | 1648.90',
          ' Phone stand  |  328.90',
          ' Sticky notes |   45.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'A new product, and RETURNING confirms it.' },
          { line: 4, note: 'One UPDATE changes every electronics price.' },
          { line: 5, note: 'The Stapler is removed; everything else stays.' }
        ],
        tryIt: 'Add an UPDATE that halves the price of Sticky notes (price = price / 2) before the SELECT, and check it shows 22.50.',
        check: {
          question: 'Which statement does not need a WHERE?',
          options: ['INSERT', 'UPDATE', 'DELETE'],
          answer: 0,
          why: 'INSERT adds new rows, so there is nothing to choose. UPDATE and DELETE need WHERE to pick the rows to change.'
        }
      }
    ],
    summary: [
      'INSERT INTO table (columns) VALUES (...), (...) adds one or many rows.',
      'RETURNING shows the rows an INSERT, UPDATE or DELETE touched.',
      'UPDATE table SET column = value WHERE ... changes rows; the new value can use the old one.',
      'DELETE FROM table WHERE ... removes whole rows; a soft delete sets is_active = false instead.',
      'Always check your WHERE first. Without WHERE, UPDATE and DELETE change every row.'
    ],
    projectStep: {
      title: 'My Library: add, fix and remove books',
      steps: [
        'Recreate your books table from yesterday and INSERT at least 5 books in one statement.',
        'Use RETURNING to see the ids they were given.',
        'UPDATE one book to mark it finished, choosing it by id.',
        'DELETE one book you gave away, and SELECT * to check the rest.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 4,
    title: 'Filtering Rows with WHERE',
    goal: 'You can filter rows with comparisons, combine conditions with AND, OR and NOT, and handle NULL correctly.',
    minutes: 28,
    recap: 'Yesterday you added rows with INSERT, changed them with UPDATE, removed them with DELETE, and learned why WHERE matters.',
    parts: [
      {
        title: 'WHERE and comparisons',
        say: [
          'Most questions are about some rows, not all of them: products under 500 rupees, orders from this week, customers in Pune. WHERE keeps only the rows where a condition is true. It comes after FROM: SELECT name FROM products WHERE price < 500.',
          'The comparison signs are the same ones you know from maths, with two differences. Equal is a single = in SQL, not ==. And "not equal" is written <> (or != , which PostgreSQL also accepts). The others are <, >, <= and >=.',
          'Comparisons work on numbers, text and dates. For text, = is exact, including capital letters: \'pune\' is not equal to \'Pune\'. For dates, earlier dates are "smaller", so ordered_on < \'2026-09-15\' means before the 15th.',
          'PostgreSQL checks the condition for each row, one by one. Rows where it is true are kept; rows where it is false are left out. The table itself does not change; you just see fewer rows in the result.',
          'You have already used WHERE with UPDATE and DELETE yesterday. It works in exactly the same way there: the condition chooses which rows are changed or removed. So everything you learn today makes those commands safer too.',
          'You can also compare two columns with each other, not only a column with a fixed value. WHERE stock < min_stock finds products that need reordering, if the table has both columns. And you can compare with a calculation: WHERE price * 1.18 > 1000 finds products that cost more than 1000 once GST is added.'
        ],
        example: 'WHERE is like the filters on a shopping app: "price under 500", "rating 4 and above". The shop still has every product, but the screen only shows the ones that match your filter.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Backpack', 'bags', 1200, 15), ('Desk lamp', 'home', 899, 0), ('Headphones', 'electronics', 1499, 25);",
          'SELECT name, price FROM products WHERE price < 500;',
          "SELECT name FROM products WHERE category <> 'stationery';",
          'SELECT name, stock FROM products WHERE stock = 0;'
        ),
        output: lines(
          ' name     | price',
          '----------+-------',
          ' Notebook | 60.00',
          ' Pen      | 10.00',
          '(2 rows)',
          '',
          ' name',
          '------------',
          ' Backpack',
          ' Desk lamp',
          ' Headphones',
          '(3 rows)',
          '',
          ' name      | stock',
          '-----------+-------',
          ' Desk lamp |     0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Keep only the rows where price is less than 500.' },
          { line: 4, note: '<> means "not equal".' },
          { line: 5, note: 'A single = compares in SQL.' }
        ],
        tryIt: "Write a query for products that cost 899 or more (>=). Then try WHERE category = 'Stationery' with a capital S and notice it finds nothing.",
        check: {
          question: 'How do you write "not equal" in SQL?',
          options: ['<>', '==', '=!'],
          answer: 0,
          why: 'SQL uses <> for "not equal" (PostgreSQL also accepts !=). A single = means equal.'
        }
      },
      {
        title: 'AND, OR and NOT',
        say: [
          'One condition is often not enough. AND keeps rows where both conditions are true: price < 1000 AND stock > 0 means cheap and in stock. OR keeps rows where at least one is true: category = \'bags\' OR category = \'home\'.',
          'NOT reverses a condition: NOT (stock > 0) is the same as stock <= 0. It is most useful with the special words you will learn tomorrow, like NOT IN and NOT LIKE.',
          'When you mix AND and OR, be careful. SQL does AND before OR, just like multiplication before addition in maths. So a OR b AND c means a OR (b AND c), which is often not what you meant.',
          'The fix is simple: use brackets. (category = \'bags\' OR category = \'home\') AND price < 1000 means exactly what it says. Brackets make your intention clear to PostgreSQL and to anyone reading your query.',
          'A good habit is to read your WHERE out loud in plain words before running it. If it sounds different from the question you are trying to answer, fix it with brackets.'
        ],
        example: 'A job listing says: "Freshers or experienced candidates, who live in Pune". If you read it without care, you might think any fresher from any city can apply. Brackets make it clear: (freshers OR experienced) AND lives in Pune.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Backpack', 'bags', 1200, 15), ('Tote bag', 'bags', 450, 0), ('Desk lamp', 'home', 899, 0), ('Cushion', 'home', 300, 40);",
          'SELECT name FROM products WHERE price < 1000 AND stock > 0;',
          "SELECT name FROM products WHERE category = 'bags' OR category = 'home' AND price < 1000;",
          "SELECT name FROM products WHERE (category = 'bags' OR category = 'home') AND price < 1000;"
        ),
        output: lines(
          ' name',
          '----------',
          ' Notebook',
          ' Cushion',
          '(2 rows)',
          '',
          ' name',
          '-----------',
          ' Backpack',
          ' Tote bag',
          ' Desk lamp',
          ' Cushion',
          '(4 rows)',
          '',
          ' name',
          '-----------',
          ' Tote bag',
          ' Desk lamp',
          ' Cushion',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'AND: both must be true.' },
          { line: 4, note: 'Without brackets, AND goes first, so every bag is kept, even the 1200 Backpack.' },
          { line: 5, note: 'With brackets: bags or home items, and under 1000.' }
        ],
        tryIt: "Write a query for products that are in the home category but NOT in stock: category = 'home' AND NOT (stock > 0).",
        check: {
          question: 'In a OR b AND c, which part does SQL work out first?',
          options: ['b AND c', 'a OR b', 'They are worked out left to right'],
          answer: 0,
          why: 'AND is done before OR. Use brackets, like (a OR b) AND c, when you mean something else.'
        }
      },
      {
        title: 'NULL: the unknown value',
        say: [
          'NULL means "no value" or "unknown". A customer who did not give a city has NULL in the city column. NULL is not the text \'NULL\', not an empty text \'\', and not zero. It is the absence of a value.',
          'Here is the trap: NULL is never equal to anything, not even to another NULL. If a city is unknown, is it Pune? We do not know. So city = \'Pune\' is not true for that row, and city <> \'Pune\' is not true either. The answer is "unknown", and WHERE only keeps rows where the condition is definitely true.',
          'That means WHERE city = NULL never finds anything. It is one of the most common SQL bugs, and interviewers love to ask about it. The correct way is IS NULL: WHERE city IS NULL. For the opposite, use IS NOT NULL.',
          'NULL also affects maths. Anything plus NULL is NULL: if a price is unknown, price + 10 is unknown too. You will learn how totals like SUM treat NULL on Day 8, and a function called coalesce that replaces NULL with a value you choose, on Day 7.',
          'When you design tables, NOT NULL on columns that must always have a value avoids many of these surprises. When NULL is allowed, remember to think about it in every WHERE.',
          'A quick way to remember all this: NULL is not a value, it is the lack of one. Any question you ask about a missing value gets the answer "unknown", and WHERE only keeps rows whose answer is a definite yes. The only questions that get a clear yes or no about NULL are IS NULL and IS NOT NULL.'
        ],
        example: 'Imagine a class list where one student\'s age box was left blank. Is that student older than 18? You cannot say yes, and you cannot say no. The honest answer is "unknown". SQL treats NULL exactly like that blank box.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai'), ('Meera', NULL);",
          'SELECT name FROM customers WHERE city = NULL;',
          'SELECT name FROM customers WHERE city IS NULL;',
          "SELECT name FROM customers WHERE city <> 'Pune';",
          'SELECT name, city IS NULL AS city_unknown FROM customers;'
        ),
        output: lines(
          ' name',
          '------',
          '(0 rows)',
          '',
          ' name',
          '-------',
          ' Meera',
          '(1 row)',
          '',
          ' name',
          '------',
          ' Ravi',
          '(1 row)',
          '',
          ' name  | city_unknown',
          '-------+--------------',
          ' Asha  | false',
          ' Ravi  | false',
          ' Meera | true',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Always empty: nothing is ever "equal" to NULL.' },
          { line: 4, note: 'The right way to find unknown values.' },
          { line: 5, note: 'Meera is missing here too: we do not know that her city is not Pune.' }
        ],
        tryIt: "Change line 5 to also keep customers with no city: WHERE city <> 'Pune' OR city IS NULL. Now Meera appears.",
        check: {
          question: 'How do you find rows where email has no value?',
          options: ['WHERE email IS NULL', 'WHERE email = NULL', "WHERE email = 'NULL'"],
          answer: 0,
          why: 'Nothing is ever equal to NULL, so = NULL finds nothing. IS NULL is the correct test.'
        }
      },
      {
        title: 'Filtering dates',
        say: [
          'Dates are one of the most common things to filter by: orders this month, customers who joined this year, bills due in the next week. In PostgreSQL, you can compare a date column with a date written as text in year-month-day format, like \'2026-09-15\'.',
          'Earlier dates are smaller. So ordered_on < \'2026-09-15\' means before the 15th, and ordered_on >= \'2026-09-01\' means on or after the 1st. To pick a whole month, combine two conditions with AND: on or after the first day, and before the first day of the next month.',
          'PostgreSQL knows today\'s date as CURRENT_DATE. You can do simple maths with dates: CURRENT_DATE - 7 is one week ago. So WHERE ordered_on >= CURRENT_DATE - 7 means "in the last 7 days". In the lesson examples we use fixed dates, so the output is the same every time you run it.',
          'Always write dates as year-month-day, like 2026-09-28. Formats like 28/09/2026 can be read differently in different countries: is 03/04 the 3rd of April or the 4th of March? Year-month-day is never ambiguous.',
          'You will learn more date tools, like extracting the month or counting days between dates, on Day 7.'
        ],
        example: 'Filtering by date is like looking through your bank statement for "all payments from 1 to 15 September". You go down the list and keep only the lines whose date falls in that window.',
        code: lines(
          'CREATE TABLE orders (id int, customer text, ordered_on date);',
          "INSERT INTO orders VALUES (1, 'Asha', '2026-08-28'), (2, 'Ravi', '2026-09-03'), (3, 'Asha', '2026-09-10'), (4, 'Priya', '2026-10-02');",
          "SELECT id, ordered_on FROM orders WHERE ordered_on >= '2026-09-01' AND ordered_on < '2026-10-01';",
          "SELECT id FROM orders WHERE ordered_on < '2026-09-05';",
          "SELECT date '2026-09-30' - 7 AS one_week_before;"
        ),
        output: lines(
          ' id | ordered_on',
          '----+------------',
          '  2 | 2026-09-03',
          '  3 | 2026-09-10',
          '(2 rows)',
          '',
          ' id',
          '----',
          '  1',
          '  2',
          '(2 rows)',
          '',
          ' one_week_before',
          '-----------------',
          ' 2026-09-23',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The whole of September: on or after the 1st, and before 1 October.' },
          { line: 5, note: 'Subtracting a number of days from a date gives another date.' }
        ],
        tryIt: "Find Asha's orders in September only by adding AND customer = 'Asha' to line 3.",
        check: {
          question: 'Which WHERE finds orders in September 2026?',
          options: ["ordered_on >= '2026-09-01' AND ordered_on < '2026-10-01'", "ordered_on = '2026-09'", "ordered_on > '2026-09-01' OR ordered_on < '2026-10-01'"],
          answer: 0,
          why: 'On or after the first day, and before the first day of the next month, covers the whole month. The OR version would match almost every date.'
        }
      },
      {
        title: 'WHERE with UPDATE and DELETE',
        say: [
          'Everything from today works with UPDATE and DELETE too. The WHERE chooses which rows change, and now you can write precise conditions with AND, OR, dates and IS NULL.',
          'For example, you might mark old unpaid orders as cancelled: UPDATE orders SET status = \'cancelled\' WHERE status = \'pending\' AND ordered_on < \'2026-09-01\'. Or fill in a missing value: UPDATE customers SET city = \'Unknown\' WHERE city IS NULL.',
          'Remember the habit from yesterday: before running an UPDATE or DELETE, run a SELECT with the same WHERE to see which rows it will touch. If the SELECT shows the rows you expect, the change will affect exactly those rows.',
          'Be extra careful with NULL here. UPDATE ... WHERE city <> \'Pune\' will not touch customers whose city is NULL. Sometimes that is right; sometimes it is a hidden bug. Always ask yourself: what happens to rows with NULL?',
          'In the example below, notice how the SELECT and the UPDATE use exactly the same WHERE.'
        ],
        example: 'A school cleaning up old records says: "for students who left before 2020 and have no forwarding address, mark them archived". Every part of that sentence becomes a part of the WHERE, and the office checks the list before stamping anything.',
        code: lines(
          'CREATE TABLE orders (id int, status text, ordered_on date);',
          "INSERT INTO orders VALUES (1, 'pending', '2026-08-20'), (2, 'delivered', '2026-08-25'), (3, 'pending', '2026-09-12'), (4, 'pending', NULL);",
          "SELECT id FROM orders WHERE status = 'pending' AND ordered_on < '2026-09-01';",
          "UPDATE orders SET status = 'cancelled' WHERE status = 'pending' AND ordered_on < '2026-09-01' RETURNING id, status;",
          "SELECT id, status FROM orders WHERE status = 'pending';"
        ),
        output: lines(
          ' id',
          '----',
          '  1',
          '(1 row)',
          '',
          ' id | status',
          '----+-----------',
          '  1 | cancelled',
          '(1 row)',
          '',
          ' id | status',
          '----+---------',
          '  3 | pending',
          '  4 | pending',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Check first with SELECT.' },
          { line: 4, note: 'Then UPDATE with exactly the same WHERE.' },
          { line: 5, note: 'Order 4 has no date (NULL), so the date condition was not true for it, and it stayed pending.' }
        ],
        tryIt: 'Write an UPDATE that also cancels pending orders with no date: WHERE status = \'pending\' AND ordered_on IS NULL.',
        check: {
          question: 'Why did order 4 stay pending in the example?',
          options: ['Its date is NULL, so "ordered_on < 2026-09-01" is not true for it', 'It was delivered', 'UPDATE only changes one row'],
          answer: 0,
          why: 'A comparison with NULL is never true, so the row is not matched by the WHERE.'
        }
      },
      {
        title: 'Putting it together: answering shop questions',
        say: [
          'Let us answer a few real questions from a shop manager with today\'s tools. Each question becomes a WHERE: first in plain words, then in SQL.',
          '"Which products can I sell today for under 1000?" means price < 1000 AND stock > 0. "Which customers have not told us their city?" means city IS NULL. "Which orders from September are not delivered yet?" combines a date range with status <> \'delivered\'.',
          'Writing the question in plain words first, and then turning each part into a condition, is how experienced developers write queries. It also helps you spot missing brackets or forgotten NULLs.',
          'In today\'s practice you will find the affordable products that are in stock, and the customers with no city. For the second one, remember the NULL trap from this lesson.',
          'Tomorrow you learn more ways to filter: searching inside text with LIKE, checking a list of values with IN, and ranges with BETWEEN.'
        ],
        example: 'A manager\'s morning questions are like a checklist of filters: what can we sell, who do we need to call, what is late. Each question is one small WHERE, and together they run the day.',
        code: lines(
          'CREATE TABLE customers (id int, name text, city text);',
          "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai'), (3, 'Meera', NULL);",
          'CREATE TABLE products (name text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 60, 120), ('Desk lamp', 899, 0), ('Headphones', 1499, 25), ('Phone stand', 299, 60);",
          'CREATE TABLE orders (id int, status text, ordered_on date);',
          "INSERT INTO orders VALUES (1, 'delivered', '2026-09-01'), (2, 'shipped', '2026-09-10'), (3, 'pending', '2026-09-25'), (4, 'pending', '2026-10-02');",
          'SELECT name FROM products WHERE price < 1000 AND stock > 0;',
          'SELECT name FROM customers WHERE city IS NULL;',
          "SELECT id, status FROM orders WHERE ordered_on >= '2026-09-01' AND ordered_on < '2026-10-01' AND status <> 'delivered';"
        ),
        output: lines(
          ' name',
          '-------------',
          ' Notebook',
          ' Phone stand',
          '(2 rows)',
          '',
          ' name',
          '-------',
          ' Meera',
          '(1 row)',
          '',
          ' id | status',
          '----+---------',
          '  2 | shipped',
          '  3 | pending',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'Affordable and in stock: the Desk lamp is excluded because its stock is 0.' },
          { line: 9, note: 'Three conditions joined with AND: in September and not delivered.' }
        ],
        tryIt: "Add a query for products that are either out of stock or cost more than 1000: stock = 0 OR price > 1000.",
        check: {
          question: 'A manager asks: "customers from Pune, or with no city". Which WHERE is right?',
          options: ["city = 'Pune' OR city IS NULL", "city = 'Pune' OR city = NULL", "city = 'Pune' AND city IS NULL"],
          answer: 0,
          why: 'OR keeps rows matching either condition, and IS NULL is the correct test for a missing city.'
        }
      }
    ],
    summary: [
      'WHERE keeps only the rows where a condition is true; it also chooses rows for UPDATE and DELETE.',
      'Comparisons: =, <> (not equal), <, >, <=, >=. Text comparisons care about capital letters.',
      'AND needs both, OR needs one, NOT reverses. AND is done before OR, so use brackets.',
      'NULL means unknown: = NULL finds nothing; use IS NULL and IS NOT NULL.',
      'Filter dates with year-month-day text; a month is >= the 1st and < the 1st of next month.'
    ],
    projectStep: {
      title: 'My Library: filter your books',
      steps: [
        'Add a pages column value for every book, and leave the author empty (NULL) for one of them.',
        'Find books with more than 300 pages.',
        'Find unfinished books by a chosen author: finished = false AND author = \'...\'.',
        'Find the book with no author using IS NULL.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 5,
    title: 'Searching Text and Ranges: LIKE, IN, BETWEEN',
    goal: 'You can search inside text with LIKE and ILIKE, check a list of values with IN, and pick ranges with BETWEEN.',
    minutes: 28,
    recap: 'Yesterday you filtered rows with WHERE, combined conditions with AND, OR and NOT, and learned to handle NULL.',
    parts: [
      {
        title: 'LIKE: searching inside text',
        say: [
          'With = you can only find text that matches exactly. But people search with parts of words: "head" should find Headphones. LIKE compares text with a pattern, where two special characters stand for "anything".',
          'The percent sign % means "any number of characters, including none". So \'Head%\' means "starts with Head", \'%phone%\' means "contains phone anywhere", and \'%s\' means "ends with s".',
          'The underscore _ means "exactly one character". So \'P_n\' matches Pen and Pan, but not Pin cushion. It is used less often than %, but it is handy for codes with a fixed shape, like PIN codes or product codes.',
          'LIKE cares about capital letters, just like =. \'head%\' does not match Headphones, because of the capital H. That surprises many beginners, and you will see the fix in the next part.',
          'NOT LIKE keeps the rows that do not match the pattern. For example, WHERE email NOT LIKE \'%@%\' finds email addresses without an @ sign, which are probably typing mistakes.',
          'What if you need to search for a real percent sign or underscore, like the text 50%? Put a backslash before it in the pattern: LIKE \'%50\\%%\' finds names containing 50%. You will not need this often, but it explains a strange result if one of your searches ever matches far more rows than expected.'
        ],
        example: 'LIKE is like searching your phone contacts by typing "Ra": you get Ravi, Rahul and Rashmi. You did not type the whole name, just a pattern, and the phone found every name that fits.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Headphones', 1499), ('Phone stand', 299), ('Pen', 10), ('Pencil box', 120), ('Notebook', 60);",
          "SELECT name FROM products WHERE name LIKE 'P%';",
          "SELECT name FROM products WHERE name LIKE '%phone%';",
          "SELECT name FROM products WHERE name LIKE 'P_n';",
          "SELECT name FROM products WHERE name LIKE 'head%';"
        ),
        output: lines(
          ' name',
          '-------------',
          ' Phone stand',
          ' Pen',
          ' Pencil box',
          '(3 rows)',
          '',
          ' name',
          '------------',
          ' Headphones',
          '(1 row)',
          '',
          ' name',
          '------',
          ' Pen',
          '(1 row)',
          '',
          ' name',
          '------',
          '(0 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Starts with a capital P.' },
          { line: 4, note: 'Contains "phone": Headphones matches; Phone stand does not, because its P is a capital.' },
          { line: 5, note: 'P, any one character, then n.' },
          { line: 6, note: 'Nothing: LIKE cares about capital letters.' }
        ],
        tryIt: "Find every product whose name ends with the letter k: LIKE '%k'. Which product is it?",
        check: {
          question: "What does name LIKE '%bag%' find?",
          options: ['Names that contain "bag" anywhere', 'Names that are exactly "bag"', 'Names that start with "bag"'],
          answer: 0,
          why: '% on both sides means any characters before and after, so "bag" can be anywhere in the name.'
        }
      },
      {
        title: 'ILIKE: search without worrying about capitals',
        say: [
          'People type in search boxes in any mix of capital and small letters. PostgreSQL has ILIKE, which works exactly like LIKE but ignores capital letters. The I stands for "insensitive", as in case-insensitive.',
          'So name ILIKE \'head%\' finds Headphones, HEADPHONES and headphones. For most search boxes in apps, ILIKE is what you want.',
          'ILIKE is a PostgreSQL feature. In other databases you might see a different approach: lower(name) LIKE \'head%\', which turns the name into small letters first. That works in PostgreSQL too, and you will learn lower() on Day 7.',
          'Searching with a % at the start, like \'%phone%\', has a cost on very large tables: PostgreSQL has to look at every row. For a shop with thousands of products that is fine. For millions of rows, there are special indexes and search tools, which is a topic for later in your career.',
          'In the example below, notice that ILIKE finds both Phone stand and Headphones for the search "phone", while LIKE only found one of them.',
          'In a real app, the search text comes from what the user typed, for example "phone". The app adds the percent signs around it and sends it to the database as a separate value, not glued into the SQL text. You will learn why that matters, and how it prevents an attack called SQL injection, on Day 26.'
        ],
        example: 'Google does not care whether you type "Pune weather" or "pune WEATHER"; it gives you the same results. ILIKE brings that friendliness to your database searches.',
        code: lines(
          'CREATE TABLE products (name text);',
          "INSERT INTO products VALUES ('Headphones'), ('Phone stand'), ('Pen'), ('Notebook');",
          "SELECT name FROM products WHERE name ILIKE '%phone%';",
          "SELECT name FROM products WHERE name ILIKE 'HEAD%';"
        ),
        output: lines(
          ' name',
          '-------------',
          ' Headphones',
          ' Phone stand',
          '(2 rows)',
          '',
          ' name',
          '------------',
          ' Headphones',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Both products are found, whatever the capital letters.' },
          { line: 4, note: 'Capital letters in the pattern do not matter either.' }
        ],
        tryIt: "Search for products containing 'NOTE' with ILIKE, and then with LIKE. Only ILIKE finds Notebook.",
        check: {
          question: 'What is the difference between LIKE and ILIKE?',
          options: ['ILIKE ignores capital and small letters; LIKE does not', 'ILIKE is faster', 'ILIKE only works on numbers'],
          answer: 0,
          why: 'Both use % and _ patterns. ILIKE treats capitals and small letters as the same.'
        }
      },
      {
        title: 'IN: matching a list of values',
        say: [
          'Sometimes you want rows where a column is one of several values: orders that are delivered or shipped, customers from Pune, Mumbai or Delhi. You could write city = \'Pune\' OR city = \'Mumbai\' OR city = \'Delhi\', but that gets long.',
          'IN is the short way: WHERE city IN (\'Pune\', \'Mumbai\', \'Delhi\'). It means exactly the same as the OR version, but it is shorter and much easier to read.',
          'NOT IN does the opposite: rows where the value is not in the list. WHERE status NOT IN (\'cancelled\', \'returned\') keeps every other status.',
          'Be careful with NULL again. If the column is NULL, neither IN nor NOT IN is true for that row, so rows with NULL disappear from both results. And if the list itself contains a NULL, NOT IN finds nothing at all. That surprising behaviour is a classic interview question, so remember: watch out for NULL with NOT IN.',
          'On Day 15 you will see that the list inside IN can come from another query, for example "customers whose id is in the list of customers who placed an order". That makes IN very powerful.',
          'IN works with numbers and dates as well as text. WHERE id IN (3, 7, 12) picks three exact rows by their ids, which is common when a user ticks several items in a list on screen and presses one button to act on all of them at once, like "archive these three orders".'
        ],
        example: 'A security guard with a list of invited guests checks each person: "is your name on this list?" That is IN. A bouncer with a list of banned people checks the opposite: NOT IN.',
        code: lines(
          'CREATE TABLE orders (id int, status text);',
          "INSERT INTO orders VALUES (1, 'delivered'), (2, 'shipped'), (3, 'cancelled'), (4, 'pending'), (5, NULL);",
          "SELECT id, status FROM orders WHERE status IN ('delivered', 'shipped');",
          "SELECT id, status FROM orders WHERE status NOT IN ('cancelled');",
          "SELECT count(*) AS found FROM orders WHERE status NOT IN ('cancelled', NULL);"
        ),
        output: lines(
          ' id | status',
          '----+-----------',
          '  1 | delivered',
          '  2 | shipped',
          '(2 rows)',
          '',
          ' id | status',
          '----+-----------',
          '  1 | delivered',
          '  2 | shipped',
          '  4 | pending',
          '(3 rows)',
          '',
          ' found',
          '-------',
          '     0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The same as status = \'delivered\' OR status = \'shipped\'.' },
          { line: 4, note: 'Order 5 (NULL status) is missing: NOT IN is not true for NULL.' },
          { line: 5, note: 'A NULL inside a NOT IN list makes it find nothing at all.' }
        ],
        tryIt: "Change line 3 to find orders that are pending or cancelled, using IN.",
        check: {
          question: "Which is the same as city IN ('Pune', 'Delhi')?",
          options: ["city = 'Pune' OR city = 'Delhi'", "city = 'Pune' AND city = 'Delhi'", "city LIKE 'Pune%Delhi'"],
          answer: 0,
          why: 'IN checks whether the value equals any item in the list, which is the same as several conditions joined with OR.'
        }
      },
      {
        title: 'BETWEEN: ranges of numbers and dates',
        say: [
          'BETWEEN picks values in a range: price BETWEEN 100 AND 500 keeps prices from 100 to 500. Both ends are included, so a price of exactly 100 or exactly 500 is kept.',
          'It is the same as price >= 100 AND price <= 500, just shorter and easier to read. NOT BETWEEN keeps values outside the range.',
          'BETWEEN works with dates too: ordered_on BETWEEN \'2026-09-01\' AND \'2026-09-30\' keeps every order in September. Because both ends are included, the 30th is kept.',
          'There is one trap with dates and times. If the column is a timestamp, with a time of day, then BETWEEN \'2026-09-01\' AND \'2026-09-30\' stops at midnight at the start of the 30th, so orders later on the 30th are missed. For timestamps, the safe pattern from yesterday is better: >= the first day AND < the day after the last.',
          'Always put the smaller value first. BETWEEN 500 AND 100 finds nothing, because no number is at least 500 and at most 100 at the same time.',
          'BETWEEN also works on text, using alphabetical order: name BETWEEN \'A\' AND \'M\' keeps names from A up to exactly M. That catches beginners out, because a name like Meera comes after the single letter M, so it is left out. For text, a LIKE pattern or a simple comparison is usually clearer than BETWEEN.'
        ],
        example: 'A college notice says "students aged 18 to 21 can apply". Both 18 and 21 are included. That is BETWEEN 18 AND 21. A notice that says "under 21" would be < 21 instead.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Pen', 10), ('Notebook', 60), ('Stapler', 150), ('Phone stand', 299), ('Water bottle', 350), ('Desk lamp', 899);",
          'SELECT name, price FROM products WHERE price BETWEEN 60 AND 350;',
          'SELECT name FROM products WHERE price NOT BETWEEN 60 AND 350;',
          'SELECT count(*) AS found FROM products WHERE price BETWEEN 350 AND 60;'
        ),
        output: lines(
          ' name         | price',
          '--------------+--------',
          ' Notebook     |  60.00',
          ' Stapler      | 150.00',
          ' Phone stand  | 299.00',
          ' Water bottle | 350.00',
          '(4 rows)',
          '',
          ' name',
          '-----------',
          ' Pen',
          ' Desk lamp',
          '(2 rows)',
          '',
          ' found',
          '-------',
          '     0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Both ends included: 60 and 350 are kept.' },
          { line: 4, note: 'Everything outside the range.' },
          { line: 5, note: 'The bigger number first: nothing matches.' }
        ],
        tryIt: 'Find products priced from 100 to 300 with BETWEEN. You should get Stapler and Phone stand.',
        check: {
          question: 'Does price BETWEEN 100 AND 500 include a price of exactly 500?',
          options: ['Yes, both ends are included', 'No, only 100 to 499', 'Only if you add EQUAL'],
          answer: 0,
          why: 'BETWEEN includes both ends. It is the same as price >= 100 AND price <= 500.'
        }
      },
      {
        title: 'Combining text, list and range filters',
        say: [
          'Real searches combine several filters at once. On a shopping site, you might search for "bottle", choose the kitchen and home categories, and set a price range. Each of those is one condition, and they are joined with AND.',
          'In SQL that looks like: WHERE name ILIKE \'%bottle%\' AND category IN (\'kitchen\', \'home\') AND price BETWEEN 100 AND 500. Each line of the WHERE maps to one control on the screen.',
          'Writing each condition on its own line, starting with AND, makes long filters easy to read and easy to change. You can comment out a single line with -- to test the query without that filter.',
          'This is exactly what happens behind a shop\'s filter panel. When you tick a box or move a slider, the app adds or changes one condition in a query like this, and runs it again.',
          'Be careful to use brackets if you mix in an OR, as you learned yesterday. For filters joined only with AND, no brackets are needed.'
        ],
        example: 'On a train booking site, you search "Pune to Delhi", tick "sleeper and 3A", and choose departure between 6 pm and 11 pm. Each choice becomes one condition, and only trains matching all of them are shown.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Water bottle', 'kitchen', 350), ('Steel bottle', 'kitchen', 650), ('Bottle opener', 'kitchen', 90), ('Flower vase', 'home', 400), ('Bottle lamp', 'home', 480), ('Sports bottle', 'sports', 300);",
          'SELECT name, category, price',
          'FROM products',
          "WHERE name ILIKE '%bottle%'",
          "  AND category IN ('kitchen', 'home')",
          '  AND price BETWEEN 100 AND 500;'
        ),
        output: lines(
          ' name         | category | price',
          '--------------+----------+--------',
          ' Water bottle | kitchen  | 350.00',
          ' Bottle lamp  | home     | 480.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'The search box.' },
          { line: 6, note: 'The category tick boxes.' },
          { line: 7, note: 'The price slider.' }
        ],
        tryIt: 'Put -- at the start of line 7 to turn off the price filter, and run it. Which extra products appear?',
        check: {
          question: 'On a filter panel, a user ticks two categories and sets a price range. How are these conditions joined?',
          options: ['With AND', 'With OR', 'With BETWEEN only'],
          answer: 0,
          why: 'A row must match every chosen filter, so the conditions are joined with AND. The two categories themselves go in one IN list.'
        }
      },
      {
        title: 'Putting it together: a product search',
        say: [
          'Let us finish the first week with a small search page for the shop. The page has a search box, a list of order statuses and a date range, and each becomes part of a query.',
          'First we search products by name with ILIKE. Then we find orders by status with IN and by date with BETWEEN. Notice how each query reads almost like the question it answers.',
          'You now know the basics of reading data: SELECT, FROM, WHERE, comparisons, AND and OR, NULL, LIKE, IN and BETWEEN. That is already enough to answer a large share of everyday business questions.',
          'In today\'s practice, you will find products whose name starts with P, where the LIKE trap with capital letters is waiting for you, and orders in a date range with certain statuses.',
          'After the practice comes your first test, covering Days 1 to 5. Each question has an explanation, and you can try again. Next week you will learn to sort results, calculate totals and, most importantly, join tables together.'
        ],
        example: 'A good search page feels simple to the user, but behind it every box and tick turns into one small, precise condition. You now know how to write those conditions.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Pen', 10), ('Phone stand', 299), ('Headphones', 1499), ('Notebook', 60);",
          'CREATE TABLE orders (id int, status text, ordered_on date);',
          "INSERT INTO orders VALUES (1, 'delivered', '2026-09-01'), (2, 'delivered', '2026-09-03'), (3, 'shipped', '2026-09-10'), (4, 'delivered', '2026-09-12'), (5, 'cancelled', '2026-09-20');",
          "SELECT name FROM products WHERE name ILIKE 'p%';",
          "SELECT id, status FROM orders WHERE status IN ('delivered', 'shipped') AND ordered_on BETWEEN '2026-09-05' AND '2026-09-20';"
        ),
        output: lines(
          ' name',
          '-------------',
          ' Pen',
          ' Phone stand',
          '(2 rows)',
          '',
          ' id | status',
          '----+-----------',
          '  3 | shipped',
          '  4 | delivered',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'ILIKE with a small p still finds names starting with a capital P.' },
          { line: 6, note: 'A list of statuses and a date range together. Order 5 is in the range but cancelled.' }
        ],
        tryIt: "Add 'cancelled' to the IN list on line 6 and run it. Order 5 now appears too.",
        check: {
          question: "Why does name LIKE 'p%' find nothing in this shop?",
          options: ['LIKE cares about capital letters, and the names start with a capital P', 'LIKE needs two % signs', 'p is a reserved word'],
          answer: 0,
          why: "LIKE is case-sensitive. Use LIKE 'P%' or ILIKE 'p%'."
        }
      }
    ],
    summary: [
      'LIKE searches with patterns: % is any characters, _ is exactly one. It cares about capital letters.',
      'ILIKE is the same as LIKE but ignores capital letters: best for search boxes.',
      'IN (...) matches any value in a list; NOT IN is the opposite. Watch out for NULL.',
      'BETWEEN a AND b includes both ends; put the smaller value first.',
      'Combine filters with AND, one per line, like a shop\'s filter panel.'
    ],
    projectStep: {
      title: 'My Library: search your books',
      steps: [
        'Search your books by part of the title with ILIKE.',
        'Find books by any of 2 or 3 chosen authors with IN.',
        'Find books with 150 to 400 pages with BETWEEN.',
        'Combine two of these filters in one query, one condition per line.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 6,
    title: 'Sorting and Pages: ORDER BY, LIMIT, OFFSET',
    goal: 'You can sort results by one or more columns, take the top few rows, and split long lists into pages.',
    minutes: 28,
    recap: 'Yesterday you searched text with LIKE and ILIKE, matched lists with IN, and picked ranges with BETWEEN.',
    parts: [
      {
        title: 'Why order is never guaranteed',
        say: [
          'Here is something that surprises almost every beginner: a table has no fixed order. When you run SELECT without asking for an order, PostgreSQL returns the rows in whatever order is quickest for it. Often that looks like the order you inserted them, but it is not a promise.',
          'After updates and deletes, or once a table grows large, the order can change from one run to the next. If your app shows "the latest orders" without asking for an order, it might show old ones on a busy day, and nobody would know why.',
          'So the rule is simple: if the order matters, ask for it with ORDER BY. That is the only way to get a guaranteed order in SQL.',
          'ORDER BY goes at the end of the query, after WHERE. For example: SELECT name, price FROM products WHERE stock > 0 ORDER BY price. PostgreSQL first keeps the matching rows, then sorts them.',
          'In the lesson examples so far, some results came out in insert order just by luck. From today, whenever the order of the result matters, the examples use ORDER BY. That is the habit professional developers follow too.',
          'ORDER BY is also the last step PostgreSQL does before sending the result. It first finds the rows with FROM and WHERE, works out the columns in SELECT, and only then sorts. That is why you can sort by a name you gave with AS, even though that name does not exist in the table.'
        ],
        example: 'Imagine a stack of exam papers dropped on the floor and picked up again. Nobody would trust that they are still in roll number order. If the order matters, you sort them on purpose. A database table is that stack of papers: sort it when you need an order.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Pen', 10), ('Backpack', 1200), ('Notebook', 60), ('Desk lamp', 899);",
          "UPDATE products SET price = 12 WHERE name = 'Pen';",
          'SELECT name, price FROM products;',
          'SELECT name, price FROM products ORDER BY price;'
        ),
        output: lines(
          ' name      | price',
          '-----------+---------',
          ' Backpack  | 1200.00',
          ' Notebook  |   60.00',
          ' Desk lamp |  899.00',
          ' Pen       |   12.00',
          '(4 rows)',
          '',
          ' name      | price',
          '-----------+---------',
          ' Pen       |   12.00',
          ' Notebook  |   60.00',
          ' Desk lamp |  899.00',
          ' Backpack  | 1200.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'After an update, the changed row may move in the unsorted result.' },
          { line: 4, note: 'No ORDER BY: here the Pen has moved to the end.' },
          { line: 5, note: 'With ORDER BY price, the order is guaranteed: cheapest first.' }
        ],
        tryIt: 'Remove the UPDATE on line 3 and run again. The unsorted result changes, but the sorted one stays exactly the same.',
        check: {
          question: 'When is the order of rows guaranteed in a SELECT?',
          options: ['Only when the query has ORDER BY', 'Always, in the order rows were inserted', 'Always, in id order'],
          answer: 0,
          why: 'Without ORDER BY, PostgreSQL may return rows in any order. ORDER BY is the only guarantee.'
        }
      },
      {
        title: 'ORDER BY: ascending and descending',
        say: [
          'ORDER BY sorts by a column. By default it sorts from smallest to largest, which is called ascending, or ASC. For numbers that means cheapest first; for text it means A to Z; for dates it means oldest first.',
          'Add DESC after the column for descending order: largest first, Z to A, newest first. ORDER BY price DESC shows the most expensive products at the top, and ORDER BY ordered_on DESC shows the latest orders first.',
          'You can sort by a column that you do not show. SELECT name FROM products ORDER BY price is perfectly fine: the result shows only names, in price order.',
          'You can also sort by a calculation or by a name you gave with AS. For example, SELECT name, price * 1.18 AS with_gst FROM products ORDER BY with_gst. PostgreSQL works out the value for each row and sorts by it.',
          'Text is sorted using the database\'s language rules. In the lesson editor, capital and small letters are sorted by their character codes, which is why a word starting with a capital letter can come before a word starting with a small letter. Keeping text consistent, like always capitalising names, avoids surprises.'
        ],
        example: 'On a shopping app, "Price: low to high" is ORDER BY price ASC, and "Price: high to low" is ORDER BY price DESC. "Newest arrivals" is ORDER BY added_on DESC. Every sort button is one ORDER BY.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2), added_on date);',
          "INSERT INTO products VALUES ('Pen', 10, '2026-09-01'), ('Backpack', 1200, '2026-09-20'), ('Notebook', 60, '2026-09-10');",
          'SELECT name, price FROM products ORDER BY price DESC;',
          'SELECT name FROM products ORDER BY added_on DESC;',
          'SELECT name FROM products ORDER BY name;'
        ),
        output: lines(
          ' name     | price',
          '----------+---------',
          ' Backpack | 1200.00',
          ' Notebook |   60.00',
          ' Pen      |   10.00',
          '(3 rows)',
          '',
          ' name',
          '----------',
          ' Backpack',
          ' Notebook',
          ' Pen',
          '(3 rows)',
          '',
          ' name',
          '----------',
          ' Backpack',
          ' Notebook',
          ' Pen',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'DESC: most expensive first.' },
          { line: 4, note: 'Sorted by a column we do not show: newest first.' },
          { line: 5, note: 'Text in A to Z order (ASC is the default).' }
        ],
        tryIt: 'Change line 4 to show the oldest product first by removing DESC. Which product comes first now?',
        check: {
          question: 'Which query shows the newest orders first?',
          options: ['ORDER BY ordered_on DESC', 'ORDER BY ordered_on', 'ORDER BY ordered_on ASC'],
          answer: 0,
          why: 'Newer dates are larger, so descending order puts them first. ASC, the default, puts the oldest first.'
        }
      },
      {
        title: 'Sorting by more than one column',
        say: [
          'Often one column is not enough to decide the order. If several products have the same category, which comes first inside the category? You can give ORDER BY several columns, separated by commas.',
          'PostgreSQL sorts by the first column. Only when two rows have the same value there does it look at the second column, and so on. So ORDER BY category, price sorts by category A to Z, and inside each category, by price from cheapest.',
          'Each column has its own direction. ORDER BY category ASC, price DESC means categories A to Z, and inside each one, the most expensive first. The DESC only applies to the column right before it.',
          'Adding a final "tie-breaker" column, like the id, is a good professional habit. If two rows are equal on every sort column, their order is not guaranteed. Adding the id at the end makes the order completely fixed, which is important for pages, as you will see soon.',
          'Think of the sort columns as a list of questions: "first compare by this; if equal, compare by that". Writing it out in words before typing it helps avoid mistakes.'
        ],
        example: 'A school merit list is sorted by total marks, highest first. When two students have the same total, the school looks at their maths marks. If those are equal too, it uses the roll number. That is ORDER BY total DESC, maths DESC, roll_no.',
        code: lines(
          'CREATE TABLE products (id int, name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 'stationery', 10), (2, 'Headphones', 'electronics', 1499), (3, 'Stapler', 'stationery', 150),",
          "  (4, 'Phone stand', 'electronics', 299), (5, 'Notebook', 'stationery', 60), (6, 'Pencil', 'stationery', 10);",
          'SELECT category, name, price FROM products ORDER BY category, price DESC, id;'
        ),
        output: lines(
          ' category    | name        | price',
          '-------------+-------------+---------',
          ' electronics | Headphones  | 1499.00',
          ' electronics | Phone stand |  299.00',
          ' stationery  | Stapler     |  150.00',
          ' stationery  | Notebook    |   60.00',
          ' stationery  | Pen         |   10.00',
          ' stationery  | Pencil      |   10.00',
          '(6 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Category A to Z; inside it, most expensive first; for equal prices, by id.' }
        ],
        tryIt: 'Change ORDER BY to price, name and run it. Now Pen and Pencil (both 10) come first, in A to Z order.',
        check: {
          question: 'In ORDER BY city, name, when is name used?',
          options: ['Only to order rows that have the same city', 'First, before city', 'Never, only the first column counts'],
          answer: 0,
          why: 'The second column only breaks ties in the first. Rows with different cities are ordered by city alone.'
        }
      },
      {
        title: 'LIMIT: the top few rows',
        say: [
          'Very often you only want the first few rows of a sorted result: the 5 cheapest products, the 3 latest orders, the top 10 students. LIMIT does this. It goes at the very end of the query: ORDER BY price LIMIT 5.',
          'LIMIT without ORDER BY is almost always a bug. "Give me any 3 rows" is rarely a real question. Together, ORDER BY and LIMIT answer questions like "top 3" or "latest 10" correctly.',
          'LIMIT also protects your app. A query that could return a million rows might freeze a screen or use all the memory. Adding a sensible LIMIT keeps the result small, even if the table grows unexpectedly.',
          'Be careful with ties. If you ask for the top 3 prices and the 3rd and 4th products have the same price, LIMIT 3 cuts one of them off, and which one is not guaranteed unless you add a tie-breaker to ORDER BY. On Day 17 you will learn window functions, which handle "top N" with ties more carefully.',
          'You will also see FETCH FIRST 3 ROWS ONLY in some SQL. It is the official standard way of writing LIMIT 3. PostgreSQL understands both, and LIMIT is shorter.'
        ],
        example: 'A newspaper\'s "Top 5 stories of the day" list sorts all stories by how many people read them, then prints only the first five. Sorting is ORDER BY; printing only five is LIMIT.',
        code: lines(
          'CREATE TABLE products (id int, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Headphones', 1499), (2, 'Backpack', 1200), (3, 'Desk lamp', 899), (4, 'Water bottle', 350), (5, 'Phone stand', 299), (6, 'Pen', 10);",
          'SELECT name, price FROM products ORDER BY price DESC LIMIT 3;',
          'SELECT name FROM products ORDER BY price LIMIT 1;'
        ),
        output: lines(
          ' name       | price',
          '------------+---------',
          ' Headphones | 1499.00',
          ' Backpack   | 1200.00',
          ' Desk lamp  |  899.00',
          '(3 rows)',
          '',
          ' name',
          '------',
          ' Pen',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Sort most expensive first, then keep the first 3.' },
          { line: 4, note: 'The single cheapest product.' }
        ],
        tryIt: 'Write a query for the 2 cheapest products. Which ORDER BY direction do you need?',
        check: {
          question: 'Why use ORDER BY together with LIMIT?',
          options: ['Without ORDER BY, LIMIT returns an unpredictable set of rows', 'LIMIT only works after ORDER BY', 'ORDER BY makes LIMIT faster'],
          answer: 0,
          why: 'LIMIT keeps the first N rows of the result. Without an order, which rows are "first" is not guaranteed.'
        }
      },
      {
        title: 'OFFSET: pages of results',
        say: [
          'Apps rarely show hundreds of rows at once. They show pages: 10 products on page 1, the next 10 on page 2, and so on. OFFSET skips a number of rows before LIMIT starts counting.',
          'The formula is simple. With a page size of N, page P uses LIMIT N OFFSET (P - 1) times N. So with 10 per page, page 1 is OFFSET 0, page 2 is OFFSET 10, page 3 is OFFSET 20.',
          'Pages only work with a fixed, complete order. If two rows can swap places between one page and the next request, a product might appear on two pages, or be skipped. That is why you add a unique tie-breaker, like the id, at the end of ORDER BY.',
          'Asking for a page past the end is not an error. It simply returns no rows, which is how an app knows there are no more pages.',
          'OFFSET gets slower on very large tables, because PostgreSQL still has to count past all the skipped rows. Big apps sometimes use a different technique called keyset pagination: "give me the next 10 after id 12345". For most apps, and for this course, LIMIT with OFFSET is the right tool.'
        ],
        example: 'A book with 200 pages shows about 30 lines per page. To read page 3, you skip the first 60 lines and read the next 30. OFFSET 60 LIMIT 30 is page 3.',
        code: lines(
          'CREATE TABLE products (id int, name text);',
          "INSERT INTO products VALUES (1, 'Backpack'), (2, 'Desk lamp'), (3, 'Headphones'), (4, 'Notebook'), (5, 'Pen'), (6, 'Phone stand'), (7, 'Stapler');",
          'SELECT name FROM products ORDER BY name, id LIMIT 3 OFFSET 0;',
          'SELECT name FROM products ORDER BY name, id LIMIT 3 OFFSET 3;',
          'SELECT name FROM products ORDER BY name, id LIMIT 3 OFFSET 6;',
          'SELECT name FROM products ORDER BY name, id LIMIT 3 OFFSET 9;'
        ),
        output: lines(
          ' name',
          '------------',
          ' Backpack',
          ' Desk lamp',
          ' Headphones',
          '(3 rows)',
          '',
          ' name',
          '-------------',
          ' Notebook',
          ' Pen',
          ' Phone stand',
          '(3 rows)',
          '',
          ' name',
          '---------',
          ' Stapler',
          '(1 row)',
          '',
          ' name',
          '------',
          '(0 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Page 1: skip 0, show 3.' },
          { line: 4, note: 'Page 2: skip 3, show 3.' },
          { line: 5, note: 'Page 3 has only one product left.' },
          { line: 6, note: 'Past the end: no rows, no error.' }
        ],
        tryIt: 'Change the page size to 4: use LIMIT 4 with OFFSET 0 and OFFSET 4. How many pages do the 7 products fill now?',
        check: {
          question: 'With 20 items per page, what OFFSET gives page 3?',
          options: ['40', '60', '3'],
          answer: 0,
          why: 'Page 3 skips pages 1 and 2: (3 - 1) x 20 = 40 rows.'
        }
      },
      {
        title: 'Putting it together: a catalogue with pages',
        say: [
          'Let us build the query behind a shop\'s catalogue page. The user picks "in stock only", sorts by price from low to high, and moves to page 2, with 3 products per page.',
          'In SQL, each choice becomes one part of the query. The filter goes in WHERE. The sort goes in ORDER BY, with the id as a tie-breaker. The page number becomes LIMIT and OFFSET. The order of the parts is always the same: SELECT, FROM, WHERE, ORDER BY, LIMIT, OFFSET.',
          'Also notice NULLS LAST. When a column can be NULL, PostgreSQL puts NULLs at the end when sorting ascending, and at the start when descending. NULLS FIRST or NULLS LAST lets you choose. A product with an unknown price should usually go at the end, whichever way the user sorts.',
          'In today\'s practice you will find the 3 most expensive products, and page 2 of the catalogue sorted by name. Both are exactly the patterns from this lesson.',
          'Tomorrow you learn functions: changing capital letters, rounding money, and working with dates, all inside a query.'
        ],
        example: 'Every time you tap "Next page" on a shopping site, the app runs the same query again with a bigger OFFSET. The filter and the sort stay the same; only the page changes.',
        code: lines(
          'CREATE TABLE products (id int, name text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES (1, 'Notebook', 60, 120), (2, 'Pen', 10, 500), (3, 'Backpack', 1200, 15), (4, 'Water bottle', 350, 40),",
          "  (5, 'Desk lamp', 899, 0), (6, 'Headphones', 1499, 25), (7, 'Phone stand', 299, 60), (8, 'Mystery box', NULL, 5);",
          'SELECT name, price',
          'FROM products',
          'WHERE stock > 0',
          'ORDER BY price NULLS LAST, id',
          'LIMIT 3 OFFSET 3;'
        ),
        output: lines(
          ' name         | price',
          '--------------+---------',
          ' Water bottle |  350.00',
          ' Backpack     | 1200.00',
          ' Headphones   | 1499.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'The filter: in stock only (the Desk lamp is left out).' },
          { line: 7, note: 'Cheapest first; the product with no price goes last; id breaks ties.' },
          { line: 8, note: 'Page 2, with 3 per page.' }
        ],
        tryIt: 'Change OFFSET 3 to OFFSET 6 to see page 3. The Mystery box, with no price, appears there, at the very end.',
        check: {
          question: 'What is the correct order of these parts in a query?',
          options: ['WHERE, then ORDER BY, then LIMIT', 'LIMIT, then WHERE, then ORDER BY', 'ORDER BY, then WHERE, then LIMIT'],
          answer: 0,
          why: 'SQL always follows SELECT, FROM, WHERE, ORDER BY, LIMIT, OFFSET: filter first, then sort, then cut.'
        }
      }
    ],
    summary: [
      'Without ORDER BY, the order of rows is not guaranteed.',
      'ORDER BY column sorts ascending (ASC); add DESC for largest, newest or Z first.',
      'Several columns: the next column only breaks ties. Add the id as a final tie-breaker.',
      'LIMIT N keeps the first N rows; always use it with ORDER BY.',
      'Page P of size N: LIMIT N OFFSET (P - 1) x N. NULLS LAST puts unknown values at the end.'
    ],
    projectStep: {
      title: 'My Library: sorted lists and pages',
      steps: [
        'List your books sorted by author, and by title inside each author.',
        'Show your 3 longest books with ORDER BY pages DESC LIMIT 3.',
        'Show page 2 of your books, 2 per page, sorted by title and then id.',
        'Show unfinished books first: ORDER BY finished, title.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 7,
    title: 'Useful Functions for Text, Numbers and Dates',
    goal: 'You can use built-in functions to clean and format text, round and calculate numbers, and work with dates inside a query.',
    minutes: 28,
    recap: 'Yesterday you sorted results with ORDER BY, took the top rows with LIMIT, and made pages with OFFSET.',
    parts: [
      {
        title: 'What a function is in SQL',
        say: [
          'A function takes one or more values and gives back a new value. You have already met one: count(*). Today you meet the everyday functions that clean, format and calculate data inside a query.',
          'You call a function by writing its name and putting the values in brackets: upper(name), round(price, 2). The function runs once for every row, and its result appears as a new column.',
          'Functions never change the data stored in the table. SELECT upper(name) FROM customers shows names in capitals, but the table still holds them as they were. To change the stored data, you would use the function inside an UPDATE, like UPDATE customers SET name = upper(name).',
          'Always give a function\'s result a clear name with AS. Without it, PostgreSQL uses the function\'s name, like upper or round, which is confusing when you have several.',
          'You can put functions inside each other, like round(avg(price), 2). PostgreSQL works from the inside out: first the average, then the rounding. You will see many examples of this today.'
        ],
        example: 'A function is like a machine at a juice shop: you put in oranges, it gives back juice. The oranges in the basket are not changed; the machine just produces something new from them. upper(name) produces a capitalised copy of each name.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('asha', 'pune'), ('Ravi', 'Mumbai');",
          'SELECT name, upper(name) AS shout, length(name) AS letters FROM customers;',
          'SELECT name FROM customers;'
        ),
        output: lines(
          ' name | shout | letters',
          '------+-------+---------',
          ' asha | ASHA  |       4',
          ' Ravi | RAVI  |       4',
          '(2 rows)',
          '',
          ' name',
          '------',
          ' asha',
          ' Ravi',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Two functions, each with its own column name.' },
          { line: 4, note: 'The stored names did not change.' }
        ],
        tryIt: 'Add lower(city) AS city_small to line 3 and run it.',
        check: {
          question: 'Does SELECT upper(name) FROM customers change the names stored in the table?',
          options: ['No, it only shows them in capitals', 'Yes, it changes them permanently', 'Only the first row'],
          answer: 0,
          why: 'SELECT only reads. To store the change, you would need UPDATE customers SET name = upper(name).'
        }
      },
      {
        title: 'Text functions',
        say: [
          'upper and lower change capital letters. initcap makes the first letter of each word a capital, which is handy for cleaning up names that users typed in any style.',
          'trim removes spaces at the start and the end. length counts the characters. These two help you clean and check data, for example finding names that are empty after trimming.',
          'To join text, use two vertical bars: first_name || \' \' || last_name. This is called concatenation. If any part is NULL, the whole result becomes NULL. The function concat does the same job but treats NULL as empty text, which is often safer.',
          'substring takes part of a text, and replace swaps one piece of text for another. For example, replace(phone, \' \', \'\') removes the spaces from a phone number. left(text, n) and right(text, n) take the first or last few characters.',
          'These functions are especially useful for cleaning messy data before saving it, and for building readable labels in reports, like "Asha (Pune)".',
          'A small warning about length: it counts characters, not bytes, so a name in Hindi or Tamil is counted correctly letter by letter. That matters in India, where apps often store names in several scripts. PostgreSQL handles them all as text, and the same functions work on them.'
        ],
        example: 'When a college prints ID cards, a clerk tidies each student\'s name: removes extra spaces, fixes the capital letters, and joins first and last names. Text functions do that tidying for thousands of names at once.',
        code: lines(
          'CREATE TABLE customers (first_name text, last_name text, city text, phone text);',
          "INSERT INTO customers VALUES ('  asha', 'RAO ', 'pune', '98765 43210'), ('ravi', 'kumar', NULL, '91234 56789');",
          'SELECT initcap(trim(first_name)) || \' \' || initcap(trim(last_name)) AS full_name,',
          '       concat(initcap(city), \'!\') AS city_label,',
          '       initcap(city) || \'!\' AS joined_with_bars,',
          "       replace(phone, ' ', '') AS phone_clean,",
          '       right(phone, 4) AS last_four',
          'FROM customers;'
        ),
        output: lines(
          ' full_name  | city_label | joined_with_bars | phone_clean | last_four',
          '------------+------------+------------------+-------------+-----------',
          ' Asha Rao   | Pune!      | Pune!            | 9876543210  | 3210',
          ' Ravi Kumar | !          | NULL             | 9123456789  | 6789',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Trim spaces, fix capitals, and join with a space in between.' },
          { line: 4, note: 'concat treats a NULL city as empty text.' },
          { line: 5, note: 'With ||, a NULL part makes the whole result NULL.' },
          { line: 7, note: 'The last 4 characters, like a bank app shows.' }
        ],
        tryIt: 'Add length(trim(first_name)) AS name_length to the query. Both names have 4 letters once the spaces are trimmed.',
        check: {
          question: "What is 'Hello ' || NULL?",
          options: ['NULL', "'Hello '", 'An error'],
          answer: 0,
          why: 'Joining anything with NULL using || gives NULL. Use concat() if you want NULL treated as empty text.'
        }
      },
      {
        title: 'Numbers: maths and rounding',
        say: [
          'SQL does maths with +, -, * and /. One trap: dividing two whole numbers gives a whole number, just like floor division. 7 / 2 is 3, not 3.5. If you want the decimal answer, make one side a decimal: 7 / 2.0, or 7::numeric / 2.',
          'The double colon :: is PostgreSQL\'s way of converting a value to another type, called a cast. 7::numeric turns the whole number 7 into an exact decimal. You will see casts often, for example \'2026-09-28\'::date.',
          'round(value, 2) rounds to 2 decimal places, which is what you want for money. round(value) with no second number rounds to a whole number. ceil rounds up and floor rounds down.',
          'The remainder of a division uses %: 17 % 5 is 2. And abs gives the size of a number without its sign, so abs(-250) is 250.',
          'Finally, coalesce(value, default) replaces NULL with a value you choose. coalesce(discount, 0) treats a missing discount as zero, so the maths works instead of producing NULL. It is one of the most used functions in real queries.',
          'Be careful when you cast text to a number. \'42\'::int works, but \'abc\'::int gives an error and stops the query. If data might be messy, clean it first with trim and check it, rather than casting everything and hoping. On Day 21 you will learn CHECK rules that stop messy values from being stored at all.'
        ],
        example: 'When a restaurant bill is split between 3 friends, the calculator shows 333.3333, and the cashier rounds it to 333.33. round does the same in SQL. And if a coupon box is empty, the cashier treats the discount as zero, which is coalesce.',
        code: lines(
          'SELECT 7 / 2 AS whole, 7 / 2.0 AS decimal, 7::numeric / 2 AS cast_first;',
          'SELECT round(1000 / 3.0, 2) AS share, ceil(4.1) AS up, floor(4.9) AS down, 17 % 5 AS remainder;',
          'CREATE TABLE items (name text, price numeric(10,2), discount numeric(10,2));',
          "INSERT INTO items VALUES ('Pen', 10, 2), ('Notebook', 60, NULL);",
          'SELECT name, price - discount AS plain, price - coalesce(discount, 0) AS safe FROM items;'
        ),
        output: lines(
          ' whole | decimal            | cast_first',
          '-------+--------------------+--------------------',
          '     3 | 3.5000000000000000 | 3.5000000000000000',
          '(1 row)',
          '',
          ' share  | up | down | remainder',
          '--------+----+------+-----------',
          ' 333.33 |  5 |    4 |         2',
          '(1 row)',
          '',
          ' name     | plain | safe',
          '----------+-------+-------',
          ' Pen      |  8.00 |  8.00',
          ' Notebook |  NULL | 60.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'Whole numbers divide to a whole number. Make one side a decimal for 3.5.' },
          { line: 2, note: 'round to 2 places for money; ceil up, floor down; % gives the remainder.' },
          { line: 5, note: 'A NULL discount makes the plain result NULL. coalesce treats it as 0.' }
        ],
        tryIt: 'Wrap the decimal on line 1 in round(..., 2) to show 3.50. Then try round(7 / 2.0) with no second number.',
        check: {
          question: 'What does coalesce(discount, 0) do?',
          options: ['Uses 0 when discount is NULL, otherwise the discount', 'Sets every discount to 0', 'Removes rows with no discount'],
          answer: 0,
          why: 'coalesce returns the first value that is not NULL, so a missing discount becomes 0.'
        }
      },
      {
        title: 'Dates: today, differences and parts',
        say: [
          'PostgreSQL is very good with dates. current_date is today\'s date, and now() is the current date and time. Because these change every day, the examples use fixed dates, so the output is always the same.',
          'Subtracting two dates gives the number of days between them: date \'2026-09-30\' - date \'2026-09-01\' is 29. Adding a number of days to a date gives a new date. For months and years, add an interval: order_date + interval \'1 month\'.',
          'extract pulls one part out of a date: extract(year from joined_on), extract(month from joined_on), extract(dow from day) for the day of the week, where 0 is Sunday. These are useful for grouping, like "customers per joining month".',
          'date_trunc rounds a date or time down to the start of a period: date_trunc(\'month\', ordered_on) turns any day in September into 1 September. That makes monthly reports easy, as you will see on Day 9.',
          'Dates can also be compared and sorted, as you did on Day 4. Remember to write dates as year-month-day, and to add ::date or the word date before the text when PostgreSQL needs to know it is a date.',
          'One more useful function is age. age(date \'2026-09-28\', date \'2004-08-15\') returns the difference as years, months and days, like 22 years 1 mon 13 days. It is handy for things like a customer\'s age or how long someone has been a member. For a simple number of days, subtracting dates is clearer.'
        ],
        example: 'A library\'s due-date stamp is date maths: the book was borrowed on the 1st, the loan is 14 days, so it is due on the 15th. If you return it on the 20th, the fine is for 5 days late. Subtracting dates gives exactly that 5.',
        code: lines(
          "SELECT date '2026-09-30' - date '2026-09-01' AS days_between,",
          "       date '2026-09-28' + 14 AS due_date,",
          "       date '2026-01-31' + interval '1 month' AS one_month_later;",
          "SELECT extract(year from date '2026-09-28') AS year,",
          "       extract(month from date '2026-09-28') AS month,",
          "       date_trunc('month', date '2026-09-28')::date AS month_start;"
        ),
        output: lines(
          ' days_between | due_date   | one_month_later',
          '--------------+------------+---------------------',
          '           29 | 2026-10-12 | 2026-02-28 00:00:00',
          '(1 row)',
          '',
          ' year | month | month_start',
          '------+-------+-------------',
          ' 2026 |     9 | 2026-09-01',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'Date minus date gives a number of days.' },
          { line: 2, note: 'Date plus a number of days gives a date.' },
          { line: 3, note: 'Adding a month to 31 January gives the last day of February, with a time part.' },
          { line: 6, note: 'The start of the month, turned back into a plain date with ::date.' }
        ],
        tryIt: "Work out how many days are left until 1 January 2027 from 28 September 2026: date '2027-01-01' - date '2026-09-28'.",
        check: {
          question: "What is date '2026-09-10' - date '2026-09-01'?",
          options: ['9', '10', "'9 days'"],
          answer: 0,
          why: 'Subtracting two dates gives the whole number of days between them: 10 - 1 = 9.'
        }
      },
      {
        title: 'Formatting dates and numbers for people',
        say: [
          'Databases store dates as year-month-day, but people often prefer "28 Sep 2026". to_char turns a date or number into text using a pattern. to_char(ordered_on, \'DD Mon YYYY\') gives 28 Sep 2026.',
          'The pattern letters are codes: DD is the day, Mon is the short month name, Month is the full name, YYYY is the year, and Day is the weekday. Adding FM in front, like FMDay, removes the padding spaces PostgreSQL otherwise adds.',
          'to_char also formats numbers: to_char(1250000, \'FM99,99,999\') places commas the way you choose. Many apps, though, format numbers in the app itself, because different users may want different styles.',
          'A good rule: keep the stored data in its proper type, and format it only when you show it. Store dates as date, money as numeric. If you store "28 Sep 2026" as text, you can no longer sort by date or do date maths.',
          'Formatting is the last step of a query, used for reports and exports. For anything an app will calculate with, return the real date or number and let the app format it.'
        ],
        example: 'A bank stores the transaction date in a strict computer format, but your printed passbook shows "28 Sep 2026". The data is the same; only its appearance changes for the reader.',
        code: lines(
          "SELECT to_char(date '2026-09-28', 'DD Mon YYYY') AS short_date,",
          "       to_char(date '2026-09-28', 'FMDay, DD FMMonth') AS long_date,",
          "       to_char(1250000, 'FM99,99,999') AS indian_commas;"
        ),
        output: lines(
          ' short_date  | long_date            | indian_commas',
          '-------------+----------------------+---------------',
          ' 28 Sep 2026 | Monday, 28 September | 12,50,000',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'DD day, Mon short month, YYYY year.' },
          { line: 2, note: 'FM removes padding; Day and Month give full names.' },
          { line: 3, note: 'Commas placed in the Indian lakh style by the pattern.' }
        ],
        tryIt: "Change the first pattern to 'DD/MM/YYYY' and run it. Then try 'YYYY-MM' to show just the year and month.",
        check: {
          question: 'Why store a date as date instead of text like "28 Sep 2026"?',
          options: ['So you can sort, compare and do date maths correctly', 'Text takes too much space', 'PostgreSQL cannot store text'],
          answer: 0,
          why: 'A real date sorts and calculates correctly. Format it with to_char only when you show it.'
        }
      },
      {
        title: 'Putting it together: an invoice view of products',
        say: [
          'Let us use today\'s functions to build a small invoice-style listing: product names in capitals, the price with 18% GST rounded to 2 decimals, a readable label, and how many days ago each product was added.',
          'Each column uses one or two functions, and each gets a clear name with AS. The result is a table a shop manager could read directly, without any extra processing.',
          'Notice that nothing in the table was changed. All the formatting happens in the SELECT. The original prices and dates are still stored in their proper types, ready for maths and sorting.',
          'In today\'s practice, you will show product names in capitals with the price including GST, and work out how many days before a fixed date each order was placed. Both use exactly the functions from this lesson.',
          'Tomorrow, you learn aggregate functions: count, sum, avg, min and max. They work on many rows at once to give totals and averages, which is where reports really begin.'
        ],
        example: 'A printed invoice takes plain stored data and dresses it up: names in capitals, money with 2 decimals, tax added, and dates in a friendly format. The accountant\'s records underneath stay exactly as they were.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2), added_on date);',
          "INSERT INTO products VALUES ('Pen', 10, '2026-09-25'), ('Headphones', 1499, '2026-09-01');",
          'SELECT upper(name) AS item,',
          '       round(price * 1.18, 2) AS price_with_gst,',
          "       name || ' (Rs ' || price || ')' AS label,",
          "       date '2026-09-28' - added_on AS days_listed",
          'FROM products',
          'ORDER BY days_listed DESC;'
        ),
        output: lines(
          ' item       | price_with_gst | label                   | days_listed',
          '------------+----------------+-------------------------+-------------',
          ' HEADPHONES |        1768.82 | Headphones (Rs 1499.00) |          27',
          ' PEN        |          11.80 | Pen (Rs 10.00)          |           3',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Price plus 18% GST, rounded for money.' },
          { line: 5, note: 'Join text and the price into one readable label.' },
          { line: 6, note: 'Days between a fixed date and when the product was added.' }
        ],
        tryIt: 'Add a fifth column that shows the added date as text with to_char(added_on, \'DD Mon\') AS listed_on.',
        check: {
          question: 'What does round(price * 1.18, 2) give for a price of 10?',
          options: ['11.80', '11.8000', '12'],
          answer: 0,
          why: '10 x 1.18 = 11.8, and rounding to 2 decimal places shows it as 11.80.'
        }
      }
    ],
    summary: [
      'Functions work on each row and return a new value; they never change stored data.',
      'Text: upper, lower, initcap, trim, length, replace, left, right; join with || or concat.',
      'Numbers: whole-number division drops decimals; use 2.0 or ::numeric; round, ceil, floor, %.',
      'coalesce(value, default) replaces NULL with a value you choose.',
      'Dates: subtract for days, + interval for months, extract, date_trunc, and to_char for display.'
    ],
    projectStep: {
      title: 'My Library: labels and dates',
      steps: [
        "Add a started_on date column to your books and fill it in for a few books.",
        "Show each book as a label: title || ' by ' || coalesce(author, 'unknown').",
        'Show how many days ago you started each book, using a fixed date for today.',
        "Show started_on formatted as 'DD Mon YYYY' with to_char."
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 8,
    title: 'Counting and Totals: COUNT, SUM, AVG, MIN, MAX',
    goal: 'You can turn many rows into one answer with count, sum, avg, min and max, and handle NULL in totals correctly.',
    minutes: 28,
    recap: 'Yesterday you used functions to format text, round numbers and work with dates.',
    parts: [
      {
        title: 'Aggregate functions: many rows, one answer',
        say: [
          'The functions from yesterday work on one row at a time. Today\'s functions are different: they look at many rows and give back one answer. They are called aggregate functions, and they are the heart of every report.',
          'There are five you will use all the time. count counts rows. sum adds up values. avg calculates the average. min finds the smallest value and max the largest.',
          'SELECT count(*) FROM products returns a single row with a single number: how many products there are. SELECT sum(stock) FROM products returns the total units in stock across all products.',
          'You can use several aggregates in one query: SELECT count(*), min(price), max(price), avg(price) FROM products gives four facts about the catalogue in one row. Give each one a clear name with AS.',
          'Aggregates also work with WHERE. The WHERE runs first and keeps only the matching rows, and then the aggregate works on those. So SELECT count(*) FROM orders WHERE status = \'delivered\' counts only delivered orders.',
          'Aggregates are also very fast compared with doing the same work in an app. If you loaded every order into Python or JavaScript just to add them up, you would send thousands of rows over the network. Asking PostgreSQL for sum(total) sends back a single number. A good rule is to let the database do the counting and adding, and send only the answer to the app.'
        ],
        example: 'At the end of a cricket match, nobody reads out every ball. The scoreboard shows totals: runs, wickets, the highest score. Aggregate functions turn the ball-by-ball data into the scoreboard.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Backpack', 'bags', 1200, 15), ('Headphones', 'electronics', 1499, 25);",
          'SELECT count(*) AS products, sum(stock) AS units, min(price) AS cheapest, max(price) AS dearest FROM products;',
          "SELECT count(*) AS stationery_items FROM products WHERE category = 'stationery';"
        ),
        output: lines(
          ' products | units | cheapest | dearest',
          '----------+-------+----------+---------',
          '        4 |   660 |    10.00 | 1499.00',
          '(1 row)',
          '',
          ' stationery_items',
          '------------------',
          '                2',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Four answers about all products, in one row.' },
          { line: 4, note: 'WHERE runs first, then count counts the matching rows.' }
        ],
        tryIt: 'Add a query that shows the total value of all stock: sum(price * stock) AS stock_value. It should be 70,375.00.',
        check: {
          question: 'How many rows does SELECT sum(stock) FROM products return?',
          options: ['One row', 'One row per product', 'None'],
          answer: 0,
          why: 'An aggregate without GROUP BY turns all the rows into a single answer row.'
        }
      },
      {
        title: 'COUNT(*) and COUNT(column)',
        say: [
          'count comes in two forms, and the difference matters. count(*) counts rows, all of them. count(column) counts only the rows where that column is not NULL.',
          'So in a customers table where one customer has no city, count(*) might be 5 while count(city) is 4. Both are correct; they answer different questions: "how many customers?" and "how many customers told us their city?".',
          'count(DISTINCT column) counts the different values, ignoring duplicates and NULLs. count(DISTINCT city) answers "how many different cities do our customers live in?".',
          'Choosing the right count is a common source of subtle report bugs. If a manager asks "how many orders have a delivery date?", count(*) would be wrong; count(delivered_on) is right.',
          'On Day 12 you will see count(column) used with LEFT JOIN to count zero correctly, which is one of the most useful patterns in SQL.',
          'Which one should you use by default? For "how many rows", count(*) is the clearest and the fastest to read. Use count(column) only when you really mean "rows where this column has a value", and add a comment if the difference matters, so the next person reading the query does not change it by mistake.'
        ],
        example: 'In a class of 40, count(*) is 40 students. count(phone) is the number who gave a phone number, say 36. count(DISTINCT city) is how many different cities they come from, maybe 5.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai'), ('Priya', 'Pune'), ('Karan', 'Delhi'), ('Meera', NULL);",
          'SELECT count(*) AS customers, count(city) AS with_city, count(DISTINCT city) AS different_cities FROM customers;'
        ),
        output: lines(
          ' customers | with_city | different_cities',
          '-----------+-----------+------------------',
          '         5 |         4 |                3',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'All rows; rows with a city; different cities (Pune counted once).' }
        ],
        tryIt: "Add a sixth customer with city 'Mumbai' and run it. Which of the three numbers change?",
        check: {
          question: 'A table has 10 rows, and 3 of them have NULL in email. What is count(email)?',
          options: ['7', '10', '3'],
          answer: 0,
          why: 'count(column) skips NULL values, so only the 7 rows with an email are counted.'
        }
      },
      {
        title: 'SUM and AVG, and how they treat NULL',
        say: [
          'sum adds up a column and avg gives its average. Both skip NULL values completely. That is usually what you want, but you must know it.',
          'Imagine 4 products, one with an unknown price. avg(price) averages only the 3 known prices. It does not treat the unknown price as zero. If you wanted zero, you would write avg(coalesce(price, 0)), which gives a different, lower answer.',
          'If every value is NULL, or there are no rows at all, sum returns NULL, not 0. A report showing an empty total instead of 0 looks broken, so wrap it: coalesce(sum(amount), 0).',
          'The average of numbers usually has many decimals. PostgreSQL shows them all, which is not friendly. Wrap it: round(avg(price), 2).',
          'You can also sum and average calculations, like sum(price * quantity) for the total value of an order, or avg(date \'2026-09-30\' - ordered_on) for the average age of orders in days.',
          'Averages can mislead. If nine products cost about 100 rupees and one costs 50,000, the average is over 5,000, which describes none of the products well. For prices and salaries, analysts often look at the median, the middle value, as well. PostgreSQL can calculate it with percentile_cont(0.5) WITHIN GROUP (ORDER BY price), but for now it is enough to know that the average is not the whole story.'
        ],
        example: 'If three friends tell you their marks and one refuses, the class average you calculate is based on three people, not four with a zero. SQL does the same: an unknown value is left out, not counted as zero.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Pen', 10), ('Notebook', 60), ('Stapler', 150), ('Mystery box', NULL);",
          'SELECT avg(price) AS raw_average, round(avg(price), 2) AS average, round(avg(coalesce(price, 0)), 2) AS unknown_as_zero FROM products;',
          "SELECT sum(price) AS plain_sum, coalesce(sum(price), 0) AS safe_sum FROM products WHERE name = 'Nothing';"
        ),
        output: lines(
          ' raw_average         | average | unknown_as_zero',
          '---------------------+---------+-----------------',
          ' 73.3333333333333333 |   73.33 |           55.00',
          '(1 row)',
          '',
          ' plain_sum | safe_sum',
          '-----------+----------',
          '      NULL |        0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'avg skips the NULL: (10 + 60 + 150) / 3. Treating it as 0 divides by 4 instead.' },
          { line: 4, note: 'No matching rows: sum is NULL; coalesce turns it into 0.' }
        ],
        tryIt: 'Add sum(price) AS total to line 3. Is the Mystery box counted?',
        check: {
          question: 'What does avg(price) do with rows where price is NULL?',
          options: ['Leaves them out of the average', 'Counts them as 0', 'Returns NULL for the whole average'],
          answer: 0,
          why: 'Aggregates like avg and sum skip NULL values. Use coalesce if you want them counted as 0.'
        }
      },
      {
        title: 'MIN and MAX on numbers, text and dates',
        say: [
          'min and max find the smallest and largest value in a column. They work on numbers, as you would expect, but also on dates and text.',
          'On dates, min gives the earliest and max the latest. SELECT max(ordered_on) FROM orders answers "when was the last order?", a question every shop owner asks.',
          'On text, min and max use alphabetical order: min(name) is the name that would come first in A to Z order.',
          'A common beginner question is: "how do I get the name of the most expensive product?". SELECT name, max(price) FROM products gives an error, because max returns one row while name has many. The simple answer uses what you learned on Day 6: ORDER BY price DESC LIMIT 1. On Day 15 you will see another way with a subquery.',
          'min and max also skip NULL values, like the other aggregates.',
          'min and max are also a quick way to check data quality. If max(price) is 99,99,999 or min(ordered_on) is in the year 1900, something was typed wrong or loaded badly. Running a few min and max queries on a new table is a simple habit that finds problems before they reach a report.'
        ],
        example: 'On a train timetable, min(departure) is the first train of the day and max(departure) the last. You do not need to read the whole timetable to find them.',
        code: lines(
          'CREATE TABLE orders (id int, customer text, ordered_on date, total numeric(10,2));',
          "INSERT INTO orders VALUES (1, 'Ravi', '2026-09-03', 1200), (2, 'Asha', '2026-09-25', 50), (3, 'Priya', '2026-09-12', 760);",
          'SELECT min(ordered_on) AS first_order, max(ordered_on) AS last_order, min(customer) AS first_name_a_to_z FROM orders;',
          'SELECT customer, total FROM orders ORDER BY total DESC LIMIT 1;',
          'SELECT customer, max(total) FROM orders;'
        ),
        output: lines(
          ' first_order | last_order | first_name_a_to_z',
          '-------------+------------+-------------------',
          ' 2026-09-03  | 2026-09-25 | Asha',
          '(1 row)',
          '',
          ' customer | total',
          '----------+---------',
          ' Ravi     | 1200.00',
          '(1 row)',
          '',
          '[Error] column "orders.customer" must appear in the GROUP BY clause or be used in an aggregate function'
        ),
        codeNotes: [
          { line: 3, note: 'Earliest and latest dates, and the first name in A to Z order.' },
          { line: 4, note: 'The right way to find who placed the biggest order.' },
          { line: 5, note: 'This mixes one-per-row values with one-for-all: PostgreSQL refuses.' }
        ],
        tryIt: 'Fix line 5 by adding GROUP BY customer at the end, and run it again. Now it shows each customer\'s biggest order.',
        check: {
          question: 'How do you find the name of the most expensive product?',
          options: ['SELECT name FROM products ORDER BY price DESC LIMIT 1', 'SELECT name, max(price) FROM products', 'SELECT max(name) FROM products'],
          answer: 0,
          why: 'Sorting and taking the first row returns the whole row. Mixing name with max(price) is an error, and max(name) is just the last name in A to Z order.'
        }
      },
      {
        title: 'Aggregates with WHERE and calculations',
        say: [
          'Most real reports combine a filter with aggregates. "Total sales in September", "average order value for delivered orders", "number of products under 100 rupees". The WHERE picks the rows, the aggregate summarises them.',
          'Remember the order in which PostgreSQL works: FROM picks the table, WHERE filters the rows, and only then are the aggregates calculated. So a WHERE cannot use an aggregate like WHERE count(*) > 5. Filtering on aggregates needs HAVING, which you will learn tomorrow.',
          'Calculations inside aggregates are very common: sum(price * quantity) gives the total value, and avg(price * 1.18) gives the average price including GST.',
          'You can also count only some rows inside one query with FILTER: count(*) FILTER (WHERE status = \'delivered\'). This lets you put several counts side by side in a single row, which makes compact summary reports.',
          'Always sanity-check totals. If a report says the average order is 5 crore rupees, something is wrong, maybe a missing WHERE or a unit mistake. Developers who double-check numbers are trusted.',
          'When a total looks wrong, break it down. Count the rows first, then look at the biggest few with ORDER BY and LIMIT, then check the WHERE. Most wrong totals come from counting rows you did not mean to include, such as cancelled orders or test data, rather than from the maths itself.'
        ],
        example: 'A shop owner asks: "In September, how many orders did we deliver, and what was the total value?". You first pick September\'s delivered orders, then count and add them up. WHERE is the picking; count and sum are the adding up.',
        code: lines(
          'CREATE TABLE orders (id int, status text, ordered_on date, total numeric(10,2));',
          "INSERT INTO orders VALUES (1, 'delivered', '2026-09-01', 280), (2, 'delivered', '2026-09-03', 1200), (3, 'shipped', '2026-09-10', 2097),",
          "  (4, 'delivered', '2026-09-12', 760), (5, 'cancelled', '2026-09-20', 899), (6, 'delivered', '2026-10-02', 450);",
          'SELECT count(*) AS delivered_orders, sum(total) AS delivered_value, round(avg(total), 2) AS average_value',
          'FROM orders',
          "WHERE status = 'delivered' AND ordered_on >= '2026-09-01' AND ordered_on < '2026-10-01';",
          "SELECT count(*) AS all_orders, count(*) FILTER (WHERE status = 'cancelled') AS cancelled FROM orders;"
        ),
        output: lines(
          ' delivered_orders | delivered_value | average_value',
          '------------------+-----------------+---------------',
          '                3 |         2240.00 |        746.67',
          '(1 row)',
          '',
          ' all_orders | cancelled',
          '------------+-----------',
          '          6 |         1',
          '(1 row)'
        ),
        codeNotes: [
          { line: 6, note: 'First keep September\'s delivered orders...' },
          { line: 4, note: '...then count, add and average them.' },
          { line: 7, note: 'FILTER counts only some rows, next to the total count.' }
        ],
        tryIt: "Add a third column to line 7: count(*) FILTER (WHERE status = 'delivered') AS delivered. It should be 4.",
        check: {
          question: 'Why can you not write WHERE count(*) > 5?',
          options: ['WHERE runs before aggregates are calculated', 'count cannot compare numbers', 'You need two WHERE clauses'],
          answer: 0,
          why: 'WHERE filters individual rows first. To filter on an aggregate result you use HAVING, which you learn tomorrow.'
        }
      },
      {
        title: 'Putting it together: the catalogue in numbers',
        say: [
          'Let us write a one-row summary of the shop\'s catalogue, the kind of numbers a manager checks every morning: how many products, the cheapest and dearest, the average price, and the total units in stock.',
          'Every column is one aggregate, some wrapped in round for readable money, and each one has a clear name. The result is a single row: the shop in numbers.',
          'Notice that the summary query has no GROUP BY, so it returns exactly one row, however many products there are. That makes it perfect for the tiles at the top of a dashboard: each tile reads one column of this one row.',
          'Then we add a second query with FILTER to count products by stock level: out of stock, low stock and plenty. These small summaries are what dashboards are built from.',
          'In today\'s practice, you will write a one-row catalogue summary with count, min and max, and another with the total stock and the average price rounded to 2 decimals.',
          'Tomorrow you learn GROUP BY: instead of one summary for the whole table, one summary per group, like per category or per month. That is where reports become really powerful.'
        ],
        example: 'A shop\'s morning dashboard is just a handful of numbers: products, stock, prices. Each number is one aggregate query, and together they tell the owner how the shop is doing at a glance.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 60, 120), ('Pen', 10, 500), ('Backpack', 1200, 15), ('Water bottle', 350, 40),",
          "  ('Desk lamp', 899, 0), ('Headphones', 1499, 25), ('Phone stand', 299, 60), ('Stapler', 150, 30);",
          'SELECT count(*) AS products, min(price) AS lowest, max(price) AS highest,',
          '       round(avg(price), 2) AS avg_price, sum(stock) AS total_stock',
          'FROM products;',
          'SELECT count(*) FILTER (WHERE stock = 0) AS out_of_stock,',
          '       count(*) FILTER (WHERE stock BETWEEN 1 AND 30) AS low_stock,',
          '       count(*) FILTER (WHERE stock > 30) AS plenty',
          'FROM products;'
        ),
        output: lines(
          ' products | lowest | highest | avg_price | total_stock',
          '----------+--------+---------+-----------+-------------',
          '        8 |  10.00 | 1499.00 |    558.38 |         790',
          '(1 row)',
          '',
          ' out_of_stock | low_stock | plenty',
          '--------------+-----------+--------',
          '            1 |         3 |      4',
          '(1 row)'
        ),
        codeNotes: [
          { line: 5, note: 'Round the average for money.' },
          { line: 8, note: 'BETWEEN includes both 1 and 30.' }
        ],
        tryIt: 'Add sum(price * stock) AS stock_value to the first query, rounded to 2 decimals.',
        check: {
          question: 'What does round(avg(price), 2) do?',
          options: ['Averages the prices, then rounds the result to 2 decimals', 'Rounds each price, then averages', 'Averages only the first 2 prices'],
          answer: 0,
          why: 'Functions work from the inside out: first avg over all rows, then round the one result.'
        }
      }
    ],
    summary: [
      'Aggregates turn many rows into one answer: count, sum, avg, min, max.',
      'count(*) counts rows; count(column) skips NULL; count(DISTINCT column) counts different values.',
      'sum and avg skip NULL; use coalesce(sum(x), 0) for an empty total; round averages.',
      'min and max work on numbers, dates and text. For the row with the max, use ORDER BY ... LIMIT 1.',
      'WHERE filters rows before aggregating; FILTER counts some rows next to others.'
    ],
    projectStep: {
      title: 'My Library: reading statistics',
      steps: [
        'Count your books, and count how many you have finished with FILTER.',
        'Find your shortest and longest book in pages with min and max.',
        'Find the average number of pages, rounded to a whole number.',
        'Count how many different authors you have with count(DISTINCT author).'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 9,
    title: 'Groups: GROUP BY and HAVING',
    goal: 'You can calculate totals per group with GROUP BY, follow the grouping rule, and filter groups with HAVING.',
    minutes: 28,
    recap: 'Yesterday you used count, sum, avg, min and max to turn a whole table into one summary row.',
    parts: [
      {
        title: 'GROUP BY: one summary per group',
        say: [
          'Yesterday\'s aggregates gave one answer for the whole table. But managers usually want answers per group: products per category, sales per city, orders per month. GROUP BY does exactly that.',
          'SELECT category, count(*) FROM products GROUP BY category splits the products into groups, one for each category, and counts each group separately. The result has one row per category.',
          'Think of it in two steps. First, PostgreSQL puts rows with the same category into the same pile. Then it runs the aggregate on each pile and writes one row per pile.',
          'You can use any aggregate with GROUP BY: sum(stock) per category, avg(price) per category, max(ordered_on) per customer. And several at once, each with its own name.',
          'The groups come out in no particular order, just like any result without ORDER BY. Add ORDER BY to sort them, for example by the count, biggest first.',
          'You can also group without any aggregate. SELECT category FROM products GROUP BY category simply lists each category once, like SELECT DISTINCT category. In practice, DISTINCT is clearer for that job, and GROUP BY is used when you also want counts or totals per group.'
        ],
        example: 'After a school sports day, the teacher does not announce every race result. She sorts the results into piles by house, Red, Blue, Green, Yellow, and announces the total points per house. Sorting into piles is GROUP BY; adding up each pile is sum.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Stapler', 'stationery', 150, 30),",
          "  ('Headphones', 'electronics', 1499, 25), ('Phone stand', 'electronics', 299, 60), ('Backpack', 'bags', 1200, 15);",
          'SELECT category, count(*) AS products, sum(stock) AS units',
          'FROM products',
          'GROUP BY category',
          'ORDER BY products DESC, category;'
        ),
        output: lines(
          ' category    | products | units',
          '-------------+----------+-------',
          ' stationery  |        3 |   650',
          ' electronics |        2 |    85',
          ' bags        |        1 |    15',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'One pile per category.' },
          { line: 4, note: 'For each pile: its name, how many rows, and the total stock.' },
          { line: 7, note: 'Sort the groups: most products first.' }
        ],
        tryIt: 'Add round(avg(price), 2) AS avg_price to the SELECT to see the average price per category.',
        check: {
          question: 'How many rows does SELECT city, count(*) FROM customers GROUP BY city return?',
          options: ['One row per different city', 'One row per customer', 'Always one row'],
          answer: 0,
          why: 'GROUP BY makes one group, and one result row, for each different value of city.'
        }
      },
      {
        title: 'The grouping rule',
        say: [
          'There is one rule that every beginner meets: in a query with GROUP BY, every column in the SELECT must either be in the GROUP BY, or be inside an aggregate.',
          'Why? Each result row represents a whole group. The category is the same for the whole group, so it can be shown. The count is one number for the group, so it can be shown. But a product name? There are several names in the stationery group. PostgreSQL does not know which one you want, so it refuses.',
          'The error message says exactly this: column must appear in the GROUP BY clause or be used in an aggregate function. When you see it, look at the column it names and decide: do you want one row per value of that column (add it to GROUP BY), or a summary of it (wrap it in an aggregate)?',
          'There is a useful exception: if you group by a table\'s primary key, PostgreSQL knows every other column of that table has only one value per group, so you may show them. You will use this with joins later.',
          'Some other databases, like older versions of MySQL, quietly pick a random value instead of refusing. PostgreSQL\'s strictness is a good thing: it stops wrong reports.',
          'If you really do want one example value from each group, say so explicitly with an aggregate: min(name) or max(name) picks the first or last name in A to Z order. The query then states exactly which value you mean, and anyone reading it understands the result.'
        ],
        example: 'If a teacher reports the total marks for each house, she can say "Red house: 250 points". She cannot say "Red house: student name ___", because Red house has many students. She can only name something that is the same for the whole house, or a summary like "top scorer".',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60), ('Pen', 'stationery', 10), ('Headphones', 'electronics', 1499), ('Phone stand', 'electronics', 299);",
          'SELECT category, max(price) AS top_price, min(name) AS first_name_a_to_z FROM products GROUP BY category ORDER BY category;',
          'SELECT category, name FROM products GROUP BY category;'
        ),
        output: lines(
          ' category    | top_price | first_name_a_to_z',
          '-------------+-----------+-------------------',
          ' electronics |   1499.00 | Headphones',
          ' stationery  |     60.00 | Notebook',
          '(2 rows)',
          '',
          '[Error] column "products.name" must appear in the GROUP BY clause or be used in an aggregate function'
        ),
        codeNotes: [
          { line: 3, note: 'Allowed: category is grouped; max and min are aggregates.' },
          { line: 4, note: 'Not allowed: which of the names in each group should be shown?' }
        ],
        tryIt: 'Change line 4 to end with GROUP BY category, name and run it again. Now each group is one product, so the query works.',
        check: {
          question: 'In SELECT city, name, count(*) FROM customers GROUP BY city, what is wrong?',
          options: ['name is neither in GROUP BY nor inside an aggregate', 'count(*) cannot be used with GROUP BY', 'city must be last'],
          answer: 0,
          why: 'Each group is one city with many names. name must be grouped too, or summarised, for example with min(name).'
        }
      },
      {
        title: 'Grouping by more than one column, and by calculations',
        say: [
          'You can group by several columns. GROUP BY city, status makes one group for each combination: Pune delivered, Pune pending, Mumbai delivered, and so on. It answers questions like "how many orders of each status in each city?".',
          'You can also group by a calculation. The most useful example is dates: GROUP BY date_trunc(\'month\', ordered_on) makes one group per month, whatever the day. This is how monthly sales reports are built.',
          'When you group by a calculation, repeat the same calculation in the SELECT so it appears in the result. Or give it a name in the SELECT and group by that position or name, which PostgreSQL also allows.',
          'The same idea works with CASE, which you will meet on Day 19: grouping products into price bands like budget, mid and premium, and counting each band.',
          'As always, add ORDER BY so the groups come out in a sensible order, like months in time order.'
        ],
        example: 'A bank statement summary shows spending per month and per category: September food, September travel, October food. Each line is one combination of month and category, which is GROUP BY month, category.',
        code: lines(
          'CREATE TABLE orders (id int, city text, status text, ordered_on date, total numeric(10,2));',
          "INSERT INTO orders VALUES (1, 'Pune', 'delivered', '2026-08-28', 280), (2, 'Mumbai', 'delivered', '2026-09-03', 1200), (3, 'Pune', 'shipped', '2026-09-10', 2097),",
          "  (4, 'Pune', 'delivered', '2026-09-12', 760), (5, 'Mumbai', 'pending', '2026-10-02', 450);",
          'SELECT city, status, count(*) AS orders FROM orders GROUP BY city, status ORDER BY city, status;',
          "SELECT date_trunc('month', ordered_on)::date AS month, sum(total) AS sales",
          'FROM orders',
          "GROUP BY date_trunc('month', ordered_on)",
          'ORDER BY month;'
        ),
        output: lines(
          ' city   | status    | orders',
          '--------+-----------+--------',
          ' Mumbai | delivered |      1',
          ' Mumbai | pending   |      1',
          ' Pune   | delivered |      2',
          ' Pune   | shipped   |      1',
          '(4 rows)',
          '',
          ' month      | sales',
          '------------+---------',
          ' 2026-08-01 |  280.00',
          ' 2026-09-01 | 4057.00',
          ' 2026-10-01 |  450.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'One group for each city and status combination.' },
          { line: 7, note: 'Group by the start of each month: a monthly report.' }
        ],
        tryIt: "Change the monthly query to group by city as well: SELECT city, date_trunc('month', ordered_on)::date AS month, ... GROUP BY city, date_trunc('month', ordered_on).",
        check: {
          question: 'How do you make a report with one row per month?',
          options: ["GROUP BY date_trunc('month', ordered_on)", 'GROUP BY ordered_on', 'ORDER BY month'],
          answer: 0,
          why: 'date_trunc turns every date in a month into the first of that month, so all of the month\'s rows fall into one group.'
        }
      },
      {
        title: 'HAVING: filtering groups',
        say: [
          'WHERE filters rows before grouping. But sometimes you want to filter the groups themselves: categories with more than 2 products, customers who ordered more than 3 times, months with sales above 1 lakh. For that, SQL has HAVING.',
          'HAVING comes after GROUP BY and can use aggregates: GROUP BY category HAVING count(*) > 2. Each group is checked after its count is known, and only the groups that pass appear in the result.',
          'You can use WHERE and HAVING in the same query. WHERE runs first, on rows: "only delivered orders". Then the groups are made and counted. Then HAVING runs, on groups: "only customers with 2 or more of those orders".',
          'A good rule: if the condition is about a single row, like status or price, put it in WHERE. If it is about a group summary, like a count or a total, put it in HAVING. Putting row conditions in WHERE is also faster, because fewer rows need grouping.',
          'The full order of a query is now: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. It is worth memorising, because interviewers often ask about the difference between WHERE and HAVING.',
          'Although you write SELECT first, PostgreSQL works in a different order: FROM, then WHERE, then GROUP BY, then HAVING, then SELECT, then ORDER BY, then LIMIT. Knowing this explains many rules. For example, WHERE cannot use a name you gave with AS in the SELECT, because the SELECT has not happened yet when WHERE runs, but ORDER BY can, because it runs after.'
        ],
        example: 'A school wants to award houses that scored more than 200 points. First it adds up the points per house (GROUP BY), then it looks at each house total and keeps only those above 200 (HAVING). It cannot check "above 200" for a single race result; it needs the totals first.',
        code: lines(
          'CREATE TABLE orders (id int, customer text, status text, total numeric(10,2));',
          "INSERT INTO orders VALUES (1, 'Asha', 'delivered', 280), (2, 'Ravi', 'delivered', 1200), (3, 'Asha', 'shipped', 2097),",
          "  (4, 'Priya', 'delivered', 760), (5, 'Asha', 'delivered', 50), (6, 'Ravi', 'cancelled', 899);",
          'SELECT customer, count(*) AS orders FROM orders GROUP BY customer HAVING count(*) >= 2 ORDER BY customer;',
          'SELECT customer, sum(total) AS delivered_value',
          'FROM orders',
          "WHERE status = 'delivered'",
          'GROUP BY customer',
          'HAVING sum(total) > 500',
          'ORDER BY delivered_value DESC;'
        ),
        output: lines(
          ' customer | orders',
          '----------+--------',
          ' Asha     |      3',
          ' Ravi     |      2',
          '(2 rows)',
          '',
          ' customer | delivered_value',
          '----------+-----------------',
          ' Ravi     |         1200.00',
          ' Priya    |          760.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Keep only customers with 2 or more orders.' },
          { line: 7, note: 'WHERE: row by row, only delivered orders.' },
          { line: 9, note: 'HAVING: group by group, only totals above 500. Asha\'s delivered total is 330.' }
        ],
        tryIt: 'Remove the WHERE line from the second query and run it. Asha now appears, because her shipped order counts too.',
        check: {
          question: 'Which clause filters categories that have more than 5 products?',
          options: ['HAVING count(*) > 5', 'WHERE count(*) > 5', 'ORDER BY count(*) > 5'],
          answer: 0,
          why: 'The condition uses an aggregate about each group, so it belongs in HAVING, after GROUP BY.'
        }
      },
      {
        title: 'Common grouping mistakes',
        say: [
          'A few mistakes come up again and again with GROUP BY. Knowing them saves hours of confusion.',
          'The first is putting an aggregate in WHERE, like WHERE count(*) > 1. PostgreSQL refuses, because WHERE runs before any counting. Move it to HAVING.',
          'The second is grouping by too much. If you add the product name to GROUP BY by accident, every product becomes its own group and all your counts are 1. If the numbers look suspiciously small, check your GROUP BY list.',
          'The third is forgetting that NULL forms its own group. Customers with no city are grouped together in one row whose city is NULL. That is usually correct, but label it clearly in reports, for example with coalesce(city, \'Unknown\').',
          'The fourth is counting the wrong thing after a filter. If you want customers with no orders to appear with 0, you need a LEFT JOIN and count(column), which you will learn on Day 12. A plain GROUP BY on the orders table only shows customers who have orders.'
        ],
        example: 'Counting votes per party, a careless clerk writes each voter\'s name on the tally sheet too. Now every line is one person, and every count is 1. Grouping by too much hides the totals you wanted.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai'), ('Priya', 'Pune'), ('Meera', NULL), ('Kabir', NULL);",
          "SELECT coalesce(city, 'Unknown') AS city, count(*) AS customers FROM customers GROUP BY city ORDER BY customers DESC, city;",
          'SELECT city, name, count(*) AS customers FROM customers GROUP BY city, name ORDER BY name LIMIT 2;'
        ),
        output: lines(
          ' city    | customers',
          '---------+-----------',
          ' Pune    |         2',
          ' Unknown |         2',
          ' Mumbai  |         1',
          '(3 rows)',
          '',
          ' city | name  | customers',
          '------+-------+-----------',
          ' Pune | Asha  |         1',
          ' NULL | Kabir |         1',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Customers with no city form their own group, labelled with coalesce.' },
          { line: 4, note: 'Grouping by name too: every group is one person, so every count is 1.' }
        ],
        tryIt: 'In line 3, change ORDER BY to city only. Where does the Unknown group appear now, and why?',
        check: {
          question: 'Every count in your grouped report is 1. What is the most likely cause?',
          options: ['A column that is unique per row, like name or id, is in the GROUP BY', 'The table is empty', 'HAVING is missing'],
          answer: 0,
          why: 'Grouping by a unique column makes each row its own group, so every count is 1.'
        }
      },
      {
        title: 'Putting it together: a category report',
        say: [
          'Let us write the category report a shop manager would ask for: for each category, the number of products, the total stock and the average price, only for categories with more than one product, biggest categories first.',
          'Read the query from top to bottom and match each line to a part of the question. SELECT lists what to show. FROM names the table. GROUP BY makes one row per category. HAVING keeps categories with more than one product. ORDER BY sorts them.',
          'This is a real, useful report, and it uses everything from the last two days. Many junior analyst and backend interviews include a question just like this.',
          'In today\'s practice, you will count the products in each category, and then show only the categories that have more than one product. The shop database is ready in the practice editor.',
          'Tomorrow you learn how tables link to each other with foreign keys, the idea behind joins, which are the most important topic of week 2.'
        ],
        example: 'A supermarket manager\'s weekly review looks at each aisle: how many products it has, how much stock, and the average price, but only for aisles with enough products to matter. That review is this query.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60, 120), ('Pen', 'stationery', 10, 500), ('Stapler', 'stationery', 150, 30),",
          "  ('Headphones', 'electronics', 1499, 25), ('Phone stand', 'electronics', 299, 60), ('Backpack', 'bags', 1200, 15), ('Desk lamp', 'home', 899, 0);",
          'SELECT category,',
          '       count(*) AS products,',
          '       sum(stock) AS total_stock,',
          '       round(avg(price), 2) AS avg_price',
          'FROM products',
          'GROUP BY category',
          'HAVING count(*) > 1',
          'ORDER BY products DESC;'
        ),
        output: lines(
          ' category    | products | total_stock | avg_price',
          '-------------+----------+-------------+-----------',
          ' stationery  |        3 |         650 |     73.33',
          ' electronics |        2 |          85 |    899.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'One row per category.' },
          { line: 10, note: 'Only categories with more than one product.' },
          { line: 11, note: 'Biggest categories first.' }
        ],
        tryIt: 'Remove the HAVING line and run it. Which categories appear now, and how many products do they have?',
        check: {
          question: 'What is the correct order of these clauses?',
          options: ['WHERE, GROUP BY, HAVING, ORDER BY', 'GROUP BY, WHERE, ORDER BY, HAVING', 'HAVING, GROUP BY, WHERE, ORDER BY'],
          answer: 0,
          why: 'Rows are filtered (WHERE), grouped (GROUP BY), groups are filtered (HAVING), then sorted (ORDER BY).'
        }
      }
    ],
    summary: [
      'GROUP BY makes one result row per group; aggregates then work on each group.',
      'The rule: every selected column is in GROUP BY or inside an aggregate.',
      'Group by several columns for combinations, or by date_trunc for months.',
      'WHERE filters rows before grouping; HAVING filters groups after.',
      'Order of clauses: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.'
    ],
    projectStep: {
      title: 'My Library: books per author',
      steps: [
        'Count your books per author, with the author shown as coalesce(author, \'Unknown\').',
        'Show the total pages per author, most pages first.',
        'Show only authors with more than one book, using HAVING.',
        'Count finished and unfinished books with GROUP BY finished.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 10,
    title: 'Linking Tables: Relationships and Foreign Keys',
    goal: 'You can explain one-to-many and many-to-many relationships, create foreign keys, and see how they protect linked data.',
    minutes: 28,
    recap: 'Yesterday you made reports per group with GROUP BY and filtered groups with HAVING.',
    parts: [
      {
        title: 'Why data is split into several tables',
        say: [
          'So far most examples used one table at a time. Real apps have many tables that are linked: customers place orders, orders contain products. Today you learn how these links work, which prepares you for joins tomorrow.',
          'Why not keep everything in one big table? Imagine an orders table that also stores the customer\'s name, phone and address on every order. A customer with 50 orders has their address copied 50 times. If they move, you must change 50 rows, and if you miss one, the data disagrees with itself.',
          'The better design stores each customer once, in a customers table, with an id. Each order then stores only the customer\'s id. The address lives in one place, and changing it once fixes it everywhere.',
          'This idea, storing each fact once and linking with ids, is the foundation of relational databases. The word "relational" comes from the relationships between tables.',
          'On Day 20 you will learn the formal rules for this, called normalization. Today, the key idea is simply: one table per kind of thing, and ids to link them.'
        ],
        example: 'A college does not write a student\'s full address on every exam paper. The paper just has the roll number. The address is stored once in the admissions office. If the student moves, only the office record changes, and every paper still points to the right student.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text, city text);',
          "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai');",
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders VALUES (101, 1, 280), (102, 2, 1200), (103, 1, 2097);',
          "UPDATE customers SET city = 'Bengaluru' WHERE id = 1;",
          'SELECT id, customer_id, total FROM orders ORDER BY id;',
          'SELECT * FROM customers ORDER BY id;'
        ),
        output: lines(
          ' id  | customer_id | total',
          '-----+-------------+---------',
          ' 101 |           1 |  280.00',
          ' 102 |           2 | 1200.00',
          ' 103 |           1 | 2097.00',
          '(3 rows)',
          '',
          ' id | name | city',
          '----+------+-----------',
          '  1 | Asha | Bengaluru',
          '  2 | Ravi | Mumbai',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Orders store only the customer\'s id, not their name or city.' },
          { line: 5, note: 'Asha moves: one row changes, and both her orders still point to her.' }
        ],
        tryIt: "Add a third order for Ravi: (104, 2, 450). Notice you only need his id, not his name or city.",
        check: {
          question: 'Why store customer_id in orders instead of the customer\'s name and address?',
          options: ['Each customer\'s details are stored once, so a change is made in one place', 'Ids are shorter to type', 'Orders cannot hold text'],
          answer: 0,
          why: 'Storing details once avoids copies that can disagree. The id links each order to the one customer record.'
        }
      },
      {
        title: 'One-to-many relationships',
        say: [
          'The most common relationship is one-to-many: one customer has many orders, but each order belongs to exactly one customer. One category has many products. One author has many books.',
          'In the tables, the "many" side holds the link. The orders table has a customer_id column; the customers table does not need a list of orders. To find a customer\'s orders, you look in orders for rows with that customer_id.',
          'The column on the many side has a special name: a foreign key. It is "foreign" because it holds a key that belongs to another table. customer_id in orders is a foreign key pointing to id in customers.',
          'A useful way to design this is to say it out loud: "a customer places many orders; an order is placed by one customer". The table on the "one" side gets the id; the table on the "many" side gets the foreign key.',
          'You can already use this link with what you know: SELECT count(*) FROM orders WHERE customer_id = 1 counts Asha\'s orders. Tomorrow, joins let you show the customer\'s name next to each order in one query.',
          'Foreign key columns are usually named after the table they point to, with _id at the end: customer_id points to customers, product_id to products. Following this naming habit makes a database easy to read, because anyone can guess where each link goes without looking it up.'
        ],
        example: 'A mother can have several children, but each child has one mother. On each child\'s school form, there is a box for the mother\'s name. The mother\'s form does not list the children. The link is written on the "many" side: the children.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text);',
          "INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ravi'), (3, 'Meera');",
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders VALUES (101, 1, 280), (102, 2, 1200), (103, 1, 2097), (104, 1, 50);',
          'SELECT customer_id, count(*) AS orders, sum(total) AS spent FROM orders GROUP BY customer_id ORDER BY customer_id;'
        ),
        output: lines(
          ' customer_id | orders | spent',
          '-------------+--------+---------',
          '           1 |      3 | 2427.00',
          '           2 |      1 | 1200.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'The "many" side holds the link: customer_id.' },
          { line: 5, note: 'Orders per customer id. Meera (3) has no orders, so she does not appear yet.' }
        ],
        tryIt: 'Add an order for Meera, (105, 3, 99), and run again. She now appears with 1 order.',
        check: {
          question: 'In "one category has many products", which table gets the foreign key?',
          options: ['products, with a category_id column', 'categories, with a product_id column', 'Both tables'],
          answer: 0,
          why: 'The link goes on the "many" side. Each product stores the id of its one category.'
        }
      },
      {
        title: 'FOREIGN KEY: letting PostgreSQL protect the link',
        say: [
          'A column called customer_id is just a number until you tell PostgreSQL it is a link. Without that, nothing stops someone from saving an order for customer 999, who does not exist. That is called an orphan row, and it breaks reports.',
          'You declare the link with REFERENCES: customer_id int REFERENCES customers(id). This creates a foreign key constraint. From then on, PostgreSQL checks every insert and update: the customer_id must exist in customers, or be NULL.',
          'The protection works in the other direction too. If you try to delete a customer who still has orders, PostgreSQL refuses by default, because those orders would become orphans. You saw this rule in the Day 3 practice, when the shop could not delete a product that was in an old order.',
          'You can choose other behaviour with ON DELETE, which you will learn on Day 21: CASCADE deletes the orders along with the customer, and SET NULL keeps the orders but clears their customer_id. The default, refusing, is the safest.',
          'Foreign keys are a promise the database keeps for you, whatever app, script or person changes the data. That is why experienced developers always declare them.'
        ],
        example: 'A school will not accept a library card request for a roll number that is not on the admissions list. And it will not remove a student from the list while they still have library books. The foreign key is that rule, checked every time.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text);',
          "INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ravi');",
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), total numeric(10,2));',
          'INSERT INTO orders VALUES (101, 1, 280);',
          'INSERT INTO orders VALUES (102, 999, 50);'
        ),
        output: '[Error] insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"',
        codeNotes: [
          { line: 3, note: 'REFERENCES makes customer_id a foreign key to customers(id).' },
          { line: 5, note: 'Customer 999 does not exist, so PostgreSQL refuses the order.' }
        ],
        tryIt: 'Change line 5 to delete a customer who has an order instead: DELETE FROM customers WHERE id = 1; and read the error. Then try deleting Ravi (id 2), who has no orders.',
        check: {
          question: 'What does customer_id int REFERENCES customers(id) prevent?',
          options: ['Orders pointing to customers that do not exist', 'Two orders for the same customer', 'Customers with no orders'],
          answer: 0,
          why: 'A foreign key ensures every value points to a real row in the other table (or is NULL).'
        }
      },
      {
        title: 'Many-to-many relationships',
        say: [
          'Some relationships are many-to-many. An order contains many products, and a product appears in many orders. A student takes many courses, and a course has many students.',
          'You cannot store this with one foreign key column. Instead, you add a third table in the middle, often called a junction table or link table. For orders and products, it is order_items: each row says "this order contains this product, in this quantity".',
          'The junction table has two foreign keys, one to each side, and usually a primary key made of both columns together: PRIMARY KEY (order_id, product_id). That means the same product appears at most once per order; the quantity column says how many.',
          'Junction tables often hold extra information about the relationship itself. The quantity belongs to "this product in this order", not to the order or the product alone. A price at the time of purchase is another common example.',
          'This is exactly the shape of the shop database you have practised with: customers, orders, order_items and products. Tomorrow you will join all four together.'
        ],
        example: 'A wedding guest list and a list of events (mehendi, sangeet, reception): each guest attends many events, and each event has many guests. The invitation card for each guest-event pair is the junction table, and it can say extra things, like "plus two".',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer text);',
          'CREATE TABLE products (id int PRIMARY KEY, name text);',
          'CREATE TABLE order_items (',
          '  order_id int REFERENCES orders(id),',
          '  product_id int REFERENCES products(id),',
          '  quantity int,',
          '  PRIMARY KEY (order_id, product_id)',
          ');',
          "INSERT INTO orders VALUES (1, 'Asha'), (2, 'Ravi');",
          "INSERT INTO products VALUES (10, 'Notebook'), (20, 'Pen');",
          'INSERT INTO order_items VALUES (1, 10, 3), (1, 20, 10), (2, 20, 5);',
          'SELECT product_id, count(*) AS in_orders, sum(quantity) AS units FROM order_items GROUP BY product_id ORDER BY product_id;'
        ),
        output: lines(
          ' product_id | in_orders | units',
          '------------+-----------+-------',
          '         10 |         1 |     3',
          '         20 |         2 |    15',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'The junction table between orders and products.' },
          { line: 7, note: 'A primary key made of two columns: each product at most once per order.' },
          { line: 11, note: 'Order 1 has two products; the Pen is in two orders.' }
        ],
        tryIt: 'Try adding (1, 20, 2) again to the order_items INSERT and read the error: the Pen is already in order 1. The fix in a real app is to UPDATE the quantity instead.',
        check: {
          question: 'How do you store "orders contain products" when each order has many products and each product is in many orders?',
          options: ['A third table, order_items, with order_id and product_id', 'A product_id column in orders', 'An order_id column in products'],
          answer: 0,
          why: 'Many-to-many needs a junction table with a foreign key to each side.'
        }
      },
      {
        title: 'Reading a database design',
        say: [
          'When you join a new company or project, one of the first things to do is read the database design: which tables exist, and how they link. Being able to read it quickly is a real job skill.',
          'PostgreSQL itself can tell you. The information_schema is a set of built-in views that describe your tables. For example, information_schema.table_constraints lists every primary key, foreign key and unique rule.',
          'Teams often draw the design as a diagram, called an ER diagram, short for entity-relationship. Each table is a box, and lines between boxes show the foreign keys. A line with a "crow\'s foot" on one end marks the "many" side.',
          'When you read a design, ask three questions for each foreign key: which table points to which, what does one row on each side mean, and what happens when the "one" side is deleted.',
          'In the example below, we ask PostgreSQL to list the foreign keys in a small shop database. This is the same kind of query that database tools run to draw diagrams for you.'
        ],
        example: 'A metro map shows stations as dots and lines as connections. You do not need to see every train to understand how to get from A to B. An ER diagram is the metro map of a database: tables and the links between them.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text);',
          'CREATE TABLE products (id int PRIMARY KEY, name text);',
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id));',
          'CREATE TABLE order_items (order_id int REFERENCES orders(id), product_id int REFERENCES products(id), quantity int, PRIMARY KEY (order_id, product_id));',
          'SELECT table_name, constraint_type, count(*) AS how_many',
          'FROM information_schema.table_constraints',
          "WHERE table_schema = 'public' AND constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')",
          'GROUP BY table_name, constraint_type',
          'ORDER BY table_name, constraint_type;'
        ),
        output: lines(
          ' table_name  | constraint_type | how_many',
          '-------------+-----------------+----------',
          ' customers   | PRIMARY KEY     |        1',
          ' order_items | FOREIGN KEY     |        2',
          ' order_items | PRIMARY KEY     |        1',
          ' orders      | FOREIGN KEY     |        1',
          ' orders      | PRIMARY KEY     |        1',
          ' products    | PRIMARY KEY     |        1',
          '(6 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'A built-in view that describes the rules on every table.' },
          { line: 7, note: 'Only our own tables, and only primary and foreign keys.' }
        ],
        tryIt: 'Add a reviews table with product_id int REFERENCES products(id) and run it again. A new FOREIGN KEY row appears for reviews.',
        check: {
          question: 'In an ER diagram, what does a line between two tables usually show?',
          options: ['A foreign key relationship', 'That the tables have the same columns', 'That one table is a copy of the other'],
          answer: 0,
          why: 'Lines connect tables linked by foreign keys, often with a crow\'s foot on the "many" side.'
        }
      },
      {
        title: 'Putting it together: adding reviews to the shop',
        say: [
          'Let us extend the shop with a new feature: product reviews. First, think about the relationship. One product has many reviews, and each review is about one product. So reviews gets a product_id foreign key.',
          'Next, the rules. A rating must be from 1 to 5, which is a CHECK rule, and the product must exist, which is the foreign key. With both in place, PostgreSQL refuses bad reviews no matter which app sends them.',
          'Then we add some reviews and use GROUP BY to show the number of reviews and the average rating per product id. Tomorrow, with joins, you will show the product names instead of ids.',
          'In today\'s practice, you will create the reviews table with its foreign key and CHECK rule, and count the orders per customer id from the shop\'s orders table.',
          'Tomorrow is one of the most important days of the course: joins. You will finally put linked tables side by side in one result, like each order with its customer\'s name.'
        ],
        example: 'When a shopping app adds a new feature like reviews, a developer first decides how it links to what already exists: every review belongs to one product. Getting that link right, with the right rules, is the first step of every new feature.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text);',
          "INSERT INTO products VALUES (1, 'Notebook'), (2, 'Headphones');",
          'CREATE TABLE reviews (',
          '  id serial PRIMARY KEY,',
          '  product_id int REFERENCES products(id),',
          '  rating int CHECK (rating BETWEEN 1 AND 5),',
          '  comment text',
          ');',
          "INSERT INTO reviews (product_id, rating, comment) VALUES (1, 5, 'Great paper'), (1, 4, 'Good value'), (2, 3, 'Okay sound');",
          'SELECT product_id, count(*) AS reviews, round(avg(rating), 1) AS avg_rating FROM reviews GROUP BY product_id ORDER BY product_id;'
        ),
        output: lines(
          ' product_id | reviews | avg_rating',
          '------------+---------+------------',
          '          1 |       2 |        4.5',
          '          2 |       1 |        3.0',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'Each review points to one existing product.' },
          { line: 6, note: 'Ratings outside 1 to 5 are refused.' },
          { line: 10, note: 'Reviews and average rating per product, rounded to 1 decimal.' }
        ],
        tryIt: "Add a review with rating 7: (2, 7, 'Amazing!!'). Read the error from the CHECK rule. Then try a review for product 99.",
        check: {
          question: 'A review must be about a real product and have a rating from 1 to 5. Which rules do you need?',
          options: ['A foreign key on product_id and a CHECK on rating', 'Only a primary key', 'UNIQUE on rating'],
          answer: 0,
          why: 'The foreign key makes sure the product exists; the CHECK keeps ratings between 1 and 5.'
        }
      }
    ],
    summary: [
      'Store each kind of thing in its own table, once, and link tables with ids.',
      'One-to-many: the "many" table holds a foreign key to the "one" table.',
      'REFERENCES creates a foreign key: no orphan rows, and linked rows cannot be deleted by accident.',
      'Many-to-many needs a junction table with two foreign keys, like order_items.',
      'information_schema and ER diagrams show how a database\'s tables are linked.'
    ],
    projectStep: {
      title: 'My Library: add authors as their own table',
      steps: [
        'Create an authors table with id serial PRIMARY KEY and name text NOT NULL UNIQUE.',
        'Add an author_id int REFERENCES authors(id) column to your books table design.',
        'Insert 2 or 3 authors and link your books to them by id.',
        'Try to add a book with an author_id that does not exist, and read the error.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 11,
    title: 'Joining Tables: INNER JOIN',
    goal: 'You can combine linked tables in one result with INNER JOIN, use table aliases, and filter, sort and total joined data.',
    minutes: 28,
    recap: 'Yesterday you learned how tables link with foreign keys: one-to-many, many-to-many, and why data is split into tables.',
    parts: [
      {
        title: 'What a join does',
        say: [
          'Yesterday you split data into linked tables: orders store a customer_id instead of the customer\'s name. That is good design, but when a manager asks "show each order with the customer\'s name", the name is in one table and the order is in another. A join brings them together.',
          'A join puts rows from two tables side by side, matching them by a rule you give. For orders and customers, the rule is: the order\'s customer_id equals the customer\'s id. Each order finds its customer, and the result has columns from both tables.',
          'The basic form is: SELECT columns FROM orders JOIN customers ON customers.id = orders.customer_id. JOIN on its own means INNER JOIN, the most common kind. The ON part is the matching rule.',
          'The database does not store the joined result anywhere. It builds it fresh each time you run the query, from the current data. So if a customer changes their name, every joined report shows the new name straight away.',
          'Joins are the single most important skill in SQL. Almost every real question needs one, and almost every SQL interview asks about them. You will spend three days on them, starting today with INNER JOIN.',
          'You may also see an older way of writing joins: FROM orders, customers WHERE customers.id = orders.customer_id. It gives the same result for an inner join, but mixing the matching rule into WHERE makes long queries hard to read and easy to break. Modern SQL uses JOIN ... ON, and so does this course.'
        ],
        example: 'Think of a wedding: the guest list has names and table numbers, and the seating chart has table numbers and which side of the hall each table is on. To tell a guest where to go, you match their table number on both lists. A join is that matching, done for every row at once.',
        code: lines(
          MINI_SHOP,
          'SELECT orders.id, orders.status, customers.name',
          'FROM orders',
          'JOIN customers ON customers.id = orders.customer_id',
          'ORDER BY orders.id;'
        ),
        output: lines(
          ' id  | status    | name',
          '-----+-----------+-------',
          ' 101 | delivered | Asha',
          ' 102 | delivered | Ravi',
          ' 103 | shipped   | Asha',
          ' 104 | pending   | Priya',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Columns from both tables. The table name before the dot says which table.' },
          { line: 11, note: 'The matching rule: each order\'s customer_id equals a customer\'s id.' }
        ],
        tryIt: 'Add customers.city to the SELECT list and run it. Each order now also shows where its customer lives.',
        check: {
          question: 'What does JOIN customers ON customers.id = orders.customer_id do?',
          options: ['Puts each order next to the customer whose id matches its customer_id', 'Copies customers into the orders table', 'Deletes orders without a customer'],
          answer: 0,
          why: 'A join combines rows from both tables in the result, using the ON rule to match them. The tables themselves are not changed.'
        }
      },
      {
        title: 'Table aliases: shorter joins',
        say: [
          'Writing the full table name before every column gets long quickly: orders.id, customers.name, order_items.quantity. So SQL lets you give each table a short nickname, called an alias, right after its name: FROM orders o JOIN customers c.',
          'From then on, you use the alias instead of the full name: o.id, c.name. The query becomes much shorter and easier to read, especially with three or four tables.',
          'Good aliases are short but clear, usually the first letter or two of the table: c for customers, o for orders, p for products, oi for order_items. Avoid meaningless aliases like a, b, c when the tables are not called a, b and c.',
          'When a column name exists in both tables, like id or name, you must say which one you mean. SELECT id FROM orders o JOIN customers c ... gives an error, because both tables have an id. Writing o.id or c.id removes the doubt. Many teams simply always write the alias, which is a good habit.',
          'You can also rename result columns with AS, as before. This is useful in joins, because two columns with the same name, like o.id and c.id, would otherwise be confusing in the result.'
        ],
        example: 'In a class with three students called Rahul, the teacher says "Rahul S" and "Rahul K" to be clear. Aliases do the same for tables: o.id and c.id, so PostgreSQL knows exactly which id you mean.',
        code: lines(
          MINI_SHOP,
          'SELECT o.id AS order_id, c.id AS customer_id, c.name AS customer',
          'FROM orders o',
          'JOIN customers c ON c.id = o.customer_id',
          'ORDER BY o.id;',
          'SELECT id FROM orders o JOIN customers c ON c.id = o.customer_id;'
        ),
        output: lines(
          ' order_id | customer_id | customer',
          '----------+-------------+----------',
          '      101 |           1 | Asha',
          '      102 |           2 | Ravi',
          '      103 |           1 | Asha',
          '      104 |           3 | Priya',
          '(4 rows)',
          '',
          '[Error] column reference "id" is ambiguous'
        ),
        codeNotes: [
          { line: 10, note: 'o is the alias for orders, used from here on.' },
          { line: 13, note: 'Both tables have an id column, so PostgreSQL cannot tell which one you mean.' }
        ],
        tryIt: 'Fix line 13 by writing o.id instead of id, and run again. Both queries now work.',
        check: {
          question: 'Why write o.id instead of just id in a join of orders and customers?',
          options: ['Both tables have an id column, so you must say which one', 'Aliases make the query faster', 'id is a reserved word'],
          answer: 0,
          why: 'When a column name exists in both tables, the alias tells PostgreSQL which table\'s column you mean.'
        }
      },
      {
        title: 'INNER JOIN keeps only matching rows',
        say: [
          'INNER JOIN has one important behaviour: it keeps only rows that have a match on both sides. An order whose customer_id matches no customer would disappear from the result. And a customer with no orders does not appear either.',
          'In our small shop, Meera has not ordered anything. So a join of customers and orders shows Asha, Ravi and Priya, but not Meera. That is correct for the question "show each order with its customer", but wrong for "show every customer and their orders".',
          'This is the most common source of wrong join results: rows that silently disappear. A report of "sales per customer" made with INNER JOIN leaves out customers who bought nothing, which might be exactly the customers a manager wants to call.',
          'Tomorrow you will learn LEFT JOIN, which keeps rows even when there is no match. For today, remember the rule: INNER JOIN shows only pairs that exist on both sides.',
          'A good habit is to count before and after a join. If the orders table has 4 rows and your joined result has 3, some rows found no match. Knowing why is part of writing a correct query.'
        ],
        example: 'A dance class pairs up students who both signed up for the same slot. A student whose partner did not come is not in the pairs list. INNER JOIN is that pairs list: only complete pairs appear.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, o.id AS order_id',
          'FROM customers c',
          'JOIN orders o ON o.customer_id = c.id',
          'ORDER BY c.name, o.id;',
          'SELECT count(*) AS customers FROM customers;'
        ),
        output: lines(
          ' name  | order_id',
          '-------+----------',
          ' Asha  |      101',
          ' Asha  |      103',
          ' Priya |      104',
          ' Ravi  |      102',
          '(4 rows)',
          '',
          ' customers',
          '-----------',
          '         4',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'Only customers who have at least one order appear.' },
          { line: 13, note: 'There are 4 customers, but Meera has no orders, so she is missing above.' }
        ],
        tryIt: 'Add an order for Meera to the setup by adding a line: INSERT INTO orders VALUES (105, 4, \'2026-09-20\', \'pending\'); before the SELECT. She now appears.',
        check: {
          question: 'A customer has no orders. Does INNER JOIN between customers and orders show them?',
          options: ['No, INNER JOIN only keeps rows with a match on both sides', 'Yes, with empty order columns', 'Only if you add ORDER BY'],
          answer: 0,
          why: 'INNER JOIN drops rows without a match. LEFT JOIN, tomorrow, keeps them with NULLs.'
        }
      },
      {
        title: 'Joining and then filtering, sorting and totalling',
        say: [
          'A join produces rows like any other query, so everything you learned in week 1 works on top of it. WHERE filters the joined rows, ORDER BY sorts them, and GROUP BY with aggregates totals them.',
          'For example, "orders from customers in Pune" needs the customer\'s city, which lives in customers, and the orders, which live in orders. Join them, then add WHERE c.city = \'Pune\'.',
          '"How many orders has each customer placed?" joins orders to customers, then groups by the customer\'s name. Because the name comes from the joined table, you can group and show it directly.',
          'The order of clauses stays the same: SELECT, FROM with its JOINs, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. The JOIN lines belong to the FROM part, before WHERE.',
          'When you group joined data, group by something unique for each group, like the customer id, as well as the name. Two different customers can have the same name, and grouping by name alone would wrongly add their orders together.'
        ],
        example: 'A college wants the number of books borrowed by students from each hostel. The borrowing record has roll numbers; the student list has hostels. You match them first, then count per hostel. Join first, then group.',
        code: lines(
          MINI_SHOP,
          'SELECT o.id, c.name',
          'FROM orders o',
          'JOIN customers c ON c.id = o.customer_id',
          "WHERE c.city = 'Pune'",
          'ORDER BY o.id;',
          'SELECT c.id, c.name, count(*) AS orders',
          'FROM customers c',
          'JOIN orders o ON o.customer_id = c.id',
          'GROUP BY c.id, c.name',
          'ORDER BY orders DESC, c.name;'
        ),
        output: lines(
          ' id  | name',
          '-----+-------',
          ' 101 | Asha',
          ' 103 | Asha',
          ' 104 | Priya',
          '(3 rows)',
          '',
          ' id | name  | orders',
          '----+-------+--------',
          '  1 | Asha  |      2',
          '  3 | Priya |      1',
          '  2 | Ravi  |      1',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 12, note: 'The filter uses a column from the joined customers table.' },
          { line: 17, note: 'Group by the id and the name, so two customers with the same name stay separate.' }
        ],
        tryIt: "Add HAVING count(*) > 1 to the second query, before ORDER BY. Only Asha is left.",
        check: {
          question: 'Where do the JOIN lines go in a query?',
          options: ['Right after FROM, before WHERE', 'After ORDER BY', 'Inside the SELECT list'],
          answer: 0,
          why: 'Joins are part of the FROM clause. WHERE, GROUP BY and ORDER BY then work on the joined rows.'
        }
      },
      {
        title: 'Joining a junction table',
        say: [
          'Many-to-many relationships, like orders and products, go through a junction table: order_items. To show "which products were in order 101", you join order_items to products.',
          'Each row of order_items says "this order contains this product, this many times". Joining it to products on product_id adds the product\'s name and price to each line. The result reads like the lines of a bill.',
          'Once you have the price and the quantity side by side, you can calculate: p.price * oi.quantity AS line_total. And with GROUP BY on the order, sum of the line totals gives each order\'s total value.',
          'This is a very common pattern in real apps: a bill, a shopping cart, a playlist, a class timetable. Each is a junction table joined to the thing it lists.',
          'Remember that the junction table can have several rows for one order, one per product. So when you join and then count or sum, you are counting lines, not orders. Always ask yourself what one row of your result means.',
          'In a real shop, order_items usually also stores the price at the time of purchase, because product prices change. If the Pen costs 12 next month, an old bill must still show the 10 rupees the customer actually paid. Joining to the current products price is fine for learning, but real invoices keep their own copy.'
        ],
        example: 'A restaurant bill lists each dish you ordered, how many plates, the price per plate, and the line total. The kitchen\'s order slip only had dish numbers and quantities; the prices came from the menu. The bill is order_items joined to the menu.',
        code: lines(
          MINI_SHOP,
          'SELECT p.name, oi.quantity, p.price, p.price * oi.quantity AS line_total',
          'FROM order_items oi',
          'JOIN products p ON p.id = oi.product_id',
          'WHERE oi.order_id = 101',
          'ORDER BY p.name;',
          'SELECT oi.order_id, sum(p.price * oi.quantity) AS order_total',
          'FROM order_items oi',
          'JOIN products p ON p.id = oi.product_id',
          'GROUP BY oi.order_id',
          'ORDER BY oi.order_id;'
        ),
        output: lines(
          ' name     | quantity | price | line_total',
          '----------+----------+-------+------------',
          ' Notebook |        3 | 60.00 |     180.00',
          ' Pen      |       10 | 10.00 |     100.00',
          '(2 rows)',
          '',
          ' order_id | order_total',
          '----------+-------------',
          '      101 |      280.00',
          '      102 |     1200.00',
          '      103 |       50.00',
          '      104 |       60.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Each line of the bill: name, quantity, price and line total.' },
          { line: 14, note: 'Add up the line totals for each order.' }
        ],
        tryIt: 'Change the first query to show order 103 instead of 101. What did that order contain?',
        check: {
          question: 'In a join of order_items and products, what does one result row represent?',
          options: ['One product line inside one order', 'One whole order', 'One product in the catalogue'],
          answer: 0,
          why: 'order_items has one row per product per order, so each joined row is one line of a bill.'
        }
      },
      {
        title: 'Putting it together: an orders report',
        say: [
          'Let us combine today\'s ideas into a report a shop manager would use: each delivered order with its customer\'s name and its total value, biggest first.',
          'This needs three tables. orders gives the status and date. customers gives the name. order_items and products give the total. We join them all, filter with WHERE, group by the order, and sort.',
          'Read the query slowly from FROM downwards: start with orders, attach the customer, attach the order lines, attach the products. Then keep delivered orders, group each order\'s lines together, and add them up. Tomorrow and the day after, you will build longer chains like this.',
          'In today\'s practice, you will show every order with its customer\'s name, and list the products and quantities in one order. Both are single joins, exactly like this lesson.',
          'Tomorrow you meet LEFT JOIN, which keeps rows that have no match: customers who never ordered, products nobody bought. It is the answer to the "missing rows" problem from part 3.'
        ],
        example: 'At the end of the day, a shop owner flips through the delivered orders: whose order it was, and how much it came to. Behind that simple list, three or four tables are joined together.',
        code: lines(
          MINI_SHOP,
          'SELECT o.id AS order_id, c.name AS customer, sum(p.price * oi.quantity) AS total',
          'FROM orders o',
          'JOIN customers c ON c.id = o.customer_id',
          'JOIN order_items oi ON oi.order_id = o.id',
          'JOIN products p ON p.id = oi.product_id',
          "WHERE o.status = 'delivered'",
          'GROUP BY o.id, c.name',
          'ORDER BY total DESC;'
        ),
        output: lines(
          ' order_id | customer | total',
          '----------+----------+---------',
          '      102 | Ravi     | 1200.00',
          '      101 | Asha     |  280.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'Attach each order\'s customer.' },
          { line: 12, note: 'Attach the order\'s lines, then each line\'s product.' },
          { line: 15, note: 'One result row per order, with its lines added up.' }
        ],
        tryIt: "Remove the WHERE line and run it again. Orders 103 and 104, which are not delivered, now appear too.",
        check: {
          question: 'Why group by o.id in the orders report?',
          options: ['So each order\'s product lines are added up into one row per order', 'Because every join needs GROUP BY', 'To sort the orders'],
          answer: 0,
          why: 'After joining, each order has one row per product line. Grouping by the order adds those lines into one total.'
        }
      }
    ],
    summary: [
      'A join puts rows from linked tables side by side, matched by an ON rule.',
      'JOIN on its own means INNER JOIN: only rows with a match on both sides are kept.',
      'Aliases like o and c keep joins short; use them when a column name is in both tables.',
      'WHERE, GROUP BY and ORDER BY work on the joined rows; group by an id, not just a name.',
      'Junction tables like order_items join to the things they list, like the lines of a bill.'
    ],
    projectStep: {
      title: 'My Library: books with author names',
      steps: [
        'Using your authors and books tables from Day 10, join them to show each book with its author\'s name.',
        'Show only the books by one chosen author, using WHERE on the author\'s name.',
        'Count books per author with a join and GROUP BY a.id, a.name.',
        'Count the rows before and after the join. If any book disappeared, find out why.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 12,
    title: 'Keeping Rows Without a Match: LEFT JOIN',
    goal: 'You can keep unmatched rows with LEFT JOIN, count zero correctly, and find rows with no match.',
    minutes: 28,
    recap: 'Yesterday you combined tables with INNER JOIN, which keeps only rows that have a match on both sides.',
    parts: [
      {
        title: 'LEFT JOIN: keep every row from the first table',
        say: [
          'Yesterday, Meera disappeared from the customers-and-orders result because she has no orders. INNER JOIN only keeps complete pairs. Often that is exactly what you want, but sometimes it hides important rows.',
          'LEFT JOIN solves this. It keeps every row from the left table, the one written before the word JOIN, whether it finds a match or not. When there is no match, the columns from the right table are filled with NULL.',
          'So customers LEFT JOIN orders shows every customer. Asha, Ravi and Priya appear with their orders, and Meera appears once, with NULL in the order columns. Nothing is lost.',
          'The left table is simply the one that comes first. FROM customers c LEFT JOIN orders o keeps all customers. FROM orders o LEFT JOIN customers c would keep all orders instead. Choosing which table goes first is choosing which rows must never disappear.',
          'You will also see LEFT OUTER JOIN in some SQL. It means exactly the same as LEFT JOIN; the word OUTER is optional.',
          'A quick way to check whether you need LEFT JOIN is to read the question for words like every, all, including or even if. "Every customer and their orders", "all products, including unsold ones": these words mean some rows must stay even without a match, so the table they refer to goes first, with LEFT JOIN.'
        ],
        example: 'A class teacher reads the full attendance register and ticks who submitted homework. Students who did not submit are still on the list, with an empty box next to their name. LEFT JOIN is the full register with empty boxes; INNER JOIN would be a list of only those who submitted.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, o.id AS order_id, o.status',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'ORDER BY c.name, o.id;'
        ),
        output: lines(
          ' name  | order_id | status',
          '-------+----------+-----------',
          ' Asha  |      101 | delivered',
          ' Asha  |      103 | shipped',
          ' Meera |     NULL | NULL',
          ' Priya |      104 | pending',
          ' Ravi  |      102 | delivered',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'customers is on the left, so every customer is kept.' },
          { line: 11, note: 'Meera has no orders, so her order columns are NULL.' }
        ],
        tryIt: 'Change LEFT JOIN to JOIN and run it again. Meera disappears. Change it back.',
        check: {
          question: 'In FROM customers c LEFT JOIN orders o, which rows are always kept?',
          options: ['Every customer', 'Every order', 'Only customers with orders'],
          answer: 0,
          why: 'LEFT JOIN keeps every row of the left table, the one before JOIN. Missing matches become NULL.'
        }
      },
      {
        title: 'Counting zero correctly',
        say: [
          'The most common use of LEFT JOIN is counting, including zero. "How many orders has each customer placed?" should show Meera with 0, not leave her out.',
          'Here is the trap: with LEFT JOIN, count(*) counts rows, and Meera still has one row, the one filled with NULLs. So count(*) says 1 for her, which is wrong.',
          'The fix is to count a column from the right table, like count(o.id). Remember from Day 8: count(column) skips NULL. Meera\'s only row has a NULL order id, so count(o.id) correctly gives 0.',
          'The same applies to sum: sum(o.total) for a customer with no orders is NULL, not 0. Wrap it with coalesce: coalesce(sum(o.total), 0).',
          'This pattern, LEFT JOIN plus count(right_table.id) plus GROUP BY, is one of the most useful in SQL. It is also a favourite interview question, because so many people get the zero wrong.',
          'Before trusting such a report, check the total number of rows. A report of orders per customer should have exactly one row per customer, so its row count should equal SELECT count(*) FROM customers. If it has fewer rows, some customers were lost; if it has more, the GROUP BY is wrong. This simple check catches most mistakes.'
        ],
        example: 'If you count the empty boxes on an attendance sheet as "one submission", a student who submitted nothing looks like they submitted once. You must count the ticks, not the lines. count(o.id) counts the ticks.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, count(*) AS wrong_count, count(o.id) AS order_count',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'GROUP BY c.id, c.name',
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name  | wrong_count | order_count',
          '-------+-------------+-------------',
          ' Asha  |           2 |           2',
          ' Meera |           1 |           0',
          ' Priya |           1 |           1',
          ' Ravi  |           1 |           1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'count(*) counts Meera\'s NULL row as 1. count(o.id) skips it and gives 0.' },
          { line: 12, note: 'Group by id and name, as you learned yesterday.' }
        ],
        tryIt: 'Remove the wrong_count column so only the correct count is left. This is the query you would give to a manager.',
        check: {
          question: 'With LEFT JOIN, which count shows 0 for customers with no orders?',
          options: ['count(o.id)', 'count(*)', 'count(c.id)'],
          answer: 0,
          why: 'The unmatched row has NULL in o.id, and count(column) skips NULL. count(*) and count(c.id) both count that row as 1.'
        }
      },
      {
        title: 'Finding rows with no match',
        say: [
          'LEFT JOIN can also find what is missing: customers who never ordered, products nobody bought, students who did not submit. These are some of the most valuable questions in business.',
          'The trick is to LEFT JOIN, then keep only the rows where the right side is NULL: WHERE o.id IS NULL. Those are exactly the left rows that found no match.',
          'Use a column that can never be NULL in a real match, such as the right table\'s primary key. If you used a column that is sometimes NULL anyway, like a comment, you would find false "missing" rows.',
          'This pattern is sometimes called an anti-join. On Day 15 you will see another way to write it, with NOT EXISTS, which some developers prefer. Both give the same answer.',
          'Questions like "customers who have not ordered in 90 days" or "products with no sales this month" are asked every week in real companies, and they all use this idea.'
        ],
        example: 'A school wants to call parents of students who did not come to the parent-teacher meeting. It takes the full student list, marks who came, and keeps the unmarked names. That is LEFT JOIN, then keep where the match is empty.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'WHERE o.id IS NULL;',
          'SELECT p.name',
          'FROM products p',
          'LEFT JOIN order_items oi ON oi.product_id = p.id',
          'WHERE oi.order_id IS NULL;'
        ),
        output: lines(
          ' name',
          '-------',
          ' Meera',
          '(1 row)',
          '',
          ' name',
          '---------',
          ' Stapler',
          '(1 row)'
        ),
        codeNotes: [
          { line: 12, note: 'Keep only customers whose order side is empty: Meera.' },
          { line: 16, note: 'The same idea for products: the Stapler was never ordered.' }
        ],
        tryIt: 'Add an order line for the Stapler to the setup, for example INSERT INTO order_items VALUES (104, 4, 2); and run again. The second result becomes empty.',
        check: {
          question: 'How do you find customers who have never placed an order?',
          options: ['LEFT JOIN orders, then WHERE o.id IS NULL', 'INNER JOIN orders, then WHERE o.id IS NULL', 'SELECT customers WHERE orders = 0'],
          answer: 0,
          why: 'LEFT JOIN keeps unmatched customers with NULL order columns, and IS NULL keeps just those.'
        }
      },
      {
        title: 'The WHERE trap with LEFT JOIN',
        say: [
          'There is one trap with LEFT JOIN that catches almost everyone. Suppose you want every customer with their delivered orders only. You write LEFT JOIN orders, then WHERE o.status = \'delivered\'. Meera and Priya vanish. Why?',
          'Because WHERE runs after the join, on the joined rows. Meera\'s row has NULL status, and NULL = \'delivered\' is not true, so WHERE removes her. Priya only has a pending order, so her row is removed too. The LEFT JOIN kept them, but the WHERE threw them away.',
          'The fix is to put the condition in the ON part instead: LEFT JOIN orders o ON o.customer_id = c.id AND o.status = \'delivered\'. Now the condition only decides which orders are attached. Customers without a delivered order are still kept, with NULLs.',
          'A simple rule: with LEFT JOIN, conditions about the right table usually belong in ON. Conditions about the left table, like c.city = \'Pune\', belong in WHERE.',
          'If your LEFT JOIN result looks like an INNER JOIN result, with the unmatched rows missing, look for a WHERE condition on the right table. It is almost always the cause.'
        ],
        example: 'A teacher wants the full class list, with a tick for students who submitted on time. If she first removes everyone without an on-time tick, she no longer has the full class. She should keep everyone and only tick the on-time ones. ON decides the ticks; WHERE removes rows.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, o.id AS delivered_order',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          "WHERE o.status = 'delivered'",
          'ORDER BY c.name;',
          'SELECT c.name, o.id AS delivered_order',
          'FROM customers c',
          "LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'delivered'",
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name | delivered_order',
          '------+-----------------',
          ' Asha |             101',
          ' Ravi |             102',
          '(2 rows)',
          '',
          ' name  | delivered_order',
          '-------+-----------------',
          ' Asha  |             101',
          ' Meera |            NULL',
          ' Priya |            NULL',
          ' Ravi  |             102',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 12, note: 'The trap: WHERE removes customers without a delivered order.' },
          { line: 16, note: 'The fix: the condition in ON only chooses which orders are attached.' }
        ],
        tryIt: "Add WHERE c.city = 'Pune' to the second query, before ORDER BY. That condition is about customers, so WHERE is the right place.",
        check: {
          question: 'Your LEFT JOIN result is missing customers with no match. What is the likely cause?',
          options: ['A WHERE condition on a right-table column, which removes the NULL rows', 'LEFT JOIN is too slow', 'Missing ORDER BY'],
          answer: 0,
          why: 'WHERE runs after the join and drops rows whose right-table columns are NULL. Move that condition into ON.'
        }
      },
      {
        title: 'RIGHT JOIN and FULL JOIN',
        say: [
          'There are two more outer joins. RIGHT JOIN keeps every row from the right table instead of the left. orders o RIGHT JOIN customers c keeps every customer, just like customers c LEFT JOIN orders o.',
          'Because any RIGHT JOIN can be written as a LEFT JOIN by swapping the tables, most developers only use LEFT JOIN. It makes queries easier to read: the table whose rows must all appear always comes first.',
          'FULL JOIN keeps every row from both sides. Rows that match are paired; unmatched rows from either table appear with NULLs on the other side. It is useful for comparing two lists and seeing what is in one, the other, or both.',
          'For example, comparing a list of students who registered with a list of students who attended: FULL JOIN shows who registered and attended, who registered but did not attend, and who attended without registering.',
          'FULL JOIN is used less often than LEFT JOIN, but when you need to compare two lists, it is the right tool. Knowing all four joins, and when to use each, is a standard interview topic.',
          'Comparing lists like this is common when checking data: payments in the bank statement against payments in your app, or students on the fee list against students on the attendance list. The rows with NULL on one side are exactly the ones someone needs to look into.'
        ],
        example: 'Comparing a wedding\'s invitation list with the list of guests who actually came: some were invited and came, some were invited but did not come, and a few came without an invitation. FULL JOIN shows all three groups at once.',
        code: lines(
          'CREATE TABLE registered (name text);',
          "INSERT INTO registered VALUES ('Asha'), ('Ravi'), ('Priya');",
          'CREATE TABLE attended (name text);',
          "INSERT INTO attended VALUES ('Asha'), ('Priya'), ('Karan');",
          'SELECT r.name AS registered, a.name AS attended',
          'FROM registered r',
          'FULL JOIN attended a ON a.name = r.name',
          'ORDER BY coalesce(r.name, a.name);'
        ),
        output: lines(
          ' registered | attended',
          '------------+----------',
          ' Asha       | Asha',
          ' NULL       | Karan',
          ' Priya      | Priya',
          ' Ravi       | NULL',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 7, note: 'FULL JOIN keeps unmatched rows from both lists.' },
          { line: 8, note: 'Sort by whichever name is present.' }
        ],
        tryIt: 'Change FULL JOIN to LEFT JOIN and run it. Karan, who attended without registering, disappears.',
        check: {
          question: 'Which join shows rows from both tables, even when they have no match?',
          options: ['FULL JOIN', 'INNER JOIN', 'LEFT JOIN'],
          answer: 0,
          why: 'FULL JOIN keeps unmatched rows from both sides. LEFT JOIN keeps only the left side\'s unmatched rows.'
        }
      },
      {
        title: 'Putting it together: a customer activity report',
        say: [
          'Let us build a report that a real shop would use to plan a marketing campaign: every customer, how many orders they placed, and how much they spent in total, including customers who have not ordered yet.',
          'Every customer must appear, so customers goes first with LEFT JOIN. Spending needs order_items and products too, so those are LEFT JOINed as well. The counts use count(DISTINCT o.id), because each order now appears once per product line. And the total uses coalesce so customers with nothing show 0.',
          'Notice count(DISTINCT o.id). After joining order lines, an order with two products appears twice. count(o.id) would count it twice; DISTINCT counts each order once. Always think about what one row means after a join.',
          'In today\'s practice, you will show every customer\'s order count, including 0, and find the products nobody ordered. Both are exactly the patterns from this lesson.',
          'Tomorrow you join many tables in a chain, and even join a table to itself, for example employees and their managers.'
        ],
        example: 'Before a festival sale, a shop sends messages to every customer: a thank-you to regular buyers, and a welcome offer to people who signed up but never bought. To do that, it needs every customer, with or without orders. That list is this report.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name,',
          '       count(DISTINCT o.id) AS orders,',
          '       coalesce(sum(p.price * oi.quantity), 0) AS spent',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'LEFT JOIN order_items oi ON oi.order_id = o.id',
          'LEFT JOIN products p ON p.id = oi.product_id',
          'GROUP BY c.id, c.name',
          'ORDER BY spent DESC, c.name;'
        ),
        output: lines(
          ' name  | orders | spent',
          '-------+--------+---------',
          ' Ravi  |      1 | 1200.00',
          ' Asha  |      2 |  330.00',
          ' Priya |      1 |   60.00',
          ' Meera |      0 |       0',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'DISTINCT: each order is counted once, even if it has several product lines.' },
          { line: 11, note: 'coalesce turns Meera\'s NULL total into 0.' },
          { line: 13, note: 'LEFT JOIN all the way down, so no customer is lost.' }
        ],
        tryIt: 'Change count(DISTINCT o.id) to count(o.id) and run it. Asha\'s count goes up, because her order 101 has two lines. Change it back.',
        check: {
          question: 'Why use count(DISTINCT o.id) after joining order_items?',
          options: ['An order with several product lines appears several times after the join', 'DISTINCT makes counting faster', 'count cannot count ids without DISTINCT'],
          answer: 0,
          why: 'Each product line repeats the order. DISTINCT counts each order once.'
        }
      }
    ],
    summary: [
      'LEFT JOIN keeps every row of the left table; unmatched right-side columns become NULL.',
      'Count with count(right_table.id) to get 0 for rows with no match; use coalesce for sums.',
      'Find missing matches with LEFT JOIN plus WHERE right_table.id IS NULL.',
      'Conditions on the right table belong in ON, not WHERE, or unmatched rows vanish.',
      'RIGHT JOIN is LEFT JOIN reversed; FULL JOIN keeps unmatched rows from both sides.'
    ],
    projectStep: {
      title: 'My Library: authors without books',
      steps: [
        'Add an author to your authors table who has no books yet.',
        'List every author with their number of books, showing 0 for the new author.',
        'Find authors with no books, using LEFT JOIN and IS NULL.',
        'List every author with their finished books only, putting the finished condition in ON.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 13,
    title: 'Joining Many Tables, and a Table to Itself',
    goal: 'You can chain several joins, choose the right join for each link, and join a table to itself.',
    minutes: 28,
    recap: 'Yesterday you kept unmatched rows with LEFT JOIN, counted zero correctly, and found rows with no match.',
    parts: [
      {
        title: 'Chaining joins step by step',
        say: [
          'Real questions often cross three or four tables. "Which products did Asha buy?" starts at customers, goes through orders and order_items, and ends at products. You write one JOIN for each step.',
          'Think of it as a path. Start from the table that holds your starting point, here customers. Then add one table at a time, each joined to one that is already in the query, using the foreign key between them.',
          'Each JOIN line has its own ON rule. customers to orders uses orders.customer_id = customers.id. orders to order_items uses order_items.order_id = orders.id. order_items to products uses products.id = order_items.product_id.',
          'The order of the JOIN lines usually does not change the result for INNER JOINs; PostgreSQL chooses the fastest way to do them. But writing them in path order makes the query much easier to read and check.',
          'If you are unsure, build the query one join at a time. Run it after each JOIN, look at the rows, and only then add the next. This is how experienced developers write long queries too.',
          'Long join queries are easier to read if you format them the same way every time: one JOIN per line, each ON on the same line as its JOIN, and tables in path order. Your teammates will read your queries far more often than you write them, so consistent formatting is a kindness, and in code reviews it is often expected.'
        ],
        example: 'Finding a friend\'s house in a new city: from the station take the bus to the market, from the market walk to the temple, from the temple it is the third house. Each step connects to the last one. A chain of joins is that set of directions through your tables.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name AS customer, o.id AS order_id, p.name AS product, oi.quantity',
          'FROM customers c',
          'JOIN orders o ON o.customer_id = c.id',
          'JOIN order_items oi ON oi.order_id = o.id',
          'JOIN products p ON p.id = oi.product_id',
          "WHERE c.name = 'Asha'",
          'ORDER BY o.id, p.name;'
        ),
        output: lines(
          ' customer | order_id | product  | quantity',
          '----------+----------+----------+----------',
          ' Asha     |      101 | Notebook |        3',
          ' Asha     |      101 | Pen      |       10',
          ' Asha     |      103 | Pen      |        5',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'Start from customers.' },
          { line: 11, note: 'Step 1: to orders. Step 2: to order_items. Step 3: to products.' },
          { line: 14, note: 'Then filter to one customer.' }
        ],
        tryIt: "Change the WHERE to c.name = 'Priya' and run it. What did Priya order?",
        check: {
          question: 'To go from customers to products, which tables must you join through?',
          options: ['orders and order_items', 'Only orders', 'None; customers and products link directly'],
          answer: 0,
          why: 'Customers link to orders, orders to order_items, and order_items to products. Each join follows one foreign key.'
        }
      },
      {
        title: 'Filtering and grouping across many tables',
        say: [
          'With several tables joined, you can filter on any of them and group by any of them. "Units of each product sold in delivered orders" filters on orders.status and groups by products.name, while summing order_items.quantity.',
          'This is where joins become powerful: a question that mixes information from four tables is still one query, usually just 8 to 10 lines long.',
          'As before, group by an id as well as a name when names might repeat. And think about what one row means before aggregating. After joining order lines, one row is one product in one order.',
          'Keep an eye on which join you use at each step. If the question is "every product, even unsold ones", products must be on the left with LEFT JOINs. If the question is only about things that were sold, INNER JOINs are right.',
          'Another useful check is to test the query with a customer you know well. If Asha placed two orders with three product lines in total, the joined result for her should have three rows before grouping. Checking one case by hand is often faster than staring at the whole result.',
          'When a report number looks too big, the usual cause is a join that multiplies rows, for example joining two different "many" tables to the same parent. Counting rows after each join helps you spot it.'
        ],
        example: 'A school asks: "how many science textbooks were issued to students in hostel B?". The answer needs students (hostel), issues (who got what) and books (subject). One question, three lists, one answer.',
        code: lines(
          MINI_SHOP,
          'SELECT p.name AS product, sum(oi.quantity) AS units',
          'FROM order_items oi',
          'JOIN orders o ON o.id = oi.order_id',
          'JOIN products p ON p.id = oi.product_id',
          "WHERE o.status = 'delivered'",
          'GROUP BY p.id, p.name',
          'ORDER BY units DESC;'
        ),
        output: lines(
          ' product  | units',
          '----------+-------',
          ' Pen      |    10',
          ' Notebook |     3',
          ' Backpack |     1',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 13, note: 'Only lines from delivered orders.' },
          { line: 14, note: 'One row per product, adding up the quantities.' }
        ],
        tryIt: "Remove the WHERE line and run it again. The Pen's units go up, because order 103 is only shipped.",
        check: {
          question: 'After joining orders and order_items, what does one row represent?',
          options: ['One product line in one order', 'One order', 'One customer'],
          answer: 0,
          why: 'order_items has one row per product per order, so the joined rows are at that level. Group to go back to orders.'
        }
      },
      {
        title: 'Self joins: a table joined to itself',
        say: [
          'Sometimes a table links to itself. In an employees table, each employee has a manager, who is also an employee. The manager_id column points to another row in the same table.',
          'To show each employee next to their manager\'s name, you join the employees table to itself. You list it twice in FROM with two different aliases: e for the employee, m for the manager.',
          'The ON rule matches the employee\'s manager_id with the manager\'s id: JOIN employees m ON m.id = e.manager_id. From then on, e.name is the employee and m.name is the manager, even though both come from the same table.',
          'The aliases are essential here. Without them, PostgreSQL could not tell which copy of the table you mean. Choose aliases that say the role, like e and m, or emp and mgr.',
          'Use LEFT JOIN if people without a manager, like the CEO, should still appear. With INNER JOIN, the person at the top disappears, because they have no manager to match.'
        ],
        example: 'In a family tree, every person has a mother, who is also a person in the same tree. To write "Ravi, son of Sunita", you look up Ravi, then look up his mother in the same tree. A self join does that lookup.',
        code: lines(
          'CREATE TABLE employees (id int PRIMARY KEY, name text, manager_id int REFERENCES employees(id));',
          "INSERT INTO employees VALUES (1, 'Anita', NULL), (2, 'Vikram', 1), (3, 'Sara', 1), (4, 'Joel', 2);",
          'SELECT e.name AS employee, m.name AS manager',
          'FROM employees e',
          'LEFT JOIN employees m ON m.id = e.manager_id',
          'ORDER BY e.id;'
        ),
        output: lines(
          ' employee | manager',
          '----------+---------',
          ' Anita    | NULL',
          ' Vikram   | Anita',
          ' Sara     | Anita',
          ' Joel     | Vikram',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'manager_id points to another row of the same table.' },
          { line: 4, note: 'e is the employee...' },
          { line: 5, note: '...and m is the same table again, playing the manager. LEFT JOIN keeps Anita, who has no manager.' }
        ],
        tryIt: 'Change LEFT JOIN to JOIN and run it. Anita, the boss, disappears because she has no manager.',
        check: {
          question: 'What makes a self join possible?',
          options: ['Listing the same table twice with two different aliases', 'A special SELF JOIN keyword', 'Copying the table first'],
          answer: 0,
          why: 'Two aliases let PostgreSQL treat the same table as two roles, like employee and manager.'
        }
      },
      {
        title: 'More uses of self joins',
        say: [
          'Self joins are not only for managers. Any time you need to compare rows of the same table with each other, a self join can help.',
          'For example, finding pairs of customers who live in the same city: join customers to itself on the city, and keep pairs where the first id is smaller than the second. The id rule avoids pairing a customer with themselves and avoids listing each pair twice.',
          'Another example is finding products in the same category with a price difference of less than 100 rupees, which could help a shop suggest cheaper alternatives. The join matches on category, and the WHERE compares prices.',
          'Self joins can create many rows quickly: a table with 1,000 customers can produce up to a million pairs. Always add a condition that keeps the pairs meaningful, like same city or same category.',
          'On Day 17 you will learn window functions, which can answer some "compare with other rows" questions, like "the previous order", without a self join.',
          'Self joins also appear with dates, for example comparing each day\'s sales with the day before by joining a daily sales table to itself on day = previous_day + 1. It works, but window functions make it simpler, which is one reason they are so popular.'
        ],
        example: 'A college wants to form study pairs from students in the same hostel. For each student, it looks down the same list for others in the same hostel. It is one list compared with itself.',
        code: lines(
          MINI_SHOP,
          'SELECT a.name AS customer_1, b.name AS customer_2, a.city',
          'FROM customers a',
          'JOIN customers b ON b.city = a.city AND a.id < b.id',
          'ORDER BY a.city;'
        ),
        output: lines(
          ' customer_1 | customer_2 | city',
          '------------+------------+------',
          ' Asha       | Priya      | Pune',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'Same city, and a.id < b.id so each pair appears once and nobody pairs with themselves.' }
        ],
        tryIt: 'Change a.id < b.id to a.id <> b.id and run it. Now each pair appears twice, once in each order.',
        check: {
          question: 'Why add a.id < b.id when pairing customers from the same city?',
          options: ['To avoid pairing a customer with themselves and listing each pair twice', 'To sort the result', 'Because ids must be compared in every join'],
          answer: 0,
          why: 'Without it, each customer matches themselves, and every pair appears as (A, B) and (B, A).'
        }
      },
      {
        title: 'Choosing the right join at each step',
        say: [
          'In a chain of joins, each JOIN can be INNER or LEFT, and the choice matters. A simple rule: start from the table whose rows must all appear, and use LEFT JOIN for every step after it.',
          'Why every step? If you LEFT JOIN orders to customers, but then INNER JOIN order_items to orders, customers with no orders lose their row at the second step, because their NULL order has no order_items to match. One INNER JOIN in the chain can undo the LEFT JOINs before it.',
          'If the question is only about things that exist on every side, like "products in delivered orders", INNER JOINs all the way are correct and simpler.',
          'Before writing a query, say the question out loud and underline the word "every". "Every customer" means customers first with LEFT JOINs. "Orders with their products" means INNER JOINs are fine.',
          'When a count looks too small after adding a join, check the join types. When it looks too big, check for a join that multiplies rows. These two checks solve most join bugs.',
          'In interviews, you may be asked to explain the difference between INNER and LEFT JOIN with a small example. Using customers and orders, and a customer with no orders, is a simple way to show it clearly, exactly like this week\'s examples.'
        ],
        example: 'A relay race needs every runner to pass the baton. If one runner in the middle drops it, it does not matter how well the first runners did: the baton is lost. One INNER JOIN in a chain of LEFT JOINs is that dropped baton.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name, count(oi.product_id) AS lines',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'JOIN order_items oi ON oi.order_id = o.id',
          'GROUP BY c.id, c.name ORDER BY c.name;',
          'SELECT c.name, count(oi.product_id) AS lines',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'LEFT JOIN order_items oi ON oi.order_id = o.id',
          'GROUP BY c.id, c.name ORDER BY c.name;'
        ),
        output: lines(
          ' name  | lines',
          '-------+-------',
          ' Asha  |     3',
          ' Priya |     1',
          ' Ravi  |     1',
          '(3 rows)',
          '',
          ' name  | lines',
          '-------+-------',
          ' Asha  |     3',
          ' Meera |     0',
          ' Priya |     1',
          ' Ravi  |     1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 12, note: 'An INNER JOIN after a LEFT JOIN: Meera is lost again.' },
          { line: 17, note: 'LEFT JOIN at every step: Meera stays, with 0 lines.' }
        ],
        tryIt: 'In the first query, change the order of the two JOIN lines and see whether the result changes.',
        check: {
          question: 'You LEFT JOIN customers to orders, then INNER JOIN order_items. What happens to customers with no orders?',
          options: ['They disappear, because the INNER JOIN finds no order_items for them', 'They stay with NULLs', 'They appear twice'],
          answer: 0,
          why: 'Their NULL order row has nothing to match in order_items, so the INNER JOIN removes it. Use LEFT JOIN at every step.'
        }
      },
      {
        title: 'Putting it together: who bought what',
        say: [
          'Let us write a report that crosses all four shop tables: for each customer, the list of different products they have bought, in one row, and how many units in total.',
          'string_agg is an aggregate that joins text from many rows into one, with a separator you choose: string_agg(DISTINCT p.name, \', \') gives "Notebook, Pen". Adding ORDER BY inside it keeps the list in a fixed order.',
          'The query starts from customers with LEFT JOINs all the way, so Meera appears, with no products and 0 units. It groups by the customer and uses coalesce for the units.',
          'In today\'s practice, you will add up units sold per product in delivered orders, and show each employee with their manager\'s name. Both come straight from this lesson.',
          'Tomorrow you learn to combine the results of two queries on top of each other with UNION, and to compare lists with INTERSECT and EXCEPT.'
        ],
        example: 'A shop\'s customer card might say: "Asha: Notebook, Pen, 18 items so far". Behind that one line are four tables joined together and summarised per customer.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name,',
          "       string_agg(DISTINCT p.name, ', ' ORDER BY p.name) AS products,",
          '       coalesce(sum(oi.quantity), 0) AS units',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'LEFT JOIN order_items oi ON oi.order_id = o.id',
          'LEFT JOIN products p ON p.id = oi.product_id',
          'GROUP BY c.id, c.name',
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name  | products      | units',
          '-------+---------------+-------',
          ' Asha  | Notebook, Pen |    18',
          ' Meera | NULL          |     0',
          ' Priya | Notebook      |     1',
          ' Ravi  | Backpack      |     1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'string_agg joins the product names into one text, A to Z, each once.' },
          { line: 13, note: 'LEFT JOIN at every step, so every customer appears.' }
        ],
        tryIt: "Change the separator from ', ' to ' + ' and run it again.",
        check: {
          question: 'What does string_agg(p.name, \', \') do?',
          options: ['Joins the names from many rows into one text, separated by commas', 'Counts the names', 'Splits a name into letters'],
          answer: 0,
          why: 'string_agg is an aggregate for text: it combines values from the rows in a group into one string.'
        }
      }
    ],
    summary: [
      'Chain joins one step at a time, each following one foreign key.',
      'Filter and group on any joined table; think about what one row means first.',
      'A self join uses the same table twice with two aliases, like employee and manager.',
      'Start from the table that must keep every row, and use LEFT JOIN at every step after it.',
      'string_agg joins text from many rows into one, like a list of products.'
    ],
    projectStep: {
      title: 'My Library: series and sequels',
      steps: [
        'Add a sequel_of int REFERENCES books(id) column to your books design.',
        'Mark one book as the sequel of another.',
        'Use a self join to show each book next to the book it follows.',
        'Use string_agg to list all your book titles per author in one row.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 14,
    title: 'Combining Results: UNION, INTERSECT, EXCEPT',
    goal: 'You can stack results with UNION and UNION ALL, and compare lists with INTERSECT and EXCEPT.',
    minutes: 28,
    recap: 'Yesterday you chained joins across many tables and joined a table to itself.',
    parts: [
      {
        title: 'UNION: stacking results',
        say: [
          'Joins put tables side by side. Sometimes you want to stack results on top of each other instead: the cities of customers and the cities of stores in one list, or this year\'s orders and last year\'s archived orders together.',
          'UNION does this. You write two complete SELECT queries with UNION between them, and PostgreSQL returns the rows of both as one result.',
          'Plain UNION also removes duplicate rows. If Pune appears in both lists, it appears only once in the result. That is handy for "every city we are in", where you want each city once.',
          'The column names in the result come from the first query. So give good names with AS in the first SELECT; the names in the second one are ignored.',
          'ORDER BY applies to the whole combined result, so write it once at the very end, after the last SELECT. You cannot sort each part separately with a plain ORDER BY in the middle.',
          'UNION is also handy when data about the same kind of thing is split across tables for historical reasons, such as an old system and a new one. Rather than changing both tables, a UNION query can present them as one list while the teams decide how to merge them properly.'
        ],
        example: 'Two teachers each have an attendance list for a joint event. To send one thank-you message to everyone, you put both lists together and cross out names that appear twice. That combined list without repeats is UNION.',
        code: lines(
          MINI_SHOP,
          'CREATE TABLE stores (city text);',
          "INSERT INTO stores VALUES ('Pune'), ('Bengaluru'), ('Delhi');",
          'SELECT city AS place FROM customers WHERE city IS NOT NULL',
          'UNION',
          'SELECT city FROM stores',
          'ORDER BY place;'
        ),
        output: lines(
          ' place',
          '-----------',
          ' Bengaluru',
          ' Delhi',
          ' Mumbai',
          ' Pune',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'The first query names the column: place.' },
          { line: 12, note: 'UNION stacks the two results and removes duplicates, so Pune appears once.' },
          { line: 14, note: 'One ORDER BY for the whole result, at the end.' }
        ],
        tryIt: 'Remove WHERE city IS NOT NULL from the first query and run it. A NULL place appears for Meera.',
        check: {
          question: 'What does UNION do with a row that appears in both queries?',
          options: ['Shows it once', 'Shows it twice', 'Removes it completely'],
          answer: 0,
          why: 'Plain UNION removes duplicates. UNION ALL, next, keeps them.'
        }
      },
      {
        title: 'UNION ALL: keep every row',
        say: [
          'UNION ALL stacks results like UNION, but keeps every row, including duplicates. It is also faster, because PostgreSQL does not have to check for duplicates.',
          'Use UNION ALL when duplicates are real and meaningful. For example, combining this year\'s orders with archived orders: two different orders with the same amount are still two orders, and removing one would make totals wrong.',
          'Use plain UNION when you want a list of distinct values, like "every city we operate in".',
          'A common mistake is using UNION out of habit, and then wondering why a total is too small. If you are adding up or counting afterwards, you almost always want UNION ALL.',
          'Removing duplicates also costs time. To find duplicates, PostgreSQL has to sort or compare every row, which is noticeable on large results. So UNION ALL is not only more correct for totals, it is also faster. Use plain UNION only when you really want each value once.',
          'You can stack more than two queries: SELECT ... UNION ALL SELECT ... UNION ALL SELECT .... Each part must still follow the rules in the next part of this lesson.'
        ],
        example: 'Adding up a family\'s expenses from three people\'s notebooks: if two people both bought tea for 20 rupees, both expenses are real. Crossing one out as a "duplicate" would make the total wrong. That is why totals use UNION ALL.',
        code: lines(
          'CREATE TABLE orders_2026 (id int, amount numeric(10,2));',
          'INSERT INTO orders_2026 VALUES (1, 500), (2, 250);',
          'CREATE TABLE orders_2025 (id int, amount numeric(10,2));',
          'INSERT INTO orders_2025 VALUES (7, 250), (8, 900);',
          'SELECT sum(amount) AS total_with_union FROM (SELECT amount FROM orders_2026 UNION SELECT amount FROM orders_2025) AS t;',
          'SELECT sum(amount) AS total_with_union_all FROM (SELECT amount FROM orders_2026 UNION ALL SELECT amount FROM orders_2025) AS t;'
        ),
        output: lines(
          ' total_with_union',
          '------------------',
          '          1650.00',
          '(1 row)',
          '',
          ' total_with_union_all',
          '----------------------',
          '              1900.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 5, note: 'UNION drops one of the two 250s, so the total is wrong.' },
          { line: 6, note: 'UNION ALL keeps both, so the total is right. (A query in brackets in FROM is a subquery; more on Day 15.)' }
        ],
        tryIt: 'Add a third year table with one order of 500, and include it with another UNION ALL in the second query.',
        check: {
          question: 'You are combining two lists of payments to add them up. Which should you use?',
          options: ['UNION ALL', 'UNION', 'INTERSECT'],
          answer: 0,
          why: 'Two separate payments can have the same amount. UNION would drop one; UNION ALL keeps every row, so the sum is correct.'
        }
      },
      {
        title: 'The rules for combining queries',
        say: [
          'UNION, INTERSECT and EXCEPT have two simple rules. First, every query must return the same number of columns. Second, the columns in the same position must have compatible types: text with text, numbers with numbers.',
          'The columns are matched by position, not by name. The first column of the second query goes under the first column of the first query, whatever it is called. So always list the columns in the same order in every part.',
          'If one table has a column the other does not, you can fill the gap with a fixed value: SELECT name, \'customer\' AS kind FROM customers UNION ALL SELECT name, \'supplier\' FROM suppliers. The fixed text column also tells you where each row came from.',
          'If the types do not match, PostgreSQL gives an error that says UNION types cannot be matched. Cast one side, for example with ::text, when you really need to combine them.',
          'These rules make sense when you imagine the result: one table with one set of columns. Each part must fit into those columns.',
          'When combining text and numbers in a report, it is often clearer to convert everything to text in the parts that need it, for example amount::text, and to label each row with a kind column. The reader then always knows what a row is, even though it came from a different table.'
        ],
        example: 'Stacking two spreadsheets on top of each other only works if the columns line up: name above name, phone above phone. If one sheet has phone in column B and the other has it in column C, the combined sheet is a mess. SQL insists on lined-up columns.',
        code: lines(
          'CREATE TABLE customers (name text, city text);',
          "INSERT INTO customers VALUES ('Asha', 'Pune'), ('Ravi', 'Mumbai');",
          'CREATE TABLE suppliers (company text, city text);',
          "INSERT INTO suppliers VALUES ('Paper Mart', 'Pune');",
          "SELECT name, city, 'customer' AS kind FROM customers",
          'UNION ALL',
          "SELECT company, city, 'supplier' FROM suppliers",
          'ORDER BY city, name;',
          'SELECT name, city FROM customers UNION SELECT company FROM suppliers;'
        ),
        output: lines(
          ' name       | city   | kind',
          '------------+--------+----------',
          ' Ravi       | Mumbai | customer',
          ' Asha       | Pune   | customer',
          ' Paper Mart | Pune   | supplier',
          '(3 rows)',
          '',
          '[Error] each UNION query must have the same number of columns'
        ),
        codeNotes: [
          { line: 5, note: 'A fixed text column records where each row came from.' },
          { line: 7, note: 'company goes under name because it is in the same position.' },
          { line: 9, note: 'Two columns on one side and one on the other: an error.' }
        ],
        tryIt: 'Fix line 9 by giving the suppliers part two columns: SELECT name, city FROM customers UNION SELECT company, city FROM suppliers; Now both queries work.',
        check: {
          question: 'How are columns matched between the two queries of a UNION?',
          options: ['By position: first with first, second with second', 'By column name', 'Alphabetically'],
          answer: 0,
          why: 'UNION lines columns up by their position. The names in the result come from the first query.'
        }
      },
      {
        title: 'INTERSECT and EXCEPT: comparing lists',
        say: [
          'INTERSECT returns only the rows that appear in both queries. "Cities where we have both customers and a store" is customers\' cities INTERSECT store cities.',
          'EXCEPT returns the rows of the first query that do not appear in the second. "Cities where we have customers but no store yet" is customers\' cities EXCEPT store cities. The order matters: A EXCEPT B is not the same as B EXCEPT A.',
          'Like UNION, both remove duplicates by default, and both follow the same rules about the number and types of columns. INTERSECT ALL and EXCEPT ALL exist too, but they are rarely needed.',
          'These questions could also be answered with joins or subqueries, which you will learn tomorrow. But for simple list comparisons, INTERSECT and EXCEPT are often the clearest way to write them, because they read almost like the question.',
          'EXCEPT is especially useful for checking data. For example, "ids in the old system EXCEPT ids in the new system" shows records that were not copied during a migration.',
          'INTERSECT and EXCEPT compare whole rows, not single columns. If you select both city and state, a row matches only when both values match. This makes them precise, but it also means you should select only the columns you want to compare, or rows that differ in some other column will not match.'
        ],
        example: 'Comparing two shopping lists: things on both lists (INTERSECT), and things on your list but not on your roommate\'s (EXCEPT), so you know what only you need to buy.',
        code: lines(
          MINI_SHOP,
          'CREATE TABLE stores (city text);',
          "INSERT INTO stores VALUES ('Pune'), ('Bengaluru'), ('Delhi');",
          'SELECT city FROM customers INTERSECT SELECT city FROM stores;',
          'SELECT city FROM customers WHERE city IS NOT NULL EXCEPT SELECT city FROM stores;',
          'SELECT city FROM stores EXCEPT SELECT city FROM customers ORDER BY city;'
        ),
        output: lines(
          ' city',
          '------',
          ' Pune',
          '(1 row)',
          '',
          ' city',
          '--------',
          ' Mumbai',
          '(1 row)',
          '',
          ' city',
          '-----------',
          ' Bengaluru',
          ' Delhi',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'In both lists: only Pune.' },
          { line: 12, note: 'Customers\' cities without a store: Mumbai.' },
          { line: 13, note: 'The other way round: store cities with no customers yet.' }
        ],
        tryIt: "Add a store in Mumbai to the setup and run again. The second result becomes empty.",
        check: {
          question: 'What does SELECT city FROM customers EXCEPT SELECT city FROM stores return?',
          options: ['Customer cities that have no store', 'Store cities that have no customers', 'Cities in both'],
          answer: 0,
          why: 'EXCEPT keeps rows of the first query that are missing from the second. Swap the queries to get the other direction.'
        }
      },
      {
        title: 'UNION with joins and totals',
        say: [
          'Each part of a UNION can be a full query with joins, WHERE and GROUP BY. This lets you build reports that combine different kinds of information in one list.',
          'A common example is an activity feed: new orders from one table and new reviews from another, shown together in date order. Each part selects a date, a type and a description, and UNION ALL stacks them.',
          'You can also wrap a UNION in brackets and use it as a table in FROM, as you saw in part 2. That lets you group and total the combined rows, for example total spending across current and archived orders per customer.',
          'When the combined result is used again and again, it can be saved as a view, which you will learn on Day 24. Views make complex UNIONs easy to reuse.',
          'Keep each part simple and readable. If one part becomes very long, consider whether the data should really be in one table instead.',
          'The kind column in the example is worth copying in your own work. When results from several tables are stacked, a column that says where each row came from makes the result easy to filter later, for example to show only reviews, and it makes debugging much simpler.'
        ],
        example: 'A phone\'s notification screen shows messages, missed calls and app alerts in one list, newest first. They come from different places, but each has a time and a short text, so they can be stacked into one feed.',
        code: lines(
          'CREATE TABLE orders (id int, customer text, created_at date);',
          "INSERT INTO orders VALUES (1, 'Asha', '2026-09-10'), (2, 'Ravi', '2026-09-12');",
          'CREATE TABLE reviews (id int, customer text, rating int, created_at date);',
          "INSERT INTO reviews VALUES (1, 'Asha', 5, '2026-09-11'), (2, 'Priya', 3, '2026-09-13');",
          "SELECT created_at, 'order' AS kind, customer || ' placed order ' || id AS event FROM orders",
          'UNION ALL',
          "SELECT created_at, 'review', customer || ' gave ' || rating || ' stars' FROM reviews",
          'ORDER BY created_at DESC;'
        ),
        output: lines(
          ' created_at | kind   | event',
          '------------+--------+---------------------',
          ' 2026-09-13 | review | Priya gave 3 stars',
          ' 2026-09-12 | order  | Ravi placed order 2',
          ' 2026-09-11 | review | Asha gave 5 stars',
          ' 2026-09-10 | order  | Asha placed order 1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'Each part has the same three columns: date, kind and a readable event.' },
          { line: 8, note: 'The whole feed, newest first.' }
        ],
        tryIt: "Add LIMIT 3 at the end to show only the three newest events.",
        check: {
          question: 'What must be the same in both parts of the activity-feed UNION ALL?',
          options: ['The number of columns and their types, in the same order', 'The table names', 'The WHERE conditions'],
          answer: 0,
          why: 'Each part must return the same number of columns with compatible types, lined up by position.'
        }
      },
      {
        title: 'Putting it together: where the shop is',
        say: [
          'Let us answer three questions a growing shop might ask when planning where to open new stores, using today\'s three tools.',
          'Every city we are present in, with customers or stores: UNION. Cities with both customers and a store: INTERSECT. Cities with customers but no store yet, where a new store might be a good idea: EXCEPT.',
          'Each question is one short query, and each reads almost like the English question. That is the strength of these operators for list comparisons.',
          'In today\'s practice, you will list all cities with UNION, making sure each appears once, and find cities with customers but no store with EXCEPT.',
          'Tomorrow you learn subqueries: queries inside queries. They let you use the result of one question, like the average price, inside another question, like "products above the average".'
        ],
        example: 'A company planning expansion puts two lists on the table: where our customers are, and where our stores are. Where the lists differ is where the opportunities are.',
        code: lines(
          MINI_SHOP,
          'CREATE TABLE stores (city text);',
          "INSERT INTO stores VALUES ('Pune'), ('Bengaluru'), ('Delhi');",
          'SELECT count(*) AS cities_present FROM (SELECT city FROM customers WHERE city IS NOT NULL UNION SELECT city FROM stores) AS all_cities;',
          'SELECT city AS both_customers_and_store FROM customers INTERSECT SELECT city FROM stores;',
          'SELECT city AS store_opportunity FROM customers WHERE city IS NOT NULL EXCEPT SELECT city FROM stores;'
        ),
        output: lines(
          ' cities_present',
          '----------------',
          '              4',
          '(1 row)',
          '',
          ' both_customers_and_store',
          '--------------------------',
          ' Pune',
          '(1 row)',
          '',
          ' store_opportunity',
          '-------------------',
          ' Mumbai',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'Count the distinct cities from both lists.' },
          { line: 13, note: 'Where a new store might be a good idea.' }
        ],
        tryIt: "Add a new customer in Chennai to the setup: INSERT INTO customers VALUES (5, 'Arjun', 'Chennai'); and run again. Chennai becomes another opportunity.",
        check: {
          question: 'Which operator answers "cities with customers but no store"?',
          options: ['EXCEPT', 'UNION', 'INTERSECT'],
          answer: 0,
          why: 'EXCEPT keeps the cities from the first query (customers) that are missing from the second (stores).'
        }
      }
    ],
    summary: [
      'UNION stacks two results and removes duplicates; UNION ALL keeps every row.',
      'Use UNION ALL for totals and counts, so real duplicates are not lost.',
      'Every part needs the same number of columns with compatible types, matched by position.',
      'INTERSECT keeps rows in both results; EXCEPT keeps rows in the first but not the second.',
      'Names come from the first query; ORDER BY goes once, at the end.'
    ],
    projectStep: {
      title: 'My Library: books to read and books read',
      steps: [
        'Create a wishlist table with a title column and add 3 books you want to read.',
        'List every title from your books and your wishlist together with UNION.',
        'Find wishlist titles you already own with INTERSECT.',
        'Find wishlist titles you do not own yet with EXCEPT.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 15,
    title: 'Queries Inside Queries: Subqueries',
    goal: 'You can use subqueries that return one value, a list for IN, a table in FROM, and EXISTS checks.',
    minutes: 28,
    recap: 'Yesterday you stacked results with UNION and compared lists with INTERSECT and EXCEPT.',
    parts: [
      {
        title: 'A subquery that returns one value',
        say: [
          'Some questions have two steps. "Which products cost more than the average price?" First you need the average price. Then you compare each product with it. A subquery lets you do both steps in one query.',
          'A subquery is a SELECT inside brackets, placed inside another query. (SELECT avg(price) FROM products) works out the average, and the outer query uses it: WHERE price > (SELECT avg(price) FROM products).',
          'PostgreSQL runs the inner query first, gets one number, and then uses that number for every row of the outer query. You do not need to know the average yourself, and the answer stays correct when prices change.',
          'A subquery used like this must return exactly one value: one row, one column. If it returns several rows, PostgreSQL gives an error, because it cannot compare a price with a whole list.',
          'You can also put a one-value subquery in the SELECT list, to show it next to every row: SELECT name, price, (SELECT avg(price) FROM products) AS average. That makes it easy to compare each row with the overall figure.',
          'Because the inner query is recalculated every time you run the outer query, the result always reflects the current data. If a new expensive product is added tomorrow, the average changes, and so does the list of products above it, without anyone editing the query.'
        ],
        example: 'A teacher says: "stand up if your marks are above the class average". First she works out the average, then each student compares their own marks with it. The average is the subquery; the comparison is the outer query.',
        code: lines(
          MINI_SHOP,
          'SELECT round(avg(price), 2) AS average_price FROM products;',
          'SELECT name, price',
          'FROM products',
          'WHERE price > (SELECT avg(price) FROM products)',
          'ORDER BY price DESC;'
        ),
        output: lines(
          ' average_price',
          '---------------',
          '        355.00',
          '(1 row)',
          '',
          ' name     | price',
          '----------+---------',
          ' Backpack | 1200.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 9, note: 'On its own, the average is 355.00.' },
          { line: 12, note: 'The subquery in brackets gives that one number; each product is compared with it.' }
        ],
        tryIt: 'Change > to < to find the products below the average. Then add the average as a third column with (SELECT round(avg(price), 2) FROM products) AS average.',
        check: {
          question: 'What must a subquery used in WHERE price > (...) return?',
          options: ['Exactly one value', 'A list of values', 'A whole table'],
          answer: 0,
          why: 'Comparing with > needs a single value. A subquery returning several rows here causes an error.'
        }
      },
      {
        title: 'IN with a subquery',
        say: [
          'On Day 5 you used IN with a fixed list: status IN (\'delivered\', \'shipped\'). The list can also come from a subquery. customer_id IN (SELECT id FROM customers WHERE city = \'Pune\') means "orders from any customer in Pune".',
          'This subquery can return many rows, but only one column. PostgreSQL builds the list, then keeps the outer rows whose value is in it.',
          'Many questions can be written either with a join or with IN and a subquery. "Customers who have a delivered order" can be a join with DISTINCT, or WHERE id IN (SELECT customer_id FROM orders WHERE status = \'delivered\'). The IN version often reads more like the question.',
          'NOT IN finds the opposite: customers whose id is not in the list. But remember the NULL trap from Day 5: if the subquery\'s list contains a NULL, NOT IN finds nothing at all. That is why many developers prefer NOT EXISTS for "not in", which you will see in part 4.',
          'An IN subquery runs once, independently of the outer rows. That makes it easy to test: run the inner SELECT on its own first and check that the list is what you expect.'
        ],
        example: 'A college notice says: "students who are in the cricket team may leave early". The office first makes the cricket team list, then checks each student against it. The team list is the subquery.',
        code: lines(
          MINI_SHOP,
          "SELECT customer_id FROM orders WHERE status = 'delivered';",
          'SELECT name',
          'FROM customers',
          "WHERE id IN (SELECT customer_id FROM orders WHERE status = 'delivered')",
          'ORDER BY name;'
        ),
        output: lines(
          ' customer_id',
          '-------------',
          '           1',
          '           2',
          '(2 rows)',
          '',
          ' name',
          '------',
          ' Asha',
          ' Ravi',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Run the inner query on its own first: the list of customer ids.' },
          { line: 12, note: 'Keep customers whose id is in that list.' }
        ],
        tryIt: "Change 'delivered' to 'pending' inside the subquery. Who has a pending order?",
        check: {
          question: 'In WHERE id IN (SELECT customer_id FROM orders), how many columns may the subquery return?',
          options: ['One', 'Any number', 'Exactly two'],
          answer: 0,
          why: 'IN compares one value with a list, so the subquery must return a single column (it may have many rows).'
        }
      },
      {
        title: 'Subqueries in FROM',
        say: [
          'A subquery can also be used as a table, in the FROM part. You saw this briefly yesterday, when a UNION was wrapped in brackets and then summed. The inner query builds a temporary result, and the outer query treats it like a table.',
          'A subquery in FROM must have an alias: FROM (SELECT ...) AS t. The alias is the temporary table\'s name, used for its columns in the outer query.',
          'This is useful for two-step calculations. For example, first work out each order\'s total with GROUP BY, then find the average order total. You cannot write avg(sum(...)) directly, but you can average the column of an inner query that already did the sums.',
          'Another use is filtering on a calculated column. The inner query calculates price * 1.18 AS with_gst, and the outer query can then say WHERE with_gst > 1000, because now with_gst is a real column of the inner result.',
          'Subqueries in FROM can become hard to read when nested deeply. Tomorrow you learn WITH, which gives each step a name and makes the same queries much clearer.'
        ],
        example: 'A cook first prepares a basic gravy in one pot, then uses it as the base for three different dishes. The subquery in FROM is that gravy: prepared first, then used by the outer query as if it were a ready ingredient.',
        code: lines(
          MINI_SHOP,
          'SELECT round(avg(order_total), 2) AS average_order',
          'FROM (',
          '  SELECT oi.order_id, sum(p.price * oi.quantity) AS order_total',
          '  FROM order_items oi',
          '  JOIN products p ON p.id = oi.product_id',
          '  GROUP BY oi.order_id',
          ') AS totals;'
        ),
        output: lines(
          ' average_order',
          '---------------',
          '        397.50',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'The inner query: one row per order with its total.' },
          { line: 15, note: 'The alias names the temporary table.' },
          { line: 9, note: 'The outer query averages the inner totals.' }
        ],
        tryIt: 'Change avg to max in the first line to find the biggest order total.',
        check: {
          question: 'Why use a subquery in FROM to find the average order total?',
          options: ['You first need one total per order, then an average of those totals', 'avg only works in subqueries', 'To make the query shorter'],
          answer: 0,
          why: 'It is a two-step calculation: sum per order, then average across orders. The inner query does the first step.'
        }
      },
      {
        title: 'EXISTS and correlated subqueries',
        say: [
          'EXISTS asks a yes-or-no question: does the subquery return at least one row? WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id) keeps customers who have at least one order.',
          'Notice that the subquery mentions c.id, a column from the outer query. That makes it a correlated subquery: it runs once for each outer row, with that row\'s values. For Asha it checks Asha\'s orders, for Meera it checks Meera\'s orders, and so on.',
          'NOT EXISTS is the safest way to find rows with no match: customers with no orders, products never sold. Unlike NOT IN, it is not confused by NULLs. Many experienced developers use NOT EXISTS for every "has no" question.',
          'Inside EXISTS, it does not matter what you SELECT, only whether any row exists. That is why people write SELECT 1. PostgreSQL stops looking as soon as it finds one match, which makes EXISTS efficient.',
          'You now know three ways to find customers with no orders: LEFT JOIN with IS NULL, NOT IN, and NOT EXISTS. They usually give the same answer, but NOT EXISTS is the most reliable when NULLs are possible.'
        ],
        example: 'A receptionist checks for each visitor: "is there at least one appointment in your name today?". She does not need to count them, and she stops looking at the first one she finds. That is EXISTS, checked separately for each visitor.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name FROM customers c',
          'WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)',
          'ORDER BY c.name;',
          'SELECT c.name FROM customers c',
          'WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);'
        ),
        output: lines(
          ' name',
          '-------',
          ' Asha',
          ' Priya',
          ' Ravi',
          '(3 rows)',
          '',
          ' name',
          '-------',
          ' Meera',
          '(1 row)'
        ),
        codeNotes: [
          { line: 10, note: 'For each customer: is there at least one order with their id?' },
          { line: 13, note: 'NOT EXISTS: customers with no orders at all.' }
        ],
        tryIt: "Change the second query to find customers with no delivered order: add AND o.status = 'delivered' inside the subquery.",
        check: {
          question: 'What makes a subquery "correlated"?',
          options: ['It uses a column from the outer query, so it runs for each outer row', 'It returns exactly one value', 'It is inside FROM'],
          answer: 0,
          why: 'A correlated subquery refers to the outer row, like c.id, so its answer depends on which row is being checked.'
        }
      },
      {
        title: 'Subqueries in SELECT, and when to use a join instead',
        say: [
          'A correlated subquery can also go in the SELECT list, to calculate something for each row: SELECT c.name, (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS orders FROM customers c. For each customer, the subquery counts their orders.',
          'This is easy to read, and it naturally gives 0 for customers with no orders, without the LEFT JOIN count trap from Day 12.',
          'But it runs once per row. For a few thousand rows that is fine. For millions of rows, a join with GROUP BY is usually much faster, because PostgreSQL can process all the rows together.',
          'A useful rule: if you need several values from the other table, like count, sum and max, a join with GROUP BY is cleaner than three separate subqueries. If you need one simple value per row, a subquery in SELECT can be clearer.',
          'There is rarely only one correct way to write a query. Readability for your teammates and correctness come first; speed matters when the tables are big. You will learn to measure speed with EXPLAIN on Day 23.'
        ],
        example: 'A class teacher can ask each student one by one, "how many books did you read?". That works for a class of 40. For a school of 5,000, it is faster to collect all the reading logs and count them together. Subqueries per row are the one-by-one approach; joins with GROUP BY are the bulk approach.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name,',
          '       (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS orders,',
          '       (SELECT max(o.ordered_on) FROM orders o WHERE o.customer_id = c.id) AS last_order',
          'FROM customers c',
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name  | orders | last_order',
          '-------+--------+------------',
          ' Asha  |      2 | 2026-09-10',
          ' Meera |      0 | NULL',
          ' Priya |      1 | 2026-09-12',
          ' Ravi  |      1 | 2026-09-03',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'For each customer: count their orders. Meera gets 0 naturally.' },
          { line: 11, note: 'A second subquery for the latest order date; NULL when there is none.' }
        ],
        tryIt: 'Rewrite this report as a LEFT JOIN with GROUP BY c.id, c.name, using count(o.id) and max(o.ordered_on). Check you get the same result.',
        check: {
          question: 'When is a join with GROUP BY usually better than a subquery in SELECT?',
          options: ['On large tables, or when you need several values from the other table', 'Never', 'Only when there are no NULLs'],
          answer: 0,
          why: 'A subquery in SELECT runs once per row. A join with GROUP BY processes all rows together and can return several aggregates at once.'
        }
      },
      {
        title: 'Putting it together: finding the most valuable customers',
        say: [
          'Let us answer a question that needs several steps: "Which customers have spent more than the average customer?". First, the total spent by each customer. Second, the average of those totals. Third, the customers above it.',
          'The query below builds each customer\'s total in a subquery in FROM, and compares it with a one-value subquery that averages the same totals. It works, but notice how the same inner query appears twice. Tomorrow, WITH will let you write that step once and give it a name.',
          'This kind of layered question, "above average", "top per group", "more than their usual", is very common in business reports and data interviews. Subqueries are the tool that makes them possible.',
          'In today\'s practice, you will find products priced above the average price, and customers who have at least one delivered order.',
          'You have now finished the first half of the course. You can read, filter, sort, total, group, join and nest queries: the core of everyday SQL. Next comes making complex queries readable, and then the advanced tools that analysts and backend developers use every day.'
        ],
        example: 'A bank wants to invite its best customers to a special offer. It first works out each customer\'s total deposits, then the average, then invites those above it. Three steps, one answer.',
        code: lines(
          MINI_SHOP,
          'SELECT name, spent',
          'FROM (',
          '  SELECT c.name, sum(p.price * oi.quantity) AS spent',
          '  FROM customers c',
          '  JOIN orders o ON o.customer_id = c.id',
          '  JOIN order_items oi ON oi.order_id = o.id',
          '  JOIN products p ON p.id = oi.product_id',
          '  GROUP BY c.id, c.name',
          ') AS per_customer',
          'WHERE spent > (',
          '  SELECT avg(total) FROM (',
          '    SELECT sum(p.price * oi.quantity) AS total',
          '    FROM orders o',
          '    JOIN order_items oi ON oi.order_id = o.id',
          '    JOIN products p ON p.id = oi.product_id',
          '    GROUP BY o.customer_id',
          '  ) AS totals',
          ')',
          'ORDER BY spent DESC;'
        ),
        output: lines(
          ' name | spent',
          '------+---------',
          ' Ravi | 1200.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 11, note: 'Step 1: each customer\'s total spending.' },
          { line: 18, note: 'Steps 2 and 3: keep customers above the average of those totals.' },
          { line: 20, note: 'The same kind of per-customer total is calculated again here; WITH will fix that tomorrow.' }
        ],
        tryIt: 'Change the comparison in WHERE from > to < to find customers who spent less than the average.',
        check: {
          question: 'Why is the per-customer total calculated twice in this query?',
          options: ['Once to list customers and once inside the average; WITH can name it once instead', 'Because PostgreSQL requires it', 'To make the result more accurate'],
          answer: 0,
          why: 'Subqueries cannot be reused by name. WITH, tomorrow, lets you define a step once and use it several times.'
        }
      }
    ],
    summary: [
      'A subquery is a SELECT in brackets inside another query.',
      'One-value subqueries work with =, >, < and in the SELECT list.',
      'IN (SELECT ...) uses a one-column list; beware NULLs with NOT IN.',
      'A subquery in FROM needs an alias and is great for two-step calculations.',
      'EXISTS and NOT EXISTS check for matching rows; NOT EXISTS is safest for "has no".'
    ],
    projectStep: {
      title: 'My Library: above-average books',
      steps: [
        'Find your books with more pages than the average, using a subquery.',
        'Find authors who have at least one finished book, with IN or EXISTS.',
        'Find authors with no finished books, using NOT EXISTS.',
        'Show each author with their number of books using a subquery in SELECT.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 16,
    title: 'Readable Queries with WITH',
    goal: 'You can break a long query into named steps with WITH, reuse a step, and write recursive queries for sequences and hierarchies.',
    minutes: 28,
    recap: 'Yesterday you used subqueries: one value, IN lists, tables in FROM, and EXISTS checks.',
    parts: [
      {
        title: 'Why long queries need names',
        say: [
          'At the end of yesterday\'s lesson, the "customers above average" query calculated each customer\'s total twice, inside brackets inside brackets. It worked, but it was hard to read, and if you changed one copy and forgot the other, the answer would be wrong.',
          'WITH solves this. It lets you give a step a name, write it once at the top, and then use that name like a table in the rest of the query. The named step is called a CTE, short for common table expression.',
          'The shape is: WITH step_name AS ( SELECT ... ) SELECT ... FROM step_name. Read it like a recipe: "first make this, and call it step_name; then use it to make the final dish".',
          'A CTE only exists while that one query runs. It is not saved as a table, and it does not change any data. The next query starts fresh.',
          'The biggest benefit is readability. A complicated report becomes a series of small, named steps, each easy to check on its own. Analysts and backend developers write long reports this way every day.',
          'You can test each step separately: copy the SELECT inside the brackets, run it on its own, and check its rows before building the next step on top of it.'
        ],
        example: 'A good cooking recipe says: "Step 1, make the masala. Step 2, cook the vegetables. Step 3, add the masala to the vegetables." Each step has a name and is done once. WITH turns a long query into that kind of recipe.',
        code: lines(
          MINI_SHOP,
          'WITH order_totals AS (',
          '  SELECT oi.order_id, sum(p.price * oi.quantity) AS total',
          '  FROM order_items oi',
          '  JOIN products p ON p.id = oi.product_id',
          '  GROUP BY oi.order_id',
          ')',
          'SELECT order_id, total',
          'FROM order_totals',
          'WHERE total > 100',
          'ORDER BY total DESC;'
        ),
        output: lines(
          ' order_id | total',
          '----------+---------',
          '      102 | 1200.00',
          '      101 |  280.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'WITH gives the step a name: order_totals.' },
          { line: 17, note: 'The main query uses order_totals like a table.' }
        ],
        tryIt: 'Change the main query to SELECT count(*) AS big_orders FROM order_totals WHERE total > 100; and run it.',
        check: {
          question: 'What is a CTE made with WITH?',
          options: ['A named step that exists only while the query runs', 'A new table saved in the database', 'A copy of the whole database'],
          answer: 0,
          why: 'A CTE is a temporary, named result used by the rest of the query. It is not saved and does not change data.'
        }
      },
      {
        title: 'Several steps, one after another',
        say: [
          'A WITH can hold several steps, separated by commas. Each step can use the steps above it. This is how you build a report in layers.',
          'The shape is: WITH step_one AS ( ... ), step_two AS ( SELECT ... FROM step_one ... ) SELECT ... FROM step_two. There is only one WITH word at the top; the next steps just follow after commas.',
          'Now the "customers above average" question from yesterday becomes clear. Step one: each customer\'s total. Step two is not even needed as a separate table; the main query compares each total with the average of the same step.',
          'Because the step is written once, a change to how totals are calculated, for example leaving out cancelled orders, happens in exactly one place.',
          'Give steps descriptive names, like customer_totals or delivered_orders, not t1 and t2. The names are what make the query readable months later.',
          'A good way to plan a layered query is to write the steps in plain words first, as comments, and then fill in the SQL under each comment.',
          'WITH also works in front of INSERT, UPDATE and DELETE, not only SELECT. For example, a step can find the ids of old cancelled orders, and the DELETE that follows removes exactly those. You will not need this often yet, but it is good to know the tool is there.'
        ],
        example: 'A school report card is built in layers: first each subject\'s marks, then the total per student, then the class average, then who is above it. Each layer uses the one before. WITH lets you write those layers in order.',
        code: lines(
          MINI_SHOP,
          'WITH customer_totals AS (',
          '  SELECT c.name, sum(p.price * oi.quantity) AS spent',
          '  FROM customers c',
          '  JOIN orders o ON o.customer_id = c.id',
          '  JOIN order_items oi ON oi.order_id = o.id',
          '  JOIN products p ON p.id = oi.product_id',
          '  GROUP BY c.id, c.name',
          '),',
          'average AS (',
          '  SELECT avg(spent) AS avg_spent FROM customer_totals',
          ')',
          'SELECT ct.name, ct.spent, round(a.avg_spent, 2) AS average',
          'FROM customer_totals ct, average a',
          'WHERE ct.spent > a.avg_spent;'
        ),
        output: lines(
          ' name | spent   | average',
          '------+---------+---------',
          ' Ravi | 1200.00 |  530.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 9, note: 'Step 1: each customer\'s total, written once.' },
          { line: 17, note: 'Step 2 uses step 1: the average of those totals.' },
          { line: 21, note: 'average has one row, so listing it in FROM adds that one value to every customer row.' }
        ],
        tryIt: 'Remove the WHERE line and run it. You now see every customer with the average next to them.',
        check: {
          question: 'In WITH a AS (...), b AS (...) SELECT ..., which steps can b use?',
          options: ['a, because it is defined above b', 'Only tables, not a', 'Only the main query can use a'],
          answer: 0,
          why: 'Each step can use the steps defined before it. That is how layers are built.'
        }
      },
      {
        title: 'WITH versus subqueries',
        say: [
          'Anything you can write with WITH, you can usually write with subqueries too. So why prefer WITH? Mostly for people, not for the computer.',
          'A subquery is read from the inside out: you have to find the innermost brackets first. A WITH query is read from top to bottom, in the order the steps happen. That matches how people think about a problem.',
          'WITH also lets you use the same step several times without repeating it, as you saw with customer_totals. With subqueries, you would copy the same SQL twice.',
          'In modern PostgreSQL, a simple CTE is usually just as fast as the same subquery, because the database optimiser can merge them. So you can choose WITH for clarity without worrying about speed in most cases.',
          'Short, one-step questions are still fine as subqueries. WHERE price > (SELECT avg(price) FROM products) is perfectly clear. Reach for WITH when a query has two or more steps, or when a step is used twice.',
          'In job interviews, writing a multi-step answer with clearly named CTEs makes a strong impression, because the interviewer can follow your thinking step by step.'
        ],
        example: 'Directions to a friend\'s house can be given as one long sentence full of "after the thing that is next to the place where...", or as a numbered list. Both get you there, but the numbered list is much easier to follow. WITH is the numbered list.',
        code: lines(
          MINI_SHOP,
          '-- As a subquery:',
          'SELECT count(*) AS big_orders FROM (',
          '  SELECT oi.order_id FROM order_items oi JOIN products p ON p.id = oi.product_id',
          '  GROUP BY oi.order_id HAVING sum(p.price * oi.quantity) > 100',
          ') AS t;',
          '-- The same with WITH:',
          'WITH big_orders AS (',
          '  SELECT oi.order_id FROM order_items oi JOIN products p ON p.id = oi.product_id',
          '  GROUP BY oi.order_id HAVING sum(p.price * oi.quantity) > 100',
          ')',
          'SELECT count(*) AS big_orders FROM big_orders;'
        ),
        output: lines(
          ' big_orders',
          '------------',
          '          2',
          '(1 row)',
          '',
          ' big_orders',
          '------------',
          '          2',
          '(1 row)'
        ),
        codeNotes: [
          { line: 10, note: 'The subquery version: read the inside first.' },
          { line: 15, note: 'The WITH version: the step is named first, then used.' }
        ],
        tryIt: 'Change the limit from 100 to 1000 in both queries. Both answers change the same way, because they are the same query.',
        check: {
          question: 'What is the main reason to prefer WITH over nested subqueries?',
          options: ['It is easier to read top to bottom and a step can be reused', 'It is always much faster', 'Subqueries are not allowed in PostgreSQL'],
          answer: 0,
          why: 'WITH mainly helps people: named steps in order, written once. Speed is usually the same.'
        }
      },
      {
        title: 'Recursive WITH: counting and sequences',
        say: [
          'WITH has a special form, WITH RECURSIVE, where a step refers to itself. It sounds strange, but it is the SQL way of repeating something until a condition stops it, like a loop.',
          'A recursive CTE has two parts joined by UNION ALL. The first part is the starting row, like SELECT 1. The second part takes the rows made so far and makes the next ones, like SELECT n + 1 FROM nums WHERE n < 10.',
          'PostgreSQL runs the starting part once, then runs the second part again and again on the newest rows, until it produces no new rows. The WHERE in the second part is what stops it.',
          'If you forget the stopping condition, the query runs forever. In the lesson editor, it is stopped after a few seconds, but on a real server it could run until someone notices. Always check the WHERE in the recursive part.',
          'A simple use is generating a list of dates, like every day of a month, to make sure a report shows days with no sales as zero. PostgreSQL also has generate_series for this, but the recursive form shows the idea.',
          'Recursive queries are an advanced topic. You do not need to use them often, but knowing how they work helps with the next part: walking through a hierarchy.'
        ],
        example: 'Counting stairs as you climb: start at step 1, and each time go up one, until you reach the top floor. The starting step is the first part; "go up one until the top" is the recursive part.',
        code: lines(
          'WITH RECURSIVE days(day) AS (',
          "  SELECT date '2026-09-01'",
          '  UNION ALL',
          "  SELECT day + 1 FROM days WHERE day < date '2026-09-05'",
          ')',
          'SELECT day, to_char(day, \'Dy\') AS weekday FROM days;'
        ),
        output: lines(
          ' day        | weekday',
          '------------+---------',
          ' 2026-09-01 | Tue',
          ' 2026-09-02 | Wed',
          ' 2026-09-03 | Thu',
          ' 2026-09-04 | Fri',
          ' 2026-09-05 | Sat',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'The starting row: 1 September.' },
          { line: 4, note: 'The next row is the day after, until 5 September. The WHERE stops it.' },
          { line: 6, note: 'Use the generated days like a table.' }
        ],
        tryIt: 'Change the end date to 2026-09-10 and run it. You get ten days.',
        check: {
          question: 'What stops a recursive CTE from running forever?',
          options: ['A WHERE condition in the recursive part that eventually produces no new rows', 'The UNION ALL keyword', 'The name of the CTE'],
          answer: 0,
          why: 'The recursive part runs until it returns no rows. Its WHERE condition is what makes that happen.'
        }
      },
      {
        title: 'Recursive WITH: walking a hierarchy',
        say: [
          'The most useful job for WITH RECURSIVE is walking down a tree of data: a company\'s reporting chain, categories and sub-categories, or folders inside folders.',
          'The starting part picks the top of the tree, for example the boss with no manager. The recursive part finds everyone whose manager is someone already found, level by level.',
          'You can carry extra information down the tree, like a level number that goes up by one each step, or a path of names that grows longer. That lets you show the whole structure clearly.',
          'Without recursion, you would need a separate self join for every level, and you would have to know in advance how deep the tree goes. The recursive CTE works for any depth.',
          'On large trees, add a limit on the level as a safety net, like WHERE level < 20, in case the data has a loop by mistake, for example two people listed as each other\'s manager.',
          'You will not write these every day, but when a question says "everyone under this manager" or "all sub-categories of electronics", recursive WITH is the tool.'
        ],
        example: 'A family tree drawn from a great-grandmother down: first her, then her children, then their children, each generation one level lower. Walking a hierarchy with recursion is drawing that tree one generation at a time.',
        code: lines(
          'CREATE TABLE employees (id int PRIMARY KEY, name text, manager_id int);',
          "INSERT INTO employees VALUES (1, 'Anita', NULL), (2, 'Vikram', 1), (3, 'Sara', 1), (4, 'Joel', 2), (5, 'Nisha', 4);",
          'WITH RECURSIVE chain AS (',
          "  SELECT id, name, 1 AS level, name AS path FROM employees WHERE manager_id IS NULL",
          '  UNION ALL',
          "  SELECT e.id, e.name, c.level + 1, c.path || ' > ' || e.name",
          '  FROM employees e JOIN chain c ON e.manager_id = c.id',
          ')',
          'SELECT level, name, path FROM chain ORDER BY path;'
        ),
        output: lines(
          ' level | name   | path',
          '-------+--------+-------------------------------',
          '     1 | Anita  | Anita',
          '     2 | Sara   | Anita > Sara',
          '     2 | Vikram | Anita > Vikram',
          '     3 | Joel   | Anita > Vikram > Joel',
          '     4 | Nisha  | Anita > Vikram > Joel > Nisha',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Start at the top: the person with no manager.' },
          { line: 6, note: 'Each step: people whose manager was already found, one level deeper, with a growing path.' },
          { line: 9, note: 'Sorting by path shows the tree in order.' }
        ],
        tryIt: "Add a new employee under Sara: (6, 'Ravi', 3) to the INSERT and run it. Ravi appears at level 3 under Sara.",
        check: {
          question: 'Why use a recursive CTE for "everyone under this manager"?',
          options: ['It works for any number of levels without knowing the depth in advance', 'Self joins are not allowed', 'It is the only way to use JOIN'],
          answer: 0,
          why: 'Each recursive step goes one level deeper, as many times as needed, so the depth does not have to be known.'
        }
      },
      {
        title: 'Putting it together: a monthly report in steps',
        say: [
          'Let us write a report the way professionals do: in named steps. The question is "for each customer, their delivered spending, and whether it is above the average customer\'s delivered spending".',
          'Step one keeps only delivered order lines with their values. Step two adds them up per customer. The main query compares each customer with the average of step two, and labels them.',
          'Each step is short and testable on its own. If the numbers look wrong, you can run step one alone and check the lines, then step two, and so on. That is much easier than debugging one giant query.',
          'In today\'s practice, you will use WITH to find orders with a total above 500, and WITH RECURSIVE to produce the numbers 1 to 10.',
          'Tomorrow you meet window functions, which calculate across rows without grouping them away: ranks, row numbers and the top item per group.',
          'Keep the habit you practised today: when a question has several steps, write them as named steps in a WITH. It is one of the clearest signs of a thoughtful SQL writer.'
        ],
        example: 'An accountant preparing a yearly summary works in labelled sheets: one for raw transactions, one for totals per client, one for the final comparison. Anyone can check each sheet. A WITH query is that set of labelled sheets.',
        code: lines(
          MINI_SHOP,
          'WITH delivered_lines AS (',
          '  SELECT o.customer_id, p.price * oi.quantity AS value',
          '  FROM orders o',
          '  JOIN order_items oi ON oi.order_id = o.id',
          '  JOIN products p ON p.id = oi.product_id',
          "  WHERE o.status = 'delivered'",
          '),',
          'per_customer AS (',
          '  SELECT customer_id, sum(value) AS spent FROM delivered_lines GROUP BY customer_id',
          ')',
          'SELECT c.name, pc.spent,',
          "       pc.spent > (SELECT avg(spent) FROM per_customer) AS above_average",
          'FROM per_customer pc',
          'JOIN customers c ON c.id = pc.customer_id',
          'ORDER BY pc.spent DESC;'
        ),
        output: lines(
          ' name | spent   | above_average',
          '------+---------+---------------',
          ' Ravi | 1200.00 | true',
          ' Asha |  280.00 | false',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Step 1: only delivered order lines, with their value.' },
          { line: 16, note: 'Step 2: one total per customer.' },
          { line: 20, note: 'Compare each total with the average of step 2.' }
        ],
        tryIt: "Change 'delivered' to 'shipped' in step 1 and run it. Only Asha has a shipped order.",
        check: {
          question: 'Why is a WITH query easier to debug than one big nested query?',
          options: ['Each named step can be run and checked on its own', 'WITH queries never have mistakes', 'PostgreSQL explains WITH errors better'],
          answer: 0,
          why: 'You can copy one step\'s SELECT, run it, and check its rows before looking at the next step.'
        }
      }
    ],
    summary: [
      'WITH name AS (...) names a step (a CTE) that the rest of the query uses like a table.',
      'Several steps are separated by commas; each can use the steps above it.',
      'WITH reads top to bottom and avoids repeating the same subquery.',
      'WITH RECURSIVE repeats a step until it returns no rows: sequences and hierarchies.',
      'Always make sure a recursive step has a condition that stops it.'
    ],
    projectStep: {
      title: 'My Library: a reading report in steps',
      steps: [
        'Write a WITH step that finds pages per author for finished books.',
        'Add a second step with the average of those totals.',
        'Show each author with their pages and whether they are above average.',
        'Use WITH RECURSIVE to list the numbers 1 to 12, one for each month of your reading goal.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 17,
    title: 'Ranking Rows: Window Functions',
    goal: 'You can number and rank rows with window functions, rank inside groups with PARTITION BY, and find the top item per group.',
    minutes: 28,
    recap: 'Yesterday you wrote readable multi-step queries with WITH, and walked sequences and hierarchies with WITH RECURSIVE.',
    parts: [
      {
        title: 'What a window function is',
        say: [
          'GROUP BY squeezes many rows into one row per group. But sometimes you want to keep every row and still calculate something across the rows, like each product\'s rank by price, or each product\'s price compared with its category average.',
          'Window functions do exactly that. They calculate across a set of rows, called a window, but they do not remove any rows. Every row stays, with a new column added.',
          'You recognise a window function by the word OVER after it. rank() OVER (ORDER BY price DESC) gives each product its position in a list sorted by price, most expensive first.',
          'Even normal aggregates become window functions when you add OVER. avg(price) OVER () shows the overall average price next to every product, without grouping them away.',
          'Window functions are one of the most asked-about topics in data analyst and backend interviews, because they answer "rank", "top N per group" and "compared with others" questions elegantly.',
          'They are calculated after WHERE and GROUP BY, just before ORDER BY. So they work on the rows that are left after filtering, which is usually exactly what you want.',
          'You can even use a window function on top of a GROUP BY result. For example, group sales by category to get each category\'s total, and then rank the categories by that total with rank() OVER (ORDER BY sum(amount) DESC), all in one query. The grouping happens first, then the ranking.'
        ],
        example: 'A class result sheet lists every student with their marks and their rank in the class. Nobody is removed from the sheet; the rank is just an extra column. That rank column is a window function.',
        code: lines(
          MINI_SHOP,
          'SELECT name, price,',
          '       rank() OVER (ORDER BY price DESC) AS price_rank,',
          '       round(avg(price) OVER (), 2) AS overall_average',
          'FROM products',
          'ORDER BY price_rank;'
        ),
        output: lines(
          ' name     | price   | price_rank | overall_average',
          '----------+---------+------------+-----------------',
          ' Backpack | 1200.00 |          1 |          355.00',
          ' Stapler  |  150.00 |          2 |          355.00',
          ' Notebook |   60.00 |          3 |          355.00',
          ' Pen      |   10.00 |          4 |          355.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'A rank based on price, highest first. Every product keeps its row.' },
          { line: 11, note: 'The overall average, shown on every row. OVER () means "all rows".' }
        ],
        tryIt: 'Add a column price - avg(price) OVER () AS above_average to see how far each price is from the average.',
        check: {
          question: 'What is the key difference between GROUP BY and a window function?',
          options: ['A window function keeps every row; GROUP BY returns one row per group', 'Window functions only work on dates', 'GROUP BY is faster in every case'],
          answer: 0,
          why: 'Window functions add a calculated column to each row without collapsing the rows.'
        }
      },
      {
        title: 'ROW_NUMBER, RANK and DENSE_RANK',
        say: [
          'There are three ways to number rows in order, and they differ only in how they treat ties, rows with the same value.',
          'row_number() gives 1, 2, 3, 4 with no repeats, even for ties. If two products have the same price, one gets 2 and the other gets 3, and which one is not guaranteed unless you add a tie-breaker to the ORDER BY.',
          'rank() gives tied rows the same number and then skips: 1, 2, 2, 4. It is like a sports result where two runners share second place and nobody is third.',
          'dense_rank() gives tied rows the same number but does not skip: 1, 2, 2, 3. Use it when you want "the 3rd highest price" to mean the 3rd different price.',
          'Which one to use depends on the question. For numbering rows or picking exactly one row per group, use row_number. For fair rankings with ties, use rank or dense_rank.',
          'Interviewers love this difference. A classic question is "find the second highest salary", and dense_rank is one of the cleanest answers, because it handles ties correctly.'
        ],
        example: 'In a race, two runners finish together in second place. The official results say 1st, 2nd, 2nd, 4th: that is rank. A medal list would say gold, silver, silver, bronze: that is dense_rank. The start list numbers everyone 1, 2, 3, 4: that is row_number.',
        code: lines(
          'CREATE TABLE scores (student text, marks int);',
          "INSERT INTO scores VALUES ('Asha', 92), ('Ravi', 88), ('Priya', 88), ('Karan', 75);",
          'SELECT student, marks,',
          '       row_number() OVER (ORDER BY marks DESC, student) AS row_num,',
          '       rank() OVER (ORDER BY marks DESC) AS rank,',
          '       dense_rank() OVER (ORDER BY marks DESC) AS dense_rank',
          'FROM scores',
          'ORDER BY marks DESC, student;'
        ),
        output: lines(
          ' student | marks | row_num | rank | dense_rank',
          '---------+-------+---------+------+------------',
          ' Asha    |    92 |       1 |    1 |          1',
          ' Priya   |    88 |       2 |    2 |          2',
          ' Ravi    |    88 |       3 |    2 |          2',
          ' Karan   |    75 |       4 |    4 |          3',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Always different numbers; student name breaks the tie.' },
          { line: 5, note: 'Ties share a rank, then a number is skipped.' },
          { line: 6, note: 'Ties share a rank, and no number is skipped.' }
        ],
        tryIt: "Give Karan 88 marks too and run it. Compare the three columns for the three students on 88.",
        check: {
          question: 'Marks are 92, 88, 88, 75. What dense_rank does 75 get?',
          options: ['3', '4', '2'],
          answer: 0,
          why: 'dense_rank does not skip numbers after a tie: 92 is 1, both 88s are 2, and 75 is 3. rank would give 4.'
        }
      },
      {
        title: 'PARTITION BY: ranking inside each group',
        say: [
          'Often you want a ranking inside each group, not across everything: the most expensive product in each category, the top student in each class, the latest order of each customer.',
          'PARTITION BY splits the rows into groups for the window function. rank() OVER (PARTITION BY category ORDER BY price DESC) ranks products by price separately inside each category. Each category starts again at 1.',
          'It is similar to GROUP BY, but again, no rows are removed. Every product stays, with its rank inside its own category.',
          'You can combine PARTITION BY with any window function: count(*) OVER (PARTITION BY category) shows the size of each product\'s category, and avg(price) OVER (PARTITION BY category) shows the category\'s average price next to each product.',
          'A handy example is percentages within a group: price / sum(price) OVER (PARTITION BY category) gives each product\'s share of its category\'s total. Multiply by 100 and round, and you have a column that shows at a glance which products dominate each category.',
          'That lets you compare each row with its own group, for example "this product is 200 rupees above its category average". With GROUP BY alone you would need a join back to the grouped result.',
          'Remember: PARTITION BY decides the groups, ORDER BY inside OVER decides the order within each group. Both go inside the brackets after OVER.'
        ],
        example: 'A school has three sections of class 10. Each section announces its own topper; section A\'s rank 1 and section B\'s rank 1 are different students. Ranking with PARTITION BY section is exactly that.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60), ('Pen', 'stationery', 10), ('Stapler', 'stationery', 150),",
          "  ('Headphones', 'electronics', 1499), ('Phone stand', 'electronics', 299);",
          'SELECT category, name, price,',
          '       rank() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category,',
          '       round(avg(price) OVER (PARTITION BY category), 2) AS category_average',
          'FROM products',
          'ORDER BY category, rank_in_category;'
        ),
        output: lines(
          ' category    | name        | price   | rank_in_category | category_average',
          '-------------+-------------+---------+------------------+------------------',
          ' electronics | Headphones  | 1499.00 |                1 |           899.00',
          ' electronics | Phone stand |  299.00 |                2 |           899.00',
          ' stationery  | Stapler     |  150.00 |                1 |            73.33',
          ' stationery  | Notebook    |   60.00 |                2 |            73.33',
          ' stationery  | Pen         |   10.00 |                3 |            73.33',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'Ranks restart at 1 in each category.' },
          { line: 6, note: 'Each product sees its own category\'s average.' }
        ],
        tryIt: 'Add count(*) OVER (PARTITION BY category) AS products_in_category to the SELECT.',
        check: {
          question: 'What does PARTITION BY category do inside OVER?',
          options: ['Calculates the window function separately for each category', 'Removes all but one row per category', 'Sorts the final result by category'],
          answer: 0,
          why: 'PARTITION BY makes separate windows per category. Rows are kept; only the calculation is per group.'
        }
      },
      {
        title: 'The top item per group',
        say: [
          'A very common question is "the top one (or top three) in each group": the latest order per customer, the best-selling product per category, the highest-paid employee per department.',
          'The recipe has two steps. First, number the rows inside each group with row_number() OVER (PARTITION BY group ORDER BY what_matters DESC). Second, keep only the rows where that number is 1, or at most 3 for a top three.',
          'You cannot use a window function directly in WHERE, because WHERE runs before window functions are calculated. So you put the first step in a WITH (or a subquery in FROM), and filter in the main query.',
          'Choose row_number when you want exactly one row per group, even if there is a tie. Choose rank when tied rows should all appear, for example two products sharing the top price.',
          'This two-step pattern, window function in a CTE and then WHERE rn = 1, appears in real reports every day. It is worth learning by heart.',
          'Before window functions existed, people solved this with complicated self joins or correlated subqueries. The window function way is shorter, clearer and usually faster.',
          'If a question asks for the top three per group, change the filter to rn <= 3. If it asks for everything except the top one, use rn > 1. The numbering step stays exactly the same; only the final WHERE changes, which makes the pattern easy to adapt.'
        ],
        example: 'Each hostel in a college picks its best cook for a festival. Inside each hostel, the students are ranked, and only number 1 from each hostel goes forward. Number inside each group, then keep the first.',
        code: lines(
          MINI_SHOP,
          'WITH numbered AS (',
          '  SELECT c.name, o.id AS order_id, o.ordered_on,',
          '         row_number() OVER (PARTITION BY c.id ORDER BY o.ordered_on DESC) AS rn',
          '  FROM customers c',
          '  JOIN orders o ON o.customer_id = c.id',
          ')',
          'SELECT name, order_id, ordered_on AS latest_order',
          'FROM numbered',
          'WHERE rn = 1',
          'ORDER BY name;'
        ),
        output: lines(
          ' name  | order_id | latest_order',
          '-------+----------+--------------',
          ' Asha  |      103 | 2026-09-10',
          ' Priya |      104 | 2026-09-12',
          ' Ravi  |      102 | 2026-09-03',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'Number each customer\'s orders, newest first.' },
          { line: 17, note: 'Keep only number 1: the latest order per customer.' }
        ],
        tryIt: 'Change ORDER BY o.ordered_on DESC to ASC inside OVER. Now you get each customer\'s first order instead.',
        check: {
          question: 'Why is the row_number step put inside WITH before filtering rn = 1?',
          options: ['WHERE runs before window functions, so it cannot filter on them directly', 'row_number only works inside WITH', 'To make the query faster'],
          answer: 0,
          why: 'Window functions are calculated after WHERE. Computing them in a CTE first lets the main query filter on the result.'
        }
      },
      {
        title: 'Comparing with the previous row: LAG and LEAD',
        say: [
          'Two more window functions look at neighbouring rows. lag(column) gives the value from the previous row in the window\'s order, and lead(column) gives the value from the next row.',
          'This makes "compared with last time" questions easy: this month\'s sales versus last month\'s, or the gap in days between a customer\'s orders.',
          'For the first row, there is no previous row, so lag returns NULL. You can give a default instead: lag(amount, 1, 0) uses 0. The number 1 means "one row back"; 2 would look two rows back.',
          'Combine lag with PARTITION BY to compare within each group, for example each customer\'s order with that same customer\'s previous order, not with someone else\'s.',
          'A typical calculation is the change: amount - lag(amount) OVER (ORDER BY month). With the growth as a percentage, this is the basis of many business charts.',
          'Tomorrow you will go further with frames, which let a window cover "the last 3 rows" or "everything so far", for running totals and moving averages.'
        ],
        example: 'A shopkeeper compares today\'s sales with yesterday\'s: "we sold 300 rupees more than yesterday". Looking one row back in time order is exactly what lag does.',
        code: lines(
          'CREATE TABLE monthly_sales (month date, amount numeric(10,2));',
          "INSERT INTO monthly_sales VALUES ('2026-06-01', 12000), ('2026-07-01', 15000), ('2026-08-01', 13500), ('2026-09-01', 18000);",
          'SELECT month, amount,',
          '       lag(amount) OVER (ORDER BY month) AS previous,',
          '       amount - lag(amount) OVER (ORDER BY month) AS change',
          'FROM monthly_sales',
          'ORDER BY month;'
        ),
        output: lines(
          ' month      | amount   | previous | change',
          '------------+----------+----------+----------',
          ' 2026-06-01 | 12000.00 |     NULL |     NULL',
          ' 2026-07-01 | 15000.00 | 12000.00 |  3000.00',
          ' 2026-08-01 | 13500.00 | 15000.00 | -1500.00',
          ' 2026-09-01 | 18000.00 | 13500.00 |  4500.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'The previous month\'s amount; NULL for the first month.' },
          { line: 5, note: 'The change from the previous month.' }
        ],
        tryIt: 'Add lead(amount) OVER (ORDER BY month) AS next_month and run it. The last month has no next month, so it shows NULL.',
        check: {
          question: 'What does lag(amount) OVER (ORDER BY month) return for the first month?',
          options: ['NULL, because there is no previous row', '0', 'The same month\'s amount'],
          answer: 0,
          why: 'The first row has no row before it. Use lag(amount, 1, 0) if you want a default instead of NULL.'
        }
      },
      {
        title: 'Putting it together: top products per category',
        say: [
          'Let us answer a question every shop asks: "What is the most expensive product in each category?", and "what are the top 2 by price overall, with ties handled fairly?".',
          'The first uses the top-per-group recipe: row_number with PARTITION BY category, then keep rn = 1. The second uses dense_rank across all products and keeps ranks 1 and 2.',
          'Notice how short and readable both queries are. The same questions with self joins or correlated subqueries would be much longer and harder to get right.',
          'In today\'s practice, you will rank products by price inside their category, and show the most expensive product in each category.',
          'Tomorrow you learn running totals and moving averages, which use window functions with frames, a way of saying exactly which rows each calculation should include.',
          'If you remember one thing from today: window functions add information to each row without removing rows, and PARTITION BY makes them work per group.'
        ],
        example: 'An online shop\'s category pages each show a "premium pick", the priciest item in that category. One query with a window function finds all of them at once.',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60), ('Pen', 'stationery', 10), ('Stapler', 'stationery', 150),",
          "  ('Headphones', 'electronics', 1499), ('Phone stand', 'electronics', 299), ('Backpack', 'bags', 1200), ('Tote bag', 'bags', 1200);",
          'WITH ranked AS (',
          '  SELECT category, name, price,',
          '         row_number() OVER (PARTITION BY category ORDER BY price DESC, name) AS rn',
          '  FROM products',
          ')',
          'SELECT category, name, price FROM ranked WHERE rn = 1 ORDER BY category;',
          'WITH ranked AS (',
          '  SELECT name, price, dense_rank() OVER (ORDER BY price DESC) AS dr FROM products',
          ')',
          'SELECT name, price, dr FROM ranked WHERE dr <= 2 ORDER BY dr, name;'
        ),
        output: lines(
          ' category    | name       | price',
          '-------------+------------+---------',
          ' bags        | Backpack   | 1200.00',
          ' electronics | Headphones | 1499.00',
          ' stationery  | Stapler    |  150.00',
          '(3 rows)',
          '',
          ' name       | price   | dr',
          '------------+---------+----',
          ' Headphones | 1499.00 |  1',
          ' Backpack   | 1200.00 |  2',
          ' Tote bag   | 1200.00 |  2',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'One row per category; the name breaks the tie between the two 1200 bags.' },
          { line: 11, note: 'dense_rank: both 1200 products share place 2.' }
        ],
        tryIt: 'In the first query, change row_number to rank and remove ", name" from its ORDER BY. Now both bags appear for the bags category.',
        check: {
          question: 'Two products tie for the top price in a category. Which function shows both as number 1?',
          options: ['rank() or dense_rank()', 'row_number()', 'lag()'],
          answer: 0,
          why: 'rank and dense_rank give tied rows the same number. row_number always gives different numbers.'
        }
      }
    ],
    summary: [
      'Window functions (with OVER) add a calculated column without removing rows.',
      'row_number never repeats; rank repeats ties then skips; dense_rank repeats ties without skipping.',
      'PARTITION BY makes the calculation separate for each group; ORDER BY inside OVER sets the order.',
      'Top per group: row_number in a WITH step, then WHERE rn = 1.',
      'lag and lead look at the previous or next row, for "compared with last time" questions.'
    ],
    projectStep: {
      title: 'My Library: ranking your books',
      steps: [
        'Rank your books by pages, longest first, with rank().',
        'Rank books by pages inside each author with PARTITION BY.',
        'Show each author\'s longest book using row_number and rn = 1.',
        'Show each book\'s pages next to the average pages of its author.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 18,
    title: 'Running Totals and Moving Averages',
    goal: 'You can calculate running totals, moving averages and period-over-period changes with window frames.',
    minutes: 28,
    recap: 'Yesterday you ranked rows with window functions, used PARTITION BY, and compared rows with lag and lead.',
    parts: [
      {
        title: 'Running totals with SUM OVER',
        say: [
          'A running total adds up values as you go down a list: the first day\'s sales, then the first two days together, then the first three, and so on. It answers "how much so far?", which is one of the most common questions in business.',
          'In SQL, it is a window function: sum(amount) OVER (ORDER BY day). The ORDER BY inside OVER is essential. It tells PostgreSQL to add up all rows from the start up to the current row, in date order.',
          'Without an ORDER BY inside OVER, sum(amount) OVER () gives the grand total on every row instead. That difference, one small ORDER BY, changes the meaning completely.',
          'Every row stays in the result. You see each day\'s own amount next to the total so far, which makes it easy to spot when a target was reached.',
          'Running totals also work per group with PARTITION BY, for example a running total of spending for each customer separately, restarting at zero for each one.',
          'In finance, running totals give account balances: each transaction\'s amount, and the balance after it. In sales, they show progress towards a monthly target.',
          'Running totals can also be turned into percentages of a goal. If the monthly target is 5,000, then round(sum(amount) OVER (ORDER BY day) / 5000 * 100) shows how far along the month the shop is each day, which is exactly the progress bar many sales dashboards show.'
        ],
        example: 'A savings jar where you add some money every day. Each evening you count the whole jar: that count is the running total. The daily amount is what you added; the running total is what you have so far.',
        code: lines(
          'CREATE TABLE daily_sales (day date, amount numeric(10,2));',
          "INSERT INTO daily_sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200), ('2026-09-03', 2097), ('2026-09-04', 760);",
          'SELECT day, amount,',
          '       sum(amount) OVER (ORDER BY day) AS running_total,',
          '       sum(amount) OVER () AS grand_total',
          'FROM daily_sales',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | amount  | running_total | grand_total',
          '------------+---------+---------------+-------------',
          ' 2026-09-01 |  280.00 |        280.00 |     4337.00',
          ' 2026-09-02 | 1200.00 |       1480.00 |     4337.00',
          ' 2026-09-03 | 2097.00 |       3577.00 |     4337.00',
          ' 2026-09-04 |  760.00 |       4337.00 |     4337.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'With ORDER BY: the total so far, day by day.' },
          { line: 5, note: 'Without ORDER BY: the grand total on every row.' }
        ],
        tryIt: 'Add a column showing each day\'s share of the grand total: round(amount / sum(amount) OVER () * 100, 1) AS percent.',
        check: {
          question: 'What turns sum(amount) OVER () into a running total?',
          options: ['Adding ORDER BY day inside OVER', 'Adding GROUP BY day', 'Adding LIMIT'],
          answer: 0,
          why: 'With ORDER BY inside OVER, the sum covers all rows from the start up to the current row.'
        }
      },
      {
        title: 'Frames: which rows the window covers',
        say: [
          'When you write ORDER BY inside OVER, PostgreSQL uses a default frame: all rows from the first one up to the current row. That is why sum becomes a running total. A frame is simply the set of rows the calculation looks at for each row.',
          'You can choose the frame yourself with ROWS BETWEEN. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW means "from the very first row to this one", which is the running total written out in full.',
          'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW means "this row and the two before it", a sliding window of three rows. That is the basis of a moving average.',
          'There is also FOLLOWING, for rows after the current one. ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING looks at the row before, this row and the row after.',
          'There is one subtle trap with the default frame: it uses RANGE, not ROWS, and treats rows with the same ORDER BY value as one. If two rows have the same date, both get the total including both. Writing ROWS explicitly, or adding a tie-breaker to the ORDER BY, avoids surprises.',
          'Frames sound technical, but the idea is simple: for each row, which neighbours should be included? Say it in words first, then write the frame.'
        ],
        example: 'Standing in a queue, you can look at "everyone ahead of me and me" (a running count), or "me and the two people just ahead" (a small sliding window). The frame is which people you choose to look at.',
        code: lines(
          'CREATE TABLE daily_sales (day date, amount numeric(10,2));',
          "INSERT INTO daily_sales VALUES ('2026-09-01', 100), ('2026-09-02', 200), ('2026-09-03', 300), ('2026-09-04', 400), ('2026-09-05', 500);",
          'SELECT day, amount,',
          '       sum(amount) OVER (ORDER BY day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS so_far,',
          '       sum(amount) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS last_3_days,',
          '       sum(amount) OVER (ORDER BY day ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) AS around',
          'FROM daily_sales',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | amount | so_far  | last_3_days | around',
          '------------+--------+---------+-------------+---------',
          ' 2026-09-01 | 100.00 |  100.00 |      100.00 |  300.00',
          ' 2026-09-02 | 200.00 |  300.00 |      300.00 |  600.00',
          ' 2026-09-03 | 300.00 |  600.00 |      600.00 |  900.00',
          ' 2026-09-04 | 400.00 | 1000.00 |      900.00 | 1200.00',
          ' 2026-09-05 | 500.00 | 1500.00 |     1200.00 |  900.00',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'From the first row to this row: the running total.' },
          { line: 5, note: 'This row and the two before it.' },
          { line: 6, note: 'The row before, this row and the row after.' }
        ],
        tryIt: 'Change 2 PRECEDING to 1 PRECEDING in the last_3_days column and rename it last_2_days.',
        check: {
          question: 'What does ROWS BETWEEN 2 PRECEDING AND CURRENT ROW include?',
          options: ['The current row and the two rows before it', 'Only the two rows before', 'All rows'],
          answer: 0,
          why: 'The frame starts two rows back and ends at the current row: three rows in total (fewer at the start).'
        }
      },
      {
        title: 'Moving averages',
        say: [
          'Daily numbers jump up and down: a big order one day, a quiet day the next. A moving average smooths this out by averaging each day with the few days before it, so the trend is easier to see.',
          'A 3-day moving average is avg(amount) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW). For each day, it averages that day and the two before it.',
          'At the start of the list there are fewer rows before, so the first day averages just itself, and the second averages two days. Some reports hide those first rows, because they are based on less data.',
          'Round moving averages for reading, with round(..., 2). And label them clearly, like avg_3_days, so nobody confuses them with the day\'s own value.',
          'Moving averages are everywhere: the 7-day average of cases in health reports, the 50-day average of a share price in finance, the weekly average of app sign-ups in product teams.',
          'The window size is a choice. A small window follows changes quickly but is still bumpy; a large window is smooth but slow to show real changes. Seven days is common for daily data because it covers every weekday once.'
        ],
        example: 'When you track your daily steps, one lazy Sunday does not mean you have stopped walking. Looking at your average over the last 7 days shows the real habit. That is a moving average.',
        code: lines(
          'CREATE TABLE daily_sales (day date, amount numeric(10,2));',
          "INSERT INTO daily_sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200), ('2026-09-03', 2097), ('2026-09-04', 760), ('2026-09-05', 450);",
          'SELECT day, amount,',
          '       round(avg(amount) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_3_days',
          'FROM daily_sales',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | amount  | avg_3_days',
          '------------+---------+------------',
          ' 2026-09-01 |  280.00 |     280.00',
          ' 2026-09-02 | 1200.00 |     740.00',
          ' 2026-09-03 | 2097.00 |    1192.33',
          ' 2026-09-04 |  760.00 |    1352.33',
          ' 2026-09-05 |  450.00 |    1102.33',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Each day averaged with up to two days before it, rounded.' }
        ],
        tryIt: 'Add count(*) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS days_used to see how many days each average is based on.',
        check: {
          question: 'Why use a moving average on daily sales?',
          options: ['To smooth out day-to-day jumps and show the trend', 'To make the numbers bigger', 'To remove days with no sales'],
          answer: 0,
          why: 'Averaging each day with its neighbours reduces the effect of single unusual days, so the trend is clearer.'
        }
      },
      {
        title: 'Running totals per group',
        say: [
          'PARTITION BY works with frames too. sum(amount) OVER (PARTITION BY customer ORDER BY paid_on) gives each customer their own running total, which restarts at zero for the next customer.',
          'This is exactly how a bank statement is built for each account: each transaction, and the balance after it, separately for every account holder.',
          'Deposits are positive and withdrawals negative, so a running sum of the amounts gives the balance. If you store withdrawals as positive numbers with a type column, use CASE, which you will learn tomorrow, to make them negative first.',
          'When you partition, make sure the ORDER BY inside OVER has a clear order within each group. If two payments of the same customer have the same timestamp, add the id as a tie-breaker, or the balance order could differ between runs.',
          'Running totals per group are also used for goals: each salesperson\'s sales so far this month, each student\'s marks so far this term.',
          'Remember that nothing is grouped away. Every transaction stays in the result, and the running total column simply grows within each customer.'
        ],
        example: 'Each family member keeps their own piggy bank. When Asha adds money, only her total grows; Ravi\'s is separate. PARTITION BY person is keeping one piggy bank per person.',
        code: lines(
          'CREATE TABLE payments (id int, customer text, paid_on date, amount numeric(10,2));',
          "INSERT INTO payments VALUES (1, 'Asha', '2026-09-01', 500), (2, 'Ravi', '2026-09-01', 1000), (3, 'Asha', '2026-09-05', -200),",
          "  (4, 'Asha', '2026-09-09', 300), (5, 'Ravi', '2026-09-10', -400);",
          'SELECT customer, paid_on, amount,',
          '       sum(amount) OVER (PARTITION BY customer ORDER BY paid_on, id) AS balance',
          'FROM payments',
          'ORDER BY customer, paid_on, id;'
        ),
        output: lines(
          ' customer | paid_on    | amount  | balance',
          '----------+------------+---------+---------',
          ' Asha     | 2026-09-01 |  500.00 |  500.00',
          ' Asha     | 2026-09-05 | -200.00 |  300.00',
          ' Asha     | 2026-09-09 |  300.00 |  600.00',
          ' Ravi     | 2026-09-01 | 1000.00 | 1000.00',
          ' Ravi     | 2026-09-10 | -400.00 |  600.00',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'A separate running total for each customer; id breaks ties on the same day.' }
        ],
        tryIt: "Add a new payment (6, 'Ravi', '2026-09-12', 250) and run it. Only Ravi's balance changes.",
        check: {
          question: 'What does PARTITION BY customer do to a running total?',
          options: ['Gives each customer their own running total that starts from zero', 'Adds all customers together', 'Removes all but the last payment'],
          answer: 0,
          why: 'Each partition has its own window, so the running total restarts for each customer.'
        }
      },
      {
        title: 'Period-over-period growth',
        say: [
          'Managers often ask "how much did we grow compared with last month?". You met lag yesterday: it fetches the previous row\'s value. Growth is this month minus last month, and the percentage is that change divided by last month.',
          'In SQL: round((amount - lag(amount) OVER (ORDER BY month)) / lag(amount) OVER (ORDER BY month) * 100, 1). It looks long, so it is cleaner to put lag in a WITH step first and calculate the percentage in the main query.',
          'Be careful with division. If last month\'s value was 0, dividing by it causes an error. nullif(previous, 0) turns a zero into NULL, and dividing by NULL gives NULL instead of an error. It is a neat safety trick.',
          'The first month has no previous month, so its growth is NULL. That is honest: there is nothing to compare with. A report can show it as a dash.',
          'You can combine growth with monthly totals from GROUP BY: first group sales by month in a WITH step, then apply lag to the monthly totals.',
          'Growth figures are often misread. A 50 percent rise from a tiny number is not impressive, so reports usually show both the amounts and the percentage.',
          'It also helps to compare the same period last year, not just last month, because many businesses are seasonal. Festival months are always busy in India, so comparing October with September can mislead, while October this year against October last year tells the real story. That uses lag with 12 rows back on monthly data.'
        ],
        example: 'A school compares this year\'s admissions with last year\'s: 600 against 500 is 100 more, a 20 percent increase. Growth needs both numbers side by side, and lag puts them there.',
        code: lines(
          'CREATE TABLE sales (sold_on date, amount numeric(10,2));',
          "INSERT INTO sales VALUES ('2026-07-03', 5000), ('2026-07-20', 7000), ('2026-08-11', 9000), ('2026-08-25', 6000), ('2026-09-02', 18000);",
          'WITH monthly AS (',
          "  SELECT date_trunc('month', sold_on)::date AS month, sum(amount) AS total",
          '  FROM sales GROUP BY 1',
          '),',
          'with_previous AS (',
          '  SELECT month, total, lag(total) OVER (ORDER BY month) AS previous FROM monthly',
          ')',
          'SELECT month, total, previous,',
          '       round((total - previous) / nullif(previous, 0) * 100, 1) AS growth_percent',
          'FROM with_previous',
          'ORDER BY month;'
        ),
        output: lines(
          ' month      | total    | previous | growth_percent',
          '------------+----------+----------+----------------',
          ' 2026-07-01 | 12000.00 |     NULL |           NULL',
          ' 2026-08-01 | 15000.00 | 12000.00 |           25.0',
          ' 2026-09-01 | 18000.00 | 15000.00 |           20.0',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Step 1: total sales per month. GROUP BY 1 means "group by the first column".' },
          { line: 8, note: 'Step 2: each month next to the previous month.' },
          { line: 11, note: 'Growth in percent; nullif avoids dividing by zero.' }
        ],
        tryIt: "Add a sale in October: ('2026-10-05', 9000). The October growth is negative: sales fell by half.",
        check: {
          question: 'What does nullif(previous, 0) protect against?',
          options: ['Dividing by zero when the previous value is 0', 'NULL values in the current month', 'Negative growth'],
          answer: 0,
          why: 'nullif turns 0 into NULL. Dividing by NULL gives NULL instead of a division-by-zero error.'
        }
      },
      {
        title: 'Putting it together: a sales trend report',
        say: [
          'Let us build a small but complete trend report from daily sales: each day\'s amount, the running total for the month, and a 3-day moving average. This is the kind of table behind a sales chart on a company dashboard.',
          'All three columns come from the same rows, so one query with three window functions does the job. Each window has the same ORDER BY day, but different frames.',
          'When a window definition repeats, PostgreSQL lets you name it once with a WINDOW clause at the end: WINDOW by_day AS (ORDER BY day), and then write OVER by_day. It keeps long queries tidy.',
          'In today\'s practice, you will calculate a running total of daily sales, and a 3-day moving average rounded to 2 decimals.',
          'Tomorrow you learn CASE, which lets a query make decisions like "if the price is under 100, call it budget". Combined with what you learned this week, it opens up almost any report.',
          'You now know the advanced analysis tools that many junior developers never learn properly. Being comfortable with window functions and frames is a real advantage in interviews.'
        ],
        example: 'A shop owner looks at one simple chart each evening: today\'s bar, a line for the month so far, and a smooth line for the recent trend. Those three lines are the three window functions in this query.',
        code: lines(
          'CREATE TABLE daily_sales (day date, amount numeric(10,2));',
          "INSERT INTO daily_sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200), ('2026-09-03', 2097), ('2026-09-04', 760), ('2026-09-05', 450);",
          'SELECT day, amount,',
          '       sum(amount) OVER by_day AS month_so_far,',
          '       round(avg(amount) OVER (by_day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS avg_3_days',
          'FROM daily_sales',
          'WINDOW by_day AS (ORDER BY day)',
          'ORDER BY day;'
        ),
        output: lines(
          ' day        | amount  | month_so_far | avg_3_days',
          '------------+---------+--------------+------------',
          ' 2026-09-01 |  280.00 |       280.00 |     280.00',
          ' 2026-09-02 | 1200.00 |      1480.00 |     740.00',
          ' 2026-09-03 | 2097.00 |      3577.00 |    1192.33',
          ' 2026-09-04 |  760.00 |      4337.00 |    1352.33',
          ' 2026-09-05 |  450.00 |      4787.00 |    1102.33',
          '(5 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Running total using the named window.' },
          { line: 5, note: 'The same named window, with a 3-row frame added.' },
          { line: 7, note: 'The window is defined once, by name.' }
        ],
        tryIt: 'Add a column amount - lag(amount) OVER by_day AS change_from_yesterday.',
        check: {
          question: 'What is the WINDOW clause for?',
          options: ['Naming a window definition once so several functions can reuse it', 'Filtering rows before window functions', 'Creating a new table'],
          answer: 0,
          why: 'WINDOW by_day AS (...) defines the window once; each function can then say OVER by_day.'
        }
      }
    ],
    summary: [
      'sum(x) OVER (ORDER BY day) is a running total; without ORDER BY it is the grand total.',
      'A frame chooses the rows: ROWS BETWEEN n PRECEDING AND CURRENT ROW, UNBOUNDED PRECEDING, FOLLOWING.',
      'avg(x) over a small frame is a moving average that smooths the trend.',
      'PARTITION BY gives each group its own running total, like a balance per account.',
      'Growth: compare with lag, and use nullif(previous, 0) to avoid dividing by zero.'
    ],
    projectStep: {
      title: 'My Library: pages read over time',
      steps: [
        'Create a reading_log table with day and pages_read, and add 7 days of reading.',
        'Show a running total of pages read.',
        'Show a 3-day moving average of pages per day.',
        'Show the change in pages compared with the previous day using lag.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 19,
    title: 'Decisions Inside a Query: CASE',
    goal: 'You can make decisions inside queries with CASE: label rows, sort in custom orders, count by condition and build pivot-style reports.',
    minutes: 28,
    recap: 'Yesterday you calculated running totals, moving averages and growth with window frames.',
    parts: [
      {
        title: 'CASE: if-then-else inside SQL',
        say: [
          'Many reports need a decision for each row: "if the price is under 100, call it budget; if under 1000, mid; otherwise premium". CASE is SQL\'s if-then-else.',
          'The shape is: CASE WHEN condition THEN value WHEN another_condition THEN another_value ELSE default_value END. It works out one value for each row, and you give that value a name with AS.',
          'PostgreSQL checks the WHEN conditions from top to bottom and uses the first one that is true. So the order matters, exactly like elif in Python or else if in JavaScript. Put the most specific conditions first.',
          'If no WHEN is true and there is no ELSE, the result is NULL. It is good practice to always write an ELSE, even if it is just ELSE \'other\', so nothing slips through unlabelled.',
          'Every THEN and the ELSE should return the same type: all text, or all numbers. Mixing \'budget\' and 5 in one CASE gives an error.',
          'CASE can be used almost anywhere a value can: in SELECT, WHERE, ORDER BY, GROUP BY, and inside aggregates. That makes it one of the most versatile tools in SQL.',
          'Writing each WHEN on its own line, indented under CASE, makes long decisions much easier to read and review. It also makes it obvious if two branches overlap, or if a case has been forgotten.'
        ],
        example: 'A college grading table: 75 and above is Distinction, 60 and above is First class, 40 and above is Pass, otherwise Fail. The clerk checks from the top and stops at the first rule that fits. CASE follows those same rules for every row.',
        code: lines(
          MINI_SHOP,
          'SELECT name, price,',
          '       CASE',
          "         WHEN price < 100 THEN 'budget'",
          "         WHEN price < 1000 THEN 'mid'",
          "         ELSE 'premium'",
          '       END AS price_band',
          'FROM products',
          'ORDER BY price;'
        ),
        output: lines(
          ' name     | price   | price_band',
          '----------+---------+------------',
          ' Pen      |   10.00 | budget',
          ' Notebook |   60.00 | budget',
          ' Stapler  |  150.00 | mid',
          ' Backpack | 1200.00 | premium',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'Checked first: anything under 100 is budget.' },
          { line: 12, note: 'Only reached if the first condition was false.' },
          { line: 13, note: 'Everything else.' }
        ],
        tryIt: "Swap the order of the first two WHEN lines and run it. The Pen and the Notebook are now called mid, because price < 1000 is checked first.",
        check: {
          question: 'Which WHEN branch does CASE use when several are true?',
          options: ['The first true one, from the top', 'The last true one', 'All of them'],
          answer: 0,
          why: 'CASE stops at the first WHEN that is true, so the order of conditions matters.'
        }
      },
      {
        title: 'Simple CASE and cleaning codes into words',
        say: [
          'When you compare one column with several fixed values, there is a shorter form: CASE status WHEN \'d\' THEN \'Delivered\' WHEN \'p\' THEN \'Pending\' ELSE \'Unknown\' END. The column is written once after CASE.',
          'This is very common when data stores short codes, like d, p, c, or 1, 2, 3, and a report needs readable words. The database keeps the compact codes, and the query translates them for people.',
          'The short form only checks equality. For ranges or several columns, use the full form with WHEN condition, as in the first part.',
          'If the same translation is needed in many queries, a small lookup table is usually better than repeating the CASE everywhere: a table of codes and their names, joined when needed. Then a new code means adding one row, not editing many queries.',
          'CASE can also produce numbers, for example a score for each status, which you can then add up or sort by.',
          'Always handle unexpected values with ELSE. Real data eventually contains a code nobody planned for, and "Unknown" is much better than a silent NULL.',
          'Showing the unexpected code in the label, like "Unknown code: x", is better than a plain "Unknown", because the person reading the report can tell the development team exactly which value appeared. Small touches like this make data problems much faster to fix.'
        ],
        example: 'At a railway station, the board shows "Delayed" and "On time", but the computer behind it stores status codes like D and O. Something translates the codes into words for travellers. That translator is a CASE.',
        code: lines(
          'CREATE TABLE tickets (id int, status char(1));',
          "INSERT INTO tickets VALUES (1, 'o'), (2, 'c'), (3, 'o'), (4, 'x');",
          'SELECT id,',
          '       CASE status',
          "         WHEN 'o' THEN 'Open'",
          "         WHEN 'c' THEN 'Closed'",
          "         ELSE 'Unknown code: ' || status",
          '       END AS status_text',
          'FROM tickets',
          'ORDER BY id;'
        ),
        output: lines(
          ' id | status_text',
          '----+-----------------',
          '  1 | Open',
          '  2 | Closed',
          '  3 | Open',
          '  4 | Unknown code: x',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'The short form: the column is written once.' },
          { line: 7, note: 'ELSE catches codes nobody planned for, and shows them.' }
        ],
        tryIt: "Add a code for 'x': WHEN 'x' THEN 'Cancelled', and run it again.",
        check: {
          question: 'When is the short form CASE column WHEN value THEN ... useful?',
          options: ['When comparing one column with several fixed values', 'When checking ranges like price < 100', 'When joining tables'],
          answer: 0,
          why: 'The short form only checks equality with fixed values. Ranges need the full CASE WHEN condition form.'
        }
      },
      {
        title: 'CASE in ORDER BY: custom sort orders',
        say: [
          'Sometimes the natural order is not alphabetical or numeric. Order statuses, for example, should appear as pending, shipped, delivered, cancelled: the order in which things happen, not A to Z.',
          'CASE in ORDER BY solves this. Give each value a number with CASE, and sort by that number: ORDER BY CASE status WHEN \'pending\' THEN 1 WHEN \'shipped\' THEN 2 WHEN \'delivered\' THEN 3 ELSE 4 END.',
          'You can combine it with other sort columns: first by the custom status order, then by date within each status.',
          'Another use is pinning certain rows to the top: ORDER BY CASE WHEN is_featured THEN 0 ELSE 1 END, price puts featured products first, then everything else by price.',
          'The CASE in ORDER BY does not have to appear in the SELECT. It only controls the order, and the result shows the columns you chose.',
          'If the same custom order is used in many places, a lookup table with a sort_order column is again the tidier solution. But for one report, CASE in ORDER BY is quick and clear.'
        ],
        example: 'A hospital waiting room is not served A to Z by name, but by urgency: emergencies first, then appointments, then walk-ins, and within each group by arrival time. That custom priority is CASE in ORDER BY.',
        code: lines(
          MINI_SHOP,
          'SELECT id, status, ordered_on',
          'FROM orders',
          'ORDER BY CASE status',
          "           WHEN 'pending' THEN 1",
          "           WHEN 'shipped' THEN 2",
          "           WHEN 'delivered' THEN 3",
          '           ELSE 4',
          '         END,',
          '         ordered_on;'
        ),
        output: lines(
          ' id  | status    | ordered_on',
          '-----+-----------+------------',
          ' 104 | pending   | 2026-09-12',
          ' 103 | shipped   | 2026-09-10',
          ' 101 | delivered | 2026-09-01',
          ' 102 | delivered | 2026-09-03',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 11, note: 'Each status gets a number that sets its place in the order.' },
          { line: 17, note: 'Inside each status, oldest first.' }
        ],
        tryIt: 'Change the numbers so delivered orders come first, and run it.',
        check: {
          question: 'How do you sort statuses in a custom order like pending, shipped, delivered?',
          options: ['ORDER BY a CASE that gives each status a number', 'ORDER BY status', 'GROUP BY status'],
          answer: 0,
          why: 'CASE turns each status into a sort number, and ORDER BY uses that number instead of alphabetical order.'
        }
      },
      {
        title: 'Counting by condition',
        say: [
          'CASE inside an aggregate lets you count or add up only some rows, several ways at once, in a single query. sum(CASE WHEN status = \'delivered\' THEN 1 ELSE 0 END) counts delivered orders.',
          'You met FILTER on Day 8, which does the same job more neatly in PostgreSQL: count(*) FILTER (WHERE status = \'delivered\'). The CASE version works in every SQL database, so you will see both in real code.',
          'The same trick adds up amounts conditionally: sum(CASE WHEN status = \'delivered\' THEN total ELSE 0 END) is the value of delivered orders only.',
          'With GROUP BY, this produces compact summary tables: one row per customer, with columns for delivered, shipped and pending orders side by side.',
          'This pattern is sometimes called conditional aggregation. It is much faster than running three separate queries, because PostgreSQL reads the data once.',
          'Watch out for ELSE: in a sum, ELSE 0 keeps the total a number; without an ELSE, the CASE gives NULL for other rows, which sum skips, so the result is the same unless no rows match, in which case you get NULL instead of 0.'
        ],
        example: 'A teacher collecting a class survey counts three things in one pass through the papers: how many said yes, how many said no, and how many left it blank. She does not go through the pile three times. Conditional aggregation is that single pass.',
        code: lines(
          MINI_SHOP,
          'SELECT c.name,',
          "       sum(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) AS delivered,",
          "       count(*) FILTER (WHERE o.status IN ('shipped', 'pending')) AS open,",
          '       count(o.id) AS all_orders',
          'FROM customers c',
          'LEFT JOIN orders o ON o.customer_id = c.id',
          'GROUP BY c.id, c.name',
          'ORDER BY c.name;'
        ),
        output: lines(
          ' name  | delivered | open | all_orders',
          '-------+-----------+------+------------',
          ' Asha  |         1 |    1 |          2',
          ' Meera |         0 |    0 |          0',
          ' Priya |         0 |    1 |          1',
          ' Ravi  |         1 |    0 |          1',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'The CASE way: 1 for each delivered order, 0 otherwise, then add up.' },
          { line: 11, note: 'The PostgreSQL FILTER way: same idea, shorter.' }
        ],
        tryIt: "Add a column for cancelled orders using either style. Everyone has 0, because no order is cancelled.",
        check: {
          question: 'What does sum(CASE WHEN status = \'delivered\' THEN 1 ELSE 0 END) calculate?',
          options: ['The number of delivered orders', 'The total value of all orders', 'The number of statuses'],
          answer: 0,
          why: 'Each delivered order adds 1 and every other order adds 0, so the sum is the count of delivered orders.'
        }
      },
      {
        title: 'Pivot-style reports',
        say: [
          'Spreadsheets often show data as a grid: one row per product, one column per month. This is called a pivot table. SQL naturally returns long lists, one row per product per month, but conditional aggregation can turn them into a grid.',
          'For each column of the grid, write one sum with a CASE (or FILTER) that keeps only that column\'s rows: sum(amount) FILTER (WHERE month = \'2026-08\') AS aug, and the same for September.',
          'Group by the row labels, like the product name, and you get one row per product with one column per month.',
          'The limitation is that the columns must be known when you write the query. A new month means adding a new column to the SQL. For fully dynamic pivots, apps usually fetch the long list and pivot it in code or in a spreadsheet tool.',
          'Pivot reports are popular with managers because they are easy to scan. Being able to produce one directly in SQL saves a lot of copying into Excel.',
          'Use coalesce around each column, or ELSE 0 inside the CASE, so empty cells show 0 instead of NULL. A grid full of NULLs looks broken, even when it is correct.'
        ],
        example: 'A school attendance summary shows each student as a row and each month as a column, with days present in each cell. The attendance register is a long list of days; the summary grid is a pivot of it.',
        code: lines(
          'CREATE TABLE sales (product text, sold_on date, amount numeric(10,2));',
          "INSERT INTO sales VALUES ('Pen', '2026-08-05', 100), ('Pen', '2026-09-02', 150), ('Notebook', '2026-08-20', 180),",
          "  ('Notebook', '2026-09-11', 60), ('Backpack', '2026-09-15', 1200), ('Pen', '2026-09-20', 50);",
          'SELECT product,',
          "       coalesce(sum(amount) FILTER (WHERE sold_on >= '2026-08-01' AND sold_on < '2026-09-01'), 0) AS aug,",
          "       coalesce(sum(amount) FILTER (WHERE sold_on >= '2026-09-01' AND sold_on < '2026-10-01'), 0) AS sep,",
          '       sum(amount) AS total',
          'FROM sales',
          'GROUP BY product',
          'ORDER BY total DESC;'
        ),
        output: lines(
          ' product  | aug    | sep     | total',
          '----------+--------+---------+---------',
          ' Backpack |      0 | 1200.00 | 1200.00',
          ' Pen      | 100.00 |  200.00 |  300.00',
          ' Notebook | 180.00 |   60.00 |  240.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 5, note: 'One column for August: only August rows are added.' },
          { line: 6, note: 'One column for September.' },
          { line: 9, note: 'One row per product.' }
        ],
        tryIt: "Add an October column the same way, and a sale ('Backpack', '2026-10-01', 1200) to the INSERT.",
        check: {
          question: 'How do you turn "one row per product per month" into "one row per product, one column per month"?',
          options: ['GROUP BY product, with one conditional sum per month column', 'ORDER BY month', 'UNION the months together'],
          answer: 0,
          why: 'Each month column adds up only that month\'s rows, and grouping by product gives one row per product.'
        }
      },
      {
        title: 'Putting it together: a product dashboard',
        say: [
          'Let us combine today\'s ideas into a small product dashboard: each product with a price band, a stock status in words, and a custom order that shows products needing attention first.',
          'The price band and stock status are CASE expressions in SELECT. The custom order is a CASE in ORDER BY that puts out-of-stock products first, then low stock, then the rest, cheapest first within each group.',
          'Below it, a one-row summary counts the products in each price band using conditional aggregation. Together they are the kind of overview a shop owner checks every morning.',
          'In today\'s practice, you will label every product as budget, mid or premium, and write a one-row summary counting delivered, open and cancelled orders.',
          'Tomorrow is about design rather than queries: how to split data into good tables in the first place, called normalization. It explains why the shop database looks the way it does.',
          'CASE is simple, but it appears in a huge share of real-world queries. Whenever a report needs a label, a custom order or a conditional count, reach for CASE.'
        ],
        example: 'A shop owner\'s morning checklist says: first look at anything out of stock, then anything running low, then the rest. And tell me roughly how many cheap, mid and expensive items we carry. One query answers both.',
        code: lines(
          'CREATE TABLE products (name text, price numeric(10,2), stock int);',
          "INSERT INTO products VALUES ('Notebook', 60, 120), ('Pen', 10, 500), ('Backpack', 1200, 15), ('Desk lamp', 899, 0), ('Headphones', 1499, 25), ('Stapler', 150, 8);",
          'SELECT name, price, stock,',
          "       CASE WHEN stock = 0 THEN 'out of stock' WHEN stock < 20 THEN 'low' ELSE 'ok' END AS stock_status",
          'FROM products',
          'ORDER BY CASE WHEN stock = 0 THEN 1 WHEN stock < 20 THEN 2 ELSE 3 END, price;',
          'SELECT count(*) FILTER (WHERE price < 100) AS budget,',
          '       count(*) FILTER (WHERE price >= 100 AND price < 1000) AS mid,',
          '       count(*) FILTER (WHERE price >= 1000) AS premium',
          'FROM products;'
        ),
        output: lines(
          ' name       | price   | stock | stock_status',
          '------------+---------+-------+--------------',
          ' Desk lamp  |  899.00 |     0 | out of stock',
          ' Stapler    |  150.00 |     8 | low',
          ' Backpack   | 1200.00 |    15 | low',
          ' Pen        |   10.00 |   500 | ok',
          ' Notebook   |   60.00 |   120 | ok',
          ' Headphones | 1499.00 |    25 | ok',
          '(6 rows)',
          '',
          ' budget | mid | premium',
          '--------+-----+---------',
          '      2 |   2 |       2',
          '(1 row)'
        ),
        codeNotes: [
          { line: 4, note: 'A readable stock status for each product.' },
          { line: 6, note: 'Products needing attention first, then by price.' },
          { line: 7, note: 'A one-row count of each price band.' }
        ],
        tryIt: 'Change the low-stock limit from 20 to 30 in both places and run it. The Headphones move into the low group.',
        check: {
          question: 'Why does the query repeat the stock conditions in SELECT and in ORDER BY?',
          options: ['SELECT shows the label; ORDER BY uses its own CASE to decide the order', 'PostgreSQL requires every CASE twice', 'To make the query faster'],
          answer: 0,
          why: 'The label and the sort order are separate jobs. (You could also ORDER BY the label\'s name, but custom numbers give full control.)'
        }
      }
    ],
    summary: [
      'CASE WHEN ... THEN ... ELSE ... END makes a decision for each row; the first true WHEN wins.',
      'The short form CASE column WHEN value THEN ... translates codes into words.',
      'CASE in ORDER BY creates custom sort orders.',
      'sum(CASE ...) or count(*) FILTER (...) counts and totals by condition in one pass.',
      'One conditional sum per column turns a long list into a pivot-style grid.'
    ],
    projectStep: {
      title: 'My Library: book labels',
      steps: [
        'Label each book short (under 200 pages), medium (under 400) or long.',
        'Sort unfinished books first, then by title, with CASE in ORDER BY.',
        'Count short, medium and long books in one row.',
        'Show each author with columns for finished and unfinished books.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 20,
    title: 'Designing Good Tables: Normalization',
    goal: 'You can spot problems caused by repeated data, explain 1NF, 2NF and 3NF in plain words, and split a flat table into linked tables.',
    minutes: 28,
    recap: 'Yesterday you used CASE to label rows, sort in custom orders and count by condition.',
    parts: [
      {
        title: 'What goes wrong with repeated data',
        say: [
          'Imagine a shop that keeps everything in one big sheet: each row is an order line, with the customer\'s name, city and phone, the product name and price, and the quantity. It seems simple. But look what happens over time.',
          'Asha\'s phone number is copied onto every one of her order lines. When she changes her number, someone must update all those rows. Miss one, and the database now has two different phone numbers for Asha. Nobody knows which is right. This is called an update anomaly.',
          'If a product has not been ordered yet, there is nowhere to store its price, because every row is an order line. That is an insert anomaly: you cannot record a fact until something else happens.',
          'And if Asha\'s only order is deleted, her details disappear with it, even though she is still a customer. That is a delete anomaly.',
          'All three problems come from the same cause: one table trying to store facts about several different things, customers, products and orders, at once. The solution is to split the data so each fact is stored once.',
          'This process of splitting tables to remove repeated facts is called normalization. It has formal rules, but the idea is exactly what you practised on Day 10: one table per kind of thing, linked by ids.'
        ],
        example: 'A class keeps a single notebook where every page records one homework submission, with the student\'s name, parent\'s phone and address copied each time. When a parent changes their phone, the teacher must fix dozens of pages. A separate contact list, written once, solves it.',
        code: lines(
          'CREATE TABLE orders_flat (order_id int, customer text, phone text, product text, price numeric(10,2));',
          "INSERT INTO orders_flat VALUES (1, 'Asha', '98765 11111', 'Pen', 10), (2, 'Asha', '98765 11111', 'Notebook', 60), (3, 'Ravi', '91234 22222', 'Pen', 10);",
          "UPDATE orders_flat SET phone = '90000 33333' WHERE order_id = 1;",
          "SELECT customer, count(DISTINCT phone) AS phone_numbers_on_record FROM orders_flat GROUP BY customer ORDER BY customer;"
        ),
        output: lines(
          ' customer | phone_numbers_on_record',
          '----------+-------------------------',
          ' Asha     |                       2',
          ' Ravi     |                       1',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'Asha\'s phone is copied onto each of her orders.' },
          { line: 3, note: 'Someone updates only one of her rows.' },
          { line: 4, note: 'Now the database holds two different phone numbers for Asha.' }
        ],
        tryIt: "Fix it properly by updating every Asha row: UPDATE orders_flat SET phone = '90000 33333' WHERE customer = 'Asha'; and run again. That is the extra work normalization avoids.",
        check: {
          question: 'Asha\'s phone number is stored on 20 order rows and only one is updated. What is this problem called?',
          options: ['An update anomaly', 'A syntax error', 'A foreign key'],
          answer: 0,
          why: 'Repeated data that is updated in some places but not others leaves the database disagreeing with itself.'
        }
      },
      {
        title: 'First normal form: one value per cell',
        say: [
          'Normalization has levels called normal forms. You only need the first three for almost all real work, and each has a simple idea behind the formal name.',
          'First normal form, 1NF, says: each cell holds a single value, and each row can be identified. A column like phones containing "98765 11111, 91234 22222" breaks this rule, because one cell holds a list.',
          'Lists in a cell cause real problems. You cannot easily search for one phone number, count how many phones a customer has, or make sure each one is valid. And every app that reads the data has to split the text itself.',
          'The fix is to move the list into its own table, with one row per value: customer_phones(customer_id, phone). Now each phone is a separate row, easy to search, count and check.',
          'The same applies to columns like phone1, phone2, phone3. They look tidy, but a fourth phone needs a new column, and searching means checking three columns. A separate table handles any number of phones.',
          'PostgreSQL does have array and JSON columns, which you will meet on Day 25. They are useful for some data, but for things you search, count or link to, separate rows are almost always the better design.'
        ],
        example: 'A registration form with one box that says "subjects: Maths, Physics, Chemistry" is hard to sort by subject. A form with one line per subject, each in its own box, lets the office count how many students take Physics in seconds.',
        code: lines(
          'CREATE TABLE customers_bad (id int, name text, phones text);',
          "INSERT INTO customers_bad VALUES (1, 'Asha', '98765 11111, 90000 33333'), (2, 'Ravi', '91234 22222');",
          'CREATE TABLE customer_phones (customer_id int, phone text);',
          "INSERT INTO customer_phones VALUES (1, '98765 11111'), (1, '90000 33333'), (2, '91234 22222');",
          'SELECT customer_id, count(*) AS phones FROM customer_phones GROUP BY customer_id ORDER BY customer_id;',
          "SELECT customer_id FROM customer_phones WHERE phone = '90000 33333';"
        ),
        output: lines(
          ' customer_id | phones',
          '-------------+--------',
          '           1 |      2',
          '           2 |      1',
          '(2 rows)',
          '',
          ' customer_id',
          '-------------',
          '           1',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'Breaks 1NF: one cell holds a list of phones.' },
          { line: 3, note: 'Fixed: one row per phone.' },
          { line: 5, note: 'Counting and searching are now simple.' }
        ],
        tryIt: "Try finding the customer with phone '90000 33333' in customers_bad. You would need LIKE '%90000 33333%', which is slow and easy to get wrong.",
        check: {
          question: 'Which design follows first normal form?',
          options: ['A separate table with one row per phone number', 'A phones column with numbers separated by commas', 'Columns phone1, phone2 and phone3'],
          answer: 0,
          why: '1NF means one value per cell. A separate table stores each phone as its own row.'
        }
      },
      {
        title: 'Second normal form: facts about the whole key',
        say: [
          'Second normal form, 2NF, matters when a table\'s primary key is made of two or more columns, like order_items with the key (order_id, product_id).',
          'The rule says: every other column must depend on the whole key, not just part of it. In order_items, quantity depends on both the order and the product: it is "how many of this product in this order". That is fine.',
          'But if order_items also stored the product\'s name, that name depends only on product_id, just part of the key. The same product name would be repeated on every order line for that product, which brings back the update anomaly.',
          'The fix is the same as always: move the fact to the table where it belongs. The product name belongs in products, keyed by product_id alone.',
          'A good test: for each column, ask "what is this a fact about?". If the answer is "about the product", it belongs in products. If it is "about this product in this order", it belongs in order_items.',
          'Tables with a single-column id key, like most tables in this course, automatically satisfy 2NF, because there is no "part of the key" to depend on. So 2NF is mostly about junction tables.'
        ],
        example: 'A wedding seating chart lists each guest at each table. The number of chairs reserved depends on both the guest and the table. But the guest\'s home city depends only on the guest, so it belongs on the guest list, not copied onto every seating line.',
        code: lines(
          'CREATE TABLE order_items_bad (order_id int, product_id int, product_name text, quantity int, PRIMARY KEY (order_id, product_id));',
          "INSERT INTO order_items_bad VALUES (101, 1, 'Notebook', 3), (102, 1, 'Notebook', 1), (103, 1, 'Note book', 2);",
          'SELECT product_id, count(DISTINCT product_name) AS different_names FROM order_items_bad GROUP BY product_id;'
        ),
        output: lines(
          ' product_id | different_names',
          '------------+-----------------',
          '          1 |               2',
          '(1 row)'
        ),
        codeNotes: [
          { line: 1, note: 'product_name depends only on product_id, part of the key: this breaks 2NF.' },
          { line: 2, note: 'A typo on one line means product 1 now has two different names.' }
        ],
        tryIt: 'Design the fix on paper: which columns stay in order_items, and which move to products?',
        check: {
          question: 'In order_items with key (order_id, product_id), which column belongs there?',
          options: ['quantity', 'product_name', 'customer_name'],
          answer: 0,
          why: 'quantity depends on both the order and the product. product_name depends only on the product, and customer_name on the order\'s customer.'
        }
      },
      {
        title: 'Third normal form: no facts about other facts',
        say: [
          'Third normal form, 3NF, says: every column should be a fact about the key, and not a fact about another non-key column.',
          'For example, an orders table with customer_id, customer_city and customer_pincode. The city is really a fact about the customer, not about the order. It depends on customer_id, which is not the order\'s key. That is a "fact about another fact", and it breaks 3NF.',
          'The problem is the familiar one: if the customer moves, every one of their orders must be updated, and any row that is missed disagrees with the rest.',
          'The fix: keep customer_id in orders, and move city and pincode to the customers table. When you need the city on an order report, you join, which is exactly what you learned in week 2.',
          'A famous way to remember the first three forms is: every column must depend on the key, the whole key, and nothing but the key. The first part is roughly 1NF and identifying rows, the whole key is 2NF, and nothing but the key is 3NF.',
          'In practice, a well-designed database in 3NF simply has one table per kind of thing, with each fact stored once and linked by ids. If you design like that from the start, you rarely need to think about the formal names.'
        ],
        example: 'A student\'s marksheet shows their roll number and their class teacher\'s name. But the teacher\'s name is a fact about the class, not the student. If the teacher changes, every student\'s sheet would need editing. Stored with the class, it changes once.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text, city text);',
          "INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Mumbai');",
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), total numeric(10,2));',
          'INSERT INTO orders VALUES (101, 1, 280), (102, 2, 1200), (103, 1, 50);',
          "UPDATE customers SET city = 'Bengaluru' WHERE id = 1;",
          'SELECT o.id, c.name, c.city, o.total FROM orders o JOIN customers c ON c.id = o.customer_id ORDER BY o.id;'
        ),
        output: lines(
          ' id  | name | city      | total',
          '-----+------+-----------+---------',
          ' 101 | Asha | Bengaluru |  280.00',
          ' 102 | Ravi | Mumbai    | 1200.00',
          ' 103 | Asha | Bengaluru |   50.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'orders stores only customer_id: the city lives with the customer.' },
          { line: 5, note: 'One update, and every order report shows the new city.' }
        ],
        tryIt: 'Add a pincode column to customers in the CREATE TABLE and show it in the joined result. It is stored once per customer.',
        check: {
          question: 'Where should a customer\'s city be stored?',
          options: ['In the customers table, once per customer', 'In every order row', 'In order_items'],
          answer: 0,
          why: 'The city is a fact about the customer. Storing it once and joining when needed follows 3NF and avoids update anomalies.'
        }
      },
      {
        title: 'When to break the rules: denormalization',
        say: [
          'Normalization is the right starting point, but there are good reasons to repeat data on purpose. This is called denormalization, and experienced developers do it carefully.',
          'The most common reason is history. An order should record the price the customer actually paid, even if the product\'s price changes later. So order_items stores a unit_price column, a deliberate copy of the price at the time of the order. It is not a mistake; it is a different fact: "the price on this order".',
          'Another example is an address on an invoice. The customer may move later, but the invoice must still show the address it was sent to. Legal documents need to stay exactly as they were.',
          'A third reason is speed. Reporting databases sometimes store totals and joined data ready-made, so dashboards load quickly. These copies are refreshed on a schedule and are not where data is edited.',
          'The key difference is intention. Accidental repetition causes anomalies. Deliberate repetition records a different fact, like a snapshot in time, or a read-only copy for speed.',
          'When in doubt, start normalized. It is much easier to add a deliberate copy later than to clean up a messy, repeated design that is already full of contradictory data.'
        ],
        example: 'A hotel bill from last year shows the room rate you paid then, not today\'s rate. The hotel deliberately keeps that old price on your bill. That is a sensible copy, because it records what really happened.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10);",
          'CREATE TABLE order_items (order_id int, product_id int REFERENCES products(id), quantity int, unit_price numeric(10,2));',
          'INSERT INTO order_items VALUES (101, 1, 10, 10);',
          'UPDATE products SET price = 12 WHERE id = 1;',
          'SELECT oi.order_id, p.name, oi.unit_price AS paid_then, p.price AS price_now',
          'FROM order_items oi JOIN products p ON p.id = oi.product_id;'
        ),
        output: lines(
          ' order_id | name | paid_then | price_now',
          '----------+------+-----------+-----------',
          '      101 | Pen  |     10.00 |     12.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'unit_price is a deliberate copy: the price on this order.' },
          { line: 5, note: 'The catalogue price goes up later.' },
          { line: 6, note: 'The order still shows what the customer really paid.' }
        ],
        tryIt: 'Add a second order line (102, 1, 5, 12) after the price change and run it. The two orders show different prices paid, both correct.',
        check: {
          question: 'Why store unit_price in order_items when products already has a price?',
          options: ['To record the price actually paid, which should not change when the catalogue price changes', 'Because joins are not allowed', 'It is always a design mistake'],
          answer: 0,
          why: 'It is a different fact: the price at the time of the order. Deliberate copies like this are sensible denormalization.'
        }
      },
      {
        title: 'Putting it together: splitting a flat table',
        say: [
          'Let us take a messy flat table of orders, where customer details repeat on every row, and split it into a proper customers table and an orders table, using only SQL.',
          'Step one: create customers with a serial id, and fill it with each distinct customer using INSERT ... SELECT DISTINCT. Step two: create orders with a customer_id foreign key, and fill it by joining the flat rows to the new customers table to find each id.',
          'INSERT ... SELECT is new here: instead of VALUES, the rows to insert come from a query. It is the standard way to move and reshape data inside a database.',
          'After the split, each customer\'s details are stored once. A final join shows the same information as the flat table, but now a change of city is a single update.',
          'In today\'s practice, you will list each customer once from a flat table with DISTINCT, and create and fill a people table from it with INSERT ... SELECT.',
          'Tomorrow you learn the constraints that protect a good design: UNIQUE, CHECK and what happens to linked rows when something is deleted.'
        ],
        example: 'A college moving from a single overflowing spreadsheet to a proper student system first copies each student once into a student list, then links every record to the right student number. The data is the same; the structure is now safe.',
        code: lines(
          'CREATE TABLE orders_flat (order_id int, customer_name text, customer_city text, total numeric(10,2));',
          "INSERT INTO orders_flat VALUES (1, 'Asha', 'Pune', 280), (2, 'Asha', 'Pune', 60), (3, 'Ravi', 'Mumbai', 1200), (4, 'Priya', 'Pune', 760);",
          'CREATE TABLE customers (id serial PRIMARY KEY, name text, city text);',
          'INSERT INTO customers (name, city) SELECT DISTINCT customer_name, customer_city FROM orders_flat ORDER BY customer_name;',
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int REFERENCES customers(id), total numeric(10,2));',
          'INSERT INTO orders SELECT f.order_id, c.id, f.total FROM orders_flat f JOIN customers c ON c.name = f.customer_name AND c.city = f.customer_city;',
          'SELECT * FROM customers ORDER BY id;',
          'SELECT o.id, c.name, o.total FROM orders o JOIN customers c ON c.id = o.customer_id ORDER BY o.id;'
        ),
        output: lines(
          ' id | name  | city',
          '----+-------+--------',
          '  1 | Asha  | Pune',
          '  2 | Priya | Pune',
          '  3 | Ravi  | Mumbai',
          '(3 rows)',
          '',
          ' id | name  | total',
          '----+-------+---------',
          '  1 | Asha  |  280.00',
          '  2 | Asha  |   60.00',
          '  3 | Ravi  | 1200.00',
          '  4 | Priya |  760.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Each customer once, from the flat table.' },
          { line: 6, note: 'Each order, linked to the new customer id by matching name and city.' },
          { line: 8, note: 'The same information as before, now stored without repetition.' }
        ],
        tryIt: "Move Asha to Bengaluru with one UPDATE on customers, then run the last query again. Both her orders show the new city if you add c.city to it.",
        check: {
          question: 'What does INSERT INTO customers (name, city) SELECT DISTINCT ... do?',
          options: ['Inserts one row for each different customer returned by the query', 'Copies the whole flat table', 'Deletes duplicate customers'],
          answer: 0,
          why: 'INSERT ... SELECT inserts the rows a query returns. DISTINCT makes sure each customer appears once.'
        }
      }
    ],
    summary: [
      'Repeated data causes update, insert and delete anomalies.',
      '1NF: one value per cell; lists go into their own table, one row per value.',
      '2NF: every column depends on the whole key (matters for multi-column keys).',
      '3NF: no facts about other non-key columns; "the key, the whole key, and nothing but the key".',
      'Deliberate copies, like the price paid on an order, are sensible denormalization.'
    ],
    projectStep: {
      title: 'My Library: check your design',
      steps: [
        'Look at your books, authors and wishlist tables. Is any fact stored twice?',
        'If a book can have several genres, design a book_genres table instead of a genres list column.',
        'Write down, for each column, what it is a fact about.',
        'Fix one design problem you find, using CREATE TABLE and INSERT ... SELECT.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 21,
    title: 'Constraints That Protect Your Data',
    goal: 'You can add UNIQUE and CHECK rules, change tables with ALTER TABLE, and choose what happens to linked rows when a row is deleted.',
    minutes: 28,
    recap: 'Yesterday you learned normalization: why repeated data causes problems and how to split tables so each fact is stored once.',
    parts: [
      {
        title: 'Why rules belong in the database',
        say: [
          'A good design is only half the job. The other half is making sure bad data can never get in: a negative price, a duplicate email, an order for a customer who does not exist. Rules that PostgreSQL enforces are called constraints.',
          'You already know several: NOT NULL, PRIMARY KEY, UNIQUE and FOREIGN KEY. Today you meet CHECK, learn to add rules to existing tables, and choose what happens to linked rows on delete.',
          'Why not just check everything in the app? Because data reaches a database in many ways: the website, the mobile app, an admin tool, a one-off script, a data import. If the rule only lives in one app, the others can break it. A constraint protects the data whichever way it arrives.',
          'Constraints also protect against bugs. Even careful developers make mistakes, and a constraint turns a silent bad value into a loud error at the moment it happens, which is much easier to fix than a wrong report months later.',
          'Apps should still check input, to give users friendly messages like "please enter a positive amount". The database constraint is the final safety net behind the app, not a replacement for good forms.',
          'Every constraint has a name. PostgreSQL makes one up if you do not, like products_price_check. Giving your own clear names makes error messages easier to understand.'
        ],
        example: 'A bank teller checks your withdrawal slip, but the bank\'s system also refuses to let any account go below zero, whoever enters the transaction. The teller is the app; the system rule is the constraint.',
        code: lines(
          'CREATE TABLE accounts (',
          '  id int PRIMARY KEY,',
          '  owner text NOT NULL,',
          '  balance numeric(12,2) NOT NULL CONSTRAINT balance_not_negative CHECK (balance >= 0)',
          ');',
          "INSERT INTO accounts VALUES (1, 'Asha', 500);",
          'UPDATE accounts SET balance = balance - 800 WHERE id = 1;'
        ),
        output: '[Error] new row for relation "accounts" violates check constraint "balance_not_negative"',
        codeNotes: [
          { line: 4, note: 'A named CHECK rule: the balance can never be below 0.' },
          { line: 7, note: 'This would make the balance -300, so PostgreSQL refuses.' }
        ],
        tryIt: 'Change 800 to 300 on the last line and add SELECT * FROM accounts; after it. The update works, leaving 200.',
        check: {
          question: 'Why add a CHECK rule in the database when the app already checks the amount?',
          options: ['Data can arrive from many places, and the rule protects it from all of them', 'Apps cannot check numbers', 'CHECK rules make queries faster'],
          answer: 0,
          why: 'Scripts, imports and other apps can bypass one app\'s checks. A constraint is enforced for every change.'
        }
      },
      {
        title: 'CHECK rules',
        say: [
          'A CHECK rule is a condition that every row must meet. You write it like a WHERE condition: CHECK (price > 0), CHECK (rating BETWEEN 1 AND 5), CHECK (status IN (\'pending\', \'shipped\', \'delivered\')).',
          'PostgreSQL tests the condition on every INSERT and UPDATE. If it is false, the change is refused with an error naming the rule. If it is true, or NULL, the change goes ahead.',
          'That last detail matters: a CHECK passes when the condition is NULL. So CHECK (price > 0) allows a NULL price. If the value is also required, add NOT NULL as well.',
          'A CHECK can compare several columns of the same row: CHECK (end_date >= start_date) makes sure a booking does not end before it starts. Rules like this catch mistakes that a simple type cannot.',
          'CHECK rules can only look at the row being changed. They cannot look at other rows or other tables. For rules that involve other tables, you use foreign keys, or more advanced tools like triggers.',
          'Good CHECK rules describe business facts: prices are positive, discounts are between 0 and 100 percent, a quantity is at least 1. Ask the people who know the business which values should never be possible.'
        ],
        example: 'A cinema booking form will not let you pick a return journey before your departure, or book zero seats. Those are CHECK rules: simple facts about each booking that must always be true.',
        code: lines(
          'CREATE TABLE bookings (',
          '  id int PRIMARY KEY,',
          '  seats int NOT NULL CHECK (seats >= 1),',
          '  start_date date NOT NULL,',
          '  end_date date NOT NULL,',
          '  CHECK (end_date >= start_date)',
          ');',
          "INSERT INTO bookings VALUES (1, 2, '2026-10-01', '2026-10-03');",
          'SELECT * FROM bookings;',
          "INSERT INTO bookings VALUES (2, 1, '2026-10-05', '2026-10-02');"
        ),
        output: lines(
          ' id | seats | start_date | end_date',
          '----+-------+------------+------------',
          '  1 |     2 | 2026-10-01 | 2026-10-03',
          '(1 row)',
          '',
          '[Error] new row for relation "bookings" violates check constraint "bookings_check"'
        ),
        codeNotes: [
          { line: 3, note: 'At least one seat.' },
          { line: 6, note: 'A rule about two columns of the same row.' },
          { line: 10, note: 'Ends before it starts: refused.' }
        ],
        tryIt: "Fix line 10 so the booking ends after it starts, for example '2026-10-05' to '2026-10-07', and add SELECT count(*) FROM bookings; after it. Then try a booking with 0 seats.",
        check: {
          question: 'A column has CHECK (price > 0) but no NOT NULL. Can price be NULL?',
          options: ['Yes, because a CHECK passes when the condition is NULL', 'No, CHECK blocks NULL', 'Only for the first row'],
          answer: 0,
          why: 'A NULL comparison gives NULL, not false, so the CHECK does not block it. Add NOT NULL to require a value.'
        }
      },
      {
        title: 'UNIQUE on one or several columns',
        say: [
          'UNIQUE stops two rows having the same value in a column, like an email or a username. You met it on Day 2. Today, two more uses.',
          'A UNIQUE rule can cover several columns together: UNIQUE (student_id, course_id) means a student can enrol in many courses, and a course has many students, but the same student cannot enrol in the same course twice.',
          'Combined uniqueness is very common in junction tables and in things like "one review per customer per product" or "one attendance mark per student per day".',
          'UNIQUE treats NULLs as different from each other by default, so several rows can have a NULL email. If you need at most one row without a value, PostgreSQL has UNIQUE NULLS NOT DISTINCT, but that is rarely needed.',
          'Behind the scenes, PostgreSQL creates an index for every UNIQUE rule and every primary key. That index is what lets it check for duplicates quickly, even in huge tables. You will learn about indexes on Day 23.',
          'A UNIQUE rule also documents the design: anyone reading the table sees immediately that email identifies a user, or that one student has one row per course.'
        ],
        example: 'A college allows a student to join many clubs, and a club to have many students, but a student cannot sign up for the same club twice. The rule is about the pair: student plus club.',
        code: lines(
          'CREATE TABLE enrolments (',
          '  student_id int NOT NULL,',
          '  course_id int NOT NULL,',
          '  enrolled_on date NOT NULL,',
          '  UNIQUE (student_id, course_id)',
          ');',
          "INSERT INTO enrolments VALUES (1, 10, '2026-09-01'), (1, 20, '2026-09-01'), (2, 10, '2026-09-02');",
          'SELECT count(*) AS enrolments FROM enrolments;',
          "INSERT INTO enrolments VALUES (1, 10, '2026-09-05');"
        ),
        output: lines(
          ' enrolments',
          '------------',
          '          3',
          '(1 row)',
          '',
          '[Error] duplicate key value violates unique constraint "enrolments_student_id_course_id_key"'
        ),
        codeNotes: [
          { line: 5, note: 'The pair must be unique; each value alone may repeat.' },
          { line: 7, note: 'Student 1 in two courses, and course 10 with two students: all fine.' },
          { line: 9, note: 'Student 1 in course 10 again: refused.' }
        ],
        tryIt: "Change line 9 to a new pair, like (2, 20, '2026-09-05'), and add SELECT count(*) FROM enrolments; after it. The new pair is accepted, making 4 enrolments.",
        check: {
          question: 'What does UNIQUE (student_id, course_id) prevent?',
          options: ['The same student enrolling in the same course twice', 'A student enrolling in two courses', 'A course having two students'],
          answer: 0,
          why: 'A multi-column UNIQUE rule applies to the combination. Each column alone can still repeat.'
        }
      },
      {
        title: 'ALTER TABLE: changing a table that already exists',
        say: [
          'Tables change as an app grows: a new column, a new rule, a renamed column. You do not have to drop and recreate the table; ALTER TABLE changes it in place, keeping the data.',
          'ALTER TABLE products ADD COLUMN discount numeric(5,2) DEFAULT 0 adds a column. ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0) adds a rule. ALTER TABLE products ALTER COLUMN name SET NOT NULL makes a column required.',
          'When you add a rule, PostgreSQL checks it against every existing row first. If any row breaks the new rule, the ALTER fails, and nothing changes. That is a good thing: it tells you exactly which data needs cleaning before the rule can be added.',
          'The usual workflow is: find the bad rows with a SELECT, fix them with an UPDATE, then add the constraint. The rule then keeps the data clean from that moment on.',
          'You can also remove things: ALTER TABLE ... DROP COLUMN, DROP CONSTRAINT. Be careful, as dropping a column deletes its data.',
          'In real teams, changes like these are written as migration scripts, small numbered files that are run in order on every copy of the database, so development, testing and live databases stay the same shape.'
        ],
        example: 'A school decides every student must now have a parent\'s phone number on file. Before making it compulsory, the office first finds the students without one and collects the numbers. Only then does the rule take effect. That is clean up first, then add the rule.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Free sticker', 0), (3, 'Notebook', 60);",
          'SELECT id, name FROM products WHERE price <= 0;',
          "UPDATE products SET price = 1 WHERE name = 'Free sticker';",
          'ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0);',
          'ALTER TABLE products ADD COLUMN discount numeric(5,2) NOT NULL DEFAULT 0;',
          'SELECT * FROM products ORDER BY id;'
        ),
        output: lines(
          ' id | name',
          '----+--------------',
          '  2 | Free sticker',
          '(1 row)',
          '',
          ' id | name         | price | discount',
          '----+--------------+-------+----------',
          '  1 | Pen          | 10.00 |     0.00',
          '  2 | Free sticker |  1.00 |     0.00',
          '  3 | Notebook     | 60.00 |     0.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Find the rows that would break the new rule.' },
          { line: 4, note: 'Fix them first.' },
          { line: 5, note: 'Now the rule can be added, and it protects the table from here on.' },
          { line: 6, note: 'A new column; existing rows get the default.' }
        ],
        tryIt: 'Remove the UPDATE on line 4 and run it. The ALTER on line 5 fails, because the free sticker breaks the rule.',
        check: {
          question: 'What happens when you add a CHECK rule that some existing rows break?',
          options: ['The ALTER TABLE fails, and you must fix those rows first', 'The bad rows are deleted', 'The rule is added but ignored for old rows'],
          answer: 0,
          why: 'PostgreSQL checks existing rows when adding a rule. If any break it, the change is refused.'
        }
      },
      {
        title: 'What happens on delete: CASCADE, SET NULL, RESTRICT',
        say: [
          'A foreign key links a child row to a parent row, like an order item to its order. What should happen to the children when the parent is deleted? You choose with ON DELETE.',
          'The default is to refuse: you cannot delete an order that still has items. This is the safest choice, and you have seen its error already. RESTRICT is almost the same thing, written explicitly.',
          'ON DELETE CASCADE deletes the children too. Delete an order, and its order items go with it. This makes sense when the children have no meaning without the parent: an order line without an order is useless.',
          'ON DELETE SET NULL keeps the children but clears their link. Delete a salesperson, and their past orders stay, with no salesperson recorded. This makes sense when the children still matter on their own.',
          'Choose carefully. CASCADE is convenient but powerful: deleting one customer with CASCADE all the way down could remove years of orders. For important business data, many companies prefer the default refusal, and use soft deletes instead, as you saw on Day 3.',
          'There is also ON UPDATE, for when a parent\'s key changes, but with ids that never change, it is rarely needed.'
        ],
        example: 'If a school closes a club, its membership list is thrown away too, because members of a closed club mean nothing: that is CASCADE. If a teacher leaves, their old students are not deleted; the "class teacher" box just becomes empty: that is SET NULL.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer text);',
          'CREATE TABLE order_items (order_id int REFERENCES orders(id) ON DELETE CASCADE, product text);',
          'CREATE TABLE staff (id int PRIMARY KEY, name text);',
          'CREATE TABLE deliveries (id int PRIMARY KEY, staff_id int REFERENCES staff(id) ON DELETE SET NULL);',
          "INSERT INTO orders VALUES (1, 'Asha'), (2, 'Ravi');",
          "INSERT INTO order_items VALUES (1, 'Pen'), (1, 'Notebook'), (2, 'Backpack');",
          "INSERT INTO staff VALUES (7, 'Vikram');",
          'INSERT INTO deliveries VALUES (100, 7), (101, 7);',
          'DELETE FROM orders WHERE id = 1;',
          'DELETE FROM staff WHERE id = 7;',
          'SELECT count(*) AS items_left FROM order_items;',
          'SELECT id, staff_id FROM deliveries ORDER BY id;'
        ),
        output: lines(
          ' items_left',
          '------------',
          '          1',
          '(1 row)',
          '',
          ' id  | staff_id',
          '-----+----------',
          ' 100 |     NULL',
          ' 101 |     NULL',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 2, note: 'CASCADE: deleting an order deletes its items.' },
          { line: 4, note: 'SET NULL: deleting a staff member keeps the deliveries, without a name.' },
          { line: 11, note: 'Only order 2\'s item is left.' }
        ],
        tryIt: 'Remove ON DELETE CASCADE from line 2 and run it. Deleting order 1 is now refused, because it still has items.',
        check: {
          question: 'Which ON DELETE option fits "order items should be removed when their order is deleted"?',
          options: ['CASCADE', 'SET NULL', 'The default (refuse)'],
          answer: 0,
          why: 'Order items have no meaning without their order, so deleting them together with it makes sense.'
        }
      },
      {
        title: 'Putting it together: a well-protected table',
        say: [
          'Let us design a reviews table with every rule from this week: an id, a product that must exist, a customer, a rating from 1 to 5, and one review per customer per product. Reviews are deleted with their product.',
          'Read the CREATE TABLE line by line: each rule is one short phrase, and together they describe exactly what a valid review is. Anyone joining the team can read the rules straight from the design.',
          'Then we try three bad inserts inside separate statements. Each is refused with a clear message naming the broken rule. In a real app, those messages would be turned into friendly text for the user.',
          'In today\'s practice, you will add a UNIQUE email and a CHECK on balance to an existing accounts table with ALTER TABLE, and create a books table whose rows are deleted along with their author.',
          'Tomorrow you learn transactions: how to make several changes happen together, all or nothing, which is the other half of keeping data safe.',
          'A table with good constraints is like a building with good foundations. You rarely think about them, but they are what stop everything falling apart when something unexpected happens.'
        ],
        example: 'A well-run exam hall has rules printed at the door: one seat per student, only registered students, no phones. The invigilator does not need to remember them all; the rules are on the wall for everyone. Constraints are the rules on the wall of your table.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text NOT NULL);',
          "INSERT INTO products VALUES (1, 'Notebook');",
          'CREATE TABLE reviews (',
          '  id serial PRIMARY KEY,',
          '  product_id int NOT NULL REFERENCES products(id) ON DELETE CASCADE,',
          '  customer text NOT NULL,',
          '  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),',
          '  UNIQUE (product_id, customer)',
          ');',
          "INSERT INTO reviews (product_id, customer, rating) VALUES (1, 'Asha', 5);",
          'SELECT product_id, customer, rating FROM reviews;',
          "INSERT INTO reviews (product_id, customer, rating) VALUES (1, 'Asha', 4);"
        ),
        output: lines(
          ' product_id | customer | rating',
          '------------+----------+--------',
          '          1 | Asha     |      5',
          '(1 row)',
          '',
          '[Error] duplicate key value violates unique constraint "reviews_product_id_customer_key"'
        ),
        codeNotes: [
          { line: 5, note: 'Must be a real product; reviews go when the product goes.' },
          { line: 7, note: 'Ratings from 1 to 5 only.' },
          { line: 8, note: 'One review per customer per product.' },
          { line: 12, note: 'Asha reviewing the same product again: refused.' }
        ],
        tryIt: "Change the last line to a rating of 9 for a new customer, like ('Ravi', 9), and read which rule refuses it.",
        check: {
          question: 'Which rule stops Asha reviewing the same product twice?',
          options: ['UNIQUE (product_id, customer)', 'CHECK (rating BETWEEN 1 AND 5)', 'The foreign key on product_id'],
          answer: 0,
          why: 'The multi-column UNIQUE rule allows one row per product and customer pair.'
        }
      }
    ],
    summary: [
      'Constraints are rules PostgreSQL enforces for every change, from every app or script.',
      'CHECK (condition) must be true or NULL for every row; add NOT NULL to require a value.',
      'UNIQUE can cover several columns together, like one enrolment per student per course.',
      'ALTER TABLE adds columns and rules; fix existing bad rows first.',
      'ON DELETE: the default refuses, CASCADE deletes children, SET NULL clears the link.'
    ],
    projectStep: {
      title: 'My Library: add safety rules',
      steps: [
        'Add CHECK (pages > 0) to your books table with ALTER TABLE.',
        'Add a rating column with CHECK (rating BETWEEN 1 AND 5).',
        'Make each title unique per author with UNIQUE (title, author_id).',
        'Decide what should happen to books when an author is deleted, and set ON DELETE.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 22,
    title: 'Transactions: All or Nothing',
    goal: 'You can group changes into a transaction with BEGIN and COMMIT, undo them with ROLLBACK, and explain ACID in plain words.',
    minutes: 28,
    recap: 'Yesterday you protected tables with CHECK, UNIQUE, ALTER TABLE and ON DELETE rules.',
    parts: [
      {
        title: 'Why some changes must happen together',
        say: [
          'Some jobs need several changes that only make sense together. Moving 500 rupees from Asha to Ravi means taking 500 from Asha and adding 500 to Ravi. If the first change happens and the second fails, 500 rupees have simply vanished.',
          'Failures happen: the server restarts, the network drops, a constraint rejects a value, a bug throws an error halfway. Without protection, the data is left half-changed, and nobody may notice until the numbers stop adding up.',
          'A transaction solves this. It groups several statements into one unit that either happens completely, or not at all. There is no in-between state that anyone else can see.',
          'You start a transaction with BEGIN, run your statements, and finish with COMMIT to make them permanent. If anything goes wrong before COMMIT, all the changes since BEGIN are undone.',
          'Every single statement in PostgreSQL is already its own small transaction. An UPDATE that changes a thousand rows changes all of them or none of them. BEGIN and COMMIT let you extend that guarantee across several statements.',
          'Banks, shops, ticket booking sites and every app that handles money or stock rely on transactions. Understanding them is a basic requirement for backend developer jobs.'
        ],
        example: 'When you pay at a shop by UPI, the money must leave your account and reach the shop together. You would be very upset if it left your account and never arrived. The bank wraps both steps in one transaction.',
        code: lines(
          'CREATE TABLE accounts (id int PRIMARY KEY, owner text, balance numeric(12,2) CHECK (balance >= 0));',
          "INSERT INTO accounts VALUES (1, 'Asha', 1000), (2, 'Ravi', 200);",
          'BEGIN;',
          'UPDATE accounts SET balance = balance - 500 WHERE id = 1;',
          'UPDATE accounts SET balance = balance + 500 WHERE id = 2;',
          'COMMIT;',
          'SELECT owner, balance FROM accounts ORDER BY id;',
          'SELECT sum(balance) AS total_money FROM accounts;'
        ),
        output: lines(
          ' owner | balance',
          '-------+---------',
          ' Asha  |  500.00',
          ' Ravi  |  700.00',
          '(2 rows)',
          '',
          ' total_money',
          '-------------',
          '     1200.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Start the transaction.' },
          { line: 4, note: 'Both updates belong together.' },
          { line: 6, note: 'Make both permanent at once.' },
          { line: 8, note: 'The total is still 1200: no money appeared or vanished.' }
        ],
        tryIt: 'Change the amount to 5000 in both updates and run it. The first update breaks the CHECK rule, the transaction fails, and nothing changes.',
        check: {
          question: 'What does a transaction guarantee?',
          options: ['All its changes happen together, or none of them happen', 'It runs faster than separate statements', 'It cannot contain UPDATE statements'],
          answer: 0,
          why: 'A transaction is all or nothing: either every change is committed, or all are undone.'
        }
      },
      {
        title: 'ROLLBACK: undoing on purpose',
        say: [
          'COMMIT keeps the changes. ROLLBACK throws them away. Everything done since BEGIN is undone, as if it never happened.',
          'Apps use ROLLBACK when they discover a problem partway through: the item is out of stock, the payment was declined, the user pressed cancel. Instead of trying to reverse each change by hand, they simply roll back.',
          'ROLLBACK is also a great safety tool when you work on a real database by hand. Start with BEGIN, run your UPDATE, check the result with a SELECT, and only COMMIT if it looks right. If it looks wrong, ROLLBACK, and nothing was damaged.',
          'Inside the transaction, your own SELECTs see your changes, even before COMMIT. That is how you check them. Other people connected to the database do not see them until you commit.',
          'Remember the Day 3 warning about UPDATE without WHERE? Working inside BEGIN turns that disaster into a small scare: you see the wrong row count, you ROLLBACK, and every row is back as it was.',
          'Do not leave a transaction open for long. While it is open, it may hold locks that make other people wait. Check, then commit or roll back quickly.'
        ],
        example: 'Writing an important email: you write a draft, read it through, and either press Send or Discard. BEGIN starts the draft, SELECT is reading it through, COMMIT is Send, and ROLLBACK is Discard.',
        code: lines(
          'CREATE TABLE products (id int PRIMARY KEY, name text, price numeric(10,2));',
          "INSERT INTO products VALUES (1, 'Pen', 10), (2, 'Notebook', 60), (3, 'Backpack', 1200);",
          'BEGIN;',
          'UPDATE products SET price = 0;',
          'SELECT count(*) AS free_products FROM products WHERE price = 0;',
          'ROLLBACK;',
          'SELECT name, price FROM products ORDER BY id;'
        ),
        output: lines(
          ' free_products',
          '---------------',
          '             3',
          '(1 row)',
          '',
          ' name     | price',
          '----------+---------',
          ' Pen      |   10.00',
          ' Notebook |   60.00',
          ' Backpack | 1200.00',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'A mistake: no WHERE, so every product becomes free.' },
          { line: 5, note: 'Checking inside the transaction shows the damage: 3 free products.' },
          { line: 6, note: 'ROLLBACK undoes everything since BEGIN.' },
          { line: 7, note: 'All prices are back.' }
        ],
        tryIt: 'Change ROLLBACK to COMMIT and run it. This time the mistake is saved, and every price is 0.',
        check: {
          question: 'You ran an UPDATE inside BEGIN and it changed far more rows than expected. What should you do?',
          options: ['ROLLBACK, so all changes since BEGIN are undone', 'COMMIT and fix it later', 'Run DELETE'],
          answer: 0,
          why: 'Before COMMIT, ROLLBACK safely undoes every change made in the transaction.'
        }
      },
      {
        title: 'Errors inside a transaction',
        say: [
          'When a statement inside a transaction fails, for example because it breaks a constraint, PostgreSQL marks the whole transaction as failed. Every further statement is refused until you end it.',
          'You will see a message like "current transaction is aborted, commands ignored until end of transaction block". It means: something already went wrong, so nothing else will run. End the transaction, and the failed changes are all undone.',
          'This is the "all or nothing" rule in action. PostgreSQL will not let you continue as if the failed step had worked, because that could leave the data half-changed.',
          'In apps, database libraries handle this for you. You write your steps inside a transaction block, and if any step throws an error, the library rolls back automatically. You will see this with Python and Node.js on Day 26.',
          'The important habit is to put all the steps of one business action, like "place an order", inside one transaction: create the order, add the items, reduce the stock. If the stock update fails, the order and its items vanish too.',
          'In the lesson editor, the error stops the run, so you only see the error message, but the idea is exactly the same: the failed transaction changed nothing.'
        ],
        example: 'A train reservation for a family of four: if only three seats are available, the system does not book three people and leave the fourth stranded. The whole booking fails, and nobody is charged. One failed step cancels the whole group.',
        code: lines(
          'CREATE TABLE stock (product text PRIMARY KEY, units int CHECK (units >= 0));',
          "INSERT INTO stock VALUES ('Pen', 5);",
          'CREATE TABLE sales (product text, quantity int);',
          'BEGIN;',
          "INSERT INTO sales VALUES ('Pen', 8);",
          "UPDATE stock SET units = units - 8 WHERE product = 'Pen';",
          'COMMIT;'
        ),
        output: '[Error] new row for relation "stock" violates check constraint "stock_units_check"',
        codeNotes: [
          { line: 5, note: 'The sale is recorded first...' },
          { line: 6, note: '...but there are only 5 pens, so the stock would go below 0 and the CHECK refuses.' },
          { line: 7, note: 'Because of the error, the whole transaction is undone, including the sale.' }
        ],
        tryIt: 'Change 8 to 3 in both lines, and add SELECT * FROM stock; SELECT * FROM sales; at the end. Now both changes are saved together.',
        check: {
          question: 'Inside a transaction, the second of three statements fails. What happens to the first one\'s changes?',
          options: ['They are undone along with everything else in the transaction', 'They stay saved', 'Only the third statement is undone'],
          answer: 0,
          why: 'A failed transaction commits nothing. All changes since BEGIN are discarded.'
        }
      },
      {
        title: 'ACID in plain words',
        say: [
          'Databases like PostgreSQL promise four properties for transactions, remembered as ACID. It is a classic interview question, so here it is in plain words.',
          'A is for Atomic: all or nothing. A transaction cannot be half done. You have seen this in every example today.',
          'C is for Consistent: a transaction takes the database from one valid state to another. Every constraint, like "balance never below zero", holds before and after. If a change would break a rule, the transaction fails instead.',
          'I is for Isolated: transactions running at the same time do not see each other\'s unfinished work. While your transfer is half done, nobody else sees Asha\'s money gone and Ravi\'s not yet arrived.',
          'D is for Durable: once COMMIT succeeds, the change survives, even if the server loses power a second later. PostgreSQL writes it to a log on disk before saying "committed".',
          'These four promises are why banks, hospitals and shops trust relational databases with their most important data. Some newer databases relax them for speed, which is one of the trade-offs you will read about on Day 29.'
        ],
        example: 'Think of posting a registered letter. Atomic: it is either sent or not. Consistent: it follows the post office\'s rules. Isolated: nobody sees it half-posted. Durable: once you have the receipt, it is officially sent, even if the counter\'s computer crashes afterwards.',
        code: lines(
          'CREATE TABLE seats (seat text PRIMARY KEY, booked_by text);',
          "INSERT INTO seats VALUES ('A1', NULL), ('A2', NULL);",
          'BEGIN;',
          "UPDATE seats SET booked_by = 'Asha' WHERE seat = 'A1' AND booked_by IS NULL;",
          "UPDATE seats SET booked_by = 'Asha' WHERE seat = 'A2' AND booked_by IS NULL;",
          'COMMIT;',
          'SELECT seat, booked_by FROM seats ORDER BY seat;'
        ),
        output: lines(
          ' seat | booked_by',
          '------+-----------',
          ' A1   | Asha',
          ' A2   | Asha',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Book a seat only if it is still free.' },
          { line: 6, note: 'Both seats are booked together, or neither is.' }
        ],
        tryIt: "Before BEGIN, book A2 for Ravi: UPDATE seats SET booked_by = 'Ravi' WHERE seat = 'A2'; Then run it. Asha only gets A1, because A2 was no longer free.",
        check: {
          question: 'What does the D in ACID mean?',
          options: ['Durable: committed changes survive a crash', 'Deleted: rows can be removed', 'Distinct: no duplicate rows'],
          answer: 0,
          why: 'Durability means once COMMIT succeeds, the change is safely stored and survives power loss or restarts.'
        }
      },
      {
        title: 'When two people change the same row',
        say: [
          'In a real app, many users act at the same moment. Two people might try to book the last seat, or two cashiers might sell the last pen. Transactions and locks keep this safe.',
          'When a transaction updates a row, PostgreSQL locks that row until the transaction ends. If a second transaction tries to update the same row, it waits. When the first commits, the second continues and sees the new value.',
          'That is why the seat booking in the last example used WHERE booked_by IS NULL. The second person\'s update waits, then finds the seat is no longer free, and changes nothing. The app sees "0 rows updated" and can tell the user the seat was taken.',
          'A classic bug is reading a value, deciding in the app, then writing it back: read the stock as 1, see it is enough, write 0. If two people do this at once, both read 1, and both sell. The fix is to do the check and the change in one UPDATE, like UPDATE stock SET units = units - 1 WHERE product = \'Pen\' AND units >= 1.',
          'Another option is SELECT ... FOR UPDATE, which locks the rows you read so nobody else can change them until you finish. It is used when the app really must read first and decide.',
          'The lesson editor has only one connection, so it cannot show two users at once. But these patterns, doing the check inside the UPDATE, are exactly what you should use in real apps.'
        ],
        example: 'Two people reach for the last packet of biscuits on a shelf at the same moment. Only one hand can take it. The shop does not sell the same packet twice; the second person finds the shelf empty. A row lock is that single packet.',
        code: lines(
          'CREATE TABLE stock (product text PRIMARY KEY, units int NOT NULL);',
          "INSERT INTO stock VALUES ('Pen', 1);",
          "UPDATE stock SET units = units - 1 WHERE product = 'Pen' AND units >= 1 RETURNING units AS left_after_first_sale;",
          "UPDATE stock SET units = units - 1 WHERE product = 'Pen' AND units >= 1 RETURNING units AS left_after_second_sale;",
          "SELECT units FROM stock WHERE product = 'Pen';"
        ),
        output: lines(
          ' left_after_first_sale',
          '-----------------------',
          '                     0',
          '(1 row)',
          '',
          ' left_after_second_sale',
          '------------------------',
          '(0 rows)',
          '',
          ' units',
          '-------',
          '     0',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The check (units >= 1) and the change happen in one statement.' },
          { line: 4, note: 'The second sale finds no row that matches: 0 rows, so nothing is sold twice.' }
        ],
        tryIt: 'Remove AND units >= 1 from both updates and run it. The stock goes to -1: the same pen was sold twice.',
        check: {
          question: 'How do you stop two sales taking the last item?',
          options: ['Check and change in one UPDATE: SET units = units - 1 WHERE ... AND units >= 1', 'Read the stock in the app first, then update', 'Add ORDER BY to the UPDATE'],
          answer: 0,
          why: 'Doing the check inside the UPDATE, on a locked row, means the second sale sees the new value and matches nothing.'
        }
      },
      {
        title: 'Putting it together: placing an order safely',
        say: [
          'Let us write the most important transaction in any shop: placing an order. It must create the order, add its items, and reduce the stock, all together.',
          'Inside BEGIN and COMMIT, we insert the order and use RETURNING to see its id, insert the order item, and reduce the stock with a safe UPDATE that checks there is enough.',
          'If the stock is too low, the CHECK rule on units refuses the update, and the whole order disappears as if it was never placed. No order without stock, no stock taken without an order.',
          'In today\'s practice, you will transfer money between two accounts in one transaction, and record a sale while reducing the stock, all together.',
          'Tomorrow you learn how to make queries fast with indexes, and how to read what PostgreSQL does behind the scenes with EXPLAIN.',
          'Whenever you write code that changes several tables for one user action, ask yourself: what happens if this fails halfway? If the answer is "the data is wrong", you need a transaction.'
        ],
        example: 'When you order food in an app, three things happen: the order is created, your money is taken, and the restaurant\'s menu stock goes down. If any of them fails, none should stay. The app wraps them in one transaction.',
        code: lines(
          'CREATE TABLE stock (product text PRIMARY KEY, units int NOT NULL CHECK (units >= 0));',
          "INSERT INTO stock VALUES ('Notebook', 10);",
          'CREATE TABLE orders (id serial PRIMARY KEY, customer text NOT NULL);',
          'CREATE TABLE order_items (order_id int REFERENCES orders(id), product text, quantity int);',
          'BEGIN;',
          "INSERT INTO orders (customer) VALUES ('Asha') RETURNING id;",
          "INSERT INTO order_items VALUES (1, 'Notebook', 3);",
          "UPDATE stock SET units = units - 3 WHERE product = 'Notebook';",
          'COMMIT;',
          "SELECT (SELECT count(*) FROM orders) AS orders, (SELECT units FROM stock WHERE product = 'Notebook') AS notebooks_left;"
        ),
        output: lines(
          ' id',
          '----',
          '  1',
          '(1 row)',
          '',
          ' orders | notebooks_left',
          '--------+----------------',
          '      1 |              7',
          '(1 row)'
        ),
        codeNotes: [
          { line: 5, note: 'One transaction for the whole order.' },
          { line: 6, note: 'Create the order and see its new id.' },
          { line: 8, note: 'Take the stock. If there were not enough, the CHECK would undo everything.' }
        ],
        tryIt: 'Change the quantity to 30 in lines 7 and 8 and run it. The stock update fails, and the order is not created either.',
        check: {
          question: 'Why is placing an order done in one transaction?',
          options: ['So the order, its items and the stock change together, or not at all', 'Because INSERT needs a transaction', 'To make RETURNING work'],
          answer: 0,
          why: 'If any step fails, the transaction undoes the others, so there is never an order without stock taken, or the reverse.'
        }
      }
    ],
    summary: [
      'A transaction groups statements: BEGIN, the changes, then COMMIT to keep them.',
      'ROLLBACK undoes everything since BEGIN; use it to check risky changes safely.',
      'If a statement fails inside a transaction, the whole transaction is undone.',
      'ACID: Atomic, Consistent, Isolated, Durable.',
      'Avoid double-selling by checking and changing in one UPDATE, like WHERE units >= 1.'
    ],
    projectStep: {
      title: 'My Library: lending a book safely',
      steps: [
        'Create a loans table (book_id, friend, lent_on) and add an is_lent boolean DEFAULT false to books.',
        'In one transaction, insert a loan and set is_lent = true for that book.',
        'Make the UPDATE safe: only lend if is_lent = false.',
        'Try lending the same book twice and check that the second time changes nothing.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 23,
    title: 'Faster Queries: Indexes and EXPLAIN',
    goal: 'You can explain what an index is, create one, read a simple EXPLAIN plan, and decide which columns deserve an index.',
    minutes: 28,
    recap: 'Yesterday you used transactions to make changes all or nothing, and learned ACID and safe updates.',
    parts: [
      {
        title: 'Why big tables get slow',
        say: [
          'So far every table has had a handful of rows, and every query was instant. Real tables are bigger: a shop might have a million orders, a bank hundreds of millions of transactions.',
          'Without help, finding one order by its customer means PostgreSQL reads every single row and checks it. This is called a sequential scan, or Seq Scan. On a million rows, that can take a noticeable time, and if thousands of users do it at once, the whole app slows down.',
          'An index is a separate, sorted structure that points to where each value lives in the table. With an index on customer_id, PostgreSQL can jump straight to that customer\'s orders, instead of reading everything.',
          'Primary keys and UNIQUE columns get an index automatically. That is why looking up a row by its id is always fast. Other columns, like customer_id in orders or email in a login table, need an index you create yourself.',
          'Indexes are the single most important tool for database speed. Many "the app is slow" problems in real companies are solved by adding one well-chosen index.',
          'The rest of today is about how to create them, how to check whether PostgreSQL uses them, and when not to add them.',
          'The example below uses generate_series, a PostgreSQL function that produces a list of numbers, to create 50,000 orders in one statement. It is a handy way to make realistic amounts of test data when you want to see how a query behaves on a bigger table.'
        ],
        example: 'Finding a topic in a 600-page textbook by reading every page takes ages. The index at the back says "Photosynthesis: page 212", and you go straight there. A database index works exactly the same way.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders SELECT n, n % 5000, (n % 900) + 10 FROM generate_series(1, 50000) AS n;',
          'SELECT count(*) AS orders, count(DISTINCT customer_id) AS customers FROM orders;',
          'SELECT count(*) AS orders_of_customer_42 FROM orders WHERE customer_id = 42;'
        ),
        output: lines(
          ' orders | customers',
          '--------+-----------',
          '  50000 |      5000',
          '(1 row)',
          '',
          ' orders_of_customer_42',
          '-----------------------',
          '                    10',
          '(1 row)'
        ),
        codeNotes: [
          { line: 2, note: 'generate_series makes 50,000 numbers, so we get 50,000 orders from 5,000 customers.' },
          { line: 4, note: 'Without an index, PostgreSQL checks all 50,000 rows to find these 10.' }
        ],
        tryIt: 'Change 50000 to 200000 and run it. The table is bigger, and the search still works, but on a real server, reading every row gets slower as the table grows.',
        check: {
          question: 'What is a sequential scan?',
          options: ['Reading every row of the table to find the matching ones', 'Using an index to jump to the rows', 'Sorting the table'],
          answer: 0,
          why: 'A Seq Scan checks each row one by one. Indexes let PostgreSQL skip straight to the matching rows.'
        }
      },
      {
        title: 'EXPLAIN: seeing the plan',
        say: [
          'Before running a query, PostgreSQL makes a plan: which tables to read, in which order, and how. EXPLAIN in front of a query shows you that plan instead of running it.',
          'The plan is shown as a small tree of steps. The step you will look for most is the scan: Seq Scan means "read every row", Index Scan or Bitmap Index Scan means "use an index".',
          'By default, EXPLAIN also shows cost estimates, long numbers that depend on the machine. In the examples we use EXPLAIN (COSTS OFF) so the plan is short and stays the same every time.',
          'EXPLAIN ANALYZE actually runs the query and adds the real time taken. It is the tool for measuring on a real database, but its timings change every run, so it is not used in the lesson examples.',
          'Reading plans is a skill that grows with practice. For now, focus on one question: did PostgreSQL read the whole table, or did it use an index?',
          'Notice the Filter line under a Seq Scan. It tells you the condition PostgreSQL checked on every row. That is the work an index can save.'
        ],
        example: 'Before a long drive, a map app shows you the route it plans to take, before you start. EXPLAIN is that route preview for your query: you see the plan without actually making the trip.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders SELECT n, n % 5000, (n % 900) + 10 FROM generate_series(1, 50000) AS n;',
          'ANALYZE orders;',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42;',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE id = 42;'
        ),
        output: lines(
          ' QUERY PLAN',
          '------------------------------',
          ' Seq Scan on orders',
          '   Filter: (customer_id = 42)',
          '(2 rows)',
          '',
          ' QUERY PLAN',
          '----------------------------------------',
          ' Index Scan using orders_pkey on orders',
          '   Index Cond: (id = 42)',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'ANALYZE collects statistics so PostgreSQL can plan well.' },
          { line: 4, note: 'No index on customer_id: a Seq Scan with a Filter.' },
          { line: 5, note: 'The primary key has an index: an Index Scan.' }
        ],
        tryIt: 'Change the first EXPLAIN to search WHERE total > 900. It also reads every row, because there is no index on total.',
        check: {
          question: 'In an EXPLAIN plan, what does "Seq Scan on orders" tell you?',
          options: ['PostgreSQL will read every row of orders', 'An index on orders will be used', 'The query has an error'],
          answer: 0,
          why: 'Seq Scan means a full read of the table. Index Scan means an index is used.'
        }
      },
      {
        title: 'CREATE INDEX',
        say: [
          'You create an index with CREATE INDEX name ON table (column). A clear naming style is idx_table_column, like idx_orders_customer.',
          'After the index exists, PostgreSQL decides on its own when to use it. You do not change your queries at all. The same SELECT becomes faster because the plan changes.',
          'Creating an index on a large table takes some time, because PostgreSQL has to read and sort the whole column. On a busy live database, teams use CREATE INDEX CONCURRENTLY, which builds it without blocking other users.',
          'Foreign key columns, like customer_id in orders, are the most common columns to index. Joins and lookups use them constantly, and PostgreSQL does not index them automatically.',
          'Other good candidates are columns you often filter or sort by, like status, created_at or email. Look at your most common and slowest queries, and index the columns in their WHERE, JOIN and ORDER BY.',
          'After creating an index, run EXPLAIN again to confirm it is used. If it is not, the query or the data may not suit that index, which is the topic of part 5.'
        ],
        example: 'A library that adds an author index card cabinet does not change its books or how you ask for them. It simply lets the librarian find "all books by R. K. Narayan" without walking every shelf.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, total numeric(10,2));',
          'INSERT INTO orders SELECT n, n % 5000, (n % 900) + 10 FROM generate_series(1, 50000) AS n;',
          'CREATE INDEX idx_orders_customer ON orders (customer_id);',
          'ANALYZE orders;',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42;',
          'SELECT count(*) AS orders_of_customer_42 FROM orders WHERE customer_id = 42;'
        ),
        output: lines(
          ' QUERY PLAN',
          '------------------------------------------------',
          ' Bitmap Heap Scan on orders',
          '   Recheck Cond: (customer_id = 42)',
          '   ->  Bitmap Index Scan on idx_orders_customer',
          '         Index Cond: (customer_id = 42)',
          '(4 rows)',
          '',
          ' orders_of_customer_42',
          '-----------------------',
          '                    10',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Create the index on the column we search by.' },
          { line: 5, note: 'The plan now uses the index instead of reading every row.' },
          { line: 6, note: 'The query and its answer are exactly the same as before.' }
        ],
        tryIt: 'Add an index on total: CREATE INDEX idx_orders_total ON orders (total); and EXPLAIN a query WHERE total = 500.',
        check: {
          question: 'After creating an index, what do you need to change in your SELECT queries?',
          options: ['Nothing; PostgreSQL decides when to use the index', 'Add USE INDEX to every query', 'Rename the column'],
          answer: 0,
          why: 'Indexes are used automatically when the planner thinks they help. Queries stay the same.'
        }
      },
      {
        title: 'What indexes cost',
        say: [
          'If indexes make reading faster, why not index every column? Because indexes are not free.',
          'Each index takes disk space, sometimes as much as the table itself. And every INSERT, UPDATE and DELETE must update every index on the table too. A table with ten indexes makes every write do ten extra pieces of work.',
          'So indexes are a trade-off: faster reads, slower writes, more storage. A table that is read constantly, like products, can have several. A table that is written constantly, like a log of every click, should have few.',
          'Indexes also help less when a column has very few different values. An index on a boolean is_active column, where 99 percent of rows are true, rarely helps, because reading "all the true rows" is nearly the whole table anyway.',
          'Indexes that are never used are pure cost. PostgreSQL keeps statistics that show how often each index is used, and database teams regularly remove unused ones.',
          'A good rule for beginners: index primary keys (automatic), foreign keys, and the columns in your most frequent WHERE and ORDER BY. Then measure with EXPLAIN before adding more.'
        ],
        example: 'A book with an index for every single word would be twice as thick and take much longer to update in each new edition. A good index lists the important topics only. Database indexes are the same: useful ones help, too many slow everything down.',
        code: lines(
          'CREATE TABLE clicks (id int, page text, clicked_at timestamp);',
          "INSERT INTO clicks SELECT n, '/page/' || (n % 50), timestamp '2026-09-01' + n * interval '1 minute' FROM generate_series(1, 20000) AS n;",
          'CREATE INDEX idx_clicks_page ON clicks (page);',
          'CREATE INDEX idx_clicks_time ON clicks (clicked_at);',
          "SELECT relname AS name, CASE WHEN relkind = 'i' THEN 'index' ELSE 'table' END AS kind",
          'FROM pg_class',
          "WHERE relname IN ('clicks', 'idx_clicks_page', 'idx_clicks_time')",
          'ORDER BY kind DESC, name;'
        ),
        output: lines(
          ' name            | kind',
          '-----------------+-------',
          ' clicks          | table',
          ' idx_clicks_page | index',
          ' idx_clicks_time | index',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'Each index is a separate structure that every INSERT must also update.' },
          { line: 5, note: 'pg_class lists tables and indexes: here, one table with two indexes to maintain.' }
        ],
        tryIt: 'Add a third index on id and run it again. Then think: for a table written to every second, is every index worth its cost?',
        check: {
          question: 'Why not add an index to every column?',
          options: ['Every index uses space and slows down every INSERT, UPDATE and DELETE', 'PostgreSQL allows only one index per table', 'Indexes make SELECT slower'],
          answer: 0,
          why: 'Indexes speed up reads but must be maintained on every write, so each one should earn its place.'
        }
      },
      {
        title: 'Indexes on several columns and on expressions',
        say: [
          'An index can cover several columns: CREATE INDEX ON orders (customer_id, ordered_on). It helps queries that filter by the customer and then by date, like "this customer\'s orders in September", and it can also return them already sorted by date.',
          'Column order matters in a multi-column index. It is sorted by the first column, then the second within it, like a phone book sorted by surname then first name. So it helps searches by customer_id alone, but not searches by ordered_on alone.',
          'An index can also be built on an expression. If your login query searches WHERE lower(email) = lower(\'Asha@X.com\'), a normal index on email does not help, because the query compares lower(email). An index on (lower(email)) does.',
          'A UNIQUE index on an expression enforces a rule too: CREATE UNIQUE INDEX ON users (lower(email)) makes sure nobody can register Asha@x.com and asha@x.com as two accounts.',
          'A common reason an index is not used is exactly this mismatch: the query wraps the column in a function, or compares it with a different type. When EXPLAIN shows a Seq Scan you did not expect, check that the WHERE looks exactly like the indexed column or expression.',
          'PostgreSQL has other index types too, like GIN for JSON and full-text search. You will meet GIN briefly on Day 25. The standard type, B-tree, is the right choice for most columns.'
        ],
        example: 'A phone book sorted by surname, then first name, is great for finding "Sharma, Priya". It is useless for finding everyone called Priya whatever their surname. The order of columns in an index works the same way.',
        code: lines(
          'CREATE TABLE users (id int PRIMARY KEY, email text);',
          "INSERT INTO users VALUES (1, 'Asha@Example.com');",
          'CREATE UNIQUE INDEX idx_users_email ON users (lower(email));',
          "SELECT id FROM users WHERE lower(email) = lower('asha@example.com');",
          "INSERT INTO users VALUES (2, 'ASHA@example.com');"
        ),
        output: lines(
          ' id',
          '----',
          '  1',
          '(1 row)',
          '',
          '[Error] duplicate key value violates unique constraint "idx_users_email"'
        ),
        codeNotes: [
          { line: 3, note: 'An index on an expression, and UNIQUE at the same time.' },
          { line: 4, note: 'The query uses the same expression, so the index can help.' },
          { line: 5, note: 'The same email in different capitals: refused.' }
        ],
        tryIt: "Change line 5 to a truly different email, like 'ravi@example.com', and run it again. This time it is accepted.",
        check: {
          question: 'An index on (customer_id, ordered_on) helps which search most?',
          options: ['A customer\'s orders in a date range', 'All orders on one date, for every customer', 'Orders sorted by total'],
          answer: 0,
          why: 'A multi-column index is sorted by the first column first, so it helps searches that start with customer_id.'
        }
      },
      {
        title: 'Putting it together: speeding up a slow report',
        say: [
          'Let us follow the real process of fixing a slow query. A report lists a customer\'s recent orders, newest first. The first step is always to look at the plan.',
          'EXPLAIN shows a Seq Scan on orders with a filter on customer_id, followed by a Sort. PostgreSQL reads every row, keeps a few, and sorts them.',
          'The fix is an index matching the query: (customer_id, ordered_on). The plan changes to an index scan, and the sort step can disappear, because the index already keeps each customer\'s orders in date order.',
          'Always measure before and after. On a real database, you would run EXPLAIN ANALYZE to see the actual time drop. And check that the index does not slow down important writes too much.',
          'In today\'s practice, you will create an index on orders(customer_id), and a unique index on lower(email) so two users cannot share an email in different capitals.',
          'Tomorrow you learn views: saving a query under a name, so complicated joins can be reused like a simple table.'
        ],
        example: 'A mechanic does not replace random parts when a car is slow. They connect a diagnostic tool, read what is wrong, fix that one part, and test drive again. EXPLAIN is the diagnostic tool; the index is the part.',
        code: lines(
          'CREATE TABLE orders (id int PRIMARY KEY, customer_id int, ordered_on date);',
          "INSERT INTO orders SELECT n, n % 5000, date '2026-01-01' + (n % 270) FROM generate_series(1, 50000) AS n;",
          'ANALYZE orders;',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42 ORDER BY ordered_on DESC LIMIT 5;',
          'CREATE INDEX idx_orders_customer_date ON orders (customer_id, ordered_on);',
          'EXPLAIN (COSTS OFF) SELECT * FROM orders WHERE customer_id = 42 ORDER BY ordered_on DESC LIMIT 5;'
        ),
        output: lines(
          ' QUERY PLAN',
          '------------------------------------------',
          ' Limit',
          '   ->  Sort',
          '         Sort Key: ordered_on DESC',
          '         ->  Seq Scan on orders',
          '               Filter: (customer_id = 42)',
          '(5 rows)',
          '',
          ' QUERY PLAN',
          '--------------------------------------------------------------------',
          ' Limit',
          '   ->  Index Scan Backward using idx_orders_customer_date on orders',
          '         Index Cond: (customer_id = 42)',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'Before: read every row, filter, then sort.' },
          { line: 5, note: 'An index that matches the WHERE and the ORDER BY.' },
          { line: 6, note: 'After: the index gives the rows already in order.' }
        ],
        tryIt: 'Change the index to be only on (ordered_on) and look at the second plan. It does not help this query as much, because the query starts with customer_id.',
        check: {
          question: 'What is the first step when a query is slow?',
          options: ['Look at its plan with EXPLAIN', 'Add indexes to every column', 'Rewrite it in another language'],
          answer: 0,
          why: 'The plan shows where the time goes, so you can fix the real cause, often with one matching index.'
        }
      }
    ],
    summary: [
      'Without an index, PostgreSQL reads every row (Seq Scan).',
      'An index is a sorted structure that lets PostgreSQL jump to matching rows.',
      'EXPLAIN shows the plan; look for Seq Scan versus Index Scan.',
      'Indexes speed up reads but cost space and slow down writes; index foreign keys and frequent filters.',
      'Multi-column indexes follow column order; expression indexes match WHERE lower(email) = ....'
    ],
    projectStep: {
      title: 'My Library: indexes for common searches',
      steps: [
        'List the 3 searches you run most on your books (for example by author or title).',
        'Create an index for each on the matching column.',
        'Add a unique index on lower(title) and author_id to stop duplicate titles in different capitals.',
        'Use EXPLAIN (COSTS OFF) on one search to see the plan.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 24,
    title: 'Saved Queries: Views',
    goal: 'You can save a query as a view, use views to simplify joins and hide columns, and refresh materialized views.',
    minutes: 28,
    recap: 'Yesterday you made queries faster with indexes and read query plans with EXPLAIN.',
    parts: [
      {
        title: 'What a view is',
        say: [
          'Some queries are used again and again: "each order with its customer\'s name and total". Writing the same joins every time is tiring and error-prone. A view saves a query under a name.',
          'You create one with CREATE VIEW name AS SELECT .... After that, you can SELECT FROM the view as if it were a table: filter it, sort it, join it, count it.',
          'A view does not store any data. Every time you query it, PostgreSQL runs the saved query on the current tables. So a view always shows fresh data, and it takes no extra space.',
          'Views make the database easier for everyone. A new developer or an analyst can use order_summaries without knowing how the four tables are joined. The complicated part is written once, by someone who understands it.',
          'Because views are just saved queries, PostgreSQL can often optimise a query on a view as well as if you had written the whole query yourself. There is usually no speed penalty.',
          'Views should have clear, descriptive names, often plural nouns like order_summaries or active_customers, so they read naturally in queries.',
          'You can list the views in a database from information_schema.views, and see a view\'s saved query with pg_get_viewdef. That is useful when you join a new team and want to know which ready-made reports already exist before writing your own.'
        ],
        example: 'A "saved search" on a shopping site, like "shoes under 2000 in my size", stores the search, not the shoes. Each time you open it, it shows the shoes available right now. A view is a saved search for your database.',
        code: lines(
          MINI_SHOP,
          'CREATE VIEW order_summaries AS',
          'SELECT o.id AS order_id, c.name AS customer, o.status, sum(p.price * oi.quantity) AS total',
          'FROM orders o',
          'JOIN customers c ON c.id = o.customer_id',
          'JOIN order_items oi ON oi.order_id = o.id',
          'JOIN products p ON p.id = oi.product_id',
          'GROUP BY o.id, c.name, o.status;',
          'SELECT * FROM order_summaries ORDER BY order_id;',
          "SELECT customer, total FROM order_summaries WHERE status = 'delivered' ORDER BY total DESC;"
        ),
        output: lines(
          ' order_id | customer | status    | total',
          '----------+----------+-----------+---------',
          '      101 | Asha     | delivered |  280.00',
          '      102 | Ravi     | delivered | 1200.00',
          '      103 | Asha     | shipped   |   50.00',
          '      104 | Priya    | pending   |   60.00',
          '(4 rows)',
          '',
          ' customer | total',
          '----------+---------',
          ' Ravi     | 1200.00',
          ' Asha     |  280.00',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 9, note: 'Save the query under the name order_summaries.' },
          { line: 16, note: 'Use the view like a table.' },
          { line: 17, note: 'Filter and sort it like any table; the joins are hidden inside.' }
        ],
        tryIt: 'Add a query: SELECT customer, sum(total) AS spent FROM order_summaries GROUP BY customer ORDER BY spent DESC;',
        check: {
          question: 'Does a view store a copy of the data?',
          options: ['No, it runs its saved query each time, so it always shows current data', 'Yes, it copies the data once', 'Only for the first row'],
          answer: 0,
          why: 'A normal view is just a stored query. The data stays in the underlying tables.'
        }
      },
      {
        title: 'Views always show current data',
        say: [
          'Because a view runs its query every time, changes to the tables appear in the view immediately. There is nothing to refresh or update.',
          'If a new order is inserted, the next SELECT from order_summaries includes it. If a price changes, every total in the view reflects it. The view is always exactly as correct as the tables.',
          'This makes views ideal for reports that must be up to date, like "orders waiting to be shipped" for a warehouse screen.',
          'The flip side is that a view on a large, complex query does all its work every time it is used. If thousands of people open a dashboard built on a heavy view, the database repeats that heavy work thousands of times. Part 5 shows the solution: materialized views.',
          'You can change a view\'s query with CREATE OR REPLACE VIEW, as long as you only add columns at the end and keep the existing ones the same. To make bigger changes, drop it and create it again.',
          'Dropping a view never deletes table data, because the view never held any. DROP VIEW simply forgets the saved query.'
        ],
        example: 'A live cricket scoreboard on a website does not store the score; it shows the current score every time you look. Refresh the page after a boundary, and the new score is there. A view is a live scoreboard for your data.',
        code: lines(
          'CREATE TABLE tasks (id serial PRIMARY KEY, title text, done boolean DEFAULT false);',
          "INSERT INTO tasks (title) VALUES ('Pack orders'), ('Call supplier');",
          'CREATE VIEW open_tasks AS SELECT id, title FROM tasks WHERE NOT done;',
          'SELECT count(*) AS open_before FROM open_tasks;',
          "INSERT INTO tasks (title) VALUES ('Update prices');",
          'UPDATE tasks SET done = true WHERE id = 1;',
          'SELECT * FROM open_tasks ORDER BY id;'
        ),
        output: lines(
          ' open_before',
          '-------------',
          '           2',
          '(1 row)',
          '',
          ' id | title',
          '----+---------------',
          '  2 | Call supplier',
          '  3 | Update prices',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 3, note: 'A view of the tasks that are not done yet.' },
          { line: 5, note: 'Change the table: one new task, one finished.' },
          { line: 7, note: 'The view shows the changes immediately.' }
        ],
        tryIt: 'Add CREATE OR REPLACE VIEW open_tasks AS SELECT id, title, done FROM tasks WHERE NOT done; before the last SELECT. The new column appears at the end.',
        check: {
          question: 'A row is added to a table after a view was created. Does the view show it?',
          options: ['Yes, immediately, because the view runs its query each time', 'Only after the view is recreated', 'Never'],
          answer: 0,
          why: 'Normal views have no stored data; every query on them reads the current tables.'
        }
      },
      {
        title: 'Views for simplicity and safety',
        say: [
          'Views are also a way to control what people see. A customers table might contain phone numbers and addresses. A view with only the name and city can be shared with an analytics team without exposing private details.',
          'With PostgreSQL permissions, which you will meet on Day 29, you can let a user read a view but not the table underneath. That way, the private columns are protected by the database itself.',
          'Views can also hide messy details. A column called cust_nm_v2 can appear in a view as customer_name. A status code can be translated into words with CASE. The view becomes a clean, friendly interface to the data.',
          'Some teams build a whole reporting layer out of views: raw tables at the bottom, and views on top that give each team exactly the data they need, in the shape they need.',
          'Simple views, from one table without GROUP BY, can even be updated: an UPDATE on the view changes the table underneath. For views with joins or aggregates, updates are not allowed, which is usually what you want for reports.',
          'A good test for a view: can someone use it correctly without ever looking at its definition? If yes, the view is doing its job.',
          'Comments help too. COMMENT ON VIEW customer_directory IS \'Public customer list without phone numbers\' stores a short description inside the database, where tools and teammates can read it.'
        ],
        example: 'A school notice board shows students\' names and exam rooms, but not their home addresses or parents\' phone numbers. The office has all the details; the notice board is a view with only what everyone needs to see.',
        code: lines(
          'CREATE TABLE customers (id int PRIMARY KEY, name text, phone text, city text, status char(1));',
          "INSERT INTO customers VALUES (1, 'Asha', '98765 11111', 'Pune', 'a'), (2, 'Ravi', '91234 22222', 'Mumbai', 'i');",
          'CREATE VIEW customer_directory AS',
          "SELECT name, city, CASE status WHEN 'a' THEN 'active' ELSE 'inactive' END AS status",
          'FROM customers;',
          'SELECT * FROM customer_directory ORDER BY name;'
        ),
        output: lines(
          ' name | city   | status',
          '------+--------+----------',
          ' Asha | Pune   | active',
          ' Ravi | Mumbai | inactive',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 4, note: 'No phone column, and the status code is translated into words.' },
          { line: 6, note: 'Anyone using the view sees only what they need.' }
        ],
        tryIt: 'Try SELECT phone FROM customer_directory; and read the error: the view has no phone column.',
        check: {
          question: 'How can a view protect private data?',
          options: ['It can leave out private columns, and users can be allowed to read only the view', 'It encrypts the table', 'It deletes private columns from the table'],
          answer: 0,
          why: 'A view shows only the columns you choose. With permissions, users can read the view without reading the table.'
        }
      },
      {
        title: 'Building on views',
        say: [
          'A view can use other views. You might have a view of delivered order totals, and another view that uses it to calculate each customer\'s lifetime value.',
          'This lets you build reports in layers, like WITH steps, but saved permanently and shared by everyone. Each layer is small and easy to understand.',
          'Be careful not to stack too many layers. When something is wrong in a view five levels deep, it can be hard to find. Two or three layers are usually plenty.',
          'PostgreSQL remembers which views depend on which tables and views. If you try to drop a table that a view uses, it refuses, and tells you which view depends on it. DROP ... CASCADE would drop the views too, which is rarely what you want.',
          'This protection is useful: it stops someone changing a table and silently breaking every report built on it.',
          'When you need to change a table that views depend on, the usual process is to change the views and the table together, in one migration script, inside a transaction.'
        ],
        example: 'A company\'s monthly report is built from a team\'s weekly reports, which are built from daily logs. Each level uses the one below. If someone tried to throw away the daily logs, everyone would shout, because the reports depend on them.',
        code: lines(
          MINI_SHOP,
          'CREATE VIEW delivered_totals AS',
          'SELECT o.customer_id, sum(p.price * oi.quantity) AS total',
          'FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id',
          "WHERE o.status = 'delivered'",
          'GROUP BY o.id, o.customer_id;',
          'CREATE VIEW customer_value AS',
          'SELECT c.name, coalesce(sum(d.total), 0) AS lifetime_value',
          'FROM customers c LEFT JOIN delivered_totals d ON d.customer_id = c.id',
          'GROUP BY c.id, c.name;',
          'SELECT * FROM customer_value ORDER BY lifetime_value DESC, name;',
          'DROP VIEW delivered_totals;'
        ),
        output: lines(
          ' name  | lifetime_value',
          '-------+----------------',
          ' Ravi  |        1200.00',
          ' Asha  |         280.00',
          ' Meera |              0',
          ' Priya |              0',
          '(4 rows)',
          '',
          '[Error] cannot drop view delivered_totals because other objects depend on it'
        ),
        codeNotes: [
          { line: 9, note: 'Layer 1: each delivered order\'s total.' },
          { line: 14, note: 'Layer 2 uses layer 1: each customer\'s lifetime value.' },
          { line: 19, note: 'Dropping layer 1 is refused, because layer 2 depends on it.' }
        ],
        tryIt: 'Change the last line to DROP VIEW customer_value; and run it. The top layer can be dropped, because nothing depends on it.',
        check: {
          question: 'Why does PostgreSQL refuse to drop a view that another view uses?',
          options: ['To stop reports that depend on it from silently breaking', 'Because views can never be dropped', 'Because the view holds data'],
          answer: 0,
          why: 'PostgreSQL tracks dependencies and protects them. You must drop or change the dependent view first.'
        }
      },
      {
        title: 'Materialized views: saved results you refresh',
        say: [
          'A normal view reruns its query every time. For a heavy report that is used often, that repeats a lot of work. A materialized view stores the result of the query, like a table, so reading it is fast.',
          'You create one with CREATE MATERIALIZED VIEW name AS SELECT .... PostgreSQL runs the query once and saves the rows.',
          'The catch: the saved rows do not change when the tables change. The materialized view shows the data as it was when it was last filled. To update it, you run REFRESH MATERIALIZED VIEW name, which reruns the query and replaces the saved rows.',
          'Teams usually refresh on a schedule, like every hour or every night, depending on how fresh the numbers need to be. A dashboard of yesterday\'s sales can refresh once a night; a stock screen probably cannot use a materialized view at all.',
          'Unlike normal views, materialized views can have their own indexes, which makes them even faster to query.',
          'Choosing between them is a trade-off between freshness and speed: a normal view is always fresh but does the work every time; a materialized view is fast but only as fresh as the last refresh.'
        ],
        example: 'A printed monthly bank statement is a materialized view: quick to read, but it does not show today\'s transactions until the next statement is printed. The live banking app is a normal view: always current, but it does the work every time you open it.',
        code: lines(
          'CREATE TABLE sales (day date, amount numeric(10,2));',
          "INSERT INTO sales VALUES ('2026-09-01', 280), ('2026-09-02', 1200);",
          'CREATE MATERIALIZED VIEW sales_summary AS SELECT count(*) AS days, sum(amount) AS total FROM sales;',
          "INSERT INTO sales VALUES ('2026-09-03', 2097);",
          'SELECT * FROM sales_summary;',
          'REFRESH MATERIALIZED VIEW sales_summary;',
          'SELECT * FROM sales_summary;'
        ),
        output: lines(
          ' days | total',
          '------+---------',
          '    2 | 1480.00',
          '(1 row)',
          '',
          ' days | total',
          '------+---------',
          '    3 | 3577.00',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'The result is calculated now and stored.' },
          { line: 5, note: 'The new sale is not included yet: the stored result is old.' },
          { line: 6, note: 'REFRESH reruns the query and stores the new result.' }
        ],
        tryIt: 'Change CREATE MATERIALIZED VIEW to CREATE VIEW and remove the REFRESH line. The first SELECT now already includes the third day.',
        check: {
          question: 'What is the main difference between a view and a materialized view?',
          options: ['A materialized view stores its result and must be refreshed; a view always reruns its query', 'A view is faster in every case', 'A materialized view cannot be queried'],
          answer: 0,
          why: 'Materialized views trade freshness for speed: fast to read, but only updated on REFRESH.'
        }
      },
      {
        title: 'Putting it together: a reporting view for the shop',
        say: [
          'Let us give the shop manager a simple interface for their most common questions: a view with one row per customer, showing their order count and spending, including customers with no orders.',
          'Everything you learned in week 2 goes inside the view: LEFT JOIN, count of the right table\'s id, coalesce for zero totals. The manager only needs to write SELECT * FROM customer_order_counts.',
          'Then, a price list view shows each product with its price including GST. Anyone in the shop can use it without knowing the tax rate or rounding rules.',
          'In today\'s practice, you will create a price-list view with GST, and a view of each customer\'s order count that includes customers with no orders.',
          'Tomorrow you learn how PostgreSQL stores and queries JSON, for data that does not fit neatly into columns, like app events and settings.',
          'Views are small to write but have a big effect on a team. Every good view is one less complicated query that someone else has to get right.'
        ],
        example: 'A shop manager\'s favourite report is saved as a single button in their app. Behind the button is a view that joins four tables, but the manager only ever sees a clean list.',
        code: lines(
          MINI_SHOP,
          'CREATE VIEW customer_order_counts AS',
          'SELECT c.name, count(o.id) AS order_count',
          'FROM customers c LEFT JOIN orders o ON o.customer_id = c.id',
          'GROUP BY c.id, c.name;',
          'CREATE VIEW price_list AS',
          'SELECT name, price, round(price * 1.18, 2) AS price_with_gst FROM products;',
          'SELECT * FROM customer_order_counts ORDER BY order_count DESC, name;',
          'SELECT * FROM price_list ORDER BY price;'
        ),
        output: lines(
          ' name  | order_count',
          '-------+-------------',
          ' Asha  |           2',
          ' Priya |           1',
          ' Ravi  |           1',
          ' Meera |           0',
          '(4 rows)',
          '',
          ' name     | price   | price_with_gst',
          '----------+---------+----------------',
          ' Pen      |   10.00 |          11.80',
          ' Notebook |   60.00 |          70.80',
          ' Stapler  |  150.00 |         177.00',
          ' Backpack | 1200.00 |        1416.00',
          '(4 rows)'
        ),
        codeNotes: [
          { line: 10, note: 'count(o.id) with LEFT JOIN, so Meera shows 0.' },
          { line: 14, note: 'The GST rule lives in one place.' }
        ],
        tryIt: 'Add a new customer to the setup and run it. They appear in customer_order_counts with 0 orders, without changing the view.',
        check: {
          question: 'Why put the GST calculation in a view?',
          options: ['The rule is written once, and everyone who uses the view gets it right', 'Views calculate faster than SELECT', 'GST can only be calculated in views'],
          answer: 0,
          why: 'A view keeps shared logic in one place, so every report uses the same rule.'
        }
      }
    ],
    summary: [
      'CREATE VIEW name AS SELECT ... saves a query; use it like a table.',
      'Normal views store no data and always show the current tables.',
      'Views hide complex joins and private columns, and rename messy columns.',
      'Views can build on views; PostgreSQL protects these dependencies.',
      'Materialized views store results for speed and need REFRESH MATERIALIZED VIEW.'
    ],
    projectStep: {
      title: 'My Library: handy views',
      steps: [
        'Create a view books_with_authors that joins books to authors.',
        'Create a view unfinished_books with title, author and pages.',
        'Create a view author_stats with each author\'s book count and total pages.',
        'Use your views in two queries, as if they were tables.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 25,
    title: 'JSON Data in PostgreSQL',
    goal: 'You can store JSON in a jsonb column, read values with -> and ->>, filter and group by them, and decide when JSON is the right choice.',
    minutes: 28,
    recap: 'Yesterday you saved queries as views and learned materialized views for faster reports.',
    parts: [
      {
        title: 'Why store JSON in a database',
        say: [
          'Most data fits neatly into columns: a product has a name, a price and a stock. But some data is flexible: app events where each type of event has different details, user settings that change between versions, or answers from an outside API.',
          'JSON, which you may know from Python or JavaScript, is a text format for this kind of data: objects in curly brackets with named keys, arrays in square brackets. PostgreSQL can store JSON in a column and still query inside it.',
          'PostgreSQL has two JSON types. json stores the text exactly as given. jsonb stores it in a processed binary form that is faster to search and supports indexes. In almost every case, use jsonb.',
          'jsonb checks that the value is valid JSON when you insert it, and it tidies the storage: it removes extra spaces, keeps only the last copy of a duplicate key, and may store keys in a different order. The data means the same, but may print differently.',
          'This flexibility is useful, but it has a cost. Inside a JSON value, PostgreSQL cannot enforce types, NOT NULL or foreign keys the way it can for real columns. So JSON is a tool for truly flexible data, not a way to avoid designing tables.',
          'Many real systems use both: normal columns for the important, fixed facts, and one jsonb column for the extra details that vary.'
        ],
        example: 'A hospital form has fixed boxes for name, age and date, and a big free-notes box where the doctor writes whatever matters for this patient. The fixed boxes are columns; the notes box is a jsonb column, flexible but less structured.',
        code: lines(
          'CREATE TABLE events (id serial PRIMARY KEY, happened_at date NOT NULL, data jsonb NOT NULL);',
          'INSERT INTO events (happened_at, data) VALUES',
          '  (\'2026-09-01\', \'{"type": "click", "page": "/home"}\'),',
          '  (\'2026-09-01\', \'{"type": "purchase", "amount": 499, "items": ["Pen", "Notebook"]}\'),',
          '  (\'2026-09-02\', \'{"type": "click", "page": "/cart"}\');',
          'SELECT id, data FROM events ORDER BY id;'
        ),
        output: lines(
          ' id | data',
          '----+-------------------------------------------------------------------',
          '  1 | {"page": "/home", "type": "click"}',
          '  2 | {"type": "purchase", "items": ["Pen", "Notebook"], "amount": 499}',
          '  3 | {"page": "/cart", "type": "click"}',
          '(3 rows)'
        ),
        codeNotes: [
          { line: 1, note: 'Fixed facts as columns; flexible details in one jsonb column.' },
          { line: 4, note: 'Different events have different keys, which JSON allows.' },
          { line: 6, note: 'jsonb may print keys in a different order than they were written.' }
        ],
        tryIt: "Try inserting invalid JSON, like '{type: click}' without quotes around the key, and read the error.",
        check: {
          question: 'Which JSON type should you usually choose in PostgreSQL?',
          options: ['jsonb', 'json', 'text'],
          answer: 0,
          why: 'jsonb is faster to search, supports indexes and validates the value. json only keeps the text as written.'
        }
      },
      {
        title: 'Reading values: -> and ->>',
        say: [
          'To read a key from a jsonb value, PostgreSQL has two arrows. data -> \'page\' returns the value as JSON. data ->> \'page\' returns it as plain text.',
          'The difference matters. With ->, a text value comes back with its double quotes, as JSON. With ->>, you get the text itself, ready to compare with = or show in a report. For most everyday use, ->> is what you want.',
          'For numbers, ->> gives text, so to do maths, cast it: (data ->> \'amount\')::numeric. Then you can sum it, average it or compare it with >.',
          'Chained arrows reach inside nested objects: data -> \'customer\' ->> \'city\' first gets the customer object, then the city inside it as text. For arrays, use a position number: data -> \'items\' ->> 0 is the first item.',
          'If a key does not exist, the arrow returns NULL, not an error. That is convenient for flexible data, but remember to handle NULL, for example with coalesce.',
          'Keys are case-sensitive: \'Page\' and \'page\' are different keys. Consistent naming in your JSON, usually small letters with underscores, avoids confusion.',
          'When JSON comes from an outside API, look at a few real examples before writing queries, because keys are sometimes missing, renamed, or nested differently than the documentation says.'
        ],
        example: 'A parcel label has sections: "To" with a name and address inside. data -> \'to\' ->> \'city\' is like reading the To section, and inside it, the city line. The single arrow opens a section; the double arrow reads the words.',
        code: lines(
          "SELECT '{\"page\": \"/home\"}'::jsonb -> 'page' AS as_json, '{\"page\": \"/home\"}'::jsonb ->> 'page' AS as_text;",
          'CREATE TABLE orders (id int, details jsonb);',
          'INSERT INTO orders VALUES',
          '  (1, \'{"amount": 499, "customer": {"name": "Asha", "city": "Pune"}, "items": ["Pen", "Notebook"]}\'),',
          '  (2, \'{"amount": 1200, "customer": {"name": "Ravi", "city": "Mumbai"}, "items": ["Backpack"]}\');',
          "SELECT id, details -> 'customer' ->> 'city' AS city, details -> 'items' ->> 0 AS first_item,",
          "       (details ->> 'amount')::numeric * 1.18 AS amount_with_gst, details ->> 'coupon' AS coupon",
          'FROM orders ORDER BY id;'
        ),
        output: lines(
          ' as_json | as_text',
          '---------+---------',
          ' "/home" | /home',
          '(1 row)',
          '',
          ' id | city   | first_item | amount_with_gst | coupon',
          '----+--------+------------+-----------------+--------',
          '  1 | Pune   | Pen        |          588.82 | NULL',
          '  2 | Mumbai | Backpack   |         1416.00 | NULL',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 1, note: '-> keeps the JSON quotes; ->> gives plain text.' },
          { line: 6, note: 'Two steps into a nested object, and the first array item.' },
          { line: 7, note: 'Cast to numeric for maths. A missing key gives NULL.' }
        ],
        tryIt: "Add details -> 'items' ->> 1 AS second_item to the SELECT. Ravi's order has only one item, so his is NULL.",
        check: {
          question: "What does data ->> 'city' return?",
          options: ['The city as plain text', 'The city as JSON, with quotes', 'An error if city is missing'],
          answer: 0,
          why: '->> returns text. -> returns JSON. A missing key returns NULL, not an error.'
        }
      },
      {
        title: 'Filtering and grouping by JSON values',
        say: [
          'Once you can read values, you can use them anywhere: WHERE data ->> \'type\' = \'click\' keeps click events, and GROUP BY data ->> \'type\' counts events of each type.',
          'This is how product teams analyse app usage. Every tap, page view and purchase is stored as a JSON event, and SQL turns millions of them into reports: most visited pages, sign-ups per day, purchases per campaign.',
          'PostgreSQL also has a "contains" operator, @>. data @> \'{"type": "click"}\' is true when the JSON contains that key and value. It is neat for checking several keys at once, and it can use a special index.',
          'The ? operator checks whether a key exists: data ? \'coupon\' finds events that have a coupon key, whatever its value.',
          'When you filter by a JSON value very often on a large table, create an index. A GIN index on the whole column, CREATE INDEX ON events USING gin (data), speeds up @> and ? searches. An index on an expression, like ((data ->> \'type\')), speeds up = searches on one key.',
          'If you find yourself filtering by the same JSON key in almost every query, that is a hint it might deserve to be a real column instead.'
        ],
        example: 'A shop keeps every receipt in a big box of slips with different details. To find all receipts that used a coupon, you check each slip for a coupon line. With JSON in PostgreSQL, the database checks all the slips for you, and an index makes it quick.',
        code: lines(
          'CREATE TABLE events (id int, data jsonb);',
          'INSERT INTO events VALUES',
          '  (1, \'{"type": "click", "page": "/home"}\'), (2, \'{"type": "view", "page": "/cart"}\'),',
          '  (3, \'{"type": "click", "page": "/cart"}\'), (4, \'{"type": "purchase", "amount": 499, "coupon": "DIWALI"}\'),',
          '  (5, \'{"type": "click", "page": "/home"}\');',
          "SELECT data ->> 'type' AS type, count(*) AS events FROM events GROUP BY 1 ORDER BY events DESC, type;",
          "SELECT data ->> 'page' AS page, count(*) AS clicks FROM events WHERE data @> '{\"type\": \"click\"}' GROUP BY 1 ORDER BY clicks DESC;",
          "SELECT id FROM events WHERE data ? 'coupon';"
        ),
        output: lines(
          ' type     | events',
          '----------+--------',
          ' click    |      3',
          ' purchase |      1',
          ' view     |      1',
          '(3 rows)',
          '',
          ' page  | clicks',
          '-------+--------',
          ' /home |      2',
          ' /cart |      1',
          '(2 rows)',
          '',
          ' id',
          '----',
          '  4',
          '(1 row)'
        ),
        codeNotes: [
          { line: 6, note: 'Count events per type. GROUP BY 1 means the first column.' },
          { line: 7, note: '@> checks that the JSON contains type: click.' },
          { line: 8, note: '? checks that a key exists.' }
        ],
        tryIt: "Change the page report to count views instead of clicks: '{\"type\": \"view\"}'.",
        check: {
          question: "What does data @> '{\"type\": \"click\"}' check?",
          options: ['That the JSON contains the key type with the value click', 'That the JSON is exactly that object', 'That the key type exists'],
          answer: 0,
          why: '@> means "contains": the value may have other keys too. ? only checks that a key exists.'
        }
      },
      {
        title: 'Building and changing JSON',
        say: [
          'PostgreSQL can also build JSON from normal columns. jsonb_build_object(\'name\', name, \'city\', city) makes an object from a row. jsonb_agg collects many rows into a JSON array.',
          'This is very useful for APIs. A backend can ask PostgreSQL for data already shaped as the JSON the app needs, instead of building it in code. On Day 26, you will see how apps read query results.',
          'To change a value inside a jsonb column, use jsonb_set: UPDATE settings SET data = jsonb_set(data, \'{theme}\', \'"dark"\'). The path is written in curly brackets, and the new value must be valid JSON, which is why text needs its double quotes.',
          'The || operator merges two objects: data || \'{"language": "hi"}\' adds or replaces the language key. The - operator removes a key: data - \'coupon\'.',
          'These tools make jsonb columns practical for things like user preferences, feature flags and form answers, where the set of keys changes over time.',
          'As always, keep the important, fixed facts in normal columns. Use JSON for the parts that really are flexible.'
        ],
        example: 'A mobile app\'s settings screen has toggles that change between versions: dark mode, language, notifications. Storing all settings as one JSON object means a new toggle needs no new column; the app just adds a key.',
        code: lines(
          'CREATE TABLE users (id int PRIMARY KEY, name text, settings jsonb DEFAULT \'{}\');',
          'INSERT INTO users VALUES (1, \'Asha\', \'{"theme": "light", "notifications": true}\'), (2, \'Ravi\', \'{}\');',
          "UPDATE users SET settings = jsonb_set(settings, '{theme}', '\"dark\"') WHERE id = 1;",
          "UPDATE users SET settings = settings || '{\"language\": \"hi\"}' WHERE id = 2;",
          'SELECT id, settings FROM users ORDER BY id;',
          "SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name) ORDER BY id) AS api_response FROM users;"
        ),
        output: lines(
          ' id | settings',
          '----+------------------------------------------',
          '  1 | {"theme": "dark", "notifications": true}',
          '  2 | {"language": "hi"}',
          '(2 rows)',
          '',
          ' api_response',
          '--------------------------------------------------------',
          ' [{"id": 1, "name": "Asha"}, {"id": 2, "name": "Ravi"}]',
          '(1 row)'
        ),
        codeNotes: [
          { line: 3, note: 'Change one key; text values need JSON double quotes.' },
          { line: 4, note: '|| merges in a new key.' },
          { line: 6, note: 'Build a JSON array of objects, ready for an API.' }
        ],
        tryIt: "Remove the notifications key from Asha's settings with UPDATE users SET settings = settings - 'notifications' WHERE id = 1; before the SELECT.",
        check: {
          question: 'What does jsonb_agg do?',
          options: ['Collects values from many rows into one JSON array', 'Counts JSON keys', 'Checks that JSON is valid'],
          answer: 0,
          why: 'jsonb_agg is an aggregate: it combines many rows into a single JSON array, useful for API responses.'
        }
      },
      {
        title: 'Columns or JSON: choosing well',
        say: [
          'JSON columns are tempting, because they never need an ALTER TABLE. But used everywhere, they bring back the problems normalization solves, and add new ones.',
          'Inside JSON, there are no types: an amount can be the number 499 in one row and the text "499" in another. There are no NOT NULL rules, no CHECK rules, no foreign keys. Mistakes that a column would refuse slip straight in.',
          'Queries also get longer and harder to read: (data ->> \'amount\')::numeric instead of simply amount. And the database has less information to plan fast queries.',
          'A good rule: if every row has the key, you filter or join by it often, or it must follow rules, make it a column. If the keys vary between rows, are optional, or come from outside and change often, JSON is a good fit.',
          'You can move a JSON key into a proper column later with ALTER TABLE ADD COLUMN and an UPDATE that copies the value out. Many teams start with JSON for a new feature and promote the stable keys to columns once they are sure.',
          'In interviews, a balanced answer is best: "I use normal columns for structured, important data, and jsonb for flexible or external data, with indexes where needed."'
        ],
        example: 'A clothes shop has fixed labels on every item: size, price, colour. Special notes, like "limited edition" or "handwash only", vary from item to item, so they go on a separate tag. Fixed labels are columns; the variable tag is JSON.',
        code: lines(
          'CREATE TABLE orders (id int, details jsonb);',
          'INSERT INTO orders VALUES (1, \'{"amount": 499}\'), (2, \'{"amount": "1200"}\'), (3, \'{"amount": -50}\');',
          "SELECT id, jsonb_typeof(details -> 'amount') AS stored_as FROM orders ORDER BY id;",
          'ALTER TABLE orders ADD COLUMN amount numeric(10,2);',
          "UPDATE orders SET amount = (details ->> 'amount')::numeric;",
          'ALTER TABLE orders ADD CONSTRAINT amount_positive CHECK (amount > 0);'
        ),
        output: lines(
          ' id | stored_as',
          '----+-----------',
          '  1 | number',
          '  2 | string',
          '  3 | number',
          '(3 rows)',
          '',
          '[Error] check constraint "amount_positive" of relation "orders" is violated by some row'
        ),
        codeNotes: [
          { line: 3, note: 'One amount is a number, one is text: JSON did not stop it.' },
          { line: 5, note: 'Promote the key to a real numeric column.' },
          { line: 6, note: 'Now a rule can be added, and it finds the bad -50 order.' }
        ],
        tryIt: 'Add UPDATE orders SET amount = 50 WHERE id = 3; before the ALTER on the last line. Now the rule is accepted.',
        check: {
          question: 'When is a jsonb column a good choice?',
          options: ['For flexible data whose keys vary between rows', 'For every column, to avoid ALTER TABLE', 'For ids used in joins'],
          answer: 0,
          why: 'JSON suits varying, optional or external data. Important fixed facts belong in typed columns with rules.'
        }
      },
      {
        title: 'Putting it together: analysing app events',
        say: [
          'Let us analyse a small app\'s event log the way a product team would. Each event has a date and a jsonb data column with a type and details.',
          'The report answers three questions: how many events of each type, which pages were clicked most, and how much money purchases brought in. Each question is a short query with ->>, @> or a cast.',
          'Notice that purchase amounts are cast to numeric before summing. Keeping amounts as JSON numbers, not text, makes that cast reliable.',
          'In today\'s practice, you will list the pages of click events as text, and count events per type.',
          'Tomorrow you learn how apps written in Python and Node.js talk to PostgreSQL, and the most important security rule in databases: never glue user input into SQL.',
          'With JSON, you now have a complete toolbox: structured tables for the core data, and flexible JSON where it truly helps.'
        ],
        example: 'A mobile app team meets every Monday to look at last week\'s numbers: which screens people used, where they dropped off, how many paid. All of it comes from a table of JSON events and a handful of SQL queries like these.',
        code: lines(
          'CREATE TABLE events (id int, day date, data jsonb);',
          'INSERT INTO events VALUES',
          '  (1, \'2026-09-01\', \'{"type": "click", "page": "/home"}\'), (2, \'2026-09-01\', \'{"type": "click", "page": "/cart"}\'),',
          '  (3, \'2026-09-01\', \'{"type": "purchase", "amount": 499}\'), (4, \'2026-09-02\', \'{"type": "click", "page": "/home"}\'),',
          '  (5, \'2026-09-02\', \'{"type": "purchase", "amount": 1200}\'), (6, \'2026-09-02\', \'{"type": "view", "page": "/home"}\');',
          "SELECT data ->> 'type' AS type, count(*) AS events FROM events GROUP BY 1 ORDER BY events DESC, type;",
          "SELECT data ->> 'page' AS page, count(*) AS clicks FROM events WHERE data ->> 'type' = 'click' GROUP BY 1 ORDER BY clicks DESC;",
          "SELECT day, sum((data ->> 'amount')::numeric) AS revenue FROM events WHERE data @> '{\"type\": \"purchase\"}' GROUP BY day ORDER BY day;"
        ),
        output: lines(
          ' type     | events',
          '----------+--------',
          ' click    |      3',
          ' purchase |      2',
          ' view     |      1',
          '(3 rows)',
          '',
          ' page  | clicks',
          '-------+--------',
          ' /home |      2',
          ' /cart |      1',
          '(2 rows)',
          '',
          ' day        | revenue',
          '------------+---------',
          ' 2026-09-01 |     499',
          ' 2026-09-02 |    1200',
          '(2 rows)'
        ),
        codeNotes: [
          { line: 6, note: 'Events per type.' },
          { line: 7, note: 'Most clicked pages.' },
          { line: 8, note: 'Revenue per day from purchase events, with the amount cast to numeric.' }
        ],
        tryIt: 'Add a purchase on 2026-09-02 for 300 and run it. The revenue for that day becomes 1500.',
        check: {
          question: 'Why cast (data ->> \'amount\')::numeric before sum?',
          options: ['->> returns text, and sum needs numbers', 'JSON numbers cannot be read', 'To round the result'],
          answer: 0,
          why: '->> always gives text. Casting to numeric turns it into a number that sum can add.'
        }
      }
    ],
    summary: [
      'jsonb stores flexible JSON data that PostgreSQL can search and index.',
      "-> returns JSON, ->> returns text; chain arrows for nested keys; missing keys give NULL.",
      'Filter and group by JSON values; @> checks "contains", ? checks a key exists.',
      'jsonb_build_object and jsonb_agg build JSON; jsonb_set, || and - change it.',
      'Use columns for fixed, important facts; JSON for truly flexible data.'
    ],
    projectStep: {
      title: 'My Library: flexible book details',
      steps: [
        'Add an extras jsonb column to books, with a default of an empty object.',
        'Store different details for different books, like {"translator": "..."} or {"awards": ["..."]}.',
        'List books that have a translator, using ? or ->>.',
        'Decide which extra key, if any, should become a real column, and explain why.'
      ]
    }
  }
];
