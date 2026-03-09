import type { TodoDto } from "../../todo/dto";

/** Task DTO - alias during migration from todo to tasks. Same structure as TodoDto. */
export type TaskDto = TodoDto;

/** Project with its today tasks (id and name only per domain rules). */
export interface TodayProjectDto {
	id: string;
	name: string;
	tasks: TaskDto[];
}

/** Response body of GET /tasks/today - tasks grouped by project. */
export interface GetTodayTasksResponse {
	projects: TodayProjectDto[];
}
