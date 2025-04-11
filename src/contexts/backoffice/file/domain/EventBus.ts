import { DomainEvent } from './DomainEvent';

export abstract class EventBus {
	public abstract publish(_: DomainEvent): Promise<void>;
}
