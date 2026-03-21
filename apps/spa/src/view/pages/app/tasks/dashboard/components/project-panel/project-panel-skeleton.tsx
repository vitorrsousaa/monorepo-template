const SKELETON_KEYS = [
	"skeleton-project-a",
	"skeleton-project-b",
	"skeleton-project-c",
	"skeleton-project-d",
] as const;

export const ProjectPanelSkeleton = () => {
	return (
		<div className="divide-y divide-border/70">
			{SKELETON_KEYS.map((key) => (
				<div key={key} className="px-5 py-4">
					<div className="flex items-start gap-3 mb-3">
						<div className="w-[30px] h-[30px] rounded-md bg-muted animate-pulse shrink-0" />
						<div className="flex-1 min-w-0 space-y-1.5">
							<div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
							<div className="h-2.5 w-1/2 bg-muted animate-pulse rounded" />
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="h-1 flex-1 bg-muted animate-pulse rounded-full" />
						<div className="h-3 w-7 bg-muted animate-pulse rounded" />
					</div>
					<div className="h-2.5 w-24 bg-muted animate-pulse rounded mt-1.5" />
				</div>
			))}
		</div>
	);
};
