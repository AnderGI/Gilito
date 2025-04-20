type ValueObjectPrimitives = string | number | boolean | Date;
export default class ValueObject<T extends ValueObjectPrimitives> {
	constructor(readonly value: T) {}
}
