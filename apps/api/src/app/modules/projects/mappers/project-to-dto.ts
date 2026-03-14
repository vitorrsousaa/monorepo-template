import type { Project } from "@core/domain/project/project";
import type { ProjectDto } from "@repo/contracts/projects";

function toIso(date: Date | null | undefined): string | undefined {
	if (date == null) return undefined;
	return date instanceof Date ? date.toISOString() : undefined;
}

/** Converts domain Project to API contract ProjectDto (dates → ISO strings). */
export function projectToDto(project: Project): ProjectDto {
	return {
		id: project.id,
		userId: project.userId,
		name: project.name,
		description: project.description,
		deletedAt: toIso(project.deletedAt),
		createdAt:
			project.createdAt instanceof Date
				? project.createdAt.toISOString()
				: String(project.createdAt),
		updatedAt:
			project.updatedAt instanceof Date
				? project.updatedAt.toISOString()
				: String(project.updatedAt),
	};
}
