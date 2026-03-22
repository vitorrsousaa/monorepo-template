import type { IConfig } from "./environment";

export class DatabaseTable implements IDatabaseTable {
	constructor(private readonly config: IConfig) {}

	public get TABLE_NAME(): string {
		return `${this.config.SERVICE}-${this.config.STAGE}`;
	}
}

export interface IDatabaseTable {
	TABLE_NAME: string;
}
