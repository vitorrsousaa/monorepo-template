import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { AlertCircle } from "lucide-react";

type InboxErrorStateProps = {
	onRetry: () => void;
};

export const InboxErrorState = (props: InboxErrorStateProps) => {
	const { onRetry } = props;
	return (
		<Alert variant="destructive" className="mt-4">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Error loading inbox</AlertTitle>
			<AlertDescription>
				Could not load your tasks. Check your connection and try again.
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
	);
};
