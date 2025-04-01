import File from '../../../../../src/contexts/backoffice/file/domain/File';
import FIleRepository from '../../../../../src/contexts/backoffice/file/domain/FIleRepository';

export default class MockFileRepository extends FIleRepository {
	private readonly mockSave: jest.Mock;
	constructor() {
		super();
		this.mockSave = jest.fn();
	}

	public async save(_: File): Promise<void> {
		this.mockSave(_);

		return Promise.resolve();
	}

	public expectSaveToHaveBeenCalledWith(expected: File): void {
		expect(this.mockSave).toHaveBeenNthCalledWith(1, expected);
	}
}
