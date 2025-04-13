import { v4 } from 'uuid';

export type DomainEventAttributes = Record<string, any>;

export type DomainEventParams = {
	eventName: string;
	eventId?: string;
	occurredOn?: Date;
};

export type PlainDomainEvent = {
	eventName: string;
	eventId?: string;
	occurredOn?: Date;
	attributes: DomainEventAttributes;
};
export abstract class DomainEvent {
	public readonly eventName: string;
	public readonly occurredOn: Date;
	public readonly eventId: string;

	protected constructor(params: DomainEventParams) {
		this.eventName = params.eventName;
		this.occurredOn = params.occurredOn ?? new Date();
		this.eventId = params.eventId ?? v4();
	}

	public abstract toPrimitives(): PlainDomainEvent;

	public static fromPrimitives?(params: {
		eventName: string;
		eventId: string;
		occurredOn: Date;
		attributes: DomainEventAttributes;
	}): DomainEvent;
}
