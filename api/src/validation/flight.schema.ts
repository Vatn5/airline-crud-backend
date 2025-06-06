import { z } from "zod";
import { PassengerZodSchema } from "./passenger.schema";

export const FlightZodSchema = z.object({
  flightCode: z.string(), // min(3).max(10) if needed
  passengers: z.array(PassengerZodSchema).min(1, "Se debe incluir al menos un pasajero"), 
});
export type FlightInput = z.infer<typeof FlightZodSchema>;
