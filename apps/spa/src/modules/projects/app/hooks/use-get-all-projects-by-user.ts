import { QUERY_KEYS } from "@/config/query-keys";
import type { Project } from "@/modules/projects/app/entitites/project";
import { getAllProjectsByUser } from "@/modules/projects/app/services/get-all-projects-by-user";
import type { WithOptimisticState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useGetAllProjectsByUser() {
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.PROJECTS.ALL,
			queryFn: async () => {
				const projects = await getAllProjectsByUser();
				return projects as WithOptimisticState<Project>[];
			},
		},
	);

	return {
		projects: data || [],
		isErrorProjects: isError,
		isFetchingProjects: isFetching || isPending || isLoading,
		refetchProjects: refetch,
	};
}
