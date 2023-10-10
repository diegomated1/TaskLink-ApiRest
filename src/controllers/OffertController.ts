import { AuthorizeAll, Controller, FromBody, FromParam, FromQuery, Get, Path, Post, Put } from "../router/router";
import { Response, Request, NextFunction } from "express";
import { LocationValidator, OffertPostValidator, OffertPutValidator } from "../utils/validators/OffertValidator";
import { OffertService } from "../services/OffertService";


@Controller()
@AuthorizeAll()
export class OffertController {

    constructor(
        private readonly offertService: OffertService
    ) { }

    @Post("", "Create an offer of a service")
    @FromBody("Offert", OffertPostValidator) 
    @FromBody("address", false) 
    @FromBody("location", LocationValidator, false)
    @FromBody("provider_location", LocationValidator, false)
    async insert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { Offert, address, location, provider_location } = req.body;

            const service = await this.offertService.insert(user_id, Offert, address, location, provider_location);

            (service)
                ? res.Ok(service)
                : res.Failed("No se pudo crear la oferta.")
        } catch (error) {
            next(error);
        }
    }

    @Get("/{offert_id}", "Get an offer by ID")
    @FromParam("offert_id")
    async getOffertById(req: Request, res: Response, next: NextFunction) {
        try {
            const { offert_id } = req.params;
            
            const offert = await this.offertService.getById(offert_id);

            (offert)
                ? res.Ok(offert)
                : res.NotFound("Oferta no encontrada");
            
        } catch (error) {
            next(error);
        }
    };

    @Get("", "Get all the offers made by me")
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
            next(error);
        }
    };

    @Get("/my-offerts", "Get all the offers that have requested me")
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
            next(error);
        }
    };

    @Put("/{offert_id}", "Update an offer")
    @FromParam("offert_id") @FromBody("Offert", OffertPutValidator)
    async updateOffert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { offert_id } = req.params;
            const { Offert } = req.body;

            const aggendedOfferts = await this.offertService.update(user_id, offert_id, Offert);

            res.Ok(aggendedOfferts);
        } catch (error) {
            next(error);
        }
    };

    @Path("/{offert_id}/address", "Update addressing an offer")
    @FromParam("offert_id") @FromBody("address")
    async updateProviderUserLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { offert_id } = req.params;
            const { address } = req.body;

            const aggendedOfferts = await this.offertService.updateAddress(offert_id, address);

            res.Ok(aggendedOfferts);
        } catch (error) {
            next(error);
        }
    };

    @Post("/{offert_id}/action/accept", "Accept an offer")
    @FromParam("offert_id") @FromBody("status_id")
    async acceptOffert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { offert_id } = req.params;

            const aggendedOfferts = await this.offertService.accept(user_id, offert_id);

            res.Ok(aggendedOfferts);
        } catch (error) {
            next(error);
        }
    };

    @Post("/{offert_id}/action/decline", "Decline an offer")
    @FromParam("offert_id") @FromBody("status_id")
    async declineOffert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { offert_id } = req.params;

            const aggendedOfferts = await this.offertService.decline(user_id, offert_id);

            res.Ok(aggendedOfferts);
        } catch (error) {
            next(error);
        }
    };

    @Post("/{offert_id}/action/cancel", "Cancel a service")
    @FromParam("offert_id") @FromBody("status_id")
    async cancelOffert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { offert_id } = req.params;

            const aggendedOfferts = await this.offertService.cancel(user_id, offert_id);

            res.Ok(aggendedOfferts);
        } catch (error) {
            next(error);
        }
    };

    @Post("/{offert_id}/action/end", "Finish a service")
    @FromParam("offert_id") @FromBody("status_id")
    async endOffert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { offert_id } = req.params;

            const aggendedOfferts = await this.offertService.end(user_id, offert_id);

            res.Ok(aggendedOfferts);
        } catch (error) {
            next(error);
        }
    };

}
