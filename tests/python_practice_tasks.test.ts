import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

/** A correct answer for every practice task: [Practice 1, Practice 2] per day. */
const SOLUTIONS: [string, string][] = [
  [
    "def page_title():\n    return 'My Expense Tracker'",
    "def say_hello(name):\n    return 'Hello, ' + name",
  ],
  [
    "def describe_expense(item, amount):\n    return item + ' costs ' + str(amount)",
    "def is_big_expense(amount):\n    return amount >= 1000",
  ],
  [
    "def shout(text):\n    return text.upper() + '!'",
    "def initials(first, last):\n    return (first[0] + last[0]).upper()",
  ],
  [
    "def add_gst(price):\n    return round(price * 1.18, 2)",
    "def split_bill(total, people):\n    return round(total / people, 2)",
  ],
  [
    "def grade(score):\n    if score >= 40:\n        return 'Pass'\n    return 'Fail'",
    "def delivery_fee(bill):\n    return 0 if bill >= 499 else 40",
  ],
  [
    "def total(amounts):\n    result = 0\n    for amount in amounts:\n        result = result + amount\n    return result",
    "def count_above(amounts, limit):\n    count = 0\n    for amount in amounts:\n        if amount > limit:\n            count = count + 1\n    return count",
  ],
  [
    "def average(numbers):\n    if not numbers:\n        return 0\n    return round(sum(numbers) / len(numbers), 2)",
    "def greet(name, greeting='Hello'):\n    return greeting + ', ' + name + '!'",
  ],
  [
    "def first_and_last(items):\n    return [items[0], items[-1]]",
    "def add_item(items, item):\n    return items + [item]",
  ],
  [
    "def double_all(numbers):\n    return [n * 2 for n in numbers]",
    "def above(numbers, limit):\n    return [n for n in numbers if n > limit]",
  ],
  [
    "def make_expense(item, amount, category):\n    return {'item': item, 'amount': amount, 'category': category}",
    "def price_of(prices, item):\n    return prices.get(item, 0)",
  ],
  [
    "def total_spent(expenses):\n    return sum(e['amount'] for e in expenses)",
    "def by_category(expenses, category):\n    return [e for e in expenses if e['category'] == category]",
  ],
  [
    "def unique_categories(expenses):\n    return sorted({e['category'] for e in expenses})",
    "def min_max(numbers):\n    return (min(numbers), max(numbers))",
  ],
  [
    "def money(amount):\n    return f'Rs {amount:.2f}'",
    "def receipt_line(item, amount):\n    return f'{item:<10}{amount:>8.2f}'",
  ],
  [
    "def safe_int(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0",
    "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None",
  ],
  [
    "import math\n\ndef circle_area(r):\n    return round(math.pi * r * r, 2)",
    "from datetime import date\n\ndef days_between(start, end):\n    return (date.fromisoformat(end) - date.fromisoformat(start)).days",
  ],
  [
    "def parse_line(line):\n    item, amount = line.strip().split(',')\n    return (item.strip(), int(amount))",
    "def to_line(item, amount):\n    return f'{item},{amount}'",
  ],
  [
    "import json\n\ndef to_json(expenses):\n    return json.dumps(expenses)",
    "import json\n\ndef load_expenses(text):\n    try:\n        data = json.loads(text)\n        return data if isinstance(data, list) else []\n    except ValueError:\n        return []",
  ],
  [
    "class Expense:\n    def __init__(self, item, amount):\n        self.item = item\n        self.amount = amount\n\n    def label(self):\n        return f'{self.item}: {self.amount}'",
    "class Wallet:\n    def __init__(self, balance):\n        self.balance = balance\n\n    def spend(self, amount):\n        if amount > self.balance:\n            return False\n        self.balance = self.balance - amount\n        return True",
  ],
  [
    "class Expense:\n    def __init__(self, item, amount):\n        self.item = item\n        self.amount = amount\n\n    def __str__(self):\n        return f'{self.item} (Rs {self.amount})'",
    "class Expense:\n    def __init__(self, item, amount):\n        self.item = item\n        self.amount = amount\n\nclass Subscription(Expense):\n    def yearly_cost(self):\n        return self.amount * 12",
  ],
  [
    "def parse_amount(text):\n    try:\n        return float(text.strip())\n    except ValueError:\n        return None",
    "def menu_choice(text):\n    value = text.strip()\n    return int(value) if value in ('1', '2', '3') else None",
  ],
  [
    "def is_valid_amount(value):\n    return isinstance(value, (int, float)) and not isinstance(value, bool) and value > 0",
    "def check_equal(actual, expected):\n    if actual != expected:\n        raise AssertionError(f'Expected {expected} but got {actual}')\n    return True",
  ],
  [
    "def is_good_commit_message(msg):\n    return 10 <= len(msg) <= 72",
    "def branch_name(task):\n    return 'feature/' + '-'.join(task.lower().split())",
  ],
  [
    "def sort_by_date(expenses):\n    return sorted(expenses, key=lambda e: e['date'], reverse=True)",
    "def group_by_category(expenses):\n    groups = {}\n    for e in expenses:\n        groups.setdefault(e['category'], []).append(e['item'])\n    return groups",
  ],
  [
    "def add_expense(expenses, item, amount, category, date):\n    new = {'id': len(expenses) + 1, 'item': item.strip(), 'amount': amount, 'category': category.strip(), 'date': date}\n    return expenses + [new]",
    "def format_expense(e):\n    return f\"{e['item']} - Rs {e['amount']:.2f} ({e['category']})\"",
  ],
  [
    "def summary(expenses):\n    biggest = max(expenses, key=lambda e: e['amount'])['item'] if expenses else None\n    return {'total': sum(e['amount'] for e in expenses), 'count': len(expenses), 'biggest': biggest}",
    "def category_totals(expenses):\n    totals = {}\n    for e in expenses:\n        totals[e['category']] = totals.get(e['category'], 0) + e['amount']\n    return totals",
  ],
  [
    "def parse_results(data):\n    return data.get('results', [])",
    "def status_message(code):\n    if code == 200:\n        return 'OK'\n    if code == 404:\n        return 'Not found'\n    return 'Something went wrong'",
  ],
  [
    "def validate_expense(data):\n    errors = []\n    if not str(data.get('item', '')).strip():\n        errors.append('item is required')\n    amount = data.get('amount')\n    if not isinstance(amount, (int, float)) or amount <= 0:\n        errors.append('amount must be more than 0')\n    return errors",
    "def paginate(items, page, size):\n    start = (page - 1) * size\n    return items[start:start + size]",
  ],
  [
    "def total_amount(expenses):\n    total = 0\n    for i in range(0, len(expenses)):\n        total = total + expenses[i]['amount']\n    return total",
    "def first_invalid(expenses):\n    for e in expenses:\n        if e['amount'] <= 0:\n            return e\n    return None",
  ],
  [
    "def base_url(env):\n    return 'https://expense-api.onrender.com' if env == 'production' else 'http://127.0.0.1:8000'",
    "def missing_sections(readme):\n    needed = ['## About', '## Features', '## Setup']\n    return [s for s in needed if s not in readme]",
  ],
  [
    "def fizz_buzz(n):\n    if n % 15 == 0:\n        return 'FizzBuzz'\n    if n % 3 == 0:\n        return 'Fizz'\n    if n % 5 == 0:\n        return 'Buzz'\n    return str(n)",
    "def reverse_words(sentence):\n    return ' '.join(reversed(sentence.split()))",
  ],
];

