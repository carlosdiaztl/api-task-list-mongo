import { connectDB } from './../database/index';
import express from "express";
import cors from "cors";
import { corsOptions } from './utils/cors';
import routes from '../api/routes';
import { env } from './config/config';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./swagger"; // Asegúrate de que la ruta sea correcta

const app = express();

app.set("port", env.port);
app.use(cors(corsOptions));
app.use(express.json());


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
}));

app.use("/api/v1", cors(corsOptions), routes);

// --- Función de inicialización del servidor ---
export const init = async () => {
    try {
        await connectDB(); // Llama a la conexión de la DB
        app.listen(app.get("port"), () => {
            console.log(`🚀 Servidor corriendo en el puerto ${app.get("port")}`);
            const baseUrl = `http://localhost:${app.get("port")}`; // Para desarrollo local

            console.log(`API is available at ${baseUrl}/api/v1`);
            console.log(`Swagger is available at ${baseUrl}/docs`);
        });
    } catch (error) {
        console.error("Error durante la inicialización del servidor:", error);
    }
};

// Rutas de prueba/información
app.get("/", (_req, res) => {
    res.send("Bienvenido este es el backend de la aplicación de node v1.2.0");
});
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK" });
});