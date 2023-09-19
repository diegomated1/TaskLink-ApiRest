import { UserProviderService } from "../services/UserProviderService";
import { AuthorizeAll, Controller, FromBody, FromParam, Path, Post } from "../router/router";
import { Response, Request, NextFunction } from "express";


@Controller()
@AuthorizeAll()
export class UserProviderController {

    constructor(
        private readonly userProviderService: UserProviderService
    ) {
    }

    @Path()
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            
            await this.userProviderService.request(user_id);

            res.Ok();
        } catch (error) {
            next(error);
        }
    };

    @Post("/available-days")
    @FromBody("available_days")
    async setAvailableDays(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const { available_days } = req.body;

            await this.userProviderService.setAvailableDays(user_id, available_days);

            res.Ok();
        } catch (error) {
            next(error);
        }
    };
    

}
