import { z } from "zod";

export const PROJECT_DESCRIPTION_MAX = 30;

export const createProjectSchema = z.object({
	name: z
		.string(),
	description: z
		.string()
		.max(PROJECT_DESCRIPTION_MAX, `Description must have at most ${PROJECT_DESCRIPTION_MAX} characters`)
		.optional()
		.nullable(),
		color: z.string(),
	userId: z.string().uuid(),
});