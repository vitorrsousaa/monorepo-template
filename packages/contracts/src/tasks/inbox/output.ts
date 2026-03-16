import { Task } from "../entities";

/** Response body of GET /tasks/inbox */
export interface GetInboxTasksResponse {
	tasks: Task[];
	total: number;
}
