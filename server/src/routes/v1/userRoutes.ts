import { Router } from 'express';

const router = Router();

// TODO: Add user routes
router.get('/me', (req, res) => {
  res.json({ message: 'User profile - Coming soon' });
});

export default router;