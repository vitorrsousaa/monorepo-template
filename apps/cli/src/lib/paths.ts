import * as path from "node:path";

/**
 * Caminho relativo da pasta `dist/commands/create` até a raiz do monorepo (5 níveis).
 * Usado para resolver caminhos da API quando a CLI roda a partir do build.
 */
const RELATIVE_TO_MONOROOT = "../../../";

/**
 * Retorna o caminho absoluto da pasta de módulos da API.
 * Deve ser chamado com `__dirname` do arquivo que está em `commands/create/`.
 */
export function getApiModulesPath(fromDir: string): string {
	return path.resolve(
		fromDir,
		`${RELATIVE_TO_MONOROOT}apps/api/src/app/modules`,
	);
}

/**
 * Retorna o caminho absoluto da pasta de providers da API.
 * Deve ser chamado com `__dirname` do arquivo que está em `commands/create/`.
 */
export function getApiProvidersPath(fromDir: string): string {
	return path.resolve(
		fromDir,
		`${RELATIVE_TO_MONOROOT}apps/api/src/app/providers`,
	);
}
