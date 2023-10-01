import request from 'supertest'
import app from "../../src/index"

const API_TOKEN_DEV = process.env.API_TOKEN_DEV!;

afterAll((done) => {
    app.close();
    done();
});

describe("POST /category", () => {

    test("GOD DATA", async () => {

        const response = await request(app.app).get("/category").set("Authorization", `Bearer ${API_TOKEN_DEV}`).send();
        expect(response.body.errors).toEqual([]);
        expect(response.body.success).toBe(true);

        for(let i=0;i<response.body.value; i++){
            let category = response.body.value[i];
            expect(category.id).toBe(expect.any(Number));
            expect(category.name).toBe(expect.any(String));
            expect(category.description).toBe(expect.any(String) || null);
        }

        expect(response.statusCode).toBe(200);
    });

});