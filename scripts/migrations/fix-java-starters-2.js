/**
 * Java starter fixes — Days 16 (missed) and 17-30.
 * All eStarters and aStarters were fully pre-solved.
 * Strips implementation bodies to proper stubs so students write the code.
 */

const fs = require('fs');
const path = require('path');
const javaPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'java30DayData.ts');

const FIXES = [
  // Day 16 eStarter (BankAccount — missed in first pass)
  {
    find: `eStarter: "class BankAccount {\\n    int balance = 0;\\n    void deposit(int amt) { balance += amt; }\\n    int getBalance() { return balance; }\\n}\\npublic class Solution {\\n    public static int testBank() {\\n        BankAccount acc = new BankAccount();\\n        acc.deposit(500);\\n        return acc.getBalance();\\n    }\\n}"`,
    replace: `eStarter: "class BankAccount {\\n    int balance = 0;\\n    void deposit(int amt) {\\n        // Add amt to balance:\\n        \\n    }\\n    int getBalance() {\\n        // Return the balance field:\\n        \\n    }\\n}\\npublic class Solution {\\n    public static int testBank() {\\n        BankAccount acc = new BankAccount(); acc.deposit(500); return acc.getBalance();\\n    }\\n}"`,
  },
  // Day 17 eStarter
  {
    find: `eStarter: "class User {\\n    String name;\\n    int age;\\n    User(String name, int age) {\\n        this.name = name;\\n        this.age = age;\\n    }\\n}\\npublic class Solution {\\n    public static User createUser(String name, int age) {\\n        return new User(name, age);\\n    }\\n}"`,
    replace: `eStarter: "class User {\\n    String name;\\n    int age;\\n    User(String name, int age) {\\n        // Assign each parameter to the matching field using 'this':\\n        \\n    }\\n}\\npublic class Solution {\\n    public static User createUser(String name, int age) { return new User(name, age); }\\n}"`,
  },
  // Day 17 aStarter
  {
    find: `aStarter: "class Book {\\n    String title; double price;\\n    Book(String title, double price) { this.title = title; this.price = price; }\\n}\\npublic class Solution {\\n    public static String getTitle() { return new Book(\\"Java\\", 29.99).title; }\\n}"`,
    replace: `aStarter: "class Book {\\n    String title;\\n    double price;\\n    Book(String title, double price) {\\n        // Assign parameters to instance fields using 'this':\\n        \\n    }\\n}\\npublic class Solution {\\n    public static String getTitle() { return new Book(\\"Java\\", 29.99).title; }\\n}"`,
  },
  // Day 18 eStarter
  {
    find: `eStarter: "class SecureAccount {\\n    private int balance = 0;\\n    public int getBalance() { return balance; }\\n    public void deposit(int amt) {\\n        if (amt > 0) balance += amt;\\n    }\\n}\\npublic class Solution {\\n    public static int test() {\\n        SecureAccount a = new SecureAccount();\\n        a.deposit(200);\\n        a.deposit(-50);\\n        return a.getBalance();\\n    }\\n}"`,
    replace: `eStarter: "class SecureAccount {\\n    private int balance = 0;\\n    public int getBalance() { return balance; }\\n    public void deposit(int amt) {\\n        // Only add amt to balance if amt is positive (> 0):\\n        \\n    }\\n}\\npublic class Solution {\\n    public static int test() { SecureAccount a = new SecureAccount(); a.deposit(200); a.deposit(-50); return a.getBalance(); }\\n}"`,
  },
  // Day 18 aStarter
  {
    find: `aStarter: "class Student {\\n    private double gpa;\\n    public void setGpa(double g) { if (g >= 0.0 && g <= 4.0) this.gpa = g; }\\n    public double getGpa() { return gpa; }\\n}\\npublic class Solution {\\n    public static double test() { Student s = new Student(); s.setGpa(3.8); return s.getGpa(); }\\n}"`,
    replace: `aStarter: "class Student {\\n    private double gpa;\\n    public void setGpa(double g) {\\n        // Set gpa only if g is between 0.0 and 4.0 inclusive:\\n        \\n    }\\n    public double getGpa() {\\n        // Return the gpa field:\\n        \\n    }\\n}\\npublic class Solution {\\n    public static double test() { Student s = new Student(); s.setGpa(3.8); return s.getGpa(); }\\n}"`,
  },
  // Day 19 eStarter
  {
    find: `eStarter: "class Employee {\\n    double salary = 50000.0;\\n}\\nclass Manager extends Employee {\\n    double bonus = 10000.0;\\n    double getTotalPay() { return salary + bonus; }\\n}\\npublic class Solution {\\n    public static double getPay() {\\n        return new Manager().getTotalPay();\\n    }\\n}"`,
    replace: `eStarter: "class Employee {\\n    double salary = 50000.0;\\n}\\nclass Manager extends Employee {\\n    double bonus = 10000.0;\\n    double getTotalPay() {\\n        // Return salary (inherited) plus bonus:\\n        \\n    }\\n}\\npublic class Solution {\\n    public static double getPay() { return new Manager().getTotalPay(); }\\n}"`,
  },
  // Day 19 aStarter
  {
    find: `aStarter: "class Vehicle { int wheels = 4; }\\nclass Bike extends Vehicle { Bike() { wheels = 2; } }\\npublic class Solution { public static int getWheels() { return new Bike().wheels; } }"`,
    replace: `aStarter: "class Vehicle { int wheels = 4; }\\nclass Bike extends Vehicle {\\n    Bike() {\\n        // Override the inherited wheels field to 2:\\n        \\n    }\\n}\\npublic class Solution { public static int getWheels() { return new Bike().wheels; } }"`,
  },
  // Day 20 eStarter
  {
    find: `eStarter: "class Payment {\\n    double getFee() { return 0.0; }\\n}\\nclass CardPayment extends Payment {\\n    @Override\\n    double getFee() { return 2.50; }\\n}\\npublic class Solution {\\n    public static double testFee() {\\n        Payment p = new CardPayment();\\n        return p.getFee();\\n    }\\n}"`,
    replace: `eStarter: "class Payment {\\n    double getFee() { return 0.0; }\\n}\\nclass CardPayment extends Payment {\\n    @Override\\n    double getFee() {\\n        // Return the card payment fee (2.50):\\n        \\n    }\\n}\\npublic class Solution {\\n    public static double testFee() { Payment p = new CardPayment(); return p.getFee(); }\\n}"`,
  },
  // Day 20 aStarter
  {
    find: `aStarter: "class Animal { String speak() { return \\"...\\"; } }\\nclass Cat extends Animal { @Override String speak() { return \\"Meow\\"; } }\\npublic class Solution { public static String test() { Animal a = new Cat(); return a.speak(); } }"`,
    replace: `aStarter: "class Animal { String speak() { return \\"...\\"; } }\\nclass Cat extends Animal {\\n    @Override\\n    String speak() {\\n        // Return \\"Meow\\":\\n        \\n    }\\n}\\npublic class Solution { public static String test() { Animal a = new Cat(); return a.speak(); } }"`,
  },
  // Day 21 eStarter
  {
    find: `eStarter: "interface PaymentGateway {\\n    boolean processPayment(double amount);\\n}\\nclass CryptoGateway implements PaymentGateway {\\n    public boolean processPayment(double amount) {\\n        return amount > 0;\\n    }\\n}\\npublic class Solution {\\n    public static boolean execute(double amt) {\\n        PaymentGateway gw = new CryptoGateway();\\n        return gw.processPayment(amt);\\n    }\\n}"`,
    replace: `eStarter: "interface PaymentGateway {\\n    boolean processPayment(double amount);\\n}\\nclass CryptoGateway implements PaymentGateway {\\n    public boolean processPayment(double amount) {\\n        // Return true if amount is positive (> 0):\\n        \\n    }\\n}\\npublic class Solution {\\n    public static boolean execute(double amt) { PaymentGateway gw = new CryptoGateway(); return gw.processPayment(amt); }\\n}"`,
  },
  // Day 21 aStarter
  {
    find: `aStarter: "interface Printable { String print(); }\\nclass Document implements Printable { public String print() { return \\"Document printed\\"; } }\\npublic class Solution { public static String test() { Printable p = new Document(); return p.print(); } }"`,
    replace: `aStarter: "interface Printable { String print(); }\\nclass Document implements Printable {\\n    public String print() {\\n        // Return \\"Document printed\\":\\n        \\n    }\\n}\\npublic class Solution { public static String test() { Printable p = new Document(); return p.print(); } }"`,
  },
  // Day 22 eStarter
  {
    find: `eStarter: "class Counter {\\n    static int count = 0;\\n    Counter() { count++; }\\n}\\npublic class Solution {\\n    public static int testCount() {\\n        Counter.count = 0;\\n        new Counter();\\n        new Counter();\\n        new Counter();\\n        return Counter.count;\\n    }\\n}"`,
    replace: `eStarter: "class Counter {\\n    static int count = 0;\\n    Counter() {\\n        // Increment the shared static count field each time an instance is created:\\n        \\n    }\\n}\\npublic class Solution {\\n    public static int testCount() {\\n        Counter.count = 0; new Counter(); new Counter(); new Counter(); return Counter.count;\\n    }\\n}"`,
  },
  // Day 22 aStarter
  {
    find: `aStarter: "class MathUtil { public static int square(int n) { return n * n; } }\\npublic class Solution { public static int test() { return MathUtil.square(6); } }"`,
    replace: `aStarter: "class MathUtil {\\n    public static int square(int n) {\\n        // Return n multiplied by itself:\\n        \\n    }\\n}\\npublic class Solution { public static int test() { return MathUtil.square(6); } }"`,
  },
  // Day 23 eStarter
  {
    find: `eStarter: "public class Solution {\\n    public static int safeDivide(int a, int b) {\\n        try {\\n            return a / b;\\n        } catch (ArithmeticException e) {\\n            return -1;\\n        }\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int safeDivide(int a, int b) {\\n        // Try to return a / b. If ArithmeticException (division by zero), return -1:\\n        \\n    }\\n}"`,
  },
  // Day 23 aStarter
  {
    find: `aStarter: "public class Solution {\\n    public static int safeGet(int[] arr, int i) {\\n        try { return arr[i]; } catch (ArrayIndexOutOfBoundsException e) { return -1; }\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static int safeGet(int[] arr, int i) {\\n        // Try to return arr[i]. If index is out of bounds, return -1:\\n        \\n    }\\n}"`,
  },
  // Day 24 eStarter
  {
    find: `eStarter: "public class Solution {\\n    public static void validateDeposit(int amt) {\\n        if (amt <= 0) throw new IllegalArgumentException(\\"Deposit must be positive\\");\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static void validateDeposit(int amt) {\\n        // If amt is 0 or negative, throw new IllegalArgumentException with a message:\\n        \\n    }\\n}"`,
  },
  // Day 24 aStarter
  {
    find: `aStarter: "public class Solution {\\n    public static void checkAge(int age) {\\n        if (age < 18) throw new IllegalArgumentException(\\"Underage\\");\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static void checkAge(int age) {\\n        // If age is below 18, throw new IllegalArgumentException(\\"Underage\\"):\\n        \\n    }\\n}"`,
  },
  // Day 25 eStarter
  {
    find: `eStarter: "import java.util.ArrayList;\\n\\npublic class Solution {\\n    public static ArrayList<Integer> filterAbove(int[] scores, int cutoff) {\\n        ArrayList<Integer> list = new ArrayList<>();\\n        for (int s : scores) {\\n            if (s > cutoff) list.add(s);\\n        }\\n        return list;\\n    }\\n}"`,
    replace: `eStarter: "import java.util.ArrayList;\\n\\npublic class Solution {\\n    public static ArrayList<Integer> filterAbove(int[] scores, int cutoff) {\\n        // Create an ArrayList<Integer>, add each score that is > cutoff, return the list:\\n        \\n    }\\n}"`,
  },
  // Day 25 aStarter
  {
    find: `aStarter: "import java.util.ArrayList;\\npublic class Solution {\\n    public static ArrayList<String> createList(String a, String b) {\\n        ArrayList<String> l = new ArrayList<>(); l.add(a); l.add(b); return l;\\n    }\\n}"`,
    replace: `aStarter: "import java.util.ArrayList;\\npublic class Solution {\\n    public static ArrayList<String> createList(String a, String b) {\\n        // Create an ArrayList<String>, add a then b, and return it:\\n        \\n    }\\n}"`,
  },
  // Day 26 eStarter
  {
    find: `eStarter: "import java.util.HashMap;\\n\\npublic class Solution {\\n    public static HashMap<String, Integer> countFrequency(String[] words) {\\n        HashMap<String, Integer> map = new HashMap<>();\\n        for (String w : words) {\\n            map.put(w, map.getOrDefault(w, 0) + 1);\\n        }\\n        return map;\\n    }\\n}"`,
    replace: `eStarter: "import java.util.HashMap;\\n\\npublic class Solution {\\n    public static HashMap<String, Integer> countFrequency(String[] words) {\\n        // Create a HashMap<String,Integer>, loop through words,\\n        // use map.getOrDefault(w, 0) + 1 to tally each word:\\n        \\n    }\\n}"`,
  },
  // Day 26 aStarter
  {
    find: `aStarter: "import java.util.HashMap;\\npublic class Solution {\\n    public static int getStock(HashMap<String, Integer> map, String item) {\\n        return map.getOrDefault(item, 0);\\n    }\\n}"`,
    replace: `aStarter: "import java.util.HashMap;\\npublic class Solution {\\n    public static int getStock(HashMap<String, Integer> map, String item) {\\n        // Return map.getOrDefault(item, 0):\\n        \\n    }\\n}"`,
  },
  // Day 27 eStarter
  {
    find: `eStarter: "class Pair<K, V> {\\n    private K key;\\n    private V val;\\n    public Pair(K key, V val) { this.key = key; this.val = val; }\\n    public K getKey() { return key; }\\n    public V getVal() { return val; }\\n}\\npublic class Solution {\\n    public static String testPair() {\\n        Pair<String, Integer> p = new Pair<>(\\"Age\\", 22);\\n        return p.getKey() + \\": \\" + p.getVal();\\n    }\\n}"`,
    replace: `eStarter: "class Pair<K, V> {\\n    private K key;\\n    private V val;\\n    public Pair(K key, V val) {\\n        // Assign parameters using 'this':\\n        \\n    }\\n    public K getKey() {\\n        // Return the key field:\\n        \\n    }\\n    public V getVal() {\\n        // Return the val field:\\n        \\n    }\\n}\\npublic class Solution {\\n    public static String testPair() {\\n        Pair<String, Integer> p = new Pair<>(\\"Age\\", 22);\\n        return p.getKey() + \\": \\" + p.getVal();\\n    }\\n}"`,
  },
  // Day 27 aStarter
  {
    find: `aStarter: "class Box<T> { private T item; public void set(T item) { this.item = item; } public T get() { return item; } }\\npublic class Solution { public static String test() { Box<String> b = new Box<>(); b.set(\\"Present\\"); return b.get(); } }"`,
    replace: `aStarter: "class Box<T> {\\n    private T item;\\n    public void set(T item) {\\n        // Store item in the field:\\n        \\n    }\\n    public T get() {\\n        // Return the stored item:\\n        \\n    }\\n}\\npublic class Solution { public static String test() { Box<String> b = new Box<>(); b.set(\\"Present\\"); return b.get(); } }"`,
  },
  // Day 28 eStarter
  {
    find: `eStarter: "class Worker implements Runnable {\\n    public void run() {\\n        System.out.println(\\"Work Done\\");\\n    }\\n}\\npublic class Solution {\\n    public static void execute() {\\n        Worker w = new Worker();\\n        w.run();\\n    }\\n}"`,
    replace: `eStarter: "class Worker implements Runnable {\\n    public void run() {\\n        // Print \\"Work Done\\" to stdout:\\n        \\n    }\\n}\\npublic class Solution {\\n    public static void execute() { Worker w = new Worker(); w.run(); }\\n}"`,
  },
  // Day 28 aStarter
  {
    find: `aStarter: "public class Solution { public static boolean isRunning(Thread t) { return t != null && t.isAlive(); } }"`,
    replace: `aStarter: "public class Solution {\\n    public static boolean isRunning(Thread t) {\\n        // Return true if t is not null AND t.isAlive():\\n        \\n    }\\n}"`,
  },
  // Day 29 eStarter
  {
    find: `eStarter: "import java.io.*;\\n\\npublic class Solution {\\n    public static int countErrorLines(String streamText) {\\n        if (streamText == null) return 0;\\n        int count = 0;\\n        try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {\\n            String line;\\n            while ((line = reader.readLine()) != null) {\\n                if (line.trim().startsWith(\\"[ERROR]\\")) count++;\\n            }\\n        } catch (Exception e) {}\\n        return count;\\n    }\\n}"`,
    replace: `eStarter: "import java.io.*;\\n\\npublic class Solution {\\n    public static int countErrorLines(String streamText) {\\n        // Return 0 for null input. Use BufferedReader(new StringReader(streamText)).\\n        // Read each line; count++ if it starts with \\"[ERROR]\\":\\n        \\n    }\\n}"`,
  },
  // Day 29 aStarter
  {
    find: `aStarter: "import java.io.*;\\nimport java.util.ArrayList;\\n\\npublic class Solution {\\n    public static ArrayList<String> extractFirstColumn(String csvText) {\\n        ArrayList<String> res = new ArrayList<>();\\n        if (csvText == null) return res;\\n        try (BufferedReader reader = new BufferedReader(new StringReader(csvText))) {\\n            String line;\\n            while ((line = reader.readLine()) != null) {\\n                String[] parts = line.split(\\",\\");\\n                if (parts.length > 0 && !parts[0].trim().isEmpty()) res.add(parts[0].trim());\\n            }\\n        } catch (Exception e) {}\\n        return res;\\n    }\\n}"`,
    replace: `aStarter: "import java.io.*;\\nimport java.util.ArrayList;\\n\\npublic class Solution {\\n    public static ArrayList<String> extractFirstColumn(String csvText) {\\n        // Return empty list for null. Use BufferedReader to read each line.\\n        // Split by \\",\\" and add parts[0].trim() to the result list:\\n        \\n    }\\n}"`,
  },
  // Day 30 eStarter
  {
    find: `eStarter: "public class Solution {\\n    public static int auditLedger(int[] amounts, int limit) {\\n        int sum = 0;\\n        for (int a : amounts) {\\n            if (a > limit) sum += a;\\n        }\\n        return sum;\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int auditLedger(int[] amounts, int limit) {\\n        // Loop through amounts. If any amount is strictly greater than limit, add it to sum.\\n        // Return sum (start at 0):\\n        \\n    }\\n}"`,
  },
  // Day 30 aStarter
  {
    find: `aStarter: "public class Solution {\\n    public static int calculateBalance(int initialBalance, int[] txs) {\\n        int balance = initialBalance;\\n        if (txs != null) {\\n            for (int t : txs) balance += t;\\n        }\\n        return balance;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static int calculateBalance(int initialBalance, int[] txs) {\\n        // Start at initialBalance. If txs is not null, loop through and add each transaction.\\n        // Return the final balance:\\n        \\n    }\\n}"`,
  },
];

const text = fs.readFileSync(javaPath, 'utf8');
let result = text;
let fixed = 0;
let missed = 0;

for (const fix of FIXES) {
  if (result.includes(fix.find)) {
    result = result.replace(fix.find, fix.replace);
    fixed++;
  } else {
    console.log(`  ⚠️  NOT FOUND: ${fix.find.substring(0, 70)}...`);
    missed++;
  }
}

if (result !== text) {
  fs.writeFileSync(javaPath, result, 'utf8');
  console.log(`\n✅ Java pass 2: ${fixed}/${FIXES.length} fixes applied (${missed} missed). Saved.`);
} else {
  console.log(`\n⚠️  No changes made.`);
}
