import { QUERY_KEYS } from "@/config/query-keys";
import { tasksInboxCache } from "@/modules/tasks/app/cache/tasks-inbox.cache";
import { updateTask } from "@/modules/tasks/app/services/update-task";
import type { UpdateTaskInput } from "@repo/contracts/tasks/update";
import { toast } from "@repo/ui/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateTaskVariables = UpdateTaskInput & {
	taskId: string;
	projectId?: string | null;
};

export function useUpdateTask() {
	const queryClient = useQueryClient();

	const { mutate: editTask, isPending } = useMutation({
		mutationFn: ({
			taskId,
			...input
		}: UpdateTaskVariables) => updateTask(taskId, input),
		onMutate: async (variables) => {
			const isInbox = variables.projectId == null;

			if (isInbox) {
				const cache = tasksInboxCache(queryClient);
				cache.patchTaskOptimistic(variables.taskId, { ...variables });
			}
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS.TODAY });

			const isInbox = variables.projectId == null;

			if (isInbox) {
				const cache = tasksInboxCache(queryClient);
				cache.replaceTaskFromServer(data);
			}

			if (variables.projectId) {
				queryClient.invalidateQueries({
					queryKey: QUERY_KEYS.PROJECTS.DETAIL(variables.projectId),
				});
			}
		},
		onError: async (_error, variables) => {
			const isInbox = variables.projectId == null;

			if (isInbox) {
				const cache = tasksInboxCache(queryClient);
				cache.markError(variables.taskId);
			}

			toast.error("Could not update task");
		},
	});

	return { editTask, isPending };
}
