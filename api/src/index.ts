import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
  console.error("❌ La variable de entorno MONGO_URI es requerida y no está definida.");
  throw new Error("MONGO_URI no está definida.");
}

const mongoUri = process.env.MONGO_URI;

const connectWithRetry = () => {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log("✅ Conectado a MongoDB");
      // Inicia el server solo después de conectar exitosamente a Mongo
      app.listen(port, () => {
        console.log(`🚀 Servidor Express escuchando en puerto ${port}`);
      });
    })
    .catch(err => {
      console.error("❌ Error conectando a MongoDB. Reintentando en 5 segundos...", err);
      setTimeout(connectWithRetry, 5000); // Espera 5 segundos antes de reintentar
    });
};

connectWithRetry();

app.use(express.json());

// (Opcional: tus rutas aquí)
app.get("/", (req, res) => {
  res.send("API corriendo!");
});
