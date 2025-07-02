import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { deleteUserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/", authenticate, getUsers);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteUserController
);

export default router;
