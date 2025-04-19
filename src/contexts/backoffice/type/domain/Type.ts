import TypeId from './TypeId';
import TypeType from './TypeType';

export type TypePrimitives = {
	id: string;
	type: string;
};

export default class Type {
	constructor(readonly id: TypeId, readonly type: TypeType) {}

	public static fromPrimitives(_: TypePrimitives): Type {
		return new Type(new TypeId(_.id), new TypeType(_.type));
	}

	public equals(other: Type): boolean {
		if (!(other instanceof Type)) {
			return false;
		}

		return this.id === other.id;
	}
}
