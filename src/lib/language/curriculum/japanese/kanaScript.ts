import { KanaCharacter, LanguageLesson } from '../../languageTypes';

export const JAPANESE_HIRAGANA_CHARS: KanaCharacter[] = [
  { character: 'あ', romaji: 'a', type: 'hiragana', meaning: 'Vowel A', strokeOrderHint: 'Horizontal line, vertical curved line, loop', audioText: 'あ' },
  { character: 'い', romaji: 'i', type: 'hiragana', meaning: 'Vowel I', strokeOrderHint: 'Left curved stroke, shorter right stroke', audioText: 'い' },
  { character: 'う', romaji: 'u', type: 'hiragana', meaning: 'Vowel U', strokeOrderHint: 'Top dash, curved downward stroke', audioText: 'う' },
  { character: 'え', romaji: 'e', type: 'hiragana', meaning: 'Vowel E', strokeOrderHint: 'Top line, zigzag diagonal down right', audioText: 'え' },
  { character: 'お', romaji: 'o', type: 'hiragana', meaning: 'Vowel O', strokeOrderHint: 'Horizontal line, vertical cross, loop with right dot', audioText: 'お' },
  { character: 'か', romaji: 'ka', type: 'hiragana', meaning: 'KA sound', strokeOrderHint: 'Curved cross, vertical drop, right accent stroke', audioText: 'か' },
  { character: 'き', romaji: 'ki', type: 'hiragana', meaning: 'KI sound', strokeOrderHint: 'Two horizontal lines, diagonal vertical line, bottom curve', audioText: 'き' },
  { character: 'く', romaji: 'ku', type: 'hiragana', meaning: 'KU sound', strokeOrderHint: 'Single left-pointing bracket shape', audioText: 'く' },
  { character: 'け', romaji: 'ke', type: 'hiragana', meaning: 'KE sound', strokeOrderHint: 'Left vertical line, horizontal stroke crossing right vertical line', audioText: 'け' },
  { character: 'こ', romaji: 'ko', type: 'hiragana', meaning: 'KO sound', strokeOrderHint: 'Top horizontal line, bottom horizontal curved line', audioText: 'こ' }
];

export const JAPANESE_KATAKANA_CHARS: KanaCharacter[] = [
  { character: 'ア', romaji: 'a', type: 'katakana', meaning: 'Katakana A', strokeOrderHint: 'Top angle stroke, left diagonal sweep', audioText: 'ア' },
  { character: 'イ', romaji: 'i', type: 'katakana', meaning: 'Katakana I', strokeOrderHint: 'Left diagonal stroke, right vertical stroke', audioText: 'イ' },
  { character: 'ウ', romaji: 'u', type: 'katakana', meaning: 'Katakana U', strokeOrderHint: 'Top vertical dot, left downward stroke, horizontal roof', audioText: 'ウ' },
  { character: 'エ', romaji: 'e', type: 'katakana', meaning: 'Katakana E', strokeOrderHint: 'Top horizontal, vertical stem, bottom horizontal', audioText: 'エ' },
  { character: 'オ', romaji: 'o', type: 'katakana', meaning: 'Katakana O', strokeOrderHint: 'Horizontal line, vertical hooked stem, right diagonal', audioText: 'オ' }
];

export const JAPANESE_BASIC_KANJI: KanaCharacter[] = [
  { character: '日', romaji: 'nichi / hi', type: 'kanji', meaning: 'Sun / Day', strokeOrderHint: 'Box with middle horizontal line', audioText: 'にち' },
  { character: '本', romaji: 'hon / moto', type: 'kanji', meaning: 'Book / Origin', strokeOrderHint: 'Tree kanji with crossbar base', audioText: 'ほん' },
  { character: '人', romaji: 'jin / hito', type: 'kanji', meaning: 'Person / Human', strokeOrderHint: 'Two diagonal strokes meeting at top', audioText: 'ひと' },
  { character: '学', romaji: 'gaku', type: 'kanji', meaning: 'Study / Learn', strokeOrderHint: 'Crown roof over child character (子)', audioText: 'がく' },
  { character: '生', romaji: 'sei / sei', type: 'kanji', meaning: 'Life / Student', strokeOrderHint: 'Vertical stem with three horizontal lines', audioText: 'せい' }
];

export const JAPANESE_SCRIPT_DATA = {
  hiragana: JAPANESE_HIRAGANA_CHARS,
  katakana: JAPANESE_KATAKANA_CHARS,
  kanji: JAPANESE_BASIC_KANJI
};

export const JAPANESE_KANA_LESSON: LanguageLesson = {
  id: 'ja-kana-script-1',
  languageCode: 'ja',
  level: 'PRE_A1',
  moduleType: 'KanaScript',
  title: 'Japanese Script Foundations: Hiragana & Katakana Vowels',
  description: 'Master reading and writing the core Japanese phonetic alphabets (Hiragana & Katakana).',
  estimatedMinutes: 8,
  xpReward: 40,
  kanaCharacters: [...JAPANESE_HIRAGANA_CHARS, ...JAPANESE_KATAKANA_CHARS, ...JAPANESE_BASIC_KANJI]
};
