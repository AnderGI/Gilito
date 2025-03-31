import File from './File';

export default abstract class FIleRepository {
	public abstract save(_: File): Promise<void>;
}
