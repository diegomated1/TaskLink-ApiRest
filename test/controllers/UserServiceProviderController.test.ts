import request from 'supertest'
import { User } from '../../src/interfaces/User';
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"
import bc from "bcrypt";


afterAll((done) => {
    app.close();
    done();
});

describe.skip("PATCH /user/:id/provider", () => {

    test("GOD DATA", async () => {
        const expectedResponse: GlobalResponse<any> = {
            value: null,
            errors: [],
            success: true
        }

        const response = await request(app.app).patch("/user/1dde026b-8b82-49b9-a9ed-1ed2d7208e83/provider").send();
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    })

    test("NOT FOUNT", async () => {
        const expectedResponse: GlobalResponse<any> = {
            value: null,
            errors: [
                "Usuario no encontrado.",
            ],
            success: false
        }

        const response = await request(app.app).patch("/user/1dde026b-8b82-49b9-a9ed-1ed2d7208e24/provider").send();
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    })

    test("NOT AUTH", async () => {
        const expectedResponse: GlobalResponse<any> = {
            value: null,
            errors: [
                "Usuario sin autenticacion.",
            ],
            success: true
        }

        const response = await request(app.app).patch("/user/1dde026b-8b82-49b9-a9ed-1ed2d7208e83/provider").send();
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    })

})                                                          