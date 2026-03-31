import type { ISectionRepository } from "@data/protocols/sections/section-repository";

export function mockSectionsRepository(
	overrides?: Partial<ISectionRepository>,
): ISectionRepository {
	return {
		getAllByProject: vi.fn(),
		create: vi.fn(),
		delete: vi.fn(),
		...overrides,
	};
}
