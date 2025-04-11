/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'reflect-metadata';

import * as amqplib from 'amqplib';
import { Service } from 'diod';
import { configDotenv } from 'dotenv';
import path from 'path';
import process from 'process';

const envFile = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV!}`);
configDotenv({ path: envFile });

class RabbitMqConnectionConfig {
	public static getConnectionConfig() {
		return {
			hostname: process.env.RABBITMQ_HOSTNAME!,
			username: process.env.RABBITMQ_USERNAME!,
			password: process.env.RABBITMQ_PASSWORD!,
			port: parseInt(process.env.RABBITMQ_PORT!, 10)
		};
	}
}

@Service()
export class RabbitMQConnection {
	private connection!: amqplib.ChannelModel;
	private channel!: amqplib.ConfirmChannel;

	public static init(): RabbitMQConnection {
		return new RabbitMQConnection();
	}

	public async create(): Promise<void> {
		this.connection = await amqplib.connect(RabbitMqConnectionConfig.getConnectionConfig());
		this.channel = await this.connection.createConfirmChannel();
	}

	public async declareExchanges(
		exchange: string,
		type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string,
		options?: amqplib.Options.AssertExchange
	): Promise<void> {
		await this.channel.assertExchange(exchange, type, options);
	}

	public async close(): Promise<void> {
		await this.closeConfirmChannel();
		await this.closeConnection();
	}

	public async publishEvent(exchange: string, routingKey: string, content: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.channel.publish(
				exchange,
				routingKey,
				Buffer.from(content),
				{
					contentType: 'application/json',
					contentEncoding: 'utf-8'
				},
				error => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				}
			);
		});
	}

	private async closeConfirmChannel() {
		try {
			await this.channel.close();
		} catch {
			console.error('error closing the confirm channel');
		}
	}

	private async closeConnection() {
		try {
			await this.connection.close();
		} catch {
			console.error('error closing the connection');
		}
	}
}

async function setup() {
	const connection = RabbitMQConnection.init();
	await connection.create();
	await Promise.all([
		connection.declareExchanges('domain_events', 'topic', {
			durable: true,
			autoDelete: false
		}),
		connection.declareExchanges('domain_events_retry', 'topic', {
			durable: true,
			autoDelete: false
		}),
		connection.declareExchanges('domain_events_dead_letter', 'topic', {
			durable: true,
			autoDelete: false
		})
	]);

	await connection.close();
}

setup().catch(err => console.error(err));
