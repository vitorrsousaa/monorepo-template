import type { IService } from "@application/interfaces/service";
import type { TodoRepository } from "@data/protocols/todo-repository";
import type { Todo } from "@core/domain/todo/todo";

export interface GetTodosOutput {
	todos: Todo[];
	total: number;
}

export class GetTodosService implements IService<void, GetTodosOutput> {
	constructor(private readonly todoRepository: TodoRepository) {}

	async execute(): Promise<GetTodosOutput> {
		const todos = await this.todoRepository.findAll();

		return {
			todos,
			total: todos.length,
		};
	}
}
