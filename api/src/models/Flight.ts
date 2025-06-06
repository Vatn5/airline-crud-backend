import { Schema, model, Document } from "mongoose";

// Interfaz de TypeScript solo para Mongoose
export interface Passenger {
  id: number;
  name: string;
  hasConnections: boolean;
  age: number;
  flightCategory: "Black" | "Platinum" | "Gold" | "Normal";
  reservationId: string;
  hasCheckedBaggage: boolean;
}

export interface FlightDocument extends Document {
  flightCode: string;
  capacity: number;
  passengers: Passenger[];
}

// Subdocumento Passenger (Mongoose schema)
const PassengerSchema = new Schema<Passenger>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    hasConnections: { type: Boolean, required: true },
    age: { type: Number, required: true },
    flightCategory: { type: String, enum: ["Black", "Platinum", "Gold", "Normal"], required: true },
    reservationId: { type: String, required: true },
    hasCheckedBaggage: { type: Boolean, required: true }
  },
  { _id: false }
);

// Modelo principal Flight
const FlightSchema = new Schema<FlightDocument>({
  flightCode: { type: String, required: true },
  capacity: { type: Number, required: true },
  passengers: { type: [PassengerSchema], required: true }
});

const Flight = model<FlightDocument>("Flight", FlightSchema);
export default Flight;
