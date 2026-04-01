import { Avatar, AvatarFallback } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Notification } from "../notifications.mock";

interface InviteNotificationProps {
	notification: Notification;
	onAccept: (id: string) => void;
	onDecline: (id: string) => void;
}

export function InviteNotification({
	notification,
	onAccept,
	onDecline,
}: InviteNotificationProps) {
	const { t } = useTranslation();
	const { metadata, inviteResolution, status } = notification;
	const isPending = inviteResolution === "pending";
	const isUnread = status === "unread";

	const initials = (metadata?.userName ?? "?")
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<div
			className={`flex items-start gap-3 p-4 border-b last:border-b-0 border-l-[3px] transition-colors ${
				isUnread ? "bg-primary/[0.03] border-l-primary" : "border-l-transparent"
			}`}
		>
			<div className="relative shrink-0">
				<Avatar className="w-9 h-9">
					<AvatarFallback className="text-xs bg-violet-500/15 text-violet-600 dark:text-violet-400">
						{initials}
					</AvatarFallback>
				</Avatar>
				<span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-violet-500 ring-2 ring-card">
					<Users className="w-2.5 h-2.5 text-white" />
				</span>
			</div>

			<div className="flex-1 min-w-0 space-y-2">
				<div>
					<p className="text-sm text-foreground">
						<span className="font-semibold">{metadata?.userName}</span>{" "}
						{t("notifications.types.invite")}{" "}
						<span className="font-semibold">
							{metadata?.inviteData?.groupName}
						</span>
					</p>
					<RenderIf
						condition={!!metadata?.inviteData}
						render={
							<div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
								<span>{metadata?.inviteData?.memberCount} membros</span>
								<span>·</span>
								<span className="text-muted-foreground/70">
									{new Date(notification.timestamp).toLocaleDateString(
										"pt-BR",
										{
											day: "numeric",
											month: "short",
											hour: "2-digit",
											minute: "2-digit",
										},
									)}
								</span>
							</div>
						}
					/>
				</div>

				<RenderIf
					condition={isPending}
					render={
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								className="h-7 text-xs px-3"
								onClick={() => onAccept(notification.id)}
							>
								{t("notifications.actions.accept")}
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="h-7 text-xs px-3"
								onClick={() => onDecline(notification.id)}
							>
								{t("notifications.actions.decline")}
							</Button>
						</div>
					}
				/>

				<RenderIf
					condition={inviteResolution === "accepted"}
					render={
						<Badge
							variant="secondary"
							className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0"
						>
							{t("notifications.inviteStatus.joined")}
						</Badge>
					}
				/>

				<RenderIf
					condition={inviteResolution === "declined"}
					render={
						<Badge
							variant="secondary"
							className="text-xs bg-muted text-muted-foreground border-0"
						>
							{t("notifications.inviteStatus.declined")}
						</Badge>
					}
				/>
			</div>

			<RenderIf
				condition={isUnread}
				render={
					<span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-primary" />
				}
			/>
		</div>
	);
}
