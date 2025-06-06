import { Router } from "express";
import { createFlight, getFlights, getFlightById } from "../controllers/flight.controller";
import { validateFlight } from "../middlewares/validateFlight";
import { authenticate } from "../middlewares/authenticate";

const router = Router();


router.get("/", authenticate, getFlights);      // Protegido: solo usuarios autenticados
router.get("/:id", authenticate, getFlightById);
router.post("/", authenticate, validateFlight, createFlight);

export default router;
