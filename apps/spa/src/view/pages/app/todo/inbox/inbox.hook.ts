import { useGetInboxTodos } from "@/modules/todo/app/hooks/use-get-inbox-todos";
import { useMemo } from "react";

export function useInboxHook() {
	const { inboxTodos, isErrorInboxTodos, isFetchingTodos, refetchTodos } =
		useGetInboxTodos();

	const shouldRenderInboxTodos = useMemo(
		() =>
			Boolean(!isFetchingTodos && !isErrorInboxTodos && inboxTodos.total > 0),
		[isFetchingTodos, isErrorInboxTodos, inboxTodos.total],
	);

	return {
		shouldRenderInboxTodos,
		inboxTodos: inboxTodos.todos ?? [],
		isFetchingTodos,
		isErrorInboxTodos,
		refetchInboxTodos: refetchTodos,
	};
}
