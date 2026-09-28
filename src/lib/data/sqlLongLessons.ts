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
  }
];
