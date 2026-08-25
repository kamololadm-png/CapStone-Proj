import express from "express";
import {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} from "../controllers/accommodationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAccommodations);
router.get("/:id", getAccommodationById);
router.post("/", protect, createAccommodation);
router.put("/:id", protect, updateAccommodation);
router.delete("/:id", protect, deleteAccommodation);

export default router;