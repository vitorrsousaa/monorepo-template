import { QUERY_KEYS } from "@/config/query-keys";
import type { WithOptimisticState } from "@/utils/types";
import type { GetProjectDetailResponse } from "@repo/contracts/projects/get-detail";
import { useQuery } from "@tanstack/react-query";
import { getProjectDetail } from "../services/get-project-detail";

export type ProjectDetailWithOptimisticState  = Omit<WithOptimisticState<GetProjectDetailResponse> , 'sections'>& {
	sections: WithOptimisticState<(GetProjectDetailResponse["sections"][number])>[];
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
