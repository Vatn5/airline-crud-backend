import { z } from "zod";

export const PassengerZodSchema = z.object({
  id: z.number(),
  name: z.string(),
  hasConnections: z.boolean(),
  age: z.number(),
  flightCategory: z.enum(["Black", "Platinum", "Gold", "Normal"]),
  reservationId: z.string(),
  hasCheckedBaggage: z.boolean(),
});
export type PassengerInput = z.infer<typeof PassengerZodSchema>;
