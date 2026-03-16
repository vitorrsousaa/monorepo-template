import type { TaskDto } from "../entities";

/** Response body of GET /tasks/inbox */
export interface GetInboxTasksResponse {
	tasks: TaskDto[];
	total: number;
}
