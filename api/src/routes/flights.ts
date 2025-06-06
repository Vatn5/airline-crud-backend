import { Router } from "express";
import { createFlight } from "../controllers/flight.controller.js";
import { validateFlight } from "../middlewares/validateFlight.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/", authenticate, validateFlight, createFlight);

export default router;
