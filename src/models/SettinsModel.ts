import { ServiceError } from '../utils/errors/service.error';
import { PoolClient } from 'pg';

export class SettingsModel {
    
    constructor(
        private readonly client?: PoolClient
    ) { }

    insert = (offert: Partial<Configuracion>): Promise<Configuracion | null> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const columns = Object.keys(offert).join(', ');
                const placeholders = Object.entries(offert).map((_, i) => `$${i + 1}`).join(', ');
                const values = Object.values(offert);

                const query = `INSERT INTO dbo."Configuracion" (${columns}) VALUES (${placeholders}) RETURNING *`;
                const result = await this.client.query<Configuracion>(query, values);
                const _user = result.rows[0];
                res(_user);
            } catch (error) {
                rej(error);
            }
        });
    };

    getSettingsByUser = (user_id: string): Promise<Configuracion> => {
        return new Promise(async (res, rej) => {
            if(!this.client) throw new ServiceError("Error de conexion");
            try {
                const query = `SELECT system_notification, promotion_notification FROM dbo."Configuracion" WHERE user_id = $1`;
                const values = [user_id];
                const result = await this.client.query<Configuracion>(query, values);
                const settings = result.rows[0];
                res(settings);
            } catch (error) {
                rej(error);
            }
        });
    };

}