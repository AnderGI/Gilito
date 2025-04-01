import File from '../../../../../src/contexts/backoffice/file/domain/File';
import { FileIdMother } from './FileIdMother';
import { FilePathMother } from './FilePathMother';

export class FileMother {
	static random(): File {
		return File.fromPrimitives({
			id: FileIdMother.random().value,
			path: FilePathMother.random().path
		});
	}
}
