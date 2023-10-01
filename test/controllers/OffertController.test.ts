import request from 'supertest'
import app from "../../src/index"

const API_TOKEN_DEV = process.env.API_TOKEN_DEV!;

afterAll((done) => {
    app.close();
    done();
});

describe("POST /offert", () => {

    test("GOD DATA", async () => {
        const body = {
            Offert: {
                price: 10500,
                agended_date: "2023-10-10 10:30:15",
                service_id: 1
            },
            address: "Carrera 5occ #29-40, Bucaramanga, Santander, Colombia"
        }

        const expectedResponse = {
            errors: [],
            success: true,
            value: {
                "id": expect.any(Number),
                "created_date": expect.any(String),
                "agended_date": expect.any(String),
                "user_id": "1dde026b-8b82-49b9-a9ed-1ed2d7208e83",
                "service_id": 1,
                "status_id": 1,
                "price": 10500,
                "user_location": {
                    "x": expect.any(Number),
                    "y": expect.any(Number)
                },
                "user_provider_location": null
            }
        }

        const response = await request(app.app).post("/offert").set("Authorization", `Bearer ${API_TOKEN_DEV}`).send(body);
        
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

});