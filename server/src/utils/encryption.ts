import crypto from 'crypto';

class EncryptionService {
  private static instance: EncryptionService;
  private key: Buffer;

  private constructor() {
    let keyHex = process.env.ENCRYPTION_KEY;

    // Auto-generate if not provided or invalid
    if (!keyHex || keyHex.length !== 64) {
      keyHex = crypto.randomBytes(32).toString('hex');
      console.warn('ENCRYPTION_KEY not set or invalid. Generated temporary key.');
      console.warn('Add this to your .env: ENCRYPTION_KEY=' + keyHex);
    }

    this.key = Buffer.from(keyHex, 'hex');
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  encrypt(text: string | number | null | undefined): string | null {
    if (text === null || text === undefined || text === '') return null;

    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);

      const plaintext = String(text);
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  decrypt(encryptedText: string | null | undefined): string | null {
    if (!encryptedText) return null;

    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) return encryptedText;

      const [ivHex, authTagHex, encrypted] = parts;

      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        this.key,
        Buffer.from(ivHex!, 'hex')
      );
      decipher.setAuthTag(Buffer.from(authTagHex!, 'hex'));

      let decrypted = decipher.update(encrypted!, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch {
      return encryptedText;
    }
  }
}

export const encryptionService = EncryptionService.getInstance();
export default encryptionService;