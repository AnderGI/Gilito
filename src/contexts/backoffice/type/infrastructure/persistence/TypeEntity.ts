import { EntitySchema } from 'typeorm';

import Type from '../../domain/Type';

export const TypeEntity = new EntitySchema<Type>({
	name: 'TypeEntity',
	tableName: 'backoffice_backend_type',
	columns: {
		id: {
			type: String,
			primary: true
		},
		type: {
			type: String
		}
	}
});
