/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';

import { DomainEvent } from '../../contexts/backoffice/file/domain/DomainEvent';
import DomainEventSubscriber from '../../contexts/backoffice/knowledge/application/save/DomainEventSubscriber';
import container from '../backoffice/backend/dependency-injection/diod.config';
import RabbitMQConnection from './RabbitMQConnection';

async function setup() {
	const connection = container.get(RabbitMQConnection);
	await connection.connect();
	await connection.declareExchanges();

	const subscriberIds = container.findTaggedServiceIdentifiers('domainEventSubscriber');
	const subscribers = subscriberIds.map(_ =>
		container.get(_)
	) as unknown as DomainEventSubscriber<DomainEvent>[];
	const queuesAndBindigs = subscribers.map(_ => {
		const queue = _.queueName();
		const events = _.subscribedTo().map(_ => _.eventName);

		return { queue, events };
	});
	await Promise.all(
		queuesAndBindigs.map(queuesAndBindig =>
			connection.setupQueues(queuesAndBindig.queue, queuesAndBindig.events)
		)
	);

	await connection.close();
}

setup().catch(err => console.error(err));
