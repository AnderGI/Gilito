import FileUploader from '../../../../../../src/contexts/backoffice/file/application/upload/FileUploader';
import File from '../../../../../../src/contexts/backoffice/file/domain/File';
import { InvalidUUIDException } from '../../../../../../src/contexts/backoffice/file/domain/InvalidUUIDException';
import { FileIdMother } from '../../domain/FileIdMother';
import { FilePathMother } from '../../domain/FilePathMother';
import MockFileRepository from '../../domain/MockFileRepository';

describe('FIleUploader', () => {
	describe('#upload', () => {
		it('should correctly upload a file', async () => {
			const repo = new MockFileRepository();
			const file = File.fromPrimitives({
				id: FileIdMother.random().value,
				path: FilePathMother.random().path
			});
			const uploader = new FileUploader(repo);

			await uploader.upload(file.id.value, file.path.path);

			repo.expectSaveToHaveBeenCalledWith(file);
		});

		it('should throw an exception if invalid uuid is passed', async () => {
			const repo = new MockFileRepository();
			const uploader = new FileUploader(repo);

			await expect(uploader.upload('bhvhjvghvvvhvh', FilePathMother.random().path)).rejects.toThrow(
				InvalidUUIDException
			);
		});
	});
});
