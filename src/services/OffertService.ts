import { Conection } from "../database/Conection";
import { Offert } from "../interfaces/Offert"
import { OffertModel } from "../models/OffertModel";
import { OffertGet } from "../interfaces/queries/Offert";
import { ServiceError } from "../utils/errors/service.error";
import { HttpStatusCode } from "../router/RouterTypes";
import { StatusModel } from "../models/StatusModel";

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

    getMyOfferts = (email: string, page?: number, rows?: number, status_id?: number, price?: string): Promise<OffertGet[]> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const offertModel = new OffertModel(client);
            try {
                page = Math.abs(page ?? 1);
                rows = Math.abs(rows ?? 10);

                const _offerts = await offertModel.getMyOfferts(email, page, rows, status_id, price);

                await this.conection.commit(client);
                res(_offerts);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    getOfferts = (email: string, page?: number, rows?: number, status_id?: number, price?: string): Promise<OffertGet[]> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const offertModel = new OffertModel(client);
            try {
                page = Math.abs(page ?? 1);
                rows = Math.abs(rows ?? 10);

                const _offerts = await offertModel.getOfferts(email, page, rows, status_id, price);

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

    accept =  (user_id: string, offert_id: string): Promise<Offert> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const offertModel = new OffertModel(client);
            try {

                const offertCheck = await offertModel.getByIdByServiceProvider(offert_id, user_id);

                if (!offertCheck)
                    throw new ServiceError("Oferta no encontrada.", HttpStatusCode.NOT_FOUND);

                const offert = await offertModel.update(offert_id, {
                    status_id: 2
                });

                if (!offert)
                    throw new ServiceError("No se pudo actualizar la oferta.", HttpStatusCode.INTERNAL_SERVER_ERROR);

                await this.conection.commit(client);
                res(offert);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    };

    decline =  (user_id: string, offert_id: string): Promise<Offert> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const offertModel = new OffertModel(client);
            try {

                const offertCheck = await offertModel.getByIdByServiceProvider(offert_id, user_id);

                if (!offertCheck)
                    throw new ServiceError("Oferta no encontrada.", HttpStatusCode.NOT_FOUND);

                const offert = await offertModel.update(offert_id, {
                    status_id: 5
                });

                if (!offert)
                    throw new ServiceError("No se pudo actualizar la oferta.", HttpStatusCode.INTERNAL_SERVER_ERROR);

                await this.conection.commit(client);
                res(offert);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    };

    cancel =  (user_id: string, offert_id: string): Promise<Offert> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const offertModel = new OffertModel(client);
            try {

                const offertCheck = await offertModel.getByIdByServiceProvider(offert_id, user_id);

                if (!offertCheck)
                    throw new ServiceError("Oferta no encontrada.", HttpStatusCode.NOT_FOUND);

                const offert = await offertModel.update(offert_id, {
                    status_id: 4
                });

                if (!offert)
                    throw new ServiceError("No se pudo actualizar la oferta.", HttpStatusCode.INTERNAL_SERVER_ERROR);

                await this.conection.commit(client);
                res(offert);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    };

    end =  (user_id: string, offert_id: string): Promise<Offert> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const offertModel = new OffertModel(client);
            try {

                const offertCheck = await offertModel.getByIdByServiceProvider(offert_id, user_id);

                if (!offertCheck)
                    throw new ServiceError("Oferta no encontrada.", HttpStatusCode.NOT_FOUND);

                const offert = await offertModel.update(offert_id, {
                    status_id: 3
                });

                if (!offert)
                    throw new ServiceError("No se pudo actualizar la oferta.", HttpStatusCode.INTERNAL_SERVER_ERROR);

                await this.conection.commit(client);
                res(offert);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    };

}