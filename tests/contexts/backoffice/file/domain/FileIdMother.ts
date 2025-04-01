import faker from 'faker';

import FileId from '../../../../../src/contexts/backoffice/file/domain/FileId';

export class FileIdMother {
	static create(id: string): FileId {
		return new FileId(id);
	}

	static random(): FileId {
		return new FileId(faker.datatype.uuid());
	}
}
