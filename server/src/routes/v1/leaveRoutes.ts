import { Router } from 'express';

const router = Router();

// TODO: Add leave routes
router.get('/me', (_req, res) => {
  res.json({ message: 'Leaves - Coming soon' });
});

export default router;
