import { z } from "zod";

export const PROJECT_DESCRIPTION_MAX = 60;

export const PROJECT_COLORS = [
	"#7F77DD",
	"#1D9E75",
	"#378ADD",
	"#F0952A",
	"#A86CC8",
	"#D4537E",
	"#1B9E99",
	"#D94848",
	"#888780",
] as const;

export const createProjectSchema = z.object({
	name: z.string(),
	description: z
		.string()
		.max(
			PROJECT_DESCRIPTION_MAX,
			`Description must have at most ${PROJECT_DESCRIPTION_MAX} characters`,
		)
		.optional()
		.nullable(),
	color: z.enum(PROJECT_COLORS),
});
