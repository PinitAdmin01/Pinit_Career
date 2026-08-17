/**
 * A1: Beginner English Curriculum
 * Target: Simple everyday communication (daily routines, hobbies, college life)
 */

import { LanguageLesson, LanguageMission } from '../languageTypes';

export const A1_LESSONS: LanguageLesson[] = [
  {
    id: 'a1-vocab-1',
    level: 'A1',
    moduleType: 'Vocabulary',
    title: 'Daily Campus Life & Routines',
    description: 'Learn 10 essential vocabulary words for campus schedules and daily activities.',
    estimatedMinutes: 10,
    xpReward: 35,
    vocabularyItems: [
      {
        id: 'v-a1-1',
        word: 'Schedule',
        phonetic: '/ˈskedʒ.uːl/',
        meaning: 'A plan of events or tasks with allocated times.',
        exampleSentence: 'My class schedule starts at 9:00 AM every weekday.',
        category: 'Campus Routines',
        quizQuestion: {
          question: 'What lists your class times and room numbers?',
          options: ['Menu', 'Schedule', 'Ticket', 'Passport'],
          correctIndex: 1
        }
      },
      {
        id: 'v-a1-2',
        word: 'Library',
        phonetic: '/ˈlaɪ.brər.i/',
        meaning: 'A building or room containing books and study areas.',
        exampleSentence: 'I study quietly in the campus library.',
        category: 'Campus Facilities',
        quizQuestion: {
          question: 'Where do students go for quiet study and borrowing books?',
          options: ['Gym', 'Cafeteria', 'Library', 'Stadium'],
          correctIndex: 2
        }
      },
      {
        id: 'v-a1-3',
        word: 'Assignment',
        phonetic: '/əˈsaɪn.mənt/',
        meaning: 'A piece of academic work allocated to a student.',
        exampleSentence: 'I submitted my Python coding assignment on time.',
        category: 'Academic Tasks',
        quizQuestion: {
          question: 'What is homework or project work assigned by a professor called?',
          options: ['Assignment', 'Vacation', 'Holiday', 'Game'],
          correctIndex: 0
        }
      },
      {
        id: 'v-a1-4',
        word: 'Project',
        phonetic: '/ˈprɒdʒ.ekt/',
        meaning: 'An individual or collaborative task involving research or design.',
        exampleSentence: 'Our team built an e-commerce website project.',
        category: 'Academic Tasks',
        quizQuestion: {
          question: 'What is a collaborative task built over several weeks called?',
          options: ['Project', 'Break', 'Nap', 'Lunch'],
          correctIndex: 0
        }
      },
      {
        id: 'v-a1-5',
        word: 'Cafeteria',
        phonetic: '/ˌkæf.əˈtɪə.ri.ə/',
        meaning: 'A dining hall in a college where students buy meals.',
        exampleSentence: 'We eat lunch at the campus cafeteria.',
        category: 'Campus Facilities',
        quizQuestion: {
          question: 'Where do students eat meals on campus?',
          options: ['Lab', 'Cafeteria', 'Auditorium', 'Parking'],
          correctIndex: 1
        }
      },
      {
        id: 'v-a1-6',
        word: 'Morning',
        phonetic: '/ˈmɔː.nɪŋ/',
        meaning: 'The early part of the day from sunrise to noon.',
        exampleSentence: 'Our first lecture starts early in the morning.',
        category: 'Time',
        quizQuestion: {
          question: 'What period of the day comes before noon?',
          options: ['Night', 'Midnight', 'Morning', 'Evening'],
          correctIndex: 2
        }
      },
      {
        id: 'v-a1-7',
        word: 'Evening',
        phonetic: '/ˈiːv.nɪŋ/',
        meaning: 'The period of time at the end of the day before nightfall.',
        exampleSentence: 'I review my notes in the evening.',
        category: 'Time',
        quizQuestion: {
          question: 'What period of the day comes after 5:00 PM?',
          options: ['Morning', 'Dawn', 'Evening', 'Noon'],
          correctIndex: 2
        }
      },
      {
        id: 'v-a1-8',
        word: 'Practice',
        phonetic: '/ˈpræk.tɪs/',
        meaning: 'Perform an activity repeatedly to improve skill.',
        exampleSentence: 'Daily practice improves your English communication.',
        category: 'Skill Building',
        quizQuestion: {
          question: 'What action helps you master coding or speaking?',
          options: ['Practice', 'Forgetting', 'Sleeping', 'Ignoring'],
          correctIndex: 0
        }
      },
      {
        id: 'v-a1-9',
        word: 'Question',
        phonetic: '/ˈkwes.tʃən/',
        meaning: 'A sentence worded to elicit information.',
        exampleSentence: 'The student raised a hand to ask a question.',
        category: 'Communication',
        quizQuestion: {
          question: 'What do you ask when you need clarification?',
          options: ['Answer', 'Question', 'Period', 'Silence'],
          correctIndex: 1
        }
      },
      {
        id: 'v-a1-10',
        word: 'Answer',
        phonetic: '/ˈɑːn.sər/',
        meaning: 'A solution or response to a question.',
        exampleSentence: 'Priya gave a helpful answer to my code query.',
        category: 'Communication',
        quizQuestion: {
          question: 'What is the response to a question called?',
          options: ['Answer', 'Problem', 'Puzzle', 'Mistake'],
          correctIndex: 0
        }
      }
    ]
  },
  {
    id: 'a1-gram-1',
    level: 'A1',
    moduleType: 'Grammar',
    title: 'Present Simple vs Present Continuous',
    description: 'Understand regular daily habits versus actions happening right now.',
    estimatedMinutes: 12,
    xpReward: 40,
    grammarTopic: {
      id: 'g-a1-1',
      title: 'Present Simple & Continuous',
      ruleExplanation: 'Use Present Simple for daily habits (I study every day). Use Present Continuous for current actions (I am studying right now).',
      patternExample: 'Regular habit: I code in Python. Action now: I am writing a function right now.',
      practiceQuestions: [
        {
          id: 'q-a1-1',
          prompt: 'Every morning, Rahul _____ the campus bus to college.',
          targetPattern: 'Present Simple habit',
          options: ['takes', 'is taking', 'took', 'taking'],
          correctAnswer: 'takes',
          explanation: 'Daily habits use Present Simple ("takes").'
        },
        {
          id: 'q-a1-2',
          prompt: 'Look! The professor _____ the algorithm on the board right now.',
          targetPattern: 'Present Continuous action now',
          options: ['explains', 'is explaining', 'explained', 'explain'],
          correctAnswer: 'is explaining',
          explanation: '"Right now" triggers Present Continuous ("is explaining").'
        }
      ]
    }
  },
  {
    id: 'a1-list-1',
    level: 'A1',
    moduleType: 'Listening',
    title: 'Daily College Routine Discussion',
    description: 'Listen to two students discuss their daily schedules and project deadlines.',
    estimatedMinutes: 10,
    xpReward: 40,
    listeningExercise: {
      id: 'l-a1-1',
      title: 'Planning the Group Study Session',
      speakerVoice: 'priya',
      narrationScript: 'Hi Anish! Are you attending the database lecture at ten o\'clock? Yes Priya, and after lunch I am working on our team coding assignment in the library.',
      audioSpeed: 0.9,
      questions: [
        {
          id: 'alq1',
          question: 'What lecture is happening at 10:00 AM?',
          options: ['Database', 'Physics', 'Marketing', 'Chemistry'],
          correctIndex: 0
        },
        {
          id: 'alq2',
          question: 'Where is Anish planning to work after lunch?',
          options: ['Cafeteria', 'Library', 'Hostel', 'Gym'],
          correctIndex: 1
        }
      ]
    }
  },
  {
    id: 'a1-speak-1',
    level: 'A1',
    moduleType: 'Speaking',
    title: 'Describing Your Daily Routine',
    description: 'Speak in full sentences about what time you wake up and study.',
    estimatedMinutes: 8,
    xpReward: 45,
    speakingExercise: {
      id: 's-a1-1',
      title: 'My Daily Routine Speech',
      promptQuestion: 'Describe your daily routine. Say: "I wake up in the morning, attend lectures, and study coding in the evening."',
      sampleResponse: 'I wake up in the morning, attend lectures, and study coding in the evening.',
      keywordsExpected: ['wake', 'lectures', 'study', 'coding'],
      targetGrammarRule: 'Present Simple',
      minWordCount: 8
    }
  }
];

export const A1_MISSION: LanguageMission = {
  id: 'a1-mission',
  level: 'A1',
  title: 'First Day in an English-Speaking College',
  scenarioDescription: 'Navigate your first day on campus, ask for directions to the library, and discuss your schedule.',
  requiredLessons: ['a1-vocab-1', 'a1-gram-1', 'a1-list-1', 'a1-speak-1'],
  xpReward: 125
};
