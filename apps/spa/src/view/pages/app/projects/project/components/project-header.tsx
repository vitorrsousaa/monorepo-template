import { cn } from "@repo/ui/utils";
import { Calendar, Clock } from "lucide-react";

type ProjectHeaderProps = {
	name: string;
	description?: string | null;
	completedCount: number;
	totalCount: number;
	progressColor?: string;
	deadlineLabel?: string | null;
	statusLabel?: string | null;
	percentageCompleted: number;
};

export function ProjectHeader(props: ProjectHeaderProps) {
	const {
		name,
		description,
		completedCount,
		totalCount,
		progressColor,
		deadlineLabel,
		statusLabel,
		percentageCompleted,
	} = props;
	const remaining = totalCount - completedCount;

	return (
		<header className="mb-7">
			<div className="mb-1.5 flex items-center gap-3">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					{name}
				</h1>
			</div>
			{description && (
				<p className="mb-4 pl-[38px] text-[13px] text-muted-foreground">
					{description}
				</p>
			)}

			{/* Progress block */}
			<div className="flex items-center gap-5 rounded-xl border border-border bg-card px-5 py-4">
				<div className="shrink-0">
					<div
						className="text-[28px] font-bold leading-none tracking-tight text-primary"
						style={progressColor ? { color: progressColor } : undefined}
					>
						{percentageCompleted}%
					</div>
					<div className="mt-0.5 text-[11px] text-muted-foreground">
						completed
					</div>
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
						<span>
							{completedCount} of {totalCount} tasks done
						</span>
						<span>{remaining} remaining</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
						<div
							className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
							style={{
								width: `${percentageCompleted}%`,
								...(progressColor && { backgroundColor: progressColor }),
							}}
						/>
					</div>
					<div className="mt-2 flex gap-4">
						<span
							className={cn(
								"flex items-center gap-1 text-[11px] text-muted-foreground",
							)}
						>
							<Calendar className="h-2.5 w-2.5" aria-hidden />
							{deadlineLabel ?? "No deadline set"}
						</span>
						<span
							className={cn(
								"flex items-center gap-1 text-[11px] text-muted-foreground",
							)}
						>
							<Clock className="h-2.5 w-2.5" aria-hidden />
							{statusLabel ?? "Active"}
						</span>
					</div>
				</div>
			</div>
		</header>
	);
}
