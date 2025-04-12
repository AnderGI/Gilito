import { DomainEvent } from './DomainEvent';

export default class FileUploadedDomainEvent extends DomainEvent {
	static readonly eventName: string = 'backoffice.file.file_uploaded';

	constructor(public readonly filePath: string, occurredOn?: Date) {
		super(FileUploadedDomainEvent.eventName, occurredOn);
	}
}
