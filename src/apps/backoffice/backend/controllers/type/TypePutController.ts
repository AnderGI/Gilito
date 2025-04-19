import { Service } from 'diod';
import { Response } from 'express';
import httpStatus from 'http-status';

import TypeAdder from '../../../../../contexts/backoffice/type/application/add/TypesAdder';
import { Controller } from '../Controller';
import { AddTypeRequest } from './AddTypeRequest';

@Service()
export default class TypePutController implements Controller {
	constructor(private readonly _: TypeAdder) {}
	run(req: AddTypeRequest, res: Response): void {
		this._.run(req.typeId, req.type);
		res.sendStatus(httpStatus.ACCEPTED).send();
	}
}
