// backend/src/controllers/report.controller.js
import ReportModel from "../models/report.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ReportController = {
  async create(req, res) {
    try {
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);
      
      let photos = [];
      
      // ✅ PROSES BASE64 DARI MOBILE
      if (req.body.photos) {
        try {
          let photoArray = req.body.photos;
          if (typeof req.body.photos === 'string') {
            photoArray = JSON.parse(req.body.photos);
          }
          
          for (let i = 0; i < photoArray.length; i++) {
            const photo = photoArray[i];
            
            if (typeof photo === 'string' && photo.startsWith('data:image')) {
              const matches = photo.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
              if (matches) {
                let ext = matches[1];
                if (ext === 'jpeg') ext = 'jpg';
                const fileName = `${Date.now()}_${i}.${ext}`;
                const uploadDir = path.join(__dirname, '../uploads');
                
                if (!fs.existsSync(uploadDir)) {
                  fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, matches[2], 'base64');
                photos.push(`/uploads/${fileName}`);
                console.log(`✅ Foto saved: ${fileName}`);
              }
            } else if (typeof photo === 'string') {
              photos.push(photo);
            }
          }
        } catch (e) {
          console.log("Error parsing photos:", e);
        }
      }
      
      // ✅ PROSES FILE UPLOAD DARI WEB
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
        photos: photos,
        user_id: req.user.id,
      };
      
      console.log("Data to save:", { ...data, photos: photos.length });
      
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
  
  async getMyReportsWithFilter(req, res) {
    try {
      const { status, search, limit, page } = req.query;
      
      const reports = await ReportModel.findByUserId(req.user.id, {
        status,
        search,
        limit: limit || 50,
        offset: ((page || 1) - 1) * (limit || 50),
      });
      
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
  
  // ✅ TAMBAHKAN METHOD UPDATE (User edit miliknya sendiri)
  async update(req, res) {
    try {
      const report = await ReportModel.findById(req.params.id);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan"
        });
      }
      
      // Cek apakah user pemilik laporan atau admin
      if (report.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses untuk mengedit laporan ini"
        });
      }
      
      const updated = await ReportModel.update(req.params.id, {
        judul: req.body.judul,
        deskripsi: req.body.deskripsi,
        lokasi: req.body.lokasi,
        rt: req.body.rt,
        rw: req.body.rw,
        kelurahan: req.body.kelurahan,
        kecamatan: req.body.kecamatan,
      });
      
      const updatedReport = await ReportModel.findById(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: "Laporan berhasil diperbarui",
        data: updatedReport
      });
    } catch (error) {
      console.error("Update report error:", error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },
  
  // ✅ TAMBAHKAN METHOD DELETE (User hapus miliknya sendiri)
  async delete(req, res) {
    try {
      const report = await ReportModel.findById(req.params.id);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan"
        });
      }
      
      // Cek apakah user pemilik laporan atau admin
      if (report.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Anda tidak memiliki akses untuk menghapus laporan ini"
        });
      }
      
      const success = await ReportModel.delete(req.params.id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Laporan tidak ditemukan"
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Laporan berhasil dihapus"
      });
    } catch (error) {
      console.error("Delete report error:", error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },
  
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
  
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const { isi } = req.body;
      
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
  
  // Method deleteReport untuk admin (sudah ada)
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