const hasPython = spawnSync('python3', ['--version']).status === 0;

/** Grades code the way /api/code/run-python does: code saved as solution.py, checks run after `from solution import *`. */
function gradeLikeServer(code: string, testSuite: string) {
  const blocked = findForbiddenPython(`${code}\n${testSuite}`);
  if (blocked) return { ok: false, out: `blocked by the server safety filter: ${blocked}` };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'py-task-'));
  try {
    fs.writeFileSync(path.join(dir, 'solution.py'), code);
    const indented = testSuite.split('\n').map((line) => '    ' + line).join('\n');
    fs.writeFileSync(path.join(dir, 'runner.py'), `from solution import *\ntry:\n${indented}\n    print('PASSED')\nexcept AssertionError as e:\n    raise SystemExit(f'AssertionError: {e}')\n`);
    const r = spawnSync('python3', ['runner.py'], { cwd: dir, encoding: 'utf8', timeout: 10000 });
    return { ok: r.status === 0 && r.stdout.includes('PASSED'), out: `${r.stdout}${r.stderr}` };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('the Python course has 30 days and a solution for every practice task', () => {
  assert.equal(PYTHON_30_DAYS_CONFIGS.length, 30);
  assert.equal(SOLUTIONS.length, 30);
});

test('no Python practice task needs input(), which the browser cannot provide', () => {
  for (const cfg of PYTHON_30_DAYS_CONFIGS) {
    for (const code of [cfg.eStarter, cfg.eTest, cfg.aStarter, cfg.aTest]) {
      assert.ok(!/\binput\(/.test(code || ''), `${cfg.title} uses input()`);
    }
  }
});

test('every Python practice task: the right answer passes and the starter code fails', { skip: !hasPython && 'python3 not installed' }, () => {
  PYTHON_30_DAYS_CONFIGS.forEach((cfg, i) => {
    const tasks = [
      { name: 'Practice 1', starter: cfg.eStarter, check: cfg.eTest, solution: SOLUTIONS[i][0] },
      { name: 'Practice 2', starter: cfg.aStarter, check: cfg.aTest, solution: SOLUTIONS[i][1] },
    ];
    for (const t of tasks) {
      const label = `Day ${i + 1} ${t.name} (${cfg.title})`;
      assert.ok(t.starter && t.check, `${label} is missing its starter or check`);
      const good = gradeLikeServer(t.solution, t.check!);
      assert.ok(good.ok, `${label}: the right answer fails:\n${good.out}`);
      const bad = gradeLikeServer(t.starter!, t.check!);
      assert.ok(!bad.ok, `${label}: the unfinished starter code already passes`);
    }
  });
});
