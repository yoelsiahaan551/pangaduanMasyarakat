import bcrypt from "bcryptjs";
import db from "../config/database.js";

// GET /api/users
export const getAll = (req, res) => {
  const sql = "SELECT id, nama, email, role, foto_profil, created_at FROM users ORDER BY created_at DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    res.json({ data: result });
  });
};

// GET /api/users/:id
export const getOne = (req, res) => {
  const sql = "SELECT id, nama, email, role, foto_profil, created_at FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ data: result[0] });
  });
};

// PUT /api/users/:id
export const update = (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    const user = result[0];
    const { nama, email, password, role } = req.body;
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : user.password;

    const sql = "UPDATE users SET nama=?, email=?, password=?, role=? WHERE id=?";
    db.query(sql, [nama || user.nama, email || user.email, hashedPassword, role || user.role, req.params.id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server error", error: err2 });
      res.json({ message: "User berhasil diperbarui" });
    });
  });
};

// DELETE /api/users/:id
export const remove = (req, res) => {
  if (req.user.id === parseInt(req.params.id)) {
    return res.status(400).json({ message: "Tidak bisa menghapus akun sendiri" });
  }
  db.query("SELECT id FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server error", error: err2 });
      res.json({ message: "User berhasil dihapus" });
    });
  });
};  