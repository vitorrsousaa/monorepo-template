import * as z from "zod";

export const TodoFormSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
});

export type TTodoFormSchema = z.infer<typeof TodoFormSchema>;

export const defaultInitialValues: TTodoFormSchema = {
	title: "",
	description: "",
};
