import { supabase } from '@/lib/supabaseClient';

export interface GdAvatar {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  gender: 'male' | 'female';
  vroidModel: string;
  voice: string;
  voiceName: string;
  trait: 'proactive' | 'reactive' | 'silent' | 'aggressive';
  styleTag: string;
  description: string;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {}
  return {};
}

export interface SuggestedTopic {
  title: string;
  objective: string;
  domain: 'technical' | 'sales' | 'business' | 'commerce';
  badge: string;
  starterPrompts: string[];
}

export const AVATARS: GdAvatar[] = [
  {
    id: 'priya',
    name: 'Ms. Priya',
    emoji: '🌟',
    role: 'People & Product Strategist',
    color: '#4f46e5',
    gender: 'female',
    vroidModel: '/avatars/priya_mentor.vrm',
    voice: 'en-IN-NeerjaNeural',
    voiceName: 'af_heart',
    trait: 'proactive',
    styleTag: 'Warm & Practical',
    description: 'Uses crisp everyday analogies to test whether an idea actually helps real people on day one.'
  },
  {
    id: 'rohan',
    name: 'Mr. Rohan',
    emoji: '⚡',
    role: 'Principal Systems Builder',
    color: '#0ea5e9',
    gender: 'male',
    vroidModel: '/avatars/rohan_mentor.vrm',
    voice: 'en-IN-PrabhatNeural',
    voiceName: 'am_fenrir',
    trait: 'reactive',
    styleTag: 'Fast & Concrete',
    description: 'Stress-tests ideas with real bottlenecks, edge cases, and rapid pilot trade-offs.'
  },
  {
    id: 'sneha',
    name: 'Ms. Sneha',
    emoji: '🎯',
    role: 'Growth & Customer Lead',
    color: '#f59e0b',
    gender: 'female',
    vroidModel: '/avatars/sneha_mentor.vrm',
    voice: 'en-IN-NeerjaNeural',
    voiceName: 'af_sarah',
    trait: 'proactive',
    styleTag: 'Story-First & Lively',
    description: 'Asks sharp customer-first questions about adoption, trust, and real human behavior.'
  },
  {
    id: 'akash',
    name: 'Mr. Akash',
    emoji: '🏛️',
    role: 'Boardroom Chair & Moderator',
    color: '#10b981',
    gender: 'male',
    vroidModel: '/avatars/akash_mentor.vrm',
    voice: 'en-IN-PrabhatNeural',
    voiceName: 'am_liam',
    trait: 'proactive',
    styleTag: 'Calm & Structured',
    description: 'Keeps debates crisp, fair, and executive-ready with clean transitions and measurable compromises.'
  },
  {
    id: 'vikram',
    name: 'Mr. Vikram',
    emoji: '📊',
    role: 'CFO & Unit-Economics Realist',
    color: '#ef4444',
    gender: 'male',
    vroidModel: '/avatars/vikram_mentor.vrm',
    voice: 'en-IN-PrabhatNeural',
    voiceName: 'bm_lewis',
    trait: 'aggressive',
    styleTag: 'Numbers & ROI',
    description: 'Cuts through hype using cash flow, margins, compliance, and unit economics.'
  },
  {
    id: 'divya',
    name: 'Ms. Divya',
    emoji: '🤝',
    role: 'Policy & Strategy Diplomat',
    color: '#ec4899',
    gender: 'female',
    vroidModel: '/avatars/divya_mentor.vrm',
    voice: 'en-IN-NeerjaNeural',
    voiceName: 'af_nicole',
    trait: 'reactive',
    styleTag: 'Poised & Unifying',
    description: 'Spots hidden blind spots and bridges clashing viewpoints into a smart middle path.'
  },
  {
    id: 'aisha',
    name: 'Ms. Aisha',
    emoji: '🔥',
    role: 'Venture Partner & Debater',
    color: '#8b5cf6',
    gender: 'female',
    vroidModel: '/avatars/aisha_mentor.vrm',
    voice: 'en-IN-NeerjaNeural',
    voiceName: 'af_sky',
    trait: 'aggressive',
    styleTag: 'Sharp & Incisive',
    description: 'Challenges weak assumptions head-on and demands proof over buzzwords.'
  },
  {
    id: 'kashyap',
    name: 'Mr. Kashyap',
    emoji: '⚔️',
    role: 'Devil\'s Advocate & Risk Lead',
    color: '#64748b',
    gender: 'male',
    vroidModel: '/avatars/kashyap_mentor.vrm',
    voice: 'en-IN-PrabhatNeural',
    voiceName: 'am_fenrir',
    trait: 'aggressive',
    styleTag: 'Witty & Skeptical',
    description: 'Plays sharp devil\'s advocate—exposes worst-case failure modes and competitive pushback.'
  },
  {
    id: 'anish',
    name: 'Mr. Anish',
    emoji: '🎙️',
    role: 'Executive Panel Moderator',
    color: '#06b6d4',
    gender: 'male',
    vroidModel: '/avatars/anish_mentor.vrm',
    voice: 'en-IN-PrabhatNeural',
    voiceName: 'am_adam',
    trait: 'proactive',
    styleTag: 'Upbeat & Fair',
    description: 'Keeps the room energetic, enforces clean turn discipline, and drives practical conclusions.'
  }
];

