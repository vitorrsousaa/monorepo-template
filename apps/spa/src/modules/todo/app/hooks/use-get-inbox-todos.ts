import { QUERY_KEYS } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getInboxTodos } from "../services/get-inbox";

export function useGetInboxTodos() {
	const { data, isError, isPending, isLoading, isFetching } = useQuery({
		queryKey: QUERY_KEYS.TODOS.INBOX,
		queryFn: getInboxTodos,
	});

	return {
		todos: data,
		isErrorTodos: isError,
		isLoadingTodos: isLoading || isPending,
		isFetchingTodos: isFetching,
	};
}
