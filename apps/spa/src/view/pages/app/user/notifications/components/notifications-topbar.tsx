import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import { Bell, CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NotificationsTopbarProps {
	unreadCount: number;
	onMarkAllRead: () => void;
}

export function NotificationsTopbar({
	unreadCount,
	onMarkAllRead,
}: NotificationsTopbarProps) {
	const { t } = useTranslation();

	return (
		<div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background px-8">
			<div className="flex items-center gap-2 text-[13px] text-muted-foreground">
				<div className="flex items-center gap-1.5">
					<Bell className="h-3.5 w-3.5" aria-hidden />
					<span className="font-medium text-foreground">
						{t("notifications.title")}
					</span>
				</div>
			</div>
			<RenderIf
				condition={unreadCount > 0}
				render={
					<Button
						size="sm"
						className="h-8 gap-1.5 rounded-md px-3 text-xs font-medium"
						onClick={onMarkAllRead}
					>
						<CheckCheck className="h-3.5 w-3.5" />
						{t("notifications.markAllRead")}
					</Button>
				}
			/>
		</div>
	);
}
