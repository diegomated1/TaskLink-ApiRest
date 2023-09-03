import { UserModel } from "../models/UserModel";
import { ServiceError } from "../utils/errors/service.error";
import { HttpStatusCode } from "../router/RouterTypes";
import { Conection } from "../database/Conection";

export class UserProviderService {

    constructor(
        private readonly conection: Conection
    ) { }

    request = (id_user: string): Promise<void> => {
        return new Promise(async (res, rej) => {
            const userModel = new UserModel(this.conection);
            await userModel.start();
            try {
                const _user = await userModel.getById(id_user);

                if (!_user)
                    throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);
                    
                if (!_user.email_verified)
                    throw new ServiceError("Usuario sin autenticacion.", HttpStatusCode.UNAUTHORIZED);

                await userModel.update(id_user, {
                    provider: true
                });

                userModel.commit();
                res();
            } catch (error) {
                await userModel.rollback();
                rej(error)
            }
        });
    }

}