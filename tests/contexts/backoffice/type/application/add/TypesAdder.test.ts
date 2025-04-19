import TypeAdder from '../../../../../../src/contexts/backoffice/type/application/add/TypesAdder';
import ExistingTypeException from '../../../../../../src/contexts/backoffice/type/domain/ExistingTypeException';
import { InvalidUUIDException } from '../../../../../../src/contexts/shared/domain/InvalidUUIDException';
import MockTypeRepository from '../../domain/MockTypeRepository';
import { TypeMother } from '../../domain/TypeMother';
import { TypeTypeMother } from '../../domain/TypeTypeMother';

describe('TypesAdder', () => {
	describe('#add', () => {
		const repo = new MockTypeRepository();
		const adder = new TypeAdder(repo);

		it('should correctly add a type', async () => {
			const type = TypeMother.create();
			repo.searchReturns(null);
			await adder.run(type.id.value, type.type.value);

			repo.expectSaveToHaveBeenCalledWith(type);
			repo.expectSearchToHaveBeenCalledWith(type);
		});

		it('should throw an exception when a type already exists', async () => {
			const type = TypeMother.create();
			const existingType = TypeMother.create({
				id: type.id.value, // simula el mismo UUID
				type: TypeTypeMother.random().value
			});

			repo.searchReturns(existingType);

			await expect(adder.run(type.id.value, type.type.value)).rejects.toThrow(
				ExistingTypeException
			);

			repo.expectSearchToHaveBeenCalledWith(type);
		});

		it('should throw an exception if invalid uuid is passed', async () => {
			await expect(adder.run('bhvhjvghvvvhvh', TypeTypeMother.random().value)).rejects.toThrow(
				InvalidUUIDException
			);
		});
	});
});
