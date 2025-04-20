export default abstract class EnvironmentArranger {
	public abstract clean(): Promise<void>;
	public abstract close(): Promise<void>;
}
