import File from '../../../../../src/contexts/backoffice/file/domain/File';
import FileRepository from '../../../../../src/contexts/backoffice/file/domain/FIleRepository';

export default class MockFileRepository extends FileRepository {
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
