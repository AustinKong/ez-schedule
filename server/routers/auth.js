import { Router } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  updateUser,
  getUserByUsername,
} from "../database/userDb.js";
import { sendResetPasswordEmail } from "../utils/mailer.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, username, userType } = req.body; // userType is either host(such as Prof, employers) or participant(such as students, employees)

    if (!email || !password || !username || !userType) {
      return res.status(400).json({
        error: "Email, password, name, username, userType are required",
      });
    }

    let existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);
    await createUser({
      email,
      password: hashedPassword,
      username,
      userType,
    }); // userType is either host(such as Prof, employers) or participant(such as students, employees)

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login - Login (For not logged in users)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, userRole: user.userRole },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );

    return res
      .status(200)
      .json({ token, userRole: user.userRole, userId: user._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/forgot-password - Forgot password (For not logged in users)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(200)
        .json({ message: "If email exists, a reset link has been sent." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await sendResetPasswordEmail(user.email, token);
    res
      .status(200)
      .json({ message: "If email exists, a reset link has been sent." });

    // console.log(`Reset link: http://localhost:3000/reset-password?token=${token}`);
    // res.status(200).json({ message: "Reset link sent", token }); // remove token in prod
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password - Reset password (For not logged in users)
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "Token and new password are required." });
  }

  try {
    // Verify token and extract userId
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.userId;

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update user password in DB
    await updateUser(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(400).json({ error: err.message || "Invalid or expired token." });
  }
});

export default router;
