import { AuthorizeAll, Controller, FromBody, Get, Path, Post } from "../router/router";
import { Response, Request, NextFunction } from "express";
import { ServiceService } from "../services/ServiceService";
import { ServicePostValidator } from "../utils/validators/ServiceValidator";


@Controller()
@AuthorizeAll()
export class ServiceController {

    constructor(
        private readonly serviceService: ServiceService
    ) {
    }

    @Post()
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

    @Get()
    async getAllByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;

            const service = await this.serviceService.getAllByUser(user_id);

            (service)
                ? res.Ok(service)
                : res.Failed("No se pudo crear el servicio.")
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

}
