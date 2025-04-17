import { DataSource } from 'typeorm';

import { FileEntity } from '../../../../../apps/scripts/FileEntity';

export default class TypeOrmConnection {
	public static getConnection(): DataSource {
		return new DataSource({
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
	}
}
