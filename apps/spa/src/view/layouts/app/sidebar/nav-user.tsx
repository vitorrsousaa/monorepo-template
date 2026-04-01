import { NOTIFICATIONS_MOCK } from "@/pages/app/user/notifications/notifications.mock";
import { BadgeCheck, Bell, LogOut, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback } from "@repo/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@repo/ui/sidebar";

import { ROUTES } from "@/config/routes";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";

export function NavUser() {
	const { isMobile } = useSidebar();
	const navigate = useNavigate();
	const { user, signout } = useAuth();
	const { t } = useTranslation();

	const handleNavigateToProfile = () => {
		navigate(ROUTES.USER.PROFILE);
	};

	const handleNavigateToSettings = () => {
		navigate(ROUTES.USER.SETTINGS);
	};

	const handleNavigateToNotifications = () => {
		navigate(ROUTES.USER.NOTIFICATIONS);
	};

	const unreadCount = NOTIFICATIONS_MOCK.filter(
		(n) => n.status === "unread",
	).length;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
						>
							<Avatar className="h-7 w-7 shrink-0">
								<AvatarFallback className="text-xs bg-primary text-primary-foreground">
									MC
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 text-left min-w-0">
								<p className="text-sm font-medium text-sidebar-foreground truncate">
									{user?.name}
								</p>
								<p className="text-xs text-sidebar-foreground/50 truncate">
									{user?.email}
								</p>
							</div>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg w-52"
						side={isMobile ? "bottom" : "right"}
					>
						<DropdownMenuItem onSelect={handleNavigateToProfile}>
							<BadgeCheck className="w-4 h-4 mr-2" />
							{t("common.navUser.profile")}
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={handleNavigateToNotifications}>
							<Bell className="w-4 h-4 mr-2" />
							{t("common.navUser.notifications")}
							{unreadCount > 0 && (
								<span className="ml-auto flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
									{unreadCount}
								</span>
							)}
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={handleNavigateToSettings}>
							<Settings className="w-4 h-4 mr-2" />
							{t("common.navUser.settings")}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={signout}
						>
							<LogOut className="w-4 h-4 mr-2" />
							{t("common.navUser.logout")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
