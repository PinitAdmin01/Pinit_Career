import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { CYBER_30_DAYS_CONFIGS } from './cybersecurity30DayData';

/**
 * Cybersecurity in Python (course-cyber-python), for the Python track.
 *
 * The same 30 days and topics as Cybersecurity Principles & Secure Systems (course-cybersecurity), but every
 * practice task is written and checked in Python. The lessons are the long Python lessons (longLessons.ts).
 * Checks are plain `assert` statements run after the student's code; the reference answers live in
 * tests/fixtures/cyber_python_solutions.json, not here, so students never download them.
 */
type Task = { title: string; desc: string; starter: string; hint: string; test: string };
type Day = { e: Task; a: Task };

const DAYS: Day[] = [
  {
    "e": {
      "title": "STRIDE Threat Classifier",
      "desc": "Write `stride_categories(description)` that tags a threat description with STRIDE categories using keyword stems (case-insensitive substring match): Spoofing: 'spoof', 'impersonat', 'fake login'; Tampering: 'tamper', 'modif', 'alter'; Repudiation: 'repudiat', 'deny doing', 'no audit'; Information Disclosure: 'leak', 'disclos', 'expos'; Denial of Service: 'flood', 'crash', 'unavailable'; Elevation of Privilege: 'escalat', 'privilege', 'become admin'. Return the matched category names in STRIDE order (S, T, R, I, D, E).",
      "starter": "STRIDE = [\n    ('Spoofing', ['spoof', 'impersonat', 'fake login']),\n    # add the other five categories in STRIDE order\n]\n\n\ndef stride_categories(description):\n    pass",
      "hint": "low = description.lower(); [name for name, stems in STRIDE if any(s in low for s in stems)]",
      "test": "r = stride_categories('Attacker impersonates a user and then modifies their bank details')\nassert r == ['Spoofing', 'Tampering'], f'Got {r}'\nassert stride_categories('A traffic FLOOD makes the API unavailable') == ['Denial of Service'], 'Case-insensitive'\nassert stride_categories('Debug page exposes secrets; a bug lets a guest escalate to admin') == ['Information Disclosure', 'Elevation of Privilege'], 'Two categories in STRIDE order'\nassert stride_categories('Users can deny doing a transfer because there is no audit log') == ['Repudiation'], 'Repudiation'\nassert stride_categories('The logo colour is wrong') == [], 'Not a threat'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Risk Score Matrix",
      "desc": "Write `risk_score(likelihood, impact)` for values 1-5 each. score = likelihood × impact. Level: LOW for 1-5, MEDIUM for 6-12, HIGH for 13-19, CRITICAL for 20-25. Return {'score': score, 'level': level}. Raise ValueError if either input is not an integer from 1 to 5.",
      "starter": "def risk_score(likelihood, impact):\n    pass",
      "hint": "if not (isinstance(x, int) and 1 <= x <= 5): raise ValueError",
      "test": "assert risk_score(1, 1) == {'score': 1, 'level': 'LOW'}, 'Rare and minor'\nassert risk_score(2, 3) == {'score': 6, 'level': 'MEDIUM'}, 'Boundary 6'\nassert risk_score(4, 4) == {'score': 16, 'level': 'HIGH'}, f'Got {risk_score(4, 4)}'\nassert risk_score(5, 4) == {'score': 20, 'level': 'CRITICAL'}, 'Boundary 20'\nfor bad in [(0, 3), (3, 6), (2.5, 2)]:\n    try:\n        risk_score(*bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Parameterised Query Builder",
      "desc": "Never paste user input into SQL. Write `build_query(table, filters)` returning (sql, params) where sql is 'SELECT * FROM <table> WHERE <col> = ? AND <col> = ?' (in the filters dict order) and params is a tuple of the values. With no filters, return 'SELECT * FROM <table>' and (). Table and column names cannot be parameters, so they must match r'[A-Za-z_][A-Za-z0-9_]*' exactly (use re.fullmatch); otherwise raise ValueError.",
      "starter": "import re\n\n\ndef build_query(table, filters):\n    pass",
      "hint": "Validate every identifier with re.fullmatch; values go into params, never into the SQL text.",
      "test": "sql, params = build_query('users', {'email': \"x' OR '1'='1\", 'active': 1})\nassert sql == 'SELECT * FROM users WHERE email = ? AND active = ?', f'Got {sql}'\nassert params == (\"x' OR '1'='1\", 1), 'The attack string stays a harmless value'\nassert build_query('orders', {}) == ('SELECT * FROM orders', ()), 'No filters'\nfor table, filters in [('users; DROP TABLE users', {}), ('users', {'name OR 1=1': 'x'}), ('1users', {})]:\n    try:\n        build_query(table, filters)\n        raise AssertionError(f'{table!r} / {filters} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "SQL Injection Pattern Detector",
      "desc": "Parameterised queries are the fix; detection is an extra alarm. Write `sqli_signals(value)` returning the sorted list of signals found (case-insensitive): 'QUOTE_OR' if the text matches r\"'\\s*or\\s\", 'COMMENT' if it contains '--' or '/*', 'STACKED' if it contains ';', 'UNION' if it matches r'union\\s+select'.",
      "starter": "import re\n\n\ndef sqli_signals(value):\n    pass",
      "hint": "low = value.lower(); check each pattern with re.search or 'in', then return sorted(found)",
      "test": "assert sqli_signals(\"admin' OR 1=1 --\") == ['COMMENT', 'QUOTE_OR'], f\"Got {sqli_signals(chr(39))}\"\nassert sqli_signals('1 UNION  SELECT password FROM users') == ['UNION'], 'Union-based'\nassert sqli_signals(\"x'; DROP TABLE users; /* bye\") == ['COMMENT', 'STACKED'], f\"Got {sqli_signals('x')}\"\nassert sqli_signals(\"O'Brien\") == [], 'An apostrophe in a name is normal'\nassert sqli_signals('Priya from Pune') == [], \"'or' inside words must not match\"\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "HTML Output Escaping",
      "desc": "The main defence against cross-site scripting is escaping output. Write `escape_html(text)` replacing & with &amp;, < with &lt;, > with &gt;, \" with &quot; and ' with &#x27;. Replace & FIRST so the other entities are not double-escaped.",
      "starter": "def escape_html(text):\n    pass",
      "hint": "Chain str.replace calls, starting with '&'.",
      "test": "assert escape_html('<script>alert(1)</script>') == '&lt;script&gt;alert(1)&lt;/script&gt;', 'Script tag neutralised'\nassert escape_html('Tom & \"Jerry\"') == 'Tom &amp; &quot;Jerry&quot;', 'Ampersand and quotes'\nassert escape_html(\"it's\") == 'it&#x27;s', 'Single quote'\nassert escape_html('&lt;') == '&amp;lt;', 'Existing entities are escaped once, as text'\nassert escape_html('plain text') == 'plain text', 'Safe text unchanged'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Content Security Policy Builder",
      "desc": "Write `csp_header(policy)` where policy maps directive names to lists of sources, e.g. {'default-src': [\"'self'\"], 'img-src': [\"'self'\", 'data:']}. Return 'default-src 'self'; img-src 'self' data:' (directives in dict order, joined with '; '). Raise ValueError if script-src (or default-src when there is no script-src) contains \"'unsafe-inline'\", because that disables CSP's main protection against XSS.",
      "starter": "def csp_header(policy):\n    pass",
      "hint": "script_sources = policy.get('script-src', policy.get('default-src', []))",
      "test": "p = {'default-src': [\"'self'\"], 'script-src': [\"'self'\", 'https://cdn.example.com'], 'img-src': [\"'self'\", 'data:']}\nassert csp_header(p) == \"default-src 'self'; script-src 'self' https://cdn.example.com; img-src 'self' data:\", f'Got {csp_header(p)}'\nassert csp_header({'default-src': [\"'none'\"]}) == \"default-src 'none'\", 'Single directive'\nassert csp_header({'default-src': [\"'self'\", \"'unsafe-inline'\"], 'script-src': [\"'self'\"]}) == \"default-src 'self' 'unsafe-inline'; script-src 'self'\", 'script-src overrides default-src for scripts'\nfor bad in [{'script-src': [\"'unsafe-inline'\"]}, {'default-src': [\"'self'\", \"'unsafe-inline'\"]}]:\n    try:\n        csp_header(bad)\n        raise AssertionError(f'{bad} allows inline scripts and must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "CSRF Token Check",
      "desc": "Write `csrf_ok(session_token, form_token)` returning True only if both tokens are non-empty strings and equal, compared with hmac.compare_digest (a constant-time comparison that does not leak how many characters matched).",
      "starter": "import hmac\n\n\ndef csrf_ok(session_token, form_token):\n    pass",
      "hint": "if not session_token or not form_token: return False; return hmac.compare_digest(a, b)",
      "test": "assert csrf_ok('a8f3c9d2e1', 'a8f3c9d2e1') is True, 'Matching tokens'\nassert csrf_ok('a8f3c9d2e1', 'a8f3c9d2e2') is False, 'One character different'\nassert csrf_ok('', '') is False, 'Empty tokens never pass'\nassert csrf_ok('abc', None) is False, 'Missing form token'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Secure Cookie Header",
      "desc": "Write `set_cookie(name, value, same_site='Lax', secure=True, http_only=True, max_age=None)` returning a Set-Cookie value: '<name>=<value>; Path=/' then '; Max-Age=<n>' if given, '; Secure' if secure, '; HttpOnly' if http_only, and '; SameSite=<same_site>'. same_site must be Strict, Lax or None (ValueError otherwise). SameSite=None without Secure is rejected by browsers, so raise ValueError for that too.",
      "starter": "def set_cookie(name, value, same_site='Lax', secure=True, http_only=True, max_age=None):\n    pass",
      "hint": "parts = [f'{name}={value}', 'Path=/']; append optional parts in order; '; '.join(parts)",
      "test": "assert set_cookie('session', 'abc123') == 'session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax', f\"Got {set_cookie('session', 'abc123')}\"\nassert set_cookie('theme', 'dark', 'Strict', True, False, 3600) == 'theme=dark; Path=/; Max-Age=3600; Secure; SameSite=Strict', 'JavaScript-readable cookie with expiry'\nassert set_cookie('embed', 'x', 'None') == 'embed=x; Path=/; Secure; HttpOnly; SameSite=None', 'Cross-site cookie must be Secure'\nfor args in [('a', 'b', 'None', False), ('a', 'b', 'Loose')]:\n    try:\n        set_cookie(*args)\n        raise AssertionError(f'{args} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Mini Web Application Firewall",
      "desc": "Milestone: write `waf_check(request)` where request has 'path', 'query' and 'body' strings. Look at all three joined together, lower-cased. Rules: SQLI if it matches r\"'\\s*or\\s\" or r'union\\s+select' or contains '--'; XSS if it contains '<script', 'javascript:' or 'onerror='; TRAVERSAL if it contains '../' or '..\\\\'. Return {'blocked': True if any rule matched, 'rules': sorted matched rule names}.",
      "starter": "import re\n\n\ndef waf_check(request):\n    pass",
      "hint": "text = ' '.join(request.get(k, '') for k in ('path', 'query', 'body')).lower()",
      "test": "ok = {'path': '/search', 'query': 'q=running shoes', 'body': ''}\nassert waf_check(ok) == {'blocked': False, 'rules': []}, 'Normal request'\nxss = {'path': '/comment', 'query': '', 'body': 'Nice post <SCRIPT>steal()</script>'}\nassert waf_check(xss) == {'blocked': True, 'rules': ['XSS']}, f'Got {waf_check(xss)}'\nmulti = {'path': '/files/../../etc/passwd', 'query': \"id=1' OR 1=1 --\", 'body': ''}\nassert waf_check(multi) == {'blocked': True, 'rules': ['SQLI', 'TRAVERSAL']}, f'Got {waf_check(multi)}'\nassert waf_check({'path': '/', 'query': 'img=x onerror=alert(1)', 'body': ''})['rules'] == ['XSS'], 'Event handler injection'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Safe Upload Filename",
      "desc": "Write `safe_filename(name)`: keep only the part after the last / or \\\\ (so paths cannot escape the upload folder), replace every character that is not a letter, digit, dot, dash or underscore with '_', strip leading dots (no hidden files like .htaccess), and cut to 64 characters. Raise ValueError if nothing is left.",
      "starter": "import re\n\n\ndef safe_filename(name):\n    pass",
      "hint": "base = re.split(r'[\\\\/]', name)[-1]; base = re.sub(r'[^A-Za-z0-9._-]', '_', base).lstrip('.')",
      "test": "assert safe_filename('../../etc/passwd') == 'passwd', 'Path traversal removed'\nassert safe_filename('C:\\\\Users\\\\me\\\\CV (final).pdf') == 'CV__final_.pdf', f\"Got {safe_filename('C:/x/CV (final).pdf')}\"\nassert safe_filename('.htaccess') == 'htaccess', 'No hidden files'\nassert safe_filename('a' * 100 + '.png') == 'a' * 64, 'Length limit'\nfor bad in ['', '../', '...']:\n    try:\n        safe_filename(bad)\n        raise AssertionError(f'{bad!r} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Nonce Reuse Detector",
      "desc": "With AES-GCM, reusing a nonce with the same key is catastrophic. Write `nonce_reuse(messages)` where messages is a list of (key_id, nonce_hex) pairs. Return a sorted list of the (key_id, nonce_hex) pairs that appear more than once. The same nonce under different keys is fine.",
      "starter": "def nonce_reuse(messages):\n    pass",
      "hint": "Count pairs with a dict or collections.Counter, then keep those with count > 1.",
      "test": "msgs = [('k1', 'aa01'), ('k1', 'aa02'), ('k2', 'aa01'), ('k1', 'aa01'), ('k2', 'bb09'), ('k2', 'bb09'), ('k2', 'bb09')]\nassert nonce_reuse(msgs) == [('k1', 'aa01'), ('k2', 'bb09')], f'Got {nonce_reuse(msgs)}'\nassert nonce_reuse([('k1', '01'), ('k2', '01')]) == [], 'Different keys'\nassert nonce_reuse([]) == [], 'No messages'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Key Strength Rating",
      "desc": "Write `key_strength(algorithm, bits)`. AES: 128 or 192 is 'OK', 256 is 'STRONG', other sizes raise ValueError. RSA: below 2048 'WEAK', 2048 'OK', 3072 or more 'STRONG'. ECC: below 256 'WEAK', 256 'OK', 384 or more 'STRONG'. DES and 3DES are always 'WEAK'. Algorithm names are case-insensitive; unknown algorithms raise ValueError.",
      "starter": "def key_strength(algorithm, bits):\n    pass",
      "hint": "algo = algorithm.upper(); handle each family with if/elif",
      "test": "assert key_strength('aes', 256) == 'STRONG' and key_strength('AES', 128) == 'OK', 'AES'\nassert [key_strength('RSA', b) for b in (1024, 2048, 4096)] == ['WEAK', 'OK', 'STRONG'], 'RSA'\nassert [key_strength('ECC', b) for b in (224, 256, 521)] == ['WEAK', 'OK', 'STRONG'], 'ECC'\nassert key_strength('3DES', 168) == 'WEAK', 'Retired cipher'\nfor bad in [('AES', 100), ('ROT13', 13)]:\n    try:\n        key_strength(*bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Salted, Stretched Password Hash",
      "desc": "Write `hash_password(password, salt_hex, rounds)`: h = sha256(bytes.fromhex(salt_hex) + password bytes).digest(), then repeat rounds - 1 more times h = sha256(h + password bytes).digest(). Return 'sha256r$<rounds>$<salt_hex>$<h as hex>'. Raise ValueError if rounds < 1000 (too fast to slow down attackers). Real systems use Argon2id or bcrypt; this shows the same ideas: a unique salt and deliberate slowness.",
      "starter": "import hashlib\n\n\ndef hash_password(password, salt_hex, rounds):\n    pass",
      "hint": "pw = password.encode(); h = hashlib.sha256(bytes.fromhex(salt_hex) + pw).digest(); for _ in range(rounds - 1): h = hashlib.sha256(h + pw).digest()",
      "test": "import hashlib\nstored = hash_password('correct horse', '00112233445566778899aabbccddeeff', 1000)\nparts = stored.split('$')\nassert parts[:3] == ['sha256r', '1000', '00112233445566778899aabbccddeeff'] and len(parts[3]) == 64, f'Got {stored}'\npw = b'correct horse'\nh = hashlib.sha256(bytes.fromhex('00112233445566778899aabbccddeeff') + pw).digest()\nfor _ in range(999):\n    h = hashlib.sha256(h + pw).digest()\nassert parts[3] == h.hex(), 'Follow the exact stretching recipe'\nother = hash_password('correct horse', 'ffeeddccbbaa99887766554433221100', 1000)\nassert other.split('$')[3] != parts[3], 'A different salt gives a different hash for the same password'\ntry:\n    hash_password('pw', '00', 10)\n    raise AssertionError('Too few rounds must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Verify a Stored Password",
      "desc": "Write `verify_password(password, stored)` for strings in the Practice 1 format 'sha256r$<rounds>$<salt_hex>$<hash_hex>'. Recompute the hash with the stored rounds and salt, and compare with hmac.compare_digest. Return False (never raise) for a wrong password or a malformed stored string.",
      "starter": "import hashlib\nimport hmac\n\n\ndef verify_password(password, stored):\n    pass",
      "hint": "try: scheme, rounds, salt, expected = stored.split('$') except ValueError: return False",
      "test": "import hashlib\ndef make(pw, salt, rounds):\n    h = hashlib.sha256(bytes.fromhex(salt) + pw.encode()).digest()\n    for _ in range(rounds - 1):\n        h = hashlib.sha256(h + pw.encode()).digest()\n    return f'sha256r${rounds}${salt}${h.hex()}'\nstored = make('S3cure!pass', 'a1b2c3d4', 1500)\nassert verify_password('S3cure!pass', stored) is True, 'Correct password'\nassert verify_password('s3cure!pass', stored) is False, 'Case matters'\nassert verify_password('S3cure!pass', 'garbage') is False, 'Malformed record'\nassert verify_password('S3cure!pass', 'md5$1$aa$bb') is False, 'Unknown scheme'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Certificate Validity Check",
      "desc": "Write `cert_problems(cert, today, hostname)` where cert has 'not_before' and 'not_after' (ISO dates 'YYYY-MM-DD', compared as strings is fine) and 'names' (subject alternative names). Return a list (in this order) of the problems found: 'NOT_YET_VALID' if today < not_before, 'EXPIRED' if today > not_after, 'HOSTNAME_MISMATCH' if no name matches. A name matches exactly (case-insensitive) or as a wildcard '*.example.com', which matches exactly one extra label (a.example.com yes; example.com and a.b.example.com no).",
      "starter": "def cert_problems(cert, today, hostname):\n    pass",
      "hint": "For '*.x', check host.split('.', 1)[1] == name[2:] and the first label is non-empty.",
      "test": "cert = {'not_before': '2026-01-01', 'not_after': '2026-12-31', 'names': ['example.com', '*.example.com']}\nassert cert_problems(cert, '2026-06-01', 'www.example.com') == [], 'Valid'\nassert cert_problems(cert, '2026-06-01', 'EXAMPLE.com') == [], 'Case-insensitive'\nassert cert_problems(cert, '2027-01-02', 'a.b.example.com') == ['EXPIRED', 'HOSTNAME_MISMATCH'], f\"Got {cert_problems(cert, '2027-01-02', 'a.b.example.com')}\"\nassert cert_problems(cert, '2025-12-31', 'shop.example.org') == ['NOT_YET_VALID', 'HOSTNAME_MISMATCH'], 'Future certificate, wrong domain'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Certificate Chain Check",
      "desc": "Write `chain_trusted(chain, trusted_roots)` where chain is a list of certificates from the server's leaf to the top, each {'subject': ..., 'issuer': ...}. Return True only if each certificate's issuer equals the next certificate's subject, and the last certificate's issuer is in trusted_roots. An empty chain is not trusted.",
      "starter": "def chain_trusted(chain, trusted_roots):\n    pass",
      "hint": "all(a['issuer'] == b['subject'] for a, b in zip(chain, chain[1:])) and chain[-1]['issuer'] in trusted_roots",
      "test": "roots = {'Root CA X1'}\ngood = [{'subject': 'shop.example.com', 'issuer': 'Intermediate R3'}, {'subject': 'Intermediate R3', 'issuer': 'Root CA X1'}]\nassert chain_trusted(good, roots) is True, 'Leaf, intermediate, trusted root'\nbroken = [{'subject': 'shop.example.com', 'issuer': 'Intermediate R3'}, {'subject': 'Intermediate E1', 'issuer': 'Root CA X1'}]\nassert chain_trusted(broken, roots) is False, 'Links do not connect'\nself_signed = [{'subject': 'shop.example.com', 'issuer': 'shop.example.com'}]\nassert chain_trusted(self_signed, roots) is False, 'Self-signed, not a trusted root'\nassert chain_trusted([], roots) is False, 'Empty chain'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Decode a JWT (Without Trusting It)",
      "desc": "A JWT is three base64url parts: header.payload.signature. Write `decode_jwt(token)` returning (header_dict, payload_dict). Add '=' padding so the length is a multiple of 4 before base64.urlsafe_b64decode, then json.loads each part. Raise ValueError if the token does not have exactly three parts. Decoding is NOT verifying: anyone can read or forge these fields.",
      "starter": "import base64\nimport json\n\n\ndef decode_jwt(token):\n    pass",
      "hint": "def part(s): return json.loads(base64.urlsafe_b64decode(s + '=' * (-len(s) % 4)))",
      "test": "import base64, json\ndef b64(obj):\n    return base64.urlsafe_b64encode(json.dumps(obj).encode()).rstrip(b'=').decode()\ntoken = b64({'alg': 'HS256', 'typ': 'JWT'}) + '.' + b64({'sub': 'u42', 'role': 'user'}) + '.sig'\nassert decode_jwt(token) == ({'alg': 'HS256', 'typ': 'JWT'}, {'sub': 'u42', 'role': 'user'}), f'Got {decode_jwt(token)}'\nfor bad in ['abc', 'a.b', 'a.b.c.d']:\n    try:\n        decode_jwt(bad)\n        raise AssertionError(f'{bad!r} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Verify an HS256 JWT",
      "desc": "Write `verify_jwt(token, secret, now)`. Split into three parts (ValueError otherwise). Decode the header; if its 'alg' is not exactly 'HS256', raise ValueError('bad alg') — this blocks the 'alg: none' attack. Compute the expected signature: base64url (no padding) of HMAC-SHA256(secret bytes, '<header>.<payload>' bytes), and compare with hmac.compare_digest (ValueError('bad signature') if different). Decode the payload; if it has 'exp' and now >= exp, raise ValueError('expired'). Return the payload.",
      "starter": "import base64\nimport hashlib\nimport hmac\nimport json\n\n\ndef verify_jwt(token, secret, now):\n    pass",
      "hint": "sig = base64.urlsafe_b64encode(hmac.new(secret.encode(), f'{h}.{p}'.encode(), hashlib.sha256).digest()).rstrip(b'=').decode()",
      "test": "import base64, hashlib, hmac, json\ndef b64(data):\n    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()\ndef make(header, payload, secret):\n    h, p = b64(json.dumps(header).encode()), b64(json.dumps(payload).encode())\n    s = b64(hmac.new(secret.encode(), f'{h}.{p}'.encode(), hashlib.sha256).digest())\n    return f'{h}.{p}.{s}'\ngood = make({'alg': 'HS256'}, {'sub': 'u42', 'exp': 2000}, 'k3y')\nassert verify_jwt(good, 'k3y', 1500) == {'sub': 'u42', 'exp': 2000}, 'Valid token'\nnone_alg = b64(json.dumps({'alg': 'none'}).encode()) + '.' + b64(json.dumps({'sub': 'admin'}).encode()) + '.'\ncases = [(good, 'wrong', 1500, 'bad signature'), (good, 'k3y', 2000, 'expired'), (none_alg, 'k3y', 1, 'bad alg')]\nfor token, secret, now, reason in cases:\n    try:\n        verify_jwt(token, secret, now)\n        raise AssertionError(f'Expected rejection: {reason}')\n    except ValueError as e:\n        assert str(e) == reason, f'Expected {reason!r}, got {e!r}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "TOTP Codes (RFC 6238)",
      "desc": "Write `totp(secret_b32, t, step=30, digits=6)`: key = base64.b32decode(secret_b32); counter = t // step as 8 big-endian bytes (struct.pack('>Q', ...)); h = HMAC-SHA1(key, counter); offset = h[-1] & 0x0F; code = (int.from_bytes(h[offset:offset + 4], 'big') & 0x7FFFFFFF) % 10**digits. Return it as a string padded with zeros to digits characters. The checks use the official RFC test vectors.",
      "starter": "import base64\nimport hashlib\nimport hmac\nimport struct\n\n\ndef totp(secret_b32, t, step=30, digits=6):\n    pass",
      "hint": "h = hmac.new(key, struct.pack('>Q', t // step), hashlib.sha1).digest()",
      "test": "secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'   # '12345678901234567890' in base32\nassert totp(secret, 59, digits=8) == '94287082', f'Got {totp(secret, 59, digits=8)}'\nassert totp(secret, 1111111109, digits=8) == '07081804', 'Leading zero kept'\nassert totp(secret, 1234567890, digits=8) == '89005924', 'RFC 6238 vector'\nassert totp(secret, 59) == '287082', 'Six-digit version'\nassert totp(secret, 30) == totp(secret, 59) and totp(secret, 60) != totp(secret, 59), 'Same code within a 30 second step'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Verify a TOTP Code with Clock Drift",
      "desc": "Phones and servers disagree by a few seconds. Write `verify_totp(secret_b32, code, t, window=1)` that accepts the code if it matches the TOTP for any time step from t - window*30 to t + window*30 (six digits, 30 second steps, same algorithm as Practice 1). Compare with hmac.compare_digest. Return True or False.",
      "starter": "import base64\nimport hashlib\nimport hmac\nimport struct\n\n\ndef verify_totp(secret_b32, code, t, window=1):\n    pass",
      "hint": "for k in range(-window, window + 1): check totp at t + k * 30",
      "test": "import base64, hashlib, hmac, struct\ndef ref(secret, t):\n    h = hmac.new(base64.b32decode(secret), struct.pack('>Q', t // 30), hashlib.sha1).digest()\n    o = h[-1] & 15\n    return str((int.from_bytes(h[o:o + 4], 'big') & 0x7FFFFFFF) % 10 ** 6).zfill(6)\ns = 'JBSWY3DPEHPK3PXP'\nnow = 1_700_000_000\nassert verify_totp(s, ref(s, now), now) is True, 'Current code'\nassert verify_totp(s, ref(s, now - 30), now) is True, 'Previous step allowed with window 1'\nassert verify_totp(s, ref(s, now - 90), now) is False, 'Too old'\nassert verify_totp(s, ref(s, now - 60), now, window=2) is True, 'Wider window'\nassert verify_totp(s, '000000', now) is (ref(s, now) == '000000'), 'Wrong code'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Role-Based Access Control with Inheritance",
      "desc": "Write `rbac_allowed(user_roles, permission, role_perms, parents)`. role_perms maps a role to its own permissions; parents maps a role to the roles it inherits from (e.g. 'admin' inherits 'editor', which inherits 'viewer'). A user is allowed if any of their roles, directly or through any chain of parents, has the permission. Guard against inheritance cycles.",
      "starter": "def rbac_allowed(user_roles, permission, role_perms, parents):\n    pass",
      "hint": "Walk roles with a stack and a seen set: pop a role, check its permissions, push its parents.",
      "test": "perms = {'viewer': {'read'}, 'editor': {'write'}, 'admin': {'delete', 'manage_users'}}\nparents = {'admin': ['editor'], 'editor': ['viewer']}\nassert rbac_allowed(['admin'], 'read', perms, parents) is True, 'Inherited through two levels'\nassert rbac_allowed(['editor'], 'delete', perms, parents) is False, 'Editors cannot delete'\nassert rbac_allowed(['viewer', 'editor'], 'write', perms, parents) is True, 'Any role counts'\ncyclic = {'a': ['b'], 'b': ['a']}\nassert rbac_allowed(['a'], 'fly', {'a': set(), 'b': set()}, cyclic) is False, 'Cycles must not loop forever'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Attribute-Based Access Control",
      "desc": "Write `abac_allowed(user, resource, action)` with attribute rules: 'read' is allowed if user['clearance'] >= resource['classification'] AND (same department OR resource['public'] is True); 'edit' is allowed only for the owner (user['id'] == resource['owner']) whose clearance is also high enough; any other action is denied.",
      "starter": "def abac_allowed(user, resource, action):\n    pass",
      "hint": "cleared = user['clearance'] >= resource['classification']",
      "test": "alice = {'id': 'u1', 'department': 'finance', 'clearance': 3}\nreport = {'owner': 'u1', 'department': 'finance', 'classification': 2, 'public': False}\nsecret = {'owner': 'u9', 'department': 'finance', 'classification': 4, 'public': False}\nmemo = {'owner': 'u7', 'department': 'hr', 'classification': 1, 'public': True}\nassert abac_allowed(alice, report, 'read') and abac_allowed(alice, report, 'edit'), 'Owner in the same department'\nassert not abac_allowed(alice, secret, 'read'), 'Clearance too low'\nassert abac_allowed(alice, memo, 'read') and not abac_allowed(alice, memo, 'edit'), 'Public memo: read yes, edit no'\nassert not abac_allowed(alice, report, 'delete'), 'Unknown actions are denied'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Object-Level Authorisation Check",
      "desc": "Broken object level authorisation (IDOR) happens when an API trusts the ID in the URL. Write `can_access(user, obj, action)`: admins (user['role'] == 'admin') can do anything; the owner (obj['owner_id'] == user['id']) can 'read', 'update' and 'delete'; users listed in obj['shared_with'] can only 'read'. Everyone else is denied.",
      "starter": "def can_access(user, obj, action):\n    pass",
      "hint": "Check admin first, then owner, then shared read access; default False.",
      "test": "invoice = {'id': 501, 'owner_id': 'u1', 'shared_with': ['u2']}\nassert can_access({'id': 'u1', 'role': 'user'}, invoice, 'delete'), 'Owner'\nassert can_access({'id': 'u2', 'role': 'user'}, invoice, 'read'), 'Shared read'\nassert not can_access({'id': 'u2', 'role': 'user'}, invoice, 'update'), 'Shared users cannot update'\nassert not can_access({'id': 'u3', 'role': 'user'}, invoice, 'read'), 'Guessing the ID is not enough'\nassert can_access({'id': 'x', 'role': 'admin'}, invoice, 'update'), 'Admin'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Find Routes at Risk of IDOR",
      "desc": "Write `idor_risks(routes)` where each route is {'method', 'path', 'checks_owner'}. A route is at risk if its path contains a path parameter like '{id}' or '{invoice_id}' (regex r'\\{[a-z_]*id\\}') and checks_owner is False. Return a sorted list of 'METHOD path' strings.",
      "starter": "import re\n\n\ndef idor_risks(routes):\n    pass",
      "hint": "sorted(f\"{r['method']} {r['path']}\" for r in routes if re.search(..., r['path']) and not r['checks_owner'])",
      "test": "routes = [\n    {'method': 'GET', 'path': '/invoices/{invoice_id}', 'checks_owner': False},\n    {'method': 'DELETE', 'path': '/users/{id}', 'checks_owner': True},\n    {'method': 'GET', 'path': '/health', 'checks_owner': False},\n    {'method': 'PUT', 'path': '/orders/{order_id}/address', 'checks_owner': False},\n]\nassert idor_risks(routes) == ['GET /invoices/{invoice_id}', 'PUT /orders/{order_id}/address'], f'Got {idor_risks(routes)}'\nassert idor_risks([]) == [], 'No routes'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "SYN Flood Suspects",
      "desc": "In a SYN flood, a source sends many connection requests (SYN) but never completes the handshake (ACK). Write `syn_flood_suspects(events, threshold)` where events are (source_ip, flag) pairs with flag 'SYN' or 'ACK'. For each IP, half_open = number of SYNs minus number of ACKs. Return a sorted list of IPs whose half_open is greater than threshold.",
      "starter": "def syn_flood_suspects(events, threshold):\n    pass",
      "hint": "half = {}; half[ip] = half.get(ip, 0) + (1 if flag == 'SYN' else -1)",
      "test": "events = [('10.0.0.5', 'SYN'), ('10.0.0.5', 'ACK')] + [('203.0.113.9', 'SYN')] * 50 + [('198.51.100.2', 'SYN')] * 6 + [('198.51.100.2', 'ACK')] * 2\nassert syn_flood_suspects(events, 3) == ['198.51.100.2', '203.0.113.9'], f'Got {syn_flood_suspects(events, 3)}'\nassert syn_flood_suspects(events, 10) == ['203.0.113.9'], 'Higher threshold'\nassert syn_flood_suspects([], 0) == [], 'No traffic'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Stateless Firewall Rules",
      "desc": "Write `firewall(rules, src_ip, dst_port)`. Each rule is {'action': 'allow' or 'deny', 'src': a network like '10.0.0.0/8' or 'any', 'port': an int or 'any'}. Rules are checked in order and the first match decides. If nothing matches, deny (default deny). Use the ipaddress module: ip_address(src_ip) in ip_network(rule['src']).",
      "starter": "import ipaddress\n\n\ndef firewall(rules, src_ip, dst_port):\n    pass",
      "hint": "ip = ipaddress.ip_address(src_ip); src_ok = rule['src'] == 'any' or ip in ipaddress.ip_network(rule['src'])",
      "test": "rules = [\n    {'action': 'deny', 'src': '203.0.113.0/24', 'port': 'any'},\n    {'action': 'allow', 'src': '10.0.0.0/8', 'port': 22},\n    {'action': 'allow', 'src': 'any', 'port': 443},\n]\nassert firewall(rules, '10.1.2.3', 22) == 'allow', 'Internal SSH'\nassert firewall(rules, '8.8.8.8', 22) == 'deny', 'External SSH falls to default deny'\nassert firewall(rules, '8.8.8.8', 443) == 'allow', 'Public HTTPS'\nassert firewall(rules, '203.0.113.50', 443) == 'deny', 'Blocklist comes first'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Security Header Audit",
      "desc": "Write `header_audit(headers)` for a dict of response headers (names are case-insensitive). Return the sorted list of problems: 'HSTS' if Strict-Transport-Security is missing or its max-age is below 31536000; 'NOSNIFF' unless X-Content-Type-Options is 'nosniff'; 'FRAMING' unless X-Frame-Options is DENY or SAMEORIGIN or the Content-Security-Policy contains 'frame-ancestors'; 'CSP' if Content-Security-Policy is missing.",
      "starter": "import re\n\n\ndef header_audit(headers):\n    pass",
      "hint": "h = {k.lower(): v for k, v in headers.items()}; m = re.search(r'max-age=(\\d+)', h.get('strict-transport-security', ''))",
      "test": "good = {'Strict-Transport-Security': 'max-age=63072000; includeSubDomains', 'X-Content-Type-Options': 'nosniff',\n        'Content-Security-Policy': \"default-src 'self'; frame-ancestors 'none'\"}\nassert header_audit(good) == [], f'Got {header_audit(good)}'\nweak = {'strict-transport-security': 'max-age=300', 'x-frame-options': 'SAMEORIGIN'}\nassert header_audit(weak) == ['CSP', 'HSTS', 'NOSNIFF'], f'Got {header_audit(weak)}'\nassert header_audit({}) == ['CSP', 'FRAMING', 'HSTS', 'NOSNIFF'], 'Nothing set'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Parse an HSTS Header",
      "desc": "Write `parse_hsts(value)` for a Strict-Transport-Security value such as 'max-age=31536000; includeSubDomains; preload'. Directives are separated by ';' and are case-insensitive. Return {'max_age': int, 'include_subdomains': bool, 'preload': bool}. Raise ValueError if max-age is missing or not a whole number.",
      "starter": "def parse_hsts(value):\n    pass",
      "hint": "for part in value.split(';'): part = part.strip().lower(); if part.startswith('max-age='): ...",
      "test": "assert parse_hsts('max-age=31536000; includeSubDomains; preload') == {'max_age': 31536000, 'include_subdomains': True, 'preload': True}, 'Full header'\nassert parse_hsts('MAX-AGE=600') == {'max_age': 600, 'include_subdomains': False, 'preload': False}, 'Case-insensitive'\nfor bad in ['includeSubDomains', 'max-age=abc', '']:\n    try:\n        parse_hsts(bad)\n        raise AssertionError(f'{bad!r} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Login with Password and TOTP",
      "desc": "Milestone: write `login(user, password, code, t)` where user has 'hash' (the Day 7 format), 'totp_secret' (base32) and 'failed' (failed attempts so far). Return 'LOCKED' if failed >= 5 (checked first), 'BAD_PASSWORD' if the password does not verify, 'BAD_CODE' if the six-digit TOTP code does not match within one 30 second step either side, otherwise 'OK'. Use hmac.compare_digest for both comparisons.",
      "starter": "import base64\nimport hashlib\nimport hmac\nimport struct\n\n\ndef login(user, password, code, t):\n    pass",
      "hint": "Reuse your verify_password and verify_totp logic from Days 7 and 10 as helper functions.",
      "test": "import base64, hashlib, hmac, struct\ndef make_hash(pw, salt, rounds):\n    h = hashlib.sha256(bytes.fromhex(salt) + pw.encode()).digest()\n    for _ in range(rounds - 1):\n        h = hashlib.sha256(h + pw.encode()).digest()\n    return f'sha256r${rounds}${salt}${h.hex()}'\ndef code_at(secret, t):\n    h = hmac.new(base64.b32decode(secret), struct.pack('>Q', t // 30), hashlib.sha1).digest()\n    o = h[-1] & 15\n    return str((int.from_bytes(h[o:o + 4], 'big') & 0x7FFFFFFF) % 10 ** 6).zfill(6)\nuser = {'hash': make_hash('Tr1cky#pw', 'c0ffee', 1000), 'totp_secret': 'JBSWY3DPEHPK3PXP', 'failed': 0}\nnow = 1_700_000_000\nassert login(user, 'Tr1cky#pw', code_at(user['totp_secret'], now), now) == 'OK', 'Both factors correct'\nassert login(user, 'wrong', code_at(user['totp_secret'], now), now) == 'BAD_PASSWORD', 'Wrong password'\nassert login(user, 'Tr1cky#pw', code_at(user['totp_secret'], now - 300), now) == 'BAD_CODE', 'Old code'\nassert login(dict(user, failed=5), 'Tr1cky#pw', code_at(user['totp_secret'], now), now) == 'LOCKED', 'Locked even with correct details'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Progressive Lockout",
      "desc": "Write `lockout_seconds(failed)` for the number of consecutive failed logins: fewer than 3 failures → 0; otherwise 30 × 2**(failed - 3), capped at 3600 seconds. Raise ValueError for a negative count.",
      "starter": "def lockout_seconds(failed):\n    pass",
      "hint": "return 0 if failed < 3 else min(3600, 30 * 2 ** (failed - 3))",
      "test": "assert [lockout_seconds(n) for n in range(0, 9)] == [0, 0, 0, 30, 60, 120, 240, 480, 960], f'Got {[lockout_seconds(n) for n in range(9)]}'\nassert lockout_seconds(12) == 3600 and lockout_seconds(40) == 3600, 'Capped at one hour'\ntry:\n    lockout_seconds(-1)\n    raise AssertionError('Negative counts must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "SSRF-Safe URL Check",
      "desc": "Server-side request forgery tricks a server into fetching internal addresses. Write `ssrf_check(url)` returning (ok, reason). Parse with re.fullmatch(r'(https?)://([^/:?#]+)(?::(\\d+))?([/?#].*)?', url, re.IGNORECASE); if it does not match return (False, 'BAD_URL'). Lower-case the host. If it is 'localhost' or ends with '.internal' return (False, 'INTERNAL_HOST'). If the host is an IP address (ipaddress.ip_address succeeds) that is private, loopback, link-local (this covers the cloud metadata address 169.254.169.254), reserved or unspecified, return (False, 'PRIVATE_IP'). Otherwise return (True, 'OK').",
      "starter": "import ipaddress\nimport re\n\n\ndef ssrf_check(url):\n    pass",
      "hint": "try: ip = ipaddress.ip_address(host) except ValueError: ip = None",
      "test": "assert ssrf_check('https://api.example.com/v1/data') == (True, 'OK'), 'Public host'\nassert ssrf_check('http://169.254.169.254/latest/meta-data/') == (False, 'PRIVATE_IP'), 'Cloud metadata endpoint'\nassert ssrf_check('http://10.0.0.7:8080/admin') == (False, 'PRIVATE_IP'), 'Private network'\nassert ssrf_check('http://127.0.0.1') == (False, 'PRIVATE_IP'), 'Loopback'\nassert ssrf_check('HTTP://LocalHost/') == (False, 'INTERNAL_HOST'), 'localhost, any case'\nassert ssrf_check('http://metadata.google.internal/') == (False, 'INTERNAL_HOST'), 'Internal DNS name'\nassert ssrf_check('file:///etc/passwd') == (False, 'BAD_URL'), 'Only http and https'\nassert ssrf_check('https://8.8.8.8/') == (True, 'OK'), 'Public IP'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Outbound Host Allow-List",
      "desc": "Blocking bad hosts is fragile; allowing only known good ones is stronger. Write `allowed_url(url, allowed_hosts)`: extract the scheme and host with re.fullmatch(r'(https?)://([^/:?#@]+)(?::\\d+)?([/?#].*)?', url, re.IGNORECASE). Return True only if the URL matches, the scheme is https, and the lower-cased host is exactly in allowed_hosts. URLs containing '@' (userinfo tricks like https://good.com@evil.com) are rejected by the pattern.",
      "starter": "import re\n\n\ndef allowed_url(url, allowed_hosts):\n    pass",
      "hint": "m = re.fullmatch(...); return bool(m) and m.group(1).lower() == 'https' and m.group(2).lower() in allowed_hosts",
      "test": "allow = {'api.partner.com', 'hooks.example.com'}\nassert allowed_url('https://api.partner.com/v2/orders', allow) is True, 'Allowed host'\nassert allowed_url('https://API.PARTNER.COM', allow) is True, 'Host case does not matter'\nassert allowed_url('http://api.partner.com/', allow) is False, 'https only'\nassert allowed_url('https://api.partner.com.evil.io/', allow) is False, 'Look-alike host'\nassert allowed_url('https://api.partner.com@evil.io/', allow) is False, 'Userinfo trick'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Safe Deserialisation with a Type Allow-List",
      "desc": "Never deserialise untrusted data into arbitrary objects. Write `safe_load(text, allowed_types)`: parse with json.loads (JSON cannot run code). Then walk the result: every dict that has a '__type__' key must name a type in allowed_types, otherwise raise ValueError. Check nested dicts and lists too. Invalid JSON also raises ValueError. Return the parsed data.",
      "starter": "import json\n\n\ndef safe_load(text, allowed_types):\n    pass",
      "hint": "Write a recursive helper check(node) that inspects dicts (and their values) and lists.",
      "test": "data = safe_load('{\"__type__\": \"Order\", \"items\": [{\"__type__\": \"Item\", \"sku\": \"A1\"}]}', {'Order', 'Item'})\nassert data['items'][0]['sku'] == 'A1', 'Allowed types load'\nfor text in ['{\"__type__\": \"Order\", \"items\": [{\"__type__\": \"ShellCommand\", \"cmd\": \"rm\"}]}', '{\"__type__\": \"Gadget\"}', 'not json']:\n    try:\n        safe_load(text, {'Order', 'Item'})\n        raise AssertionError(f'{text!r} must raise ValueError')\n    except ValueError:\n        pass\nassert safe_load('[1, 2, {\"a\": 3}]', set()) == [1, 2, {'a': 3}], 'Plain data needs no types'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Find Dangerous Deserialisation Calls",
      "desc": "Write `dangerous_calls(source)` using the ast module. Report, as a sorted list with no duplicates, each call to pickle.loads, pickle.load, marshal.loads or yaml.load, written as 'pickle.loads' and so on. yaml.load is fine when it passes Loader=yaml.SafeLoader (a keyword argument whose value's attribute name is 'SafeLoader'). Raise ValueError if the source does not parse.",
      "starter": "import ast\n\n\ndef dangerous_calls(source):\n    pass",
      "hint": "For ast.Call nodes whose func is ast.Attribute with value ast.Name: name = f'{func.value.id}.{func.attr}'",
      "test": "code = \"\"\"\nimport pickle, yaml, json\na = pickle.loads(blob)\nb = yaml.load(text)\nc = yaml.load(text, Loader=yaml.SafeLoader)\nd = json.loads(text)\ne = pickle.loads(other)\n\"\"\"\nassert dangerous_calls(code) == ['pickle.loads', 'yaml.load'], f'Got {dangerous_calls(code)}'\nassert dangerous_calls('import json\\nx = json.loads(s)') == [], 'JSON is safe'\ntry:\n    dangerous_calls('def broken(:')\n    raise AssertionError('Unparseable source must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Shannon Entropy",
      "desc": "Random-looking strings (like API keys) have high entropy. Write `entropy(s)` returning the Shannon entropy in bits per character, rounded to 3 decimals: the sum over each distinct character of -p × log2(p), where p is its share of the string. Return 0.0 for an empty string.",
      "starter": "import math\n\n\ndef entropy(s):\n    pass",
      "hint": "counts = collections.Counter(s); -sum(c / n * math.log2(c / n) for c in counts.values())",
      "test": "assert entropy('aaaa') == 0.0, 'One symbol: no uncertainty'\nassert entropy('abab') == 1.0, 'Two equally likely symbols'\nassert entropy('abcdefgh') == 3.0, 'Eight equally likely symbols'\nassert entropy('password') == 2.75, f\"Got {entropy('password')}\"\nassert entropy('') == 0.0, 'Empty'\nassert entropy('Xq7!vR2#pL9@zK4$') > 3.9, 'Random-looking secret'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Hard-Coded Secret Scanner",
      "desc": "Write `find_secrets(text)` that scans source lines (numbered from 1). Report (line_no, 'AWS_KEY') for any match of r'AKIA[0-9A-Z]{16}'. Also report (line_no, 'HIGH_ENTROPY') for assignments matching r'(?i)(key|secret|token|password)\\w*\\s*[:=]\\s*[\"\\']([^\"\\']{16,})[\"\\']' whose quoted value has Shannon entropy of at least 3.5 bits per character. Return the list in line order (AWS_KEY before HIGH_ENTROPY on the same line).",
      "starter": "import math\nimport re\nfrom collections import Counter\n\n\ndef find_secrets(text):\n    pass",
      "hint": "for i, line in enumerate(text.splitlines(), 1): ... ; compute entropy like Practice 1",
      "test": "src = \"\"\"db_host = \"localhost\"\naws = \"AKIAABCDEFGHIJKLMNOP\"\nAPI_KEY = \"Zx8#qP2!mW7vL4@tR9sY\"\npassword = \"aaaaaaaaaaaaaaaaaaaa\"\nsecret_token: 'n3K$8pQz!Lw2@Vx7rT5m'\n\"\"\"\nassert find_secrets(src) == [(2, 'AWS_KEY'), (3, 'HIGH_ENTROPY'), (5, 'HIGH_ENTROPY')], f'Got {find_secrets(src)}'\nassert find_secrets('x = 1\\nname = \"Priya\"') == [], 'Nothing secret'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Vulnerable Dependency Check",
      "desc": "Write `vulnerable(sbom, advisories)`. sbom is a list of {'name', 'version'}; advisories is a list of {'name', 'fixed_in', 'id'}. A component is vulnerable to an advisory with the same name if its version is lower than fixed_in, comparing versions numerically part by part ('1.10.0' > '1.9.2'; parse with tuple(int(x) for x in v.split('.'))). Return a sorted list of (name, version, advisory id).",
      "starter": "def vulnerable(sbom, advisories):\n    pass",
      "hint": "def ver(v): return tuple(int(x) for x in v.split('.')); compare ver(component) < ver(fixed_in)",
      "test": "sbom = [{'name': 'httpkit', 'version': '2.9.0'}, {'name': 'lodashpy', 'version': '4.17.21'},\n        {'name': 'yamlkit', 'version': '1.10.0'}, {'name': 'imgtools', 'version': '3.1'}]\nadvisories = [{'name': 'httpkit', 'fixed_in': '2.31.0', 'id': 'CVE-2023-0001'},\n              {'name': 'lodashpy', 'fixed_in': '4.17.21', 'id': 'CVE-2021-0002'},\n              {'name': 'yamlkit', 'fixed_in': '1.9.2', 'id': 'CVE-2020-0003'},\n              {'name': 'imgtools', 'fixed_in': '3.1.1', 'id': 'CVE-2024-0004'}]\nassert vulnerable(sbom, advisories) == [('httpkit', '2.9.0', 'CVE-2023-0001'), ('imgtools', '3.1', 'CVE-2024-0004')], f'Got {vulnerable(sbom, advisories)}'\nassert vulnerable([], advisories) == [], 'Empty SBOM'\nprint('All checks passed.')"
    },
    "a": {
      "title": "SBOM Licence Summary",
      "desc": "Write `licence_summary(components, denied)` where components have 'name' and 'license'. Return {'total': number of components, 'by_license': a dict of licence → count with keys in sorted order, 'denied': sorted names of components whose licence is in the denied set}.",
      "starter": "def licence_summary(components, denied):\n    pass",
      "hint": "counts = {}; for c in components: counts[c['license']] = counts.get(c['license'], 0) + 1; dict(sorted(counts.items()))",
      "test": "comps = [{'name': 'a', 'license': 'MIT'}, {'name': 'b', 'license': 'GPL-3.0'}, {'name': 'c', 'license': 'Apache-2.0'},\n         {'name': 'd', 'license': 'MIT'}, {'name': 'e', 'license': 'AGPL-3.0'}]\nr = licence_summary(comps, {'GPL-3.0', 'AGPL-3.0'})\nassert r == {'total': 5, 'by_license': {'AGPL-3.0': 1, 'Apache-2.0': 1, 'GPL-3.0': 1, 'MIT': 2}, 'denied': ['b', 'e']}, f'Got {r}'\nassert list(r['by_license']) == ['AGPL-3.0', 'Apache-2.0', 'GPL-3.0', 'MIT'], 'Sorted keys'\nassert licence_summary([], set()) == {'total': 0, 'by_license': {}, 'denied': []}, 'Empty'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Token Bucket Rate Limiter",
      "desc": "Write a class `TokenBucket(capacity, rate)`: it starts full (capacity tokens) and refills at rate tokens per second, never above capacity. allow(now) refills based on the time since the last call (the first call refills nothing), then, if at least 1 token is available, removes one and returns True; otherwise returns False. Times are in seconds and never go backwards.",
      "starter": "class TokenBucket:\n    def __init__(self, capacity, rate):\n        pass\n\n    def allow(self, now):\n        pass",
      "hint": "Store tokens and last; tokens = min(capacity, tokens + (now - last) * rate)",
      "test": "b = TokenBucket(3, 1.0)\nassert [b.allow(0) for _ in range(4)] == [True, True, True, False], 'Burst of 3, then empty'\nassert b.allow(0.5) is False, 'Half a token is not enough'\nassert b.allow(1.0) is True, 'One token refilled after a second'\nassert [b.allow(100) for _ in range(4)] == [True, True, True, False], 'Refill never exceeds capacity'\nslow = TokenBucket(1, 0.5)\nassert [slow.allow(t) for t in (0, 1, 2, 3, 4)] == [True, False, True, False, True], 'One request every 2 seconds'\nprint('All checks passed.')"
    },
    "a": {
      "title": "OAuth PKCE Code Challenge",
      "desc": "PKCE protects mobile and single-page app logins. Write `pkce_challenge(verifier)`: the verifier must be 43-128 characters from A-Z a-z 0-9 - . _ ~ (else ValueError). Return base64url(sha256(verifier)) without '=' padding. The check uses the example from RFC 7636.",
      "starter": "import base64\nimport hashlib\nimport re\n\n\ndef pkce_challenge(verifier):\n    pass",
      "hint": "base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b'=').decode()",
      "test": "v = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'\nassert pkce_challenge(v) == 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM', f'Got {pkce_challenge(v)}'\nassert len(pkce_challenge('a' * 128)) == 43, 'SHA-256 gives 43 base64url characters'\nfor bad in ['short', 'a' * 129, 'x' * 42 + '!']:\n    try:\n        pkce_challenge(bad)\n        raise AssertionError(f'{bad!r} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "API Gateway: Rate Limits and SSRF",
      "desc": "Milestone: write `gateway(calls, capacity, rate)` where calls is a list of (time, client_id, callback_url). Each client has its own token bucket (Day 20 rules: starts full, refills at rate per second, capped). For each call, in order: if the callback URL fails an SSRF check (http or https only; host not localhost, not ending in .internal, and not a private, loopback, link-local, reserved or unspecified IP) the decision is 'BLOCKED_SSRF' and no token is used; otherwise 'ALLOW' if the client's bucket gives a token, else 'RATE_LIMITED'. Return the list of decisions.",
      "starter": "import ipaddress\nimport re\n\n\ndef gateway(calls, capacity, rate):\n    pass",
      "hint": "Keep a dict client -> [tokens, last_time]; reuse your ssrf_check logic from Day 16.",
      "test": "reqs = [(0, 'a', 'https://hooks.example.com/x'), (0, 'a', 'https://hooks.example.com/x'), (0, 'a', 'https://hooks.example.com/x'),\n        (0, 'b', 'http://169.254.169.254/'), (0, 'b', 'https://ok.example.com'), (2, 'a', 'https://hooks.example.com/x')]\nassert gateway(reqs, 2, 1.0) == ['ALLOW', 'ALLOW', 'RATE_LIMITED', 'BLOCKED_SSRF', 'ALLOW', 'ALLOW'], f'Got {gateway(reqs, 2, 1.0)}'\nassert gateway([(0, 'c', 'ftp://files.example.com')], 5, 1) == ['BLOCKED_SSRF'], 'Bad scheme'\nassert gateway([], 1, 1) == [], 'No traffic'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Gateway Decision Summary",
      "desc": "Write `decision_summary(decisions)` returning a dict with the count of each decision, keys in sorted order, plus 'blocked_pct': the share of decisions that are not 'ALLOW', as a percentage rounded to 1 decimal (0.0 for an empty list).",
      "starter": "def decision_summary(decisions):\n    pass",
      "hint": "counts = dict(sorted(Counter(decisions).items())); counts['blocked_pct'] = ...",
      "test": "r = decision_summary(['ALLOW', 'ALLOW', 'RATE_LIMITED', 'BLOCKED_SSRF', 'ALLOW', 'ALLOW'])\nassert r == {'ALLOW': 4, 'BLOCKED_SSRF': 1, 'RATE_LIMITED': 1, 'blocked_pct': 33.3}, f'Got {r}'\nassert decision_summary([]) == {'blocked_pct': 0.0}, 'Empty'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Stack Canary Simulation",
      "desc": "A stack canary is a secret value placed after a buffer; if it changes, the program detects an overflow and stops. Write `copy_into_frame(buf_size, data, canary)` that simulates an unchecked copy: frame = bytearray(buf_size) + canary; write data starting at index 0, but never past the end of frame (extra bytes are dropped). Return 'OK' if the canary bytes are unchanged, else 'STACK_SMASHING_DETECTED'.",
      "starter": "def copy_into_frame(buf_size, data, canary):\n    pass",
      "hint": "frame = bytearray(buf_size) + bytearray(canary); n = min(len(data), len(frame)); frame[:n] = data[:n]",
      "test": "canary = b'\\x8f\\x1a\\xc3\\x00'\nassert copy_into_frame(8, b'hello', canary) == 'OK', 'Fits in the buffer'\nassert copy_into_frame(8, b'A' * 8, canary) == 'OK', 'Exactly fills the buffer'\nassert copy_into_frame(8, b'A' * 12, canary) == 'STACK_SMASHING_DETECTED', 'Overwrites the canary'\nassert copy_into_frame(8, b'A' * 8 + canary + b'XX', canary) == 'OK', 'Rewriting the same canary value is undetected, which is why canaries are secret and random'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Bounded String Copy",
      "desc": "Safe code never writes past a buffer. Write `bounded_copy(buf_size, data)` modelled on C's strlcpy: copy at most buf_size - 1 bytes and add a zero terminator. Return (result_bytes, truncated) where result_bytes has length min(len(data), buf_size - 1) + 1 and truncated is True if bytes were dropped. Raise ValueError if buf_size < 1.",
      "starter": "def bounded_copy(buf_size, data):\n    pass",
      "hint": "kept = data[:buf_size - 1]; return kept + b'\\x00', len(data) > len(kept)",
      "test": "assert bounded_copy(8, b'hi') == (b'hi\\x00', False), 'Short string'\nassert bounded_copy(8, b'overflowing') == (b'overflo\\x00', True), 'Truncated to fit with terminator'\nassert bounded_copy(1, b'abc') == (b'\\x00', True), 'Only room for the terminator'\ntry:\n    bounded_copy(0, b'x')\n    raise AssertionError('A zero-size buffer must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Memory Lifetime Auditor",
      "desc": "Write `lifetime_audit(events)` for a list of (op, ptr) events where op is 'alloc', 'free' or 'use'. Report problems as (index, kind): 'USE_AFTER_FREE' for a use of a freed pointer, 'DOUBLE_FREE' for freeing an already freed pointer, 'INVALID' for a use or free of a pointer never allocated. A new alloc of the same ptr makes it live again. After all events, add ('END', 'LEAK:<ptr>') for each pointer still live, sorted by ptr. Return the list.",
      "starter": "def lifetime_audit(events):\n    pass",
      "hint": "Track state[ptr] in {'live', 'freed'}; check the state before applying each event.",
      "test": "events = [('alloc', 'p1'), ('alloc', 'p2'), ('use', 'p1'), ('free', 'p1'), ('use', 'p1'), ('free', 'p1'),\n          ('use', 'p9'), ('alloc', 'p3'), ('free', 'p3'), ('alloc', 'p3')]\nexpected = [(4, 'USE_AFTER_FREE'), (5, 'DOUBLE_FREE'), (6, 'INVALID'), ('END', 'LEAK:p2'), ('END', 'LEAK:p3')]\nassert lifetime_audit(events) == expected, f'Got {lifetime_audit(events)}'\nassert lifetime_audit([('alloc', 'a'), ('use', 'a'), ('free', 'a')]) == [], 'Clean lifetime'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Safe Handle Table",
      "desc": "Memory-safe languages avoid dangling pointers. Write a class `HandleTable` that stores objects behind handles with generation numbers: put(obj) returns a handle (index, generation); get(handle) returns the object, or raises ValueError('stale handle') if that slot was removed or reused since; remove(handle) frees the slot (ValueError if stale). Freed slots are reused, with their generation increased by 1.",
      "starter": "class HandleTable:\n    def __init__(self):\n        pass\n\n    def put(self, obj):\n        pass\n\n    def get(self, handle):\n        pass\n\n    def remove(self, handle):\n        pass",
      "hint": "Keep lists objs, gens, alive and a free list of indexes.",
      "test": "t = HandleTable()\nh1 = t.put('invoice-1')\nh2 = t.put('invoice-2')\nassert t.get(h1) == 'invoice-1' and t.get(h2) == 'invoice-2', 'Stored objects'\nt.remove(h1)\nh3 = t.put('invoice-3')\nassert h3[0] == h1[0] and h3[1] == h1[1] + 1, f'Slot reused with a new generation: {h1} -> {h3}'\nfor bad in [lambda: t.get(h1), lambda: t.remove(h1)]:\n    try:\n        bad()\n        raise AssertionError('The old handle is stale and must raise ValueError')\n    except ValueError:\n        pass\nassert t.get(h3) == 'invoice-3', 'The new handle works'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Brute-Force Login Detector",
      "desc": "Write `brute_force_ips(lines, threshold, window)` for log lines like '2026-05-01T10:00:05 FAILED_LOGIN user=asha ip=203.0.113.9'. Ignore lines without FAILED_LOGIN. Parse the timestamp with datetime.fromisoformat and the ip with re.search(r'ip=(\\S+)'). Report an IP if it has at least threshold failures within any window of window seconds (inclusive). Return a sorted list of IPs.",
      "starter": "import re\nfrom datetime import datetime\n\n\ndef brute_force_ips(lines, threshold, window):\n    pass",
      "hint": "Collect times per IP, sort them, and slide: for i, check times[i + threshold - 1] - times[i] <= window.",
      "test": "lines = [f'2026-05-01T10:00:{s:02d} FAILED_LOGIN user=admin ip=203.0.113.9' for s in range(0, 50, 10)]\nlines += ['2026-05-01T10:00:00 FAILED_LOGIN user=ravi ip=10.0.0.4', '2026-05-01T10:30:00 FAILED_LOGIN user=ravi ip=10.0.0.4',\n          '2026-05-01T10:00:01 LOGIN_OK user=meena ip=10.0.0.5', '2026-05-01T11:00:00 FAILED_LOGIN user=x ip=10.0.0.4']\nassert brute_force_ips(lines, 5, 60) == ['203.0.113.9'], f'Got {brute_force_ips(lines, 5, 60)}'\nassert brute_force_ips(lines, 3, 3600) == ['10.0.0.4', '203.0.113.9'], 'Three failures within an hour'\nassert brute_force_ips(lines, 5, 30) == [], 'Too spread out for a 30 second window'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Indicator of Compromise Matcher",
      "desc": "Write `ioc_hits(lines, iocs)` where iocs is a set of known-bad indicators (IP addresses, domains or file hashes, stored lower-case). For each log line (numbered from 1), find every token made of letters, digits, dots, dashes and colons (re.findall(r'[A-Za-z0-9.:-]+', line)); report (line_no, token lower-cased) for each token that is in iocs, once per line, in order of first appearance.",
      "starter": "import re\n\n\ndef ioc_hits(lines, iocs):\n    pass",
      "hint": "seen_in_line = set(); for tok in re.findall(...): t = tok.lower(); if t in iocs and t not in seen_in_line: ...",
      "test": "iocs = {'198.51.100.77', 'evil-cdn.example', 'e3b0c44298fc1c149afbf4c8996fb924'}\nlines = ['GET / from 10.0.0.2', 'DNS query EVIL-CDN.example from 10.0.0.9',\n         'conn 198.51.100.77:443 then 198.51.100.77:80', 'file hash e3b0c44298fc1c149afbf4c8996fb924 quarantined']\nassert ioc_hits(lines, iocs) == [(2, 'evil-cdn.example'), (4, 'e3b0c44298fc1c149afbf4c8996fb924')], f'Got {ioc_hits(lines, iocs)}'\nassert ioc_hits(['conn to 198.51.100.77 and 198.51.100.77'], iocs) == [(1, '198.51.100.77')], 'Once per line'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Parse an IDS Rule",
      "desc": "Write `parse_rule(rule)` for Snort-style rules like 'alert tcp any any -> 10.0.0.5 22 (msg:\"SSH root\"; content:\"root\"; sid:1001;)'. Return {'action', 'proto', 'src', 'src_port', 'dst', 'dst_port', 'msg', 'content', 'sid'} where sid is an int and content is None if absent. Use re.fullmatch(r'(\\w+) (\\w+) (\\S+) (\\S+) -> (\\S+) (\\S+) \\((.*)\\)', rule.strip()); options are 'key:value;' pairs whose values may be quoted. Raise ValueError if the rule does not match or has no sid.",
      "starter": "import re\n\n\ndef parse_rule(rule):\n    pass",
      "hint": "opts = dict(re.findall(r'(\\w+):\\s*\"?([^\";]*)\"?;', m.group(7)))",
      "test": "r = parse_rule('alert tcp any any -> 10.0.0.5 22 (msg:\"SSH root\"; content:\"root\"; sid:1001;)')\nassert r == {'action': 'alert', 'proto': 'tcp', 'src': 'any', 'src_port': 'any', 'dst': '10.0.0.5', 'dst_port': '22',\n             'msg': 'SSH root', 'content': 'root', 'sid': 1001}, f'Got {r}'\nr2 = parse_rule('drop udp 203.0.113.0/24 any -> any 53 (msg:\"Bad DNS\"; sid:2002;)')\nassert r2['content'] is None and r2['action'] == 'drop' and r2['sid'] == 2002, f'Got {r2}'\nfor bad in ['alert tcp any any 10.0.0.5 22', 'alert tcp any any -> any 80 (msg:\"no sid\";)']:\n    try:\n        parse_rule(bad)\n        raise AssertionError(f'{bad!r} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Match Packets Against a Rule",
      "desc": "Write `rule_matches(rule, packet)` for a parsed rule (Practice 1 format, or any dict with those keys) and a packet {'proto', 'src', 'dst', 'dst_port', 'payload'}. Each of proto, dst and dst_port must match exactly unless the rule says 'any' (compare ports as strings). src may also be a network such as '203.0.113.0/24' (use ipaddress). If content is not None, it must appear in the payload (case-sensitive). Return True or False.",
      "starter": "import ipaddress\n\n\ndef rule_matches(rule, packet):\n    pass",
      "hint": "def src_ok(): return rule['src'] == 'any' or ipaddress.ip_address(packet['src']) in ipaddress.ip_network(rule['src'])",
      "test": "rule = {'action': 'alert', 'proto': 'tcp', 'src': 'any', 'src_port': 'any', 'dst': '10.0.0.5', 'dst_port': '22',\n        'msg': 'SSH root', 'content': 'root', 'sid': 1001}\npkt = {'proto': 'tcp', 'src': '198.51.100.3', 'dst': '10.0.0.5', 'dst_port': 22, 'payload': 'user root login'}\nassert rule_matches(rule, pkt) is True, 'Match'\nassert rule_matches(rule, dict(pkt, payload='user priya')) is False, 'Content missing'\nassert rule_matches(rule, dict(pkt, dst_port=2222)) is False, 'Different port'\nnet_rule = dict(rule, src='203.0.113.0/24', dst='any', dst_port='any', content=None)\nassert rule_matches(net_rule, dict(pkt, src='203.0.113.40')) is True and rule_matches(net_rule, pkt) is False, 'Source network'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "CVSS v3.1 Base Score",
      "desc": "Write `cvss_base(m)` for a dict of metrics AV, AC, PR, UI, S, C, I, A (letters as in a CVSS vector). Weights: AV N .85 A .62 L .55 P .2; AC L .77 H .44; PR N .85, L .62 (.68 if S is C), H .27 (.5 if S is C); UI N .85 R .62; C/I/A H .56 L .22 N 0. ISS = 1 - (1-C)(1-I)(1-A). Impact = 6.42 × ISS if S is U, else 7.52 × (ISS - 0.029) - 3.25 × (ISS - 0.02)**15. Exploitability = 8.22 × AV × AC × PR × UI. If Impact <= 0 the score is 0.0; otherwise roundup(min(Impact + Exploitability, 10)) for S:U, or roundup(min(1.08 × (Impact + Exploitability), 10)) for S:C. roundup(x): i = round(x * 100000); return i / 100000 if i % 10000 == 0 else (i // 10000 + 1) / 10.",
      "starter": "def cvss_base(m):\n    pass",
      "hint": "Put the weights in dictionaries; PR depends on scope.",
      "test": "def vec(s):\n    return dict(p.split(':') for p in s.split('/'))\nassert cvss_base(vec('AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H')) == 9.8, f\"Got {cvss_base(vec('AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'))}\"\nassert cvss_base(vec('AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N')) == 6.1, 'Typical reflected XSS'\nassert cvss_base(vec('AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H')) == 7.8, 'Local privilege escalation'\nassert cvss_base(vec('AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N')) == 0.0, 'No impact'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Parse a CVSS Vector and Rate Severity",
      "desc": "Write `cvss_severity(vector)` for strings like 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' and a precomputed score passed as a second argument: `cvss_severity(vector, score)`. Validate that the vector starts with 'CVSS:3.1/' and contains all eight metrics AV, AC, PR, UI, S, C, I, A (ValueError otherwise). Return (metrics_dict, rating) where rating is 'None' for 0.0, 'Low' for 0.1-3.9, 'Medium' for 4.0-6.9, 'High' for 7.0-8.9, 'Critical' for 9.0-10.0.",
      "starter": "def cvss_severity(vector, score):\n    pass",
      "hint": "metrics = dict(p.split(':') for p in vector.split('/')[1:])",
      "test": "m, rating = cvss_severity('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', 9.8)\nassert rating == 'Critical' and m['AV'] == 'N' and len(m) == 8, f'Got {m}, {rating}'\nassert [cvss_severity('CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H', s)[1] for s in (0.0, 3.9, 4.0, 7.0, 8.9)] == ['None', 'Low', 'Medium', 'High', 'High'], 'Boundaries'\nfor bad in ['CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', 'CVSS:3.1/AV:N/AC:L']:\n    try:\n        cvss_severity(bad, 5.0)\n        raise AssertionError(f'{bad!r} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Zero Trust Access Decision",
      "desc": "Write `zt_decide(req)` for a request with 'device_compliant' (bool), 'mfa_age_min' (minutes since the last MFA), 'country' and 'allowed_countries', and 'risk' (0-100). Rules in order: DENY if the device is not compliant, the country is not allowed, or risk >= 80; STEP_UP (ask for MFA again) if mfa_age_min > 60 or risk >= 50; otherwise ALLOW.",
      "starter": "def zt_decide(req):\n    pass",
      "hint": "Check the deny conditions first, then step-up, then allow.",
      "test": "base = {'device_compliant': True, 'mfa_age_min': 10, 'country': 'IN', 'allowed_countries': {'IN', 'SG'}, 'risk': 20}\nassert zt_decide(base) == 'ALLOW', 'Healthy request'\nassert zt_decide(dict(base, mfa_age_min=90)) == 'STEP_UP', 'Stale MFA'\nassert zt_decide(dict(base, risk=55)) == 'STEP_UP', 'Elevated risk'\nassert zt_decide(dict(base, device_compliant=False)) == 'DENY', 'Unmanaged device'\nassert zt_decide(dict(base, country='XX', mfa_age_min=90)) == 'DENY', 'Deny beats step-up'\nassert zt_decide(dict(base, risk=80)) == 'DENY', 'High risk'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Micro-Segmentation Violations",
      "desc": "Write `segment_violations(flows, policy)` where flows are (src_service, dst_service, port) tuples observed on the network and policy is a set of allowed (src_service, dst_service, port) tuples. Return a sorted list of the distinct flows not allowed by the policy.",
      "starter": "def segment_violations(flows, policy):\n    pass",
      "hint": "sorted(set(f for f in flows if f not in policy))",
      "test": "policy = {('web', 'api', 443), ('api', 'db', 5432)}\nflows = [('web', 'api', 443), ('api', 'db', 5432), ('web', 'db', 5432), ('web', 'db', 5432), ('api', 'db', 22)]\nassert segment_violations(flows, policy) == [('api', 'db', 22), ('web', 'db', 5432)], f'Got {segment_violations(flows, policy)}'\nassert segment_violations([], policy) == [], 'No traffic'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Over-Permissive IAM Statements",
      "desc": "Write `iam_findings(policy)` for an AWS-style policy {'Statement': [...]}. Each statement has 'Sid', 'Effect', 'Action' and 'Resource' (each a string or a list of strings). For Allow statements only, report (Sid, 'WILDCARD_ACTION') if any action is '*' or ends with ':*', and (Sid, 'WILDCARD_RESOURCE') if any resource is '*'. Return the findings in statement order.",
      "starter": "def iam_findings(policy):\n    pass",
      "hint": "def as_list(x): return x if isinstance(x, list) else [x]",
      "test": "policy = {'Statement': [\n    {'Sid': 'ReadLogs', 'Effect': 'Allow', 'Action': 'logs:GetLogEvents', 'Resource': 'arn:aws:logs:ap-south-1:1:log-group:app'},\n    {'Sid': 'Admin', 'Effect': 'Allow', 'Action': '*', 'Resource': '*'},\n    {'Sid': 'S3All', 'Effect': 'Allow', 'Action': ['s3:GetObject', 's3:*'], 'Resource': ['arn:aws:s3:::reports/*']},\n    {'Sid': 'DenyAll', 'Effect': 'Deny', 'Action': '*', 'Resource': '*'},\n]}\nassert iam_findings(policy) == [('Admin', 'WILDCARD_ACTION'), ('Admin', 'WILDCARD_RESOURCE'), ('S3All', 'WILDCARD_ACTION')], f'Got {iam_findings(policy)}'\nassert iam_findings({'Statement': []}) == [], 'Empty policy'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Is This Storage Bucket Public?",
      "desc": "Write `bucket_public(bucket)` where bucket has 'block_public_access' (bool), 'acl' (e.g. 'private' or 'public-read') and 'policy_statements' (list of {'Effect', 'Principal', 'Action'}). Return a sorted list of reasons: 'PUBLIC_ACL' if acl is 'public-read' or 'public-read-write'; 'PUBLIC_POLICY' if an Allow statement has Principal '*' and an action of 's3:GetObject' or 's3:*' (Action may be a string or list). If block_public_access is True, return [] because it overrides both.",
      "starter": "def bucket_public(bucket):\n    pass",
      "hint": "Return [] early when block_public_access is True.",
      "test": "b = {'block_public_access': False, 'acl': 'public-read',\n     'policy_statements': [{'Effect': 'Allow', 'Principal': '*', 'Action': ['s3:GetObject']}]}\nassert bucket_public(b) == ['PUBLIC_ACL', 'PUBLIC_POLICY'], f'Got {bucket_public(b)}'\nassert bucket_public(dict(b, block_public_access=True)) == [], 'Block Public Access overrides'\nassert bucket_public({'block_public_access': False, 'acl': 'private', 'policy_statements': [{'Effect': 'Allow', 'Principal': {'AWS': 'arn:aws:iam::1:role/app'}, 'Action': 's3:GetObject'}]}) == [], 'Only a specific role'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Chain of Custody Hash Chain",
      "desc": "Forensic evidence logs must be tamper-evident. Write `chain_hashes(entries)` where each entry is a string. The first hash is sha256(('0' * 64 + entry).encode()).hexdigest(); each next hash is sha256((previous_hash + entry).encode()).hexdigest(). Return the list of hashes.",
      "starter": "import hashlib\n\n\ndef chain_hashes(entries):\n    pass",
      "hint": "prev = '0' * 64; for e in entries: prev = hashlib.sha256((prev + e).encode()).hexdigest()",
      "test": "import hashlib\nentries = ['09:00 laptop seized by Officer Rao', '09:30 disk imaged, SHA-256 recorded', '10:15 image copied to lab server']\nhs = chain_hashes(entries)\nassert len(hs) == 3 and all(len(h) == 64 for h in hs), 'One hash per entry'\nassert hs[0] == hashlib.sha256(('0' * 64 + entries[0]).encode()).hexdigest(), 'Genesis rule'\nassert hs[2] == hashlib.sha256((hs[1] + entries[2]).encode()).hexdigest(), 'Each hash covers the previous one'\nassert chain_hashes([]) == [], 'Empty log'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Detect Tampering in the Custody Log",
      "desc": "Write `first_tampered(entries, hashes)` that recomputes the Practice 1 hash chain and returns the index of the first entry whose recomputed hash differs from the stored one, or None if the log is intact. If the lists have different lengths, return the index where they stop matching up (the length of the shorter list) unless an earlier mismatch exists.",
      "starter": "import hashlib\n\n\ndef first_tampered(entries, hashes):\n    pass",
      "hint": "Recompute prev as in Practice 1 and compare at each index.",
      "test": "import hashlib\ndef chain(es):\n    prev, out = '0' * 64, []\n    for e in es:\n        prev = hashlib.sha256((prev + e).encode()).hexdigest()\n        out.append(prev)\n    return out\nentries = ['seized', 'imaged', 'copied', 'analysed']\nhs = chain(entries)\nassert first_tampered(entries, hs) is None, 'Intact'\nedited = entries[:]\nedited[1] = 'imaged (edited later)'\nassert first_tampered(edited, hs) == 1, 'The edited entry is found'\nassert first_tampered(entries[:3], hs) == 3, 'A deleted last entry is detected'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Alert Triage Queue",
      "desc": "Capstone: write `triage(alerts, assets)` where alerts are {'id', 'severity' (1-5), 'asset'} and assets maps asset names to criticality (1-5; unknown assets count as 1). Priority = severity × criticality. Return the alert ids ordered by priority (highest first), ties broken by higher severity, then by id ascending.",
      "starter": "def triage(alerts, assets):\n    pass",
      "hint": "sorted(alerts, key=lambda a: (-a['severity'] * assets.get(a['asset'], 1), -a['severity'], a['id']))",
      "test": "assets = {'payments-db': 5, 'hr-laptop': 2, 'dev-vm': 1}\nalerts = [{'id': 'A3', 'severity': 3, 'asset': 'payments-db'}, {'id': 'A1', 'severity': 5, 'asset': 'dev-vm'},\n          {'id': 'A2', 'severity': 5, 'asset': 'payments-db'}, {'id': 'A4', 'severity': 4, 'asset': 'unknown-host'},\n          {'id': 'A5', 'severity': 2, 'asset': 'hr-laptop'}]\nassert triage(alerts, assets) == ['A2', 'A3', 'A1', 'A4', 'A5'], f'Got {triage(alerts, assets)}'\ntie = [{'id': 'B2', 'severity': 2, 'asset': 'x'}, {'id': 'B1', 'severity': 1, 'asset': 'y'}]\nassert triage(tie, {'x': 1, 'y': 2}) == ['B2', 'B1'], 'Equal priority: higher severity first'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Security Scorecard",
      "desc": "Write `scorecard(controls)` where controls maps control names to True (in place) or False. Return {'score': percentage of controls in place rounded to 1 decimal (0.0 if none), 'grade': 'A' for 90 or more, 'B' 75-89.9, 'C' 50-74.9, otherwise 'D', 'gaps': sorted names of missing controls}.",
      "starter": "def scorecard(controls):\n    pass",
      "hint": "score = round(sum(controls.values()) / len(controls) * 100, 1) if controls else 0.0",
      "test": "controls = {'mfa': True, 'patching': True, 'backups': True, 'waf': False, 'logging': True, 'secrets_scan': True,\n            'least_privilege': False, 'incident_plan': True}\nassert scorecard(controls) == {'score': 75.0, 'grade': 'B', 'gaps': ['least_privilege', 'waf']}, f'Got {scorecard(controls)}'\nassert scorecard({'a': True}) == {'score': 100.0, 'grade': 'A', 'gaps': []}, 'Perfect'\nassert scorecard({}) == {'score': 0.0, 'grade': 'D', 'gaps': []}, 'Nothing measured'\nprint('All checks passed.')"
    }
  }
];

export const CYBER_PYTHON_30_DAYS_CONFIGS: DayConfig[] = CYBER_30_DAYS_CONFIGS.map((cfg, i) => {
  const day = DAYS[i];
  return {
    ...cfg,
    eTitle: day.e.title,
    eDesc: day.e.desc,
    eStarter: day.e.starter,
    eHint: day.e.hint,
    eTest: day.e.test,
    aTitle: day.a.title,
    aDesc: day.a.desc,
    aStarter: day.a.starter,
    aHint: day.a.hint,
    aTest: day.a.test,
  };
});

export const CYBER_PYTHON_30_DAYS_QUESTS: CourseQuest[] = CYBER_PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('cyber-py', idx + 1, cfg)
);
