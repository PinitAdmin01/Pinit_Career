with open("scripts/build_iot_sec_day57.py", "r", encoding="utf-8") as f:
    text = f.read()

# Fix in Part 3
text = text.replace('(self.priv_scalar * r_scalar) + 1337', '((self.priv_scalar * r_scalar) + 1337) & 0xFFFFFFFFFFFFFFFF')
text = text.replace('(self.priv_scalar * r_exp) + 1337', '((self.priv_scalar * r_exp) + 1337) & 0xFFFFFFFFFFFFFFFF')

# Fix in Part 5
text = text.replace('(self.priv_scalar * r_val) + 1337', '((self.priv_scalar * r_val) + 1337) & 0xFFFFFFFFFFFFFFFF')

with open("scripts/build_iot_sec_day57.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed integer masks in Day 57!")
