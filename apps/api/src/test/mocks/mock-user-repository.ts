import type { IUserRepository } from "@data/protocols/auth/user-repository";

export function mockUserRepository(
	overrides?: Partial<IUserRepository>,
): IUserRepository {
	return {
		create: vi.fn(),
		getById: vi.fn(),
		...overrides,
	};
}
