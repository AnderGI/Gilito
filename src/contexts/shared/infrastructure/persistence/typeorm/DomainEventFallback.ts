import { Service } from 'diod';
import { DataSource } from 'typeorm';

import { PlainDomainEvent } from '../../../domain/DomainEvent';
import { DomainEventEntity } from './DomainEventEntity';

@Service()
export default class DomainEventFallback {
	constructor(private readonly datasource: DataSource) {}

	public async persist(event: PlainDomainEvent): Promise<void> {
		const repo = await this.repository();
		await repo.save(event);
	}

	private entitySchema() {
		return DomainEventEntity;
	}

	private async repository() {
		const connection = await this.getInitializedConnection();

		return connection.getRepository(this.entitySchema());
	}

	private async getInitializedConnection(): Promise<DataSource> {
		if (!this.datasource.isInitialized) {
			await this.datasource.initialize();
		}

		return this.datasource;
	}
}
