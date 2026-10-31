const fs = require('fs');
let code = fs.readFileSync('src/components/ui/AppShell.tsx', 'utf8');

const replacement = `  // Signed out on a private page: immediately replace history state with /login
  useEffect(() => {
    if (!loading && user === null && !isPublic) {
      if (typeof window !== 'undefined') {
        const hasLocalSession = Boolean(
          localStorage.getItem('pinit_current_user') || 
          localStorage.getItem('pinit_user') || 
          localStorage.getItem('pinit_session_token')
        );
        if (hasLocalSession) return;
      }
      const search = typeof window !== 'undefined' ? window.location.search : '';
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/login');
        window.location.replace('/login');
      } else {
        router.push(\`/login?redirect=\${encodeURIComponent(\`\${pathname}\${search}\`)}\`);
      }
    }
  }, [user, loading, isPublic, router, pathname]);`;

const regex = /  \/\/ Signed out on a private page: immediately replace history state with \/login[\s\S]*?\}, \[user, loading, isPublic, router, pathname\]\);/;
if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/components/ui/AppShell.tsx', code, 'utf8');
  console.log('Successfully patched AppShell.tsx');
} else {
  console.error('Regex match failed');
  process.exit(1);
}
