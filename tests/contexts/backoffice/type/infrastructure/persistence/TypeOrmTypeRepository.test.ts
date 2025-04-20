import container from '../../../../../../src/apps/backoffice/backend/dependency-injection/diod.config';
import TypeRepository from '../../../../../../src/contexts/backoffice/type/domain/TypeRepository';
import EnvironmentArranger from '../../../../shared/infrastructure/typeorm/EnvironmentArranger';
import { TypeMother } from '../../domain/TypeMother';

describe('TypeOrmTypeRepository', () => {
	const repo = container.get(TypeRepository);
	const arranger = container.get(EnvironmentArranger);

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	beforeAll(async () => {
		await arranger.clean();
	});

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	afterAll(async () => {
		await arranger.clean();
		await arranger.close();
	});
	describe('#save', () => {
		it('should correctly save a Type in the database', async () => {
			const type = TypeMother.create();

			await repo.save(type);
			const inDatabase = await repo.search(type);
			expect(type).toEqual(inDatabase);
		});
	});

	describe('#search', () => {
		it('should retrieve an existing Type from the database', async () => {
			const type = TypeMother.create();
			await repo.save(type);
			const retrievedType = await repo.search(type);
			expect(type).toEqual(retrievedType);
		});

		it('should return null when looking for a non existing Type', async () => {
			const type = TypeMother.create();
			const retrievedType = await repo.search(type);
			expect(retrievedType).toBe(null);
		});
	});
});
