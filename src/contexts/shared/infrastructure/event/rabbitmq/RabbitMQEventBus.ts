import { Service } from 'diod';

import RabbitMQConnection from '../../../../../shared/infrastructure/RabbitMQConnection';
import { DomainEvent } from '../../../domain/DomainEvent';
import { EventBus } from '../../../domain/EventBus';

@Service()
export default class RabbitMQEventBus extends EventBus {
	public static readonly MAIN_EXCHANGE = 'domain_events';

	constructor(private readonly connection: RabbitMQConnection) {
		super();
	}

	public async publish(_: DomainEvent): Promise<void> {
		await this.connection.connect();
		await this.connection.publishEvent(
			RabbitMQEventBus.MAIN_EXCHANGE,
			_.eventName,
			JSON.stringify(_.toPrimitives())
		);

		return Promise.resolve();
	}
}
