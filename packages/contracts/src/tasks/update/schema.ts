import { z } from "zod";
import {
	RECURRENCE_END_TYPES,
	RECURRENCE_FREQUENCIES,
	WEEKLY_DAYS_MAX,
	WEEKLY_DAYS_MIN,
} from "../create/schema";

export const updateTaskSchema = z.object({
	title: z.string().min(1).max(100).optional(),
	description: z.string().max(500).optional().nullable(),
	priority: z.enum(["low", "medium", "high"]).optional().nullable(),
	dueDate: z.string().optional().nullable(),
	projectId: z.string().uuid().optional().nullable(),
	sectionId: z.string().uuid().optional().nullable(),
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
