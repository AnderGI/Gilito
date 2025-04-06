/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as amqplib from 'amqplib';
import { configDotenv } from 'dotenv';
import path from 'path';
import process from 'process';

const envFile = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV!}`);
configDotenv({ path: envFile });
async function setup() {
	const connection = await amqplib.connect({
		hostname: process.env.RABBITMQ_HOSTNAME!,
		username: process.env.RABBITMQ_USERNAME!,
		password: process.env.RABBITMQ_PASSWORD!,
		port: parseInt(process.env.RABBITMQ_PORT!, 10)
	});
	const confirmChannel = await connection.createConfirmChannel();

	await confirmChannel.assertExchange('domain_events', 'topic', {
		durable: true,
		autoDelete: false
	});

	await confirmChannel.assertExchange('domain_events_retry', 'topic', {
		durable: true,
		autoDelete: false
	});

	await confirmChannel.assertExchange('domain_events_dead_letter', 'topic', {
		durable: true,
		autoDelete: false
	});

	await confirmChannel.close();

	await connection.close();
}

setup().catch(err => console.error(err));
