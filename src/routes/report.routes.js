// backend/src/routes/report.routes.js
import express from "express";
import multer from "multer";
import path from "path";

import ReportController from "../controllers/report.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js"; // ✅ IMPORT

const router = express.Router();

// ======================================
// MULTER SETUP
// ======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ======================================
// USER ROUTES
// ======================================

router.get("/my", verifyToken, ReportController.getMyReports);
router.get("/my/filter", verifyToken, ReportController.getMyReportsWithFilter);
router.get("/my/stats", verifyToken, ReportController.getUserReportStats);
router.get("/:id", verifyToken, ReportController.getById);
router.put("/:id", verifyToken, ReportController.update);
router.delete("/:id", verifyToken, ReportController.delete);
router.post("/:id/comments", verifyToken, ReportController.addComment);
router.post("/", verifyToken, upload.array("photos", 5), ReportController.create);

// ======================================
// ADMIN ROUTES
// ======================================

router.get("/admin/all", verifyToken, ReportController.getAllReports);
router.get("/admin/dashboard-stats", verifyToken, ReportController.getDashboardStats);
router.patch("/admin/:id/status", verifyToken, ReportController.updateStatus);
router.delete("/admin/:id", verifyToken, ReportController.deleteReport);

// ✅ TAMBAHKAN INI UNTUK ADMIN EDIT
router.put("/admin/:id", verifyToken, roleMiddleware("admin"), ReportController.update);

export default router;