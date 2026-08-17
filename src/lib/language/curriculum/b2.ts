/**
 * B2: Upper Intermediate / Professional English Curriculum
 * Target: Executive technical communication, formal vs informal tone, leadership persuasion, interview excellence
 */

import { LanguageLesson, LanguageMission } from '../languageTypes';

export const B2_LESSONS: LanguageLesson[] = [
  {
    id: 'b2-vocab-1',
    level: 'B2',
    moduleType: 'Vocabulary',
    title: 'Executive Leadership & Technical Strategy',
    description: 'Master 10 advanced vocabulary terms for executive presentations and senior technical interviews.',
    estimatedMinutes: 14,
    xpReward: 50,
    vocabularyItems: [
      {
        id: 'v-b2-1',
        word: 'Governance',
        phonetic: '/ˈɡʌv.ən.əns/',
        meaning: 'The framework of rules and practices by which accountability is ensured in systems.',
        exampleSentence: 'Institutional RBAC governance guarantees compliance across all six campus portals.',
        category: 'Executive Strategy',
        quizQuestion: {
          question: 'What term refers to system rules ensuring security compliance and accountability?',
          options: ['Governance', 'Chaos', 'Arbitrary', 'Negligence'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-2',
        word: 'Infrastructure',
        phonetic: '/ˈɪn.frəˌstrʌk.tʃər/',
        meaning: 'The fundamental physical and organizational structures needed for software operations.',
        exampleSentence: 'Automated Terraform scripts provision cloud server infrastructure on demand.',
        category: 'Systems',
        quizQuestion: {
          question: 'What foundational hardware/cloud layer supports all software services?',
          options: ['Infrastructure', 'Decoration', 'Furniture', 'Apparel'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-3',
        word: 'Constraint',
        phonetic: '/kənˈstreɪnt/',
        meaning: 'A limitation or restriction on software design or operational execution.',
        exampleSentence: 'Zero remote deployment was enforced as a strict pre-production constraint.',
        category: 'Risk Management',
        quizQuestion: {
          question: 'What is a strict limitation or boundaries rule called in engineering?',
          options: ['Constraint', 'Freedom', 'Wildcard', 'Option'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-4',
        word: 'Resilience',
        phonetic: '/rɪˈzɪl.jəns/',
        meaning: 'The capacity of a system to recover quickly from operational failures or high traffic.',
        exampleSentence: 'Multi-region failover clusters guarantee maximum system resilience.',
        category: 'Quality',
        quizQuestion: {
          question: 'What system property measures fast recovery from hardware failures?',
          options: ['Resilience', 'Brittleness', 'Vulnerability', 'Decay'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-5',
        word: 'Mitigation',
        phonetic: '/ˌmɪt.ɪˈɡeɪ.ʃən/',
        meaning: 'The action of reducing the severity or risk of a vulnerability or system failure.',
        exampleSentence: 'Strict input sanitization is an essential mitigation against XSS attacks.',
        category: 'Cybersecurity',
        quizQuestion: {
          question: 'What process reduces the impact of security risks or software bugs?',
          options: ['Mitigation', 'Amplification', 'Ignorance', 'Escalation'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-6',
        word: 'Perspective',
        phonetic: '/pəˈspek.tɪv/',
        meaning: 'A refined professional view on architectural decisions.',
        exampleSentence: 'From a CTO perspective, code quality is as critical as feature speed.',
        category: 'Leadership',
        quizQuestion: {
          question: 'What word describes a strategic executive viewpoint?',
          options: ['Perspective', 'Blindspot', 'Delusion', 'Omission'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-7',
        word: 'Idempotency',
        phonetic: '/ˌaɪ.demˈpəʊ.tən.si/',
        meaning: 'The property of certain operations where being executed multiple times produces the same result.',
        exampleSentence: 'Database unique constraints enforce strict API idempotency for transaction rewards.',
        category: 'Computer Science',
        quizQuestion: {
          question: 'What property guarantees that calling an API multiple times produces identical state?',
          options: ['Idempotency', 'Randomness', 'Volatility', 'Recursion'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-8',
        word: 'Verification',
        phonetic: '/ˌver.ɪ.fɪˈkeɪ.ʃən/',
        meaning: 'The process of establishing the truth, accuracy, or validity of software code.',
        exampleSentence: 'Unit test runners provided empirical verification for all 171 system test cases.',
        category: 'Quality Assurance',
        quizQuestion: {
          question: 'What process establishes empirical proof of software correctness?',
          options: ['Verification', 'Assumption', 'Guesswork', 'Rumor'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-9',
        word: 'Deterministic',
        phonetic: '/dɪˌtɜː.mɪˈnɪs.tɪk/',
        meaning: 'An algorithm or process that always produces the exact same output from given input.',
        exampleSentence: 'PinIT placement scoring is 100% deterministic, eliminating LLM hallucination.',
        category: 'Algorithms',
        quizQuestion: {
          question: 'What term describes a process that always yields predictable, identical results?',
          options: ['Deterministic', 'Random', 'Chaos', 'Arbitrary'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b2-10',
        word: 'Precedence',
        phonetic: '/ˈpres.ɪ.dəns/',
        meaning: 'The condition of being considered more important than something else.',
        exampleSentence: 'Backend database security policies take precedence over client-side UI gates.',
        category: 'Governance',
        quizQuestion: {
          question: 'What word means priority or higher order of importance?',
          options: ['Precedence', 'Subordination', 'Neglect', 'Delay'],
          correctIndex: 0
        }
      }
    ]
  },
  {
    id: 'b2-gram-1',
    level: 'B2',
    moduleType: 'Grammar',
    title: 'Advanced Inversion & Formal Register',
    description: 'Use formal grammatical inversion and precise professional register for high-stakes communication.',
    estimatedMinutes: 15,
    xpReward: 55,
    grammarTopic: {
      id: 'g-b2-1',
      title: 'Formal Inversion & Nuanced Phrasing',
      ruleExplanation: 'Use inversion for formal emphasis (Not only does the algorithm reduce latency, but it also lowers memory overhead). Maintain precise formal register in executive reports.',
      patternExample: 'Inversion: Seldom have we seen such clean verification scores. Formal: It is strongly recommended that...',
      practiceQuestions: [
        {
          id: 'q-b2-1',
          prompt: 'Not only _____ the system pass all security audits, but it also compiled 3,952 routes cleanly.',
          targetPattern: 'Formal Inversion with Not Only',
          options: ['did', 'does', 'had', 'was'],
          correctAnswer: 'did',
          explanation: 'Inversion after "Not only" requires auxiliary verb ("did") before subject.'
        },
        {
          id: 'q-b2-2',
          prompt: 'Under no circumstances _____ unauthenticated API requests bypass database RLS rules.',
          targetPattern: 'Formal Negative Inversion',
          options: ['should', 'would', 'can', 'may'],
          correctAnswer: 'should',
          explanation: '"Under no circumstances" triggers formal modal inversion ("should").'
        }
      ]
    }
  },
  {
    id: 'b2-list-1',
    level: 'B2',
    moduleType: 'Listening',
    title: 'Executive CTO Keynote & System Review',
    description: 'Listen to a fast-paced executive presentation on platform architecture, security, and pre-production gates.',
    estimatedMinutes: 14,
    xpReward: 55,
    listeningExercise: {
      id: 'l-b2-1',
      title: 'CTO Architectural Address',
      speakerVoice: 'priya',
      narrationScript: 'Not only have our automated test suites validated 171 core system integration pipelines with zero errors, but our strict pre-production roadmap guarantees that cloud database deployment and multi-device E2E validation remain distinct, verifiable release gates.',
      audioSpeed: 1.05,
      questions: [
        {
          id: 'b2lq1',
          question: 'What engineering principle was emphasized regarding pre-production gates?',
          options: ['Deployment and multi-device E2E validation remain distinct, verifiable release gates', 'Deploy immediately without testing', 'Skip database security', 'Ignore browser errors'],
          correctIndex: 0
        },
        {
          id: 'b2lq2',
          question: 'What was the result of the 171 core system integration pipelines?',
          options: ['Zero errors and 100% pass rate', '50% failure', 'Build cancelled', 'Missing files'],
          correctIndex: 0
        }
      ]
    }
  },
  {
    id: 'b2-speak-1',
    level: 'B2',
    moduleType: 'Speaking',
    title: 'Senior Technical Interview Simulation',
    description: 'Deliver an executive-level response explaining system architecture, security trade-offs, and compliance.',
    estimatedMinutes: 15,
    xpReward: 60,
    speakingExercise: {
      id: 's-b2-1',
      title: 'Executive Interview Answer',
      promptQuestion: 'Deliver a senior technical interview response. Say: "Our platform enforces strict database row-level security policies, ensuring complete data isolation and deterministic verification across all institutional services."',
      sampleResponse: 'Our platform enforces strict database row-level security policies, ensuring complete data isolation and deterministic verification across all institutional services.',
      keywordsExpected: ['platform', 'enforces', 'database', 'security', 'isolation'],
      targetGrammarRule: 'Executive Professional Register',
      minWordCount: 15
    }
  }
];

export const B2_MISSION: LanguageMission = {
  id: 'b2-mission',
  level: 'B2',
  title: 'Professional English Simulation',
  scenarioDescription: 'Deliver a technical presentation, answer senior engineering interview queries, and complete a high-stakes executive simulation.',
  requiredLessons: ['b2-vocab-1', 'b2-gram-1', 'b2-list-1', 'b2-speak-1'],
  xpReward: 250
};
