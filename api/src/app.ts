import express from "express";
import flightsRouter from "./routes/flights.js";
// Si tienes más routers, impórtalos aquí

const app = express();

app.use(express.json());

// Monta los routers (usa prefijos según tus rutas)
app.use("/api/flights", flightsRouter);
// app.use("/api/otros", otrosRouter); // Ejemplo para otros recursos

export default app;
