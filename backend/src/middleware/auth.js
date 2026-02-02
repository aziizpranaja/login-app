import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware - Request cookies:', req.cookies);
  console.log('Auth middleware - Request headers:', req.headers.cookie);
  
  const token = req.cookies?.token;

  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    // Get fresh user data from database
    const [rows] = await db.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [decoded.id]
    );
    
    if (!rows.length) {
      console.log('User not found in database');
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = rows[0];
    console.log('User authenticated:', req.user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: "Invalid token" });
  }
};