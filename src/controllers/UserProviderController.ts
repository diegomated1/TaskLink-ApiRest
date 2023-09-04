import { UserProviderService } from "../services/UserProviderService";
import { AuthorizeAll, Controller, FromParam, Path } from "../router/router";
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
}
