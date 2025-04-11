import { DomainEvent, DomainEventParams } from './DomainEvent';

export default class FileUploadedDomainEvent extends DomainEvent {
	private static readonly EVENT_NAME: string = 'backoffice.file.file_uploaded';
	constructor(readonly filePath: string, _?: DomainEventParams) {
		super({
			eventName: FileUploadedDomainEvent.EVENT_NAME,
			eventId: _?.eventId,
			ocurredOn: _?.ocurredOn
		});
	}

	public toPrimitives(): { eventName: string; eventId: string; ocurredOn: Date; attributes: any } {
		return {
			eventId: this.eventId,
			eventName: this.eventName,
			ocurredOn: this.ocurredOn,
			attributes: {
				filePath: this.filePath
			}
		};
	}
}
