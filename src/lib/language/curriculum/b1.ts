/**
 * B1: Intermediate English Curriculum
 * Target: Independent communication, professional topics, technical explanations, trade-offs
 */

import { LanguageLesson, LanguageMission } from '../languageTypes';

export const B1_LESSONS: LanguageLesson[] = [
  {
    id: 'b1-vocab-1',
    level: 'B1',
    moduleType: 'Vocabulary',
    title: 'Professional Engineering & Architecture',
    description: 'Learn 10 professional vocabulary terms for system architecture and technical discussions.',
    estimatedMinutes: 12,
    xpReward: 45,
    vocabularyItems: [
      {
        id: 'v-b1-1',
        word: 'Architecture',
        phonetic: '/ˈɑː.kɪ.tek.tʃər/',
        meaning: 'The conceptual structure and organization of a complex software system.',
        exampleSentence: 'Microservice architecture improves system scalability under high user traffic.',
        category: 'Software Engineering',
        quizQuestion: {
          question: 'What term describes the structural design of a software system?',
          options: ['Architecture', 'Wallpaper', 'Font', 'Keyboard'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-2',
        word: 'Scalability',
        phonetic: '/ˌskeɪ.ləˈbɪl.ə.ti/',
        meaning: 'The capacity of a system to handle growing amounts of workload.',
        exampleSentence: 'Cloud deployment ensures infrastructure scalability.',
        category: 'System Performance',
        quizQuestion: {
          question: 'What property enables a system to grow gracefully under heavy load?',
          options: ['Scalability', 'Fragility', 'Rigidity', 'Slowness'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-3',
        word: 'Trade-off',
        phonetic: '/ˈtreɪd.ɒf/',
        meaning: 'A compromise where giving up one benefit gains another.',
        exampleSentence: 'Choosing PostgreSQL over Redis involves a trade-off between strict persistence and raw speed.',
        category: 'Decision Making',
        quizQuestion: {
          question: 'What is a compromise between two competing technical options called?',
          options: ['Trade-off', 'Guarantee', 'Absolute', 'Shortcut'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-4',
        word: 'Optimization',
        phonetic: '/ˌɒp.tɪ.maɪˈzeɪ.ʃən/',
        meaning: 'The action of making a process or system as efficient as possible.',
        exampleSentence: 'Query optimization reduced database response time by 60%.',
        category: 'Performance',
        quizQuestion: {
          question: 'What process tunes code or SQL to run significantly faster?',
          options: ['Optimization', 'Slowing', 'Duplication', 'Complication'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-5',
        word: 'Security',
        phonetic: '/sɪˈkjʊə.rə.ti/',
        meaning: 'Protection of computer systems from theft, damage, or unauthorized access.',
        exampleSentence: 'OAuth2 and JWT tokens enforce strict API security.',
        category: 'Cybersecurity',
        quizQuestion: {
          question: 'What discipline protects systems against unauthorized access?',
          options: ['Security', 'Vulnerability', 'Exposure', 'Neglect'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-6',
        word: 'Implementation',
        phonetic: '/ˌɪm.plɪ.menˈteɪ.ʃən/',
        meaning: 'The process of putting a decision or plan into execution.',
        exampleSentence: 'The clean-room implementation met all strict compliance requirements.',
        category: 'Execution',
        quizQuestion: {
          question: 'What term means translating design specifications into actual code?',
          options: ['Implementation', 'Postponement', 'Cancellation', 'Speculation'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-7',
        word: 'Integration',
        phonetic: '/ˌɪn.tɪˈɡreɪ.ʃən/',
        meaning: 'Combining separate software sub-systems into a unified whole.',
        exampleSentence: 'Seamless payment gateway integration increased user checkout completion.',
        category: 'Systems',
        quizQuestion: {
          question: 'What process connects multiple independent services together?',
          options: ['Integration', 'Isolation', 'Disconnection', 'Division'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-8',
        word: 'Reliability',
        phonetic: '/rɪˌlaɪ.əˈbɪl.ə.ti/',
        meaning: 'The degree to which a system consistently performs according to specifications.',
        exampleSentence: 'Automated CI/CD pipelines ensure release reliability.',
        category: 'Quality Assurance',
        quizQuestion: {
          question: 'What metric measures consistent system uptime without failures?',
          options: ['Reliability', 'Instability', 'Unpredictability', 'Randomness'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-9',
        word: 'Perspective',
        phonetic: '/pəˈspek.tɪv/',
        meaning: 'A particular attitude toward or way of regarding a technical situation.',
        exampleSentence: 'From a security perspective, all user input must be sanitized.',
        category: 'Analysis',
        quizQuestion: {
          question: 'What word means a specific viewpoint or analytical angle?',
          options: ['Perspective', 'Blindspot', 'Ignorance', 'Illusion'],
          correctIndex: 0
        }
      },
      {
        id: 'v-b1-10',
        word: 'Recommendation',
        phonetic: '/ˌrek.ə.menˈdeɪ.ʃən/',
        meaning: 'A suggestion or proposal as to the best course of action.',
        exampleSentence: 'Our architecture team issued a clear recommendation to adopt cloud caching.',
        category: 'Advisory',
        quizQuestion: {
          question: 'What is a formal suggestion for the best solution called?',
          options: ['Recommendation', 'Rejection', 'Denial', 'Prohibition'],
          correctIndex: 0
        }
      }
    ]
  },
  {
    id: 'b1-gram-1',
    level: 'B1',
    moduleType: 'Grammar',
    title: 'Conditionals & Passive Voice in Architecture',
    description: 'Use second/third conditionals and passive structures to discuss system trade-offs.',
    estimatedMinutes: 14,
    xpReward: 50,
    grammarTopic: {
      id: 'g-b1-1',
      title: 'Conditionals & Passive Structures',
      ruleExplanation: 'Use Second Conditional for hypothetical scenarios (If we scaled horizontally, performance would improve). Use Passive Voice to emphasize technical actions (Data is encrypted at rest).',
      patternExample: 'Conditional: If we used Redis, latency would drop. Passive: All transactions are audited automatically.',
      practiceQuestions: [
        {
          id: 'q-b1-1',
          prompt: 'If we _____ horizontal database sharding, latency would decrease significantly.',
          targetPattern: 'Second Conditional (hypothetical)',
          options: ['implemented', 'implement', 'will implement', 'have implemented'],
          correctAnswer: 'implemented',
          explanation: 'Second conditional requires Past Simple ("implemented") in the if-clause.'
        },
        {
          id: 'q-b1-2',
          prompt: 'All financial vouchers _____ cryptographically before export.',
          targetPattern: 'Passive Voice action emphasis',
          options: ['are signed', 'sign', 'signing', 'were sign'],
          correctAnswer: 'are signed',
          explanation: 'Passive structure ("are signed") places emphasis on the voucher data.'
        }
      ]
    }
  },
  {
    id: 'b1-list-1',
    level: 'B1',
    moduleType: 'Listening',
    title: 'Architecture Boardroom Trade-Off Debate',
    description: 'Listen to a technical debate between a lead architect and a DevOps engineer.',
    estimatedMinutes: 12,
    xpReward: 50,
    listeningExercise: {
      id: 'l-b1-1',
      title: 'Monolith vs Microservices Debate',
      speakerVoice: 'priya',
      narrationScript: 'While microservices offer superior team autonomy and independent deployment scalability, they introduce significant distributed tracing overhead and network latency compared to a clean modular monolith.',
      audioSpeed: 1.0,
      questions: [
        {
          id: 'b1lq1',
          question: 'What advantage of microservices was explicitly highlighted?',
          options: ['Team autonomy and independent deployment', 'Zero network overhead', 'Lower server costs', 'No database required'],
          correctIndex: 0
        },
        {
          id: 'b1lq2',
          question: 'What trade-off complexity was mentioned regarding microservices?',
          options: ['Distributed tracing overhead and network latency', 'Fewer CPU cores', 'Static HTML limits', 'Slower hard drives'],
          correctIndex: 0
        }
      ]
    }
  },
  {
    id: 'b1-speak-1',
    level: 'B1',
    moduleType: 'Speaking',
    title: 'Defending an Architectural Recommendation',
    description: 'Argue why a specific technical approach is optimal using conditionals and clear structure.',
    estimatedMinutes: 12,
    xpReward: 55,
    speakingExercise: {
      id: 's-b1-1',
      title: 'Technical Proposal Defense',
      promptQuestion: 'Present an architecture choice. Say: "I recommend Redis caching because it reduces database load and improves API latency under heavy traffic."',
      sampleResponse: 'I recommend Redis caching because it reduces database load and improves API latency under heavy traffic.',
      keywordsExpected: ['recommend', 'caching', 'reduces', 'latency'],
      targetGrammarRule: 'Complex Sentences',
      minWordCount: 12
    }
  }
];

export const B1_MISSION: LanguageMission = {
  id: 'b1-mission',
  level: 'B1',
  title: 'AI Boardroom Challenge',
  scenarioDescription: 'Participate in an AI-moderated technical architecture meeting, evaluate microservice trade-offs, and defend your proposal.',
  requiredLessons: ['b1-vocab-1', 'b1-gram-1', 'b1-list-1', 'b1-speak-1'],
  xpReward: 175
};
