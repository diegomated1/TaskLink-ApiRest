import { Service } from "interfaces/Service";
import joi from 'joi';

export const ServicePostValidator = joi.object<Service>({
    price: joi.number()
        .required()
        .messages({
            "any.required": "El precio es requerido."
        }),
    description: joi.string(),
    category_id:
        joi.number()
            .required()
            .messages({
                "any.required": "La categoria es requerida."
            }),
});