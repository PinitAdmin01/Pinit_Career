with open('src/components/ui/AppSidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

demo_link = '''
            <span style={{ opacity: 0.4 }}>•</span>
            <Link
              href="/internship-demo"
              style={{
                color: 'var(--t2)',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '2px 4px',
                borderRadius: 4,
              }}
              title="Job Simulation Interactive Demo"
            >
              🧪 Demo
            </Link>'''

marker = '👨‍🏫 Teacher\n            </Link>'
marker_crlf = '👨‍🏫 Teacher\r\n            </Link>'

if marker in content:
    idx = content.find(marker) + len(marker)
    content = content[:idx] + demo_link + content[idx:]
    with open('src/components/ui/AppSidebar.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added Demo link (LF)")
elif marker_crlf in content:
    idx = content.find(marker_crlf) + len(marker_crlf)
    content = content[:idx] + demo_link.replace('\n', '\r\n') + content[idx:]
    with open('src/components/ui/AppSidebar.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added Demo link (CRLF)")
else:
    print("Marker not found in AppSidebar.tsx")
