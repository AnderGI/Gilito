import Type, { TypePrimitives } from '../../../../../src/contexts/backoffice/type/domain/Type';
import { TypeIdMother } from './TypeIdMother';
import { TypeTypeMother } from './TypeTypeMother';

export class TypeMother {
	static create(_?: TypePrimitives): Type {
		return Type.fromPrimitives(
			Object.assign(
				{},
				{
					id: TypeIdMother.random().value,
					type: TypeTypeMother.random().value
				},
				_
			)
		);
	}
}
