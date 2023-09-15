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
            email: "god@gmail.com",
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

        const response = await request(app.app).post("/auth/sesion").send(body);
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

        const response = await request(app.app).post("/auth/sesion").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    });

});

describe.skip("POST /auth/register", () => {

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

describe.skip('Verify email', () => {

    test('GOD CODE', async () => {
        // REGISTER USER
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
        const expectedR1 = {
            value: expect.any(String),
            errors: [],
            success: true
        };
        const r1 = await request(app.app).post('/auth/register').send({User});
        expect(r1.body).toEqual(expectedR1);
        expect(r1.status).toBe(200);

        const token = `Bearer ${r1.body.value}`;

        // SEND EMAIL FOR VERIFY EMAIL
        const expectedR2 = {
            value: null,
            errors: [],
            success: true
        };
        const r2 = await request(app.app).post('/auth/verify-email').set("Authorization", token).send({
            email
        });
        expect(r2.body).toEqual(expectedR2);

        // GET USER FOR CHECK CODE
        const r3 = await request(app.app).get('/user/token').set("Authorization", token).send();
        expect(r3.body.value).not.toBeNull();
        expect(r3.body.value.email_code).not.toBeNull();
        expect(r3.body.value.email_verified).toBe(false);
        const email_code = r3.body.value.email_code;

        // VERIFY EMAIL
        const expectedR4 = {
            value: null,
            errors: [],
            success: true
        };
        const r4 = await request(app.app).post('/auth/verify-email-code').set("Authorization", token).send({
            email_code
        });
        expect(r4.body).toEqual(expectedR4);
        expect(r4.status).toBe(200);

        
        // CHECK IF EMAIL IS VERIFIED
        const r5 = await request(app.app).get('/user/token').set("Authorization", token).send();
        expect(r5.body.value).not.toBeNull();
        expect(r5.body.value.email_code).not.toBeNull();
        expect(r5.body.value.email_verified).toBe(true);
    });

    test('WRONG CODE', async () => {
        //#region REGISTER USER
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
        const expectedR1 = {
            value: expect.any(String),
            errors: [],
            success: true
        };
        const r1 = await request(app.app).post('/auth/register').send({User});
        expect(r1.body).toEqual(expectedR1);
        expect(r1.status).toBe(200);

        //#endregion REGISTER USER
    
        const token = `Bearer ${r1.body.value}`;
        
        // SEND EMAIL FOR VERIFY EMAIL
        const expectedR2 = {
            value: null,
            errors: [],
            success: true
        };
        const r2 = await request(app.app).post('/auth/verify-email').set("Authorization", token).send({
            email
        });
        expect(r2.body).toEqual(expectedR2);

        // VERIFY EMAIL
        const expectedR4 = {
            value: null,
            errors: [
                "Codigo incorrecto."
            ],
            success: false
        };
        const r4 = await request(app.app).post('/auth/verify-email-code').set("Authorization", token).send({
            email_code: "99999"
        });
        expect(r4.body).toEqual(expectedR4);
        expect(r4.status).toBe(400);
        
    });

});