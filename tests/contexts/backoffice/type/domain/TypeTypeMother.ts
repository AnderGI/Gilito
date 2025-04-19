import faker from 'faker';

import TypeType from '../../../../../src/contexts/backoffice/type/domain/TypeType';

export class TypeTypeMother {
	static create(value: string): TypeType {
		return new TypeType(value);
	}

	static random(): TypeType {
		return new TypeType(
			faker.random.alpha({
				// TODO review and change the min and max <- should also be subject under test
				count: faker.datatype.number({ min: 1, max: 100 }),
				upcase: faker.random.arrayElement([true, false])
			})
		);
	}
}
