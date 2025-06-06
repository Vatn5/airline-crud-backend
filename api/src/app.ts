import express from "express";
import flightsRouter from "./routes/flights";
import rateLimit from "express-rate-limit";

// Limita a 100 requests cada 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por ventana de tiempo
  message: { error: "Demasiadas peticiones, intenta más tarde" }
});

const app = express();

app.use(express.json());

// Monta los routers (usa prefijos según tus rutas)
app.use("/api/flights", limiter, flightsRouter);
// app.use("/api/otros", otrosRouter); // Ejemplo para otros recursos
app.get("/", (req, res) => {
  res.send("API en funcionamiento 🚀");
});
export default app;
