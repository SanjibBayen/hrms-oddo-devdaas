import { Router } from 'express';
import { AttendanceController } from '../../controllers/attendanceController';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

const router = Router();
router.use(authenticate);

router.post('/check-in', AttendanceController.checkIn);
router.post('/check-out', AttendanceController.checkOut);
router.get('/me', AttendanceController.getMyAttendance);
router.get('/today', authorize('admin', 'super_admin'), AttendanceController.getTodayAttendance);
router.get('/all', authorize('admin', 'super_admin'), AttendanceController.getAllAttendance);

export default router;