import { ContainerBuilder } from 'diod';
import { DataSource } from 'typeorm';

import FileUploader from '../../../../contexts/backoffice/file/application/upload/FileUploader';
import FileRepository from '../../../../contexts/backoffice/file/domain/FIleRepository';
import R2CloudflareFIleRepository from '../../../../contexts/backoffice/file/infrastructure/persistence/r2-cloudflare/R2CloudflareFIleRepository';
import SaveKnowledgeOnFileUploaded from '../../../../contexts/backoffice/knowledge/application/save/SaveKnowledgeOnFileUploaded';
import TypeAdder from '../../../../contexts/backoffice/type/application/add/TypesAdder';
import TypeRepository from '../../../../contexts/backoffice/type/domain/TypeRepository';
import TypeOrmTypeRepository from '../../../../contexts/backoffice/type/infrastructure/persistence/TypeOrmTypeRepository';
import { EventBus } from '../../../../contexts/shared/domain/EventBus';
import RabbitMQEventBus from '../../../../contexts/shared/infrastructure/event/rabbitmq/RabbitMQEventBus';
import DomainEventFallback from '../../../../contexts/shared/infrastructure/persistence/typeorm/DomainEventFallback';
import TypeOrmConnection from '../../../../contexts/shared/infrastructure/persistence/typeorm/TypeOrmConnection';
import DomainEventJsonDeserializer from '../../../../shared/infrastructure/DomainEventJsonDeserializer';
import RabbitMQConnection from '../../../../shared/infrastructure/RabbitMQConnection';
import RabbitMqConnectionConfig from '../../../../shared/infrastructure/RabbitMqConnectionConfig';
import StatusGetController from '../controllers/status-health-check/StatusGetController';
import TypePutController from '../controllers/type/TypePutController';
import FilePutController from '../controllers/upload-file/FilePutController';

const builder = new ContainerBuilder();
builder.registerAndUse(StatusGetController);
builder.registerAndUse(TypePutController);
builder.registerAndUse(TypeAdder);
builder.register(TypeRepository).use(TypeOrmTypeRepository);
builder.registerAndUse(FileUploader);
builder.registerAndUse(FilePutController);
builder.registerAndUse(RabbitMqConnectionConfig);
builder.registerAndUse(DomainEventJsonDeserializer);
builder.register(DataSource).useFactory(() => TypeOrmConnection.getConnection());
builder.registerAndUse(DomainEventFallback);
builder
	.register(RabbitMQConnection)
	.useFactory(c =>
		RabbitMQConnection.create(c.get(RabbitMqConnectionConfig), c.get(DomainEventJsonDeserializer))
	);

builder.registerAndUse(SaveKnowledgeOnFileUploaded).addTag('domainEventSubscriber');
builder.register(FileRepository).use(R2CloudflareFIleRepository);
builder.register(EventBus).use(RabbitMQEventBus);
const container = builder.build();
export default container;
