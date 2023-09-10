import { Conection } from "../database/Conection";
import { CategoryModel } from "../models/CategoryModel";
import { Category } from "../interfaces/Category";

export class CategoryService {

    constructor(
        private readonly conection: Conection
    ) { }

    getAll = (): Promise<Category[]> => {
        return new Promise(async (res, rej) => {
            const client = await this.conection.connect();
            const userModel = new CategoryModel(client);
            try {
                const categories = await userModel.getAll();

                res(categories);
                this.conection.commit(client);
            } catch (error) {
                await this.conection.rollback(client);
                rej(error)
            }
        });
    }

}