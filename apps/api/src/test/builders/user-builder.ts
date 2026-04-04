import type { User } from "@repo/contracts/auth/entities";

const defaults: User = {
	id: "user-001",
	email: "john@example.com",
	name: "John Doe",
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-01-01T00:00:00.000Z",
};

export function buildUser(overrides?: Partial<User>): User {
	return { ...defaults, ...overrides };
}
