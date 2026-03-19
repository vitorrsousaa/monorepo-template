import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

type TodayErrorStateProps = {
	onRetry: () => void;
};

export function TodayErrorState({ onRetry }: TodayErrorStateProps) {
	const { t } = useTranslation();

	return (
		<div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
			<Alert variant="destructive" className="max-w-md">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>{t("tasks.today.errorTitle")}</AlertTitle>
				<AlertDescription>{t("tasks.today.errorDesc")}</AlertDescription>
				<Button
					variant="outline"
					size="sm"
					className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10"
					onClick={onRetry}
				>
					<RefreshCw className="h-4 w-4 mr-2" />
					{t("common.retry")}
				</Button>
			</Alert>
		</div>
	);
}
