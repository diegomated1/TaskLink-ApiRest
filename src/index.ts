import dotenv from 'dotenv';
dotenv.config();

import { Database } from './database/database';
import router from './router/router';
import App from './app';
import { UserController } from './controllers/UserController';
import { UserService } from './services/UserService'; 
import { AuthService } from './services/AuthService';
import { AuthController } from './controllers/AuthController';
import { AuthMiddleware } from './middlewares/AuthMiddleware';
import { Conection } from './database/Conection';
import { UserProviderService } from './services/UserProviderService';
import { UserProviderController } from './controllers/UserProviderController';
import { EmailService } from './services/EmailService';
import { FavoriteController } from './controllers/FavoriteController';

function main(): App {

    // Database
    const enviorent = process.env.ENVIORENT ?? "development";
    const conectionString = enviorent === "production" ? process.env.POSTGRES_CONECTIONSTRING! : process.env.POSTGRES_CONECTIONSTRING_DEV!;

    const database = new Database(conectionString);

    const conection = new Conection(database);

    // User
    const userService = new UserService(conection);
    new UserController(userService);

    // Auth
    const authService = new AuthService(conection);
    const emailService = new EmailService(conection);
    new AuthController(authService, emailService, userService);

    // Provider
    const userProviderService = new UserProviderService(conection);
    new UserProviderController(userProviderService);

    // Favorite
    new FavoriteController(userProviderService);


    router.addAuthMiddleware(AuthMiddleware);
    router.addService(userService);
    router.addService(authService);
    router.addService(userProviderService);
    router.addService(emailService);

    const app = new App(router.Router(), database);
    app.start();

    return app;
}

export default main()