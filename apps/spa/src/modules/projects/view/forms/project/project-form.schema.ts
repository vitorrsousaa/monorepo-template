import { PROJECT_COLORS } from "@repo/contracts/projects/create";
import * as z from "zod";

export const ProjectFormSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	color: z.enum(PROJECT_COLORS),
});

export type TProjectFormSchema = z.infer<typeof ProjectFormSchema>;

export const defaultInitialValues: TProjectFormSchema = {
	name: "",
	description: "",
	color: "#7F77DD",
};
