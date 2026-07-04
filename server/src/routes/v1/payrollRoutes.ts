import { Router } from 'express';
import { PayrollController } from '../../controllers/payrollController';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();
router.use(authenticate);

router.get('/me', PayrollController.getMyPayroll);
router.get('/current', PayrollController.getCurrentPayroll);
router.post('/generate', authorize('admin', 'super_admin'), PayrollController.generatePayroll);
router.put('/:id', authorize('admin', 'super_admin'), PayrollController.updatePayroll);
router.get('/all', authorize('admin', 'super_admin'), PayrollController.getAllPayrolls);

export default router;