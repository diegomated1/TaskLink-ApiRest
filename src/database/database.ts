import { Client } from "pg";

export class Database {

    client: Client

    constructor(
        private readonly connectionString: string
    ) {
        this.client = new Client({ connectionString: this.connectionString });
    }

    connect = async () => {
        await this.client.connect();
    }

    close = async () => {
        await this.client.end();
    }
} 
