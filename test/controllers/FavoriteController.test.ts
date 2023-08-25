import request from 'supertest'
import { User } from '../../src/interfaces/User';
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"
import bc from "bcrypt";


afterAll((done) => {
    app.close();
    done();
});

describe.skip("GET /favorites", () => {

    test("GET ALL DATA", async () => {
        const response = await request(app.app).get("/favorites").send();

        expect(response.body).toHaveProperty("value");
        expect(response.body).toHaveProperty("errors");
        expect(response.body).toHaveProperty("success");

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.value)).toBe(true);

        expect(response.statusCode).toBe(200);
    });

});