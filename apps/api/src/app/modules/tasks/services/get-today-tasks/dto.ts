import type { Task } from "@repo/contracts/tasks";

export type GetTodayTasksInput = {
	userId: string;
};

export interface TodayProjectOutput {
	id: string;
	name: string;
	tasks: Task[];
}

export interface GetTodayTasksOutput {
	projects: TodayProjectOutput[];
}
