export default class File {
	constructor(readonly id: string, readonly path: string) {}

	public equals(other: File): boolean {
		if (!(other instanceof File)) {
			return false;
		}

		return this.id === other.id;
	}
}
