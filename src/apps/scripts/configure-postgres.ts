import { DataSource } from 'typeorm';

import { FileMother } from '../../../tests/contexts/backoffice/file/domain/FileMother';
import { FileEntity } from './FileEntity';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'switchyard.proxy.rlwy.net',
	port: 40435,
	username: 'postgres',
	password: 'kbehRHUZtJrLsxsqsBEClHeJPgbOKgSF',
	database: 'railway', // 🔥 obligatorio para Railway
	entities: [FileEntity],
	synchronize: true,
	logging: true // útil para desarrollo
});

async function main() {
	try {
		console.log('🔌 Initializing datasource...');
		const dataSource = await AppDataSource.initialize();
		console.log('✅ DataSource initialized successfully');

		const repository = dataSource.getRepository(FileEntity);

		const file = FileMother.create();
		console.log('📦 Inserting file:', file);

		const result = await repository.save(file);
		console.log('✅ File inserted:', result);
	} catch (error) {
		console.error('❌ Error during script execution:', error);
		process.exit(1);
	}
}

main();
