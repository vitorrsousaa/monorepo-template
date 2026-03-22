import { z } from "zod";

export const SECTION_NAME_MIN = 1;
export const SECTION_NAME_MAX = 100;

export const createSectionSchema = z.object({
	name: z
		.string()
		.min(SECTION_NAME_MIN, "Section name cannot be empty")
		.max(
			SECTION_NAME_MAX,
			`Section name must have at most ${SECTION_NAME_MAX} characters`,
		),
	order: z.number().int().positive().optional(),
});
