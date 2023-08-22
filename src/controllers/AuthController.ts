import { Controller, FromBody, Post } from "../router/router";
import { AuthService } from "../services/AuthService";
import { Response, Request, NextFunction } from "express";


@Controller()
export class AuthController {

    constructor(
        private readonly authService: AuthService
      ) {
      }

    
    @Post("/sesion")
    @FromBody("email")
    @FromBody("password")
    async login(req: Request, res: Response, next: NextFunction) {
        try {
          const { email,password } = req.body;
    
          const _user = await this.authService.login(email,password);
    
          res.Ok(_user);
        } catch (error) {
          next(error);
        }
      };
}
