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
        created_at
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
        created_at
      FROM users
      WHERE id = ?
    `,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
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
        message: "User tidak ditemukan"
      });
    }

    const user = users[0];

    const {
      nama,
      email,
      password,
      role
    } = req.body;

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
        role = ?
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
      message: "User berhasil diperbarui"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// DELETE /api/users/:id
export const remove = async (req, res) => {
  try {
    if (req.user.id === Number(req.params.id)) {
      return res.status(400).json({
        message: "Tidak bisa menghapus akun sendiri"
      });
    }

    const [users] = await db.query(
      "SELECT id FROM users WHERE id = ?",
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    await db.query(
      "DELETE FROM users WHERE id = ?",
      [req.params.id]
    );

    res.json({
      message: "User berhasil dihapus"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};