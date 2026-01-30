import type { Todo } from "@/modules/todo/app/entities/todo";
import { truncateText } from "@/utils/truncate-text";
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
import { Calendar, Flag, MoreVertical } from "lucide-react";

const DESCRIPTION_MAX_LENGTH = 100;

type InboxTodoCardProps = {
	todo: Todo;
};

function formatDueDate(dueDate: string | Date | null | undefined): {
	text: string;
	isOverdue: boolean;
} | null {
	if (dueDate == null) return null;
	const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
	if (Number.isNaN(date.getTime())) return null;
	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const isOverdue = date < todayStart;
	const text = date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
		year:
			date.getFullYear() !== todayStart.getFullYear() ? "numeric" : undefined,
	});
	return { text, isOverdue };
}

export function InboxTodoCard(props: InboxTodoCardProps) {
	const { todo } = props;
	const dueDateInfo = formatDueDate(todo.dueDate);
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
					{todo.description != null && todo.description !== "" && (
						<p className="text-sm text-muted-foreground mt-0.5">
							{truncateText(todo.description, DESCRIPTION_MAX_LENGTH)}
						</p>
					)}
					<div className="flex items-center gap-3 mt-1 flex-wrap">
						<Badge
							variant="secondary"
							className="bg-secondary/50 text-muted-foreground text-xs"
						>
							No Project
						</Badge>
						{todo.priority != null && (
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
						)}
						{dueDateInfo != null && (
							<Badge
								variant="secondary"
								className={
									dueDateInfo.isOverdue
										? "bg-destructive/15 text-destructive text-xs"
										: "bg-muted text-muted-foreground text-xs"
								}
							>
								<Calendar className="w-3 h-3 mr-1 shrink-0" />
								{dueDateInfo.isOverdue ? "Venceu " : "Vence "}
								{dueDateInfo.text}
							</Badge>
						)}
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
