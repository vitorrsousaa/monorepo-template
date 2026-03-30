const SKELETON_KEYS = [
	"skeleton-task-a",
	"skeleton-task-b",
	"skeleton-task-c",
	"skeleton-task-d",
	"skeleton-task-e",
] as const;

const WIDTHS = ["w-3/5", "w-2/3", "w-1/2", "w-3/4", "w-2/5"] as const;

export function DashboardTasksPanelSkeleton() {
	return (
		<div className="divide-y divide-border/70">
			{SKELETON_KEYS.map((key, i) => (
				<div
					key={key}
					className="flex items-center gap-2.5 py-2.5 pl-[18px] pr-3.5"
				>
					<div className="h-[15px] w-[15px] rounded-[3px] bg-muted animate-pulse shrink-0" />
					<div className="flex-1 min-w-0 space-y-1.5">
						<div
							className={`h-3 ${WIDTHS[i]} bg-muted animate-pulse rounded`}
						/>
						<div className="h-2.5 w-1/3 bg-muted animate-pulse rounded" />
					</div>
				</div>
			))}
		</div>
	);
}
