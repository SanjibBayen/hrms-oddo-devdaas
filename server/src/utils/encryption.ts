import crypto from 'crypto';

class EncryptionService {
  private static instance: EncryptionService;
  private key: Buffer;
  private salt: Buffer;

  private constructor() {
    const keyHex = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
    const saltHex = process.env.ENCRYPTION_SALT || crypto.randomBytes(16).toString('hex');

    this.key = Buffer.from(keyHex, 'hex');
    this.salt = Buffer.from(saltHex, 'hex');

    if (this.key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
    }
    if (this.salt.length !== 16) {
      throw new Error('ENCRYPTION_SALT must be 16 bytes (32 hex characters)');
    }
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  encrypt(text: string | number | null | undefined): string | null {
    if (text === null || text === undefined || text === '') {
      return null;
    }

    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
      cipher.setAAD(this.salt);

      const plaintext = String(text);
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Format: iv:authTag:encryptedData
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  decrypt(encryptedText: string | null | undefined): string | null {
    if (!encryptedText) {
      return null;
    }

    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        // Not encrypted, return as-is (for backward compatibility)
        return encryptedText;
      }

      const [ivHex, authTagHex, encrypted] = parts;

      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        this.key,
        Buffer.from(ivHex!, 'hex')
      );
      decipher.setAAD(this.salt);
      decipher.setAuthTag(Buffer.from(authTagHex!, 'hex'));

      let decrypted = decipher.update(encrypted!, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      // If decryption fails, return original (might be unencrypted data)
      return encryptedText;
    }
  }

  encryptObject<T extends Record<string, unknown>>(
    obj: T,
    fields: (keyof T)[]
  ): T {
    const encrypted = { ...obj };
    for (const field of fields) {
      if (encrypted[field] !== undefined && encrypted[field] !== null) {
        encrypted[field] = this.encrypt(String(encrypted[field])) as T[keyof T];
      }
    }
    return encrypted;
  }

  decryptObject<T extends Record<string, unknown>>(
    obj: T,
    fields: (keyof T)[]
  ): T {
    const decrypted = { ...obj };
    for (const field of fields) {
      if (decrypted[field] !== undefined && decrypted[field] !== null) {
        decrypted[field] = this.decrypt(String(decrypted[field])) as T[keyof T];
      }
    }
    return decrypted;
  }
}

export const encryptionService = EncryptionService.getInstance();
export default encryptionService;