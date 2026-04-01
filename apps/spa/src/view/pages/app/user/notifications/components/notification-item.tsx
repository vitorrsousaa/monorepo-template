import { Avatar, AvatarFallback } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { RenderIf } from "@repo/ui/render-if";
import { cn } from "@repo/ui/utils";
import {
	AlertTriangle,
	Bell,
	Calendar,
	CheckCircle2,
	DollarSign,
	MessageSquare,
	Share2,
	Target,
	X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Notification, NotificationType } from "../notifications.mock";

const TYPE_CONFIG: Record<
	NotificationType,
	{ icon: React.ElementType; color: string }
> = {
	task_due: {
		icon: Calendar,
		color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
	},
	task_overdue: {
		icon: AlertTriangle,
		color: "bg-red-500/15 text-red-600 dark:text-red-400",
	},
	task_completed: {
		icon: CheckCircle2,
		color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
	},
	goal_progress: {
		icon: Target,
		color: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
	},
	comment: {
		icon: MessageSquare,
		color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
	},
	shared_task: {
		icon: Share2,
		color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
	},
	shared_expense: {
		icon: DollarSign,
		color: "bg-green-500/15 text-green-600 dark:text-green-400",
	},
	invite: {
		icon: Share2,
		color: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
	},
	finance_budget: {
		icon: DollarSign,
		color: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
	},
	system: {
		icon: Bell,
		color: "bg-muted text-muted-foreground",
	},
};

function formatRelativeTime(date: Date): string {
	const diff = Date.now() - date.getTime();
	const minutes = Math.floor(diff / 60_000);
	const hours = Math.floor(diff / 3_600_000);

	if (minutes < 1) return "agora";
	if (minutes < 60) return `${minutes}m`;
	if (hours < 24) return `${hours}h`;
	return `${Math.floor(hours / 24)}d`;
}

interface NotificationItemProps {
	notification: Notification;
	onDismiss: (id: string) => void;
	onMarkRead: (id: string) => void;
}

export function NotificationItem({
	notification,
	onDismiss,
	onMarkRead,
}: NotificationItemProps) {
	const { t } = useTranslation();
	const { type, status, timestamp, title, metadata } = notification;
	const config = TYPE_CONFIG[type];
	const Icon = config.icon;
	const isUnread = status === "unread";
	const hasAvatar = !!metadata?.userName;

	const initials = (metadata?.userName ?? "")
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	const getBody = () => {
		switch (type) {
			case "task_due":
				return (
					<>
						<span className="font-medium">{title}</span>{" "}
						{t("notifications.types.taskDue")}
					</>
				);
			case "task_overdue":
				return (
					<>
						<span className="font-medium">{title}</span>{" "}
						{t("notifications.types.taskOverdue", {
							days: metadata?.daysOverdue ?? 1,
						})}
					</>
				);
			case "task_completed":
				return (
					<>
						<span className="font-medium">{title}</span>{" "}
						{t("notifications.types.taskCompleted")}
					</>
				);
			case "goal_progress":
				return (
					<>
						{t("notifications.types.goalProgress", {
							percent: metadata?.goalPercent ?? 0,
						})}{" "}
						— <span className="font-medium">{title}</span>
					</>
				);
			case "comment":
				return (
					<>
						<span className="font-medium">{metadata?.userName}</span>{" "}
						{t("notifications.types.comment")}{" "}
						<span className="font-medium">{title}</span>
					</>
				);
			case "shared_task":
				return (
					<>
						<span className="font-medium">{metadata?.userName}</span>{" "}
						{t("notifications.types.sharedTask")}:{" "}
						<span className="font-medium">{title}</span>
					</>
				);
			case "shared_expense":
				return (
					<>
						<span className="font-medium">{metadata?.userName}</span>{" "}
						{t("notifications.types.sharedExpense")}:{" "}
						<span className="font-medium">{title}</span>
					</>
				);
			case "finance_budget":
				return (
					<>
						{t("notifications.types.financeBudget")} —{" "}
						<span className="font-medium">{title}</span>
					</>
				);
			default:
				return <span className="font-medium">{title}</span>;
		}
	};

	return (
		<button
			type="button"
			className={cn(
				"group w-full flex items-start gap-3 p-4 border-b last:border-b-0 text-left hover:bg-muted/50 cursor-pointer transition-colors",
				isUnread && "bg-primary/[0.03]",
			)}
			onClick={() => onMarkRead(notification.id)}
		>
			<div className="relative shrink-0">
				<RenderIf
					condition={hasAvatar}
					render={
						<Avatar className="w-9 h-9">
							<AvatarFallback className={cn("text-xs", config.color)}>
								{initials}
							</AvatarFallback>
						</Avatar>
					}
					fallback={
						<div
							className={cn(
								"flex items-center justify-center w-9 h-9 rounded-xl",
								config.color,
							)}
						>
							<Icon className="w-4 h-4" />
						</div>
					}
				/>
				<RenderIf
					condition={hasAvatar}
					render={
						<span
							className={cn(
								"absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full ring-2 ring-card",
								config.color,
							)}
						>
							<Icon className="w-2.5 h-2.5" />
						</span>
					}
				/>
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-sm text-foreground leading-snug">{getBody()}</p>
				<div className="flex items-center gap-2 mt-1">
					<RenderIf
						condition={!!metadata?.projectName}
						render={
							<span className="text-xs text-muted-foreground">
								{metadata?.projectName}
							</span>
						}
					/>
					<RenderIf
						condition={!!metadata?.tag}
						render={
							<Badge
								variant="secondary"
								className={cn(
									"text-[10px] px-1.5 py-0 border-0",
									metadata?.tag?.color,
								)}
							>
								{metadata?.tag?.label}
							</Badge>
						}
					/>
				</div>
			</div>

			<div className="flex items-center gap-2 shrink-0">
				<span className="text-xs text-muted-foreground">
					{formatRelativeTime(timestamp)}
				</span>
				<Button
					size="icon"
					variant="ghost"
					className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
					aria-label={t("notifications.actions.dismiss")}
					onClick={(e) => {
						e.stopPropagation();
						onDismiss(notification.id);
					}}
				>
					<X className="w-3.5 h-3.5" />
				</Button>
				<RenderIf
					condition={isUnread}
					render={
						<span className="w-2 h-2 rounded-full bg-primary shrink-0 group-hover:hidden" />
					}
				/>
			</div>
		</button>
	);
}
