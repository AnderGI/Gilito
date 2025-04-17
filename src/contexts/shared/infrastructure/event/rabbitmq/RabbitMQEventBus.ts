import { Service } from 'diod';

import RabbitMQConnection from '../../../../../shared/infrastructure/RabbitMQConnection';
import { DomainEvent } from '../../../domain/DomainEvent';
import { EventBus } from '../../../domain/EventBus';
import DomainEventFallback from '../../persistence/typeorm/DomainEventFallback';

@Service()
export default class RabbitMQEventBus extends EventBus {
	public static readonly MAIN_EXCHANGE = 'domain_events';

	constructor(
		private readonly connection: RabbitMQConnection,
		private readonly fallback: DomainEventFallback
	) {
		super();
	}

	public async publish(_: DomainEvent): Promise<void> {
		try {
			await this.connection.connect();
			await this.connection.publishEvent(
				RabbitMQEventBus.MAIN_EXCHANGE,
				_.eventName,
				JSON.stringify(_.toPrimitives())
			);
		} catch {
			await this.fallback.persist(_.toPrimitives());
		}

		return Promise.resolve();
	}
}
