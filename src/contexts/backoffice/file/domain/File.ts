import FileId from './FileId';
import FilePath from './FilePath';

export type FilePrimitives = {
	id: string;
	path: string;
};

export default class File {
	constructor(readonly id: FileId, readonly path: FilePath) {}

	public static fromPrimitives(_: FilePrimitives): File {
		return new File(new FileId(_.id), new FilePath(_.path));
	}

	public equals(other: File): boolean {
		if (!(other instanceof File)) {
			return false;
		}

		return this.id === other.id;
	}
}
