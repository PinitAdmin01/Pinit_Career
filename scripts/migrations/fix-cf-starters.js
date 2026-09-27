/**
 * Fix Computer Fundamentals trivial aStarters.
 * Pattern: "aStarter": "function X() { return LITERAL; }"
 * Replace: "aStarter": "function X() {\n  // Write your answer here\n}"
 *
 * Also fixes Java pre-solved eStarters and aStarters (Days 6-30)
 * by stripping the implementation body to a stub.
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'src', 'lib', 'data');

// ── Computer Fundamentals: trivial no-param aStarters ──────────────────────
function fixCfTrivialStarters(text) {
  // Match: "aStarter": "function NAME() { return ANYTHING; }"
  // where ANYTHING doesn't contain double-quotes
  const re = /"aStarter": "(function (\w+)\(\) \{ return [^"]+; \})"/g;
  let count = 0;
  const fixed = text.replace(re, (match, body, fname) => {
    count++;
    return `"aStarter": "function ${fname}() {\\n  // Write your answer here\\n}"`;
  });
  console.log(`  CF trivial aStarters fixed: ${count}`);
  return fixed;
}

// ── Java: strip pre-solved Java starters to proper stubs ──────────────────────
// For Java, eStarter/aStarter patterns in TypeScript (unquoted keys):
//   eStarter: "public class Solution {\n    public static TYPE METHOD(PARAMS) {\n        IMPL\n    }\n}"
// We want to keep the class shell and method signature but empty the body.
//
// Strategy: find method bodies that are NOT just comments/empty and strip them.

function extractJavaMethodName(body) {
  const m = body.match(/public static \S+ (\w+)\s*\(/);
  return m ? m[1] : null;
}

function isJavaStubAlready(body) {
  // A stub has empty body or just comments
  // Pre-solved has actual statements beyond just variable declarations leading to return
  const lines = body.split('\\n').filter(l => l.trim() && !l.trim().startsWith('//'));
  // Count substantive lines inside the method body (exclude class/method signature lines)
  const methodBodyLines = lines.filter(l =>
    !l.includes('public class Solution') &&
    !l.includes('public static') &&
    l.trim() !== '{' &&
    l.trim() !== '}'
  );
  return methodBodyLines.length === 0;
}

// For Java, use targeted per-day fixes based on audit findings.
// Days 6-30 with pre-solved starters need to have their bodies replaced.
// We identify the starter by the method name and replace its body with a stub.

function makeJavaStub(methodSignatureLine, paramsHint) {
  // paramsHint helps write the stub comment
  return `${methodSignatureLine}\\n        // Write your implementation here:\\n        \\n    }`;
}

// This script handles the Java days flagged by the audit.
// We do targeted string replacements for each pre-solved starter.

const JAVA_FIXES = [
  // Day 6
  {
    find: `eStarter: "public class Solution {\\n    public static String getDayName(int day) {\\n        switch (day) {\\n            case 1: return \\"Monday\\";\\n            case 2: return \\"Tuesday\\";\\n            case 3: return \\"Wednesday\\";\\n            default: return \\"Unknown\\";\\n        }\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static String getDayName(int day) {\\n        // Use a switch statement — case 1 → Monday, 2 → Tuesday, 3 → Wednesday, default → Unknown:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static String getFeedback(char grade) {\\n        switch (grade) {\\n            case 'A': return \\"Excellent\\";\\n            case 'B': return \\"Good\\";\\n            default: return \\"Retake\\";\\n        }\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static String getFeedback(char grade) {\\n        // switch on grade — A → Excellent, B → Good, default → Retake:\\n        \\n    }\\n}"`,
  },
  // Day 7
  {
    find: `eStarter: "public class Solution {\\n    public static int factorial(int n) {\\n        int result = 1;\\n        int i = 1;\\n        while (i <= n) {\\n            result *= i;\\n            i++;\\n        }\\n        return result;\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int factorial(int n) {\\n        // Multiply 1*2*3*...*n using a while loop. Return 1 for n <= 1:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static int sumUpTo(int n) {\\n        int sum = 0, i = 1;\\n        while (i <= n) { sum += i; i++; }\\n        return sum;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static int sumUpTo(int n) {\\n        // Use a while loop — add i to sum, increment i, until i > n:\\n        \\n    }\\n}"`,
  },
  // Day 8
  {
    find: `eStarter: "public class Solution {\\n    public static int sumEvens(int n) {\\n        int sum = 0;\\n        for (int i = 2; i <= n; i += 2) {\\n            sum += i;\\n        }\\n        return sum;\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int sumEvens(int n) {\\n        // Use a for loop starting at 2, stepping by 2, up to n:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static String countDown(int start) {\\n        String res = \\"\\";\\n        for (int i = start; i >= 1; i--) { res += i + \\" \\"; }\\n        return res;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static String countDown(int start) {\\n        // Loop from start down to 1, appending each number + space to a String:\\n        \\n    }\\n}"`,
  },
  // Day 9 — also pre-solved but not flagged by simple heuristic
  {
    find: `eStarter: "public class Solution {\\n    public static double calculateTotal(double price, double taxRate) {\\n        return price + (price * taxRate);\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static double calculateTotal(double price, double taxRate) {\\n        // Return price plus the tax amount (price * taxRate):\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static int max(int a, int b) {\\n        return (a >= b) ? a : b;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static int max(int a, int b) {\\n        // Return the larger of a or b (use if/else or ternary):\\n        \\n    }\\n}"`,
  },
  // Day 10
  {
    find: `eStarter: "public class Solution {\\n    public static double applyDiscount(double p, double d) {\\n        return p - (p * d);\\n    }\\n    public static double finalPrice(double p, double d, double t) {\\n        double disc = applyDiscount(p, d);\\n        return disc + (disc * t);\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static double applyDiscount(double p, double d) {\\n        // Return p minus the discount amount (p * d):\\n        \\n    }\\n    public static double finalPrice(double p, double d, double t) {\\n        // Call applyDiscount, then add tax on the discounted price:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static double cToF(double c) {\\n        return (c * 9.0 / 5.0) + 32.0;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static double cToF(double c) {\\n        // Celsius to Fahrenheit: multiply by 9/5, then add 32:\\n        \\n    }\\n}"`,
  },
  // Day 11
  {
    find: `eStarter: "public class Solution {\\n    public static int calculateArea(int side) { return side * side; }\\n    public static int calculateArea(int l, int w) { return l * w; }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int calculateArea(int side) {\\n        // Return side squared:\\n        \\n    }\\n    public static int calculateArea(int l, int w) {\\n        // Return length * width:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static String repeat(String s) { return s + s; }\\n    public static String repeat(String s, int n) {\\n        String r = \\"\\"; for (int i=0; i<n; i++) r += s; return r;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static String repeat(String s) {\\n        // Return s concatenated with itself:\\n        \\n    }\\n    public static String repeat(String s, int n) {\\n        // Use a loop to concatenate s exactly n times:\\n        \\n    }\\n}"`,
  },
  // Day 12
  {
    find: `eStarter: "public class Solution {\\n    public static int findMax(int[] arr) {\\n        int max = arr[0];\\n        for (int i = 1; i < arr.length; i++) {\\n            if (arr[i] > max) max = arr[i];\\n        }\\n        return max;\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int findMax(int[] arr) {\\n        // Initialize max = arr[0], then loop from index 1 comparing each element:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static int sumArray(int[] arr) {\\n        int sum = 0;\\n        for (int i=0; i<arr.length; i++) sum += arr[i];\\n        return sum;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static int sumArray(int[] arr) {\\n        // Start sum = 0, loop through arr adding each element:\\n        \\n    }\\n}"`,
  },
  // Day 13
  {
    find: `eStarter: "public class Solution {\\n    public static int countPositives(int[] arr) {\\n        int count = 0;\\n        for (int n : arr) {\\n            if (n > 0) count++;\\n        }\\n        return count;\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int countPositives(int[] arr) {\\n        // Use a for-each loop — count++ each time n > 0:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static String joinStrings(String[] words) {\\n        String res = \\"\\";\\n        for (String w : words) res += w + \\",\\";\\n        return res;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static String joinStrings(String[] words) {\\n        // Use a for-each loop — append each word + ',' to a result String:\\n        \\n    }\\n}"`,
  },
  // Day 14
  {
    find: `eStarter: "public class Solution {\\n    public static int sumDiagonal(int[][] matrix) {\\n        int sum = 0;\\n        for (int i = 0; i < matrix.length; i++) {\\n            sum += matrix[i][i];\\n        }\\n        return sum;\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int sumDiagonal(int[][] matrix) {\\n        // Loop with index i, sum matrix[i][i] for each row:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static int countCells(int[][] grid) {\\n        int count = 0;\\n        for (int r=0; r<grid.length; r++) count += grid[r].length;\\n        return count;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static int countCells(int[][] grid) {\\n        // Loop through each row, add grid[r].length to total count:\\n        \\n    }\\n}"`,
  },
  // Day 15
  {
    find: `eStarter: "public class Solution {\\n    public static int binarySearch(int[] arr, int target) {\\n        int low = 0, high = arr.length - 1;\\n        while (low <= high) {\\n            int mid = low + (high - low) / 2;\\n            if (arr[mid] == target) return mid;\\n            if (arr[mid] < target) low = mid + 1;\\n            else high = mid - 1;\\n        }\\n        return -1;\\n    }\\n}"`,
    replace: `eStarter: "public class Solution {\\n    public static int binarySearch(int[] arr, int target) {\\n        // Set low=0, high=arr.length-1. Loop while low<=high:\\n        // Calculate mid, compare arr[mid] to target, adjust low or high:\\n        \\n    }\\n}"`,
  },
  {
    find: `aStarter: "public class Solution {\\n    public static int linearSearch(int[] arr, int target) {\\n        for (int i=0; i<arr.length; i++) if (arr[i] == target) return i;\\n        return -1;\\n    }\\n}"`,
    replace: `aStarter: "public class Solution {\\n    public static int linearSearch(int[] arr, int target) {\\n        // Loop through arr — if arr[i] equals target, return i. Return -1 after loop:\\n        \\n    }\\n}"`,
  },
  // Day 16 — class-based, partially pre-solved
  {
    find: `aStarter: "class Car {\\n    String model;\\n    int speed = 60;\\n    int getSpeed() { return speed; }\\n}\\npublic class Solution {\\n    public static int getSpeed() { return new Car().getSpeed(); }\\n}"`,
    replace: `aStarter: "class Car {\\n    String model;\\n    int speed;\\n    Car(String model, int speed) {\\n        // Initialize fields:\\n        \\n    }\\n    int getSpeed() {\\n        // Return the speed field:\\n        \\n    }\\n}\\npublic class Solution {\\n    public static int getSpeed() { return new Car(\\"SportX\\", 60).getSpeed(); }\\n}"`,
  },
];

function fixJavaStarters(text) {
  let result = text;
  let count = 0;
  for (const fix of JAVA_FIXES) {
    if (result.includes(fix.find)) {
      result = result.replace(fix.find, fix.replace);
      count++;
    } else {
      console.log(`  ⚠️  JAVA fix not found: ${fix.find.substring(0, 60)}...`);
    }
  }
  console.log(`  Java starters fixed: ${count}/${JAVA_FIXES.length}`);
  return result;
}

// ── Apply fixes ────────────────────────────────────────────────────────────────

// Fix CF
const cfPath = path.join(BASE, 'computerFundamentals30DayData.ts');
const cfText = fs.readFileSync(cfPath, 'utf8');
console.log('\nFixing Computer Fundamentals trivial aStarters...');
const cfFixed = fixCfTrivialStarters(cfText);
if (cfFixed !== cfText) {
  fs.writeFileSync(cfPath, cfFixed, 'utf8');
  console.log('  ✅ Computer Fundamentals saved.');
} else {
  console.log('  ⚠️  No CF changes made.');
}

// Fix Java
const javaPath = path.join(BASE, 'java30DayData.ts');
const javaText = fs.readFileSync(javaPath, 'utf8');
console.log('\nFixing Java pre-solved starters...');
const javaFixed = fixJavaStarters(javaText);
if (javaFixed !== javaText) {
  fs.writeFileSync(javaPath, javaFixed, 'utf8');
  console.log('  ✅ Java saved.');
} else {
  console.log('  ⚠️  No Java changes made.');
}

console.log('\nDone.\n');
