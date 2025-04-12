import { Service } from 'diod';

import FileUploadedDomainEvent from '../../../file/domain/FileUploadedDomainEvent';
import DomainEventSubscriber, { DomainEventName } from './DomainEventSubscriber';

@Service()
export default class SaveKnowledgeOnFileUploaded extends DomainEventSubscriber<FileUploadedDomainEvent> {
	public subscribedTo(): DomainEventName<FileUploadedDomainEvent>[] {
		return [FileUploadedDomainEvent];
	}

	public queueName(): string {
		return 'backoffice.knowledge.save_knowledge_on_file_uploaded';
	}

	public async handle(_: string): Promise<void> {
		console.log(_);

		return Promise.resolve();
	}
}
