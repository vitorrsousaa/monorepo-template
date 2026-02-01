import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { AlertCircle } from "lucide-react";

interface ProjectErrorStateProps {
	onRetry: () => void;
}

export function ProjectErrorState(props: ProjectErrorStateProps) {
	const { onRetry } = props;

	return (
		<div className="flex items-center justify-center min-h-[400px] px-4">
			<Card className="max-w-md w-full p-6 border-destructive/30">
				<Alert variant="destructive">
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
						Try again
					</Button>
				</Alert>
			</Card>
		</div>
	);
}
