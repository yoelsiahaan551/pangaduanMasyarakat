import { Router } from "express";
import { getAll, getOne, update, remove } from "../controllers/user.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = Router();

router.get("/", verifyToken, authorizeRoles("super_admin"), getAll);
router.get("/:id", verifyToken, authorizeRoles("super_admin"), getOne);
router.put("/:id", verifyToken, authorizeRoles("super_admin"), update);
router.delete("/:id", verifyToken, authorizeRoles("super_admin"), remove);

export default router;