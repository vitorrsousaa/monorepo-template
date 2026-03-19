import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type InboxErrorStateProps = {
	onRetry: () => void;
};

export const InboxErrorState = (props: InboxErrorStateProps) => {
	const { onRetry } = props;
	const { t } = useTranslation();

	return (
		<Alert variant="destructive" className="mt-4">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>{t("tasks.inbox.errorTitle")}</AlertTitle>
			<AlertDescription>{t("tasks.inbox.errorDesc")}</AlertDescription>
			<Button
				variant="outline"
				size="sm"
				className="mt-3 border-destructive/50 text-destructive hover:bg-destructive/10"
				onClick={onRetry}
			>
				{t("common.retry")}
			</Button>
		</Alert>
	);
};
