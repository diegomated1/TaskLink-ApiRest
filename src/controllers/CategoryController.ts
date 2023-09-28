import { AuthorizeAll, Controller, Get } from "../router/router";
import { Response, Request, NextFunction } from "express";
import { CategoryService } from "../services/CategoryService";


@Controller()
@AuthorizeAll()
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) {
    }

    @Get("", "Obtain all services categories")
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await this.categoryService.getAll();

            res.Ok(categories);
        } catch (error) {
            next(error);
        }
    };
}
