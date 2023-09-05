import { AuthorizeAll, Controller, FromBody, FromParam, FromQuery, Get, Path, Post } from "../router/router";
import { Response, Request, NextFunction } from "express";
import { OffertPostValidator, OffertPutValidator } from "../utils/validators/OffertValidator";
import { OffertService } from "../services/OffertService";


@Controller()
@AuthorizeAll()
export class OffertController {

    constructor(
        private readonly offertService: OffertService
    ) {
    }

    @Post()
    @FromBody("Offert", OffertPostValidator)
    async insert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { Offert } = req.body;

            const service = await this.offertService.insert(user_id, Offert);

            (service)
                ? res.Ok(service)
                : res.Failed("No se pudo crear la oferta.")
        } catch (error) {
            next(error);
        }
    }

    @Get()
    @FromQuery("page") @FromQuery("rows") @FromQuery("status_id") @FromQuery("price")
    async getOfferts(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            let { page, rows, status_id, price } = req.query;
            const _page = page ? parseInt(page.toString()) : undefined;
            const _rows = rows ? parseInt(rows.toString()) : undefined;
            const _status_id = status_id ? parseInt(status_id.toString()) : undefined;
            const _price = price ? price.toString() : undefined;
            
            const aggendedOfferts = await this.offertService.getOfferts(user_id, _page, _rows, _status_id, _price);

            res.Ok(aggendedOfferts);
        } catch (error) {
            console.log(error)
            next(error);
        }
    };

    @Get("/my-offerts")
    @FromQuery("page") @FromQuery("rows") @FromQuery("status_id") @FromQuery("price")
    async getMyOfferts(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            let { page, rows, status_id, price } = req.query;
            const _page = page ? parseInt(page.toString()) : undefined;
            const _rows = rows ? parseInt(rows.toString()) : undefined;
            const _status_id = status_id ? parseInt(status_id.toString()) : undefined;
            const _price = price ? price.toString() : undefined;
            
            const aggendedOfferts = await this.offertService.getMyOfferts(user_id, _page, _rows, _status_id, _price);

            res.Ok(aggendedOfferts);
        } catch (error) {
            console.log(error)
            next(error);
        }
    };

    @Path("/{offert_id}")
    @FromParam("offert_id")
    @FromBody("Offert", OffertPutValidator)
    async updateOffert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { offert_id } = req.params;
            const { Offert } = req.body;

            const aggendedOfferts = await this.offertService.update(user_id, offert_id, Offert);

            res.Ok(aggendedOfferts);
        } catch (error) {
            console.log(error)
            next(error);
        }
    };
}
