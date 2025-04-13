import * as amqplib from 'amqplib';
import { Service } from 'diod';

import { QueuesToSubscriber } from '../../apps/scripts/consume-rabbitmq';
import { DomainEvent } from '../../contexts/shared/domain/DomainEvent';
import DomainEventSubscriber from '../../contexts/shared/domain/DomainEventSubscriber';
import DomainEventJsonDeserializer from './DomainEventJsonDeserializer';
import RabbitMqConnectionConfig from './RabbitMqConnectionConfig';

@Service()
export default class RabbitMQConnection {
	private static readonly MAIN_EXCHANGE = 'domain_events';
	private static readonly RETRY_SUFFIX = '.retry';
	private static readonly DEAD_LETTER_SUFFIX = '.dl';
	private static readonly RETRY_EXCHANGE = `${RabbitMQConnection.MAIN_EXCHANGE}${RabbitMQConnection.RETRY_SUFFIX}`;
	private static readonly DEAD_LETTER_EXCHANGE = `${RabbitMQConnection.MAIN_EXCHANGE}${RabbitMQConnection.DEAD_LETTER_SUFFIX}`;
	private static readonly BASE_QUEUE_CONFIG_PARAMS = {
		exclusive: false,
		durable: true,
		autoDelete: false
	};

	private static readonly EXCHANGE_OPTIONS = {
		durable: true,
		autoDelete: false
	};

	private static readonly PUBLISH_EVENT_OPTIONS = {
		contentType: 'application/json',
		contentEncoding: 'utf-8'
	};

	private static readonly TOPIC_TYPE = 'topic';

	private connection!: amqplib.ChannelModel;
	private channel!: amqplib.ConfirmChannel;

	private constructor(
		private readonly rabbitMqConnectionConfig: RabbitMqConnectionConfig,
		private readonly domainEventJsonDeserializer: DomainEventJsonDeserializer
	) {}

	public static create(
		_: RabbitMqConnectionConfig,
		domainEventJsonDeserializer: DomainEventJsonDeserializer
	): RabbitMQConnection {
		return new RabbitMQConnection(_, domainEventJsonDeserializer);
	}

	public async connect(): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.channel) {
			return;
		}
		this.connection = await amqplib.connect(this.rabbitMqConnectionConfig.getConnectionConfig());
		this.channel = await this.connection.createConfirmChannel();
	}

	public async declareExchanges(): Promise<void> {
		await Promise.all([
			this.declareBaseExchange(),
			this.declareRetryExchange(),
			this.declareDeadLetterExchange()
		]);
	}

	public async close(): Promise<void> {
		await this.closeConfirmChannel();
		await this.closeConnection();
	}

	public async setupQueues(queueName: string, events: string[]): Promise<void> {
		await Promise.all([
			this.setupBaseQueue(queueName, events),
			this.setupRetryQueue(queueName, events),
			this.setupDeadLetterQueue(queueName, events)
		]);
	}

	public async publishEvent(exchange: string, routingKey: string, content: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.channel.publish(
				exchange,
				routingKey,
				Buffer.from(content),
				RabbitMQConnection.PUBLISH_EVENT_OPTIONS,
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

	public async consume(queuesToSubscribers: QueuesToSubscriber[]): Promise<void> {
		await Promise.all(
			queuesToSubscribers.map(_ =>
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				this.channel.consume(
					_.queueName,
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					this._consume(_.subscriber, this.channel, this.domainEventJsonDeserializer)
				)
			)
		);
	}

	private _consume(
		subscriber: DomainEventSubscriber<DomainEvent>,
		channel: amqplib.ConfirmChannel,
		domainEventJsonDeserializer: DomainEventJsonDeserializer
	) {
		return async (msg: amqplib.ConsumeMessage | null) => {
			if (msg === null) {
				return;
			}

			try {
				// Procesar el mensaje
				await subscriber.handle(domainEventJsonDeserializer.deserialize(msg.content.toString()));
				// Confirmar el mensaje como procesado
				channel.ack(msg);
			} catch (error) {
				channel.nack(msg, false, false); // No requeue: false, no múltiple: false
			}
		};
	}

	private async declareDeadLetterExchange() {
		await this.channel.assertExchange(
			RabbitMQConnection.DEAD_LETTER_EXCHANGE,
			RabbitMQConnection.TOPIC_TYPE,
			RabbitMQConnection.EXCHANGE_OPTIONS
		);
	}

	private async declareRetryExchange() {
		await this.channel.assertExchange(
			RabbitMQConnection.RETRY_EXCHANGE,
			RabbitMQConnection.TOPIC_TYPE,
			RabbitMQConnection.EXCHANGE_OPTIONS
		);
	}

	private async declareBaseExchange() {
		await this.channel.assertExchange(
			RabbitMQConnection.MAIN_EXCHANGE,
			RabbitMQConnection.TOPIC_TYPE,
			RabbitMQConnection.EXCHANGE_OPTIONS
		);
	}

	private async setupDeadLetterQueue(queueName: string, events: string[]) {
		await this.channel.assertQueue(
			`${queueName}${RabbitMQConnection.DEAD_LETTER_SUFFIX}`,
			RabbitMQConnection.BASE_QUEUE_CONFIG_PARAMS
		);
		await Promise.all(
			events.map(event =>
				this.channel.bindQueue(
					`${queueName}${RabbitMQConnection.DEAD_LETTER_SUFFIX}`,
					RabbitMQConnection.DEAD_LETTER_EXCHANGE,
					event
				)
			)
		);
	}

	private async setupRetryQueue(queueName: string, events: string[]) {
		await this.channel.assertQueue(
			`${queueName}${RabbitMQConnection.RETRY_SUFFIX}`,
			Object.assign({}, RabbitMQConnection.BASE_QUEUE_CONFIG_PARAMS, {
				messageTtl: 5000,
				deadLetterExchange: RabbitMQConnection.MAIN_EXCHANGE,
				deadLetterRoutingKey: queueName
			})
		);
		await Promise.all(
			events.map(event =>
				this.channel.bindQueue(
					`${queueName}${RabbitMQConnection.RETRY_SUFFIX}`,
					RabbitMQConnection.RETRY_EXCHANGE,
					event
				)
			)
		);
	}

	private async setupBaseQueue(queueName: string, events: string[]) {
		await this.channel.assertQueue(queueName, RabbitMQConnection.BASE_QUEUE_CONFIG_PARAMS);
		await Promise.all(
			events.map(event =>
				this.channel.bindQueue(queueName, RabbitMQConnection.MAIN_EXCHANGE, event)
			)
		);
		await this.channel.bindQueue(queueName, RabbitMQConnection.MAIN_EXCHANGE, queueName);
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
