import { Request, Response } from "express";
import mongoose from "mongoose";
import Flight from "../models/Flight";
import { FlightZodSchema } from "../validation/flight.schema";

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

export async function getFlights(req: Request, res: Response): Promise<void> {
  try {
    // Puedes agregar filtros, paginación, etc.
    const flights = await Flight.find().lean();
    res.status(200).json({ flights });
    return;
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
    return;
  }
}

export const getFlightById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Validar el formato antes de buscar
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    const flight = await Flight.findById(id);
    if (!flight) {
      res.status(404).json({ error: "Vuelo no encontrado" });
      return;
    }
    res.json(flight);
    return;
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
    return; 
  }
}

export const updateFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Valida el ID como antes
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    const flight = await Flight.findByIdAndUpdate(id, req.body, { new: true, overwrite: true, runValidators: true });
    if (!flight) {
      res.status(404).json({ error: "Vuelo no encontrado" });
      return;
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el vuelo" });
  }
};

export const patchFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    const flight = await Flight.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!flight) {
      res.status(404).json({ error: "Vuelo no encontrado" });
      return;
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el vuelo" });
  }
};

export const deleteFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    const flight = await Flight.findByIdAndDelete(id);
    if (!flight) {
      res.status(404).json({ error: "Vuelo no encontrado" });
      return;
    }
    res.json({ message: "Vuelo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el vuelo" });
  }
};
