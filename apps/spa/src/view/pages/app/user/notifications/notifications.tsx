import { Badge } from "@repo/ui/badge";
import { RenderIf } from "@repo/ui/render-if";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DateGroup } from "./components/date-group";
import { InviteNotification } from "./components/invite-notification";
import { NotificationItem } from "./components/notification-item";
import { NotificationsEmptyState } from "./components/notifications-empty-state";
import { NotificationsTopbar } from "./components/notifications-topbar";
import {
	NOTIFICATIONS_MOCK,
	type Notification,
	TASK_NOTIFICATION_TYPES,
} from "./notifications.mock";

type Tab = "all" | "tasks" | "invites";

function groupByDate(
	notifications: Notification[],
): Array<{ label: string; items: Notification[] }> {
	const invites = notifications.filter((n) => n.type === "invite");
	const nonInvites = notifications.filter((n) => n.type !== "invite");

	const todayItems = nonInvites.filter((n) => {
		const d = new Date(n.timestamp);
		const now = new Date();
		return d.toDateString() === now.toDateString();
	});

	const pastItems = nonInvites.filter((n) => {
		const d = new Date(n.timestamp);
		const now = new Date();
		return d.toDateString() !== now.toDateString();
	});

	const groups: Array<{ label: string; items: Notification[] }> = [];
	if (invites.length > 0)
		groups.push({ label: "pendingInvites", items: invites });
	if (todayItems.length > 0) groups.push({ label: "today", items: todayItems });
	if (pastItems.length > 0) groups.push({ label: "past", items: pastItems });
	return groups;
}

export function Notifications() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<Tab>("all");
	const [notifications, setNotifications] =
		useState<Notification[]>(NOTIFICATIONS_MOCK);

	const handleMarkRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, status: "read" } : n)),
		);
	};

	const handleDismiss = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const handleMarkAllRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
	};

	const handleAcceptInvite = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) =>
				n.id === id
					? { ...n, status: "read", inviteResolution: "accepted" }
					: n,
			),
		);
	};

	const handleDeclineInvite = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) =>
				n.id === id
					? { ...n, status: "read", inviteResolution: "declined" }
					: n,
			),
		);
	};

	const unreadCount = notifications.filter((n) => n.status === "unread").length;

	const filterByTab = (items: Notification[]): Notification[] => {
		if (activeTab === "tasks")
			return items.filter((n) => TASK_NOTIFICATION_TYPES.includes(n.type));
		if (activeTab === "invites")
			return items.filter((n) => n.type === "invite");
		return items;
	};

	const filtered = filterByTab(notifications);
	const groups = groupByDate(filtered);

	const taskUnread = notifications.filter(
		(n) => TASK_NOTIFICATION_TYPES.includes(n.type) && n.status === "unread",
	).length;
	const inviteUnread = notifications.filter(
		(n) => n.type === "invite" && n.status === "unread",
	).length;

	return (
		<div className="flex flex-col h-full">
			<NotificationsTopbar
				unreadCount={unreadCount}
				onMarkAllRead={handleMarkAllRead}
			/>

			<div className="flex-1 overflow-y-auto">
				<div className="max-w-[680px] mx-auto p-6 space-y-6 w-full">
					<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
						<TabsList className="mb-4">
							<TabsTrigger value="all" className="gap-1.5">
								{t("notifications.tabs.all")}
								<RenderIf
									condition={unreadCount > 0}
									render={
										<Badge
											variant="secondary"
											className="h-4 px-1.5 text-[10px] min-w-4"
										>
											{unreadCount}
										</Badge>
									}
								/>
							</TabsTrigger>
							<TabsTrigger value="tasks" className="gap-1.5">
								{t("notifications.tabs.tasks")}
								<RenderIf
									condition={taskUnread > 0}
									render={
										<Badge
											variant="secondary"
											className="h-4 px-1.5 text-[10px] min-w-4"
										>
											{taskUnread}
										</Badge>
									}
								/>
							</TabsTrigger>
							<TabsTrigger value="invites" className="gap-1.5">
								{t("notifications.tabs.invites")}
								<RenderIf
									condition={inviteUnread > 0}
									render={
										<Badge
											variant="secondary"
											className="h-4 px-1.5 text-[10px] min-w-4"
										>
											{inviteUnread}
										</Badge>
									}
								/>
							</TabsTrigger>
						</TabsList>

						{(["all", "tasks", "invites"] as Tab[]).map((tab) => (
							<TabsContent key={tab} value={tab} className="mt-0 space-y-4">
								<RenderIf
									condition={groups.length === 0}
									render={
										<div className="bg-card border rounded-xl overflow-hidden">
											<NotificationsEmptyState />
										</div>
									}
									fallback={
										<React.Fragment>
											{groups.map(({ label, items }) => (
												<div key={label} className="space-y-3">
													<DateGroup
														label={t(`notifications.dateGroups.${label}`)}
													/>
													<div className="bg-card border rounded-xl overflow-hidden">
														{items.map((notification) =>
															notification.type === "invite" ? (
																<InviteNotification
																	key={notification.id}
																	notification={notification}
																	onAccept={handleAcceptInvite}
																	onDecline={handleDeclineInvite}
																/>
															) : (
																<NotificationItem
																	key={notification.id}
																	notification={notification}
																	onDismiss={handleDismiss}
																	onMarkRead={handleMarkRead}
																/>
															),
														)}
													</div>
												</div>
											))}
										</React.Fragment>
									}
								/>
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</div>
	);
}
