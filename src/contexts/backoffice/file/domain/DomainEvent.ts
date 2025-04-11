import { v4 } from 'uuid';

export type DomainEventParams = {
	eventName: string;
	eventId?: string;
	ocurredOn?: Date;
};

type DomainEventAttributes = any;

type DomainEventPrimitives = {
	eventName: string;
	eventId: string;
	ocurredOn: Date;
	attributes: DomainEventAttributes;
};

export abstract class DomainEvent {
	readonly eventName: string;
	readonly eventId: string;
	readonly ocurredOn: Date;
	constructor(_: DomainEventParams) {
		this.eventName = _.eventName;
		this.eventId = _.eventId ?? v4();
		this.ocurredOn = _.ocurredOn ?? new Date();
	}

	public abstract toPrimitives(): DomainEventPrimitives;

	public equals(other: DomainEvent): boolean {
		return (
			this.eventName === other.eventName &&
			JSON.stringify(this.toPrimitives().attributes) ===
				JSON.stringify(other.toPrimitives().attributes)
		);
	}
}
