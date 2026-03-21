import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { Project } from "@repo/contracts/projects/entities";
import type { ProjectSummary } from "@repo/contracts/projects/summary";
import type { QueryClient } from "@tanstack/react-query";

type ProjectSummaryItem = WithOptimisticState<ProjectSummary>;

export function projectsSummaryCache(queryClient: QueryClient) {
	const queryKey = QUERY_KEYS.PROJECTS.SUMMARY;

	return {
		get(): ProjectSummaryItem[] {
			return (
				queryClient.getQueryData<ProjectSummaryItem[]>(queryKey) ?? []
			);
		},

		addOptimistic(
			tempId: string,
			data: { name: string; description?: string | null; color: string },
		) {
			const now = new Date().toISOString();

			queryClient.setQueryData<ProjectSummaryItem[]>(
				queryKey,
				(old) =>
					(old ?? []).concat({
						id: tempId,
						optimisticState: OptimisticState.PENDING,
						name: data.name,
						description: data.description,
						color: data.color,
						completedCount: 0,
						totalCount: 0,
						percentageCompleted: 0,
						createdAt: now,
						updatedAt: now,
					}),
			);
		},

		markError(tempId: string) {
			queryClient.setQueryData<ProjectSummaryItem[]>(queryKey, (old) =>
				old?.map((p) =>
					p.id === tempId
						? { ...p, optimisticState: OptimisticState.ERROR }
						: p,
				),
			);
		},

		replaceWithReal(tempId: string, realProject: Project) {
			queryClient.setQueryData<ProjectSummaryItem[]>(queryKey, (old) =>
				old?.map((p) =>
					p.id === tempId
						? {
								id: realProject.id,
								name: realProject.name,
								description: realProject.description,
								color: realProject.color,
								completedCount: 0,
								totalCount: 0,
								percentageCompleted: 0,
								createdAt: realProject.createdAt,
								updatedAt: realProject.updatedAt,
								optimisticState: OptimisticState.SYNCED,
							}
						: p,
				),
			);
		},

		remove(id: string) {
			queryClient.setQueryData<ProjectSummaryItem[]>(queryKey, (old) =>
				old?.filter((p) => p.id !== id),
			);
		},

		incrementTotalCount(projectId: string) {
			queryClient.setQueryData<ProjectSummaryItem[]>(queryKey, (old) => {
				if (!old) return old;
				return old.map((p) => {
					if (p.id !== projectId) return p;
					const totalCount = p.totalCount + 1;
					return {
						...p,
						totalCount,
						percentageCompleted:
							totalCount > 0
								? Math.round((p.completedCount / totalCount) * 100)
								: 0,
					};
				});
			});
		},

		decrementTotalCount(projectId: string) {
			queryClient.setQueryData<ProjectSummaryItem[]>(queryKey, (old) => {
				if (!old) return old;
				return old.map((p) => {
					if (p.id !== projectId) return p;
					const totalCount = Math.max(0, p.totalCount - 1);
					return {
						...p,
						totalCount,
						percentageCompleted:
							totalCount > 0
								? Math.round((p.completedCount / totalCount) * 100)
								: 0,
					};
				});
			});
		},
	};
}
