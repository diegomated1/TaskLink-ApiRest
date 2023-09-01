import { UserModel } from "../models/UserModel";
import jwt from "jsonwebtoken";
import bc from "bcrypt";
import { ServiceError } from "../utils/errors/service.error";
import { HttpStatusCode } from "../router/RouterTypes";
import { User } from "../interfaces/User";
import { Conection } from "../database/Conection";

export class AuthService {
    
    constructor(
        private readonly conection: Conection
    ) { }

    login = (email: string , password: string ): Promise<{User:User,token:String}> => {
        return new Promise(async (res, rej) => {
            const userModel = new UserModel(this.conection);
            await userModel.start();
            try {
                const _user = await userModel.getByEmail(email);

                if (_user) {
                    if (await bc.compare(password,_user.password)){

                        const token = jwt.sign(_user, process.env.JWT_SECRET!, {
                            expiresIn: "24h"
                        });
                        res( {
                            User: _user,
                            token: token,
                        });
                    }
                    else{
                        throw new ServiceError("Contraseña incorrecta.",HttpStatusCode.UNAUTHORIZED);
                    }
                }else{
                    throw new ServiceError("Correo no encontrado.",HttpStatusCode.UNAUTHORIZED);
                }
            } catch (error) {
                await userModel.rollback();
                rej(error)
            }
        });
    }

}