import type { TaskDto } from "../tasks/dto";

/**
 * Todo DTO - clone of TaskDto for backward compatibility during migration.
 * Use TaskDto for new code.
 */
export type TodoDto = TaskDto;
