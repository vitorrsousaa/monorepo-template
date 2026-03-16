import { httpClient } from "@/services/http-client";
import type { CreateTaskInput } from "@repo/contracts/tasks/create";
import type { Task } from "@repo/contracts/tasks/entities";

export async function createTasks(input: CreateTaskInput) {
	const { data } = await httpClient.post<Task>("/tasks/create", input);

	return data;
}
