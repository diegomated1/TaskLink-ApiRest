import { Service } from "interfaces/Service";
import { Conection } from "../database/Conection";
import { ServiceModel } from "../models/ServiceModel";
import { ServiceGet } from "../interfaces/queries/Services";
import { ServiceError } from "../utils/errors/service.error";
import { HttpStatusCode } from "../router/RouterTypes";
import { CategoryModel } from "../models/CategoryModel";

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

    getAllByCategory = (category_id: number): Promise<ServiceGet[]> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const serviceModel = new ServiceModel(client);
            const categoryModel = new CategoryModel(client);
            try {
                const category = await categoryModel.getById(category_id);
                if(!category) throw new ServiceError("Categoria no encontrada", HttpStatusCode.NOT_FOUND);

                const categories = await serviceModel.getAllByCategory(category_id);

                await this.conection.commit(client);
                res(categories);
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
    
    rate = (user_id: string, service_id: number, calification: number): Promise<Service> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const serviceModel = new ServiceModel(client);
            try {

                const _service = await serviceModel.getById(service_id);
                if(!_service) throw new ServiceError("Servicio no encontrado.", HttpStatusCode.NOT_FOUND);

                if(_service.user_id == user_id) throw new ServiceError("No puedes calificar tu propio servicio.");

                const newCont = _service.calification_count + 1;
                const newAcu = _service.calification + calification;

                const _serviceUpdate = await serviceModel.update(service_id, {
                    calification_acu: newAcu,
                    calification_count: newCont,
                    calification: newAcu / newCont
                });

                if(!_serviceUpdate) throw new ServiceError("No se pudo calificar el servicio.");

                await this.conection.commit(client);
                res(_serviceUpdate);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

}