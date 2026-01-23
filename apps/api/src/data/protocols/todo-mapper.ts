import type { Todo } from "@core/domain/todo/todo";

/**
 * TodoMapper
 *
 * Interface agnóstica para mapeamento de dados entre banco de dados e aplicação.
 *
 * Responsabilidades:
 * - Transformar dados do banco (ex: snake_case) para domínio (camelCase)
 * - Transformar dados do domínio para formato do banco
 * - Abstrair detalhes de estrutura do banco (PK/SK, GSI, etc)
 *
 * @template TDBEntity - Tipo da entidade no banco de dados
 */
export interface TodoMapper<TDBEntity = unknown> {
	/**
	 * Mapeia entidade do banco de dados para domínio da aplicação
	 * @param dbEntity - Entidade retornada do banco
	 * @returns Todo - Entidade de domínio
	 */
	toDomain(dbEntity: TDBEntity): Todo;

	/**
	 * Mapeia entidade de domínio para formato do banco de dados
	 * @param todo - Entidade de domínio
	 * @returns TDBEntity - Entidade no formato do banco
	 */
	toDatabase(todo: Todo): TDBEntity;
}
