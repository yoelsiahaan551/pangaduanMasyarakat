import { Router } from "express";
import {
  getAll,
  getOne,
  update,
  remove
} from "../controllers/user.controller.js";

import verifyToken from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

// Admin bisa melihat semua user
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  getAll
);

// Admin bisa melihat detail user
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  getOne
);

// Admin bisa mengubah user
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  update
);

// Admin bisa menghapus user
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  remove
);

export default router;