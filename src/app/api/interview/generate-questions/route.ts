import { NextResponse } from 'next/server';

interface QuestionRequest {
  domainStream: 'tech' | 'non_tech';
  domainSubTopic: string;
  difficulty: 'easy' | 'normal' | 'hard';
}

const PRESET_NON_TECH_QUESTIONS: Record<string, any[]> = {
  finance: [
    {
      id: 1,
      title: '1. Net Profit Margin & EBITDA Calculation',
      description: 'A company reports Revenue = $500,000, Cost of Goods Sold (COGS) = $280,000, Operating Expenses = $90,000, Interest = $10,000, and Tax = $24,000. Calculate (a) Gross Margin %, (b) Operating Income (EBITDA), and (c) Net Profit Margin %.',
      type: 'worksheet',
      fields: [
        { key: 'grossMargin', label: 'Gross Margin (%)', placeholder: 'e.g. 44%' },
        { key: 'ebitda', label: 'Operating Income / EBITDA ($)', placeholder: 'e.g. 130000' },
        { key: 'netMargin', label: 'Net Profit Margin (%)', placeholder: 'e.g. 19.2%' }
      ],
      promptHint: 'Explain your financial reasoning and whether this operating margin is healthy for an enterprise.'
    },
    {
      id: 2,
      title: '2. Working Capital & Liquidity Ratio Analysis',
      description: 'Company Alpha has Current Assets of $150,000 (Inventory = $50,000, Cash = $40,000, Receivables = $60,000) and Current Liabilities of $75,000. Calculate Current Ratio & Quick (Acid-Test) Ratio.',
      type: 'worksheet',
      fields: [
        { key: 'currentRatio', label: 'Current Ratio (x)', placeholder: 'e.g. 2.0x' },
        { key: 'quickRatio', label: 'Quick Ratio (x)', placeholder: 'e.g. 1.33x' }
      ],
      promptHint: 'Evaluate whether the company faces short-term liquidity risk if inventory turnover slows down.'
    }
  ],
  marketing: [
    {
      id: 1,
      title: '1. CAC & LTV Unit Economics Optimization',
      description: 'An e-commerce brand spends $60,000 on ad channels to acquire 1,500 new customers. Average Order Value (AOV) is $80 with a 60% gross margin. Customers purchase 3 times per year and churn after 2 years. Calculate (a) CAC, (b) LTV, and (c) LTV:CAC Ratio.',
      type: 'worksheet',
      fields: [
        { key: 'cac', label: 'Customer Acquisition Cost ($)', placeholder: 'e.g. 40' },
        { key: 'ltv', label: 'Lifetime Value (LTV) ($)', placeholder: 'e.g. 288' },
        { key: 'ratio', label: 'LTV : CAC Ratio', placeholder: 'e.g. 7.2x' }
      ],
      promptHint: 'Is this acquisition channel sustainable? How would you reallocate budget to scale profitable campaigns?'
    },
    {
      id: 2,
      title: '2. Conversion Funnel & A/B Test ROI',
      description: 'Your landing page receives 100,000 visitors. 5,000 click the CTA (5% CTR), and 500 complete a purchase (10% CR). Ad spend is $10,000 and total revenue generated is $35,000. Calculate ROAS and Conversion Rate.',
      type: 'worksheet',
      fields: [
        { key: 'roas', label: 'Return on Ad Spend (ROAS)', placeholder: 'e.g. 3.5x' },
        { key: 'overallCr', label: 'Overall Funnel Conversion Rate (%)', placeholder: 'e.g. 0.5%' }
      ],
      promptHint: 'Which stage of the funnel has the highest drop-off rate, and what optimization hypothesis would you test first?'
    }
  ],
  bba: [
    {
      id: 1,
      title: '1. Market Expansion & Break-Even Analysis',
      description: 'A retail firm considers expanding to a new city. Fixed overhead cost = $120,000/year. Variable cost per unit = $15, Selling price = $45 per unit. Calculate the Break-Even Quantity (units) and Break-Even Revenue ($).',
      type: 'worksheet',
      fields: [
        { key: 'beUnits', label: 'Break-Even Volume (Units)', placeholder: 'e.g. 4000' },
        { key: 'beRevenue', label: 'Break-Even Revenue ($)', placeholder: 'e.g. 180000' }
      ],
      promptHint: 'Outline key operational risks during the market expansion phase.'
    }
  ],
  operations: [
    {
      id: 1,
      title: '1. Economic Order Quantity (EOQ) & Inventory Costs',
      description: 'Annual demand for a key raw material is 10,000 units. Ordering cost = $50 per order, and Carrying/Holding cost = $4 per unit/year. Calculate the Economic Order Quantity (EOQ).',
      type: 'worksheet',
      fields: [
        { key: 'eoq', label: 'EOQ (Units per Order)', placeholder: 'e.g. 500' }
      ],
      promptHint: 'Explain how just-in-time (JIT) delivery would impact inventory holding costs.'
    }
  ]
};

