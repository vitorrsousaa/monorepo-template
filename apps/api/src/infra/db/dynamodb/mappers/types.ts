/**
 * TodoDynamoDBEntity
 *
 * Representa a estrutura da entidade Todo no DynamoDB.
 *
 * Características:
 * - Usa snake_case (padrão comum em bancos de dados)
 * - Inclui chaves de partição (PK) e ordenação (SK)
 * - Inclui GSI keys para queries alternativas
 * - Datas armazenadas como ISO string
 */
export interface TodoDynamoDBEntity {
	// Partition Key e Sort Key (Single-Table Design)
	PK: string; // Formato: "TODO#${id}"
	SK: string; // Formato: "METADATA"

	// GSI para listar todos os TODOs
	GSI1PK: string; // Formato: "TODO"
	GSI1SK: string; // Formato: ISO timestamp (ordenação por data)

	// Atributos da entidade (snake_case)
	id: string;
	title: string;
	description: string;
	completed: boolean;
	created_at: string; // ISO 8601 string
	updated_at: string; // ISO 8601 string

	// Metadata
	entity_type: string; // "TODO"
}
