import { z } from "zod";
import type { Task } from "../dto";

// ── Validation constants (shared with SPA form schemas) ──
export const TASK_TITLE_MIN = 1;
export const TASK_TITLE_MAX = 100;
export const TASK_DESCRIPTION_MAX = 500;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export const createTaskSchema = z.object({
	title: z
		.string()
		.min(TASK_TITLE_MIN, "Title cannot be empty")
		.max(TASK_TITLE_MAX, `Title must have at most ${TASK_TITLE_MAX} characters`),
	description: z
		.string()
		.max(TASK_DESCRIPTION_MAX, `Description must have at most ${TASK_DESCRIPTION_MAX} characters`)
		.optional().nullable(),
	priority: z.enum(TASK_PRIORITIES).optional(),
	dueDate: z.string().nullable().optional(),
	projectId: z.string().uuid().nullable().optional(),
	sectionId: z.string().uuid().nullable().optional(),
});

export type CreateTaskInputDto = z.infer<typeof createTaskSchema>;

export interface CreateTaskResponse {
	task: Task;
}
