import { Service } from 'diod';
import { DataSource } from 'typeorm';

import Type from '../../domain/Type';
import TypeRepository from '../../domain/TypeRepository';
import { TypeEntity } from './TypeEntity';

@Service()
export default class TypeOrmTypeRepository extends TypeRepository {
	constructor(private readonly datasource: DataSource) {
		super();
	}

	public async save(_: Type): Promise<void> {
		await this.persist(_);
	}

	private entitySchema() {
		return TypeEntity;
	}

	private async repository() {
		const connection = await this.getInitializedConnection();

		return connection.getRepository(this.entitySchema());
	}

	private async persist(aggregate: Type) {
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
