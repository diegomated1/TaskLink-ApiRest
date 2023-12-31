import request from 'supertest'
import { User } from '../../src/interfaces/User';
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"
import bc from "bcrypt";
import jwt from "jsonwebtoken";

const API_TOKEN_DEV = `Bearer ${process.env.API_TOKEN_DEV}`;

afterAll((done) => {
    app.close();
    done();
});

describe("GET /user", () => {

    test("GET ALL DATA", async () => {
        const response = await request(app.app).get("/user").set("Authorization", API_TOKEN_DEV).send();

        expect(response.body).toHaveProperty("value");
        expect(response.body).toHaveProperty("errors");
        expect(response.body).toHaveProperty("success");

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.value)).toBe(true);
        const data = response.body as GlobalResponse<User[]>;

        data.value.forEach(e => {
            Object.values(e).forEach(p => {
                expect(p).not.toBe(undefined);
            })
        });

        expect(response.statusCode).toBe(200);
    });

    test("GET ONE", async () => {
        let expectedUser = {
                id: "97f99c61-a665-4eb5-9dd1-799fd82ffd34",
                identification_type_id: 1,
                identification_type: "CC",
                identification: "1001369364",
                fullname: "Diego Cardenas",
                email: "diegodaco08@gmail.com",
                email_verified: expect.any(Boolean),
                registration_date: expect.any(String),
                avatar_url: null,
                phone: "573173887502",
                birthdate: expect.any(String),
                password: expect.any(String),
                email_code: null,
                email_code_generate: null,
                provider: expect.any(Boolean),
                role_id: 1,
                role: "usuario",
                available_days: []
            };
        var expectedResponse = {
            value: expectedUser,
            errors: [],
            success: true
        }

        const response = await request(app.app).get("/user/97f99c61-a665-4eb5-9dd1-799fd82ffd34").set("Authorization", API_TOKEN_DEV).send();
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test("GET ONE 404", async () => {

        var expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: ["Usuario no encontrado."],
            success: false
        }

        const response = await request(app.app).get("/user/dcdd74a8-09d8-4838-ae5a-135be9180e1b").set("Authorization", API_TOKEN_DEV).send();
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(404);
    });

    test("GET ONE WRONG ID", async () => {

        var expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: ["Id de usuario no valido."],
            success: false
        }

        const response = await request(app.app).get("/user/dcdd74a8-09d8-4838-ae5a-135be9180e1").set("Authorization", API_TOKEN_DEV).send();
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });

});

describe("PUT /user", () => {

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
        const register = await request(app.app).post("/auth/register").send({ User: User });

        const newEmail = `${Math.random().toString(16).slice(2)}@gmail.com`;
        const newName = "Diego Cardenas (editado)"
        let body = {
            User: {
                email: newEmail,
                fullname: newName,
                password: "elPepe123@"
            }
        };

        let UserExpected: Partial<User> = {
            id: expect.any(String),
            identification_type_id: 1,
            identification: cc,
            fullname: newName,
            email: newEmail,
            email_verified: false,
            registration_date: expect.any(String),
            avatar_url: null,
            phone: "573173887502",
            password: expect.any(String),
            role_id: 1,
            email_code: null,
            email_code_generate: null,
            provider: false,
            birthdate: expect.any(String),
            available_days: []
        };

        var expectedResponse: GlobalResponse<any> = {
            value: UserExpected,
            errors: [],
            success: true
        }

        const token = `Bearer ${register.body.value}`;

        const response = await request(app.app).put("/user").set("Authorization", token).send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    })

    test("WRONG DATA", async () => {

        let UserPut: Partial<User> = {
            fullname: "laoreet id donec ultrices tincidunt arcu non sodala",
            email: "laoreet id donec ultrices tincidunt arcu non sodala",
            phone: "laoreet id donec ultrices tincidunt arcu non sodala",
        };

        var expectedResponse: GlobalResponse<any> = {
            value: null,
            errors: [
                "Nombre maximo 50 caracteres.",
                "Correo no valido.",
                "Numero de telefono no valido.",
                "La contraseña es requerida.",
            ],
            success: false
        }

        const response = await request(app.app).put("/user").set("Authorization", API_TOKEN_DEV).send({ User: UserPut });
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    })

    test("WRONG PASSWORD", async () => {

        const newEmail = `${Math.random().toString(16).slice(2)}@gmail.com`;
        const newName = "Diego Cardenas (editado)"
        let UserPut: Partial<User> = {
            email: newEmail,
            fullname: newName,
            password: "elPepe123@asdfdas"
        };

        var expectedResponse: GlobalResponse<any> = {
            value: null,
            errors: ["Contraseña incorrecta."],
            success: false
        }

        const response = await request(app.app).put("/user").set("Authorization", API_TOKEN_DEV).send({ User: UserPut });
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    })

});

describe.skip("POST /user/forgot-password", ()=>{

    test("GOD DATA", async () => {
        
        let body: Partial<User> = {
            identification: "9647637690636009",
            email: "god@gmail.com"
        };

        var expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: [],
            success: true
        }

        const response = await request(app.app).post("/user/forgot-password").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test("WRONG EMAIL OR IDENTIFICATION", async () => {

        let body: Partial<User> = {
            identification: "9647637690636005",
            email: "god1@gmail.com"
        };

        var expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: [
                "El email o la identificacion no son correctos."
            ],
            success: false
        }

        const response = await request(app.app).post("/user/forgot-password").send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });

});

describe.skip("POST /user/reset-password", ()=>{

    test("GOD DATA", async () => {
        
        const token = jwt.sign({
            id_user: "1dde026b-8b82-49b9-a9ed-1ed2d7208e86"
        }, process.env.JWT_SECRET!);

        const body = {
            newPassword: "elPepe123@"
        }

        const expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: [],
            success: true
        }

        const response = await request(app.app).patch(`/user/reset-password/?token=${token}`).send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test("WRONG TOKEN", async () => {

        const body = {
            newPassword: "12345"
        }

        const expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: [
                "Token invalido."
            ],
            success: false
        }

        const response = await request(app.app).patch(`/user/reset-password/?token=123`).send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });

    test("WRONG PASSWORD", async () => {
        
        const token = jwt.sign({
            id_user: "1dde026b-8b82-49b9-a9ed-1ed2d7208e86"
        }, process.env.JWT_SECRET!);

        const body = {
            newPassword: "12345"
        }

        const expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: [
                "La contraseña no es segura."
            ],
            success: false
        }

        const response = await request(app.app).patch(`/user/reset-password/?token=${token}`).send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });
});
