import type { Project } from "@repo/contracts/projects";

const defaults: Project = {
	id: "project-001",
	userId: "user-001",
	name: "Test project",
	description: null,
	color: "#7F77DD",
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-01-01T00:00:00.000Z",
	isShared: false,
	role: "owner",
};

export function buildProject(overrides?: Partial<Project>): Project {
	return { ...defaults, ...overrides };
}
