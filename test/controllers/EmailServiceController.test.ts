import request from 'supertest'
import { User } from '../../src/interfaces/User';
import { GlobalResponse } from "../../src/middlewares/ResponseMiddleware"
import app from "../../src/index"
import bc from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

afterAll((done) => {
    app.close();
    done();
});

describe.skip("POST /auth/verify-email", () => {

    test("GOD DATA", async ()=> {

        const token = process.env.API_TOKEN_DEV;

        // create new user
        const emailUser = await nodemailer.createTestAccount();
        const cc = Math.random().toString().slice(2);

        let User: Partial<User> = {
            identification_type_id: 1,
            identification: cc,
            fullname: "Diego Cardenas",
            email: emailUser.user,
            birthdate: "2002-10-15T05:00:00.000Z",
            phone: "573173887502",
            password: emailUser.pass
        };
        let expectedResponse: GlobalResponse<any> = {
            value: expect.any(String),
            errors: [],
            success: true
        }

        let body: any = {
            User
        }

        const responseCreateUser = await request(app.app).post("/user").send(body);
        expect(responseCreateUser.body).toEqual(expectedResponse);
        

        body = {
            email: "diegodaco08@gmail.com"
        }

        expectedResponse = {
            value: null,
            errors: [],
            success: true
        }

        const response = await request(app.app).post(`/user/verify-email`).send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(200);
    });

    test("WRONG TOKEN", async ()=> {

        const body = {
            newCode: "1234"
        }

        const expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: [
                "Token invalido."
            ],
            success: false
        }

        const response = await request(app.app).patch(`/user/email-verify/?token=123`).send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(401);
    })

    test("WRONG MAIL-VERIFY", async ()=> {
        
        const token = jwt.sign({
            id_user: "1dde026b-8b82-49b9-a9ed-1ed2d7208e86"
        }, process.env.JWT_SECRET!);

        const body = {
            newCode: "9999"
        }

        const expectedResponse: GlobalResponse<null> = {
            value: null,
            errors: [
                "Codigo Incorrecto"
            ],
            success: false
        }

        const response = await request(app.app).patch(`/user/email-verify/?token=${token}`).send(body);
        expect(response.body).toEqual(expectedResponse);
        expect(response.statusCode).toBe(400);
    })

    describe('POST /user/verify-document', () => {

        test('Scan Document and Verify Registration Data', async () => {
            const scanResult = {
                isValid: true,
                verifiedData: {
                    name: 'Larry Davis',
                    identification: '9647637690636009',
                },
            };
    
            const expectedResponse = {
                value: scanResult,
                errors: [],
                success: true,
            };
    
            const response = await request(app.app).post('/register/verify-document').send(scanResult);
            expect(response.body).toEqual(expectedResponse);
            expect(response.statusCode).toBe(200);
        });
    
        test('Invalid Scanned Document', async () => {
            const scanResult = {
                isValid: false,
                verifiedData: {},
            };
    
            const expectedResponse = {
                value: scanResult,
                errors: ['Documento escaneado no válido.'],
                success: false,
            };
    
            const response = await request(app.app).post('/register/verify-document').send(scanResult);
            expect(response.body).toEqual(expectedResponse);
            expect(response.statusCode).toBe(400);
        });
    

    });
})


