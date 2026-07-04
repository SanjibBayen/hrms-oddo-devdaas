import { Router } from 'express';

const router = Router();

// TODO: Add payroll routes
router.get('/me', (req, res) => {
  res.json({ message: 'Payroll - Coming soon' });
});

export default router;