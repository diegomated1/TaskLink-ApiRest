import { UserProviderService } from "../services/UserProviderService";
import { Controller, FromParam, Path } from "../router/router";
import { Response, Request, NextFunction } from "express";


@Controller()
export class UserProviderController {

    constructor(
        private readonly userProviderService: UserProviderService
    ) {
    }

    @Path("/{id_user}")
    @FromParam("id_user")
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { id_user } = req.params;
            
            await this.userProviderService.request(id_user);

            res.Ok();
        } catch (error) {
            next(error);
        }
    };
}
