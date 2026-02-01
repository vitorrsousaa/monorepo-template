import type { SectionWithTodos } from "@/modules/sections/app/entities/section-with-todos";
import { EditTodoModal } from "@/modules/todo/view/modals/edit-todo-modal";
import { NewTodoModal } from "@/modules/todo/view/modals/new-todo-modal";
import type { Todo } from "@/pages/app/todo/today";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { cn } from "@repo/ui/utils";
import { Calendar, Flag, GripVertical, Plus } from "lucide-react";
import { useState } from "react";

export type ProjectSectionProps = {
	section: SectionWithTodos;
	projectId: string;
	projectName: string;
};

export const ProjectSection = (props: ProjectSectionProps) => {
	const { section, projectId, projectName } = props;
	const sectionTodos = section.todos;

	const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false);
	const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

	return (
		<div>
			<div className="flex items-center gap-3 mb-3">
				<GripVertical className="w-4 h-4 text-muted-foreground" />
				<h2 className="font-semibold text-lg">{section.name}</h2>
				<Badge variant="secondary" className="rounded-full">
					{sectionTodos.length}
				</Badge>
				<Button
					variant="ghost"
					size="sm"
					className="ml-auto h-8"
					onClick={() => setIsNewTodoModalOpen(true)}
				>
					<Plus className="w-4 h-4" />
				</Button>
			</div>

			<div className="space-y-2">
				{sectionTodos.map((todo) => (
					<button
						key={todo.id}
						type="button"
						className="group w-full flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer text-left"
						onClick={() =>
							setSelectedTodo({
								...todo,
								projectName,
								projectId,
								dueDate: todo.dueDate?.toString() || undefined,
							})
						}
					>
						<Checkbox
							checked={todo.completed}
							className="border-2"
							onClick={(e) => e.stopPropagation()}
						/>
						<div className="flex-1 min-w-0">
							<div
								className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
							>
								{todo.title}
							</div>
							{todo.description && (
								<div className="text-sm text-muted-foreground mt-1">
									{todo.description}
								</div>
							)}
							<div className="flex items-center gap-3 mt-2">
								{todo.dueDate && (
									<div className="flex items-center gap-1 text-xs text-muted-foreground">
										<Calendar className="w-3 h-3" />
										{new Date(todo.dueDate).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										})}
									</div>
								)}
								<Badge
									variant="secondary"
									className={cn(
										"text-xs",
										todo.priority === "high"
											? "bg-destructive/20 text-destructive"
											: todo.priority === "medium"
												? "bg-chart-2/20 text-chart-2"
												: "bg-chart-4/20 text-chart-4",
									)}
								>
									<Flag className="w-3 h-3 mr-1" />
									{todo.priority}
								</Badge>
							</div>
						</div>
					</button>
				))}

				{sectionTodos.length === 0 && (
					<div className="text-sm text-muted-foreground italic py-4 text-center">
						No tasks in this section
					</div>
				)}
			</div>

			<NewTodoModal
				isOpen={isNewTodoModalOpen}
				onClose={() => setIsNewTodoModalOpen(false)}
				projectId={projectId}
			/>

			{selectedTodo && (
				<EditTodoModal
					isOpen={!!selectedTodo}
					onClose={() => setSelectedTodo(null)}
					todo={
						selectedTodo as unknown as Record<string, string> & {
							completed: boolean;
						}
					}
				/>
			)}
		</div>
	);
};