const PRESET_TECH_QUESTIONS = [
  {
    id: 1,
    title: '1. Reverse a String (Easy)',
    description: 'Write a Java method `public String reverse(String s)` that returns the reversed version of the input string `s`.',
    type: 'code',
    defaultCode: `public class Solution {\n    public String reverse(String s) {\n        // Your code here\n        return new StringBuilder(s).reverse().toString();\n    }\n}`,
    methodName: 'reverse',
    tests: [
      { label: '"hello"', args: ["hello"], expected: "olleh", verify: (res: any) => res === "olleh" },
      { label: '"Java"', args: ["Java"], expected: "avaJ", verify: (res: any) => res === "avaJ" },
      { label: '""', args: [""], expected: "", verify: (res: any) => res === "" }
    ]
  },
  {
    id: 2,
    title: '2. Find Maximum in Array (Medium)',
    description: 'Write a Java method `public int findMax(int[] arr)` that returns the maximum integer inside the array `arr`.',
    type: 'code',
    defaultCode: `public class Solution {\n    public int findMax(int[] arr) {\n        int max = arr[0];\n        for(int val : arr) if(val > max) max = val;\n        return max;\n    }\n}`,
    methodName: 'findMax',
    tests: [
      { label: '[1, 5, 3, 9, 2]', args: [[1, 5, 3, 9, 2]], expected: "9", verify: (res: any) => Number(res) === 9 },
      { label: '[-10, -5, -3, -1]', args: [[-10, -5, -3, -1]], expected: "-1", verify: (res: any) => Number(res) === -1 }
    ]
  },
  {
    id: 3,
    title: '3. Is Palindrome String (Hard)',
    description: 'Write a Java method `public boolean isPalindrome(String s)` that returns true if string `s` is a palindrome.',
    type: 'code',
    defaultCode: `public class Solution {\n    public boolean isPalindrome(String s) {\n        String clean = s.toLowerCase();\n        return new StringBuilder(clean).reverse().toString().equals(clean);\n    }\n}`,
    methodName: 'isPalindrome',
    tests: [
      { label: '"racecar"', args: ["racecar"], expected: "true", verify: (res: any) => String(res) === 'true' },
      { label: '"Hello"', args: ["Hello"], expected: "false", verify: (res: any) => String(res) === 'false' }
    ]
  }
];

export async function POST(req: Request) {
  try {
    const { domainStream, domainSubTopic, difficulty } = await req.json() as QuestionRequest;

    if (domainStream === 'non_tech') {
      const topicKey = (domainSubTopic || 'finance').toLowerCase();
      const matched = PRESET_NON_TECH_QUESTIONS[topicKey] || PRESET_NON_TECH_QUESTIONS.finance;
      return NextResponse.json({ questions: matched });
    } else {
      return NextResponse.json({ questions: PRESET_TECH_QUESTIONS });
    }
  } catch (err: any) {
    return NextResponse.json({ questions: PRESET_TECH_QUESTIONS });
  }
}
