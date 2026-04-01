import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

export function NotificationsEmptyState() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			<div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted mb-4">
				<Bell className="w-6 h-6 text-muted-foreground" />
			</div>
			<p className="text-base font-semibold text-foreground">
				{t("notifications.empty.title")}
			</p>
			<p className="text-sm text-muted-foreground mt-1 max-w-xs">
				{t("notifications.empty.description")}
			</p>
		</div>
	);
}
