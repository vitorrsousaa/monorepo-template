import type {
	Section,
	SectionsWithTasks,
} from "@repo/contracts/sections/entities";

export function buildSection(overrides?: Partial<Section>): Section {
	return {
		id: "section-1",
		userId: "user-1",
		projectId: "project-1",
		name: "Default Section",
		order: 0,
		deletedAt: null,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		...overrides,
	};
}

export function buildSectionWithTasks(
	overrides?: Partial<SectionsWithTasks>,
): SectionsWithTasks {
	return {
		...buildSection(),
		tasks: [],
		...overrides,
	};
}
