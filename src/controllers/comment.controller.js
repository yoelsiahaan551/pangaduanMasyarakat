import db from "../config/database.js";

// POST /api/reports/:report_id/comments
export const create = (req, res) => {
  const { isi } = req.body;
  if (!isi || !isi.trim()) {
    return res.status(422).json({ message: "Isi komentar wajib diisi" });
  }

  db.query("SELECT id FROM reports WHERE id = ?", [req.params.report_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Laporan tidak ditemukan" });

    const sql = "INSERT INTO comments (isi, report_id, user_id) VALUES (?, ?, ?)";
    db.query(sql, [isi.trim(), req.params.report_id, req.user.id], (err2, result2) => {
      if (err2) return res.status(500).json({ message: "Server error", error: err2 });
      res.status(201).json({ message: "Komentar berhasil ditambahkan", id: result2.insertId });
    });
  });
};

// DELETE /api/comments/:id
export const remove = (req, res) => {
  db.query("SELECT * FROM comments WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Komentar tidak ditemukan" });

    const comment = result[0];
    if (req.user.role === "user" && comment.user_id !== req.user.id) {
      return res.status(403).json({ message: "Tidak diizinkan menghapus komentar ini" });
    }

    db.query("DELETE FROM comments WHERE id = ?", [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server error", error: err2 });
      res.json({ message: "Komentar berhasil dihapus" });
    });
  });
};