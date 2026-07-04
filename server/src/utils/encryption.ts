import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

class EncryptionService {
  private static instance: EncryptionService;
  private masterKey: Buffer;

  private constructor() {
    const keyHex = process.env.ENCRYPTION_KEY;

    if (!keyHex || keyHex.length < 64) {
      const generatedKey = crypto.randomBytes(32).toString('hex');
      console.warn(
        'WARNING: ENCRYPTION_KEY is missing or invalid. Generated temporary key: ' +
        generatedKey
      );
      console.warn('Add this to your .env file: ENCRYPTION_KEY=' + generatedKey);
      this.masterKey = Buffer.from(generatedKey, 'hex');
    } else {
      this.masterKey = Buffer.from(keyHex, 'hex');
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
      const iv = crypto.randomBytes(IV_LENGTH);
      const salt = crypto.randomBytes(SALT_LENGTH);

      const key = crypto.pbkdf2Sync(this.masterKey, salt, 100000, 32, 'sha512');

      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

      const plaintext = String(text);
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return [
        salt.toString('hex'),
        iv.toString('hex'),
        authTag.toString('hex'),
        encrypted,
      ].join(':');
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
      if (parts.length !== 4) {
        return encryptedText;
      }

      const [saltHex, ivHex, authTagHex, encrypted] = parts;

      const salt = Buffer.from(saltHex!, 'hex');
      const iv = Buffer.from(ivHex!, 'hex');
      const authTag = Buffer.from(authTagHex!, 'hex');

      const key = crypto.pbkdf2Sync(this.masterKey, salt, 100000, 32, 'sha512');

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted!, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch {
      return encryptedText;
    }
  }

  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  constantTimeCompare(a: string, b: string): boolean {
    try {
      return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch {
      return false;
    }
  }
}

export const encryptionService = EncryptionService.getInstance();
export default encryptionService;