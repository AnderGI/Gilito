import { Service } from 'diod';

import { RabbitMQConnection } from '../../../../../../apps/scripts/configure-rabbitmq';
import { DomainEvent } from '../../../domain/DomainEvent';
import { EventBus } from '../../../domain/EventBus';

@Service()
export default class RabbitMQEventBus extends EventBus {
	constructor(private readonly connection: RabbitMQConnection) {
		super();
	}

	public async publish(_: DomainEvent): Promise<void> {
		await this.connection.publishEvent(
			'domain_events',
			_.eventName,
			JSON.stringify(_.toPrimitives())
		);

		return Promise.resolve();
	}
}
