import { QUERY_KEYS } from "@/config/query-keys";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";
import type { Project } from "@repo/contracts/projects/entities";
import type { QueryClient } from "@tanstack/react-query";

type ProjectAllItem = WithOptimisticState<Partial<Project>>;

export function projectsAllCache(queryClient: QueryClient) {
	const queryKey = QUERY_KEYS.PROJECTS.ALL;

	return {
		get(): ProjectAllItem[] {
			return queryClient.getQueryData<ProjectAllItem[]>(queryKey) ?? [];
		},

		addOptimistic(
			tempId: string,
			data: { name: string; description?: string | null; color: string },
		) {
			queryClient.setQueryData<ProjectAllItem[]>(queryKey, (old) =>
				(old ?? []).concat({
					id: tempId,
					optimisticState: OptimisticState.PENDING,
					name: data.name,
					description: data.description,
					color: data.color,
				}),
			);
		},

		markError(tempId: string) {
			queryClient.setQueryData<ProjectAllItem[]>(queryKey, (old) =>
				old?.map((p) =>
					p.id === tempId
						? { ...p, optimisticState: OptimisticState.ERROR }
						: p,
				),
			);
		},

		replaceWithReal(tempId: string, realProject: Project) {
			queryClient.setQueryData<ProjectAllItem[]>(queryKey, (old) =>
				old?.map((p) =>
					p.id === tempId
						? { ...realProject, optimisticState: OptimisticState.SYNCED }
						: p,
				),
			);
		},

		remove(id: string) {
			queryClient.setQueryData<ProjectAllItem[]>(queryKey, (old) =>
				old?.filter((p) => p.id !== id),
			);
		},
	};
}
