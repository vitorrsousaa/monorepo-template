import { z } from "zod";

export const updateTaskCompletionSchema = z.object({
	projectId: z.string().uuid().nullable().optional(),
});
