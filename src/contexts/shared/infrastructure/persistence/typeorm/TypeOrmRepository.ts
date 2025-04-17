import { DataSource, EntitySchema, Repository } from 'typeorm';

import AggregateRoot from '../../../domain/AggregateRoot';

export abstract class TypeOrmRepository<T extends AggregateRoot> {
	constructor(private readonly datasource: DataSource) {}

	protected abstract entitySchema(): EntitySchema<T>;

	protected async repository(): Promise<Repository<T>> {
		const connection = await this.getInitializedConnection();

		return connection.getRepository(this.entitySchema());
	}

	protected async persist(aggregate: T): Promise<void> {
		const repo = await this.repository();
		await repo.save(aggregate);
	}

	private async getInitializedConnection(): Promise<DataSource> {
		if (!this.datasource.isInitialized) {
			await this.datasource.initialize();
		}

		return this.datasource;
	}
}
