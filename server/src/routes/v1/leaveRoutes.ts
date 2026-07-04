import { Router } from 'express';
import { LeaveController } from '../../controllers/leaveController';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();
router.use(authenticate);

router.post('/apply', LeaveController.applyLeave);
router.get('/me', LeaveController.getMyLeaves);
router.get('/balance', LeaveController.getLeaveBalance);
router.get('/pending', authorize('admin', 'super_admin'), LeaveController.getPendingLeaves);
router.put('/:id/status', authorize('admin', 'super_admin'), LeaveController.updateLeaveStatus);

export default router;