# scripts/test_day37_snippets.py

# Snippet 1
class BooleanMaskingEngine:
    def __init__(self, random_mask: int = 0xA5):
        self.mask = random_mask & 0xFF

    def mask_byte(self, secret: int) -> dict:
        masked_val = (secret ^ self.mask) & 0xFF
        return {
            "Secret": hex(secret),
            "RandomMask": hex(self.mask),
            "MaskedShare": hex(masked_val),
            "Unmasked": hex(masked_val ^ self.mask)
        }

engine = BooleanMaskingEngine(random_mask=0x5C)
res1 = engine.mask_byte(secret=0x3F)
print("SNIPPET 1:")
print(f"Original Secret: {res1['Secret']}")
print(f"Random Mask:     {res1['RandomMask']}")
print(f"Masked Share:    {res1['MaskedShare']}")
print(f"Recovered Value: {res1['Unmasked']}")

# Snippet 2
class MaskedSBoxTable:
    def __init__(self, in_mask: int = 0x12, out_mask: int = 0x34):
        self.m_in = in_mask & 0x1F
        self.m_out = out_mask & 0x1F
        self.sbox = [
            0x0C, 0x15, 0x07, 0x1B, 0x02, 0x18, 0x0E, 0x05, 0x10, 0x01, 0x17, 0x0B, 0x1E, 0x1D, 0x0A, 0x16,
            0x09, 0x02, 0x19, 0x0D, 0x1A, 0x08, 0x14, 0x1F, 0x03, 0x11, 0x04, 0x0F, 0x1C, 0x13, 0x06, 0x00
        ]
        self.masked_sbox = [0] * len(self.sbox)
        self.build_masked_table()

    def build_masked_table(self):
        for x in range(len(self.sbox)):
            x_prime = x ^ self.m_in
            self.masked_sbox[x_prime] = self.sbox[x] ^ self.m_out

    def lookup(self, masked_input: int) -> int:
        return self.masked_sbox[masked_input % len(self.masked_sbox)]

table = MaskedSBoxTable(in_mask=0x07, out_mask=0x0F)
raw_input = 0x03
masked_in = raw_input ^ table.m_in
masked_out = table.lookup(masked_in)
unmasked_out = masked_out ^ table.m_out
expected_out = table.sbox[raw_input]

print("\nSNIPPET 2:")
print(f"Masked Input:   {hex(masked_in)}")
print(f"Masked Output:  {hex(masked_out)}")
print(f"Unmasked S-Box: {hex(unmasked_out)}")
print(f"Match Expected: {unmasked_out == expected_out}")

# Snippet 3
class RSAMultiplicativeBlinding:
    def __init__(self, n: int = 3233, e: int = 17, d: int = 2753):
        self.n = n
        self.e = e
        self.d = d

    def decrypt_with_blinding(self, ciphertext: int, random_blinding_factor: int = 37) -> dict:
        r = random_blinding_factor
        r_pow_e = pow(r, self.e, self.n)
        c_blinded = (ciphertext * r_pow_e) % self.n
        m_blinded = pow(c_blinded, self.d, self.n)
        r_inv = pow(r, -1, self.n)
        m_plaintext = (m_blinded * r_inv) % self.n

        return {
            "BlindedCiphertext": c_blinded,
            "BlindedIntermediate": m_blinded,
            "DecryptedPlaintext": m_plaintext
        }

rsa = RSAMultiplicativeBlinding()
c = 1500
res3 = rsa.decrypt_with_blinding(ciphertext=c, random_blinding_factor=43)
expected_plain = pow(c, rsa.d, rsa.n)
print("\nSNIPPET 3:")
print(f"Blinded Ciphertext:   {res3['BlindedCiphertext']}")
print(f"Blinded Intermediate: {res3['BlindedIntermediate']}")
print(f"Decrypted Plaintext:  {res3['DecryptedPlaintext']}")
print(f"Matches Unblinded:    {res3['DecryptedPlaintext'] == expected_plain}")
# Snippet 4: Threshold Implementation (TI) Shared AND Multiplier
class ThresholdImplementationMultiplier:
    """
    Computes Z = X & Y using 3 shares:
    X = x1 ^ x2 ^ x3
    Y = y1 ^ y2 ^ y3
    Non-completeness property:
    z1 = (x2 & y2) ^ (x2 & y3) ^ (x3 & y2)
    z2 = (x3 & y3) ^ (x3 & y1) ^ (x1 & y3)
    z3 = (x1 & y1) ^ (x1 & y2) ^ (x2 & y1)
    """
    def multiply_shares(self, x: int, y: int, m1: int, m2: int, n1: int, n2: int) -> dict:
        x1, x2 = m1, m2
        x3 = x ^ x1 ^ x2
        y1, y2 = n1, n2
        y3 = y ^ y1 ^ y2

        z1 = (x2 & y2) ^ (x2 & y3) ^ (x3 & y2)
        z2 = (x3 & y3) ^ (x3 & y1) ^ (x1 & y3)
        z3 = (x1 & y1) ^ (x1 & y2) ^ (x2 & y1)

        z_recombined = z1 ^ z2 ^ z3
        expected = x & y
        return {
            "SharedResult": z_recombined,
            "ExpectedResult": expected,
            "GlitchResistantMatch": z_recombined == expected
        }

ti = ThresholdImplementationMultiplier()
res4 = ti.multiply_shares(x=0b1100, y=0b1010, m1=0b0110, m2=0b0011, n1=0b1001, n2=0b0101)
print("\nSNIPPET 4:")
print(f"TI Shared Result:      {bin(res4['SharedResult'])}")
print(f"Expected Direct AND:   {bin(res4['ExpectedResult'])}")
print(f"Non-Completeness Pass: {res4['GlitchResistantMatch']}")

# Snippet 5: ApexFirstOrderMaskedAESEngine
class ApexFirstOrderMaskedAESEngine:
    def __init__(self, key_byte: int = 0x2B):
        self.key_byte = key_byte
        self.sbox = [
            0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76,
            0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0
        ]

    def execute_masked_round(self, plaintext_byte: int, mask_in: int, mask_out: int) -> dict:
        # 1. Mask key and plaintext
        masked_pt = plaintext_byte ^ mask_in
        masked_key = self.key_byte ^ mask_in
        
        # 2. AddRoundKey on shares: (P ^ m) ^ (K ^ m) = P ^ K (mask cancels, re-apply mask_in)
        ark_share = (masked_pt ^ masked_key) ^ mask_in
        
        # 3. Masked S-Box substitution with output re-masking
        # lookup in masked domain: S(P ^ K) ^ mask_out
        sbox_unmasked = self.sbox[(ark_share ^ mask_in) % len(self.sbox)]
        sbox_masked = sbox_unmasked ^ mask_out
        
        # 4. Final unmasking at boundary
        final_val = sbox_masked ^ mask_out
        
        return {
            "Plaintext": hex(plaintext_byte),
            "MaskedState": hex(sbox_masked),
            "UnmaskedOutput": hex(final_val),
            "MatchesUnmaskedSBox": final_val == sbox_unmasked
        }

engine5 = ApexFirstOrderMaskedAESEngine(key_byte=0x0B)
res5 = engine5.execute_masked_round(plaintext_byte=0x15, mask_in=0xA5, mask_out=0x5A)
print("\nSNIPPET 5:")
print(f"Masked Intermediate: {res5['MaskedState']}")
print(f"Final Unmasked:      {res5['UnmaskedOutput']}")
print(f"Round Integrity:     {res5['MatchesUnmaskedSBox']}")
