import { ContainerBuilder } from 'diod';

import FileUploader from '../../../../contexts/backoffice/file/application/upload/FileUploader';
import FIleRepository from '../../../../contexts/backoffice/file/domain/FIleRepository';
import R2CloudflareFIleRepository from '../../../../contexts/backoffice/file/infrastructure/persistence/r2-cloudflare/R2CloudflareFIleRepository';
import StatusGetController from '../controllers/status-health-check/StatusGetController';
import FilePutController from '../controllers/upload-file/FilePutController';

const builder = new ContainerBuilder();
builder.registerAndUse(StatusGetController);
builder.registerAndUse(FileUploader);
builder.registerAndUse(FilePutController);

builder.register(FIleRepository).use(R2CloudflareFIleRepository);
const container = builder.build();
export default container;
