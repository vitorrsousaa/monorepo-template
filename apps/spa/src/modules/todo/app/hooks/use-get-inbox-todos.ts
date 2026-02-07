import { QUERY_KEYS } from "@/config/query-keys";
import type { GetInboxTodosResponse } from "@repo/contracts/todo/inbox";
import { useQuery } from "@tanstack/react-query";
import { getInboxTodos } from "../services/get-inbox";

const EMPTY_INBOX: GetInboxTodosResponse = { todos: [], total: 0 };

export function useGetInboxTodos() {
	const { data, isError, isPending, isFetching, isLoading, refetch } = useQuery(
		{
			queryKey: QUERY_KEYS.TODOS.INBOX,
			queryFn: getInboxTodos,
		},
	);

	return {
		inboxTodos: data ?? EMPTY_INBOX,
		isErrorInboxTodos: isError,
		isFetchingTodos: isFetching || isPending || isLoading,
		refetchTodos: refetch,
	};
}
