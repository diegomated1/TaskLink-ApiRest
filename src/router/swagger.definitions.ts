import { JsonObject } from "swagger-ui-express";

export const swaggerDefinitions: JsonObject = {
  openapi: '3.1.0',
  info: {
    title: 'PROYECTO INTEGRADOR 3',
    version: '1.0.0',
  },
  security: [ { bearerAuth: [] } ],
}