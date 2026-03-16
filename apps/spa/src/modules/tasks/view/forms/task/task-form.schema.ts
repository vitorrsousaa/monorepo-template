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

export const TaskFormSchema = z.object({
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

export type TTaskFormSchema = z.infer<typeof TaskFormSchema>;

export type TRecurrenceForm = z.infer<typeof recurrenceSchema>;

export const defaultInitialValues: TTaskFormSchema = {
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
 * Returns complete task form values by merging defaults with optional overrides.
 * Use when you need full TTaskFormSchema (e.g. defaultValues for useForm).
 */
export function getTaskFormValues(
	overrides?: Partial<TTaskFormSchema>,
): TTaskFormSchema {
	return {
		...defaultInitialValues,
		...overrides,
	};
}
