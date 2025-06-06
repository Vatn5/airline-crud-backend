import { Router } from "express";
import { createFlight, getFlights } from "../controllers/flight.controller.js";
import { validateFlight } from "../middlewares/validateFlight.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();


router.get("/", authenticate, getFlights);      // Protegido: solo usuarios autenticados
router.post("/", authenticate, validateFlight, createFlight);

export default router;
