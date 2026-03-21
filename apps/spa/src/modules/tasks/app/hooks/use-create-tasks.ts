import { QUERY_KEYS } from "@/config/query-keys";
import { tasksInboxCache } from "@/modules/tasks/app/cache/tasks-inbox.cache";
import { createTasks as createTasksService } from "@/modules/tasks/app/services/create-tasks";
import { cancelRelatedQueries, generateTempId } from "@/utils/optimistic";
import type { CreateTaskInput } from "@repo/contracts/tasks/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const RELATED_KEYS = [QUERY_KEYS.TASKS.INBOX];

export function useCreateTasks() {
	const queryClient = useQueryClient();

	const { mutate: createTasks, isPending } = useMutation({
		mutationFn: createTasksService,
		onMutate: async (variables) => {
			const isInbox = variables.projectId === null;
			if (!isInbox) return { tempId: null, isInbox: false };

			const tempId = generateTempId();

			await cancelRelatedQueries(queryClient, RELATED_KEYS);

			const cache = tasksInboxCache(queryClient);
			cache.addOptimistic(tempId, {
				title: variables.title,
				description: variables.description,
				priority: variables.priority,
				dueDate: variables.dueDate,
				projectId: null,
				sectionId: variables.sectionId,
				completed: false,
			});

			return { tempId, isInbox: true };
		},
		onError: async (_error, _variables, context) => {
			if (!context?.isInbox || !context.tempId) return;

			await cancelRelatedQueries(queryClient, RELATED_KEYS);

			const cache = tasksInboxCache(queryClient);
			cache.markError(context.tempId);
		},
		onSuccess: async (data, _variables, context) => {
			if (!context?.isInbox || !context.tempId) return;

			await cancelRelatedQueries(queryClient, RELATED_KEYS);

			const cache = tasksInboxCache(queryClient);
			cache.replaceWithReal(context.tempId, data);
		},
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
				};
				createTasks(input);
			}
		},
		[queryClient, createTasks],
	);

	return { createTasks, retryTask, isPending };
}
