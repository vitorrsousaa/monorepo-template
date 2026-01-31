import * as z from "zod";

export const ProjectFormSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
});

export type TProjectFormSchema = z.infer<typeof ProjectFormSchema>;

export const defaultInitialValues: TProjectFormSchema = {
	name: "",
	description: "",
};
