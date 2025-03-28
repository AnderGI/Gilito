import { ContainerBuilder } from 'diod';

import StatusGetController from '../controllers/status-health-check/StatusGetController';

const builder = new ContainerBuilder();
builder.registerAndUse(StatusGetController);
const container = builder.build();
export default container;
