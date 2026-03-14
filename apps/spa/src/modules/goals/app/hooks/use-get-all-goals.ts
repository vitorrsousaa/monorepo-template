import { QUERY_KEYS } from "@/config/query-keys";
import { getAllGoals } from "../services/get-all-goals";
import { useQuery } from "@tanstack/react-query";

export function useGetAllGoals() {
	const { data, isError, isFetching, isPending, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.GOALS.ALL,
			queryFn: getAllGoals,
		},
	);

	return {
		goals: data ?? [],
		isErrorGoals: isError,
		isFetchingGoals: isFetching || isPending || isLoading,
		refetchGoals: refetch,
	};
}
