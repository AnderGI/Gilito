import FileUploader from '../../../../../../src/contexts/backoffice/file/application/upload/FileUploader';
import FileUploadedDomainEvent from '../../../../../../src/contexts/backoffice/file/domain/FileUploadedDomainEvent';
import { InvalidUUIDException } from '../../../../../../src/contexts/shared/domain/InvalidUUIDException';
import { FileMother } from '../../domain/FileMother';
import { FilePathMother } from '../../domain/FilePathMother';
import MockEventBus from '../../domain/MockEventBus';
import MockFileRepository from '../../domain/MockFileRepository';

describe('FileUploader', () => {
	describe('#upload', () => {
		it('should correctly upload a file', async () => {
			const eventBus = new MockEventBus();
			const repo = new MockFileRepository();
			const file = FileMother.create();
			const event = new FileUploadedDomainEvent({ filePath: file.path.path });

			const uploader = new FileUploader(repo, eventBus);

			await uploader.upload(file.id.value, file.path.path);

			repo.expectSaveToHaveBeenCalledWith(file);
			eventBus.assertBusToHaveBeenCalledWith(event);
		});

		it('should throw an exception if invalid uuid is passed', async () => {
			const eventBus = new MockEventBus();
			const repo = new MockFileRepository();
			const uploader = new FileUploader(repo, eventBus);

			await expect(uploader.upload('bhvhjvghvvvhvh', FilePathMother.random().path)).rejects.toThrow(
				InvalidUUIDException
			);
		});
	});
});
