import { Router } from 'express';
import { AuthController } from '../../controllers/authController';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, AuthController.login);
router.post('/signup', authLimiter, AuthController.signup);

export default router;
