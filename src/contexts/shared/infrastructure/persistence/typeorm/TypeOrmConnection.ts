import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';

import { TypeEntity } from '../../../../backoffice/type/infrastructure/persistence/TypeEntity';
import { DomainEventEntity } from './DomainEventEntity';

configDotenv();
const { env } = process;

export default class TypeOrmConnection {
	public static getConnection(): DataSource {
		return new DataSource({
			type: 'postgres',
			host: env.DATABASE_HOST as unknown as string,
			port: parseInt(env.DATABASE_PORT as unknown as string, 10),
			username: env.DATABASE_USER as unknown as string,
			password: env.DATABASE_PASSWORD as unknown as string,
			database: env.DATABASE_NAME as unknown as string,
			entities: [DomainEventEntity, TypeEntity],
			synchronize: true,
			logging: true
		});
	}
}
