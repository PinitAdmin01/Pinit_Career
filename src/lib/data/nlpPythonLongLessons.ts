/**
 * NLP in Python: full-length lessons (about 20-30 minutes each), one per course day, written in plain
 * words for the Python track. Every code sample runs in the browser (Pyodide) and prints exactly
 * its `output`; tests/python_track_long_lessons.test.ts checks this and each lesson's length.
 * Days without a long lesson here still use the shorter lesson plan.
 */
import type { LongLesson } from './longLessons';

export const NLP_PYTHON_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "Text Preprocessing Pipeline: Unicode Normalization & Regex Tokenization",
    "goal": "You can explain why raw text must be cleaned before a computer can use it, normalise Unicode with NFKD, remove accents and punctuation, lowercase, tokenise with regular expressions and filter stopwords.",
    "minutes": 30,
    "recap": "This is the first day of the NLP course. You already know Python strings, lists and dictionaries; now you use them to turn messy human text into clean tokens a program can count.",
    "parts": [
      {
        "title": "Why text needs cleaning",
        "say": [
          "Natural language processing (NLP) is about getting computers to work with human language: search engines, spam filters, translators, chatbots and voice assistants all use it.",
          "Computers do not see words; they see sequences of characters. \"Café\", \"cafe\", \"CAFE\" and \"café!\" look different to a computer, even though a person reads them as the same word.",
          "If we count words without cleaning, \"The\" and \"the\" become two different words, and \"fox!\" never matches \"fox\". Every later step, from search to machine learning, gets worse.",
          "A preprocessing pipeline fixes this in steps: normalise Unicode, lowercase, remove punctuation, split into tokens, and remove words that carry little meaning.",
          "The exact steps depend on the task. Sentiment analysis may want to keep \"!\" and emojis, because they carry feeling; a search engine usually drops them.",
          "The example counts words in a sentence before and after simple cleaning.",
          "Good NLP starts with boring, careful cleaning. Most real-world NLP bugs come from text that was not cleaned the way the author assumed."
        ],
        "example": "Sorting a pile of letters before filing: you straighten them, remove staples and paper clips, and put them the right way up, or the filing system will not work.",
        "code": "from collections import Counter\n\ntext = \"The cat sat. THE CAT ran! the cat?\"\nprint(\"raw:\", Counter(text.split()))\nclean = \"\".join(ch if ch.isalnum() or ch.isspace() else \" \" for ch in text.lower())\nprint(\"clean:\", Counter(clean.split()))",
        "output": "raw: Counter({'The': 1, 'cat': 1, 'sat.': 1, 'THE': 1, 'CAT': 1, 'ran!': 1, 'the': 1, 'cat?': 1})\nclean: Counter({'the': 3, 'cat': 3, 'sat': 1, 'ran': 1})",
        "codeNotes": [
          {
            "line": 4,
            "note": "Splitting raw text keeps \"The\", \"THE\" and \"cat.\" as separate words."
          },
          {
            "line": 5,
            "note": "Lowercase and turn punctuation into spaces."
          }
        ],
        "tryIt": "Add \"Cat's\" to the sentence. What happens to the apostrophe, and is that what you want?",
        "check": {
          "question": "Why lowercase text before counting words?",
          "options": [
            "It makes text shorter",
            "So \"The\" and \"the\" count as the same word",
            "Python cannot read capitals"
          ],
          "answer": 1,
          "why": "Lowercasing merges words that differ only in case."
        }
      },
      {
        "title": "Unicode and normalisation",
        "say": [
          "Modern text is Unicode, which covers every writing system: Latin, Devanagari, Tamil, Chinese, emoji and more.",
          "A surprise: the same visible character can be stored in more than one way. \"é\" can be one code point, or the letter \"e\" followed by a separate combining accent.",
          "Unicode normalisation turns text into one standard form. NFC composes characters into single code points where possible; NFD decomposes them into base letters plus combining marks.",
          "The K forms (NFKC and NFKD) also replace \"compatibility\" characters with plain ones. For example the ligature \"ﬁ\" becomes \"f\" and \"i\", and a superscript \"²\" becomes \"2\".",
          "For search and matching, NFKD is useful: it decomposes everything, so we can then drop the combining marks and get plain letters.",
          "Python's unicodedata module does all of this: unicodedata.normalize(\"NFKD\", text) and unicodedata.combining(ch) to recognise accent marks.",
          "The example shows two strings that look identical but are not equal until they are normalised."
        ],
        "example": "Two recipes that say \"a dozen eggs\" and \"12 eggs\": the same thing written differently. Normalising rewrites both as \"12 eggs\" so they can be compared.",
        "code": "import unicodedata\n\none = \"caf\\u00e9\"          # é as a single code point\ntwo = \"cafe\\u0301\"         # e + combining acute accent\nprint(one, two, \"equal?\", one == two, \"lengths\", len(one), len(two))\nprint(\"after NFC:\", unicodedata.normalize(\"NFC\", one) == unicodedata.normalize(\"NFC\", two))\nprint(\"NFKD of the fi ligature:\", unicodedata.normalize(\"NFKD\", \"\\ufb01nal\"))",
        "output": "café café equal? False lengths 4 5\nafter NFC: True\nNFKD of the fi ligature: final",
        "codeNotes": [
          {
            "line": 5,
            "note": "They look the same but are different code point sequences."
          },
          {
            "line": 6,
            "note": "After normalising both, they compare equal."
          }
        ],
        "tryIt": "Try unicodedata.normalize(\"NFKD\", \"x²\"). What happened to the superscript?",
        "check": {
          "question": "Why normalise Unicode before comparing text?",
          "options": [
            "To make text uppercase",
            "The same visible character can be stored in different ways",
            "Unicode is slow"
          ],
          "answer": 1,
          "why": "Normalisation gives every string one standard representation."
        }
      },
      {
        "title": "Removing accents",
        "say": [
          "Once text is in NFKD form, accents are separate combining characters. Dropping them leaves the plain base letters: \"résumé\" becomes \"resume\".",
          "unicodedata.combining(ch) returns a non-zero number for combining marks and 0 for normal characters, so a simple filter does the job.",
          "This helps search: a user typing \"cafe\" should find \"Café\". It also shrinks the vocabulary, which helps statistical models with little data.",
          "Be careful with languages where accents change meaning. In Spanish \"año\" (year) and \"ano\" are very different words, so stripping accents is a choice, not a rule.",
          "For scripts like Devanagari, combining marks (matras) are part of the letters themselves. Stripping them would destroy the text, so apply accent removal only to text where it makes sense.",
          "Practice 2 is strip_accents(text): normalise with NFKD, keep every character that is not combining, and keep the original case.",
          "The example strips accents from a few words and also shows the ligature and superscript effects of NFKD."
        ],
        "example": "Taking the decorations off a cake before weighing it: useful to compare the cakes themselves, but not if the decorations are the point.",
        "code": "import unicodedata\n\ndef strip_accents(text):\n    return \"\".join(ch for ch in unicodedata.normalize(\"NFKD\", text) if not unicodedata.combining(ch))\n\nfor word in [\"Crème Brûlée\", \"naïve\", \"São Paulo\", \"\\ufb01nal\", \"x²\"]:\n    print(f\"{word!r:16} -> {strip_accents(word)!r}\")",
        "output": "'Crème Brûlée'   -> 'Creme Brulee'\n'naïve'          -> 'naive'\n'São Paulo'      -> 'Sao Paulo'\n'ﬁnal'           -> 'final'\n'x²'             -> 'x2'",
        "codeNotes": [
          {
            "line": 4,
            "note": "Decompose, then drop combining marks."
          }
        ],
        "tryIt": "Try strip_accents on \"año\". Would you use this for a Spanish search engine?",
        "check": {
          "question": "What does unicodedata.combining(ch) tell you?",
          "options": [
            "Whether ch is a vowel",
            "Whether ch is a combining mark such as an accent",
            "Whether ch is uppercase"
          ],
          "answer": 1,
          "why": "Combining marks attach to the previous character; the function returns non-zero for them."
        }
      },
      {
        "title": "Tokenising with regular expressions",
        "say": [
          "Tokenisation splits text into units called tokens, usually words. Splitting on spaces alone is naive: \"fox!\" keeps its punctuation, and \"Hello,world\" stays one token.",
          "A regular expression does better. re.sub(r\"[^\\w\\s]\", \" \", text) replaces every character that is not a word character (\\w: letters, digits, underscore) or whitespace (\\s) with a space.",
          "Then .split() with no argument splits on any run of whitespace and ignores leading and trailing spaces, so extra spaces never create empty tokens.",
          "Alternatively re.findall(r\"\\w+\", text) returns the runs of word characters directly. Both approaches are common.",
          "Real tokenisers handle more: \"don't\", \"U.S.A.\", URLs, hashtags and emoji. Libraries such as spaCy and NLTK have careful rules, and modern models use subword tokenisers (Day 22).",
          "For now, a clean regex tokenizer is enough and easy to understand and test.",
          "The example compares naive splitting with the regex approach on a tricky sentence."
        ],
        "example": "Cutting a loaf into slices along the lines you drew, rather than wherever the knife happens to land.",
        "code": "import re\n\ntext = \"Hello,world! It's  2026 -- NLP is fun.\"\nprint(\"split():   \", text.split())\nprint(\"regex sub: \", re.sub(r\"[^\\w\\s]\", \" \", text.lower()).split())\nprint(\"findall:   \", re.findall(r\"\\w+\", text.lower()))",
        "output": "split():    ['Hello,world!', \"It's\", '2026', '--', 'NLP', 'is', 'fun.']\nregex sub:  ['hello', 'world', 'it', 's', '2026', 'nlp', 'is', 'fun']\nfindall:    ['hello', 'world', 'it', 's', '2026', 'nlp', 'is', 'fun']",
        "codeNotes": [
          {
            "line": 5,
            "note": "Punctuation becomes spaces, then split on whitespace."
          },
          {
            "line": 6,
            "note": "findall returns the runs of word characters."
          }
        ],
        "tryIt": "How is \"It's\" tokenised by each method? Which would you prefer for search?",
        "check": {
          "question": "Why is text.split() alone a weak tokenizer?",
          "options": [
            "It is slow",
            "It keeps punctuation attached and cannot split \"Hello,world\"",
            "It removes numbers"
          ],
          "answer": 1,
          "why": "Plain split only breaks on whitespace, so punctuation stays glued to words."
        }
      },
      {
        "title": "Stopwords",
        "say": [
          "Stopwords are very common words that carry little meaning on their own: \"the\", \"is\", \"at\", \"a\", \"of\".",
          "In a search engine or topic model, they add noise. Every English document contains \"the\", so it does not help tell documents apart.",
          "Removing them shrinks the data and lets the meaningful words stand out. Stopword lists exist for most languages.",
          "Use a set for the stopword list, because checking membership in a set is fast even for big lists.",
          "But be careful: for some tasks stopwords matter a lot. \"not\" flips the meaning of \"not good\", and \"to be or not to be\" is almost entirely stopwords. Sentiment models and modern neural models usually keep them.",
          "Practice 1 is normalize_tokens(text, stopwords): NFKD and accent removal, lowercase, punctuation to spaces, split, and filter stopwords.",
          "The example shows a sentence before and after removing stopwords."
        ],
        "example": "Skimming a newspaper by reading only the nouns and verbs: you still get the story, but you would miss a \"not\" that changes it.",
        "code": "STOP = {\"the\", \"is\", \"at\", \"a\", \"of\", \"on\", \"and\", \"to\"}\ntokens = \"the price of the house is at a record high\".split()\nkept = [t for t in tokens if t not in STOP]\nprint(\"before:\", tokens)\nprint(\"after: \", kept)\nprint(\"words removed:\", len(tokens) - len(kept))",
        "output": "before: ['the', 'price', 'of', 'the', 'house', 'is', 'at', 'a', 'record', 'high']\nafter:  ['price', 'house', 'record', 'high']\nwords removed: 6",
        "codeNotes": [
          {
            "line": 1,
            "note": "A set makes the membership test fast."
          },
          {
            "line": 3,
            "note": "Keep only words that are not stopwords."
          }
        ],
        "tryIt": "Remove stopwords from \"this movie is not good\". What went wrong for sentiment analysis?",
        "check": {
          "question": "When can removing stopwords hurt?",
          "options": [
            "Never",
            "In sentiment analysis, where words like \"not\" change the meaning",
            "Only with numbers"
          ],
          "answer": 1,
          "why": "Some \"stop\" words carry crucial meaning for certain tasks."
        }
      },
      {
        "title": "Practice time: the full pipeline",
        "say": [
          "Practice 1 puts the steps in order: normalize_tokens(text, stopwords).",
          "Step 1: unicodedata.normalize(\"NFKD\", text), then drop combining marks. Step 2: lowercase. Step 3: re.sub(r\"[^\\w\\s]\", \" \", ...) to turn punctuation into spaces.",
          "Step 4: .split() on whitespace. Step 5: keep tokens that are not in stopwords.",
          "Order matters. If you removed punctuation before normalising, some decomposed characters could behave unexpectedly; if you lowercased after filtering, \"The\" would slip past a lowercase stopword list.",
          "Practice 2 is strip_accents(text): the first step on its own, keeping case.",
          "The checks use \"Café résumé: The quick brown fox!\" and expect exactly [\"cafe\", \"resume\", \"quick\", \"brown\", \"fox\"].",
          "The example runs the whole pipeline and prints the result after each step, a good habit when debugging text processing."
        ],
        "example": "A car wash with stations in a fixed order: rinse, soap, scrub, rinse again, dry. Swap two stations and the car comes out worse.",
        "code": "import re\nimport unicodedata\n\ntext = \"Café résumé: The quick brown fox!\"\nstep1 = \"\".join(c for c in unicodedata.normalize(\"NFKD\", text) if not unicodedata.combining(c))\nstep2 = step1.lower()\nstep3 = re.sub(r\"[^\\w\\s]\", \" \", step2)\nstep4 = step3.split()\nstep5 = [t for t in step4 if t not in {\"the\", \"a\", \"is\"}]\nfor n, value in enumerate([step1, step2, step3, step4, step5], start=1):\n    print(n, repr(value))",
        "output": "1 'Cafe resume: The quick brown fox!'\n2 'cafe resume: the quick brown fox!'\n3 'cafe resume  the quick brown fox '\n4 ['cafe', 'resume', 'the', 'quick', 'brown', 'fox']\n5 ['cafe', 'resume', 'quick', 'brown', 'fox']",
        "codeNotes": [
          {
            "line": 5,
            "note": "Normalise and remove accents."
          },
          {
            "line": 9,
            "note": "Filter stopwords last, after lowercasing."
          }
        ],
        "tryIt": "Move the stopword filter before lowercasing. Which word slips through?",
        "check": {
          "question": "Why lowercase BEFORE filtering stopwords?",
          "options": [
            "It is faster",
            "Otherwise \"The\" would not match the lowercase stopword \"the\"",
            "Stopwords must be uppercase"
          ],
          "answer": 1,
          "why": "The stopword list is lowercase, so tokens must be lowercased first."
        }
      }
    ],
    "summary": [
      "NLP starts with cleaning: computers see characters, not words.",
      "Unicode normalisation (NFC, NFD, NFKC, NFKD) gives each string one standard form.",
      "NFKD plus dropping combining marks removes accents; use it only where accents do not change meaning.",
      "Regex tokenisation handles punctuation far better than plain split.",
      "Stopword removal cuts noise for search, but can remove meaning for tasks like sentiment."
    ],
    "projectStep": {
      "title": "Text cleaner for your own data",
      "steps": [
        "Collect 20 sentences from any source you like (reviews, messages, headlines).",
        "Run them through normalize_tokens and print the 10 most common tokens.",
        "Decide which steps help your task and which remove useful meaning."
      ]
    }
  },
  {
    "day": 2,
    "title": "Morphological Analysis: Heuristic Stemming vs POS-Aware Lemmatization",
    "goal": "You can explain why words are reduced to a base form, write a rule-based stemmer, use a part-of-speech-aware lemmatiser, and choose between stemming and lemmatisation for a task.",
    "minutes": 30,
    "recap": "Yesterday you turned raw text into clean tokens. But \"run\", \"runs\" and \"running\" are still three different tokens. Today you reduce words to a common base form.",
    "parts": [
      {
        "title": "Many forms, one meaning",
        "say": [
          "English words change form: run, runs, ran, running; study, studies, studied; good, better, best.",
          "For many tasks these forms mean the same thing. A search for \"running shoes\" should find a page about \"run shoes\" or \"runner shoes\".",
          "Reducing each word to a base form shrinks the vocabulary and lets counts add up: three mentions of different forms become three mentions of one word.",
          "There are two main approaches. Stemming chops off endings with rules; it is fast and crude. Lemmatisation looks words up in a dictionary to find the true base form, the lemma; it is slower and more accurate.",
          "Morphology is the study of how words are built from parts: a root plus prefixes and suffixes. Languages differ hugely; Turkish or Finnish can pack a whole sentence into one word.",
          "The example groups word forms by a hand-made base form to show how counts combine.",
          "The goal is not perfect linguistics but better matching and counting for the task at hand."
        ],
        "example": "Filing letters by family surname rather than by each person's first name, so everything for the Sharma family lands in one folder.",
        "code": "from collections import Counter\n\ntokens = [\"run\", \"runs\", \"running\", \"ran\", \"shoe\", \"shoes\"]\nbase = {\"runs\": \"run\", \"running\": \"run\", \"ran\": \"run\", \"shoes\": \"shoe\"}\nprint(\"as written:\", Counter(tokens))\nprint(\"base forms:\", Counter(base.get(t, t) for t in tokens))",
        "output": "as written: Counter({'run': 1, 'runs': 1, 'running': 1, 'ran': 1, 'shoe': 1, 'shoes': 1})\nbase forms: Counter({'run': 4, 'shoe': 2})",
        "codeNotes": [
          {
            "line": 6,
            "note": "Words without a mapping keep their own form."
          }
        ],
        "tryIt": "Add \"runner\". Should it map to \"run\"? Why might a search engine want it to, and a grammar checker not?",
        "check": {
          "question": "What is a lemma?",
          "options": [
            "A spelling mistake",
            "The dictionary base form of a word",
            "A punctuation mark"
          ],
          "answer": 1,
          "why": "The lemma is the form you would look up in a dictionary, such as \"run\" for \"running\"."
        }
      },
      {
        "title": "Stemming with suffix rules",
        "say": [
          "A stemmer applies rules to strip suffixes. The famous Porter stemmer (1980) has about 60 rules in five steps; the Snowball stemmer improves on it and supports many languages.",
          "Stems are not always real words. Porter turns \"studies\" into \"studi\" and \"universal\" into \"univers\". That is fine for matching, because every form maps to the same stem.",
          "Stemmers make two kinds of error. Over-stemming merges words that differ in meaning (\"universe\" and \"university\" both become \"univers\"). Under-stemming fails to merge related words (\"ran\" stays \"ran\").",
          "Practice 1 is simple_stem(word): try suffixes \"ing\", \"ed\", \"ly\", \"es\", \"s\" in order, strip the first that fits while leaving at least 3 letters, then undouble a final consonant pair.",
          "The minimum length rule protects short words: without it \"sing\" would become \"s\".",
          "Undoubling fixes forms like \"running\" -> \"runn\" -> \"run\" and \"stopped\" -> \"stopp\" -> \"stop\".",
          "The example runs the simple stemmer over a list of words, including some it gets wrong."
        ],
        "example": "Trimming hedges with a template: quick and consistent, but it cannot tell a rose bush from a weed.",
        "code": "def simple_stem(word):\n    w = word.lower()\n    for suf in (\"ing\", \"ed\", \"ly\", \"es\", \"s\"):\n        if w.endswith(suf) and len(w) - len(suf) >= 3:\n            w = w[:-len(suf)]\n            break\n    if len(w) >= 2 and w[-1] == w[-2] and w[-1] not in \"aeiou\":\n        w = w[:-1]\n    return w\n\nfor word in [\"running\", \"stopped\", \"quickly\", \"boxes\", \"cats\", \"sing\", \"ran\", \"news\"]:\n    print(f\"{word:9} -> {simple_stem(word)}\")",
        "output": "running   -> run\nstopped   -> stop\nquickly   -> quick\nboxes     -> box\ncats      -> cat\nsing      -> sing\nran       -> ran\nnews      -> new",
        "codeNotes": [
          {
            "line": 4,
            "note": "Strip only if at least 3 letters remain."
          },
          {
            "line": 7,
            "note": "Undouble a final consonant pair like nn or pp."
          }
        ],
        "tryIt": "Look at \"ran\" and \"news\". Which is under-stemming and which is over-stemming?",
        "check": {
          "question": "Porter stems \"studies\" to \"studi\". Is that a problem for search?",
          "options": [
            "Yes, it is not a real word",
            "Not usually: all forms map to the same stem, so they still match",
            "Yes, search needs real words"
          ],
          "answer": 1,
          "why": "Stems only need to be consistent for matching; they need not be dictionary words."
        }
      },
      {
        "title": "Parts of speech",
        "say": [
          "The same word can play different roles. \"Meeting\" is a noun in \"the meeting ran late\" and a verb in \"we are meeting at noon\".",
          "These roles are parts of speech (POS): noun, verb, adjective, adverb, pronoun, preposition and so on.",
          "Part of speech changes the base form. As a verb, \"meeting\" reduces to \"meet\"; as a noun it stays \"meeting\". \"Better\" as an adjective reduces to \"good\", but as a verb (\"to better oneself\") it stays \"better\".",
          "That is why lemmatisers take the part of speech as input. Without it, they must guess, and often guess noun.",
          "Automatic POS tagging is a classic NLP task you will build on Day 10 with hidden Markov models.",
          "Common tag sets include the Universal Dependencies tags (NOUN, VERB, ADJ...) and the older Penn Treebank tags (NN, VBG, JJ...).",
          "The example shows the same word getting different lemmas depending on its part of speech."
        ],
        "example": "The word \"lead\": pronounced one way as a verb (to guide) and another as a noun (the metal). Knowing the role tells you how to read it.",
        "code": "lemmas = {(\"meeting\", \"VERB\"): \"meet\", (\"better\", \"ADJ\"): \"good\", (\"saw\", \"VERB\"): \"see\",\n          (\"saw\", \"NOUN\"): \"saw\", (\"leaves\", \"NOUN\"): \"leaf\", (\"leaves\", \"VERB\"): \"leave\"}\nfor word, pos in [(\"meeting\", \"VERB\"), (\"meeting\", \"NOUN\"), (\"saw\", \"VERB\"), (\"saw\", \"NOUN\"),\n                  (\"leaves\", \"NOUN\"), (\"leaves\", \"VERB\")]:\n    print(f\"{word:8} as {pos:4} -> {lemmas.get((word, pos), word)}\")",
        "output": "meeting  as VERB -> meet\nmeeting  as NOUN -> meeting\nsaw      as VERB -> see\nsaw      as NOUN -> saw\nleaves   as NOUN -> leaf\nleaves   as VERB -> leave",
        "codeNotes": [
          {
            "line": 1,
            "note": "The key is the word AND its part of speech."
          },
          {
            "line": 5,
            "note": "Unknown pairs keep the word itself."
          }
        ],
        "tryIt": "Add (\"better\", \"VERB\") to the table. What should its lemma be?",
        "check": {
          "question": "Why does a lemmatiser need the part of speech?",
          "options": [
            "To count letters",
            "The base form depends on the role, e.g. \"meeting\" noun vs verb",
            "It does not need it"
          ],
          "answer": 1,
          "why": "Different parts of speech can have different lemmas for the same spelling."
        }
      },
      {
        "title": "Dictionary lemmatisation",
        "say": [
          "A lemmatiser uses a dictionary of word forms, such as WordNet for English, plus rules for regular endings.",
          "It handles irregular forms that no suffix rule could: \"mice\" -> \"mouse\", \"was\" -> \"be\", \"went\" -> \"go\", \"better\" (adjective) -> \"good\".",
          "Practice 2 is lemmatize(word, pos, lemma_dict): lowercase the word, look up the (word, pos) pair, and return the word itself if the pair is unknown.",
          "Using a tuple (word, pos) as a dictionary key is a neat Python trick: tuples are hashable, so they can be keys, and the lookup is a single fast operation.",
          "Lemmatisation is slower than stemming because it needs the dictionary and ideally a POS tagger, but the output is real words, which matters when people will read them.",
          "Libraries: spaCy lemmatises as part of its pipeline; NLTK wraps WordNet.",
          "The example builds a tiny lemmatiser and applies it to a tagged sentence."
        ],
        "example": "Looking up a word in a proper dictionary instead of guessing its root from its ending.",
        "code": "D = {(\"mice\", \"NOUN\"): \"mouse\", (\"was\", \"VERB\"): \"be\", (\"chasing\", \"VERB\"): \"chase\",\n     (\"better\", \"ADJ\"): \"good\", (\"cats\", \"NOUN\"): \"cat\"}\n\ndef lemmatize(word, pos, lemma_dict):\n    w = word.lower()\n    return lemma_dict.get((w, pos), w)\n\ntagged = [(\"The\", \"DET\"), (\"cats\", \"NOUN\"), (\"was\", \"VERB\"), (\"chasing\", \"VERB\"), (\"mice\", \"NOUN\")]\nprint([lemmatize(w, p, D) for w, p in tagged])",
        "output": "['the', 'cat', 'be', 'chase', 'mouse']",
        "codeNotes": [
          {
            "line": 6,
            "note": "dict.get with a default returns the word when the pair is unknown."
          }
        ],
        "tryIt": "Add a fallback: if the pair is unknown and pos is \"NOUN\", strip a final \"s\". Test it on \"dogs\".",
        "check": {
          "question": "Which does a lemmatiser handle that a suffix stemmer cannot?",
          "options": [
            "Removing \"ing\"",
            "Irregular forms like \"mice\" -> \"mouse\"",
            "Lowercasing"
          ],
          "answer": 1,
          "why": "Irregular forms need dictionary knowledge, not suffix rules."
        }
      },
      {
        "title": "Choosing between them",
        "say": [
          "Stemming is fast, needs no dictionary and works acceptably for search engines, where users never see the stems.",
          "Lemmatisation is more accurate, keeps real words and handles irregular forms, so it suits tasks where people read the output or where precision matters, such as extracting facts.",
          "Many modern systems do neither. Neural models with subword tokenisers (Day 22) learn the relationship between \"run\" and \"running\" from data, and reducing words can remove useful information such as tense.",
          "The right choice depends on the language too. For highly inflected languages, good lemmatisation helps statistical methods much more than it does for English.",
          "Measure rather than guess. Try the pipeline with and without reduction and compare the results on your task, such as search accuracy.",
          "The example measures how much each approach shrinks a vocabulary.",
          "A smaller vocabulary is not automatically better; what matters is whether the task gets better."
        ],
        "example": "Choosing between a quick sketch and a careful drawing: the sketch is enough for directions, the drawing for a museum.",
        "code": "def stem(w):\n    for suf in (\"ing\", \"ed\", \"es\", \"s\"):\n        if w.endswith(suf) and len(w) - len(suf) >= 3:\n            return w[:-len(suf)]\n    return w\n\nwords = [\"play\", \"plays\", \"played\", \"playing\", \"study\", \"studies\", \"studied\", \"mouse\", \"mice\"]\nlemmas = {\"plays\": \"play\", \"played\": \"play\", \"playing\": \"play\", \"studies\": \"study\", \"studied\": \"study\", \"mice\": \"mouse\"}\nprint(\"original vocabulary:\", len(set(words)))\nprint(\"stemmed:\", sorted({stem(w) for w in words}))\nprint(\"lemmatised:\", sorted({lemmas.get(w, w) for w in words}))",
        "output": "original vocabulary: 9\nstemmed: ['mice', 'mouse', 'play', 'studi', 'study']\nlemmatised: ['mouse', 'play', 'study']",
        "codeNotes": [
          {
            "line": 10,
            "note": "Stems: fast but \"studi\" and \"mice\" stay apart from their relatives."
          },
          {
            "line": 11,
            "note": "Lemmas: real words, irregulars handled."
          }
        ],
        "tryIt": "Which method grouped \"mouse\" and \"mice\"? Which grouped \"study\", \"studies\" and \"studied\" perfectly?",
        "check": {
          "question": "For a search box where users never see the processed words, which is often good enough?",
          "options": [
            "Stemming",
            "Hand-written grammar",
            "Neither"
          ],
          "answer": 0,
          "why": "Stemming is fast and consistent, which is usually enough for matching in search."
        }
      },
      {
        "title": "Practice time: stem and lemmatise",
        "say": [
          "Practice 1: simple_stem(word). Lowercase first, then loop over the suffixes in the given order and break after the first strip.",
          "The break matters. Without it, \"boxes\" would lose \"es\" and then also be checked for \"s\", and words could lose more than one suffix.",
          "Then undouble: if the last two letters are the same and not a vowel, drop one. \"running\" -> \"runn\" -> \"run\"; \"see\" is left alone because e is a vowel.",
          "Practice 2: lemmatize(word, pos, lemma_dict). One lookup with a tuple key and a default.",
          "The checks include \"meeting\" as a verb and as a noun, and a capitalised \"Mice\", so lowercase before looking up.",
          "After passing, compare your stemmer with the lemmatiser on the same words and notice where each wins.",
          "The example shows why the break is needed."
        ],
        "example": "Taking one layer off an onion at a time, and stopping when the recipe says so, not peeling it to nothing.",
        "code": "def no_break(w):\n    for suf in (\"ing\", \"ed\", \"ly\", \"es\", \"s\"):\n        if w.endswith(suf) and len(w) - len(suf) >= 3:\n            w = w[:-len(suf)]\n    return w\n\ndef with_break(w):\n    for suf in (\"ing\", \"ed\", \"ly\", \"es\", \"s\"):\n        if w.endswith(suf) and len(w) - len(suf) >= 3:\n            return w[:-len(suf)]\n    return w\n\nfor w in [\"glasses\", \"classes\", \"carelessly\"]:\n    print(f\"{w:11} no break: {no_break(w):8} with break: {with_break(w)}\")",
        "output": "glasses     no break: glas     with break: glass\nclasses     no break: clas     with break: class\ncarelessly  no break: careles  with break: careless",
        "codeNotes": [
          {
            "line": 4,
            "note": "Without break, several suffixes can be stripped in a row."
          }
        ],
        "tryIt": "Which output for \"carelessly\" is closer to what you want?",
        "check": {
          "question": "For simple_stem(\"sing\"), why is nothing stripped?",
          "options": [
            "\"sing\" has no suffix",
            "Stripping \"ing\" would leave fewer than 3 letters",
            "It is a verb"
          ],
          "answer": 1,
          "why": "The minimum length rule protects short words from being destroyed."
        }
      }
    ],
    "summary": [
      "Word forms (run, runs, running) often mean the same thing for a task; reducing them merges counts.",
      "Stemming strips suffixes with rules: fast, crude, stems need not be real words.",
      "Lemmatisation uses a dictionary and the part of speech: slower, accurate, handles irregular forms.",
      "Part of speech changes the base form (\"meeting\" noun vs verb).",
      "Choose by task and measure; modern neural models often skip both."
    ],
    "projectStep": {
      "title": "Normalise your vocabulary",
      "steps": [
        "Take the tokens from yesterday's project and run them through simple_stem.",
        "Build a small lemma dictionary for the 10 most common irregular words in your data.",
        "Compare vocabulary size and the top words before and after each method."
      ]
    }
  },
  {
    "day": 3,
    "title": "N-Gram Language Models: Maximum Likelihood & Laplace Smoothing",
    "goal": "You can explain what a language model is, build bigram counts from text, compute maximum likelihood probabilities, fix zero probabilities with Laplace smoothing, and evaluate a model with perplexity.",
    "minutes": 30,
    "recap": "You can now clean text and reduce words to base forms. Today you teach the computer something about how words follow each other, which is the idea behind every language model up to GPT.",
    "parts": [
      {
        "title": "What a language model does",
        "say": [
          "A language model assigns a probability to a sequence of words. It answers: how likely is this sentence? Or, given these words, what comes next?",
          "Your phone keyboard's next-word suggestions, speech recognition choosing between similar-sounding phrases, and ChatGPT all rely on language models.",
          "The simplest idea is to count. If \"good morning\" appears far more often than \"good banana\" in lots of text, then after \"good\", \"morning\" is more probable.",
          "An n-gram is a sequence of n words. Unigrams are single words, bigrams are pairs, trigrams are triples.",
          "A bigram model assumes each word depends only on the word before it. That is a big simplification, called the Markov assumption, but it works surprisingly well for short-range patterns.",
          "The example builds bigrams from a tiny text with zip, a neat Python trick for pairing each word with the next.",
          "Modern neural models look at thousands of previous words, but the goal is the same: predict the next word well."
        ],
        "example": "Guessing the next word in a friend's catchphrase: after \"see you\", you expect \"later\" because you have heard it so often.",
        "code": "from collections import Counter\n\ntokens = \"<s> i like tea </s> <s> i like coffee </s> <s> you like tea </s>\".split()\nbigrams = list(zip(tokens, tokens[1:]))\nprint(\"first bigrams:\", bigrams[:4])\ncounts = Counter(bigrams)\nprint(\"after 'like':\", {b[1]: n for b, n in counts.items() if b[0] == \"like\"})",
        "output": "first bigrams: [('<s>', 'i'), ('i', 'like'), ('like', 'tea'), ('tea', '</s>')]\nafter 'like': {'tea': 2, 'coffee': 1}",
        "codeNotes": [
          {
            "line": 4,
            "note": "zip pairs each token with the one after it."
          },
          {
            "line": 7,
            "note": "Every word that followed \"like\", with its count."
          }
        ],
        "tryIt": "Which word most often follows \"<s>\" (the start of a sentence)?",
        "check": {
          "question": "What does a bigram model assume?",
          "options": [
            "Every word is equally likely",
            "Each word depends only on the previous word",
            "Word order does not matter"
          ],
          "answer": 1,
          "why": "The Markov assumption: only the previous word matters."
        }
      },
      {
        "title": "Maximum likelihood estimates",
        "say": [
          "The most direct way to turn counts into probabilities is maximum likelihood estimation (MLE).",
          "For bigrams, P(word | previous) = count(previous, word) / count(previous). The probability of \"tea\" after \"like\" is how often \"like tea\" appears, divided by how often \"like\" appears.",
          "These probabilities, for a fixed previous word, add up to 1 over all possible next words.",
          "The probability of a whole sentence is the product of its bigram probabilities, from the start symbol <s> to the end symbol </s>.",
          "Start and end symbols matter: they let the model learn which words tend to begin and end sentences.",
          "The example computes MLE probabilities from yesterday's tiny corpus and scores two sentences.",
          "Multiplying many small probabilities produces tiny numbers; real code adds log probabilities instead, a trick you will meet again on Day 12."
        ],
        "example": "Estimating how often it rains on Mondays by counting rainy Mondays in your diary and dividing by all Mondays you recorded.",
        "code": "from collections import Counter\n\ntokens = \"<s> i like tea </s> <s> i like coffee </s> <s> you like tea </s>\".split()\npair = Counter(zip(tokens, tokens[1:]))\nsingle = Counter(tokens[:-1])\n\ndef p(prev, word):\n    return pair[(prev, word)] / single[prev]\n\ndef sentence_prob(words):\n    seq = [\"<s>\"] + words + [\"</s>\"]\n    prob = 1.0\n    for a, b in zip(seq, seq[1:]):\n        prob *= p(a, b)\n    return round(prob, 4)\n\nprint(\"P(tea | like) =\", round(p(\"like\", \"tea\"), 4))\nprint(\"i like tea:\", sentence_prob([\"i\", \"like\", \"tea\"]))\nprint(\"you like coffee:\", sentence_prob([\"you\", \"like\", \"coffee\"]))",
        "output": "P(tea | like) = 0.6667\ni like tea: 0.4444\nyou like coffee: 0.1111",
        "codeNotes": [
          {
            "line": 8,
            "note": "Bigram count divided by the count of the previous word."
          },
          {
            "line": 14,
            "note": "A sentence's probability is the product of its bigrams."
          }
        ],
        "tryIt": "Score \"i like milk\". What happens, and why is it a problem?",
        "check": {
          "question": "\"like\" appears 3 times and \"like tea\" twice. What is the MLE P(tea | like)?",
          "options": [
            "1/3",
            "2/3",
            "1"
          ],
          "answer": 1,
          "why": "Bigram count 2 divided by context count 3."
        }
      },
      {
        "title": "The zero problem",
        "say": [
          "MLE has a serious flaw: any word pair never seen in the training text gets probability 0.",
          "And because a sentence's probability is a product, one zero makes the whole sentence impossible. \"i like milk\" is a perfectly good sentence, yet our tiny model gives it probability 0, because it never saw the pair \"like milk\".",
          "No training set contains every possible sentence, so a model that calls new sentences impossible is useless for real text.",
          "This is called data sparsity. Most possible word pairs are rare, and most rare pairs never appear even in huge collections of text.",
          "The fix is smoothing: take a little probability away from seen events and give it to unseen ones.",
          "Laplace smoothing, also called add-one smoothing, is the simplest method and comes next.",
          "The example counts how many possible bigrams our tiny corpus has actually seen, to show how sparse the data is."
        ],
        "example": "A restaurant that has only ever sold the dishes on yesterday's receipts, and so refuses to believe anyone could order anything new.",
        "code": "tokens = \"<s> i like tea </s> <s> i like coffee </s> <s> you like tea </s>\".split()\nvocab = sorted(set(tokens))\nseen = set(zip(tokens, tokens[1:]))\npossible = len(vocab) ** 2\nprint(\"vocabulary:\", vocab)\nprint(\"bigrams seen:\", len(seen), \"of\", possible, \"possible\")\nprint(f\"unseen: {1 - len(seen) / possible:.0%}\")",
        "output": "vocabulary: ['</s>', '<s>', 'coffee', 'i', 'like', 'tea', 'you']\nbigrams seen: 9 of 49 possible\nunseen: 82%",
        "codeNotes": [
          {
            "line": 4,
            "note": "Every word could in principle follow every word."
          }
        ],
        "tryIt": "Add one more sentence to the tokens. Does the share of unseen bigrams go down much?",
        "check": {
          "question": "Why does one unseen bigram make an MLE sentence probability 0?",
          "options": [
            "Because of rounding",
            "The sentence probability is a product, and one factor is 0",
            "Because of the start symbol"
          ],
          "answer": 1,
          "why": "Any zero factor makes the whole product zero."
        }
      },
      {
        "title": "Laplace (add-one) smoothing",
        "say": [
          "Laplace smoothing pretends every possible bigram was seen one extra time.",
          "The formula becomes P(word | previous) = (count(previous, word) + 1) / (count(previous) + V), where V is the vocabulary size.",
          "Adding V to the denominator keeps the probabilities for each previous word summing to 1, because we added 1 for each of the V possible next words.",
          "Now unseen pairs get a small non-zero probability, and seen pairs lose a little.",
          "Practice 1 is laplace_bigram_prob(bigram_count, context_count, vocab_size), rounded to 4 decimals.",
          "Add-one is simple but crude: with a big vocabulary it takes too much probability from seen events. Better methods such as add-k, Good-Turing and Kneser-Ney smoothing exist, and Kneser-Ney was the standard in pre-neural speech and translation systems.",
          "The example compares MLE and Laplace probabilities for a seen and an unseen pair."
        ],
        "example": "A teacher who gives every student one bonus mark before grading, so nobody ends up with a flat zero.",
        "code": "def mle(bigram_count, context_count):\n    return round(bigram_count / context_count, 4)\n\ndef laplace(bigram_count, context_count, vocab_size):\n    return round((bigram_count + 1) / (context_count + vocab_size), 4)\n\nV = 8\nprint(\"seen 'like tea':  MLE\", mle(2, 3), \" Laplace\", laplace(2, 3, V))\nprint(\"unseen 'like milk': MLE\", mle(0, 3), \" Laplace\", laplace(0, 3, V))\ntotal = sum(laplace(c, 3, V) for c in [2, 1] + [0] * (V - 2))\nprint(\"Laplace probabilities after 'like' sum to about\", round(total, 3))",
        "output": "seen 'like tea':  MLE 0.6667  Laplace 0.2727\nunseen 'like milk': MLE 0.0  Laplace 0.0909\nLaplace probabilities after 'like' sum to about 1.0",
        "codeNotes": [
          {
            "line": 5,
            "note": "Add 1 on top, add V at the bottom."
          },
          {
            "line": 10,
            "note": "Two seen next words and V - 2 unseen ones."
          }
        ],
        "tryIt": "Make V = 10,000 (a realistic vocabulary). What happens to the probability of the seen pair? Why is that a weakness?",
        "check": {
          "question": "In Laplace smoothing, why add V to the denominator?",
          "options": [
            "To make numbers bigger",
            "So the probabilities still add up to 1 after adding 1 to every possible next word",
            "It is optional"
          ],
          "answer": 1,
          "why": "One extra count for each of V words adds V to the total."
        }
      },
      {
        "title": "Evaluating with perplexity",
        "say": [
          "How do you know if one language model is better than another? Test it on text it has never seen and see how surprised it is.",
          "Perplexity measures that surprise: exp of the negative average log probability per word. Lower perplexity means the model predicted the text better.",
          "A handy reading: perplexity is like the number of equally likely choices the model feels it has at each word. A perplexity of 4 means it is as uncertain as choosing among 4 words at random.",
          "If the model gives any test word probability 0, perplexity is infinite, which is another reason smoothing is essential.",
          "Practice 2 is perplexity(probs): the probabilities the model gave to each word of a test sentence in, perplexity out.",
          "Perplexity only compares models fairly when they use the same vocabulary and the same test text.",
          "The example compares a confident, a uniform and a poor model on the same four words."
        ],
        "example": "A quiz contestant's confidence: one who always narrows it down to two options is far better prepared than one guessing among fifty.",
        "code": "import math\n\ndef perplexity(probs):\n    if any(p == 0 for p in probs):\n        return float(\"inf\")\n    return round(math.exp(-sum(math.log(p) for p in probs) / len(probs)), 4)\n\nprint(\"confident model:\", perplexity([0.9, 0.8, 0.7, 0.9]))\nprint(\"uniform over 4 words:\", perplexity([0.25] * 4))\nprint(\"poor model:\", perplexity([0.05, 0.1, 0.02, 0.2]))\nprint(\"model with a zero:\", perplexity([0.5, 0.0]))",
        "output": "confident model: 1.2185\nuniform over 4 words: 4.0\npoor model: 14.9535\nmodel with a zero: inf",
        "codeNotes": [
          {
            "line": 6,
            "note": "Average the log probabilities, negate, then exponentiate."
          }
        ],
        "tryIt": "What is the perplexity of a model that gives every word probability 0.1?",
        "check": {
          "question": "Model A has perplexity 50 on a test set, model B has 120. Which is better?",
          "options": [
            "A",
            "B",
            "They are equal"
          ],
          "answer": 0,
          "why": "Lower perplexity means the model is less surprised by real text."
        }
      },
      {
        "title": "Practice time: smooth and evaluate",
        "say": [
          "Practice 1: laplace_bigram_prob(bigram_count, context_count, vocab_size). One line: (bigram_count + 1) / (context_count + vocab_size), rounded to 4 decimals.",
          "Check the unseen case: a count of 0 with a context of 10 and a vocabulary of 5 gives 1/15, about 0.0667. And a brand-new context word (count 0) gives a uniform 1 / V.",
          "Practice 2: perplexity(probs). Return infinity if any probability is zero, otherwise exp(-(sum of logs) / N), rounded to 4 decimals.",
          "Use math.log (natural logarithm) and math.exp; they undo each other, so the base does not matter as long as you are consistent.",
          "Together these two functions form the core loop of classic language modelling: estimate probabilities from counts, then measure how well they predict new text.",
          "After passing, build a Laplace bigram model from a paragraph of your own and compute the perplexity of a sentence you write.",
          "The example chains everything: counts, Laplace probabilities, and perplexity on a new sentence."
        ],
        "example": "Training for a spelling bee by studying word lists, then testing yourself on words you have never practised.",
        "code": "import math\nfrom collections import Counter\n\ntrain = \"<s> i like tea </s> <s> i like coffee </s> <s> you like tea </s>\".split()\npairs, singles, V = Counter(zip(train, train[1:])), Counter(train[:-1]), len(set(train))\nprob = lambda a, b: (pairs[(a, b)] + 1) / (singles[a] + V)\ntest = \"<s> you like coffee </s>\".split()\nps = [prob(a, b) for a, b in zip(test, test[1:])]\nprint(\"bigram probabilities:\", [round(p, 3) for p in ps])\nprint(\"perplexity:\", round(math.exp(-sum(math.log(p) for p in ps) / len(ps)), 2))",
        "output": "bigram probabilities: [0.2, 0.25, 0.2, 0.25]\nperplexity: 4.47",
        "codeNotes": [
          {
            "line": 6,
            "note": "Laplace probability from the counts."
          },
          {
            "line": 10,
            "note": "Perplexity of an unseen sentence."
          }
        ],
        "tryIt": "Try the test sentence \"<s> you like milk </s>\". Is the perplexity finite now? Would it be with MLE?",
        "check": {
          "question": "laplace_bigram_prob(0, 0, 4) returns?",
          "options": [
            "0.0",
            "0.25",
            "1.0"
          ],
          "answer": 1,
          "why": "(0 + 1) / (0 + 4) = 0.25: a brand-new context spreads probability evenly."
        }
      }
    ],
    "summary": [
      "A language model assigns probabilities to word sequences; n-gram models count word sequences.",
      "MLE bigram probability = count(prev, word) / count(prev).",
      "Unseen pairs get probability 0 under MLE, which breaks whole sentences.",
      "Laplace smoothing adds 1 to every bigram count and V to the denominator.",
      "Perplexity (lower is better) measures how surprised a model is by new text."
    ],
    "projectStep": {
      "title": "Your own next-word predictor",
      "steps": [
        "Build bigram counts from a page of text you like.",
        "Write a function that suggests the three most likely next words after any word, using Laplace smoothing.",
        "Compute the perplexity of two new sentences and explain which one the model found more natural."
      ]
    }
  },
  {
    "day": 4,
    "title": "Vector Space Models: Bag-of-Words & TF-IDF Weighting",
    "goal": "You can represent documents as vectors with bag-of-words, explain term frequency and inverse document frequency, compute TF-IDF weights, and see why TF-IDF makes informative words stand out.",
    "minutes": 30,
    "recap": "Yesterday you modelled word order with bigrams. For search and classification it often helps to ignore order and ask a simpler question: which words does each document contain, and how important are they?",
    "parts": [
      {
        "title": "Documents as vectors",
        "say": [
          "To compare documents with maths, we turn each into a vector: a list of numbers, one per word in the vocabulary.",
          "The vocabulary is the set of all distinct words across the collection of documents, the corpus. Sorting it gives each word a fixed position.",
          "A document's vector records something about each vocabulary word in that document. The simplest choice is its count.",
          "Most entries are zero, because any one document uses only a tiny part of the vocabulary. Such vectors are called sparse, and real systems store only the non-zero entries.",
          "Once documents are vectors, we can measure distances and angles between them (Day 6), feed them to classifiers (Day 12), and index them for search.",
          "The example builds a vocabulary from three short documents and prints each word's position.",
          "This vector space model, from the 1960s and 70s, is still the backbone of many search engines."
        ],
        "example": "A shopping list printed on a standard form with a box for every product the shop sells: each list is just a pattern of filled boxes.",
        "code": "docs = [[\"the\", \"cat\", \"sat\"], [\"the\", \"dog\", \"sat\"], [\"the\", \"cat\", \"ate\", \"the\", \"fish\"]]\nvocab = sorted({w for d in docs for w in d})\nposition = {w: i for i, w in enumerate(vocab)}\nprint(\"vocabulary:\", vocab)\nprint(\"positions:\", position)",
        "output": "vocabulary: ['ate', 'cat', 'dog', 'fish', 'sat', 'the']\npositions: {'ate': 0, 'cat': 1, 'dog': 2, 'fish': 3, 'sat': 4, 'the': 5}",
        "codeNotes": [
          {
            "line": 2,
            "note": "A set comprehension collects every distinct word; sorted fixes the order."
          }
        ],
        "tryIt": "Add a fourth document [\"a\", \"dog\", \"barked\"]. How big is the vocabulary now?",
        "check": {
          "question": "Why are document vectors usually sparse?",
          "options": [
            "Because of rounding",
            "Each document uses only a small part of the whole vocabulary",
            "Because vectors must be short"
          ],
          "answer": 1,
          "why": "Most vocabulary words do not appear in a given document, so most entries are zero."
        }
      },
      {
        "title": "Bag of words",
        "say": [
          "The bag-of-words model represents a document by word counts and throws away word order. \"Dog bites man\" and \"man bites dog\" get the same vector.",
          "That sounds bad, and for some tasks it is. But for topic, spam and search tasks, which words appear matters far more than their order, and bag of words works well.",
          "Practice 2 is bag_of_words(docs): the sorted vocabulary and one count vector per document, in vocabulary order.",
          "list.count(word) counts occurrences in a list, which is fine for short documents; collections.Counter is faster for long ones.",
          "Variations include binary vectors (1 if present, 0 if not) and n-gram bags, which add bigrams like \"not good\" to keep a little order.",
          "Libraries such as scikit-learn provide CountVectorizer, which does all of this with many options.",
          "The example builds the count vectors and shows the order problem."
        ],
        "example": "Describing a salad by listing its ingredients and quantities, without saying in what order they were added.",
        "code": "def bag_of_words(docs):\n    vocab = sorted({t for d in docs for t in d})\n    return vocab, [[d.count(w) for w in vocab] for d in docs]\n\nvocab, vecs = bag_of_words([[\"dog\", \"bites\", \"man\"], [\"man\", \"bites\", \"dog\"], [\"man\", \"feeds\", \"dog\", \"dog\"]])\nprint(vocab)\nfor v in vecs:\n    print(v)",
        "output": "['bites', 'dog', 'feeds', 'man']\n[1, 1, 0, 1]\n[1, 1, 0, 1]\n[0, 2, 1, 1]",
        "codeNotes": [
          {
            "line": 3,
            "note": "One count per vocabulary word, for each document."
          }
        ],
        "tryIt": "Add bigrams to each document (e.g. \"dog_bites\") before building the bag. Can you now tell the first two documents apart?",
        "check": {
          "question": "What information does bag of words throw away?",
          "options": [
            "Which words appear",
            "How often words appear",
            "The order of the words"
          ],
          "answer": 2,
          "why": "Only counts are kept; order is lost."
        }
      },
      {
        "title": "Term frequency",
        "say": [
          "Raw counts favour long documents: a 5,000-word report mentions \"cloud\" more often than a 50-word note, even if the note is entirely about clouds.",
          "Term frequency (TF) fixes that by dividing by document length: TF = count of the term in the document / total words in the document.",
          "Now a word that makes up 10 percent of a short note scores higher than one that makes up 0.1 percent of a long report.",
          "Other TF variants exist, such as 1 + log(count), which grows slowly so the 50th mention of a word counts less than the 2nd.",
          "TF alone still has a problem: common words like \"the\" and \"is\" have high TF everywhere, even after stopword removal some domain words (\"patient\" in medical notes) are everywhere too.",
          "We need a second factor that rewards words that are rare across the collection. That is IDF, next.",
          "The example compares raw counts and TF for a short and a long document."
        ],
        "example": "Judging how much someone likes tea by the share of their drinks that are tea, not the total cups over a lifetime.",
        "code": "short = [\"cloud\", \"cost\", \"cloud\", \"savings\"]\nlong = [\"report\"] * 400 + [\"cloud\"] * 5 + [\"meeting\"] * 95\nfor name, doc in [(\"short note\", short), (\"long report\", long)]:\n    count = doc.count(\"cloud\")\n    print(f\"{name:11} count {count}  TF {count / len(doc):.3f}\")",
        "output": "short note  count 2  TF 0.500\nlong report count 5  TF 0.010",
        "codeNotes": [
          {
            "line": 5,
            "note": "TF divides by the document length."
          }
        ],
        "tryIt": "Which document is more \"about\" clouds by raw count, and which by TF?",
        "check": {
          "question": "Why divide the count by the document length?",
          "options": [
            "To make numbers integers",
            "So long documents do not win just by being long",
            "IDF requires it"
          ],
          "answer": 1,
          "why": "TF measures importance within a document regardless of its size."
        }
      },
      {
        "title": "Inverse document frequency",
        "say": [
          "Inverse document frequency (IDF) measures how rare a word is across the whole corpus.",
          "IDF = log(N / df), where N is the number of documents and df (document frequency) is the number of documents containing the word.",
          "A word in every document has df = N, so IDF = log(1) = 0: it tells you nothing about which document you want.",
          "A word in only one document out of a million has a high IDF: finding it is very informative.",
          "The logarithm softens the effect, so a word in 10 documents is not treated as 100 times more important than a word in 1,000. We use log base 10 in this course; any base works if used consistently.",
          "If a word appears in no document, df is 0 and the formula would divide by zero; code must handle it, usually by returning 0 or smoothing with df + 1.",
          "The example computes IDF for common and rare words in a small corpus."
        ],
        "example": "A clue in a detective story: \"the suspect wore shoes\" helps nobody, \"the suspect wore a green feathered hat\" narrows it down to one person.",
        "code": "import math\n\ndocs = [[\"cloud\", \"cost\"], [\"cloud\", \"python\"], [\"cloud\", \"lambda\", \"python\"], [\"cloud\", \"kafka\"]]\nN = len(docs)\nfor word in [\"cloud\", \"python\", \"kafka\", \"rust\"]:\n    df = sum(word in d for d in docs)\n    idf = math.log10(N / df) if df else 0.0\n    print(f\"{word:7} df {df}  IDF {idf:.3f}\")",
        "output": "cloud   df 4  IDF 0.000\npython  df 2  IDF 0.301\nkafka   df 1  IDF 0.602\nrust    df 0  IDF 0.000",
        "codeNotes": [
          {
            "line": 6,
            "note": "True counts as 1, so this counts documents containing the word."
          },
          {
            "line": 7,
            "note": "Guard against df = 0."
          }
        ],
        "tryIt": "Add a fifth document without \"cloud\". What happens to the IDF of \"cloud\"?",
        "check": {
          "question": "A word appears in every document. What is its IDF?",
          "options": [
            "1",
            "0",
            "Very large"
          ],
          "answer": 1,
          "why": "log(N / N) = log(1) = 0: it cannot tell documents apart."
        }
      },
      {
        "title": "TF-IDF",
        "say": [
          "TF-IDF multiplies the two: TF (how important in this document) times IDF (how rare across documents).",
          "The weight is high when a word is frequent in this document AND rare elsewhere, exactly the words that describe what makes the document special.",
          "Practice 1 is tf_idf(term_count, doc_length, n_docs, doc_freq): TF times log10 IDF, rounded to 4 decimals, and 0.0 when doc_freq or doc_length is 0.",
          "Replacing raw counts with TF-IDF weights in document vectors usually improves search and classification noticeably.",
          "TF-IDF has limits. It treats \"car\" and \"automobile\" as unrelated words, because it only matches exact tokens. Word embeddings (Days 7-9) address that.",
          "Still, TF-IDF is fast, needs no training and is easy to explain, so it remains a strong baseline and part of many production search systems (often as BM25, a refined variant).",
          "The example prints the top TF-IDF words for each document in a tiny corpus."
        ],
        "example": "Describing a city by what is special about it: every city has roads, but only one has the Taj Mahal.",
        "code": "import math\n\ndocs = {\"d1\": [\"cloud\", \"cost\", \"cloud\", \"savings\"], \"d2\": [\"python\", \"cloud\", \"lambda\"],\n        \"d3\": [\"python\", \"tests\", \"python\", \"tests\"]}\nN = len(docs)\n\ndef tf_idf(term, doc):\n    df = sum(term in d for d in docs.values())\n    return doc.count(term) / len(doc) * math.log10(N / df) if df else 0.0\n\nfor name, doc in docs.items():\n    weights = {t: round(tf_idf(t, doc), 3) for t in set(doc)}\n    print(name, sorted(weights.items(), key=lambda kv: (-kv[1], kv[0])))",
        "output": "d1 [('cost', 0.119), ('savings', 0.119), ('cloud', 0.088)]\nd2 [('lambda', 0.159), ('cloud', 0.059), ('python', 0.059)]\nd3 [('tests', 0.239), ('python', 0.088)]",
        "codeNotes": [
          {
            "line": 9,
            "note": "TF times IDF (base-10 log)."
          },
          {
            "line": 13,
            "note": "Highest weights first: the most characteristic words."
          }
        ],
        "tryIt": "Why does \"cloud\" score lower than \"savings\" in d1 even though it appears twice?",
        "check": {
          "question": "When is a word's TF-IDF weight high?",
          "options": [
            "When it is common everywhere",
            "When it is frequent in this document and rare in others",
            "When it is long"
          ],
          "answer": 1,
          "why": "TF rewards frequency here; IDF rewards rarity elsewhere."
        }
      },
      {
        "title": "Practice time: weights and vectors",
        "say": [
          "Practice 1: tf_idf(term_count, doc_length, n_docs, doc_freq). Guard first: return 0.0 if doc_freq or doc_length is 0. Otherwise compute and round.",
          "Test yourself: 3 occurrences in 100 words, in 10 of 1,000 documents, gives 0.03 times log10(100) = 0.06.",
          "A word in every document must give 0.0 no matter how often it appears.",
          "Practice 2: bag_of_words(docs). Sorted vocabulary from a set comprehension, then one count list per document. An empty corpus returns ([], []).",
          "Keep the vocabulary sorted: the checks expect [\"cat\", \"end\", \"sat\", \"the\"] in that order, and a fixed order is what makes vectors comparable.",
          "Tomorrow's milestone combines these into a working search engine, so make sure both are solid.",
          "The example shows why the guard is needed, by triggering the division by zero it prevents."
        ],
        "example": "Checking the ladder is on firm ground before climbing: one line of caution prevents a nasty fall.",
        "code": "import math\n\ntry:\n    print(math.log10(1000 / 0))\nexcept ZeroDivisionError as err:\n    print(\"without the guard:\", err)\n\ndef safe_tf_idf(tc, dl, n, df):\n    return 0.0 if df == 0 or dl == 0 else round(tc / dl * math.log10(n / df), 4)\nprint(\"with the guard:\", safe_tf_idf(1, 10, 1000, 0))",
        "output": "without the guard: division by zero\nwith the guard: 0.0",
        "codeNotes": [
          {
            "line": 4,
            "note": "A word in no document would divide by zero."
          },
          {
            "line": 9,
            "note": "The guard returns 0.0 instead."
          }
        ],
        "tryIt": "Another fix is smoothing: log10(N / (df + 1)). What IDF does an unseen word get then?",
        "check": {
          "question": "tf_idf(5, 50, 1000, 1000) returns?",
          "options": [
            "0.1",
            "0.0",
            "1.0"
          ],
          "answer": 1,
          "why": "The word is in all 1,000 documents, so IDF is log10(1) = 0."
        }
      }
    ],
    "summary": [
      "The vector space model turns documents into vectors over a sorted vocabulary.",
      "Bag of words counts words and ignores order.",
      "TF = count / document length, so long documents do not win by size.",
      "IDF = log(N / df) rewards words that are rare across the corpus; a word in every document gets 0.",
      "TF-IDF highlights words that are frequent here and rare elsewhere; guard against df = 0."
    ],
    "projectStep": {
      "title": "TF-IDF keywords for your documents",
      "steps": [
        "Collect five short documents on different topics.",
        "Build bag-of-words vectors, then TF-IDF weights for every word.",
        "Print the top three keywords per document and check they describe it well."
      ]
    }
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Text Normalization, TF-IDF & Vector Space Search Engine",
    "goal": "You can build a small search engine end to end: clean and tokenise documents, build an inverted index, score documents for a query with TF-IDF, and rank the results.",
    "minutes": 30,
    "recap": "Milestone 1 combines text cleaning (Day 1), word reduction (Day 2), counting (Day 3) and TF-IDF (Day 4) into something genuinely useful: a working search engine.",
    "parts": [
      {
        "title": "How a search engine works",
        "say": [
          "Every search engine, from a website search box to Google, has two phases: indexing and querying.",
          "Indexing happens ahead of time. Each document is cleaned and tokenised, and the engine records which words appear in which documents, plus statistics such as counts and document frequencies.",
          "Querying happens when a user types. The query is cleaned the same way, candidate documents are found through the index, each is scored, and the best are returned in order.",
          "Using the SAME cleaning for documents and queries is essential. If documents are stemmed but queries are not, \"running\" in a query will never match the stem \"run\" in the index.",
          "Scoring is where TF-IDF comes in: documents that contain the query's rare words often score highest.",
          "The example lays out both phases as a list of steps, the plan for today.",
          "By the end of the lesson you will have implemented both phases in plain Python."
        ],
        "example": "A library: librarians catalogue every book in advance (indexing), so when you ask for a topic they can find the right shelf in seconds (querying).",
        "code": "indexing = [\"clean and tokenise each document\", \"record which words are in which documents\",\n            \"store counts and document frequencies\"]\nquerying = [\"clean the query the same way\", \"find candidate documents via the index\",\n            \"score candidates with TF-IDF\", \"return the best first\"]\nfor phase, steps in [(\"INDEXING (ahead of time)\", indexing), (\"QUERYING (per search)\", querying)]:\n    print(phase)\n    for i, step in enumerate(steps, 1):\n        print(f\"  {i}. {step}\")",
        "output": "INDEXING (ahead of time)\n  1. clean and tokenise each document\n  2. record which words are in which documents\n  3. store counts and document frequencies\nQUERYING (per search)\n  1. clean the query the same way\n  2. find candidate documents via the index\n  3. score candidates with TF-IDF\n  4. return the best first",
        "codeNotes": [
          {
            "line": 7,
            "note": "enumerate(..., 1) numbers the steps from 1."
          }
        ],
        "tryIt": "Add a step to indexing that removes stopwords. Where must the matching step go in querying?",
        "check": {
          "question": "Why must documents and queries be cleaned the same way?",
          "options": [
            "To save memory",
            "Otherwise query words will not match the indexed forms",
            "Queries are always longer"
          ],
          "answer": 1,
          "why": "Matching only works if both sides produce the same tokens."
        }
      },
      {
        "title": "The inverted index",
        "say": [
          "Checking every document for every query is too slow for large collections. An inverted index makes lookup fast.",
          "It maps each word to the list of documents containing it, called a postings list. It is \"inverted\" because a document lists words, while the index lists documents per word.",
          "To answer a query, look up each query word's postings list and combine them. Only those documents need scoring.",
          "Practice 2 is inverted_index(docs): a dictionary from token to the sorted list of ids of documents containing it, each id once.",
          "Using a set while building avoids duplicates when a word appears several times in one document; sorting at the end gives stable, predictable lists.",
          "Real indexes also store positions (for phrase search) and counts (for scoring), and are compressed to fit huge collections in memory.",
          "The example builds an index and answers an \"all of these words\" query by intersecting postings lists."
        ],
        "example": "The index at the back of a textbook: look up \"photosynthesis\" and get page numbers directly, instead of reading the whole book.",
        "code": "def inverted_index(docs):\n    index = {}\n    for doc_id, toks in docs.items():\n        for tok in toks:\n            index.setdefault(tok, set()).add(doc_id)\n    return {tok: sorted(ids) for tok, ids in index.items()}\n\ndocs = {\"d1\": [\"cloud\", \"cost\", \"cloud\"], \"d2\": [\"python\", \"cloud\"], \"d3\": [\"python\", \"tests\"]}\nidx = inverted_index(docs)\nprint(idx)\nboth = set(idx[\"python\"]) & set(idx[\"cloud\"])\nprint(\"documents with python AND cloud:\", sorted(both))",
        "output": "{'cloud': ['d1', 'd2'], 'cost': ['d1'], 'python': ['d2', 'd3'], 'tests': ['d3']}\ndocuments with python AND cloud: ['d2']",
        "codeNotes": [
          {
            "line": 5,
            "note": "setdefault creates the set the first time a token appears."
          },
          {
            "line": 11,
            "note": "Intersecting postings answers an AND query."
          }
        ],
        "tryIt": "Answer an OR query: documents containing \"cost\" OR \"tests\".",
        "check": {
          "question": "What does an inverted index map?",
          "options": [
            "Documents to their length",
            "Each word to the documents containing it",
            "Queries to answers"
          ],
          "answer": 1,
          "why": "Word to postings list is what makes lookups fast."
        }
      },
      {
        "title": "Scoring documents for a query",
        "say": [
          "For each candidate document, add up the TF-IDF weights of the query words it contains. A document with several rare query words scores highest.",
          "Practice 1 is search(query, docs): compute each document's score, keep scores above 0, and sort by score (highest first) then by id for ties.",
          "The tie rule matters for predictable results. Two documents with the same score should always appear in the same order, or users (and tests) will see results jump around.",
          "Sorting with key=lambda d: (-score[d], d) does both at once: the minus sign puts high scores first, and the id breaks ties alphabetically.",
          "Documents that contain no query word score 0 and are left out.",
          "Real engines use BM25, which adjusts TF so repeated words have diminishing returns and normalises for document length more carefully, but the shape of the calculation is the same.",
          "The example scores and ranks documents for two queries."
        ],
        "example": "Judging a talent show where each act earns points for each skill the judges asked for, with rare skills worth more.",
        "code": "import math\n\ndocs = {\"d1\": [\"cloud\", \"cost\", \"cloud\", \"savings\"], \"d2\": [\"python\", \"cloud\", \"lambda\"],\n        \"d3\": [\"python\", \"tests\", \"python\", \"tests\"], \"d4\": [\"cooking\", \"rice\"]}\nN = len(docs)\n\ndef search(query, docs):\n    scores = {}\n    for doc_id, toks in docs.items():\n        s = 0.0\n        for term in query:\n            df = sum(term in d for d in docs.values())\n            if df:\n                s += toks.count(term) / len(toks) * math.log10(N / df)\n        scores[doc_id] = s\n    return sorted((d for d in scores if scores[d] > 0), key=lambda d: (-scores[d], d))\n\nprint(search([\"python\"], docs))\nprint(search([\"cloud\", \"savings\"], docs))",
        "output": "['d3', 'd2']\n['d1', 'd2']",
        "codeNotes": [
          {
            "line": 14,
            "note": "Add each query term's TF-IDF in this document."
          },
          {
            "line": 16,
            "note": "Drop zero scores; sort by score, then id."
          }
        ],
        "tryIt": "Search for [\"python\", \"lambda\"]. Which document wins and why?",
        "check": {
          "question": "Why sort by (-score, id)?",
          "options": [
            "To sort ids backwards",
            "High scores first, with ties always in the same order",
            "Because Python requires tuples"
          ],
          "answer": 1,
          "why": "The negative score sorts descending; the id breaks ties deterministically."
        }
      },
      {
        "title": "Putting the pipeline together",
        "say": [
          "A real search engine runs raw text through the Day 1 and Day 2 steps before indexing, and runs every query through exactly the same function.",
          "Wrapping the cleaning in one function, called by both indexing and querying, guarantees they stay in sync. If you later add stemming, both sides get it at once.",
          "Here the pipeline is: lowercase, turn punctuation into spaces, split, remove stopwords, then a light stem.",
          "With a good stemmer in the pipeline, a query like \"Running costs?\" would find a document that says \"cost of runs\", because both sides reduce to \"run\" and \"cost\". The simple clean() below only strips a final s, so \"costs\" becomes \"cost\" but \"running\" stays as it is; the try-it task fixes that.",
          "This is the heart of the milestone: every earlier lesson contributes one piece.",
          "The example builds a complete mini engine over four raw sentences.",
          "Try your own queries after running it; you will quickly see both its strengths and its limits."
        ],
        "example": "A production line where every part passes through the same quality check, so parts made on different days still fit together.",
        "code": "import math, re\n\nSTOP = {\"the\", \"a\", \"of\", \"is\", \"in\", \"and\", \"to\", \"for\"}\ndef clean(text):\n    toks = re.sub(r\"[^\\w\\s]\", \" \", text.lower()).split()\n    toks = [t for t in toks if t not in STOP]\n    return [t[:-1] if t.endswith(\"s\") and len(t) > 3 else t for t in toks]\n\nraw = {\"d1\": \"The cost of runs in the cloud.\", \"d2\": \"Python tests for the API.\",\n       \"d3\": \"Cooking rice is easy.\", \"d4\": \"Cloud savings and cost reports.\"}\ndocs = {k: clean(v) for k, v in raw.items()}\nN = len(docs)\ndef score(q, toks):\n    return sum(toks.count(t) / len(toks) * math.log10(N / df)\n               for t in q if (df := sum(t in d for d in docs.values())))\nq = clean(\"Running costs?\")\nprint(\"query tokens:\", q)\nprint(sorted(((round(score(q, t), 3), d) for d, t in docs.items() if score(q, t) > 0), reverse=True))",
        "output": "query tokens: ['running', 'cost']\n[(0.1, 'd1'), (0.075, 'd4')]",
        "codeNotes": [
          {
            "line": 4,
            "note": "One cleaning function for documents and queries."
          },
          {
            "line": 15,
            "note": "The := operator stores df while filtering out words with df 0."
          }
        ],
        "tryIt": "The query \"running\" became \"running\", not \"run\". Improve clean() with the simple_stem rules from Day 2 and try again.",
        "check": {
          "question": "What guarantees documents and queries are processed identically?",
          "options": [
            "Writing the steps twice carefully",
            "Calling one shared cleaning function for both",
            "Using uppercase"
          ],
          "answer": 1,
          "why": "A single shared function cannot drift out of sync."
        }
      },
      {
        "title": "Evaluating search quality",
        "say": [
          "How good is your engine? You need a set of test queries and, for each, the documents a person judged relevant.",
          "Precision at k asks: of the top k results, how many are relevant? Recall asks: of all relevant documents, how many did we return?",
          "For search, the top of the list matters most, so precision at small k (such as P@3) is a common measure.",
          "Improve the engine one change at a time, re-run the test queries, and keep changes that help. That is how real search teams work.",
          "Typical improvements: better stemming or lemmatisation, handling synonyms, boosting title words, and using BM25 instead of plain TF-IDF.",
          "The example computes precision and recall for one query.",
          "Keep the test queries and judgements in a file next to the code, so every future change is measured the same way, by anyone on the team.",
          "Without measurement, \"improvements\" are just opinions."
        ],
        "example": "A fishing net: precision is how much of your catch is the fish you wanted; recall is how many of those fish in the lake you actually caught.",
        "code": "results = [\"d4\", \"d1\", \"d7\", \"d2\", \"d9\"]     # the engine's ranking\nrelevant = {\"d1\", \"d2\", \"d3\"}              # judged by a person\nfor k in [1, 3, 5]:\n    top = results[:k]\n    hits = sum(d in relevant for d in top)\n    print(f\"P@{k} = {hits / k:.2f}   recall@{k} = {hits / len(relevant):.2f}\")",
        "output": "P@1 = 0.00   recall@1 = 0.00\nP@3 = 0.33   recall@3 = 0.33\nP@5 = 0.40   recall@5 = 0.67",
        "codeNotes": [
          {
            "line": 5,
            "note": "How many of the top k are relevant."
          },
          {
            "line": 6,
            "note": "Precision divides by k; recall by the number of relevant documents."
          }
        ],
        "tryIt": "Move d1 to the first position. How do P@1 and P@3 change?",
        "check": {
          "question": "Precision at 3 is 2/3. What does that mean?",
          "options": [
            "Two of the top three results are relevant",
            "Two-thirds of all relevant documents were found",
            "The engine is 67 percent fast"
          ],
          "answer": 0,
          "why": "Precision at k counts relevant results among the top k."
        }
      },
      {
        "title": "Milestone practice: build the engine",
        "say": [
          "Practice 1: search(query, docs). For each document, loop over query terms, compute df over all documents, and add TF times log10(N / df) when df is not 0.",
          "Then return document ids with a score above 0, sorted by (-score, id). The checks expect exact orders, including a tie-free case and a query that matches nothing.",
          "Practice 2: inverted_index(docs). Build sets with setdefault, then convert to sorted lists.",
          "An empty docs dict should give an empty index, and a document with no tokens simply contributes nothing.",
          "Congratulations on Milestone 1. You now have the classic information retrieval stack: cleaning, indexing, TF-IDF scoring and evaluation.",
          "Next week you move from counting exact words to understanding meaning with vectors and embeddings.",
          "The example runs a final check of both pieces together: index lookup to find candidates, TF-IDF to rank them."
        ],
        "example": "A new shop opening: the shelves are stocked (index), the tills work (scoring), and the first customers find what they came for.",
        "code": "import math\n\ndocs = {\"d1\": [\"cloud\", \"cost\"], \"d2\": [\"python\", \"cloud\", \"lambda\"], \"d3\": [\"python\", \"tests\", \"python\"]}\nindex = {}\nfor d, toks in docs.items():\n    for t in toks:\n        index.setdefault(t, set()).add(d)\nquery = [\"python\", \"lambda\"]\ncandidates = sorted(set().union(*(index.get(t, set()) for t in query)))\nN = len(docs)\nscore = {d: sum(docs[d].count(t) / len(docs[d]) * math.log10(N / len(index[t])) for t in query if t in index) for d in candidates}\nprint(\"candidates from the index:\", candidates)\nprint(\"ranked:\", sorted(candidates, key=lambda d: (-score[d], d)))",
        "output": "candidates from the index: ['d2', 'd3']\nranked: ['d2', 'd3']",
        "codeNotes": [
          {
            "line": 9,
            "note": "Only documents containing some query word are scored."
          },
          {
            "line": 11,
            "note": "df is simply the length of the postings list."
          }
        ],
        "tryIt": "Why is using len(index[t]) for df faster than scanning every document?",
        "check": {
          "question": "What does the index give the search step?",
          "options": [
            "The final ranking",
            "A short list of candidate documents to score",
            "The query"
          ],
          "answer": 1,
          "why": "The index narrows the work to documents that contain query words."
        }
      }
    ],
    "summary": [
      "Search engines index ahead of time and score candidates at query time.",
      "Documents and queries must go through the same cleaning function.",
      "An inverted index maps each word to the documents containing it.",
      "Score with summed TF-IDF over query terms; sort by (-score, id) for stable results.",
      "Measure quality with precision and recall at k before and after each change."
    ],
    "projectStep": {
      "title": "Milestone 1: search your own documents",
      "steps": [
        "Collect 20 short documents and build the cleaning pipeline, index and TF-IDF scorer.",
        "Write five test queries with the documents you consider relevant.",
        "Measure P@3 and try one improvement (stemming, stopwords or synonyms), then measure again."
      ]
    }
  },
  {
    "day": 6,
    "title": "Vector Similarity & Semantic Document Search: Cosine Similarity",
    "goal": "You can measure similarity between document vectors with the dot product and cosine similarity, explain why cosine ignores document length, rank documents by similarity, and handle zero vectors safely.",
    "minutes": 30,
    "recap": "On Day 5 you scored documents by adding up TF-IDF weights of query words. Today you compare whole vectors, which works for queries, documents and, soon, word embeddings.",
    "parts": [
      {
        "title": "Similarity as geometry",
        "say": [
          "Once documents are vectors, similarity becomes geometry. Two documents about the same topic use similar words, so their vectors point in similar directions.",
          "Think of a vector with two entries as an arrow on a page: the first number is how far right, the second how far up. Longer vectors just have more entries, but the same ideas hold.",
          "Distance between arrow tips is one way to compare, but it is fooled by length: a long document and a short one on the same topic are far apart simply because the long one has bigger counts.",
          "The angle between arrows is a better measure of topic. It does not change if you make an arrow longer.",
          "Cosine similarity is the cosine of that angle: 1 when the arrows point the same way, 0 when they are at right angles (no shared words), and -1 when they point in opposite directions.",
          "With word counts, which are never negative, cosine stays between 0 and 1. With embeddings (Day 7), negative values appear.",
          "The example compares straight-line distance and cosine for a short and a long document on the same topic."
        ],
        "example": "Two people pointing towards the same mountain from different distances: their arms have the same direction even though one is much closer.",
        "code": "import math\n\nshort = [2, 1, 0]     # counts of: cloud, cost, recipe\nlong = [20, 10, 0]    # the same topic, ten times longer\nother = [0, 1, 5]     # a recipe\ndist = lambda a, b: math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))\ncos = lambda a, b: sum(x * y for x, y in zip(a, b)) / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))\nprint(\"distance short-long:\", round(dist(short, long), 2), \" short-other:\", round(dist(short, other), 2))\nprint(\"cosine   short-long:\", round(cos(short, long), 2), \" short-other:\", round(cos(short, other), 2))",
        "output": "distance short-long: 20.12  short-other: 5.39\ncosine   short-long: 1.0  short-other: 0.09",
        "codeNotes": [
          {
            "line": 8,
            "note": "By distance, the recipe looks closer to the short document than the long one does."
          },
          {
            "line": 9,
            "note": "By cosine, same topic scores 1.0."
          }
        ],
        "tryIt": "Make \"long\" 100 times bigger. Does the cosine change? Does the distance?",
        "check": {
          "question": "Why is cosine better than distance for comparing documents of different lengths?",
          "options": [
            "It is faster",
            "It depends only on direction, not on vector length",
            "It is always positive"
          ],
          "answer": 1,
          "why": "Scaling a vector does not change its angle, so length has no effect on cosine."
        }
      },
      {
        "title": "The dot product and vector length",
        "say": [
          "Cosine is built from two simpler pieces.",
          "The dot product multiplies matching entries and adds them up: [1, 2, 3] dot [4, 5, 6] = 1*4 + 2*5 + 3*6 = 32. It is large when both vectors have big values in the same places.",
          "The length (or norm) of a vector is the square root of the sum of its squares, by Pythagoras: the length of [3, 4] is 5.",
          "Cosine similarity = dot(a, b) / (length(a) * length(b)). Dividing by the lengths removes their effect and leaves only direction.",
          "In Python, zip pairs the entries, a generator expression multiplies them, and sum adds them up. math.sqrt gives the square root.",
          "If both vectors are already scaled to length 1 (normalised), cosine is just the dot product. Search systems often normalise vectors once at index time to save work at query time.",
          "The example computes all the pieces for two small vectors."
        ],
        "example": "Comparing two playlists by how many songs they share (dot product), adjusted for how long each playlist is (lengths).",
        "code": "import math\n\na, b = [1, 2, 3], [4, 5, 6]\ndot = sum(x * y for x, y in zip(a, b))\nlen_a = math.sqrt(sum(x * x for x in a))\nlen_b = math.sqrt(sum(y * y for y in b))\nprint(\"dot:\", dot)\nprint(\"lengths:\", round(len_a, 4), round(len_b, 4))\nprint(\"cosine:\", round(dot / (len_a * len_b), 4))\nunit_a = [x / len_a for x in a]\nprint(\"length after normalising:\", round(math.sqrt(sum(x * x for x in unit_a)), 4))",
        "output": "dot: 32\nlengths: 3.7417 8.775\ncosine: 0.9746\nlength after normalising: 1.0",
        "codeNotes": [
          {
            "line": 4,
            "note": "Multiply matching entries, then add."
          },
          {
            "line": 10,
            "note": "Divide by the length to get a unit vector."
          }
        ],
        "tryIt": "Compute the cosine of [1, 0] and [1, 1] by hand, then check with code.",
        "check": {
          "question": "What is the length of the vector [3, 4]?",
          "options": [
            "7",
            "5",
            "12"
          ],
          "answer": 1,
          "why": "sqrt(3*3 + 4*4) = sqrt(25) = 5."
        }
      },
      {
        "title": "Writing cosine similarity safely",
        "say": [
          "Practice 1 is cosine_similarity(a, b), rounded to 4 decimals.",
          "One edge case needs care: a vector of all zeros has length 0, and dividing by 0 crashes. That happens for real, for example when a query contains only stopwords or unknown words.",
          "The sensible answer is 0.0: an empty vector is not similar to anything. Check both lengths before dividing.",
          "Rounding makes results easy to compare in tests, because floating point maths can produce 0.9999999999 instead of 1.0.",
          "The checks include identical vectors, orthogonal vectors, scaled copies, opposite vectors and a zero vector.",
          "In production, libraries like NumPy compute these with fast vectorised operations, but the formula is exactly the one you write today.",
          "The example shows the zero-vector crash and the safe version side by side."
        ],
        "example": "A scale that shows \"0\" for an empty basket instead of an error message.",
        "code": "import math\n\ndef cosine_similarity(a, b):\n    na = math.sqrt(sum(x * x for x in a))\n    nb = math.sqrt(sum(x * x for x in b))\n    if na == 0 or nb == 0:\n        return 0.0\n    return round(sum(x * y for x, y in zip(a, b)) / (na * nb), 4)\n\nfor a, b in [([1, 0], [1, 0]), ([1, 0], [0, 1]), ([1, 2, 3], [2, 4, 6]), ([1, 1], [-1, -1]), ([0, 0], [1, 2])]:\n    print(a, b, \"->\", cosine_similarity(a, b))",
        "output": "[1, 0] [1, 0] -> 1.0\n[1, 0] [0, 1] -> 0.0\n[1, 2, 3] [2, 4, 6] -> 1.0\n[1, 1] [-1, -1] -> -1.0\n[0, 0] [1, 2] -> 0.0",
        "codeNotes": [
          {
            "line": 6,
            "note": "Guard: a zero vector is similar to nothing."
          },
          {
            "line": 8,
            "note": "Round at the end to avoid 0.9999999 surprises."
          }
        ],
        "tryIt": "What does cosine_similarity([1, 2, 0], [2, 1, 1]) return? Work it out by hand first.",
        "check": {
          "question": "A query is all stopwords, so its vector is all zeros. What should cosine return?",
          "options": [
            "An error",
            "0.0",
            "1.0"
          ],
          "answer": 1,
          "why": "A zero vector has no direction, so it is treated as similar to nothing."
        }
      },
      {
        "title": "Ranking by similarity",
        "say": [
          "With cosine you can rank a whole collection against a query vector: compute the similarity to each document and sort.",
          "Practice 2 is top_k_similar(query, vectors, k): the ids of the k most similar documents, highest first, ties broken by id.",
          "Ties are common with small integer vectors, for example two documents that are exact multiples of each other. A fixed tie rule keeps results stable.",
          "Rounding before comparing helps here too. Two similarities that should be equal may differ in the 16th decimal place, which would make the tie-break unpredictable.",
          "For millions of documents, comparing with every vector is too slow. Approximate nearest neighbour indexes such as FAISS, HNSW or ScaNN find the top k very fast with a tiny loss of accuracy (Day 26).",
          "This \"find the most similar vectors\" operation is the core of semantic search, recommendations and retrieval-augmented generation.",
          "The example ranks four documents for two different queries."
        ],
        "example": "A dating app that shows you the profiles closest to your own interests first.",
        "code": "import math\n\ndef cos(a, b):\n    na, nb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))\n    return 0.0 if na == 0 or nb == 0 else sum(x * y for x, y in zip(a, b)) / (na * nb)\n\nvecs = {\"cloud-costs\": [3, 2, 0], \"cloud-intro\": [2, 0, 0], \"baking\": [0, 0, 4], \"cost-cutting\": [0, 3, 1]}\nfor name, q in [(\"cloud\", [1, 0, 0]), (\"cost\", [0, 1, 0])]:\n    ranked = sorted(vecs, key=lambda d: (-round(cos(q, vecs[d]), 9), d))\n    print(name, \"->\", ranked[:2])",
        "output": "cloud -> ['cloud-intro', 'cloud-costs']\ncost -> ['cost-cutting', 'cloud-costs']",
        "codeNotes": [
          {
            "line": 9,
            "note": "Negative similarity sorts highest first; the id breaks ties."
          }
        ],
        "tryIt": "Add a query [1, 1, 0] (\"cloud cost\"). Which document comes first?",
        "check": {
          "question": "Why round similarities before sorting with a tie-break?",
          "options": [
            "To save memory",
            "Values that should be equal may differ slightly, making tie order unpredictable",
            "Sorting needs integers"
          ],
          "answer": 1,
          "why": "Rounding makes mathematically equal scores compare as equal."
        }
      },
      {
        "title": "TF-IDF vectors and semantic limits",
        "say": [
          "Cosine works with any vectors. Using TF-IDF weights instead of raw counts usually improves ranking, because common words no longer dominate the angle.",
          "Put together, TF-IDF vectors plus cosine similarity make a classic, strong document-similarity system: \"find documents like this one\".",
          "But these vectors have a blind spot. \"car\" and \"automobile\" are different vocabulary entries, so a document about cars and one about automobiles can have cosine 0.",
          "Every word is its own independent direction, at right angles to every other word. The vectors know nothing about meaning.",
          "Fixing that requires vectors where related words point in related directions. That is exactly what word embeddings do, starting tomorrow with Word2Vec.",
          "The example shows two sentences with the same meaning scoring 0 with bag-of-words vectors.",
          "This is one of the most important ideas in modern NLP: move from counting exact words to representing meaning."
        ],
        "example": "Two people describing the same film in completely different words: a word-matching system thinks they are talking about different films.",
        "code": "import math\n\na = \"the car is fast\".split()\nb = \"an automobile goes quickly\".split()\nvocab = sorted(set(a) | set(b))\nva = [a.count(w) for w in vocab]\nvb = [b.count(w) for w in vocab]\ndot = sum(x * y for x, y in zip(va, vb))\nprint(\"shared words:\", set(a) & set(b))\nprint(\"cosine:\", dot / (math.sqrt(sum(x * x for x in va)) * math.sqrt(sum(y * y for y in vb))))",
        "output": "shared words: set()\ncosine: 0.0",
        "codeNotes": [
          {
            "line": 8,
            "note": "No shared words means a dot product of 0."
          }
        ],
        "tryIt": "Change sentence b to \"the automobile is fast\". What is the cosine now, and which words are doing the matching?",
        "check": {
          "question": "Why do \"car\" and \"automobile\" get cosine 0 in bag-of-words vectors?",
          "options": [
            "They are misspelled",
            "Each word is a separate dimension with no notion of meaning",
            "Cosine cannot handle nouns"
          ],
          "answer": 1,
          "why": "Count vectors treat every word as unrelated to every other word."
        }
      },
      {
        "title": "Practice time: similarity and ranking",
        "say": [
          "Practice 1: cosine_similarity(a, b). Compute both lengths first, return 0.0 if either is 0, then the rounded dot product divided by the lengths.",
          "Remember -1.0 is possible for vectors that point in opposite directions; the checks include [1, 1] and [-1, -1].",
          "Practice 2: top_k_similar(query, vectors, k). Write a small cosine helper inside your solution (the checks call only top_k_similar), then sort the ids with the key (-similarity, id) and slice the first k.",
          "Sorting ids rather than (score, id) pairs keeps the code short: sorted(vectors, key=...) iterates over the dictionary keys.",
          "The checks include a tie between two documents pointing the same way, so the id order must decide.",
          "These two functions return in almost every lesson from now on, applied to embeddings, sentences and passages.",
          "The example shows how slicing handles a k larger than the number of documents."
        ],
        "example": "A podium: sort the runners by time, then hand out as many medals as there are places, even if fewer runners finished.",
        "code": "scores = {\"b\": 0.9, \"a\": 0.9, \"c\": 0.4}\nranked = sorted(scores, key=lambda d: (-scores[d], d))\nprint(\"top 2:\", ranked[:2])\nprint(\"top 10 (only 3 exist):\", ranked[:10])",
        "output": "top 2: ['a', 'b']\ntop 10 (only 3 exist): ['a', 'b', 'c']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Ties at 0.9 are ordered by id."
          },
          {
            "line": 4,
            "note": "Slicing past the end simply returns everything."
          }
        ],
        "tryIt": "What does ranked[:0] return? When might k be 0 in a real system?",
        "check": {
          "question": "What does sorted(vectors, key=...) iterate over when vectors is a dict?",
          "options": [
            "The values",
            "The keys",
            "Key-value pairs"
          ],
          "answer": 1,
          "why": "Iterating a dictionary gives its keys, here the document ids."
        }
      }
    ],
    "summary": [
      "Vectors pointing in similar directions represent similar documents.",
      "Cosine similarity = dot(a, b) / (|a| * |b|); it ignores vector length.",
      "Handle zero vectors by returning 0.0; round results for stable comparisons.",
      "Rank documents by cosine, breaking ties by id; large systems use approximate nearest neighbour indexes.",
      "Count and TF-IDF vectors cannot see that different words mean the same thing."
    ],
    "projectStep": {
      "title": "\"More like this\" for your documents",
      "steps": [
        "Turn your Milestone 1 documents into TF-IDF vectors.",
        "For each document, list the two most similar others with top_k_similar.",
        "Find one pair that should be similar but scores low, and explain why."
      ]
    }
  },
  {
    "day": 7,
    "title": "Distributed Representations: Word2Vec Skip-Gram & CBOW Architectures",
    "goal": "You can explain the distributional hypothesis, how Word2Vec learns dense word vectors with skip-gram and CBOW, generate training pairs from text, and do vector arithmetic for analogies with nearest-word search.",
    "minutes": 30,
    "recap": "Yesterday you saw that count vectors treat \"car\" and \"automobile\" as unrelated. Today you meet word embeddings, where words with similar meanings get similar vectors.",
    "parts": [
      {
        "title": "You shall know a word by the company it keeps",
        "say": [
          "In 1957 the linguist J. R. Firth wrote: \"You shall know a word by the company it keeps.\" This is the distributional hypothesis.",
          "Words that appear in similar contexts tend to have similar meanings. \"Coffee\" and \"tea\" both appear near \"cup\", \"drink\", \"hot\" and \"morning\".",
          "So if we learn a vector for each word that predicts its context well, words with similar contexts will end up with similar vectors.",
          "These vectors are dense: a few hundred numbers, all usually non-zero, instead of a vocabulary-sized vector of mostly zeros.",
          "Each dimension is not a hand-labelled feature like \"is a drink\"; meaning is spread across all the numbers. Directions in the space capture patterns such as gender, tense or country-capital.",
          "The example collects the context words of \"coffee\" and \"tea\" from a few sentences to show how much they share.",
          "This single idea, learning meaning from context, underlies Word2Vec, GloVe, and ultimately BERT and GPT."
        ],
        "example": "Guessing what an unfamiliar dish is from the menu section it appears in, the drinks it is served with, and what people say about it.",
        "code": "sentences = [\"i drink hot coffee every morning\", \"i drink hot tea every morning\",\n             \"a cup of coffee please\", \"a cup of tea please\", \"the car needs fuel\"]\ndef context(word, window=2):\n    ctx = set()\n    for s in sentences:\n        toks = s.split()\n        for i, t in enumerate(toks):\n            if t == word:\n                ctx |= set(toks[max(0, i - window):i] + toks[i + 1:i + 1 + window])\n    return ctx\nprint(\"coffee:\", sorted(context(\"coffee\")))\nprint(\"tea:   \", sorted(context(\"tea\")))\nprint(\"shared:\", sorted(context(\"coffee\") & context(\"tea\")))\nprint(\"car shares with coffee:\", sorted(context(\"car\") & context(\"coffee\")))",
        "output": "coffee: ['cup', 'drink', 'every', 'hot', 'morning', 'of', 'please']\ntea:    ['cup', 'drink', 'every', 'hot', 'morning', 'of', 'please']\nshared: ['cup', 'drink', 'every', 'hot', 'morning', 'of', 'please']\ncar shares with coffee: []",
        "codeNotes": [
          {
            "line": 9,
            "note": "Words up to 2 positions before and after."
          },
          {
            "line": 13,
            "note": "Coffee and tea keep very similar company."
          }
        ],
        "tryIt": "Add a sentence \"i drink cold coffee\" and see whether coffee and tea still share most of their context.",
        "check": {
          "question": "What is the distributional hypothesis?",
          "options": [
            "Words are distributed randomly",
            "Words that appear in similar contexts have similar meanings",
            "Longer words are more important"
          ],
          "answer": 1,
          "why": "Meaning can be learned from the contexts a word appears in."
        }
      },
      {
        "title": "Skip-gram and CBOW",
        "say": [
          "Word2Vec, published by Tomas Mikolov and colleagues at Google in 2013, learns embeddings with a small neural network and one of two training tasks.",
          "Skip-gram: given a centre word, predict each word in its context window. From \"hot coffee every\", the pair (coffee, hot) and (coffee, every) become training examples.",
          "CBOW (continuous bag of words): given the context words together, predict the centre word. It trains faster; skip-gram tends to do better for rare words.",
          "Training nudges the vectors so that words which predict each other get higher dot products. After millions of sentences, similar words end up near each other.",
          "Negative sampling makes training fast: instead of scoring every word in the vocabulary, the model learns to tell the real context word apart from a handful of random \"negative\" words.",
          "The example generates skip-gram training pairs from a sentence, which is the first step of training.",
          "You do not need to train Word2Vec yourself in this course; the point is to understand where the vectors come from."
        ],
        "example": "Learning a new language by reading lots of sentences and guessing each missing word from its neighbours, getting a little better with each guess.",
        "code": "def skipgram_pairs(tokens, window):\n    pairs = []\n    for i, centre in enumerate(tokens):\n        for j in range(max(0, i - window), min(len(tokens), i + window + 1)):\n            if j != i:\n                pairs.append((centre, tokens[j]))\n    return pairs\n\npairs = skipgram_pairs(\"i drink hot coffee\".split(), 1)\nprint(pairs)\nprint(\"training pairs:\", len(pairs))",
        "output": "[('i', 'drink'), ('drink', 'i'), ('drink', 'hot'), ('hot', 'drink'), ('hot', 'coffee'), ('coffee', 'hot')]\ntraining pairs: 6",
        "codeNotes": [
          {
            "line": 4,
            "note": "Every position within the window around the centre word."
          },
          {
            "line": 6,
            "note": "Each pair is one training example: centre predicts context."
          }
        ],
        "tryIt": "Change the window to 2. How many pairs now? Why do bigger windows capture more topical similarity?",
        "check": {
          "question": "In skip-gram, what does the model predict?",
          "options": [
            "The centre word from its context",
            "Context words from the centre word",
            "The next sentence"
          ],
          "answer": 1,
          "why": "Skip-gram predicts the surrounding words from the centre word; CBOW does the reverse."
        }
      },
      {
        "title": "Similarity in embedding space",
        "say": [
          "With trained embeddings, cosine similarity finally measures meaning. \"coffee\" and \"tea\" score high; \"coffee\" and \"car\" score low.",
          "Real embeddings have 100 to 300 dimensions. For learning, we use tiny three-number vectors so you can see every value.",
          "Similar words form neighbourhoods: drinks near drinks, countries near countries, verbs of motion near each other.",
          "Embeddings also carry the biases of their training text. Studies showed vectors linking some professions more strongly with one gender. Responsible systems measure and reduce such bias.",
          "Pre-trained embeddings trained on billions of words are freely available (such as Google's Word2Vec vectors, GloVe and FastText), so most projects start from them.",
          "The example ranks words by similarity to \"coffee\" in a toy embedding table.",
          "Notice how the meaning-based ranking fixes the car and automobile problem from yesterday."
        ],
        "example": "A map of a city where cafés cluster in one district and car garages in another: nearby places are similar places.",
        "code": "import math\n\nemb = {\"coffee\": [0.9, 0.8, 0.1], \"tea\": [0.85, 0.75, 0.15], \"juice\": [0.6, 0.9, 0.1],\n       \"car\": [0.1, 0.1, 0.95], \"automobile\": [0.12, 0.08, 0.9]}\ndef cos(a, b):\n    return sum(x * y for x, y in zip(a, b)) / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))\nfor word in [\"tea\", \"juice\", \"car\"]:\n    print(f\"coffee ~ {word:10} {cos(emb['coffee'], emb[word]):.3f}\")\nprint(f\"car ~ automobile  {cos(emb['car'], emb['automobile']):.3f}\")",
        "output": "coffee ~ tea        0.999\ncoffee ~ juice      0.968\ncoffee ~ car        0.228\ncar ~ automobile  0.999",
        "codeNotes": [
          {
            "line": 3,
            "note": "Toy three-number vectors; real ones have hundreds of dimensions."
          },
          {
            "line": 9,
            "note": "Different words, very similar vectors."
          }
        ],
        "tryIt": "Add \"petrol\" with a vector close to car. Which word is it most similar to?",
        "check": {
          "question": "Why do \"car\" and \"automobile\" score high with embeddings but 0 with bag of words?",
          "options": [
            "Embeddings ignore spelling, and similar contexts give similar vectors",
            "Embeddings are longer",
            "Bag of words is broken"
          ],
          "answer": 0,
          "why": "Embeddings place words by the contexts they appear in, not by their spelling."
        }
      },
      {
        "title": "Analogies with vector arithmetic",
        "say": [
          "The famous Word2Vec result: vector(\"king\") - vector(\"man\") + vector(\"woman\") lands close to vector(\"queen\").",
          "The difference king - man captures something like \"royalty without the male part\"; adding woman puts the female part back.",
          "The same trick finds country-capital pairs (Paris - France + Italy ≈ Rome) and verb tenses (walked - walk + swim ≈ swam), though far from perfectly.",
          "Practice 1 is vector_analogy(a, b, c): compute a - b + c element by element, rounded to 4 decimals.",
          "zip(a, b, c) walks the three vectors together, one position at a time.",
          "Analogies are a nice demonstration, but real embeddings solve them only some of the time, and results depend heavily on training data.",
          "The example computes king - man + woman with toy vectors."
        ],
        "example": "A recipe conversion: take the chocolate cake recipe, remove the chocolate, add lemon, and you land near a lemon cake.",
        "code": "def vector_analogy(a, b, c):\n    return [round(x - y + z, 4) for x, y, z in zip(a, b, c)]\n\nking, man, woman = [0.8, 0.9, 0.1], [0.7, 0.1, 0.1], [0.7, 0.1, 0.9]\nqueen = [0.8, 0.9, 0.9]\nresult = vector_analogy(king, man, woman)\nprint(\"king - man + woman =\", result)\nprint(\"queen              =\", queen)",
        "output": "king - man + woman = [0.8, 0.9, 0.9]\nqueen              = [0.8, 0.9, 0.9]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Element by element: a - b + c."
          }
        ],
        "tryIt": "Try man - king + queen. Which word should it be close to?",
        "check": {
          "question": "What does king - man + woman compute?",
          "options": [
            "A random vector",
            "A vector expected to be near \"queen\"",
            "The average of three words"
          ],
          "answer": 1,
          "why": "The difference king - man captures royalty; adding woman gives a vector near queen."
        }
      },
      {
        "title": "Finding the nearest word",
        "say": [
          "An analogy result is just a vector. To turn it back into a word, find the vocabulary word whose vector is most similar to it, by cosine.",
          "One important detail: exclude the input words. king - man + woman is often closest to \"king\" itself, which is not an interesting answer.",
          "Practice 2 is nearest_word(vector, embeddings, exclude): the word not in exclude with the highest cosine similarity, ties going to the alphabetically first word.",
          "Using min with the key (-similarity, word) gets the highest similarity and the alphabetical tie-break in one step.",
          "For large vocabularies this search uses the same approximate nearest neighbour indexes as document search.",
          "Nearest-word search is also how embedding tools suggest synonyms, related tags and search expansions.",
          "The example completes the analogy and shows what happens without excluding the inputs."
        ],
        "example": "Finding the right word in a thesaurus: you know roughly what you mean, and you pick the closest real word, but not the one you started with.",
        "code": "import math\n\nemb = {\"king\": [0.8, 0.9, 0.1], \"queen\": [0.8, 0.9, 0.9], \"man\": [0.7, 0.1, 0.1],\n       \"woman\": [0.7, 0.1, 0.9], \"apple\": [0.1, 0.0, 0.2]}\ndef cos(a, b):\n    return sum(x * y for x, y in zip(a, b)) / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))\ndef nearest_word(v, emb, exclude):\n    return min((w for w in emb if w not in exclude), key=lambda w: (-round(cos(v, emb[w]), 9), w))\n\ntarget = [a - b + c for a, b, c in zip(emb[\"king\"], emb[\"man\"], emb[\"woman\"])]\nprint(\"excluding inputs:\", nearest_word(target, emb, {\"king\", \"man\", \"woman\"}))\nprint(\"scores:\", {w: round(cos(target, v), 3) for w, v in emb.items()})",
        "output": "excluding inputs: queen\nscores: {'king': 0.848, 'queen': 1.0, 'man': 0.689, 'woman': 0.849, 'apple': 0.773}",
        "codeNotes": [
          {
            "line": 8,
            "note": "Highest cosine first; alphabetical among ties."
          },
          {
            "line": 11,
            "note": "Exclude the three input words."
          }
        ],
        "tryIt": "Run nearest_word with an empty exclude set. What comes back, and why exclude inputs?",
        "check": {
          "question": "Why exclude the input words when solving analogies?",
          "options": [
            "They are misspelled",
            "The result vector is often closest to one of the inputs, which is not a useful answer",
            "To make it faster"
          ],
          "answer": 1,
          "why": "Without exclusion, answers like \"king\" often win."
        }
      },
      {
        "title": "Practice time: analogies",
        "say": [
          "Practice 1: vector_analogy(a, b, c). A single list comprehension over zip(a, b, c), rounding each value to 4 decimals.",
          "The checks include a - a + c, which must return exactly c. Rounding protects against tiny floating point leftovers there.",
          "Practice 2: nearest_word(vector, embeddings, exclude). Write a cosine helper, filter out excluded words, and choose with min and the key (-similarity, word).",
          "Round the similarity inside the key (for example to 9 decimals) so words with mathematically equal scores tie properly.",
          "The checks look for \"queen\" from the analogy, the nearest word overall, and the second-nearest when the nearest is excluded.",
          "Together they give you a working analogy solver: arithmetic to build the target, search to name it.",
          "The example shows the floating point leftover that rounding hides."
        ],
        "example": "Measuring with a ruler marked in millimetres: tiny differences below that do not matter, so you round to the mark.",
        "code": "a = [0.1, 0.2]\nc = [0.7, 0.3]\nraw = [x - x + z for x, z in zip(a, c)]\nprint(\"raw:\", [0.1 + 0.2, raw])\nprint(\"rounded:\", round(0.1 + 0.2, 4))",
        "output": "raw: [0.30000000000000004, [0.7, 0.3]]\nrounded: 0.3",
        "codeNotes": [
          {
            "line": 4,
            "note": "0.1 + 0.2 is famously not exactly 0.3 in floating point."
          }
        ],
        "tryIt": "Print 0.1 + 0.2 == 0.3. Why does rounding make tests reliable?",
        "check": {
          "question": "nearest_word(v, emb, {\"king\"}): what happens to \"king\"?",
          "options": [
            "It is ranked first",
            "It is never returned",
            "It raises an error"
          ],
          "answer": 1,
          "why": "Excluded words are filtered out before choosing."
        }
      }
    ],
    "summary": [
      "Words that appear in similar contexts have similar meanings (the distributional hypothesis).",
      "Word2Vec learns dense vectors: skip-gram predicts context from a word, CBOW predicts a word from context.",
      "Cosine similarity between embeddings measures meaning, fixing the synonym problem of count vectors.",
      "Vector arithmetic solves some analogies: king - man + woman ≈ queen.",
      "Turn a vector back into a word with nearest-word search, excluding the inputs."
    ],
    "projectStep": {
      "title": "Explore word vectors",
      "steps": [
        "Write toy three-number vectors for ten words from two topics.",
        "Print each word's nearest neighbour and check the topics cluster.",
        "Try two analogies with vector_analogy and nearest_word and explain the results."
      ]
    }
  },
  {
    "day": 8,
    "title": "Subword Embeddings: FastText & Out-Of-Vocabulary (OOV) Resilience",
    "goal": "You can explain the out-of-vocabulary problem, how FastText builds word vectors from character n-grams, generate boundary-marked n-grams, and build a vector for a word the model never saw.",
    "minutes": 30,
    "recap": "Word2Vec gives each vocabulary word a vector. But what about a word it never saw in training, like a typo, a new product name or a rare inflection? FastText has an answer.",
    "parts": [
      {
        "title": "The out-of-vocabulary problem",
        "say": [
          "A Word2Vec model knows only the words in its training vocabulary. Any other word is out of vocabulary (OOV), and the model has no vector for it at all.",
          "OOV words are common in real text: typos (\"recieve\"), new words (\"deepfake\" once), names, hashtags and, above all, rare word forms.",
          "Languages with rich morphology suffer most. Finnish, Turkish, Tamil or Malayalam words can take many suffixes, so most forms are rare, and many never appear in training.",
          "The usual fallback, a single shared \"unknown\" vector, throws away everything about the word.",
          "Yet a person can often guess a new word's meaning from its parts: \"unfriendliness\" is un + friend + li + ness.",
          "The example measures how many words of a new sentence a small vocabulary does not know.",
          "FastText, from Facebook AI Research (2016), uses those parts."
        ],
        "example": "Meeting a new word like \"microplastics\": you have never seen it, but \"micro\" and \"plastics\" tell you most of what it means.",
        "code": "vocab = {\"the\", \"cat\", \"sat\", \"on\", \"mat\", \"friend\", \"run\", \"running\"}\nsentence = \"the unfriendly cat was runnning on teh mat\".split()\noov = [w for w in sentence if w not in vocab]\nprint(\"unknown words:\", oov)\nprint(f\"OOV rate: {len(oov) / len(sentence):.0%}\")",
        "output": "unknown words: ['unfriendly', 'was', 'runnning', 'teh']\nOOV rate: 50%",
        "codeNotes": [
          {
            "line": 3,
            "note": "Any word not in the vocabulary is out of vocabulary."
          }
        ],
        "tryIt": "Which unknown words could a person still guess? Which parts give the clue?",
        "check": {
          "question": "What does out of vocabulary (OOV) mean?",
          "options": [
            "A spelling mistake only",
            "A word the model has no vector for because it never saw it in training",
            "A stopword"
          ],
          "answer": 1,
          "why": "OOV words are missing from the model's vocabulary, so they have no learned vector."
        }
      },
      {
        "title": "Character n-grams",
        "say": [
          "FastText represents each word as a bag of character n-grams: all substrings of certain lengths, usually 3 to 6 characters.",
          "Before extracting them, it wraps the word in boundary markers: \"where\" becomes \"<where>\". The markers let the model tell a prefix or suffix from the same letters in the middle of a word.",
          "For n = 3, \"<where>\" gives \"<wh\", \"whe\", \"her\", \"ere\", \"re>\". The word \"her\" and the n-gram \"her\" inside \"where\" are different: the word itself would be \"<her>\".",
          "The whole wrapped word \"<where>\" is also included as a special unit, so frequent words still get their own dedicated vector.",
          "Practice 1 is char_ngrams(word, min_n, max_n): all n-grams for each length, shortest first and left to right, then the whole wrapped word, without duplicates.",
          "The number of n-grams grows with word length and the range of n, which is why FastText hashes n-grams into a fixed number of buckets to limit memory.",
          "The example prints the 3-grams and 4-grams of a short word."
        ],
        "example": "Recognising a family by shared features: the same nose, the same smile. Words that share many n-grams are likely related.",
        "code": "def char_ngrams(word, min_n, max_n):\n    w = f\"<{word}>\"\n    grams = []\n    for n in range(min_n, max_n + 1):\n        for i in range(len(w) - n + 1):\n            if w[i:i + n] not in grams:\n                grams.append(w[i:i + n])\n    if w not in grams:\n        grams.append(w)\n    return grams\n\nprint(char_ngrams(\"where\", 3, 3))\nprint(char_ngrams(\"cat\", 3, 4))",
        "output": "['<wh', 'whe', 'her', 'ere', 're>', '<where>']\n['<ca', 'cat', 'at>', '<cat', 'cat>', '<cat>']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Boundary markers mark the start and end of the word."
          },
          {
            "line": 8,
            "note": "The whole word is added as its own unit."
          }
        ],
        "tryIt": "Compare the n-grams of \"running\" and \"runner\". How many do they share?",
        "check": {
          "question": "Why add < and > around the word?",
          "options": [
            "For decoration",
            "So prefixes and suffixes are distinguished from the same letters inside words",
            "To make n-grams longer"
          ],
          "answer": 1,
          "why": "Boundary markers turn \"<ru\" into a clear start-of-word signal."
        }
      },
      {
        "title": "Vectors from n-grams",
        "say": [
          "During training, FastText learns a vector for every character n-gram (and every whole word), using the same skip-gram objective as Word2Vec.",
          "A word's vector is the sum (or average) of its n-gram vectors. So words sharing many n-grams, such as \"running\", \"runner\" and \"runs\", get similar vectors automatically.",
          "This also helps rare words. Even if \"unfriendliness\" appeared only twice, its n-grams like \"fri\", \"end\", \"ness\" appeared thousands of times in other words.",
          "The example measures n-gram overlap between word pairs with the Jaccard index: shared n-grams divided by all distinct n-grams of both words.",
          "Related forms share many n-grams; unrelated words share few.",
          "This is a rough preview of what the learned vectors capture, before any training.",
          "Remember that shared n-grams are not a guarantee of shared meaning: \"cardinal\" and \"cardigan\" share \"car\" and \"card\"."
        ],
        "example": "Building a colour by mixing paints: the final colour comes from its ingredients, so colours with similar ingredients look alike.",
        "code": "def grams(word, n=3):\n    w = f\"<{word}>\"\n    return {w[i:i + n] for i in range(len(w) - n + 1)}\n\ndef jaccard(a, b):\n    ga, gb = grams(a), grams(b)\n    return round(len(ga & gb) / len(ga | gb), 3)\n\nfor a, b in [(\"running\", \"runner\"), (\"running\", \"runs\"), (\"running\", \"banana\"), (\"cardinal\", \"cardigan\")]:\n    print(f\"{a:9} {b:9} shared 3-grams: {sorted(grams(a) & grams(b))}  jaccard {jaccard(a, b)}\")",
        "output": "running   runner    shared 3-grams: ['<ru', 'run', 'unn']  jaccard 0.3\nrunning   runs      shared 3-grams: ['<ru', 'run']  jaccard 0.222\nrunning   banana    shared 3-grams: []  jaccard 0.0\ncardinal  cardigan  shared 3-grams: ['<ca', 'ard', 'car', 'rdi']  jaccard 0.333",
        "codeNotes": [
          {
            "line": 7,
            "note": "Jaccard index: overlap divided by union."
          }
        ],
        "tryIt": "Try \"national\" and \"nationality\". Do they share many n-grams?",
        "check": {
          "question": "Why do \"running\" and \"runner\" get similar FastText vectors?",
          "options": [
            "They have the same length",
            "Their vectors are built from many shared character n-grams",
            "FastText looks them up in a dictionary"
          ],
          "answer": 1,
          "why": "Shared n-grams contribute the same vectors to both words."
        }
      },
      {
        "title": "Vectors for unseen words",
        "say": [
          "Here is the payoff: for an OOV word, FastText builds a vector from whatever n-grams it knows. No retraining is needed.",
          "Take the typo \"runnning\": most of its n-grams (\"<ru\", \"run\", \"unn\", \"nin\", \"ing\", \"ng>\") also appear in \"running\", so its vector lands near \"running\".",
          "Practice 2 is oov_vector(word, ngram_vectors, min_n, max_n): generate the n-grams (plus the whole wrapped word), keep those found in the table, and average them element by element.",
          "If none are known, return None: there is genuinely no information to build from.",
          "zip(*known) is a Python trick that turns a list of vectors into a list of columns, so averaging each column is easy.",
          "This robustness to typos and rare forms is why FastText embeddings stayed popular for search, classification and morphologically rich languages even after bigger models arrived.",
          "The example builds a vector for a typo from a small n-gram table."
        ],
        "example": "Recognising a friend's messy handwriting: even with a letter wrong, the familiar shapes of the rest of the word tell you what it says.",
        "code": "nv = {\"<ru\": [1.0, 0.0], \"run\": [0.8, 0.2], \"unn\": [0.6, 0.4], \"nin\": [0.5, 0.5], \"ing\": [0.2, 0.8], \"ng>\": [0.1, 0.9]}\n\ndef oov_vector(word, table, n=3):\n    w = f\"<{word}>\"\n    known = [table[w[i:i + n]] for i in range(len(w) - n + 1) if w[i:i + n] in table]\n    if not known:\n        return None\n    return [round(sum(col) / len(known), 4) for col in zip(*known)]\n\nprint(\"running :\", oov_vector(\"running\", nv))\nprint(\"runnning:\", oov_vector(\"runnning\", nv))\nprint(\"xyz     :\", oov_vector(\"xyz\", nv))",
        "output": "running : [0.5333, 0.4667]\nrunnning: [0.5333, 0.4667]\nxyz     : None",
        "codeNotes": [
          {
            "line": 5,
            "note": "Keep only the n-grams the model knows."
          },
          {
            "line": 8,
            "note": "zip(*known) turns rows into columns for averaging."
          }
        ],
        "tryIt": "In this toy table the typo gets the same vector as the real word. Why? Would that happen with real training?",
        "check": {
          "question": "What does FastText do for a word it never saw in training?",
          "options": [
            "Returns an error",
            "Builds a vector from the vectors of its known character n-grams",
            "Uses a random vector"
          ],
          "answer": 1,
          "why": "Subword vectors let it compose a vector for any word."
        }
      },
      {
        "title": "Subwords everywhere",
        "say": [
          "FastText's idea, that words are made of reusable pieces, runs through modern NLP.",
          "Byte-pair encoding (Day 22) and WordPiece, used by GPT and BERT, split rare words into frequent subword units learned from data, so there are no OOV words at all.",
          "Character n-grams also make FastText good at language identification: a few n-grams like \"ij\" or \"sch\" reveal Dutch or German quickly.",
          "The fastText library trains both embeddings and fast text classifiers, which were strong baselines for years.",
          "The trade-off is memory. Millions of n-grams need vectors, which is why FastText hashes them into buckets, accepting that some unrelated n-grams share a vector.",
          "The example shows a simple hash-bucket scheme mapping any n-gram to one of a fixed number of rows.",
          "Hashing trades a little accuracy for a guaranteed memory limit, a trade you will see again in many large systems."
        ],
        "example": "A post office with a fixed number of pigeonholes: every letter goes somewhere, even if occasionally two families share a hole.",
        "code": "import hashlib\n\nBUCKETS = 8\ndef bucket(ngram):\n    return int(hashlib.md5(ngram.encode()).hexdigest(), 16) % BUCKETS\n\nfor g in [\"<ru\", \"run\", \"unn\", \"ing\", \"ng>\", \"<ca\", \"cat\"]:\n    print(f\"{g:4} -> row {bucket(g)}\")",
        "output": "<ru  -> row 4\nrun  -> row 6\nunn  -> row 3\ning  -> row 0\nng>  -> row 7\n<ca  -> row 3\ncat  -> row 0",
        "codeNotes": [
          {
            "line": 5,
            "note": "A stable hash, modulo the number of rows, picks a row for any n-gram."
          }
        ],
        "tryIt": "Do any two different n-grams land in the same row? What does that mean for their vectors?",
        "check": {
          "question": "Why does FastText hash n-grams into buckets?",
          "options": [
            "To encrypt them",
            "To cap memory: there are too many possible n-grams to store separately",
            "To sort them"
          ],
          "answer": 1,
          "why": "Hashing limits the table size at the cost of occasional collisions."
        }
      },
      {
        "title": "Practice time: n-grams and OOV vectors",
        "say": [
          "Practice 1: char_ngrams(word, min_n, max_n). Wrap the word, loop over lengths from min_n to max_n, slide over positions, and append each new n-gram. Finish with the wrapped word if it is not already there.",
          "Order matters for the checks: all 3-grams left to right, then all 4-grams, then the whole word.",
          "Short words are a good edge case: \"ab\" with n = 3 still gives \"<ab\" and \"ab>\", and the whole word \"<ab>\".",
          "Practice 2: oov_vector(word, ngram_vectors, min_n, max_n). Build the n-gram set including the whole wrapped word, keep known ones, and average column by column with zip(*known). Return None when nothing is known.",
          "The checks include a case where only the whole wrapped word is in the table, which confirms you included it.",
          "After passing, compare oov_vector results for a word and its typo with cosine similarity from Day 6.",
          "The example shows the column trick with zip(*rows) on its own."
        ],
        "example": "Turning a table of test scores by student into scores by subject, so you can average each subject.",
        "code": "rows = [[1.0, 0.0, 3.0], [0.0, 1.0, 1.0]]\ncolumns = list(zip(*rows))\nprint(\"columns:\", columns)\nprint(\"column averages:\", [sum(c) / len(rows) for c in columns])",
        "output": "columns: [(1.0, 0.0), (0.0, 1.0), (3.0, 1.0)]\ncolumn averages: [0.5, 0.5, 2.0]",
        "codeNotes": [
          {
            "line": 2,
            "note": "The * spreads the rows as separate arguments to zip."
          }
        ],
        "tryIt": "What does zip(*rows) give for three rows of two numbers each?",
        "check": {
          "question": "char_ngrams(\"cat\", 3, 3) should end with which item?",
          "options": [
            "\"cat\"",
            "\"<cat>\"",
            "\"at>\""
          ],
          "answer": 1,
          "why": "The whole word, wrapped in boundary markers, is added last."
        }
      }
    ],
    "summary": [
      "Word-level models have no vector for out-of-vocabulary words.",
      "FastText represents words as bags of character n-grams with < > boundary markers, plus the whole word.",
      "Words sharing n-grams get similar vectors, which helps rare forms and morphology.",
      "Unseen words get vectors by averaging their known n-gram vectors.",
      "Subword units are the basis of modern tokenisers; hashing caps n-gram memory."
    ],
    "projectStep": {
      "title": "Typo-tolerant word matching",
      "steps": [
        "Pick ten words and create three typos for each.",
        "Measure n-gram Jaccard overlap between each word and its typos, and with unrelated words.",
        "Choose a threshold that matches typos but not unrelated words, and report how well it works."
      ]
    }
  },
  {
    "day": 9,
    "title": "Global Vectors for Word Representation: GloVe Co-Occurrence Matrix Factorization",
    "goal": "You can explain how GloVe learns word vectors from global co-occurrence statistics, build a co-occurrence table with a window, compute the GloVe weighting function, and compare GloVe with Word2Vec.",
    "minutes": 30,
    "recap": "Word2Vec learns from one context window at a time, as it slides through text. GloVe takes a different route: count every co-occurrence in the whole corpus first, then fit vectors to those totals.",
    "parts": [
      {
        "title": "Counting co-occurrences",
        "say": [
          "A co-occurrence matrix records, for every pair of words, how often they appear near each other within a window, across the entire corpus.",
          "For \"ice\" you would see large counts with \"cold\", \"solid\", \"water\"; for \"steam\", large counts with \"hot\", \"gas\", \"water\".",
          "These global statistics contain a lot of meaning. Older methods (latent semantic analysis) factorised such matrices to get word vectors.",
          "Practice 2 is cooccurrence(tokens, window): count each pair of different words within the window, using an alphabetically sorted tuple as the key so the pair order does not matter.",
          "The window size shapes the result: small windows capture syntax (words that can replace each other), large windows capture topics (words from the same subject).",
          "Real systems often weight nearer words more, for example by 1 / distance, because an adjacent word is stronger evidence than one five positions away.",
          "The example builds co-occurrence counts from two short sentences."
        ],
        "example": "Noticing which people are often seen together at parties: across many parties, the patterns reveal friend groups.",
        "code": "def cooccurrence(tokens, window):\n    counts = {}\n    for i in range(len(tokens)):\n        for j in range(i + 1, min(len(tokens), i + window + 1)):\n            if tokens[i] != tokens[j]:\n                key = tuple(sorted((tokens[i], tokens[j])))\n                counts[key] = counts.get(key, 0) + 1\n    return counts\n\ntext = \"ice is cold and solid steam is hot and gas\".split()\nfor pair, n in sorted(cooccurrence(text, 2).items()):\n    print(pair, n)",
        "output": "('and', 'cold') 1\n('and', 'gas') 1\n('and', 'hot') 1\n('and', 'is') 2\n('and', 'solid') 1\n('and', 'steam') 1\n('cold', 'ice') 1\n('cold', 'is') 1\n('cold', 'solid') 1\n('gas', 'hot') 1\n('hot', 'is') 1\n('hot', 'steam') 1\n('ice', 'is') 1\n('is', 'solid') 1\n('is', 'steam') 1\n('solid', 'steam') 1",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only look forward, so each pair of positions is counted once."
          },
          {
            "line": 6,
            "note": "Sorting the pair makes (a, b) and (b, a) the same key."
          }
        ],
        "tryIt": "Which word co-occurs with both \"ice\" and \"steam\"? What does that suggest?",
        "check": {
          "question": "What does a co-occurrence count measure?",
          "options": [
            "How long a word is",
            "How often two words appear near each other in the corpus",
            "How rare a word is"
          ],
          "answer": 1,
          "why": "Counts of nearby word pairs across the whole corpus."
        }
      },
      {
        "title": "Ratios carry meaning",
        "say": [
          "The key insight of GloVe (Global Vectors, Pennington, Socher and Manning at Stanford, 2014) is that RATIOS of co-occurrence probabilities reveal meaning.",
          "Compare how often \"solid\" appears with \"ice\" versus with \"steam\". The ratio P(solid | ice) / P(solid | steam) is large, because solid relates to ice.",
          "For \"gas\" the ratio is small, because gas relates to steam. For \"water\", which relates to both, and \"fashion\", which relates to neither, the ratio is close to 1.",
          "So ratios separate relevant words from irrelevant ones cleanly, while raw probabilities are muddied by how common each word is overall.",
          "GloVe trains vectors so that the dot product of two word vectors approximates the logarithm of their co-occurrence count. Differences of vectors then capture these ratios.",
          "The example computes such ratios from a small made-up table of probabilities.",
          "This is why GloVe vectors also solve analogies: vector differences encode ratio patterns."
        ],
        "example": "Comparing two shops by what sells unusually well in each: umbrellas sell far more in the rainy town, sunglasses in the sunny one, and bread sells the same in both.",
        "code": "p_given_ice = {\"solid\": 0.019, \"gas\": 0.0007, \"water\": 0.030, \"fashion\": 0.0002}\np_given_steam = {\"solid\": 0.0022, \"gas\": 0.0078, \"water\": 0.022, \"fashion\": 0.0002}\nfor k in p_given_ice:\n    ratio = p_given_ice[k] / p_given_steam[k]\n    print(f\"{k:8} ratio ice/steam = {ratio:6.2f}\")",
        "output": "solid    ratio ice/steam =   8.64\ngas      ratio ice/steam =   0.09\nwater    ratio ice/steam =   1.36\nfashion  ratio ice/steam =   1.00",
        "codeNotes": [
          {
            "line": 4,
            "note": "Large ratio: related to ice. Small: related to steam. Near 1: both or neither."
          }
        ],
        "tryIt": "Add \"cold\" with P = 0.012 for ice and 0.001 for steam. Where does it fall?",
        "check": {
          "question": "A probe word relates equally to both \"ice\" and \"steam\". Its ratio is close to?",
          "options": [
            "0",
            "1",
            "100"
          ],
          "answer": 1,
          "why": "Equal relation gives equal probabilities, so the ratio is about 1."
        }
      },
      {
        "title": "The weighting function",
        "say": [
          "Fitting every cell of the co-occurrence matrix equally would be a mistake.",
          "Very frequent pairs, such as (\"the\", \"of\"), would dominate training, even though they carry little meaning. Very rare pairs are noisy, often just chance.",
          "And most cells are zero; GloVe skips them entirely, because the log of zero is undefined.",
          "GloVe weights each pair by f(x) = (x / x_max) ** alpha for x below x_max, and 1 above it. The paper uses x_max = 100 and alpha = 0.75.",
          "So rare pairs get small weights, weights grow with the count, and frequent pairs are capped at 1 so they cannot dominate.",
          "Practice 1 is glove_weight(x, x_max=100, alpha=0.75), rounded to 4 decimals, returning 0.0 for x = 0.",
          "The example prints the weight curve for a range of counts."
        ],
        "example": "A voting system where people who attended more meetings get more say, up to a limit, so nobody can outvote everyone else just by showing up every day.",
        "code": "def glove_weight(x, x_max=100, alpha=0.75):\n    if x == 0:\n        return 0.0\n    return round(min(1.0, (x / x_max) ** alpha), 4)\n\nfor count in [0, 1, 5, 10, 50, 100, 1000]:\n    w = glove_weight(count)\n    print(f\"count {count:5} -> weight {w:.4f} {'#' * int(w * 20)}\".rstrip())",
        "output": "count     0 -> weight 0.0000\ncount     1 -> weight 0.0316\ncount     5 -> weight 0.1057 ##\ncount    10 -> weight 0.1778 ###\ncount    50 -> weight 0.5946 ###########\ncount   100 -> weight 1.0000 ####################\ncount  1000 -> weight 1.0000 ####################",
        "codeNotes": [
          {
            "line": 4,
            "note": "Grows with the count, capped at 1."
          }
        ],
        "tryIt": "Try alpha = 1.0 and alpha = 0.5. How does the curve change for small counts?",
        "check": {
          "question": "Why cap the weight at 1 for very frequent pairs?",
          "options": [
            "To save memory",
            "So extremely common pairs like \"the of\" cannot dominate training",
            "Because logs need it"
          ],
          "answer": 1,
          "why": "Capping stops frequent but uninformative pairs from overwhelming the rest."
        }
      },
      {
        "title": "GloVe versus Word2Vec",
        "say": [
          "Word2Vec is predictive: it learns by predicting context words one window at a time. GloVe is count-based: it first counts globally, then fits vectors to the counts.",
          "In practice both give similar quality embeddings; which is better depends on the task and data. Later research showed they are closely related mathematically.",
          "GloVe's training can be efficient because it works on the (sparse) co-occurrence matrix rather than re-reading the corpus.",
          "Word2Vec can be trained in a streaming way on text that never fits in memory.",
          "Pre-trained GloVe vectors (for example 6 billion tokens from Wikipedia and news, in 50 to 300 dimensions) are freely downloadable and widely used.",
          "All three methods you have seen (Word2Vec, FastText, GloVe) give one fixed vector per word. \"Bank\" gets one vector whether it means a river bank or a money bank. Contextual models (Day 23) fix that.",
          "The example summarises the three methods side by side."
        ],
        "example": "Two ways to learn a city: walk every street one at a time (Word2Vec), or study a complete traffic map first (GloVe). Both end up knowing the city.",
        "code": "methods = [\n    (\"Word2Vec\", \"predict context, window by window\", \"no\", \"one vector per word\"),\n    (\"GloVe\", \"fit global co-occurrence counts\", \"no\", \"one vector per word\"),\n    (\"FastText\", \"Word2Vec over character n-grams\", \"yes\", \"one vector per word\"),\n]\nprint(f\"{'method':9} {'how it learns':35} {'handles OOV':12} limitation\")\nfor name, how, oov, limit in methods:\n    print(f\"{name:9} {how:35} {oov:12} {limit}\")",
        "output": "method    how it learns                       handles OOV  limitation\nWord2Vec  predict context, window by window   no           one vector per word\nGloVe     fit global co-occurrence counts     no           one vector per word\nFastText  Word2Vec over character n-grams     yes          one vector per word",
        "codeNotes": [
          {
            "line": 6,
            "note": "All three give each word a single, context-free vector."
          }
        ],
        "tryIt": "Add a row for \"BERT (Day 23)\". What would its limitation column say instead?",
        "check": {
          "question": "What limitation do Word2Vec, GloVe and FastText share?",
          "options": [
            "They cannot handle English",
            "Each word gets one vector regardless of its meaning in context",
            "They need labelled data"
          ],
          "answer": 1,
          "why": "Static embeddings cannot tell \"river bank\" from \"money bank\"."
        }
      },
      {
        "title": "Using pre-trained embeddings",
        "say": [
          "Most projects do not train embeddings from scratch. They download pre-trained vectors and use them as features.",
          "A simple and surprisingly strong sentence representation is the average of its word vectors. You will build it for Milestone 2.",
          "Before using vectors, check vocabulary coverage: what share of your tokens have a vector? Low coverage (many domain terms missing) is a warning sign; FastText or fine-tuning may help.",
          "Normalise text the same way the embeddings were trained. Lowercased GloVe vectors will miss capitalised tokens if you do not lowercase.",
          "Embeddings can also be fine-tuned on your own data, or adapted with domain text, such as medical or legal documents.",
          "The example measures vocabulary coverage of a small embedding table on a sample sentence.",
          "Checking coverage takes a minute and can save days of confusing results."
        ],
        "example": "Borrowing a well-used dictionary instead of writing your own, and first checking it has the words your field needs.",
        "code": "embeddings = {\"the\": [0.1], \"patient\": [0.4], \"has\": [0.2], \"a\": [0.1], \"fever\": [0.7], \"and\": [0.1]}\ntokens = \"the patient has a fever and tachycardia with dyspnoea\".split()\ncovered = [t for t in tokens if t in embeddings]\nmissing = [t for t in tokens if t not in embeddings]\nprint(f\"coverage: {len(covered) / len(tokens):.0%}\")\nprint(\"missing:\", missing)",
        "output": "coverage: 67%\nmissing: ['tachycardia', 'with', 'dyspnoea']",
        "codeNotes": [
          {
            "line": 4,
            "note": "The missing words are the medical terms that matter most."
          }
        ],
        "tryIt": "Which of the missing words could a FastText model still represent reasonably?",
        "check": {
          "question": "Why check embedding coverage before using pre-trained vectors?",
          "options": [
            "To speed up training",
            "Missing domain words silently lose important information",
            "Coverage is always 100 percent"
          ],
          "answer": 1,
          "why": "Low coverage means key words get no vector."
        }
      },
      {
        "title": "Practice time: weights and counts",
        "say": [
          "Practice 1: glove_weight(x, x_max=100, alpha=0.75). Return 0.0 for x = 0; otherwise round(min(1.0, (x / x_max) ** alpha), 4).",
          "The checks try x = x_max (exactly 1), a huge count (capped at 1), a small count (0.1778 for x = 10), and custom settings.",
          "Practice 2: cooccurrence(tokens, window). Two loops: i over positions, j from i + 1 up to i + window (but not past the end). Skip pairs of the same word, sort the pair into a tuple, and count.",
          "Looking only forward (j > i) counts each pair of positions once. Looking both ways would double every count.",
          "The checks include a repeated word, so a word that appears twice near another is counted twice.",
          "These two pieces are exactly what a GloVe trainer computes before any learning happens.",
          "The example shows how looking both ways would double the counts."
        ],
        "example": "Counting handshakes at a party: if everyone counts both their own handshakes and the other person's, every handshake is counted twice.",
        "code": "tokens = [\"a\", \"b\", \"c\"]\nforward = sum(1 for i in range(3) for j in range(i + 1, min(3, i + 2)))\nboth_ways = sum(1 for i in range(3) for j in range(max(0, i - 1), min(3, i + 2)) if j != i)\nprint(\"pairs looking forward only:\", forward)\nprint(\"pairs looking both ways:\", both_ways)",
        "output": "pairs looking forward only: 2\npairs looking both ways: 4",
        "codeNotes": [
          {
            "line": 2,
            "note": "Each neighbouring pair counted once."
          },
          {
            "line": 3,
            "note": "Each neighbouring pair counted twice."
          }
        ],
        "tryIt": "With window 2 over [\"a\", \"b\", \"c\"], how many forward pairs are there?",
        "check": {
          "question": "glove_weight(100) returns?",
          "options": [
            "0.75",
            "1.0",
            "100"
          ],
          "answer": 1,
          "why": "At x = x_max the ratio is 1, and 1 to any power is 1."
        }
      }
    ],
    "summary": [
      "Co-occurrence counts record how often word pairs appear near each other across the whole corpus.",
      "Ratios of co-occurrence probabilities separate related from unrelated words.",
      "GloVe fits word vectors so dot products approximate log co-occurrence counts.",
      "The weighting function (x / x_max) ** alpha, capped at 1, balances rare and frequent pairs.",
      "Word2Vec, GloVe and FastText give one static vector per word; check coverage before use."
    ],
    "projectStep": {
      "title": "Co-occurrence explorer",
      "steps": [
        "Build a co-occurrence table from a few paragraphs with window 2 and window 5.",
        "For two words, list their top five co-occurring words at each window size.",
        "Explain how the window changed what counts as \"related\"."
      ]
    }
  },
  {
    "day": 10,
    "title": "Part-of-Speech Tagging with Hidden Markov Models: Viterbi Trellis Algorithm",
    "goal": "You can explain part-of-speech tagging as a sequence problem, describe a hidden Markov model with start, transition and emission probabilities, score a tag sequence, and find the best tags with the Viterbi algorithm.",
    "minutes": 30,
    "recap": "On Day 2 you saw that a word's part of speech changes its lemma. Today you teach the computer to tag parts of speech automatically, using probabilities and dynamic programming.",
    "parts": [
      {
        "title": "Tagging is a sequence problem",
        "say": [
          "Part-of-speech tagging assigns a tag (NOUN, VERB, ADJ...) to every word in a sentence.",
          "Many words are ambiguous. \"Fish\" can be a noun or a verb; \"book\" can be a noun (\"a book\") or a verb (\"book a table\").",
          "Looking at a word alone is not enough; its neighbours decide. After \"the\", a noun is likely; after \"will\", a verb is likely.",
          "So tagging is a sequence problem: the best tag for each word depends on the tags around it.",
          "A hidden Markov model (HMM) is a classic way to model this. The tags are hidden states we cannot see; the words are the observations we can see.",
          "HMMs powered speech recognition and tagging for decades, and the dynamic programming idea behind them is still everywhere.",
          "The example shows how often ambiguous words appear in a short sentence."
        ],
        "example": "Working out what someone means from a word you missed on a noisy phone line, using the words around it.",
        "code": "possible = {\"time\": [\"NOUN\", \"VERB\"], \"flies\": [\"NOUN\", \"VERB\"], \"like\": [\"VERB\", \"ADP\"],\n            \"an\": [\"DET\"], \"arrow\": [\"NOUN\"]}\nsentence = [\"time\", \"flies\", \"like\", \"an\", \"arrow\"]\ntotal = 1\nfor w in sentence:\n    total *= len(possible[w])\n    print(f\"{w:6} could be {possible[w]}\")\nprint(\"possible tag sequences:\", total)",
        "output": "time   could be ['NOUN', 'VERB']\nflies  could be ['NOUN', 'VERB']\nlike   could be ['VERB', 'ADP']\nan     could be ['DET']\narrow  could be ['NOUN']\npossible tag sequences: 8",
        "codeNotes": [
          {
            "line": 6,
            "note": "Each ambiguous word multiplies the number of possible tag sequences."
          }
        ],
        "tryIt": "Add three more ambiguous words. How fast does the number of sequences grow?",
        "check": {
          "question": "Why is part-of-speech tagging a sequence problem?",
          "options": [
            "Tags are alphabetical",
            "The best tag for a word depends on the neighbouring tags",
            "Every word has one tag"
          ],
          "answer": 1,
          "why": "Context from neighbouring words and tags resolves ambiguity."
        }
      },
      {
        "title": "The hidden Markov model",
        "say": [
          "An HMM has three sets of probabilities, all estimated by counting in a tagged corpus.",
          "Start probabilities: how likely each tag is as the first tag of a sentence, P(tag at start).",
          "Transition probabilities: how likely one tag follows another, P(tag2 | tag1). This is a bigram model over tags, like Day 3 but for tags instead of words.",
          "Emission probabilities: how likely a tag produces a word, P(word | tag). A NOUN emits \"fish\" with some probability, a VERB emits \"fish\" with another.",
          "The joint probability of a tag sequence and its words is the product of the start, then alternating emissions and transitions.",
          "Practice 2 is sequence_prob(tags, words, start, trans, emit): compute exactly that product, rounded to 6 decimals, with unknown emissions counting as 0.",
          "The example scores two possible taggings of \"fish swim\"."
        ],
        "example": "A weather diary kept by someone in a windowless room, who only sees whether visitors carry umbrellas: the weather is hidden, the umbrellas are observed.",
        "code": "start = {\"NOUN\": 0.7, \"VERB\": 0.3}\ntrans = {\"NOUN\": {\"NOUN\": 0.3, \"VERB\": 0.7}, \"VERB\": {\"NOUN\": 0.8, \"VERB\": 0.2}}\nemit = {\"NOUN\": {\"fish\": 0.6, \"swim\": 0.1}, \"VERB\": {\"fish\": 0.3, \"swim\": 0.6}}\n\ndef sequence_prob(tags, words):\n    p = start[tags[0]] * emit[tags[0]].get(words[0], 0)\n    for i in range(1, len(tags)):\n        p *= trans[tags[i - 1]][tags[i]] * emit[tags[i]].get(words[i], 0)\n    return round(p, 6)\n\nfor tags in [[\"NOUN\", \"VERB\"], [\"VERB\", \"NOUN\"], [\"NOUN\", \"NOUN\"], [\"VERB\", \"VERB\"]]:\n    print(tags, sequence_prob(tags, [\"fish\", \"swim\"]))",
        "output": "['NOUN', 'VERB'] 0.1764\n['VERB', 'NOUN'] 0.0072\n['NOUN', 'NOUN'] 0.0126\n['VERB', 'VERB'] 0.0108",
        "codeNotes": [
          {
            "line": 6,
            "note": "Start probability times the first emission."
          },
          {
            "line": 8,
            "note": "Then a transition and an emission for each next word."
          }
        ],
        "tryIt": "Which tagging wins? Does it match your intuition for \"fish swim\"?",
        "check": {
          "question": "What does an emission probability P(word | tag) describe?",
          "options": [
            "How likely a tag follows another",
            "How likely a tag produces a particular word",
            "How long a sentence is"
          ],
          "answer": 1,
          "why": "Emissions link the hidden tag to the observed word."
        }
      },
      {
        "title": "Why brute force fails",
        "say": [
          "To find the best tagging, we could score every possible tag sequence and take the highest. For two words and two tags, that is only 4 sequences.",
          "But the count is (number of tags) to the power (number of words). With 17 universal tags and a 20-word sentence, that is about 4 times 10 to the 24 sequences, far too many.",
          "The trick is to notice overlapping work. Many sequences share the same first few tags, and we keep recomputing those shared beginnings.",
          "Dynamic programming stores the best partial result for each state and reuses it, turning an exponential problem into one that grows linearly with sentence length.",
          "For an HMM this is the Viterbi algorithm, named after Andrew Viterbi, who invented it in 1967 for decoding signals; it is also used in mobile phones and DNA analysis.",
          "The example compares the number of sequences brute force would score with the number of steps Viterbi needs.",
          "Recognising overlapping sub-problems is one of the most useful skills in algorithm design."
        ],
        "example": "Planning a road trip: instead of listing every possible route across the country, you remember the best way to reach each city and build on it.",
        "code": "tags = 17\nfor words in [3, 5, 10, 20]:\n    brute = tags ** words\n    viterbi = words * tags * tags\n    print(f\"{words:2} words: brute force {brute:.2e} sequences, Viterbi about {viterbi} steps\")",
        "output": " 3 words: brute force 4.91e+03 sequences, Viterbi about 867 steps\n 5 words: brute force 1.42e+06 sequences, Viterbi about 1445 steps\n10 words: brute force 2.02e+12 sequences, Viterbi about 2890 steps\n20 words: brute force 4.06e+24 sequences, Viterbi about 5780 steps",
        "codeNotes": [
          {
            "line": 3,
            "note": "Every combination of tags."
          },
          {
            "line": 4,
            "note": "For each word, each tag looks back at each previous tag."
          }
        ],
        "tryIt": "How many brute-force sequences for a 40-word sentence? How many Viterbi steps?",
        "check": {
          "question": "Why is brute-force tagging impractical?",
          "options": [
            "It gives wrong answers",
            "The number of tag sequences grows exponentially with sentence length",
            "It needs a GPU"
          ],
          "answer": 1,
          "why": "tags ** words explodes quickly; dynamic programming avoids it."
        }
      },
      {
        "title": "The Viterbi algorithm",
        "say": [
          "Viterbi walks through the sentence one word at a time. For each tag, it keeps two things: the probability of the best path ending in that tag, and the path itself.",
          "Start: for each tag, probability = start[tag] times emit[tag][first word], and the path is just [tag].",
          "Step: for each new word and each tag s, look at every previous tag p, compute best[p] times trans[p][s], and keep the largest. Multiply by emit[s][word] and extend that winning path with s.",
          "End: the tag with the highest final probability wins, and its stored path is the best tagging.",
          "Practice 1 is viterbi(words, states, start, trans, emit). Ties go to the tag listed first in states, which Python's max gives you automatically, because it keeps the first of equal values.",
          "Real implementations add log probabilities instead of multiplying, to avoid underflow on long sentences, and store back-pointers instead of whole paths to save memory.",
          "The example runs Viterbi on \"dogs fish\" and prints the table after each word."
        ],
        "example": "Relay runners where, at each checkpoint, only the fastest team so far through each lane continues; slower teams in the same lane drop out because they can never win.",
        "code": "states = [\"NOUN\", \"VERB\"]\nstart = {\"NOUN\": 0.7, \"VERB\": 0.3}\ntrans = {\"NOUN\": {\"NOUN\": 0.3, \"VERB\": 0.7}, \"VERB\": {\"NOUN\": 0.8, \"VERB\": 0.2}}\nemit = {\"NOUN\": {\"fish\": 0.6, \"dogs\": 0.3}, \"VERB\": {\"fish\": 0.3, \"dogs\": 0.1}}\nwords = [\"dogs\", \"fish\"]\nbest = {s: (start[s] * emit[s].get(words[0], 0), [s]) for s in states}\nprint(words[0], {s: round(p, 4) for s, (p, _) in best.items()})\nfor w in words[1:]:\n    new = {}\n    for s in states:\n        prob, path = max(((best[p][0] * trans[p][s], best[p][1]) for p in states), key=lambda t: t[0])\n        new[s] = (prob * emit[s].get(w, 0), path + [s])\n    best = new\n    print(w, {s: (round(p, 4), path) for s, (p, path) in best.items()})\nprint(\"best:\", max(best.values(), key=lambda t: t[0])[1])",
        "output": "dogs {'NOUN': 0.21, 'VERB': 0.03}\nfish {'NOUN': (0.0378, ['NOUN', 'NOUN']), 'VERB': (0.0441, ['NOUN', 'VERB'])}\nbest: ['NOUN', 'VERB']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Initialise each tag with start times emission."
          },
          {
            "line": 11,
            "note": "Best previous tag for reaching s."
          },
          {
            "line": 15,
            "note": "The highest final probability wins."
          }
        ],
        "tryIt": "Tag \"fish fish\" with the same model. Is the result what you expected?",
        "check": {
          "question": "What does Viterbi keep for each tag at each step?",
          "options": [
            "Every path ending in that tag",
            "Only the best path ending in that tag and its probability",
            "Nothing, it restarts each word"
          ],
          "answer": 1,
          "why": "Keeping only the best path per tag is what makes it efficient and still exact."
        }
      },
      {
        "title": "From HMMs to modern taggers",
        "say": [
          "HMM taggers reach about 95 percent accuracy on English news text, which sounds high, but means roughly one error per sentence.",
          "Their limits come from the assumptions: each tag depends only on the previous tag, and each word only on its own tag. They cannot use useful clues like capital letters or suffixes easily.",
          "Conditional random fields (CRFs) relaxed those limits with rich features, and neural taggers (BiLSTMs, Day 15, then Transformers) pushed accuracy to about 97 to 98 percent.",
          "Yet the Viterbi algorithm survives: CRF and some neural taggers still use it to pick the best consistent tag sequence.",
          "Unknown words are a classic HMM weakness, since their emission probability is 0 for every tag. Smoothing or suffix-based guesses (\"-ly\" suggests an adverb) help.",
          "The example shows a suffix-based guess for unknown words.",
          "Understanding HMMs makes modern sequence models much easier to follow, because the questions are the same."
        ],
        "example": "A classic car engine: modern cars are far better, but mechanics still learn on the classic engine because the same principles run everything.",
        "code": "def guess_tag(word):\n    if word.endswith(\"ly\"): return \"ADV\"\n    if word.endswith((\"ing\", \"ed\")): return \"VERB\"\n    if word.endswith((\"tion\", \"ness\", \"ment\")): return \"NOUN\"\n    if word[:1].isupper(): return \"PROPN\"\n    return \"NOUN\"\n\nfor w in [\"quickly\", \"blorping\", \"greatness\", \"Kochi\", \"zorb\"]:\n    print(f\"{w:10} -> {guess_tag(w)}\")",
        "output": "quickly    -> ADV\nblorping   -> VERB\ngreatness  -> NOUN\nKochi      -> PROPN\nzorb       -> NOUN",
        "codeNotes": [
          {
            "line": 2,
            "note": "Suffixes are strong clues to the part of speech."
          },
          {
            "line": 6,
            "note": "Nouns are the most common open class, so they are a good default."
          }
        ],
        "tryIt": "Add a rule for \"-ous\" (adjectives like \"famous\"). Test it.",
        "check": {
          "question": "Why do HMM taggers struggle with unknown words?",
          "options": [
            "They are too long",
            "Their emission probability is 0 for every tag",
            "They are always verbs"
          ],
          "answer": 1,
          "why": "Without smoothing or guesses, an unseen word gives every path probability 0."
        }
      },
      {
        "title": "Practice time: Viterbi",
        "say": [
          "Practice 1: viterbi(words, states, start, trans, emit). Initialise best as a dictionary from tag to (probability, path).",
          "For each following word, build a new dictionary: for each tag s, pick the best previous tag with max over (best[p][0] * trans[p][s], best[p][1]), then multiply by the emission and extend the path.",
          "Finally return the path of the tag with the highest probability. Use emit[s].get(word, 0) so unknown words do not crash.",
          "The checks include a single-word sentence, where only start times emission matters: \"swim\" alone is more likely a verb.",
          "Practice 2: sequence_prob(tags, words, start, trans, emit). A loop that multiplies transitions and emissions, rounded to 6 decimals.",
          "A good self-check: the Viterbi path's sequence_prob should be the largest among all possible tag sequences for short sentences. The example verifies that with brute force.",
          "Checking a clever algorithm against a slow, obviously correct one is a habit worth keeping."
        ],
        "example": "Checking a shortcut on a map by also walking the long way once: if both arrive at the same place, you trust the shortcut.",
        "code": "from itertools import product\n\nstates = [\"NOUN\", \"VERB\"]\nstart = {\"NOUN\": 0.7, \"VERB\": 0.3}\ntrans = {\"NOUN\": {\"NOUN\": 0.3, \"VERB\": 0.7}, \"VERB\": {\"NOUN\": 0.8, \"VERB\": 0.2}}\nemit = {\"NOUN\": {\"fish\": 0.6, \"swim\": 0.1, \"dogs\": 0.3}, \"VERB\": {\"fish\": 0.3, \"swim\": 0.6, \"dogs\": 0.1}}\ndef seq_prob(tags, words):\n    p = start[tags[0]] * emit[tags[0]].get(words[0], 0)\n    for a, b, w in zip(tags, tags[1:], words[1:]):\n        p *= trans[a][b] * emit[b].get(w, 0)\n    return p\nwords = [\"dogs\", \"fish\", \"swim\"]\nbest = max(product(states, repeat=len(words)), key=lambda tags: seq_prob(tags, words))\nprint(\"brute-force best:\", list(best), round(seq_prob(best, words), 6))",
        "output": "brute-force best: ['NOUN', 'NOUN', 'VERB'] 0.015876",
        "codeNotes": [
          {
            "line": 13,
            "note": "product tries every tag combination: fine for 3 words, impossible for 30."
          }
        ],
        "tryIt": "Run your viterbi on the same words. Does it agree with brute force?",
        "check": {
          "question": "For a one-word sentence, what decides the Viterbi tag?",
          "options": [
            "Transitions only",
            "Start probability times emission probability",
            "Alphabetical order"
          ],
          "answer": 1,
          "why": "With one word there are no transitions; start and emission decide."
        }
      }
    ],
    "summary": [
      "Part-of-speech tagging is a sequence problem: neighbouring tags resolve ambiguous words.",
      "An HMM has start, transition P(tag2 | tag1) and emission P(word | tag) probabilities.",
      "A tagging's probability is start × emissions × transitions along the sequence.",
      "Brute force is exponential; Viterbi keeps the best path per tag and is linear in sentence length.",
      "Modern taggers are more accurate, but Viterbi still decodes many sequence models."
    ],
    "projectStep": {
      "title": "Tag your own sentences",
      "steps": [
        "Write start, transition and emission tables for NOUN, VERB and DET from ten tagged sentences.",
        "Tag three new sentences with viterbi and check them by hand.",
        "Add suffix guesses for unknown words and see whether accuracy improves."
      ]
    }
  },
  {
    "day": 11,
    "title": "Named Entity Recognition (NER): BIO Scheme & Sequence Chunking",
    "goal": "You can explain named entity recognition, tag entities with the BIO scheme, validate BIO sequences, convert tags into entity spans, and evaluate an NER system with entity-level precision and recall.",
    "minutes": 30,
    "recap": "Yesterday you tagged every word with its part of speech. Today you tag the words that name things (people, places, organisations, dates) and join them into whole entities.",
    "parts": [
      {
        "title": "What named entity recognition does",
        "say": [
          "Named entity recognition (NER) finds the spans of text that name real-world things and labels their type: PER (person), LOC (location), ORG (organisation), DATE, MONEY and so on.",
          "In \"Sundar Pichai visited New Delhi on Monday\", NER should find \"Sundar Pichai\" (PER), \"New Delhi\" (LOC) and \"Monday\" (DATE).",
          "NER powers many systems: news search by company, pulling names and amounts from invoices, spotting personal data to hide it, and linking mentions to a knowledge base.",
          "Entities often span several words, so we cannot just label single words as \"person\". We need to mark where an entity begins and where it continues.",
          "Entity types depend on the domain. A medical system tags DRUG, DOSE and SYMPTOM; a legal system tags COURT, STATUTE and PARTY.",
          "The example shows the entities we want from a sentence, as (type, text) pairs.",
          "Today you build the representation and the conversion code that every NER system uses."
        ],
        "example": "Highlighting a newspaper article with different colours for people, places and dates, making sure a two-word name is highlighted as one piece.",
        "code": "sentence = \"Sundar Pichai visited New Delhi on Monday\"\nentities = [(\"PER\", \"Sundar Pichai\"), (\"LOC\", \"New Delhi\"), (\"DATE\", \"Monday\")]\nfor etype, text in entities:\n    start = sentence.index(text)\n    print(f\"{etype:5} {text!r:17} characters {start}-{start + len(text)}\")",
        "output": "PER   'Sundar Pichai'   characters 0-13\nLOC   'New Delhi'       characters 22-31\nDATE  'Monday'          characters 35-41",
        "codeNotes": [
          {
            "line": 4,
            "note": "Entities are spans: a start and an end in the text."
          }
        ],
        "tryIt": "Add (\"ORG\", \"Google\") and a sentence that contains it. Where does it start?",
        "check": {
          "question": "Why can NER not simply label each word as PERSON or not?",
          "options": [
            "Words are too short",
            "Entities can span several words, and we need to know where each begins and ends",
            "Names are always one word"
          ],
          "answer": 1,
          "why": "Multi-word entities need boundary information, not just a type per word."
        }
      },
      {
        "title": "The BIO scheme",
        "say": [
          "The standard trick is to turn entity spans into one tag per token with the BIO scheme.",
          "B-TYPE marks the Beginning of an entity, I-TYPE marks a token Inside (continuing) an entity of that type, and O marks tokens Outside any entity.",
          "\"Sundar Pichai visited New Delhi\" becomes B-PER I-PER O B-LOC I-LOC.",
          "Why B at all? Two entities of the same type can sit side by side, as in \"gave Asha Ravi the book\". B-PER B-PER shows two people; I-PER would wrongly merge them into one.",
          "Once entities are per-token tags, NER becomes a tagging problem like part-of-speech tagging, and the same models (HMMs, CRFs, BiLSTMs, Transformers) apply.",
          "Variants exist: BIOES adds E (end) and S (single-token entity), which some models find easier to learn.",
          "The example converts entity spans into BIO tags for a tokenised sentence."
        ],
        "example": "Train carriages with a label on each: \"first carriage of train A\", \"more of train A\", or \"not part of any train\", so you can see where each train begins.",
        "code": "tokens = [\"gave\", \"Asha\", \"Ravi\", \"the\", \"book\", \"in\", \"New\", \"Delhi\"]\nspans = [(\"PER\", 1, 1), (\"PER\", 2, 2), (\"LOC\", 6, 7)]     # type, first, last token\ntags = [\"O\"] * len(tokens)\nfor etype, first, last in spans:\n    tags[first] = f\"B-{etype}\"\n    for i in range(first + 1, last + 1):\n        tags[i] = f\"I-{etype}\"\nfor tok, tag in zip(tokens, tags):\n    print(f\"{tok:6} {tag}\")",
        "output": "gave   O\nAsha   B-PER\nRavi   B-PER\nthe    O\nbook   O\nin     O\nNew    B-LOC\nDelhi  I-LOC",
        "codeNotes": [
          {
            "line": 5,
            "note": "The first token of each entity gets B-."
          },
          {
            "line": 7,
            "note": "Following tokens of the same entity get I-."
          }
        ],
        "tryIt": "What would the tags be if \"Asha Ravi\" were one person's full name?",
        "check": {
          "question": "Why does BIO need B- tags instead of only I- tags?",
          "options": [
            "B is shorter",
            "To separate two adjacent entities of the same type",
            "I- tags are not allowed"
          ],
          "answer": 1,
          "why": "Without B-, \"Asha\" and \"Ravi\" would merge into one entity."
        }
      },
      {
        "title": "Valid and invalid tag sequences",
        "say": [
          "Not every sequence of BIO tags makes sense. I-PER must continue a person entity, so it must come right after B-PER or I-PER.",
          "O followed by I-PER is invalid: an entity cannot continue if it never began. B-PER followed by I-LOC is invalid too: the type changed mid-entity.",
          "Models that tag each token independently can produce such invalid sequences. Systems either repair them (treating a stray I- as a B-) or prevent them, for example with a CRF or Viterbi decoding that forbids illegal transitions.",
          "Practice 1 is valid_bio(tags): return True only if every I-X follows a B-X or I-X of the same type.",
          "Keep track of the previous tag; the start of the sentence behaves like O, so a leading I- tag is invalid.",
          "Comparing types is easy with slicing: \"I-PER\"[2:] is \"PER\".",
          "The example checks several sequences and names the first problem it finds."
        ],
        "example": "A sentence that starts with \"and then\": it continues something that was never started.",
        "code": "def first_problem(tags):\n    prev = \"O\"\n    for i, t in enumerate(tags):\n        if t.startswith(\"I-\") and (prev == \"O\" or prev[2:] != t[2:]):\n            return f\"position {i}: {t} after {prev}\"\n        prev = t\n    return \"valid\"\n\nfor tags in [[\"B-PER\", \"I-PER\", \"O\"], [\"O\", \"I-PER\"], [\"B-PER\", \"I-LOC\"], [\"I-ORG\"], [\"B-ORG\", \"B-ORG\"]]:\n    print(tags, \"->\", first_problem(tags))",
        "output": "['B-PER', 'I-PER', 'O'] -> valid\n['O', 'I-PER'] -> position 1: I-PER after O\n['B-PER', 'I-LOC'] -> position 1: I-LOC after B-PER\n['I-ORG'] -> position 0: I-ORG after O\n['B-ORG', 'B-ORG'] -> valid",
        "codeNotes": [
          {
            "line": 2,
            "note": "The start of a sentence behaves like O."
          },
          {
            "line": 4,
            "note": "I- needs a previous tag of the same type that is not O."
          }
        ],
        "tryIt": "Is [\"B-PER\", \"O\", \"I-PER\"] valid? Predict, then test.",
        "check": {
          "question": "Which sequence is valid?",
          "options": [
            "O I-LOC",
            "B-LOC I-PER",
            "B-LOC I-LOC I-LOC"
          ],
          "answer": 2,
          "why": "I-LOC correctly continues a LOC entity that began with B-LOC."
        }
      },
      {
        "title": "From tags back to entities",
        "say": [
          "Models output one tag per token, but users want entities. So we convert BIO tags back into spans.",
          "Walk through the tokens with a \"current entity\". On B-X, close any current entity and start a new one of type X. On I-X of the same type, add the token to the current entity. On O (or an I- that does not fit), close the current entity.",
          "Do not forget the last entity: when the loop ends, an entity may still be open.",
          "Practice 2 is bio_spans(tokens, tags): return (type, text) pairs, joining an entity's tokens with spaces.",
          "Getting this conversion right matters as much as the model. Many NER bugs in production are conversion bugs, such as dropping the last entity of a sentence.",
          "Real systems also keep character offsets, so entities can be highlighted in the original text.",
          "The example converts a tagged sentence with three entities, including one at the very end."
        ],
        "example": "Reading a list of highlighted words and writing each coloured phrase on its own index card.",
        "code": "def bio_spans(tokens, tags):\n    spans, cur = [], None\n    for tok, tag in zip(tokens, tags):\n        if tag.startswith(\"B-\"):\n            if cur: spans.append(cur)\n            cur = (tag[2:], [tok])\n        elif tag.startswith(\"I-\") and cur and cur[0] == tag[2:]:\n            cur[1].append(tok)\n        else:\n            if cur: spans.append(cur)\n            cur = None\n    if cur: spans.append(cur)\n    return [(t, \" \".join(words)) for t, words in spans]\n\ntoks = [\"Sundar\", \"Pichai\", \"visited\", \"New\", \"Delhi\", \"on\", \"Monday\"]\ntags = [\"B-PER\", \"I-PER\", \"O\", \"B-LOC\", \"I-LOC\", \"O\", \"B-DATE\"]\nprint(bio_spans(toks, tags))",
        "output": "[('PER', 'Sundar Pichai'), ('LOC', 'New Delhi'), ('DATE', 'Monday')]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Start a new entity on B-."
          },
          {
            "line": 12,
            "note": "Close the last entity after the loop."
          }
        ],
        "tryIt": "Delete line 12 and run again. Which entity disappears?",
        "check": {
          "question": "Why must the conversion close an open entity after the loop ends?",
          "options": [
            "To save memory",
            "An entity at the end of the sentence would otherwise be lost",
            "Python requires it"
          ],
          "answer": 1,
          "why": "The last entity is never closed by a following O or B- tag."
        }
      },
      {
        "title": "Evaluating NER",
        "say": [
          "NER is evaluated at the entity level, not the token level. Getting \"New\" right but \"Delhi\" wrong is not half a location; it is a wrong entity.",
          "An entity counts as correct only if both its span and its type exactly match a gold (human-labelled) entity.",
          "Precision = correct predicted entities / all predicted entities. Recall = correct predicted entities / all gold entities.",
          "F1 combines them as the harmonic mean: 2 * P * R / (P + R). It is high only when both are high.",
          "The standard benchmark, CoNLL-2003, uses exactly this strict matching; modern models reach F1 above 0.9 on English news.",
          "The example scores a prediction against gold entities using sets of (type, start, end) tuples.",
          "Sets make the comparison simple: the intersection is exactly the correct entities."
        ],
        "example": "Marking a spelling test word by word: a word with one wrong letter is wrong, not \"mostly right\".",
        "code": "gold = {(\"PER\", 0, 1), (\"LOC\", 3, 4), (\"DATE\", 6, 6)}\npred = {(\"PER\", 0, 1), (\"LOC\", 3, 3), (\"DATE\", 6, 6), (\"ORG\", 5, 5)}\ncorrect = gold & pred\np = len(correct) / len(pred)\nr = len(correct) / len(gold)\nf1 = 2 * p * r / (p + r)\nprint(\"correct:\", sorted(correct))\nprint(f\"precision {p:.2f}  recall {r:.2f}  F1 {f1:.2f}\")",
        "output": "correct: [('DATE', 6, 6), ('PER', 0, 1)]\nprecision 0.50  recall 0.67  F1 0.57",
        "codeNotes": [
          {
            "line": 2,
            "note": "LOC (3, 3) found only \"New\", so it does not match gold (3, 4)."
          },
          {
            "line": 6,
            "note": "F1 is the harmonic mean of precision and recall."
          }
        ],
        "tryIt": "Fix the LOC prediction to (3, 4) and remove the ORG. What is F1 now?",
        "check": {
          "question": "The model finds \"New\" as LOC but gold is \"New Delhi\". Is that entity correct?",
          "options": [
            "Yes, partly",
            "No, entity-level evaluation needs an exact span and type match",
            "Only for recall"
          ],
          "answer": 1,
          "why": "Strict entity-level scoring requires exact boundaries and type."
        }
      },
      {
        "title": "Practice time: validate and extract",
        "say": [
          "Practice 1: valid_bio(tags). Start with prev = \"O\". For each tag starting with \"I-\", fail if prev is \"O\" or prev[2:] differs from the tag's type. Update prev after each tag.",
          "Checks include a valid sequence, an entity that starts with I-, a type change, a long ORG entity and a leading I-.",
          "Practice 2: bio_spans(tokens, tags). Keep cur as None or (type, list of tokens). Handle B-, a fitting I-, and everything else, then close cur after the loop.",
          "Checks include two adjacent B-ORG entities, which must stay separate, and a sentence with no entities.",
          "After passing, try a repair function that turns an invalid leading I-X into B-X, the most common fix used in practice.",
          "These two functions sit at the end of every NER pipeline, turning model output into entities people can use.",
          "The example shows that repair."
        ],
        "example": "An editor who sees a paragraph starting with \"continued:\" and simply marks it as the start instead.",
        "code": "def repair(tags):\n    fixed, prev = [], \"O\"\n    for t in tags:\n        if t.startswith(\"I-\") and (prev == \"O\" or prev[2:] != t[2:]):\n            t = \"B-\" + t[2:]\n        fixed.append(t)\n        prev = t\n    return fixed\n\nprint(repair([\"O\", \"I-PER\", \"I-PER\", \"B-LOC\", \"I-ORG\"]))",
        "output": "['O', 'B-PER', 'I-PER', 'B-LOC', 'B-ORG']",
        "codeNotes": [
          {
            "line": 5,
            "note": "An I- tag that cannot continue anything becomes a B- tag."
          }
        ],
        "tryIt": "After repair, is the result always valid? Check it with your valid_bio.",
        "check": {
          "question": "bio_spans([\"A\", \"B\"], [\"B-ORG\", \"B-ORG\"]) returns?",
          "options": [
            "[(\"ORG\", \"A B\")]",
            "[(\"ORG\", \"A\"), (\"ORG\", \"B\")]",
            "[]"
          ],
          "answer": 1,
          "why": "Each B- starts a new entity, so there are two separate ORG entities."
        }
      }
    ],
    "summary": [
      "NER finds spans that name things and labels their type (PER, LOC, ORG, DATE...).",
      "The BIO scheme tags each token as B-TYPE, I-TYPE or O, turning NER into sequence tagging.",
      "I-X must follow B-X or I-X of the same type; invalid sequences are repaired or prevented.",
      "Convert tags back to spans carefully, closing the last entity after the loop.",
      "Evaluate at the entity level with exact span and type matches: precision, recall, F1."
    ],
    "projectStep": {
      "title": "Entity extractor for your texts",
      "steps": [
        "Hand-tag five sentences from your own data with BIO tags.",
        "Extract entities with bio_spans and check them with valid_bio.",
        "Pretend a model made two mistakes and compute entity-level precision, recall and F1."
      ]
    }
  },
  {
    "day": 12,
    "title": "Sentiment Analysis & Text Classification: Naive Bayes Log-Likelihood",
    "goal": "You can explain text classification and sentiment analysis, apply Bayes' rule with the naive independence assumption, train word probabilities with smoothing, score documents with log probabilities, and pick the best class.",
    "minutes": 30,
    "recap": "You can now tag words and extract entities. Today you label whole documents: is this review positive or negative, is this email spam, which department should this ticket go to?",
    "parts": [
      {
        "title": "Text classification",
        "say": [
          "Text classification assigns a label to a whole document: positive or negative (sentiment), spam or not spam, sports or politics or business (topic).",
          "It is supervised learning: we need training documents with known labels, and the model learns what distinguishes the classes.",
          "Sentiment analysis is a popular case. Companies use it to track opinions in reviews and social media, and to route angry support messages first.",
          "Naive Bayes is a classic, fast and surprisingly strong classifier for text. It was the heart of early spam filters and is still a great baseline to beat.",
          "It works with the bag-of-words idea from Day 4: which words appear, not their order.",
          "The example shows a tiny labelled training set and the vocabulary of each class.",
          "Always start a classification project with a simple baseline like Naive Bayes; it tells you how hard the problem really is."
        ],
        "example": "Sorting post into \"bills\" and \"letters from friends\" by glancing at a few telltale words, without reading every line.",
        "code": "train = [(\"great fun great acting\", \"pos\"), (\"fun and moving\", \"pos\"),\n         (\"boring plot\", \"neg\"), (\"boring and dull acting\", \"neg\")]\nwords = {\"pos\": [], \"neg\": []}\nfor text, label in train:\n    words[label] += text.split()\nfor label, ws in words.items():\n    print(label, sorted(set(ws)))",
        "output": "pos ['acting', 'and', 'fun', 'great', 'moving']\nneg ['acting', 'and', 'boring', 'dull', 'plot']",
        "codeNotes": [
          {
            "line": 5,
            "note": "Collect every word seen in each class."
          }
        ],
        "tryIt": "Which words appear in both classes? Will they help the classifier?",
        "check": {
          "question": "What does text classification need to learn from?",
          "options": [
            "Unlabelled documents only",
            "Documents with known labels",
            "A dictionary"
          ],
          "answer": 1,
          "why": "Classification is supervised: it learns from labelled examples."
        }
      },
      {
        "title": "Bayes' rule and the naive assumption",
        "say": [
          "Bayes' rule flips a conditional probability: P(class | document) is proportional to P(class) * P(document | class).",
          "P(class) is the prior: how common each class is, for example 30 percent of emails are spam.",
          "P(document | class) is the likelihood: how probable these words are if the document belongs to the class.",
          "Estimating the probability of a whole document is impossible directly; every document is unique. So Naive Bayes assumes words are independent given the class.",
          "Then P(document | class) = P(word1 | class) * P(word2 | class) * ... This assumption is \"naive\" because it is obviously false (\"New\" and \"York\" are not independent), yet the classifier still works well.",
          "We pick the class with the highest P(class) times the product of word likelihoods.",
          "Notice that the denominator of Bayes' rule, P(document), is the same for every class, so we can ignore it when we only want the winning class. That is why we say \"proportional to\".",
          "The example computes these products for a short review and two classes."
        ],
        "example": "A doctor guessing an illness: how common the illness is, times how typical each symptom is for it, treating symptoms as separate clues.",
        "code": "prior = {\"pos\": 0.5, \"neg\": 0.5}\nlike = {\"pos\": {\"great\": 0.3, \"fun\": 0.2, \"boring\": 0.01},\n        \"neg\": {\"great\": 0.02, \"fun\": 0.03, \"boring\": 0.4}}\nreview = [\"great\", \"fun\"]\nfor c in prior:\n    score = prior[c]\n    for w in review:\n        score *= like[c][w]\n    print(c, round(score, 6))",
        "output": "pos 0.03\nneg 0.0003",
        "codeNotes": [
          {
            "line": 8,
            "note": "The naive assumption: multiply one probability per word."
          }
        ],
        "tryIt": "Score the review [\"boring\", \"fun\"]. Which class wins?",
        "check": {
          "question": "What is \"naive\" about Naive Bayes?",
          "options": [
            "It ignores the prior",
            "It assumes words are independent given the class",
            "It only works for two classes"
          ],
          "answer": 1,
          "why": "Treating words as independent is the simplifying, naive assumption."
        }
      },
      {
        "title": "Training: counting words per class",
        "say": [
          "Training Naive Bayes is just counting, which is why it is so fast.",
          "The prior for a class is the share of training documents with that label.",
          "The likelihood P(word | class) is the count of the word in that class's documents divided by the total word count of the class.",
          "Unseen words cause the zero problem again (Day 3): a single word never seen in \"pos\" training would make the whole positive score 0.",
          "So we smooth with Laplace: (count + 1) / (total words in class + vocabulary size).",
          "Training on millions of documents takes seconds, and adding new training data only means updating counts.",
          "The example trains priors and smoothed likelihoods from the tiny training set."
        ],
        "example": "Learning which words each friend overuses by keeping a tally of their messages, then using the tally to guess who sent an unsigned note.",
        "code": "from collections import Counter\n\ntrain = [(\"great fun great acting\", \"pos\"), (\"fun and moving\", \"pos\"),\n         (\"boring plot\", \"neg\"), (\"boring and dull acting\", \"neg\")]\nlabels = Counter(label for _, label in train)\ncounts = {c: Counter() for c in labels}\nfor text, label in train:\n    counts[label].update(text.split())\nvocab = {w for c in counts.values() for w in c}\nprior = {c: n / len(train) for c, n in labels.items()}\ndef likelihood(w, c):\n    return (counts[c][w] + 1) / (sum(counts[c].values()) + len(vocab))\nprint(\"priors:\", prior)\nfor w in [\"great\", \"boring\", \"acting\", \"wonderful\"]:\n    print(f\"{w:9} pos {likelihood(w, 'pos'):.3f}  neg {likelihood(w, 'neg'):.3f}\")",
        "output": "priors: {'pos': 0.5, 'neg': 0.5}\ngreat     pos 0.200  neg 0.071\nboring    pos 0.067  neg 0.214\nacting    pos 0.133  neg 0.143\nwonderful pos 0.067  neg 0.071",
        "codeNotes": [
          {
            "line": 10,
            "note": "Prior: share of documents per class."
          },
          {
            "line": 12,
            "note": "Laplace-smoothed P(word | class)."
          }
        ],
        "tryIt": "Why does \"acting\" have similar likelihoods in both classes? Is it useful for classification?",
        "check": {
          "question": "Why smooth the word likelihoods?",
          "options": [
            "To make training faster",
            "An unseen word would otherwise give the whole class probability 0",
            "To remove stopwords"
          ],
          "answer": 1,
          "why": "Smoothing keeps unseen words from zeroing out a class."
        }
      },
      {
        "title": "Working in log space",
        "say": [
          "Multiplying hundreds of small probabilities quickly produces numbers too small for a computer to represent. They underflow to exactly 0.0, and every class ties.",
          "The fix is logarithms. log(a * b) = log(a) + log(b), so instead of multiplying probabilities we add their logs.",
          "Logs of probabilities are negative numbers, and sums of them stay in a comfortable range even for very long documents.",
          "Because log is increasing, the class with the highest log score is also the class with the highest probability, so the decision does not change.",
          "Practice 1 is nb_log_score(log_prior, log_likelihoods): the log prior plus the sum of the log likelihoods, rounded to 4 decimals.",
          "This log-space trick is used everywhere in NLP: language models, HMMs, Viterbi and neural network training all use it.",
          "The example shows a product underflowing to 0 while the log sum stays usable."
        ],
        "example": "Measuring earthquakes on the Richter scale: huge ranges of energy become manageable numbers you can add and compare.",
        "code": "import math\n\nprobs = [0.001] * 400\nproduct = 1.0\nfor p in probs:\n    product *= p\nprint(\"product:\", product)\nprint(\"sum of logs:\", round(sum(math.log(p) for p in probs), 2))",
        "output": "product: 0.0\nsum of logs: -2763.1",
        "codeNotes": [
          {
            "line": 7,
            "note": "0.001 to the power 400 is far below the smallest float, so it becomes 0.0."
          },
          {
            "line": 8,
            "note": "The same information as a sum of logs."
          }
        ],
        "tryIt": "Compare two classes with probabilities [0.002] * 400 and [0.001] * 400 using log sums. Which wins?",
        "check": {
          "question": "Why add log probabilities instead of multiplying probabilities?",
          "options": [
            "Addition is more accurate for integers",
            "Products of many small probabilities underflow to 0",
            "Logs make probabilities positive"
          ],
          "answer": 1,
          "why": "Log sums avoid underflow while preserving which class scores highest."
        }
      },
      {
        "title": "Classifying and evaluating",
        "say": [
          "To classify, compute each class's log score and pick the highest. That is Practice 2: nb_classify(tokens, priors, likelihoods, unknown).",
          "Words a class has never seen use a small unknown probability, standing in for proper smoothing, so they never produce log(0).",
          "Ties should be broken predictably; here the alphabetically first class wins.",
          "Evaluate on a held-out test set that was not used for training. Accuracy is the share of correct labels, but for unbalanced classes (1 percent spam) look at precision and recall per class too.",
          "A confusion matrix, counting each (true label, predicted label) pair, shows exactly which classes get mixed up.",
          "Naive Bayes struggles with negation (\"not good\" looks positive because of \"good\") and with word order. Adding bigrams such as \"not_good\" helps a lot.",
          "Keep the test set untouched until the end. If you tune the model while looking at test results, the test score stops being an honest estimate of how the model will do on new text.",
          "The example classifies test reviews and builds a confusion matrix."
        ],
        "example": "A new sorting machine tested on a fresh sack of letters it has never seen, with a tally of which pigeonholes it confuses.",
        "code": "import math\nfrom collections import Counter\n\npriors = {\"neg\": 0.5, \"pos\": 0.5}\nlike = {\"pos\": {\"great\": 0.3, \"fun\": 0.2, \"boring\": 0.01, \"good\": 0.2},\n        \"neg\": {\"great\": 0.02, \"fun\": 0.03, \"boring\": 0.4, \"good\": 0.05}}\ndef classify(tokens):\n    score = lambda c: math.log(priors[c]) + sum(math.log(like[c].get(w, 1e-6)) for w in tokens)\n    return min(priors, key=lambda c: (-score(c), c))\ntest = [(\"great fun\", \"pos\"), (\"boring\", \"neg\"), (\"not good\", \"neg\"), (\"fun but boring boring\", \"neg\")]\nconfusion = Counter((truth, classify(text.split())) for text, truth in test)\nprint(\"confusion (truth, predicted):\", dict(confusion))\nprint(\"accuracy:\", sum(n for (t, p), n in confusion.items() if t == p) / len(test))",
        "output": "confusion (truth, predicted): {('pos', 'pos'): 1, ('neg', 'neg'): 2, ('neg', 'pos'): 1}\naccuracy: 0.75",
        "codeNotes": [
          {
            "line": 9,
            "note": "Highest log score; ties by class name."
          },
          {
            "line": 11,
            "note": "Count (true, predicted) pairs."
          }
        ],
        "tryIt": "Which test review is misclassified, and what feature would fix it?",
        "check": {
          "question": "A spam filter is 99 percent accurate, but 1 percent of emails are spam and it never flags any. What is wrong?",
          "options": [
            "Nothing, 99 percent is great",
            "Accuracy hides that recall for spam is 0",
            "The prior is too high"
          ],
          "answer": 1,
          "why": "With unbalanced classes, check precision and recall per class, not just accuracy."
        }
      },
      {
        "title": "Practice time: score and classify",
        "say": [
          "Practice 1: nb_log_score(log_prior, log_likelihoods). One line: log_prior + sum(log_likelihoods), rounded to 4 decimals. With no words, the score is just the prior.",
          "Practice 2: nb_classify(tokens, priors, likelihoods, unknown=1e-6). For each class, score = math.log(prior) + sum of math.log(likelihood or unknown). Return the best class.",
          "Using min with the key (-score, class) finds the highest score and breaks ties alphabetically.",
          "The checks include a positive review, a negative one with repeated words, and an empty document where only the priors decide.",
          "Remember likelihoods[c].get(w, unknown), so unseen words never cause log(0), which raises an error in Python.",
          "After passing, train your own likelihoods from a small labelled set with Laplace smoothing and classify new sentences.",
          "The example shows the error that the unknown default prevents."
        ],
        "example": "A fallback plan written in advance: if a clue is missing, you use a tiny default value instead of stopping the investigation.",
        "code": "import math\n\ntry:\n    math.log(0)\nexcept ValueError as err:\n    print(\"log(0):\", err)\nprint(\"log of the unknown default:\", round(math.log(1e-6), 2))",
        "output": "log(0): math domain error\nlog of the unknown default: -13.82",
        "codeNotes": [
          {
            "line": 4,
            "note": "The logarithm of zero is undefined, so Python raises ValueError."
          }
        ],
        "tryIt": "How much does one unknown word lower a class's log score? Is that a strong or weak penalty?",
        "check": {
          "question": "nb_classify([], {\"a\": 0.3, \"b\": 0.7}, {\"a\": {}, \"b\": {}}) returns?",
          "options": [
            "\"a\"",
            "\"b\"",
            "None"
          ],
          "answer": 1,
          "why": "With no words, the class with the larger prior wins."
        }
      }
    ],
    "summary": [
      "Text classification labels whole documents; it learns from labelled examples.",
      "Naive Bayes: P(class | doc) ∝ P(class) × product of P(word | class), assuming word independence.",
      "Training is counting: class priors and Laplace-smoothed word likelihoods.",
      "Add log probabilities to avoid underflow; the best class is unchanged.",
      "Evaluate on held-out data with a confusion matrix and per-class precision and recall."
    ],
    "projectStep": {
      "title": "Sentiment classifier for your reviews",
      "steps": [
        "Label 20 short reviews as positive or negative.",
        "Train priors and smoothed likelihoods, and classify five new reviews with log scores.",
        "Build a confusion matrix and try adding \"not_\" bigrams to fix negation errors."
      ]
    }
  },
  {
    "day": 13,
    "title": "Recurrent Neural Networks (RNNs): Hidden State Recurrence & Vanishing Gradients",
    "goal": "You can explain why sequences need memory, how a recurrent neural network updates a hidden state with tanh, run an RNN over a sequence by hand, and describe the vanishing and exploding gradient problems.",
    "minutes": 30,
    "recap": "Naive Bayes ignores word order, so \"not good\" and \"good, not bad\" look alike. Today you meet recurrent neural networks, which read text one word at a time and remember what came before.",
    "parts": [
      {
        "title": "Why order and memory matter",
        "say": [
          "Language is sequential. \"The dog bit the man\" and \"the man bit the dog\" contain the same words with very different meanings.",
          "Bag-of-words models throw order away. N-grams keep a little, but only over a short fixed window.",
          "A recurrent neural network (RNN) reads a sequence one element at a time and keeps a hidden state: a vector that summarises everything read so far.",
          "At each step it combines the previous hidden state with the new input to produce the next hidden state. The same weights are reused at every step.",
          "Because of that reuse, an RNN can read sequences of any length with a fixed number of parameters.",
          "The example shows a toy \"memory\" that accumulates what it has seen, the basic idea of a hidden state.",
          "RNNs were the leading approach to language before Transformers (Day 18), and they explain why Transformers were such a breakthrough."
        ],
        "example": "Reading a story: you do not remember every word, but you carry a running sense of what has happened, updated with each new sentence.",
        "code": "def read(words):\n    memory = []\n    for w in words:\n        memory = (memory + [w])[-3:]      # keep a short summary of the recent past\n        print(f\"read {w!r:7} memory {memory}\")\n\nread([\"the\", \"movie\", \"was\", \"not\", \"good\"])",
        "output": "read 'the'   memory ['the']\nread 'movie' memory ['the', 'movie']\nread 'was'   memory ['the', 'movie', 'was']\nread 'not'   memory ['movie', 'was', 'not']\nread 'good'  memory ['was', 'not', 'good']",
        "codeNotes": [
          {
            "line": 4,
            "note": "A crude memory: the last three words. An RNN learns a much richer summary vector."
          }
        ],
        "tryIt": "Change the memory size to 2. Would \"not\" still be remembered when \"good\" arrives?",
        "check": {
          "question": "What is an RNN's hidden state?",
          "options": [
            "The final output only",
            "A vector summarising the sequence read so far",
            "The list of all words"
          ],
          "answer": 1,
          "why": "The hidden state is the network's running memory."
        }
      },
      {
        "title": "The RNN update",
        "say": [
          "The core RNN equation is h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b).",
          "h_{t-1} is the previous hidden state, x_t is the current input (for text, a word embedding), W_hh and W_xh are learned weights, and b is a bias.",
          "tanh squashes any number into the range -1 to 1. That keeps the hidden state bounded, so values do not grow without limit as the sequence goes on.",
          "In real networks h, x and b are vectors and the Ws are matrices. To see the mechanics clearly, we use single numbers.",
          "Practice 1 is rnn_step(w_hh, h_prev, w_xh, x, b): one update with math.tanh, rounded to 4 decimals.",
          "The weights are learned by training (backpropagation through time), adjusting them so the final hidden state is useful, for example for predicting sentiment.",
          "The example shows tanh squashing a range of values."
        ],
        "example": "A thermostat that blends yesterday's setting with today's reading, then clips the result to a safe range.",
        "code": "import math\n\nfor z in [-5, -1, -0.5, 0, 0.5, 1, 5]:\n    print(f\"tanh({z:4}) = {math.tanh(z):7.4f}\")\n\ndef rnn_step(w_hh, h_prev, w_xh, x, b):\n    return round(math.tanh(w_hh * h_prev + w_xh * x + b), 4)\nprint(\"one step:\", rnn_step(0.5, 0.2, 1.0, 0.3, 0.1))",
        "output": "tanh(  -5) = -0.9999\ntanh(  -1) = -0.7616\ntanh(-0.5) = -0.4621\ntanh(   0) =  0.0000\ntanh( 0.5) =  0.4621\ntanh(   1) =  0.7616\ntanh(   5) =  0.9999\none step: 0.4621",
        "codeNotes": [
          {
            "line": 4,
            "note": "Large inputs saturate at -1 or 1."
          },
          {
            "line": 7,
            "note": "Old state and new input, mixed by weights, squashed by tanh."
          }
        ],
        "tryIt": "Compute rnn_step(0.5, 0.2, 1.0, 0.3, 0.1) by hand: the sum inside tanh is 0.5. Check with the code.",
        "check": {
          "question": "Why does an RNN apply tanh?",
          "options": [
            "To make numbers integers",
            "To keep the hidden state between -1 and 1 as the sequence grows",
            "To delete old information"
          ],
          "answer": 1,
          "why": "tanh bounds the state so it cannot grow without limit."
        }
      },
      {
        "title": "Running an RNN over a sequence",
        "say": [
          "To process a sentence, start with h = 0 and apply the step once per input, feeding each new h into the next step.",
          "The final hidden state summarises the whole sequence. A classifier layer on top can turn it into a sentiment prediction.",
          "For tagging tasks (Days 10-11), we use the hidden state at every step, one prediction per word.",
          "Because each step depends on the previous one, an RNN must process words in order; it cannot work on all positions in parallel. That makes it slow on modern hardware, one of the reasons Transformers replaced it.",
          "The example runs a one-number RNN over a sequence of inputs and prints the state after each step.",
          "Watch how an early input keeps influencing later states, but more and more faintly.",
          "That fading is the heart of the problem you will meet next."
        ],
        "example": "Passing a message down a line of people: each one hears it, adds their own bit, and passes it on.",
        "code": "import math\n\nw_hh, w_xh, b = 0.5, 1.0, 0.0\ninputs = [1.0, 0.0, 0.0, 0.0, 0.0]\nh = 0.0\nfor t, x in enumerate(inputs, 1):\n    h = math.tanh(w_hh * h + w_xh * x + b)\n    print(f\"step {t}: input {x}  hidden {h:.4f}\")",
        "output": "step 1: input 1.0  hidden 0.7616\nstep 2: input 0.0  hidden 0.3634\nstep 3: input 0.0  hidden 0.1797\nstep 4: input 0.0  hidden 0.0896\nstep 5: input 0.0  hidden 0.0448",
        "codeNotes": [
          {
            "line": 7,
            "note": "The same weights are used at every step."
          }
        ],
        "tryIt": "Set w_hh to 0.9. Does the first input's influence last longer?",
        "check": {
          "question": "Why can an RNN not process all words of a sentence at once in parallel?",
          "options": [
            "It has too few weights",
            "Each step needs the previous hidden state",
            "GPUs do not support tanh"
          ],
          "answer": 1,
          "why": "Sequential dependence forces step-by-step processing."
        }
      },
      {
        "title": "Vanishing and exploding gradients",
        "say": [
          "Training an RNN means sending error signals backwards through every time step. At each step, the signal is multiplied by roughly the same factor.",
          "If that factor is below 1, the signal shrinks exponentially: after 20 steps, 0.5 to the power 20 is about one millionth. Early words get almost no learning signal. This is the vanishing gradient problem.",
          "If the factor is above 1, the signal grows exponentially and explodes, producing huge, unstable updates. This is the exploding gradient problem.",
          "Vanishing gradients mean a plain RNN struggles to learn long-range links, such as a subject at the start of a long sentence agreeing with a verb at the end.",
          "Exploding gradients are usually fixed with gradient clipping: if the gradient is too big, scale it down. Vanishing needs a new architecture: LSTMs and GRUs, tomorrow.",
          "Practice 2 is gradient_after(factor, steps): factor ** steps rounded to 6 decimals, labelled VANISHING below 0.001, EXPLODING above 1000, otherwise STABLE.",
          "The example prints how quickly both problems appear."
        ],
        "example": "A whisper game over a long line: with each person the message gets fainter (vanishing), or someone shouts and it becomes distorted noise (exploding).",
        "code": "for factor in [0.5, 0.9, 1.1, 1.5]:\n    row = [f\"{factor ** steps:.2e}\" for steps in (5, 20, 50)]\n    print(f\"factor {factor}: after 5, 20, 50 steps -> {row}\")",
        "output": "factor 0.5: after 5, 20, 50 steps -> ['3.12e-02', '9.54e-07', '8.88e-16']\nfactor 0.9: after 5, 20, 50 steps -> ['5.90e-01', '1.22e-01', '5.15e-03']\nfactor 1.1: after 5, 20, 50 steps -> ['1.61e+00', '6.73e+00', '1.17e+02']\nfactor 1.5: after 5, 20, 50 steps -> ['7.59e+00', '3.33e+03', '6.38e+08']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Repeated multiplication by the same factor."
          }
        ],
        "tryIt": "Which factor stays closest to 1 after 50 steps? Why is exactly 1 hard to keep during training?",
        "check": {
          "question": "What does the vanishing gradient problem cause?",
          "options": [
            "Training becomes faster",
            "Early inputs in long sequences get almost no learning signal",
            "The model runs out of memory"
          ],
          "answer": 1,
          "why": "Shrinking gradients stop the network learning long-range dependencies."
        }
      },
      {
        "title": "Gradient clipping and what comes next",
        "say": [
          "Gradient clipping is a simple, standard fix for exploding gradients: if the size (norm) of the gradient exceeds a threshold, rescale it to that threshold, keeping its direction.",
          "It is used not only for RNNs but for training almost every large model, including Transformers.",
          "Vanishing gradients cannot be clipped away, because the signal is too small, not too big.",
          "The fix is to give the network a path where information can flow through many steps without being squashed each time. That is the idea of the LSTM's cell state and the GRU's update gate.",
          "Other helpful tricks include careful weight initialisation and shorter sequences, but gated units were the big breakthrough.",
          "The example clips a few gradient vectors to a maximum norm of 5.",
          "Tomorrow's LSTM lesson builds directly on this problem."
        ],
        "example": "A speed limiter on a car: it does not change where you are going, only how fast you can get there.",
        "code": "import math\n\ndef clip(grad, max_norm):\n    norm = math.sqrt(sum(g * g for g in grad))\n    if norm <= max_norm:\n        return grad\n    return [round(g * max_norm / norm, 4) for g in grad]\n\nfor g in [[1.0, 2.0], [30.0, 40.0], [300.0, -400.0]]:\n    print(g, \"->\", clip(g, 5.0))",
        "output": "[1.0, 2.0] -> [1.0, 2.0]\n[30.0, 40.0] -> [3.0, 4.0]\n[300.0, -400.0] -> [3.0, -4.0]",
        "codeNotes": [
          {
            "line": 7,
            "note": "Scale down so the norm equals max_norm; the direction is unchanged."
          }
        ],
        "tryIt": "Check that the clipped vectors really have length 5.",
        "check": {
          "question": "What does gradient clipping fix?",
          "options": [
            "Vanishing gradients",
            "Exploding gradients",
            "Out-of-vocabulary words"
          ],
          "answer": 1,
          "why": "Clipping limits overly large gradients; it cannot restore vanished ones."
        }
      },
      {
        "title": "Practice time: RNN steps and gradients",
        "say": [
          "Practice 1: rnn_step(w_hh, h_prev, w_xh, x, b). Compute the weighted sum, apply math.tanh, round to 4 decimals.",
          "The checks include all zeros (giving 0.0), a normal step, a saturated step that returns 1.0, and a negative state.",
          "Practice 2: gradient_after(factor, steps). Compute g = factor ** steps, choose the status from abs(g), and return the dictionary with g rounded to 6 decimals.",
          "Order the checks: below 0.001 is VANISHING, above 1000 is EXPLODING, anything else STABLE.",
          "Use abs(g) so that negative factors (possible in real networks) are judged by size.",
          "After passing, use gradient_after to find how many steps it takes for factor 0.9 to vanish. That number is roughly how far back a plain RNN can learn.",
          "The example finds that number with a loop."
        ],
        "example": "Counting how many photocopies of a photocopy you can make before the picture becomes unreadable.",
        "code": "factor, steps = 0.9, 0\nwhile factor ** steps >= 0.001:\n    steps += 1\nprint(\"0.9 vanishes below 0.001 after\", steps, \"steps\")\nprint(\"0.5 vanishes after\", next(s for s in range(1, 100) if 0.5 ** s < 0.001), \"steps\")",
        "output": "0.9 vanishes below 0.001 after 66 steps\n0.5 vanishes after 10 steps",
        "codeNotes": [
          {
            "line": 2,
            "note": "Keep multiplying until the signal drops below the threshold."
          }
        ],
        "tryIt": "How many steps for factor 0.99? What does that suggest about the effective memory of the network?",
        "check": {
          "question": "gradient_after(1.5, 20) gives which status?",
          "options": [
            "VANISHING",
            "STABLE",
            "EXPLODING"
          ],
          "answer": 2,
          "why": "1.5 ** 20 is over 3,000, which is above 1,000."
        }
      }
    ],
    "summary": [
      "RNNs read sequences step by step and carry a hidden state as memory.",
      "The update is h_t = tanh(W_hh h_{t-1} + W_xh x_t + b), with the same weights at every step.",
      "Sequential processing makes RNNs slow to parallelise.",
      "Gradients multiplied over many steps vanish (factor < 1) or explode (factor > 1).",
      "Clipping fixes exploding gradients; vanishing gradients need gated units like LSTMs."
    ],
    "projectStep": {
      "title": "Hand-run an RNN",
      "steps": [
        "Choose weights and run rnn_step over a sequence of ten inputs.",
        "Plot (or print) how much the first input still affects the last state for different w_hh values.",
        "Use gradient_after to estimate the memory length for three factors."
      ]
    }
  },
  {
    "day": 14,
    "title": "Gated Memory Cells: Long Short-Term Memory (LSTM) & GRU Networks",
    "goal": "You can explain how LSTM gates control memory, compute a forget-input-output step and the cell state update, describe how the GRU simplifies it, and explain why gates fix vanishing gradients.",
    "minutes": 30,
    "recap": "Yesterday plain RNNs forgot early inputs because gradients vanished. The Long Short-Term Memory network (LSTM) adds gates that decide what to keep, what to write and what to show.",
    "parts": [
      {
        "title": "Gates: learned valves",
        "say": [
          "The LSTM, introduced by Hochreiter and Schmidhuber in 1997, adds a cell state: a separate memory lane that runs through the sequence with only small, controlled changes.",
          "Gates control that lane. A gate is a number between 0 and 1, produced by a sigmoid function, that multiplies information: 0 blocks it completely, 1 lets it all through.",
          "The sigmoid squashes any number into 0 to 1, which is exactly what a valve needs, while tanh (range -1 to 1) is used for the content itself.",
          "Each gate looks at the current input and the previous hidden state and decides, with its own learned weights, how open to be.",
          "The LSTM has three gates: the forget gate, the input gate and the output gate.",
          "The example prints the sigmoid function for a range of inputs, the shape every gate uses.",
          "Think of gates as learned rules like \"when you see a new sentence subject, forget the old one\"."
        ],
        "example": "Taps on a water tank: one lets old water drain, one lets new water in, and one decides how much flows out to the garden.",
        "code": "import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\nfor z in [-6, -2, 0, 2, 6]:\n    g = sigmoid(z)\n    state = \"closed\" if g < 0.1 else (\"open\" if g > 0.9 else \"partly open\")\n    print(f\"sigmoid({z:2}) = {g:.4f}  gate {state}\")",
        "output": "sigmoid(-6) = 0.0025  gate closed\nsigmoid(-2) = 0.1192  gate partly open\nsigmoid( 0) = 0.5000  gate partly open\nsigmoid( 2) = 0.8808  gate partly open\nsigmoid( 6) = 0.9975  gate open",
        "codeNotes": [
          {
            "line": 4,
            "note": "Sigmoid maps any number into 0 to 1."
          }
        ],
        "tryIt": "What is sigmoid(0)? Why is that a sensible \"undecided\" value for a gate?",
        "check": {
          "question": "What range do LSTM gate values take?",
          "options": [
            "-1 to 1",
            "0 to 1",
            "Any number"
          ],
          "answer": 1,
          "why": "Gates use the sigmoid function, whose output is between 0 and 1."
        }
      },
      {
        "title": "The forget and input gates",
        "say": [
          "The forget gate f decides how much of the old cell state to keep. f = 1 keeps everything; f = 0 erases it.",
          "The input gate i decides how much new information to write. The new information itself is the candidate c̃ (c-tilde), computed with tanh from the input and previous hidden state.",
          "The cell state update is: c_t = f * c_{t-1} + i * c̃.",
          "This is the crucial line. The old memory is multiplied by f, not squashed through tanh at every step. If the network learns f close to 1, information and gradients can flow across many steps almost unchanged.",
          "Practice 1 is lstm_cell(f, c_prev, i, c_candidate): that update, rounded to 4 decimals.",
          "Real LSTMs apply this to every entry of a vector at once, so each memory slot has its own gate values.",
          "The example runs the update in three situations: keep, overwrite, and blend."
        ],
        "example": "A notebook where each day you decide how much of yesterday's notes to keep, and how much of today's news to add.",
        "code": "def lstm_cell(f, c_prev, i, c_candidate):\n    return round(f * c_prev + i * c_candidate, 4)\n\nprint(\"keep memory, ignore input:\", lstm_cell(1.0, 0.8, 0.0, 0.5))\nprint(\"forget, write new:\", lstm_cell(0.0, 0.8, 1.0, 0.5))\nprint(\"blend:\", lstm_cell(0.9, 0.5, 0.3, -0.2))",
        "output": "keep memory, ignore input: 0.8\nforget, write new: 0.5\nblend: 0.39",
        "codeNotes": [
          {
            "line": 2,
            "note": "Old memory scaled by the forget gate, plus new content scaled by the input gate."
          }
        ],
        "tryIt": "Run the \"keep\" case for 50 steps in a loop. Does the memory fade? Compare with the RNN yesterday.",
        "check": {
          "question": "What does a forget gate value of 1.0 mean?",
          "options": [
            "Erase the memory",
            "Keep the old cell state completely",
            "Ignore the input"
          ],
          "answer": 1,
          "why": "f = 1 multiplies the old cell state by 1, keeping it."
        }
      },
      {
        "title": "The output gate and hidden state",
        "say": [
          "The cell state is the long-term memory. The hidden state h is what the LSTM shows to the rest of the network at each step.",
          "The output gate o decides how much of the memory to reveal: h_t = o * tanh(c_t).",
          "So an LSTM can remember something for a long time (in c) without exposing it until it becomes relevant (when o opens).",
          "Putting it together, each step computes f, i, o and c̃ from the input and previous h, updates c, then computes h.",
          "The example runs a full one-number LSTM step with fixed gate values, so you can follow every quantity.",
          "Over a sequence, the same weights compute different gate values at every step, because the inputs differ.",
          "LSTMs held the state of the art in translation, speech recognition and language modelling for most of the 2010s."
        ],
        "example": "A diary you write in every day but only read aloud from when someone asks the right question.",
        "code": "import math\n\ndef lstm_step(c_prev, f, i, o, c_candidate):\n    c = f * c_prev + i * c_candidate\n    h = o * math.tanh(c)\n    return round(c, 4), round(h, 4)\n\nc = 0.0\nfor t, (f, i, o, cand) in enumerate([(0.0, 1.0, 0.1, 0.9), (1.0, 0.0, 0.1, 0.0), (1.0, 0.0, 1.0, 0.0)], 1):\n    c, h = lstm_step(c, f, i, o, cand)\n    print(f\"step {t}: cell {c}  hidden {h}\")",
        "output": "step 1: cell 0.9  hidden 0.0716\nstep 2: cell 0.9  hidden 0.0716\nstep 3: cell 0.9  hidden 0.7163",
        "codeNotes": [
          {
            "line": 5,
            "note": "The output gate decides how much memory to reveal."
          },
          {
            "line": 9,
            "note": "Write at step 1, hold at step 2, reveal at step 3."
          }
        ],
        "tryIt": "At step 2 the memory is still 0.9 but the hidden state is small. Why?",
        "check": {
          "question": "What does the output gate control?",
          "options": [
            "How much old memory is erased",
            "How much of the cell state is exposed as the hidden state",
            "The learning rate"
          ],
          "answer": 1,
          "why": "h = o × tanh(c): the output gate decides how much memory to show."
        }
      },
      {
        "title": "The GRU: fewer gates",
        "say": [
          "The gated recurrent unit (GRU), proposed by Cho and colleagues in 2014, simplifies the LSTM.",
          "It merges the cell state and hidden state into one, and uses two gates: an update gate z and a reset gate r.",
          "The update is h_t = (1 - z) * h_{t-1} + z * h̃, where h̃ is the candidate state. z blends old and new: z = 0 keeps the old state, z = 1 takes the new one.",
          "The reset gate decides how much of the old state to use when computing the candidate.",
          "Practice 2 is gru_update(z, h_prev, h_candidate), which also accepts lists and applies the formula element by element.",
          "GRUs have fewer parameters and train a little faster; LSTMs sometimes do slightly better on long sequences. In practice they perform similarly, and people try both.",
          "The example blends old and new states with several z values."
        ],
        "example": "A dimmer switch between yesterday's mood and today's news: slide it one way to stay the same, the other way to change completely.",
        "code": "def gru_update(z, h_prev, h_candidate):\n    if isinstance(h_prev, list):\n        return [gru_update(z, a, b) for a, b in zip(h_prev, h_candidate)]\n    return round((1 - z) * h_prev + z * h_candidate, 4)\n\nfor z in [0.0, 0.25, 0.5, 1.0]:\n    print(f\"z = {z}: {gru_update(z, 0.8, 0.4)}\")\nprint(\"vectors:\", gru_update(0.5, [1.0, 0.0], [0.0, 1.0]))",
        "output": "z = 0.0: 0.8\nz = 0.25: 0.7\nz = 0.5: 0.6\nz = 1.0: 0.4\nvectors: [0.5, 0.5]",
        "codeNotes": [
          {
            "line": 3,
            "note": "For lists, apply the scalar formula to each pair."
          },
          {
            "line": 4,
            "note": "z blends old and new."
          }
        ],
        "tryIt": "How does the GRU's (1 - z) * h + z * h̃ compare with the LSTM's f * c + i * c̃? What constraint does the GRU add?",
        "check": {
          "question": "In a GRU, what does an update gate z = 0 do?",
          "options": [
            "Replaces the state with the candidate",
            "Keeps the previous state unchanged",
            "Resets everything to 0"
          ],
          "answer": 1,
          "why": "With z = 0, h_t = h_{t-1}."
        }
      },
      {
        "title": "Why gates fix vanishing gradients",
        "say": [
          "In a plain RNN, the path from an early step to a late one goes through tanh and a weight at every step, and the gradient shrinks each time.",
          "In an LSTM, the cell state path is mostly just multiplication by the forget gate. If f stays near 1, the gradient along that path stays near 1 too.",
          "That additive, gated path is sometimes called the constant error carousel: error signals ride along it without fading.",
          "The network learns when to keep f near 1 (to remember) and when to drop it (to forget), so it controls its own memory length.",
          "The same idea, giving information a direct path around transformations, reappears in the residual connections of Transformers and deep image networks.",
          "The example compares how much of an early signal survives 30 steps in a plain RNN versus through a forget gate of 0.97.",
          "This is why LSTMs can learn dependencies across dozens or hundreds of steps where plain RNNs manage only a few."
        ],
        "example": "An express lane on a motorway: most traffic weaves through junctions and slows down, but the express lane carries through traffic straight to the end.",
        "code": "steps = 30\nrnn_factor = 0.5          # typical shrink per step through tanh and weights\nforget_gate = 0.97        # an LSTM that has learned to remember\nprint(f\"plain RNN signal after {steps} steps: {rnn_factor ** steps:.2e}\")\nprint(f\"LSTM cell path after {steps} steps: {forget_gate ** steps:.4f}\")",
        "output": "plain RNN signal after 30 steps: 9.31e-10\nLSTM cell path after 30 steps: 0.4010",
        "codeNotes": [
          {
            "line": 4,
            "note": "Almost nothing survives."
          },
          {
            "line": 5,
            "note": "Most of the signal is still there."
          }
        ],
        "tryIt": "What forget gate value keeps at least half the signal after 100 steps?",
        "check": {
          "question": "Why do LSTMs suffer less from vanishing gradients?",
          "options": [
            "They have more layers",
            "The cell state path is gated addition, so signals are not squashed at every step",
            "They use ReLU"
          ],
          "answer": 1,
          "why": "A forget gate near 1 lets gradients flow across many steps."
        }
      },
      {
        "title": "Practice time: cells and updates",
        "say": [
          "Practice 1: lstm_cell(f, c_prev, i, c_candidate). One line: f * c_prev + i * c_candidate, rounded to 4 decimals.",
          "The checks cover keeping memory (f = 1, i = 0), overwriting it (f = 0, i = 1), and a blend with a negative candidate.",
          "Practice 2: gru_update(z, h_prev, h_candidate). If h_prev is a list, call gru_update on each pair; otherwise compute (1 - z) * h_prev + z * h_candidate and round.",
          "Calling the same function on the parts is a small, neat example of recursion, and it keeps the formula in one place.",
          "Checks include z = 0, z = 1, z = 0.25 and a list input.",
          "After passing, run a GRU over a sequence with the same z and watch how quickly it forgets compared with lstm_cell and f = 0.97.",
          "The example shows isinstance, which you use to handle both numbers and lists."
        ],
        "example": "A recipe that says \"for a family meal, repeat these steps for each plate\": the same instructions, applied piece by piece.",
        "code": "for value in [0.5, [0.5, 0.2], \"text\"]:\n    print(repr(value), \"is a list:\", isinstance(value, list))",
        "output": "0.5 is a list: False\n[0.5, 0.2] is a list: True\n'text' is a list: False",
        "codeNotes": [
          {
            "line": 2,
            "note": "isinstance checks the type of a value."
          }
        ],
        "tryIt": "What would gru_update(0.5, (1.0, 0.0), (0.0, 1.0)) do with tuples? How could you support them too?",
        "check": {
          "question": "lstm_cell(0.9, 0.5, 0.3, -0.2) equals?",
          "options": [
            "0.45",
            "0.39",
            "0.51"
          ],
          "answer": 1,
          "why": "0.9 × 0.5 + 0.3 × (-0.2) = 0.45 - 0.06 = 0.39."
        }
      }
    ],
    "summary": [
      "LSTMs add a cell state and three sigmoid gates: forget, input and output.",
      "Cell update: c_t = f × c_{t-1} + i × c̃; hidden state: h_t = o × tanh(c_t).",
      "GRUs merge state and use update and reset gates: h_t = (1 - z) × h_{t-1} + z × h̃.",
      "The gated, additive memory path lets gradients flow across many steps.",
      "The same \"direct path\" idea returns as residual connections in Transformers."
    ],
    "projectStep": {
      "title": "Memory race",
      "steps": [
        "Run a plain RNN, an LSTM cell path and a GRU over 50 steps from the same first input.",
        "Print how much of the first input survives at steps 10, 25 and 50 for each.",
        "Explain which gate settings made the difference."
      ]
    }
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Word2Vec Embeddings, Viterbi POS Tagger & Bidirectional LSTM Classifier",
    "goal": "You can combine embeddings, sequence tagging and recurrent networks into a working classifier design: build sentence embeddings, run a bidirectional pass, and explain how a BiLSTM tagger and classifier are wired.",
    "minutes": 30,
    "recap": "Milestone 2 brings together word vectors (Days 7-9), sequence tagging with Viterbi (Days 10-11), classification (Day 12) and recurrent networks (Days 13-14).",
    "parts": [
      {
        "title": "The milestone pipeline",
        "say": [
          "A typical pre-Transformer NLP system looked like this: tokens become embeddings, a bidirectional LSTM reads them, and a small output layer makes predictions.",
          "For classification (such as sentiment), the output layer reads a summary of the whole sentence. For tagging (such as NER), it makes one prediction per token, often decoded with Viterbi for valid tag sequences.",
          "Each piece is something you have already built a small version of.",
          "Embeddings turn discrete words into vectors that carry meaning. The BiLSTM turns those vectors into context-aware vectors. The output layer turns those into labels.",
          "This modular view is still how modern systems are built: swap the BiLSTM for a Transformer and the rest of the design stays.",
          "The example prints the pipeline with the day that taught each part.",
          "Today you implement the two remaining connecting pieces: sentence embeddings and bidirectional passes."
        ],
        "example": "An assembly line where parts made in different workshops come together into one working machine.",
        "code": "pipeline = [(\"tokenise and clean\", 1), (\"look up embeddings\", 7), (\"read left-to-right and right-to-left\", 14),\n            (\"combine both directions\", 15), (\"classify or tag each token\", 12), (\"decode valid tags\", 10)]\nfor step, (what, day) in enumerate(pipeline, 1):\n    print(f\"{step}. {what:38} (Day {day})\")",
        "output": "1. tokenise and clean                     (Day 1)\n2. look up embeddings                     (Day 7)\n3. read left-to-right and right-to-left   (Day 14)\n4. combine both directions                (Day 15)\n5. classify or tag each token             (Day 12)\n6. decode valid tags                      (Day 10)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Each step reuses an earlier lesson."
          }
        ],
        "tryIt": "Which steps would change if you replaced the BiLSTM with a Transformer (Day 18)?",
        "check": {
          "question": "For NER, what does the output layer produce?",
          "options": [
            "One label for the whole sentence",
            "One label per token",
            "A summary vector"
          ],
          "answer": 1,
          "why": "Tagging tasks predict a label for every token."
        }
      },
      {
        "title": "Sentence embeddings by averaging",
        "say": [
          "The simplest way to get one vector for a whole sentence is to average its word vectors.",
          "It ignores word order, like bag of words, but because the word vectors carry meaning, similar sentences still get similar vectors: \"a great film\" and \"an excellent movie\" land close together.",
          "Averaged embeddings plus a simple classifier were a surprisingly strong baseline for sentiment and topic classification.",
          "Practice 2 is sentence_embedding(tokens, vectors): average the vectors of known tokens, element by element, rounded to 4 decimals, and return None if none are known.",
          "Skipping unknown tokens is better than counting them as zeros, which would drag every value towards 0.",
          "Weighted averages (for example by TF-IDF) often work better still, because they reduce the influence of common words.",
          "The example compares two sentences with the same meaning using averaged embeddings and cosine similarity."
        ],
        "example": "Describing a meal by the average flavour of its dishes: you lose the order of courses, but two similar meals still taste alike.",
        "code": "import math\n\nvecs = {\"great\": [0.9, 0.1], \"excellent\": [0.88, 0.12], \"film\": [0.2, 0.8], \"movie\": [0.22, 0.78],\n        \"terrible\": [-0.9, 0.1], \"a\": [0.0, 0.1], \"an\": [0.0, 0.1]}\ndef embed(tokens):\n    known = [vecs[t] for t in tokens if t in vecs]\n    return [sum(col) / len(known) for col in zip(*known)] if known else None\ndef cos(a, b):\n    return sum(x * y for x, y in zip(a, b)) / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))\na, b, c = embed(\"a great film\".split()), embed(\"an excellent movie\".split()), embed(\"a terrible film\".split())\nprint(\"great film ~ excellent movie:\", round(cos(a, b), 3))\nprint(\"great film ~ terrible film:  \", round(cos(a, c), 3))",
        "output": "great film ~ excellent movie: 1.0\ngreat film ~ terrible film:   0.127",
        "codeNotes": [
          {
            "line": 7,
            "note": "Average column by column; None if no word is known."
          },
          {
            "line": 11,
            "note": "Different words, nearly the same sentence vector."
          }
        ],
        "tryIt": "Embed \"not a great film\". Why does averaging miss the negation?",
        "check": {
          "question": "Why skip unknown tokens instead of treating them as zero vectors?",
          "options": [
            "Zeros are not allowed",
            "Zeros would pull the average towards 0 and weaken the real signal",
            "Unknown tokens are always stopwords"
          ],
          "answer": 1,
          "why": "Averaging in zero vectors dilutes the meaning of the known words."
        }
      },
      {
        "title": "Bidirectional reading",
        "say": [
          "A left-to-right RNN at word t knows only the words before t. But meaning often depends on what comes after: in \"Washington said...\", \"said\" tells you Washington is a person, not a place.",
          "A bidirectional RNN runs two RNNs: one forward over the sentence and one backward, from the last word to the first.",
          "At each position, the two hidden states are combined (usually concatenated), so every word's representation sees both its left and right context.",
          "Practice 1 is bidirectional(xs, step, h0): run step forward and backward, and return (forward_state, backward_state) pairs lined up by position.",
          "The backward states come out in reverse order, so reverse them before pairing, or position 0 would be matched with the wrong state.",
          "Passing step in as a function means your code works for any recurrent cell: a sum for testing, a tanh RNN, or an LSTM.",
          "The example runs a bidirectional pass with a simple summing step, so the numbers are easy to check."
        ],
        "example": "Reading a sentence with a missing word: you use both the words before the gap and the words after it to fill it in.",
        "code": "def bidirectional(xs, step, h0=0.0):\n    fwd, h = [], h0\n    for x in xs:\n        h = step(h, x); fwd.append(h)\n    bwd, h = [], h0\n    for x in reversed(xs):\n        h = step(h, x); bwd.append(h)\n    bwd.reverse()\n    return list(zip(fwd, bwd))\n\nprint(bidirectional([1, 2, 3], lambda h, x: h + x))\nprint(bidirectional([\"the\", \"bank\", \"river\"], lambda h, x: (h + \" \" + x).strip(), \"\"))",
        "output": "[(1.0, 6.0), (3.0, 5.0), (6.0, 3.0)]\n[('the', 'river bank the'), ('the bank', 'river bank'), ('the bank river', 'river')]",
        "codeNotes": [
          {
            "line": 8,
            "note": "Reverse the backward states so they line up with positions."
          },
          {
            "line": 12,
            "note": "With strings, you can see exactly what each direction has read."
          }
        ],
        "tryIt": "Remove line 8. Which positions get the wrong backward state?",
        "check": {
          "question": "Why read a sentence in both directions?",
          "options": [
            "It is twice as fast",
            "Each word's representation can use both left and right context",
            "To remove stopwords"
          ],
          "answer": 1,
          "why": "Many words are disambiguated by what follows them."
        }
      },
      {
        "title": "The BiLSTM tagger",
        "say": [
          "For tagging, the BiLSTM's combined state at each position feeds a small layer that scores every tag for that token.",
          "Taking the highest-scoring tag per token is fast, but can produce invalid BIO sequences (Day 11) because each decision is made alone.",
          "Adding a CRF layer on top fixes that: it learns transition scores between tags, and Viterbi decoding (Day 10) picks the best valid sequence overall.",
          "BiLSTM-CRF was the best named entity recognition architecture from about 2015 until Transformers, reaching around 0.91 F1 on CoNLL-2003.",
          "The example scores tags per token, then shows how a transition rule rejects an invalid choice.",
          "This combination, neural features plus structured decoding, is a pattern worth remembering.",
          "The network provides good local evidence; the decoder makes the global sequence consistent."
        ],
        "example": "A choir where each singer reads their own part (per-token scores), and the conductor makes sure the parts fit together into one harmony (the decoder).",
        "code": "tokens = [\"New\", \"Delhi\", \"rocks\"]\nscores = [{\"B-LOC\": 0.6, \"I-LOC\": 0.1, \"O\": 0.3},\n          {\"B-LOC\": 0.2, \"I-LOC\": 0.5, \"O\": 0.3},\n          {\"B-LOC\": 0.1, \"I-LOC\": 0.45, \"O\": 0.45}]\ngreedy = [max(s, key=s.get) for s in scores]\nprint(\"greedy tags:\", greedy)\nallowed = lambda prev, tag: not (tag.startswith(\"I-\") and prev == \"O\")\nprint(\"every step allowed:\", all(allowed(p, t) for p, t in zip([\"O\"] + greedy, greedy)))",
        "output": "greedy tags: ['B-LOC', 'I-LOC', 'I-LOC']\nevery step allowed: True",
        "codeNotes": [
          {
            "line": 5,
            "note": "Greedy: the best tag per token, chosen independently."
          },
          {
            "line": 8,
            "note": "A CRF would also score transitions and reject invalid ones."
          }
        ],
        "tryIt": "Change the last token's scores so that greedy picks I-LOC after O. Does the check catch it?",
        "check": {
          "question": "What does a CRF layer add on top of a BiLSTM tagger?",
          "options": [
            "More embeddings",
            "Transition scores so the whole tag sequence is decoded consistently",
            "A second language"
          ],
          "answer": 1,
          "why": "The CRF scores tag transitions and Viterbi finds the best valid sequence."
        }
      },
      {
        "title": "The BiLSTM classifier and its limits",
        "say": [
          "For classification, the BiLSTM's states must become one vector for the whole sentence. Common choices are the final forward and backward states, or pooling (average or max) over all positions.",
          "That vector goes through a classifier layer that outputs a probability for each class, like the Naive Bayes decision on Day 12 but learned end to end.",
          "Compared with averaged embeddings, the BiLSTM captures order and negation (\"not good\" differs from \"good\").",
          "Its limits led to the next era: processing is sequential, so training is slow; very long-range links are still hard; and every word's context is squeezed through a fixed-size state.",
          "Attention (Day 17) lets a model look back at every position directly, and Transformers (Day 18) drop recurrence entirely.",
          "The example compares mean pooling and max pooling over a few position vectors.",
          "Knowing these limits makes the motivation for attention obvious."
        ],
        "example": "Summarising a meeting either by averaging everyone's opinions (mean pooling) or by noting the strongest point anyone made on each topic (max pooling).",
        "code": "states = [[0.1, 0.9], [0.8, 0.2], [0.3, 0.4]]      # one vector per position\nmean_pool = [round(sum(col) / len(states), 4) for col in zip(*states)]\nmax_pool = [max(col) for col in zip(*states)]\nprint(\"mean pooling:\", mean_pool)\nprint(\"max pooling: \", max_pool)",
        "output": "mean pooling: [0.4, 0.5]\nmax pooling:  [0.8, 0.9]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Average each dimension over positions."
          },
          {
            "line": 3,
            "note": "Keep the strongest value of each dimension."
          }
        ],
        "tryIt": "Which pooling would better keep a single strong signal, such as one very negative word?",
        "check": {
          "question": "Why did attention and Transformers replace BiLSTMs?",
          "options": [
            "BiLSTMs could not handle English",
            "Sequential processing is slow and long-range context is squeezed through a fixed state",
            "BiLSTMs need no training"
          ],
          "answer": 1,
          "why": "Attention reaches any position directly and Transformers train in parallel."
        }
      },
      {
        "title": "Milestone practice: connect the pieces",
        "say": [
          "Practice 1: bidirectional(xs, step, h0=0.0). Two loops, one over xs and one over reversed(xs), each collecting states after every step; reverse the backward list, then zip.",
          "The checks use a summing step (easy numbers), an empty input (returns []) and a step that just returns the latest input, which proves each state is the one after reading that position.",
          "Practice 2: sentence_embedding(tokens, vectors). Keep known tokens, return None if there are none, otherwise average with zip(*known) and round.",
          "Together they give you a working sentence representation (averaging) and the context mechanism (bidirectional reading) behind the BiLSTM.",
          "Congratulations on Milestone 2. You have covered the core of classical and early neural NLP: vectors, taggers, classifiers and recurrent networks.",
          "Next: attention and Transformers, the architecture behind every modern language model.",
          "The example combines both functions into a tiny context-aware sentence representation."
        ],
        "example": "Graduating from building engine parts to assembling a complete engine and hearing it run.",
        "code": "vecs = {\"not\": -1.0, \"good\": 1.0, \"very\": 0.5}\nxs = [vecs[t] for t in [\"not\", \"very\", \"good\"]]\nfwd, h = [], 0.0\nfor x in xs:\n    h = 0.5 * h + x; fwd.append(round(h, 3))\nbwd, h = [], 0.0\nfor x in reversed(xs):\n    h = 0.5 * h + x; bwd.append(round(h, 3))\nbwd.reverse()\npairs = list(zip(fwd, bwd))\nprint(\"per-position (forward, backward):\", pairs)\nprint(\"sentence vector (mean of pairs):\", [round(sum(c) / len(pairs), 3) for c in zip(*pairs)])",
        "output": "per-position (forward, backward): [(-1.0, -0.5), (0.0, 1.0), (1.0, 1.0)]\nsentence vector (mean of pairs): [0.0, 0.5]",
        "codeNotes": [
          {
            "line": 5,
            "note": "A toy recurrent step that remembers half of the past."
          },
          {
            "line": 12,
            "note": "Averaging the bidirectional states gives a sentence vector."
          }
        ],
        "tryIt": "Compare this sentence vector with one for \"very good\". Does the \"not\" change it?",
        "check": {
          "question": "What does bidirectional([], step) return?",
          "options": [
            "None",
            "[]",
            "An error"
          ],
          "answer": 1,
          "why": "No inputs means no positions, so an empty list."
        }
      }
    ],
    "summary": [
      "Classic neural NLP: embeddings, then a (Bi)LSTM, then an output layer, with Viterbi/CRF for tagging.",
      "Averaged word vectors are a simple, strong sentence embedding; skip unknown words.",
      "Bidirectional RNNs combine left-to-right and right-to-left states at each position.",
      "BiLSTM-CRF taggers score tokens locally and decode valid sequences globally.",
      "Sequential processing and fixed-size memory motivated attention and Transformers."
    ],
    "projectStep": {
      "title": "Milestone 2: sentence understanding kit",
      "steps": [
        "Build sentence embeddings for 10 of your sentences and find the most similar pair.",
        "Run a bidirectional pass with a toy step over one sentence and print both directions.",
        "Write a short design for a BiLSTM-CRF tagger for your own entity types."
      ]
    }
  },
  {
    "day": 16,
    "title": "Sequence-to-Sequence (Seq2Seq) Architecture: Encoder-Decoder & Teacher Forcing",
    "goal": "You can explain the encoder-decoder (sequence-to-sequence) architecture, the context-vector bottleneck, how decoding works step by step, and how teacher forcing and scheduled sampling help training.",
    "minutes": 30,
    "recap": "So far every task mapped a sequence to labels of the same length (tagging) or to one label (classification). Translation and summarisation map a sequence to a different sequence. That needs an encoder and a decoder.",
    "parts": [
      {
        "title": "Sequence in, sequence out",
        "say": [
          "Many tasks turn one sequence into another of a different length: translating English to Hindi, summarising an article, answering a question in a sentence, converting speech to text.",
          "The sequence-to-sequence (seq2seq) architecture, introduced in 2014 by Sutskever, Vinyals and Le at Google, handles this with two networks.",
          "The encoder reads the input sequence (for example with an LSTM) and compresses it into a vector, called the context vector.",
          "The decoder, another LSTM, starts from that context vector and generates the output one token at a time, feeding each generated token back in as the next input, until it produces an end symbol.",
          "The two parts are trained together, end to end, on pairs of input and output sequences.",
          "The example shows the shape of the data: source sentences, target sentences, and the special start and end symbols.",
          "Seq2seq powered the first neural machine translation systems, including Google Translate's 2016 switch to neural translation."
        ],
        "example": "A human interpreter who listens to a whole sentence, holds its meaning in mind, then speaks it in another language word by word.",
        "code": "pairs = [(\"i am happy\", \"je suis content\"), (\"thank you\", \"merci\"), (\"good morning friend\", \"bonjour mon ami\")]\nfor src, tgt in pairs:\n    source = src.split()\n    target = [\"<s>\"] + tgt.split() + [\"</s>\"]\n    print(f\"{len(source)} words in -> {len(target) - 2} words out: {source} -> {target}\")",
        "output": "3 words in -> 3 words out: ['i', 'am', 'happy'] -> ['<s>', 'je', 'suis', 'content', '</s>']\n2 words in -> 1 words out: ['thank', 'you'] -> ['<s>', 'merci', '</s>']\n3 words in -> 3 words out: ['good', 'morning', 'friend'] -> ['<s>', 'bonjour', 'mon', 'ami', '</s>']",
        "codeNotes": [
          {
            "line": 4,
            "note": "The decoder starts from <s> and stops when it produces </s>."
          }
        ],
        "tryIt": "Add a pair where the output is longer than the input. Can a tagger (one label per word) handle it?",
        "check": {
          "question": "What does the encoder produce in a basic seq2seq model?",
          "options": [
            "The translated sentence",
            "A context vector summarising the input",
            "A list of tags"
          ],
          "answer": 1,
          "why": "The encoder compresses the input into a context vector for the decoder."
        }
      },
      {
        "title": "The context vector bottleneck",
        "say": [
          "In the basic design, the whole input sentence must fit into one fixed-size vector, whether it has 3 words or 60.",
          "That is a bottleneck. Short sentences translate well, but quality drops sharply for long ones, because early details get overwritten as the encoder reads on.",
          "Early fixes included reversing the source sentence, so the first source words were close to the first target words, which helped surprisingly much.",
          "The real fix, tomorrow's topic, is attention: let the decoder look back at ALL the encoder's states, not just the final summary.",
          "The example illustrates the bottleneck by squeezing sentences of different lengths into a fixed number of slots and measuring how much is lost.",
          "Keep this problem in mind; attention, and then the Transformer, are direct answers to it.",
          "Bottlenecks like this are a recurring theme in engineering: any single fixed-size channel limits what can pass through."
        ],
        "example": "Summarising every book you read in exactly one tweet: fine for a short story, hopeless for a long novel.",
        "code": "SLOTS = 4\nfor sentence in [\"i am happy\", \"the old man walked slowly to the market near the river at dawn\"]:\n    words = sentence.split()\n    kept = words[-SLOTS:]          # a crude \"memory\" that keeps the most recent words\n    lost = len(words) - len(kept)\n    print(f\"{len(words):2} words, kept {kept}, lost {lost}\")",
        "output": " 3 words, kept ['i', 'am', 'happy'], lost 0\n13 words, kept ['the', 'river', 'at', 'dawn'], lost 9",
        "codeNotes": [
          {
            "line": 4,
            "note": "A fixed-size summary cannot hold everything from a long input."
          }
        ],
        "tryIt": "Which words from the long sentence would a translator most need, and were they kept?",
        "check": {
          "question": "Why do basic seq2seq models translate long sentences poorly?",
          "options": [
            "They are slow",
            "The whole input is squeezed into one fixed-size context vector",
            "They cannot read punctuation"
          ],
          "answer": 1,
          "why": "The fixed-size context vector is a bottleneck for long inputs."
        }
      },
      {
        "title": "Decoding one token at a time",
        "say": [
          "The decoder generates autoregressively: each output token depends on the tokens generated before it.",
          "At step 1 it receives <s> and the context, and predicts the first word. At step 2 it receives that first word and predicts the second, and so on.",
          "Greedy decoding picks the single most likely token at each step. It is fast but can paint itself into a corner: a good first word may lead to a bad sentence overall.",
          "Beam search keeps the k best partial sentences at each step (the beam) and extends them all, a middle ground between greedy and trying every possibility.",
          "Decoding stops when the model generates </s>, or at a maximum length to prevent endless output.",
          "The example runs greedy decoding with a small table of next-word probabilities.",
          "GPT-style models (Day 24) generate text the same way, one token at a time; Day 27 covers smarter sampling methods."
        ],
        "example": "Writing a sentence where you choose each next word by what sounds best right now, without planning the whole sentence first.",
        "code": "next_word = {\n    \"<s>\": {\"je\": 0.7, \"moi\": 0.3},\n    \"je\": {\"suis\": 0.8, \"vais\": 0.2},\n    \"suis\": {\"content\": 0.6, \"heureux\": 0.4},\n    \"content\": {\"</s>\": 1.0},\n}\nword, output = \"<s>\", []\nfor _ in range(10):\n    word = max(next_word[word], key=next_word[word].get)\n    if word == \"</s>\":\n        break\n    output.append(word)\nprint(\"greedy output:\", output)",
        "output": "greedy output: ['je', 'suis', 'content']",
        "codeNotes": [
          {
            "line": 9,
            "note": "Greedy: the most likely next word each time."
          },
          {
            "line": 8,
            "note": "A maximum length stops runaway generation."
          }
        ],
        "tryIt": "Change the probabilities so that greedy chooses \"moi\" first. What happens next?",
        "check": {
          "question": "What does autoregressive decoding mean?",
          "options": [
            "All output tokens are produced at once",
            "Each output token is generated using the previously generated tokens",
            "The output is always shorter"
          ],
          "answer": 1,
          "why": "Each step feeds on the tokens generated before it."
        }
      },
      {
        "title": "Teacher forcing",
        "say": [
          "During training we know the correct output. Should the decoder's next input be the correct previous word, or its own (possibly wrong) prediction?",
          "Teacher forcing feeds the correct previous word. Training is faster and more stable, because one early mistake does not derail every later step.",
          "Without teacher forcing (free running), the model trains on its own predictions, which is slower but matches what happens at test time.",
          "Practice 2 is decoder_inputs(targets, predictions, teacher): the inputs fed at each step, starting with <s>, then either the true previous words or the predicted ones.",
          "The downside of pure teacher forcing is exposure bias: the model never practises recovering from its own mistakes, then meets them for the first time in real use.",
          "The example prints the decoder inputs under both settings for the same target and predictions.",
          "Tomorrow's scheduled sampling blends the two."
        ],
        "example": "A driving instructor who grabs the wheel after every mistake: you learn quickly, but you never practise getting out of trouble on your own.",
        "code": "def decoder_inputs(targets, predictions, teacher):\n    source = targets if teacher else predictions\n    return [\"<s>\"] + list(source[:len(targets) - 1])\n\ntargets = [\"je\", \"suis\", \"très\", \"content\"]\npredictions = [\"je\", \"es\", \"très\", \"contente\"]\nprint(\"teacher forcing:\", decoder_inputs(targets, predictions, True))\nprint(\"free running:   \", decoder_inputs(targets, predictions, False))",
        "output": "teacher forcing: ['<s>', 'je', 'suis', 'très']\nfree running:    ['<s>', 'je', 'es', 'très']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Choose where the next inputs come from."
          },
          {
            "line": 3,
            "note": "Step 0 always gets <s>; each later step gets the previous word."
          }
        ],
        "tryIt": "In free running, the wrong word \"es\" is fed back. How might that affect the next prediction?",
        "check": {
          "question": "What is teacher forcing?",
          "options": [
            "Feeding the correct previous word to the decoder during training",
            "A way to translate faster",
            "Removing the encoder"
          ],
          "answer": 0,
          "why": "The decoder is given the true previous token rather than its own prediction."
        }
      },
      {
        "title": "Scheduled sampling",
        "say": [
          "Scheduled sampling (Bengio and colleagues, 2015) gets the best of both: start training with mostly teacher forcing, then gradually feed the model more of its own predictions.",
          "The teacher forcing ratio is the probability of using the true word at each step. It starts at 1.0 and decays as training goes on.",
          "A simple linear schedule is ratio = max(minimum, 1 - (epoch / max_epochs) * decay), where the minimum (here 0.1) keeps a little guidance to the end.",
          "Practice 1 is teacher_forcing_ratio(epoch, max_epochs, decay=1.0) with a minimum of 0.1, rounded to 4 decimals.",
          "Other schedules, such as exponential or inverse sigmoid decay, change the ratio at different speeds; linear is the easiest to reason about.",
          "The example prints the schedule over ten epochs for two decay settings.",
          "Schedules like this, gradually changing a training setting, are common across machine learning; learning-rate schedules are the best-known example."
        ],
        "example": "Training wheels that are raised a little higher each week until the child is balancing on their own.",
        "code": "def teacher_forcing_ratio(epoch, max_epochs, decay=1.0):\n    return round(max(0.1, 1.0 - epoch / max_epochs * decay), 4)\n\nfor decay in [1.0, 0.5]:\n    schedule = [teacher_forcing_ratio(e, 10, decay) for e in range(0, 11, 2)]\n    print(f\"decay {decay}: epochs 0,2,4,6,8,10 -> {schedule}\")",
        "output": "decay 1.0: epochs 0,2,4,6,8,10 -> [1.0, 0.8, 0.6, 0.4, 0.2, 0.1]\ndecay 0.5: epochs 0,2,4,6,8,10 -> [1.0, 0.9, 0.8, 0.7, 0.6, 0.5]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Linear decay, never below 0.1."
          }
        ],
        "tryIt": "With decay 2.0, at which epoch does the ratio first hit the minimum?",
        "check": {
          "question": "What problem does scheduled sampling address?",
          "options": [
            "Slow tokenisation",
            "Exposure bias: the model never practising on its own mistakes",
            "Large vocabularies"
          ],
          "answer": 1,
          "why": "Gradually feeding its own predictions teaches the model to recover from errors."
        }
      },
      {
        "title": "Practice time: schedules and inputs",
        "say": [
          "Practice 1: teacher_forcing_ratio(epoch, max_epochs, decay=1.0). One line with max(0.1, ...) and round(..., 4).",
          "Checks: epoch 0 gives 1.0, halfway gives 0.5, the end gives the 0.1 minimum, and a gentler decay of 0.5 at epoch 3 of 10 gives 0.85.",
          "Practice 2: decoder_inputs(targets, predictions, teacher). [\"<s>\"] plus the first len(targets) - 1 items of the chosen source list.",
          "The output always has the same length as targets: one input per output step.",
          "In real training, each step flips a coin with the teacher forcing ratio to decide which source to use, so a single sentence can mix true and predicted inputs.",
          "The example simulates that coin flip with a seeded random generator, so the output is the same every run.",
          "Seeding randomness is how researchers make experiments repeatable."
        ],
        "example": "A quiz master who, for each question, rolls a die to decide whether to give a hint.",
        "code": "import random\n\nrng = random.Random(7)\ntargets = [\"je\", \"suis\", \"très\", \"content\"]\npredictions = [\"je\", \"es\", \"très\", \"contente\"]\nratio = 0.5\ninputs = [\"<s>\"]\nfor t in range(1, len(targets)):\n    use_truth = rng.random() < ratio\n    inputs.append(targets[t - 1] if use_truth else predictions[t - 1])\nprint(\"mixed inputs:\", inputs)",
        "output": "mixed inputs: ['<s>', 'je', 'suis', 'très']",
        "codeNotes": [
          {
            "line": 3,
            "note": "A seeded generator gives the same \"random\" choices every run."
          },
          {
            "line": 9,
            "note": "Use the true word with probability ratio."
          }
        ],
        "tryIt": "Change the seed to 1. Do the inputs change? Change ratio to 1.0: what do you get?",
        "check": {
          "question": "decoder_inputs([\"x\"], [\"y\"], False) returns?",
          "options": [
            "[\"<s>\", \"y\"]",
            "[\"<s>\"]",
            "[\"y\"]"
          ],
          "answer": 1,
          "why": "One target means one input step, which is always <s>."
        }
      }
    ],
    "summary": [
      "Seq2seq maps an input sequence to an output sequence with an encoder and a decoder.",
      "A single fixed-size context vector is a bottleneck for long inputs.",
      "Decoding is autoregressive: greedy picks the best token each step; beam search keeps several candidates.",
      "Teacher forcing feeds true previous words in training; free running feeds predictions.",
      "Scheduled sampling decays the teacher forcing ratio to reduce exposure bias."
    ],
    "projectStep": {
      "title": "Design a tiny translator",
      "steps": [
        "Write ten short sentence pairs in two languages you know.",
        "Build a next-word table for the target language and decode greedily.",
        "Print decoder inputs with teacher forcing, free running and a 0.5 ratio."
      ]
    }
  },
  {
    "day": 17,
    "title": "Attention Mechanisms: Bahdanau Additive & Luong Multiplicative Alignment",
    "goal": "You can explain how attention lets a decoder look at every encoder state, compute alignment scores, turn them into weights with a numerically stable softmax, build a context vector, and compare Bahdanau and Luong attention.",
    "minutes": 30,
    "recap": "Yesterday the whole input had to squeeze through one context vector. Attention removes that bottleneck: at every step the decoder looks back at all the encoder's states and chooses what to focus on.",
    "parts": [
      {
        "title": "Looking back at the whole input",
        "say": [
          "In 2014, Bahdanau, Cho and Bengio proposed attention for translation. Instead of one context vector, the decoder gets a fresh context at every output step.",
          "The encoder keeps a state for every input word. At each decoding step, the decoder scores how relevant each encoder state is right now.",
          "Those scores become weights that sum to 1, and the context is the weighted sum of the encoder states.",
          "When translating \"content\" in French, the model can focus on \"happy\" in the English input, even if it came much earlier.",
          "The weights are also interpretable: plotting them shows which source words each target word attended to, often a clean diagonal-like alignment.",
          "Attention also solves the bottleneck from yesterday directly: nothing has to be squeezed into one vector any more, because every encoder state stays available for the whole of decoding.",
          "The example prints a hand-made attention table for a short translation.",
          "This one idea, computing a weighted mix of all positions based on relevance, is the foundation of the Transformer."
        ],
        "example": "A translator who keeps the original page open and glances back at the relevant phrase for each word they write, instead of relying on memory alone.",
        "code": "source = [\"i\", \"am\", \"very\", \"happy\"]\nattention = {\n    \"je\": [0.9, 0.05, 0.03, 0.02],\n    \"suis\": [0.1, 0.8, 0.05, 0.05],\n    \"très\": [0.02, 0.08, 0.85, 0.05],\n    \"content\": [0.02, 0.03, 0.1, 0.85],\n}\nfor target, weights in attention.items():\n    focus = source[weights.index(max(weights))]\n    print(f\"{target:8} attends most to {focus!r} ({max(weights):.0%})\")",
        "output": "je       attends most to 'i' (90%)\nsuis     attends most to 'am' (80%)\ntrès     attends most to 'very' (85%)\ncontent  attends most to 'happy' (85%)",
        "codeNotes": [
          {
            "line": 3,
            "note": "One weight per source word, summing to 1."
          },
          {
            "line": 9,
            "note": "The highest weight shows the main alignment."
          }
        ],
        "tryIt": "Check that each row of weights sums to 1.",
        "check": {
          "question": "What does attention give the decoder at each step?",
          "options": [
            "A random source word",
            "A fresh, weighted mix of all encoder states",
            "Only the last encoder state"
          ],
          "answer": 1,
          "why": "Attention recomputes a context from all encoder states at every step."
        }
      },
      {
        "title": "Scores to weights: softmax",
        "say": [
          "Attention first computes a raw score for each encoder state: how well it matches what the decoder needs now.",
          "Raw scores can be any numbers. Softmax turns them into weights that are positive and sum to 1: weight_i = e^(score_i) / sum over j of e^(score_j).",
          "Softmax exaggerates differences. A score only a little higher gets a noticeably bigger share, and a much higher score takes almost everything.",
          "A practical danger: e^1000 overflows to infinity in floating point. The fix is to subtract the largest score from all scores first. The result is mathematically identical, because the common factor cancels.",
          "Practice 1 is softmax(scores), stable, rounded to 4 decimals.",
          "You met softmax indirectly in Naive Bayes and will use it in every remaining lesson: attention, Transformers and text generation.",
          "The example shows the overflow and the stable version side by side."
        ],
        "example": "Turning votes into percentages, where louder support counts disproportionately more.",
        "code": "import math\n\ndef naive_softmax(scores):\n    exps = [math.exp(s) for s in scores]\n    return [e / sum(exps) for e in exps]\n\ndef softmax(scores):\n    m = max(scores)\n    exps = [math.exp(s - m) for s in scores]\n    return [round(e / sum(exps), 4) for e in exps]\n\nprint(\"stable:\", softmax([2.0, 1.0, 0.1]))\nprint(\"stable with big scores:\", softmax([1000.0, 1000.0, 999.0]))\ntry:\n    naive_softmax([1000.0, 999.0])\nexcept OverflowError as err:\n    print(\"naive with big scores:\", err)",
        "output": "stable: [0.659, 0.2424, 0.0986]\nstable with big scores: [0.4223, 0.4223, 0.1554]\nnaive with big scores: math range error",
        "codeNotes": [
          {
            "line": 8,
            "note": "Subtract the maximum: the largest exponent becomes e^0 = 1."
          },
          {
            "line": 15,
            "note": "e^1000 is too large for a float."
          }
        ],
        "tryIt": "Add 5 to every score in [2.0, 1.0, 0.1]. Does the softmax change? Why?",
        "check": {
          "question": "Why subtract the maximum score before softmax?",
          "options": [
            "To change the result",
            "To avoid overflow; the result is mathematically the same",
            "To make weights negative"
          ],
          "answer": 1,
          "why": "Shifting all scores by a constant does not change softmax, but it keeps exponents small."
        }
      },
      {
        "title": "The context vector",
        "say": [
          "With weights in hand, the context vector is the weighted sum of the encoder states (called values): context = sum over i of weight_i * value_i.",
          "If the weights are [1, 0, 0], the context is exactly the first value. If they are spread out, the context blends several values.",
          "Practice 2 is context_vector(weights, values): the weighted sum, element by element, rounded to 4 decimals.",
          "The decoder combines this context with its own state to predict the next word.",
          "Because the context is recomputed every step, the model can focus on different source words for different target words, which is exactly what translation needs.",
          "Notice that the context has the same size as each value vector, no matter how many source words there are. Long and short inputs produce contexts of the same shape.",
          "The example computes contexts for sharp and spread-out weights.",
          "In Transformers the same operation appears as \"attention output = weights times values\"."
        ],
        "example": "A smoothie made from fruits in chosen proportions: mostly mango with a little banana tastes mostly of mango.",
        "code": "def context_vector(weights, values):\n    return [round(sum(w * v[j] for w, v in zip(weights, values)), 4) for j in range(len(values[0]))]\n\nvalues = [[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]\nprint(\"focus on the first:\", context_vector([1.0, 0.0, 0.0], values))\nprint(\"spread out:        \", context_vector([0.5, 0.25, 0.25], values))\nprint(\"even:              \", context_vector([1 / 3, 1 / 3, 1 / 3], values))",
        "output": "focus on the first: [1.0, 0.0]\nspread out:         [0.75, 0.5]\neven:               [0.6667, 0.6667]",
        "codeNotes": [
          {
            "line": 2,
            "note": "For each dimension j, add up weight times value."
          }
        ],
        "tryIt": "What weights would give the context [0.5, 1.0]?",
        "check": {
          "question": "Weights [0, 1, 0] over values v1, v2, v3. What is the context?",
          "options": [
            "The average of all three",
            "Exactly v2",
            "Zero"
          ],
          "answer": 1,
          "why": "All the weight on the second value returns it unchanged."
        }
      },
      {
        "title": "Bahdanau and Luong scoring",
        "say": [
          "How is the raw relevance score computed? The two classic answers are named after their authors.",
          "Bahdanau (additive) attention feeds the decoder state and each encoder state through a small neural layer and a tanh, then reduces it to a score. It is flexible and was the original.",
          "Luong (multiplicative) attention, from 2015, uses a dot product between the decoder state and each encoder state (optionally with a learned matrix in between). It is simpler and faster.",
          "The dot product is large when two vectors point the same way, so it naturally measures \"how well does this encoder state match what I am looking for\".",
          "Transformers use dot-product attention with one extra step, scaling by the square root of the vector size, which you will see tomorrow.",
          "The example computes both kinds of score for a decoder state against three encoder states.",
          "Both produce scores; softmax and the weighted sum are the same afterwards."
        ],
        "example": "Two ways to judge how well a candidate fits a job: a detailed interview (additive, flexible) or a quick checklist match (dot product, fast).",
        "code": "import math\n\ndecoder = [1.0, 0.5]\nencoder_states = [[0.9, 0.4], [0.1, 0.9], [-0.5, 0.2]]\nW1, W2, v = 0.8, 0.6, 1.0      # toy single-number weights for the additive score\nfor i, e in enumerate(encoder_states):\n    dot = sum(a * b for a, b in zip(decoder, e))\n    additive = v * math.tanh(W1 * sum(decoder) + W2 * sum(e))\n    print(f\"state {i}: dot-product score {dot:.3f}   additive score {additive:.3f}\")",
        "output": "state 0: dot-product score 1.100   additive score 0.963\nstate 1: dot-product score 0.550   additive score 0.947\nstate 2: dot-product score -0.400   additive score 0.770",
        "codeNotes": [
          {
            "line": 7,
            "note": "Luong: a dot product."
          },
          {
            "line": 8,
            "note": "Bahdanau: a small layer with tanh (simplified here)."
          }
        ],
        "tryIt": "Which encoder state does each method rate highest? Do they agree?",
        "check": {
          "question": "How does Luong attention score an encoder state?",
          "options": [
            "With a random number",
            "With a dot product against the decoder state",
            "By its position"
          ],
          "answer": 1,
          "why": "Multiplicative attention uses (possibly weighted) dot products."
        }
      },
      {
        "title": "Attention everywhere",
        "say": [
          "Attention quickly spread beyond translation: summarisation, image captioning (attending to parts of an image), speech recognition and question answering.",
          "It also helped interpretability. Attention maps show which input parts influenced each output, though researchers warn they are not a complete explanation of a model's reasoning.",
          "A key conceptual step was self-attention: instead of a decoder attending to an encoder, each word in a sentence attends to the other words in the same sentence.",
          "Self-attention builds context-aware word representations without any recurrence, because every word can look at every other word directly.",
          "That is the idea behind \"Attention Is All You Need\" (Vaswani and colleagues, 2017), which introduced the Transformer.",
          "The example shows a tiny self-attention pattern where \"it\" attends to the noun it refers to.",
          "From tomorrow, every lesson builds on self-attention."
        ],
        "example": "Reading \"The trophy didn't fit in the suitcase because it was too big\": to understand \"it\", you look back at \"trophy\".",
        "code": "words = [\"the\", \"animal\", \"did\", \"not\", \"cross\", \"because\", \"it\", \"was\", \"tired\"]\nattention_from_it = [0.02, 0.62, 0.03, 0.02, 0.06, 0.05, 0.1, 0.05, 0.05]\nranked = sorted(zip(attention_from_it, words), reverse=True)[:3]\nprint(\"'it' attends to:\", [(w, f\"{a:.0%}\") for a, w in ranked])",
        "output": "'it' attends to: [('animal', '62%'), ('it', '10%'), ('cross', '6%')]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Self-attention weights from the word \"it\" to every word in the same sentence."
          }
        ],
        "tryIt": "Change the last word to \"wide\" (as in \"the street was too wide\"). Which word should \"it\" attend to now?",
        "check": {
          "question": "What is self-attention?",
          "options": [
            "A decoder attending to an encoder",
            "Words in a sequence attending to other words in the same sequence",
            "A model attending to its own weights"
          ],
          "answer": 1,
          "why": "Self-attention relates positions within one sequence."
        }
      },
      {
        "title": "Practice time: softmax and context",
        "say": [
          "Practice 1: softmax(scores). Find the maximum, exponentiate each score minus the maximum, divide by the sum, round to 4 decimals.",
          "The checks include equal scores (equal weights), [2.0, 1.0, 0.1] (0.659, 0.2424, 0.0986) and huge scores that would overflow without the subtraction.",
          "Practice 2: context_vector(weights, values). For each dimension j, sum weight times value[j] over all positions, rounded.",
          "Assume all value vectors have the same length; len(values[0]) gives it.",
          "Together these two functions ARE attention, once you have scores: softmax turns scores into weights, and the weighted sum gives the context.",
          "After passing, chain them: compute dot-product scores between a query and each value, softmax them, and build the context.",
          "The example chains all three steps."
        ],
        "example": "Three workshop stations: judge relevance, turn judgements into shares, and mix the ingredients by those shares.",
        "code": "import math\n\nquery = [1.0, 0.0]\nvalues = [[1.0, 0.0], [0.0, 1.0], [0.7, 0.7]]\nscores = [sum(q * v for q, v in zip(query, val)) for val in values]\nm = max(scores)\nexps = [math.exp(s - m) for s in scores]\nweights = [e / sum(exps) for e in exps]\ncontext = [round(sum(w * v[j] for w, v in zip(weights, values)), 4) for j in range(2)]\nprint(\"scores:\", scores)\nprint(\"weights:\", [round(w, 4) for w in weights])\nprint(\"context:\", context)",
        "output": "scores: [1.0, 0.0, 0.7]\nweights: [0.4742, 0.1745, 0.3513]\ncontext: [0.7201, 0.4204]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Dot-product scores."
          },
          {
            "line": 8,
            "note": "Softmax."
          },
          {
            "line": 9,
            "note": "Weighted sum of values."
          }
        ],
        "tryIt": "Make the query [0.0, 1.0]. Which value dominates the context now?",
        "check": {
          "question": "softmax([1.0, 1.0]) returns?",
          "options": [
            "[1.0, 1.0]",
            "[0.5, 0.5]",
            "[0.0, 1.0]"
          ],
          "answer": 1,
          "why": "Equal scores get equal weights that sum to 1."
        }
      }
    ],
    "summary": [
      "Attention gives the decoder a new context at every step, a weighted mix of all encoder states.",
      "Softmax turns scores into weights that sum to 1; subtract the maximum to avoid overflow.",
      "Context vector = sum of weights times values.",
      "Bahdanau attention scores with a small tanh layer; Luong uses dot products.",
      "Self-attention relates words within one sequence and leads to the Transformer."
    ],
    "projectStep": {
      "title": "Attention by hand",
      "steps": [
        "Pick a four-word sentence and its translation, and write a sensible attention table.",
        "Compute scores with dot products for toy vectors, softmax them and build contexts.",
        "Print, for each target word, the source word it attends to most."
      ]
    }
  },
  {
    "day": 18,
    "title": "The Transformer Architecture: Scaled Dot-Product Self-Attention",
    "goal": "You can explain the Transformer's self-attention with queries, keys and values, compute scaled dot-product attention by hand, explain why scores are divided by the square root of the key size, and describe the encoder block.",
    "minutes": 30,
    "recap": "Yesterday you saw attention help an RNN decoder, and the idea of self-attention. Today you meet the Transformer, which drops recurrence completely and builds everything from self-attention.",
    "parts": [
      {
        "title": "Attention is all you need",
        "say": [
          "In 2017, Vaswani and colleagues at Google published \"Attention Is All You Need\". Their Transformer used no recurrence at all, only attention and simple feed-forward layers.",
          "Because no position waits for the previous one, all positions are processed in parallel. Training on GPUs became dramatically faster, and much larger models became practical.",
          "Every word can attend directly to every other word, so long-range links take one step instead of dozens of recurrent steps.",
          "The original Transformer beat the best translation systems while training in a fraction of the time.",
          "BERT (Day 23), GPT (Day 24) and every modern large language model are Transformers.",
          "The example compares how many sequential steps an RNN and a Transformer layer need for different sentence lengths.",
          "The price is that attention compares every pair of positions, so cost grows with the square of the sequence length, a limit that shapes today's long-context research."
        ],
        "example": "Moving from a bucket chain, where each person must wait for the one before, to a room where everyone can talk to everyone at once.",
        "code": "for n in [10, 100, 1000]:\n    rnn_sequential_steps = n\n    transformer_sequential_steps = 1\n    attention_pairs = n * n\n    print(f\"{n:5} tokens: RNN {rnn_sequential_steps:5} steps in a row, Transformer layer {transformer_sequential_steps} step, {attention_pairs:,} attention pairs\")",
        "output": "   10 tokens: RNN    10 steps in a row, Transformer layer 1 step, 100 attention pairs\n  100 tokens: RNN   100 steps in a row, Transformer layer 1 step, 10,000 attention pairs\n 1000 tokens: RNN  1000 steps in a row, Transformer layer 1 step, 1,000,000 attention pairs",
        "codeNotes": [
          {
            "line": 3,
            "note": "All positions are computed together."
          },
          {
            "line": 4,
            "note": "But every pair of positions is compared."
          }
        ],
        "tryIt": "How many attention pairs for 100,000 tokens? Why is long context expensive?",
        "check": {
          "question": "Why did Transformers train so much faster than RNNs?",
          "options": [
            "They have fewer parameters",
            "They process all positions in parallel instead of one after another",
            "They skip training"
          ],
          "answer": 1,
          "why": "Without recurrence, the whole sequence is computed at once on parallel hardware."
        }
      },
      {
        "title": "Queries, keys and values",
        "say": [
          "Self-attention gives each word three vectors, each produced by multiplying its embedding by a learned matrix.",
          "The query says what this word is looking for. The key says what this word offers, as a label for matching. The value is the information this word passes on if chosen.",
          "To update word i, compare its query with every word's key; high matches mean high attention. Then take the weighted sum of the values.",
          "The same word plays all three roles, but through different learned projections, so \"what I look for\" and \"what I offer\" can differ.",
          "A library search is a good picture: your query is matched against book keys (titles and tags), and you walk away with the values (the contents) of the best matches.",
          "The example computes query-key match scores for one word against a short sentence.",
          "All three are learned during training; nobody hand-writes them."
        ],
        "example": "A search engine: your query is matched against page titles (keys), and you read the pages (values) that match best.",
        "code": "words = [\"the\", \"cat\", \"sat\", \"down\"]\nkeys = {\"the\": [0.1, 0.0], \"cat\": [0.9, 0.2], \"sat\": [0.2, 0.9], \"down\": [0.1, 0.7]}\nquery_for_sat = [0.8, 0.3]    # \"sat\" looks for its subject\nfor w in words:\n    score = sum(q * k for q, k in zip(query_for_sat, keys[w]))\n    print(f\"sat -> {w:5} score {score:.2f}\")",
        "output": "sat -> the   score 0.08\nsat -> cat   score 0.78\nsat -> sat   score 0.43\nsat -> down  score 0.29",
        "codeNotes": [
          {
            "line": 3,
            "note": "The query encodes what \"sat\" is looking for."
          },
          {
            "line": 5,
            "note": "A dot product between query and key measures the match."
          }
        ],
        "tryIt": "Change the query to [0.1, 0.9]. Which word matches best now?",
        "check": {
          "question": "In self-attention, what is the value vector?",
          "options": [
            "The score",
            "The information a word passes on when attended to",
            "The word's position"
          ],
          "answer": 1,
          "why": "Values are what gets mixed into the output according to the weights."
        }
      },
      {
        "title": "Scaling by the square root of d_k",
        "say": [
          "The Transformer computes scores as the dot product of query and key, divided by the square root of d_k, the size of the key vectors.",
          "Why divide? A dot product sums d_k products. With random values of similar size, its spread grows like the square root of d_k. With 64 or 128 dimensions, raw scores can get large.",
          "Large scores push softmax into saturation: one weight near 1, the rest near 0. In that region the gradients are tiny, and learning slows to a crawl.",
          "Dividing by the square root of d_k keeps scores in a moderate range whatever the vector size.",
          "Practice 1 is scaled_score(q, k): the dot product divided by math.sqrt(len(k)), rounded to 4 decimals.",
          "This small detail is part of why Transformers train reliably at scale.",
          "The example shows softmax saturating on unscaled scores and staying smooth when scaled."
        ],
        "example": "Turning down the volume on a microphone for a big hall, so the speaker is loud enough but not distorted.",
        "code": "import math\n\ndef softmax(s):\n    m = max(s); e = [math.exp(x - m) for x in s]; return [round(v / sum(e), 3) for v in e]\n\nd_k = 64\nraw = [24.0, 16.0, 8.0]              # typical dot products at d_k = 64\nscaled = [s / math.sqrt(d_k) for s in raw]\nprint(\"raw scores:   \", raw, \"->\", softmax(raw))\nprint(\"scaled scores:\", scaled, \"->\", softmax(scaled))",
        "output": "raw scores:    [24.0, 16.0, 8.0] -> [1.0, 0.0, 0.0]\nscaled scores: [3.0, 2.0, 1.0] -> [0.665, 0.245, 0.09]",
        "codeNotes": [
          {
            "line": 8,
            "note": "Divide by sqrt(64) = 8."
          },
          {
            "line": 9,
            "note": "Unscaled: one weight takes almost everything."
          }
        ],
        "tryIt": "Try d_k = 4 with the same raw scores. How much does scaling change things now?",
        "check": {
          "question": "Why divide attention scores by sqrt(d_k)?",
          "options": [
            "To make them integers",
            "Large dot products saturate softmax and slow learning",
            "To reverse the order"
          ],
          "answer": 1,
          "why": "Scaling keeps scores moderate so softmax gradients stay useful."
        }
      },
      {
        "title": "Scaled dot-product attention in full",
        "say": [
          "Putting it together, for every query: score each key with dot(q, k) / sqrt(d_k), softmax the scores into weights, and output the weighted sum of the values.",
          "In matrix form this is written softmax(Q K^T / sqrt(d_k)) V, and GPUs compute it for all positions at once.",
          "Practice 2 is self_attention(Q, K, V): the full calculation for lists of vectors, rounding only at the very end.",
          "Rounding only at the end matters: rounding intermediate weights would introduce small errors that add up.",
          "The output has one vector per query position, each a context-aware mix of the values.",
          "The example runs self-attention on a two-token toy input where each token mostly attends to itself.",
          "Everything in the rest of the course, multi-head attention, BERT, GPT, builds on this one function."
        ],
        "example": "Every student in a study group asks a question (query), checks which classmates' notes (keys) match, and copies a blend of those classmates' answers (values).",
        "code": "import math\n\ndef self_attention(Q, K, V):\n    d = len(K[0])\n    out = []\n    for q in Q:\n        scores = [sum(a * b for a, b in zip(q, k)) / math.sqrt(d) for k in K]\n        m = max(scores)\n        exps = [math.exp(s - m) for s in scores]\n        weights = [e / sum(exps) for e in exps]\n        out.append([round(sum(w * v[j] for w, v in zip(weights, V)), 4) for j in range(len(V[0]))])\n    return out\n\nQ = K = [[1.0, 0.0], [0.0, 1.0]]\nV = [[10.0, 0.0], [0.0, 10.0]]\nprint(self_attention(Q, K, V))",
        "output": "[[6.6976, 3.3024], [3.3024, 6.6976]]",
        "codeNotes": [
          {
            "line": 7,
            "note": "Scaled dot-product scores against every key."
          },
          {
            "line": 11,
            "note": "Weighted sum of values, rounded only at the end."
          }
        ],
        "tryIt": "Make both queries [1.0, 1.0]. What do the outputs become, and why?",
        "check": {
          "question": "In softmax(QK^T / sqrt(d_k)) V, what does V contribute?",
          "options": [
            "The scores",
            "The information that is mixed into each output",
            "The scaling"
          ],
          "answer": 1,
          "why": "Values are combined according to the attention weights."
        }
      },
      {
        "title": "The encoder block",
        "say": [
          "A Transformer encoder is a stack of identical blocks, often 6, 12 or more.",
          "Each block has two sub-layers: multi-head self-attention (tomorrow) and a position-wise feed-forward network, a small two-layer network applied to each position separately.",
          "Around each sub-layer are a residual connection (add the input back to the output) and layer normalisation (Day 21).",
          "Residual connections give information and gradients a direct path through deep stacks, the same idea as the LSTM's cell state.",
          "Attention mixes information across positions; the feed-forward network processes each position's mixed information. Stacking blocks alternates the two.",
          "The example traces one vector through a simplified block with a residual connection.",
          "The decoder (for translation) adds a second attention sub-layer that attends to the encoder's output, plus the causal mask you will meet on Day 24."
        ],
        "example": "A committee meeting (attention: everyone shares information) followed by each member thinking on their own (feed-forward), repeated over several rounds.",
        "code": "x = [0.5, -1.0, 2.0]                      # one position's vector\nattention_out = [0.2, 0.1, -0.3]           # what self-attention added\nafter_attention = [a + b for a, b in zip(x, attention_out)]\nffn = lambda v: [max(0.0, 0.5 * t) for t in v]     # a tiny feed-forward step (ReLU)\nafter_ffn = [a + b for a, b in zip(after_attention, ffn(after_attention))]\nprint(\"input:          \", x)\nprint(\"+ attention:    \", [round(t, 2) for t in after_attention])\nprint(\"+ feed-forward: \", [round(t, 2) for t in after_ffn])",
        "output": "input:           [0.5, -1.0, 2.0]\n+ attention:     [0.7, -0.9, 1.7]\n+ feed-forward:  [1.05, -0.9, 2.55]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Residual: the sub-layer output is added to its input."
          },
          {
            "line": 5,
            "note": "The same pattern around the feed-forward network."
          }
        ],
        "tryIt": "Remove the residual additions (use only the sub-layer outputs). How much of the original input survives?",
        "check": {
          "question": "What does a residual connection do?",
          "options": [
            "Deletes the input",
            "Adds a sub-layer's input to its output, giving a direct path",
            "Normalises the vector"
          ],
          "answer": 1,
          "why": "Residuals let information and gradients bypass each sub-layer."
        }
      },
      {
        "title": "Practice time: scores and attention",
        "say": [
          "Practice 1: scaled_score(q, k). sum(a * b for a, b in zip(q, k)) divided by math.sqrt(len(k)), rounded to 4 decimals.",
          "Checks: [1, 0, 1, 0] with [1, 1, 1, 1] gives 2 / 2 = 1.0; [1, 2] with [3, 4] gives 11 / 1.4142 = 7.7782; orthogonal vectors give 0.0.",
          "Practice 2: self_attention(Q, K, V). For each query, scaled scores against every key, stable softmax, weighted sum of values, round at the end.",
          "The first check uses identity-like queries and keys with values [10, 0] and [0, 10]; each output mostly copies its own value: [6.6976, 3.3024] and the mirror image.",
          "The second check gives equal scores, so the output is the plain average of the values.",
          "You have now implemented the heart of every Transformer. Tomorrow you split it into several heads.",
          "The example checks a key property: each row of attention weights sums to 1."
        ],
        "example": "Checking that a recipe's percentages add up to 100 before cooking.",
        "code": "import math\n\nQ = [[1.0, 0.0], [0.5, 0.5]]\nK = [[1.0, 0.0], [0.0, 1.0], [0.6, 0.8]]\nfor q in Q:\n    s = [sum(a * b for a, b in zip(q, k)) / math.sqrt(2) for k in K]\n    e = [math.exp(x - max(s)) for x in s]\n    w = [x / sum(e) for x in e]\n    print(\"weights:\", [round(x, 3) for x in w], \"sum:\", round(sum(w), 6))",
        "output": "weights: [0.445, 0.219, 0.335] sum: 1.0\nweights: [0.317, 0.317, 0.365] sum: 1.0",
        "codeNotes": [
          {
            "line": 9,
            "note": "Every row of attention weights sums to 1."
          }
        ],
        "tryIt": "Add a fourth key. Do the rows still sum to 1?",
        "check": {
          "question": "scaled_score([1, 0, 1, 0], [1, 1, 1, 1]) equals?",
          "options": [
            "2.0",
            "1.0",
            "0.5"
          ],
          "answer": 1,
          "why": "The dot product is 2 and sqrt(4) is 2, so the score is 1.0."
        }
      }
    ],
    "summary": [
      "Transformers replace recurrence with self-attention, so all positions are processed in parallel.",
      "Each token has a query (what it looks for), a key (what it offers) and a value (what it passes on).",
      "Scores are dot(q, k) / sqrt(d_k); scaling stops softmax saturating.",
      "Attention output = softmax(QK^T / sqrt(d_k)) V, one context-aware vector per position.",
      "Encoder blocks combine self-attention and feed-forward layers with residual connections and layer norm."
    ],
    "projectStep": {
      "title": "Self-attention on your sentence",
      "steps": [
        "Give each word of a five-word sentence a small hand-made query, key and value.",
        "Run self_attention and print which word each word attends to most.",
        "Change one key and explain how the outputs shift."
      ]
    }
  },
  {
    "day": 19,
    "title": "Multi-Head Self-Attention: Representation Subspaces & Linear Projections",
    "goal": "You can explain why Transformers use several attention heads, compute the per-head dimension, split and merge vectors across heads, and describe what different heads learn and how their outputs are combined.",
    "minutes": 30,
    "recap": "Yesterday you built one scaled dot-product attention. A single attention can only focus in one way at a time. Multi-head attention runs several in parallel, each looking for something different.",
    "parts": [
      {
        "title": "Why more than one head",
        "say": [
          "In one sentence, a word relates to others in several ways at once. \"Sat\" in \"the cat sat on the mat\" relates to its subject (\"cat\"), its location (\"mat\") and its tense.",
          "A single attention computes one set of weights per word, which is one blend. It cannot focus sharply on the subject and the location at the same time.",
          "Multi-head attention runs several attentions in parallel, called heads, each with its own learned query, key and value projections.",
          "Each head can specialise: researchers have found heads that track the previous word, heads that link verbs to their subjects, and heads that follow coreference (\"it\" to its noun).",
          "The original Transformer used 8 heads; BERT-base uses 12; large models use dozens.",
          "You can think of it as an ensemble inside a single layer: several small attentions vote, and the next layer learns how much to trust each one.",
          "The example shows two hand-made heads focusing on different relations for the same word.",
          "Heads are not assigned roles by anyone; they discover useful patterns during training."
        ],
        "example": "A panel of specialists reviewing the same document: a lawyer, an accountant and an editor each notice different things.",
        "code": "words = [\"the\", \"cat\", \"sat\", \"on\", \"the\", \"mat\"]\nheads = {\n    \"subject head\": [0.02, 0.85, 0.05, 0.02, 0.02, 0.04],\n    \"location head\": [0.02, 0.05, 0.05, 0.1, 0.03, 0.75],\n}\nfor name, weights in heads.items():\n    top = words[weights.index(max(weights))]\n    print(f\"{name:14} for 'sat' focuses on {top!r}\")",
        "output": "subject head   for 'sat' focuses on 'cat'\nlocation head  for 'sat' focuses on 'mat'",
        "codeNotes": [
          {
            "line": 3,
            "note": "One head's attention weights from \"sat\"."
          },
          {
            "line": 7,
            "note": "Each head finds a different relation."
          }
        ],
        "tryIt": "Add a \"previous word head\" that focuses on the word just before \"sat\".",
        "check": {
          "question": "Why use several attention heads?",
          "options": [
            "To use more memory",
            "Each head can focus on a different kind of relationship at the same time",
            "Heads replace embeddings"
          ],
          "answer": 1,
          "why": "Multiple heads let the model attend in several ways simultaneously."
        }
      },
      {
        "title": "Splitting the model dimension",
        "say": [
          "Multi-head attention does not make the model bigger by the number of heads. Instead, it splits the model dimension among them.",
          "With d_model = 512 and 8 heads, each head works with vectors of size 512 / 8 = 64. The total work is about the same as one big head.",
          "That requires d_model to be divisible by the number of heads, or the pieces would not be equal.",
          "Practice 1 is head_dim(d_model, heads): return d_model // heads, and raise ValueError if heads is not positive or the division is not exact.",
          "Raising an error early is much better than silently producing a model with wrong shapes that fails far away, deep inside training.",
          "Common configurations: 512 / 8 = 64 (original Transformer), 768 / 12 = 64 (BERT-base), 4096 / 32 = 128 (a 7-billion-parameter model).",
          "The example checks several configurations."
        ],
        "example": "Splitting a pizza among friends: eight slices only works if the pizza can be cut evenly into eight.",
        "code": "def head_dim(d_model, heads):\n    if heads <= 0 or d_model % heads:\n        raise ValueError(f\"{d_model} does not split into {heads} heads\")\n    return d_model // heads\n\nfor d, h in [(512, 8), (768, 12), (4096, 32), (512, 7)]:\n    try:\n        print(f\"d_model {d}, {h} heads -> {head_dim(d, h)} per head\")\n    except ValueError as err:\n        print(\"error:\", err)",
        "output": "d_model 512, 8 heads -> 64 per head\nd_model 768, 12 heads -> 64 per head\nd_model 4096, 32 heads -> 128 per head\nerror: 512 does not split into 7 heads",
        "codeNotes": [
          {
            "line": 2,
            "note": "d_model % heads is non-zero when the split is uneven."
          }
        ],
        "tryIt": "What head sizes are possible for d_model = 1024? List a few valid head counts.",
        "check": {
          "question": "d_model = 768 with 12 heads. What is the head dimension?",
          "options": [
            "12",
            "64",
            "768"
          ],
          "answer": 1,
          "why": "768 / 12 = 64."
        }
      },
      {
        "title": "Splitting and merging vectors",
        "say": [
          "In practice, each head gets its own projections, but a convenient equivalent view is: project once to the full size, then split each vector into consecutive chunks, one per head.",
          "Each head runs scaled dot-product attention on its chunk. Then the head outputs are concatenated back into one vector of size d_model.",
          "Practice 2 is split_heads(vector, heads) and merge_heads(chunks): split into equal consecutive chunks (raising ValueError if impossible), and join them back.",
          "Merging after splitting must give back exactly the original vector. That round-trip property is a great test.",
          "In real code, libraries do this reshaping on whole matrices (for example with reshape and transpose in PyTorch), but the idea is exactly the list slicing you write today.",
          "The example splits an 8-number vector into 4 heads, then merges it back.",
          "After merging, one more learned matrix (the output projection) mixes information across heads."
        ],
        "example": "Dividing a long train into carriages to pass through a narrow station, then coupling them back together on the other side.",
        "code": "def split_heads(vector, heads):\n    if heads <= 0 or len(vector) % heads:\n        raise ValueError(\"length must be divisible by heads\")\n    size = len(vector) // heads\n    return [vector[i * size:(i + 1) * size] for i in range(heads)]\n\ndef merge_heads(chunks):\n    return [x for chunk in chunks for x in chunk]\n\nv = [1, 2, 3, 4, 5, 6, 7, 8]\nchunks = split_heads(v, 4)\nprint(\"split:\", chunks)\nprint(\"merged back equals original:\", merge_heads(chunks) == v)",
        "output": "split: [[1, 2], [3, 4], [5, 6], [7, 8]]\nmerged back equals original: True",
        "codeNotes": [
          {
            "line": 5,
            "note": "Slice consecutive chunks of equal size."
          },
          {
            "line": 8,
            "note": "A nested comprehension flattens the chunks."
          }
        ],
        "tryIt": "Split v into 2 heads, then 8 heads. What does each head receive?",
        "check": {
          "question": "What must merge_heads(split_heads(v, h)) return?",
          "options": [
            "An empty list",
            "Exactly v",
            "The first chunk"
          ],
          "answer": 1,
          "why": "Merging undoes splitting; the round trip returns the original vector."
        }
      },
      {
        "title": "Running the heads",
        "say": [
          "Each head runs the full attention calculation from yesterday on its own smaller vectors: its own scores, its own softmax, its own weighted sum.",
          "Because heads are independent, they run in parallel, which suits GPUs well.",
          "The concatenated outputs contain each head's view side by side. The output projection then combines them into a single representation.",
          "Heads can attend to completely different positions for the same token. One might look at the next word, another at a word ten positions back.",
          "Some heads turn out to be redundant: studies pruned many heads from trained models with little loss, which is used to make models smaller and faster.",
          "Because every head is small, the total cost of all heads together is about the same as one full-size attention, so you get several views for roughly the price of one.",
          "The example runs two tiny heads on split query, key and value vectors and concatenates the results.",
          "Notice that each head gets different attention weights from the same tokens."
        ],
        "example": "Two cameras filming the same scene from different angles; the editor splices both views into one film.",
        "code": "import math\n\ndef attend(q, keys, values):\n    s = [sum(a * b for a, b in zip(q, k)) / math.sqrt(len(k)) for k in keys]\n    e = [math.exp(x - max(s)) for x in s]\n    w = [x / sum(e) for x in e]\n    return [sum(wi * v[j] for wi, v in zip(w, values)) for j in range(len(values[0]))], w\n\nq = [2.0, 0.0, 0.0, 2.0]\nK = [[2.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.0, 2.0]]\nV = [[1.0, 0.0, 5.0, 0.0], [0.0, 1.0, 0.0, 5.0]]\noutputs = []\nfor h in range(2):\n    sl = slice(h * 2, h * 2 + 2)\n    out, w = attend(q[sl], [k[sl] for k in K], [v[sl] for v in V])\n    print(f\"head {h}: weights {[round(x, 3) for x in w]}\")\n    outputs += out\nprint(\"concatenated:\", [round(x, 3) for x in outputs])",
        "output": "head 0: weights [0.944, 0.056]\nhead 1: weights [0.056, 0.944]\nconcatenated: [0.944, 0.056, 0.279, 4.721]",
        "codeNotes": [
          {
            "line": 14,
            "note": "Each head takes its own slice of the vectors."
          },
          {
            "line": 17,
            "note": "Head outputs are concatenated."
          }
        ],
        "tryIt": "Why does head 0 prefer the first token and head 1 the second?",
        "check": {
          "question": "After the heads run, what combines their outputs?",
          "options": [
            "They are averaged and discarded",
            "They are concatenated, then mixed by an output projection",
            "Only the best head is kept"
          ],
          "answer": 1,
          "why": "Concatenation plus a learned output matrix combines all heads."
        }
      },
      {
        "title": "What heads learn, and efficient variants",
        "say": [
          "Visualising attention heads in trained models reveals recognisable patterns: attending to the previous or next token, to punctuation, to the sentence start, or along grammatical relations.",
          "This helped researchers understand models, though a head's weights are only one piece of what the model computes.",
          "For generation, large models spend a lot of memory storing keys and values for every head (the KV cache, Day 24).",
          "Multi-query attention and grouped-query attention (GQA) reduce this by sharing keys and values across several query heads. Many recent large models use GQA.",
          "These variants keep most of the quality while cutting memory and speeding up generation substantially.",
          "The example compares the size of the key-value store for standard, grouped and multi-query attention.",
          "Engineering choices like these are why modern models can serve long conversations at a reasonable cost."
        ],
        "example": "A team where every member keeps their own full copy of the files (standard), small groups share one copy (grouped), or everyone shares a single copy (multi-query).",
        "code": "heads, head_dim, tokens = 32, 128, 4096\nfor name, kv_heads in [(\"multi-head\", 32), (\"grouped-query (8 groups)\", 8), (\"multi-query\", 1)]:\n    values_stored = 2 * kv_heads * head_dim * tokens\n    print(f\"{name:25} stores {values_stored:>12,} numbers per layer\")",
        "output": "multi-head                stores   33,554,432 numbers per layer\ngrouped-query (8 groups)  stores    8,388,608 numbers per layer\nmulti-query               stores    1,048,576 numbers per layer",
        "codeNotes": [
          {
            "line": 3,
            "note": "Keys and values (the 2) for each KV head, dimension and token."
          }
        ],
        "tryIt": "How many times smaller is grouped-query with 8 groups than full multi-head?",
        "check": {
          "question": "What does grouped-query attention share between heads?",
          "options": [
            "Queries",
            "Keys and values",
            "Nothing"
          ],
          "answer": 1,
          "why": "Several query heads share one set of keys and values, saving memory."
        }
      },
      {
        "title": "Practice time: dimensions and heads",
        "say": [
          "Practice 1: head_dim(d_model, heads). Check heads <= 0 or d_model % heads and raise ValueError; otherwise return d_model // heads.",
          "Use integer division (//) so the result is an int, not a float like 64.0.",
          "Practice 2: split_heads(vector, heads) and merge_heads(chunks). Split with a list comprehension of slices; merge with a flattening comprehension.",
          "The checks split into 4 and 2 heads, verify the round trip, and expect ValueError for 8 values into 3 heads.",
          "These shape checks look small, but shape errors are among the most common bugs in real deep learning code.",
          "After passing, combine split_heads with the self_attention function from yesterday to run a full multi-head attention on toy data.",
          "The example shows the difference between / and // for this calculation."
        ],
        "example": "Measuring a shelf for boxes: you need a whole number of boxes, not 7.5 boxes.",
        "code": "print(\"512 / 8  =\", 512 / 8, type(512 / 8).__name__)\nprint(\"512 // 8 =\", 512 // 8, type(512 // 8).__name__)\nprint(\"512 % 7  =\", 512 % 7, \"(non-zero: not evenly divisible)\")",
        "output": "512 / 8  = 64.0 float\n512 // 8 = 64 int\n512 % 7  = 1 (non-zero: not evenly divisible)",
        "codeNotes": [
          {
            "line": 2,
            "note": "// gives an integer result."
          },
          {
            "line": 3,
            "note": "The remainder tells you whether the split is exact."
          }
        ],
        "tryIt": "What does [1, 2, 3][0:1.5] do? Why must slice positions be integers?",
        "check": {
          "question": "split_heads([1, 2, 3, 4, 5, 6, 7, 8], 3) should?",
          "options": [
            "Return 3 uneven chunks",
            "Raise ValueError",
            "Return 8 chunks"
          ],
          "answer": 1,
          "why": "8 is not divisible by 3, so the split is invalid."
        }
      }
    ],
    "summary": [
      "Multi-head attention runs several attentions in parallel, each able to focus on a different relation.",
      "The model dimension is split among heads: head_dim = d_model / heads, which must divide evenly.",
      "Vectors are split into per-head chunks, attended separately, then concatenated and projected.",
      "Heads learn patterns such as previous-token, subject-verb and coreference links.",
      "Grouped-query and multi-query attention share keys and values to save memory."
    ],
    "projectStep": {
      "title": "Two-head attention",
      "steps": [
        "Create 4-dimensional toy vectors for a four-word sentence.",
        "Split them into 2 heads, run attention per head, and merge the outputs.",
        "Explain what each head focused on."
      ]
    }
  },
  {
    "day": 20,
    "title": "Positional Encoding: Sinusoidal Frequencies & Rotary Embeddings (RoPE)",
    "goal": "You can explain why Transformers need positional information, compute sinusoidal positional encodings, describe how rotary position embeddings (RoPE) rotate query and key pairs, and compare absolute and relative position methods.",
    "minutes": 30,
    "recap": "Self-attention compares every word with every other word, but it has a blind spot: it does not know the order of the words. Today you give Transformers a sense of position.",
    "parts": [
      {
        "title": "Attention is order-blind",
        "say": [
          "Self-attention treats its input as a set. If you shuffle the words, each word gets exactly the same attention weights to the same words, just in a different order.",
          "\"Dog bites man\" and \"man bites dog\" would produce the same representations for each word, which is clearly wrong for language.",
          "RNNs got order for free by reading one word at a time. Transformers read everything at once, so order must be added explicitly.",
          "The solution is to add position information to each token's embedding before (or during) attention.",
          "Two main families exist: absolute encodings (a vector for \"position 5\") and relative ones (information about \"3 positions apart\").",
          "The example shows that plain self-attention gives the same result for a word whatever the word order.",
          "This is one of those details that seems small and turns out to be essential."
        ],
        "example": "A pile of photos from a holiday with no dates: you can see what happened, but not in what order.",
        "code": "import math\n\nemb = {\"dog\": [1.0, 0.2], \"bites\": [0.1, 1.0], \"man\": [0.9, 0.3]}\ndef attention_for(word, sentence):\n    q = emb[word]\n    s = [sum(a * b for a, b in zip(q, emb[w])) for w in sentence]\n    e = [math.exp(x - max(s)) for x in s]\n    return {w: round(x / sum(e), 3) for w, x in zip(sentence, e)}\nprint(attention_for(\"bites\", [\"dog\", \"bites\", \"man\"]))\nprint(attention_for(\"bites\", [\"man\", \"bites\", \"dog\"]))",
        "output": "{'dog': 0.242, 'bites': 0.493, 'man': 0.265}\n{'man': 0.265, 'bites': 0.493, 'dog': 0.242}",
        "codeNotes": [
          {
            "line": 9,
            "note": "The same weights come out whatever the order of the words."
          }
        ],
        "tryIt": "What would need to be added to the embeddings to make the two results differ?",
        "check": {
          "question": "Why do Transformers need positional encodings?",
          "options": [
            "To save memory",
            "Self-attention by itself ignores word order",
            "To remove stopwords"
          ],
          "answer": 1,
          "why": "Attention treats the input as an unordered set, so order must be added."
        }
      },
      {
        "title": "Sinusoidal positional encoding",
        "say": [
          "The original Transformer added a fixed positional encoding to each embedding, built from sine and cosine waves of different frequencies.",
          "For position pos and dimension i: angle = pos / 10000 ** (2 * (i // 2) / d_model). Even dimensions use sin(angle), odd dimensions use cos(angle).",
          "Low dimensions change quickly with position (like a clock's second hand); high dimensions change slowly (like the hour hand). Together they give every position a unique pattern.",
          "Nothing needs to be learned, and the formula works for any position, even longer than those seen in training (though models do not always generalise well there).",
          "Practice 1 is positional_encoding(pos, i, d_model): one entry of that encoding, rounded to 4 decimals.",
          "Using i // 2 makes each sin and cos pair share the same frequency, which lets the model shift positions with a simple rotation.",
          "The example prints the encoding for the first few positions."
        ],
        "example": "A clock with many hands turning at different speeds: the combination of all hands tells you the exact time, even though each hand repeats.",
        "code": "import math\n\ndef positional_encoding(pos, i, d_model):\n    angle = pos / 10000 ** (2 * (i // 2) / d_model)\n    return round(math.sin(angle) if i % 2 == 0 else math.cos(angle), 4)\n\nd = 8\nfor pos in range(4):\n    print(f\"pos {pos}:\", [positional_encoding(pos, i, d) for i in range(d)])",
        "output": "pos 0: [0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0]\npos 1: [0.8415, 0.5403, 0.0998, 0.995, 0.01, 1.0, 0.001, 1.0]\npos 2: [0.9093, -0.4161, 0.1987, 0.9801, 0.02, 0.9998, 0.002, 1.0]\npos 3: [0.1411, -0.99, 0.2955, 0.9553, 0.03, 0.9996, 0.003, 1.0]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Each pair of dimensions shares a frequency."
          },
          {
            "line": 5,
            "note": "sin for even i, cos for odd i."
          }
        ],
        "tryIt": "Which dimensions change the most between position 0 and 1? Which barely change?",
        "check": {
          "question": "In the sinusoidal encoding, what does an odd dimension i use?",
          "options": [
            "sin",
            "cos",
            "tan"
          ],
          "answer": 1,
          "why": "Even dimensions use sine and odd dimensions use cosine."
        }
      },
      {
        "title": "Adding positions to embeddings",
        "say": [
          "The positional encoding has the same size as the token embedding, and the two are simply added together, number by number.",
          "After adding, the same word at two different positions has different vectors, so attention can tell \"dog\" at position 0 from \"dog\" at position 2.",
          "Adding rather than concatenating keeps the size the same. The model learns to use some directions for meaning and others for position.",
          "Many models, including BERT and GPT-2, learned their positional embeddings instead of using the fixed formula: one trainable vector per position up to a maximum length.",
          "Learned positions work well but cannot go beyond the maximum length seen in training, which is one reason newer models moved to relative methods.",
          "The example adds the encoding to the same word at three positions and shows the vectors now differ.",
          "Milestone 3 tomorrow builds a function that adds positions to a whole sequence."
        ],
        "example": "Writing the seat number on each concert ticket: two tickets for the same show are now distinguishable.",
        "code": "import math\n\ndef pe(pos, i, d):\n    a = pos / 10000 ** (2 * (i // 2) / d)\n    return math.sin(a) if i % 2 == 0 else math.cos(a)\n\ndog = [0.5, 0.5, 0.5, 0.5]\nfor pos in [0, 1, 2]:\n    print(f\"dog at {pos}:\", [round(v + pe(pos, i, 4), 3) for i, v in enumerate(dog)])",
        "output": "dog at 0: [0.5, 1.5, 0.5, 1.5]\ndog at 1: [1.341, 1.04, 0.51, 1.5]\ndog at 2: [1.409, 0.084, 0.52, 1.5]",
        "codeNotes": [
          {
            "line": 9,
            "note": "Same word, different positions, different vectors."
          }
        ],
        "tryIt": "Compute the cosine similarity between \"dog at 0\" and \"dog at 1\". Is it still high?",
        "check": {
          "question": "How is the positional encoding combined with the token embedding in the original Transformer?",
          "options": [
            "Multiplied",
            "Added",
            "Ignored"
          ],
          "answer": 1,
          "why": "The two vectors of equal size are added element by element."
        }
      },
      {
        "title": "Rotary position embeddings (RoPE)",
        "say": [
          "Rotary position embedding (RoPE), introduced in 2021 by Su and colleagues, is used in many modern large language models, including the LLaMA family.",
          "Instead of adding a vector, RoPE rotates each pair of numbers in the query and key vectors by an angle that grows with the position: angle = pos * theta.",
          "Rotating a point (x, y) by an angle a gives (x cos a - y sin a, x sin a + y cos a).",
          "The clever part: when a rotated query and a rotated key are compared with a dot product, the result depends only on the DIFFERENCE between their positions. RoPE encodes relative position through absolute rotations.",
          "Different pairs rotate at different speeds (different theta), like the different frequencies of the sinusoidal encoding.",
          "Practice 2 is rotate_pair(x, y, pos, theta): one rotation, returning a tuple rounded to 4 decimals.",
          "The example rotates a point to several positions and shows the dot product between two rotated vectors depends only on their distance."
        ],
        "example": "Two dancers turning at the same speed: how far apart they are facing depends only on how much later one started, not on the time of day.",
        "code": "import math\n\ndef rotate_pair(x, y, pos, theta):\n    a = pos * theta\n    return (round(x * math.cos(a) - y * math.sin(a), 4), round(x * math.sin(a) + y * math.cos(a), 4))\n\nq, k, theta = (1.0, 0.0), (0.6, 0.8), 0.3\nfor qpos, kpos in [(2, 1), (7, 6), (10, 9), (5, 1)]:\n    rq, rk = rotate_pair(*q, qpos, theta), rotate_pair(*k, kpos, theta)\n    dot = rq[0] * rk[0] + rq[1] * rk[1]\n    print(f\"query at {qpos:2}, key at {kpos}: distance {qpos - kpos}, dot {dot:.3f}\")",
        "output": "query at  2, key at 1: distance 1, dot 0.810\nquery at  7, key at 6: distance 1, dot 0.810\nquery at 10, key at 9: distance 1, dot 0.810\nquery at  5, key at 1: distance 4, dot 0.963",
        "codeNotes": [
          {
            "line": 5,
            "note": "A standard 2D rotation by pos * theta."
          },
          {
            "line": 10,
            "note": "The same distance gives the same dot product."
          }
        ],
        "tryIt": "Add pairs (20, 19) and (20, 16). Which dot products match earlier rows?",
        "check": {
          "question": "What does RoPE make the query-key dot product depend on?",
          "options": [
            "The absolute position of the query only",
            "The relative distance between query and key positions",
            "The word's spelling"
          ],
          "answer": 1,
          "why": "Rotations cancel so that only the position difference matters."
        }
      },
      {
        "title": "Choosing a position method",
        "say": [
          "Fixed sinusoidal encodings: no parameters, any length in principle, used in the original Transformer.",
          "Learned absolute embeddings: flexible, used in BERT and GPT-2, but limited to the trained maximum length.",
          "Relative methods: RoPE rotates queries and keys; ALiBi adds a penalty to attention scores that grows with distance. Both help models handle longer inputs.",
          "Context length extension techniques, such as scaling RoPE's frequencies, let models trained on 4,000 tokens work with far longer inputs after a little extra training.",
          "For you as a practitioner, the main point is: position handling decides how well a model copes with long documents, so check it when choosing a model for long-context work.",
          "The example shows ALiBi's idea: subtract a penalty proportional to distance from each attention score.",
          "Nearby words keep their scores; far-away words are gently discouraged, but can still win if they are very relevant."
        ],
        "example": "Hearing voices at a party: nearby people sound louder, but someone far away shouting your name still gets your attention.",
        "code": "scores = [2.0, 2.0, 2.0, 2.0, 3.5]     # raw scores from the last token to positions 0..4\nquery_pos, slope = 4, 0.5\nfor pos, s in enumerate(scores):\n    distance = query_pos - pos\n    print(f\"position {pos}: raw {s}, ALiBi {s - slope * distance}\")",
        "output": "position 0: raw 2.0, ALiBi 0.0\nposition 1: raw 2.0, ALiBi 0.5\nposition 2: raw 2.0, ALiBi 1.0\nposition 3: raw 2.0, ALiBi 1.5\nposition 4: raw 3.5, ALiBi 3.5",
        "codeNotes": [
          {
            "line": 5,
            "note": "The penalty grows linearly with distance."
          }
        ],
        "tryIt": "Make the slope 2.0. Can any distant position still beat the nearest one?",
        "check": {
          "question": "What limitation do learned absolute position embeddings have?",
          "options": [
            "They cannot learn",
            "They cannot handle positions beyond the maximum length seen in training",
            "They are too small"
          ],
          "answer": 1,
          "why": "A learned table has entries only up to the trained length."
        }
      },
      {
        "title": "Practice time: encodings and rotations",
        "say": [
          "Practice 1: positional_encoding(pos, i, d_model). Compute angle = pos / 10000 ** (2 * (i // 2) / d_model), then sin for even i or cos for odd i, rounded.",
          "Checks: position 0 gives sin(0) = 0 and cos(0) = 1; position 1 in dimensions 0 and 1 gives sin(1) and cos(1); position 10 in dimension 2 of 8 gives sin(1) again.",
          "That last check works because 10 / 10000 ** (2/8) = 10 / 10 = 1. A nice example of how the frequencies shrink by powers of 10000.",
          "Practice 2: rotate_pair(x, y, pos, theta). One angle, two formulas, a tuple of rounded values.",
          "Checks: position 0 leaves the point unchanged; a quarter turn (pi / 2) moves (1, 0) to (0, 1); and (2, 1) rotated by 0.3 gives (1.6152, 1.5464).",
          "A good self-check for rotations: the length of the point must not change.",
          "The example verifies that."
        ],
        "example": "Spinning a wheel: every point moves, but its distance from the centre never changes.",
        "code": "import math\n\nx, y = 2.0, 1.0\nfor pos in [0, 3, 10, 50]:\n    a = pos * 0.1\n    rx, ry = x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a)\n    print(f\"pos {pos:2}: ({rx:7.4f}, {ry:7.4f}) length {math.hypot(rx, ry):.4f}\")",
        "output": "pos  0: ( 2.0000,  1.0000) length 2.2361\npos  3: ( 1.6152,  1.5464) length 2.2361\npos 10: ( 0.2391,  2.2232) length 2.2361\npos 50: ( 1.5262, -1.6342) length 2.2361",
        "codeNotes": [
          {
            "line": 7,
            "note": "math.hypot gives the length; rotation keeps it constant."
          }
        ],
        "tryIt": "What angle brings the point back to where it started?",
        "check": {
          "question": "positional_encoding(0, 1, 8) returns?",
          "options": [
            "0.0",
            "1.0",
            "0.5"
          ],
          "answer": 1,
          "why": "At position 0 the angle is 0, and dimension 1 uses cos(0) = 1."
        }
      }
    ],
    "summary": [
      "Self-attention ignores word order, so positions must be added.",
      "Sinusoidal encodings: sin for even and cos for odd dimensions at frequencies set by 10000 ** (2i/d).",
      "Positional vectors are added to token embeddings; BERT and GPT-2 learned them instead.",
      "RoPE rotates query and key pairs by pos × theta so dot products depend on relative distance.",
      "Relative methods (RoPE, ALiBi) help with long contexts; learned absolute tables cannot extend past their length."
    ],
    "projectStep": {
      "title": "Position explorer",
      "steps": [
        "Print the sinusoidal encoding for positions 0-10 with d_model = 8 and describe the patterns.",
        "Rotate a query and key to several positions and confirm the dot product depends only on distance.",
        "Write two sentences with the same words in different orders and explain how position fixes them."
      ]
    }
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Scaled Dot-Product Self-Attention & Positional Encoding Engine",
    "goal": "You can assemble a Transformer encoder layer end to end: add positional encodings to embeddings, run self-attention, apply residual connections and layer normalisation, and follow the shapes through every step.",
    "minutes": 30,
    "recap": "Milestone 3 connects attention (Day 17), scaled dot-product self-attention (Day 18), multiple heads (Day 19) and positional encoding (Day 20) into one working encoder layer.",
    "parts": [
      {
        "title": "The encoder layer, step by step",
        "say": [
          "One Transformer encoder layer takes a sequence of vectors in and returns a sequence of the same shape out, each vector now informed by the whole sentence.",
          "Step 1: look up token embeddings. Step 2: add positional encodings (only before the first layer). Step 3: self-attention mixes information across positions.",
          "Step 4: add the attention output back to its input (the residual connection) and apply layer normalisation.",
          "Step 5: a feed-forward network processes each position on its own. Step 6: another residual connection and layer normalisation.",
          "Because input and output shapes match, layers can be stacked as deep as you like; BERT-base stacks 12.",
          "The example prints the shape of the data after each step for a four-token sentence with 8-dimensional vectors.",
          "Today you build the missing pieces (adding positions, layer normalisation) and run a complete tiny layer."
        ],
        "example": "A factory line where every station takes a tray of parts and passes on a tray of exactly the same size, so you can add more stations whenever you want.",
        "code": "tokens, d_model = 4, 8\nsteps = [\"embeddings\", \"+ positions\", \"self-attention\", \"+ residual, layer norm\",\n         \"feed-forward\", \"+ residual, layer norm\"]\nfor s in steps:\n    print(f\"{s:24} shape ({tokens}, {d_model})\")",
        "output": "embeddings               shape (4, 8)\n+ positions              shape (4, 8)\nself-attention           shape (4, 8)\n+ residual, layer norm   shape (4, 8)\nfeed-forward             shape (4, 8)\n+ residual, layer norm   shape (4, 8)",
        "codeNotes": [
          {
            "line": 5,
            "note": "Every step keeps the shape: one d_model vector per token."
          }
        ],
        "tryIt": "If a sentence has 12 tokens, what shape does each step produce?",
        "check": {
          "question": "Why can Transformer layers be stacked many times?",
          "options": [
            "They share weights",
            "Each layer outputs the same shape it receives",
            "They have no parameters"
          ],
          "answer": 1,
          "why": "Matching input and output shapes let layers be chained freely."
        }
      },
      {
        "title": "Adding positional encodings to a sequence",
        "say": [
          "Practice 1 is add_positions(embeddings): for each token vector at position pos, add the sinusoidal encoding for every dimension i.",
          "Use the formula from Day 20: angle = pos / 10000 ** (2 * (i // 2) / d), sin for even i and cos for odd i, where d is the vector length.",
          "After this step, the first token's vector has 0, 1, 0, 1... added to it (the encoding at position 0), and later tokens get increasingly different patterns.",
          "Round each resulting number to 4 decimals so the output is easy to check.",
          "In real models the embeddings are learned and have hundreds of dimensions, but the operation is exactly this element-by-element addition.",
          "enumerate gives both the position and the vector in one loop, and a second enumerate over each vector gives the dimension index.",
          "The example adds positions to three zero vectors, which shows the pure encoding."
        ],
        "example": "Stamping page numbers onto a stack of identical blank pages: afterwards every page is different.",
        "code": "import math\n\ndef add_positions(embeddings):\n    out = []\n    for pos, vec in enumerate(embeddings):\n        d = len(vec)\n        row = []\n        for i, v in enumerate(vec):\n            angle = pos / 10000 ** (2 * (i // 2) / d)\n            row.append(round(v + (math.sin(angle) if i % 2 == 0 else math.cos(angle)), 4))\n        out.append(row)\n    return out\n\nfor row in add_positions([[0.0] * 4 for _ in range(3)]):\n    print(row)",
        "output": "[0.0, 1.0, 0.0, 1.0]\n[0.8415, 0.5403, 0.01, 1.0]\n[0.9093, -0.4161, 0.02, 0.9998]",
        "codeNotes": [
          {
            "line": 5,
            "note": "pos is the token position; vec is its embedding."
          },
          {
            "line": 10,
            "note": "Add the sin or cos term to each dimension."
          }
        ],
        "tryIt": "Add positions to three identical non-zero vectors. Are the rows still identical afterwards?",
        "check": {
          "question": "What does the first token (position 0) get added in even dimensions?",
          "options": [
            "1",
            "0",
            "Its index"
          ],
          "answer": 1,
          "why": "sin(0) = 0, so even dimensions at position 0 are unchanged."
        }
      },
      {
        "title": "Layer normalisation",
        "say": [
          "As vectors pass through many layers, their values can drift to very large or very small scales, which makes training unstable.",
          "Layer normalisation rescales each vector to have mean 0 and standard deviation 1, across its own dimensions: (x_i - mean) / sqrt(variance + eps).",
          "The small eps (such as 0.00001) prevents division by zero when all values are equal.",
          "Real layer norm then applies a learned scale and shift per dimension, so the network can undo the normalisation where that helps. We leave those out today.",
          "Practice 2 is layer_norm(x, eps=1e-5): compute the mean, the average squared difference (variance), then normalise each value and round to 4 decimals.",
          "The original Transformer normalised after each residual addition (post-norm); many modern models normalise before each sub-layer (pre-norm), which trains more stably when very deep.",
          "The example normalises vectors of different scales and shows they end up comparable."
        ],
        "example": "Converting test scores from different exams to \"how far above or below the class average\" so they can be compared fairly.",
        "code": "import math\n\ndef layer_norm(x, eps=1e-5):\n    mean = sum(x) / len(x)\n    var = sum((v - mean) ** 2 for v in x) / len(x)\n    return [round((v - mean) / math.sqrt(var + eps), 4) for v in x]\n\nfor x in [[1.0, 2.0, 3.0], [100.0, 200.0, 300.0], [5.0, 5.0, 5.0]]:\n    print(x, \"->\", layer_norm(x))",
        "output": "[1.0, 2.0, 3.0] -> [-1.2247, 0.0, 1.2247]\n[100.0, 200.0, 300.0] -> [-1.2247, 0.0, 1.2247]\n[5.0, 5.0, 5.0] -> [0.0, 0.0, 0.0]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Variance: average squared distance from the mean."
          },
          {
            "line": 6,
            "note": "eps keeps the division safe when variance is 0."
          }
        ],
        "tryIt": "Why do [1, 2, 3] and [100, 200, 300] normalise to the same result?",
        "check": {
          "question": "What does layer normalisation make each vector have?",
          "options": [
            "All values equal to 1",
            "Mean 0 and standard deviation 1 (before the learned scale and shift)",
            "Only positive values"
          ],
          "answer": 1,
          "why": "It centres and scales each vector across its dimensions."
        }
      },
      {
        "title": "Residual connections in the layer",
        "say": [
          "Each sub-layer's output is added to its input before normalising: output = LayerNorm(x + SubLayer(x)).",
          "If a sub-layer has nothing useful to add yet (early in training), its output can be near zero and the input passes through almost unchanged.",
          "This makes deep stacks trainable: gradients can flow straight back through the additions, the same idea as the LSTM cell state on Day 14.",
          "Residual connections were introduced for image networks (ResNet, 2015) and are now in almost every deep network.",
          "The example runs one position through attention output, residual addition and layer norm, then the same for the feed-forward step.",
          "Watch how the vector stays well scaled after each normalisation.",
          "Without residuals and normalisation, stacking 12 or 96 layers would be nearly impossible to train."
        ],
        "example": "Editing a document with tracked changes: each editor adds suggestions on top of the original instead of rewriting it from scratch.",
        "code": "import math\n\ndef layer_norm(x, eps=1e-5):\n    m = sum(x) / len(x); var = sum((v - m) ** 2 for v in x) / len(x)\n    return [(v - m) / math.sqrt(var + eps) for v in x]\n\nx = [2.0, -1.0, 0.5, 3.0]\nattn = [0.3, 0.2, -0.1, 0.4]\nh = layer_norm([a + b for a, b in zip(x, attn)])\nffn = [max(0.0, v) * 0.5 for v in h]\nout = layer_norm([a + b for a, b in zip(h, ffn)])\nprint(\"after attention block:\", [round(v, 3) for v in h])\nprint(\"after feed-forward:   \", [round(v, 3) for v in out])",
        "output": "after attention block: [0.598, -1.304, -0.567, 1.273]\nafter feed-forward:    [0.531, -1.23, -0.641, 1.34]",
        "codeNotes": [
          {
            "line": 9,
            "note": "Residual addition, then layer norm."
          },
          {
            "line": 11,
            "note": "The same pattern around the feed-forward step."
          }
        ],
        "tryIt": "Replace attn with zeros. What does the first block output? Why is that useful early in training?",
        "check": {
          "question": "In LayerNorm(x + SubLayer(x)), what does \"x +\" provide?",
          "options": [
            "Positional information",
            "A residual path so the input can pass straight through",
            "The attention weights"
          ],
          "answer": 1,
          "why": "The residual keeps the input and lets gradients flow directly."
        }
      },
      {
        "title": "A complete tiny encoder layer",
        "say": [
          "Now all the pieces run together on a real (tiny) example.",
          "We start from three 4-dimensional embeddings, add positions, compute self-attention with the vectors themselves as queries, keys and values (real models use learned projections), then add, normalise, feed forward, add and normalise again.",
          "The output has the same shape as the input, and each vector now carries information from the other tokens.",
          "Printing the attention weights shows which tokens each token looked at.",
          "This is, in miniature, exactly what happens in each of BERT's 12 layers, repeated for every token of every sentence.",
          "Take the time to read the example line by line; every line is something you have built this week.",
          "When you can explain this code, you understand the core of the Transformer."
        ],
        "example": "A small working model of a steam engine: every real part is there, just tiny, so you can watch each one move.",
        "code": "import math\n\ndef pe(pos, i, d):\n    a = pos / 10000 ** (2 * (i // 2) / d); return math.sin(a) if i % 2 == 0 else math.cos(a)\ndef norm(x):\n    m = sum(x) / len(x); v = sum((t - m) ** 2 for t in x) / len(x); return [(t - m) / math.sqrt(v + 1e-5) for t in x]\nemb = [[1.0, 0.0, 0.5, 0.0], [0.0, 1.0, 0.0, 0.5], [1.0, 1.0, 0.0, 0.0]]\nx = [[v + pe(p, i, 4) for i, v in enumerate(row)] for p, row in enumerate(emb)]\nout = []\nfor q in x:\n    s = [sum(a * b for a, b in zip(q, k)) / 2 for k in x]\n    e = [math.exp(t - max(s)) for t in s]; w = [t / sum(e) for t in e]\n    ctx = [sum(wi * k[j] for wi, k in zip(w, x)) for j in range(4)]\n    h = norm([a + b for a, b in zip(q, ctx)])\n    out.append(norm([a + max(0.0, b) for a, b in zip(h, h)]))\n    print(\"attention weights:\", [round(t, 3) for t in w])\nprint(\"output shape:\", len(out), \"x\", len(out[0]))",
        "output": "attention weights: [0.285, 0.392, 0.323]\nattention weights: [0.243, 0.5, 0.258]\nattention weights: [0.228, 0.293, 0.479]\noutput shape: 3 x 4",
        "codeNotes": [
          {
            "line": 8,
            "note": "Embeddings plus positions."
          },
          {
            "line": 11,
            "note": "Scaled scores (sqrt(4) = 2)."
          },
          {
            "line": 14,
            "note": "Residual and layer norm."
          }
        ],
        "tryIt": "Which token does the third token attend to most? Change its embedding and see.",
        "check": {
          "question": "What shape does the encoder layer output for 3 tokens with d_model = 4?",
          "options": [
            "(4, 3)",
            "(3, 4)",
            "(1, 4)"
          ],
          "answer": 1,
          "why": "One d_model-sized vector per token, the same shape as the input."
        }
      },
      {
        "title": "Milestone practice: positions and normalisation",
        "say": [
          "Practice 1: add_positions(embeddings). Two nested loops with enumerate; add sin for even dimensions and cos for odd ones, using angle = pos / 10000 ** (2 * (i // 2) / d); round to 4 decimals.",
          "The checks use zero vectors (pure encoding) and a row of ones at position 2, so both the encoding and the addition are verified.",
          "Practice 2: layer_norm(x, eps=1e-5). Mean, variance as the average squared difference, then (v - mean) / sqrt(var + eps), rounded.",
          "A constant vector must give all zeros, not an error; that is what eps protects.",
          "Use the population variance (divide by len(x)), not the sample variance (divide by len(x) - 1); layer norm uses the population form.",
          "Congratulations on Milestone 3: you have built every component of a Transformer encoder layer in plain Python.",
          "The example shows the difference between population and sample variance, a common source of small mismatches."
        ],
        "example": "Measuring the spread of heights in the whole class (population) versus estimating it from a few students (sample).",
        "code": "import statistics\n\nx = [2.0, 4.0, 6.0, 8.0]\nprint(\"population variance (layer norm):\", statistics.pvariance(x))\nprint(\"sample variance:                \", round(statistics.variance(x), 4))",
        "output": "population variance (layer norm): 5.0\nsample variance:                 6.6667",
        "codeNotes": [
          {
            "line": 4,
            "note": "Divides by n: what layer norm uses."
          },
          {
            "line": 5,
            "note": "Divides by n - 1: used in statistics for estimates."
          }
        ],
        "tryIt": "Normalise [2, 4, 6, 8] by hand with the population variance. Do you get about -1.34, -0.45, 0.45, 1.34?",
        "check": {
          "question": "layer_norm([5.0, 5.0]) returns?",
          "options": [
            "An error",
            "[0.0, 0.0]",
            "[1.0, 1.0]"
          ],
          "answer": 1,
          "why": "Every value equals the mean, so each becomes 0; eps prevents division by zero."
        }
      }
    ],
    "summary": [
      "An encoder layer: embeddings + positions, self-attention, residual + layer norm, feed-forward, residual + layer norm.",
      "Every step keeps the shape (tokens × d_model), so layers stack.",
      "Positional encodings are added element by element before the first layer.",
      "Layer norm rescales each vector to mean 0 and standard deviation 1 (population variance, plus eps).",
      "Residual connections let information and gradients bypass each sub-layer."
    ],
    "projectStep": {
      "title": "Milestone 3: your own encoder layer",
      "steps": [
        "Pick a four-word sentence and give each word a 4-dimensional embedding.",
        "Run it through add_positions, self-attention, residuals and layer_norm.",
        "Print the attention weights and describe which words attend to which."
      ]
    }
  },
  {
    "day": 22,
    "title": "Modern Subword Tokenization: Byte-Pair Encoding (BPE) & WordPiece",
    "goal": "You can explain why modern models use subword tokens, run byte-pair encoding merges by hand, find the most frequent adjacent pair, tokenise new words with learned merges, and compare BPE with WordPiece.",
    "minutes": 30,
    "recap": "Word-level models struggle with unknown words (Day 8), and character-level models make sequences very long. Modern language models split text into subwords, learned from data with byte-pair encoding.",
    "parts": [
      {
        "title": "Words, characters or subwords?",
        "say": [
          "Every model needs a fixed vocabulary of tokens. The choice of token has big consequences.",
          "Word tokens: sequences are short, but the vocabulary is huge and still misses new words, typos and names (the OOV problem).",
          "Character tokens: the vocabulary is tiny and nothing is unknown, but sequences become very long, and attention cost grows with the square of the length.",
          "Subword tokens sit in between. Frequent words stay whole (\"the\", \"running\"), rare words split into meaningful pieces (\"un\", \"believ\", \"able\"), and any string can still be represented.",
          "GPT models use byte-pair encoding (BPE) on bytes, so literally any text, in any language or with emoji, can be tokenised.",
          "The example compares sequence lengths for the three choices on one sentence.",
          "Token counts matter in practice: API prices and context limits for large language models are measured in tokens."
        ],
        "example": "Building words from Lego: whole bricks for common shapes, smaller pieces for unusual ones, and you can always build anything.",
        "code": "sentence = \"unbelievable tokenisation results\"\nwords = sentence.split()\nchars = list(sentence.replace(\" \", \"_\"))\nsubwords = [\"un\", \"believ\", \"able\", \"_token\", \"isation\", \"_results\"]\nprint(\"word tokens:    \", len(words), words)\nprint(\"character tokens:\", len(chars))\nprint(\"subword tokens: \", len(subwords), subwords)",
        "output": "word tokens:     3 ['unbelievable', 'tokenisation', 'results']\ncharacter tokens: 33\nsubword tokens:  6 ['un', 'believ', 'able', '_token', 'isation', '_results']",
        "codeNotes": [
          {
            "line": 4,
            "note": "A plausible subword split: frequent pieces, and nothing is ever unknown."
          }
        ],
        "tryIt": "How would a word-level model handle \"unbelievability\"? How would subwords?",
        "check": {
          "question": "What is the main advantage of subword tokens over word tokens?",
          "options": [
            "Shorter sequences than words",
            "No unknown words, with a manageable vocabulary",
            "They ignore spelling"
          ],
          "answer": 1,
          "why": "Rare words split into known pieces, so nothing is out of vocabulary."
        }
      },
      {
        "title": "How byte-pair encoding learns",
        "say": [
          "Byte-pair encoding started as a data compression method (Gage, 1994) and was adapted for NLP by Sennrich and colleagues in 2016.",
          "Training starts with every word split into characters. Then it repeats one step: find the most frequent pair of adjacent tokens in the corpus, and merge it into a new token.",
          "Each merge adds one token to the vocabulary. Stop after a chosen number of merges, for example 30,000 or 50,000.",
          "Early merges create common pairs like \"t\"+\"h\" -> \"th\", then \"th\"+\"e\" -> \"the\". Later merges build longer frequent pieces.",
          "The list of merges, in order, IS the tokenizer. To tokenise new text, apply the same merges in the same order.",
          "Practice 2 is most_frequent_pair(tokens): count adjacent pairs and return the most frequent, with ties going to the pair seen first.",
          "The example counts pairs in a tiny corpus and shows the first merge."
        ],
        "example": "Noticing that you often write \"t h e\" and inventing a shorthand for it, then noticing another common combination, and so on.",
        "code": "from collections import Counter\n\ntokens = list(\"low_lower_lowest\")\npairs = Counter(zip(tokens, tokens[1:]))\nprint(\"most common pairs:\", pairs.most_common(3))\nbest = max(pairs, key=pairs.get)\nprint(\"first merge:\", best, \"->\", \"\".join(best))",
        "output": "most common pairs: [(('l', 'o'), 3), (('o', 'w'), 3), (('_', 'l'), 2)]\nfirst merge: ('l', 'o') -> lo",
        "codeNotes": [
          {
            "line": 4,
            "note": "Count every adjacent pair."
          },
          {
            "line": 6,
            "note": "max keeps the first of equally frequent pairs."
          }
        ],
        "tryIt": "After merging (\"l\", \"o\") into \"lo\", what pair would you expect to merge next?",
        "check": {
          "question": "What does each BPE training step do?",
          "options": [
            "Deletes rare words",
            "Merges the most frequent adjacent pair of tokens into a new token",
            "Splits words into characters"
          ],
          "answer": 1,
          "why": "Repeatedly merging frequent pairs builds the subword vocabulary."
        }
      },
      {
        "title": "Applying a merge",
        "say": [
          "Practice 1 is merge_pair(tokens, pair, new_token): scan left to right and replace each adjacent occurrence of the pair with the new token.",
          "Merged tokens are not reused for an overlapping match. In [\"a\", \"a\", \"a\"] merging (\"a\", \"a\") gives [\"aa\", \"a\"], not [\"aa\", \"aa\"].",
          "A while loop with an index is the cleanest way: if the current and next token form the pair, append the new token and skip two; otherwise append the current token and move one.",
          "A for loop would not work well here, because you sometimes need to skip ahead.",
          "Pair order matters: (\"x\", \"y\") does not match \"y\" followed by \"x\".",
          "The example performs several merges in a row on the same text, just as BPE training does.",
          "Watch the token count drop with each merge; that compression is where BPE got its name."
        ],
        "example": "Finding every \"t h\" in a line of text and replacing it with a single \"th\" tile, moving left to right.",
        "code": "def merge_pair(tokens, pair, new_token):\n    out, i = [], 0\n    while i < len(tokens):\n        if i + 1 < len(tokens) and (tokens[i], tokens[i + 1]) == tuple(pair):\n            out.append(new_token); i += 2\n        else:\n            out.append(tokens[i]); i += 1\n    return out\n\ntokens = list(\"the_theme_then\")\nfor pair in [(\"t\", \"h\"), (\"th\", \"e\"), (\"the\", \"m\")]:\n    tokens = merge_pair(tokens, pair, \"\".join(pair))\n    print(f\"merge {pair}: {len(tokens)} tokens {tokens}\")",
        "output": "merge ('t', 'h'): 11 tokens ['th', 'e', '_', 'th', 'e', 'm', 'e', '_', 'th', 'e', 'n']\nmerge ('th', 'e'): 8 tokens ['the', '_', 'the', 'm', 'e', '_', 'the', 'n']\nmerge ('the', 'm'): 7 tokens ['the', '_', 'them', 'e', '_', 'the', 'n']",
        "codeNotes": [
          {
            "line": 5,
            "note": "Replace the pair and skip both tokens."
          },
          {
            "line": 12,
            "note": "Each merge builds on the previous ones."
          }
        ],
        "tryIt": "What does merge_pair(list(\"aaaa\"), (\"a\", \"a\"), \"aa\") give?",
        "check": {
          "question": "merge_pair([\"a\", \"a\", \"a\"], (\"a\", \"a\"), \"aa\") returns?",
          "options": [
            "[\"aa\", \"aa\"]",
            "[\"aa\", \"a\"]",
            "[\"a\", \"aa\"]"
          ],
          "answer": 1,
          "why": "Scanning left to right, the first two merge; the third a has no partner left."
        }
      },
      {
        "title": "Tokenising new text",
        "say": [
          "After training, you have an ordered list of merges. To tokenise a new word, start from its characters and apply the merges in the order they were learned.",
          "Frequent words end up as a single token; rare or new words end up as several pieces, down to single characters if needed.",
          "Because the pieces carry meaning, models can often guess a new word's meaning, as FastText did with n-grams.",
          "GPT-2 and later models apply BPE to bytes, with a special marker for spaces, so tokens like \" the\" (with a leading space) are common.",
          "Tokenisation affects cost and fairness: languages under-represented in the training data are split into more tokens per word, so the same message costs more and uses more of the context window.",
          "The example tokenises three words with a small list of learned merges.",
          "Always count tokens, not words, when you estimate what a prompt will cost."
        ],
        "example": "A phrasebook learned from a holiday: common phrases you can say in one go, unusual ones you build word by word.",
        "code": "merges = [(\"l\", \"o\"), (\"lo\", \"w\"), (\"e\", \"r\"), (\"low\", \"er\"), (\"e\", \"s\"), (\"es\", \"t\")]\n\ndef tokenise(word):\n    tokens = list(word)\n    for a, b in merges:\n        out, i = [], 0\n        while i < len(tokens):\n            if i + 1 < len(tokens) and tokens[i] == a and tokens[i + 1] == b:\n                out.append(a + b); i += 2\n            else:\n                out.append(tokens[i]); i += 1\n        tokens = out\n    return tokens\n\nfor w in [\"lower\", \"lowest\", \"slower\", \"newest\"]:\n    print(f\"{w:8} -> {tokenise(w)}\")",
        "output": "lower    -> ['lower']\nlowest   -> ['low', 'est']\nslower   -> ['s', 'lower']\nnewest   -> ['n', 'e', 'w', 'est']",
        "codeNotes": [
          {
            "line": 5,
            "note": "Apply the merges in the order they were learned."
          }
        ],
        "tryIt": "Add the merge (\"n\", \"e\") at the end. How does \"newest\" change?",
        "check": {
          "question": "How is a new word tokenised with BPE?",
          "options": [
            "Looked up in a dictionary",
            "Split into characters, then the learned merges are applied in order",
            "Replaced with an unknown token"
          ],
          "answer": 1,
          "why": "The ordered merge list is applied to the characters of the word."
        }
      },
      {
        "title": "WordPiece and SentencePiece",
        "say": [
          "WordPiece, used by BERT, is similar to BPE but chooses merges by how much they increase the likelihood of the training data, not just raw frequency.",
          "BERT marks pieces that continue a word with \"##\": \"playing\" might be \"play\" and \"##ing\". That tells the model which pieces start words.",
          "SentencePiece (used by T5, LLaMA and many multilingual models) treats the input as a raw stream, including spaces, so it works for languages without spaces between words, such as Japanese or Thai.",
          "SentencePiece supports BPE and a unigram language model method, which starts with many pieces and removes the least useful ones.",
          "All of these share the core idea: a data-driven vocabulary of subwords that covers any text.",
          "The example shows a WordPiece-style greedy longest-match tokeniser over a small vocabulary.",
          "Greedy longest match takes the longest vocabulary piece that fits at the start, then continues with ## pieces."
        ],
        "example": "Spelling a long word by always grabbing the longest chunk you recognise from the start.",
        "code": "vocab = {\"play\", \"##ing\", \"##ed\", \"##er\", \"un\", \"##play\", \"##able\", \"p\", \"##l\", \"##a\", \"##y\"}\n\ndef wordpiece(word):\n    pieces, start = [], 0\n    while start < len(word):\n        for end in range(len(word), start, -1):\n            piece = word[start:end] if start == 0 else \"##\" + word[start:end]\n            if piece in vocab:\n                pieces.append(piece); start = end; break\n        else:\n            return [\"[UNK]\"]\n    return pieces\n\nfor w in [\"playing\", \"played\", \"unplayable\", \"xyz\"]:\n    print(f\"{w:11} -> {wordpiece(w)}\")",
        "output": "playing     -> ['play', '##ing']\nplayed      -> ['play', '##ed']\nunplayable  -> ['un', '##play', '##able']\nxyz         -> ['[UNK]']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Try the longest possible piece first."
          },
          {
            "line": 10,
            "note": "for/else: runs only if no piece matched."
          }
        ],
        "tryIt": "Add \"##s\" to the vocabulary and tokenise \"plays\".",
        "check": {
          "question": "In BERT's WordPiece, what does \"##\" mean?",
          "options": [
            "A hashtag",
            "The piece continues a word rather than starting one",
            "An unknown token"
          ],
          "answer": 1,
          "why": "\"##ing\" marks a piece attached to the previous piece."
        }
      },
      {
        "title": "Practice time: merges",
        "say": [
          "Practice 1: merge_pair(tokens, pair, new_token). A while loop with an index; compare (tokens[i], tokens[i + 1]) with tuple(pair) so both lists and tuples work as the pair.",
          "Checks: a single merge in \"lower\", no overlap in \"aaa\", every occurrence in \"the the\", and a reversed pair that must not match.",
          "Practice 2: most_frequent_pair(tokens). Count pairs with a dictionary (which keeps first-seen order), return None for fewer than two tokens, and pick max by count.",
          "Python's max returns the first item among equal maxima, and dictionaries remember insertion order, so ties automatically go to the pair seen first.",
          "Together these two functions are a complete BPE trainer: repeat \"find the most frequent pair, merge it\" as many times as you want tokens.",
          "The example runs that loop for four merges on a small corpus.",
          "Watching the vocabulary grow one merge at a time makes BPE feel much less mysterious."
        ],
        "example": "A snowball rolling downhill: each turn it picks up the most common combination and grows a little.",
        "code": "from collections import Counter\n\ntokens = list(\"low_lower_lowest_newest\")\nfor step in range(1, 5):\n    counts = {}\n    for p in zip(tokens, tokens[1:]):\n        counts[p] = counts.get(p, 0) + 1\n    best = max(counts, key=counts.get)\n    out, i = [], 0\n    while i < len(tokens):\n        if i + 1 < len(tokens) and (tokens[i], tokens[i + 1]) == best:\n            out.append(\"\".join(best)); i += 2\n        else:\n            out.append(tokens[i]); i += 1\n    tokens = out\n    print(f\"step {step}: merged {best} -> {len(tokens)} tokens\")\nprint(tokens)",
        "output": "step 1: merged ('l', 'o') -> 20 tokens\nstep 2: merged ('lo', 'w') -> 17 tokens\nstep 3: merged ('_', 'low') -> 15 tokens\nstep 4: merged ('_low', 'e') -> 13 tokens\n['low', '_lowe', 'r', '_lowe', 's', 't', '_', 'n', 'e', 'w', 'e', 's', 't']",
        "codeNotes": [
          {
            "line": 8,
            "note": "The most frequent pair, first seen wins ties."
          },
          {
            "line": 15,
            "note": "The corpus shrinks with every merge."
          }
        ],
        "tryIt": "Run eight steps instead of four. Which whole words appear as single tokens?",
        "check": {
          "question": "most_frequent_pair([\"a\"]) returns?",
          "options": [
            "(\"a\", \"a\")",
            "None",
            "[]"
          ],
          "answer": 1,
          "why": "One token has no adjacent pair."
        }
      }
    ],
    "summary": [
      "Subword tokens balance vocabulary size and sequence length and avoid unknown words.",
      "BPE training repeatedly merges the most frequent adjacent pair; the ordered merges are the tokenizer.",
      "Merging scans left to right without overlapping matches.",
      "New text is tokenised by applying the learned merges in order; rare words become several pieces.",
      "WordPiece (BERT, \"##\" pieces) and SentencePiece are close relatives; tokens drive cost and context limits."
    ],
    "projectStep": {
      "title": "Train a tiny BPE tokenizer",
      "steps": [
        "Take a paragraph of your own text and split it into characters.",
        "Run 20 merges with most_frequent_pair and merge_pair, recording the merge list.",
        "Tokenise three new words with your merges and count the tokens."
      ]
    }
  },
  {
    "day": 23,
    "title": "BERT: Bidirectional Encoder Representations from Transformers",
    "goal": "You can explain how BERT learns bidirectional context with masked language modelling, apply the 15 percent and 80/10/10 masking rule, build BERT inputs with [CLS], [SEP] and segment ids, and describe fine-tuning for downstream tasks.",
    "minutes": 30,
    "recap": "You have built the Transformer encoder (Day 21) and a subword tokenizer (Day 22). BERT puts them together and pre-trains on huge amounts of text, creating word representations that depend on context.",
    "parts": [
      {
        "title": "Contextual embeddings",
        "say": [
          "Word2Vec and GloVe give \"bank\" one vector, whether it means a river bank or a money bank.",
          "BERT (Bidirectional Encoder Representations from Transformers, Devlin and colleagues at Google, 2018) gives each word a vector that depends on the whole sentence.",
          "In \"she sat on the river bank\" and \"she opened a bank account\", the vector for \"bank\" comes out different, because self-attention mixes in the surrounding words.",
          "BERT is a stack of Transformer encoder layers (12 in BERT-base, 24 in BERT-large), pre-trained on books and Wikipedia.",
          "Pre-training taught it general language knowledge; you then fine-tune it on a small labelled dataset for your task.",
          "When it was released, BERT set new records on eleven NLP benchmarks at once, and \"pre-train, then fine-tune\" became the standard recipe.",
          "The example shows how context words would pull the meaning of \"bank\" in different directions."
        ],
        "example": "A word's meaning in a conversation: \"cool\" means something different when talking about the weather than about a new phone.",
        "code": "context_votes = {\n    \"river\": {\"nature\": 1.0}, \"sat\": {\"nature\": 0.3}, \"water\": {\"nature\": 1.0},\n    \"account\": {\"money\": 1.0}, \"opened\": {\"money\": 0.5}, \"loan\": {\"money\": 1.0},\n}\ndef sense(sentence):\n    totals = {\"nature\": 0.0, \"money\": 0.0}\n    for w in sentence.split():\n        for k, v in context_votes.get(w, {}).items():\n            totals[k] += v\n    return max(totals, key=totals.get), totals\nprint(sense(\"she sat on the river bank\"))\nprint(sense(\"she opened a bank account\"))",
        "output": "('nature', {'nature': 1.3, 'money': 0.0})\n('money', {'nature': 0.0, 'money': 1.5})",
        "codeNotes": [
          {
            "line": 8,
            "note": "Surrounding words push the meaning one way or the other."
          }
        ],
        "tryIt": "Try \"the bank near the water gave me a loan\". What happens when context is mixed?",
        "check": {
          "question": "How do BERT's word vectors differ from Word2Vec's?",
          "options": [
            "They are shorter",
            "They depend on the surrounding sentence",
            "They ignore the word itself"
          ],
          "answer": 1,
          "why": "BERT produces contextual vectors, so the same word can get different vectors in different sentences."
        }
      },
      {
        "title": "Masked language modelling",
        "say": [
          "To learn from both left and right context, BERT cannot simply predict the next word; that would only use the left side.",
          "Instead it uses a masked language model: hide some words and train the model to predict them from all the surrounding words.",
          "BERT selects 15 percent of the tokens in each sentence for prediction.",
          "Of those selected, 80 percent are replaced with a special [MASK] token, 10 percent with a random token, and 10 percent are left unchanged.",
          "Why not always use [MASK]? Because [MASK] never appears when BERT is used later. The random and unchanged cases make the model build good representations for every token, not only masked ones.",
          "Practice 1 is bert_mask_plan(n_tokens): how many tokens are selected, masked, replaced randomly and left unchanged, with the parts always adding up.",
          "The example applies the rule to a sentence with a seeded random generator."
        ],
        "example": "A fill-in-the-blanks exercise where you may use every word before and after the gap to guess it.",
        "code": "import random\n\nrng = random.Random(3)\ntokens = \"the cat sat on the mat because it was tired and warm\".split()\nvocab = [\"dog\", \"blue\", \"ran\", \"table\"]\npicked = sorted(rng.sample(range(len(tokens)), max(1, round(len(tokens) * 0.15))))\nmasked = list(tokens)\nfor i in picked:\n    r = rng.random()\n    masked[i] = \"[MASK]\" if r < 0.8 else (rng.choice(vocab) if r < 0.9 else tokens[i])\nprint(\"selected positions:\", picked)\nprint(\" \".join(masked))",
        "output": "selected positions: [3, 9]\nthe cat sat [MASK] the mat because it was [MASK] and warm",
        "codeNotes": [
          {
            "line": 6,
            "note": "About 15 percent of positions are chosen."
          },
          {
            "line": 10,
            "note": "80 percent [MASK], 10 percent random, 10 percent unchanged."
          }
        ],
        "tryIt": "Change the seed several times. Do you ever see a random replacement or an unchanged token?",
        "check": {
          "question": "Why does BERT sometimes leave a selected token unchanged?",
          "options": [
            "To save time",
            "Because [MASK] never appears at fine-tuning time, so the model must handle real tokens too",
            "It is a bug"
          ],
          "answer": 1,
          "why": "The 80/10/10 mix reduces the mismatch between pre-training and later use."
        }
      },
      {
        "title": "Counting the masking plan",
        "say": [
          "For a batch of text, it helps to know how many tokens fall in each category.",
          "selected = round(n * 0.15), mask = round(selected * 0.8), random = round(selected * 0.1), and unchanged = selected - mask - random.",
          "Computing the last category as \"whatever is left\" guarantees the three parts add up to the selected total, even when rounding would otherwise make them disagree.",
          "This \"compute the remainder\" trick is useful any time you split a whole number into rounded shares.",
          "For 1,000 tokens: 150 selected, 120 masked, 15 random, 15 unchanged.",
          "The example shows what goes wrong with rounding every part independently.",
          "Small bookkeeping details like this often decide whether numbers in a report add up."
        ],
        "example": "Splitting a restaurant bill: everyone rounds their share, and the last person pays whatever is left so the total is exact.",
        "code": "for n in [1000, 33, 87]:\n    selected = round(n * 0.15)\n    mask, rand = round(selected * 0.8), round(selected * 0.1)\n    independent = round(selected * 0.1)\n    remainder = selected - mask - rand\n    print(f\"n={n:4}: selected {selected}, mask {mask}, random {rand},\"\n          f\" unchanged {remainder} (independent rounding would say {independent}, total {mask + rand + independent})\")",
        "output": "n=1000: selected 150, mask 120, random 15, unchanged 15 (independent rounding would say 15, total 150)\nn=  33: selected 5, mask 4, random 0, unchanged 1 (independent rounding would say 0, total 4)\nn=  87: selected 13, mask 10, random 1, unchanged 2 (independent rounding would say 1, total 12)",
        "codeNotes": [
          {
            "line": 5,
            "note": "The remainder keeps the total exact."
          }
        ],
        "tryIt": "For n = 33 and n = 87, which approach gives parts that add up to the selected count?",
        "check": {
          "question": "Why compute \"unchanged\" as selected - mask - random?",
          "options": [
            "It is faster",
            "So the three parts always add up to the selected total",
            "BERT requires it"
          ],
          "answer": 1,
          "why": "Using the remainder avoids rounding mismatches."
        }
      },
      {
        "title": "BERT's input format",
        "say": [
          "BERT inputs follow a fixed format built from special tokens.",
          "[CLS] goes at the start of every input. Its final vector is used as a summary of the whole input for classification tasks.",
          "[SEP] marks the end of a sentence. For tasks with two sentences (question and passage, or two sentences to compare), the input is [CLS] A [SEP] B [SEP].",
          "Segment ids (also called token type ids) tell the model which sentence each token belongs to: 0 for the first part (including [CLS] and the first [SEP]), 1 for the second.",
          "BERT also adds learned position embeddings, and the maximum input length for BERT-base is 512 tokens.",
          "Practice 2 is bert_input(tokens_a, tokens_b=None): return the token list and segment ids in exactly this format.",
          "The example builds inputs for a single sentence and for a sentence pair."
        ],
        "example": "A standard form with a header box, a first section, a divider, a second section and an end mark, so every clerk reads it the same way.",
        "code": "def bert_input(tokens_a, tokens_b=None):\n    tokens = [\"[CLS]\"] + list(tokens_a) + [\"[SEP]\"]\n    segments = [0] * len(tokens)\n    if tokens_b is not None:\n        tokens += list(tokens_b) + [\"[SEP]\"]\n        segments += [1] * (len(tokens_b) + 1)\n    return tokens, segments\n\nprint(bert_input([\"hello\", \"world\"]))\ntoks, segs = bert_input([\"is\", \"it\", \"raining\"], [\"take\", \"an\", \"umbrella\"])\nfor t, s in zip(toks, segs):\n    print(f\"{t:9} segment {s}\")",
        "output": "(['[CLS]', 'hello', 'world', '[SEP]'], [0, 0, 0, 0])\n[CLS]     segment 0\nis        segment 0\nit        segment 0\nraining   segment 0\n[SEP]     segment 0\ntake      segment 1\nan        segment 1\numbrella  segment 1\n[SEP]     segment 1",
        "codeNotes": [
          {
            "line": 3,
            "note": "Everything up to and including the first [SEP] is segment 0."
          },
          {
            "line": 6,
            "note": "Sentence B and its [SEP] are segment 1."
          }
        ],
        "tryIt": "How long can tokens_a and tokens_b be together if the limit is 512 tokens?",
        "check": {
          "question": "Where does BERT put the [CLS] token?",
          "options": [
            "At the end",
            "At the very start of every input",
            "Between the two sentences"
          ],
          "answer": 1,
          "why": "[CLS] always comes first; its final vector summarises the input."
        }
      },
      {
        "title": "Fine-tuning BERT",
        "say": [
          "After pre-training, BERT is adapted to a task by adding a small output layer and training everything a little more on labelled data.",
          "For sentence classification (sentiment, topic), the [CLS] vector feeds a classifier layer.",
          "For token tagging (named entities, Day 11), every token's vector feeds a tag classifier.",
          "For question answering (Day 25), two small layers score each passage token as a possible start or end of the answer.",
          "Fine-tuning needs far less labelled data than training from scratch, often a few thousand examples, because BERT already knows a lot about language.",
          "Variants followed quickly: RoBERTa (trained longer on more data without the next-sentence task), DistilBERT (smaller and faster), and multilingual and domain versions such as BioBERT.",
          "The example maps each task type to the part of BERT's output it uses."
        ],
        "example": "Hiring an experienced chef and teaching them your restaurant's menu, instead of teaching someone to cook from scratch.",
        "code": "tasks = {\n    \"sentiment of a review\": \"the [CLS] vector -> class probabilities\",\n    \"named entities\": \"every token vector -> BIO tag\",\n    \"question answering\": \"every passage token -> start and end scores\",\n    \"are two sentences paraphrases?\": \"[CLS] vector of [CLS] A [SEP] B [SEP] -> yes/no\",\n}\nfor task, head in tasks.items():\n    print(f\"{task:32} uses {head}\")",
        "output": "sentiment of a review            uses the [CLS] vector -> class probabilities\nnamed entities                   uses every token vector -> BIO tag\nquestion answering               uses every passage token -> start and end scores\nare two sentences paraphrases?   uses [CLS] vector of [CLS] A [SEP] B [SEP] -> yes/no",
        "codeNotes": [
          {
            "line": 3,
            "note": "Token-level tasks use every output vector."
          }
        ],
        "tryIt": "Which output would you use for classifying support tickets by department?",
        "check": {
          "question": "Why does fine-tuning BERT need relatively little labelled data?",
          "options": [
            "BERT has no parameters",
            "Pre-training already taught it general language knowledge",
            "Labels are not needed at all"
          ],
          "answer": 1,
          "why": "Most of the learning happened during pre-training on unlabelled text."
        }
      },
      {
        "title": "Practice time: masking and inputs",
        "say": [
          "Practice 1: bert_mask_plan(n_tokens). selected = round(n_tokens * 0.15); mask = round(selected * 0.8); random = round(selected * 0.1); unchanged = the remainder.",
          "Checks: 1,000 tokens give 150, 120, 15, 15; 128 tokens give 19, 15, 2, 2; and for 7 tokens the parts must add up.",
          "Note that \"random\" is a Python module name. Inside your function, prefer a variable name like random_count to avoid confusion, while the returned dictionary key stays \"random\".",
          "Practice 2: bert_input(tokens_a, tokens_b=None). Build the token list and segment ids; only add the second part when tokens_b is given.",
          "Use \"is not None\" rather than just \"if tokens_b\", so an empty second sentence still gets its [SEP] and segment 1.",
          "Both functions are small, but they are exactly the preprocessing real BERT pipelines perform before every training step.",
          "The example shows why \"is not None\" and a plain truth test behave differently."
        ],
        "example": "Checking whether a parcel is expected at all, versus checking whether the parcel that arrived is empty.",
        "code": "for tokens_b in [None, [], [\"x\"]]:\n    print(f\"{tokens_b!r:6} truthy: {bool(tokens_b)!s:5}  is not None: {tokens_b is not None}\")",
        "output": "None   truthy: False  is not None: False\n[]     truthy: False  is not None: True\n['x']  truthy: True   is not None: True",
        "codeNotes": [
          {
            "line": 2,
            "note": "An empty list is falsy but is still \"not None\"."
          }
        ],
        "tryIt": "What would bert_input([\"a\"], []) return with each style of check?",
        "check": {
          "question": "bert_input([\"hello\"]) returns?",
          "options": [
            "([\"hello\"], [0])",
            "([\"[CLS]\", \"hello\", \"[SEP]\"], [0, 0, 0])",
            "([\"[CLS]\", \"hello\"], [0, 1])"
          ],
          "answer": 1,
          "why": "A single sentence is wrapped in [CLS] and [SEP], all segment 0."
        }
      }
    ],
    "summary": [
      "BERT gives contextual word vectors from a pre-trained Transformer encoder.",
      "Masked language modelling selects 15% of tokens: 80% [MASK], 10% random, 10% unchanged.",
      "Compute the last share as a remainder so rounded parts add up.",
      "Inputs are [CLS] A [SEP] (B [SEP]) with segment ids 0 and 1.",
      "Fine-tuning adds a small output layer: [CLS] for classification, token vectors for tagging and QA."
    ],
    "projectStep": {
      "title": "BERT preprocessing for your data",
      "steps": [
        "Tokenise three sentence pairs from your own data (words are fine as tokens).",
        "Build BERT inputs with bert_input and check the segment ids.",
        "Apply a seeded 15% masking to one input and show which tokens were selected."
      ]
    }
  },
  {
    "day": 24,
    "title": "GPT: Autoregressive Language Modeling & Causal Masking",
    "goal": "You can explain autoregressive language modelling with GPT, build a causal attention mask, show how masking hides future tokens, estimate the size of the KV cache, and compare encoder, decoder and encoder-decoder models.",
    "minutes": 30,
    "recap": "BERT reads in both directions to understand text. GPT reads left to right to generate text. The key difference is one simple matrix: the causal mask.",
    "parts": [
      {
        "title": "Predicting the next token",
        "say": [
          "GPT (Generative Pre-trained Transformer), from OpenAI starting in 2018, is a stack of Transformer decoder blocks trained on one task: predict the next token.",
          "That is the same idea as the bigram model on Day 3, but with the whole previous context instead of one word, and with billions of parameters instead of a count table.",
          "Training is self-supervised: any text provides labels for free, because each position's label is simply the next token.",
          "One sentence of n tokens gives n training examples at once: predict token 2 from token 1, token 3 from tokens 1-2, and so on.",
          "Scaling this simple objective up, with more data, more parameters and more compute, produced GPT-3 and the models behind today's chat assistants.",
          "The example lists the training examples hidden inside one short sentence.",
          "After pre-training, instruction tuning and human feedback turn a next-token predictor into a helpful assistant."
        ],
        "example": "Finishing people's sentences: after reading millions of books, you get very good at guessing what comes next.",
        "code": "tokens = [\"<s>\", \"the\", \"cat\", \"sat\", \"down\"]\nfor i in range(1, len(tokens)):\n    context = tokens[:i]\n    print(f\"context {context} -> predict {tokens[i]!r}\")",
        "output": "context ['<s>'] -> predict 'the'\ncontext ['<s>', 'the'] -> predict 'cat'\ncontext ['<s>', 'the', 'cat'] -> predict 'sat'\ncontext ['<s>', 'the', 'cat', 'sat'] -> predict 'down'",
        "codeNotes": [
          {
            "line": 3,
            "note": "Every prefix of the sentence is a training context."
          }
        ],
        "tryIt": "How many training examples does a 1,000-token document give?",
        "check": {
          "question": "What is GPT trained to do?",
          "options": [
            "Fill in masked words using both sides",
            "Predict the next token from the previous ones",
            "Classify sentences"
          ],
          "answer": 1,
          "why": "GPT is an autoregressive next-token predictor."
        }
      },
      {
        "title": "The causal mask",
        "say": [
          "If every position could attend to every other, a position could simply look at the next token and copy it. Training would be trivial and useless.",
          "The causal mask prevents that. Each position may attend only to itself and earlier positions; attention to later positions is blocked.",
          "In practice we add a mask to the attention scores before softmax: 0 where attention is allowed and minus infinity where it is not.",
          "e to the minus infinity is 0, so blocked positions get exactly zero weight after softmax.",
          "The allowed pattern is lower-triangular: row i has zeros up to column i and minus infinity after.",
          "Practice 1 is causal_mask(n): the n x n mask as a list of lists, using float(\"-inf\").",
          "The example prints a 4 x 4 mask in a readable form."
        ],
        "example": "An exam where you may look back at your earlier answers but the later questions are covered by a sheet of paper.",
        "code": "def causal_mask(n):\n    return [[0.0 if j <= i else float(\"-inf\") for j in range(n)] for i in range(n)]\n\nfor i, row in enumerate(causal_mask(4)):\n    print(f\"position {i} can see:\", \" \".join(\"x\" if v == 0.0 else \".\" for v in row))",
        "output": "position 0 can see: x . . .\nposition 1 can see: x x . .\nposition 2 can see: x x x .\nposition 3 can see: x x x x",
        "codeNotes": [
          {
            "line": 2,
            "note": "Allowed (0.0) on and below the diagonal; blocked (-inf) above it."
          }
        ],
        "tryIt": "How many allowed entries does a 5 x 5 causal mask have?",
        "check": {
          "question": "Why add minus infinity to blocked attention scores?",
          "options": [
            "To make scores negative",
            "After softmax, e^(-inf) = 0, so blocked positions get zero weight",
            "To speed up training"
          ],
          "answer": 1,
          "why": "Minus infinity becomes exactly zero weight after softmax."
        }
      },
      {
        "title": "Masked attention in action",
        "say": [
          "Applying the mask is one line: add it to the raw scores, then softmax as usual.",
          "Position 0 can only attend to itself, so its weight on itself is 1. Position 1 splits attention between positions 0 and 1, and so on.",
          "The same computation runs for all positions in parallel during training, which is why the mask is a matrix rather than a loop that feeds tokens in one by one.",
          "BERT uses no causal mask (it is bidirectional), and it cannot generate text naturally. GPT uses the mask, and it cannot see the right-hand context. Each design fits its purpose.",
          "Python's math.exp(float(\"-inf\")) returns 0.0, so the stable softmax you wrote on Day 17 works unchanged. The maximum of a masked row is always a real number, because every row allows at least its own position.",
          "The example applies the mask to a matrix of scores and prints the resulting weights.",
          "Notice the upper-right triangle is exactly zero."
        ],
        "example": "Taking a test in order: when answering question 3, you can use what you wrote for questions 1 and 2, but never question 4.",
        "code": "import math\n\nscores = [[2.0, 1.0, 0.5], [1.0, 2.0, 0.5], [0.5, 1.0, 2.0]]\nn = len(scores)\nmask = [[0.0 if j <= i else float(\"-inf\") for j in range(n)] for i in range(n)]\nfor i in range(n):\n    row = [s + m for s, m in zip(scores[i], mask[i])]\n    top = max(row)\n    e = [math.exp(v - top) for v in row]\n    print(f\"position {i} weights:\", [round(v / sum(e), 3) for v in e])",
        "output": "position 0 weights: [1.0, 0.0, 0.0]\nposition 1 weights: [0.269, 0.731, 0.0]\nposition 2 weights: [0.14, 0.231, 0.629]",
        "codeNotes": [
          {
            "line": 7,
            "note": "Add the mask to the raw scores."
          },
          {
            "line": 9,
            "note": "exp(-inf) is 0, so future positions get no weight."
          }
        ],
        "tryIt": "Remove the mask. Which weights change, and which position is now \"cheating\"?",
        "check": {
          "question": "In a causal mask, what can position 0 attend to?",
          "options": [
            "Every position",
            "Only itself",
            "Nothing"
          ],
          "answer": 1,
          "why": "The first position has no earlier tokens, so it attends only to itself."
        }
      },
      {
        "title": "Generation and the KV cache",
        "say": [
          "At generation time, GPT produces one token, appends it, and runs again to produce the next.",
          "Recomputing keys and values for every previous token at every step would waste enormous work. Instead, models store each token's keys and values once, in a key-value (KV) cache.",
          "Each new step computes only the new token's query, key and value, and attends to the cached keys and values.",
          "The cache is big: 2 (keys and values) × layers × heads × head dimension × tokens × batch size × bytes per number.",
          "Practice 2 is kv_cache_bytes(layers, heads, head_dim, seq_len, batch=1, bytes_per_value=2) and to_gib(n).",
          "For a 7-billion-parameter-class model (32 layers, 32 heads of 128) at 4,096 tokens in 16-bit numbers, that is 2 GiB per sequence, which is why long contexts and many users need so much GPU memory.",
          "The example prints the cache size for several context lengths."
        ],
        "example": "Keeping notes of what everyone said in a meeting so you do not have to ask them to repeat themselves every time you speak.",
        "code": "def kv_cache_bytes(layers, heads, head_dim, seq_len, batch=1, bytes_per_value=2):\n    return 2 * layers * heads * head_dim * seq_len * batch * bytes_per_value\n\ndef to_gib(n):\n    return round(n / 1024 ** 3, 2)\n\nfor tokens in [1024, 4096, 32768, 131072]:\n    print(f\"{tokens:6} tokens: {to_gib(kv_cache_bytes(32, 32, 128, tokens)):6} GiB per sequence\")",
        "output": "  1024 tokens:    0.5 GiB per sequence\n  4096 tokens:    2.0 GiB per sequence\n 32768 tokens:   16.0 GiB per sequence\n131072 tokens:   64.0 GiB per sequence",
        "codeNotes": [
          {
            "line": 2,
            "note": "The 2 counts keys and values."
          },
          {
            "line": 8,
            "note": "The cache grows linearly with context length."
          }
        ],
        "tryIt": "How much would grouped-query attention with 8 KV heads (Day 19) save at 32,768 tokens?",
        "check": {
          "question": "What does the KV cache store?",
          "options": [
            "The generated text",
            "The keys and values of earlier tokens, so they are not recomputed",
            "The model weights"
          ],
          "answer": 1,
          "why": "Caching keys and values makes each generation step cheap."
        }
      },
      {
        "title": "Encoders, decoders and both",
        "say": [
          "Transformers come in three families, and knowing which is which helps you choose a model.",
          "Encoder-only models (BERT, RoBERTa): bidirectional, no causal mask. Best for understanding tasks: classification, tagging, embeddings for search.",
          "Decoder-only models (GPT, LLaMA, Claude and most chat models): causal mask, next-token training. Best for generation, and, at large scale, surprisingly good at almost everything.",
          "Encoder-decoder models (the original Transformer, T5, BART): an encoder reads the input bidirectionally and a decoder generates the output with cross-attention to it. Natural for translation and summarisation.",
          "Most of today's largest models are decoder-only, largely because one simple objective scales so well.",
          "The example prints which family suits a few common tasks.",
          "For small, fast, cheap understanding tasks, an encoder like BERT is often still the most practical choice."
        ],
        "example": "Three kinds of specialist: a reader who studies whole documents, a writer who drafts word by word, and a translator who reads first and then writes.",
        "code": "families = {\n    \"encoder-only (BERT)\": [\"classify reviews\", \"tag entities\", \"embed documents for search\"],\n    \"decoder-only (GPT)\": [\"chat\", \"write code\", \"complete text\"],\n    \"encoder-decoder (T5)\": [\"translate\", \"summarise\"],\n}\nfor family, tasks in families.items():\n    print(f\"{family:22} -> {', '.join(tasks)}\")",
        "output": "encoder-only (BERT)    -> classify reviews, tag entities, embed documents for search\ndecoder-only (GPT)     -> chat, write code, complete text\nencoder-decoder (T5)   -> translate, summarise",
        "codeNotes": [
          {
            "line": 3,
            "note": "Decoder-only models generate text left to right."
          }
        ],
        "tryIt": "Which family would you pick for a fast spam filter running on a small server, and why?",
        "check": {
          "question": "Which family uses a causal mask and next-token training?",
          "options": [
            "Encoder-only",
            "Decoder-only",
            "Neither"
          ],
          "answer": 1,
          "why": "Decoder-only models such as GPT are trained autoregressively with a causal mask."
        }
      },
      {
        "title": "Practice time: masks and caches",
        "say": [
          "Practice 1: causal_mask(n). A nested list comprehension: 0.0 when j <= i, float(\"-inf\") otherwise.",
          "The checks compare with a 3 x 3 mask, a 1 x 1 mask, and count 10 blocked entries in a 5 x 5 mask (the upper triangle: 4 + 3 + 2 + 1).",
          "Comparing floats with float(\"-inf\") works exactly, because infinity is a special exact value.",
          "Practice 2: kv_cache_bytes and to_gib. One multiplication, and one division by 1024 cubed, rounded to 2 decimals.",
          "The checks include the tiny case (4 bytes: keys and values, 2 bytes each) and the 7B-class example (exactly 2 GiB), and batch 8 (16 GiB).",
          "These two pieces explain two practical facts about language models: they cannot peek at the future, and their memory use grows with every token of context.",
          "The example counts blocked entries with a formula and checks it."
        ],
        "example": "Counting the seats above the diagonal in a square hall: a quick formula saves counting one by one.",
        "code": "for n in [3, 5, 10]:\n    mask = [[0.0 if j <= i else float(\"-inf\") for j in range(n)] for i in range(n)]\n    blocked = sum(v == float(\"-inf\") for row in mask for v in row)\n    print(f\"n={n:2}: blocked {blocked}, formula n*(n-1)/2 = {n * (n - 1) // 2}\")",
        "output": "n= 3: blocked 3, formula n*(n-1)/2 = 3\nn= 5: blocked 10, formula n*(n-1)/2 = 10\nn=10: blocked 45, formula n*(n-1)/2 = 45",
        "codeNotes": [
          {
            "line": 3,
            "note": "True counts as 1, so this counts the -inf entries."
          }
        ],
        "tryIt": "How many entries are allowed (0.0) for n = 10?",
        "check": {
          "question": "kv_cache_bytes(1, 1, 1, 1) returns?",
          "options": [
            "1",
            "2",
            "4"
          ],
          "answer": 2,
          "why": "2 (keys and values) × 1 × 1 × 1 × 1 × 1 batch × 2 bytes = 4."
        }
      }
    ],
    "summary": [
      "GPT is a decoder-only Transformer trained to predict the next token; every prefix is a training example.",
      "The causal mask adds -inf above the diagonal so positions cannot attend to the future.",
      "After softmax, masked positions get exactly zero weight.",
      "The KV cache stores past keys and values; its size is 2 × layers × heads × head_dim × tokens × batch × bytes.",
      "Encoder-only suits understanding, decoder-only suits generation, encoder-decoder suits translation and summarisation."
    ],
    "projectStep": {
      "title": "Masked attention and memory budget",
      "steps": [
        "Apply a causal mask to a 4 x 4 score matrix of your choice and print the weights.",
        "Compute the KV cache for a model of your choice at three context lengths.",
        "Decide which Transformer family fits three tasks from your own work and explain why."
      ]
    }
  },
  {
    "day": 25,
    "title": "Extractive Question Answering: SQuAD Span Prediction",
    "goal": "You can explain extractive question answering, how a model scores answer start and end positions, find the best valid span under a length limit, normalise answers, and evaluate with exact match and F1.",
    "minutes": 30,
    "recap": "You have seen BERT (Day 23) and GPT (Day 24). Today you use a BERT-style model for a classic task: given a question and a passage, point to the exact span of the passage that answers it.",
    "parts": [
      {
        "title": "Extractive question answering",
        "say": [
          "In extractive QA, the answer is a span copied from a given passage. The model does not write new text; it points.",
          "The standard benchmark is SQuAD (the Stanford Question Answering Dataset), with over 100,000 questions about Wikipedia paragraphs, each answered by a span.",
          "Extractive QA is useful when answers must be traceable to a source: searching manuals, contracts, policies or medical guidelines, where made-up answers would be dangerous.",
          "The input is BERT-style: [CLS] question [SEP] passage [SEP]. The model outputs, for every passage token, a start score and an end score.",
          "SQuAD 2.0 added questions with no answer in the passage, so good systems also learn to say \"no answer\".",
          "The example shows a passage, a question and the answer span as token positions.",
          "Pointing to evidence is also the foundation of retrieval-augmented generation, which you will meet on Day 26 and in the capstone."
        ],
        "example": "An open-book exam where you must answer by underlining words in the book, not by writing your own sentence.",
        "code": "passage = \"The Eiffel Tower was completed in 1889 and is located in Paris\".split()\nquestion = \"When was the Eiffel Tower completed?\"\nstart, end = 6, 6\nprint(\"question:\", question)\nprint(\"answer span:\", (start, end), \"->\", \" \".join(passage[start:end + 1]))\nprint(\"with positions:\", list(enumerate(passage))[5:8])",
        "output": "question: When was the Eiffel Tower completed?\nanswer span: (6, 6) -> 1889\nwith positions: [(5, 'in'), (6, '1889'), (7, 'and')]",
        "codeNotes": [
          {
            "line": 5,
            "note": "The answer is the passage tokens from start to end, inclusive."
          }
        ],
        "tryIt": "Write the span for \"Where is the Eiffel Tower located?\"",
        "check": {
          "question": "What does an extractive QA model output?",
          "options": [
            "A newly written answer",
            "The start and end positions of an answer span in the passage",
            "A yes/no label only"
          ],
          "answer": 1,
          "why": "Extractive QA points to a span of the given passage."
        }
      },
      {
        "title": "Start and end scores",
        "say": [
          "On top of BERT, two small layers produce two numbers for each passage token: a start logit (how likely the answer begins here) and an end logit (how likely it ends here).",
          "A logit is a raw score before softmax. Softmax over positions turns them into probabilities, but for choosing the best span we can work with the raw scores.",
          "The score of a span from i to j is start[i] + end[j]. In log-probability terms, that corresponds to multiplying the start and end probabilities.",
          "During fine-tuning, the model learns to give high start scores at true answer starts and high end scores at true answer ends.",
          "The example prints start and end scores for a small passage and marks the highest of each.",
          "Choosing the best start and the best end separately can go wrong, which is the subject of the next part.",
          "Always look at the constraints, not just the scores."
        ],
        "example": "Two judges: one marks where a good quote begins, the other where it ends. You need a quote whose beginning and end both score well.",
        "code": "tokens = [\"the\", \"tower\", \"was\", \"built\", \"in\", \"1889\", \"by\", \"eiffel\"]\nstart = [0.1, 0.3, 0.0, 0.2, 0.4, 3.1, 0.1, 1.9]\nend = [0.0, 0.2, 0.1, 0.3, 0.1, 2.8, 0.2, 2.2]\nfor t, s, e in zip(tokens, start, end):\n    marks = (\"S\" if s == max(start) else \" \") + (\"E\" if e == max(end) else \" \")\n    print(f\"{t:7} start {s:4}  end {e:4}  {marks}\".rstrip())",
        "output": "the     start  0.1  end  0.0\ntower   start  0.3  end  0.2\nwas     start  0.0  end  0.1\nbuilt   start  0.2  end  0.3\nin      start  0.4  end  0.1\n1889    start  3.1  end  2.8  SE\nby      start  0.1  end  0.2\neiffel  start  1.9  end  2.2",
        "codeNotes": [
          {
            "line": 5,
            "note": "Mark the highest start and end scores."
          }
        ],
        "tryIt": "What span do the highest start and end give here? Is it sensible?",
        "check": {
          "question": "How is the score of a span from i to j computed?",
          "options": [
            "start[i] × end[j]",
            "start[i] + end[j]",
            "max(start[i], end[j])"
          ],
          "answer": 1,
          "why": "With logits, the span score is the sum of the start and end scores."
        }
      },
      {
        "title": "Choosing the best valid span",
        "say": [
          "Picking the best start and the best end independently can give an impossible span, such as an end before the start, or a span far too long.",
          "So we search over valid pairs only: i <= j, and the span length j - i + 1 at most a maximum, such as 30 tokens.",
          "Practice 1 is best_span(start_logits, end_logits, max_len): the (i, j) with i <= j < i + max_len that maximises start[i] + end[j], ties going to the smallest i, then smallest j.",
          "Two nested loops check every valid pair. Keeping the first best (using a strict greater-than) implements the tie rule.",
          "Real systems speed this up by only considering the top 20 starts and top 20 ends, but for a short passage checking every pair is fine.",
          "The example shows the independent choice going wrong and the constrained search fixing it.",
          "Constraints like this are a recurring pattern: models give scores, and simple rules turn them into sensible decisions."
        ],
        "example": "Choosing a quote for a poster: it must start before it ends and fit on the poster, so you compare only quotes that satisfy both.",
        "code": "def best_span(start, end, max_len):\n    best, best_score = None, None\n    for i in range(len(start)):\n        for j in range(i, min(len(end), i + max_len)):\n            score = start[i] + end[j]\n            if best_score is None or score > best_score:\n                best, best_score = (i, j), score\n    return best\n\nstart = [0.1, 0.2, 3.0, 0.1, 0.2]\nend = [2.5, 0.1, 0.3, 1.0, 0.2]\nprint(\"independent argmax:\", (start.index(max(start)), end.index(max(end))))\nprint(\"best valid span:   \", best_span(start, end, 3))",
        "output": "independent argmax: (2, 0)\nbest valid span:    (2, 3)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only ends at or after the start, within max_len."
          },
          {
            "line": 12,
            "note": "Independent choice: an end before the start."
          }
        ],
        "tryIt": "Set max_len to 1. Which span wins now?",
        "check": {
          "question": "Why constrain spans to i <= j < i + max_len?",
          "options": [
            "To make the model faster to train",
            "To rule out impossible or overly long answers",
            "Because logits are negative"
          ],
          "answer": 1,
          "why": "Valid answers start before they end and have a sensible length."
        }
      },
      {
        "title": "Normalising answers",
        "say": [
          "To check an answer against the correct one, small differences should not matter: \"The Eiffel Tower\" and \"eiffel tower\" are the same answer.",
          "The SQuAD evaluation normalises both strings: lowercase, remove punctuation, remove the articles \"a\", \"an\" and \"the\", and collapse extra whitespace.",
          "Only then are they compared. This is exactly the kind of cleaning you learned on Day 1, applied to evaluation.",
          "Python's string.punctuation gives the standard punctuation characters, handy for filtering.",
          "Normalisation must be applied identically to predictions and references, the same rule as for search queries and documents on Day 5.",
          "The example normalises several answer variants.",
          "Normalisation rules differ between benchmarks, so always use the official evaluation code when reporting results."
        ],
        "example": "Marking a quiz where \"Delhi\", \"delhi.\" and \"the Delhi\" all get the point, because the teacher cares about the answer, not the typing.",
        "code": "import string\n\ndef normalise(s):\n    text = \"\".join(ch for ch in s.lower() if ch not in string.punctuation)\n    return \" \".join(w for w in text.split() if w not in {\"a\", \"an\", \"the\"})\n\nfor answer in [\"The Eiffel Tower\", \"eiffel tower.\", \"  Eiffel   Tower!! \", \"a tower\"]:\n    print(f\"{answer!r:22} -> {normalise(answer)!r}\")",
        "output": "'The Eiffel Tower'     -> 'eiffel tower'\n'eiffel tower.'        -> 'eiffel tower'\n'  Eiffel   Tower!! '  -> 'eiffel tower'\n'a tower'              -> 'tower'",
        "codeNotes": [
          {
            "line": 4,
            "note": "Lowercase and drop punctuation."
          },
          {
            "line": 5,
            "note": "Drop articles; split and join collapse whitespace."
          }
        ],
        "tryIt": "Should \"Tower, Eiffel\" count as the same answer? What does normalisation say?",
        "check": {
          "question": "Which of these does SQuAD normalisation remove?",
          "options": [
            "Numbers",
            "The articles a, an and the",
            "Capital letters only at the start"
          ],
          "answer": 1,
          "why": "Articles, punctuation and case differences are removed before comparing."
        }
      },
      {
        "title": "Exact match and F1",
        "say": [
          "Two metrics are standard for extractive QA.",
          "Exact match (EM): 1 if the normalised prediction equals the normalised answer, else 0. Strict and easy to understand.",
          "F1: treat both answers as bags of tokens and compute the overlap. Precision is shared tokens / predicted tokens; recall is shared tokens / answer tokens; F1 combines them.",
          "F1 gives partial credit: predicting \"Eiffel Tower in Paris\" for \"Eiffel Tower\" gets a good F1 but an EM of 0.",
          "Practice 2 is exact_match(prediction, truth), returning 1 or 0 after normalisation.",
          "Human performance on SQuAD 1.1 is about 82 EM and 91 F1; BERT-large surpassed it in 2018, one of the headline results of that year.",
          "The example computes EM and F1 for a few predictions."
        ],
        "example": "Grading an essay answer: exact match gives marks only for the perfect phrase, F1 gives credit for every correct word you included.",
        "code": "import string\nfrom collections import Counter\n\ndef norm(s):\n    t = \"\".join(c for c in s.lower() if c not in string.punctuation)\n    return [w for w in t.split() if w not in {\"a\", \"an\", \"the\"}]\n\ndef em_f1(pred, truth):\n    p, t = norm(pred), norm(truth)\n    common = sum((Counter(p) & Counter(t)).values())\n    if common == 0:\n        return int(p == t), 0.0\n    precision, recall = common / len(p), common / len(t)\n    return int(p == t), round(2 * precision * recall / (precision + recall), 3)\n\nfor pred in [\"the Eiffel Tower\", \"Eiffel Tower in Paris\", \"Paris\"]:\n    print(f\"{pred!r:24} EM, F1 = {em_f1(pred, 'Eiffel Tower')}\")",
        "output": "'the Eiffel Tower'       EM, F1 = (1, 1.0)\n'Eiffel Tower in Paris'  EM, F1 = (0, 0.667)\n'Paris'                  EM, F1 = (0, 0.0)",
        "codeNotes": [
          {
            "line": 10,
            "note": "Counter & Counter keeps the shared tokens with their minimum counts."
          },
          {
            "line": 14,
            "note": "F1 is the harmonic mean of precision and recall."
          }
        ],
        "tryIt": "What EM and F1 does \"tower\" get against \"Eiffel Tower\"?",
        "check": {
          "question": "A prediction contains the full correct answer plus two extra words. What happens?",
          "options": [
            "EM 1, F1 1",
            "EM 0, F1 below 1 but above 0",
            "EM 0, F1 0"
          ],
          "answer": 1,
          "why": "Extra words break exact match but still share tokens, so F1 gives partial credit."
        }
      },
      {
        "title": "Practice time: spans and matches",
        "say": [
          "Practice 1: best_span(start_logits, end_logits, max_len). Two loops; j runs from i up to min(len(end_logits), i + max_len) - 1; keep the first pair with the highest sum.",
          "Checks: max_len 2 gives (1, 2); allowing longer spans gives (1, 4); equal scores give (0, 0) thanks to the tie rule.",
          "Practice 2: exact_match(prediction, truth). Write a small normalise helper (lowercase, drop punctuation, drop a/an/the, collapse spaces) and compare.",
          "Checks include articles and case, punctuation, different answers, and plural versus singular, which must not match.",
          "Return the integers 1 and 0, not True and False, because EM is averaged as a number over a whole test set.",
          "After passing, compute the average EM of five predictions against their answers, the number a leaderboard would show.",
          "The example shows that averaging."
        ],
        "example": "A scoreboard that turns each right or wrong answer into a 1 or 0 and shows the average as a percentage.",
        "code": "import string\n\ndef norm(s):\n    t = \"\".join(c for c in s.lower() if c not in string.punctuation)\n    return \" \".join(w for w in t.split() if w not in {\"a\", \"an\", \"the\"})\npairs = [(\"1889\", \"1889\"), (\"Paris, France\", \"paris france\"), (\"London\", \"Paris\"),\n         (\"the Seine\", \"Seine\"), (\"Gustave\", \"Gustave Eiffel\")]\nscores = [1 if norm(p) == norm(t) else 0 for p, t in pairs]\nprint(\"per question:\", scores)\nprint(f\"exact match: {sum(scores) / len(scores):.0%}\")",
        "output": "per question: [1, 1, 0, 1, 0]\nexact match: 60%",
        "codeNotes": [
          {
            "line": 8,
            "note": "1 for a match, 0 otherwise."
          },
          {
            "line": 10,
            "note": "The average over the test set is the reported EM."
          }
        ],
        "tryIt": "Which question would earn partial credit under F1 but 0 under EM?",
        "check": {
          "question": "exact_match(\"The Eiffel Tower\", \"eiffel tower\") returns?",
          "options": [
            "0",
            "1",
            "True"
          ],
          "answer": 1,
          "why": "After normalisation both are \"eiffel tower\", so the result is 1."
        }
      }
    ],
    "summary": [
      "Extractive QA answers by pointing to a span of a given passage (SQuAD).",
      "A BERT-style model scores each passage token as a start and an end; span score = start + end.",
      "Search only valid spans: start before end and within a maximum length.",
      "Normalise answers (lowercase, no punctuation, no articles, single spaces) before comparing.",
      "Exact match is strict; token F1 gives partial credit."
    ],
    "projectStep": {
      "title": "Question answering on your documents",
      "steps": [
        "Write three questions about a passage from your own documents and mark the answer spans.",
        "Invent start and end scores and find the best spans with best_span.",
        "Score three predictions with exact_match and token F1."
      ]
    }
  },
  {
    "day": 26,
    "title": "Dense Retrieval vs Cross-Encoder Re-Ranking: Two-Stage Information Retrieval",
    "goal": "You can explain dense retrieval with embeddings, why cross-encoders re-rank better but slower, design a two-stage retrieve-then-rerank pipeline, validate its funnel sizes, and re-rank candidates stably.",
    "minutes": 30,
    "recap": "Yesterday's QA model needs a passage that contains the answer. With millions of documents, you first have to find the right passages quickly. That is retrieval, and modern systems do it in two stages.",
    "parts": [
      {
        "title": "Sparse and dense retrieval",
        "say": [
          "Sparse retrieval is what you built on Days 4-5: TF-IDF or BM25 over exact words. It is fast, needs no training and is great for rare keywords like product codes.",
          "Its weakness is vocabulary mismatch: a query about \"car repair\" misses a document about \"automobile maintenance\".",
          "Dense retrieval encodes the query and every document into embedding vectors (with a model like a small BERT), and finds documents whose vectors are closest to the query's, usually by cosine or dot product.",
          "Because embeddings capture meaning, dense retrieval matches paraphrases and synonyms.",
          "Document embeddings are computed once, ahead of time, and stored in a vector index. At query time only the query needs encoding, so search is fast.",
          "Many production systems combine both, hybrid retrieval, because keywords and meaning catch different things.",
          "The example compares keyword overlap and embedding similarity for a paraphrased query."
        ],
        "example": "Two librarians: one finds books containing your exact words, the other understands what you mean even when you use different words.",
        "code": "import math\n\nemb = {\"car repair\": [0.9, 0.4, 0.1], \"automobile maintenance guide\": [0.85, 0.45, 0.15],\n       \"cake recipes\": [0.05, 0.1, 0.95]}\nquery = \"car repair\"\ndef cos(a, b):\n    return sum(x * y for x, y in zip(a, b)) / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))\nfor doc in [\"automobile maintenance guide\", \"cake recipes\"]:\n    shared = set(query.split()) & set(doc.split())\n    print(f\"{doc:29} shared words {len(shared)}  dense similarity {cos(emb[query], emb[doc]):.3f}\")",
        "output": "automobile maintenance guide  shared words 0  dense similarity 0.996\ncake recipes                  shared words 0  dense similarity 0.190",
        "codeNotes": [
          {
            "line": 9,
            "note": "Sparse matching sees no shared words."
          },
          {
            "line": 10,
            "note": "Dense vectors still see the similarity."
          }
        ],
        "tryIt": "Add a document \"car wash prices\". Which method ranks it higher than it deserves?",
        "check": {
          "question": "What problem does dense retrieval solve that sparse retrieval has?",
          "options": [
            "Slow indexing",
            "Vocabulary mismatch between query and document words",
            "Large documents"
          ],
          "answer": 1,
          "why": "Embeddings match meaning, not just exact words."
        }
      },
      {
        "title": "Bi-encoders and approximate nearest neighbours",
        "say": [
          "The models behind dense retrieval are called bi-encoders: the query and the document are encoded separately, each into one vector.",
          "Separate encoding is what makes them fast: documents are encoded once, and search is just comparing vectors.",
          "Comparing a query with millions of vectors exactly is still slow, so systems use approximate nearest neighbour (ANN) indexes.",
          "FAISS (from Meta), HNSW graphs, ScaNN (from Google) and vector databases such as Milvus, Qdrant and pgvector find the closest vectors in milliseconds, with a small, controllable loss of accuracy.",
          "HNSW, for example, builds a layered graph where each vector links to near neighbours, and search hops through the graph towards the query.",
          "Index choices trade memory, build time, speed and recall. Teams measure recall of the ANN index against exact search on sample queries before trusting it.",
          "The example shows the speed-up idea: grouping vectors into clusters and searching only the closest cluster.",
          "This clustering trick is the idea behind FAISS's IVF indexes."
        ],
        "example": "Finding a house in a city by first choosing the right neighbourhood, then checking only the houses there.",
        "code": "import math\n\nclusters = {\"vehicles\": [0.9, 0.3], \"food\": [0.1, 0.95], \"sport\": [0.6, 0.7]}\ndocs = {\"vehicles\": {\"car repair\": [0.88, 0.35], \"bike tyres\": [0.8, 0.2], \"bus routes\": [0.95, 0.3]},\n        \"food\": {\"cake recipes\": [0.05, 0.9], \"curry guide\": [0.2, 0.97], \"tea blends\": [0.1, 0.99]},\n        \"sport\": {\"cricket rules\": [0.6, 0.75], \"yoga basics\": [0.55, 0.65], \"chess openings\": [0.65, 0.7]}}\nq = [0.85, 0.4]\ndist = lambda a, b: math.dist(a, b)\nbest_cluster = min(clusters, key=lambda c: dist(q, clusters[c]))\ncandidates = docs[best_cluster]\nprint(\"search only cluster:\", best_cluster, \"->\", min(candidates, key=lambda d: dist(q, candidates[d])))\nprint(\"vectors compared:\", len(clusters) + len(candidates), \"instead of\", sum(len(v) for v in docs.values()))",
        "output": "search only cluster: vehicles -> car repair\nvectors compared: 6 instead of 9",
        "codeNotes": [
          {
            "line": 9,
            "note": "First pick the nearest cluster centre."
          },
          {
            "line": 11,
            "note": "Then search only inside that cluster."
          }
        ],
        "tryIt": "What could go wrong if the true best match sits just inside the other cluster?",
        "check": {
          "question": "Why are ANN indexes called approximate?",
          "options": [
            "They round the vectors",
            "They may occasionally miss the true nearest vector in exchange for huge speed-ups",
            "They only work on text"
          ],
          "answer": 1,
          "why": "ANN trades a small chance of missing the best match for much faster search."
        }
      },
      {
        "title": "Cross-encoders",
        "say": [
          "A cross-encoder reads the query and the document together, as one input: [CLS] query [SEP] document [SEP], and outputs a single relevance score.",
          "Because every query word can attend to every document word, cross-encoders judge relevance much more accurately than comparing two separate vectors.",
          "The cost: nothing can be precomputed. Every (query, document) pair needs a full model run, which is far too slow for millions of documents.",
          "So bi-encoders are fast but rougher; cross-encoders are accurate but slow.",
          "The solution is to use each where it fits: a fast first stage to shortlist, and a slow, accurate second stage to re-rank only the shortlist.",
          "The example estimates the time to score a whole collection with each kind of model, with rough example timings.",
          "This speed-versus-accuracy trade-off appears throughout engineering, and the two-stage answer is a common way out."
        ],
        "example": "A job application process: a quick CV screen for thousands of applicants, then in-depth interviews for the few who pass.",
        "code": "docs = 5_000_000\nbi_encoder_query_ms = 20          # encode the query once, then an ANN lookup\ncross_encoder_pair_ms = 15        # one model run per (query, document) pair\nprint(f\"bi-encoder search: about {bi_encoder_query_ms} ms\")\nprint(f\"cross-encoder over everything: about {docs * cross_encoder_pair_ms / 1000 / 3600:.1f} hours\")\nprint(f\"cross-encoder over 100 candidates: about {100 * cross_encoder_pair_ms} ms\")",
        "output": "bi-encoder search: about 20 ms\ncross-encoder over everything: about 20.8 hours\ncross-encoder over 100 candidates: about 1500 ms",
        "codeNotes": [
          {
            "line": 5,
            "note": "Scoring every document with a cross-encoder is hopeless."
          },
          {
            "line": 6,
            "note": "Scoring a shortlist of 100 is fine."
          }
        ],
        "tryIt": "How many candidates can you re-rank if the total budget is 500 ms?",
        "check": {
          "question": "Why is a cross-encoder more accurate than a bi-encoder?",
          "options": [
            "It is larger",
            "It reads query and document together, so words can attend to each other",
            "It uses TF-IDF"
          ],
          "answer": 1,
          "why": "Joint encoding lets the model compare the texts directly."
        }
      },
      {
        "title": "Designing the funnel",
        "say": [
          "A two-stage pipeline is a funnel: from N documents, stage 1 keeps k1 candidates, and stage 2 re-ranks them and keeps the final k2.",
          "Typical sizes: millions of documents, k1 of 50 to 1,000, and k2 of 3 to 10.",
          "The sizes must actually narrow: k1 must be smaller than N, k2 smaller than k1, and k2 must be positive, or the design makes no sense.",
          "Practice 1 is check_two_stage(corpus_size, k1, k2): return the list of problems (empty when valid), in a fixed order.",
          "Choosing k1 is a balance. Too small and stage 1 may drop the right document before stage 2 ever sees it (a recall problem). Too large and stage 2 becomes slow.",
          "Measure recall at k1 for stage 1 on test queries: how often is a relevant document somewhere in the shortlist?",
          "The example checks several designs."
        ],
        "example": "A talent show: thousands audition, a hundred reach the second round, and ten reach the final.",
        "code": "def check_two_stage(corpus_size, k1, k2):\n    problems = []\n    if k1 >= corpus_size: problems.append(\"K1_NOT_SMALLER_THAN_CORPUS\")\n    if k2 >= k1: problems.append(\"K2_NOT_SMALLER_THAN_K1\")\n    if k2 <= 0: problems.append(\"K2_NOT_POSITIVE\")\n    return problems\n\nfor design in [(1_000_000, 100, 5), (50, 100, 5), (1000, 10, 10), (10, 20, 0)]:\n    print(design, \"->\", check_two_stage(*design) or \"valid\")",
        "output": "(1000000, 100, 5) -> valid\n(50, 100, 5) -> ['K1_NOT_SMALLER_THAN_CORPUS']\n(1000, 10, 10) -> ['K2_NOT_SMALLER_THAN_K1']\n(10, 20, 0) -> ['K1_NOT_SMALLER_THAN_CORPUS', 'K2_NOT_POSITIVE']",
        "codeNotes": [
          {
            "line": 3,
            "note": "Each rule adds its own problem code."
          },
          {
            "line": 9,
            "note": "An empty list is falsy, so \"or\" prints \"valid\"."
          }
        ],
        "tryIt": "Add a rule: k1 should be at most 1,000 to keep stage 2 fast. What code would you use?",
        "check": {
          "question": "What happens if k1 is too small?",
          "options": [
            "Stage 2 becomes slow",
            "The right document may be dropped before re-ranking",
            "Nothing"
          ],
          "answer": 1,
          "why": "Stage 2 can only re-rank what stage 1 kept, so low recall at k1 hurts."
        }
      },
      {
        "title": "Re-ranking stably",
        "say": [
          "Stage 2 takes the stage-1 candidates (in their fast-retriever order) and a cross-encoder score for each, and returns the top k2 by that score.",
          "Practice 2 is rerank(candidates, scores, k): sort by cross-encoder score, highest first, keep ties in the stage-1 order, drop candidates without a score, and return the first k.",
          "Python's sorted is stable: items with equal keys keep their original order. So sorting by -score alone automatically breaks ties by stage-1 rank.",
          "That is a sensible tie rule: when the accurate model cannot separate two documents, trust the order from the first stage.",
          "Dropping unscored candidates handles real-world hiccups, such as a document that failed to load for the cross-encoder.",
          "Re-ranking also gives a natural place to apply business rules, such as preferring newer documents or filtering out ones the user may not see.",
          "The example re-ranks a shortlist and shows the stable tie-break.",
          "In retrieval-augmented generation, the re-ranked top few passages are what the language model finally reads."
        ],
        "example": "A final round where judges rescore the finalists; when two finalists tie, the one who ranked higher in the earlier round goes first.",
        "code": "candidates = [\"d7\", \"d2\", \"d9\", \"d4\", \"d5\"]           # stage-1 order\nscores = {\"d7\": 0.20, \"d2\": 0.91, \"d9\": 0.91, \"d4\": 0.55}   # d5 failed to score\nranked = sorted((c for c in candidates if c in scores), key=lambda c: -scores[c])\nprint(\"re-ranked:\", ranked)\nprint(\"top 3:\", ranked[:3])",
        "output": "re-ranked: ['d2', 'd9', 'd4', 'd7']\ntop 3: ['d2', 'd9', 'd4']",
        "codeNotes": [
          {
            "line": 3,
            "note": "sorted is stable, so d2 stays ahead of d9 when their scores tie."
          }
        ],
        "tryIt": "Swap d2 and d9 in the candidates list. Which one comes first now?",
        "check": {
          "question": "Why is Python's sorted being \"stable\" useful here?",
          "options": [
            "It makes sorting faster",
            "Equal scores keep their stage-1 order automatically",
            "It removes duplicates"
          ],
          "answer": 1,
          "why": "Stability means ties preserve the original order."
        }
      },
      {
        "title": "Practice time: funnel and re-rank",
        "say": [
          "Practice 1: check_two_stage(corpus_size, k1, k2). Three if statements appending codes in the given order; return the list.",
          "Checks: a good funnel (empty list), a shortlist larger than the corpus, a re-rank that does not narrow, and a design with two problems at once.",
          "Practice 2: rerank(candidates, scores, k). Filter to scored candidates, sort by negative score (stable), slice to k.",
          "Checks: a tie between d2 and d9 keeps stage-1 order, and unscored candidates are dropped.",
          "Together these describe the retrieval layer of almost every modern question-answering and RAG system.",
          "After passing, measure recall at k1 for a toy retriever on a few test queries, the number you would use to choose k1.",
          "The example computes recall at k1."
        ],
        "example": "Checking how often the right candidate was even invited to the interview round.",
        "code": "tests = [(\"q1\", [\"d3\", \"d8\", \"d1\", \"d9\"], \"d1\"), (\"q2\", [\"d5\", \"d2\", \"d7\", \"d4\"], \"d6\"), (\"q3\", [\"d4\", \"d6\", \"d2\", \"d8\"], \"d4\")]\nfor k1 in [1, 2, 3, 4]:\n    hit = sum(relevant in shortlist[:k1] for _, shortlist, relevant in tests)\n    print(f\"recall@{k1}: {hit}/{len(tests)}\")",
        "output": "recall@1: 1/3\nrecall@2: 1/3\nrecall@3: 2/3\nrecall@4: 2/3",
        "codeNotes": [
          {
            "line": 3,
            "note": "Is the relevant document anywhere in the top k1?"
          }
        ],
        "tryIt": "Query q2 never finds its document. What does that suggest about stage 1 for that query?",
        "check": {
          "question": "rerank([\"a\", \"b\"], {\"b\": 0.5}, 2) returns?",
          "options": [
            "[\"a\", \"b\"]",
            "[\"b\"]",
            "[]"
          ],
          "answer": 1,
          "why": "Only scored candidates are kept."
        }
      }
    ],
    "summary": [
      "Sparse retrieval matches exact words; dense retrieval matches meaning with embeddings.",
      "Bi-encoders embed queries and documents separately; ANN indexes (FAISS, HNSW) search them fast.",
      "Cross-encoders read query and document together: accurate but too slow for a whole corpus.",
      "Two-stage retrieval: shortlist k1 quickly, re-rank to k2 accurately; N > k1 > k2 > 0.",
      "Stable sorting keeps stage-1 order for ties; measure recall at k1 to choose the shortlist size."
    ],
    "projectStep": {
      "title": "Two-stage search over your documents",
      "steps": [
        "Represent your documents with toy embeddings and shortlist the top 5 for a query by cosine.",
        "Invent cross-encoder scores for the shortlist and re-rank to the top 2.",
        "Measure recall at k1 for three test queries and choose a sensible k1."
      ]
    }
  },
  {
    "day": 27,
    "title": "Sequence Generation Decoding: Temperature, Top-k & Nucleus (Top-p) Sampling",
    "goal": "You can explain how language models turn scores into text, compare greedy decoding, temperature, top-k and nucleus (top-p) sampling, implement temperature scaling and a top-p filter, and choose settings for different tasks.",
    "minutes": 30,
    "recap": "GPT produces a score (logit) for every token in its vocabulary at each step (Day 24). How we turn those scores into an actual choice shapes whether the text is dull, creative or nonsense.",
    "parts": [
      {
        "title": "From logits to a choice",
        "say": [
          "At each step, a language model outputs one logit per vocabulary token. Softmax turns them into probabilities (Day 17).",
          "Decoding is the rule for choosing the next token from those probabilities.",
          "Greedy decoding always picks the most probable token. It is deterministic and good for tasks with one right answer, like extracting a date.",
          "But greedy text is often repetitive and bland, and it can get stuck in loops (\"I think that I think that...\").",
          "Sampling picks a token at random, weighted by the probabilities. It gives variety, but pure sampling occasionally picks a very unlikely, nonsensical token.",
          "The settings you meet in every AI API, temperature, top_k and top_p, control this trade-off.",
          "Seeding the random generator, as in the example, makes the samples repeatable, which is essential when you want to compare settings fairly.",
          "The example compares greedy choice with a few seeded random samples from the same distribution."
        ],
        "example": "Ordering at a restaurant: always choosing the most popular dish (greedy), or picking at random with popular dishes more likely (sampling).",
        "code": "import random\n\nprobs = {\"the\": 0.45, \"a\": 0.25, \"one\": 0.15, \"this\": 0.1, \"zebra\": 0.05}\ngreedy = max(probs, key=probs.get)\nrng = random.Random(42)\nsamples = rng.choices(list(probs), weights=list(probs.values()), k=10)\nprint(\"greedy:\", greedy)\nprint(\"10 samples:\", samples)",
        "output": "greedy: the\n10 samples: ['a', 'the', 'the', 'the', 'one', 'a', 'this', 'the', 'the', 'the']",
        "codeNotes": [
          {
            "line": 4,
            "note": "Greedy: always the single most likely token."
          },
          {
            "line": 6,
            "note": "Sampling: random, weighted by probability."
          }
        ],
        "tryIt": "Draw 1,000 samples and count how often \"zebra\" appears. Is that about 5 percent?",
        "check": {
          "question": "What is a downside of pure greedy decoding for open-ended writing?",
          "options": [
            "It is random",
            "It tends to be repetitive and bland",
            "It is slow"
          ],
          "answer": 1,
          "why": "Always taking the top token often produces dull, looping text."
        }
      },
      {
        "title": "Temperature",
        "say": [
          "Temperature reshapes the distribution before sampling: divide every logit by t, then apply softmax.",
          "t = 1 leaves the distribution as it is. t below 1 sharpens it, making likely tokens even more likely. t above 1 flattens it, giving unlikely tokens more chances.",
          "As t approaches 0, sampling becomes greedy decoding. Dividing by exactly 0 is impossible, so t = 0 is treated as \"just take the argmax\".",
          "Practice 2 is apply_temperature(logits, t): softmax(logits / t) rounded to 4 decimals, or a one-hot greedy choice when t is 0.",
          "Typical choices: around 0 to 0.3 for factual answers and code, around 0.7 to 1.0 for creative writing.",
          "Very high temperatures produce incoherent text, because nonsense tokens get real probability.",
          "Temperature does not change which token is most likely; it only changes how strongly the model prefers it over the others.",
          "The example prints the same logits at several temperatures."
        ],
        "example": "A thermostat for creativity: turn it down and the writer plays it safe; turn it up and they take wild risks.",
        "code": "import math\n\ndef apply_temperature(logits, t):\n    if t == 0:\n        top = logits.index(max(logits))\n        return [1.0 if i == top else 0.0 for i in range(len(logits))]\n    scaled = [l / t for l in logits]\n    m = max(scaled)\n    e = [math.exp(s - m) for s in scaled]\n    return [round(x / sum(e), 4) for x in e]\n\nlogits = [2.0, 1.0, 0.0]\nfor t in [0, 0.5, 1.0, 2.0, 10.0]:\n    print(f\"t = {t:4}: {apply_temperature(logits, t)}\")",
        "output": "t =    0: [1.0, 0.0, 0.0]\nt =  0.5: [0.8668, 0.1173, 0.0159]\nt =  1.0: [0.6652, 0.2447, 0.09]\nt =  2.0: [0.5065, 0.3072, 0.1863]\nt = 10.0: [0.3672, 0.3322, 0.3006]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Temperature 0 means greedy: a one-hot choice."
          },
          {
            "line": 7,
            "note": "Divide logits by t, then a stable softmax."
          }
        ],
        "tryIt": "What happens to the distribution as t grows very large? Try t = 1000.",
        "check": {
          "question": "What does lowering the temperature below 1 do?",
          "options": [
            "Flattens the distribution",
            "Sharpens it, favouring the most likely tokens more",
            "Removes the top token"
          ],
          "answer": 1,
          "why": "Dividing logits by t < 1 increases the gaps between them."
        }
      },
      {
        "title": "Top-k sampling",
        "say": [
          "Top-k sampling keeps only the k most likely tokens, sets all others to zero, renormalises, and samples from the rest.",
          "It cuts off the long tail of strange tokens that pure sampling might pick. With k = 1 it becomes greedy.",
          "The problem is that one fixed k does not fit every situation. When the model is very sure (\"The capital of France is ...\"), k = 50 still allows 49 poor options.",
          "When the model is genuinely unsure (many good next words, as in creative writing), a small k can cut off perfectly good options.",
          "That weakness motivated nucleus sampling, next.",
          "Top-k and temperature are often combined: temperature reshapes the distribution first, then top-k trims it.",
          "The example keeps the top 3 of a distribution and renormalises.",
          "Renormalising means dividing by the kept total so the probabilities add up to 1 again."
        ],
        "example": "A shortlist of the top three candidates for a job, no matter whether the fourth was nearly as good or far worse.",
        "code": "probs = {\"the\": 0.45, \"a\": 0.25, \"one\": 0.15, \"this\": 0.1, \"zebra\": 0.05}\nk = 3\ntop = sorted(probs, key=lambda t: -probs[t])[:k]\ntotal = sum(probs[t] for t in top)\nprint(\"kept:\", {t: round(probs[t] / total, 4) for t in top})",
        "output": "kept: {'the': 0.5294, 'a': 0.2941, 'one': 0.1765}",
        "codeNotes": [
          {
            "line": 3,
            "note": "The k most likely tokens."
          },
          {
            "line": 5,
            "note": "Renormalise so they sum to 1."
          }
        ],
        "tryIt": "With k = 1, what does top-k sampling become?",
        "check": {
          "question": "What is the main weakness of a fixed k?",
          "options": [
            "It is too slow",
            "The right number of options differs between confident and uncertain steps",
            "It cannot be combined with temperature"
          ],
          "answer": 1,
          "why": "A fixed cutoff ignores how spread out the distribution is."
        }
      },
      {
        "title": "Nucleus (top-p) sampling",
        "say": [
          "Nucleus sampling (Holtzman and colleagues, 2019) keeps the smallest set of top tokens whose probabilities add up to at least p, then samples from that set.",
          "When the model is confident, a single token might already reach p = 0.9, so only that token is kept. When it is unsure, many tokens are kept.",
          "The set adapts to the distribution, which is exactly what fixed top-k could not do.",
          "Practice 1 is top_p(probs, p): sort tokens by probability (highest first, ties alphabetical) and return the shortest prefix whose running total reaches p.",
          "Rounding the running total (for example to 9 decimals) avoids floating point surprises such as 0.1 + 0.2 giving 0.30000000000000004 and just missing a threshold.",
          "Common settings are p between 0.9 and 0.95, often combined with a moderate temperature.",
          "The example applies top-p to a confident and an uncertain distribution."
        ],
        "example": "Packing a suitcase with your most important items first, and stopping once you have 90 percent of what you need, however many items that takes.",
        "code": "def top_p(probs, p):\n    keep, total = [], 0.0\n    for tok in sorted(probs, key=lambda t: (-probs[t], t)):\n        keep.append(tok)\n        total += probs[tok]\n        if round(total, 9) >= p:\n            break\n    return keep\n\nconfident = {\"Paris\": 0.92, \"Lyon\": 0.03, \"London\": 0.03, \"Rome\": 0.02}\nuncertain = {\"red\": 0.22, \"blue\": 0.21, \"green\": 0.2, \"gold\": 0.19, \"grey\": 0.18}\nprint(\"confident, p=0.9:\", top_p(confident, 0.9))\nprint(\"uncertain, p=0.9:\", top_p(uncertain, 0.9))",
        "output": "confident, p=0.9: ['Paris']\nuncertain, p=0.9: ['red', 'blue', 'green', 'gold', 'grey']",
        "codeNotes": [
          {
            "line": 3,
            "note": "Most likely first; alphabetical for ties."
          },
          {
            "line": 6,
            "note": "Stop as soon as the running total reaches p."
          }
        ],
        "tryIt": "Lower p to 0.5. How many tokens are kept for each distribution?",
        "check": {
          "question": "How does top-p adapt compared with top-k?",
          "options": [
            "It always keeps p tokens",
            "It keeps few tokens when the model is confident and more when it is unsure",
            "It ignores probabilities"
          ],
          "answer": 1,
          "why": "The nucleus grows or shrinks with how spread out the probabilities are."
        }
      },
      {
        "title": "Choosing decoding settings",
        "say": [
          "For tasks with one correct answer (extraction, classification by generation, code that must compile, maths), use greedy decoding or a low temperature.",
          "For open-ended writing (stories, brainstorming, marketing copy), use a temperature around 0.7 to 1.0 with top-p around 0.9.",
          "For chat assistants, moderate settings balance reliability and natural variety.",
          "Repetition penalties reduce the probability of tokens that already appeared, which helps against loops.",
          "Remember that sampling makes outputs vary between runs. For tests and reproducible pipelines, fix a random seed or use greedy decoding.",
          "Change one setting at a time and compare outputs side by side; changing several at once makes it impossible to tell which one helped.",
          "The example turns these guidelines into a small settings chooser.",
          "Always test settings on real examples from your task; the best values depend on the model and the use case."
        ],
        "example": "Choosing how adventurous a cook to be: follow the recipe exactly for a wedding cake, improvise freely for a weekend experiment.",
        "code": "def settings(task):\n    if task in (\"extract\", \"classify\", \"code\", \"math\"):\n        return {\"temperature\": 0.0}\n    if task in (\"story\", \"brainstorm\", \"poem\"):\n        return {\"temperature\": 0.9, \"top_p\": 0.95}\n    return {\"temperature\": 0.7, \"top_p\": 0.9}\n\nfor task in [\"extract\", \"story\", \"chat\", \"code\"]:\n    print(f\"{task:8} -> {settings(task)}\")",
        "output": "extract  -> {'temperature': 0.0}\nstory    -> {'temperature': 0.9, 'top_p': 0.95}\nchat     -> {'temperature': 0.7, 'top_p': 0.9}\ncode     -> {'temperature': 0.0}",
        "codeNotes": [
          {
            "line": 3,
            "note": "One right answer: be deterministic."
          },
          {
            "line": 5,
            "note": "Creative work: allow variety, trim the tail."
          }
        ],
        "tryIt": "Add a \"translate\" task. Which settings would you choose and why?",
        "check": {
          "question": "Which setting suits extracting invoice numbers from text?",
          "options": [
            "Temperature 1.2",
            "Temperature 0 (greedy)",
            "Top-p 0.99 with temperature 1.5"
          ],
          "answer": 1,
          "why": "Extraction has one right answer, so deterministic decoding is best."
        }
      },
      {
        "title": "Practice time: nucleus and temperature",
        "say": [
          "Practice 1: top_p(probs, p). Sort with the key (-probability, token), add tokens one by one to a running total, and stop once round(total, 9) >= p.",
          "Checks: a p that one token already reaches, p = 0.8 needing three tokens, and p = 1.0 keeping everything.",
          "Practice 2: apply_temperature(logits, t). Handle t == 0 with a one-hot list on the first largest logit; otherwise divide, subtract the max, exponentiate, normalise and round.",
          "Checks: t = 1 gives the plain softmax [0.6652, 0.2447, 0.09]; t = 0.5 sharpens it; t = 10 flattens it; and t = 0 with a tie picks the first top logit.",
          "list.index(max(logits)) returns the first position of the maximum, which gives the tie rule for free.",
          "After passing, chain them: apply a temperature, turn the result into a dictionary, and keep the top-p nucleus.",
          "The example shows the chained pipeline most APIs use."
        ],
        "example": "A two-stage filter for coffee: first adjust the grind (temperature), then pour through the paper filter (top-p).",
        "code": "import math\n\ntokens = [\"the\", \"a\", \"one\", \"this\", \"zebra\"]\nlogits = [3.0, 2.4, 1.9, 1.5, 0.8]\nfor t in [0.5, 1.5]:\n    scaled = [l / t for l in logits]\n    e = [math.exp(s - max(scaled)) for s in scaled]\n    probs = {tok: x / sum(e) for tok, x in zip(tokens, e)}\n    keep, total = [], 0.0\n    for tok in sorted(probs, key=lambda k: -probs[k]):\n        keep.append(tok); total += probs[tok]\n        if total >= 0.9: break\n    print(f\"t={t}: nucleus {keep}\")",
        "output": "t=0.5: nucleus ['the', 'a', 'one']\nt=1.5: nucleus ['the', 'a', 'one', 'this']",
        "codeNotes": [
          {
            "line": 8,
            "note": "Temperature first."
          },
          {
            "line": 12,
            "note": "Then keep the top-p nucleus."
          }
        ],
        "tryIt": "Why does the higher temperature keep more tokens in the nucleus?",
        "check": {
          "question": "apply_temperature([1.0, 3.0, 3.0], 0) returns?",
          "options": [
            "[0.0, 0.5, 0.5]",
            "[0.0, 1.0, 0.0]",
            "[0.0, 0.0, 1.0]"
          ],
          "answer": 1,
          "why": "Greedy picks the first position of the maximum logit."
        }
      }
    ],
    "summary": [
      "Decoding turns next-token probabilities into choices: greedy or sampling.",
      "Temperature divides logits by t: below 1 sharpens, above 1 flattens, 0 means greedy.",
      "Top-k keeps a fixed number of tokens; top-p keeps the smallest set reaching probability p.",
      "Use greedy or low temperature for single-answer tasks, moderate temperature with top-p for creative ones.",
      "Fix seeds or use greedy when outputs must be reproducible."
    ],
    "projectStep": {
      "title": "Decoding lab",
      "steps": [
        "Write logits for five candidate next words in a sentence you choose.",
        "Print the distribution at temperatures 0, 0.5, 1 and 2, and the top-p 0.9 nucleus for each.",
        "Recommend settings for two tasks from your work and justify them."
      ]
    }
  },
  {
    "day": 28,
    "title": "NLP Evaluation Metrics: BLEU, ROUGE & Exact Match (EM)",
    "goal": "You can explain why generated text needs automatic metrics, compute BLEU's modified precision and brevity penalty, compute ROUGE-1 recall with clipped counts, use exact match, and describe the limits of overlap metrics.",
    "minutes": 30,
    "recap": "You can now generate text (Day 27) and extract answers (Day 25). How do you measure whether a translation or summary is good, across thousands of examples, without a person reading every one?",
    "parts": [
      {
        "title": "Why automatic metrics",
        "say": [
          "Human judgement is the gold standard for generated text, but it is slow and expensive. You cannot ask people to read 10,000 outputs every time you change a model.",
          "Automatic metrics compare the model's output (the candidate) with one or more human-written references and produce a number.",
          "The classic family measures n-gram overlap: how many words and word sequences the candidate shares with the reference.",
          "BLEU (2002) is the standard for machine translation and focuses on precision. ROUGE (2004) is the standard for summarisation and focuses on recall. Exact match suits short answers.",
          "These metrics are cheap and reproducible, which makes them good for tracking progress, even though they miss a lot of what makes text good.",
          "The example counts shared words between a candidate and a reference translation.",
          "Always report which metric and which references you used; numbers are only comparable under the same setup."
        ],
        "example": "Checking a student's translation against the teacher's answer by counting matching phrases, before a teacher reads it properly.",
        "code": "reference = \"the cat is on the mat\".split()\ncandidate = \"the cat sat on the mat\".split()\nshared = [w for w in candidate if w in reference]\nprint(\"shared words:\", shared)\nprint(f\"share of candidate words found in the reference: {len(shared) / len(candidate):.2f}\")",
        "output": "shared words: ['the', 'cat', 'on', 'the', 'mat']\nshare of candidate words found in the reference: 0.83",
        "codeNotes": [
          {
            "line": 3,
            "note": "A first, naive overlap count."
          }
        ],
        "tryIt": "What does this naive count give for the candidate \"the the the the the the\"? Why is that a problem?",
        "check": {
          "question": "What do overlap metrics like BLEU and ROUGE compare?",
          "options": [
            "Output length only",
            "The candidate text with human-written reference texts",
            "Model sizes"
          ],
          "answer": 1,
          "why": "They measure n-gram overlap between candidate and references."
        }
      },
      {
        "title": "BLEU: clipped n-gram precision",
        "say": [
          "BLEU (Papineni and colleagues at IBM, 2002) measures precision: what share of the candidate's n-grams appear in the reference.",
          "Naive precision can be gamed. \"the the the the\" would score perfectly against any reference containing \"the\".",
          "BLEU clips counts: each candidate n-gram counts at most as many times as it appears in the reference. \"the\" appears twice in the reference, so at most two of the candidate's \"the\"s count.",
          "BLEU computes this modified precision for 1-grams up to 4-grams and combines them with a geometric mean, so a candidate must match longer phrases too, not just single words.",
          "Scores range from 0 to 1 (often shown as 0 to 100); good machine translation typically scores in the 30s to 40s on news text, and human translations do not reach 100 either.",
          "The example computes clipped unigram precision for the gaming candidate and a reasonable one.",
          "Counter makes clipping easy: the minimum of the candidate count and the reference count for each word."
        ],
        "example": "A quiz that gives one mark per correct word, but only as many marks for \"the\" as there are \"the\"s in the answer key.",
        "code": "from collections import Counter\n\ndef modified_precision(candidate, reference):\n    cand, ref = Counter(candidate), Counter(reference)\n    clipped = sum(min(n, ref[w]) for w, n in cand.items())\n    return round(clipped / len(candidate), 4)\n\nref = \"the cat is on the mat\".split()\nprint(\"gaming:\", modified_precision(\"the the the the the the\".split(), ref))\nprint(\"decent:\", modified_precision(\"the cat sat on the mat\".split(), ref))",
        "output": "gaming: 0.3333\ndecent: 0.8333",
        "codeNotes": [
          {
            "line": 5,
            "note": "Each word counts at most as often as it appears in the reference."
          }
        ],
        "tryIt": "Compute the modified bigram precision for the decent candidate by hand. Which bigrams match?",
        "check": {
          "question": "Why does BLEU clip n-gram counts?",
          "options": [
            "To speed it up",
            "So repeating a common word cannot inflate the score",
            "To ignore punctuation"
          ],
          "answer": 1,
          "why": "Clipping stops candidates from gaming precision with repeated words."
        }
      },
      {
        "title": "The brevity penalty",
        "say": [
          "Precision has another loophole: a very short candidate. \"the cat\" has perfect precision against \"the cat is on the mat\", while leaving out most of the meaning.",
          "BLEU adds a brevity penalty (BP). If the candidate is longer than the reference, BP is 1 (no penalty). Otherwise BP = exp(1 - r / c), where r is the reference length and c the candidate length.",
          "The shorter the candidate, the smaller BP, and the final BLEU score is BP times the combined precisions.",
          "There is no penalty for being too long, because extra words already lower precision.",
          "Practice 1 is brevity_penalty(candidate_len, reference_len), rounded to 4 decimals, with 0.0 for an empty candidate.",
          "An empty candidate needs special handling because r / c would divide by zero.",
          "The example shows the penalty for several candidate lengths against a reference of 10 words."
        ],
        "example": "A word-count rule for an essay: write too little and you lose marks, however polished each sentence is.",
        "code": "import math\n\ndef brevity_penalty(c, r):\n    if c == 0: return 0.0\n    if c > r: return 1.0\n    return round(math.exp(1 - r / c), 4)\n\nfor c in [2, 5, 8, 10, 12]:\n    print(f\"candidate length {c:2} vs reference 10 -> BP {brevity_penalty(c, 10)}\")",
        "output": "candidate length  2 vs reference 10 -> BP 0.0183\ncandidate length  5 vs reference 10 -> BP 0.3679\ncandidate length  8 vs reference 10 -> BP 0.7788\ncandidate length 10 vs reference 10 -> BP 1.0\ncandidate length 12 vs reference 10 -> BP 1.0",
        "codeNotes": [
          {
            "line": 5,
            "note": "Longer than the reference: no penalty."
          },
          {
            "line": 6,
            "note": "Shorter: exp(1 - r / c), which shrinks fast."
          }
        ],
        "tryIt": "Why is equal length (c = r) also penalty-free? Work out exp(1 - 1).",
        "check": {
          "question": "A candidate of length 8 against a reference of length 10. What is the brevity penalty?",
          "options": [
            "1.0",
            "About 0.78",
            "0.0"
          ],
          "answer": 1,
          "why": "exp(1 - 10/8) = exp(-0.25) ≈ 0.7788."
        }
      },
      {
        "title": "ROUGE for summaries",
        "say": [
          "For summaries, what matters most is whether the important content from the reference made it into the candidate. That is recall.",
          "ROUGE-1 recall = the number of reference words also found in the candidate (clipped, like BLEU) divided by the reference length.",
          "ROUGE-2 does the same for bigrams, and ROUGE-L uses the longest common subsequence, rewarding words in the right order even when they are not adjacent.",
          "Practice 2 is rouge1_recall(candidate, reference), clipped with Counter and rounded to 4 decimals, returning 0.0 for an empty reference.",
          "Recall alone can be gamed by very long summaries that include everything, so ROUGE is often reported as F1, combining recall with precision.",
          "The example computes ROUGE-1 recall for a good summary, a repetitive one and an empty one.",
          "The design mirrors BLEU: the same clipped counts, divided by the reference length instead of the candidate length."
        ],
        "example": "Checking a friend's summary of a film by ticking off how many of the key plot points they mentioned.",
        "code": "from collections import Counter\n\ndef rouge1_recall(candidate, reference):\n    if not reference: return 0.0\n    cand = Counter(candidate)\n    overlap = sum(min(n, cand[w]) for w, n in Counter(reference).items())\n    return round(overlap / len(reference), 4)\n\nref = \"the cat sat on the mat\".split()\nfor cand in [\"the cat on the mat\", \"the the the the\", \"a dog barked\", \"\"]:\n    print(f\"{cand!r:20} ROUGE-1 recall {rouge1_recall(cand.split(), ref)}\")",
        "output": "'the cat on the mat' ROUGE-1 recall 0.8333\n'the the the the'    ROUGE-1 recall 0.3333\n'a dog barked'       ROUGE-1 recall 0.0\n''                   ROUGE-1 recall 0.0",
        "codeNotes": [
          {
            "line": 6,
            "note": "Clip each reference word by how often the candidate has it."
          },
          {
            "line": 7,
            "note": "Divide by the reference length: recall."
          }
        ],
        "tryIt": "Compute ROUGE-1 precision for \"the cat on the mat\" too (divide by the candidate length).",
        "check": {
          "question": "ROUGE-1 recall divides the clipped overlap by?",
          "options": [
            "The candidate length",
            "The reference length",
            "The vocabulary size"
          ],
          "answer": 1,
          "why": "Recall asks how much of the reference was covered."
        }
      },
      {
        "title": "The limits of overlap metrics",
        "say": [
          "Overlap metrics reward matching words, not matching meaning. \"The film was excellent\" and \"The movie was superb\" share almost nothing, yet mean the same.",
          "They also miss fluency and truth. A candidate can reuse many reference words in a garbled order, or include a false statement, and still score well.",
          "Embedding-based metrics such as BERTScore compare contextual embeddings instead of exact words, which handles paraphrases better.",
          "For modern language models, teams increasingly use human preference ratings and \"LLM-as-a-judge\" evaluations with careful rubrics, alongside task-specific checks like whether code passes its tests.",
          "Best practice is to use several metrics, look at real examples, and validate that the metric agrees with human judgement on your task.",
          "The example shows a paraphrase scoring poorly on ROUGE while being a perfectly good summary.",
          "A metric is a tool for decisions, not the goal itself. When a metric becomes the target, models learn to game it."
        ],
        "example": "Judging a painting by counting how many colours it shares with a famous one: easy to measure, but it says little about whether it is good.",
        "code": "from collections import Counter\n\nref = \"the film was excellent and the actors were superb\".split()\nparaphrase = \"a great movie with wonderful acting\".split()\nword_salad = \"the the film excellent were actors and was superb\".split()\nrecall = lambda c: sum(min(n, Counter(c)[w]) for w, n in Counter(ref).items()) / len(ref)\nprint(f\"good paraphrase ROUGE-1 recall: {recall(paraphrase):.2f}\")\nprint(f\"word salad ROUGE-1 recall:      {recall(word_salad):.2f}\")",
        "output": "good paraphrase ROUGE-1 recall: 0.00\nword salad ROUGE-1 recall:      1.00",
        "codeNotes": [
          {
            "line": 7,
            "note": "A good summary in different words scores 0."
          },
          {
            "line": 8,
            "note": "Scrambled reference words score highly."
          }
        ],
        "tryIt": "Which of the two would a person prefer? What does that tell you about using ROUGE alone?",
        "check": {
          "question": "What is a known weakness of BLEU and ROUGE?",
          "options": [
            "They are too slow",
            "They reward matching words, not matching meaning, and miss paraphrases",
            "They need GPUs"
          ],
          "answer": 1,
          "why": "Paraphrases can score low and word salad can score high."
        }
      },
      {
        "title": "Practice time: penalties and recall",
        "say": [
          "Practice 1: brevity_penalty(candidate_len, reference_len). Three cases in order: empty candidate returns 0.0, longer candidate returns 1.0, otherwise exp(1 - r / c) rounded.",
          "Checks: 12 vs 10 gives 1.0; 10 vs 10 gives 1.0; 8 vs 10 gives 0.7788; 0 vs 10 gives 0.0.",
          "Practice 2: rouge1_recall(candidate, reference). Return 0.0 for an empty reference; otherwise the clipped overlap divided by the reference length, rounded.",
          "Checks: a good candidate (0.8333), a repetitive one clipped to the reference's two \"the\"s (0.3333), and empty inputs.",
          "Together with exact match from Day 25, you now have the three most common automatic metrics for generation tasks.",
          "After passing, compute a simple BLEU-1: brevity penalty times clipped unigram precision, and compare two candidates.",
          "The example does exactly that."
        ],
        "example": "A final exam score made of two parts: the quality of your answers and a penalty for leaving the page half empty.",
        "code": "import math\nfrom collections import Counter\n\ndef bleu1(candidate, reference):\n    c, r = len(candidate), len(reference)\n    bp = 0.0 if c == 0 else (1.0 if c > r else math.exp(1 - r / c))\n    ref = Counter(reference)\n    precision = sum(min(n, ref[w]) for w, n in Counter(candidate).items()) / c if c else 0.0\n    return round(bp * precision, 4)\n\nref = \"the cat is on the mat\".split()\nfor cand in [\"the cat sat on the mat\", \"the cat\", \"on the mat the cat is\"]:\n    print(f\"{cand!r:26} BLEU-1 {bleu1(cand.split(), ref)}\")",
        "output": "'the cat sat on the mat'   BLEU-1 0.8333\n'the cat'                  BLEU-1 0.1353\n'on the mat the cat is'    BLEU-1 1.0",
        "codeNotes": [
          {
            "line": 6,
            "note": "The brevity penalty."
          },
          {
            "line": 9,
            "note": "BLEU-1 = BP × clipped unigram precision."
          }
        ],
        "tryIt": "The third candidate scores perfectly on BLEU-1 despite the wrong word order. What would BLEU-2 (bigrams) add?",
        "check": {
          "question": "brevity_penalty(12, 10) returns?",
          "options": [
            "0.8187",
            "1.0",
            "1.2"
          ],
          "answer": 1,
          "why": "A candidate longer than the reference gets no penalty."
        }
      }
    ],
    "summary": [
      "Automatic metrics compare candidates with human references to track progress cheaply.",
      "BLEU uses clipped n-gram precision (1-4 grams) and a brevity penalty exp(1 - r/c) for short outputs.",
      "ROUGE-1 recall = clipped overlap / reference length; ROUGE-2 and ROUGE-L extend it.",
      "Exact match suits short answers; token F1 gives partial credit.",
      "Overlap metrics miss meaning and truth; combine them with embedding metrics and human judgement."
    ],
    "projectStep": {
      "title": "Evaluate generated text",
      "steps": [
        "Write a reference summary of a short article and three candidate summaries of different quality.",
        "Score each with BLEU-1, ROUGE-1 recall and your own judgement.",
        "Explain where the metrics agree and disagree with you."
      ]
    }
  },
  {
    "day": 29,
    "title": "Parameter-Efficient Fine-Tuning (PEFT): Low-Rank Adaptation (LoRA)",
    "goal": "You can explain why fine-tuning whole large models is costly, how parameter-efficient fine-tuning works, how LoRA adds a low-rank update B × A to frozen weights, compute LoRA parameter savings, and merge LoRA weights back into a model.",
    "minutes": 30,
    "recap": "Pre-trained models like BERT and GPT know a lot, but you often need them to follow your style, your domain or your task. Fine-tuning every parameter of a billion-parameter model is expensive. LoRA makes it cheap.",
    "parts": [
      {
        "title": "Why full fine-tuning is expensive",
        "say": [
          "Full fine-tuning updates every weight of the model. For a 7-billion-parameter model, that means storing and updating 7 billion numbers, plus optimiser state that can be two or three times larger.",
          "It needs large GPUs, takes a long time, and produces a full new copy of the model for every task: ten tasks, ten 14 GB copies.",
          "Yet research showed that the change needed to adapt a model to a task is often simple: it lives in a small number of directions in the huge weight space.",
          "Parameter-efficient fine-tuning (PEFT) methods freeze the original weights and train only a small number of new parameters.",
          "Methods include adapters (small layers inserted between existing ones), prefix and prompt tuning (learned vectors added to the input), and LoRA, the most widely used.",
          "The example estimates memory for full fine-tuning versus training only a small fraction of parameters.",
          "PEFT made it possible to fine-tune large models on a single consumer GPU."
        ],
        "example": "Customising a car by adding a roof rack and new seat covers instead of rebuilding the whole car.",
        "code": "params = 7_000_000_000\nbytes_per_param = 2                   # 16-bit weights\noptimizer_factor = 3                  # weights + two optimiser states, roughly\nfull = params * bytes_per_param * optimizer_factor / 1024 ** 3\ntrainable_share = 0.001\npeft = (params * bytes_per_param + params * trainable_share * bytes_per_param * optimizer_factor) / 1024 ** 3\nprint(f\"full fine-tuning: about {full:.0f} GiB\")\nprint(f\"training 0.1% of the parameters: about {peft:.0f} GiB\")",
        "output": "full fine-tuning: about 39 GiB\ntraining 0.1% of the parameters: about 13 GiB",
        "codeNotes": [
          {
            "line": 4,
            "note": "Every parameter needs its weight and optimiser state."
          },
          {
            "line": 6,
            "note": "Frozen weights only need storing; only the small part is trained."
          }
        ],
        "tryIt": "Why does the PEFT estimate still include params * bytes_per_param?",
        "check": {
          "question": "What does parameter-efficient fine-tuning change?",
          "options": [
            "Every weight of the model",
            "Only a small number of new parameters, with the original weights frozen",
            "Only the tokenizer"
          ],
          "answer": 1,
          "why": "PEFT freezes the base model and trains a small add-on."
        }
      },
      {
        "title": "Low-rank matrices",
        "say": [
          "A weight matrix W of size d × k has d × k numbers. For d = k = 4096, that is about 16.8 million.",
          "A low-rank matrix can be written as the product of two thin matrices: B (d × r) times A (r × k), where the rank r is small, such as 8.",
          "B × A still has shape d × k, but it is described by only r × (d + k) numbers: 65,536 for r = 8. That is 256 times fewer.",
          "Low rank means the matrix can only express changes in r independent directions. The LoRA bet is that task adaptation needs only a few such directions.",
          "Practice 1 is lora_params(d, k, r): the full count d × k, the LoRA count r × (d + k), and the percentage saving rounded to 2 decimals.",
          "The example builds a small rank-1 matrix from two vectors and shows every row is a multiple of the same row.",
          "This \"outer product\" picture is the simplest way to see what low rank means."
        ],
        "example": "A multiplication table: 100 numbers, but completely described by the two lists of 10 numbers along its edges.",
        "code": "B = [[1.0], [2.0], [3.0]]      # 3 x 1\nA = [[0.5, 1.0, 0.0, 2.0]]      # 1 x 4\nproduct = [[sum(B[i][t] * A[t][j] for t in range(1)) for j in range(4)] for i in range(3)]\nfor row in product:\n    print(row)\nprint(\"numbers stored:\", 3 * 1 + 1 * 4, \"instead of\", 3 * 4)",
        "output": "[0.5, 1.0, 0.0, 2.0]\n[1.0, 2.0, 0.0, 4.0]\n[1.5, 3.0, 0.0, 6.0]\nnumbers stored: 7 instead of 12",
        "codeNotes": [
          {
            "line": 3,
            "note": "B times A gives a full 3 x 4 matrix."
          },
          {
            "line": 6,
            "note": "r x (d + k) numbers describe d x k entries."
          }
        ],
        "tryIt": "Compute lora_params(4096, 4096, 16). How does doubling r change the saving?",
        "check": {
          "question": "How many trainable numbers does LoRA need for a d × k matrix with rank r?",
          "options": [
            "d × k",
            "r × (d + k)",
            "r × d × k"
          ],
          "answer": 1,
          "why": "B has d × r entries and A has r × k entries."
        }
      },
      {
        "title": "How LoRA works",
        "say": [
          "LoRA (Low-Rank Adaptation, Hu and colleagues at Microsoft, 2021) freezes each chosen weight matrix W and adds a trainable low-rank update: W + (alpha / r) × B × A.",
          "A is initialised with small random values and B with zeros, so at the start B × A is zero and the model behaves exactly like the original.",
          "Only A and B are trained. The scaling factor alpha / r keeps the size of the update stable when you try different ranks.",
          "LoRA is usually applied to the attention projection matrices (queries and values, often all four), where it works well with ranks between 4 and 64.",
          "Each task gets its own tiny pair of matrices: a few megabytes instead of a full model copy. You can swap LoRA adapters on one shared base model to serve many tasks.",
          "QLoRA (2023) combines LoRA with a 4-bit quantised base model, allowing fine-tuning of very large models on a single GPU.",
          "The example runs an input through W alone and through W + BA to show the update's effect."
        ],
        "example": "Clip-on lenses for a camera: the camera stays the same, and you snap on a small lens for each kind of photo.",
        "code": "W = [[1.0, 0.0], [0.0, 1.0]]\nB = [[1.0], [2.0]]\nA = [[0.5, 0.25]]\nalpha, r = 1, 1\nx = [1.0, 2.0]\nWx = [sum(W[i][j] * x[j] for j in range(2)) for i in range(2)]\nAx = [sum(A[t][j] * x[j] for j in range(2)) for t in range(r)]\nBAx = [sum(B[i][t] * Ax[t] for t in range(r)) for i in range(2)]\nprint(\"frozen W x:\", Wx)\nprint(\"with LoRA:\", [w + alpha / r * u for w, u in zip(Wx, BAx)])",
        "output": "frozen W x: [1.0, 2.0]\nwith LoRA: [2.0, 4.0]",
        "codeNotes": [
          {
            "line": 7,
            "note": "First multiply by A (down to rank r)."
          },
          {
            "line": 8,
            "note": "Then by B (back up to the full size)."
          }
        ],
        "tryIt": "Set B to zeros. What does the LoRA output become, and why is that the right starting point?",
        "check": {
          "question": "Why is B initialised to zeros in LoRA?",
          "options": [
            "To save memory",
            "So training starts exactly from the original model's behaviour",
            "B is never trained"
          ],
          "answer": 1,
          "why": "With B = 0 the update B × A is zero at the start."
        }
      },
      {
        "title": "Merging LoRA into the model",
        "say": [
          "After training, you can merge the update into the weights: W_merged = W + (alpha / r) × B × A.",
          "The merged model has exactly the original shape and runs at exactly the original speed, with no extra computation at inference time.",
          "Alternatively, keep the adapter separate to switch tasks quickly, at a tiny cost in speed.",
          "Practice 2 is lora_merge(W, B, A, alpha, r): compute B × A with a triple loop or sum, scale it by alpha / r, add it to W, and round every entry to 4 decimals.",
          "The checks confirm that alpha scales the update and that a zero B returns W unchanged.",
          "Merging is plain matrix arithmetic, the same you would do on paper, just many times.",
          "The example merges an update and checks the merged matrix gives the same output as W plus the adapter."
        ],
        "example": "Sewing a patch permanently onto a jacket instead of pinning it on each morning.",
        "code": "def lora_merge(W, B, A, alpha, r):\n    scale = alpha / r\n    return [[round(W[i][j] + scale * sum(B[i][t] * A[t][j] for t in range(len(A))), 4)\n             for j in range(len(W[0]))] for i in range(len(W))]\n\nW = [[1.0, 0.0], [0.0, 1.0]]\nB = [[1.0], [2.0]]\nA = [[0.5, 0.25]]\nmerged = lora_merge(W, B, A, 1, 1)\nx = [1.0, 2.0]\nprint(\"merged W:\", merged)\nprint(\"merged W x:\", [sum(merged[i][j] * x[j] for j in range(2)) for i in range(2)])",
        "output": "merged W: [[1.5, 0.25], [1.0, 1.5]]\nmerged W x: [2.0, 4.0]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Entry (i, j) of B × A, scaled, added to W."
          },
          {
            "line": 12,
            "note": "The same output as frozen W plus the adapter."
          }
        ],
        "tryIt": "Merge with alpha = 2 and r = 1. How does the merged matrix change?",
        "check": {
          "question": "What is the advantage of merging LoRA weights?",
          "options": [
            "Better accuracy",
            "No extra computation at inference time",
            "Smaller training data"
          ],
          "answer": 1,
          "why": "The merged model has the original shape and speed."
        }
      },
      {
        "title": "Choosing rank and what to adapt",
        "say": [
          "Rank r controls capacity. Small r (4 to 8) is often enough for style or format changes; larger r (32 to 64) helps for new domains or harder tasks.",
          "Higher rank means more trainable parameters and more risk of overfitting a small dataset.",
          "Which matrices to adapt matters too. Adapting only the query and value projections is a common default; adapting all attention and feed-forward matrices usually gives better results for more parameters.",
          "Data quality matters more than any setting: a few hundred to a few thousand clean, representative examples often beat a large messy set.",
          "Always keep a held-out evaluation set and compare against the base model with good prompting; sometimes prompting alone is enough and no fine-tuning is needed.",
          "The example compares trainable parameters for several ranks across a model with 32 layers and four adapted 4096 × 4096 matrices per layer.",
          "Even at rank 64, the trainable share is well under 1 percent of a 7-billion-parameter model."
        ],
        "example": "Choosing how many adjustment knobs to give a sound engineer: a few for small tweaks, more for reshaping the whole sound.",
        "code": "layers, matrices, d = 32, 4, 4096\nbase = 7_000_000_000\nfor r in [4, 8, 16, 64]:\n    trainable = layers * matrices * r * (d + d)\n    print(f\"rank {r:2}: {trainable:>11,} trainable parameters ({trainable / base:.3%} of the model)\")",
        "output": "rank  4:   4,194,304 trainable parameters (0.060% of the model)\nrank  8:   8,388,608 trainable parameters (0.120% of the model)\nrank 16:  16,777,216 trainable parameters (0.240% of the model)\nrank 64:  67,108,864 trainable parameters (0.959% of the model)",
        "codeNotes": [
          {
            "line": 4,
            "note": "r × (d + k) per adapted matrix."
          }
        ],
        "tryIt": "How much does the trainable count grow when you double the rank?",
        "check": {
          "question": "When might a small rank such as 4 be enough?",
          "options": [
            "Never",
            "For simple adjustments like output style or format",
            "Only for image models"
          ],
          "answer": 1,
          "why": "Simple behaviour changes often need only a few directions."
        }
      },
      {
        "title": "Practice time: savings and merging",
        "say": [
          "Practice 1: lora_params(d, k, r). Return a dictionary with full = d * k, lora = r * (d + k), and saving_pct = (1 - lora / full) * 100 rounded to 2 decimals.",
          "Checks: 4096 × 4096 at rank 8 saves 99.61 percent; a small 100 × 50 matrix at rank 10 saves 70.0 percent.",
          "Practice 2: lora_merge(W, B, A, alpha, r). For each entry, add scale × sum over t of B[i][t] × A[t][j]; the inner dimension is len(A) (the rank).",
          "Checks: alpha = 1 and 2 with rank 1, and a zero B returning W exactly.",
          "You now understand, and can compute by hand, the technique behind most open-model fine-tuning today.",
          "After passing, compute how many LoRA adapters for different tasks would fit in the space of one full model copy.",
          "The example does that."
        ],
        "example": "Counting how many phone cases fit in the box that one phone came in.",
        "code": "full_model_gib = 13.0\nlayers, matrices, d, r = 32, 4, 4096, 8\nadapter_bytes = layers * matrices * r * (d + d) * 2\nadapter_mib = adapter_bytes / 1024 ** 2\nprint(f\"one adapter: {adapter_mib:.0f} MiB\")\nprint(f\"adapters that fit in one full model copy: {int(full_model_gib * 1024 / adapter_mib)}\")",
        "output": "one adapter: 16 MiB\nadapters that fit in one full model copy: 832",
        "codeNotes": [
          {
            "line": 3,
            "note": "Parameters times 2 bytes each (16-bit)."
          }
        ],
        "tryIt": "How many rank-64 adapters would fit instead?",
        "check": {
          "question": "lora_params(100, 50, 10)[\"lora\"] equals?",
          "options": [
            "500",
            "1500",
            "5000"
          ],
          "answer": 1,
          "why": "10 × (100 + 50) = 1,500."
        }
      }
    ],
    "summary": [
      "Full fine-tuning updates every weight: costly in memory, time and storage per task.",
      "PEFT freezes the base model and trains a small number of new parameters.",
      "LoRA adds (alpha / r) × B × A to frozen weights; B starts at zero, so training starts from the original model.",
      "A rank-r update of a d × k matrix needs r × (d + k) parameters instead of d × k.",
      "Merge LoRA into the weights for zero inference overhead, or keep adapters separate to switch tasks."
    ],
    "projectStep": {
      "title": "Plan a LoRA fine-tune",
      "steps": [
        "Pick a task from your work and describe the examples you would collect.",
        "Compute trainable parameters and adapter size for ranks 8 and 32 on a model of your choice.",
        "Merge a toy LoRA update into a 2 × 2 matrix and check the outputs by hand."
      ]
    }
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Natural Language Processing & LLM Infrastructure Engine",
    "goal": "You can design an end-to-end NLP system that answers questions over documents: clean and tokenise text, retrieve relevant passages, re-rank them, extract or generate an answer, evaluate it, and audit the whole pipeline.",
    "minutes": 30,
    "recap": "Thirty days ago you cleaned your first sentence. Today's capstone combines everything into the kind of system companies build most today: question answering over their own documents.",
    "parts": [
      {
        "title": "The capstone architecture",
        "say": [
          "The goal: a user asks a question in plain language, and the system answers from a collection of documents, pointing to its sources.",
          "Stage 1, preparation: clean and split documents into passages (Days 1-2, 22), and index them for sparse and dense search (Days 4-6, 26).",
          "Stage 2, retrieval: turn the question into the same representation and shortlist the most relevant passages (Days 5, 6, 26).",
          "Stage 3, re-ranking: score the shortlist more carefully and keep the best few (Day 26).",
          "Stage 4, answering: extract a span with a QA model (Day 25), or give the passages to a generative model with careful decoding settings (Days 24, 27). This combination is retrieval-augmented generation (RAG).",
          "Stage 5, evaluation and monitoring: measure retrieval recall, answer exact match and F1, and faithfulness to sources (Days 25, 28).",
          "The example prints the pipeline with the day behind each stage."
        ],
        "example": "A research assistant who finds the right books, reads the relevant pages, and answers your question while showing you where it found the answer.",
        "code": "stages = [(\"prepare: clean, split, index\", \"1, 2, 4, 22\"), (\"retrieve: shortlist passages\", \"5, 6, 26\"),\n          (\"re-rank: keep the best few\", \"26\"), (\"answer: extract or generate\", \"24, 25, 27\"),\n          (\"evaluate: recall, EM, F1, faithfulness\", \"25, 28\")]\nfor n, (stage, days) in enumerate(stages, 1):\n    print(f\"{n}. {stage:38} (Day{'s' if ',' in days else ''} {days})\")",
        "output": "1. prepare: clean, split, index           (Days 1, 2, 4, 22)\n2. retrieve: shortlist passages           (Days 5, 6, 26)\n3. re-rank: keep the best few             (Day 26)\n4. answer: extract or generate            (Days 24, 25, 27)\n5. evaluate: recall, EM, F1, faithfulness (Days 25, 28)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Each stage reuses earlier lessons."
          }
        ],
        "tryIt": "Where would fine-tuning with LoRA (Day 29) fit into this pipeline?",
        "check": {
          "question": "What is retrieval-augmented generation (RAG)?",
          "options": [
            "Training a model on every document",
            "Retrieving relevant passages and giving them to a model to answer from",
            "Translating documents"
          ],
          "answer": 1,
          "why": "RAG grounds the model's answer in retrieved passages."
        }
      },
      {
        "title": "Preparing passages",
        "say": [
          "Long documents must be split into passages (chunks) small enough for retrieval and for the answering model's context window.",
          "A common approach: chunks of a few hundred tokens with some overlap between neighbours, so an answer that crosses a boundary is not cut in half.",
          "Keep metadata with each chunk: the document title, section and position, so answers can cite their source.",
          "Clean consistently (Day 1) and use the SAME cleaning for questions later, the rule from Day 5.",
          "Chunk size is a trade-off. Too small and chunks lose context; too large and retrieval gets less precise and the answering model has more to read.",
          "The example splits a document into overlapping word windows with their positions.",
          "Getting chunking right often improves a RAG system more than changing the model."
        ],
        "example": "Cutting a long film into scenes for a trailer, with a few seconds of overlap so no line of dialogue is cut mid-sentence.",
        "code": "words = (\"Mount Everest is the highest mountain on Earth. It lies in the Himalayas on the border \"\n         \"of Nepal and China. Climbers usually start from base camp in Nepal.\").split()\nsize, overlap = 10, 3\nchunks = []\nfor start in range(0, len(words), size - overlap):\n    chunks.append((start, \" \".join(words[start:start + size])))\n    if start + size >= len(words):\n        break\nfor start, text in chunks:\n    print(f\"words {start:2}+: {text}\")",
        "output": "words  0+: Mount Everest is the highest mountain on Earth. It lies\nwords  7+: Earth. It lies in the Himalayas on the border of\nwords 14+: the border of Nepal and China. Climbers usually start from\nwords 21+: usually start from base camp in Nepal.",
        "codeNotes": [
          {
            "line": 5,
            "note": "Step forward by size - overlap so neighbouring chunks share words."
          },
          {
            "line": 7,
            "note": "Stop once the last chunk reaches the end."
          }
        ],
        "tryIt": "Change the overlap to 0. Is any fact now split across two chunks?",
        "check": {
          "question": "Why do chunks often overlap?",
          "options": [
            "To use more storage",
            "So information at a boundary is fully contained in at least one chunk",
            "Overlap is required by BM25"
          ],
          "answer": 1,
          "why": "Overlap prevents answers from being cut across chunk boundaries."
        }
      },
      {
        "title": "Retrieving passages",
        "say": [
          "Practice 1 is retrieve(question, passages, stopwords, k): a complete, simple retriever.",
          "Tokenise the question and each passage (lowercase, keep letters, digits and spaces, split, drop stopwords), build word-count dictionaries, and score passages by cosine similarity (Day 6) with the question.",
          "Return the ids of the top k passages with a score above 0, best first, ties broken by id.",
          "This is sparse retrieval with count vectors. In production you would add TF-IDF weights or BM25, dense embeddings, and a re-ranker, but the structure is identical.",
          "collections.Counter gives the word counts, and a cosine over dictionaries only needs the shared words for the dot product.",
          "Returning nothing when no passage shares a word is important: it lets the system say \"I don't know\" instead of answering from irrelevant text.",
          "The example retrieves passages for two questions from a tiny collection."
        ],
        "example": "A librarian who, given your question, pulls the three most relevant pages and hands them over in order of relevance, or says none are relevant.",
        "code": "import math, re\nfrom collections import Counter\n\nSTOP = {\"is\", \"the\", \"on\", \"in\", \"a\", \"what\", \"which\", \"of\", \"where\"}\ndef vec(text):\n    return Counter(w for w in re.sub(r\"[^a-z0-9 ]\", \" \", text.lower()).split() if w not in STOP)\ndef cos(a, b):\n    dot = sum(a[w] * b.get(w, 0) for w in a)\n    na, nb = math.sqrt(sum(v * v for v in a.values())), math.sqrt(sum(v * v for v in b.values()))\n    return 0.0 if na == 0 or nb == 0 else dot / (na * nb)\npassages = {\"p1\": \"Mount Everest is the highest mountain on Earth.\", \"p2\": \"The Nile is the longest river.\",\n            \"p3\": \"Everest base camp is in Nepal.\"}\nfor q in [\"What is the highest mountain?\", \"Where is Everest base camp?\"]:\n    scores = {p: cos(vec(q), vec(t)) for p, t in passages.items()}\n    print(q, \"->\", sorted((p for p in scores if scores[p] > 0), key=lambda p: (-scores[p], p))[:2])",
        "output": "What is the highest mountain? -> ['p1']\nWhere is Everest base camp? -> ['p3', 'p1']",
        "codeNotes": [
          {
            "line": 6,
            "note": "The same cleaning for questions and passages."
          },
          {
            "line": 15,
            "note": "Keep positive scores, best first, ties by id."
          }
        ],
        "tryIt": "Ask \"How long is the Nile river?\". Which passage comes back?",
        "check": {
          "question": "Why return no passages when nothing shares a word with the question?",
          "options": [
            "To save time",
            "So the system can say it does not know instead of answering from irrelevant text",
            "Because cosine fails"
          ],
          "answer": 1,
          "why": "An honest \"no answer\" beats a confident answer from unrelated passages."
        }
      },
      {
        "title": "Answering and grounding",
        "say": [
          "With the best passages in hand, there are two ways to answer.",
          "Extractive: run a QA model over each passage and return the best span (Day 25). Answers are always copied from the source, so they are faithful by construction.",
          "Generative: give the question and passages to a language model with an instruction such as \"Answer only from the passages below and cite them; if they do not contain the answer, say so.\" Use low temperature (Day 27).",
          "Generative answers read more naturally but can hallucinate, stating things not in the sources. Grounding checks compare the answer with the passages.",
          "A simple grounding check: what share of the answer's content words appear in the retrieved passages? A low share is a warning sign.",
          "Always show sources to the user, so they can verify important answers.",
          "The example builds a grounded prompt and runs a simple word-overlap grounding check on two answers."
        ],
        "example": "A student who must answer only from the handout and cite the page; a teacher checks that every claim appears on those pages.",
        "code": "passages = [\"Mount Everest is the highest mountain on Earth.\", \"Everest base camp is in Nepal.\"]\nquestion = \"Where is Everest base camp?\"\nprompt = \"Answer only from these passages and cite them.\\n\" + \"\\n\".join(f\"[{i + 1}] {p}\" for i, p in enumerate(passages))\nprompt += f\"\\nQuestion: {question}\"\nprint(prompt)\nsource_words = set(\" \".join(passages).lower().replace(\".\", \"\").split())\nfor answer in [\"Base camp is in Nepal [2].\", \"Base camp is in Tibet, near Lhasa.\"]:\n    words = [w for w in answer.lower().replace(\".\", \"\").replace(\",\", \"\").split() if not w.startswith(\"[\")]\n    grounded = sum(w in source_words for w in words) / len(words)\n    print(f\"{answer!r:38} grounded {grounded:.0%}\")",
        "output": "Answer only from these passages and cite them.\n[1] Mount Everest is the highest mountain on Earth.\n[2] Everest base camp is in Nepal.\nQuestion: Where is Everest base camp?\n'Base camp is in Nepal [2].'           grounded 100%\n'Base camp is in Tibet, near Lhasa.'   grounded 57%",
        "codeNotes": [
          {
            "line": 3,
            "note": "Numbered passages make citations easy."
          },
          {
            "line": 9,
            "note": "Share of answer words found in the sources."
          }
        ],
        "tryIt": "Why is word overlap only a rough grounding check? Think of an answer that reuses source words but says something false.",
        "check": {
          "question": "What is a hallucination in a RAG system?",
          "options": [
            "A slow answer",
            "A stated fact that is not supported by the retrieved sources",
            "A missing citation number"
          ],
          "answer": 1,
          "why": "Hallucinations are claims the sources do not support."
        }
      },
      {
        "title": "Evaluating and auditing the system",
        "say": [
          "A system with several stages needs measurements at each stage, or you cannot tell where problems come from.",
          "Retrieval: recall at k (is a relevant passage in the top k?). Answers: exact match and F1 against reference answers (Day 25), plus faithfulness to sources.",
          "Operations: latency per stage, cost per question, and the share of questions answered with \"I don't know\".",
          "Before launch, run an audit: each component is scored against a target, and the system is certified only if every component passes and the overall average is high enough.",
          "Practice 2 is audit_nlp_capstone(results): components passing at 70 or more, the average rounded to 1 decimal, and certification only when nothing fails, the average is at least 80, and there is at least one component.",
          "After launch, keep a fixed test set and re-run it after every change, the same discipline as in the search milestone.",
          "The example prints a small evaluation report for a pipeline."
        ],
        "example": "A car's annual inspection: brakes, lights, tyres and emissions are each checked, and the car passes only if every check does.",
        "code": "report = {\"retrieval recall@5\": 88, \"answer exact match\": 74, \"answer F1\": 83, \"faithfulness\": 91, \"latency score\": 65}\nfor name, score in report.items():\n    print(f\"{name:22} {score:3}  {'PASS' if score >= 70 else 'FAIL'}\")\naverage = round(sum(report.values()) / len(report), 1)\nfailed = [n for n, s in report.items() if s < 70]\nprint(\"average:\", average, \"| certified:\", not failed and average >= 80)",
        "output": "retrieval recall@5      88  PASS\nanswer exact match      74  PASS\nanswer F1               83  PASS\nfaithfulness            91  PASS\nlatency score           65  FAIL\naverage: 80.2 | certified: False",
        "codeNotes": [
          {
            "line": 3,
            "note": "Each component passes at 70 or more."
          },
          {
            "line": 6,
            "note": "Certified only if nothing fails and the average is high enough."
          }
        ],
        "tryIt": "Improve latency to 80. Is the system certified now?",
        "check": {
          "question": "Why measure each stage separately?",
          "options": [
            "It is required by law",
            "To find which stage causes a problem",
            "To make the report longer"
          ],
          "answer": 1,
          "why": "Stage-level metrics show where to improve."
        }
      },
      {
        "title": "Capstone practice and what comes next",
        "say": [
          "Practice 1: retrieve(question, passages, stopwords, k). Write a small vec helper (lowercase, keep a-z, 0-9 and spaces, split, drop stopwords, Counter) and a cosine helper over dictionaries, then sort positive scores by (-score, id) and slice to k.",
          "The checks ask about the highest mountain (one passage), Everest in Nepal (two passages, the one mentioning both words first), and a question with no overlap (an empty list).",
          "Practice 2: audit_nlp_capstone(results). Sorted passed and failed lists, a rounded average (0.0 when there are no results), and the certification rule.",
          "You have now built, in plain Python, every major idea in modern NLP: cleaning, counting, vectors, embeddings, taggers, classifiers, recurrent networks, attention, Transformers, BERT, GPT, tokenisers, retrieval, decoding, evaluation and fine-tuning.",
          "Good next steps: use the Hugging Face transformers library to run real models, build a RAG system over your own documents, and read the original papers you met, starting with \"Attention Is All You Need\".",
          "Congratulations on finishing the 30 days of NLP in Python.",
          "The example prints the path you travelled through the course milestones."
        ],
        "example": "Graduating from building each instrument yourself to conducting the whole orchestra.",
        "code": "milestones = {5: \"TF-IDF search engine\", 15: \"embeddings, taggers and BiLSTMs\",\n              21: \"a Transformer encoder layer\", 30: \"retrieval-augmented question answering\"}\nfor day in sorted(milestones):\n    print(f\"Day {day:2}: {milestones[day]}\")\nprint(\"next: real models, your own documents, and the original papers\")",
        "output": "Day  5: TF-IDF search engine\nDay 15: embeddings, taggers and BiLSTMs\nDay 21: a Transformer encoder layer\nDay 30: retrieval-augmented question answering\nnext: real models, your own documents, and the original papers",
        "codeNotes": [
          {
            "line": 3,
            "note": "The four milestones of the course."
          }
        ],
        "tryIt": "Write down the one topic from the course you want to explore more deeply, and why.",
        "check": {
          "question": "In the capstone pipeline, what should the system do when no passage is relevant?",
          "options": [
            "Answer anyway from the model's memory",
            "Say it does not know",
            "Pick a random passage"
          ],
          "answer": 1,
          "why": "Admitting \"no answer\" is safer than answering without evidence."
        }
      }
    ],
    "summary": [
      "A document QA system prepares passages, retrieves, re-ranks, answers and evaluates.",
      "Chunk documents with overlap and keep source metadata for citations.",
      "Use the same cleaning for questions and passages; return nothing when nothing is relevant.",
      "Extractive answers are faithful by construction; generative answers need grounding checks and sources.",
      "Measure every stage (recall, EM, F1, faithfulness, latency) and certify only when all pass."
    ],
    "projectStep": {
      "title": "Capstone: ask your documents",
      "steps": [
        "Split three of your documents into overlapping passages with ids.",
        "Answer five questions with retrieve and a grounded prompt, citing passage ids.",
        "Score the system with recall, exact match and a component audit, and list your next improvement."
      ]
    }
  }
];
