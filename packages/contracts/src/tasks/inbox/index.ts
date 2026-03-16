import { TaskDto } from "../dto";

/** Input for GET /tasks/inbox (e.g. from context/headers; no body). */
export interface GetInboxTasksRequest {
	userId: string;
}

/** Response body of GET /tasks/inbox */
export interface GetInboxTasksResponse {
	tasks: TaskDto[];
	total: number;
}

