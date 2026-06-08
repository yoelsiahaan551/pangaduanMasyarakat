// backend/src/models/report.model.js
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
        report_number, judul, deskripsi, priority || 'sedang',
        lokasi, rt || null, rw || null, kelurahan || null, kecamatan || null,
        photos ? JSON.stringify(photos) : null,
        user_id, category_id,
      ]
    );
    
    return { insertId: result.insertId, report_number };
  },
  
  async findByUserId(user_id, filters = {}) {
    let query = `
      SELECT 
        r.*, 
        c.nama as category_name, 
        c.kode as category_kode
      FROM reports r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.user_id = ?
    `;
    const params = [user_id];
    
    // Filter by status
    if (filters.status && filters.status !== 'Semua') {
      if (filters.status === 'Diproses') {
        query += ` AND r.status IN ('pending', 'diproses')`;
      } else if (filters.status === 'Selesai') {
        query += ` AND r.status = 'selesai'`;
      } else if (filters.status === 'Ditolak') {
        query += ` AND r.status = 'ditolak'`;
      }
    }
    
    // Filter by search
    if (filters.search) {
      query += ` AND (r.judul LIKE ? OR r.report_number LIKE ? OR c.nama LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ` ORDER BY r.created_at DESC`;
    
    // Add pagination
    if (filters.limit) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(filters.limit), parseInt(filters.offset) || 0);
    }
    
    const [rows] = await db.query(query, params);
    return rows;
  },
  
  async findById(id) {
    const [rows] = await db.query(
      `SELECT 
        r.*, 
        c.nama as category_name, 
        c.kode as category_kode,
        u.nama as user_name, 
        u.email as user_email
       FROM reports r
       LEFT JOIN categories c ON r.category_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );
    
    if (rows[0] && rows[0].photos && typeof rows[0].photos === 'string') {
      try {
        rows[0].photos = JSON.parse(rows[0].photos);
      } catch (e) {
        rows[0].photos = [];
      }
    }
    
    return rows[0];
  },
  
  async findAll(filters = {}) {
    let query = `
      SELECT 
        r.*, 
        c.nama as category_name,
        u.nama as user_name,
        u.email as user_email
      FROM reports r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (filters.status && filters.status !== 'Semua') {
      if (filters.status === 'Diproses') {
        query += ` AND r.status IN ('pending', 'diproses')`;
      } else {
        query += ` AND r.status = ?`;
        params.push(filters.status.toLowerCase());
      }
    }
    
    if (filters.priority && filters.priority !== 'Semua') {
      query += ` AND r.priority = ?`;
      params.push(filters.priority);
    }
    
    if (filters.category_id) {
      query += ` AND r.category_id = ?`;
      params.push(filters.category_id);
    }
    
    if (filters.search) {
      query += ` AND (r.judul LIKE ? OR r.report_number LIKE ? OR u.nama LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ` ORDER BY r.created_at DESC`;
    
    if (filters.limit) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(filters.limit), parseInt(filters.offset) || 0);
    }
    
    const [rows] = await db.query(query, params);
    return rows;
  },
  
  async updateStatus(id, status, admin_notes = null) {
    const [result] = await db.query(
      `UPDATE reports SET status = ?, admin_notes = ? WHERE id = ?`,
      [status, admin_notes, id]
    );
    return result.affectedRows > 0;
  },
  
  async getUserStats(user_id) {
    const [total] = await db.query(
      `SELECT COUNT(*) as count FROM reports WHERE user_id = ?`,
      [user_id]
    );
    
    const [diproses] = await db.query(
      `SELECT COUNT(*) as count FROM reports WHERE user_id = ? AND status IN ('pending', 'diproses')`,
      [user_id]
    );
    
    const [selesai] = await db.query(
      `SELECT COUNT(*) as count FROM reports WHERE user_id = ? AND status = 'selesai'`,
      [user_id]
    );
    
    const [ditolak] = await db.query(
      `SELECT COUNT(*) as count FROM reports WHERE user_id = ? AND status = 'ditolak'`,
      [user_id]
    );
    
    return {
      total: total[0].count,
      diproses: diproses[0].count,
      selesai: selesai[0].count,
      ditolak: ditolak[0].count,
    };
  },
  
  async getStats() {
    const [total] = await db.query(`SELECT COUNT(*) as count FROM reports`);
    const [pending] = await db.query(`SELECT COUNT(*) as count FROM reports WHERE status = 'pending'`);
    const [diproses] = await db.query(`SELECT COUNT(*) as count FROM reports WHERE status = 'diproses'`);
    const [selesai] = await db.query(`SELECT COUNT(*) as count FROM reports WHERE status = 'selesai'`);
    const [ditolak] = await db.query(`SELECT COUNT(*) as count FROM reports WHERE status = 'ditolak'`);
    const [urgent] = await db.query(`SELECT COUNT(*) as count FROM reports WHERE priority = 'tinggi' AND status NOT IN ('selesai', 'ditolak')`);
    const [users] = await db.query(`SELECT COUNT(*) as count FROM users WHERE role = 'user'`);
    
    const [byCategory] = await db.query(`
      SELECT c.nama as category_name, c.kode, COUNT(r.id) as count
      FROM categories c
      LEFT JOIN reports r ON c.id = r.category_id
      GROUP BY c.id
    `);
    
    return {
      total: total[0].count,
      pending: pending[0].count,
      diproses: diproses[0].count,
      selesai: selesai[0].count,
      ditolak: ditolak[0].count,
      urgent: urgent[0].count,
      totalUsers: users[0].count,
      byCategory,
    };
  },
  
  async getRecent(limit = 5) {
    const [rows] = await db.query(
      `SELECT r.*, c.nama as category_name, u.nama as user_name
       FROM reports r
       LEFT JOIN categories c ON r.category_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },
  
  async getUrgentReports(limit = 10) {
    const [rows] = await db.query(
      `SELECT r.*, c.nama as category_name, u.nama as user_name
       FROM reports r
       LEFT JOIN categories c ON r.category_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.priority = 'tinggi' AND r.status NOT IN ('selesai', 'ditolak')
       ORDER BY r.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },
  
  async addComment(report_id, user_id, isi) {
    const [result] = await db.query(
      `INSERT INTO comments (report_id, user_id, isi) VALUES (?, ?, ?)`,
      [report_id, user_id, isi]
    );
    return result.insertId;
  },
  
  async delete(id) {
    const [result] = await db.query(`DELETE FROM reports WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  },
};

export default ReportModel;