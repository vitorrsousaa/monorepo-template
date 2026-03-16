import { Task } from "@repo/contracts/tasks";
import { z } from "zod";

export const CreateTasksInputDTO = z.object({
	userId: z.string().uuid("userId must be a valid UUID"),
	projectId: z.string().uuid().nullable().optional(),
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
	sectionId: z.string().uuid().nullable().optional(),
});

export type CreateTasksInput = z.infer<typeof CreateTasksInputDTO>;

export interface CreateTasksOutput {
	task: Task;
}
