import { validate } from 'uuid';

import { InvalidUUIDException } from '../../../shared/domain/InvalidUUIDException';
import ValueObject from '../../../shared/domain/ValueObject';

export default class TypeId extends ValueObject<string> {
	constructor(value: string) {
		super(value);
		this.ensureUUIDIsValid(value);
	}

	private ensureUUIDIsValid(value: string): void {
		const valid = validate(value);
		if (!valid) {
			throw new InvalidUUIDException('Invalid UUID');
		}
	}
}
