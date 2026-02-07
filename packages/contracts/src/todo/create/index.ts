import type { TodoDto } from "../dto";

/** Request body for POST /todos */
export interface CreateTodoRequest {
	userId: string;
	projectId?: string | null;
	title: string;
	description: string;
}

/** Response body of POST /todos (created todo wrapped). */
export interface CreateTodoResponse {
	todo: TodoDto;
}
