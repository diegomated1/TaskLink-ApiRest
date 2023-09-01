import { PoolClient } from "pg";
import { Conection } from "../database/Conection";

export class BaseModel {

    client?: PoolClient
    constructor(
        private readonly conection: Conection
    ) { }

    start = (): Promise<void> => {
        return new Promise(async (res, rej) => {
            try {
                this.client = await this.conection.connect();
                await this.client.query("BEGIN");
                res();
            } catch (err) {
                rej(err);
            }
        });
    }

    commit = () => this.conection.commit(this.client);

    rollback = () => this.conection.rollback(this.client);
}
