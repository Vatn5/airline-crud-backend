import mongoose, { Schema, Document } from "mongoose";

// 1. Subdocumento Passenger
const PassengerSchema = new Schema({
  id:        { type: Number, required: true },
  name:      { type: String, required: true },
  hasConnections: { type: Boolean, required: true },
  age:       { type: Number, required: true },
  flightCategory: {
    type: String,
    enum: ["Black", "Platinum", "Gold", "Normal"],
    required: true
  },
  reservationId: { type: String, required: true },
  hasCheckedBaggage: { type: Boolean, required: true }
}, { _id: false });

// 2. Modelo principal Flight
export interface IFlight extends Document {
  flightCode: string;
  passengers: typeof PassengerSchema[];
}

const FlightSchema = new Schema({
  flightCode: { type: String, required: true, unique: true },
  passengers: { type: [PassengerSchema], default: [] }
});

const Flight = mongoose.model<IFlight>("Flight", FlightSchema);

export default Flight;
