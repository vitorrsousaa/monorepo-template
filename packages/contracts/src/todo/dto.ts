import type { TaskDto } from "../tasks/entities";

/**
 * Todo DTO - clone of TaskDto for backward compatibility during migration.
 * Use TaskDto for new code.
 */
export type TodoDto = TaskDto;
