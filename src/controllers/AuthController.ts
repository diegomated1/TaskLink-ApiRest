import { EmailService } from "../services/EmailService";
import { Authorize, Controller, FromBody, FromParam, Post } from "../router/router";
import { AuthService } from "../services/AuthService";
import { Response, Request, NextFunction } from "express";


@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService
  ) {
  }


  @Post("/sesion")
  @FromBody("email")
  @FromBody("password")
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const _token = await this.authService.login(email, password);

      res.Ok(_token);
    } catch (error) {
      next(error);
    }
  };

  @Post("/verify-email")
  @Authorize()
  @FromBody("email")
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try{
      const { email } = req.body;

      await this.emailService.VerifyEmail(email);

      res.Ok();
    }catch(error){
      next(error);
    }
  }

  @Post("/verify-email-code/{userId}")
  @Authorize()
  @FromParam("userId")
  @FromBody("email_code")
  async verifyEmailCode(req: Request, res: Response, next: NextFunction) {
    try{
      const { email_code } = req.body;
      const { userId } = req.params;

      await this.emailService.VerifyEmailCode(userId, email_code);

      res.Ok();
    }catch(error){
      next(error);
    }
  }
}
