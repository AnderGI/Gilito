import { Service } from 'diod';

import RabbitMQConnection from '../../../../../../apps/scripts/RabbitMQConnection';
import { DomainEvent } from '../../../domain/DomainEvent';
import { EventBus } from '../../../domain/EventBus';

@Service()
export default class RabbitMQEventBus extends EventBus {
	constructor(private readonly connection: RabbitMQConnection) {
		super();
	}

	public async publish(_: DomainEvent): Promise<void> {
		// await this.connection.publishEvent(
		// 	'domain_events',
		// 	_.eventName,
		// 	JSON.stringify(_.toPrimitives())
		// );
		console.log(this.connection, _);

		return Promise.resolve();
	}
}
