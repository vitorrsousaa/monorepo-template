import type { IConfig } from "@application/config/environment";
import { makeConfigEnvironment } from "@factories/config/environment";

export interface IDatabaseTables {
	TABLE_NAME: string;
}

export class DatabaseTables implements IDatabaseTables {
	constructor(private readonly configuration: IConfig) {}

	public get TABLE_NAME(): string {
		const state = this.configuration.STAGE;

		return `ProjectName-${state}`;
	}
}

export const DATABASE_TABLE = new DatabaseTables(makeConfigEnvironment());
