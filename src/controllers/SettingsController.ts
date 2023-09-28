import { AuthorizeAll, Controller, Get } from "../router/router";
import { Response, Request, NextFunction } from "express";
import { SettingsService } from "../services/SettingsService";


@Controller()
@AuthorizeAll()
export class SettingsController {

    constructor(
        private readonly settingsService: SettingsService
    ) {
    }

    @Get("", "Get a user's configuration")
    async getSettingsByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = res.locals;
            const settings = await this.settingsService.getSettingsByUser(user_id);

            res.Ok(settings);
        } catch (error) {
            next(error);
        }
    };
}
