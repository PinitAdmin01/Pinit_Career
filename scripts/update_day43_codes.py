with open('scripts/build_day43_cloud.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace p1_code
old_p1_encrypt = '''  encrypt(plaintext: string, sourceRegion: string): { ciphertext: string; mrkId: string; encryptedRegion: string } {
    return {
      ciphertext: Buffer.from(`ENC[${plaintext}]_WITH_${this.primaryKey.keyMaterialHash}`).toString('base64'),
      mrkId: this.primaryKey.keyId,
      encryptedRegion: sourceRegion,
    };
  }

  decryptLocally(envelope: { ciphertext: string; mrkId: string }, targetRegion: string): { decryptedText: string; localDecryption: boolean } {
    const replica = targetRegion === this.primaryKey.region ? this.primaryKey : this.replicaKeys.get(targetRegion);
    if (!replica || replica.keyId !== envelope.mrkId) {
      throw new Error(`KMS_DECRYPT_FAIL: No local replica in ${targetRegion}`);
    }
    const raw = Buffer.from(envelope.ciphertext, 'base64').toString('utf-8');
    const match = raw.match(/^ENC\\[(.*)\\]_WITH_/);
    return {
      decryptedText: match ? match[1] : '',
      localDecryption: true,
    };
  }'''

new_p1_encrypt = '''  encrypt(plaintext: string, sourceRegion: string): { ciphertext: string; mrkId: string; encryptedRegion: string } {
    return {
      ciphertext: `CIPHERTEXT_BLOB:[${plaintext}]_KEY:[${this.primaryKey.keyMaterialHash}]`,
      mrkId: this.primaryKey.keyId,
      encryptedRegion: sourceRegion,
    };
  }

  decryptLocally(envelope: { ciphertext: string; mrkId: string }, targetRegion: string): { decryptedText: string; localDecryption: boolean } {
    const replica = targetRegion === this.primaryKey.region ? this.primaryKey : this.replicaKeys.get(targetRegion);
    if (!replica || replica.keyId !== envelope.mrkId) {
      throw new Error(`KMS_DECRYPT_FAIL: No local replica in ${targetRegion}`);
    }
    const match = envelope.ciphertext.match(/^CIPHERTEXT_BLOB:\\[(.*)\\]_KEY:\\[/);
    return {
      decryptedText: match ? match[1] : '',
      localDecryption: true,
    };
  }'''

# Replace p3_code
old_p3_return = '''    cached.usageCount++;
    return {
      ciphertextBlob: Buffer.from(`${plaintext}__ENC_BY_${cached.plainKey}`).toString('base64'),
      encryptedDataKey: `CIPHER_DEK_BLOB_${this.kmsApiCalls}`,
      kmsKeyId,
    };'''

new_p3_return = '''    cached.usageCount++;
    return {
      ciphertextBlob: `ENCRYPTED_BLOB_${plaintext}_BY_${cached.plainKey}`,
      encryptedDataKey: `CIPHER_DEK_BLOB_${this.kmsApiCalls}`,
      kmsKeyId,
    };'''

# Replace p4_code
old_p4_encrypt = '''  encryptUserData(userId: string, piiData: string): UserEncryptedRecord {
    const key = this.userKeyStore.get(userId);
    if (!key) throw new Error(`NO_KEY_FOR_USER: ${userId}`);
    return {
      userId,
      ciphertext: Buffer.from(`PII[${piiData}]_KEY[${key}]`).toString('base64'),
      dataKeyVersion: 'v1',
    };
  }

  decryptUserData(record: UserEncryptedRecord): { decryptedData: string | null; isReadable: boolean } {
    const key = this.userKeyStore.get(record.userId);
    if (!key) {
      // Key destroyed: ciphertext is permanently unrecoverable
      return { decryptedData: null, isReadable: false };
    }
    const raw = Buffer.from(record.ciphertext, 'base64').toString('utf-8');
    const match = raw.match(/^PII\\[(.*)\\]_KEY\\[/);
    return { decryptedData: match ? match[1] : null, isReadable: true };
  }'''

new_p4_encrypt = '''  encryptUserData(userId: string, piiData: string): UserEncryptedRecord {
    const key = this.userKeyStore.get(userId);
    if (!key) throw new Error(`NO_KEY_FOR_USER: ${userId}`);
    return {
      userId,
      ciphertext: `ENCRYPTED_PII_BLOB:[${piiData}]_KEY:[${key}]`,
      dataKeyVersion: 'v1',
    };
  }

  decryptUserData(record: UserEncryptedRecord): { decryptedData: string | null; isReadable: boolean } {
    const key = this.userKeyStore.get(record.userId);
    if (!key) {
      // Key destroyed: ciphertext is permanently unrecoverable
      return { decryptedData: null, isReadable: false };
    }
    const match = record.ciphertext.match(/^ENCRYPTED_PII_BLOB:\\[(.*)\\]_KEY:\\[/);
    return { decryptedData: match ? match[1] : null, isReadable: true };
  }'''

assert old_p1_encrypt in c, "old_p1_encrypt not found"
c = c.replace(old_p1_encrypt, new_p1_encrypt)

assert old_p3_return in c, "old_p3_return not found"
c = c.replace(old_p3_return, new_p3_return)

assert old_p4_encrypt in c, "old_p4_encrypt not found"
c = c.replace(old_p4_encrypt, new_p4_encrypt)

with open('scripts/build_day43_cloud.py', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated build_day43_cloud.py with buffer-free snippets!")
