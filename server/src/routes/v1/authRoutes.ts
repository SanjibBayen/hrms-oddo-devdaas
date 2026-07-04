import { Router } from 'express';

const router = Router();

// TODO: Add auth routes
router.post('/login', (_req, res) => {
  res.json({ message: 'Login - Coming soon' });
});

router.post('/signup', (_req, res) => {
  res.json({ message: 'Signup - Coming soon' });
});

export default router;
