import { PRIORITY_VALUES } from "@/modules/todo/app/entities/todo";
import * as z from "zod";

export const TodoFormSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	project: z.string(),
	priority: z.enum(PRIORITY_VALUES),
});

export type TTodoFormSchema = z.infer<typeof TodoFormSchema>;

export const defaultInitialValues: TTodoFormSchema = {
	title: "",
	description: "",
	project: "inbox",
	priority: "none",
};
