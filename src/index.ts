import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import { Database } from './database/database';
import fs from 'fs';
import router from './router/router';
import App from './app';

function main(): App {

    // Database
    const enviorement = process.env.enviorement ?? "development";
    const conectionString = enviorement === "production" ? process.env.POSTGRES_CONECTIONSTRING! : process.env.POSTGRES_CONECTIONSTRING_DEBUG!;

    const database = new Database(conectionString);
    database.connect();

    const app = new App(router.Router(), database);
    app.start();

    return app;
}

export default main()