import 'reflect-metadata';

import { DomainEvent } from '../../contexts/backoffice/file/domain/DomainEvent';
import DomainEventSubscriber from '../../contexts/backoffice/knowledge/application/save/DomainEventSubscriber';
import container from '../backoffice/backend/dependency-injection/diod.config';

async function setup() {
	const identifiers = container.findTaggedServiceIdentifiers('domainEventSubscriber');
	for (const identifier of identifiers) {
		console.log(identifier);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const sub = container.get(identifier) as DomainEventSubscriber<DomainEvent>;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		console.log(sub.eventName());
	}

	return Promise.resolve();
}

setup().catch(err => console.error(err));
