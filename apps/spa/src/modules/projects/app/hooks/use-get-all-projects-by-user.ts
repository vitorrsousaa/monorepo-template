import { QUERY_KEYS } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getAllProjectsByUser } from "../services/get-all-projects-by-user";

export function useGetAllProjectsByUser() {
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.PROJECTS.ALL,
			queryFn: getAllProjectsByUser,
		},
	);

	return {
		projects: data || [],
		isErrorProjects: isError,
		isFetchingProjects: isFetching || isPending || isLoading,
		refetchProjects: refetch,
	};
}
