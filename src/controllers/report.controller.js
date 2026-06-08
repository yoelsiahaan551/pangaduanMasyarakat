// backend/src/controllers/report.controller.js
import ReportModel from "../models/report.model.js";

const ReportController = {
  async create(req, res) {
    try {
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);
      
      // ✅ PERBAIKAN: Terima photos dari body (JSON) atau dari files (upload)
      let photos = [];
      
      // Cek apakah photos dikirim sebagai JSON string dari frontend
      if (req.body.photos) {
        try {
          // Jika photos adalah string JSON, parse
          if (typeof req.body.photos === 'string') {
            photos = JSON.parse(req.body.photos);
          } 
          // Jika photos sudah berupa array
          else if (Array.isArray(req.body.photos)) {
            photos = req.body.photos;
          }
        } catch (e) {
          console.log("Error parsing photos:", e);
          photos = [];
        }
      }
      
      // Jika ada file upload (dari form data dengan file)
      if (req.files && req.files.length > 0) {
        const uploadedPhotos = req.files.map(file => `/uploads/${file.filename}`);
        photos = [...photos, ...uploadedPhotos];
      }
      
      const data = {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        category_id: req.body.category_id,
        priority: req.body.priority || 'sedang',
        lokasi: req.body.lokasi,
        rt: req.body.rt || null,
        rw: req.body.rw || null,
        kelurahan: req.body.kelurahan || null,
        kecamatan: req.body.kecamatan || null,
        photos: photos, // ✅ Sekarang bisa menerima URL dari Supabase atau file upload
        user_id: req.user.id,
      };
      
      console.log("Data to save:", data);
      
      const result = await ReportModel.create(data);
      
      return res.status(201).json({
        success: true,
        message: "Laporan berhasil dibuat",
        data: result,
      });
    } catch (error) {
      console.error("Create report error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  async getMyReports(req, res) {
    try {
      const reports = await ReportModel.findByUserId(req.user.id);
      return res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      console.error("Get my reports error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  // GET MY REPORTS WITH FILTER (untuk 4 button)
  async getMyReportsWithFilter(req, res) {
    try {
      const { status, search, limit, page } = req.query;
      
      const reports = await ReportModel.findByUserId(req.user.id, {
        status,
        search,
        limit: limit || 50,
        offset: ((page || 1) - 1) * (limit || 50),
      });
      
      // Get counts for each tab
      const allReports = await ReportModel.findByUserId(req.user.id);
      const counts = {
        Semua: allReports.length,
        Diproses: allReports.filter(r => ['pending', 'diproses'].includes(r.status)).length,
        Selesai: allReports.filter(r => r.status === 'selesai').length,
        Ditolak: allReports.filter(r => r.status === 'ditolak').length,
      };
      
      return res.status(200).json({
        success: true,
        data: reports,
        counts: counts,
        pagination: {
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 50,
          total: reports.length,
        },
      });
    } catch (error) {
      console.error("Get my reports with filter error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  async getById(req, res) {
    try {
      const report = await ReportModel.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan",
        });
      }
      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error("Get by id error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  async getAllReports(req, res) {
    try {
      const { status, priority, category_id, search, limit, page } = req.query;
      
      const reports = await ReportModel.findAll({
        status,
        priority,
        category_id,
        search,
        limit: limit || 50,
        offset: ((page || 1) - 1) * (limit || 50),
      });
      
      return res.status(200).json({
        success: true,
        data: reports,
        total: reports.length,
      });
    } catch (error) {
      console.error("Get all reports error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  async updateStatus(req, res) {
    try {
      const success = await ReportModel.updateStatus(
        req.params.id,
        req.body.status,
        req.body.admin_notes
      );
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan",
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Status berhasil diupdate",
      });
    } catch (error) {
      console.error("Update status error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  // GET DASHBOARD STATS (untuk admin)
  async getDashboardStats(req, res) {
    try {
      const stats = await ReportModel.getStats();
      const recent = await ReportModel.getRecent(5);
      const urgent = await ReportModel.getUrgentReports(5);
      
      return res.status(200).json({
        success: true,
        data: {
          stats,
          recent,
          urgent,
        },
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  // GET USER REPORT STATS (untuk dashboard user)
  async getUserReportStats(req, res) {
    try {
      const stats = await ReportModel.getUserStats(req.user.id);
      
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Get user report stats error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  // ADD COMMENT TO REPORT
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const { isi } = req.body;
      
      // Check if report exists
      const report = await ReportModel.findById(id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan",
        });
      }
      
      const commentId = await ReportModel.addComment(id, req.user.id, isi);
      
      return res.status(201).json({
        success: true,
        message: "Komentar berhasil ditambahkan",
        data: { id: commentId },
      });
    } catch (error) {
      console.error("Add comment error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  // DELETE REPORT (admin only)
  async deleteReport(req, res) {
    try {
      const success = await ReportModel.delete(req.params.id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan",
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Laporan berhasil dihapus",
      });
    } catch (error) {
      console.error("Delete report error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

export default ReportController;