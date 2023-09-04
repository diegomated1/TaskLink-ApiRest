import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../utils/errors/service.error';

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.get('Authorization');
        if (auth === undefined) throw new ServiceError("No hay un token en el header.");

        const token_bearer = auth.split(' ');
        if (token_bearer[0].toLowerCase() !== 'bearer') throw new ServiceError("Token invalido");

        var token = token_bearer[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if(!decoded.user_id) throw new ServiceError("Token invalido.");

        res.locals.user_id = decoded.user_id;
        next();
    } catch (error) {
        next(error);
    }
}