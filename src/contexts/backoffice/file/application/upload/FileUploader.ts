import File from '../../domain/File';
import FIleRepository from '../../domain/FIleRepository';

export default class FileUploader {
	constructor(private readonly repository: FIleRepository) {}
	public async upload(id: string, filePath: string): Promise<void> {
		const _ = File.fromPrimitives({ id, path: filePath });
		await this.repository.save(_);
	}
}
