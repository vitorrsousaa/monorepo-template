import type { IService } from "@application/interfaces/service";
import type { ITodoRepository } from "@data/protocols/todo/todo-repository";
import type { Todo } from "@core/domain/todo/todo";

export interface GetTodosOutput {
	todos: Todo[];
	total: number;
}

export interface IGetTodosService extends IService<void, GetTodosOutput> {}

export class GetTodosService implements IGetTodosService {
	constructor(private readonly todoRepository: ITodoRepository) {}

	async execute(): Promise<GetTodosOutput> {
		const todos = await this.todoRepository.findAll();

		return {
			todos,
			total: todos.length,
		};
	}
}
