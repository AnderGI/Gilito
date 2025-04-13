import 'reflect-metadata';

import { DomainEvent } from '../../contexts/shared/domain/DomainEvent';
import DomainEventSubscriber from '../../contexts/shared/domain/DomainEventSubscriber';
import RabbitMQConnection from '../../shared/infrastructure/RabbitMQConnection';
import container from '../backoffice/backend/dependency-injection/diod.config';

export type QueuesToSubscriber = {
	queueName: string;
	subscriber: DomainEventSubscriber<DomainEvent>;
};

async function setup() {
	const subscriberIds = container.findTaggedServiceIdentifiers('domainEventSubscriber');
	const subscribers = subscriberIds.map(_ =>
		container.get(_)
	) as unknown as DomainEventSubscriber<DomainEvent>[];

	const queuesAndBindigs = subscribers.map(_ => {
		const queueName = _.queueName();

		return { queueName, subscriber: _ };
	});

	const connection = container.get(RabbitMQConnection);
	await connection.connect();
	await connection.consume(queuesAndBindigs);
}

setup().catch(err => console.error(err));
