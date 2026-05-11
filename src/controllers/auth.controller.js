import db from "../config/database.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// ======================================
// REGISTER
// ======================================

export const register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body

    // validasi input
    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi"
      })
    }

    // cek email sudah ada atau belum
    const checkSql = "SELECT * FROM users WHERE email = ?"

    db.query(checkSql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        })
      }

      if (result.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email sudah digunakan"
        })
      }

      // hash password
      const hashPassword = await bcrypt.hash(password, 10)

      // insert user
      const insertSql = `
        INSERT INTO users (nama, email, password, role)
        VALUES (?, ?, ?, ?)
      `

      db.query(
        insertSql,
        [nama, email, hashPassword, role || "user"],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message
            })
          }

          res.status(201).json({
            success: true,
            message: "Register berhasil"
          })
        }
      )
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ======================================
// LOGIN
// ======================================

export const login = (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi"
      })
    }

    const sql = "SELECT * FROM users WHERE email = ?"

    db.query(sql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        })
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan"
        })
      }

      const user = result[0]

      // cek password
      const comparePassword = await bcrypt.compare(
        password,
        user.password
      )

      if (!comparePassword) {
        return res.status(401).json({
          success: false,
          message: "Password salah"
        })
      }

      // generate token
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role
        },
        "SECRETKEY",
        {
          expiresIn: "1d"
        }
      )

      res.status(200).json({
        success: true,
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
          foto_profil: user.foto_profil
        }
      })
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ======================================
// GET PROFILE LOGIN
// ======================================

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}