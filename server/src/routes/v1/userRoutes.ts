import { Router } from 'express';
import { UserController } from '../../controllers/userController';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.get('/me', UserController.getUserById);
router.put('/me', UserController.updateProfile);
router.get('/departments/stats', UserController.getDepartmentStats);

// Admin routes
router.get('/', authorize('admin', 'super_admin'), UserController.getAllUsers);
router.get('/:id', authorize('admin', 'super_admin'), UserController.getUserById);
router.put('/:id', authorize('admin', 'super_admin'), UserController.adminUpdateUser);
router.delete('/:id', authorize('admin', 'super_admin'), UserController.deactivateUser);

export default router;