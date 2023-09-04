import { UserModel } from "../models/UserModel";
import { ServiceError } from "../utils/errors/service.error";
import { HttpStatusCode } from "../router/RouterTypes";
import { Conection } from "../database/Conection";
import { Email } from "../utils/services/emailService";
import { ServiceModel } from "models/OffertModel";

export class ServiceService {

    constructor(
        private readonly conection: Conection
    ) { }

    GetAgendedOfferts = (email: string, page?: number, rows?: number): Promise<void> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const serviceModel = new ServiceModel(client);
            try {
                page = page ? page - 1 : 0;
                rows = rows ?? 10;

                const _user = await serviceModel.getAllByUserAgended(email, page, rows);


                await this.conection.commit(client);
                res();
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

}