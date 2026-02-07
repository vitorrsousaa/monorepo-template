import type { Todo } from "@core/domain/todo/todo";
import type { TodoDto } from "@repo/contracts/todo/inbox";

function toIso(date: Date | null | undefined): string | null {
	if (date == null) return null;
	return date instanceof Date ? date.toISOString() : null;
}

/** Converts domain Todo to API contract TodoDto (dates → ISO strings). */
export function todoToDto(todo: Todo): TodoDto {
	return {
		id: todo.id,
		userId: todo.userId,
		projectId: todo.projectId ?? null,
		sectionId: todo.sectionId ?? null,
		title: todo.title,
		description: todo.description,
		completed: todo.completed,
		createdAt:
			todo.createdAt instanceof Date
				? todo.createdAt.toISOString()
				: String(todo.createdAt),
		updatedAt:
			todo.updatedAt instanceof Date
				? todo.updatedAt.toISOString()
				: String(todo.updatedAt),
		order: todo.order,
		completedAt: toIso(todo.completedAt ?? null),
		dueDate: toIso(todo.dueDate ?? null),
		priority: todo.priority ?? null,
	};
}
