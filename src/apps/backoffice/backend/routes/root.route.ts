import { Request, Response, Router } from 'express';
import httpStatus from 'http-status';

export const register = (router: Router): void => {
	router.get('/', (req: Request, res: Response) => {
		res.sendStatus(httpStatus.OK).send();
	});
};
