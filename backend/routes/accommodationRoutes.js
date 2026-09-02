import express from "express";
import {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} from "../controllers/accommodationController.js";
import { protect, hostOnly } from "../middleware/auth.js";

const router = express.Router();

// Public routes — anyone can browse listings
router.get("/", getAccommodations);
router.get("/:id", getAccommodationById);

// Protected host-only routes — requires a valid JWT AND the "host" role
router.post("/", protect, hostOnly, createAccommodation);
router.put("/:id", protect, hostOnly, updateAccommodation);
router.delete("/:id", protect, hostOnly, deleteAccommodation);

export default router;
