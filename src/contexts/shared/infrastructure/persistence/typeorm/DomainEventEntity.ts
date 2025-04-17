import { EntitySchema } from 'typeorm';

import { PlainDomainEvent } from '../../../domain/DomainEvent';

export const DomainEventEntity = new EntitySchema<PlainDomainEvent>({
	name: 'DomainEvent',
	tableName: 'failed_domain_events',
	columns: {
		eventId: {
			type: String,
			primary: true
		},
		eventName: {
			type: String
		},
		occurredOn: {
			type: Date
		},
		attributes: {
			type: 'json'
		}
	}
});
