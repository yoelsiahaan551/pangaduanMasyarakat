import ReportModel from "../models/report.model.js";

const ReportController = {
  async create(req, res) {
    try {
      const data = {
        ...req.body,
        user_id: req.user.id,
        photos: req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [],
      };
      
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
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  
  async getAllReports(req, res) {
    try {
      const reports = await ReportModel.findAll(req.query);
      return res.status(200).json({
        success: true,
        data: reports,
        total: reports.length,
      });
    } catch (error) {
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
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

export default ReportController;