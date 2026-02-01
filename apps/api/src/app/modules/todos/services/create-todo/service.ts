import type { IService } from "@application/interfaces/service";
import type { ITodoRepository } from "@data/protocols/todo/todo-repository";
import type { CreateTodoInput, CreateTodoOutput } from "./dto";

export interface ICreateTodoService
	extends IService<CreateTodoInput, CreateTodoOutput> {}

export class CreateTodoService implements ICreateTodoService {
	constructor(private readonly todoRepository: ITodoRepository) {}

	async execute(input: CreateTodoInput): Promise<CreateTodoOutput> {
		const todo = await this.todoRepository.create({
			userId: input.userId,
			projectId: input.projectId ?? null,
			title: input.title,
			description: input.description,
			completed: false,
		});

		return {
			todo: {
				id: todo.id,
				userId: todo.userId,
				projectId: todo.projectId,
				title: todo.title,
				description: todo.description,
				completed: todo.completed,
				createdAt: todo.createdAt,
				updatedAt: todo.updatedAt,
			},
		};
	}
}
