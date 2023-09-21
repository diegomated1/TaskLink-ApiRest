import { ServiceError } from '../utils/errors/service.error';
import { PoolClient } from 'pg';
import { Category } from '../interfaces/Category';

export class CategoryModel {
    
    constructor(
        private readonly client?: PoolClient
    ) { }

    getById = (category_id: number): Promise<Category | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = `SELECT * FROM dbo."Category" WHERE id = $1`;
                const values = [category_id]
                const result = await this.client.query<Category>(query, values);
                const category = result.rows[0];
                res(category);
            } catch (error) {
                rej(error);
            }
        });
    };

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