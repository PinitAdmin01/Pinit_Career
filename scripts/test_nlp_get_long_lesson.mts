import { getLongLesson } from '../src/lib/data/longLessons';
import { NLP_PYTHON_LONG_LESSONS } from '../src/lib/data/nlpPythonLongLessons';

console.log('NLP_PYTHON_LONG_LESSONS length:', NLP_PYTHON_LONG_LESSONS.length);
for (let d = 1; d <= 60; d++) {
  const l1 = getLongLesson('nlp', d);
  const l2 = getLongLesson('nlp-py', d);
  if (!l1 || !l2) {
    console.log('Missing at day', d, 'nlp:', !!l1, 'nlp-py:', !!l2);
  }
}
console.log('Finished checking days 1 to 60.');
