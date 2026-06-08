// backend/src/controllers/user.controller.js
import bcrypt from "bcryptjs";
import db from "../config/database.js";

// GET /api/users
export const getAll = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        id,
        nama,
        email,
        role,
        foto_profil,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// GET /api/users/:id
export const getOne = async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT
        id,
        nama,
        email,
        role,
        foto_profil,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
    `,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// 🆕 CREATE USER (Admin only)
export const createUser = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    // Validasi required fields
    if (!nama || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi"
      });
    }

    // Cek email sudah terdaftar atau belum
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const [result] = await db.query(
      `INSERT INTO users (nama, email, password, role, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [nama, email, hashedPassword, role || 'user']
    );

    res.status(201).json({
      success: true,
      message: "User berhasil ditambahkan",
      data: {
        id: result.insertId,
        nama,
        email,
        role: role || 'user'
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// PUT /api/users/:id
export const update = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    const user = users[0];

    const { nama, email, password, role, status } = req.body;

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    await db.query(
      `
      UPDATE users
      SET 
        nama = ?,
        email = ?,
        password = ?,
        role = ?,
        updated_at = NOW()
      WHERE id = ?
    `,
      [
        nama || user.nama,
        email || user.email,
        hashedPassword,
        role || user.role,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: "User berhasil diperbarui"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// PATCH /api/users/:id/status (untuk aktif/nonaktif)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Cek apakah user ada
    const [users] = await db.query(
      "SELECT id, role FROM users WHERE id = ?",
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    // Tidak bisa menonaktifkan admin sendiri
    if (users[0].role === 'admin' && req.user.id === Number(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Tidak bisa mengubah status akun sendiri"
      });
    }

    await db.query(
      "UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: `User berhasil ${status === 'nonaktif' ? 'dinonaktifkan' : 'diaktifkan'}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// DELETE /api/users/:id
export const remove = async (req, res) => {
  try {
    // Cek apakah user mencoba menghapus diri sendiri
    if (req.user.id === Number(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Tidak bisa menghapus akun sendiri"
      });
    }

    const [users] = await db.query(
      "SELECT id, role FROM users WHERE id = ?",
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    await db.query(
      "DELETE FROM users WHERE id = ?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "User berhasil dihapus"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// GET /api/users/stats (untuk dashboard)
export const getStats = async (req, res) => {
  try {
    const [total] = await db.query("SELECT COUNT(*) as count FROM users");
    const [admin] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    const [user] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
    const [aktif] = await db.query("SELECT COUNT(*) as count FROM users WHERE status = 'aktif'");
    const [nonaktif] = await db.query("SELECT COUNT(*) as count FROM users WHERE status = 'nonaktif'");

    res.json({
      success: true,
      data: {
        total: total[0].count,
        admin: admin[0].count,
        user: user[0].count,
        aktif: aktif[0].count,
        nonaktif: nonaktif[0].count
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};