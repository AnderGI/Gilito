/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import File from '../../../domain/File';
import FIleRepository from '../../../domain/FIleRepository';

export default class R2CloudflareFIleRepository extends FIleRepository {
	public async save(_: File): Promise<void> {
		console.log('llega');
		console.log(_.path.path);

		// const streamMain = createReadStream(_.path.path);
		//const streamBackup = createReadStream(_.path.path);

		const s3 = new S3Client({
			endpoint: 'https://2682a996f2c28fb73471c5372f310a2e.r2.cloudflarestorage.com',
			region: 'auto',
			credentials: {
				accessKeyId: '4884fef5b9ce46ef370425269af9fa8a',
				secretAccessKey: 'e738e4660c09aea40f3d14420b928f511e95f8dfe296f6f11b0e9ac281b5357e'
			}
		});

		const commandMain = new PutObjectCommand({
			Bucket: 'gilito-files-features',
			Key: _.id.value,
			Body: 'streamMain',
			ContentType: 'text/plain'
		});

		const commandBackup = new PutObjectCommand({
			Bucket: 'gilito-files-features-backup',
			Key: _.id.value,
			Body: 'streamBackup',
			ContentType: 'text/plain'
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		await Promise.all([s3.send(commandMain), s3.send(commandBackup)]);
	}
}
