// Routes for authenticated business users to manage their business profile and status

import express from "express";
import multer from "multer";
import { createBusiness } from "../controllers/businessCreateController.mjs";
import { updateBusiness } from "../controllers/businessUpdateController.mjs";
import {
  getAllBusinesses,
  getBusinessById,
} from "../controllers/businessRetrieveController.mjs";
import { deleteBusiness } from "../controllers/businessDeleteController.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import roleAuthorization from "../middleware/roleAuthMiddleware.mjs";
import {
  deactivateBusiness,
  activateBusiness,
} from "../controllers/businessStatusController.mjs";

const router = express.Router();
const upload = multer(); // Multer instance for handling file uploads

// CRUD Operations
router.post(
  "/api/createbusiness",
  authenticateToken,
  roleAuthorization(["Business"]),
  upload.single("cover_photo"),
  createBusiness
);
router.get(
  "/api/businesses",
  authenticateToken,
  roleAuthorization(["Business"]),
  getAllBusinesses
);
router.get("/api/business/:id", authenticateToken, getBusinessById);
router.put(
  "/api/updatebusiness/:id",
  authenticateToken,
  roleAuthorization(["Business"]),
  upload.single("cover_photo"),
  updateBusiness
);
router.delete(
  "/api/deletebusiness/:id",
  authenticateToken,
  roleAuthorization(["Business"]),
  deleteBusiness
);
router.put(
  "/api/business/deactivate/:id",
  authenticateToken,
  roleAuthorization(["Business"]),
  deactivateBusiness
);
router.put(
  "/api/business/activate/:id",
  authenticateToken,
  roleAuthorization(["Business"]),
  activateBusiness
);

export default router;
