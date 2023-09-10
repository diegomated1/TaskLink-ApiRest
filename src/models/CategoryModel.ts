import { ServiceError } from '../utils/errors/service.error';
import { PoolClient } from 'pg';
import { Category } from '../interfaces/Category';

export class CategoryModel {
    
    constructor(
        private readonly client?: PoolClient
    ) { }

    getAll = (): Promise<Category[]> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = `SELECT * FROM dbo."Category"`;
                const result = await this.client.query<Category>(query);
                const categories = result.rows;
                res(categories);
            } catch (error) {
                rej(error);
            }
        });
    };

}