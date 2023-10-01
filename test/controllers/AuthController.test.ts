import request from 'supertest'
import { User } from '../../src/interfaces/User';
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

afterAll((done) => {
    app.close();
    done();
});

describe("POST /auth/sesion", () => {

    test("GOD DATA", async () => {

        const body = {
            email: "test@test.com",
            password: "elPepe123@"
        }

        const expectedResponse:GlobalResponse<{User: User, token: string}> = {
            errors: [],
            success: true,
            value: expect.any(String)
        }

        const response = await request(app.app).post("/auth/sesion").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
        expect(() => jwt.verify(response.body.value, JWT_SECRET)).not.toThrow();
    });

    test("WRONG EMAIL", async () => {
        const body = {
            email: "test@t3st.com",
            password: "elPepe123@"
        }

        const expectedResponse:GlobalResponse<any> = {
            errors: [
                "Correo no encontrado."
            ],
            success: false,
            value: null
        }

        const response = await request(app.app).post("/auth/sesion").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    });

    test("WRONG PASSWORD", async () => {
        const body = {
            email: "test@test.com",
            password: "elPepe1234"
        }

        const expectedResponse:GlobalResponse<any> = {
            errors: [
                "Contraseña incorrecta."
            ],
            success: false,
            value: null
        }

        const response = await request(app.app).post("/auth/sesion").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    });

});

describe("POST /auth/register", () => {

    test("GOD DATA", async () => {
        const cc = Math.random().toString().slice(2);
        const email = `${Math.random().toString(16).slice(2)}@gmail.com`;
        let User: Partial<User> = {
            identification_type_id: 1,
            identification: cc,
            fullname: "Diego Cardenas",
            email,
            birthdate: "2002-10-15T05:00:00.000Z",
            phone: "573173887502",
            password: "elPepe123@"
        };

        var expectedResponse: GlobalResponse<any> = {
            value: expect.any(String),
            errors: [],
            success: true
        }
        const response = await request(app.app).post("/auth/register").send({ User: User });

        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test("WRONG DATA", async () => {
        let User: Partial<User> = {
            fullname: "Diego Cardenas",
            email: "diegodaco08@gmail.com1",
            birthdate: "2002-10-15T05:00:00.000Z",
            password: "elPEPE"
        };
        var expectedResponse = {
            value: null,
            errors: [
                "El tipo de documento es requerido.",
                "El documento es requerido.",
                "Correo no valido.",
                "El numero de celular es requerido.",
                "La contraseña no es segura."
            ],
            success: false
        }
        const response = await request(app.app).post("/auth/register").send({ User });
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });

    test("EMAIL USED", async () => {
        let User: Partial<User> = {
            identification_type_id: 1,
            identification: "1001369364",
            fullname: "Diego Cardenas",
            email: "diegodaco08@gmail.com",
            birthdate: "2002-10-15T05:00:00.000Z",
            phone: "573173887502",
            password: "elPepe123@"
        };
        var expectedResponse = {
            value: null,
            errors: ["El correo ya se encuentra en uso."],
            success: false
        }
        const response = await request(app.app).post("/auth/register").send({ User });
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });

});