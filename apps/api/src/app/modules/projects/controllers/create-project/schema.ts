import z from "zod";

export const createProjectSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
});
export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
