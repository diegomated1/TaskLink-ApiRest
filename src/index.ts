import dotenv from 'dotenv';
dotenv.config();

import { Database } from './database/database';
import router from './router/router';
import App from './app';
import { UserController } from './controllers/UserController';
import { UserModel } from './models/UserModel';
import { UserService } from './services/UserService';
import { AuthService } from './services/AuthService';
import { AuthController } from './controllers/AuthController';

function main(): App {

    // Database
    const enviorement = process.env.enviorement ?? "development";
    const conectionString = enviorement === "production" ? process.env.POSTGRES_CONECTIONSTRING! : process.env.POSTGRES_CONECTIONSTRING_DEBUG!;

    const database = new Database(conectionString);
    database.connect();

    // User
    const userModel = new UserModel(database);
    const userService = new UserService(userModel);
    new UserController(userService);

    // Auth
    const authService = new AuthService(userModel);
    new AuthController(authService);

    router.addService(userService);
    router.addService(authService);

    const app = new App(router.Router(), database);
    app.start();

    return app;
}

export default main()