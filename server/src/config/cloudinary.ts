import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger';

class CloudinaryManager {
  private static instance: CloudinaryManager;
  private configured: boolean = false;

  private constructor() { }

  static getInstance(): CloudinaryManager {
    if (!CloudinaryManager.instance) {
      CloudinaryManager.instance = new CloudinaryManager();
    }
    return CloudinaryManager.instance;
  }

  configure(): void {
    if (this.configured) return;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      logger.warn('Cloudinary not configured. Image upload features will use local storage.');
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    this.configured = true;
    logger.info('Cloudinary configured successfully');
  }

  getUploadFolder(): string {
    return process.env.CLOUDINARY_UPLOAD_FOLDER || 'hrms/profiles';
  }

  generateSignature(params: Record<string, any>): string {
    return cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET || ''
    );
  }

  getSignaturePayload(userId: string) {
    const timestamp = Math.round(Date.now() / 1000);
    const publicId = `${this.getUploadFolder()}/user-${userId}-${timestamp}`;

    const params = {
      timestamp,
      public_id: publicId,
      folder: this.getUploadFolder(),
      transformation: 'w_400,h_400,c_fill,g_face,q_auto:best,f_auto',
      allowed_formats: 'jpg,jpeg,png,webp',
      max_file_size: 2000000,
    };

    return {
      signature: this.generateSignature(params),
      timestamp,
      publicId,
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      folder: this.getUploadFolder(),
    };
  }

  async deleteImage(publicId: string): Promise<boolean> {
    if (!this.configured) return false;

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      logger.error('Cloudinary delete failed:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }
}

export const cloudinaryManager = CloudinaryManager.getInstance();
export default cloudinaryManager;