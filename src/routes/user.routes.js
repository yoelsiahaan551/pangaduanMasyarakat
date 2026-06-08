// backend/src/routes/user.routes.js
import { Router } from "express";
import {
  getAll,
  getOne,
  createUser,
  update,
  updateStatus,
  remove,
  getStats
} from "../controllers/user.controller.js";

import verifyToken from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

// ======================================
// ADMIN ONLY ROUTES
// ======================================

// Get all users
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  getAll
);

// Get user stats (total, admin, user, aktif, nonaktif)
router.get(
  "/stats",
  verifyToken,
  authorizeRoles("admin"),
  getStats
);

// Get single user detail
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  getOne
);

// 🆕 Create new user (admin can create user or admin)
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  createUser
);

// Update user
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  update
);

// 🆕 Update user status (aktif/nonaktif)
router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin"),
  updateStatus
);

// Delete user
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  remove
);

export default router;