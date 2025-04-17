import { Service } from 'diod';
import { DataSource } from 'typeorm';

import { FileEntity } from './FileEntity';
import File from '../../contexts/backoffice/file/domain/File';


export default class TypeOrmFileRepository {
	private readonly AppDataSource = new DataSource({
		type: 'postgres',
		host: 'switchyard.proxy.rlwy.net',
		port: 40435,
		username: 'postgres',
		password: 'kbehRHUZtJrLsxsqsBEClHeJPgbOKgSF',
		database: 'railway',
		entities: [FileEntity],
		synchronize: true,
		logging: true
	});

	private dbConnection!: DataSource;

	public async save(_: File): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!this.dbConnection) {
			await this.connect();
		}

		await this.repository().save(_);
	}

	private async connect(): Promise<void> {
		try {
			this.dbConnection = await this.AppDataSource.initialize();
		} catch {
			console.error('error creating the database');
		}
	}

	private repository() {
		return this.dbConnection.getRepository(FileEntity);
	}
}
