import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { recordActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';

interface QuestionRequest {
  domainStream?: 'tech' | 'non_tech';
  domainSubTopic?: string;
  difficulty?: 'easy' | 'normal' | 'hard';
}

type DifficultyLevel = 'easy' | 'normal' | 'hard';

const NON_TECH_QUESTIONS: Record<string, Record<DifficultyLevel, any[]>> = {
  finance: {
    easy: [
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
      }
    ],
    normal: [
      {
        id: 1,
        title: '1. Working Capital & Liquidity Ratio Analysis',
        description: 'Company Alpha has Current Assets of $150,000 (Inventory = $50,000, Cash = $40,000, Receivables = $60,000) and Current Liabilities of $75,000. Calculate Current Ratio & Quick (Acid-Test) Ratio.',
        type: 'worksheet',
        fields: [
          { key: 'currentRatio', label: 'Current Ratio (x)', placeholder: 'e.g. 2.0x' },
          { key: 'quickRatio', label: 'Quick Ratio (x)', placeholder: 'e.g. 1.33x' }
        ],
        promptHint: 'Evaluate whether the company faces short-term liquidity risk if inventory turnover slows down.'
      },
      {
        id: 2,
        title: '2. Net Present Value (NPV) & WACC Sensitivity',
        description: 'An investment costs $100,000 today and yields $35,000 annually for 4 years. With a cost of capital (WACC) of 8%, calculate project NPV and discounted payback period.',
        type: 'worksheet',
        fields: [
          { key: 'npv', label: 'Net Present Value ($)', placeholder: 'e.g. 15920' },
          { key: 'irr', label: 'Internal Rate of Return (%)', placeholder: 'e.g. 14.9%' }
        ],
        promptHint: 'How does an interest rate hike of 200 bps impact your capital allocation recommendation?'
      }
    ],
    hard: [
      {
        id: 1,
        title: '1. Leveraged Buyout (LBO) Debt Service & MOIC Modeling',
        description: 'A target company has $20M EBITDA. Acquisition multiple is 10x EBITDA funded with 60% Senior Debt at 7% interest and 40% Sponsor Equity. Assuming 5% annual EBITDA growth and debt amortized over 5 years, calculate Year 5 Exit Equity Value at 9x EBITDA and MOIC.',
        type: 'worksheet',
        fields: [
          { key: 'sponsorEquity', label: 'Initial Sponsor Equity ($M)', placeholder: 'e.g. 80' },
          { key: 'exitEquity', label: 'Year 5 Equity Value ($M)', placeholder: 'e.g. 175' },
          { key: 'moic', label: 'Multiple on Invested Capital (x)', placeholder: 'e.g. 2.19x' }
        ],
        promptHint: 'Analyze downside covenants and interest coverage ratio headroom under stagflation.'
      }
    ]
  },
  marketing: {
    easy: [
      {
        id: 1,
        title: '1. Conversion Funnel & A/B Test ROI',
        description: 'Your landing page receives 100,000 visitors. 5,000 click the CTA (5% CTR), and 500 complete a purchase (10% CR). Ad spend is $10,000 and total revenue generated is $35,000. Calculate ROAS and Conversion Rate.',
        type: 'worksheet',
        fields: [
          { key: 'roas', label: 'Return on Ad Spend (ROAS)', placeholder: 'e.g. 3.5x' },
          { key: 'overallCr', label: 'Overall Funnel Conversion Rate (%)', placeholder: 'e.g. 0.5%' }
        ],
        promptHint: 'Which stage of the funnel has the highest drop-off rate, and what optimization hypothesis would you test first?'
      }
    ],
    normal: [
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
      }
    ],
    hard: [
      {
        id: 1,
        title: '1. Multi-Touch Attribution & Marginal CAC Optimization',
        description: 'Cross-channel budget is $500,000 across Search, Social, and Influencer. Blended CAC is $85, but first-touch attribution inflates Search by 40% while linear attribution shows Paid Social diminishing returns beyond $150k. Calculate optimal reallocated spend and incremental blended CAC.',
        type: 'worksheet',
        fields: [
          { key: 'searchBudget', label: 'Optimized Search Budget ($)', placeholder: 'e.g. 220000' },
          { key: 'marginalCac', label: 'Marginal Blended CAC ($)', placeholder: 'e.g. 68' }
        ],
        promptHint: 'Defend your attribution model selection against executive bias toward last-click metrics.'
      }
    ]
  },
  bba: {
    easy: [
      {
        id: 1,
        title: '1. Basic Break-Even Volume Analysis',
        description: 'Fixed costs = $50,000. Unit variable cost = $10, Unit selling price = $20. Calculate Break-Even Units and Break-Even Revenue.',
        type: 'worksheet',
        fields: [
          { key: 'beUnits', label: 'Break-Even Volume (Units)', placeholder: 'e.g. 5000' },
          { key: 'beRevenue', label: 'Break-Even Revenue ($)', placeholder: 'e.g. 100000' }
        ],
        promptHint: 'Explain the margin of safety.'
      }
    ],
    normal: [
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
    hard: [
      {
        id: 1,
        title: '1. International Market Penetration & Currency Exposure',
        description: 'A manufacturing firm plans APAC market entry with $1.5M Capex. Expected revenues are denominated in JPY with a 15% projected currency depreciation against USD over 24 months. Compute unhedged vs forward-hedged IRR.',
        type: 'worksheet',
        fields: [
          { key: 'unhedgedIrr', label: 'Unhedged Expected IRR (%)', placeholder: 'e.g. 11.2%' },
          { key: 'hedgedIrr', label: 'Hedged Risk-Adjusted IRR (%)', placeholder: 'e.g. 14.8%' }
        ],
        promptHint: 'Present a currency hedging and supply-chain localization risk mitigation strategy.'
      }
    ]
  },
  operations: {
    easy: [
      {
        id: 1,
        title: '1. Basic Inventory Turnover & Holding Period',
        description: 'COGS = $400,000 and Average Inventory = $80,000. Calculate Inventory Turnover Ratio and Days Sales in Inventory (DSI).',
        type: 'worksheet',
        fields: [
          { key: 'turnover', label: 'Inventory Turnover (x)', placeholder: 'e.g. 5.0x' },
          { key: 'dsi', label: 'Days Sales of Inventory (Days)', placeholder: 'e.g. 73' }
        ],
        promptHint: 'How does high DSI impact working capital?'
      }
    ],
    normal: [
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
    ],
    hard: [
      {
        id: 1,
        title: '1. Supply Chain Resilience & Multi-Echelon Safety Stock',
        description: 'A global distribution network has 3 regional hubs with lead time standard deviation of 4 days and daily demand variance of 400 units^2. With a target service level of 98% (Z=2.05), calculate safety stock per hub and pooled variance benefit.',
        type: 'worksheet',
        fields: [
          { key: 'decentralizedStock', label: 'Total Decentralized Safety Stock (Units)', placeholder: 'e.g. 2460' },
          { key: 'pooledStock', label: 'Centralized Safety Stock (Units)', placeholder: 'e.g. 1420' }
        ],
        promptHint: 'Contrast holding cost savings against air-freight expediting penalties during disruptions.'
      }
    ]
  }
};

