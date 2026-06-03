import db from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ======================================
// REGISTER
// ======================================

export const register = async (req, res) => {

  try {

    const { nama, email, password, role } = req.body;

    // VALIDASI
    if (!nama || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });

    }

    // CEK EMAIL
    const [checkUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (checkUser.length > 0) {

      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan",
      });

    }

    // HASH PASSWORD
    const hashPassword = await bcrypt.hash(
      password,
      10
    );

    // INSERT USER
    await db.query(
      `
      INSERT INTO users
      (nama, email, password, role)
      VALUES (?, ?, ?, ?)
      `,
      [
        nama,
        email,
        hashPassword,
        role || "user",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Register berhasil",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// LOGIN
// ======================================

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // VALIDASI
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });

    }

    // CARI USER
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // USER TIDAK DITEMUKAN
    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });

    }

    const user = rows[0];

    // CEK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Password salah",
      });

    }

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }
    );

    // RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,

      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        foto_profil: user.foto_profil,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// GET PROFILE LOGIN
// ======================================

export const getMe = async (req, res) => {

  try {

    return res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// EXPORT DEFAULT
// ======================================

const AuthController = {
  register,
  login,
  getMe,
};

export default AuthController;