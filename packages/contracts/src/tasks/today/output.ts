import type { TaskDto } from "../entities";

/** Project with its today tasks (id and name only per domain rules). */
export interface TodayProjectDto {
	id: string;
	name: string;
	color: string;
	tasks: TaskDto[];
}

/** Response body of GET /tasks/today - tasks grouped by project. */
export interface GetTodayTasksResponse {
	projects: TodayProjectDto[];
}
