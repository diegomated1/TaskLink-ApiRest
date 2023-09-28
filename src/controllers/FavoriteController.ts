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

    @Get("", "Get all user favorites")
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;

            const favorites = await this.userProviderService.getFavorites(user_id);

            res.Ok(favorites);
        } catch (error) {
            next(error);
        }
    }

    @Post("/{service_provider_id}", "Add a favorite")
    @FromParam("service_provider_id")
    async insert(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { service_provider_id } = req.params;

            const favorite = await this.userProviderService.insertFavorite(user_id, service_provider_id);

            (favorite)
                ? res.Ok(favorite)
                : res.Failed("No se pudo agregar a favoritos.");
        } catch (error) {
            next(error);
        }
    }

    @Delete("/{service_provider_id}", "Delete favorite")
    @FromBody("service_provider_id")
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { service_provider_id } = req.body;

            const rowCount = await this.userProviderService.deleteFavorite(user_id, service_provider_id);

            (rowCount > 0)
                ? res.Ok()
                : res.Failed("No se pudo eliminar de favoritos.");
        } catch (error) {
            next(error);
        }
    }

} 