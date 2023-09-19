import { OffertStatus } from 'interfaces/OffertStatus';
import { ServiceError } from '../utils/errors/service.error';
import { PoolClient } from 'pg';

export class StatusModel {
    
    constructor(
        private readonly client?: PoolClient
    ) { }

    getStatus = (status_id: number): Promise<OffertStatus | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = `SELECT * FROM dbo."OffertStatus" WHERE id = $1`;
                const values = [status_id];
                const result = await this.client.query<OffertStatus>(query, values);
                const status = result.rows[0];
                res(status);
            } catch (error) {
                rej(error);
            }
        });
    };

}