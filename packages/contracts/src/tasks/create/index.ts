import { z } from "zod";
import { Task } from "../dto";


export const createTaskSchema = z.object({
	title: z
		.string()
		.min(1, "Title cannot be empty")
		.max(100, "Title must have at most 100 characters"),
	description: z
		.string()
		.min(1, "Description cannot be empty")
		.max(500, "Description must have at most 500 characters"),
	priority: z.enum(["low", "medium", "high"]).optional(),
	dueDate: z.string().nullable().optional(),
	projectId: z.string().uuid().nullable().optional(),
	sectionId: z.string().uuid().nullable().optional(),
});

export type CreateTaskInputDto = z.infer<typeof createTaskSchema>;

export interface CreateTaskResponse {
	task: Task;
}
