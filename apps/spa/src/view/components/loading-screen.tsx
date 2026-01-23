import { Skeleton } from "@repo/ui/skeleton";

export function LoadingScreen() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
				<div className="flex items-center space-x-2">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					<span className="text-lg font-medium">Loading...</span>
				</div>
				<div className="w-full space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-4/6" />
				</div>
			</div>
		</div>
	);
}
