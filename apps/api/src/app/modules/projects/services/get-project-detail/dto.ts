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
 * Composes Project + Sections + Tasks in a single structure.
 */
export interface ProjectDetailDTO {
	project: Project;
	sections: SectionWithTodos[];
}

/**
 * GetProjectDetailInput
 *
 * Input for the GetProjectDetail service.
 */
export const GetProjectDetailInputDTO = z.object({
	userId: z.string().uuid(),
	projectId: z.string().uuid(),
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
