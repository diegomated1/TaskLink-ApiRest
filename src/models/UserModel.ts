import { User } from 'interfaces/User';
import { ServiceError } from '../utils/errors/service.error';
import { PoolClient } from 'pg';

export class UserModel {
    constructor(
        private readonly client?: PoolClient
    ) {
    }

    getById = (id: string): Promise<User | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = 'SELECT * FROM dbo."User" WHERE id = $1';
                const values = [id];
                const result = await this.client.query<User>(query, values);
                const user = result.rows[0];
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    getByEmail = (email: string): Promise<User | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = 'SELECT * FROM dbo."User" WHERE email = $1';
                const values = [email];
                const result = await this.client.query<User>(query, values);
                const user = result.rows[0];
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    getByIdentification = (cc: string): Promise<User | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = 'SELECT * FROM dbo."User" WHERE identification = $1';
                const values = [cc];
                const result = await this.client.query<User>(query, values);
                const user = result.rows[0];
                res(user);
            } catch (error) {
                rej(error);
            }
        });
    };

    getAll = (): Promise<User[]> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = 'SELECT * FROM dbo."User"';
                const result = await this.client.query<User>(query);
                const user = result.rows;
                res(user || []);
            } catch (error) {
                rej(error);
            }
        });
    };

    insert = (user: User): Promise<User | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const columns = Object.keys(user).join(', ');
                const placeholders = Object.entries(user).map((_, i) => `$${i + 1}`).join(', ');
                const values = Object.values(user);

                const query = `INSERT INTO dbo."User" (${columns}) VALUES (${placeholders}) RETURNING *`;
                const result = await this.client.query<User>(query, values);
                const _user = result.rows[0];
                res(_user);
            } catch (error) {
                rej(error);
            }
        });
    };

    update = (userId: string, entity: Partial<User>): Promise<User | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const updateClauses = Object.entries(entity)
                    .map(([key, value], i) => `"${key}" = $${i + 1}`)
                    .join(', ');

                const query = `UPDATE dbo."User" SET ${updateClauses} WHERE dbo."User".Id = $${Object.keys(entity).length + 1} RETURNING *`;

                const values = [...Object.values(entity), userId];

                const result = await this.client.query<User>(query, values);
                const _user = result.rows[0];

                res(_user);
            } catch (error) {
                rej(error);
            }
        });
    };

    delete = (id: string): Promise<boolean> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                res(true);
            } catch (error) {
                rej(error);
            }
        });
    };
}