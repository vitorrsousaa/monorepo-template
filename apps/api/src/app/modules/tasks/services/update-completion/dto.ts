import type { Task } from "@repo/contracts/tasks";
import type { UpdateTaskCompletionInput } from "@repo/contracts/tasks/completion";

export interface UpdateTaskCompletionInputService
	extends UpdateTaskCompletionInput {
	userId: string;
	taskId: string;
}

export interface UpdateTaskCompletionOutputService {
	task: Task;
}
