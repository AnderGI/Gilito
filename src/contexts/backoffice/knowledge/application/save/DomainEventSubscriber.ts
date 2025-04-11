import { DomainEvent } from '../../../file/domain/DomainEvent';

export default abstract class DomainEventSubscriber<T extends DomainEvent> {
	public abstract eventName(): string;
	public abstract queueName(): string;
	public abstract handle(_: T): Promise<void>;
}
