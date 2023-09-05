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
import { ServiceController } from './controllers/ServiceController';
import { ServiceService } from './services/ServiceService';

import { types } from 'pg'
types.setTypeParser(1700, function (val) {
    return parseFloat(val);
});

function main(): App {

    // Database
    const enviorent = process.env.ENVIORENT ?? "development";
    const conectionString = enviorent === "production" ? process.env.POSTGRES_CONECTIONSTRING! : process.env.POSTGRES_CONECTIONSTRING_DEV!;

    const database = new Database(conectionString);

    const conection = new Conection(database);

    // Services
    const userService = new UserService(conection);
    const authService = new AuthService(conection);
    const emailService = new EmailService(conection);
    const userProviderService = new UserProviderService(conection);
    const serviceService = new ServiceService(conection);

    // Controllers
    new UserController(userService);
    new AuthController(authService, emailService, userService);
    new UserProviderController(userProviderService);
    new FavoriteController(userProviderService);
    new ServiceController(serviceService);


    router.addAuthMiddleware(AuthMiddleware);
    router.addService(userService);
    router.addService(authService);
    router.addService(userProviderService);
    router.addService(emailService);
    router.addService(serviceService);

    const app = new App(router.Router(), database);
    app.start();

    return app;
}

export default main()