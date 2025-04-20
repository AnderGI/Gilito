import faker from 'faker';

import TypeType from '../../../../../src/contexts/backoffice/type/domain/TypeType';

export class TypeTypeMother {
	static create(value: string): TypeType {
		return new TypeType(value);
	}

	static random(): TypeType {
		return new TypeType(
			faker.lorem.word(faker.datatype.number({ min: 5, max: 100, precision: 1 })) ?? 'dummy'
		);
	}
}
