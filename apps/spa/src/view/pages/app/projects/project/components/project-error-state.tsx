import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ProjectErrorStateProps {
	onRetry: () => void;
}

export function ProjectErrorState(props: ProjectErrorStateProps) {
	const { onRetry } = props;

	return (
		<div className="flex items-center justify-center min-h-[400px] px-4">
			<Alert variant="destructive" className="max-w-md w-full ">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error loading project</AlertTitle>
				<AlertDescription>
					Could not load this project. Check your connection and try again.
				</AlertDescription>
				<Button
					variant="outline"
					size="sm"
					className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10"
					onClick={onRetry}
				>
					<RefreshCw className="h-4 w-4 mr-2" /> Try again
				</Button>
			</Alert>
		</div>
	);
}
