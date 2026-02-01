import { Card } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { GripVertical } from "lucide-react";

/** Stable keys for skeleton items - never use array index as key */
const SECTION_SKELETON_KEYS = [
	"project-skeleton-section-a",
	"project-skeleton-section-b",
	"project-skeleton-section-c",
] as const;

const TODO_SKELETON_KEYS = [
	"project-skeleton-todo-x",
	"project-skeleton-todo-y",
] as const;

export function ProjectLoadingSkeleton() {
	return (
		<div className="h-full w-full flex flex-col bg-background overflow-hidden">
			{/* Header skeleton */}
			<div className="flex-shrink-0 border-b border-border px-8 py-6">
				<div className="flex items-center gap-3 mb-2">
					<Skeleton className="h-10 w-10 rounded-lg shrink-0" />
					<Skeleton className="h-9 w-64" />
				</div>
				<Skeleton className="h-5 w-full max-w-md mb-4" />
				<div className="flex items-center gap-4">
					<Skeleton className="h-4 w-32" />
					<div className="flex-1 max-w-xs h-2 bg-muted rounded-full overflow-hidden">
						<Skeleton className="h-full w-1/3" />
					</div>
				</div>
			</div>

			{/* Sections skeleton */}
			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="p-8 space-y-6">
					{SECTION_SKELETON_KEYS.map((sectionKey) => (
						<div key={sectionKey}>
							<div className="flex items-center gap-3 mb-3">
								<GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
								<Skeleton className="h-6 w-28" />
								<Skeleton className="h-5 w-8 rounded-full" />
							</div>
							<div className="space-y-2">
								{TODO_SKELETON_KEYS.map((todoKey) => (
									<Card
										key={`${sectionKey}-${todoKey}`}
										className="p-3 bg-card border-border"
									>
										<div className="flex items-center gap-4">
											<Skeleton className="h-5 w-5 rounded border-2 shrink-0" />
											<div className="flex-1 space-y-2">
												<Skeleton className="h-5 w-3/4 max-w-sm" />
												<div className="flex gap-2">
													<Skeleton className="h-4 w-16" />
													<Skeleton className="h-5 w-14 rounded-full" />
												</div>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
