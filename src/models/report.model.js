// 🔥 PERUBAHAN: Path yang benar
import db from "../../db.js";

function generateReportNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ADU-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const ReportModel = {
  async create(data) {
    const {
      user_id,
      category_id,
      judul,
      deskripsi,
      priority,
      lokasi,
      rt,
      rw,
      kelurahan,
      kecamatan,
      photos,
    } = data;
    
    let report_number = generateReportNumber();
    
    const [result] = await db.query(
      `INSERT INTO reports (
        report_number, judul, deskripsi, priority,
        lokasi, rt, rw, kelurahan, kecamatan,
        photos, status, user_id, category_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        report_number, judul, deskripsi, priority,
        lokasi, rt || null, rw || null, kelurahan || null, kecamatan || null,
        JSON.stringify(photos || []),
        user_id, category_id,
      ]
    );
    
    return { insertId: result.insertId, report_number };
  },
  
  async findByUserId(user_id) {
    const [rows] = await db.query(
      `SELECT r.*, c.nama as category_name 
       FROM reports r
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
      [user_id]
    );
    return rows;
  },
  
  async findById(id) {
    const [rows] = await db.query(
      `SELECT r.*, c.nama as category_name, c.kode as category_kode,
              u.nama as user_name, u.email as user_email
       FROM reports r
       LEFT JOIN categories c ON r.category_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0];
  },
  
  async findAll(filters = {}) {
    let query = `
      SELECT r.*, c.nama as category_name, u.nama as user_name
      FROM reports r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },
  
  async updateStatus(id, status, admin_notes = null) {
    const [result] = await db.query(
      "UPDATE reports SET status = ?, admin_notes = ? WHERE id = ?",
      [status, admin_notes, id]
    );
    return result.affectedRows > 0;
  },
};

export default ReportModel;