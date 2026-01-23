import type { Todo } from "@core/domain/todo/todo";

export interface TodoRepository {
	findAll(): Promise<Todo[]>;
	findById(id: string): Promise<Todo | null>;
	create(data: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo>;
	update(id: string, data: Partial<Todo>): Promise<Todo | null>;
	delete(id: string): Promise<boolean>;
}
