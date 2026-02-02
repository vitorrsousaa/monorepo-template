import type { Todo } from "@/modules/todo/app/entities/todo";
import { Badge } from "@repo/ui/badge";
import { Checkbox } from "@repo/ui/checkbox";
import { cn } from "@repo/ui/utils";
import { Calendar, Flag } from "lucide-react";

export type ProjectTodoWithoutSectionProps = {
	todo: Todo;
};

export const ProjectTodoWithoutSection = (
	props: ProjectTodoWithoutSectionProps,
) => {
	const { todo } = props;

	return (
		<button
			key={todo.id}
			type="button"
			className="group w-full flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer text-left"
			onClick={() => console.log(todo)}
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
	);
};
