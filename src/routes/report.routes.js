import { Router } from "express";
import { getAll, getOne, create, update, remove, updateStatus } from "../controllers/report.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getOne);
router.post("/", verifyToken, upload.single("gambar"), create);
router.put("/:id", verifyToken, upload.single("gambar"), update);
router.delete("/:id", verifyToken, remove);
router.patch("/:id/status", verifyToken, authorizeRoles("admin", "super_admin"), updateStatus);

export default router;