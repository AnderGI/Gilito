import { Service } from 'diod';

import { EventBus } from '../../../../shared/domain/EventBus';
import File from '../../domain/File';
import FIleRepository from '../../domain/FIleRepository';
import FileUploadedDomainEvent from '../../domain/FileUploadedDomainEvent';

@Service()
export default class FileUploader {
	constructor(private readonly repository: FIleRepository, private readonly bus: EventBus) {}
	public async upload(id: string, filePath: string): Promise<void> {
		const _ = File.fromPrimitives({ id, path: filePath });
		await this.repository.save(_);
		const event = new FileUploadedDomainEvent({ filePath });
		await this.bus.publish(event);
	}
}
