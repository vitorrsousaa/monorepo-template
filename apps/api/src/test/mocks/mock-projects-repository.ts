import type { IProjectRepository } from "@data/protocols/projects/project-repository";

export function mockProjectsRepository(
	overrides?: Partial<IProjectRepository>,
): IProjectRepository {
	return {
		getAllProjectsByUser: vi.fn(),
		getById: vi.fn(),
		create: vi.fn(),
		...overrides,
	};
}
