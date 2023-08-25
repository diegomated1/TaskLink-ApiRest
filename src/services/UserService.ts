import { UserModel } from '../models/UserModel';
import { v4 as uuid } from 'uuid';
import { ServiceError } from '../utils/errors/service.error';
import { HttpStatusCode } from '../router/RouterTypes';
import bc from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from 'interfaces/User';

export class UserService {

    constructor(
        private readonly userModel: UserModel
    ) { }

    getAll = () => this.userModel.getAll();

    getById = (id: string) => this.userModel.getById(id);

    insert = (entity: User): Promise<string> => {
        return new Promise(async (res, rej) => {
            try {
                const _userCheck = await this.userModel.getByEmail(entity.email);
                if (_userCheck) return rej(new ServiceError("El correo ya se encuentra en uso."))

                const _userCheck2 = await this.userModel.getByIdentification(entity.identification);
                if (_userCheck2) return rej(new ServiceError("La cedula ya se encuentra en uso."))

                entity.password = await bc.hash(entity.password, 10);

                const id = uuid();
                const user: User = {
                    ...entity, id, avatarUrl: null,
                    emailVerified: false, registration_date: new Date(),
                    roleId: 1
                }
                const _user = await this.userModel.insert(user);
                if (_user) {
                    const token = jwt.sign(_user, process.env.JWT_SECRET!, {
                        expiresIn: "24h"
                    });
                    res(token);
                } else {
                    return rej(new ServiceError("La cedula ya se encuentra en uso.", HttpStatusCode.BAD_REQUEST))
                }
            } catch (error) {
                rej(error)
            }
        });
    }
    update = (id: string, entity: Partial<User>) => {
        return new Promise(async (res, rej) => {
            try {

                const userCheck = await this.userModel.getById(id);

                if (!userCheck)
                    return rej(new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND));

                const { password, ...rest } = entity;

                const math = await bc.compare(password!, userCheck.password);

                if (!math)
                    return rej(new ServiceError("Contraseña incorrecta.", HttpStatusCode.UNAUTHORIZED));

                const user = await this.userModel.update(id, rest);

                if (!user)
                    return rej(new ServiceError("No se pudo actualizar el usuario.", HttpStatusCode.INTERNAL_SERVER_ERROR));

                res(user);
            } catch (error) {
                console.log(error)
                rej(error)
            }
        });
    };

    delete = (id: string) => this.userModel.delete(id);

}