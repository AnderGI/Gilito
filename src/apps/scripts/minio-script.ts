/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateBucketCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import path from 'path';

const client = new S3Client({
	forcePathStyle: true,
	endpoint: 'http://localhost:9000',
	region: 'us-east-1',
	credentials: {
		accessKeyId: 'minioadmin',
		secretAccessKey: 'minioadmin'
	}
});

const main = async () => {
	const bucketName = 'gilito-prueba';
	const localFilePath = path.resolve(__dirname, '../../../uploads/01-demo.txt');
	const objectKey = 'files/01-demo.txt';

	try {
		// Crear el bucket si no existe
		const createCommand = new CreateBucketCommand({ Bucket: bucketName });
		await client.send(createCommand);
		console.log(`✅ Bucket "${bucketName}" creado correctamente.`);
	} catch (error: any) {
		if (error?.Code === 'BucketAlreadyOwnedByYou' || error?.name === 'BucketAlreadyOwnedByYou') {
			console.log(`ℹ️ El bucket "${bucketName}" ya existe.`);
		} else {
			console.error('❌ Error al crear el bucket:', error);

			return;
		}
	}

	try {
		// Crear stream de lectura
		const fileStream = createReadStream(localFilePath);

		// Subir al bucket
		const putCommand = new PutObjectCommand({
			Bucket: bucketName,
			Key: objectKey,
			Body: fileStream,
			ContentType: 'text/plain'
		});

		await client.send(putCommand);
		console.log(`✅ Archivo "${objectKey}" subido a bucket "${bucketName}" con stream.`);
	} catch (error) {
		console.error('❌ Error subiendo el archivo con stream:', error);
	}
};

main().catch(err => console.error('❌ Error general:', err));
