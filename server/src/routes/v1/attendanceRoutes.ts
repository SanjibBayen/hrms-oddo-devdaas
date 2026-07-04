import { Router } from 'express';

const router = Router();

// TODO: Add attendance routes
router.get('/me', (_req, res) => {
  res.json({ message: 'Attendance - Coming soon' });
});

export default router;
