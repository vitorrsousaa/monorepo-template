import type { TodayProjectOutput } from "@application/modules/tasks/services/get-today-tasks";
import type { Task } from "@core/domain/task/task";
import type { TaskDto, TodayProjectDto } from "@repo/contracts/tasks/today";

function toIso(date: Date | null | undefined): string | null {
	if (date == null) return null;
	return date instanceof Date ? date.toISOString() : null;
}

/** Converts domain Task to API contract TaskDto (dates → ISO strings). */
function taskToDto(task: Task): TaskDto {
	return {
		id: task.id,
		userId: task.userId,
		projectId: task.projectId ?? null,
		sectionId: task.sectionId ?? null,
		title: task.title,
		description: task.description,
		completed: task.completed,
		createdAt:
			task.createdAt instanceof Date
				? task.createdAt.toISOString()
				: String(task.createdAt),
		updatedAt:
			task.updatedAt instanceof Date
				? task.updatedAt.toISOString()
				: String(task.updatedAt),
		order: task.order,
		completedAt: toIso(task.completedAt ?? null),
		dueDate: toIso(task.dueDate ?? null),
		priority: task.priority ?? null,
	};
}

/** Converts service TodayProjectOutput to API contract TodayProjectDto. */
export function todayProjectToDto(
	project: TodayProjectOutput,
): TodayProjectDto {
	return {
		id: project.id,
		name: project.name,
		tasks: project.tasks.map(taskToDto),
	};
}
