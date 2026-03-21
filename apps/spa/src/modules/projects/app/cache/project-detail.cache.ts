import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";
import type { Task } from "@repo/contracts/tasks/entities";
import type { QueryClient } from "@tanstack/react-query";

type ProjectDetailData = Omit<
	WithOptimisticState<GetProjectDetailResponse>,
	"sections"
> & {
	sections: WithOptimisticState<
		GetProjectDetailResponse["sections"][number]
	>[];
};

export function projectDetailCache(
	queryClient: QueryClient,
	projectId: string,
) {
	const queryKey = QUERY_KEYS.PROJECTS.DETAIL(projectId);

	return {
		exists(): boolean {
			return queryClient.getQueryData(queryKey) !== undefined;
		},

		addTaskToSection(
			sectionId: string,
			tempId: string,
			data: Partial<Task>,
		) {
			queryClient.setQueryData<ProjectDetailData>(queryKey, (old) => {
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
			});
		},

		replaceTaskInSection(
			sectionId: string,
			tempId: string,
			realTask: Task,
		) {
			queryClient.setQueryData<ProjectDetailData>(queryKey, (old) => {
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
			});
		},

		removeTaskFromSection(sectionId: string, taskId: string) {
			queryClient.setQueryData<ProjectDetailData>(queryKey, (old) => {
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
			});
		},
	};
}
