import type { IService } from "@application/interfaces/service";
import type { TodoRepository } from "@data/protocols/todo-repository";
import type { CreateTodoInput, CreateTodoOutput } from "./dto";

export class CreateTodoService
	implements IService<CreateTodoInput, CreateTodoOutput>
{
	constructor(private readonly todoRepository: TodoRepository) {}

	async execute(input: CreateTodoInput): Promise<CreateTodoOutput> {
		const todo = await this.todoRepository.create({
			title: input.title,
			description: input.description,
			completed: false,
		});

		return {
			todo: {
				id: todo.id,
				title: todo.title,
				description: todo.description,
				completed: todo.completed,
				createdAt: todo.createdAt,
				updatedAt: todo.updatedAt,
			},
		};
	}
}
