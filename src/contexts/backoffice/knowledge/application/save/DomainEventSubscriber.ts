import { DomainEvent } from '../../../file/domain/DomainEvent';

export type DomainEventName<T extends DomainEvent> = Pick<T, 'eventName'>;

export default abstract class DomainEventSubscriber<T extends DomainEvent> {
	public abstract subscribedTo(): DomainEventName<T>[];
	public abstract queueName(): string;
	public abstract handle(_: DomainEvent): Promise<void>;
}
