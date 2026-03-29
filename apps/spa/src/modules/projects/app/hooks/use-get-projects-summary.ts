import { QUERY_KEYS } from "@/config/query-keys";
import type { WithOptimisticState } from "@/utils/types";
import type { ProjectSummary } from "@repo/contracts/projects/summary";
import { useQuery } from "@tanstack/react-query";
import { getProjectsSummary } from "../services/get-projects-summary";

export type ProjectSummaryWithOptimisticState =
	WithOptimisticState<ProjectSummary>;

export function useGetProjectsSummary() {
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.PROJECTS.SUMMARY,
			queryFn: async () => {
				const projectSummaries = await getProjectsSummary();
				return projectSummaries.projects as ProjectSummaryWithOptimisticState[];
			},
		},
	);

	return {
		projectSummaries: data,
		isErrorProjectsSummary: isError,
		isFetchingProjectsSummary: isFetching || isPending || isLoading,
		refetchProjectsSummary: refetch,
	};
}
