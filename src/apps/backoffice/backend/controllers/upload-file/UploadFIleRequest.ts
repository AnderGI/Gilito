import { Request } from 'express';

export interface UploadFileRequest extends Request {
	fileId: string;
	filePath: string;
}
