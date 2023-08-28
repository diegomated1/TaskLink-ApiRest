import { Response, Request, NextFunction } from "express";
import { validate } from "uuid";

import { Controller, Get, FromParam, Post, FromBody, Put, FromHeader, Delete, AuthorizeAll } from "../router/router";
import { UserPostValidator, UserPutValidator } from "../utils/validators/UserValidator";
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

  @Get("/{id_user}")
  @FromParam("id_user")
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_user } = req.params;
      if (!validate(id_user)) return res.Failed("Id de usuario no valido.");

      const user = await this.userService.getById(id_user);

      (user)
        ? res.Ok(user)
        : res.NotFound("Usuario no encontrado.");
    } catch (error) {
      next(error);
    }
  };

  @Post()
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

  @Put("/{id_user}")
  @FromHeader("Authorization") @FromParam("id_user") @FromBody("User", UserPutValidator)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_user } = req.params;
      const { User } = req.body;

      const _user = await this.userService.update(id_user, User);

      (_user)
        ? res.Ok(_user)
        : res.Failed();
    } catch (error) {
      next(error);
    }
  };

  @Delete("/{id_user}")
  @FromParam("id_user")
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_user } = req.params;
      const result = await this.userService.delete(id_user);
      (result)
        ? res.Ok()
        : res.Failed();
    } catch (error) {
      next(error);
    }
  };

} 