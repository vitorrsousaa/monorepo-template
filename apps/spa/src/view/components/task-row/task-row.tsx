import { PriorityBadge } from "@/components/priority-badge";
import type { TTaskFormSchema } from "@/modules/tasks/view/forms/task/task-form.schema";
import { EditTaskModal } from "@/modules/tasks/view/modals/edit-task-modal";
import {
	formatDueDateChip,
	getDueDateChipStatus,
	utcToLocalDate,
} from "@/utils/date-utils";
import { formatRecurrencePreview } from "@/utils/format-recurrence";
import { OptimisticState } from "@/utils/types";
import { PROJECTS_DEFAULT_IDS } from "@repo/contracts/enums";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { RenderIf } from "@repo/ui/render-if";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@repo/ui/tooltip";
import { cn } from "@repo/ui/utils";
import { AlertCircle, Calendar, Loader2, Repeat } from "lucide-react";
import { useReducer } from "react";
import type { TaskRowProps } from "./task-row-types";

const PRIORITY_CLASSES = {
	high: "task-row-priority-high",
	medium: "task-row-priority-medium",
	low: "task-row-priority-low",
} as const;

export function TaskRow({
	task,
	onCheck,
	onRetry,
	projectName,
	showDescription = true,
	showDueDate = true,
	showPriority = true,
	children,
	className,
}: TaskRowProps) {
	const [isEditModalOpen, toggleIsEditModalOpen] = useReducer(
		(state) => !state,
		false,
	);

	const isPending = task.optimisticState === OptimisticState.PENDING;
	const isError = task.optimisticState === OptimisticState.ERROR;
	const priority = task.priority ?? null;
	const dueDate = task.dueDate
		? typeof task.dueDate === "string"
			? new Date(task.dueDate)
			: task.dueDate
		: null;
	const chipStatus = dueDate ? getDueDateChipStatus(dueDate) : null;
	const dueDateLabel = dueDate ? formatDueDateChip(dueDate) : null;
	const recurrenceLabel = formatRecurrencePreview(task.recurrence ?? null);
	const isRecurring = !!task.recurrence?.enabled;

	const editModalInitialValues: Partial<TTaskFormSchema> = {
		id: task.id,
		title: task.title,
		description: task.description ?? undefined,
		dueDate: dueDate ? utcToLocalDate(dueDate) : undefined,
		completed: task.completed,
		section: task.sectionId ?? PROJECTS_DEFAULT_IDS.INBOX,
		project: task.projectId ?? PROJECTS_DEFAULT_IDS.INBOX,
		priority: task.priority ?? "none",
		recurrence: task.recurrence
			? {
					enabled: task.recurrence.enabled,
					frequency: task.recurrence.frequency,
					weeklyDays: task.recurrence.weeklyDays ?? [],
					endType: task.recurrence.endType,
					endDate: task.recurrence.endDate
						? new Date(task.recurrence.endDate)
						: undefined,
					endCount: task.recurrence.endCount ?? undefined,
				}
			: { enabled: false },
	};

	const editModalHeaderMeta = {
		projectName,
		createdAt: task.createdAt,
		updatedAt: task.updatedAt,
	};

	const handleClick = () => toggleIsEditModalOpen();

	const handleRetryClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (task.id) onRetry?.(task.id);
	};

	const priorityClass =
		priority && priority in PRIORITY_CLASSES
			? PRIORITY_CLASSES[priority as keyof typeof PRIORITY_CLASSES]
			: null;

	return (
		<>
			<EditTaskModal
				isOpen={isEditModalOpen}
				onClose={toggleIsEditModalOpen}
				initialValues={editModalInitialValues}
				headerMeta={editModalHeaderMeta}
			/>
			{/* biome-ignore lint/a11y/useSemanticElements: row wrapper must stay a div (nested buttons if <button>) */}
			<div
				role="button"
				tabIndex={0}
				onClick={handleClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleClick();
					}
				}}
				className={cn(
					"task-row group relative flex items-center gap-2.5 py-2.5 pl-[18px] pr-3.5 border-b border-border/70 last:border-b-0 cursor-pointer transition-colors hover:bg-muted/50",
					priorityClass,
					isPending && "opacity-60 pointer-events-none",
					isError && "bg-destructive/5",
					className,
				)}
			>
				{/* Priority stripe (left) — visible on hover or when priority set */}
				<div
					className={cn(
						"absolute left-0 top-[7px] bottom-[7px] w-[3px] rounded-r opacity-0 transition-opacity group-hover:opacity-60",
						priority === "high" && "bg-destructive opacity-70",
						priority === "medium" && "bg-amber-500 opacity-50",
						priority === "low" && "bg-primary/60 opacity-40",
					)}
					aria-hidden
				/>

				<Checkbox
					checked={task.completed}
					onCheckedChange={(c) => {
						if (c === "indeterminate") return;
						onCheck?.(task, c);
					}}
					disabled={isPending || isError}
					onClick={(e) => e.stopPropagation()}
					aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
					className={cn(
						"h-[15px] w-[15px] shrink-0 rounded-[3px] border-[1.5px] shadow-none transition-colors [&_svg]:h-2.5 [&_svg]:w-2.5",
						"border-border bg-background data-[state=checked]:border-primary",
						"data-[state=unchecked]:hover:border-primary/60",
						(isPending || isError) && "pointer-events-none opacity-50",
					)}
				/>

				{/* Body */}
				<div className="min-w-0 flex-1">
					<div
						className={cn(
							"text-[13px] font-medium truncate",
							task.completed && "text-muted-foreground line-through",
						)}
					>
						{task.title}
					</div>
					<RenderIf
						condition={showDescription && !!task.description?.trim()}
						render={
							<div className="text-[11px] text-muted-foreground truncate mt-0.5">
								{task.description}
							</div>
						}
					/>
				</div>

				{/* Meta: date chip, recurrence indicator, priority badge, slots */}
				<div className="flex shrink-0 items-center gap-2">
					<RenderIf
						condition={isRecurring}
						render={
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span
											className="inline-flex items-center text-muted-foreground"
											aria-label={recurrenceLabel || "Recurring task"}
										>
											<Repeat className="h-3 w-3" aria-hidden />
										</span>
									</TooltipTrigger>
									<TooltipContent>
										{recurrenceLabel || "Recurring task"}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						}
					/>
					<RenderIf
						condition={showDueDate && !!dueDateLabel && !!chipStatus}
						render={
							<span
								className={cn(
									"inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium",
									chipStatus === "overdue" &&
										"bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
									chipStatus === "late" && "bg-destructive/10 text-destructive",
									chipStatus === "ok" && "bg-muted text-muted-foreground",
								)}
							>
								<Calendar className="h-3 w-3" aria-hidden />
								{dueDateLabel}
							</span>
						}
					/>

					<RenderIf
						condition={showPriority && !!priority}
						render={
							<PriorityBadge priority={priority as "high" | "medium" | "low"} />
						}
					/>
					{children}
					<RenderIf
						condition={isPending}
						render={
							<Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
						}
					/>
					<RenderIf
						condition={isError && onRetry != null}
						render={
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
								onClick={handleRetryClick}
							>
								<AlertCircle className="h-3.5 w-3.5" />
							</Button>
						}
					/>
					<RenderIf
						condition={isError && onRetry == null}
						render={<AlertCircle className="h-3.5 w-3.5 text-destructive" />}
					/>
				</div>
			</div>
		</>
	);
}
