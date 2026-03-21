import { AlertCircle, Calendar, Flag, Loader2, MoreVertical } from "lucide-react";

import type { Task } from "@repo/contracts/tasks/entities";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { RenderIf } from "@repo/ui/render-if";
import { cn } from "@repo/ui/utils";

import { useUpdateTaskCompletion } from "@/modules/tasks/app/hooks/use-update-task-completion";
import { truncateText } from "@/utils/truncate-text";
import { OptimisticState, type WithOptimisticState } from "@/utils/types";

const DESCRIPTION_MAX_LENGTH = 100;

type InboxTaskCardProps = {
	task: WithOptimisticState<Partial<Task>>;
	onRetry?: (taskId: string) => void;
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

export function InboxTaskCard(props: InboxTaskCardProps) {
	const { task, onRetry } = props;
	const { toggleTaskCompletion } = useUpdateTaskCompletion();
	const dueDateInfo = formatDueDate(task.dueDate);

	const isPending = task.optimisticState === OptimisticState.PENDING;
	const isError = task.optimisticState === OptimisticState.ERROR;

	return (
		<div
			className={cn(
				"relative flex items-center gap-4 bg-card px-5 py-3.5 hover:bg-muted/60",
				isPending && "opacity-60 pointer-events-none",
				isError && "border-2 border-destructive bg-destructive/5",
			)}
		>
			<RenderIf
				condition={isError}
				render={
					<div className="absolute top-1 right-12 flex items-center gap-1.5">
						<AlertCircle className="h-3.5 w-3.5 text-destructive" />
						<button
							type="button"
							className="text-[11px] text-destructive underline"
							onClick={() => onRetry?.(task.id!)}
						>
							Retry
						</button>
					</div>
				}
			/>
			{/* Faixa lateral baseada na prioridade */}
			<RenderIf
				condition={task.priority != null}
				render={
					<div
						className={cn(
							"absolute left-0 top-2 bottom-2 w-[3px] rounded-r",
							task.priority === "high"
								? "bg-destructive"
								: task.priority === "medium"
									? "bg-amber-500"
									: "bg-blue-500",
						)}
						aria-hidden
					/>
				}
			/>
			<Checkbox
				checked={task.completed ?? false}
				onCheckedChange={() => {
					if (task.id && task.optimisticState === OptimisticState.SYNCED) {
						toggleTaskCompletion({
							taskId: task.id,
							projectId: task.projectId ?? null,
						});
					}
				}}
				disabled={isPending || isError}
				className="mt-0.5 h-4 w-4 shrink-0 rounded border-2"
			/>
			<div className="flex-1 min-w-0">
				<div
					className={cn(
						"text-[13px] font-medium",
						task.completed
							? "line-through text-muted-foreground"
							: "text-foreground",
					)}
				>
					{task.title ?? "Untitled"}
				</div>
				<RenderIf
					condition={task.description != null && task.description !== ""}
					render={
						<p className="mt-0.5 text-[12px] text-muted-foreground">
							{truncateText(task.description ?? "", DESCRIPTION_MAX_LENGTH)}
						</p>
					}
				/>
				<div className="mt-1 flex flex-wrap items-center gap-2">
					<RenderIf
						condition={task.priority != null}
						render={
							<Badge
								variant="secondary"
								className={cn(
									"h-5 rounded-[6px] px-2 py-0 text-[11px] font-medium",
									task.priority === "high"
										? "bg-destructive/15 text-destructive"
										: task.priority === "medium"
											? "bg-chart-2/15 text-chart-2"
											: "bg-chart-4/15 text-chart-4",
								)}
							>
								<Flag className="mr-1 h-3 w-3" />
								{task.priority}
							</Badge>
						}
					/>
					<RenderIf
						condition={dueDateInfo != null}
						render={
							<Badge
								variant="secondary"
								className={cn(
									"h-5 rounded-[6px] px-2 py-0 text-[11px] font-medium",
									dueDateInfo?.isOverdue
										? "bg-destructive/15 text-destructive"
										: "bg-muted text-muted-foreground",
								)}
							>
								<Calendar className="mr-1 h-3 w-3 shrink-0" />
								{dueDateInfo?.isOverdue ? "Venceu " : "Vence "}
								{dueDateInfo?.text}
							</Badge>
						}
					/>
				</div>
			</div>
			<RenderIf
				condition={isPending}
				render={
					<div className="h-8 w-8 shrink-0 flex items-center justify-center">
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
					</div>
				}
			/>
			<RenderIf
				condition={!isPending && !isError}
				render={
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem>Assign to Project</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-destructive">
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
			/>
		</div>
	);
}
