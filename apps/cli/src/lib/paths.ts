import * as path from "node:path";

/**
 * Relative path from `dist/commands/create` to monorepo root (5 levels).
 * Used to resolve API paths when the CLI runs from the build output.
 */
const RELATIVE_TO_MONOROOT = "../../../";

/**
 * Returns the absolute path to the API modules folder.
 * Must be called with `__dirname` from a file in `commands/create/`.
 */
export function getApiModulesPath(fromDir: string): string {
	return path.resolve(
		fromDir,
		`${RELATIVE_TO_MONOROOT}apps/api/src/app/modules`,
	);
}

/**
 * Returns the absolute path to the API providers folder.
 * Must be called with `__dirname` from a file in `commands/create/`.
 */
export function getApiProvidersPath(fromDir: string): string {
	return path.resolve(
		fromDir,
		`${RELATIVE_TO_MONOROOT}apps/api/src/app/providers`,
	);
}
