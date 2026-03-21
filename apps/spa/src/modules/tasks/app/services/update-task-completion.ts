import { httpClient } from "@/services/http-client";
import type {
	UpdateTaskCompletionInput,
	UpdateTaskCompletionOutput,
} from "@repo/contracts/tasks/completion";

interface UpdateTaskCompletionParams extends UpdateTaskCompletionInput {
	taskId: string;
}

export async function updateTaskCompletion({
	taskId,
	...input
}: UpdateTaskCompletionParams) {
	const { data } = await httpClient.patch<UpdateTaskCompletionOutput>(
		`/tasks/${taskId}/completion`,
		input,
	);
	return data;
}
