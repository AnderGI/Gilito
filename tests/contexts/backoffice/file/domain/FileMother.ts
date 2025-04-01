import File, { FilePrimitives } from '../../../../../src/contexts/backoffice/file/domain/File';
import { FileIdMother } from './FileIdMother';
import { FilePathMother } from './FilePathMother';

export class FileMother {
	static create(_?: FilePrimitives): File {
		return File.fromPrimitives(
			Object.assign(
				{},
				{
					id: FileIdMother.random().value,
					path: FilePathMother.random().path
				},
				_
			)
		);
	}
}
