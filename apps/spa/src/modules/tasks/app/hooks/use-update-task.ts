import { updateTask } from "@/modules/tasks/app/services/update-task";
import type { UpdateTaskInput } from "@repo/contracts/tasks/update";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateTaskMutation } from "../mutations/update-task.mutation";

export type UpdateTaskMutationVariables = UpdateTaskInput & {
	taskId: string;
	projectId?: string | null;
};

export function useUpdateTask() {
	const queryClient = useQueryClient();

	const { onMutate, onSuccess, onError } = useUpdateTaskMutation(queryClient);

	const { mutate: editTask, isPending } = useMutation({
		mutationFn: ({ taskId, ...input }: UpdateTaskMutationVariables) =>
			updateTask(taskId, input),
		onMutate,
		onSuccess,
		onError,
	});

	return { editTask, isPending };
}
