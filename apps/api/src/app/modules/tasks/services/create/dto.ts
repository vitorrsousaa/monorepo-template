import type { Task } from "@repo/contracts/tasks";
import type { CreateTaskInput } from "@repo/contracts/tasks/create";

export interface CreateTasksInputService extends CreateTaskInput {
	userId: string;
}

export interface CreateTasksOutputService {
	task: Task;
}
