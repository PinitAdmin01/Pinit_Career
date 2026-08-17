/**
 * A2: Elementary English Curriculum
 * Target: Normal everyday conversation, explaining experiences, describing problems
 */

import { LanguageLesson, LanguageMission } from '../languageTypes';

export const A2_LESSONS: LanguageLesson[] = [
  {
    id: 'a2-vocab-1',
    level: 'A2',
    moduleType: 'Vocabulary',
    title: 'Technology & Workplace Problem Solving',
    description: 'Learn 10 technical and problem-solving words used in software environments.',
    estimatedMinutes: 10,
    xpReward: 40,
    vocabularyItems: [
      {
        id: 'v-a2-1',
        word: 'Software',
        phonetic: '/ˈsɒft.weər/',
        meaning: 'Programs and operating information used by computers.',
        exampleSentence: 'We deployed the updated web application software.',
        category: 'Technology',
        quizQuestion: {
          question: 'What term refers to computer programs and applications?',
          options: ['Hardware', 'Software', 'Paper', 'Desk'],
          correctIndex: 1
        }
      },
      {
        id: 'v-a2-2',
        word: 'Bug',
        phonetic: '/bʌɡ/',
        meaning: 'An error or flaw in a computer program that causes incorrect results.',
        exampleSentence: 'The developer fixed a critical login bug in the system.',
        category: 'Technology',
        quizQuestion: {
          question: 'What is an error in software code called?',
          options: ['Bug', 'Feature', 'Screen', 'Keyboard'],
          correctIndex: 0
        }
      },
      {
        id: 'v-a2-3',
        word: 'Solution',
        phonetic: '/səˈluː.ʃən/',
        meaning: 'A means of solving a problem or dealing with a difficult situation.',
        exampleSentence: 'We brainstormed an efficient database caching solution.',
        category: 'Problem Solving',
        quizQuestion: {
          question: 'What is the resolution to a technical problem called?',
          options: ['Solution', 'Obstacle', 'Delay', 'Failure'],
          correctIndex: 0
        }
      },
      {
        id: 'v-a2-4',
        word: 'Improve',
        phonetic: '/ɪmˈpruːv/',
        meaning: 'Make or become better in quality or performance.',
        exampleSentence: 'Regular code reviews improve software security.',
        category: 'Growth',
        quizQuestion: {
          question: 'What verb means to make something better over time?',
          options: ['Damage', 'Improve', 'Break', 'Lose'],
          correctIndex: 1
        }
      },
      {
        id: 'v-a2-5',
        word: 'Deadline',
        phonetic: '/ˈded.laɪn/',
        meaning: 'The latest time or date by which something should be completed.',
        exampleSentence: 'The project submission deadline is Friday at 5:00 PM.',
        category: 'Workplace',
        quizQuestion: {
          question: 'What is the final due date for a task called?',
          options: ['Deadline', 'Beginning', 'Break', 'Pause'],
          correctIndex: 0
        }
      },
      {
        id: 'v-a2-6',
        word: 'Feedback',
        phonetic: '/ˈfiːd.bæk/',
        meaning: 'Information about performance or reaction to a product or task.',
        exampleSentence: 'The mentor gave constructive feedback on my presentation.',
        category: 'Communication',
        quizQuestion: {
          question: 'What is advice given to help someone improve called?',
          options: ['Noise', 'Feedback', 'Silence', 'Doubt'],
          correctIndex: 1
        }
      },
      {
        id: 'v-a2-7',
        word: 'Database',
        phonetic: '/ˈdeɪ.tə.beɪs/',
        meaning: 'An organized collection of data stored electronically.',
        exampleSentence: 'The user profiles are safely stored in PostgreSQL database.',
        category: 'Technology',
        quizQuestion: {
          question: 'What system stores organized digital records?',
          options: ['Database', 'Monitor', 'Printer', 'Mouse'],
          correctIndex: 0
        }
      },
      {
        id: 'v-a2-8',
        word: 'Collaborate',
        phonetic: '/kəˈlæb.ə.reɪt/',
        meaning: 'Work jointly with others on an activity or project.',
        exampleSentence: 'Engineers collaborate with designers to build great products.',
        category: 'Teamwork',
        quizQuestion: {
          question: 'What verb means to work together in a team?',
          options: ['Isolate', 'Collaborate', 'Compete', 'Argue'],
          correctIndex: 1
        }
      },
      {
        id: 'v-a2-9',
        word: 'Explain',
        phonetic: '/ɪkˈspleɪn/',
        meaning: 'Make an idea or situation clear to someone by describing it.',
        exampleSentence: 'Can you explain how this REST API handles authentication?',
        category: 'Communication',
        quizQuestion: {
          question: 'What verb means to clarify or describe a concept?',
          options: ['Hide', 'Explain', 'Confuse', 'Ignore'],
          correctIndex: 1
        }
      },
      {
        id: 'v-a2-10',
        word: 'Result',
        phonetic: '/rɪˈzʌlt/',
        meaning: 'A consequence or outcome of something.',
        exampleSentence: 'Our optimization produced a 40% speed result.',
        category: 'Analysis',
        quizQuestion: {
          question: 'What is the outcome of an experiment or process?',
          options: ['Result', 'Hypothesis', 'Question', 'Beginning'],
          correctIndex: 0
        }
      }
    ]
  },
  {
    id: 'a2-gram-1',
    level: 'A2',
    moduleType: 'Grammar',
    title: 'Past Simple vs Present Perfect',
    description: 'Master completed past events versus past experiences connected to the present.',
    estimatedMinutes: 12,
    xpReward: 45,
    grammarTopic: {
      id: 'g-a2-1',
      title: 'Past Simple & Present Perfect',
      ruleExplanation: 'Use Past Simple for finished events with specific past times (I completed the lab yesterday). Use Present Perfect for life experiences or current results (I have built three React apps).',
      patternExample: 'Finished past: I debugged the code yesterday. Experience: I have debugged many algorithms.',
      practiceQuestions: [
        {
          id: 'q-a2-1',
          prompt: 'Yesterday, our team _____ the system architecture meeting.',
          targetPattern: 'Past Simple specific time',
          options: ['finished', 'has finished', 'have finished', 'finishing'],
          correctAnswer: 'finished',
          explanation: '"Yesterday" specifies a finished past time requiring Past Simple.'
        },
        {
          id: 'q-a2-2',
          prompt: 'I _____ three full-stack web applications so far.',
          targetPattern: 'Present Perfect life experience',
          options: ['built', 'have built', 'build', 'am building'],
          correctAnswer: 'have built',
          explanation: '"So far" indicates life experience up to the present requiring Present Perfect.'
        }
      ]
    }
  },
  {
    id: 'a2-list-1',
    level: 'A2',
    moduleType: 'Listening',
    title: 'Technical Problem Review Meeting',
    description: 'Listen to a project standup meeting discussing code bugs and deadline adjustments.',
    estimatedMinutes: 10,
    xpReward: 45,
    listeningExercise: {
      id: 'l-a2-1',
      title: 'Sprint Bug Resolution',
      speakerVoice: 'priya',
      narrationScript: 'Team, we identified a performance bug in the database query. Anish has already rewritten the indexing strategy, so our API load time dropped from two seconds to three hundred milliseconds.',
      audioSpeed: 0.95,
      questions: [
        {
          id: 'a2lq1',
          question: 'What issue was identified in the system?',
          options: ['Database performance bug', 'Hardware crash', 'Missing monitor', 'Network cable failure'],
          correctIndex: 0
        },
        {
          id: 'a2lq2',
          question: 'What was the new API load time after Anish optimized the index?',
          options: ['2 seconds', '300 milliseconds', '5 minutes', '10 seconds'],
          correctIndex: 1
        }
      ]
    }
  },
  {
    id: 'a2-speak-1',
    level: 'A2',
    moduleType: 'Speaking',
    title: 'Explaining a Past Technical Challenge',
    description: 'Explain a problem you faced in a recent project and how you resolved it.',
    estimatedMinutes: 10,
    xpReward: 50,
    speakingExercise: {
      id: 's-a2-1',
      title: 'Problem & Solution Explanation',
      promptQuestion: 'Describe a project challenge. Say: "We found a bug in the code, so I tested the function and fixed the error."',
      sampleResponse: 'We found a bug in the code, so I tested the function and fixed the error.',
      keywordsExpected: ['found', 'bug', 'tested', 'fixed'],
      targetGrammarRule: 'Past Simple',
      minWordCount: 10
    }
  }
];

export const A2_MISSION: LanguageMission = {
  id: 'a2-mission',
  level: 'A2',
  title: 'Solve a Real-World Problem in English',
  scenarioDescription: 'Present a software glitch to your project lead, explain your solution, and agree on a deadline.',
  requiredLessons: ['a2-vocab-1', 'a2-gram-1', 'a2-list-1', 'a2-speak-1'],
  xpReward: 150
};
