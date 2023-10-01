import request from 'supertest'
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"

const API_TOKEN_DEV = `Bearer ${process.env.API_TOKEN_DEV!}`;

afterAll((done) => {
    app.close();
    done();
});

describe("GET /favorites", () => {

    test("GET ALL DATA", async () => {
        const response = await request(app.app).get("/favorite").set("Authorization", API_TOKEN_DEV).send();

        expect(response.body).toHaveProperty("value");
        expect(response.body).toHaveProperty("errors");
        expect(response.body).toHaveProperty("success");

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.value)).toBe(true);

        expect(response.statusCode).toBe(200);
    });

});

describe("POST /favorites", () => {

    test("GOOD", async () => {

        // REMOVE FAVORITE IF EXIXITS
        await request(app.app).delete("/favorite/1dde026b-8b82-49b9-a9ed-1ed2d7208e83").set("Authorization", API_TOKEN_DEV).send();

        // ADD FAVORITE
        const expectedResponse:GlobalResponse<any> = {
            errors: [],
            success: true,
            value: {
                id: expect.any(Number),
                user_id: "1dde026b-8b82-49b9-a9ed-1ed2d7208e83",
                service_provider_id: "1dde026b-8b82-49b9-a9ed-1ed2d7208e83"
            }
        }
        const response = await request(app.app).post("/favorite/1dde026b-8b82-49b9-a9ed-1ed2d7208e83").set("Authorization", API_TOKEN_DEV).send();

        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test("NOT FOUND", async () => {

        const expectedResponse:GlobalResponse<any> = {
            value: null,
            errors: [
                "Proveedor de servicios no encontrado."
            ],
            success: false
        }
        
        const response = await request(app.app).post("/favorite/1dde026b-8b82-49b9-a9ed-1ed2d7208e81").set("Authorization", API_TOKEN_DEV).send();

        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(404);
    });

});

describe("DELETE /favorites", () => {

    test("GOOD", async () => {

        // ADD FAVORITE
        await request(app.app).post("/favorite/1dde026b-8b82-49b9-a9ed-1ed2d7208e83").set("Authorization", API_TOKEN_DEV).send();

        const expectedResponse:GlobalResponse<any> = {
            value: null,
            errors: [],
            success: true
        }
        
        // REMOVE FAVORITE
        const response = await request(app.app).delete("/favorite/1dde026b-8b82-49b9-a9ed-1ed2d7208e83").set("Authorization", API_TOKEN_DEV).send();

        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test("NOT FOUND", async () => {

        const expectedResponse:GlobalResponse<any> = {
            value: null,
            errors: [
                "Proveedor de servicios no encontrado."
            ],
            success: false
        }
        
        const response = await request(app.app).post("/favorite/1dde026b-8b82-49b9-a9ed-1ed2d7208e81").set("Authorization", API_TOKEN_DEV).send();

        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(404);
    });

});