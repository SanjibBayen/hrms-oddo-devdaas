import { Router } from 'express';
import v1Routes from './v1';
import healthRoutes from './healthRoutes';

const router = Router();

router.use('/api/health', healthRoutes);
router.use('/api/v1', v1Routes);

export default router;