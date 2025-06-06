import { Request, Response } from "express";
import mongoose from "mongoose";
import Flight from "../models/Flight";
import { FlightZodSchema } from "../validation/flight.schema";
import { ALLOWED_SORT_FIELDS } from "../constants/sortFields";
import { number } from "zod/v4";

// Seguridad extra: Sanea strings y evita inyección de objetos
const sanitizeInput = (data: any) => JSON.parse(JSON.stringify(data));


export async function createFlight(req: Request, res: Response): Promise<void> {
  // Validación con Zod
  const result = FlightZodSchema.safeParse(req.body);
  const flightCapacity = req.body.capacity ? parseInt(req.body.capacity) : 0;
  const len_Passengers = req.body.passengers ? req.body.passengers.length : 0;


  if (flightCapacity > len_Passengers) {
    const lista_Black: string[] = [];
    const lista_Platinum: string[] = [];
    const lista_Gold: string[] = [];
    const lista_Normal: string[] = [];

    const lista_Family: string[] = [];
    const lista_Reservations_id: string[] = [];

    for (let i = 0; i < len_Passengers; i++) {
      const passenger = req.body.passengers[i];
      lista_Reservations_id.push(passenger.reservationId);
    }
    const conteo: Record<string, number> = {};

    for (const item of lista_Reservations_id) {
      conteo[item] = (conteo[item] || 0) + 1;
    }

    // Mostrar los elementos duplicados
  for (const [elemento, cantidad] of Object.entries(conteo)) {
    if (cantidad > 1) {
      lista_Family.push(elemento);
    }
  }

  // Código único alfanumérico que se genera cuando se compran varios pasajes juntos, por ejemplo: una familia de 4 integrantes que compra todos sus pasajes juntos tiene el mismo código
  // Si hay más de un pasajero con el mismo código, se considera que son parte de la misma familia
  // contar elementos repetidos en un array

  // Recorre los pasajeros y clasifícalos
  for (let i = 0; i < len_Passengers; i++) {
    const passenger = req.body.passengers[i];
    // Black > Platinum > Gold > Normal
    if (
      passenger.flightCategory === "Black" &&
      lista_Black.length < flightCapacity &&
      passenger.hasConnections === true &&
      lista_Family.includes(passenger.reservationId) &&
      passenger.hasCheckedBaggage === true &&
      passenger.age >= 18
    ) {
      lista_Black.push(passenger);
    } else if (
      passenger.flightCategory === "Platinum" &&
      passenger.hasConnections === true &&
      lista_Family.includes(passenger.reservationId) &&
      passenger.hasCheckedBaggage === true &&
      passenger.age >= 18
    ) {
      lista_Platinum.push(passenger);
    } else if (
      passenger.flightCategory === "Gold" &&
      passenger.hasConnections === true &&
      lista_Family.includes(passenger.reservationId) &&
      passenger.hasCheckedBaggage === true &&
      passenger.age >= 18
    ) {
      lista_Gold.push(passenger);
    } else if (
      passenger.flightCategory === "Normal" &&
      passenger.hasConnections === true &&
      lista_Family.includes(passenger.reservationId) &&
      passenger.hasCheckedBaggage === true &&
      passenger.age >= 18
    ) {
      lista_Normal.push(passenger);
    }
  }

  // Ahora tienes los pasajeros clasificados en sus listas correspondientes:
  // lista_Black, lista_Platinum, lista_Gold, lista_Normal

} else {
  return;
}


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
    // Soporta paginación: ?page=1&limit=20
    const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
    const limit = Math.max(1, parseInt(req.query['limit'] as string) || 20);

    const filter: any = {};
    if (req.query['flightCode']) filter.flightCode = req.query['flightCode'];

    // VALIDACIÓN Y USO DE SORT
    let sort: any = {};
    if (req.query['sort']) {
      const sortFieldRaw = req.query['sort'] as string;
      const desc = sortFieldRaw.startsWith("-");
      const sortField = desc ? sortFieldRaw.slice(1) : sortFieldRaw;

      if (ALLOWED_SORT_FIELDS.includes(sortField)) {
        sort[sortField] = desc ? -1 : 1;
      } else {
        res.status(400).json({ error: `Campo de ordenamiento no permitido: ${sortField}` });
        return;
      }
    }

    const flights = await Flight.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Flight.countDocuments(filter);

    res.status(200).json({
      flights,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
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
