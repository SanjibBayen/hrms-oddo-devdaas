import { Router } from 'express';
import { UploadController } from '../../controllers/uploadController';
import { authenticate } from '../../middleware/auth';
import { uploadProfilePicture } from '../../middleware/upload';

const router = Router();

router.use(authenticate);

router.get('/signature', UploadController.getUploadSignature);
router.post('/profile-picture', uploadProfilePicture, UploadController.uploadProfilePicture);

export default router;