import type { IService } from "@application/interfaces/service";
import type { TodoRepository } from "@data/protocols/todo/todo-repository";
import type { GetInboxTodosInput, GetInboxTodosOutput } from "./dto";

export interface IGetInboxTodosService
	extends IService<GetInboxTodosInput, GetInboxTodosOutput> {}

export class GetInboxTodosService implements IGetInboxTodosService {
	constructor(private readonly todoRepository: TodoRepository) {}

	async execute(data: GetInboxTodosInput): Promise<GetInboxTodosOutput> {
		const todos = await this.todoRepository.findInboxTodos(data.userId);

		return {
			todos,
			total: todos.length,
		};
	}
}
