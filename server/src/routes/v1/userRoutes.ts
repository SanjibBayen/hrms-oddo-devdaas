import { Router } from 'express';

const router = Router();

// TODO: Add user routes
router.get('/me', (_req, res) => {
  res.json({ message: 'User profile - Coming soon' });
});

export default router;
