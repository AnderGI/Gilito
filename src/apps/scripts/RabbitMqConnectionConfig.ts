/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Service } from 'diod';
import { configDotenv } from 'dotenv';
import path from 'path';
import process from 'process';

const envFile = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV!}`);
configDotenv({ path: envFile });

type RabbitMqConnectionConfigParams = {
	hostname: string;
	username: string;
	password: string;
	port: number;
};

@Service()
export default class RabbitMqConnectionConfig {
	public getConnectionConfig(): RabbitMqConnectionConfigParams {
		return {
			hostname: process.env.RABBITMQ_HOSTNAME!,
			username: process.env.RABBITMQ_USERNAME!,
			password: process.env.RABBITMQ_PASSWORD!,
			port: parseInt(process.env.RABBITMQ_PORT!, 10)
		};
	}
}