const TECH_QUESTIONS_BY_DIFFICULTY: Record<DifficultyLevel, any[]> = {
  easy: [
    {
      id: 1,
      title: '1. Reverse a String (Easy)',
      description: 'Write a Java method `public String reverse(String s)` that returns the reversed version of the input string `s`.',
      type: 'code',
      defaultCode: `public class Solution {\n    public String reverse(String s) {\n        // TODO: Implement your solution here\n        return "";\n    }\n}`,
      methodName: 'reverse',
      tests: [
        { label: '"hello"', args: ["hello"], expected: "olleh", verify: (res: any) => res === "olleh" },
        { label: '"Java"', args: ["Java"], expected: "avaJ", verify: (res: any) => res === "avaJ" },
        { label: '""', args: [""], expected: "", verify: (res: any) => res === "" }
      ]
    },
    {
      id: 2,
      title: '2. Find Maximum in Array (Easy)',
      description: 'Write a Java method `public int findMax(int[] arr)` that returns the maximum integer inside the array `arr`.',
      type: 'code',
      defaultCode: `public class Solution {\n    public int findMax(int[] arr) {\n        // TODO: Implement your solution here\n        return 0;\n    }\n}`,
      methodName: 'findMax',
      tests: [
        { label: '[1, 5, 3, 9, 2]', args: [[1, 5, 3, 9, 2]], expected: "9", verify: (res: any) => Number(res) === 9 },
        { label: '[-10, -5, -3, -1]', args: [[-10, -5, -3, -1]], expected: "-1", verify: (res: any) => Number(res) === -1 }
      ]
    }
  ],
  normal: [
    {
      id: 1,
      title: '1. Is Palindrome String (Medium)',
      description: 'Write a Java method `public boolean isPalindrome(String s)` that returns true if string `s` is a palindrome (case-insensitive).',
      type: 'code',
      defaultCode: `public class Solution {\n    public boolean isPalindrome(String s) {\n        // TODO: Implement your solution here\n        return false;\n    }\n}`,
      methodName: 'isPalindrome',
      tests: [
        { label: '"racecar"', args: ["racecar"], expected: "true", verify: (res: any) => String(res) === 'true' },
        { label: '"Hello"', args: ["Hello"], expected: "false", verify: (res: any) => String(res) === 'false' },
        { label: '"Madam"', args: ["Madam"], expected: "true", verify: (res: any) => String(res) === 'true' }
      ]
    },
    {
      id: 2,
      title: '2. Count Specific Elements (Medium)',
      description: 'Write a Java method `public int countOccurrences(int[] arr, int target)` that counts occurrences of target in arr.',
      type: 'code',
      defaultCode: `public class Solution {\n    public int countOccurrences(int[] arr, int target) {\n        // TODO: Implement your solution here\n        return 0;\n    }\n}`,
      methodName: 'countOccurrences',
      tests: [
        { label: '[1, 2, 3, 2, 2], target 2', args: [[1, 2, 3, 2, 2], 2], expected: "3", verify: (res: any) => Number(res) === 3 },
        { label: '[4, 5, 6], target 9', args: [[4, 5, 6], 9], expected: "0", verify: (res: any) => Number(res) === 0 }
      ]
    }
  ],
  hard: [
    {
      id: 1,
      title: '1. Subarray Sum Equals K (Hard)',
      description: 'Write a Java method `public int subarraySum(int[] nums, int k)` returning the total number of continuous subarrays whose sum equals k.',
      type: 'code',
      defaultCode: `public class Solution {\n    public int subarraySum(int[] nums, int k) {\n        // TODO: Implement O(N) prefix sum solution here\n        return 0;\n    }\n}`,
      methodName: 'subarraySum',
      tests: [
        { label: '[1, 1, 1], k=2', args: [[1, 1, 1], 2], expected: "2", verify: (res: any) => Number(res) === 2 },
        { label: '[1, 2, 3], k=3', args: [[1, 2, 3], 3], expected: "2", verify: (res: any) => Number(res) === 2 }
      ]
    },
    {
      id: 2,
      title: '2. Longest Substring Without Repeating Characters (Hard)',
      description: 'Write a Java method `public int lengthOfLongestSubstring(String s)` returning the length of the longest unique substring.',
      type: 'code',
      defaultCode: `public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // TODO: Implement sliding window solution here\n        return 0;\n    }\n}`,
      methodName: 'lengthOfLongestSubstring',
      tests: [
        { label: '"abcabcbb"', args: ["abcabcbb"], expected: "3", verify: (res: any) => Number(res) === 3 },
        { label: '"bbbbb"', args: ["bbbbb"], expected: "1", verify: (res: any) => Number(res) === 1 }
      ]
    }
  ]
};

