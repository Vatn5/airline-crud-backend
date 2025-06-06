import { Request, Response } from "express";
import Flight from "../models/Flight.js";
import { FlightZodSchema } from "../validation/flight.schema.js";

// Seguridad extra: Sanea strings y evita inyección de objetos
const sanitizeInput = (data: any) => JSON.parse(JSON.stringify(data));


export async function createFlight(req: Request, res: Response): Promise<void> {
  // Validación con Zod
  const result = FlightZodSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.format() });  // <-- ¡Siempre return!
    return;
  }

  try {
    const existing = await Flight.findOne({ flightCode: result.data.flightCode });
    if (existing) {
      res.status(409).json({ error: "El código de vuelo ya existe." }); // <-- ¡Siempre return!
      return;
    }

    const flight = new Flight(result.data);
    await flight.save();

    res.status(201).json({
      message: "Vuelo creado con éxito",
      flight: flight.toObject(),
    }); // <-- ¡Siempre return!
    return;
  } catch (error) {
    // NO devuelvas detalles internos
    res.status(500).json({ error: "Error interno del servidor" }); // <-- ¡Siempre return!
    return;
  }
}
