import { MOCK_USER_ID } from "@application/config/mock-user";
import type { TodoDynamoDBEntity } from "@infra/db/dynamodb/mappers/types";

const USER_PK = `USER#${MOCK_USER_ID}`;

/**
 * In-memory mock data for TodoDynamoRepository (DynamoDB format per docs/database-design.md).
 * Uses MOCK_USER_ID so it aligns with the fake user used when auth is not implemented.
 */
export const TODO_DYNAMO_MOCKS: TodoDynamoDBEntity[] = [
	{
		PK: USER_PK,
		SK: "TODO#INBOX#PENDING#1#1",
		id: "1",
		user_id: MOCK_USER_ID,
		project_id: null,
		title: "Implementar arquitetura Clean",
		description: "Seguir o padrão proposto do Grypp",
		completed: false,
		order: 1,
		created_at: "2026-01-23T10:00:00.000Z",
		updated_at: "2026-01-23T10:00:00.000Z",
		completed_at: null,
		entity_type: "TODO",
	},
	{
		PK: USER_PK,
		SK: "TODO#INBOX#PENDING#2#2",
		id: "2",
		user_id: MOCK_USER_ID,
		project_id: null,
		title: "Criar módulo de autenticação",
		description: "Implementar signin, signup e refresh token",
		completed: false,
		order: 2,
		created_at: "2026-01-23T11:00:00.000Z",
		updated_at: "2026-01-23T11:00:00.000Z",
		completed_at: null,
		entity_type: "TODO",
	},
	{
		PK: USER_PK,
		SK: "TODO#INBOX#COMPLETED#2026-01-23T12:00:00.000Z#3",
		id: "3",
		user_id: MOCK_USER_ID,
		project_id: null,
		title: "Adicionar testes unitários",
		description: "Garantir cobertura de pelo menos 80%",
		completed: true,
		order: 0,
		created_at: "2026-01-23T09:00:00.000Z",
		updated_at: "2026-01-23T12:00:00.000Z",
		completed_at: "2026-01-23T12:00:00.000Z",
		entity_type: "TODO",
	},
];
