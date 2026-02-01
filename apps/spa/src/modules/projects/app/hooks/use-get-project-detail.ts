import { QUERY_KEYS } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getProjectDetail } from "../services/get-project-detail";

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
				return projectDetail;
			},
			enabled: enabled && !!projectId, // Only fetch if enabled and projectId exists
		},
	);

	return {
		projectDetail: data,
		isErrorProjectDetail: isError,
		isFetchingProjectDetail: isFetching || isPending || isLoading,
		refetchProjectDetail: refetch,
	};
}
