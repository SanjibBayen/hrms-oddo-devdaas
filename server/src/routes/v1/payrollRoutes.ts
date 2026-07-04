import { Router } from 'express';

const router = Router();

// TODO: Add payroll routes
router.get('/me', (_req, res) => {
  res.json({ message: 'Payroll - Coming soon' });
});

export default router;
