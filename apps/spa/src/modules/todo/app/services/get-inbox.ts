import { httpClient } from "@/services/http-client";
import type { GetInboxTodosResponse } from "@repo/contracts/todo/inbox";

export async function getInboxTodos() {
	const { data } = await httpClient.get<GetInboxTodosResponse>("/todos/inbox");

	return data;
}
