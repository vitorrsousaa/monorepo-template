import { httpClient } from "@/services/http-client";
import type { Todo } from "../entities/todo";

export async function getAllTodos() {
	const { data } = await httpClient.get<Todo[]>("/todos");

	return data;
}
