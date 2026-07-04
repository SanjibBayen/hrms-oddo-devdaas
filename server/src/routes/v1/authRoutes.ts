import { Router } from 'express';

const router = Router();

// TODO: Add auth routes
router.post('/login', (req, res) => {
  res.json({ message: 'Login - Coming soon' });
});

router.post('/signup', (req, res) => {
  res.json({ message: 'Signup - Coming soon' });
});

export default router;