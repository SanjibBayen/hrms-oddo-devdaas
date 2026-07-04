import { Request, Response } from 'express';
import { cloudinaryManager } from '../config/cloudinary';
import { User } from '../models/User';
import { logger } from '../config/logger';

export class UploadController {
    static async getUploadSignature(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const payload = cloudinaryManager.getSignaturePayload(userId);
            res.json({
                status: 'success',
                code: 'SIGNATURE_GENERATED',
                message: 'Upload signature generated',
                data: payload,
            });
        } catch (error: any) {
            res.status(500).json({
                status: 'error',
                code: 'SIGNATURE_FAILED',
                message: error.message,
            });
        }
    }

    static async uploadProfilePicture(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    status: 'error',
                    code: 'NO_FILE',
                    message: 'No file uploaded',
                });
            }

            const userId = (req as any).userId;
            const fileUrl = `/uploads/profiles/${req.file.filename}`;

            const user = await User.findByIdAndUpdate(
                userId,
                {
                    'personalDetails.profilePicture': {
                        publicId: req.file.filename,
                        secureUrl: fileUrl,
                        thumbnailUrl: fileUrl,
                    },
                },
                { new: true }
            );

            res.json({
                status: 'success',
                code: 'UPLOAD_SUCCESS',
                message: 'Profile picture uploaded',
                data: {
                    profilePicture: user?.personalDetails?.profilePicture,
                },
            });
        } catch (error: any) {
            res.status(500).json({
                status: 'error',
                code: 'UPLOAD_FAILED',
                message: error.message,
            });
        }
    }
}