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


describe('PATCH /service-request/:id', () => {
    test('Accept Request', async () => {
        const requestId = 'Aun no hay ID en la base de datos'; 
        const action = 'accept'; 

        const expectedResponse = {
            value: null,
            errors: [],
            success: true,
        };

        const response = await request(app.app).patch(`/service-request/${requestId}`).send({ action });
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test('Reject Request', async () => {
        const requestId = 'Aun no hay ID en la base de datos'; 
        const action = 'reject'; 

        const expectedResponse = {
            value: null,
            errors: [],
            success: true,
        };

        const response = await request(app.app).patch(`/service-request/${requestId}`).send({ action });
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test('Request Not Found', async () => {
        const requestId = 'Aun no hay ID en la base de datos';
        const action = 'accept';

        const expectedResponse = {
            value: null,
            errors: ['Solicitud no encontrada.'],
            success: false,
        };

        const response = await request(app.app).patch(`/service-request/${requestId}`).send({ action });
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(404);
    });

    test('Invalid Action', async () => {
        const requestId = 'Aun no hay ID en la base de datos';
        const invalidAction = 'invalidAction'; 

        const expectedResponse = {
            value: null,
            errors: ['Acción inválida.'],
            success: false,
        };

        const response = await request(app.app).patch(`/service-request/${requestId}`).send({ action: invalidAction });
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });

});


describe('GET /service-requests', () => {
    test('List Service Requests', async () => {
        const expectedResponse = {
            value: [
                {
                    id: 'Aun no hay ID en la base de datos',
                    serviceCategory: 'Home', 
                    clientName: 'Larry Davis', 
                    serviceValue: 150.0, 
                    chatIcon: 'chat-icon.png',
                    userLocation: '1.5 km',
                },
            ],
            errors: [],
            success: true,
        };

        const response = await request(app.app).get('/service-requests');
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });
});






