import ValueObject from '../../../shared/domain/ValueObject';

export default class TypeType extends ValueObject<string> {
	constructor(readonly value: string) {
		super(value);
	}
}
