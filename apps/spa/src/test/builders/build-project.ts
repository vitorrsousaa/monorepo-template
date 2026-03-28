import type { Project } from "@repo/contracts/projects/entities";

export function buildProject(overrides?: Partial<Project>): Project {
	return {
		id: "project-1",
		userId: "user-1",
		name: "Default Project",
		description: null,
		color: "#3B82F6",
		deletedAt: null,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		...overrides,
	};
}
