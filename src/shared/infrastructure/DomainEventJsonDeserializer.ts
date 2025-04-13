import { Service } from 'diod';

import FileUploadedDomainEvent from '../../contexts/backoffice/file/domain/FileUploadedDomainEvent';
import { DomainEvent } from '../../contexts/shared/domain/DomainEvent';

interface DomainEventClass {
	fromPrimitives(params: {
		eventName: string;
		eventId: string;
		occurredOn: Date;
		attributes: Record<string, any>;
	}): DomainEvent;
}
type JsonStringDomainEvent = {
	eventName: string;
	eventId: string;
	occurredOn: Date;
	attributes: any;
};

@Service()
export default class DomainEventJsonDeserializer {
	private readonly eventNameToClass = new Map<string, DomainEventClass>();

	public constructor() {
		this.eventNameToClass.set('backoffice.file.file_uploaded', FileUploadedDomainEvent);
	}

	public deserialize(content: string): DomainEvent {
		const eventRaw = JSON.parse(content) as JsonStringDomainEvent;
		const EventClass = this.eventNameToClass.get(eventRaw.eventName);

		if (!EventClass) {
			throw new Error(`No event class found for event name "${eventRaw.eventName}"`);
		}

		const event = EventClass.fromPrimitives({
			eventName: eventRaw.eventName,
			eventId: eventRaw.eventId,
			occurredOn: new Date(eventRaw.occurredOn),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			attributes: eventRaw.attributes
		});

		return event;
	}
}
