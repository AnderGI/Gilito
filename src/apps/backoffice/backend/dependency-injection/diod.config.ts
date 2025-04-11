import { ContainerBuilder } from 'diod';

import FileUploader from '../../../../contexts/backoffice/file/application/upload/FileUploader';
import { EventBus } from '../../../../contexts/backoffice/file/domain/EventBus';
import FIleRepository from '../../../../contexts/backoffice/file/domain/FIleRepository';
import RabbitMQEventBus from '../../../../contexts/backoffice/file/infrastructure/event/rabbitmq/RabbitMQEventBus';
import R2CloudflareFIleRepository from '../../../../contexts/backoffice/file/infrastructure/persistence/r2-cloudflare/R2CloudflareFIleRepository';
import SaveKnowledgeOnFileUploaded from '../../../../contexts/backoffice/knowledge/application/save/SaveKnowledgeOnFileUploaded';
import { RabbitMQConnection } from '../../../scripts/configure-rabbitmq';
import StatusGetController from '../controllers/status-health-check/StatusGetController';
import FilePutController from '../controllers/upload-file/FilePutController';

const builder = new ContainerBuilder();
builder.registerAndUse(StatusGetController);
builder.registerAndUse(FileUploader);
builder.registerAndUse(FilePutController);
builder.register(RabbitMQConnection).useFactory(() => {
	return RabbitMQConnection.init();
});

builder.registerAndUse(SaveKnowledgeOnFileUploaded).addTag('domainEventSubscriber');
builder.register(FIleRepository).use(R2CloudflareFIleRepository);
builder.register(EventBus).use(RabbitMQEventBus);
const container = builder.build();
export default container;
