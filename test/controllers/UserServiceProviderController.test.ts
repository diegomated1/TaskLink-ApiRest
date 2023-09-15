import request from 'supertest'
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"

const API_TOKEN_DEV = `Bearer ${process.env.API_TOKEN_DEV}`;

afterAll((done) => {
    app.close();
    done();
});

describe.skip("PATCH /userprovider", () => {

    test("GOD DATA", async () => {
        const expectedResponse: GlobalResponse<any> = {
            value: null,
            errors: [],
            success: true
        }

        const r1 = await request(app.app).patch("/userprovider").set("Authorization", API_TOKEN_DEV).send();
        expect(r1.body).toEqual(expectedResponse);
        expect(r1.statusCode).toBe(200);

        const r2 = await request(app.app).get("/user/token").set("Authorization", API_TOKEN_DEV).send();
        expect(r2.body.value.provider).toBe(true);
    })

    test("NOT AUTH", async () => {
        const expectedResponse: GlobalResponse<any> = {
            value: null,
            errors: [
                "Usuario sin autenticacion.",
            ],
            success: false
        }

        const lg = await request(app.app).post("/auth/sesion").send({
            email: "diegodaco09@gmail.com",
            password: "elPepe123@"
        });

        const token = `Bearer ${lg.body.value}`;

        const response = await request(app.app).patch("/userprovider").set("Authorization", token).send();
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    })

})                                                          