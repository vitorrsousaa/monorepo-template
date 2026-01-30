import type { Todo } from "@/modules/todo/app/entities/todo";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Flag, MoreVertical } from "lucide-react";

type InboxTodoCardProps = {
	todo: Todo;
};

export function InboxTodoCard(props: InboxTodoCardProps) {
	const { todo } = props;
	return (
		<Card
			key={todo.id}
			className="p-4 bg-card border-border hover:border-primary/50 transition-colors"
		>
			<div className="flex items-center gap-4">
				<Checkbox checked={todo.completed} className="border-2" />
				<div className="flex-1">
					<div
						className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
					>
						{todo.title}
					</div>
					<div className="flex items-center gap-3 mt-1">
						<Badge
							variant="secondary"
							className="bg-secondary/50 text-muted-foreground text-xs"
						>
							No Project
						</Badge>
						<Badge
							variant="secondary"
							className={
								todo.priority === "high"
									? "bg-destructive/20 text-destructive"
									: todo.priority === "medium"
										? "bg-chart-2/20 text-chart-2"
										: "bg-chart-4/20 text-chart-4"
							}
						>
							<Flag className="w-3 h-3 mr-1" />
							{todo.priority}
						</Badge>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreVertical className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem>Set Due Date</DropdownMenuItem>
						<DropdownMenuItem>Assign to Project</DropdownMenuItem>
						<DropdownMenuItem>Change Priority</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</Card>
	);
}
