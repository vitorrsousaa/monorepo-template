import type { Task } from "@repo/contracts/tasks";

export interface CompleteTaskInput {
	task: Task;
}

export interface CompleteTaskOutput {
	task: Task;
}
