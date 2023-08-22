import request from 'supertest'
import { User } from '../../src/interfaces/User';
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"
import bc from "bcrypt";
import '@types/jest';

afterAll((done) => {
    app.close();
    done();
});

describe("POST /sesion", () => {

    test("GOD DATA", async () => {
        const body = {
            email: "god@gmail.com",
            password: "elPepe123@"
        }

        const expectedResponse:GlobalResponse<{User: User, token: string}> = {
            errors: [],
            success: true,
            value: {
                User: {
                    id: "1dde026b-8b82-49b9-a9ed-1ed2d7208e86",
                    identification: "9647637690636009",
                    identification_type_id: 1,
                    fullname: "Diego Cardenas",
                    email: "god@gmail.com",
                    email_verified: false,
                    registration_date: expect.any(String),
                    avatar_url: null,
                    phone: "573173887502",
                    birthdate: "2002-10-15T05:00:00.000Z",
                    password: "$2b$10$Nyabob8uXAXdK6IGZNrPZOboaBvlM689VUtpgY3riRzXRWGLAeulm",
                    role_id: 1
                },
                token: expect.any(String),
            }
        }

        const response = await request(app.app).post("/sesion").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test("WRONG EMAIL", async () => {
        const body = {
            email: "wrongEmail@gmail.com",
            password: "elPepe123@"
        }

        const expectedResponse:GlobalResponse<any> = {
            errors: [
                "Correo no encontrado."
            ],
            success: false,
            value: null
        }

        const response = await request(app.app).post("/sesion").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    });

    test("WRONG PASSWORD", async () => {
        const body = {
            email: "god@gmail.com",
            password: "wrongPassword"
        }

        const expectedResponse:GlobalResponse<any> = {
            errors: [
                "Contraseña incorrecta."
            ],
            success: false,
            value: null
        }

        const response = await request(app.app).post("/sesion").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    });

});