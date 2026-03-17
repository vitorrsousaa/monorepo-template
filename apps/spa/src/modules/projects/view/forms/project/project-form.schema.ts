import { PROJECT_COLORS, PROJECT_DESCRIPTION_MAX } from "@repo/contracts/projects/create";
import * as z from "zod";

export const ProjectFormSchema = z.object({
	name: z.string(),
	description: z
		.string()
		.max(PROJECT_DESCRIPTION_MAX, `Description must have at most ${PROJECT_DESCRIPTION_MAX} characters`)
		.optional()
		.nullable(),
	color: z.enum(PROJECT_COLORS),
});

export type TProjectFormSchema = z.infer<typeof ProjectFormSchema>;

export const defaultInitialValues: TProjectFormSchema = {
	name: "",
	description: "",
	color: "#7F77DD",
};
