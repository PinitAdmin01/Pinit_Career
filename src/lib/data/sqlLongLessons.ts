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
        output: '[Error] null value in column "title" of relation "tasks" violates not-null constraint',
        codeNotes: [
          { line: 2, note: 'title is required.' },
          { line: 6, note: 'Only title is given, so done becomes false and priority becomes normal.' },
          { line: 9, note: 'No title: PostgreSQL refuses the whole run, so we only see this error.' }
        ],
        tryIt: 'Delete line 9 and run it again. Now you see the two tasks, with the defaults filled in for the first one.',
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
        output: '[Error] column "orders.customer" must appear in the GROUP BY clause or be used in an aggregate function',
        codeNotes: [
          { line: 3, note: 'Earliest and latest dates, and the first name in A to Z order.' },
          { line: 4, note: 'The right way to find who placed the biggest order.' },
          { line: 5, note: 'This mixes one-per-row values with one-for-all: PostgreSQL refuses.' }
        ],
        tryIt: 'Delete line 5 and run again. You will see the first and last order dates, and Ravi\'s order as the biggest.',
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
          'Some other databases, like older versions of MySQL, quietly pick a random value instead of refusing. PostgreSQL\'s strictness is a good thing: it stops wrong reports.'
        ],
        example: 'If a teacher reports the total marks for each house, she can say "Red house: 250 points". She cannot say "Red house: student name ___", because Red house has many students. She can only name something that is the same for the whole house, or a summary like "top scorer".',
        code: lines(
          'CREATE TABLE products (name text, category text, price numeric(10,2));',
          "INSERT INTO products VALUES ('Notebook', 'stationery', 60), ('Pen', 'stationery', 10), ('Headphones', 'electronics', 1499), ('Phone stand', 'electronics', 299);",
          'SELECT category, max(price) AS top_price, min(name) AS first_name_a_to_z FROM products GROUP BY category ORDER BY category;',
          'SELECT category, name FROM products GROUP BY category;'
        ),
        output: '[Error] column "products.name" must appear in the GROUP BY clause or be used in an aggregate function',
        codeNotes: [
          { line: 3, note: 'Allowed: category is grouped; max and min are aggregates.' },
          { line: 4, note: 'Not allowed: which of the names in each group should be shown?' }
        ],
        tryIt: 'Delete line 4 and run again to see the first query\'s result. Then try GROUP BY category, name on line 4 instead: now each group is one product.',
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
        output: '[Error] column reference "id" is ambiguous',
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
        output: '[Error] each UNION query must have the same number of columns',
        codeNotes: [
          { line: 5, note: 'A fixed text column records where each row came from.' },
          { line: 7, note: 'company goes under name because it is in the same position.' },
          { line: 9, note: 'Two columns on one side and one on the other: an error.' }
        ],
        tryIt: 'Delete line 9 and run it again to see the combined list of customers and suppliers.',
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
  }
];
