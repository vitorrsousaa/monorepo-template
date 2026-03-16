import type { Task } from "@repo/contracts/tasks";

export type GetInboxTasksInputService = {
	userId: string;
}

export interface GetInboxTasksOutputService {
	tasks: Task[];
	total: number
}
