import { ServiceError } from '../utils/errors/service.error';
import { Service } from '../interfaces/Service';
import { PoolClient } from 'pg';

export class ServiceModel {
    
    constructor(
        private readonly client?: PoolClient
    ) { }

    getById = (id: string): Promise<Service | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = 'SELECT * FROM dbo."Service" WHERE id = $1';
                const values = [id];
                const result = await this.client.query<Service>(query, values);
                const user = result.rows[0];
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    getAllByUserId = (user_id: string): Promise<Service[]> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = 'SELECT * FROM dbo."Service" WHERE user_id = $1';
                const values = [user_id];
                const result = await this.client.query<Service>(query, values);
                const user = result.rows;
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    insert = (user: Service): Promise<Service | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const columns = Object.keys(user).join(', ');
                const placeholders = Object.entries(user).map((_, i) => `$${i + 1}`).join(', ');
                const values = Object.values(user);

                const query = `INSERT INTO dbo."Service" (${columns}) VALUES (${placeholders}) RETURNING *`;
                const result = await this.client.query<Service>(query, values);
                const _user = result.rows[0];
                res(_user);
            } catch (error) {
                rej(error);
            }
        });
    };

}