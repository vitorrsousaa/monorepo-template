import type { Section } from "@repo/contracts/sections/entities";

const defaults: Section = {
	id: "section-001",
	userId: "user-001",
	projectId: "project-001",
	name: "Test section",
	order: 0,
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-01-01T00:00:00.000Z",
};

export function buildSection(overrides?: Partial<Section>): Section {
	return { ...defaults, ...overrides };
}
