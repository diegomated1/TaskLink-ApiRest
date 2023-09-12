import { UserModel } from '../models/UserModel';
import { v4 as uuid } from 'uuid';
import { ServiceError } from '../utils/errors/service.error';
import { HttpStatusCode } from '../router/RouterTypes';
import bc from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from '../interfaces/User';
import { Conection } from '../database/Conection';
import { Email } from '../utils/services/emailService';
import { SettingsModel } from '../models/SettinsModel';

export class UserService {

    constructor(
        private readonly conection: Conection
    ) { }

    getAll = (): Promise<User[]> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const users = await userModel.getAll();
                await this.conection.commit(client);
                res(users);
            } catch (err) {
                await this.conection.rollback(client);
                rej(err);
            }
        });
    };

    getById = (id: string): Promise<User | null> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const user = await userModel.getById(id);
                await this.conection.commit(client);
                res(user);
            } catch (err) {
                await this.conection.rollback(client);
                rej(err);
            }
        });
    };

    insert = (entity: User): Promise<string> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            const settingsModel = new SettingsModel(client);
            try {
                const _userCheck = await userModel.getByEmail(entity.email);
                if (_userCheck) throw new ServiceError("El correo ya se encuentra en uso.")

                const _userCheck2 = await userModel.getByIdentification(entity.identification);
                if (_userCheck2) throw new ServiceError("La cedula ya se encuentra en uso.")

                entity.password = await bc.hash(entity.password, 10);

                const id = uuid();
                const user: User = {
                    ...entity, id, avatar_url: null,
                    email_verified: false, registration_date: new Date(),
                    role_id: 1, email_code: null, email_code_generate: null, provider: false
                }
                const _user = await userModel.insert(user);
                if (!_user) throw new ServiceError("Error al crear el usuario.", HttpStatusCode.BAD_REQUEST);

                const _settings = await settingsModel.insert({
                    promotion_notification: true,
                    system_notification: true,
                    user_id: _user.id
                });
                if (!_settings) throw new ServiceError("Error al crear el usuario.", HttpStatusCode.BAD_REQUEST);

                const token = jwt.sign({
                    userId: _user.id,
                }, process.env.JWT_SECRET!, {
                    expiresIn: "24h"
                });
                await this.conection.commit(client);
                res(token);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }
    
    update = (id: string, entity: Partial<User>) => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const userCheck = await userModel.getById(id);

                if (!userCheck)
                    throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);

                const { password, ...rest } = entity;

                const math = await bc.compare(password!, userCheck.password);

                if (!math)
                    throw new ServiceError("Contraseña incorrecta.", HttpStatusCode.UNAUTHORIZED);

                const user = await userModel.update(id, rest);

                if (!user)
                    throw new ServiceError("No se pudo actualizar el usuario.", HttpStatusCode.INTERNAL_SERVER_ERROR);

                await this.conection.commit(client);
                res(user);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    };

    delete = (id: string): Promise<boolean> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const result = await userModel.delete(id);
                await this.conection.commit(client);
                res(result);
            } catch (err) {
                await this.conection.rollback(client);
                rej(err);
            }
        });
    };

    forgotPassword = (email: string): Promise<void> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const _user = await userModel.getByEmail(email);
                
                if (!_user) throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);

                const email_code = Math.floor(1000 + Math.random() * 9000);

                await userModel.update(_user.id, { email_code, email_code_generate: Date.now() });

                await Email.ResetPassword(_user.email, _user.fullname, email_code);

                await this.conection.commit(client);
                res();
            } catch (err) {
                await this.conection.rollback(client);
                rej(err);
            }
        });
    };

    resetPassword = (email: string, email_code: number, new_password: string): Promise<void> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const _user = await userModel.getByEmail(email);

                if (!_user) throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);
                
                if (!_user.email_code || !_user.email_code_generate) throw new ServiceError("Codigo no generado.");

                const current = Date.now();
                const email_exp = _user.email_code_generate;
                const five_minutes = 5 * 60 * 1000;

                if (Math.abs(current - email_exp) > five_minutes) throw new ServiceError("Codigo vencido.");

                if (_user.email_code != email_code) throw new ServiceError("Codigo incorrecto.");

                const password = await bc.hash(new_password, 10);
                await userModel.update(_user.id, {
                    email_code: null,
                    email_code_generate: null,
                    password
                });

                await this.conection.commit(client);
                res();
            } catch (err) {
                await this.conection.rollback(client);
                rej(err);
            }
        });
    }


}