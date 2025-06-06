import { Router } from "express";
import { createFlight, getFlights, getFlightById,
     updateFlight, patchFlight, deleteFlight } from "../controllers/flight.controller";
import { validateFlight } from "../middlewares/validateFlight";
import { authenticate } from "../middlewares/authenticate";

const router = Router();


router.get("/", authenticate, getFlights);      // Protegido: solo usuarios autenticados
router.get("/:id", authenticate, getFlightById); // Obtener vuelo por ID con autenticación
router.post("/", authenticate, validateFlight, createFlight); // Crear vuelo con validación
router.put("/:id", authenticate, validateFlight, updateFlight); // Actualizar vuelo todos los campos por ID
router.patch("/:id", authenticate, patchFlight); // Actualizar parcialmente vuelo por ID
router.delete("/:id", authenticate, deleteFlight); // Borrar vuelo por ID


export default router;
