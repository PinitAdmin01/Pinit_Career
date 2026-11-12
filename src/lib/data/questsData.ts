import { BCOM_ACCOUNTING_30_DAYS_QUESTS } from './bcomAccounting30DayData';
import { BCOM_FINANCE_30_DAYS_QUESTS } from './bcomFinance30DayData';
import { BCOM_ANALYTICS_30_DAYS_QUESTS } from './bcomAnalytics30DayData';
import { BCOM_MARKETING_30_DAYS_QUESTS } from './bcomMarketing30DayData';
import { BCOM_DIGITAL_MARKETING_30_DAYS_QUESTS } from './bcomDigitalMarketing30DayData';
import { BCOM_ECOMMERCE_30_DAYS_QUESTS } from './bcomEcommerce30DayData';
import { BCOM_ENTREPRENEURSHIP_30_DAYS_QUESTS } from './bcomEntrepreneurship30DayData';
import { BCOM_SALES_CRM_30_DAYS_QUESTS } from './bcomSalesCrm30DayData';
import { BCOM_OPERATIONS_30_DAYS_QUESTS } from './bcomOperations30DayData';
import { BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS } from './bcomAiTransformation30DayData';
import { BCOM_AUDITING_30_DAYS_QUESTS } from './bcomAuditing30DayData';
import { BCOM_BANKING_30_DAYS_QUESTS } from './bcomBanking30DayData';
import { BCOM_LAW_30_DAYS_QUESTS } from './bcomLaw30DayData';
import { BCOM_TAXATION_30_DAYS_QUESTS } from './bcomTaxation30DayData';

export interface QuestData {
  id: string;
  title: string;
  desc: string;
  type: 'lecture' | 'interactive' | 'coding';
  requiresAvatar: boolean;
  starterCode?: string;
  hint?: string;
  testSuite?: string;
  syllabus?: string[]; // For lecture/interactive classes
  skillCategory?: 'programming' | 'soft-skills' | 'communication' | 'leadership' | 'theory';
}

