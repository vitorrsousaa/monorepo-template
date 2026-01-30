import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@repo/ui/button";

export interface ProjectListErrorProps {
	onRetry: () => void;
}
export const ProjectListError = (props: ProjectListErrorProps) => {
	const { onRetry } = props;

	return (
		<div className="px-2 py-4 space-y-2">
			<div className="flex items-center gap-2 text-sm text-destructive">
				<AlertCircle className="h-4 w-4" />
				<span className="text-xs">Failed to load projects</span>
			</div>
			<Button
				variant="outline"
				size="sm"
				className="w-full h-8 text-xs"
				onClick={onRetry}
			>
				<RefreshCw className="h-3 w-3 mr-1.5" />
				Try Again
			</Button>
		</div>
	);
};
