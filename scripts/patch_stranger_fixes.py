# 1. Patch AppSidebar.tsx
with open('src/components/ui/AppSidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """export function isPathActive(pathname: string, href: string, currentSearch = ''): boolean {
  const cleanPathname = (pathname || '').split('?')[0].replace(/\/$/, '') || '/';
  const [rawHrefPath, hrefQuery] = (href || '').split('?');
  const hrefPath = rawHrefPath.replace(/\/$/, '') || '/';

  if (hrefPath === '/') return cleanPathname === '/';

  const searchStr = currentSearch.startsWith('?') ? currentSearch.slice(1) : currentSearch;"""

replacement = """export function isPathActive(pathname: string, href: string, currentSearch = ''): boolean {
  const cleanPathname = (pathname || '').split('?')[0].replace(/\/$/, '') || '/';
  const [rawHrefPath, hrefQuery] = (href || '').split('?');
  const hrefPath = rawHrefPath.replace(/\/$/, '') || '/';

  if (hrefPath === '/') return cleanPathname === '/';

  const rawSearch = currentSearch || (pathname && pathname.includes('?') ? pathname.split('?')[1] : '');
  const searchStr = rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch;"""

content_norm = content.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in content_norm:
    content_norm = content_norm.replace(target_norm, replacement_norm, 1)
    with open('src/components/ui/AppSidebar.tsx', 'w', encoding='utf-8') as f:
        f.write(content_norm)
    print("SUCCESS: Updated AppSidebar.tsx")
else:
    print("ERROR: AppSidebar target not found")

# 2. Patch src/app/api/interview/chat/route.ts
with open('src/app/api/interview/chat/route.ts', 'r', encoding='utf-8') as f:
    chat_content = f.read()

chat_target = """  const metricMatch = clean.match(/(\\d+%\\s*(?:latency|improvement|reduction|increase|drop)|10x|5x|\\d+\\s*(?:ms|seconds|minutes|hours|users|req\\/s|rps|nodes|servers|instances))/i);"""

chat_replacement = """  const metricMatch = clean.match(/(\\d+%\\s*(?:latency\\s*(?:drop|reduction|increase)?|improvement|reduction|increase|drop)|10x|5x|\\d+\\s*(?:ms|seconds|minutes|hours|users|req\\/s|rps|nodes|servers|instances))/i);"""

chat_norm = chat_content.replace('\r\n', '\n')
chat_target_norm = chat_target.replace('\r\n', '\n')
chat_repl_norm = chat_replacement.replace('\r\n', '\n')

if chat_target_norm in chat_norm:
    chat_norm = chat_norm.replace(chat_target_norm, chat_repl_norm, 1)
    with open('src/app/api/interview/chat/route.ts', 'w', encoding='utf-8') as f:
        f.write(chat_norm)
    print("SUCCESS: Updated src/app/api/interview/chat/route.ts")
else:
    print("ERROR: chat route target not found")
