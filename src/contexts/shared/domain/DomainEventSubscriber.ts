import { DomainEvent, DomainEventAttributes } from './DomainEvent';

export type DomainEventConstructor<T extends DomainEvent> = {
	new (...args: any[]): T;
	fromPrimitives(params: {
		eventName: string;
		eventId: string;
		occurredOn: Date;
		attributes: DomainEventAttributes;
	}): T;
	readonly EVENT_NAME: string;
};

export default abstract class DomainEventSubscriber<T extends DomainEvent> {
	public abstract subscribedTo(): DomainEventConstructor<T>[];
	public abstract queueName(): string;
	public abstract handle(_: DomainEvent): Promise<void>;
}
