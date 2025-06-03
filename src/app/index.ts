import express from "express";
import path from 'path';
import cors from "cors";
import { corsOptions } from './utils/cors';
import routes from '../api/routes';
import { env } from './config/config';
import { connectDB } from "../database.config";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerSpec } from "./swagger";
// ... tus otras importaciones (cors, routes, etc.)

const app = express();
const swaggerUiPath = path.join(__dirname, '../node_modules/swagger-ui-dist');
app.set("port", env.port);
app.use(cors(corsOptions));
app.use(express.json());
app.use("/docs", express.static(swaggerUiPath), swaggerUi.setup(swaggerSpec))
app.use("/api/v1", cors(corsOptions), routes);
export const init = async () => {
  try {
     await connectDB()
    app.listen(app.get("port"), async () => {
  console.log(`🚀 Servidor corriendo ${app.get("port")}`);
    const baseUrl = `${env.baseUrl}:${app.get("port")}`;
   if (env.node === "development") {
        console.log(`API is available at ${baseUrl}/api/v1`);
        console.log(`Swagger is available at ${baseUrl}/docs`);
      } else if (env.node === "production" || env.node === "qa") {
        console.log(`API is available at ${env.baseUrl}/api/v1`);
        console.log(`Swagger is available at ${env.baseUrl}/docs`);
      }
});
  } catch (error) {
    console.log(error);
  }
}

app.get("/", (_req, res) => {
  res.send("Bienvenido este es el backend de la aplicación de node v1.2.0");
});
app.get("/env", async (_req, res) => {
  try {
     res.send(env);
  } catch (error) {
    console.log(error);
  }
})
// https://carlostito-gdb2gkfceycvakbg.canadacentral-01.azurewebsites.net/