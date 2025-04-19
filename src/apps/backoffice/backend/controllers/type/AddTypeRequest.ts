import { Request } from 'express';

export interface AddTypeRequest extends Request {
	typeId: string;
	type: string;
}
