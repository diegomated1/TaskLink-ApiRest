import { LatLng } from 'interfaces/LatLng';
import { Offert } from '../../interfaces/Offert';
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

export const OffertPutValidator = joi.object<Offert>({
    price: joi.number(),
    agended_date: joi.date()
});

export const LocationValidator = joi.object<LatLng>({
    lat: joi.number()
            .required()
            .min(-90)
            .max(90)
            .messages({
                "any.required": "La latitud es requerida.",
                "number.min": "La latitud minima es -90",
                "number.max": "La latitud maxima es 90"
            }),
    lng: joi.number()
            .required()
            .min(-180)
            .max(180)
            .messages({
                "any.required": "La longitud es requerida.",
                "number.min": "La longitud minima es -180",
                "number.max": "La longitud maxima es 180"
            }),
});