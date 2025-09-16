const { prisma } = require("../../prismaClient.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: "Email and a password of at least 6 characters are required." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email }, // ✅ standardized payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // ✅ Make token payload same as register
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login." });
  }
}

module.exports = { register, login };
