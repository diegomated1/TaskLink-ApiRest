import { UserModel } from '../models/UserModel';
import { v4 as uuid } from 'uuid';
import { ServiceError } from '../utils/errors/service.error';
import { HttpStatusCode } from '../router/RouterTypes';
import bc from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from '../interfaces/User';
import { Conection } from '../database/Conection';

export class UserService {

    constructor(
        private readonly conection: Conection
    ) { }

    getAll = (): Promise<User[]> => {
        return new Promise(async (res, rej) => {
            const userModel = new UserModel(this.conection);
            await userModel.start();
            try {
                const users = await userModel.getAll();
                await userModel.commit();
                res(users);
            } catch (err) {
                await userModel.rollback();
                rej(err);
            }
        });
    };

    getById = (id: string): Promise<User | null> => {
        return new Promise(async (res, rej) => {
            const userModel = new UserModel(this.conection);
            await userModel.start();
            try {
                const user = await userModel.getById(id);
                await userModel.commit();
                res(user);
            } catch (err) {
                await userModel.rollback();
                rej(err);
            }
        });
    };

    insert = (entity: User): Promise<string> => {
        return new Promise(async (res, rej) => {
            const userModel = new UserModel(this.conection);
            await userModel.start();
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
                    role_id: 1
                }
                const _user = await userModel.insert(user);
                if (_user) {
                    const token = jwt.sign(_user, process.env.JWT_SECRET!, {
                        expiresIn: "24h"
                    });
                    res(token);
                } else {
                    throw new ServiceError("La cedula ya se encuentra en uso.", HttpStatusCode.BAD_REQUEST);
                }
            } catch (error) {
                await userModel.rollback();
                rej(error)
            }
        });
    }
    
    update = (id: string, entity: Partial<User>) => {
        return new Promise(async (res, rej) => {
            const userModel = new UserModel(this.conection);
            await userModel.start();
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

                res(user);
            } catch (error) {
                await userModel.rollback();
                rej(error)
            }
        });
    };

    delete = (id: string): Promise<boolean> => {
        return new Promise(async (res, rej) => {
            const userModel = new UserModel(this.conection);
            await userModel.start();
            try {
                const result = await userModel.delete(id);
                await userModel.commit();
                res(result);
            } catch (err) {
                await userModel.rollback();
                rej(err);
            }
        });
    };

}