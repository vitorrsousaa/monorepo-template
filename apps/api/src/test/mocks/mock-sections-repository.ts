import type { ISectionRepository } from "@data/protocols/sections/section-repository";

export function mockSectionsRepository(
	overrides?: Partial<ISectionRepository>,
): ISectionRepository {
	return {
		getAllByProject: vi.fn(),
		getById: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		...overrides,
	};
}
