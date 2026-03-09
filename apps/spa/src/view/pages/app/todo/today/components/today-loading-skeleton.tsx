import { Card } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

function ColumnSkeleton() {
	return (
		<div className="flex-shrink-0 w-80 flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between mb-4 flex-shrink-0">
				<div className="flex items-center gap-2">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-5 w-8 rounded-full" />
				</div>
				<Skeleton className="h-8 w-8 rounded" />
			</div>

			{/* Cards */}
			<div className="flex-1 space-y-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i} className="p-4 bg-card border-border">
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<Skeleton className="h-5 w-5 rounded shrink-0" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-5 w-full max-w-[200px]" />
									<Skeleton className="h-4 w-3/4 max-w-[160px]" />
								</div>
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-4 w-16 rounded" />
								<Skeleton className="h-4 w-12 rounded" />
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Add task button skeleton */}
			<div className="mt-3 flex items-center gap-2 flex-shrink-0">
				<Skeleton className="h-4 w-4 rounded" />
				<Skeleton className="h-4 w-20" />
			</div>
		</div>
	);
}

export function TodayLoadingSkeleton() {
	return (
		<div className="p-6 flex gap-4" style={{ minWidth: "max-content" }}>
			{Array.from({ length: 4 }).map((_, i) => (
				<ColumnSkeleton key={i} />
			))}
		</div>
	);
}
