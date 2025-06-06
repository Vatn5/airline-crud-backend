import { Request, Response, NextFunction } from "express";
import { FlightZodSchema } from "../validation/flight.schema.js";

// Valida y corta la cadena si los datos son incorrectos
export function validateFlight(req: Request, res: Response, next: NextFunction): void {
  const result = FlightZodSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.format() });
    return;
  }
  // Puedes sobreescribir el body si quieres asegurarte de que está limpio:
  req.body = result.data;
  next();
}
