import { AuthorizeAll, Controller, FromBody, FromParam, Get, Post } from "../router/router";
import { Response, Request, NextFunction } from "express";
import { ServiceService } from "../services/ServiceService";
import { ServicePostValidator } from "../utils/validators/ServiceValidator";


@Controller()
@AuthorizeAll()
export class ServiceController {

    constructor(
        private readonly serviceService: ServiceService
    ) { }

    @Post("", "Create a service")
    @FromBody("Service", ServicePostValidator)
    async insert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { Service } = req.body;

            const service = await this.serviceService.insert(user_id, Service);

            (service)
                ? res.Ok(service)
                : res.Failed("No se pudo crear el servicio.")
        } catch (error) {
            next(error);
        }
    }

    @Get("/{service_id}", "Get service by id")
    @FromParam("service_id")
    async getById(req: Request, res: Response, next: NextFunction) {
        try{
            const { service_id } = req.params;
            
            const services = await this.serviceService.getById(parseInt(service_id));

            res.Ok(services);
        }catch(error){
            next(error);
        }
    }

    @Get("/all", "Get all services")
    async getAll(req: Request, res: Response, next: NextFunction) {
        try{
            const { category_id } = req.params;
            
            const services = await this.serviceService.getAll();

            res.Ok(services);
        }catch(error){
            next(error);
        }
    }


    @Get("", "Get all services per user")
    async getAllByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;

            const service = await this.serviceService.getAllByUser(user_id);

            (service)
                ? res.Ok(service)
                : res.Failed("No se pudo crear el servicio.")
        } catch (error) {
            next(error);
        }
    }

    @Post("/{service_id}/rate", "Rate a service")
    @FromParam("service_id") @FromBody("calification")
    async rate(req: Request, res: Response, next: NextFunction) {
        try{
            const { user_id } = res.locals;
            const { service_id } = req.params;
            const { calification } = req.body;

            const result = await this.serviceService.rate(user_id, parseFloat(service_id), calification);

            res.Ok(result);
        }catch(error){
            next(error);
        }
    }

    @Get("/all/category/{category_id}", "Obtain services per category")
    @FromParam("category_id")
    async getAllByCategory(req: Request, res: Response, next: NextFunction) {
        try{
            const { category_id } = req.params;
            
            const services = await this.serviceService.getAllByCategory(parseInt(category_id));

            res.Ok(services);
        }catch(error){
            next(error);
        }
    }

}
