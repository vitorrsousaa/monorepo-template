import { z } from "zod";

// ── Validation constants (shared with SPA form schemas) ──
export const TASK_TITLE_MIN = 1;
export const TASK_TITLE_MAX = 100;
export const TASK_DESCRIPTION_MAX = 500;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

// ── Recurrence validation constants ──
export const RECURRENCE_FREQUENCIES = [
	"daily",
	"weekly",
	"monthly",
	"yearly",
] as const;
export const RECURRENCE_END_TYPES = [
	"never",
	"on_date",
	"after_count",
] as const;
export const WEEKLY_DAYS_MIN = 0;
export const WEEKLY_DAYS_MAX = 6;

export const createTaskSchema = z.object({
	title: z
		.string()
		.min(TASK_TITLE_MIN, "Title cannot be empty")
		.max(
			TASK_TITLE_MAX,
			`Title must have at most ${TASK_TITLE_MAX} characters`,
		),
	description: z
		.string()
		.max(
			TASK_DESCRIPTION_MAX,
			`Description must have at most ${TASK_DESCRIPTION_MAX} characters`,
		)
		.optional()
		.nullable(),
	priority: z.enum(TASK_PRIORITIES).optional().nullable(),
	dueDate: z.string().nullable().optional(),
	projectId: z.string().uuid().nullable().optional(),
	sectionId: z.string().uuid().nullable().optional(),
	recurrence: z
		.object({
			enabled: z.boolean(),
			frequency: z.enum(RECURRENCE_FREQUENCIES),
			weeklyDays: z
				.array(z.number().min(WEEKLY_DAYS_MIN).max(WEEKLY_DAYS_MAX))
				.optional(),
			endType: z.enum(RECURRENCE_END_TYPES),
			endDate: z.string().optional(),
			endCount: z.number().int().positive().optional(),
		})
		.optional()
		.nullable(),
});
