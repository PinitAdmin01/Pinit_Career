with open('src/app/internships/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '<button\n          onClick={() => setShowLogModal(true)}'
target_crlf = '<button\r\n          onClick={() => setShowLogModal(true)}'

demo_button = '''<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            href="/internship-demo"
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              border: '1px solid #10b981',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              fontWeight: 800,
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
            title="Launch interactive testing sandbox"
          >
            🧪 Test Internship Demo →
          </Link>
          '''

if target in content:
    content = content.replace(target, demo_button + '<button\n          onClick={() => setShowLogModal(true)}')
    content = content.replace('</button>\n      </div>', '</button>\n        </div>\n      </div>')
    with open('src/app/internships/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched internships page (LF)")
elif target_crlf in content:
    content = content.replace(target_crlf, demo_button.replace('\n', '\r\n') + '<button\r\n          onClick={() => setShowLogModal(true)}')
    content = content.replace('</button>\r\n      </div>', '</button>\r\n        </div>\r\n      </div>')
    with open('src/app/internships/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched internships page (CRLF)")
else:
    print("Target not found in internships page")
