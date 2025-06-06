import { z } from "zod";
import { PassengerZodSchema } from "./passenger.schema";
import { ca } from "zod/v4/locales";

export const FlightZodSchema = z.object({
  flightCode: z.string(), // min(3).max(10) if needed
  capacity: z.number().int().min(1, "La capacidad debe ser al menos 1"),
  passengers: z.array(PassengerZodSchema).min(1, "Se debe incluir al menos un pasajero"), 
});
export type FlightInput = z.infer<typeof FlightZodSchema>;
