import { User } from 'interfaces/User';
import joi from 'joi';

export const UserPostValidator = joi.object<User>({
    identificationTypeId: joi.number()
        .required()
        .messages({
            "any.required": "El tipo de documento es requerido."
        }),
    identification:
        joi.string()
            .required()
            .messages({
                "any.required": "El documento es requerido."
            }),
    fullname:
        joi.string()
            .max(50)
            .required()
            .messages({
                "string.max": "Maximo 50 caracteres.",
                "any.required": "El nombre es requerido."
            }),
    email:
        joi.string()
            .email({ minDomainSegments: 2 })
            .required()
            .messages({
                "string.email": "Correo no valido.",
                "any.required": "El correo es requerido."
            }),
    birthdate:
        joi.date()
            .required()
            .messages({
                "any.required": "La fecha de nacimiento es requerida."
            }),
    phone:
        joi.string()
            .pattern(new RegExp(/^[0-9]+$/))
            .required()
            .messages({
                "string.pattern.base": "Numero de telefono no valido.",
                "any.required": "El numero de celular es requerido."
            }),
    password:
        joi.string()
            .pattern(new RegExp(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*\@])(?=.*[a-zA-Z]).{8,16}$/))
            .required()
            .messages({
                "string.pattern.base": "La contraseña no es segura.",
                "any.required": "La contraseña es requerida."
            }),
});


export const UserPutValidator = joi.object<User>({
    fullname: joi.string()
        .max(50)
        .messages({
            "string.max": "Nombre maximo 50 caracteres."
        }),
    email: joi.string()
        .email({ minDomainSegments: 2 })
        .messages({
            "string.email": "Correo no valido."
        }),
    phone: joi.string()
        .pattern(new RegExp(/^[0-9]+$/))
        .messages({
            "string.pattern.base": "Numero de telefono no valido."
        }),
    password: joi.string()
        .required()
        .messages({
            "any.required": "La contraseña es requerida."
        })
});