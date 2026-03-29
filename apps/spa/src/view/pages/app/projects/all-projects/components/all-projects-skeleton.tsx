const SKELETON_KEYS = [
	"skeleton-project-a",
	"skeleton-project-b",
	"skeleton-project-c",
] as const;

export function AllProjectsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{SKELETON_KEYS.map((key) => (
				<div
					key={key}
					className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
				>
					<div className="h-[3px] w-full bg-muted animate-pulse" />
					<div className="flex flex-1 flex-col gap-4 px-5 pb-4 pt-4">
						<div className="flex items-start gap-3">
							<div className="h-9 w-9 shrink-0 rounded-md bg-muted animate-pulse" />
							<div className="flex-1 min-w-0 space-y-1.5">
								<div className="h-3.5 w-2/3 bg-muted animate-pulse rounded" />
								<div className="h-2.5 w-1/2 bg-muted animate-pulse rounded" />
							</div>
						</div>
						<div className="mt-auto space-y-1.5">
							<div className="flex items-baseline justify-between">
								<div className="h-5 w-10 bg-muted animate-pulse rounded" />
								<div className="h-2.5 w-20 bg-muted animate-pulse rounded" />
							</div>
							<div className="h-1 w-full bg-muted animate-pulse rounded-full" />
							<div className="h-2.5 w-16 bg-muted animate-pulse rounded" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
