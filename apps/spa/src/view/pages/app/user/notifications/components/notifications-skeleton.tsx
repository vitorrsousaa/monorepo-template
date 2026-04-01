import { Skeleton } from "@repo/ui/skeleton";

function SkeletonItem() {
	return (
		<div className="flex items-start gap-3 p-4 border-b last:border-b-0">
			<Skeleton className="w-9 h-9 rounded-xl shrink-0" />
			<div className="flex-1 space-y-2">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
			<Skeleton className="h-3 w-10 shrink-0" />
		</div>
	);
}

export function NotificationsSkeleton() {
	return (
		<div className="bg-card border rounded-xl overflow-hidden">
			<div className="px-4 py-2 bg-muted/40 border-b">
				<Skeleton className="h-3 w-16" />
			</div>
			{Array.from({ length: 4 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
				<SkeletonItem key={i} />
			))}
		</div>
	);
}
