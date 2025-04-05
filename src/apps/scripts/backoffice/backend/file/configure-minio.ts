/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { configDotenv } from 'dotenv';

configDotenv();

const s3 = new S3Client({
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	endpoint: `https://${process.env.CLOUDFLARE_ADMIN_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	region: 'auto',
	credentials: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		accessKeyId: process.env.CLOUDFLARE_ADMIN_ACCESS_KEY_ID!,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		secretAccessKey: process.env.CLOUDFLARE_ADMIN_SECRET_ACCESS_KEY!
	}
});

const main = async () => {
	try {
		const command = new CreateBucketCommand({ Bucket: 'demo' });
		await s3.send(command);
	} catch {
		console.error('❌ Error creando el bucket:');
	}
};

main();
