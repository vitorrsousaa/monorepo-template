import type { Task } from "../entities";

export interface UpdateTaskCompletionOutput {
	task: Task;
	nextTask?: Task;
}
