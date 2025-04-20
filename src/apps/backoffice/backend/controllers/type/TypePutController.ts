import { Service } from 'diod';
import { Response } from 'express';
import httpStatus from 'http-status';

import TypeAdder from '../../../../../contexts/backoffice/type/application/add/TypesAdder';
import { Controller } from '../Controller';
import { AddTypeRequest } from './AddTypeRequest';

@Service()
export default class TypePutController implements Controller {
	constructor(private readonly _: TypeAdder) {}
	async run(req: AddTypeRequest, res: Response): Promise<void> {
		console.log('controller');
		await this._.run(req.typeId, req.type);
		res.sendStatus(httpStatus.ACCEPTED).send();
	}
}
