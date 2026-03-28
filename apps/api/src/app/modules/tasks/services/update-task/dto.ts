import type { Task } from "@repo/contracts/tasks";
import type { UpdateTaskInput } from "@repo/contracts/tasks/update";

export interface UpdateTaskServiceInput extends UpdateTaskInput {
	taskId: string;
	userId: string;
}

export interface UpdateTaskServiceOutput {
	task: Task;
}
