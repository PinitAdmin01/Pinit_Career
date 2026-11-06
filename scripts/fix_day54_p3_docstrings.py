with open("scripts/build_iot_sec_day54.py", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('"""Simulates X25519 + ML-KEM-768 hybrid key exchange conforming to TLS 1.3."""', '# Simulates X25519 + ML-KEM-768 hybrid key exchange conforming to TLS 1.3')
text = text.replace('"""Client generates dual ephemeral keypairs deterministically."""', '# Client generates dual ephemeral keypairs deterministically')
text = text.replace('"""Server decodes keyshare, computes DH and ML-KEM encaps, combines secrets."""', '# Server decodes keyshare, computes DH and ML-KEM encaps, combines secrets')
text = text.replace('"""Client processes server response and derives identical hybrid master secret."""', '# Client processes server response and derives identical hybrid master secret')

with open("scripts/build_iot_sec_day54.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed docstrings in Day 54 Part 3!")
