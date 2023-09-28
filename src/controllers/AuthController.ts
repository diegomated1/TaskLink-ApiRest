import { EmailService } from "../services/EmailService";
import { Authorize, Controller, FromBody, FromParam, Post } from "../router/router";
import { AuthService } from "../services/AuthService";
import { Response, Request, NextFunction } from "express";
import { UserPostValidator } from "../utils/validators/UserValidator";
import { UserService } from "../services/UserService";


@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UserService
  ) {
  }


  @Post("/sesion", "Log in")
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

  @Post("/register", "Register")
  @FromBody("User", UserPostValidator)
  async insert(req: Request, res: Response, next: NextFunction) {
    try {
      const { User } = req.body;

      const _user = await this.userService.insert(User);

      res.Ok(_user);
    } catch (error) {
      next(error);
    }
  };

  @Post("/verify-email", "Send Verification Code to Email")
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

  @Post("/verify-email-code", "Verify email code")
  @Authorize()
  @FromBody("email_code")
  async verifyEmailCode(req: Request, res: Response, next: NextFunction) {
    try{
      const { user_id } = res.locals;
      const { email_code } = req.body;

      await this.emailService.VerifyEmailCode(user_id, email_code);

      res.Ok();
    }catch(error){
      next(error);
    }
  }
}
