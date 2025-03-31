import FileUploader from '../../../../../../src/contexts/backoffice/file/application/upload/FileUploader';
import File from '../../../../../../src/contexts/backoffice/file/domain/File';
import MockFileRepository from '../../domain/MockFileRepository';

describe('FIleUploader', () => {
	describe('#upload', () => {
		it('should correctlu upload a file', async () => {
			const repo = new MockFileRepository();
			const file = new File('fakeId', 'fakePath');
			const uploader = new FileUploader(repo);

			await uploader.upload(file.id, file.path);

			repo.expectSAveToHaveBeenCalledWith(file);
		});
	});
});
