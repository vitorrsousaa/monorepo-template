import { QUERY_KEYS } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getAllTodos } from "../services/get-all";

export function useGetAllTodos() {
	const { data, isError, isPending, isLoading, isFetching } = useQuery({
		queryKey: QUERY_KEYS.TODOS.ALL,
		queryFn: getAllTodos,
	});

	return {
		todos: data,
		isErrorTodos: isError,
		isLoadingTodos: isLoading || isPending,
		isFetchingTodos: isFetching,
	};
}
