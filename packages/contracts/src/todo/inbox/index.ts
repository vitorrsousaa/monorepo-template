import type { TodoDto } from "../dto";

/** Input for GET /todos/inbox (e.g. from context/headers; no body). */
export interface GetInboxTodosRequest {
	userId: string;
}

/** Response body of GET /todos/inbox */
export interface GetInboxTodosResponse {
	todos: TodoDto[];
	total: number;
}

export type { TodoDto } from "../dto";
