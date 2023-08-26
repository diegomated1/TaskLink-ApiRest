import request from 'supertest'
import { User } from '../../src/interfaces/User';
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"
import bc from "bcrypt";
import jwt from "jsonwebtoken";


afterAll((done) => {
    app.close();
    done();
});


describe('PATCH /user/notification-settings', () => {
    test('Update Notification Settings', async () => {
        const id_user = '1dde026b-8b82-49b9-a9ed-1ed2d7208e86';
        const notificationSettings = {
            email: true, 
            push: false, 
            sms: true,
        };

        const expectedResponse = {
            value: null,
            errors: [],
            success: true,
        };

        const response = await request(app.app).patch(`/user/${id_user}/notification-settings`).send(notificationSettings);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test('Update Update Notification Settings', async () => {
        const id_user = '1dde026b-8b82-49b9-a9ed-1ed2d7208e86';
        const notificationSettings = {
            email: false, 
            push: false, 
            sms: true,
        };

        const expectedResponse = {
            value: null,
            errors: [],
            success: true,
        };

        const response = await request(app.app).patch(`/user/${id_user}/notification-settings`).send(notificationSettings);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

});