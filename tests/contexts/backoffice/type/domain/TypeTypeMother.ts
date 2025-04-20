import faker from 'faker';

import TypeType from '../../../../../src/contexts/backoffice/type/domain/TypeType';

export class TypeTypeMother {
	static create(value: string): TypeType {
		return new TypeType(value);
	}

	static random(): TypeType {
		const length = faker.datatype.number({ min: 1, max: 10, precision: 1 });
		const value = faker.lorem.word(length);

		return new TypeType(value);
	}
}
