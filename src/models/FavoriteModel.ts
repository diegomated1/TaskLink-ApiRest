import { Favorite } from 'interfaces/Favorite';
import { ServiceError } from '../utils/errors/service.error';
import { User } from '../interfaces/User';
import { PoolClient } from 'pg';

export class FavoriteModel {

    constructor(
        private readonly client?: PoolClient
    ) { }

    getOne = (id: string, service_provider_id: string): Promise<User> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query =  `SELECT u.* FROM dbo."Favorite" f 
                                INNER JOIN dbo."User" u on u.id = f.service_provider_id 
                                WHERE f.user_id = $1 AND f.service_provider_id = $2`;
                const values = [id, service_provider_id];
                const result = await this.client.query<User>(query, values);
                const favorite = result.rows[0];
                res(favorite);
            } catch (error) {
                rej(error);
            }
        });
    };

    getAllByUserId = (id: string): Promise<User[]> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query =  `SELECT u.*, r.name as role, it.name as identification_type FROM dbo."Favorite" f 
                                INNER JOIN dbo."User" u on u.id = f.service_provider_id 
                                INNER JOIN dbo."Role" r on r.id = u.role_id
                                INNER JOIN dbo."IdentificationType" it on it.id = u.identification_type_id
                                WHERE f.user_id = $1`;
                const values = [id];
                const result = await this.client.query<User>(query, values);
                const favorites = result.rows;
                res(favorites);
            } catch (error) {
                rej(error);
            }
        });
    };

    insert = (user_id: string, service_provider_id: string): Promise<Favorite | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const values = [user_id, service_provider_id];
                const query = `INSERT INTO dbo."Favorite" (user_id, service_provider_id) VALUES ($1, $2) RETURNING *`;
                const result = await this.client.query<Favorite>(query, values);
                const _Favorite = result.rows[0];
                res(_Favorite);
            } catch (error) {
                rej(error);
            }
        });
    };

    delete = (user_id: string, service_provider_id: string): Promise<number> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const values = [user_id, service_provider_id];
                const query = `delete from dbo."Favorite" where user_id = $1 and service_provider_id = $2`;
                const result = await this.client.query(query, values);
                
                res(result.rowCount);
            } catch (error) {
                rej(error);
            }
        });
    };
}