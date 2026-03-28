import { QUERY_KEYS } from "@/config/query-keys";
import {
	projectDetailCache,
	projectsSummaryCache,
} from "@/modules/projects/app/cache";
import { tasksInboxCache } from "@/modules/tasks/app/cache/tasks-inbox.cache";
import { createTasks as createTasksService } from "@/modules/tasks/app/services/create-tasks";
import { cancelRelatedQueries, generateTempId } from "@/utils/optimistic";
import type { WithOptimisticState } from "@/utils/types";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import type { CreateTaskInput } from "@repo/contracts/tasks/create";
import type { Task } from "@repo/contracts/tasks/entities";
import type { QueryKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export type TaskWithOptimisticState = WithOptimisticState<Task>;

function resolveDetailSectionId(sectionId: string | null | undefined): string {
	return sectionId ?? PROJECTS_DEFAULT_IDS.INBOX;
}

export function useCreateTasks() {
	const queryClient = useQueryClient();

	const { mutate: createTasks, isPending } = useMutation({
		mutationFn: createTasksService,
		onMutate: async (variables) => {
			const tempId = generateTempId();
			const isInbox = !variables.projectId;
			const { projectId, sectionId } = variables;
			const detailSectionId = projectId
				? resolveDetailSectionId(sectionId)
				: null;

			const relatedKeys: QueryKey[] = [];

			if (isInbox) {
				relatedKeys.push(QUERY_KEYS.TASKS.INBOX);
			}

			if (projectId) {
				relatedKeys.push(QUERY_KEYS.PROJECTS.SUMMARY);
				relatedKeys.push(QUERY_KEYS.PROJECTS.DETAIL(projectId));
			}

			await cancelRelatedQueries(queryClient, relatedKeys);

			if (isInbox) {
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
			}

			if (projectId) {
				const summaryCache = projectsSummaryCache(queryClient);
				summaryCache.incrementTotalCount(projectId);

				const detailCache = projectDetailCache(queryClient, projectId);
				if (detailCache.exists()) {
					detailCache.addTaskToSection(detailSectionId ?? "", tempId, {
						title: variables.title,
						description: variables.description,
						priority: variables.priority,
						dueDate: variables.dueDate,
					});

					detailCache.incrementProjectTotalCount();
				}
			}

			return { tempId, isInbox, projectId, detailSectionId };
		},
		onError: async (_error, _variables, context) => {
			if (!context?.tempId) return;

			const relatedKeys: QueryKey[] = [];

			if (context.isInbox) {
				relatedKeys.push(QUERY_KEYS.TASKS.INBOX);
			}

			if (context.projectId) {
				relatedKeys.push(QUERY_KEYS.PROJECTS.SUMMARY);
				relatedKeys.push(QUERY_KEYS.PROJECTS.DETAIL(context.projectId));
			}

			await cancelRelatedQueries(queryClient, relatedKeys);

			if (context.isInbox) {
				const cache = tasksInboxCache(queryClient);
				cache.markError(context.tempId);
			}

			if (context.projectId) {
				const summaryCache = projectsSummaryCache(queryClient);
				summaryCache.decrementTotalCount(context.projectId);

				const detailCache = projectDetailCache(queryClient, context.projectId);
				if (detailCache.exists()) {
					detailCache.removeTaskFromSection(
						context.detailSectionId ?? "",
						context.tempId,
					);

					detailCache.decrementProjectTotalCount();
				}
			}
		},
		onSuccess: async (data, _variables, context) => {
			if (!context?.tempId) return;

			const relatedKeys: QueryKey[] = [];

			if (context.isInbox) {
				relatedKeys.push(QUERY_KEYS.TASKS.INBOX);
			}

			if (context.projectId) {
				relatedKeys.push(QUERY_KEYS.PROJECTS.DETAIL(context.projectId));
			}

			await cancelRelatedQueries(queryClient, relatedKeys);

			if (context.isInbox) {
				const cache = tasksInboxCache(queryClient);
				cache.replaceWithReal(context.tempId, data);
			}

			if (context.projectId) {
				const detailCache = projectDetailCache(queryClient, context.projectId);
				if (detailCache.exists()) {
					detailCache.replaceTaskInSection(
						context.detailSectionId ?? "",
						context.tempId,
						data,
					);
				}
			}
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
