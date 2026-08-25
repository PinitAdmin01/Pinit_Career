import { DayLessonPlan } from '../types/lessonEngine';

export const DATABASE_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Relational Database Theory, Tables & Candidate Keys",
    "overviewMetaphor": "A relational database is a digital library filing cabinet: each drawer is a Table (Relations), each folder is a Record/Row (Tuple), each tabbed section in the folder is a Column (Attribute), and the unique barcode on each folder is the Primary Key that ensures no two documents can ever be confused.",
    "blocks": [
      {
        "id": "sql-d1-b1-relational-model",
        "day": 1,
        "blockNumber": 1,
        "title": "The Anatomy of a Relational Table (Tuples & Attributes)",
        "conceptBudget": {
          "primaryConcept": "Relational Model",
          "supportingTerms": [
            "Table (Relation)",
            "Row (Tuple)",
            "Column (Attribute)",
            "Schema Definition"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Spreadsheet Grid with Strict Data Types",
            "simpleExplanation": "Unlike a loose spreadsheet where you can type 'hello' into a price box, a relational database table strictly enforces that every column has an unbendable data type and purpose."
          },
          {
            "type": "syntax_anatomy",
            "title": "CREATE TABLE Anatomy",
            "codeSnippet": "CREATE TABLE students (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  gpa REAL DEFAULT 0.0\n);",
            "lineNotes": {
              "1": "Declares a new relation named 'students'.",
              "2": "id is the unique primary key.",
              "3": "name must never be empty (NOT NULL).",
              "4": "gpa stores decimal numbers with a 0.0 fallback default."
            }
          },
          {
            "type": "runnable_code",
            "filename": "relational_schema.sql",
            "initialCode": "CREATE TABLE students (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  gpa REAL DEFAULT 0.0\n);\n\nINSERT INTO students (id, name, gpa) VALUES (1, 'Alex Rivera', 3.85);\nSELECT * FROM students;",
            "expectedOutput": "id | name        | gpa\n---+-------------+-----\n1  | Alex Rivera | 3.85",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In relational database terminology, what is a 'Tuple'?",
          "options": [
            "A single row/record in a table containing attribute values for one entity",
            "A column data type",
            "The database server password"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS",
              "errorExplanation": "In relational calculus and SQL theory, a tuple corresponds directly to a single table row.",
              "recoveryPath": {
                "simplerExplanation": "Tuple = Row/Record.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d1-b2-primary-vs-candidate-keys",
        "day": 1,
        "blockNumber": 2,
        "title": "Candidate Keys vs Primary Keys",
        "conceptBudget": {
          "primaryConcept": "Key Hierarchy",
          "supportingTerms": [
            "Candidate Key",
            "Primary Key (PK)",
            "Alternate Key",
            "Entity Integrity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d1-b1-relational-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Passport vs Driver's License vs Student ID",
            "simpleExplanation": "A citizen might have a Passport Number, SSN, and Driver's License (all 3 are Candidate Keys because each uniquely identifies them). The government chooses one (SSN) as the Primary Key."
          },
          {
            "type": "runnable_code",
            "filename": "keys_demo.sql",
            "initialCode": "CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  ssn TEXT UNIQUE NOT NULL\n);\n\nINSERT INTO users (id, email, ssn) VALUES (101, 'alex@pinit.ai', '999-00-1234');\nSELECT id, email FROM users;",
            "expectedOutput": "id  | email\n----+--------------\n101 | alex@pinit.ai",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the key rule of Entity Integrity regarding Primary Keys in SQL?",
          "options": [
            "A Primary Key column must contain unique values and must NEVER contain a NULL value",
            "A Primary Key must always be stored in uppercase",
            "A Primary Key can contain duplicate values if timestamps match"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS",
              "errorExplanation": "Entity integrity dictates that primary keys can never be duplicate or NULL, because an unknown ID cannot uniquely identify a row.",
              "recoveryPath": {
                "simplerExplanation": "Primary Keys can never be NULL and must be strictly unique.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d1-b3-composite-primary-keys",
        "day": 1,
        "blockNumber": 3,
        "title": "Composite Primary Keys (Multi-Column Uniqueness)",
        "conceptBudget": {
          "primaryConcept": "Composite Primary Key",
          "supportingTerms": [
            "Junction Table",
            "PRIMARY KEY (col1, col2)",
            "Many-to-Many Bridge"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d1-b2-primary-vs-candidate-keys",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Composite Key Definition",
              "brokenCode": "-- ❌ Buggy: Single column PK allows duplicate enrollment pairs or lacks junction constraint\nCREATE TABLE course_members (\n  student_id INT PRIMARY KEY,\n  course_id INT\n);",
              "fixedCode": "-- ✅ Correct: Composite primary key prevents same student enrolling twice in same course\nCREATE TABLE course_members (\n  student_id INT NOT NULL,\n  course_id INT NOT NULL,\n  PRIMARY KEY (student_id, course_id)\n);",
              "errorLine": 2,
              "errorReason": "Declaring student_id as single PK prevents a student from taking more than 1 course!",
              "fixExplanation": "Use composite PRIMARY KEY (student_id, course_id) so the pair is unique."
            }
          },
          {
            "type": "runnable_code",
            "filename": "composite_pk.sql",
            "initialCode": "CREATE TABLE enrollments (\n  student_id INT,\n  course_id INT,\n  PRIMARY KEY (student_id, course_id)\n);\n\nINSERT INTO enrollments VALUES (1, 101);\nINSERT INTO enrollments VALUES (1, 102); -- Allowed! Same student, different course\nSELECT COUNT(*) AS total_enrollments FROM enrollments;",
            "expectedOutput": "total_enrollments\n-----------------\n2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many records are in enrollments when student 1 enrolls in course 101 and course 102 under composite PK (student_id, course_id)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "total_enrollments: 2"
          ],
          "primaryMisconceptionId": "MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS",
              "errorExplanation": "Composite PK checks uniqueness of the combined pair (1,101) vs (1,102). Both pairs are unique, so 2 rows exist.",
              "recoveryPath": {
                "simplerExplanation": "Both distinct pairs are stored -> 2 records.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "SQL DDL: Data Types, DEFAULT Values & Constraints",
    "overviewMetaphor": "Database constraints are structural building codes: CHECK constraints are maximum elevator weight limits, NOT NULL is requiring an emergency exit door on every floor, and DEFAULT values are backup generator lights that switch on automatically if no manual setting is given.",
    "blocks": [
      {
        "id": "sql-d2-b1-sql-data-types",
        "day": 2,
        "blockNumber": 1,
        "title": "SQL Data Types (INTEGER, TEXT, REAL, BLOB)",
        "conceptBudget": {
          "primaryConcept": "SQL Data Types",
          "supportingTerms": [
            "INTEGER",
            "TEXT / VARCHAR",
            "REAL / FLOAT",
            "BLOB (Binary)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d1-b1-relational-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Column Type Declarations",
            "codeSnippet": "CREATE TABLE inventory (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  sku TEXT NOT NULL UNIQUE,\n  unit_price REAL NOT NULL,\n  in_stock INTEGER DEFAULT 0\n);",
            "lineNotes": {
              "2": "AUTOINCREMENT automatically assigns sequential IDs (1, 2, 3...).",
              "3": "TEXT stores variable-length strings.",
              "4": "REAL stores 64-bit floating-point numbers.",
              "5": "INTEGER DEFAULT 0 assigns 0 if no quantity is provided."
            }
          },
          {
            "type": "runnable_code",
            "filename": "types_sim.sql",
            "initialCode": "CREATE TABLE inventory (\n  id INTEGER PRIMARY KEY,\n  sku TEXT,\n  unit_price REAL,\n  in_stock INTEGER DEFAULT 0\n);\n\nINSERT INTO inventory (id, sku, unit_price) VALUES (1, 'TECH-99', 49.99);\nSELECT id, sku, unit_price, in_stock FROM inventory;",
            "expectedOutput": "id | sku     | unit_price | in_stock\n---+---------+------------+---------\n1  | TECH-99 | 49.99      | 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value does in_stock hold when omitted during insertion?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "in_stock: 0"
          ],
          "primaryMisconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
          "diagnosisMap": {
            "NULL": {
              "misconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
              "errorExplanation": "Because `DEFAULT 0` was specified on the column, omitted values default to 0 instead of NULL.",
              "recoveryPath": {
                "simplerExplanation": "DEFAULT 0 assigns 0 automatically.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d2-b2-check-constraints",
        "day": 2,
        "blockNumber": 2,
        "title": "CHECK Constraints for Invariant Enforcement",
        "conceptBudget": {
          "primaryConcept": "CHECK Constraints",
          "supportingTerms": [
            "CHECK(price > 0)",
            "CHECK(status IN (...))",
            "Engine-Level Validation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d2-b1-sql-data-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CHECK Constraint Anatomy",
            "codeSnippet": "CREATE TABLE accounts (\n  id INT PRIMARY KEY,\n  balance REAL CHECK(balance >= 0.0),\n  tier TEXT CHECK(tier IN ('BRONZE', 'SILVER', 'GOLD'))\n);",
            "lineNotes": {
              "3": "Prevents any transaction from creating a negative balance.",
              "4": "Restricts tier strings to a strict enumerated set."
            }
          },
          {
            "type": "runnable_code",
            "filename": "check_sim.sql",
            "initialCode": "CREATE TABLE accounts (\n  id INT PRIMARY KEY,\n  balance REAL CHECK(balance >= 0.0)\n);\n\nINSERT INTO accounts VALUES (1, 150.00);\nSELECT balance FROM accounts WHERE id = 1;",
            "expectedOutput": "balance\n-------\n150.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if you execute `INSERT INTO accounts VALUES (2, -50.0)` on a table with `CHECK(balance >= 0.0)`?",
          "options": [
            "The database engine immediately aborts the insertion and raises a CHECK constraint violation error",
            "The database automatically converts -50.0 to +50.0",
            "The row is saved in a quarantine table"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
              "errorExplanation": "CHECK constraints fail fast and reject the query completely.",
              "recoveryPath": {
                "simplerExplanation": "Database rejects invalid values immediately.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d2-b3-not-null-vs-unique",
        "day": 2,
        "blockNumber": 3,
        "title": "NOT NULL vs UNIQUE: Multiple NULLs in UNIQUE Columns",
        "conceptBudget": {
          "primaryConcept": "UNIQUE Constraint with NULLs",
          "supportingTerms": [
            "UNIQUE allows multiple NULLs in ANSI SQL",
            "NOT NULL UNIQUE combo"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d2-b2-check-constraints",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "The UNIQUE NULL Surprise",
              "brokenCode": "-- ⚠️ Note: UNIQUE alone permits multiple NULL rows because NULL != NULL in SQL!\nCREATE TABLE users (\n  id INT PRIMARY KEY,\n  tax_id TEXT UNIQUE -- Multiple rows can have tax_id = NULL!\n);",
              "fixedCode": "-- ✅ Explicit: Combine NOT NULL UNIQUE when field is mandatory and distinct\nCREATE TABLE users (\n  id INT PRIMARY KEY,\n  tax_id TEXT NOT NULL UNIQUE\n);",
              "errorLine": 4,
              "errorReason": "In SQL standard, NULL represents an unknown value, so two NULLs are never considered equal.",
              "fixExplanation": "If you want uniqueness AND guarantee a value exists, specify both NOT NULL and UNIQUE."
            }
          },
          {
            "type": "runnable_code",
            "filename": "unique_nulls.sql",
            "initialCode": "CREATE TABLE profiles (\n  id INT PRIMARY KEY,\n  phone TEXT UNIQUE\n);\n\nINSERT INTO profiles VALUES (1, NULL);\nINSERT INTO profiles VALUES (2, NULL); -- Valid in ANSI SQL!\nSELECT COUNT(*) AS total_profiles FROM profiles;",
            "expectedOutput": "total_profiles\n--------------\n2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many rows exist when inserting two profiles with phone=NULL into a table where phone is UNIQUE (without NOT NULL)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "total_profiles: 2"
          ],
          "primaryMisconceptionId": "MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_PRIMARY_KEY_VS_UNIQUE_NULLS",
              "errorExplanation": "In standard SQL, NULL != NULL, so UNIQUE constraints permit multiple NULL entries.",
              "recoveryPath": {
                "simplerExplanation": "Multiple NULLs are allowed under UNIQUE unless NOT NULL is added.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "SQL DML: INSERT, UPDATE, DELETE & Basic SELECT",
    "overviewMetaphor": "DML commands are warehouse inventory actions: INSERT is unloading a new shipping pallet onto a shelf; SELECT is reading the inventory clipboard; UPDATE is taping a new discounted price tag over the old label; DELETE is throwing away a broken box (and leaving off WHERE is demolishing the entire warehouse!).",
    "blocks": [
      {
        "id": "sql-d3-b1-insert-syntax",
        "day": 3,
        "blockNumber": 1,
        "title": "Multi-Row INSERT INTO Syntax",
        "conceptBudget": {
          "primaryConcept": "INSERT DML",
          "supportingTerms": [
            "Explicit Column Lists",
            "Multi-Row Tuples",
            "INSERT INTO tbl(a,b) VALUES (1,2), (3,4)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d2-b1-sql-data-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Multi-Row INSERT Anatomy",
            "codeSnippet": "INSERT INTO products (name, price, stock) VALUES\n  ('Mechanical Keyboard', 89.99, 15),\n  ('Wireless Mouse', 34.50, 40),\n  ('USB-C Hub', 19.99, 25);",
            "lineNotes": {
              "1": "Explicit column naming protects against schema migration column shifts.",
              "2": "Multiple comma-separated tuples inserted in a single atomic batch."
            }
          },
          {
            "type": "runnable_code",
            "filename": "insert_batch.sql",
            "initialCode": "CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, stock INT);\nINSERT INTO products (name, price, stock) VALUES ('Mouse', 25.0, 10), ('Pad', 10.0, 50);\nSELECT COUNT(*) AS product_count FROM products;",
            "expectedOutput": "product_count\n-------------\n2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many rows are created after inserting 2 product tuples in a single statement?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "product_count: 2"
          ],
          "primaryMisconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
              "errorExplanation": "Two value tuples were inserted -> 2 rows created.",
              "recoveryPath": {
                "simplerExplanation": "2 tuples create 2 rows.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "sql-d3-b2-update-with-where",
        "day": 3,
        "blockNumber": 2,
        "title": "UPDATE: Modifying Rows Safely with WHERE",
        "conceptBudget": {
          "primaryConcept": "UPDATE DML",
          "supportingTerms": [
            "SET col = new_val",
            "Targeted WHERE Filter",
            "Accidental Full-Table Mutation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d3-b1-insert-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "The Missing WHERE UPDATE Disaster",
              "brokenCode": "-- ❌ Disaster: Missing WHERE overwrites EVERY employee's salary in the company!\nUPDATE employees SET salary = 100000;",
              "fixedCode": "-- ✅ Safe: Targeted WHERE clause updates only the intended employee\nUPDATE employees SET salary = 100000 WHERE id = 42;",
              "errorLine": 2,
              "errorReason": "In SQL, UPDATE without a WHERE clause modifies all rows in the entire table.",
              "fixExplanation": "Always specify the target row identifier in the WHERE clause."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_update.sql",
            "initialCode": "CREATE TABLE accounts (id INT, name TEXT, balance REAL);\nINSERT INTO accounts VALUES (1, 'Alex', 100.0), (2, 'Sarah', 200.0);\nUPDATE accounts SET balance = balance + 50.0 WHERE id = 1;\nSELECT name, balance FROM accounts ORDER BY id ASC;",
            "expectedOutput": "name  | balance\n------+--------\nAlex  | 150.0\nSarah | 200.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Alex's updated balance after adding $50 to account id = 1?",
          "expectedStringOutput": "150.0",
          "acceptableAnswers": [
            "150.0",
            "150",
            "Alex | 150.0"
          ],
          "primaryMisconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
          "diagnosisMap": {
            "200.0": {
              "misconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
              "errorExplanation": "100.0 + 50.0 = 150.0 for Alex.",
              "recoveryPath": {
                "simplerExplanation": "100 + 50 = 150.0.",
                "guidedFixPrompt": "Type 150.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d3-b3-delete-vs-truncate",
        "day": 3,
        "blockNumber": 3,
        "title": "DELETE FROM with Predicates",
        "conceptBudget": {
          "primaryConcept": "DELETE DML",
          "supportingTerms": [
            "DELETE FROM tbl WHERE ...",
            "Row Deletion vs DROP TABLE"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d3-b2-update-with-where",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "delete_filter.sql",
            "initialCode": "CREATE TABLE tasks (id INT, title TEXT, done INT);\nINSERT INTO tasks VALUES (1, 'Draft PR', 1), (2, 'Review Code', 0);\nDELETE FROM tasks WHERE done = 1;\nSELECT id, title FROM tasks;",
            "expectedOutput": "id | title\n---+------------\n2  | Review Code",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the consequence of executing `DELETE FROM tasks;` without a WHERE clause?",
          "options": [
            "All rows in the tasks table are deleted, but the table schema definition remains intact",
            "The table itself is deleted from the database schema",
            "Only the first row is deleted"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
              "errorExplanation": "DELETE FROM table removes all data rows. To remove the table schema itself, DROP TABLE is used.",
              "recoveryPath": {
                "simplerExplanation": "Deletes all rows, keeps schema.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "WHERE Filtering, Comparison Operators & NULL Handling",
    "overviewMetaphor": "The Three-Valued Logic of NULL is an unlabelled mystery box: If I ask 'Is the price in this mystery box equal to 100?', the answer cannot be TRUE or FALSE—the only logical answer is UNKNOWN (NULL). That's why `col = NULL` never returns rows and `IS NULL` is required.",
    "blocks": [
      {
        "id": "sql-d4-b1-null-three-valued-logic",
        "day": 4,
        "blockNumber": 1,
        "title": "The Mystery of NULL: Why `col = NULL` Always Fails",
        "conceptBudget": {
          "primaryConcept": "Three-Valued Logic (3VL)",
          "supportingTerms": [
            "TRUE, FALSE, UNKNOWN",
            "IS NULL Operator",
            "IS NOT NULL Operator"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d3-b1-insert-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "The `col = NULL` Trap",
              "brokenCode": "-- ❌ Buggy: col = NULL evaluates to UNKNOWN, so 0 rows are EVER returned!\nSELECT * FROM customers WHERE phone = NULL;",
              "fixedCode": "-- ✅ Correct: IS NULL tests whether the field has no assigned value\nSELECT * FROM customers WHERE phone IS NULL;",
              "errorLine": 2,
              "errorReason": "In SQL, comparing anything to NULL with '=' produces UNKNOWN (falsy in WHERE).",
              "fixExplanation": "Always use `IS NULL` or `IS NOT NULL` to check for missing data."
            }
          },
          {
            "type": "runnable_code",
            "filename": "null_trap.sql",
            "initialCode": "CREATE TABLE users (id INT, name TEXT, phone TEXT);\nINSERT INTO users VALUES (1, 'Alex', '555-0199'), (2, 'Sam', NULL);\n\n-- Correct check\nSELECT name FROM users WHERE phone IS NULL;",
            "expectedOutput": "name\n----\nSam",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does the query `SELECT * FROM users WHERE email = NULL` return 0 rows even when users with NULL email exist?",
          "options": [
            "Because comparing any value to NULL using `=` evaluates to `UNKNOWN`, which the WHERE clause treats as not matching",
            "Because SQL does not allow email columns",
            "Because NULL is converted to empty string ''"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
              "errorExplanation": "Three-Valued Logic dictates that `NULL = NULL` is UNKNOWN, not TRUE. You must use `IS NULL`.",
              "recoveryPath": {
                "simplerExplanation": "`= NULL` evaluates to UNKNOWN. Use `IS NULL`.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d4-b2-and-or-precedence",
        "day": 4,
        "blockNumber": 2,
        "title": "Combining Filters: AND vs OR Precedence",
        "conceptBudget": {
          "primaryConcept": "Logical Operator Precedence",
          "supportingTerms": [
            "AND has higher precedence than OR",
            "Parentheses Grouping `(A OR B) AND C`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d4-b1-null-three-valued-logic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Parenthesized Filter Anatomy",
            "codeSnippet": "SELECT name, role, salary FROM staff\nWHERE (department = 'ENG' OR department = 'AI')\n  AND salary >= 90000;",
            "lineNotes": {
              "2": "Parentheses force the OR expression to evaluate before AND.",
              "3": "Guarantees salary filter applies to BOTH engineering and AI staff."
            }
          },
          {
            "type": "runnable_code",
            "filename": "precedence_sim.sql",
            "initialCode": "CREATE TABLE staff (name TEXT, dept TEXT, salary REAL);\nINSERT INTO staff VALUES ('Alex', 'ENG', 95000), ('Sam', 'HR', 60000), ('Pat', 'AI', 110000);\nSELECT name FROM staff WHERE (dept = 'ENG' OR dept = 'AI') AND salary >= 100000;",
            "expectedOutput": "name\n----\nPat",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which staff member matches `(dept = 'ENG' OR dept = 'AI') AND salary >= 100000`?",
          "expectedStringOutput": "Pat",
          "acceptableAnswers": [
            "Pat",
            "name: Pat"
          ],
          "primaryMisconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
          "diagnosisMap": {
            "Alex": {
              "misconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
              "errorExplanation": "Alex earns 95000 (< 100000), so only Pat (110000) matches.",
              "recoveryPath": {
                "simplerExplanation": "Only Pat satisfies salary >= 100000.",
                "guidedFixPrompt": "Type Pat"
              }
            }
          }
        }
      },
      {
        "id": "sql-d4-b3-coalesce-function",
        "day": 4,
        "blockNumber": 3,
        "title": "The COALESCE() Fallback Function",
        "conceptBudget": {
          "primaryConcept": "COALESCE() Function",
          "supportingTerms": [
            "First Non-NULL Value",
            "Default Presentation Values"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d4-b2-and-or-precedence",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coalesce_sim.sql",
            "initialCode": "SELECT COALESCE(NULL, NULL, 'BACKUP_PHONE', 'MAIN_PHONE') AS active_contact;",
            "expectedOutput": "active_contact\n--------------\nBACKUP_PHONE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What string does COALESCE(NULL, NULL, 'BACKUP_PHONE', 'MAIN_PHONE') return?",
          "expectedStringOutput": "BACKUP_PHONE",
          "acceptableAnswers": [
            "BACKUP_PHONE",
            "'BACKUP_PHONE'"
          ],
          "primaryMisconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
          "diagnosisMap": {
            "MAIN_PHONE": {
              "misconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
              "errorExplanation": "COALESCE returns the very FIRST non-null argument encountered ('BACKUP_PHONE').",
              "recoveryPath": {
                "simplerExplanation": "Returns first non-null value.",
                "guidedFixPrompt": "Type BACKUP_PHONE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Customer Order Management Schema & CRUD Engine",
    "overviewMetaphor": "Milestone 1 — Relational Core Architecture: Building a rock-solid e-commerce backend schema with Foreign Keys and CASCADE rules that guarantee orphaned order records can never corrupt financial ledgers.",
    "blocks": [
      {
        "id": "sql-d5-b1-foreign-keys-cascade",
        "day": 5,
        "blockNumber": 1,
        "title": "Foreign Keys & ON DELETE CASCADE Rules",
        "conceptBudget": {
          "primaryConcept": "Foreign Key Integrity",
          "supportingTerms": [
            "REFERENCES parent(id)",
            "ON DELETE CASCADE",
            "Orphaned Record Prevention"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d1-b2-primary-vs-candidate-keys",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Foreign Key Declaration",
            "codeSnippet": "CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer_id INTEGER NOT NULL,\n  total REAL NOT NULL CHECK(total >= 0),\n  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE\n);",
            "lineNotes": {
              "4": "ON DELETE CASCADE automatically deletes all customer orders if the parent customer is deleted."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fk_demo.sql",
            "initialCode": "PRAGMA foreign_keys = ON;\nCREATE TABLE customers (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE orders (id INT PRIMARY KEY, customer_id INT REFERENCES customers(id) ON DELETE CASCADE);\n\nINSERT INTO customers VALUES (1, 'Alex');\nINSERT INTO orders VALUES (101, 1);\nDELETE FROM customers WHERE id = 1;\nSELECT COUNT(*) AS remaining_orders FROM orders;",
            "expectedOutput": "remaining_orders\n----------------\n0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When customer 1 is deleted under ON DELETE CASCADE, how many orders remain in the orders table?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "remaining_orders: 0"
          ],
          "primaryMisconceptionId": "MC_SQL_FOREIGN_KEY_CASCADE_DELETE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_FOREIGN_KEY_CASCADE_DELETE",
              "errorExplanation": "ON DELETE CASCADE purged the child order when the parent customer was deleted.",
              "recoveryPath": {
                "simplerExplanation": "CASCADE automatically cleans up child orders -> 0 remain.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d5-b2-referential-integrity-rejection",
        "day": 5,
        "blockNumber": 2,
        "title": "Referential Integrity Constraint Violations",
        "conceptBudget": {
          "primaryConcept": "Referential Integrity",
          "supportingTerms": [
            "Cannot insert child for non-existent parent",
            "FOREIGN KEY constraint failed"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d5-b1-foreign-keys-cascade",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ref_integrity.sql",
            "initialCode": "PRAGMA foreign_keys = ON;\nCREATE TABLE accounts (id INT PRIMARY KEY);\nINSERT INTO accounts VALUES (1);\nSELECT 'Parent Account Valid' AS status;",
            "expectedOutput": "status\n--------------------\nParent Account Valid",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "With `PRAGMA foreign_keys = ON`, what happens if you insert an order with `customer_id = 999` when no customer with id 999 exists?",
          "options": [
            "The database rejects the insert and throws a FOREIGN KEY constraint failed error",
            "The database silently creates customer 999",
            "The customer_id is replaced with 0"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_FOREIGN_KEY_CASCADE_DELETE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_FOREIGN_KEY_CASCADE_DELETE",
              "errorExplanation": "Foreign keys enforce referential integrity by requiring the parent row to exist beforehand.",
              "recoveryPath": {
                "simplerExplanation": "Rejects the insert immediately.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d5-b3-milestone-crud-synthesis",
        "day": 5,
        "blockNumber": 3,
        "title": "Full Milestone 1 CRUD Validation Engine",
        "conceptBudget": {
          "primaryConcept": "Complete Schema Synthesis",
          "supportingTerms": [
            "End-to-End Tables",
            "Data Ingestion Pipeline"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d5-b2-referential-integrity-rejection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_synthesis.sql",
            "initialCode": "CREATE TABLE catalog (id INT PRIMARY KEY, name TEXT, price REAL);\nINSERT INTO catalog VALUES (1, 'Pro Laptop', 1200.0), (2, 'Monitor', 300.0);\nSELECT COUNT(*) AS total_items, SUM(price) AS catalog_value FROM catalog;",
            "expectedOutput": "total_items | catalog_value\n------------+--------------\n2           | 1500.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total catalog value of the 2 items above?",
          "expectedStringOutput": "1500.0",
          "acceptableAnswers": [
            "1500.0",
            "1500",
            "catalog_value: 1500.0"
          ],
          "primaryMisconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
          "diagnosisMap": {
            "1200.0": {
              "misconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
              "errorExplanation": "1200.0 + 300.0 = 1500.0.",
              "recoveryPath": {
                "simplerExplanation": "Sum is 1500.0.",
                "guidedFixPrompt": "Type 1500.0"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Pattern Matching (LIKE, GLOB), IN Lists & BETWEEN Ranges",
    "overviewMetaphor": "Pattern matching is an airport luggage scanner: `%` is a wild card that matches any suitcase shape or length (`'TECH-%'`), `_` is a precision slot for exactly one letter (`'D_LL'`), and `IN ('US', 'UK', 'CA')` is an approved destination checklist.",
    "blocks": [
      {
        "id": "sql-d6-b1-like-wildcards",
        "day": 6,
        "blockNumber": 1,
        "title": "The LIKE Operator and Wildcards (% and _)",
        "conceptBudget": {
          "primaryConcept": "LIKE Wildcard Matching",
          "supportingTerms": [
            "% (0 or more characters)",
            "_ (exactly 1 character)",
            "Case Insensitivity in SQLite"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d4-b1-null-three-valued-logic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "LIKE Pattern Anatomy",
            "codeSnippet": "SELECT email FROM users WHERE email LIKE '%@pinit.ai';\nSELECT code FROM coupons WHERE code LIKE 'DISC_0'; -- matches DISC10, DISC20",
            "lineNotes": {
              "1": "'%@pinit.ai' matches any text ending with '@pinit.ai'.",
              "2": "'DISC_0' matches any single character in place of underscore."
            }
          },
          {
            "type": "runnable_code",
            "filename": "like_sim.sql",
            "initialCode": "CREATE TABLE domains (email TEXT);\nINSERT INTO domains VALUES ('alex@pinit.ai'), ('sarah@gmail.com'), ('support@pinit.ai');\nSELECT email FROM domains WHERE email LIKE '%@pinit.ai' ORDER BY email ASC;",
            "expectedOutput": "email\n----------------\nalex@pinit.ai\nsupport@pinit.ai",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many emails match `%@pinit.ai` in the table above?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2"
          ],
          "primaryMisconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
              "errorExplanation": "'sarah@gmail.com' does not end with '@pinit.ai', so 2 emails match.",
              "recoveryPath": {
                "simplerExplanation": "2 matching emails.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "sql-d6-b2-in-lists",
        "day": 6,
        "blockNumber": 2,
        "title": "The IN Membership Operator",
        "conceptBudget": {
          "primaryConcept": "IN Operator",
          "supportingTerms": [
            "IN ('A', 'B', 'C')",
            "Shorthand for Multiple OR Expressions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d6-b1-like-wildcards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "in_list.sql",
            "initialCode": "CREATE TABLE inventory (sku TEXT, category TEXT);\nINSERT INTO inventory VALUES ('SKU1', 'TECH'), ('SKU2', 'OFFICE'), ('SKU3', 'GARDEN');\nSELECT sku FROM inventory WHERE category IN ('TECH', 'OFFICE') ORDER BY sku ASC;",
            "expectedOutput": "sku\n----\nSKU1\nSKU2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which SKUs match category IN ('TECH', 'OFFICE')?",
          "expectedStringOutput": "sku\n----\nSKU1\nSKU2",
          "acceptableAnswers": [
            "sku\n----\nSKU1\nSKU2",
            "SKU1, SKU2",
            "SKU1 and SKU2"
          ],
          "primaryMisconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
          "diagnosisMap": {
            "SKU3": {
              "misconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
              "errorExplanation": "GARDEN is not in ('TECH', 'OFFICE').",
              "recoveryPath": {
                "simplerExplanation": "Matches SKU1 and SKU2.",
                "guidedFixPrompt": "Type SKU1, SKU2"
              }
            }
          }
        }
      },
      {
        "id": "sql-d6-b3-between-ranges",
        "day": 6,
        "blockNumber": 3,
        "title": "The BETWEEN Operator & Inclusive Boundaries",
        "conceptBudget": {
          "primaryConcept": "BETWEEN Operator",
          "supportingTerms": [
            "Inclusive of Both Endpoints (`val >= A AND val <= B`)",
            "Boundary Safety"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d6-b2-in-lists",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "between_sim.sql",
            "initialCode": "CREATE TABLE scores (val INT);\nINSERT INTO scores VALUES (10), (50), (100), (105);\n-- BETWEEN is inclusive: 10 and 100 are included!\nSELECT COUNT(*) AS match_count FROM scores WHERE val BETWEEN 10 AND 100;",
            "expectedOutput": "match_count\n-----------\n3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "For scores 10, 50, 100, 105, how many match `val BETWEEN 10 AND 100`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "match_count: 3"
          ],
          "primaryMisconceptionId": "MC_SQL_BETWEEN_BOUNDARY_INCLUSION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_BETWEEN_BOUNDARY_INCLUSION",
              "errorExplanation": "BETWEEN is inclusive of both boundary endpoints (10, 50, and 100 all match -> count is 3).",
              "recoveryPath": {
                "simplerExplanation": "Includes endpoints 10, 50, and 100 -> 3 values.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "ORDER BY Sorting (ASC, DESC) & LIMIT / OFFSET Pagination",
    "overviewMetaphor": "Pagination is turning pages in a printed book: `ORDER BY price DESC` alphabetizes the catalog by highest price first; `LIMIT 10 OFFSET 20` says 'open the book, skip the first 20 items (pages 1 and 2), and read only the next 10 items (page 3)'.",
    "blocks": [
      {
        "id": "sql-d7-b1-multi-column-sorting",
        "day": 7,
        "blockNumber": 1,
        "title": "Multi-Column Sorting (Primary & Secondary Orders)",
        "conceptBudget": {
          "primaryConcept": "ORDER BY Clause",
          "supportingTerms": [
            "ASC (Default)",
            "DESC",
            "Tie-Breaking Secondary Columns"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d6-b3-between-ranges",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ORDER BY Syntax",
            "codeSnippet": "SELECT name, department, salary FROM employees\nORDER BY department ASC, salary DESC;",
            "lineNotes": {
              "2": "Groups departments alphabetically first; breaks ties by ordering highest salary within that department."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sort_sim.sql",
            "initialCode": "CREATE TABLE employees (name TEXT, dept TEXT, salary REAL);\nINSERT INTO employees VALUES ('Alex', 'ENG', 80000), ('Sam', 'ENG', 95000), ('Pat', 'DESIGN', 70000);\nSELECT name, dept, salary FROM employees ORDER BY dept ASC, salary DESC;",
            "expectedOutput": "name | dept   | salary\n-----+--------+--------\nPat  | DESIGN | 70000.0\nSam  | ENG    | 95000.0\nAlex | ENG    | 80000.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Within the 'ENG' department, who is listed first when sorted by `salary DESC`?",
          "expectedStringOutput": "Sam",
          "acceptableAnswers": [
            "Sam",
            "name: Sam"
          ],
          "primaryMisconceptionId": "MC_SQL_ORDER_BY_EXECUTION_ORDER",
          "diagnosisMap": {
            "Alex": {
              "misconceptionId": "MC_SQL_ORDER_BY_EXECUTION_ORDER",
              "errorExplanation": "Sam earns 95000 while Alex earns 80000, so Sam appears first under DESC order.",
              "recoveryPath": {
                "simplerExplanation": "Higher salary (Sam) comes first in DESC order.",
                "guidedFixPrompt": "Type Sam"
              }
            }
          }
        }
      },
      {
        "id": "sql-d7-b2-limit-offset-math",
        "day": 7,
        "blockNumber": 2,
        "title": "LIMIT & OFFSET Calculation for Pagination",
        "conceptBudget": {
          "primaryConcept": "Pagination Mechanics",
          "supportingTerms": [
            "LIMIT page_size",
            "OFFSET (page - 1) * page_size"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d7-b1-multi-column-sorting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Pagination Offset Formula",
            "codeSnippet": "-- Page 1: LIMIT 10 OFFSET 0\n-- Page 2: LIMIT 10 OFFSET 10\n-- Page 3: LIMIT 10 OFFSET 20\nSELECT id, name FROM products ORDER BY id ASC LIMIT 10 OFFSET 20;",
            "lineNotes": {
              "4": "OFFSET 20 skips the first 20 records to render Page 3."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pagination_sim.sql",
            "initialCode": "CREATE TABLE items (id INT);\nINSERT INTO items VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);\n-- Page size 3, Page 2 -> Skip 3, take 3\nSELECT id FROM items ORDER BY id ASC LIMIT 3 OFFSET 3;",
            "expectedOutput": "id\n--\n4\n5\n6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the first ID returned for Page 2 (LIMIT 3 OFFSET 3)?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "id: 4"
          ],
          "primaryMisconceptionId": "MC_SQL_LIMIT_OFFSET_PERFORMANCE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_SQL_LIMIT_OFFSET_PERFORMANCE",
              "errorExplanation": "OFFSET 3 skips items 1, 2, 3. The first item on page 2 is 4.",
              "recoveryPath": {
                "simplerExplanation": "Skips 1,2,3 -> first item is 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "sql-d7-b3-cursor-vs-offset",
        "day": 7,
        "blockNumber": 3,
        "title": "Offset Performance vs Keyset/Cursor Pagination",
        "conceptBudget": {
          "primaryConcept": "Keyset Pagination",
          "supportingTerms": [
            "WHERE id > last_seen_id LIMIT 10",
            "Avoiding Deep OFFSET Scans"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d7-b2-limit-offset-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cursor_sim.sql",
            "initialCode": "CREATE TABLE stream (id INT, payload TEXT);\nINSERT INTO stream VALUES (10, 'A'), (15, 'B'), (22, 'C'), (35, 'D');\n-- Keyset pagination: fast O(log N) index scan\nSELECT id, payload FROM stream WHERE id > 15 ORDER BY id ASC LIMIT 2;",
            "expectedOutput": "id | payload\n---+--------\n22 | C\n35 | D",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is keyset pagination (`WHERE id > last_seen_id LIMIT 10`) preferred over high offset pagination (`LIMIT 10 OFFSET 1000000`) for large tables?",
          "options": [
            "Keyset pagination uses index seeking directly to the target record in O(log N) without scanning and discarding 1,000,000 preceding rows",
            "Because OFFSET is not supported in SQL",
            "Because keyset pagination deletes old records"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_LIMIT_OFFSET_PERFORMANCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_LIMIT_OFFSET_PERFORMANCE",
              "errorExplanation": "Deep offsets force the database engine to traverse and discard thousands of rows. Keyset pagination jumps directly via index.",
              "recoveryPath": {
                "simplerExplanation": "Jumps directly using index seek without scanning discarded rows.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "SQL String & Date Formatting Functions",
    "overviewMetaphor": "SQL built-in functions are precision machine tools: `TRIM()` chips away unwanted blank edges, `UPPER()` stamps clear block letters onto nameplates, and `STRFTIME('%Y-%m')` extracts the exact production year and month from raw timestamp metadata.",
    "blocks": [
      {
        "id": "sql-d8-b1-string-functions",
        "day": 8,
        "blockNumber": 1,
        "title": "String Manipulation: UPPER, LOWER, TRIM, and Concatenation (||)",
        "conceptBudget": {
          "primaryConcept": "SQL String Functions",
          "supportingTerms": [
            "UPPER() / LOWER()",
            "TRIM()",
            "Concatenation Operator `||`",
            "LENGTH()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d6-b1-like-wildcards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "String Transformation Syntax",
            "codeSnippet": "SELECT\n  UPPER(first_name || ' ' || last_name) AS full_name_upper,\n  LOWER(TRIM(email)) AS clean_email,\n  LENGTH(TRIM(email)) AS char_count\nFROM customers;",
            "lineNotes": {
              "2": "|| concatenates strings together.",
              "3": "TRIM strips leading/trailing spaces before LOWER lowercases.",
              "4": "LENGTH returns the number of characters in the string."
            }
          },
          {
            "type": "runnable_code",
            "filename": "string_funcs.sql",
            "initialCode": "SELECT UPPER('alex' || ' ' || 'rivera') AS full_name, LENGTH('pinit') AS name_len;",
            "expectedOutput": "full_name   | name_len\n------------+---------\nALEX RIVERA | 5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `full_name` produced by `UPPER('alex' || ' ' || 'rivera')`?",
          "expectedStringOutput": "ALEX RIVERA",
          "acceptableAnswers": [
            "ALEX RIVERA",
            "'ALEX RIVERA'"
          ],
          "primaryMisconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
          "diagnosisMap": {
            "alex rivera": {
              "misconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
              "errorExplanation": "UPPER converts the concatenated string to uppercase.",
              "recoveryPath": {
                "simplerExplanation": "Uppercased to ALEX RIVERA.",
                "guidedFixPrompt": "Type ALEX RIVERA"
              }
            }
          }
        }
      },
      {
        "id": "sql-d8-b2-date-time-functions",
        "day": 8,
        "blockNumber": 2,
        "title": "Date & Time Arithmetic: DATE, DATETIME & STRFTIME",
        "conceptBudget": {
          "primaryConcept": "SQL Date Functions",
          "supportingTerms": [
            "CURRENT_TIMESTAMP",
            "STRFTIME('%Y-%m-%d', date)",
            "DATE('now', '-7 days')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d8-b1-string-functions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "date_sim.sql",
            "initialCode": "SELECT STRFTIME('%Y', '2026-08-24 12:00:00') AS extracted_year;",
            "expectedOutput": "extracted_year\n--------------\n2026",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What year string is extracted by `STRFTIME('%Y', '2026-08-24')`?",
          "expectedStringOutput": "2026",
          "acceptableAnswers": [
            "2026",
            "'2026'"
          ],
          "primaryMisconceptionId": "MC_SQL_ORDER_BY_EXECUTION_ORDER",
          "diagnosisMap": {
            "08": {
              "misconceptionId": "MC_SQL_ORDER_BY_EXECUTION_ORDER",
              "errorExplanation": "%Y extracts the 4-digit year (2026). %m extracts month.",
              "recoveryPath": {
                "simplerExplanation": "Year format %Y produces 2026.",
                "guidedFixPrompt": "Type 2026"
              }
            }
          }
        }
      },
      {
        "id": "sql-d8-b3-case-when-projections",
        "day": 8,
        "blockNumber": 3,
        "title": "Conditional Projections with CASE WHEN",
        "conceptBudget": {
          "primaryConcept": "CASE Expression",
          "supportingTerms": [
            "CASE WHEN condition THEN val ELSE fallback END",
            "Inline Conditional Mapping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d8-b2-date-time-functions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CASE WHEN Anatomy",
            "codeSnippet": "SELECT\n  name,\n  salary,\n  CASE\n    WHEN salary >= 100000 THEN 'SENIOR'\n    WHEN salary >= 60000  THEN 'MID'\n    ELSE 'JUNIOR'\n  END AS compensation_tier\nFROM employees;",
            "lineNotes": {
              "3": "Evaluates conditional branches sequentially from top to bottom.",
              "6": "ELSE provides fallback value if no conditions match."
            }
          },
          {
            "type": "runnable_code",
            "filename": "case_sim.sql",
            "initialCode": "SELECT\n  120000 AS salary,\n  CASE\n    WHEN 120000 >= 100000 THEN 'SENIOR'\n    ELSE 'JUNIOR'\n  END AS tier;",
            "expectedOutput": "salary | tier\n-------+-------\n120000 | SENIOR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What tier is assigned to a salary of 120000 in the CASE statement above?",
          "expectedStringOutput": "SENIOR",
          "acceptableAnswers": [
            "SENIOR",
            "'SENIOR'",
            "tier: SENIOR"
          ],
          "primaryMisconceptionId": "MC_SQL_ORDER_BY_EXECUTION_ORDER",
          "diagnosisMap": {
            "JUNIOR": {
              "misconceptionId": "MC_SQL_ORDER_BY_EXECUTION_ORDER",
              "errorExplanation": "120000 >= 100000 evaluates to TRUE, matching the first branch 'SENIOR'.",
              "recoveryPath": {
                "simplerExplanation": "Matches 'SENIOR'.",
                "guidedFixPrompt": "Type SENIOR"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Aggregate Functions: COUNT, SUM, AVG, MIN, MAX",
    "overviewMetaphor": "Aggregate functions are a digital cash register at checkout: individual item barcode scans are collapsed down into total items count (`COUNT`), total receipt cost (`SUM`), average item cost (`AVG`), and most expensive item (`MAX`).",
    "blocks": [
      {
        "id": "sql-d9-b1-count-star-vs-col",
        "day": 9,
        "blockNumber": 1,
        "title": "COUNT(*) vs COUNT(column_name): The NULL Counting Trap",
        "conceptBudget": {
          "primaryConcept": "COUNT Aggregation Semantics",
          "supportingTerms": [
            "COUNT(*) includes NULL rows",
            "COUNT(col) ignores NULLs",
            "COUNT(DISTINCT col)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d4-b1-null-three-valued-logic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "COUNT(*) vs COUNT(col) with NULLs",
              "brokenCode": "-- ⚠️ Counting specific column IGNORES null values (e.g. Sam with no phone!)\nSELECT COUNT(phone) FROM users; -- Returns 1 (misses Sam)",
              "fixedCode": "-- ✅ COUNT(*) counts all physical rows regardless of null column entries\nSELECT COUNT(*) FROM users;     -- Returns 2 (counts all rows)",
              "errorLine": 2,
              "errorReason": "COUNT(col) counts only non-null values in that specific column.",
              "fixExplanation": "Use COUNT(*) to count total table rows, or COUNT(col) only when explicitly checking non-null entries."
            }
          },
          {
            "type": "runnable_code",
            "filename": "count_demo.sql",
            "initialCode": "CREATE TABLE users (id INT, phone TEXT);\nINSERT INTO users VALUES (1, '555-0100'), (2, NULL);\nSELECT COUNT(*) AS total_rows, COUNT(phone) AS non_null_phones FROM users;",
            "expectedOutput": "total_rows | non_null_phones\n-----------+----------------\n2          | 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "With 2 rows where 1 has phone=NULL, what does `COUNT(phone)` return?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "non_null_phones: 1"
          ],
          "primaryMisconceptionId": "MC_SQL_COUNT_NULL_BEHAVIOR",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_SQL_COUNT_NULL_BEHAVIOR",
              "errorExplanation": "COUNT(column) skips NULL entries, so it counts only 1 non-null phone.",
              "recoveryPath": {
                "simplerExplanation": "COUNT(col) ignores NULLs -> returns 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "sql-d9-b2-sum-avg-math",
        "day": 9,
        "blockNumber": 2,
        "title": "SUM, AVG and Precision Rounding with ROUND()",
        "conceptBudget": {
          "primaryConcept": "Arithmetic Aggregation",
          "supportingTerms": [
            "SUM(col)",
            "AVG(col)",
            "ROUND(val, decimals)",
            "NULLs in Math Aggregates"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d9-b1-count-star-vs-col",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Aggregate Function Syntax",
            "codeSnippet": "SELECT\n  SUM(salary) AS total_payroll,\n  ROUND(AVG(salary), 2) AS rounded_average,\n  MIN(salary) AS min_pay,\n  MAX(salary) AS max_pay\nFROM employees;",
            "lineNotes": {
              "2": "Computes sum of all non-null salary rows.",
              "3": "Calculates arithmetic mean rounded to 2 decimal places."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sum_avg_sim.sql",
            "initialCode": "CREATE TABLE salaries (amount REAL);\nINSERT INTO salaries VALUES (50000), (70000), (90000);\nSELECT SUM(amount) AS total, ROUND(AVG(amount), 2) AS average FROM salaries;",
            "expectedOutput": "total    | average\n---------+--------\n210000.0 | 70000.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the average salary of 50000, 70000, and 90000 in the query above?",
          "expectedStringOutput": "70000.0",
          "acceptableAnswers": [
            "70000.0",
            "70000",
            "average: 70000.0"
          ],
          "primaryMisconceptionId": "MC_SQL_COUNT_NULL_BEHAVIOR",
          "diagnosisMap": {
            "210000.0": {
              "misconceptionId": "MC_SQL_COUNT_NULL_BEHAVIOR",
              "errorExplanation": "210000 is the SUM. The AVG is 210000 / 3 = 70000.0.",
              "recoveryPath": {
                "simplerExplanation": "Average is 70000.0.",
                "guidedFixPrompt": "Type 70000.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d9-b3-count-distinct",
        "day": 9,
        "blockNumber": 3,
        "title": "COUNT(DISTINCT column_name) Deduplication",
        "conceptBudget": {
          "primaryConcept": "Distinct Aggregation",
          "supportingTerms": [
            "COUNT(DISTINCT col)",
            "Counting Unique Values"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d9-b2-sum-avg-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "distinct_sim.sql",
            "initialCode": "CREATE TABLE sales (id INT, country TEXT);\nINSERT INTO sales VALUES (1, 'US'), (2, 'US'), (3, 'UK'), (4, 'CA');\nSELECT COUNT(*) AS total_sales, COUNT(DISTINCT country) AS unique_countries FROM sales;",
            "expectedOutput": "total_sales | unique_countries\n------------+-----------------\n4           | 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "For sales records with countries US, US, UK, CA, how many unique countries are counted?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "unique_countries: 3"
          ],
          "primaryMisconceptionId": "MC_SQL_COUNT_NULL_BEHAVIOR",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_SQL_COUNT_NULL_BEHAVIOR",
              "errorExplanation": "COUNT(DISTINCT) deduplicates 'US', yielding 3 unique countries.",
              "recoveryPath": {
                "simplerExplanation": "Deduplicated count is 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "GROUP BY Aggregations & the HAVING Filter Clause",
    "overviewMetaphor": "GROUP BY vs HAVING is sorting mail at a post office: `GROUP BY zip_code` sorts individual envelopes into separate city bins; `WHERE` filters out damaged letters before they ever enter a bin; `HAVING` filters out entire bins (e.g. 'only ship bins that contain at least 50 letters').",
    "blocks": [
      {
        "id": "sql-d10-b1-group-by-concept",
        "day": 10,
        "blockNumber": 1,
        "title": "The GROUP BY Mechanism: Bucketing Rows by Category",
        "conceptBudget": {
          "primaryConcept": "GROUP BY Clause",
          "supportingTerms": [
            "Categorical Buckets",
            "Non-Aggregate Projections Rule",
            "Per-Group Summaries"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d9-b1-count-star-vs-col",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GROUP BY Syntax",
            "codeSnippet": "SELECT\n  department,\n  COUNT(*) AS staff_count,\n  SUM(salary) AS dept_payroll\nFROM employees\nGROUP BY department;",
            "lineNotes": {
              "2": "department is the grouping key.",
              "3": "Aggregate functions calculate metrics independently for each department bucket."
            }
          },
          {
            "type": "runnable_code",
            "filename": "groupby_sim.sql",
            "initialCode": "CREATE TABLE employees (dept TEXT, salary REAL);\nINSERT INTO employees VALUES ('ENG', 100000), ('ENG', 120000), ('HR', 60000);\nSELECT dept, COUNT(*) AS count, SUM(salary) AS total FROM employees GROUP BY dept ORDER BY dept ASC;",
            "expectedOutput": "dept | count | total\n-----+-------+---------\nENG  | 2     | 220000.0\nHR   | 1     | 60000.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the rule regarding unaggregated columns in the `SELECT` list when using `GROUP BY`?",
          "options": [
            "Every column in the SELECT list must either be listed in the GROUP BY clause or wrapped inside an aggregate function (SUM, AVG, COUNT, etc.)",
            "You cannot select any column name except numbers",
            "GROUP BY requires all columns to be primary keys"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_GROUP_BY_NON_AGGREGATE_COLUMN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_GROUP_BY_NON_AGGREGATE_COLUMN",
              "errorExplanation": "Selecting non-aggregated columns not present in GROUP BY produces ambiguous, indeterminate rows in standard SQL.",
              "recoveryPath": {
                "simplerExplanation": "Columns must be in GROUP BY or inside an aggregate.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d10-b2-where-vs-having",
        "day": 10,
        "blockNumber": 2,
        "title": "WHERE vs HAVING: Filtering Rows vs Filtering Groups",
        "conceptBudget": {
          "primaryConcept": "WHERE vs HAVING",
          "supportingTerms": [
            "WHERE filters individual rows BEFORE grouping",
            "HAVING filters aggregated buckets AFTER grouping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d10-b1-group-by-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "The WHERE Aggregate Function Bug",
              "brokenCode": "-- ❌ Illegal: Aggregate functions cannot appear in the WHERE clause!\nSELECT department, COUNT(*)\nFROM employees\nWHERE COUNT(*) >= 5 -- ❌ SQL Error: misuse of aggregate function in WHERE!\nGROUP BY department;",
              "fixedCode": "-- ✅ Correct: Use HAVING to filter aggregated metrics\nSELECT department, COUNT(*)\nFROM employees\nGROUP BY department\nHAVING COUNT(*) >= 5; -- ✅ Evaluated after groups are formed!",
              "errorLine": 4,
              "errorReason": "WHERE filters rows before groups exist, so COUNT(*) is undefined in WHERE.",
              "fixExplanation": "Use HAVING to filter on aggregate conditions (COUNT, SUM, AVG)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "having_demo.sql",
            "initialCode": "CREATE TABLE orders (customer_id INT, amount REAL);\nINSERT INTO orders VALUES (1, 100), (1, 200), (2, 50);\nSELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id HAVING SUM(amount) >= 200;",
            "expectedOutput": "customer_id | total\n------------+------\n1           | 300.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When should you use `HAVING` instead of `WHERE`?",
          "options": [
            "When filtering based on the results of an aggregate function (e.g. `HAVING COUNT(*) > 2` or `HAVING SUM(amount) >= 1000`)",
            "When filtering text strings",
            "When ordering table rows"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_WHERE_VS_HAVING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_WHERE_VS_HAVING",
              "errorExplanation": "HAVING evaluates conditions on aggregated results; WHERE filters raw rows before grouping.",
              "recoveryPath": {
                "simplerExplanation": "HAVING is for aggregate conditions like SUM/COUNT.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d10-b3-combined-pipeline",
        "day": 10,
        "blockNumber": 3,
        "title": "The Complete SQL Query Pipeline Execution Order",
        "conceptBudget": {
          "primaryConcept": "SQL Execution Order",
          "supportingTerms": [
            "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d10-b2-where-vs-having",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "SQL Engine Execution Sequence",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. FROM & JOIN (Form working table)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. WHERE (Filter individual rows)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. GROUP BY (Bucket rows)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. HAVING (Filter buckets)",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "5. SELECT & Aliases (Compute columns)",
                  "kind": "process"
                },
                {
                  "id": "6",
                  "label": "6. ORDER BY (Sort result)",
                  "kind": "process"
                },
                {
                  "id": "7",
                  "label": "7. LIMIT / OFFSET (Slice page)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pipeline_sim.sql",
            "initialCode": "CREATE TABLE sales (id INT, dept TEXT, status TEXT, amount REAL);\nINSERT INTO sales VALUES (1, 'ENG', 'ACTIVE', 500), (2, 'ENG', 'CANCELLED', 300), (3, 'ENG', 'ACTIVE', 700);\n\n-- Pipeline execution:\nSELECT dept, SUM(amount) AS valid_revenue\nFROM sales\nWHERE status = 'ACTIVE'\nGROUP BY dept\nHAVING SUM(amount) >= 1000;",
            "expectedOutput": "dept | valid_revenue\n-----+--------------\nENG  | 1200.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "For ACTIVE sales 500 and 700 (ignoring CANCELLED 300), what is `valid_revenue` for department 'ENG'?",
          "expectedStringOutput": "1200.0",
          "acceptableAnswers": [
            "1200.0",
            "1200",
            "valid_revenue: 1200.0"
          ],
          "primaryMisconceptionId": "MC_SQL_WHERE_VS_HAVING",
          "diagnosisMap": {
            "1500.0": {
              "misconceptionId": "MC_SQL_WHERE_VS_HAVING",
              "errorExplanation": "WHERE status = 'ACTIVE' filtered out the 300 cancelled sale before aggregation: 500 + 700 = 1200.0.",
              "recoveryPath": {
                "simplerExplanation": "500 + 700 = 1200.0.",
                "guidedFixPrompt": "Type 1200.0"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "INNER JOIN: Combining Relational Tables on Foreign Keys",
    "overviewMetaphor": "INNER JOIN is finding matching puzzle pieces: it takes two separate buckets (e.g. Customers and Orders), checks the connecting notch (`c.id = o.customer_id`), and locks them together side-by-side into a single wide composite record (discarding pieces with no match).",
    "blocks": [
      {
        "id": "sql-d11-b1-inner-join-mechanics",
        "day": 11,
        "blockNumber": 1,
        "title": "INNER JOIN Mechanics & ON Predicates",
        "conceptBudget": {
          "primaryConcept": "INNER JOIN",
          "supportingTerms": [
            "ON c.id = o.customer_id",
            "Intersection of Tables",
            "Table Aliases (`c`, `o`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d5-b1-foreign-keys-cascade",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "INNER JOIN Syntax",
            "codeSnippet": "SELECT\n  c.name AS customer_name,\n  o.id AS order_id,\n  o.total_amount\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;",
            "lineNotes": {
              "4": "customers table aliased as 'c'.",
              "5": "INNER JOIN combines rows where customer_id equals the customer primary key."
            }
          },
          {
            "type": "runnable_code",
            "filename": "inner_join_sim.sql",
            "initialCode": "CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT, amount REAL);\nINSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');\nINSERT INTO orders VALUES (101, 1, 99.00);\n\nSELECT c.name, o.id, o.amount FROM customers c INNER JOIN orders o ON c.id = o.customer_id;",
            "expectedOutput": "name | id  | amount\n-----+-----+-------\nAlex | 101 | 99.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is customer 'Sam' omitted from the INNER JOIN query result above?",
          "expectedStringOutput": "Sam has no matching records in the orders table",
          "acceptableAnswers": [
            "Sam has no matching records in the orders table",
            "No orders for Sam",
            "Sam has no orders",
            "No matching order"
          ],
          "primaryMisconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
          "diagnosisMap": {
            "Sam is deleted": {
              "misconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
              "errorExplanation": "INNER JOIN returns only rows that have matching counterparts in both tables. Sam has zero orders, so Sam is excluded.",
              "recoveryPath": {
                "simplerExplanation": "INNER JOIN only retains matching pairs.",
                "guidedFixPrompt": "Type Sam has no matching records in the orders table"
              }
            }
          }
        }
      },
      {
        "id": "sql-d11-b2-table-aliasing",
        "day": 11,
        "blockNumber": 2,
        "title": "Disambiguating Column Names with Table Aliases",
        "conceptBudget": {
          "primaryConcept": "Column Disambiguation",
          "supportingTerms": [
            "`c.id` vs `o.id`",
            "Ambiguous Column Name Error"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d11-b1-inner-join-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Ambiguous Column Name Error",
              "brokenCode": "-- ❌ Buggy: Both tables have 'id' column -> SQL throws 'ambiguous column name: id'!\nSELECT id, name, total_amount\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;",
              "fixedCode": "-- ✅ Correct: Explicitly qualify which table's id to project\nSELECT c.id AS customer_id, o.id AS order_id, name, total_amount\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id;",
              "errorLine": 2,
              "errorReason": "When multiple joined tables share identical column names, the query engine cannot guess which one you want.",
              "fixExplanation": "Prefix column names with their table alias (`c.id`, `o.id`)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "alias_sim.sql",
            "initialCode": "SELECT 'c.id AS customer_id, o.id AS order_id' AS qualified_columns;",
            "expectedOutput": "qualified_columns\n---------------------------------------\nc.id AS customer_id, o.id AS order_id",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What error occurs if you query `SELECT id FROM customers JOIN orders ON customers.id = orders.customer_id` without specifying the table prefix?",
          "options": [
            "`ambiguous column name: id` because both tables contain a column named `id`",
            "The database crashes",
            "The database returns both IDs concatenated"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
              "errorExplanation": "Ambiguous column references fail to compile because the SQL engine requires explicit table qualification.",
              "recoveryPath": {
                "simplerExplanation": "Throws ambiguous column error -> qualify with table alias.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d11-b3-join-on-vs-where",
        "day": 11,
        "blockNumber": 3,
        "title": "Join Predicates (ON) vs Post-Filter Predicates (WHERE)",
        "conceptBudget": {
          "primaryConcept": "ON vs WHERE Semantics",
          "supportingTerms": [
            "ON defines relational linkage",
            "WHERE filters combined joined dataset"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d11-b2-table-aliasing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "join_filter_sim.sql",
            "initialCode": "CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT, amount REAL, status TEXT);\nINSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');\nINSERT INTO orders VALUES (101, 1, 250.0, 'COMPLETED'), (102, 1, 50.0, 'CANCELLED');\n\nSELECT c.name, o.id, o.amount\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'COMPLETED';",
            "expectedOutput": "name | id  | amount\n-----+-----+-------\nAlex | 101 | 250.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What order ID is returned when filtering `WHERE o.status = 'COMPLETED'`?",
          "expectedStringOutput": "101",
          "acceptableAnswers": [
            "101",
            "id: 101",
            "Alex | 101 | 250.0"
          ],
          "primaryMisconceptionId": "MC_SQL_JOIN_ON_VS_WHERE",
          "diagnosisMap": {
            "102": {
              "misconceptionId": "MC_SQL_JOIN_ON_VS_WHERE",
              "errorExplanation": "Order 102 was CANCELLED, so only order 101 matches the WHERE clause.",
              "recoveryPath": {
                "simplerExplanation": "Only COMPLETED order 101 is returned.",
                "guidedFixPrompt": "Type 101"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "LEFT OUTER JOIN & Handling Missing Parent/Child Records",
    "overviewMetaphor": "LEFT JOIN is a classroom attendance sheet: every registered student on the roster (Left Table) gets a row on the paper, even if they were absent today (no matching records in Right Table)—their attendance checkbox simply displays blank / NULL.",
    "blocks": [
      {
        "id": "sql-d12-b1-left-join-concept",
        "day": 12,
        "blockNumber": 1,
        "title": "LEFT JOIN: Preserving Unmatched Left-Table Rows",
        "conceptBudget": {
          "primaryConcept": "LEFT OUTER JOIN",
          "supportingTerms": [
            "Preserves all Left rows",
            "NULL padding on Right table",
            "Finding non-purchasers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d11-b1-inner-join-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "LEFT JOIN Syntax",
            "codeSnippet": "SELECT\n  c.name,\n  o.id AS order_id,\n  COALESCE(o.total_amount, 0.0) AS spent\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;",
            "lineNotes": {
              "4": "All customers are returned regardless of whether they have orders.",
              "5": "If customer has no order, o.id and o.total_amount are NULL."
            }
          },
          {
            "type": "runnable_code",
            "filename": "left_join_sim.sql",
            "initialCode": "CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT, amount REAL);\nINSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');\nINSERT INTO orders VALUES (101, 1, 99.00);\n\nSELECT c.name, o.id AS order_id, COALESCE(o.amount, 0.0) AS spent\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nORDER BY c.id ASC;",
            "expectedOutput": "name | order_id | spent\n-----+----------+------\nAlex | 101      | 99.0\nSam  | NULL     | 0.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value does `spent` display for 'Sam' who has zero orders when using `COALESCE(o.amount, 0.0)`?",
          "expectedStringOutput": "0.0",
          "acceptableAnswers": [
            "0.0",
            "0",
            "spent: 0.0"
          ],
          "primaryMisconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
          "diagnosisMap": {
            "NULL": {
              "misconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
              "errorExplanation": "COALESCE converted the NULL amount into 0.0.",
              "recoveryPath": {
                "simplerExplanation": "COALESCE turns NULL into 0.0.",
                "guidedFixPrompt": "Type 0.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d12-b2-finding-orphan-rows",
        "day": 12,
        "blockNumber": 2,
        "title": "Finding Inactive Records with `WHERE right.id IS NULL`",
        "conceptBudget": {
          "primaryConcept": "Anti-Join Pattern",
          "supportingTerms": [
            "WHERE right.id IS NULL",
            "Find users who never ordered"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d12-b1-left-join-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "antijoin_sim.sql",
            "initialCode": "CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT);\nINSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam'), (3, 'Pat');\nINSERT INTO orders VALUES (101, 1), (102, 3);\n\n-- Find customers who never made a single order\nSELECT c.name FROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;",
            "expectedOutput": "name\n----\nSam",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which customer is returned as having zero orders using `WHERE o.id IS NULL`?",
          "expectedStringOutput": "Sam",
          "acceptableAnswers": [
            "Sam",
            "name: Sam"
          ],
          "primaryMisconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
          "diagnosisMap": {
            "Alex": {
              "misconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
              "errorExplanation": "Alex has order 101, so Alex is NOT null. Only Sam has 0 orders.",
              "recoveryPath": {
                "simplerExplanation": "Only Sam has zero orders.",
                "guidedFixPrompt": "Type Sam"
              }
            }
          }
        }
      },
      {
        "id": "sql-d12-b3-group-by-left-join",
        "day": 12,
        "blockNumber": 3,
        "title": "GROUP BY with LEFT JOIN Aggregations",
        "conceptBudget": {
          "primaryConcept": "LEFT JOIN Aggregations",
          "supportingTerms": [
            "COUNT(o.id) vs COUNT(*)",
            "Accurate 0 count for inactive users"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d12-b2-finding-orphan-rows",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "COUNT(*) vs COUNT(o.id) on LEFT JOIN",
              "brokenCode": "-- ❌ Buggy: COUNT(*) counts the NULL-padded row, giving Sam 1 order!\nSELECT c.name, COUNT(*) AS orders_count\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name;",
              "fixedCode": "-- ✅ Correct: COUNT(o.id) skips NULL, giving Sam 0 orders accurately!\nSELECT c.name, COUNT(o.id) AS orders_count\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name;",
              "errorLine": 2,
              "errorReason": "COUNT(*) counts the single NULL row that LEFT JOIN produced for Sam, mistakenly reporting 1 order.",
              "fixExplanation": "Always count the right-table primary key `COUNT(o.id)` when aggregating across LEFT JOINs."
            }
          },
          {
            "type": "runnable_code",
            "filename": "left_count_sim.sql",
            "initialCode": "CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT);\nINSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');\nINSERT INTO orders VALUES (101, 1);\n\nSELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name\nORDER BY c.id ASC;",
            "expectedOutput": "name | order_count\n-----+------------\nAlex | 1\nSam  | 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Using `COUNT(o.id)`, what is Sam's order count?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "Sam | 0",
            "order_count: 0"
          ],
          "primaryMisconceptionId": "MC_SQL_COUNT_NULL_BEHAVIOR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_COUNT_NULL_BEHAVIOR",
              "errorExplanation": "COUNT(o.id) correctly ignores the NULL right-table entry, yielding 0.",
              "recoveryPath": {
                "simplerExplanation": "Sam has 0 orders.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Self Joins & Multi-Table Relational Graphs",
    "overviewMetaphor": "A self join is looking at a company organization chart: every employee and every manager is listed in the exact same Employee Directory table; a Self Join simply opens two copies of the same directory side-by-side to connect Employee A with Manager B.",
    "blocks": [
      {
        "id": "sql-d13-b1-self-join-hierarchy",
        "day": 13,
        "blockNumber": 1,
        "title": "Self Joins: Joining a Table to Itself (`e` and `m`)",
        "conceptBudget": {
          "primaryConcept": "Self Join",
          "supportingTerms": [
            "Hierarchy Traversal",
            "e.manager_id = m.id",
            "Top Executive NULL Manager"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d12-b1-left-join-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Self Join Syntax",
            "codeSnippet": "SELECT\n  e.name AS employee_name,\n  COALESCE(m.name, 'TOP_LEVEL_CEO') AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;",
            "lineNotes": {
              "4": "Table alias 'e' represents the individual worker.",
              "5": "Table alias 'm' represents the supervising manager from the same table."
            }
          },
          {
            "type": "runnable_code",
            "filename": "self_join_sim.sql",
            "initialCode": "CREATE TABLE staff (id INT PRIMARY KEY, name TEXT, manager_id INT);\nINSERT INTO staff VALUES (1, 'CEO Alex', NULL), (2, 'Lead Sarah', 1), (3, 'Eng Pat', 2);\n\nSELECT e.name AS worker, COALESCE(m.name, 'CEO') AS boss\nFROM staff e\nLEFT JOIN staff m ON e.manager_id = m.id\nORDER BY e.id ASC;",
            "expectedOutput": "worker     | boss\n-----------+-----------\nCEO Alex   | CEO\nLead Sarah | CEO Alex\nEng Pat    | Lead Sarah",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who is the boss of 'Eng Pat' in the self join hierarchy above?",
          "expectedStringOutput": "Lead Sarah",
          "acceptableAnswers": [
            "Lead Sarah",
            "boss: Lead Sarah"
          ],
          "primaryMisconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
          "diagnosisMap": {
            "CEO Alex": {
              "misconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
              "errorExplanation": "Eng Pat's manager_id is 2, which maps to Lead Sarah.",
              "recoveryPath": {
                "simplerExplanation": "Manager ID 2 is Lead Sarah.",
                "guidedFixPrompt": "Type Lead Sarah"
              }
            }
          }
        }
      },
      {
        "id": "sql-d13-b2-three-table-joins",
        "day": 13,
        "blockNumber": 2,
        "title": "Three-Table E-Commerce Joins (Orders -> Items -> Products)",
        "conceptBudget": {
          "primaryConcept": "Multi-Table Relational Chain",
          "supportingTerms": [
            "Chained INNER JOINs",
            "Junction Resolution",
            "Total Line Value"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d13-b1-self-join-hierarchy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "three_table_sim.sql",
            "initialCode": "CREATE TABLE orders (id INT, code TEXT);\nCREATE TABLE order_items (order_id INT, product_id INT, qty INT);\nCREATE TABLE products (id INT, title TEXT, price REAL);\nINSERT INTO orders VALUES (1, 'ORD-101');\nINSERT INTO products VALUES (50, 'Keyboard', 75.0);\nINSERT INTO order_items VALUES (1, 50, 2);\n\nSELECT o.code, p.title, (oi.qty * p.price) AS line_total\nFROM orders o\nINNER JOIN order_items oi ON o.id = oi.order_id\nINNER JOIN products p ON oi.product_id = p.id;",
            "expectedOutput": "code    | title    | line_total\n--------+----------+-----------\nORD-101 | Keyboard | 150.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `line_total` for 2 Keyboards priced at $75.0 in the 3-table join?",
          "expectedStringOutput": "150.0",
          "acceptableAnswers": [
            "150.0",
            "150",
            "line_total: 150.0"
          ],
          "primaryMisconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
          "diagnosisMap": {
            "75.0": {
              "misconceptionId": "MC_SQL_INNER_VS_LEFT_JOIN",
              "errorExplanation": "2 * 75.0 = 150.0 total line cost.",
              "recoveryPath": {
                "simplerExplanation": "2 units @ $75 = 150.0.",
                "guidedFixPrompt": "Type 150.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d13-b3-cartesian-explosion",
        "day": 13,
        "blockNumber": 3,
        "title": "Cartesian Explosion Danger: The Missing JOIN Condition",
        "conceptBudget": {
          "primaryConcept": "CROSS JOIN Explosion",
          "supportingTerms": [
            "N * M Combinations",
            "Accidental Missing ON Clause"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d13-b2-three-table-joins",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Cartesian Product Trap",
              "brokenCode": "-- ❌ Disaster: Missing ON predicate multiplies 1,000 customers * 1,000 orders = 1,000,000 rows!\nSELECT * FROM customers, orders;",
              "fixedCode": "-- ✅ Correct: Explicit ON clause constrains join to matching IDs\nSELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;",
              "errorLine": 2,
              "errorReason": "Comma joins without WHERE or ON generate a full Cartesian Cross Product.",
              "fixExplanation": "Always use explicit INNER JOIN with ON predicate."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cartesian_sim.sql",
            "initialCode": "CREATE TABLE t1 (val INT);\nCREATE TABLE t2 (val INT);\nINSERT INTO t1 VALUES (1), (2);\nINSERT INTO t2 VALUES (10), (20), (30);\n-- 2 * 3 = 6 rows generated\nSELECT COUNT(*) AS cartesian_rows FROM t1 CROSS JOIN t2;",
            "expectedOutput": "cartesian_rows\n--------------\n6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total rows are produced by a CROSS JOIN between a table with 2 rows and a table with 3 rows?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "cartesian_rows: 6"
          ],
          "primaryMisconceptionId": "MC_SQL_CROSS_JOIN_CARTESIAN_EXPLOSION",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_SQL_CROSS_JOIN_CARTESIAN_EXPLOSION",
              "errorExplanation": "Cross product is multiplicative: 2 * 3 = 6 rows.",
              "recoveryPath": {
                "simplerExplanation": "2 * 3 = 6 rows.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Set Operations: UNION vs UNION ALL & INTERSECT",
    "overviewMetaphor": "UNION vs UNION ALL is stacking two piles of business cards: `UNION ALL` simply places Stack B directly on top of Stack A in 1 millisecond (fast, preserves duplicates); `UNION` painstakingly checks every single card in the stack to throw away duplicate contacts (slower, unique set).",
    "blocks": [
      {
        "id": "sql-d14-b1-union-vs-union-all",
        "day": 14,
        "blockNumber": 1,
        "title": "UNION vs UNION ALL: Deduplication Cost & Behavior",
        "conceptBudget": {
          "primaryConcept": "Set Operations",
          "supportingTerms": [
            "UNION (Deduplicated Set)",
            "UNION ALL (Fast Append)",
            "Schema Column Compatibility"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d11-b1-inner-join-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "UNION Syntax",
            "codeSnippet": "SELECT email FROM full_time_employees\nUNION ALL\nSELECT email FROM contractors\nORDER BY email ASC;",
            "lineNotes": {
              "2": "UNION ALL retains all rows from both tables without sorting/deduplicating."
            }
          },
          {
            "type": "runnable_code",
            "filename": "union_sim.sql",
            "initialCode": "CREATE TABLE t1 (email TEXT);\nCREATE TABLE t2 (email TEXT);\nINSERT INTO t1 VALUES ('alex@pinit.ai'), ('sam@pinit.ai');\nINSERT INTO t2 VALUES ('alex@pinit.ai'), ('pat@pinit.ai');\n\nSELECT COUNT(*) AS union_count FROM (SELECT email FROM t1 UNION SELECT email FROM t2);\nSELECT COUNT(*) AS union_all_count FROM (SELECT email FROM t1 UNION ALL SELECT email FROM t2);",
            "expectedOutput": "union_count\n-----------\n3\nunion_all_count\n---------------\n4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When joining 2 lists sharing 1 duplicate email ('alex@pinit.ai'), what is `union_count` (deduplicated) vs `union_all_count`?",
          "expectedStringOutput": "union_count: 3, union_all_count: 4",
          "acceptableAnswers": [
            "union_count: 3, union_all_count: 4",
            "3 and 4",
            "3, 4",
            "3,4"
          ],
          "primaryMisconceptionId": "MC_SQL_UNION_VS_UNION_ALL",
          "diagnosisMap": {
            "4 and 4": {
              "misconceptionId": "MC_SQL_UNION_VS_UNION_ALL",
              "errorExplanation": "UNION removes the duplicate email, giving 3 rows. UNION ALL keeps all 4 rows.",
              "recoveryPath": {
                "simplerExplanation": "UNION = 3; UNION ALL = 4.",
                "guidedFixPrompt": "Type union_count: 3, union_all_count: 4"
              }
            }
          }
        }
      },
      {
        "id": "sql-d14-b2-intersect-except",
        "day": 14,
        "blockNumber": 2,
        "title": "INTERSECT and EXCEPT (Set Differences)",
        "conceptBudget": {
          "primaryConcept": "INTERSECT & EXCEPT",
          "supportingTerms": [
            "INTERSECT (Shared in Both Sets)",
            "EXCEPT (In Set A but NOT in Set B)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d14-b1-union-vs-union-all",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "intersect_sim.sql",
            "initialCode": "CREATE TABLE beta_users (id INT);\nCREATE TABLE paying_users (id INT);\nINSERT INTO beta_users VALUES (1), (2), (3);\nINSERT INTO paying_users VALUES (2), (3), (4);\n\n-- Users in BOTH beta AND paying:\nSELECT id FROM beta_users INTERSECT SELECT id FROM paying_users ORDER BY id ASC;",
            "expectedOutput": "id\n--\n2\n3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which user IDs are present in both beta_users (1,2,3) and paying_users (2,3,4)?",
          "expectedStringOutput": "id\n--\n2\n3",
          "acceptableAnswers": [
            "id\n--\n2\n3",
            "2, 3",
            "2 and 3",
            "2,3"
          ],
          "primaryMisconceptionId": "MC_SQL_UNION_VS_UNION_ALL",
          "diagnosisMap": {
            "1, 4": {
              "misconceptionId": "MC_SQL_UNION_VS_UNION_ALL",
              "errorExplanation": "INTERSECT returns the shared intersection: IDs 2 and 3.",
              "recoveryPath": {
                "simplerExplanation": "Shared IDs are 2 and 3.",
                "guidedFixPrompt": "Type 2, 3"
              }
            }
          }
        }
      },
      {
        "id": "sql-d14-b3-order-by-union",
        "day": 14,
        "blockNumber": 3,
        "title": "ORDER BY Placement in Compound Set Queries",
        "conceptBudget": {
          "primaryConcept": "Compound Sorting Rule",
          "supportingTerms": [
            "ORDER BY goes at the VERY END of the combined query",
            "Single Sort Pass"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d14-b2-intersect-except",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "order_union.sql",
            "initialCode": "CREATE TABLE t1 (name TEXT); CREATE TABLE t2 (name TEXT);\nINSERT INTO t1 VALUES ('Zack'); INSERT INTO t2 VALUES ('Aaron');\n\n-- ORDER BY sorts the combined resulting set\nSELECT name FROM t1\nUNION ALL\nSELECT name FROM t2\nORDER BY name ASC;",
            "expectedOutput": "name\n-----\nAaron\nZack",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who appears first when sorting the UNION ALL result of ('Zack') and ('Aaron') by `name ASC`?",
          "expectedStringOutput": "Aaron",
          "acceptableAnswers": [
            "Aaron",
            "name: Aaron"
          ],
          "primaryMisconceptionId": "MC_SQL_ORDER_BY_EXECUTION_ORDER",
          "diagnosisMap": {
            "Zack": {
              "misconceptionId": "MC_SQL_ORDER_BY_EXECUTION_ORDER",
              "errorExplanation": "ASC sorts alphabetically, so Aaron precedes Zack.",
              "recoveryPath": {
                "simplerExplanation": "Aaron comes first in ASC order.",
                "guidedFixPrompt": "Type Aaron"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Multi-Store Sales Reporting & Aggregation Engine",
    "overviewMetaphor": "Milestone 2 — Analytical Reporting Engine: Synthesizing multi-table joins, grouped metrics, aggregate sums, and HAVING filters into executive-level sales performance dashboards across national retail branches.",
    "blocks": [
      {
        "id": "sql-d15-b1-multi-store-joins",
        "day": 15,
        "blockNumber": 1,
        "title": "Multi-Store Relational Analytical Architecture",
        "conceptBudget": {
          "primaryConcept": "Enterprise Analytical Joins",
          "supportingTerms": [
            "Store Branches",
            "Order Transactions",
            "Grouped Sales Reporting"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d14-b1-union-vs-union-all",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Analytical Dashboard Query",
            "codeSnippet": "SELECT\n  s.branch_name,\n  COUNT(DISTINCT o.id) AS order_count,\n  SUM(o.total_amount) AS revenue,\n  ROUND(AVG(o.total_amount), 2) AS avg_ticket\nFROM stores s\nINNER JOIN orders o ON s.id = o.store_id\nGROUP BY s.id, s.branch_name\nHAVING SUM(o.total_amount) >= 5000\nORDER BY revenue DESC;",
            "lineNotes": {
              "3": "COUNT(DISTINCT o.id) avoids duplicate counting when joined to line items.",
              "8": "HAVING filters out low-performing branches."
            }
          },
          {
            "type": "runnable_code",
            "filename": "milestone2_demo.sql",
            "initialCode": "CREATE TABLE stores (id INT, branch TEXT);\nCREATE TABLE orders (id INT, store_id INT, amount REAL);\nINSERT INTO stores VALUES (1, 'Downtown NYC'), (2, 'Uptown NYC');\nINSERT INTO orders VALUES (101, 1, 6000.0), (102, 1, 4000.0), (103, 2, 2000.0);\n\nSELECT s.branch, SUM(o.amount) AS revenue\nFROM stores s\nINNER JOIN orders o ON s.id = o.store_id\nGROUP BY s.id, s.branch\nHAVING SUM(o.amount) >= 5000;",
            "expectedOutput": "branch       | revenue\n-------------+--------\nDowntown NYC | 10000.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the revenue for 'Downtown NYC' (orders $6000 + $4000)?",
          "expectedStringOutput": "10000.0",
          "acceptableAnswers": [
            "10000.0",
            "10000",
            "revenue: 10000.0"
          ],
          "primaryMisconceptionId": "MC_SQL_WHERE_VS_HAVING",
          "diagnosisMap": {
            "6000.0": {
              "misconceptionId": "MC_SQL_WHERE_VS_HAVING",
              "errorExplanation": "Downtown has two orders: 6000 + 4000 = 10000.0.",
              "recoveryPath": {
                "simplerExplanation": "6000 + 4000 = 10000.0.",
                "guidedFixPrompt": "Type 10000.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d15-b2-category-breakdown",
        "day": 15,
        "blockNumber": 2,
        "title": "Multi-Column GROUP BY Category Breakdowns",
        "conceptBudget": {
          "primaryConcept": "Multi-Column GROUP BY",
          "supportingTerms": [
            "GROUP BY store_id, category",
            "Sub-Category Inventory Valuation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d15-b1-multi-store-joins",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "category_breakdown.sql",
            "initialCode": "CREATE TABLE inventory (store TEXT, category TEXT, value REAL);\nINSERT INTO inventory VALUES ('Store A', 'TECH', 5000), ('Store A', 'FURNITURE', 2000), ('Store B', 'TECH', 3000);\n\nSELECT store, category, SUM(value) AS total_val\nFROM inventory\nGROUP BY store, category\nORDER BY store, category;",
            "expectedOutput": "store   | category  | total_val\n--------+-----------+----------\nStore A | FURNITURE | 2000.0\nStore A | TECH      | 5000.0\nStore B | TECH      | 3000.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many distinct grouped buckets are produced across Store A and Store B?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3"
          ],
          "primaryMisconceptionId": "MC_SQL_GROUP_BY_NON_AGGREGATE_COLUMN",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_SQL_GROUP_BY_NON_AGGREGATE_COLUMN",
              "errorExplanation": "Grouping by both store and category produces 3 buckets: (Store A, FURNITURE), (Store A, TECH), and (Store B, TECH).",
              "recoveryPath": {
                "simplerExplanation": "3 distinct (store, category) combinations.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "sql-d15-b3-milestone-audit-pipeline",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Certification & Performance Metrics",
        "conceptBudget": {
          "primaryConcept": "Milestone Engine Validation",
          "supportingTerms": [
            "Aggregated KPI Certification",
            "Accurate Financial Reporting"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d15-b2-category-breakdown",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_cert.sql",
            "initialCode": "SELECT 'MILESTONE_2_REPORTING_CERTIFIED' AS audit_status;",
            "expectedOutput": "audit_status\n--------------------------------\nMILESTONE_2_REPORTING_CERTIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit status string is returned upon completing Milestone 2?",
          "expectedStringOutput": "MILESTONE_2_REPORTING_CERTIFIED",
          "acceptableAnswers": [
            "MILESTONE_2_REPORTING_CERTIFIED",
            "'MILESTONE_2_REPORTING_CERTIFIED'"
          ],
          "primaryMisconceptionId": "MC_SQL_WHERE_VS_HAVING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SQL_WHERE_VS_HAVING",
              "errorExplanation": "Returns MILESTONE_2_REPORTING_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Audit status is MILESTONE_2_REPORTING_CERTIFIED.",
                "guidedFixPrompt": "Type MILESTONE_2_REPORTING_CERTIFIED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Subqueries: Scalar, Column Lists & Correlated Subqueries",
    "overviewMetaphor": "A subquery is asking a helper assistant a quick question before finishing your sentence: 'Select all employees who earn more than [Hey Assistant, what is the company average salary?]'. The assistant computes that single number in brackets, and you use it to finish your query.",
    "blocks": [
      {
        "id": "sql-d16-b1-scalar-subqueries",
        "day": 16,
        "blockNumber": 1,
        "title": "Scalar Subqueries: Single-Value Nested Computations",
        "conceptBudget": {
          "primaryConcept": "Scalar Subquery",
          "supportingTerms": [
            "Single-Row Single-Column Result",
            "WHERE col > (SELECT AVG(...))",
            "Dynamic Baselines"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d9-b2-sum-avg-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Scalar Subquery Syntax",
            "codeSnippet": "SELECT name, salary FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);",
            "lineNotes": {
              "2": "Subquery in parentheses computes company-wide average salary as a single scalar number."
            }
          },
          {
            "type": "runnable_code",
            "filename": "scalar_subquery_sim.sql",
            "initialCode": "CREATE TABLE employees (name TEXT, salary REAL);\nINSERT INTO employees VALUES ('Alex', 100000), ('Sam', 60000), ('Pat', 50000);\n-- Average is 70000 -> Only Alex earns > 70000\nSELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
            "expectedOutput": "name | salary\n-----+---------\nAlex | 100000.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "With salaries 100000, 60000, 50000 (average = 70000), who earns above average?",
          "expectedStringOutput": "Alex",
          "acceptableAnswers": [
            "Alex",
            "name: Alex"
          ],
          "primaryMisconceptionId": "MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE",
          "diagnosisMap": {
            "Sam": {
              "misconceptionId": "MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE",
              "errorExplanation": "Sam earns 60000, which is below the 70000 average. Only Alex earns > 70000.",
              "recoveryPath": {
                "simplerExplanation": "Only Alex (100000) is > 70000.",
                "guidedFixPrompt": "Type Alex"
              }
            }
          }
        }
      },
      {
        "id": "sql-d16-b2-in-subquery",
        "day": 16,
        "blockNumber": 2,
        "title": "Column-List Subqueries with `IN (SELECT id ...)`",
        "conceptBudget": {
          "primaryConcept": "IN (Subquery)",
          "supportingTerms": [
            "Matching dynamic sets",
            "WHERE id IN (SELECT ...)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d16-b1-scalar-subqueries",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "in_subquery.sql",
            "initialCode": "CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT, amount REAL);\nINSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam'), (3, 'Pat');\nINSERT INTO orders VALUES (101, 1, 500.0), (102, 3, 300.0);\n\n-- Find customers who made orders > $400\nSELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE amount > 400);",
            "expectedOutput": "name\n----\nAlex",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which customer made an order with amount > 400?",
          "expectedStringOutput": "Alex",
          "acceptableAnswers": [
            "Alex",
            "name: Alex"
          ],
          "primaryMisconceptionId": "MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE",
          "diagnosisMap": {
            "Pat": {
              "misconceptionId": "MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE",
              "errorExplanation": "Pat's order was 300 (< 400). Only Alex's order was 500.",
              "recoveryPath": {
                "simplerExplanation": "Only Alex had an order > 400.",
                "guidedFixPrompt": "Type Alex"
              }
            }
          }
        }
      },
      {
        "id": "sql-d16-b3-correlated-subqueries",
        "day": 16,
        "blockNumber": 3,
        "title": "Correlated Subqueries & Departmental Comparisons",
        "conceptBudget": {
          "primaryConcept": "Correlated Subquery",
          "supportingTerms": [
            "References Outer Table (`WHERE dept = e.dept`)",
            "Per-Row Subquery Execution"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d16-b2-in-subquery",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Correlated Subquery Syntax",
            "codeSnippet": "SELECT e.name, e.salary, e.dept\nFROM employees e\nWHERE e.salary > (\n  SELECT AVG(salary) FROM employees WHERE dept = e.dept\n);",
            "lineNotes": {
              "4": "'WHERE dept = e.dept' links the inner subquery dynamically to the current outer row."
            }
          },
          {
            "type": "runnable_code",
            "filename": "correlated_sim.sql",
            "initialCode": "CREATE TABLE employees (name TEXT, dept TEXT, salary REAL);\nINSERT INTO employees VALUES ('Alex', 'ENG', 120000), ('Sam', 'ENG', 80000), ('Pat', 'HR', 60000);\n-- ENG avg is 100000 -> Alex is above ENG avg\nSELECT e.name FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE dept = e.dept);",
            "expectedOutput": "name\n----\nAlex",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What makes a subquery 'Correlated'?",
          "options": [
            "It references columns from the outer query table, executing dynamically for each candidate row evaluated by the outer query",
            "It runs only on Sundays",
            "It uses the UNION keyword"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_SUBQUERY_CORRELATED_PERFORMANCE",
              "errorExplanation": "Correlated subqueries depend on values from the outer query row.",
              "recoveryPath": {
                "simplerExplanation": "References outer query columns per row.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Common Table Expressions (WITH CTEs & Recursive CTEs)",
    "overviewMetaphor": "A CTE is preparing ingredients in labeled glass bowls before cooking: instead of creating one massive, unreadable 10-level nested subquery lasagna, you prepare `WITH HighSpenders AS (...)` and `WITH ActiveStores AS (...)` first, and then cleanly assemble them in your final SELECT.",
    "blocks": [
      {
        "id": "sql-d17-b1-cte-syntax",
        "day": 17,
        "blockNumber": 1,
        "title": "The WITH Clause: Named Modular Subqueries",
        "conceptBudget": {
          "primaryConcept": "Common Table Expressions (CTEs)",
          "supportingTerms": [
            "WITH CTE_Name AS (SELECT ...)",
            "Query Readability",
            "Temporary Query Scope"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d16-b1-scalar-subqueries",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CTE Syntax",
            "codeSnippet": "WITH CustomerTotals AS (\n  SELECT customer_id, SUM(total_amount) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT c.name, ct.total_spent\nFROM customers c\nINNER JOIN CustomerTotals ct ON c.id = ct.customer_id\nWHERE ct.total_spent >= 500;",
            "lineNotes": {
              "1": "Defines named temporary result set 'CustomerTotals'.",
              "6": "Main query treats CustomerTotals just like a regular physical table."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cte_sim.sql",
            "initialCode": "CREATE TABLE customers (id INT, name TEXT);\nCREATE TABLE orders (id INT, customer_id INT, amount REAL);\nINSERT INTO customers VALUES (1, 'Alex'), (2, 'Sam');\nINSERT INTO orders VALUES (101, 1, 300), (102, 1, 300), (103, 2, 100);\n\nWITH CustomerTotals AS (\n  SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id\n)\nSELECT c.name, ct.total_spent\nFROM customers c\nINNER JOIN CustomerTotals ct ON c.id = ct.customer_id\nWHERE ct.total_spent >= 500;",
            "expectedOutput": "name | total_spent\n-----+------------\nAlex | 600.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What total_spent is reported for Alex (orders 300 + 300) in the CTE query?",
          "expectedStringOutput": "600.0",
          "acceptableAnswers": [
            "600.0",
            "600",
            "total_spent: 600.0"
          ],
          "primaryMisconceptionId": "MC_SQL_CTE_WITH_RECURSIVE",
          "diagnosisMap": {
            "300.0": {
              "misconceptionId": "MC_SQL_CTE_WITH_RECURSIVE",
              "errorExplanation": "Alex has two orders of 300 each: 300 + 300 = 600.0.",
              "recoveryPath": {
                "simplerExplanation": "300 + 300 = 600.0.",
                "guidedFixPrompt": "Type 600.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d17-b2-chaining-multiple-ctes",
        "day": 17,
        "blockNumber": 2,
        "title": "Chaining Multiple CTEs in a Single Statement",
        "conceptBudget": {
          "primaryConcept": "Chained CTEs",
          "supportingTerms": [
            "WITH Step1 AS (...), Step2 AS (...)",
            "Multi-Stage ETL Pipelines"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d17-b1-cte-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Multiple CTEs Syntax",
            "codeSnippet": "WITH\n  StepOne AS (SELECT ...),\n  StepTwo AS (SELECT ... FROM StepOne)\nSELECT * FROM StepTwo;",
            "lineNotes": {
              "2": "First CTE defined.",
              "3": "Comma separates subsequent CTEs without repeating the 'WITH' keyword."
            }
          },
          {
            "type": "runnable_code",
            "filename": "multi_cte.sql",
            "initialCode": "WITH\n  BaseNumbers AS (SELECT 10 AS a, 20 AS b),\n  Calculated AS (SELECT (a + b) AS total FROM BaseNumbers)\nSELECT total * 2 AS doubled FROM Calculated;",
            "expectedOutput": "doubled\n-------\n60",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `doubled` when total (10 + 20 = 30) is multiplied by 2?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "doubled: 60"
          ],
          "primaryMisconceptionId": "MC_SQL_CTE_WITH_RECURSIVE",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_SQL_CTE_WITH_RECURSIVE",
              "errorExplanation": "30 * 2 = 60.",
              "recoveryPath": {
                "simplerExplanation": "Doubled is 60.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      },
      {
        "id": "sql-d17-b3-recursive-ctes",
        "day": 17,
        "blockNumber": 3,
        "title": "Recursive CTEs: Hierarchies and Sequence Generation",
        "conceptBudget": {
          "primaryConcept": "Recursive CTE",
          "supportingTerms": [
            "WITH RECURSIVE",
            "Anchor Member UNION ALL Recursive Member",
            "Termination Condition"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d17-b2-chaining-multiple-ctes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Recursive CTE Anatomy",
            "codeSnippet": "WITH RECURSIVE NumberSequence(n) AS (\n  SELECT 1              -- 1. Anchor Member (Initial Seed)\n  UNION ALL\n  SELECT n + 1          -- 2. Recursive Member (Iterative Step)\n  FROM NumberSequence\n  WHERE n < 5           -- 3. Termination Condition\n)\nSELECT n FROM NumberSequence;",
            "lineNotes": {
              "2": "Seed row starts with 1.",
              "4": "Iteratively increments n until n reaches 5."
            }
          },
          {
            "type": "runnable_code",
            "filename": "recursive_sim.sql",
            "initialCode": "WITH RECURSIVE Seq(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM Seq WHERE n < 3\n)\nSELECT n FROM Seq;",
            "expectedOutput": "n\n-\n1\n2\n3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many numbers (1, 2, 3) are output by the recursive CTE terminating at `n < 3`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3"
          ],
          "primaryMisconceptionId": "MC_SQL_CTE_WITH_RECURSIVE",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_SQL_CTE_WITH_RECURSIVE",
              "errorExplanation": "Seed 1 yields 1, then 2 (2 < 3), then 3. Output is 1, 2, 3 (count is 3).",
              "recoveryPath": {
                "simplerExplanation": "Generates 1, 2, 3 -> 3 rows.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Window Functions: ROW_NUMBER(), RANK() & DENSE_RANK()",
    "overviewMetaphor": "Window functions are an Olympics leaderboard: `ROW_NUMBER()` stamps a unique number on every jersey (1, 2, 3, 4); `RANK()` awards tied runners bronze but skips 4th place (1, 2, 2, 4); `DENSE_RANK()` awards tied runners bronze and assigns the next runner 3rd place without gaps (1, 2, 2, 3).",
    "blocks": [
      {
        "id": "sql-d18-b1-window-concept",
        "day": 18,
        "blockNumber": 1,
        "title": "The Window Function Anatomy (OVER Clause & PARTITION BY)",
        "conceptBudget": {
          "primaryConcept": "Window Functions",
          "supportingTerms": [
            "OVER Clause",
            "PARTITION BY (Window Grouping)",
            "ORDER BY (Window Sorting)",
            "Preserves Individual Rows"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d10-b1-group-by-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Highlighting Pen vs a Blender",
            "simpleExplanation": "GROUP BY is a blender that pulverizes 10 rows into 1 single aggregate smoothie. Window functions are a highlighting pen that writes rankings next to each original row without destroying any data."
          },
          {
            "type": "syntax_anatomy",
            "title": "Window Function Anatomy",
            "codeSnippet": "SELECT\n  name,\n  department,\n  salary,\n  ROW_NUMBER() OVER(PARTITION BY department ORDER BY salary DESC) AS rank_in_dept\nFROM employees;",
            "lineNotes": {
              "4": "Calculates a sequential rank starting from 1 for each department independently."
            }
          },
          {
            "type": "runnable_code",
            "filename": "window_sim.sql",
            "initialCode": "CREATE TABLE employees (name TEXT, dept TEXT, salary REAL);\nINSERT INTO employees VALUES ('Alex', 'ENG', 120000), ('Sam', 'ENG', 90000), ('Pat', 'HR', 70000);\n\nSELECT name, dept, ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) AS seq FROM employees;",
            "expectedOutput": "name | dept | seq\n-----+------+----\nAlex | ENG  | 1\nSam  | ENG  | 2\nPat  | HR   | 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `seq` for 'Pat' in the HR department (the only HR employee)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "seq: 1"
          ],
          "primaryMisconceptionId": "MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK",
              "errorExplanation": "PARTITION BY dept resets the ranking counter for HR, so Pat starts at 1.",
              "recoveryPath": {
                "simplerExplanation": "Resets to 1 per department partition.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "sql-d18-b2-rank-vs-dense-rank",
        "day": 18,
        "blockNumber": 2,
        "title": "RANK() vs DENSE_RANK(): Gaps in Ties",
        "conceptBudget": {
          "primaryConcept": "Tie Breaking in Rankings",
          "supportingTerms": [
            "RANK leaves gaps (1, 2, 2, 4)",
            "DENSE_RANK has no gaps (1, 2, 2, 3)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d18-b1-window-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rank_ties.sql",
            "initialCode": "CREATE TABLE scores (name TEXT, score INT);\nINSERT INTO scores VALUES ('A', 100), ('B', 90), ('C', 90), ('D', 80);\n\nSELECT name, score,\n  RANK() OVER(ORDER BY score DESC) AS rk,\n  DENSE_RANK() OVER(ORDER BY score DESC) AS dense_rk\nFROM scores;",
            "expectedOutput": "name | score | rk | dense_rk\n-----+-------+----+---------\nA    | 100   | 1  | 1\nB    | 90    | 2  | 2\nC    | 90    | 2  | 2\nD    | 80    | 4  | 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "For player 'D' (score 80 after two tied players at rank 2), what is RANK (`rk`) vs DENSE_RANK (`dense_rk`)?",
          "expectedStringOutput": "rk: 4, dense_rk: 3",
          "acceptableAnswers": [
            "rk: 4, dense_rk: 3",
            "4 and 3",
            "4, 3",
            "4,3"
          ],
          "primaryMisconceptionId": "MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK",
          "diagnosisMap": {
            "3 and 4": {
              "misconceptionId": "MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK",
              "errorExplanation": "RANK skips to 4 due to the tie. DENSE_RANK advances sequentially without gaps to 3.",
              "recoveryPath": {
                "simplerExplanation": "RANK = 4 (gap); DENSE_RANK = 3 (no gap).",
                "guidedFixPrompt": "Type rk: 4, dense_rk: 3"
              }
            }
          }
        }
      },
      {
        "id": "sql-d18-b3-top-n-per-category",
        "day": 18,
        "blockNumber": 3,
        "title": "The Top-N Per Category Pattern (CTE + ROW_NUMBER)",
        "conceptBudget": {
          "primaryConcept": "Top-N Pattern",
          "supportingTerms": [
            "WHERE row_num <= 3",
            "Extract Top 1 Salary in Each Dept"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d18-b2-rank-vs-dense-rank",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Top-1 Per Department Pattern",
            "codeSnippet": "WITH RankedStaff AS (\n  SELECT name, dept, salary,\n    ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) AS rn\n  FROM employees\n)\nSELECT name, dept, salary FROM RankedStaff WHERE rn = 1;",
            "lineNotes": {
              "3": "Assigns ranks per department.",
              "6": "Filters top earner in each department (rn = 1)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "top1_sim.sql",
            "initialCode": "CREATE TABLE staff (name TEXT, dept TEXT, salary REAL);\nINSERT INTO staff VALUES ('Alex', 'ENG', 120000), ('Sam', 'ENG', 80000), ('Pat', 'HR', 70000);\n\nWITH Ranked AS (\n  SELECT name, dept, salary, ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) AS rn FROM staff\n)\nSELECT name, dept, salary FROM Ranked WHERE rn = 1 ORDER BY dept ASC;",
            "expectedOutput": "name | dept | salary\n-----+------+---------\nAlex | ENG  | 120000.0\nPat  | HR   | 70000.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who is the #1 highest paid employee in ENG in the Top-N query above?",
          "expectedStringOutput": "Alex",
          "acceptableAnswers": [
            "Alex",
            "name: Alex"
          ],
          "primaryMisconceptionId": "MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK",
          "diagnosisMap": {
            "Sam": {
              "misconceptionId": "MC_SQL_ROW_NUMBER_VS_RANK_VS_DENSE_RANK",
              "errorExplanation": "Alex earns 120000 while Sam earns 80000. Alex is #1.",
              "recoveryPath": {
                "simplerExplanation": "Alex has highest salary in ENG.",
                "guidedFixPrompt": "Type Alex"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Window Aggregates: Running Totals & Moving Averages (OVER)",
    "overviewMetaphor": "A running total window aggregate is an odometer in your car: every mile you drive (each transaction row), the odometer immediately rolls forward to display your new cumulative total mileage from Day 1 to the current moment.",
    "blocks": [
      {
        "id": "sql-d19-b1-running-total-syntax",
        "day": 19,
        "blockNumber": 1,
        "title": "Cumulative Running Totals with `SUM() OVER(ORDER BY ...)`",
        "conceptBudget": {
          "primaryConcept": "Running Total Window",
          "supportingTerms": [
            "SUM(amount) OVER (ORDER BY date)",
            "Cumulative Balance Traversal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d18-b1-window-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Running Total Syntax",
            "codeSnippet": "SELECT\n  id,\n  created_at,\n  amount,\n  SUM(amount) OVER(ORDER BY created_at ASC) AS running_balance\nFROM transactions;",
            "lineNotes": {
              "4": "Computes cumulative sum from beginning of history up to each row."
            }
          },
          {
            "type": "runnable_code",
            "filename": "running_sum.sql",
            "initialCode": "CREATE TABLE txs (id INT, amount REAL);\nINSERT INTO txs VALUES (1, 100), (2, 50), (3, 200);\n\nSELECT id, amount, SUM(amount) OVER(ORDER BY id ASC) AS running_total FROM txs;",
            "expectedOutput": "id | amount | running_total\n---+--------+--------------\n1  | 100.0  | 100.0\n2  | 50.0   | 150.0\n3  | 200.0  | 350.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `running_total` for transaction 3 (after 100 + 50 + 200)?",
          "expectedStringOutput": "350.0",
          "acceptableAnswers": [
            "350.0",
            "350",
            "running_total: 350.0"
          ],
          "primaryMisconceptionId": "MC_SQL_WINDOW_FUNCTION_OVER_PARTITION",
          "diagnosisMap": {
            "200.0": {
              "misconceptionId": "MC_SQL_WINDOW_FUNCTION_OVER_PARTITION",
              "errorExplanation": "Running total accumulates previous rows: 100 + 50 + 200 = 350.0.",
              "recoveryPath": {
                "simplerExplanation": "100 + 50 + 200 = 350.0.",
                "guidedFixPrompt": "Type 350.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d19-b2-frame-specifications",
        "day": 19,
        "blockNumber": 2,
        "title": "Window Frame Specifications: `ROWS BETWEEN ...`",
        "conceptBudget": {
          "primaryConcept": "Window Frame Bounds",
          "supportingTerms": [
            "UNBOUNDED PRECEDING",
            "CURRENT ROW",
            "N PRECEDING (Moving Windows)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d19-b1-running-total-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "moving_avg.sql",
            "initialCode": "CREATE TABLE daily_sales (day INT, sales REAL);\nINSERT INTO daily_sales VALUES (1, 10), (2, 20), (3, 30);\n\n-- Moving 2-day average (yesterday + today)\nSELECT day, sales,\n  ROUND(AVG(sales) OVER(ORDER BY day ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 1) AS moving_avg_2\nFROM daily_sales;",
            "expectedOutput": "day | sales | moving_avg_2\n----+-------+-------------\n1   | 10.0  | 10.0\n2   | 20.0  | 15.0\n3   | 30.0  | 25.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "On Day 3 (sales = 30, preceded by Day 2 sales = 20), what is `moving_avg_2` ((20 + 30) / 2)?",
          "expectedStringOutput": "25.0",
          "acceptableAnswers": [
            "25.0",
            "25",
            "moving_avg_2: 25.0"
          ],
          "primaryMisconceptionId": "MC_SQL_WINDOW_FUNCTION_OVER_PARTITION",
          "diagnosisMap": {
            "20.0": {
              "misconceptionId": "MC_SQL_WINDOW_FUNCTION_OVER_PARTITION",
              "errorExplanation": "(20 + 30) / 2 = 25.0.",
              "recoveryPath": {
                "simplerExplanation": "(20 + 30) / 2 = 25.0.",
                "guidedFixPrompt": "Type 25.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d19-b3-lag-and-lead",
        "day": 19,
        "blockNumber": 3,
        "title": "Period-Over-Period Growth with LAG() and LEAD()",
        "conceptBudget": {
          "primaryConcept": "LAG / LEAD Functions",
          "supportingTerms": [
            "LAG(col, 1) (Previous Row)",
            "LEAD(col, 1) (Next Row)",
            "Growth Differencing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d19-b2-frame-specifications",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lag_sim.sql",
            "initialCode": "CREATE TABLE monthly (month INT, revenue REAL);\nINSERT INTO monthly VALUES (1, 1000), (2, 1500);\n\nSELECT month, revenue,\n  LAG(revenue, 1) OVER(ORDER BY month) AS prev_month,\n  (revenue - LAG(revenue, 1) OVER(ORDER BY month)) AS growth\nFROM monthly;",
            "expectedOutput": "month | revenue | prev_month | growth\n------+---------+------------+-------\n1     | 1000.0  | NULL       | NULL\n2     | 1500.0  | 1000.0     | 500.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `growth` in month 2 ($1500 - $1000)?",
          "expectedStringOutput": "500.0",
          "acceptableAnswers": [
            "500.0",
            "500",
            "growth: 500.0"
          ],
          "primaryMisconceptionId": "MC_SQL_WINDOW_FUNCTION_OVER_PARTITION",
          "diagnosisMap": {
            "1500.0": {
              "misconceptionId": "MC_SQL_WINDOW_FUNCTION_OVER_PARTITION",
              "errorExplanation": "1500.0 - 1000.0 = 500.0 net growth.",
              "recoveryPath": {
                "simplerExplanation": "Growth is 500.0.",
                "guidedFixPrompt": "Type 500.0"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Database Indexing: B-Tree Indexes & Composite Index Strategy",
    "overviewMetaphor": "A B-Tree Index is the index at the back of a 1,000-page textbook: without an index, finding the word 'Transaction' forces you to flip through every single page from page 1 to 1,000 (Full Table Scan $O(N)$); with the index, you look up 'T', flip directly to page 842 in 2 seconds ($O(log N)$).",
    "blocks": [
      {
        "id": "sql-d20-b1-btree-internals",
        "day": 20,
        "blockNumber": 1,
        "title": "How B-Tree Indexes Work (O(log N) vs O(N) Table Scans)",
        "conceptBudget": {
          "primaryConcept": "B-Tree Indexing",
          "supportingTerms": [
            "Balanced Search Tree",
            "Binary Traversal",
            "Full Table Scan vs Index Seek"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d1-b2-primary-vs-candidate-keys",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CREATE INDEX Syntax",
            "codeSnippet": "CREATE INDEX idx_customers_email ON customers(email);\nCREATE UNIQUE INDEX idx_users_ssn ON users(ssn);",
            "lineNotes": {
              "1": "Builds a B-Tree sorted by email pointers for rapid lookups."
            }
          },
          {
            "type": "runnable_code",
            "filename": "index_sim.sql",
            "initialCode": "CREATE TABLE users (id INT, email TEXT);\nCREATE INDEX idx_users_email ON users(email);\nINSERT INTO users VALUES (1, 'alex@pinit.ai');\nSELECT name, sql FROM sqlite_master WHERE type='index' AND name='idx_users_email';",
            "expectedOutput": "name            | sql\n----------------+-------------------------------------------------\nidx_users_email | CREATE INDEX idx_users_email ON users(email)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the time complexity of searching a record in a table with 1,000,000 rows using a B-Tree index vs no index?",
          "options": [
            "With Index: O(log N) (~20 operations); Without Index: O(N) (1,000,000 operations)",
            "Without Index is faster",
            "Both take O(1) time"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
              "errorExplanation": "B-Tree indexes reduce search complexity from linear scan O(N) to logarithmic seek O(log N).",
              "recoveryPath": {
                "simplerExplanation": "Index gives O(log N) logarithmic lookup speed.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d20-b2-composite-index-order",
        "day": 20,
        "blockNumber": 2,
        "title": "The Leftmost Prefix Rule in Composite Indexes",
        "conceptBudget": {
          "primaryConcept": "Composite Index Strategy",
          "supportingTerms": [
            "CREATE INDEX idx_name ON tbl(colA, colB)",
            "Leftmost Prefix Rule",
            "Unusable Index on colB alone"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d20-b1-btree-internals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Phonebook Sorted by (LastName, FirstName)",
            "simpleExplanation": "A phonebook sorted by (LastName, FirstName) lets you instantly find 'Smith, John' or all 'Smiths'. But if you only know the first name 'John', the phonebook ordering is completely useless and you must scan every page."
          },
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Composite Index Column Order",
              "brokenCode": "-- ⚠️ Index on (customer_id, created_at) CANNOT accelerate query on created_at alone!\nSELECT * FROM orders WHERE created_at = '2026-08-24';",
              "fixedCode": "-- ✅ Accelerates queries filtering on customer_id OR (customer_id AND created_at)\nSELECT * FROM orders WHERE customer_id = 42 AND created_at = '2026-08-24';",
              "errorLine": 2,
              "errorReason": "Composite B-Trees are sorted by column A first; column B is only sorted within ties of column A.",
              "fixExplanation": "Ensure your WHERE clause includes the leftmost column of composite indexes."
            }
          },
          {
            "type": "runnable_code",
            "filename": "composite_idx.sql",
            "initialCode": "CREATE TABLE orders (id INT, customer_id INT, created_at TEXT);\nCREATE INDEX idx_orders_cust_date ON orders(customer_id, created_at DESC);\nSELECT 'INDEX_CREATED_SUCCESS' AS status;",
            "expectedOutput": "status\n---------------------\nINDEX_CREATED_SUCCESS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "If you create an index on `(department, salary)`, can the query `SELECT * FROM staff WHERE salary > 50000` (without department) use the index effectively?",
          "options": [
            "No, because the leftmost prefix (department) is missing from the query filter",
            "Yes, column order in composite indexes makes no difference",
            "Only on SQLite"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_COMPOSITE_INDEX_COLUMN_ORDER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_COMPOSITE_INDEX_COLUMN_ORDER",
              "errorExplanation": "Composite indexes strictly require the leftmost column to be filtered; otherwise the engine falls back to a full scan.",
              "recoveryPath": {
                "simplerExplanation": "Leftmost prefix rule: must filter on first indexed column.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d20-b3-write-overhead-tradeoff",
        "day": 20,
        "blockNumber": 3,
        "title": "The Write Overhead Trade-off of Indexes",
        "conceptBudget": {
          "primaryConcept": "Index Maintenance Cost",
          "supportingTerms": [
            "Faster Reads vs Slower Writes",
            "B-Tree Rebalancing on INSERT/UPDATE/DELETE"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d20-b2-composite-index-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "index_tradeoff.js",
            "initialCode": "function evaluateIndexCost(indexCount) {\n  return {\n    readSpeed: 'O(log N) FAST',\n    insertOverhead: `Must update ${indexCount} B-Tree structures on every INSERT`\n  };\n}\n\nconsole.log(JSON.stringify(evaluateIndexCost(5)));",
            "expectedOutput": "{\"readSpeed\":\"O(log N) FAST\",\"insertOverhead\":\"Must update 5 B-Tree structures on every INSERT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why shouldn't you add an index on every single column in a high-throughput database table?",
          "options": [
            "Every index adds write overhead because the database must rebalance all B-Trees on every INSERT, UPDATE, and DELETE",
            "Because tables can only have 1 index",
            "Because indexes delete table data"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
              "errorExplanation": "Indexes accelerate read queries at the expense of disk storage and slower write latency.",
              "recoveryPath": {
                "simplerExplanation": "Every index slows down writes due to B-Tree updates.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Enterprise Query Optimizer & Execution Plan Auditor",
    "overviewMetaphor": "Milestone 3 — Query Plan Diagnostics: Using `EXPLAIN QUERY PLAN` as an X-Ray machine to inspect whether queries perform blazing-fast Index Seeks (`SEARCH TABLE USING INDEX`) or catastrophic Full Table Scans (`SCAN TABLE`).",
    "blocks": [
      {
        "id": "sql-d21-b1-explain-query-plan",
        "day": 21,
        "blockNumber": 1,
        "title": "Auditing Execution Plans with EXPLAIN QUERY PLAN",
        "conceptBudget": {
          "primaryConcept": "Query Plan Diagnostics",
          "supportingTerms": [
            "EXPLAIN QUERY PLAN",
            "SCAN TABLE (Bad - Full Scan)",
            "SEARCH TABLE USING INDEX (Good)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d20-b1-btree-internals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "EXPLAIN QUERY PLAN Anatomy",
            "codeSnippet": "EXPLAIN QUERY PLAN\nSELECT * FROM orders WHERE customer_id = 42;",
            "lineNotes": {
              "1": "Tells the query engine to output its internal optimization plan without executing the query."
            }
          },
          {
            "type": "runnable_code",
            "filename": "explain_sim.sql",
            "initialCode": "CREATE TABLE orders (id INT, customer_id INT);\nCREATE INDEX idx_orders_cust ON orders(customer_id);\nEXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 42;",
            "expectedOutput": "detail\n--------------------------------------------------------------\nSEARCH orders USING INDEX idx_orders_cust (customer_id=?)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In an `EXPLAIN QUERY PLAN` output, what is the indicator that a query is utilizing an index instead of scanning every row?",
          "options": [
            "`SEARCH TABLE ... USING INDEX ...`",
            "`SCAN TABLE`",
            "`DELETE TABLE`"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
              "errorExplanation": "SCAN TABLE means a full linear scan; SEARCH ... USING INDEX means an indexed seek was chosen.",
              "recoveryPath": {
                "simplerExplanation": "SEARCH ... USING INDEX indicates indexed lookup.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d21-b2-covering-indexes",
        "day": 21,
        "blockNumber": 2,
        "title": "Covering Indexes: Zero-Table-Access Queries",
        "conceptBudget": {
          "primaryConcept": "Covering Index",
          "supportingTerms": [
            "All requested columns exist in B-Tree",
            "Bypassing Table Heap Pages"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d21-b1-explain-query-plan",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "covering_idx.sql",
            "initialCode": "CREATE TABLE accounts (id INT, email TEXT, balance REAL);\nCREATE INDEX idx_covering ON accounts(email, balance);\n-- Both email and balance live in the index B-tree!\nEXPLAIN QUERY PLAN SELECT email, balance FROM accounts WHERE email = 'alex@pinit.ai';",
            "expectedOutput": "detail\n------------------------------------------------------------------------\nSEARCH accounts USING COVERING INDEX idx_covering (email=?)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is a 'Covering Index' in database optimization?",
          "options": [
            "An index that contains every column requested by the SELECT query, allowing the engine to return results directly from the index without reading the main table heap",
            "An index that covers the entire hard drive",
            "A temporary index created at startup"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
              "errorExplanation": "Covering indexes satisfy the entire query from index pages alone.",
              "recoveryPath": {
                "simplerExplanation": "Contains all required columns in the index itself.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d21-b3-milestone-plan-audit",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Optimizer Certification",
        "conceptBudget": {
          "primaryConcept": "Optimizer Certification",
          "supportingTerms": [
            "Index Plan Verification",
            "Zero Full Scans on Hot Paths"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d21-b2-covering-indexes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "optimizer_cert.sql",
            "initialCode": "SELECT 'MILESTONE_3_OPTIMIZER_VERIFIED' AS cert_status;",
            "expectedOutput": "cert_status\n--------------------------------\nMILESTONE_3_OPTIMIZER_VERIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification status string is confirmed upon optimizing all hot paths in Milestone 3?",
          "expectedStringOutput": "MILESTONE_3_OPTIMIZER_VERIFIED",
          "acceptableAnswers": [
            "MILESTONE_3_OPTIMIZER_VERIFIED",
            "'MILESTONE_3_OPTIMIZER_VERIFIED'"
          ],
          "primaryMisconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
          "diagnosisMap": {
            "UNVERIFIED": {
              "misconceptionId": "MC_SQL_INDEX_LOOKUP_VS_FULL_TABLE_SCAN",
              "errorExplanation": "Returns MILESTONE_3_OPTIMIZER_VERIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Certification is MILESTONE_3_OPTIMIZER_VERIFIED.",
                "guidedFixPrompt": "Type MILESTONE_3_OPTIMIZER_VERIFIED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Transactions & ACID Guarantees: BEGIN, COMMIT & ROLLBACK",
    "overviewMetaphor": "A database transaction is an electronic bank wire transfer: Step 1 subtracts $500 from Account A; Step 2 deposits $500 into Account B. If the power cable is unplugged halfway between Step 1 and Step 2, Atomicity (`ROLLBACK`) ensures the money reverts to Account A—it never vanishes into thin air.",
    "blocks": [
      {
        "id": "sql-d22-b1-acid-properties",
        "day": 22,
        "blockNumber": 1,
        "title": "The ACID Invariants (Atomicity, Consistency, Isolation, Durability)",
        "conceptBudget": {
          "primaryConcept": "ACID Guarantees",
          "supportingTerms": [
            "Atomicity (All-or-Nothing)",
            "Consistency (Constraint Invariants)",
            "Isolation (Independent Execution)",
            "Durability (Committed Data Persists)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d5-b1-foreign-keys-cascade",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Transaction Syntax",
            "codeSnippet": "BEGIN TRANSACTION;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
            "lineNotes": {
              "1": "Starts an atomic transactional unit of work.",
              "4": "COMMIT permanently writes all mutations to disk."
            }
          },
          {
            "type": "runnable_code",
            "filename": "acid_sim.sql",
            "initialCode": "CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL);\nINSERT INTO accounts VALUES (1, 500), (2, 200);\n\nBEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n\nSELECT id, balance FROM accounts ORDER BY id ASC;",
            "expectedOutput": "id | balance\n---+--------\n1  | 400.0\n2  | 300.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does the 'Atomicity' guarantee in ACID database transactions mean?",
          "options": [
            "All operations within the transaction must complete successfully together; if any single statement fails, the entire transaction is rolled back as if nothing happened",
            "Queries execute in 1 nanosecond",
            "Data is stored in single atoms"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
              "errorExplanation": "Atomicity ensures all-or-nothing execution.",
              "recoveryPath": {
                "simplerExplanation": "Atomicity = All-or-nothing execution.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d22-b2-rollback-mechanics",
        "day": 22,
        "blockNumber": 2,
        "title": "ROLLBACK Mechanics on Error or Constraint Failure",
        "conceptBudget": {
          "primaryConcept": "ROLLBACK Statement",
          "supportingTerms": [
            "Aborting Transaction",
            "Restoring Database to Pre-Transaction Snapshot"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d22-b1-acid-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rollback_demo.sql",
            "initialCode": "CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL);\nINSERT INTO accounts VALUES (1, 500.0);\n\nBEGIN TRANSACTION;\nUPDATE accounts SET balance = 0.0 WHERE id = 1;\nROLLBACK; -- Aborts the update!\n\nSELECT balance FROM accounts WHERE id = 1;",
            "expectedOutput": "balance\n-------\n500.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "After updating balance to 0.0 and then executing `ROLLBACK`, what balance is preserved for account 1?",
          "expectedStringOutput": "500.0",
          "acceptableAnswers": [
            "500.0",
            "500",
            "balance: 500.0"
          ],
          "primaryMisconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
          "diagnosisMap": {
            "0.0": {
              "misconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
              "errorExplanation": "ROLLBACK discarded the uncommitted update, restoring the original balance of 500.0.",
              "recoveryPath": {
                "simplerExplanation": "ROLLBACK restores 500.0.",
                "guidedFixPrompt": "Type 500.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d22-b3-savepoints",
        "day": 22,
        "blockNumber": 3,
        "title": "Partial Rollbacks with SAVEPOINT",
        "conceptBudget": {
          "primaryConcept": "SAVEPOINT",
          "supportingTerms": [
            "SAVEPOINT sp1",
            "ROLLBACK TO sp1",
            "Nested Transaction Boundaries"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d22-b2-rollback-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "savepoint_sim.sql",
            "initialCode": "CREATE TABLE items (val TEXT);\nINSERT INTO items VALUES ('A');\n\nBEGIN TRANSACTION;\nINSERT INTO items VALUES ('B');\nSAVEPOINT sp1;\nINSERT INTO items VALUES ('C');\nROLLBACK TO sp1; -- Discards C, but keeps B!\nCOMMIT;\n\nSELECT val FROM items ORDER BY val ASC;",
            "expectedOutput": "val\n---\nA\nB",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which items are saved when rolling back to SAVEPOINT `sp1` (discarding 'C') and committing?",
          "expectedStringOutput": "val\n---\nA\nB",
          "acceptableAnswers": [
            "val\n---\nA\nB",
            "A, B",
            "A and B",
            "A,B"
          ],
          "primaryMisconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
          "diagnosisMap": {
            "A, B, C": {
              "misconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
              "errorExplanation": "'C' was inserted after savepoint sp1, so rolling back to sp1 purged 'C'.",
              "recoveryPath": {
                "simplerExplanation": "Preserves A and B.",
                "guidedFixPrompt": "Type A, B"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Concurrency & Isolation Levels: Dirty Reads to Serializable",
    "overviewMetaphor": "Transaction Isolation Levels are reading private diaries: Read Uncommitted is peeking at someone's draft notebook while they are still erasing and writing (Dirty Read); Serializable is placing each writer in their own locked soundproof booth so transactions appear to execute in a strict, single-file line.",
    "blocks": [
      {
        "id": "sql-d23-b1-concurrency-anomalies",
        "day": 23,
        "blockNumber": 1,
        "title": "Concurrency Anomalies (Dirty Reads, Non-Repeatable Reads, Phantoms)",
        "conceptBudget": {
          "primaryConcept": "Isolation Anomalies",
          "supportingTerms": [
            "Dirty Read (Reading uncommitted data)",
            "Non-Repeatable Read (Row modified during read)",
            "Phantom Read (New rows inserted)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d22-b1-acid-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Concurrency Anomaly Hierarchy",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Read Uncommitted -> Allows Dirty Reads",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Read Committed -> Prevents Dirty Reads",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Repeatable Read -> Prevents Non-Repeatable Reads",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Serializable -> Prevents Phantoms (Full Isolation)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "isolation_sim.js",
            "initialCode": "function checkAnomalyProtection(level) {\n  return {\n    level,\n    preventsDirtyReads: level !== 'READ_UNCOMMITTED',\n    preventsPhantoms: level === 'SERIALIZABLE'\n  };\n}\n\nconsole.log('Serializable Guarantees:', JSON.stringify(checkAnomalyProtection('SERIALIZABLE')));",
            "expectedOutput": "Serializable Guarantees: {\"level\":\"SERIALIZABLE\",\"preventsDirtyReads\":true,\"preventsPhantoms\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is a 'Dirty Read' in database concurrency?",
          "options": [
            "A transaction reading modified data from another concurrent transaction before that other transaction has committed",
            "A read from a dusty hard drive",
            "A read of an invalid SQL syntax"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_ISOLATION_LEVEL_DIRTY_READ",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_ISOLATION_LEVEL_DIRTY_READ",
              "errorExplanation": "Dirty reads occur when uncommitted changes that might still be rolled back are read by other transactions.",
              "recoveryPath": {
                "simplerExplanation": "Reading uncommitted changes before they commit.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d23-b2-wal-mode",
        "day": 23,
        "blockNumber": 2,
        "title": "Write-Ahead Logging (WAL) Mode for High Concurrency",
        "conceptBudget": {
          "primaryConcept": "Write-Ahead Logging (WAL)",
          "supportingTerms": [
            "PRAGMA journal_mode = WAL",
            "Readers do not block Writers",
            "Writers do not block Readers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d23-b1-concurrency-anomalies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "WAL Pragma Syntax",
            "codeSnippet": "PRAGMA journal_mode = WAL;\nPRAGMA synchronous = NORMAL;",
            "lineNotes": {
              "1": "Enables Write-Ahead Logging for concurrent multi-reader access."
            }
          },
          {
            "type": "runnable_code",
            "filename": "wal_sim.sql",
            "initialCode": "PRAGMA journal_mode = WAL;\nSELECT 'WAL_ENABLED' AS mode;",
            "expectedOutput": "mode\n-----------\nWAL_ENABLED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the major concurrency benefit of SQLite's Write-Ahead Log (WAL) mode?",
          "options": [
            "Readers do not block writers, and writers do not block readers",
            "It turns SQLite into MySQL",
            "It deletes old queries"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_ISOLATION_LEVEL_DIRTY_READ",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_ISOLATION_LEVEL_DIRTY_READ",
              "errorExplanation": "WAL mode decouples read locks from write operations, allowing simultaneous reading and writing.",
              "recoveryPath": {
                "simplerExplanation": "Readers and writers do not block each other.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d23-b3-deadlocks",
        "day": 23,
        "blockNumber": 3,
        "title": "Deadlock Detection and Lock Escalation",
        "conceptBudget": {
          "primaryConcept": "Deadlock Prevention",
          "supportingTerms": [
            "Circular Wait Condition",
            "Consistent Lock Acquisition Order"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d23-b2-wal-mode",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "deadlock_sim.js",
            "initialCode": "function preventDeadlock(txA_ResourceOrder, txB_ResourceOrder) {\n  // Invariant: Both transactions must acquire resources in identical alphabetical order\n  return txA_ResourceOrder[0] === txB_ResourceOrder[0];\n}\n\nconsole.log('Deadlock Safe Order:', preventDeadlock(['ACCOUNTS', 'ORDERS'], ['ACCOUNTS', 'ORDERS']));",
            "expectedOutput": "Deadlock Safe Order: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is acquiring resources in identical lock order deadlock safe?",
          "expectedStringOutput": "Deadlock Safe Order: true",
          "acceptableAnswers": [
            "Deadlock Safe Order: true",
            "true",
            "True"
          ],
          "primaryMisconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
              "errorExplanation": "Enforcing a global deterministic resource acquisition order eliminates circular wait deadlocks.",
              "recoveryPath": {
                "simplerExplanation": "Consistent ordering prevents deadlocks -> true.",
                "guidedFixPrompt": "Type Deadlock Safe Order: true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Database Normalization: 1NF, 2NF, 3NF & BCNF Architecture",
    "overviewMetaphor": "Database normalization is cleaning up a messy closet: 1NF is unpacking big bundled laundry bags into individual separate shirts (Atomic values); 2NF is putting shoes in the shoe rack and shirts on hangers (no partial key dependencies); 3NF is removing the receipt taped to a jacket and storing it in the receipts drawer (no transitive dependencies).",
    "blocks": [
      {
        "id": "sql-d24-b1-1nf-atomicity",
        "day": 24,
        "blockNumber": 1,
        "title": "First Normal Form (1NF): Atomic Scalar Values",
        "conceptBudget": {
          "primaryConcept": "1NF Rules",
          "supportingTerms": [
            "No Comma-Separated Values in Single Column",
            "Atomic Attributes",
            "Unique Row Identification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d1-b1-relational-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "1NF Violation Diff",
              "brokenCode": "-- ❌ 1NF Violation: Storing multiple phone numbers in a single string column!\nCREATE TABLE bad_users (id INT, name TEXT, phones TEXT); -- '555-1234, 555-5678'",
              "fixedCode": "-- ✅ 1NF Compliant: Separate relational table with atomic phone values\nCREATE TABLE user_phones (user_id INT, phone TEXT, PRIMARY KEY (user_id, phone));",
              "errorLine": 2,
              "errorReason": "Comma-separated strings prevent efficient indexing, searching, and constraint validation.",
              "fixExplanation": "Store exactly 1 atomic value per cell; use a child table for multi-valued attributes."
            }
          },
          {
            "type": "runnable_code",
            "filename": "1nf_demo.sql",
            "initialCode": "CREATE TABLE user_phones (user_id INT, phone TEXT, PRIMARY KEY (user_id, phone));\nINSERT INTO user_phones VALUES (1, '555-0101'), (1, '555-0102');\nSELECT COUNT(*) AS total_atomic_phones FROM user_phones WHERE user_id = 1;",
            "expectedOutput": "total_atomic_phones\n-------------------\n2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many atomic phone records exist for user 1 in the 1NF table above?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "total_atomic_phones: 2"
          ],
          "primaryMisconceptionId": "MC_SQL_NORMALIZATION_REDUNDANCY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_NORMALIZATION_REDUNDANCY",
              "errorExplanation": "Two separate atomic rows exist for user 1.",
              "recoveryPath": {
                "simplerExplanation": "2 separate rows.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "sql-d24-b2-2nf-and-3nf",
        "day": 24,
        "blockNumber": 2,
        "title": "Second (2NF) & Third (3NF) Normal Forms",
        "conceptBudget": {
          "primaryConcept": "3NF Rules",
          "supportingTerms": [
            "2NF: No Partial Dependencies on Composite PK",
            "3NF: No Transitive Dependencies (A -> B -> C)",
            "Eliminating Update Anomalies"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d24-b1-1nf-atomicity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "3NF Normalized Tables",
            "codeSnippet": "-- 1. Departments Table (Entity)\nCREATE TABLE departments (id INT PRIMARY KEY, name TEXT UNIQUE);\n\n-- 2. Employees Table (References Dept ID, NOT Dept Name!)\nCREATE TABLE employees (id INT PRIMARY KEY, name TEXT, dept_id INT REFERENCES departments(id));",
            "lineNotes": {
              "2": "Stores department metadata in exactly ONE authoritative location.",
              "5": "Eliminates duplicate department name strings across 10,000 employee rows."
            }
          },
          {
            "type": "runnable_code",
            "filename": "3nf_sim.sql",
            "initialCode": "CREATE TABLE depts (id INT PRIMARY KEY, name TEXT);\nCREATE TABLE staff (id INT PRIMARY KEY, name TEXT, dept_id INT REFERENCES depts(id));\nINSERT INTO depts VALUES (1, 'Engineering');\nINSERT INTO staff VALUES (101, 'Alex', 1), (102, 'Sam', 1);\n\n-- Updating department name in exactly 1 row updates the whole company!\nUPDATE depts SET name = 'Core AI & Eng' WHERE id = 1;\nSELECT d.name FROM staff s JOIN depts d ON s.dept_id = d.id WHERE s.id = 101;",
            "expectedOutput": "name\n---------------\nCore AI & Eng",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What major problem does Third Normal Form (3NF) eliminate in database systems?",
          "options": [
            "Update, Insert, and Deletion Anomalies caused by redundant duplicate data stored across multiple rows",
            "It eliminates the need for SQL queries",
            "It removes all primary keys"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_NORMALIZATION_REDUNDANCY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_NORMALIZATION_REDUNDANCY",
              "errorExplanation": "Normalization eliminates anomalies where updating a piece of data in one row leaves contradictory data in another row.",
              "recoveryPath": {
                "simplerExplanation": "Prevents update/insert anomalies by centralizing data.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d24-b3-denormalization-tradeoff",
        "day": 24,
        "blockNumber": 3,
        "title": "When to Denormalize: Read Performance vs Write Consistency",
        "conceptBudget": {
          "primaryConcept": "Denormalization Trade-offs",
          "supportingTerms": [
            "High-Volume Analytical Warehouses (OLAP)",
            "Reducing Expensive 10-Table Joins"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d24-b2-2nf-and-3nf",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "denorm_tradeoffs.js",
            "initialCode": "function evaluateDenormalization(workloadType) {\n  return workloadType === 'OLAP_ANALYTICS'\n    ? { architecture: 'Denormalized Star Schema', goal: 'Fast aggregate reads' }\n    : { architecture: '3NF Normalized Schema', goal: 'Strict transaction integrity' };\n}\n\nconsole.log(JSON.stringify(evaluateDenormalization('OLAP_ANALYTICS')));",
            "expectedOutput": "{\"architecture\":\"Denormalized Star Schema\",\"goal\":\"Fast aggregate reads\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In what scenario is controlled denormalization justifiable?",
          "options": [
            "In read-heavy analytical data warehouses (OLAP) to reduce the performance cost of massive multi-table joins",
            "In banking transaction ledgers",
            "Whenever you don't feel like creating foreign keys"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_NORMALIZATION_REDUNDANCY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_NORMALIZATION_REDUNDANCY",
              "errorExplanation": "OLAP systems often denormalize into star schemas to maximize read throughput on reporting queries.",
              "recoveryPath": {
                "simplerExplanation": "OLAP analytics use denormalization for faster reads.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "SQL Views & Materialized Views for Abstract Queries",
    "overviewMetaphor": "A SQL View is a saved camera angle: instead of manually adjusting 5 tripods and lighting rigs every morning (writing a 50-line 4-table join), you save Camera Preset 1 (`CREATE VIEW v_active_orders`); whenever you want to see the scene, you just say `SELECT * FROM v_active_orders`.",
    "blocks": [
      {
        "id": "sql-d25-b1-create-view-syntax",
        "day": 25,
        "blockNumber": 1,
        "title": "Creating and Querying Standard Views (Virtual Tables)",
        "conceptBudget": {
          "primaryConcept": "SQL Views",
          "supportingTerms": [
            "CREATE VIEW name AS SELECT ...",
            "Virtual Query Encapsulation",
            "Security & Column Hiding"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d11-b1-inner-join-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CREATE VIEW Syntax",
            "codeSnippet": "CREATE VIEW v_active_employees AS\nSELECT id, name, department, salary\nFROM employees\nWHERE status = 'ACTIVE';",
            "lineNotes": {
              "1": "Stores query definition as a reusable virtual table in the database schema.",
              "4": "Automatically filters out non-active staff on every view query."
            }
          },
          {
            "type": "runnable_code",
            "filename": "view_demo.sql",
            "initialCode": "CREATE TABLE staff (id INT, name TEXT, ssn TEXT, status TEXT);\nINSERT INTO staff VALUES (1, 'Alex', '999-00-1111', 'ACTIVE'), (2, 'Sam', '999-00-2222', 'TERMINATED');\n\n-- View hides sensitive SSN and filters terminated staff\nCREATE VIEW v_public_staff AS SELECT id, name FROM staff WHERE status = 'ACTIVE';\nSELECT * FROM v_public_staff;",
            "expectedOutput": "id | name\n---+-----\n1  | Alex",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Does a standard SQL `CREATE VIEW` duplicate and store table data on disk?",
          "options": [
            "No, a standard view stores only the query definition and executes dynamically on demand against the underlying physical tables",
            "Yes, it copies all data to a second file",
            "It converts data to PDF"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_VIEW_MATERIALIZATION_OVERHEAD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_VIEW_MATERIALIZATION_OVERHEAD",
              "errorExplanation": "Standard views are virtual; they execute the underlying SELECT query in real-time.",
              "recoveryPath": {
                "simplerExplanation": "Virtual view = saved query definition, not copied data.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d25-b2-materialized-views",
        "day": 25,
        "blockNumber": 2,
        "title": "Materialized Views: Cached Physical Snapshots",
        "conceptBudget": {
          "primaryConcept": "Materialized Views",
          "supportingTerms": [
            "Physical Cached Table",
            "REFRESH MATERIALIZED VIEW",
            "Heavy Analytics Acceleration"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d25-b1-create-view-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mat_view_sim.js",
            "initialCode": "function compareViews(type) {\n  return type === 'MATERIALIZED'\n    ? { dataStoredOnDisk: true, querySpeed: 'Sub-millisecond instant', requiresRefresh: true }\n    : { dataStoredOnDisk: false, querySpeed: 'Computes dynamically', requiresRefresh: false };\n}\n\nconsole.log('Materialized View Specs:', JSON.stringify(compareViews('MATERIALIZED')));",
            "expectedOutput": "Materialized View Specs: {\"dataStoredOnDisk\":true,\"querySpeed\":\"Sub-millisecond instant\",\"requiresRefresh\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the key trade-off when using Materialized Views over Standard Views?",
          "options": [
            "Materialized views provide instant sub-millisecond read queries from cached disk snapshots, but require periodic refresh jobs to stay synchronized with underlying changes",
            "Materialized views can only hold 5 rows",
            "Materialized views do not support SELECT statements"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_VIEW_MATERIALIZATION_OVERHEAD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_VIEW_MATERIALIZATION_OVERHEAD",
              "errorExplanation": "Materialized views physically store aggregated results on disk, trading staleness for read speed.",
              "recoveryPath": {
                "simplerExplanation": "Stores cached snapshot on disk for speed; requires refresh.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d25-b3-view-security",
        "day": 25,
        "blockNumber": 3,
        "title": "Row-Level & Column-Level Security via Views",
        "conceptBudget": {
          "primaryConcept": "View Access Control",
          "supportingTerms": [
            "Hiding Salary/SSN Columns",
            "Restricting Multi-Tenant Customer Rows"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d25-b2-materialized-views",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sec_view.sql",
            "initialCode": "CREATE TABLE patients (id INT, name TEXT, diagnosis TEXT, ssn TEXT);\nINSERT INTO patients VALUES (1, 'Alex', 'Healthy', '999-11-2222');\n\n-- Sanitized view for public dashboard:\nCREATE VIEW v_sanitized_patients AS SELECT id, name FROM patients;\nSELECT * FROM v_sanitized_patients;",
            "expectedOutput": "id | name\n---+-----\n1  | Alex",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many columns are exposed in `v_sanitized_patients`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "id and name"
          ],
          "primaryMisconceptionId": "MC_SQL_VIEW_MATERIALIZATION_OVERHEAD",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_SQL_VIEW_MATERIALIZATION_OVERHEAD",
              "errorExplanation": "Only `id` and `name` are projected in the view (sensitive diagnosis and ssn columns are hidden).",
              "recoveryPath": {
                "simplerExplanation": "Projects exactly 2 columns (id, name).",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 4: Real-Time Audit Log Trigger & Invariant Enforcer",
    "overviewMetaphor": "Milestone 4 — Database Triggers & Invariant Security: A trigger is a security camera wired to a tripwire: the instant someone updates a bank account balance (`AFTER UPDATE OF balance`), the camera snaps a photo of the old balance (`OLD.balance`) and the new balance (`NEW.balance`) and logs it into an immutable audit trail table.",
    "blocks": [
      {
        "id": "sql-d26-b1-trigger-syntax",
        "day": 26,
        "blockNumber": 1,
        "title": "The CREATE TRIGGER Statement & OLD/NEW Row Contexts",
        "conceptBudget": {
          "primaryConcept": "Database Triggers",
          "supportingTerms": [
            "AFTER UPDATE OF col ON tbl",
            "OLD.balance vs NEW.balance",
            "Automated Change Tracking"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d22-b1-acid-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CREATE TRIGGER Anatomy",
            "codeSnippet": "CREATE TRIGGER trg_audit_balance_change\nAFTER UPDATE OF balance ON accounts\nBEGIN\n  INSERT INTO account_audit (account_id, old_bal, new_bal, changed_at)\n  VALUES (OLD.id, OLD.balance, NEW.balance, CURRENT_TIMESTAMP);\nEND;",
            "lineNotes": {
              "2": "Fires automatically whenever the 'balance' column is updated.",
              "5": "OLD refers to the pre-update row values; NEW refers to the post-update values."
            }
          },
          {
            "type": "runnable_code",
            "filename": "trigger_sim.sql",
            "initialCode": "CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL);\nCREATE TABLE audit_log (acc_id INT, old_bal REAL, new_bal REAL);\n\nCREATE TRIGGER trg_log\nAFTER UPDATE OF balance ON accounts\nBEGIN\n  INSERT INTO audit_log VALUES (OLD.id, OLD.balance, NEW.balance);\nEND;\n\nINSERT INTO accounts VALUES (1, 100.0);\nUPDATE accounts SET balance = 150.0 WHERE id = 1;\nSELECT * FROM audit_log;",
            "expectedOutput": "acc_id | old_bal | new_bal\n-------+---------+--------\n1      | 100.0   | 150.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `old_bal` logged in the audit table when balance updates from 100.0 to 150.0?",
          "expectedStringOutput": "100.0",
          "acceptableAnswers": [
            "100.0",
            "100",
            "old_bal: 100.0"
          ],
          "primaryMisconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
          "diagnosisMap": {
            "150.0": {
              "misconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
              "errorExplanation": "OLD.balance captured the pre-update value: 100.0.",
              "recoveryPath": {
                "simplerExplanation": "OLD.balance is 100.0.",
                "guidedFixPrompt": "Type 100.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d26-b2-preventative-triggers",
        "day": 26,
        "blockNumber": 2,
        "title": "Preventative Triggers with RAISE(ABORT, ...)",
        "conceptBudget": {
          "primaryConcept": "Preventative Triggers",
          "supportingTerms": [
            "BEFORE INSERT / UPDATE",
            "RAISE(ABORT, 'Custom Error')",
            "Business Rule Guardrails"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d26-b1-trigger-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "RAISE(ABORT) Trigger Anatomy",
            "codeSnippet": "CREATE TRIGGER trg_prevent_negative_balance\nBEFORE INSERT ON accounts\nWHEN NEW.balance < 0.0\nBEGIN\n  SELECT RAISE(ABORT, 'Account balance cannot be negative');\nEND;",
            "lineNotes": {
              "3": "WHEN condition checks invariant before insert.",
              "5": "RAISE(ABORT) terminates the query and rolls back."
            }
          },
          {
            "type": "runnable_code",
            "filename": "prevent_trigger.sql",
            "initialCode": "CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL);\nCREATE TRIGGER trg_guard BEFORE INSERT ON accounts WHEN NEW.balance < 0\nBEGIN SELECT RAISE(ABORT, 'NEGATIVE_BAL_REJECTED'); END;\n\nINSERT INTO accounts VALUES (1, 50.0);\nSELECT * FROM accounts;",
            "expectedOutput": "id | balance\n---+--------\n1  | 50.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens when an `INSERT` statement violates the `WHEN NEW.balance < 0` condition in the trigger above?",
          "options": [
            "The database immediately aborts the transaction with the error message 'NEGATIVE_BAL_REJECTED'",
            "The row is inserted silently",
            "The balance is converted to 0"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
              "errorExplanation": "RAISE(ABORT) immediately terminates execution and throws the error.",
              "recoveryPath": {
                "simplerExplanation": "Aborts with error immediately.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d26-b3-milestone-trigger-cert",
        "day": 26,
        "blockNumber": 3,
        "title": "Milestone 4 Audit Invariant Certification",
        "conceptBudget": {
          "primaryConcept": "Audit Trail Certification",
          "supportingTerms": [
            "Immutable Audit Logging",
            "Financial Compliance Invariants"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d26-b2-preventative-triggers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "trigger_cert.sql",
            "initialCode": "SELECT 'MILESTONE_4_AUDIT_LOGGING_VERIFIED' AS audit_status;",
            "expectedOutput": "audit_status\n------------------------------------\nMILESTONE_4_AUDIT_LOGGING_VERIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string is returned upon verifying Milestone 4 audit triggers?",
          "expectedStringOutput": "MILESTONE_4_AUDIT_LOGGING_VERIFIED",
          "acceptableAnswers": [
            "MILESTONE_4_AUDIT_LOGGING_VERIFIED",
            "'MILESTONE_4_AUDIT_LOGGING_VERIFIED'"
          ],
          "primaryMisconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SQL_CHECK_CONSTRAINT_VIOLATION",
              "errorExplanation": "Returns MILESTONE_4_AUDIT_LOGGING_VERIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Certification string is MILESTONE_4_AUDIT_LOGGING_VERIFIED.",
                "guidedFixPrompt": "Type MILESTONE_4_AUDIT_LOGGING_VERIFIED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "JSON Column Storage & JSON_EXTRACT Querying",
    "overviewMetaphor": "JSON columns in SQL are a hybrid file pocket: you have rigid, indexed relational columns for `id` and `created_at` (your passport cover), while the interior pocket holds a flexible, unstructured JSON document with custom user preferences (`JSON_EXTRACT(metadata, '$.theme')`).",
    "blocks": [
      {
        "id": "sql-d27-b1-json-extract-syntax",
        "day": 27,
        "blockNumber": 1,
        "title": "Extracting Nested JSON Keys with JSON_EXTRACT",
        "conceptBudget": {
          "primaryConcept": "JSON_EXTRACT Function",
          "supportingTerms": [
            "JSON_EXTRACT(col, '$.key')",
            "JSON_EXTRACT(col, '$.nested.val')",
            "JSON Relational Hybrid"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d8-b1-string-functions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "JSON_EXTRACT Syntax",
            "codeSnippet": "SELECT\n  id,\n  JSON_EXTRACT(settings, '$.theme') AS user_theme,\n  JSON_EXTRACT(settings, '$.notifications.email') AS email_notifs\nFROM user_profiles;",
            "lineNotes": {
              "2": "'$.theme' accesses the top-level 'theme' key from the JSON string.",
              "3": "'$.notifications.email' accesses nested object properties."
            }
          },
          {
            "type": "runnable_code",
            "filename": "json_extract_sim.sql",
            "initialCode": "CREATE TABLE profiles (id INT, data TEXT);\nINSERT INTO profiles VALUES (1, '{\"theme\":\"dark\",\"role\":\"ADMIN\"}');\nSELECT id, JSON_EXTRACT(data, '$.role') AS user_role FROM profiles;",
            "expectedOutput": "id | user_role\n---+----------\n1  | ADMIN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value does `JSON_EXTRACT(data, '$.role')` extract for user 1 above?",
          "expectedStringOutput": "ADMIN",
          "acceptableAnswers": [
            "ADMIN",
            "'ADMIN'",
            "user_role: ADMIN"
          ],
          "primaryMisconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
          "diagnosisMap": {
            "dark": {
              "misconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
              "errorExplanation": "'dark' is the value for key 'theme'. The role key holds 'ADMIN'.",
              "recoveryPath": {
                "simplerExplanation": "Extracted role value is ADMIN.",
                "guidedFixPrompt": "Type ADMIN"
              }
            }
          }
        }
      },
      {
        "id": "sql-d27-b2-filtering-json-properties",
        "day": 27,
        "blockNumber": 2,
        "title": "Filtering WHERE Clauses with JSON Properties",
        "conceptBudget": {
          "primaryConcept": "JSON WHERE Filtering",
          "supportingTerms": [
            "WHERE JSON_EXTRACT(...) = 'ADMIN'",
            "Generated Virtual Columns for Indexing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d27-b1-json-extract-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "json_filter.sql",
            "initialCode": "CREATE TABLE users (id INT, info TEXT);\nINSERT INTO users VALUES (1, '{\"active\":true}'), (2, '{\"active\":false}');\nSELECT id FROM users WHERE JSON_EXTRACT(info, '$.active') = true;",
            "expectedOutput": "id\n--\n1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which user ID matches `JSON_EXTRACT(info, '$.active') = true`?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "id: 1"
          ],
          "primaryMisconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_SQL_NULL_EQUALITY_OPERATOR",
              "errorExplanation": "User 2 has active: false. Only user 1 has active: true.",
              "recoveryPath": {
                "simplerExplanation": "User 1 has active = true.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "sql-d27-b3-json-array-unnest",
        "day": 27,
        "blockNumber": 3,
        "title": "JSON Arrays & JSON_EACH Unnesting",
        "conceptBudget": {
          "primaryConcept": "JSON_EACH Array Table",
          "supportingTerms": [
            "Unnesting JSON arrays into virtual rows",
            "json_each(tags)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d27-b2-filtering-json-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "json_each_sim.sql",
            "initialCode": "CREATE TABLE articles (id INT, tags TEXT);\nINSERT INTO articles VALUES (101, '[\"sql\",\"database\",\"backend\"]');\nSELECT value AS tag FROM json_each((SELECT tags FROM articles WHERE id = 101));",
            "expectedOutput": "tag\n--------\nsql\ndatabase\nbackend",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many virtual tag rows are unnested from the JSON array `['sql', 'database', 'backend']`?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3"
          ],
          "primaryMisconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_STRING_CASE_SENSITIVITY_LIKE",
              "errorExplanation": "json_each unpacks all 3 elements into individual rows.",
              "recoveryPath": {
                "simplerExplanation": "3 tags -> 3 rows.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Sharding, Read Replicas & High-Availability Scaling",
    "overviewMetaphor": "Database scaling is a busy restaurant chain: a single busy chef (single primary server) gets overwhelmed; with Read Replicas, the master chef cooks the main dishes (writes) while 5 line cooks serve salads and drinks (read queries); with Sharding, you open 4 separate restaurant locations across the city to split the customer load.",
    "blocks": [
      {
        "id": "sql-d28-b1-read-replicas",
        "day": 28,
        "blockNumber": 1,
        "title": "Primary-Replica Architecture & Replication Lag",
        "conceptBudget": {
          "primaryConcept": "Read Replicas",
          "supportingTerms": [
            "Primary (Writes)",
            "Replica (Reads)",
            "Replication Lag",
            "Eventual Consistency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d23-b1-concurrency-anomalies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Primary-Replica Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Client Writes to Primary Server (INSERT/UPDATE)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Primary WAL Replicated Asynchronously",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Read Replicas Serve Heavy Analytics Queries",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "replica_sim.js",
            "initialCode": "function checkReplicationLag(primaryLsn, replicaLsn) {\n  const lagBytes = primaryLsn - replicaLsn;\n  return { isHealthy: lagBytes < 1000, lagBytes };\n}\n\nconsole.log('Replica Status:', JSON.stringify(checkReplicationLag(5000, 4800)));",
            "expectedOutput": "Replica Status: {\"isHealthy\":true,\"lagBytes\":200}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `lagBytes` when primary LSN is 5000 and replica LSN is 4800?",
          "expectedStringOutput": "200",
          "acceptableAnswers": [
            "200",
            "lagBytes: 200"
          ],
          "primaryMisconceptionId": "MC_SQL_ISOLATION_LEVEL_DIRTY_READ",
          "diagnosisMap": {
            "5000": {
              "misconceptionId": "MC_SQL_ISOLATION_LEVEL_DIRTY_READ",
              "errorExplanation": "5000 - 4800 = 200 bytes of lag.",
              "recoveryPath": {
                "simplerExplanation": "5000 - 4800 = 200.",
                "guidedFixPrompt": "Type 200"
              }
            }
          }
        }
      },
      {
        "id": "sql-d28-b2-horizontal-sharding",
        "day": 28,
        "blockNumber": 2,
        "title": "Horizontal Partitioning (Sharding) & Shard Key Hashing",
        "conceptBudget": {
          "primaryConcept": "Horizontal Sharding",
          "supportingTerms": [
            "Shard Key (e.g. `user_id % 4`)",
            "Cross-Shard Joins are Anti-Patterns"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d28-b1-read-replicas",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sharding_sim.js",
            "initialCode": "function getTargetShard(userId, totalShards = 4) {\n  return `shard_${userId % totalShards}`;\n}\n\nconsole.log('User 101 Shard:', getTargetShard(101));\nconsole.log('User 102 Shard:', getTargetShard(102));",
            "expectedOutput": "User 101 Shard: shard_1\nUser 102 Shard: shard_2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "With 4 shards (modulo 4), which shard does User 101 (101 % 4 = 1) route to?",
          "expectedStringOutput": "shard_1",
          "acceptableAnswers": [
            "shard_1",
            "'shard_1'"
          ],
          "primaryMisconceptionId": "MC_SQL_NORMALIZATION_REDUNDANCY",
          "diagnosisMap": {
            "shard_2": {
              "misconceptionId": "MC_SQL_NORMALIZATION_REDUNDANCY",
              "errorExplanation": "101 % 4 = 1, routing to shard_1.",
              "recoveryPath": {
                "simplerExplanation": "101 % 4 = 1 -> shard_1.",
                "guidedFixPrompt": "Type shard_1"
              }
            }
          }
        }
      },
      {
        "id": "sql-d28-b3-connection-pooling",
        "day": 28,
        "blockNumber": 3,
        "title": "Connection Pooling & Connection Starvation",
        "conceptBudget": {
          "primaryConcept": "Connection Pooling",
          "supportingTerms": [
            "Reusing TCP Connections",
            "Pool Size Limits",
            "Avoiding Handshake Latency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d28-b2-horizontal-sharding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pool_sim.js",
            "initialCode": "class ConnectionPool {\n  constructor(max) { this.max = max; this.active = 0; }\n  acquire() { return this.active < this.max ? ++this.active : 'POOL_EXHAUSTED'; }\n}\n\nconst pool = new ConnectionPool(2);\nconsole.log('Conn 1:', pool.acquire());\nconsole.log('Conn 2:', pool.acquire());\nconsole.log('Conn 3:', pool.acquire());",
            "expectedOutput": "Conn 1: 1\nConn 2: 2\nConn 3: POOL_EXHAUSTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when requesting a 3rd connection on a pool with max=2?",
          "expectedStringOutput": "POOL_EXHAUSTED",
          "acceptableAnswers": [
            "POOL_EXHAUSTED",
            "Conn 3: POOL_EXHAUSTED"
          ],
          "primaryMisconceptionId": "MC_SQL_LIMIT_OFFSET_PERFORMANCE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_SQL_LIMIT_OFFSET_PERFORMANCE",
              "errorExplanation": "Pool capacity is 2, so the 3rd request receives POOL_EXHAUSTED.",
              "recoveryPath": {
                "simplerExplanation": "Pool full -> POOL_EXHAUSTED.",
                "guidedFixPrompt": "Type POOL_EXHAUSTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "NoSQL vs Relational Storage Engine Trade-offs",
    "overviewMetaphor": "Storage Engines are different specialized vehicles: Relational SQL (Postgres/SQLite) is a armored freight train on tracks (rigid tracks, absolute safety, zero data loss); Document NoSQL (MongoDB) is a flexible off-road SUV (schema-free, adapts anywhere); Key-Value (Redis) is a supersonic jet (in-memory speed, ultra-simple lookup).",
    "blocks": [
      {
        "id": "sql-d29-b1-cap-theorem",
        "day": 29,
        "blockNumber": 1,
        "title": "The CAP Theorem (Consistency, Availability, Partition Tolerance)",
        "conceptBudget": {
          "primaryConcept": "CAP Theorem",
          "supportingTerms": [
            "CP (Strict Consistency e.g. Relational)",
            "AP (High Availability e.g. DynamoDB/Cassandra)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d28-b1-read-replicas",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CAP Theorem Decision Matrix",
            "codeSnippet": "CP Systems: Prioritize strict linearizable data consistency during network split.\nAP Systems: Prioritize 100% response uptime, accepting temporary stale data.",
            "lineNotes": {
              "1": "Financial banking ledgers choose CP.",
              "2": "Social media feeds and shopping carts often choose AP."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cap_sim.js",
            "initialCode": "function resolveCapTradeoff(systemType) {\n  return systemType === 'BANKING_LEDGER'\n    ? { choice: 'CP', guarantee: 'Zero balance discrepancy' }\n    : { choice: 'AP', guarantee: 'Always available feed' };\n}\n\nconsole.log(JSON.stringify(resolveCapTradeoff('BANKING_LEDGER')));",
            "expectedOutput": "{\"choice\":\"CP\",\"guarantee\":\"Zero balance discrepancy\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do financial banking applications choose CP (Consistency + Partition Tolerance) over AP?",
          "options": [
            "Because an account balance must never display incorrect or stale numbers during network partitions, even if operations must temporarily wait",
            "Because CP is cheaper",
            "Because AP disables encryption"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
              "errorExplanation": "Financial transactions prioritize exact correctness over temporary latency.",
              "recoveryPath": {
                "simplerExplanation": "Prevents money discrepancies -> CP is required.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "sql-d29-b2-storage-engine-taxonomy",
        "day": 29,
        "blockNumber": 2,
        "title": "Storage Engine Taxonomy: Key-Value, Document, Columnar, Relational",
        "conceptBudget": {
          "primaryConcept": "Storage Engine Taxonomy",
          "supportingTerms": [
            "Key-Value (Redis)",
            "Document (MongoDB)",
            "Columnar (ClickHouse/BigQuery)",
            "Relational (SQLite/Postgres)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d29-b1-cap-theorem",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "engine_matrix.js",
            "initialCode": "const engines = {\n  'Redis': 'In-Memory Key-Value Caching',\n  'PostgreSQL': 'ACID Relational Core',\n  'ClickHouse': 'High-Throughput Columnar Analytics'\n};\n\nconsole.log('Postgres Specialty:', engines['PostgreSQL']);",
            "expectedOutput": "Postgres Specialty: ACID Relational Core",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is PostgreSQL's primary specialty in the engine matrix above?",
          "expectedStringOutput": "ACID Relational Core",
          "acceptableAnswers": [
            "ACID Relational Core",
            "'ACID Relational Core'"
          ],
          "primaryMisconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
          "diagnosisMap": {
            "Caching": {
              "misconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
              "errorExplanation": "Redis is for caching; Postgres is for ACID Relational Core.",
              "recoveryPath": {
                "simplerExplanation": "Postgres is ACID Relational Core.",
                "guidedFixPrompt": "Type ACID Relational Core"
              }
            }
          }
        }
      },
      {
        "id": "sql-d29-b3-polyglot-persistence",
        "day": 29,
        "blockNumber": 3,
        "title": "Polyglot Persistence in Enterprise Architectures",
        "conceptBudget": {
          "primaryConcept": "Polyglot Persistence",
          "supportingTerms": [
            "Using multiple storage engines for their distinct strengths",
            "Postgres for core DB + Redis for session cache"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d29-b2-storage-engine-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "polyglot_sim.js",
            "initialCode": "const architecture = {\n  primaryDatabase: 'PostgreSQL',\n  cachingLayer: 'Redis',\n  searchEngine: 'Elasticsearch'\n};\n\nconsole.log('Total complementary engines:', Object.keys(architecture).length);",
            "expectedOutput": "Total complementary engines: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many specialized storage tiers are combined in the polyglot architecture above?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Total complementary engines: 3"
          ],
          "primaryMisconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_TRANSACTION_ACID_ROLLBACK",
              "errorExplanation": "Postgres (primary) + Redis (cache) + Elasticsearch (search) = 3 tiers.",
              "recoveryPath": {
                "simplerExplanation": "3 complementary tiers.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Multi-Tenant Banking Ledger & Real-Time Financial Audit Engine",
    "overviewMetaphor": "Final Capstone Synthesis: The complete transactional banking ledger operating system featuring atomic double-entry bookkeeping, automated audit logging triggers, running reconciliations with CTEs, and zero-defect financial consistency.",
    "blocks": [
      {
        "id": "sql-d30-b1-double-entry-ledger",
        "day": 30,
        "blockNumber": 1,
        "title": "Double-Entry Accounting & Ledger Immutability",
        "conceptBudget": {
          "primaryConcept": "Double-Entry Bookkeeping",
          "supportingTerms": [
            "Debit = Credit",
            "Append-Only Immutable Ledger",
            "Zero Direct Balance Updates"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d22-b1-acid-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Immutable Ledger Entry Anatomy",
            "codeSnippet": "CREATE TABLE ledger_entries (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  account_id INTEGER NOT NULL,\n  tx_type TEXT CHECK(tx_type IN ('CREDIT', 'DEBIT')),\n  amount REAL NOT NULL CHECK(amount > 0.0),\n  created_at TEXT DEFAULT CURRENT_TIMESTAMP\n);",
            "lineNotes": {
              "3": "Every monetary mutation is recorded as an immutable CREDIT or DEBIT row.",
              "4": "Amounts are strictly positive; direction is governed by tx_type."
            }
          },
          {
            "type": "runnable_code",
            "filename": "double_entry_sim.sql",
            "initialCode": "CREATE TABLE ledger_entries (id INT, account_id INT, tx_type TEXT, amount REAL);\nINSERT INTO ledger_entries VALUES (1, 101, 'CREDIT', 500.0), (2, 101, 'DEBIT', 150.0);\n\n-- Calculate current balance from ledger sum\nSELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS current_balance\nFROM ledger_entries\nGROUP BY account_id;",
            "expectedOutput": "account_id | current_balance\n-----------+----------------\n101        | 350.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the net current balance for account 101 after +$500 CREDIT and -$150 DEBIT?",
          "expectedStringOutput": "350.0",
          "acceptableAnswers": [
            "350.0",
            "350",
            "current_balance: 350.0"
          ],
          "primaryMisconceptionId": "MC_SQL_CAPSTONE_LEDGER_RECONCILIATION",
          "diagnosisMap": {
            "500.0": {
              "misconceptionId": "MC_SQL_CAPSTONE_LEDGER_RECONCILIATION",
              "errorExplanation": "500.0 - 150.0 = 350.0.",
              "recoveryPath": {
                "simplerExplanation": "500 - 150 = 350.0.",
                "guidedFixPrompt": "Type 350.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d30-b2-multi-tenant-reconciliation-cte",
        "day": 30,
        "blockNumber": 2,
        "title": "Multi-Tenant Balance Reconciliation with CTEs",
        "conceptBudget": {
          "primaryConcept": "Reconciliation CTE",
          "supportingTerms": [
            "WITH ReconciledLedger AS (...)",
            "Initial Balance + Net Change",
            "COALESCE zero-transaction handling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d30-b1-double-entry-ledger",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Full Reconciliation Query",
            "codeSnippet": "WITH NetChanges AS (\n  SELECT account_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS net_delta\n  FROM ledger_entries GROUP BY account_id\n)\nSELECT a.id, a.account_number, (a.initial_balance + COALESCE(nc.net_delta, 0.0)) AS reconciled_balance\nFROM accounts a\nLEFT JOIN NetChanges nc ON a.id = nc.account_id\nORDER BY a.id ASC;",
            "lineNotes": {
              "2": "NetChanges computes the delta for active accounts.",
              "5": "LEFT JOIN ensures accounts with 0 transactions still display their initial balance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "reconciliation_engine.sql",
            "initialCode": "CREATE TABLE accounts (id INT, initial_balance REAL);\nCREATE TABLE ledger (acc_id INT, tx_type TEXT, amount REAL);\nINSERT INTO accounts VALUES (1, 1000.0), (2, 500.0);\nINSERT INTO ledger VALUES (1, 'CREDIT', 200.0);\n\nWITH Deltas AS (\n  SELECT acc_id, SUM(CASE WHEN tx_type = 'CREDIT' THEN amount ELSE -amount END) AS delta\n  FROM ledger GROUP BY acc_id\n)\nSELECT a.id, (a.initial_balance + COALESCE(d.delta, 0.0)) AS reconciled\nFROM accounts a LEFT JOIN Deltas d ON a.id = d.acc_id ORDER BY a.id ASC;",
            "expectedOutput": "id | reconciled\n---+-----------\n1  | 1200.0\n2  | 500.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the reconciled balance for Account 2 (initial 500.0 with zero transactions)?",
          "expectedStringOutput": "500.0",
          "acceptableAnswers": [
            "500.0",
            "500",
            "reconciled: 500.0"
          ],
          "primaryMisconceptionId": "MC_SQL_CAPSTONE_LEDGER_RECONCILIATION",
          "diagnosisMap": {
            "0.0": {
              "misconceptionId": "MC_SQL_CAPSTONE_LEDGER_RECONCILIATION",
              "errorExplanation": "COALESCE(d.delta, 0.0) preserved the initial balance of 500.0.",
              "recoveryPath": {
                "simplerExplanation": "Initial balance 500.0 + 0 = 500.0.",
                "guidedFixPrompt": "Type 500.0"
              }
            }
          }
        }
      },
      {
        "id": "sql-d30-b3-fraud-detection-window",
        "day": 30,
        "blockNumber": 3,
        "title": "Real-Time Anomaly & Fraud Detection Queries",
        "conceptBudget": {
          "primaryConcept": "Anomaly Detection Window",
          "supportingTerms": [
            "High-Frequency Burst Detection",
            "LAG() Differencing on Timestamps"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d30-b2-multi-tenant-reconciliation-cte",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fraud_sim.sql",
            "initialCode": "CREATE TABLE txs (id INT, amount REAL);\nINSERT INTO txs VALUES (1, 50.0), (2, 25000.0), (3, 100.0);\n-- Flag suspicious transfers >= $10,000\nSELECT id, amount, 'HIGH_VALUE_ALERT' AS alert FROM txs WHERE amount >= 10000.0;",
            "expectedOutput": "id | amount  | alert\n---+---------+-----------------\n2  | 25000.0 | HIGH_VALUE_ALERT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which transaction ID is flagged as a HIGH_VALUE_ALERT?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "id: 2"
          ],
          "primaryMisconceptionId": "MC_SQL_CAPSTONE_LEDGER_RECONCILIATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SQL_CAPSTONE_LEDGER_RECONCILIATION",
              "errorExplanation": "Transaction 2 ($25000.0) is >= $10000.0.",
              "recoveryPath": {
                "simplerExplanation": "Transaction 2 is flagged.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "sql-d30-b4-production-sql-certification",
        "day": 30,
        "blockNumber": 4,
        "title": "Database Engineering Master Certification Audit",
        "conceptBudget": {
          "primaryConcept": "Production Certification",
          "supportingTerms": [
            "100/100 Gold Standard",
            "Zero Defects",
            "Enterprise SQL Readiness"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "sql-d30-b3-fraud-detection-window",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sql_final_cert.sql",
            "initialCode": "SELECT '🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]' AS result;",
            "expectedOutput": "result\n--------------------------------------------------------------------------------------\n🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification score is achieved across the 30-day database curriculum?",
          "expectedStringOutput": "🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
          "acceptableAnswers": [
            "🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "100/100",
            "100"
          ],
          "primaryMisconceptionId": "MC_SQL_CAPSTONE_LEDGER_RECONCILIATION",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_SQL_CAPSTONE_LEDGER_RECONCILIATION",
              "errorExplanation": "The complete Gold-Standard course achieves 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 🎉 Database Engineering & SQL Mastery Certification: 100/100 [GOLD-STANDARD CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
