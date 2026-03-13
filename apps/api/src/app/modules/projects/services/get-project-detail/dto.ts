import type { Project } from "@core/domain/project/project";
import type { Section } from "@core/domain/section/section";
import type { Todo } from "@core/domain/todo/todo";
import { z } from "zod";

/**
 * SectionWithTodos
 *
 * DTO that represents a section with its tasks.
 * Used only for data transfer, not a domain entity.
 */
export interface SectionWithTodos extends Section {
	todos: Todo[];
}

/**
 * ProjectDetailDTO
 *
 * DTO for the GET /projects/:id/details endpoint response.
 * Composes Project + Sections + Tasks + todos without section in a single structure.
 */
export interface ProjectDetailDTO {
	project: Project;
	sections: SectionWithTodos[];
	/** Todos that belong to this project but have no section assigned */
	todosWithoutSection: Todo[];
}

/**
 * GetProjectDetailInput
 *
 * Input for the GetProjectDetail service.
 */
export const GetProjectDetailInputDTO = z.object({
	// In dev, IDs come from mocks and we don't need strict UUID validation here.
	userId: z.string().min(1),
	projectId: z.string().min(1),
});

export type GetProjectDetailInput = z.infer<typeof GetProjectDetailInputDTO>;

/**
 * GetProjectDetailOutput
 *
 * Output from the GetProjectDetail service.
 */
export interface GetProjectDetailOutput {
	data: ProjectDetailDTO;
}
