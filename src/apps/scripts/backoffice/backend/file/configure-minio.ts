/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';

// Cargar variables de entorno
const FILES_BUCKET_NAME = 'files';
const client = new S3Client({
	forcePathStyle: true, // importante para MinIO
	endpoint: 'http://localhost:9000',
	region: 'us-east-1',
	credentials: {
		accessKeyId: 'minioadmin',
		secretAccessKey: 'minioadmin'
	}
});

const main = async () => {
	try {
		const command = new CreateBucketCommand({ Bucket: FILES_BUCKET_NAME });
		await client.send(command);
	} catch {
		console.error('❌ Error creando el bucket:');
	}
};

main();
