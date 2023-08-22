import request from 'supertest'
import { User } from '../../src/interfaces/User';
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"
import bc from "bcrypt";

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
                User: {} as User,
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