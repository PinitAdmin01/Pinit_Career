import { LanguageLesson, FinalMission } from '../../languageTypes';

export const PRE_A1_ENGLISH_LESSONS: LanguageLesson[] = [
  {
    id: 'en-prea1-vocab-1',
    languageCode: 'en',
    level: 'PRE_A1',
    moduleType: 'Vocabulary',
    title: 'Essential Greetings & Campus Introduction',
    description: 'Learn fundamental English greetings and basic university vocabulary.',
    estimatedMinutes: 5,
    xpReward: 30,
    vocabularyItems: [
      { id: 'en-v1', word: 'Hello', translation: 'Greetings', phonetic: '/həˈloʊ/', exampleSentence: 'Hello, my name is Alex.', exampleTranslation: 'Hello, my name is Alex.', category: 'Greetings', quizQuestion: { prompt: 'What is the standard polite greeting when meeting someone?', options: ['Goodbye', 'Hello', 'Night', 'Later'], correctIndex: 1 } },
      { id: 'en-v2', word: 'Student', translation: 'Learner', phonetic: '/ˈstuːdənt/', exampleSentence: 'I am a computer science student.', exampleTranslation: 'I am a CS student.', category: 'Campus', quizQuestion: { prompt: 'Select the word that means a person who attends university:', options: ['Teacher', 'Student', 'Doctor', 'Driver'], correctIndex: 1 } },
      { id: 'en-v3', word: 'Teacher', translation: 'Instructor', phonetic: '/ˈtiːtʃər/', exampleSentence: 'The teacher explains the lesson.', exampleTranslation: 'The teacher explains the lesson.', category: 'Campus', quizQuestion: { prompt: 'Who instructs students in a classroom?', options: ['Student', 'Teacher', 'Chef', 'Pilot'], correctIndex: 1 } },
      { id: 'en-v4', word: 'Classroom', translation: 'Study room', phonetic: '/ˈklæsruːm/', exampleSentence: 'We study algorithms in the classroom.', exampleTranslation: 'We study in the room.', category: 'Campus', quizQuestion: { prompt: 'Where do lectures take place?', options: ['Park', 'Classroom', 'Beach', 'Kitchen'], correctIndex: 1 } },
      { id: 'en-v5', word: 'Library', translation: 'Book building', phonetic: '/ˈlaɪbrəri/', exampleSentence: 'I read books in the library.', exampleTranslation: 'I read books in the library.', category: 'Campus', quizQuestion: { prompt: 'Where do students quiet study and borrow books?', options: ['Gym', 'Library', 'Market', 'Cinema'], correctIndex: 1 } },
      { id: 'en-v6', word: 'Computer', translation: 'Electronic device', phonetic: '/kəmˈpjuːtər/', exampleSentence: 'I write code on my computer.', exampleTranslation: 'I code on my computer.', category: 'Technology', quizQuestion: { prompt: 'What device is used for coding and browsing?', options: ['Computer', 'Desk', 'Chair', 'Paper'], correctIndex: 0 } },
      { id: 'en-v7', word: 'Book', translation: 'Reading material', phonetic: '/bʊk/', exampleSentence: 'Open your textbook to page 10.', exampleTranslation: 'Open textbook.', category: 'Campus', quizQuestion: { prompt: 'Which item contains printed pages for reading?', options: ['Pen', 'Book', 'Clock', 'Door'], correctIndex: 1 } },
      { id: 'en-v8', word: 'Code', translation: 'Programming instructions', phonetic: '/koʊd/', exampleSentence: 'Python code is easy to read.', exampleTranslation: 'Python code is clean.', category: 'Technology', quizQuestion: { prompt: 'What do software engineers write?', options: ['Code', 'Painting', 'Song', 'Recipe'], correctIndex: 0 } },
      { id: 'en-v9', word: 'Welcome', translation: 'Greeting response', phonetic: '/ˈwɛlkəm/', exampleSentence: 'Welcome to PinIT Career OS.', exampleTranslation: 'Welcome to PinIT.', category: 'Greetings', quizQuestion: { prompt: 'What do you say to greet someone entering a place?', options: ['Welcome', 'Bye', 'No', 'Stop'], correctIndex: 0 } },
      { id: 'en-v10', word: 'Good Morning', translation: 'Morning greeting', phonetic: '/ɡʊd ˈmɔːrnɪŋ/', exampleSentence: 'Good morning, team!', exampleTranslation: 'Good morning, team!', category: 'Greetings', quizQuestion: { prompt: 'What greeting is used before noon?', options: ['Good Night', 'Good Morning', 'Good Evening', 'Bye'], correctIndex: 1 } }
    ]
  },
  {
    id: 'en-prea1-gram-1',
    languageCode: 'en',
    level: 'PRE_A1',
    moduleType: 'Grammar',
    title: 'Subject Pronouns & Present Tense "To Be" (I am / You are / It is)',
    description: 'Master the fundamental building blocks of English sentence formation.',
    estimatedMinutes: 6,
    xpReward: 30,
    grammarTopic: {
      id: 'g-en-1',
      title: 'Verb "To Be" in Present Simple',
      ruleExplanation: 'Use "I am", "You are", "He/She/It is", and "We/They are" to state identity, roles, and status.',
      patternExamples: ['I am a student.', 'She is an engineer.', 'They are in the library.'],
      practiceQuestions: [
        { id: 'q1', prompt: 'Fill in the blank:', sentenceWithBlank: 'I ___ learning software development.', options: ['am', 'is', 'are', 'be'], correctIndex: 0, explanation: 'Use "am" with the subject pronoun "I".' },
        { id: 'q2', prompt: 'Fill in the blank:', sentenceWithBlank: 'She ___ the lead developer on this project.', options: ['are', 'is', 'am', 'be'], correctIndex: 1, explanation: 'Use "is" with third-person singular (She).' }
      ]
    }
  },
  {
    id: 'en-prea1-list-1',
    languageCode: 'en',
    level: 'PRE_A1',
    moduleType: 'Listening',
    title: 'First Day Campus Orientation Listening',
    description: 'Listen to Priya introduce the PinIT campus system.',
    estimatedMinutes: 5,
    xpReward: 30,
    listeningExercise: {
      id: 'l-en-1',
      title: 'Priya Campus Welcome',
      narrationScript: 'Hello and welcome to PinIT. I am Priya. Today is your first day on campus. We will explore the laboratory and library.',
      speakerVoice: 'priya',
      questions: [
        { id: 'lq1', prompt: 'Who is speaking in the recording?', options: ['Alex', 'Priya', 'David', 'Sarah'], correctIndex: 1 },
        { id: 'lq2', prompt: 'Which place will be explored today?', options: ['The gym', 'The laboratory and library', 'The airport', 'The mall'], correctIndex: 1 }
      ]
    }
  },
  {
    id: 'en-prea1-spk-1',
    languageCode: 'en',
    level: 'PRE_A1',
    moduleType: 'Speaking',
    title: 'Self-Introduction Speech Practice',
    description: 'Introduce yourself politely in English.',
    estimatedMinutes: 5,
    xpReward: 40,
    speakingExercise: {
      id: 's-en-1',
      title: 'Self Introduction Drill',
      promptQuestion: 'Introduce yourself by stating your name, role, and interest in technology.',
      sampleResponse: 'Hello! My name is Alex. I am a computer science student and I love coding.',
      keywordsExpected: ['hello', 'name', 'student', 'coding'],
      minWordCount: 6
    }
  }
];

export const PRE_A1_ENGLISH_MISSION: FinalMission = {
  id: 'en-prea1-mission',
  languageCode: 'en',
  level: 'PRE_A1',
  title: 'Introduce Yourself to Priya on Campus',
  scenarioDescription: 'Complete your first English speaking interaction with Priya at the university welcome desk.',
  requiredLessons: ['en-prea1-vocab-1', 'en-prea1-gram-1', 'en-prea1-list-1', 'en-prea1-spk-1'],
  missionPrompt: 'Hello! Welcome to campus. Please state your name, your major, and why you are excited to study here.',
  keywordsTarget: ['hello', 'name', 'student', 'study', 'excited'],
  passingScorePct: 70
};
