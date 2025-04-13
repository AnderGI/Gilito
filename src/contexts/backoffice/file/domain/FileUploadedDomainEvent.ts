import {
	DomainEvent,
	DomainEventAttributes,
	DomainEventParams,
	PlainDomainEvent
} from '../../../shared/domain/DomainEvent';

export default class FileUploadedDomainEvent extends DomainEvent {
	static readonly EVENT_NAME = 'backoffice.file.file_uploaded';

	public readonly filePath: string;

	constructor(attributes: { filePath: string }, params?: DomainEventParams) {
		super({ ...params, eventName: FileUploadedDomainEvent.EVENT_NAME });
		this.filePath = attributes.filePath;
	}

	public static fromPrimitives(params: {
		eventName: string;
		eventId: string;
		occurredOn: Date;
		attributes: DomainEventAttributes;
	}): FileUploadedDomainEvent {
		return new FileUploadedDomainEvent(
			{
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				filePath: params.attributes.filePath
			},
			{
				eventName: FileUploadedDomainEvent.EVENT_NAME,
				eventId: params.eventId,
				occurredOn: params.occurredOn
			}
		);
	}

	public toPrimitives(): PlainDomainEvent {
		return {
			eventId: this.eventId,
			eventName: this.eventName,
			occurredOn: this.occurredOn,
			attributes: {
				filePath: this.filePath
			}
		};
	}
}
