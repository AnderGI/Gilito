import faker from 'faker';

import FilePath from '../../../../../src/contexts/backoffice/file/domain/FilePath';

export class FilePathMother {
	static create(path: string): FilePath {
		return new FilePath(path);
	}

	static random(): FilePath {
		return new FilePath(faker.system.filePath());
	}
}
