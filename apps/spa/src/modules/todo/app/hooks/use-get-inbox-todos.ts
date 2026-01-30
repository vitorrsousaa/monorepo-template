import { QUERY_KEYS } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getInboxTodos } from "../services/get-inbox";

export function useGetInboxTodos() {
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.TODOS.INBOX,
			queryFn: getInboxTodos,
		},
	);

	return {
		todos: data || [],
		isErrorInboxTodos: isError,
		isFetchingTodos: isFetching || isPending || isLoading,
		refetchTodos: refetch,
	};
}
