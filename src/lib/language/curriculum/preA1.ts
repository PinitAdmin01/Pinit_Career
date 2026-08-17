/**
 * Pre-A1: English Foundations Curriculum
 * Target: Complete beginner (recognition of sounds, greetings, basic objects)
 */

import { LanguageLesson, LanguageMission } from '../languageTypes';

export const PRE_A1_LESSONS: LanguageLesson[] = [
  {
    id: 'prea1-vocab-1',
    level: 'PRE_A1',
    moduleType: 'Vocabulary',
    title: 'Everyday Basics & Greetings',
    description: 'Learn 10 fundamental English words for daily greetings and classroom objects.',
    estimatedMinutes: 8,
    xpReward: 30,
    vocabularyItems: [
      {
        id: 'v1',
        word: 'Hello',
        phonetic: '/həˈloʊ/',
        meaning: 'A polite greeting used when meeting someone.',
        exampleSentence: 'Hello! How are you today?',
        category: 'Greetings',
        quizQuestion: {
          question: 'Which word is a standard greeting when meeting a friend?',
          options: ['Goodbye', 'Hello', 'Night', 'Sleep'],
          correctIndex: 1
        }
      },
      {
        id: 'v2',
        word: 'Name',
        phonetic: '/neɪm/',
        meaning: 'The word by which a person, place, or thing is known.',
        exampleSentence: 'My name is Priya.',
        category: 'Identity',
        quizQuestion: {
          question: 'Complete the sentence: "My ______ is Alex."',
          options: ['color', 'name', 'day', 'food'],
          correctIndex: 1
        }
      },
      {
        id: 'v3',
        word: 'Book',
        phonetic: '/bʊk/',
        meaning: 'A written or printed work consisting of pages bound together.',
        exampleSentence: 'I read an English book every morning.',
        category: 'College Objects',
        quizQuestion: {
          question: 'What object do you read in college?',
          options: ['Chair', 'Water', 'Book', 'Window'],
          correctIndex: 2
        }
      },
      {
        id: 'v4',
        word: 'Teacher',
        phonetic: '/ˈtiː.tʃər/',
        meaning: 'A person who teaches students in a school or college.',
        exampleSentence: 'The teacher answered my question.',
        category: 'College People',
        quizQuestion: {
          question: 'Who guides students in class?',
          options: ['Teacher', 'Table', 'Shoe', 'Door'],
          correctIndex: 0
        }
      },
      {
        id: 'v5',
        word: 'Student',
        phonetic: '/ˈstjuː.dənt/',
        meaning: 'A person who is studying at a school or university.',
        exampleSentence: 'I am a computer science student.',
        category: 'College People',
        quizQuestion: {
          question: 'Who attends lectures to learn?',
          options: ['Student', 'Fan', 'Clock', 'Car'],
          correctIndex: 0
        }
      },
      {
        id: 'v6',
        word: 'Classroom',
        phonetic: '/ˈklɑːs.ruːm/',
        meaning: 'A room in a school or college where lessons take place.',
        exampleSentence: 'We meet in classroom 101.',
        category: 'Places',
        quizQuestion: {
          question: 'Where do college lectures happen?',
          options: ['Kitchen', 'Classroom', 'Forest', 'Bed'],
          correctIndex: 1
        }
      },
      {
        id: 'v7',
        word: 'Yes',
        phonetic: '/jes/',
        meaning: 'Used to give an affirmative response.',
        exampleSentence: 'Yes, I understand the instruction.',
        category: 'Responses',
        quizQuestion: {
          question: 'What word indicates agreement or affirmation?',
          options: ['No', 'Never', 'Yes', 'Bye'],
          correctIndex: 2
        }
      },
      {
        id: 'v8',
        word: 'No',
        phonetic: '/noʊ/',
        meaning: 'Used to give a negative response.',
        exampleSentence: 'No, the exam is not today.',
        category: 'Responses',
        quizQuestion: {
          question: 'What is the opposite of "Yes"?',
          options: ['No', 'Please', 'Good', 'Hi'],
          correctIndex: 0
        }
      },
      {
        id: 'v9',
        word: 'Thank you',
        phonetic: '/θæŋk juː/',
        meaning: 'Polite expression of gratitude.',
        exampleSentence: 'Thank you for helping me with the code.',
        category: 'Politeness',
        quizQuestion: {
          question: 'What do you say when someone gives you advice?',
          options: ['Stop', 'Thank you', 'No', 'What'],
          correctIndex: 1
        }
      },
      {
        id: 'v10',
        word: 'Goodbye',
        phonetic: '/ˌɡʊdˈbaɪ/',
        meaning: 'Used when leaving someone.',
        exampleSentence: 'Goodbye! See you tomorrow at 9 AM.',
        category: 'Greetings',
        quizQuestion: {
          question: 'What do you say when leaving class?',
          options: ['Hello', 'Morning', 'Goodbye', 'Welcome'],
          correctIndex: 2
        }
      }
    ]
  },
  {
    id: 'prea1-gram-1',
    level: 'PRE_A1',
    moduleType: 'Grammar',
    title: 'Basic Verb "To Be" (Am / Is / Are)',
    description: 'Master the foundational structure of personal statements using am, is, and are.',
    estimatedMinutes: 10,
    xpReward: 35,
    grammarTopic: {
      id: 'g-prea1-1',
      title: 'Present Tense of "To Be"',
      ruleExplanation: 'Use "am" with I, "is" with he/she/it/singular nouns, and "are" with you/we/they/plural nouns.',
      patternExample: 'I am a student. She is a teacher. They are in the classroom.',
      practiceQuestions: [
        {
          id: 'q1',
          prompt: 'I _____ eager to learn English.',
          targetPattern: 'I am',
          options: ['am', 'is', 'are', 'be'],
          correctAnswer: 'am',
          explanation: 'Subject "I" takes the verb "am".'
        },
        {
          id: 'q2',
          prompt: 'Priya _____ a software engineering mentor.',
          targetPattern: 'She is',
          options: ['am', 'is', 'are', 'were'],
          correctAnswer: 'is',
          explanation: 'Singular third-person subject "Priya" takes "is".'
        },
        {
          id: 'q3',
          prompt: 'We _____ ready for the morning quiz.',
          targetPattern: 'We are',
          options: ['am', 'is', 'are', 'be'],
          correctAnswer: 'are',
          explanation: 'Plural subject "We" takes "are".'
        }
      ]
    }
  },
  {
    id: 'prea1-list-1',
    level: 'PRE_A1',
    moduleType: 'Listening',
    title: 'Simple College Introductions',
    description: 'Listen to Ms. Priya introduce herself and answer basic comprehension questions.',
    estimatedMinutes: 8,
    xpReward: 35,
    listeningExercise: {
      id: 'l-prea1-1',
      title: 'Priya Introduces the Class',
      speakerVoice: 'priya',
      narrationScript: 'Hello! Welcome to PinIT Campus. My name is Priya. I am your AI learning mentor. Today is a great day to learn English.',
      audioSpeed: 0.85,
      questions: [
        {
          id: 'lq1',
          question: 'What is the speaker\'s name?',
          options: ['Anita', 'Priya', 'Sarah', 'Kashyap'],
          correctIndex: 1
        },
        {
          id: 'lq2',
          question: 'Where is Priya welcoming you to?',
          options: ['Airport', 'PinIT Campus', 'Hospital', 'Library'],
          correctIndex: 1
        }
      ]
    }
  },
  {
    id: 'prea1-speak-1',
    level: 'PRE_A1',
    moduleType: 'Speaking',
    title: 'Saying Your Name Aloud',
    description: 'Practice speaking your name clearly in a complete sentence.',
    estimatedMinutes: 7,
    xpReward: 40,
    speakingExercise: {
      id: 's-prea1-1',
      title: 'Self-Introduction Basics',
      promptQuestion: 'Please introduce yourself aloud. Say: "Hello, my name is [Your Name], and I am a student."',
      sampleResponse: 'Hello, my name is Rahul, and I am a student.',
      keywordsExpected: ['hello', 'name', 'student'],
      targetGrammarRule: 'I am',
      minWordCount: 4
    }
  }
];

export const PRE_A1_MISSION: LanguageMission = {
  id: 'prea1-mission',
  level: 'PRE_A1',
  title: 'Introduce Yourself to Priya',
  scenarioDescription: 'Meet your mentor Priya at the campus welcome gate and complete a 4-part basic interaction.',
  requiredLessons: ['prea1-vocab-1', 'prea1-gram-1', 'prea1-list-1', 'prea1-speak-1'],
  xpReward: 100
};
