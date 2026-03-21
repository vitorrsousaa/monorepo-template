import type { Task } from "@repo/contracts/tasks";

export interface UncompleteTaskInput {
	task: Task;
}

export interface UncompleteTaskOutput {
	task: Task;
}
