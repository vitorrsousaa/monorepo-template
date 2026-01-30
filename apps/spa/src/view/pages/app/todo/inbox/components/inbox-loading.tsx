import { Card } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

export const InboxLoadingSkeleton = () => {
	return (
		<div className="space-y-2">
			{Array.from({ length: 5 }).map((_, i) => (
				<Card
					key={`inbox-loading-${i}-#${Math.random().toString(36).substring(2, 15)}`}
					className="p-4 bg-card border-border"
				>
					<div className="flex items-center gap-4">
						<Skeleton className="h-5 w-5 rounded border-2 shrink-0" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-5 w-3/4 max-w-sm" />
							<div className="flex gap-2">
								<Skeleton className="h-5 w-20 rounded-full" />
								<Skeleton className="h-5 w-16 rounded-full" />
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
};
