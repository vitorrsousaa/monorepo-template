import { httpClient } from "@/services/http-client";
import type { Todo } from "../entities/todo";

export async function getInboxTodos() {
	const { data } = await httpClient.get<Todo[]>("/todos");

	return data;
}
