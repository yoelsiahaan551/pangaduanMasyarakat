import db from "../config/database.js";
import fs from "fs";
import path from "path";

// GET /api/reports
export const getAll = (req, res) => {
  const { status, category_id } = req.query;
  let sql = `SELECT r.*, u.nama AS pelapor, c.nama AS kategori
             FROM reports r
             JOIN users u ON r.user_id = u.id
             JOIN categories c ON r.category_id = c.id`;
  const params = [];

  const conditions = [];
  if (req.user.role === "user") { conditions.push("r.user_id = ?"); params.push(req.user.id); }
  if (status) { conditions.push("r.status = ?"); params.push(status); }
  if (category_id) { conditions.push("r.category_id = ?"); params.push(category_id); }
  if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY r.created_at DESC";

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    res.json({ data: result });
  });
};

// GET /api/reports/:id
export const getOne = (req, res) => {
  const sql = `SELECT r.*, u.nama AS pelapor, c.nama AS kategori
               FROM reports r
               JOIN users u ON r.user_id = u.id
               JOIN categories c ON r.category_id = c.id
               WHERE r.id = ?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    const report = result[0];
    const sqlComments = `SELECT cm.*, u.nama AS nama_user FROM comments cm
                         JOIN users u ON cm.user_id = u.id
                         WHERE cm.report_id = ? ORDER BY cm.created_at ASC`;
    db.query(sqlComments, [req.params.id], (err2, comments) => {
      if (err2) return res.status(500).json({ message: "Server error", error: err2 });
      res.json({ data: { ...report, comments } });
    });
  });
};

// POST /api/reports
export const create = (req, res) => {
  const { judul, deskripsi, lokasi, category_id } = req.body;
  const gambar = req.file ? req.file.filename : null;

  if (!judul || !deskripsi || !category_id) {
    return res.status(422).json({ message: "Judul, deskripsi, dan kategori wajib diisi" });
  }

  const sql = "INSERT INTO reports (judul, deskripsi, lokasi, gambar, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [judul, deskripsi, lokasi, gambar, req.user.id, category_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    res.status(201).json({ message: "Laporan berhasil dibuat", id: result.insertId });
  });
};

// PUT /api/reports/:id
export const update = (req, res) => {
  db.query("SELECT * FROM reports WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    const report = result[0];
    if (req.user.role === "user" && report.user_id !== req.user.id) {
      return res.status(403).json({ message: "Tidak diizinkan" });
    }

    const { judul, deskripsi, lokasi, category_id, status } = req.body;
    const gambar = req.file ? req.file.filename : report.gambar;

    if (req.file && report.gambar) {
      const oldPath = path.join("src/uploads", report.gambar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const newStatus = req.user.role !== "user" && status ? status : report.status;

    const sql = "UPDATE reports SET judul=?, deskripsi=?, lokasi=?, gambar=?, category_id=?, status=? WHERE id=?";
    db.query(sql, [judul || report.judul, deskripsi || report.deskripsi, lokasi || report.lokasi, gambar, category_id || report.category_id, newStatus, req.params.id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server error", error: err2 });
      res.json({ message: "Laporan berhasil diperbarui" });
    });
  });
};

// DELETE /api/reports/:id
export const remove = (req, res) => {
  db.query("SELECT * FROM reports WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    const report = result[0];
    if (req.user.role === "user" && report.user_id !== req.user.id) {
      return res.status(403).json({ message: "Tidak diizinkan" });
    }

    if (report.gambar) {
      const imgPath = path.join("src/uploads", report.gambar);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    db.query("DELETE FROM reports WHERE id = ?", [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server error", error: err2 });
      res.json({ message: "Laporan berhasil dihapus" });
    });
  });
};

// PATCH /api/reports/:id/status
export const updateStatus = (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(422).json({ message: "Status tidak valid" });
  }
  db.query("UPDATE reports SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    res.json({ message: `Status laporan diubah menjadi ${status}` });
  });
};