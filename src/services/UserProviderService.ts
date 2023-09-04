import { UserModel } from "../models/UserModel";
import { ServiceError } from "../utils/errors/service.error";
import { HttpStatusCode } from "../router/RouterTypes";
import { Conection } from "../database/Conection";
import { FavoriteModel } from "../models/FavoriteModel";
import { User } from "../interfaces/User";
import { Favorite } from "../interfaces/Favorite";

export class UserProviderService {

    constructor(
        private readonly conection: Conection
    ) { }

    request = (user_id: string): Promise<void> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const _user = await userModel.getById(user_id);

                if (!_user)
                    throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);
                    
                if (!_user.email_verified)
                    throw new ServiceError("Usuario sin autenticacion.", HttpStatusCode.UNAUTHORIZED);

                await userModel.update(user_id, {
                    provider: true
                });

                await this.conection.commit(client);
                res();
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    getFavorites = (user_id: string): Promise<User[]> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const favModel = new FavoriteModel(client);
            try {
                const favorites = await favModel.getAllByUserId(user_id);
                await this.conection.commit(client);
                res(favorites);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    insert = (user_id: string, service_provider_id: string): Promise<Favorite | null> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            const favModel = new FavoriteModel(client);
            try {
                const user = await userModel.getById(user_id);
                if(!user) throw new ServiceError("Usuario no encontrado.");
                
                const user_provider = await userModel.getById(service_provider_id);
                if(!user_provider) throw new ServiceError("Proveedor de servicios no encontrado.");

                const _favorite = await favModel.getOne(user_id, service_provider_id);
                if(_favorite) throw new ServiceError("Favorito ya agregado.");

                const favorite = await favModel.insert(user_id, service_provider_id);
                await this.conection.commit(client);
                res(favorite);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    delete = (user_id: string, service_provider_id: string): Promise<number> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            const favModel = new FavoriteModel(client);
            try {
                const user = await userModel.getById(user_id);
                if(!user) throw new ServiceError("Usuario no encontrado.");
                
                const user_provider = await userModel.getById(service_provider_id);
                if(!user_provider) throw new ServiceError("Proveedor de servicios no encontrado.");

                const rowCount = await favModel.delete(user_id, service_provider_id);
                await this.conection.commit(client);
                res(rowCount);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

}