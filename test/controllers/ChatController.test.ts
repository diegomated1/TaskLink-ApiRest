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


describe.skip('POST /chat/send-message', () => {
    test('Send Message', async () => {
        const senderUserId = '1dde026b-8b82-49b9-a9ed-1ed2d7208e86'; 
        const recipientUserId = '1dde026b-8b82-49b9-a9ed-1ed2d7208e86'; 
        const message = 'Hola, ¿cómo estás?'; 

        const expectedResponse = {
            value: null,
            errors: [],
            success: true,
        };

        const response = await request(app.app).post('/chat/send-message').send({senderUserId,recipientUserId,message,});
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test('Missing Message', async () => {
        const senderUserId = '1dde026b-8b82-49b9-a9ed-1ed2d7208e86'; 
        const recipientUserId = '1dde026b-8b82-49b9-a9ed-1ed2d7208e86'; 

        const expectedResponse = {
            value: null,
            errors: ['El mensaje es requerido.'],
            success: false,
        };

        const response = await request(app.app).post('/chat/send-message').send({senderUserId,recipientUserId,});
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });

    test('Invalid Users', async () => {
        const senderUserId = 'invalidUser123';
        const recipientUserId = '1dde026b-8b82-49b9-a9ed-1ed2d7208e86';
        const message = 'Hola, ¿cómo estás?';
    
        const expectedResponse = {
            value: null,
            errors: ['Usuario remitente no encontrado.'],
            success: false,
        };
    
        const response = await request(app.app).post('/chat/send-message').send({senderUserId,recipientUserId,message,});
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    });
    
});
