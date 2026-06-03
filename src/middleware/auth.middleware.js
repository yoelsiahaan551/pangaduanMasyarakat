import jwt from "jsonwebtoken";
import db from "../config/database.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token tidak ditemukan",
    });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [users] = await db.query(
      "SELECT id, nama, email, role, foto_profil FROM users WHERE id = ?",
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }
    
    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid",
    });
  }
};

// Middleware untuk role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Role '${req.user.role}' tidak diizinkan.`,
      });
    }
    next();
  };
};

export default verifyToken;