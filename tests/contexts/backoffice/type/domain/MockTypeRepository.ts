import Type from '../../../../../src/contexts/backoffice/type/domain/Type';
import TypeRepository from '../../../../../src/contexts/backoffice/type/domain/TypeRepository';
import { Nullable } from '../../../../../src/contexts/shared/domain/Nullable';

export default class MockTypeRepository extends TypeRepository {
	private readonly mockSave: jest.Mock;
	private readonly mockSearch: jest.Mock;
	private searchResult: Nullable<Type>;
	constructor() {
		super();
		this.mockSave = jest.fn();
		this.mockSearch = jest.fn();
	}

	public async search(_: Type): Promise<Nullable<Type>> {
		this.mockSearch(_);

		return Promise.resolve(this.searchResult);
	}

	public async save(_: Type): Promise<void> {
		this.mockSave(_);

		return Promise.resolve();
	}

	public searchReturns(result: Nullable<Type>): void {
		this.searchResult = result;
	}

	public expectSaveToHaveBeenCalledWith(expected: Type): void {
		expect(this.mockSave).toHaveBeenCalledWith(expected);
	}

	public expectSearchToHaveBeenCalledWith(expected: Type): void {
		expect(this.mockSearch).toHaveBeenCalledWith(expected);
	}
}
