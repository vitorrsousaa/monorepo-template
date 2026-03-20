import { formatDueDateChip, getDueDateChipStatus } from "@/utils/date-utils";
import type { Task } from "@repo/contracts/tasks/entities";
import { cn } from "@repo/ui/utils";
import { Calendar } from "lucide-react";

export type TaskRowProps = {
	task: Task;
	/** Called when the row (or checkbox) is activated. */
	onClick?: (task: Task) => void;
	/** Called when completion state should toggle. If not provided, row still shows checkbox but no action. */
	onCheck?: (task: Task, checked: boolean) => void;
	/** Show description/subtitle line. Default true. */
	showDescription?: boolean;
	/** Show due date chip. Default true when task has dueDate. */
	showDueDate?: boolean;
	/** Show priority badge. Default true when task has priority. */
	showPriority?: boolean;
	/** Optional extra content to render after date/priority (e.g. menu). */
	children?: React.ReactNode;
	className?: string;
};

const PRIORITY_CLASSES = {
	high: "task-row-priority-high",
	medium: "task-row-priority-medium",
	low: "task-row-priority-low",
} as const;

function CheckIcon() {
	return (
		<svg
			width="7"
			height="4"
			viewBox="0 0 7 4"
			fill="none"
			className="text-white"
			aria-hidden
		>
			<path
				d="M1 2L2.5 3.5L6 0.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function PriorityBarsIcon({ level }: { level: "high" | "medium" | "low" }) {
	const paths =
		level === "high"
			? "M1 8V2M4.5 8V4M8 8V2"
			: level === "medium"
				? "M1 8V4M4.5 8V1M8 8V5"
				: "M1 8V6M4.5 8V4M8 8V6";
	return (
		<svg
			width="9"
			height="9"
			viewBox="0 0 9 9"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			aria-hidden
		>
			<path d={paths} />
		</svg>
	);
}

export function TaskRow({
	task,
	onClick,
	onCheck,
	showDescription = true,
	showDueDate = true,
	showPriority = true,
	children,
	className,
}: TaskRowProps) {
	const priority = task.priority ?? null;
	const dueDate = task.dueDate
		? typeof task.dueDate === "string"
			? new Date(task.dueDate)
			: task.dueDate
		: null;
	const chipStatus = dueDate ? getDueDateChipStatus(dueDate) : null;
	const dueDateLabel = dueDate ? formatDueDateChip(dueDate) : null;

	const handleClick = () => onClick?.(task);
	const handleCheck = (e: React.MouseEvent) => {
		e.stopPropagation();
		onCheck?.(task, !task.completed);
	};

	const priorityClass =
		priority && priority in PRIORITY_CLASSES
			? PRIORITY_CLASSES[priority as keyof typeof PRIORITY_CLASSES]
			: null;

	return (
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

			{/* Checkbox */}
			<button
				type="button"
				onClick={handleCheck}
				className={cn(
					"flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border-[1.5px] transition-colors",
					task.completed
						? "border-primary bg-primary text-primary-foreground"
						: "border-border bg-background hover:border-primary/60",
				)}
				aria-pressed={task.completed}
				aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
			>
				{task.completed && <CheckIcon />}
			</button>

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
				{showDescription && task.description?.trim() && (
					<div className="text-[11px] text-muted-foreground truncate mt-0.5">
						{task.description}
					</div>
				)}
			</div>

			{/* Meta: date chip, priority badge, slots */}
			<div className="flex shrink-0 items-center gap-2">
				{showDueDate && dueDateLabel && chipStatus && (
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
				)}
				{showPriority && priority && (
					<span
						className={cn(
							"inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
							priority === "high" && "bg-destructive/10 text-destructive",
							priority === "medium" &&
							"bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
							priority === "low" && "bg-primary/10 text-primary",
						)}
					>
						<PriorityBarsIcon level={priority} />
						{priority}
					</span>
				)}
				{children}
			</div>
		</div>
	);
}