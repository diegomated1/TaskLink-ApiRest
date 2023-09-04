import { UserModel } from "../models/UserModel";
import { ServiceError } from "../utils/errors/service.error";
import { HttpStatusCode } from "../router/RouterTypes";
import { Conection } from "../database/Conection";
import { Email } from "../utils/services/emailService";

export class EmailService {

    constructor(
        private readonly conection: Conection
    ) { }

    VerifyEmail = (email: string): Promise<void> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const _user = await userModel.getByEmail(email);

                if (!_user) throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);

                if (_user.email_verified) throw new ServiceError("Email ya verificado.");

                const email_code = Math.floor(1000 + Math.random() * 9000);

                await userModel.update(_user.id, { email_code, email_code_generate: Date.now() });

                await Email.Verify(email, email_code);

                await this.conection.commit(client);
                res();
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    VerifyEmailCode = (userId: string, code: number): Promise<void> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const _user = await userModel.getById(userId);

                if (!_user) throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);

                if (_user.email_verified) throw new ServiceError("Email ya verificado.");
                
                if (!_user.email_code || !_user.email_code_generate) throw new ServiceError("Codigo no generado.");

                const current = Date.now();
                const email = _user.email_code_generate;
                const five_minutes = 5 * 60 * 1000;

                if (Math.abs(current - email) > five_minutes) throw new ServiceError("Codigo vencido.");

                if (_user.email_code != code) throw new ServiceError("Codigo incorrecto.");

                await userModel.update(userId, {
                    email_code: null,
                    email_code_generate: null,
                    email_verified: true
                });

                await this.conection.commit(client);
                res();
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    ResetPassword = (email: string): Promise<void> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const _user = await userModel.getByEmail(email);

                if (!_user) throw new ServiceError("Usuario no encontrado.", HttpStatusCode.UNAUTHORIZED);

                const email_code = Math.floor(1000 + Math.random() * 9000);

                userModel.update(_user.id, { email_code });

                await Email.ResetPassword(email, _user.fullname, email_code);

                await this.conection.commit(client);
                res();
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

}