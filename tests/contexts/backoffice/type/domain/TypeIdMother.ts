import faker from 'faker';

import TypeId from '../../../../../src/contexts/backoffice/type/domain/TypeId';

export class TypeIdMother {
	static create(id: string): TypeId {
		return new TypeId(id);
	}

	static random(): TypeId {
		return new TypeId(faker.datatype.uuid());
	}
}
