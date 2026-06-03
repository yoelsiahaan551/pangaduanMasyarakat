import express from "express";
import multer from "multer";
import path from "path";

import ReportController from "../controllers/report.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================
// MULTER SETUP
// ======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ======================================
// USER ROUTES
// ======================================

// GET MY REPORTS
router.get(
  "/my",
  verifyToken,
  ReportController.getMyReports
);

// GET DETAIL REPORT
router.get(
  "/:id",
  verifyToken,
  ReportController.getById
);

// CREATE REPORT
router.post(
  "/",
  verifyToken,
  upload.array("photos", 5),
  ReportController.create
);

// ======================================
// ADMIN ROUTES
// ======================================

// GET ALL REPORTS
router.get(
  "/admin/all",
  verifyToken,
  ReportController.getAllReports
);

// UPDATE STATUS
router.patch(
  "/admin/:id/status",
  verifyToken,
  ReportController.updateStatus
);

export default router;