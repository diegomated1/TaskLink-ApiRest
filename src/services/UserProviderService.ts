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

    insertFavorite = (user_id: string, service_provider_id: string): Promise<Favorite | null> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            const favModel = new FavoriteModel(client);
            try {
                const user = await userModel.getById(user_id);
                if (!user) throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);

                const user_provider = await userModel.getById(service_provider_id);
                if (!user_provider) throw new ServiceError("Proveedor de servicios no encontrado.", HttpStatusCode.NOT_FOUND);

                const _favorite = await favModel.getOne(user_id, service_provider_id);
                if (_favorite) throw new ServiceError("Favorito ya agregado.");

                const favorite = await favModel.insert(user_id, service_provider_id);
                await this.conection.commit(client);
                res(favorite);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    deleteFavorite = (user_id: string, service_provider_id: string): Promise<number> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            const favModel = new FavoriteModel(client);
            try {
                const user = await userModel.getById(user_id);
                if (!user) throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);

                const user_provider = await userModel.getById(service_provider_id);
                if (!user_provider) throw new ServiceError("Proveedor de servicios no encontrado.", HttpStatusCode.NOT_FOUND);

                const rowCount = await favModel.delete(user_id, service_provider_id);
                await this.conection.commit(client);
                res(rowCount);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    setAvailableDays = (user_id: string, available_days: string[]): Promise<void> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new UserModel(client);
            try {
                const _user = await userModel.getById(user_id);

                if (!_user)
                    throw new ServiceError("Usuario no encontrado.", HttpStatusCode.NOT_FOUND);

                const validFormat = /^[MTWRFSAU*] ([0-1]?[0-9]|2[0-3]):[0-5][0-9] ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                for (let available_day of available_days) {
                    if(!validFormat.test(available_day)) throw new ServiceError(`Formato de fecha incorrecto: '${available_day}'`);
                    let format = available_day.split(" ");
                    if(format[1] >= format[2]) throw new ServiceError(`Formato de fecha incorrecto: '${available_day}'`);
                }

                const user = await userModel.update(user_id, {
                    available_days
                });
                if (!user) throw new ServiceError("Error al actualizar los dias disponibles.", HttpStatusCode.BAD_REQUEST);

                await this.conection.commit(client);
                res();
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

}