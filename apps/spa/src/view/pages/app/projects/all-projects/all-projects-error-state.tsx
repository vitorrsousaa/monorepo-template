import { Button } from "@repo/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AllProjectsErrorStateProps {
	onRetry: () => void;
}

export function AllProjectsErrorState(props: AllProjectsErrorStateProps) {
	const { onRetry } = props;
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center py-20 text-center">
			<div className="rounded-xl bg-destructive/10 p-4 mb-3">
				<AlertCircle className="h-6 w-6 text-destructive" />
			</div>
			<p className="text-sm font-medium text-foreground">
				{t("projects.allProjects.errorState.title")}
			</p>
			<p className="text-xs text-muted-foreground mt-1">
				{t("projects.allProjects.errorState.desc")}
			</p>
			<Button
				variant="outline"
				size="sm"
				className="mt-4 h-8 text-xs"
				onClick={onRetry}
			>
				<RefreshCw className="h-3 w-3 mr-1.5" />
				{t("projects.allProjects.errorState.retry")}
			</Button>
		</div>
	);
}
