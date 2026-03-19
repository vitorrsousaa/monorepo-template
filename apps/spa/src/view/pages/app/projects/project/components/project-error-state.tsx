import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProjectErrorStateProps {
	onRetry: () => void;
}

export function ProjectErrorState(props: ProjectErrorStateProps) {
	const { onRetry } = props;
	const { t } = useTranslation();

	return (
		<div className="flex items-center justify-center min-h-[400px] px-4">
			<Alert variant="destructive" className="max-w-md w-full ">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>{t("projects.error.title")}</AlertTitle>
				<AlertDescription>{t("projects.error.desc")}</AlertDescription>
				<Button
					variant="outline"
					size="sm"
					className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10"
					onClick={onRetry}
				>
					<RefreshCw className="h-4 w-4 mr-2" /> {t("common.retry")}
				</Button>
			</Alert>
		</div>
	);
}
