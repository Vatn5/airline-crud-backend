import "dotenv/config"; // Carga las variables de entorno desde .env
import mongoose from "mongoose";
import app from "./app"; 


const port = process.env['PORT'] || 3000;
const mongoUri = process.env['MONGO_URI'];

if (!mongoUri) {
  console.error("❌ La variable de entorno MONGO_URI es requerida y no está definida.");
  process.exit(1);
}

const connectWithRetry = () => {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log("✅ Conectado a MongoDB");
      app.listen(port, () => {
        console.log(`🚀 Servidor Express escuchando en puerto ${port}`);
      });
    })
    .catch(err => {
      console.error("❌ Error conectando a MongoDB. Reintentando en 5 segundos...", err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
