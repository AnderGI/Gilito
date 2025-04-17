import { EntitySchema } from 'typeorm';

import File from '../../contexts/backoffice/file/domain/File';

export const FileEntity = new EntitySchema<File>({
	name: 'File',
	tableName: 'files',
	target: File,
	columns: {
		id: {
			type: String,
			primary: true
		},
		path: {
			type: String
		}
	}
});
