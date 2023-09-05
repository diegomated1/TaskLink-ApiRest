import { Conection } from "../database/Conection";
import { Offert } from "../interfaces/Offert"
import { OffertModel } from "../models/OffertModel";
import { OffertGet } from "../interfaces/queries/Offert";
import { ServiceError } from "../utils/errors/service.error";
import { HttpStatusCode } from "../router/RouterTypes";

export class OffertService {

    constructor(
        private readonly conection: Conection
    ) { }

    
    insert = (user_id: string, offert: Partial<Offert>): Promise<Offert | null> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const serviceModel = new OffertModel(client);
            try {

                const new_service: Partial<Offert> = {
                    agended_date: offert.agended_date!,
                    created_date: new Date(),
                    price: offert.price!,
                    service_id: offert.service_id!,
                    status_id: 1,
                    user_id
                }

                const _offert = await serviceModel.insert(new_service);

                await this.conection.commit(client);
                res(_offert);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    getByPage = (email: string, page?: number, rows?: number, status_id?: number): Promise<OffertGet[]> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const offertModel = new OffertModel(client);
            try {
                page = Math.abs(page ?? 1);
                rows = Math.abs(rows ?? 10);

                const _offerts = await offertModel.getAllByUserAgended(email, page, rows, status_id);

                await this.conection.commit(client);
                res(_offerts);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    update =  (user_id: string, offert_id: string, offert: Partial<Offert>) => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const offertModel = new OffertModel(client);
            try {
                const offertCheck = await offertModel.getById(offert_id);

                if (!offertCheck)
                    throw new ServiceError("Oferta no encontrada.", HttpStatusCode.NOT_FOUND);

                const user = await offertModel.update(offert_id, offert);

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

}