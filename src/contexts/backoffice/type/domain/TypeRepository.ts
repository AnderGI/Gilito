import { Nullable } from '../../../shared/domain/Nullable';
import Type from './Type';

export default abstract class TypeRepository {
	public abstract save(_: Type): Promise<void>;
	public abstract search(_: Type): Promise<Nullable<Type>>;
}
