import type { Task } from "@core/domain/task/task";
import { z } from "zod";

export const GetTodayTasksInputDTO = z.object({
	userId: z.string().uuid(),
});

export type GetTodayTasksInput = z.infer<typeof GetTodayTasksInputDTO>;

export interface TodayProjectOutput {
	id: string;
	name: string;
	tasks: Task[];
}

export interface GetTodayTasksOutput {
	projects: TodayProjectOutput[];
}
