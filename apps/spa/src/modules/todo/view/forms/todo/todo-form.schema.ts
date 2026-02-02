import { PRIORITY_VALUES } from "@/modules/todo/app/entities/todo";
import * as z from "zod";

export const TodoFormSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	project: z.string(),
	section: z.string().optional(),
	priority: z.enum(PRIORITY_VALUES),
	dueDate: z.date().optional(),
});

export type TTodoFormSchema = z.infer<typeof TodoFormSchema>;

export const defaultInitialValues: TTodoFormSchema = {
	title: "",
	description: "",
	project: "inbox",
	section: "none",
	priority: "none",
	dueDate: undefined,
};
