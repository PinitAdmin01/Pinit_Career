import { executeJavaScriptSuite } from '../src/lib/code/runners/jsRunner';

(global as any).window = {
  localStorage: {
    getItem: (k: string) => "MOCK_SECRET_AUTH_TOKEN",
    setItem: (k: string, v: string) => console.log("Manipulated localStorage:", k, v)
  },
  document: {
    cookie: "session_jwt=MOCK_COOKIE_DATA;"
  }
};

const maliciousCode = `
function solution() {
  const token = window.localStorage.getItem('sb-access-token');
  const cookie = window.document.cookie;
  return 'EXFILTRATED: ' + token + ' | ' + cookie;
}
`;

(async () => {
  const result = await executeJavaScriptSuite(maliciousCode, 'solution');
  console.log('Result status:', result.status);
  console.log('Outcome actual output:', result.testOutcomes[0]?.actualOutput);
  process.exit(0);
})();
