import { Service } from "interfaces/Service";
import { Conection } from "../database/Conection";
import { ServiceModel } from "../models/ServiceModel";
import { ServiceGet } from "interfaces/queries/Services";

export class ServiceService {

    constructor(
        private readonly conection: Conection
    ) { }

    getAllByUser = (user_id: string): Promise<ServiceGet[]> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const serviceModel = new ServiceModel(client);
            try {

                const _services = await serviceModel.getAllByUser(user_id);

                await this.conection.commit(client);
                res(_services);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

    insert = (user_id: string, service: Partial<Service>): Promise<Service | null> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const serviceModel = new ServiceModel(client);
            try {

                const new_service: Omit<Service, "id"> = {
                    calification: 5,
                    calification_acu: 0,
                    calification_count: 0,
                    category_id: service.category_id!,
                    description: service.description!,
                    price: service.price!,
                    user_id
                }

                const _service = await serviceModel.insert(new_service);

                await this.conection.commit(client);
                res(_service);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }
    
}