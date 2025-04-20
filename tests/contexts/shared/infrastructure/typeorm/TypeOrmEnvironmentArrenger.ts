import { Service } from 'diod';
import { DataSource, EntityMetadata } from 'typeorm';

import EnvironmentArranger from './EnvironmentArranger';

@Service()
export class TypeOrmEnvironmentArranger extends EnvironmentArranger {
	constructor(private readonly _client: DataSource) {
		super();
	}

	async close(): Promise<void> {
		return (await this.client()).destroy();
	}

	async clean(): Promise<void> {
		await this.cleanDatabase();
	}

	private async cleanDatabase(): Promise<void> {
		const entities = await this.entities();
		const client = await this.client();

		await client.transaction(async transactionalEntityManager => {
			await Promise.all(
				entities.map(entity =>
					transactionalEntityManager.query(`DELETE FROM "${entity.tableName}";`)
				)
			);
		});
	}

	private async entities(): Promise<EntityMetadata[]> {
		return (await this.client()).entityMetadatas;
	}

	private async client(): Promise<DataSource> {
		if (!this._client.isInitialized) {
			await this._client.initialize();
		}

		return this._client;
	}
}
