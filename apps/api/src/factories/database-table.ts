import { DatabaseTable, type IDatabaseTable } from "@application/config/tables";
import { makeConfig } from "./config";

export function makeDatabaseTable(): IDatabaseTable {
	const config = makeConfig();
	return new DatabaseTable(config);
}
