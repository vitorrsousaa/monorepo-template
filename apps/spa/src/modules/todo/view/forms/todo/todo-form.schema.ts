import { PRIORITY_VALUES } from "@/modules/todo/app/entities/todo";
import * as z from "zod";

const recurrenceSchema = z.object({
	enabled: z.boolean(),
	frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
	weeklyDays: z.array(z.number().min(0).max(6)).optional(),
	endType: z.enum(["never", "on_date", "after_count"]).optional(),
	endDate: z.date().optional(),
	endCount: z.number().positive().optional(),
});

export const TodoFormSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	description: z.string().optional(),
	project: z.string(),
	section: z.string().optional(),
	priority: z.enum(PRIORITY_VALUES),
	dueDate: z.date().optional(),
	completed: z.boolean().optional(),
	goal: z.string().optional(),
	recurrence: recurrenceSchema.optional(),
});

export type TTodoFormSchema = z.infer<typeof TodoFormSchema>;

export type TRecurrenceForm = z.infer<typeof recurrenceSchema>;

export const defaultInitialValues: TTodoFormSchema = {
	title: "",
	description: "",
	project: "inbox",
	section: "none",
	priority: "none",
	dueDate: undefined,
	completed: false,
	goal: undefined,
	recurrence: { enabled: false },
};

/**
 * Returns complete todo form values by merging defaults with optional overrides.
 * Use when you need full TTodoFormSchema (e.g. defaultValues for useForm).
 */
export function getTodoFormValues(
	overrides?: Partial<TTodoFormSchema>,
): TTodoFormSchema {
	return {
		...defaultInitialValues,
		...overrides,
	};
}
