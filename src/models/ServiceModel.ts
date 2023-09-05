import { ServiceError } from '../utils/errors/service.error';
import { Service } from '../interfaces/Service';
import { PoolClient } from 'pg';
import { Category } from 'interfaces/Category';
import { ServiceGet } from 'interfaces/queries/Services';

export class ServiceModel {
    
    constructor(
        private readonly client?: PoolClient
    ) { }

    getById = (id: string): Promise<ServiceGet | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query =  `SELECT s.id, s.price, s.calification, s.description, s.category_id, c.name AS category
                                FROM dbo."Service" s
                                INNER JOIN dbo."Category" c ON c.id = s.category_id 
                                WHERE id = $1`;
                const values = [id];
                const result = await this.client.query<ServiceGet>(query, values);
                const user = result.rows[0];
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    getAllByUser = (user_id: string): Promise<ServiceGet[]> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query =  `SELECT s.id, s.price, s.calification, s.description, s.category_id, c.name AS category
                                FROM dbo."Service" s
                                INNER JOIN dbo."Category" c ON c.id = s.category_id 
                                WHERE user_id = $1`;
                const values = [user_id];
                const result = await this.client.query<ServiceGet>(query, values);
                const user = result.rows;
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    insert = (user: Omit<Service, "id">): Promise<Service | null> => {
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
                console.log(error)
                rej(error);
            }
        });
    };

}