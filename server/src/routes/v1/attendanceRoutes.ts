import { Router } from 'express';

const router = Router();

// TODO: Add attendance routes
router.get('/me', (req, res) => {
  res.json({ message: 'Attendance - Coming soon' });
});

export default router;