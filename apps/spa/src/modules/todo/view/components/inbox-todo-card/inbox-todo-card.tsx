import { truncateText } from "@/utils/truncate-text";
import type { TodoDto } from "@repo/contracts/todo/inbox";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { cn } from "@repo/ui/utils";
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
	todo: TodoDto;
};

function formatDueDate(dueDate: string | null | undefined): {
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
		<div className="relative flex items-center gap-4 bg-card px-5 py-3.5 hover:bg-muted/60">
			{/* Faixa lateral baseada na prioridade */}
			<div
				className={cn(
					"absolute left-0 top-2 bottom-2 w-[3px] rounded-r",
					todo.priority === "high"
						? "bg-destructive"
						: todo.priority === "medium"
							? "bg-amber-500"
							: "bg-blue-500"
				)}
				aria-hidden
			/>
			<Checkbox
				checked={todo.completed}
				className="mt-0.5 h-4 w-4 shrink-0 rounded border-2"
			/>
			<div className="flex-1 min-w-0">
				<div
					className={cn(
						"text-[13px] font-medium",
						todo.completed ? "line-through text-muted-foreground" : "text-foreground"
					)}
				>
					{todo.title}
				</div>
				{todo.description != null && todo.description !== "" && (
					<p className="mt-0.5 text-[12px] text-muted-foreground">
						{truncateText(todo.description, DESCRIPTION_MAX_LENGTH)}
					</p>
				)}
				<div className="mt-1 flex flex-wrap items-center gap-2">
					{todo.priority != null && (
						<Badge
							variant="secondary"
							className={cn(
								"h-5 rounded-[6px] px-2 py-0 text-[11px] font-medium",
								todo.priority === "high"
									? "bg-destructive/15 text-destructive"
									: todo.priority === "medium"
										? "bg-chart-2/15 text-chart-2"
										: "bg-chart-4/15 text-chart-4"
							)}
						>
							<Flag className="mr-1 h-3 w-3" />
							{todo.priority}
						</Badge>
					)}
					{dueDateInfo != null && (
						<Badge
							variant="secondary"
							className={cn(
								"h-5 rounded-[6px] px-2 py-0 text-[11px] font-medium",
								dueDateInfo.isOverdue
									? "bg-destructive/15 text-destructive"
									: "bg-muted text-muted-foreground"
							)}
						>
							<Calendar className="mr-1 h-3 w-3 shrink-0" />
							{dueDateInfo.isOverdue ? "Venceu " : "Vence "}
							{dueDateInfo.text}
						</Badge>
					)}
				</div>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem>Assign to Project</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
