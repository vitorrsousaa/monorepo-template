import z from "zod";

/** Body only; userId and projectId are passed in handle() from request */
export const createSectionSchema = z.object({
	name: z.string().min(1),
	order: z.number().int().positive().optional(),
});
export type CreateSectionSchema = z.infer<typeof createSectionSchema>;