export const SUGGESTED_TOPICS: SuggestedTopic[] = [
  // ── TECH & AI ──
  {
    title: 'Will AI Coding Agents Replace Junior Developers or Supercharge Them?',
    objective: 'Decide how colleges and tech teams should hire and train entry-level engineers in the AI era.',
    domain: 'technical',
    badge: '🔥 Trending Tech',
    starterPrompts: [
      'AI automates boilerplate, so junior engineers should be trained more on debugging, system thinking, and code review.',
      'If companies stop hiring juniors today, where will senior architects come from five years from now?',
      'What skill becomes the biggest differentiator for a fresher when everyone has the same AI assistant?'
    ]
  },
  {
    title: 'Open-Source AI vs Closed Frontier Models: Who Wins Enterprise Trust?',
    objective: 'Debate privacy, cost, accuracy, and vendor lock-in for companies deploying AI at scale.',
    domain: 'technical',
    badge: '🤖 AI Strategy',
    starterPrompts: [
      'For regulated sectors like banking and healthcare, self-hosted open-source models win on data sovereignty.',
      'Closed models still ship faster with lower engineering overhead—isn\'t speed to market worth the API bill?',
      'Why not use a hybrid router: open models for routine tasks and frontier models only for hard reasoning?'
    ]
  },
  {
    title: 'Privacy vs Hyper-Personalization: Should Apps Track Everything for Better UX?',
    objective: 'Find the right balance between user consent, targeted features, and business monetization.',
    domain: 'technical',
    badge: '🛡️ Digital Ethics',
    starterPrompts: [
      'Users gladly share data when value is obvious, like UPI fraud alerts—hidden dark-pattern tracking is the real problem.',
      'Can startups in India still build profitable consumer apps without aggressive ad targeting?',
      'Strict opt-in privacy should be the default, with clear rewards if users choose to share preferences.'
    ]
  },

  // ── BUSINESS & STRATEGY ──
  {
    title: '10-Minute Quick Commerce in India: Genius Convenience or Cash-Burn Trap?',
    objective: 'Evaluate dark-store unit economics, rider welfare, and long-term profitability.',
    domain: 'business',
    badge: '🇮🇳 India Hot Topic',
    starterPrompts: [
      'Quick commerce works in dense metros because high order frequency plus ad revenue can cover dark-store rent.',
      'Wait—are customers truly loyal to 10-minute delivery, or will they vanish the moment discounts stop?',
      'How do we balance instant convenience with fair pay and road safety for delivery partners?'
    ]
  },
  {
    title: '4-Day Workweek vs 70-Hour Hustle Culture: What Builds Winning Companies?',
    objective: 'Debate productivity, burnout, innovation speed, and talent retention.',
    domain: 'business',
    badge: '⚖️ Workplace Debate',
    starterPrompts: [
      'Long hours measure fatigue, not output—focused 4-day sprints can beat distracted 70-hour weeks.',
      'Early-stage startups fighting global rivals often need intense sprints, so shouldn\'t hustle be optional with real equity?',
      'What metrics actually prove a team is productive without rewarding people just for staying online late?'
    ]
  },
  {
    title: 'Electric Vehicles vs Hybrids: Which Is Smarter for India\'s Next 10 Years?',
    objective: 'Weigh charging infrastructure, battery supply chains, affordability, and carbon impact.',
    domain: 'business',
    badge: '⚡ Mobility',
    starterPrompts: [
      'Strong hybrids cut fuel use immediately without waiting years for highway fast-chargers across Tier-2 cities.',
      'Going straight to EVs for two-wheelers and city fleets skips fossil dependency and builds domestic battery scale.',
      'Should government subsidies reward lower emissions per kilometer regardless of EV or hybrid tech?'
    ]
  },

  // ── COMMERCE / B.COM / FINANCE ──
  {
    title: 'Zero-Fee UPI: Public Digital Miracle or Silent Margin Squeeze on Banks?',
    objective: 'Assess whether zero-MDR UPI is sustainable and how fintechs and banks should monetize responsibly.',
    domain: 'commerce',
    badge: '💳 FinTech & B.Com',
    starterPrompts: [
      'Zero-fee UPI brought millions into formal banking, so the ecosystem wins via credit, insurance, and merchant lending.',
      'Without a small merchant fee on high-ticket transactions, who pays for server uptime and fraud protection?',
      'Should UPI keep small retail payments free while introducing a tiny transparent MDR for large enterprise merchants?'
    ]
  },
  {
    title: 'GST Compliance vs Ease of Doing Business for Indian MSMEs',
    objective: 'Debate how tax formalization impacts working capital, ITC matching, and small-business growth.',
    domain: 'commerce',
    badge: '🧾 Tax & Audit',
    starterPrompts: [
      'Formal GST invoicing unlocks cheaper bank loans for MSMEs, even if monthly reconciliation feels heavy at first.',
      'When a supplier delays filing GSTR-1, why should an honest buyer lose Input Tax Credit and suffer cash-flow pain?',
      'What single simplification would help small traders comply faster without weakening tax collection?'
    ]
  },
  {
    title: 'Retail F&O Trading Boom in India: Financial Inclusion or Household Wealth Risk?',
    objective: 'Debate investor freedom versus SEBI guardrails protecting young retail traders.',
    domain: 'commerce',
    badge: '📈 Capital Markets',
    starterPrompts: [
      'SEBI data shows most retail F&O traders lose money, so tighter lot sizes and risk disclosures protect families.',
      'Over-regulation pushes thrill-seekers to unregulated apps—isn\'t mandatory financial literacy a better cure than bans?',
      'Should brokers be required to show real net P&L alerts before allowing leveraged derivatives trades?'
    ]
  },

  // ── SALES & GROWTH ──
  {
    title: 'Influencer Reels vs Performance Ads: Where Should a D2C Brand Put 70% of Budget?',
    objective: 'Decide the smartest customer acquisition mix when CAC is rising.',
    domain: 'sales',
    badge: '📣 Growth Clash',
    starterPrompts: [
      'Micro-creators build real trust and lower CAC, while performance ads should retarget people who already engaged.',
      'Influencer ROI is hard to track—why risk 70% of budget there when search and Meta ads show exact ROAS daily?',
      'How do you stop influencer campaigns from driving one-time curiosity clicks instead of repeat buyers?'
    ]
  },
  {
    title: 'Freemium vs Paid-Only SaaS: Which Closes Enterprise Revenue Faster?',
    objective: 'Compare product-led self-serve growth against consultative high-ticket sales.',
    domain: 'sales',
    badge: '💼 SaaS Sales',
    starterPrompts: [
      'A tight freemium tier lets champions test the product inside a company before procurement even gets involved.',
      'Free users often burn support time without buying—paid pilots attract serious decision-makers with real budgets.',
      'Where should the paywall sit so free users experience clear value yet eagerly upgrade for team features?'
    ]
  },
  {
    title: 'Aggressive Discounting vs Brand Storytelling: How Do You Win Indian Shoppers?',
    objective: 'Balance festive sale spikes against long-term gross margins and brand equity.',
    domain: 'sales',
    badge: '🛍️ Consumer Sales',
    starterPrompts: [
      'Heavy discounts train shoppers to wait for sales and destroy margins, whereas strong brand trust defends pricing.',
      'In a price-sensitive market, a smart first-order offer is often the only way to get trial against entrenched giants.',
      'Can loyalty perks and bundles replace flat percentage discounts without hurting conversion?'
    ]
  }
];
