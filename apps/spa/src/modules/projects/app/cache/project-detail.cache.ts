import { QUERY_KEYS } from "@/config/query-keys";
import type { ProjectDetailWithOptimisticState } from "@/modules/projects/app/hooks/use-get-project-detail";
import { OptimisticState } from "@/utils/types";
import type { Task } from "@repo/contracts/tasks/entities";
import type { QueryClient } from "@tanstack/react-query";

export function projectDetailCache(
	queryClient: QueryClient,
	projectId: string,
) {
	const queryKey = QUERY_KEYS.PROJECTS.DETAIL(projectId);

	return {
		exists(): boolean {
			return queryClient.getQueryData(queryKey) !== undefined;
		},

		addTaskToSection(sectionId: string, tempId: string, data: Partial<Task>) {
			queryClient.setQueryData<ProjectDetailWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						sections: old.sections.map((section) => {
							if (section.id !== sectionId) return section;
							return {
								...section,
								tasks: [
									...section.tasks,
									{
										id: tempId,
										userId: "",
										projectId,
										sectionId,
										title: data.title ?? "",
										description: data.description ?? null,
										completed: false,
										createdAt: new Date().toISOString(),
										updatedAt: new Date().toISOString(),
										completedAt: null,
										dueDate: data.dueDate ?? null,
										priority: data.priority ?? null,
										optimisticState: OptimisticState.PENDING,
									},
								],
							};
						}),
					};
				},
			);
		},

		replaceTaskInSection(sectionId: string, tempId: string, realTask: Task) {
			queryClient.setQueryData<ProjectDetailWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						sections: old.sections.map((section) => {
							if (section.id !== sectionId) return section;
							return {
								...section,
								tasks: section.tasks.map((t) =>
									t.id === tempId
										? {
												...realTask,
												optimisticState: OptimisticState.SYNCED,
											}
										: t,
								),
							};
						}),
					};
				},
			);
		},

		removeTaskFromSection(sectionId: string, taskId: string) {
			queryClient.setQueryData<ProjectDetailWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						sections: old.sections.map((section) => {
							if (section.id !== sectionId) return section;
							return {
								...section,
								tasks: section.tasks.filter((t) => t.id !== taskId),
							};
						}),
					};
				},
			);
		},

		patchTaskCompletionOptimistic(taskId: string, nextCompleted: boolean) {
			const completedAt = nextCompleted ? new Date().toISOString() : null;
			queryClient.setQueryData<ProjectDetailWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						sections: old.sections.map((section) => ({
							...section,
							tasks: section.tasks.map((t) =>
								t.id === taskId
									? { ...t, completed: nextCompleted, completedAt }
									: t,
							),
						})),
					};
				},
			);
		},

		/** Replace task by id across all sections with server payload (source of truth). */
		replaceTaskFromServer(task: Task) {
			queryClient.setQueryData<ProjectDetailWithOptimisticState>(
				queryKey,
				(old) => {
					if (!old) return old;
					return {
						...old,
						sections: old.sections.map((section) => ({
							...section,
							tasks: section.tasks.map((t) =>
								t.id === task.id
									? {
											...task,
											optimisticState: OptimisticState.SYNCED,
										}
									: t,
							),
						})),
					};
				},
			);
		},
	};
}
