import { Offert } from "../../interfaces/Offert";
import joi from 'joi';

export const OffertPostValidator = joi.object<Offert>({
    price: joi.number()
        .required()
        .messages({
            "any.required": "El precio es requerido."
        }),
    agended_date: 
        joi.date()
            .required()
            .messages({
                "any.required": "La fecha de agendamiento es requerida."
            }),
    service_id: 
        joi.number()
            .required()
            .messages({
                "any.required": "El servicio es requerido."
            }),
});