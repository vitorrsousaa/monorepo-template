import type { CreateTaskInputDto } from "@repo/contracts/tasks/create";
import type { Task } from "@repo/contracts/tasks";

export interface CreateTasksInput extends CreateTaskInputDto {
	userId: string;
}

export interface CreateTasksOutput {
	task: Task;
}
