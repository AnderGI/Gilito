import { Service } from 'diod';
import { Response } from 'express';
import httpStatus from 'http-status';

import FileUploader from '../../../../../contexts/backoffice/file/application/upload/FileUploader';
import { Controller } from '../Controller';
import { UploadFileRequest } from './UploadFIleRequest';

@Service()
export default class FilePutController implements Controller {
	constructor(private readonly fileUploader: FileUploader) {}
	run(req: UploadFileRequest, res: Response): void {
		this.fileUploader.upload(req.fileId, req.filePath);
		res.sendStatus(httpStatus.ACCEPTED).send();
	}
}
