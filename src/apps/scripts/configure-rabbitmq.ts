/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as amqplib from 'amqplib';
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

class RabbitMQConnection {
	private readonly connection!: amqplib.ChannelModel;
	private readonly channel!: amqplib.ConfirmChannel;
	public constructor(connection: amqplib.ChannelModel, channel: amqplib.ConfirmChannel) {
		this.connection = connection;
		this.channel = channel;
	}

	public static async create() {
		const connection = await amqplib.connect(RabbitMqConnectionConfig.getConnectionConfig());
		const confirmChannel = await connection.createConfirmChannel();

		return new RabbitMQConnection(connection, confirmChannel);
	}

	public async declareExchanges(
		exchange: string,
		type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match' | string,
		options?: amqplib.Options.AssertExchange
	) {
		await this.channel.assertExchange(exchange, type, options);
	}

	public async close() {
		await this.closeConfirmChannel();
		await this.closeConnection();
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
	const connection = await RabbitMQConnection.create();

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
