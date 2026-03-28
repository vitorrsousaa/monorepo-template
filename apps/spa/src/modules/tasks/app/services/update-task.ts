import { httpClient } from "@/services/http-client";
import type {
	UpdateTaskInput,
	UpdateTaskOutput,
} from "@repo/contracts/tasks/update";

export async function updateTask(taskId: string, input: UpdateTaskInput) {
	const { data } = await httpClient.put<UpdateTaskOutput>(
		`/tasks/${taskId}`,
		input,
	);

	return data.task;
}