export const QUESTS_REGISTRY: QuestData[] = [
  ...(BCOM_ACCOUNTING_30_DAYS_QUESTS as any[]),
  ...(BCOM_FINANCE_30_DAYS_QUESTS as any[]),
  ...(BCOM_ANALYTICS_30_DAYS_QUESTS as any[]),
  ...(BCOM_MARKETING_30_DAYS_QUESTS as any[]),
  ...(BCOM_DIGITAL_MARKETING_30_DAYS_QUESTS as any[]),
  ...(BCOM_ECOMMERCE_30_DAYS_QUESTS as any[]),
  ...(BCOM_ENTREPRENEURSHIP_30_DAYS_QUESTS as any[]),
  ...(BCOM_SALES_CRM_30_DAYS_QUESTS as any[]),
  ...(BCOM_OPERATIONS_30_DAYS_QUESTS as any[]),
  ...(BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS as any[]),
  ...(BCOM_AUDITING_30_DAYS_QUESTS as any[]),
  ...(BCOM_BANKING_30_DAYS_QUESTS as any[]),
  ...(BCOM_LAW_30_DAYS_QUESTS as any[]),
  ...(BCOM_TAXATION_30_DAYS_QUESTS as any[]),
  {
    // [FIX-STAGE: wave1c-java-quests-harness] Aligned language='java' + real Test.java harnesses for /api/code/run-java (replacing JS typeof/=== tests)
    id: 'fizzbuzz',
    title: 'Quest 1: FizzBuzz Mastery',
    desc: 'Write a Java method `fizzBuzz(int n)` returning "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for multiples of 3 and 5, and the number as a string for other cases.',
    type: 'coding',
    language: 'java',
    requiresAvatar: false,
    skillCategory: 'programming',
    starterCode: `public class Solution {\n    public String fizzBuzz(int n) {\n        // Write your code here\n        \n    }\n}`,
    hint: 'Use modulo operator % to check divisibility. Check n % 15 first.',
    testSuite: `public class Test {
  public static void main(String[] args) {
    Solution s = new Solution();
    if (!"Fizz".equals(s.fizzBuzz(3))) throw new RuntimeException("fizzBuzz(3) returned '" + s.fizzBuzz(3) + "', expected 'Fizz'");
    if (!"Buzz".equals(s.fizzBuzz(5))) throw new RuntimeException("fizzBuzz(5) returned '" + s.fizzBuzz(5) + "', expected 'Buzz'");
    if (!"FizzBuzz".equals(s.fizzBuzz(15))) throw new RuntimeException("fizzBuzz(15) returned '" + s.fizzBuzz(15) + "', expected 'FizzBuzz'");
    if (!"7".equals(s.fizzBuzz(7))) throw new RuntimeException("fizzBuzz(7) returned '" + s.fizzBuzz(7) + "', expected '7'");
    System.out.println("[PinIT][Fix:JavaQuest] fizzbuzz passed");
  }
}`
  },
  {
    id: 'reverser',
    title: 'Quest 2: String Reversal',
    desc: 'Write a Java method `reverse(String str)` returning the characters of the string in reverse order.',
    type: 'coding',
    language: 'java',
    requiresAvatar: false,
    skillCategory: 'programming',
    starterCode: `public class Solution {\n    public String reverse(String str) {\n        // Write your code here\n        \n    }\n}`,
    hint: 'You can loop backward through the string or use a StringBuilder.',
    testSuite: `public class Test {
  public static void main(String[] args) {
    Solution s = new Solution();
    if (!"olleh".equals(s.reverse("hello"))) throw new RuntimeException("reverse('hello') returned '" + s.reverse("hello") + "', expected 'olleh'");
    if (!"avaj".equals(s.reverse("java"))) throw new RuntimeException("reverse('java') returned '" + s.reverse("java") + "', expected 'avaj'");
    System.out.println("[PinIT][Fix:JavaQuest] reverser passed");
  }
}`
  },
  {
    id: 'arraysum',
    title: 'Quest 3: SDE Calculator Sum',
    desc: 'Write a Java method `sum(int[] arr)` returning the sum of all elements inside the integer array.',
    type: 'coding',
    language: 'java',
    requiresAvatar: false,
    skillCategory: 'programming',
    starterCode: `public class Solution {\n    public int sum(int[] arr) {\n        // Write your code here\n        \n    }\n}`,
    hint: 'Use a simple for loop to iterate over the array elements.',
    testSuite: `public class Test {
  public static void main(String[] args) {
    Solution s = new Solution();
    int r1 = s.sum(new int[]{1, 2, 3});
    if (r1 != 6) throw new RuntimeException("sum([1,2,3]) returned " + r1 + ", expected 6");
    int r2 = s.sum(new int[]{-1, 5, 20});
    if (r2 != 24) throw new RuntimeException("sum([-1,5,20]) returned " + r2 + ", expected 24");
    System.out.println("[PinIT][Fix:JavaQuest] arraysum passed");
  }
}`
  },
  {
    id: 'palindrome',
    title: 'Quest 4: Palindrome Checker',
    desc: 'Write a Java method `isPalindrome(String str)` returning true if the string reads the same forward and backward.',
    type: 'coding',
    language: 'java',
    requiresAvatar: false,
    skillCategory: 'programming',
    starterCode: `public class Solution {\n    public boolean isPalindrome(String str) {\n        // Write your code here\n        \n    }\n}`,
    hint: 'Compare characters from start and end, moving towards the middle.',
    testSuite: `public class Test {
  public static void main(String[] args) {
    Solution s = new Solution();
    if (!s.isPalindrome("racecar")) throw new RuntimeException("isPalindrome('racecar') expected true");
    if (s.isPalindrome("hello")) throw new RuntimeException("isPalindrome('hello') expected false");
    if (!s.isPalindrome("radar")) throw new RuntimeException("isPalindrome('radar') expected true");
    System.out.println("[PinIT][Fix:JavaQuest] palindrome passed");
  }
}`
  },
  {
    id: 'findmax',
    title: 'Quest 5: Array Max Finder',
    desc: 'Write a Java method `findMax(int[] arr)` returning the largest integer element inside the array.',
    type: 'coding',
    language: 'java',
    requiresAvatar: false,
    skillCategory: 'programming',
    starterCode: `public class Solution {\n    public int findMax(int[] arr) {\n        // Write your code here\n        \n    }\n}`,
    hint: 'Initialize max with the first element and update it as you iterate through the array.',
    testSuite: `public class Test {
  public static void main(String[] args) {
    Solution s = new Solution();
    int r1 = s.findMax(new int[]{1, 5, 3, 9, 2});
    if (r1 != 9) throw new RuntimeException("findMax([1,5,3,9,2]) returned " + r1 + ", expected 9");
    int r2 = s.findMax(new int[]{-10, -5, -20});
    if (r2 != -5) throw new RuntimeException("findMax([-10,-5,-20]) returned " + r2 + ", expected -5");
    System.out.println("[PinIT][Fix:JavaQuest] findmax passed");
  }
}`
  },
  {
    id: 'jvm-intro',
    title: 'Quest 6: Intro to Java & JVM Architecture',
    desc: 'Discuss the internals of the JVM (JVM memory areas: Stack, Heap, Metaspace) and the compilation process with your teacher.',
    type: 'lecture',
    requiresAvatar: true,
    skillCategory: 'theory',
    hint: 'Ask the teacher about JIT Compiler, Garbage Collection, and Stack vs Heap memory allocations.',
    syllabus: [
      'Understand bytecode compilation (.java to .class)',
      'Inspect the ClassLoader subsystem (Loading, Linking, Initialization)',
      'Explore runtime memory regions: Stack, Heap, Program Counter, Method Area',
      'Learn about JIT Compilation and the role of the Execution Engine'
    ]
  },
  {
    id: 'java-oop-principles',
    title: 'Quest 7: Java Object-Oriented Principles',
    desc: 'Engage in an interactive discussion with your teacher on Polymorphism, Inheritance, Encapsulation, and Abstraction.',
    type: 'interactive',
    requiresAvatar: true,
    skillCategory: 'theory',
    hint: 'Discuss static vs dynamic polymorphism, method overriding vs overloading, and interfaces vs abstract classes.',
    syllabus: [
      'Encapsulation (Access Modifiers, Getters/Setters, Data Hiding)',
      'Inheritance (IS-A relationships, method overriding, super keyword)',
      'Polymorphism (Runtime vs Compile-time, Method Overloading, Dynamic Dispatch)',
      'Abstraction (Abstract Classes vs Interfaces, loose coupling principles)'
    ]
  },
  {
    id: 'java-basic-syntax',
    title: 'Quest 8: Basic Syntax & Control Structures',
    desc: 'Discuss primitive data types, variable scopes, operator precedence, and loop control structures in Java.',
    type: 'interactive',
    requiresAvatar: true,
    skillCategory: 'theory',
    hint: 'Ask the teacher about local vs instance variable scopes, byte bounds, and post-increment vs pre-increment operators.',
    syllabus: [
      'Java Primitive Types (byte, short, int, long, float, double, boolean, char)',
      'Variable Lifecycles & Variable Scope boundaries',
      'Conditional Branching (if-else, switch expressions)',
      'Iterative Control Loops (for, while, do-while, and break/continue labels)'
    ]
  },
  {
    id: 'sde-leadership',
    title: 'Quest 9: SDE Leadership & Conflict Resolution',
    desc: 'Conduct a mock sprint planning session. Discuss how you resolve technical conflicts between team members and guide project timelines under pressure.',
    type: 'interactive',
    requiresAvatar: true,
    skillCategory: 'leadership',
    hint: 'Ask the teacher about active listening, sprint estimation metrics, and constructive conflict resolution models like the Thomas-Kilmann matrix.',
    syllabus: [
      'Understand agile team dynamics & sprint scoping estimations',
      'Learn conflict resolution strategies (Collaborating, Compromising)',
      'Practice prioritizing features under resource constraints',
      'Explain constructive feedback loops in code reviews'
    ]
  },
  {
    id: 'system-design-communication',
    title: 'Quest 10: Technical Communication & System Design',
    desc: 'Present and justify your microservice architecture design for a large-scale transaction system. Communicate trade-offs between SQL and NoSQL storage.',
    type: 'interactive',
    requiresAvatar: true,
    skillCategory: 'communication',
    hint: 'Discuss database replication, ACID vs BASE guarantees, and latency impacts of horizontal scaling.',
    syllabus: [
      'Articulate system design blueprints clearly to engineering leads',
      'Compare SQL (ACID consistency) vs NoSQL (horizontal scaling, eventual consistency)',
      'Explain load balancers, message queues, and caching layers (Redis/Memcached)',
      'Practice handling performance bottlenecks under high concurrent loads'
    ]
  }
];
