import { Response, Request, NextFunction } from "express";

import { Controller, FromParam, Post, AuthorizeAll, Delete, Get } from "../router/router";
import { UserProviderService } from "../services/UserProviderService";

@Controller()
@AuthorizeAll()
export class FavoriteController {

    constructor(
        private readonly userProviderService: UserProviderService
    ) {
    }

    @Get("/user/{user_id}")
    @FromParam("user_id")
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;

            const favorites = await this.userProviderService.getFavorites(user_id);

            res.Ok(favorites);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    @Post("/user/{user_id}/favorite/{service_provider_id}")
    @FromParam("user_id") @FromParam("service_provider_id")
    async insert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id, service_provider_id } = req.params;

            const favorite = await this.userProviderService.insert(user_id, service_provider_id);

            (favorite)
                ? res.Ok(favorite)
                : res.NotFound("No se pudo agregar a favoritos.");
        } catch (error) {
            next(error);
        }
    }

    @Delete("/user/{user_id}/favorite/{service_provider_id}")
    @FromParam("user_id") @FromParam("service_provider_id")
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id, service_provider_id } = req.params;

            const rowCount = await this.userProviderService.delete(user_id, service_provider_id);

            (rowCount > 0)
                ? res.Ok()
                : res.NotFound("No se pudo eliminar de favoritos.");
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

} 