import json, subprocess, hashlib, os

# 1. Update Day 52 Part 3 code
with open('scripts/react_day52.json', 'r', encoding='utf-8') as f:
    d52 = json.load(f)

new_p3_code = """class EdgeJwtVerifier {
  constructor(secretKey) {
    this.secretKey = secretKey;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  }

  toBase64Url(str) {
    let res = '';
    for (let i = 0; i < str.length; i += 3) {
      const b0 = str.charCodeAt(i);
      const b1 = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
      const b2 = i + 2 < str.length ? str.charCodeAt(i + 2) : 0;
      res += this.chars[b0 >> 2];
      res += this.chars[((b0 & 3) << 4) | (b1 >> 4)];
      if (i + 1 < str.length) res += this.chars[((b1 & 15) << 2) | (b2 >> 6)];
      if (i + 2 < str.length) res += this.chars[b2 & 63];
    }
    return res;
  }

  fromBase64Url(b64) {
    const map = {};
    for (let i = 0; i < this.chars.length; i++) map[this.chars[i]] = i;
    let res = '';
    for (let i = 0; i < b64.length; i += 4) {
      const c0 = map[b64[i]];
      const c1 = map[b64[i + 1]];
      const c2 = i + 2 < b64.length ? map[b64[i + 2]] : 0;
      const c3 = i + 3 < b64.length ? map[b64[i + 3]] : 0;
      res += String.fromCharCode((c0 << 2) | (c1 >> 4));
      if (i + 2 < b64.length) res += String.fromCharCode(((c1 & 15) << 4) | (c2 >> 2));
      if (i + 3 < b64.length) res += String.fromCharCode(((c2 & 3) << 6) | c3);
    }
    return res;
  }

  sign(payload, expirySeconds = 3600) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(1700000000000 / 1000);
    const enrichedPayload = Object.assign({}, payload, {
      iat: now,
      exp: now + expirySeconds
    });

    const encHeader = this.toBase64Url(JSON.stringify(header));
    const encPayload = this.toBase64Url(JSON.stringify(enrichedPayload));
    const signature = this.mockHmacSha256(encHeader + '.' + encPayload, this.secretKey);

    return encHeader + '.' + encPayload + '.' + signature;
  }

  verify(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'MALFORMED_JWT_STRUCTURE' };
    }

    const [encHeader, encPayload, signature] = parts;
    const expectedSig = this.mockHmacSha256(encHeader + '.' + encPayload, this.secretKey);

    if (signature !== expectedSig) {
      return { valid: false, error: 'INVALID_CRYPTOGRAPHIC_SIGNATURE' };
    }

    const payload = JSON.parse(this.fromBase64Url(encPayload));
    const now = Math.floor(1700000000000 / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'TOKEN_EXPIRED' };
    }

    return { valid: true, payload };
  }

  mockHmacSha256(data, secret) {
    let hash = 0;
    const combined = data + secret;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0;
    }
    return 'sig_' + Math.abs(hash).toString(16);
  }
}

const verifier = new EdgeJwtVerifier('enterprise_super_secret_key_4920');

console.log('--- EDGE CRYPTOGRAPHIC TOKEN VERIFICATION ---');
const validToken = verifier.sign({ sub: 'user_9921', role: 'ADMIN', org: 'PinIT_Corp' }, 3600);
const resValid = verifier.verify(validToken);
console.log('Valid Token Verification:');
console.log('  Status:', resValid.valid ? 'VALID_AUTHORIZED' : 'REJECTED');
console.log('  Claims:', JSON.stringify(resValid.payload));

const tamperedToken = validToken.slice(0, -4) + 'abcd';
const resTampered = verifier.verify(tamperedToken);
console.log('Tampered Token Verification:');
console.log('  Status:', resTampered.valid ? 'VALID_AUTHORIZED' : 'REJECTED');
console.log('  Error:', resTampered.error);"""

res = subprocess.run(['node', '-e', new_p3_code], capture_output=True, text=True)
p3_output = res.stdout.strip()
d52['parts'][2]['code'] = new_p3_code
d52['parts'][2]['output'] = p3_output

with open('scripts/react_day52.json', 'w', encoding='utf-8') as f:
    json.dump(d52, f, indent=2)

# 2. Remove 'id' from all parts in Day 54 and Day 55
for d in (54, 55):
    with open(f'scripts/react_day{d}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    for p in data['parts']:
        if 'id' in p:
            del p['id']
    with open(f'scripts/react_day{d}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

# 3. Regenerate visuals for Day 51-55
subprocess.run(['python', 'scripts/generate_visuals_block11.py'], check=True)

# 4. Re-append Days 51-55 into reactLongLessons.ts
# First, remove Day 51-55 if already appended
with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    rll_text = f.read()

idx51 = rll_text.find('"day": 51')
if idx51 != -1:
    # Back up to the comma before Day 51
    comma_idx = rll_text.rfind(',', 0, idx51)
    # Find the closing ]; at the end
    end_idx = rll_text.rfind('];')
    rll_text = rll_text[:comma_idx] + '\n];\n'

# Now load Days 51-55
new_lessons = []
for d in range(51, 56):
    with open(f'scripts/react_day{d}.json', 'r', encoding='utf-8') as f:
        lesson = json.load(f)
        if 'desc' in lesson.get('projectStep', {}):
            del lesson['projectStep']['desc']
        for p in lesson['parts']:
            if 'id' in p:
                del p['id']
        new_lessons.append(lesson)

last_bracket_idx = rll_text.rfind('];')
new_lessons_json = [json.dumps(l, indent=2) for l in new_lessons]
insertion_text = ",\n" + ",\n".join(new_lessons_json) + "\n"
updated_rll_text = rll_text[:last_bracket_idx] + insertion_text + rll_text[last_bracket_idx:]

with open('src/lib/data/reactLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(updated_rll_text)

print("Successfully updated Day 52 Part 3, cleaned Day 54/55 part ids, regenerated visuals, and re-appended reactLongLessons.ts!")
