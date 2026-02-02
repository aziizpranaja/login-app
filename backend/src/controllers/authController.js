import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Server-side validation
  if (!email || !password) {
    return res.status(400).json({ 
      message: "Field wajib diisi",
      details: {
        email: !email ? "Email wajib diisi" : null,
        password: !password ? "Password wajib diisi" : null
      }
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ 
      message: "Format email tidak valid",
      details: {
        email: "Format email tidak valid",
        password: null
      }
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      message: "Password minimal 6 karakter",
      details: {
        email: null,
        password: "Password minimal 6 karakter"
      }
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, email]
    );

    if (!rows.length) {
      return res.status(401).json({ 
        message: "User tidak ditemukan",
        details: {
          email: "Email atau username tidak terdaftar",
          password: null
        }
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ 
        message: "Password salah",
        details: {
          email: null,
          password: "Password yang dimasukkan salah"
        }
      });
    }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // ❗ jangan kirim password ke frontend
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true kalau HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  return res.json({
    message: "Login berhasil",
    token,
    user: userData,
  });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: "Terjadi kesalahan server",
      details: {
        email: null,
        password: null
      }
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout sukses" });
};

export const profile = (req, res) => {
  console.log('Profile endpoint accessed, user:', req.user);
  res.json(req.user);
};
