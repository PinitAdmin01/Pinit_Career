import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

console.log('FULLSTACK_JS_LONG_LESSONS length:', FULLSTACK_JS_LONG_LESSONS.length);
FULLSTACK_JS_LONG_LESSONS.forEach((l, idx) => {
  console.log(`Index ${idx}: Day ${l.day} - ${l.title}`);
});
