import { QUERY_KEYS } from "@/config/query-keys";
import type { OptimisticState, WithOptimisticState } from "@/utils/types";
import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";
import type { Task } from "@repo/contracts/tasks/entities";
import { useQuery } from "@tanstack/react-query";
import { getProjectDetail } from "../services/get-project-detail";

type SectionWithOptimisticTasks = Omit<
	WithOptimisticState<GetProjectDetailResponse["sections"][number]>,
	"tasks"
> & {
	tasks: (Task & { optimisticState?: OptimisticState })[];
};

export type ProjectDetailWithOptimisticState = Omit<
	WithOptimisticState<GetProjectDetailResponse>,
	"sections"
> & {
	sections: SectionWithOptimisticTasks[];
};

interface UseGetProjectDetailParams {
	projectId: string;
	enabled?: boolean;
}

export function useGetProjectDetail(params: UseGetProjectDetailParams) {
	const { projectId, enabled = true } = params;
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.PROJECTS.DETAIL(projectId),
			queryFn: async () => {
				const projectDetail = await getProjectDetail({ projectId });
				return projectDetail as ProjectDetailWithOptimisticState;
			},
			enabled: enabled && !!projectId,
		},
	);

	return {
		projectDetail: data as ProjectDetailWithOptimisticState | undefined,
		isErrorProjectDetail: isError,
		isFetchingProjectDetail: isFetching || isPending || isLoading,
		refetchProjectDetail: refetch,
	};
}
