import { updateTaskCompletion } from "@/modules/tasks/app/services/update-task-completion";
import type { UpdateTaskCompletionInput } from "@repo/contracts/tasks/completion";
import type { Task } from "@repo/contracts/tasks/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateTaskCompletionMutation } from "../mutations/update-task-completion.mutation";

export type UpdateTaskCompletionVariables = UpdateTaskCompletionInput & {
	taskId: string;
	nextCompleted: boolean;
	/** Full task object — required to handle recurring task next-task insertion */
	task: Task;
};

export function useUpdateTaskCompletion() {
	const queryClient = useQueryClient();

	const { onMutate, onSuccess, onError } =
		useUpdateTaskCompletionMutation(queryClient);

	const { mutate: toggleTaskCompletion } = useMutation({
		mutationFn: async ({
			taskId,
			nextCompleted: _nextCompleted,
			task: _task,
			...input
		}: UpdateTaskCompletionVariables) => {
			return updateTaskCompletion({ taskId, ...input });
		},
		onMutate,
		onSuccess,
		onError,
	});

	return { toggleTaskCompletion };
}
