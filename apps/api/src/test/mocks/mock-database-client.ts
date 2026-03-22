import type { IDatabaseClient } from "@infra/db/dynamodb/contracts/client";

export function mockDatabaseClient(
	overrides?: Partial<IDatabaseClient>,
): IDatabaseClient {
	return {
		create: vi.fn(),
		update: vi.fn(),
		query: vi.fn(),
		queryCount: vi.fn(),
		get: vi.fn(),
		delete: vi.fn(),
		transactWrite: vi.fn(),
		...overrides,
	};
}
