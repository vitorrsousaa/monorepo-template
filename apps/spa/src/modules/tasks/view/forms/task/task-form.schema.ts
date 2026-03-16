import {
	TASK_DESCRIPTION_MAX,
	TASK_TITLE_MAX,
	TASK_TITLE_MIN,
} from "@repo/contracts/tasks/create";
import * as z from "zod";

const FORM_PRIORITY_VALUES = ["none", "low", "medium", "high"] as const;

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
	title: z
		.string()
		.min(TASK_TITLE_MIN, "Title cannot be empty")
		.max(TASK_TITLE_MAX, `Title must have at most ${TASK_TITLE_MAX} characters`),
	description: z
		.string()
		.max(TASK_DESCRIPTION_MAX, `Description must have at most ${TASK_DESCRIPTION_MAX} characters`)
		.optional(),
	project: z.string(),
	section: z.string().optional(),
	priority: z.enum(FORM_PRIORITY_VALUES),
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
