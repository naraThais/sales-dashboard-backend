import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  getProducts,
  createProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller";

const router = Router();

// Listar com paginação e filtro
router.get("/", getProducts);

router.post(
  "/",
  authenticate,
  upload.single("image"),
  authorizeRoles("admin"),
  createProductController
);

router.put(
  "/:id",
  authenticate,
  upload.single("image"),
  authorizeRoles("admin"),
  updateProductController
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteProductController
);

export default router;
