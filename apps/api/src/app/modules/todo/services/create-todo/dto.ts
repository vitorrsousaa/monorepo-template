import type { Todo } from "@core/domain/todo/todo";
import { z } from "zod";

/**
 * CreateTodoInputDTO
 *
 * Validation schema for TODO creation.
 * Defines only essential fields: title and description.
 */
export const CreateTodoInputDTO = z.object({
	title: z
		.string()
		.min(1, "Title cannot be empty")
		.max(100, "Title must have at most 100 characters"),

	description: z
		.string()
		.min(1, "Description cannot be empty")
		.max(500, "Description must have at most 500 characters"),
});

/**
 * CreateTodoInput
 *
 * Type inferred from validation schema.
 * Ensures type safety throughout the application.
 */
export type CreateTodoInput = z.infer<typeof CreateTodoInputDTO>;

/**
 * CreateTodoOutput
 *
 * Service return type for TODO creation.
 * Uses the domain entity directly to avoid duplication.
 */
export interface CreateTodoOutput {
	todo: Todo;
}
