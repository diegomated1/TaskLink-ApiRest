import { ServiceError } from '../utils/errors/service.error';
import { Service } from '../interfaces/Service';
import { Offert } from '../interfaces/Offert';
import { PoolClient } from 'pg';
import { OffertGet } from '../interfaces/queries/Offert';
import { QUEEY_offerts, QUERY_myOfferts } from './queries/Offert';

export class OffertModel {
    
    constructor(
        private readonly client?: PoolClient
    ) { }

    getById = (id: string): Promise<Offert | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = 'SELECT * FROM dbo."Offert" WHERE id = $1';
                const values = [id];
                const result = await this.client.query<Offert>(query, values);
                const offert = result.rows[0];
                res(offert);
            } catch (error) {
                rej(error);
            }
        });
    };

    getByIdByUser = (id: string, user_id: string): Promise<Offert | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = 'SELECT * FROM dbo."Offert" WHERE id = $1 AND user_id = $2';
                const values = [id, user_id];
                const result = await this.client.query<Offert>(query, values);
                const offert = result.rows[0];
                res(offert);
            } catch (error) {
                rej(error);
            }
        });
    };

    getByIdByServiceProvider = (id: string, user_id: string): Promise<Offert | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = `SELECT * FROM dbo."Offert" o 
                INNER JOIN dbo."Service" s ON s.id = o.service_id
                WHERE o.id = $1 AND s.user_id = $2`;
                const values = [id, user_id];
                const result = await this.client.query<Offert>(query, values);
                const offert = result.rows[0];
                res(offert);
            } catch (error) {
                rej(error);
            }
        });
    };

    insert = (offert: Partial<Offert>): Promise<Offert | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const columns = Object.keys(offert).join(', ');
                const placeholders = Object.entries(offert).map((_, i) => `$${i + 1}`).join(', ');
                const values = Object.values(offert);

                const query = `INSERT INTO dbo."Offert" (${columns}) VALUES (${placeholders}) RETURNING *`;
                const result = await this.client.query<Offert>(query, values);
                const _user = result.rows[0];
                res(_user);
            } catch (error) {
                rej(error);
            }
        });
    };

    getMyOfferts = (user_id: string, page: number, rows: number, status_id?: number, price?: string): Promise<OffertGet[]> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query =  QUERY_myOfferts;
                const offset = ((page-1) * rows);
                const values = [user_id, status_id, price, rows, offset];
                
                const result = await this.client.query<OffertGet>(query, values);
                const user = result.rows;
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    getOfferts = (user_id: string, page: number, rows: number, status_id?: number, price?: string): Promise<OffertGet[]> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query =  QUEEY_offerts;
                const offset = ((page-1) * rows);
                const values = [user_id, status_id, price, rows, offset];
                
                const result = await this.client.query<OffertGet>(query, values);
                const user = result.rows;
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    update = (offert_id: string, offert: Partial<Offert>): Promise<Offert | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const updateClauses = Object.entries(offert)
                    .map(([key, value], i) => `"${key}" = $${i + 1}`)
                    .join(', ');

                const query = `UPDATE dbo."Offert" SET ${updateClauses} WHERE dbo."Offert".Id = $${Object.keys(offert).length + 1} RETURNING *`;

                const values = [...Object.values(offert), offert_id];

                const result = await this.client.query<Offert>(query, values);
                const _user = result.rows[0];

                res(_user);
            } catch (error) {
                rej(error);
            }
        });
    };

}