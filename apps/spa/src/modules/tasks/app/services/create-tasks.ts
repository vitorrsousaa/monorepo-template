import { httpClient } from "@/services/http-client";
import type { CreateTaskInput, CreateTaskOutput } from "@repo/contracts/tasks/create";

export async function createTasks(input: CreateTaskInput) {
	const { data } = await httpClient.post<CreateTaskOutput>(
		"/tasks/create",
		input,
	);

	return data.task;
}
