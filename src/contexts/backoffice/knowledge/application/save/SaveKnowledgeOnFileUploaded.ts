import { Service } from 'diod';

import { DomainEvent } from '../../../../shared/domain/DomainEvent';
import DomainEventSubscriber, {
	DomainEventConstructor
} from '../../../../shared/domain/DomainEventSubscriber';
import FileUploadedDomainEvent from '../../../file/domain/FileUploadedDomainEvent';

@Service()
export default class SaveKnowledgeOnFileUploaded extends DomainEventSubscriber<FileUploadedDomainEvent> {
	public subscribedTo(): DomainEventConstructor<FileUploadedDomainEvent>[] {
		return [FileUploadedDomainEvent];
	}

	public queueName(): string {
		return 'backoffice.knowledge.save_knowledge_on_file_uploaded';
	}

	public async handle(_: DomainEvent): Promise<void> {
		console.log('llega');
		console.log(_);

		return Promise.resolve();
	}
}
