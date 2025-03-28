import 'reflect-metadata';

import { Request, Response, Router } from 'express';

import StatusGetController from '../controllers/status-health-check/StatusGetController';
import container from '../dependency-injection/diod.config';

export const register = (router: Router): void => {
	// const controller = container.get<StatusGetController>('apps.mooc.StatusGetController');
	const controller = container.get(StatusGetController);
	router.get('/status', (req: Request, res: Response) => {
		controller.run(req, res);
	});
};
