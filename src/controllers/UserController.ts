import { Response, Request, NextFunction } from "express";
import { validate } from "uuid";

import { Controller, Get, FromParam, Post, FromBody, Put, FromHeader, Delete, AuthorizeAll } from "../router/router";
import { UserPutValidator } from "../utils/validators/UserValidator";
import { UserService } from "../services/UserService";

@Controller()
@AuthorizeAll()
export class UserController {

  constructor(
    private readonly userService: UserService
  ) {
  }

  @Get()
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const all_users = await this.userService.getAll();
      res.Ok(all_users);
    } catch (error) {
      next(error);
    }
  };

  @Get("/{user_id}")
  @FromParam("user_id")
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      if (!validate(user_id)) return res.Failed("Id de usuario no valido.");

      const user = await this.userService.getById(user_id);

      (user)
        ? res.Ok(user)
        : res.NotFound("Usuario no encontrado.");
    } catch (error) {
      next(error);
    }
  };

  @Put()
  @FromBody("User", UserPutValidator)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = res.locals;
      const { User } = req.body;

      const _user = await this.userService.update(user_id, User);

      (_user)
        ? res.Ok(_user)
        : res.Failed();
    } catch (error) {
      next(error);
    }
  };

  @Delete()
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = res.locals;
      const result = await this.userService.delete(user_id);
      (result)
        ? res.Ok()
        : res.Failed();
    } catch (error) {
      next(error);
    }
  };

  @Post("/forgot-password")
  @FromBody("email")
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await this.userService.forgotPassword(email);

      res.Ok()
    } catch (error) {
      next(error);
    }
  }

  @Post("/reset-password")
  @FromBody("email") @FromBody("email_code") @FromBody("new_password")
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, email_code, new_password } = req.body;
      await this.userService.resetPassword(email, email_code, new_password);
      
      res.Ok()
    } catch (error) {
      next(error);
    }
  }

} 