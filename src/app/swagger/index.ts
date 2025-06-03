import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "../config/config";

const swaggerDefinition: any = {
  openapi: "3.0.0",
  info: {
    title: "API Rest task",
    description:
      "Esta API es documentada con Swagger, así se puede lograr un correcto y adecuado manejo a la misma.",
    contact: {
      name: "carlos diaz ",
      email: "diaz.alzate1310@gmail.com",
    },
    version: env.apiVersion,
  },
  servers: [
    {
      url: `http://localhost:8080/api/v1`,
      description: "Local serve",
    },
    {
      url: `${process.env.SWAGGER_SERVER_CLOUD}/api/v1`,
      description: "Cloud server",
    },
  ],
//   components: {
//     securitySchemes: {
//       ApiKeyAuth: {
//         type: "apiKey",
//         name: "Authorization",
//         in: "header",
//       },
//     },
//   },
//   security: [
//     {
//       ApiKeyAuth: {
//         type: "apiKey",
//         name: "Authorization",
//       },
//     },
//   ],
};

const options = {
  swaggerDefinition,
  apis: ["./docs/*.ts"], // Asegúrate de que esta ruta sea correcta
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
