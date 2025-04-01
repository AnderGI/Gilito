import { validate } from 'uuid';

import { InvalidUUIDException } from './InvalidUUIDException';

export default class FileId {
	readonly value: string;
	constructor(value: string) {
		this.ensureUUIDIsValid(value);
		this.value = value;
	}

	private ensureUUIDIsValid(value: string): void {
		const valid = validate(value);
		if (!valid) {
			throw new InvalidUUIDException('Invalid UUID');
		}
	}
}