/**
 * POST /api/interview/generate-questions
 * Generates tailored questions based on domain stream, specialization, and difficulty.
 */
export async function POST(req: Request) {
  console.log('[Question Generator API] Incoming request to /api/interview/generate-questions');
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      console.warn('[Question Generator API] Auth verification failed');
      return gated.error;
    }

    const { domainStream, domainSubTopic, difficulty } = (await req.json().catch(() => ({}))) as QuestionRequest;
    const diff: DifficultyLevel = difficulty === 'easy' || difficulty === 'hard' ? difficulty : 'normal';
    console.log(`[Question Generator API] User: ${gated.user.id} | Stream: ${domainStream} | SubTopic: ${domainSubTopic} | Difficulty: ${diff}`);

    recordActiveLiveInterview(gated.user.id, domainSubTopic || 'Technical Interview', 'round2_coding');

    if (domainStream === 'non_tech') {
      const topicKey = (domainSubTopic || 'finance').toLowerCase();
      const topicBucket = NON_TECH_QUESTIONS[topicKey] || NON_TECH_QUESTIONS.finance;
      const matched = topicBucket[diff] || topicBucket.normal || topicBucket.easy;
      console.log(`[Question Generator API] Returned ${matched.length} non-tech worksheet questions for ${topicKey} (${diff})`);
      return NextResponse.json({ questions: matched, difficulty: diff });
    } else {
      const matched = TECH_QUESTIONS_BY_DIFFICULTY[diff] || TECH_QUESTIONS_BY_DIFFICULTY.normal;
      console.log(`[Question Generator API] Returned ${matched.length} tech coding questions (${diff})`);
      return NextResponse.json({ questions: matched, difficulty: diff });
    }
  } catch (err: any) {
    console.error('[Question Generator API Error]:', err);
    return NextResponse.json({ questions: TECH_QUESTIONS_BY_DIFFICULTY.normal, difficulty: 'normal' });
  }
}
