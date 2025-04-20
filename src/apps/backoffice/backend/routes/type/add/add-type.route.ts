import { NextFunction, Request, Response, Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import httpStatus from 'http-status';

import { AddTypeRequest } from '../../../controllers/type/AddTypeRequest';
import TypePutController from '../../../controllers/type/TypePutController';
import container from '../../../dependency-injection/diod.config';

const requestSchema = [
	param('id').isUUID('4').notEmpty(),
	body('type')
		.isString()
		.withMessage('type must be a string')
		.isLength({ min: 1 })
		.withMessage('type must be at least 1 character long')
		.trim()
		.notEmpty()
		.withMessage('type cannot be empty')
];

export const register = (router: Router): void => {
	router.put(
		'/types/:id',
		requestSchema,
		(req: Request, res: Response, next: NextFunction) => {
			const errors = validationResult(req);
			if (errors.isEmpty()) {
				next();

				return;
			}

			return res.sendStatus(httpStatus.BAD_REQUEST);
		},
		(req: Request, res: Response) => {
			const { id } = req.params;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const { type }: { type: string } = req.body;
			const addTypesReq = {
				typeId: id,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				type
			};

			container.get(TypePutController).run(addTypesReq as AddTypeRequest, res);
		}
	);
};
