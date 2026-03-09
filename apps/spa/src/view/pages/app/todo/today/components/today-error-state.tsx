import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

type TodayErrorStateProps = {
	onRetry: () => void;
};

export function TodayErrorState({ onRetry }: TodayErrorStateProps) {
	return (
		<div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
			<Alert variant="destructive" className="max-w-md">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error loading today&apos;s tasks</AlertTitle>
				<AlertDescription>
					Could not load your tasks. Check your connection and try again.
				</AlertDescription>
				<Button
					variant="outline"
					size="sm"
					className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10"
					onClick={onRetry}
				>
					<RefreshCw className="h-4 w-4 mr-2" />
					Try again
				</Button>
			</Alert>
		</div>
	);
}
