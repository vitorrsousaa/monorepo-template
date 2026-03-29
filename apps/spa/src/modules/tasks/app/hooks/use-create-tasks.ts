import { tasksInboxCache } from "@/modules/tasks/app/cache/tasks-inbox.cache";
import { createTasks as createTasksService } from "@/modules/tasks/app/services/create-tasks";
import type { WithOptimisticState } from "@/utils/types";
import type { CreateTaskInput } from "@repo/contracts/tasks/create";
import type { Task } from "@repo/contracts/tasks/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useCreateTaskMutation } from "../mutations/create-task.mutation";

export type TaskWithOptimisticState = WithOptimisticState<Task>;

export type CreateTaskVariables = CreateTaskInput & {
	projectId: string | null | undefined;
	sectionId: string | null | undefined;
};

export function useCreateTasks() {
	const queryClient = useQueryClient();

	const { onMutate, onError, onSuccess } = useCreateTaskMutation(queryClient);

	const { mutate: createTasks, isPending } = useMutation({
		mutationFn: (variables: CreateTaskVariables) =>
			createTasksService(variables),
		onMutate,
		onSuccess,
		onError,
	});

	const retryTask = useCallback(
		(taskId: string) => {
			const cache = tasksInboxCache(queryClient);
			const { tasks } = cache.get();
			const failedTask = tasks.find((t) => t.id === taskId);

			cache.remove(taskId);

			if (failedTask) {
				const input: CreateTaskInput = {
					title: failedTask.title || "Untitled Task",
					description: failedTask.description || null,
					projectId: failedTask.projectId ?? null,
					sectionId: failedTask.sectionId ?? null,
					priority: failedTask.priority ?? null,
					dueDate: failedTask.dueDate ?? null,
					recurrence: failedTask.recurrence ?? null,
				};
				createTasks({
					...input,
					projectId: failedTask.projectId ?? null,
					sectionId: failedTask.sectionId ?? null,
				});
			}
		},
		[queryClient, createTasks],
	);

	return { createTasks, retryTask, isPending };
}
