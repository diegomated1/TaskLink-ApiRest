import { Conection } from "../database/Conection";
import { SettingsModel } from "../models/SettinsModel";

export class SettingsService {

    constructor(
        private readonly conection: Conection
    ) { }

    getSettingsByUser = (user_id: string): Promise<Configuracion> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const settingsModel = new SettingsModel(client);
            try {
                const settgins = await settingsModel.getSettingsByUser(user_id);

                res(settgins);
                this.conection.commit(client);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

}