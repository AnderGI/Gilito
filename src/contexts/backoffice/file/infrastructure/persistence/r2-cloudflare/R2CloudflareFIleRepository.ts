/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';

import File from '../../../domain/File';
import FileRepository from '../../../domain/FIleRepository';

export default class R2CloudflareFIleRepository extends FileRepository {
	public async save(_: File): Promise<void> {
		const streamMain = createReadStream(_.path.path);
		const streamBackup = createReadStream(_.path.path);
		const s3 = new S3Client({
			endpoint: process.env.R2_ENDPOINT!,
			region: process.env.R2_REGION!,
			credentials: {
				accessKeyId: process.env.R2_RW_ACCESS_KEY_ID!,
				secretAccessKey: process.env.R2_RW_SECRET_ACCESS_KEY!
			}
		});

		const commandMain = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_MAIN!,
			Key: _.id.value,
			Body: streamMain,
			ContentType: 'text/plain'
		});

		const commandBackup = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_BACKUP!,
			Key: _.id.value,
			Body: streamBackup,
			ContentType: 'text/plain'
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		await Promise.all([s3.send(commandMain), s3.send(commandBackup)]);
	}
}
