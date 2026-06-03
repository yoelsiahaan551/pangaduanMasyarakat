import db from "../config/database.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Total laporan
    const [totalResult] = await db.query("SELECT COUNT(*) as total FROM reports");
    
    // Status counts
    const [statusResult] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM reports 
      GROUP BY status
    `);
    
    // Laporan per hari (7 hari terakhir)
    const [dailyResult] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total
      FROM reports 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    
    // Total users
    const [usersResult] = await db.query("SELECT COUNT(*) as total FROM users WHERE role = 'user'");
    
    // Total comments
    const [commentsResult] = await db.query("SELECT COUNT(*) as total FROM comments");
    
    const statusMap = {
      pending: 0,
      diproses: 0,
      selesai: 0,
      ditolak: 0
    };
    
    statusResult.forEach(item => {
      statusMap[item.status] = item.count;
    });
    
    return res.status(200).json({
      success: true,
      data: {
        total_reports: totalResult[0].total,
        pending: statusMap.pending,
        diproses: statusMap.diproses,
        selesai: statusMap.selesai,
        ditolak: statusMap.ditolak,
        total_users: usersResult[0].total,
        total_comments: commentsResult[0].total,
        daily_reports: dailyResult
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};