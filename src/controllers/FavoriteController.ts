import { Response, Request, NextFunction } from "express";

import { Controller, FromParam, Post, AuthorizeAll, Delete, Get, FromBody } from "../router/router";
import { UserProviderService } from "../services/UserProviderService";

@Controller()
@AuthorizeAll()
export class FavoriteController {

    constructor(
        private readonly userProviderService: UserProviderService
    ) {
    }

    @Get()
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;

            const favorites = await this.userProviderService.getFavorites(user_id);

            res.Ok(favorites);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    @Post()
    @FromBody("service_provider_id")
    async insert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { service_provider_id } = req.body;

            const favorite = await this.userProviderService.insert(user_id, service_provider_id);

            (favorite)
                ? res.Ok(favorite)
                : res.Failed("No se pudo agregar a favoritos.");
        } catch (error) {
            next(error);
        }
    }

    @Delete()
    @FromBody("service_provider_id")
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { service_provider_id } = req.body;

            const rowCount = await this.userProviderService.delete(user_id, service_provider_id);

            (rowCount > 0)
                ? res.Ok()
                : res.Failed("No se pudo eliminar de favoritos.");
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

} 