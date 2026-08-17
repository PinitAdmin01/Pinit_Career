import { LanguageLesson, FinalMission } from '../../languageTypes';

export const PRE_A1_FRENCH_LESSONS: LanguageLesson[] = [
  {
    id: 'fr-prea1-vocab-1',
    languageCode: 'fr',
    level: 'PRE_A1',
    moduleType: 'Vocabulary',
    title: 'Salutations et Présentations à l’Université',
    description: 'Apprenez les salutations de base et le vocabulaire de l’université en français.',
    estimatedMinutes: 5,
    xpReward: 30,
    vocabularyItems: [
      { id: 'fr-v1', word: 'Bonjour', translation: 'Hello / Good morning', phonetic: '/bɔ̃ʒuʁ/', exampleSentence: 'Bonjour, je m’appelle Thomas.', exampleTranslation: 'Hello, my name is Thomas.', category: 'Salutations', quizQuestion: { prompt: 'Quelle est la salutation standard polie le matin ?', options: ['Au revoir', 'Bonjour', 'Bonne nuit', 'Merci'], correctIndex: 1 } },
      { id: 'fr-v2', word: 'Étudiant', translation: 'Student (male)', phonetic: '/etydjɑ̃/', exampleSentence: 'Je suis étudiant en informatique.', exampleTranslation: 'I am a computer science student.', category: 'Université', quizQuestion: { prompt: 'Quel mot désigne un élève à l’université ?', options: ['Professeur', 'Étudiant', 'Médecin', 'Pilote'], correctIndex: 1 } },
      { id: 'fr-v3', word: 'Professeur', translation: 'Teacher / Professor', phonetic: '/pʁɔfɛsœʁ/', exampleSentence: 'Le professeur explique le cours.', exampleTranslation: 'The professor explains the lesson.', category: 'Université', quizQuestion: { prompt: 'Qui enseigne le cours dans la salle ?', options: ['Étudiant', 'Professeur', 'Cuisinier', 'Chauffeur'], correctIndex: 1 } },
      { id: 'fr-v4', word: 'Bibliothèque', translation: 'Library', phonetic: '/biblijɔtɛk/', exampleSentence: 'J’étudie à la bibliothèque universitaire.', exampleTranslation: 'I study at the university library.', category: 'Université', quizQuestion: { prompt: 'Où peut-on emprunter des livres pour étudier ?', options: ['Au stade', 'À la bibliothèque', 'Au cinéma', 'Au marché'], correctIndex: 1 } },
      { id: 'fr-v5', word: 'Ordinateur', translation: 'Computer', phonetic: '/ɔʁdinatœʁ/', exampleSentence: 'J’écris du code sur mon ordinateur.', exampleTranslation: 'I write code on my computer.', category: 'Technologie', quizQuestion: { prompt: 'Quel appareil utilise-t-on pour programmer ?', options: ['Ordinateur', 'Table', 'Chaise', 'Stylo'], correctIndex: 0 } },
      { id: 'fr-v6', word: 'Merci', translation: 'Thank you', phonetic: '/mɛʁsi/', exampleSentence: 'Merci beaucoup pour votre aide.', exampleTranslation: 'Thank you very much for your help.', category: 'Politesse', quizQuestion: { prompt: 'Comment exprime-t-on la gratitude en français ?', options: ['Merci', 'Pardon', 'Oui', 'Non'], correctIndex: 0 } },
      { id: 'fr-v7', word: 'S’il vous plaît', translation: 'Please (formal)', phonetic: '/sil vu plɛ/', exampleSentence: 'Un café, s’il vous plaît.', exampleTranslation: 'A coffee, please.', category: 'Politesse', quizQuestion: { prompt: 'Quelle formule polie utilise-t-on pour demander quelque chose ?', options: ['S’il vous plaît', 'Au revoir', 'Jamais', 'Demain'], correctIndex: 0 } },
      { id: 'fr-v8', word: 'Oui', translation: 'Yes', phonetic: '/wi/', exampleSentence: 'Oui, je comprends la leçon.', exampleTranslation: 'Yes, I understand the lesson.', category: 'Bases', quizQuestion: { prompt: 'Comment dit-on "Yes" en français ?', options: ['Non', 'Oui', 'Peut-être', 'Jamais'], correctIndex: 1 } },
      { id: 'fr-v9', word: 'Non', translation: 'No', phonetic: '/nɔ̃/', exampleSentence: 'Non, je n’ai pas de question.', exampleTranslation: 'No, I have no questions.', category: 'Bases', quizQuestion: { prompt: 'Comment dit-on "No" en français ?', options: ['Oui', 'Non', 'Bien', 'Merci'], correctIndex: 1 } },
      { id: 'fr-v10', word: 'Au revoir', translation: 'Goodbye', phonetic: '/o ʁvwaʁ/', exampleSentence: 'Au revoir et à demain !', exampleTranslation: 'Goodbye and see you tomorrow!', category: 'Salutations', quizQuestion: { prompt: 'Quelle phrase utilise-t-on pour prendre congé ?', options: ['Bonjour', 'Au revoir', 'Pardon', 'Merci'], correctIndex: 1 } }
    ]
  },
  {
    id: 'fr-prea1-gram-1',
    languageCode: 'fr',
    level: 'PRE_A1',
    moduleType: 'Grammar',
    title: 'Les Verbes Auxiliaires : Être et Avoir au Présent',
    description: 'Maîtrisez les deux verbes essentiels de la langue française.',
    estimatedMinutes: 6,
    xpReward: 30,
    grammarTopic: {
      id: 'g-fr-1',
      title: 'Conjugaison de Être et Avoir',
      ruleExplanation: 'En français, "être" (to be) et "avoir" (to have) sont fondamentaux. "Je suis étudiant" (I am a student), "J’ai un ordinateur" (I have a computer).',
      patternExamples: ['Je suis étudiant.', 'Elle est professeure.', 'Nous avons un projet.'],
      practiceQuestions: [
        { id: 'fr-q1', prompt: 'Complétez la phrase :', sentenceWithBlank: 'Je ___ étudiant à l’université PinIT.', options: ['suis', 'est', 'sommes', 'avez'], correctIndex: 0, explanation: 'Utilisez "suis" avec le pronom "Je" pour le verbe être.' },
        { id: 'fr-q2', prompt: 'Complétez la phrase :', sentenceWithBlank: 'Elle ___ un nouvel ordinateur portable.', options: ['suis', 'a', 'est', 'avons'], correctIndex: 1, explanation: 'Utilisez "a" avec le sujet "Elle" pour le verbe avoir.' }
      ]
    }
  },
  {
    id: 'fr-prea1-list-1',
    languageCode: 'fr',
    level: 'PRE_A1',
    moduleType: 'Listening',
    title: 'Écoute : Accueil à l’Université Paris-Saclay',
    description: 'Écoutez le message de bienvenue en français.',
    estimatedMinutes: 5,
    xpReward: 30,
    listeningExercise: {
      id: 'l-fr-1',
      title: 'Bienvenue au Campus',
      narrationScript: 'Bonjour et bienvenue sur le campus PinIT. Je suis Sophie. Aujourd’hui, nous visitons le laboratoire d’informatique et la bibliothèque.',
      speakerVoice: 'fr-FR',
      questions: [
        { id: 'fr-lq1', prompt: 'Qui parle dans l’enregistrement ?', options: ['Marc', 'Sophie', 'Priya', 'Pierre'], correctIndex: 1 },
        { id: 'fr-lq2', prompt: 'Quels lieux sont visités aujourd’hui ?', options: ['Le stade', 'Le laboratoire d’informatique et la bibliothèque', 'Le restaurant', 'La gare'], correctIndex: 1 }
      ]
    }
  },
  {
    id: 'fr-prea1-spk-1',
    languageCode: 'fr',
    level: 'PRE_A1',
    moduleType: 'Speaking',
    title: 'Exercice d’Expression Orale : Se Présenter en Français',
    description: 'Présentez-vous poliment en français.',
    estimatedMinutes: 5,
    xpReward: 40,
    speakingExercise: {
      id: 's-fr-1',
      title: 'Présentation Personnelle',
      promptQuestion: 'Présentez-vous en disant votre prénom, votre rôle et votre domaine d’étude.',
      sampleResponse: 'Bonjour ! Je m’appelle Thomas. Je suis étudiant en informatique.',
      keywordsExpected: ['bonjour', 'appelle', 'étudiant', 'informatique'],
      minWordCount: 5
    }
  }
];

export const PRE_A1_FRENCH_MISSION: FinalMission = {
  id: 'fr-prea1-mission',
  languageCode: 'fr',
  level: 'PRE_A1',
  title: 'Mission Finale : Se Présenter à Sophie au Guichet d’Accueil',
  scenarioDescription: 'Réussissez votre premier échange en français avec Sophie au bureau d’accueil universitaire.',
  requiredLessons: ['fr-prea1-vocab-1', 'fr-prea1-gram-1', 'fr-prea1-list-1', 'fr-prea1-spk-1'],
  missionPrompt: 'Bonjour ! Bienvenue au campus. Présentez-vous et dites quelle matière vous étudiez.',
  keywordsTarget: ['bonjour', 'appelle', 'étudiant', 'étudie', 'merci'],
  passingScorePct: 70
};
