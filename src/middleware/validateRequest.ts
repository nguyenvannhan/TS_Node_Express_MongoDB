import {AnySchema} from 'yup';
import {NextFunction, Request, Response} from "express";
import log from '../logger';

const validate = (schema: AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            return next();
        } catch (e) {
            // @ts-ignore
            log.error(e);
            // @ts-ignore
            return res.status(400).send(e.errors);
        }
    };
}

export default validate;