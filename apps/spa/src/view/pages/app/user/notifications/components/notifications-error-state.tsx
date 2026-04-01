import { Button } from "@repo/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NotificationsErrorStateProps {
	onRetry?: () => void;
}

export function NotificationsErrorState({
	onRetry,
}: NotificationsErrorStateProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			<div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 mb-4">
				<AlertTriangle className="w-6 h-6 text-destructive" />
			</div>
			<p className="text-base font-semibold text-foreground">
				{t("notifications.error.title")}
			</p>
			<p className="text-sm text-muted-foreground mt-1 max-w-xs">
				{t("notifications.error.description")}
			</p>
			{onRetry && (
				<Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
					{t("notifications.error.retry")}
				</Button>
			)}
		</div>
	);
}
