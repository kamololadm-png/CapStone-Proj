import express from "express";
import {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
} from "../controllers/reservationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createReservation);
router.get("/host", protect, getReservationsByHost);
router.get("/user", protect, getReservationsByUser);
router.delete("/:id", protect, deleteReservation);

export default router;