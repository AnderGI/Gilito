import { Service } from 'diod';

import Type from '../../domain/Type';
import TypeRepository from '../../domain/TypeRepository';

@Service()
export default class TypeAdder {
	constructor(private readonly repo: TypeRepository) {}
	public async run(id: string, type: string): Promise<void> {
		const entity = Type.fromPrimitives({ id, type });

		const inDdbbType = await this.repo.search(entity);

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!inDdbbType) {
			await this.repo.save(entity);
		}
	}
}
