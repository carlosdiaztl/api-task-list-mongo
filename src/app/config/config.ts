import dotenv from "dotenv";
import { version } from "../../../package.json";
dotenv.config(); // Carga una sola vez

export const env = {
 baseUrl:process.env.BASE_URL??"http://localhost:8080",
 port: process.env.PORT as unknown as number ?? 8080,
  node: process.env.NODE_ENV ?? "development",
  apiVersion: version,
  db: {
    uri: process.env.MONGODB_URI ?? "mongodb://localhost:27017",
  },
};
