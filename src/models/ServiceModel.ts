import { ServiceError } from '../utils/errors/service.error';
import { Service } from '../interfaces/Service';
import { PoolClient } from 'pg';
import { ServiceGet } from 'interfaces/queries/Services';

export class ServiceModel {
    
    constructor(
        private readonly client?: PoolClient
    ) { }

    getById = (id: number): Promise<ServiceGet | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query =  `SELECT s.id, s.price, s.calification, s.calification_count, s.calification_acu, s.description, s.category_id, 
                                s.user_id, c.name AS category
                                FROM dbo."Service" s
                                INNER JOIN dbo."Category" c ON c.id = s.category_id 
                                WHERE s.id = $1`;
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

    getAllByCategory = (category_id: number): Promise<ServiceGet[]> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query =  `SELECT s.id, s.price, s.calification, s.description, s.category_id, c.name AS category
                                FROM dbo."Service" s
                                INNER JOIN dbo."Category" c ON c.id = s.category_id 
                                WHERE category_id = $1`;
                const values = [category_id];
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
                rej(error);
            }
        });
    };

    update = (service_id: number, entity: Partial<Service>): Promise<Service | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const updateClauses = Object.entries(entity)
                    .map(([key, value], i) => `"${key}" = $${i + 1}`)
                    .join(', ');

                const query = `UPDATE dbo."Service" s SET ${updateClauses} WHERE s.Id = $${Object.keys(entity).length + 1} RETURNING *`;

                const values = [...Object.values(entity), service_id];

                const result = await this.client.query<Service>(query, values);
                const _service = result.rows[0];

                res(_service);
            } catch (error) {
                rej(error);
            }
        });
    };

}