import { LanguageLesson, FinalMission } from '../../languageTypes';

export const PRE_A1_JAPANESE_LESSONS: LanguageLesson[] = [
  {
    id: 'ja-prea1-vocab-1',
    languageCode: 'ja',
    level: 'PRE_A1',
    moduleType: 'Vocabulary',
    title: 'キャンパスでの挨拶と自己紹介 (Campus Greetings & Introductions)',
    description: 'Learn fundamental Japanese greetings, politeness markers (Desu/Masu), and campus vocabulary.',
    estimatedMinutes: 5,
    xpReward: 30,
    vocabularyItems: [
      { id: 'ja-v1', word: 'こんにちは (Konnichiwa)', translation: 'Hello / Good afternoon', phonetic: 'Konnichiwa', exampleSentence: 'こんにちは、はじめまして。 (Konnichiwa, hajimemashite.)', exampleTranslation: 'Hello, nice to meet you.', category: '挨拶 (Greetings)', quizQuestion: { prompt: 'What is the standard polite daytime greeting in Japanese?', options: ['さようなら (Sayonara)', 'こんにちは (Konnichiwa)', 'おやすみ (Oyasumi)', 'ありがとう (Arigatou)'], correctIndex: 1 } },
      { id: 'ja-v2', word: '学生 (Gakusei)', translation: 'Student', phonetic: 'Gakusei', exampleSentence: '私は情報工学の学生です。 (Watashi wa jouhou kougaku no gakusei desu.)', exampleTranslation: 'I am a computer engineering student.', category: '大学 (University)', quizQuestion: { prompt: 'Which word means "Student" in Japanese?', options: ['先生 (Sensei)', '学生 (Gakusei)', '医者 (Isha)', '会社員 (Kaishain)'], correctIndex: 1 } },
      { id: 'ja-v3', word: '先生 (Sensei)', translation: 'Teacher / Professor', phonetic: 'Sensei', exampleSentence: '先生が講義を行います。 (Sensei ga kougi wo okoinaimasu.)', exampleTranslation: 'The professor gives a lecture.', category: '大学 (University)', quizQuestion: { prompt: 'Who instructs students in a classroom?', options: ['学生 (Gakusei)', '先生 (Sensei)', 'シェフ (Chef)', 'パイロット (Pilot)'], correctIndex: 1 } },
      { id: 'ja-v4', word: '図書館 (Toshokan)', translation: 'Library', phonetic: 'Toshokan', exampleSentence: '図書館で静かに勉強します。 (Toshokan de shizuka ni benkyou shimasu.)', exampleTranslation: 'I study quietly in the library.', category: '大学 (University)', quizQuestion: { prompt: 'Where do students study and borrow books?', options: ['公園 (Kouen)', '図書館 (Toshokan)', '映画館 (Eigakan)', '市場 (Ichiba)'], correctIndex: 1 } },
      { id: 'ja-v5', word: 'パソコン (Pasokon)', translation: 'Computer / Laptop', phonetic: 'Pasokon', exampleSentence: 'パソコンでコードを書きます。 (Pasokon de koudo wo kakimasu.)', exampleTranslation: 'I write code on my computer.', category: '技術 (Technology)', quizQuestion: { prompt: 'What device is used for coding?', options: ['パソコン (Pasokon)', '机 (Tsukue)', '椅子 (Isu)', 'ペン (Pen)'], correctIndex: 0 } },
      { id: 'ja-v6', word: 'ありがとう (Arigatou)', translation: 'Thank you', phonetic: 'Arigatou', exampleSentence: 'ご指導ありがとうございます。 (Goshidou arigatou gozaimasu.)', exampleTranslation: 'Thank you very much for your guidance.', category: '礼儀 (Politeness)', quizQuestion: { prompt: 'How do you express gratitude in Japanese?', options: ['ありがとう (Arigatou)', 'すみません (Sumimasen)', 'はい (Hai)', 'いいえ (Iie)'], correctIndex: 0 } },
      { id: 'ja-v7', word: 'すみません (Sumimasen)', translation: 'Excuse me / Sorry', phonetic: 'Sumimasen', exampleSentence: 'すみません、質問があります。 (Sumimasen, shitsumon ga arimasu.)', exampleTranslation: 'Excuse me, I have a question.', category: '礼儀 (Politeness)', quizQuestion: { prompt: 'What polite expression is used to call attention or apologize?', options: ['すみません (Sumimasen)', 'さようなら (Sayonara)', 'はい (Hai)', 'またね (Matane)'], correctIndex: 0 } },
      { id: 'ja-v8', word: 'はい (Hai)', translation: 'Yes / Understood', phonetic: 'Hai', exampleSentence: 'はい、理解しました。 (Hai, rikai shimashita.)', exampleTranslation: 'Yes, I understood.', category: '基本 (Basics)', quizQuestion: { prompt: 'How do you say "Yes" in Japanese?', options: ['いいえ (Iie)', 'はい (Hai)', 'たぶん (Tabun)', '全然 (Zenzen)'], correctIndex: 1 } },
      { id: 'ja-v9', word: 'いいえ (Iie)', translation: 'No / You are welcome', phonetic: 'Iie', exampleSentence: 'いいえ、問題ありません。 (Iie, mondai arimasen.)', exampleTranslation: 'No, no problem.', category: '基本 (Basics)', quizQuestion: { prompt: 'How do you say "No" in Japanese?', options: ['はい (Hai)', 'いいえ (Iie)', 'わかりました (Wakarimashita)', 'ありがとう (Arigatou)'], correctIndex: 1 } },
      { id: 'ja-v10', word: 'さようなら (Sayonara)', translation: 'Goodbye', phonetic: 'Sayonara', exampleSentence: 'さようなら、また明日。 (Sayonara, mata ashita.)', exampleTranslation: 'Goodbye, see you tomorrow.', category: '挨拶 (Greetings)', quizQuestion: { prompt: 'What expression is used for taking leave?', options: ['こんにちは (Konnichiwa)', 'さようなら (Sayonara)', 'すみません (Sumimasen)', 'はい (Hai)'], correctIndex: 1 } }
    ]
  },
  {
    id: 'ja-prea1-gram-1',
    languageCode: 'ja',
    level: 'PRE_A1',
    moduleType: 'Grammar',
    title: 'トピック助詞「は」と丁寧語「です」 (Topic Particle "Wa" & Copula "Desu")',
    description: 'Learn basic SOV Japanese sentence structure and polite copula forms.',
    estimatedMinutes: 6,
    xpReward: 30,
    grammarTopic: {
      id: 'g-ja-1',
      title: 'Topic Particle は (Wa) & Copula です (Desu)',
      ruleExplanation: 'In Japanese, the particle 「は」 (pronounced "wa") marks the topic of the sentence. 「です」 (desu) functions as the polite copula "is / am / are". Example: 「わたしは がくせい です」 (I am a student).',
      patternExamples: ['私は学生です。 (Watashi wa gakusei desu.)', '彼はエンジニアです。 (Kare wa enjinior desu.)', 'ここは図書館です。 (Koko wa toshokan desu.)'],
      practiceQuestions: [
        { id: 'ja-q1', prompt: 'Choose the correct topic particle:', sentenceWithBlank: '私 ___ 学生です。 (Watashi ___ gakusei desu.)', options: ['は (wa)', 'が (ga)', 'を (wo)', 'に (ni)'], correctIndex: 0, explanation: 'The particle 「は」 marks "Watashi" (I) as the sentence topic.' },
        { id: 'ja-q2', prompt: 'Choose the correct polite ending:', sentenceWithBlank: 'ここ は 図書館 ___。 (Koko wa toshokan ___.)', options: ['です (desu)', 'ます (masu)', 'でした (deshita)', 'じゃない (janai)'], correctIndex: 0, explanation: 'Use 「です」 as the polite copula ending.' }
      ]
    }
  },
  {
    id: 'ja-prea1-list-1',
    languageCode: 'ja',
    level: 'PRE_A1',
    moduleType: 'Listening',
    title: 'リスニング: 東京工業大学キャンパスの案内 (Tokyo Tech Campus Orientation)',
    description: 'Listen to Sakura introduce the Japanese campus.',
    estimatedMinutes: 5,
    xpReward: 30,
    listeningExercise: {
      id: 'l-ja-1',
      title: 'サクラのキャンパス案内 (Sakura Welcome)',
      narrationScript: 'みなさん、こんにちは。PinITキャンパスへようこそ。私はサクラです。今日はコンピューターラボと図書館を案内します。 (Minasan konnichiwa. PinIT kyampasu e youkoso. Watashi wa Sakura desu. Kyou wa konpyuuta rabo to toshokan wo annai shimasu.)',
      speakerVoice: 'ja-JP',
      questions: [
        { id: 'ja-lq1', prompt: 'Who is speaking in the audio?', options: ['Ken', 'Sakura', 'Priya', 'Taro'], correctIndex: 1 },
        { id: 'ja-lq2', prompt: 'Which locations will be guided today?', options: ['Gym', 'Computer lab and Library (コンピューターラボと図書館)', 'Restaurant', 'Airport'], correctIndex: 1 }
      ]
    }
  },
  {
    id: 'ja-prea1-spk-1',
    languageCode: 'ja',
    level: 'PRE_A1',
    moduleType: 'Speaking',
    title: 'スピーキング: 日本語での自己紹介 (Self-Introduction in Japanese)',
    description: 'Introduce yourself politely in Japanese using Hajimemashite.',
    estimatedMinutes: 5,
    xpReward: 40,
    speakingExercise: {
      id: 's-ja-1',
      title: 'はじめまして (Hajimemashite Drill)',
      promptQuestion: 'Introduce yourself in Japanese stating your name, role, and "Yoroshiku onegaishimasu".',
      sampleResponse: 'はじめまして。私はアレックスです。学生です。よろしくお願いします。 (Hajimemashite. Watashi wa Arekkusu desu. Gakusei desu. Yoroshiku onegaishimasu.)',
      keywordsExpected: ['はじめまして', '私', '学生', 'よろしく'],
      minWordCount: 4
    }
  }
];

export const PRE_A1_JAPANESE_MISSION: FinalMission = {
  id: 'ja-prea1-mission',
  languageCode: 'ja',
  level: 'PRE_A1',
  title: '最終ミッション: サクラさんへの自己紹介 (Introduce Yourself to Sakura)',
  scenarioDescription: 'Complete your first polite Japanese conversation at the campus registration desk.',
  requiredLessons: ['ja-prea1-vocab-1', 'ja-prea1-gram-1', 'ja-prea1-list-1', 'ja-prea1-spk-1'],
  missionPrompt: 'こんにちは！キャンパスへようこそ。お名前と専攻を教えてください。 (Konnichiwa! Kyampasu e youkoso. Onamae to senkou wo oshiete kudasai.)',
  keywordsTarget: ['はじめまして', '私', '学生', 'です', 'よろしく'],
  passingScorePct: 70
};
