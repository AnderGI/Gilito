import 'reflect-metadata';

import { configDotenv } from 'dotenv';
import path from 'path';

import { BackofficeBackendApp } from './BackofficeBackendApp';

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const envFile = `.env.${process.env.NODE_ENV}`;
const filePath = path.resolve(process.cwd(), envFile);
configDotenv({ path: filePath });

try {
	new BackofficeBackendApp().start();
} catch (e) {
	console.log(e);
	process.exit(1);
}

process.on('uncaughtException', err => {
	console.log('uncaughtException', err);
	process.exit(1);
});
