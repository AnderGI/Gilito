import { EntitySchema } from 'typeorm';

import Type from '../../domain/Type';
import TypeId from '../../domain/TypeId';
import TypeType from '../../domain/TypeType';
import { ValueObjectTransformer } from './ValueObjectTransformer';

export const TypeEntity = new EntitySchema<Type>({
	name: 'TypeEntity',
	tableName: 'backoffice_backend_type',
	columns: {
		id: {
			type: String,
			primary: true,
			transformer: ValueObjectTransformer(TypeId)
		},
		type: {
			type: String,
			transformer: ValueObjectTransformer(TypeType)
		}
	}
});
