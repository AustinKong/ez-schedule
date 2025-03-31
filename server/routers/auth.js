import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../database/userDb';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    await createUser({ email, password: hashedPassword });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
