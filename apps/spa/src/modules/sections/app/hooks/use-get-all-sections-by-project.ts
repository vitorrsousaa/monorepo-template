import { QUERY_KEYS } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getAllSectionsByProject } from "../services/get-all-by-project";

interface UseGetAllSectionsByProjectParams {
	projectId: string;
	enabled?: boolean;
}

export function useGetAllSectionsByProject(
	params: UseGetAllSectionsByProjectParams,
) {
	const { projectId, enabled = true } = params;

	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.SECTIONS.BY_PROJECT(projectId),
			queryFn: () => getAllSectionsByProject({ projectId }),
			enabled: enabled && !!projectId,
		},
	);

	return {
		sections: data?.sections ?? [],
		total: data?.total ?? 0,
		isErrorSections: isError,
		isFetchingSections: isFetching || isPending || isLoading,
		refetchSections: refetch,
	};
}
