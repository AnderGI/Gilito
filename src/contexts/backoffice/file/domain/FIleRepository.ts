import File from './File';

export default abstract class FileRepository {
	public abstract save(_: File): Promise<void>;
}
