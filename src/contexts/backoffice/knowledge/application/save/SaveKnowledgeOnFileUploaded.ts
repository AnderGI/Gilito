import { Service } from 'diod';

import FileUploadedDomainEvent from '../../../file/domain/FileUploadedDomainEvent';
import DomainEventSubscriber from './DomainEventSubscriber';

@Service()
export default class SaveKnowledgeOnFileUploaded extends DomainEventSubscriber<FileUploadedDomainEvent> {
	public eventName(): string {
		return 'backoffice.file.file_uploaded';
	}

	public queueName(): string {
		return 'backoffice.knowledge.save_knowledge_on_file_uploaded';
	}

	public async handle(_: FileUploadedDomainEvent): Promise<void> {
		console.log(_);

		return Promise.resolve();
	}
}
