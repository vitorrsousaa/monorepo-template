import z from "zod";

/** Body only; userId is passed in handle() from request.userId */
export const createTodoSchema = z.object({
	projectId: z.string().uuid().nullable().optional(),
	title: z
		.string()
		.min(1, "Title cannot be empty")
		.max(100, "Title must have at most 100 characters"),
	description: z
		.string()
		.min(1, "Description cannot be empty")
		.max(500, "Description must have at most 500 characters"),
});
export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
