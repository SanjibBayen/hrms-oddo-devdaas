import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger';

class CloudinaryManager {
  private static instance: CloudinaryManager;
  private configured: boolean = false;

  private constructor() {}

  static getInstance(): CloudinaryManager {
    if (!CloudinaryManager.instance) {
      CloudinaryManager.instance = new CloudinaryManager();
    }
    return CloudinaryManager.instance;
  }

  configure(): void {
    if (this.configured) return;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    this.configured = true;
    logger.info('Cloudinary configured');
  }

  getUploadFolder(): string {
    return process.env.CLOUDINARY_UPLOAD_FOLDER || 'hrms/profiles';
  }

  generateSignature(publicId: string, timestamp: number): string {
    const params = {
      timestamp,
      public_id: publicId,
      folder: this.getUploadFolder(),
      transformation: 'w_400,h_400,c_fill,g_face,q_auto:best',
    };

    return cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET || ''
    );
  }

  getSignaturePayload(userId: string) {
    const timestamp = Math.round(Date.now() / 1000);
    const publicId = `${this.getUploadFolder()}/user-${userId}-${timestamp}`;

    return {
      signature: this.generateSignature(publicId, timestamp),
      timestamp,
      publicId,
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      folder: this.getUploadFolder(),
    };
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      logger.error('Cloudinary delete failed:', error);
      return false;
    }
  }
}

export const cloudinaryManager = CloudinaryManager.getInstance();
export default cloudinaryManager;